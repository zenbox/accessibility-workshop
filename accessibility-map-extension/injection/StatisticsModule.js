export class StatisticsModule {
    constructor(colorMapping) {
        this.colorMapping = colorMapping
        this.statistics = {}
        this.container = null
        this.isVisible = false
    }

    // Sammelt Statistiken für alle aktivierten Kategorien
    collectStatistics() {
        this.statistics = {} // Zurücksetzen der Statistiken

        for (const category in this.colorMapping) {
            const { selectors, enabled, type } = this.colorMapping[category]

            if (enabled && type !== "contrast") {
                // Erstelle einen etwas verarbeiteten Selektor, um Konflikte mit der UI zu vermeiden
                const processedSelectors = selectors
                    .split(",")
                    .map(
                        (selector) =>
                            `${selector.trim()}:not(#a11y-map-controls-container *)`
                    )
                    .join(",")

                try {
                    // Zähle die Elemente, die dem Selektor entsprechen
                    const elements =
                        document.querySelectorAll(processedSelectors)
                    this.statistics[category] = {
                        count: elements.length,
                        details: this.getDetailedStatistics(
                            elements,
                            type,
                            category
                        ),
                    }
                } catch (error) {
                    console.error(
                        `[A11y-Map] Error counting elements for "${category}":`,
                        error
                    )
                    this.statistics[category] = { count: 0, details: {} }
                }
            }
        }

        return this.statistics
    }

    // Sammelt detaillierte Statistiken je nach Kategorie-Typ
    getDetailedStatistics(elements, type, category) {
        const details = {}

        // Für verschiedene Kategorien unterschiedliche Details sammeln
        switch (category) {
            case "1.3.1 Überschriften":
                // Gruppiere Überschriften nach Level (h1, h2, h3, ...)
                elements.forEach((element) => {
                    const tagName = element.tagName.toLowerCase()
                    if (tagName.match(/h[1-6]/)) {
                        details[tagName] = (details[tagName] || 0) + 1
                    } else if (element.getAttribute("role") === "heading") {
                        const level =
                            element.getAttribute("aria-level") || "unspecified"
                        const key = `role=heading (level ${level})`
                        details[key] = (details[key] || 0) + 1
                    }
                })
                break

            case "1.3.1 Listen":
                // Gruppiere Listen nach Typ (ul, ol, dl)
                elements.forEach((element) => {
                    const tagName = element.tagName.toLowerCase()
                    details[tagName] = (details[tagName] || 0) + 1
                })
                break

            case "idConnected":
                // Gruppiere nach Art der Verbindung
                elements.forEach((element) => {
                    if (element.hasAttribute("aria-labelledby")) {
                        details["aria-labelledby"] =
                            (details["aria-labelledby"] || 0) + 1
                    }
                    if (element.hasAttribute("aria-describedby")) {
                        details["aria-describedby"] =
                            (details["aria-describedby"] || 0) + 1
                    }
                    if (element.hasAttribute("for")) {
                        details["for"] = (details["for"] || 0) + 1
                    }
                })
                break

            case "roleElements":
                // Gruppiere nach role-Wert
                elements.forEach((element) => {
                    const role = element.getAttribute("role")
                    if (role) {
                        details[role] = (details[role] || 0) + 1
                    }
                })
                break

            case "ariaElements":
                // Gruppiere nach ARIA-Attribut
                elements.forEach((element) => {
                    ;[
                        "aria-label",
                        "aria-live",
                        "aria-describedby",
                        "aria-labelledby",
                    ].forEach((attr) => {
                        if (element.hasAttribute(attr)) {
                            details[attr] = (details[attr] || 0) + 1
                        }
                    })
                })
                break

            case "tabSequence":
                // Gruppiere nach Element-Typ
                elements.forEach((element) => {
                    let type = element.tagName.toLowerCase()
                    if (element.hasAttribute("tabindex")) {
                        type += ` [tabindex="${element.getAttribute(
                            "tabindex"
                        )}"]`
                    }
                    details[type] = (details[type] || 0) + 1
                })
                break

            default:
                // Standardgruppe nach Elementtyp
                if (type === "element" || type === "mixed") {
                    elements.forEach((element) => {
                        const tagName = element.tagName.toLowerCase()
                        details[tagName] = (details[tagName] || 0) + 1
                    })
                } else if (type === "attribute") {
                    // Bei Attributen die vorhandenen Attribute zählen
                    const attributeNames =
                        selectors.match(/\[([^\]]+)\]/g) || []
                    attributeNames.forEach((attrMatch) => {
                        const attrName = attrMatch
                            .replace(/[\[\]]/g, "")
                            .split("=")[0]
                        details[attrName] = elements.length
                    })
                }
                break
        }

        return details
    }

    // Erstellt oder aktualisiert den Statistik-Container
    createOrUpdateStatisticsPanel() {
        this.collectStatistics()

        // Wichtig: Prüfe, ob der Container existiert, bevor du ihn entfernst
        if (this.container) {
            this.container.remove()
        }

        // Erstelle neuen Container für Statistiken
        this.container = document.createElement("div")

        // Position aus localStorage laden, falls vorhanden
        const savedX = localStorage.getItem("a11y-map-statistics-x")
        const savedY = localStorage.getItem("a11y-map-statistics-y")

        if (savedX && savedY) {
            this.container.style.left = `${savedX}px`
            this.container.style.top = `${savedY}px`
        }

        this.collectStatistics()

        // Entferne vorhandenen Container falls vorhanden
        if (this.container) {
            this.container.remove()
            this.container = null
        }

        // Erstelle neuen Container für Statistiken
        this.container = document.createElement("div")
        this.container.id = "a11y-map-statistics"
        this.container.style.cssText = `
            position: fixed;
            top: 50px;
            left: 50px;
            background-color: rgba(0, 0, 0, 0.85);
            color: white;
            padding: 15px;
            border-radius: 8px;
            max-width: 350px;
            max-height: 80vh;
            overflow-y: auto;
            z-index: 10001;
            font-family: Arial, sans-serif;
            font-size: 14px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
            cursor: move;
        `

        // Header mit Titel und Schließen-Button
        const header = document.createElement("div")
        header.style.cssText = `
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
            padding-bottom: 8px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.3);
        `

        const title = document.createElement("h3")
        title.textContent = "Barrierefreiheit-Statistiken"
        title.style.margin = "0"
        title.style.fontSize = "16px"

        const closeButton = document.createElement("button")
        closeButton.innerHTML = "✕"
        closeButton.style.cssText = `
            background: none;
            border: none;
            color: white;
            font-size: 16px;
            cursor: pointer;
            padding: 0 5px;
        `
        closeButton.addEventListener("click", () => this.toggle())

        header.appendChild(title)
        header.appendChild(closeButton)
        this.container.appendChild(header)

        // Inhalt mit Statistiken
        const content = document.createElement("div")

        let totalElements = 0
        let activeCategories = 0

        // Gesamtstatistik anzeigen
        for (const category in this.statistics) {
            const { count } = this.statistics[category]
            totalElements += count
            if (count > 0) activeCategories++
        }

        const totalInfo = document.createElement("p")
        totalInfo.innerHTML = `<strong>Gesamt:</strong> ${totalElements} Elemente in ${activeCategories} Kategorien`
        totalInfo.style.marginBottom = "15px"
        content.appendChild(totalInfo)

        // Detailstatistiken je Kategorie
        for (const category in this.statistics) {
            const { count, details } = this.statistics[category]
            if (count === 0) continue

            const categorySection = document.createElement("div")
            categorySection.style.marginBottom = "15px"

            const categoryHeader = document.createElement("div")
            categoryHeader.innerHTML = `<strong>${category}:</strong> ${count} Elemente`
            categoryHeader.style.marginBottom = "5px"
            categorySection.appendChild(categoryHeader)

            // Details als Liste anzeigen
            if (Object.keys(details).length > 0) {
                const detailsList = document.createElement("ul")
                detailsList.style.cssText = `
                    margin: 5px 0 0 15px;
                    padding: 0;
                    list-style-type: disc;
                    font-size: 13px;
                `

                // Sortiere Details nach Anzahl (absteigend)
                const sortedDetails = Object.entries(details).sort(
                    (a, b) => b[1] - a[1]
                )

                sortedDetails.forEach(([key, value]) => {
                    const item = document.createElement("li")
                    item.innerHTML = `${key}: <strong>${value}</strong>`
                    item.style.marginBottom = "3px"
                    detailsList.appendChild(item)
                })

                categorySection.appendChild(detailsList)
            }

            content.appendChild(categorySection)
        }

        this.container.appendChild(content)

        // Mache den Container verschiebbar
        this.makeDraggable(this.container, header)

        // Nur anhängen, wenn sichtbar sein soll
        if (this.isVisible) {
            document.body.appendChild(this.container)
        }
    }

    // Schaltet die Sichtbarkeit des Statistik-Panels um
    toggle() {
        this.isVisible = !this.isVisible

        if (this.isVisible) {
            this.createOrUpdateStatisticsPanel()
        } else if (this.container) {
            // Prüfe, ob container existiert
            this.container.remove()
            // this.container = null; // Optional: Setze container auf null, wenn entfernt
        }

        return this.isVisible
    }

    // Aktualisiert die Statistiken
    update() {
        if (this.isVisible) {
            this.createOrUpdateStatisticsPanel()
        }
    }

    // Handler für das Ziehen des Panels
    makeDraggable(element, handle) {
        let offsetX = 0
        let offsetY = 0
        let isDragging = false

        const mouseDownHandler = (e) => {
            // Nur linke Maustaste behandeln
            if (e.button !== 0) return

            // Standard-Drag-Verhalten verhindern
            e.preventDefault()

            // Setze Dragging-Status
            isDragging = true

            // Berechne Offset zwischen Mausposition und Element-Ecke
            const rect = element.getBoundingClientRect()
            offsetX = e.clientX - rect.left
            offsetY = e.clientY - rect.top

            // Event-Listener für Mausbewegung und Loslassen
            document.addEventListener("mousemove", mouseMoveHandler)
            document.addEventListener("mouseup", mouseUpHandler)
        }

        const mouseMoveHandler = (e) => {
            if (!isDragging) return

            // Berechne neue Position
            const x = e.clientX - offsetX
            const y = e.clientY - offsetY

            // Aktualisiere Element-Position
            element.style.left = `${x}px`
            element.style.top = `${y}px`
        }

        const mouseUpHandler = () => {
            // In der StatisticsModule.js Klasse hinzufügen:

            isDragging = false

            // Position im localStorage speichern
            const rect = element.getBoundingClientRect()
            localStorage.setItem("a11y-map-statistics-x", rect.left)
            localStorage.setItem("a11y-map-statistics-y", rect.top)

            // Entferne Event-Listener
            document.removeEventListener("mousemove", mouseMoveHandler)
            document.removeEventListener("mouseup", mouseUpHandler)
        }

        // Füge Event-Listener zum Handle-Element hinzu
        handle.addEventListener("mousedown", mouseDownHandler)
    }
}
