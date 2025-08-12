/**
 * WCAG Kriterien Tag-Filter System
 *
 * Lädt tags.json und erstellt eine Tag-basierte Filterung für die Treemap.
 * Ermöglicht das Filtern von WCAG-Kriterien basierend auf Stichworten.
 *
 * @version 1.0
 * @author GitHub Copilot
 */

class TagsFilterSystem {
    constructor() {
        this.tagsData = null
        this.allTags = new Set()
        this.activeTagFilters = new Set()
        this.isInitialized = false

        // Tag-Kategorien Mapping
        this.tagCategories = {
            "data-tags-con": "Content",
            "data-tags-dev": "Development",
            "data-tags-int": "Interaction",
            "data-tags-vis": "Visual",
        }
    }

    /**
     * Initialisiert das Tag-System
     */
    async init() {
        try {
            await this.loadTagsData()
            this.extractAllTags()
            this.createTagsUI()
            this.attachEventListeners()
            this.isInitialized = true
            console.log("✅ Tag-Filter System initialisiert")
        } catch (error) {
            console.error(
                "❌ Fehler beim Initialisieren des Tag-Systems:",
                error
            )
        }
    }

    /**
     * Lädt die tags.json Datei
     */
    async loadTagsData() {
        const response = await fetch("./tags.json")
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }
        this.tagsData = await response.json()
        console.log(
            "📄 Tags Daten geladen:",
            Object.keys(this.tagsData).length,
            "Kriterien"
        )
    }

    /**
     * Extrahiert alle einzigartigen Tags aus den Daten
     */
    extractAllTags() {
        Object.values(this.tagsData).forEach((criterion) => {
            Object.values(criterion).forEach((tagArray) => {
                if (Array.isArray(tagArray)) {
                    tagArray.forEach((tag) => this.allTags.add(tag))
                }
            })
        })
        console.log("🏷️ Gefundene Tags:", this.allTags.size)
    }

    /**
     * Erstellt die Benutzeroberfläche für die Tag-Filter
     */
    createTagsUI() {
        const filterBar = document.querySelector(".filter-bar")
        if (!filterBar) {
            console.warn("Filter-Bar nicht gefunden")
            return
        }

        // Tags-Filter Container erstellen
        const tagsContainer = document.createElement("div")
        tagsContainer.className = "filter-group tags-filter-group"
        tagsContainer.innerHTML = `
            <div class="filter-group-title">
                Stichwort-Filter
                <button id="clear-tag-filters" class="clear-tags-btn" title="Alle Tag-Filter zurücksetzen">
                    <span class="material-icons">clear</span>
                </button>
            </div>
            <div class="tags-search-container">
                <input type="text" id="tags-search" placeholder="Tags durchsuchen..." class="tags-search-input">
                <button id="toggle-tag-categories" class="toggle-categories-btn" title="Kategorien ein-/ausblenden">
                    <span class="material-icons">category</span>
                </button>
            </div>
            <div id="tags-filter-content" class="tags-filter-content">
                <div id="popular-tags" class="popular-tags-section"></div>
                <div id="all-tags" class="all-tags-section"></div>
                <div id="categorized-tags" class="categorized-tags-section" style="display: none;"></div>
            </div>
        `

        // CSS-Styles hinzufügen
        this.addTagsStyles()

        // Nach anderen Filter-Gruppen einfügen
        const professionGroup = filterBar.querySelector(
            ".filter-group:has(.profession-filters)"
        )
        if (professionGroup) {
            professionGroup.parentNode.insertBefore(
                tagsContainer,
                professionGroup.nextSibling
            )
        } else {
            filterBar.appendChild(tagsContainer)
        }

        this.renderTagsContent()
    }

    /**
     * Rendert den Inhalt der Tags-Filter
     */
    renderTagsContent() {
        this.renderPopularTags()
        this.renderAllTags()
        this.renderCategorizedTags()
    }

    /**
     * Rendert beliebte/häufige Tags
     */
    renderPopularTags() {
        const container = document.getElementById("popular-tags")
        if (!container) return

        // Häufigkeit der Tags berechnen
        const tagFrequency = new Map()

        Object.values(this.tagsData).forEach((criterion) => {
            Object.values(criterion).forEach((tagArray) => {
                if (Array.isArray(tagArray)) {
                    tagArray.forEach((tag) => {
                        tagFrequency.set(tag, (tagFrequency.get(tag) || 0) + 1)
                    })
                }
            })
        })

        // Top 15 häufigste Tags
        const popularTags = Array.from(tagFrequency.entries())
            .sort(([, a], [, b]) => b - a)
            .slice(0, 15)
            .map(([tag]) => tag)

        container.innerHTML = `
            <h4>Häufige Stichwörter</h4>
            <div class="tags-grid">
                ${popularTags
                    .map((tag) => this.createTagButton(tag, "popular-tag"))
                    .join("")}
            </div>
        `
    }

    /**
     * Rendert alle Tags alphabetisch
     */
    renderAllTags() {
        const container = document.getElementById("all-tags")
        if (!container) return

        const sortedTags = Array.from(this.allTags).sort()

        container.innerHTML = `
            <details>
                <summary>Alle Stichwörter (${sortedTags.length})</summary>
                <div class="tags-grid all-tags-grid">
                    ${sortedTags
                        .map((tag) => this.createTagButton(tag, "all-tag"))
                        .join("")}
                </div>
            </details>
        `
    }

    /**
     * Rendert Tags nach Kategorien gruppiert
     */
    renderCategorizedTags() {
        const container = document.getElementById("categorized-tags")
        if (!container) return

        const categorizedTags = {}

        // Tags nach Kategorien gruppieren
        Object.entries(this.tagsData).forEach(([criterionId, criterion]) => {
            Object.entries(criterion).forEach(([category, tagArray]) => {
                if (Array.isArray(tagArray) && this.tagCategories[category]) {
                    const categoryName = this.tagCategories[category]
                    if (!categorizedTags[categoryName]) {
                        categorizedTags[categoryName] = new Set()
                    }
                    tagArray.forEach((tag) =>
                        categorizedTags[categoryName].add(tag)
                    )
                }
            })
        })

        const categoriesHTML = Object.entries(categorizedTags)
            .map(([category, tagsSet]) => {
                const sortedTags = Array.from(tagsSet).sort()
                return `
                <details>
                    <summary>${category} (${sortedTags.length})</summary>
                    <div class="tags-grid category-tags-grid">
                        ${sortedTags
                            .map((tag) =>
                                this.createTagButton(tag, "category-tag")
                            )
                            .join("")}
                    </div>
                </details>
            `
            })
            .join("")

        container.innerHTML = `
            <h4>Nach Kategorien</h4>
            ${categoriesHTML}
        `
    }

    /**
     * Erstellt einen Tag-Button
     */
    createTagButton(tag, className = "") {
        const isActive = this.activeTagFilters.has(tag)
        return `
            <button 
                class="tag-filter-btn ${className} ${isActive ? "active" : ""}" 
                data-tag="${tag}"
                title="Filter nach '${tag}'"
                aria-pressed="${isActive}"
            >
                ${tag.replace(/-/g, " ")}
            </button>
        `
    }

    /**
     * Event-Listener anhängen
     */
    attachEventListeners() {
        // Tag-Filter Buttons
        document.addEventListener("click", (e) => {
            if (e.target.classList.contains("tag-filter-btn")) {
                const tag = e.target.dataset.tag
                this.toggleTagFilter(tag)
            }
        })

        // Tag-Suche
        const tagsSearch = document.getElementById("tags-search")
        if (tagsSearch) {
            tagsSearch.addEventListener("input", (e) => {
                this.filterTagsDisplay(e.target.value)
            })
        }

        // Kategorien Toggle
        const toggleCategories = document.getElementById(
            "toggle-tag-categories"
        )
        if (toggleCategories) {
            toggleCategories.addEventListener("click", () => {
                this.toggleCategorizedView()
            })
        }

        // Alle Filter zurücksetzen
        const clearFilters = document.getElementById("clear-tag-filters")
        if (clearFilters) {
            clearFilters.addEventListener("click", () => {
                this.clearAllTagFilters()
            })
        }

        // Tastatur-Navigation für Tags
        document.addEventListener("keydown", (e) => {
            if (e.target.classList.contains("tag-filter-btn")) {
                this.handleTagKeyboardNavigation(e)
            }
        })
    }

    /**
     * Toggle Tag-Filter
     */
    toggleTagFilter(tag) {
        if (this.activeTagFilters.has(tag)) {
            this.activeTagFilters.delete(tag)
        } else {
            this.activeTagFilters.add(tag)
        }

        this.updateTagButtonStates()
        this.applyTagFilters()
        this.updateActiveFiltersDisplay()
    }

    /**
     * Aktualisiert den visuellen Zustand aller Tag-Buttons
     */
    updateTagButtonStates() {
        document.querySelectorAll(".tag-filter-btn").forEach((btn) => {
            const tag = btn.dataset.tag
            const isActive = this.activeTagFilters.has(tag)

            btn.classList.toggle("active", isActive)
            btn.setAttribute("aria-pressed", isActive)
        })
    }

    /**
     * Wendet die Tag-Filter auf die Kriterien an
     */
    applyTagFilters() {
        if (this.activeTagFilters.size === 0) {
            // Alle Karten anzeigen wenn keine Tag-Filter aktiv
            this.showAllCards()
            return
        }

        const cards = document.querySelectorAll(".pruefschritt-card")
        let visibleCount = 0

        cards.forEach((card) => {
            const criterionId = this.getCriterionIdFromCard(card)
            const shouldShow = this.cardMatchesTagFilters(criterionId)

            if (shouldShow) {
                card.classList.remove("tag-filtered")
                if (!card.classList.contains("filtered")) {
                    visibleCount++
                }
            } else {
                card.classList.add("tag-filtered")
            }
        })

        this.updateTagFilterCount(visibleCount)
        console.log(`🏷️ Tag-Filter angewendet: ${visibleCount} Karten sichtbar`)
    }

    /**
     * Extrahiert die Kriterium-ID aus einer Karte
     */
    getCriterionIdFromCard(card) {
        const pruefschrittData = card.pruefschrittData
        if (!pruefschrittData) return null

        // Verschiedene ID-Formate probieren
        const wcagId = pruefschrittData.wcagId
        if (wcagId) {
            // WCAG ID zu Tags-Key konvertieren (z.B. "1.1.1" -> "non-text-content")
            return this.wcagIdToTagsKey(wcagId)
        }

        return null
    }

    /**
     * Konvertiert WCAG-ID zu Tags-Key
     */
    wcagIdToTagsKey(wcagId) {
        // Mapping von WCAG-IDs zu Tags-Keys
        const wcagToTagsMap = {
            "1.1.1": "non-text-content",
            "1.2.1": "audio-only-and-video-only-prerecorded",
            "1.2.2": "captions-prerecorded",
            "1.2.3": "audio-description-or-media-alternative-prerecorded",
            "1.2.4": "captions-live",
            "1.2.5": "audio-description-prerecorded",
            "1.2.6": "sign-language-prerecorded",
            "1.2.7": "extended-audio-description-prerecorded",
            "1.2.8": "media-alternative-prerecorded",
            "1.2.9": "audio-only-live",
            "1.3.1": "info-and-relationships",
            "1.3.2": "meaningful-sequence",
            "1.3.3": "sensory-characteristics",
            "1.3.4": "orientation",
            "1.3.5": "identify-input-purpose",
            "1.3.6": "identify-purpose",
            "1.4.1": "use-of-color",
            "1.4.2": "audio-control",
            "1.4.3": "contrast-minimum",
            "1.4.4": "resize-text",
            "1.4.5": "images-of-text",
            "1.4.6": "contrast-enhanced",
            "1.4.7": "low-or-no-background-audio",
            "1.4.8": "visual-presentation",
            "1.4.9": "images-of-text-no-exception",
            "1.4.10": "reflow",
            "1.4.11": "non-text-contrast",
            "1.4.12": "text-spacing",
            "1.4.13": "content-on-hover-or-focus",
            "2.1.1": "keyboard",
            "2.1.2": "no-keyboard-trap",
            "2.1.3": "keyboard-no-exception",
            "2.1.4": "character-key-shortcuts",
            "2.2.1": "timing-adjustable",
            "2.2.2": "pause-stop-hide",
            "2.2.3": "no-timing",
            "2.2.4": "interruptions",
            "2.2.5": "re-authenticating",
            "2.2.6": "timeouts",
            "2.3.1": "three-flashes-or-below-threshold",
            "2.3.2": "three-flashes",
            "2.3.3": "animation-from-interactions",
            "2.4.1": "bypass-blocks",
            "2.4.2": "page-titled",
            "2.4.3": "focus-order",
            "2.4.4": "link-purpose-in-context",
            "2.4.5": "multiple-ways",
            "2.4.6": "headings-and-labels",
            "2.4.7": "focus-visible",
            "2.4.8": "location",
            "2.4.9": "link-purpose-link-only",
            "2.4.10": "section-headings",
            "2.4.11": "focus-not-obscured-minimum",
            "2.4.12": "focus-not-obscured-enhanced",
            "2.4.13": "focus-appearance",
            "2.5.1": "pointer-gestures",
            "2.5.2": "pointer-cancellation",
            "2.5.3": "label-in-name",
            "2.5.4": "motion-actuation",
            "2.5.5": "target-size-enhanced",
            "2.5.6": "concurrent-input-mechanisms",
            "2.5.7": "dragging-movements",
            "2.5.8": "target-size-minimum",
            "3.1.1": "language-of-page",
            "3.1.2": "language-of-parts",
            "3.1.3": "unusual-words",
            "3.1.4": "abbreviations",
            "3.1.5": "reading-level",
            "3.1.6": "pronunciation",
            "3.2.1": "on-focus",
            "3.2.2": "on-input",
            "3.2.3": "consistent-navigation",
            "3.2.4": "consistent-identification",
            "3.2.5": "change-on-request",
            "3.2.6": "consistent-help",
            "3.3.1": "error-identification",
            "3.3.2": "labels-or-instructions",
            "3.3.3": "error-suggestion",
            "3.3.4": "error-prevention-legal-financial-data",
            "3.3.5": "help",
            "3.3.6": "error-prevention-all",
            "3.3.7": "redundant-entry",
            "3.3.8": "accessible-authentication-minimum",
            "3.3.9": "accessible-authentication-enhanced",
            "4.1.1": "parsing",
            "4.1.2": "name-role-value",
            "4.1.3": "status-messages",
        }

        return wcagToTagsMap[wcagId] || null
    }

    /**
     * Prüft ob eine Karte den aktiven Tag-Filtern entspricht
     */
    cardMatchesTagFilters(criterionId) {
        if (!criterionId || !this.tagsData[criterionId]) {
            return false
        }

        const criterionTags = this.tagsData[criterionId]
        const allCriterionTags = new Set()

        // Alle Tags des Kriteriums sammeln
        Object.values(criterionTags).forEach((tagArray) => {
            if (Array.isArray(tagArray)) {
                tagArray.forEach((tag) => allCriterionTags.add(tag))
            }
        })

        // Prüfen ob mindestens ein aktiver Filter-Tag im Kriterium enthalten ist
        return Array.from(this.activeTagFilters).some((tag) =>
            allCriterionTags.has(tag)
        )
    }

    /**
     * Zeigt alle Karten an (entfernt Tag-Filter)
     */
    showAllCards() {
        document.querySelectorAll(".pruefschritt-card").forEach((card) => {
            card.classList.remove("tag-filtered")
        })
        this.updateTagFilterCount()
    }

    /**
     * Filtert die Anzeige der Tags basierend auf Suchbegriff
     */
    filterTagsDisplay(searchTerm) {
        const term = searchTerm.toLowerCase()

        document.querySelectorAll(".tag-filter-btn").forEach((btn) => {
            const tag = btn.dataset.tag.toLowerCase()
            const text = btn.textContent.toLowerCase()
            const matches = tag.includes(term) || text.includes(term)

            btn.style.display = matches ? "" : "none"
        })
    }

    /**
     * Togglet zwischen normaler und kategorisierter Ansicht
     */
    toggleCategorizedView() {
        const categorized = document.getElementById("categorized-tags")
        const normal = document.querySelectorAll("#popular-tags, #all-tags")

        const isVisible = categorized.style.display !== "none"

        categorized.style.display = isVisible ? "none" : "block"
        normal.forEach(
            (el) => (el.style.display = isVisible ? "block" : "none")
        )

        const toggleBtn = document.getElementById("toggle-tag-categories")
        const icon = toggleBtn.querySelector(".material-icons")
        icon.textContent = isVisible ? "category" : "view_list"
    }

    /**
     * Löscht alle aktiven Tag-Filter
     */
    clearAllTagFilters() {
        this.activeTagFilters.clear()
        this.updateTagButtonStates()
        this.applyTagFilters()
        this.updateActiveFiltersDisplay()
    }

    /**
     * Tastatur-Navigation für Tag-Buttons
     */
    handleTagKeyboardNavigation(e) {
        const currentBtn = e.target
        const allTagBtns = Array.from(
            document.querySelectorAll(
                '.tag-filter-btn:not([style*="display: none"])'
            )
        )
        const currentIndex = allTagBtns.indexOf(currentBtn)

        switch (e.key) {
            case "ArrowRight":
                e.preventDefault()
                const nextIndex = (currentIndex + 1) % allTagBtns.length
                allTagBtns[nextIndex]?.focus()
                break

            case "ArrowLeft":
                e.preventDefault()
                const prevIndex =
                    currentIndex === 0
                        ? allTagBtns.length - 1
                        : currentIndex - 1
                allTagBtns[prevIndex]?.focus()
                break

            case "Home":
                e.preventDefault()
                allTagBtns[0]?.focus()
                break

            case "End":
                e.preventDefault()
                allTagBtns[allTagBtns.length - 1]?.focus()
                break
        }
    }

    /**
     * Aktualisiert die Anzeige der aktiven Filter
     */
    updateActiveFiltersDisplay() {
        const existingDisplay = document.querySelector(".active-tag-filters")
        if (existingDisplay) {
            existingDisplay.remove()
        }

        if (this.activeTagFilters.size > 0) {
            const display = document.createElement("div")
            display.className = "active-tag-filters"
            display.innerHTML = `
                <span>Aktive Tags:</span>
                ${Array.from(this.activeTagFilters)
                    .map(
                        (tag) =>
                            `<span class="active-tag-badge">${tag.replace(
                                /-/g,
                                " "
                            )}</span>`
                    )
                    .join("")}
            `

            const tagsContainer = document.querySelector(".tags-filter-group")
            if (tagsContainer) {
                tagsContainer.appendChild(display)
            }
        }
    }

    /**
     * Aktualisiert die Anzahl der gefilterten Ergebnisse
     */
    updateTagFilterCount(visibleCount = null) {
        let countDisplay = document.querySelector(".tag-filter-count")

        if (!countDisplay) {
            countDisplay = document.createElement("div")
            countDisplay.className = "tag-filter-count"
            const filterBar = document.querySelector(".filter-bar")
            if (filterBar) {
                filterBar.appendChild(countDisplay)
            }
        }

        if (this.activeTagFilters.size === 0) {
            countDisplay.textContent = ""
            return
        }

        if (visibleCount === null) {
            visibleCount = document.querySelectorAll(
                ".pruefschritt-card:not(.tag-filtered)"
            ).length
        }

        const totalCount =
            document.querySelectorAll(".pruefschritt-card").length
        countDisplay.textContent = `Tag-Filter: ${visibleCount} von ${totalCount} Kriterien`
    }

    /**
     * CSS-Styles für die Tag-Filter hinzufügen
     */
    addTagsStyles() {
        const style = document.createElement("style")
        style.textContent = `
            /* Tag-Filter Styles */
    
            .tags-filter-group {
                border-top: 1px solid rgba(255, 255, 255, 0.2);
                padding-top: 15px;
                margin-top: 15px;
            }

            .tags-search-container {
                display: flex;
                gap: 8px;
                margin-bottom: 15px;
            }

            .tags-search-input {
                flex: 1;
                padding: 8px 12px;
                background: rgba(255, 255, 255, 0.1);
                border: 1px solid rgba(255, 255, 255, 0.3);
                border-radius: 4px;
                color: white;
                font-size: 0.9rem;
            }

            .tags-search-input::placeholder {
                color: rgba(255, 255, 255, 0.5);
            }

            .tags-search-input:focus {
                outline: 2px solid white;
                background: rgba(255, 255, 255, 0.15);
            }


            .clear-tags-btn,
            .toggle-categories-btn {
                padding: 8px;
                background: rgba(255, 255, 255, 0.1);
                border: 1px solid rgba(255, 255, 255, 0.3);
                border-radius: 4px;
                color: white;
                cursor: pointer;
                transition: background 0.3s ease;
            }

            .clear-tags-btn:hover,
            .toggle-categories-btn:hover {
                background: rgba(255, 255, 255, 0.2);
            }

                        .clear-tags-btn {
                margin-inline-start: 1rem;
                padding: 0.125rem;
            }

            .tags-grid {
                display: flex;
                flex-wrap: wrap;
                gap: 6px;
                margin: 10px 0;
            }

            .tag-filter-btn {
                padding: 6px 12px;
                background: rgba(255, 255, 255, 0.1);
                border: 1px solid rgba(255, 255, 255, 0.3);
                border-radius: 12px;
                color: white;
                font-size: 0.8rem;
                cursor: pointer;
                transition: all 0.3s ease;
                text-transform: capitalize;
            }

            .tag-filter-btn:hover {
                background: rgba(255, 255, 255, 0.2);
                transform: translateY(-1px);
            }

            .tag-filter-btn:focus {
                outline: 2px solid white;
                outline-offset: 2px;
            }

            .tag-filter-btn.active {
                background: rgba(0, 150, 255, 0.8);
                border-color: white;
                font-weight: bold;
            }

            .tag-filter-btn.popular-tag {
                background: rgba(100, 200, 100, 0.2);
                border-color: rgba(100, 200, 100, 0.5);
            }

            .tag-filter-btn.popular-tag.active {
                background: rgba(100, 200, 100, 0.8);
            }

            .popular-tags-section h4,
            .categorized-tags-section h4 {
                color: rgba(255, 255, 255, 0.8);
                font-size: 0.9rem;
                margin: 10px 0 8px 0;
            }

            .all-tags-grid {
                max-height: 200px;
                overflow-y: auto;
            }

            .category-tags-grid {
                max-height: 150px;
                overflow-y: auto;
            }

            .active-tag-filters {
                margin-top: 15px;
                padding: 10px;
                background: rgba(0, 150, 255, 0.2);
                border-radius: 8px;
                font-size: 0.9rem;
            }

            .active-tag-badge {
                display: inline-block;
                padding: 3px 8px;
                background: rgba(0, 150, 255, 0.6);
                border-radius: 8px;
                margin: 2px 4px 2px 0;
                font-size: 0.8rem;
                text-transform: capitalize;
            }

            .tag-filter-count {
                position: fixed;
                bottom: 20px;
                left: 20px;
                background: rgba(0, 0, 0, 0.8);
                color: white;
                padding: 8px 16px;
                border-radius: 20px;
                font-size: 0.9rem;
                z-index: 1000;
            }

            /* Integration mit bestehenden Filtern */
            .card.tag-filtered {
                display: none !important;
            }

            /* Details/Summary Styling */
            details summary {
                cursor: pointer;
                padding: 8px 0;
                color: rgba(255, 255, 255, 0.9);
                font-weight: 500;
            }

            details summary:hover {
                color: white;
            }

            details[open] summary {
                margin-bottom: 8px;
            }

            /* Responsive Design */
            @media (max-width: 768px) {
                .tags-grid {
                    gap: 4px;
                }
                
                .tag-filter-btn {
                    font-size: 0.75rem;
                    padding: 4px 8px;
                }
                
                .tag-filter-count {
                    bottom: 10px;
                    left: 10px;
                    font-size: 0.8rem;
                    padding: 6px 12px;
                }
            }
        `

        document.head.appendChild(style)
    }
}

