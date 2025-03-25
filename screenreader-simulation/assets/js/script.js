import ScreenreaderSimulation from "./ScreenreaderSimulation.js"

// ScreenreaderSimulation.js
document.addEventListener("DOMContentLoaded", () => {
    const screenreaderSimulation = new ScreenreaderSimulation()
})

// Diese Funktion zu script.js hinzufügen oder in eine separate Datei auslagern
// und per <script> Tag einbinden

document.addEventListener("DOMContentLoaded", () => {
    // Formular-Feedback initialisieren
    initFormFeedback()
})

function initFormFeedback() {
    const form = document.getElementById("feedback-form")
    const feedbackElement = document.getElementById("form-feedback")

    if (!form || !feedbackElement) return

    // Elemente mit Validierung auswählen
    const nameInput = document.getElementById("name")
    const emailInput = document.getElementById("email")
    const categorySelect = document.getElementById("category")

    // Validierungsregeln und Fehlermeldungen
    const validations = {
        name: {
            validate: (value) => value.length >= 3,
            errorMessage: "Name muss mindestens 3 Zeichen enthalten",
            successMessage: "Name ist gültig",
        },
        email: {
            validate: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
            errorMessage: "Bitte geben Sie eine gültige E-Mail-Adresse ein",
            successMessage: "E-Mail-Adresse ist gültig",
        },
        category: {
            validate: (value) => value !== "",
            errorMessage: "Bitte wählen Sie eine Kategorie aus",
            successMessage: "Kategorie ausgewählt",
        },
    }

    // Event-Listener für Eingabefelder
    nameInput.addEventListener("input", () => {
        validateField(nameInput, validations.name)
    })

    emailInput.addEventListener("input", () => {
        validateField(emailInput, validations.email)
    })

    categorySelect.addEventListener("change", () => {
        validateField(categorySelect, validations.category)
    })

    // Beim Fokussieren eines Feldes die Hinweise anzeigen
    nameInput.addEventListener("focus", () => {
        updateFeedback("Bitte geben Sie Ihren Namen ein (mindestens 3 Zeichen)")
    })

    emailInput.addEventListener("focus", () => {
        updateFeedback("Bitte geben Sie Ihre E-Mail-Adresse ein")
    })

    categorySelect.addEventListener("focus", () => {
        updateFeedback("Bitte wählen Sie eine Kategorie aus")
    })

    // Formular-Validierung beim Absenden
    form.addEventListener("submit", (event) => {
        event.preventDefault()

        // Alle Felder validieren
        const nameValid = validateField(nameInput, validations.name, false)
        const emailValid = validateField(emailInput, validations.email, false)
        const categoryValid = validateField(
            categorySelect,
            validations.category,
            false
        )

        if (nameValid && emailValid && categoryValid) {
            // Erfolgreiche Übermittlung simulieren
            updateFeedback(
                "Formular erfolgreich abgesendet! Vielen Dank.",
                "success"
            )

            // Formular zurücksetzen (nach kurzer Verzögerung)
            setTimeout(() => {
                form.reset()
            }, 2000)
        } else {
            // Fehlermeldung anzeigen
            updateFeedback(
                "Bitte korrigieren Sie die Fehler im Formular",
                "error"
            )
        }
    })

    // Hilfsfunktion zur Feldvalidierung
    function validateField(field, validation, updateMessage = true) {
        const value = field.value.trim()
        const isValid = validation.validate(value)

        // Visuelles Feedback
        if (isValid) {
            field.setAttribute("aria-invalid", "false")
            if (updateMessage) {
                updateFeedback(validation.successMessage, "success")
            }
        } else {
            field.setAttribute("aria-invalid", "true")
            if (updateMessage) {
                updateFeedback(validation.errorMessage, "error")
            }
        }

        return isValid
    }

    // Hilfsfunktion zur Aktualisierung des Feedback-Elements
    function updateFeedback(message, type = "") {
        feedbackElement.textContent = message

        // Klassen zurücksetzen
        feedbackElement.classList.remove("error", "success")

        // Neue Klasse hinzufügen
        if (type) {
            feedbackElement.classList.add(type)
        }
    }

    // Initiale Meldung
    updateFeedback("Bitte füllen Sie das Formular aus")
}
