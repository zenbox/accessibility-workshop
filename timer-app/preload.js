// Preload-Skript für die sichere Kommunikation zwischen Renderer und Main-Prozess
const { contextBridge, ipcRenderer } = require('electron');

// Alle Notification API-Aufrufe von Node nach dem DOM-Laden ausführen
window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
  }

  for (const type of ['chrome', 'node', 'electron']) {
    replaceText(`${type}-version`, process.versions[type])
  }
  
  // Füge Fenster-Steuerungsfunktionen zum Renderer hinzu
  contextBridge.exposeInMainWorld('electronAPI', {
    closeWindow: () => ipcRenderer.send('window-control', 'close'),
    minimizeWindow: () => ipcRenderer.send('window-control', 'minimize'),
    maximizeWindow: () => ipcRenderer.send('window-control', 'maximize')
  });
});