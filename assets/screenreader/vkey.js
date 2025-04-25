/**
 * VirtualKeyboard - A reusable, accessible virtual keyboard component
 * Features:
 * - SOLID principles and OO design
 * - Navigation keys (Tab, Shift+Tab, Arrows, Enter, Space, Escape)
 * - Toggle visibility
 * - Animated focus indicator
 */

// Main keyboard class - handles creation and basic functionality
class VirtualKeyboard {
  constructor(options = {}) {
    // Default options
    this.options = {
      container: document.body,
      initiallyVisible: false,
      position: 'bottom',
      keyboardShortcut: 'Alt+K',
      showScreenReaderOutput: true,
      ...options
    };
    
    // Internal state
    this.isVisible = this.options.initiallyVisible;
    this.activeElement = null;
    this.shiftPressed = false;
    
    // DOM elements
    this.keyboardElement = null;
    this.focusIndicator = null;
    
    // Create screen reader
    this.screenReader = new ScreenReader({
      container: this.options.container,
      showOutput: this.options.showScreenReaderOutput
    });
    
    // Initialize
    this.init();
    this.bindGlobalEvents();
  }
  
  init() {
    // Create keyboard elements
    this.createKeyboardDOM();
    
    // Add styles
    this.addKeyboardStyles();
    
    // Set initial visibility
    if (this.isVisible) {
      this.show();
    } else {
      this.hide();
    }
  }
  
  // Create main keyboard DOM structure
  createKeyboardDOM() {
    // Main keyboard container
    this.keyboardElement = document.createElement('div');
    this.keyboardElement.className = 'virtual-keyboard';
    this.keyboardElement.setAttribute('role', 'application');
    this.keyboardElement.setAttribute('aria-label', 'Virtuelle Tastatur zur Navigation');
    // Set tabindex to -1 to exclude from tab navigation
    this.keyboardElement.setAttribute('tabindex', '-1');
    
    // Create keyboard rows
    const keyRows = [
      ['Escape', 'Tab', '←', '→', '↑', '↓'],
      ['Shift', 'Space', 'Enter']
    ];
    
    // Create keyboard layout
    const keyboardLayout = document.createElement('div');
    keyboardLayout.className = 'keyboard-layout';
    keyboardLayout.setAttribute('tabindex', '-1'); // Exclude from tab navigation
    
    // Add keys to layout
    keyRows.forEach(row => {
      const rowElement = document.createElement('div');
      rowElement.className = 'keyboard-row';
      rowElement.setAttribute('tabindex', '-1'); // Exclude from tab navigation
      
      row.forEach(keyName => {
        const keyElement = this.createKeyElement(keyName);
        // Make sure this key is excluded from tab navigation
        keyElement.setAttribute('tabindex', '-1');
        rowElement.appendChild(keyElement);
      });
      
      keyboardLayout.appendChild(rowElement);
    });
    
    // Add toggle button
    const toggleButton = document.createElement('button');
    toggleButton.className = 'keyboard-toggle';
    toggleButton.textContent = 'Tastatur ausblenden';
    toggleButton.setAttribute('aria-label', 'Virtuelle Tastatur ausblenden');
    toggleButton.setAttribute('tabindex', '-1'); // Exclude from tab navigation
    toggleButton.addEventListener('click', () => this.toggle());
    
    // Assemble keyboard
    this.keyboardElement.appendChild(keyboardLayout);
    this.keyboardElement.appendChild(toggleButton);
    
    // Add to container
    this.options.container.appendChild(this.keyboardElement);
    
    // Set keyboard to be outside of tab order
    this.makeKeyboardNonTabbable();
  }
  
  // Make all keyboard elements non-tabbable
  makeKeyboardNonTabbable() {
    if (!this.keyboardElement) return;
    
    // Select all potentially focusable elements within the keyboard
    const focusableElements = this.keyboardElement.querySelectorAll(
      'button, [tabindex], a, input, select, textarea'
    );
    
    // Set all elements to have tabindex="-1"
    focusableElements.forEach(el => {
      el.setAttribute('tabindex', '-1');
    });
  }
  
  // Create individual key element
  createKeyElement(keyName) {
    const keyElement = document.createElement('button');
    keyElement.className = 'keyboard-key';
    keyElement.dataset.key = keyName.toLowerCase();
    keyElement.textContent = keyName;
    keyElement.setAttribute('aria-label', keyName);
    keyElement.setAttribute('tabindex', '-1'); // Exclude from tab order
    
    // Add specific classes for special keys
    if (['tab', 'shift', 'enter', 'escape', 'space'].includes(keyName.toLowerCase())) {
      keyElement.classList.add(`key-${keyName.toLowerCase()}`);
    }
    
    // Key action handler using mousedown instead of click to prevent focus
    keyElement.addEventListener('mousedown', (e) => {
      e.preventDefault(); // Prevent focus
      this.handleKeyPress(keyName);
    });
    
    // Additional protections against focus
    keyElement.addEventListener('focus', (e) => {
      // If this element somehow gets focus, immediately blur it
      e.target.blur();
    });
    
    return keyElement;
  }
  
