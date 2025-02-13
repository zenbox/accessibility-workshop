// fontMetrics.js
const opentype = require("opentype.js")
const path = require("path")
const fs = require("fs")

class FontMetricsReader {
    constructor() {
        // Font-Pfade erweitern
        this.fontPaths = {
            system: "/System/Library/Fonts", // MacOS
            windows: "C:\\Windows\\Fonts", // Windows
            linux: "/usr/share/fonts", // Linux
            local: path.join(__dirname, "fonts"), // Lokaler Font-Ordner
            userData: path.join(
                process.env.HOME || process.env.USERPROFILE,
                "Library/Fonts"
            ), // User Fonts
        }
    }

    async findFontFile(fontName) {
        console.log("Searching for font:", fontName)

        const fontExtensions = [".ttf", ".otf", ".woff", ".woff2"]
        const searchPaths = Object.values(this.fontPaths)

        const searchResults = []

        for (const dir of searchPaths) {
            if (!fs.existsSync(dir)) {
                console.log(`Directory does not exist: ${dir}`)
                continue
            }

            try {
                const files = await fs.promises.readdir(dir)
                console.log(`Searching in ${dir}, found ${files.length} files`)

                for (const file of files) {
                    const fullPath = path.join(dir, file)

                    // Prüfe ob es ein Font-File ist
                    if (
                        fontExtensions.some((ext) =>
                            file.toLowerCase().endsWith(ext)
                        )
                    ) {
                        // Prüfe ob der Name übereinstimmt
                        if (
                            file.toLowerCase().includes(fontName.toLowerCase())
                        ) {
                            console.log("Found matching font:", fullPath)
                            return fullPath
                        }
                        // Speichere alle Font-Files für Debug-Ausgabe
                        searchResults.push(fullPath)
                    }
                }
            } catch (error) {
                console.error(`Error reading directory ${dir}:`, error)
            }
        }

        console.log("No matching font found. Available fonts:", searchResults)
        return null
    }

    async getMetrics(fontPath) {
        console.log("Reading metrics from:", fontPath)

        try {
            const font = opentype.loadSync(fontPath)
            console.log("Font loaded successfully")

            const os2 = font.tables.os2
            const hhea = font.tables.hhea
            const head = font.tables.head

            if (!os2 || !hhea || !head) {
                throw new Error("Required font tables missing")
            }

            // Rest der Funktion bleibt gleich...
            const metrics = {
                // ... [wie vorher]
            }

            return metrics
        } catch (error) {
            console.error("Error reading font metrics:", error)
            throw new Error(`Failed to read font metrics: ${error.message}`)
        }
    }
}
// Express Route Handler
async function handleFontMetricsRequest(req, res) {
    const { fontName, fontSize = 100 } = req.query
    const reader = new FontMetricsReader()

    try {
        const fontPath = await reader.findFontFile(fontName)
        if (!fontPath) {
            return res
                .status(404)
                .json({ error: `Font "${fontName}" nicht gefunden` })
        }

        const metrics = await reader.getMetrics(fontPath)
        const pixelMetrics = reader.calculatePixelMetrics(metrics, fontSize)

        res.json({
            fontName,
            fontSize,
            metrics,
            pixelMetrics,
        })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

module.exports = { FontMetricsReader, handleFontMetricsRequest }
