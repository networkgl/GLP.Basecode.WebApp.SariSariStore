import { loadCategories } from './loadCategories.js' 

let html5QrCode = null;
let cameraId = null;
let currentZoom = 1;
let torchOn = false;
const scanned = new Map();
let scanningPaused = false;

const scannedList = document.getElementById("scanned-list");
const zoomInLabel = document.getElementById("zoom-in-level");
const zoomOutLabel = document.getElementById("zoom-out-level");


//modal display
const modalProductDisplay = document.getElementById("display_product_modal");
const displayProductName = document.getElementById("display-name");
const displayCategory = document.getElementById("display-category");
const displayBCode = document.getElementById("display-barcode");
const displayPrice = document.getElementById("display-price");
const btnCloseProductDisplay = document.getElementById("btnCloseProductDisplay");


function createListItem(code) {
    const li = document.createElement("li");
    li.className = "flex justify-between items-center";

    const span = document.createElement("span");
    span.textContent = code;
    span.className = "break-all";

    const btnGroup = document.createElement("div");
    btnGroup.className = "flex space-x-2";

    const addBtn = document.createElement("button");
    addBtn.textContent = "Add";
    addBtn.className =
    "bg-green-600 hover:bg-green-700 text-white text-sm font-semibold py-2 px-2 rounded";
    addBtn.onclick = async () => {
        openSidebarWithBarcode(code, li) // Pass scanned code to sidebar
    //   alert(`Add product with barcode: ${code}`);
    };

    const delBtn = document.createElement("button");
    delBtn.textContent = "Delete";
    delBtn.className =
    "bg-red-600 hover:bg-red-700 text-white text-sm font-semibold py-2 px-2 rounded";
    delBtn.onclick = () => {
    scannedList.removeChild(li);
    scanned.delete(code);
    };

    btnGroup.appendChild(addBtn);
    btnGroup.appendChild(delBtn);
    li.appendChild(span);
    li.appendChild(btnGroup);
    return li;
}
function playBeepFound() {
    const context = new (window.AudioContext || window.webkitAudioContext)();

    const oscillator = context.createOscillator();
    oscillator.type = "sine"; // smoother tone
    oscillator.frequency.setValueAtTime(600, context.currentTime); // lower frequency
    oscillator.connect(context.destination);
    oscillator.start();
    oscillator.stop(context.currentTime + 0.3); // play for 300ms
}


function playBeep() {
    const context = new (window.AudioContext || window.webkitAudioContext)();

    const oscillator = context.createOscillator();
    oscillator.type = "square"; // or 'sine'
    oscillator.frequency.setValueAtTime(1000, context.currentTime); // beep frequency
    oscillator.connect(context.destination);
    oscillator.start();
    oscillator.stop(context.currentTime + 0.1); // play for 100ms
}

async function onScanSuccess(decodedText, decodedResult) {
    if (scanningPaused || scanned.has(decodedText)) return;
    scanningPaused = true;

    try {
        const response = await fetch(`https://glp-basecode-api-sarisaristore.onrender.com/api/product/getProductByBarcode/${encodeURIComponent(decodedText)}`);

        if (response.ok) {
            stopScanner();

            // Product already exists in DB
            const result = await response.json();
            const product = result.data;

            playBeepFound();

            // await Swal.fire({
            //     icon: 'info',
            //     title: 'Product Found',
            //     html: `
            //     <div class="text-left space-y-1 text-sm">
            //         <p><strong>Category:</strong> <span class="text-gray-700">${product.categoryName}</span></p>
            //         <p><strong>Barcode:</strong> <span class="bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded font-semibold">${product.barcode}</span></p>
            //         <p><strong>Product Name:</strong> <span class="text-gray-800">${product.productName}</span></p>
            //         <p><strong>Price:</strong> <span class="text-green-600 font-bold">₱ ${parseFloat(product.price).toFixed(2)}</span></p>
            //     </div>
            //   `,
            //     confirmButtonText: 'OK'
            // }).then((result) => {


            //     /* Read more about isConfirmed, isDenied below */
            //     if (result.isConfirmed) {
            //         startScanner();

            //         torchOn = false;
            //         currentZoom = 1;
            //         zoomInLabel.textContent = `Zoom In: ${currentZoom}x`;
            //         zoomOutLabel.textContent = `Zoom Out: ${currentZoom}x`;
            //     }
            // });

            displayProductName.innerText = product.productName;
            displayBCode.innerText = product.barcode;
            displayCategory.innerText = product.categoryName;
            displayPrice.innerText = `₱ ${parseFloat(product.price).toFixed(2)}`;
            modalProductDisplay.showModal();

            btnCloseProductDisplay.addEventListener('click', () => {
                startScanner();

                torchOn = false;
                currentZoom = 1;
                zoomInLabel.textContent = `Zoom In: ${currentZoom}x`;
                zoomOutLabel.textContent = `Zoom Out: ${currentZoom}x`;
            })



            scanningPaused = false;
            return; // 🔴 Don't proceed to add it to the list
        }
        else {
            // If it reaches here, it means product was NOT found
            scanned.set(decodedText, true);
            playBeep();

            const li = createListItem(decodedText);
            scannedList.insertBefore(li, scannedList.firstChild);
        }

        // If not found, that means new product (shouldn't happen because 404 will be thrown)
    } catch (error) {
        console.error("Fetch failed:", error);

    } finally {
        // Ensure scanner resumes even if something goes wrong
        setTimeout(() => {
            scanningPaused = false;
        }, 1000);
    }

}

