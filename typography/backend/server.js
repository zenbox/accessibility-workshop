// server.js
const express = require("express")
const cors = require("cors")
const opentype = require("opentype.js")
const path = require("path")
const fs = require("fs")

const app = express()
app.use(cors())

// Font Pfade
const fontPaths = {
    system: "/System/Library/Fonts", // MacOS
    windows: "C:\\Windows\\Fonts", // Windows
    linux: "/usr/share/fonts", // Linux
    local: path.join(__dirname, "fonts"), // Lokaler Font-Ordner
    userData: process.env.HOME
        ? path.join(process.env.HOME, "Library/Fonts")
        : null, // User Fonts
}

// Hilfsfunktion zum Suchen von Font-Files
async function findFontFile(fontName) {
    console.log("Searching for font:", fontName)

    const fontExtensions = [".ttf", ".otf", ".woff", ".woff2"]
    const searchPaths = Object.values(fontPaths).filter(Boolean)

    // Font-Namen in Teile zerlegen
    const [family, style = "Regular"] = fontName.split("-")
    console.log("Searching for family:", family, "style:", style)

    for (const dir of searchPaths) {
        if (!fs.existsSync(dir)) {
            console.log(`Directory does not exist: ${dir}`)
            continue
        }

        try {
            const files = await fs.promises.readdir(dir)
            console.log(`Searching in ${dir}, found ${files.length} files`)

            // Erst exakte Übereinstimmung suchen
            for (const file of files) {
                if (
                    fontExtensions.some((ext) =>
                        file.toLowerCase().endsWith(ext)
                    )
                ) {
                    const fullPath = path.join(dir, file)
                    if (file === `${family}-${style}${path.extname(file)}`) {
                        console.log("Found exact match:", fullPath)
                        return fullPath
                    }
                }
            }

            // Dann nach "Regular" oder Standardschnitt suchen
            for (const file of files) {
                if (
                    fontExtensions.some((ext) =>
                        file.toLowerCase().endsWith(ext)
                    )
                ) {
                    const fullPath = path.join(dir, file)
                    if (
                        file === `${family}-Regular${path.extname(file)}` ||
                        file === `${family}${path.extname(file)}`
                    ) {
                        console.log("Found regular weight:", fullPath)
                        return fullPath
                    }
                }
            }
        } catch (error) {
            console.error(`Error reading directory ${dir}:`, error)
        }
    }

    throw new Error(`Font "${fontName}" not found`)
}

async function getFontMetrics(fontPath, fontSize) {
    console.log("Reading metrics from:", fontPath)

   try {
       // Prüfe ob File existiert und lesbar ist
       await fs.promises.access(fontPath, fs.constants.R_OK)

       // File-Statistiken ausgeben
       const stats = await fs.promises.stat(fontPath)
       console.log("Font file stats:", {
           size: stats.size,
           created: stats.birthtime,
           modified: stats.mtime,
       })

       // Font-Datei direkt lesen
       const fontBuffer = await fs.promises.readFile(fontPath)
       console.log("Read font file, size:", fontBuffer.length)

       // Buffer in ArrayBuffer konvertieren
       const arrayBuffer = fontBuffer.buffer.slice(
           fontBuffer.byteOffset,
           fontBuffer.byteOffset + fontBuffer.byteLength
       )

       // Versuche Font zu laden
       console.log("Attempting to parse font with opentype.js...")
       const font = opentype.parse(arrayBuffer)
       console.log("Font parsed successfully")

       // Font-Grunddaten prüfen
       console.log("Font basic info:", {
           numGlyphs: font.numGlyphs,
           unitsPerEm: font.unitsPerEm,
           names: Object.keys(font.names),
       })

       // Tabellen prüfen
       console.log("Available tables:", Object.keys(font.tables))

       // Wichtige Font-Tabellen
       const os2 = font.tables.os2
       const hhea = font.tables.hhea
       const head = font.tables.head

       console.log("Table data:", {
           os2: os2 ? "present" : "missing",
           hhea: hhea ? "present" : "missing",
           head: head ? "present" : "missing",
       })

       if (!os2 || !hhea || !head) {
           throw new Error("Required font tables missing")
       }

       // Basis-Metriken in Font-Units
       const metrics = {
           // Grundlegende Font-Informationen
           unitsPerEm: font.unitsPerEm,
           fontFamily: font.names.fontFamily?.en || "Unknown",
           fontSubfamily: font.names.fontSubfamily?.en || "Regular",
           version: font.names.version?.en || "Unknown",

           // OS/2 Metriken
           xHeight: os2.sxHeight,
           capHeight: os2.sCapHeight,
           typoAscender: os2.sTypoAscender,
           typoDescender: os2.sTypoDescender,
           typoLineGap: os2.sTypoLineGap,
           winAscent: os2.usWinAscent,
           winDescent: os2.usWinDescent,

           // hhea Metriken
           hheaAscender: hhea.ascender,
           hheaDescender: hhea.descender,
           hheaLineGap: hhea.lineGap,

           // head Metriken
           yMin: head.yMin,
           yMax: head.yMax,
       }

       console.log("Raw metrics:", metrics)

       // Umrechnung in Pixel
       const pixelMultiplier = fontSize / font.unitsPerEm
       const pixelMetrics = {}
       for (const [key, value] of Object.entries(metrics)) {
           if (typeof value === "number") {
               pixelMetrics[key] = Number((value * pixelMultiplier).toFixed(4))
           }
       }

       // Verhältnisse zur UPM berechnen
       const ratios = {
           xHeightRatio: Number(
               ((metrics.xHeight / metrics.unitsPerEm) * 100).toFixed(4)
           ),
           capHeightRatio: Number(
               ((metrics.capHeight / metrics.unitsPerEm) * 100).toFixed(4)
           ),
           typoAscenderRatio: Number(
               ((metrics.typoAscender / metrics.unitsPerEm) * 100).toFixed(4)
           ),
           typoDescenderRatio: Number(
               (
                   (Math.abs(metrics.typoDescender) / metrics.unitsPerEm) *
                   100
               ).toFixed(4)
           ),
       }

       console.log("Metrics processing complete")

       return {
           fontFamily: metrics.fontFamily,
           fontSubfamily: metrics.fontSubfamily,
           version: metrics.version,
           unitsPerEm: metrics.unitsPerEm,
           metrics,
           pixelMetrics,
           ratios,
       }
   } catch (error) {
       console.error("Detailed error in getFontMetrics:", {
           message: error.message,
           stack: error.stack,
           name: error.name,
           code: error.code,
       })
       throw error
   }
}

// Route
app.get("/api/font-metrics", async (req, res) => {
    try {
        console.log("Query:", req.query)
        const fontName = req.query.fontName || ""
        const fontSize = parseInt(req.query.fontSize) || 100

        const cleanFontName = fontName.split(",")[0].trim()
        console.log("Clean font name:", cleanFontName)

        const fontPath = await findFontFile(cleanFontName)
        console.log("Using font file:", fontPath)

        const metricsData = await getFontMetrics(fontPath, fontSize)

        res.json({
            fontName: cleanFontName,
            fontSize: fontSize,
            fontPath: fontPath,
            ...metricsData,
        })
    } catch (error) {
        console.error("Route Error:", error)
        res.status(500).json({
            error: error.message,
            stack: error.stack,
            name: error.name,
            code: error.code,
        })
    }
})

// Start server
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)

    
})