export class Ui {
    constructor(colorMapping, onToggle) {
        this.colorMapping = colorMapping
        this.onToggle = onToggle
        this.id = "a11y-map-controls-container"
        this.isDragging = false
        this.dragOffsetX = 0
        this.dragOffsetY = 0
        this.loadSavedSettings()
    }

    loadSavedSettings() {
        try {
            const savedSettings = localStorage.getItem("a11y-map-settings")
            if (savedSettings) {
                const settings = JSON.parse(savedSettings)

                // Wende gespeicherte Einstellungen auf das colorMapping an
                for (const category in this.colorMapping) {
                    if (settings[category] !== undefined) {
                        this.colorMapping[category].enabled = settings[category]
                    }
                }
                console.log(
                    "[A11y-Map] Saved settings loaded from localStorage"
                )
            }
        } catch (error) {
            console.error("[A11y-Map] Error loading saved settings:", error)
        }
    }

    saveSettings() {
        try {
            // Erstelle ein einfaches Objekt mit Kategorie -> enabled-Status
            const settings = {}
            for (const category in this.colorMapping) {
                settings[category] = this.colorMapping[category].enabled
            }

            // Speichere im localStorage
            localStorage.setItem("a11y-map-settings", JSON.stringify(settings))
            console.log("[A11y-Map] Settings saved to localStorage")
        } catch (error) {
            console.error("[A11y-Map] Error saving settings:", error)
        }
    }

