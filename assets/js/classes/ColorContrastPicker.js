// ColorContrastPicker.js
class ColorContrastPicker {
    constructor() {
        this.isActive = false
        this.selectedElement = null
        this.tooltip = this.createTooltip()
        this.initialize()
    }

    initialize() {
        // Erstelle den Pipetten-Button
        const button = document.createElement("button")
        button.innerHTML = "🔍"
        button.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            padding: 10px;
            border-radius: 50%;
            background: white;
            border: 2px solid #333;
            cursor: pointer;
            z-index: 10000;
        `
        document.body.appendChild(button)

        // Event-Listener
        button.addEventListener("click", () => this.togglePicker())
        document.addEventListener("mousemove", (e) => this.handleMouseMove(e))
        document.addEventListener("click", (e) => this.handleClick(e))
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape") this.deactivatePicker()
        })
    }

    createTooltip() {
        const tooltip = document.createElement("div")
        tooltip.style.cssText = `
            position: fixed;
            padding: 8px 12px;
            background: white;
            border: 1px solid #ccc;
            border-radius: 4px;
            font-size: 14px;
            pointer-events: none;
            z-index: 10000;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            display: none;
        `
        document.body.appendChild(tooltip)
        return tooltip
    }

    togglePicker() {
        this.isActive = !this.isActive
        document.body.style.cursor = this.isActive ? "crosshair" : "default"
        if (!this.isActive) {
            this.tooltip.style.display = "none"
        }
    }

    deactivatePicker() {
        this.isActive = false
        document.body.style.cursor = "default"
        this.tooltip.style.display = "none"
    }

    handleMouseMove(e) {
        if (!this.isActive) return

        const element = document.elementFromPoint(e.clientX, e.clientY)
        if (!element) return

        const styles = window.getComputedStyle(element)
        const textColor = styles.color
        const bgColor = styles.backgroundColor

        // Berechne WCAG Kontrast
        const contrast = this.calculateWCAGContrast(
            this.parseColor(textColor),
            this.parseColor(bgColor)
        )

        // Aktualisiere Tooltip
        this.tooltip.style.display = "block"
        this.tooltip.style.left = `${e.pageX + 15}px`
        this.tooltip.style.top = `${e.pageY + 15}px`
        this.tooltip.innerHTML = `
            Text: ${textColor}<br>
            Background: ${bgColor}<br>
            Contrast: ${contrast.toFixed(2)}:1<br>
            WCAG 2.1: ${this.getWCAGLevel(contrast)}
        `
    }

    handleClick(e) {
        if (!this.isActive) return
        e.preventDefault()
        this.deactivatePicker()
    }

    parseColor(color) {
        // Entferne alle Leerzeichen und konvertiere zu RGB-Array
        const rgb = color.replace(/\s/g, "").match(/^rgb\((\d+),(\d+),(\d+)\)$/)
        return rgb
            ? [parseInt(rgb[1]), parseInt(rgb[2]), parseInt(rgb[3])]
            : [0, 0, 0]
    }

    calculateWCAGContrast(foreground, background) {
        // Berechne relative Luminanz
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

    getWCAGLevel(contrast) {
        if (contrast >= 7) return "AAA"
        if (contrast >= 4.5) return "AA"
        if (contrast >= 3) return "AA Large Text"
        return "Fail"
    }
}

// Exportiere die Klasse
export default ColorContrastPicker

/* Verwendung:
import ColorContrastPicker from './ColorContrastPicker.js';
const picker = new ColorContrastPicker();
*/
