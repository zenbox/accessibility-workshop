/**
 * FocusManager class - Handles focus movement and highlighting
 */
export default class FocusManager {
    constructor(simulation) {
        this.simulation = simulation
        this.focusableElements = this.getAllFocusableElements()
        this.currentIndex = -1
    }

    getAllFocusableElements() {
        // Get all potentially focusable elements
        return Array.from(
            document.querySelectorAll(
                'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"]), h1, h2, h3, h4, h5, h6, p, li, td, th, img, [role]'
            )
        ).filter((el) => {
            // Filter out hidden elements and elements in the overlay
            return (
                el.offsetParent !== null &&
                !this.simulation.overlayElement.contains(el)
            )
        })
    }

    setInitialFocus() {
        const firstElement = document.querySelector("h1")
        if (firstElement) {
            this.setFocus(firstElement)
            this.simulation.outputManager.speak("Seite geladen")
            this.announceElement(firstElement)
        }
    }

    setFocus(element) {
        // Remove focus from previous element
        if (this.simulation.focusedElement) {
            this.simulation.focusedElement.classList.remove("sr-focus")
        }

        // Set focus to new element
        this.simulation.focusedElement = element
        element.classList.add("sr-focus")

        // Update currentIndex für konsistente Navigation
        this.currentIndex = this.focusableElements.indexOf(element)

        // Scroll element into view if needed
        element.scrollIntoView({
            behavior: "smooth",
            block: "center",
        })
    }

    nextFocusableElement() {
        if (this.focusableElements.length === 0) return

        this.currentIndex =
            (this.currentIndex + 1) % this.focusableElements.length
        const nextElement = this.focusableElements[this.currentIndex]
        this.setFocus(nextElement)
        this.announceElement(nextElement)
    }

    prevFocusableElement() {
        if (this.focusableElements.length === 0) return

        this.currentIndex =
            (this.currentIndex - 1 + this.focusableElements.length) %
            this.focusableElements.length
        const prevElement = this.focusableElements[this.currentIndex]
        this.setFocus(prevElement)
        this.announceElement(prevElement)
    }

    /**
     * Navigiert zum nächsten oder vorherigen Element eines bestimmten Typs
     * @param {string} elementType - CSS-Selektor für den Elementtyp
     * @param {boolean} backwards - Nach rückwärts navigieren (true) oder vorwärts (false)
     */
    navigateByType(elementType, backwards = false) {
        const elements = Array.from(
            document.querySelectorAll(elementType)
        ).filter((el) => {
            return (
                el.offsetParent !== null &&
                !this.simulation.overlayElement.contains(el)
            )
        })

        if (elements.length === 0) {
            this.simulation.outputManager.speak(
                `Kein ${elementType} Element gefunden`,
                "info"
            )
            return
        }

        // Aktuelles Element finden
        const currentElement = this.simulation.focusedElement
        if (!currentElement) {
            // Falls kein Element fokussiert ist, erstes/letztes Element nutzen
            const targetElement = backwards
                ? elements[elements.length - 1]
                : elements[0]
            this.setFocus(targetElement)
            this.announceElement(targetElement)
            return
        }

        // Position des aktuellen Elements im Dokument ermitteln
        const currentPosition = this.getDocumentPosition(currentElement)

        // Elemente nach Position sortieren
        elements.sort((a, b) => {
            return this.getDocumentPosition(a) - this.getDocumentPosition(b)
        })

        // Nächstes/vorheriges Element im Vergleich zum aktuellen finden
        let targetElement = null

        if (backwards) {
            // Rückwärts navigieren: Alle Elemente vor dem aktuellen Element finden
            const previousElements = elements.filter(
                (el) => this.getDocumentPosition(el) < currentPosition
            )

            if (previousElements.length > 0) {
                // Das letzte Element vor dem aktuellen nehmen
                targetElement = previousElements[previousElements.length - 1]
            } else {
                // Wenn kein früheres Element existiert, zum letzten Element gehen (Umbruch)
                targetElement = elements[elements.length - 1]
            }
        } else {
            // Vorwärts navigieren: Alle Elemente nach dem aktuellen Element finden
            const nextElements = elements.filter(
                (el) => this.getDocumentPosition(el) > currentPosition
            )

            if (nextElements.length > 0) {
                // Das erste Element nach dem aktuellen nehmen
                targetElement = nextElements[0]
            } else {
                // Wenn kein späteres Element existiert, zum ersten Element gehen (Umbruch)
                targetElement = elements[0]
            }
        }

        // Fokus auf das gefundene Element setzen
        if (targetElement) {
            this.setFocus(targetElement)
            this.announceElement(targetElement)
        }
    }

