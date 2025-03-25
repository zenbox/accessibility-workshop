// - - - - - - - - - -
// @version v3
// - - - - - - - - - -

// Globale Variablen für Navigationsstatus
let activeSection = null
let activeCard = null
let activeTooltip = null
let tooltipTimeout = null

// - - - - - - - - - -
// - - - - - - - - - -
// - - - - - - - - - -

/**
 * Setzt den Fokus auf eine bestimmte Sektion
 * @param {HTMLElement} section - Die zu fokussierende Sektion
 */
function focusSection(section) {
    // Entferne fokus von aktueller Sektion und Karte
    if (activeSection) {
        activeSection.classList.remove("section-focus")
    }

    if (activeCard) {
        activeCard.classList.remove("card-focus")
        hideTooltip(activeCard)
        activeCard = null
    }

    // Setze neue aktive Sektion
    activeSection = section
    activeSection.classList.add("section-focus")
    activeSection.focus()
}

/**
 * Setzt den Fokus auf eine bestimmte Karte
 * @param {HTMLElement} card - Die zu fokussierende Karte
 * @param {HTMLElement} section - Die Sektion, zu der die Karte gehört
 */
function focusCard(card, section) {
    // Entferne fokus von aktueller Karte
    if (activeCard) {
        activeCard.classList.remove("card-focus")
        hideTooltip(activeCard)
    }

    // Setze neue aktive Karte und Sektion
    activeCard = card
    activeCard.classList.add("card-focus")

    // Fokussiere Sektion falls notwendig
    if (activeSection !== section) {
        if (activeSection) {
            activeSection.classList.remove("section-focus")
        }
        activeSection = section
        activeSection.classList.add("section-focus")
    }

    // Zeige Tooltip
    showTooltip(card)

    // Scrolle die Karte ins Sichtfeld wenn nötig
    card.scrollIntoView({ behavior: "smooth", block: "nearest" })
}

// - - - - - - - - - -
// - - - - - - - - - -
// - - - - - - - - - -

/**
 * Öffnet das Detailmodal für einen Prüfschritt
 * @param {HTMLElement} card - Die Karte mit dem Prüfschritt
 */
function openCardDetails(card) {
    if (card && card.pruefschrittData) {
        showDetails(card.pruefschrittData)
    }
}

// - - - - - - - - - -
// - - - - - - - - - -
// - - - - - - - - - -
function addSkipLink() {
    // Skip-Link zum Anfang der Seite hinzufügen
    const skipLink = document.createElement("a")
    skipLink.href = "#main-content"
    skipLink.className = "skip-link"
    skipLink.textContent = "Zum Hauptinhalt springen"

    // Am Anfang des Body einfügen
    document.body.insertBefore(skipLink, document.body.firstChild)

    // ID zum Hauptinhalt hinzufügen
    const mainContent = document.querySelector("main")
    if (mainContent) {
        mainContent.id = "main-content"
    }
}

/**
 * Initialisiert die verbesserte Tastaturnavigation
 */
function initEnhancedKeyboardNavigation() {
    const container = document.querySelector(".tree-container")
    const sections = Array.from(document.querySelectorAll(".section-column"))

    // Füge ARIA-Attribute zum Container hinzu
    if (container) {
        container.setAttribute("role", "tablist")
        container.setAttribute(
            "aria-label",
            "Barrierefreiheitskriterien nach Kategorien"
        )
    }

    // Globaler Event-Listener für Escape-Taste und andere globale Shortcuts
    document.addEventListener("keydown", (e) => {
        // Überprüfe, ob ein Form-Element fokussiert ist (Eingabefeld, Textbereich etc.)
        const isFormElement =
            document.activeElement.tagName === "INPUT" ||
            document.activeElement.tagName === "TEXTAREA" ||
            document.activeElement.tagName === "SELECT"

        // Falls ein Formular-Element fokussiert ist, nur Escape behandeln
        if (isFormElement && e.key !== "Escape") {
            return
        }

        switch (e.key) {
            case "Escape":
                // Wenn ein Modal offen ist, schließe es
                const modal = document.getElementById("sectionModal")
                if (modal && modal.style.display === "block") {
                    e.preventDefault()
                    modal.style.display = "none"
                    modal.setAttribute("aria-hidden", "true")
                    return
                }

                // Sonst Fokus zurücksetzen
                if (activeCard) {
                    e.preventDefault()
                    activeCard.classList.remove("card-focus")
                    hideTooltip(activeCard)
                    activeCard = null
                }

                if (activeSection) {
                    e.preventDefault()
                    activeSection.classList.remove("section-focus")
                    activeSection = null
                }

                // Setze Fokus auf Anfang der Seite
                document.querySelector("h1").focus()
                break

            case "h":
            case "H":
                // Tastenkürzel "h" für Hilfe/Übersicht
                e.preventDefault()
                alert(
                    "Tastaturnavigation:\n\n" +
                        "Tab / Shift+Tab: Durch alle Elemente navigieren\n" +
                        "Pfeiltasten: Durch Karten und Kategorien navigieren\n" +
                        "Enter / Leertaste: Karten-Details öffnen\n" +
                        "Escape: Fokus zurücksetzen oder Dialog schließen\n" +
                        "h: Diese Hilfe anzeigen"
                )
                break

            case "/":
                // Tastenkürzel "/" für Suche
                e.preventDefault()
                const searchInput = document.getElementById("searchInput")
                if (searchInput) {
                    searchInput.focus()
                    searchInput.select() // Text markieren für schnelles Überschreiben
                }
                break

            case "Home":
                // Home-Taste zur ersten Sektion springen
                if (sections.length > 0) {
                    e.preventDefault()
                    focusSection(sections[0])
                }
                break

            case "End":
                // End-Taste zur letzten Sektion springen
                if (sections.length > 0) {
                    e.preventDefault()
                    focusSection(sections[sections.length - 1])
                }
                break
        }
    })

    // Mache alle Sektionen fokussierbar
    sections.forEach((section, sectionIndex) => {
        section.setAttribute("tabindex", "0")
        section.setAttribute("role", "region")
        section.setAttribute(
            "aria-label",
            section.querySelector(".section-card")?.textContent ||
                `Sektion ${sectionIndex + 1}`
        )

        // Alle Karten in der Sektion finden
        const cards = Array.from(section.querySelectorAll(".card"))
        let activeCardIndex = -1

        // Fokusevents für Sektionen
        section.addEventListener("focus", () => {
            focusSection(section)
        })

        section.addEventListener("blur", () => {
            // Fokusklasse nur entfernen, wenn nicht zu einer Karte in derselben Sektion gewechselt wird
            const newFocusInSection = section.contains(document.activeElement)
            if (!newFocusInSection) {
                section.classList.remove("section-focus")
                if (activeSection === section) {
                    activeSection = null
                }
            }
        })

        // Tastatursteuerung innerhalb einer Sektion
        section.addEventListener("keydown", (e) => {
            // Wenn schon eine Karte fokussiert ist
            if (activeCard && cards.includes(activeCard)) {
                activeCardIndex = cards.indexOf(activeCard)
            } else {
                activeCardIndex = -1
            }

            switch (e.key) {
                case "ArrowDown":
                    e.preventDefault()
                    // Nächste Karte in der Sektion
                    if (activeCardIndex < cards.length - 1) {
                        focusCard(cards[activeCardIndex + 1], section)
                    }
                    break

                case "ArrowUp":
                    e.preventDefault()
                    // Vorherige Karte in der Sektion
                    if (activeCardIndex > 0) {
                        focusCard(cards[activeCardIndex - 1], section)
                    }
                    break

                case "ArrowRight":
                    e.preventDefault()
                    // Zur nächsten Sektion navigieren
                    const nextSectionIndex = sectionIndex + 1
                    if (nextSectionIndex < sections.length) {
                        const nextSection = sections[nextSectionIndex]
                        const nextCards = Array.from(
                            nextSection.querySelectorAll(".card")
                        )

                        if (
                            activeCardIndex >= 0 &&
                            activeCardIndex < nextCards.length
                        ) {
                            // Zur gleichen Position in der nächsten Sektion
                            focusCard(nextCards[activeCardIndex], nextSection)
                        } else if (nextCards.length > 0) {
                            // Zur ersten Karte der nächsten Sektion
                            focusCard(nextCards[0], nextSection)
                        } else {
                            // Oder einfach zur nächsten Sektion
                            focusSection(nextSection)
                        }
                    }
                    break

                case "ArrowLeft":
                    e.preventDefault()
                    // Zur vorherigen Sektion navigieren
                    const prevSectionIndex = sectionIndex - 1
                    if (prevSectionIndex >= 0) {
                        const prevSection = sections[prevSectionIndex]
                        const prevCards = Array.from(
                            prevSection.querySelectorAll(".card")
                        )

                        if (
                            activeCardIndex >= 0 &&
                            activeCardIndex < prevCards.length
                        ) {
                            // Zur gleichen Position in der vorherigen Sektion
                            focusCard(prevCards[activeCardIndex], prevSection)
                        } else if (prevCards.length > 0) {
                            // Zur letzten Karte der vorherigen Sektion
                            focusCard(
                                prevCards[prevCards.length - 1],
                                prevSection
                            )
                        } else {
                            // Oder einfach zur vorherigen Sektion
                            focusSection(prevSection)
                        }
                    }
                    break

                case "Enter":
                case " ": // Space
                    e.preventDefault()
                    // Öffne Details der aktiven Karte
                    if (activeCard && cards.includes(activeCard)) {
                        openCardDetails(activeCard)
                    }
                    break

                case "Tab":
                    // Tab-Taste standardmäßig durchlassen
                    if (!e.shiftKey && activeCardIndex === cards.length - 1) {
                        // Am Ende der Sektion zur nächsten Sektion gehen
                        const nextSection = sections[sectionIndex + 1]
                        if (nextSection) {
                            e.preventDefault()
                            focusSection(nextSection)
                        }
                    } else if (e.shiftKey && activeCardIndex === 0) {
                        // Am Anfang der Sektion zur vorherigen Sektion gehen
                        const prevSection = sections[sectionIndex - 1]
                        if (prevSection) {
                            e.preventDefault()
                            focusSection(prevSection)
                        }
                    }
                    break
            }
        })

        // Mache alle Karten in der Sektion tabulierbar
        cards.forEach((card) => {
            if (card.classList.contains("pruefschritt-card")) {
                card.setAttribute("tabindex", "0")

                // Focus-Event für Karten
                card.addEventListener("focus", () => {
                    focusCard(card, section)
                })

                card.addEventListener("blur", () => {
                    // Nur entfernen, wenn nicht zu einer anderen Karte oder Sektion gewechselt wird
                    setTimeout(() => {
                        const activeElement = document.activeElement
                        const isCardOrSection =
                            activeElement.classList.contains("card") ||
                            activeElement.classList.contains("section-column")

                        if (!isCardOrSection) {
                            card.classList.remove("card-focus")
                            hideTooltip(card)
                            if (activeCard === card) {
                                activeCard = null
                            }
                        }
                    }, 0)
                })

                // Tastatursteuerung für Karten
                card.addEventListener("keydown", (e) => {
                    switch (e.key) {
                        case "Enter":
                        case " ": // Space
                            e.preventDefault()
                            openCardDetails(card)
                            break

                        case "ArrowDown":
                        case "ArrowUp":
                        case "ArrowLeft":
                        case "ArrowRight":
                            // Diese Events an die Sektion delegieren
                            e.preventDefault()
                            const event = new KeyboardEvent("keydown", {
                                key: e.key,
                                bubbles: true,
                            })
                            section.dispatchEvent(event)
                            break
                    }
                })

                // Mausinteraktionen
                card.addEventListener("click", (e) => {
                    focusCard(card, section)
                    openCardDetails(card)
                })

                card.addEventListener("mouseenter", () => {
                    if (card !== activeCard) {
                        showTooltip(card)
                    }
                })

                card.addEventListener("mouseleave", () => {
                    if (card !== activeCard) {
                        hideTooltip(card)
                    }
                })
            }
        })
    })

    // Verbesserte Filtersteuerung
    initFilterKeyboardNavigation()
}

