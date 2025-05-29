document.querySelectorAll(".theme-toggle").forEach((toggleBtn) => {
    toggleBtn.addEventListener("click", () => {
        const darkIcon = toggleBtn.querySelector(".theme-toggle-dark-icon");
        const lightIcon = toggleBtn.querySelector(".theme-toggle-light-icon");

        if (darkIcon && lightIcon) {
        darkIcon.classList.toggle("hidden");
        lightIcon.classList.toggle("hidden");
        }
    });
});
