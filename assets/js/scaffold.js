class Tooltip {
    constructor(options = {}) {
        this.offset = options.offset || 10
        this.className = options.className || "custom-tooltip"
        this.style = {
            position: "absolute",
            background: options.background || "rgba(0, 0, 0, 0.8)",
            color: options.color || "white",
            padding: options.padding || "10px",
            borderRadius: options.borderRadius || "4px",
            fontSize: options.fontSize || "14px",
            maxWidth: options.maxWidth || "250px",
            zIndex: options.zIndex || 1000,
            pointerEvents: "none",
            ...options.additionalStyles,
        }

        this.createElement()
    }

    createElement() {
        this.element = document.createElement("div")
        this.element.classList.add(this.className)
        this.element.style.display = "none"

        // Styles anwenden
        Object.entries(this.style).forEach(([property, value]) => {
            this.element.style[property] = value
        })

        document.body.appendChild(this.element)
    }

    updatePosition(event) {
        this.element.style.left = `${event.pageX + this.offset}px`
        this.element.style.top = `${event.pageY + this.offset}px`
    }

    setText(text) {
        this.element.textContent = text
    }

    show() {
        this.element.style.display = "block"
    }

    hide() {
        this.element.style.display = "none"
    }

    attachTo(target, text) {
        if (typeof text === "function") {
            this.getTextContent = text
        } else {
            this.getTextContent = () => text
        }

        const handleMouseOver = () => {
            this.setText(this.getTextContent())
            this.show()
            document.addEventListener(
                "mousemove",
                this.updatePosition.bind(this)
            )
        }

        const handleMouseOut = () => {
            this.hide()
            document.removeEventListener(
                "mousemove",
                this.updatePosition.bind(this)
            )
        }

        target.addEventListener("mouseover", handleMouseOver)
        target.addEventListener("mouseout", handleMouseOut)

        // Return cleanup function
        return () => {
            target.removeEventListener("mouseover", handleMouseOver)
            target.removeEventListener("mouseout", handleMouseOut)
            this.element.remove()
        }
    }
}

function createAxeCoreTestScripts() {
    const relativePathToRoot = getRelativePathToRoot()

    // Axe Core Library Script erstellen
    const axeLibScript = document.createElement("script")
    axeLibScript.src = relativePathToRoot + "assets/lib/axe.min.js"
    axeLibScript.type = "text/javascript"
    axeLibScript.async = false // Stelle sicher, dass axe vor dem Test-Script lädt

    // Axe Core Test Script erstellen
    const axeTestScript = document.createElement("script")
    axeTestScript.src = relativePathToRoot + "assets/js/axe-core-test.js"
    axeTestScript.type = "text/javascript"
    axeTestScript.async = false

    // Error-Handler für fehlende Dateien
    axeLibScript.onerror = () => {
        console.warn(
            "⚠️ axe.min.js konnte nicht geladen werden:",
            axeLibScript.src
        )
    }

    axeTestScript.onerror = () => {
        console.warn(
            "⚠️ axe-core-test.js konnte nicht geladen werden:",
            axeTestScript.src
        )
    }

    // Success-Handler
    axeLibScript.onload = () => {
        console.log("✅ axe.min.js erfolgreich geladen")
    }

    axeTestScript.onload = () => {
        console.log("✅ axe-core-test.js erfolgreich geladen")
    }

    // Scripts vor dem Ende des Body einfügen
    // Erst die Library, dann das Test-Script
    document.body.appendChild(axeLibScript)

    // Test-Script erst laden, wenn axe Library geladen ist
    axeLibScript.addEventListener("load", () => {
        document.body.appendChild(axeTestScript)
    })

    return {
        axeLib: axeLibScript,
        axeTest: axeTestScript,
    }
}