function initKeyboardNavigation() {
    initEnhancedKeyboardNavigation()
}

/**
 * Findet das nächste fokussierbare Element in einer Reihe
 * @param {HTMLElement} element - Das Ausgangselement
 * @param {boolean} forward - Richtung (vorwärts/rückwärts)
 * @param {string} containerSelector - Optional: Begrenze Suche auf Container
 * @returns {HTMLElement|null} Das nächste fokussierbare Element oder null
 */
function findNextFocusableElement(
    element,
    forward = true,
    containerSelector = null
) {
    let focusables

    if (containerSelector) {
        // Wenn ein Container angegeben ist, nur Elemente innerhalb dieses Containers suchen
        const container = element.closest(containerSelector)
        if (container) {
            focusables = Array.from(
                container.querySelectorAll('button, input, [tabindex="0"]')
            )
        } else {
            focusables = Array.from(
                document.querySelectorAll('button, input, [tabindex="0"]')
            )
        }
    } else {
        // Alle fokussierbaren Elemente im Dokument
        focusables = Array.from(
            document.querySelectorAll('button, input, [tabindex="0"]')
        )
    }

    // Nur sichtbare Elemente berücksichtigen
    focusables = focusables.filter((el) => {
        // Element nicht sichtbar?
        if (el.offsetParent === null) return false

        // Element oder Elternelement hat display:none oder visibility:hidden?
        const style = window.getComputedStyle(el)
        if (style.display === "none" || style.visibility === "hidden")
            return false

        // Prüfen ob gefiltert (falls es eine Card ist)
        if (el.classList.contains("filtered")) return false

        return true
    })

    const currentIndex = focusables.indexOf(element)

    if (forward && currentIndex < focusables.length - 1) {
        return focusables[currentIndex + 1]
    } else if (!forward && currentIndex > 0) {
        return focusables[currentIndex - 1]
    } else if (forward && currentIndex === focusables.length - 1) {
        // Am Ende angelangt, zum ersten Element zurückkehren (zirkulär)
        return focusables[0]
    } else if (!forward && currentIndex === 0) {
        // Am Anfang angelangt, zum letzten Element gehen (zirkulär)
        return focusables[focusables.length - 1]
    }

    return null
}

/**
 * Findet die nächste Gruppe von Bedienelementen
 */
function findNextElementGroup(currentGroup) {
    let nextGroup = currentGroup.nextElementSibling
    while (nextGroup) {
        if (
            nextGroup.classList.contains("filter-options") ||
            nextGroup.classList.contains("filter-group") ||
            nextGroup.classList.contains("search-container")
        ) {
            return nextGroup
        }
        nextGroup = nextGroup.nextElementSibling
    }

    // Falls keine direkte Gruppe gefunden, den nächsten Hauptcontainer suchen
    const parentGroup = currentGroup.closest(".filter-group")
    if (parentGroup) {
        return findNextElementGroup(parentGroup)
    }

    return null
}

/**
 * Findet die vorherige Gruppe von Bedienelementen
 */
function findPrevElementGroup(currentGroup) {
    let prevGroup = currentGroup.previousElementSibling
    while (prevGroup) {
        if (
            prevGroup.classList.contains("filter-options") ||
            prevGroup.classList.contains("filter-group") ||
            prevGroup.classList.contains("search-container")
        ) {
            return prevGroup
        }
        prevGroup = prevGroup.previousElementSibling
    }

    // Falls keine direkte Gruppe gefunden, den vorherigen Hauptcontainer suchen
    const parentGroup = currentGroup.closest(".filter-group")
    if (parentGroup) {
        return findPrevElementGroup(parentGroup)
    }

    return null
}

// - - - - - - - - - -
// - - - - - - - - - -
// - - - - - - - - - -
function createFilterUI() {
    // Container für die Filter erstellen
    const filterBar = document.querySelector(".filter-bar")

    // Standardfilter für BITV, WCAG, etc.
    const standardFiltersContainer = document.createElement("div")
    standardFiltersContainer.className = "filter-group"
    standardFiltersContainer.innerHTML = `
        <div class="filter-group-title">Standards</div>
        <div class="filter-options standard-filters">
            <button class="standard-filter-btn" data-standard="BITV" aria-pressed="true">BITV</button>
            <button class="standard-filter-btn" data-standard="WCAG" aria-pressed="true">WCAG</button>
            <!--
            <button class="standard-filter-btn" data-standard="EN301549" aria-pressed="true">EN 301 549</button>
            <button class="standard-filter-btn" data-standard="BITinklusiv" aria-pressed="true">BIT inklusiv</button>
            -->
        </div>
    `

    // Berufsgruppen-Filter
    const professionFiltersContainer = document.createElement("div")
    professionFiltersContainer.className = "filter-group"
    professionFiltersContainer.innerHTML = `
        <div class="filter-group-title">Berufsgruppen</div>
        <div class="filter-options profession-filters">
            <button class="profession-filter-btn requirements" data-profession="Requirements" aria-pressed="false">Anforderungen</button>
            <button class="profession-filter-btn design" data-profession="Design" aria-pressed="false">Design</button>
            <button class="profession-filter-btn entwicklung" data-profession="Entwicklung" aria-pressed="false">Entwicklung</button>
            <button class="profession-filter-btn testing" data-profession="Testen" aria-pressed="false">Testen</button>
            <button class="profession-filter-btn release" data-profession="Release" aria-pressed="false">Release</button>
            <button class="profession-filter-btn maintenance" data-profession="Wartung" aria-pressed="false">Wartung</button>
            <button class="profession-filter-btn ux-writer" data-profession="UX Writer" aria-pressed="false">UX Writing</button>
            <button class="profession-filter-btn redaktion" data-profession="Redaktion" aria-pressed="false">Redaktion</button>
            <button class="profession-filter-btn corporate-text" data-profession="Corporate Text" aria-pressed="false">Corporate Text</button>
        </div>
    `

    // Anzeigeoptionen
    const displayOptionsContainer = document.createElement("div")
    displayOptionsContainer.className = "display-options"
    displayOptionsContainer.innerHTML = `
        <div class="filter-group-title">Anzeigeoptionen</div>
        <label class="toggle-option">
            <input type="checkbox" id="display-bitv-id" checked>
            BITV-ID anzeigen
        </label>
        <label class="toggle-option">
            <input type="checkbox" id="display-wcag-id" checked>
            WCAG-ID anzeigen
        </label>
        <label class="toggle-option">
            <input type="checkbox" id="display-profession-markers" checked>
            Berufsgruppen-Indikatoren anzeigen
        </label>
    `

    filterBar.appendChild(standardFiltersContainer)
    filterBar.appendChild(professionFiltersContainer)
    filterBar.appendChild(displayOptionsContainer)

    initFilterHandlers()
}

function initFilterHandlers() {
    // Laden der gespeicherten Einstellungen
    const settings = loadUISettings()

    // Konformitätslevel-Filter
    document.querySelectorAll(".filter-btn[data-level]").forEach((btn) => {
        const level = btn.dataset.level
        const isActive = settings.activeConformanceLevels.includes(level)
        btn.setAttribute("aria-pressed", isActive ? "true" : "false")

        if (isActive) {
            activeFilters.levels.add(level)
        }
    })

    // Standard-Filter
    document.querySelectorAll(".standard-filter-btn").forEach((btn) => {
        const standard = btn.dataset.standard
        const isActive = settings.activeStandards.includes(standard)
        btn.setAttribute("aria-pressed", isActive ? "true" : "false")

        btn.addEventListener("click", () => {
            const isPressed = btn.getAttribute("aria-pressed") === "true"
            btn.setAttribute("aria-pressed", !isPressed ? "true" : "false")

            // Einstellungen aktualisieren
            const settings = loadUISettings()
            const index = settings.activeStandards.indexOf(standard)

            if (index > -1 && isPressed) {
                settings.activeStandards.splice(index, 1)
            } else if (index === -1 && !isPressed) {
                settings.activeStandards.push(standard)
            }

            saveUISettings(settings)
            applyFilters()
        })
    })

    // Berufsgruppen-Filter
    document.querySelectorAll(".profession-filter-btn").forEach((btn) => {
        const profession = btn.dataset.profession
        const isActive = settings.activeProfessions.includes(profession)
        btn.setAttribute("aria-pressed", isActive ? "true" : "false")

        btn.addEventListener("click", () => {
            const isPressed = btn.getAttribute("aria-pressed") === "true"
            btn.setAttribute("aria-pressed", !isPressed ? "true" : "false")

            // Einstellungen aktualisieren
            const settings = loadUISettings()
            const index = settings.activeProfessions.indexOf(profession)

            if (index > -1 && isPressed) {
                settings.activeProfessions.splice(index, 1)
            } else if (index === -1 && !isPressed) {
                settings.activeProfessions.push(profession)
            }

            saveUISettings(settings)
            applyFilters()
        })
    })

    // Anzeigeoptionen
    const bitvIdCheckbox = document.getElementById("display-bitv-id")
    bitvIdCheckbox.checked = settings.displayBitvId
    bitvIdCheckbox.addEventListener("change", () => {
        document.body.classList.toggle("hide-bitv-id", !bitvIdCheckbox.checked)

        const settings = loadUISettings()
        settings.displayBitvId = bitvIdCheckbox.checked
        saveUISettings(settings)
    })

    const wcagIdCheckbox = document.getElementById("display-wcag-id")
    wcagIdCheckbox.checked = settings.displayWcagId
    wcagIdCheckbox.addEventListener("change", () => {
        document.body.classList.toggle("hide-wcag-id", !wcagIdCheckbox.checked)

        const settings = loadUISettings()
        settings.displayWcagId = wcagIdCheckbox.checked
        saveUISettings(settings)
    })

    const professionMarkersCheckbox = document.getElementById(
        "display-profession-markers"
    )
    professionMarkersCheckbox.checked = settings.displayProfessionMarkers
    professionMarkersCheckbox.addEventListener("change", () => {
        document.body.classList.toggle(
            "hide-profession-markers",
            !professionMarkersCheckbox.checked
        )

        const settings = loadUISettings()
        settings.displayProfessionMarkers = professionMarkersCheckbox.checked
        saveUISettings(settings)
    })

    // Anfangszustand anwenden
    document.body.classList.toggle("hide-bitv-id", !settings.displayBitvId)
    document.body.classList.toggle("hide-wcag-id", !settings.displayWcagId)
    document.body.classList.toggle(
        "hide-profession-markers",
        !settings.displayProfessionMarkers
    )

    updateConformanceLevelVisibility()
}

