/**
 *    @version v3
 */

// ui/UIComponentFactory.js - Factory für UI-Komponenten
class UIComponentFactory {
    constructor(uiRegistry) {
        this.uiRegistry = uiRegistry
    }

    /**
     * Erstellt einen Button
     * @param {string} text - Text des Buttons
     * @param {object} options - Konfigurationsoptionen
     * @returns {HTMLElement} - Button-Element
     */
    createButton(text, options = {}) {
        const {
            icon = null,
            type = "standard", // standard, primary, secondary, icon
            size = "medium", // small, medium, large
            onClick = null,
            attributes = {},
            classes = [],
        } = options

        // Basis-Klassen für Button
        const buttonClasses = [
            "ui-button",
            `ui-button-${type}`,
            `ui-button-${size}`,
            ...classes,
        ]

        // Erstelle Button-Element
        const button = this.uiRegistry.createElement("button", {
            class: buttonClasses.join(" "),
            ...attributes,
        })

        // Füge Icon hinzu, wenn vorhanden
        if (icon) {
            const iconElement = this.createIcon(icon)
            button.appendChild(iconElement)
        }

        // Füge Text hinzu, wenn vorhanden
        if (text) {
            const textSpan = document.createElement("span")
            textSpan.textContent = text
            button.appendChild(textSpan)
        }

        // Füge Event-Listener hinzu
        if (onClick && typeof onClick === "function") {
            button.addEventListener("click", onClick)
        }

        return button
    }

    /**
     * Erstellt ein Icon-Element
     * @param {string} name - Name des Icons (Material Icons)
     * @param {object} options - Konfigurationsoptionen
     * @returns {HTMLElement} - Icon-Element
     */
    createIcon(name, options = {}) {
        const {
            size = "medium", // small, medium, large
            classes = [],
        } = options

        const iconClasses = ["material-icons", `icon-${size}`, ...classes]

        const iconElement = this.uiRegistry.createElement("span", {
            class: iconClasses.join(" "),
        })

        iconElement.textContent = name

        return iconElement
    }

    /**
     * Erstellt ein Kartenelement (z.B. für Prüfschritte)
     * @param {object} data - Daten für die Karte
     * @param {object} options - Konfigurationsoptionen
     * @returns {HTMLElement} - Karten-Element
     */
    createCard(data, options = {}) {
        const {
            type = "default", // default, section, pruefschritt
            sectionIndex = 0,
            onClick = null,
            onMouseEnter = null,
            onMouseLeave = null,
            parent = null,
        } = options

        // Klassen basierend auf Typ
        let cardClasses = ["card"]

        if (type === "section") {
            cardClasses.push("section-card")
        } else if (type === "pruefschritt") {
            cardClasses.push("pruefschritt-card")
        }

        // Füge Sektionsklasse hinzu
        if (sectionIndex > 0) {
            cardClasses.push(`section-${sectionIndex}`)
        }

        // Erstelle Card-Element
        const card = this.uiRegistry.createElement("div", {
            class: cardClasses.join(" "),
            tabindex: type === "pruefschritt" ? "0" : null,
        })

        // Setze Daten als Eigenschaft
        if (data) {
            card.pruefschrittData = data
        }

        // Erstelle inneren Inhalt basierend auf Typ
        if (type === "section") {
            card.textContent = data.title
        } else if (type === "pruefschritt") {
            // Konformitätslevel-Element
            if (data.conformanceLevel) {
                const levelElement = document.createElement("div")
                levelElement.className = data.conformanceLevel
                levelElement.textContent = data.conformanceLevel
                card.appendChild(levelElement)
            }

            // IDs anzeigen
            if (data.wcagId) {
                const wcagIdElement = document.createElement("div")
                wcagIdElement.className = "wcag-id"
                wcagIdElement.textContent = `WCAG ${data.wcagId}`
                card.appendChild(wcagIdElement)
            }

            if (data.bitvId) {
                const bitvIdElement = document.createElement("div")
                bitvIdElement.className = "bitv-id"
                bitvIdElement.textContent = `BITV ${data.bitvId}`
                card.appendChild(bitvIdElement)
                card.classList.add("is-bitv")
            }

            // Titel hinzufügen
            card.appendChild(document.createTextNode(data.title))

            // Hat Beschreibung?
            if (data.details?.description) {
                card.classList.add("has-information")
            }

            // Füge einen "Hinzufügen zu Thema"-Button hinzu
            this.addThemeButtonToCard(card, data)
        }

        // Event-Listener
        if (onClick) card.addEventListener("click", onClick)
        if (onMouseEnter) card.addEventListener("mouseenter", onMouseEnter)
        if (onMouseLeave) card.addEventListener("mouseleave", onMouseLeave)

        // Füge Card zum Elternelement hinzu, wenn angegeben
        if (parent) {
            parent.appendChild(card)
        }

        return card
    }

