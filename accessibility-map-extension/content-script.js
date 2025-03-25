// Globale Variable, um den Status der Extension zu speichern
let a11yMapStatus = {
    isInitialized: false,
    isActive: false,
}

// Content script logging
function log(message) {
    console.log(
        "%c[A11y-Map Content]",
        "color: #4285f4; font-weight: bold;",
        message
    )
}

function error(message, err) {
    console.error(
        "%c[A11y-Map Content]",
        "color: #ea4335; font-weight: bold;",
        message,
        err
    )
}

// Initialisierungsnachricht - wichtig für das Background Script, um zu wissen, dass wir bereit sind
log("Content script loaded and ready")

// Funktion zum Injizieren des Haupt-Scripts
function injectAccessibilityMap(config) {
    try {
        log("Injecting accessibility map script")

        // Entferne vorhandene Injektion falls vorhanden
        const existingScript = document.getElementById("a11y-map-script")
        if (existingScript) {
            existingScript.remove()
        }

        // Erstelle ein Skript-Element
        const script = document.createElement("script")
        script.id = "a11y-map-script"
        script.src = config.injectionBase + "injected.js"
        script.onload = () => {
            log("Main injection script loaded")

            // WICHTIG: Warte einen Moment, damit das Skript initialisiert wird
            setTimeout(() => {
                // Übergebe Konfiguration über ein benutzerdefiniertes Event
                const configEvent = new CustomEvent("a11y-map-config", {
                    detail: {
                        colorMapping: config.colorMapping,
                        baseUrl: config.injectionBase,
                    },
                })
                document.dispatchEvent(configEvent)
                log("Configuration sent via custom event")
            }, 100)
        }
        script.onerror = (e) => error("Failed to load injection script", e)

        // Füge das Skript zum Dokument hinzu
        document.head.appendChild(script)

        a11yMapStatus.isActive = true
    } catch (err) {
        error("Error injecting script", err)
    }
}

// Funktion zum Entfernen der Map
function removeAccessibilityMap() {
    try {
        log("Removing accessibility map")

        // Entferne Skripte
        const scriptElements = [
            document.getElementById("a11y-map-script"),
            document.getElementById("a11y-map-config"),
        ]

        scriptElements.forEach((el) => {
            if (el) el.remove()
        })

        // Entferne UI-Elemente über ein Event
        document.dispatchEvent(new CustomEvent("a11y-map-cleanup"))

        // Entferne SVG-Overlay
        const overlay = document.getElementById("a11y-map-svg-overlay")
        if (overlay) overlay.remove()

        // Entferne Kontrollpanel
        const controls = document.getElementById("a11y-map-controls-container")
        if (controls) controls.remove()

        a11yMapStatus.isActive = false
    } catch (err) {
        error("Error removing accessibility map", err)
    }
}

// Höre auf Nachrichten vom Background Script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    log("Received message: " + message.action)

    if (message.action === "toggleAccessibilityMap") {
        try {
            if (a11yMapStatus.isActive) {
                removeAccessibilityMap()
                a11yMapStatus.isActive = false
            } else {
                injectAccessibilityMap(message)
                a11yMapStatus.isActive = true
            }

            // Sende Antwort nur, wenn sendResponse verfügbar ist
            if (typeof sendResponse === "function") {
                try {
                    sendResponse({
                        status: a11yMapStatus.isActive
                            ? "activated"
                            : "deactivated",
                    })
                } catch (e) {
                    // Ignoriere Fehler beim Senden der Antwort
                }
            }
        } catch (error) {
            log("Error handling toggleAccessibilityMap: " + error.message)
        }

        // Return false, da wir nicht asynchron antworten
        return false
    }

    // Neuer Handler für das Schließen der Map bei Popup-Schließung
    if (message.action === "closeAccessibilityMap" && a11yMapStatus.isActive) {
        log("Received closeAccessibilityMap command")
        removeAccessibilityMap()
        a11yMapStatus.isActive = false

        // Auch hier: Nur antworten, wenn sendResponse verfügbar
        if (typeof sendResponse === "function") {
            try {
                sendResponse({ status: "closed" })
            } catch (e) {
                // Ignoriere Fehler
            }
        }

        return false
    }
})
