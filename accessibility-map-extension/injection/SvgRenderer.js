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
        this.occupiedLabelAreas = []

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
        this.occupiedLabelAreas = []

        this.clearSVG()
        this.adjustSVGSize()

        let tabCounter = 1 // Counter for tab sequence

        for (const category in this.colorMapping) {
            const { selectors, color, type, enabled, lines, showElement } =
                this.colorMapping[category]
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

                        // In SvgRenderer.js, aktualisiere den Block für die Verbindungen
                        if (lines) {
                            const startSelectors = lines.start
                            let foundConnection = false

                            startSelectors.forEach((selector) => {
                                try {
                                    // Check if it's an attribute selector or element selector
                                    if (
                                        selector.startsWith("[") &&
                                        selector.endsWith("]")
                                    ) {
                                        // Attribute selector
                                        const attrName = selector.slice(1, -1)
                                        const startAttrValue =
                                            element.getAttribute(attrName)

                                        if (startAttrValue) {
                                            // Verbesserte Fehlerbehandlung: Zeige eine ausführlichere Warnung
                                            console.log(
                                                `[A11y-Map] Suche Element mit ID: "${startAttrValue}" für ${attrName}`
                                            )

                                            // Versuche, das Ziel-Element zu finden
                                            const endElement =
                                                document.getElementById(
                                                    startAttrValue
                                                )

                                            if (endElement) {
                                                // Füge Debug-Ausgabe hinzu
                                                console.log(
                                                    `[A11y-Map] Gefunden! Zeichne Verbindung: ${element.tagName}[${attrName}="${startAttrValue}"] -> #${startAttrValue}`
                                                )

                                                // Prüfe, ob die Elemente sichtbar sind
                                                const startRect =
                                                    element.getBoundingClientRect()
                                                const endRect =
                                                    endElement.getBoundingClientRect()

                                                if (
                                                    startRect.width > 0 &&
                                                    startRect.height > 0 &&
                                                    endRect.width > 0 &&
                                                    endRect.height > 0
                                                ) {
                                                    this.drawConnectionLine(
                                                        element,
                                                        endElement,
                                                        color
                                                    )
                                                    foundConnection = true
                                                } else {
                                                    console.warn(
                                                        `[A11y-Map] Element mit ID '${startAttrValue}' oder Quellelement hat ungültige Größe:`,
                                                        {
                                                            start: [
                                                                startRect.width,
                                                                startRect.height,
                                                            ],
                                                            end: [
                                                                endRect.width,
                                                                endRect.height,
                                                            ],
                                                        }
                                                    )
                                                }
                                            } else {
                                                console.warn(
                                                    `[A11y-Map] Element mit ID '${startAttrValue}' nicht gefunden`
                                                )
                                            }
                                        }
                                    } else {
                                        // Element selector - rest of the code...
                                    }
                                } catch (err) {
                                    console.error(
                                        `[A11y-Map] Fehler beim Verarbeiten der Verbindung:`,
                                        err
                                    )
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

    // Draw contrast indicators for all text elementsIn der AccessibilityMap werden nach verschiednen Punkten, z.B. 1.3.1 Überschriften"
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

    // Allgemeine Farbkonvertierungsfunktion
    parseColor(color) {
        // Erstelle ein temporäres Element
        const tempElement = document.createElement("div")
        tempElement.style.color = color
        document.body.appendChild(tempElement)

        // Hole die berechnete Farbe, die immer im rgb/rgba-Format zurückgegeben wird
        const computedColor = window.getComputedStyle(tempElement).color
        document.body.removeChild(tempElement)

        // Extrahiere RGB-Werte
        const rgbMatch = computedColor.match(
            /rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/
        )
        if (!rgbMatch) return [0, 0, 0]

        const r = parseInt(rgbMatch[1], 10)
        const g = parseInt(rgbMatch[2], 10)
        const b = parseInt(rgbMatch[3], 10)

        return [r, g, b]
    }

    // Bestimme Textfarbe basierend auf Hintergrundfarbe
    getContrastColor(backgroundColor) {
        const rgb = this.parseColor(backgroundColor)

        // YIQ-Formel zur Helligkeitsberechnung
        const yiq = (rgb[0] * 299 + rgb[1] * 587 + rgb[2] * 114) / 1000

        // Debug-Ausgabe
        // console.log("Farbe:", backgroundColor, "RGB:", rgb, "YIQ:", yiq)

        return yiq >= 128 ? "#000" : "#fff"
    }

    // Draw a rectangle around an element with a label
    drawRectangleForElement(element, color, labelText) {
        const rect = element.getBoundingClientRect()
        const documentRightEdge = window.innerWidth + window.scrollX
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
        const labelHeight = 20

        // Finde eine freie Position für das Label
        const freePosition = this.findFreeLabelPosition(
            documentRightEdge - labelWidth - labelPadding,
            rect.top + window.scrollY,
            labelWidth,
            labelHeight
        )

        // Speichere die Position in der Liste der belegten Bereiche
        this.occupiedLabelAreas.push(freePosition)

        // Create background rectangle for the label
        const labelBackground = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "rect"
        )
        labelBackground.setAttribute("x", freePosition.x)
        labelBackground.setAttribute("y", freePosition.y)
        labelBackground.setAttribute("width", freePosition.width)
        labelBackground.setAttribute("height", freePosition.height)
        labelBackground.setAttribute("fill", color)
        this.svg.appendChild(labelBackground)

        // Add text to the label
        const textLabel = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "text"
        )
        textLabel.setAttribute("x", freePosition.x + freePosition.width - 5)
        textLabel.setAttribute("y", freePosition.y + 15)
        textLabel.setAttribute("fill", this.getContrastColor(color))
        textLabel.setAttribute("font-size", "12")
        textLabel.setAttribute("text-anchor", "end")
        textLabel.textContent = labelText
        this.svg.appendChild(textLabel)

        // Verbindungslinie vom Element zum Label zeichnen
        const elementCenterX = rect.left + rect.width / 2 + window.scrollX
        const elementCenterY = rect.top + rect.height / 2 + window.scrollY
        const labelCenterX = freePosition.x + freePosition.width / 2
        const labelCenterY = freePosition.y + freePosition.height / 2

        // Zeichne eine feine Verbindungslinie
        const connectorLine = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "path"
        )

        // Curved connector line for improved visibility
        const midX = (elementCenterX + labelCenterX) / 2
        connectorLine.setAttribute(
            "d",
            `M ${elementCenterX},${elementCenterY} Q ${midX},${elementCenterY} ${labelCenterX},${labelCenterY}`
        )
        connectorLine.setAttribute("stroke", color)
        connectorLine.setAttribute("stroke-width", "1")
        connectorLine.setAttribute("fill", "none")
        connectorLine.setAttribute("stroke-dasharray", "4,2")
        this.svg.appendChild(connectorLine)
    }

    // Draw a connection line between two elements
    drawConnectionLine(startElement, endElement, color) {
        const startRect = startElement.getBoundingClientRect()
        const endRect = endElement.getBoundingClientRect()

        // Verwende eine Mindestgröße, falls die berechnete Größe 0 ist
        const minSize = 5
        const effectiveStartWidth = Math.max(startRect.width, minSize)
        const effectiveStartHeight = Math.max(startRect.height, minSize)
        const effectiveEndWidth = Math.max(endRect.width, minSize)
        const effectiveEndHeight = Math.max(endRect.height, minSize)

        // Berechne die Mittelpunkte der Elemente
        const startX = startRect.left + effectiveStartWidth / 2 + window.scrollX
        const startY = startRect.top + effectiveStartHeight / 2 + window.scrollY
        const endX = endRect.left + effectiveEndWidth / 2 + window.scrollX
        const endY = endRect.top + effectiveEndHeight / 2 + window.scrollY

        // Prüfe, ob die berechneten Koordinaten gültig sind
        if (isNaN(startX) || isNaN(startY) || isNaN(endX) || isNaN(endY)) {
            console.warn(
                "[A11y-Map] Ungültige Koordinaten für Verbindungslinie:",
                { startX, startY, endX, endY }
            )
            return
        }

        if (
            startRect.width === 0 ||
            startRect.height === 0 ||
            endRect.width === 0 ||
            endRect.height === 0
        ) {
            // Zeichne eine besondere Markierung um das sichtbare Element
            if (startRect.width > 0 && startRect.height > 0) {
                this.drawSpecialHighlight(
                    startElement,
                    color,
                    "Verbunden mit verstecktem Element"
                )
            } else if (endRect.width > 0 && endRect.height > 0) {
                this.drawSpecialHighlight(
                    endElement,
                    color,
                    "Verbunden mit verstecktem Element"
                )
            }
            return
        }

        // Prüfe, ob das Element tatsächlich im sichtbaren Bereich liegt
        const viewportHeight = window.innerHeight
        const viewportWidth = window.innerWidth
        if (
            startX < 0 ||
            startX > viewportWidth * 2 ||
            startY < 0 ||
            startY > viewportHeight * 2 ||
            endX < 0 ||
            endX > viewportWidth * 2 ||
            endY < 0 ||
            endY > viewportHeight * 2
        ) {
            console.warn(
                "[A11y-Map] Element außerhalb des sichtbaren Bereichs:",
                { startX, startY, endX, endY }
            )
            return
        }

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

    // Prüft, ob ein Rechteck mit bereits existierenden Rechtecken kollidiert
    isPositionOccupied(rect) {
        return this.occupiedLabelAreas.some((occupied) =>
            this.rectIntersect(rect, occupied)
        )
    }

    // Prüft, ob zwei Rechtecke sich überschneiden
    rectIntersect(a, b) {
        return (
            a.x < b.x + b.width &&
            a.x + a.width > b.x &&
            a.y < b.y + b.height &&
            a.y + a.height > b.y
        )
    }

    // Finde eine freie Position für das Label-Rechteck
    findFreeLabelPosition(x, y, width, height) {
        const padding = 5 // Minimaler Abstand zwischen Rechtecken
        const rightEdge = window.innerWidth + window.scrollX

        // Ursprünglicher Vorschlag (rechts vom Viewport)
        let proposedRect = {
            x: rightEdge - width - padding,
            y: y,
            width: width,
            height: height,
        }

        // Prüfe, ob diese Position frei ist
        if (!this.isPositionOccupied(proposedRect)) {
            return proposedRect
        }

        // Versuche unterhalb der ursprünglichen Position
        let offset = height + padding
        let maxTries = 30 // Begrenzung der Versuche, um endlose Schleifen zu vermeiden

        while (maxTries > 0) {
            proposedRect = {
                x: rightEdge - width - padding,
                y: y + offset,
                width: width,
                height: height,
            }

            if (!this.isPositionOccupied(proposedRect)) {
                return proposedRect
            }

            offset += height + padding
            maxTries--
        }

        // Wenn unterhalb nicht funktioniert, versuche es mit einer Position darüber
        offset = -(height + padding)
        maxTries = 10

        while (maxTries > 0) {
            proposedRect = {
                x: rightEdge - width - padding,
                y: y + offset,
                width: width,
                height: height,
            }

            if (!this.isPositionOccupied(proposedRect)) {
                return proposedRect
            }

            offset -= height + padding
            maxTries--
        }

        // Wenn vertikal nicht funktioniert, versuche es mit einer Position links davon
        offset = -(width + padding * 2)
        maxTries = 5

        while (maxTries > 0) {
            proposedRect = {
                x: rightEdge - width - padding + offset,
                y: y,
                width: width,
                height: height,
            }

            if (!this.isPositionOccupied(proposedRect)) {
                return proposedRect
            }

            offset -= width + padding
            maxTries--
        }

        // Wenn alles fehlschlägt, gib die ursprüngliche Position zurück
        // und füge sie trotzdem hinzu (besser Überlappung als gar keine Anzeige)
        return {
            x: rightEdge - width - padding,
            y: y,
            width: width,
            height: height,
        }
    }
}
