import { Ui } from "./Ui.js"
import { ColorAndContrast } from "./ColorAndContrast.js"

export class SvgRenderer {
    constructor(ui, colorAndContrast, colorMapping, occupiedYPositions = []) {
        this.ui = ui
        this.colorAndContrast = colorAndContrast
        this.colorMapping = colorMapping
        this.occupiedYPositions = occupiedYPositions
        this.contrastFilterMode = "all" // 'all', 'fails', 'succeeds'
        this.contrastColumnCount = 1 // Anzahl der Spalten für Kontrastanzeige

        this.focusableElements = null
        this.currentFocusIndex = -1
        
        // Bound event handler methods to prevent memory leaks when removing listeners
        this._handleFocusIn = this.handleFocusChange.bind(this)
        this._handleKeydown = (e) => {
            if (e.key === "Tab") {
                setTimeout(() => {
                    this.handleFocusChange(document.activeElement)
                }, 10)
            }
        }
        
        // Bound listener for focus changes
        this._focusChangeListener = () => {
            if (this.colorMapping.Fokus && this.colorMapping.Fokus.enabled) {
                this.drawAllRectangles()
            }
        }

        try {
            this.createSVGOverlay()

            // Nur wenn SVG erstellt wurde, UI initialisieren
            if (this.svg) {
                this.ui.createSwitches()
            } else {
                throw new Error("SVG element could not be created")
            }
        } catch (error) {
            console.error("[A11y-Map] Initialization error:", error)
        }

        // Höre auf Änderungen der Kontrastfilter
        document.addEventListener("a11y-map-set-contrast-filter", (e) => {
            this.contrastFilterMode = e.detail.mode
            if (
                this.colorMapping.Contrasts &&
                this.colorMapping.Contrasts.enabled
            ) {
                this.drawAllRectangles()
            }
        })

        // Höre auf Änderungen der Spaltenanzahl
        document.addEventListener("a11y-map-set-contrast-columns", (e) => {
            this.contrastColumnCount = e.detail.columns
            if (
                this.colorMapping.Contrasts &&
                this.colorMapping.Contrasts.enabled
            ) {
                this.drawAllRectangles()
            }
        })
    }

    // Clean up resources when deactivated
    cleanup() {
        if (this.svg) {
            this.svg.remove()
        }

        // Entferne die Fokus-Event-Listener, falls vorhanden
        if (this.focusableElements) {
            document.removeEventListener("focusin", this._handleFocusIn)
            document.removeEventListener("keydown", this._handleKeydown)
        }

        if (this._focusListenerAdded) {
            document.removeEventListener("focusin", this._focusChangeListener)
            this._focusListenerAdded = false
        }
    }

    // Create the SVG overlay
    createSVGOverlay() {
        try {
            const existingSvg = document.getElementById("a11y-map-svg-overlay")
            if (existingSvg) {
                existingSvg.remove()
            }

            this.svg = document.createElementNS(
                "http://www.w3.org/2000/svg",
                "svg"
            )
            if (!this.svg) {
                throw new Error("Failed to create SVG element")
            }

            this.svg.setAttribute("id", "a11y-map-svg-overlay")
            this.svg.style.position = "absolute"
            this.svg.style.top = "0"
            this.svg.style.left = "0"
            this.svg.style.width = "100%"
            this.svg.style.pointerEvents = "none"
            this.svg.style.zIndex = "9999"
            document.body.appendChild(this.svg)
        } catch (error) {
            console.error("[A11y-Map] Error creating SVG overlay:", error)
        }
    }

    // Clear the SVG element
    clearSVG() {
        if (!this.svg) {
            console.error("[A11y-Map] SVG element is not initialized")
            return
        }

        while (this.svg.firstChild) {
            this.svg.removeChild(this.svg.firstChild)
        }
    }