// Globale Instanz erstellen
let tagsFilterSystem = null

/**
 * Initialisiert das Tag-Filter System nach dem Laden der Seite
 */
function initTagsFilter() {
    if (tagsFilterSystem) return

    tagsFilterSystem = new TagsFilterSystem()
    tagsFilterSystem.init()
}

/**
 * Integration mit dem bestehenden System
 */
if (typeof loadAndRenderData !== "undefined") {
    const originalLoadAndRenderData = loadAndRenderData
    loadAndRenderData = function () {
        originalLoadAndRenderData()

        // Tag-System nach dem Rendern initialisieren
        setTimeout(() => {
            initTagsFilter()
        }, 800)
    }
} else {
    // Fallback: Initialisierung nach DOM-Load
    document.addEventListener("DOMContentLoaded", () => {
        setTimeout(initTagsFilter, 1000)
    })
}

/**
 * Utility-Funktionen für die Browser-Konsole
 */
window.tagsFilterDebug = {
    getActiveFilters: () => tagsFilterSystem?.activeTagFilters,
    clearFilters: () => tagsFilterSystem?.clearAllTagFilters(),
    getAllTags: () => tagsFilterSystem?.allTags,
    getTagsData: () => tagsFilterSystem?.tagsData,
}

console.log(
    "🏷️ Tag-Filter System geladen. Verwende window.tagsFilterDebug für Debug-Funktionen."
)
