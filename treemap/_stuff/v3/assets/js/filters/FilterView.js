/**
 *    @version v3
 */

// filters/FilterView.js - UI-Komponenten für Filter
class FilterView {
    constructor(eventBus, uiRegistry, filterController) {
        this.eventBus = eventBus
        this.uiRegistry = uiRegistry
        this.filterController = filterController
    }

    /**
     * Initialisiert die Filter-View
     */
    init() {
        // Lade gespeicherte Filter-UI-Einstellungen
        this.loadFilterUISettings()

        // Erstelle Filter-UI-Komponenten
        this.createFilterComponents()

        // Initialisiere Suchfeld
        this.initSearchField()

        // Initialisiere Level-Filter
        this.initLevelFilters()

        // Initialisiere Standard-Filter
        this.initStandardFilters()

        // Initialisiere Berufsgruppen-Filter
        this.initProfessionFilters()

        // Initialisiere Anzeigeoptionen
        this.initDisplayOptions()

        // Führe initiales Update der UI durch
        this.updateUI()
    }

    /**
     * Lädt gespeicherte Filter-UI-Einstellungen
     */
    loadFilterUISettings() {
        try {
            const settings = JSON.parse(
                localStorage.getItem("bitvFilterUISettings")
            )
            if (!settings) return

            // Anzeigeoptionen laden
            if (settings.displayOptions) {
                this.displayOptions = settings.displayOptions
            } else {
                this.displayOptions = {
                    bitvId: true,
                    wcagId: true,
                    professionMarkers: true,
                }
            }
        } catch (error) {
            console.error(
                "Fehler beim Laden der Filter-UI-Einstellungen:",
                error
            )

            // Standard-Einstellungen verwenden
            this.displayOptions = {
                bitvId: true,
                wcagId: true,
                professionMarkers: true,
            }
        }
    }

    /**
     * Speichert aktuelle Filter-UI-Einstellungen
     */
    saveFilterUISettings() {
        try {
            const settings = {
                displayOptions: this.displayOptions,
            }

            localStorage.setItem(
                "bitvFilterUISettings",
                JSON.stringify(settings)
            )
        } catch (error) {
            console.error(
                "Fehler beim Speichern der Filter-UI-Einstellungen:",
                error
            )
        }
    }

    /**
     * Erstellt Filter-UI-Komponenten
     */
    createFilterComponents() {
        const filterBar = this.uiRegistry.getContainer("filter")
        if (!filterBar) return

        // Bereits erstellte Komponenten verwenden
    }

    /**
     * Initialisiert das Suchfeld
     */
    initSearchField() {
        const searchInput = this.uiRegistry.getElement("searchInput")
        const clearButton = document.getElementById("clearSearch")

        if (!searchInput) return

        // Suche bei Eingabe aktualisieren
        searchInput.addEventListener("input", () => {
            const searchText = searchInput.value.trim()

            // Clear-Button anzeigen/verstecken
            if (clearButton) {
                clearButton.style.display = searchText ? "flex" : "none"
            }

            // Event veröffentlichen
            this.eventBus.publish("filter:search-changed", {
                search: searchText,
            })
        })

        // Clear-Button
        if (clearButton) {
            clearButton.addEventListener("click", () => {
                searchInput.value = ""
                clearButton.style.display = "none"

                // Event veröffentlichen
                this.eventBus.publish("filter:search-changed", { search: "" })
            })
        }
    }

    /**
     * Initialisiert die Konformitätslevel-Filter
     */
    initLevelFilters() {
        const filterButtons = document.querySelectorAll(
            ".filter-btn[data-level]"
        )
        const filterState = this.filterController.getFilterState()

        filterButtons.forEach((btn) => {
            const level = btn.dataset.level

            // Initialen Zustand setzen
            btn.setAttribute(
                "aria-pressed",
                filterState.levels.has(level) ? "true" : "false"
            )

            // Click-Handler
            btn.addEventListener("click", () => {
                const isPressed = btn.getAttribute("aria-pressed") === "true"
                btn.setAttribute("aria-pressed", !isPressed ? "true" : "false")

                // Event veröffentlichen
                this.eventBus.publish("filter:level-changed", {
                    level,
                    active: !isPressed,
                })
            })
        })
    }

    /**
     * Initialisiert die Standard-Filter
     */
    initStandardFilters() {
        const standardButtons = document.querySelectorAll(
            ".standard-filter-btn"
        )
        const filterState = this.filterController.getFilterState()

        standardButtons.forEach((btn) => {
            const standard = btn.dataset.standard

            // Initialen Zustand setzen
            btn.setAttribute(
                "aria-pressed",
                filterState.standards.has(standard) ? "true" : "false"
            )

            // Click-Handler
            btn.addEventListener("click", () => {
                const isPressed = btn.getAttribute("aria-pressed") === "true"
                btn.setAttribute("aria-pressed", !isPressed ? "true" : "false")

                // Event veröffentlichen
                this.eventBus.publish("filter:standard-changed", {
                    standard,
                    active: !isPressed,
                })
            })
        })
    }

