/**
 *    @version v3
 */

// themes/ThemeManager.js - Hauptsteuerung der Themen
class ThemeManager {
    constructor() {
        this.repository = new ThemeRepository()

        // Event-Bus für themenbezogene Events
        this.eventBus = null
        if (typeof EventBus !== "undefined") {
            this.eventBus = EventBus.getGlobalInstance()
        }

        // Singleton-Instanz
        ThemeManager._instance = this

        // Einmalige Migration von Legacy-Daten
        this.repository.migrateFromLegacyFormat()
    }

    /**
     * Singleton-Getter
     * @returns {ThemeManager} - Die Singleton-Instanz
     */
    static getInstance() {
        if (!ThemeManager._instance) {
            return new ThemeManager()
        }
        return ThemeManager._instance
    }

    /**
     * Gibt alle verfügbaren Themen zurück
     * @returns {Array<ThemeModel>} - Array mit allen Themen
     */
    getAllThemes() {
        return this.repository.getAll()
    }

    /**
     * Gibt ein Thema anhand seiner ID zurück
     * @param {string} id - ID des Themas
     * @returns {ThemeModel|null} - Thema oder null wenn nicht gefunden
     */
    getThemeById(id) {
        return this.repository.getById(id)
    }

    /**
     * Erstellt ein neues Thema
     * @param {object} data - Daten für das neue Thema
     * @returns {ThemeModel} - Das erstellte Thema
     */
    createTheme(data) {
        const theme = new ThemeModel(data)

        // Validierung
        const validation = theme.validate()
        if (!validation.isValid) {
            throw new Error(validation.errors.join(" "))
        }

        this.repository.save(theme)

        // Event veröffentlichen
        if (this.eventBus) {
            this.eventBus.publish("theme:created", { theme })
        }

        return theme
    }

    /**
     * Aktualisiert ein bestehendes Thema
     * @param {string} id - ID des zu aktualisierenden Themas
     * @param {object} data - Neue Daten
     * @returns {ThemeModel} - Das aktualisierte Thema
     */
    updateTheme(id, data) {
        const theme = this.getThemeById(id)
        if (!theme) {
            throw new Error(`Thema mit ID ${id} nicht gefunden.`)
        }

        theme.update(data)

        // Validierung
        const validation = theme.validate()
        if (!validation.isValid) {
            throw new Error(validation.errors.join(" "))
        }

        this.repository.save(theme)

        // Event veröffentlichen
        if (this.eventBus) {
            this.eventBus.publish("theme:updated", { theme })
        }

        return theme
    }

    /**
     * Löscht ein Thema
     * @param {string} id - ID des zu löschenden Themas
     * @returns {boolean} - true wenn erfolgreich, false wenn nicht gefunden
     */
    deleteTheme(id) {
        const theme = this.getThemeById(id)
        if (!theme) return false

        const success = this.repository.delete(id)

        // Event veröffentlichen
        if (success && this.eventBus) {
            this.eventBus.publish("theme:deleted", { themeId: id })
        }

        return success
    }

    /**
     * Fügt einen Prüfschritt zu einem Thema hinzu
     * @param {string} themeId - ID des Themas
     * @param {object} criterion - Der hinzuzufügende Prüfschritt
     * @param {number} sectionIndex - Index der Sektion (optional)
     * @returns {boolean} - true wenn erfolgreich, false wenn bereits vorhanden
     */
    addCriterionToTheme(themeId, criterion, sectionIndex = 0) {
        const theme = this.getThemeById(themeId)
        if (!theme) {
            throw new Error(`Thema mit ID ${themeId} nicht gefunden.`)
        }

        // Erweitere Kriterium um Sektionsindex, falls nicht vorhanden
        const enrichedCriterion = {
            ...criterion,
            section: sectionIndex,
        }

        const success = theme.addCriterion(enrichedCriterion)

        if (success) {
            this.repository.save(theme)

            // Event veröffentlichen
            if (this.eventBus) {
                this.eventBus.publish("theme:criterion-added", {
                    theme,
                    criterion: enrichedCriterion,
                })
            }
        }

        return success
    }

    /**
     * Entfernt einen Prüfschritt aus einem Thema
     * @param {string} themeId - ID des Themas
     * @param {string} criterionId - ID des zu entfernenden Prüfschritts
     * @returns {boolean} - true wenn erfolgreich, false wenn nicht gefunden
     */
    removeCriterionFromTheme(themeId, criterionId) {
        const theme = this.getThemeById(themeId)
        if (!theme) {
            throw new Error(`Thema mit ID ${themeId} nicht gefunden.`)
        }

        const success = theme.removeCriterion(criterionId)

        if (success) {
            this.repository.save(theme)

            // Event veröffentlichen
            if (this.eventBus) {
                this.eventBus.publish("theme:criterion-removed", {
                    theme,
                    criterionId,
                })
            }
        }

        return success
    }

    /**
     * Setzt ein Thema als aktiv
     * @param {string} themeId - ID des aktiven Themas (oder null zum Deaktivieren)
     */
    setActiveTheme(themeId) {
        // Altes aktives Thema speichern
        const oldActiveThemeId = document.body.dataset.activeThemeId

        // Neues aktives Thema setzen oder entfernen
        if (themeId) {
            document.body.dataset.activeThemeId = themeId
        } else {
            delete document.body.dataset.activeThemeId
        }

        // Event veröffentlichen
        if (this.eventBus) {
            this.eventBus.publish("theme:active-changed", {
                oldActiveThemeId,
                newActiveThemeId: themeId,
            })
        }
    }

    /**
     * Gibt das aktuell aktive Thema zurück
     * @returns {ThemeModel|null} - Das aktive Thema oder null
     */
    getActiveTheme() {
        const activeThemeId = document.body.dataset.activeThemeId
        if (!activeThemeId) return null

        return this.getThemeById(activeThemeId)
    }

    /**
     * Exportiert ein Thema als JSON-String
     * @param {string} themeId - ID des zu exportierenden Themas
     * @returns {string} - JSON-String des Themas
     */
    exportTheme(themeId) {
        const theme = this.getThemeById(themeId)
        if (!theme) {
            throw new Error(`Thema mit ID ${themeId} nicht gefunden.`)
        }

        return JSON.stringify(theme.toJSON(), null, 2)
    }

    /**
     * Importiert ein Thema aus einem JSON-String
     * @param {string} jsonString - JSON-String des zu importierenden Themas
     * @returns {ThemeModel} - Das importierte Thema
     */
    importTheme(jsonString) {
        try {
            const themeData = JSON.parse(jsonString)

            // Grundlegende Validierung
            if (!themeData.title) {
                throw new Error("Ungültiges Themenformat: Titel fehlt")
            }

            // ID generieren, um Konflikte zu vermeiden
            themeData.id = Utils.generateId()

            // Datum aktualisieren
            const dateTime = Utils.getCurrentDateTime()
            themeData.created = dateTime
            themeData.lastModified = dateTime

            // Thema erstellen und speichern
            return this.createTheme(themeData)
        } catch (error) {
            throw new Error(
                `Fehler beim Importieren des Themas: ${error.message}`
            )
        }
    }
}
