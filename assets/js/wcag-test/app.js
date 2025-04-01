// - - - - -
// Definiere die WCAG-Kriterien
const wcagCriteria = [
    {
        id: "1.1.1",
        name: "Nicht-Text-Inhalt lala",
        level: "A",
        principle: "Wahrnehmbar",
        guideline: "Textalternativen",
        mdFile: "c-001-wcag-1.1.1.md",
    },

    // WCAG 1.2 - Zeitbasierte Medien
    {
        id: "1.2.1",
        name: "Reines Audio und reines Video (aufgezeichnet)",
        level: "A",
        principle: "Wahrnehmbar",
        guideline: "Zeitbasierte Medien",
        mdFile: "c-002-wcag-1.2.1.md",
    },
    {
        id: "1.2.2",
        name: "Untertitel (aufgezeichnet)",
        level: "A",
        principle: "Wahrnehmbar",
        guideline: "Zeitbasierte Medien",
        mdFile: "c-003-wcag-1.2.2.md",
    },
    {
        id: "1.2.3",
        name: "Audiodeskription oder Medienalternative (aufgezeichnet)",
        level: "A",
        principle: "Wahrnehmbar",
        guideline: "Zeitbasierte Medien",
        mdFile: "c-004-wcag-1.2.3.md",
    },
    {
        id: "1.2.4",
        name: "Untertitel (live)",
        level: "AA",
        principle: "Wahrnehmbar",
        guideline: "Zeitbasierte Medien",
        mdFile: "c-005-wcag-1.2.4.md",
    },
    {
        id: "1.2.5",
        name: "Audiodeskription (aufgezeichnet)",
        level: "AA",
        principle: "Wahrnehmbar",
        guideline: "Zeitbasierte Medien",
        mdFile: "c-006-wcag-1.2.5.md",
    },

    // WCAG 1.3 - Anpassbar
    {
        id: "1.3.1",
        name: "Info und Beziehungen",
        level: "A",
        principle: "Wahrnehmbar",
        guideline: "Anpassbar",
        mdFile: "c-011-wcag-1.3.1.md",
    },
    {
        id: "1.3.2",
        name: "Bedeutungstragende Reihenfolge",
        level: "A",
        principle: "Wahrnehmbar",
        guideline: "Anpassbar",
        mdFile: "c-012-wcag-1.3.2.md",
    },
    {
        id: "1.3.3",
        name: "Sensorische Eigenschaften",
        level: "A",
        principle: "Wahrnehmbar",
        guideline: "Anpassbar",
        mdFile: "c-013-wcag-1.3.3.md",
    },
    {
        id: "1.3.4",
        name: "Ausrichtung",
        level: "AA",
        principle: "Wahrnehmbar",
        guideline: "Anpassbar",
        mdFile: "c-014-wcag-1.3.4.md",
    },
    {
        id: "1.3.5",
        name: "Eingabezweck bestimmen",
        level: "AA",
        principle: "Wahrnehmbar",
        guideline: "Anpassbar",
        mdFile: "c-015-wcag-1.3.5.md",
    },

    // WCAG 1.4 - Unterscheidbar
    {
        id: "1.4.1",
        name: "Verwendung von Farbe",
        level: "A",
        principle: "Wahrnehmbar",
        guideline: "Unterscheidbar",
        mdFile: "c-017-wcag-1.4.1.md",
    },
    {
        id: "1.4.2",
        name: "Audiosteuerung",
        level: "A",
        principle: "Wahrnehmbar",
        guideline: "Unterscheidbar",
        mdFile: "c-018-wcag-1.4.2.md",
    },
    {
        id: "1.4.3",
        name: "Kontrast (Minimum)",
        level: "AA",
        principle: "Wahrnehmbar",
        guideline: "Unterscheidbar",
        mdFile: "c-019-wcag-1.4.3.md",
    },
    {
        id: "1.4.4",
        name: "Textgröße änderbar",
        level: "AA",
        principle: "Wahrnehmbar",
        guideline: "Unterscheidbar",
        mdFile: "c-020-wcag-1.4.4.md",
    },
    {
        id: "1.4.5",
        name: "Bilder von Text",
        level: "AA",
        principle: "Wahrnehmbar",
        guideline: "Unterscheidbar",
        mdFile: "c-021-wcag-1.4.5.md",
    },
    {
        id: "1.4.10",
        name: "Umfließen",
        level: "AA",
        principle: "Wahrnehmbar",
        guideline: "Unterscheidbar",
        mdFile: "c-026-wcag-1.4.10.md",
    },
    {
        id: "1.4.11",
        name: "Kontrast ohne Text",
        level: "AA",
        principle: "Wahrnehmbar",
        guideline: "Unterscheidbar",
        mdFile: "c-027-wcag-1.4.11.md",
    },
    {
        id: "1.4.12",
        name: "Textabstand",
        level: "AA",
        principle: "Wahrnehmbar",
        guideline: "Unterscheidbar",
        mdFile: "c-028-wcag-1.4.12.md",
    },
    {
        id: "1.4.13",
        name: "Inhalt bei Hover oder Fokus",
        level: "AA",
        principle: "Wahrnehmbar",
        guideline: "Unterscheidbar",
        mdFile: "c-029-wcag-1.4.13.md",
    },

    // WCAG 2.1 - Zugänglich per Tastatur
    {
        id: "2.1.1",
        name: "Tastatur",
        level: "A",
        principle: "Bedienbar",
        guideline: "Zugänglich per Tastatur",
        mdFile: "c-030-wcag-2.1.1.md",
    },
    {
        id: "2.1.2",
        name: "Keine Tastaturfalle",
        level: "A",
        principle: "Bedienbar",
        guideline: "Zugänglich per Tastatur",
        mdFile: "c-031-wcag-2.1.2.md",
    },
    {
        id: "2.1.4",
        name: "Tastaturkürzel",
        level: "A",
        principle: "Bedienbar",
        guideline: "Zugänglich per Tastatur",
        mdFile: "c-033-wcag-2.1.4.md",
    },

    // WCAG 2.2 - Ausreichend Zeit
    {
        id: "2.2.1",
        name: "Zeitvorgaben anpassbar",
        level: "A",
        principle: "Bedienbar",
        guideline: "Ausreichend Zeit",
        mdFile: "c-034-wcag-2.2.1.md",
    },
    {
        id: "2.2.2",
        name: "Pausieren, stoppen, ausblenden",
        level: "A",
        principle: "Bedienbar",
        guideline: "Ausreichend Zeit",
        mdFile: "c-035-wcag-2.2.2.md",
    },

    // WCAG 2.3 - Anfälle und physische Reaktionen
    {
        id: "2.3.1",
        name: "Grenzwert von drei Blitzen oder weniger",
        level: "A",
        principle: "Bedienbar",
        guideline: "Anfälle und physische Reaktionen",
        mdFile: "c-040-wcag-2.3.1.md",
    },

    // WCAG 2.4 - Navigierbar
    {
        id: "2.4.1",
        name: "Blöcke umgehen",
        level: "A",
        principle: "Bedienbar",
        guideline: "Navigierbar",
        mdFile: "c-043-wcag-2.4.1.md",
    },
    {
        id: "2.4.2",
        name: "Seitentitel",
        level: "A",
        principle: "Bedienbar",
        guideline: "Navigierbar",
        mdFile: "c-044-wcag-2.4.2.md",
    },
    {
        id: "2.4.3",
        name: "Fokus-Reihenfolge",
        level: "A",
        principle: "Bedienbar",
        guideline: "Navigierbar",
        mdFile: "c-045-wcag-2.4.3.md",
    },
    {
        id: "2.4.4",
        name: "Linkzweck (im Kontext)",
        level: "A",
        principle: "Bedienbar",
        guideline: "Navigierbar",
        mdFile: "c-046-wcag-2.4.4.md",
    },
    {
        id: "2.4.5",
        name: "Verschiedene Methoden",
        level: "AA",
        principle: "Bedienbar",
        guideline: "Navigierbar",
        mdFile: "c-047-wcag-2.4.5.md",
    },
    {
        id: "2.4.6",
        name: "Überschriften und Beschriftungen",
        level: "AA",
        principle: "Bedienbar",
        guideline: "Navigierbar",
        mdFile: "c-048-wcag-2.4.6.md",
    },
    {
        id: "2.4.7",
        name: "Fokus sichtbar",
        level: "AA",
        principle: "Bedienbar",
        guideline: "Navigierbar",
        mdFile: "c-049-wcag-2.4.7.md",
    },

    // WCAG 2.5 - Eingabemodalitäten
    {
        id: "2.5.1",
        name: "Zeigergesten",
        level: "A",
        principle: "Bedienbar",
        guideline: "Eingabemodalitäten",
        mdFile: "c-053-wcag-2.5.1.md",
    },
    {
        id: "2.5.2",
        name: "Zeigerabbruch",
        level: "A",
        principle: "Bedienbar",
        guideline: "Eingabemodalitäten",
        mdFile: "c-054-wcag-2.5.2.md",
    },
    {
        id: "2.5.3",
        name: "Beschriftung im Namen",
        level: "A",
        principle: "Bedienbar",
        guideline: "Eingabemodalitäten",
        mdFile: "c-055-wcag-2.5.3.md",
    },
    {
        id: "2.5.4",
        name: "Betätigung durch Bewegung",
        level: "A",
        principle: "Bedienbar",
        guideline: "Eingabemodalitäten",
        mdFile: "c-056-wcag-2.5.4.md",
    },

    // WCAG 3.1 - Lesbar
    {
        id: "3.1.1",
        name: "Sprache der Seite",
        level: "A",
        principle: "Verständlich",
        guideline: "Lesbar",
        mdFile: "c-059-wcag-3.1.1.md",
    },
    {
        id: "3.1.2",
        name: "Sprache von Teilen",
        level: "AA",
        principle: "Verständlich",
        guideline: "Lesbar",
        mdFile: "c-060-wcag-3.1.2.md",
    },

    // WCAG 3.2 - Vorhersehbar
    {
        id: "3.2.1",
        name: "Bei Fokus",
        level: "A",
        principle: "Verständlich",
        guideline: "Vorhersehbar",
        mdFile: "c-065-wcag-3.2.1.md",
    },
    {
        id: "3.2.2",
        name: "Bei Eingabe",
        level: "A",
        principle: "Verständlich",
        guideline: "Vorhersehbar",
        mdFile: "c-066-wcag-3.2.2.md",
    },
    {
        id: "3.2.3",
        name: "Konsistente Navigation",
        level: "AA",
        principle: "Verständlich",
        guideline: "Vorhersehbar",
        mdFile: "c-067-wcag-3.2.3.md",
    },
    {
        id: "3.2.4",
        name: "Konsistente Identifikation",
        level: "AA",
        principle: "Verständlich",
        guideline: "Vorhersehbar",
        mdFile: "c-068-wcag-3.2.4.md",
    },

    // WCAG 3.3 - Hilfestellung bei der Eingabe
    {
        id: "3.3.1",
        name: "Fehleridentifikation",
        level: "A",
        principle: "Verständlich",
        guideline: "Hilfestellung bei der Eingabe",
        mdFile: "c-070-wcag-3.3.1.md",
    },
    {
        id: "3.3.2",
        name: "Beschriftungen oder Anweisungen",
        level: "A",
        principle: "Verständlich",
        guideline: "Hilfestellung bei der Eingabe",
        mdFile: "c-071-wcag-3.3.2.md",
    },
    {
        id: "3.3.3",
        name: "Fehlervorschläge",
        level: "AA",
        principle: "Verständlich",
        guideline: "Hilfestellung bei der Eingabe",
        mdFile: "c-072-wcag-3.3.3.md",
    },
    {
        id: "3.3.4",
        name: "Fehlervermeidung (rechtlich, finanziell, Daten)",
        level: "AA",
        principle: "Verständlich",
        guideline: "Hilfestellung bei der Eingabe",
        mdFile: "c-073-wcag-3.3.4.md",
    },

    // WCAG 4.1 - Kompatibel
    {
        id: "4.1.1",
        name: "Parsing",
        level: "A",
        principle: "Robust",
        guideline: "Kompatibel",
        mdFile: "c-076-wcag-4.1.1.md",
    },
    {
        id: "4.1.2",
        name: "Name, Rolle, Wert",
        level: "A",
        principle: "Robust",
        guideline: "Kompatibel",
        mdFile: "c-077-wcag-4.1.2.md",
    },
    {
        id: "4.1.3",
        name: "Statusmeldungen",
        level: "AA",
        principle: "Robust",
        guideline: "Kompatibel",
        mdFile: "c-078-wcag-4.1.3.md",
    },
]

