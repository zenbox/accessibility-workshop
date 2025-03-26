export class ColorContrastPicker {
    constructor() {
        this.cleanup()
        this.isActive = false
        this.tooltip = null
        this.initialize()
    }

    cleanup() {
        const oldButton = document.getElementById("colorPickerButton")
        const oldTooltip = document.getElementById("colorPickerTooltip")
        if (oldButton) oldButton.remove()
        if (oldTooltip) oldTooltip.remove()
    }

    initialize() {
        // Geändert: Styling des Buttons für permanente Anzeige und besseres Aussehen
        const button = document.createElement("button")
        button.innerHTML = "◑"
        button.id = "colorPickerButton"
        button.style.cssText = `
    position: fixed;
    width: 4rem;
    height: 4rem;
    bottom: 4rem;
    left: 2rem;
    padding: 0.5rem;
    border-radius: 50%;
    background: hsla(0, 0%, 0%, 0.9);
    color: white;
    font-size: 1.5rem;
    border: 3px solid #4285f4;
    cursor: pointer;
    z-index: 10000;
    box-shadow: 0 2px 10px rgba(0,0,0,0.3);
    display: flex;
    align-items: center;
    justify-content: center;
`
        button.title = "Kontrast-Prüfung - Klicken zum Aktivieren"
        document.body.appendChild(button)

        const tooltip = document.createElement("div")
        tooltip.id = "colorPickerTooltip"
        tooltip.style.cssText = `
            position: fixed !important;
            visibility: hidden;
            background-color: rgba(0, 0, 0, 0.8) !important;
            color: white !important;
            padding: 12px !important;
            border-radius: 6px !important;
            font-size: 14px !important;
            font-family: Arial, sans-serif !important;
            pointer-events: none !important;
            z-index: 2147483647 !important;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2) !important;
            min-width: 250px !important;
            opacity: 1 !important;
            transform: none !important;
            left: 0px;
            top: 0px;
        `
        document.body.appendChild(tooltip)
        this.tooltip = tooltip

        button.addEventListener("click", () => this.togglePicker())
        document.addEventListener("mousemove", (e) => {
            if (this.isActive) {
                this.handleMouseMove(e)
            }
        })
        document.addEventListener("click", (e) => {
            if (e.target !== button && this.isActive) {
                e.preventDefault()
                this.deactivatePicker()
            }
        })
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape") this.deactivatePicker()
        })
    }

    handleMouseMove(e) {
        if (!this.isActive) return

        const element = document.elementFromPoint(e.clientX, e.clientY)
        if (!element || element.id === "colorPickerTooltip") return

        const styles = window.getComputedStyle(element)
        const textColor = styles.color
        const bgInfo = this.getBackgroundInfo(element)

        // Hole Schrifteigenschaften
        const fontSize = styles.fontSize
        const fontWeight = styles.fontWeight
        const fontFamily = styles.fontFamily.split(",")[0].replace(/['"]/g, "")

        // Bestimme, ob es sich um großen Text handelt
        const isLargeText = this.isLargeText(fontSize, fontWeight)

        let contrastHtml = ""
        let bgPreviewHtml = ""

        // Erstelle Background-Preview und Kontrast-Info
        if (bgInfo.type === "color") {
            const contrast = this.calculateWCAGContrast(
                this.parseColor(textColor),
                this.parseColor(bgInfo.color)
            )
            contrastHtml = `
            <div style="margin-bottom: 4px;">
                <strong>Kontrast:</strong> ${contrast.toFixed(2)}:1
            </div>
            <div>
                <strong>WCAG 2.1:</strong> ${this.getWCAGLevel(
                    contrast,
                    fontSize,
                    fontWeight
                )}
            </div>
            <div style="margin-top: 4px; font-size: 11px; color: #aaa;">
                ${
                    isLargeText
                        ? "Großer Text (min. 3:1)"
                        : "Normaler Text (min. 4.5:1)"
                }
            </div>
        `
            bgPreviewHtml = this.createColorPreview(bgInfo.color, "square")
        } else {
            bgPreviewHtml = "⚠️"
            contrastHtml = `
            <div style="margin-bottom: 4px; color: #ffaa00;">
                Background ist ein ${
                    bgInfo.type === "gradient" ? "Farbverlauf" : "Bild"
                }
                <br>Kontrast kann nicht berechnet werden
            </div>
        `
        }

        // Aktualisiere Tooltip-Position und Inhalt
        const tooltipX = e.clientX + 15
        const tooltipY = e.clientY + 15

        this.tooltip.style.left = `${tooltipX}px`
        this.tooltip.style.top = `${tooltipY}px`
        this.tooltip.style.visibility = "visible"

        this.tooltip.innerHTML = `
        <div style="margin-bottom: 8px;">
            <div style="display: flex; align-items: center; margin-bottom: 4px;">
                ${this.createColorPreview(textColor)}
                <strong>Text:</strong> ${textColor}
            </div>
            <div style="display: flex; align-items: center; margin-bottom: 4px;">
                ${bgPreviewHtml}
                <strong>Background:</strong> ${bgInfo.value}
            </div>
            <div style="margin-bottom: 4px;">
                <strong>Font Size:</strong> ${fontSize} (${(
            parseFloat(fontSize) / 1.333
        ).toFixed(1)}pt)
            </div>
            <div style="margin-bottom: 4px;">
                <strong>Font Weight:</strong> ${this.getFontWeightName(
                    fontWeight
                )}
            </div>
            <div style="margin-bottom: 4px;">
                <strong>Font Family:</strong> ${fontFamily}
            </div>
        </div>
        ${contrastHtml}
    `
    }

    getFontWeightName(weight) {
        const weights = {
            100: "Thin",
            200: "Extra Light",
            300: "Light",
            400: "Regular",
            500: "Medium",
            600: "Semi Bold",
            700: "Bold",
            800: "Extra Bold",
            900: "Black",
        }
        return `${weight} (${weights[weight] || "Custom"})`
    }

    // Geändert: Andere Farben und Titel für aktiven/inaktiven Zustand
    togglePicker() {
        this.isActive = !this.isActive
        document.body.style.cursor = this.isActive ? "crosshair" : "default"

        if (!this.isActive) {
            this.tooltip.style.visibility = "hidden"
        }

        const button = document.getElementById("colorPickerButton")
        if (button) {
            button.style.backgroundColor = this.isActive
                ? "#4285f4"
                : "hsla(0, 0%, 0%, 0.9)"
            button.style.color = "white"
            button.title = this.isActive
                ? "Klicken zum Deaktivieren"
                : "Kontrast-Prüfung - Klicken zum Aktivieren"
        }
    }

    deactivatePicker() {
        this.isActive = false
        document.body.style.cursor = "default"
        if (this.tooltip) {
            this.tooltip.style.visibility = "hidden"
        }
        const button = document.getElementById("colorPickerButton")
        if (button) {
            button.style.backgroundColor = "white"
            button.style.borderColor = "#333"
        }
    }

    createColorPreview(color, type = "circle") {
        return `
            <div style="
                width: 20px;
                height: 20px;
                ${type === "circle" ? "border-radius: 50%;" : ""}
                background-color: ${color};
                border: 1px solid rgba(255,255,255,0.3);
                display: inline-block;
                vertical-align: middle;
                margin-right: 8px;
            "></div>
        `
    }

    getBackgroundInfo(element) {
        const style = window.getComputedStyle(element)
        const bgColor = style.backgroundColor
        const bgImage = style.backgroundImage

        if (bgImage !== "none") {
            if (bgImage.includes("gradient")) {
                return {
                    type: "gradient",
                    value: bgImage,
                    color: null,
                }
            } else if (bgImage.includes("url")) {
                return {
                    type: "image",
                    value: bgImage,
                    color: null,
                }
            }
        }

        if (bgColor === "rgba(0, 0, 0, 0)" || bgColor === "transparent") {
            if (element.parentElement) {
                return this.getBackgroundInfo(element.parentElement)
            }
            return {
                type: "color",
                value: "rgb(255, 255, 255)",
                color: "rgb(255, 255, 255)",
            }
        }

        return {
            type: "color",
            value: bgColor,
            color: bgColor,
        }
    }

    parseColor(color) {
        const rgb = color.match(/\d+/g)
        return rgb ? rgb.map(Number) : [0, 0, 0]
    }

    calculateWCAGContrast(foreground, background) {
        const getLuminance = (r, g, b) => {
            const [rs, gs, bs] = [r, g, b].map((c) => {
                c = c / 255
                return c <= 0.03928
                    ? c / 12.92
                    : Math.pow((c + 0.055) / 1.055, 2.4)
            })
            return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
        }

        const l1 = getLuminance(...foreground)
        const l2 = getLuminance(...background)

        const lighter = Math.max(l1, l2)
        const darker = Math.min(l1, l2)

        return (lighter + 0.05) / (darker + 0.05)
    }

    // Bestimmt, ob ein Text als "großer Text" gemäß WCAG gilt
    isLargeText(fontSize, fontWeight) {
        // Umwandlung von px zu pt (1 pt = 1.333 px bei 96 dpi)
        const fontSizePt = parseFloat(fontSize) / 1.333

        // Prüfe, ob der Text fett ist (700 oder größer oder "bold")
        const isBold = fontWeight === "Bold" || parseInt(fontWeight) >= 600

        // Nach WCAG-Regeln gilt:
        // - Fetter Text ab 14pt (18.662px) gilt als "groß"
        // - Normaler Text ab 18pt (24px) gilt als "groß"
        if ((isBold && fontSizePt >= 14) || fontSizePt >= 18) {
            return true
        }

        return false
    }

    // Bewertet das Kontrastverhältnis gemäß WCAG-Richtlinien
    getWCAGLevel(contrast, fontSize, fontWeight) {
        // Bestimme, ob es sich um großen Text handelt
        const isLarge = this.isLargeText(fontSize, fontWeight)

        if (contrast >= 7) {
            return '<span style="color:lightgreen;">✔</span> AAA'
        }

        if (contrast >= 4.5) {
            return '<span style="color:lightgreen;">✔</span> AA'
        }

        if (contrast >= 3 && isLarge) {
            return '<span style="color:lightgreen;">✔</span> AA (Großer Text)'
        }

        // Wenn der Kontrast kleiner als 3 ist oder kleiner als 4.5 bei normalem Text
        return '<span style="color:red;">⛌</span> Fail'
    }
}