    createSwitches() {
        // Remove existing controls if present
        const existingControls = document.getElementById(this.id)
        if (existingControls) {
            existingControls.remove()
        }

        const controlsDiv = document.createElement("div")
        controlsDiv.setAttribute("id", this.id)

        // Initial position (default or from localStorage)
        const savedX = localStorage.getItem("a11y-map-position-x")
        const savedY = localStorage.getItem("a11y-map-position-y")

        const initialPosition = {
            bottom: savedY ? null : "90px",
            right: savedX ? null : "10px",
            left: savedX ? `${savedX}px` : null,
            top: savedY ? `${savedY}px` : null,
        }

        controlsDiv.setAttribute(
            "style",
            `position:fixed; 
            ${initialPosition.top ? `top: ${initialPosition.top};` : ""} 
            ${
                initialPosition.bottom
                    ? `bottom: ${initialPosition.bottom};`
                    : ""
            } 
            ${initialPosition.left ? `left: ${initialPosition.left};` : ""} 
            ${initialPosition.right ? `right: ${initialPosition.right};` : ""} 
            padding:10px; 
            z-index:10000; 
            border-radius:8px; 
            background-color: rgba(0,0,0,0.7);
            cursor: move;`
        )
        document.body.appendChild(controlsDiv)

        // Add drag handle at the top
        const dragHandle = document.createElement("div")
        dragHandle.style.height = "20px"
        dragHandle.style.marginBottom = "10px"
        dragHandle.style.cursor = "move"
        dragHandle.style.background = "rgba(255,255,255,0.1)"
        dragHandle.style.borderRadius = "4px"
        dragHandle.style.display = "flex"
        dragHandle.style.justifyContent = "center"
        dragHandle.style.alignItems = "center"

        // Add grip icon to the drag handle
        const gripIcon = document.createElement("div")
        gripIcon.innerHTML = "⋮⋮" // Simple grip icon using text
        gripIcon.style.color = "rgba(255,255,255,0.5)"
        gripIcon.style.letterSpacing = "2px"
        dragHandle.appendChild(gripIcon)

        controlsDiv.appendChild(dragHandle)

        // Add title
        const title = document.createElement("h3")
        title.textContent = "Accessibility Map"
        title.style.color = "white"
        title.style.margin = "0 0 10px 0"
        title.style.fontSize = "14px"
        controlsDiv.appendChild(title)

        // NEU: Statistik-Button am Anfang hinzufügen
        const statsButtonContainer = document.createElement("div")
        statsButtonContainer.style.marginBottom = "15px"
        statsButtonContainer.style.display = "flex"
        statsButtonContainer.style.justifyContent = "center"

        const statsButton = document.createElement("button")
        statsButton.textContent = "Statistiken anzeigen"
        statsButton.style.padding = "5px 10px"
        statsButton.style.backgroundColor = "#4CAF50"
        statsButton.style.color = "white"
        statsButton.style.border = "none"
        statsButton.style.borderRadius = "4px"
        statsButton.style.cursor = "pointer"
        statsButton.style.fontSize = "12px"
        statsButton.style.width = "100%"

        statsButton.addEventListener("click", () => {
            // Trigger das StatisticsModule über ein Custom-Event
            document.dispatchEvent(
                new CustomEvent("a11y-map-toggle-statistics")
            )
        })

        statsButtonContainer.appendChild(statsButton)
        controlsDiv.appendChild(statsButtonContainer)

        // Implement drag functionality
        this.makeDraggable(controlsDiv, dragHandle)

        // Add switches for each category
        for (const category in this.colorMapping) {
            const switchContainer = document.createElement("div")
            switchContainer.setAttribute(
                "style",
                "margin-bottom:10px; display: flex; align-items: center;"
            )

            // Create the switch
            const switchInput = document.createElement("input")
            switchInput.setAttribute("type", "checkbox")
            switchInput.setAttribute(
                "id",
                `switch-${category.replace(/\s+/g, "-").toLowerCase()}`
            )
            switchInput.checked = this.colorMapping[category].enabled
            switchInput.style.opacity = "0"
            switchInput.style.width = "0"
            switchInput.style.height = "0"

            // Create the label (slider)
            const switchLabel = document.createElement("label")
            switchLabel.setAttribute("class", "switch")
            switchLabel.style.position = "relative"
            switchLabel.style.display = "inline-block"
            switchLabel.style.width = "30px"
            switchLabel.style.height = "17px"

            const sliderSpan = document.createElement("span")
            sliderSpan.style.position = "absolute"
            sliderSpan.style.cursor = "pointer"
            sliderSpan.style.top = "0"
            sliderSpan.style.left = "0"
            sliderSpan.style.right = "0"
            sliderSpan.style.bottom = "0"
            sliderSpan.style.backgroundColor = switchInput.checked
                ? "#2196F3"
                : "#ccc"
            sliderSpan.style.transition = "0.4s"
            sliderSpan.style.borderRadius = "17px"

            // Add the slider circle
            const sliderCircle = document.createElement("span")
            sliderCircle.style.position = "absolute"
            sliderCircle.style.content = ""
            sliderCircle.style.height = "13px"
            sliderCircle.style.width = "13px"
            sliderCircle.style.left = switchInput.checked ? "14px" : "2px"
            sliderCircle.style.bottom = "2px"
            sliderCircle.style.backgroundColor = "white"
            sliderCircle.style.transition = "0.4s"
            sliderCircle.style.borderRadius = "50%"
            sliderSpan.appendChild(sliderCircle)

            switchLabel.appendChild(switchInput)
            switchLabel.appendChild(sliderSpan)

            // Create a text label
            const textLabel = document.createElement("span")
            textLabel.style.marginLeft = "10px"
            textLabel.style.color = "white"
            textLabel.style.fontSize = "12px"
            textLabel.textContent = category

            switchContainer.appendChild(switchLabel)
            switchContainer.appendChild(textLabel)
            controlsDiv.appendChild(switchContainer)

            // Event listener for the switch
            switchInput.addEventListener("change", () => {
                this.colorMapping[category].enabled = switchInput.checked
                sliderSpan.style.backgroundColor = switchInput.checked
                    ? "#2196F3"
                    : "#ccc"
                sliderCircle.style.left = switchInput.checked ? "14px" : "2px"

                // Speichere Einstellungen bei jeder Änderung
                this.saveSettings()

                this.onToggle() // Call the callback to redraw
            })
        }

        // Nach den Kategorie-Schaltern, füge Kontrast-Filter-Steuerelemente hinzu, wenn die Kontrast-Kategorie existiert
        if (this.colorMapping.Contrasts) {
            const contrastControlsDiv = document.createElement("div")
            contrastControlsDiv.style.borderTop =
                "1px solid rgba(255, 255, 255, 0.3)"
            contrastControlsDiv.style.marginTop = "10px"
            contrastControlsDiv.style.paddingTop = "10px"

            // Erstelle Kontrast-Filter-Steuerelemente-Label
            const contrastLabel = document.createElement("div")
            contrastLabel.textContent = "Kontrast-Filter:"
            contrastLabel.style.color = "white"
            contrastLabel.style.fontSize = "12px"
            contrastLabel.style.marginBottom = "8px"
            contrastControlsDiv.appendChild(contrastLabel)

            // Erstelle Filterschaltflächen
            const filterButtons = [
                { id: "all", text: "Alle", active: true },
                { id: "fails", text: "Nur Fehler", active: false },
                { id: "succeeds", text: "Nur OK", active: false },
            ]

            const buttonContainer = document.createElement("div")
            buttonContainer.style.display = "flex"
            buttonContainer.style.justifyContent = "space-between"
            buttonContainer.style.marginBottom = "8px"

            filterButtons.forEach((btn) => {
                const button = document.createElement("button")
                button.textContent = btn.text
                button.id = `contrast-filter-${btn.id}`
                button.style.flex = "1"
                button.style.margin = "0 2px"
                button.style.padding = "4px"
                button.style.fontSize = "11px"
                button.style.backgroundColor = btn.active ? "#4285f4" : "#555"
                button.style.color = "white"
                button.style.border = "none"
                button.style.borderRadius = "3px"
                button.style.cursor = "pointer"

                button.addEventListener("click", () => {
                    // Deaktiviere alle Schaltflächen
                    filterButtons.forEach((b) => {
                        const el = document.getElementById(
                            `contrast-filter-${b.id}`
                        )
                        if (el) el.style.backgroundColor = "#555"
                    })

                    // Aktiviere diese Schaltfläche
                    button.style.backgroundColor = "#4285f4"

                    // Löse Ereignis für Filteränderung aus
                    document.dispatchEvent(
                        new CustomEvent("a11y-map-set-contrast-filter", {
                            detail: { mode: btn.id },
                        })
                    )
                })

                buttonContainer.appendChild(button)
            })

            contrastControlsDiv.appendChild(buttonContainer)

            // ++++++++
            // // Füge Trennlinie und den Kontrast-Picker-Schalter hinzu
            // const contrastPickerDiv = document.createElement("div")
            // contrastPickerDiv.style.borderTop =
            //     "1px solid rgba(255, 255, 255, 0.3)"
            // contrastPickerDiv.style.marginTop = "10px"
            // contrastPickerDiv.style.paddingTop = "10px"
            // contrastPickerDiv.style.marginBottom = "10px"

            // // Erstelle Kontrast-Picker-Label
            // const contrastPickerLabel = document.createElement("div")
            // contrastPickerLabel.textContent = "Kontrast-Tool:"
            // contrastPickerLabel.style.color = "white"
            // contrastPickerLabel.style.fontSize = "12px"
            // contrastPickerLabel.style.marginBottom = "8px"
            // contrastPickerDiv.appendChild(contrastPickerLabel)

            // // Schalter für Kontrast-Picker
            // const contrastPickerContainer = document.createElement("div")
            // contrastPickerContainer.setAttribute(
            //     "style",
            //     "margin-bottom:10px; display: flex; align-items: center;"
            // )

            // // Create the switch
            // const pickerSwitchInput = document.createElement("input")
            // pickerSwitchInput.setAttribute("type", "checkbox")
            // pickerSwitchInput.setAttribute("id", "switch-contrast-picker")
            // pickerSwitchInput.checked = false
            // pickerSwitchInput.style.opacity = "0"
            // pickerSwitchInput.style.width = "0"
            // pickerSwitchInput.style.height = "0"

            // // Create the label (slider)
            // const pickerSwitchLabel = document.createElement("label")
            // pickerSwitchLabel.setAttribute("class", "switch")
            // pickerSwitchLabel.style.position = "relative"
            // pickerSwitchLabel.style.display = "inline-block"
            // pickerSwitchLabel.style.width = "30px"
            // pickerSwitchLabel.style.height = "17px"

            // const pickerSliderSpan = document.createElement("span")
            // pickerSliderSpan.style.position = "absolute"
            // pickerSliderSpan.style.cursor = "pointer"
            // pickerSliderSpan.style.top = "0"
            // pickerSliderSpan.style.left = "0"
            // pickerSliderSpan.style.right = "0"
            // pickerSliderSpan.style.bottom = "0"
            // pickerSliderSpan.style.backgroundColor = "#ccc"
            // pickerSliderSpan.style.transition = "0.4s"
            // pickerSliderSpan.style.borderRadius = "17px"

            // // Add the slider circle
            // const pickerSliderCircle = document.createElement("span")
            // pickerSliderCircle.style.position = "absolute"
            // pickerSliderCircle.style.content = ""
            // pickerSliderCircle.style.height = "13px"
            // pickerSliderCircle.style.width = "13px"
            // pickerSliderCircle.style.left = "2px"
            // pickerSliderCircle.style.bottom = "2px"
            // pickerSliderCircle.style.backgroundColor = "white"
            // pickerSliderCircle.style.transition = "0.4s"
            // pickerSliderCircle.style.borderRadius = "50%"
            // pickerSliderSpan.appendChild(pickerSliderCircle)

            // pickerSwitchLabel.appendChild(pickerSwitchInput)
            // pickerSwitchLabel.appendChild(pickerSliderSpan)

            // // Create a text label
            // const pickerTextLabel = document.createElement("span")
            // pickerTextLabel.style.marginLeft = "10px"
            // pickerTextLabel.style.color = "white"
            // pickerTextLabel.style.fontSize = "12px"
            // pickerTextLabel.textContent = "Kontrast-Prüfung aktivieren"

            // contrastPickerContainer.appendChild(pickerSwitchLabel)
            // contrastPickerContainer.appendChild(pickerTextLabel)
            // contrastPickerDiv.appendChild(contrastPickerContainer)

            // // Event listener for the contrast picker switch
            // pickerSwitchInput.addEventListener("change", () => {
            //     // Toggle-Zustand des Kontrastpickers
            //     pickerSliderSpan.style.backgroundColor =
            //         pickerSwitchInput.checked ? "#2196F3" : "#ccc"
            //     pickerSliderCircle.style.left = pickerSwitchInput.checked
            //         ? "14px"
            //         : "2px"

            //     // Löse Ereignis für Kontrast-Picker aus
            //     document.dispatchEvent(
            //         new CustomEvent("a11y-map-toggle-contrast-picker", {
            //             detail: { active: pickerSwitchInput.checked },
            //         })
            //     )
            // })

            // controlsDiv.appendChild(contrastPickerDiv)
            // ++++++++

            // Erstelle Spaltenauswahl
            const columnLabel = document.createElement("div")
            columnLabel.textContent = "Spalten:"
            columnLabel.style.color = "white"
            columnLabel.style.fontSize = "12px"
            columnLabel.style.marginBottom = "6px"
            columnLabel.style.marginTop = "6px"
            contrastControlsDiv.appendChild(columnLabel)

            const columnContainer = document.createElement("div")
            columnContainer.style.display = "flex"
            columnContainer.style.justifyContent = "space-between"
            ;[1, 2, 3].forEach((cols) => {
                const colButton = document.createElement("button")
                colButton.textContent = cols.toString()
                colButton.style.flex = "1"
                colButton.style.margin = "0 2px"
                colButton.style.padding = "4px"
                colButton.style.fontSize = "11px"
                colButton.style.backgroundColor =
                    cols === 1 ? "#4285f4" : "#555"
                colButton.style.color = "white"
                colButton.style.border = "none"
                colButton.style.borderRadius = "3px"
                colButton.style.cursor = "pointer"

                colButton.addEventListener("click", () => {
                    // Deaktiviere alle Spalten-Schaltflächen
                    columnContainer.querySelectorAll("button").forEach((b) => {
                        b.style.backgroundColor = "#555"
                    })

                    // Aktiviere diese Schaltfläche
                    colButton.style.backgroundColor = "#4285f4"

                    // Löse Ereignis für Spaltenänderung aus
                    document.dispatchEvent(
                        new CustomEvent("a11y-map-set-contrast-columns", {
                            detail: { columns: cols },
                        })
                    )
                })

                columnContainer.appendChild(colButton)
            })

            contrastControlsDiv.appendChild(columnContainer)
            controlsDiv.appendChild(contrastControlsDiv)
        }

        // const resetContainer = document.createElement("div")
        // resetContainer.style.marginTop = "10px"
        // resetContainer.style.marginBottom = "10px"
        // resetContainer.style.borderTop = "1px solid rgba(255, 255, 255, 0.3)"
        // resetContainer.style.paddingTop = "10px"

        // const resetButton = document.createElement("button")
        // resetButton.textContent = "Reset Settings"
        // resetButton.style.padding = "5px 10px"
        // resetButton.style.backgroundColor = "#808080"
        // resetButton.style.color = "white"
        // resetButton.style.border = "none"
        // resetButton.style.borderRadius = "4px"
        // resetButton.style.cursor = "pointer"
        // resetButton.style.width = "100%"
        // resetButton.style.marginBottom = "10px"

        // resetButton.addEventListener("click", () => {
        //     // Entferne gespeicherte Einstellungen
        //     localStorage.removeItem("a11y-map-settings")

        //     // Reinitialisiere die UI
        //     document.dispatchEvent(new CustomEvent("a11y-map-reset-settings"))

        //     // Entferne die aktuelle UI und erstelle sie neu
        //     controlsDiv.remove()
        //     this.createSwitches()
        // })

        // controlsDiv.appendChild(resetContainer)
        // resetContainer.appendChild(resetButton)

        // Add close button
        const closeButton = document.createElement("button")
        closeButton.textContent = "Close"
        closeButton.style.padding = "5px 10px"
        closeButton.style.backgroundColor = "#f44336"
        closeButton.style.color = "white"
        closeButton.style.border = "none"
        closeButton.style.borderRadius = "4px"
        closeButton.style.cursor = "pointer"
        closeButton.style.marginTop = "10px"
        closeButton.style.width = "100%"

        closeButton.addEventListener("click", () => {
            document.dispatchEvent(
                new CustomEvent("deactivate-accessibility-map")
            )
            controlsDiv.remove()
        })

        controlsDiv.appendChild(closeButton)
    }