  // Add required CSS styles
  addKeyboardStyles() {
    if (document.getElementById('virtual-keyboard-styles')) return;
    
    const styleEl = document.createElement('style');
    styleEl.id = 'virtual-keyboard-styles';
    styleEl.textContent = `
      .virtual-keyboard {
        position: fixed;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 9999;
        background-color: #f0f0f0;
        border-top: 2px solid #007bff;
        padding: 10px;
        box-shadow: 0 -5px 10px rgba(0, 0, 0, 0.1);
        transition: transform 0.3s ease-in-out;
        font-family: 'Barlow', sans-serif;
      }
      
      .virtual-keyboard.hidden {
        transform: translateY(100%);
      }
      
      .keyboard-layout {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }
      
      .keyboard-row {
        display: flex;
        gap: 5px;
        justify-content: center;
      }
      
      .keyboard-key {
        min-width: 50px;
        height: 40px;
        background: #fff;
        border: 1px solid #ccc;
        border-radius: 5px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        font-size: 14px;
        transition: all 0.2s;
        box-shadow: 0 2px 3px rgba(0, 0, 0, 0.1);
      }
      
      .keyboard-key:hover {
        background-color: #e6e6e6;
      }
      
      .keyboard-key:active {
        transform: translateY(2px);
        box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
      }
      
      .keyboard-key.active {
        background-color: #007bff;
        color: white;
      }
      
      .key-tab, .key-enter {
        min-width: 70px;
      }
      
      .key-space {
        min-width: 150px;
      }
      
      .key-shift, .key-escape {
        min-width: 70px;
      }
      
      .keyboard-toggle {
        display: block;
        margin: 10px auto 0;
        padding: 5px 15px;
        background-color: #007bff;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
      }
      
      .keyboard-toggle:hover {
        background-color: #0056b3;
      }
      
     
      
      .focus-indicator {
        position: absolute;
        pointer-events: none;
        border: 2px solid #007bff;
        border-radius: 3px;
        box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
        transition: all 0.2s ease-out;
        z-index: 9998;
      }
      
      @keyframes pulse {
        0% { box-shadow: 0 0 5px rgba(0, 123, 255, 0.5); }
        50% { box-shadow: 0 0 15px rgba(0, 123, 255, 0.8); }
        100% { box-shadow: 0 0 5px rgba(0, 123, 255, 0.5); }
      }
      
      .focus-indicator.active {
        animation: pulse 1.5s infinite;
      }
    `;
    
    document.head.appendChild(styleEl);
  }
  
  // Show keyboard
  show() {
    this.isVisible = true;
    this.keyboardElement.classList.remove('hidden');
    const toggleBtn = this.keyboardElement.querySelector('.keyboard-toggle');
    toggleBtn.textContent = 'Tastatur ausblenden';
    toggleBtn.setAttribute('aria-label', 'Virtuelle Tastatur ausblenden');
    
    // Create focus indicator if not exists
    if (!this.focusIndicator) {
      this.createFocusIndicator();
    }
    
    // Scan the page for interactive elements if not already done
    if (!this.tabIndexElements || this.tabIndexElements.length === 0) {
      this.scanPageForInteractiveElements();
    } else {
      // Re-scan to ensure we have the latest elements
      this.scanPageForInteractiveElements();
    }
    
    // Get the list of focusable elements
    const focusableElements = this.getFocusableElements();
    console.log(`Found ${focusableElements.length} focusable elements when showing keyboard`);
    
    // Log all the elements for debugging
    focusableElements.forEach((el, i) => {
      console.log(`Element ${i}:`, el.tagName, el.id || "(no id)", el === document.activeElement ? "ACTIVE" : "");
    });
    
    // Determine what element to focus
    let elementToFocus = document.activeElement;
    
    // If nothing is focused or body is focused, focus first element
    if (elementToFocus === document.body && focusableElements.length > 0) {
      elementToFocus = focusableElements[0];
      elementToFocus.focus();
      console.log("Focusing first element:", elementToFocus.tagName, elementToFocus.id || "(no id)");
      this.screenReader.announceMessage(`Fokus auf erstes Element gesetzt: ${this.getElementDescription(elementToFocus)}`);
    }
    
    // Update focus indicator
    this.updateFocus(document.activeElement);
    this.activeElement = document.activeElement;
    
    // Announce keyboard is visible and element count with more context
    this.screenReader.announceMessage(`Virtuelle Tastatur wurde eingeblendet. ${focusableElements.length} interaktive Elemente auf der Seite gefunden. Verwenden Sie die Tasten zur Navigation.`);
    
    // Make keyboard non-focusable to prevent tab key from going into the keyboard UI
    const keyboardElements = this.keyboardElement.querySelectorAll('button');
    keyboardElements.forEach(el => {
      el.setAttribute('tabindex', '-1');
    });
  }
  
  // Hide keyboard
  hide() {
    this.isVisible = false;
    this.keyboardElement.classList.add('hidden');
    const toggleBtn = this.keyboardElement.querySelector('.keyboard-toggle');
    toggleBtn.textContent = 'Tastatur einblenden';
    toggleBtn.setAttribute('aria-label', 'Virtuelle Tastatur einblenden');
    
    if (this.focusIndicator) {
      this.focusIndicator.style.display = 'none';
    }
    
    // Announce keyboard is hidden with more context
    this.screenReader.announceMessage('Virtuelle Tastatur wurde ausgeblendet. Tastaturunterstützung deaktiviert.');
  }
  
  // Toggle keyboard visibility
  toggle() {
    if (this.isVisible) {
      this.hide();
    } else {
      this.show();
    }
  }
  
  // Create focus indicator element
  createFocusIndicator() {
    this.focusIndicator = document.createElement('div');
    this.focusIndicator.className = 'focus-indicator';
    this.focusIndicator.style.display = 'none';
    document.body.appendChild(this.focusIndicator);
  }
  
