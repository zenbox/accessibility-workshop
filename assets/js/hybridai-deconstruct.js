window.addEventListener("DOMContentLoaded", () => {
    console.log("DOM geladen, prüfe auf HybridAI...")

    if (checkForHybridAI()) {
        // Element bereits vorhanden
        rebuildHybridAI()
        return
    }

    // Falls nicht vorhanden: Observer für dynamisch geladene Elemente
    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            // Prüfe hinzugefügte Nodes
            for (const node of mutation.addedNodes) {
                if (node.nodeType === 1) {
                    // Element Node
                    // Prüfe ob es selbst die Klasse hat
                    if (
                        node.classList &&
                        node.classList.contains("hybridai-widget")
                    ) {
                        console.warn(
                            "H A I - HybridAI Widget dynamisch geladen!"
                        )
                        console.log("Element:", node)
                        rebuildHybridAI(node) // Rebuild nach dynamischem Laden
                        observer.disconnect() // Observer stoppen
                        return
                    }

                    // Prüfe ob es das Element enthält
                    const hai =
                        node.querySelector &&
                        node.querySelector(".hybridai-widget")
                    if (hai) {
                        console.warn(
                            "H A I - HybridAI Widget dynamisch geladen!"
                        )
                        console.log("Element:", hai)
                        rebuildHybridAI(hai) // Rebuild nach dynamischem Laden
                        observer.disconnect() // Observer stoppen
                        return
                    }
                }
            }
        }
    })

    // Observer starten
    observer.observe(document.body, {
        childList: true,
        subtree: true,
    })

    console.log("Observer wartet auf HybridAI Widget...")
})

// Zusätzlich: Bei vollständigem Page-Load prüfen (falls Script sehr spät lädt)
window.addEventListener("load", () => {
    const hai = document.querySelector(".hybridai-widget")
    if (!hai) {
        console.log(
            "Page vollständig geladen, aber kein HybridAI Widget gefunden"
        )
    } else {
        rebuildHybridAI(hai)
    }
})

// Sofort prüfen ob Element bereits existiert
function checkForHybridAI() {
    const hai = document.querySelector(".hybridai-widget")
    if (hai) {
        console.warn("H A I - HybridAI Widget gefunden!")
        console.log("Element:", hai)
        return true
    }
    return false
}

/**
 * Entfernt das style-Attribut vom HybridAI Widget und setzt neues Outline
 * @param {HTMLElement} element - Optional: Spezifisches Element, sonst wird gesucht
 */
function rebuildHybridAI(element) {
    // Element finden falls nicht übergeben
    const hai = element || document.querySelector(".hybridai-widget")
    const haiTitleBar = element.querySelector(".hybridai-title-bar")

    if (!hai) {
        console.warn("rebuildHybridAI: Kein .hybridai-widget Element gefunden")
        return
    }

    console.log("Rebuilding HybridAI Widget...")

    // Style-Attribut entfernen
    // hai.removeAttribute("style")
    /*
style="width: 400px; height: 500px; display: block; outline: red solid 2px; transition: none; left: 725px; top: 497px;"
    */

    hai.style.outline = "2px solid red"
    hai.style.width = "400px"
    hai.style.height = "500px"
    hai.style.display = "block"
    //hai.style.left = "725px"
    //hai.style.top = "500px"

    haiTitleBar.style.outline = "2px solid red"
    haiTitleBar.style.backgroundColor = "red"

    return hai
}
