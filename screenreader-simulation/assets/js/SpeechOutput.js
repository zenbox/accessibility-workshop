/**
 * SpeechOutput class - Optimierte Version mit Workaround für fehlende Browser-Berechtigung
 */
export default class SpeechOutput {
    constructor() {
        // Sprachsynthese initialisieren
        this.synth = window.speechSynthesis
        this.voices = []
        this.preferredVoice = null
        this.isActive = true
        this.rate = 1.0
        this.pitch = 1.0
        this.volume = 1.0
        this.languageVoiceCache = {}
        this.pendingUtterances = []
        this.isProcessingQueue = false
        this.initialized = false
        this.permissionGranted = false
        this.forcedPermissionAttempted = false

        this.debugMode = false // Für detailliertere Logs

        // Stimmen laden
        this.loadVoices()

        // Event-Listener für das Laden von Stimmen
        if (speechSynthesis.onvoiceschanged !== undefined) {
            speechSynthesis.onvoiceschanged = this.loadVoices.bind(this)
        }

        // Intensives Tracking für Benutzerinteraktionen
        this.setupInteractionTracking()

        // Periodische Prüfung des Sprachsynthese-Status
        this.setupWatchdog()

        // Zeitverzögerte Prüfung und ggf. forcierte Initialisierung
        setTimeout(() => this.forceSpeechPermission(), 1000)

        // Sichtbare Benachrichtigung hinzufügen, wenn Berechtigungen erforderlich sind
        this.setupPermissionNotification()
    }

    /**
     * Fügt eine sichtbare Benachrichtigung zur Seite hinzu, wenn Sprachausgabe-Berechtigungen erforderlich sind
     */
    setupPermissionNotification() {
        // Bestehende Benachrichtigung entfernen, falls vorhanden
        const existingNotification = document.getElementById(
            "speech-permission-notification"
        )
        if (existingNotification) {
            existingNotification.remove()
        }

        // Neue Benachrichtigung erstellen
        const notification = document.createElement("div")
        notification.id = "speech-permission-notification"
        notification.style.cssText = `
            position: fixed;
            top: 70px;
            left: 50%;
            transform: translateX(-50%);
            background-color: #ffeb3b;
            color: #333;
            padding: 10px 20px;
            border-radius: 4px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            z-index: 10000;
            font-size: 14px;
            max-width: 90%;
            text-align: center;
            display: none;
        `

        notification.innerHTML = `
            <p><strong>Sprachausgabe erfordert Benutzerinteraktion</strong></p>
            <p>Klicken Sie irgendwo auf die Seite oder drücken Sie eine Taste, um die Sprachausgabe zu aktivieren.</p>
            <button id="speech-activate-button" 
                    style="background: #4a90e2; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer; margin-top: 5px;">
                Jetzt aktivieren
            </button>
        `

        document.body.appendChild(notification)

        // Event-Listener für den Button
        const activateButton = document.getElementById("speech-activate-button")
        if (activateButton) {
            activateButton.addEventListener("click", () => {
                document.dispatchEvent(new Event("click"))
                notification.style.display = "none"
            })
        }

        // Nur anzeigen, wenn nach 3 Sekunden keine erfolgreiche Sprachausgabe erfolgt ist
        setTimeout(() => {
            if (!this.permissionGranted) {
                notification.style.display = "block"

                // Nach 8 Sekunden automatisch ausblenden
                setTimeout(() => {
                    notification.style.display = "none"
                }, 8000)
            }
        }, 3000)
    }

