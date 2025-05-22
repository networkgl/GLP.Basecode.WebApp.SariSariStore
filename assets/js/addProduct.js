// import the variables and function from module.js
import { startScanner, stopScanner, closeSidebar, scanned, currentScannedCode, currentListItem, setZoom } from './cameraManager.js';

document.getElementById("product-form").addEventListener("submit", async function (e) {
  e.preventDefault();

  // Collect form values
  const productData = {
    Barcode: document.getElementById("sidebar-barcode").value.trim(),
    ProductName: document.getElementById("sidebar-name").value.trim(),
    Price: parseFloat(document.getElementById("sidebar-price").value),
    CategoryId: parseInt(document.getElementById("sidebar-category").value) // Must be a number
  };


  // Basic validation (optional)
  if (!productData.Barcode || !productData.ProductName || isNaN(productData.Price) || isNaN(productData.CategoryId)) {
    alert("Please fill in all fields correctly.");

    return;
    }

    const submitBtn = document.getElementById("submit-btn");
    const spinner = document.getElementById("spinner");
    const btnText = document.getElementById("btn-text");

    submitBtn.disabled = true;
    spinner.classList.remove("hidden");
    btnText.innerHTML = "Loading...";

    try {
        const response = await fetch("https://cafd-143-44-165-100.ngrok-free.app/api/product/addProduct", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(productData)
    });

    // Check if request failed
    if (!response.ok) {
      const errorMessage = await response.text(); // get error message from API if any
      throw new Error(`Server error: ${response.status} - ${errorMessage}`);
      await stopScanner();
      await startScanner(); // restart after add
    }

    // Parse JSON response
    const result = await response.json();
    console.log("API Response:", result);

  

    alert("✅ Product saved successfully!");


    // Optional: Clear form & close sidebar
    e.target.reset();
    closeSidebar();

    setZoom(1); // ✅ reset the zoom safely



    // ✅ Remove the list item from the scanned list
    if (currentListItem) {
        currentListItem.remove();    // correct way to remove list item
        scanned.delete(currentScannedCode); // Clean from Set if using one
    }


  } catch (err) {
    console.error("Failed to save product:", err);
    alert(`❌ Failed to save product. Please try again.\n\nDetails: ${err.message}`);
    await stopScanner();
    await startScanner(); // restart after add
   } finally {
        submitBtn.disabled = false;
        spinner.classList.add("hidden");
        btnText.innerHTML = "Save Product";
   }

});
