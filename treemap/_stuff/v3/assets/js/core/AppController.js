/**
 *    @version v3
 */

// app.js - Hauptanwendung und Initialisierung
document.addEventListener("DOMContentLoaded", () => {
    // Initialisierung der Anwendung
    const app = new AppController()
    app.init()
})

// core/AppController.js - Hauptsteuerungsklasse
class AppController {
    constructor() {
        // Initialisiere Event-Bus für Kommunikation zwischen Komponenten
        this.eventBus = new EventBus()

        // UI-Registry für zentrale Verwaltung von DOM-Elementen
        this.uiRegistry = new UIRegistry()

        // Notification-Service für Benutzerfeedback
        this.notificationService = new NotificationService()

        // Controller für verschiedene Funktionsbereiche
        this.treemapController = null
        this.filterController = null
        this.themeManager = null
    }

    async init() {
        try {
            // Registriere UI-Elemente
            this.uiRegistry.registerElements()

            // Initialisiere Controller in der richtigen Reihenfolge
            await this.initTreemapController()
            this.initFilterController()
            this.initThemeManager()

            // Initialisiere gemeinsame UI-Komponenten
            this.initUIComponents()

            console.log("BITV Treemap Application initialized")
        } catch (error) {
            console.error("Error initializing application:", error)
            this.notificationService.show(
                "Fehler beim Initialisieren der Anwendung",
                "error"
            )
        }
    }

    async initTreemapController() {
        try {
            // Lade Daten
            const response = await fetch("./data/criterias.json")
            const data = await response.json()

            // Initialisiere Treemap
            this.treemapController = new TreemapController(
                this.eventBus,
                this.uiRegistry,
                data
            )
            await this.treemapController.init()
        } catch (error) {
            console.error("Error initializing treemap:", error)
            throw error
        }
    }

    initFilterController() {
        this.filterController = new FilterController(
            this.eventBus,
            this.uiRegistry,
            this.treemapController
        )
        this.filterController.init()
    }

    initThemeManager() {
        this.themeManager = ThemeManager.getInstance()

        const themeView = new ThemeView(
            this.eventBus,
            this.uiRegistry,
            this.themeManager,
            this.notificationService
        )
        themeView.init()
    }

    initUIComponents() {
        // Initialisiere gemeinsame UI-Komponenten wie Tooltips, Modals etc.
        new TooltipService(this.uiRegistry).init()
        new ModalService(this.uiRegistry).init()

        // Füge globale Event-Listener hinzu
        this.addGlobalEventListeners()
    }

    addGlobalEventListeners() {
        // Escape-Taste für Schließen von Dialogen etc.
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape") {
                this.eventBus.publish("ui:escape-pressed")
            }
        })

        // Weitere globale Event-Listener...
    }
}