/**
 *    @version v3
 */

// themes/ThemeView.js - UI-Komponenten für Themen
class ThemeView {
    constructor(eventBus, uiRegistry, themeManager, notificationService) {
        this.eventBus = eventBus
        this.uiRegistry = uiRegistry
        this.themeManager = themeManager
        this.notificationService = notificationService

        // Filter- und Sortierzustand
        this.filterState = {
            searchTerm: "",
            sortField: "lastModified",
            sortAscending: false,
        }
    }

    /**
     * Initialisiert die Themen-Ansicht
     */
    init() {
        // Themen-Manager-Panel erstellen und initialisieren
        this.createThemeManagerPanel()

        // Event-Listener registrieren
        this.registerEventListeners()

        // Themenliste initial rendern
        this.renderThemesList()
    }

    /**
     * Erstellt das Themen-Manager-Panel
     */
    createThemeManagerPanel() {
        // Toggle-Button für Themenmanager erstellen
        this.createToggleButton()

        // Hauptpanel erstellen
        this.createPanel()
    }

    /**
     * Erstellt den Toggle-Button für das Themen-Panel
     */
    createToggleButton() {
        const toggleButton = document.createElement("button")
        toggleButton.className = "theme-toggle-button"
        toggleButton.setAttribute("aria-label", "Themen Manager öffnen")
        toggleButton.innerHTML = '<span class="material-icons">bookmarks</span>'
        document.body.appendChild(toggleButton)

        // Event-Listener für den Button
        toggleButton.addEventListener("click", () => {
            const panel = document.querySelector(".themes-panel")
            if (panel) {
                panel.classList.toggle("visible")

                // Bei Öffnen die Themenliste aktualisieren
                if (panel.classList.contains("visible")) {
                    this.renderThemesList()
                }
            }
        })
    }

    /**
     * Erstellt das Hauptpanel für den Themen-Manager
     */
    createPanel() {
        const panel = document.createElement("div")
        panel.className = "themes-panel"

        // Panel-Header mit Drag-Handle erstellen
        const panelHeader = document.createElement("div")
        panelHeader.className = "themes-panel-header"
        panelHeader.innerHTML = `
      <div class="drag-handle"><span class="material-icons">drag_indicator</span></div>
      <h3>Themen Manager</h3>
      <div class="panel-header-actions">
        <button class="theme-toggle theme-panel-toggle" id="themePanelToggle" title="Design umschalten">
          <span class="material-icons">dark_mode</span>
        </button>
        <button class="close-button" aria-label="Schließen">
          <span class="material-icons">close</span>
        </button>
      </div>
    `

        // Panel-Inhalt erstellen
        const panelContent = document.createElement("div")
        panelContent.className = "themes-panel-content"

        // Abschnitte des Panels erstellen
        const newThemeSection = this.createNewThemeSection()
        const importThemeSection = this.createImportThemeSection()
        const searchThemeSection = this.createSearchThemeSection()
        const themesListSection = this.createThemesListSection()

        // Alles zusammenfügen
        panelContent.appendChild(newThemeSection)
        panelContent.appendChild(importThemeSection)
        panelContent.appendChild(searchThemeSection)
        panelContent.appendChild(themesListSection)

        panel.appendChild(panelHeader)
        panel.appendChild(panelContent)

        document.body.appendChild(panel)

        // Event-Listener für die Schließen-Schaltfläche
        panelHeader
            .querySelector(".close-button")
            .addEventListener("click", () => {
                panel.classList.remove("visible")
            })

        // Event-Listener für Theme-Toggle
        const themeToggle = panelHeader.querySelector("#themePanelToggle")
        themeToggle.addEventListener("click", () => this.togglePanelTheme())

        // Draggable machen
        this.makeDraggable(panel, panelHeader.querySelector(".drag-handle"))

        // Theme aus Einstellungen laden
        const settings = this.loadSettings()
        if (settings.panelTheme) {
            panel.setAttribute("data-theme", settings.panelTheme)
            themeToggle.innerHTML = `<span class="material-icons">${
                settings.panelTheme === "dark" ? "light_mode" : "dark_mode"
            }</span>`
        }

        // Position aus Einstellungen laden
        if (settings.panelPosition) {
            panel.style.right = settings.panelPosition.right
            panel.style.bottom = settings.panelPosition.bottom
        }
    }

