document.addEventListener("DOMContentLoaded", async function () {
    try {
        const response = await fetch("https://glp-basecode-api-sarisaristore.onrender.com/api/product/getAllProduct");
        if (!response.ok) throw new Error(`Failed to fetch products with category: ${response.status}`);

        const result = await response.json();  // check structure
        console.log("Products with categories response:", result);

        const product = result.data; // update based on actual structure

        const tbody = document.querySelector("#export-table tbody");
        tbody.innerHTML = ""; // Clear any existing rows

        product.forEach((item) => {
            const tr = document.createElement("tr");
            tr.className =
            "hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer";

            tr.innerHTML = `
            <td class="font-medium text-gray-900 whitespace-nowrap dark:text-white">
                ${item.productName}
            </td>
            <td>${item.categoryName}</td>
            <td>${item.barcode}</td>
            <td>${item.price}</td>
            `;

            tbody.appendChild(tr);
        });

    } catch (err) {
        console.error("Error loading categories:", err);
        alert("❌ Failed to load categories.\n" + err.message);
    }

});
