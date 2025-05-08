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
      this.id = id;
      this.name = name;
      this.x = x;
      this.y = y;
      this.connections = [];
    }
  }

  class Line {
    constructor(id, station1, station2, color, name) {
      this.id = id;
      this.station1 = station1;
      this.station2 = station2;
      this.color = color;
      this.name = name;
      this.route = null; // Referenz zur Route
    }
  }

  /**
   * Main application class
   */
  class MetroApp {
    constructor() {
      // Bestehender Code
      this.stations = [];
      this.lines = [];
      this.routes = []; // Neu: Array für Strecken/Linien
      this.stationGroups = [];
      this.selectedStations = [];
      this.stationCounter = 1;
      this.lineCounter = 1;
      this.lineColors = ["#FF0000", "#00AA00", "#0000FF", "#FFA500", "#800080", "#00FFFF", "#FF00FF", "#FFFF00", "#964B00", "#808080"];

      // Component managers
      this.canvasManager = new CanvasManager(this);
      this.stationManager = new StationManager(this);
      this.lineManager = new LineManager(this);
      this.routeManager = new RouteManager(this); // Neue Route-Manager
      this.selectionManager = new SelectionManager(this);
      this.storageManager = new StorageManager(this);
      this.uiManager = new UIManager(this);
      this.eventManager = new EventManager(this);
      this.stationListManager = new StationListManager(this);

      // Initialize the application
      this.init();
    }

    init() {
      // Existing code
      this.canvasManager.init();
      this.uiManager.init();
      this.eventManager.init();

      // Initialize station list
      this.stationListManager.init();

      // Load saved data
      this.storageManager.loadFromStorage();

      // Update canvas transform
      this.canvasManager.updateCanvasTransform();
    }

    // Reset the entire application state
    reset() {
      this.stations = [];
      this.lines = [];
      this.stationGroups = [];
      this.selectedStations = [];
      this.stationCounter = 1;
      this.lineCounter = 1;

      // Clear canvas
      this.canvasManager.clearCanvas();

      // Reset view
      this.canvasManager.resetView();

      // Clear storage
      this.storageManager.clearStorage();

      console.log("Application reset complete");
    }
  }

  /**
   * Canvas management class
   */
  class CanvasManager {
    constructor(app) {
      this.app = app;
      this.canvas = document.getElementById("canvas");
      // Fixed scale = 1, no zooming
      this.offsetX = 0;
      this.offsetY = 0;
      this.isDragging = false;
      this.lastPanX = 0;
      this.lastPanY = 0;
      this.CANVAS_WIDTH = 1000;
      this.CANVAS_HEIGHT = 1000;
    }

    init() {
      this.resetView();
    }

    resetView() {
      this.offsetX = (window.innerWidth - this.CANVAS_WIDTH) / 2;
      this.offsetY = (window.innerHeight - this.CANVAS_HEIGHT) / 2;

      // Ensure canvas is visible in viewport
      this.offsetX = Math.min(0, Math.max(this.offsetX, window.innerWidth - this.CANVAS_WIDTH));
      this.offsetY = Math.min(0, Math.max(this.offsetY, window.innerHeight - this.CANVAS_HEIGHT));

      this.updateCanvasTransform();
    }

    updateCanvasTransform() {
      // No scale, only translate
      this.canvas.style.transform = `translate(${this.offsetX}px, ${this.offsetY}px)`;
    }

    clearCanvas() {
      while (this.canvas.firstChild) {
        this.canvas.removeChild(this.canvas.firstChild);
      }
    }

    screenToCanvasCoords(clientX, clientY) {
      const rect = this.canvas.getBoundingClientRect();

      // Simplified coordinate conversion without scaling
      return {
        x: clientX - rect.left,
        y: clientY - rect.top,
      };
    }

    constrainToCanvas(x, y) {
      return {
        x: Math.max(0, Math.min(this.CANVAS_WIDTH, x)),
        y: Math.max(0, Math.min(this.CANVAS_HEIGHT, y)),
      };
    }

    startPan(x, y) {
      this.isDragging = true;
      this.lastPanX = x;
      this.lastPanY = y;
      this.canvas.style.cursor = "grabbing";
    }

    pan(x, y) {
      if (this.isDragging) {
        const dx = x - this.lastPanX;
        const dy = y - this.lastPanY;

        this.offsetX += dx;
        this.offsetY += dy;

        this.lastPanX = x;
        this.lastPanY = y;

        this.updateCanvasTransform();
      }
    }

    endPan() {
      this.isDragging = false;
      this.canvas.style.cursor = "default";
    }

    centerViewOn(x, y) {
      const canvasRect = this.canvas.parentElement.getBoundingClientRect();
      this.offsetX = canvasRect.width / 2 - x;
      this.offsetY = canvasRect.height / 2 - y;
      this.updateCanvasTransform();
    }
  }

  /**
   * Station management class
   */
  class StationManager {
    constructor(app) {
      this.app = app;
    }

    createStation(x, y) {
      // Constrain coordinates to canvas bounds
      const constrained = this.app.canvasManager.constrainToCanvas(x, y);

      // Check if station is on an existing line
      const intersectingLine = this.findIntersectingLine(constrained.x, constrained.y);

      // Create new station object
      const station = new Station(`station-${this.app.stationCounter++}`, `Station ${this.app.stationCounter - 1}`, constrained.x, constrained.y);

      // Add to stations array
      this.app.stations.push(station);

      // Render the station
      this.renderStation(station);

      // If station is on a line, connect it
      if (intersectingLine) {
        this.connectStationToLine(station, intersectingLine);
      }

      // Save changes
      this.app.storageManager.saveToStorage();

      // Update station list
      this.app.stationListManager.updateStationList();

      return station;
    }

    // Find if a point intersects with any line
    findIntersectingLine(x, y) {
      const threshold = 5; // Distance tolerance in pixels

      for (const line of this.app.lines) {
        // Get line endpoints
        const x1 = line.station1.x;
        const y1 = line.station1.y;
        const x2 = line.station2.x;
        const y2 = line.station2.y;

        // Calculate distance from point to line segment
        const distance = this.distanceToLineSegment(x1, y1, x2, y2, x, y);

        if (distance <= threshold) {
          return line;
        }
      }

      return null;
    }

    // Calculate distance from point to line segment
    distanceToLineSegment(x1, y1, x2, y2, px, py) {
      // Calculate line length squared
      const lengthSq = (x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1);

      if (lengthSq === 0) {
        // Line segment is a point
        return Math.sqrt((px - x1) * (px - x1) + (py - y1) * (py - y1));
      }

      // Calculate projection factor
      let t = ((px - x1) * (x2 - x1) + (py - y1) * (y2 - y1)) / lengthSq;
      t = Math.max(0, Math.min(1, t));

      // Calculate closest point on line segment
      const projX = x1 + t * (x2 - x1);
      const projY = y1 + t * (y2 - y1);

      // Calculate distance to closest point
      return Math.sqrt((px - projX) * (px - projX) + (py - projY) * (py - projY));
    }

    // Connect a station to an intersecting line
    connectStationToLine(station, line) {
      // Create two new lines to replace the original
      const station1 = line.station1;
      const station2 = line.station2;
      const color = line.color;
      const linePrefix = line.name.split(" ")[0]; // Get "Line" part of the name

      // Delete the original line
      this.app.lineManager.deleteLine(line);

      // Create two new lines
      const line1 = this.app.lineManager.createLine(station1, station, color, `${linePrefix} ${this.app.lineCounter - 1}a`);
      const line2 = this.app.lineManager.createLine(station, station2, color, `${linePrefix} ${this.app.lineCounter - 1}b`);

      // Highlight the new station to show it was added to a line
      const stationElement = document.getElementById(station.id);
      if (stationElement) {
        stationElement.classList.add("line-connected");
        setTimeout(() => {
          stationElement.classList.remove("line-connected");
        }, 1500);
      }
    }

    renderStation(station) {
      // Remove existing station if present
      const existingElement = document.getElementById(station.id);
      if (existingElement) {
        existingElement.remove();
      }

      // Create station SVG element
      const stationElement = document.createElementNS("http://www.w3.org/2000/svg", "g");
      stationElement.classList.add("station");
      stationElement.id = station.id;
      stationElement.dataset.id = station.id;

      // Circle for the station
      const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      circle.setAttribute("cx", 0);
      circle.setAttribute("cy", 0);
      circle.setAttribute("r", 8);

      // Text for station name
      const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
      text.classList.add("station-name");
      text.setAttribute("y", 22);
      text.textContent = station.name;

      // Add elements to the station
      stationElement.appendChild(circle);
      stationElement.appendChild(text);
      stationElement.setAttribute("transform", `translate(${station.x}, ${station.y})`);

      this.app.canvasManager.canvas.appendChild(stationElement);

      return stationElement;
    }

    updateStationPosition(station, newX, newY) {
      const group = this.findStationGroup(station.id);

      // Wenn die Station Teil einer Gruppe ist, die ganze Gruppe bewegen
      if (group) {
        this.moveStationGroup(station, newX, newY);
        return; // Wichtig: Hier den Rest der Methode nicht mehr ausführen
      }

      // Ab hier nur für einzelne Stationen, nicht für Gruppenmitglieder
      // Update station coordinates
      station.x = newX;
      station.y = newY;

      // Update station element
      const stationElement = document.getElementById(station.id);
      if (stationElement) {
        stationElement.setAttribute("transform", `translate(${station.x}, ${station.y})`);
      }

      // Update connected lines
      this.app.lineManager.updateConnectedLines(station);

      // Save changes
      this.app.storageManager.saveToStorage();
    }

    updateStationName(station, newName) {
      console.log("Station umbenennen:", station.id, "von", station.name, "zu", newName);
      console.log("Vor der Umbenennung Stationen:", this.app.stations.length);

      // Update station name
      station.name = newName;

      // Update station element
      const stationElement = document.getElementById(station.id);
      if (stationElement) {
        const textElement = stationElement.querySelector("text");
        if (textElement) {
          textElement.textContent = newName;
        }
      } else {
        console.warn("Station-Element nicht gefunden:", station.id);
        // Wichtig: KEINE vollständige Neuzeichnung versuchen!
      }

      // Stationsliste aktualisieren, auch wenn die Station nicht verbunden ist
      this.app.stationListManager.updateStationList();

      // Wenn die Station zu einer Gruppe gehört, den Gruppennamen aktualisieren
      const group = this.findStationGroup(station.id);
      if (group) {
        console.log("Station ist Teil einer Gruppe:", group.id);
        const groupBaseName = this.getGroupBaseName(group);
        group.name = groupBaseName;
        this.renderStationGroup(group);
      }

      console.log("Nach der Umbenennung Stationen:", this.app.stations.length);

      // Änderungen speichern OHNE vollständige Neuzeichnung
      // ENTFERNE: this.renderStation(station);

      // Save changes
      this.app.storageManager.saveToStorage();
    }

    updateStationList() {
      const stationList = document.getElementById("stationList");
      stationList.innerHTML = "";

      // Stationen sortieren, falls nötig
      let sortedStations = [...this.app.stations];
      if (this.sortMode === "name") {
        sortedStations.sort((a, b) => a.name.localeCompare(b.name));
      } else if (this.sortMode === "id") {
        sortedStations.sort((a, b) => a.id.localeCompare(b.id));
      }

      // Create list items for each station
      for (const station of sortedStations) {
        const item = document.createElement("div");
        item.className = "station-item";
        if (this.app.selectedStations.includes(station)) {
          item.classList.add("selected");
        }

        const routesForStation = this.app.routeManager.getRoutesForStation(station);
        const hasConnections = routesForStation.length > 0;

        // Erstellen des Stations-Icons
        const stationColor = document.createElement("div");
        stationColor.className = "station-color";

        // Hervorheben von nicht verbundenen Stationen mit rotem Rand
        if (!hasConnections) {
          stationColor.style.border = "1px solid red";
        }

        const stationName = document.createElement("span");
        stationName.textContent = station.name;

        const stationId = document.createElement("span");
        stationId.className = "station-id";
        stationId.textContent = station.id;

        item.appendChild(stationColor);
        item.appendChild(stationName);
        item.appendChild(stationId);

        // Routen-Marker hinzufügen, wenn vorhanden
        if (routesForStation.length > 0) {
          const routesContainer = document.createElement("div");
          routesContainer.className = "station-routes";

          for (const route of routesForStation) {
            const routeMarker = document.createElement("div");
            routeMarker.className = "route-marker";
            routeMarker.style.backgroundColor = route.color;
            routesContainer.appendChild(routeMarker);
          }

          item.appendChild(routesContainer);
        }

        item.addEventListener("click", (e) => this.handleStationItemClick(e, station));
        stationList.appendChild(item);
      }
    }

    deleteStation(station) {
      // Remove connected lines first
      const linesToRemove = this.app.lines.filter((line) => line.station1.id === station.id || line.station2.id === station.id);

      for (const line of linesToRemove) {
        this.app.lineManager.deleteLine(line);
      }

      // Remove from selection if selected
      this.app.selectionManager.deselectStation(station);

      // Remove station from array
      const index = this.app.stations.indexOf(station);
      if (index !== -1) {
        this.app.stations.splice(index, 1);
      }

      // Remove from DOM
      const stationElement = document.getElementById(station.id);
      if (stationElement) {
        stationElement.remove();
      }

      // Save changes
      this.app.storageManager.saveToStorage();

      // Update station list
      this.app.stationListManager.updateStationList();
    }

    createStationFromLine(line, x, y) {
      // Koordinaten innerhalb der Canvas-Grenzen halten
      const constrained = this.app.canvasManager.constrainToCanvas(x, y);

      // Neue Station mit dem Namen der Linie erstellen
      const station = new Station(
        `station-${this.app.stationCounter++}`,
        line.name, // Name der Linie übernehmen
        constrained.x,
        constrained.y
      );

      // Zur Station-Array hinzufügen
      this.app.stations.push(station);

      // Station rendern
      this.renderStation(station);

      // Ursprüngliche Linie entfernen
      const station1 = line.station1;
      const station2 = line.station2;
      const lineColor = line.color;

      this.app.lineManager.deleteLine(line);

      // Zwei neue Linien mit der gleichen Farbe erstellen
      this.app.lineManager.createLine(station1, station, lineColor);
      this.app.lineManager.createLine(station, station2, lineColor);

      // Station visuell hervorheben, um zu zeigen dass sie erstellt wurde
      const stationElement = document.getElementById(station.id);
      if (stationElement) {
        stationElement.classList.add("line-connected");
        setTimeout(() => {
          stationElement.classList.remove("line-connected");
        }, 1500);
      }

      // Änderungen speichern
      this.app.storageManager.saveToStorage();

      // Stationsliste aktualisieren
      this.app.stationListManager.updateStationList();

      return station;
    }

    // Aktualisierte splitStation-Methode
    splitStation(station) {
      // Ursprünglichen Namen speichern
      const baseName = station.name;

      // Erstelle eine zweite Station in der Nähe
      const offsetX = 30; // Abstand zwischen den geteilten Stationen
      const newStation = new Station(
        `station-${this.app.stationCounter++}`,
        `${baseName} Ost`, // Name der neuen Station
        station.x + offsetX,
        station.y
      );

      // Umbenennen der ursprünglichen Station
      this.updateStationName(station, `${baseName} West`);

      // Zur Stations-Array hinzufügen
      this.app.stations.push(newStation);

      // Station rendern
      this.renderStation(newStation);

      // Stationsgruppe erstellen oder aktualisieren
      let group = this.findStationGroup(station.id);

      if (!group) {
        group = {
          id: `group-${Date.now()}`,
          stations: [station.id, newStation.id],
          name: baseName, // Ursprünglicher Name ohne Zusatz
          orientation: "horizontal", // Standard-Ausrichtung
        };
        this.app.stationGroups.push(group);
      } else {
        group.stations.push(newStation.id);
      }

      // Bestehende Linien untersuchen und neu verteilen
      const connectedLines = this.app.lines.filter((line) => line.station1.id === station.id || line.station2.id === station.id);

      // Linien intelligent aufteilen: nach Richtung
      connectedLines.forEach((line) => {
        const otherStation = line.station1.id === station.id ? line.station2 : line.station1;

        // Wenn andere Station rechts, dann zur neuen Station
        if (otherStation.x > station.x) {
          if (line.station1.id === station.id) {
            line.station1 = newStation;
          } else {
            line.station2 = newStation;
          }
          this.app.lineManager.renderLine(line);
        }
      });

      // ÄNDERUNG: Keine Verbindungslinie mehr erstellen
      // Stattdessen visuellen Rahmen für die Gruppe rendern
      this.renderStationGroup(group);

      // Änderungen speichern
      this.app.storageManager.saveToStorage();

      // Stationsliste aktualisieren
      this.app.stationListManager.updateStationList();

      // Beide Stationen markieren
      this.app.selectionManager.clearSelection();
      this.app.selectionManager.isShiftActive = true; // Temporär für Mehrfachauswahl
      this.app.selectionManager.selectStation(station);
      this.app.selectionManager.selectStation(newStation);
      this.app.selectionManager.isShiftActive = false;

      return newStation;
    }

    // Neue Methode zum Rendern des Gruppenrahmens
    renderStationGroup(group) {
      // Bestehenden Rahmen entfernen falls vorhanden
      const existingGroup = document.getElementById(`group-${group.id}`);
      if (existingGroup) {
        existingGroup.remove();
      }

      // Stationen der Gruppe finden
      const groupStations = group.stations.map((id) => this.app.stations.find((s) => s.id === id)).filter((s) => s); // Nur existierende Stationen

      if (groupStations.length < 2) return;

      // Grenzen berechnen
      let minX = Infinity,
        minY = Infinity,
        maxX = -Infinity,
        maxY = -Infinity;
      for (const station of groupStations) {
        minX = Math.min(minX, station.x - 12);
        minY = Math.min(minY, station.y - 12);
        maxX = Math.max(maxX, station.x + 12);
        maxY = Math.max(maxY, station.y + 12);
      }

      // Rahmen erstellen
      const groupElement = document.createElementNS("http://www.w3.org/2000/svg", "g");
      groupElement.classList.add("station-group");
      groupElement.id = `group-${group.id}`;
      groupElement.dataset.id = group.id;

      // Rechteck für den Rahmen
      const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      rect.setAttribute("x", minX);
      rect.setAttribute("y", minY);
      rect.setAttribute("width", maxX - minX);
      rect.setAttribute("height", maxY - minY);
      rect.setAttribute("rx", 8); // Abgerundete Ecken
      rect.setAttribute("ry", 8);

      // Gruppenname
      const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
      text.classList.add("station-group-name");
      text.setAttribute("x", (minX + maxX) / 2);
      text.setAttribute("y", minY - 8);
      text.textContent = group.name;

      groupElement.appendChild(rect);
      groupElement.appendChild(text);

      // Vor den Stationen einfügen (damit Stationen im Vordergrund sind)
      const firstStation = this.app.canvasManager.canvas.querySelector(".station");
      if (firstStation) {
        this.app.canvasManager.canvas.insertBefore(groupElement, firstStation);
      } else {
        this.app.canvasManager.canvas.appendChild(groupElement);
      }

      return groupElement;
    }

    // Neue Methode zum Extrahieren einer Station aus einer Gruppe
    extractStationFromGroup(station) {
      // Gruppe finden, zu der die Station gehört
      const group = this.findStationGroup(station.id);
      if (!group) return null;

      // Station aus der Gruppe entfernen
      const index = group.stations.indexOf(station.id);
      if (index !== -1) {
        group.stations.splice(index, 1);
      }

      // Falls die Gruppe nur noch eine Station hat, die Gruppe auflösen
      if (group.stations.length <= 1) {
        const lastStationId = group.stations[0];
        const lastStation = this.app.stations.find((s) => s.id === lastStationId);

        if (lastStation) {
          // Original-Name wiederherstellen
          this.updateStationName(lastStation, group.name);
        }

        // Gruppe entfernen
        const groupIndex = this.app.stationGroups.indexOf(group);
        if (groupIndex !== -1) {
          this.app.stationGroups.splice(groupIndex, 1);
        }

        // Gruppen-Element entfernen
        const groupElement = document.getElementById(`group-${group.id}`);
        if (groupElement) {
          groupElement.remove();
        }
      } else {
        // Gruppe neu rendern
        this.renderStationGroup(group);
      }

      // Änderungen speichern
      this.app.storageManager.saveToStorage();

      return station;
    }

    // Methode zum gemeinsamen Bewegen von Stationsgruppen
    // Verbesserte moveStationGroup-Methode, die Rekursion vermeidet
    moveStationGroup(station, newX, newY) {
      // Finde die Gruppe, zu der die Station gehört
      const group = this.findStationGroup(station.id);
      if (!group) return;

      // Berechne den Bewegungsvektor
      const deltaX = newX - station.x;
      const deltaY = newY - station.y;

      // Alle Stationen in der Gruppe bewegen
      const groupStations = group.stations.map((id) => this.app.stations.find((s) => s.id === id)).filter((s) => s); // Nur existierende Stationen

      // Zuerst die ausgewählte Station direkt bewegen
      station.x = newX;
      station.y = newY;
      const stationElement = document.getElementById(station.id);
      if (stationElement) {
        stationElement.setAttribute("transform", `translate(${station.x}, ${station.y})`);
      }

      // Dann die anderen Stationen der Gruppe bewegen
      for (const groupStation of groupStations) {
        if (groupStation.id !== station.id) {
          const newStationX = groupStation.x + deltaX;
          const newStationY = groupStation.y + deltaY;

          // Position innerhalb der Canvas-Grenzen einschränken
          const constrained = this.app.canvasManager.constrainToCanvas(newStationX, newStationY);

          // Station DIREKT bewegen ohne Rekursion
          groupStation.x = constrained.x;
          groupStation.y = constrained.y;

          const element = document.getElementById(groupStation.id);
          if (element) {
            element.setAttribute("transform", `translate(${groupStation.x}, ${groupStation.y})`);
          }
        }
      }

      // Alle verbundenen Linien aktualisieren
      for (const groupStation of groupStations) {
        this.app.lineManager.updateConnectedLines(groupStation);
      }

      // Gruppenrahmen aktualisieren
      this.renderStationGroup(group);

      // Save changes
      this.app.storageManager.saveToStorage();
    }

    // Hilfsmethode zum Finden einer Stationsgruppe
    findStationGroup(stationId) {
      return this.app.stationGroups.find((group) => group.stations.includes(stationId));
    }

    // Neue Methode zum Rotieren einer Stationsgruppe
    rotateStationGroup(group) {
      // Stationen der Gruppe finden
      const groupStations = group.stations.map((id) => this.app.stations.find((s) => s.id === id)).filter((s) => s); // Nur existierende Stationen

      if (groupStations.length < 2) return;

      // Berechne den Mittelpunkt der Gruppe
      let centerX = 0,
        centerY = 0;
      for (const station of groupStations) {
        centerX += station.x;
        centerY += station.y;
      }
      centerX /= groupStations.length;
      centerY /= groupStations.length;

      // Ändere die Orientierung
      const newOrientation = group.orientation === "horizontal" ? "vertical" : "horizontal";
      group.orientation = newOrientation;

      // Abstände zwischen Stationen
      const spacing = 30;

      // Neu positionieren basierend auf der Orientierung
      groupStations.forEach((station, index) => {
        let newX, newY;

        if (newOrientation === "vertical") {
          // Vertikal anordnen (übereinander)
          newX = centerX;
          newY = centerY - ((groupStations.length - 1) * spacing) / 2 + index * spacing;
        } else {
          // Horizontal anordnen (nebeneinander)
          newX = centerX - ((groupStations.length - 1) * spacing) / 2 + index * spacing;
          newY = centerY;
        }

        // Position innerhalb der Canvas-Grenzen einschränken
        const constrained = this.app.canvasManager.constrainToCanvas(newX, newY);

        // Station bewegen, aber nicht über updateStationPosition, um Rekursion zu vermeiden
        station.x = constrained.x;
        station.y = constrained.y;

        // SVG-Element aktualisieren
        const stationElement = document.getElementById(station.id);
        if (stationElement) {
          stationElement.setAttribute("transform", `translate(${station.x}, ${station.y})`);
        }

        // Verbundene Linien aktualisieren
        this.app.lineManager.updateConnectedLines(station);
      });

      // Gruppenrahmen aktualisieren
      this.renderStationGroup(group);

      // Änderungen speichern
      this.app.storageManager.saveToStorage();
    }
  }

  /**
   * Station list management class
   */
  class StationListManager {
    constructor(app) {
      this.app = app;
      this.stationListElement = document.getElementById("stationList");
      this.sortNameBtn = document.getElementById("sortNameBtn");
      this.sortIdBtn = document.getElementById("sortIdBtn");
      this.sortByName = true; // Default sort
    }

    init() {
      // Add event listeners for sort buttons
      this.sortNameBtn.addEventListener("click", () => {
        this.sortByName = true;
        this.updateStationList();
      });

      this.sortIdBtn.addEventListener("click", () => {
        this.sortByName = false;
        this.updateStationList();
      });

      // Initial render
      this.updateStationList();
    }

    updateStationList() {
      // Clear the list
      this.stationListElement.innerHTML = "";

      // Sort stations
      const sortedStations = [...this.app.stations];
      if (this.sortByName) {
        sortedStations.sort((a, b) => a.name.localeCompare(b.name));
      } else {
        sortedStations.sort((a, b) => {
          const idA = parseInt(a.id.replace("station-", ""));
          const idB = parseInt(b.id.replace("station-", ""));
          return idA - idB;
        });
      }

      // Create station items
      for (const station of sortedStations) {
        const stationItem = document.createElement("div");
        stationItem.className = "station-item";
        stationItem.dataset.id = station.id;

        // Markierung für ausgewählte Stationen
        if (this.app.selectedStations.includes(station)) {
          stationItem.classList.add("selected");
        }

        const stationColor = document.createElement("div");
        stationColor.className = "station-color";

        const stationName = document.createElement("div");
        stationName.className = "station-name";
        stationName.textContent = station.name;

        const stationId = document.createElement("div");
        stationId.className = "station-id";
        stationId.textContent = `#${station.id.replace("station-", "")}`;

        // NEU: Linien/Routen anzeigen
        const stationRoutes = document.createElement("div");
        stationRoutes.className = "station-routes";

        // Routen für diese Station ermitteln
        const routes = this.app.routeManager.getRoutesForStation(station);

        if (routes.length > 0) {
          // Für jede Route einen farbigen Marker erstellen
          routes.forEach((route) => {
            const routeMarker = document.createElement("span");
            routeMarker.className = "route-marker";
            routeMarker.style.backgroundColor = route.color;
            routeMarker.title = route.name;
            stationRoutes.appendChild(routeMarker);
          });
        }

        // Elemente zusammenfügen
        stationItem.appendChild(stationColor);
        stationItem.appendChild(stationName);
        stationItem.appendChild(stationId);
        stationItem.appendChild(stationRoutes);

        // Klick-Event hinzufügen
        stationItem.addEventListener("click", (e) => this.handleStationItemClick(e, station));

        this.stationListElement.appendChild(stationItem);
      }

      // Show message if no stations
      if (sortedStations.length === 0) {
        const emptyMessage = document.createElement("div");
        emptyMessage.className = "empty-message";
        emptyMessage.textContent = "Keine Stationen vorhanden. Doppelklicke auf die Karte, um eine Station zu erstellen.";
        emptyMessage.style.padding = "15px";
        emptyMessage.style.color = "#666";
        emptyMessage.style.fontStyle = "italic";
        emptyMessage.style.textAlign = "center";

        this.stationListElement.appendChild(emptyMessage);
      }
    }

    handleStationItemClick(e, station) {
      // Select the station and center view
      if (e.shiftKey) {
        // If shift key pressed, add to selection
        this.app.selectionManager.selectStation(station);
      } else {
        // Otherwise, select only this station
        this.app.selectionManager.clearSelection();
        this.app.selectionManager.selectStation(station);
      }

      // Center the view on the station
      this.app.canvasManager.centerViewOn(station.x, station.y);

      // Update the list to reflect selection
      this.updateStationList();
    }

    getGroupBaseName(group) {
      return this.app.stationManager.getGroupBaseName(group);
    }
  }

  /**
   * Line management class
   */
  class LineManager {
    constructor(app) {
      this.app = app;
      this.currentDrawingLine = null;
    }

    createLine(station1, station2, customColor = null, customName = null) {
      // Check if line already exists
      const existingLine = this.app.lines.find(
        (line) => (line.station1.id === station1.id && line.station2.id === station2.id) || (line.station1.id === station2.id && line.station2.id === station1.id)
      );

      if (existingLine) {
        return null;
      }

      // Create new line
      // Farbe bestimmen
      const colorIndex = (this.app.lineCounter - 1) % this.app.lineColors.length;
      const lineColor = customColor || this.app.lineColors[colorIndex];

      // Route ermitteln oder erstellen
      const route = this.app.routeManager.getOrCreateRoute(lineColor);

      // Linie erstellen - GEÄNDERT: immer Route-Namen verwenden, keine individuellen Namen mehr
      const line = new Line(
        this.app.lineCounter++,
        station1,
        station2,
        lineColor,
        route.name // Immer den Namen der Route verwenden
      );

      // Route-Referenz zur Linie hinzufügen
      line.route = route;

      // Linie zur Route hinzufügen
      route.lines.push(line);

      // Rest des bestehenden Codes...
      this.app.lines.push(line);
      this.renderLine(line);
      station1.connections.push(station2.id);
      station2.connections.push(station1.id);
      this.app.storageManager.saveToStorage();

      return line;
    }

    renderLine(line) {
      // Remove existing line if present
      const existingElement = document.getElementById(`line-${line.id}`);
      if (existingElement) {
        existingElement.remove();
      }

      // Create line SVG element
      const lineElement = document.createElementNS("http://www.w3.org/2000/svg", "g");
      lineElement.classList.add("line");
      lineElement.id = `line-${line.id}`;
      lineElement.dataset.id = line.id;

      // Path for the line
      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path.setAttribute("stroke", line.color);
      path.setAttribute("stroke-width", "6");
      path.setAttribute("fill", "none");

      // Calculate line coordinates
      const x1 = line.station1.x;
      const y1 = line.station1.y;
      const x2 = line.station2.x;
      const y2 = line.station2.y;

      path.setAttribute("d", `M ${x1} ${y1} L ${x2} ${y2}`);

      // Line label position
      const textX = (x1 + x2) / 2;
      const textY = (y1 + y2) / 2 - 5;
      const angle = (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI;

      // ÄNDERUNG: Route-Namen nur auf längeren Streckenabschnitten anzeigen
      const distance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
      const routeName = line.route ? line.route.name : line.name;

      // Texthintergrund
      const textBg = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      textBg.setAttribute("x", textX - 20);
      textBg.setAttribute("y", textY - 12);
      textBg.setAttribute("width", 40);
      textBg.setAttribute("height", 16);
      textBg.setAttribute("fill", line.color);
      textBg.setAttribute("transform", `rotate(${angle}, ${textX}, ${textY})`);

      // Text für die Linie
      const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
      text.classList.add("line-name");
      text.setAttribute("x", textX);
      text.setAttribute("y", textY);
      text.setAttribute("transform", `rotate(${angle}, ${textX}, ${textY})`);
      text.textContent = routeName; // Immer Route-Namen verwenden

      // Add elements to the line
      lineElement.appendChild(path);

      // Text nur bei genügend Platz anzeigen (mindestens 40px Linienlänge)
      if (distance > 40) {
        lineElement.appendChild(textBg);
        lineElement.appendChild(text);
      }

      // Insert in front of stations (so stations are in foreground)
      const firstStation = this.app.canvasManager.canvas.querySelector(".station");
      if (firstStation) {
        this.app.canvasManager.canvas.insertBefore(lineElement, firstStation);
      } else {
        this.app.canvasManager.canvas.appendChild(lineElement);
      }

      return lineElement;
    }

    updateConnectedLines(station) {
      for (const line of this.app.lines) {
        if (line.station1.id === station.id || line.station2.id === station.id) {
          this.renderLine(line);
        }
      }
    }

    startDrawingLine(startStation) {
      this.currentDrawingLine = {
        startStation: startStation,
        endX: startStation.x,
        endY: startStation.y,
        color: this.app.lineColors[(this.app.lineCounter - 1) % this.app.lineColors.length],
        endStation: null,
      };

      // Draw temporary line
      const lineElement = document.createElementNS("http://www.w3.org/2000/svg", "path");
      lineElement.setAttribute("id", "drawing-line");
      lineElement.setAttribute("stroke", this.currentDrawingLine.color);
      lineElement.setAttribute("stroke-width", "6");
      lineElement.setAttribute("fill", "none");
      lineElement.setAttribute("stroke-dasharray", "5,5");
      lineElement.setAttribute("d", `M ${startStation.x} ${startStation.y} L ${startStation.x} ${startStation.y}`);

      this.app.canvasManager.canvas.appendChild(lineElement);
    }

    updateDrawingLine(x, y) {
      if (!this.currentDrawingLine) return;

      this.currentDrawingLine.endX = x;
      this.currentDrawingLine.endY = y;

      const lineElement = document.getElementById("drawing-line");
      if (!lineElement) return;

      lineElement.setAttribute("d", `M ${this.currentDrawingLine.startStation.x} ${this.currentDrawingLine.startStation.y} L ${x} ${y}`);

      // Check if near a station for snapping
      this.currentDrawingLine.endStation = null;
      lineElement.setAttribute("stroke-dasharray", "5,5");

      for (const station of this.app.stations) {
        if (station.id !== this.currentDrawingLine.startStation.id) {
          const dx = x - station.x;
          const dy = y - station.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 20) {
            // Visual helper for snapping
            this.currentDrawingLine.endX = station.x;
            this.currentDrawingLine.endY = station.y;
            this.currentDrawingLine.endStation = station;

            lineElement.setAttribute("d", `M ${this.currentDrawingLine.startStation.x} ${this.currentDrawingLine.startStation.y} L ${station.x} ${station.y}`);
            lineElement.setAttribute("stroke-dasharray", "");
            break;
          }
        }
      }
    }

    finishDrawingLine() {
      if (!this.currentDrawingLine) return;

      const lineElement = document.getElementById("drawing-line");

      if (this.currentDrawingLine.endStation) {
        // Create permanent line between stations
        this.createLine(this.currentDrawingLine.startStation, this.currentDrawingLine.endStation);
      }

      // Remove temporary line
      if (lineElement) {
        lineElement.remove();
      }

      this.currentDrawingLine = null;
    }

    cancelDrawingLine() {
      const lineElement = document.getElementById("drawing-line");
      if (lineElement) {
        lineElement.remove();
      }

      this.currentDrawingLine = null;
    }

    deleteLine(line) {
      // Remove from array
      const index = this.app.lines.indexOf(line);
      if (index !== -1) {
        this.app.lines.splice(index, 1);
      }

      // Remove connections from stations
      if (line.station1 && line.station2) {
        const index1 = line.station1.connections.indexOf(line.station2.id);
        if (index1 !== -1) {
          line.station1.connections.splice(index1, 1);
        }

        const index2 = line.station2.connections.indexOf(line.station1.id);
        if (index2 !== -1) {
          line.station2.connections.splice(index2, 1);
        }
      }

      if (line.route) {
        const routeLineIndex = line.route.lines.indexOf(line);
        if (routeLineIndex !== -1) {
          line.route.lines.splice(routeLineIndex, 1);
        }
      }

      // Remove from DOM
      const lineElement = document.getElementById(`line-${line.id}`);
      if (lineElement) {
        lineElement.remove();
      }

      // Save changes
      this.app.storageManager.saveToStorage();
    }
  }

  /**
   * Selection management class
   */
  class SelectionManager {
    constructor(app) {
      this.app = app;
      this.isShiftActive = false;
    }

    toggleShift(active) {
      this.isShiftActive = active;
    }

    selectStation(station) {
      // Check if already selected
      if (this.app.selectedStations.includes(station)) {
        return;
      }

      // If shift is not active, clear previous selection
      if (!this.isShiftActive) {
        this.clearSelection();
      }

      // Add to selection
      this.app.selectedStations.push(station);

      // Update visual selection
      const stationElement = document.getElementById(station.id);
      if (stationElement) {
        stationElement.classList.add("selected");
      }

      // Update station list to reflect selection
      this.app.stationListManager.updateStationList();
    }

    deselectStation(station) {
      // Remove from selection array
      const index = this.app.selectedStations.indexOf(station);
      if (index !== -1) {
        this.app.selectedStations.splice(index, 1);
      }

      // Update visual selection
      const stationElement = document.getElementById(station.id);
      if (stationElement) {
        stationElement.classList.remove("selected");
      }

      // Update station list
      this.app.stationListManager.updateStationList();
    }

    clearSelection() {
      // Remove selected class from all stations
      for (const station of this.app.selectedStations) {
        const stationElement = document.getElementById(station.id);
        if (stationElement) {
          stationElement.classList.remove("selected");
        }
      }

      // Clear array
      this.app.selectedStations = [];

      // Update station list
      this.app.stationListManager.updateStationList();
    }

    deleteSelected() {
      const stationsToDelete = [...this.app.selectedStations];
      for (const station of stationsToDelete) {
        this.app.stationManager.deleteStation(station);
      }
      this.app.selectedStations = [];
    }
  }

  /**
   * Storage management class
   */
  class StorageManager {
    constructor(app) {
      this.app = app;
      this.storageKey = "metroMapMakerData";
    }

    saveToStorage() {
      try {
        console.log("Speichere Stationen:", this.app.stations.length, this.app.stations);

        // Prepare stations data
        const stationsData = this.app.stations.map((station) => ({
          id: station.id,
          name: station.name,
          x: station.x,
          y: station.y,
        }));

        console.log("Stations-Daten zum Speichern:", stationsData.length);

        // Rest des bestehenden Codes...

        // Nach dem Speichern
        console.log("Speichern abgeschlossen, Stationen:", this.app.stations.length);
      } catch (error) {
        console.error("Error saving data:", error);
      }
    }

    loadFromStorage() {
      try {
        const savedData = localStorage.getItem(this.storageKey);
        if (!savedData) return;

        const data = JSON.parse(savedData);

        // Clear existing data
        this.app.stations = [];
        this.app.lines = [];
        this.app.canvasManager.clearCanvas();

        // Set counters
        this.app.stationCounter = data.stationCounter || 1;
        this.app.lineCounter = data.lineCounter || 1;

        // Temporäre Map für Linien erstellen
        const lineMap = new Map();
        this.app.lines.forEach((line) => lineMap.set(line.id, line));

        // Routen laden
        if (data.routes && Array.isArray(data.routes)) {
          for (const routeData of data.routes) {
            const route = new Route(routeData.id, routeData.name, routeData.color);

            // Linien dieser Route finden und verknüpfen
            if (routeData.lineIds) {
              for (const lineId of routeData.lineIds) {
                const line = lineMap.get(lineId);
                if (line) {
                  line.route = route;
                  route.lines.push(line);
                }
              }
            }

            this.app.routes.push(route);
          }
        }
        // Für alte Daten ohne Routen: automatisch generieren
        else {
          // Linien nach Farben gruppieren
          const colorMap = new Map();

          for (const line of this.app.lines) {
            if (line.name !== "Umsteigen") {
              if (!colorMap.has(line.color)) {
                colorMap.set(line.color, []);
              }
              colorMap.get(line.color).push(line);
            }
          }

          // Für jede Farbe eine Route erstellen
          let routeId = 1;
          for (const [color, lines] of colorMap.entries()) {
            const route = new Route(routeId++, `Linie ${routeId - 1}`, color);

            // Linien mit Route verknüpfen
            for (const line of lines) {
              line.route = route;
              route.lines.push(line);
            }

            this.app.routes.push(route);
          }
        }

        // Load stations
        const stationMap = new Map();

        for (const stationData of data.stations) {
          const station = new Station(stationData.id, stationData.name, stationData.x, stationData.y);

          this.app.stations.push(station);
          stationMap.set(station.id, station);
          this.app.stationManager.renderStation(station);
        }

        // Load lines
        for (const lineData of data.lines) {
          const station1 = stationMap.get(lineData.station1Id);
          const station2 = stationMap.get(lineData.station2Id);

          if (station1 && station2) {
            const line = new Line(lineData.id, station1, station2, lineData.color, lineData.name);

            this.app.lines.push(line);
            this.app.lineManager.renderLine(line);

            // Update station connections
            if (!station1.connections.includes(station2.id)) {
              station1.connections.push(station2.id);
            }

            if (!station2.connections.includes(station1.id)) {
              station2.connections.push(station1.id);
            }
          }
        }

        // Stationsgruppen laden
        this.app.stationGroups = data.stationGroups || [];

        for (const group of this.app.stationGroups) {
          if (!group.orientation) {
            group.orientation = "horizontal";
          }
        }

        // Gruppenrahmen rendern
        for (const group of this.app.stationGroups) {
          this.app.stationManager.renderStationGroup(group);
        }

        console.log("Data loaded successfully");
      } catch (error) {
        console.error("Error loading data:", error);
      }

      // Update station list after loading
      if (this.app.stationListManager) {
        this.app.stationListManager.updateStationList();
      }
    }

    clearStorage() {
      localStorage.removeItem(this.storageKey);
      console.log("Storage cleared");
    }

    exportSVG() {
      // Clone the SVG to avoid modifying the original
      const original = this.app.canvasManager.canvas;
      const svgClone = original.cloneNode(true);

      // Set fixed dimensions
      svgClone.setAttribute("width", "1000px");
      svgClone.setAttribute("height", "1000px");
      svgClone.setAttribute("viewBox", "0 0 1000 1000");

      // Remove transform and any other dynamic styling
      svgClone.style.transform = "";
      svgClone.style.position = "static";

      // Convert to SVG string
      const svgData = new XMLSerializer().serializeToString(svgClone);
      const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
      const svgUrl = URL.createObjectURL(svgBlob);

      // Create download link
      const downloadLink = document.createElement("a");
      downloadLink.href = svgUrl;
      downloadLink.download = "metro-map.svg";
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);

      // Clean up
      URL.revokeObjectURL(svgUrl);
    }
  }

  /**
   * Model Classes
   */
  class Route {
    constructor(id, name, color) {
      this.id = id;
      this.name = name;
      this.color = color;
      this.lines = []; // Referenzen zu allen Linienabschnitten dieser Route
    }
  }

  /**
   * Route management class
   */
  class RouteManager {
    constructor(app) {
      this.app = app;
    }

    getOrCreateRoute(color) {
      // Nach Route mit dieser Farbe suchen
      let route = this.app.routes.find((r) => r.color === color);

      if (!route) {
        // Neue Route erstellen
        const routeId = this.app.routes.length + 1;
        const routeName = `Linie ${routeId}`;
        route = new Route(routeId, routeName, color);
        this.app.routes.push(route);

        // Hinweis für den Nutzer anzeigen
        console.log(`Neue Route "${routeName}" erstellt. Rechtsklick auf die Linie zum Umbenennen.`);

        // Optional: Kurze Info-Nachricht anzeigen
        this.showRouteCreatedMessage(routeName, color);
      }

      return route;
    }

    updateRouteName(route, newName) {
      // Alten Namen speichern für Diagnosezwecke
      const oldName = route.name;

      // Neuen Namen setzen
      route.name = newName;

      // Alle zugehörigen Linien aktualisieren
      for (const line of route.lines) {
        // Liniennamen ebenfalls aktualisieren
        line.name = newName;

        // Linienbeschriftungen aktualisieren
        const lineElement = document.getElementById(`line-${line.id}`);
        if (lineElement) {
          const textElement = lineElement.querySelector(".line-name");
          if (textElement) {
            textElement.textContent = newName;
          }
        }
      }

      console.log(`Strecke umbenannt: "${oldName}" → "${newName}"`);

      // Stationsliste aktualisieren
      this.app.stationListManager.updateStationList();

      // Änderungen speichern
      this.app.storageManager.saveToStorage();
    }

    getRoutesForStation(station) {
      const routes = new Set();

      // Alle Linien durchsuchen, die mit dieser Station verbunden sind
      for (const line of this.app.lines) {
        if (line.station1.id === station.id || line.station2.id === station.id) {
          // Nur normale Linien berücksichtigen, keine Umsteigelinien
          if (line.route && line.name !== "Umsteigen") {
            routes.add(line.route);
          }
        }
      }

      return Array.from(routes);
    }

    showRouteCreatedMessage(routeName, color) {
      const message = document.createElement("div");
      message.textContent = `Neue Strecke "${routeName}" erstellt. Rechtsklick zum Umbenennen.`;
      message.style.position = "fixed";
      message.style.bottom = "10px";
      message.style.left = "50%";
      message.style.transform = "translateX(-50%)";
      message.style.backgroundColor = color;
      message.style.color = "white";
      message.style.padding = "8px 15px";
      message.style.borderRadius = "20px";
      message.style.fontWeight = "bold";
      message.style.zIndex = "9999";
      message.style.boxShadow = "0 2px 5px rgba(0,0,0,0.3)";

      document.body.appendChild(message);

      // Nach 3 Sekunden wieder entfernen
      setTimeout(() => {
        message.style.opacity = "0";
        message.style.transition = "opacity 0.5s";
        setTimeout(() => document.body.removeChild(message), 500);
      }, 3000);
    }
  }

  /**
   * UI management class
   */
  class UIManager {
    constructor(app) {
      this.app = app;

      // Buttons
      this.shiftBtn = document.getElementById("shiftBtn");
      this.lineBtn = document.getElementById("lineBtn");
      this.drawLineBtn = document.getElementById("drawLineBtn");
      this.deleteBtn = document.getElementById("deleteBtn");
      this.editBtn = document.getElementById("editBtn");
      this.exportBtn = document.getElementById("exportBtn");
      this.resetBtn = document.getElementById("resetBtn");
      this.splitBtn = document.getElementById("splitBtn");
      this.extractBtn = document.getElementById("extractBtn");
      this.rotateBtn = document.getElementById("rotateBtn"); // Neuer Button

      // Input fields
      this.editInput = document.getElementById("editInput");

      // UI state
      this.isLineMode = false;
      this.isDrawLineMode = false;
      this.isEditMode = false;
      this.editingStation = null;
    }

    init() {
      // Initialize button states
      this.updateButtonStates();

      // Button click handlers
      this.shiftBtn.addEventListener("click", () => this.toggleShift());
      this.lineBtn.addEventListener("click", () => this.toggleLineMode());
      this.drawLineBtn.addEventListener("click", () => this.toggleDrawLineMode());
      this.deleteBtn.addEventListener("click", () => this.app.selectionManager.deleteSelected());
      this.editBtn.addEventListener("click", () => this.toggleEditMode());
      this.exportBtn.addEventListener("click", () => this.app.storageManager.exportSVG());
      this.resetBtn.addEventListener("click", () => this.confirmReset());
      this.splitBtn.addEventListener("click", () => this.splitSelectedStation());
      this.extractBtn.addEventListener("click", () => this.extractSelectedStation());

      // Edit input
      this.editInput.addEventListener("blur", () => this.applyEdit());
      this.editInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          this.applyEdit();
        }
      });

      // Drag-and-Drop-Elemente
      this.toolbar = document.querySelector(".toolbar");
      this.stationListContainer = document.querySelector(".station-list-container");

      // Zustand für Drag-and-Drop
      this.dragState = {
        isDragging: false,
        currentElement: null,
        offsetX: 0,
        offsetY: 0,
      };

      // Button click handlers
      this.rotateBtn.addEventListener("click", () => this.rotateSelectedStationGroup());

      this.app.canvasManager.canvas.addEventListener("contextmenu", (e) => {
        const lineElement = e.target.closest(".line");
        if (lineElement) {
          e.preventDefault();
          const lineId = parseInt(lineElement.dataset.id);
          const line = this.app.lines.find((l) => l.id === lineId);

          if (line && line.route && line.name !== "Umsteigen") {
            this.showRouteEditor(line.route, e.clientX, e.clientY);
          }
        }
      });

      // Diese beiden Zeilen fehlen - füge sie hinzu
      this.initDraggableElements(); // Drag & Drop initialisieren
      this.restoreElementPositions(); // Gespeicherte Positionen wiederherstellen
    }

    initDraggableElements() {
      // Toolbar dragbar machen
      this.makeDraggable(this.toolbar);

      // Stationsliste dragbar machen (nur über Header)
      this.makeDraggable(this.stationListContainer, ".station-list-header");

      // Globaler mouseup-Handler nicht mehr nötig,
      // da jedes Element seinen eigenen hat
    }

    // Methode zum Dragbar machen eines Elements - überarbeitete Version
    makeDraggable(element, handleSelector = null) {
      const handle = handleSelector ? element.querySelector(handleSelector) : element;

      if (!handle) {
        console.error(`Kein Handle gefunden für Selektor: ${handleSelector}`);
        return;
      }

      // Individuellen Zustand für jedes Element
      element._dragState = {
        isDragging: false,
        offsetX: 0,
        offsetY: 0,
      };

      handle.addEventListener("mousedown", (e) => {
        // Verhindern, dass Buttons im Element das Drag-Event auslösen
        if (e.target.tagName === "BUTTON") return;

        e.preventDefault();
        e.stopPropagation(); // Wichtig: Verhindert Konflikte mit anderen Events

        const rect = element.getBoundingClientRect();
        element._dragState.isDragging = true;
        element._dragState.offsetX = e.clientX - rect.left;
        element._dragState.offsetY = e.clientY - rect.top;

        // Stil während des Ziehens ändern
        element.style.opacity = "0.8";

        // Element-spezifische Move- und Up-Handler einrichten
        const moveHandler = (moveEvent) => {
          if (element._dragState.isDragging) {
            const x = moveEvent.clientX - element._dragState.offsetX;
            const y = moveEvent.clientY - element._dragState.offsetY;

            // Grenzen des Viewports berücksichtigen
            const maxX = window.innerWidth - element.offsetWidth;
            const maxY = window.innerHeight - element.offsetHeight;
            const boundedX = Math.max(0, Math.min(maxX, x));
            const boundedY = Math.max(0, Math.min(maxY, y));

            element.style.left = `${boundedX}px`;
            element.style.top = `${boundedY}px`;

            // Für die Toolbar: transform entfernen, da wir absolute Positionierung verwenden
            if (element === this.toolbar) {
              element.style.transform = "none";
            }
          }
        };

        const upHandler = () => {
          if (element._dragState.isDragging) {
            element._dragState.isDragging = false;
            element.style.opacity = "1";

            // Positionen speichern
            this.saveElementPositions();

            // Event-Handler entfernen
            document.removeEventListener("mousemove", moveHandler);
            document.removeEventListener("mouseup", upHandler);
          }
        };

        // Temporäre Handler hinzufügen, die nur für dieses Element gelten
        document.addEventListener("mousemove", moveHandler);
        document.addEventListener("mouseup", upHandler);
      });
    }

    // Neue Methode zum Auftrennen einer Station
    splitSelectedStation() {
      if (this.app.selectedStations.length === 1) {
        const station = this.app.selectedStations[0];
        this.app.stationManager.splitStation(station);
      } else {
        alert("Bitte wähle genau eine Station zum Aufteilen aus.");
      }
    }

    toggleShift() {
      this.app.selectionManager.toggleShift(!this.app.selectionManager.isShiftActive);
      this.shiftBtn.classList.toggle("active", this.app.selectionManager.isShiftActive);
    }

    toggleLineMode() {
      this.isLineMode = !this.isLineMode;
      this.isDrawLineMode = false;
      this.isEditMode = false;
      this.updateButtonStates();
    }

    toggleDrawLineMode() {
      this.isDrawLineMode = !this.isDrawLineMode;
      this.isLineMode = false;
      this.isEditMode = false;
      this.updateButtonStates();
    }

    toggleEditMode() {
      this.isEditMode = !this.isEditMode;
      this.isLineMode = false;
      this.isDrawLineMode = false;
      this.updateButtonStates();

      if (!this.isEditMode) {
        this.hideEditInput();
      }
    }

    updateButtonStates() {
      this.shiftBtn.classList.toggle("active", this.app.selectionManager.isShiftActive);
      this.lineBtn.classList.toggle("active", this.isLineMode);
      this.drawLineBtn.classList.toggle("active", this.isDrawLineMode);
      this.editBtn.classList.toggle("active", this.isEditMode);
    }

    showEditInput(station, x, y) {
      this.editingStation = station;
      this.editInput.value = station.name;
      this.editInput.style.display = "block";
      this.editInput.style.left = `${x}px`;
      this.editInput.style.top = `${y}px`;
      this.editInput.focus();
    }

    hideEditInput() {
      this.editInput.style.display = "none";
      this.editingStation = null;
    }

    applyEdit() {
      if (this.editingStation && this.editInput.value.trim()) {
        console.log("Bearbeitung anwenden:", this.editingStation.id, "neuer Name:", this.editInput.value.trim());

        // Station vor der Umbenennung prüfen
        if (!this.app.stations.includes(this.editingStation)) {
          console.error("FEHLER: Station nicht in app.stations gefunden!");
          // Station wieder hinzufügen falls sie verschwunden ist
          this.app.stations.push(this.editingStation);
        }

        this.app.stationManager.updateStationName(this.editingStation, this.editInput.value.trim());
        this.hideEditInput();

        // Nach der Umbenennung prüfen, ob die Station noch vorhanden ist
        if (!this.app.stations.includes(this.editingStation)) {
          console.error("FEHLER: Station nach Umbenennung verschwunden!");
        }
      }
    }

    confirmReset() {
      if (confirm("Do you want to reset all data? This action cannot be undone.")) {
        this.app.reset();
      }
    }

    rotateSelectedStationGroup() {
      // Prüfen, ob eine Station ausgewählt ist
      if (this.app.selectedStations.length === 0) {
        alert("Bitte wähle mindestens eine Station in einer Gruppe aus.");
        return;
      }

      // Prüfen, ob die ausgewählte Station zu einer Gruppe gehört
      const station = this.app.selectedStations[0];
      const group = this.app.stationManager.findStationGroup(station.id);

      if (!group) {
        alert("Die ausgewählte Station gehört zu keiner Gruppe.");
        return;
      }

      // Gruppe rotieren
      this.app.stationManager.rotateStationGroup(group);
    }

    showRouteEditor(route, x, y) {
      // Bestehenden Editor entfernen falls vorhanden
      this.hideRouteEditor();

      // Editor-Dialog erstellen
      const editor = document.createElement("div");
      editor.className = "route-editor";
      editor.id = "routeEditor";

      // Header mit Farbmarkierung
      const header = document.createElement("div");
      header.className = "route-editor-header";

      const colorMarker = document.createElement("span");
      colorMarker.className = "route-editor-color";
      colorMarker.style.backgroundColor = route.color;

      header.appendChild(colorMarker);
      header.appendChild(document.createTextNode("Streckenname bearbeiten"));

      // Eingabefeld
      const input = document.createElement("input");
      input.type = "text";
      input.value = route.name;
      input.id = "routeNameInput";

      // Anzeige der Stationsanzahl
      const stationCount = this.getRouteStationCount(route);
      const infoText = document.createElement("div");
      infoText.style.fontSize = "12px";
      infoText.style.color = "#666";
      infoText.style.marginBottom = "8px";
      infoText.innerHTML = `Diese Strecke umfasst <b>${stationCount}</b> Stationen und <b>${route.lines.length}</b> Streckenabschnitte.`;

      // Buttons
      const buttons = document.createElement("div");
      buttons.className = "route-editor-buttons";

      const saveBtn = document.createElement("button");
      saveBtn.textContent = "Speichern";
      saveBtn.addEventListener("click", () => {
        const newName = input.value.trim();
        if (newName) {
          this.app.routeManager.updateRouteName(route, newName);
        }
        this.hideRouteEditor();
      });

      const cancelBtn = document.createElement("button");
      cancelBtn.textContent = "Abbrechen";
      cancelBtn.addEventListener("click", () => this.hideRouteEditor());

      buttons.appendChild(saveBtn);
      buttons.appendChild(cancelBtn);

      // Elemente zusammenfügen
      editor.appendChild(header);
      editor.appendChild(infoText);
      editor.appendChild(input);
      editor.appendChild(buttons);

      // Positionieren und anzeigen
      editor.style.left = `${x}px`;
      editor.style.top = `${y}px`;
      document.body.appendChild(editor);

      // Fokus auf Eingabefeld
      input.focus();
      input.select();

      // Enter-Taste zum Speichern
      input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          const newName = input.value.trim();
          if (newName) {
            this.app.routeManager.updateRouteName(route, newName);
          }
          this.hideRouteEditor();
        } else if (e.key === "Escape") {
          this.hideRouteEditor();
        }
      });
    }

    hideRouteEditor() {
      const editor = document.getElementById("routeEditor");
      if (editor) {
        document.body.removeChild(editor);
      }
    }

    getRouteStationCount(route) {
      const stationSet = new Set();

      for (const line of route.lines) {
        stationSet.add(line.station1.id);
        stationSet.add(line.station2.id);
      }

      return stationSet.size;
    }

    extractSelectedStation() {
      if (this.app.selectedStations.length === 1) {
        const station = this.app.selectedStations[0];
        const group = this.app.stationManager.findStationGroup(station.id);

        if (group) {
          this.app.stationManager.extractStationFromGroup(station);
        } else {
          alert("Die ausgewählte Station gehört zu keiner Gruppe.");
        }
      } else {
        alert("Bitte wähle genau eine Station zum Extrahieren aus.");
      }
    }

    // Methode zum Speichern der Positionen
    saveElementPositions() {
      const positions = {
        toolbar: {
          left: this.toolbar.style.left,
          top: this.toolbar.style.top,
          transform: this.toolbar.style.transform,
        },
        stationList: {
          left: this.stationListContainer.style.left,
          top: this.stationListContainer.style.top,
        },
      };

      localStorage.setItem("metroUiPositions", JSON.stringify(positions));
    }

    // Methode zum Wiederherstellen der Positionen
    restoreElementPositions() {
      try {
        const savedPositions = localStorage.getItem("metroUiPositions");
        if (savedPositions) {
          const positions = JSON.parse(savedPositions);

          // Toolbar-Position wiederherstellen
          if (positions.toolbar) {
            if (positions.toolbar.left && positions.toolbar.top) {
              this.toolbar.style.left = positions.toolbar.left;
              this.toolbar.style.top = positions.toolbar.top;
              this.toolbar.style.transform = "none"; // Transform zurücksetzen
            }
          }

          // Stationsliste-Position wiederherstellen
          if (positions.stationList) {
            if (positions.stationList.left && positions.stationList.top) {
              this.stationListContainer.style.left = positions.stationList.left;
              this.stationListContainer.style.top = positions.stationList.top;
            }
          }
        }
      } catch (error) {
        console.error("Error restoring UI positions:", error);
      }
    }
  }

  /**
   * Event handling class
   */
  class EventManager {
    constructor(app) {
      this.app = app;
      this.canvas = this.app.canvasManager.canvas;
      this.currentDraggedStation = null;
    }

    init() {
      // Mouse events
      this.canvas.addEventListener("dblclick", (e) => this.handleDoubleClick(e));
      this.canvas.addEventListener("click", (e) => this.handleClick(e));
      this.canvas.addEventListener("mousedown", (e) => this.handleMouseDown(e));
      document.addEventListener("mousemove", (e) => this.handleMouseMove(e));
      document.addEventListener("mouseup", (e) => this.handleMouseUp(e));

      // Keyboard events
      document.addEventListener("keydown", (e) => this.handleKeyDown(e));
      document.addEventListener("keyup", (e) => this.handleKeyUp(e));

      // Wheel event removed

      // Prevent context menu
      this.canvas.addEventListener("contextmenu", (e) => e.preventDefault());
    }

    handleDoubleClick(e) {
      e.preventDefault();

      // Create station at clicked position
      const coords = this.app.canvasManager.screenToCanvasCoords(e.clientX, e.clientY);
      this.app.stationManager.createStation(coords.x, coords.y);
    }

    handleClick(e) {
      // Handle station selection
      if (e.target.closest(".station")) {
        const stationElement = e.target.closest(".station");
        const stationId = stationElement.dataset.id;
        const station = this.app.stations.find((s) => s.id === stationId);

        if (station) {
          if (this.app.uiManager.isLineMode) {
            // Handle line mode: connect selected stations
            if (this.app.selectedStations.length === 1 && this.app.selectedStations[0] !== station) {
              this.app.lineManager.createLine(this.app.selectedStations[0], station);
              this.app.selectionManager.clearSelection();
            } else {
              this.app.selectionManager.selectStation(station);
            }
          } else if (this.app.uiManager.isDrawLineMode) {
            // Start drawing a line from this station
            this.app.lineManager.startDrawingLine(station);
          } else if (this.app.uiManager.isEditMode) {
            // Show edit input
            const rect = stationElement.getBoundingClientRect();
            this.app.uiManager.showEditInput(station, rect.left, rect.top - 30);
          } else {
            // Normal selection
            this.app.selectionManager.selectStation(station);
          }
        }
      }
      // NEUE FUNKTIONALITÄT: Mit Shift auf eine Linie klicken
      else if (e.target.closest(".line") && e.shiftKey) {
        const lineElement = e.target.closest(".line");
        // Linien-ID aus dem dataset extrahieren
        const lineId = parseInt(lineElement.dataset.id);
        const line = this.app.lines.find((l) => l.id === lineId);

        if (line) {
          // Klickkoordinaten ermitteln
          const coords = this.app.canvasManager.screenToCanvasCoords(e.clientX, e.clientY);

          // Station aus der Linie erstellen
          const newStation = this.app.stationManager.createStationFromLine(line, coords.x, coords.y);

          // Neue Station auswählen
          this.app.selectionManager.selectStation(newStation);

          // Ansicht auf die neue Station zentrieren
          this.app.canvasManager.centerViewOn(newStation.x, newStation.y);
        }
      }
      // Klick auf leere Fläche - Auswahl löschen
      else if (!e.target.closest(".line") && e.target === this.canvas) {
        this.app.selectionManager.clearSelection();
      }
    }

    handleMouseDown(e) {
      if (e.button === 2 || e.buttons === 4) {
        // Right mouse button or middle mouse button - pan
        e.preventDefault();
        this.app.canvasManager.startPan(e.clientX, e.clientY);
      } else if (e.target.closest(".station") && !this.app.uiManager.isDrawLineMode) {
        // Start dragging station
        const stationElement = e.target.closest(".station");
        const stationId = stationElement.dataset.id;
        const station = this.app.stations.find((s) => s.id === stationId);

        if (station) {
          this.currentDraggedStation = station;

          // If station not in selection, select it
          if (!this.app.selectedStations.includes(station) && !this.app.selectionManager.isShiftActive) {
            this.app.selectionManager.selectStation(station);
          }

          e.preventDefault();
        }
      }
    }

    handleMouseMove(e) {
      if (this.app.canvasManager.isDragging) {
        // Pan the canvas
        this.app.canvasManager.pan(e.clientX, e.clientY);
      } else if (this.currentDraggedStation) {
        // Move station
        const coords = this.app.canvasManager.screenToCanvasCoords(e.clientX, e.clientY);
        const constrained = this.app.canvasManager.constrainToCanvas(coords.x, coords.y);

        this.app.stationManager.updateStationPosition(this.currentDraggedStation, constrained.x, constrained.y);
      } else if (this.app.lineManager.currentDrawingLine) {
        // Update line drawing
        const coords = this.app.canvasManager.screenToCanvasCoords(e.clientX, e.clientY);
        this.app.lineManager.updateDrawingLine(coords.x, coords.y);
      }
    }

    handleMouseUp(e) {
      if (this.app.canvasManager.isDragging) {
        // End canvas panning
        this.app.canvasManager.endPan();
      }

      if (this.currentDraggedStation) {
        this.currentDraggedStation = null;
      }

      if (this.app.lineManager.currentDrawingLine) {
        // Finish line drawing
        this.app.lineManager.finishDrawingLine();
      }
    }

    handleKeyDown(e) {
      if (e.key === "Shift") {
        this.app.selectionManager.toggleShift(true);
        this.app.uiManager.updateButtonStates();
      } else if (e.key === "Delete" || e.key === "Backspace") {
        this.app.selectionManager.deleteSelected();
      } else if (e.key === "Escape") {
        if (this.app.lineManager.currentDrawingLine) {
          this.app.lineManager.cancelDrawingLine();
        } else if (this.app.uiManager.editingStation) {
          this.app.uiManager.hideEditInput();
        } else {
          this.app.selectionManager.clearSelection();
        }
      }
    }

    handleKeyUp(e) {
      if (e.key === "Shift") {
        this.app.selectionManager.toggleShift(false);
        this.app.uiManager.updateButtonStates();
      }
    }

    // handleWheel method removed
  }

  // Initialize the application
  const app = new MetroApp();
});
