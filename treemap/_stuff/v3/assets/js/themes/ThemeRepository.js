/**
 *    @version v3
 */

// themes/ThemeRepository.js - Datenzugriff für Themen
class ThemeRepository {
    constructor(storageKey = "themeManagerCollections") {
        this.storageKey = storageKey
        this.themes = this.loadThemes()
    }

    /**
     * Lädt Themen aus dem lokalen Speicher
     * @returns {object} - Objekt mit Themen (key: id, value: ThemeModel)
     */
    loadThemes() {
        const savedData = localStorage.getItem(this.storageKey)
        if (!savedData) return {}

        try {
            const parsedData = JSON.parse(savedData)
            const themes = {}

            // Konvertiere die JSON-Daten in ThemeModel-Objekte
            Object.entries(parsedData).forEach(([id, data]) => {
                themes[id] = new ThemeModel(data)
            })

            return themes
        } catch (error) {
            console.error("Fehler beim Laden der Themen:", error)
            return {}
        }
    }

    /**
     * Speichert Themen im lokalen Speicher
     */
    saveThemes() {
        const themesJSON = {}

        // Konvertiere die ThemeModel-Objekte in JSON
        Object.entries(this.themes).forEach(([id, theme]) => {
            themesJSON[id] = theme.toJSON()
        })

        localStorage.setItem(this.storageKey, JSON.stringify(themesJSON))
    }

    /**
     * Gibt alle Themen zurück
     * @returns {Array<ThemeModel>} - Array mit allen Themen
     */
    getAll() {
        return Object.values(this.themes)
    }

    // themes/ThemeRepository.js - Fortsetzung
    /**
     * Gibt ein Thema anhand seiner ID zurück
     * @param {string} id - ID des Themas
     * @returns {ThemeModel|null} - Thema oder null wenn nicht gefunden
     */
    getById(id) {
        return this.themes[id] || null
    }

    /**
     * Speichert ein Thema
     * @param {ThemeModel} theme - Das zu speichernde Thema
     * @returns {ThemeModel} - Das gespeicherte Thema
     * @throws {Error} - Bei ungültigen Daten
     */
    save(theme) {
        // Validierung
        const validation = theme.validate()
        if (!validation.isValid) {
            throw new Error(validation.errors.join(" "))
        }

        this.themes[theme.id] = theme
        this.saveThemes()
        return theme
    }

    /**
     * Löscht ein Thema
     * @param {string} id - ID des zu löschenden Themas
     * @returns {boolean} - true wenn erfolgreich, false wenn nicht gefunden
     */
    delete(id) {
        if (this.themes[id]) {
            delete this.themes[id]
            this.saveThemes()
            return true
        }
        return false
    }

    /**
     * Migriert Daten aus dem alten Format
     */
    migrateFromLegacyFormat() {
        const legacyCollections = localStorage.getItem("bitvCollections")
        if (!legacyCollections) return

        try {
            const collections = JSON.parse(legacyCollections)

            Object.entries(collections).forEach(([name, pruefschrittIds]) => {
                const theme = new ThemeModel({
                    title: name,
                    author: "Migriert",
                    data: pruefschrittIds.map((item) => ({
                        id: item.id,
                        title: item.title,
                        section: item.sectionIndex,
                        description: item.description,
                        conformanceLevel: item.conformanceLevel,
                    })),
                })

                this.save(theme)
            })

            // Altes Format entfernen
            localStorage.removeItem("bitvCollections")
        } catch (error) {
            console.error("Fehler bei der Migration:", error)
        }
    }
}
