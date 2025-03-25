document.addEventListener("DOMContentLoaded", () => {
    loadAndRenderData()
})

function initKeyboardNavigation() {
    const container = document.querySelector(".tree-container")

    // Make sections focusable
    document.querySelectorAll(".section-column").forEach((section) => {
        section.setAttribute("tabindex", "0")
        section.setAttribute("role", "region")
        section.setAttribute(
            "aria-label",
            section.querySelector(".section-card").textContent
        )

        // Track active card in section
        let activeCardIndex = -1
        const cards = Array.from(section.querySelectorAll(".card"))

        section.addEventListener("focus", () => {
            section.classList.add("section-focus")
        })

        section.addEventListener("blur", () => {
            section.classList.remove("section-focus")
            // Reset active card when leaving section
            if (activeCardIndex >= 0) {
                cards[activeCardIndex].classList.remove("card-focus")
                removeTooltip(cards[activeCardIndex])
            }
            activeCardIndex = -1
        })

        section.addEventListener("keydown", (e) => {
            switch (e.key) {
                case "ArrowDown":
                case "ArrowRight":
                    e.preventDefault()
                    if (activeCardIndex < cards.length - 1) {
                        if (activeCardIndex >= 0) {
                            cards[activeCardIndex].classList.remove(
                                "card-focus"
                            )
                            removeTooltip(cards[activeCardIndex])
                        }
                        activeCardIndex++
                        cards[activeCardIndex].classList.add("card-focus")
                        showTooltip(cards[activeCardIndex])
                    }
                    break

                case "ArrowUp":
                case "ArrowLeft":
                    e.preventDefault()
                    if (activeCardIndex > 0) {
                        cards[activeCardIndex].classList.remove("card-focus")
                        removeTooltip(cards[activeCardIndex])
                        activeCardIndex--
                        cards[activeCardIndex].classList.add("card-focus")
                        showTooltip(cards[activeCardIndex])
                    }
                    break

                case "Escape":
                    e.preventDefault()
                    if (activeCardIndex >= 0) {
                        // First Escape: leave card focus
                        cards[activeCardIndex].classList.remove("card-focus")
                        removeTooltip(cards[activeCardIndex])
                        activeCardIndex = -1
                    } else {
                        // Second Escape: leave section
                        section.blur()
                    }
                    break

                case " ":
                case "Enter":
                    e.preventDefault()
                    if (activeCardIndex >= 0) {
                        const pruefschritt =
                            cards[activeCardIndex].pruefschrittData
                        if (pruefschritt) {
                            showDetails(pruefschritt)
                        }
                    }
                    break
            }
        })
    })
}

function showTooltip(card) {
    const tooltip = card.tooltipElement
    if (tooltip) {
        // const column = card.closest(".section-column")
        // if (column) {
        //     column.appendChild(tooltip)
        // }
        card.appendChild(tooltip)
    }
}

function removeTooltip(card) {
    const tooltip = card.tooltipElement
    if (tooltip && tooltip.parentNode) {
        tooltip.parentNode.removeChild(tooltip)
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

function applyFilters() {
    const cards = document.querySelectorAll(".pruefschritt-card")
    let visibleCount = 0

    cards.forEach((card) => {
        const searchMatch = matchesSearch(card)
        const levelMatch = matchesLevel(card)

        if (searchMatch && levelMatch) {
            card.classList.remove("filtered")
            visibleCount++
        } else {
            card.classList.add("filtered")
        }
    })

    updateFilterCount(visibleCount)
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

function updateFilterCount(count) {
    const filterCount = document.querySelector(".filter-count")
    const total = document.querySelectorAll(".pruefschritt-card").length
    filterCount.textContent = `${count} von ${total} Kriterien sichtbar`
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
    fetch("./bitv.json")
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
        categoryCard.textContent =  " "
   
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

    fetch(`./${pruefschritt.id}.md`)
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
function addCollectionsStyles() {

}

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
