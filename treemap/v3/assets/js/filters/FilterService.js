/**
 *    @version v3
 */

// filters/FilterService.js - Anwendung von Filtern auf Daten
class FilterService {
    /**
     * Prüft, ob ein Prüfschritt dem Suchkriterium entspricht
     * @param {HTMLElement} card - Karten-Element
     * @param {object} pruefschritt - Prüfschritt-Daten
     * @param {string} searchText - Suchbegriff
     * @returns {boolean} - true wenn zutreffend, sonst false
     */
    matchesSearch(card, pruefschritt, searchText) {
        if (!searchText) return true

        const search = searchText.toLowerCase()
        const cardText = card.textContent.toLowerCase()

        // Suche in verschiedenen Feldern
        return (
            cardText.includes(search) ||
            (pruefschritt.wcagId &&
                pruefschritt.wcagId.toLowerCase().includes(search)) ||
            (pruefschritt.bitvId &&
                pruefschritt.bitvId.toLowerCase().includes(search)) ||
            (pruefschritt.details?.description &&
                pruefschritt.details.description
                    .toLowerCase()
                    .includes(search)) ||
            (pruefschritt.details?.who &&
                Array.isArray(pruefschritt.details.who) &&
                pruefschritt.details.who.some((person) =>
                    person.toLowerCase().includes(search)
                ))
        )
    }

    /**
     * Prüft, ob ein Prüfschritt den Konformitätslevel-Filtern entspricht
     * @param {HTMLElement} card - Karten-Element
     * @param {object} pruefschritt - Prüfschritt-Daten
     * @param {Set} levels - Aktive Konformitätslevel-Filter
     * @returns {boolean} - true wenn zutreffend, sonst false
     */
    matchesLevel(card, pruefschritt, levels) {
        if (levels.size === 0) return true

        const levelElement = card.querySelector(".A, .AA, .AAA")
        if (!levelElement) return false

        return levels.has(levelElement.textContent)
    }

    /**
     * Prüft, ob ein Prüfschritt den Standard-Filtern entspricht
     * @param {object} pruefschritt - Prüfschritt-Daten
     * @param {Set} standards - Aktive Standard-Filter
     * @returns {boolean} - true wenn zutreffend, sonst false
     */
    matchesStandard(pruefschritt, standards) {
        if (standards.size === 0) return true

        // Prüfen, ob einer der aktiven Standards dem Prüfschritt entspricht
        return (
            (pruefschritt.bitvId && standards.has("BITV")) ||
            (pruefschritt.wcagId && standards.has("WCAG")) ||
            (pruefschritt.en301549Id && standards.has("EN301549")) ||
            (pruefschritt.bitInklusivId && standards.has("BITinklusiv"))
        )
    }

    /**
     * Prüft, ob ein Prüfschritt den Berufsgruppen-Filtern entspricht
     * @param {object} pruefschritt - Prüfschritt-Daten
     * @param {Set} professions - Aktive Berufsgruppen-Filter
     * @returns {boolean} - true wenn zutreffend, sonst false
     */
    matchesProfession(pruefschritt, professions) {
        if (professions.size === 0) return true

        // Wenn keine Berufsgruppen angegeben sind, immer anzeigen
        if (
            !pruefschritt.details?.who ||
            !Array.isArray(pruefschritt.details.who)
        ) {
            return true
        }

        // Mapping von Berufsgruppen zu Kategorien
        const professionGroups = {
            "Requirements": [
                "Produktmanager",
                "Informationsarchitekten",
                "Barrierefreiheitsexperten",
                "Systemarchitekten",
            ],
            "Design": [
                "Designer",
                "UX-Designer",
                "Grafiker",
                "Formulardesigner",
                "Interaktionsdesigner",
                "Mobile-Experten",
            ],
            "Entwicklung": [
                "Entwickler",
                "Frontend-Entwickler",
                "Entwickler von Autorenwerkzeugen",
                "Audio-Ingenieure",
                "Videoingenieure",
                "Netzwerkspezialisten",
                "Performanceexperten",
            ],
            "Testen": [
                "Tester",
                "Qualitätssicherung",
                "Screenreader-Spezialisten",
            ],
            "Release": [
                "Sicherheitsexperten",
                "Interoperabilitätsspezialisten",
                "Dokumentationsverantwortliche",
            ],
            "Wartung": ["Support-Teams", "Technischer Kundendienst"],
            "UX Writer": [
                "Kommunikationsspezialisten",
                "Gebärdensprachexperten",
                "Sprachexperten",
                "Untertitelexperten",
                "Audiodeskriptionsexperten",
            ],
            "Redaktion": [
                "Redakteure",
                "Content-Manager",
                "Videoredakteure",
                "Live-Redakteure",
                "Medienspezialisten",
            ],
            "Corporate Text": [
                "Dokumentenspezialisten",
                "Synchronisationsexperten",
                "Synchronisationsspezialisten",
            ],
        }

        // Prüfen, ob einer der angegebenen Berufe in einer aktiven Berufsgruppe ist
        return pruefschritt.details.who.some((profession) => {
            for (const [category, professionsList] of Object.entries(
                professionGroups
            )) {
                if (
                    professions.has(category) &&
                    professionsList.some(
                        (p) => p.toLowerCase() === profession.toLowerCase()
                    )
                ) {
                    return true
                }
            }
            return false
        })
    }
}