async function startScanner() {
    if (!html5QrCode) html5QrCode = new Html5Qrcode("reader");


    try {
    const devices = await Html5Qrcode.getCameras();
    if (devices && devices.length > 0) {
        const backCam = devices.find((d) =>
        d.label.toLowerCase().includes("back")
        );
        cameraId = backCam ? backCam.id : devices[0].id;

        await html5QrCode.start(
        cameraId,
        {
            fps: 30,
            qrbox: function(viewfinderWidth, viewfinderHeight) {
                const boxWidth = Math.floor(viewfinderWidth * 0.8); // 80% of width
                const boxHeight = Math.floor(boxWidth * 0.40); // 4:1 width-to-height ratio
                return {
                    width: boxWidth,
                    height: boxHeight
                };
            },

            aspectRatio: 1.0,
            rememberLastUsedCamera: true,
            experimentalFeatures: {
            useBarCodeDetectorIfSupported: true,
            },
        },
        onScanSuccess
        );

        // Wait a bit for DOM to update
        setTimeout(() => {
            const video = document.querySelector("video");
            if (video) {
            video.style.width = "100%";
            video.style.height = "inherit";
            video.style.objectFit = "cover";
            }
        }, 100); // 100ms delay usually sufficient

        document.getElementById("start-scan-btn").classList.add("hidden");

        document.getElementById("zoom-in-btn").classList.remove("hidden");
        document.getElementById("zoom-out-btn").classList.remove("hidden");
        document.getElementById("toggle-torch-btn").classList.remove("hidden");
    }
    } catch (err) {
    console.error("Scanner start failed:", err);
    }
}

async function stopScanner() {
    if (html5QrCode) {
    await html5QrCode.stop();
    html5QrCode.clear();
    html5QrCode = null;
    }
}


// Constants for zoom limits
const MIN_ZOOM = 1;
const MAX_ZOOM = 3;

// Centralized function to apply zoom
async function applyZoom(newZoom) {
    if (!html5QrCode || !html5QrCode.getRunningTrackSettings) return;
    const settings = html5QrCode.getRunningTrackSettings();

    if (settings.zoom === undefined) {
        alert("Zoom is not supported on this device.");
        return;
    }

    if (newZoom < MIN_ZOOM || newZoom > MAX_ZOOM) {
        console.warn(`Zoom level ${newZoom}x is out of bounds.`);
        return;
    }

    try {
        await html5QrCode.applyVideoConstraints({
            advanced: [{ zoom: newZoom }],
        });

        currentZoom = newZoom;
        // Update label for both directions
        if (zoomInLabel) zoomInLabel.textContent = `Zoom In: ${currentZoom}x`;
        if (zoomOutLabel) zoomOutLabel.textContent = `Zoom Out: ${currentZoom}x`;

    } catch (e) {
        console.warn("Zoom failed:", e);
    }
}

// 🔍 Zoom In handling
document.getElementById("zoom-in-btn").addEventListener("click", () => {
    const newZoom = currentZoom + 1;
    applyZoom(newZoom);
});

// 🔍 Zoom Out handling
document.getElementById("zoom-out-btn").addEventListener("click", () => {
    const newZoom = currentZoom - 1;
    applyZoom(newZoom);
});

// 🔦 Flashlight toggle
document
    .getElementById("toggle-torch-btn")
    .addEventListener("click", async () => {
    if (!html5QrCode || !html5QrCode.getRunningTrackSettings) return;
    const settings = html5QrCode.getRunningTrackSettings();

    try {
        torchOn = !torchOn;
        await html5QrCode.applyVideoConstraints({
        advanced: [{ torch: torchOn }],
        });
    } catch (e) {
        console.warn("Torch toggle failed:", e);
        alert("Flashlight is not supported on this device.");
    }
    });

document
    .getElementById("start-scan-btn")
    .addEventListener("click", startScanner);

const sidebar = document.getElementById("product-sidebar");
const overlay = document.getElementById("sidebar-overlay");
const barcodeInput = document.getElementById("sidebar-barcode");


let currentScannedCode = null;
let currentListItem = null;

function openSidebarWithBarcode(code, li) {
    barcodeInput.value = code;

    //
    currentScannedCode = code;
    currentListItem = li;

    sidebar.classList.remove("translate-x-full");
    overlay.classList.remove("hidden");
    loadCategories();
    stopScanner();
}

function closeSidebar() {
    sidebar.classList.add("translate-x-full");
    overlay.classList.add("hidden");

    startScanner(); // restart after add

}

// Clicking outside closes the sidebar
overlay.addEventListener("click", closeSidebar);

function setZoom(value) {
    currentZoom = value;
    zoomInLabel.textContent = `Zoom In: ${value}x`;   
    zoomOutLabel.textContent = `Zoom Out: ${value}x`;   
}

// exporting variables and function
export {
    startScanner, stopScanner, closeSidebar, scanned, currentScannedCode, currentListItem, setZoom
};
