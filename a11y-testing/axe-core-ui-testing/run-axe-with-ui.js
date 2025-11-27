// Entferne ungenutzte Variablen wie `const url = "...";` falls vorhanden.

document.addEventListener("DOMContentLoaded", () => {
    const resultsContainer = document.getElementById("results")
    const runAllBtn = document.getElementById("run-a11y-tests")
    const runRuleBtn = document.getElementById("run-rule")
    const runAltBtn = document.getElementById("run-alt-group")
    const runTagBtn = document.getElementById("run-tag")
    const ruleInput = document.getElementById("rule-id")
    const tagInput = document.getElementById("tag-id")
    const runServerBtn = document.getElementById("run-server-scan")
    const urlInput = document.getElementById("scan-url")

    // Neu: Elemente für Regelliste
    const ruleFilter = document.getElementById("rule-filter")
    const ruleList = document.getElementById("rule-list")

    const altRules = [
        "image-alt",
        "area-alt",
        "input-image-alt",
        "object-alt",
        "image-redundant-alt",
    ]

    let availableRuleIds = new Set()
    function refreshCatalog() {
        if (window.axe?.getRules) {
            const rules = window.axe.getRules() || []
            availableRuleIds = new Set(rules.map((r) => r.ruleId || r.id))
        }
    }
    refreshCatalog()

    function showResult(obj) {
        resultsContainer.innerHTML = renderResults(obj)
        attachResultInteractions(resultsContainer, obj)
    }

    function escapeHtml(s = "") {
        return s.replace(
            /[&<>"']/g,
            (c) =>
                ({
                    "&": "&amp;",
                    "<": "&lt;",
                    ">": "&gt;",
                    '"': "&quot;",
                    "'": "&#039;",
                }[c])
        )
    }

    function renderResults(results) {
        const {
            violations = [],
            incomplete = [],
            passes = [],
            inapplicable = [],
        } = results || {}
        const impacts = ["critical", "serious", "moderate", "minor"]
        const impactCounts = Object.fromEntries(impacts.map((i) => [i, 0]))
        violations.forEach((v) => {
            if (v.impact && impactCounts[v.impact] != null)
                impactCounts[v.impact]++
        })

        const countBadge = (cls, label, n) =>
            `<span class="badge ${cls}" title="${label}">${label}: ${n}</span>`
        const impactLabel = (imp) =>
            imp ? `<span class="impact i-${imp}">${imp}</span>` : ""

        const header = `<div class="controls">
  <button data-action="toggle-raw">Rohdaten umschalten</button>
  <button data-action="copy-json">JSON kopieren</button>
  <button data-action="download-json">JSON herunterladen</button>
  <span class="hint">Tipp: Überfahre Selektoren, um Elemente zu highlighten.</span>
</div>
<div class="summary">
  ${countBadge("b-viol", "Violations", violations.length)}
  ${countBadge("b-incomp", "Incomplete", incomplete.length)}
  ${countBadge("b-pass", "Passes", passes.length)}
  ${countBadge("b-na", "Inapplicable", inapplicable.length)}
</div>
<div class="summary">
  ${impacts
      .map(
          (i) =>
              `<span class="badge" style="background:${
                  {
                      critical: "#b71c1c",
                      serious: "#e65100",
                      moderate: "#fbc02d",
                      minor: "#1565c0",
                  }[i]
              };">${i}: ${impactCounts[i]}</span>`
      )
      .join(" ")}
</div>`

        const renderNodes = (nodes = []) =>
            nodes
                .map((n, idx) => {
                    const targets = (n.target || [])
                        .map(
                            (sel) =>
                                `<span class="target" data-target="${escapeHtml(
                                    sel
                                )}" title="Hover zum Hervorheben">${escapeHtml(
                                    sel
                                )}</span>`
                        )
                        .join(" ")
                    return `<div class="node">
                <div><strong>Node ${idx + 1}</strong> ${impactLabel(
                        n.impact
                    )}</div>
                ${
                    n.failureSummary
                        ? `<div>${escapeHtml(n.failureSummary)}</div>`
                        : ""
                }
                ${targets ? `<div>Target: ${targets}</div>` : ""}
                ${
                    n.html
                        ? `<details><summary>Snippet</summary><pre>${escapeHtml(
                              n.html
                          )}</pre></details>`
                        : ""
                }
            </div>`
                })
                .join("")

        const renderIssue = (issue) => `
