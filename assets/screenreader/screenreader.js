/**
 * Screenreader - A reusable screenreader simulation component
 * Features:
 * - SOLID principles and OO design
 * - Animated focus indicator
 * - Screen reader simulation output
 * - Proper handling of hidden elements
 */
// ScreenReader class - handles screen reader functionality
class ScreenReader {
  constructor(options = {}) {
    // Default options
    this.options = {
      container: document.body,
      showOutput: true,
      maxOutputEntries: 50,
      enableSpeech: true, // Default speech synthesis is enabled
      ...options
    };
    
    // Internal state
    this.activeElement = null;
    this.outputElement = null;
    this.outputContent = null;
    
    // Check if speech synthesis is available
    this.speechAvailable = 'speechSynthesis' in window;
    
    // Load speech preference from localStorage if available
    try {
      const savedSpeechEnabled = localStorage.getItem('screenReaderSpeechEnabled');
      this.speechEnabled = savedSpeechEnabled !== null ? 
        savedSpeechEnabled === 'true' : 
        this.options.enableSpeech;
    } catch (e) {
      this.speechEnabled = this.options.enableSpeech;
      console.error('Could not load speech preference:', e);
    }
    
    // Handle speech voices loading - they may not be available immediately
    if (this.speechAvailable) {
      // Some browsers need a little time to get voices
      if (window.speechSynthesis.getVoices().length === 0) {
        window.speechSynthesis.onvoiceschanged = () => {
          // Just capture the event - voices will be accessed when needed
          console.log('Speech synthesis voices are now available');
        };
      }
    }
    
    // Initialize if needed
    if (this.options.showOutput) {
      this.createOutput();
    }
  }
  