  // Update focus indicator position
  updateFocus(element) {
    console.log("Updating focus to:", element ? (element.tagName + (element.id ? ` #${element.id}` : '')) : 'none');
    
    if (!element || element === document.body) {
      if (this.focusIndicator) {
        this.focusIndicator.style.display = 'none';
      }
      return;
    }
    
    // Update our active element reference
    this.activeElement = element;
    
    // Update focus indicator if keyboard is visible
    if (this.isVisible && this.focusIndicator) {
      // Get element position and dimensions
      const rect = element.getBoundingClientRect();
      
      // Position the focus indicator
      this.focusIndicator.style.display = 'block';
      this.focusIndicator.style.top = `${rect.top - 3}px`;
      this.focusIndicator.style.left = `${rect.left - 3}px`;
      this.focusIndicator.style.width = `${rect.width + 6}px`;
      this.focusIndicator.style.height = `${rect.height + 6}px`;
      this.focusIndicator.classList.add('active');
      
      // Ensure the element has focus (this is needed for some elements that might not take focus properly)
      if (document.activeElement !== element) {
        try {
          element.focus();
        } catch (e) {
          console.warn("Could not focus element:", e);
        }
      }
    }
    
    // For debugging - print all focusable elements to see current tab order
    if (console.groupCollapsed) {
      console.groupCollapsed('Current focusable elements');
      const focusableElements = this.getFocusableElements();
      focusableElements.forEach((el, i) => {
        const isActive = el === element;
        console.log(
          `${i}: ${el.tagName}${el.id ? ` #${el.id}` : ''}${isActive ? ' [ACTIVE]' : ''}`
        );
      });
      console.groupEnd();
    }
  }
  
  // Handle key press events
  handleKeyPress(keyName) {
    console.log(`Virtual key pressed: ${keyName}`);
    
    // Special handling for Tab which doesn't require an active element
    if (keyName.toLowerCase() === 'tab') {
      this.handleTabNavigation();
      return;
    }
    
    // For other keys, we need an active element
    if (!this.activeElement) {
      console.log("No active element for key press:", keyName);
      
      // If no active element but we have focusable elements, focus the first one
      const focusableElements = this.getFocusableElements();
      if (focusableElements.length > 0) {
        focusableElements[0].focus();
        this.activeElement = focusableElements[0];
        this.updateFocus(this.activeElement);
      } else {
        return; // No elements to focus
      }
    }
    
    // Now process the key press with an active element
    switch (keyName.toLowerCase()) {
      case 'shift':
        this.toggleShift();
        break;
      case '←':
      case '→':
      case '↑':
      case '↓':
        this.handleArrowKeys(keyName);
        break;
      case 'enter':
        this.simulateEnterPress();
        break;
      case 'space':
        this.simulateSpacePress();
        break;
      case 'escape':
        this.simulateEscapePress();
        break;
      default:
        console.log(`No handler for key: ${keyName}`);
        break;
    }
  }
  
  // Handle Tab key navigation
  handleTabNavigation() {
    // Get all focusable elements on the page, excluding our own UI
    const focusableElements = this.getFocusableElements();
    console.log("Elements for tab navigation:", focusableElements.length);
    
    if (focusableElements.length === 0) {
      console.log("No focusable elements found");
      return;
    }
    
    // Get the current focused element
    const currentElement = document.activeElement;
    console.log("Current active element:", 
      currentElement ? `${currentElement.tagName} ${currentElement.id ? '#'+currentElement.id : ''}` : 'none');
    
    // Find the index of the current element in our list
    let currentIndex = -1;
    
    // Look for the current active element in our list
    for (let i = 0; i < focusableElements.length; i++) {
      if (focusableElements[i] === currentElement) {
        currentIndex = i;
        console.log("Found current element at index:", i);
        break;
      }
    }
    
    // Special case: if the current element is not in our list (could be our UI),
    // try to determine if it's a keyboard/screenreader element and ignore it
    if (currentIndex === -1) {
      console.log("Current element not in focusable list");
      
      // Check if current element is part of our UI
      const isKeyboardElement = this.keyboardElement && 
        (this.keyboardElement.contains(currentElement) || this.keyboardElement === currentElement);
      
      const isScreenreaderElement = this.screenReader && this.screenReader.outputElement && 
        (this.screenReader.outputElement.contains(currentElement) || 
         this.screenReader.outputElement === currentElement ||
         (this.screenReader.restoreButton && this.screenReader.restoreButton === currentElement));
      
      // If it's part of our UI, just use the first focusable element
      if (isKeyboardElement || isScreenreaderElement) {
        console.log("Current element is UI element, starting from first element");
        currentIndex = -1; // Will select first element below
      } else {
        // Not our UI, probably a real element but not in our list for some reason
        console.log("Current element not found in list, starting from beginning");
      }
    }
    
    // Determine the next focus target
    let nextIndex;
    
    if (this.shiftPressed) {
      // Shift+Tab: Go backwards
      if (currentIndex <= 0) {
        // If at the first element or not found (-1), go to the last element
        nextIndex = focusableElements.length - 1;
      } else {
        // Otherwise go to the previous element
        nextIndex = currentIndex - 1;
      }
    } else {
      // Tab: Go forwards
      if (currentIndex >= focusableElements.length - 1) {
        // If at the last element, go to the first element
        nextIndex = 0;
      } else if (currentIndex === -1) {
        // If current element not found, start at the beginning
        nextIndex = 0;
      } else {
        // Otherwise go to the next element
        nextIndex = currentIndex + 1;
      }
    }
    
    // Get next element to focus
    const nextElement = focusableElements[nextIndex];
    console.log("Moving focus to:", 
      nextElement ? `${nextElement.tagName} ${nextElement.id ? '#'+nextElement.id : ''}` : 'none');
    
    if (nextElement) {
      // Delay focus slightly to avoid potential race conditions
      setTimeout(() => {
        try {
          // Focus the next element
          nextElement.focus();
          
          // Update our active element
          this.activeElement = nextElement;
          
          // Update focus indicator
          this.updateFocus(nextElement);
          
          // Announce the element description for screen reader with more context
          const description = this.getElementDescription(nextElement);
          this.screenReader.announceMessage(`Navigation ${this.shiftPressed ? 'rückwärts' : 'vorwärts'} zu Element: ${description}`);
        } catch (e) {
          console.error("Error focusing element:", e);
        }
      }, 0);
    } else {
      console.error("Next element was not found!");
    }
  }
  
