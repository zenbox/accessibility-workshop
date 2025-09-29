/* ========== Helpers ========== */
function waitForAxe(timeout = 10000) {
    return new Promise((resolve, reject) => {
        const t0 = Date.now()
        ;(function check() {
            if (window.axe && typeof axe.run === "function") return resolve()
            if (Date.now() - t0 > timeout)
                return reject(new Error("axe-core nicht geladen"))
            requestAnimationFrame(check)
        })()
    })
}

const $ = (sel, root = document) => root.querySelector(sel)
const $all = (sel, root = document) => Array.from(root.querySelectorAll(sel))

function showPanel() {
    const results = document.getElementById("results")
    if (results) {
        results.style.display = "block"
    }
}

function showLoading() {
    showPanel()
    const bar = $("#status-bar")
    bar.className = "status-bar"
    bar.textContent = "🔄 Tests werden ausgeführt..."
}

function showError(msg) {
    showPanel()
    const bar = $("#status-bar")
    bar.className = "status-bar error"
    bar.textContent = "🔥 " + msg
}

function escapeHtml(text) {
    const div = document.createElement("div")
    div.textContent = String(text ?? "")
    return div.innerHTML
}

function scopeSelector() {
    // const val = document.querySelector(
    //     'input[name="scope"]:checked'
    // ).value || "document"
    // return val === "main" ? "main" : document // 'document' == ganze Seite
    return document
}

/* ========== Rendering ========== */
function createViolationElement(violation) {
    const div = document.createElement("div")
    div.className = `violation-item ${violation.impact || ""}`
    div.innerHTML = `
        <div class="violation-header">${escapeHtml(violation.id)} ${(
        violation.impact || ""
    ).toUpperCase()}</div>
        <div class="violation-help">
          ${escapeHtml(violation.help)}
          <a href="${
              violation.helpUrl
          }" target="_blank" style="margin-left:10px;">📖 Mehr Info</a>
        </div>
        <div class="violation-nodes">
          <strong>Betroffene Elemente (${violation.nodes.length}):</strong>
          ${violation.nodes
              .map(
                  (node) => `
            <div class="node-item">
              <strong>Selector:</strong> ${escapeHtml(
                  (node.target || []).join(", ")
              )}<br>
              <strong>HTML:</strong> ${escapeHtml(node.html)}<br>
              <strong>Problem:</strong> ${escapeHtml(node.failureSummary)}
            </div>
          `
              )
              .join("")}
        </div>`
    return div
}

function displayResults(results) {
    showPanel()
    const bar = $("#status-bar")
    const list = $("#violations-list")
    const n = results.violations.length

    bar.className = n === 0 ? "status-bar success" : "status-bar error"
    bar.textContent =
        n === 0
            ? "✅ Keine Accessibility-Violations gefunden!"
            : `❌ ${n} Accessibility-Violation(s) gefunden`
    list.innerHTML = ""
    results.violations.forEach((v) =>
        list.appendChild(createViolationElement(v))
    )

    console.group("🔍 Axe Ergebnis")
    console.log("Violations:", n)
    console.log("Passes:", results.passes.length)
    console.log("Incomplete:", results.incomplete.length)
    console.log("Inapplicable:", results.inapplicable.length)
    if (n > 0) {
        console.group("Details:")
        results.violations.forEach((v) =>
            console.log(`${v.id} (${v.impact}): ${v.nodes.length} nodes`)
        )
        console.groupEnd()
    }
    console.groupEnd()
}

/* ========== Highlights ========== */
function clearHighlights() {
    $all(".highlight-violation").forEach((el) => {
        el.classList.remove("highlight-violation")
        el.removeAttribute("data-violation-info")
    })
}

function highlightViolations(violations) {
    clearHighlights()
    // Highlights sind jetzt immer aktiviert
    violations.forEach((v) => {
        ;(v.nodes || []).forEach((node) => {
            ;(node.target || []).forEach((sel) => {
                try {
                    document.querySelectorAll(sel).forEach((el) => {
                        if (!el.closest("#axe-overlay")) {
                            el.classList.add("highlight-violation")
                            el.setAttribute(
                                "data-violation-info",
                                `${v.id} (${v.impact})`
                            )
                        }
                    })
                } catch (e) {
                    console.warn("Highlight-Fehler für Selector:", sel)
                }
            })
        })
    })
}

/* ========== Scans ========== */
async function runFullTest() {
    showLoading()
    try {
        const target = scopeSelector()
        // runFullTest()
        const results = await axe.run({
            include: [["body"]],
            exclude: [["#axe-core"]],
        })
        displayResults(results)
        highlightViolations(results.violations)
    } catch (err) {
        showError("Fehler beim Test: " + err.message)
    }
}

async function runQuickTest() {
    showLoading()
    try {
        const target = scopeSelector()
        // runQuickTest()
        const results = await axe.run(
            {
                include: [["body"]],
                exclude: [["#axe-core"]],
            },
            {
                tags: ["wcag2a"],
                timeout: 5000,
            }
        )
        displayResults(results)
        highlightViolations(results.violations)
    } catch (err) {
        showError("Fehler beim Quick Test: " + err.message)
    }
}

