/**
 *    @version v3
 */

// ui/TooltipService.js - Service für Tooltips
class TooltipService {
    constructor(uiRegistry) {
        this.uiRegistry = uiRegistry
        this.activeTooltip = null
        this.tooltipTimeout = null
    }

    /**
     * Initialisiert den Tooltip Service
     */
    init() {
        // Globaler Event-Listener für Escape-Taste
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape" && this.activeTooltip) {
                this.hideTooltip(this.activeTooltip.element)
            }
        })
    }

    /**
     * Erstellt einen Tooltip
     * @param {string} description - Beschreibungstext für den Tooltip
     * @returns {HTMLElement|null} - Das erstellte Tooltip-Element oder null
     */
    createTooltip(description) {
        if (!description) return null

        const tooltip = document.createElement("div")
        tooltip.className = "tooltip"
        tooltip.textContent = description
        return tooltip
    }

    /**
     * Zeigt einen Tooltip für ein Element an
     * @param {HTMLElement} element - Das Element, für das der Tooltip angezeigt werden soll
     * @param {string} description - Beschreibung für den Tooltip (optional)
     */
    showTooltip(element, description = null) {
        // Wenn kein Element oder Tooltip, nichts tun
        if (!element || (!element.tooltipElement && !description)) return

        // Tooltip erstellen, wenn noch nicht vorhanden
        if (!element.tooltipElement && description) {
            element.tooltipElement = this.createTooltip(description)
        }

        if (!element.tooltipElement) return

        // Verstecke aktiven Tooltip, wenn ein anderer angezeigt werden soll
        if (this.activeTooltip && this.activeTooltip.element !== element) {
            this.hideTooltip(this.activeTooltip.element)
        }

        // Füge Tooltip zum DOM hinzu
        element.appendChild(element.tooltipElement)

        // Position berechnen und anpassen
        this.adjustTooltipPosition(element, element.tooltipElement)

        // Mache den Tooltip sichtbar
        setTimeout(() => {
            element.tooltipElement.classList.add("visible")
        }, 10)

        // Merke aktiven Tooltip
        this.activeTooltip = {
            element,
            tooltip: element.tooltipElement,
        }
    }

    /**
     * Versteckt einen Tooltip
     * @param {HTMLElement} element - Das Element, für das der Tooltip versteckt werden soll
     */
    hideTooltip(element) {
        if (!element || !element.tooltipElement) return

        // Entferne visible-Klasse (für Fade-Out-Animation)
        element.tooltipElement.classList.remove("visible")

        // Entferne Tooltip nach Abschluss der Animation
        clearTimeout(this.tooltipTimeout)
        this.tooltipTimeout = setTimeout(() => {
            if (
                element.tooltipElement &&
                element.tooltipElement.parentNode === element
            ) {
                element.removeChild(element.tooltipElement)
            }

            // Setze aktiven Tooltip zurück
            if (this.activeTooltip && this.activeTooltip.element === element) {
                this.activeTooltip = null
            }
        }, 300)
    }

    /**
     * Passt die Position eines Tooltips an
     * @param {HTMLElement} element - Das Element, für das der Tooltip angezeigt wird
     * @param {HTMLElement} tooltip - Das Tooltip-Element
     */
    adjustTooltipPosition(element, tooltip) {
        const rect = element.getBoundingClientRect()
        const tooltipRect = tooltip.getBoundingClientRect()

        // Prüfen, ob der Tooltip links oder rechts angezeigt werden soll
        const viewportWidth = window.innerWidth
        const rightSpace = viewportWidth - rect.right

        if (rightSpace < tooltipRect.width + 20) {
            tooltip.classList.add("left-position")
        } else {
            tooltip.classList.remove("left-position")
        }
    }
}