    // Draw all rectangles and lines based on the color mappings
    drawAllRectangles() {
        this.clearSVG()
        this.adjustSVGSize()

        let tabCounter = 1 // Counter for tab sequence

        // Prüfe, ob versteckte Elemente angezeigt werden sollen
        const hiddenToggle = this.colorMapping["Versteckte Elemente"]
        const showHiddenElements = hiddenToggle && hiddenToggle.enabled

        for (const category in this.colorMapping) {
            const { selectors, color, type, enabled, lines, showElement } =
                this.colorMapping[category]
                
            if (category === "Versteckte Elemente") {
                // Überspringe den Versteckte-Elemente-Schalter selbst
                continue
            }
                
            if (enabled) {
                if (type === "contrast") {
                    this.drawContrastIndicators()
                    continue
                }

                const processedSelectors = selectors
                    .split(",")
                    .map(
                        (selector) => `${selector.trim()}:not(#${this.ui.id} *)`
                    )
                    .join(",")

                try {
                    const elements =
                        document.querySelectorAll(processedSelectors)
                    elements.forEach((element) => {
                        let labelText = ""

                        if (type === "attribute") {
                            labelText = this.getAttributeText(element, category)
                        } else if (type === "mixed") {
                            const attributeText = this.getAttributeText(
                                element,
                                category
                            )

                            if (attributeText) {
                                labelText = attributeText
                            } else {
                                labelText = `<${element.tagName.toLowerCase()}>`
                            }
                        } else if (type === "element") {
                            labelText = `<${element.tagName.toLowerCase()}>`
                        } else if (category === "tabSequence") {
                            labelText = `Tab ${tabCounter++}`
                        }

                        if (labelText) {
                            this.drawRectangleForElement(
                                element,
                                color,
                                labelText
                            )
                        }

                        if (lines) {
                            const startSelectors = lines.start
                            let foundConnection = false

                            startSelectors.forEach((selector) => {
                                // Check if it's an attribute selector or element selector
                                if (
                                    selector.startsWith("[") &&
                                    selector.endsWith("]")
                                ) {
                                    // Attribute selector
                                    const startAttrValue = element.getAttribute(
                                        selector.slice(1, -1)
                                    )
                                    if (startAttrValue) {
                                        const endElement =
                                            document.getElementById(
                                                startAttrValue
                                            )
                                        if (endElement) {
                                            this.drawConnectionLine(
                                                element,
                                                endElement,
                                                color
                                            )
                                            foundConnection = true
                                        }
                                    }
                                } else {
                                    // Element selector
                                    const relatedElements =
                                        document.querySelectorAll(selector)
                                    relatedElements.forEach((endElement) => {
                                        this.drawConnectionLine(
                                            element,
                                            endElement,
                                            color
                                        )
                                        foundConnection = true
                                    })
                                }
                            })

                            if (!foundConnection) {
                                this.drawConnectionStartCircle(element, color)
                            }
                        }
                    })
                } catch (error) {
                    console.error(
                        `Error processing selector "${processedSelectors}":`,
                        error
                    )
                }
            }
        }

        if (this.colorMapping.Fokus && this.colorMapping.Fokus.enabled) {
            this.drawFocusableElements()
        }

        // +++++
        console.log(
            "[A11y-Map] Prüfe Fokus-Zustand:",
            this.colorMapping.Fokus
                ? "Fokus-Eintrag existiert"
                : "Kein Fokus-Eintrag",
            this.colorMapping.Fokus?.enabled ? "aktiviert" : "deaktiviert"
        )

        if (this.colorMapping.Fokus && this.colorMapping.Fokus.enabled) {
            console.log("[A11y-Map] Rufe drawFocusableElements() auf")
            this.drawFocusableElements()
        }
        // +++++
    }

    // Get attribute text for an element
    getAttributeText(element, category) {
        const selectors = this.colorMapping[category].selectors
            .split(",")
            .map((s) => s.trim().replace(/[\[\]]/g, ""))
        let attributeText = ""

        selectors.forEach((attributeName) => {
            const attributeValue = element.getAttribute(attributeName)
            if (attributeValue) {
                attributeText += `${attributeName}="${attributeValue}" `
            }
        })

        return attributeText.trim() || null
    }

