/**
 *    @version v3
 */

// treemap/TreemapController.js - Steuerung der Treemap-Visualisierung
class TreemapController {
    constructor(eventBus, uiRegistry, data) {
        this.eventBus = eventBus
        this.uiRegistry = uiRegistry
        this.data = data

        // Treemap-Elemente
        this.container = null
        this.sections = []
        this.activeSection = null
        this.activeCard = null

        // Services und Views
        this.treemapView = new TreemapView(this, eventBus, uiRegistry)
        this.tooltipService = null // Wird bei init() gesetzt
    }

    /**
     * Initialisiert den Treemap-Controller
     */
    async init() {
        // Container referenzieren
        this.container = this.uiRegistry.getContainer("treemap")
        if (!this.container) {
            throw new Error("Treemap container not found")
        }

        // Tooltips initialisieren (wird als Service über UIComponents erstellt)
        this.tooltipService = this.uiRegistry.getService
            ? this.uiRegistry.getService("tooltip")
            : null

        // Daten verarbeiten und Modell erstellen
        this.processData()

        // View initialisieren und rendern
        await this.treemapView.init()
        this.treemapView.render()

        // Event-Listener registrieren
        this.registerEventListeners()

        console.log("TreemapController initialized")
    }

    /**
     * Verarbeitet die rohen Daten und erstellt Sektions- und Prüfschrittmodelle
     */
    processData() {
        if (!this.data || !Array.isArray(this.data.sections)) {
            console.error("Invalid data format")
            return
        }

        // Sektions-Modelle erstellen
        this.sections = this.data.sections
            .map((section, index) => {
                const sectionObj = section.undefined // Besondere Struktur aus criterias.json
                if (!sectionObj) return null

                // SectionModel mit Prüfschritten erstellen
                return new SectionModel({
                    id: sectionObj.id,
                    title: sectionObj.title,
                    description: sectionObj.details?.description || "",
                    index: index + 1,
                    criteria: this.createCriteriaModels(
                        sectionObj.pruefschritte,
                        index + 1
                    ),
                })
            })
            .filter(Boolean) // Filtere null-Werte
    }

    /**
     * Erstellt CriterionModel-Objekte aus Prüfschritt-Daten
     * @param {Array} pruefschritte - Array mit Prüfschrittdaten
     * @param {number} sectionIndex - Index der Sektion
     * @returns {Array} - Array mit CriterionModel-Objekten
     */
    createCriteriaModels(pruefschritte, sectionIndex) {
        if (!Array.isArray(pruefschritte)) return []

        return pruefschritte.map((item) => {
            return new CriterionModel({
                id: item.id,
                bitvId: item.bitvId || "",
                wcagId: item.wcagId || "",
                bitInklusivId: item.bitInklusivId || "",
                title: item.title,
                description: item.details?.description || "",
                who: item.details?.who || [],
                conformanceLevel: item.conformanceLevel || "",
                sectionIndex,
            })
        })
    }

    /**
     * Registriert Event-Listener für Treemap-Events
     */
    registerEventListeners() {
        // Filterereignisse
        this.eventBus.subscribe("filter:applied", () => {
            this.updateSectionVisibility()
        })

        // Escape-Taste
        this.eventBus.subscribe("ui:escape-pressed", () => {
            this.resetFocus()
        })

        // Fenstergröße geändert
        this.eventBus.subscribe("ui:window-resized", () => {
            this.treemapView.adjustTooltipPositions()
        })
    }

    /**
     * Aktualisiert die Sichtbarkeit der Sektionen basierend auf den sichtbaren Prüfschritten
     */
    updateSectionVisibility() {
        const sectionElements = document.querySelectorAll(".section-column")

        sectionElements.forEach((sectionEl) => {
            const visibleCards = sectionEl.querySelectorAll(
                ".pruefschritt-card:not(.filtered)"
            )

            if (visibleCards.length === 0) {
                sectionEl.classList.add("filtered")
            } else {
                sectionEl.classList.remove("filtered")
            }
        })
    }

