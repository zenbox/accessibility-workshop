export class DocumentHandler {
    constructor() {
        this.STORAGE_KEY = "collaborative-editor-docs"
        this.LAST_DOC_KEY = "last-document-id"
        this.documents = []
        this.currentDocumentId = null
    }

    async init() {
        // Lade gespeicherte Dokumente
        const storedDocs = localStorage.getItem(this.STORAGE_KEY)
        if (storedDocs) {
            this.documents = JSON.parse(storedDocs)
        } else {
            try {
                const response = await fetch("initial-docs.json")
                this.documents = await response.json()
                this.saveToStorage()
            } catch (error) {
                console.error("Fehler beim Laden der Initial-Dokumente:", error)
                this.documents = [
                    {
                        id: 1,
                        title: "Willkommen",
                        content:
                            "# Willkommen im Editor\n\nDies ist ein Markdown und HTML Editor.",
                        css: "/* Füge hier dein CSS ein */",
                        last_modified: new Date().toISOString(),
                    },
                ]
                this.saveToStorage()
            }
        }

        // Lade letztes aktives Dokument
        const lastDocId = localStorage.getItem(this.LAST_DOC_KEY)
        if (lastDocId) {
            const lastDoc = this.loadDocument(parseInt(lastDocId))
            if (lastDoc) {
                // UI aktualisieren
                const editor = document.getElementById("editor")
                const cssEditor = document.getElementById("css-editor")
                const titleElement = document.getElementById(
                    "current-document-title"
                )

                if (editor) editor.value = lastDoc.content || ""
                if (cssEditor) cssEditor.value = lastDoc.css || ""
                if (titleElement) titleElement.textContent = lastDoc.title

                // Preview aktualisieren
                const { updateEditorAndPreview, applyCSS } = await import(
                    "./editorHandlers.js"
                )
                updateEditorAndPreview(lastDoc.content || "")
                applyCSS(lastDoc.css || "")
            }
        }
    }

    saveToStorage() {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.documents))
    }

    loadDocument(id) {
        const doc = this.documents.find((d) => d.id === id)
        if (!doc) return null

        this.currentDocumentId = id
        localStorage.setItem(this.LAST_DOC_KEY, id.toString())
        return doc
    }

    saveDocument(title, content, css) {
        const now = new Date().toISOString()

        if (this.currentDocumentId) {
            const index = this.documents.findIndex(
                (d) => d.id === this.currentDocumentId
            )
            if (index !== -1) {
                this.documents[index] = {
                    ...this.documents[index],
                    title,
                    content,
                    css,
                    last_modified: now,
                }
            }
        } else {
            const newId = Math.max(0, ...this.documents.map((d) => d.id)) + 1
            this.documents.push({
                id: newId,
                title,
                content,
                css,
                last_modified: now,
            })
            this.currentDocumentId = newId
            localStorage.setItem(this.LAST_DOC_KEY, newId)
        }

        this.saveToStorage()
        return this.currentDocumentId
    }

    deleteDocument(id) {
        const index = this.documents.findIndex((d) => d.id === id)
        if (index !== -1) {
            this.documents.splice(index, 1)
            this.saveToStorage()

            if (this.currentDocumentId === id) {
                this.currentDocumentId = null
                localStorage.removeItem(this.LAST_DOC_KEY)
            }
            return true
        }
        return false
    }

    getAllDocuments() {
        return this.documents
    }

    createNewDocument() {
        this.currentDocumentId = null
        localStorage.removeItem(this.LAST_DOC_KEY)
        return {
            title: "",
            content: "",
            css: "",
        }
    }

    async exportToClipboard() {
        try {
            const data = JSON.stringify(this.documents, null, 2)
            await navigator.clipboard.writeText(data)
            alert("Dokumente wurden in die Zwischenablage kopiert!")
        } catch (error) {
            console.error("Fehler beim Kopieren:", error)
            alert("Fehler beim Kopieren in die Zwischenablage!")
        }
    }
}
