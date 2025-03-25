/**
 *    @version v3
 */

// ui/ModalService.js - Service für modale Dialoge
class ModalService {
    constructor(uiRegistry) {
        this.uiRegistry = uiRegistry
        this.modalStack = []
        this.isInitialized = false
    }

    /**
     * Initialisiert den Modal Service
     */
    init() {
        if (this.isInitialized) return

        // Event-Listener für Escape-Taste
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape" && this.modalStack.length > 0) {
                const topModal = this.modalStack[this.modalStack.length - 1]
                if (topModal.closeOnEscape) {
                    this.closeModal(topModal.id)
                }
            }
        })

        // Event-Listener für Klick auf den Hintergrund
        document.addEventListener("click", (e) => {
            if (this.modalStack.length > 0) {
                const topModal = this.modalStack[this.modalStack.length - 1]

                if (
                    topModal.closeOnBackdropClick &&
                    e.target.classList.contains("modal") &&
                    e.target.id === topModal.id
                ) {
                    this.closeModal(topModal.id)
                }
            }
        })

        this.isInitialized = true
    }

    /**
     * Erstellt und öffnet ein modales Fenster
     * @param {object} options - Konfigurationsoptionen für das Modal
     * @returns {string} - ID des erstellten Modals
     */
    openModal(options = {}) {
        const {
            id = `modal-${Date.now()}`,
            title = "",
            content = "",
            width = "600px",
            maxHeight = "80vh",
            closeOnEscape = true,
            closeOnBackdropClick = true,
            onClose = null,
            customClass = "",
            buttons = [],
        } = options

        // Erstellen des Modal-Elements
        const modalElement = document.createElement("div")
        modalElement.id = id
        modalElement.className = `modal ${customClass}`
        modalElement.setAttribute("role", "dialog")
        modalElement.setAttribute("aria-modal", "true")
        modalElement.setAttribute("aria-labelledby", `${id}-title`)

        // Modal-Inhalt erstellen
        const modalContent = document.createElement("div")
        modalContent.className = "modal-content"
        modalContent.style.maxWidth = width
        modalContent.style.maxHeight = maxHeight

        // Schließen-Button
        const closeButton = document.createElement("button")
        closeButton.className = "modal-close"
        closeButton.innerHTML = "&times;"
        closeButton.setAttribute("aria-label", "Schließen")
        closeButton.addEventListener("click", () => this.closeModal(id))

        // Titel hinzufügen, wenn vorhanden
        let titleElement = null
        if (title) {
            titleElement = document.createElement("h2")
            titleElement.id = `${id}-title`
            titleElement.className = "modal-title"
            titleElement.textContent = title
        }

        // Inhalt hinzufügen
        const contentElement = document.createElement("div")
        contentElement.className = "modal-body"

        if (typeof content === "string") {
            contentElement.innerHTML = content
        } else if (content instanceof HTMLElement) {
            contentElement.appendChild(content)
        }

        // Footer für Buttons erstellen, wenn Buttons vorhanden
        let footerElement = null
        if (buttons.length > 0) {
            footerElement = document.createElement("div")
            footerElement.className = "modal-footer"

            buttons.forEach((button) => {
                const buttonElement = document.createElement("button")
                buttonElement.className = `modal-btn ${button.class || ""}`
                buttonElement.textContent = button.text || "Button"

                if (button.onClick) {
                    buttonElement.addEventListener("click", () => {
                        button.onClick()
                        if (button.closeModal) {
                            this.closeModal(id)
                        }
                    })
                } else if (button.closeModal) {
                    buttonElement.addEventListener("click", () =>
                        this.closeModal(id)
                    )
                }

                footerElement.appendChild(buttonElement)
            })
        }

        // Alles zusammenfügen
        modalContent.appendChild(closeButton)
        if (titleElement) modalContent.appendChild(titleElement)
        modalContent.appendChild(contentElement)
        if (footerElement) modalContent.appendChild(footerElement)

        modalElement.appendChild(modalContent)
        document.body.appendChild(modalElement)

        // Modal anzeigen
        setTimeout(() => {
            modalElement.classList.add("show")

            // Fokus auf den ersten Button setzen, wenn vorhanden
            const firstButton = modalElement.querySelector(".modal-btn")
            if (firstButton) {
                firstButton.focus()
            } else {
                closeButton.focus()
            }
        }, 10)

        // Zum Stack hinzufügen
        this.modalStack.push({
            id,
            element: modalElement,
            closeOnEscape,
            closeOnBackdropClick,
            onClose,
        })

        return id
    }

    /**
     * Schließt ein modales Fenster
     * @param {string} modalId - ID des zu schließenden Modals
     */
    closeModal(modalId) {
        const modalIndex = this.modalStack.findIndex(
            (modal) => modal.id === modalId
        )

        if (modalIndex === -1) return

        const modal = this.modalStack[modalIndex]
        modal.element.classList.remove("show")

        // Entferne Modal nach Fadeout
        setTimeout(() => {
            if (modal.element.parentNode) {
                modal.element.parentNode.removeChild(modal.element)
            }

            // onClose-Callback aufrufen, wenn vorhanden
            if (modal.onClose && typeof modal.onClose === "function") {
                modal.onClose()
            }
        }, 300)

        // Aus Stack entfernen
        this.modalStack.splice(modalIndex, 1)

        // Fokus auf das vorherige Modal setzen, wenn vorhanden
        if (this.modalStack.length > 0) {
            const prevModal = this.modalStack[this.modalStack.length - 1]
            const closeButton = prevModal.element.querySelector(".modal-close")
            if (closeButton) {
                closeButton.focus()
            }
        }
    }

    /**
     * Schließt alle modalen Fenster
     */
    closeAllModals() {
        // Kopie des Stacks erstellen, um während der Iteration zu verändern
        const modalsCopy = [...this.modalStack]
        modalsCopy.forEach((modal) => this.closeModal(modal.id))
    }
}