<details open>
  <summary>${escapeHtml(issue.help || issue.id)} ${impactLabel(
            issue.impact
        )} <span class="help">(${escapeHtml(issue.id)})</span></summary>
  ${issue.description ? `<div>${escapeHtml(issue.description)}</div>` : ""}
  ${
      issue.tags?.length
          ? `<div>${issue.tags
                .map((t) => `<span class="tag">${escapeHtml(t)}</span>`)
                .join(" ")}</div>`
          : ""
  }
  ${
      issue.helpUrl
          ? `<div class="help"><a href="${escapeHtml(
                issue.helpUrl
            )}" target="_blank" rel="noopener">Mehr Info</a></div>`
          : ""
  }
  ${renderNodes(issue.nodes)}
</details>`

        const sections = [
            { title: `Violations (${violations.length})`, items: violations },
            { title: `Incomplete (${incomplete.length})`, items: incomplete },
            { title: `Passes (${passes.length})`, items: passes },
            {
                title: `Inapplicable (${inapplicable.length})`,
                items: inapplicable,
            },
        ]
            .map(
                (sec) => `
<h2>${sec.title}</h2>
${sec.items.length ? sec.items.map(renderIssue).join("") : "<div>Keine</div>"}
`
            )
            .join("")

        return `
${header}
${sections}
<pre class="raw" id="raw-json"><code>${escapeHtml(
            JSON.stringify(results, null, 2)
        )}</code></pre>`
    }

    function attachResultInteractions(root, results) {
        const raw = root.querySelector("#raw-json")
        root.querySelector('[data-action="toggle-raw"]')?.addEventListener(
            "click",
            () => {
                if (!raw) return
                raw.style.display =
                    raw.style.display === "block" ? "none" : "block"
            }
        )
        root.querySelector('[data-action="copy-json"]')?.addEventListener(
            "click",
            async () => {
                try {
                    await navigator.clipboard.writeText(
                        JSON.stringify(results, null, 2)
                    )
                } catch {}
            }
        )
        root.querySelector('[data-action="download-json"]')?.addEventListener(
            "click",
            () => {
                const blob = new Blob([JSON.stringify(results, null, 2)], {
                    type: "application/json",
                })
                const url = URL.createObjectURL(blob)
                const a = document.createElement("a")
                a.href = url
                a.download = `axe-results-${new Date()
                    .toISOString()
                    .slice(0, 19)
                    .replace(/[:T]/g, "-")}.json`
                document.body.appendChild(a)
                a.click()
                a.remove()
                URL.revokeObjectURL(url)
            }
        )

        // Hover-Highlight für Selektoren
        root.addEventListener("mouseover", (e) => {
            const el = e.target.closest(".target")
            if (!el) return
            const sel = el.getAttribute("data-target")
            safeHighlight(sel, true)
        })
        root.addEventListener("mouseout", (e) => {
            const el = e.target.closest(".target")
            if (!el) return
            const sel = el.getAttribute("data-target")
            safeHighlight(sel, false)
        })
    }

    function safeHighlight(selector, on) {
        if (!selector) return
        let els = []
        try {
            els = Array.from(document.querySelectorAll(selector))
        } catch {
            els = []
        }
        els.forEach((el) => el.classList.toggle("outline-hl", on))
    }

    async function runAxeWith(runOnly) {
        if (!window.axe) {
            resultsContainer.textContent =
                "axe-core nicht gefunden. Stelle sicher, dass das CDN-Script vor diesem Modul lädt."
            return
        }
        resultsContainer.textContent = "Running axe..."
        try {
            const results = await window.axe.run(document, { runOnly })
            showResult(results)
        } catch (err) {
            console.error(err)
            resultsContainer.textContent = `axe run failed: ${err.message}`
        }
    }

    function suggestRules(input) {
        const needle = input.toLowerCase()
        const all = Array.from(availableRuleIds)
        const hits = all.filter((id) => id.toLowerCase().includes(needle))
        // ein paar häufige Tipps ergänzen
        const common = ["color-contrast", "image-alt", "label", "target-size"]
        return [...new Set([...hits, ...common])].slice(0, 6)
    }

    // Alle (WCAG 2 A/AA)
    runAllBtn?.addEventListener("click", () => {
        runAxeWith({ type: "tag", values: ["wcag2a", "wcag2aa"] })
    })

    // Einzelne Regel
    runRuleBtn?.addEventListener("click", () => {
        refreshCatalog()
        const id = (ruleInput?.value || "").trim()
        if (!id) {
            resultsContainer.textContent =
                "Bitte eine Regel-ID eingeben (z. B. color-contrast, target-size)."
            return
        }
        if (!availableRuleIds.has(id)) {
            const suggestions = suggestRules(id)
            resultsContainer.innerHTML =
                `Unbekannte Regel-ID: "${id}".<br>` +
                `Vorschläge: ${suggestions.join(", ")}`
            return
        }
        runAxeWith({ type: "rule", values: [id] })
    })

    // Alt-bezogene Regeln (Gruppierung per IDs)
    runAltBtn?.addEventListener("click", () => {
        refreshCatalog()
        const ids = altRules.filter((id) => availableRuleIds.has(id))
        if (ids.length === 0) {
            resultsContainer.textContent =
                "Keine der Alt-Regeln ist in dieser axe-Version verfügbar."
            return
        }
        runAxeWith({ type: "rule", values: ids })
    })

    // Nach Tag (z. B. wcag2a, wcag2aa, wcag22, best-practice, cat.text-alternatives)
    runTagBtn?.addEventListener("click", () => {
        const raw = (tagInput?.value || "").trim()
        if (!raw) {
            resultsContainer.textContent =
                "Bitte mindestens einen Tag eingeben (z. B. cat.text-alternatives)."
            return
        }
        const tags = raw.split(/[, ]+/).filter(Boolean)
        runAxeWith({ type: "tag", values: tags })
    })

    const serverOrigin = "https://michael.gfu.net:3001"

    // Hilfsfunktion: runOnly aus UI ableiten (Regel > Tags > Default)
    function getRunOnlyFromInputs() {
        const rule = (ruleInput?.value || "").trim()
        const rawTags = (tagInput?.value || "").trim()
        if (rule) return { type: "rule", values: [rule] }
        if (rawTags) {
            const tags = rawTags.split(/[, ]+/).filter(Boolean)
            if (tags.length) return { type: "tag", values: tags }
        }
        return { type: "tag", values: ["wcag2a", "wcag2aa"] }
    }

    async function runServerScan(url, runOnly, options = {}) {
        const btn = runServerBtn
        btn && (btn.disabled = true)
        resultsContainer.textContent = "Server-Scan läuft..."
        try {
            const res = await fetch(`${serverOrigin}/scan`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ url, runOnly, options }),
            })
            const data = await res.json()
            if (!res.ok) {
                throw new Error(data?.error || `HTTP ${res.status}`)
            }
            showResult(data)
        } catch (e) {
            console.error(e)
            resultsContainer.textContent = `Server-Scan fehlgeschlagen: ${e.message}`
        } finally {
            btn && (btn.disabled = false)
        }
    }

    runServerBtn?.addEventListener("click", () => {
        const val = (urlInput?.value || "").trim()
        let u
        try {
            u = new URL(val)
        } catch {
            u = null
        }
        if (!u || !/^https?:$/.test(u.protocol)) {
            resultsContainer.textContent =
                "Bitte eine gültige http(s)-URL eingeben."
            return
        }
        // runOnly wie in der UI gewählt verwenden
        const runOnly = getRunOnlyFromInputs()
        runServerScan(val, runOnly, { includeIframes: false })
    })

    // Bestehende Buttons funktionieren weiter (lokal im aktuellen DOM)

    // Katalog laden und anzeigen
    function getRuleCatalog() {
        const raw = window.axe?.getRules ? window.axe.getRules() || [] : []
        return raw
            .map((r) => ({
                id: r.ruleId || r.id,
                help: r.help || r.metadata?.help || "",
                description: r.description || r.metadata?.description || "",
                tags: r.tags || r.metadata?.tags || [],
                helpUrl: r.helpUrl || r.metadata?.helpUrl || "",
            }))
            .filter((r) => !!r.id)
    }

    function renderRuleList(filterText = "") {
        if (!ruleList) return
        const f = (filterText || "").toLowerCase()
        const rules = getRuleCatalog()
            .filter(
                (r) =>
                    !f ||
                    r.id.toLowerCase().includes(f) ||
                    r.help.toLowerCase().includes(f) ||
                    r.description.toLowerCase().includes(f) ||
                    (r.tags || []).some((t) =>
                        (t || "").toLowerCase().includes(f)
                    )
            )
            .sort((a, b) => a.id.localeCompare(b.id))

        if (!rules.length) {
            ruleList.innerHTML = "<div>Keine Regeln gefunden.</div>"
            return
        }

        ruleList.innerHTML = rules
            .map(
                (r) => `
