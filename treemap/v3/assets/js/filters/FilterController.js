/**
 *    @version v3
 */

// filters/FilterController.js - Steuerung der Filterlogik
class FilterController {
    constructor(eventBus, uiRegistry, treemapController) {
        this.eventBus = eventBus
        this.uiRegistry = uiRegistry
        this.treemapController = treemapController

        // Filter-Zustand
        this.filterState = {
            search: "",
            levels: new Set(),
            standards: new Set(["BITV", "WCAG", "EN301549", "BITinklusiv"]),
            professions: new Set(),
        }

        // Services
        this.filterService = new FilterService()

        // View
        this.filterView = new FilterView(eventBus, uiRegistry, this)
    }

    /**
     * Initialisiert den Filter-Controller
     */
    init() {
        // Lade gespeicherte Filter-Einstellungen
        this.loadFilterSettings()

        // Initialisiere View
        this.filterView.init()

        // Registriere Event-Listener
        this.registerEventListeners()

        // Wende initiale Filter an
        this.applyFilters()
    }

    /**
     * Registriert Event-Listener für Filter-Events
     */
    registerEventListeners() {
        // Level-Filter
        this.eventBus.subscribe("filter:level-changed", (data) => {
            const { level, active } = data

            if (active) {
                this.filterState.levels.add(level)
            } else {
                this.filterState.levels.delete(level)
            }

            this.applyFilters()
            this.saveFilterSettings()
        })

        // Standard-Filter
        this.eventBus.subscribe("filter:standard-changed", (data) => {
            const { standard, active } = data

            if (active) {
                this.filterState.standards.add(standard)
            } else {
                this.filterState.standards.delete(standard)
            }

            this.applyFilters()
            this.saveFilterSettings()
        })

        // Berufsgruppen-Filter
        this.eventBus.subscribe("filter:profession-changed", (data) => {
            const { profession, active } = data

            if (active) {
                this.filterState.professions.add(profession)
            } else {
                this.filterState.professions.delete(profession)
            }

            this.applyFilters()
            this.saveFilterSettings()
        })

        // Suche
        this.eventBus.subscribe("filter:search-changed", (data) => {
            this.filterState.search = data.search
            this.applyFilters()
        })

        // Filter zurücksetzen
        this.eventBus.subscribe("filter:reset", () => {
            this.resetFilters()
        })
    }

    /**
     * Lädt gespeicherte Filtereinstellungen
     */
    loadFilterSettings() {
        try {
            const settings = JSON.parse(
                localStorage.getItem("bitvFilterSettings")
            )
            if (!settings) return

            // Konformitätslevel laden
            if (Array.isArray(settings.levels)) {
                this.filterState.levels = new Set(settings.levels)
            }

            // Standards laden
            if (Array.isArray(settings.standards)) {
                this.filterState.standards = new Set(settings.standards)
            }

            // Berufsgruppen laden
            if (Array.isArray(settings.professions)) {
                this.filterState.professions = new Set(settings.professions)
            }
        } catch (error) {
            console.error("Fehler beim Laden der Filtereinstellungen:", error)
        }
    }

    /**
     * Speichert aktuelle Filtereinstellungen
     */
    saveFilterSettings() {
        try {
            const settings = {
                levels: Array.from(this.filterState.levels),
                standards: Array.from(this.filterState.standards),
                professions: Array.from(this.filterState.professions),
            }

            localStorage.setItem("bitvFilterSettings", JSON.stringify(settings))
        } catch (error) {
            console.error(
                "Fehler beim Speichern der Filtereinstellungen:",
                error
            )
        }
    }

    /**
     * Setzt alle Filter zurück
     */
    resetFilters() {
        this.filterState = {
            search: "",
            levels: new Set(),
            standards: new Set(["BITV", "WCAG", "EN301549", "BITinklusiv"]),
            professions: new Set(),
        }

        // UI aktualisieren
        this.filterView.updateUI()

        // Filter anwenden
        this.applyFilters()

        // Einstellungen speichern
        this.saveFilterSettings()
    }

    /**
     * Wendet alle aktiven Filter auf die Treemap an
     */
    applyFilters() {
        // Hole alle Prüfschritt-Karten
        const cards = document.querySelectorAll(".pruefschritt-card")
        let visibleCount = 0

        // Für jede Karte prüfen, ob sie den Filterkriterien entspricht
        cards.forEach((card) => {
            const pruefschritt = card.pruefschrittData
            if (!pruefschritt) return

            // Prüfe, ob die Karte den Filterkriterien entspricht
            const searchMatch = this.filterService.matchesSearch(
                card,
                pruefschritt,
                this.filterState.search
            )
            const levelMatch = this.filterService.matchesLevel(
                card,
                pruefschritt,
                this.filterState.levels
            )
            const standardMatch = this.filterService.matchesStandard(
                pruefschritt,
                this.filterState.standards
            )
            const professionMatch = this.filterService.matchesProfession(
                pruefschritt,
                this.filterState.professions
            )

            // Wenn alle Filter zutreffen, Karte anzeigen, sonst ausblenden
            if (searchMatch && levelMatch && standardMatch && professionMatch) {
                card.classList.remove("filtered")
                visibleCount++
            } else {
                card.classList.add("filtered")
            }
        })

        // Filterzähler aktualisieren
        this.filterView.updateFilterCount(visibleCount, cards.length)

        // Konformitätslevel-Anzeige aktualisieren
        this.updateConformanceLevelVisibility()

        // Event veröffentlichen, dass Filter angewendet wurden
        this.eventBus.publish("filter:applied", {
            visibleCount,
            totalCount: cards.length,
            filterState: { ...this.filterState },
        })
    }

    /**
     * Aktualisiert die Sichtbarkeit der Konformitätslevel-Anzeige
     */
    updateConformanceLevelVisibility() {
        const hasActiveConformanceFilters = this.filterState.levels.size > 0

        if (hasActiveConformanceFilters) {
            document.body.classList.remove("conformance-filter-inactive")
        } else {
            document.body.classList.add("conformance-filter-inactive")
        }
    }

    /**
     * Gibt den aktuellen Filter-Zustand zurück
     * @returns {object} - Der Filter-Zustand
     */
    getFilterState() {
        return { ...this.filterState }
    }
}
