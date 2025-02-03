export class MessageControl {
    constructor() {
        this.messageTypes = ['info', 'success', 'warning', 'error'];
        this.activeStates = {
            info: true,
            success: true,
            warning: true,
            error: true
        };
        this.icons = {
            info: 'info',
            success: 'check_circle',
            warning: 'warning',
            error: 'error'
        };
        this.tooltips = {
            info: 'Informationen ein-/ausblenden',
            success: 'Erfolgsmeldungen ein-/ausblenden',
            warning: 'Warnungen ein-/ausblenden',
            error: 'Fehlermeldungen ein-/ausblenden'
        };
        this.colors = {
            info: '#0288d1',     // Blau
            success: '#2e7d32',  // Grün
            warning: '#ed6c02',  // Orange
            error: '#d32f2f'     // Rot
        };
        this.styles = {
            info: 'border-left: 4px solid #0288d1; background: #e3f2fd; padding: 1em;',
            success: 'border-left: 4px solid #2e7d32; background: #e8f5e9; padding: 1em;',
            warning: 'border-left: 4px solid #ed6c02; background: #fff3e0; padding: 1em;',
            error: 'border-left: 4px solid #d32f2f; background: #ffebee; padding: 1em;'
        };
    }

    init() {
        this.setupMutationObserver();
        this.checkForMessageTypes();
        this.injectStyles();
    }

    setupMutationObserver() {
        const observer = new MutationObserver(() => {
            this.checkForMessageTypes();
        });

        const output = document.getElementById('output');
        if (output) {
            observer.observe(output, { 
                childList: true, 
                subtree: true, 
                attributes: true,
                attributeFilter: ['data-message-type'] 
            });
        }
    }

    checkForMessageTypes() {
        const output = document.getElementById('output');
        if (!output) return;

        const hasMessageTypes = !!output.querySelector('[data-message-type]');
        if (hasMessageTypes) {
            this.createControls();
        }
    }

    createControls() {
        if (document.getElementById('message-controls')) return;

        const previewHeader = document.querySelector('.preview-panel h3');
        if (!previewHeader) return;

        const controlsContainer = this.createControlsContainer();
        this.messageTypes.forEach(type => {
            const button = this.createControlButton(type);
            controlsContainer.appendChild(button);
        });

        previewHeader.appendChild(controlsContainer);
    }

    createControlsContainer() {
        const container = document.createElement('div');
        container.id = 'message-controls';
        container.className = 'message-control-buttons';
        container.style.cssText = `
            display: inline-flex;
            gap: 8px;
            margin-left: 16px;
            vertical-align: middle;
        `;
        return container;
    }

    createControlButton(type) {
        const button = document.createElement('button');
        button.className = 'message-control-button';
        button.setAttribute('data-message-type', type);
        button.setAttribute('title', this.tooltips[type]);
        button.style.cssText = `
            border: none;
            background: ${this.colors[type]};
            color: white;
            padding: 4px;
            border-radius: 4px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: ${this.activeStates[type] ? '1' : '0.5'};
            transition: all 0.2s ease;
        `;

        const icon = document.createElement('span');
        icon.className = 'material-icons';
        icon.textContent = this.icons[type];
        icon.style.fontSize = '18px';
        button.appendChild(icon);

        button.addEventListener('click', () => this.toggleVisibility(type, button));

        return button;
    }

    toggleVisibility(type, button) {
        this.activeStates[type] = !this.activeStates[type];
        button.style.opacity = this.activeStates[type] ? '1' : '0.5';

        const output = document.getElementById('output');
        if (!output) return;

        output.querySelectorAll(`[data-message-type="${type}"]`).forEach(element => {
            element.style.display = this.activeStates[type] ? '' : 'none';
        });
    }

    injectStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .message-control-button {
                position: relative;
                overflow: hidden;
            }
            .message-control-button:hover {
                filter: brightness(1.1);
            }
            .message-control-button:active {
                transform: scale(0.95);
            }
            .message-control-button::after {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(255, 255, 255, 0.1);
                opacity: 0;
                transition: opacity 0.2s;
            }
            .message-control-button:hover::after {
                opacity: 1;
            }
            
            /* Dark mode Anpassungen */
            [data-theme="dark"] .message-control-button::after {
                background: rgba(0, 0, 0, 0.1);
            }
            [data-theme="dark"] [data-message-type="info"] { background: #0288d1 !important; }
            [data-theme="dark"] [data-message-type="success"] { background: #2e7d32 !important; }
            [data-theme="dark"] [data-message-type="warning"] { background: #ed6c02 !important; }
            [data-theme="dark"] [data-message-type="error"] { background: #d32f2f !important; }
        `;
        document.head.appendChild(style);
    }

    static parseMarkdownMessageTypes(markdown) {
        const regex = /^(#{1,6}\s+.*?|(?:[*+-]|\d+\.)\s+.*?|>.*?|.*?\n(?:[-=])+\n|```.+?```|.*?\n\n)(\{[^}]+\})?$/gm;
        
        return markdown.replace(regex, (match, content, attributes) => {
            if (!attributes) return match;
            
            // Extrahiere Message-Type Attribute
            const messageType = attributes.match(/data-message-type=["'](\w+)["']/);
            if (!messageType) return match;
            
            const type = messageType[1];
            const styles = {
                info: 'border-left: 4px solid #0288d1; background: #e3f2fd; padding: 1em;',
                success: 'border-left: 4px solid #2e7d32; background: #e8f5e9; padding: 1em;',
                warning: 'border-left: 4px solid #ed6c02; background: #fff3e0; padding: 1em;',
                error: 'border-left: 4px solid #d32f2f; background: #ffebee; padding: 1em;'
            };
            
            if (content.startsWith('```')) return content;
            
            return `<div data-message-type="${type}" style="${styles[type]}">\n${content}\n</div>`;
        });
    }
}

// Initialisierung
document.addEventListener('DOMContentLoaded', () => {
    window.messageControl = new MessageControl();
    window.messageControl.init();
});