    /**
     * Bestimmt die Position eines Elements im Dokument für Vergleiche
     * @param {Element} element - Das zu prüfende Element
     * @returns {number} - Eine Zahl, die die Position im Dokument repräsentiert
     */
    getDocumentPosition(element) {
        // Nutzung von getBoundingClientRect für präzise Positionsermittlung
        const rect = element.getBoundingClientRect()
        const scrollTop =
            window.pageYOffset || document.documentElement.scrollTop
        const scrollLeft =
            window.pageXOffset || document.documentElement.scrollLeft

        // Y-Position ist wichtiger (Multiplikation mit großem Faktor)
        // X-Position als Tie-Breaker für Elemente auf gleicher Höhe
        return (rect.top + scrollTop) * 10000 + (rect.left + scrollLeft)
    }

    announceElement(element) {
        // Check if element has children with different lang attributes
        if (element.hasChildNodes() && this.hasMultipleLanguages(element)) {
            this.announceMultiLanguageElement(element)
            return
        }

        // Regular element announcement
        let announcement = ""
        const tagName = element.tagName.toLowerCase()
        const role = element.getAttribute("role") || ""

        // Announce element type
        if (tagName === "a") {
            announcement = `Link, ${element.textContent.trim()}`
        } else if (tagName === "button") {
            announcement = `Schaltfläche, ${element.textContent.trim()}`
        } else if (tagName === "input") {
            const type = element.type || "text"
            const label = this.getInputLabel(element)
            announcement = `${type}-Eingabefeld, ${label}`
            if (element.value) {
                announcement += `, Wert ist ${element.value}`
            }
        } else if (tagName === "select") {
            const label = this.getInputLabel(element)
            const selectedOption = element.options[element.selectedIndex]
            announcement = `Auswahlfeld, ${label}, ausgewählt ist ${
                selectedOption ? selectedOption.text : "nichts"
            }`
        } else if (["h1", "h2", "h3", "h4", "h5", "h6"].includes(tagName)) {
            const level = tagName.substring(1)
            announcement = `Überschrift Ebene ${level}, ${element.textContent.trim()}`
        } else if (tagName === "p") {
            announcement = element.textContent.trim()
        } else if (tagName === "li") {
            // Find the parent list
            const parentList = element.closest("ul, ol")
            if (parentList) {
                const listItems = Array.from(parentList.querySelectorAll("li"))
                const index = listItems.indexOf(element) + 1
                const listType =
                    parentList.tagName.toLowerCase() === "ol"
                        ? "nummerierte Liste"
                        : "Liste"
                announcement = `${listType}, Element ${index} von ${
                    listItems.length
                }, ${element.textContent.trim()}`
            } else {
                announcement = element.textContent.trim()
            }
        } else if (tagName === "td" || tagName === "th") {
            // Table cell
            const table = element.closest("table")
            if (table) {
                const isHeader = tagName === "th"
                const row = element.closest("tr")
                const rows = Array.from(table.querySelectorAll("tr"))
                const rowIndex = rows.indexOf(row) + 1
                const cells = Array.from(row.querySelectorAll("td, th"))
                const colIndex = cells.indexOf(element) + 1

                // Find column header for this cell
                let colHeader = ""
                const headerRow = table.querySelector("thead tr")
                if (headerRow) {
                    const headerCells = Array.from(
                        headerRow.querySelectorAll("th")
                    )
                    if (colIndex <= headerCells.length) {
                        colHeader = headerCells[colIndex - 1].textContent.trim()
                    }
                }

                // Find row header for this cell
                let rowHeader = ""
                const firstCell = row.querySelector("th")
                if (firstCell && firstCell !== element) {
                    rowHeader = firstCell.textContent.trim()
                }

                if (isHeader) {
                    announcement = `Tabellenüberschrift, ${element.textContent.trim()}`
                } else {
                    announcement = `Tabellenzelle, Zeile ${rowIndex}, Spalte ${colIndex}`

                    if (colHeader) {
                        announcement += `, Spalte "${colHeader}"`
                    }

                    if (rowHeader) {
                        announcement += `, Zeile "${rowHeader}"`
                    }

                    announcement += `, ${element.textContent.trim()}`
                }
            } else {
                announcement = element.textContent.trim()
            }
        } else if (tagName === "img") {
            announcement = `Bild, ${
                element.getAttribute("alt") || "Kein Alternativtext"
            }`
            if (element.getAttribute("title")) {
                announcement += `, Titel: ${element.getAttribute("title")}`
            }
        } else if (tagName === "form") {
            announcement = `Formular, ${
                element.getAttribute("aria-label") ||
                element.getAttribute("name") ||
                ""
            }`
        } else if (tagName === "table") {
            const caption = element.querySelector("caption")
            announcement = `Tabelle, ${
                caption ? caption.textContent.trim() : ""
            }`
        } else if (role) {
            // Handle elements with roles
            const roleLabels = {
                button: "Schaltfläche",
                link: "Link",
                checkbox: "Checkbox",
                radio: "Radiobutton",
                combobox: "Auswahlfeld",
                tab: "Registerkarte",
                tabpanel: "Registerkartenbereich",
                menu: "Menü",
                menuitem: "Menüeintrag",
                dialog: "Dialog",
                alert: "Hinweis",
                progressbar: "Fortschrittsanzeige",
                slider: "Schieberegler",
                heading: "Überschrift",
                searchbox: "Suchfeld",
                region: "Region",
                banner: "Banner",
                navigation: "Navigation",
                main: "Hauptinhalt",
                complementary: "Ergänzender Inhalt",
                contentinfo: "Inhaltsinfo",
                form: "Formular",
            }

            const roleLabel = roleLabels[role] || role
            announcement = `${roleLabel}, ${element.textContent.trim()}`
        } else {
            announcement = element.textContent.trim()
        }

        // Add ARIA information if available
        if (element.getAttribute("aria-label")) {
            announcement = element.getAttribute("aria-label")
        }

        // ARIA-Labelledby processing
        if (element.getAttribute("aria-labelledby")) {
            const labelIds = element.getAttribute("aria-labelledby").split(" ")
            const labels = labelIds
                .map((id) => {
                    const labelElement = document.getElementById(id)
                    return labelElement ? labelElement.textContent.trim() : ""
                })
                .filter((text) => text)
                .join(", ")

            if (labels) {
                announcement = labels
            }
        }

        // Add additional description from aria-describedby
        if (element.getAttribute("aria-describedby")) {
            const descIds = element.getAttribute("aria-describedby").split(" ")
            const descriptions = descIds
                .map((id) => {
                    const descElement = document.getElementById(id)
                    return descElement ? descElement.textContent.trim() : ""
                })
                .filter((text) => text)
                .join(", ")

            if (descriptions) {
                announcement += `, ${descriptions}`
            }
        }

        // Announce required state for form elements
        if (
            element.required ||
            element.getAttribute("aria-required") === "true"
        ) {
            announcement += ", erforderlich"
        }

        // Announce disabled state for interactive elements
        if (
            element.disabled ||
            element.getAttribute("aria-disabled") === "true"
        ) {
            announcement += ", deaktiviert"
        }

        // Announce expanded state
        if (element.getAttribute("aria-expanded") === "true") {
            announcement += ", ausgeklappt"
        } else if (element.getAttribute("aria-expanded") === "false") {
            announcement += ", eingeklappt"
        }

        // Announce checked/selected state
        if (
            element.checked ||
            element.getAttribute("aria-checked") === "true" ||
            element.getAttribute("aria-selected") === "true"
        ) {
            announcement += ", ausgewählt"
        }

        // Announce readonly state
        if (
            element.readOnly ||
            element.getAttribute("aria-readonly") === "true"
        ) {
            announcement += ", schreibgeschützt"
        }

        // Get language information
        const elementLang = this.getElementLanguage(element)

        // Send text to OutputManager with language information
        this.simulation.outputManager.speak(announcement, "speech", elementLang)
    }

