# Screenreader-Simulation: Dokumentation

## Überblick

Die Screenreader-Simulation ist ein browserbasiertes Tool, das das Verhalten verschiedener Screenreader (NVDA, JAWS und VoiceOver) nachbildet. Es ermöglicht Entwicklern und Testern von Barrierefreiheit, die Screenreader-Nutzung zu simulieren, ohne tatsächliche Screenreader-Software installieren zu müssen.

Die Simulation unterstützt:
- Tastaturnavigation und -steuerung entsprechend den typischen Screenreader-Tastenkombinationen
- Textausgabe von Seiteninhalt und ARIA-Attributen
- Unterstützung für mehrsprachige Inhalte
- Visualisierung von Fokusindikatoren und Sprachausgabe
- Verschiedene Screenreader-Modi (NVDA, JAWS, VoiceOver)

## Architektur

Die Anwendung folgt dem SOLID-Prinzip und ist in verschiedene Klassen unterteilt, die jeweils spezifische Verantwortlichkeiten übernehmen:

### Kernkomponenten

1. **ScreenreaderSimulation.js**
   - Zentrale Steuerungsklasse, die alle anderen Komponenten initialisiert und verwaltet

2. **FocusManager.js**
   - Verwaltung des Fokus und der Navigation durch die Elemente
   - Implementiert verschiedene Navigationsmethoden (elementbasiert, typenbasiert)
   - Analysiert und liest Elementinformationen vor

3. **KeyboardManager.js**
   - Verarbeitet Tastatureingaben und leitet sie an die entsprechenden Funktionen weiter
   - Implementiert screenreaderspezifische Tastaturkombinationen

4. **OutputManager.js**
   - Verwaltet die Ausgabe von Text im Simulationsoverlay
   - Leitet Textausgaben an die Sprachausgabe weiter

5. **SpeechOutput.js**
   - Implementiert die Text-to-Speech-Funktionalität
   - Unterstützt verschiedene Sprachen und Stimmen
   - Steuert Geschwindigkeit, Tonhöhe und Lautstärke

6. **AriaManager.js**
   - Überwacht DOM-Änderungen in Bezug auf ARIA-Attribute
   - Verarbeitet Live-Regions und ARIA-Attribut-Änderungen

7. **DragManager.js**
   - Ermöglicht das Verschieben des Simulation-Overlays
   - Unterstützt sowohl Maus- als auch Touch-Eingaben

8. **SettingsManager.js**
   - Speichert und lädt Benutzereinstellungen über localStorage
   - Verwaltet Einstellungen für Modus, Sprachausgabe, Position, etc.

9. **TouchKeyboard.js**
   - Stellt eine virtuelle Tastatur für Touchgeräte bereit
   - Simuliert Tastatureingaben für eine bessere Mobilgeräteunterstützung

## Unterstützte Screenreader-Modi

### NVDA-Modus
- Primäre Tastenkombination: Insert
- Navigation mit Pfeiltasten
- Elementnavigation mit einzelnen Tasten (H für Überschriften, B für Buttons, etc.)
- Unterstützt kontinuierliches Lesen mit Insert + Pfeil nach unten

### JAWS-Modus
- Primäre Tastenkombination: Insert
- Ähnliches Navigationsverhalten wie NVDA
- Leicht unterschiedliche Tastaturkürzel für spezielle Funktionen

### VoiceOver-Modus
- Primäre Tastenkombination: Alt (simuliert Control+Option auf macOS)
- Benötigt Modifier-Taste für die Navigation mit Pfeiltasten
- Spezielle Tastaturbefehle für macOS-typische Interaktionen

## Hauptfunktionalitäten

### Navigation und Fokusmanagement

Die Simulation ermöglicht verschiedene Arten der Navigation:
- Sequentielle Navigation (Tab/Shift+Tab)
- Elementtyp-Navigation (H für Überschriften, B für Buttons, etc.)
- Strukturelle Navigation (Landmarken, Abschnitte)
- Hierarchische Navigation (z.B. Überschriftsebenen 1-6)

Der FocusManager berechnet die Position eines Elements im Dokument, um natürliche Lese- und Navigationsreihenfolgen zu ermöglichen.

### Sprachausgabe

Die SpeechOutput-Klasse nutzt die Web Speech API, um Text vorzulesen:
- Unterstützt mehrere Sprachen mit automatischer Spracherkennung basierend auf lang-Attributen
- Berücksichtigt gemischte Sprachinhalte innerhalb von Elementen
- Ermöglicht Kontrolle über Sprechgeschwindigkeit, Tonhöhe und Lautstärke
- Implementiert Start, Stopp, Pause und Fortsetzung der Sprachausgabe

### ARIA-Unterstützung

Der AriaManager überwacht DOM-Änderungen und ARIA-Attribute:
- Reagiert auf aria-live Regionen (assertive und polite)
- Verarbeitet Änderungen an ARIA-Attributen wie aria-expanded, aria-selected, etc.
- Verbalisiert Statusänderungen für Benutzer

### Anpassbare Einstellungen

Benutzereinstellungen werden persistent gespeichert:
- Ausgewählter Screenreader-Modus
- Sprachausgabestatus (aktiv/inaktiv)
- Virtuelle Tastatur (sichtbar/ausgeblendet)
- Position und Größe des Overlays

## Barrierefreiheitsfeatures