  // Toggle Shift key state
  toggleShift() {
    this.shiftPressed = !this.shiftPressed;
    const shiftKey = this.keyboardElement.querySelector('.key-shift');
    
    if (this.shiftPressed) {
      shiftKey.classList.add('active');
      this.screenReader.announceMessage('Umschalttaste aktiviert. Tab-Navigation erfolgt rückwärts.');
    } else {
      shiftKey.classList.remove('active');
      this.screenReader.announceMessage('Umschalttaste deaktiviert. Tab-Navigation erfolgt vorwärts.');
    }
  }
  
  // Handle arrow key navigation
  handleArrowKeys(key) {
    if (!this.activeElement) return;
    
    const isInput = this.activeElement.tagName === 'INPUT' || 
                    this.activeElement.tagName === 'TEXTAREA' || 
                    this.activeElement.tagName === 'SELECT';
                    
    // For text inputs, move cursor
    if (isInput && (this.activeElement.type === 'text' || this.activeElement.type === 'textarea' || this.activeElement.type === 'search' || this.activeElement.type === 'url' || this.activeElement.type === 'email')) {
      const start = this.activeElement.selectionStart;
      const end = this.activeElement.selectionEnd;
      
      switch (key) {
        case '←': // Left arrow
          if (start > 0) {
            this.activeElement.setSelectionRange(start - 1, start - 1);
            // Get a description of the field
            const elementDesc = this.getElementDescription(this.activeElement);
            this.screenReader.announceMessage(`Cursor nach links bewegt in ${elementDesc}`);
          }
          break;
        case '→': // Right arrow
          if (start < this.activeElement.value.length) {
            this.activeElement.setSelectionRange(start + 1, start + 1);
            // Get a description of the field
            const elementDesc = this.getElementDescription(this.activeElement);
            this.screenReader.announceMessage(`Cursor nach rechts bewegt in ${elementDesc}`);
          }
          break;
        case '↑': // Up arrow
          // For multi-line text areas, move to previous line
          if (this.activeElement.tagName === 'TEXTAREA') {
            // This is a simplification, ideally we'd calculate exact cursor position
            const lines = this.activeElement.value.split('\n');
            const currentPos = this.activeElement.selectionStart;
            const currentLine = this.activeElement.value.substring(0, currentPos).split('\n').length - 1;
            
            if (currentLine > 0) {
              // Move cursor to same position in previous line
              const previousLineStart = this.activeElement.value.split('\n').slice(0, currentLine).join('\n').length;
              const newPos = Math.min(previousLineStart + (currentPos - this.activeElement.value.substring(0, currentPos).lastIndexOf('\n') - 1), 
                                     previousLineStart + lines[currentLine - 1].length);
              
              this.activeElement.setSelectionRange(newPos, newPos);
              // Get a description of the field
              const elementDesc = this.getElementDescription(this.activeElement);
              this.screenReader.announceMessage(`Cursor nach oben bewegt in ${elementDesc}`);
            }
          }
          break;
        case '↓': // Down arrow
          // For multi-line text areas, move to next line
          if (this.activeElement.tagName === 'TEXTAREA') {
            // This is a simplification, ideally we'd calculate exact cursor position
            const lines = this.activeElement.value.split('\n');
            const currentPos = this.activeElement.selectionStart;
            const currentLine = this.activeElement.value.substring(0, currentPos).split('\n').length - 1;
            
            if (currentLine < lines.length - 1) {
              // Move cursor to same position in next line
              const nextLineStart = this.activeElement.value.split('\n').slice(0, currentLine + 1).join('\n').length + 1;
              const newPos = Math.min(nextLineStart + (currentPos - this.activeElement.value.substring(0, currentPos).lastIndexOf('\n') - 1), 
                                     nextLineStart + lines[currentLine + 1].length);
              
              this.activeElement.setSelectionRange(newPos, newPos);
              // Get a description of the field
              const elementDesc = this.getElementDescription(this.activeElement);
              this.screenReader.announceMessage(`Cursor nach unten bewegt in ${elementDesc}`);
            }
          }
          break;
      }
      return;
    }
    
    // For select elements, navigate options
    if (isInput && this.activeElement.tagName === 'SELECT') {
      switch (key) {
        case '↑': // Up arrow
          if (this.activeElement.selectedIndex > 0) {
            this.activeElement.selectedIndex--;
            this.activeElement.dispatchEvent(new Event('change', { bubbles: true }));
            // Get select field description
            const selectDesc = this.getElementDescription(this.activeElement);
            const optionText = this.activeElement.options[this.activeElement.selectedIndex].text;
            this.screenReader.announceMessage(`Option "${optionText}" ausgewählt in Auswahlmenü ${selectDesc}`);
          }
          break;
        case '↓': // Down arrow
          if (this.activeElement.selectedIndex < this.activeElement.options.length - 1) {
            this.activeElement.selectedIndex++;
            this.activeElement.dispatchEvent(new Event('change', { bubbles: true }));
            // Get select field description
            const selectDesc = this.getElementDescription(this.activeElement);
            const optionText = this.activeElement.options[this.activeElement.selectedIndex].text;
            this.screenReader.announceMessage(`Option "${optionText}" ausgewählt in Auswahlmenü ${selectDesc}`);
          }
          break;
      }
      return;
    }
    
    // For other elements, use spatial navigation to find the closest element in the specified direction
    const rect = this.activeElement.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Get all focusable elements
    const focusableElements = this.getFocusableElements();
    if (focusableElements.length <= 1) return; // No other elements to navigate to
    
    // Variables to track our best candidate
    let nextElement = null;
    let bestScore = -Infinity;
    
    // Weights for scoring (directional bias is stronger than proximity)
    const DIRECTION_WEIGHT = 100;   // Higher = more important to be in right direction
    const DISTANCE_WEIGHT = -0.1;   // Negative = closer is better
    const ALIGNMENT_WEIGHT = 50;    // Higher = better aligned with current element
    
    focusableElements.forEach(element => {
      if (element === this.activeElement) return;
      
      const elRect = element.getBoundingClientRect();
      const elCenterX = elRect.left + elRect.width / 2;
      const elCenterY = elRect.top + elRect.height / 2;
      
      // Calculate distance between elements
      const distance = Math.sqrt(Math.pow(centerX - elCenterX, 2) + Math.pow(centerY - elCenterY, 2));
      if (distance === 0) return; // Skip identical positions
      
      // Determine if element is in the correct direction
      let inDirection = false;
      let alignmentFactor = 0;
      let score = 0;
      
      switch (key) {
        case '←': // Left arrow
          inDirection = elCenterX < centerX;
          alignmentFactor = 1 - Math.abs(elCenterY - centerY) / distance; // How horizontally aligned
          break;
        case '→': // Right arrow
          inDirection = elCenterX > centerX;
          alignmentFactor = 1 - Math.abs(elCenterY - centerY) / distance; // How horizontally aligned
          break;
        case '↑': // Up arrow
          inDirection = elCenterY < centerY;
          alignmentFactor = 1 - Math.abs(elCenterX - centerX) / distance; // How vertically aligned
          break;
        case '↓': // Down arrow
          inDirection = elCenterY > centerY;
          alignmentFactor = 1 - Math.abs(elCenterX - centerX) / distance; // How vertically aligned
          break;
      }
      
      // Calculate score based on direction, alignment and distance
      // Only consider elements that are in the right direction
      if (inDirection) {
        score = DIRECTION_WEIGHT + (ALIGNMENT_WEIGHT * alignmentFactor) + (DISTANCE_WEIGHT * distance);
        
        // Update best candidate if this element has a better score
        if (score > bestScore) {
          bestScore = score;
          nextElement = element;
        }
      }
    });
    
    // Navigate to best candidate if found
    if (nextElement) {
      // Focus the element
      nextElement.focus();
      
      // Provide descriptive feedback for screen reader
      const elementDesc = this.getElementDescription(nextElement);
      
      // Announce direction and target with more detailed context
      switch (key) {
        case '←': 
          this.screenReader.announceMessage(`Räumliche Navigation nach links zu Element: ${elementDesc}`); 
          break;
        case '→': 
          this.screenReader.announceMessage(`Räumliche Navigation nach rechts zu Element: ${elementDesc}`); 
          break;
        case '↑': 
          this.screenReader.announceMessage(`Räumliche Navigation nach oben zu Element: ${elementDesc}`); 
          break;
        case '↓': 
          this.screenReader.announceMessage(`Räumliche Navigation nach unten zu Element: ${elementDesc}`); 
          break;
      }
    } else {
      // No suitable element found in this direction
      this.screenReader.announceMessage(`Kein Element in diese Richtung gefunden`);
    }
  }
  
