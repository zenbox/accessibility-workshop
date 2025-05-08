// - - - - - - - - - -
// Version v2
// - - - - - - - - - -

// Globale Variablen für Navigationsstatus
let activeSection = null
let activeCard = null
let activeTooltip = null
let tooltipTimeout = null

/**
 * Zeigt einen Tooltip für eine Karte an
 * @param {HTMLElement} card - Die Karte, für die der Tooltip angezeigt werden soll
 */
function showTooltip(card) {
    // Vorherigen Tooltip entfernen
    hideAllTooltips()

    clearTimeout(tooltipTimeout)

    const tooltip = card.tooltipElement
    if (!tooltip) return

    // Position berechnen
    const rect = card.getBoundingClientRect()
    const containerRect = document
        .querySelector(".tree-container")
        .getBoundingClientRect()

    // Prüfen, ob rechts genug Platz ist
    const rightSpace = containerRect.right - (rect.right + 10 + 300) // 300px ist max-width des Tooltips
    const leftPosition = rightSpace < 0

    if (leftPosition) {
        tooltip.classList.add("left-position")
    } else {
        tooltip.classList.remove("left-position")
    }

    card.appendChild(tooltip)
    activeTooltip = tooltip

    // Kleines Delay, damit es nicht zu störend ist
    tooltipTimeout = setTimeout(() => {
        tooltip.classList.add("visible")
    }, 100)
}

/**
 * Verbirgt einen spezifischen Tooltip
 * @param {HTMLElement} card - Die Karte, deren Tooltip versteckt werden soll
 */
function hideTooltip(card) {
    clearTimeout(tooltipTimeout)

    const tooltip = card.tooltipElement
    if (!tooltip) return

    tooltip.classList.remove("visible")

    // Tooltip erst nach Ausblendanimation entfernen
    tooltipTimeout = setTimeout(() => {
        if (tooltip.parentNode === card) {
            card.removeChild(tooltip)
        }
    }, 300)
}

/**
 * Verbirgt alle aktiven Tooltips
 */
function hideAllTooltips() {
    document.querySelectorAll(".tooltip.visible").forEach((tooltip) => {
        tooltip.classList.remove("visible")
        setTimeout(() => {
            if (tooltip.parentNode) {
                tooltip.parentNode.removeChild(tooltip)
            }
        }, 300)
    })

    clearTimeout(tooltipTimeout)
    activeTooltip = null
}

function removeTooltip(card) {
    clearTimeout(tooltipTimeout)

    const tooltip = card.tooltipElement
    if (!tooltip) return

    tooltip.classList.remove("visible")

    // Tooltip erst nach Ausblendanimation entfernen
    tooltipTimeout = setTimeout(() => {
        if (tooltip.parentNode === card) {
            card.removeChild(tooltip)
        }
    }, 300)
}

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

function updateTooltipHandlers() {
    // Karten mit Tooltips finden
    document
        .querySelectorAll('.card[data-has-tooltip="true"]')
        .forEach((card) => {
            // Bisherige Event-Listener entfernen
            const newCard = card.cloneNode(true)
            card.parentNode.replaceChild(newCard, card)

            // Neues Event-System wird durch initEnhancedKeyboardNavigation gesetzt
        })
}

function updateRenderTree() {
    const originalRenderTree = renderTree

    renderTree = function (bitvData) {
        originalRenderTree(bitvData)

        // Alle Karten mit Tooltips markieren
        document.querySelectorAll(".card").forEach((card) => {
            if (card.tooltipElement) {
                card.setAttribute("data-has-tooltip", "true")
            }
        })
    }
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
    professionFiltersContainer.id = "professions"
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
        <!--<div class="filter-group-title">Anzeigeoptionen</div>-->
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
    fetch("./../../assets/data/criterias.json")
        .then((response) => response.json())
        .then((data) => {
            renderTree(data)
            initKeyboardNavigation()
            initializeFilters() // Initialize filters after rendering
        })
        .catch((error) => console.error(error))
}