// Alle WCAG-Kriterien (inkl. AAA) für die Dialoge
const allWcagCriteria = [
    ...wcagCriteria,
    // AAA-Kriterien, die in der Standardansicht nicht angezeigt werden
    {
        id: "1.2.6",
        name: "Gebärdensprache (aufgezeichnet)",
        level: "AAA",
        principle: "Wahrnehmbar",
        guideline: "Zeitbasierte Medien",
        mdFile: "c-007-wcag-1.2.6.md",
    },
    {
        id: "1.2.7",
        name: "Erweiterte Audiodeskription (aufgezeichnet)",
        level: "AAA",
        principle: "Wahrnehmbar",
        guideline: "Zeitbasierte Medien",
        mdFile: "c-008-wcag-1.2.7.md",
    },
    {
        id: "1.2.8",
        name: "Medienalternative (aufgezeichnet)",
        level: "AAA",
        principle: "Wahrnehmbar",
        guideline: "Zeitbasierte Medien",
        mdFile: "c-009-wcag-1.2.8.md",
    },
    {
        id: "1.2.9",
        name: "Reines Audio (live)",
        level: "AAA",
        principle: "Wahrnehmbar",
        guideline: "Zeitbasierte Medien",
        mdFile: "c-010-wcag-1.2.9.md",
    },
    {
        id: "1.3.6",
        name: "Zweck bestimmen",
        level: "AAA",
        principle: "Wahrnehmbar",
        guideline: "Anpassbar",
        mdFile: "c-016-wcag-1.3.6.md",
    },
    {
        id: "1.4.6",
        name: "Kontrast (erhöht)",
        level: "AAA",
        principle: "Wahrnehmbar",
        guideline: "Unterscheidbar",
        mdFile: "c-022-wcag-1.4.6.md",
    },
    {
        id: "1.4.7",
        name: "Leise oder keine Hintergrundaudiodaten",
        level: "AAA",
        principle: "Wahrnehmbar",
        guideline: "Unterscheidbar",
        mdFile: "c-023-wcag-1.4.7.md",
    },
    {
        id: "1.4.8",
        name: "Visuelle Präsentation",
        level: "AAA",
        principle: "Wahrnehmbar",
        guideline: "Unterscheidbar",
        mdFile: "c-024-wcag-1.4.8.md",
    },
    {
        id: "1.4.9",
        name: "Bilder von Text (ohne Ausnahme)",
        level: "AAA",
        principle: "Wahrnehmbar",
        guideline: "Unterscheidbar",
        mdFile: "c-025-wcag-1.4.9.md",
    },
    {
        id: "2.1.3",
        name: "Tastatur (ohne Ausnahme)",
        level: "AAA",
        principle: "Bedienbar",
        guideline: "Zugänglich per Tastatur",
        mdFile: "c-032-wcag-2.1.3.md",
    },
    {
        id: "2.2.3",
        name: "Keine Zeitbegrenzung",
        level: "AAA",
        principle: "Bedienbar",
        guideline: "Ausreichend Zeit",
        mdFile: "c-036-wcag-2.2.3.md",
    },
    {
        id: "2.2.4",
        name: "Unterbrechungen",
        level: "AAA",
        principle: "Bedienbar",
        guideline: "Ausreichend Zeit",
        mdFile: "c-037-wcag-2.2.4.md",
    },
    {
        id: "2.2.5",
        name: "Erneute Authentifizierung",
        level: "AAA",
        principle: "Bedienbar",
        guideline: "Ausreichend Zeit",
        mdFile: "c-038-wcag-2.2.5.md",
    },
    {
        id: "2.2.6",
        name: "Zeitbeschränkungen",
        level: "AAA",
        principle: "Bedienbar",
        guideline: "Ausreichend Zeit",
        mdFile: "c-039-wcag-2.2.6.md",
    },
    {
        id: "2.3.2",
        name: "Drei Blitze",
        level: "AAA",
        principle: "Bedienbar",
        guideline: "Anfälle und physische Reaktionen",
        mdFile: "c-041-wcag-2.3.2.md",
    },
    {
        id: "2.3.3",
        name: "Animation aus Interaktionen",
        level: "AAA",
        principle: "Bedienbar",
        guideline: "Anfälle und physische Reaktionen",
        mdFile: "c-042-wcag-2.3.3.md",
    },
    {
        id: "2.4.8",
        name: "Position",
        level: "AAA",
        principle: "Bedienbar",
        guideline: "Navigierbar",
        mdFile: "c-050-wcag-2.4.8.md",
    },
    {
        id: "2.4.9",
        name: "Linkzweck (reiner Link)",
        level: "AAA",
        principle: "Bedienbar",
        guideline: "Navigierbar",
        mdFile: "c-051-wcag-2.4.9.md",
    },
    {
        id: "2.4.10",
        name: "Abschnittsüberschriften",
        level: "AAA",
        principle: "Bedienbar",
        guideline: "Navigierbar",
        mdFile: "c-052-wcag-2.4.10.md",
    },
    {
        id: "2.5.5",
        name: "Größe des Ziels",
        level: "AAA",
        principle: "Bedienbar",
        guideline: "Eingabemodalitäten",
        mdFile: "c-057-wcag-2.5.5.md",
    },
    {
        id: "2.5.6",
        name: "Eingabemechanismen",
        level: "AAA",
        principle: "Bedienbar",
        guideline: "Eingabemodalitäten",
        mdFile: "c-058-wcag-2.5.6.md",
    },
    {
        id: "3.1.3",
        name: "Ungewöhnliche Wörter",
        level: "AAA",
        principle: "Verständlich",
        guideline: "Lesbar",
        mdFile: "c-061-wcag-3.1.3.md",
    },
    {
        id: "3.1.4",
        name: "Abkürzungen",
        level: "AAA",
        principle: "Verständlich",
        guideline: "Lesbar",
        mdFile: "c-062-wcag-3.1.4.md",
    },
    {
        id: "3.1.5",
        name: "Leseniveau",
        level: "AAA",
        principle: "Verständlich",
        guideline: "Lesbar",
        mdFile: "c-063-wcag-3.1.5.md",
    },
    {
        id: "3.1.6",
        name: "Aussprache",
        level: "AAA",
        principle: "Verständlich",
        guideline: "Lesbar",
        mdFile: "c-064-wcag-3.1.6.md",
    },
    {
        id: "3.2.5",
        name: "Änderung auf Anfrage",
        level: "AAA",
        principle: "Verständlich",
        guideline: "Vorhersehbar",
        mdFile: "c-069-wcag-3.2.5.md",
    },
    {
        id: "3.3.5",
        name: "Hilfe",
        level: "AAA",
        principle: "Verständlich",
        guideline: "Hilfestellung bei der Eingabe",
        mdFile: "c-074-wcag-3.3.5.md",
    },
    {
        id: "3.3.6",
        name: "Fehlervermeidung (alle)",
        level: "AAA",
        principle: "Verständlich",
        guideline: "Hilfestellung bei der Eingabe",
        mdFile: "c-075-wcag-3.3.6.md",
    },
]