  // Simulate Enter key press
  simulateEnterPress() {
    if (!this.activeElement) return;
    
    // For buttons and links, click them
    if (this.activeElement.tagName === 'BUTTON' || 
        this.activeElement.tagName === 'A' || 
        this.activeElement.getAttribute('role') === 'button') {
      this.activeElement.click();
      // Get more descriptive information about what was activated
      const elementDesc = this.getElementDescription(this.activeElement);
      this.screenReader.announceMessage(`Element aktiviert: ${elementDesc}`);
      return;
    }
    
    // For forms, submit them
    if (this.activeElement.form) {
      const submitBtn = this.activeElement.form.querySelector('button[type="submit"]');
      // Get form description for better context
      const formDesc = this.activeElement.form.getAttribute('aria-labelledby') ? 
                       document.getElementById(this.activeElement.form.getAttribute('aria-labelledby'))?.textContent || 'Formular' : 
                       'Formular';
      
      if (submitBtn) {
        submitBtn.click();
        const btnDesc = this.getElementDescription(submitBtn);
        this.screenReader.announceMessage(`${formDesc} gesendet mit Aktion: ${btnDesc}`);
      } else {
        this.activeElement.form.submit();
        this.screenReader.announceMessage(`${formDesc} wurde abgesendet`);
      }
    }
  }
  
  // Simulate Space key press
  simulateSpacePress() {
    if (!this.activeElement) return;
    
    // For checkboxes and radio buttons, toggle them
    if (this.activeElement.tagName === 'INPUT' && 
        (this.activeElement.type === 'checkbox' || this.activeElement.type === 'radio')) {
      this.activeElement.checked = !this.activeElement.checked;
      this.activeElement.dispatchEvent(new Event('change', { bubbles: true }));
      
      // Get a description of what was selected
      const elementDesc = this.getElementDescription(this.activeElement);
      const inputType = this.activeElement.type === 'checkbox' ? 'Kontrollkästchen' : 'Optionsfeld';
      
      this.screenReader.announceMessage(
        `${inputType} ${elementDesc}: ${this.activeElement.checked ? 'ausgewählt' : 'nicht ausgewählt'}`
      );
      return;
    }
    
    // For buttons, click them
    if (this.activeElement.tagName === 'BUTTON' || 
        this.activeElement.getAttribute('role') === 'button') {
      this.activeElement.click();
      // Get better description of what was activated
      const elementDesc = this.getElementDescription(this.activeElement);
      this.screenReader.announceMessage(`Schaltfläche aktiviert: ${elementDesc}`);
      return;
    }
    
    // For text inputs, add a space
    if (this.activeElement.tagName === 'INPUT' && 
        (this.activeElement.type === 'text' || this.activeElement.type === 'search')) {
      const start = this.activeElement.selectionStart;
      const end = this.activeElement.selectionEnd;
      const value = this.activeElement.value;
      
      this.activeElement.value = value.substring(0, start) + ' ' + value.substring(end);
      this.activeElement.setSelectionRange(start + 1, start + 1);
      this.activeElement.dispatchEvent(new Event('input', { bubbles: true }));
      
      // Get better context for the input field
      const elementDesc = this.getElementDescription(this.activeElement);
      this.screenReader.announceMessage(`Leerzeichen eingefügt in Textfeld: ${elementDesc}`)
    }
  }
  
