// Diese Datei wird als Service Worker ausgeführt
console.log("Accessibility Map background service worker started")

// Speichern des aktiven Tab-Status
let activeAccessibilityMap = {}

// Verarbeite Nachrichten
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("Background received message:", message)

    if (message.action === "toggleAccessibilityMap") {
        // Hole den aktuellen Tab
        chrome.tabs.query(
            { active: true, currentWindow: true },
            async (tabs) => {
                if (!tabs || tabs.length === 0) {
                    console.error("No active tab found")
                    return
                }

                const tab = tabs[0]

                // Speichere den aktuellen Status für diesen Tab
                if (!activeAccessibilityMap[tab.id]) {
                    activeAccessibilityMap[tab.id] = false
                }

                // Ändere den Status
                activeAccessibilityMap[tab.id] = !activeAccessibilityMap[tab.id]

                try {
                    // Lade die colorMapping.json
                    let colorMapping
                    try {
                        // Verwende ein direktes ColorMapping-Objekt statt fetch
                        colorMapping = {
                            "Struktur": {
                                selectors:
                                    "header, [role=banner], aside, [role=complementary], nav, [role=navigation], main, [role=main], footer, [role=contentinfo]",
                                color: "hsla(180, 100%, 50%, 0.85)",
                                type: "mixed",
                                enabled: true,
                                showElement: true,
                            },
                            "Semantische Textauszeichnungen": {
                                selectors:
                                    "a, em, strong, small, cite, q, dfn, abbr, ruby, rt, rb, data, time, code, var, samp, kbd, sub, sup, mark, bdi, bdo",
                                color: "hsla(190, 50%, 60%, 0.85)",
                                type: "element",
                                enabled: true,
                                showElement: true,
                                lines: {
                                    start: ["[title]"],
                                    end: "[id]",
                                },
                            },
                            "roleElements": {
                                selectors: "[role]",
                                color: "hsla(0, 100%, 50%, 0.85)",
                                type: "attribute",
                                enabled: false,
                            },
                            "ariaElements": {
                                selectors:
                                    "[aria-label], [aria-live], [aria-describedby], [aria-labelledby]",
                                color: "hsla(0, 100%, 70%, 0.85)",
                                type: "attribute",
                                enabled: false,
                            },
                            "altElements": {
                                selectors: "[alt]",
                                color: "hsla(0, 100%, 30%, 0.85)",
                                type: "attribute",
                                enabled: false,
                            },
                        }
                    } catch (error) {
                        console.error("Error loading colorMapping:", error)
                        return
                    }

                    // WICHTIG: Prüfe ob der Content Script bereits läuft, wenn nicht, injiziere ihn
                    try {
                        console.log(
                            "Checking if content script is running in tab",
                            tab.id
                        )

                        // Versuche, den Content Script zu injizieren
                        await chrome.scripting.executeScript({
                            target: { tabId: tab.id },
                            files: ["content-script.js"],
                        })

                        console.log("Content script injected in tab", tab.id)

                        // Kurze Verzögerung, um sicherzustellen, dass das Content Script bereit ist
                        setTimeout(() => {
                            // Jetzt sende die Nachricht
                            chrome.tabs.sendMessage(tab.id, {
                                action: "toggleAccessibilityMap",
                                colorMapping: colorMapping,
                                injectionBase:
                                    chrome.runtime.getURL("injection/"),
                            })

                            console.log("Sent toggle command to tab", tab.id)
                        }, 300)
                    } catch (injectError) {
                        console.error(
                            "Error injecting content script:",
                            injectError
                        )
                    }
                } catch (error) {
                    console.error("Error in background script:", error)
                }
            }
        )

        // Keine Antwort notwendig
        return false
    }

    // Neue Nachricht vom Popup beim Laden - merke dir, dass das Popup aktiv ist
    if (message.action === "popupOpened") {
        console.log("Popup opened")

        // Speichere, dass das Popup geöffnet ist
        chrome.storage.local.set({ popupOpen: true })

        // Auch hier keine Antwort notwendig
        return false
    }

    // Standardfall: keine asynchrone Antwort erwartet
    return false
})

// Höre auf Popup-Schließen-Events, indem wir den Storage als Kommunikationskanal nutzen
chrome.storage.onChanged.addListener((changes, namespace) => {
    if (
        namespace === "local" &&
        changes.popupOpen &&
        changes.popupOpen.newValue === false
    ) {
        console.log("Popup closed, checking for active maps to clean up")

        // Schließe alle aktiven Maps
        Object.keys(activeAccessibilityMap).forEach((tabId) => {
            if (activeAccessibilityMap[tabId]) {
                chrome.tabs.sendMessage(parseInt(tabId), {
                    action: "closeAccessibilityMap",
                })
                console.log("Sent close command to tab", tabId)
                activeAccessibilityMap[tabId] = false
            }
        })
    }
})

// Event-Listener für Tab-Schließung, um den Status zu bereinigen
chrome.tabs.onRemoved.addListener((tabId) => {
    if (activeAccessibilityMap[tabId]) {
        delete activeAccessibilityMap[tabId]
        console.log("Removed tracking for closed tab", tabId)
    }
})

// Popup wird geschlossen - lausche auf onSuspend, der beim Schließen ausgelöst wird
chrome.runtime.onSuspend.addListener(function () {
    chrome.storage.local.set({ popupOpen: false })
    console.log("Popup is being closed")
})

// Logging für Debug-Zwecke
console.log("Extension base URL:", chrome.runtime.getURL(""))