// Definiere die Ergebnistypen
const resultTypes = [
    { id: "fulfilled", name: "erfüllt", class: "result-fulfilled" },
    {
        id: "mostly-fulfilled",
        name: "eher erfüllt",
        class: "result-mostly-fulfilled",
    },
    {
        id: "partially-fulfilled",
        name: "tw. erfüllt",
        class: "result-partially-fulfilled",
    },
    {
        id: "mostly-not-fulfilled",
        name: "eher nicht erfüllt",
        class: "result-mostly-not-fulfilled",
    },
    {
        id: "not-fulfilled",
        name: "nicht erfüllt",
        class: "result-not-fulfilled",
    },
    {
        id: "not-applicable",
        name: "nicht anwendbar",
        class: "result-not-applicable",
    },
]

// Model für die Testdaten
class TestModel {
    constructor() {
        this.title = ""
        this.date = new Date().toISOString().split("T")[0]
        this.mainUrl = ""
        this.pages = []
        this.results = new Map()
        this.observers = []

        // Versuche, gespeicherte Daten aus dem localStorage zu laden
        this.loadFromLocalStorage()
    }

    // Observer Pattern für Änderungen
    addObserver(observer) {
        this.observers.push(observer)
    }

    notifyObservers() {
        this.observers.forEach((observer) => observer.update())
    }

    // Setze Grunddaten
    setBasicData(title, date, mainUrl) {
        this.title = title
        this.date = date
        this.mainUrl = mainUrl
        this.notifyObservers()
    }

    // Seiten verwalten
    addPage(url, title = "") {
        if (this.pages.length < 5) {
            const page = {
                id: Date.now(),
                url,
                title: title || url,
            }
            this.pages.push(page)
            this.notifyObservers()
            return page
        }
        return null
    }