    /**
     * Initialisiert die Berufsgruppen-Filter
     */
    initProfessionFilters() {
        const professionButtons = document.querySelectorAll(
            ".profession-filter-btn"
        )
        const filterState = this.filterController.getFilterState()

        professionButtons.forEach((btn) => {
            const profession = btn.dataset.profession

            // Initialen Zustand setzen
            btn.setAttribute(
                "aria-pressed",
                filterState.professions.has(profession) ? "true" : "false"
            )

            // Click-Handler
            btn.addEventListener("click", () => {
                const isPressed = btn.getAttribute("aria-pressed") === "true"
                btn.setAttribute("aria-pressed", !isPressed ? "true" : "false")

                // Event veröffentlichen
                this.eventBus.publish("filter:profession-changed", {
                    profession,
                    active: !isPressed,
                })
            })
        })
    }

    /**
     * Initialisiert die Anzeigeoptionen
     */
    initDisplayOptions() {
        const bitvIdCheckbox = document.getElementById("display-bitv-id")
        const wcagIdCheckbox = document.getElementById("display-wcag-id")
        const professionMarkersCheckbox = document.getElementById(
            "display-profession-markers"
        )

        if (bitvIdCheckbox) {
            bitvIdCheckbox.checked = this.displayOptions.bitvId
            bitvIdCheckbox.addEventListener("change", () => {
                this.displayOptions.bitvId = bitvIdCheckbox.checked
                document.body.classList.toggle(
                    "hide-bitv-id",
                    !bitvIdCheckbox.checked
                )
                this.saveFilterUISettings()
            })

            // Initialen Zustand anwenden
            document.body.classList.toggle(
                "hide-bitv-id",
                !this.displayOptions.bitvId
            )
        }

        if (wcagIdCheckbox) {
            wcagIdCheckbox.checked = this.displayOptions.wcagId
            wcagIdCheckbox.addEventListener("change", () => {
                this.displayOptions.wcagId = wcagIdCheckbox.checked
                document.body.classList.toggle(
                    "hide-wcag-id",
                    !wcagIdCheckbox.checked
                )
                this.saveFilterUISettings()
            })

            // Initialen Zustand anwenden
            document.body.classList.toggle(
                "hide-wcag-id",
                !this.displayOptions.wcagId
            )
        }

        if (professionMarkersCheckbox) {
            professionMarkersCheckbox.checked =
                this.displayOptions.professionMarkers
            professionMarkersCheckbox.addEventListener("change", () => {
                this.displayOptions.professionMarkers =
                    professionMarkersCheckbox.checked
                document.body.classList.toggle(
                    "hide-profession-markers",
                    !professionMarkersCheckbox.checked
                )
                this.saveFilterUISettings()
            })

            // Initialen Zustand anwenden
            document.body.classList.toggle(
                "hide-profession-markers",
                !this.displayOptions.professionMarkers
            )
        }
    }

    /**
     * Aktualisiert die UI basierend auf dem aktuellen Filter-Zustand
     */
    updateUI() {
        const filterState = this.filterController.getFilterState()

        // Level-Filter aktualisieren
        document.querySelectorAll(".filter-btn[data-level]").forEach((btn) => {
            const level = btn.dataset.level
            btn.setAttribute(
                "aria-pressed",
                filterState.levels.has(level) ? "true" : "false"
            )
        })

        // Standard-Filter aktualisieren
        document.querySelectorAll(".standard-filter-btn").forEach((btn) => {
            const standard = btn.dataset.standard
            btn.setAttribute(
                "aria-pressed",
                filterState.standards.has(standard) ? "true" : "false"
            )
        })

        // Berufsgruppen-Filter aktualisieren
        document.querySelectorAll(".profession-filter-btn").forEach((btn) => {
            const profession = btn.dataset.profession
            btn.setAttribute(
                "aria-pressed",
                filterState.professions.has(profession) ? "true" : "false"
            )
        })

        // Suchfeld aktualisieren
        const searchInput = this.uiRegistry.getElement("searchInput")
        if (searchInput) {
            searchInput.value = filterState.search
        }

        // Clear-Button aktualisieren
        const clearButton = document.getElementById("clearSearch")
        if (clearButton) {
            clearButton.style.display = filterState.search ? "flex" : "none"
        }
    }

    /**
     * Aktualisiert den Filterzähler
     * @param {number} visibleCount - Anzahl der sichtbaren Elemente
     * @param {number} totalCount - Gesamtanzahl der Elemente
     */
    updateFilterCount(visibleCount, totalCount) {
        const filterCount = this.uiRegistry.getElement("filterCount")
        if (!filterCount) return

        filterCount.textContent = `${visibleCount} von ${totalCount} Kriterien sichtbar`
    }
}