    /**
     * Erstellt den Abschnitt zum Erstellen neuer Themen
     * @returns {HTMLElement} - Der Abschnitt als DOM-Element
     */
    createNewThemeSection() {
        const section = document.createElement("div")
        section.className = "panel-section new-theme-section"

        section.innerHTML = `
      <div class="panel-section-header">
        <h4>Neues Thema erstellen</h4>
        <button class="toggle-section-button" aria-expanded="false">
          <span class="material-icons">expand_more</span>
        </button>
      </div>
      <div class="panel-section-content" style="display: none;">
        <div class="form-group">
          <label for="themeTitle">Thementitel:</label>
          <input type="text" id="themeTitle" placeholder="Geben Sie einen Titel ein">
        </div>
        <div class="form-group">
          <label for="themeAuthor">Autor:</label>
          <input type="text" id="themeAuthor" placeholder="Geben Sie den Autor ein">
        </div>
        <div class="form-group">
          <label for="themeDescription">Beschreibung (optional):</label>
          <textarea id="themeDescription" placeholder="Beschreibung des Themas" rows="2"></textarea>
        </div>
        <div class="theme-buttons">
          <button id="saveTheme" class="theme-action-button">
            <span class="material-icons">save</span>
            Thema speichern
          </button>
          <button id="pasteTheme" class="theme-action-button secondary">
            <span class="material-icons">content_paste</span>
            Aus Ablage einfügen
          </button>
        </div>
      </div>
    `

        // Event-Listener für den Toggle-Button
        const toggleButton = section.querySelector(".toggle-section-button")
        toggleButton.addEventListener("click", () => {
            const isExpanded =
                toggleButton.getAttribute("aria-expanded") === "true"
            toggleButton.setAttribute("aria-expanded", !isExpanded)
            toggleButton.innerHTML = `<span class="material-icons">${
                !isExpanded ? "expand_less" : "expand_more"
            }</span>`

            const content = section.querySelector(".panel-section-content")
            content.style.display = !isExpanded ? "block" : "none"
        })

        // Event-Listener für die Buttons
        section
            .querySelector("#saveTheme")
            .addEventListener("click", () => this.createNewTheme())
        section
            .querySelector("#pasteTheme")
            .addEventListener("click", () => this.pasteThemeFromClipboard())

        return section
    }

    /**
     * Erstellt den Abschnitt zum Importieren von Themen
     * @returns {HTMLElement} - Der Abschnitt als DOM-Element
     */
    createImportThemeSection() {
        const section = document.createElement("div")
        section.className = "panel-section import-theme-section"

        section.innerHTML = `
      <div class="panel-section-header">
        <h4>Thema importieren</h4>
        <button class="toggle-section-button" aria-expanded="false">
          <span class="material-icons">expand_more</span>
        </button>
      </div>
      <div class="panel-section-content" style="display: none;">
        <div class="form-group">
          <label for="themeLink">Link zu JSON-Datei:</label>
          <input type="url" id="themeLink" placeholder="https://example.com/theme.json">
        </div>
        <button id="importTheme" class="theme-action-button">
          <span class="material-icons">cloud_download</span>
          Thema importieren
        </button>
      </div>
    `

        // Event-Listener für den Toggle-Button
        const toggleButton = section.querySelector(".toggle-section-button")
        toggleButton.addEventListener("click", () => {
            const isExpanded =
                toggleButton.getAttribute("aria-expanded") === "true"
            toggleButton.setAttribute("aria-expanded", !isExpanded)
            toggleButton.innerHTML = `<span class="material-icons">${
                !isExpanded ? "expand_less" : "expand_more"
            }</span>`

            const content = section.querySelector(".panel-section-content")
            content.style.display = !isExpanded ? "block" : "none"
        })

        // Event-Listener für den Import-Button
        section
            .querySelector("#importTheme")
            .addEventListener("click", () => this.importThemeFromUrl())

        return section
    }

    /**
     * Erstellt den Abschnitt zum Suchen und Sortieren von Themen
     * @returns {HTMLElement} - Der Abschnitt als DOM-Element
     */
    createSearchThemeSection() {
        const section = document.createElement("div")
        section.className = "panel-section search-theme-section"

        section.innerHTML = `
      <div class="panel-section-header">
        <h4>Themen durchsuchen</h4>
      </div>
      <div class="panel-section-content">
        <div class="filter-controls">
          <div class="search-container">
            <div class="search-input-container">
              <span class="material-icons search-icon">search</span>
              <input type="text" id="themesSearchFilter" placeholder="Nach Titel, Autor oder Inhalt filtern">
              <button id="clearThemesSearch" class="icon-button clear-button" title="Suche zurücksetzen" style="display: none;">
                <span class="material-icons">close</span>
              </button>
            </div>
          </div>
          <div class="sort-container">
            <label for="themesSortOption">Sortieren:</label>
            <select id="themesSortOption" class="filter-select">
              <option value="lastModified">Änderungsdatum</option>
              <option value="created">Erstelldatum</option>
              <option value="title">Name</option>
              <option value="author">Autor</option>
              <option value="criteriaCount">Anzahl Prüfschritte</option>
            </select>
            <button id="toggleSortDirection" class="icon-button" title="Sortierreihenfolge umkehren">
              <span class="material-icons">arrow_downward</span>
            </button>
          </div>
        </div>
      </div>
    `

        // Event-Listener für die Suchfunktionen
        const searchInput = section.querySelector("#themesSearchFilter")
        const clearButton = section.querySelector("#clearThemesSearch")
        const sortSelect = section.querySelector("#themesSortOption")
        const sortDirectionButton = section.querySelector(
            "#toggleSortDirection"
        )

        searchInput.addEventListener("input", () => {
            this.filterState.searchTerm = searchInput.value.trim()
            clearButton.style.display = this.filterState.searchTerm
                ? "flex"
                : "none"
            this.renderThemesList()
        })

        clearButton.addEventListener("click", () => {
            searchInput.value = ""
            this.filterState.searchTerm = ""
            clearButton.style.display = "none"
            this.renderThemesList()
        })

        sortSelect.addEventListener("change", () => {
            this.filterState.sortField = sortSelect.value
            this.renderThemesList()

            // Einstellungen speichern
            const settings = this.loadSettings()
            settings.themeSortField = this.filterState.sortField
            this.saveSettings(settings)
        })

        sortDirectionButton.addEventListener("click", () => {
            this.filterState.sortAscending = !this.filterState.sortAscending
            sortDirectionButton.innerHTML = `<span class="material-icons">${
                this.filterState.sortAscending
                    ? "arrow_upward"
                    : "arrow_downward"
            }</span>`
            this.renderThemesList()

            // Einstellungen speichern
            const settings = this.loadSettings()
            settings.themeSortAscending = this.filterState.sortAscending
            this.saveSettings(settings)
        })

        // Einstellungen laden
        const settings = this.loadSettings()
        if (settings.themeSortField) {
            this.filterState.sortField = settings.themeSortField
            sortSelect.value = settings.themeSortField
        }

        if (settings.themeSortAscending !== undefined) {
            this.filterState.sortAscending = settings.themeSortAscending
            sortDirectionButton.innerHTML = `<span class="material-icons">${
                this.filterState.sortAscending
                    ? "arrow_upward"
                    : "arrow_downward"
            }</span>`
        }

        return section
    }