    announceMultiLanguageElement(element) {
        // Create a document fragment to work with
        const tempContainer = document.createElement("div")
        tempContainer.innerHTML = element.innerHTML

        // Process the content node by node
        this.processNodesForLanguage(element, this.getElementLanguage(element))
    }

    processNodesForLanguage(element, defaultLang) {
        // Clone the element to avoid modifying the original
        const clone = element.cloneNode(true)

        // Process each node
        this.processNodeTree(clone, defaultLang)
    }

    processNodeTree(node, defaultLang) {
        // Base case: text node - announce it with the current language
        if (node.nodeType === Node.TEXT_NODE) {
            const text = node.textContent.trim()
            if (text) {
                console.log(
                    "Processing text node:",
                    text,
                    "Language:",
                    defaultLang
                ) // Debug log
                this.simulation.outputManager.speak(text, "speech", defaultLang)
            }
            return
        }

        // Element node - check for lang attribute
        if (node.nodeType === Node.ELEMENT_NODE) {
            const nodeLang = node.getAttribute("lang") || defaultLang

            // If it's a block element or has a lang attribute, process its content
            if (this.isBlockElement(node) || node.hasAttribute("lang")) {
                // Process each child with this node's language
                Array.from(node.childNodes).forEach((child) => {
                    this.processNodeTree(child, nodeLang)
                })
            } else {
                // Just pass through to children with parent language
                Array.from(node.childNodes).forEach((child) => {
                    this.processNodeTree(child, defaultLang)
                })
            }
        }
    }