function createAxeCoreUI() {
    // Floating Action Button (FAB) erstellen
    const fab = document.createElement("button")
    fab.id = "axe-fab"
    fab.type = "button"
    fab.className = "axe-fab"
    fab.setAttribute("aria-label", "WCAG Test für diese Seite")
    fab.title = "WCAG Test für diese Seite"
    fab.innerHTML = `
        <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
        </svg>
    `

    // Overlay Container erstellen
    const overlay = document.createElement("div")
    overlay.id = "axe-overlay"
    overlay.className = "axe-overlay"
    overlay.setAttribute("role", "dialog")
    overlay.setAttribute("aria-modal", "true")
    overlay.setAttribute("aria-labelledby", "axe-dialog-title")
    overlay.style.display = "none"

    // Overlay Content
    overlay.innerHTML = `
        <div class="axe-dialog">
            <header class="axe-dialog-header">
                <h2 id="axe-dialog-title">WCAG Accessibility Test</h2>
                <button type="button" class="axe-close-btn" aria-label="Fenster schließen">
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                    </svg>
                </button>
            </header>
            
            <div class="axe-dialog-content">
                <div class="axe-test-buttons">
                    <button type="button" class="axe-test-btn" onclick="runWCAGTest()">
                        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                        </svg>
                        WCAG Test starten
                    </button>
                    <button type="button" class="axe-test-btn" onclick="runQuickTest()">
                        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                            <path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9z"/>
                        </svg>
                        Quick Test
                    </button>
                    <button type="button" class="axe-test-btn" onclick="runFullTest()">
                        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                        </svg>
                        Vollständiger Test
                    </button>
                </div>

                <!-- Testergebnisse -->
                <section id="results" class="results-panel" aria-labelledby="ergebnisse-heading" style="display: none;">
                    <h3 id="ergebnisse-heading">Test-Ergebnisse</h3>
                    <div id="status-bar" class="status-bar" role="status" aria-live="polite"></div>
                    <div id="violations-list"></div>
                </section>
            </div>
            
            <footer class="axe-dialog-footer">
                <button type="button" class="axe-close-btn-text" onclick="closeAxeOverlay()">
                    Fenster schließen
                </button>
            </footer>
        </div>
    `

    // Event-Listener für FAB
    fab.addEventListener("click", openAxeOverlay)

    // Event-Listener für Overlay schließen
    const closeBtn = overlay.querySelector(".axe-close-btn")
    const closeTextBtn = overlay.querySelector(".axe-close-btn-text")

    closeBtn.addEventListener("click", closeAxeOverlay)
    closeTextBtn.addEventListener("click", closeAxeOverlay)

    // Overlay schließen bei Klick außerhalb
    overlay.addEventListener("click", (e) => {
        if (e.target === overlay) {
            closeAxeOverlay()
        }
    })

    // ESC-Taste Handler
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && overlay.style.display !== "none") {
            closeAxeOverlay()
        }
    })

    // Elemente zum DOM hinzufügen
    document.body.appendChild(fab)
    document.body.appendChild(overlay)

    console.log("✅ Axe Core UI erstellt (FAB + Overlay)")

    return { fab, overlay }
}

function openAxeOverlay() {
    const overlay = document.getElementById("axe-overlay")
    overlay.style.display = "flex"

    // Focus auf ersten Button setzen
    const firstBtn = overlay.querySelector(".axe-test-btn")
    if (firstBtn) firstBtn.focus()

    // Scroll-Lock für Body
    document.body.style.overflow = "hidden"
}

function closeAxeOverlay() {
    const overlay = document.getElementById("axe-overlay")
    overlay.style.display = "none"

    // Ergebnisse ausblenden
    const results = document.getElementById("results")
    if (results) results.style.display = "none"

    // Highlights entfernen
    clearHighlights()

    // Scroll-Lock aufheben
    document.body.style.overflow = ""

    // Focus zurück auf FAB
    const fab = document.getElementById("axe-fab")
    if (fab) fab.focus()
}

