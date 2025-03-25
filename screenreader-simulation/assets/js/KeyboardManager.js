/**
 * KeyboardManager class - Handles keyboard navigation and shortcuts for screenreader simulation
 */
export default class KeyboardManager {
    constructor(simulation) {
        this.simulation = simulation
        this.hotkeyPressed = false
        this.nvdaModifierActive = false // NVDA-Modifier (Insert)
        this.jawsModifierActive = false // JAWS-Modifier (Insert)
        this.voiceOverModifierActive = false // VoiceOver-Modifier (Control+Option simuliert)

        // Tracking für Modifier-Tasten
        this.modifiers = {
            ctrl: false,
            shift: false,
            alt: false,
            meta: false, // Command-Taste auf Mac
        }

        // Set up keyboard listeners
        document.addEventListener("keydown", this.handleKeyDown.bind(this))
        document.addEventListener("keyup", this.handleKeyUp.bind(this))
    }

    handleKeyDown(event) {
        // Aktualisiere Modifier-Tracking
        this.updateModifiers(event, true)

        // Skip screenreader handling if we're in an input field (to allow typing)
        // Aber bestimmte Tastenkombinationen wie Stopp-Taste trotzdem abfangen
        const isInputField =
            event.target.tagName === "INPUT" ||
            event.target.tagName === "TEXTAREA" ||
            event.target.isContentEditable

        const mode = this.simulation.currentMode

        // Sprachausgabe abbrechen bei Strg oder Escape
        if (event.key === "Control" || event.key === "Escape") {
            if (this.simulation.speechOutput) {
                this.simulation.speechOutput.stop()
                this.simulation.outputManager.speak(
                    "Sprachausgabe unterbrochen",
                    "info"
                )
                if (event.key === "Escape" && !isInputField) {
                    event.preventDefault()
                }
            }
        }

        // Wenn wir in einem Eingabefeld sind,
        // nur die wichtigsten Hotkeys abfangen und den Rest durchlassen
        if (isInputField) {
            return
        }

        // Screenreader-spezifische Modifiertasten aktivieren
        this.handleModifierKeys(event)

        // Tab-Navigation
        if (event.key === "Tab") {
            event.preventDefault()
            if (event.shiftKey) {
                this.simulation.focusManager.prevFocusableElement()
            } else {
                this.simulation.focusManager.nextFocusableElement()
            }
        }

        // Kontinuierliches Lesen starten
        if (
            (mode === "nvda" &&
                this.nvdaModifierActive &&
                event.key === "ArrowDown") ||
            (mode === "jaws" &&
                this.jawsModifierActive &&
                event.key === "ArrowDown") ||
            (mode === "voiceover" &&
                this.voiceOverModifierActive &&
                event.key === "a")
        ) {
            event.preventDefault()
            this.simulation.outputManager.speak(
                "Kontinuierliches Lesen gestartet",
                "info"
            )

            // Hier würde in einer echten Implementierung das kontinuierliche Lesen starten
            // Für die Simulation nur den Hinweis ausgeben
            this.simulation.outputManager.speak(
                "Dies ist eine Simulation des kontinuierlichen Lesens. Tatsächlich würde jetzt der gesamte Inhalt vom aktuellen Punkt an vorgelesen werden.",
                "speech"
            )
        }

        // Element-spezifische Navigation mit einzelnen Tasten
        this.handleElementNavigation(event)

        // Pfeil-Navigation für allgemeine Bewegung
        this.handleArrowNavigation(event)

        // Aktivieren von Elementen (Enter, Space)
        this.handleActivation(event)

        // Zusätzliche Screenreader-Funktionen
        this.handleScreenreaderSpecificCommands(event)
    }

    updateModifiers(event, isKeyDown) {
        // Aktualisiert den Status der Modifier-Tasten
        if (event.key === "Control" || event.key === "Ctrl")
            this.modifiers.ctrl = isKeyDown
        if (event.key === "Shift") this.modifiers.shift = isKeyDown
        if (event.key === "Alt") this.modifiers.alt = isKeyDown
        if (event.key === "Meta") this.modifiers.meta = isKeyDown // Command-Taste auf Mac
    }

