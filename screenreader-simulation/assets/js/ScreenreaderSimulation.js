import FocusManager from "./FocusManager.js"
import OutputManager from "./OutputManager.js"
import KeyboardManager from "./KeyboardManager.js"
import DragManager from "./DragManager.js"
import TouchKeyboard from "./TouchKeyboard.js"
import SpeechOutput from "./SpeechOutput.js"
import SettingsManager from "./SettingsManager.js"
import AriaManager from "./AriaManager.js"

/**
 * ScreenreaderSimulation class - Manages the screenreader simulation
 * Based on SOLID principles with single responsibility for components
 */
export default class ScreenreaderSimulation {
    constructor() {
        this.currentMode = "nvda"
        this.outputElement = document.getElementById("sr-output")
        this.overlayElement = document.getElementById("sr-overlay")
        this.titleElement = document.getElementById("sr-title")
        this.shortcutsElement = document.getElementById("sr-shortcuts")
        this.focusedElement = null

        // Initialize components
        this.focusManager = new FocusManager(this)
        this.outputManager = new OutputManager(this)
        this.keyboardManager = new KeyboardManager(this)
        this.dragManager = new DragManager(this.overlayElement)
        this.speechOutput = new SpeechOutput()
        this.touchKeyboard = new TouchKeyboard(this)
        this.settingsManager = new SettingsManager(this)
        this.ariaManager = new AriaManager(this)

        // Modus-Schaltflächen in die Simulations-Controls verschieben
        this.moveModeSwitchesToControls()

        // Einstellungen aus dem localStorage laden und anwenden
        this.settingsManager.applySettings()

        // Set up event listeners
        this.setupEventListeners()
    }

    /**
     * Verschieben der Modus-Schaltflächen in die Controls des Overlays
     */
    moveModeSwitchesToControls() {
        // Bestehende Modus-Schaltflächen entfernen, falls vorhanden
        const oldModeSwitch = document.querySelector(".mode-switch")
        if (oldModeSwitch) {
            oldModeSwitch.remove()
        }

        // Controls-Container abrufen
        const controlsContainer = document.getElementById("sr-controls")
        if (!controlsContainer) return

        // Compact Mode-Switcher erstellen
        const modeSelector = document.createElement("select")
        modeSelector.id = "mode-selector"
        modeSelector.className = "mode-selector"
        modeSelector.title = "Screenreader-Modus wechseln"

        // Optionen hinzufügen
        const modes = [
            { value: "nvda", label: "NVDA" },
            { value: "jaws", label: "JAWS" },
            { value: "voiceover", label: "VoiceOver" },
        ]

        modes.forEach((mode) => {
            const option = document.createElement("option")
            option.value = mode.value
            option.textContent = mode.label
            modeSelector.appendChild(option)
        })

        // Auf aktuellen Modus setzen
        modeSelector.value = this.currentMode

        // Event-Listener für Moduswechsel
        modeSelector.addEventListener("change", (event) => {
            this.setMode(event.target.value)
            this.settingsManager.saveSettings()
        })

        // Container für den Mode-Selector erstellen
        const modeSelectorContainer = document.createElement("div")
        modeSelectorContainer.className = "mode-selector-container"
        modeSelectorContainer.appendChild(document.createTextNode("Modus: "))
        modeSelectorContainer.appendChild(modeSelector)

        // Zu Beginn der Controls einfügen
        controlsContainer.insertBefore(
            modeSelectorContainer,
            controlsContainer.firstChild
        )
    }

    setupEventListeners() {
        // Overlay controls
        document
            .getElementById("sr-clear")
            .addEventListener("click", () => this.outputManager.clear())
        document
            .getElementById("sr-help")
            .addEventListener("click", () => this.showHelp())

        // Sprachausgabe-Steuerung
        this.setupSpeechControls()

        // Einstellungen speichern bei Beendigung/Verlassen der Seite
        window.addEventListener("beforeunload", () => {
            this.settingsManager.saveSettings()
        })

        // Tastatur-Toggle
        this.setupKeyboardToggle()

        // Einstellungen speichern bei Beendigung/Verlassen der Seite
        window.addEventListener("beforeunload", () => {
            this.settingsManager.saveSettings()
        })

        // Speichern-Button für Einstellungen
        const saveButton = document.createElement("button")
        saveButton.id = "save-settings"
        saveButton.textContent = "Speichern"
        saveButton.title = "Einstellungen speichern"
        saveButton.addEventListener("click", () => {
            if (this.settingsManager.saveSettings()) {
                this.outputManager.speak("Einstellungen gespeichert", "info")
            } else {
                this.outputManager.speak(
                    "Fehler beim Speichern der Einstellungen",
                    "error"
                )
            }
        })
        document.getElementById("sr-controls").appendChild(saveButton)

        // Spezielles Element für die Anzeige von fremdsprachlichem Text einrichten
        this.setupMultilingualDemo()

        // Overlay controls
        document
            .getElementById("sr-clear")
            .addEventListener("click", () => this.outputManager.clear())
        document
            .getElementById("sr-help")
            .addEventListener("click", () => this.showHelp())

        setTimeout(() => {
            console.log("Testing speech output...")
            this.outputManager.speak(
                "Screenreader-Simulation wurde gestartet.",
                "speech"
            )
        }, 1000)

        // Initial announcement
        setTimeout(() => {
            this.focusManager.setInitialFocus()
        }, 500)
    }