function enhanceFilterControls() {
    const filterBar = document.querySelector(".filter-bar")
    if (!filterBar) return

    // ARIA-Rollen hinzufügen
    filterBar.setAttribute("role", "region")
    filterBar.setAttribute("aria-label", "Filteroptionen")

    // Filtergruppen verbessern
    document.querySelectorAll(".filter-group").forEach((group) => {
        const title = group.querySelector(".filter-group-title")
        if (title) {
            const id = `filter-group-${Math.random().toString(36).substr(2, 9)}`
            title.id = id
            group.setAttribute("aria-labelledby", id)
        }
    })

    // Textbeschreibung für aktive Filter hinzufügen
    const filterCount = document.querySelector(".filter-count")
    if (filterCount) {
        filterCount.setAttribute("aria-live", "polite")
    }
}

/**
 * Initialisiert die Tastaturnavigation für die Filterleiste
 */
function initFilterKeyboardNavigation() {
    const filterBar = document.querySelector(".filter-bar")
    if (!filterBar) return

    const filterButtons = filterBar.querySelectorAll("button")
    const searchInput = document.getElementById("searchInput")

    // Tab-Indizes für Filter-Elemente
    filterButtons.forEach((button) => {
        button.setAttribute("tabindex", "0")
    })

    // Verbesserte Tastatursteuerung für Filterbuttons
    filterButtons.forEach((button) => {
        button.addEventListener("keydown", (e) => {
            switch (e.key) {
                case " ":
                case "Enter":
                    e.preventDefault()
                    button.click() // Simuliere Klick
                    break

                case "ArrowRight":
                    e.preventDefault()
                    const nextButton = findNextFocusableElement(
                        button,
                        true,
                        ".filter-options"
                    )
                    if (nextButton) nextButton.focus()
                    break

                case "ArrowLeft":
                    e.preventDefault()
                    const prevButton = findNextFocusableElement(
                        button,
                        false,
                        ".filter-options"
                    )
                    if (prevButton) prevButton.focus()
                    break

                case "ArrowDown":
                    e.preventDefault()
                    // Zum nächsten Bedienelementgruppe navigieren
                    const nextGroup = findNextElementGroup(
                        button.closest(".filter-options")
                    )
                    if (nextGroup) {
                        const firstElement =
                            nextGroup.querySelector("button, input")
                        if (firstElement) firstElement.focus()
                    } else {
                        // Wenn keine nächste Gruppe, zum ersten Element der Baumstruktur
                        const firstSection =
                            document.querySelector(".section-column")
                        if (firstSection) firstSection.focus()
                    }
                    break

                case "ArrowUp":
                    e.preventDefault()
                    // Zur vorherigen Bedienelementgruppe navigieren
                    const prevGroup = findPrevElementGroup(
                        button.closest(".filter-options")
                    )
                    if (prevGroup) {
                        const lastElement = Array.from(
                            prevGroup.querySelectorAll("button, input")
                        ).pop()
                        if (lastElement) lastElement.focus()
                    } else if (searchInput) {
                        // Wenn keine vorherige Gruppe, zurück zum Suchfeld
                        searchInput.focus()
                    }
                    break

                case "Escape":
                    e.preventDefault()
                    // Fokus zurück zum Hauptinhalt oder zum Suchfeld
                    if (searchInput) {
                        searchInput.focus()
                        searchInput.select() // Text markieren für schnelles Überschreiben
                    }
                    break
            }
        })
    })

    // Suchfeld-Tastaturnavigation
    if (searchInput) {
        searchInput.addEventListener("keydown", (e) => {
            switch (e.key) {
                case "ArrowDown":
                    e.preventDefault()
                    // Zu den Filter-Buttons navigieren
                    const firstButton = filterBar.querySelector("button")
                    if (firstButton) firstButton.focus()
                    break

                case "Enter":
                    // Bei Enter die Suche durchführen und dann zum ersten Ergebnis springen
                    setTimeout(() => {
                        const firstVisibleCard = document.querySelector(
                            ".pruefschritt-card:not(.filtered)"
                        )
                        if (firstVisibleCard) {
                            // Zuerst prüfen, ob es überhaupt sichtbare Karten gibt
                            const visibleCount = document.querySelectorAll(
                                ".pruefschritt-card:not(.filtered)"
                            ).length
                            if (visibleCount > 0) {
                                setTimeout(() => {
                                    firstVisibleCard.focus()
                                    focusCard(
                                        firstVisibleCard,
                                        firstVisibleCard.closest(
                                            ".section-column"
                                        )
                                    )
                                }, 100)
                            }
                        }
                    }, 200)
                    break

                case "Escape":
                    e.preventDefault()
                    // Suchfeld leeren
                    searchInput.value = ""
                    // Suche auslösen
                    const event = new Event("input", { bubbles: true })
                    searchInput.dispatchEvent(event)
                    break

                case "Tab":
                    if (!e.shiftKey) {
                        // Tab navigiert zu Filtern oder zum ersten Element der Baumstruktur
                        if (filterButtons.length === 0) {
                            const firstSection =
                                document.querySelector(".section-column")
                            if (firstSection) {
                                e.preventDefault()
                                firstSection.focus()
                            }
                        }
                    } else {
                        // Shift-Tab verhält sich normal (zurück zum vorherigen Element)
                    }
                    break
            }
        })
    }
}

let activeFilters = {
    search: "",
    levels: new Set(),
}

function initializeFilters() {
    const searchInput = document.getElementById("searchInput")
    const filterButtons = document.querySelectorAll(".filter-btn")
    const filterCount = document.querySelector(".filter-count")

    // Search input handler
    searchInput.addEventListener("input", (e) => {
        activeFilters.search = e.target.value.toLowerCase()
        applyFilters()
    })

    // Level filter buttons
    filterButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
            const level = btn.dataset.level
            if (activeFilters.levels.has(level)) {
                activeFilters.levels.delete(level)
                btn.setAttribute("aria-pressed", "false")
            } else {
                activeFilters.levels.add(level)
                btn.setAttribute("aria-pressed", "true")
            }
            applyFilters()
        })
    })
}

const originalInitializeFilters = initializeFilters
initializeFilters = function () {
    originalInitializeFilters()
    createFilterUI()
}

function applyFilters() {
    const cards = document.querySelectorAll(".pruefschritt-card")
    let visibleCount = 0

    const settings = loadUISettings()

    cards.forEach((card) => {
        const searchMatch = matchesSearch(card)
        const levelMatch = matchesLevel(card)
        const standardMatch = matchesStandard(card, settings.activeStandards)
        const professionMatch = matchesProfession(
            card,
            settings.activeProfessions
        )

        if (searchMatch && levelMatch && standardMatch && professionMatch) {
            card.classList.remove("filtered")
            visibleCount++
        } else {
            card.classList.add("filtered")
        }
    })

    updateFilterCount(visibleCount)
    updateConformanceLevelVisibility()
}

function matchesStandard(card, activeStandards) {
    if (activeStandards.length === 0) return true

    const pruefschritt = card.pruefschrittData

    // Prüfen, ob eine der aktiven Standards dem Prüfschritt entspricht
    return (
        (pruefschritt.bitvId && activeStandards.includes("BITV")) ||
        (pruefschritt.wcagId && activeStandards.includes("WCAG")) ||
        (pruefschritt.en301549Id && activeStandards.includes("EN301549")) ||
        (pruefschritt.bitInklusivId && activeStandards.includes("BITinklusiv"))
    )
}

function matchesSearch(card) {
    if (!activeFilters.search) return true

    const searchText = activeFilters.search.toLowerCase()
    const cardText = card.textContent.toLowerCase()
    const pruefschritt = card.pruefschrittData

    // Suche in verschiedenen Feldern
    return (
        cardText.includes(searchText) ||
        (pruefschritt.wcagId &&
            pruefschritt.wcagId.toLowerCase().includes(searchText)) ||
        (pruefschritt.bitvId &&
            pruefschritt.bitvId.toLowerCase().includes(searchText)) ||
        (pruefschritt.details?.description &&
            pruefschritt.details.description
                .toLowerCase()
                .includes(searchText)) ||
        (pruefschritt.details?.who &&
            Array.isArray(pruefschritt.details.who) &&
            pruefschritt.details.who.some((person) =>
                person.toLowerCase().includes(searchText)
            ))
    )
}

function matchesLevel(card) {
    if (activeFilters.levels.size === 0) return true

    const levelElement = card.querySelector(".A, .AA, .AAA")
    if (!levelElement) return false

    return activeFilters.levels.has(levelElement.textContent)
}

function matchesProfession(card, activeProfessions) {
    if (activeProfessions.length === 0) return true

    const pruefschritt = card.pruefschrittData

    // Wenn keine Berufsgruppen angegeben sind, immer anzeigen
    if (
        !pruefschritt.details?.who ||
        !Array.isArray(pruefschritt.details.who)
    ) {
        return true
    }

    // Mapping von Berufsgruppen zu Kategorien
    const professionGroups = {
        "Requirements": [
            "Produktmanager",
            "Informationsarchitekten",
            "Barrierefreiheitsexperten",
            "Systemarchitekten",
        ],
        "Design": [
            "Designer",
            "UX-Designer",
            "Grafiker",
            "Formulardesigner",
            "Interaktionsdesigner",
            "Mobile-Experten",
        ],
        "Entwicklung": [
            "Entwickler",
            "Frontend-Entwickler",
            "Entwickler von Autorenwerkzeugen",
            "Audio-Ingenieure",
            "Videoingenieure",
            "Netzwerkspezialisten",
            "Performanceexperten",
        ],
        "Testen": ["Tester", "Qualitätssicherung", "Screenreader-Spezialisten"],
        "Release": [
            "Sicherheitsexperten",
            "Interoperabilitätsspezialisten",
            "Dokumentationsverantwortliche",
        ],
        "Wartung": ["Support-Teams", "Technischer Kundendienst"],
        "UX Writer": [
            "Kommunikationsspezialisten",
            "Gebärdensprachexperten",
            "Sprachexperten",
            "Untertitelexperten",
            "Audiodeskriptionsexperten",
        ],
        "Redaktion": [
            "Redakteure",
            "Content-Manager",
            "Videoredakteure",
            "Live-Redakteure",
            "Medienspezialisten",
        ],
        "Corporate Text": [
            "Dokumentenspezialisten",
            "Synchronisationsexperten",
            "Synchronisationsspezialisten",
        ],
    }

    // Prüfen, ob einer der angegebenen Berufe in einer aktiven Berufsgruppe ist
    return pruefschritt.details.who.some((profession) => {
        for (const [category, professions] of Object.entries(
            professionGroups
        )) {
            if (
                activeProfessions.includes(category) &&
                professions.some(
                    (p) => p.toLowerCase() === profession.toLowerCase()
                )
            ) {
                return true
            }
        }
        return false
    })
}

function updateFilterCount(count) {
    const filterCount = document.querySelector(".filter-count")
    const total = document.querySelectorAll(".pruefschritt-card").length
    filterCount.textContent = `${count} von ${total} Kriterien sichtbar`
}