    handleModifierKeys(event) {
        // NVDA und JAWS verwenden Insert als Modifier
        if (event.key === "Insert") {
            if (this.simulation.currentMode === "nvda") {
                this.nvdaModifierActive = true
                event.preventDefault()
            } else if (this.simulation.currentMode === "jaws") {
                this.jawsModifierActive = true
                event.preventDefault()
            }
        }

        // VoiceOver verwendet Control+Option als Modifier
        // Hier simulieren wir das mit Alt (Option) für einfacheres Testen
        if (
            event.key === "Alt" &&
            this.simulation.currentMode === "voiceover"
        ) {
            this.voiceOverModifierActive = true
            event.preventDefault()
        }
    }

    handleElementNavigation(event) {
        // Navigation zu spezifischen Elementen (Überschriften, Links, Formularelemente usw.)
        const key = event.key.toLowerCase()
        const shift = event.shiftKey

        // Überschriften
        if (key === "h") {
            if (shift) {
                // Vorherige Überschrift
                this.simulation.focusManager.navigateByType(
                    "h1, h2, h3, h4, h5, h6",
                    true
                )
                this.simulation.outputManager.speak(
                    "Navigation: Vorherige Überschrift",
                    "navigation"
                )
            } else {
                // Nächste Überschrift
                this.simulation.focusManager.navigateByType(
                    "h1, h2, h3, h4, h5, h6"
                )
                this.simulation.outputManager.speak(
                    "Navigation: Überschrift",
                    "navigation"
                )
            }
        }

        // Überschriftsebenen (1-6)
        else if (["1", "2", "3", "4", "5", "6"].includes(key)) {
            const level = key
            if (shift) {
                // Vorherige Überschrift dieser Ebene
                this.simulation.focusManager.navigateByType(`h${level}`, true)
                this.simulation.outputManager.speak(
                    `Navigation: Vorherige Überschrift Ebene ${level}`,
                    "navigation"
                )
            } else {
                // Nächste Überschrift dieser Ebene
                this.simulation.focusManager.navigateByType(`h${level}`)
                this.simulation.outputManager.speak(
                    `Navigation: Überschrift Ebene ${level}`,
                    "navigation"
                )
            }
        }

        // Buttons
        else if (key === "b") {
            if (shift) {
                this.simulation.focusManager.navigateByType("button", true)
                this.simulation.outputManager.speak(
                    "Navigation: Vorheriger Button",
                    "navigation"
                )
            } else {
                this.simulation.focusManager.navigateByType("button")
                this.simulation.outputManager.speak(
                    "Navigation: Button",
                    "navigation"
                )
            }
        }

        // Formularelemente
        else if (key === "f") {
            if (shift) {
                this.simulation.focusManager.navigateByType(
                    "input, select, textarea",
                    true
                )
                this.simulation.outputManager.speak(
                    "Navigation: Vorheriges Formularfeld",
                    "navigation"
                )
            } else {
                this.simulation.focusManager.navigateByType(
                    "input, select, textarea"
                )
                this.simulation.outputManager.speak(
                    "Navigation: Formularfeld",
                    "navigation"
                )
            }
        }

        // Tabellen
        else if (key === "t") {
            if (shift) {
                this.simulation.focusManager.navigateByType("table", true)
                this.simulation.outputManager.speak(
                    "Navigation: Vorherige Tabelle",
                    "navigation"
                )
            } else {
                this.simulation.focusManager.navigateByType("table")
                this.simulation.outputManager.speak(
                    "Navigation: Tabelle",
                    "navigation"
                )
            }
        }

        // Links
        else if (
            key === "k" ||
            (key === "l" && this.simulation.currentMode === "nvda")
        ) {
            if (shift) {
                this.simulation.focusManager.navigateByType("a", true)
                this.simulation.outputManager.speak(
                    "Navigation: Vorheriger Link",
                    "navigation"
                )
            } else {
                this.simulation.focusManager.navigateByType("a")
                this.simulation.outputManager.speak(
                    "Navigation: Link",
                    "navigation"
                )
            }
        }

        // Listen
        else if (key === "l" && this.simulation.currentMode !== "nvda") {
            if (shift) {
                this.simulation.focusManager.navigateByType("ul, ol", true)
                this.simulation.outputManager.speak(
                    "Navigation: Vorherige Liste",
                    "navigation"
                )
            } else {
                this.simulation.focusManager.navigateByType("ul, ol")
                this.simulation.outputManager.speak(
                    "Navigation: Liste",
                    "navigation"
                )
            }
        }

        // Landmarken/Regionen
        else if (key === "d" || key === "r") {
            if (shift) {
                this.simulation.focusManager.navigateByType(
                    "main, [role='main'], nav, header, footer, section",
                    true
                )
                this.simulation.outputManager.speak(
                    "Navigation: Vorherige Landmarke",
                    "navigation"
                )
            } else {
                this.simulation.focusManager.navigateByType(
                    "main, [role='main'], nav, header, footer, section"
                )
                this.simulation.outputManager.speak(
                    "Navigation: Landmarke",
                    "navigation"
                )
            }
        }

        // Absätze
        else if (key === "p") {
            if (shift) {
                this.simulation.focusManager.navigateByType("p", true)
                this.simulation.outputManager.speak(
                    "Navigation: Vorheriger Absatz",
                    "navigation"
                )
            } else {
                this.simulation.focusManager.navigateByType("p")
                this.simulation.outputManager.speak(
                    "Navigation: Absatz",
                    "navigation"
                )
            }
        }
    }

