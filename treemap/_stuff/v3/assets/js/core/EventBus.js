/**
 *    @version v3
 */

// core/EventBus.js - Event-Bus für Kommunikation zwischen Komponenten
class EventBus {
    constructor() {
        this.subscribers = {}
    }

    static getGlobalInstance() {
        if (!EventBus._globalInstance) {
            EventBus._globalInstance = new EventBus()
        }
        return EventBus._globalInstance
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
