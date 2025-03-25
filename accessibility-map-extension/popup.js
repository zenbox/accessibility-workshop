document.addEventListener("DOMContentLoaded", () => {
    // Informiere das Background Script, dass das Popup geöffnet wurde
    chrome.runtime.sendMessage(
        { action: "popupOpened" },
        // Kein callback benötigt
        null
    )

    document
        .getElementById("toggle-overlay")
        .addEventListener("click", async () => {
            console.log("Toggle button clicked")

            try {
                // Sende Nachricht ohne auf Antwort zu warten
                chrome.runtime.sendMessage({ action: "toggleAccessibilityMap" })

                // Optional: Schließe das Popup automatisch nach dem Klick
                // window.close();
            } catch (error) {
                console.error("Error sending message:", error)
            }
        })
})

// Setze popupOpen auf false, wenn das Popup geschlossen wird
window.addEventListener("unload", () => {
    try {
        chrome.storage.local.set({ popupOpen: false })
    } catch (error) {
        // Ignoriere Fehler beim Schließen
    }
})