    handleArrowNavigation(event) {
        // Behandlung der Pfeiltasten für die Navigation
        const mode = this.simulation.currentMode
        const key = event.key

        // Einfache Element-Navigation (Pfeil hoch/runter)
        if (key === "ArrowDown" || key === "ArrowRight") {
            // Bei VoiceOver nur mit Modifier
            if (mode === "voiceover") {
                if (this.voiceOverModifierActive) {
                    event.preventDefault()
                    this.simulation.focusManager.nextFocusableElement()
                }
            } else {
                event.preventDefault()
                this.simulation.focusManager.nextFocusableElement()
            }
        } else if (key === "ArrowUp" || key === "ArrowLeft") {
            // Bei VoiceOver nur mit Modifier
            if (mode === "voiceover") {
                if (this.voiceOverModifierActive) {
                    event.preventDefault()
                    this.simulation.focusManager.prevFocusableElement()
                }
            } else {
                event.preventDefault()
                this.simulation.focusManager.prevFocusableElement()
            }
        }

        // Zeichen-für-Zeichen-Navigation
        if (
            this.modifiers.ctrl &&
            (key === "ArrowRight" || key === "ArrowLeft")
        ) {
            // Dies würde in einer Vollimplementierung Wort für Wort navigieren
            // Hier nur simulieren
            const direction = key === "ArrowRight" ? "nächstes" : "vorheriges"
            this.simulation.outputManager.speak(
                `Navigation: ${direction} Wort`,
                "navigation"
            )
            event.preventDefault()
        } else if (
            mode === "voiceover" &&
            this.voiceOverModifierActive &&
            this.modifiers.shift &&
            (key === "ArrowRight" || key === "ArrowLeft")
        ) {
            // VoiceOver Zeichen-Navigation
            const direction = key === "ArrowRight" ? "nächstes" : "vorheriges"
            this.simulation.outputManager.speak(
                `Navigation: ${direction} Zeichen`,
                "navigation"
            )
            event.preventDefault()
        }

        // Start/Ende der Zeile
        if (key === "Home") {
            this.simulation.outputManager.speak(
                "Navigation: Zum Anfang der Zeile",
                "navigation"
            )
            event.preventDefault()
        } else if (key === "End") {
            this.simulation.outputManager.speak(
                "Navigation: Zum Ende der Zeile",
                "navigation"
            )
            event.preventDefault()
        }
    }