    getInputLabel(input) {
        // Try to find a label
        let label = ""

        // First check for aria-labelledby
        if (input.getAttribute("aria-labelledby")) {
            const labelId = input.getAttribute("aria-labelledby")
            const labelElement = document.getElementById(labelId)
            if (labelElement) {
                return labelElement.textContent.trim()
            }
        }

        // Then check for an associated label
        if (input.id) {
            const labelElement = document.querySelector(
                `label[for="${input.id}"]`
            )
            if (labelElement) {
                return labelElement.textContent.trim()
            }
        }

        // Check for a parent label
        const parentLabel = input.closest("label")
        if (parentLabel) {
            // Remove the input's text from the label
            let labelText = parentLabel.textContent.trim()
            return labelText
        }

        // Check for aria-label
        if (input.getAttribute("aria-label")) {
            return input.getAttribute("aria-label")
        }

        // If no label found, use placeholder or name
        return input.placeholder || input.name || "Unbenanntes Feld"
    }

    isBlockElement(node) {
        // Common block elements that would naturally create breaks in reading
        const blockElements = [
            "DIV",
            "P",
            "H1",
            "H2",
            "H3",
            "H4",
            "H5",
            "H6",
            "UL",
            "OL",
            "LI",
            "TABLE",
            "TR",
            "TD",
            "TH",
        ]
        return blockElements.includes(node.tagName)
    }

    hasMultipleLanguages(element) {
        // Check if any child elements have lang attributes
        const langElements = element.querySelectorAll("[lang]")
        return langElements.length > 0
    }

