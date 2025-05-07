/**
 *    @version v3
 */

// themes/ThemeModel.js - Datenmodell für Themen
class ThemeModel {
    constructor(data = {}) {
        this.id = data.id || Utils.generateId()
        this.title = data.title || ""
        this.author = data.author || ""
        this.description = data.description || ""
        this.data = Array.isArray(data.data) ? [...data.data] : []
        this.created = data.created || Utils.getCurrentDateTime()
        this.lastModified = data.lastModified || this.created
    }

    /**
     * Validiert die Themenattribute
     * @returns {object} - Validierungsergebnis (isValid, errors)
     */
    validate() {
        const errors = []

        if (!this.title.trim()) {
            errors.push("Der Titel darf nicht leer sein.")
        }

        return {
            isValid: errors.length === 0,
            errors,
        }
    }

    /**
     * Fügt einen Prüfschritt hinzu
     * @param {object} criterion - Der hinzuzufügende Prüfschritt
     * @returns {boolean} - true wenn erfolgreich, false wenn bereits vorhanden
     */
    addCriterion(criterion) {
        // Prüfen, ob der Prüfschritt bereits vorhanden ist
        if (this.hasCriterion(criterion.id)) {
            return false
        }

        this.data.push({
            id: criterion.id,
            title: criterion.title,
            section: criterion.section || 0,
            description: criterion.description || "",
            conformanceLevel: criterion.conformanceLevel,
        })

        this.lastModified = Utils.getCurrentDateTime()
        return true
    }

    /**
     * Entfernt einen Prüfschritt
     * @param {string} criterionId - ID des zu entfernenden Prüfschritts
     * @returns {boolean} - true wenn erfolgreich, false wenn nicht gefunden
     */
    removeCriterion(criterionId) {
        const initialLength = this.data.length
        this.data = this.data.filter((c) => c.id !== criterionId)

        const wasRemoved = this.data.length < initialLength

        if (wasRemoved) {
            this.lastModified = Utils.getCurrentDateTime()
        }

        return wasRemoved
    }

    /**
     * Prüft, ob ein Prüfschritt bereits im Thema enthalten ist
     * @param {string} criterionId - ID des zu prüfenden Prüfschritts
     * @returns {boolean} - true wenn vorhanden, sonst false
     */
    hasCriterion(criterionId) {
        return this.data.some((c) => c.id === criterionId)
    }

    /**
     * Aktualisiert die Themenattribute
     * @param {object} data - Neue Attribute
     * @returns {boolean} - true wenn erfolgreich
     */
    update(data) {
        if (data.title !== undefined) this.title = data.title
        if (data.author !== undefined) this.author = data.author
        if (data.description !== undefined) this.description = data.description

        this.lastModified = Utils.getCurrentDateTime()
        return true
    }

    /**
     * Konvertiert das Thema in ein JSON-Objekt
     * @returns {object} - JSON-Repräsentation des Themas
     */
    toJSON() {
        return {
            id: this.id,
            title: this.title,
            author: this.author,
            description: this.description,
            data: [...this.data],
            created: this.created,
            lastModified: this.lastModified,
        }
    }

    /**
     * Erstellt eine Kopie des Themas
     * @returns {ThemeModel} - Kopie des Themas
     */
    clone() {
        return new ThemeModel(this.toJSON())
    }
}