  // Create screen reader output area
  createOutput() {
    this.outputElement = document.createElement('div');
    this.outputElement.className = 'screen-reader-output';
    this.outputElement.setAttribute('aria-live', 'polite');
    
    // Ensure the output element is not focusable
    this.outputElement.setAttribute('tabindex', '-1');
    this.outputElement.setAttribute('aria-hidden', 'true'); // Hide from screen readers
    
    // Create header with draggable handle
    const headerElement = document.createElement('div');
    headerElement.className = 'sr-output-header';
    headerElement.style.cursor = 'move';
    headerElement.style.padding = '5px';
    headerElement.style.backgroundColor = '#f0f0f0';
    headerElement.style.borderBottom = '1px solid #ddd';
    headerElement.style.display = 'flex';
    headerElement.style.justifyContent = 'space-between';
    headerElement.style.alignItems = 'center';
    headerElement.setAttribute('tabindex', '-1');
    
    const heading = document.createElement('h3');
    heading.textContent = 'Screen Reader Ausgabe:';
    heading.style.margin = '0';
    heading.style.fontSize = '16px';
    
    // Create controls
    const controlsWrapper = document.createElement('div');
    controlsWrapper.style.display = 'flex';
    controlsWrapper.style.gap = '5px';
    
    // Speech toggle button (only if speech synthesis is available)
    if (this.speechAvailable) {
      const speechButton = document.createElement('button');
      
      // Set initial icon based on speech state
      speechButton.innerHTML = this.speechEnabled ? 
        '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M11.536 14.01A8.473 8.473 0 0 0 14.026 8a8.473 8.473 0 0 0-2.49-6.01l-.708.707A7.476 7.476 0 0 1 13.025 8c0 2.071-.84 3.946-2.197 5.303l.708.707z"/><path d="M10.121 12.596A6.48 6.48 0 0 0 12.025 8a6.48 6.48 0 0 0-1.904-4.596l-.707.707A5.483 5.483 0 0 1 11.025 8a5.483 5.483 0 0 1-1.61 3.89l.706.706z"/><path d="M8.707 11.182A4.486 4.486 0 0 0 10.025 8a4.486 4.486 0 0 0-1.318-3.182L8 5.525A3.489 3.489 0 0 1 9.025 8 3.49 3.49 0 0 1 8 10.475l.707.707zM6.717 3.55A.5.5 0 0 1 7 4v8a.5.5 0 0 1-.812.39L3.825 10.5H1.5A.5.5 0 0 1 1 10V6a.5.5 0 0 1 .5-.5h2.325l2.363-1.89a.5.5 0 0 1 .529-.06z"/></svg>' : 
        '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M6.717 3.55A.5.5 0 0 1 7 4v8a.5.5 0 0 1-.812.39L3.825 10.5H1.5A.5.5 0 0 1 1 10V6a.5.5 0 0 1 .5-.5h2.325l2.363-1.89a.5.5 0 0 1 .529-.06zm7.137 2.096a.5.5 0 0 1 0 .708L12.207 8l1.647 1.646a.5.5 0 0 1-.708.708L11.5 8.707l-1.646 1.647a.5.5 0 0 1-.708-.708L10.793 8 9.146 6.354a.5.5 0 1 1 .708-.708L11.5 7.293l1.646-1.647a.5.5 0 0 1 .708 0z"/></svg>';
      
      speechButton.title = this.speechEnabled ? 'Sprachausgabe deaktivieren' : 'Sprachausgabe aktivieren';
      speechButton.setAttribute('aria-label', speechButton.title);
      speechButton.style.border = 'none';
      speechButton.style.background = 'transparent';
      speechButton.style.cursor = 'pointer';
      speechButton.style.display = 'flex';
      speechButton.style.alignItems = 'center';
      speechButton.style.justifyContent = 'center';
      speechButton.style.width = '24px';
      speechButton.style.height = '24px';
      speechButton.style.borderRadius = '3px';
      speechButton.style.color = this.speechEnabled ? '#007bff' : '#555';
      
      speechButton.setAttribute('tabindex', '-1'); // Exclude from tab navigation
      speechButton.addEventListener('mousedown', (e) => {
        e.preventDefault(); // Prevent focus
        this.toggleSpeech();
        
        // Update the button icon and color
        speechButton.innerHTML = this.speechEnabled ? 
          '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M11.536 14.01A8.473 8.473 0 0 0 14.026 8a8.473 8.473 0 0 0-2.49-6.01l-.708.707A7.476 7.476 0 0 1 13.025 8c0 2.071-.84 3.946-2.197 5.303l.708.707z"/><path d="M10.121 12.596A6.48 6.48 0 0 0 12.025 8a6.48 6.48 0 0 0-1.904-4.596l-.707.707A5.483 5.483 0 0 1 11.025 8a5.483 5.483 0 0 1-1.61 3.89l.706.706z"/><path d="M8.707 11.182A4.486 4.486 0 0 0 10.025 8a4.486 4.486 0 0 0-1.318-3.182L8 5.525A3.489 3.489 0 0 1 9.025 8 3.49 3.49 0 0 1 8 10.475l.707.707zM6.717 3.55A.5.5 0 0 1 7 4v8a.5.5 0 0 1-.812.39L3.825 10.5H1.5A.5.5 0 0 1 1 10V6a.5.5 0 0 1 .5-.5h2.325l2.363-1.89a.5.5 0 0 1 .529-.06z"/></svg>' : 
          '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M6.717 3.55A.5.5 0 0 1 7 4v8a.5.5 0 0 1-.812.39L3.825 10.5H1.5A.5.5 0 0 1 1 10V6a.5.5 0 0 1 .5-.5h2.325l2.363-1.89a.5.5 0 0 1 .529-.06zm7.137 2.096a.5.5 0 0 1 0 .708L12.207 8l1.647 1.646a.5.5 0 0 1-.708.708L11.5 8.707l-1.646 1.647a.5.5 0 0 1-.708-.708L10.793 8 9.146 6.354a.5.5 0 1 1 .708-.708L11.5 7.293l1.646-1.647a.5.5 0 0 1 .708 0z"/></svg>';
        
        speechButton.title = this.speechEnabled ? 'Sprachausgabe deaktivieren' : 'Sprachausgabe aktivieren';
        speechButton.setAttribute('aria-label', speechButton.title);
        speechButton.style.color = this.speechEnabled ? '#007bff' : '#555';
      });
      
      // Add the speech button to the controls
      controlsWrapper.appendChild(speechButton);
    }
    
    // Reset position button
    const resetButton = document.createElement('button');
    resetButton.textContent = '↺';
    resetButton.title = 'Position zurücksetzen';
    resetButton.setAttribute('aria-label', 'Position der Screen Reader Ausgabe zurücksetzen');
    resetButton.style.border = 'none';
    resetButton.style.background = 'transparent';
    resetButton.style.cursor = 'pointer';
    resetButton.style.fontSize = '16px';
    resetButton.style.display = 'flex';
    resetButton.style.alignItems = 'center';
    resetButton.style.justifyContent = 'center';
    resetButton.style.width = '24px';
    resetButton.style.height = '24px';
    resetButton.style.borderRadius = '3px';
    resetButton.style.color = '#555';
    
    resetButton.setAttribute('tabindex', '-1'); // Exclude from tab navigation
    resetButton.addEventListener('mousedown', (e) => {
      e.preventDefault(); // Prevent focus
      this.resetPosition();
    });
    
    // Minimize/Maximize button
    const toggleButton = document.createElement('button');
    toggleButton.textContent = '_';
    toggleButton.title = 'Minimieren/Maximieren';
    toggleButton.setAttribute('aria-label', 'Screen Reader Ausgabe minimieren oder maximieren');
    toggleButton.style.border = 'none';
    toggleButton.style.background = 'transparent';
    toggleButton.style.cursor = 'pointer';
    toggleButton.style.fontSize = '16px';
    toggleButton.style.display = 'flex';
    toggleButton.style.alignItems = 'center';
    toggleButton.style.justifyContent = 'center';
    toggleButton.style.width = '24px';
    toggleButton.style.height = '24px';
    toggleButton.style.borderRadius = '3px';
    toggleButton.style.color = '#555';
    
    // Store minimized state
    this.isMinimized = false;
    
    toggleButton.setAttribute('tabindex', '-1'); // Exclude from tab navigation
    toggleButton.addEventListener('mousedown', (e) => {
      e.preventDefault(); // Prevent focus
      this.toggleMinimize();
    });
    
    // Close button
    const closeButton = document.createElement('button');
    closeButton.textContent = '×';
    closeButton.title = 'Schließen';
    closeButton.setAttribute('aria-label', 'Screen Reader Ausgabe schließen');
    closeButton.style.border = 'none';
    closeButton.style.background = 'transparent';
    closeButton.style.cursor = 'pointer';
    closeButton.style.fontSize = '18px';
    closeButton.style.display = 'flex';
    closeButton.style.alignItems = 'center';
    closeButton.style.justifyContent = 'center';
    closeButton.style.width = '24px';
    closeButton.style.height = '24px';
    closeButton.style.borderRadius = '3px';
    closeButton.style.color = '#555';
    
    closeButton.setAttribute('tabindex', '-1'); // Exclude from tab navigation
    closeButton.addEventListener('mousedown', (e) => {
      e.preventDefault(); // Prevent focus
      this.hideOutput();
    });
    
    // Add buttons to controls
    controlsWrapper.appendChild(resetButton);
    controlsWrapper.appendChild(toggleButton);
    controlsWrapper.appendChild(closeButton);
    
    // Add to header
    headerElement.appendChild(heading);
    headerElement.appendChild(controlsWrapper);
    
    // Create content area
    this.outputContent = document.createElement('div');
    this.outputContent.className = 'sr-output-content';
    
    // Assemble output element
    this.outputElement.appendChild(headerElement);
    this.outputElement.appendChild(this.outputContent);
    
    // Add to container
    this.options.container.appendChild(this.outputElement);
    
    // Apply saved position if available
    this.loadSavedPosition();
    
    // Make it draggable
    this.makeDraggable(this.outputElement, headerElement);
    
    // Add window resize handler to keep output visible
    window.addEventListener('resize', this.handleWindowResize);
  }
  