    /**
     * Erstellt den Abschnitt für die Themenliste
     * @returns {HTMLElement} - Der Abschnitt als DOM-Element
     */
    createThemesListSection() {
        const section = document.createElement("div")
        section.className = "panel-section themes-list-section"

        section.innerHTML = `
      <div class="panel-section-header">
        <h4>Meine Themen</h4>
      </div>
      <div class="panel-section-content themes-container" id="themesContainer">
        <!-- Hier werden die Themen dynamisch eingefügt -->
      </div>
    `

        return section
    }

    /**
     * Macht ein Element per Drag-and-Drop verschiebbar
     * @param {HTMLElement} element - Das verschiebbare Element
     * @param {HTMLElement} handle - Das Element zum Anfassen (Griff)
     */
    makeDraggable(element, handle) {
        let offsetX, offsetY

        handle.addEventListener("mousedown", startDrag)

        function startDrag(e) {
            e.preventDefault()

            const rect = element.getBoundingClientRect()
            offsetX = e.clientX - rect.left
            offsetY = e.clientY - rect.top

            document.addEventListener("mousemove", onDrag)
            document.addEventListener("mouseup", stopDrag)
        }

        const themeView = this // Referenz auf die ThemeView-Instanz

        function onDrag(e) {
            const x = e.clientX - offsetX
            const y = e.clientY - offsetY

            const maxX = window.innerWidth - element.offsetWidth
            const maxY = window.innerHeight - element.offsetHeight

            const boundedX = Math.max(0, Math.min(x, maxX))
            const boundedY = Math.max(0, Math.min(y, maxY))

            // Position als rechts/unten-Abstand (für responsive Design besser)
            const right = window.innerWidth - boundedX - element.offsetWidth
            const bottom = window.innerHeight - boundedY - element.offsetHeight

            element.style.right = `${right}px`
            element.style.bottom = `${bottom}px`
        }

        function stopDrag() {
            document.removeEventListener("mousemove", onDrag)
            document.removeEventListener("mouseup", stopDrag)

            // Position speichern
            const settings = themeView.loadSettings()
            settings.panelPosition = {
                right: element.style.right,
                bottom: element.style.bottom,
            }
            themeView.saveSettings(settings)
        }
    }

    /**
     * Schaltet das Theme des Panels um (hell/dunkel)
     */
    togglePanelTheme() {
        const panel = document.querySelector(".themes-panel")
        const button = document.getElementById("themePanelToggle")

        if (!panel || !button) return

        const currentTheme = panel.getAttribute("data-theme") || "light"
        const newTheme = currentTheme === "light" ? "dark" : "light"

        panel.setAttribute("data-theme", newTheme)
        button.innerHTML = `<span class="material-icons">${
            newTheme === "light" ? "dark_mode" : "light_mode"
        }</span>`

        // Theme in Einstellungen speichern
        const settings = this.loadSettings()
        settings.panelTheme = newTheme
        this.saveSettings(settings)
    }

    /**
     * Lädt die UI-Einstellungen
     * @returns {object} - Die geladenen Einstellungen
     */
    loadSettings() {
        const defaultSettings = {
            panelTheme: "light",
            panelPosition: { right: "30px", bottom: "100px" },
            themeSortField: "lastModified",
            themeSortAscending: false,
        }

        const savedSettings = localStorage.getItem("themeUISettings")
        if (!savedSettings) return defaultSettings

        try {
            return { ...defaultSettings, ...JSON.parse(savedSettings) }
        } catch (error) {
            console.error("Fehler beim Laden der Einstellungen:", error)
            return defaultSettings
        }
    }

    /**
     * Speichert die UI-Einstellungen
     * @param {object} settings - Die zu speichernden Einstellungen
     */
    saveSettings(settings) {
        localStorage.setItem("themeUISettings", JSON.stringify(settings))
    }