  // Simulate Escape key press
  simulateEscapePress() {
    // Close dialogs, modals, or dropdowns if any
    const dialogs = document.querySelectorAll('[role="dialog"], [aria-modal="true"]');
    if (dialogs.length > 0) {
      const dialog = dialogs[dialogs.length - 1];
      const closeBtn = dialog.querySelector('[aria-label="Close"], .close, .btn-close');
      
      // Get dialog title or description for better context
      let dialogDesc = dialog.getAttribute('aria-label') || 
                      (dialog.getAttribute('aria-labelledby') ? 
                        document.getElementById(dialog.getAttribute('aria-labelledby'))?.textContent : 
                        'Dialog');
      
      if (closeBtn) {
        closeBtn.click();
        this.screenReader.announceMessage(`${dialogDesc} wurde geschlossen`);
      }
    }
    
    // Fire an escape event on document
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', code: 'Escape', bubbles: true }));
    
    // Check if we're in a focused input field to provide better context
    if (this.activeElement && 
       (this.activeElement.tagName === 'INPUT' || this.activeElement.tagName === 'TEXTAREA')) {
      const elementDesc = this.getElementDescription(this.activeElement);
      this.screenReader.announceMessage(`Escape-Taste: Eingabe in ${elementDesc} abgebrochen`);
    } else {
      this.screenReader.announceMessage('Escape-Taste: Aktion abgebrochen');
    }
  }
  
  // Get all focusable elements in the document
  getFocusableElements() {
    // Define selector for all naturally focusable elements and those with tabindex>=0
    const focusableSelectors = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"]), [role="button"], [role="link"], [role="checkbox"], [role="radio"], [role="tab"], [role="menuitem"], [role="slider"], [role="switch"]';
    
    // Get all focusable elements and filter out our own keyboard elements and invisible elements
    const elements = Array.from(document.querySelectorAll(focusableSelectors))
      .filter(el => {
        // Exclude keyboard elements
        if (this.keyboardElement && (this.keyboardElement.contains(el) || this.keyboardElement === el)) {
          return false;
        }
        
        // Exclude screenreader elements
        if (this.screenReader && this.screenReader.outputElement && 
            (this.screenReader.outputElement.contains(el) || this.screenReader.outputElement === el)) {
          return false;
        }
        
        // Exclude restore button for screenreader
        if (this.screenReader && this.screenReader.restoreButton && 
            (this.screenReader.restoreButton === el)) {
          return false;
        }
        
        // Exclude focus indicator
        if (this.focusIndicator && (this.focusIndicator === el || this.focusIndicator.contains(el))) {
          return false;
        }
        
        // Exclude elements that are not visible
        if (!this.isElementVisible(el)) {
          return false;
        }
        
        // Exclude elements that explicitly have tabindex="-1"
        if (el.getAttribute('tabindex') === '-1') {
          return false;
        }
        
        // Check for parent with role="application" that might be our keyboard or screenreader
        let parent = el.parentElement;
        while (parent) {
          if (parent.getAttribute('role') === 'application' && 
              (parent.classList.contains('virtual-keyboard') || 
               parent.classList.contains('screen-reader-output'))) {
            return false;
          }
          parent = parent.parentElement;
        }
        
        // Include all other elements
        return true;
      });
    
    // Debug output
    console.log('Found elements to tab through:', elements.length);
    elements.forEach((el, i) => {
      console.log(`  ${i}: ${el.tagName} ${el.id ? '#'+el.id : ''} ${el.className ? '.'+el.className.replace(/ /g, '.') : ''}`);
    });
    
    // Custom sorting function to match browser tab order:
    // 1. Elements with positive tabindex in ascending order
    // 2. Elements with tabindex="0" or naturally focusable in DOM order
    return elements.sort((a, b) => {
      const aTabIndex = parseInt(a.getAttribute('tabindex') || '0', 10);
      const bTabIndex = parseInt(b.getAttribute('tabindex') || '0', 10);
      
      // Both elements have positive tabindex, sort by value
      if (aTabIndex > 0 && bTabIndex > 0) {
        return aTabIndex - bTabIndex;
      }
      
      // Element a has positive tabindex, it comes first
      if (aTabIndex > 0) return -1;
      
      // Element b has positive tabindex, it comes first
      if (bTabIndex > 0) return 1;
      
      // Both are tabindex="0" or naturally focusable, use DOM order
      return 0;
    });
  }
  
  // Check if an element is visible - renamed to avoid conflict with isVisible property
  isElementVisible(element) {
    return !!(element.offsetWidth || element.offsetHeight || element.getClientRects().length);
  }
  
  // Scan the page for all interactive elements
  scanPageForInteractiveElements() {
    console.log('Scanning page for interactive elements...');
    
    // Store the current focused element
    const currentFocused = document.activeElement;
    
    // Get all tabindex elements
    this.tabIndexElements = this.getFocusableElements();
    
    console.log(`Found ${this.tabIndexElements.length} interactive elements`);
    
    // If there are elements and we should auto-focus the first one
    if (this.tabIndexElements.length > 0 && this.isVisible) {
      // Focus the first element when keyboard becomes visible
      if (document.activeElement === document.body) {
        this.tabIndexElements[0].focus();
        this.updateFocus(this.tabIndexElements[0]);
        this.screenReader.announceMessage(`Fokus auf erstes Element gesetzt: ${this.getElementDescription(this.tabIndexElements[0])}`);
      } else {
        // Otherwise, update focus indicator for current element
        this.updateFocus(currentFocused);
      }
    }
    
    // Set up MutationObserver to detect new interactive elements
    this.setupDOMObserver();
  }
  