    deletePage(pageId) {
        this.pages = this.pages.filter((page) => page.id !== pageId)

        // Lösche alle Ergebnisse für diese Seite
        for (const criteriaId of wcagCriteria.map((c) => c.id)) {
            this.results.delete(`${pageId}-${criteriaId}`)
        }

        this.notifyObservers()
    }

    // Teste Ergebnisse verwalten
    setResult(pageId, criteriaId, resultType, comment) {
        const key = `${pageId}-${criteriaId}`
        this.results.set(key, {
            pageId,
            criteriaId,
            resultType,
            comment,
        })
        this.notifyObservers()
    }

    getResult(pageId, criteriaId) {
        const key = `${pageId}-${criteriaId}`
        return this.results.get(key) || null
    }

    // Auswertung
    getSummary() {
        const fulfilled = []
        const notFulfilled = []
        const notApplicable = []

        for (const page of this.pages) {
            for (const criteria of wcagCriteria) {
                const result = this.getResult(page.id, criteria.id)
                if (!result) continue

                if (
                    result.resultType === "fulfilled" ||
                    result.resultType === "mostly-fulfilled"
                ) {
                    fulfilled.push(result)
                } else if (
                    result.resultType === "not-fulfilled" ||
                    result.resultType === "mostly-not-fulfilled" ||
                    result.resultType === "partially-fulfilled"
                ) {
                    notFulfilled.push(result)
                } else if (result.resultType === "not-applicable") {
                    notApplicable.push(result)
                }
            }
        }

        return {
            fulfilled: fulfilled.length,
            notFulfilled: notFulfilled.length,
            notApplicable: notApplicable.length,
            total:
                fulfilled.length + notFulfilled.length + notApplicable.length,
            fulfilledItems: fulfilled,
            notFulfilledItems: notFulfilled,
            notApplicableItems: notApplicable,
        }
    }

    // Export/Import
    toJSON() {
        return {
            title: this.title,
            date: this.date,
            mainUrl: this.mainUrl,
            pages: this.pages,
            results: Array.from(this.results.entries()),
        }
    }

    fromJSON(json) {
        this.title = json.title
        this.date = json.date
        this.mainUrl = json.mainUrl
        this.pages = json.pages
        this.results = new Map(json.results)
        this.notifyObservers()
    }

    // LocalStorage Funktionen
    saveToLocalStorage() {
        try {
            const data = this.toJSON()
            localStorage.setItem("wcagTestData", JSON.stringify(data))
            return true
        } catch (error) {
            console.error("Fehler beim Speichern in localStorage:", error)
            return false
        }
    }

    loadFromLocalStorage() {
        try {
            const savedData = localStorage.getItem("wcagTestData")
            if (savedData) {
                const data = JSON.parse(savedData)
                this.fromJSON(data)
                return true
            }
        } catch (error) {
            console.error("Fehler beim Laden aus localStorage:", error)
        }
        return false
    }
}
// Komponente: WcagTestApp (Hauptkomponente)
class WcagTestApp extends HTMLElement {
    constructor() {
        super()
        this.model = new TestModel()
        console.log("WcagTestApp Konstruktor aufgerufen")

        this.setAttribute("data-initialized", "true")
        window.wcagAppInstance = this // optional zur globalen Diagnose

        this.model.addObserver(this)
        this.currentView = "setup"
        this.currentPageId = null
        this.criteriaDialogContent = null
    }

    connectedCallback() {
        console.log("connectedCallback", this.model)

        this.render()
        this.attachEventListeners()
    }

    // Render-Funktionen
    render() {
        this.innerHTML = `
                    <div class="tabs">
                        <div class="tab ${
                            this.currentView === "setup" ? "active" : ""
                        }" data-view="setup">Grunddaten</div>
                        <div class="tab ${
                            this.currentView === "test" ? "active" : ""
                        }" data-view="test">WCAG-Test</div>
                        <div class="tab ${
                            this.currentView === "summary" ? "active" : ""
                        }" data-view="summary">Auswertung</div>
                    </div>

                    <div class="view ${
                        this.currentView === "setup" ? "" : "hidden"
                    }" id="setup-view">
                        ${this.renderSetupView()}
                    </div>

                    <div class="view ${
                        this.currentView === "test" ? "" : "hidden"
                    }" id="test-view">
                        ${this.renderTestView()}
                    </div>

                    <div class="view ${
                        this.currentView === "summary" ? "" : "hidden"
                    }" id="summary-view">
                        ${this.renderSummaryView()}
                    </div>
                `
        this.attachEventListeners()
    }

    renderSetupView() {
        return `
                    <div class="card">
                        <h2>Grunddaten für WCAG-Test</h2>
                        <div class="form-group">
                            <label for="test-title">Titel des Tests</label>
                            <input type="text" id="test-title" value="${
                                this.model.title
                            }" placeholder="z.B. Barrierefreiheitsprüfung Website XYZ">
                        </div>
                        <div class="form-group">
                            <label for="test-date">Datum</label>
                            <input type="date" id="test-date" value="${
                                this.model.date
                            }">
                        </div>
                        <div class="form-group">
                            <label for="main-url">Hauptadresse der Website</label>
                            <input type="url" id="main-url" value="${
                                this.model.mainUrl
                            }" placeholder="https://example.com">
                        </div>
                        <button id="save-basic-data">Speichern</button>
                    </div>

                    <div class="card">
                        <h2>Zu testende Einzelseiten (max. 5)</h2>
                        <div class="form-group">
                            <label for="page-url">Webseitenadresse</label>
                            <input type="url" id="page-url" placeholder="https://example.com/seite">
                        </div>
                        <div class="form-group">
                            <label for="page-title">Titel der Seite (optional)</label>
                            <input type="text" id="page-title" placeholder="z.B. Startseite, Kontakt, etc.">
                        </div>
                        <button id="add-page" ${
                            this.model.pages.length >= 5 ? "disabled" : ""
                        }>Seite hinzufügen</button>
                        
                        <div class="page-list">
                            ${this.model.pages
                                .map(
                                    (page) => `
                                <div class="page-item" data-id="${page.id}">
                                    <div>
                                        <strong>${page.title}</strong><br>
                                        <small>${page.url}</small>
                                    </div>
                                    <button class="delete-page" data-id="${page.id}">Entfernen</button>
                                </div>
                            `
                                )
                                .join("")}
                        </div>
                    </div>
                `
    }