    handleActivation(event) {
        // Behandlung von Enter und Leertaste zur Aktivierung von Elementen
        if (!this.simulation.focusedElement) return

        const element = this.simulation.focusedElement
        const tagName = element.tagName.toLowerCase()

        // Enter-Taste für Links und interaktive Elemente
        if (event.key === "Enter") {
            // Link aktivieren
            if (tagName === "a") {
                event.preventDefault()

                // Ankündigen, dass der Link aktiviert wird
                this.simulation.outputManager.speak(
                    `Link aktiviert: ${element.textContent.trim()}`,
                    "speech"
                )

                // Prüfen ob der Link ein Anker auf der gleichen Seite ist
                if (
                    element.getAttribute("href") &&
                    element.getAttribute("href").startsWith("#")
                ) {
                    const targetId = element.getAttribute("href").substring(1)
                    const targetElement = document.getElementById(targetId)

                    if (targetElement) {
                        // Zum Ziel scrollen und Fokus setzen
                        targetElement.scrollIntoView({
                            behavior: "smooth",
                            block: "start",
                        })
                        setTimeout(() => {
                            this.simulation.focusManager.setFocus(targetElement)
                            this.simulation.focusManager.announceElement(
                                targetElement
                            )
                        }, 500)
                    }
                } else {
                    // Bei externen Links nur simulieren
                    this.simulation.outputManager.speak(
                        `Öffnen von ${
                            element.getAttribute("href") || "unbekannter URL"
                        }`,
                        "info"
                    )
                }
            }

            // Button klicken
            else if (tagName === "button") {
                event.preventDefault()
                element.click()
                this.simulation.outputManager.speak(
                    `Button aktiviert: ${element.textContent.trim()}`,
                    "speech"
                )
            }

            // Selectbox öffnen/schließen
            else if (tagName === "select") {
                this.simulation.outputManager.speak(
                    `Selectbox geöffnet: ${
                        element.getAttribute("name") || "Auswahl"
                    }`,
                    "speech"
                )
            }

            // Checkbox oder Radio umschalten
            else if (
                tagName === "input" &&
                (element.type === "checkbox" || element.type === "radio")
            ) {
                event.preventDefault()

                // Zustand umschalten
                element.checked = !element.checked

                // Event auslösen
                const changeEvent = new Event("change", { bubbles: true })
                element.dispatchEvent(changeEvent)

                // Ankündigen des neuen Zustands
                const state = element.checked ? "aktiviert" : "deaktiviert"
                const label =
                    this.simulation.focusManager.getInputLabel(element)
                this.simulation.outputManager.speak(
                    `${
                        element.type === "checkbox" ? "Checkbox" : "Radio"
                    } ${label}: ${state}`,
                    "speech"
                )
            }
        }

        // Space zur Aktivierung (besonders für Checkboxen und Buttons)
        if (event.key === " ") {
            if (tagName === "button" || tagName === "a") {
                event.preventDefault()
                this.simulation.outputManager.speak(
                    `Aktiviert: ${element.textContent.trim()}`,
                    "speech"
                )
                element.click()
            } else if (
                tagName === "input" &&
                (element.type === "checkbox" || element.type === "radio")
            ) {
                event.preventDefault()
                element.click()
                const state = element.checked ? "aktiviert" : "deaktiviert"
                const label =
                    this.simulation.focusManager.getInputLabel(element)
                this.simulation.outputManager.speak(
                    `${
                        element.type === "checkbox" ? "Checkbox" : "Radio"
                    } ${label}: ${state}`,
                    "speech"
                )
            }
        }
    }