    // ui/UIComponentFactory.js (Fortsetzung)
    /**
     * Fügt einen "Hinzufügen zu Thema"-Button zur Karte hinzu
     * @param {HTMLElement} card - Die Prüfschritt-Karte
     * @param {object} data - Daten des Prüfschritts
     */
    addThemeButtonToCard(card, data) {
        // Erstelle den Button
        const addButton = document.createElement("button")
        addButton.className = "add-to-theme-button"

        // Hole das aktive Thema, falls vorhanden
        const activeThemeId = document.body.dataset.activeThemeId
        const themeManager = ThemeManager.getInstance()

        if (activeThemeId && themeManager.getThemeById(activeThemeId)) {
            // Wenn aktives Thema vorhanden, zeige spezielles Icon
            const activeTheme = themeManager.getThemeById(activeThemeId)
            addButton.innerHTML =
                '<span class="material-icons">playlist_add</span>'
            addButton.title = `Zu "${activeTheme.title}" hinzufügen`
            addButton.classList.add("active-theme-add")

            // Prüfe, ob der Prüfschritt bereits im aktiven Thema ist
            if (activeTheme.hasCriterion(data.id)) {
                addButton.innerHTML =
                    '<span class="material-icons">check</span>'
                addButton.title = `Bereits in "${activeTheme.title}" enthalten`
                addButton.classList.add("already-added")
            }
        } else {
            // Standardbutton
            addButton.innerHTML = '<span class="material-icons">add</span>'
            addButton.title = "Zu einem Thema hinzufügen"
        }

        // Event-Listener für Klick
        addButton.addEventListener("click", (e) => {
            e.stopPropagation() // Verhindert, dass die Karte geöffnet wird

            // Bei bereits hinzugefügten Prüfschritten keine Aktion
            if (addButton.classList.contains("already-added")) {
                return
            }

            const eventBus = EventBus.getGlobalInstance()
            eventBus.publish("theme:add-criterion-request", {
                card,
                criterion: data,
                button: addButton,
            })
        })

        // Button zur Karte hinzufügen
        card.appendChild(addButton)
    }

