export default class AriaManager {
    constructor(simulation) {
        this.simulation = simulation
        this.setupMutationObserver()
    }

    setupMutationObserver() {
        // Mutation Observer konfigurieren
        const config = {
            attributes: true,
            childList: true,
            subtree: true,
            attributeFilter: [
                "aria-live",
                "aria-atomic",
                "aria-relevant",
                "role",
                "aria-label",
                "aria-labelledby",
                "aria-describedby",
                "aria-expanded",
                "aria-hidden",
                "aria-selected",
                "aria-checked",
                "aria-current",
            ],
        }

        // Callback-Funktion für Änderungen
        const mutationCallback = (mutationsList, observer) => {
            for (const mutation of mutationsList) {
                this.handleMutation(mutation)
            }
        }

        // Observer erstellen und Beobachtung starten
        const observer = new MutationObserver(mutationCallback)
        observer.observe(document.body, config)
    }

    handleMutation(mutation) {
        // Attribut-Änderungen verarbeiten
        if (mutation.type === "attributes") {
            const element = mutation.target
            const attributeName = mutation.attributeName

            // Live-Region-Änderungen
            if (attributeName === "aria-live") {
                const liveType = element.getAttribute("aria-live")
                if (liveType === "assertive" || liveType === "polite") {
                    this.handleLiveRegionChange(element, liveType)
                }
            }
            // Andere ARIA-Attribut-Änderungen
            else if (attributeName.startsWith("aria-")) {
                this.handleAriaAttributeChange(element, attributeName)
            }
        }

        // DOM-Änderungen in Live-Regionen verarbeiten
        else if (mutation.type === "childList") {
            const element = mutation.target
            const liveType = this.findClosestLiveRegion(element)

            if (liveType) {
                this.handleLiveRegionChange(element, liveType)
            }
        }
    }

    findClosestLiveRegion(element) {
        // Sucht die nächste übergeordnete Live-Region
        let current = element

        while (current && current !== document.body) {
            const liveType = current.getAttribute("aria-live")
            if (liveType === "assertive" || liveType === "polite") {
                return liveType
            }
            current = current.parentElement
        }

        return null
    }

    handleLiveRegionChange(element, liveType) {
        // Behandelt Änderungen in Live-Regionen
        const content = element.textContent.trim()

        if (content) {
            const priority = liveType === "assertive" ? "high" : "normal"
            const atomic = element.getAttribute("aria-atomic") === "true"

            // Bei atomic=true den gesamten Inhalt ankündigen, sonst nur die Änderung
            const textToAnnounce = atomic
                ? content
                : this.getNewContent(element)

            if (textToAnnounce) {
                this.simulation.outputManager.speak(
                    `Live-Region (${priority}): ${textToAnnounce}`,
                    "speech"
                )
            }
        }
    }

    getNewContent(element) {
        // Versucht, nur den neu hinzugefügten Inhalt zu identifizieren
        // Diese Funktion ist vereinfacht und kann in realen Anwendungen komplexer sein
        return element.textContent.trim()
    }

    handleAriaAttributeChange(element, attributeName) {
        // Behandelt Änderungen an ARIA-Attributen
        const value = element.getAttribute(attributeName)
        const role =
            element.getAttribute("role") || element.tagName.toLowerCase()

        // Nur relevante Änderungen ankündigen
        switch (attributeName) {
            case "aria-expanded":
                if (role === "button" || role === "menuitem") {
                    const state =
                        value === "true" ? "ausgeklappt" : "eingeklappt"
                    this.simulation.outputManager.speak(
                        `${role}: ${state}`,
                        "speech"
                    )
                }
                break

            case "aria-selected":
            case "aria-checked":
                if (["checkbox", "radio", "option", "tab"].includes(role)) {
                    const state =
                        value === "true" ? "ausgewählt" : "nicht ausgewählt"
                    this.simulation.outputManager.speak(
                        `${role}: ${state}`,
                        "speech"
                    )
                }
                break

            case "aria-hidden":
                // Nur ankündigen, wenn von sichtbar zu unsichtbar geändert
                if (value === "true" && element.offsetParent !== null) {
                    this.simulation.outputManager.speak(
                        `Element ausgeblendet`,
                        "info"
                    )
                } else if (value === "false" && element.offsetParent === null) {
                    this.simulation.outputManager.speak(
                        `Element eingeblendet`,
                        "info"
                    )
                }
                break
        }
    }
}
