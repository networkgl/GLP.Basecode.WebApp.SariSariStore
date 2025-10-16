// import the variables and function from module.js
import { startScanner, stopScanner, closeSidebar, scanned, currentScannedCode, currentListItem, setZoom } from './cameraManager.js';

document.getElementById("product-form").addEventListener("submit", async function (e) {
  e.preventDefault();

  // Collect form values
  const productData = {
    Barcode: document.getElementById("sidebar-barcode").value.trim(),
    ProductName: document.getElementById("sidebar-name").value.trim(),
    Price: parseFloat(document.getElementById("sidebar-price").value),
    CategoryId: parseInt(document.getElementById("sidebar-category").value) 
  };


  if (!productData.Barcode || !productData.ProductName || isNaN(productData.Price) || isNaN(productData.CategoryId)) {
    alert("Please fill in all fields correctly.");

    return;
    }

    const submitBtn = document.getElementById("submit-btn");
    const spinner = document.getElementById("spinner");
    const btnText = document.getElementById("btn-text");

    submitBtn.disabled = true;
    spinner.classList.remove("hidden");
    btnText.innerHTML = "Saving...";

    try {
        const response = await fetch("https://glp-basecode-api-sarisaristore.onrender.com/api/product/addProduct", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(productData)
        });

    // Check if request failed
    if (!response.ok) {
      const errorMessage = await response.text(); 
      await stopScanner();
      await startScanner(); 
      throw new Error(`Server error: ${response.status} - ${errorMessage}`);
    }

    // Parse JSON response
    const result = await response.json();
    console.log("API Response:", result);

  

    alert("Product saved successfully!");


    // Clear form & close sidebar
    e.target.reset();
    closeSidebar();

    setZoom(1); //reset the zoom safely



    // ✅ Remove the list item from the scanned list
    if (currentListItem) {
        currentListItem.remove();    
        scanned.delete(currentScannedCode);
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
