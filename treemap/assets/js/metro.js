/**
 * Metro Map Maker Application
 * A SOLID Object-Oriented implementation without zoom functionality
 */
document.addEventListener("DOMContentLoaded", function () {
    /**
     * Model Classes
     */
    class Station {
        constructor(id, name, x, y) {
            this.id = id
            this.name = name
            this.x = x
            this.y = y
            this.connections = []
        }
    }

    class Line {
        constructor(id, station1, station2, color, name) {
            this.id = id
            this.station1 = station1
            this.station2 = station2
            this.color = color
            this.name = name
            this.route = null // Referenz zur Route
        }
    }

    /**
     * Line management class
     */
    class LineManager {
        constructor(app) {
            this.app = app
        }

        createLine(station1, station2, color, name) {
            const line = new Line(
                `line-${this.app.lineCounter++}`,
                station1,
                station2,
                color,
                name || `Line ${this.app.lineCounter - 1}`
            )
            this.app.lines.push(line)
            this.renderLine(line)
            this.app.storageManager.saveToStorage()
            return line
        }

        renderLine(line) {
            // Remove existing line if present
            const existingElement = document.getElementById(line.id)
            if (existingElement) {
                existingElement.remove()
            }

            // Create SVG line element
            const lineElement = document.createElementNS(
                "http://www.w3.org/2000/svg",
                "line"
            )
            lineElement.classList.add("metro-line")
            lineElement.id = line.id
            lineElement.dataset.id = line.id

            // Set line attributes
            lineElement.setAttribute("x1", line.station1.x)
            lineElement.setAttribute("y1", line.station1.y)
            lineElement.setAttribute("x2", line.station2.x)
            lineElement.setAttribute("y2", line.station2.y)
            lineElement.setAttribute("stroke", line.color)
            lineElement.setAttribute("stroke-width", "4")
            lineElement.setAttribute("stroke-linecap", "round")

            // Insert before stations so lines appear behind stations
            const firstStation =
                this.app.canvasManager.canvas.querySelector(".station")
            if (firstStation) {
                this.app.canvasManager.canvas.insertBefore(
                    lineElement,
                    firstStation
                )
            } else {
                this.app.canvasManager.canvas.appendChild(lineElement)
            }

            return lineElement
        }

        deleteLine(line) {
            // Remove from lines array
            const index = this.app.lines.indexOf(line)
            if (index !== -1) {
                this.app.lines.splice(index, 1)
            }

            // Remove from DOM
            const lineElement = document.getElementById(line.id)
            if (lineElement) {
                lineElement.remove()
            }

            this.app.storageManager.saveToStorage()
        }

        updateConnectedLines(station) {
            // Find and update all lines connected to this station
            const connectedLines = this.app.lines.filter(
                (line) =>
                    line.station1.id === station.id ||
                    line.station2.id === station.id
            )

            connectedLines.forEach((line) => {
                const lineElement = document.getElementById(line.id)
                if (lineElement) {
                    lineElement.setAttribute("x1", line.station1.x)
                    lineElement.setAttribute("y1", line.station1.y)
                    lineElement.setAttribute("x2", line.station2.x)
                    lineElement.setAttribute("y2", line.station2.y)
                }
            })
        }

        getLineById(id) {
            return this.app.lines.find((line) => line.id === id)
        }
    }

    /**
     * Route management class
     */
    class RouteManager {
        constructor(app) {
            this.app = app
        }

        getRoutesForStation(station) {
            // Return routes that include this station
            return this.app.routes.filter((route) => {
                if (!route.stations) return false
                return route.stations.some((s) => s.id === station.id)
            })
        }

        createRoute(name, color, stations = []) {
            const route = {
                id: `route-${this.app.routes.length + 1}`,
                name: name,
                color: color,
                stations: stations,
            }

            this.app.routes.push(route)
            this.app.storageManager.saveToStorage()
            return route
        }

        deleteRoute(route) {
            const index = this.app.routes.indexOf(route)
            if (index !== -1) {
                this.app.routes.splice(index, 1)
            }
            this.app.storageManager.saveToStorage()
        }

        addStationToRoute(route, station) {
            if (!route.stations) {
                route.stations = []
            }
            if (!route.stations.some((s) => s.id === station.id)) {
                route.stations.push(station)
                this.app.storageManager.saveToStorage()
            }
        }

        removeStationFromRoute(route, station) {
            if (route.stations) {
                const index = route.stations.findIndex(
                    (s) => s.id === station.id
                )
                if (index !== -1) {
                    route.stations.splice(index, 1)
                    this.app.storageManager.saveToStorage()
                }
            }
        }
    }

    /**
     * Selection management class
     */
    class SelectionManager {
        constructor(app) {
            this.app = app
            this.isShiftActive = false
        }

        selectStation(station) {
            if (!this.app.selectedStations.includes(station)) {
                if (!this.isShiftActive) {
                    this.clearSelection()
                }
                this.app.selectedStations.push(station)
                this.updateStationVisuals(station, true)
            }
        }

        deselectStation(station) {
            const index = this.app.selectedStations.indexOf(station)
            if (index !== -1) {
                this.app.selectedStations.splice(index, 1)
                this.updateStationVisuals(station, false)
            }
        }

        clearSelection() {
            // Remove visual selection from all currently selected stations
            this.app.selectedStations.forEach((station) => {
                this.updateStationVisuals(station, false)
            })
            this.app.selectedStations = []
        }

        toggleShift(active) {
            this.isShiftActive = active
        }

        deleteSelected() {
            if (this.app.selectedStations.length === 0) return

            const selectedStations = [...this.app.selectedStations]
            const confirmDelete = confirm(
                `Möchten Sie ${selectedStations.length} ausgewählte Station(en) löschen?`
            )

            if (confirmDelete) {
                selectedStations.forEach((station) => {
                    this.app.stationManager.deleteStation(station)
                })
                this.clearSelection()
            }
        }

        updateStationVisuals(station, isSelected) {
            const stationElement = document.getElementById(station.id)
            if (stationElement) {
                if (isSelected) {
                    stationElement.classList.add("selected")
                } else {
                    stationElement.classList.remove("selected")
                }
            }
        }

        isStationSelected(station) {
            return this.app.selectedStations.includes(station)
        }

        getSelectedStations() {
            return [...this.app.selectedStations]
        }
    }

    /**
     * Main application class
     */
    class MetroApp {
        constructor() {
            // Daten-Arrays
            this.stations = []
            this.lines = []
            this.routes = []
            this.stationGroups = []
            this.selectedStations = []
            this.stationCounter = 1
            this.lineCounter = 1
            this.lineColors = [
                "#FF0000",
                "#00AA00",
                "#0000FF",
                "#FFA500",
                "#800080",
                "#00FFFF",
                "#FF00FF",
                "#FFFF00",
                "#964B00",
                "#808080",
            ]

            // Manager initialisieren
            this.canvasManager = new CanvasManager(this)
            this.stationManager = new StationManager(this)
            this.lineManager = new LineManager(this)
            this.routeManager = new RouteManager(this)
            this.selectionManager = new SelectionManager(this)
            this.storageManager = new StorageManager(this)
            this.uiManager = new UIManager(this)
            this.eventManager = new EventManager(this)
            this.stationListManager = new StationListManager(this)
            this.importManager = new ImportManager(this) // NEU

            this.init()
        }

        init() {
            try {
                console.log("🚀 Initialisiere MetroApp...")

                this.canvasManager.init()
                this.uiManager.init()
                this.eventManager.init()
                this.stationListManager.init()

                // WICHTIG: Daten VOR der Canvas-Transformation laden
                console.log("📦 Lade gespeicherte Daten...")
                this.storageManager.loadFromStorage()

                // Canvas-Transformation NACH dem Laden der Daten
                this.canvasManager.updateCanvasTransform()

                // Initiale Prüfung der Sammlungen
                setTimeout(() => {
                    const collections = this.storageManager.getCollections()
                    if (collections) {
                        this.storageManager.updateImportButtonState(
                            Object.keys(collections).length > 0
                        )
                        console.log(
                            "📋 Sammlungen beim Start gefunden:",
                            Object.keys(collections)
                        )
                    }

                    // Debug-Ausgabe der geladenen Daten
                    console.log("🔍 Geladene App-Daten:")
                    console.log(`  • Stationen: ${this.stations.length}`)
                    console.log(`  • Linien: ${this.lines.length}`)
                    console.log(`  • Routen: ${this.routes.length}`)
                }, 500)

                console.log("✅ MetroApp erfolgreich initialisiert")
            } catch (error) {
                console.error(
                    "❌ Fehler beim Initialisieren der MetroApp:",
                    error
                )
            }
        }

        // Reset the entire application state
        reset() {
            this.stations = []
            this.lines = []
            this.routes = []
            this.stationGroups = []
            this.selectedStations = []
            this.stationCounter = 1
            this.lineCounter = 1

            // Clear canvas
            this.canvasManager.clearCanvas()

            // Reset view
            this.canvasManager.resetView()

            // Clear storage - KORRIGIERT: Prüfe ob Methode existiert
            if (
                this.storageManager &&
                typeof this.storageManager.clearStorage === "function"
            ) {
                this.storageManager.clearStorage()
            } else {
                console.warn("⚠️ clearStorage-Methode nicht verfügbar")
            }

            // Update station list
            this.stationListManager.updateStationList()

            console.log("Application reset complete")
        }
    }

    /**
     * Canvas management class
     */
    class CanvasManager {
        constructor(app) {
            this.app = app
            this.canvas = document.getElementById("canvas")
            // Fixed scale = 1, no zooming
            this.offsetX = 0
            this.offsetY = 0
            this.isDragging = false
            this.lastPanX = 0
            this.lastPanY = 0
            this.CANVAS_WIDTH = 1000
            this.CANVAS_HEIGHT = 1000
        }

        init() {
            this.resetView()
        }

        resetView() {
            this.offsetX = (window.innerWidth - this.CANVAS_WIDTH) / 2
            this.offsetY = (window.innerHeight - this.CANVAS_HEIGHT) / 2

            // Ensure canvas is visible in viewport
            this.offsetX = Math.min(
                0,
                Math.max(this.offsetX, window.innerWidth - this.CANVAS_WIDTH)
            )
            this.offsetY = Math.min(
                0,
                Math.max(this.offsetY, window.innerHeight - this.CANVAS_HEIGHT)
            )

            this.updateCanvasTransform()
        }

        updateCanvasTransform() {
            // No scale, only translate
            this.canvas.style.transform = `translate(${this.offsetX}px, ${this.offsetY}px)`
        }

        clearCanvas() {
            while (this.canvas.firstChild) {
                this.canvas.removeChild(this.canvas.firstChild)
            }
        }

        screenToCanvasCoords(clientX, clientY) {
            const rect = this.canvas.getBoundingClientRect()

            // Simplified coordinate conversion without scaling
            return {
                x: clientX - rect.left,
                y: clientY - rect.top,
            }
        }

        constrainToCanvas(x, y) {
            return {
                x: Math.max(0, Math.min(this.CANVAS_WIDTH, x)),
                y: Math.max(0, Math.min(this.CANVAS_HEIGHT, y)),
            }
        }

        startPan(x, y) {
            this.isDragging = true
            this.lastPanX = x
            this.lastPanY = y
            this.canvas.style.cursor = "grabbing"
        }

        pan(x, y) {
            if (this.isDragging) {
                const dx = x - this.lastPanX
                const dy = y - this.lastPanY

                this.offsetX += dx
                this.offsetY += dy

                this.lastPanX = x
                this.lastPanY = y

                this.updateCanvasTransform()
            }
        }

        endPan() {
            this.isDragging = false
            this.canvas.style.cursor = "default"
        }

        centerViewOn(x, y) {
            const canvasRect = this.canvas.parentElement.getBoundingClientRect()
            this.offsetX = canvasRect.width / 2 - x
            this.offsetY = canvasRect.height / 2 - y
            this.updateCanvasTransform()
        }
    }

    /**
     * Station management class
     */
    class StationManager {
        constructor(app) {
            this.app = app
        }

        createStation(x, y) {
            // Constrain coordinates to canvas bounds
            const constrained = this.app.canvasManager.constrainToCanvas(x, y)

            // Check if station is on an existing line
            const intersectingLine = this.findIntersectingLine(
                constrained.x,
                constrained.y
            )

            // Create new station object
            const station = new Station(
                `station-${this.app.stationCounter++}`,
                `Station ${this.app.stationCounter - 1}`,
                constrained.x,
                constrained.y
            )

            // Add to stations array
            this.app.stations.push(station)

            // Render the station
            this.renderStation(station)

            // If station is on a line, connect it
            if (intersectingLine) {
                this.connectStationToLine(station, intersectingLine)
            }

            // Save changes
            this.app.storageManager.saveToStorage()

            // Update station list
            this.app.stationListManager.updateStationList()

            return station
        }

        // Find if a point intersects with any line
        findIntersectingLine(x, y) {
            const threshold = 5 // Distance tolerance in pixels

            for (const line of this.app.lines) {
                // Get line endpoints
                const x1 = line.station1.x
                const y1 = line.station1.y
                const x2 = line.station2.x
                const y2 = line.station2.y

                // Calculate distance from point to line segment
                const distance = this.distanceToLineSegment(
                    x1,
                    y1,
                    x2,
                    y2,
                    x,
                    y
                )

                if (distance <= threshold) {
                    return line
                }
            }

            return null
        }

        // Calculate distance from point to line segment
        distanceToLineSegment(x1, y1, x2, y2, px, py) {
            // Calculate line length squared
            const lengthSq = (x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1)

            if (lengthSq === 0) {
                // Line segment is a point
                return Math.sqrt((px - x1) * (px - x1) + (py - y1) * (py - y1))
            }

            // Calculate projection factor
            let t = ((px - x1) * (x2 - x1) + (py - y1) * (y2 - y1)) / lengthSq
            t = Math.max(0, Math.min(1, t))

            // Calculate closest point on line segment
            const projX = x1 + t * (x2 - x1)
            const projY = y1 + t * (y2 - y1)

            // Calculate distance to closest point
            return Math.sqrt(
                (px - projX) * (px - projX) + (py - projY) * (py - projY)
            )
        }

        // Connect a station to an intersecting line
        connectStationToLine(station, line) {
            // Create two new lines to replace the original
            const station1 = line.station1
            const station2 = line.station2
            const color = line.color
            const linePrefix = line.name.split(" ")[0] // Get "Line" part of the name

            // Delete the original line
            this.app.lineManager.deleteLine(line)

            // Create two new lines
            const line1 = this.app.lineManager.createLine(
                station1,
                station,
                color,
                `${linePrefix} ${this.app.lineCounter - 1}a`
            )
            const line2 = this.app.lineManager.createLine(
                station,
                station2,
                color,
                `${linePrefix} ${this.app.lineCounter - 1}b`
            )

            // Highlight the new station to show it was added to a line
            const stationElement = document.getElementById(station.id)
            if (stationElement) {
                stationElement.classList.add("line-connected")
                setTimeout(() => {
                    stationElement.classList.remove("line-connected")
                }, 1500)
            }
        }

        renderStation(station) {
            // Remove existing station if present
            const existingElement = document.getElementById(station.id)
            if (existingElement) {
                existingElement.remove()
            }

            // Create station SVG element
            const stationElement = document.createElementNS(
                "http://www.w3.org/2000/svg",
                "g"
            )
            stationElement.classList.add("station")
            stationElement.id = station.id
            stationElement.dataset.id = station.id

            // Circle for the station
            const circle = document.createElementNS(
                "http://www.w3.org/2000/svg",
                "circle"
            )
            circle.setAttribute("cx", 0)
            circle.setAttribute("cy", 0)
            circle.setAttribute("r", 8)

            // Text for station name
            const text = document.createElementNS(
                "http://www.w3.org/2000/svg",
                "text"
            )
            text.classList.add("station-name")
            text.setAttribute("y", 22)
            text.textContent = station.name

            // Add elements to the station
            stationElement.appendChild(circle)
            stationElement.appendChild(text)
            stationElement.setAttribute(
                "transform",
                `translate(${station.x}, ${station.y})`
            )

            this.app.canvasManager.canvas.appendChild(stationElement)

            return stationElement
        }

        updateStationPosition(station, newX, newY) {
            const group = this.findStationGroup(station.id)

            // Wenn die Station Teil einer Gruppe ist, die ganze Gruppe bewegen
            if (group) {
                this.moveStationGroup(station, newX, newY)
                return // Wichtig: Hier den Rest der Methode nicht mehr ausführen
            }

            // Ab hier nur für einzelne Stationen, nicht für Gruppenmitglieder
            // Update station coordinates
            station.x = newX
            station.y = newY

            // Update station element
            const stationElement = document.getElementById(station.id)
            if (stationElement) {
                stationElement.setAttribute(
                    "transform",
                    `translate(${station.x}, ${station.y})`
                )
            }

            // Update connected lines
            this.app.lineManager.updateConnectedLines(station)

            // WICHTIG: Änderungen speichern
            console.log(`💾 Speichere Positionsänderung für ${station.name}`)
            this.app.storageManager.saveToStorage()
        }

        updateStationName(station, newName) {
            console.log(
                "Station umbenennen:",
                station.id,
                "von",
                station.name,
                "zu",
                newName
            )
            console.log(
                "Vor der Umbenennung Stationen:",
                this.app.stations.length
            )

            // Update station name
            station.name = newName

            // Update station element
            const stationElement = document.getElementById(station.id)
            if (stationElement) {
                const textElement = stationElement.querySelector("text")
                if (textElement) {
                    textElement.textContent = newName
                }
            } else {
                console.warn("Station-Element nicht gefunden:", station.id)
                // Wichtig: KEINE vollständige Neuzeichnung versuchen!
            }

            // Stationsliste aktualisieren, auch wenn die Station nicht verbunden ist
            this.app.stationListManager.updateStationList()

            // Wenn die Station zu einer Gruppe gehört, den Gruppennamen aktualisieren
            const group = this.findStationGroup(station.id)
            if (group) {
                console.log("Station ist Teil einer Gruppe:", group.id)
                const groupBaseName = this.getGroupBaseName(group)
                group.name = groupBaseName
                this.renderStationGroup(group)
            }

            console.log(
                "Nach der Umbenennung Stationen:",
                this.app.stations.length
            )

            // Änderungen speichern OHNE vollständige Neuzeichnung
            // ENTFERNE: this.renderStation(station);

            // Save changes
            this.app.storageManager.saveToStorage()
        }

        updateStationList() {
            const stationList = document.getElementById("stationList")
            stationList.innerHTML = ""

            // Stationen sortieren, falls nötig
            let sortedStations = [...this.app.stations]
            if (this.sortMode === "name") {
                sortedStations.sort((a, b) => a.name.localeCompare(b.name))
            } else if (this.sortMode === "id") {
                sortedStations.sort((a, b) => a.id.localeCompare(b.id))
            }

            // Create list items for each station
            for (const station of sortedStations) {
                const item = document.createElement("div")
                item.className = "station-item"
                if (this.app.selectedStations.includes(station)) {
                    item.classList.add("selected")
                }

                const routesForStation =
                    this.app.routeManager.getRoutesForStation(station)
                const hasConnections = routesForStation.length > 0

                // Erstellen des Stations-Icons
                const stationColor = document.createElement("div")
                stationColor.className = "station-color"

                // Hervorheben von nicht verbundenen Stationen mit rotem Rand
                if (!hasConnections) {
                    stationColor.style.border = "1px solid red"
                }

                const stationName = document.createElement("span")
                stationName.textContent = station.name

                const stationId = document.createElement("span")
                stationId.className = "station-id"
                stationId.textContent = station.id

                item.appendChild(stationColor)
                item.appendChild(stationName)
                item.appendChild(stationId)

                // Routen-Marker hinzufügen, wenn vorhanden
                if (routesForStation.length > 0) {
                    const routesContainer = document.createElement("div")
                    routesContainer.className = "station-routes"

                    for (const route of routesForStation) {
                        const routeMarker = document.createElement("div")
                        routeMarker.className = "route-marker"
                        routeMarker.style.backgroundColor = route.color
                        routesContainer.appendChild(routeMarker)
                    }

                    item.appendChild(routesContainer)
                }

                item.addEventListener("click", (e) =>
                    this.handleStationItemClick(e, station)
                )
                stationList.appendChild(item)
            }
        }

        deleteStation(station) {
            // Remove connected lines first
            const linesToRemove = this.app.lines.filter(
                (line) =>
                    line.station1.id === station.id ||
                    line.station2.id === station.id
            )

            for (const line of linesToRemove) {
                this.app.lineManager.deleteLine(line)
            }

            // Remove from selection if selected
            this.app.selectionManager.deselectStation(station)

            // Remove station from array
            const index = this.app.stations.indexOf(station)
            if (index !== -1) {
                this.app.stations.splice(index, 1)
            }

            // Remove from DOM
            const stationElement = document.getElementById(station.id)
            if (stationElement) {
                stationElement.remove()
            }

            // Save changes
            this.app.storageManager.saveToStorage()

            // Update station list
            this.app.stationListManager.updateStationList()
        }

        createStationFromLine(line, x, y) {
            // Koordinaten innerhalb der Canvas-Grenzen halten
            const constrained = this.app.canvasManager.constrainToCanvas(x, y)

            // Neue Station mit dem Namen der Linie erstellen
            const station = new Station(
                `station-${this.app.stationCounter++}`,
                line.name, // Name der Linie übernehmen
                constrained.x,
                constrained.y
            )

            // Zur Station-Array hinzufügen
            this.app.stations.push(station)

            // Station rendern
            this.renderStation(station)

            // Ursprüngliche Linie entfernen
            const station1 = line.station1
            const station2 = line.station2
            const lineColor = line.color

            this.app.lineManager.deleteLine(line)

            // Zwei neue Linien mit der gleichen Farbe erstellen
            this.app.lineManager.createLine(station1, station, lineColor)
            this.app.lineManager.createLine(station, station2, lineColor)

            // Station visuell hervorheben, um zu zeigen dass sie erstellt wurde
            const stationElement = document.getElementById(station.id)
            if (stationElement) {
                stationElement.classList.add("line-connected")
                setTimeout(() => {
                    stationElement.classList.remove("line-connected")
                }, 1500)
            }

            // Änderungen speichern
            this.app.storageManager.saveToStorage()

            // Stationsliste aktualisieren
            this.app.stationListManager.updateStationList()

            return station
        }

        // Aktualisierte splitStation-Methode
        splitStation(station) {
            // Ursprünglichen Namen speichern
            const baseName = station.name

            // Erstelle eine zweite Station in der Nähe
            const offsetX = 30 // Abstand zwischen den geteilten Stationen
            const newStation = new Station(
                `station-${this.app.stationCounter++}`,
                `${baseName} Ost`, // Name der neuen Station
                station.x + offsetX,
                station.y
            )

            // Umbenennen der ursprünglichen Station
            this.updateStationName(station, `${baseName} West`)

            // Zur Stations-Array hinzufügen
            this.app.stations.push(newStation)

            // Station rendern
            this.renderStation(newStation)

            // Stationsgruppe erstellen oder aktualisieren
            let group = this.findStationGroup(station.id)

            if (!group) {
                group = {
                    id: `group-${Date.now()}`,
                    stations: [station.id, newStation.id],
                    name: baseName, // Ursprünglicher Name ohne Zusatz
                    orientation: "horizontal", // Standard-Ausrichtung
                }
                this.app.stationGroups.push(group)
            } else {
                group.stations.push(newStation.id)
            }

            // Bestehende Linien untersuchen und neu verteilen
            const connectedLines = this.app.lines.filter(
                (line) =>
                    line.station1.id === station.id ||
                    line.station2.id === station.id
            )

            // Linien intelligent aufteilen: nach Richtung
            connectedLines.forEach((line) => {
                const otherStation =
                    line.station1.id === station.id
                        ? line.station2
                        : line.station1

                // Wenn andere Station rechts, dann zur neuen Station
                if (otherStation.x > station.x) {
                    if (line.station1.id === station.id) {
                        line.station1 = newStation
                    } else {
                        line.station2 = newStation
                    }
                    this.app.lineManager.renderLine(line)
                }
            })

            // ÄNDERUNG: Keine Verbindungslinie mehr erstellen
            // Stattdessen visuellen Rahmen für die Gruppe rendern
            this.renderStationGroup(group)

            // Änderungen speichern
            this.app.storageManager.saveToStorage()

            // Stationsliste aktualisieren
            this.app.stationListManager.updateStationList()

            // Beide Stationen markieren
            this.app.selectionManager.clearSelection()
            this.app.selectionManager.isShiftActive = true // Temporär für Mehrfachauswahl
            this.app.selectionManager.selectStation(station)
            this.app.selectionManager.selectStation(newStation)
            this.app.selectionManager.isShiftActive = false

            return newStation
        }

        // Neue Methode zum Rendern des Gruppenrahmens
        renderStationGroup(group) {
            // Bestehenden Rahmen entfernen falls vorhanden
            const existingGroup = document.getElementById(`group-${group.id}`)
            if (existingGroup) {
                existingGroup.remove()
            }

            // Stationen der Gruppe finden
            const groupStations = group.stations
                .map((id) => this.app.stations.find((s) => s.id === id))
                .filter((s) => s) // Nur existierende Stationen

            if (groupStations.length < 2) return

            // Grenzen berechnen
            let minX = Infinity,
                minY = Infinity,
                maxX = -Infinity,
                maxY = -Infinity
            for (const station of groupStations) {
                minX = Math.min(minX, station.x - 12)
                minY = Math.min(minY, station.y - 12)
                maxX = Math.max(maxX, station.x + 12)
                maxY = Math.max(maxY, station.y + 12)
            }

            // Rahmen erstellen
            const groupElement = document.createElementNS(
                "http://www.w3.org/2000/svg",
                "g"
            )
            groupElement.classList.add("station-group")
            groupElement.id = `group-${group.id}`
            groupElement.dataset.id = group.id

            // Rechteck für den Rahmen
            const rect = document.createElementNS(
                "http://www.w3.org/2000/svg",
                "rect"
            )
            rect.setAttribute("x", minX)
            rect.setAttribute("y", minY)
            rect.setAttribute("width", maxX - minX)
            rect.setAttribute("height", maxY - minY)
            rect.setAttribute("rx", 8) // Abgerundete Ecken
            rect.setAttribute("ry", 8)

            // Gruppenname
            const text = document.createElementNS(
                "http://www.w3.org/2000/svg",
                "text"
            )
            text.classList.add("station-group-name")
            text.setAttribute("x", (minX + maxX) / 2)
            text.setAttribute("y", minY - 8)
            text.textContent = group.name

            groupElement.appendChild(rect)
            groupElement.appendChild(text)

            // Vor den Stationen einfügen (damit Stationen im Vordergrund sind)
            const firstStation =
                this.app.canvasManager.canvas.querySelector(".station")
            if (firstStation) {
                this.app.canvasManager.canvas.insertBefore(
                    groupElement,
                    firstStation
                )
            } else {
                this.app.canvasManager.canvas.appendChild(groupElement)
            }

            return groupElement
        }

        // Neue Methode zum Extrahieren einer Station aus einer Gruppe
        extractStationFromGroup(station) {
            // Gruppe finden, zu der die Station gehört
            const group = this.findStationGroup(station.id)
            if (!group) return null

            // Station aus der Gruppe entfernen
            const index = group.stations.indexOf(station.id)
            if (index !== -1) {
                group.stations.splice(index, 1)
            }

            // Falls die Gruppe nur noch eine Station hat, die Gruppe auflösen
            if (group.stations.length <= 1) {
                const lastStationId = group.stations[0]
                const lastStation = this.app.stations.find(
                    (s) => s.id === lastStationId
                )

                if (lastStation) {
                    // Original-Name wiederherstellen
                    this.updateStationName(lastStation, group.name)
                }

                // Gruppe entfernen
                const groupIndex = this.app.stationGroups.indexOf(group)
                if (groupIndex !== -1) {
                    this.app.stationGroups.splice(groupIndex, 1)
                }

                // Gruppen-Element entfernen
                const groupElement = document.getElementById(
                    `group-${group.id}`
                )
                if (groupElement) {
                    groupElement.remove()
                }
            } else {
                // Gruppe neu rendern
                this.renderStationGroup(group)
            }

            // Änderungen speichern
            this.app.storageManager.saveToStorage()

            return station
        }

        // Methode zum gemeinsamen Bewegen von Stationsgruppen
        // Verbesserte moveStationGroup-Methode, die Rekursion vermeidet
        moveStationGroup(station, newX, newY) {
            // Finde die Gruppe, zu der die Station gehört
            const group = this.findStationGroup(station.id)
            if (!group) return

            // Berechne den Bewegungsvektor
            const deltaX = newX - station.x
            const deltaY = newY - station.y

            // Alle Stationen in der Gruppe bewegen
            const groupStations = group.stations
                .map((id) => this.app.stations.find((s) => s.id === id))
                .filter((s) => s) // Nur existierende Stationen

            // Zuerst die ausgewählte Station direkt bewegen
            station.x = newX
            station.y = newY
            const stationElement = document.getElementById(station.id)
            if (stationElement) {
                stationElement.setAttribute(
                    "transform",
                    `translate(${station.x}, ${station.y})`
                )
            }

            // Dann die anderen Stationen der Gruppe bewegen
            for (const groupStation of groupStations) {
                if (groupStation.id !== station.id) {
                    const newStationX = groupStation.x + deltaX
                    const newStationY = groupStation.y + deltaY

                    // Position innerhalb der Canvas-Grenzen einschränken
                    const constrained =
                        this.app.canvasManager.constrainToCanvas(
                            newStationX,
                            newStationY
                        )

                    // Station DIREKT bewegen ohne Rekursion
                    groupStation.x = constrained.x
                    groupStation.y = constrained.y

                    const element = document.getElementById(groupStation.id)
                    if (element) {
                        element.setAttribute(
                            "transform",
                            `translate(${groupStation.x}, ${groupStation.y})`
                        )
                    }
                }
            }

            // Alle verbundenen Linien aktualisieren
            for (const groupStation of groupStations) {
                this.app.lineManager.updateConnectedLines(groupStation)
            }

            // Gruppenrahmen aktualisieren
            this.renderStationGroup(group)

            // Save changes
            this.app.storageManager.saveToStorage()
        }

        // Hilfsmethode zum Finden einer Stationsgruppe
        findStationGroup(stationId) {
            return this.app.stationGroups.find((group) =>
                group.stations.includes(stationId)
            )
        }

        // Neue Methode zum Rotieren einer Stationsgruppe
        rotateStationGroup(group) {
            // Stationen der Gruppe finden
            const groupStations = group.stations
                .map((id) => this.app.stations.find((s) => s.id === id))
                .filter((s) => s) // Nur existierende Stationen

            if (groupStations.length < 2) return

            // Berechne den Mittelpunkt der Gruppe
            let centerX = 0,
                centerY = 0
            for (const station of groupStations) {
                centerX += station.x
                centerY += station.y
            }
            centerX /= groupStations.length
            centerY /= groupStations.length

            // Ändere die Orientierung
            const newOrientation =
                group.orientation === "horizontal" ? "vertical" : "horizontal"
            group.orientation = newOrientation

            // Abstände zwischen Stationen
            const spacing = 30

            // Neu positionieren basierend auf der Orientierung
            groupStations.forEach((station, index) => {
                let newX, newY

                if (newOrientation === "vertical") {
                    // Vertikal anordnen (übereinander)
                    newX = centerX
                    newY =
                        centerY -
                        ((groupStations.length - 1) * spacing) / 2 +
                        index * spacing
                } else {
                    // Horizontal anordnen (nebeneinander)
                    newX =
                        centerX -
                        ((groupStations.length - 1) * spacing) / 2 +
                        index * spacing
                    newY = centerY
                }

                // Position innerhalb der Canvas-Grenzen einschränken
                const constrained = this.app.canvasManager.constrainToCanvas(
                    newX,
                    newY
                )

                // Station bewegen, aber nicht über updateStationPosition, um Rekursion zu vermeiden
                station.x = constrained.x
                station.y = constrained.y

                // SVG-Element aktualisieren
                const stationElement = document.getElementById(station.id)
                if (stationElement) {
                    stationElement.setAttribute(
                        "transform",
                        `translate(${station.x}, ${station.y})`
                    )
                }

                // Verbundene Linien aktualisieren
                this.app.lineManager.updateConnectedLines(station)
            })

            // Gruppenrahmen aktualisieren
            this.renderStationGroup(group)

            // Änderungen speichern
            this.app.storageManager.saveToStorage()
        }

        /**
         * Extrahiert den Basis-Namen einer Station ohne Richtungszusätze
         * @param {Object} group - Stationsgruppe
         * @returns {string} Basis-Name der Gruppe
         */
        getGroupBaseName(group) {
            // Finde die erste Station der Gruppe
            const firstStation = this.app.stations.find(
                (s) => s.id === group.stations[0]
            )
            if (firstStation) {
                // Entferne Richtungszusätze wie "West", "Ost", "Nord", "Süd"
                return firstStation.name.replace(/ (West|Ost|Nord|Süd)$/, "")
            }
            return group.name || "Unbenannte Gruppe"
        }
    }

    /**
     * UI management class
     */
    class UIManager {
        constructor(app) {
            this.app = app
        }

        init() {
            console.log("UIManager initialized")
            // UI-spezifische Initialisierungen können hier hinzugefügt werden
        }
    }

    /**
     * Event management class - VOLLSTÄNDIGE IMPLEMENTIERUNG
     */
    class EventManager {
        constructor(app) {
            this.app = app
            this.isDragging = false
            this.dragTarget = null
            this.isDrawingLine = false
            this.drawingLineStart = null
            this.dragStartX = 0
            this.dragStartY = 0
            this.editingStation = null
        }

        init() {
            this.setupCanvasEvents()
            this.setupKeyboardEvents()
            this.setupButtonEvents()
            console.log("EventManager initialized")
        }

        setupCanvasEvents() {
            const canvas = this.app.canvasManager.canvas

            // Mouse events
            canvas.addEventListener("mousedown", (e) => this.handleMouseDown(e))
            canvas.addEventListener("mousemove", (e) => this.handleMouseMove(e))
            canvas.addEventListener("mouseup", (e) => this.handleMouseUp(e))
            canvas.addEventListener("dblclick", (e) =>
                this.handleDoubleClick(e)
            )

            // Prevent context menu
            canvas.addEventListener("contextmenu", (e) => e.preventDefault())
        }

        setupKeyboardEvents() {
            document.addEventListener("keydown", (e) => this.handleKeyDown(e))
            document.addEventListener("keyup", (e) => this.handleKeyUp(e))
        }

        setupButtonEvents() {
            const resetBtn = document.getElementById("resetBtn")
            if (resetBtn) {
                resetBtn.addEventListener("click", () => {
                    if (
                        confirm("Möchten Sie wirklich alle Daten zurücksetzen?")
                    ) {
                        this.app.reset()
                    }
                })
            }
        }

        handleMouseDown(e) {
            e.preventDefault()

            const coords = this.app.canvasManager.screenToCanvasCoords(
                e.clientX,
                e.clientY
            )
            const target = e.target

            console.log("Mouse down:", {
                coords,
                target: target.tagName,
                id: target.id,
            })

            // Station angeklickt?
            if (target.closest(".station")) {
                const stationElement = target.closest(".station")
                const stationId = stationElement.dataset.id
                const station = this.app.stations.find(
                    (s) => s.id === stationId
                )

                if (station) {
                    if (e.ctrlKey || e.metaKey) {
                        // Linie zeichnen starten
                        this.startDrawingLine(station, coords)
                    } else if (e.altKey) {
                        // Station teilen
                        this.app.stationManager.splitStation(station)
                    } else {
                        // Station auswählen und draggen vorbereiten
                        this.selectStation(station, e)
                        this.prepareDragging(station, coords)
                    }
                }
            } else if (target.closest(".metro-line")) {
                // Linie angeklickt
                const lineElement = target.closest(".metro-line")
                const lineId = lineElement.dataset.id
                const line = this.app.lineManager.getLineById(lineId)

                if (line && e.altKey) {
                    // Station auf Linie erstellen
                    this.app.stationManager.createStationFromLine(
                        line,
                        coords.x,
                        coords.y
                    )
                }
            } else {
                // Leerer Bereich angeklickt
                if (!e.shiftKey) {
                    this.app.selectionManager.clearSelection()
                }

                // Pan-Modus starten
                this.app.canvasManager.startPan(e.clientX, e.clientY)
            }

            this.dragStartX = coords.x
            this.dragStartY = coords.y
        }

        handleMouseMove(e) {
            const coords = this.app.canvasManager.screenToCanvasCoords(
                e.clientX,
                e.clientY
            )

            // Station draggen
            if (this.isDragging && this.dragTarget) {
                const newX = coords.x
                const newY = coords.y

                // Position innerhalb Canvas-Grenzen halten
                const constrained = this.app.canvasManager.constrainToCanvas(
                    newX,
                    newY
                )

                this.app.stationManager.updateStationPosition(
                    this.dragTarget,
                    constrained.x,
                    constrained.y
                )
            }
            // Linie zeichnen
            else if (this.isDrawingLine && this.drawingLineStart) {
                this.updateDrawingLine(coords)
            }
            // Canvas pan
            else if (this.app.canvasManager.isDragging) {
                this.app.canvasManager.pan(e.clientX, e.clientY)
            }

            // Cursor aktualisieren
            this.updateCursor(e, coords)
        }

        handleMouseUp(e) {
            const coords = this.app.canvasManager.screenToCanvasCoords(
                e.clientX,
                e.clientY
            )
            const target = e.target

            // Linie zeichnen beenden
            if (this.isDrawingLine) {
                if (target.closest(".station")) {
                    const stationElement = target.closest(".station")
                    const stationId = stationElement.dataset.id
                    const endStation = this.app.stations.find(
                        (s) => s.id === stationId
                    )

                    if (endStation && endStation !== this.drawingLineStart) {
                        // Linie erstellen
                        const color =
                            this.app.lineColors[
                                this.app.lines.length %
                                    this.app.lineColors.length
                            ]
                        this.app.lineManager.createLine(
                            this.drawingLineStart,
                            endStation,
                            color
                        )
                    }
                }
                this.endDrawingLine()
            }

            // Dragging beenden
            if (this.isDragging) {
                this.isDragging = false
                this.dragTarget = null
            }

            // Pan beenden
            this.app.canvasManager.endPan()
        }

        handleDoubleClick(e) {
            e.preventDefault()

            const coords = this.app.canvasManager.screenToCanvasCoords(
                e.clientX,
                e.clientY
            )
            const target = e.target

            if (target.closest(".station")) {
                // Station umbenennen
                const stationElement = target.closest(".station")
                const stationId = stationElement.dataset.id
                const station = this.app.stations.find(
                    (s) => s.id === stationId
                )

                if (station) {
                    this.startEditingStation(station)
                }
            } else {
                // Neue Station erstellen
                this.app.stationManager.createStation(coords.x, coords.y)
            }
        }

        handleKeyDown(e) {
            if (e.key === "Shift") {
                this.app.selectionManager.toggleShift(true)
            }
            if (e.key === "Delete" || e.key === "Backspace") {
                this.app.selectionManager.deleteSelected()
            }
            if (e.key === "Escape") {
                this.cancelCurrentAction()
            }
        }

        handleKeyUp(e) {
            if (e.key === "Shift") {
                this.app.selectionManager.toggleShift(false)
            }
        }

        // Hilfsmethoden
        selectStation(station, event) {
            if (event.shiftKey) {
                if (this.app.selectionManager.isStationSelected(station)) {
                    this.app.selectionManager.deselectStation(station)
                } else {
                    this.app.selectionManager.selectStation(station)
                }
            } else {
                if (!this.app.selectionManager.isStationSelected(station)) {
                    this.app.selectionManager.clearSelection()
                    this.app.selectionManager.selectStation(station)
                }
            }

            // Stationsliste aktualisieren
            this.app.stationListManager.updateStationList()
        }

        prepareDragging(station, coords) {
            this.isDragging = true
            this.dragTarget = station
            document.body.style.cursor = "grabbing"
        }

        startDrawingLine(station, coords) {
            this.isDrawingLine = true
            this.drawingLineStart = station
            document.body.style.cursor = "crosshair"

            // Temporäre Linie erstellen
            this.createTemporaryLine(station, coords)
        }

        createTemporaryLine(startStation, coords) {
            // Entferne existierende temporäre Linie
            const existingTemp = document.getElementById("temp-line")
            if (existingTemp) {
                existingTemp.remove()
            }

            // Erstelle neue temporäre Linie
            const tempLine = document.createElementNS(
                "http://www.w3.org/2000/svg",
                "line"
            )
            tempLine.id = "temp-line"
            tempLine.classList.add("temp-line")
            tempLine.setAttribute("x1", startStation.x)
            tempLine.setAttribute("y1", startStation.y)
            tempLine.setAttribute("x2", coords.x)
            tempLine.setAttribute("y2", coords.y)
            tempLine.setAttribute("stroke", "#ff0000")
            tempLine.setAttribute("stroke-width", "2")
            tempLine.setAttribute("stroke-dasharray", "5,5")
            tempLine.style.pointerEvents = "none"

            this.app.canvasManager.canvas.appendChild(tempLine)
        }

        updateDrawingLine(coords) {
            const tempLine = document.getElementById("temp-line")
            if (tempLine) {
                tempLine.setAttribute("x2", coords.x)
                tempLine.setAttribute("y2", coords.y)
            }
        }

        endDrawingLine() {
            this.isDrawingLine = false
            this.drawingLineStart = null
            document.body.style.cursor = "default"

            // Temporäre Linie entfernen
            const tempLine = document.getElementById("temp-line")
            if (tempLine) {
                tempLine.remove()
            }
        }

        startEditingStation(station) {
            const newName = prompt("Station umbenennen:", station.name)
            if (newName && newName.trim() !== "" && newName !== station.name) {
                this.app.stationManager.updateStationName(
                    station,
                    newName.trim()
                )
            }
        }

        updateCursor(event, coords) {
            const target = event.target

            if (this.isDrawingLine) {
                document.body.style.cursor = "crosshair"
            } else if (target.closest(".station")) {
                if (event.ctrlKey || event.metaKey) {
                    document.body.style.cursor = "crosshair"
                } else {
                    document.body.style.cursor = "grab"
                }
            } else {
                document.body.style.cursor = "default"
            }
        }

        cancelCurrentAction() {
            if (this.isDrawingLine) {
                this.endDrawingLine()
            }
            if (this.isDragging) {
                this.isDragging = false
                this.dragTarget = null
                document.body.style.cursor = "default"
            }
            this.app.selectionManager.clearSelection()
        }
    }

    /**
     * Station list management class - VEREINIGTE VERSION
     */
    class StationListManager {
        constructor(app) {
            this.app = app
            this.stationListElement = document.getElementById("stationList")
            this.sortNameBtn = document.getElementById("sortNameBtn")
            this.sortIdBtn = document.getElementById("sortIdBtn")
            this.sortByName = true // Default sort
        }

        init() {
            // Event listeners für Sort-Buttons
            if (this.sortNameBtn) {
                this.sortNameBtn.addEventListener("click", () => {
                    this.sortByName = true
                    this.updateStationList()
                })
            }

            if (this.sortIdBtn) {
                this.sortIdBtn.addEventListener("click", () => {
                    this.sortByName = false
                    this.updateStationList()
                })
            }

            // Initial render
            this.updateStationList()
        }

        updateStationList() {
            if (!this.stationListElement) {
                console.warn("Station list element not found")
                return
            }

            // Clear the list
            this.stationListElement.innerHTML = ""

            // Sort stations
            const sortedStations = [...this.app.stations]
            if (this.sortByName) {
                sortedStations.sort((a, b) => a.name.localeCompare(b.name))
            } else {
                sortedStations.sort((a, b) => {
                    const idA = parseInt(a.id.replace("station-", ""))
                    const idB = parseInt(b.id.replace("station-", ""))
                    return idA - idB
                })
            }

            // Create station items
            for (const station of sortedStations) {
                const stationItem = document.createElement("div")
                stationItem.className = "station-item"
                stationItem.dataset.id = station.id

                // Markierung für ausgewählte Stationen
                if (this.app.selectedStations.includes(station)) {
                    stationItem.classList.add("selected")
                }

                // Station color indicator
                const stationColor = document.createElement("div")
                stationColor.className = "station-color"

                // Station name
                const stationName = document.createElement("div")
                stationName.className = "station-name"
                stationName.textContent = station.name

                // Station ID
                const stationId = document.createElement("div")
                stationId.className = "station-id"
                stationId.textContent = `#${station.id.replace("station-", "")}`

                // NEU: Linien/Routen anzeigen
                const stationRoutes = document.createElement("div")
                stationRoutes.className = "station-routes"

                // Routen für diese Station ermitteln
                const routes =
                    this.app.routeManager.getRoutesForStation(station)

                if (routes.length > 0) {
                    // Für jede Route einen farbigen Marker erstellen
                    routes.forEach((route) => {
                        const routeMarker = document.createElement("span")
                        routeMarker.className = "route-marker"
                        routeMarker.style.backgroundColor = route.color
                        routeMarker.title = route.name
                        stationRoutes.appendChild(routeMarker)
                    })
                }

                // Elemente zusammenfügen
                stationItem.appendChild(stationColor)
                stationItem.appendChild(stationName)
                stationItem.appendChild(stationId)
                stationItem.appendChild(stationRoutes)

                // Klick-Event hinzufügen
                stationItem.addEventListener("click", (e) =>
                    this.handleStationItemClick(e, station)
                )

                this.stationListElement.appendChild(stationItem)
            }

            // Show message if no stations
            if (sortedStations.length === 0) {
                const emptyMessage = document.createElement("div")
                emptyMessage.className = "empty-message"
                emptyMessage.textContent =
                    "Keine Stationen vorhanden. Doppelklicke auf die Karte, um eine Station zu erstellen."
                emptyMessage.style.padding = "15px"
                emptyMessage.style.color = "#666"
                emptyMessage.style.fontStyle = "italic"
                emptyMessage.style.textAlign = "center"

                this.stationListElement.appendChild(emptyMessage)
            }
        }

        handleStationItemClick(e, station) {
            // Select the station and center view
            if (e.shiftKey) {
                // If shift key pressed, add to selection
                this.app.selectionManager.selectStation(station)
            } else {
                // Otherwise, select only this station
                this.app.selectionManager.clearSelection()
                this.app.selectionManager.selectStation(station)
            }

            // Center the view on the station
            this.app.canvasManager.centerViewOn(station.x, station.y)

            // Update the list to reflect selection
            this.updateStationList()
        }

        getGroupBaseName(group) {
            return this.app.stationManager.getGroupBaseName(group)
        }
    }

    /**
     * Import management class - ERWEITERT
     */
    class ImportManager {
        constructor(app) {
            this.app = app
        }

        /**
         * Analysiert und transformiert Sammlungsdaten zu Metro-Daten
         * @returns {Object|null} Metro-Daten oder null bei Fehler
         */
        async processCollectionsToMetroData() {
            console.log("🚀 Starte Verarbeitung der Sammlungsdaten...")

            // 1. Kriterien-Metadaten laden
            const criteriaMetadata = await this.loadCriteriaMetadata()

            // 2. Sammlungen aus localStorage laden
            const collections = this.loadCollectionsFromStorage()
            if (!collections) return null

            // 3. Datenstruktur analysieren und validieren
            const validatedData = this.validateAndCleanCollections(collections)
            if (!validatedData) return null

            // 4. Kriterien zu Stationen konvertieren (mit Metadaten)
            const metroData = this.convertCriteriaToStations(
                validatedData,
                criteriaMetadata
            )

            // 5. Verbindungen zwischen Stationen erstellen
            this.createStationConnections(metroData, validatedData)

            console.log("✅ Verarbeitung abgeschlossen:", metroData)
            return metroData
        }

        /**
         * Schritt 1: Sammlungen aus localStorage laden
         */
        loadCollectionsFromStorage() {
            try {
                const data = localStorage.getItem("bitvCollections")
                if (!data) {
                    console.warn(
                        "⚠️ Keine bitvCollections im localStorage gefunden"
                    )
                    return null
                }

                const collections = JSON.parse(data)
                console.log("📦 Rohdaten geladen:", collections)
                return collections
            } catch (error) {
                console.error("❌ Fehler beim Laden der Sammlungen:", error)
                return null
            }
        }

        /**
         * Schritt 2: Datenvalidierung und -bereinigung - KORRIGIERT
         */
        validateAndCleanCollections(collections) {
            console.log("🔍 Validiere Sammlungsdaten...")

            if (!collections || typeof collections !== "object") {
                console.error("❌ Collections ist kein gültiges Objekt")
                return null
            }

            const validatedCollections = {}
            let totalCriteria = 0

            Object.entries(collections).forEach(
                ([collectionName, criteriaArray]) => {
                    // Prüfe ob criteriaArray ein Array ist
                    if (!Array.isArray(criteriaArray)) {
                        console.warn(
                            `⚠️ Sammlung "${collectionName}" enthält kein Array:`,
                            criteriaArray
                        )
                        return
                    }

                    // KORRIGIERTE Filterfunktion für Objekte
                    const cleanedCriteria = criteriaArray
                        .map((criteria) => {
                            // Falls es ein Objekt ist, extrahiere einen sinnvollen String
                            if (
                                typeof criteria === "object" &&
                                criteria !== null
                            ) {
                                // Versuche verschiedene Properties
                                return (
                                    criteria.id ||
                                    criteria.name ||
                                    criteria.title ||
                                    criteria.text ||
                                    criteria.content ||
                                    criteria.label ||
                                    JSON.stringify(criteria) || // Fallback
                                    String(criteria)
                                )
                            }
                            // Falls es bereits ein String ist
                            return String(criteria)
                        })
                        .map((criteria) => criteria.trim())
                        .filter(
                            (criteria) =>
                                criteria.length > 0 &&
                                criteria !== "[object Object]"
                        )

                    if (cleanedCriteria.length > 0) {
                        validatedCollections[collectionName] = cleanedCriteria
                        totalCriteria += cleanedCriteria.length
                        console.log(
                            `✅ Sammlung "${collectionName}": ${cleanedCriteria.length} Kriterien`
                        )
                        console.log(`   📝 Kriterien:`, cleanedCriteria)
                    } else {
                        console.warn(
                            `⚠️ Sammlung "${collectionName}" hat keine gültigen Kriterien`
                        )
                    }
                }
            )

            console.log(
                `📊 Validation abgeschlossen: ${
                    Object.keys(validatedCollections).length
                } Sammlungen, ${totalCriteria} Kriterien`
            )
            return validatedCollections
        }

        /**
         * Schritt 3: Kriterien zu Metro-Stationen konvertieren (mit Metadaten)
         */
        convertCriteriaToStations(collections, criteriaMetadata = new Map()) {
            console.log("🏗️ Konvertiere Kriterien zu Stationen...")

            const metroData = {
                stations: [],
                lines: [],
                routes: [],
                stationGroups: [],
                stationCounter: 1,
                lineCounter: 1,
            }

            // Alle einzigartigen Kriterien sammeln
            const allCriteria = new Set()
            const criteriaUsage = new Map() // Welche Sammlungen verwenden welches Kriterium

            Object.entries(collections).forEach(
                ([collectionName, criteriaArray]) => {
                    criteriaArray.forEach((criteria) => {
                        allCriteria.add(criteria)

                        if (!criteriaUsage.has(criteria)) {
                            criteriaUsage.set(criteria, [])
                        }
                        criteriaUsage.get(criteria).push(collectionName)
                    })
                }
            )

            console.log(
                `🎯 ${allCriteria.size} einzigartige Kriterien gefunden`
            )

            // Stationen aus Kriterien erstellen (MIT METADATEN)
            this.createStationsFromCriteria(
                Array.from(allCriteria),
                criteriaUsage,
                metroData,
                criteriaMetadata
            )

            return metroData
        }

        /**
         * Erstellt Stationen aus Kriterien-Array (mit Metadaten)
         */
        createStationsFromCriteria(
            criteriaArray,
            criteriaUsage,
            metroData,
            criteriaMetadata = new Map()
        ) {
            console.log("🚉 Erstelle Stationen...")

            // Grid-Layout für Stationen
            const GRID_SPACING_X = 180
            const GRID_SPACING_Y = 80
            const MAX_COLUMNS = 5

            criteriaArray.forEach((criteria, index) => {
                // Stationsposition berechnen
                const position = this.calculateStationPosition(
                    index,
                    MAX_COLUMNS,
                    GRID_SPACING_X,
                    GRID_SPACING_Y
                )

                // Station erstellen mit verbesserter Formatierung
                const station = new Station(
                    `station-${metroData.stationCounter++}`,
                    this.formatCriteriaNameWithMetadata(
                        criteria,
                        criteriaMetadata
                    ),
                    position.x,
                    position.y
                )

                // Zusätzliche Station-Eigenschaften
                station.criteriaId = criteria
                station.originalCriteria = criteria
                station.collections = criteriaUsage.get(criteria) || []
                station.isJunctionPoint = station.collections.length > 1

                // Metadaten hinzufügen falls verfügbar
                const metadata = criteriaMetadata.get(criteria)
                if (metadata) {
                    station.title = metadata.title
                    station.conformanceLevel = metadata.conformanceLevel
                    station.category = metadata.category

                    console.log(`  📋 Metadaten für ${criteria}:`, {
                        title: metadata.title,
                        conformanceLevel: metadata.conformanceLevel,
                    })
                } else {
                    // Fallback zur ursprünglichen Extraktion
                    station.conformanceLevel =
                        this.extractConformanceLevel(criteria)
                    station.category = this.extractCategory(criteria)

                    console.log(
                        `  ⚠️ Keine Metadaten für ${criteria}, verwende Fallback`
                    )
                }

                metroData.stations.push(station)

                console.log(
                    `  ➕ Station ${station.id}: "${station.name}" (${station.collections.length} Sammlungen)`
                )
            })

            console.log(`✅ ${metroData.stations.length} Stationen erstellt`)
        }

        /**
         * Berechnet Position für Station im Grid
         */
        calculateStationPosition(index, maxColumns, spacingX, spacingY) {
            const column = index % maxColumns
            const row = Math.floor(index / maxColumns)

            return {
                x: 100 + column * spacingX,
                y: 100 + row * spacingY,
            }
        }

        /**
         * Formatiert Kriterium-Namen für Anzeige
         */
        formatCriteriaName(criteria) {
            // Entferne eventuelle Präfixe und formatiere
            let name = criteria.toString().trim()

            // Falls es eine WCAG-ähnliche ID ist, formatiere sie
            if (name.match(/^\d+\.\d+/)) {
                return `Kriterium ${name}`
            }

            // Sonst den Namen kürzen falls sehr lang
            if (name.length > 50) {
                return name.substring(0, 47) + "..."
            }

            return name
        }

        /**
         * Verbesserte Formatierung mit Kriterien-Metadaten
         * @param {string} criteria - Kriterium-ID
         * @param {Map} criteriaMetadata - Metadaten-Map
         * @returns {string} Formatierter Name
         */
        formatCriteriaNameWithMetadata(criteria, criteriaMetadata) {
            const criteriaId = String(criteria).trim()

            console.log(`🔍 Formatiere Kriterium: "${criteriaId}"`)

            // Versuche Metadaten zu finden
            const metadata = criteriaMetadata.get(criteriaId)

            if (metadata && metadata.title && metadata.conformanceLevel) {
                // Format: "9.2.4.2 Sinnvolle Dokumententitel (A)"
                const formattedName = `${metadata.id} ${metadata.title} (${metadata.conformanceLevel})`
                console.log(`  ✅ Mit Metadaten: "${formattedName}"`)
                return formattedName
            }

            console.log(`  ⚠️ Keine Metadaten gefunden für: "${criteriaId}"`)
            console.log(
                `  📊 Verfügbare Metadaten-Keys:`,
                Array.from(criteriaMetadata.keys()).slice(0, 5)
            )

            // Fallback zur ursprünglichen Formatierung
            const fallbackName = this.formatCriteriaName(criteria)
            console.log(`  🔄 Fallback: "${fallbackName}"`)
            return fallbackName
        }

        /**
         * Lädt Kriterien-Metadaten aus criterias.json (mit verbesserter Debug-Ausgabe)
         * @returns {Object} Kriterien-Lookup-Map
         */
        async loadCriteriaMetadata() {
            try {
                console.log("📚 Lade criterias.json...")
                const response = await fetch("./assets/data/criterias.json")
                if (!response.ok) {
                    console.warn(
                        "criterias.json nicht gefunden, verwende Fallback"
                    )
                    return new Map()
                }

                const data = await response.json()
                const criteriaMap = new Map()

                console.log("📄 Rohe criterias.json Struktur:", data)

                // Parse die verschachtelte Struktur
                if (data.sections) {
                    console.log(`📂 ${data.sections.length} Sektionen gefunden`)

                    data.sections.forEach((section, sectionIndex) => {
                        console.log(
                            `📁 Sektion ${sectionIndex + 1}:`,
                            Object.keys(section)
                        )

                        Object.values(section).forEach(
                            (categoryData, categoryIndex) => {
                                if (categoryData.pruefschritte) {
                                    console.log(
                                        `  📋 Kategorie ${categoryIndex + 1}: ${
                                            categoryData.pruefschritte.length
                                        } Prüfschritte`
                                    )

                                    categoryData.pruefschritte.forEach(
                                        (criteria, criteriaIndex) => {
                                            if (criteria.id) {
                                                const metadataEntry = {
                                                    id: criteria.id,
                                                    title:
                                                        criteria.title ||
                                                        criteria.name ||
                                                        "Unbenannt",
                                                    conformanceLevel:
                                                        criteria.conformanceLevel ||
                                                        this.extractConformanceLevel(
                                                            criteria.id
                                                        ),
                                                    category:
                                                        criteria.category ||
                                                        this.extractCategory(
                                                            criteria.id
                                                        ),
                                                }

                                                criteriaMap.set(
                                                    criteria.id,
                                                    metadataEntry
                                                )

                                                // Debug erste paar Einträge
                                                if (criteriaIndex < 3) {
                                                    console.log(
                                                        `    📌 ${criteria.id}: "${metadataEntry.title}" (${metadataEntry.conformanceLevel})`
                                                    )
                                                }
                                            }
                                        }
                                    )
                                }
                            }
                        )
                    })
                }

                console.log(
                    `📚 ${criteriaMap.size} Kriterien-Metadaten geladen`
                )

                // Debug: Zeige erste 10 Einträge
                console.log("🔍 Erste 10 Metadaten-Einträge:")
                let count = 0
                for (const [key, value] of criteriaMap.entries()) {
                    if (count < 10) {
                        console.log(
                            `  ${key} → "${value.title}" (${value.conformanceLevel})`
                        )
                        count++
                    }
                }

                return criteriaMap
            } catch (error) {
                console.warn(
                    "Fehler beim Laden der Kriterien-Metadaten:",
                    error
                )
                return new Map()
            }
        }

        /**
         * Schritt 4: Verbindungen zwischen Stationen erstellen
         */
        createStationConnections(metroData, collections) {
            console.log("🔗 Erstelle Verbindungen zwischen Stationen...")

            const stationMap = new Map()
            metroData.stations.forEach((station) => {
                stationMap.set(station.criteriaId, station)
            })

            // Farben für Routen
            const routeColors = [
                "#E53E3E",
                "#3182CE",
                "#38A169",
                "#D69E2E",
                "#805AD5",
                "#DD6B20",
                "#319795",
                "#9F7AEA",
                "#F56565",
                "#4299E1",
            ]

            Object.entries(collections).forEach(
                ([collectionName, criteriaArray], index) => {
                    const routeColor = routeColors[index % routeColors.length]

                    // Route erstellen
                    const route = {
                        id: `route-${metroData.routes.length + 1}`,
                        name: collectionName,
                        color: routeColor,
                        stations: [],
                        criteriaIds: criteriaArray,
                    }

                    metroData.routes.push(route)

                    // Linien zwischen aufeinanderfolgenden Kriterien erstellen
                    for (let i = 0; i < criteriaArray.length - 1; i++) {
                        const currentCriteria = criteriaArray[i]
                        const nextCriteria = criteriaArray[i + 1]

                        const station1 = stationMap.get(currentCriteria)
                        const station2 = stationMap.get(nextCriteria)

                        if (station1 && station2) {
                            const line = new Line(
                                `line-${metroData.lineCounter++}`,
                                station1,
                                station2,
                                routeColor,
                                `${collectionName} Verbindung ${i + 1}`
                            )

                            line.route = route
                            line.collectionName = collectionName
                            metroData.lines.push(line)

                            route.stations.push(station1)
                            if (i === criteriaArray.length - 2) {
                                route.stations.push(station2) // Letzte Station auch hinzufügen
                            }

                            console.log(
                                `    🔗 ${station1.name} → ${station2.name}`
                            )
                        }
                    }

                    console.log(
                        `  ✅ Route "${collectionName}": ${
                            criteriaArray.length - 1
                        } Verbindungen`
                    )
                }
            )

            console.log(`✅ ${metroData.lines.length} Verbindungen erstellt`)
        }

        /**
         * Hauptmethode: Importiert und lädt Sammlungen (ASYNC)
         */
        async importAndLoadCollections() {
            console.log("🚀 Starte Import-Prozess...")

            const metroData = await this.processCollectionsToMetroData()
            if (!metroData) {
                alert(
                    "❌ Import fehlgeschlagen!\n\nPrüfen Sie die Konsole für Details."
                )
                return
            }

            // Metro-Daten in die Anwendung laden
            this.loadMetroDataIntoApp(metroData)

            console.log("🎉 Import erfolgreich abgeschlossen!")
        }

        /**
         * Lädt Metro-Daten in die Anwendung
         */
        loadMetroDataIntoApp(metroData) {
            console.log("📥 Lade Metro-Daten in Anwendung...")
            console.log("📊 Zu ladende Daten:", {
                stationen: metroData.stations.length,
                linien: metroData.lines.length,
                routen: metroData.routes.length,
            })

            // Backup erstellen
            this.createBackup()

            // App zurücksetzen
            console.log("🔄 Setze App zurück...")
            this.app.reset()

            // Daten laden
            console.log("📋 Lade Basisdaten...")
            this.app.stationCounter = metroData.stationCounter
            this.app.lineCounter = metroData.lineCounter

            // Stationen DIREKT hinzufügen
            console.log("🚉 Füge Stationen hinzu...")
            metroData.stations.forEach((station) => {
                console.log(`  ➕ Füge hinzu: ${station.name} (${station.id})`)
                this.app.stations.push(station)
            })

            console.log(`✅ ${this.app.stations.length} Stationen geladen`)

            // Routen und Linien hinzufügen
            this.app.routes.push(...metroData.routes)
            this.app.lines.push(...metroData.lines)
            this.app.stationGroups.push(...metroData.stationGroups)

            // Canvas leeren vor dem Rendern
            console.log("🎨 Bereite Rendering vor...")
            this.app.canvasManager.clearCanvas()

            // Visuell rendern
            console.log("🎨 Rendere Stationen...")
            metroData.stations.forEach((station, index) => {
                console.log(
                    `  🎨 Rendere Station ${index + 1}: ${station.name}`
                )
                this.app.stationManager.renderStation(station)
            })

            console.log("🎨 Rendere Linien...")
            metroData.lines.forEach((line) => {
                this.app.lineManager.renderLine(line)
            })

            // UI aktualisieren
            console.log("💾 Speichere Daten...")
            this.app.storageManager.saveToStorage()

            console.log("📝 Aktualisiere Stationsliste...")
            this.app.stationListManager.updateStationList()

            // DEBUG: Prüfe finale App-Daten
            console.log("🔍 FINALE APP-DATEN nach Import:")
            console.log("  Stationen in App:", this.app.stations.length)
            console.log(
                "  Stationen-Details:",
                this.app.stations.map((s) => ({ id: s.id, name: s.name }))
            )

            // Erfolgsmeldung
            this.showImportSuccess(metroData)
        }

        // Füge diese Methoden NACH der loadMetroDataIntoApp-Methode und VOR der schließenden Klammer der ImportManager-Klasse hinzu:

        /**
         * Erstellt ein Backup der aktuellen Daten
         */
        createBackup() {
            const backupData = {
                stations: this.app.stations,
                lines: this.app.lines,
                routes: this.app.routes,
                stationGroups: this.app.stationGroups,
                stationCounter: this.app.stationCounter,
                lineCounter: this.app.lineCounter,
                timestamp: new Date().toISOString(),
            }

            localStorage.setItem("metroData_backup", JSON.stringify(backupData))
            console.log("💾 Backup erstellt")
        }

        /**
         * Zeigt eine Erfolgsmeldung nach dem Import
         */
        showImportSuccess(metroData) {
            const stats = {
                stationen: metroData.stations.length,
                linien: metroData.lines.length,
                routen: metroData.routes.length,
            }

            alert(
                `🎉 Import erfolgreich!\n\n` +
                    `📊 Erstellt:\n` +
                    `• ${stats.stationen} Stationen\n` +
                    `• ${stats.linien} Verbindungen\n` +
                    `• ${stats.routen} Routen\n\n` +
                    `Die Metro-Karte wurde basierend auf Ihren Sammlungen erstellt.\n` +
                    `Sie können nun die Stationen bearbeiten, verschieben und weitere Verbindungen erstellen.`
            )
        }

        /**
         * Extrahiert das Konformitätslevel aus der Kriterium-ID
         * @param {string} criteria - Kriterium-String
         * @returns {string} Konformitätslevel (A, AA, AAA)
         */
        extractConformanceLevel(criteria) {
            const criteriaStr = String(criteria).toLowerCase()

            // WCAG 2.x Pattern-Matching
            if (criteriaStr.match(/^1\.[1-3]\./)) return "A"
            if (criteriaStr.match(/^1\.4\.[1-5]/)) return "A"
            if (criteriaStr.match(/^1\.4\.[6-9]|1\.4\.1[0-3]/)) return "AA"
            if (criteriaStr.match(/^2\.[1-3]\./)) return "A"
            if (criteriaStr.match(/^2\.4\.[1-4]|2\.4\.6/)) return "A"
            if (criteriaStr.match(/^2\.4\.[5,7]/)) return "AA"
            if (criteriaStr.match(/^2\.4\.[8-9]|2\.4\.10/)) return "AAA"
            if (criteriaStr.match(/^3\.[1-2]\./)) return "A"
            if (criteriaStr.match(/^3\.3\./)) return "A"
            if (criteriaStr.match(/^4\.1\./)) return "A"

            // Spezielle AAA-Kriterien
            if (criteriaStr.match(/1\.2\.[6-9]|1\.2\.1[0-4]/)) return "AAA"
            if (criteriaStr.match(/1\.4\.1[4-9]|1\.4\.2[0-2]/)) return "AAA"
            if (criteriaStr.match(/2\.3\.[2-3]/)) return "AAA"
            if (criteriaStr.match(/3\.1\.[3-6]/)) return "AAA"
            if (criteriaStr.match(/3\.2\.[5]/)) return "AAA"
            if (criteriaStr.match(/3\.3\.[5-6]/)) return "AAA"

            return "AA" // Fallback
        }

        /**
         * Extrahiert die Kategorie aus der Kriterium-ID oder dem Namen
         * @param {string} criteria - Kriterium-String
         * @returns {string} Kategorie
         */
        extractCategory(criteria) {
            const criteriaStr = String(criteria).toLowerCase()

            // WCAG-Prinzipien basierte Kategorisierung
            if (criteriaStr.match(/^1\./)) return "Wahrnehmbar"
            if (criteriaStr.match(/^2\./)) return "Bedienbar"
            if (criteriaStr.match(/^3\./)) return "Verständlich"
            if (criteriaStr.match(/^4\./)) return "Robust"

            // EN 301 549 / BITV spezifische Kategorien
            if (criteriaStr.match(/^5\./)) return "Allgemeine Anforderungen"
            if (criteriaStr.match(/^6\./)) return "Kommunikation"
            if (criteriaStr.match(/^7\./)) return "Video"
            if (criteriaStr.match(/^8\./)) return "Hardware"
            if (criteriaStr.match(/^9\./)) return "Web"
            if (criteriaStr.match(/^10\./)) return "Nicht-Web-Dokumente"
            if (criteriaStr.match(/^11\./)) return "Software"
            if (criteriaStr.match(/^12\./)) return "Dokumentation"

            // Inhaltliche Kategorisierung
            if (
                criteriaStr.includes("bild") ||
                criteriaStr.includes("alt") ||
                criteriaStr.includes("grafik")
            ) {
                return "Bilder & Grafiken"
            }
            if (
                criteriaStr.includes("video") ||
                criteriaStr.includes("audio") ||
                criteriaStr.includes("medien")
            ) {
                return "Multimedia"
            }
            if (
                criteriaStr.includes("kontrast") ||
                criteriaStr.includes("farbe") ||
                criteriaStr.includes("color")
            ) {
                return "Farben & Kontrast"
            }
            if (
                criteriaStr.includes("tastatur") ||
                criteriaStr.includes("keyboard") ||
                criteriaStr.includes("navigation")
            ) {
                return "Tastatur & Navigation"
            }
            if (
                criteriaStr.includes("fokus") ||
                criteriaStr.includes("focus")
            ) {
                return "Fokus & Hervorhebung"
            }
            if (
                criteriaStr.includes("text") ||
                criteriaStr.includes("schrift") ||
                criteriaStr.includes("font")
            ) {
                return "Text & Schrift"
            }
            if (
                criteriaStr.includes("formular") ||
                criteriaStr.includes("form") ||
                criteriaStr.includes("eingabe")
            ) {
                return "Formulare"
            }
            if (
                criteriaStr.includes("sprache") ||
                criteriaStr.includes("language") ||
                criteriaStr.includes("lang")
            ) {
                return "Sprache"
            }
            if (
                criteriaStr.includes("struktur") ||
                criteriaStr.includes("markup") ||
                criteriaStr.includes("html")
            ) {
                return "Struktur & Markup"
            }
            if (
                criteriaStr.includes("timing") ||
                criteriaStr.includes("zeit") ||
                criteriaStr.includes("timeout")
            ) {
                return "Timing & Zeitlimits"
            }

            return "Sonstige" // Fallback
        }

        /**
         * Debug-Methode: Zeigt die Struktur der Sammlungen an
         * @param {Object} collections - Sammlungen aus localStorage
         * @returns {Object} Statistik-Objekt
         */
        debugCollections(collections) {
            console.group("🔍 Sammlungen-Analyse")

            Object.entries(collections).forEach(
                ([collectionName, criteriaIds]) => {
                    console.group(`📋 Sammlung: ${collectionName}`)
                    console.log(`📊 Anzahl Kriterien: ${criteriaIds.length}`)
                    console.log(`🏷️ Kriterien-IDs:`, criteriaIds)

                    // Analysiere Kriterien-Pattern
                    const categories =
                        this.analyzeCriteriaCategories(criteriaIds)
                    console.log(`📂 Kategorien:`, categories)

                    // Konformitätslevel-Analyse
                    const levels = {}
                    criteriaIds.forEach((id) => {
                        const level = this.extractConformanceLevel(id)
                        levels[level] = (levels[level] || 0) + 1
                    })
                    console.log(`📈 Konformitätslevel:`, levels)

                    console.groupEnd()
                }
            )

            // Gesamtstatistik
            const allCriteriaIds = Object.values(collections).flat()
            const uniqueCriteria = new Set(allCriteriaIds)
            const duplicates = allCriteriaIds.length - uniqueCriteria.size

            console.log(`📈 Gesamtstatistik:`)
            console.log(`  • Sammlungen: ${Object.keys(collections).length}`)
            console.log(`  • Gesamte Kriterien: ${allCriteriaIds.length}`)
            console.log(`  • Einzigartige Kriterien: ${uniqueCriteria.size}`)
            console.log(`  • Knotenpunkte (mehrfach verwendet): ${duplicates}`)

            console.groupEnd()

            return {
                collections: Object.keys(collections).length,
                totalCriteria: allCriteriaIds.length,
                uniqueCriteria: uniqueCriteria.size,
                junctionPoints: duplicates,
            }
        }

        /**
         * Analysiert die Kategorien der Kriterien in einer Sammlung
         * @param {Array} criteriaIds - Array von Kriterien-IDs
         * @returns {Object} Kategorie-Statistik
         */
        analyzeCriteriaCategories(criteriaIds) {
            const categories = {}

            criteriaIds.forEach((id) => {
                const category = this.extractCategory(id)
                categories[category] = (categories[category] || 0) + 1
            })

            return categories
        }
    } // <-- HIER ist die schließende Klammer der ImportManager-Klasse

    // Füge diese Klasse NACH der ImportManager-Klasse hinzu:

    /**
     * Storage management class - VOLLSTÄNDIGE IMPLEMENTIERUNG
     */
    class StorageManager {
        constructor(app) {
            this.app = app
            this.STORAGE_KEY = "metroData"
        }

        /**
         * Speichert alle App-Daten im localStorage
         */
        saveToStorage() {
            const data = {
                stationCounter: this.app.stationCounter,
                lineCounter: this.app.lineCounter,
                stations: this.app.stations.map((station) => ({
                    id: station.id,
                    name: station.name,
                    x: station.x,
                    y: station.y,
                    criteriaId: station.criteriaId,
                    originalCriteria: station.originalCriteria,
                    collections: station.collections,
                    isJunctionPoint: station.isJunctionPoint,
                    title: station.title,
                    conformanceLevel: station.conformanceLevel,
                    category: station.category,
                })),
                lines: this.app.lines.map((line) => ({
                    id: line.id,
                    station1: {
                        id: line.station1.id,
                        name: line.station1.name,
                    },
                    station2: {
                        id: line.station2.id,
                        name: line.station2.name,
                    },
                    color: line.color,
                    name: line.name,
                    route: line.route,
                    collectionName: line.collectionName,
                })),
                routes: this.app.routes,
                stationGroups: this.app.stationGroups,
                timestamp: new Date().toISOString(),
            }

            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data))
            console.log("💾 Daten gespeichert:", {
                stationen: data.stations.length,
                linien: data.lines.length,
                routen: data.routes.length,
            })
        }

        /**
         * Lädt App-Daten aus dem localStorage
         */
        loadFromStorage() {
            const storedData = localStorage.getItem(this.STORAGE_KEY)
            if (storedData) {
                try {
                    const data = JSON.parse(storedData)
                    console.log("📦 Lade Daten aus localStorage:", data)

                    this.app.stationCounter = data.stationCounter || 1
                    this.app.lineCounter = data.lineCounter || 1

                    // Stationen wiederherstellen
                    this.app.stations = data.stations.map((stationData) => {
                        const station = new Station(
                            stationData.id,
                            stationData.name,
                            stationData.x,
                            stationData.y
                        )

                        // Zusätzliche Eigenschaften wiederherstellen
                        if (stationData.criteriaId)
                            station.criteriaId = stationData.criteriaId
                        if (stationData.originalCriteria)
                            station.originalCriteria =
                                stationData.originalCriteria
                        if (stationData.collections)
                            station.collections = stationData.collections
                        if (stationData.isJunctionPoint !== undefined)
                            station.isJunctionPoint =
                                stationData.isJunctionPoint
                        if (stationData.title) station.title = stationData.title
                        if (stationData.conformanceLevel)
                            station.conformanceLevel =
                                stationData.conformanceLevel
                        if (stationData.category)
                            station.category = stationData.category

                        return station
                    })

                    // Linien wiederherstellen
                    this.app.lines = data.lines
                        .map((lineData) => {
                            const station1 = this.getStationById(
                                lineData.station1.id
                            )
                            const station2 = this.getStationById(
                                lineData.station2.id
                            )

                            if (!station1 || !station2) {
                                console.warn(
                                    `⚠️ Linie ${lineData.id} konnte nicht wiederhergestellt werden`
                                )
                                return null
                            }

                            const line = new Line(
                                lineData.id,
                                station1,
                                station2,
                                lineData.color,
                                lineData.name
                            )
                            if (lineData.route) line.route = lineData.route
                            if (lineData.collectionName)
                                line.collectionName = lineData.collectionName

                            return line
                        })
                        .filter((line) => line !== null)

                    this.app.routes = data.routes || []
                    this.app.stationGroups = data.stationGroups || []

                    console.log(
                        `✅ Daten geladen: ${this.app.stations.length} Stationen, ${this.app.lines.length} Linien`
                    )

                    // Stationen und Linien visuell rendern
                    this.renderLoadedData()
                } catch (error) {
                    console.error("❌ Fehler beim Laden der Daten:", error)
                }
            } else {
                console.log("ℹ️ Keine gespeicherten Daten gefunden")
            }
        }

        /**
         * Rendert geladene Daten visuell
         */
        renderLoadedData() {
            console.log("🎨 Rendere geladene Daten...")

            // Canvas leeren
            this.app.canvasManager.clearCanvas()

            // Stationen rendern
            this.app.stations.forEach((station) => {
                this.app.stationManager.renderStation(station)
            })

            // Linien rendern
            this.app.lines.forEach((line) => {
                this.app.lineManager.renderLine(line)
            })

            // Stationsliste aktualisieren
            this.app.stationListManager.updateStationList()
        }

        /**
         * Löscht alle gespeicherten Metro-Daten
         */
        clearStorage() {
            localStorage.removeItem(this.STORAGE_KEY)
            console.log("🗑️ Metro-Daten aus localStorage gelöscht")
        }

        /**
         * Hilfsmethode: Station anhand ID finden
         */
        getStationById(stationId) {
            return (
                this.app.stations.find((station) => station.id === stationId) ||
                null
            )
        }

        /**
         * Lädt Sammlungen aus localStorage
         */
        getCollections() {
            try {
                const data = localStorage.getItem("bitvCollections")
                if (!data) return null

                const collections = JSON.parse(data)
                return collections
            } catch (error) {
                console.error("❌ Fehler beim Laden der Sammlungen:", error)
                return null
            }
        }

        /**
         * Aktualisiert den Status des Import-Buttons
         */
        updateImportButtonState(hasCollections) {
            const importButton = document.getElementById("importCollectionsBtn")
            if (importButton) {
                if (hasCollections) {
                    importButton.disabled = false
                    importButton.style.opacity = "1"
                } else {
                    importButton.disabled = true
                    importButton.style.opacity = "0.5"
                }
            }
        }

        /**
         * Exportiert Metro-Daten als JSON
         */
        exportMetroData() {
            const data = {
                stationCounter: this.app.stationCounter,
                lineCounter: this.app.lineCounter,
                stations: this.app.stations,
                lines: this.app.lines,
                routes: this.app.routes,
                stationGroups: this.app.stationGroups,
                exportTimestamp: new Date().toISOString(),
                version: "1.0",
            }

            return JSON.stringify(data, null, 2)
        }

        /**
         * Importiert Metro-Daten aus JSON
         */
        importMetroData(jsonString) {
            try {
                const data = JSON.parse(jsonString)

                if (!data.stations || !Array.isArray(data.stations)) {
                    throw new Error("Ungültige Datenstruktur")
                }

                // App zurücksetzen
                this.app.reset()

                // Daten laden
                this.app.stationCounter = data.stationCounter || 1
                this.app.lineCounter = data.lineCounter || 1
                this.app.stations = data.stations || []
                this.app.lines = data.lines || []
                this.app.routes = data.routes || []
                this.app.stationGroups = data.stationGroups || []

                // Visuell rendern
                this.renderLoadedData()

                // Speichern
                this.saveToStorage()

                console.log("📥 Metro-Daten erfolgreich importiert")
                return true
            } catch (error) {
                console.error("❌ Fehler beim Importieren:", error)
                return false
            }
        }

        /**
         * Stellt Backup wieder her
         */
        restoreBackup() {
            const backupData = localStorage.getItem("metroData_backup")
            if (!backupData) {
                console.warn("⚠️ Kein Backup gefunden")
                return false
            }

            try {
                return this.importMetroData(backupData)
            } catch (error) {
                console.error("❌ Fehler beim Wiederherstellen:", error)
                return false
            }
        }
    }

    // In der Browser-Konsole ausführen:
    async function testCriteriasJson() {
        try {
            const response = await fetch("./assets/data/criterias.json")
            const data = await response.json()

            console.log("📄 criterias.json Struktur:", data)

            if (data.sections) {
                data.sections.forEach((section, i) => {
                    console.log(`Sektion ${i}:`, Object.keys(section))

                    Object.values(section).forEach((category, j) => {
                        if (category.pruefschritte) {
                            console.log(
                                `  Kategorie ${j}: ${category.pruefschritte.length} Prüfschritte`
                            )
                            category.pruefschritte
                                .slice(0, 3)
                                .forEach((criteria) => {
                                    console.log(
                                        `    ${criteria.id}: ${criteria.title}`
                                    )
                                })
                        }
                    })
                })
            }
        } catch (error) {
            console.error("Fehler:", error)
        }
    }

    /**
     * Import/Export Button und Handler
     */

    async function handleCollectionsImport() {
        if (!window.app?.importManager) {
            console.error("❌ ImportManager nicht verfügbar")
            alert(
                "ImportManager nicht verfügbar. Bitte laden Sie die Seite neu."
            )
            return
        }

        // Vor dem Import: Debug-Ausgabe
        console.log("🔍 Analysiere aktuelle localStorage-Daten:")
        debugLocalStorage()

        const confirmImport = confirm(
            "🚇 Metro-Karte aus Sammlungen erstellen?\n\n" +
                "Dies analysiert Ihre Sammlungen und erstellt entsprechende Stationen.\n" +
                "Die Stationen werden mit vollständigen Namen und Konformitätslevel angezeigt.\n" +
                "Schauen Sie in die Browser-Konsole für Details.\n\n" +
                "Fortfahren?"
        )

        if (confirmImport) {
            try {
                await window.app.importManager.importAndLoadCollections()
            } catch (error) {
                console.error("❌ Import-Fehler:", error)
                alert(
                    `Fehler beim Import: ${error.message}\n\nPrüfen Sie die Konsole für Details.`
                )
            }
        }
    }

    /**
     * App initialization
     */
    const app = new MetroApp()
    window.app = app

    // Import-Button hinzufügen
    setTimeout(() => {
        const header = document.querySelector(".header")
        if (header) {
            const buttonContainer = header.querySelector("div:last-child")

            if (
                buttonContainer &&
                !document.getElementById("importCollectionsBtn")
            ) {
                const importButton = document.createElement("button")
                importButton.id = "importCollectionsBtn"
                importButton.textContent = "Sammlungen importieren"
                importButton.addEventListener("click", handleCollectionsImport)
                buttonContainer.appendChild(importButton)
            }
        }
    }, 500)

    // Füge nach dem Import-Button einen Debug-Button hinzu:

    setTimeout(() => {
        const header = document.querySelector(".header")
        if (header) {
            const buttonContainer = header.querySelector("div:last-child")

            if (
                buttonContainer &&
                !document.getElementById("debugStorageBtn")
            ) {
                const debugButton = document.createElement("button")
                debugButton.id = "debugStorageBtn"
                debugButton.textContent = "🔍 Debug Storage"
                debugButton.style.marginLeft = "10px"
                debugButton.style.backgroundColor = "#6B46C1"
                debugButton.style.color = "white"
                debugButton.style.border = "none"
                debugButton.style.padding = "8px 12px"
                debugButton.style.borderRadius = "4px"
                debugButton.style.cursor = "pointer"

                debugButton.addEventListener("click", () => {
                    console.log("🔍 MANUAL DEBUG - Aktuelle App-Daten:")
                    console.log(
                        "  Stationen in App:",
                        window.app.stations.length
                    )
                    console.log("  Linien in App:", window.app.lines.length)
                    console.log(
                        "  App-Stationen:",
                        window.app.stations.map((s) => ({
                            id: s.id,
                            name: s.name,
                            x: s.x,
                            y: s.y,
                        }))
                    )

                    debugStoredData()
                    debugLocalStorage()

                    // Force Save
                    console.log("💾 Erzwinge Speicherung...")
                    window.app.storageManager.saveToStorage()
                })

                buttonContainer.appendChild(debugButton)
            }
        }
    }, 600)

    // Erweitere die Button-Erstellung um Export/Import-Funktionen:

    setTimeout(() => {
        const header = document.querySelector(".header")
        if (header) {
            const buttonContainer = header.querySelector("div:last-child")

            // Export-Button
            if (buttonContainer && !document.getElementById("exportBtn")) {
                const exportButton = document.createElement("button")
                exportButton.id = "exportBtn"
                exportButton.textContent = "📤 Export"
                exportButton.style.marginLeft = "10px"
                exportButton.style.backgroundColor = "#10B981"
                exportButton.style.color = "white"
                exportButton.style.border = "none"
                exportButton.style.padding = "8px 12px"
                exportButton.style.borderRadius = "4px"
                exportButton.style.cursor = "pointer"

                exportButton.addEventListener("click", () => {
                    const jsonData = window.app.storageManager.exportMetroData()

                    // Download als Datei
                    const blob = new Blob([jsonData], {
                        type: "application/json",
                    })
                    const url = URL.createObjectURL(blob)
                    const a = document.createElement("a")
                    a.href = url
                    a.download = `metro-karte-${
                        new Date().toISOString().split("T")[0]
                    }.json`
                    document.body.appendChild(a)
                    a.click()
                    document.body.removeChild(a)
                    URL.revokeObjectURL(url)

                    console.log("📤 Metro-Karte exportiert")
                })

                buttonContainer.appendChild(exportButton)
            }

            // Import-Button
            if (buttonContainer && !document.getElementById("importBtn")) {
                const importButton = document.createElement("button")
                importButton.id = "importBtn"
                importButton.textContent = "📥 Import"
                importButton.style.marginLeft = "10px"
                importButton.style.backgroundColor = "#3B82F6"
                importButton.style.color = "white"
                importButton.style.border = "none"
                importButton.style.padding = "8px 12px"
                importButton.style.borderRadius = "4px"
                importButton.style.cursor = "pointer"

                importButton.addEventListener("click", () => {
                    const input = document.createElement("input")
                    input.type = "file"
                    input.accept = ".json"

                    input.addEventListener("change", (e) => {
                        const file = e.target.files[0]
                        if (file) {
                            const reader = new FileReader()
                            reader.onload = (e) => {
                                const success =
                                    window.app.storageManager.importMetroData(
                                        e.target.result
                                    )
                                if (success) {
                                    alert(
                                        "✅ Metro-Karte erfolgreich importiert!"
                                    )
                                }
                            }
                            reader.readAsText(file)
                        }
                    })

                    input.click()
                })

                buttonContainer.appendChild(importButton)
            }

            // Backup-Restore-Button
            if (buttonContainer && !document.getElementById("restoreBtn")) {
                const restoreButton = document.createElement("button")
                restoreButton.id = "restoreBtn"
                restoreButton.textContent = "🔄 Backup"
                restoreButton.style.marginLeft = "10px"
                restoreButton.style.backgroundColor = "#F59E0B"
                restoreButton.style.color = "white"
                restoreButton.style.border = "none"
                restoreButton.style.padding = "8px 12px"
                restoreButton.style.borderRadius = "4px"
                restoreButton.style.cursor = "pointer"

                restoreButton.addEventListener("click", () => {
                    if (
                        confirm(
                            "Möchten Sie das letzte Backup wiederherstellen?\n\nDies überschreibt die aktuellen Daten."
                        )
                    ) {
                        const success =
                            window.app.storageManager.restoreBackup()
                        if (success) {
                            alert("✅ Backup erfolgreich wiederhergestellt!")
                        } else {
                            alert(
                                "❌ Kein Backup gefunden oder Fehler beim Wiederherstellen."
                            )
                        }
                    }
                })

                buttonContainer.appendChild(restoreButton)
            }
        }
    }, 700)

    // Cleanup
    window.addEventListener("beforeunload", () => {
        if (window.app?.storageManager) {
            window.app.storageManager.destroy()
        }
    })

    // Erweitere die debugLocalStorage-Funktion für detaillierte Kriterien-Analyse:

    function debugLocalStorage() {
        console.group("🗄️ localStorage Debug - TIEFE OBJEKTANALYSE")

        const collectionsData = localStorage.getItem("bitvCollections")

        if (collectionsData) {
            try {
                const collections = JSON.parse(collectionsData)
                console.log("📋 RAW Collections Data:", collections)

                // TIEFE ANALYSE der Objektstruktur
                Object.entries(collections).forEach(
                    ([collectionName, criteriaArray]) => {
                        console.group(`📋 Sammlung: "${collectionName}"`)
                        console.log(
                            "📊 Anzahl Kriterien:",
                            criteriaArray.length
                        )
                        console.log("🏷️ RAW Kriterien-Array:", criteriaArray)

                        // JEDEN EINZELNEN EINTRAG analysieren
                        criteriaArray.forEach((criteria, index) => {
                            console.group(`🔍 Kriterium ${index + 1}:`)
                            console.log("Typ:", typeof criteria)
                            console.log("Wert:", criteria)
                            console.log("String-Darstellung:", String(criteria))

                            if (typeof criteria === "object") {
                                console.log(
                                    "Objekt-Keys:",
                                    Object.keys(criteria)
                                )
                                console.log(
                                    "Objekt-Values:",
                                    Object.values(criteria)
                                )
                                console.log(
                                    "JSON-String:",
                                    JSON.stringify(criteria)
                                )

                                // Prüfe auf gängige Properties
                                if (criteria.id)
                                    console.log("📌 ID gefunden:", criteria.id)
                                if (criteria.name)
                                    console.log(
                                        "📌 Name gefunden:",
                                        criteria.name
                                    )
                                if (criteria.title)
                                    console.log(
                                        "📌 Title gefunden:",
                                        criteria.title
                                    )
                                if (criteria.text)
                                    console.log(
                                        "📌 Text gefunden:",
                                        criteria.text
                                    )
                                if (criteria.content)
                                    console.log(
                                        "📌 Content gefunden:",
                                        criteria.content
                                    )
                            }
                            console.groupEnd()
                        })

                        console.groupEnd()
                    }
                )
            } catch (e) {
                console.error("❌ Fehler beim Parsen der Sammlungen:", e)
            }
        } else {
            console.log("❌ Keine bitvCollections im localStorage gefunden")
        }

        console.groupEnd()
    }

    // Sofort ausführen
    debugLocalStorage()

    // Sofortige Analyse beim Laden
    setTimeout(() => {
        console.log("🔍 AUTOMATISCHE ANALYSE beim Seitenaufbau:")
        debugLocalStorage()

        // Prüfe ob Import möglich ist
        const collections = window.app?.storageManager?.getCollections()
        if (collections && Object.keys(collections).length > 0) {
            console.log("✅ Import-Button sollte aktiviert sein")
            console.log(
                "💡 Verwenden Sie 'Sammlungen importieren' um Metro-Karte zu erstellen"
            )
        } else {
            console.log("ℹ️ Keine Sammlungen gefunden - Import nicht möglich")
        }
    }, 1000)

    // Erweitere die Debug-Funktionen:

    function debugStoredData() {
        console.group("🗄️ Debug: Gespeicherte Metro-Daten")

        const storedData = localStorage.getItem("metroData")
        if (storedData) {
            try {
                const data = JSON.parse(storedData)
                console.log("📦 Gespeicherte Daten:", data)
                console.log(`📊 Statistik:`)
                console.log(`  • Stationen: ${data.stations?.length || 0}`)
                console.log(`  • Linien: ${data.lines?.length || 0}`)
                console.log(`  • Routen: ${data.routes?.length || 0}`)
                console.log(
                    `  • Zeitstempel: ${data.timestamp || "nicht verfügbar"}`
                )

                // Erste paar Stationen anzeigen
                if (data.stations?.length > 0) {
                    console.log("🚉 Erste 5 Stationen:")
                    data.stations.slice(0, 5).forEach((station, index) => {
                        console.log(
                            `  ${index + 1}. ${station.name} (${
                                station.id
                            }) - Pos: ${Math.round(station.x)},${Math.round(
                                station.y
                            )}`
                        )
                    })
                }
            } catch (error) {
                console.error(
                    "❌ Fehler beim Parsen der gespeicherten Daten:",
                    error
                )
            }
        } else {
            console.log("ℹ️ Keine Metro-Daten im localStorage gefunden")
        }

        console.groupEnd()
    }

    // Sofort verfügbar machen
    window.debugStoredData = debugStoredData
})
