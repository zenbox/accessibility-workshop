import {
    updatePreview,
    updateEditorAndPreview,
    applyCSS,
} from "./editorHandlers.js"

export const UIHandler = {
    init() {
        this.setupEventListeners()
        this.updateDocumentList()
        this.initDocumentListToggle() // Neue Methode
    },

    initDocumentListToggle() {
        const listToggle = document.getElementById("list-toggle")
        const documentList = document.getElementById("document-list")
        const toggleIcon = listToggle?.querySelector(".material-icons")

        if (!listToggle || !documentList || !toggleIcon) return

        const toggleList = (e) => {
            e.preventDefault()
            e.stopPropagation()
            const isCollapsed = documentList.classList.toggle("collapsed")
            toggleIcon.textContent = isCollapsed ? "expand_more" : "expand_less"
        }

        // Click-Handler für Desktop
        listToggle.addEventListener("click", toggleList)

        // Klick außerhalb schließt die Liste
        document.addEventListener("click", (e) => {
            if (
                !documentList.classList.contains("collapsed") &&
                !listToggle.contains(e.target) &&
                !documentList.contains(e.target)
            ) {
                documentList.classList.add("collapsed")
                toggleIcon.textContent = "expand_more"
            }
        })

        // ESC-Taste schließt die Liste
        document.addEventListener("keydown", (e) => {
            if (
                e.key === "Escape" &&
                !documentList.classList.contains("collapsed")
            ) {
                documentList.classList.add("collapsed")
                toggleIcon.textContent = "expand_more"
            }
        })
    },

    setupEventListeners() {
        document
            .getElementById("new-doc-btn")
            ?.addEventListener("click", () => this.handleNew())

        document
            .getElementById("save-doc-btn")
            ?.addEventListener("click", () => this.showSaveDialog())

        document
            .getElementById("save-confirm-btn")
            ?.addEventListener("click", () => this.handleSave())

        document
            .getElementById("save-cancel-btn")
            ?.addEventListener("click", () => {
                const dialog = document.getElementById("save-dialog")
                if (dialog) dialog.style.display = "none"
            })

        document
            .getElementById("doc-title")
            ?.addEventListener("keypress", (e) => {
                if (e.key === "Enter") {
                    e.preventDefault()
                    this.handleSave()
                }
            })
    },

    showSaveDialog() {
        const dialog = document.getElementById("save-dialog")
        const titleInput = document.getElementById("doc-title")

        if (!dialog || !titleInput) return

        if (window.docHandler.currentDocumentId) {
            const currentDoc = window.docHandler.loadDocument(
                window.docHandler.currentDocumentId
            )
            titleInput.value = currentDoc ? currentDoc.title : ""
        } else {
            titleInput.value = ""
        }

        dialog.style.display = "flex"
        titleInput.focus()
        titleInput.select()
    },

    handleSave() {
        const titleInput = document.getElementById("doc-title")
        const editor = document.getElementById("editor")
        const cssEditor = document.getElementById("css-editor")
        const dialog = document.getElementById("save-dialog")

        if (!titleInput || !editor || !dialog) return

        const title = titleInput.value.trim()
        if (!title) {
            alert("Bitte geben Sie einen Titel ein")
            return
        }

        const content = editor.value || ""
        const css = cssEditor ? cssEditor.value || "" : ""

        const savedId = window.docHandler.saveDocument(title, content, css)

        dialog.style.display = "none"
        this.updateDocumentList()

        const currentTitle = document.getElementById("current-document-title")
        if (currentTitle) {
            currentTitle.textContent = title
        }

        // Liste nach dem Speichern schließen
        const documentList = document.getElementById("document-list")
        const toggleIcon = document.querySelector(
            "#list-toggle .material-icons"
        )
        if (documentList && toggleIcon) {
            documentList.classList.add("collapsed")
            toggleIcon.textContent = "expand_more"
        }
    },

    updateDocumentList() {
        const documents = window.docHandler.getAllDocuments()
        const currentTitle = document.getElementById("current-document-title")
        const docContainer = document.getElementById("document-list")

        if (currentTitle) {
            if (window.docHandler.currentDocumentId) {
                const currentDoc = documents.find(
                    (doc) => doc.id === window.docHandler.currentDocumentId
                )
                currentTitle.textContent = currentDoc
                    ? currentDoc.title
                    : "Dokument auswählen..."
            } else {
                currentTitle.textContent = "Dokument auswählen..."
            }
        }

        if (!docContainer) return

        docContainer.innerHTML = ""

        documents.forEach((doc) => {
            const docElement = document.createElement("div")
            docElement.className = "document-item"
            if (doc.id === window.docHandler.currentDocumentId) {
                docElement.classList.add("active")
            }

            docElement.innerHTML = `
                <div class="doc-header">
                    <span class="doc-title">${doc.title}</span>
                    <button class="delete-doc-btn" data-id="${doc.id}">
                        <i class="material-icons">delete</i>
                    </button>
                </div>
                <div class="doc-info">
                    <span class="doc-date">${new Date(
                        doc.last_modified
                    ).toLocaleString()}</span>
                </div>
            `

            docElement.addEventListener("click", (e) => {
                if (!e.target.closest(".delete-doc-btn")) {
                    this.loadDocument(doc.id)
                }
            })

            docContainer.appendChild(docElement)
        })

        docContainer.querySelectorAll(".delete-doc-btn").forEach((btn) => {
            btn.addEventListener("click", async (e) => {
                e.preventDefault()
                e.stopPropagation()
                const docId = parseInt(btn.dataset.id)

                if (confirm("Wollen Sie dieses Dokument wirklich löschen?")) {
                    window.docHandler.deleteDocument(docId)
                    this.updateDocumentList()
                }
            })
        })
    },

    loadDocument(id) {
        const doc = window.docHandler.loadDocument(id)
        if (!doc) return

        const editor = document.getElementById("editor")
        const cssEditor = document.getElementById("css-editor")

        if (editor) {
            editor.value = doc.content || ""
            // Nutze updateEditorAndPreview statt direktem updatePreview
            // Dies stellt sicher, dass alle notwendigen Formatierungen
            // und Aktualisierungen durchgeführt werden
            updateEditorAndPreview(doc.content || "")
        }

        if (cssEditor) {
            cssEditor.value = doc.css || ""
            applyCSS(doc.css || "")
        }

        const listHeader = document.getElementById("current-document-title")
        if (listHeader) listHeader.textContent = doc.title

        const list = document.getElementById("document-list")
        const toggleIcon = document.querySelector(
            "#list-toggle .material-icons"
        )
        if (list && toggleIcon) {
            list.classList.add("collapsed")
            toggleIcon.textContent = "expand_more"
        }
    },

    handleNew() {
        window.docHandler.createNewDocument()

        const editor = document.getElementById("editor")
        const cssEditor = document.getElementById("css-editor")
        const titleElement = document.getElementById("current-document-title")

        if (editor) editor.value = ""
        if (cssEditor) cssEditor.value = ""
        if (titleElement) titleElement.textContent = "Neues Dokument"

        // Nutze updateEditorAndPreview anstelle von separatem updatePreview
        updateEditorAndPreview("")
        applyCSS("")

        const list = document.getElementById("document-list")
        const toggleIcon = document.querySelector(
            "#list-toggle .material-icons"
        )
        if (list && toggleIcon) {
            list.classList.add("collapsed")
            toggleIcon.textContent = "expand_more"
        }

        this.showSaveDialog()
    },
}