    /**
     * Versucht aggressiv, die Sprachausgabe-Berechtigung zu erhalten
     */
    forceSpeechPermission() {
        if (this.permissionGranted || this.forcedPermissionAttempted) return

        this.forcedPermissionAttempted = true
        this.log("Versuche forcierte Sprachausgabe-Berechtigung zu erhalten...")

        try {
            // 1. Versuche mit einem leeren Text (für einige Browser ausreichend)
            const emptyUtterance = new SpeechSynthesisUtterance("")
            emptyUtterance.volume = 0 // Stumm
            emptyUtterance.onend = () => {
                this.log(
                    "Leere Utterance erfolgreich - Berechtigung wahrscheinlich erteilt"
                )
                this.permissionGranted = true
                this.processPendingUtterances()
            }
            emptyUtterance.onerror = (e) => {
                this.log("Fehler bei leerer Utterance:", e.error)

                // 2. Falls der erste Versuch fehlschlägt, mit kürzestem Ton versuchen
                setTimeout(() => {
                    try {
                        // Auf Safari funktioniert manchmal ein Punkt besser als leerer Text
                        const dotUtterance = new SpeechSynthesisUtterance(".")
                        dotUtterance.volume = 0.1 // Sehr leise, aber nicht stumm
                        dotUtterance.rate = 2.0 // Schnell

                        // Minimale deutsche Stimme verwenden
                        const germanVoice = this.findVoiceForLanguage("de")
                        if (germanVoice) {
                            dotUtterance.voice = germanVoice
                            dotUtterance.lang = germanVoice.lang
                        }

                        dotUtterance.onend = () => {
                            this.log(
                                "Punkt-Utterance erfolgreich - Berechtigung erteilt"
                            )
                            this.permissionGranted = true
                            this.processPendingUtterances()
                        }

                        this.synth.speak(dotUtterance)
                    } catch (err) {
                        this.log("Auch zweiter Versuch fehlgeschlagen:", err)
                    }
                }, 100)
            }

            this.synth.speak(emptyUtterance)
        } catch (error) {
            this.log(
                "Fehler beim Versuch, Sprachausgabe-Berechtigung zu erzwingen:",
                error
            )
        }
    }

    /**
     * Verbesserte Tracking-Funktion für Benutzerinteraktionen
     */
    setupInteractionTracking() {
        // Umfassendere Liste von Ereignissen für Benutzerinteraktionen
        const interactionEvents = [
            "click",
            "touchstart",
            "touchend",
            "mousedown",
            "mouseup",
            "keydown",
            "keyup",
            "scroll",
            "focus",
            "blur",
            "change",
            "input",
        ]

        const handleInteraction = () => {
            if (this.permissionGranted) return // Bereits aktiviert

            this.log(
                "Benutzerinteraktion erkannt - versuche Sprachausgabe zu initialisieren"
            )

            // Kleine Verzögerung, um Browserverhalten zu respektieren
            setTimeout(() => {
                // Erneut versuchen, Berechtigung zu erhalten
                this.forceSpeechPermission()

                // Ausstehende Utterances verarbeiten
                this.processPendingUtterances()
            }, 50)
        }

        // Event-Listener für alle Interaktionstypen hinzufügen
        interactionEvents.forEach((eventType) => {
            document.addEventListener(eventType, handleInteraction, {
                once: false,
                passive: true,
            })
        })

        // Click-Simulation (als letzter Ausweg)
        setTimeout(() => {
            if (!this.permissionGranted && this.pendingUtterances.length > 0) {
                this.log("Automatische Interaktionssimulation...")
                document.dispatchEvent(new Event("click"))
            }
        }, 5000)
    }

    /**
     * Prüft regelmäßig den Zustand der Sprachsynthese
     */
    setupWatchdog() {
        // Chrome hat manchmal ein Problem, bei dem die Sprachsynthese hängen bleibt
        setInterval(() => {
            // Wenn wir Utterances in der Warteschlange haben, aber nichts passiert
            if (
                this.pendingUtterances.length > 0 &&
                !this.synth.speaking &&
                !this.isProcessingQueue
            ) {
                this.log(
                    "Watchdog: Ausstehende Utterances vorhanden, aber keine aktive Sprachausgabe"
                )
                this.processPendingUtterances()
            }

            // Prüfen auf hängengebliebene Sprachausgabe
            if (this.synth.speaking && this.synth.paused) {
                this.log(
                    "Watchdog: Hängengebliebene Sprachausgabe erkannt - setze zurück"
                )
                try {
                    this.synth.resume()
                } catch (e) {
                    // Ignorieren
                }
            }
        }, 3000)
    }

    /**
     * Lädt verfügbare Stimmen
     */
    loadVoices() {
        this.log("Lade Stimmen...")

        try {
            this.voices = this.synth.getVoices()
            this.log(`Loaded ${this.voices.length} voices`)

            if (this.voices.length > 0) {
                // Sprachen-Cache leeren und neu aufbauen
                this.languageVoiceCache = {}

                // Sprachen-Cache mit verfügbaren Stimmen füllen
                this.voices.forEach((voice) => {
                    const langCode = voice.lang.split("-")[0] // Basissprache (z.B. 'de' aus 'de-DE')
                    if (!this.languageVoiceCache[langCode]) {
                        this.languageVoiceCache[langCode] = []
                    }
                    this.languageVoiceCache[langCode].push(voice)
                })

                // Standard-Stimme für Deutsch finden
                this.preferredVoice =
                    this.findVoiceForLanguage("de") ||
                    this.voices.find((voice) => voice.default) ||
                    (this.voices.length > 0 ? this.voices[0] : null)

                this.log(
                    "Preferred voice set to:",
                    this.preferredVoice
                        ? `${this.preferredVoice.name} (${this.preferredVoice.lang})`
                        : "none"
                )

                this.initialized = true

                // Stimmen-Test mit minimaler Lautstärke
                this.testVoice()
            }
        } catch (error) {
            this.log("Error loading voices:", error)
        }
    }