Die Simulation selbst demonstriert verschiedene Barrierefreiheitsfunktionen:
- Semantisches HTML
- ARIA-Attribute und Live-Regions
- Tastaturzugänglichkeit und -navigation
- Spracherkennung und mehrsprachige Unterstützung
- Visuelle Fokusindikatoren

## Verwendung

### Installation und Einrichtung
Die Simulation ist als eigenständiges Frontend-Tool konzipiert, das direkt im Browser läuft. Es sind keine Serverkomponenten oder Backend-Abhängigkeiten erforderlich.

### Grundlegende Bedienung
1. Öffnen der HTML-Seite im Browser
2. Verwenden der Tastaturkürzel zur Navigation
3. Beobachten der Screenreader-Ausgabe im Overlay
4. Umschalten zwischen verschiedenen Screenreader-Modi nach Bedarf

### Tastenkombinationen
Die wichtigsten Tastenkürzel sind je nach aktivem Screenreader-Modus:
- Tab/Shift+Tab: Nächstes/vorheriges Element
- Pfeiltasten: Navigation
- H: Nächste Überschrift
- B: Nächster Button
- F: Nächstes Formularfeld
- L: Nächster Link
- Enter: Element aktivieren
- Leertaste: Checkbox/Button aktivieren
- Strg: Sprachausgabe stoppen

Screenreader-spezifische Modifiers:
- NVDA/JAWS: Insert-Taste
- VoiceOver: Alt-Taste (simuliert Control+Option)

## Code-Probleme und Verbesserungsvorschläge

Nach Analyse des Quelltexts wurden folgende Probleme und Verbesserungsmöglichkeiten identifiziert:

### 1. Sprachausgabe-Probleme

**Problem:** In `SpeechOutput.js` gibt es möglicherweise Probleme mit der Erkennung und Verarbeitung von Stimmen.

**Lösungsvorschläge:**
- Robustere Fehlerbehandlung bei der Stimmenerkennung
- Implementierung von Fallback-Stimmen, wenn die bevorzugte Stimme nicht verfügbar ist
- Verbesserte Logging-Mechanismen für Sprachausgabeprobleme

### 2. Event-Propagation

**Problem:** Bei einigen Tastenereignissen könnte es zu unbeabsichtigter Event-Propagation kommen.

**Lösungsvorschläge:**
- Konsequente Verwendung von `event.preventDefault()` und `event.stopPropagation()` 
- Überprüfung aller Event-Handler auf korrekte Ereignisbehandlung

### 3. Inkonsistente Modus-Wechsel

**Problem:** Der Wechsel zwischen verschiedenen Screenreader-Modi könnte robuster implementiert werden.

**Lösungsvorschlag:**
- Zentrale State-Management-Funktion für Moduswechsel
- Sicherstellen, dass alle abhängigen Komponenten über Moduswechsel informiert werden

### 4. Verbesserte Landmarken-Navigation

**Problem:** Die aktuelle Landmarken-Navigation könnte erweitert werden.

**Lösungsvorschlag:**
- Unterstützung weiterer Landmarken-Typen (search, application, etc.)
- Konsistentere Benennungskonventionen für Landmarken

### 5. Optimierung der Touch-Unterstützung

**Problem:** Die Touch-Unterstützung könnte verbessert werden, besonders für komplexere Gesten.

**Lösungsvorschlag:**
- Implementierung von Multi-Touch-Gesten für fortgeschrittene Screenreader-Funktionen
- Verbesserte Feedback-Mechanismen für Touch-Interaktionen

### 6. Code-Duplikation in CSS

**Problem:** Es gibt Duplikationen in den CSS-Dateien.

**Lösungsvorschlag:**
- Reorganisation der CSS-Struktur
- Verwendung von CSS-Variablen für gemeinsame Eigenschaften
- Entfernung redundanter Definitionen

### 7. Performance-Optimierung

**Problem:** Die Überwachung von DOM-Änderungen könnte optimiert werden.

**Lösungsvorschlag:**
- Feinere Konfiguration des MutationObserver
- Vermeidung unnötiger DOM-Traversierungen
- Implementation von Debounce/Throttle für ressourcenintensive Operationen

### 8. Verbesserte Dokumentation

**Problem:** Einige Funktionen sind unzureichend dokumentiert.

**Lösungsvorschlag:**
- Hinzufügen von JSDoc für alle öffentlichen Methoden
- Erstellen einer umfassenden API-Dokumentation
- Hinzufügen von Beispielen für erweiterte Anwendungsfälle

### 9. Testabdeckung

**Problem:** Es gibt keine erkennbaren automatisierten Tests.

**Lösungsvorschlag:**
- Implementierung von Unit-Tests für kritische Komponenten
- End-to-End-Tests für Benutzerinteraktionen
- Accessibility-Tests zur Validierung der Simulation

### 10. Internationalisierung

**Problem:** Die Benutzeroberfläche der Simulation selbst ist nur auf Deutsch.

**Lösungsvorschlag:**
- Implementierung einer Internationalisierungslösung für die Benutzeroberfläche
- Trennung von Code und Textressourcen
- Unterstützung mehrerer Sprachen für die Benutzeroberfläche

## Schlussfolgerung

Die Screenreader-Simulation ist ein umfassendes Tool, das Entwicklern und Testern wertvolle Einblicke in die Screenreader-Nutzung bietet. Die modulare Architektur und die strikte Trennung von Zuständigkeiten sorgen für Wartbarkeit und Erweiterbarkeit. Mit den vorgeschlagenen Verbesserungen könnte die Simulation noch robuster und benutzerfreundlicher werden.