async function runWCAGTest() {
    showLoading()
    try {
        const target = scopeSelector()
        // runWCAGTest()
        const results = await axe.run(
            {
                include: [["body"]],
                exclude: [["#axe-core"]],
            },
            {
                tags: ["wcag2a", "wcag2aa", "wcag21aa"],
                timeout: 10000,
            }
        )
        displayResults(results)
        highlightViolations(results.violations)
    } catch (err) {
        showError("Fehler beim WCAG Test: " + err.message)
    }
}

/**
 * Run Target Size Tests
 *
 * hier testen wir wir für alle Beispiele
 * die Regel mit den 24px ...
 */
async function runTargetSizeTests() {
    // show indicator
    showLoading()

    // Test execution
    try {
        // get the testing scope
        const target = scopeSelector()

        // run only the target-size rule
        // runTargetSizeTests()
        const results = await axe.run(
            {
                include: [["body"]],
                exclude: [["#axe-core"]],
            },
            {
                runOnly: { type: "rule", values: ["target-size"] },
                timeout: 6000, // 6 seconds, must be enough
            }
        )

        // show results in an aside panel
        displayResults(results)

        // highlight the violations in the document
        highlightViolations(results.violations)
    } catch (err) {
        showError("Fehler beim Target Size Test: " + err.message)
    }
}

async function runColorContrastTests() {
    // show indicator
    showLoading()

    // Test execution
    try {
        // get the testing scope
        const target = scopeSelector()

        // run only the target-size rule
        // runColorContrastTests()
        const results = await axe.run(
            {
                include: [["body"]],
                exclude: [["#axe-core"]],
            },
            {
                runOnly: { type: "rule", values: ["color-contrast"] },
                timeout: 6000, // 6 seconds, must be enough
            }
        )

        // show results in an aside panel
        displayResults(results)

        // highlight the violations in the document
        highlightViolations(results.violations)
    } catch (err) {
        showError("Fehler beim Colour Contrast Test: " + err.message)
    }
}

async function runTableTests() {
    // show indicator
    showLoading()

    // Test execution
    try {
        // get the testing scope
        const target = scopeSelector()

        // run only the target-size rule
        // runTableTests()
        const results = await axe.run(
            {
                include: [["body"]],
                exclude: [["#axe-core"]],
            },
            {
                runOnly: {
                    type: "rule",
                    values: [
                        "td-headers-attr",
                        "th-has-data-cells",
                        "empty-table-header",
                        "table-fake-caption",
                        "table-duplicate-name",
                    ],
                },
                timeout: 6000, // 6 seconds, must be enough
            }
        )

        // show results in an aside panel
        displayResults(results)

        // highlight the violations in the document
        highlightViolations(results.violations)
    } catch (err) {
        showError("Fehler beim Table Test: " + err.message)
    }
}

async function runListOfTests() {
    showLoading()
    const bar = $("#status-bar")
    const allViolations = []
    const tests = [
        {
            name: "🖼️ Bilder & Alt-Text",
            rules: ["image-alt", "svg-img-alt", "area-alt"],
        },
        // {name:'📝 Formulare & Labels', rules:['label','form-field-multiple-labels','duplicate-id']},
        // {name:'🔘 Buttons & Links', rules:['button-name','link-name']},
        // {name:'🎨 Farbkontrast', rules:['color-contrast']},
        // {name:'📋 Heading-Struktur', rules:['heading-order','empty-heading','page-has-heading-one']},
        // {name:'⌨️ Keyboard & Focus', rules:['tabindex','focusable-content']},
        // {name:'📊 Tabellen', rules:['table-fake-caption','td-headers-attr','th-has-data-cells']},
        // {name:'🏗️ ARIA & Semantik', rules:['aria-valid-attr','aria-valid-attr-value','aria-roles']}
    ]

    try {
        const target = scopeSelector()
        for (let i = 0; i < tests.length; i++) {
            const t = tests[i]
            bar.className = "status-bar"
            bar.textContent = `🔄 Test ${i + 1}/${tests.length}: ${t.name}`
            try {
                // runListOfTests()
                const res = await axe.run(target, {
                    exclude: [["#axe-core"]], // Das gesamte aside ausschließen
                    runOnly: { type: "rule", values: t.rules },
                    timeout: 6000,
                })
                allViolations.push(...res.violations)
            } catch (err) {
                console.warn("Einzeltest-Fehler:", t.name, err.message)
            }
        }
        const results = {
            violations: allViolations,
            passes: [],
            incomplete: [],
            inapplicable: [],
        }
        displayResults(results)
        highlightViolations(allViolations)
    } catch (err) {
        showError("Fehler bei Einzeltests: " + err.message)
    }
}

/* ========== Utilities ========== */
function clearResults() {
    closeAxeOverlay()
}

function doSomething() {
    alert("Diese Funktion sollte über einen echten Button zugänglich sein!")
}

/* ========== Shortcuts & Init ========== */
document.addEventListener("keydown", (e) => {
    if (e.ctrlKey || e.metaKey) {
        if (e.key === "t") {
            e.preventDefault()
            runQuickTest()
        }
        if (e.key === "T") {
            e.preventDefault()
            runFullTest()
        }
        if (e.key === "l") {
            e.preventDefault()
            runListOfTests()
        }
        if (e.key === "r") {
            e.preventDefault()
            clearResults()
        }
    }
})

window.addEventListener("load", async () => {
    try {
        await waitForAxe()
        console.log(
            "✅ axe-core geladen. Scope umschaltbar (Ganze Seite / Main)."
        )
    } catch (err) {
        showError(err.message)
    }
})
