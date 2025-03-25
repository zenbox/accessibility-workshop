export class ColorAndContrast {
    // Methode zur Berechnung des Kontrastverhältnisses zwischen Vordergrund- und Hintergrundfarben
    calculateContrastRatio(foregroundColor, backgroundColor) {
        function getLuminance(rgb) {
            const sRGB = rgb.map((value) => {
                value /= 255
                return value <= 0.03928
                    ? value / 12.92
                    : Math.pow((value + 0.055) / 1.055, 2.4)
            })
            return 0.2126 * sRGB[0] + 0.7152 * sRGB[1] + 0.0722 * sRGB[2]
        }

        function parseColor(color) {
            const tempElement = document.createElement("div")
            tempElement.style.color = color
            document.body.appendChild(tempElement)
            const computedColor = window.getComputedStyle(tempElement).color
            document.body.removeChild(tempElement)
            const rgbaMatch = computedColor.match(
                /rgba?\((\d+),\s*(\d+),\s*(\d+)/
            )
            if (!rgbaMatch) return [0, 0, 0]
            const r = parseInt(rgbaMatch[1], 10)
            const g = parseInt(rgbaMatch[2], 10)
            const b = parseInt(rgbaMatch[3], 10)
            return [r, g, b]
        }

        const fgRgb = parseColor(foregroundColor)
        const bgRgb = parseColor(backgroundColor)

        const L1 = getLuminance(fgRgb)
        const L2 = getLuminance(bgRgb)

        return (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05)
    }

    // Methode zur Berechnung der Helligkeit einer Farbe
    getLuminance(hslaColor) {
        const hslRegex = /hsla\(\d+,\s*\d+%,\s*(\d+)%/
        const match = hslRegex.exec(hslaColor)
        if (match && match[1]) {
            return parseInt(match[1], 10) // Extrahiere die Helligkeit (L) der HSLa-Farbe
        }
        return 50 // Standardwert, falls nicht ermittelbar
    }

    // Methode zur Bestimmung der Textfarbe (schwarz oder weiß) auf Grundlage des Kontrasts
    getTextColorForBackground(hslaColor) {
        const luminance = this.getLuminance(hslaColor)
        return luminance > 50 ? "black" : "white" // Schwarz für helle Farben, Weiß für dunkle Farben
    }
}
