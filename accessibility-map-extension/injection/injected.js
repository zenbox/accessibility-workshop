;(function () {
    console.log(
        "%c[A11y-Map Injected]",
        "color: #4285f4; font-weight: bold;",
        "Script started"
    )

    // Variablen für die Konfiguration
    let colorMapping = null
    let baseUrl = ""
    let colorContrastPicker = null
    let statisticsModule = null

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
            const colorContrastPickerModule = await import(
                baseUrl + "ColorContrastPicker.js"
            )
            // Neu: Lade das StatisticsModule
            const statisticsModuleScript = await import(
                baseUrl + "StatisticsModule.js"
            )

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

            // Neu: Initialisiere das StatisticsModule
            statisticsModule = new statisticsModuleScript.StatisticsModule(
                colorMapping
            )

            // NEU: Erstelle den Kontrast-Picker sofort beim Start
            colorContrastPicker =
                new colorContrastPickerModule.ColorContrastPicker()

            // Initialisiere die Karte
            function updateMap() {
                renderer.drawAllRectangles()

                // Aktualisiere die Statistiken, wenn sie sichtbar sind
                if (statisticsModule) {
                    statisticsModule.update()
                }
            }

            // Neu: Event-Listener für Statistik-Toggle
            document.addEventListener("a11y-map-toggle-statistics", (e) => {
                console.log(
                    "%c[A11y-Map Injected]",
                    "color: #4285f4; font-weight: bold;",
                    "Toggle Statistics Panel"
                )

                if (statisticsModule) {
                    statisticsModule.toggle()
                }
            })

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

                    // Bereinige auch den ColorContrastPicker
                    if (colorContrastPicker) {
                        colorContrastPicker.cleanup()
                        colorContrastPicker = null
                    }

                    // Bereinige auch das Statistikmodul
                    if (statisticsModule && statisticsModule.isVisible) {
                        statisticsModule.toggle()
                    }

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