    // Draw contrast indicators for all text elements
    drawContrastIndicators() {
        // Zurücksetzen der belegten Positionen für alle Spalten
        this.occupiedPositions = Array(this.contrastColumnCount)
            .fill()
            .map(() => [])

        // Berechne Spaltenbreite
        const viewportWidth = document.documentElement.clientWidth
        const columnWidth = viewportWidth / this.contrastColumnCount

        const textElements = document.querySelectorAll(
            `*:not(script):not(style):not(#${this.ui.id} *`
        )

        // Sammle zuerst alle Messungen, damit wir sie sortieren und filtern können
        const measurements = []

        textElements.forEach((element) => {
            if (element.childNodes.length === 0) return
            const hasTextNode = Array.from(element.childNodes).some(
                (node) =>
                    node.nodeType === Node.TEXT_NODE &&
                    node.textContent.trim() !== ""
            )
            if (!hasTextNode) return

            const rect = element.getBoundingClientRect()
            if (rect.width === 0 || rect.height === 0) return

            const computedStyle = window.getComputedStyle(element)
            const textColor = computedStyle.color
            let backgroundColor = computedStyle.backgroundColor

            let parentElement = element.parentElement
            while (backgroundColor === "rgba(0, 0, 0, 0)" && parentElement) {
                backgroundColor =
                    window.getComputedStyle(parentElement).backgroundColor
                parentElement = parentElement.parentElement
            }

            const contrastRatio = this.colorAndContrast.calculateContrastRatio(
                textColor,
                backgroundColor
            )

            const fontSizePx = parseFloat(computedStyle.fontSize)
            const fontSizePt = fontSizePx * (72 / 96)
            const isBold =
                computedStyle.fontWeight === "bold" ||
                parseInt(computedStyle.fontWeight) >= 700
            const isLargeText = fontSizePt >= 18 || (fontSizePt >= 14 && isBold)
            const minContrast = isLargeText ? 3.0 : 4.5
            const isContrastAcceptable = contrastRatio >= minContrast

            // Prüfe, ob diese Messung basierend auf dem Filtermodus einbezogen werden soll
            if (
                this.contrastFilterMode === "all" ||
                (this.contrastFilterMode === "fails" &&
                    !isContrastAcceptable) ||
                (this.contrastFilterMode === "succeeds" && isContrastAcceptable)
            ) {
                measurements.push({
                    element,
                    textColor,
                    backgroundColor,
                    contrastRatio,
                    isContrastAcceptable,
                    rect,
                })
            }
        })

        // Sortiere Messungen nach vertikaler Position für bessere visuelle Organisation
        measurements.sort((a, b) => a.rect.top - b.rect.top)

        // Jetzt zeichne Messungen in Spalten
        measurements.forEach((measurement, index) => {
            // Bestimme, welche Spalte für diese Messung verwendet werden soll
            const columnIndex = index % this.contrastColumnCount

            // Berechne x-Position basierend auf der Spalte
            const baseX =
                window.scrollX +
                viewportWidth -
                columnWidth * (this.contrastColumnCount - columnIndex - 0.5)

            this.drawContrastMeasurementInColumn(
                measurement.element,
                measurement.textColor,
                measurement.backgroundColor,
                measurement.contrastRatio.toFixed(2),
                measurement.isContrastAcceptable,
                columnIndex,
                baseX
            )
        })
    }

    // Modifizierte Version für Multi-Spalten-Unterstützung
    drawContrastMeasurementInColumn(
        element,
        textColor,
        bgColor,
        contrastRatio,
        isAcceptable,
        columnIndex,
        xPosition
    ) {
        const rect = element.getBoundingClientRect()
        const elementCenterX = rect.left + rect.width / 2 + window.scrollX
        const elementCenterY = rect.top + rect.height / 2 + window.scrollY

        // Verwende die angegebene x-Position für diese Spalte
        const rightEdgeX = xPosition

        // Finde eine freie y-Position in dieser Spalte
        let targetY = elementCenterY
        const minDistance = 20

        // Prüfe, ob diese y-Position in dieser Spalte bereits belegt ist
        const isYPositionOccupied = (y) => {
            return this.occupiedPositions[columnIndex].some(
                (occupiedY) => Math.abs(occupiedY - y) < minDistance
            )
        }

        while (isYPositionOccupied(targetY)) {
            targetY += minDistance
        }

        // Reserviere diese Position in der Spalte
        this.occupiedPositions[columnIndex].push(targetY)

        // Zeichne Verbindungslinie vom Element zur Messung
        this.drawLine(elementCenterX, elementCenterY, rightEdgeX, targetY)
        this.drawLine(
            elementCenterX,
            elementCenterY - 1,
            rightEdgeX,
            targetY - 1,
            "#fff8"
        )

        // Zeichne Farbquadrat für Hintergrundfarbe
        const squareSize = 14
        this.drawSquare(
            rightEdgeX - squareSize / 2,
            targetY - squareSize / 2,
            squareSize,
            bgColor
        )

        // Zeichne Kreis für Textfarbe
        this.drawCircle(rightEdgeX, targetY, textColor, true)

        // Zeichne Verhältnistext und Bestanden/Durchgefallen-Indikator
        this.drawText(
            `${contrastRatio} ${isAcceptable ? "✔" : "✘"}`,
            rightEdgeX - 10,
            targetY + 5
        )
    }

