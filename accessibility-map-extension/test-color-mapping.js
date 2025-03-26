/**
 * Test-Skript für die colorMapping-Funktionalität
 *
 * Dieses Skript kann während der Entwicklung verwendet werden, um:
 * 1. Zu testen, ob die colorMapping.json korrekt geladen wird
 * 2. Die Kommunikation zwischen Background, Content und Injected Script zu testen
 */

// Konfigurationsoptionen
const TEST_CONFIG = {
    debug: true,
    // Platzhalter für das geladene colorMapping
    loadedColorMapping: null,
}

// Debug-Logging
function testLog(...args) {
    if (TEST_CONFIG.debug) {
        console.log(
            "%c[A11y-Map Test]",
            "color: #34a853; font-weight: bold;",
            ...args
        )
    }
}

function testError(...args) {
    console.error(
        "%c[A11y-Map Test]",
        "color: #ea4335; font-weight: bold;",
        ...args
    )
}

/**
 * Validiert die Struktur des colorMapping-Objekts
 * @param {Object} mapping Das zu validierende colorMapping-Objekt
 * @returns {boolean} Gibt true zurück, wenn das Mapping gültig ist
 */
function validateColorMapping(mapping) {
    // Prüfe, ob es sich um ein Objekt handelt
    if (!mapping || typeof mapping !== "object" || Array.isArray(mapping)) {
        testError("colorMapping ist kein Objekt")
        return false
    }

    // Prüfe, ob mindestens eine Kategorie existiert
    const categories = Object.keys(mapping)
    if (categories.length === 0) {
        testError("colorMapping enthält keine Kategorien")
        return false
    }

    // Prüfe jede Kategorie auf erforderliche Eigenschaften
    let isValid = true
    for (const category of categories) {
        const categoryObj = mapping[category]

        // Erforderliche Eigenschaften
        const requiredProps = ["selectors", "color", "type"]
        for (const prop of requiredProps) {
            if (!categoryObj.hasOwnProperty(prop)) {
                testError(
                    `Kategorie "${category}" fehlt die Eigenschaft "${prop}"`
                )
                isValid = false
            }
        }

        // Validiere Type-Eigenschaft
        if (
            categoryObj.type &&
            !["element", "attribute", "mixed", "contrast"].includes(
                categoryObj.type
            )
        ) {
            testError(
                `Kategorie "${category}" hat einen ungültigen Typ: "${categoryObj.type}"`
            )
            isValid = false
        }
    }

    return isValid
}

/**
 * Prüft, ob die colorMapping.json erfolgreich geladen werden kann
 */
async function testColorMappingLoading() {
    testLog("Teste das Laden der colorMapping.json...")

    try {
        // Im Kontext einer Chrome Extension
        if (
            typeof chrome !== "undefined" &&
            chrome.runtime &&
            chrome.runtime.getURL
        ) {
            const url = chrome.runtime.getURL("colorMapping.json")
            testLog("Lade colorMapping.json von:", url)

            const startTime = performance.now()
            const response = await fetch(url)
            const endTime = performance.now()

            if (!response.ok) {
                throw new Error(
                    `Failed to fetch colorMapping.json: ${response.status}`
                )
            }

            const data = await response.json()
            TEST_CONFIG.loadedColorMapping = data

            // Validiere die Struktur
            const isValid = validateColorMapping(data)

            testLog(
                `colorMapping.json geladen in ${(endTime - startTime).toFixed(
                    2
                )}ms`
            )
            testLog(`Anzahl der Kategorien: ${Object.keys(data).length}`)
            testLog(
                `Validierung: ${isValid ? "Erfolgreich" : "Fehlgeschlagen"}`
            )

            return {
                success: true,
                data: data,
                isValid: isValid,
                loadTime: endTime - startTime,
            }
        }
        // Im Kontext einer Entwicklungsumgebung
        else {
            testLog("Chrome API nicht verfügbar, versuche relative URL")
            const response = await fetch("./colorMapping.json")
            if (!response.ok) {
                throw new Error(
                    `Failed to fetch colorMapping.json: ${response.status}`
                )
            }
            const data = await response.json()
            TEST_CONFIG.loadedColorMapping = data

            const isValid = validateColorMapping(data)
            testLog(`colorMapping.json geladen aus relativer URL`)
            testLog(`Anzahl der Kategorien: ${Object.keys(data).length}`)
            testLog(
                `Validierung: ${isValid ? "Erfolgreich" : "Fehlgeschlagen"}`
            )

            return {
                success: true,
                data: data,
                isValid: isValid,
            }
        }
    } catch (err) {
        testError("Fehler beim Laden der colorMapping.json:", err)
        return {
            success: false,
            error: err.message,
        }
    }
}

