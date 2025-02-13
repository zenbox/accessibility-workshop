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

// Standard-State definieren
const defaultState = {
  languageLevels: new Set(["default"]),
  messageTypes: new Set([]),
}

// State aus localStorage laden oder Default verwenden
let state
if (isLocalStorageAvailable()) {
  try {
    const savedState = JSON.parse(localStorage.getItem("languageSettings"))
    state = {
      languageLevels: new Set(savedState?.languageLevels || ["default"]),
      messageTypes: new Set(savedState?.messageTypes || []),
    }
  } catch (e) {
    state = defaultState
  }
} else {
  state = defaultState
}

// Funktion zum Speichern des States
function saveState() {
  if (isLocalStorageAvailable()) {
    const stateToSave = {
      languageLevels: Array.from(state.languageLevels),
      messageTypes: Array.from(state.messageTypes),
    }
    localStorage.setItem("languageSettings", JSON.stringify(stateToSave))
  }
}

// Funktion zum Umschalten der Sprachlevel
function toggleLanguageLevel(level) {
  if (state.languageLevels.has(level)) {
    state.languageLevels.delete(level)
  } else {
    state.languageLevels.add(level)
  }

  // Sicherstellen, dass mindestens ein Sprachlevel aktiv ist
  if (state.languageLevels.size === 0) {
    state.languageLevels.add("default")
  }

  // Button-Status aktualisieren
  document.querySelectorAll(".language-button").forEach((button) => {
    button.classList.toggle("active", state.languageLevels.has(button.dataset.level))
  })

  // Elemente ein-/ausblenden
  document.querySelectorAll("[data-language-level]").forEach((element) => {
    const elementLevel = element.getAttribute("data-language-level")
    element.style.display = state.languageLevels.has(elementLevel) ? "inline-block" : "none"
  })

  // State speichern
  saveState()
}

// Funktion zum Umschalten der Nachrichtentypen
function toggleMessageType(type) {
  if (state.messageTypes.has(type)) {
    state.messageTypes.delete(type)
  } else {
    state.messageTypes.add(type)
  }

  // Button-Status aktualisieren
  document.querySelectorAll(".message-button").forEach((button) => {
    button.classList.toggle("active", state.messageTypes.has(button.dataset.type))
  })

  // Elemente ein-/ausblenden
  document.querySelectorAll("[data-message-type]").forEach((element) => {
    const elementType = element.getAttribute("data-message-type")
    element.style.display = state.messageTypes.has(elementType) ? "inline-block" : "none"
  })

  // State speichern
  saveState()
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
    background: #f8f9fa;
    transition: all 0.3s ease;
    color: #666;
  }

  .toggle-button:hover {
    background: #e9ecef;
  }

  .toggle-button.active {
    background: #007bff;
    color: white;
  }

  .toggle-button.success { background: hsl(134, 61%, 21%); color: hsla(0,0%,100%,0.85); }
  .toggle-button.error { background: hsl(354, 70%, 34%); color: hsla(0,0%,100%,0.85); }
  .toggle-button.warning { background: hsl(45, 100%, 31%); color: hsla(0,0%,100%,0.85); }
  .toggle-button.info { background: hsl(188, 78%, 21%); color: hsla(0,0%,100%,0.85); }

  .toggle-button.active.success { background: hsl(134, 62%, 41%); }
  .toggle-button.active.error { background: hsl(354, 70%, 44%); }
  .toggle-button.active.warning { background: hsl(45, 100%, 41%); }
  .toggle-button.active.info { background: hsl(188, 78%, 33%); }

  .material-icons {
    font-size: 24px;
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

// Language Buttons konfiguration
const languageButtons = [
  { icon: "local_library", value: "easy", title: "Leichte Sprache" },
  { icon: "article", value: "simple", title: "Einfache Sprache" },
  { icon: "psychology", value: "default", title: "Standard" },
  { icon: "psychology_alt", value: "expert", title: "Experte" },
]

// Message Buttons konfiguration
const messageButtons = [
  { icon: "check_circle", value: "success", title: "Erfolg", class: "success" },
  { icon: "error", value: "error", title: "Fehler", class: "error" },
  { icon: "warning", value: "warning", title: "Warnung", class: "warning" },
  { icon: "info", value: "info", title: "Info", class: "info" },
]

// Button-Gruppen erstellen
const languageGroup = document.createElement("div")
languageGroup.classList.add("button-group")

const messageGroup = document.createElement("div")
messageGroup.classList.add("button-group")

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

  button.addEventListener("click", () => clickHandler(config.value))
  return button
}

// Buttons erstellen und einfügen
languageButtons.forEach((config) => {
  const button = createIconButton(config, "language-button", "data-level", toggleLanguageLevel)
  languageGroup.appendChild(button)
})

messageButtons.forEach((config) => {
  const button = createIconButton(config, "message-button", "data-type", toggleMessageType)
  messageGroup.appendChild(button)
})

// Gruppen dem Container hinzufügen
container.appendChild(languageGroup)
container.appendChild(messageGroup)

// Container einfügen
document.body.appendChild(container)

// Initial-Status setzen und Buttons aktualisieren
state.languageLevels.forEach((level) => {
  const button = document.querySelector(`[data-level="${level}"]`)
  if (button) button.classList.add("active")
})

state.messageTypes.forEach((type) => {
  const button = document.querySelector(`[data-type="${type}"]`)
  if (button) button.classList.add("active")
})

// Initial-Anzeige der Elemente setzen
document.querySelectorAll("[data-language-level]").forEach((element) => {
  const elementLevel = element.getAttribute("data-language-level")
  element.style.display = state.languageLevels.has(elementLevel) ? "inline-block" : "none"
})

document.querySelectorAll("[data-message-type]").forEach((element) => {
  const elementType = element.getAttribute("data-message-type")
  element.style.display = state.messageTypes.has(elementType) ? "inline-block" : "none"
})