    // themes/ThemeView.js - Fortsetzung
    /**
     * Registriert Event-Listener für themenbezogene Events
     */
    registerEventListeners() {
        // Listener für themenbezogene Events
        this.eventBus.subscribe(
            "theme:created",
            this.handleThemeCreated.bind(this)
        )
        this.eventBus.subscribe(
            "theme:updated",
            this.handleThemeUpdated.bind(this)
        )
        this.eventBus.subscribe(
            "theme:deleted",
            this.handleThemeDeleted.bind(this)
        )
        this.eventBus.subscribe(
            "theme:criterion-added",
            this.handleCriterionAdded.bind(this)
        )
        this.eventBus.subscribe(
            "theme:criterion-removed",
            this.handleCriterionRemoved.bind(this)
        )
        this.eventBus.subscribe(
            "theme:active-changed",
            this.handleActiveThemeChanged.bind(this)
        )

        // Listener für Anfragen zum Hinzufügen von Prüfschritten
        this.eventBus.subscribe(
            "theme:add-criterion-request",
            this.handleAddCriterionRequest.bind(this)
        )

        // DOM-Event-Listener für Prüfschritt-Entfernen-Buttons
        document.addEventListener("click", (e) => {
            if (e.target.closest(".remove-pruefschritt")) {
                const button = e.target.closest(".remove-pruefschritt")
                const criterionId = button.dataset.id
                const themeItem = button.closest(".theme-item")

                if (themeItem && criterionId) {
                    const themeId = themeItem.dataset.id
                    this.removeCriterionFromTheme(themeId, criterionId)
                }
            }
        })
    }

    /**
     * Event-Handler für Theme erstellt
     * @param {object} data - Event-Daten
     */
    handleThemeCreated(data) {
        this.notificationService.success(
            `Thema "${data.theme.title}" wurde erstellt`
        )
        this.renderThemesList()
    }

    /**
     * Event-Handler für Theme aktualisiert
     * @param {object} data - Event-Daten
     */
    handleThemeUpdated(data) {
        this.notificationService.success(
            `Thema "${data.theme.title}" wurde aktualisiert`
        )
        this.renderThemesList()
    }

    /**
     * Event-Handler für Theme gelöscht
     * @param {object} data - Event-Daten
     */
    handleThemeDeleted(data) {
        // Wenn das gelöschte Thema das aktive war, aktives Thema zurücksetzen
        if (document.body.dataset.activeThemeId === data.themeId) {
            this.themeManager.setActiveTheme(null)
        }

        this.notificationService.success(`Thema wurde gelöscht`)
        this.renderThemesList()
    }

    /**
     * Event-Handler für Prüfschritt hinzugefügt
     * @param {object} data - Event-Daten
     */
    handleCriterionAdded(data) {
        this.notificationService.success(
            `Prüfschritt wurde zu "${data.theme.title}" hinzugefügt`
        )
        this.renderThemesList()
    }

    /**
     * Event-Handler für Prüfschritt entfernt
     * @param {object} data - Event-Daten
     */
    handleCriterionRemoved(data) {
        this.notificationService.success(
            `Prüfschritt wurde aus dem Thema entfernt`
        )
        this.renderThemesList()
    }

    /**
     * Event-Handler für aktives Thema geändert
     * @param {object} data - Event-Daten
     */
    handleActiveThemeChanged(data) {
        // UI aktualisieren, um das aktive Thema anzuzeigen
        this.renderThemesList()

        // "Zu Thema hinzufügen"-Buttons aktualisieren
        this.updateAddToThemeButtons()

        // Benachrichtigung anzeigen
        const activeTheme = this.themeManager.getActiveTheme()
        if (activeTheme) {
            this.notificationService.success(
                `Thema "${activeTheme.title}" ist jetzt aktiv`
            )
        } else if (data.oldActiveThemeId) {
            this.notificationService.info(`Kein Thema ist mehr aktiv`)
        }
    }

    /**
     * Event-Handler für Anfrage zum Hinzufügen eines Prüfschritts
     * @param {object} data - Event-Daten
     */
    handleAddCriterionRequest(data) {
        const { card, criterion, button } = data

        // Wenn bereits ein "bereits hinzugefügt"-Button, nichts tun
        if (button.classList.contains("already-added")) {
            return
        }

        // Wenn ein aktives Thema vorhanden ist, direkt hinzufügen
        const activeThemeId = document.body.dataset.activeThemeId

        if (activeThemeId && this.themeManager.getThemeById(activeThemeId)) {
            // Sektionsindex ermitteln
            const sectionClass = Array.from(card.classList).find((c) =>
                c.startsWith("section-")
            )
            const sectionIndex = sectionClass
                ? parseInt(sectionClass.replace("section-", "")) - 1
                : 0

            try {
                const success = this.themeManager.addCriterionToTheme(
                    activeThemeId,
                    criterion,
                    sectionIndex
                )

                if (success) {
                    // Button aktualisieren
                    button.innerHTML =
                        '<span class="material-icons">check</span>'
                    button.title = "Dem aktiven Thema hinzugefügt"
                    button.classList.add("already-added")
                }
            } catch (error) {
                this.notificationService.error(error.message)
            }
        } else {
            // Wenn kein aktives Thema, Auswahlpopup anzeigen
            this.showThemeSelectionPopup(card, criterion)
        }
    }