    /**
     * Sprachausgabe-Controls einrichten
     */
    setupSpeechControls() {
        // Container für Sprachausgabe-Switch erstellen
        const speechToggleLabel = document.createElement("div")
        speechToggleLabel.className = "switch-label"
        speechToggleLabel.innerHTML =
            'Sprache <label class="switch"><input type="checkbox" id="speech-toggle"><span class="slider"></span></label>'
        document.getElementById("sr-controls").appendChild(speechToggleLabel)

        // Event für den Sprachausgabe-Switch
        document.getElementById("speech-toggle").checked = true // Force this to true initially

        document
            .getElementById("speech-toggle")
            .addEventListener("change", (e) => {
                const isActive = e.target.checked
                this.speechOutput.isActive = isActive
                this.outputManager.speak(
                    `Sprachausgabe ${isActive ? "aktiviert" : "deaktiviert"}`,
                    "info"
                )
                this.settingsManager.saveSettings()
            })

        // Status aus den Einstellungen setzen
        document.getElementById("speech-toggle").checked =
            this.speechOutput.isActive

        // Stop-Button für Sprachausgabe
        const stopSpeechButton = document.createElement("button")
        stopSpeechButton.textContent = "⏹️"
        stopSpeechButton.id = "stop-speech"
        stopSpeechButton.title = "Sprachausgabe stoppen (Strg)"
        document.getElementById("sr-controls").appendChild(stopSpeechButton)

        stopSpeechButton.addEventListener("click", () => {
            this.speechOutput.stop()
            this.outputManager.speak("Sprachausgabe unterbrochen", "info")
        })
    }

    setupSpeechSettings() {
        // Prüfen, ob die globale Funktion verfügbar ist
        if (typeof setupSpeechSettingsUI === "function") {
            setupSpeechSettingsUI(this)
        } else {
            console.warn("setupSpeechSettingsUI-Funktion nicht gefunden")
        }
    }

    /**
     * Button für die virtuelle Tastatur einrichten
     */
    setupKeyboardToggle() {
        const keyboardToggleBtn = document.createElement("button")
        keyboardToggleBtn.id = "sr-keyboard-toggle"
        keyboardToggleBtn.textContent = "⌨️"
        keyboardToggleBtn.title = "Virtuelle Tastatur ein-/ausblenden"
        document.getElementById("sr-controls").appendChild(keyboardToggleBtn)

        // Event für den Tastatur-Button
        keyboardToggleBtn.addEventListener("click", () => {
            this.touchKeyboard.toggleKeyboard()
            this.settingsManager.saveSettings()
        })
    }

    setMode(mode) {
        // Vorherigen Modus-Klasse entfernen
        document.body.classList.remove(`mode-${this.currentMode}`)

        this.currentMode = mode

        // Neue Modus-Klasse hinzufügen
        document.body.classList.add(`mode-${this.currentMode}`)

        this.titleElement.textContent = this.getModeTitle()
        this.shortcutsElement.innerHTML = this.getShortcutsForMode()
        this.outputManager.speak(
            `Screenreader-Modus gewechselt zu ${this.getModeTitle()}`
        )

        // Mode-Selector aktualisieren, falls vorhanden
        const modeSelector = document.getElementById("mode-selector")
        if (modeSelector) {
            modeSelector.value = mode
        }
    }

    getModeTitle() {
        switch (this.currentMode) {
            case "nvda":
                return "NVDA Simulation"
            case "jaws":
                return "JAWS Simulation"
            case "voiceover":
                return "VoiceOver Simulation"
            default:
                return "Screenreader Simulation"
        }
    }