    /**
     * Führt einen leisen Test der Sprachsynthese durch
     */
    testVoice() {
        if (this.voices.length > 0 && this.isActive) {
            this.log("Testing voice with silent utterance...")
            const testUtterance = new SpeechSynthesisUtterance("")
            testUtterance.volume = 0 // Silent test

            // Error-Handler
            testUtterance.onerror = (event) => {
                this.log("Test voice error:", event.error)

                if (event.error === "not-allowed") {
                    // Benötigt Benutzerinteraktion
                    const notificationElement = document.getElementById(
                        "speech-permission-notification"
                    )
                    if (notificationElement) {
                        notificationElement.style.display = "block"
                    }
                }
            }

            // Erfolgs-Handler
            testUtterance.onend = () => {
                this.log("Test voice succeeded")
                this.permissionGranted = true

                // Benachrichtigung ausblenden, falls vorhanden
                const notificationElement = document.getElementById(
                    "speech-permission-notification"
                )
                if (notificationElement) {
                    notificationElement.style.display = "none"
                }

                // Ausstehende Utterances verarbeiten
                this.processPendingUtterances()
            }

            try {
                this.synth.speak(testUtterance)
            } catch (e) {
                this.log("Error during test voice:", e)
            }
        }
    }

    /**
     * Findet die beste Stimme für eine bestimmte Sprache
     * @param {string} langCode - Sprachcode (z.B. 'de', 'en', 'fr')
     * @returns {SpeechSynthesisVoice} - Passende Stimme oder null
     */
    findVoiceForLanguage(langCode) {
        if (!langCode) return this.preferredVoice

        // Google-Stimmen bevorzugen, falls vorhanden
        const googleVoices = this.voices.filter(
            (v) => v.name.includes("Google") && v.lang.startsWith(langCode)
        )

        if (googleVoices.length > 0) {
            return googleVoices[0]
        }

        // Exakte Sprachversion prüfen
        const exactMatches = this.voices.filter((v) =>
            v.lang.startsWith(langCode + "-")
        )
        if (exactMatches.length > 0) {
            // Native Stimme bevorzugen
            const nativeVoice = exactMatches.find((v) => v.localService)
            return nativeVoice || exactMatches[0]
        }

        // Nach Basissprache ohne Region suchen
        const baseMatches = this.voices.filter((v) =>
            v.lang.startsWith(langCode)
        )
        if (baseMatches.length > 0) {
            const nativeVoice = baseMatches.find((v) => v.localService)
            return nativeVoice || baseMatches[0]
        }

        // Aus dem Cache abrufen, falls vorhanden
        if (
            this.languageVoiceCache[langCode] &&
            this.languageVoiceCache[langCode].length > 0
        ) {
            return this.languageVoiceCache[langCode][0]
        }

        return this.preferredVoice
    }

    /**
     * Verarbeitet ausstehende Utterances
     */
    processPendingUtterances() {
        if (this.pendingUtterances.length === 0 || this.isProcessingQueue)
            return

        this.log(
            `Processing ${this.pendingUtterances.length} pending utterances...`
        )
        this.isProcessingQueue = true

        // Aktuelle Sprachausgabe stoppen
        try {
            this.synth.cancel()
        } catch (e) {
            // Ignorieren
        }

        // Verzögerung, um sicherzustellen, dass die Sprachausgabe bereit ist
        setTimeout(() => {
            const utterance = this.pendingUtterances.shift()
            if (!utterance) {
                this.isProcessingQueue = false
                return
            }

            // Endpunkt-Handler
            utterance.onend = () => {
                this.log("Utterance completed")
                setTimeout(() => {
                    this.isProcessingQueue = false
                    this.processPendingUtterances()
                }, 50)
            }

            // Fehler-Handler
            utterance.onerror = (event) => {
                this.log("Utterance error:", event.error)
                setTimeout(() => {
                    this.isProcessingQueue = false
                    this.processPendingUtterances()
                }, 50)
            }

            try {
                this.log("Speaking:", utterance.text)
                this.synth.speak(utterance)

                // Berechtigung als erteilt markieren, wenn wir bis hierher gekommen sind
                this.permissionGranted = true
            } catch (e) {
                this.log("Error during speech:", e)
                this.isProcessingQueue = false
            }
        }, 100)
    }