<div style="border:1px solid #eee; border-radius:6px; padding:8px; margin:6px 0;">
  <div style="display:flex; justify-content:space-between; gap:8px; align-items:center;">
    <div>
      <strong>${escapeHtml(r.id)}</strong>
      ${r.help ? ` – ${escapeHtml(r.help)}` : ""}
      ${
          r.tags?.length
              ? `<div class="help">${r.tags
                    .map((t) => `<span class="tag">${escapeHtml(t)}</span>`)
                    .join(" ")}</div>`
              : ""
      }
      ${
          r.helpUrl
              ? `<div class="help"><a href="${escapeHtml(
                    r.helpUrl
                )}" target="_blank" rel="noopener">Mehr Info</a></div>`
              : ""
      }
    </div>
    <div style="white-space:nowrap;">
      <button data-action="select-rule" data-rule="${escapeHtml(
          r.id
      )}">Auswählen</button>
      <button data-action="run-rule" data-rule="${escapeHtml(
          r.id
      )}">Starten</button>
    </div>
  </div>
  ${
      r.description
          ? `<div class="help" style="margin-top:6px;">${escapeHtml(
                r.description
            )}</div>`
          : ""
  }
</div>
        `
            )
            .join("")
    }

    // Initial anzeigen
    renderRuleList()

    // Filter live anwenden (mit kleinem Debounce)
    let filterTimer
    ruleFilter?.addEventListener("input", (e) => {
        clearTimeout(filterTimer)
        filterTimer = setTimeout(() => renderRuleList(e.target.value), 120)
    })

    // Klick-Handling in der Liste
    ruleList?.addEventListener("click", (e) => {
        const btn = e.target.closest("button[data-action]")
        if (!btn) return
        const id = btn.getAttribute("data-rule")
        if (!id) return
        if (btn.dataset.action === "select-rule") {
            if (ruleInput) ruleInput.value = id
            // optional: nach oben scrollen
            ruleInput?.scrollIntoView({ behavior: "smooth", block: "center" })
        } else if (btn.dataset.action === "run-rule") {
            // lokal auf aktueller Seite ausführen
            runAxeWith({ type: "rule", values: [id] })
        }
    })
})
