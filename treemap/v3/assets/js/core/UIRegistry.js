/**
 *    @version v3
 */

// core/UIRegistry.js - Zentrale Verwaltung von DOM-Elementen
class UIRegistry {
    constructor() {
        this.elements = new Map()
        this.containers = new Map()
        this.services = new Map() // Neu: Map für Services
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
            document.querySelector(".close-button")
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
     * NEU: Registriert einen Service
     * @param {string} key - Identifikator für den Service
     * @param {Object} service - Die Service-Instanz
     */
    registerService(key, service) {
        if (!service) {
            console.warn(`Service with key '${key}' is null or undefined`)
            return
        }
        this.services.set(key, service)
    }

    /**
     * NEU: Holt einen registrierten Service
     * @param {string} key - Identifikator des Services
     * @returns {Object|null} Der Service oder null, wenn nicht gefunden
     */
    getService(key) {
        return this.services.get(key) || null
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
            if (key === "class") {
                const classes = value.split(" ").filter(Boolean)
                element.classList.add(...classes)
            } else if (key === "data") {
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
        if (content) {
            if (typeof content === "string") {
                element.innerHTML = content
            } else {
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
