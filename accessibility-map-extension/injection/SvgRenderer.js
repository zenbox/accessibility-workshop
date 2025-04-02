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
        
        this.focusableElements = null
        this.currentFocusIndex = -1
        
        // Speichere Elemente, deren Sichtbarkeitsstatus beobachtet wird
        this.observedElements = new Map()
        
        // Erstelle einen Mutation Observer, um Änderungen an den Displaystilen zu überwachen
        this.observer = new MutationObserver(mutations => {
            let needsRedraw = false
            
            mutations.forEach(mutation => {
                if (mutation.type === 'attributes' && 
                    (mutation.attributeName === 'style' || 
                     mutation.attributeName === 'class' || 
                     mutation.attributeName === 'hidden')) {
                    needsRedraw = true
                }
            })
            
            if (needsRedraw) {
                this.drawAllRectangles()
            }
        })
        
        // Bound event handler methods
        this._handleFocusIn = (e) => this.handleFocusChange(e.target)
        this._handleKeydown = (e) => {
            if (e.key === "Tab") {
                setTimeout(() => {
                    this.handleFocusChange(document.activeElement)
                }, 10)
            }
        }
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
        
        // Remove event listeners
        if (this.focusableElements) {
            document.removeEventListener("focusin", this._handleFocusIn)
            document.removeEventListener("keydown", this._handleKeydown)
        }
        
        if (this._focusListenerAdded) {
            document.removeEventListener("focusin", this._focusChangeListener)
            this._focusListenerAdded = false
        }
        
        // Disconnect MutationObserver
        if (this.observer) {
            this.observer.disconnect()
        }
        
        // Clear observed elements
        this.observedElements.clear()
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
                if (category === "Fokus") {
                    // Focus elements will be drawn at the end
                    continue
                }
                
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
                        // Prüfe, ob das Element versteckt ist
                        const isHidden = this.isElementHidden(element)
                        
                        // Überpringe Element, wenn es versteckt ist und der Versteckte-Elemente-Schalter ausgeschaltet ist
                        if (isHidden && !showHiddenElements) {
                            return
                        }
                        
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
                            // Position links für versteckte Elemente, rechts für sichtbare
                            const position = isHidden ? 'left' : 'right'
                            
                            this.drawRectangleForElement(
                                element,
                                color,
                                labelText,
                                position
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
        
        // Draw focus elements if enabled (at the end so they appear on top)
        if (this.colorMapping.Fokus && this.colorMapping.Fokus.enabled) {
            this.drawFocusableElements()
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

    // Überprüft, ob ein Element versteckt ist
    isElementHidden(element) {
        const style = window.getComputedStyle(element)
        
        // Prüfe auf häufige Gründe für versteckte Elemente
        if (style.display === 'none') return true
        if (style.visibility === 'hidden' || style.visibility === 'collapse') return true
        if (style.opacity === '0') return true
        if (element.hasAttribute('hidden')) return true
        
        // Prüfe auf Elemente mit keiner Höhe oder Breite
        const rect = element.getBoundingClientRect()
        if (rect.width === 0 || rect.height === 0) return true
        
        // Element scheint sichtbar zu sein
        return false
    }
    
    // Zeichne alle versteckten Elemente
    drawHiddenElements(color, position) {
        try {
            // Wähle alle Elemente im Dokument außer unserem UI
            const allElements = document.querySelectorAll(`*:not(#${this.ui.id} *):not(script):not(style):not(head)`)
            const hiddenElements = []
            
            // Filtere versteckte Elemente
            allElements.forEach(element => {
                if (this.isElementHidden(element)) {
                    // Prüfe, ob das Element wirklich ein Teil des Dokuments ist (kein SVG/MathML-Element)
                    if (element.namespaceURI === 'http://www.w3.org/1999/xhtml') {
                        hiddenElements.push(element)
                    }
                }
            })
            
            console.log(`[A11y-Map] ${hiddenElements.length} versteckte Elemente gefunden`)
            
            // Zeichne jedes versteckte Element
            hiddenElements.forEach(element => {
                // Verwende die Tag-Bezeichnung und ID/Klasse wenn vorhanden
                let labelText = element.tagName.toLowerCase()
                if (element.id) {
                    labelText += `#${element.id}`
                } else if (element.className && typeof element.className === 'string' && element.className.trim()) {
                    // Füge die erste Klasse hinzu, wenn vorhanden
                    const firstClass = element.className.trim().split(' ')[0]
                    labelText += `.${firstClass}`
                }
                
                this.drawRectangleForElement(element, color, labelText, position)
            })
        } catch (error) {
            console.error('[A11y-Map] Fehler beim Zeichnen versteckter Elemente:', error)
        }
    }
    
    // Draw a rectangle around an element with a label
    drawRectangleForElement(element, color, labelText, position = 'right') {
        const rect = element.getBoundingClientRect()
        const documentRightEdge = window.innerWidth + window.scrollX
        const documentLeftEdge = window.scrollX
        const labelPadding = 10
        
        // Prüfe, ob das Element versteckt ist
        const isHidden = this.isElementHidden(element)
        
        // Speichere den aktuellen Versteckstatus des Elements
        const elementId = element.getAttribute('id') || element.tagName + '_' + Math.random().toString(36).substr(2, 9)
        
        // Beobachte das Element für Änderungen in der Sichtbarkeit
        if (!this.observedElements.has(element)) {
            // Füge das Element zum Observer hinzu
            this.observer.observe(element, {
                attributes: true, 
                attributeFilter: ['style', 'class', 'hidden']
            })
            
            // Speichere Element und Status
            this.observedElements.set(element, isHidden)
        }
        
        // Wenn der Status sich geändert hat, aktualisiere ihn
        if (this.observedElements.get(element) !== isHidden) {
            this.observedElements.set(element, isHidden)
        }

        // Draw the rectangle around the element, mit 50% Deckkraft für versteckte Elemente
        const rectangle = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "rect"
        )
        rectangle.setAttribute("x", rect.left + window.scrollX)
        rectangle.setAttribute("y", rect.top + window.scrollY)
        rectangle.setAttribute("width", rect.width)
        rectangle.setAttribute("height", rect.height)
        rectangle.setAttribute("stroke", isHidden ? color.replace("0.85", "0.5") : color)
        rectangle.setAttribute("stroke-width", "2")
        rectangle.setAttribute("fill", "none")
        
        // Markiere versteckte Elemente mit einem transparenten Hintergrund
        if (isHidden) {
            rectangle.setAttribute("fill", color.replace("0.85", "0.1"))
            rectangle.setAttribute("stroke-dasharray", "5,3")
        }
        
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

        // Finde eine freie Position für das Label, abhängig von der Position
        let startX
        if (position === 'left') {
            startX = documentLeftEdge + labelPadding
        } else { // 'right' ist Standard
            startX = documentRightEdge - labelWidth - labelPadding
        }
        
        const freePosition = this.findFreeLabelPosition(
            startX,
            rect.top + window.scrollY,
            labelWidth,
            labelHeight,
            position
        )

        // Speichere die Position in der Liste der belegten Bereiche
        this.occupiedLabelAreas.push(freePosition)

        // Create background rectangle for the label, mit reduzierter Deckkraft für versteckte Elemente
        const labelBackground = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "rect"
        )
        labelBackground.setAttribute("x", freePosition.x)
        labelBackground.setAttribute("y", freePosition.y)
        labelBackground.setAttribute("width", freePosition.width)
        labelBackground.setAttribute("height", freePosition.height)
        
        // Anpassen der Farbe für versteckte Elemente
        if (isHidden) {
            // Für versteckte Elemente, zeige das Label mit 50% Deckkraft an
            labelBackground.setAttribute("fill", color.replace("0.85", "0.5"))
        } else {
            // Für sichtbare Elemente, normales Label
            labelBackground.setAttribute("fill", color)
        }
        
        this.svg.appendChild(labelBackground)

        // Add text to the label
        const textLabel = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "text"
        )
        
        // Passe die Position und Ausrichtung abhängig von der Positionierung (links oder rechts) an
        if (position === 'left') {
            textLabel.setAttribute("x", freePosition.x + 5)
            textLabel.setAttribute("y", freePosition.y + 15)
            textLabel.setAttribute("text-anchor", "start")
        } else {
            textLabel.setAttribute("x", freePosition.x + freePosition.width - 5)
            textLabel.setAttribute("y", freePosition.y + 15)
            textLabel.setAttribute("text-anchor", "end")
        }
        
        textLabel.setAttribute("fill", this.getContrastColor(color))
        textLabel.setAttribute("font-size", "12")
        
        // Füge Information über Sichtbarkeit dem Label hinzu
        if (isHidden) {
            textLabel.textContent = `${labelText} [versteckt]`
        } else {
            textLabel.textContent = labelText
        }
        this.svg.appendChild(textLabel)

        // Verbindungslinie vom Element zum Label zeichnen
        const elementCenterX = rect.left + rect.width / 2 + window.scrollX
        const elementCenterY = rect.top + rect.height / 2 + window.scrollY
        const labelCenterX = freePosition.x + freePosition.width / 2
        const labelCenterY = freePosition.y + freePosition.height / 2

        // Zeichne eine feine Verbindungslinie, mit Anpassung für versteckte Elemente
        const connectorLine = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "path"
        )

        // Curved connector line for improved visibility
        const midX = (elementCenterX + labelCenterX) / 2
        
        // Kurvenrichtung anpassen, je nachdem ob das Label links oder rechts ist
        if (position === 'left') {
            // Bei linksstehenden Labels, beginne die Kurve vom Element nach links
            connectorLine.setAttribute(
                "d",
                `M ${elementCenterX},${elementCenterY} Q ${elementCenterX - Math.abs(elementCenterX - labelCenterX)/3},${elementCenterY} ${labelCenterX},${labelCenterY}`
            )
        } else {
            // Bei rechtsstehenden Labels, beginne die Kurve vom Element nach rechts
            connectorLine.setAttribute(
                "d",
                `M ${elementCenterX},${elementCenterY} Q ${elementCenterX + Math.abs(elementCenterX - labelCenterX)/3},${elementCenterY} ${labelCenterX},${labelCenterY}`
            )
        }
        
        // Verwende reduzierte Deckkraft für versteckte Elemente
        if (isHidden) {
            connectorLine.setAttribute("stroke", color.replace("0.85", "0.5"))
        } else {
            connectorLine.setAttribute("stroke", color)
        }
        
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

        // Prüfe, ob das Element innerhalb eines vernünftigen Bereichs liegt
        // Verwende einen größeren Bereich (5x Viewport) um Off-Screen-Elemente zu berücksichtigen
        const viewportHeight = window.innerHeight
        const viewportWidth = window.innerWidth
        const maxDistance = Math.max(viewportWidth, viewportHeight) * 5
        
        // Prüfe nur auf extreme Ausreißer (z.B. Elemente mit falschen Koordinaten)
        if (
            Math.abs(startX) > maxDistance ||
            Math.abs(startY) > maxDistance ||
            Math.abs(endX) > maxDistance ||
            Math.abs(endY) > maxDistance
        ) {
            console.debug(
                "[A11y-Map] Element weit außerhalb des sichtbaren Bereichs - ignoriere Verbindung",
                {
                    start: { x: startX, y: startY, element: startElement.tagName },
                    end: { x: endX, y: endY, element: endElement.tagName }
                }
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
    findFreeLabelPosition(x, y, width, height, position = 'right') {
        const padding = 5 // Minimaler Abstand zwischen Rechtecken
        const rightEdge = window.innerWidth + window.scrollX
        const leftEdge = window.scrollX

        // Ursprünglicher Vorschlag basierend auf der Position (links oder rechts vom Viewport)
        let proposedRect = {
            x: position === 'left' ? leftEdge + padding : rightEdge - width - padding,
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
                x: position === 'left' ? leftEdge + padding : rightEdge - width - padding,
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
                x: position === 'left' ? leftEdge + padding : rightEdge - width - padding,
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

        // Wenn vertikal nicht funktioniert, versuche es mit einer horizontalen Verschiebung
        offset = (position === 'left') ? (width + padding * 2) : -(width + padding * 2)
        maxTries = 5

        while (maxTries > 0) {
            proposedRect = {
                x: position === 'left' 
                    ? leftEdge + padding + offset 
                    : rightEdge - width - padding + offset,
                y: y,
                width: width,
                height: height,
            }

            if (!this.isPositionOccupied(proposedRect)) {
                return proposedRect
            }

            offset = position === 'left' ? offset + width + padding : offset - width - padding
            maxTries--
        }

        // Wenn alles fehlschlägt, gib die ursprüngliche Position zurück
        // und füge sie trotzdem hinzu (besser Überlappung als gar keine Anzeige)
        return {
            x: position === 'left' ? leftEdge + padding : rightEdge - width - padding,
            y: y,
            width: width,
            height: height,
        }
    }
    
    // Handle focus change on elements
    handleFocusChange(element) {
        // Finde den neuen Index
        if (!this.focusableElements) {
            this.trackFocusableElements();
        }
        
        this.currentFocusIndex = this.focusableElements.indexOf(element)

        // Zeichne die fokussierbaren Elemente neu, um den aktuellen Fokus zu markieren
        if (this.colorMapping.Fokus && this.colorMapping.Fokus.enabled) {
            this.drawFocusableElements()
        }
    }
    
    // Gather all focusable elements
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
    
    // Draw all focusable elements and highlight the currently focused one
    drawFocusableElements() {
        try {
            console.log("[A11y-Map Focus] Starte Zeichnen fokussierbarer Elemente")

            // Prüfe, ob versteckte Elemente angezeigt werden sollen
            const hiddenToggle = this.colorMapping["Versteckte Elemente"]
            const showHiddenElements = hiddenToggle && hiddenToggle.enabled

            // Selektor für fokussierbare Elemente
            const selector = 'a[href], button, input, textarea, select, [tabindex]:not([tabindex="-1"])'

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
                // Prüfe, ob das Element versteckt ist
                const isHidden = this.isElementHidden(element)
                
                // Überpringe Element, wenn es versteckt ist und der Versteckte-Elemente-Schalter ausgeschaltet ist
                if (isHidden && !showHiddenElements) {
                    return
                }
                
                const rect = element.getBoundingClientRect()

                // Ignoriere Elemente mit Nullgröße (überschneidet sich mit isElementHidden, aber wir behalten es zur Sicherheit)
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
                    
                    // Füge Versteckt-Hinweis für versteckte Elemente hinzu
                    if (isHidden) {
                        tabIndexDisplay += " [versteckt]"
                    }
                    
                    // Bestimme die Position basierend auf Sichtbarkeit
                    const position = isHidden ? 'left' : 'right'
                    const documentLeftEdge = window.scrollX
                    const documentRightEdge = window.innerWidth + window.scrollX

                    // Erstelle ein Label für den TabIndex
                    const tabIndexLabel = document.createElementNS(
                        "http://www.w3.org/2000/svg",
                        "text"
                    )
                    
                    // Positionierung des Labels abhängig davon, ob es versteckt ist oder nicht
                    let labelX
                    if (position === 'left') {
                        // Für versteckte Elemente links positionieren
                        labelX = documentLeftEdge + 10
                        tabIndexLabel.setAttribute("text-anchor", "start")
                    } else {
                        // Für sichtbare Elemente normal rechts neben dem Element
                        labelX = rect.left + window.scrollX + 5
                        tabIndexLabel.setAttribute("text-anchor", "start")
                    }
                    
                    tabIndexLabel.setAttribute("x", labelX)
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
                    textBg.setAttribute("x", labelX - 2)
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
    
    // Draw a special highlight around an element with a warning label
    drawSpecialHighlight(element, color, message) {
        try {
            const rect = element.getBoundingClientRect()
            
            // Draw a dashed rectangle around the element with thicker stroke
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
            rectangle.setAttribute("stroke-dasharray", "5,3")
            rectangle.setAttribute("fill", "none")
            this.svg.appendChild(rectangle)
            
            // Add a warning label above the element
            const warningBackground = document.createElementNS(
                "http://www.w3.org/2000/svg",
                "rect"
            )
            const labelY = rect.top + window.scrollY - 20 // Position above the element
            warningBackground.setAttribute("x", rect.left + window.scrollX)
            warningBackground.setAttribute("y", labelY)
            warningBackground.setAttribute("width", 200)
            warningBackground.setAttribute("height", 16)
            warningBackground.setAttribute("fill", "rgba(255, 200, 0, 0.9)")
            warningBackground.setAttribute("rx", "3")
            warningBackground.setAttribute("ry", "3")
            this.svg.appendChild(warningBackground)
            
            // Add warning text
            const warningText = document.createElementNS(
                "http://www.w3.org/2000/svg",
                "text"
            )
            warningText.setAttribute("x", rect.left + window.scrollX + 4)
            warningText.setAttribute("y", labelY + 12)
            warningText.setAttribute("fill", "black")
            warningText.setAttribute("font-size", "10")
            warningText.setAttribute("font-weight", "bold")
            warningText.textContent = message || "Warnung: Spezielle Verbindung"
            this.svg.appendChild(warningText)
        } catch (error) {
            console.error("[A11y-Map] Fehler beim Zeichnen der speziellen Hervorhebung:", error)
        }
    }
}
