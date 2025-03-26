import { Ui } from "./Ui.js"
import { SvgRenderer } from "./_SvgRenderer.js"
import { ColorAndContrast } from "./ColorAndContrast.js"

// Debug Hilfsmittel
const DEBUG_MODE = true
const DEBUG = true

function log(...args) {
    if (DEBUG)
        console.log(
            "%c[A11y-Map]",
            "color: #4285f4; font-weight: bold;",
            ...args
        )
}

function warn(...args) {
    if (DEBUG)
        console.warn(
            "%c[A11y-Map]",
            "color: #fbbc05; font-weight: bold;",
            ...args
        )
}

function error(...args) {
    console.error("%c[A11y-Map]", "color: #ea4335; font-weight: bold;", ...args)
}

// Fallback color mapping, nur verwendet wenn die JSON-Datei nicht geladen werden kann
const fallbackColorMapping = {
    Struktur: {
        selectors: "header, nav, main, footer",
        color: "hsla(180, 100%, 50%, 0.85)",
        type: "mixed",
        enabled: true,
        showElement: true,
    },
}

async function loadColorMapping() {
    try {
        // Prüfe, ob die Konfiguration bereits im window-Objekt vorhanden ist
        if (window.a11yMapConfig && window.a11yMapConfig.colorMapping) {
            log(
                "Verwende vorkonfigurierte colorMapping aus window.a11yMapConfig"
            )
            return window.a11yMapConfig.colorMapping
        }

        // Versuche, die Datei über die Chrome Extension URL zu laden
        if (
            typeof chrome !== "undefined" &&
            chrome.runtime &&
            chrome.runtime.getURL
        ) {
            const url = chrome.runtime.getURL("colorMapping.json")
            log("Lade colorMapping.json von:", url)
            const response = await fetch(url)

            if (!response.ok) {
                throw new Error(
                    `Failed to fetch colorMapping.json: ${response.status}`
                )
            }

            const colorMapping = await response.json()
            log("colorMapping.json erfolgreich geladen")
            return colorMapping
        } else {
            // Fallback für Entwicklungsumgebungen
            log("Chrome API nicht verfügbar, versuche relative URL")
            const response = await fetch("./colorMapping.json")
            if (!response.ok) {
                throw new Error(
                    `Failed to fetch colorMapping.json: ${response.status}`
                )
            }
            const colorMapping = await response.json()
            log("colorMapping.json erfolgreich geladen (relative URL)")
            return colorMapping
        }
    } catch (err) {
        warn("Fehler beim Laden der colorMapping.json:", err)
        warn("Verwende Fallback-Mapping")
        return fallbackColorMapping
    }
}

async function initializeAccessibilityMap() {
    try {
        log("Accessibility Map wird initialisiert")
        const colorMapping = await loadColorMapping()
        initWithColorMapping(colorMapping)
    } catch (err) {
        error("Fehler bei der Initialisierung:", err)
    }
}

let renderer = null
let occupiedYPositions = []

function initWithColorMapping(colorMapping) {
    const colorAndContrast = new ColorAndContrast()
    const ui = new Ui(colorMapping, () => renderer.drawAllRectangles())

    renderer = new SvgRenderer(
        ui,
        colorAndContrast,
        colorMapping,
        occupiedYPositions
    )

    // Draw rectangles initially
    renderer.drawAllRectangles()

    // Update when window size changes or scrolling occurs
    window.addEventListener("resize", () => renderer.drawAllRectangles())
    window.addEventListener("scroll", () => renderer.drawAllRectangles())
}

// Listen for activation event
document.addEventListener("init-accessibility-map", initializeAccessibilityMap)

// Listen for deactivation event
document.addEventListener("deactivate-accessibility-map", () => {
    // Clean up event listeners
    window.removeEventListener("resize", () => renderer.drawAllRectangles())
    window.removeEventListener("scroll", () => renderer.drawAllRectangles())

    // Remove the renderer's SVG overlay
    if (renderer) {
        renderer.cleanup()
    }

    // Reset variables
    renderer = null
    occupiedYPositions = []
})