function getRelativePathToRoot() {
    // Get current path
    const path = window.location.pathname
    const onlineProjectRoot = "/accessibility-workshop/"
    let pathAfterRoot = ""

    if (path.includes(onlineProjectRoot)) {
        pathAfterRoot = path.substring(
            path.indexOf(onlineProjectRoot) + onlineProjectRoot.length
        )
    } else {
        pathAfterRoot = path
    }

    const segments = pathAfterRoot.split("/").filter(Boolean)
    const dirCount = segments.length - (pathAfterRoot.endsWith("/") ? 0 : 1)

    return dirCount > 0 ? "../".repeat(dirCount) : "./"
}

function createMainNavigation() {
    const nav = document.createElement("nav")
    const ul = document.createElement("ul")

    nav.setAttribute("aria-label", "Hauptnavigation")

    const navigation = [
        {
            file: "index.html",
            text: "Startseite",
        },
        {
            file: "treemap/v3/index.html",
            text: "Kriterien (v3)",
        },

        {
            file: "wcag-test.html",
            text: "WCAG Test",
        },
        {
            file: "checklists.html",
            text: "Checklisten",
        },
        {
            file: "semantic.html",
            text: "Semantik",
        },
        { file: "aria.html", text: "ARIA" },
        { file: "typography.html", text: "Typografie" },
        { file: "contrast.html", text: "Kontrast" },
        { file: "color.html", text: "Farbe" },
        { file: "keyboard.html", text: "Tastatur" },
        {
            file: "screenreader-simulation/",
            text: "Screenreader",
        },
        {
            file: "writing.html",
            text: "verständliches Texten",
        },
        {
            file: "non-text-content.html",
            text: "Nicht-Text-Inhalte",
        },
        {
            file: "user-settings.html",
            text: "Benutzereinstellungen",
        },
        {
            file: "text-level/index.html",
            text: "Text-Level",
        },
        {
            file: "components/accordion.html",
            text: "Komponenten",
        },
    ]

    nav.id = "main-navigation"

    const relativePathToRoot = getRelativePathToRoot()

    navigation.forEach((entry) => {
        const li = document.createElement("li")
        const a = document.createElement("a")

        // Add relative path to root for href
        a.href = relativePathToRoot + entry.file
        a.textContent = entry.text

        li.appendChild(a)
        ul.appendChild(li)
    })

    nav.appendChild(ul)
    document.body.prepend(nav)
}

