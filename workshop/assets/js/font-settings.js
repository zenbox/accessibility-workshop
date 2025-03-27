// Font Changer Bookmarklet
// Um dieses Skript als Bookmarklet zu nutzen, erstellen Sie ein neues Lesezeichen und fügen Sie
// diesen Code mit "javascript:" am Anfang als URL ein

;(function () {
    // Prüfen, ob das Skript bereits ausgeführt wird
    if (document.getElementById("font-changer-button")) {
        // Wenn der Button bereits existiert, umschalten (show/hide) des Dialogs
        const dialog = document.getElementById("font-changer-dialog")
        if (dialog) {
            dialog.style.display =
                dialog.style.display === "none" ? "block" : "none"
        } else {
            // Wenn Dialog nicht existiert, aber Button ja, Dialog neu erstellen
            initFontChanger()
        }
        return
    }

    // Button erstellen und Dialog initialisieren
    createFloatingButton()
    initFontChanger()

    // Funktion zum Erstellen des schwebenden Buttons
    function createFloatingButton() {
        const button = document.createElement("div")
        button.id = "font-changer-button"

        // CSS für den Button
        const buttonStyle = document.createElement("style")
        buttonStyle.textContent = `
      #font-changer-button {
        position: fixed;
        bottom: 20px;
        left: 20px;
        width: 50px;
        height: 50px;
        background-color: #4285f4;
        color: white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: Arial, sans-serif;
        font-size: 24px;
        font-weight: bold;
        cursor: pointer;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
        z-index: 9998;
        user-select: none;
        transition: transform 0.2s, box-shadow 0.2s;
      }
      
      #font-changer-button:hover {
        transform: scale(1.05);
        box-shadow: 0 3px 12px rgba(0, 0, 0, 0.4);
      }
    `
        document.head.appendChild(buttonStyle)

        button.textContent = "F"

        // Event-Listener zum Umschalten des Dialogs
        button.addEventListener("click", function () {
            const dialog = document.getElementById("font-changer-dialog")
            if (dialog) {
                dialog.style.display =
                    dialog.style.display === "none" ? "block" : "none"
            } else {
                initFontChanger()
            }
        })

        document.body.appendChild(button)
    }

    // Funktion zur Initialisierung des Font-Changers
    function initFontChanger() {
        // Verfügbare Schriftarten
        const fontFamilies = [
            "Arial",
            "Verdana",
            "Helvetica",
            "Times New Roman",
            "Georgia",
            "Tahoma",
            "Trebuchet MS",
            "Open Sans",
            "Roboto",
            "Comic Sans MS",
        ]

        // Verfügbare Schriftgrößen
        const fontSizes = [
            "12px",
            "14px",
            "16px",
            "18px",
            "20px",
            "22px",
            "24px",
            "28px",
            "32px",
        ]

        // Verfügbare Zeilenabstände
        const lineHeights = ["1", "1.2", "1.5", "1.8", "2", "2.5", "3"]

        // Verfügbare Wortabstände
        const wordSpacings = [
            "normal",
            "0.05em",
            "0.1em",
            "0.15em",
            "0.2em",
            "0.25em",
            "0.3em",
        ]

        // Verfügbare Buchstabenabstände
        const letterSpacings = [
            "normal",
            "0.05em",
            "0.1em",
            "0.15em",
            "0.2em",
            "0.25em",
            "0.3em",
            "-0.05em",
            "-0.1em",
        ]

        // CSS für das Dialogfenster erstellen
        const style = document.createElement("style")
        style.id = "font-changer-style"
        style.textContent = `
      #font-changer-dialog {
        position: fixed;
        top: 30px;
        right: 30px;
        width: 300px;
        background-color: white;
        border: 1px solid #ccc;
        border-radius: 5px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
        z-index: 9999;
        font-family: Arial, sans-serif;
        padding: 15px;
      }
      
      #font-changer-dialog h2 {
        margin-top: 0;
        border-bottom: 1px solid #eee;
        padding-bottom: 10px;
        font-size: 18px;
        cursor: move;
      }
      
      #font-changer-dialog .form-group {
        margin-bottom: 15px;
      }
      
      #font-changer-dialog label {
        display: block;
        margin-bottom: 5px;
        font-weight: bold;
      }
      
      #font-changer-dialog select, #font-changer-dialog button {
        width: 100%;
        padding: 8px;
        border-radius: 3px;
        border: 1px solid #ccc;
      }
      
      #font-changer-dialog button {
        background-color: #4CAF50;
        color: white;
        border: none;
        cursor: pointer;
        margin-top: 5px;
      }
      
      #font-changer-dialog button:hover {
        background-color: #45a049;
      }
      
      #font-changer-dialog .close-button {
        position: absolute;
        top: 10px;
        right: 10px;
        cursor: pointer;
        font-weight: bold;
      }
      
      /* Globaler CSS-Reset für alle Elemente */
      .font-changer-applied * {
        font-family: inherit !important;
        font-size: inherit !important;
      }
    `
        document.head.appendChild(style)

        // Gespeicherte Position laden
        const savedPositionX = localStorage.getItem("fontChangerPositionX")
        const savedPositionY = localStorage.getItem("fontChangerPositionY")

        // Dialogfenster erstellen
        const dialog = document.createElement("div")
        dialog.id = "font-changer-dialog"
        dialog.style.display = "none"

        // Gespeicherte Position anwenden (falls vorhanden)
        if (savedPositionX && savedPositionY) {
            dialog.style.left = savedPositionX
            dialog.style.right = "auto"
            dialog.style.top = savedPositionY
        }

        dialog.innerHTML = `
      <span class="close-button" id="font-changer-close">×</span>
      <h2 id="font-changer-drag-handle">Schrifteinstellungen</h2>
      
      <div class="form-group">
        <label for="font-changer-family">Schriftart:</label>
        <select id="font-changer-family"></select>
      </div>
      
      <div class="form-group">
        <label for="font-changer-size">Schriftgröße:</label>
        <select id="font-changer-size"></select>
      </div>
      
      <div class="form-group">
        <label for="font-changer-line-height">Zeilenabstand:</label>
        <select id="font-changer-line-height"></select>
      </div>
      
      <div class="form-group">
        <label for="font-changer-word-spacing">Wortabstand:</label>
        <select id="font-changer-word-spacing"></select>
      </div>
      
      <div class="form-group">
        <label for="font-changer-letter-spacing">Buchstabenabstand:</label>
        <select id="font-changer-letter-spacing"></select>
      </div>
      
      <button id="font-changer-apply">Anwenden</button>
      <button id="font-changer-reset">Zurücksetzen</button>
    `

        document.body.appendChild(dialog)

        // Schriftarten-Dropdown befüllen
        const fontFamilySelect = document.getElementById("font-changer-family")
        fontFamilies.forEach((font) => {
            const option = document.createElement("option")
            option.value = font
            option.textContent = font
            option.style.fontFamily = font
            fontFamilySelect.appendChild(option)
        })

        // Schriftgrößen-Dropdown befüllen
        const fontSizeSelect = document.getElementById("font-changer-size")
        fontSizes.forEach((size) => {
            const option = document.createElement("option")
            option.value = size
            option.textContent = size
            fontSizeSelect.appendChild(option)
        })

        // Zeilenabstand-Dropdown befüllen
        const lineHeightSelect = document.getElementById(
            "font-changer-line-height"
        )
        lineHeights.forEach((height) => {
            const option = document.createElement("option")
            option.value = height
            option.textContent = height
            lineHeightSelect.appendChild(option)
        })

        // Wortabstand-Dropdown befüllen
        const wordSpacingSelect = document.getElementById(
            "font-changer-word-spacing"
        )
        wordSpacings.forEach((spacing) => {
            const option = document.createElement("option")
            option.value = spacing
            option.textContent = spacing
            wordSpacingSelect.appendChild(option)
        })

        // Buchstabenabstand-Dropdown befüllen
        const letterSpacingSelect = document.getElementById(
            "font-changer-letter-spacing"
        )
        letterSpacings.forEach((spacing) => {
            const option = document.createElement("option")
            option.value = spacing
            option.textContent = spacing
            letterSpacingSelect.appendChild(option)
        })

        // Aktuelle Werte als ausgewählt markieren (falls möglich)
        const computedStyle = window.getComputedStyle(document.body)

        // Versuche, die aktuelle Schriftart zu finden und auszuwählen
        const currentFontFamily = computedStyle.fontFamily
            .split(",")[0]
            .replace(/['"]/g, "")
        for (let i = 0; i < fontFamilySelect.options.length; i++) {
            if (
                fontFamilySelect.options[i].value.toLowerCase() ===
                currentFontFamily.toLowerCase()
            ) {
                fontFamilySelect.selectedIndex = i
                break
            }
        }

        // Versuche, die aktuelle Schriftgröße zu finden und auszuwählen
        const currentFontSize = computedStyle.fontSize
        for (let i = 0; i < fontSizeSelect.options.length; i++) {
            if (fontSizeSelect.options[i].value === currentFontSize) {
                fontSizeSelect.selectedIndex = i
                break
            }
        }

        // Versuche, den aktuellen Zeilenabstand zu finden und auszuwählen
        const currentLineHeight = computedStyle.lineHeight
        // Normalisiere den Wert (entferne "px" usw.)
        const normalizedLineHeight =
            currentLineHeight === "normal"
                ? "normal"
                : parseFloat(currentLineHeight) / parseFloat(currentFontSize)

        // Finde den nächstgelegenen Wert in den Optionen
        let closestLineHeightIndex = 0
        let minLineHeightDiff = Infinity

        for (let i = 0; i < lineHeightSelect.options.length; i++) {
            const optionValue =
                lineHeightSelect.options[i].value === "normal"
                    ? 1.2
                    : parseFloat(lineHeightSelect.options[i].value)
            const diff = Math.abs(optionValue - normalizedLineHeight)

            if (diff < minLineHeightDiff) {
                minLineHeightDiff = diff
                closestLineHeightIndex = i
            }
        }

        lineHeightSelect.selectedIndex = closestLineHeightIndex

        // Versuche, die aktuellen Abstände zu finden und auszuwählen
        const currentWordSpacing = computedStyle.wordSpacing
        const currentLetterSpacing = computedStyle.letterSpacing

        // Standardwerte setzen
        let wordSpacingIndex = 0 // 'normal' ist Standard
        let letterSpacingIndex = 0 // 'normal' ist Standard

        // Versuche, den passenden Wortabstand zu finden
        for (let i = 0; i < wordSpacingSelect.options.length; i++) {
            if (wordSpacingSelect.options[i].value === currentWordSpacing) {
                wordSpacingIndex = i
                break
            }
        }

        // Versuche, den passenden Buchstabenabstand zu finden
        for (let i = 0; i < letterSpacingSelect.options.length; i++) {
            if (letterSpacingSelect.options[i].value === currentLetterSpacing) {
                letterSpacingIndex = i
                break
            }
        }

        wordSpacingSelect.selectedIndex = wordSpacingIndex
        letterSpacingSelect.selectedIndex = letterSpacingIndex

        // Event-Listener für den "Anwenden"-Button
        document
            .getElementById("font-changer-apply")
            .addEventListener("click", function () {
                const selectedFont = fontFamilySelect.value
                const selectedSize = fontSizeSelect.value
                const selectedLineHeight = lineHeightSelect.value
                const selectedWordSpacing = wordSpacingSelect.value
                const selectedLetterSpacing = letterSpacingSelect.value

                // Entferne alte CSS-Klasse, falls vorhanden
                document.body.classList.remove("font-changer-applied")

                // Anwenden der Schriftart und -größe auf den body
                document.body.style.fontFamily = selectedFont + " !important"
                document.body.style.fontSize = selectedSize + " !important"
                document.body.style.lineHeight =
                    selectedLineHeight + " !important"
                document.body.style.wordSpacing =
                    selectedWordSpacing + " !important"
                document.body.style.letterSpacing =
                    selectedLetterSpacing + " !important"

                // CSS-Klasse zum Überschreiben aller Schrifteinstellungen hinzufügen
                document.body.classList.add("font-changer-applied")

                // Inline !important Styles für bessere Überschreibung hinzufügen
                const inlineStyleElement = document.getElementById(
                    "font-changer-inline-styles"
                )
                if (inlineStyleElement) {
                    document.head.removeChild(inlineStyleElement)
                }

                const inlineStyle = document.createElement("style")
                inlineStyle.id = "font-changer-inline-styles"
                inlineStyle.innerHTML = `
        body, body * {
          font-family: ${selectedFont} !important;
          font-size: ${selectedSize} !important;
          line-height: ${selectedLineHeight} !important;
          word-spacing: ${selectedWordSpacing} !important;
          letter-spacing: ${selectedLetterSpacing} !important;
        }
      `
                document.head.appendChild(inlineStyle)

                // Einstellungen im localStorage speichern
                localStorage.setItem("preferredFontFamily", selectedFont)
                localStorage.setItem("preferredFontSize", selectedSize)
                localStorage.setItem("preferredLineHeight", selectedLineHeight)
                localStorage.setItem(
                    "preferredWordSpacing",
                    selectedWordSpacing
                )
                localStorage.setItem(
                    "preferredLetterSpacing",
                    selectedLetterSpacing
                )

                alert("Schrifteinstellungen wurden angewendet!")
            })

        // Event-Listener für den "Zurücksetzen"-Button
        document
            .getElementById("font-changer-reset")
            .addEventListener("click", function () {
                // Entfernen der gesetzten Styles
                document.body.style.fontFamily = ""
                document.body.style.fontSize = ""
                document.body.style.lineHeight = ""
                document.body.style.wordSpacing = ""
                document.body.style.letterSpacing = ""
                document.body.classList.remove("font-changer-applied")

                // Inline Styles entfernen
                const inlineStyleElement = document.getElementById(
                    "font-changer-inline-styles"
                )
                if (inlineStyleElement) {
                    document.head.removeChild(inlineStyleElement)
                }

                // Gespeicherte Einstellungen löschen
                localStorage.removeItem("preferredFontFamily")
                localStorage.removeItem("preferredFontSize")
                localStorage.removeItem("preferredLineHeight")
                localStorage.removeItem("preferredWordSpacing")
                localStorage.removeItem("preferredLetterSpacing")

                alert("Schrifteinstellungen wurden zurückgesetzt!")
            })

        // Event-Listener für den "Schließen"-Button
        document
            .getElementById("font-changer-close")
            .addEventListener("click", function () {
                dialog.style.display = "none"
            })

        // Dialog verschiebbar machen
        makeDraggable(
            dialog,
            document.getElementById("font-changer-drag-handle")
        )

        // Optional: Gespeicherte Einstellungen beim Laden anwenden
        const savedFont = localStorage.getItem("preferredFontFamily")
        const savedSize = localStorage.getItem("preferredFontSize")
        const savedLineHeight = localStorage.getItem("preferredLineHeight")
        const savedWordSpacing = localStorage.getItem("preferredWordSpacing")
        const savedLetterSpacing = localStorage.getItem(
            "preferredLetterSpacing"
        )

        if (savedFont && savedSize) {
            // Setze die Auswahlfelder auf die gespeicherten Werte
            fontFamilySelect.value = savedFont
            fontSizeSelect.value = savedSize

            if (savedLineHeight) lineHeightSelect.value = savedLineHeight
            if (savedWordSpacing) wordSpacingSelect.value = savedWordSpacing
            if (savedLetterSpacing)
                letterSpacingSelect.value = savedLetterSpacing

            // Einstellungen anwenden
            document.body.style.fontFamily = savedFont + " !important"
            document.body.style.fontSize = savedSize + " !important"

            if (savedLineHeight)
                document.body.style.lineHeight = savedLineHeight + " !important"
            if (savedWordSpacing)
                document.body.style.wordSpacing =
                    savedWordSpacing + " !important"
            if (savedLetterSpacing)
                document.body.style.letterSpacing =
                    savedLetterSpacing + " !important"

            document.body.classList.add("font-changer-applied")

            const inlineStyle = document.createElement("style")
            inlineStyle.id = "font-changer-inline-styles"
            inlineStyle.innerHTML = `
        body, body * {
          font-family: ${savedFont} !important;
          font-size: ${savedSize} !important;
          ${
              savedLineHeight
                  ? `line-height: ${savedLineHeight} !important;`
                  : ""
          }
          ${
              savedWordSpacing
                  ? `word-spacing: ${savedWordSpacing} !important;`
                  : ""
          }
          ${
              savedLetterSpacing
                  ? `letter-spacing: ${savedLetterSpacing} !important;`
                  : ""
          }
        }
      `
            document.head.appendChild(inlineStyle)
        }
    }

    // Funktion zum Verschiebbar-Machen des Dialogs
    function makeDraggable(element, handle) {
        let pos1 = 0,
            pos2 = 0,
            pos3 = 0,
            pos4 = 0

        if (handle) {
            // Wenn Handle angegeben, nur damit ziehen
            handle.onmousedown = dragMouseDown
        } else {
            // Sonst ganzes Element ziehen
            element.onmousedown = dragMouseDown
        }

        function dragMouseDown(e) {
            e = e || window.event
            e.preventDefault()
            // Mausposition beim Start
            pos3 = e.clientX
            pos4 = e.clientY
            document.onmouseup = closeDragElement
            document.onmousemove = elementDrag
        }

        function elementDrag(e) {
            e = e || window.event
            e.preventDefault()
            // Neue Position berechnen
            pos1 = pos3 - e.clientX
            pos2 = pos4 - e.clientY
            pos3 = e.clientX
            pos4 = e.clientY
            // Element bewegen
            element.style.top = element.offsetTop - pos2 + "px"
            element.style.left = element.offsetLeft - pos1 + "px"
            element.style.right = "auto" // Rechte Position entfernen für absolute Positionierung
        }

        function closeDragElement() {
            // Bewegung stoppen
            document.onmouseup = null
            document.onmousemove = null

            // Position speichern
            localStorage.setItem("fontChangerPositionX", element.style.left)
            localStorage.setItem("fontChangerPositionY", element.style.top)
        }
    }
})()
