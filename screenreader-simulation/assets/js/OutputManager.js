/**
 * OutputManager class - Handles the output to the simulation overlay
 */
export default class OutputManager {
    constructor(simulation) {
        this.simulation = simulation
        this.outputElement = simulation.outputElement
        this.maxLines = 30
        this.lines = []
    }

    speak(text, type = "speech", lang = null) {
        if ( !text) return

        // Für die Protokollierung nur den eigentlichen Text verwenden, kein Symbol
        this.lines.push(text)

        // Limit the number of lines
        if (this.lines.length > this.maxLines) {
            this.lines.shift()
        }

        // Update the output
        this.updateOutput()

        // Sprachausgabe aktivieren, wenn verfügbar und es sich um gesprochenen Text handelt
        if (type === "speech" && this.simulation.speechOutput) {
            this.simulation.speechOutput.speak(text, lang)
        }
    }

    updateOutput() {
        this.outputElement.innerHTML = this.lines.join("<hr>")
        // Auto-scroll to bottom
        this.outputElement.scrollTop = this.outputElement.scrollHeight
    }

    clear() {
        this.lines = []
        this.outputElement.innerHTML = ""
    }
}