    /**
     * Setzt den Fokus auf eine Sektion
     * @param {HTMLElement} sectionElement - Die zu fokussierende Sektion
     */
    focusSection(sectionElement) {
        // Bisherigen Fokus entfernen
        if (this.activeSection) {
            this.activeSection.classList.remove("section-focus")
        }

        if (this.activeCard) {
            this.activeCard.classList.remove("card-focus")
            this.hideTooltip(this.activeCard)
            this.activeCard = null
        }

        // Neuen Fokus setzen
        this.activeSection = sectionElement
        if (this.activeSection) {
            this.activeSection.classList.add("section-focus")
            this.activeSection.focus()
        }
    }

    /**
     * Setzt den Fokus auf eine Karte
     * @param {HTMLElement} cardElement - Die zu fokussierende Karte
     */
    focusCard(cardElement) {
        // Bisherigen Fokus entfernen
        if (this.activeCard) {
            this.activeCard.classList.remove("card-focus")
            this.hideTooltip(this.activeCard)
        }

        // Neuen Fokus setzen
        this.activeCard = cardElement
        if (this.activeCard) {
            this.activeCard.classList.add("card-focus")

            // Sektion fokussieren
            const sectionElement = this.activeCard.closest(".section-column")
            if (sectionElement && this.activeSection !== sectionElement) {
                this.focusSection(sectionElement)
            }

            // Tooltip anzeigen
            this.showTooltip(this.activeCard)

            // Scrolle die Karte ins Sichtfeld
            this.activeCard.scrollIntoView({
                behavior: "smooth",
                block: "nearest",
            })
        }
    }


    /**
     * Zeigt einen Tooltip für eine Karte an
     * @param {HTMLElement} cardElement - Die Karte, für die der Tooltip angezeigt werden soll
     */
    showTooltip(cardElement) {
        if (
            this.tooltipService &&
            cardElement &&
            cardElement.pruefschrittData
        ) {
            const description = cardElement.pruefschrittData.description
            if (description) {
                this.tooltipService.showTooltip(cardElement, description)
            }
        }
    }

    /**
     * Versteckt den Tooltip für eine Karte
     * @param {HTMLElement} cardElement - Die Karte, für die der Tooltip versteckt werden soll
     */
    hideTooltip(cardElement) {
        if (this.tooltipService && cardElement) {
            this.tooltipService.hideTooltip(cardElement)
        }
    }

    /**
     * Öffnet die Detailansicht für einen Prüfschritt
     * @param {HTMLElement} cardElement - Die Karte mit dem Prüfschritt
     */
    openCardDetails(cardElement) {
        if (cardElement && cardElement.pruefschrittData) {
            this.treemapView.showDetails(cardElement.pruefschrittData)
        }
    }

    /**
     * Setzt den Fokus zurück
     */
    resetFocus() {
        if (this.activeCard) {
            this.activeCard.classList.remove("card-focus")
            this.hideTooltip(this.activeCard)
            this.activeCard = null
        }

        if (this.activeSection) {
            this.activeSection.classList.remove("section-focus")
            this.activeSection = null
        }
    }

    /**
     * Gibt alle Sektionen zurück
     * @returns {Array} - Array mit SectionModel-Objekten
     */
    getSections() {
        return this.sections
    }
}

/**
 * Model-Klasse für eine Sektion
 */
class SectionModel {
    constructor(data = {}) {
        this.id = data.id || ""
        this.title = data.title || ""
        this.description = data.description || ""
        this.index = data.index || 0
        this.criteria = Array.isArray(data.criteria) ? data.criteria : []
    }
}

/**
 * Model-Klasse für einen Prüfschritt
 */
class CriterionModel {
    constructor(data = {}) {
        this.id = data.id || ""
        this.bitvId = data.bitvId || ""
        this.wcagId = data.wcagId || ""
        this.bitInklusivId = data.bitInklusivId || ""
        this.title = data.title || ""
        this.description = data.description || ""
        this.who = Array.isArray(data.who) ? data.who : []
        this.conformanceLevel = data.conformanceLevel || ""
        this.sectionIndex = data.sectionIndex || 0
    }
}