    // Überprüft, ob ein Element versteckt ist
    isElementHidden(element) {
        const style = window.getComputedStyle(element)
        
        // Prüfe auf häufige Gründe für versteckte Elemente
        if (style.display === 'none') return true
        if (style.visibility === 'hidden' || style.visibility === 'collapse') return true
        if (style.opacity === '0') return true
        if (element.hasAttribute('hidden')) return true
        if (element.getAttribute('aria-hidden') === 'true') return true
        
        // Prüfe auf Elemente mit keiner Höhe oder Breite
        const rect = element.getBoundingClientRect()
        if (rect.width === 0 || rect.height === 0) return true
        
        // Element scheint sichtbar zu sein
        return false
    }

    // Draw a rectangle around an element with a label
    drawRectangleForElement(element, color, labelText, position = 'right') {
        const rect = element.getBoundingClientRect()
        const documentRightEdge = window.innerWidth + window.scrollX
        const documentLeftEdge = window.scrollX
        const labelPadding = 10

        // Draw the rectangle around the element
        const rectangle = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "rect"
        )
        rectangle.setAttribute("x", rect.left + window.scrollX)
        rectangle.setAttribute("y", rect.top + window.scrollY)
        rectangle.setAttribute("width", rect.width)
        rectangle.setAttribute("height", rect.height)
        rectangle.setAttribute("stroke", color)
        rectangle.setAttribute("stroke-width", "2")
        rectangle.setAttribute("fill", "none")
        this.svg.appendChild(rectangle)

