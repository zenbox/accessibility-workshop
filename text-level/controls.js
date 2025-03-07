// Hilfsfunktion zum Prüfen der localStorage-Verfügbarkeit
function isLocalStorageAvailable() {
  try {
    const test = "test"
    localStorage.setItem(test, test)
    localStorage.removeItem(test)
    return true
  } catch (e) {
    return false
  }
}

// Standard-State mit jeweils einem aktiven Level definieren
const defaultState = {
  activeLanguageLevel: "default",
  activeMessageType: null,
}

// State aus localStorage laden oder Default verwenden
let state
if (isLocalStorageAvailable()) {
  try {
    const savedState = JSON.parse(localStorage.getItem("languageSettings"))
    state = {
      activeLanguageLevel: savedState?.activeLanguageLevel || "default",
      activeMessageType: savedState?.activeMessageType || null,
    }
  } catch (e) {
    state = defaultState
  }
} else {
  state = defaultState
}

// Language Buttons Konfiguration mit Tooltips
const languageButtons = [
  {
    icon: "local_library",
    value: "easy",
    title: "Leichte Sprache",
    tooltip: "Zeigt nur Texte in leichter Sprache an",
  },
  {
    icon: "article",
    value: "simple",
    title: "Einfache Sprache",
    tooltip: "Zeigt nur Texte in einfacher Sprache an",
  },
  {
    icon: "psychology",
    value: "default",
    title: "Standard",
    tooltip: "Zeigt nur Texte in Standard-/Fachsprache an",
  },
  {
    icon: "psychology_alt",
    value: "expert",
    title: "Experte",
    tooltip: "Zeigt nur Texte in Expertensprache an",
  },
]

// Message Buttons Konfiguration mit Tooltips
const messageButtons = [
  {
    icon: "check_circle",
    value: "success",
    title: "Erfolg",
    class: "success",
    tooltip: "Zeigt nur Erfolgsmeldungen an",
  },
  {
    icon: "error",
    value: "error",
    title: "Fehler",
    class: "error",
    tooltip: "Zeigt nur Fehlermeldungen an",
  },
  {
    icon: "warning",
    value: "warning",
    title: "Warnung",
    class: "warning",
    tooltip: "Zeigt nur Warnungen an",
  },
  {
    icon: "info",
    value: "info",
    title: "Info",
    class: "info",
    tooltip: "Zeigt nur Informationsmeldungen an",
  },
]

// Funktion zum Speichern des States
function saveState() {
  if (isLocalStorageAvailable()) {
    localStorage.setItem("languageSettings", JSON.stringify(state))
  }
}

// Funktion zum Setzen des Sprachlevels
function setLanguageLevel(level) {
  // Alten aktiven Button deaktivieren
  if (state.activeLanguageLevel) {
    const oldButton = document.querySelector(`[data-level="${state.activeLanguageLevel}"]`)
    if (oldButton) {
      oldButton.classList.remove("active")
      oldButton.classList.add("disabled")
    }
  }

  state.activeLanguageLevel = level

  // Alle Buttons als deaktiviert markieren und dann den aktiven aktivieren
  document.querySelectorAll(".language-button").forEach((button) => {
    button.classList.remove("active")
    button.classList.add("disabled")
    if (button.dataset.level === level) {
      button.classList.add("active")
      button.classList.remove("disabled")
    }
  })

  // Textelemente ein-/ausblenden
  document.querySelectorAll("[data-language-level]").forEach((element) => {
    const elementLevel = element.getAttribute("data-language-level")
    element.style.display = elementLevel === level ? "inline-block" : "none"
  })

  saveState()
}

// Funktion zum Setzen des Nachrichtentyps
function setMessageType(type) {
  if (state.activeMessageType === type) {
    // Deaktivieren des aktuellen Typs
    state.activeMessageType = null
    const button = document.querySelector(`[data-type="${type}"]`)
    if (button) {
      button.classList.remove("active")
      button.classList.add("disabled")
    }
  } else {
    // Deaktivieren des alten Typs
    if (state.activeMessageType) {
      const oldButton = document.querySelector(`[data-type="${state.activeMessageType}"]`)
      if (oldButton) {
        oldButton.classList.remove("active")
        oldButton.classList.add("disabled")
      }
    }

    // Aktivieren des neuen Typs
    state.activeMessageType = type
    const button = document.querySelector(`[data-type="${type}"]`)
    if (button) {
      button.classList.add("active")
      button.classList.remove("disabled")
    }
  }

  // Textelemente ein-/ausblenden
  document.querySelectorAll("[data-message-type]").forEach((element) => {
    const elementType = element.getAttribute("data-message-type")
    element.style.display = elementType === state.activeMessageType ? "inline-block" : "none"
  })

  saveState()
}

// Funktion zum Erstellen eines Icon-Buttons
function createIconButton(config, className, dataAttribute, clickHandler) {
  const button = document.createElement("button")
  button.classList.add("toggle-button", className)
  if (config.class) button.classList.add(config.class)
  button.setAttribute(dataAttribute, config.value)
  button.setAttribute("title", config.title)

  const icon = document.createElement("span")
  icon.classList.add("material-icons")
  icon.textContent = config.icon
  button.appendChild(icon)

  // Tooltip hinzufügen
  const tooltip = document.createElement("span")
  tooltip.classList.add("tooltip")
  tooltip.textContent = config.tooltip
  button.appendChild(tooltip)

  button.addEventListener("click", () => clickHandler(config.value))
  return button
}