function createMainNavigationWithSubmenu() {
    const nav = document.createElement("nav")
    nav.id = "main-navigation"
    nav.setAttribute("aria-label", "Hauptnavigation")

    const ul = document.createElement("ul")
    ul.classList.add("main-nav-list")

    const relativePathToRoot = getRelativePathToRoot()

    const navigation = [
        { file: "index.html", text: "Startseite" },
        {
            file: "wcag/index.html",
            text: "WCAG",
            children: [
                { file: "treemap/v3/index.html", text: "Kriterien (v3)" },
                { file: "wcag-test.html", text: "WCAG Test" },
                { file: "checklists.html", text: "Checklisten" },
            ],
        },
        {
            file: "techniques/index.html",
            text: "Techniken",
            children: [
                { file: "techniques/semantic.html", text: "Semantik" },
                { file: "techniques/aria.html", text: "ARIA" },
                { file: "techniques/keyboard.html", text: "Tastatur" },
                {
                    file: "screenreader-simulation/",
                    text: "Screenreader",
                },
                {
                    file: "techniques/user-settings.html",
                    text: "Benutzereinstellungen",
                },
            ],
        },
        {
            file: "design/index.html",
            text: "Gestaltung",
            children: [
                { file: "design/typography.html", text: "Typografie" },
                { file: "design/contrast.html", text: "Kontrast" },
                { file: "design/color.html", text: "Farbe" },
            ],
        },
        {
            file: "writing.html",
            text: "Redaktion",
            children: [
                {
                    file: "writing.html",
                    text: "verständliches Texten",
                },
                {
                    file: "content/language-level.html",
                    text: "Sprachlevel",
                },
                {
                    file: "content/non-text-content.html",
                    text: "Nicht-Text-Inhalte",
                },
                {
                    file: "text-level/index.html",
                    text: "Text-Level",
                },
                {
                    file: "text-level/payment.html",
                    text: "Mit Kreditkarte bezahlen",
                },
                {
                    file: "text-level/ticket.html",
                    text: "Fahrkarte kaufen",
                },
            ],
        },
        {
            file: "components/index.html",
            text: "Komponenten",
            children: [
                { file: "components/accordion.html", text: "Accordion" },
                { file: "components/dialog.html", text: "Dialog" },
                { file: "components/flyout.html", text: "Flyout" },
                {
                    file: "components/jquery-datepicker-example.html",
                    text: "jQuery Datepicker",
                },
                {
                    file: "components/form-with-dependencies.html",
                    text: "Formular mit Abhängigkeiten",
                },
                {
                    file: "components/barriere-melden.html",
                    text: "Barriere melden",
                },
                {
                    file: "components/complex-components.html",
                    text: "komplexe UI-Komponenten",
                },
                {
                    file: "components/error-with-server.html",
                    text: "Fehlermeldung nach Serverauswertung",
                },
            ],
        },
        {
            file: "testing/index.html",
            text: "Testen",
            children: [
                {
                    file: "testing/manual-testing.html",
                    text: "Manuelles Testen",
                },
                {
                    file: "testing/browser-extensions.html",
                    text: "Browser-Erweiterungen",
                },
                {
                    file: "testing/automated-testing.html",
                    text: "Testautomatisierung",
                },
            ],
        },
    ]

    navigation.forEach((entry) => {
        const li = document.createElement("li")
        li.classList.add("main-nav-item")

        const link = document.createElement("a")
        link.href = relativePathToRoot + entry.file
        link.textContent = entry.text
        li.appendChild(link)

        if (Array.isArray(entry.children) && entry.children.length > 0) {
            li.classList.add("has-submenu")
            li.setAttribute("aria-haspopup", "true")
            li.setAttribute("aria-expanded", "false")

            const toggleBtn = document.createElement("button")
            toggleBtn.type = "button"
            toggleBtn.classList.add("submenu-toggle")
            toggleBtn.setAttribute("aria-expanded", "false")
            toggleBtn.innerHTML = `<span class="sr-only">${entry.text} Untermenü</span>`

            const submenu = document.createElement("ul")
            submenu.classList.add("submenu")
            submenu.hidden = true

            entry.children.forEach((child) => {
                const childLi = document.createElement("li")
                const childLink = document.createElement("a")
                childLink.href = relativePathToRoot + child.file
                childLink.textContent = child.text
                childLi.appendChild(childLink)
                submenu.appendChild(childLi)
            })

            li.appendChild(toggleBtn)
            li.appendChild(submenu)

            const openSubmenu = () => {
                toggleBtn.setAttribute("aria-expanded", "true")
                li.setAttribute("aria-expanded", "true")
                submenu.hidden = false
            }

            const closeSubmenu = () => {
                toggleBtn.setAttribute("aria-expanded", "false")
                li.setAttribute("aria-expanded", "false")
                submenu.hidden = true
            }

            let hoverTimeout = null

            toggleBtn.addEventListener("click", (event) => {
                event.preventDefault()
                const expanded =
                    toggleBtn.getAttribute("aria-expanded") === "true"
                if (expanded) {
                    closeSubmenu()
                } else {
                    openSubmenu()
                }
            })

            li.addEventListener("mouseenter", () => {
                clearTimeout(hoverTimeout)
                openSubmenu()
            })

            li.addEventListener("mouseleave", () => {
                hoverTimeout = setTimeout(() => closeSubmenu(), 120)
            })

            li.addEventListener("focusin", () => {
                clearTimeout(hoverTimeout)
                openSubmenu()
            })

            li.addEventListener("focusout", (event) => {
                hoverTimeout = setTimeout(() => {
                    if (!li.contains(document.activeElement)) {
                        closeSubmenu()
                    }
                }, 120)
            })
        }

        ul.appendChild(li)
    })

    nav.appendChild(ul)
    document.body.prepend(nav)
}

