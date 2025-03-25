/**
 *    @version v3
 */

// ui/NotificationService.js - Service für Benachrichtigungen
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