const buttonStyles = `
  .controls-sidebar {
    position: fixed;
    right: 20px;
    top: 50%;
    transform: translateY(-50%);
    display: flex;
    flex-direction: column;
    gap: 10px;
    background: rgba(255, 255, 255, 0.15);
    padding: 10px;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    z-index: 1000;
  }

  .button-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .button-group:not(:last-child) {
    border-bottom: 1px solid #eee;
    padding-bottom: 10px;
    margin-bottom: 10px;
  }

  .toggle-button {
    border: none;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    position: relative;
    height: 44px;
  }

  .toggle-button:hover:not(.disabled) {
    transform: scale(1.05);
  }

  /* Sprachlevel-Buttons */
  .language-button {
    background: #e9ecef;
    color: #495057;
  }

  .language-button.active {
    background: #0d6efd;
    color: white;
    box-shadow: 0 2px 4px rgba(13, 110, 253, 0.3);
  }

  .language-button.disabled {
    background: #f8f9fa;
    color: #adb5bd;
    cursor: not-allowed;
    box-shadow: none;
  }

  /* Nachrichtentyp-Buttons */
  .toggle-button.success { 
    background: hsl(134, 61%, 41%); 
    color: white;
  }
  .toggle-button.error { 
    background: hsl(354, 70%, 54%); 
    color: white;
  }
  .toggle-button.warning { 
    background: hsl(45, 100%, 51%); 
    color: white;
  }
  .toggle-button.info { 
    background: hsl(188, 78%, 41%); 
    color: white;
  }

  .toggle-button.disabled.success { 
    background: hsl(134, 61%, 41%, 0.3);
    color: hsl(134, 61%, 21%, 0.5);
    cursor: not-allowed;
    box-shadow: none;
  }
  .toggle-button.disabled.error { 
    background: hsl(354, 70%, 54%, 0.3);
    color: hsl(354, 70%, 34%, 0.5);
    cursor: not-allowed;
    box-shadow: none;
  }
  .toggle-button.disabled.warning { 
    background: hsl(45, 100%, 51%, 0.3);
    color: hsl(45, 100%, 31%, 0.5);
    cursor: not-allowed;
    box-shadow: none;
  }
  .toggle-button.disabled.info { 
    background: hsl(188, 78%, 41%, 0.3);
    color: hsl(188, 78%, 21%, 0.5);
    cursor: not-allowed;
    box-shadow: none;
  }

  .material-icons {
    font-size: 24px;
  }

  /* Tooltip Styles */
  .tooltip {
    position: absolute;
    right: 50px;
    top: 50%;
    transform: translateY(-50%);
    background: rgba(33, 37, 41, 0.95);
    color: white;
    padding: 8px 12px;
    border-radius: 4px;
    font-size: 12px;
    white-space: nowrap;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    pointer-events: none;
    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
  }

  .toggle-button:hover .tooltip {
    opacity: 1;
    visibility: visible;
    transform: translateY(-50%) translateX(-8px);
  }
`

// Link für Material Icons einfügen
const iconLink = document.createElement("link")
iconLink.href = "https://fonts.googleapis.com/icon?family=Material+Icons"
iconLink.rel = "stylesheet"
document.head.appendChild(iconLink)

// Style-Element erstellen und einfügen
const styleElement = document.createElement("style")
styleElement.textContent = buttonStyles
document.head.appendChild(styleElement)

// Button-Container erstellen
const container = document.createElement("div")
container.classList.add("controls-sidebar")

// Button-Gruppen erstellen
const languageGroup = document.createElement("div")
languageGroup.classList.add("button-group")

const messageGroup = document.createElement("div")
messageGroup.classList.add("button-group")

// Buttons erstellen und einfügen
languageButtons.forEach((config) => {
  const button = createIconButton(config, "language-button", "data-level", setLanguageLevel)
  // Initial alle Buttons als deaktiviert markieren
  button.classList.add("disabled")
  languageGroup.appendChild(button)
})

messageButtons.forEach((config) => {
  const button = createIconButton(config, "message-button", "data-type", setMessageType)
  // Initial alle Buttons als deaktiviert markieren
  button.classList.add("disabled")
  messageGroup.appendChild(button)
})

// Gruppen dem Container hinzufügen
container.appendChild(languageGroup)
container.appendChild(messageGroup)

// Container einfügen
document.body.appendChild(container)

// Initial-Status setzen
const activeLanguageButton = document.querySelector(`[data-level="${state.activeLanguageLevel}"]`)
if (activeLanguageButton) {
  activeLanguageButton.classList.add("active")
  activeLanguageButton.classList.remove("disabled")
}

if (state.activeMessageType) {
  const activeMessageButton = document.querySelector(`[data-type="${state.activeMessageType}"]`)
  if (activeMessageButton) {
    activeMessageButton.classList.add("active")
    activeMessageButton.classList.remove("disabled")
  }
}

// Initial-Anzeige der Elemente setzen
setLanguageLevel(state.activeLanguageLevel)
if (state.activeMessageType) {
  setMessageType(state.activeMessageType)
}
