// Import der Module
import { DocumentHandler } from "./documentHandler.js"
import { UIHandler } from "./uiHandler.js"
import { ThemeHandler } from "./themeHandler.js"
import { TouchHandler } from "./touchHandler.js"
import {
    setupEditorHandlers,
    updateEditorAndPreview,
    applyCSS,
} from "./editorHandlers.js"
import { initResizer } from "./resizer.js"
import { LanguageControl } from "./languageControl.js"
// import { MessageControl } from "./messageControl"
import { EnhancedMobileHandler } from "./enhancedMobileHandler.js"

// Globale Instanz des Document Handlers
window.docHandler = null

// Haupt-Initialisierung
document.addEventListener("DOMContentLoaded", async () => {
    // Document Handler initialisieren
    window.docHandler = new DocumentHandler()
    await window.docHandler.init()

    // UI und Features initialisieren
    ThemeHandler.init()
    TouchHandler.init()
    initResizer()
    UIHandler.init()
    setupEditorHandlers()

    // Dokumentenliste aktualisieren
    UIHandler.updateDocumentList()

    // Export-Button hinzufügen
    addExportButton()
    
    // Sprachvarianten-Buttons
    const languageControl = new LanguageControl()
    languageControl.init()
    
    
})

// Export-Button Funktion
function addExportButton() {
    const exportBtn = document.createElement("button")
    exportBtn.className = "icon-button"
    exportBtn.innerHTML =
        '<i class="material-icons">download</i><span>Export</span>'
    exportBtn.addEventListener("click", () =>
        window.docHandler.exportToClipboard()
    )
    document.querySelector(".document-controls")?.appendChild(exportBtn)
}