  // Get a descriptive name for an element (for screen reader announcements)
  getElementDescription(element) {
    if (!element) return 'Unbekanntes Element';
    
    // Check aria-label first
    if (element.hasAttribute('aria-label')) {
      return element.getAttribute('aria-label');
    }
    
    // Check aria-labelledby attribute
    if (element.hasAttribute('aria-labelledby')) {
      const labelId = element.getAttribute('aria-labelledby');
      const labelElement = document.getElementById(labelId);
      if (labelElement) {
        return labelElement.textContent.trim();
      }
    }
    
    // Check for label associated with the element
    if (element.id) {
      const label = document.querySelector(`label[for="${element.id}"]`);
      if (label) {
        return label.textContent.trim();
      }
    }
    
    // Check placeholder for input elements
    if (element.tagName === 'INPUT' && element.placeholder) {
      return `${element.placeholder} (Eingabefeld)`;
    }
    
    // Check element text content
    if (element.textContent && element.textContent.trim()) {
      return element.textContent.trim();
    }
    
    // Check name attribute for form elements
    if ((element.tagName === 'INPUT' || element.tagName === 'SELECT' || 
         element.tagName === 'TEXTAREA') && element.name) {
      return `Feld: ${element.name}`;
    }
    
    // More descriptive fallback based on element type
    if (element.tagName === 'A') {
      return `Link ${element.getAttribute('href') ? 'zu ' + element.getAttribute('href') : ''}`;
    } else if (element.tagName === 'BUTTON') {
      return `Schaltfläche ${element.type ? element.type : ''}`;
    } else if (element.tagName === 'INPUT') {
      const inputTypes = {
        'text': 'Texteingabefeld',
        'password': 'Passwortfeld',
        'checkbox': 'Kontrollkästchen',
        'radio': 'Optionsfeld',
        'submit': 'Absenden-Schaltfläche',
        'date': 'Datumsauswahl',
        'time': 'Zeitauswahl',
        'email': 'E-Mail-Eingabefeld',
        'number': 'Zahleneingabefeld',
        'tel': 'Telefonnummer-Eingabefeld',
        'search': 'Suchfeld'
      };
      return inputTypes[element.type] || `Eingabefeld vom Typ ${element.type}`;
    } else if (element.tagName === 'SELECT') {
      return 'Auswahlmenü';
    } else if (element.tagName === 'TEXTAREA') {
      return 'Mehrzeiliges Textfeld';
    }
    
    // Fallback to tag name + additional context
    let description = element.tagName.toLowerCase();
    if (element.classList && element.classList.length > 0) {
      description += ` (Klasse: ${element.classList[0]})`;
    } else if (element.id) {
      description += ` (ID: ${element.id})`;
    }
    
    return description;
  }
  
