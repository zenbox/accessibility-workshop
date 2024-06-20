// Du bist JS-Entwickler. Schreibe eine Funktion, die aus allen Einträgen in einem JSON-Objekt eine Navigation erstellt. Das Objekt enthäkt den Dateiname und einen Linkttext pro Eintrag. Die Navigation soll als `ol`-Element in einer `nav`-Gruppe im `footer`der Seite integriert werden. Das Skript muss als Client-Skript im Browser laufen.

// JSON-Objekt
const navigation = [
    { file: "index.html", text: "Semantik" },
    { file: "color-and-contrast.html", text: "Farbe und Kontrast" },
    { file: "keyboard-controls.html", text: "Tastatur-Steuerung" },
    { file: "typography.html", text: "Schrift und Satz" },
    { file: "form.html", text: "Formular" },
    { file: "navigation.html", text: "Navigation" },
    { file: "non-text-content.html", text: "Bild und Grafik" },
    { file: "parallax.html", text: "Bewegung" },
    { file: "pattern.html", text: "Pattern" },
]

// Funktion
function createNavigation() {
    const nav = document.createElement("nav")
    const ol = document.createElement("ol")

    nav.id = "links"

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

    const skipLinks = document.createElement("nav")
    skipLinks.id = "skip-links"
    const links = [
        { href: "#main-content", text: "zum Inhalt" },
        { href: "#main-navigation", text: "zur Hauptnavigation" },
        { href: "#main-search", text: "zur Suche" },
        { href: "#header", text: "zur Kopf-Sektion" },
        { href: "#footer", text: "zur Fuß-Sektion" },
    ]

    links.forEach((link) => {
        const a = document.createElement("a")
        a.href = link.href
        a.textContent = link.text

        skipLinks.appendChild(a)
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

// Aufruf
document.addEventListener("DOMContentLoaded", createNavigation)