  // Make element draggable
  makeDraggable(element, handle) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    
    handle.onmousedown = dragMouseDown;
    
    // Function for starting drag
    function dragMouseDown(e) {
      e = e || window.event;
      e.preventDefault();
      // Get the cursor position at startup
      pos3 = e.clientX;
      pos4 = e.clientY;
      document.onmouseup = closeDragElement;
      // Call function whenever the cursor moves
      document.onmousemove = elementDrag;
      
      // Add active drag style
      element.style.opacity = '0.8';
    }
    
    // Function for element dragging
    const that = this; // Store reference to this
    function elementDrag(e) {
      e = e || window.event;
      e.preventDefault();
      // Calculate new position
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;
      // Set new position
      element.style.top = (element.offsetTop - pos2) + "px";
      element.style.left = (element.offsetLeft - pos1) + "px";
      element.style.right = 'auto'; // Clear default positioning
    }
    
    // Function for stopping drag
    function closeDragElement() {
      // Stop moving when mouse button is released
      document.onmouseup = null;
      document.onmousemove = null;
      
      // Remove active drag style
      element.style.opacity = '1';
      
      // Save the position
      that.savePosition(element.offsetLeft, element.offsetTop);
    }
  }
  
  // Save position to localStorage
  savePosition(left, top) {
    try {
      const position = { left, top };
      localStorage.setItem('screenReaderPosition', JSON.stringify(position));
    } catch (e) {
      console.error('Failed to save screen reader position:', e);
    }
  }
  
  // Load saved position from localStorage
  loadSavedPosition() {
    try {
      // Load position
      const savedPosition = localStorage.getItem('screenReaderPosition');
      if (savedPosition) {
        const { left, top } = JSON.parse(savedPosition);
        
        // Validate position to ensure it's visible
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        const elementWidth = this.outputElement.offsetWidth || 300; // Fallback width
        
        // Make sure the element doesn't go off-screen
        const validLeft = Math.min(Math.max(left, 0), windowWidth - 100);
        const validTop = Math.min(Math.max(top, 0), windowHeight - 50);
        
        // Apply position
        this.outputElement.style.left = validLeft + 'px';
        this.outputElement.style.top = validTop + 'px';
        this.outputElement.style.right = 'auto';
        this.outputElement.style.position = 'fixed';
      }
      
      // Load visibility state
      const isHidden = localStorage.getItem('screenReaderHidden') === 'true';
      if (isHidden) {
        this.hideOutput(false); // Don't save state again
      }
      
      // Load minimized state
      const isMinimized = localStorage.getItem('screenReaderMinimized') === 'true';
      if (isMinimized) {
        this.toggleMinimize(false); // Don't save state again
      }
    } catch (e) {
      console.error('Failed to load screen reader state:', e);
    }
  }
  
  // Reset position to default
  resetPosition() {
    // Set default position
    this.outputElement.style.top = '2rem';
    this.outputElement.style.right = '2rem';
    this.outputElement.style.left = 'auto';
    
    // Save the reset position
    localStorage.removeItem('screenReaderPosition');
    
    // Announce
    this.announceMessage('Position zurückgesetzt');
  }
  
  // Toggle minimize/maximize state
  toggleMinimize(saveState = true) {
    this.isMinimized = !this.isMinimized;
    
    // Toggle content visibility
    if (this.isMinimized) {
      this.outputContent.style.display = 'none';
      this.outputElement.style.resize = 'none';
      this.outputElement.style.minHeight = 'auto';
      this.outputElement.style.height = 'auto';
      
      // Update toggle button
      const toggleButton = this.outputElement.querySelector('.sr-output-header button:nth-child(2)');
      if (toggleButton) {
        toggleButton.textContent = '□';
        toggleButton.title = 'Maximieren';
        toggleButton.setAttribute('aria-label', 'Screen Reader Ausgabe maximieren');
      }
      
      this.announceMessage('Screen Reader Ausgabe minimiert');
    } else {
      this.outputContent.style.display = 'block';
      this.outputElement.style.resize = 'both';
      this.outputElement.style.minHeight = '150px';
      
      // Update toggle button
      const toggleButton = this.outputElement.querySelector('.sr-output-header button:nth-child(2)');
      if (toggleButton) {
        toggleButton.textContent = '_';
        toggleButton.title = 'Minimieren';
        toggleButton.setAttribute('aria-label', 'Screen Reader Ausgabe minimieren');
      }
      
      this.announceMessage('Screen Reader Ausgabe maximiert');
    }
    
    // Save state if requested
    if (saveState) {
      localStorage.setItem('screenReaderMinimized', this.isMinimized);
    }
  }
  
  // Hide output (with restore button)
  hideOutput(saveState = true) {
    // Hide the output
    this.outputElement.style.display = 'none';
    
    // Create restore button if it doesn't exist
    if (!this.restoreButton) {
      this.restoreButton = document.createElement('button');
      this.restoreButton.textContent = 'SR';
      this.restoreButton.title = 'Screen Reader Ausgabe anzeigen';
      this.restoreButton.setAttribute('aria-label', 'Screen Reader Ausgabe wieder anzeigen');
      this.restoreButton.style.position = 'fixed';
      this.restoreButton.style.bottom = '10px';
      this.restoreButton.style.left = '10px';
      this.restoreButton.style.zIndex = '9999';
      this.restoreButton.style.width = '40px';
      this.restoreButton.style.height = '40px';
      this.restoreButton.style.borderRadius = '50%';
      this.restoreButton.style.backgroundColor = '#007bff';
      this.restoreButton.style.color = 'white';
      this.restoreButton.style.border = 'none';
      this.restoreButton.style.fontWeight = 'bold';
      this.restoreButton.style.cursor = 'pointer';
      this.restoreButton.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.2)';
      
      this.restoreButton.setAttribute('tabindex', '-1'); // Exclude from tab navigation
      this.restoreButton.setAttribute('aria-hidden', 'true'); // Hide from screen readers
      this.restoreButton.addEventListener('mousedown', (e) => {
        e.preventDefault(); // Prevent focus
        this.showOutput();
      });
      
      // Add restore button to document
      document.body.appendChild(this.restoreButton);
    } else {
      this.restoreButton.style.display = 'block';
    }
    
    // Save state if requested
    if (saveState) {
      localStorage.setItem('screenReaderHidden', 'true');
    }
  }
  
  // Show output
  showOutput() {
    // Show the output
    this.outputElement.style.display = 'block';
    
    // Hide restore button
    if (this.restoreButton) {
      this.restoreButton.style.display = 'none';
    }
    
    // Save state
    localStorage.setItem('screenReaderHidden', 'false');
    
    // Announce
    this.announceMessage('Screen Reader Ausgabe wieder sichtbar');
  }
  
  // Check if element should be ignored by screen reader
  isElementHidden(element) {
    if (!element) return true;
    
    // Check for aria-hidden attribute
    if (element.getAttribute('aria-hidden') === 'true') {
      return true;
    }
    
    // Check for display: none via computed style
    const style = window.getComputedStyle(element);
    if (style.display === 'none' || style.visibility === 'hidden') {
      return true;
    }
    
    // Check if any parent element is hidden
    let parent = element.parentElement;
    while (parent && parent !== document.body) {
      if (parent.getAttribute('aria-hidden') === 'true') {
        return true;
      }
      
      const parentStyle = window.getComputedStyle(parent);
      if (parentStyle.display === 'none' || parentStyle.visibility === 'hidden') {
        return true;
      }
      
      parent = parent.parentElement;
    }
    
    return false;
  }
  
  // Update focus and announce element to screen reader
  updateFocus(element) {
    if (!element || element === document.body) {
      return;
    }
    
    // Check if element should be ignored
    if (this.isElementHidden(element)) {
      this.announceMessage('Element ist für Screenreader ausgeblendet', { source: 'aria-hidden' });
      return;
    }
    
    // Store the active element
    this.activeElement = element;
    
    // Check for aria-describedby to show in tooltip
    if (element.hasAttribute('aria-describedby')) {
      const descId = element.getAttribute('aria-describedby');
      const descElement = document.getElementById(descId);
      if (descElement) {
        this.showSourceInfo(descElement.textContent, { 
          source: 'aria-describedby',
          elementId: element.id || '',
          referencedId: descId 
        });
      }
    }
    
    // Update screen reader output
    this.announce(element);
  }
  
  // Announce element to screen reader
  announce(element) {
    if (!this.options.showOutput || !this.outputContent) return;
    
    // Check if element should be ignored
    if (this.isElementHidden(element)) {
      return;
    }
    
    let output = '';
    
    // Get element's accessible name
    const name = this.getAccessibleName(element);
    
    // Get element's role
    const role = this.getElementRole(element);
    
    // Get element's state
    const state = this.getElementState(element);
    
    // Assemble output
    if (name) output += name;
    if (role) output += role ? ` ${role}` : '';
    if (state) output += ` ${state}`;
    
    // Update output area
    const outputEntry = document.createElement('p');
    outputEntry.textContent = output || 'Kein Screenreader-Text verfügbar';
    
    // Keep only the last N outputs
    if (this.outputContent.childNodes.length >= this.options.maxOutputEntries) {
      this.outputContent.removeChild(this.outputContent.firstChild);
    }
    
    this.outputContent.appendChild(outputEntry);
    this.outputContent.scrollTop = this.outputContent.scrollHeight;
  }
  
  // Custom announcement (for actions without focus changes)
  announceMessage(message, metadata = {}) {
    if (!this.options.showOutput || !this.outputContent) return;
    
    // Create the output entry with appropriate styling for different message types
    const outputEntry = document.createElement('p');
    outputEntry.textContent = message;
    
    // Add styling for different message types
    if (metadata.type === 'error') {
      outputEntry.style.color = '#dc3545';
      outputEntry.style.fontWeight = 'bold';
    } else if (metadata.type === 'success') {
      outputEntry.style.color = '#28a745';
    } else if (metadata.type === 'hint') {
      outputEntry.style.color = '#17a2b8';
      outputEntry.style.fontStyle = 'italic';
    }
    
    // Keep only the last N outputs
    if (this.outputContent.childNodes.length >= this.options.maxOutputEntries) {
      this.outputContent.removeChild(this.outputContent.firstChild);
    }
    
    this.outputContent.appendChild(outputEntry);
    this.outputContent.scrollTop = this.outputContent.scrollHeight;
    
    // Show source info tooltip
    this.showSourceInfo(message, metadata);
    
    // Use speech synthesis if enabled (with priority consideration)
    if (metadata.priority === 'high') {
      // For high priority messages (like errors), ensure they are spoken even if other speech is in progress
      window.speechSynthesis.cancel();
      // Small delay before speaking to ensure any interrupted speech has stopped
      setTimeout(() => this.speak(message), 50);
    } else {
      this.speak(message);
    }
  }
  
  // Shows a tooltip with information about the source of the screenreader announcement
  showSourceInfo(message, metadata = {}) {
    console.log("showSourceInfo called with metadata:", metadata);
    
    // Determine the source of the information
    let sourceInfo = 'Unbekannte Quelle';
    let extraInfo = '';
    
    if (metadata && metadata.source) {
      // Get the specific source attribute and ID if available
      if (metadata.elementId) {
        extraInfo = ` (Element-ID: ${metadata.elementId})`;
      }
      
      switch(metadata.source) {
        case 'aria-label':
          sourceInfo = `aria-label="${message}"${extraInfo}`;
          break;
        case 'aria-labelledby':
          sourceInfo = `aria-labelledby="${metadata.referencedId || ''}"${extraInfo}`;
          break;
        case 'aria-describedby':
          sourceInfo = `aria-describedby="${metadata.referencedId || ''}"${extraInfo}`;
          break;
        case 'label-element':
          sourceInfo = `<label for="${metadata.elementId || ''}">${message}</label>`;
          break;
        case 'aria-live':
          sourceInfo = `aria-live="${metadata.liveType || 'polite'}"${extraInfo}`;
          break;
        case 'error-validation':
          sourceInfo = `Fehlervalidierung (Feld: ${metadata.fieldId || 'unbekannt'})`;
          break;
        case 'placeholder':
          sourceInfo = `placeholder="${message}"${extraInfo}`;
          break;
        case 'element-content':
          sourceInfo = `<${metadata.elementTag || 'element'}>${message}</${metadata.elementTag || 'element'}>`;
          break;
        case 'aria-hidden':
          sourceInfo = `aria-hidden="true"${extraInfo}`;
          break;
        case 'name-attribute':
          sourceInfo = `name="${metadata.elementId || message}"${extraInfo}`;
          break;
        default:
          sourceInfo = metadata.source || 'Unbekannte Quelle';
      }
    }
    
    // Create or update the tooltip element
    if (!this.sourceTooltip) {
      this.sourceTooltip = document.createElement('div');
      this.sourceTooltip.style.position = 'fixed';
      this.sourceTooltip.style.top = '10px';
      this.sourceTooltip.style.left = '50%';
      this.sourceTooltip.style.transform = 'translateX(-50%)';
      this.sourceTooltip.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
      this.sourceTooltip.style.color = 'white';
      this.sourceTooltip.style.padding = '8px 12px';
      this.sourceTooltip.style.borderRadius = '4px';
      this.sourceTooltip.style.zIndex = '10000';
      this.sourceTooltip.style.fontSize = '14px';
      this.sourceTooltip.style.fontFamily = 'Arial, sans-serif';
      this.sourceTooltip.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.2)';
      this.sourceTooltip.style.display = 'none';
      document.body.appendChild(this.sourceTooltip);
    }
    
    // Set the content and display the tooltip
    this.sourceTooltip.textContent = `Quelle: ${sourceInfo}`;
    this.sourceTooltip.style.display = 'block';
    
    // Clear any existing timeout to hide the tooltip
    if (this.tooltipTimeout) {
      clearTimeout(this.tooltipTimeout);
    }
    
    // Set a timeout to hide the tooltip after 3 seconds
    this.tooltipTimeout = setTimeout(() => {
      this.sourceTooltip.style.display = 'none';
    }, 3000);
  }
  
  // Speak text using the Web Speech API
  speak(text) {
    // Only speak if speech synthesis is available and enabled
    if (!this.speechAvailable || !this.speechEnabled || !text) return;
    
    console.log('Speaking:', text); // Debug logging
    
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    
    // Create a new utterance
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Set language to German
    utterance.lang = 'de-DE';
    
    // Get available voices
    let voices = window.speechSynthesis.getVoices();
    
    // In some browsers, getVoices() might initially return an empty array
    if (voices.length === 0) {
      // If no voices available yet, try to load them
      window.speechSynthesis.onvoiceschanged = () => {
        // Try again with the now-loaded voices
        voices = window.speechSynthesis.getVoices();
        const germanVoice = voices.find(voice => voice.lang.startsWith('de'));
        if (germanVoice) {
          utterance.voice = germanVoice;
        }
        // Speak after voices are loaded
        window.speechSynthesis.speak(utterance);
      };
      // Return early since we'll speak when voices are loaded
      return;
    }
    
    // If voices are already available, find a German one
    const germanVoice = voices.find(voice => voice.lang.startsWith('de'));
    if (germanVoice) {
      utterance.voice = germanVoice;
      console.log('Using German voice:', germanVoice.name); // Debug logging
    } else {
      console.log('No German voice found, using default voice'); // Debug logging
    }
    
    // Debug log all available voices
    console.log('Available voices:', voices.map(v => `${v.name} (${v.lang})`).join(', '));
    
    // Adjust speech parameters
    utterance.rate = 1.0; // Normal speed
    utterance.pitch = 1.0; // Normal pitch
    utterance.volume = 1.0; // Full volume
    
    // Add event listeners for debugging
    utterance.onstart = () => console.log('Speech started:', text);
    utterance.onend = () => console.log('Speech ended');
    utterance.onerror = (e) => console.error('Speech error:', e);
    
    // Speak the text
    window.speechSynthesis.speak(utterance);
  }
  
  // Toggle speech on/off
  toggleSpeech() {
    this.speechEnabled = !this.speechEnabled;
    
    // Cancel any ongoing speech if turning off
    if (!this.speechEnabled && this.speechAvailable) {
      window.speechSynthesis.cancel();
    }
    
    // Announce the state change (but don't speak it)
    const message = this.speechEnabled ? 
      'Sprachausgabe aktiviert' : 
      'Sprachausgabe deaktiviert';
    
    // Add to output without speaking
    if (this.outputContent) {
      const outputEntry = document.createElement('p');
      outputEntry.textContent = message;
      
      // Add icon to indicate speech status
      const icon = document.createElement('span');
      icon.innerHTML = this.speechEnabled ? 
        ' <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" viewBox="0 0 16 16"><path d="M11.536 14.01A8.473 8.473 0 0 0 14.026 8a8.473 8.473 0 0 0-2.49-6.01l-.708.707A7.476 7.476 0 0 1 13.025 8c0 2.071-.84 3.946-2.197 5.303l.708.707z"/><path d="M10.121 12.596A6.48 6.48 0 0 0 12.025 8a6.48 6.48 0 0 0-1.904-4.596l-.707.707A5.483 5.483 0 0 1 11.025 8a5.483 5.483 0 0 1-1.61 3.89l.706.706z"/><path d="M8.707 11.182A4.486 4.486 0 0 0 10.025 8a4.486 4.486 0 0 0-1.318-3.182L8 5.525A3.489 3.489 0 0 1 9.025 8 3.49 3.49 0 0 1 8 10.475l.707.707zM6.717 3.55A.5.5 0 0 1 7 4v8a.5.5 0 0 1-.812.39L3.825 10.5H1.5A.5.5 0 0 1 1 10V6a.5.5 0 0 1 .5-.5h2.325l2.363-1.89a.5.5 0 0 1 .529-.06z"/></svg>' : 
        ' <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" viewBox="0 0 16 16"><path d="M6.717 3.55A.5.5 0 0 1 7 4v8a.5.5 0 0 1-.812.39L3.825 10.5H1.5A.5.5 0 0 1 1 10V6a.5.5 0 0 1 .5-.5h2.325l2.363-1.89a.5.5 0 0 1 .529-.06zm7.137 2.096a.5.5 0 0 1 0 .708L12.207 8l1.647 1.646a.5.5 0 0 1-.708.708L11.5 8.707l-1.646 1.647a.5.5 0 0 1-.708-.708L10.793 8 9.146 6.354a.5.5 0 1 1 .708-.708L11.5 7.293l1.646-1.647a.5.5 0 0 1 .708 0z"/></svg>';
      
      icon.style.color = this.speechEnabled ? '#007bff' : '#555';
      outputEntry.appendChild(icon);
      
      // Keep only the last N outputs
      if (this.outputContent.childNodes.length >= this.options.maxOutputEntries) {
        this.outputContent.removeChild(this.outputContent.firstChild);
      }
      
      this.outputContent.appendChild(outputEntry);
      this.outputContent.scrollTop = this.outputContent.scrollHeight;
    }
    
    // If turning on, speak the confirmation message
    if (this.speechEnabled) {
      // Small delay to ensure the UI updates first
      setTimeout(() => this.speak(message), 100);
    }
    
    // Save preference
    try {
      localStorage.setItem('screenReaderSpeechEnabled', this.speechEnabled.toString());
    } catch (e) {
      console.error('Could not save speech preference:', e);
    }
  }
  
  // Get accessible name of an element
  getAccessibleName(element) {
    // Skip if element is hidden
    if (this.isElementHidden(element)) {
      return '';
    }
    
    // We'll track the source of the accessible name
    let source = 'unknown';
    let name = '';
    
    // Check aria-label (highest priority)
    if (element.hasAttribute('aria-label')) {
      source = 'aria-label';
      name = element.getAttribute('aria-label');
    }
    
    // Check aria-labelledby (second priority)
    else if (element.hasAttribute('aria-labelledby')) {
      source = 'aria-labelledby';
      const labelId = element.getAttribute('aria-labelledby');
      const labelElement = document.getElementById(labelId);
      if (labelElement && !this.isElementHidden(labelElement)) {
        name = this.getVisibleTextContent(labelElement);
      }
    }
    
    // Check for associated label (third priority)
    else if (element.id) {
      const label = document.querySelector(`label[for="${element.id}"]`);
      if (label && !this.isElementHidden(label)) {
        source = 'label-element';
        // Get visible text content from label, excluding text in aria-hidden elements
        name = this.getVisibleTextContent(label);
      }
    }
    
    // Check for button/link text (fourth priority)
    else if (element.tagName === 'BUTTON' || element.tagName === 'A') {
      source = 'element-content';
      name = this.getVisibleTextContent(element);
    }
    
    // For inputs, check placeholder or name (lowest priority)
    else if (element.tagName === 'INPUT') {
      if (element.hasAttribute('placeholder')) {
        source = 'placeholder';
        name = element.getAttribute('placeholder');
      }
      else if (element.hasAttribute('name')) {
        source = 'name-attribute';
        name = element.getAttribute('name');
      }
    }
    
    // Store the source for later use
    element._accessibleNameSource = source;
    
    // Gather additional details for the tooltip
    const metadata = { 
      source: source,
      elementId: element.id || '',
      elementTag: element.tagName.toLowerCase()
    };
    
    // Add referenced ID for ARIA attributes
    if (source === 'aria-labelledby' && element.hasAttribute('aria-labelledby')) {
      metadata.referencedId = element.getAttribute('aria-labelledby');
    }
    else if (source === 'aria-describedby' && element.hasAttribute('aria-describedby')) {
      metadata.referencedId = element.getAttribute('aria-describedby');
    }
    
    // Show the source in the tooltip
    if (name) {
      this.showSourceInfo(name, metadata);
    }
    
    return name;
  }
  
  // Get element role
  getElementRole(element) {
    // Skip if element is hidden
    if (this.isElementHidden(element)) {
      return '';
    }
    
    // Check explicit role
    if (element.hasAttribute('role')) {
      return element.getAttribute('role');
    }
    
    // Implicit roles
    switch (element.tagName) {
      case 'BUTTON': return 'Schaltfläche';
      case 'A': return 'Link';
      case 'INPUT':
        switch (element.type) {
          case 'text': return 'Textfeld';
          case 'checkbox': return 'Kontrollkästchen';
          case 'radio': return 'Optionsfeld';
          case 'submit': return 'Absenden-Schaltfläche';
          case 'date': return 'Datumsauswahl';
          case 'time': return 'Zeitauswahl';
          default: return 'Eingabefeld';
        }
      case 'SELECT': return 'Auswahlmenü';
      case 'TEXTAREA': return 'Textbereich';
      case 'H1': case 'H2': case 'H3': case 'H4': case 'H5': case 'H6':
        return `Überschrift Ebene ${element.tagName.charAt(1)}`;
      default: return '';
    }
  }
  
  // Get element state
  getElementState(element) {
    // Skip if element is hidden
    if (this.isElementHidden(element)) {
      return '';
    }
    
    let states = [];
    
    // Required
    if (element.hasAttribute('aria-required') || element.required) {
      states.push('erforderlich');
    }
    
    // Disabled
    if (element.hasAttribute('aria-disabled') || element.disabled) {
      states.push('deaktiviert');
    }
    
    // Expanded (for dropdowns, accordions)
    if (element.hasAttribute('aria-expanded')) {
      states.push(element.getAttribute('aria-expanded') === 'true' ? 'ausgeklappt' : 'eingeklappt');
    }
    
    // Checked (for checkboxes, radio buttons)
    if (element.hasAttribute('aria-checked') || (element.type === 'checkbox' || element.type === 'radio')) {
      if (element.checked || element.getAttribute('aria-checked') === 'true') {
        states.push('ausgewählt');
      }
    }
    
    // Selected (for options)
    if (element.hasAttribute('aria-selected')) {
      states.push(element.getAttribute('aria-selected') === 'true' ? 'ausgewählt' : 'nicht ausgewählt');
    }
    
    return states.join(', ');
  }
  
  // Check if an element or any of its ancestors has a specific attribute value
  hasAttributeInTree(element, attribute, value) {
    if (!element) return false;
    
    if (element.getAttribute(attribute) === value) {
      return true;
    }
    
    let parent = element.parentElement;
    while (parent) {
      if (parent.getAttribute(attribute) === value) {
        return true;
      }
      parent = parent.parentElement;
    }
    
    return false;
  }
  
  // Bind global events for screen reader
  bindGlobalEvents() {
    // Track focus changes
    document.addEventListener('focusin', this.handleFocusIn);
    
    // Track click events
    document.addEventListener('click', this.handleClick);
    
    // Track form submissions
    document.addEventListener('submit', this.handleSubmit);
    
    // Track mutations to detect aria-hidden changes
    this.setupMutationObserver();
  }
  
  // Setup mutation observer to track aria-hidden changes
  setupMutationObserver() {
    // Create a MutationObserver to track changes to aria-hidden and display style
    this.observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        // Check for attribute changes
        if (mutation.type === 'attributes') {
          const target = mutation.target;
          
          // Only process if this is an aria-hidden change or style change
          if (mutation.attributeName === 'aria-hidden' || 
              mutation.attributeName === 'style' || 
              mutation.attributeName === 'class') {
            
            // If current active element is now hidden, announce it
            if (this.activeElement && 
                (this.activeElement === target || this.activeElement.contains(target) || target.contains(this.activeElement))) {
              
              if (this.isElementHidden(this.activeElement)) {
                this.announceMessage('Aktives Element wurde ausgeblendet');
                // Try to find the next focusable element
                this.findAndFocusNextElement();
              }
            }
          }
        }
        
        // Check for DOM changes that might hide/show elements
        if (mutation.type === 'childList') {
          // If active element was removed, find next focusable element
          if (this.activeElement && !document.contains(this.activeElement)) {
            this.announceMessage('Aktives Element wurde entfernt');
            this.findAndFocusNextElement();
          }
        }
      });
    });
    
    // Start observing the document with the configured parameters
    this.observer.observe(document.body, { 
      attributes: true, 
      childList: true, 
      subtree: true,
      attributeFilter: ['aria-hidden', 'style', 'class'] 
    });
  }
  
  // Find and focus the next available element when current is hidden/removed
  findAndFocusNextElement() {
    const focusableElements = this.getFocusableElements();
    if (focusableElements.length > 0) {
      focusableElements[0].focus();
    }
  }
  
  // Get all focusable elements in the document that aren't hidden
  getFocusableElements() {
    const focusableSelectors = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
    
    return Array.from(document.querySelectorAll(focusableSelectors))
      .filter(el => !this.isElementHidden(el));
  }
  
  // Get visible text content of an element, excluding text in aria-hidden elements
  getVisibleTextContent(element) {
    // If the element itself is hidden, return empty string
    if (this.isElementHidden(element)) {
      return '';
    }
    
    // If element has no children, return its text content directly
    if (!element.children || element.children.length === 0) {
      return element.textContent;
    }
    
    // Clone the element to work with it
    const clone = element.cloneNode(true);
    
    // Remove all hidden elements from the clone
    this.removeHiddenElements(clone);
    
    // Return the text content of the cleaned clone
    return clone.textContent.trim();
  }
  
  // Recursively remove hidden elements from a DOM element
  removeHiddenElements(element) {
    // Get all children
    const children = Array.from(element.children);
    
    // Process each child
    for (let i = children.length - 1; i >= 0; i--) {
      const child = children[i];
      
      // If child is hidden, remove it
      if (child.getAttribute('aria-hidden') === 'true') {
        element.removeChild(child);
      } else {
        // Otherwise, recursively process its children
        this.removeHiddenElements(child);
      }
    }
  }
  
  // Handle click events on non-focusable elements
  handleClick = (e) => {
    const target = e.target;
    
    // Skip if element is hidden
    if (this.isElementHidden(target)) {
      return;
    }
    
    // Announce clicked elements that don't naturally get focus
    if (target.tagName !== 'INPUT' && 
        target.tagName !== 'BUTTON' && 
        target.tagName !== 'A' && 
        target.tagName !== 'SELECT' && 
        target.tagName !== 'TEXTAREA' &&
        !target.hasAttribute('tabindex')) {
      this.announce(target);
      const elementDesc = this.getElementDescription(target) || this.getAccessibleName(target) || target.tagName.toLowerCase();
      this.announceMessage(`Element geklickt: ${elementDesc}`);
    }
  }
  
  // Handle form submission
  handleSubmit = (e) => {
    // Skip if form is hidden
    if (!this.isElementHidden(e.target)) {
      // Get a more descriptive message about the form
      const form = e.target;
      let formDesc = 'Formular';
      
      // Try to get a better description of the form
      if (form.getAttribute('aria-labelledby')) {
        const labelElement = document.getElementById(form.getAttribute('aria-labelledby'));
        if (labelElement) {
          formDesc = labelElement.textContent.trim();
        }
      } else if (form.getAttribute('aria-label')) {
        formDesc = form.getAttribute('aria-label');
      } else if (form.id) {
        formDesc = `Formular ${form.id}`;
      }
      
      // Try to find the submit button that was used
      const submitButton = document.activeElement;
      let buttonDesc = '';
      
      if (submitButton && 
          (submitButton.type === 'submit' || 
           submitButton.getAttribute('role') === 'button')) {
        buttonDesc = this.getAccessibleName(submitButton) || submitButton.textContent || 'Senden';
        this.announceMessage(`${formDesc} gesendet mit Aktion: ${buttonDesc}`);
      } else {
        this.announceMessage(`${formDesc} wurde gesendet`);
      }
    }
  }
  
  // Handle focus changes
  handleFocusIn = (e) => {
    this.updateFocus(e.target);
  }
  
  // Destroy screen reader output and cleanup
  destroy() {
    // Remove output element
    if (this.outputElement && this.outputElement.parentNode) {
      this.outputElement.parentNode.removeChild(this.outputElement);
    }
    
    // Remove restore button
    if (this.restoreButton && this.restoreButton.parentNode) {
      this.restoreButton.parentNode.removeChild(this.restoreButton);
    }
    
    // Disconnect the mutation observer
    if (this.observer) {
      this.observer.disconnect();
    }
    
    // Remove event listeners with proper bound methods
    document.removeEventListener('focusin', this.handleFocusIn);
    document.removeEventListener('click', this.handleClick);
    document.removeEventListener('submit', this.handleSubmit);
    
    // Clear any window resize event listeners
    window.removeEventListener('resize', this.handleWindowResize);
  }
  
  // Handle window resize to ensure screen reader stays visible
  handleWindowResize = () => {
    // Check if the output is outside the viewport
    if (this.outputElement && this.outputElement.style.display !== 'none') {
      const rect = this.outputElement.getBoundingClientRect();
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      
      if (rect.right > windowWidth || rect.bottom > windowHeight || 
          rect.left < 0 || rect.top < 0) {
        // Reset to a safe position
        this.outputElement.style.top = '2rem';
        this.outputElement.style.right = '2rem';
        this.outputElement.style.left = 'auto';
        this.announceMessage('Position angepasst, um auf dem Bildschirm sichtbar zu bleiben');
      }
    }
  }
}