  // Set up observer to detect DOM changes that add/remove interactive elements
  setupDOMObserver() {
    // Disconnect any existing observer
    if (this.domObserver) {
      this.domObserver.disconnect();
    }
    
    // Create new mutation observer
    this.domObserver = new MutationObserver((mutations) => {
      let needsRescan = false;
      
      mutations.forEach(mutation => {
        // If nodes were added or removed
        if (mutation.type === 'childList') {
          // Check if any added nodes might be focusable
          mutation.addedNodes.forEach(node => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              if (node.matches('a, button, input, select, textarea, [tabindex]') || 
                  node.querySelector('a, button, input, select, textarea, [tabindex]')) {
                needsRescan = true;
              }
            }
          });
          
          // Check if any removed nodes were focusable
          mutation.removedNodes.forEach(node => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              if (node.matches('a, button, input, select, textarea, [tabindex]') || 
                  node.querySelector('a, button, input, select, textarea, [tabindex]')) {
                needsRescan = true;
              }
            }
          });
        }
        
        // If attributes changed that could affect focusability
        if (mutation.type === 'attributes') {
          if (['tabindex', 'disabled', 'aria-hidden'].includes(mutation.attributeName)) {
            needsRescan = true;
          }
        }
      });
      
      // If we detected changes that might affect focusable elements, rescan
      if (needsRescan) {
        this.tabIndexElements = this.getFocusableElements();
      }
    });
    
    // Start observing
    this.domObserver.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['tabindex', 'disabled', 'aria-hidden']
    });
  }
  
  // Bind global events
  bindGlobalEvents() {
    // Track focus changes
    document.addEventListener('focusin', (e) => {
      this.updateFocus(e.target);
    });
    
    // Track real keyboard events to sync state with physical keyboard
    document.addEventListener('keydown', (e) => {
      // Alt+K to toggle keyboard
      if (e.altKey && e.key === 'k') {
        e.preventDefault();
        this.toggle();
      }
      
      // Support for physical Tab key navigation
      if (e.key === 'Tab') {
        console.log("Physical Tab key pressed, shiftKey:", e.shiftKey);
        
        // Only intercept Tab key if the virtual keyboard is visible
        if (this.isVisible) {
          // Prevent browser's default tab behavior
          e.preventDefault();
          
          // Update shift state
          this.shiftPressed = e.shiftKey;
          
          // Navigate with Tab
          this.handleTabNavigation();
          
          // Highlight the Tab key
          const tabKey = this.keyboardElement.querySelector('.key-tab');
          if (tabKey) {
            tabKey.classList.add('active');
            setTimeout(() => {
              tabKey.classList.remove('active');
            }, 200);
          }
        } else {
          // Let the browser handle tab navigation normally when virtual keyboard is hidden
          console.log("Tab key handled by browser (keyboard hidden)");
        }
        
        return;
      }
      
      // Update modifier key states
      if (e.key === 'Shift') {
        this.shiftPressed = true;
        const shiftKey = this.keyboardElement.querySelector('.key-shift');
        if (shiftKey) shiftKey.classList.add('active');
      }
      
      if (e.key === 'Control') {
        this.ctrlPressed = true;
        const ctrlKey = this.keyboardElement.querySelector('[data-key="ctrl"]');
        if (ctrlKey) ctrlKey.classList.add('active');
      }
      
      if (e.key === 'Alt') {
        this.altPressed = true;
        const altKey = this.keyboardElement.querySelector('[data-key="alt"]');
        if (altKey) altKey.classList.add('active');
      }
      
      // Synchronize virtual keyboard with real keyboard events
      if (this.isVisible) {
        // Highlight corresponding virtual key when physical key is pressed
        const keyMap = {
          'Escape': 'escape',
          'Tab': 'tab',
          'Enter': 'enter',
          'Space': 'space',
          ' ': 'space',
          'ArrowLeft': '←',
          'ArrowRight': '→',
          'ArrowUp': '↑',
          'ArrowDown': '↓'
        };
        
        const virtualKeyName = keyMap[e.key] || e.key.toLowerCase();
        const virtualKey = this.keyboardElement.querySelector(`[data-key="${virtualKeyName}"]`);
        
        if (virtualKey) {
          virtualKey.classList.add('active');
          
          // Remove active class after a brief delay
          setTimeout(() => {
            virtualKey.classList.remove('active');
          }, 200);
        }
      }
    });
    
    // Track keyup for modifier keys
    document.addEventListener('keyup', (e) => {
      if (e.key === 'Shift') {
        this.shiftPressed = false;
        const shiftKey = this.keyboardElement.querySelector('.key-shift');
        if (shiftKey) shiftKey.classList.remove('active');
      }
      
      if (e.key === 'Control') {
        this.ctrlPressed = false;
        const ctrlKey = this.keyboardElement.querySelector('[data-key="ctrl"]');
        if (ctrlKey) ctrlKey.classList.remove('active');
      }
      
      if (e.key === 'Alt') {
        this.altPressed = false;
        const altKey = this.keyboardElement.querySelector('[data-key="alt"]');
        if (altKey) altKey.classList.remove('active');
      }
    });
    
    // Let the screen reader handle its own global events
    this.screenReader.bindGlobalEvents();
    
    // Listen for page changes that might affect focusable elements
    window.addEventListener('load', () => this.scanPageForInteractiveElements());
    window.addEventListener('DOMContentLoaded', () => this.scanPageForInteractiveElements());
    window.addEventListener('hashchange', () => this.scanPageForInteractiveElements());
    
    // Re-scan elements when visibility changes (in case content was lazy-loaded)
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        setTimeout(() => this.scanPageForInteractiveElements(), 500);
      }
    });
  }
  
  // Destroy keyboard and clean up
  destroy() {
    // Remove DOM elements
    if (this.keyboardElement && this.keyboardElement.parentNode) {
      this.keyboardElement.parentNode.removeChild(this.keyboardElement);
    }
    
    if (this.focusIndicator && this.focusIndicator.parentNode) {
      this.focusIndicator.parentNode.removeChild(this.focusIndicator);
    }
    
    // Clean up event listeners
    document.removeEventListener('focusin', this.updateFocus);
    document.removeEventListener('visibilitychange', this.scanPageForInteractiveElements);
    window.removeEventListener('load', this.scanPageForInteractiveElements);
    window.removeEventListener('DOMContentLoaded', this.scanPageForInteractiveElements);
    window.removeEventListener('hashchange', this.scanPageForInteractiveElements);
    
    // Disconnect observers
    if (this.domObserver) {
      this.domObserver.disconnect();
      this.domObserver = null;
    }
    
    // Clean up screen reader
    this.screenReader.destroy();
    
    // Clear references
    this.keyboardElement = null;
    this.focusIndicator = null;
    this.tabIndexElements = [];
    this.activeElement = null;
  }
}

// KeyboardManager - Handles multiple keyboard instances and provides a simple API
class KeyboardManager {
  constructor() {
    this.keyboards = {};
    this.screenReaders = {};
  }
  
  // Create a new keyboard instance
  create(id, options = {}) {
    if (this.keyboards[id]) {
      console.warn(`Keyboard with ID "${id}" already exists.`);
      return this.keyboards[id];
    }
    
    this.keyboards[id] = new VirtualKeyboard(options);
    return this.keyboards[id];
  }
  
  // Create a standalone screen reader instance (without keyboard)
  createScreenReader(id, options = {}) {
    if (this.screenReaders[id]) {
      console.warn(`ScreenReader with ID "${id}" already exists.`);
      return this.screenReaders[id];
    }
    
    this.screenReaders[id] = new ScreenReader(options);
    return this.screenReaders[id];
  }
  
  // Get a keyboard instance by ID
  getKeyboard(id) {
    return this.keyboards[id];
  }
  
  // Get a screen reader instance by ID
  getScreenReader(id) {
    return this.screenReaders[id] || 
           (this.keyboards[id] ? this.keyboards[id].screenReader : null);
  }
  
  // Show a keyboard
  show(id) {
    const keyboard = this.keyboards[id];
    if (keyboard) {
      keyboard.show();
    }
  }
  
  // Hide a keyboard
  hide(id) {
    const keyboard = this.keyboards[id];
    if (keyboard) {
      keyboard.hide();
    }
  }
  
  // Toggle a keyboard
  toggle(id) {
    const keyboard = this.keyboards[id];
    if (keyboard) {
      keyboard.toggle();
    }
  }
  
  // Announce a custom message with screen reader
  announce(id, message) {
    const screenReader = this.getScreenReader(id);
    if (screenReader) {
      screenReader.announceMessage(message);
    }
  }
  
  // Destroy a keyboard instance
  destroy(id) {
    // Destroy keyboard if exists
    if (this.keyboards[id]) {
      this.keyboards[id].destroy();
      delete this.keyboards[id];
    }
    
    // Destroy standalone screen reader if exists
    if (this.screenReaders[id]) {
      this.screenReaders[id].destroy();
      delete this.screenReaders[id];
    }
  }
}

// Create global keyboard manager instance
window.KeyboardManager = new KeyboardManager();