/**
 * View-Klasse für die Treemap
 */
class TreemapView {
    constructor(controller, eventBus, uiRegistry) {
        this.controller = controller
        this.eventBus = eventBus
        this.uiRegistry = uiRegistry

        // DOM-Referenzen
        this.container = null
        this.modalElement = null
        this.modalContent = null
        this.modalTitle = null
        this.closeButton = null
    }

    /**
     * Initialisiert die Treemap-View
     */
    async init() {
        // DOM-Referenzen holen
        this.container = this.uiRegistry.getContainer("treemap")
        this.modalElement = this.uiRegistry.getContainer("modal")
        this.modalContent = this.uiRegistry.getElement("modalContent")
        this.modalTitle = this.uiRegistry.getElement("modalTitle")
        this.closeButton = this.uiRegistry.getElement("closeButton")

        if (!this.container) {
            throw new Error("Treemap container not found")
        }

        // Modal-Event-Handler
        if (this.closeButton) {
            this.closeButton.addEventListener("click", () => this.hideModal())
        }

        if (this.modalElement) {
            this.modalElement.addEventListener("click", (e) => {
                if (e.target === this.modalElement) {
                    this.hideModal()
                }
            })
        }

        // Escape-Taste für Modal
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape" && this.isModalVisible()) {
                this.hideModal()
            }
        })
    }

    /**
     * Rendert die Treemap mit allen Sektionen und Prüfschritten
     */
    render() {
        if (!this.container) return

        // Container leeren
        this.container.innerHTML = ""

        // Sektionen rendern
        this.controller.getSections().forEach((section) => {
            this.renderSection(section)
        })

        console.log("Treemap rendered")
    }

    /**
     * Rendert eine einzelne Sektion mit ihren Prüfschritten
     * @param {SectionModel} section - Das Sektions-Modell
     */
    renderSection(section) {
        // Sektions-Spalte erstellen
        const sectionColumn = document.createElement("div")
        sectionColumn.className = "section-column"
        sectionColumn.setAttribute("tabindex", "0")
        sectionColumn.setAttribute("role", "region")
        sectionColumn.setAttribute(
            "aria-label",
            section.title || `Sektion ${section.index}`
        )

        // Fokus-Handler für Sektion
        sectionColumn.addEventListener("focus", () => {
            this.controller.focusSection(sectionColumn)
        })

        // Kategorie-Karte
        const categoryCard = document.createElement("div")
        categoryCard.className = "card category-card"
        categoryCard.textContent = " "
        sectionColumn.appendChild(categoryCard)

        // Sektions-Karte
        const sectionCard = document.createElement("div")
        sectionCard.className = `card section-card section-${section.index}`
        sectionCard.textContent = section.title
        sectionColumn.appendChild(sectionCard)

        // Prüfschritte rendern
        section.criteria.forEach((criterion) => {
            this.renderCriterion(criterion, sectionColumn)
        })

        // Sektions-Spalte zum Container hinzufügen
        this.container.appendChild(sectionColumn)
    }

    /**
     * Rendert einen einzelnen Prüfschritt
     * @param {CriterionModel} criterion - Das Prüfschritt-Modell
     * @param {HTMLElement} parent - Das Elternelement, an das der Prüfschritt angehängt wird
     */
    renderCriterion(criterion, parent) {
        // Prüfschritt-Karte erstellen
        const card = document.createElement("div")
        card.className = `card pruefschritt-card section-${criterion.sectionIndex}`
        card.setAttribute("tabindex", "0")

        // Prüfschritt-Daten speichern für späteren Zugriff
        card.pruefschrittData = criterion

        // Konformitätslevel hinzufügen, falls vorhanden
        if (criterion.conformanceLevel) {
            const levelElement = document.createElement("div")
            levelElement.className = criterion.conformanceLevel
            levelElement.textContent = criterion.conformanceLevel
            card.appendChild(levelElement)
        }

        // IDs hinzufügen
        if (criterion.wcagId) {
            const wcagIdElement = document.createElement("div")
            wcagIdElement.className = "wcag-id"
            wcagIdElement.textContent = `WCAG ${criterion.wcagId}`
            card.appendChild(wcagIdElement)
        }

        if (criterion.bitvId) {
            const bitvIdElement = document.createElement("div")
            bitvIdElement.className = "bitv-id"
            bitvIdElement.textContent = `BITV ${criterion.bitvId}`
            card.appendChild(bitvIdElement)
            card.classList.add("is-bitv")
        }

        // Titel hinzufügen
        card.appendChild(document.createTextNode(criterion.title))

        // Hat Beschreibung?
        if (criterion.description) {
            card.classList.add("has-information")
        }

        // Berufsgruppen-Marker hinzufügen
        this.addProfessionMarkers(card, criterion)

        // "Hinzufügen zu Thema"-Button hinzufügen
        this.addThemeButtonToCard(card, criterion)

        // Event-Listener für Karte
        card.addEventListener("focus", () => {
            this.controller.focusCard(card)
        })

        card.addEventListener("click", () => {
            this.controller.focusCard(card)
            this.controller.openCardDetails(card)
        })

        card.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault()
                this.controller.openCardDetails(card)
            }
        })

        // Hover-Events für Tooltip
        card.addEventListener("mouseenter", () => {
            if (card !== this.controller.activeCard) {
                this.controller.showTooltip(card)
            }
        })

        card.addEventListener("mouseleave", () => {
            if (card !== this.controller.activeCard) {
                this.controller.hideTooltip(card)
            }
        })

        // Karte zum Elternelement hinzufügen
        parent.appendChild(card)
    }

    /**
     * Fügt Berufsgruppen-Marker zu einer Karte hinzu
     * @param {HTMLElement} card - Die Karte
     * @param {CriterionModel} criterion - Der Prüfschritt
     */
    addProfessionMarkers(card, criterion) {
        if (!Array.isArray(criterion.who) || criterion.who.length === 0) {
            return
        }

        const markerContainer = document.createElement("div")
        markerContainer.className = "profession-markers"

        // Mapping von Berufen zu Kategorien
        const professionGroups = {
            Requirements: [
                "Produktmanager",
                "Informationsarchitekten",
                "Barrierefreiheitsexperten",
                "Systemarchitekten",
            ],
            Design: [
                "Designer",
                "UX-Designer",
                "Grafiker",
                "Formulardesigner",
                "Interaktionsdesigner",
                "Mobile-Experten",
            ],
            // ... weitere Gruppen ...
        }

        // Kategorien ermitteln
        const categories = new Set()

        criterion.who.forEach((profession) => {
            for (const [category, professions] of Object.entries(
                professionGroups
            )) {
                if (
                    professions.some(
                        (p) => p.toLowerCase() === profession.toLowerCase()
                    )
                ) {
                    categories.add(category)
                    break
                }
            }
        })

        // Marker für jede Kategorie erstellen
        categories.forEach((category) => {
            const marker = document.createElement("span")
            marker.className = `profession-marker ${category
                .toLowerCase()
                .replace(/\s+/g, "-")}`
            marker.setAttribute("title", category)
            markerContainer.appendChild(marker)
        })

        card.appendChild(markerContainer)
    }

    /**
     * Fügt einen "Hinzufügen zu Thema"-Button zu einer Karte hinzu
     * @param {HTMLElement} card - Die Karte
     * @param {CriterionModel} criterion - Der Prüfschritt
     */
    addThemeButtonToCard(card, criterion) {
        // Button erstellen
        const addButton = document.createElement("button")
        addButton.className = "add-to-theme-button"
        addButton.innerHTML = '<span class="material-icons">add</span>'
        addButton.title = "Zu einem Thema hinzufügen"

        // Event-Listener für Button
        addButton.addEventListener("click", (e) => {
            e.stopPropagation() // Verhindert, dass die Karte geöffnet wird

            // Event veröffentlichen
            this.eventBus.publish("theme:add-criterion-request", {
                card,
                criterion,
                button: addButton,
            })
        })

        card.appendChild(addButton)
    }

    /**
     * Zeigt die Detailansicht für einen Prüfschritt
     * @param {CriterionModel} criterion - Der Prüfschritt
     */
    showDetails(criterion) {
        if (!this.modalElement || !this.modalContent) return

        // Titel setzen
        if (this.modalTitle) {
            this.modalTitle.textContent = criterion.title
        }

        // Wenn die Markdown-Bibliothek verfügbar ist, versuche die Details aus einer Markdown-Datei zu laden
        if (typeof marked !== "undefined") {
            // Versuche, die Markdown-Datei zu laden
            let mappedId = getMappedId(criterion.id)
            let filename = `./docs/${mappedId}.md`

            console.log(filename)

            fetch(filename)
                .then((response) => {
                    if (!response.ok) {
                        throw new Error("Markdown file not found")
                    }
                    return response.text()
                })
                .then((markdown) => {
                    // Markdown in HTML umwandeln
                    this.modalContent.innerHTML = marked.parse(markdown)
                    this.showModal()
                })
                .catch((error) => {
                    // Fallback: Zeige die Details aus dem Prüfschritt-Objekt
                    console.error("Error loading markdown:", error)
                    this.renderDetailsFromCriterion(criterion)
                    this.showModal()
                })
        } else {
            // Fallback ohne Markdown
            this.renderDetailsFromCriterion(criterion)
            this.showModal()
        }
    }

    /**
     * Rendert die Details eines Prüfschritts direkt aus dem Modell
     * @param {CriterionModel} criterion - Der Prüfschritt
     */
    renderDetailsFromCriterion(criterion) {
        if (!this.modalContent) return

        let html = `
      <h2>${criterion.title}</h2>
    `

        // IDs hinzufügen
        if (criterion.bitvId || criterion.wcagId) {
            html += '<p class="criterion-ids">'
            if (criterion.bitvId) {
                html += `<strong>BITV ID:</strong> ${criterion.bitvId} | `
            }
            if (criterion.wcagId) {
                html += `<strong>WCAG ID:</strong> ${criterion.wcagId}`
            }
            html += "</p>"
        }

        // Konformitätslevel
        if (criterion.conformanceLevel) {
            html += `<p><strong>Konformitätslevel:</strong> ${criterion.conformanceLevel}</p>`
        }

        // Beschreibung
        if (criterion.description) {
            html += `
        <h3>Beschreibung</h3>
        <p>${criterion.description}</p>
      `
        }

        // Beteiligte Berufsgruppen
        if (Array.isArray(criterion.who) && criterion.who.length > 0) {
            html += `
        <h3>Beteiligte Berufsgruppen</h3>
        <ul>
          ${criterion.who.map((person) => `<li>${person}</li>`).join("")}
        </ul>
      `
        }

        this.modalContent.innerHTML = html
    }

    /**
     * Zeigt das Modal an
     */
    showModal() {
        if (this.modalElement) {
            this.modalElement.style.display = "block"
            this.modalElement.setAttribute("aria-hidden", "false")

            // Fokus auf den Schließen-Button setzen
            if (this.closeButton) {
                this.closeButton.focus()
            }
        }
    }

    /**
     * Versteckt das Modal
     */
    hideModal() {
        if (this.modalElement) {
            this.modalElement.style.display = "none"
            this.modalElement.setAttribute("aria-hidden", "true")

            // Fokus auf die aktive Karte zurücksetzen, falls vorhanden
            if (this.controller.activeCard) {
                this.controller.activeCard.focus()
            }
        }
    }

    /**
     * Prüft, ob das Modal sichtbar ist
     * @returns {boolean} - true wenn sichtbar, sonst false
     */
    isModalVisible() {
        return this.modalElement && this.modalElement.style.display === "block"
    }

    /**
     * Passt die Positionen aller sichtbaren Tooltips an
     */
    adjustTooltipPositions() {
        // Diese Methode wird aufgerufen, wenn sich die Fenstergröße ändert
        // Die eigentliche Anpassung wird vom TooltipService übernommen
    }
}
