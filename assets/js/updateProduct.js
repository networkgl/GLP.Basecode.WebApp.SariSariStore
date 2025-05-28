$(document).ready(async function () {
    
    //Pass val to modal inputs
    $("#product-table tbody").on("click", ".update-btn", function () {
        const btn = $(this);

        // Populate modal inputs
        $("#update-id").val(btn.data("id"));
        console.log(btn.data("id"));
        $("#update-name").val(btn.data("name"));
        $("#update-category").val(btn.data("category"));
        $("#update-barcode").val(btn.data("barcode"));
        $("#update-price").val(btn.data("price"));

        // Show the modal
        my_modal_3.showModal();
    });

    $("#update-form").on("submit", async function (e) {
        e.preventDefault();

        if($("#update-price").val() == 0 || $("#update-price").val() === null){
            alert("Please input a valid price.");
            return;
        }   

        const id = parseInt($("#update-id").val(), 10);
        const data = {
            productName: $("#update-name").val(),
            categoryName: $("#update-category").val(),
            barcode: $("#update-barcode").val(),
            price: parseFloat($("#update-price").val()),
        };

        console.log("Saving updated product:", data);

        const submitBtn = document.getElementById("submit-btn");
        const spinner = document.getElementById("spinner");
        const btnText = document.getElementById("btn-text");

        submitBtn.disabled = true;
        spinner.classList.remove("hidden");
        btnText.innerHTML = "Saving...";

        try {
            const response = await fetch(
            `https://glp-basecode-api-sarisaristore.onrender.com/api/product/updateProduct/${id}`,
            {
                method: "PUT",
                headers: {
                "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            }
            );

            if (!response.ok) {
            const error = await response.json();
            alert("Update failed: " + error.message);
            return;
            }
            alert("Product updated successfully!");


            const table = $('#product-table').DataTable();

            table.rows().every(function () {
                const rowData = this.data();
                if (rowData[2] === data.barcode) { //index 2 for barcode
                    this.remove();
                }
            });


            // Add the updated row
            table.row.add([
                data.productName,
                data.categoryName,
                data.barcode,
                data.price,
                 `<span>
                        <button
                            class="m-1 btn btn-sm btn-primary update-btn"
                            data-id="${id}"
                            data-name="${data.productName}"
                            data-category="${data.categoryName}"
                            data-barcode="${data.barcode}"
                            data-price="${data.price}"
                            >
                            Edit
                        </button> 
                        
                        <button
                            class="m-1 btn btn-sm btn-error delete-btn"
                            data-id="${data.productId}"
                            >
                            Delete
                        </button>
                    </span>`
        ]).draw(false);



            
        } catch (err) {
            alert("Unexpected error: " + err.message);
        } finally {
            submitBtn.disabled = false;
            spinner.classList.add("hidden");
            btnText.innerHTML = "Save Product";
            my_modal_3.close();
            // $('#product-table').DataTable().ajax.reload(null, false);


        }

    });
});
