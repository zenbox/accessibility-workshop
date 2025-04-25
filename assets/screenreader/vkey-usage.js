/**
 * Virtuelle Tastatur - Initialization Script
 * 
 * Diese Datei stellt die Initialisierung und Konfiguration der virtuellen Tastatur bereit.
 * Folgende Funktionen werden implementiert:
 * - Automatische Erkennung aller interaktiven Elemente
 * - Tastaturnavigation über TAB, Pfeiltasten, Enter, Space und Escape
 * - Simuliert physische Tastatur-Ereignisse
 * - Funktioniert auf jeder HTML-Seite ohne Anpassungen
 */

// Keyboard initialization - wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  // Ensure our keyboard library has loaded
  if (!window.KeyboardManager) {
    console.error('Virtual Keyboard library not found. Make sure vkey.js is loaded before this script.');
    return;
  }
  
  // Options for the keyboard
  const keyboardOptions = {
    container: document.body,
    initiallyVisible: false,
    position: 'bottom',
    keyboardShortcut: 'Alt+K',
    showScreenReaderOutput: true
  };
  
  // Create and initialize the keyboard
  try {
    const keyboard = window.KeyboardManager.create('mainKeyboard', keyboardOptions);
    
    // Button to toggle the keyboard visibility
    const toggleButton = document.createElement('button');
    toggleButton.textContent = 'Virtuelle Tastatur ein-/ausblenden';
    toggleButton.className = 'keyboard-toggle-btn';
    toggleButton.setAttribute('aria-label', 'Virtuelle Tastatur ein-/ausblenden. Mit Alt+K kann die Tastatur ebenfalls ein- und ausgeblendet werden.');
    toggleButton.style.position = 'fixed';
    toggleButton.style.bottom = '20px';
    toggleButton.style.right = '20px';
    toggleButton.style.zIndex = '9000';
    toggleButton.style.padding = '10px 15px';
    toggleButton.style.backgroundColor = '#007bff';
    toggleButton.style.color = 'white';
    toggleButton.style.border = 'none';
    toggleButton.style.borderRadius = '5px';
    toggleButton.style.cursor = 'pointer';
    toggleButton.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.2)';
    
    // Event Listener for the toggle button
    toggleButton.addEventListener('click', function() {
      window.KeyboardManager.toggle('mainKeyboard');
    });
    
    // Add button to document
    document.body.appendChild(toggleButton);
    
    // Add keyboard shortcut info
    const infoText = document.createElement('div');
    infoText.textContent = 'Tastenkombination: Alt+K zum Ein-/Ausblenden der virtuellen Tastatur';
    infoText.style.position = 'fixed';
    infoText.style.bottom = '70px';
    infoText.style.right = '20px';
    infoText.style.fontSize = '12px';
    infoText.style.color = '#555';
    infoText.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
    infoText.style.padding = '5px 8px';
    infoText.style.borderRadius = '3px';
    document.body.appendChild(infoText);
    
    // Help text popup
    const helpText = document.createElement('div');
    helpText.setAttribute('role', 'dialog');
    helpText.setAttribute('aria-labelledby', 'help-title');
    helpText.innerHTML = `
      <div style="position: fixed; top: 10px; right: 20px; background: #f8f9fa; border: 1px solid #ddd; padding: 15px; border-radius: 5px; max-width: 300px; z-index: 8000; box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);">
        <h3 id="help-title" style="margin-top: 0;">Tastatursteuerung</h3>
        <p>Die virtuelle Tatstatur unterstützt folgende Tasten:</p>
        <ul>
          <li><strong>Tab/Shift+Tab:</strong> Zwischen Elementen navigieren</li>
          <li><strong>Pfeiltasten:</strong> Räumliche Navigation</li>
          <li><strong>Enter:</strong> Auswählen/Bestätigen</li>
          <li><strong>Space:</strong> Aktivieren/Auswählen</li>
          <li><strong>Escape:</strong> Abbrechen/Zurück</li>
        </ul>
        <p>Die virtuelle Tastatur erkennt automatisch alle interaktiven Elemente auf der Seite und ermöglicht die Navigation zwischen ihnen.</p>
        <button id="close-help" style="padding: 5px 10px; background: #007bff; color: white; border: none; border-radius: 3px; cursor: pointer;">Schließen</button>
      </div>
    `;
    //document.body.appendChild(helpText);
    
    /* 
    // Close help text functionality - THIS IS COMMENTED OUT SINCE THE helpText ISN'T ADDED TO THE DOM
    // Uncomment if you want to use the help functionality
    const closeHelpButton = document.getElementById('close-help');
    if (closeHelpButton) {
      closeHelpButton.addEventListener('click', function() {
        helpText.remove();
        // Announce to screenreader that help was closed
        if (window.KeyboardManager.getScreenReader('mainKeyboard')) {
          window.KeyboardManager.announce('mainKeyboard', 'Hilfe geschlossen');
        }
      });
    }
    */
    
    // Initialize keyboard on page load and scan for all interactive elements
    if (document.readyState === 'complete') {
      // Force a scan of all interactive elements
      keyboard.scanPageForInteractiveElements();
    } else {
      // Wait for all resources to load before scanning
      window.addEventListener('load', function() {
        keyboard.scanPageForInteractiveElements();
      });
    }
    
    // Add page-level keyboard events to auto-toggle keyboard when Tab key is pressed
    document.addEventListener('keydown', function(e) {
      // If Tab is pressed and keyboard is not visible, show it
      if (e.key === 'Tab' && !keyboard.isVisible) {
        console.log('Tab key detected, activating virtual keyboard');
        window.KeyboardManager.show('mainKeyboard');
      }
    });
    
    console.log('Virtual keyboard initialized successfully!');
  } catch (error) {
    console.error('Error initializing virtual keyboard:', error);
  }
});