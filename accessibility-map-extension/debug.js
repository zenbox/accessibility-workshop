// Globale Debugging-Funktionen
window.a11yMapDebug = {
    // Prüfe Extension-Status
    checkExtensionStatus: function () {
        console.group("Accessibility Map Status")

        // Chrome API Status
        console.log("Chrome API verfügbar:", typeof chrome !== "undefined")
        console.log(
            "chrome.runtime verfügbar:",
            typeof chrome !== "undefined" &&
                typeof chrome.runtime !== "undefined"
        )
        console.log(
            "chrome.runtime.getURL verfügbar:",
            typeof chrome !== "undefined" &&
                typeof chrome.runtime !== "undefined" &&
                typeof chrome.runtime.getURL === "function"
        )

        // Script-Status
        console.log(
            "ColorAndContrast geladen:",
            typeof ColorAndContrast !== "undefined"
        )
        console.log("Ui geladen:", typeof Ui !== "undefined")
        console.log("SvgRenderer geladen:", typeof SvgRenderer !== "undefined")

        // Konfiguration
        console.log(
            "a11yMapConfig verfügbar:",
            typeof window.a11yMapConfig !== "undefined"
        )
        console.log(
            "colorMapping verfügbar:",
            typeof window.a11yMapConfig !== "undefined" &&
                typeof window.a11yMapConfig.colorMapping !== "undefined"
        )

        console.groupEnd()
        return "Status überprüft - siehe Konsolenausgabe"
    },
}

// Ausgabe bei Skriptinitialisierung
console.log(
    "%cAccessibility Map Debugging Tools geladen",
    "color: #4285f4; font-weight: bold;"
)
console.log(
    "Verwende window.a11yMapDebug.checkExtensionStatus() um den Status zu überprüfen"
)
