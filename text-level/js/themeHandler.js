export const ThemeHandler = {
    init() {
        this.initTheme();
        this.setupEventListeners();
    },

    initTheme() {
        const savedTheme = localStorage.getItem("theme") || "light";
        const savedContrast = localStorage.getItem("contrast") || "normal";
        
        document.body.setAttribute("data-theme", savedTheme);
        document.body.setAttribute("data-contrast", savedContrast);
        
        this.updateThemeIcon();
    },

    setupEventListeners() {
        const themeToggle = document.getElementById("theme-toggle");
        const contrastToggle = document.getElementById("contrast-toggle");

        if (themeToggle) {
            themeToggle.addEventListener("click", () => this.toggleTheme());
        }

        if (contrastToggle) {
            contrastToggle.addEventListener("click", () => this.toggleContrast());
        }
    },

    toggleTheme() {
        const currentTheme = document.body.getAttribute("data-theme");
        const newTheme = currentTheme === "light" ? "dark" : "light";
        
        document.body.setAttribute("data-theme", newTheme);
        localStorage.setItem("theme", newTheme);
        
        this.updateThemeIcon();
    },

    toggleContrast() {
        const currentContrast = document.body.getAttribute("data-contrast");
        const newContrast = currentContrast === "normal" ? "high" : "normal";
        
        document.body.setAttribute("data-contrast", newContrast);
        localStorage.setItem("contrast", newContrast);
    },

    updateThemeIcon() {
        const themeIcon = document.querySelector("#theme-toggle i");
        if (themeIcon) {
            const currentTheme = document.body.getAttribute("data-theme");
            themeIcon.textContent = currentTheme === "light" ? "dark_mode" : "light_mode";
        }
    }
};