    /**
     * Aktualisiert alle "Zu Thema hinzufügen"-Buttons
     */
    updateAddToThemeButtons() {
        document.querySelectorAll(".add-to-theme-button").forEach((button) => {
            const card = button.closest(".pruefschritt-card")
            if (!card || !card.pruefschrittData) return

            const criterion = card.pruefschrittData
            const activeThemeId = document.body.dataset.activeThemeId

            if (
                activeThemeId &&
                this.themeManager.getThemeById(activeThemeId)
            ) {
                const activeTheme =
                    this.themeManager.getThemeById(activeThemeId)
                button.innerHTML =
                    '<span class="material-icons">playlist_add</span>'
                button.title = `Zu "${activeTheme.title}" hinzufügen`
                button.classList.add("active-theme-add")

                // Prüfen, ob der Prüfschritt bereits im Thema ist
                if (activeTheme.hasCriterion(criterion.id)) {
                    button.innerHTML =
                        '<span class="material-icons">check</span>'
                    button.title = `Bereits in "${activeTheme.title}" enthalten`
                    button.classList.add("already-added")
                } else {
                    button.classList.remove("already-added")
                }
            } else {
                button.innerHTML = '<span class="material-icons">add</span>'
                button.title = "Zu einem Thema hinzufügen"
                button.classList.remove("active-theme-add")
                button.classList.remove("already-added")
            }
        })
    }

    /**
     * Rendert die Themenliste basierend auf Filter- und Sortierzustand
     */
    renderThemesList() {
        const container = document.getElementById("themesContainer")
        if (!container) return

        // Hole alle Themen
        let themes = this.themeManager.getAllThemes()

        // Filtern, wenn ein Suchbegriff vorhanden ist
        if (this.filterState.searchTerm) {
            themes = this.filterThemes(themes, this.filterState.searchTerm)
        }

        // Sortieren nach ausgewähltem Feld
        themes = this.sortThemes(
            themes,
            this.filterState.sortField,
            this.filterState.sortAscending
        )

        // Container leeren
        container.innerHTML = ""

        // Leere Nachricht anzeigen, wenn keine Themen vorhanden sind
        if (themes.length === 0) {
            container.innerHTML = this.filterState.searchTerm
                ? `<div class="empty-themes-message">Keine Themen gefunden, die "${this.filterState.searchTerm}" enthalten.</div>`
                : '<div class="empty-themes-message">Keine Themen vorhanden. Erstellen Sie ein neues Thema.</div>'
            return
        }

        // Themen rendern
        const activeThemeId = document.body.dataset.activeThemeId
        const uiFactory = new UIComponentFactory(this.uiRegistry)

        themes.forEach((theme) => {
            const themeElement = uiFactory.createThemeCard(theme, {
                isActive: theme.id === activeThemeId,
                onHeaderClick: () => this.toggleThemeAccordion(theme.id),
                onCopyClick: () => this.copyThemeToClipboard(theme.id),
                onEditClick: () => this.openEditThemeModal(theme.id),
                onDeleteClick: () => this.deleteTheme(theme.id),
                highlightTerm: this.filterState.searchTerm,
                parent: container,
            })

            // Wenn ein Suchfilter aktiv ist, das Thema automatisch öffnen
            if (this.filterState.searchTerm) {
                themeElement.classList.add("active")
                const icon = themeElement.querySelector(".accordion-icon")
                if (icon) icon.textContent = "expand_less"
            }
        })
    }

    /**
     * Filtert Themen basierend auf einem Suchbegriff
     * @param {Array<ThemeModel>} themes - Zu filternde Themen
     * @param {string} searchTerm - Suchbegriff
     * @returns {Array<ThemeModel>} - Gefilterte Themen
     */
    filterThemes(themes, searchTerm) {
        if (!searchTerm) return themes

        const search = searchTerm.toLowerCase()

        return themes.filter((theme) => {
            // Suche in Titel, Autor und Beschreibung
            const titleMatch =
                theme.title && theme.title.toLowerCase().includes(search)
            const authorMatch =
                theme.author && theme.author.toLowerCase().includes(search)
            const descriptionMatch =
                theme.description &&
                theme.description.toLowerCase().includes(search)

            // Suche in den Prüfschritt-Daten
            const dataMatch =
                theme.data &&
                theme.data.some(
                    (item) =>
                        (item.title &&
                            item.title.toLowerCase().includes(search)) ||
                        (item.description &&
                            item.description.toLowerCase().includes(search))
                )

            return titleMatch || authorMatch || descriptionMatch || dataMatch
        })
    }

