// Initialize the DataTable
const table = new simpleDatatables.DataTable("#export-table", {
template: (options, dom) => `
        <div class='${options.classes.top}'>
            <div class='flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-3 rtl:space-x-reverse w-full sm:w-auto'>
                ${
                    options.paging && options.perPageSelect
                    ? `
                    <div class='${options.classes.dropdown}'>
                        <label>
                            <select class='${options.classes.selector}'></select> ${options.labels.perPage}
                        </label>
                    </div> `
                    : ""
                }
                <button id='exportDropdownButton' type='button' class='flex w-full items-center justify-center rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700 sm:w-auto'>
                    Export as
                    <svg class='-me-0.5 ms-1.5 h-4 w-4' aria-hidden='true' xmlns='http://www.w3.org/2000/svg' width='24' height='24' fill='none' viewBox='0 0 24 24'>
                        <path stroke='currentColor' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='m19 9-7 7-7-7'/>
                    </svg>
                </button>
                <div id='exportDropdown' class='z-10 hidden w-52 divide-y divide-gray-100 rounded-lg bg-white shadow dark:bg-gray-700' data-popper-placement='bottom'>
                    <ul class='p-2 text-left text-sm font-medium text-gray-500 dark:text-gray-400' aria-labelledby='exportDropdownButton'>
                        <li><button id='export-csv' class='group inline-flex w-full items-center rounded-md px-3 py-2 text-sm text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white'>
                            <svg class='me-1.5 h-4 w-4 text-gray-400 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white' aria-hidden='true' xmlns='http://www.w3.org/2000/svg' width='24' height='24' fill='currentColor' viewBox='0 0 24 24'>
                                <path fill-rule='evenodd' d='M9 2.221V7H4.221a2 2 0 0 1 .365-.5L8.5 2.586A2 2 0 0 1 9 2.22ZM11 2v5a2 2 0 0 1-2 2H4v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2h-7ZM8 16a1 1 0 0 1 1-1h6a1 1 0 1 1 0 2H9a1 1 0 0 1-1-1Zm1-5a1 1 0 1 0 0 2h6a1 1 0 1 0 0-2H9Z' clip-rule='evenodd'/>
                            </svg>
                            <span>Export CSV</span>
                        </button></li>
                    </ul>
                </div>

            </div>
            ${
                options.searchable
                ? `
                <div class='${options.classes.search}'>
                    <input class='${
                        options.classes.input
                    }' placeholder='${
                    options.labels.placeholder
                    }' type='search' title='${
                    options.labels.searchTitle
                    }' ${dom.id ? `aria-controls='${dom.id}'` : ""}>
                </div> `
                : ""
            }
        </div>
        <div class='${options.classes.container}' ${
    options.scrollY.length
    ? `style='height: ${options.scrollY}; overflow-Y: auto;'`
    : ""
}></div>
        <div class='${options.classes.bottom}'>
            ${
                options.paging
                ? `<div class='${options.classes.info}'></div>`
                : ""
            }
            <nav class='${options.classes.pagination}'></nav>
        </div>`,
});

// Initialize the export dropdown
const $exportButton = document.getElementById("exportDropdownButton");
const $exportDropdownEl = document.getElementById("exportDropdown");
const dropdown = new Dropdown($exportDropdownEl, $exportButton);

// Export event listeners
document.getElementById("export-csv").addEventListener("click", () => {
simpleDatatables.exportCSV(table, {
    download: true,
    lineDelimiter: "\n",
    columnDelimiter: ",",
});
});
