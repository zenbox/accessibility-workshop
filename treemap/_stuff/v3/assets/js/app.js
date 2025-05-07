/**
 *    @version v3
 */

// app.js - Hauptanwendung und Initialisierung

/**
 * Event-Bus für Kommunikation zwischen Komponenten
 */
class EventBus {
    constructor() {
        this.subscribers = {}
    }

    /**
     * Event abonnieren
     * @param {string} event - Name des Events
     * @param {function} callback - Callback-Funktion, die bei Event-Trigger aufgerufen wird
     * @param {object} context - Kontext (this) für den Callback
     * @returns {object} Subscription-Objekt mit unsubscribe-Methode
     */
    subscribe(event, callback, context = null) {
        if (!this.subscribers[event]) {
            this.subscribers[event] = []
        }

        const subscription = { callback, context }
        this.subscribers[event].push(subscription)

        // Rückgabe eines Objekts mit unsubscribe-Methode
        return {
            unsubscribe: () => {
                this.subscribers[event] = this.subscribers[event].filter(
                    (sub) => sub !== subscription
                )
            },
        }
    }

    /**
     * Event veröffentlichen
     * @param {string} event - Name des Events
     * @param {*} data - Daten, die an Subscriber weitergegeben werden
     */
    publish(event, data) {
        if (!this.subscribers[event]) {
            return
        }

        this.subscribers[event].forEach((subscription) => {
            const { callback, context } = subscription
            callback.call(context, data)
        })
    }

    /**
     * Alle Subscriptions für ein Event entfernen
     * @param {string} event - Name des Events
     */
    clearEvent(event) {
        if (this.subscribers[event]) {
            delete this.subscribers[event]
        }
    }

    /**
     * Alle Subscriptions entfernen
     */
    clearAll() {
        this.subscribers = {}
    }
}

/**
 * Hilfsmethode für den globalen Zugriff auf den Event-Bus
 */
EventBus.getGlobalInstance = function () {
    return EventBus._globalInstance || null
}

/**
 * UI-Registry für zentrale Verwaltung von DOM-Elementen
 */
class UIRegistry {
    constructor() {
        this.elements = new Map()
        this.containers = new Map()
    }

    /**
     * Registriert wichtige UI-Elemente für einfachen Zugriff
     */
    registerElements() {
        // Hauptcontainer
        this.registerContainer(
            "treemap",
            document.querySelector(".tree-container")
        )
        this.registerContainer("filter", document.querySelector(".filter-bar"))
        this.registerContainer("modal", document.getElementById("sectionModal"))
        this.registerContainer("themes", document.getElementById("collections"))

        // Wichtige Elemente
        this.registerElement(
            "searchInput",
            document.getElementById("searchInput")
        )
        this.registerElement(
            "modalContent",
            document.getElementById("modalContent")
        )
        this.registerElement(
            "modalTitle",
            document.getElementById("modalTitle")
        )
        this.registerElement(
            "closeButton",
            document.querySelector(".modal-close")
        )
        this.registerElement(
            "filterCount",
            document.querySelector(".filter-count")
        )

        // Weitere Elemente können bei Bedarf registriert werden
    }

    /**
     * Registriert ein UI-Element
     * @param {string} key - Identifikator für das Element
     * @param {HTMLElement} element - Das DOM-Element
     */
    registerElement(key, element) {
        if (!element) {
            console.warn(`Element with key '${key}' not found in DOM`)
            return
        }
        this.elements.set(key, element)
    }

    /**
     * Holt ein registriertes Element
     * @param {string} key - Identifikator des Elements
     * @returns {HTMLElement|null} Das DOM-Element oder null, wenn nicht gefunden
     */
    getElement(key) {
        return this.elements.get(key) || null
    }

    /**
     * Registriert einen Container für dynamische Inhalte
     * @param {string} key - Identifikator für den Container
     * @param {HTMLElement} container - Das Container-Element
     */
    registerContainer(key, container) {
        if (!container) {
            console.warn(`Container with key '${key}' not found in DOM`)
            return
        }
        this.containers.set(key, container)
    }

    /**
     * Holt einen registrierten Container
     * @param {string} key - Identifikator des Containers
     * @returns {HTMLElement|null} Das Container-Element oder null, wenn nicht gefunden
     */
    getContainer(key) {
        return this.containers.get(key) || null
    }