    /**
     * Sortiert Themen basierend auf einem Feld und einer Richtung
     * @param {Array<ThemeModel>} themes - Zu sortierende Themen
     * @param {string} field - Feld, nach dem sortiert werden soll
     * @param {boolean} ascending - Aufsteigend sortieren?
     * @returns {Array<ThemeModel>} - Sortierte Themen
     */
    sortThemes(themes, field, ascending) {
        return [...themes].sort((a, b) => {
            let valueA, valueB

            // Extrahiere die zu vergleichenden Werte
            switch (field) {
                case "title":
                case "author":
                case "description":
                    valueA = (a[field] || "").toLowerCase()
                    valueB = (b[field] || "").toLowerCase()
                    break

                case "created":
                case "lastModified":
                    // Umwandlung des deutschen Datumsformats in vergleichbare Werte
                    try {
                        valueA = Utils.parseDateTimeString(a[field])
                        valueB = Utils.parseDateTimeString(b[field])
                    } catch (e) {
                        console.error("Datumsparsing-Fehler:", e)
                        valueA = a[field] || ""
                        valueB = b[field] || ""
                    }
                    break

                case "criteriaCount":
                    // Sortierung nach Anzahl der Prüfschritte
                    valueA = a.data ? a.data.length : 0
                    valueB = b.data ? b.data.length : 0
                    break

                default:
                    valueA = a[field] || ""
                    valueB = b[field] || ""
            }

            // Vergleich
            if (valueA < valueB) return ascending ? -1 : 1
            if (valueA > valueB) return ascending ? 1 : -1
            return 0
        })
    }

    /**
     * Klappt ein Thema auf oder zu
     * @param {string} themeId - ID des Themas
     */
    toggleThemeAccordion(themeId) {
        const themeElement = document.querySelector(
            `.theme-item[data-id="${themeId}"]`
        )
        if (!themeElement) return

        // Akkordeon-Zustand umschalten
        themeElement.classList.toggle("active")

        // Icon aktualisieren
        const icon = themeElement.querySelector(".accordion-icon")
        if (icon) {
            icon.textContent = themeElement.classList.contains("active")
                ? "expand_less"
                : "expand_more"
        }

        // Thema als aktiv setzen, wenn es nicht bereits aktiv ist
        const wasActive = themeElement.classList.contains(
            "theme-collecting-active"
        )

        // Alle anderen Themen deaktivieren
        document.querySelectorAll(".theme-item").forEach((item) => {
            item.classList.remove("theme-collecting-active")
        })

        // Toggle für dieses Thema, wenn es nicht bereits das aktive war
        if (!wasActive) {
            themeElement.classList.add("theme-collecting-active")
            this.themeManager.setActiveTheme(themeId)
        } else {
            // Wenn es bereits aktiv war, dann deaktivieren
            this.themeManager.setActiveTheme(null)
        }
    }

    /**
     * Erstellt ein neues Thema aus den Formulardaten
     */
    createNewTheme() {
        const title = document.getElementById("themeTitle").value.trim()
        const author = document.getElementById("themeAuthor").value.trim()
        const description = document
            .getElementById("themeDescription")
            .value.trim()

        try {
            if (!title) {
                throw new Error("Bitte geben Sie einen Titel ein.")
            }

            this.themeManager.createTheme({
                title,
                author,
                description,
                data: [],
            })

            // Eingabefelder zurücksetzen
            document.getElementById("themeTitle").value = ""
            document.getElementById("themeAuthor").value = ""
            document.getElementById("themeDescription").value = ""

            // Abschnitt schließen
            const button = document.querySelector(
                ".new-theme-section .toggle-section-button"
            )
            if (button) button.click()
        } catch (error) {
            this.notificationService.error(error.message)
        }
    }

    /**
     * Fügt ein Thema aus der Zwischenablage ein
     */
    async pasteThemeFromClipboard() {
        try {
            const clipboardText = await navigator.clipboard.readText()
            let themeData

            try {
                themeData = JSON.parse(clipboardText)

                // Überprüfen, ob die eingefügten Daten ein gültiges Thema sind
                if (themeData && themeData.title) {
                    document.getElementById("themeTitle").value =
                        themeData.title || ""
                    document.getElementById("themeAuthor").value =
                        themeData.author || ""
                    document.getElementById("themeDescription").value =
                        themeData.description || ""

                    this.notificationService.success(
                        "Daten aus Zwischenablage eingefügt"
                    )
                } else {
                    this.notificationService.error(
                        "Ungültiges Themenformat in der Zwischenablage"
                    )
                }
            } catch (parseError) {
                // Wenn kein valides JSON, füge Text als Beschreibung ein
                document.getElementById("themeDescription").value =
                    clipboardText
                this.notificationService.info(
                    "Text aus Zwischenablage als Beschreibung eingefügt"
                )
            }
        } catch (error) {
            console.error("Fehler beim Lesen der Zwischenablage:", error)
            this.notificationService.error(
                "Fehler beim Zugriff auf die Zwischenablage"
            )
        }
    }

