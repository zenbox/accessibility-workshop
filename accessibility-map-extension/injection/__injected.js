;(function () {
    console.log(
        "%c[A11y-Map Injected]",
        "color: #4285f4; font-weight: bold;",
        "Script started"
    )

    // Variablen für die Konfiguration
    let colorMapping = null
    let baseUrl = ""

    // Höre auf das Konfigurations-Event
    document.addEventListener("a11y-map-config", function (event) {
        console.log(
            "%c[A11y-Map Injected]",
            "color: #4285f4; font-weight: bold;",
            "Configuration received"
        )

        // Hole die Konfiguration aus dem Event
        colorMapping = event.detail.colorMapping
        baseUrl = event.detail.baseUrl

        // Speichere die Konfiguration im window-Objekt für andere Module
        window.a11yMapConfig = {
            colorMapping: colorMapping,
            baseUrl: baseUrl,
        }

        // Initialisiere mit der empfangenen Konfiguration
        if (colorMapping && baseUrl) {
            initializeAccessibilityMap()
        } else {
            console.error("[A11y-Map Injected] Invalid configuration received")
        }
    })

    // Funktion zur Initialisierung der Map
    async function initializeAccessibilityMap() {
        try {
            // Lade die Module
            const colorAndContrastModule = await import(
                baseUrl + "ColorAndContrast.js"
            )
            const uiModule = await import(baseUrl + "Ui.js")
            const svgRendererModule = await import(baseUrl + "SvgRenderer.js")

            console.log(
                "%c[A11y-Map Injected]",
                "color: #4285f4; font-weight: bold;",
                "Modules loaded"
            )

            // Erstelle Instanzen
            const colorAndContrast =
                new colorAndContrastModule.ColorAndContrast()
            const ui = new uiModule.Ui(colorMapping, updateMap)
            const occupiedYPositions = []
            const renderer = new svgRendererModule.SvgRenderer(
                ui,
                colorAndContrast,
                colorMapping,
                occupiedYPositions
            )

            // Initialisiere die Karte
            function updateMap() {
                renderer.drawAllRectangles()
            }

            // Zeichne die Karte
            renderer.drawAllRectangles()

            // Event-Listener für Aktualisierungen
            window.addEventListener("resize", updateMap)
            window.addEventListener("scroll", updateMap)

            // Cleanup-Funktion registrieren
            document.addEventListener(
                "a11y-map-cleanup",
                function cleanupMap() {
                    window.removeEventListener("resize", updateMap)
                    window.removeEventListener("scroll", updateMap)
                    document.removeEventListener("a11y-map-cleanup", cleanupMap)
                    console.log(
                        "%c[A11y-Map Injected]",
                        "color: #4285f4; font-weight: bold;",
                        "Cleanup completed"
                    )
                }
            )

            console.log(
                "%c[A11y-Map Injected]",
                "color: #4285f4; font-weight: bold;",
                "Map initialized successfully"
            )
        } catch (err) {
            console.error(
                "[A11y-Map Injected] Error loading dependencies:",
                err
            )
        }
    }
})()