    /**
     * Erstellt eine Themen-Karte
     * @param {ThemeModel} theme - Das Thema-Objekt
     * @param {object} options - Konfigurationsoptionen
     * @returns {HTMLElement} - Themen-Karten-Element
     */
    createThemeCard(theme, options = {}) {
        const {
            isActive = false,
            onHeaderClick = null,
            onCopyClick = null,
            onEditClick = null,
            onDeleteClick = null,
            highlightTerm = "",
            parent = null,
        } = options

        // Erstelle Themen-Element
        const themeElement = document.createElement("div")
        themeElement.className = "theme-item"
        themeElement.dataset.id = theme.id

        // Aktives Thema markieren
        if (isActive) {
            themeElement.classList.add("theme-collecting-active")
        }

        // Metainformationen formatieren
        const dateCreated = theme.created
            ? `Erstellt: ${this.formatDateTime(theme.created)}`
            : ""

        const dateModified = theme.lastModified
            ? `Geändert: ${this.formatDateTime(theme.lastModified)}`
            : ""

        const metaInfo = [
            theme.author
                ? `Autor: ${this.highlightText(theme.author, highlightTerm)}`
                : "",
            dateCreated,
            dateModified,
        ]
            .filter(Boolean)
            .join(" | ")

        // Header erstellen
        const header = document.createElement("div")
        header.className = "theme-header"
        header.innerHTML = `
      <div class="theme-title-section">
        <span class="material-icons accordion-icon">expand_more</span>
        <h5 class="theme-title">${this.highlightText(
            theme.title,
            highlightTerm
        )}</h5>
      </div>
      <div class="theme-actions">
        <button class="theme-action-icon copy-theme" title="In Zwischenablage kopieren">
          <span class="material-icons">content_copy</span>
        </button>
        <button class="theme-action-icon edit-theme" title="Bearbeiten">
          <span class="material-icons">edit</span>
        </button>
        <button class="theme-action-icon delete-theme" title="Löschen">
          <span class="material-icons">delete</span>
        </button>
      </div>
    `

        themeElement.appendChild(header)

        // Metainfo hinzufügen, wenn vorhanden
        if (metaInfo) {
            const metaElement = document.createElement("div")
            metaElement.className = "theme-meta"
            metaElement.innerHTML = metaInfo
            themeElement.appendChild(metaElement)
        }

        // Inhalt erstellen
        const content = document.createElement("div")
        content.className = "theme-content"

        // Beschreibung hinzufügen, wenn vorhanden
        if (theme.description) {
            const descElement = document.createElement("p")
            descElement.className = "theme-description"
            descElement.innerHTML = this.highlightText(
                theme.description,
                highlightTerm
            )
            content.appendChild(descElement)
        }

        // Prüfschritte hinzufügen
        const criteriaContainer = document.createElement("div")
        criteriaContainer.className = "theme-pruefschritte"
        criteriaContainer.innerHTML = this.renderCriteriaList(
            theme.data,
            highlightTerm
        )
        content.appendChild(criteriaContainer)

        themeElement.appendChild(content)

        // Event-Listener
        if (onHeaderClick) {
            header
                .querySelector(".theme-title-section")
                .addEventListener("click", onHeaderClick)
        }

        const copyButton = header.querySelector(".copy-theme")
        const editButton = header.querySelector(".edit-theme")
        const deleteButton = header.querySelector(".delete-theme")

        if (onCopyClick)
            copyButton.addEventListener("click", (e) => {
                e.stopPropagation()
                onCopyClick(theme.id)
            })

        if (onEditClick)
            editButton.addEventListener("click", (e) => {
                e.stopPropagation()
                onEditClick(theme.id)
            })

        if (onDeleteClick)
            deleteButton.addEventListener("click", (e) => {
                e.stopPropagation()
                onDeleteClick(theme.id)
            })

        // Zum Elternelement hinzufügen, wenn angegeben
        if (parent) {
            parent.appendChild(themeElement)
        }

        return themeElement
    }

    /**
     * Rendert die Liste der Prüfschritte
     * @param {Array} criteria - Liste der Prüfschritte
     * @param {string} highlightTerm - Suchbegriff zum Hervorheben
     * @returns {string} - HTML für die Prüfschrittliste
     */
    renderCriteriaList(criteria, highlightTerm = "") {
        if (!criteria || criteria.length === 0) {
            return '<p class="empty-pruefschritte">Keine Prüfschritte hinzugefügt. Klicken Sie das + Symbol bei Prüfschritten, um sie hinzuzufügen.</p>'
        }

        return criteria
            .map(
                (item) => `
      <div class="pruefschritt-item">
        <div class="pruefschritt-title">${this.highlightText(
            item.title,
            highlightTerm
        )}</div>
        <button class="remove-pruefschritt" data-id="${
            item.id
        }" title="Entfernen">
          <span class="material-icons">close</span>
        </button>
      </div>
    `
            )
            .join("")
    }

    /**
     * Hebt Suchbegriffe in einem Text hervor
     * @param {string} text - Der zu durchsuchende Text
     * @param {string} searchTerm - Der hervorzuhebende Suchbegriff
     * @returns {string} - Text mit hervorgehobenen Suchbegriffen
     */
    highlightText(text, searchTerm) {
        if (!searchTerm || !text) return text

        const regex = new RegExp(
            `(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`,
            "gi"
        )
        return text.replace(regex, '<span class="highlight">$1</span>')
    }

    /**
     * Formatiert ein Datum
     * @param {string} dateTime - Datum im Format DD.MM.YYYY HH:MM:SS
     * @returns {string} - Formatiertes Datum
     */
    formatDateTime(dateTime) {
        if (!dateTime) return ""

        try {
            const parts = dateTime.split(/[\s.:]/).map((part) => part.trim())
            if (parts.length >= 6) {
                return `${parts[0]}.${parts[1]}.${parts[2]} ${parts[3]}:${parts[4]}`
            }
        } catch (e) {
            console.error("Datumformatierungsfehler:", e)
        }

        return dateTime
    }
}