    handleScreenreaderSpecificCommands(event) {
        // Screenreader-spezifische Befehle und Sonderfunktionen
        const mode = this.simulation.currentMode
        const key = event.key.toLowerCase()

        // NVDA-spezifische Kommandos
        if (mode === "nvda" && this.nvdaModifierActive) {
            // NVDA+Tab: Aktuelles Element beschreiben
            if (key === "tab") {
                event.preventDefault()
                this.describeCurrentElement()
            }
            // NVDA+T: Seitentitel vorlesen
            else if (key === "t") {
                event.preventDefault()
                this.simulation.outputManager.speak(
                    `Seitentitel: ${document.title}`,
                    "speech"
                )
            }
            // NVDA+Leertaste: Fokus-/Formular-Modus umschalten
            else if (key === " ") {
                event.preventDefault()
                this.simulation.outputManager.speak(
                    "Formularmodus umgeschaltet",
                    "info"
                )
            }
        }

        // JAWS-spezifische Kommandos
        else if (mode === "jaws" && this.jawsModifierActive) {
            // JAWS+F1: Hilfe
            if (key === "f1") {
                event.preventDefault()
                this.simulation.showHelp()
            }
            // JAWS+Tab: Aktuelles Element beschreiben
            else if (key === "tab") {
                event.preventDefault()
                this.describeCurrentElement()
            }
            // JAWS+T: Seitentitel vorlesen
            else if (key === "t") {
                event.preventDefault()
                this.simulation.outputManager.speak(
                    `Seitentitel: ${document.title}`,
                    "speech"
                )
            }
        }

        // VoiceOver-spezifische Kommandos
        else if (mode === "voiceover" && this.voiceOverModifierActive) {
            // VO+H: Hilfe
            if (key === "h") {
                event.preventDefault()
                this.simulation.showHelp()
            }
            // VO+F3: Aktuelles Element beschreiben
            else if (key === "f3") {
                event.preventDefault()
                this.describeCurrentElement()
            }
            // VO+Umschalt+T: Seitentitel vorlesen
            else if (key === "t" && this.modifiers.shift) {
                event.preventDefault()
                this.simulation.outputManager.speak(
                    `Seitentitel: ${document.title}`,
                    "speech"
                )
            }
            // VO+Leertaste: Element aktivieren
            else if (key === " " && this.simulation.focusedElement) {
                event.preventDefault()
                const element = this.simulation.focusedElement
                if (element.tagName === "BUTTON" || element.tagName === "A") {
                    element.click()
                    this.simulation.outputManager.speak(
                        `Aktiviert: ${element.textContent.trim()}`,
                        "speech"
                    )
                } else if (
                    element.tagName === "INPUT" &&
                    (element.type === "checkbox" || element.type === "radio")
                ) {
                    element.click()
                }
            }
        }
    }

    describeCurrentElement() {
        // Detaillierte Beschreibung des aktuellen Elements
        if (this.simulation.focusedElement) {
            const element = this.simulation.focusedElement
            let description = "Aktuelles Element: "

            // Element-Typ
            description += `${element.tagName.toLowerCase()}`

            // Rolle
            if (element.getAttribute("role")) {
                description += `, Rolle: ${element.getAttribute("role")}`
            }

            // ID
            if (element.id) {
                description += `, ID: ${element.id}`
            }

            // Klassen
            if (element.className) {
                description += `, Klassen: ${element.className}`
            }

            // Attribute sammeln
            const importantAttrs = [
                "aria-label",
                "aria-describedby",
                "aria-labelledby",
                "alt",
                "title",
                "href",
                "src",
                "for",
            ]
            const attributes = []

            importantAttrs.forEach((attr) => {
                if (element.hasAttribute(attr)) {
                    attributes.push(`${attr}="${element.getAttribute(attr)}"`)
                }
            })

            if (attributes.length > 0) {
                description += `, Attribute: ${attributes.join(", ")}`
            }

            this.simulation.outputManager.speak(description, "info")
        } else {
            this.simulation.outputManager.speak("Kein Element im Fokus", "info")
        }
    }

    handleKeyUp(event) {
        // Aktualisiere Modifier-Tracking
        this.updateModifiers(event, false)

        // Reset der Screenreader-Modifier
        if (event.key === "Insert") {
            this.nvdaModifierActive = false
            this.jawsModifierActive = false
        }

        if (
            event.key === "Alt" &&
            this.simulation.currentMode === "voiceover"
        ) {
            this.voiceOverModifierActive = false
        }
    }
}
