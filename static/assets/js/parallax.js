// Schreibe eine Tastatursteuerung, die es ermöglicht, mit den Pfeiltasten durch die Sektionen zu navigieren. Der PArallax-Effekt soll dabei erhalten bleiben. Die Sektionen sollen dabei nacheinander durchlaufen werden. Wenn die letzte Sektion erreicht ist, soll wieder zur ersten Sektion gesprungen werden.

// 1. Finde alle Sektionen
const sections = document.querySelectorAll("section")

// 2. Setze den Index auf 0
let index = 0

// 3. Schreibe eine Funktion, die die Sektionen durchläuft

function navigateSections(event) {
    // 4. Wenn die Pfeiltaste nach unten gedrückt wird
    if (event.key === "ArrowDown") {
        // 5. Wenn der Index kleiner als die Anzahl der Sektionen ist
        if (index < sections.length - 1) {
            // 6. Erhöhe den Index um 1
            index++
        } else {
            // 7. Setze den Index auf 0
            index = 0
        }
    }

    // 8. Wenn die Pfeiltaste nach oben gedrückt wird
    if (event.key === "ArrowUp") {
        // 9. Wenn der Index größer als 0 ist
        if (index > 0) {
            // 10. Verringere den Index um 1
            index--
        } else {
            // 11. Setze den Index auf die Anzahl der Sektionen minus 1
            index = sections.length - 1
        }
    }

    // 12. Berechne den Wert für das Transform-Attribut
    const transformValue = index * -400

    // 13. Setze das Transform-Attribut für alle Sektionen
    sections.forEach((section) => {
        section.style.transform = `translateY(${transformValue}px)`
    })
}

// 14. Füge einen Event-Listener für das keydown-Event hinzu
document.addEventListener("keydown", navigateSections)

// 15. Füge einen Event-Listener für das resize-Event hinzu
window.addEventListener("resize", () => {
    // 16. Berechne den Wert für das Transform-Attribut
    const transformValue = index * -100

    // 17. Setze das Transform-Attribut für alle Sektionen
    sections.forEach((section) => {
        section.style.transform = `translateY(${transformValue}vh)`
    })
})

// 18. Füge einen Event-Listener für das load-Event hinzu
window.addEventListener("load", () => {
    // 19. Berechne den Wert für das Transform-Attribut
    const transformValue = index * -100

    // 20. Setze das Transform-Attribut für alle Sektionen
    sections.forEach((section) => {
        section.style.transform = `translateY(${transformValue}vh)`
    })
})

// 21. Füge einen Event-Listener für das resize-Event hinzu
window.addEventListener("resize", () => {
    // 22. Berechne den Wert für das Transform-Attribut
    const transformValue = index * -100

    // 23. Setze das Transform-Attribut für alle Sektionen
    sections.forEach((section) => {
        section.style.transform = `translateY(${transformValue}vh)`
    })
})