    makeDraggable(element, dragHandle) {
        const mouseDownHandler = (e) => {
            // Only handle left mouse button
            if (e.button !== 0) return

            // Prevent default drag behavior
            e.preventDefault()

            // Get the current mouse position
            this.isDragging = true

            // Calculate the offset of the mouse cursor from the element's top-left corner
            const rect = element.getBoundingClientRect()
            this.dragOffsetX = e.clientX - rect.left
            this.dragOffsetY = e.clientY - rect.top

            // Add event listeners for mouse move and up
            document.addEventListener("mousemove", mouseMoveHandler)
            document.addEventListener("mouseup", mouseUpHandler)
        }

        const mouseMoveHandler = (e) => {
            if (!this.isDragging) return

            // Calculate new position
            const x = e.clientX - this.dragOffsetX
            const y = e.clientY - this.dragOffsetY

            // Update element position
            element.style.left = `${x}px`
            element.style.top = `${y}px`
            element.style.right = "auto"
            element.style.bottom = "auto"
        }

        const mouseUpHandler = () => {
            if (!this.isDragging) return

            this.isDragging = false

            // Save position to localStorage
            const rect = element.getBoundingClientRect()
            localStorage.setItem("a11y-map-position-x", rect.left)
            localStorage.setItem("a11y-map-position-y", rect.top)

            // Remove event listeners
            document.removeEventListener("mousemove", mouseMoveHandler)
            document.removeEventListener("mouseup", mouseUpHandler)
        }

        // Attach the mousedown event to the drag handle
        dragHandle.addEventListener("mousedown", mouseDownHandler)

        // Double-click to reset position
        dragHandle.addEventListener("dblclick", () => {
            element.style.left = "auto"
            element.style.top = "auto"
            element.style.right = "10px"
            element.style.bottom = "90px"

            // Clear stored position
            localStorage.removeItem("a11y-map-position-x")
            localStorage.removeItem("a11y-map-position-y")
        })
    }
}
