import express from "express"
import cors from "cors"
import puppeteer from "puppeteer"
import { createRequire } from "module"

const require = createRequire(import.meta.url)
const axePath = require.resolve("axe-core")

const app = express()
app.use(cors()) // Access-Control-Allow-Origin: *
app.use(express.json({ limit: "1mb" }))

let browser
async function getBrowser() {
    if (browser?.isConnected()) return browser
    browser = await puppeteer.launch({ headless: "new" })
    return browser
}

app.post("/scan", async (req, res) => {
    const { url, runOnly, options = {} } = req.body || {}
    try {
        if (!url) return res.status(400).json({ error: "url fehlt" })
        const u = new URL(url)
        if (!/^https?:$/.test(u.protocol)) {
            return res.status(400).json({ error: "nur http/https erlaubt" })
        }

        const br = await getBrowser()
        const page = await br.newPage()
        try {
            await page.setBypassCSP(true)
            await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 })
            await page.addScriptTag({ path: axePath })

            const results = await page.evaluate(
                async ({ runOnly, options }) => {
                    return await window.axe.run(document, {
                        runOnly,
                        resultTypes: [
                            "violations",
                            "incomplete",
                            "passes",
                            "inapplicable",
                        ],
                        includeIframes: options.includeIframes ?? false,
                    })
                },
                { runOnly, options }
            )

            res.json(results)
        } finally {
            await page.close().catch(() => {})
        }
    } catch (e) {
        console.error(e)
        res.status(500).json({ error: e.message || String(e) })
    }
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`axe server listening on http://localhost:${PORT}`)
})
