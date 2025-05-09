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

// Helper function to calculate relative path to root
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

    const navigation = [
        {
            file: "index.html",
            text: "Startseite",
        },
        {
            file: "treemap/v2/index.html",
            text: "Kriterien (v2)",
        },

        {
            file: "wcag-test.html",
            text: "WCAG Test",
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
            file: "non-text-content.html",
            text: "Nicht-Text",
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

function createSkipLinks() {
    // - - - - - - - - - -
    // Build a skip link navigation
    // - - - - - - - - - -
    const skipLinks = document.createElement("nav")
    skipLinks.id = "skip-links"
    const links = [
        { selector: "body > main", href: "#main-content", text: "zum Inhalt" },
        {
            selector: "body > nav",
            href: "#main-navigation",
            text: "zur Hauptnavigation",
        },
        {
            selector: "body [type=search]",
            href: "#main-search",
            text: "zur Suche",
        },
        {
            selector: "body > header",
            href: "#header",
            text: "zur Kopf-Sektion",
        },
        { selector: "body > footer", href: "#footer", text: "zur Fuß-Sektion" },
    ]

    links.forEach((link) => {
        let el = document.querySelector(link.selector)
        if (el) el.id = link.href.substr(1, link.href.length)
        if (document.querySelector(`${link.href}`)) {
            const a = document.createElement("a")
            a.href = link.href
            a.textContent = link.text

            skipLinks.appendChild(a)
        }
    })

    skipLinks.addEventListener("keydown", (event) => {
        console.log(event.key)
        if (event.key === "Escape") {
            event.preventDefault()
            event.target.blur()
        }
    })
    document.body.prepend(skipLinks)
}

function createAccessibilitySettingsButton() {
    const accessibilityButton = document.createElement("button")
    accessibilityButton.classList.add("btn-accessibility-settings")
    accessibilityButton.title = "Barrierefreiheitseinstellungen"
    let accessibilityButtonState

    const html = document.querySelector("html")

    // Tooltip erstellen
    const tooltip = new Tooltip({
        className: "accessibility-settings-tooltip",
        maxWidth: "250px",
        additionalStyles: {
            transition: "opacity 0.2s ease-in-out",
        },
    })

    // Tooltip Text Funktion
    const getTooltipText = "Zu den Barrierefreiheitseinstellungen"

    // Tooltip an Button anhängen
    tooltip.attachTo(accessibilityButton, getTooltipText)

    const relativePathToRoot = getRelativePathToRoot()

    accessibilityButton.addEventListener("click", () => {
        window.location.href = relativePathToRoot + "user-settings.html"
    })

    const li = document.createElement("li")
    li.appendChild(accessibilityButton)
    document.querySelector("#main-navigation ul").prepend(li)
}

function createDeveloperButton() {
    const developerButton = document.createElement("button")
    developerButton.classList.add("btn-developer")
    developerButton.title = "Entwicklermodus anschalten"
    let developerButtonState

    // Tooltip erstellen
    const tooltip = new Tooltip({
        className: "developer-tooltip",
        maxWidth: "300px",
    })

    // Tooltip Text Funktion
    const getTooltipText = () =>
        developerButtonState
            ? "Im Entwicklermodus werden  Elemente aus dem HTML angezeigt, die für Barrierefreiheit relevant sind."
            : "Aktivieren Sie den Entwicklermodus um HTML-Elemente zu sehen, die für Barrierefreiheit relevant sind."

    if (localStorage.getItem("developer") === "on") {
        developerButtonState = true
        document.body.classList.add("developer")
        developerButton.classList.add("on")
        developerButton.title = "Entwicklermodus ausschalten"
    } else {
        developerButtonState = false
        developerButton.classList.add("off")
        developerButton.title = "Entwicklermodus anschalten"
    }

    developerButton.tabIndex = -1

    // Tooltip an Button anhängen
    tooltip.attachTo(developerButton, getTooltipText)

    developerButton.addEventListener("click", () => {
        developerButtonState = !developerButtonState
        if (developerButtonState) {
            document.body.classList.add("developer")
            developerButton.classList.remove("off")
            developerButton.classList.add("on")
            localStorage.setItem("developer", "on")
            developerButton.title = "Entwicklermodus ausschalten"
        } else {
            document.body.classList.remove("developer")
            developerButton.classList.remove("on")
            developerButton.classList.add("off")
            localStorage.setItem("developer", "off")
            developerButton.title = "Entwicklermodus anschalten"
        }
    })

    const li = document.createElement("li")
    li.appendChild(developerButton)
    document.querySelector("#main-navigation ul").prepend(li)
}

function createDarkModeButton() {
    const darkModeButton = document.createElement("button")
    darkModeButton.title = "Dark Mode anschalten"
    darkModeButton.classList.add("btn-dark-mode")
    let darkModeButtonState

    const html = document.querySelector("html")

    // Tooltip erstellen
    const tooltip = new Tooltip({
        className: "dark-mode-tooltip",
        maxWidth: "250px",
        additionalStyles: {
            transition: "opacity 0.2s ease-in-out",
        },
    })

    // Tooltip Text Funktion
    const getTooltipText = () =>
        darkModeButtonState
            ? "Dunkles Farbschema deaktivieren und zum hellen Design zurückkehren"
            : "Dunkles Farbschema aktivieren für bessere Lesbarkeit bei wenig Umgebungslicht"

    if (localStorage.getItem("darkMode") === "on") {
        darkModeButtonState = true
        html.classList.add("dark")
        darkModeButton.classList.add("on")
        darkModeButton.title = "Dark Mode ausschalten"
    } else {
        darkModeButtonState = false
        darkModeButton.classList.add("off")
        darkModeButton.title = "Dark Mode anschalten"
    }

    darkModeButton.tabIndex = -1

    // Tooltip an Button anhängen
    tooltip.attachTo(darkModeButton, getTooltipText)

    darkModeButton.addEventListener("click", () => {
        darkModeButtonState = !darkModeButtonState
        if (darkModeButtonState) {
            html.classList.add("dark")
            darkModeButton.classList.remove("off")
            darkModeButton.classList.add("on")
            localStorage.setItem("darkMode", "on")
            darkModeButton.title = "Dark Mode ausschalten"
        } else {
            html.classList.remove("dark")
            darkModeButton.classList.remove("on")
            darkModeButton.classList.add("off")
            localStorage.setItem("darkMode", "off")
            darkModeButton.title = "Dark Mode anschalten"
        }
    })

    const li = document.createElement("li")
    li.appendChild(darkModeButton)
    document.querySelector("#main-navigation ul").prepend(li)
}

function createThemeModeButton() {
    const themeButton = document.createElement("button")
    themeButton.classList.add("btn-theme-mode")
    let currentMode = "light" // Mögliche Werte: "light", "dark", "high-contrast"

    const html = document.querySelector("html")

    // Tooltip erstellen
    const tooltip = new Tooltip({
        className: "theme-mode-tooltip",
        maxWidth: "250px",
        additionalStyles: {
            transition: "opacity 0.2s ease-in-out",
        },
    })

    // Hilfsfunktionen für State Management
    function updateButtonState(mode) {
        // Alle Klassen entfernen
        themeButton.classList.remove("light", "dark", "high-contrast")
        html.classList.remove("light", "dark", "high-contrast")

        // Neue Klasse hinzufügen
        themeButton.classList.add(mode)
        html.classList.add(mode)

        // Button Titel aktualisieren
        const titles = {
            "light": "Dark Mode aktivieren",
            "dark": "High Contrast Mode aktivieren",
            "high-contrast": "Light Mode aktivieren",
        }
        themeButton.title = titles[mode]

        // Mode im localStorage speichern
        localStorage.setItem("themeMode", mode)

        // Aktuellen Modus aktualisieren
        currentMode = mode
    }

    // Tooltip Text Funktion
    const getTooltipText = () => {
        const tooltips = {
            "light":
                "Dunkles Farbschema aktivieren für bessere Lesbarkeit bei wenig Umgebungslicht",
            "dark": "Hochkontrast-Modus aktivieren für maximale Lesbarkeit und Barrierefreiheit",
            "high-contrast": "Zurück zum hellen Standarddesign wechseln",
        }
        return tooltips[currentMode]
    }

    // Initialen Zustand setzen
    const savedMode = localStorage.getItem("themeMode")
    if (savedMode && ["light", "dark", "high-contrast"].includes(savedMode)) {
        updateButtonState(savedMode)
    } else {
        updateButtonState("light")
    }

    themeButton.tabIndex = -1

    // Tooltip an Button anhängen
    tooltip.attachTo(themeButton, getTooltipText)

    // Click Handler
    themeButton.addEventListener("click", () => {
        const modeSequence = ["light", "dark", "high-contrast"]
        const currentIndex = modeSequence.indexOf(currentMode)
        const nextMode = modeSequence[(currentIndex + 1) % modeSequence.length]
        updateButtonState(nextMode)
    })

    const li = document.createElement("li")
    li.appendChild(themeButton)
    document.querySelector("#main-navigation ul").prepend(li)
}

// - - - - - - - - - - -
// FOOTER
// - - - - - - - - - - -
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

// - - - - - - - - - -
// BRAND IN HEADER
// - - - - - - - - - -
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

// AUFRUF
// - - - - - - - - - -
document.addEventListener("DOMContentLoaded", () => {
    createMainNavigation()
    createAccessibilitySettingsButton()
    createDeveloperButton()
    // createDarkModeButton()
    createThemeModeButton()
    createBrand()
    createFooter()
    createSkipLinks()
    setTabindizes()

    document.querySelector("html").setAttribute("lang", "de")
})