function createChatbotAssistButton() {
    /*
    <script>
        window.chatbotConfig = {
            chatbotId: "37632ee5-1dd3-4152-b364-6746f8dc8953", 
            chatbotServer: "https://hybridai.one"
        };
    </script>
    <script src="https://hybridai.one/hai_embed.js?chatbotId=37632ee5-1dd3-4152-b364-6746f8dc8953"></script>  
*/
    const scriptConfig = document.createElement("script")
    scriptConfig.type = "text/javascript"
    scriptConfig.innerHTML = `
        window.chatbotConfig = {
            chatbotId: "37632ee5-1dd3-4152-b364-6746f8dc8953", 
            chatbotServer: "https://hybridai.one"
        };
    `

    const scriptEmbed = document.createElement("script")
    scriptEmbed.type = "text/javascript"
    scriptEmbed.src =
        "https://hybridai.one/hai_embed.js?chatbotId=37632ee5-1dd3-4152-b364-6746f8dc8953"

    document.body.appendChild(scriptConfig)
    document.body.appendChild(scriptEmbed)
}

function createFooter() {
    const footer = document.createElement("footer")
    const address = document.createElement("address")
    const time = document.createElement("time")
    const nav = document.createElement("nav")
    const a1 = document.createElement("a")
    const a2 = document.createElement("a")

    time.dateTime = new Date().getFullYear()
    time.textContent = `2003 - ${time.dateTime}`
    address.innerHTML = " "
    address.appendChild(time)
    address.append(" Michael Reichart")

    const relativePathToRoot = getRelativePathToRoot()

    a1.href = relativePathToRoot + "index.html"
    a1.textContent = "Startseite    "
    nav.appendChild(a1)

    a2.href = relativePathToRoot + "imprint.html"
    a2.textContent = "Impressum    "
    nav.appendChild(a2)

    footer.id = "footer"
    footer.appendChild(address)
    footer.appendChild(nav)
    document.body.appendChild(footer)
}

function createBrand() {
    const brand = document.createElement("p")
    brand.classList.add("brand")
    brand.textContent = "accessibility workshop"

    document.querySelector("header").prepend(brand)
}

function setTabindizes() {
    const all = document.querySelectorAll("h1, h2")
    all.forEach((el) => {
        el.tabIndex = 0
    })
}

function createAccessibilitySettingsButton() {
    if (document.getElementById("accessibility-settings-btn")) return

    const relativePathToRoot = getRelativePathToRoot()
    const btn = document.createElement("button")
    btn.id = "accessibility-settings-btn"
    btn.className = "accessibility-settings-btn"
    btn.type = "button"
    btn.setAttribute("aria-label", "Barrierefreiheitseinstellungen öffnen")
    btn.title = "Barrierefreiheitseinstellungen"
    btn.innerHTML = `
        <img src="${relativePathToRoot}assets/figures/icons/accessibility_new.svg" alt="" width="28" height="28" />
    `
    btn.addEventListener("click", () => {
        alert("Barrierefreiheitseinstellungen öffnen (Demo)")
    })

    // Button möglichst weit oben einfügen (z.B. in die Navigation oder an den Body)
    document.body.appendChild(btn)
}

// AUFRUF
document.addEventListener("DOMContentLoaded", () => {
    createMainNavigationWithSubmenu()
    // createAccessibilitySettingsButton()
    if (typeof createDeveloperButton === "function") createDeveloperButton()
    if (typeof createThemeModeButton === "function") createThemeModeButton()
    if (typeof createBrand === "function") createBrand()
    if (typeof createFooter === "function") createFooter()
    if (typeof createSkipLinks === "function") createSkipLinks()
    if (typeof setTabindizes === "function") setTabindizes()
    // if (typeof createAxeCoreTestScripts === "function")
    //     createAxeCoreTestScripts()
    // if (typeof createAxeCoreUI === "function") createAxeCoreUI()
    document.querySelector("html").setAttribute("lang", "de")
    createChatbotAssistButton()
})
