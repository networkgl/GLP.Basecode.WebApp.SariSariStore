// JavaScript
async function loadCategories() {
    try {
        const response = await fetch("https://glp-basecode-api-sarisaristore.onrender.com/api/category/getAllCategory");
        if (!response.ok) throw new Error(`Failed to fetch categories: ${response.status}`);

        const result = await response.json();  
        console.log("Categories response:", result);

        const categories = result.data; 

        if (!Array.isArray(categories)) {
            throw new Error("Expected 'data' to be an array.");
        }
        
        const select = document.getElementById("sidebar-category");
        if (select.options.length > 1) {
            return;
        }

        categories.forEach(cat => {
            const option = document.createElement("option");
            option.value = cat.categoryId;
            option.textContent = cat.categoryName;
            select.appendChild(option);
        });

    } catch (err) {
        console.error("Error loading categories:", err);
        alert("Failed to load categories.\n" + err.message);
    }
}

//document.addEventListener("DOMContentLoaded", loadCategories);


export { loadCategories };