    /**
     * Erstellt ein neues Element im DOM
     * @param {string} tag - HTML-Tag des Elements
     * @param {object} attributes - Attribute des Elements
     * @param {string|HTMLElement} content - Innerer Inhalt oder Kind-Element
     * @param {HTMLElement} parent - Elternelement, an das angehängt wird
     * @returns {HTMLElement} Das erstellte Element
     */
    createElement(tag, attributes = {}, content = null, parent = null) {
        const element = document.createElement(tag)

        // Attribute setzen
        Object.entries(attributes).forEach(([key, value]) => {
            if (key === "class" || key === "className") {
                const classes = value.split(" ").filter(Boolean)
                element.classList.add(...classes)
            } else if (key === "dataset") {
                Object.entries(value).forEach(([dataKey, dataValue]) => {
                    element.dataset[dataKey] = dataValue
                })
            } else if (key.startsWith("on") && typeof value === "function") {
                // Event-Listener
                const eventName = key.slice(2).toLowerCase()
                element.addEventListener(eventName, value)
            } else {
                element.setAttribute(key, value)
            }
        })

        // Inhalt setzen
        if (content !== null) {
            if (typeof content === "string") {
                element.innerHTML = content
            } else if (content instanceof HTMLElement) {
                element.appendChild(content)
            }
        }

        // An Elternelement anhängen
        if (parent) {
            parent.appendChild(element)
        }

        return element
    }
}

/**
 * NotificationService für System-Benachrichtigungen
 */
class NotificationService {
    constructor() {
        this.notificationElement = null
        this.timeout = null
        this.init()
    }

    /**
     * Initialisiert den Notification Service
     */
    init() {
        this.notificationElement = document.getElementById("notification")
        if (!this.notificationElement) {
            this.notificationElement = this.createNotificationElement()
        }
    }

    /**
     * Erstellt das Benachrichtigungselement im DOM
     * @returns {HTMLElement} - Das erstellte Element
     */
    createNotificationElement() {
        const notification = document.createElement("div")
        notification.id = "notification"
        notification.className = "notification"
        notification.setAttribute("role", "alert")
        document.body.appendChild(notification)
        return notification
    }

    /**
     * Zeigt eine Benachrichtigung an
     * @param {string} message - Die anzuzeigende Nachricht
     * @param {string} type - Typ der Nachricht (info, success, error, warning)
     * @param {number} duration - Anzeigedauer in ms
     */
    show(message, type = "info", duration = 3000) {
        if (!this.notificationElement) {
            this.init()
        }

        // Stoppt vorherige Timer
        if (this.timeout) {
            clearTimeout(this.timeout)
        }

        // Setzt Nachricht und Typ
        this.notificationElement.textContent = message
        this.notificationElement.className = `notification ${type}`
        this.notificationElement.classList.add("show")

        // Automatisch ausblenden nach der angegebenen Zeit
        if (duration > 0) {
            this.timeout = setTimeout(() => this.hide(), duration)
        }
    }

    /**
     * Versteckt die Benachrichtigung
     */
    hide() {
        if (this.notificationElement) {
            this.notificationElement.classList.remove("show")
        }
    }

    /**
     * Erfolgsbenachrichtigung
     * @param {string} message - Die anzuzeigende Nachricht
     * @param {number} duration - Anzeigedauer in ms
     */
    success(message, duration = 3000) {
        this.show(message, "success", duration)
    }

    /**
     * Fehlerbenachrichtigung
     * @param {string} message - Die anzuzeigende Nachricht
     * @param {number} duration - Anzeigedauer in ms
     */
    error(message, duration = 5000) {
        this.show(message, "error", duration)
    }

    /**
     * Warnungsbenachrichtigung
     * @param {string} message - Die anzuzeigende Nachricht
     * @param {number} duration - Anzeigedauer in ms
     */
    warning(message, duration = 4000) {
        this.show(message, "warning", duration)
    }
}

/**
 * Utilities-Klasse mit Hilfsfunktionen
 */
class Utils {
    /**
     * Generiert eine eindeutige ID
     * @returns {string} - Eindeutige ID
     */
    static generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substring(2)
    }

    /**
     * Formatiert das aktuelle Datum und Zeit im deutschen Format
     * @returns {string} - Formatiertes Datum (DD.MM.YYYY HH:MM:SS)
     */
    static getCurrentDateTime() {
        const now = new Date()
        const options = {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
        }
        return now.toLocaleString("de-DE", options)
    }

    /**
     * Debounce-Funktion für Performance-Optimierung
     * @param {Function} func - Funktion, die ausgeführt werden soll
     * @param {number} wait - Wartezeit in ms
     * @returns {Function} - Debounced function
     */
    static debounce(func, wait = 300) {
        let timeout
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout)
                func(...args)
            }
            clearTimeout(timeout)
            timeout = setTimeout(later, wait)
        }
    }

    /**
     * Konvertiert ein deutsches Datumsformat in ein Date-Objekt
     * @param {string} dateTimeString - Datum im Format DD.MM.YYYY HH:MM:SS
     * @returns {Date} - Date-Objekt
     */
    static parseDateTimeString(dateTimeString) {
        if (!dateTimeString) return new Date(0)

        try {
            const parts = dateTimeString
                .split(/[\s.:]/)
                .map((part) => part.trim())
            if (parts.length >= 6) {
                return new Date(
                    parts[2], // Jahr
                    parts[1] - 1, // Monat (0-basiert)
                    parts[0], // Tag
                    parts[3], // Stunde
                    parts[4], // Minute
                    parts[5] // Sekunde
                )
            }
        } catch (e) {
            console.error("Datumsparsing-Fehler:", e)
        }

        return new Date(0)
    }
}

