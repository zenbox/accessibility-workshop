/**
 * TouchKeyboard - Virtuelle Tastatur für die Screenreader-Simulation
 */
export default class TouchKeyboard {
    constructor(simulation) {
        this.simulation = simulation
        this.isActive = false

        // Elemente abrufen
        this.keyboardElement = document.getElementById("virtual-keyboard")
        this.toggleButton = document.getElementById("toggle-keyboard")

        // Event-Listener einrichten
        this.setupEventListeners()

        // Tastatur standardmäßig anzeigen auf Touch-Geräten
        if (this.isTouchDevice()) {
            this.toggleKeyboard()
        }
    }

    setupEventListeners() {
        // Toggle-Button in der Tastatur
        if (this.toggleButton) {
            this.toggleButton.addEventListener("click", () => {
                this.toggleKeyboard()

                // Einstellungen speichern, wenn vorhanden
                if (this.simulation.settingsManager) {
                    this.simulation.settingsManager.saveSettings()
                }
            })
        }

        // Tasten-Events
        const keyButtons = document.querySelectorAll(".key-btn")
        keyButtons.forEach((button) => {
            button.addEventListener("click", () => {
                const key = button.getAttribute("data-key")
                const shiftKey = button.getAttribute("data-shift") === "true"

                this.simulateKeyPress(key, shiftKey)
            })
        })
    }

    toggleKeyboard() {
        this.isActive = !this.isActive

        if (this.isActive) {
            this.keyboardElement.classList.add("active")
            this.toggleButton.textContent = "Ausblenden"

            // Auch den Button im SR-Panel aktualisieren
            const keyboardToggleBtn =
                document.getElementById("sr-keyboard-toggle")
            if (keyboardToggleBtn) {
                keyboardToggleBtn.classList.add("active")
            }
        } else {
            this.keyboardElement.classList.remove("active")
            this.toggleButton.textContent = "Einblenden"

            // Auch den Button im SR-Panel aktualisieren
            const keyboardToggleBtn =
                document.getElementById("sr-keyboard-toggle")
            if (keyboardToggleBtn) {
                keyboardToggleBtn.classList.remove("active")
            }
        }
    }

    simulateKeyPress(key, shiftKey = false) {
        // Keydown-Event simulieren
        const keydownEvent = new KeyboardEvent("keydown", {
            key: key,
            code: this.getKeyCode(key),
            shiftKey: shiftKey,
            bubbles: true,
            cancelable: true,
        })

        // Keyup-Event simulieren
        const keyupEvent = new KeyboardEvent("keyup", {
            key: key,
            code: this.getKeyCode(key),
            shiftKey: shiftKey,
            bubbles: true,
            cancelable: true,
        })

        // Events auslösen
        document.dispatchEvent(keydownEvent)

        // Kurze Verzögerung zwischen den Events
        setTimeout(() => {
            document.dispatchEvent(keyupEvent)
        }, 50)
    }

    getKeyCode(key) {
        // Konvertierung von Tasten zu KeyCode
        const keyCodes = {
            "Tab": "Tab",
            "ArrowUp": "ArrowUp",
            "ArrowDown": "ArrowDown",
            "ArrowLeft": "ArrowLeft",
            "ArrowRight": "ArrowRight",
            " ": "Space",
            "Escape": "Escape",
            "Enter": "Enter",
            "Control": "Control",
            "h": "KeyH",
            "b": "KeyB",
            "f": "KeyF",
            "l": "KeyL",
            "t": "KeyT",
        }

        return keyCodes[key] || key
    }

    isTouchDevice() {
        return "ontouchstart" in window || navigator.maxTouchPoints > 0
    }
}
