/**
 * SettingsManager - Verwaltet die Speicherung und Wiederherstellung von Einstellungen
 * via localStorage für die Screenreader-Simulation
 */
export default class SettingsManager {
    constructor(simulation) {
        this.simulation = simulation
        this.storageKey = "screenreader-simulation-settings"

        // Default-Einstellungen
        this.defaultSettings = {
            mode: "nvda", // Screenreader-Modus (nvda, jaws, voiceover)
            speechEnabled: true, // Change this from false to true

            keyboardVisible: false, // Virtuelle Tastatur sichtbar
            overlayPosition: {
                // Position des Overlays
                top: "20px",
                right: "20px",
            },
            overlaySize: {
                // Größe des Overlays
                width: "400px",
                height: "300px",
            },
        }

        // Aktuelle Einstellungen initialisieren
        this.settings = this.loadSettings()
    }

    /**
     * Laden der Einstellungen aus dem localStorage
     */
    loadSettings() {
        try {
            const savedSettings = localStorage.getItem(this.storageKey)

            if (savedSettings) {
                // Gespeicherte Einstellungen mit Defaults zusammenführen
                return { ...this.defaultSettings, ...JSON.parse(savedSettings) }
            }
        } catch (error) {
            console.error("Fehler beim Laden der Einstellungen:", error)
        }

        // Fallback zu Default-Einstellungen
        return { ...this.defaultSettings }
    }

    /**
     * Speichern der aktuellen Einstellungen im localStorage
     */
    saveSettings() {
        try {
            // Aktuelle Einstellungen aktualisieren
            this.updateCurrentSettings()

            // Einstellungen im localStorage speichern
            localStorage.setItem(this.storageKey, JSON.stringify(this.settings))

            return true
        } catch (error) {
            console.error("Fehler beim Speichern der Einstellungen:", error)
            return false
        }
    }

    /**
     * Aktuelle Einstellungen aus der UI aktualisieren
     */
    updateCurrentSettings() {
        const overlay = document.getElementById("sr-overlay")

        // Modus
        this.settings.mode = this.simulation.currentMode

        // Sprachausgabe-Status und Einstellungen
        if (this.simulation.speechOutput) {
            this.settings.speechEnabled = this.simulation.speechOutput.isActive
        }

        // Tastatur-Sichtbarkeit
        if (this.simulation.touchKeyboard) {
            this.settings.keyboardVisible =
                this.simulation.touchKeyboard.isActive
        }

        // Overlay-Position und -Größe
        if (overlay) {
            this.settings.overlayPosition = {
                top: overlay.style.top || "20px",
                right: overlay.style.right || "20px",
            }

            this.settings.overlaySize = {
                width: overlay.style.width || "400px",
                height: overlay.style.height || "300px",
            }
        }
    }

    /**
     * Anwenden der gespeicherten Einstellungen auf die Simulation
     */
    applySettings() {
        const overlay = document.getElementById("sr-overlay")

        // Modus setzen
        if (this.settings.mode) {
            this.simulation.setMode(this.settings.mode)
        }

        // Sprachausgabe-Status und Einstellungen
        if (this.simulation.speechOutput) {
            // Aktivierungsstatus
            this.simulation.speechOutput.isActive = this.settings.speechEnabled

            // Toggle-Schalter aktualisieren, falls vorhanden
            const speechToggle = document.getElementById("speech-toggle")
            if (speechToggle) {
                speechToggle.checked = this.settings.speechEnabled
            }

        }

        // Tastatur-Sichtbarkeit
        if (this.simulation.touchKeyboard) {
            if (this.settings.keyboardVisible) {
                this.simulation.touchKeyboard.keyboardElement.classList.add(
                    "active"
                )
            } else {
                this.simulation.touchKeyboard.keyboardElement.classList.remove(
                    "active"
                )
            }
            this.simulation.touchKeyboard.isActive =
                this.settings.keyboardVisible
        }

        // Overlay-Position und -Größe
        if (overlay) {
            if (this.settings.overlayPosition) {
                overlay.style.top = this.settings.overlayPosition.top
                overlay.style.right = this.settings.overlayPosition.right
            }

            if (this.settings.overlaySize) {
                overlay.style.width = this.settings.overlaySize.width
                overlay.style.height = this.settings.overlaySize.height
            }
        }
    }
}
