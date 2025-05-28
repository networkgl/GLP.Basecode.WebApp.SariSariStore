
$(document).ready(async function () {

    //fetch API data
    const table = $("#product-table").DataTable({
    responsive: true,
    pageLength: 5,
    lengthMenu: [5, 10, 20, 50],
    language: {
        search: "_INPUT_",
        searchPlaceholder: "Search products...",
    },
    dom: '<"flex justify-between items-center mb-4"<"flex space-x-2"l><"search-input"f>>rtip', // Custom DOM for Tailwind layout
    // Disable default classes to prevent style conflict
    renderer: "bootstrap",
    });

    try {
        const response = await fetch(
            "https://glp-basecode-api-sarisaristore.onrender.com/api/product/getAllProduct"
        );
        if (!response.ok)
            throw new Error(`Failed to fetch products: ${response.status}`);

        const result = await response.json();
        const products = result.data;

        table.clear();

        products.forEach((item) => {
            table.row.add([
            `<span class="font-medium">${item.productName}</span>`,
            item.categoryName,
            item.barcode,
            item.price,
            `
            <span>
                <button
                    class="m-1 btn btn-sm btn-primary update-btn"
                    data-id="${item.productId}"
                    data-name="${item.productName}"
                    data-category="${item.categoryName}"
                    data-barcode="${item.barcode}"
                    data-price="${item.price}"
                    >
                    Edit
                </button> 
                
                <button
                    class="m-1 btn btn-sm btn-error delete-btn"
                    data-id="${item.productId}"
                    data-barcode="${item.barcode}"
                    >
                    Delete
                </button>
            </span>
            `,
            ]);
        });

        table.draw();
    } catch (error) {
    console.error("Error loading products:", error);
    }
});