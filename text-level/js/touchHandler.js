export const TouchHandler = {
    init() {
        this.initViewport();
        this.initTouchEvents();
        this.initCssEditor();  // Neue Methode für CSS Editor
    },

    initViewport() {
        // Bestehender Code bleibt unverändert
        const setVH = () => {
            const vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
        };

        setVH();
        window.addEventListener('resize', setVH);

        if ('virtualKeyboard' in navigator) {
            window.visualViewport.addEventListener('resize', () => {
                document.body.style.height = window.visualViewport.height + 'px';
            });
        }
    },

    initCssEditor() {
        // Neue Methode für CSS Editor Handling
        const cssEditorHeader = document.querySelector('.css-editor-header');
        const cssEditorPanel = document.querySelector('.css-editor-panel');
        const cssEditorIcon = cssEditorHeader?.querySelector('.material-icons');
        
        if (!cssEditorHeader || !cssEditorPanel || !cssEditorIcon) return;

        // Event Handler für beide - Touch und Click
        const toggleHandler = (e) => {
            e.preventDefault();
            const isCollapsed = cssEditorPanel.classList.toggle('collapsed');
            cssEditorIcon.textContent = isCollapsed ? 'expand_less' : 'expand_more';
            
            // Speichern des Status
            localStorage.setItem('cssEditorCollapsed', isCollapsed);
        };

        // Click Event für Maus-Interaktion
        cssEditorHeader.addEventListener('click', toggleHandler);
        
        // Touch Event für Touch-Geräte
        cssEditorHeader.addEventListener('touchstart', toggleHandler, { passive: false });

        // Initial-Status wiederherstellen
        const wasCollapsed = localStorage.getItem('cssEditorCollapsed') === 'true';
        if (wasCollapsed !== cssEditorPanel.classList.contains('collapsed')) {
            cssEditorPanel.classList.toggle('collapsed');
            cssEditorIcon.textContent = wasCollapsed ? 'expand_less' : 'expand_more';
        }
    },

    initTouchEvents() {
        // Bestehender Touch-Events Code bleibt unverändert
        this.initDocumentListTouch();
        this.preventZoom();
        this.initScrollHandling();
    },

    initDocumentListTouch() {
        const listToggle = document.getElementById('list-toggle');
        const documentList = document.getElementById('document-list');
        
        if (listToggle && documentList) {
            let touchStartY = 0;
            
            listToggle.addEventListener('touchstart', (e) => {
                e.preventDefault();
                documentList.classList.toggle('collapsed');
            }, { passive: false });

            documentList.addEventListener('touchstart', (e) => {
                touchStartY = e.touches[0].clientY;
            }, { passive: true });

            documentList.addEventListener('touchmove', (e) => {
                const touchEndY = e.touches[0].clientY;
                const diff = touchEndY - touchStartY;
                
                if (Math.abs(diff) > 50) {
                    e.preventDefault();
                    if (diff > 0) { // Swipe down
                        documentList.classList.add('collapsed');
                    }
                }
            }, { passive: false });
        }
    },

    preventZoom() {
        document.addEventListener('touchstart', (e) => {
            if (e.touches.length > 1) {
                e.preventDefault();
            }
        }, { passive: false });
    },

    initScrollHandling() {
        const scrollableElements = document.querySelectorAll('#editor, #output, #css-editor');
        scrollableElements.forEach(element => {
            let isScrolling = false;
            let startX = 0;
            let startY = 0;

            element.addEventListener('touchstart', (e) => {
                isScrolling = true;
                startX = e.touches[0].pageX;
                startY = e.touches[0].pageY;
            }, { passive: true });

            element.addEventListener('touchmove', (e) => {
                if (!isScrolling) return;

                const deltaX = e.touches[0].pageX - startX;
                const deltaY = e.touches[0].pageY - startY;

                if (Math.abs(deltaX) > Math.abs(deltaY)) {
                    if (element.scrollWidth > element.clientWidth) {
                        e.stopPropagation();
                    }
                }
            }, { passive: true });

            element.addEventListener('touchend', () => {
                isScrolling = false;
            }, { passive: true });
        });
    },
/*
    toggleCssEditor() {
        console.log("CSS Editor");
        const panel = document.querySelector(".css-editor-panel");
        const icon = panel.querySelector(".css-editor-header .material-icons");
        
        if (!panel || !icon) return;
        
        const isCollapsed = panel.classList.toggle("collapsed");
        icon.textContent = isCollapsed ? "expand_less" : "expand_more";
        localStorage.setItem("cssEditorCollapsed", isCollapsed);
    }
    */
    
     toggleCssEditor() {
    const panel = document.querySelector('.css-editor-panel');
    if (panel) {
        if (panel.classList.contains('visible')) {
            panel.classList.remove('visible');
            panel.classList.add('collapsed');
        } else {
            panel.classList.add('visible');
            panel.classList.remove('collapsed');
        }
    }
}
    
};