    renderTestView() {
        if (this.model.pages.length === 0) {
            return `
                        <div class="card">
                            <h2>WCAG-Test</h2>
                            <p>Bitte fügen Sie zuerst mindestens eine zu testende Seite hinzu.</p>
                            <button id="go-to-setup">Zu Grunddaten</button>
                        </div>
                    `
        }

        const currentPage = this.currentPageId
            ? this.model.pages.find((p) => p.id === this.currentPageId)
            : this.model.pages[0]

        this.currentPageId = currentPage.id

        return `
                    <div class="card">
                        <h2>WCAG-Test: ${currentPage.title}</h2>
                        <div class="tabs">
                            ${this.model.pages
                                .map(
                                    (page) => `
                                <div class="tab ${
                                    page.id === this.currentPageId
                                        ? "active"
                                        : ""
                                }" data-page-id="${page.id}">
                                    ${page.title}
                                </div>
                            `
                                )
                                .join("")}
                        </div>

                        <div class="criteria-list">
                            ${wcagCriteria
                                .map((criteria) => {
                                    const result = this.model.getResult(
                                        this.currentPageId,
                                        criteria.id
                                    )
                                    const resultType = result
                                        ? result.resultType
                                        : ""
                                    const comment = result ? result.comment : ""
                                    const resultClass = resultType
                                        ? resultTypes.find(
                                              (r) => r.id === resultType
                                          ).class
                                        : ""

                                    return `
                                    <div class="criteria-item" data-criteria-id="${
                                        criteria.id
                                    }">
                                        <div class="criteria-header">
                                            <div>
                                                <strong>${criteria.id} ${
                                        criteria.name
                                    }</strong> (${criteria.level})
                                                <div><small>${
                                                    criteria.principle
                                                }: ${
                                        criteria.guideline
                                    }</small></div>
                                            </div>
                                            <div>
                                                ${
                                                    resultType
                                                        ? `<span class="result-badge ${resultClass}">${
                                                              resultTypes.find(
                                                                  (r) =>
                                                                      r.id ===
                                                                      resultType
                                                              ).name
                                                          }</span>`
                                                        : ""
                                                }
                                                <button class="criteria-info-button" data-criteria-id="${
                                                    criteria.id
                                                }" title="Kriterium-Informationen anzeigen">i</button>
                                            </div>
                                        </div>
                                        <div class="criteria-content">
                                            <div class="form-group">
                                                <label>Ergebnis</label>
                                                <select class="result-select" data-criteria-id="${
                                                    criteria.id
                                                }" data-page-id="${
                                        this.currentPageId
                                    }">
                                                    <option value="">-- Bitte wählen --</option>
                                                    ${resultTypes
                                                        .map(
                                                            (type) => `
                                                        <option value="${
                                                            type.id
                                                        }" ${
                                                                resultType ===
                                                                type.id
                                                                    ? "selected"
                                                                    : ""
                                                            }>${
                                                                type.name
                                                            }</option>
                                                    `
                                                        )
                                                        .join("")}
                                                </select>
                                            </div>
                                            <div class="form-group">
                                                <label>Begründung / Kommentar</label>
                                                <textarea class="result-comment" data-criteria-id="${
                                                    criteria.id
                                                }" data-page-id="${
                                        this.currentPageId
                                    }" rows="3">${comment}</textarea>
                                            </div>
                                        </div>
                                    </div>
                                `
                                })
                                .join("")}
                        </div>
                    </div>
                `
    }

    renderSummaryView() {
        const summary = this.model.getSummary()

        return `
                    <div class="card">
                        <h2>Auswertung: ${this.model.title}</h2>
                        <p>Datum: ${this.model.date}</p>
                        <p>Website: <a href="${
                            this.model.mainUrl
                        }" target="_blank">${this.model.mainUrl}</a></p>
                        
                        <div class="summary">
                            <div class="summary-card fulfilled-card">
                                <h3>Erfüllt</h3>
                                <div class="count">${summary.fulfilled}</div>
                            </div>
                            <div class="summary-card not-fulfilled-card">
                                <h3>Nicht erfüllt</h3>
                                <div class="count">${summary.notFulfilled}</div>
                            </div>
                            <div class="summary-card not-applicable-card">
                                <h3>Nicht anwendbar</h3>
                                <div class="count">${
                                    summary.notApplicable
                                }</div>
                            </div>
                        </div>

                        <div class="progress-bar" style="margin-top: 24px; height: 20px; width: 100%; background-color: #f5f5f5; border-radius: 10px; overflow: hidden;">
                            <div style="height: 100%; width: ${
                                summary.total
                                    ? Math.round(
                                          (summary.fulfilled / summary.total) *
                                              100
                                      )
                                    : 0
                            }%; background-color: var(--success-color); float: left;"></div>
                            <div style="height: 100%; width: ${
                                summary.total
                                    ? Math.round(
                                          (summary.notFulfilled /
                                              summary.total) *
                                              100
                                      )
                                    : 0
                            }%; background-color: var(--error-color); float: left;"></div>
                            <div style="height: 100%; width: ${
                                summary.total
                                    ? Math.round(
                                          (summary.notApplicable /
                                              summary.total) *
                                              100
                                      )
                                    : 0
                            }%; background-color: #9e9e9e; float: left;"></div>
                        </div>
                        <div style="text-align: center; margin-top: 8px;">
                            ${
                                summary.total
                                    ? Math.round(
                                          (summary.fulfilled / summary.total) *
                                              100
                                      )
                                    : 0
                            }% erfüllt
                        </div>

                        <h3>Detaillierte Ergebnisse</h3>
                        <div class="tabs">
                            <div class="tab active" data-summary-tab="all">Alle</div>
                            <div class="tab" data-summary-tab="fulfilled">Erfüllt</div>
                            <div class="tab" data-summary-tab="not-fulfilled">Nicht erfüllt</div>
                            <div class="tab" data-summary-tab="not-applicable">Nicht anwendbar</div>
                        </div>

                        <div class="summary-content" id="summary-all">
                            ${this.renderDetailedResults(
                                this.model.pages,
                                wcagCriteria
                            )}
                        </div>

                        <div class="summary-content hidden" id="summary-fulfilled">
                            ${this.renderFilteredResults(
                                summary.fulfilledItems
                            )}
                        </div>

                        <div class="summary-content hidden" id="summary-not-fulfilled">
                            ${this.renderFilteredResults(
                                summary.notFulfilledItems
                            )}
                        </div>

                        <div class="summary-content hidden" id="summary-not-applicable">
                            ${this.renderFilteredResults(
                                summary.notApplicableItems
                            )}
                        </div>
                    </div>
                `
    }

    renderDetailedResults(pages, criteria) {
        let html = '<div class="detailed-results">'

        for (const page of pages) {
            html += `<h4>${page.title}</h4>`
            html +=
                '<table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">'
            html += `
                        <tr>
                            <th style="text-align: left; padding: 8px; border-bottom: 1px solid #ddd;">Kriterium</th>
                            <th style="text-align: left; padding: 8px; border-bottom: 1px solid #ddd;">Ergebnis</th>
                            <th style="text-align: left; padding: 8px; border-bottom: 1px solid #ddd;">Begründung</th>
                            <th style="text-align: center; padding: 8px; border-bottom: 1px solid #ddd;">Info</th>
                        </tr>
                    `

            for (const criterion of criteria) {
                const result = this.model.getResult(page.id, criterion.id)
                if (!result) continue

                const resultTypeObj = resultTypes.find(
                    (r) => r.id === result.resultType
                )

                html += `
                            <tr>
                                <td style="padding: 8px; border-bottom: 1px solid #ddd;">${
                                    criterion.id
                                } ${criterion.name}</td>
                                <td style="padding: 8px; border-bottom: 1px solid #ddd;">
                                    <span class="result-badge ${
                                        resultTypeObj.class
                                    }">${resultTypeObj.name}</span>
                                </td>
                                <td style="padding: 8px; border-bottom: 1px solid #ddd;">${
                                    result.comment || "-"
                                }</td>
                                <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: center;">
                                    <button class="criteria-info-button" data-criteria-id="${
                                        criterion.id
                                    }" title="Kriterium-Informationen anzeigen">i</button>
                                </td>
                            </tr>
                        `
            }

            html += "</table>"
        }

        html += "</div>"
        return html
    }

    renderFilteredResults(results) {
        if (results.length === 0) {
            return "<p>Keine Ergebnisse in dieser Kategorie.</p>"
        }

        let html = '<div class="filtered-results">'
        html += '<table style="width: 100%; border-collapse: collapse;">'
        html += `
                    <tr>
                        <th style="text-align: left; padding: 8px; border-bottom: 1px solid #ddd;">Seite</th>
                        <th style="text-align: left; padding: 8px; border-bottom: 1px solid #ddd;">Kriterium</th>
                        <th style="text-align: left; padding: 8px; border-bottom: 1px solid #ddd;">Ergebnis</th>
                        <th style="text-align: left; padding: 8px; border-bottom: 1px solid #ddd;">Begründung</th>
                        <th style="text-align: center; padding: 8px; border-bottom: 1px solid #ddd;">Info</th>
                    </tr>
                `

        for (const result of results) {
            const page = this.model.pages.find((p) => p.id === result.pageId)
            const criterion = wcagCriteria.find(
                (c) => c.id === result.criteriaId
            )
            const resultTypeObj = resultTypes.find(
                (r) => r.id === result.resultType
            )

            html += `
                        <tr>
                            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${
                                page.title
                            }</td>
                            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${
                                criterion.id
                            } ${criterion.name}</td>
                            <td style="padding: 8px; border-bottom: 1px solid #ddd;">
                                <span class="result-badge ${
                                    resultTypeObj.class
                                }">${resultTypeObj.name}</span>
                            </td>
                            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${
                                result.comment || "-"
                            }</td>
                            <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: center;">
                                <button class="criteria-info-button" data-criteria-id="${
                                    result.criteriaId
                                }" title="Kriterium-Informationen anzeigen">i</button>
                            </td>
                        </tr>
                    `
        }

        html += "</table></div>"
        return html
    }
    // Event-Listener
    attachEventListeners() {
        // Navigation zwischen Views
        this.querySelectorAll(".tab[data-view]").forEach((tab) => {
            tab.addEventListener("click", () => {
                this.currentView = tab.dataset.view
                this.render()
            })
        })

        // Setup-View Event Listener
        if (this.currentView === "setup") {
            // Grunddaten speichern
            this.querySelector("#save-basic-data")?.addEventListener(
                "click",
                () => {
                    const title = this.querySelector("#test-title").value
                    const date = this.querySelector("#test-date").value
                    const mainUrl = this.querySelector("#main-url").value
                    this.model.setBasicData(title, date, mainUrl)
                }
            )

            // Seite hinzufügen
            this.querySelector("#add-page")?.addEventListener("click", () => {
                const url = this.querySelector("#page-url").value
                const title = this.querySelector("#page-title").value

                if (url) {
                    this.model.addPage(url, title)
                    this.querySelector("#page-url").value = ""
                    this.querySelector("#page-title").value = ""
                }
            })

            // Seite löschen
            this.querySelectorAll(".delete-page").forEach((button) => {
                button.addEventListener("click", () => {
                    const pageId = parseInt(button.dataset.id)
                    this.model.deletePage(pageId)
                })
            })
        }

        // Test-View Event Listener
        if (this.currentView === "test") {
            // Wechsel zwischen Seiten
            this.querySelectorAll(".tab[data-page-id]").forEach((tab) => {
                tab.addEventListener("click", () => {
                    this.currentPageId = parseInt(tab.dataset.pageId)
                    this.render()
                })
            })

            // Zu Setup navigieren
            this.querySelector("#go-to-setup")?.addEventListener(
                "click",
                () => {
                    this.currentView = "setup"
                    this.render()
                }
            )

            // Kriterien ein-/ausklappen
            this.querySelectorAll(".criteria-header").forEach((header) => {
                header.addEventListener("click", (event) => {
                    // Wenn das Info-Button geklickt wurde, nicht ein-/ausklappen
                    if (
                        event.target.classList.contains("criteria-info-button")
                    ) {
                        return
                    }

                    const content = header.nextElementSibling
                    content.classList.toggle("active")
                })
            })

            // Info-Button für Kriterien
            this.querySelectorAll(".criteria-info-button").forEach((button) => {
                button.addEventListener("click", (event) => {
                    event.stopPropagation() // Verhindert, dass das Kriterium ein-/ausgeklappt wird
                    const criteriaId = button.dataset.criteriaId
                    this.showCriteriaInfoDialog(criteriaId)
                })
            })

            // Ergebnis ändern
            this.querySelectorAll(".result-select").forEach((select) => {
                select.addEventListener("change", () => {
                    const pageId = parseInt(select.dataset.pageId)
                    const criteriaId = select.dataset.criteriaId
                    const resultType = select.value
                    const commentElem = this.querySelector(
                        `.result-comment[data-criteria-id="${criteriaId}"][data-page-id="${pageId}"]`
                    )
                    const comment = commentElem ? commentElem.value : ""

                    this.model.setResult(
                        pageId,
                        criteriaId,
                        resultType,
                        comment
                    )
                })
            })

            // Kommentar ändern
            this.querySelectorAll(".result-comment").forEach((textarea) => {
                textarea.addEventListener("change", () => {
                    const pageId = parseInt(textarea.dataset.pageId)
                    const criteriaId = textarea.dataset.criteriaId
                    const comment = textarea.value
                    const selectElem = this.querySelector(
                        `.result-select[data-criteria-id="${criteriaId}"][data-page-id="${pageId}"]`
                    )
                    const resultType = selectElem ? selectElem.value : ""

                    if (resultType) {
                        this.model.setResult(
                            pageId,
                            criteriaId,
                            resultType,
                            comment
                        )
                    }
                })
            })
        }

        // Summary-View Event Listener
        if (this.currentView === "summary") {
            this.querySelectorAll(".tab[data-summary-tab]").forEach((tab) => {
                tab.addEventListener("click", () => {
                    const tabId = tab.dataset.summaryTab

                    // Tabs umschalten
                    this.querySelectorAll(".tab[data-summary-tab]").forEach(
                        (t) => {
                            t.classList.toggle("active", t === tab)
                        }
                    )

                    // Inhalte umschalten
                    this.querySelectorAll(".summary-content").forEach(
                        (content) => {
                            content.classList.toggle(
                                "hidden",
                                content.id !== `summary-${tabId}`
                            )
                        }
                    )
                })
            })

            // Info-Button für Kriterien in der Zusammenfassung
            this.querySelectorAll(".criteria-info-button").forEach((button) => {
                button.addEventListener("click", (event) => {
                    event.stopPropagation()
                    const criteriaId = button.dataset.criteriaId
                    this.showCriteriaInfoDialog(criteriaId)
                })
            })
        }
    }

    // Dialog für Kriterien-Informationen anzeigen
    showCriteriaInfoDialog(criteriaId) {
        const criteria = allWcagCriteria.find((c) => c.id === criteriaId)
        if (!criteria) return

        // Dialog-Element erstellen
        const dialogBackdrop = document.createElement("div")
        dialogBackdrop.className = "dialog-backdrop"

        const dialog = document.createElement("div")
        dialog.className = "dialog"

        const dialogHeader = document.createElement("div")
        dialogHeader.className = "dialog-header"
        dialogHeader.innerHTML = `
                    <h2 class="dialog-title">${criteria.id} ${criteria.name} (${criteria.level})</h2>
                    <button class="dialog-close">&times;</button>
                `

        const dialogContent = document.createElement("div")
        dialogContent.className = "dialog-content"

        // Lade Markdown-Datei
        this.loadCriteriaMarkdown(criteria.mdFile)
            .then((content) => {
                dialogContent.innerHTML = `
                            <div class="markdown-content">
                                ${this.renderMarkdown(content)}
                            </div>
                        `
            })
            .catch((error) => {
                dialogContent.innerHTML = `
                            <div class="markdown-content">
                                <p>Fehler beim Laden der Kriterien-Informationen: ${error.message}</p>
                                <p>Datei: ${criteria.mdFile}</p>
                            </div>
                        `
            })

        const dialogFooter = document.createElement("div")
        dialogFooter.className = "dialog-footer"
        dialogFooter.innerHTML = `
                    <button class="dialog-close-btn">Schließen</button>
                `

        dialog.appendChild(dialogHeader)
        dialog.appendChild(dialogContent)
        dialog.appendChild(dialogFooter)
        dialogBackdrop.appendChild(dialog)

        document.body.appendChild(dialogBackdrop)

        // Event-Listener für das Schließen des Dialogs
        const closeDialog = () => {
            document.body.removeChild(dialogBackdrop)
        }

        dialogBackdrop.addEventListener("click", (event) => {
            if (event.target === dialogBackdrop) {
                closeDialog()
            }
        })

        dialogHeader
            .querySelector(".dialog-close")
            .addEventListener("click", closeDialog)
        dialogFooter
            .querySelector(".dialog-close-btn")
            .addEventListener("click", closeDialog)
    }

    // Lade Markdown-Datei
    async loadCriteriaMarkdown(mdFile) {
        // Simuliere das Laden der Markdown-Datei
        // In einer realen Anwendung würde hier die Datei vom Server geladen
        return new Promise((resolve, reject) => {
            // Überprüfen, ob wir den Inhalt bereits im Cache haben
            if (
                this.criteriaDialogContent &&
                this.criteriaDialogContent[mdFile]
            ) {
                resolve(this.criteriaDialogContent[mdFile])
                return
            }

            // Simulierter Inhalt (in einer realen Anwendung würde hier die Datei geladen werden)
            const mockContent = this.getMockMarkdownContent(mdFile)

            // Cache initialisieren, falls er noch nicht existiert
            if (!this.criteriaDialogContent) {
                this.criteriaDialogContent = {}
            }

            // In den Cache legen
            this.criteriaDialogContent[mdFile] = mockContent

            // In der realen Anwendung würde die Datei asynchron geladen
            setTimeout(() => {
                resolve(mockContent)
            }, 200)
        })
    }

    // Einfache Markdown-Verarbeitung (in einer realen Anwendung würde eine Markdown-Bibliothek verwendet)
    renderMarkdown(markdown) {
        if (!markdown) return ""

        // Einfache Markdown-zu-HTML-Konvertierung (vereinfacht)
        let html = markdown
            // Headers
            .replace(/^# (.+)$/gm, "<h1>$1</h1>")
            .replace(/^## (.+)$/gm, "<h2>$1</h2>")
            .replace(/^### (.+)$/gm, "<h3>$1</h3>")

            // Fettdruck und Kursiv
            .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
            .replace(/\*(.+?)\*/g, "<em>$1</em>")

            // Listen
            .replace(/^\* (.+)$/gm, "<ul><li>$1</li></ul>")
            .replace(/^- (.+)$/gm, "<ul><li>$1</li></ul>")
            .replace(/^(\d+)\. (.+)$/gm, "<ol><li>$2</li></ol>")

            // Links
            .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>')

            // Inline Code
            .replace(/`(.+?)`/g, "<code>$1</code>")

            // Absätze
            .replace(/^(?!<[hou]).+$/gm, "<p>$&</p>")

        // Aufeinanderfolgende <ul> oder <ol> Tags zusammenfassen
        html = html.replace(/<\/ul>\n<ul>/g, "").replace(/<\/ol>\n<ol>/g, "")

        return html
    }

    // Mock-Inhalt für Markdown-Dateien (für Demo-Zwecke)
    getMockMarkdownContent(mdFile) {
        const criteriaId = mdFile.match(/wcag-(.+?)\.md/)[1]
        const criteria = allWcagCriteria.find((c) => c.id === criteriaId)

        if (!criteria) return "Keine Informationen verfügbar."

        return `# ${criteria.id} ${criteria.name}

## Kurzbeschreibung
${this.getCriteriaDescription(criteria.id)}

## Konformitätsstufe
**${criteria.level}**

## Prinzip
${criteria.principle}

## Richtlinie
${criteria.guideline}

## Erfolgskreiterium
${this.getCriteriaDescription(criteria.id, true)}

## Zweck des Kriteriums
${this.getCriteriaPurpose(criteria.id)}

## Nutzen
${this.getCriteriaBenefit(criteria.id)}

## Beispiele
${this.getCriteriaExamples(criteria.id)}

## Techniken und Fehler
- Ausreichende Techniken
- Beratende Techniken
- Fehler

*Hinweis: Diese Inhalte dienen nur zur Demonstration. In einer realen Anwendung sollten die tatsächlichen Markdown-Dateien verwendet werden.*
`
    }

    // Hilfsfunktionen für die Demo-Inhalte
    getCriteriaDescription(criteriaId, detailed = false) {
        const descriptions = {
            "1.1.1": detailed
                ? "Alle Nicht-Text-Inhalte, die dem Benutzer präsentiert werden, haben eine Textalternative, die einem äquivalenten Zweck dient, außer in den unten aufgeführten Situationen."
                : "Bietet Textalternativen für alle Nicht-Text-Inhalte.",
            "1.3.1": detailed
                ? "Informationen, Struktur und Beziehungen, die durch Präsentation vermittelt werden, können programmatisch bestimmt werden oder sind im Text verfügbar."
                : "Stellt sicher, dass Informationen und Beziehungen aus der visuellen Präsentation auch programmatisch verfügbar sind.",
            "2.4.1": detailed
                ? "Es ist ein Mechanismus verfügbar, um Blöcke von Inhalt, die auf verschiedenen Webseiten wiederholt werden, zu umgehen."
                : "Ermöglicht es Benutzern, wiederkehrende Inhaltsblöcke zu überspringen.",
        }

        return (
            descriptions[criteriaId] ||
            (detailed
                ? "Die detaillierte Beschreibung für dieses Kriterium ist in der realen Anwendung verfügbar."
                : "Dieses Kriterium stellt sicher, dass die Webinhalte für Menschen mit Behinderungen zugänglich sind.")
        )
    }

    getCriteriaPurpose(criteriaId) {
        const purposes = {
            "1.1.1":
                "Der Zweck dieses Erfolgskriteriums ist es, sicherzustellen, dass alle Nicht-Text-Inhalte auch in Textform verfügbar sind, damit sie in alternative Formen umgewandelt werden können, die Menschen benötigen, wie z.B. große Schrift, Braille, Sprache, Symbole oder einfachere Sprache.",
            "1.3.1":
                "Der Zweck dieses Erfolgskriteriums ist es, sicherzustellen, dass Informationen und Beziehungen, die durch die visuelle oder akustische Formatierung vermittelt werden, erhalten bleiben, wenn die Präsentation sich ändert.",
        }

        return (
            purposes[criteriaId] ||
            "Dieses Kriterium trägt dazu bei, dass Menschen mit Behinderungen die Webinhalte nutzen können, indem sichergestellt wird, dass die Informationen in verschiedenen Kontexten und durch verschiedene Benutzeragenten zugänglich bleiben."
        )
    }

    getCriteriaBenefit(criteriaId) {
        const benefits = {
            "1.1.1":
                "- Blinde Menschen können sich die Informationen durch Sprachausgabe oder Braille-Displays vorlesen lassen\n- Taubblinde Menschen können den Text in Braille lesen\n- Menschen mit Sehbehinderungen können den Text vergrößern oder die Kontraste anpassen\n- Menschen mit Leseschwierigkeiten können Texte von einem Screen Reader vorlesen lassen",
            "2.4.1":
                "- Menschen, die nur die Tastatur verwenden, können schneller zum Hauptinhalt navigieren\n- Menschen mit eingeschränktem Sehvermögen müssen sich nicht durch wiederholte Blöcke navigieren\n- Menschen mit kognitiven Einschränkungen werden weniger durch wiederholte Inhalte abgelenkt",
        }

        return (
            benefits[criteriaId] ||
            "- Verbessert die Zugänglichkeit für Menschen mit verschiedenen Behinderungen\n- Ermöglicht die Nutzung von assistiven Technologien\n- Sorgt für bessere Nutzererfahrung für alle Benutzer"
        )
    }

    getCriteriaExamples(criteriaId) {
        const examples = {
            "1.1.1":
                "- Ein Bild eines Diagramms mit einem entsprechenden alt-Text\n- Ein Audioclip mit einer Texttranskription\n- Ein Formular mit klaren Beschriftungen und Anweisungen",
            "2.4.1":
                '- Ein "Zum Hauptinhalt springen"-Link am Anfang der Seite\n- ARIA-Landmarks zur Kennzeichnung der Hauptbereiche der Seite\n- Eine konsistente Navigation mit klar gekennzeichneten Abschnitten',
        }

        return (
            examples[criteriaId] ||
            "- Beispiele für die Umsetzung würden hier in der realen Anwendung angezeigt"
        )
    }

    // Observer-Methode
    update() {
        this.render()
    }
}

// Registriere die Web-Komponente
customElements.define("wcag-test-app", WcagTestApp)

// Hilfsfunktionen für Export/Import
function exportData() {
    const app = document.querySelector("wcag-test-app")
    const data = JSON.stringify(app.model.toJSON(), null, 2)
    const blob = new Blob([data], { type: "application/json" })
    const url = URL.createObjectURL(blob)

    const a = document.createElement("a")
    a.href = url
    a.download = `wcag-test-${
        app.model.title.replace(/\s+/g, "-") || "export"
    }.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    showNotification("Daten erfolgreich exportiert")
}

function importData(file) {
    const reader = new FileReader()
    reader.onload = (event) => {
        try {
            const data = JSON.parse(event.target.result)
            const app = document.querySelector("wcag-test-app")
            app.model.fromJSON(data)
            showNotification("Daten erfolgreich importiert")
        } catch (error) {
            console.error("Fehler beim Importieren der Daten:", error)
            showNotification("Fehler beim Importieren der Daten", true)
        }
    }
    reader.readAsText(file)
}

// Event-Listener für die Hauptbuttons
document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM vollständig geladen")
    console.log("Save-Button:", document.getElementById("save-local-storage"))

    // Export-Button
    document.getElementById("export-data").addEventListener("click", () => {
        exportData()
    })

    // Import-Button
    document
        .getElementById("import-file")
        .addEventListener("change", (event) => {
            if (event.target.files.length > 0) {
                importData(event.target.files[0])
            }
        })

    // LocalStorage speichern
    document
        .getElementById("save-local-storage")
        .addEventListener("click", () => {
            console.log("Save-Button wurde geklickt")

            try {
                const app = document.querySelector("wcag-test-app")
                console.log("Web-Komponente gefunden:", app)

                if (!app) {
                    console.error("Web-Komponente nicht gefunden")
                    showNotification(
                        "Fehler: Web-Komponente nicht gefunden",
                        true
                    )
                    return
                }

                console.log("Prüfe Model-Objekt:", app.model)

                if (!app || !app.model) {
                    console.error("Model nicht gefunden")
                    showNotification("Fehler: Model nicht verfügbar", true)
                    return
                }

                console.log("Rufe saveToLocalStorage auf")

                if (app.model.saveToLocalStorage()) {
                    console.log("Speichern erfolgreich")
                    showNotification("Daten im Browser gespeichert")
                } else {
                    console.error("Speichern fehlgeschlagen")
                    showNotification("Fehler beim Speichern der Daten", true)
                }
            } catch (error) {
                console.error("Fehler beim Speichern:", error)
                showNotification("Unerwarteter Fehler: " + error.message, true)
            }
        })

    // LocalStorage laden
    document
        .getElementById("load-local-storage")
        .addEventListener("click", () => {
            const app = document.querySelector("wcag-test-app")
            if (app.model.loadFromLocalStorage()) {
                app.currentView = "setup" // oder "summary", wenn du direkt zur Auswertung willst
                app.render()
                showNotification("Daten aus Browser geladen")
            } else {
                showNotification("Keine gespeicherten Daten gefunden", true)
            }
        })

})

// Benachrichtigungsfunktion
function showNotification(message, isError = false) {
    // Entferne vorhandene Benachrichtigungen
    const existingNotifications = document.querySelectorAll(".notification")
    existingNotifications.forEach((notification) => {
        notification.remove()
    })

    // Erstelle neue Benachrichtigung
    const notification = document.createElement("div")
    notification.className =
        "notification " +
        (isError ? "notification-error" : "notification-success")
    notification.textContent = message

    // Styling
    notification.style.position = "fixed"
    notification.style.bottom = "20px"
    notification.style.right = "20px"
    notification.style.padding = "12px 16px"
    notification.style.borderRadius = "4px"
    notification.style.boxShadow = "0 2px 10px rgba(0,0,0,0.1)"
    notification.style.zIndex = "1000"

    if (isError) {
        notification.style.backgroundColor = "#ffebee"
        notification.style.color = "#c62828"
        notification.style.border = "1px solid #ef9a9a"
    } else {
        notification.style.backgroundColor = "#e8f5e9"
        notification.style.color = "#2e7d32"
        notification.style.border = "1px solid #a5d6a7"
    }

    document.body.appendChild(notification)

    // Automatisch ausblenden nach 3 Sekunden
    setTimeout(() => {
        notification.style.opacity = "0"
        notification.style.transition = "opacity 0.5s ease"
        setTimeout(() => {
            notification.remove()
        }, 500)
    }, 3000)
}
// - - - - -