    /**
     * Importiert ein Thema aus einer URL
     */
    async importThemeFromUrl() {
        const url = document.getElementById("themeLink").value.trim()

        if (!url) {
            this.notificationService.error("Bitte geben Sie eine URL ein.")
            return
        }

        try {
            const response = await fetch(url)
            if (!response.ok) {
                throw new Error(`HTTP-Fehler: ${response.status}`)
            }

            const themeData = await response.json()

            // Importiere das Thema
            this.themeManager.importTheme(JSON.stringify(themeData))

            // Eingabefeld zurücksetzen
            document.getElementById("themeLink").value = ""

            // Abschnitt schließen
            const button = document.querySelector(
                ".import-theme-section .toggle-section-button"
            )
            if (button) button.click()
        } catch (error) {
            console.error("Import-Fehler:", error)
            this.notificationService.error(
                `Fehler beim Importieren des Themas: ${error.message}`
            )
        }
    }

    /**
     * Kopiert ein Thema in die Zwischenablage
     * @param {string} themeId - ID des Themas
     */
    copyThemeToClipboard(themeId) {
        try {
            const themeJSON = this.themeManager.exportTheme(themeId)

            navigator.clipboard
                .writeText(themeJSON)
                .then(() => {
                    this.notificationService.success(
                        "Thema in die Zwischenablage kopiert!"
                    )
                })
                .catch((err) => {
                    console.error("Fehler beim Kopieren:", err)
                    this.notificationService.error(
                        "Fehler beim Kopieren in die Zwischenablage."
                    )
                })
        } catch (error) {
            this.notificationService.error(error.message)
        }
    }

    /**
     * Öffnet einen Modal-Dialog zum Bearbeiten eines Themas
     * @param {string} themeId - ID des Themas
     */
    openEditThemeModal(themeId) {
        const theme = this.themeManager.getThemeById(themeId)
        if (!theme) {
            this.notificationService.error("Thema nicht gefunden.")
            return
        }

        // Modal-Service verwenden, falls vorhanden
        const modalService = new ModalService(this.uiRegistry)

        // Modal-Inhalt erstellen
        const content = `
      <div class="form-group">
        <label for="edit-theme-title">Titel:</label>
        <input type="text" id="edit-theme-title" value="${theme.title || ""}">
      </div>
      <div class="form-group">
        <label for="edit-theme-author">Autor:</label>
        <input type="text" id="edit-theme-author" value="${theme.author || ""}">
      </div>
      <div class="form-group">
        <label for="edit-theme-description">Beschreibung:</label>
        <textarea id="edit-theme-description" rows="3">${
            theme.description || ""
        }</textarea>
      </div>
      <input type="hidden" id="edit-theme-id" value="${themeId}">
    `

        // Buttons für das Modal
        const buttons = [
            {
                text: "Speichern",
                class: "primary",
                onClick: () => {
                    this.updateTheme(
                        document.getElementById("edit-theme-id").value,
                        document
                            .getElementById("edit-theme-title")
                            .value.trim(),
                        document
                            .getElementById("edit-theme-author")
                            .value.trim(),
                        document
                            .getElementById("edit-theme-description")
                            .value.trim()
                    )
                },
                closeModal: true,
            },
            {
                text: "Abbrechen",
                class: "secondary",
                closeModal: true,
            },
        ]

        // Modal öffnen
        modalService.openModal({
            title: "Thema bearbeiten",
            content,
            buttons,
            closeOnEscape: true,
            closeOnBackdropClick: true,
        })
    }

    /**
     * Aktualisiert ein Thema mit neuen Daten
     * @param {string} id - ID des Themas
     * @param {string} title - Neuer Titel
     * @param {string} author - Neuer Autor
     * @param {string} description - Neue Beschreibung
     */
    updateTheme(id, title, author, description) {
        try {
            if (!title) {
                throw new Error("Der Titel darf nicht leer sein.")
            }

            this.themeManager.updateTheme(id, { title, author, description })
        } catch (error) {
            this.notificationService.error(error.message)
        }
    }

    /**
     * Löscht ein Thema nach Bestätigung
     * @param {string} id - ID des zu löschenden Themas
     */
    deleteTheme(id) {
        if (
            !confirm("Sind Sie sicher, dass Sie dieses Thema löschen möchten?")
        ) {
            return
        }

        try {
            const success = this.themeManager.deleteTheme(id)

            if (!success) {
                this.notificationService.error("Thema nicht gefunden.")
            }
        } catch (error) {
            this.notificationService.error(error.message)
        }
    }

    /**
     * Entfernt einen Prüfschritt aus einem Thema
     * @param {string} themeId - ID des Themas
     * @param {string} criterionId - ID des Prüfschritts
     */
    removeCriterionFromTheme(themeId, criterionId) {
        try {
            this.themeManager.removeCriterionFromTheme(themeId, criterionId)
        } catch (error) {
            this.notificationService.error(error.message)
        }
    }

