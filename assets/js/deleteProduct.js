$(document).ready(async function () {

    //Pass val to modal inputs
    $("#product-table tbody").on("click", ".delete-btn", function () {
        const btn = $(this);

        // Show the modal
        my_modal_6.showModal();

        //remove manually once success for live update
        const table = $('#product-table').DataTable();
        const row = $(this).closest('tr');

        let id = btn.data("id");
        let barcode = btn.data("barcode");

        console.log("Product ID: " + id);
        console.log("Code: " + barcode);

        const confirmDeleteBtn = document.getElementById("deleleBtn");
        const clsBtn = document.getElementById("clsBtn");
        const spinner = document.getElementById("spinner1");
        const btnText = document.getElementById("btn-text1");

        $("#deleleBtn").off().on("click", async function () {
            clsBtn.disabled = true;
            confirmDeleteBtn.disabled = true;
            spinner.classList.remove("hidden");
            btnText.innerHTML = "Deleting...";

            try{
                const response = await fetch(
                    `https://glp-basecode-api-sarisaristore.onrender.com/api/product/deleteProduct/${id}`,
                    {
                        method: "DELETE"
                    }
                );

                if (!response.ok) {
                    const error = await response.json();
                    alert("Update failed: " + error.message);
                    return;
                }
                alert("Product updated successfully!");

                table.row(row).remove().draw(false);

            }
            catch(err){
                alert("Unexpected error: " + err.message);
            }
            finally{
                clsBtn.disabled = false;
                confirmDeleteBtn.disabled = false;
                spinner.classList.add("hidden");
                btnText.innerHTML = "Yes";
                my_modal_6.close();

            }
        });
     

     
    });
});