function updateConformanceLevelVisibility() {
    const hasActiveConformanceFilters =
        document.querySelectorAll(
            '.filter-btn[data-level][aria-pressed="true"]'
        ).length > 0

    if (hasActiveConformanceFilters) {
        document.body.classList.remove("conformance-filter-inactive")
    } else {
        document.body.classList.add("conformance-filter-inactive")
    }
}

function addProfessionMarkers(card, pruefschritt) {
    if (
        !pruefschritt.details?.who ||
        !Array.isArray(pruefschritt.details.who) ||
        pruefschritt.details.who.length === 0
    ) {
        return
    }

    const markerContainer = document.createElement("div")
    markerContainer.className = "profession-markers"

    // Erstelle eine Map mit den Kategorien und Unterkategorien
    const professionGroups = {
        "Requirements": [
            "Produktmanager",
            "Informationsarchitekten",
            "Barrierefreiheitsexperten",
            "Systemarchitekten",
        ],
        "Design": [
            "Designer",
            "UX-Designer",
            "Grafiker",
            "Formulardesigner",
            "Interaktionsdesigner",
            "Mobile-Experten",
        ],
        "Entwicklung": [
            "Entwickler",
            "Frontend-Entwickler",
            "Entwickler von Autorenwerkzeugen",
            "Audio-Ingenieure",
            "Videoingenieure",
            "Netzwerkspezialisten",
            "Performanceexperten",
        ],
        "Testen": ["Tester", "Qualitätssicherung", "Screenreader-Spezialisten"],
        "Release": [
            "Sicherheitsexperten",
            "Interoperabilitätsspezialisten",
            "Dokumentationsverantwortliche",
        ],
        "Wartung": ["Support-Teams", "Technischer Kundendienst"],
        "UX Writer": [
            "Kommunikationsspezialisten",
            "Gebärdensprachexperten",
            "Sprachexperten",
            "Untertitelexperten",
            "Audiodeskriptionsexperten",
        ],
        "Redaktion": [
            "Redakteure",
            "Content-Manager",
            "Videoredakteure",
            "Live-Redakteure",
            "Medienspezialisten",
        ],
        "Corporate Text": [
            "Dokumentenspezialisten",
            "Synchronisationsexperten",
            "Synchronisationsspezialisten",
        ],
    }

    // Finde alle zutreffenden Kategorien für die Berufsgruppen im Prüfschritt
    const categories = new Set()

    pruefschritt.details.who.forEach((profession) => {
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

    // Füge für jede Kategorie einen Marker hinzu
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

function loadAndRenderData() {
    fetch("./criterias.json")
        .then((response) => response.json())
        .then((data) => {
            renderTree(data)
            initKeyboardNavigation()
            initializeFilters() // Initialize filters after rendering
        })
        .catch((error) => console.error(error))
}

/**
 * Initialize the tooltips and descriptions
 */
async function initDescriptions() {
    await loadDescriptions()
}

/**
 * Loads the descriptions.json file and caches it
 */
async function loadDescriptions() {
    if (window.descriptionsCache) {
        return window.descriptionsCache
    }

    try {
        const response = await fetch("./data/descriptions.json")
        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`)
        }

        const data = await response.json()
        window.descriptionsCache = data
        return data
    } catch (error) {
        console.error("Error loading descriptions:", error)
        window.descriptionsCache = {}
        return {}
    }
}

/**
 * Creates a tooltip with content from descriptions.json
 */
function createTooltip(pruefschritt) {
    // Try to get description from descriptions cache first
    let description = window.descriptionsCache
        ? window.descriptionsCache[pruefschritt.id]
        : null

    // Fallback to pruefschritt details if available
    if (
        !description &&
        pruefschritt.details &&
        pruefschritt.details.description
    ) {
        description = pruefschritt.details.description
    }

    // Default text if no description available
    if (!description) {
        description = "Keine Beschreibung verfügbar"
    }

    // Create tooltip element
    const tooltip = document.createElement("div")
    tooltip.className = "tooltip"
    tooltip.innerHTML = description

    return tooltip
}

function showTooltip(card) {
    if (!card.tooltipElement) return

    // Füge Tooltip zum DOM hinzu
    card.appendChild(card.tooltipElement)

    // Mache den Tooltip sichtbar
    setTimeout(() => {
        card.tooltipElement.classList.add("visible")
    }, 10)
}

function hideTooltip(card) {
    if (!card.tooltipElement) return

    // Entferne visible-Klasse (für Fade-Out-Animation)
    card.tooltipElement.classList.remove("visible")

    // Entferne Tooltip vom DOM nach Abschluss der Animation
    setTimeout(() => {
        if (card.tooltipElement.parentNode === card) {
            card.removeChild(card.tooltipElement)
        }
    }, 300)
}

function handleMouseEnter(element, tooltip) {
    if (!tooltip) return
    element.appendChild(tooltip)
    setTimeout(() => {
        tooltip.classList.add("visible")
    }, 10)
}

function handleMouseLeave(element, tooltip) {
    if (!tooltip) return
    tooltip.classList.remove("visible")
    setTimeout(() => {
        if (tooltip.parentNode === element) {
            element.removeChild(tooltip)
        }
    }, 300)
}

// ++++++++++++++++
// DUMMY CODE
// ++++++++++++++++
let collections = {}

function updateRenderTree() {}

function setupCollectionsUI() {}

function initCollections() {}

function deselectCollection() {}
// ++++++++++++++++
function renderTree(bitvData) {
    const container = document.querySelector(".tree-container")

    bitvData.sections.forEach((section, index) => {
        const sectionObj = section["undefined"]
        if (!sectionObj) return

        const column = document.createElement("div")
        column.className = "section-column"

        // Erstelle die übergeordnete Kategorie-Karte (schwarz)
        const categoryCard = document.createElement("div")
        categoryCard.className = "card category-card"
        categoryCard.textContent = " "

        column.appendChild(categoryCard)

        // Create section card
        const sectionCard = document.createElement("div")
        sectionCard.className = `card section-card section-${index + 1}`
        sectionCard.textContent = sectionObj.title

        // Create and store tooltip
        if (sectionObj.details?.description) {
            const tooltip = createTooltip(sectionObj.details.description)
            sectionCard.tooltipElement = tooltip

            // Add mouse events for section card
            sectionCard.addEventListener("mouseenter", () =>
                handleMouseEnter(sectionCard, tooltip)
            )
            sectionCard.addEventListener("mouseleave", () =>
                handleMouseLeave(sectionCard, tooltip)
            )
        }

        column.appendChild(sectionCard)

        sectionObj.pruefschritte.forEach((pruefschritt) => {
            const pruefschrittCard = document.createElement("div")
            pruefschrittCard.className = `card pruefschritt-card section-${
                index + 1
            }`

            // Store pruefschritt data for modal
            pruefschrittCard.pruefschrittData = pruefschritt
            let hasInformation = false
            if (pruefschritt.details.description === "") {
                //console.log(pruefschritt.id, pruefschritt.title)
            } else {
                hasInformation = true
            }

            const wcagId = pruefschritt.wcagId
                ? `<div class="wcag-id">WCAG ${pruefschritt.wcagId}</div>`
                : ""

            const bitvId = pruefschritt.bitvId
                ? `<div class="bitv-id">BITV ${pruefschritt.bitvId}</div>`
                : ""

            const conformanceLevel = pruefschritt.conformanceLevel
                ? `<div class="${pruefschritt.conformanceLevel}">${pruefschritt.conformanceLevel}</div>`
                : ""

            if (bitvId !== "") {
                pruefschrittCard.classList.add("is-bitv")
            }

            if (hasInformation === true) {
                pruefschrittCard.classList.add("has-information")
            }

            pruefschrittCard.innerHTML = `${conformanceLevel}
                ${wcagId}
                ${bitvId}
                ${pruefschritt.title}`

            // Füge Berufsgruppen-Marker hinzu
            addProfessionMarkers(pruefschrittCard, pruefschritt)

            // Create and store tooltip
            if (pruefschritt.details?.description) {
                const tooltip = createTooltip(pruefschritt.details.description)
                pruefschrittCard.tooltipElement = tooltip

                // Add mouse events for pruefschritt card
                pruefschrittCard.addEventListener("mouseenter", () =>
                    handleMouseEnter(pruefschrittCard, tooltip)
                )
                pruefschrittCard.addEventListener("mouseleave", () =>
                    handleMouseLeave(pruefschrittCard, tooltip)
                )
                pruefschrittCard.addEventListener("click", () => {
                    if (pruefschrittCard.pruefschrittData) {
                        showDetails(pruefschrittCard.pruefschrittData)
                    }
                })
            }

            column.appendChild(pruefschrittCard)
        })

        container.appendChild(column)
    })
}

/**
 * Loads Markdown content for a prüfschritt
 * Tries multiple possible filenames based on different ID formats
 */
async function loadMarkdownContent(id) {
    // Array of possible file paths to try
    const possiblePaths = [
        `./docs/${id}.md`, // New ID format (c-001-bitv-9-1.1.1a.md)
        `./docs/${id.replace(/^c-\d+-/, "")}.md`, // Original ID without c-prefix (bitv-9-1.1.1a.md)
        `./docs/${extractOriginalId(id)}.md`, // Legacy ID format (9.1.1.1a.md)
    ]

    // Try each path until successful
    for (const path of possiblePaths) {
        try {
            const response = await fetch(path)
            if (response.ok) {
                return await response.text()
            }
        } catch (error) {
            console.warn(`Could not load markdown from ${path}`)
        }
    }

    // If all attempts failed, return null
    console.warn(`Could not find any markdown file for ID: ${id}`)
    return null
}

/**
 * Extracts the original ID from a new format ID
 * Example: c-001-bitv-9-1.1.1a -> 9.1.1.1a
 */
function extractOriginalId(id) {
    const match = id.match(/[a-z]+-(\d+[\.\d]*[a-z]?)/)
    return match ? match[1] : id
}

/**
 * Renders criterion details when Markdown is not available
 */
function renderDetailsFromCriterion(criterion, container) {
    let html = '<div class="fallback-content">'

    // Add level badge if available
    if (criterion.conformanceLevel) {
        html += `<div class="level-badge ${criterion.conformanceLevel}">${criterion.conformanceLevel}</div>`
    }

    // Add description
    if (criterion.details && criterion.details.description) {
        html += `<div class="description">${criterion.details.description}</div>`
    } else {
        html += "<p>Keine detaillierte Beschreibung verfügbar.</p>"
    }

    // Add IDs section
    html += '<div class="ids-section">'
    if (criterion.bitvId)
        html += `<p><strong>BITV ID:</strong> ${criterion.bitvId}</p>`
    if (criterion.wcagId)
        html += `<p><strong>WCAG ID:</strong> ${criterion.wcagId}</p>`
    if (criterion.en301549Id)
        html += `<p><strong>EN301549 ID:</strong> ${criterion.en301549Id}</p>`
    if (criterion.bitInklusivId)
        html += `<p><strong>BITinklusiv ID:</strong> ${criterion.bitInklusivId}</p>`
    html += "</div>"

    // Add who section (professions)
    if (
        criterion.details &&
        Array.isArray(criterion.details.who) &&
        criterion.details.who.length > 0
    ) {
        html += '<div class="who-section">'
        html += "<h3>Beteiligte Berufsgruppen</h3>"
        html += "<ul>"
        criterion.details.who.forEach((person) => {
            html += `<li>${person}</li>`
        })
        html += "</ul></div>"
    }

    html += "</div>"
    container.innerHTML = html
}

function showDetails(pruefschritt) {
    if (!pruefschritt || !pruefschritt.id) {
        console.error("Invalid pruefschritt data")
        return
    }

    const modalTitle = document.getElementById("modalTitle")
    const modalContent = document.getElementById("modalContent")

    // Set the title
    modalTitle.textContent = pruefschritt.title || "Prüfschritt Details"

    // Show loading indicator
    modalContent.innerHTML = '<div class="loading">Lade Inhalt...</div>'
    document.getElementById("sectionModal").style.display = "block"

    // Try to load the Markdown file based on ID
    loadMarkdownContent(pruefschritt.id)
        .then((content) => {
            if (content) {
                modalContent.innerHTML = marked.parse(content)
            } else {
                // Fallback to details from pruefschritt object
                renderDetailsFromCriterion(pruefschritt, modalContent)
            }
        })
        .catch((error) => {
            console.error("Error loading markdown:", error)
            renderDetailsFromCriterion(pruefschritt, modalContent)
        })
}

document.querySelector(".close-button").addEventListener("click", () => {
    document.getElementById("sectionModal").style.display = "none"
})

document.addEventListener("click", (event) => {
    const modal = document.getElementById("sectionModal")
    if (event.target === modal) {
        modal.style.display = "none"
    }
})

document.addEventListener("click", (event) => {
    const card = event.target.closest(".pruefschritt-card")
    if (card && card.pruefschrittData) {
        showDetails(card.pruefschrittData)
    }
})

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        document.getElementById("sectionModal").style.display = "none"
    }
})

// - - - - - - - - - -
// - - - - - - - - - -
// - - - - - - - - - -

// Datenstruktur für die Sammlungen

function createFloatingCollectionsPanel() {
    // Container für bisherigen Collections-Inhalt finden und leeren
    const collectionsAsideElement = document.querySelector("aside#collections")
    collectionsAsideElement.innerHTML = ""

    // Toggle-Button erstellen
    const toggleButton = document.createElement("button")
    toggleButton.className = "collection-toggle-button"
    toggleButton.setAttribute("aria-label", "Sammlungen öffnen")
    toggleButton.innerHTML = '<span class="material-icons">bookmarks</span>'
    document.body.appendChild(toggleButton)

    // Panel erstellen
    const panel = document.createElement("div")
    panel.className = "collections-panel"

    // Panel-Header mit Drag-Handle
    const panelHeader = document.createElement("div")
    panelHeader.className = "collections-panel-header"
    panelHeader.innerHTML = `
        <div class="drag-handle"><span class="material-icons">drag_indicator</span></div>
        <h3>Prüfschritte sammeln</h3>
        <button class="close-button" aria-label="Schließen">
            <span class="material-icons">close</span>
        </button>
    `

    // Panel-Content (wird durch bestehende Logik gefüllt)
    const panelContent = document.createElement("div")
    panelContent.className = "collections-panel-content"

    // Alles zusammenfügen
    panel.appendChild(panelHeader)
    panel.appendChild(panelContent)
    document.body.appendChild(panel)

    // Event-Handler für Toggle-Button
    toggleButton.addEventListener("click", () => {
        panel.classList.toggle("visible")
    })

    // Event-Handler für Close-Button
    panelHeader.querySelector(".close-button").addEventListener("click", () => {
        panel.classList.remove("visible")
    })

    // Panel-Position aus Einstellungen laden
    const settings = loadUISettings()
    if (settings.collectionsPanelPosition) {
        panel.style.right = settings.collectionsPanelPosition.right
        panel.style.bottom = settings.collectionsPanelPosition.bottom
    }

    // Drag-Funktionalität
    makeDraggable(panel, panelHeader.querySelector(".drag-handle"))

    // Stelle den Container für die Collections-Funktionalität bereit
    return panelContent
}

function makeDraggable(element, handle) {
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
        const settings = loadUISettings()
        settings.collectionsPanelPosition = {
            right: element.style.right,
            bottom: element.style.bottom,
        }
        saveUISettings(settings)
    }
}

const originalSetupCollectionsUI = setupCollectionsUI
setupCollectionsUI = function () {
    // Container für Collections erstellen
    const collectionsContainer = createFloatingCollectionsPanel()

    // Formular für neue Sammlungen erstellen
    const newCollectionContainer = document.createElement("div")
    newCollectionContainer.className = "new-collection-container"

    const collectionForm = document.createElement("form")
    collectionForm.className = "collection-form"
    collectionForm.innerHTML = `
        <input type="text" id="collection-name" placeholder="Neues Thema eingeben..." aria-label="Name für neue Sammlung">
        <button type="submit" id="create-collection" aria-label="Sammlung erstellen">
            <span class="material-icons">add_circle</span>
        </button>
    `

    // Container für die Liste der Sammlungen
    const collectionsListContainer = document.createElement("div")
    collectionsListContainer.className = "collections-list-container"
    collectionsListContainer.innerHTML = `
        <h3>Meine Sammlungen</h3>
        <ul id="collections-list" class="collections-list"></ul>
    `

    // Container für die aktive Sammlung
    const activeCollectionContainer = document.createElement("div")
    activeCollectionContainer.className = "active-collection-container"
    activeCollectionContainer.innerHTML = `
        <div class="active-collection-header">
            <h3 id="active-collection-title">Keine Sammlung ausgewählt</h3>
            <button id="deselect-collection" class="deselect-button" aria-label="Auswahl aufheben" style="display: none;">
                <span class="material-icons">close</span>
            </button>
        </div>
        <div id="active-collection-items" class="active-collection-items"></div>
    `

    // Alles zusammenfügen
    newCollectionContainer.appendChild(collectionForm)
    collectionsContainer.appendChild(newCollectionContainer)
    collectionsContainer.appendChild(collectionsListContainer)
    collectionsContainer.appendChild(activeCollectionContainer)

    // Event-Listener für das Formular
    collectionForm.addEventListener("submit", (e) => {
        e.preventDefault()
        const nameInput = document.getElementById("collection-name")
        const collectionName = nameInput.value.trim()

        if (collectionName) {
            createNewCollection(collectionName)
            nameInput.value = ""
        }
    })

    // Event-Listener für den Deselect-Button
    document
        .getElementById("deselect-collection")
        .addEventListener("click", deselectCollection)
}

// Falls die Seite bereits geladen ist, initialisieren
if (
    document.readyState === "complete" ||
    document.readyState === "interactive"
) {
    setTimeout(initCollections, 500)
}

// - - - - - - - - - -
// - - - - - - - - - -
// - - - - - - - - - -

// ==============================
// Themen Manager Integration
// ==============================

// Erweiterte Datenstruktur für die Sammlungen
let collectionsData = {
    // Format: 'collectionId': {
    //   id: String,
    //   title: String,
    //   author: String,
    //   created: String (Datum),
    //   lastModified: String (Datum),
    //   data: Array<PruefschrittData>
    // }
}

// Sortier- und Filterzustand
let themesSortState = {
    field: "created", // Standard: Erstelldatum
    ascending: false, // Neueste zuerst (absteigend)
}
let themesSearchFilter = ""

// Erzeugen des erweiterten Collection-Panels
function createEnhancedCollectionsPanel() {
    // Bisherigen Collections-Container finden und leeren
    const collectionsAsideElement = document.querySelector("aside#collections")
    collectionsAsideElement.innerHTML = ""

    // Toggle-Button erstellen (bleibt größtenteils unverändert)
    const toggleButton = document.createElement("button")
    toggleButton.className = "collection-toggle-button"
    toggleButton.setAttribute("aria-label", "Themen Manager öffnen")
    toggleButton.innerHTML = '<span class="material-icons">bookmarks</span>'
    document.body.appendChild(toggleButton)

    // Panel erstellen (mit mehr Platz für die erweiterten Funktionen)
    const panel = document.createElement("div")
    panel.className = "collections-panel"
    panel.style.width = "450px" // Breiter für mehr Inhalte

    // Panel-Header mit Drag-Handle und Thementitel
    const panelHeader = document.createElement("div")
    panelHeader.className = "collections-panel-header"
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

    // Haupt-Inhalt des Panels
    const panelContent = document.createElement("div")
    panelContent.className = "collections-panel-content"

    // ========== Neues Thema erstellen ==========
    const newThemeSection = document.createElement("div")
    newThemeSection.className = "panel-section new-theme-section"
    newThemeSection.innerHTML = `
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

    // ========== Thema importieren ==========
    const importThemeSection = document.createElement("div")
    importThemeSection.className = "panel-section import-theme-section"
    importThemeSection.innerHTML = `
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

    // ========== Themen durchsuchen und sortieren ==========
    const searchThemeSection = document.createElement("div")
    searchThemeSection.className = "panel-section search-theme-section"
    searchThemeSection.innerHTML = `
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
                        <option value="created">Erstelldatum</option>
                        <option value="title">Name</option>
                        <option value="author">Autor</option>
                        <option value="lastModified">Änderungsdatum</option>
                    </select>
                </div>
            </div>
        </div>
    `

    // ========== Themenliste ==========
    const themesListSection = document.createElement("div")
    themesListSection.className = "panel-section themes-list-section"
    themesListSection.innerHTML = `
        <div class="panel-section-header">
            <h4>Meine Themen</h4>
        </div>
        <div class="panel-section-content themes-container" id="themesContainer">
            <!-- Hier werden die Themen dynamisch eingefügt -->
        </div>
    `

    // Alles zusammenfügen
    panelContent.appendChild(newThemeSection)
    panelContent.appendChild(importThemeSection)
    panelContent.appendChild(searchThemeSection)
    panelContent.appendChild(themesListSection)

    panel.appendChild(panelHeader)
    panel.appendChild(panelContent)

    document.body.appendChild(panel)

    // Event-Handler für Toggle-Button
    toggleButton.addEventListener("click", () => {
        panel.classList.toggle("visible")
        if (panel.classList.contains("visible")) {
            // Bei Öffnen die Themenliste aktualisieren
            renderThemesList()
        }
    })

    // Event-Handler für Close-Button
    panelHeader.querySelector(".close-button").addEventListener("click", () => {
        panel.classList.remove("visible")
    })

    // Event-Handler für Dark/Light Mode
    const themePanelToggle = document.getElementById("themePanelToggle")
    themePanelToggle.addEventListener("click", togglePanelTheme)

    // Event-Handler für die Abschnitts-Toggles
    document.querySelectorAll(".toggle-section-button").forEach((button) => {
        button.addEventListener("click", () => {
            const isExpanded = button.getAttribute("aria-expanded") === "true"
            button.setAttribute("aria-expanded", !isExpanded)
            button.innerHTML = `<span class="material-icons">${
                !isExpanded ? "expand_less" : "expand_more"
            }</span>`

            const content = button
                .closest(".panel-section")
                .querySelector(".panel-section-content")
            if (content) {
                content.style.display = !isExpanded ? "block" : "none"
            }
        })
    })

    // Event-Handler für Themen speichern
    document
        .getElementById("saveTheme")
        .addEventListener("click", createNewTheme)
    document
        .getElementById("pasteTheme")
        .addEventListener("click", pasteThemeFromClipboard)
    document
        .getElementById("importTheme")
        .addEventListener("click", importThemeFromUrl)

    // Event-Handler für Suche und Sortierung
    document
        .getElementById("themesSearchFilter")
        .addEventListener("input", applyThemesSearchFilter)
    document
        .getElementById("clearThemesSearch")
        .addEventListener("click", clearThemesSearch)
    document
        .getElementById("themesSortOption")
        .addEventListener("change", function () {
            themesSortState.field = this.value
            renderThemesList()
        })

    // Panel-Position aus Einstellungen laden
    const settings = loadUISettings()
    if (settings.collectionsPanelPosition) {
        panel.style.right = settings.collectionsPanelPosition.right
        panel.style.bottom = settings.collectionsPanelPosition.bottom
    }

    // Drag-Funktionalität
    makeDraggable(panel, panelHeader.querySelector(".drag-handle"))

    // CSS für den Themen Manager hinzufügen
    addThemeManagerStyles()

    return panel
}

// Styling für den Themen Manager
function addThemeManagerStyles() {
    const styleElement = document.createElement("style")

    // Bestehender CSS-Code...
    styleElement.textContent = `
        /* Grundlegende Panel-Styles */
        .collections-panel {
            width: 450px;
            max-width: 90vw;
            max-height: 80vh;
            background-color: #f5f7fa;
            color: #333;
            transition: background-color 0.3s ease, color 0.3s ease;
            overflow-y: auto;
        }
        
        /* Weitere bestehende CSS-Regeln... */
        
        /* Neue CSS-Regeln für aktive Themen */
        .theme-item.theme-collecting-active {
            border: 2px solid #4a90e2;
            box-shadow: 0 0 10px rgba(74, 144, 226, 0.3);
        }
        
        .theme-item.theme-collecting-active .theme-header {
            background-color: rgba(74, 144, 226, 0.15);
        }
        
        .collections-panel[data-theme="dark"] .theme-item.theme-collecting-active {
            border-color: #64b5f6;
            box-shadow: 0 0 10px rgba(100, 181, 246, 0.3);
        }
        
        .collections-panel[data-theme="dark"] .theme-item.theme-collecting-active .theme-header {
            background-color: rgba(100, 181, 246, 0.25);
        }
        
        /* CSS für aktive Thema-Add-Buttons */
        .add-to-theme-button.active-theme-add {
            background: rgba(74, 144, 226, 0.9);
            opacity: 0.8;
        }
        
        .pruefschritt-card:hover .add-to-theme-button.active-theme-add {
            opacity: 1;
        }
        
        .add-to-theme-button.active-theme-add:hover {
            background: rgba(74, 144, 226, 1);
        }
    `

    document.head.appendChild(styleElement)
}

// Dark/Light Mode für das Panel
function togglePanelTheme() {
    const panel = document.querySelector(".collections-panel")
    const button = document.getElementById("themePanelToggle")

    if (!panel) return

    const currentTheme = panel.getAttribute("data-theme") || "light"
    const newTheme = currentTheme === "light" ? "dark" : "light"

    panel.setAttribute("data-theme", newTheme)
    button.innerHTML = `<span class="material-icons">${
        newTheme === "light" ? "dark_mode" : "light_mode"
    }</span>`

    // Theme in Einstellungen speichern
    const settings = loadUISettings()
    settings.panelTheme = newTheme
    saveUISettings(settings)
}

// Funktionen für den Themen Manager
function migrateCollectionData() {
    // Bisherige Collections in das neue Format migrieren
    const oldCollections = collections || {}
    const dateTime = getCurrentDateTime()

    if (Object.keys(oldCollections).length > 0) {
        collectionsData = {}

        Object.entries(oldCollections).forEach(([name, pruefschrittIds]) => {
            const id = generateId()
            collectionsData[id] = {
                id,
                title: name,
                author: "Migriert",
                description: "",
                data: pruefschrittIds.map((item) => ({
                    id: item.id,
                    title: item.title,
                    section: item.sectionIndex,
                    description: item.description,
                    conformanceLevel: item.conformanceLevel,
                })),
                created: dateTime,
                lastModified: dateTime,
            }
        })

        // Speichern im neuen Format
        saveCollectionsData()

        // Altes Format nicht mehr nutzen (kann später entfernt werden)
        collections = {}
        localStorage.removeItem("bitvCollections")
    }
}

// Speichern und Laden
function saveCollectionsData() {
    localStorage.setItem(
        "themeManagerCollections",
        JSON.stringify(collectionsData)
    )
}

function loadCollectionsData() {
    const savedData = localStorage.getItem("themeManagerCollections")
    if (savedData) {
        collectionsData = JSON.parse(savedData)
    } else {
        // Wenn keine Daten vorhanden, altes Format migrieren
        migrateCollectionData()
    }
}

// Funktion zum Erstellen eines neuen Themas
function createNewTheme() {
    const title = document.getElementById("themeTitle").value.trim()
    const author = document.getElementById("themeAuthor").value.trim()
    const description = document.getElementById("themeDescription").value.trim()

    if (!title) {
        showNotification("Bitte geben Sie einen Titel ein.")
        return
    }

    const id = generateId()
    const dateTime = getCurrentDateTime()

    collectionsData[id] = {
        id,
        title,
        author,
        description,
        data: [],
        created: dateTime,
        lastModified: dateTime,
    }

    saveCollectionsData()

    // Eingabefelder zurücksetzen
    document.getElementById("themeTitle").value = ""
    document.getElementById("themeAuthor").value = ""
    document.getElementById("themeDescription").value = ""

    // Interface-Feedback
    showNotification("Thema erfolgreich erstellt!")

    // Abschnitt schließen
    const button = document.querySelector(
        ".new-theme-section .toggle-section-button"
    )
    button.click()

    // Themenliste aktualisieren
    renderThemesList()
}

// Aus Zwischenablage einfügen
async function pasteThemeFromClipboard() {
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

                showNotification("Daten aus Zwischenablage eingefügt")
            } else {
                showNotification(
                    "Ungültiges Themenformat in der Zwischenablage"
                )
            }
        } catch (parseError) {
            // Wenn kein valides JSON, füge Text als Beschreibung ein
            document.getElementById("themeDescription").value = clipboardText
            showNotification(
                "Text aus Zwischenablage als Beschreibung eingefügt"
            )
        }
    } catch (error) {
        console.error("Fehler beim Lesen der Zwischenablage:", error)
        showNotification("Fehler beim Zugriff auf die Zwischenablage")
    }
}

// Thema aus URL importieren
async function importThemeFromUrl() {
    const url = document.getElementById("themeLink").value.trim()

    if (!url) {
        showNotification("Bitte geben Sie eine URL ein.")
        return
    }

    try {
        const response = await fetch(url)
        if (!response.ok) {
            throw new Error("Fehler beim Laden der JSON-Datei")
        }

        const themeData = await response.json()

        // Grundlegende Validierung
        if (!themeData.title) {
            throw new Error("Ungültiges Themenformat: Titel fehlt")
        }

        const id = generateId()
        const dateTime = getCurrentDateTime()

        collectionsData[id] = {
            id,
            title: themeData.title,
            author: themeData.author || "Importiert",
            description: themeData.description || "",
            data: Array.isArray(themeData.data) ? themeData.data : [],
            created: dateTime,
            lastModified: dateTime,
        }

        saveCollectionsData()
        document.getElementById("themeLink").value = ""

        // Interface-Feedback
        showNotification("Thema erfolgreich importiert!")

        // Abschnitt schließen
        const button = document.querySelector(
            ".import-theme-section .toggle-section-button"
        )
        button.click()

        // Themenliste aktualisieren
        renderThemesList()
    } catch (error) {
        console.error("Import error:", error)
        showNotification(`Fehler beim Importieren des Themas: ${error.message}`)
    }
}

// Benachrichtigungsfunktion für Themenverwaltung
function showNotification(message) {
    const notificationElement =
        document.getElementById("notification") || createNotificationElement()
    notificationElement.textContent = message
    notificationElement.classList.add("show")
    setTimeout(() => {
        notificationElement.classList.remove("show")
    }, 3000)
}

// Benachrichtigungselement erstellen, falls nicht vorhanden
function createNotificationElement() {
    const notificationElement = document.createElement("div")
    notificationElement.id = "notification"
    notificationElement.className = "notification"
    document.body.appendChild(notificationElement)
    return notificationElement
}

// Suchfilter anwenden
function applyThemesSearchFilter() {
    themesSearchFilter = document
        .getElementById("themesSearchFilter")
        .value.trim()
    document.getElementById("clearThemesSearch").style.display =
        themesSearchFilter ? "flex" : "none"
    renderThemesList()
}

// Suchfilter zurücksetzen
function clearThemesSearch() {
    document.getElementById("themesSearchFilter").value = ""
    themesSearchFilter = ""
    document.getElementById("clearThemesSearch").style.display = "none"
    renderThemesList()
}

// Datum formatieren
function formatDateTime(dateTime) {
    if (!dateTime) return ""

    try {
        // Für deutsches Format DD.MM.YYYY HH:MM:SS
        const parts = dateTime.split(/[\s.:]/)
        if (parts.length >= 6) {
            const date = `${parts[0]}.${parts[1]}.${parts[2]}`
            const time = `${parts[3]}:${parts[4]}`
            return `${date} ${time}`
        }
    } catch (e) {}

    return dateTime
}

// Text mit hervorgehobenen Suchwörtern
function highlightThemesSearchTerm(text, searchTerm) {
    if (!searchTerm || !text) return text

    const regex = new RegExp(
        `(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`,
        "gi"
    )
    return text.replace(regex, '<span class="highlight">$1</span>')
}

// Prüfschritte filtern und sortieren
function getFilteredAndSortedThemes() {
    let themes = Object.values(collectionsData)

    // Filtern, wenn ein Suchbegriff vorhanden ist
    if (themesSearchFilter) {
        const searchTerm = themesSearchFilter.toLowerCase()
        themes = themes.filter((theme) => {
            const titleMatch =
                theme.title && theme.title.toLowerCase().includes(searchTerm)
            const authorMatch =
                theme.author && theme.author.toLowerCase().includes(searchTerm)
            const descriptionMatch =
                theme.description &&
                theme.description.toLowerCase().includes(searchTerm)
            const dataMatch =
                theme.data &&
                theme.data.some(
                    (item) =>
                        (item.title &&
                            item.title.toLowerCase().includes(searchTerm)) ||
                        (item.description &&
                            item.description.toLowerCase().includes(searchTerm))
                )

            return titleMatch || authorMatch || descriptionMatch || dataMatch
        })
    }

    // Sortieren nach ausgewähltem Feld
    themes.sort((a, b) => {
        let valueA, valueB

        // Extrahieren der zu vergleichenden Werte je nach Sortierfeld
        switch (themesSortState.field) {
            case "title":
                valueA = (a.title || "").toLowerCase()
                valueB = (b.title || "").toLowerCase()
                break
            case "author":
                valueA = (a.author || "").toLowerCase()
                valueB = (b.author || "").toLowerCase()
                break
            case "created":
            case "lastModified":
                // Datumsvergleich - deutsches Format DD.MM.YYYY HH:MM:SS zu Date-Objekt
                try {
                    const partsA = a[themesSortState.field]
                        ? a[themesSortState.field].split(/[\s.:]/)
                        : null
                    const partsB = b[themesSortState.field]
                        ? b[themesSortState.field].split(/[\s.:]/)
                        : null

                    if (partsA && partsA.length >= 6) {
                        valueA = new Date(
                            partsA[2],
                            partsA[1] - 1,
                            partsA[0],
                            partsA[3],
                            partsA[4],
                            partsA[5]
                        )
                    } else {
                        valueA = new Date(0)
                    }

                    if (partsB && partsB.length >= 6) {
                        valueB = new Date(
                            partsB[2],
                            partsB[1] - 1,
                            partsB[0],
                            partsB[3],
                            partsB[4],
                            partsB[5]
                        )
                    } else {
                        valueB = new Date(0)
                    }
                } catch (e) {
                    valueA = a[themesSortState.field] || ""
                    valueB = b[themesSortState.field] || ""
                }
                break
            default:
                valueA = a[themesSortState.field] || ""
                valueB = b[themesSortState.field] || ""
        }

        // Vergleich durchführen, je nach Sortierrichtung
        let comparison = 0
        if (valueA < valueB) {
            comparison = -1
        } else if (valueA > valueB) {
            comparison = 1
        }

        return themesSortState.ascending ? comparison : -comparison
    })

    return themes
}

// Themenliste anzeigen
function renderThemesList() {
    const themesContainer = document.getElementById("themesContainer")
    if (!themesContainer) return

    const themes = getFilteredAndSortedThemes()

    if (themes.length === 0) {
        themesContainer.innerHTML = themesSearchFilter
            ? `<div class="empty-themes-message">Keine Themen gefunden, die "${themesSearchFilter}" enthalten.</div>`
            : '<div class="empty-themes-message">Keine Themen vorhanden. Erstellen Sie ein neues Thema.</div>'
        return
    }

    themesContainer.innerHTML = ""

    themes.forEach((theme) => {
        const themeElement = document.createElement("div")
        themeElement.className = "theme-item"
        themeElement.dataset.id = theme.id

        // Wenn es das aktive Thema ist, markieren
        if (document.body.dataset.activeThemeId === theme.id) {
            themeElement.classList.add("theme-collecting-active")
        }

        // HTML für Thema erstellen
        // ... Bisheriger Code zur Erstellung des Thema-HTML ...

        // HTML mit möglicherweise hervorgehobenen Suchwörtern
        let titleHtml = theme.title
        let authorHtml = theme.author || ""
        let descriptionHtml = theme.description || ""

        if (themesSearchFilter) {
            titleHtml = highlightThemesSearchTerm(titleHtml, themesSearchFilter)
            authorHtml = highlightThemesSearchTerm(
                authorHtml,
                themesSearchFilter
            )
            descriptionHtml = highlightThemesSearchTerm(
                descriptionHtml,
                themesSearchFilter
            )
        }

        // Metainformationen formatieren
        const dateCreated = theme.created
            ? `Erstellt: ${formatDateTime(theme.created)}`
            : ""
        const dateModified = theme.lastModified
            ? `Geändert: ${formatDateTime(theme.lastModified)}`
            : ""
        const metaInfo = [
            authorHtml ? `Autor: ${authorHtml}` : "",
            dateCreated,
            dateModified,
        ]
            .filter(Boolean)
            .join(" | ")

        // HTML für Thema erstellen
        themeElement.innerHTML = `
            <div class="theme-header">
                <div class="theme-title-section">
                    <span class="material-icons accordion-icon">expand_more</span>
                    <h5 class="theme-title">${titleHtml}</h5>
                </div>
                <div class="theme-actions">
                    <button class="theme-action-icon copy-theme" title="In Zwischenablage kopieren">
                        <span class="material-icons">content_copy</span>
                    </button>
                    <button class="theme-action-icon edit-theme" title="Bearbeiten">
                        <span class="material-icons">edit</span>
                    </button>
                    <button class="theme-action-icon delete delete-theme" title="Löschen">
                        <span class="material-icons">delete</span>
                    </button>
                </div>
            </div>
            ${metaInfo ? `<div class="theme-meta">${metaInfo}</div>` : ""}
            <div class="theme-content">
                ${
                    descriptionHtml
                        ? `<p class="theme-description">${descriptionHtml}</p>`
                        : ""
                }
                <div class="theme-pruefschritte">
                    ${renderPruefschritteList(theme.data)}
                </div>
            </div>
        `

        // Event-Listener für Themenaktionen hinzufügen
        themesContainer.appendChild(themeElement)

        // Akkordeon-Funktion für Thema + NEUE FUNKTIONALITÄT: Thema als aktiv markieren
        const header = themeElement.querySelector(".theme-header")
        header.addEventListener("click", function (e) {
            // Ignoriere Klicks auf Aktionsbuttons
            if (e.target.closest(".theme-action-icon")) return

            // Toggle für Akkordeon-Funktionalität
            themeElement.classList.toggle("active")
            const icon = header.querySelector(".accordion-icon")
            icon.textContent = themeElement.classList.contains("active")
                ? "expand_less"
                : "expand_more"

            // NEUE FUNKTIONALITÄT: Als aktives Thema markieren
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
                document.body.dataset.activeThemeId = theme.id
                showNotification(
                    `Thema "${theme.title}" ausgewählt für Prüfschritte-Sammlung`
                )

                // Aktualisiere die Add-Buttons, um die Änderung zu reflektieren
                setupAddToThemeButtons()
            } else {
                // Wenn es bereits aktiv war, dann deaktivieren
                delete document.body.dataset.activeThemeId

                // Aktualisiere die Add-Buttons, um die Änderung zu reflektieren
                setupAddToThemeButtons()
            }
        })

        // Rest des vorhandenen Codes...
        // Aktionsbuttons
        const copyButton = themeElement.querySelector(".copy-theme")
        copyButton.addEventListener("click", function (e) {
            e.stopPropagation()
            copyThemeToClipboard(theme.id)
        })

        const editButton = themeElement.querySelector(".edit-theme")
        editButton.addEventListener("click", function (e) {
            e.stopPropagation()
            openEditThemeModal(theme.id)
        })

        const deleteButton = themeElement.querySelector(".delete-theme")
        deleteButton.addEventListener("click", function (e) {
            e.stopPropagation()
            deleteTheme(theme.id)
        })

        // Wenn ein Suchfilter aktiv ist, das Thema automatisch öffnen
        if (themesSearchFilter) {
            themeElement.classList.add("active")
            header.querySelector(".accordion-icon").textContent = "expand_less"
        }
    })
}

// Prüfschritte eines Themas rendern
function renderPruefschritteList(pruefschritte) {
    if (!pruefschritte || pruefschritte.length === 0) {
        return '<p class="empty-pruefschritte">Keine Prüfschritte hinzugefügt. Klicken Sie das + Symbol bei Prüfschritten, um sie hinzuzufügen.</p>'
    }

    return pruefschritte
        .map(
            (item) => `
        <div class="pruefschritt-item">
            <div class="pruefschritt-title">${
                themesSearchFilter
                    ? highlightThemesSearchTerm(item.title, themesSearchFilter)
                    : item.title
            }</div>
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

// Thema in die Zwischenablage kopieren
function copyThemeToClipboard(themeId) {
    const theme = collectionsData[themeId]
    if (!theme) return

    const themeJson = JSON.stringify(theme, null, 2)
    navigator.clipboard
        .writeText(themeJson)
        .then(() => {
            showNotification("Thema in die Zwischenablage kopiert!")
        })
        .catch((err) => {
            console.error("Fehler beim Kopieren:", err)
            showNotification("Fehler beim Kopieren in die Zwischenablage.")
        })
}

// Thema-Edit-Modal öffnen
function openEditThemeModal(themeId) {
    const theme = collectionsData[themeId]
    if (!theme) return

    // Ein temporäres Formular erstellen und einfügen
    const modal = document.createElement("div")
    modal.className = "modal edit-theme-modal"
    modal.innerHTML = `
        <div class="modal-content">
            <button class="modal-close-button">&times;</button>
            <h3>Thema bearbeiten</h3>
            <div class="form-group">
                <label for="edit-theme-title">Titel:</label>
                <input type="text" id="edit-theme-title" value="${
                    theme.title || ""
                }">
            </div>
            <div class="form-group">
                <label for="edit-theme-author">Autor:</label>
                <input type="text" id="edit-theme-author" value="${
                    theme.author || ""
                }">
            </div>
            <div class="form-group">
                <label for="edit-theme-description">Beschreibung:</label>
                <textarea id="edit-theme-description" rows="3">${
                    theme.description || ""
                }</textarea>
            </div>
            <div class="modal-actions">
                <button class="theme-action-button save-edit-theme">
                    <span class="material-icons">save</span>
                    Speichern
                </button>
                <button class="theme-action-button secondary cancel-edit-theme">
                    <span class="material-icons">close</span>
                    Abbrechen
                </button>
            </div>
            <input type="hidden" id="edit-theme-id" value="${themeId}">
        </div>
    `

    document.body.appendChild(modal)

    // Style für das Modal
    const style = document.createElement("style")
    style.textContent = `
        .modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
        }
        
        .modal-content {
            background-color: white;
            padding: 20px;
            border-radius: 8px;
            width: 90%;
            max-width: 500px;
            position: relative;
        }
        
        .collections-panel[data-theme="dark"] + .modal .modal-content {
            background-color: #1e1e1e;
            color: #e0e0e0;
        }
        
        .modal-close-button {
            position: absolute;
            top: 10px;
            right: 10px;
            background: none;
            border: none;
            font-size: 24px;
            cursor: pointer;
            color: #666;
        }
        
        .collections-panel[data-theme="dark"] + .modal .modal-close-button {
            color: #aaa;
        }
        
        .modal-actions {
            display: flex;
            justify-content: flex-end;
            margin-top: 20px;
            gap: 10px;
        }
        
        .collections-panel[data-theme="dark"] + .modal input,
        .collections-panel[data-theme="dark"] + .modal textarea {
            background-color: #2a2a2a;
            color: #e0e0e0;
            border-color: #3d3d3d;
        }
    `
    document.head.appendChild(style)

    // Event-Listener
    modal.querySelector(".modal-close-button").addEventListener("click", () => {
        document.body.removeChild(modal)
    })

    modal.querySelector(".cancel-edit-theme").addEventListener("click", () => {
        document.body.removeChild(modal)
    })

    modal.querySelector(".save-edit-theme").addEventListener("click", () => {
        updateTheme(
            document.getElementById("edit-theme-id").value,
            document.getElementById("edit-theme-title").value.trim(),
            document.getElementById("edit-theme-author").value.trim(),
            document.getElementById("edit-theme-description").value.trim()
        )
        document.body.removeChild(modal)
    })
}

// Thema aktualisieren
function updateTheme(id, title, author, description) {
    if (!title) {
        showNotification("Der Titel darf nicht leer sein.")
        return
    }

    if (!collectionsData[id]) {
        showNotification("Thema nicht gefunden.")
        return
    }

    const dateTime = getCurrentDateTime()

    collectionsData[id] = {
        ...collectionsData[id],
        title,
        author,
        description,
        lastModified: dateTime,
    }

    saveCollectionsData()
    showNotification("Thema erfolgreich aktualisiert!")
    renderThemesList()
}

// Thema löschen
function deleteTheme(id) {
    if (!confirm("Sind Sie sicher, dass Sie dieses Thema löschen möchten?")) {
        return
    }

    if (!collectionsData[id]) {
        showNotification("Thema nicht gefunden.")
        return
    }

    delete collectionsData[id]
    saveCollectionsData()
    showNotification("Thema erfolgreich gelöscht!")
    renderThemesList()
}

// Prüfschritt zu einem Thema hinzufügen
function addPruefschrittToTheme(themeId, pruefschritt, sectionIndex) {
    if (!collectionsData[themeId]) {
        showNotification("Thema nicht gefunden.")
        return
    }

    // Prüfen, ob der Prüfschritt bereits vorhanden ist
    const exists = collectionsData[themeId].data.some(
        (p) => p.id === pruefschritt.id
    )
    if (exists) {
        showNotification("Dieser Prüfschritt ist bereits im Thema enthalten.")
        return
    }

    const dateTime = getCurrentDateTime()

    // Prüfschritt hinzufügen
    collectionsData[themeId].data.push({
        id: pruefschritt.id,
        title: pruefschritt.title,
        section: sectionIndex,
        description: pruefschritt.details?.description || "",
        conformanceLevel: pruefschritt.conformanceLevel,
    })

    // Datum aktualisieren
    collectionsData[themeId].lastModified = dateTime

    saveCollectionsData()
    showNotification("Prüfschritt zum Thema hinzugefügt!")
    renderThemesList()
}

// Prüfschritt aus einem Thema entfernen
function removePruefschrittFromTheme(themeId, pruefschrittId) {
    if (!collectionsData[themeId]) {
        showNotification("Thema nicht gefunden.")
        return
    }

    collectionsData[themeId].data = collectionsData[themeId].data.filter(
        (p) => p.id !== pruefschrittId
    )
    collectionsData[themeId].lastModified = getCurrentDateTime()

    saveCollectionsData()
    showNotification("Prüfschritt aus dem Thema entfernt!")
    renderThemesList()
}

// "Hinzufügen zu Thema"-Buttons auf Prüfschritt-Karten
function setupAddToThemeButtons() {
    // "Hinzufügen zu"-Button für alle Prüfschritt-Karten erstellen
    document.querySelectorAll(".pruefschritt-card").forEach((card) => {
        // Falls bereits ein Button vorhanden, diesen entfernen
        const existingButton = card.querySelector(".add-to-theme-button")
        if (existingButton) {
            existingButton.remove()
        }

        // Prüfen, ob ein aktives Thema vorhanden ist
        const activeThemeId = document.body.dataset.activeThemeId

        // Neuen Button erstellen
        const addButton = document.createElement("button")
        addButton.className = "add-to-theme-button"

        if (activeThemeId && collectionsData[activeThemeId]) {
            // Wenn aktives Thema, zeige spezielles Icon und Tooltip
            const themeName = collectionsData[activeThemeId].title
            addButton.innerHTML =
                '<span class="material-icons">playlist_add</span>'
            addButton.title = `Zu "${themeName}" hinzufügen`
            addButton.classList.add("active-theme-add")
        } else {
            // Standard-Icon und Tooltip
            addButton.innerHTML = '<span class="material-icons">add</span>'
            addButton.title = "Zu einem Thema hinzufügen"
        }

        // Event-Listener für Klick
        addButton.addEventListener("click", (e) => {
            e.stopPropagation() // Verhindert, dass die Karte geöffnet wird

            // Prüfen, ob ein Thema aktiv ist
            const activeThemeId = document.body.dataset.activeThemeId

            if (activeThemeId && collectionsData[activeThemeId]) {
                // Wenn ein Thema aktiv ist, direkt hinzufügen
                const pruefschritt = card.pruefschrittData
                const sectionClass = Array.from(card.classList).find((c) =>
                    c.startsWith("section-")
                )
                const sectionIndex = sectionClass
                    ? parseInt(sectionClass.replace("section-", "")) - 1
                    : 0

                addPruefschrittToTheme(
                    activeThemeId,
                    pruefschritt,
                    sectionIndex
                )
            } else {
                // Wenn kein Thema aktiv ist, das Auswahlpopup anzeigen
                showThemeSelectionPopup(card)
            }
        })

        // Button zur Karte hinzufügen
        card.appendChild(addButton)
    })
}

// Popup zur Themenauswahl anzeigen
function showThemeSelectionPopup(card) {
    // Altes Popup entfernen, falls vorhanden
    const existingPopup = document.querySelector(".theme-selection-popup")
    if (existingPopup) {
        existingPopup.remove()
    }

    // Prüfschritt-Daten aus der Karte holen
    const pruefschritt = card.pruefschrittData
    if (!pruefschritt) return

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

    // Position relativ zur Karte bestimmen
    const rect = card.getBoundingClientRect()
    popup.style.top = `${rect.top + window.scrollY}px`
    popup.style.left = `${rect.right + window.scrollX + 10}px`

    // Überprüfen, ob Popup im sichtbaren Bereich liegt
    setTimeout(() => {
        const popupRect = popup.getBoundingClientRect()
        const viewportWidth = window.innerWidth

        if (popupRect.right > viewportWidth) {
            // Popup würde rechts aus dem Viewport hinausragen, daher links platzieren
            popup.style.left = `${
                rect.left + window.scrollX - popupRect.width - 10
            }px`
        }
    }, 0)

    // Themen laden
    const themes = Object.values(collectionsData)

    // Popup-Inhalt erstellen
    let popupContent = "<h4>Zu einem Thema hinzufügen</h4>"

    if (themes.length === 0) {
        popupContent +=
            '<div class="theme-selection-empty">Keine Themen vorhanden</div>'
    } else {
        popupContent += '<ul class="theme-selection-list">'
        themes.forEach((theme) => {
            // Prüfen, ob der Prüfschritt bereits im Thema ist
            const alreadyInTheme = theme.data.some(
                (p) => p.id === pruefschritt.id
            )
            const itemClass = alreadyInTheme
                ? "theme-selection-item disabled"
                : "theme-selection-item"
            const itemText = alreadyInTheme ? `${theme.title} ✓` : theme.title

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
                addPruefschrittToTheme(themeId, pruefschritt, sectionIndex)
                popup.remove()
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
                // Neues Thema erstellen
                const themeId = generateId()
                const dateTime = getCurrentDateTime()

                collectionsData[themeId] = {
                    id: themeId,
                    title: themeTitle,
                    author: "",
                    description: "",
                    data: [
                        {
                            id: pruefschritt.id,
                            title: pruefschritt.title,
                            section: sectionIndex,
                            description:
                                pruefschritt.details?.description || "",
                            conformanceLevel: pruefschritt.conformanceLevel,
                        },
                    ],
                    created: dateTime,
                    lastModified: dateTime,
                }

                saveCollectionsData()
                showNotification(
                    `Neues Thema "${themeTitle}" erstellt und Prüfschritt hinzugefügt!`
                )
                renderThemesList()
                popup.remove()
            } else {
                alert("Bitte geben Sie einen Titel für das neue Thema ein.")
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

// Initialisierung des Themen Managers
function initThemeManager() {
    // Daten laden
    loadCollectionsData()

    // UI erstellen
    createEnhancedCollectionsPanel()

    // "Zu Thema hinzufügen"-Buttons für Prüfschritte erstellen
    setupAddToThemeButtons()

    // Global Event-Listener für Änderungen am aktiven Thema
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.attributeName === "data-active-theme-id") {
                // Aktualisiere alle Add-Buttons
                setupAddToThemeButtons()
            }
        })
    })

    // Beobachte den body auf Änderungen am data-active-theme-id Attribut
    observer.observe(document.body, {
        attributes: true,
        attributeFilter: ["data-active-theme-id"],
    })

    // Event-Listener für das Entfernen von Prüfschritten
    document.addEventListener("click", function (e) {
        if (e.target.closest(".remove-pruefschritt")) {
            const button = e.target.closest(".remove-pruefschritt")
            const pruefschrittId = button.dataset.id
            const themeItem = button.closest(".theme-item")

            if (themeItem && pruefschrittId) {
                const themeId = themeItem.dataset.id
                removePruefschrittFromTheme(themeId, pruefschrittId)
            }
        }
    })

    // Themenliste initial rendern
    renderThemesList()
}

// Formatierung des Datums und der Zeit
function getCurrentDateTime() {
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

// Hilfsfunktionen
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substring(2)
}

// Falls die Seite bereits geladen ist, Themen Manager initialisieren
if (
    document.readyState === "complete" ||
    document.readyState === "interactive"
) {
    setTimeout(initThemeManager, 500)
}

// Export der Funktionen für die Integration
window.themeManager = {
    create: createNewTheme,
    update: updateTheme,
    delete: deleteTheme,
    addPruefschritt: addPruefschrittToTheme,
    removePruefschritt: removePruefschrittFromTheme,
    render: renderThemesList,
    data: collectionsData,
}

// - - - - - - - - - -
// - - - - - - - - - -
// - - - - - - - - - -

const UI_SETTINGS_KEY = "bitvUiSettings"

const defaultSettings = {
    // Anzeigeoptionen
    displayBitvId: true,
    displayWcagId: true,
    displayProfessionMarkers: true,

    // Filteroptionen
    activeConformanceLevels: [],
    activeProfessions: [],
    activeStandards: ["BITV", "WCAG", "EN301549", "BITinklusiv"],

    // Position des Collection Panels
    collectionsPanelPosition: { right: "30px", bottom: "100px" },
}

function saveUISettings(settings) {
    localStorage.setItem(UI_SETTINGS_KEY, JSON.stringify(settings))
}

function loadUISettings() {
    const savedSettings = localStorage.getItem(UI_SETTINGS_KEY)
    return savedSettings ? JSON.parse(savedSettings) : { ...defaultSettings }
}

// - - - - - - - - - -
// - - - - - - - - - -
// - - - - - - - - - -

document.addEventListener("DOMContentLoaded", () => {
    loadAndRenderData()
})

document.addEventListener("DOMContentLoaded", () => {
    // Initialisiere Themen Manager nach einer kurzen Verzögerung
    setTimeout(() => {
        initThemeManager()
    }, 1000) // Etwas längere Verzögerung, um sicherzustellen, dass alles andere geladen ist
})

document.addEventListener("DOMContentLoaded", () => {
    // Original loadAndRenderData Funktion erweitern
    const originalLoadAndRenderData = loadAndRenderData
    loadAndRenderData = function () {
        // Die auskommentierten Tooltip-Funktionen entfernen
        updateRenderTree()
        originalLoadAndRenderData()
    }
})

// Add this to your initialization process
document.addEventListener("DOMContentLoaded", () => {
    initDescriptions().then(() => console.log("Descriptions loaded"))
})