/**
 * Testet, ob die colorMapping-Konfiguration korrekt an den Content-Script übertragen wird
 * @returns {Promise<Object>} Ergebnis des Tests
 */
async function testColorMappingCommunication() {
    testLog("Teste die Kommunikation mit dem Content-Script...")

    try {
        // Prüfe, ob die Chrome API verfügbar ist
        if (
            typeof chrome === "undefined" ||
            !chrome.runtime ||
            !chrome.runtime.sendMessage
        ) {
            throw new Error("Chrome API nicht verfügbar")
        }

        // Sende eine Test-Nachricht an den Content-Script
        return new Promise((resolve) => {
            chrome.runtime.sendMessage(
                {
                    action: "testColorMapping",
                },
                (response) => {
                    if (chrome.runtime.lastError) {
                        testError(
                            "Kommunikationsfehler:",
                            chrome.runtime.lastError
                        )
                        resolve({
                            success: false,
                            error: chrome.runtime.lastError.message,
                        })
                        return
                    }

                    if (!response || !response.success) {
                        testError(
                            "Content-Script hat keine erfolgreiche Antwort gesendet:",
                            response
                        )
                        resolve({
                            success: false,
                            error: "Keine erfolgreiche Antwort vom Content-Script",
                        })
                        return
                    }

                    testLog(
                        "Content-Script hat erfolgreich geantwortet:",
                        response
                    )
                    resolve({
                        success: true,
                        data: response,
                    })
                }
            )
        })
    } catch (err) {
        testError("Fehler beim Testen der Kommunikation:", err)
        return {
            success: false,
            error: err.message,
        }
    }
}

/**
 * Führt alle Tests aus
 */
async function runAllTests() {
    testLog("Starte alle Tests...")

    const results = {
        loadingTest: await testColorMappingLoading(),
    }

    // Führe den Kommunikationstest nur aus, wenn das Laden erfolgreich war
    if (results.loadingTest.success) {
        results.communicationTest = await testColorMappingCommunication()
    }

    // Gebe die Gesamtergebnisse aus
    testLog("Test-Ergebnisse:")
    console.table({
        "Laden der colorMapping.json": results.loadingTest.success
            ? "Erfolgreich"
            : "Fehlgeschlagen",
        "Kommunikation": results.communicationTest
            ? results.communicationTest.success
                ? "Erfolgreich"
                : "Fehlgeschlagen"
            : "Nicht ausgeführt",
    })

    return results
}

// Exportiere Funktionen im globalen Scope für die Nutzung in der Konsole
window.a11yMapTest = {
    validateColorMapping,
    testColorMappingLoading,
    testColorMappingCommunication,
    runAllTests,
    getLoadedMapping: () => TEST_CONFIG.loadedColorMapping,
}

// Ausgabe bei Skriptinitialisierung
testLog("ColorMapping-Test geladen. Verfügbare Funktionen:")
testLog(
    "- window.a11yMapTest.validateColorMapping(mapping): Validiert ein colorMapping-Objekt"
)
testLog(
    "- window.a11yMapTest.testColorMappingLoading(): Testet das Laden der colorMapping.json"
)
testLog(
    "- window.a11yMapTest.testColorMappingCommunication(): Testet die Kommunikation mit dem Content-Script"
)
testLog("- window.a11yMapTest.runAllTests(): Führt alle Tests aus")
testLog(
    "- window.a11yMapTest.getLoadedMapping(): Gibt das geladene colorMapping zurück"
)
