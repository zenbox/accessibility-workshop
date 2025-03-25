import { Ui } from "./Ui.js"
import { SvgRenderer } from "./SvgRenderer.js"
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

function initializeAccessibilityMap() {
    try {
        log("Accessibility Map wird initialisiert")

        // Prüfe, ob die Konfiguration verfügbar ist
        if (!window.a11yMapConfig || !window.a11yMapConfig.colorMapping) {
            warn(
                "Keine vorkonfigurierte colorMapping gefunden, verwende Standard"
            )
            initWithColorMapping(defaultColorMapping)
        } else {
            log("Verwende vorkonfigurierte colorMapping")
            initWithColorMapping(window.a11yMapConfig.colorMapping)
        }
    } catch (err) {
        error("Fehler bei der Initialisierung:", err)
    }
}

const defaultColorMapping = {
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
        roleElements: {
            selectors: "[role]",
            color: "hsla(0, 100%, 50%, 0.85)",
            type: "attribute",
            enabled: false,
        },
        ariaElements: {
            selectors:
                "[aria-label], [aria-live], [aria-describedby], [aria-labelledby]",
            color: "hsla(0, 100%, 70%, 0.85)",
            type: "attribute",
            enabled: false,
        },
        altElements: {
            selectors: "[alt]",
            color: "hsla(0, 100%, 30%, 0.85)",
            type: "attribute",
            enabled: false,
        },
    },
    // Rest der Mappings...
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