    /**
     * Spricht Text unter Berücksichtigung von Sprache und Formatierungen
     * @param {string} text - Der vorzulesende Text
     * @param {string} lang - Optionaler Sprachcode (z.B. 'de', 'en', 'fr')
     */
    speak(text, lang = null) {
        if (!this.isActive || !text) return

        this.log(
            `Speaking request: "${text}"${lang ? ` (language: ${lang})` : ""}`
        )

        try {
            // Utterance erstellen
            const utterance = new SpeechSynthesisUtterance(text)

            // Sprache und Stimme setzen
            if (lang) {
                utterance.lang = lang
                const voice = this.findVoiceForLanguage(lang)
                if (voice) {
                    utterance.voice = voice
                }
            } else {
                utterance.voice = this.preferredVoice
                if (this.preferredVoice && this.preferredVoice.lang) {
                    utterance.lang = this.preferredVoice.lang
                }
            }

            // Sprecheinstellungen anwenden
            utterance.rate = this.rate
            utterance.pitch = this.pitch
            utterance.volume = this.volume

            // Feedback für Browser-Konsole (nur im Debug-Modus)
            if (this.debugMode) {
                this.log(
                    `Using voice: ${
                        utterance.voice ? utterance.voice.name : "default"
                    }, lang: ${utterance.lang || "default"}`
                )
            }

            // Wenn wir bereits Sprachausgabe-Berechtigung haben, direkt sprechen
            if (this.permissionGranted) {
                // Aktuelle Sprachausgabe stoppen
                this.synth.cancel()

                // Neue Sprachausgabe starten
                this.synth.speak(utterance)
            } else {
                // Ansonsten in Warteschlange stellen
                this.pendingUtterances.push(utterance)
                this.log(
                    "Text in Warteschlange gestellt (warte auf Berechtigung)"
                )

                // Benachrichtigung anzeigen
                const notificationElement = document.getElementById(
                    "speech-permission-notification"
                )
                if (notificationElement) {
                    notificationElement.style.display = "block"
                }
            }
        } catch (error) {
            this.log("Error in speak:", error)
        }
    }

    /**
     * Schaltet die Sprachausgabe ein oder aus
     * @returns {boolean} - Neuer Status
     */
    toggle() {
        this.isActive = !this.isActive

        // Wenn deaktiviert, laufende Sprachausgabe stoppen
        if (!this.isActive) {
            this.stop()
        }

        return this.isActive
    }

    /**
     * Setzt die Sprechgeschwindigkeit
     * @param {number} rate - Geschwindigkeit zwischen 0.1 und 10.0
     */
    setRate(rate) {
        this.rate = Math.max(0.1, Math.min(10, rate))
    }

    /**
     * Setzt die Tonhöhe
     * @param {number} pitch - Tonhöhe zwischen 0 und 2
     */
    setPitch(pitch) {
        this.pitch = Math.max(0, Math.min(2, pitch))
    }

    /**
     * Setzt die Lautstärke
     * @param {number} volume - Lautstärke zwischen 0 und 1
     */
    setVolume(volume) {
        this.volume = Math.max(0, Math.min(1, volume))
    }

    /**
     * Stoppt die aktuelle Sprachausgabe
     */
    stop() {
        this.synth.cancel()
    }

    /**
     * Pausiert die aktuelle Sprachausgabe
     */
    pause() {
        this.synth.pause()
    }

    /**
     * Setzt eine pausierte Sprachausgabe fort
     */
    resume() {
        this.synth.resume()
    }

    /**
     * Prüft, ob gerade gesprochen wird
     * @returns {boolean} - true wenn Sprachausgabe aktiv
     */
    isSpeaking() {
        return this.synth.speaking
    }

    /**
     * Prüft, ob die Sprachausgabe pausiert ist
     * @returns {boolean} - true wenn Sprachausgabe pausiert
     */
    isPaused() {
        return this.synth.paused
    }

    /**
     * Protokolliert Nachrichten mit Präfix
     */
    log(...args) {
        if (this.debugMode) {
            console.log(
                "%cSpeechOutput:",
                "color: #4a90e2; font-weight: bold",
                ...args
            )
        }
    }
}
