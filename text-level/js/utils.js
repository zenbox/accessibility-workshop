export function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Modal Hilfsfunktionen
export function showModal(id) {
    const modal = document.getElementById(id);
    if (modal) {
        modal.style.display = "flex";
        const input = modal.querySelector("input");
        if (input) {
            input.focus();
        }
    }
}

export function hideModal(id) {
    const modal = document.getElementById(id);
    if (modal) {
        modal.style.display = "none";
    }
}

// Escape-Taste Handler für Modals
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        document.querySelectorAll(".modal").forEach(modal => {
            modal.style.display = "none";
        });
    }
});