        // Measure the text width
        const tempText = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "text"
        )
        tempText.setAttribute("x", -9999)
        tempText.setAttribute("y", -9999)
        tempText.setAttribute("fill", color)
        tempText.setAttribute("font-size", "12")
        tempText.textContent = labelText
        this.svg.appendChild(tempText)

        const textWidth = tempText.getBBox().width + 10
        this.svg.removeChild(tempText)

        const labelWidth = textWidth
        const labelX = documentRightEdge - labelWidth - labelPadding
        const labelY = rect.top + window.scrollY

        // Create background rectangle for the label
        const labelBackground = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "rect"
        )
        labelBackground.setAttribute("x", labelX)
        labelBackground.setAttribute("y", labelY)
        labelBackground.setAttribute("width", labelWidth)
        labelBackground.setAttribute("height", "20")
        labelBackground.setAttribute("fill", color)
        this.svg.appendChild(labelBackground)

        // Add text to the label
        const textLabel = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "text"
        )
        textLabel.setAttribute("x", documentRightEdge - labelPadding - 5)
        textLabel.setAttribute("y", labelY + 15)
        textLabel.setAttribute("fill", "white")
        textLabel.setAttribute("font-size", "12")
        textLabel.setAttribute("text-anchor", "end")
        textLabel.textContent = labelText
        this.svg.appendChild(textLabel)
    }

    // Draw a connection line between two elements
    drawConnectionLine(startElement, endElement, color) {
        const startRect = startElement.getBoundingClientRect()
        const endRect = endElement.getBoundingClientRect()

        const startX = startRect.right + window.scrollX
        const startY = startRect.top + startRect.height / 2 + window.scrollY

        const endX = endRect.left + window.scrollX
        const endY = endRect.top + endRect.height / 2 + window.scrollY

        const path = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "path"
        )
        path.setAttribute(
            "d",
            `M ${startX},${startY} H ${(startX + endX) / 2} V ${endY} H ${endX}`
        )
        path.setAttribute("stroke", color)
        path.setAttribute("stroke-width", "2")
        path.setAttribute("fill", "none")
        this.svg.appendChild(path)

        this.drawCircle(startX, startY, color, false) // Unfilled start circle
        this.drawCircle(endX, endY, color, true) // Filled end circle
    }

    // Draw a starting connection circle for an element
    drawConnectionStartCircle(element, color) {
        const rect = element.getBoundingClientRect()
        const startX = rect.right + window.scrollX
        const startY = rect.top + rect.height / 2 + window.scrollY

        this.drawCircle(startX, startY, color, false) // Unfilled circle
    }

    // Draw a circle at specified coordinates
    drawCircle(cx, cy, color, filled) {
        const circle = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "circle"
        )
        circle.setAttribute("cx", cx)
        circle.setAttribute("cy", cy)
        circle.setAttribute("r", "5")
        circle.setAttribute("fill", filled ? color : "none")
        circle.setAttribute("stroke", color)
        circle.setAttribute("stroke-width", "2")
        this.svg.appendChild(circle)
    }

    // Adjust the SVG size to match document dimensions
    adjustSVGSize() {
        const documentHeight = Math.max(
            document.body.scrollHeight,
            document.documentElement.scrollHeight,
            document.body.offsetHeight,
            document.documentElement.offsetHeight,
            document.body.clientHeight,
            document.documentElement.clientHeight
        )
        const documentWidth = Math.max(
            document.body.scrollWidth,
            document.documentElement.scrollWidth,
            document.body.offsetWidth,
            document.documentElement.offsetWidth,
            document.body.clientWidth,
            document.documentElement.clientWidth
        )

        this.svg.setAttribute("width", documentWidth)
        this.svg.setAttribute("height", documentHeight)
    }

    // Draw a line between two points
    drawLine(x1, y1, x2, y2, color = "#0008") {
        const line = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "line"
        )
        line.setAttribute("x1", x1)
        line.setAttribute("y1", y1)
        line.setAttribute("x2", x2)
        line.setAttribute("y2", y2)
        line.setAttribute("stroke", color)
        line.setAttribute("stroke-width", "1")
        this.svg.appendChild(line)
    }

    // Draw a square at specified coordinates
    drawSquare(x, y, size, color) {
        const square = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "rect"
        )
        square.setAttribute("x", x)
        square.setAttribute("y", y)
        square.setAttribute("width", size)
        square.setAttribute("height", size)
        square.setAttribute("fill", color)
        square.setAttribute("stroke", "#0008")
        square.setAttribute("stroke-width", "1")
        this.svg.appendChild(square)
    }

    // Draw text at specified coordinates
    drawText(text, x, y) {
        const textLabel = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "text"
        )
        textLabel.setAttribute("x", x)
        textLabel.setAttribute("y", y)
        textLabel.setAttribute("fill", "black")
        textLabel.setAttribute("font-size", "12")
        textLabel.setAttribute("font-weight", "bold")
        textLabel.setAttribute("text-anchor", "end")
        textLabel.setAttribute("stroke", "white")
        textLabel.setAttribute("stroke-width", "1")
        textLabel.setAttribute("paint-order", "stroke fill")
        textLabel.textContent = text
        this.svg.appendChild(textLabel)
    }

    trackFocusableElements() {
        // Hole alle fokussierbaren Elemente
        const focusableElements = document.querySelectorAll(
            'a[href], button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
        )

        // Speichere fokussierbare Elemente in der Klasse
        this.focusableElements = Array.from(focusableElements)

        // Speichere den aktuell fokussierten Index
        this.currentFocusIndex = this.focusableElements.indexOf(
            document.activeElement
        )

        // Höre auf Fokus-Änderungen im Dokument
        document.addEventListener("focusin", this._handleFocusIn)

        // Bei Tab-Navigation den Fokus verfolgen
        document.addEventListener("keydown", this._handleKeydown)
    }

    handleFocusChange(element) {
        // Finde den neuen Index
        this.currentFocusIndex = this.focusableElements.indexOf(element)

        // Zeichne die fokussierbaren Elemente neu, um den aktuellen Fokus zu markieren
        if (this.colorMapping.Fokus && this.colorMapping.Fokus.enabled) {
            this.drawFocusableElements()
        }
    }

    // Fügen Sie diese Methode zur SvgRenderer-Klasse in SvgRenderer.js hinzu:
    drawFocusableElements() {
        try {
            console.log(
                "[A11y-Map Focus] Starte Zeichnen fokussierbarer Elemente"
            )

            // Selektor für fokussierbare Elemente
            const selector =
                'a[href], button, input, textarea, select, [tabindex]:not([tabindex="-1"])'

            // Direkt die Elemente abfragen
            const focusableElements = document.querySelectorAll(
                selector + `:not(#${this.ui.id} *)`
            )
            console.log(
                `[A11y-Map Focus] ${focusableElements.length} fokussierbare Elemente gefunden`
            )

            // Aktuelles fokussiertes Element
            const activeElement = document.activeElement
            console.log(
                "[A11y-Map Focus] Aktives Element:",
                activeElement.tagName,
                activeElement.id ? `#${activeElement.id}` : ""
            )

            // Farbe aus der Konfiguration holen
            const focusConfig = this.colorMapping.Fokus
            const baseColor = focusConfig.color || "hsla(280, 100%, 60%, 0.85)"

            // Jedes fokussierbare Element durchgehen
            Array.from(focusableElements).forEach((element, index) => {
                const rect = element.getBoundingClientRect()

                // Ignoriere nicht sichtbare Elemente
                if (rect.width === 0 || rect.height === 0) return

                const isFocused = element === activeElement
                const color = isFocused
                    ? baseColor
                    : baseColor.replace("0.85", "0.4")
                const strokeWidth = isFocused ? 3 : 1.5

                // Zeichne Rahmen um das Element
                const rectangle = document.createElementNS(
                    "http://www.w3.org/2000/svg",
                    "rect"
                )
                rectangle.setAttribute("x", rect.left + window.scrollX)
                rectangle.setAttribute("y", rect.top + window.scrollY)
                rectangle.setAttribute("width", rect.width)
                rectangle.setAttribute("height", rect.height)
                rectangle.setAttribute("stroke", color)
                rectangle.setAttribute("stroke-width", strokeWidth)
                rectangle.setAttribute("fill", "none")

                // Bei fokussiertem Element zusätzlich einen Hintergrund mit niedrigerer Deckkraft
                if (isFocused) {
                    rectangle.setAttribute(
                        "fill",
                        baseColor.replace("0.85", "0.15")
                    )
                    console.log(
                        `[A11y-Map Focus] Fokussiertes Element gefunden: ${
                            element.tagName
                        } an Position ${index + 1}`
                    )
                }

                this.svg.appendChild(rectangle)

                // Wenn TabIndex angezeigt werden soll
                if (focusConfig.showTabIndex) {
                    // Bestimme den tatsächlichen TabIndex
                    let tabIndexDisplay = index + 1

                    // Wenn das Element ein explizites tabindex-Attribut hat, verwende dieses
                    const explicitTabIndex = element.getAttribute("tabindex")
                    if (
                        explicitTabIndex !== null &&
                        explicitTabIndex !== "-1"
                    ) {
                        tabIndexDisplay = `${tabIndexDisplay} [${explicitTabIndex}]`
                    }

                    // Erstelle ein Label für den TabIndex
                    const tabIndexLabel = document.createElementNS(
                        "http://www.w3.org/2000/svg",
                        "text"
                    )
                    tabIndexLabel.setAttribute(
                        "x",
                        rect.left + window.scrollX + 5
                    )
                    tabIndexLabel.setAttribute(
                        "y",
                        rect.top + window.scrollY + 15
                    )
                    tabIndexLabel.setAttribute(
                        "fill",
                        isFocused ? baseColor : "#555"
                    )
                    tabIndexLabel.setAttribute("font-size", "11px")
                    tabIndexLabel.setAttribute(
                        "font-weight",
                        isFocused ? "bold" : "normal"
                    )
                    tabIndexLabel.textContent = `Tab: ${tabIndexDisplay}`

                    // Hintergrundfeld für bessere Lesbarkeit
                    const textBg = document.createElementNS(
                        "http://www.w3.org/2000/svg",
                        "rect"
                    )
                    textBg.setAttribute("x", rect.left + window.scrollX + 2)
                    textBg.setAttribute("y", rect.top + window.scrollY + 4)
                    textBg.setAttribute(
                        "width",
                        tabIndexLabel.textContent.length * 7
                    )
                    textBg.setAttribute("height", 14)
                    textBg.setAttribute("fill", "rgba(255, 255, 255, 0.85)")
                    textBg.setAttribute("rx", "2")
                    textBg.setAttribute("ry", "2")

                    this.svg.appendChild(textBg)
                    this.svg.appendChild(tabIndexLabel)
                }
            })

            // Event-Listener für Fokus-Änderungen
            if (!this._focusListenerAdded) {
                document.addEventListener("focusin", this._focusChangeListener)

                // Marker setzen, dass wir den Listener nur einmal hinzufügen
                this._focusListenerAdded = true
            }
        } catch (error) {
            console.error(
                "[A11y-Map Focus] Fehler beim Zeichnen fokussierbarer Elemente:",
                error
            )
        }
    }
}
