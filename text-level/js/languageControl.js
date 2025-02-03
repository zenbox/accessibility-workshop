export class LanguageControl {
    constructor() {
        this.levels = ['easy', 'simple', 'default', 'expert'];
        this.activeStates = {
            easy: true,
            simple: true,
            default: true,
            expert: true
        };
        this.icons = {
            easy: 'child_care',
            simple: 'emoji_people',
            default: 'person',
            expert: 'psychology'
        };
        this.tooltips = {
            easy: 'Leichte Sprache',
            simple: 'Einfache Sprache',
            default: 'Standardsprache',
            expert: 'Fachsprache'
        };
    }

    init() {
        this.setupMutationObserver();
        this.checkForLanguageLevels();
        this.injectStyles();
    }

    setupMutationObserver() {
        const observer = new MutationObserver(() => {
            this.checkForLanguageLevels();
        });

        const output = document.getElementById('output');
        if (output) {
            observer.observe(output, { 
                childList: true, 
                subtree: true, 
                attributes: true,
                attributeFilter: ['data-language-level'] 
            });
        }
    }

    checkForLanguageLevels() {
        const output = document.getElementById('output');
        if (!output) return;

        const hasLanguageLevels = !!output.querySelector('[data-language-level]');
        if (hasLanguageLevels) {
            this.createControls();
        }
    }

    createControls() {
        if (document.getElementById('language-controls')) return;

        const previewHeader = document.querySelector('.preview-panel h3');
        if (!previewHeader) return;

        const controlsContainer = this.createControlsContainer();
        this.levels.forEach(level => {
            const button = this.createControlButton(level);
            controlsContainer.appendChild(button);
        });

        previewHeader.appendChild(controlsContainer);
    }

    createControlsContainer() {
        const container = document.createElement('div');
        container.id = 'language-controls';
        container.className = 'language-control-buttons';
        container.style.cssText = `
            display: inline-flex;
            gap: 8px;
            margin-left: 16px;
            vertical-align: middle;
        `;
        return container;
    }

    createControlButton(level) {
        const button = document.createElement('button');
        button.className = 'language-control-button';
        button.setAttribute('data-language-level', level);
        button.setAttribute('title', this.tooltips[level]);
        button.style.cssText = `
            border: none;
            background: var(--button-bg);
            color: var(--button-text);
            padding: 4px;
            border-radius: 4px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: ${this.activeStates[level] ? '1' : '0.5'};
            transition: all 0.2s ease;
            z-index:8888;
        `;

        const icon = document.createElement('span');
        icon.className = 'material-icons';
        icon.textContent = this.icons[level];
        icon.style.fontSize = '18px';
        button.appendChild(icon);

        button.addEventListener('click', () => this.toggleVisibility(level, button));

        return button;
    }

    toggleVisibility(level, button) {
        this.activeStates[level] = !this.activeStates[level];
        button.style.opacity = this.activeStates[level] ? '1' : '0.5';

        const output = document.getElementById('output');
        if (!output) return;

        output.querySelectorAll(`[data-language-level="${level}"]`).forEach(element => {
            element.style.display = this.activeStates[level] ? '' : 'none';
        });
    }

    injectStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .language-control-button {
                position: relative;
                overflow: hidden;
            }
            .language-control-button:hover {
                filter: brightness(1.1);
            }
            .language-control-button:active {
                transform: scale(0.95);
            }
            .language-control-button::after {
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
            .language-control-button:hover::after {
                opacity: 1;
            }
            
            /* Dark mode Anpassungen */
            [data-theme="dark"] .language-control-button::after {
                background: rgba(0, 0, 0, 0.1);
            }
        `;
        document.head.appendChild(style);
    }

    static parseMarkdownLanguageLevels(markdown) {
        const regex = /^(#{1,6}\s+.*?|(?:[*+-]|\d+\.)\s+.*?|>.*?|.*?\n(?:[-=])+\n|```.+?```|.*?\n\n)(\{[^}]+\})?$/gm;
        
        return markdown.replace(regex, (match, content, attributes) => {
            if (!attributes) return match;
            
            const languageLevel = attributes.match(/data-language-level=["'](\w+)["']/);
            if (!languageLevel) return match;
            
            if (content.startsWith('```')) return content;
            
            return `<div data-language-level="${languageLevel[1]}">\n${content}\n</div>`;
        });
    }
}

// Initialisierung
document.addEventListener('DOMContentLoaded', () => {
    window.languageControl = new LanguageControl();
    window.languageControl.init();
});