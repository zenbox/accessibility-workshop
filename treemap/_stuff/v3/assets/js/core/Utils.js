/**
 *    @version v3
 */

// core/Utils.js - Hilfsfunktionen
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

    /**
     * Kürzt einen Text auf eine bestimmte Länge
     * @param {string} text - Ursprünglicher Text
     * @param {number} maxLength - Maximale Länge
     * @returns {string} - Gekürzter Text
     */
    static truncateText(text, maxLength = 100) {
        if (!text || text.length <= maxLength) return text
        return text.substring(0, maxLength) + "..."
    }

    /**
     * Gibt die Farbe in Abhängigkeit von Helligkeit zurück (für Kontrast)
     * @param {string} bgColor - Hintergrundfarbe in hex oder rgb
     * @returns {string} - 'black' oder 'white' in Abhängigkeit vom Kontrast
     */
    static getContrastColor(bgColor) {
        // Konvertiere die Farbe in RGB-Werte
        let r, g, b

        if (bgColor.startsWith("#")) {
            const hex = bgColor.substring(1)
            r = parseInt(hex.slice(0, 2), 16)
            g = parseInt(hex.slice(2, 4), 16)
            b = parseInt(hex.slice(4, 6), 16)
        } else if (bgColor.startsWith("rgb")) {
            const match = bgColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/i)
            if (match) {
                ;[, r, g, b] = match.map(Number)
            } else {
                return "black"
            }
        } else {
            return "black"
        }

        // Berechne die Helligkeit nach einer gängigen Formel
        const brightness = (r * 299 + g * 587 + b * 114) / 1000

        // Wenn die Helligkeit > 128 ist, verwende schwarzen Text, sonst weißen
        return brightness > 128 ? "black" : "white"
    }
}