function createTooltip(description) {
    if (!description) return null

    const tooltip = document.createElement("div")
    tooltip.className = "tooltip"
    tooltip.textContent = description
    return tooltip
}

function handleMouseEnter(element, tooltip) {
    if (!tooltip) return
    element.appendChild(tooltip)
}

function handleMouseLeave(element, tooltip) {
    if (!tooltip) return
    element.removeChild(tooltip)
}

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

function showDetails(pruefschritt) {
    const modal = document.getElementById("sectionModal")
    const modalContent = document.getElementById("modalContent")

    fetch(`./../../assets/data/docs/${pruefschritt.id}.md`)
        .then((response) => response.text())
        .then((markdown) => {
            modalContent.innerHTML = marked.parse(markdown)
            modal.style.display = "block"
        })
        .catch((error) => {
            modalContent.innerHTML = "Fehler beim Laden der Details."
            console.error(error)
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
let collections = {
    // Format: 'collectionName': [pruefschrittIds...]
}

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

// DOM-Elemente erstellen
function setupCollectionsUI() {
    // Container für die Sammlungs-UI erstellen
    const asideElement = document.querySelector("aside#collections")
    const collectionsContainer = document.createElement("div")
    collectionsContainer.id = "collections-container"
    collectionsContainer.className = "collections-container"

    // Header mit Toggle-Button für Ein-/Ausklappen
    const collectionsHeader = document.createElement("div")
    collectionsHeader.className = "collections-header"
    collectionsHeader.innerHTML = `
        <h3>Prüfschritte sammeln</h3>
        <button id="toggle-collections" class="toggle-button" aria-expanded="true" aria-label="Sammlungen ein-/ausklappen">
            <span class="material-icons">expand_less</span>
        </button>
    `

    // Content-Bereich, der ein-/ausgeklappt werden kann
    const collectionsContent = document.createElement("div")
    collectionsContent.id = "collections-content"
    collectionsContent.className = "collections-content"

    // Container für die Erstellung neuer Sammlungen
    const newCollectionContainer = document.createElement("div")
    newCollectionContainer.className = "new-collection-container"

    // Formular für neue Sammlung
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

    // Container für die aktuell ausgewählte Sammlung
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

    collectionsContent.appendChild(newCollectionContainer)
    collectionsContent.appendChild(collectionsListContainer)
    collectionsContent.appendChild(activeCollectionContainer)

    collectionsContainer.appendChild(collectionsHeader)
    collectionsContainer.appendChild(collectionsContent)

    // In die aside einfügen
    asideElement.appendChild(collectionsContainer)

    // CSS für die Collections-UI hinzufügen
    addCollectionsStyles()

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

    // Event-Listener für den Toggle-Button
    document
        .getElementById("toggle-collections")
        .addEventListener("click", toggleCollections)

    // Event-Listener für den Deselect-Button
    document
        .getElementById("deselect-collection")
        .addEventListener("click", deselectCollection)
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

// Funktion zum Ein-/Ausklappen der Sammlungen
function toggleCollections() {
    const content = document.getElementById("collections-content")
    const button = document.getElementById("toggle-collections")
    const isExpanded = button.getAttribute("aria-expanded") === "true"

    if (isExpanded) {
        // Einklappen
        content.style.maxHeight = "0"
        content.style.overflow = "hidden"
        button.setAttribute("aria-expanded", "false")
        button.querySelector(".material-icons").textContent = "expand_more"
    } else {
        // Ausklappen
        content.style.maxHeight = content.scrollHeight + "px"
        content.style.overflow = "visible"
        button.setAttribute("aria-expanded", "true")
        button.querySelector(".material-icons").textContent = "expand_less"
    }
}

// Funktion zum Aufheben der Sammlungsauswahl
function deselectCollection() {
    document.querySelectorAll(".collection-item").forEach((item) => {
        item.classList.remove("active")
    })

    document.getElementById("active-collection-title").textContent =
        "Keine Sammlung ausgewählt"
    document.getElementById("active-collection-items").innerHTML = ""
    document.getElementById("deselect-collection").style.display = "none"

    // Body-Klasse entfernen, um Add-Buttons auszublenden
    document.body.classList.remove("collecting-active")
    delete document.body.dataset.activeCollection
}

// Styling für die Collections-UI
function addCollectionsStyles() {}

// Eine neue Sammlung erstellen
function createNewCollection(name) {
    if (collections[name]) {
        alert(`Eine Sammlung mit dem Namen "${name}" existiert bereits.`)
        return
    }

    collections[name] = []
    saveCollections()
    renderCollectionsList()
    selectCollection(name)
}

// Sammlungen im localStorage speichern
function saveCollections() {
    localStorage.setItem("bitvCollections", JSON.stringify(collections))
}

// Sammlungen aus dem localStorage laden
function loadCollections() {
    const savedCollections = localStorage.getItem("bitvCollections")
    if (savedCollections) {
        collections = JSON.parse(savedCollections)
    }
}

// Die Liste der Sammlungen rendern
function renderCollectionsList() {
    const collectionsList = document.getElementById("collections-list")
    collectionsList.innerHTML = ""

    Object.keys(collections).forEach((name) => {
        const li = document.createElement("li")
        li.className = "collection-item"
        li.dataset.name = name

        li.innerHTML = `
            <span>${name}</span> 
            <span class="count">(${collections[name].length})</span>
            <button class="delete-collection-button" aria-label="Sammlung löschen">
                <span class="material-icons">delete</span>
            </button>
        `

        li.addEventListener("click", (e) => {
            // Verhindern, dass der Klick auf den Lösch-Button die Sammlung auswählt
            if (e.target.closest(".delete-collection-button")) {
                e.stopPropagation()
                deleteCollection(name)
                return
            }
            selectCollection(name)
        })

        collectionsList.appendChild(li)
    })
}

// Eine Sammlung löschen
function deleteCollection(name) {
    if (confirm(`Möchten Sie die Sammlung "${name}" wirklich löschen?`)) {
        delete collections[name]
        saveCollections()
        renderCollectionsList()

        // Wenn die aktive Sammlung gelöscht wurde, UI zurücksetzen
        const activeTitle = document.getElementById("active-collection-title")
        if (activeTitle.textContent === name) {
            deselectCollection()
        }
    }
}

// Eine Sammlung auswählen und anzeigen
function selectCollection(name) {
    document.querySelectorAll(".collection-item").forEach((item) => {
        item.classList.toggle("active", item.dataset.name === name)
    })

    document.getElementById("active-collection-title").textContent = name
    document.getElementById("deselect-collection").style.display = "block"
    renderCollectionItems(name)

    // Body-Klasse hinzufügen, um Add-Buttons sichtbar zu machen
    document.body.classList.add("collecting-active")
    document.body.dataset.activeCollection = name
}

// Die Prüfschritte in einer Sammlung rendern
function renderCollectionItems(collectionName) {
    const container = document.getElementById("active-collection-items")
    container.innerHTML = ""

    const collectionItems = collections[collectionName]

    if (collectionItems.length === 0) {
        container.innerHTML =
            "<p>Diese Sammlung ist noch leer. Klicken Sie auf das + Symbol bei Prüfschritten, um sie hinzuzufügen.</p>"
        return
    }

    collectionItems.forEach((itemData) => {
        const { id, title, sectionIndex, description, conformanceLevel } =
            itemData

        const card = document.createElement("div")
        card.className = `collection-card section-${sectionIndex + 1}`

        const levelBadge = conformanceLevel
            ? `<div class="${conformanceLevel}">${conformanceLevel}</div>`
            : ""

        card.innerHTML = `
            ${levelBadge}
            <div class="card-title">${title}</div>
            <div class="card-id">${id}</div>
            <button class="remove-button" aria-label="Aus Sammlung entfernen">
                <span class="material-icons">close</span>
            </button>
        `

        card.querySelector(".remove-button").addEventListener("click", () => {
            removeFromCollection(collectionName, id)
        })

        container.appendChild(card)
    })
}

// Prüfschritt zur Sammlung hinzufügen
function addToCollection(collectionName, pruefschritt, sectionIndex) {
    const itemData = {
        id: pruefschritt.id,
        title: pruefschritt.title,
        sectionIndex: sectionIndex,
        description: pruefschritt.details?.description || "",
        conformanceLevel: pruefschritt.conformanceLevel,
    }

    // Prüfen, ob der Prüfschritt bereits in der Sammlung ist
    const exists = collections[collectionName].some(
        (item) => item.id === pruefschritt.id
    )

    if (!exists) {
        collections[collectionName].push(itemData)
        saveCollections()

        if (document.body.dataset.activeCollection === collectionName) {
            renderCollectionItems(collectionName)
        }

        renderCollectionsList() // Um die Zähler zu aktualisieren
    }
}

// Prüfschritt aus Sammlung entfernen
function removeFromCollection(collectionName, pruefschrittId) {
    collections[collectionName] = collections[collectionName].filter(
        (item) => item.id !== pruefschrittId
    )

    saveCollections()
    renderCollectionItems(collectionName)
    renderCollectionsList() // Um die Zähler zu aktualisieren
}

// Add-Buttons zu den Prüfschritt-Karten hinzufügen
function addCollectionButtonsToPruefschritte() {
    document.querySelectorAll(".pruefschritt-card").forEach((card, index) => {
        const addButton = document.createElement("button")
        addButton.className = "add-to-collection-button"
        addButton.setAttribute(
            "aria-label",
            "Zur aktuellen Sammlung hinzufügen"
        )
        addButton.innerHTML = '<span class="material-icons">add_circle</span>'

        addButton.addEventListener("click", (e) => {
            e.stopPropagation() // Verhindert, dass die Karte geöffnet wird

            const activeCollection = document.body.dataset.activeCollection
            if (activeCollection) {
                const pruefschrittData = card.pruefschrittData
                const sectionIndex = parseInt(
                    card.className.match(/section-(\d+)/)[1] - 1
                )

                addToCollection(
                    activeCollection,
                    pruefschrittData,
                    sectionIndex
                )
            } else {
                alert("Bitte wählen Sie zuerst eine Sammlung aus.")
            }
        })

        card.appendChild(addButton)
    })
}

// Initialisierung
function initCollections() {
    loadCollections()
    setupCollectionsUI()
    renderCollectionsList()
    addCollectionButtonsToPruefschritte()
}

// Erweitern der loadAndRenderData-Funktion
const originalLoadAndRenderData = loadAndRenderData
loadAndRenderData = function () {
    originalLoadAndRenderData()

    // Nach dem Rendern des Baums die Collections initialisieren
    setTimeout(() => {
        initCollections()
    }, 500) // Kurze Verzögerung, um sicherzustellen, dass der Baum gerendert ist
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
    // Original loadAndRenderData Funktion erweitern
    const originalLoadAndRenderData = loadAndRenderData
    loadAndRenderData = function () {
        // Die auskommentierten Tooltip-Funktionen entfernen
        updateRenderTree()
        originalLoadAndRenderData()
    }
})

document.addEventListener("DOMContentLoaded", () => {
    const originalLoadAndRenderData = loadAndRenderData
    loadAndRenderData = function () {
        originalLoadAndRenderData()

        // Warten, bis der Baum gerendert ist
        setTimeout(() => {
            addSkipLink()
            initEnhancedKeyboardNavigation()
            enhanceFilterControls()
            enhanceModalAccessibility()
        }, 300)
    }
})
