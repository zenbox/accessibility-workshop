export class EnhancedMobileHandler {
    constructor() {
        this.activeTab = 'editor';
        this.isKeyboardVisible = false;
    }

    init() {
        if (!this.isMobileDevice()) return;
        
        this.createMobileLayout();
        this.setupEventListeners();
        this.setupKeyboardHandling();
    }

    isMobileDevice() {
        return window.matchMedia('(max-width: 767px)').matches;
    }

    createMobileLayout() {
        // Tab Navigation erstellen
        const tabNav = document.createElement('div');
        tabNav.className = 'mobile-tabs';
        tabNav.innerHTML = `
            <button class="mobile-tab active" data-tab="editor">Editor</button>
            <button class="mobile-tab" data-tab="preview">Vorschau</button>
        `;

        // Tabs einfügen
        const container = document.querySelector('.editor-container');
        container.insertBefore(tabNav, container.firstChild);

        // CSS Panel Handle hinzufügen
        const cssHeader = document.querySelector('.css-editor-header');
        const handle = document.createElement('div');
        handle.className = 'mobile-handle';
        cssHeader.insertBefore(handle, cssHeader.firstChild);

        // Initial Editor Panel aktivieren
        document.querySelector('.editor-panel').classList.add('active');
    }

    setupEventListeners() {
        // Tab Switching
        document.querySelector('.mobile-tabs').addEventListener('click', (e) => {
            const tab = e.target.closest('.mobile-tab');
            if (!tab) return;

            // Tabs umschalten
            document.querySelectorAll('.mobile-tab').forEach(t => 
                t.classList.toggle('active', t === tab));

            // Panels umschalten
            const targetPanel = tab.dataset.tab;
            document.querySelector('.editor-panel').classList.toggle('active', targetPanel === 'editor');
            document.querySelector('.preview-panel').classList.toggle('active', targetPanel === 'preview');

            this.activeTab = targetPanel;
        });

        // CSS Panel Touch Handling
        let touchStartY = 0;
        const cssPanel = document.querySelector('.css-editor-panel');
        const handle = cssPanel.querySelector('.mobile-handle');

        handle.addEventListener('touchstart', (e) => {
            touchStartY = e.touches[0].clientY;
        }, { passive: true });

        handle.addEventListener('touchmove', (e) => {
            const deltaY = e.touches[0].clientY - touchStartY;
            if (deltaY < -50) {
                cssPanel.classList.add('visible');
            } else if (deltaY > 50) {
                cssPanel.classList.remove('visible');
            }
        }, { passive: true });

        // Orientation Change
        window.addEventListener('orientationchange', () => {
            setTimeout(this.handleOrientationChange.bind(this), 100);
        });
    }

    setupKeyboardHandling() {
        if ('visualViewport' in window) {
            window.visualViewport.addEventListener('resize', () => {
                this.isKeyboardVisible = window.visualViewport.height < window.innerHeight;
                document.body.classList.toggle('keyboard-visible', this.isKeyboardVisible);
                
                if (this.isKeyboardVisible) {
                    // Scrolle zum aktiven Element
                    const activeElement = document.activeElement;
                    if (activeElement.tagName === 'TEXTAREA') {
                        setTimeout(() => {
                            activeElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        }, 100);
                    }
                }
            });
        }
    }

    handleOrientationChange() {
        const isLandscape = window.innerWidth > window.innerHeight;
        document.body.classList.toggle('landscape', isLandscape);
        
        if (!isLandscape) {
            // Zurück zum aktiven Tab im Portrait Mode
            const activeTab = document.querySelector(`[data-tab="${this.activeTab}"]`);
            if (activeTab) activeTab.click();
        }
    }
}

// Initialisierung
document.addEventListener('DOMContentLoaded', () => {
    const mobileHandler = new EnhancedMobileHandler();
    mobileHandler.init();
});