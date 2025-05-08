const { app, BrowserWindow, ipcMain } = require("electron")
const path = require("path")

let mainWindow

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        frame: false, // Entfernt die Standard-Titelleiste
        transparent: true, // Optional für abgerundete Ecken
        alwaysOnTop: true, // Fenster bleibt immer im Vordergrund
        titleBarStyle: "hiddenInset", // macOS-spezifisch: versteckte Titelleiste mit Verkehrsampel-Buttons
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            contextIsolation: true,
            nodeIntegration: false,
        },
    })

    // Lade die timer.html
    mainWindow.loadFile("timer.html")

    // Emittiert, wenn das Fenster geschlossen wird
    mainWindow.on("closed", function () {
        mainWindow = null
    })
}

// Diese Methode wird aufgerufen, wenn Electron mit der
// Initialisierung fertig ist
app.whenReady().then(() => {
    createWindow()

    app.on("activate", function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

// Beende die App, wenn alle Fenster geschlossen sind
app.on("window-all-closed", function () {
    if (process.platform !== "darwin") app.quit()
})

// IPC-Listener für Fenster-Aktionen (schließen, minimieren, maximieren)
ipcMain.on("window-control", (event, command) => {
    if (!mainWindow) return

    if (command === "close") {
        mainWindow.close()
    } else if (command === "minimize") {
        mainWindow.minimize()
    } else if (command === "maximize") {
        if (mainWindow.isMaximized()) {
            mainWindow.unmaximize()
        } else {
            mainWindow.maximize()
        }
    }
})