    /**
     * Navigiert zur nächsten oder vorherigen Landmarke
     * @param {string} landmarkType - Typ der Landmarke (main, nav, region, etc.)
     * @param {boolean} backwards - Rückwärts oder vorwärts navigieren
     */
    navigateToLandmark(landmarkType = "", backwards = false) {
        const landmarks = this.getLandmarks(landmarkType)

        if (landmarks.length === 0) {
            this.simulation.outputManager.speak(
                `Keine ${this.getLandmarkName(landmarkType)} gefunden`,
                "info"
            )
            return
        }

        // Position des aktuellen Elements
        const currentElement = this.simulation.focusedElement
        if (!currentElement) {
            // Wenn kein Element im Fokus, erstes/letztes Element verwenden
            const targetLandmark = backwards
                ? landmarks[landmarks.length - 1]
                : landmarks[0]
            this.setFocus(targetLandmark)
            this.announceElement(targetLandmark)
            return
        }

        const currentPosition = this.getDocumentPosition(currentElement)

        // Nach Position sortieren
        landmarks.sort((a, b) => {
            return this.getDocumentPosition(a) - this.getDocumentPosition(b)
        })

        // Nächste/vorherige Landmarke finden
        let targetLandmark = null

        if (backwards) {
            // Alle Landmarken vor der aktuellen Position
            const previousLandmarks = landmarks.filter(
                (lm) => this.getDocumentPosition(lm) < currentPosition
            )

            if (previousLandmarks.length > 0) {
                targetLandmark = previousLandmarks[previousLandmarks.length - 1]
            } else {
                // Umbruch zum Ende
                targetLandmark = landmarks[landmarks.length - 1]
            }
        } else {
            // Alle Landmarken nach der aktuellen Position
            const nextLandmarks = landmarks.filter(
                (lm) => this.getDocumentPosition(lm) > currentPosition
            )

            if (nextLandmarks.length > 0) {
                targetLandmark = nextLandmarks[0]
            } else {
                // Umbruch zum Anfang
                targetLandmark = landmarks[0]
            }
        }

        if (targetLandmark) {
            this.setFocus(targetLandmark)
            this.announceElement(targetLandmark)
        }
    }

    /**
     * Gibt alle Landmarken eines bestimmten Typs zurück
     * @param {string} type - Typ der Landmarke
     * @returns {Array} - Array mit Landmarken-Elementen
     */
    getLandmarks(type = "") {
        let selector = ""

        if (type === "main") {
            selector = "main, [role='main']"
        } else if (type === "nav") {
            selector = "nav, [role='navigation']"
        } else if (type === "region") {
            selector = "section, [role='region'], aside, [role='complementary']"
        } else if (type === "header") {
            selector = "header, [role='banner']"
        } else if (type === "footer") {
            selector = "footer, [role='contentinfo']"
        } else if (type === "form") {
            selector = "form, [role='form']"
        } else if (type === "search") {
            selector = "[role='search']"
        } else {
            // Alle Landmarken
            selector =
                "main, [role='main'], nav, [role='navigation'], section, [role='region'], aside, [role='complementary'], header, [role='banner'], footer, [role='contentinfo'], form, [role='form'], [role='search']"
        }

        return Array.from(document.querySelectorAll(selector)).filter((el) => {
            return (
                el.offsetParent !== null &&
                !this.simulation.overlayElement.contains(el)
            )
        })
    }

    /**
     * Gibt den Namen für einen Landmarkentyp zurück
     * @param {string} type - Landmarkentyp
     * @returns {string} - Deutscher Name für die Landmarke
     */
    getLandmarkName(type) {
        const names = {
            "main": "Hauptinhalt",
            "nav": "Navigation",
            "region": "Region",
            "header": "Kopfbereich",
            "footer": "Fußbereich",
            "form": "Formular",
            "search": "Suche",
            "": "Landmarke",
        }

        return names[type] || "Landmarke"
    }

    /**
     * Ermittelt die Sprache eines Elements
     * Berücksichtigt das lang-Attribut und erbt von Elternknoten
     * @param {Element} element - Das zu prüfende Element
     * @returns {string|null} - Sprachcode oder null
     */
    getElementLanguage(element) {
        // Prüfe das Element selbst auf lang-Attribut
        if (element.hasAttribute("lang")) {
            return element.getAttribute("lang")
        }

        // Prüfe HTML-Eltern nach lang-Attribut
        let parent = element.parentElement
        while (parent) {
            if (parent.hasAttribute("lang")) {
                return parent.getAttribute("lang")
            }
            parent = parent.parentElement
        }

        // Prüfe html-Element als Fallback
        const htmlElement = document.querySelector("html")
        if (htmlElement && htmlElement.hasAttribute("lang")) {
            return htmlElement.getAttribute("lang")
        }

        // Keine Sprachinfo gefunden
        return null
    }
}
