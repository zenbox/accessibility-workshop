// Du bist JS-Entwickler. Schreibe eine Funktion, die aus allen Einträgen in einem JSON-Objekt eine Navigation erstellt. Das Objekt enthäkt den Dateiname und einen Linkttext pro Eintrag. Die Navigation soll als `ol`-Element in einer `nav`-Gruppe im `footer`der Seite integriert werden. Das Skript muss als Client-Skript im Browser laufen.

// JSON-Objekt
const navigation = [
    { file: "index.html", text: "Einführung" },
    { file: "color-and-contrast.html", text: "Farbe und Kontrast" },
    { file: "keyboard-controls.html", text: "Tastatur-Steuerung" },
    { file: "typography.html", text: "Schrift und Satz" },
    { file: "navigation.html", text: "Navigation" },
    { file: "non-text-content.html", text: "Bild und Grafik" },
    { file: "parallax.html", text: "Bewegung" },
]

// Funktion
function createNavigation() {
    const nav = document.createElement("nav")
    const ol = document.createElement("ol")

    nav.id = "skip-link"

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

// Aufruf
document.addEventListener("DOMContentLoaded", createNavigation)