/**
 * Warte auf DOMContentLoaded-Event bevor die Anwendung initialisiert wird
 */
document.addEventListener("DOMContentLoaded", () => {
    // Initialisiere die Anwendung
    const app = new AppController()
    app.init()
})

/**
 * Hauptsteuerungsklasse für die gesamte Anwendung
 */
class AppController {
    constructor() {
        // Initialisiere Event-Bus für Kommunikation zwischen Komponenten
        this.eventBus = new EventBus()

        // Registriere Event-Bus als globale Instanz für einfacheren Zugriff
        EventBus._globalInstance = this.eventBus

        // UI-Registry für zentrale Verwaltung von DOM-Elementen
        this.uiRegistry = new UIRegistry()

        // Notification-Service für Benutzerfeedback
        this.notificationService = new NotificationService()

        // Controller für verschiedene Funktionsbereiche
        this.treemapController = null
        this.filterController = null
        this.themeManager = null
    }

    /**
     * Initialisiert die Anwendung
     */
    async init() {
        try {
            // Registriere UI-Elemente
            this.uiRegistry.registerElements()

            // Initialisiere Controller in der richtigen Reihenfolge
            await this.initTreemapController()
            this.initFilterController()
            this.initThemeManager()

            // Initialisiere gemeinsame UI-Komponenten
            this.initUIComponents()

            console.log("BITV Treemap Application initialized")
        } catch (error) {
            console.error("Error initializing application:", error)
            this.notificationService.show(
                "Fehler beim Initialisieren der Anwendung",
                "error"
            )
        }
    }

    /**
     * Initialisiert den Treemap-Controller
     */
    async initTreemapController() {
        try {
            // Lade Daten
            const response = await fetch("./data/criterias.json")
            if (!response.ok) {
                throw new Error(`HTTP-Fehler: ${response.status}`)
            }
            const data = await response.json()

            // Initialisiere Treemap
            this.treemapController = new TreemapController(
                this.eventBus,
                this.uiRegistry,
                data
            )
            await this.treemapController.init()
        } catch (error) {
            console.error("Error initializing treemap:", error)
            throw error
        }
    }

    /**
     * Initialisiert den Filter-Controller
     */
    initFilterController() {
        this.filterController = new FilterController(
            this.eventBus,
            this.uiRegistry,
            this.treemapController
        )
        this.filterController.init()
    }

    /**
     * Initialisiert den Themen-Manager
     */
    initThemeManager() {
        this.themeManager = ThemeManager.getInstance()

        const themeView = new ThemeView(
            this.eventBus,
            this.uiRegistry,
            this.themeManager,
            this.notificationService
        )
        themeView.init()
    }

    /**
     * Initialisiert gemeinsame UI-Komponenten
     */
    initUIComponents() {
        // Initialisiere Tooltip-Service
        new TooltipService(this.uiRegistry).init()

        // Initialisiere Modal-Service
        new ModalService(this.uiRegistry).init()

        // Füge globale Event-Listener hinzu
        this.addGlobalEventListeners()
    }

    /**
     * Fügt globale Event-Listener hinzu
     */
    addGlobalEventListeners() {
        // Escape-Taste für Schließen von Dialogen, Tooltips, etc.
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape") {
                this.eventBus.publish("ui:escape-pressed")
            }
        })

        // Event für Fenstergröße geändert
        window.addEventListener(
            "resize",
            Utils.debounce(() => {
                this.eventBus.publish("ui:window-resized", {
                    width: window.innerWidth,
                    height: window.innerHeight,
                })
            }, 200)
        )

        // Print-Event für Drucken der Treemap
        window.addEventListener("beforeprint", () => {
            this.eventBus.publish("ui:before-print")
        })

        window.addEventListener("afterprint", () => {
            this.eventBus.publish("ui:after-print")
        })
    }
}
