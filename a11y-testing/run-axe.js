import axe from "axe-core"
import puppeteer from "puppeteer"
import fs from "node:fs"
import path from "node:path"
import { execSync } from "node:child_process"
import axeHtmlReporter from "axe-html-reporter"

const { createHtmlReport } = axeHtmlReporter

;(async () => {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.goto("https://fabasoft.com/de", { waitUntil: "networkidle2" })
    await page.addScriptTag({ content: axe.source })

    const results = await page.evaluate(async () => {
        return await window.axe.run(document, {
            runOnly: ["wcag2a", "wcag2aa"],
        })
    })

    // JSON weiterhin in der Konsole
    console.log(JSON.stringify(results, null, 2))

    // HTML-Report erzeugen und im Browser öffnen
    const outputDir = path.resolve(process.cwd(), "reports")
    await fs.promises.mkdir(outputDir, { recursive: true })
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-")
    const reportPath = path.join(outputDir, `axe-report-${timestamp}.html`)

    const reportHTML = createHtmlReport({
        results,
        options: {
            projectKey: "fabasoft.com",
        },
    })

    fs.writeFileSync(reportPath, reportHTML, "utf8")
    console.log(`HTML-Report erstellt: ${reportPath}`)

    // macOS: Report im Standardbrowser öffnen
    try {
        execSync(`open "${reportPath}"`)
    } catch (e) {
        console.warn(
            "Konnte den Report nicht automatisch öffnen. Datei-Pfad siehe oben."
        )
    }

    await browser.close()
})()