    /**
     * Zeigt ein Popup zur Themenauswahl an
     * @param {HTMLElement} card - Die Prüfschritt-Karte
     * @param {object} criterion - Der hinzuzufügende Prüfschritt
     */
    showThemeSelectionPopup(card, criterion) {
        // Altes Popup entfernen, falls vorhanden
        const existingPopup = document.querySelector(".theme-selection-popup")
        if (existingPopup) {
            existingPopup.remove()
        }

        if (!criterion) return

        // Sektionsindex ermitteln
        const sectionClass = Array.from(card.classList).find((c) =>
            c.startsWith("section-")
        )
        const sectionIndex = sectionClass
            ? parseInt(sectionClass.replace("section-", "")) - 1
            : 0

        // Popup-Container erstellen
        const popup = document.createElement("div")
        popup.className = "theme-selection-popup"

        // Position relativ zur Karte berechnen
        const rect = card.getBoundingClientRect()

        // Prüfen, ob rechts genug Platz ist
        const rightSpace = window.innerWidth - rect.right
        const leftSpace = rect.left

        if (rightSpace >= 270) {
            // Rechts vom Element positionieren
            popup.style.left = `${rect.right + window.scrollX + 10}px`
            popup.style.top = `${rect.top + window.scrollY}px`
        } else if (leftSpace >= 270) {
            // Links vom Element positionieren
            popup.style.right = `${window.innerWidth - rect.left + 10}px`
            popup.style.top = `${rect.top + window.scrollY}px`
        } else {
            // Über oder unter dem Element positionieren, je nach verfügbarem Platz
            popup.style.left = `${rect.left + window.scrollX}px`
            if (rect.top > window.innerHeight / 2) {
                // Oben positionieren
                popup.style.bottom = `${window.innerHeight - rect.top + 10}px`
            } else {
                // Unten positionieren
                popup.style.top = `${rect.bottom + window.scrollY + 10}px`
            }
        }

        // Themen laden
        const themes = this.themeManager.getAllThemes()

        // Popup-Inhalt erstellen
        let popupContent = "<h4>Zu einem Thema hinzufügen</h4>"

        if (themes.length === 0) {
            popupContent +=
                '<div class="theme-selection-empty">Keine Themen vorhanden</div>'
        } else {
            popupContent += '<ul class="theme-selection-list">'
            themes.forEach((theme) => {
                // Prüfen, ob der Prüfschritt bereits im Thema ist
                const alreadyInTheme = theme.hasCriterion(criterion.id)
                const itemClass = alreadyInTheme
                    ? "theme-selection-item disabled"
                    : "theme-selection-item"
                const itemText = alreadyInTheme
                    ? `${theme.title} ✓`
                    : theme.title

                popupContent += `<li class="${itemClass}" data-theme-id="${theme.id}">${itemText}</li>`
            })
            popupContent += "</ul>"
        }

        // Bereich für "Neues Thema erstellen" hinzufügen
        popupContent += `
      <div class="theme-selection-create">
        <input type="text" class="new-theme-input" placeholder="Neues Thema erstellen...">
        <button class="create-new-theme-btn">
          <span class="material-icons">add</span>
          Thema erstellen
        </button>
      </div>
    `

        popup.innerHTML = popupContent
        document.body.appendChild(popup)

        // Fokus auf das Eingabefeld setzen
        popup.querySelector(".new-theme-input").focus()

        // Event-Listener für Themenauswahl
        popup
            .querySelectorAll(".theme-selection-item:not(.disabled)")
            .forEach((item) => {
                item.addEventListener("click", () => {
                    const themeId = item.dataset.themeId

                    try {
                        this.themeManager.addCriterionToTheme(
                            themeId,
                            criterion,
                            sectionIndex
                        )
                        popup.remove()

                        // Button aktualisieren
                        const button = card.querySelector(
                            ".add-to-theme-button"
                        )
                        if (button) {
                            button.innerHTML =
                                '<span class="material-icons">check</span>'
                            button.title = "Zum Thema hinzugefügt"
                            button.classList.add("already-added")
                        }
                    } catch (error) {
                        this.notificationService.error(error.message)
                    }
                })
            })

        // Event-Listener für "Neues Thema erstellen"
        popup
            .querySelector(".create-new-theme-btn")
            .addEventListener("click", () => {
                const themeTitle = popup
                    .querySelector(".new-theme-input")
                    .value.trim()

                if (themeTitle) {
                    try {
                        // Neues Thema erstellen
                        const theme = this.themeManager.createTheme({
                            title: themeTitle,
                            author: "",
                            description: "",
                            data: [],
                        })

                        // Prüfschritt hinzufügen
                        this.themeManager.addCriterionToTheme(
                            theme.id,
                            criterion,
                            sectionIndex
                        )

                        popup.remove()

                        // Button aktualisieren
                        const button = card.querySelector(
                            ".add-to-theme-button"
                        )
                        if (button) {
                            button.innerHTML =
                                '<span class="material-icons">check</span>'
                            button.title = "Zum neuen Thema hinzugefügt"
                            button.classList.add("already-added")
                        }
                    } catch (error) {
                        this.notificationService.error(error.message)
                    }
                } else {
                    this.notificationService.error(
                        "Bitte geben Sie einen Titel für das neue Thema ein."
                    )
                }
            })

        // Event-Listener für Klick außerhalb des Popups
        function handleOutsideClick(e) {
            if (!popup.contains(e.target) && !card.contains(e.target)) {
                popup.remove()
                document.removeEventListener("click", handleOutsideClick)
            }
        }

        // Verzögerung hinzufügen, damit der aktuelle Klick nicht sofort das Popup schließt
        setTimeout(() => {
            document.addEventListener("click", handleOutsideClick)
        }, 10)
    }
}
