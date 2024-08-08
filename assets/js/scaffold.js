// Du bist JS-Entwickler. Schreibe eine Funktion, die aus allen Einträgen in einem JSON-Objekt eine Navigation erstellt. Das Objekt enthäkt den Dateiname und einen Linkttext pro Eintrag. Die Navigation soll als `ol`-Element in einer `nav`-Gruppe im `footer`der Seite integriert werden. Das Skript muss als Client-Skript im Browser laufen.

// Funktion
function createNavigation() {
    const nav = document.createElement("nav")
    const ol = document.createElement("ol")

    const navigation = [
        { file: "index.html", text: "Semantik" },
        { file: "typography.html", text: "Typografie" },
        { file: "contrast.html", text: "Kontrast" },
        { file: "keyboard.html", text: "Tastatur" },
        // { file: "form.html", text: "Formular" },
        { file: "navigation.html", text: "Navigation" },
        { file: "non-text-content.html", text: "Bild und Grafik" },
        { file: "user-settings.html", text: "Benutzereinstellungen" },
        // { file: "pattern.html", text: "Pattern" },
    ]

    nav.id = "main-navigation"

    navigation.forEach((entry) => {
        const li = document.createElement("li")
        const a = document.createElement("a")

        a.href = entry.file
        a.textContent = entry.text

        li.appendChild(a)
        ol.appendChild(li)
    })

    nav.appendChild(ol)
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

function createDeveloperButton() {
    const developerButton = document.createElement("button")
    let developerButtonState

    if (localStorage.getItem("developer") === "on") {
        developerButtonState = true
        document.body.classList.add("developer")
        developerButton.classList.add("on")
    } else {
        developerButtonState = false
        developerButton.classList.add("off")
    }

    developerButton.tabIndex = -1

    developerButton.addEventListener("click", () => {
        developerButtonState = !developerButtonState
        if (developerButtonState) {
            document.body.classList.add("developer")
            developerButton.classList.remove("off")
            developerButton.classList.add("on")
            localStorage.setItem("developer", "on")
        } else {
            document.body.classList.remove("developer")
            developerButton.classList.remove("on")
            developerButton.classList.add("off")
            localStorage.setItem("developer", "off")
        }
    })
    document
        .querySelector("#main-navigation ol")
        .prepend(document.createElement("li"))
    document
        .querySelector("#main-navigation ol li:first-child")
        .prepend(developerButton)
}

// - - - - - - - - - - -
// FOOTER
// - - - - - - - - - - -
function createFooter() {
    const footer = document.createElement("footer")
    const address = document.createElement("address")
    const time = document.createElement("time")
    const nav = document.createElement("nav")
    const a = document.createElement("a")

    time.dateTime = new Date().getFullYear()
    time.textContent = `2003 - ${time.dateTime}`
    address.innerHTML = " "
    address.appendChild(time)
    address.append(" Michael Reichart")

    a.href = "imprint.html"
    a.textContent = "Impressum und Kontakt"
    nav.appendChild(a)

    footer.id="footer"
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


// - - - - - - - - - -
// Aufruf
// - - - - - - - - - -
document.addEventListener("DOMContentLoaded", () => {
    createNavigation()
    createDeveloperButton()
    createBrand()
    createFooter()
    createSkipLinks()

    document.querySelector("html").setAttribute("lang", "de")
})