    getShortcutsForMode() {
        const common = `
                    <div>Tab: Nächstes Element</div>
                    <div>Shift+Tab: Vorheriges Element</div>
                    <div>Enter: Element aktivieren</div>
                `

        switch (this.currentMode) {
            case "nvda":
                return (
                    common +
                    `
                            <div>Pfeiltasten: Navigieren</div>
                            <div>H: Nächste Überschrift</div>
                            <div>B: Nächster Button</div>
                            <div>F: Nächstes Formularfeld</div>
                            <div>Strg: Sprachausgabe stoppen</div>
                        `
                )
            case "jaws":
                return (
                    common +
                    `
                            <div>Pfeiltasten: Navigieren</div>
                            <div>H: Nächste Überschrift</div>
                            <div>T: Nächste Tabelle</div>
                            <div>F: Nächstes Formularfeld</div>
                            <div>Strg: Sprachausgabe stoppen</div>
                        `
                )
            case "voiceover":
                return (
                    common +
                    `
                            <div>Pfeiltasten: Navigieren</div>
                            <div>H: Nächste Überschrift</div>
                            <div>T: Nächste Tabelle</div>
                            <div>F: Nächstes Formularfeld</div>
                            <div>Strg: Sprachausgabe stoppen</div>
                        `
                )
            default:
                return common
        }
    }

    showHelp() {
        this.outputManager.speak("Hilfe für " + this.getModeTitle(), "info")
        this.outputManager.speak(
            "Verwenden Sie die Tastaturkürzel, um durch die Seite zu navigieren.",
            "info"
        )
        this.outputManager.speak(
            "Tab und Shift+Tab navigieren zu interaktiven Elementen.",
            "info"
        )

        if (this.currentMode === "nvda") {
            this.outputManager.speak(
                "Pfeiltasten navigieren durch Text und Elemente.",
                "info"
            )
            this.outputManager.speak(
                "Drücken Sie H für die nächste Überschrift, B für den nächsten Button.",
                "info"
            )
        } else if (this.currentMode === "jaws") {
            this.outputManager.speak(
                "Pfeiltasten navigieren durch Text und Elemente.",
                "info"
            )
            this.outputManager.speak(
                "Drücken Sie F für das nächste Formularfeld, T für die nächste Tabelle.",
                "info"
            )
        } else if (this.currentMode === "voiceover") {
            this.outputManager.speak(
                "Pfeiltasten navigieren durch Elemente.",
                "info"
            )
            this.outputManager.speak(
                "Drücken Sie die Leertaste, um das aktuelle Element zu aktivieren.",
                "info"
            )
        }
    }

    setupMultilingualDemo() {
        // Erstellen eines Demo-Bereichs in der Beispielwebseite
        const demoSection = document.createElement("section")
        demoSection.id = "language-demo"
        demoSection.innerHTML = `
        <h2>Mehrsprachige Beispiele</h2>
        <p>Nachfolgend sehen Sie einige Beispiele für die Spracherkennung des Screenreaders:</p>
        
        <div class="language-examples">
            <div class="language-example">
                <h3>Deutschen Text <small>(Standard)</small></h3>
                <p>Dies ist ein deutscher Text, der in der Standardsprache vorgelesen wird.</p>
            </div>
            
            <div class="language-example">
                <h3>Englischer Text</h3>
                <p lang="en">This is an English text that will be read using an English voice if available.</p>
            </div>
            
            <div class="language-example">
                <h3>Französischer Text</h3>
                <p lang="fr">Ceci est un texte français qui sera lu avec une voix française si disponible.</p>
            </div>
            
            <div class="language-example">
                <h3>Spanischer Text</h3>
                <p lang="es">Este es un texto en español que se leerá con una voz en español si está disponible.</p>
            </div>
            
            <div class="language-example">
                <h3>Gemischter Text</h3>
                <p>Hier ist ein deutscher Text mit eingebetteten <span lang="en">English phrases</span> 
                und auch <span lang="fr">quelques mots français</span> zur Demonstration der 
                Spracherkennung innerhalb eines Textes.</p>
            </div>
        </div>
        
        <div class="info-panel">
            <p>
                Hinweis: Die korrekte Aussprache hängt von den verfügbaren Stimmen im Browser ab.
                Nicht alle Browser stellen für alle Sprachen Stimmen bereit.
            </p>
        </div>
    `

        // CSS für die Sprachbeispiele
        const style = document.createElement("style")
        style.textContent = `
        .language-examples {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
            margin: 20px 0;
        }
        
        .language-example {
            border: 1px solid #ddd;
            border-radius: 8px;
            padding: 15px;
            background-color: #f9f9f9;
        }
        
        .language-example h3 {
            margin-top: 0;
            font-size: 18px;
            border-bottom: 1px solid #eee;
            padding-bottom: 8px;
        }
        
        .language-example h3 small {
            font-weight: normal;
            font-size: 14px;
            color: #666;
        }
        
        [lang="en"] {
            background-color: rgba(173, 216, 230, 0.2);
        }
        
        [lang="fr"] {
            background-color: rgba(173, 230, 216, 0.2);
        }
        
        [lang="es"] {
            background-color: rgba(230, 173, 216, 0.2);
        }
    `

        // Am Ende der Demowebseite anhängen
        document.head.appendChild(style)
        document.querySelector(".demo-content main").appendChild(demoSection)
    }
}
