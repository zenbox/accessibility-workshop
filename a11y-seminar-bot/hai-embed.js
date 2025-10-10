(function() {
    'use strict';
    
    // Namespace to avoid global conflicts
    const HybridAIWidget = {
        // Constants
        DEFAULT_LOGO_PATH: "https://hybridai.one/static/hai_logo_free_small.png",
        WIDGET_VERSION: "2.0.0",
        
        // State management
        state: {
            isInitialized: false,
            chatWindow: null,
            chatButton: null,
            isDragging: false,
            isResizing: false,
            dragOffset: { x: 0, y: 0 },
            originalPosition: {},
            audioContext: null,
            currentAudio: null,
            isCanvasActive: false,
            canvasBuffer: "",
            displayedAdminMessages: new Set(),
            messageCounter: 0,
            currentPrivacyMode: 'normal' // Track current privacy mode in state
        },
        
        // Configuration with defaults
        config: {
            chatbotId: null,
            chatbotServer: null,  // Will be dynamically set from script origin or page origin
            position: "bottom-right",
            width: "400px",
            height: "600px",
            marginX: "20px",
            marginY: "20px",
            opacity: "0.95",
            autoOpen: false,
            fontSize: "14px",
            color_scheme: "#4a6cf7",
            botlogourl: null,
            messagePrice: "0",
            adult_content: 0,
            welcome_message: "",
            customWelcomeMessage: null,
            ttsEnabled: false,
            theme: "default", // Theme options: default, whatsapp, cyberpunk, brutalist, persian, mckinsey, acidRave
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            zIndex: 9999,
            positionOffset: { top: 0, left: 0 },
            context: null, // Context information about where the widget is running
            // These will be populated from server/template
            bottitle: "HybridAI Assistant",
            bot_description: "AI-powered assistant",
            enablePaidMessages: false,
            enableFileUpload: false,
            dm1: "",
            dm2: "",
            dm3: "",
            serverFromWP: false,
            mode: "auto", // "auto", "inline", "floating", "both"
            createFloatingWidget: true,
            // Math expression support configuration
            enableMath: false,  // Default to disabled for safety
            mathConfig: {
                throwOnError: false,  // Don't break on LaTeX errors
                errorColor: '#cc0000',  // Show errors in red
                strict: false,
                output: 'html',
                trust: false,
                macros: {},
                delimiters: {
                    inline: ['$', '$'],
                    block: ['$$', '$$']
                }
            },
            // AI Assistant slogan feature
            showAIAssistantSlogan: false,  // New option to show rotating star and "AI ASSISTANT" text
            
            // Privacy settings
            privacyMode: 'normal', // 'normal' | 'no-tracking' | 'private'
            trackingDisabled: false, // Bot-level setting: permanently disable tracking
            piiSafetyEnabled: false, // Bot-level setting: enable PII filtering
            allowPrivacyToggle: true, // Bot-level setting: allow users to change privacy settings

            // Avatar settings
            avatarpictureurl: null,
            avatar_size: 'medium',
            invitation_message: 'Hi there! How can I help you today?',

            // Privacy notice and AI disclaimer
            privacyNoticeText: null,
            aiDisclaimerText: 'This is an AI system that can make errors'
        },
        
        // Initialize the widget
        init() {
            if (this.state.isInitialized) return;

            // Parse configuration from multiple sources
            this.parseConfiguration();

            // Auto-load theme library if needed
            this.loadThemeLibraryIfNeeded();

            // Detect and set widget mode
            this.detectAndSetMode();

            // Create styles
            this.createStyles();
            
            // Initialize browser tracking
            this.initializeBrowserTracking();

            // Initialize widgets based on mode
            this.initializeWidgets();
            
            // Set up global message listeners
            this.setupMessageListeners();
            
            // Initialize payment if needed
            if (this.config.adult_content) {
                this.checkAdultPayment();
            }
            
            this.state.isInitialized = true;
        },
        
        // Parse configuration from various sources
        parseConfiguration() {
            // Get current script
            const currentScript = document.currentScript || (function() {
                const scripts = document.getElementsByTagName('script');
                return scripts[scripts.length - 1];
            })();

            // Parse chatbotId from URL
            let urlChatbotId = null;
            if (currentScript && currentScript.src) {
                try {
                    // Handle both absolute and relative URLs
                    const scriptUrl = new URL(currentScript.src, window.location.origin);
                    urlChatbotId = scriptUrl.searchParams.get('chatbotId');

                    // Set chatbotServer based on the script's origin
                    // The widget always needs to load resources from where the script was served
                    // This ensures avatars and other assets load from the correct HybridAI server
                    this.config.chatbotServer = scriptUrl.origin;

                    // Parse showAIAssistantSlogan from URL parameters
                    const urlShowAIAssistantSlogan = scriptUrl.searchParams.get('showAIAssistantSlogan');
                    if (urlShowAIAssistantSlogan !== null) {
                        this.config.showAIAssistantSlogan = urlShowAIAssistantSlogan === 'true';
                    }

                    // Parse theme from URL parameters
                    const urlTheme = scriptUrl.searchParams.get('theme');
                    if (urlTheme !== null) {
                        this.config.theme = urlTheme;
                    }
                } catch (e) {
                    // If URL parsing fails, use window.location.origin as fallback
                    console.warn('HybridAI: Failed to parse script URL, using page origin:', e);
                    this.config.chatbotServer = window.location.origin;
                }
            } else {
                // No script src detected (inline script or other edge case)
                // Use the page's origin as the server
                console.log('HybridAI: No script src detected, using page origin');
                this.config.chatbotServer = window.location.origin;
            }
            
            // Check for config objects
            const configChatbotId = window.chatbotConfig?.chatbotId ||
                                  window.hybridai_chatbotConfig?.hybridai_chatbotId;
            const configApiKey = window.chatbotConfig?.apiKey ||
                                window.hybridai_chatbotConfig?.apiKey;

            // Save the dynamically detected server before merging user configs
            const detectedServer = this.config.chatbotServer;

            // Merge configurations
            if (window.chatbotConfig) {
                Object.assign(this.config, window.chatbotConfig);
            }
            if (window.hybridai_chatbotConfig) {
                Object.assign(this.config, window.hybridai_chatbotConfig);
                // Mark if from WordPress
                this.config.serverFromWP = true;
            }

            // If no chatbotServer was specified in user config, use the detected one
            if (!window.chatbotConfig?.chatbotServer && !window.hybridai_chatbotConfig?.chatbotServer) {
                this.config.chatbotServer = detectedServer;
            }

            // Final fallback: if chatbotServer is still null, use window.location.origin
            if (!this.config.chatbotServer) {
                console.log('HybridAI: No chatbotServer detected, using page origin as fallback');
                this.config.chatbotServer = window.location.origin;
            }

            // Debug log for server detection
            console.log('HybridAI: Using chatbotServer:', this.config.chatbotServer,
                        '(Page host:', window.location.hostname,
                        ', Script origin:', detectedServer || 'not detected', ')');

            // Use config chatbotId first, then URL parameter
            this.config.chatbotId = configChatbotId || urlChatbotId;
            // Store API key if provided
            this.config.apiKey = configApiKey;
            
            // Debug logging for AI Assistant slogan
            if (this.config.debug || this.config.showAIAssistantSlogan) {
                console.log("HybridAI Widget: AI Assistant Slogan enabled:", this.config.showAIAssistantSlogan);
            }
            
            // Validate required config
            if (!this.config.chatbotId) {
                console.error("HybridAI Widget: No chatbotId provided");
            }
            
            // Parse template variables if available
            this.parseTemplateVariables();
            
            // Parse fullscreen customization options
            const fsConfig = window.chatbotConfig?.fullscreen || window.hybridai_chatbotConfig?.fullscreen || {};
            this.config.fullscreenOverlayBg = fsConfig.overlayBg || window.chatbotConfig?.fullscreenOverlayBg || window.hybridai_chatbotConfig?.fullscreenOverlayBg;
            this.config.fullscreenHeaderBg = fsConfig.headerBg;
            this.config.fullscreenHeaderBorderColor = fsConfig.headerBorderColor;
            this.config.fullscreenHeaderPadding = fsConfig.headerPadding;
            this.config.fullscreenContentMaxWidth = fsConfig.contentMaxWidth;
            this.config.fullscreenContentPadding = fsConfig.contentPadding;
            this.config.fullscreenMessageMaxWidth = fsConfig.messageMaxWidth;
            this.config.fullscreenMessagePadding = fsConfig.messagePadding;
            this.config.fullscreenMessageBorderRadius = fsConfig.messageBorderRadius;
            this.config.fullscreenMessageFontSize = fsConfig.messageFontSize;
            this.config.fullscreenUserMessageBg = fsConfig.userMessageBg;
            this.config.fullscreenUserMessageColor = fsConfig.userMessageColor;
            this.config.fullscreenBotMessageBg = fsConfig.botMessageBg;
            this.config.fullscreenBotMessageColor = fsConfig.botMessageColor;
            this.config.fullscreenInputPadding = fsConfig.inputPadding;
            this.config.fullscreenInputBorderRadius = fsConfig.inputBorderRadius;
            this.config.fullscreenInputFontSize = fsConfig.inputFontSize;
            this.config.fullscreenWelcomeTitleSize = fsConfig.welcomeTitleSize;
            this.config.fullscreenWelcomeSubtitleSize = fsConfig.welcomeSubtitleSize;
            this.config.fullscreenWelcomeTitleColor = fsConfig.welcomeTitleColor;
            this.config.fullscreenWelcomeSubtitleColor = fsConfig.welcomeSubtitleColor;
            
            console.log("HybridAI Widget: Configuration loaded", this.config);
        },

        // Auto-load theme library if a non-default theme is configured
        loadThemeLibraryIfNeeded() {
            // Skip if theme is default or library already loaded
            if (this.config.theme === 'default' || typeof getWidgetThemeStyles !== 'undefined') {
                return;
            }

            // Check if widget-themes.js is already being loaded or is loaded
            const existingThemeScript = document.querySelector('script[src*="widget-themes.js"]');
            if (existingThemeScript) {
                return;
            }

            // Create and load the theme library script
            const script = document.createElement('script');
            script.src = `${this.config.chatbotServer}/static/widget-themes.js`;
            // Note: async=false on dynamically created scripts does not block parsing.
            // Use onload callback to apply effects once the library is ready.
            script.onload = () => {
                try {
                    if (typeof this.onThemeLibraryLoaded === 'function') {
                        this.onThemeLibraryLoaded();
                    }
                } catch (e) {
                    console.warn('HybridAI: Error in onThemeLibraryLoaded:', e);
                }
            };

            // Add script to document head
            document.head.appendChild(script);

            console.log(`HybridAI Widget: Auto-loading theme library for theme '${this.config.theme}'`);
        },

        // Called when widget-themes.js finished loading. Applies container/message CSS.
        onThemeLibraryLoaded() {
            console.log('HybridAI Widget: Theme library loaded');
            if (!this.config || this.config.theme === 'default') return;

            // Inject/refresh container CSS in parent document
            if (typeof getWidgetThemeStyles === 'function') {
                const styles = getWidgetThemeStyles(this.config.theme) || {};
                if (styles.containerCSS) {
                    let styleElement = document.getElementById('widget-theme-container-styles');
                    if (styleElement) styleElement.remove();
                    styleElement = document.createElement('style');
                    styleElement.id = 'widget-theme-container-styles';
                    styleElement.textContent = styles.containerCSS;
                    document.head.appendChild(styleElement);
                }
            }

            // Update message CSS and effects inside any loaded chat iframes
            const iframes = document.querySelectorAll('.hybridai-chat-iframe');
            iframes.forEach((iframe) => {
                const doc = iframe && iframe.contentDocument;
                if (!doc) return;

                if (typeof getWidgetThemeStyles === 'function') {
                    const styles = getWidgetThemeStyles(this.config.theme) || {};
                    // Remove old injected styles
                    const old = doc.getElementById('injected-theme-styles');
                    if (old) old.remove();
                    if (styles.messageCSS) {
                        const serverUrl = this.config.chatbotServer || window.location.origin;
                        const css = styles.messageCSS.replace(/\$\{SERVER_URL\}/g, serverUrl);
                        const styleEl = doc.createElement('style');
                        styleEl.id = 'injected-theme-styles';
                        styleEl.textContent = css;
                        doc.head.appendChild(styleEl);
                    }
                }

                if (typeof applyWidgetThemeEffects === 'function') {
                    try {
                        applyWidgetThemeEffects(this.config.theme, doc);
                    } catch (e) {
                        console.warn('HybridAI: applyWidgetThemeEffects failed:', e);
                    }
                }
            });
        },

        // Parse template variables from backend
        parseTemplateVariables() {
            // Server-side template variables are populated by the backend when serving the script
            // These values come directly from the database and backend processing
            
            try {
                // Boolean values - using tojson filter for proper boolean conversion
                this.config.enablePaidMessages = 0;
                this.config.enableFileUpload = 0;
                
                // String values - properly escaped for JavaScript
                this.config.messagePrice = "0.05";
                this.config.bottitle = "Teken";
                this.config.bot_description = "Ich bin Ihr informativer Assistent f\u00fcr die 11. Klasse Informatik. Lassen Sie uns gemeinsam die faszinierende Welt der Informatik erkunden, inklusive mathematischer und technischer Aspekte. Fragen Sie jetzt und lernen Sie durch Entdeckung!\n\nCreated by: Michael et al";
                this.config.botlogourl = null;
                this.config.dm1 = "Kannst du mir erkl\u00e4ren, wie man logarithmische Gleichungen l\u00f6st?";
                this.config.dm2 = "Wie kann ich den Begriff der Barrierefreiheit in Webdesign umsetzen?";
                this.config.dm3 = "Welche Rolle spielt die WCAG bei der Entwicklung von Webseiten?";
                
                // Number values
                this.config.adult_content = 0;
                
                // Privacy settings from server
                this.config.trackingDisabled = 0;
                this.config.piiSafetyEnabled = 0;
                this.config.allowPrivacyToggle = 1;

                // Avatar settings from server
                this.config.avatarpictureurl = null;
                this.config.avatar_size = "medium";
                this.config.invitation_message = "Hi there! How can I help you today?";

                // Privacy notice and AI disclaimer from server
                this.config.privacyNoticeText = null;
                this.config.aiDisclaimerText = "This is an AI system that can make errors";
                
                // Template variables take precedence when available (not empty)
                const templateWelcomeMessage = "say hi and give a hint what you are up for in the language of the user";
                const templatePlaceholderText = null;
                const templateColorScheme = "#FF6B6B";
                const templateBotLogoUrl = null;
                const templateBotTitle = "Teken";
                
                // Store original JS config values for comparison
                const jsCustomWelcomeMessage = this.config.customWelcomeMessage;
                
                // Template values override JS config when available and not empty
                if (templateColorScheme && templateColorScheme !== "None" && templateColorScheme !== "" && templateColorScheme !== "default_color" && templateColorScheme !== "#4a6cf7") {
                    this.config.color_scheme = templateColorScheme;
                }
                if (templateBotLogoUrl && templateBotLogoUrl !== "None" && templateBotLogoUrl !== "") {
                    this.config.botlogourl = templateBotLogoUrl;
                }
                if (templateBotTitle && templateBotTitle !== "None" && templateBotTitle !== "") {
                    this.config.bottitle = templateBotTitle;
                }
                
                // Keep separate handling for JS config and template welcome messages
                // this.config.customWelcomeMessage stays as is (for JS config)
                // this.config.welcome_message gets set from template (for server messages)
                if (templateWelcomeMessage !== undefined && templateWelcomeMessage !== "None") {
                    this.config.welcome_message = templateWelcomeMessage;
                }
                
                // Set placeholder text from template
                if (templatePlaceholderText && templatePlaceholderText !== "None" && templatePlaceholderText !== "") {
                    this.config.placeholder_text = templatePlaceholderText;
                } else {
                    this.config.placeholder_text = "Type your message...";
                }
                
                // Clean up empty values
                ['dm1', 'dm2', 'dm3'].forEach(key => {
                    if (this.config[key] === 'None' || this.config[key] === 'none') {
                        this.config[key] = '';
                    }
                });
                
                console.log("HybridAI Widget: Template variables loaded", {
                    enablePaidMessages: this.config.enablePaidMessages,
                    enableFileUpload: this.config.enableFileUpload,
                    adult_content: this.config.adult_content,
                    bottitle: this.config.bottitle,
                    color_scheme: this.config.color_scheme,
                    messagePrice: this.config.messagePrice,
                    hasDefaultMessages: (this.config.dm1 || this.config.dm2 || this.config.dm3) ? true : false
                });
            } catch (e) {
                console.error("HybridAI Widget: Error loading template variables", e);
            }
        },
        
        // Detect and set widget mode based on configuration and DOM
        detectAndSetMode() {
            // Check for inline widget containers in DOM
            const inlineContainers = document.querySelectorAll('.hai-chat-widget');
            const hasInlineElements = inlineContainers.length > 0;
            
            // Determine final mode based on configuration and DOM
            let finalMode = this.config.mode;

            if (this.config.mode === 'auto') {
                // If inline elements exist and createFloatingWidget is true, use 'both' mode
                if (hasInlineElements && this.config.createFloatingWidget) {
                    finalMode = 'both';
                } else if (hasInlineElements) {
                    finalMode = 'inline';
                } else {
                    finalMode = 'floating';
                }
            }
            
            // Store detected mode and inline elements
            this.config.detectedMode = finalMode;
            this.config.inlineElements = Array.from(inlineContainers);
            
            console.log('HybridAI Widget: Mode detection', {
                configMode: this.config.mode,
                detectedMode: finalMode,
                inlineElementsFound: inlineContainers.length
            });
        },
        
        // Initialize widgets based on detected mode
        initializeWidgets() {
            const mode = this.config.detectedMode;
            console.log('HybridAI: Initializing widgets with mode:', mode);

            if (mode === 'inline') {
                // Create inline widgets for each container
                this.config.inlineElements.forEach((container, index) => {
                    this.createInlineWidget(container, index);
                });
            } else if (mode === 'floating') {
                // Create floating widget (chat button + window)
                this.createChatButton();
                if (this.config.autoOpen) {
                    this.createChatWindow();
                    this.showChatWindow();
                }
            } else if (mode === 'both') {
                // Create both inline and floating widgets
                console.log('HybridAI: Mode is both, creating inline and floating widgets');
                this.config.inlineElements.forEach((container, index) => {
                    this.createInlineWidget(container, index);
                });
                console.log('HybridAI: createFloatingWidget setting:', this.config.createFloatingWidget);
                if (this.config.createFloatingWidget) {
                    console.log('HybridAI: Creating floating button in both mode');
                    this.createChatButton();
                    if (this.config.autoOpen) {
                        this.createChatWindow();
                        this.showChatWindow();
                    }
                }
            }
        },
        
        // Create inline widget using iframe approach
        createInlineWidget(container, index) {
            // Clear any existing content
            container.innerHTML = '';

            // Check if avatar is configured
            if (this.config.avatarpictureurl) {
                this.createInlineAvatarWidget(container, index);
            } else {
                // For non-avatar widgets, set up visibility observer
                this.createStandardInlineWidget(container, index, true);

                // Set up intersection observer for visibility-based welcome message
                const widgetIframe = container.querySelector('.hybridai-chat-iframe');
                if (widgetIframe && 'IntersectionObserver' in window) {
                    // Wait for iframe to load before observing
                    const setupObserver = () => {
                        const observer = new IntersectionObserver((entries) => {
                            entries.forEach(entry => {
                                if (entry.isIntersecting && entry.intersectionRatio > 0.3) {
                                    // Widget is at least 30% visible - trigger welcome message
                                    if (widgetIframe.contentWindow) {
                                        widgetIframe.contentWindow.postMessage({ type: 'trigger-welcome-message' }, '*');
                                    }
                                    // Disconnect observer after triggering
                                    observer.disconnect();
                                }
                            });
                        }, {
                            threshold: 0.3 // Trigger when 30% visible
                        });

                        // Start observing the iframe
                        observer.observe(widgetIframe);
                    };

                    // Ensure iframe is loaded before setting up observer
                    if (widgetIframe.contentDocument && widgetIframe.contentDocument.readyState === 'complete') {
                        setupObserver();
                    } else {
                        widgetIframe.addEventListener('load', setupObserver);
                    }
                }
            }
        },

        // Create standard inline widget
        createStandardInlineWidget(container, index, skipWelcome = false) {
            // Set up container with proper styling
            container.className = 'hybridai-widget hybridai-inline-widget';
            container.style.position = 'relative';
            container.style.width = '100%';
            container.style.height = container.style.height || '500px';
            container.style.border = '1px solid #ddd';
            container.style.borderRadius = this.config.borderRadius;
            // Allow overflow for AI Assistant slogan, otherwise hidden
            container.style.overflow = this.config.showAIAssistantSlogan ? 'visible' : 'hidden';
            container.style.background = this.config.theme === 'dark' ? '#1e1e1e' : '#fff';

            // Create title bar for inline widget
            const titleBar = this.createInlineTitleBar(index);
            container.appendChild(titleBar);

            // Create iframe
            const iframe = document.createElement('iframe');
            iframe.className = 'hybridai-chat-iframe';
            iframe.style.width = '100%';
            iframe.style.height = 'calc(100% - 40px)';
            iframe.style.border = 'none';
            iframe.style.background = 'transparent';

            // Generate iframe content with inline mode flags (skip welcome message if requested)
            const iframeContent = this.generateIframeContent(true, true, true, skipWelcome);

            // Set iframe content
            iframe.srcdoc = iframeContent;
            iframe.onload = () => {
                // Store widget reference for snap-out functionality
                if (iframe.contentWindow) {
                    iframe.contentWindow.widgetInstance = this;
                    iframe.contentWindow.widgetIndex = index;
                    iframe.contentWindow.isInlineWidget = true;
                }
                // Apply theme effects to inline widget
                this.applyThemeEffects(iframe);
            };
            
            container.appendChild(iframe);
            
            // AI Assistant slogan is now handled via CSS pseudo-elements
            // No DOM elements need to be created
            
            // Store reference to inline widget
            if (!this.state.inlineWidgets) {
                this.state.inlineWidgets = [];
            }
            this.state.inlineWidgets[index] = {
                container: container,
                iframe: iframe,
                titleBar: titleBar
            };
            
            console.log(`HybridAI Widget: Inline widget ${index} created`);
            
            // Update privacy indicator to show current mode (Normal Mode by default)
            this.updatePrivacyIndicator();
        },

        // Create inline widget with avatar
        createInlineAvatarWidget(container, index) {
            // First, create the standard widget but hide it and skip welcome message
            this.createStandardInlineWidget(container, index, true);

            // Get the widget iframe that was just created
            const widgetIframe = container.querySelector('.hybridai-chat-iframe');
            const titleBar = container.querySelector('.hybridai-title-bar');

            // Hide the iframe and title bar initially
            if (widgetIframe) widgetIframe.style.display = 'none';
            if (titleBar) titleBar.style.display = 'none';

            // Create avatar overlay
            const avatarOverlay = document.createElement('div');
            avatarOverlay.className = 'hybridai-inline-avatar-overlay';
            avatarOverlay.style.position = 'absolute';
            avatarOverlay.style.top = '0';
            avatarOverlay.style.left = '0';
            avatarOverlay.style.width = '100%';
            avatarOverlay.style.height = '100%';
            avatarOverlay.style.display = 'flex';
            avatarOverlay.style.justifyContent = 'center';
            avatarOverlay.style.alignItems = 'center';
            avatarOverlay.style.background = this.config.theme === 'dark' ? '#1e1e1e' : '#fff';
            avatarOverlay.style.zIndex = '10';
            avatarOverlay.style.cursor = 'pointer';
            avatarOverlay.style.transition = 'all 0.5s ease';

            // Create avatar display
            const avatarContainer = document.createElement('div');
            avatarContainer.className = 'hybridai-inline-avatar-display';
            avatarContainer.style.textAlign = 'center';
            avatarContainer.style.padding = '20px';  // Add padding to move content away from edges

            // Create wrapper for avatar and badge
            const avatarWrapper = document.createElement('div');
            avatarWrapper.style.position = 'relative';
            avatarWrapper.style.display = 'inline-block';

            const avatarImg = document.createElement('img');
            avatarImg.src = this.config.avatarpictureurl.startsWith('http') ?
                this.config.avatarpictureurl :
                this.config.chatbotServer + '/' + this.config.avatarpictureurl.replace(/^\//, '');
            avatarImg.alt = 'Chat with me';

            // Calculate avatar size based on container dimensions
            // Use larger percentages to better utilize available space
            const containerHeight = parseInt(container.style.height) || 500;
            const containerWidth = container.offsetWidth || 400;
            const minDimension = Math.min(containerHeight, containerWidth);

            // Scale avatar based on size setting and container dimensions
            // Use 50-70% of the smaller dimension for better space utilization
            const sizeMultiplier = this.config.avatar_size === 'large' ? 0.7 :
                                  this.config.avatar_size === 'medium' ? 0.5 :
                                  this.config.avatar_size === 'small' ? 0.35 : 0.25; // corner

            const avatarSize = Math.min(Math.floor(minDimension * sizeMultiplier), 400); // Max 400px

            avatarImg.style.width = avatarSize + 'px';
            avatarImg.style.height = avatarSize + 'px';
            avatarImg.style.borderRadius = '50%';
            avatarImg.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.2)';
            avatarImg.style.objectFit = 'cover';
            avatarImg.style.transition = 'transform 0.3s ease';
            avatarImg.style.position = 'relative';

            // Create subtle "Click to Chat" badge for inline widget
            const chatBadge = document.createElement('div');
            chatBadge.className = 'hybridai-inline-chat-badge';

            // Scale badge based on avatar size for inline widget
            const badgeFontSize = Math.max(12, Math.min(16, Math.floor(avatarSize * 0.06))) + 'px';
            const badgePadding = avatarSize > 200 ? '8px 14px' : '6px 10px';

            chatBadge.innerHTML = '<span style="opacity: 0.8;">💬</span> <span>Click to Chat</span>';
            chatBadge.style.cssText = `
                position: absolute;
                bottom: 15%;
                left: 50%;
                transform: translateX(-50%);
                background: rgba(255, 255, 255, 0.92);
                color: ${this.config.color_scheme || '#2196F3'};
                padding: ${badgePadding};
                border-radius: 20px;
                font-size: ${badgeFontSize};
                font-weight: 600;
                white-space: nowrap;
                box-shadow: 0 3px 10px rgba(0, 0, 0, 0.15);
                z-index: 2;
                pointer-events: none;
                animation: hybridai-subtle-pulse 3s ease-in-out infinite;
                backdrop-filter: blur(10px);
                border: 1px solid rgba(255, 255, 255, 0.3);
            `;

            const invitationText = document.createElement('div');
            invitationText.className = 'hybridai-inline-invitation';
            invitationText.textContent = this.config.invitation_message;
            invitationText.style.marginTop = '20px';
            // Scale font size based on avatar size for better proportion
            invitationText.style.fontSize = Math.max(16, Math.floor(avatarSize * 0.08)) + 'px';
            invitationText.style.color = this.config.theme === 'dark' ? '#fff' : '#333';
            invitationText.style.fontWeight = '500';
            invitationText.style.padding = '0 20px';
            invitationText.style.maxWidth = '80%';
            invitationText.style.margin = '20px auto 0';

            // Add avatar and badge to wrapper
            avatarWrapper.appendChild(avatarImg);
            avatarWrapper.appendChild(chatBadge);

            // Add wrapper and invitation text to container
            avatarContainer.appendChild(avatarWrapper);
            avatarContainer.appendChild(invitationText);
            avatarOverlay.appendChild(avatarContainer);

            // Add hover effect
            avatarImg.addEventListener('mouseenter', () => {
                avatarImg.style.transform = 'scale(1.05)';
            });

            avatarImg.addEventListener('mouseleave', () => {
                avatarImg.style.transform = 'scale(1)';
            });

            // Handle click to show widget
            avatarOverlay.addEventListener('click', () => {
                // Fade out avatar overlay
                avatarOverlay.style.opacity = '0';
                avatarOverlay.style.pointerEvents = 'none';

                setTimeout(() => {
                    // Remove overlay and show the actual widget
                    avatarOverlay.remove();
                    if (widgetIframe) {
                        widgetIframe.style.display = 'block';
                        // Trigger welcome message when widget becomes visible
                        setTimeout(() => {
                            if (widgetIframe.contentWindow) {
                                widgetIframe.contentWindow.postMessage({ type: 'trigger-welcome-message' }, '*');
                            }
                        }, 100);
                    }
                    if (titleBar) titleBar.style.display = 'flex';
                }, 500);
            });

            // Add the overlay to the container
            container.appendChild(avatarOverlay);

            console.log(`HybridAI Widget: Inline avatar widget ${index} created`);
        },
        
        // Create title bar for inline widget
        createInlineTitleBar(index) {
            const titleBar = document.createElement('div');
            titleBar.className = 'hybridai-title-bar';
            titleBar.style.background = this.config.color_scheme;
            titleBar.style.color = 'white';
            titleBar.style.padding = '0 10px';
            titleBar.style.height = '40px';
            titleBar.style.display = 'flex';
            titleBar.style.justifyContent = 'space-between';
            titleBar.style.alignItems = 'center';
            titleBar.style.userSelect = 'none';
            
            // Title content
            const titleContent = document.createElement('div');
            titleContent.className = 'hybridai-title-content';
            titleContent.style.display = 'flex';
            titleContent.style.alignItems = 'center';
            titleContent.style.gap = '8px';
            
            // Logo
            const logoUrl = (this.config.botlogourl && this.config.botlogourl !== 'None' && this.config.botlogourl !== '') 
                ? (this.config.botlogourl.startsWith('http') ? this.config.botlogourl : this.config.chatbotServer + '/' + this.config.botlogourl)
                : this.DEFAULT_LOGO_PATH;
            const logo = document.createElement('img');
            logo.src = logoUrl;
            logo.className = 'hybridai-title-logo';
            logo.style.height = '20px';
            logo.style.width = 'auto';
            logo.onerror = () => {
                logo.src = this.DEFAULT_LOGO_PATH;
            };
            
            // Add debug info on double-click
            logo.addEventListener('dblclick', () => {
                this.showDebugInfo(index);
            });
            
            titleContent.appendChild(logo);
            
            // Title text
            const titleText = document.createElement('span');
            titleText.className = 'hybridai-title-text';
            titleText.textContent = this.config.bottitle;
            titleText.style.fontWeight = 'bold';
            titleText.style.fontSize = '14px';
            titleContent.appendChild(titleText);
            
            // Info icon with tooltip
            if (this.config.bot_description) {
                const infoIcon = document.createElement('i');
                infoIcon.className = 'hybridai-info-icon';
                infoIcon.textContent = 'i';
                infoIcon.style.cursor = 'pointer';
                infoIcon.style.width = '16px';
                infoIcon.style.height = '16px';
                infoIcon.style.border = '1px solid white';
                infoIcon.style.borderRadius = '50%';
                infoIcon.style.display = 'inline-flex';
                infoIcon.style.alignItems = 'center';
                infoIcon.style.justifyContent = 'center';
                infoIcon.style.fontSize = '10px';
                infoIcon.style.fontWeight = '600';
                infoIcon.style.opacity = '0.8';
                infoIcon.style.position = 'relative';
                infoIcon.style.flexShrink = '0';
                infoIcon.style.fontStyle = 'normal';
                infoIcon.style.lineHeight = '1';
                infoIcon.style.verticalAlign = 'middle';
                
                // Tooltip
                const tooltip = document.createElement('div');
                tooltip.className = 'hybridai-tooltip';
                tooltip.textContent = this.config.bot_description;
                tooltip.style.display = 'none';
                tooltip.style.position = 'absolute';
                tooltip.style.top = '100%';
                tooltip.style.left = '0';
                tooltip.style.marginLeft = '10px';
                tooltip.style.width = '200px';
                tooltip.style.maxWidth = 'calc(100vw - 40px)';
                tooltip.style.marginTop = '8px';
                tooltip.style.background = 'rgba(0, 0, 0, 0.9)';
                tooltip.style.color = 'white';
                tooltip.style.padding = '10px';
                tooltip.style.borderRadius = '4px';
                tooltip.style.fontSize = '12px';
                tooltip.style.zIndex = '10001';
                tooltip.style.whiteSpace = 'pre-wrap';
                tooltip.style.wordWrap = 'break-word';
                tooltip.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.2)';
                
                infoIcon.appendChild(tooltip);
                
                infoIcon.addEventListener('mouseenter', () => {
                    tooltip.style.display = 'block';
                    infoIcon.style.opacity = '1';
                    infoIcon.style.background = 'rgba(255, 255, 255, 0.1)';
                });
                
                infoIcon.addEventListener('mouseleave', () => {
                    tooltip.style.display = 'none';
                    infoIcon.style.opacity = '0.8';
                    infoIcon.style.background = 'transparent';
                });
                
                titleContent.appendChild(infoIcon);
            }
            
            titleBar.appendChild(titleContent);
            
            // Controls
            const controls = document.createElement('div');
            controls.className = 'hybridai-controls';
            controls.style.display = 'flex';
            controls.style.alignItems = 'center';
            controls.style.gap = '8px';

            // 3-dot menu button (inline mode)
            const menuBtn = document.createElement('button');
            menuBtn.className = 'hybridai-control-button hybridai-menu-button';
            menuBtn.innerHTML = '⋮';
            menuBtn.title = 'Menu';
            menuBtn.style.background = 'none';
            menuBtn.style.border = 'none';
            menuBtn.style.color = 'white';
            menuBtn.style.cursor = 'pointer';
            menuBtn.style.fontSize = '16px';
            menuBtn.style.opacity = '0.8';
            menuBtn.style.padding = '4px';
            menuBtn.style.width = '24px';
            menuBtn.style.height = '24px';
            menuBtn.style.display = 'flex';
            menuBtn.style.alignItems = 'center';
            menuBtn.style.justifyContent = 'center';
            menuBtn.addEventListener('click', (e) => this.toggleInlineMenu(e, menuBtn, index));
            
            // Font size decrease button
            const fontDecreaseBtn = document.createElement('button');
            fontDecreaseBtn.className = 'hybridai-control-button hybridai-font-control';
            fontDecreaseBtn.innerHTML = 'a';
            fontDecreaseBtn.title = 'Decrease font size';
            fontDecreaseBtn.style.background = 'none';
            fontDecreaseBtn.style.border = 'none';
            fontDecreaseBtn.style.color = 'white';
            fontDecreaseBtn.style.cursor = 'pointer';
            fontDecreaseBtn.style.fontSize = '12px';
            fontDecreaseBtn.style.opacity = '0.8';
            fontDecreaseBtn.style.padding = '4px';
            fontDecreaseBtn.style.width = '24px';
            fontDecreaseBtn.style.height = '24px';
            fontDecreaseBtn.style.display = 'flex';
            fontDecreaseBtn.style.alignItems = 'center';
            fontDecreaseBtn.style.justifyContent = 'center';
            fontDecreaseBtn.style.fontFamily = 'Arial, sans-serif';
            
            fontDecreaseBtn.addEventListener('click', () => {
                const iframe = this.state.inlineWidgets[index].iframe;
                if (iframe && iframe.contentWindow) {
                    iframe.contentWindow.postMessage({ type: 'change-font-size', delta: -1 }, '*');
                }
            });
            
            // Font size increase button
            const fontIncreaseBtn = document.createElement('button');
            fontIncreaseBtn.className = 'hybridai-control-button hybridai-font-control';
            fontIncreaseBtn.innerHTML = 'A';
            fontIncreaseBtn.title = 'Increase font size';
            fontIncreaseBtn.style.background = 'none';
            fontIncreaseBtn.style.border = 'none';
            fontIncreaseBtn.style.color = 'white';
            fontIncreaseBtn.style.cursor = 'pointer';
            fontIncreaseBtn.style.fontSize = '14px';
            fontIncreaseBtn.style.fontWeight = 'bold';
            fontIncreaseBtn.style.opacity = '0.8';
            fontIncreaseBtn.style.padding = '4px';
            fontIncreaseBtn.style.width = '24px';
            fontIncreaseBtn.style.height = '24px';
            fontIncreaseBtn.style.display = 'flex';
            fontIncreaseBtn.style.alignItems = 'center';
            fontIncreaseBtn.style.justifyContent = 'center';
            fontIncreaseBtn.style.fontFamily = 'Arial, sans-serif';
            fontIncreaseBtn.style.marginLeft = '-4px';
            
            fontIncreaseBtn.addEventListener('click', () => {
                const iframe = this.state.inlineWidgets[index].iframe;
                if (iframe && iframe.contentWindow) {
                    iframe.contentWindow.postMessage({ type: 'change-font-size', delta: 1 }, '*');
                }
            });
            
            // Audio toggle button
            const audioToggleBtn = document.createElement('button');
            audioToggleBtn.className = 'hybridai-control-button';
            const audioEnabled = localStorage.getItem('sound_enabled') === 'true';
            audioToggleBtn.innerHTML = audioEnabled ? '🔊' : '🔇';
            audioToggleBtn.title = audioEnabled ? 'Disable audio' : 'Enable audio';
            audioToggleBtn.style.background = 'none';
            audioToggleBtn.style.border = 'none';
            audioToggleBtn.style.color = 'white';
            audioToggleBtn.style.cursor = 'pointer';
            audioToggleBtn.style.fontSize = '16px';
            audioToggleBtn.style.opacity = '0.8';
            audioToggleBtn.style.padding = '4px';
            audioToggleBtn.style.width = '24px';
            audioToggleBtn.style.height = '24px';
            audioToggleBtn.style.display = 'flex';
            audioToggleBtn.style.alignItems = 'center';
            audioToggleBtn.style.justifyContent = 'center';
            
            audioToggleBtn.addEventListener('click', () => {
                const iframe = this.state.inlineWidgets[index].iframe;
                if (iframe && iframe.contentWindow) {
                    iframe.contentWindow.postMessage({ type: 'toggle-audio' }, '*');
                    // Update button state after a short delay to let the iframe update localStorage
                    setTimeout(() => {
                        const newAudioEnabled = localStorage.getItem('sound_enabled') === 'true';
                        audioToggleBtn.innerHTML = newAudioEnabled ? '🔊' : '🔇';
                        audioToggleBtn.title = newAudioEnabled ? 'Disable audio' : 'Enable audio';
                    }, 100);
                }
            });
            
            // Snap-out button
            const snapOutButton = document.createElement('button');
            snapOutButton.className = 'hybridai-control-button';
            snapOutButton.innerHTML = '↗';
            snapOutButton.title = 'Open in floating window';
            snapOutButton.style.background = 'none';
            snapOutButton.style.border = 'none';
            snapOutButton.style.color = 'white';
            snapOutButton.style.cursor = 'pointer';
            snapOutButton.style.fontSize = '16px';
            snapOutButton.style.opacity = '0.8';
            snapOutButton.style.padding = '4px';
            snapOutButton.style.width = '24px';
            snapOutButton.style.height = '24px';
            snapOutButton.style.display = 'flex';
            snapOutButton.style.alignItems = 'center';
            snapOutButton.style.justifyContent = 'center';
            
            snapOutButton.addEventListener('click', () => {
                this.snapOutInlineWidget(index);
            });
            
            // Add hover effects
            [menuBtn, fontDecreaseBtn, fontIncreaseBtn, audioToggleBtn, snapOutButton].forEach(btn => {
                btn.addEventListener('mouseenter', () => {
                    btn.style.opacity = '1';
                });
                
                btn.addEventListener('mouseleave', () => {
                    btn.style.opacity = '0.8';
                });
            });
            
            // Add all buttons to controls
            controls.appendChild(menuBtn);
            controls.appendChild(fontDecreaseBtn);
            controls.appendChild(fontIncreaseBtn);
            controls.appendChild(audioToggleBtn);
            controls.appendChild(snapOutButton);
            titleBar.appendChild(controls);
            
            return titleBar;
        },
        
        // Snap out inline widget to separate floating window
        snapOutInlineWidget(index) {
            const inlineWidget = this.state.inlineWidgets[index];
            if (!inlineWidget) return;
            
            console.log(`HybridAI Widget: Snapping out inline widget ${index}`);
            
            // Check if we already have a snapped-out widget for this index
            let snappedOutWidget = this.state.snappedOutWidgets?.[index];
            
            if (snappedOutWidget) {
                // Reuse existing snapped-out widget
                console.log(`HybridAI Widget: Reusing existing snapped-out widget for index ${index}`);
                
                // Get current state from inline widget iframe
                let currentMessages = [];
                let currentInput = '';
                let scrollPosition = 0;
                
                try {
                    const iframeWindow = inlineWidget.iframe.contentWindow;
                    if (iframeWindow && iframeWindow.getChatState) {
                        const state = iframeWindow.getChatState();
                        currentMessages = state.messages || [];
                        currentInput = state.inputValue || '';
                        scrollPosition = state.scrollPosition || 0;
                    }
                } catch (e) {
                    console.warn('Could not get chat state from inline widget:', e);
                }
                
                // Update the existing snapped-out widget's state
                try {
                    if (snappedOutWidget.iframe.contentWindow.setChatState) {
                        snappedOutWidget.iframe.contentWindow.setChatState({
                            messages: currentMessages,
                            inputValue: currentInput,
                            scrollPosition: scrollPosition,
                            snapSourceType: 'inline',
                            snapSourceIndex: index
                        });
                    }
                } catch (e) {
                    console.warn('Could not update state in snapped-out widget:', e);
                }
                
                // Show the snapped-out widget
                snappedOutWidget.container.style.display = 'block';
                
                // Ensure mobile fullscreen is applied immediately
                if (this.isMobile()) {
                    snappedOutWidget.container.style.width = '100vw';
                    // Use window.innerHeight for accurate viewport height
                    snappedOutWidget.container.style.height = window.innerHeight + 'px';
                    snappedOutWidget.container.style.left = '0';
                    snappedOutWidget.container.style.top = '0';
                    snappedOutWidget.container.style.position = 'fixed';
                }
                
            } else {
                // Create new snapped-out widget for first time
                let currentMessages = [];
                let currentInput = '';
                let scrollPosition = 0;
                let width = null, height = null;
                
                try {
                    const iframeWindow = inlineWidget.iframe.contentWindow;
                    if (iframeWindow && iframeWindow.getChatState) {
                        const state = iframeWindow.getChatState();
                        currentMessages = state.messages || [];
                        currentInput = state.inputValue || '';
                        scrollPosition = state.scrollPosition || 0;
                    }
                    // Maße des Containers auslesen
                    const rect = inlineWidget.container.getBoundingClientRect();
                    width = rect.width;
                    height = rect.height;
                } catch (e) {
                    console.warn('Could not get chat state from inline widget:', e);
                }
                
                // Create a separate snapped-out floating widget
                snappedOutWidget = this.createSnappedOutFloatingWidget(index, {
                    messages: currentMessages,
                    inputValue: currentInput,
                    scrollPosition: scrollPosition
                }, width, height);
            }
            
            // DON'T terminate the inline iframe - keep it alive
            // inlineWidget.iframe.src = 'about:blank'; // REMOVED
            
            // Store reference to snapped-out widget
            inlineWidget.snappedOutWidget = snappedOutWidget;
            
            // Mark inline widget as snapped out
            inlineWidget.isSnappedOut = true;
            inlineWidget.container.style.opacity = '0.5';
            inlineWidget.container.style.pointerEvents = 'none';
            
            // Add overlay message
            const overlay = document.createElement('div');
            overlay.className = 'hybridai-snapped-out-overlay';
            overlay.style.position = 'absolute';
            overlay.style.top = '50%';
            overlay.style.left = '50%';
            overlay.style.transform = 'translate(-50%, -50%)';
            overlay.style.background = 'rgba(0, 0, 0, 0.8)';
            overlay.style.color = 'white';
            overlay.style.padding = '20px';
            overlay.style.borderRadius = '8px';
            overlay.style.textAlign = 'center';
            overlay.style.zIndex = '1000';
            overlay.style.fontSize = '14px';
            overlay.innerHTML = `
                <div>Chat moved to floating window</div>
                <button onclick="HybridAIWidget.snapInFromOverlay(${index})" 
                        style="margin-top: 10px; padding: 5px 15px; background: ${this.config.color_scheme}; 
                               color: white; border: none; border-radius: 4px; cursor: pointer;">
                    Snap Back In
                </button>
            `;
            
            inlineWidget.container.appendChild(overlay);
            inlineWidget.overlay = overlay;
        },
        
        // Create separate snapped-out floating widget
        createSnappedOutFloatingWidget(sourceIndex, initialState, width, height) {
            console.log(`HybridAI Widget: Creating snapped-out floating widget for inline ${sourceIndex}`);
            
            // Create container for snapped-out widget
            const container = document.createElement('div');
            container.className = 'hybridai-widget hybridai-chat-window hybridai-snapped-out-widget';
            container.style.position = 'fixed';
            
            // Set initial size - force fullscreen on mobile
            if (this.isMobile()) {
                container.style.width = '100vw';
                // Use window.innerHeight for accurate viewport height on mobile
                container.style.height = window.innerHeight + 'px';
                container.style.left = '0';
                container.style.top = '0';
                container.style.position = 'fixed';
            } else {
                // Setze Maße, falls übergeben
                if (width && height) {
                    container.style.width = width + 'px';
                    container.style.height = height + 'px';
                } else {
                    container.style.width = this.config.width;
                    container.style.height = this.config.height;
                }
            }
            
            container.style.backgroundColor = this.config.theme === 'dark' ? '#1e1e1e' : '#fff';
            container.style.borderRadius = this.config.borderRadius;
            container.style.boxShadow = this.config.boxShadow;
            container.style.zIndex = this.config.zIndex + 1; // Higher than regular floating widget
            container.style.display = 'block';
            container.style.opacity = this.config.opacity;
            // Allow overflow for AI Assistant slogan, otherwise hidden
            container.style.overflow = this.config.showAIAssistantSlogan ? 'visible' : 'hidden';
            container.style.minWidth = '350px';
            container.style.minHeight = '400px';
            container.style.maxWidth = '90vw';
            // Remove max-height constraint on mobile
            if (!this.isMobile()) {
                container.style.maxHeight = 'calc(100vh - 40px)';
            }
            
            // Position it slightly offset from default position (only on desktop)
            if (!this.isMobile()) {
                this.setSnappedOutWindowPosition(container, sourceIndex);
            }
            
            // Create title bar with snap-in button
            const titleBar = this.createSnappedOutTitleBar(sourceIndex);
            container.appendChild(titleBar);
            
            // Create iframe
            const iframe = document.createElement('iframe');
            iframe.className = 'hybridai-chat-iframe';
            iframe.style.width = '100%';
            iframe.style.height = 'calc(100% - 40px)';
            iframe.style.border = 'none';
            iframe.style.background = 'transparent';
            
            // Generate iframe content (not inline mode for snapped-out)
            // Pass skipWelcomeMessage as true to prevent duplicate welcome message
            const iframeContent = this.generateIframeContent(false, false, false, true);
            
            // Set iframe content using srcdoc (like inline widget does)
            iframe.srcdoc = iframeContent;
            
            // Set iframe content and restore state
            iframe.onload = () => {
                // Store widget reference
                if (iframe.contentWindow) {
                    iframe.contentWindow.widgetInstance = this;
                    iframe.contentWindow.isSnappedOutWidget = true;
                    iframe.contentWindow.sourceInlineIndex = sourceIndex;

                    // Apply theme effects to snapped-out widget
                    this.applyThemeEffects(iframe);

                    // Restore the exact state after iframe loads
                    setTimeout(() => {
                        try {
                            if (iframe.contentWindow.setChatState) {
                                iframe.contentWindow.setChatState({
                                    messages: initialState.messages,
                                    inputValue: initialState.inputValue,
                                    scrollPosition: initialState.scrollPosition,
                                    snapSourceType: 'inline',
                                    snapSourceIndex: sourceIndex
                                });
                            }
                        } catch (e) {
                            console.warn('Could not restore state to snapped-out widget:', e);
                        }
                    }, 100);
                }
            };
            
            container.appendChild(iframe);
            
            // AI Assistant slogan is now handled via CSS pseudo-elements
            // No DOM elements need to be created
            
            // Add drag functionality for snapped-out widget (only on desktop)
            if (!this.isMobile()) {
                this.setupSnappedOutDragging(container, titleBar);
            }
            
            // Add resize functionality - use separate handles (only on desktop)
            const resizeHandleBottomRight = document.createElement('div');
            resizeHandleBottomRight.className = 'hybridai-resize-handle bottom-right';
            container.appendChild(resizeHandleBottomRight);
            
            const resizeHandleTopLeft = document.createElement('div');
            resizeHandleTopLeft.className = 'hybridai-resize-handle top-left';
            container.appendChild(resizeHandleTopLeft);
            
            // Setup resize or mobile fullscreen functionality
            if (this.isMobile()) {
                // Only set up mobile fullscreen if not already done
                if (!container._cleanupMobileFullscreen) {
                    container._cleanupMobileFullscreen = this.setupMobileFullscreen(container);
                }
            } else {
                this.setupManualResize(container, resizeHandleBottomRight, 'bottom-right');
                this.setupManualResize(container, resizeHandleTopLeft, 'top-left');
            }
            
            // Add to DOM
            document.body.appendChild(container);
            
            const snappedOutWidget = {
                container: container,
                iframe: iframe,
                titleBar: titleBar,
                sourceIndex: sourceIndex
            };
            
            // Store reference
            if (!this.state.snappedOutWidgets) {
                this.state.snappedOutWidgets = [];
            }
            this.state.snappedOutWidgets[sourceIndex] = snappedOutWidget;
            
            return snappedOutWidget;
        },
        
        // Set position for snapped-out widget (offset from default)
        setSnappedOutWindowPosition(container, sourceIndex) {
            const offset = sourceIndex * 30; // Offset each snapped-out widget
            
            // Calculate position based on config
            let bottom, right, top, left;
            
            if (this.config.position.includes('bottom')) {
                bottom = `calc(${this.config.marginY} + ${offset}px)`;
                container.style.bottom = bottom;
            } else {
                top = `calc(${this.config.marginY} + ${offset}px)`;
                container.style.top = top;
            }
            
            if (this.config.position.includes('right')) {
                right = `calc(${this.config.marginX} + ${offset}px)`;
                container.style.right = right;
            } else {
                left = `calc(${this.config.marginX} + ${offset}px)`;
                container.style.left = left;
            }
        },
        
        // Create title bar for snapped-out widget
        createSnappedOutTitleBar(sourceIndex) {
            const titleBar = document.createElement('div');
            titleBar.className = 'hybridai-title-bar';
            titleBar.style.background = this.config.color_scheme;
            titleBar.style.color = 'white';
            titleBar.style.padding = '0 10px';
            titleBar.style.height = '40px';
            titleBar.style.display = 'flex';
            titleBar.style.justifyContent = 'space-between';
            titleBar.style.alignItems = 'center';
            titleBar.style.cursor = 'move';
            titleBar.style.userSelect = 'none';
            
            // Title content
            const titleContent = document.createElement('div');
            titleContent.className = 'hybridai-title-content';
            titleContent.style.display = 'flex';
            titleContent.style.alignItems = 'center';
            titleContent.style.gap = '8px';
            
            // Logo
            const logoUrl = (this.config.botlogourl && this.config.botlogourl !== 'None' && this.config.botlogourl !== '') 
                ? (this.config.botlogourl.startsWith('http') ? this.config.botlogourl : this.config.chatbotServer + '/' + this.config.botlogourl)
                : this.DEFAULT_LOGO_PATH;
            const logo = document.createElement('img');
            logo.src = logoUrl;
            logo.className = 'hybridai-title-logo';
            logo.style.height = '20px';
            logo.style.width = 'auto';
            logo.onerror = () => {
                logo.src = this.DEFAULT_LOGO_PATH;
            };
            titleContent.appendChild(logo);
            
            // Title text
            const titleText = document.createElement('span');
            titleText.className = 'hybridai-title-text';
            titleText.textContent = `${this.config.bottitle} (Snapped Out)`;
            titleText.style.fontWeight = 'bold';
            titleText.style.fontSize = '14px';
            titleContent.appendChild(titleText);
            
            titleBar.appendChild(titleContent);
            
            // Controls
            const controls = document.createElement('div');
            controls.className = 'hybridai-controls';
            controls.style.display = 'flex';
            controls.style.alignItems = 'center';
            controls.style.gap = '8px';
            
            // Font decrease button
            const fontDecreaseBtn = document.createElement('button');
            fontDecreaseBtn.className = 'hybridai-control-button hybridai-font-control';
            fontDecreaseBtn.innerHTML = 'a';
            fontDecreaseBtn.title = 'Decrease font size';
            fontDecreaseBtn.style.background = 'none';
            fontDecreaseBtn.style.border = 'none';
            fontDecreaseBtn.style.color = 'white';
            fontDecreaseBtn.style.cursor = 'pointer';
            fontDecreaseBtn.style.fontSize = '12px';
            fontDecreaseBtn.style.opacity = '0.8';
            fontDecreaseBtn.style.padding = '4px';
            fontDecreaseBtn.style.width = '24px';
            fontDecreaseBtn.style.height = '24px';
            fontDecreaseBtn.style.display = 'flex';
            fontDecreaseBtn.style.alignItems = 'center';
            fontDecreaseBtn.style.justifyContent = 'center';
            
            fontDecreaseBtn.addEventListener('click', () => {
                const snappedWidget = this.state.snappedOutWidgets[sourceIndex];
                if (snappedWidget && snappedWidget.iframe && snappedWidget.iframe.contentWindow) {
                    snappedWidget.iframe.contentWindow.postMessage({ type: 'change-font-size', delta: -1 }, '*');
                }
            });
            
            fontDecreaseBtn.addEventListener('mouseenter', () => {
                fontDecreaseBtn.style.opacity = '1';
            });
            
            fontDecreaseBtn.addEventListener('mouseleave', () => {
                fontDecreaseBtn.style.opacity = '0.8';
            });
            
            // Font increase button
            const fontIncreaseBtn = document.createElement('button');
            fontIncreaseBtn.className = 'hybridai-control-button hybridai-font-control';
            fontIncreaseBtn.innerHTML = 'A';
            fontIncreaseBtn.title = 'Increase font size';
            fontIncreaseBtn.style.background = 'none';
            fontIncreaseBtn.style.border = 'none';
            fontIncreaseBtn.style.color = 'white';
            fontIncreaseBtn.style.cursor = 'pointer';
            fontIncreaseBtn.style.fontSize = '14px';
            fontIncreaseBtn.style.fontWeight = 'bold';
            fontIncreaseBtn.style.opacity = '0.8';
            fontIncreaseBtn.style.padding = '4px';
            fontIncreaseBtn.style.width = '24px';
            fontIncreaseBtn.style.height = '24px';
            fontIncreaseBtn.style.display = 'flex';
            fontIncreaseBtn.style.alignItems = 'center';
            fontIncreaseBtn.style.justifyContent = 'center';
            fontIncreaseBtn.style.marginLeft = '-4px';
            
            fontIncreaseBtn.addEventListener('click', () => {
                const snappedWidget = this.state.snappedOutWidgets[sourceIndex];
                if (snappedWidget && snappedWidget.iframe && snappedWidget.iframe.contentWindow) {
                    snappedWidget.iframe.contentWindow.postMessage({ type: 'change-font-size', delta: 1 }, '*');
                }
            });
            
            fontIncreaseBtn.addEventListener('mouseenter', () => {
                fontIncreaseBtn.style.opacity = '1';
            });
            
            fontIncreaseBtn.addEventListener('mouseleave', () => {
                fontIncreaseBtn.style.opacity = '0.8';
            });
            
            // Audio toggle button
            const audioToggleBtn = document.createElement('button');
            audioToggleBtn.className = 'hybridai-control-button';
            const audioEnabled = localStorage.getItem('sound_enabled') === 'true';
            audioToggleBtn.innerHTML = audioEnabled ? '🔊' : '🔇';
            audioToggleBtn.title = audioEnabled ? 'Disable audio' : 'Enable audio';
            audioToggleBtn.style.background = 'none';
            audioToggleBtn.style.border = 'none';
            audioToggleBtn.style.color = 'white';
            audioToggleBtn.style.cursor = 'pointer';
            audioToggleBtn.style.fontSize = '16px';
            audioToggleBtn.style.opacity = '0.8';
            audioToggleBtn.style.padding = '4px';
            audioToggleBtn.style.width = '24px';
            audioToggleBtn.style.height = '24px';
            audioToggleBtn.style.display = 'flex';
            audioToggleBtn.style.alignItems = 'center';
            audioToggleBtn.style.justifyContent = 'center';
            
            audioToggleBtn.addEventListener('click', () => {
                const snappedWidget = this.state.snappedOutWidgets[sourceIndex];
                if (snappedWidget && snappedWidget.iframe && snappedWidget.iframe.contentWindow) {
                    snappedWidget.iframe.contentWindow.postMessage({ type: 'toggle-audio' }, '*');
                    setTimeout(() => {
                        const newAudioEnabled = localStorage.getItem('sound_enabled') === 'true';
                        audioToggleBtn.innerHTML = newAudioEnabled ? '🔊' : '🔇';
                        audioToggleBtn.title = newAudioEnabled ? 'Disable audio' : 'Enable audio';
                    }, 100);
                }
            });
            
            audioToggleBtn.addEventListener('mouseenter', () => {
                audioToggleBtn.style.opacity = '1';
            });
            
            audioToggleBtn.addEventListener('mouseleave', () => {
                audioToggleBtn.style.opacity = '0.8';
            });
            
            // Snap-in button
            const snapInButton = document.createElement('button');
            snapInButton.className = 'hybridai-control-button';
            snapInButton.innerHTML = '↙';
            snapInButton.title = 'Snap back to inline';
            snapInButton.style.background = 'none';
            snapInButton.style.border = 'none';
            snapInButton.style.color = 'white';
            snapInButton.style.cursor = 'pointer';
            snapInButton.style.fontSize = '16px';
            snapInButton.style.opacity = '0.8';
            snapInButton.style.padding = '4px';
            snapInButton.style.width = '24px';
            snapInButton.style.height = '24px';
            snapInButton.style.display = 'flex';
            snapInButton.style.alignItems = 'center';
            snapInButton.style.justifyContent = 'center';
            
            snapInButton.addEventListener('click', () => {
                this.snapInSnappedOutWidget(sourceIndex);
            });
            
            snapInButton.addEventListener('mouseenter', () => {
                snapInButton.style.opacity = '1';
            });
            
            snapInButton.addEventListener('mouseleave', () => {
                snapInButton.style.opacity = '0.8';
            });
            
            // Fullscreen button
            const fullscreenButton = document.createElement('button');
            fullscreenButton.className = 'hybridai-control-button';
            fullscreenButton.innerHTML = '⛶';
            fullscreenButton.title = 'Enter fullscreen mode';
            fullscreenButton.style.background = 'none';
            fullscreenButton.style.border = 'none';
            fullscreenButton.style.color = 'white';
            fullscreenButton.style.cursor = 'pointer';
            fullscreenButton.style.fontSize = '16px';
            fullscreenButton.style.opacity = '0.8';
            fullscreenButton.style.padding = '4px';
            fullscreenButton.style.width = '24px';
            fullscreenButton.style.height = '24px';
            fullscreenButton.style.display = 'flex';
            fullscreenButton.style.alignItems = 'center';
            fullscreenButton.style.justifyContent = 'center';
            
            fullscreenButton.addEventListener('click', () => {
                this.enterFullscreenMode(sourceIndex);
            });
            
            fullscreenButton.addEventListener('mouseenter', () => {
                fullscreenButton.style.opacity = '1';
            });
            
            fullscreenButton.addEventListener('mouseleave', () => {
                fullscreenButton.style.opacity = '0.8';
            });
            
            // 3-dot menu button for snapped-out widget
            const menuBtn = document.createElement('button');
            menuBtn.className = 'hybridai-control-button hybridai-menu-button';
            menuBtn.innerHTML = '⋮';
            menuBtn.title = 'Menu';
            menuBtn.style.background = 'none';
            menuBtn.style.border = 'none';
            menuBtn.style.color = 'white';
            menuBtn.style.cursor = 'pointer';
            menuBtn.style.fontSize = '16px';
            menuBtn.style.opacity = '0.8';
            menuBtn.style.padding = '4px';
            menuBtn.style.width = '24px';
            menuBtn.style.height = '24px';
            menuBtn.style.display = 'flex';
            menuBtn.style.alignItems = 'center';
            menuBtn.style.justifyContent = 'center';
            menuBtn.addEventListener('click', (e) => this.toggleSnappedOutMenu(e, menuBtn, sourceIndex));
            
            menuBtn.addEventListener('mouseenter', () => {
                menuBtn.style.opacity = '1';
            });
            
            menuBtn.addEventListener('mouseleave', () => {
                menuBtn.style.opacity = '0.8';
            });
            
            controls.appendChild(menuBtn);
            controls.appendChild(fontDecreaseBtn);
            controls.appendChild(fontIncreaseBtn);
            controls.appendChild(audioToggleBtn);
            controls.appendChild(fullscreenButton);
            controls.appendChild(snapInButton);
            // No close button for snapped-out widgets - only snap-in is allowed
            titleBar.appendChild(controls);
            
            return titleBar;
        },
        
        // Snap in snapped-out widget back to inline
        snapInSnappedOutWidget(sourceIndex) {
            const inlineWidget = this.state.inlineWidgets[sourceIndex];
            const snappedOutWidget = this.state.snappedOutWidgets?.[sourceIndex];
            
            if (!inlineWidget || !snappedOutWidget || !inlineWidget.isSnappedOut) return;
            
            console.log(`HybridAI Widget: Snapping in snapped-out widget to inline ${sourceIndex}`);
            
            // Get current state from snapped-out widget
            let currentMessages = [];
            let currentInput = '';
            let scrollPosition = 0;
            
            try {
                const snappedOutWindow = snappedOutWidget.iframe.contentWindow;
                if (snappedOutWindow && snappedOutWindow.getChatState) {
                    const state = snappedOutWindow.getChatState();
                    currentMessages = state.messages || [];
                    currentInput = state.inputValue || '';
                    scrollPosition = state.scrollPosition || 0;
                }
            } catch (e) {
                console.warn('Could not get chat state from snapped-out widget:', e);
            }
            
            // Don't clean up event listeners - keep them for reuse
            // Don't remove the widget - just hide it (like floating widget)
            snappedOutWidget.container.style.display = 'none';
            // Keep the reference in state for reuse
            // this.state.snappedOutWidgets[sourceIndex] = null; // REMOVED
            
            // Restore inline widget
            inlineWidget.isSnappedOut = false;
            inlineWidget.container.style.opacity = '1';
            inlineWidget.container.style.pointerEvents = 'auto';
            inlineWidget.snappedOutWidget = null;
            
            // Remove overlay
            if (inlineWidget.overlay) {
                inlineWidget.overlay.remove();
                inlineWidget.overlay = null;
            }
            
            // Transfer state back to the existing inline widget iframe
            // Since we didn't destroy it, we just need to update its state
            try {
                const inlineWindow = inlineWidget.iframe.contentWindow;
                if (inlineWindow && inlineWindow.setChatState) {
                    inlineWindow.setChatState({
                        messages: currentMessages,
                        inputValue: currentInput,
                        scrollPosition: scrollPosition,
                        snapSourceType: 'snapped-out'
                    });
                }
            } catch (e) {
                console.warn('Could not transfer state to inline widget:', e);
            }
        },
        
        // Close snapped-out widget (without restoring to inline)
        closeSnappedOutWidget(sourceIndex) {
            const snappedOutWidget = this.state.snappedOutWidgets?.[sourceIndex];
            if (!snappedOutWidget) return;
            
            // Clean up event listeners
            if (snappedOutWidget.container._cleanupDrag) {
                snappedOutWidget.container._cleanupDrag();
            }
            if (snappedOutWidget.container._cleanupMobileFullscreen) {
                snappedOutWidget.container._cleanupMobileFullscreen();
            }
            
            // Remove snapped-out widget
            snappedOutWidget.container.remove();
            this.state.snappedOutWidgets[sourceIndex] = null;
            
            // Just hide the inline widget overlay without restoring
            const inlineWidget = this.state.inlineWidgets[sourceIndex];
            if (inlineWidget && inlineWidget.overlay) {
                inlineWidget.overlay.remove();
                inlineWidget.overlay = null;
            }
            
            console.log(`HybridAI Widget: Closed snapped-out widget ${sourceIndex}`);
        },
        
        // Global function for overlay button
        snapInFromOverlay(sourceIndex) {
            this.snapInSnappedOutWidget(sourceIndex);
        },
        
        // Show debug information overlay
        showDebugInfo(widgetIndex = null) {
            // Remove existing debug overlay if any
            const existingOverlay = document.querySelector('.hybridai-debug-overlay');
            if (existingOverlay) {
                existingOverlay.remove();
                return; // Toggle off if already showing
            }
            
            // Get widget dimensions
            let widgetWidth = 'N/A';
            let widgetHeight = 'N/A';
            let widgetInfo = 'N/A';
            
            if (this.state.chatWindow) {
                const rect = this.state.chatWindow.getBoundingClientRect();
                widgetWidth = Math.round(rect.width) + 'px';
                widgetHeight = Math.round(rect.height) + 'px';
                widgetInfo = `${widgetWidth} × ${widgetHeight}`;
                
                // Check if we're at the problematic width
                if (rect.width >= 580 && rect.width <= 590) {
                    widgetInfo += ' ⚠️ (Problem Zone!)';
                }
            }
            
            const browserId = this.getOrCreateBrowserId();
            const debugInfo = {
                'Widget Version': this.WIDGET_VERSION,
                'Widget Resolution': widgetInfo,
                'Widget Width': widgetWidth,
                'Widget Height': widgetHeight,
                'Chatbot ID': this.config.chatbotId,
                'Browser ID (Full)': browserId,
                'Server': this.config.chatbotServer,
                'Mode': this.config.mode,
                'Widget Index': widgetIndex !== null ? widgetIndex : 'N/A',
                'Bot Title': this.config.bottitle,
                'Theme': this.config.theme,
                'Font Size': this.config.fontSize,
                'TTS Enabled': this.config.ttsEnabled,
                'Adult Content': this.config.adult_content ? 'Yes' : 'No',
                'File Upload': this.config.enableFileUpload ? 'Yes' : 'No',
                'Paid Messages': this.config.enablePaidMessages ? 'Yes' : 'No',
                'User Agent': navigator.userAgent.substring(0, 50) + '...',
                'Local Storage Items': Object.keys(localStorage).length,
                'Chat Credits': localStorage.getItem('chat_credits') || '0',
                'Sound Enabled': localStorage.getItem('sound_enabled') || 'false'
            };
            
            // Create overlay
            const overlay = document.createElement('div');
            overlay.className = 'hybridai-debug-overlay';
            overlay.style.position = 'fixed';
            overlay.style.top = '50%';
            overlay.style.left = '50%';
            overlay.style.transform = 'translate(-50%, -50%)';
            overlay.style.background = 'rgba(0, 0, 0, 0.95)';
            overlay.style.color = '#00ff00';
            overlay.style.padding = '20px';
            overlay.style.borderRadius = '8px';
            overlay.style.zIndex = '10002';
            overlay.style.fontFamily = 'monospace';
            overlay.style.fontSize = '12px';
            overlay.style.lineHeight = '1.4';
            overlay.style.maxWidth = '500px';
            overlay.style.maxHeight = '80vh';
            overlay.style.overflow = 'auto';
            overlay.style.border = '2px solid #00ff00';
            
            let content = '<div style="text-align: center; margin-bottom: 15px; color: #00ffff; font-weight: bold;">🔧 HybridAI Debug Info 🔧</div>';
            content += '<div style="margin-bottom: 10px; color: #ffff00;">Double-click logo again to close</div>';
            
            // Store debug info as formatted text for copying
            let debugText = 'HybridAI Debug Info\n' + '='.repeat(50) + '\n';
            
            for (const [key, value] of Object.entries(debugInfo)) {
                content += `<div><span style="color: #ff6600;">${key}:</span> <span style="color: #ffffff;">${value}</span></div>`;
                debugText += `${key}: ${value}\n`;
            }
            
            debugText += '='.repeat(50) + '\nTimestamp: ' + new Date().toISOString();
            
            // Add copy and close buttons
            content += `<div style="text-align: center; margin-top: 15px;">
                <button onclick="navigator.clipboard.writeText(\`${debugText.replace(/`/g, '\\`')}\`).then(() => { this.textContent = 'Copied! ✅'; setTimeout(() => this.textContent = 'Copy Debug Info 📋', 2000); })" style="background: #0099ff; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-family: monospace; margin-right: 10px;">Copy Debug Info 📋</button>
                <button onclick="this.parentElement.parentElement.remove()" style="background: #00ff00; color: black; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-family: monospace;">Close</button>
            </div>`;
            
            overlay.innerHTML = content;
            
            // Add click outside to close
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    overlay.remove();
                }
            });
            
            document.body.appendChild(overlay);
        },
        
        // Add snap-in button to floating widget
        addSnapInButton(sourceIndex) {
            if (!this.state.chatWindow) return;
            
            const titleBar = this.state.chatWindow.querySelector('.hybridai-title-bar');
            const controls = titleBar.querySelector('.hybridai-controls');
            
            // Remove existing snap-in button if any
            const existingSnapIn = controls.querySelector('.hybridai-snap-in-button');
            if (existingSnapIn) {
                existingSnapIn.remove();
            }
            
            // Create snap-in button
            const snapInButton = document.createElement('button');
            snapInButton.className = 'hybridai-control-button hybridai-snap-in-button';
            snapInButton.innerHTML = '↙';
            snapInButton.title = 'Snap back to inline';
            snapInButton.style.background = 'none';
            snapInButton.style.border = 'none';
            snapInButton.style.color = 'white';
            snapInButton.style.cursor = 'pointer';
            snapInButton.style.fontSize = '16px';
            snapInButton.style.opacity = '0.8';
            snapInButton.style.padding = '4px';
            snapInButton.style.width = '24px';
            snapInButton.style.height = '24px';
            snapInButton.style.display = 'flex';
            snapInButton.style.alignItems = 'center';
            snapInButton.style.justifyContent = 'center';
            
            snapInButton.addEventListener('click', () => {
                this.snapInFloatingWidget(sourceIndex);
            });
            
            snapInButton.addEventListener('mouseenter', () => {
                snapInButton.style.opacity = '1';
            });
            
            snapInButton.addEventListener('mouseleave', () => {
                snapInButton.style.opacity = '0.8';
            });
            
            // Insert snap-in button before the close button
            const firstButton = controls.querySelector('.hybridai-control-button');
            if (firstButton) {
                controls.insertBefore(snapInButton, firstButton);
            } else {
                controls.appendChild(snapInButton);
            }
        },
        
        // Setup dragging specifically for snapped-out widgets
        setupSnappedOutDragging(container, handle) {
            if (this.isMobile()) return;
            
            let isDragging = false;
            let startX, startY;
            let startLeft, startTop;
            
            const drag = (e) => {
                if (!isDragging) return;
                e.preventDefault();
                e.stopPropagation();
                
                let currentX, currentY;
                if (e.type === "touchmove") {
                    currentX = e.touches[0].clientX;
                    currentY = e.touches[0].clientY;
                } else {
                    currentX = e.clientX;
                    currentY = e.clientY;
                }
                
                const deltaX = currentX - startX;
                const deltaY = currentY - startY;
                const newLeft = Math.max(0, Math.min(window.innerWidth - container.offsetWidth, startLeft + deltaX));
                const newTop = Math.max(0, Math.min(window.innerHeight - container.offsetHeight, startTop + deltaY));
                
                container.style.left = newLeft + 'px';
                container.style.top = newTop + 'px';
                container.style.right = 'auto';
                container.style.bottom = 'auto';
            };
            
            const dragEnd = (e) => {
                if (!isDragging) return;
                isDragging = false;
                container.classList.remove('actively-dragging');
                container.style.transition = '';
                handle.style.cursor = 'move';
                document.body.style.userSelect = '';
                document.documentElement.style.cursor = '';
                
                document.removeEventListener('mousemove', drag);
                document.removeEventListener('mouseup', dragEnd);
                document.removeEventListener('touchmove', drag);
                document.removeEventListener('touchend', dragEnd);
                
                if (e) {
                    e.preventDefault();
                    e.stopPropagation();
                }
            };
            
            const dragStart = (e) => {
                // Don't start drag if clicking on controls, resize handles, or if already resizing
                if (e.target.closest('.hybridai-control-button') || 
                    e.target.closest('.hybridai-resize-handle') ||
                    container.classList.contains('actively-resizing')) {
                    return;
                }
                
                // Only start drag if clicking on the handle itself
                if (e.target === handle || handle.contains(e.target)) {
                    isDragging = true;
                    container.classList.add('actively-dragging');
                    
                    const rect = container.getBoundingClientRect();
                    startLeft = rect.left;
                    startTop = rect.top;
                    
                    if (e.type === "touchstart") {
                        startX = e.touches[0].clientX;
                        startY = e.touches[0].clientY;
                    } else {
                        startX = e.clientX;
                        startY = e.clientY;
                    }
                    
                    container.style.transition = 'none';
                    handle.style.cursor = 'grabbing';
                    document.body.style.userSelect = 'none';
                    
                    // Ensure proper positioning
                    container.style.bottom = '';
                    container.style.right = '';
                    container.style.transform = '';
                    
                    document.addEventListener('mousemove', drag);
                    document.addEventListener('mouseup', dragEnd);
                    document.addEventListener('touchmove', drag, { passive: false });
                    document.addEventListener('touchend', dragEnd);
                    
                    e.preventDefault();
                    e.stopPropagation();
                }
            };
            
            handle.addEventListener('mousedown', dragStart);
            handle.addEventListener('touchstart', dragStart, { passive: false });
            
            // Store cleanup function on container for later removal
            container._cleanupDrag = () => {
                handle.removeEventListener('mousedown', dragStart);
                handle.removeEventListener('touchstart', dragStart);
                document.removeEventListener('mousemove', drag);
                document.removeEventListener('mouseup', dragEnd);
                document.removeEventListener('touchmove', drag);
                document.removeEventListener('touchend', dragEnd);
            };
        },
        
        // Legacy snap-in functionality (now redirects to snapped-out widget handling)
        snapInFloatingWidget(targetIndex) {
            // This is now handled by the separate snapped-out widget system
            // If there's a snapped-out widget for this index, use that instead
            if (this.state.snappedOutWidgets?.[targetIndex]) {
                this.snapInSnappedOutWidget(targetIndex);
                return;
            }
            
            console.log(`HybridAI Widget: Legacy snap-in functionality called for index ${targetIndex}`);
        },
        
        // Create isolated styles
        createStyles() {
            const styleId = 'hybridai-widget-styles';
            if (document.getElementById(styleId)) return;
            
            // Debug logging for AI Assistant slogan styles
            if (this.config.debug || this.config.showAIAssistantSlogan) {
                console.log("HybridAI Widget: Creating styles with AI Assistant Slogan:", this.config.showAIAssistantSlogan);
            }
            
            const style = document.createElement('style');
            style.id = styleId;
            style.textContent = `
                /* HybridAI Widget Styles v2.0 */
                ${this.config.showAIAssistantSlogan ? "@import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&display=swap');" : ''}
                
                .hybridai-widget * {
                    box-sizing: border-box;
                    margin: 0;
                    padding: 0;
                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
                }
                
                /* Chat button */
                .hybridai-chat-button {
                    position: fixed !important;
                    bottom: 20px !important;
                    right: 20px !important;
                    width: 60px !important;
                    height: 60px !important;
                    background: #f5f6f8 !important;
                    border: none !important;
                    border-radius: 50% !important;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2) !important;
                    cursor: pointer !important;
                    display: flex !important;
                    align-items: center !important;
                    justify-content: center !important;
                    z-index: ${this.config.zIndex} !important;
                    outline: none !important;
                    padding: 0 !important;
                    margin: 0 !important;
                    transition: width 0.5s ease, height 0.5s ease, transform 0.2s ease !important;
                }
                
                .hybridai-chat-button:hover:not(.hybridai-auto-shrink) {
                    transform: scale(1.05) !important;
                }
                
                /* Attention animation with colorful glow */
                .hybridai-chat-button.pulse {
                    animation: colorfulPulse 1.5s infinite !important;
                }
                
                @keyframes colorfulPulse {
                    0% {
                        transform: scale(1);
                        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                        background: #f5f6f8 !important;
                    }
                    25% {
                        transform: scale(1.08);
                        box-shadow: 0 0 20px rgba(255, 0, 150, 0.8), 0 4px 16px rgba(255, 0, 150, 0.4);
                        background: linear-gradient(45deg, #ff0096, #ff6b6b) !important;
                    }
                    50% {
                        transform: scale(1.12);
                        box-shadow: 0 0 25px rgba(0, 255, 255, 0.8), 0 4px 20px rgba(0, 255, 255, 0.5);
                        background: linear-gradient(45deg, #00ffff, #00ff96) !important;
                    }
                    75% {
                        transform: scale(1.08);
                        box-shadow: 0 0 20px rgba(255, 165, 0, 0.8), 0 4px 16px rgba(255, 165, 0, 0.4);
                        background: linear-gradient(45deg, #ffa500, #ffeb3b) !important;
                    }
                    100% {
                        transform: scale(1);
                        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                        background: #f5f6f8 !important;
                    }
                }

                /* Auto-shrink styles */
                .hybridai-chat-button.hybridai-auto-shrink {
                    width: 48px !important;
                    height: 48px !important;
                }

                .hybridai-chat-button.hybridai-auto-shrink img {
                    width: 32px !important;
                    height: 32px !important;
                }

                /* Simple pulse animation */
                @keyframes hybridai-button-pulse {
                    0% {
                        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                    }
                    50% {
                        box-shadow: 0 0 20px rgba(33, 150, 243, 0.6), 0 4px 16px rgba(33, 150, 243, 0.3);
                    }
                    100% {
                        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                    }
                }

                .hybridai-chat-button.pulse-simple {
                    animation: hybridai-button-pulse 2s ease-in-out infinite !important;
                }

                .hybridai-chat-button img {
                    width: 40px !important;
                    height: 40px !important;
                    transition: width 0.5s ease, height 0.5s ease !important;
                }

                /* Avatar button styles */
                .hybridai-avatar-container {
                    position: fixed !important;
                    bottom: 20px !important;
                    right: 20px !important;
                    display: flex !important;
                    flex-direction: column !important;
                    align-items: flex-end !important;
                    z-index: ${this.config.zIndex} !important;
                }

                .hybridai-avatar-button {
                    background: transparent !important;
                    border: none !important;
                    cursor: pointer !important;
                    padding: 0 !important;
                    margin: 0 !important;
                    display: block !important;
                    position: relative !important;
                    transition: transform 0.3s ease !important;
                }

                .hybridai-avatar-button:hover:not(.hybridai-avatar-auto-shrink) {
                    transform: scale(1.05) !important;
                }

                /* Subtle pulse animation for badge */
                @keyframes hybridai-subtle-pulse {
                    0%, 100% {
                        transform: translateX(-50%) scale(1);
                        opacity: 0.85;
                    }
                    50% {
                        transform: translateX(-50%) scale(1.02);
                        opacity: 1;
                    }
                }

                /* Avatar size variations */
                .hybridai-avatar-button.hybridai-avatar-corner .hybridai-avatar-image {
                    width: 60px !important;
                    height: 60px !important;
                }

                .hybridai-avatar-button.hybridai-avatar-small .hybridai-avatar-image {
                    width: 100px !important;
                    height: 100px !important;
                }

                .hybridai-avatar-button.hybridai-avatar-medium .hybridai-avatar-image {
                    width: 180px !important;
                    height: 180px !important;
                }

                .hybridai-avatar-button.hybridai-avatar-large .hybridai-avatar-image {
                    width: min(40vw, 400px) !important;
                    height: min(40vw, 400px) !important;
                }

                .hybridai-avatar-image {
                    border-radius: 50% !important;
                    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3) !important;
                    object-fit: cover !important;
                    transition: width 0.5s ease, height 0.5s ease !important;
                }

                /* Avatar auto-shrink for all sizes - even more aggressive shrinking */
                .hybridai-avatar-button.hybridai-avatar-corner.hybridai-avatar-auto-shrink .hybridai-avatar-image {
                    width: 35px !important;
                    height: 35px !important;
                }

                .hybridai-avatar-button.hybridai-avatar-small.hybridai-avatar-auto-shrink .hybridai-avatar-image {
                    width: 50px !important;
                    height: 50px !important;
                }

                .hybridai-avatar-button.hybridai-avatar-medium.hybridai-avatar-auto-shrink .hybridai-avatar-image {
                    width: 80px !important;
                    height: 80px !important;
                }

                .hybridai-avatar-button.hybridai-avatar-large.hybridai-avatar-auto-shrink .hybridai-avatar-image {
                    width: min(15vw, 150px) !important;
                    height: min(15vw, 150px) !important;
                }

                /* Shrink the chat badge when avatar shrinks */
                .hybridai-avatar-button.hybridai-avatar-auto-shrink .hybridai-chat-badge {
                    font-size: 9px !important;
                    padding: 3px 6px !important;
                    transition: all 0.5s ease !important;
                }

                /* Make invitation bubble narrower when avatar shrinks */
                .hybridai-avatar-container .hybridai-avatar-button.hybridai-avatar-auto-shrink + .hybridai-invitation-bubble {
                    max-width: 200px !important;
                    white-space: normal !important;
                    line-height: 1.4 !important;
                    transition: max-width 0.5s ease !important;
                }

                /* Avatar pulse animation */
                @keyframes hybridai-avatar-pulse {
                    0% {
                        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
                        transform: scale(1);
                    }
                    50% {
                        box-shadow: 0 0 30px rgba(33, 150, 243, 0.8), 0 0 60px rgba(33, 150, 243, 0.4);
                        transform: scale(1.03);
                    }
                    100% {
                        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
                        transform: scale(1);
                    }
                }

                .hybridai-avatar-button.hybridai-avatar-pulse .hybridai-avatar-image {
                    animation: hybridai-avatar-pulse 2s ease-in-out infinite !important;
                }

                /* Chat invitation bubble */
                .hybridai-invitation-bubble {
                    position: absolute !important;
                    bottom: 100% !important;
                    right: 0 !important;
                    background: white !important;
                    color: #333 !important;
                    padding: 10px 15px !important;
                    border-radius: 15px !important;
                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1) !important;
                    margin-bottom: 10px !important;
                    white-space: nowrap !important;
                    font-size: 14px !important;
                    opacity: 0 !important;
                    transform: translateY(10px) !important;
                    transition: all 0.3s ease, max-width 0.5s ease !important;
                    pointer-events: none !important;
                }

                .hybridai-invitation-bubble.show {
                    opacity: 1 !important;
                    transform: translateY(0) !important;
                }

                .hybridai-invitation-bubble::after {
                    content: '' !important;
                    position: absolute !important;
                    bottom: -8px !important;
                    right: 20px !important;
                    width: 0 !important;
                    height: 0 !important;
                    border-left: 8px solid transparent !important;
                    border-right: 8px solid transparent !important;
                    border-top: 8px solid white !important;
                }

                /* Chat window container */
                .hybridai-chat-window {
                    position: fixed !important;
                    width: ${this.config.width};
                    height: ${this.config.height};
                    background-color: ${this.config.theme === 'dark' ? '#1e1e1e' : '#fff'} !important;
                    border-radius: ${this.config.borderRadius} !important;
                    box-shadow: ${this.config.boxShadow} !important;
                    z-index: ${this.config.zIndex} !important;
                    display: none;
                    opacity: 0;
                    overflow: hidden;
                    min-width: 350px !important;
                    min-height: 400px !important;
                    ${this.config.width === '100vw' && this.config.height === '100vh' ? 
                        'max-width: 100vw !important; max-height: 100vh !important;' : 
                        'max-width: 90vw !important; max-height: calc(100vh - 100px) !important;'}
                }
                
                .hybridai-chat-window.visible {
                    opacity: ${this.config.opacity} !important;
                }
                
                ${this.config.showAIAssistantSlogan ? `
                /* AI Assistant Slogan Styles */
                /* Allow overflow for the slogan elements */
                .hybridai-chat-window, .hybridai-inline-widget {
                    overflow: visible !important;
                }
                
                .hybridai-chat-window::before,
                .hybridai-inline-widget::before {
                    content: '✨';
                    position: absolute;
                    top: -25px;
                    left: 20px;
                    font-size: 20px;
                    animation: sparkleRotate 4s linear infinite;
                    z-index: 10000;
                    pointer-events: none;
                }
                
                .hybridai-chat-window::after,
                .hybridai-inline-widget::after {
                    content: 'AI ASSISTANT';
                    position: absolute;
                    top: -25px;
                    left: 50px;
                    font-family: 'Space Mono', monospace;
                    font-size: 11px;
                    font-weight: 700;
                    letter-spacing: 3px;
                    background: linear-gradient(90deg, #b967ff, #01bfbd);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    opacity: 0.8;
                    z-index: 10000;
                    pointer-events: none;
                }
                
                @keyframes sparkleRotate {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                ` : ''}
                
                /* Title bar */
                .hybridai-title-bar {
                    background-color: ${this.config.color_scheme} !important;
                    color: white !important;
                    padding: 0 10px !important;
                    height: 40px !important;
                    display: flex !important;
                    justify-content: space-between !important;
                    align-items: center !important;
                    cursor: move !important;
                    user-select: none !important;
                    -webkit-user-select: none !important;
                    -moz-user-select: none !important;
                    -ms-user-select: none !important;
                    border-top-left-radius: ${this.config.borderRadius} !important;
                    border-top-right-radius: ${this.config.borderRadius} !important;
                }
                
                .hybridai-title-content {
                    display: flex !important;
                    align-items: center !important;
                    gap: 8px !important;
                }
                
                .hybridai-title-logo {
                    height: 20px !important;
                    width: auto !important;
                }
                
                .hybridai-title-text {
                    font-weight: bold !important;
                    font-size: 14px !important;
                    color: white !important;
                    max-width: 15ch !important;
                    overflow: hidden !important;
                    text-overflow: ellipsis !important;
                    white-space: nowrap !important;
                    display: inline-block !important;
                }
                
                .hybridai-info-icon {
                    cursor: pointer !important;
                    width: 16px !important;
                    height: 16px !important;
                    border: 1px solid white !important;
                    border-radius: 50% !important;
                    display: inline-flex !important;
                    align-items: center !important;
                    justify-content: center !important;
                    font-size: 10px !important;
                    font-weight: 600 !important;
                    opacity: 0.8 !important;
                    position: relative !important;
                    flex-shrink: 0 !important;
                    font-style: normal !important;
                    line-height: 1 !important;
                    vertical-align: middle !important;
                }
                
                .hybridai-info-icon:hover {
                    opacity: 1 !important;
                    background-color: rgba(255, 255, 255, 0.1) !important;
                }
                
                .hybridai-tooltip {
                    display: none;
                    position: absolute !important;
                    top: 100% !important;
                    left: 0 !important;
                    margin-top: 8px !important;
                    margin-left: 10px !important;
                    width: 200px !important;
                    max-width: calc(100vw - 40px) !important;
                    background: rgba(0, 0, 0, 0.9) !important;
                    color: white !important;
                    padding: 10px !important;
                    border-radius: 4px !important;
                    font-size: 12px !important;
                    z-index: 10001 !important;
                    white-space: pre-wrap !important;
                    word-wrap: break-word !important;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2) !important;
                }
                
                /* Window controls */
                .hybridai-controls {
                    display: flex !important;
                    align-items: center !important;
                    gap: 8px !important;
                }
                
                .hybridai-control-button {
                    background: none !important;
                    border: none !important;
                    color: white !important;
                    cursor: pointer !important;
                    font-size: 16px !important;
                    opacity: 0.8 !important;
                    transition: opacity 0.2s !important;
                    padding: 4px !important;
                    width: 24px !important;
                    height: 24px !important;
                    display: flex !important;
                    align-items: center !important;
                    justify-content: center !important;
                    line-height: 1 !important;
                }
                
                .hybridai-control-button:hover {
                    opacity: 1 !important;
                }
                
                /* Font control buttons */
                .hybridai-font-control {
                    font-family: Arial, sans-serif !important;
                }
                
                .hybridai-font-control + .hybridai-font-control {
                    margin-left: -4px !important;
                }
                    font-weight: bold !important;
                    font-size: 14px !important;
                    width: 28px !important;
                }
                
                .hybridai-font-control:first-of-type {
                    margin-right: 2px !important;
                }
                
                /* Chat iframe */
                .hybridai-chat-iframe {
                    width: 100% !important;
                    height: calc(100% - 40px) !important;
                    border: none !important;
                    background: transparent !important;
                    border-bottom-left-radius: ${this.config.borderRadius} !important;
                    border-bottom-right-radius: ${this.config.borderRadius} !important;
                    overflow: hidden !important;
                }
                
                /* Custom resize handles - match native textarea grip lines */
                .hybridai-resize-handle {
                    position: absolute !important;
                    width: 16px !important;
                    height: 16px !important;
                    z-index: 10 !important;
                    background: transparent !important;
                    background-image: repeating-linear-gradient(135deg, transparent, transparent 6px, rgba(0,0,0,0.15) 6px, rgba(0,0,0,0.15) 8px);
                    background-size: 16px 16px !important;
                }
                
                .hybridai-resize-handle.bottom-right {
                    bottom: 0 !important;
                    right: 0 !important;
                    cursor: nwse-resize !important;
                    background-position: bottom right !important;
                    border-bottom-right-radius: 3px !important;
                }
                
                .hybridai-resize-handle.top-left {
                    top: 0 !important;
                    left: 0 !important;
                    cursor: nwse-resize !important;
                    background-position: top left !important;
                    border-top-left-radius: 3px !important;
                    background-image: repeating-linear-gradient(-45deg, transparent, transparent 6px, rgba(0,0,0,0.15) 6px, rgba(0,0,0,0.15) 8px);
                }
                
                /* Payment overlay */
                .hybridai-payment-overlay {
                    position: fixed !important;
                    top: 50% !important;
                    left: 50% !important;
                    transform: translate(-50%, -50%) !important;
                    background: white !important;
                    padding: 20px !important;
                    border-radius: 10px !important;
                    text-align: center !important;
                    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3) !important;
                    z-index: 2147483647 !important;
                    width: 300px !important;
                    max-width: 90% !important;
                }
                
                .hybridai-blur-overlay {
                    position: fixed !important;
                    top: 0 !important;
                    left: 0 !important;
                    width: 100% !important;
                    height: 100% !important;
                    backdrop-filter: blur(10px) !important;
                    -webkit-backdrop-filter: blur(10px) !important;
                    background: rgba(0, 0, 0, 0.5) !important;
                    z-index: 2147483646 !important;
                }
                
                /* Canvas modal */
                .hybridai-canvas-modal {
                    position: fixed !important;
                    top: 50% !important;
                    left: 50% !important;
                    transform: translate(-50%, -50%) !important;
                    width: 80% !important;
                    height: 80% !important;
                    background: white !important;
                    border: 2px solid #333 !important;
                    border-radius: 8px !important;
                    padding: 20px !important;
                    overflow: auto !important;
                    z-index: 10000 !important;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3) !important;
                }
                
                .hybridai-canvas-close {
                    position: absolute !important;
                    top: 10px !important;
                    right: 10px !important;
                    padding: 5px 15px !important;
                    background: #f44336 !important;
                    color: white !important;
                    border: none !important;
                    border-radius: 4px !important;
                    cursor: pointer !important;
                }
                
                
                /* Mobile responsive - Force fullscreen - only for actual mobile devices */
                @media (max-device-width: 768px) {
                    .hybridai-chat-window {
                        position: fixed !important;
                        top: 0 !important;
                        right: 0 !important;
                        bottom: 0 !important;
                        left: 0 !important;
                        width: 100vw !important;
                        height: 100vh !important;
                        height: calc(var(--vh, 1vh) * 100) !important;
                        margin: 0 !important;
                        border-radius: 0 !important;
                        max-width: none !important;
                        max-height: none !important;
                        min-width: auto !important;
                        min-height: auto !important;
                        max-width: 100% !important;
                        max-height: 100% !important;
                        min-width: unset !important;
                        min-height: unset !important;
                        font-size: 16px !important;
                        zoom: 1 !important;
                        transform: none !important;
                    }
                    
                    .hybridai-title-bar {
                        cursor: default !important;
                    }
                    
                    .hybridai-resize-handle {
                        display: none !important;
                    }
                }
            `;
            
            document.head.appendChild(style);
        },
        
        // Check if privacy notice should be shown
        shouldShowPrivacyNotice() {
            // Only show if privacy notice text is configured
            if (!this.config.privacyNoticeText || this.config.privacyNoticeText.trim() === '') {
                return false;
            }

            // Check if user has already accepted privacy notice for this bot
            const acceptedKey = `hybridai_privacy_accepted_${this.config.chatbotId}`;
            return localStorage.getItem(acceptedKey) !== 'true';
        },

        // Browser tracking utilities
        getOrCreateBrowserId() {
            let browserId = localStorage.getItem("browserId");
            if (!browserId) {
                try {
                    browserId = crypto.randomUUID();
                } catch (e) {
                    // Fallback for older browsers
                    browserId = 'xxxx-xxxx-4xxx-yxxx-xxxx'.replace(/[xy]/g, function(c) {
                        const r = Math.random() * 16 | 0;
                        const v = c === 'x' ? r : (r & 0x3 | 0x8);
                        return v.toString(16);
                    });
                }
                localStorage.setItem("browserId", browserId);
            }
            return browserId;
        },
        
        initializeBrowserTracking() {
            const browserId = this.getOrCreateBrowserId();
            
            // Initialize credits if needed
            if (!localStorage.getItem("chat_credits")) {
                localStorage.setItem("chat_credits", "30");
            }
            
            // Restore privacy mode from localStorage if set
            const savedPrivacyMode = localStorage.getItem('hybridai_privacy_mode');
            if (savedPrivacyMode && ['normal', 'no-tracking', 'private'].includes(savedPrivacyMode)) {
                this.state.currentPrivacyMode = savedPrivacyMode;
                this.config.privacyMode = savedPrivacyMode;
                console.log(`HybridAI Widget: Restored ${savedPrivacyMode} mode from previous session`);
            } else {
                // Initialize with default from config
                this.state.currentPrivacyMode = this.config.privacyMode || 'normal';
            }
            
            // Apply bot-level privacy defaults (override saved settings if bot enforces it)
            if (this.config.trackingDisabled) {
                this.state.currentPrivacyMode = 'no-tracking';
                this.config.privacyMode = 'no-tracking';
                console.log('HybridAI Widget: No-tracking mode enabled by bot configuration');
            }
            
            // Check privacy mode before tracking
            if (this.state.currentPrivacyMode === 'private' || 
                this.state.currentPrivacyMode === 'no-tracking') {
                console.log(`HybridAI Widget: Browser tracking disabled due to ${this.state.currentPrivacyMode} mode`);
                return;
            }
            
            // Track browser session (only in normal mode)
            this.trackBrowserSession(browserId);
        },
        
        trackBrowserSession(browserId) {
            const real_ip = "37.66.27.8";
            fetch(`${this.config.chatbotServer}/api/track_browser`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    browserId: browserId,
                    chatbotId: this.config.chatbotId,
                    WP_flag: this.config.serverFromWP || false,
                    realIP: real_ip,
                    userAgent: navigator.userAgent,
                    source: "standalone",
                    baseURL: window.location.origin,
                    privacyMode: this.state.currentPrivacyMode // Include privacy mode
                })
            })
            .then(response => response.json())
            .then(data => console.log("HybridAI Widget: Browser session tracked", data))
            .catch(error => console.error("HybridAI Widget: Error tracking browser", error));
        },

        // Centralized mobile fullscreen handling with cleanup
        setupMobileFullscreen(container) {
            if (!this.isMobile()) return () => {}; // Return a no-op cleanup function for non-mobile

            // No resize on mobile - force fullscreen
            const resizeHandles = container.querySelectorAll('.hybridai-resize-handle');
            resizeHandles.forEach(handle => handle.style.display = 'none');

            // Ensure proper viewport meta tag for mobile
            let viewportMeta = document.querySelector('meta[name="viewport"]');
            if (!viewportMeta) {
                viewportMeta = document.createElement('meta');
                viewportMeta.name = 'viewport';
                document.head.appendChild(viewportMeta);
            }
            viewportMeta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover';

            // Check if container already has listeners set up
            if (container._mobileListenersSetup) {
                console.log('HybridAI Widget: Mobile fullscreen listeners already set up for this container');
                return container._cleanupMobileFullscreen || (() => {});
            }

            // Mark container as having listeners
            container._mobileListenersSetup = true;

            // Add orientation and resize handlers to maintain fullscreen
            const maintainFullscreen = () => {
                // Only resize if container is visible
                if (this.isMobile() && container.style.display !== 'none') {
                    container.style.width = '100vw';
                    // Use actual viewport height instead of 100vh
                    container.style.height = window.innerHeight + 'px';
                    container.style.left = '0';
                    container.style.top = '0';
                    container.style.position = 'fixed';
                }
            };
            
            const orientationChangeHandler = () => {
                // Only resize if container is visible
                if (container.style.display !== 'none') {
                    setTimeout(maintainFullscreen, 100);
                }
            };

            window.addEventListener('resize', maintainFullscreen);
            window.addEventListener('orientationchange', orientationChangeHandler);

            // Return a cleanup function
            const cleanup = () => {
                window.removeEventListener('resize', maintainFullscreen);
                window.removeEventListener('orientationchange', orientationChangeHandler);
                container._mobileListenersSetup = false;
                console.log('HybridAI Widget: Cleaned up mobile fullscreen listeners.');
            };
            
            return cleanup;
        },
        
        // Create chat button
        createChatButton() {
            if (this.state.chatButton) return;

            // Check if avatar is configured
            if (this.config.avatarpictureurl) {
                this.createAvatarButton();
            } else {
                this.createStandardButton();
            }
        },

        // Create standard chat button (original implementation)
        createStandardButton() {
            console.log('HybridAI: Creating standard chat button');
            const button = document.createElement('button');
            button.className = 'hybridai-chat-button';
            button.setAttribute('aria-label', 'Open chat');

            // Create picture element for WebP support
            const picture = document.createElement('picture');
            const source = document.createElement('source');
            source.srcset = this.config.chatbotServer + '/static/chat_64.webp';
            source.type = 'image/webp';

            const img = document.createElement('img');
            img.src = this.config.chatbotServer + '/static/chat_64.png';
            img.alt = 'Chat';

            picture.appendChild(source);
            picture.appendChild(img);
            button.appendChild(picture);
            button.addEventListener('click', () => {
                // Stop animations when user clicks
                button.classList.remove('pulse-simple');
                button.classList.remove('hybridai-auto-shrink');
                // Don't change localStorage - keep the shrink state for when chat closes
                this.toggleChat();
            });

            document.body.appendChild(button);
            this.state.chatButton = button;

            // Check if widget was previously shrunk by user
            const wasShrunk = localStorage.getItem('hybridai_widget_shrunk') === 'true';

            if (wasShrunk) {
                // Immediately apply shrunk state if user prefers it
                console.log('HybridAI: Applying saved shrink preference');
                button.classList.add('hybridai-auto-shrink');
            } else {
                // Auto-shrink the button after 5 seconds for less intrusion (first time only)
                this.autoShrinkTimer = setTimeout(() => {
                    if (button && !this.state.chatWindow) {
                        console.log('HybridAI: Adding auto-shrink class');
                        button.classList.add('hybridai-auto-shrink');
                        // Save the shrink state
                        localStorage.setItem('hybridai_widget_shrunk', 'true');
                    }
                }, 5000);
            }

            // Start pulse animation after 10 seconds
            setTimeout(() => {
                if (button && !this.state.chatWindow) {
                    console.log('HybridAI: Adding pulse-simple class');
                    button.classList.add('pulse-simple');
                }
            }, 10000);
        },

        // Create avatar-based chat button
        createAvatarButton() {
            console.log('HybridAI: Creating avatar button with size:', this.config.avatar_size);
            console.log('HybridAI: Avatar URL:', this.config.avatarpictureurl);
            console.log('HybridAI: Chatbot Server:', this.config.chatbotServer);
            const container = document.createElement('div');
            container.className = 'hybridai-avatar-container';

            // Create avatar button
            const button = document.createElement('button');
            button.className = 'hybridai-avatar-button hybridai-avatar-' + this.config.avatar_size;
            button.setAttribute('aria-label', 'Open chat');

            // Create avatar image
            const img = document.createElement('img');

            // Check if avatar URL exists and is not empty
            if (!this.config.avatarpictureurl || this.config.avatarpictureurl === '') {
                console.error('HybridAI: Avatar URL is empty or undefined');
                // Fallback to a default avatar or return early
                return this.createStandardButton();
            }

            const avatarUrl = this.config.avatarpictureurl.startsWith('http') ?
                this.config.avatarpictureurl :
                this.config.chatbotServer + '/' + this.config.avatarpictureurl.replace(/^\//, '');

            console.log('HybridAI: Final avatar URL:', avatarUrl);
            img.src = avatarUrl;
            img.alt = 'Chat with me';
            img.className = 'hybridai-avatar-image';

            // Add error handler for image loading
            img.onerror = () => {
                console.error('HybridAI: Failed to load avatar image:', avatarUrl);
                // Fallback to standard button on error
                this.createStandardButton();
                container.remove();
            };

            button.appendChild(img);

            // Create subtle "Click to Chat" badge
            const chatBadge = document.createElement('div');
            chatBadge.className = 'hybridai-chat-badge';

            // Adjust badge size based on avatar size
            const isSmallAvatar = this.config.avatar_size === 'corner' || this.config.avatar_size === 'small';
            const fontSize = isSmallAvatar ? '10px' : '11px';
            const padding = isSmallAvatar ? '4px 8px' : '5px 10px';

            chatBadge.innerHTML = '<span style="opacity: 0.8;">💬</span> <span>Chat</span>';
            chatBadge.style.cssText = `
                position: absolute;
                bottom: ${isSmallAvatar ? '10%' : '15%'};
                left: 50%;
                transform: translateX(-50%);
                background: rgba(255, 255, 255, 0.92);
                color: ${this.config.color_scheme || '#2196F3'};
                padding: ${padding};
                border-radius: 15px;
                font-size: ${fontSize};
                font-weight: 600;
                white-space: nowrap;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
                pointer-events: none;
                z-index: 2;
                animation: hybridai-subtle-pulse 3s ease-in-out infinite;
                backdrop-filter: blur(10px);
                border: 1px solid rgba(255, 255, 255, 0.3);
                transition: all 0.5s ease;
            `;
            button.appendChild(chatBadge);

            // Create chat bubble with invitation message
            const bubble = document.createElement('div');
            bubble.className = 'hybridai-invitation-bubble';
            bubble.textContent = this.config.invitation_message;

            container.appendChild(button);
            container.appendChild(bubble);

            button.addEventListener('click', () => {
                // Hide bubble when clicked
                bubble.style.display = 'none';
                // Remove animation classes when clicked
                button.classList.remove('hybridai-avatar-auto-shrink');
                button.classList.remove('hybridai-avatar-pulse');
                // Don't change localStorage - keep the shrink state for when chat closes
                this.toggleChat();
            });

            document.body.appendChild(container);
            this.state.chatButton = container;

            // Check if widget was previously shrunk by user
            const wasShrunk = localStorage.getItem('hybridai_widget_shrunk') === 'true';

            if (wasShrunk) {
                // Immediately apply shrunk state if user prefers it
                console.log('HybridAI: Applying saved shrink preference to avatar');
                button.classList.add('hybridai-avatar-auto-shrink');
            } else {
                // Auto-shrink avatar button after 5 seconds for all sizes (first time only)
                this.autoShrinkTimer = setTimeout(() => {
                    if (button && !this.state.chatWindow) {
                        console.log('HybridAI: Adding auto-shrink to avatar button');
                        button.classList.add('hybridai-avatar-auto-shrink');
                        // Save the shrink state
                        localStorage.setItem('hybridai_widget_shrunk', 'true');
                    }
                }, 5000);
            }

            // Add subtle pulse animation after 10 seconds
            setTimeout(() => {
                if (button && !this.state.chatWindow) {
                    console.log('HybridAI: Adding pulse to avatar button');
                    button.classList.add('hybridai-avatar-pulse');
                }
            }, 10000);

            // Show bubble after 3 seconds
            setTimeout(() => {
                if (bubble && !this.state.chatWindow) {
                    bubble.classList.add('show');

                    // Hide bubble after 10 seconds
                    setTimeout(() => {
                        bubble.classList.remove('show');
                    }, 10000);
                }
            }, 3000);
        },
        
        // Create chat window
        createChatWindow() {
            if (this.state.chatWindow) return;
            
            const container = document.createElement('div');
            container.className = 'hybridai-widget hybridai-chat-window';
            
            // Set position
            this.setWindowPosition(container);
            
            // Create title bar
            const titleBar = this.createTitleBar();
            container.appendChild(titleBar);
            
            // Create iframe
            const iframe = document.createElement('iframe');
            iframe.className = 'hybridai-chat-iframe';
            iframe.setAttribute('allowtransparency', 'true');
            iframe.style.background = 'transparent';
            
            // Set iframe content
            iframe.srcdoc = this.generateIframeContent();
            
            // Add load listener
            iframe.addEventListener('load', () => {
                this.onIframeLoad(iframe);
                // Apply theme-specific effects
                this.applyThemeEffects(iframe);
            });
            
            container.appendChild(iframe);
            
            // Setup dragging
            this.setupDragging(container, titleBar);
            
            // AI Assistant slogan is now handled via CSS pseudo-elements
            // No DOM elements need to be created
            
            // Add to DOM first
            document.body.appendChild(container);
            this.state.chatWindow = container;
            
            // Always add custom resize handles for consistent appearance
            const resizeHandleBottomRight = document.createElement('div');
            resizeHandleBottomRight.className = 'hybridai-resize-handle bottom-right';
            container.appendChild(resizeHandleBottomRight);
            
            const resizeHandleTopLeft = document.createElement('div');
            resizeHandleTopLeft.className = 'hybridai-resize-handle top-left';
            container.appendChild(resizeHandleTopLeft);
            
            // Set initial size - force fullscreen on mobile
            if (this.isMobile()) {
                container.style.width = '100vw';
                // Use window.innerHeight for accurate viewport height on mobile
                container.style.height = window.innerHeight + 'px';
                container.style.left = '0';
                container.style.top = '0';
                container.style.position = 'fixed';
            } else {
                container.style.width = this.config.width;
                container.style.height = this.config.height;
            }
            
            // Setup resize or mobile fullscreen functionality
            if (this.isMobile()) {
                // Only set up mobile fullscreen if not already done
                if (!container._cleanupMobileFullscreen) {
                    container._cleanupMobileFullscreen = this.setupMobileFullscreen(container);
                }
            } else {
                this.setupManualResize(container, resizeHandleBottomRight, 'bottom-right');
                this.setupManualResize(container, resizeHandleTopLeft, 'top-left');
            }
        },
        
        // Create title bar
        createTitleBar() {
            const titleBar = document.createElement('div');
            titleBar.className = 'hybridai-title-bar';
            
            // Title content
            const titleContent = document.createElement('div');
            titleContent.className = 'hybridai-title-content';
            
            // Logo
            const logo = document.createElement('img');
            logo.className = 'hybridai-title-logo';
            logo.src = (this.config.botlogourl && this.config.botlogourl !== 'None') ? this.config.botlogourl : this.DEFAULT_LOGO_PATH;
            logo.onerror = () => {
                logo.src = this.config.chatbotServer + '/static/hai_logo_free_small.png';
            };
            
            // Add debug info on double-click
            logo.addEventListener('dblclick', () => {
                this.showDebugInfo('floating');
            });
            
            // Title text
            const titleText = document.createElement('span');
            titleText.className = 'hybridai-title-text';
            titleText.textContent = this.config.bottitle;
            
            // Info icon with tooltip
            const infoContainer = document.createElement('div');
            infoContainer.style.position = 'relative';
            infoContainer.style.display = 'inline-flex';
            infoContainer.style.alignItems = 'center';
            
            const infoIcon = document.createElement('span');
            infoIcon.className = 'hybridai-info-icon';
            infoIcon.textContent = 'i';
            infoIcon.title = 'Bot Information';
            
            const tooltip = document.createElement('div');
            tooltip.className = 'hybridai-tooltip';
            tooltip.textContent = this.config.bot_description;
            
            infoIcon.addEventListener('mouseenter', () => {
                tooltip.style.display = 'block';
            });
            
            infoIcon.addEventListener('mouseleave', () => {
                tooltip.style.display = 'none';
            });
            
            infoContainer.appendChild(infoIcon);
            infoContainer.appendChild(tooltip);
            
            titleContent.appendChild(logo);
            titleContent.appendChild(titleText);
            titleContent.appendChild(infoContainer);
            
            // Controls
            const controls = document.createElement('div');
            controls.className = 'hybridai-controls';
            
            // Font size controls
            const fontSizeDecrease = document.createElement('button');
            fontSizeDecrease.className = 'hybridai-control-button hybridai-font-control';
            fontSizeDecrease.innerHTML = 'a';
            fontSizeDecrease.title = 'Decrease Font Size';
            fontSizeDecrease.addEventListener('click', () => this.changeFontSize(-1));
            
            const fontSizeIncrease = document.createElement('button');
            fontSizeIncrease.className = 'hybridai-control-button hybridai-font-control';
            fontSizeIncrease.innerHTML = 'A';
            fontSizeIncrease.title = 'Increase Font Size';
            fontSizeIncrease.addEventListener('click', () => this.changeFontSize(1));
            
            // Audio toggle
            const audioToggle = document.createElement('button');
            audioToggle.className = 'hybridai-control-button';
            audioToggle.innerHTML = localStorage.getItem("sound_enabled") === "true" ? '🔊' : '🔇';
            audioToggle.title = 'Toggle Audio';
            audioToggle.addEventListener('click', () => this.toggleAudio(audioToggle));
            

            // 3-dot menu button
            const menuBtn = document.createElement('button');
            menuBtn.className = 'hybridai-control-button hybridai-menu-button';
            menuBtn.innerHTML = '⋮';
            menuBtn.title = 'Menu';
            menuBtn.addEventListener('click', (e) => this.toggleMenu(e, menuBtn));
            
            // Close button
            const closeBtn = document.createElement('button');
            closeBtn.className = 'hybridai-control-button';
            closeBtn.innerHTML = '✕';
            closeBtn.title = 'Close';
            closeBtn.addEventListener('click', () => this.hideChat());
            
            controls.appendChild(fontSizeDecrease);
            controls.appendChild(fontSizeIncrease);
            controls.appendChild(audioToggle);
            controls.appendChild(menuBtn);
            controls.appendChild(closeBtn);
            
            titleBar.appendChild(titleContent);
            titleBar.appendChild(controls);
            
            return titleBar;
        },
        
        // Get theme message styles
        getThemeMessageStyles() {
            // Load theme styles if theme system is available
            if (typeof getWidgetThemeStyles !== 'undefined') {
                const styles = getWidgetThemeStyles(this.config.theme);
                return styles.messageCSS || '';
            }
            // Built-in fallback styles for selected themes when theme library isn't loaded
            const builtIn = this.getBuiltInThemeStyles(this.config.theme);
            return builtIn.messageCSS || '';
        },

        // Minimal built-in theme styles for when widget-themes.js is not present
        getBuiltInThemeStyles(theme) {
            if (theme === 'persian') {
                return {
                    // Applied inside the iframe to style chat messages
                    messageCSS: `
                        /* Persian Wedding (integrated, subtle) */
                        @keyframes persian-breath {
                            0%, 100% { box-shadow: 0 0 0 rgba(255, 215, 0, 0.0); }
                            50% { box-shadow: 0 0 18px rgba(255, 215, 0, 0.25); }
                        }
                        .bot-message {
                            background: linear-gradient(135deg, #FFF8E7 0%, #FFF3D6 100%) !important;
                            border: 1px solid rgba(255, 215, 0, 0.5) !important;
                            border-radius: 14px !important;
                            box-shadow: 0 4px 14px rgba(139, 0, 139, 0.06) !important;
                            position: relative !important;
                            animation: persian-breath 3.2s ease-in-out infinite;
                        }
                        .user-message {
                            background: linear-gradient(135deg, #FFE6F4 0%, #FFF0F8 100%) !important;
                            border: 1px solid rgba(255, 105, 180, 0.35) !important;
                            border-radius: 14px !important;
                            box-shadow: 0 3px 10px rgba(255, 105, 180, 0.10) !important;
                        }
                        .bot-message a { color: #8B008B !important; }
                        .bot-message code { background: rgba(255, 215, 0, 0.15) !important; }
                    `,
                    // Applied in the parent document to decorate the container/title
                    containerCSS: `
                        @keyframes persian-title-glow {
                            0%, 100% { text-shadow: 0 0 12px rgba(255, 215, 0, 0.6), 0 0 24px rgba(255, 20, 147, 0.35); }
                            50% { text-shadow: 0 0 18px rgba(255, 215, 0, 0.9), 0 0 36px rgba(255, 20, 147, 0.5); }
                        }
                        .hybridai-title-bar {
                            background-image: linear-gradient(90deg, #FFD700, #FF69B4, #8B008B, #FFD700) !important;
                            color: #fff !important;
                            border-bottom: 3px solid transparent !important;
                            border-image: linear-gradient(90deg, #FFD700, #FF69B4, #8B008B, #FFD700) 1 !important;
                            letter-spacing: 1px !important;
                            animation: persian-title-glow 2.6s ease-in-out infinite;
                        }
                        .hybridai-chat-iframe {
                            border: 2px solid transparent !important;
                            border-image: linear-gradient(45deg, #FFD700, #FF69B4, #8B008B, #FFD700) 1 !important;
                            border-radius: 16px !important;
                        }
                        .hybridai-resize-handle {
                            background: radial-gradient(circle at center, #FFD700 0%, #FF69B4 60%, #8B008B 100%) !important;
                            border: 2px solid #FFD700 !important;
                        }
                    `
                };
            }
            return { messageCSS: '', containerCSS: '' };
        },

        // Apply theme effects after iframe loads
        applyThemeEffects(iframe) {
            if (!iframe || !iframe.contentDocument) return;

            // Apply theme effects if theme system is available
            if (typeof applyWidgetThemeEffects !== 'undefined') {
                applyWidgetThemeEffects(this.config.theme, iframe.contentDocument);
            }

            // Apply container styles to the parent window
            if (typeof getWidgetThemeStyles !== 'undefined') {
                const styles = getWidgetThemeStyles(this.config.theme);
                if (styles.containerCSS) {
                    let styleElement = document.getElementById('widget-theme-container-styles');
                    if (styleElement) {
                        styleElement.remove();
                    }
                    styleElement = document.createElement('style');
                    styleElement.id = 'widget-theme-container-styles';
                    styleElement.textContent = styles.containerCSS;
                    document.head.appendChild(styleElement);
                }
            } else {
                // Fallback: apply built-in container CSS for selected themes
                const builtIn = this.getBuiltInThemeStyles(this.config.theme);
                if (builtIn.containerCSS) {
                    let styleElement = document.getElementById('widget-theme-container-styles');
                    if (styleElement) {
                        styleElement.remove();
                    }
                    styleElement = document.createElement('style');
                    styleElement.id = 'widget-theme-container-styles';
                    styleElement.textContent = builtIn.containerCSS;
                    document.head.appendChild(styleElement);
                }
            }
        },

        // Generate iframe content
        generateIframeContent(isInlineMode = false, disableAutoFocus = false, forceDesktopMode = false, skipWelcomeMessage = false) {
            const browserId = this.getOrCreateBrowserId();

            // Check if privacy notice should be shown
            const shouldShowPrivacyNotice = this.shouldShowPrivacyNotice();

            const defaultMessages = [
                this.config.dm1,
                this.config.dm2,
                this.config.dm3
            ].filter(msg => msg && msg !== '' && msg.toLowerCase() !== 'none');
            
            return `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script>
        const browserId = "${browserId}";
        const chatbotServer = "${this.config.chatbotServer}";
        const chatbotId = ${JSON.stringify(this.config.chatbotId)};
        const apiKey = ${JSON.stringify(this.config.apiKey || '')};
        const enableFileUpload = ${this.config.enableFileUpload || false};
        const messageCostsEnabled = ${this.config.enablePaidMessages || false} ? 1 : 0;
        const defaultMessages = ${JSON.stringify(defaultMessages)};
        const enableMath = ${this.config.enableMath || false};
        const isInlineMode = ${isInlineMode};
        const disableAutoFocus = ${disableAutoFocus};
        const forceDesktopMode = ${forceDesktopMode};
        const skipWelcomeMessage = ${skipWelcomeMessage};
        const context = ${JSON.stringify(this.config.context || null)};
        // Pass the current privacy mode to the iframe
        window.currentPrivacyMode = "${this.state.currentPrivacyMode || 'normal'}";
        const privacyMode = window.currentPrivacyMode;
        // Pass the theme configuration
        const widgetTheme = "${this.config.theme || 'default'}";
    </script>
    <script>
      window.customWelcomeMessage = ${JSON.stringify(this.config.customWelcomeMessage || null)};
      window.templateWelcomeMessage = "say hi and give a hint what you are up for in the language of the user";
    </script>
    <link rel="preconnect" href="https://cdn.jsdelivr.net">
    <link rel="dns-prefetch" href="https://cdn.jsdelivr.net">
    <script src="https://cdn.jsdelivr.net/npm/markdown-it@14.1.0/dist/markdown-it.min.js" async></script>
    <!-- Load theme registry -->
    <script src="${this.config.chatbotServer}/static/widget-themes.js"></script>
    <!-- KaTeX for Math Expression Support (conditionally loaded) -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css" media="print" onload="this.media='all'" crossorigin="anonymous">
    <script src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js" async crossorigin="anonymous"></script>
    <style>
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }
        
        html {
            height: 100%;
            margin: 0;
            padding: 0;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
            font-size: ${this.config.fontSize};
            display: flex;
            flex-direction: column;
            height: 100%;
            min-height: 100%;
            width: 100%;
            background: ${this.config.theme === 'dark' ? 'rgba(30, 30, 30, 0.9)' : 'rgba(255, 255, 255, 0.7)'};
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
            color: ${this.config.theme === 'dark' ? '#e0e0e0' : '#333'};
            margin: 0;
            padding: 0;
            overflow: hidden;
            position: relative;
            box-sizing: border-box;
        }
        
        /* Mobile viewport handling - removed to prevent desktop widget issues */
        
        #chat-messages {
            flex: 1 1 auto;
            min-height: 0; /* Important for flex shrinking */
            padding: 10px;
            overflow-y: auto;
            overflow-x: hidden; /* Prevent horizontal overflow */
            background-color: ${this.config.theme === 'dark' ? 'rgba(40, 40, 40, 0.5)' : 'rgba(249, 249, 249, 0.5)'};
            display: flex;
            flex-direction: column;
            gap: 10px;
            width: 100%;
            box-sizing: border-box;
            position: relative;
        }
            
        
        .message {
            max-width: 80%;
            padding: 10px 15px;
            border-radius: 16px;
            word-wrap: break-word;
            white-space: pre-wrap;
            font-size: ${this.config.fontSize} !important;
        }
        
        /* Override external CSS to ensure consistent font sizes */
        .chat-box .bot-message,
        .chat-box .user-message,
        .chat-box .message,
        .bot-message,
        .user-message,
        .message {
            font-size: ${this.config.fontSize} !important;
        }
        
        /* Ensure all child elements also have consistent font size */
        .bot-message *,
        .user-message *,
        .message * {
            font-size: inherit !important;
        }
        
        /* List styling within messages - much more compact */
        .message ol, .message ul {
            margin-left: 0.8em !important;
            padding-left: 0 !important;
            margin-top: 0 !important;
            margin-bottom: 0 !important;
            font-size: ${this.config.fontSize} !important;
            line-height: 1.15 !important;
        }
        
        .message li {
            margin-bottom: 0 !important;
            margin-top: 0 !important;
            list-style-position: outside !important;
            line-height: 1.15 !important;
            font-size: ${this.config.fontSize} !important;
            padding-top: 0.05em !important;
            padding-bottom: 0.05em !important;
        }
        
        .message ol {
            list-style-type: decimal;
        }
        
        .message ul {
            list-style-type: disc;
        }
        
        /* Ensure proper spacing between list items */
        .message li:last-child {
            margin-bottom: 0 !important;
        }
        
        /* Handle nested lists */
        .message ol ol, .message ul ul, .message ol ul, .message ul ol {
            margin-top: 0 !important;
            margin-bottom: 0 !important;
            margin-left: 0.8em !important;
        }
        
        /* Paragraph spacing within messages - much more compact */
        .message p {
            margin-bottom: 0.15em;
            margin-top: 0;
            line-height: 1.3;
        }
        
        .message p:first-child {
            margin-top: 0;
        }
        
        .message p:last-child {
            margin-bottom: 0;
        }
        
        .bot-message {
            align-self: flex-start;
            background-color: ${this.config.theme === 'dark' ? '#3a3a3a' : '#e9e9eb'};
            color: ${this.config.theme === 'dark' ? '#e0e0e0' : '#333'};
            margin-left: 10px;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            font-size: ${this.config.fontSize} !important;
            line-height: 1.5;
            padding: 12px 16px;
            border-radius: 16px;
            max-width: 80%;
            word-wrap: break-word;
            white-space: pre-wrap;
        }

        /* Consistent styling for markdown elements within bot messages - much more compact */
  .bot-message ul,
.bot-message ol {
  margin-top: 0 !important;
  margin-bottom: 0 !important;
  padding-left: 14px !important;
  line-height: 1.15 !important;
}

.bot-message li {
  line-height: 1.15 !important;
  margin: 0 !important;
  padding: 0.05em 0 !important;
}

.bot-message p {
  margin: 0 0 0.15em 0 !important;
  padding: 0 !important;
  line-height: 1.3 !important;
}

        .bot-message p:first-child {
            margin-top: 0 !important;
        }

        .bot-message p:last-child {
            margin-bottom: 0 !important;
        }
        
        .bot-message > p:only-child {
            margin: 0 !important;
        }


        .bot-message code {
            background-color: ${this.config.theme === 'dark' ? '#2a2a2a' : '#f0f0f0'};
            padding: 0.2em 0.4em;
            border-radius: 3px;
            font-family: ui-monospace, SFMono-Regular, SF Mono, Menlo, Consolas, Liberation Mono, monospace;
            font-size: 0.9em;
        }

        .bot-message pre {
            background-color: ${this.config.theme === 'dark' ? '#2a2a2a' : '#f0f0f0'};
            padding: 1em;
            border-radius: 6px;
            overflow-x: auto;
            margin: 0.5em 0;
        }

        .bot-message pre code {
            background-color: transparent;
            padding: 0;
            border-radius: 0;
            font-size: 0.9em;
        }

        .bot-message a {
            color: ${this.config.theme === 'dark' ? '#66b3ff' : '#0066cc'};
            text-decoration: none;
        }

        .bot-message a:hover {
            text-decoration: underline;
        }

        .bot-message blockquote {
            margin: 0.5em 0;
            padding-left: 1em;
            border-left: 3px solid ${this.config.theme === 'dark' ? '#666' : '#ccc'};
            color: ${this.config.theme === 'dark' ? '#ccc' : '#666'};
        }

        .bot-message h1, .bot-message h2, .bot-message h3, 
        .bot-message h4, .bot-message h5, .bot-message h6 {
            margin: 1em 0 0.5em 0;
            line-height: 1.2;
        }

        .bot-message h1 { font-size: 1.5em; }
        .bot-message h2 { font-size: 1.3em; }
        .bot-message h3 { font-size: 1.2em; }
        .bot-message h4 { font-size: 1.1em; }
        .bot-message h5 { font-size: 1em; }
        .bot-message h6 { font-size: 0.9em; }

        .bot-message table {
            border-collapse: collapse;
            margin: 0.5em 0;
            width: 100%;
        }

        .bot-message th, .bot-message td {
            border: 1px solid ${this.config.theme === 'dark' ? '#444' : '#ddd'};
            padding: 0.5em;
            text-align: left;
        }

        .bot-message th {
            background-color: ${this.config.theme === 'dark' ? '#333' : '#f5f5f5'};
        }
        
        .user-message {
            align-self: flex-end;
            background-color: ${this.config.color_scheme};
            color: white;
            margin-right: 10px;
            font-size: ${this.config.fontSize} !important;
        }
        
        .admin-message {
            align-self: flex-start;
            background-color: ${this.config.theme === 'dark' ? '#4a3333' : '#FFE4E1'};
            color: ${this.config.theme === 'dark' ? '#ffc0c0' : '#333'};
            margin-left: 10px;
            font-size: ${this.config.fontSize} !important;
        }
        
        .bot-message img {
            max-width: 100%;
            max-height: 300px;
            height: auto;
            border-radius: 8px;
            margin: 8px 0;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            object-fit: contain;
            cursor: pointer;
        }
        
        .bot-message ul li {
            list-style-type: disc;
        }
        
        .bot-message ol li {
            list-style-type: decimal;
        }
        
        #typing-indicator {
            padding: 10px;
            display: none;
            margin-left: 10px;
            font-size: ${this.config.fontSize};
            flex-shrink: 0;
        }
        
        .dot {
            display: inline-block;
            width: 8px;
            height: 8px;
            margin-right: 4px;
            background-color: #333;
            border-radius: 50%;
            opacity: 0.3;
            animation: blink 1.5s infinite;
        }
        
        .dot:nth-child(2) { animation-delay: 0.3s; }
        .dot:nth-child(3) { animation-delay: 0.6s; }
        
        @keyframes blink {
            0%, 100% { opacity: 0.3; }
            50% { opacity: 1; }
        }
        
        #chat-form {
            display: flex;
            flex-direction: column;
            border-top: 1px solid ${this.config.theme === 'dark' ? '#444' : '#ddd'};
            padding: 8px 8px 8px 20px;
            background-color: ${this.config.theme === 'dark' ? '#2a2a2a' : '#f9f9f9'};
            flex: 0 0 auto;
            flex-shrink: 0;
            position: relative;
            z-index: 10;
            width: 100%;
            box-sizing: border-box;
            margin-top: auto; /* Push to bottom */
            min-height: fit-content; /* Maintain natural height */
        }
        
        /* Enhanced mobile form positioning and scaling - only for actual mobile devices, not desktop widgets */
        @media screen and (max-device-width: 768px) and (pointer: coarse) {
            /* Base font size increase for mobile only when it's actually a touch device */
            .hybridai-chat-window {
                font-size: 16px !important;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, 'Noto Color Emoji', 'Apple Color Emoji', 'Segoe UI Emoji', sans-serif !important;
            }
            
            /* Fix button icons on mobile */
            .hybridai-control-button, .icon-button, button {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, 'Noto Color Emoji', 'Apple Color Emoji', 'Segoe UI Emoji', sans-serif !important;
                font-size: 18px !important;
                text-rendering: optimizeLegibility !important;
                -webkit-font-smoothing: antialiased !important;
                -moz-osx-font-smoothing: grayscale !important;
            }
            
            /* Ensure emoji rendering on mobile */
            .hybridai-control-button {
                font-variant-emoji: emoji !important;
                font-feature-settings: "liga" 1, "kern" 1 !important;
            }
            
            #chat-form {
                position: sticky;
                bottom: 0;
                padding: 15px 12px 15px 24px;
                border-top: 2px solid ${this.config.theme === 'dark' ? '#444' : '#ddd'};
                box-shadow: 0 -2px 8px rgba(0,0,0,0.1);
                font-size: 16px !important;
            }
            
            #chat-input {
                font-size: 16px !important;
                padding: 12px 16px !important;
                border-radius: 25px !important;
                min-height: 44px !important;
            }
            
            .form-buttons {
                min-height: 24px !important;
                padding-bottom: env(safe-area-inset-bottom, 0px);
            }
            
            #chat-messages {
                font-size: 16px !important;
                padding: 16px !important;
            }
            
            .bot-message, .user-message {
            
                font-size: 16px !important;
                padding: 12px 16px !important;
                margin: 6px 0 !important;
                max-width: 85% !important;
                line-height: 1.3 !important;
            }
            
            /* Ensure all child elements inherit font size on mobile */
            .bot-message *,
            .user-message *,
            .message * {
                font-size: inherit !important;
            }

            .bot-message ul, 
            .bot-message ol,
            .message ul,
            .message ol {
                margin: 0 !important;
                padding-left: 14px !important;
                line-height: 1.15 !important;
            }

            .bot-message li,
            .message li {
                margin: 0 !important;
                padding: 0.05em 0 !important;
                line-height: 1.15 !important;
            }

            
            .default-message-btn {
                font-size: 16px !important;
                padding: 8px 14px !important;
                min-height: 36px !important;
                border-radius: 20px !important;
                margin: 4px 0 !important;
            }
            
            .default-messages {
                margin: 8px 12px !important;
                gap: 4px !important;
                align-items: flex-start;
            }
            
            .hybridai-title-bar {
                font-size: 18px !important;
                padding: 0 16px !important;
                height: 56px !important;
            }
            
            .hybridai-title-bar button {
                font-size: 20px !important;
                min-width: 44px !important;
                min-height: 44px !important;
                padding: 8px !important;
            }
            
 
            
            #chat-input {
                min-height: 44px !important;
                font-size: 16px !important;
                padding: 12px 70px 12px 12px !important;
            }
        }
        
        .textarea-container {
            position: relative;
            display: flex;
            margin-bottom: 8px;
        }
        
        #chat-input {
            flex: 1;
            min-height: 32px;
            max-height: 64px;
            padding: 8px 72px 8px 8px;
            border: 1px solid ${this.config.theme === 'dark' ? '#555' : '#ddd'};
            border-radius: 8px;
            outline: none;
            font-size: ${localStorage.getItem('hybridai_font_size') || this.config.fontSize.replace('px', '')}px;
            resize: none;
            font-family: inherit;
            overflow-y: hidden;
            overflow-x: hidden;
            line-height: 1.4;
            background-color: ${this.config.theme === 'dark' ? '#1a1a1a' : '#fff'};
            color: ${this.config.theme === 'dark' ? '#e0e0e0' : '#333'};
        }
.input-actions {
    position: absolute;
    vertical-align: middle;
    right: 8px;
    top: 0;
    bottom: 0;
    margin: auto 0;
    display: flex;
    gap: 4px;
    align-items: center;
    height: 32px; /* Or remove for auto height */
}
        
        /* Hide scrollbar for all browsers */
        #chat-input::-webkit-scrollbar {
            display: none;
            width: 0;
            height: 0;
        }
        
        #chat-input {
            -ms-overflow-style: none;  /* IE and Edge */
            scrollbar-width: none;  /* Firefox */
        }
        

       .icon-button, .mic-toggle {
            background: none;
            border: none;
            font-size: 18px;
            cursor: pointer;
            padding: 0;
            opacity: 0.7;
            transition: opacity 0.2s;
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            border-radius: 50%;
        }
        .icon-button:hover, .mic-toggle:hover {
            opacity: 1;
            background: ${this.config.theme === 'dark' ? '#3a5ad7' : '#3451b2'};
        }
         .send-button {
            background: ${this.config.color_scheme};
            border: none;
            border-radius: 50%;
            font-size: 18px;
            cursor: pointer;
            padding: 0;
            transition: background-color 0.2s;
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #fff;
            flex-shrink: 0;
            box-shadow: none;
        }
        
        .send-button:hover {
            background: ${this.config.theme === 'dark' ? '#3a5ad7' : '#3451b2'};
        }

        .action-toggle {
            position: relative;
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .action-toggle .mic-toggle {
            display: block;
        }
        
        .action-toggle .send-button {
            position: absolute;
            top: 0;
            left: 0;
            display: none;
        }
        
        .action-toggle.has-text .mic-toggle {
            display: none;
        }
        
        .action-toggle.has-text .send-button {
            display: flex;
            opacity: 1;
            pointer-events: auto;
        }
        
        .mic-toggle.listening {
            color: red;
            animation: pulse 1s infinite ease-in-out;
        }
        
        .mic-toggle.continuous-mode {
            background: linear-gradient(45deg, #ff6b6b, #ee5a52);
            color: white;
            border-radius: 50%;
            box-shadow: 0 0 15px rgba(255, 107, 107, 0.4);
            animation: glow-pulse 2s infinite ease-in-out;
        }
        
        @keyframes glow-pulse {
            0% { 
                box-shadow: 0 0 15px rgba(255, 107, 107, 0.4);
                transform: scale(1);
            }
            50% { 
                box-shadow: 0 0 25px rgba(255, 107, 107, 0.6);
                transform: scale(1.05);
            }
            100% { 
                box-shadow: 0 0 15px rgba(255, 107, 107, 0.4);
                transform: scale(1);
            }
        }
        
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.3); }
            100% { transform: scale(1); }
        }

        .form-buttons {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 0;
            margin-bottom: 0;
            padding: 0;
            min-height: 20px; /* Ensure minimum height */
            flex: 0 0 auto; /* Never grow or shrink */
            width: 100%;
            box-sizing: border-box;
        }
        
button[type="submit"] {
    border: none;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    margin-top: 5px;
    font-size: 16px;
    background-color: ${this.config.color_scheme};
    color: white;
    cursor: pointer;
    font-size: ${this.config.fontSize};
    transition: background-color 0.2s;
    font-family: inherit;
    padding: 0;
}

        
        button[type="submit"]:hover {
            opacity: 0.9;
        }
        
        button[type="submit"]:disabled {
            opacity: 0.6;
            cursor: not-allowed;
        }
        
          .footer-links {
            flex: 1;
            display: flex;
            justify-content: space-between;
            font-size: 9px;
            color: #777;
            margin: 0;
            align-items: center;
            flex-wrap: wrap; /* Allow wrapping on small widths */
            gap: 4px;
            padding: 0;
            min-height: 0;
        }
        .footer-links a {
            color: rgb(139, 150, 161);
            text-decoration: none;
        }
        .footer-links a:hover {
            text-decoration: underline;
        }
        .footer-links-right {
            margin-left: 8px;
        }
        
        #file-upload {
            display: none;
        }
        
        .default-messages {
            margin: 5px 10px;
            display: flex;
            flex-direction: column;
            gap: 3px;
            align-items: flex-start;
        }
        
        .default-message-btn {
            padding: 6px 10px;
            background-color: ${this.config.theme === 'dark' ? '#3a3a3a' : '#e0e0e0'};
            color: ${this.config.theme === 'dark' ? '#e0e0e0' : '#333'};
            border: none;
            border-radius: 4px;
            cursor: pointer;
            transition: background-color 0.2s;
            font-size: ${this.config.fontSize} !important;
            font-family: inherit;
            text-align: left;
        }
        
        .default-message-btn:hover {
            background-color: ${this.config.theme === 'dark' ? '#4a4a4a' : '#d0d0d0'};
        }
        
        /* High-specificity compact list rules to override any conflicts */
        .hybridai-chat-window .message ul,
        .hybridai-chat-window .message ol,
        .hybridai-chat-window .bot-message ul,
        .hybridai-chat-window .bot-message ol,
        .hybridai-chat-window .user-message ul,
        .hybridai-chat-window .user-message ol,
        .hybridai-chat-window .admin-message ul,
        .hybridai-chat-window .admin-message ol {
            margin-top: 0 !important;
            margin-bottom: 0 !important;
            padding-left: 14px !important;
            line-height: 1.15 !important;
        }
        
        .hybridai-chat-window .message li,
        .hybridai-chat-window .bot-message li,
        .hybridai-chat-window .user-message li,
        .hybridai-chat-window .admin-message li {
            margin-top: 0 !important;
            margin-bottom: 0 !important;
            line-height: 1.15 !important;
            padding: 0.05em 0 !important;
        }
        
        /* Force compact nested lists */
        .hybridai-chat-window .message ul ul,
        .hybridai-chat-window .message ol ol,
        .hybridai-chat-window .message ul ol,
        .hybridai-chat-window .message ol ul,
        .hybridai-chat-window .bot-message ul ul,
        .hybridai-chat-window .bot-message ol ol,
        .hybridai-chat-window .bot-message ul ol,
        .hybridai-chat-window .bot-message ol ul {
            margin-top: 0 !important;
            margin-bottom: 0 !important;
        }
        
        /* Math expression styling */
        .katex-display {
            margin: 1em 0;
            overflow-x: auto;
            overflow-y: hidden;
        }
        
        .katex {
            font-size: 1.1em;
            color: inherit;
        }
        
        /* Dark theme adjustments for math */
        body[data-theme="dark"] .katex,
        .dark-theme .katex,
        [data-theme="dark"] .katex {
            color: #e0e0e0;
        }
        
        body[data-theme="dark"] .katex-error,
        .dark-theme .katex-error,
        [data-theme="dark"] .katex-error {
            color: #ff6b6b;
        }
        
        /* Ensure math works well with message bubbles */
        .bot-message .katex-display {
            margin: 0.5em 0;
        }
        
        .bot-message .katex {
            max-width: 100%;
        }
        
        /* Fullscreen mode math styling */
        .hybridai-fullscreen-overlay .katex-display {
            margin: 1em 0;
            text-align: center;
        }
        
        .hybridai-fullscreen-overlay .katex {
            font-size: 1.2em;
        }
        
        /* Prevent math overflow in chat window */
        .hybridai-chat-window .katex-display {
            max-width: 100%;
            overflow-x: auto;
        }
        
        .hybridai-chat-window .katex {
            word-break: normal;
            white-space: normal;
        }

        /* Theme-specific message styles */
        ${this.getThemeMessageStyles()}
    </style>
</head>
<body>
    ${shouldShowPrivacyNotice ? `
    <!-- Privacy Notice Overlay -->
    <div id="privacy-notice-overlay" style="
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: ${this.config.theme === 'dark' ? 'rgba(0, 0, 0, 0.95)' : 'rgba(255, 255, 255, 0.98)'};
        z-index: 1000;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
    ">
        <div style="
            background: ${this.config.theme === 'dark' ? '#2a2a2a' : 'white'};
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
            max-width: 100%;
            width: 100%;
            max-height: 80%;
            display: flex;
            flex-direction: column;
            overflow: hidden;
        ">
            <!-- Header -->
            <div style="
                padding: 16px 20px;
                border-bottom: 1px solid ${this.config.theme === 'dark' ? '#444' : '#e5e7eb'};
                background: ${this.config.theme === 'dark' ? '#333' : `linear-gradient(135deg, ${this.config.color_scheme}15 0%, ${this.config.color_scheme}05 100%)`};
            ">
                <h2 style="
                    margin: 0;
                    color: ${this.config.theme === 'dark' ? '#e0e0e0' : '#111827'};
                    font-size: 15px;
                    font-weight: 600;
                ">Privacy Notice</h2>
            </div>

            <!-- Content -->
            <div style="
                padding: 20px;
                overflow-y: auto;
                flex: 1;
                color: ${this.config.theme === 'dark' ? '#ccc' : '#374151'};
                line-height: 1.6;
                font-size: 12px;
            ">
                ${this.config.privacyNoticeText.replace(/\n/g, '<br>')}
            </div>

            <!-- Footer -->
            <div style="
                padding: 16px 20px;
                border-top: 1px solid ${this.config.theme === 'dark' ? '#444' : '#e5e7eb'};
                display: flex;
                justify-content: center;
            ">
                <button id="privacy-accept-btn" style="
                    background-color: ${this.config.color_scheme};
                    color: white;
                    border: none;
                    border-radius: 6px;
                    padding: 10px 28px;
                    font-size: 15px;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.2s;
                ">Accept</button>
            </div>
        </div>
    </div>
    ` : ''}

    <div id="chat-container" style="flex: 1 1 auto; display: flex; flex-direction: column; overflow: hidden; width: 100%; min-height: 0; position: relative;">
        <div id="chat-messages"></div>
        <div id="typing-indicator">
            <span class="dot"></span>
            <span class="dot"></span>
            <span class="dot"></span>
        </div>
    </div>
    <form id="chat-form">
        <input type="hidden" id="chatbot-id" value="${this.config.chatbotId}">
        
        <div class="textarea-container">
            <textarea id="chat-input" placeholder="${this.config.placeholder_text || 'Type your message...'}" rows="1"></textarea>
            <div class="input-actions">
                
                <div class="action-toggle">
                    <button id="enable-mic" class="icon-button mic-toggle" title="Voice input" type="button">🎙</button>
                    <button id="send-button" type="submit" class="send-button" title="Send message">↑</button>
                </div>
            </div>
        </div>

        ${this.config.aiDisclaimerText ? `
        <div class="ai-disclaimer" style="
            text-align: center;
            font-size: 9px;
            color: rgb(139, 150, 161);
            font-style: italic;
            padding: 2px 8px;
            margin-top: -4px;
            margin-bottom: 4px;
        ">
            ${this.config.aiDisclaimerText}
        </div>
        ` : ''}

        <div class="form-buttons">
            <div class="footer-links">
                <a href="https://hybridai.one" target="_blank">Powered by hybridai.one</a>
                <span class="footer-links-right">
                    <a href="https://hybridai.one/privacy" target="_blank">Privacy</a> | 
                    <a href="https://haichat.life" target="_blank">More bots</a>
                </span>
                <input type="file" id="file-upload" accept=".pdf,.docx,.txt">
            </div>
        </div>
    </form>
    
    <script>
        ${this.getIframeScript()}
    </script>
</body>
</html>`;
        },
        
        // Get iframe JavaScript content
        getIframeScript() {
            return `
// Handle privacy notice acceptance
(function() {
    const privacyOverlay = document.getElementById('privacy-notice-overlay');
    const acceptBtn = document.getElementById('privacy-accept-btn');

    if (privacyOverlay && acceptBtn) {
        // Handle accept button click
        acceptBtn.addEventListener('click', function() {
            // Store acceptance in parent's localStorage
            if (window.parent && window.parent.localStorage) {
                const chatbotIdElem = document.getElementById('chatbot-id');
                const chatbotId = chatbotIdElem ? chatbotIdElem.value : '';
                const acceptedKey = 'hybridai_privacy_accepted_' + chatbotId;
                window.parent.localStorage.setItem(acceptedKey, 'true');
            }

            // Fade out and remove the overlay
            privacyOverlay.style.transition = 'opacity 0.3s';
            privacyOverlay.style.opacity = '0';

            setTimeout(function() {
                privacyOverlay.remove();

                // Focus on the input field after privacy notice is closed
                const chatInput = document.getElementById('chat-input');
                if (chatInput && !isMobileDevice()) {
                    chatInput.focus();
                }
            }, 300);
        });

        // Add hover effect to button
        acceptBtn.addEventListener('mouseenter', function() {
            acceptBtn.style.opacity = '0.9';
            acceptBtn.style.transform = 'scale(1.02)';
        });

        acceptBtn.addEventListener('mouseleave', function() {
            acceptBtn.style.opacity = '1';
            acceptBtn.style.transform = 'scale(1)';
        });
    }
})();

// Handle mobile viewport height
function updateViewportHeight() {
    // Get the actual viewport height and set it as CSS variable
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', \`\${vh}px\`);
    
    // Update body height for mobile - only on actual mobile devices
    const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if (isMobileDevice && window.innerWidth <= 768) {
        document.body.style.height = window.innerHeight + 'px';
        document.documentElement.style.height = window.innerHeight + 'px';
    }
}

// Set up viewport height handling
updateViewportHeight();
window.addEventListener('resize', updateViewportHeight);
window.addEventListener('orientationchange', () => {
    setTimeout(updateViewportHeight, 100);
});

// Handle visual viewport changes (keyboard show/hide on mobile)
if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', () => {
        updateViewportHeight();
        // Scroll to bottom when keyboard appears
        const messagesContainer = document.getElementById('chat-messages');
        if (messagesContainer) {
            setTimeout(() => {
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
            }, 100);
        }
    });
}

// Initialize
let userInteracted = localStorage.getItem("sound_enabled") === "true";
let currentAudio = null;
let audioContext = null;
let mediaRecorder = null;
let audioChunks = [];
let md = null;
let isHoldToTalkMode = true; // true = single click for hold-to-talk, false = continuous recording
let clickTimer = null;
let clickCount = 0;

// Initialize markdown-it
function initializeMarkdownIt() {
    const MarkdownItConstructor = window.markdownit || window.MarkdownIt || (typeof markdownit !== 'undefined' ? markdownit : null);
    
    if (MarkdownItConstructor) {
        md = MarkdownItConstructor({
            html: true,  // Enable HTML to allow image rendering
            breaks: false,  // Disable automatic line breaks for more compact lists
            linkify: true,
            typographer: true
        });
        // Custom renderer for list items - compact spacing
        if (md && md.renderer && md.renderer.rules) {
            md.renderer.rules.list_item_open = function(tokens, idx, options, env, renderer) {
                return '<li style=\\"margin: 0; padding: 0;\\">';
            };
            // Custom renderer for paragraphs - compact spacing
            md.renderer.rules.paragraph_open = function(tokens, idx, options, env, renderer) {
                return '<p style=\\"margin: 0 0 0.2em 0;\\">';
            };
        }
        // Disable automatic image rendering to prevent duplicates
        // md.disable(['image']);
        // Ensure list and table parsing is enabled and working
        md.enable(['list', 'table']);
        
        // Add math support if enabled and available
        // Check if math is enabled via different config sources
        const mathEnabled = (typeof enableMath !== 'undefined' && enableMath) ||
                          (typeof HybridAIWidget !== 'undefined' && HybridAIWidget.config.enableMath) ||
                          window.chatbotConfig?.enableMath || 
                          window.hybridai_chatbotConfig?.enableMath || 
                          window.parent?.chatbotConfig?.enableMath ||
                          false;
        if (mathEnabled) {
            initializeMathSupport(md);
        }
        
        return true;
    } else {
        return false;
    }
}

function initializeMathSupport(markdownInstance) {
    try {
        // Check if KaTeX is loaded
        if (typeof window.katex !== 'undefined') {
            // Add custom inline rule for dollar sign delimited math
            markdownInstance.inline.ruler.after('escape', 'math_inline', function(state, silent) {
                var pos = state.pos;
                var dollarChar = String.fromCharCode(36); // Dollar sign
                if (state.src.charAt(pos) !== dollarChar) return false;
                
                // Find closing dollar sign
                var endPos = state.src.indexOf(dollarChar, pos + 1);
                if (endPos === -1 || endPos === pos + 1) return false;
                
                if (!silent) {
                    var token = state.push('math_inline', 'math', 0);
                    token.content = state.src.slice(pos + 1, endPos).trim();
                }
                
                state.pos = endPos + 1;
                return true;
            });
            
            // Add custom block rule for double dollar sign delimited math
            markdownInstance.block.ruler.after('fence', 'math_block', function(state, startLine, endLine, silent) {
                var pos = state.bMarks[startLine] + state.tShift[startLine];
                var max = state.eMarks[startLine];
                var dollarChar = String.fromCharCode(36); // Dollar sign
                var doubleDollar = dollarChar + dollarChar;
                
                if (pos + 2 > max) return false;
                if (state.src.charAt(pos) !== dollarChar || state.src.charAt(pos + 1) !== dollarChar) return false;
                
                pos += 2;
                var firstLine = state.src.slice(pos, max);
                
                if (silent) return true;
                
                var nextLine = startLine;
                var content = '';
                
                // Check if it's a single line block
                var endIndex = firstLine.indexOf(doubleDollar);
                if (endIndex !== -1) {
                    content = firstLine.slice(0, endIndex).trim();
                    nextLine = startLine + 1;
                } else {
                    // Multi-line block
                    content = firstLine + String.fromCharCode(10); // Newline
                    
                    for (nextLine = startLine + 1; nextLine < endLine; nextLine++) {
                        pos = state.bMarks[nextLine] + state.tShift[nextLine];
                        max = state.eMarks[nextLine];
                        var currentLine = state.src.slice(pos, max);
                        
                        var dollarIndex = currentLine.indexOf(doubleDollar);
                        if (dollarIndex !== -1) {
                            content += currentLine.slice(0, dollarIndex);
                            nextLine++;
                            break;
                        }
                        content += currentLine + String.fromCharCode(10); // Newline
                    }
                }
                
                var token = state.push('math_block', 'math', 0);
                token.content = content.trim();
                token.block = true;
                
                state.line = nextLine;
                return true;
            });
            
            // Add renderers
            markdownInstance.renderer.rules.math_inline = function(tokens, idx) {
                try {
                    return window.katex.renderToString(tokens[idx].content, {
                        throwOnError: false,
                        displayMode: false
                    });
                } catch (e) {
                    return '<span style="color: red;">' + tokens[idx].content + '</span>';
                }
            };
            
            markdownInstance.renderer.rules.math_block = function(tokens, idx) {
                try {
                    return '<div class="katex-display">' + window.katex.renderToString(tokens[idx].content, {
                        throwOnError: false,
                        displayMode: true
                    }) + '</div>';
                } catch (e) {
                    var dollarChar = String.fromCharCode(36);
                    return '<div style="color: red;">' + dollarChar + dollarChar + tokens[idx].content + dollarChar + dollarChar + '</div>';
                }
            };
            
            console.log('HybridAI Widget: Math support initialized with custom rules');
        } else {
            console.log('HybridAI Widget: KaTeX not yet loaded, retrying...');
            // Retry after a delay with max attempts
            if (!window.mathRetryCount) window.mathRetryCount = 0;
            if (window.mathRetryCount < 10) {
                window.mathRetryCount++;
                setTimeout(() => initializeMathSupport(markdownInstance), 500);
            } else {
                console.warn('HybridAI Widget: KaTeX failed to load after 10 attempts');
            }
        }
    } catch (error) {
        console.warn('HybridAI Widget: Could not initialize math support:', error);
        // Continue without math support - no impact on regular markdown
    }
}

// Try to initialize markdown-it after a short delay
setTimeout(initializeMarkdownIt, 200);

// Utility functions
function processBotMessage(text) {
    // Only extract commands - let markdown-it handle all formatting
    const cmdRegex = /\\[CMD:([\\s\\S]*?)\\]/g;
    const extractedCommands = [];
    
    // Extract commands and remove them from text
    const processedText = text.replace(cmdRegex, function(match) {
        extractedCommands.push(match);
        return '';  // Remove commands completely
    });
    
    return {
        text: processedText,
        commands: extractedCommands
    };
}

function scrollToBottom() {
    const messagesContainer = document.getElementById("chat-messages");
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function showTypingIndicator() {
    document.getElementById("typing-indicator").style.display = "block";
    scrollToBottom();
}

function hideTypingIndicator() {
    document.getElementById("typing-indicator").style.display = "none";
}


// Render default messages
function renderDefaultMessages() {
    if (!Array.isArray(defaultMessages) || defaultMessages.length === 0) return;
    const messagesContainer = document.getElementById("chat-messages");
    if (!messagesContainer) return;
    // Remove any existing default-messages div to avoid duplicates
    const oldDiv = messagesContainer.querySelector('.default-messages');
    if (oldDiv) oldDiv.remove();
    const defaultMessagesDiv = document.createElement("div");
    defaultMessagesDiv.className = "default-messages";
    defaultMessages.forEach(message => {
        const btn = document.createElement("button");
        btn.className = "default-message-btn";
        btn.textContent = message;
        btn.addEventListener("click", () => {
            const input = document.getElementById("chat-input");
            if (input) input.value = message;
            const actionToggle = document.querySelector(".action-toggle");
            if (actionToggle) actionToggle.classList.add("has-text");
            const form = document.getElementById("chat-form");
            if (form) form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
        });
        defaultMessagesDiv.appendChild(btn);
    });
    messagesContainer.appendChild(defaultMessagesDiv);
}

// --- Robust widget initialization for iOS/mobile ---
function waitForWidgetReady(cb) {
    let attempts = 0;
    function check() {
        attempts++;
        // DOM must be ready, defaultMessages must be defined and chat-messages must exist
        if (
            typeof defaultMessages !== 'undefined' &&
            Array.isArray(defaultMessages) &&
            document.getElementById('chat-messages')
        ) {
            cb();
        } else if (attempts < 50) { // try for up to ~2.5s
            setTimeout(check, 50);
        } else {
            // fallback: try anyway
            cb();
        }
    }
    check();
}

// Audio functions
function initializeAudioContext() {
    if (!audioContext && userInteracted) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    
    if (audioContext && audioContext.state === 'suspended' && userInteracted) {
        audioContext.resume().catch(err => console.warn("AudioContext resume error:", err));
    }
    return audioContext;
}

// Microphone-specific audio context (independent of audio toggle)
function initializeMicrophoneAudioContext() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    
    if (audioContext && audioContext.state === 'suspended') {
        audioContext.resume().catch(err => console.warn("AudioContext resume error:", err));
    }
    return audioContext;
}

function stopCurrentAudio() {
    if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
        currentAudio.src = "";
        currentAudio = null;
    }
}

async function fetchSpeech(text) {
    try {
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
        if (!userInteracted || isIOS) {
            console.log('Audio is disabled or iOS device');
            return null;
        }
        
        initializeAudioContext();
        
        const response = await fetch(chatbotServer + '/api/text-to-speech', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text })
        });
        
        if (!response.ok) throw new Error('Failed to fetch speech');
        
        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        
        stopCurrentAudio();
        
        const audio = new Audio(audioUrl);
        currentAudio = audio;
        
        audio.addEventListener('ended', () => {
            currentAudio = null;
            URL.revokeObjectURL(audioUrl);
            // Only auto-start recording if in hold-to-talk mode
            if (userInteracted && isHoldToTalkMode) {
                startRecording();
            }
        });
        
        await audio.play();
        return audioUrl;
    } catch (error) {
        console.error('Error in fetchSpeech:', error);
        return null;
    }
}

// Voice recording
function startRecording() {
    const micBtn = document.getElementById('enable-mic');
    
    console.log('startRecording called, isHoldToTalkMode:', isHoldToTalkMode);
    
    // Note: Microphone can be used independently of audio toggle
    // Initialize microphone audio context (always available for recording)
    initializeMicrophoneAudioContext();
    
    if (micBtn.classList.contains('listening')) {
        console.log('Already recording, stopping...');
        if (mediaRecorder && mediaRecorder.state !== 'inactive') {
            mediaRecorder.stop();
        }
        return;
    }
    
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
            // Enhanced browser compatibility with better MIME type detection
            let options = {};
            let selectedFormat = 'default';
            
            // Test formats in order of preference: mp4 (most compatible) -> webm -> ogg -> default
            if (MediaRecorder.isTypeSupported('audio/mp4')) {
                options = { mimeType: 'audio/mp4' };
                selectedFormat = 'audio/mp4';
            } else if (MediaRecorder.isTypeSupported('audio/webm')) {
                options = { mimeType: 'audio/webm' };
                selectedFormat = 'audio/webm';
            } else if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
                options = { mimeType: 'audio/webm;codecs=opus' };
                selectedFormat = 'audio/webm;codecs=opus';
            } else if (MediaRecorder.isTypeSupported('audio/ogg;codecs=opus')) {
                options = { mimeType: 'audio/ogg;codecs=opus' };
                selectedFormat = 'audio/ogg;codecs=opus';
            } else {
                // Use browser default
                console.warn('No specific MIME type supported, using browser default');
                selectedFormat = 'browser-default';
            }
            
            console.log('Selected audio format:', selectedFormat);
            console.log('Browser info:', navigator.userAgent);
            
            try {
                mediaRecorder = new MediaRecorder(stream, options);
            } catch (error) {
                console.error('Failed to create MediaRecorder with options:', options, error);
                // Fallback: try without any options
                try {
                    mediaRecorder = new MediaRecorder(stream);
                    selectedFormat = 'fallback-default';
                    console.log('Using fallback MediaRecorder without options');
                } catch (fallbackError) {
                    console.error('Failed to create MediaRecorder even without options:', fallbackError);
                    alert('Your browser does not support audio recording. Please try a different browser.');
                    stream.getTracks().forEach(track => track.stop());
                    return;
                }
            }
            
            audioChunks = [];
            
            console.log('MediaRecorder created successfully with format:', selectedFormat);
            
            // Variable to track if no speech was detected (only relevant in hold-to-talk mode)
            let noSpeechDetected = false;
            
            mediaRecorder.addEventListener("dataavailable", event => {
                if (event.data.size > 0) {
                    audioChunks.push(event.data);
                    console.log('Audio chunk received:', event.data.size, 'bytes');
                }
            });
            
            mediaRecorder.addEventListener("stop", () => {
                console.log('Recording stopped, total chunks:', audioChunks.length);
                console.log('isHoldToTalkMode:', isHoldToTalkMode);
                console.log('noSpeechDetected:', mediaRecorder.noSpeechDetected);
                
                micBtn.classList.remove('listening');
                stream.getTracks().forEach(track => track.stop());
                
                // Check if this was stopped due to no speech (only in hold-to-talk mode)
                if (isHoldToTalkMode && mediaRecorder.noSpeechDetected) {
                    console.log('Recording stopped due to no initial speech detected');
                    alert('No speech detected. Please try again and speak louder.');
                    return; // Don't process the audio
                }
                
                if (audioChunks.length > 0) {
                    const finalMimeType = options.mimeType || 'audio/webm';
                    const audioBlob = new Blob(audioChunks, { type: finalMimeType });
                    console.log('Created audio blob:', audioBlob.size, 'bytes, type:', audioBlob.type);
                    
                    if (audioBlob.size > 50) { // Even lower threshold for debugging
                        sendAudioToBackend(audioBlob);
                    } else {
                        console.warn('Audio blob too small, not sending:', audioBlob.size, 'bytes');
                        alert('Recording too short or empty. Please speak louder and try again.');
                    }
                } else {
                    console.warn('No audio chunks recorded');
                    alert('No audio recorded. Please check microphone permissions and try again.');
                }
            });
            
            mediaRecorder.addEventListener("error", (event) => {
                console.error('MediaRecorder error:', event.error);
                alert('Recording error: ' + (event.error ? event.error.message : 'Unknown error'));
                micBtn.classList.remove('listening');
                stream.getTracks().forEach(track => track.stop());
            });
            
            try {
                mediaRecorder.start(1000); // Collect data every 1 second
                micBtn.classList.add('listening');
                console.log('MediaRecorder started successfully');
                
                // Only set up silence detection if in hold-to-talk mode
                if (isHoldToTalkMode) {
                    // Set up audio analysis for silence detection
                    if (!audioContext || audioContext.state === 'closed') {
                        audioContext = new (window.AudioContext || window.webkitAudioContext)();
                    }
                    
                    const microphone = audioContext.createMediaStreamSource(stream);
                    const analyser = audioContext.createAnalyser();
                    microphone.connect(analyser);
                    analyser.fftSize = 2048;
                    
                    const bufferLength = analyser.fftSize;
                    const dataArray = new Float32Array(bufferLength);
                    let speakingDetected = false;
                    let silenceTimeout = null;
                    
                    // Initial timeout - stop if no speech detected in first 4 seconds
                    let initialSilenceTimeout = setTimeout(() => {
                        if (!speakingDetected && mediaRecorder.state !== 'inactive') {
                            console.log('No speech detected in initial 4 seconds, stopping recording');
                            mediaRecorder.noSpeechDetected = true;
                            mediaRecorder.stop();
                        }
                    }, 4000);
                    
                    // RMS calculation for audio level detection
                    function getRMS() {
                        analyser.getFloatTimeDomainData(dataArray);
                        let sumSquares = 0.0;
                        for (const amplitude of dataArray) { 
                            sumSquares += amplitude * amplitude;
                        }
                        return Math.sqrt(sumSquares / bufferLength);
                    }
                    
                    // Silence detection parameters
                    const rmsSilenceThreshold = 0.10; // Audio level threshold
                    const silenceDuration = 3000; // 3 seconds of silence to stop (reduced from 4s)
                    let lastRMS = 0;
                    
                    // Continuous silence checking
                    const checkSilence = () => {
                        const rms = getRMS();
                        
                        // Update last RMS if significant change
                        if (Math.abs(rms - lastRMS) > 0.01) {
                            lastRMS = rms;
                        }
                        
                        // Speech detected - above threshold
                        if (rms > rmsSilenceThreshold) {
                            speakingDetected = true;
                            // Clear any existing silence timeout
                            if (silenceTimeout) {
                                clearTimeout(silenceTimeout);
                                silenceTimeout = null;
                            }
                            // Clear initial silence timeout since we detected speech
                            clearTimeout(initialSilenceTimeout);
                            console.log('Speech detected, RMS:', rms.toFixed(4));
                        }
                        
                        // Silence detected after speech was detected
                        if (speakingDetected && rms <= rmsSilenceThreshold) {
                            if (!silenceTimeout) {
                                console.log('Silence detected after speech, starting countdown...');
                                silenceTimeout = setTimeout(() => {
                                    if (mediaRecorder.state !== 'inactive') {
                                        console.log('Silence timeout reached, stopping recording');
                                        mediaRecorder.stop();
                                    }
                                }, silenceDuration);
                            }
                        }
                        
                        // Continue checking while recording is active
                        if (mediaRecorder.state !== 'inactive') {
                            requestAnimationFrame(checkSilence);
                        }
                    };
                    
                    // Start silence detection
                    checkSilence();
                    
                    // Clean up timeouts when recording stops
                    const cleanupTimeouts = () => {
                        clearTimeout(silenceTimeout);
                        clearTimeout(initialSilenceTimeout);
                    };
                    
                    // Add cleanup to the existing stop handler
                    mediaRecorder.addEventListener("stop", cleanupTimeouts);
                    
                    // Maximum recording time fallback (60 seconds)
                    setTimeout(() => {
                        if (mediaRecorder && mediaRecorder.state !== 'inactive') {
                            console.log('Max recording time reached (60s), stopping');
                            mediaRecorder.stop();
                        }
                    }, 60000);
                } else {
                    // In continuous mode, add a longer timeout for safety
                    console.log('Continuous recording mode - no auto-stop enabled');
                    
                    // Safety timeout for continuous mode (5 minutes)
                    setTimeout(() => {
                        if (mediaRecorder && mediaRecorder.state !== 'inactive') {
                            console.log('Max continuous recording time reached (5min), stopping');
                            alert('Recording automatically stopped after 5 minutes for safety. Click to start a new recording.');
                            mediaRecorder.stop();
                        }
                    }, 300000); // 5 minutes = 300,000ms
                }
                
            } catch (startError) {
                console.error('Failed to start MediaRecorder:', startError);
                alert('Failed to start recording: ' + startError.message);
                micBtn.classList.remove('listening');
                stream.getTracks().forEach(track => track.stop());
            }
        })
        .catch(err => {
            console.error("Microphone access failed:", err);
            alert("Microphone access failed: " + err.message + ". Please check permissions.");
        });
}

function sendAudioToBackend(blob) {
    console.log('Sending audio to backend:', blob.size, 'bytes, type:', blob.type);
    
    const formData = new FormData();
    // Use proper extension based on blob type
    let filename = "recording.webm";
    if (blob.type.includes('mp4')) {
        filename = "recording.mp4";
    } else if (blob.type.includes('ogg')) {
        filename = "recording.ogg";
    }
    
    formData.append("audio", blob, filename);
    
    fetch(chatbotServer + "/api/voice_transcribe", {
        method: "POST",
        body: formData
    })
    .then(response => {
        console.log('Transcription response status:', response.status);
        if (!response.ok) {
            throw new Error('HTTP ' + response.status + ': ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        console.log('Transcription response:', data);
        if (data.text && data.text.trim()) {
            const input = document.getElementById("chat-input");
            input.value = data.text;
            const actionToggle = document.querySelector(".action-toggle");
            if (actionToggle) actionToggle.classList.add("has-text");
            const form = document.getElementById("chat-form");
            form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
        } else if (data.error) {
            console.error('Transcription API error:', data.error);
            alert('Transcription failed: ' + data.error);
        } else {
            console.warn('Empty transcription result');
            alert('No speech detected in recording. Please try again.');
        }
    })
    .catch(err => {
        console.error("Transcription error:", err);
        alert("Voice recognition error: " + err.message);
    });
}

// File upload
function setupFileUpload() {
    const uploadBtn = document.getElementById("upload-button");
    const fileInput = document.getElementById("file-upload");
    
    if (uploadBtn) {
        uploadBtn.addEventListener("click", () => fileInput.click());
    }
    
    if (fileInput) {
        fileInput.addEventListener("change", event => {
            const file = event.target.files[0];
            if (file) uploadFile(file);
        });
    }
}

function uploadFile(file) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("chatbot_id", chatbotId);
    formData.append("browser_id", browserId);
    
    fetch(chatbotServer + "/api/upload_session_pdf", {
        method: "POST",
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            const messagesContainer = document.getElementById("chat-messages");
            const adminMsg = document.createElement("div");
            adminMsg.className = "admin-message message";
            adminMsg.textContent = 'File "' + file.name + '" uploaded successfully.';
            messagesContainer.appendChild(adminMsg);
            scrollToBottom();
        } else {
            alert("Upload failed: " + data.error);
        }
    })
    .catch(error => console.error("Upload error:", error));
}

// Chat form handling
document.getElementById("chat-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const input = document.getElementById("chat-input");
    const sendButton = document.getElementById("send-button");
    const userMessage = input.value.trim();
    
    console.log("🔍 Form submit triggered with message:", userMessage);
    
    if (!userMessage) {
        console.log("🔍 Empty message, returning");
        return;
    }
    
    // Check if this is an automatic welcome message
    const isWelcomeMessage = userMessage.includes('Heute ist ') && userMessage.includes('eingestellte Sprache ist lang:') && userMessage.includes('Verwende Smileys und halte Dich kurz.');
    
    console.log("🔍 Is welcome message:", isWelcomeMessage);
    
    // Check credits if needed
    if (messageCostsEnabled) {
        let credits = parseInt(localStorage.getItem("chat_credits")) || 0;
        if (credits < 5) {
            window.parent.postMessage({ type: 'show-recharge-prompt' }, '*');
            return;
        }
    }
    
    input.disabled = true;
    sendButton.disabled = true;
    
    const messagesContainer = document.getElementById("chat-messages");
    
    // Remove default messages only if this is NOT an automatic welcome message
    if (!isWelcomeMessage) {
        const defaultMsgs = messagesContainer.querySelector(".default-messages");
        if (defaultMsgs) defaultMsgs.remove();
    }
    
    // Add user message
    const userMsg = document.createElement("div");
    userMsg.className = "user-message message";
    userMsg.textContent = userMessage;
    messagesContainer.appendChild(userMsg);
    
    input.value = "";
    input.style.height = "auto";
    const actionToggle = document.querySelector(".action-toggle");
    if (actionToggle) actionToggle.classList.remove("has-text");
    scrollToBottom();
    
    showTypingIndicator();
    
    // Close any existing EventSource connection
    if (window.currentEventSource) {
        console.log("🔍 Closing existing EventSource connection");
        window.currentEventSource.close();
    }
    
    // Start streaming - use the current privacy mode from window
    const currentPrivacy = window.currentPrivacyMode || privacyMode || 'normal';
    
    // Build the URL with optional API key
    let answerUrl = chatbotServer + "/answer?message=" + encodeURIComponent(userMessage) + 
        "&chatbotId=" + encodeURIComponent(chatbotId) + 
        "&browserId=" + encodeURIComponent(browserId) +
        "&privacyMode=" + encodeURIComponent(currentPrivacy);
    
    // Add API key if it's configured (for restricted bots)
    // Try multiple sources for the API key
    let botApiKey = null;
    
    // Check if apiKey is defined as a variable (for iframe context)
    if (typeof apiKey !== 'undefined' && apiKey) {
        botApiKey = apiKey;
    } else if (window.chatbotConfig?.apiKey) {
        botApiKey = window.chatbotConfig.apiKey;
    } else if (window.hybridai_chatbotConfig?.apiKey) {
        botApiKey = window.hybridai_chatbotConfig.apiKey;
    } else if (typeof HybridAIWidget !== 'undefined' && HybridAIWidget?.config?.apiKey) {
        // Only try HybridAIWidget if it's defined
        botApiKey = HybridAIWidget.config.apiKey;
    }
    
    if (botApiKey) {
        answerUrl += "&apiKey=" + encodeURIComponent(botApiKey);
        console.log("🔐 Including API key for restricted bot access");
    }
    
    const eventSource = new EventSource(answerUrl);
    
    // Store reference to current EventSource
    window.currentEventSource = eventSource;
    console.log("🔍 Created new EventSource connection");
    
    let buffer = "";
    let currentBotMsg = null;
    let isAdminMessage = false;
    let isCanvasActive = false;
    
    eventSource.onmessage = function(event) {
        const chunk = event.data;
        
        // Handle session token (don't hide typing indicator for this)
        if (chunk.startsWith("[SESSION_TOKEN]")) {
            const token = chunk.replace("[SESSION_TOKEN]", "").trim();
            if (token) {
                localStorage.setItem(\`chat_session_token_\${chatbotId}\`, token);
                console.log("Session token received and stored");
            }
            return; // Don't display this in the chat
        }
        
        // Only hide typing indicator when actual content arrives
        hideTypingIndicator();
        
        if (chunk.startsWith("[ADMIN]")) {
            isAdminMessage = true;
        }
        
        if (!currentBotMsg) {
            currentBotMsg = document.createElement("div");
            currentBotMsg.className = isAdminMessage ? "admin-message message" : "bot-message message";
            messagesContainer.appendChild(currentBotMsg);
        }
        
        let cleanChunk = chunk.replace("[ADMIN]", "").replace("[END]", "");
        // Convert escaped newlines from backend to actual newlines (double escaped for template literal)
        cleanChunk = cleanChunk.replace(/\\\\n/g, '\\n').replace(/\\\\r/g, '\\r');
        buffer += cleanChunk;
        
        
        // Update message content with markdown during streaming (lightweight)
        renderStreamingMarkdown(buffer, currentBotMsg);
        
        // Send streaming update to parent window if fullscreen mode is active
        if (window.fullscreenUpdatesEnabled) {
            window.parent.postMessage({
                type: 'chat-update',
                message: buffer,
                streaming: true
            }, '*');
        }
        
        if (chunk === "[END]") {
            buffer = buffer.replace("[END]", "");
            
            // Step 1: Extract and store commands, images, and links with placeholders
            const cmdRegex = /\\[CMD:([\\s\\S]*?)\\]/g;
            const extractedParts = {
                commands: [],
                images: [],
                links: []
            };
            let placeholderIndex = 0;
            
            // Extract commands and replace with placeholders
            let processedText = buffer.replace(cmdRegex, function(match) {
                extractedParts.commands.push(match);
                return '';  // Remove commands completely
            });
            
            // Trim trailing whitespace to prevent unnecessary newlines
            processedText = processedText.trimEnd();
            
            // Apply markdown rendering - let markdown-it handle everything
            currentBotMsg.innerHTML = '';
            let finalHtml = '';
            
            if (md) {
                try {
                    finalHtml = md.render(processedText);
                } catch (e) {
                    console.error('Markdown-it error:', e);
                    finalHtml = processedText;
                }
            } else {
                finalHtml = processedText;
            }
            
            // Apply final HTML sanitization and remove trailing whitespace
            finalHtml = sanitizeHtml(finalHtml);
            // Remove trailing whitespace, empty paragraphs, and extra line breaks
            finalHtml = finalHtml.replace(/\\s+<\\/p>$/g, '</p>').replace(/<br\\s*\\/?>\\s*$/g, '').replace(/\\s+$/g, '');
            currentBotMsg.innerHTML = finalHtml;
            
            // Step 8: Process commands only (images are already in the content)
            processMessage(buffer, currentBotMsg);
            
            // Handle TTS
            if (!isAdminMessage && userInteracted) {
                const ttsText = buffer.replace(/\\[CMD:([\\s\\S]*?)\\]/g, "").trim();
                if (ttsText) fetchSpeech(ttsText);
            }
            
            // Reset
            buffer = "";
            currentBotMsg = null;
            isAdminMessage = false;
            isCanvasActive = false;
            
            input.disabled = false;
            sendButton.disabled = false;
            if (!disableAutoFocus) {
                input.focus({ preventScroll: true });
            }
            
            // Send final bot response to parent window if fullscreen mode is active
            if (window.fullscreenUpdatesEnabled) {
                window.parent.postMessage({
                    type: 'bot-response',
                    message: buffer,
                    streaming: false
                }, '*');
            }
            
            // Deduct credits
            if (messageCostsEnabled) {
                window.parent.postMessage({ type: 'message-consumed' }, '*');
            }
            
            // Clean up EventSource
            eventSource.close();
            window.currentEventSource = null;
            console.log("🔍 EventSource connection closed after completion");
        }
        
        scrollToBottom();
    };
    
    eventSource.onerror = function() {
        hideTypingIndicator();
        if (window.HybridAIWidget) {
            window.HybridAIWidget.hideFullscreenTypingIndicator();
        }
        if (currentBotMsg && buffer) {
            // Apply same processing as final output in case of error
            const cmdRegex = /\\[CMD:([\\s\\S]*?)\\]/g;
            const extractedParts = {
                commands: [],
                images: [],
                links: []
            };
            let placeholderIndex = 0;
            
            // Extract commands and replace with placeholders
            let processedText = buffer.replace(cmdRegex, function(match) {
                extractedParts.commands.push(match);
                return '';  // Remove commands completely
            });
            
            // Trim trailing whitespace to prevent unnecessary newlines
            processedText = processedText.trimEnd();
            
            // Apply markdown rendering - let markdown-it handle everything
            currentBotMsg.innerHTML = '';
            let finalHtml = '';
            
            if (md) {
                try {
                    finalHtml = md.render(processedText);
                } catch (e) {
                    console.error('Markdown-it error in error handler:', e);
                    finalHtml = processedText;
                }
            } else {
                finalHtml = processedText;
            }
            
            // Apply final HTML sanitization and remove trailing whitespace
            finalHtml = sanitizeHtml(finalHtml);
            // Remove trailing whitespace, empty paragraphs, and extra line breaks
            finalHtml = finalHtml.replace(/\\s+<\\/p>$/g, '</p>').replace(/<br\\s*\\/?>\\s*$/g, '').replace(/\\s+$/g, '');
            currentBotMsg.innerHTML = finalHtml;
            
            // Step 8: Process commands only (images are already in the content)
            processMessage(buffer, currentBotMsg);
            
            // Handle TTS
            if (!isAdminMessage && userInteracted) {
                const ttsText = buffer.replace(/\\[CMD:([\\s\\S]*?)\\]/g, "").trim();
                if (ttsText) fetchSpeech(ttsText);
            }
            
            // Reset
            buffer = "";
            currentBotMsg = null;
            isAdminMessage = false;
            isCanvasActive = false;
            
            input.disabled = false;
            sendButton.disabled = false;
            if (!disableAutoFocus) {
                input.focus({ preventScroll: true });
            }
            
            // Deduct credits
            if (messageCostsEnabled) {
                window.parent.postMessage({ type: 'message-consumed' }, '*');
            }
        }
        
        scrollToBottom();
    };
});

// Lightweight markdown rendering for streaming (no heavy text processing)
function renderStreamingMarkdown(text, element) {
    if (md) {
        try {
            let html = md.render(text.trimEnd());
            // Remove trailing whitespace from HTML
            html = html.replace(/\\s+<\\/p>$/g, '</p>').replace(/<br\\s*\\/?>\\s*$/g, '').replace(/\\s+$/g, '');
            element.innerHTML = html;
        } catch (e) {
            console.error('Markdown-it error during streaming:', e);
            element.textContent = text;
        }
    } else {
        // Fallback if markdown-it not loaded
        element.textContent = text;
    }
}

// Fix table formatting by ensuring markdown-it can properly parse lists
function fixTableFormatting(text) {
    // Let markdown-it handle all formatting automatically
    return text;
}

// Fix list formatting to ensure markdown-it can properly parse lists
function fixListFormatting(text) {
    // Let markdown-it handle all formatting automatically
    return text;
}

// Final HTML sanitization - let markdown-it handle all formatting, no additional cleanup needed
function sanitizeHtml(html) {
    // Let markdown-it handle all formatting, no additional cleanup needed
    return html;
}

// Helper function to render markdown with proper link handling
function renderMarkdownWithLinks(text, element, applyFormatting = false) {
    // Let markdown-it handle all formatting
    const processedText = text.trimEnd();
    
    if (md) {
        try {
            let html = md.render(processedText);
            element.innerHTML = html;
        } catch (e) {
            console.error('Markdown-it error:', e);
            // Fallback to simple text
            element.textContent = processedText;
        }
    } else {
        // If markdown-it is not loaded yet, try to initialize it
        if (!initializeMarkdownIt()) {
            // Fallback: simple text
            element.textContent = processedText;
        } else {
            // Try again with markdown-it now loaded
            renderMarkdownWithLinks(text, element, applyFormatting);
        }
    }
    // Links will be handled by event delegation in DOMContentLoaded
}



// Process message for commands and images
function processMessage(text, msgElement) {
    console.log("🔍 Processing message for commands:", text.substring(0, 100) + "...");
    
    // Extract and execute commands
    const cmdRegex = /\\[CMD:([\\s\\S]*?)\\]/g;
    let match;
    while ((match = cmdRegex.exec(text)) !== null) {
        const command = match[1].trim();
        console.log("🔍 Found command:", command);
        window.parent.postMessage({ "website-command": command }, "*");
    }
    
    // Images are now handled by markdown-it through standard markdown syntax
    // No need for separate image regex processing
}

// Input auto-resize and toggle between mic/send button
const chatInput = document.getElementById("chat-input");
const actionToggle = document.querySelector(".action-toggle");

// Function to toggle mic/send button
function toggleMicSendButton() {
    if (!actionToggle) return;
    
    const inputValue = chatInput.value.trim();
    const hasText = inputValue.length > 0;
    
    // Update class and force DOM update for better mobile compatibility
    if (hasText) {
        actionToggle.classList.add("has-text");
    } else {
        actionToggle.classList.remove("has-text");
    }
    
    // Additional mobile-specific handling to ensure visibility changes
    const micButton = actionToggle.querySelector('.mic-toggle');
    const sendButton = actionToggle.querySelector('.send-button');
    
    if (micButton && sendButton) {
        // Explicitly control visibility for mobile browsers
        if (hasText) {
            micButton.style.display = 'none';
            sendButton.style.display = 'flex';
        } else {
            micButton.style.display = 'block';
            sendButton.style.display = 'none';
        }
    }
}

// Handle input changes with multiple event types for better mobile support
chatInput.addEventListener("input", function() {
    this.style.height = "auto";
    this.style.height = this.scrollHeight + "px";
    toggleMicSendButton();
});

// Additional event listeners for mobile devices
chatInput.addEventListener("keyup", toggleMicSendButton);
chatInput.addEventListener("paste", function() {
    // Use setTimeout to wait for paste content to be processed
    setTimeout(toggleMicSendButton, 10);
});

// Handle focus/blur events for mobile keyboards
chatInput.addEventListener("focus", function() {
    // Ensure correct state when input is focused
    setTimeout(toggleMicSendButton, 100);
});

chatInput.addEventListener("blur", function() {
    // Ensure correct state when input loses focus
    setTimeout(toggleMicSendButton, 100);
});

// Enter key handling
chatInput.addEventListener("keydown", function(e) {
    if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        const form = document.getElementById("chat-form");
        form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    }
});

// Mic button with double-click detection
const micBtn = document.getElementById("enable-mic");
if (micBtn) {
    micBtn.addEventListener("click", function(e) {
        e.preventDefault();
        
        clickCount++;
        console.log('Mic button clicked, clickCount:', clickCount, 'isHoldToTalkMode:', isHoldToTalkMode);
        
        if (clickCount === 1) {
            // Start timer for single click
            clickTimer = setTimeout(function() {
                console.log('Single click timeout triggered, calling startRecording');
                // Single click - toggle based on current mode
                // Always use startRecording, it handles both modes internally
                startRecording();
                clickCount = 0;
            }, 250); // 250ms delay to detect double click
        } else if (clickCount === 2) {
            // Double click detected - switch modes
            console.log('Double click detected, clearing timer and switching modes');
            clearTimeout(clickTimer);
            clickCount = 0;
            
            // Toggle recording mode
            isHoldToTalkMode = !isHoldToTalkMode;
            
            // Update UI to show mode change
            if (!isHoldToTalkMode) {
                micBtn.classList.add('continuous-mode');
                micBtn.title = "Continuous recording mode - Click to stop";
                console.log("Switched to continuous recording mode and starting recording");
                // Immediately start recording when switching to continuous mode
                startRecording();
            } else {
                micBtn.classList.remove('continuous-mode');
                micBtn.classList.remove('listening');
                micBtn.title = "Voice input";
                console.log("Switched to hold-to-talk mode");
                
                // If recording was active, stop it
                if (mediaRecorder && mediaRecorder.state === "recording") {
                    mediaRecorder.stop();
                }
            }
        }
    });
}

// Message listener from parent
window.addEventListener('message', function(event) {
    // Handle visibility-triggered welcome message
    if (event.data && event.data.type === 'trigger-welcome-message') {
        // Only trigger if not already sent
        if (!window.welcomeMessageTriggered && !window.welcomeMessageSent) {
            window.welcomeMessageTriggered = true;

            const isFirefox = navigator.userAgent.toLowerCase().includes("firefox");
            const messagesContainer = document.getElementById("chat-messages");

            // Handle JS config welcome message (display directly)
            if (window.customWelcomeMessage && window.customWelcomeMessage.trim() !== '') {
                const welcomeMsg = document.createElement("div");
                welcomeMsg.className = "bot-message message";
                welcomeMsg.textContent = window.customWelcomeMessage;
                messagesContainer.appendChild(welcomeMsg);
            } else if (!isFirefox && window.templateWelcomeMessage && window.templateWelcomeMessage.trim() !== '') {
                // Send server welcome message to LLM (not Firefox)
                setTimeout(() => {
                    // Double-check to prevent race conditions
                    if (window.welcomeMessageSent) {
                        return;
                    }

                    const now = new Date();
                    const dateStr = now.toLocaleDateString('de-DE', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    });

                    const input = document.getElementById("chat-input");

                    // Build context information if available
                    let contextInfo = '';
                    if (context) {
                        let contextText = '';

                        if (typeof context === 'string' && context.trim() !== '') {
                            contextText = context;
                        } else if (typeof context === 'object' && context !== null) {
                            // Handle object format (e.g., from WordPress)
                            if (context.custom_context) {
                                contextText = context.custom_context;
                            } else {
                                // Try to convert object to string representation
                                contextText = Object.values(context).join(', ');
                            }
                        }

                        if (contextText.trim() !== '') {
                            contextInfo = ' Kontext: ' + contextText + '.';
                        }
                    }

                    input.value = 'Heute ist ' + dateStr + ', die eingestellte Sprache ist lang:' + navigator.language + contextInfo + ' ' + window.templateWelcomeMessage + '. Verwende Smileys und halte Dich kurz.';
                    // Set flag before sending to prevent loops
                    window.welcomeMessageSent = true;

                    const form = document.getElementById("chat-form");
                    // Temporarily override appendChild to hide the user message
                    const origAppend = messagesContainer.appendChild;
                    messagesContainer.appendChild = function(el) {
                        if (!el.classList.contains("user-message")) {
                            origAppend.call(this, el);
                        }
                    };

                    // Submit the form
                    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));

                    // Restore original appendChild
                    messagesContainer.appendChild = origAppend;

                    // Clear input
                    input.value = "";
                    const actionToggle = document.querySelector(".action-toggle");
                    if (actionToggle) actionToggle.classList.remove("has-text");
                }, 500);
            }
        }
        return;
    }

    if (event.data && event.data.type === 'toggle-audio') {
        // Toggle the current state
        userInteracted = !userInteracted;
        localStorage.setItem("sound_enabled", userInteracted.toString());
        localStorage.setItem("hybridai_audio_enabled", userInteracted.toString());
        
        // Update audio toggle button if it exists
        const audioToggle = document.querySelector('#audio-toggle');
        if (audioToggle) {
            audioToggle.innerHTML = userInteracted ? '🔊' : '🔇';
        }
        
        if (!userInteracted) {
            stopCurrentAudio();
            if (audioContext) {
                audioContext.close();
                audioContext = null;
            }
        }
    } else if (event.data && event.data.type === 'change-font-size') {
        // Handle font size change
        const delta = event.data.delta || 0;
        const currentSize = parseInt(localStorage.getItem('hybridai_font_size')) || parseInt(document.body.style.fontSize) || 14;
        const newSize = Math.max(10, Math.min(20, currentSize + delta));
        
        // Create or update dynamic style element
        let styleElement = document.getElementById('dynamic-font-style');
        if (!styleElement) {
            styleElement = document.createElement('style');
            styleElement.id = 'dynamic-font-style';
            document.head.appendChild(styleElement);
        }
        
        // Create comprehensive CSS rules with !important to override existing styles
        const css = \`
            body { 
                font-size: \${newSize}px !important; 
            }
            .message,
            .bot-message,
            .user-message,
            .admin-message { 
                font-size: \${newSize}px !important; 
            }
            .bot-message p,
            .bot-message li,
            .bot-message ul,
            .bot-message ol { 
                font-size: \${newSize}px !important; 
            }
            .message ul,
            .message ol,
            .message li,
            .message p {
                font-size: \${newSize}px !important;
            }
            #chat-input { 
                font-size: \${newSize}px !important; 
            }
            #send-button,
            .send-button,
            .icon-button { 
                font-size: \${Math.max(12, newSize)}px !important; 
            }
            .default-message-btn { 
                font-size: \${Math.max(12, newSize - 2)}px !important; 
            }
            #chat-messages {
                font-size: \${newSize}px !important;
            }
            .bot-message h1 { font-size: \${Math.round(newSize * 1.5)}px !important; }
            .bot-message h2 { font-size: \${Math.round(newSize * 1.3)}px !important; }
            .bot-message h3 { font-size: \${Math.round(newSize * 1.2)}px !important; }
            .bot-message h4 { font-size: \${Math.round(newSize * 1.1)}px !important; }
            .bot-message h5 { font-size: \${newSize}px !important; }
            .bot-message h6 { font-size: \${Math.round(newSize * 0.9)}px !important; }
            .bot-message code { 
                font-size: \${Math.round(newSize * 0.9)}px !important; 
            }
            .bot-message pre code { 
                font-size: \${Math.round(newSize * 0.9)}px !important; 
            }
            #typing-indicator {
                font-size: \${newSize}px !important;
            }
        \`;
        
        styleElement.textContent = css;
        
        // Save preference
        localStorage.setItem('hybridai_font_size', newSize.toString());
        
        console.log('Font size changed to:', newSize + 'px');
    } else if (event.data && event.data.type === 'focus-input') {
        if (!disableAutoFocus) {
            const chatInput = document.querySelector('#chat-input');
            if (chatInput) {
                chatInput.focus({ preventScroll: true });
            }
        }
    } else if (event.data && event.data.type === 'send-message') {
        // Handle message from fullscreen mode
        const message = event.data.message;
        if (message && message.trim()) {
            const chatInput = document.querySelector('#chat-input');
            if (chatInput) {
                chatInput.value = message;
                // Trigger send using form submission
                const form = document.getElementById("chat-form");
                if (form) {
                    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
                }
            }
        }
    } else if (event.data && event.data.type === 'enable-message-updates') {
        // Enable sending updates back to parent
        window.fullscreenUpdatesEnabled = true;
        console.log('Fullscreen message updates enabled');
    } else if (event.data && event.data.type === 'get-chat-content') {
        // Send current chat content to parent
        const chatMessages = document.querySelector('#chat-messages');
        if (chatMessages) {
            window.parent.postMessage({
                type: 'chat-content-response',
                content: chatMessages.innerHTML
            }, '*');
        }
    }
});

// Initialize
waitForWidgetReady(function() {
    // Initialize font size from localStorage
    const savedFontSize = localStorage.getItem('hybridai_font_size');
    if (savedFontSize) {
        const fontSize = parseInt(savedFontSize);
        document.body.style.fontSize = fontSize + 'px';
    }
    renderDefaultMessages();
    if (typeof setupFileUpload === 'function') setupFileUpload();
    // Delegate click events for links to ensure they open in new tabs
    document.body.addEventListener('click', function (event) {
        const link = event.target.closest('a');
        if (link && link.href) {
            link.setAttribute('target', '_blank');
            link.setAttribute('rel', 'noopener noreferrer');
        }
    });
    // Handle welcome message
    const isFirefox = navigator.userAgent.toLowerCase().includes("firefox");
    const messagesContainer = document.getElementById("chat-messages");

    // Skip welcome message entirely for snapped-out widgets or when configured to skip
    if (skipWelcomeMessage) {
        console.log("Skipping welcome message (will be triggered on visibility)");
        return;
    }

    // Get welcome message sources (using variables defined earlier in template)
    // templateWelcomeMessage is already defined above
    // jsCustomWelcomeMessage is already defined above

    // For non-skipped widgets, show welcome message immediately
    if (window.customWelcomeMessage && window.customWelcomeMessage.trim() !== '') {
        const welcomeMsg = document.createElement("div");
        welcomeMsg.className = "bot-message message";
        welcomeMsg.textContent = window.customWelcomeMessage;
        messagesContainer.appendChild(welcomeMsg);
    } else if (!isFirefox && window.templateWelcomeMessage && window.templateWelcomeMessage.trim() !== '') {
        // Send server welcome message to LLM (not Firefox)
        setTimeout(() => {
            // Double-check to prevent race conditions
            if (window.welcomeMessageSent) {
                return;
            }
            
            const now = new Date();
            const dateStr = now.toLocaleDateString('de-DE', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            
            const input = document.getElementById("chat-input");
            
            // Build context information if available
            let contextInfo = '';
            if (context) {
                let contextText = '';
                
                if (typeof context === 'string' && context.trim() !== '') {
                    contextText = context;
                } else if (typeof context === 'object' && context !== null) {
                    // Handle object format (e.g., from WordPress)
                    if (context.custom_context) {
                        contextText = context.custom_context;
                    } else {
                        // Try to convert object to string representation
                        contextText = Object.values(context).join(', ');
                    }
                }
                
                if (contextText.trim() !== '') {
                    contextInfo = ' Kontext: ' + contextText + '.';
                }
            }
            
            input.value = 'Heute ist ' + dateStr + ', die eingestellte Sprache ist lang:' + navigator.language + contextInfo + ' ' + window.templateWelcomeMessage + '. Verwende Smileys und halte Dich kurz.';
            // Set flag before sending to prevent loops
            window.welcomeMessageSent = true;
            
            const form = document.getElementById("chat-form");
            // Temporarily override appendChild to hide the user message
            const origAppend = messagesContainer.appendChild;
            messagesContainer.appendChild = function(el) {
                if (!el.classList.contains("user-message")) {
                    origAppend.call(this, el);
                }
            };
            
            // Submit the form
            form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
            
            // Restore original appendChild
            messagesContainer.appendChild = origAppend;
            
            // Clear input
            input.value = "";
            const actionToggle = document.querySelector(".action-toggle");
            if (actionToggle) actionToggle.classList.remove("has-text");
        }, 500);
    }
    // ... existing code for mobile viewport handling ...
    if (typeof handleMobileViewport === 'function') handleMobileViewport();
});

// Functions for state management (snap-out/snap-in functionality)
window.getChatState = function() {
    const messagesContainer = document.getElementById('chat-messages');
    const chatInput = document.getElementById('chat-input');
    
    // Get all messages
    const messages = [];
    if (messagesContainer) {
        const messageElements = messagesContainer.querySelectorAll('.message');
        messageElements.forEach(msgEl => {
            if (!msgEl.classList.contains('default-messages')) {
                messages.push({
                    content: msgEl.innerHTML,
                    type: msgEl.classList.contains('user-message') ? 'user' : 
                          msgEl.classList.contains('admin-message') ? 'admin' : 'bot',
                    className: msgEl.className
                });
            }
        });
    }
    
    return {
        messages: messages,
        inputValue: chatInput ? chatInput.value : '',
        scrollPosition: messagesContainer ? messagesContainer.scrollTop : 0
    };
};

window.setChatState = function(state) {
    const messagesContainer = document.getElementById('chat-messages');
    const chatInput = document.getElementById('chat-input');
    
    if (!state) return;
    
    // Clear existing messages except default messages
    if (messagesContainer) {
        const defaultMessages = messagesContainer.querySelector('.default-messages');
        messagesContainer.innerHTML = '';
        if (defaultMessages) {
            messagesContainer.appendChild(defaultMessages);
        }
        
        // Restore messages
        if (state.messages && state.messages.length > 0) {
            state.messages.forEach(msg => {
                const msgEl = document.createElement('div');
                msgEl.className = msg.className;
                msgEl.innerHTML = msg.content;
                messagesContainer.appendChild(msgEl);
            });
        }
        
        // Restore scroll position
        if (typeof state.scrollPosition === 'number') {
            setTimeout(() => {
                messagesContainer.scrollTop = state.scrollPosition;
            }, 50);
        }
    }
    
    // Restore input value
    if (chatInput && state.inputValue) {
        chatInput.value = state.inputValue;
        // Update action toggle state
        const actionToggle = document.querySelector('.action-toggle');
        if (actionToggle) {
            if (state.inputValue.trim().length > 0) {
                actionToggle.classList.add('has-text');
            } else {
                actionToggle.classList.remove('has-text');
            }
        }
    }
    
    console.log('Chat state restored:', state);
};
`;
        },
        
        // Handle iframe load
        onIframeLoad(iframe) {
            const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
            
            // Apply custom styles if needed
            if (this.config.customStyles) {
                const customStyle = iframeDoc.createElement('style');
                customStyle.textContent = this.config.customStyles;
                iframeDoc.head.appendChild(customStyle);
            }
            
            // Apply saved font size if any
            const savedFontSize = localStorage.getItem('hybridai_font_size');
            if (savedFontSize) {
                // Force apply the font size to ensure it takes effect
                this.changeFontSize(0); // This will apply the saved size
            }
            
            console.log("HybridAI Widget: Iframe loaded");
        },
        
        // Set window position
        setWindowPosition(container) {
            const position = this.config.position;
            const marginX = this.config.marginX;
            const marginY = this.config.marginY;
            
            // Get position offset if configured
            const offsetTop = this.config.positionOffset?.top || 0;
            const offsetLeft = this.config.positionOffset?.left || 0;
            
            // Reset all position styles
            container.style.top = '';
            container.style.right = '';
            container.style.bottom = '';
            container.style.left = '';
            container.style.transform = '';
            
            switch (position) {
                case 'bottom-right':
                    container.style.bottom = `calc(${marginY} - ${offsetTop}px)`;
                    container.style.right = `calc(${marginX} - ${offsetLeft}px)`;
                    break;
                case 'bottom-left':
                    container.style.bottom = `calc(${marginY} - ${offsetTop}px)`;
                    container.style.left = `calc(${marginX} + ${offsetLeft}px)`;
                    break;
                case 'top-right':
                    container.style.top = `calc(${marginY} + ${offsetTop}px)`;
                    container.style.right = `calc(${marginX} - ${offsetLeft}px)`;
                    break;
                case 'top-left':
                    container.style.top = `calc(${marginY} + ${offsetTop}px)`;
                    container.style.left = `calc(${marginX} + ${offsetLeft}px)`;
                    break;
                case 'center':
                    // Check if using viewport units (vw/vh) for full-screen mode
                    if (this.config.width === '100vw' && this.config.height === '100vh') {
                        // For full viewport, just position at 0,0
                        container.style.top = '0';
                        container.style.left = '0';
                    } else {
                        // For center position with fixed dimensions
                        const width = parseInt(this.config.width);
                        const height = parseInt(this.config.height);
                        // Use max() to ensure the widget never goes above 20px from top
                        container.style.top = `max(20px, calc(50% - ${height / 2}px + ${offsetTop}px))`;
                        container.style.left = `calc(50% - ${width / 2}px + ${offsetLeft}px)`;
                    }
                    break;
            }
        },
        
        // Setup dragging functionality
        setupDragging(container, handle) {
            if (this.isMobile()) return;
            
            let isDragging = false;
            let hasMoved = false;
            let startX, startY;
            let startLeft, startTop;
            const DRAG_THRESHOLD = 5; // Minimum pixels to move before starting drag
            
            const dragStart = (e) => {
                // Don't start drag if clicking on controls or resize handle
                if (e.target.closest('.hybridai-control-button') || 
                    e.target.closest('.hybridai-resize-handle')) return;
                
                if (e.target === handle || handle.contains(e.target)) {
                    // Mark potential drag start but don't actually start dragging yet
                    isDragging = false;
                    hasMoved = false;
                    
                    // Get current position
                    const rect = container.getBoundingClientRect();
                    startLeft = rect.left;
                    startTop = rect.top;
                    
                    if (e.type === "touchstart") {
                        startX = e.touches[0].clientX;
                        startY = e.touches[0].clientY;
                    } else {
                        startX = e.clientX;
                        startY = e.clientY;
                    }
                    
                    // Add temporary drag listeners
                    if (e.type === "touchstart") {
                        document.addEventListener('touchmove', checkDragThreshold, { passive: false });
                        document.addEventListener('touchend', dragEnd);
                    } else {
                        document.addEventListener('mousemove', checkDragThreshold);
                        document.addEventListener('mouseup', dragEnd);
                    }
                }
            };
            
            const checkDragThreshold = (e) => {
                if (isDragging) {
                    drag(e);
                    return;
                }
                
                let currentX, currentY;
                if (e.type === "touchmove") {
                    currentX = e.touches[0].clientX;
                    currentY = e.touches[0].clientY;
                } else {
                    currentX = e.clientX;
                    currentY = e.clientY;
                }
                
                const deltaX = Math.abs(currentX - startX);
                const deltaY = Math.abs(currentY - startY);
                
                // Check if we've moved beyond the threshold
                if (deltaX > DRAG_THRESHOLD || deltaY > DRAG_THRESHOLD) {
                    isDragging = true;
                    hasMoved = true;
                    container.style.transition = 'none';
                    handle.style.cursor = 'grabbing';
                    
                    // Clear any position styles and use left/top
                    container.style.bottom = '';
                    container.style.right = '';
                    container.style.transform = '';
                    
                    // Immediately process this move
                    drag(e);
                }
            };
            
            const dragEnd = () => {
                if (hasMoved) {
                    container.style.transition = '';
                    handle.style.cursor = 'move';
                }
                
                isDragging = false;
                hasMoved = false;
                
                // Remove temporary listeners
                document.removeEventListener('mousemove', checkDragThreshold);
                document.removeEventListener('mouseup', dragEnd);
                document.removeEventListener('touchmove', checkDragThreshold);
                document.removeEventListener('touchend', dragEnd);
            };
            
            const drag = (e) => {
                if (!isDragging) return;
                
                e.preventDefault();
                
                let currentX, currentY;
                if (e.type === "touchmove") {
                    currentX = e.touches[0].clientX;
                    currentY = e.touches[0].clientY;
                } else {
                    currentX = e.clientX;
                    currentY = e.clientY;
                }
                
                const deltaX = currentX - startX;
                const deltaY = currentY - startY;
                
                // Update position using left/top instead of transform
                container.style.left = (startLeft + deltaX) + 'px';
                container.style.top = (startTop + deltaY) + 'px';
            };
            
            // Only add the initial event listeners to the handle
            handle.addEventListener('mousedown', dragStart);
            handle.addEventListener('touchstart', dragStart, { passive: false });
        },
        
        // Setup manual resize for browsers that need it
        setupManualResize(container, handle, direction) {
            let isResizing = false;
            let startX, startY, startWidth, startHeight, startLeft, startTop;
            
            const doResize = (e) => {
                if (!isResizing) return;
                e.preventDefault();
                e.stopPropagation();
                
                let currentX, currentY;
                if (e.type === "touchmove") {
                    currentX = e.touches[0].clientX;
                    currentY = e.touches[0].clientY;
                } else {
                    currentX = e.clientX;
                    currentY = e.clientY;
                }
                
                const deltaX = currentX - startX;
                const deltaY = currentY - startY;
                let newWidth, newHeight, newLeft, newTop;
                
                if (direction === 'bottom-right') {
                    newWidth = Math.max(350, Math.min(window.innerWidth * 0.9, startWidth + deltaX));
                    newHeight = Math.max(400, Math.min(window.innerHeight - 40, startHeight + deltaY));
                    newLeft = startLeft;
                    newTop = startTop;
                } else if (direction === 'top-left') {
                    newWidth = Math.max(350, Math.min(window.innerWidth * 0.9, startWidth - deltaX));
                    newHeight = Math.max(400, Math.min(window.innerHeight - 40, startHeight - deltaY));
                    newLeft = Math.max(0, startLeft + (startWidth - newWidth));
                    newTop = Math.max(0, startTop + (startHeight - newHeight));
                }
                
                container.style.width = newWidth + 'px';
                container.style.height = newHeight + 'px';
                container.style.left = newLeft + 'px';
                container.style.top = newTop + 'px';
                container.style.right = 'auto';
                container.style.bottom = 'auto';
            };
            
            const stopResize = (e) => {
                if (!isResizing) return;
                isResizing = false;
                container.classList.remove('actively-resizing');
                document.documentElement.style.cursor = '';
                document.body.style.userSelect = '';
                document.removeEventListener('mousemove', doResize);
                document.removeEventListener('mouseup', stopResize);
                document.removeEventListener('touchmove', doResize);
                document.removeEventListener('touchend', stopResize);
                if (e) {
                    e.preventDefault();
                    e.stopPropagation();
                }
            };
            
            const initResize = (e) => {
                // Prevent if already dragging
                if (container.classList.contains('actively-dragging')) return;
                
                isResizing = true;
                if (e.type === "touchstart") {
                    startX = e.touches[0].clientX;
                    startY = e.touches[0].clientY;
                } else {
                    startX = e.clientX;
                    startY = e.clientY;
                }
                
                const rect = container.getBoundingClientRect();
                startWidth = rect.width;
                startHeight = rect.height;
                startLeft = rect.left;
                startTop = rect.top;
                
                container.classList.add('actively-resizing');
                document.documentElement.style.cursor = direction === 'bottom-right' ? 'nwse-resize' : 'nwse-resize';
                document.body.style.userSelect = 'none';
                
                document.addEventListener('mousemove', doResize);
                document.addEventListener('mouseup', stopResize);
                document.addEventListener('touchmove', doResize, { passive: false });
                document.addEventListener('touchend', stopResize);
                
                e.preventDefault();
                e.stopPropagation();
            };
            
            handle.addEventListener('mousedown', initResize);
            handle.addEventListener('touchstart', initResize, { passive: false });
            
            // Store cleanup function
            handle._cleanupResize = () => {
                handle.removeEventListener('mousedown', initResize);
                handle.removeEventListener('touchstart', initResize);
                document.removeEventListener('mousemove', doResize);
                document.removeEventListener('mouseup', stopResize);
                document.removeEventListener('touchmove', doResize);
                document.removeEventListener('touchend', stopResize);
            };
        },
        
        // Toggle chat window
        toggleChat() {
            if (!this.state.chatWindow) {
                this.createChatWindow();
            }
            
            const isVisible = this.state.chatWindow.style.display === 'block';
            if (isVisible) {
                this.hideChat();
            } else {
                this.showChatWindow();
            }
        },
        
        // Show chat window
        showChatWindow() {
            if (!this.state.chatWindow) {
                this.createChatWindow();
            }

            // Clear any pending auto-shrink timer
            if (this.autoShrinkTimer) {
                clearTimeout(this.autoShrinkTimer);
                this.autoShrinkTimer = null;
            }

            // Stop pulse animation when chat opens
            if (this.state.chatButton) {
                this.state.chatButton.classList.remove('pulse');
                // Hide the chat button when window is shown
                this.state.chatButton.style.setProperty('display', 'none', 'important');
            }

            this.state.chatWindow.style.display = 'block';

            // Update privacy indicator when showing chat
            this.updatePrivacyIndicator();
            
            setTimeout(() => {
            this.state.chatWindow.classList.add('visible');
            
            // Focus input
            const iframe = this.state.chatWindow.querySelector('.hybridai-chat-iframe');
            if (iframe) {
                    iframe.contentWindow.postMessage({ type: 'focus-input' }, '*');
            }
            }, 50);
        },
        
        // Hide chat
        hideChat() {
            if (!this.state.chatWindow) return;

            this.state.chatWindow.classList.remove('visible');
            setTimeout(() => {
            this.state.chatWindow.style.display = 'none';

            // Show the chat button again when window is hidden
            if (this.state.chatButton) {
                this.state.chatButton.style.setProperty('display', 'flex', 'important');

                // Check if widget was previously shrunk
                const wasShrunk = localStorage.getItem('hybridai_widget_shrunk') === 'true';

                // For avatar buttons, the actual button is a child element
                // For standard buttons, this.state.chatButton IS the button
                const avatarButton = this.state.chatButton.querySelector('.hybridai-avatar-button');
                const isAvatar = !!avatarButton;
                const button = isAvatar ? avatarButton : this.state.chatButton;

                if (wasShrunk) {
                    // Always respect the saved shrink state
                    console.log('HybridAI: Re-applying shrink state after chat close');
                    if (isAvatar) {
                        button.classList.add('hybridai-avatar-auto-shrink');
                    } else {
                        button.classList.add('hybridai-auto-shrink');
                    }
                }
                // Note: We don't auto-shrink anymore after user has opened the chat
                // The shrink state is only set during initial page load or manually by user
            }
            }, 300);
        },
        
        // Toggle audio
        toggleAudio(button) {
            const isEnabled = localStorage.getItem("sound_enabled") === "true";
            const newState = !isEnabled;
            
            localStorage.setItem("sound_enabled", newState.toString());
            button.innerHTML = newState ? '🔊' : '🔇';
            
            // Notify iframe
            if (this.state.chatWindow) {
                const iframe = this.state.chatWindow.querySelector('.hybridai-chat-iframe');
                if (iframe) {
                    iframe.contentWindow.postMessage({
                        type: 'toggle-audio',
                        state: newState ? 'unmuted' : 'muted'
                    }, '*');
                }
            }
        },
        
        // Toggle menu
        toggleMenu(event, button) {
            event.stopPropagation();
            
            // Remove existing menu if any
            const existingMenu = document.querySelector('.hybridai-dropdown-menu');
            if (existingMenu) {
                existingMenu.remove();
                return;
            }
            
            // Create dropdown menu
            const menu = document.createElement('div');
            menu.className = 'hybridai-dropdown-menu';
            menu.style.cssText = `
                position: absolute;
                top: 30px;
                right: 5px;
                background: ${this.config.theme === 'dark' ? '#2a2a2a' : '#fff'};
                border: 1px solid ${this.config.theme === 'dark' ? '#444' : '#ddd'};
                border-radius: 4px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.2);
                z-index: 10001;
                min-width: 150px;
            `;
            
            // Menu items
            const menuItems = [
                { text: 'Show Memory', action: () => this.showMemoryModal() },
                { text: 'Chat History', action: () => this.showChatHistoryModal() }
            ];
            
            // Add privacy controls if allowed
            if (this.config.allowPrivacyToggle && !this.config.trackingDisabled) {
                // Add separator
                menuItems.push({ text: '---', isSeparator: true });
                
                // Add privacy mode options - simplified for users
                if (this.state.currentPrivacyMode !== 'private') {
                    menuItems.push({ 
                        text: '🔒 Private Mode', 
                        action: () => this.setPrivacyMode('private'),
                        description: 'No data stored'
                    });
                }
                
                if (this.state.currentPrivacyMode === 'private') {
                    menuItems.push({ 
                        text: '📊 Normal Mode', 
                        action: () => this.setPrivacyMode('normal'),
                        description: 'Standard mode'
                    });
                }
            }
            
            menuItems.push({ text: 'Minimize', action: () => this.hideChat() });
            
            menuItems.forEach(item => {
                // Handle separator
                if (item.isSeparator) {
                    const separator = document.createElement('hr');
                    separator.style.cssText = `
                        margin: 4px 0;
                        border: none;
                        border-top: 1px solid ${this.config.theme === 'dark' ? '#444' : '#ddd'};
                    `;
                    menu.appendChild(separator);
                    return;
                }
                
                const menuItem = document.createElement('button');
                menuItem.style.cssText = `
                    display: block;
                    width: 100%;
                    padding: 8px 16px;
                    border: none;
                    background: none;
                    text-align: left;
                    cursor: pointer;
                    color: ${this.config.theme === 'dark' ? '#e0e0e0' : '#333'};
                    font-size: 14px;
                    transition: background 0.2s;
                `;
                
                // Add text with optional description
                if (item.description) {
                    menuItem.innerHTML = `
                        <div style="display: flex; flex-direction: column;">
                            <span>${item.text}</span>
                            <span style="font-size: 11px; opacity: 0.7; margin-top: 2px;">${item.description}</span>
                        </div>
                    `;
                } else {
                    menuItem.textContent = item.text;
                }
                
                menuItem.onmouseover = () => {
                    menuItem.style.background = this.config.theme === 'dark' ? '#333' : '#f0f0f0';
                };
                menuItem.onmouseout = () => {
                    menuItem.style.background = 'none';
                };
                menuItem.onclick = () => {
                    menu.remove();
                    item.action();
                };
                menu.appendChild(menuItem);
            });
            
            // Add menu to button's parent
            button.parentElement.style.position = 'relative';
            button.parentElement.appendChild(menu);
            
            // Close menu when clicking outside
            const closeMenu = (e) => {
                if (!menu.contains(e.target) && e.target !== button) {
                    menu.remove();
                    document.removeEventListener('click', closeMenu);
                }
            };
            setTimeout(() => document.addEventListener('click', closeMenu), 0);
        },

        // Toggle inline menu (positioned relative to inline title bar controls)
        toggleInlineMenu(event, button, index) {
            event.stopPropagation();
            // Remove existing menu if any
            const existingMenu = document.querySelector('.hybridai-dropdown-menu');
            if (existingMenu) {
                existingMenu.remove();
                return;
            }
            // Create dropdown menu
            const menu = document.createElement('div');
            menu.className = 'hybridai-dropdown-menu';
            menu.style.cssText = `
                position: absolute;
                top: 30px;
                right: 5px;
                background: ${this.config.theme === 'dark' ? '#2a2a2a' : '#fff'};
                border: 1px solid ${this.config.theme === 'dark' ? '#444' : '#ddd'};
                border-radius: 4px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.2);
                z-index: 10001;
                min-width: 150px;
            `;

            // Menu items
            const menuItems = [
                { text: 'Show Memory', action: () => this.showMemoryModal() },
                { text: 'Chat History', action: () => this.showChatHistoryModal() },
                { text: 'Snap Out', action: () => this.snapOutInlineWidget(index) }
            ];
            
            // Add privacy controls if allowed
            if (this.config.allowPrivacyToggle && !this.config.trackingDisabled) {
                // Add separator
                menuItems.push({ text: '---', isSeparator: true });
                
                // Add privacy mode options - simplified for users (only show toggle between two modes)
                if (this.state.currentPrivacyMode !== 'private') {
                    menuItems.push({ 
                        text: '🔒 Private Mode', 
                        action: () => this.setPrivacyMode('private'),
                        description: 'No data stored'
                    });
                }
                
                if (this.state.currentPrivacyMode === 'private') {
                    menuItems.push({ 
                        text: '📊 Normal Mode', 
                        action: () => this.setPrivacyMode('normal'),
                        description: 'Standard mode'
                    });
                }
            }

            menuItems.forEach(item => {
                // Handle separator
                if (item.isSeparator) {
                    const separator = document.createElement('hr');
                    separator.style.cssText = `
                        margin: 4px 0;
                        border: none;
                        border-top: 1px solid ${this.config.theme === 'dark' ? '#444' : '#ddd'};
                    `;
                    menu.appendChild(separator);
                    return;
                }
                
                const menuItem = document.createElement('button');
                menuItem.style.cssText = `
                    display: block;
                    width: 100%;
                    padding: 8px 16px;
                    border: none;
                    background: none;
                    text-align: left;
                    cursor: pointer;
                    color: ${this.config.theme === 'dark' ? '#e0e0e0' : '#333'};
                    font-size: 14px;
                    transition: background 0.2s;
                `;
                
                // Add text with optional description
                if (item.description) {
                    menuItem.innerHTML = `
                        <div style="display: flex; flex-direction: column;">
                            <span>${item.text}</span>
                            <span style="font-size: 11px; opacity: 0.7; margin-top: 2px;">${item.description}</span>
                        </div>
                    `;
                } else {
                    menuItem.textContent = item.text;
                }
                
                menuItem.onmouseover = () => {
                    menuItem.style.background = this.config.theme === 'dark' ? '#333' : '#f0f0f0';
                };
                menuItem.onmouseout = () => {
                    menuItem.style.background = 'none';
                };
                menuItem.onclick = () => {
                    menu.remove();
                    item.action();
                };
                menu.appendChild(menuItem);
            });

            // Add menu to button's parent
            button.parentElement.style.position = 'relative';
            button.parentElement.appendChild(menu);

            // Close menu when clicking outside
            const closeMenu = (e) => {
                if (!menu.contains(e.target) && e.target !== button) {
                    menu.remove();
                    document.removeEventListener('click', closeMenu);
                }
            };
            setTimeout(() => document.addEventListener('click', closeMenu), 0);
        },

        // Toggle snapped-out widget menu
        toggleSnappedOutMenu(event, button, sourceIndex) {
            event.stopPropagation();
            // Remove existing menu if any
            const existingMenu = document.querySelector('.hybridai-dropdown-menu');
            if (existingMenu) {
                existingMenu.remove();
                return;
            }
            
            // Create dropdown menu
            const menu = document.createElement('div');
            menu.className = 'hybridai-dropdown-menu';
            menu.style.cssText = `
                position: absolute;
                top: 30px;
                right: 5px;
                background: ${this.config.theme === 'dark' ? '#2a2a2a' : '#fff'};
                border: 1px solid ${this.config.theme === 'dark' ? '#444' : '#ddd'};
                border-radius: 4px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.2);
                z-index: 10001;
                min-width: 150px;
            `;

            // Menu items for snapped-out widget
            const menuItems = [
                { text: 'Show Memory', action: () => this.showMemoryModal() },
                { text: 'Chat History', action: () => this.showChatHistoryModal() }
            ];
            
            // Add privacy controls if allowed
            if (this.config.allowPrivacyToggle && !this.config.trackingDisabled) {
                // Add separator
                menuItems.push({ text: '---', isSeparator: true });
                
                // Add privacy mode options - simplified for users (only show toggle between two modes)
                if (this.state.currentPrivacyMode !== 'private') {
                    menuItems.push({ 
                        text: '🔒 Private Mode', 
                        action: () => this.setPrivacyMode('private'),
                        description: 'No data stored'
                    });
                }
                
                if (this.state.currentPrivacyMode === 'private') {
                    menuItems.push({ 
                        text: '📊 Normal Mode', 
                        action: () => this.setPrivacyMode('normal'),
                        description: 'Standard mode'
                    });
                }
            }

            menuItems.forEach(item => {
                // Handle separator
                if (item.isSeparator) {
                    const separator = document.createElement('hr');
                    separator.style.cssText = `
                        margin: 4px 0;
                        border: none;
                        border-top: 1px solid ${this.config.theme === 'dark' ? '#444' : '#ddd'};
                    `;
                    menu.appendChild(separator);
                    return;
                }
                
                const menuItem = document.createElement('button');
                menuItem.style.cssText = `
                    display: block;
                    width: 100%;
                    padding: 8px 16px;
                    border: none;
                    background: none;
                    text-align: left;
                    cursor: pointer;
                    color: ${this.config.theme === 'dark' ? '#e0e0e0' : '#333'};
                    font-size: 14px;
                    transition: background 0.2s;
                `;
                
                // Add text with optional description
                if (item.description) {
                    menuItem.innerHTML = `
                        <div style="display: flex; flex-direction: column;">
                            <span>${item.text}</span>
                            <span style="font-size: 11px; opacity: 0.7; margin-top: 2px;">${item.description}</span>
                        </div>
                    `;
                } else {
                    menuItem.textContent = item.text;
                }
                
                menuItem.addEventListener('mouseenter', () => {
                    menuItem.style.background = this.config.theme === 'dark' ? '#333' : '#f0f0f0';
                });
                
                menuItem.addEventListener('mouseleave', () => {
                    menuItem.style.background = 'none';
                });
                
                menuItem.addEventListener('click', () => {
                    item.action();
                    menu.remove();
                });
                
                menu.appendChild(menuItem);
            });

            // Append menu to button's parent
            button.parentElement.appendChild(menu);

            // Close menu when clicking outside
            const closeMenu = (e) => {
                if (!menu.contains(e.target) && e.target !== button) {
                    menu.remove();
                    document.removeEventListener('click', closeMenu);
                }
            };
            setTimeout(() => document.addEventListener('click', closeMenu), 0);
        },

        // Toggle fullscreen menu
        toggleFullscreenMenu(event, button, sourceIndex) {
            event.stopPropagation();
            // Remove existing menu if any
            const existingMenu = document.querySelector('.hybridai-dropdown-menu');
            if (existingMenu) {
                existingMenu.remove();
                return;
            }

            const menu = document.createElement('div');
            menu.className = 'hybridai-dropdown-menu';
            menu.style.cssText = `
                position: absolute;
                top: 48px;
                right: 8px;
                background: ${this.config.theme === 'dark' ? '#2a2a2a' : '#fff'};
                border: 1px solid ${this.config.theme === 'dark' ? '#444' : '#ddd'};
                border-radius: 4px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.2);
                z-index: 10001;
                min-width: 170px;
            `;

            const exitAction = () => {
                if (typeof sourceIndex === 'number') {
                    this.exitFullscreenMode(sourceIndex);
                } else {
                    this.exitNativeFullscreenMode();
                }
            };
            const menuItems = [
                { text: 'Show Memory', action: () => this.showMemoryModal() },
                { text: 'Exit Fullscreen', action: exitAction }
            ];

            menuItems.forEach(item => {
                const menuItem = document.createElement('button');
                menuItem.style.cssText = `
                    display: block;
                    width: 100%;
                    padding: 10px 16px;
                    border: none;
                    background: none;
                    text-align: left;
                    cursor: pointer;
                    color: ${this.config.theme === 'dark' ? '#e0e0e0' : '#333'};
                    font-size: 14px;
                    transition: background 0.2s;
                `;
                menuItem.textContent = item.text;
                menuItem.onmouseover = () => {
                    menuItem.style.background = this.config.theme === 'dark' ? '#333' : '#f0f0f0';
                };
                menuItem.onmouseout = () => {
                    menuItem.style.background = 'none';
                };
                menuItem.onclick = () => {
                    menu.remove();
                    item.action();
                };
                menu.appendChild(menuItem);
            });

            button.parentElement.style.position = 'relative';
            button.parentElement.appendChild(menu);

            const closeMenu = (e) => {
                if (!menu.contains(e.target) && e.target !== button) {
                    menu.remove();
                    document.removeEventListener('click', closeMenu);
                }
            };
            setTimeout(() => document.addEventListener('click', closeMenu), 0);
        },
        
        // Set privacy mode
        setPrivacyMode(mode) {
            // Prevent switching to normal mode if tracking is disabled
            if (this.config.trackingDisabled && mode === 'normal') {
                this.showNotification('⚠️ Tracking is disabled for this bot');
                return;
            }
            
            const previousMode = this.state.currentPrivacyMode;
            this.state.currentPrivacyMode = mode;
            this.config.privacyMode = mode;
            
            // Store privacy mode in localStorage for session persistence
            localStorage.setItem('hybridai_privacy_mode', mode);
            
            // Update the iframe's privacy mode variable
            if (this.state.chatWindow) {
                const iframe = this.state.chatWindow.querySelector('.hybridai-chat-iframe');
                if (iframe && iframe.contentWindow) {
                    try {
                        // Update the privacy mode in iframe context
                        iframe.contentWindow.eval(`window.currentPrivacyMode = '${mode}'; privacyMode = '${mode}';`);
                    } catch (e) {
                        console.error('Could not update iframe privacy mode:', e);
                    }
                }
            }
            
            // Update privacy indicator
            this.updatePrivacyIndicator();
            
            // Show confirmation message
            const messages = {
                'private': '🔒 Private Mode activated - No data will be stored',
                'no-tracking': '🛡️ No-Tracking Mode activated - Browser tracking disabled',
                'normal': '📊 Normal Mode activated - Standard tracking enabled'
            };
            
            this.showNotification(messages[mode]);
            
            // Log mode change
            console.log(`HybridAI Widget: Privacy mode changed from ${previousMode} to ${mode}`);
        },
        
        // Update privacy indicator in the UI
        updatePrivacyIndicator() {
            console.log(`HybridAI Widget: Updating privacy indicator for mode: ${this.state.currentPrivacyMode}`);
            
            // Update floating widget indicator
            if (this.state.chatWindow) {
                this.updatePrivacyIndicatorForElement(this.state.chatWindow);
            }
            
            // Update all inline widget indicators
            if (this.state.inlineWidgets) {
                this.state.inlineWidgets.forEach((widget) => {
                    if (widget && widget.container) {
                        this.updatePrivacyIndicatorForElement(widget.container);
                    }
                });
            }
            
            // Update all snapped-out widget indicators
            if (this.state.snappedOutWidgets) {
                Object.values(this.state.snappedOutWidgets).forEach(widget => {
                    if (widget && widget.container) {
                        this.updatePrivacyIndicatorForElement(widget.container);
                    }
                });
            }
        },
        
        // Helper function to update privacy indicator for a specific widget element
        updatePrivacyIndicatorForElement(widgetElement) {
            if (!widgetElement) return;
            
            // Find or create privacy indicator within this specific widget
            let indicator = widgetElement.querySelector('.hybridai-privacy-indicator');
            
            if (!indicator) {
                // Create indicator in title bar
                const titleBar = widgetElement.querySelector('.hybridai-title-bar');
                if (titleBar) {
                    indicator = document.createElement('span');
                    indicator.className = 'hybridai-privacy-indicator';
                    indicator.style.cssText = `
                        margin-left: 10px;
                        font-size: 16px;
                        display: inline-block;
                        vertical-align: middle;
                        line-height: 1;
                    `;
                    
                    // Find the title text and insert after it
                    const titleText = titleBar.querySelector('.hybridai-title-text');
                    if (titleText) {
                        // Insert right after the title text, within the same parent
                        titleText.insertAdjacentElement('afterend', indicator);
                    } else {
                        // Fallback: append to title content
                        const titleContent = titleBar.querySelector('.hybridai-title-content');
                        if (titleContent) {
                            titleContent.appendChild(indicator);
                        }
                    }
                }
            }
            
            if (indicator) {
                switch(this.state.currentPrivacyMode) {
                    case 'private':
                        indicator.innerHTML = '🔒';
                        indicator.title = 'Private Mode - No data is being stored';
                        indicator.style.color = '#ff4444';
                        break;
                    case 'no-tracking':
                        indicator.innerHTML = '🛡️';
                        indicator.title = 'No Tracking - Browser tracking disabled';
                        indicator.style.color = '#ffaa00';
                        break;
                    default:
                        indicator.innerHTML = '';
                        indicator.title = '';
                }
            }
        },
        
        // Show notification message
        showNotification(message) {
            // Create notification element
            const notification = document.createElement('div');
            notification.className = 'hybridai-notification';
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: ${this.config.theme === 'dark' ? '#2a2a2a' : '#333'};
                color: white;
                padding: 12px 20px;
                border-radius: 4px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                z-index: 100000;
                font-size: 14px;
                max-width: 300px;
                animation: slideIn 0.3s ease;
            `;
            notification.textContent = message;
            
            // Add animation
            const style = document.createElement('style');
            style.textContent = `
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            `;
            document.head.appendChild(style);
            
            document.body.appendChild(notification);
            
            // Remove after 3 seconds
            setTimeout(() => {
                notification.style.animation = 'slideOut 0.3s ease';
                setTimeout(() => {
                    notification.remove();
                    style.remove();
                }, 300);
            }, 3000);
        },
        
        // Show memory modal
        showMemoryModal() {
            const browserId = this.getOrCreateBrowserId();
            
            // Create modal overlay
            const overlay = document.createElement('div');
            overlay.className = 'hybridai-memory-overlay';
            overlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.5);
                z-index: 10002;
                display: flex;
                align-items: center;
                justify-content: center;
            `;
            
            // Create modal
            const modal = document.createElement('div');
            modal.className = 'hybridai-memory-modal';
            modal.style.cssText = `
                background: ${this.config.theme === 'dark' ? '#2a2a2a' : '#fff'};
                border-radius: 8px;
                box-shadow: 0 4px 16px rgba(0,0,0,0.3);
                width: 90%;
                max-width: 600px;
                max-height: 80vh;
                display: flex;
                flex-direction: column;
                overflow: hidden;
                box-sizing: border-box;
            `;
            
            // Modal header
            const header = document.createElement('div');
            header.style.cssText = `
                padding: 16px 20px;
                border-bottom: 1px solid ${this.config.theme === 'dark' ? '#444' : '#ddd'};
                display: flex;
                justify-content: space-between;
                align-items: center;
            `;
            
            const title = document.createElement('h3');
            title.textContent = 'User Memory';
            title.style.cssText = `
                margin: 0;
                color: ${this.config.theme === 'dark' ? '#e0e0e0' : '#333'};
                font-size: 18px;
                font-weight: 600;
            `;
            
            const closeBtn = document.createElement('button');
            closeBtn.innerHTML = '✕';
            closeBtn.style.cssText = `
                background: none;
                border: none;
                font-size: 20px;
                cursor: pointer;
                color: ${this.config.theme === 'dark' ? '#999' : '#666'};
                padding: 0;
                width: 30px;
                height: 30px;
            `;
            closeBtn.onclick = () => overlay.remove();
            
            header.appendChild(title);
            header.appendChild(closeBtn);
            
            // Modal content
            const content = document.createElement('div');
            content.style.cssText = `
                padding: 20px;
                flex: 1;
                overflow-y: auto;
                min-height: 0;
                display: flex;
                flex-direction: column;
                box-sizing: border-box;
            `;
            
            const textarea = document.createElement('textarea');
            textarea.style.cssText = `
                width: 100%;
                min-height: 200px;
                flex: 1;
                padding: 12px;
                border: 1px solid ${this.config.theme === 'dark' ? '#444' : '#ddd'};
                border-radius: 4px;
                background: ${this.config.theme === 'dark' ? '#1a1a1a' : '#f9f9f9'};
                color: ${this.config.theme === 'dark' ? '#e0e0e0' : '#333'};
                font-size: 14px;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
                resize: vertical;
                box-sizing: border-box;
                display: block;
                margin: 0;
                outline: none;
            `;
            textarea.placeholder = 'Loading memory...';
            
            // Helper function to decode HTML entities
            const decodeHtmlEntities = (text) => {
                const textArea = document.createElement('textarea');
                textArea.innerHTML = text;
                return textArea.value;
            };
            
            // Fetch current memory
            fetch(`${this.config.chatbotServer}/api/user_memory/${browserId}`)
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        // Decode HTML entities before displaying
                        const decodedContent = decodeHtmlEntities(data.memory_content || '');
                        textarea.value = decodedContent;
                        textarea.placeholder = 'Enter your notes here...';
                    } else {
                        textarea.placeholder = 'Failed to load memory';
                    }
                })
                .catch(err => {
                    console.error('Error fetching memory:', err);
                    textarea.placeholder = 'Error loading memory';
                });
            
            content.appendChild(textarea);
            
            // Modal footer
            const footer = document.createElement('div');
            footer.style.cssText = `
                padding: 16px 20px;
                border-top: 1px solid ${this.config.theme === 'dark' ? '#444' : '#ddd'};
                display: flex;
                justify-content: flex-end;
                gap: 10px;
            `;
            
            const cancelBtn = document.createElement('button');
            cancelBtn.textContent = 'Cancel';
            cancelBtn.style.cssText = `
                padding: 8px 16px;
                border: 1px solid ${this.config.theme === 'dark' ? '#444' : '#ddd'};
                background: none;
                border-radius: 4px;
                cursor: pointer;
                color: ${this.config.theme === 'dark' ? '#e0e0e0' : '#333'};
            `;
            cancelBtn.onclick = () => overlay.remove();
            
            const saveBtn = document.createElement('button');
            saveBtn.textContent = 'Save';
            saveBtn.style.cssText = `
                padding: 8px 16px;
                border: none;
                background: #4a90e2;
                color: white;
                border-radius: 4px;
                cursor: pointer;
                font-weight: 500;
            `;
            saveBtn.onclick = () => {
                saveBtn.disabled = true;
                saveBtn.textContent = 'Saving...';
                
                // Parse the textarea content to extract different memory types
                const content = textarea.value;
                const memoryData = {};
                
                // Split by section markers
                const sections = content.split(/\n*===\s*([^=]+)\s*===\n*/);
                
                // First section (before any markers) is general memory
                if (sections[0]) {
                    memoryData.general = sections[0].trim();
                }
                
                // Process labeled sections
                for (let i = 1; i < sections.length; i += 2) {
                    if (sections[i] && sections[i + 1]) {
                        // Convert section title back to memory_type format
                        const sectionTitle = sections[i].trim();
                        let memoryType = sectionTitle.toLowerCase().replace(/\s+/g, '_');
                        
                        // Handle known types
                        if (memoryType === 'user_preference' || memoryType === 'business_intent') {
                            memoryData[memoryType] = sections[i + 1].trim();
                        }
                    }
                }
                
                // If no sections were found, treat everything as general
                if (Object.keys(memoryData).length === 0) {
                    memoryData.general = content.trim();
                }
                
                fetch(`${this.config.chatbotServer}/api/user_memory/${browserId}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        memory_data: memoryData,  // Send structured data
                        memory_content: textarea.value,  // Also send raw for backward compatibility
                        memory_type: 'general'  // Kept for backward compatibility
                    })
                })
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        overlay.remove();
                    } else {
                        alert('Failed to save memory');
                        saveBtn.disabled = false;
                        saveBtn.textContent = 'Save';
                    }
                })
                .catch(err => {
                    console.error('Error saving memory:', err);
                    alert('Error saving memory');
                    saveBtn.disabled = false;
                    saveBtn.textContent = 'Save';
                });
            };
            
            footer.appendChild(cancelBtn);
            footer.appendChild(saveBtn);
            
            modal.appendChild(header);
            modal.appendChild(content);
            modal.appendChild(footer);
            overlay.appendChild(modal);
            // Ensure memory modal appears above fullscreen overlay when active
            const parentForMemory = this.state.fullscreenOverlay || document.body;
            if (parentForMemory === document.body) {
                // Place above any fullscreen overlay rendered with very high z-index
                overlay.style.zIndex = '1000001';
            } else {
                // Within fullscreen overlay, ensure it stacks above header/content
                overlay.style.zIndex = '1000';
            }
            parentForMemory.appendChild(overlay);
            
            // Focus textarea
            textarea.focus();
        },
        
        // Show chat history modal
        showChatHistoryModal() {
            const browserId = this.getOrCreateBrowserId();
            const sessionToken = localStorage.getItem(`chat_session_token_${this.config.chatbotId}`);
            
            if (!sessionToken) {
                console.log('No session token available - chat history not accessible yet');
                return;
            }
            
            // Create modal overlay
            const overlay = document.createElement('div');
            overlay.className = 'hybridai-history-overlay';
            overlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.5);
                z-index: 10002;
                display: flex;
                align-items: center;
                justify-content: center;
            `;
            
            // Create modal
            const modal = document.createElement('div');
            modal.className = 'hybridai-history-modal';
            modal.style.cssText = `
                background: ${this.config.theme === 'dark' ? '#2a2a2a' : '#fff'};
                border-radius: 8px;
                box-shadow: 0 4px 16px rgba(0,0,0,0.3);
                width: 90%;
                max-width: 800px;
                height: 80vh;
                display: flex;
                flex-direction: column;
            `;
            
            // Modal header
            const header = document.createElement('div');
            header.style.cssText = `
                padding: 16px 20px;
                border-bottom: 1px solid ${this.config.theme === 'dark' ? '#444' : '#ddd'};
                display: flex;
                justify-content: space-between;
                align-items: center;
            `;
            
            const title = document.createElement('h3');
            title.textContent = 'Chat History';
            title.style.cssText = `
                margin: 0;
                color: ${this.config.theme === 'dark' ? '#e0e0e0' : '#333'};
                font-size: 18px;
                font-weight: 600;
            `;
            
            const closeBtn = document.createElement('button');
            closeBtn.innerHTML = '✕';
            closeBtn.style.cssText = `
                background: none;
                border: none;
                font-size: 20px;
                cursor: pointer;
                color: ${this.config.theme === 'dark' ? '#999' : '#666'};
                padding: 0;
                width: 30px;
                height: 30px;
            `;
            closeBtn.onclick = () => overlay.remove();
            
            header.appendChild(title);
            header.appendChild(closeBtn);
            
            // Modal content with two-panel layout
            const content = document.createElement('div');
            content.style.cssText = `
                flex: 1;
                display: flex;
                overflow: hidden;
            `;
            
            // Left panel - Session list
            const sessionList = document.createElement('div');
            sessionList.style.cssText = `
                width: 250px;
                border-right: 1px solid ${this.config.theme === 'dark' ? '#444' : '#ddd'};
                overflow-y: auto;
                flex-shrink: 0;
            `;
            
            // Right panel - Conversation view
            const conversationView = document.createElement('div');
            conversationView.style.cssText = `
                flex: 1;
                padding: 20px;
                overflow-y: auto;
                background: ${this.config.theme === 'dark' ? '#1a1a1a' : '#f9f9f9'};
            `;
            
            // Loading indicator
            sessionList.innerHTML = '<div style="padding: 20px; color: #999;">Loading sessions...</div>';
            conversationView.innerHTML = '<div style="text-align: center; color: #999; padding: 40px;">Select a session to view</div>';
            
            // Fetch sessions
            fetch(`${this.config.chatbotServer}/api/chat_sessions`, {
                headers: {
                    'X-Session-Token': sessionToken
                }
            })
            .then(res => res.json())
            .then(data => {
                if (data.success && data.sessions) {
                    sessionList.innerHTML = '';
                    
                    if (data.sessions.length === 0) {
                        sessionList.innerHTML = '<div style="padding: 20px; color: #999;">No chat history yet</div>';
                        return;
                    }
                    
                    // Display sessions
                    data.sessions.forEach(session => {
                        const sessionItem = document.createElement('div');
                        sessionItem.style.cssText = `
                            padding: 12px 16px;
                            border-bottom: 1px solid ${this.config.theme === 'dark' ? '#333' : '#eee'};
                            cursor: pointer;
                            transition: background 0.2s;
                        `;
                        
                        const sessionTitle = document.createElement('div');
                        sessionTitle.textContent = session.title || 'New conversation';
                        sessionTitle.style.cssText = `
                            color: ${this.config.theme === 'dark' ? '#e0e0e0' : '#333'};
                            font-size: 14px;
                            margin-bottom: 4px;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                        `;
                        
                        const sessionMeta = document.createElement('div');
                        sessionMeta.textContent = `${session.date} • ${session.message_count} messages`;
                        sessionMeta.style.cssText = `
                            color: ${this.config.theme === 'dark' ? '#999' : '#666'};
                            font-size: 12px;
                        `;
                        
                        sessionItem.appendChild(sessionTitle);
                        sessionItem.appendChild(sessionMeta);
                        
                        sessionItem.onmouseover = () => {
                            sessionItem.style.background = this.config.theme === 'dark' ? '#333' : '#f0f0f0';
                        };
                        sessionItem.onmouseout = () => {
                            sessionItem.style.background = 'none';
                        };
                        
                        // Load session on click
                        sessionItem.onclick = () => {
                            // Remove active state from other items
                            sessionList.querySelectorAll('div').forEach(item => {
                                item.style.background = 'none';
                            });
                            sessionItem.style.background = this.config.theme === 'dark' ? '#333' : '#f0f0f0';
                            
                            // Load conversation
                            conversationView.innerHTML = '<div style="text-align: center; color: #999; padding: 40px;">Loading conversation...</div>';
                            
                            fetch(`${this.config.chatbotServer}/api/chat_session/${session.session_id}`, {
                                headers: {
                                    'X-Session-Token': sessionToken
                                }
                            })
                            .then(res => res.json())
                            .then(data => {
                                if (data.success && data.session) {
                                    conversationView.innerHTML = '';
                                    
                                    // Display messages
                                    data.session.messages.forEach(msg => {
                                        if (msg.query) {
                                            // User message
                                            const userMsg = document.createElement('div');
                                            userMsg.style.cssText = `
                                                margin-bottom: 16px;
                                                text-align: right;
                                            `;
                                            
                                            const userBubble = document.createElement('div');
                                            userBubble.style.cssText = `
                                                display: inline-block;
                                                max-width: 70%;
                                                padding: 10px 14px;
                                                background: #4a90e2;
                                                color: white;
                                                border-radius: 18px 18px 4px 18px;
                                                font-size: 14px;
                                                line-height: 1.4;
                                                text-align: left;
                                            `;
                                            userBubble.textContent = msg.query;
                                            userMsg.appendChild(userBubble);
                                            conversationView.appendChild(userMsg);
                                        }
                                        
                                        if (msg.response) {
                                            // Bot message
                                            const botMsg = document.createElement('div');
                                            botMsg.style.cssText = `
                                                margin-bottom: 16px;
                                            `;
                                            
                                            const botBubble = document.createElement('div');
                                            botBubble.style.cssText = `
                                                display: inline-block;
                                                max-width: 70%;
                                                padding: 10px 14px;
                                                background: ${this.config.theme === 'dark' ? '#333' : '#f0f0f0'};
                                                color: ${this.config.theme === 'dark' ? '#e0e0e0' : '#333'};
                                                border-radius: 18px 18px 18px 4px;
                                                font-size: 14px;
                                                line-height: 1.4;
                                            `;
                                            botBubble.textContent = msg.response;
                                            botMsg.appendChild(botBubble);
                                            conversationView.appendChild(botMsg);
                                        }
                                    });
                                } else {
                                    conversationView.innerHTML = '<div style="text-align: center; color: #999; padding: 40px;">Failed to load conversation</div>';
                                }
                            })
                            .catch(err => {
                                console.error('Error loading session:', err);
                                conversationView.innerHTML = '<div style="text-align: center; color: #999; padding: 40px;">Error loading conversation</div>';
                            });
                        };
                        
                        sessionList.appendChild(sessionItem);
                    });
                } else {
                    sessionList.innerHTML = '<div style="padding: 20px; color: #999;">Failed to load sessions</div>';
                }
            })
            .catch(err => {
                console.error('Error fetching sessions:', err);
                sessionList.innerHTML = '<div style="padding: 20px; color: #999;">Error loading sessions</div>';
            });
            
            content.appendChild(sessionList);
            content.appendChild(conversationView);
            
            modal.appendChild(header);
            modal.appendChild(content);
            overlay.appendChild(modal);
            
            // Ensure history modal appears above fullscreen overlay when active
            const parentForHistory = this.state.fullscreenOverlay || document.body;
            if (parentForHistory === document.body) {
                overlay.style.zIndex = '1000001';
            } else {
                overlay.style.zIndex = '1000';
            }
            parentForHistory.appendChild(overlay);
        },
        
        // Change font size
        changeFontSize(direction) {
            // Get current font size or default
            const currentSize = parseInt(localStorage.getItem('hybridai_font_size')) || '14';
            const minSize = 10;
            const maxSize = 24;
            
            // Calculate new size
            let newSize = currentSize + (direction * 2); // Change by 2px
            newSize = Math.max(minSize, Math.min(maxSize, newSize));
            
            // Save to localStorage
            localStorage.setItem('hybridai_font_size', newSize.toString());
            
            // Update the iframe content
            if (this.state.chatWindow) {
                const iframe = this.state.chatWindow.querySelector('.hybridai-chat-iframe');
                if (iframe && iframe.contentDocument) {
                    // Update all message elements
                    const messages = iframe.contentDocument.querySelectorAll('.message');
                    messages.forEach(msg => {
                        msg.style.fontSize = newSize + 'px';
                    });
                    
                    // Update input field
                    const input = iframe.contentDocument.getElementById('chat-input');
                    if (input) {
                        input.style.fontSize = newSize + 'px';
                    }
                    
                    // Update default style for new messages
                    let styleEl = iframe.contentDocument.getElementById('dynamic-font-size');
                    if (!styleEl) {
                        styleEl = iframe.contentDocument.createElement('style');
                        styleEl.id = 'dynamic-font-size';
                        iframe.contentDocument.head.appendChild(styleEl);
                    }
                    styleEl.textContent = `
                        .message { font-size: ${newSize}px !important; }
                        .bot-message ul, .bot-message ol, .bot-message li,
                        .user-message ul, .user-message ol, .user-message li,
                        .admin-message ul, .admin-message ol, .admin-message li { 
                            font-size: ${newSize}px !important; 
                        }
                        .bot-message p, .user-message p, .admin-message p { 
                            font-size: ${newSize}px !important; 
                        }
                        .bot-message table, .bot-message th, .bot-message td,
                        .user-message table, .user-message th, .user-message td,
                        .admin-message table, .admin-message th, .admin-message td { 
                            font-size: ${newSize}px !important; 
                        }
                        #chat-input { font-size: ${newSize}px !important; }
                        .default-message-btn { font-size: ${Math.max(12, newSize - 2)}px !important; }
                    `;
                }
            }
        },
        
        // Setup message listeners
        setupMessageListeners() {
            window.addEventListener('message', (event) => {
                if (event.data) {
                    // Handle different message types
                    if (event.data.type === 'message-consumed') {
                        this.handleMessageConsumed();
                    } else if (event.data.type === 'show-recharge-prompt') {
                        this.showRechargePrompt();
                    } else if (event.data['website-command']) {
                        this.executeWebsiteCommand(event.data['website-command'], event.data.message);
                    }
                }
            });
        },
        
        // Handle message consumption (credits)
        handleMessageConsumed() {
            if (!this.config.enablePaidMessages) return;
            
            let credits = parseInt(localStorage.getItem("chat_credits")) || 0;
            credits -= 5;
            localStorage.setItem("chat_credits", credits.toString());
            
            this.state.messageCounter++;
            if (this.state.messageCounter >= 10) {
                this.syncCreditsWithBackend();
                this.state.messageCounter = 0;
            }
            
            if (credits < 5) {
                this.showRechargePrompt();
            }
        },
        
        // Sync credits with backend
        async syncCreditsWithBackend() {
            const browserId = this.getOrCreateBrowserId();
            
            try {
                const response = await fetch(`${this.config.chatbotServer}/api/check_chat_credits?browser_id=${browserId}&chatbot_id=${encodeURIComponent(this.config.chatbotId)}`);
                const data = await response.json();
                const serverCredits = parseInt(data.chat_credits || 0);
                localStorage.setItem("chat_credits", serverCredits.toString());
            } catch (error) {
                console.error("Error syncing credits:", error);
            }
        },
        
        // Show recharge prompt
        showRechargePrompt() {
            const overlay = document.createElement('div');
            overlay.className = 'hybridai-widget hybridai-payment-overlay';
            overlay.innerHTML = `
                <h3>Insufficient Credits</h3>
                <p>Please purchase more credits to continue chatting.</p>
                <div id="paypal-credit-payment"></div>
            `;
            
            document.body.appendChild(overlay);
            
            // Load PayPal SDK and init button
            this.loadPayPalSDK(() => {
                this.initCreditPayPalButton();
            });
        },
        
        // Execute website commands
        executeWebsiteCommand(command, message) {
            console.log("HybridAI Widget: Executing command", command);
            
            if (command === "stream_canvas") {
                this.streamToCanvas(message);
                return;
            }
            
            const [cmd, param] = command.split("=").map(s => s.trim());
            
            switch (cmd) {
                case 'set-url':
                    this.setUrl(param);
                    break;
                case 'highlight':
                    this.highlightElement(param);
                    break;
                case 'set-value':
                    this.setValue(param);
                    break;
                default:
                    console.warn("Unknown command:", cmd);
            }
        },
        
        // Stream content to canvas
        streamToCanvas(message) {
            if (!this.state.isCanvasActive) {
                this.createCanvasModal();
                this.state.isCanvasActive = true;
            }
            
            this.state.canvasBuffer += message;
            this.updateCanvasContent();
        },
        
        // Create canvas modal
        createCanvasModal() {
            const modal = document.createElement('div');
            modal.className = 'hybridai-widget hybridai-canvas-modal';
            
            const closeBtn = document.createElement('button');
            closeBtn.className = 'hybridai-canvas-close';
            closeBtn.textContent = 'Close';
            closeBtn.addEventListener('click', () => {
                modal.remove();
                this.state.isCanvasActive = false;
                this.state.canvasBuffer = "";
            });
            
            const content = document.createElement('div');
            content.id = 'hybridai-canvas-content';
            content.style.padding = '20px';
            
            modal.appendChild(closeBtn);
            modal.appendChild(content);
            document.body.appendChild(modal);
        },
        
        // Update canvas content
        updateCanvasContent() {
            const content = document.getElementById('hybridai-canvas-content');
            if (content && md) {
                try {
                    content.innerHTML = md.render(this.state.canvasBuffer);
                } catch (e) {
                    console.error('Markdown-it error in canvas:', e);
                    content.textContent = this.state.canvasBuffer;
                }
                // Links will be handled by event delegation in the main window context
            } else if (content) {
                // Fallback if markdown-it is not loaded
                content.innerHTML = this.state.canvasBuffer.replace(/\\\\n/g, '<br>');
            }
        },
        
        // Set URL command
        setUrl(url) {
            if (!url.startsWith("http://") && !url.startsWith("https://") && !url.startsWith("/")) {
                url = "https://" + url;
            }
            
            const urlPattern = /^(https?:\/\/|\/)[\w\-]+(\.[\w\-]+)*(:\d{1,5})?(\/.*)?$/;
            
            if (urlPattern.test(url)) {
                window.location.href = url;
            } else {
                console.warn("Invalid URL:", url);
            }
        },
        
        // Highlight element command
        highlightElement(id) {
            const sanitizedId = id.toLowerCase().replace(/\s+/g, "_");
            const el = document.querySelector(`#${CSS.escape(sanitizedId)}`) || 
                      document.querySelector(`[id='${sanitizedId}']`);
            
            if (el) {
                el.style.outline = "3px solid red";
                console.log("Element highlighted:", sanitizedId);
            } else {
                console.warn("Element not found:", sanitizedId);
            }
        },
        
        // Set value command
        setValue(param) {
            const separatorIndex = param.indexOf(";");
            if (separatorIndex === -1) {
                console.warn("Invalid format for set-value");
                return;
            }
            
            let fieldId = param.substring(0, separatorIndex).trim();
            const value = param.substring(separatorIndex + 1).trim();
            
            fieldId = fieldId.toLowerCase().replace(/\s+/g, "_");
            
            const el = document.querySelector(`#${CSS.escape(fieldId)}`) || 
                      document.querySelector(`[name='${CSS.escape(fieldId)}']`);
            
            if (el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA")) {
                el.value = value;
                console.log("Value set:", fieldId, value);
            } else {
                console.warn("Input field not found:", fieldId);
            }
        },
        
        // Payment handling
        async checkAdultPayment() {
            const browserId = this.getOrCreateBrowserId();
            
            if (localStorage.getItem("adult_access_paid") === "true") {
                return;
            }
            
            try {
                const response = await fetch(`${this.config.chatbotServer}/api/check_adult_payment?browser_id=${browserId}&chatbot_id=${encodeURIComponent(this.config.chatbotId)}`);
                const data = await response.json();
                
                if (!data.adult_access_paid) {
                    this.showAdultPaymentOverlay();
                }
            } catch (error) {
                console.error("Error checking adult payment:", error);
                this.showAdultPaymentOverlay();
            }
        },
        
        showAdultPaymentOverlay() {
            const blur = document.createElement('div');
            blur.className = 'hybridai-widget hybridai-blur-overlay';
            
            const overlay = document.createElement('div');
            overlay.className = 'hybridai-widget hybridai-payment-overlay';
            overlay.innerHTML = `
                <h3>Adult Verification Required</h3>
                <p>Please pay 1 EUR verification fee via PayPal to gain access.</p>
                <div id="paypal-adult-payment"></div>
            `;
            
            document.body.appendChild(blur);
            document.body.appendChild(overlay);
            
            this.loadPayPalSDK(() => {
                this.initAdultPayPalButton();
            });
        },
        
        // PayPal SDK loading
        loadPayPalSDK(callback) {
            if (window.paypal) {
                callback();
                return;
            }
            
            const script = document.createElement("script");
            script.src = "https://www.paypal.com/sdk/js?client-id=ATtSqMnAufpGDjQGGf0GdKmBa8WeNl3fVGlbPoK1l2I8TD7mkJZYc5e1AYNUQcHmqDkJPKLVr4iAcBoO&currency=EUR";
            script.onload = callback;
            document.head.appendChild(script);
        },
        
        // Utility functions
        isMobile() {
            return window.innerWidth <= 768 || 
                   /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        },
        
        supportsNativeResize() {
            const isFirefox = navigator.userAgent.toLowerCase().includes('firefox');
            return !isFirefox && !this.isMobile();
        },
        
        // Cleanup function
        destroy() {
            // Remove all elements
            if (this.state.chatWindow) {
                this.state.chatWindow.remove();
            }
            if (this.state.chatButton) {
                this.state.chatButton.remove();
            }
            
            // Remove styles
            const styles = document.getElementById('hybridai-widget-styles');
            if (styles) styles.remove();
            
            // Clear state
            this.state = {
                isInitialized: false,
                chatWindow: null,
                chatButton: null
            };
        },

        // Enter fullscreen ChatGPT-style mode
        enterFullscreenMode(sourceIndex) {
            if (this.state.fullscreenOverlay) {
                return; // Already in fullscreen
            }

            const snappedWidget = this.state.snappedOutWidgets[sourceIndex];
            if (!snappedWidget) {
                console.error('No snapped-out widget found for index:', sourceIndex);
                return;
            }

            // Create fullscreen overlay
            const overlay = document.createElement('div');
            overlay.className = 'hybridai-fullscreen-overlay';
            
            // Add CSS variables for customization
            const existingStyle = document.getElementById('hybridai-fullscreen-vars');
            if (existingStyle) {
                existingStyle.remove();
            }
            
            const overlayBg = this.config.fullscreenOverlayBg || (this.config.theme === 'dark' ? '#1a1a1a' : '#ffffff');
            console.log('HybridAI Widget: Fullscreen overlay bg:', overlayBg);
            console.log('HybridAI Widget: Config.fullscreenOverlayBg:', this.config.fullscreenOverlayBg);
            
            const cssVariables = document.createElement('style');
            cssVariables.id = 'hybridai-fullscreen-vars';
            cssVariables.textContent = `
                :root {
                    /* Overlay */
                    --fs-overlay-bg: ${overlayBg};
                    --fs-overlay-z-index: ${this.config.fullscreenZIndex || '999999'};
                    
                    /* Header */
                    --fs-header-bg: ${this.config.fullscreenHeaderBg || (this.config.theme === 'dark' ? '#2a2a2a' : '#f8f9fa')};
                    --fs-header-border-color: ${this.config.fullscreenHeaderBorderColor || (this.config.theme === 'dark' ? '#333' : '#e1e5e9')};
                    --fs-header-padding: ${this.config.fullscreenHeaderPadding || '16px 24px'};
                    
                    /* Content area */
                    --fs-content-max-width: ${this.config.fullscreenContentMaxWidth || '800px'};
                    --fs-content-padding: ${this.config.fullscreenContentPadding || '0 24px'};
                    
                    /* Messages */
                    --fs-message-max-width: ${this.config.fullscreenMessageMaxWidth || '80%'};
                    --fs-message-padding: ${this.config.fullscreenMessagePadding || '12px 16px'};
                    --fs-message-border-radius: ${this.config.fullscreenMessageBorderRadius || '18px'};
                    --fs-message-font-size: ${this.config.fullscreenMessageFontSize || '16px'};
                    --fs-user-message-bg: ${this.config.fullscreenUserMessageBg || (this.config.theme === 'dark' ? '#0084ff' : '#007bff')};
                    --fs-user-message-color: ${this.config.fullscreenUserMessageColor || 'white'};
                    --fs-bot-message-bg: ${this.config.fullscreenBotMessageBg || (this.config.theme === 'dark' ? '#3a3a3a' : '#f1f3f5')};
                    --fs-bot-message-color: ${this.config.fullscreenBotMessageColor || (this.config.theme === 'dark' ? '#e0e0e0' : '#333')};
                    
                    /* Input area */
                    --fs-input-padding: ${this.config.fullscreenInputPadding || '20px 0 40px 0'};
                    --fs-input-border-radius: ${this.config.fullscreenInputBorderRadius || '25px'};
                    --fs-input-font-size: ${this.config.fullscreenInputFontSize || '16px'};
                    --fs-input-border-color: ${this.config.fullscreenInputBorderColor || (this.config.theme === 'dark' ? '#444' : '#ddd')};
                    --fs-input-text-color: ${this.config.fullscreenInputTextColor || (this.config.theme === 'dark' ? '#e0e0e0' : '#333')};
                    --fs-input-placeholder-color: ${this.config.fullscreenInputPlaceholderColor || (this.config.theme === 'dark' ? '#888' : '#999')};
                    
                    /* Welcome text */
                    --fs-welcome-title-size: ${this.config.fullscreenWelcomeTitleSize || '48px'};
                    --fs-welcome-subtitle-size: ${this.config.fullscreenWelcomeSubtitleSize || '18px'};
                    --fs-welcome-title-color: ${this.config.fullscreenWelcomeTitleColor || (this.config.theme === 'dark' ? '#ffffff' : '#000000')};
                    --fs-welcome-subtitle-color: ${this.config.fullscreenWelcomeSubtitleColor || (this.config.theme === 'dark' ? '#888888' : '#666666')};
                    
                    /* Buttons */
                    --fs-button-bg: ${this.config.fullscreenButtonBg || (this.config.theme === 'dark' ? '#007bff' : '#0066cc')};
                    --fs-button-color: ${this.config.fullscreenButtonColor || 'white'};
                    --fs-button-hover-bg: ${this.config.fullscreenButtonHoverBg || (this.config.theme === 'dark' ? '#0056b3' : '#004c99')};
                }
                
                .hybridai-fullscreen-overlay {
                    background: var(--fs-overlay-bg) !important;
                    z-index: var(--fs-overlay-z-index) !important;
                }
                
                .hybridai-fullscreen-overlay textarea {
                    background: transparent !important;
                }
                
                .hybridai-fullscreen-overlay textarea,
                .hybridai-fullscreen-overlay textarea:focus {
                    background: transparent !important;
                    -webkit-appearance: none !important;
                    -moz-appearance: none !important;
                    appearance: none !important;
                    background-color: transparent !important;
                    color: var(--fs-input-text-color) !important;
                }
                
                .hybridai-fullscreen-overlay .bot-message {
                    padding-left: 16px !important;
                }
                
                .hybridai-fullscreen-overlay .bot-message p:empty,
                .hybridai-fullscreen-overlay .bot-message div:empty,
                .hybridai-fullscreen-overlay .bot-message span:empty {
                    display: none !important;
                }
                
                .hybridai-fullscreen-overlay .bot-message p:not(:has(*)):not(:has(text())),
                .hybridai-fullscreen-overlay .bot-message div:not(:has(*)):not(:has(text())),
                .hybridai-fullscreen-overlay .bot-message span:not(:has(*)):not(:has(text())) {
                    display: none !important;
                }
                
                @keyframes hybridai-fullscreen-typing-blink {
                    0%, 100% { opacity: 0.3; }
                    50% { opacity: 1; }
                }
            `;
            document.head.appendChild(cssVariables);
            
            overlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                z-index: 999999;
                display: flex;
                flex-direction: column;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            `;

            const fsStyle = document.createElement('style');
            fsStyle.textContent = `
                .mic-toggle.listening { color: red; animation: pulse 1s infinite ease-in-out; }
                .mic-toggle.continuous-mode { background: linear-gradient(45deg,#ff6b6b,#ee5a52); color: white; border-radius: 50%; box-shadow: 0 0 15px rgba(255,107,107,0.4); animation: glow-pulse 2s infinite ease-in-out; }
                @keyframes pulse {0%{transform:scale(1);}50%{transform:scale(1.1);}100%{transform:scale(1);}}
                @keyframes glow-pulse {0%{box-shadow:0 0 15px rgba(255,107,107,0.4);transform:scale(1);}50%{box-shadow:0 0 25px rgba(255,107,107,0.6);transform:scale(1.05);}100%{box-shadow:0 0 15px rgba(255,107,107,0.4);transform:scale(1);}}
            `;
            overlay.appendChild(fsStyle);

            // Create header with logo and exit button
            const header = document.createElement('div');
            header.style.cssText = `
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: var(--fs-header-padding);
                border-bottom: 1px solid var(--fs-header-border-color);
                background: var(--fs-header-bg);
            `;

            // Logo and title
            const logoContainer = document.createElement('div');
            logoContainer.style.cssText = `
                display: flex;
                align-items: center;
                gap: 12px;
            `;

            const logo = document.createElement('img');
            const logoUrl = (this.config.botlogourl && this.config.botlogourl !== 'None' && this.config.botlogourl !== '') 
                ? (this.config.botlogourl.startsWith('http') ? this.config.botlogourl : this.config.chatbotServer + '/' + this.config.botlogourl)
                : this.DEFAULT_LOGO_PATH;
            logo.src = logoUrl;
            logo.style.cssText = `
                height: 32px;
                width: auto;
            `;
            logo.onerror = () => {
                logo.src = this.DEFAULT_LOGO_PATH;
            };

            const title = document.createElement('h1');
            title.textContent = this.config.bottitle || 'AI Assistant';
            title.style.cssText = `
                margin: 0;
                font-size: 20px;
                font-weight: 600;
                color: ${this.config.theme === 'dark' ? '#ffffff' : '#1a1a1a'};
            `;

            logoContainer.appendChild(logo);
            logoContainer.appendChild(title);

            // Audio toggle
            const audioToggleBtn = document.createElement('button');
            const audioEnabled = localStorage.getItem('sound_enabled') === 'true';
            audioToggleBtn.innerHTML = audioEnabled ? '🔊' : '🔇';
            audioToggleBtn.title = audioEnabled ? 'Disable audio' : 'Enable audio';
            audioToggleBtn.style.cssText = `
                background: none;
                border: none;
                font-size: 20px;
                cursor: pointer;
                color: ${this.config.theme === 'dark' ? '#ffffff' : '#1a1a1a'};
                padding: 8px;
                margin-right: 4px;
                opacity: 0.8;
            `;
            audioToggleBtn.addEventListener('click', () => {
                this.toggleAudio(audioToggleBtn);
            });

            // 3-dot menu button (fullscreen)
            const fsMenuBtn = document.createElement('button');
            fsMenuBtn.className = 'hybridai-control-button hybridai-menu-button';
            fsMenuBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="#000000" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="5" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="12" cy="19" r="2"/></svg>';
            fsMenuBtn.title = 'Menu';
            fsMenuBtn.style.cssText = `
                background: none;
                border: none;
                font-size: 20px;
                cursor: pointer;
                color: ${this.config.theme === 'dark' ? '#ffffff' : '#1a1a1a'};
                padding: 8px;
                margin-right: 4px;
                opacity: 0.8;
            `;
            fsMenuBtn.style.lineHeight = '0';
            fsMenuBtn.addEventListener('click', (e) => this.toggleFullscreenMenu(e, fsMenuBtn, sourceIndex));

            // Exit button
            const exitButton = document.createElement('button');
            exitButton.innerHTML = '✕';
            exitButton.title = 'Exit fullscreen';
            exitButton.style.cssText = `
                background: none;
                border: none;
                font-size: 24px;
                cursor: pointer;
                color: ${this.config.theme === 'dark' ? '#ffffff' : '#1a1a1a'};
                padding: 8px;
                border-radius: 6px;
                transition: background-color 0.2s;
            `;

            exitButton.addEventListener('click', () => {
                this.exitFullscreenMode(sourceIndex);
            });

            exitButton.addEventListener('mouseenter', () => {
                exitButton.style.backgroundColor = this.config.theme === 'dark' ? '#404040' : '#f0f0f0';
            });

            exitButton.addEventListener('mouseleave', () => {
                exitButton.style.backgroundColor = 'transparent';
            });

            // Group right-side controls to ensure correct alignment
            const rightControls = document.createElement('div');
            rightControls.style.cssText = `display:flex; align-items:center; gap:4px;`;
            rightControls.appendChild(audioToggleBtn);
            rightControls.appendChild(fsMenuBtn);
            rightControls.appendChild(exitButton);

            header.appendChild(logoContainer);
            header.appendChild(rightControls);

            // Create main content area
            const mainContent = document.createElement('div');
            mainContent.className = 'hybridai-fullscreen-content';
            mainContent.style.cssText = `
                flex: 1;
                display: flex;
                flex-direction: column;
                max-width: var(--fs-content-max-width);
                margin: 0 auto;
                width: 100%;
                padding: var(--fs-content-padding);
                position: relative;
            `;

            // Welcome message area (initially centered)
            const welcomeArea = document.createElement('div');
            welcomeArea.className = 'hybridai-welcome-area';
            welcomeArea.style.cssText = `
                flex: 1;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                text-align: center;
                padding: 40px 20px;
                transition: all 0.3s ease;
            `;

            const welcomeMessage = document.createElement('div');
            welcomeMessage.style.cssText = `
                font-size: var(--fs-welcome-title-size);
                font-weight: 300;
                color: var(--fs-welcome-title-color);
                margin-bottom: 16px;
            `;

            const timeGreeting = this.getTimeGreeting();
            welcomeMessage.textContent = `${timeGreeting}, how can I help?`;

            const subtitle = document.createElement('div');
            subtitle.style.cssText = `
                font-size: var(--fs-welcome-subtitle-size);
                color: var(--fs-welcome-subtitle-color);
                margin-bottom: 40px;
            `;
            subtitle.textContent = 'Ask me anything, and I\'ll do my best to help you.';

            welcomeArea.appendChild(welcomeMessage);
            welcomeArea.appendChild(subtitle);

            // Messages area (initially hidden)
            const messagesArea = document.createElement('div');
            messagesArea.className = 'hybridai-fullscreen-messages';
            messagesArea.style.cssText = `
                flex: 1;
                overflow-y: auto;
                padding: 20px 0;
                display: none;
                max-height: calc(100vh - 200px);
            `;

            // Input area (initially centered, will move to bottom)
            const inputArea = document.createElement('div');
            inputArea.className = 'hybridai-fullscreen-input';
            inputArea.style.cssText = `
                padding: var(--fs-input-padding);
                transition: all 0.3s ease;
            `;

            const inputContainer = document.createElement('div');
            inputContainer.style.cssText = `
                position: relative;
                display: flex;
                align-items: flex-start;
                background: var(--fs-input-bg);
                border: 2px solid var(--fs-input-border-color);
                border-radius: var(--fs-input-border-radius);
                padding: 12px 16px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                transition: border-color 0.2s;
            `;

            const textInput = document.createElement('textarea');
            textInput.placeholder = 'Message...';
            textInput.style.cssText = `
                flex: 1;
                border: none;
                outline: none;
                resize: none;
                background: transparent !important;
                background-color: transparent !important;
                font-size: var(--fs-input-font-size);
                line-height: 1.5;
                color: var(--fs-input-text-color) !important;
                font-family: inherit;
                max-height: 200px;
                min-height: 24px;
            `;

            const micButton = document.createElement('button');
            micButton.innerHTML = '🎙';
            micButton.className = 'mic-toggle';
            micButton.style.cssText = `
                background: none;
                border: none;
                font-size: 18px;
                cursor: pointer;
                padding: 0;
                opacity: 0.7;
                width: 32px;
                height: 32px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: ${this.config.theme === 'dark' ? '#ffffff' : '#666666'};
                border-radius: 50%;
                margin-right: 8px;
            `;

            const sendButton = document.createElement('button');
            sendButton.innerHTML = '↑';
            sendButton.className = 'send-button';
            sendButton.style.cssText = `
                background: transparent;
                border: none;
                border-radius: 6px;
                width: 32px;
                height: 32px;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                color: ${this.config.theme === 'dark' ? '#ffffff' : '#666666'};
                font-size: 16px;
                transition: all 0.2s;
                opacity: 0.5;
            `;

            micButton.addEventListener('click', () => {
                if (snappedWidget.iframe && snappedWidget.iframe.contentWindow) {
                    const inner = snappedWidget.iframe.contentWindow.document.getElementById('enable-mic');
                    if (inner) {
                        inner.dispatchEvent(new Event('click', { bubbles: true }));
                    }
                }
            });

            if (snappedWidget.iframe && snappedWidget.iframe.contentWindow) {
                const inner = snappedWidget.iframe.contentWindow.document.getElementById('enable-mic');
                if (inner) {
                    const sync = () => {
                        ['listening','continuous-mode'].forEach(cls => {
                            if (inner.classList.contains(cls)) micButton.classList.add(cls); else micButton.classList.remove(cls);
                        });
                    };
                    new MutationObserver(sync).observe(inner, { attributes: true, attributeFilter: ['class'] });
                    sync();
                }
            }

            // Auto-resize textarea
            textInput.addEventListener('input', () => {
                textInput.style.height = 'auto';
                textInput.style.height = Math.min(textInput.scrollHeight, 200) + 'px';
                
                // Update button state based on input
                const hasText = textInput.value.trim().length > 0;
                if (hasText) {
                    sendButton.style.background = this.config.color_scheme;
                    sendButton.style.color = 'white';
                    sendButton.style.opacity = '1';
                    sendButton.style.cursor = 'pointer';
                } else {
                    sendButton.style.background = 'transparent';
                    sendButton.style.color = this.config.theme === 'dark' ? '#ffffff' : '#666666';
                    sendButton.style.opacity = '0.5';
                    sendButton.style.cursor = 'default';
                }
            });

            // Focus styling
            textInput.addEventListener('focus', () => {
                // Kein farbiger Rand mehr beim Fokussieren
                inputContainer.style.borderColor = this.config.theme === 'dark' ? '#404040' : '#e1e5e9';
                // Hide placeholder on focus
                textInput.setAttribute('data-placeholder', textInput.placeholder);
                textInput.placeholder = '';
            });

            textInput.addEventListener('blur', () => {
                inputContainer.style.borderColor = this.config.theme === 'dark' ? '#404040' : '#e1e5e9';
                // Restore placeholder on blur if input is empty
                if (textInput.value === '') {
                    textInput.placeholder = textInput.getAttribute('data-placeholder') || '';
                }
            });

            // Handle send
            const handleSend = () => {
                const message = textInput.value.trim();
                if (!message) return;

                // Transform layout on first message
                this.transformToActiveLayout(welcomeArea, messagesArea, inputArea);

                // Setup message listener for live updates
                this.setupFullscreenMessageListener(snappedWidget.iframe, messagesArea);

                // Add user message immediately to the display
                this.addMessageToFullscreen(messagesArea, message, 'user', snappedWidget.iframe);

                // Send message through existing iframe
                if (snappedWidget.iframe && snappedWidget.iframe.contentWindow) {
                    snappedWidget.iframe.contentWindow.postMessage({
                        type: 'send-message',
                        message: message
                    }, '*');
                }

                textInput.value = '';
                textInput.style.height = 'auto';
                sendButton.style.background = 'transparent';
                textInput.style.setProperty('background', 'transparent', 'important');
                sendButton.style.color = this.config.theme === 'dark' ? '#ffffff' : '#666666';
                sendButton.style.opacity = '0.5';
            };

            sendButton.addEventListener('click', handleSend);

            textInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                }
            });

            inputContainer.appendChild(textInput);
            inputContainer.appendChild(micButton);
            inputContainer.appendChild(sendButton);
            inputArea.appendChild(inputContainer);

            // Add AI disclaimer if configured
            if (this.config.aiDisclaimerText) {
                const aiDisclaimer = document.createElement('div');
                aiDisclaimer.style.cssText = `
                    text-align: center;
                    font-size: 9px;
                    color: rgb(139, 150, 161);
                    font-style: italic;
                    padding: 2px 8px;
                    margin-top: 4px;
                `;
                aiDisclaimer.textContent = this.config.aiDisclaimerText;
                inputArea.appendChild(aiDisclaimer);
            }

            // Check if we have existing chat messages in the snapped widget
            let hasExistingMessages = false;
            if (snappedWidget.iframe && snappedWidget.iframe.contentWindow) {
                try {
                    const chatState = snappedWidget.iframe.contentWindow.getChatState();
                    console.log('HybridAI Widget: Checking for existing messages in enterFullscreenMode:', {
                        chatState: chatState,
                        hasMessages: chatState?.messages,
                        messageCount: chatState?.messages?.length
                    });
                    hasExistingMessages = chatState && chatState.messages && chatState.messages.length > 0;
                    console.log('HybridAI Widget: hasExistingMessages =', hasExistingMessages);
                } catch (e) {
                    console.warn('HybridAI Widget: Could not check chat state:', e);
                }
            } else {
                console.warn('HybridAI Widget: No iframe or contentWindow in snappedWidget');
            }

            // Assemble the layout based on whether we have existing messages
            if (hasExistingMessages) {
                // If we have messages, show the messages area immediately
                messagesArea.style.display = 'flex';
                messagesArea.style.flexDirection = 'column';
                messagesArea.style.gap = '10px';
                welcomeArea.style.display = 'none';
                
                // Move input to bottom
                inputArea.style.position = 'sticky';
                inputArea.style.bottom = '0';
                inputArea.style.backgroundColor = 'transparent';
                inputArea.style.borderTop = 'none';
                inputArea.style.padding = '16px 0';
            }
            
            mainContent.appendChild(welcomeArea);
            mainContent.appendChild(messagesArea);
            mainContent.appendChild(inputArea);

            overlay.appendChild(header);
            overlay.appendChild(mainContent);

            // Add to DOM
            document.body.appendChild(overlay);

            // Store reference
            this.state.fullscreenOverlay = overlay;
            this.state.fullscreenSourceIndex = sourceIndex;

            // Hide the snapped-out widget
            snappedWidget.container.style.display = 'none';

            // Transfer existing messages if any
            if (hasExistingMessages) {
                // Small delay to ensure DOM is ready
                setTimeout(() => {
                    this.transferChatToFullscreen(snappedWidget.iframe, messagesArea);
                }, 100);
            }

            // Ensure markdown-it is loaded for fullscreen mode
            this.ensureMarkdownItLoaded();

            // Focus the input
            setTimeout(() => {
                textInput.focus();
            }, 100);
        },

        // Get time-based greeting
        getTimeGreeting() {
            const hour = new Date().getHours();
            if (hour < 12) return 'Good morning';
            if (hour < 17) return 'Good afternoon';
            return 'Good evening';
        },

        // Transform layout from welcome to active chat
        transformToActiveLayout(welcomeArea, messagesArea, inputArea) {
            // Hide welcome area
            welcomeArea.style.display = 'none';
            
            // Show messages area with proper flex layout
            messagesArea.style.display = 'flex';
            messagesArea.style.flexDirection = 'column';
            messagesArea.style.gap = '10px';
            
            // Move input to bottom
            inputArea.style.position = 'sticky';
            inputArea.style.bottom = '0';
            inputArea.style.backgroundColor = this.config.theme === 'dark' ? 'transparent' : 'transparent';
            inputArea.style.borderTop = 'none';
            inputArea.style.padding = '16px 0';
        },

        // Transfer existing chat content to fullscreen
        transferChatToFullscreen(iframe, messagesArea) {
            console.log('HybridAI Widget: Starting transferChatToFullscreen');
            if (!iframe || !iframe.contentWindow) {
                console.warn('HybridAI Widget: No iframe or contentWindow available');
                return;
            }

            try {
                // Get the chat state directly
                const chatState = iframe.contentWindow.getChatState();
                console.log('HybridAI Widget: Got chat state:', chatState);
                if (chatState && chatState.messages && chatState.messages.length > 0) {
                    console.log(`HybridAI Widget: Found ${chatState.messages.length} messages to transfer`);
                    // Clear messages area first
                    messagesArea.innerHTML = '';
                    
                    // Add each message with proper fullscreen styling
                    chatState.messages.forEach((msg, index) => {
                        console.log(`HybridAI Widget: Processing message ${index}:`, msg);
                        
                        // Determine message type
                        let messageType = 'bot';
                        if (msg.type) {
                            messageType = msg.type;
                        } else if (msg.className) {
                            if (msg.className.includes('user-message')) {
                                messageType = 'user';
                            } else if (msg.className.includes('admin-message')) {
                                messageType = 'admin';
                            }
                        }
                        
                        // Skip admin messages or default messages
                        if (messageType === 'admin' || msg.className?.includes('default-messages')) {
                            console.log(`HybridAI Widget: Skipping message ${index} (admin or default)`);
                            return;
                        }
                        
                        // Extract the actual message content
                        let messageContent = '';
                        if (typeof msg.content === 'string') {
                            // Create a temporary div to parse HTML content
                            const tempDiv = document.createElement('div');
                            tempDiv.innerHTML = msg.content;
                            
                            // Find the actual message text (skip avatars, timestamps, etc.)
                            const messageSpan = tempDiv.querySelector('.message-text');
                            if (messageSpan) {
                                messageContent = messageSpan.innerHTML;
                                console.log(`HybridAI Widget: Extracted content from .message-text for message ${index}`);
                            } else {
                                // Fallback: get all text content
                                messageContent = tempDiv.textContent || tempDiv.innerText || '';
                                console.log(`HybridAI Widget: Using fallback text extraction for message ${index}`);
                            }
                        } else {
                            messageContent = msg.content;
                        }
                        
                        console.log(`HybridAI Widget: Message ${index} content:`, messageContent);
                        
                        // Add the message to fullscreen display
                        if (messageContent.trim()) {
                            console.log(`HybridAI Widget: Adding message ${index} to fullscreen display`);
                            this.addMessageToFullscreen(messagesArea, messageContent, messageType, iframe);
                        } else {
                            console.log(`HybridAI Widget: Skipping empty message ${index}`);
                        }
                    });
                    
                    // Ensure typing indicator exists after content transfer
                    this.ensureFullscreenTypingIndicator();
                    // For initial message transfer, scroll to show the last few messages naturally
                    setTimeout(() => {
                        const lastMessage = messagesArea.querySelector('.user-message:last-child, .bot-message:last-child');
                        if (lastMessage) {
                            this.smartScrollToMessage(messagesArea, lastMessage);
                        }
                    }, 100);
                } else {
                    console.log('HybridAI Widget: No messages to transfer or chatState is invalid:', {
                        chatState: chatState,
                        hasMessages: chatState?.messages,
                        messageCount: chatState?.messages?.length
                    });
                }
            } catch (e) {
                console.warn('HybridAI Widget: Could not transfer chat state:', e);
                // Fallback to the old method if direct access fails
                iframe.contentWindow.postMessage({
                    type: 'get-chat-content'
                }, '*');

                // Listen for response and populate messages area
                const handleMessage = (event) => {
                    if (event.data.type === 'chat-content-response') {
                        console.log('HybridAI Widget: Received chat-content-response via postMessage');
                        const content = event.data.content || '';
                        
                        if (content) {
                            // Parse the HTML content and extract messages
                            const tempDiv = document.createElement('div');
                            tempDiv.innerHTML = content;
                            
                            // Clear messages area
                            messagesArea.innerHTML = '';
                            
                            // Find all message elements
                            const messageElements = tempDiv.querySelectorAll('.message');
                            console.log(`HybridAI Widget: Found ${messageElements.length} messages in response`);
                            
                            messageElements.forEach((msgEl, index) => {
                                // Skip default messages
                                if (msgEl.classList.contains('default-messages')) {
                                    console.log(`HybridAI Widget: Skipping default message ${index}`);
                                    return;
                                }
                                
                                // Determine message type
                                let messageType = 'bot';
                                if (msgEl.classList.contains('user-message')) {
                                    messageType = 'user';
                                } else if (msgEl.classList.contains('admin-message')) {
                                    messageType = 'admin';
                                    console.log(`HybridAI Widget: Skipping admin message ${index}`);
                                    return; // Skip admin messages
                                }
                                
                                // Extract message content
                                const messageTextEl = msgEl.querySelector('.message-text');
                                let messageContent = '';
                                
                                if (messageTextEl) {
                                    messageContent = messageTextEl.innerHTML;
                                } else {
                                    // Fallback: get text content
                                    messageContent = msgEl.textContent || msgEl.innerText || '';
                                }
                                
                                console.log(`HybridAI Widget: Message ${index} (${messageType}):`, messageContent);
                                
                                // Add to fullscreen display
                                if (messageContent.trim()) {
                                    this.addMessageToFullscreen(messagesArea, messageContent, messageType, iframe);
                                }
                            });
                        }
                        
                        // Ensure typing indicator exists after content transfer
                        this.ensureFullscreenTypingIndicator();
                        // For initial message transfer, scroll to show the last few messages naturally
                        setTimeout(() => {
                            const lastMessage = messagesArea.querySelector('.user-message:last-child, .bot-message:last-child');
                            if (lastMessage) {
                                this.smartScrollToMessage(messagesArea, lastMessage);
                            }
                        }, 100);
                        window.removeEventListener('message', handleMessage);
                    }
                };

                window.addEventListener('message', handleMessage);
            }
        },

        // Exit fullscreen mode
        exitFullscreenMode(sourceIndex) {
            if (!this.state.fullscreenOverlay) return;

            // Remove overlay
            this.state.fullscreenOverlay.remove();
            this.state.fullscreenOverlay = null;

            // Show the snapped-out widget again
            const snappedWidget = this.state.snappedOutWidgets[sourceIndex];
            if (snappedWidget) {
                snappedWidget.container.style.display = 'block';
            }

            this.state.fullscreenSourceIndex = null;
        },

        // Enter fullscreen mode from native floating widget
        enterNativeFullscreenMode() {
            console.log('enterNativeFullscreenMode called');
            console.log('fullscreenOverlay exists:', !!this.state.fullscreenOverlay);
            console.log('chatWindow exists:', !!this.state.chatWindow);
            
            if (this.state.fullscreenOverlay) {
                console.log('Already in fullscreen, returning');
                return; // Already in fullscreen
            }

            if (!this.state.chatWindow) {
                console.error('No native floating widget found');
                return;
            }
            
            console.log('Proceeding with fullscreen creation');

            // Create fullscreen overlay (reusing the same structure)
            const overlay = document.createElement('div');
            overlay.className = 'hybridai-fullscreen-overlay';
            
            // Add CSS variables for customization
            const existingStyle = document.getElementById('hybridai-fullscreen-vars');
            if (existingStyle) {
                existingStyle.remove();
            }
            
            const overlayBg = this.config.fullscreenOverlayBg || (this.config.theme === 'dark' ? '#1a1a1a' : '#ffffff');
            console.log('HybridAI Widget: Fullscreen overlay bg:', overlayBg);
            console.log('HybridAI Widget: Config.fullscreenOverlayBg:', this.config.fullscreenOverlayBg);
            
            const cssVariables = document.createElement('style');
            cssVariables.id = 'hybridai-fullscreen-vars';
            cssVariables.textContent = `
                :root {
                    /* Overlay */
                    --fs-overlay-bg: ${overlayBg};
                    --fs-overlay-z-index: ${this.config.fullscreenZIndex || '999999'};
                    
                    /* Header */
                    --fs-header-bg: ${this.config.fullscreenHeaderBg || (this.config.theme === 'dark' ? '#2a2a2a' : '#f8f9fa')};
                    --fs-header-border-color: ${this.config.fullscreenHeaderBorderColor || (this.config.theme === 'dark' ? '#333' : '#e1e5e9')};
                    --fs-header-padding: ${this.config.fullscreenHeaderPadding || '16px 24px'};
                    
                    /* Content area */
                    --fs-content-max-width: ${this.config.fullscreenContentMaxWidth || '800px'};
                    --fs-content-padding: ${this.config.fullscreenContentPadding || '0 24px'};
                    
                    /* Messages */
                    --fs-message-max-width: ${this.config.fullscreenMessageMaxWidth || '80%'};
                    --fs-message-padding: ${this.config.fullscreenMessagePadding || '12px 16px'};
                    --fs-message-border-radius: ${this.config.fullscreenMessageBorderRadius || '18px'};
                    --fs-message-font-size: ${this.config.fullscreenMessageFontSize || '16px'};
                    --fs-user-message-bg: ${this.config.fullscreenUserMessageBg || (this.config.theme === 'dark' ? '#0084ff' : '#007bff')};
                    --fs-user-message-color: ${this.config.fullscreenUserMessageColor || 'white'};
                    --fs-bot-message-bg: ${this.config.fullscreenBotMessageBg || (this.config.theme === 'dark' ? '#3a3a3a' : '#f1f3f5')};
                    --fs-bot-message-color: ${this.config.fullscreenBotMessageColor || (this.config.theme === 'dark' ? '#e0e0e0' : '#333')};
                    
                    /* Input area */
                    --fs-input-padding: ${this.config.fullscreenInputPadding || '20px 0 40px 0'};
                    --fs-input-border-radius: ${this.config.fullscreenInputBorderRadius || '25px'};
                    --fs-input-font-size: ${this.config.fullscreenInputFontSize || '16px'};
                    --fs-input-border-color: ${this.config.fullscreenInputBorderColor || (this.config.theme === 'dark' ? '#444' : '#ddd')};
                    --fs-input-text-color: ${this.config.fullscreenInputTextColor || (this.config.theme === 'dark' ? '#e0e0e0' : '#333')};
                    --fs-input-placeholder-color: ${this.config.fullscreenInputPlaceholderColor || (this.config.theme === 'dark' ? '#888' : '#999')};
                    
                    /* Welcome text */
                    --fs-welcome-title-size: ${this.config.fullscreenWelcomeTitleSize || '48px'};
                    --fs-welcome-subtitle-size: ${this.config.fullscreenWelcomeSubtitleSize || '18px'};
                    --fs-welcome-title-color: ${this.config.fullscreenWelcomeTitleColor || (this.config.theme === 'dark' ? '#ffffff' : '#000000')};
                    --fs-welcome-subtitle-color: ${this.config.fullscreenWelcomeSubtitleColor || (this.config.theme === 'dark' ? '#888888' : '#666666')};
                    
                    /* Buttons */
                    --fs-button-bg: ${this.config.fullscreenButtonBg || (this.config.theme === 'dark' ? '#007bff' : '#0066cc')};
                    --fs-button-color: ${this.config.fullscreenButtonColor || 'white'};
                    --fs-button-hover-bg: ${this.config.fullscreenButtonHoverBg || (this.config.theme === 'dark' ? '#0056b3' : '#004c99')};
                }
                
                .hybridai-fullscreen-overlay {
                    background: var(--fs-overlay-bg) !important;
                    z-index: var(--fs-overlay-z-index) !important;
                }
                
                .hybridai-fullscreen-overlay textarea {
                    background: transparent !important;
                }
                
                .hybridai-fullscreen-overlay textarea,
                .hybridai-fullscreen-overlay textarea:focus {
                    background: transparent !important;
                    background-color: transparent !important;
                    color: var(--fs-input-text-color) !important;
                }
                
                .hybridai-fullscreen-overlay .bot-message {
                    padding-left: 16px !important;
                }
                
                .hybridai-fullscreen-overlay .bot-message p:empty,
                .hybridai-fullscreen-overlay .bot-message div:empty,
                .hybridai-fullscreen-overlay .bot-message span:empty {
                    display: none !important;
                }
                
                .hybridai-fullscreen-overlay .bot-message p:not(:has(*)):not(:has(text())),
                .hybridai-fullscreen-overlay .bot-message div:not(:has(*)):not(:has(text())),
                .hybridai-fullscreen-overlay .bot-message span:not(:has(*)):not(:has(text())) {
                    display: none !important;
                }
                
                @keyframes hybridai-fullscreen-typing-blink {
                    0%, 100% { opacity: 0.3; }
                    50% { opacity: 1; }
                }
            `;
            document.head.appendChild(cssVariables);
            
            overlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                z-index: 999999;
                display: flex;
                flex-direction: column;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            `;

            // Create header with logo and exit button
            const header = document.createElement('div');
            header.style.cssText = `
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: var(--fs-header-padding);
                border-bottom: 1px solid var(--fs-header-border-color);
                background: var(--fs-header-bg);
            `;

            // Logo and title
            const logoContainer = document.createElement('div');
            logoContainer.style.cssText = `
                display: flex;
                align-items: center;
                gap: 12px;
            `;

            const logo = document.createElement('img');
            const logoUrl = (this.config.botlogourl && this.config.botlogourl !== 'None' && this.config.botlogourl !== '') 
                ? (this.config.botlogourl.startsWith('http') ? this.config.botlogourl : this.config.chatbotServer + '/' + this.config.botlogourl)
                : this.DEFAULT_LOGO_PATH;
            logo.src = logoUrl;
            logo.style.cssText = `
                height: 32px;
                width: auto;
            `;
            logo.onerror = () => {
                logo.src = this.DEFAULT_LOGO_PATH;
            };

            const title = document.createElement('h1');
            title.textContent = this.config.bottitle || 'AI Assistant';
            title.style.cssText = `
                margin: 0;
                font-size: 20px;
                font-weight: 600;
                color: ${this.config.theme === 'dark' ? '#ffffff' : '#1a1a1a'};
            `;

            logoContainer.appendChild(logo);
            logoContainer.appendChild(title);

            // Exit button
            const exitButton = document.createElement('button');
            exitButton.innerHTML = '✕';
            exitButton.title = 'Exit fullscreen';
            exitButton.style.cssText = `
                background: none;
                border: none;
                font-size: 24px;
                cursor: pointer;
                color: ${this.config.theme === 'dark' ? '#ffffff' : '#1a1a1a'};
                padding: 8px;
                border-radius: 6px;
                transition: background-color 0.2s;
            `;

            exitButton.addEventListener('click', () => {
                this.exitNativeFullscreenMode();
            });

            exitButton.addEventListener('mouseenter', () => {
                exitButton.style.backgroundColor = this.config.theme === 'dark' ? '#404040' : '#f0f0f0';
            });

            exitButton.addEventListener('mouseleave', () => {
                exitButton.style.backgroundColor = 'transparent';
            });

            // 3-dot menu button for native fullscreen
            const fsMenuBtn = document.createElement('button');
            fsMenuBtn.className = 'hybridai-control-button hybridai-menu-button';
            fsMenuBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="#000000" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="5" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="12" cy="19" r="2"/></svg>';
            fsMenuBtn.title = 'Menu';
            fsMenuBtn.style.cssText = `
                background: none;
                border: none;
                font-size: 20px;
                cursor: pointer;
                color: ${this.config.theme === 'dark' ? '#ffffff' : '#1a1a1a'};
                padding: 8px;
                margin-right: 4px;
                opacity: 0.8;
            `;
            fsMenuBtn.style.lineHeight = '0';
            fsMenuBtn.addEventListener('click', (e) => this.toggleFullscreenMenu(e, fsMenuBtn));

            header.appendChild(logoContainer);
            header.appendChild(audioToggleBtn);
            header.appendChild(fsMenuBtn);
            header.appendChild(exitButton);

            // Create main content area
            const mainContent = document.createElement('div');
            mainContent.className = 'hybridai-fullscreen-content';
            mainContent.style.cssText = `
                flex: 1;
                display: flex;
                flex-direction: column;
                max-width: var(--fs-content-max-width);
                margin: 0 auto;
                width: 100%;
                padding: var(--fs-content-padding);
                position: relative;
            `;

            // Check if we have existing chat content
            const chatIframe = this.state.chatWindow.querySelector('.hybridai-chat-iframe');
            const hasExistingChat = this.checkIfChatHasContent(chatIframe);

            if (hasExistingChat) {
                // Show messages immediately if there's existing content
                const messagesArea = this.createFullscreenMessagesArea();
                const inputArea = this.createFullscreenInputArea(chatIframe, null, messagesArea);
                
                mainContent.appendChild(messagesArea);
                mainContent.appendChild(inputArea);
                
                // Setup message listener for bot responses
                this.setupFullscreenMessageListener(chatIframe, messagesArea);
                
                // Transfer existing chat content
                this.transferChatToFullscreen(chatIframe, messagesArea);
            } else {
                // Show welcome screen for new chats
                const welcomeArea = this.createFullscreenWelcomeArea();
                const messagesArea = this.createFullscreenMessagesArea();
                messagesArea.style.display = 'none';
                const inputArea = this.createFullscreenInputArea(chatIframe, welcomeArea, messagesArea);
                
                mainContent.appendChild(welcomeArea);
                mainContent.appendChild(messagesArea);
                mainContent.appendChild(inputArea);
                
                // Setup message listener for bot responses
                this.setupFullscreenMessageListener(chatIframe, messagesArea);
            }

            overlay.appendChild(header);
            overlay.appendChild(mainContent);

            // Add to DOM
            document.body.appendChild(overlay);

            // Store reference
            this.state.fullscreenOverlay = overlay;
            this.state.nativeFullscreenMode = true;

            // Hide the native floating widget
            this.state.chatWindow.style.display = 'none';

            // Ensure markdown-it is loaded for fullscreen mode
            this.ensureMarkdownItLoaded();

            // Focus the input
            setTimeout(() => {
                const textInput = overlay.querySelector('textarea');
                if (textInput) textInput.focus();
            }, 100);
        },

        // Check if chat has existing content
        checkIfChatHasContent(iframe) {
            // For now, assume new chat if iframe doesn't exist or isn't loaded
            // This could be enhanced to actually check the iframe content
            return false;
        },

        // Create fullscreen welcome area
        createFullscreenWelcomeArea() {
            const welcomeArea = document.createElement('div');
            welcomeArea.className = 'hybridai-welcome-area';
            welcomeArea.style.cssText = `
                flex: 1;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                text-align: center;
                padding: 40px 20px;
                transition: all 0.3s ease;
            `;

            const welcomeMessage = document.createElement('div');
            welcomeMessage.style.cssText = `
                font-size: var(--fs-welcome-title-size);
                font-weight: 300;
                color: var(--fs-welcome-title-color);
                margin-bottom: 16px;
            `;

            const timeGreeting = this.getTimeGreeting();
            welcomeMessage.textContent = `${timeGreeting}, how can I help?`;

            const subtitle = document.createElement('div');
            subtitle.style.cssText = `
                font-size: var(--fs-welcome-subtitle-size);
                color: var(--fs-welcome-subtitle-color);
                margin-bottom: 40px;
            `;
            subtitle.textContent = 'Ask me anything, and I\'ll do my best to help you.';

            welcomeArea.appendChild(welcomeMessage);
            welcomeArea.appendChild(subtitle);

            return welcomeArea;
        },

        // Create fullscreen messages area
        createFullscreenMessagesArea() {
            const messagesArea = document.createElement('div');
            messagesArea.className = 'hybridai-fullscreen-messages';
            messagesArea.style.cssText = `
                flex: 1;
                overflow-y: auto;
                padding: 20px 0;
                max-height: calc(100vh - 200px);
                display: flex;
                flex-direction: column;
                gap: 10px;
            `;
            
            // Add typing indicator to fullscreen messages area
            const typingIndicator = document.createElement('div');
            typingIndicator.className = 'hybridai-fullscreen-typing-indicator';
            typingIndicator.style.cssText = `
                display: none;
                padding: 12px 16px;
                margin-bottom: 12px;
                align-self: flex-start;
                background-color: var(--fs-bot-message-bg);
                color: var(--fs-bot-message-color);
                border-radius: var(--fs-message-border-radius);
                max-width: var(--fs-message-max-width);
            `;
            
            // Create the animated dots
            for (let i = 0; i < 3; i++) {
                const dot = document.createElement('span');
                dot.className = 'hybridai-fullscreen-typing-dot';
                dot.style.cssText = `
                    display: inline-block;
                    width: 8px;
                    height: 8px;
                    margin-right: 4px;
                    background-color: var(--fs-bot-message-color);
                    border-radius: 50%;
                    opacity: 0.3;
                    animation: hybridai-fullscreen-typing-blink 1.5s infinite;
                    animation-delay: ${i * 0.3}s;
                `;
                typingIndicator.appendChild(dot);
            }
            
            messagesArea.appendChild(typingIndicator);
            return messagesArea;
        },

        // Create fullscreen input area
        createFullscreenInputArea(iframe, welcomeArea, messagesArea) {
            const inputArea = document.createElement('div');
            inputArea.className = 'hybridai-fullscreen-input';
            inputArea.style.cssText = `
                padding: var(--fs-input-padding);
                transition: all 0.3s ease;
            `;

            const inputContainer = document.createElement('div');
            inputContainer.style.cssText = `
                position: relative;
                display: flex;
                align-items: flex-start;
                background: transparent;
                border: 2px solid var(--fs-input-border-color);
                border-radius: var(--fs-input-border-radius);
                padding: 12px 16px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                transition: border-color 0.2s;
            `;

            const textInput = document.createElement('textarea');
            textInput.placeholder = this.config.placeholder_text || 'Type your message...';
            textInput.style.cssText = `
                flex: 1;
                border: none;
                outline: none;
                resize: none;
                background: transparent !important;
                background-color: transparent !important;
                -webkit-appearance: none !important;
                -moz-appearance: none !important;
                appearance: none !important;
                font-size: var(--fs-input-font-size);
                line-height: 1.5;
                color: var(--fs-input-text-color) !important;
                font-family: inherit;
                max-height: 200px;
                min-height: 24px;
            `;

            const sendButton = document.createElement('button');
            sendButton.innerHTML = '🎙';  // Start with studio mic icon like widget
            sendButton.style.cssText = `
                background: transparent;
                border: none;
                border-radius: 6px;
                width: 32px;
                height: 32px;
                margin-left: 12px;
                cursor: pointer;
                display: flex;
                align-items: flex-start;
                justify-content: center;
                color: ${this.config.theme === 'dark' ? '#ffffff' : '#666666'};
                font-size: 16px;
                font-weight: bold;
                transition: all 0.2s;
                opacity: 0.8;
                padding-top: 2px;
                align-self: flex-start;
            `;

            // Auto-resize textarea
            textInput.addEventListener('input', () => {
                textInput.style.height = 'auto';
                textInput.style.height = Math.min(textInput.scrollHeight, 200) + 'px';
                
                // Update button based on text content
                const hasText = textInput.value.trim().length > 0;
                if (hasText) {
                    sendButton.innerHTML = '↑';
                    sendButton.style.background = this.config.color_scheme;
                    sendButton.style.color = 'white';
                    sendButton.style.opacity = '1';
                    sendButton.style.cursor = 'pointer';
                } else {
                    sendButton.innerHTML = '🎙';
                    sendButton.style.background = 'transparent';
                    sendButton.style.color = this.config.theme === 'dark' ? '#ffffff' : '#666666';
                    sendButton.style.opacity = '0.8';
                    sendButton.style.cursor = 'default';
                }
            });

            // Focus styling
            textInput.addEventListener('focus', () => {
                inputContainer.style.borderColor = this.config.color_scheme;
                textInput.style.background = 'transparent !important';
                // Hide placeholder on focus
                textInput.setAttribute('data-placeholder', textInput.placeholder);
                textInput.placeholder = '';
            });

            textInput.addEventListener('blur', () => {
                inputContainer.style.borderColor = this.config.theme === 'dark' ? '#404040' : '#e1e5e9';
                textInput.style.background = 'transparent !important';
                // Restore placeholder on blur if input is empty
                if (textInput.value === '') {
                    textInput.placeholder = textInput.getAttribute('data-placeholder') || '';
                }
            });

            // Handle send
            const handleSend = () => {
                const message = textInput.value.trim();
                if (!message) return;

                // Transform layout on first message (if welcomeArea exists)
                if (welcomeArea) {
                    this.transformToActiveLayout(welcomeArea, messagesArea, inputArea);
                }

                // Setup message listener for live updates
                this.setupFullscreenMessageListener(iframe, messagesArea);

                // Add user message immediately to the display
                this.addMessageToFullscreen(messagesArea, message, 'user', iframe);

                // Show typing indicator in fullscreen mode
                this.showFullscreenTypingIndicator();

                // Send message through existing iframe
                if (iframe && iframe.contentWindow) {
                    iframe.contentWindow.postMessage({
                        type: 'send-message',
                        message: message
                    }, '*');
                }

                textInput.value = '';
                textInput.style.height = 'auto';
                sendButton.innerHTML = '🎙';
                sendButton.style.background = 'transparent';
                sendButton.style.color = this.config.theme === 'dark' ? '#ffffff' : '#666666';
                sendButton.style.opacity = '0.8';
            };

            sendButton.addEventListener('click', handleSend);

            textInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                }
            });

            inputContainer.appendChild(textInput);
            inputContainer.appendChild(sendButton);
            inputArea.appendChild(inputContainer);

            // Add AI disclaimer if configured
            if (this.config.aiDisclaimerText) {
                const aiDisclaimer = document.createElement('div');
                aiDisclaimer.style.cssText = `
                    text-align: center;
                    font-size: 9px;
                    color: rgb(139, 150, 161);
                    font-style: italic;
                    padding: 2px 8px;
                    margin-top: 4px;
                `;
                aiDisclaimer.textContent = this.config.aiDisclaimerText;
                inputArea.appendChild(aiDisclaimer);
            }

            // Add footer like in regular widget
            const footer = document.createElement('div');
            footer.className = 'footer-links';
            footer.style.cssText = `
                display: flex;
                justify-content: space-between;
                font-size: 9px;
                color: #777;
                margin: 8px 0 0 0;
                align-items: center;
                white-space: nowrap;
                padding: 0;
            `;

            const poweredByLink = document.createElement('a');
            poweredByLink.href = 'https://hybridai.one';
            poweredByLink.target = '_blank';
            poweredByLink.textContent = 'Powered by hybridai.one';
            poweredByLink.style.cssText = `
                color: rgb(139, 150, 161);
                text-decoration: none;
            `;
            poweredByLink.addEventListener('mouseenter', () => {
                poweredByLink.style.textDecoration = 'underline';
            });
            poweredByLink.addEventListener('mouseleave', () => {
                poweredByLink.style.textDecoration = 'none';
            });

            const rightLinks = document.createElement('span');
            rightLinks.className = 'footer-links-right';
            rightLinks.style.marginLeft = '8px';

            const privacyLink = document.createElement('a');
            privacyLink.href = 'https://hybridai.one/privacy';
            privacyLink.target = '_blank';
            privacyLink.textContent = 'Privacy';
            privacyLink.style.cssText = `
                color: rgb(139, 150, 161);
                text-decoration: none;
            `;
            privacyLink.addEventListener('mouseenter', () => {
                privacyLink.style.textDecoration = 'underline';
            });
            privacyLink.addEventListener('mouseleave', () => {
                privacyLink.style.textDecoration = 'none';
            });

            const separator = document.createTextNode(' | ');

            const moreBotsLink = document.createElement('a');
            moreBotsLink.href = 'https://haichat.life';
            moreBotsLink.target = '_blank';
            moreBotsLink.textContent = 'More bots';
            moreBotsLink.style.cssText = `
                color: rgb(139, 150, 161);
                text-decoration: none;
            `;
            moreBotsLink.addEventListener('mouseenter', () => {
                moreBotsLink.style.textDecoration = 'underline';
            });
            moreBotsLink.addEventListener('mouseleave', () => {
                moreBotsLink.style.textDecoration = 'none';
            });

            rightLinks.appendChild(privacyLink);
            rightLinks.appendChild(separator);
            rightLinks.appendChild(moreBotsLink);

            footer.appendChild(poweredByLink);
            footer.appendChild(rightLinks);
            inputArea.appendChild(footer);

            return inputArea;
        },

        // Exit native fullscreen mode
        exitNativeFullscreenMode() {
            if (!this.state.fullscreenOverlay) return;

            // Remove overlay
            this.state.fullscreenOverlay.remove();
            this.state.fullscreenOverlay = null;

            // Show the native floating widget again
            if (this.state.chatWindow) {
                this.state.chatWindow.style.display = 'block';
            }

            this.state.nativeFullscreenMode = false;
        },

        // Add message to fullscreen display
        addMessageToFullscreen(messagesArea, message, type, iframe) {
            const messageDiv = document.createElement('div');
            messageDiv.className = type === 'user' ? 'user-message' : 'bot-message';
            messageDiv.style.cssText = `
                max-width: var(--fs-message-max-width);
                padding: var(--fs-message-padding);
                border-radius: var(--fs-message-border-radius);
                word-wrap: break-word;
                white-space: pre-wrap;
                margin-bottom: 12px;
                font-size: var(--fs-message-font-size);
                line-height: 1.5;
                ${type === 'user' ? `
                    align-self: flex-end;
                    background-color: var(--fs-user-message-bg);
                    color: var(--fs-user-message-color);
                    margin-left: auto;
                ` : `
                    align-self: flex-start;
                    background-color: var(--fs-bot-message-bg);
                    color: var(--fs-bot-message-color);
                    padding-left: 0;
                    padding-right: 0;
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                `}
            `;
            
            if (type === 'user') {
                // User messages display as plain text
                messageDiv.textContent = message;
            } else {
                // Bot messages need markdown formatting
                this.renderMarkdownForFullscreen(messageDiv, message);
            }
            
            if (type === 'bot' && messageDiv.innerHTML.trim() === '') {
                return;
            }
            messagesArea.appendChild(messageDiv);

            if (type === 'bot') {
                // Audio/TTS disabled in fullscreen mode
                // if (iframe && iframe.contentWindow && iframe.contentWindow.fetchSpeech) {
                //     const ttsText = message.replace(/\[CMD:([\s\S]*?)\]/g, '').trim();
                //     if (ttsText) iframe.contentWindow.fetchSpeech(ttsText);
                // }
            }
            
            // Use smart scrolling to position new messages optimally
            // Small delay to ensure DOM is updated before scrolling
            setTimeout(() => {
                // Force scrolling for new messages to ensure they're positioned properly
                this.smartScrollToMessage(messagesArea, messageDiv, { force: true });
            }, 50);
        },

        // Smart scrolling for fullscreen messages - ChatGPT style
        smartScrollToMessage(messagesArea, messageElement, options = {}) {
            console.log('HybridAI Widget: smartScrollToMessage called', {
                messagesArea: !!messagesArea,
                messageElement: !!messageElement,
                options: options
            });
            
            if (!messagesArea || !messageElement) {
                console.warn('HybridAI Widget: smartScrollToMessage - missing parameters');
                return;
            }
            
            const {
                targetFromTop = 0.35, // 35% from top by default
                behavior = 'smooth',
                force = false // Force scroll even if message is already visible
            } = options;
            
            const containerHeight = messagesArea.clientHeight;
            const containerScrollTop = messagesArea.scrollTop;
            
            // Calculate the message position relative to the container
            const messageTop = messageElement.offsetTop;
            const messageHeight = messageElement.offsetHeight;
            
            console.log('HybridAI Widget: Scroll calculation values', {
                containerHeight,
                containerScrollTop,
                messageTop,
                messageHeight,
                targetFromTop,
                force
            });
            
            // Check if message is already reasonably visible (unless force is true)
            if (!force) {
                const messageBottomInView = messageTop + messageHeight;
                const viewportTop = containerScrollTop;
                
                // If the message is already well-positioned in the viewport, don't scroll
                const messageTopInViewport = messageTop - viewportTop;
                const messageBottomInViewport = messageBottomInView - viewportTop;
                
                console.log('HybridAI Widget: Visibility check', {
                    messageTopInViewport,
                    messageBottomInViewport,
                    isVisible: messageTopInViewport >= 0 && messageBottomInViewport <= containerHeight,
                    isWellPositioned: messageTopInViewport >= 0 && messageTopInViewport < containerHeight * 0.5
                });
                
                // Only skip scrolling if the message is visible and positioned in the upper half of the screen
                if (messageTopInViewport >= 0 && 
                    messageBottomInViewport <= containerHeight && 
                    messageTopInViewport < containerHeight * 0.5) {
                    console.log('HybridAI Widget: Message already well-positioned, skipping scroll');
                    return; // Message is already well-positioned
                }
            }
            
            // Target position: show the message in the specified portion of the screen
            const targetFromTopPx = containerHeight * targetFromTop;
            
            // Calculate the scroll position needed
            const targetScrollTop = messageTop - targetFromTopPx + (messageHeight / 2);
            
            // Ensure we don't scroll beyond the content
            const maxScrollTop = messagesArea.scrollHeight - containerHeight;
            const finalScrollTop = Math.min(Math.max(0, targetScrollTop), maxScrollTop);
            
            console.log('HybridAI Widget: Final scroll calculation', {
                targetFromTopPx,
                targetScrollTop,
                maxScrollTop,
                finalScrollTop,
                currentScrollTop: containerScrollTop
            });
            
            // Smooth scroll to the target position
            messagesArea.scrollTo({
                top: finalScrollTop,
                behavior: behavior
            });
            
            console.log('HybridAI Widget: Scroll command executed');
        },

        // Enhanced scroll for typing indicator - positions it optimally
        scrollToTypingIndicator(messagesArea) {
            if (!messagesArea) return;
            
            const typingIndicator = messagesArea.querySelector('.hybridai-fullscreen-typing-indicator');
            if (!typingIndicator) return;
            
            // Use smart scrolling for typing indicator too
            this.smartScrollToMessage(messagesArea, typingIndicator);
        },

        // Render markdown for fullscreen bot messages
        renderMarkdownForFullscreen(messageDiv, message) {
            console.log('HybridAI Widget: Rendering markdown for fullscreen message:', message.substring(0, 100) + '...');
            
            // Create markdown-it instance for fullscreen context
            let md = null;
            
            // Try to load markdown-it dynamically if not available
            if (typeof window.markdownit !== 'undefined') {
                console.log('HybridAI Widget: Using window.markdownit');
                md = window.markdownit({
                    html: true,
                    linkify: true,
                    typographer: true,
                    breaks: false  // Disable for compact lists
                });
                
                // Add math support if enabled and available
                const mathEnabled = this.config?.enableMath || window.chatbotConfig?.enableMath || false;
                if (mathEnabled && typeof window.katex !== 'undefined') {
                    try {
                        // Use our custom math support initialization
                        initializeMathSupport(md);
                        console.log('HybridAI Widget: Math support enabled for fullscreen mode');
                    } catch (error) {
                        console.warn('HybridAI Widget: Could not enable math support in fullscreen:', error);
                    }
                }
                
                if (md && md.renderer && md.renderer.rules) {
                    md.renderer.rules.list_item_open = function(tokens, idx, options, env, renderer) {
                        return '<li style="margin: 0; padding: 0;">';
                    };
                    md.renderer.rules.paragraph_open = function(tokens, idx, options, env, renderer) {
                        return '<p style="margin: 0 0 0.2em 0;">';
                    };
                }
            } else if (typeof markdownit !== 'undefined') {
                console.log('HybridAI Widget: Using global markdownit');
                md = markdownit({
                    html: true,
                    linkify: true,
                    typographer: true,
                    breaks: false  // Disable for compact lists
                });
                if (md && md.renderer && md.renderer.rules) {
                    md.renderer.rules.list_item_open = function(tokens, idx, options, env, renderer) {
                        return '<li style="margin: 0; padding: 0;">';
                    };
                    md.renderer.rules.paragraph_open = function(tokens, idx, options, env, renderer) {
                        return '<p style="margin: 0 0 0.2em 0;">';
                    };
                }
            } else {
                console.log('HybridAI Widget: Loading markdown-it dynamically');
                // Load markdown-it dynamically
                const script = document.createElement('script');
                script.src = 'https://cdn.jsdelivr.net/npm/markdown-it@14.1.0/dist/markdown-it.min.js';
                script.onload = () => {
                    if (typeof window.markdownit !== 'undefined') {
                        console.log('HybridAI Widget: Markdown-it loaded successfully');
                        md = window.markdownit({
                            html: true,
                            linkify: true,
                            typographer: true,
                            breaks: false  // Disable for compact lists
                        });
                        if (md && md.renderer && md.renderer.rules) {
                            md.renderer.rules.list_item_open = function(tokens, idx, options, env, renderer) {
                                return '<li style="margin: 0; padding: 0;">';
                            };
                            md.renderer.rules.paragraph_open = function(tokens, idx, options, env, renderer) {
                                return '<p style="margin: 0 0 0.2em 0;">';
                            };
                        }
                        this.processMessageWithMarkdown(messageDiv, message, md);
                    } else {
                        console.warn('HybridAI Widget: Markdown-it not available after loading');
                        this.applyBasicMarkdownFormatting(messageDiv, message);
                    }
                };
                script.onerror = () => {
                    console.warn('HybridAI Widget: Failed to load markdown-it');
                    this.applyBasicMarkdownFormatting(messageDiv, message);
                };
                document.head.appendChild(script);
                return; // Exit early, will be processed when script loads
            }
            
            this.processMessageWithMarkdown(messageDiv, message, md);
        },

        // Process message with markdown-it instance
        processMessageWithMarkdown(messageDiv, message, md) {
            if (md) {
                console.log('HybridAI Widget: Processing with markdown-it');
                // Clean the message and render with markdown-it
                let cleanMessage = message;
                
                // Remove any command markers that might be in the message
                cleanMessage = cleanMessage.replace(/\[CMD:([\s\S]*?)\]/g, '');
                
                // Render with markdown
                const renderedHtml = md.render(cleanMessage);
                console.log('HybridAI Widget: Rendered HTML:', renderedHtml.substring(0, 200) + '...');
                messageDiv.innerHTML = renderedHtml;
                
                // Debug: Check for lists in the rendered content
                const lists = messageDiv.querySelectorAll('ol, ul');
                console.log('HybridAI Widget: Found lists:', lists.length);
                lists.forEach((list, index) => {
                    console.log(`HybridAI Widget: List ${index}:`, list.tagName, list.innerHTML.substring(0, 100));
                });
            } else {
                console.log('HybridAI Widget: Using basic markdown fallback');
                // Fallback to basic formatting if markdown-it is not available
                this.applyBasicMarkdownFormatting(messageDiv, message);
            }
            
            // Apply consistent styling to markdown elements
            this.styleMarkdownElements(messageDiv);
            
            // Clean up empty elements
            this.cleanupEmptyElements(messageDiv);
        },

        // Clean up empty elements from message
        cleanupEmptyElements(messageDiv) {
            // Remove empty paragraphs and divs
            const emptyElements = messageDiv.querySelectorAll('p:empty, div:empty, span:empty');
            emptyElements.forEach(element => element.remove());
            
            // Remove elements with only whitespace
            const allElements = messageDiv.querySelectorAll('p, div, span');
            allElements.forEach(element => {
                if (element.textContent.trim() === '' && element.children.length === 0) {
                    element.remove();
                }
            });
            
            // Special cleanup for lists - remove empty <p> tags around lists
            const lists = messageDiv.querySelectorAll('ul, ol');
            lists.forEach(list => {
                // Remove empty <p> tags before the list
                let prevElement = list.previousElementSibling;
                while (prevElement && prevElement.tagName === 'P' && 
                       (prevElement.textContent.trim() === '' || prevElement.innerHTML.trim() === '')) {
                    const toRemove = prevElement;
                    prevElement = prevElement.previousElementSibling;
                    toRemove.remove();
                }
                
                // Remove empty <p> tags after the list
                let nextElement = list.nextElementSibling;
                while (nextElement && nextElement.tagName === 'P' && 
                       (nextElement.textContent.trim() === '' || nextElement.innerHTML.trim() === '')) {
                    const toRemove = nextElement;
                    nextElement = nextElement.nextElementSibling;
                    toRemove.remove();
                }
            });
        },

        // Ensure markdown-it is loaded in the fullscreen context
        ensureMarkdownItLoaded() {
            if (typeof window.markdownit !== 'undefined' || typeof markdownit !== 'undefined') {
                // Markdown-it is loaded, check for math support if enabled
                const mathEnabled = this.config?.enableMath || window.chatbotConfig?.enableMath || false;
                if (mathEnabled && typeof window.katex === 'undefined') {
                    this.loadMathLibrariesForFullscreen();
                }
                return;
            }

            // Load markdown-it if not already present
            const script = document.createElement('script');
            script.src = 'https://unpkg.com/markdown-it@14.1.0/dist/markdown-it.min.js';
            script.onload = () => {
                console.log('HybridAI Widget: Markdown-it loaded for fullscreen mode');
                // Load math libraries if enabled
                const mathEnabled = this.config?.enableMath || window.chatbotConfig?.enableMath || false;
                if (mathEnabled) {
                    this.loadMathLibrariesForFullscreen();
                }
            };
            script.onerror = () => {
                console.warn('HybridAI Widget: Failed to load markdown-it for fullscreen mode');
            };
            document.head.appendChild(script);
        },
        
        // Load KaTeX libraries for fullscreen mode
        loadMathLibrariesForFullscreen() {
            if (typeof window.katex === 'undefined') {
                const katexScript = document.createElement('script');
                katexScript.src = 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js';
                katexScript.onload = () => {
                    console.log('HybridAI Widget: KaTeX loaded for fullscreen mode');
                };
                document.head.appendChild(katexScript);
                
                // Also load KaTeX CSS if not present
                if (!document.querySelector('link[href*="katex"]')) {
                    const katexCSS = document.createElement('link');
                    katexCSS.rel = 'stylesheet';
                    katexCSS.href = 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css';
                    document.head.appendChild(katexCSS);
                }
            }
        },

        // Apply basic markdown formatting as fallback
        applyBasicMarkdownFormatting(messageDiv, message) {
            let formatted = message;
            
            // Handle images first (before other formatting that might interfere)
            formatted = formatted.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img alt="$1" src="$2" style="max-width: 100%; height: auto; border-radius: 8px; margin: 8px 0;">');
            
            // Handle links
            formatted = formatted.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
            
            // Basic bold formatting
            formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
            formatted = formatted.replace(/__(.*?)__/g, '<strong>$1</strong>');
            
            // Basic italic formatting
            formatted = formatted.replace(/\*(.*?)\*/g, '<em>$1</em>');
            formatted = formatted.replace(/_(.*?)_/g, '<em>$1</em>');
            
            // Basic code formatting
            formatted = formatted.replace(/`(.*?)`/g, '<code>$1</code>');
            
            // Convert line breaks
            formatted = formatted.replace(/\n/g, '<br>');
            
            messageDiv.innerHTML = formatted;
        },

        // Style markdown elements to match the widget
        styleMarkdownElements(messageDiv) {
            const theme = this.config.theme;
            
            // Style code elements
            const codeElements = messageDiv.querySelectorAll('code');
            codeElements.forEach(code => {
                code.style.cssText = `
                    background-color: ${theme === 'dark' ? '#2a2a2a' : '#f0f0f0'};
                    padding: 0.2em 0.4em;
                    border-radius: 3px;
                    font-family: ui-monospace, SFMono-Regular, SF Mono, Menlo, Consolas, Liberation Mono, monospace;
                    font-size: 0.9em;
                `;
            });

            // Style pre elements
            const preElements = messageDiv.querySelectorAll('pre');
            preElements.forEach(pre => {
                pre.style.cssText = `
                    background-color: ${theme === 'dark' ? '#2a2a2a' : '#f0f0f0'};
                    padding: 1em;
                    border-radius: 6px;
                    overflow-x: auto;
                    margin: 0.5em 0;
                `;
            });

            // Style links
            const linkElements = messageDiv.querySelectorAll('a');
            linkElements.forEach(link => {
                link.style.cssText = `
                    color: ${theme === 'dark' ? '#66b3ff' : '#0066cc'};
                    text-decoration: none;
                `;
                link.addEventListener('mouseenter', () => {
                    link.style.textDecoration = 'underline';
                });
                link.addEventListener('mouseleave', () => {
                    link.style.textDecoration = 'none';
                });
            });

            // Style blockquotes
            const blockquoteElements = messageDiv.querySelectorAll('blockquote');
            blockquoteElements.forEach(blockquote => {
                blockquote.style.cssText = `
                    margin: 0.5em 0;
                    padding-left: 1em;
                    border-left: 3px solid ${theme === 'dark' ? '#666' : '#ccc'};
                    color: ${theme === 'dark' ? '#ccc' : '#666'};
                `;
            });

            // Style headers
            const headers = messageDiv.querySelectorAll('h1, h2, h3, h4, h5, h6');
            headers.forEach(header => {
                header.style.cssText = `
                    margin: 1em 0 0.5em 0;
                    line-height: 1.2;
                `;
            });

            // Style lists
            const lists = messageDiv.querySelectorAll('ul, ol');
            lists.forEach(list => {
                list.style.cssText = `
                    margin: 0.5em 0;
                    padding-left: 1.5em;
                    list-style-position: outside;
                `;
            });

            // Ensure ordered lists show numbers
            const orderedLists = messageDiv.querySelectorAll('ol');
            console.log('HybridAI Widget: Styling ordered lists:', orderedLists.length);
            orderedLists.forEach((list, index) => {
                console.log(`HybridAI Widget: Styling ordered list ${index}:`, list.innerHTML.substring(0, 100));
                list.style.cssText = `
                    margin: 0.5em 0;
                    padding-left: 1.5em;
                    list-style-type: decimal !important;
                    list-style-position: outside !important;
                    counter-reset: list-counter;
                `;
            });

            // Ensure unordered lists show bullets
            const unorderedLists = messageDiv.querySelectorAll('ul');
            unorderedLists.forEach(list => {
                list.style.cssText = `
                    margin: 0.5em 0;
                    padding-left: 1.5em;
                    list-style-type: disc;
                    list-style-position: outside;
                `;
            });

            // Style list items
            const listItems = messageDiv.querySelectorAll('li');
            listItems.forEach(item => {
                item.style.cssText = `
                    margin: 0.2em 0;
                    line-height: 1.4;
                `;
            });

            // Style tables
            const tables = messageDiv.querySelectorAll('table');
            tables.forEach(table => {
                table.style.cssText = `
                    border-collapse: collapse;
                    margin: 0.5em 0;
                    width: 100%;
                `;
                
                const cells = table.querySelectorAll('th, td');
                cells.forEach(cell => {
                    cell.style.cssText = `
                        border: 1px solid ${theme === 'dark' ? '#444' : '#ddd'};
                        padding: 0.5em;
                        text-align: left;
                    `;
                });

                const headers = table.querySelectorAll('th');
                headers.forEach(header => {
                    header.style.backgroundColor = theme === 'dark' ? '#333' : '#f5f5f5';
                });
            });
        },

        // Setup listener for live message updates
        setupFullscreenMessageListener(iframe, messagesArea) {
            if (this.state.fullscreenMessageListener) {
                // Remove existing listener
                window.removeEventListener('message', this.state.fullscreenMessageListener);
            }

            // Create new listener
            this.state.fullscreenMessageListener = (event) => {
                // Handle different message types from iframe
                if (event.data.type === 'bot-response') {
                    this.hideFullscreenTypingIndicator();
                    this.addMessageToFullscreen(messagesArea, event.data.message, 'bot', iframe);
                } else if (event.data.type === 'chat-update') {
                    // Hide typing indicator on first chunk
                    //this.hideFullscreenTypingIndicator();
                    // Handle streaming updates
                    const lastBotMessage = messagesArea.querySelector('.bot-message:last-child');
                    if (lastBotMessage && event.data.streaming) {
                        this.renderMarkdownForFullscreen(lastBotMessage, event.data.message);
                        // For streaming updates, use smart scrolling to keep the message in view
                        setTimeout(() => {
                            this.smartScrollToMessage(messagesArea, lastBotMessage, { 
                                force: false, // Don't force for streaming updates to avoid excessive scrolling
                                behavior: 'smooth' 
                            });
                        }, 100);
                    } else {
                        this.addMessageToFullscreen(messagesArea, event.data.message, 'bot', iframe);
                    }
                }
            };

            window.addEventListener('message', this.state.fullscreenMessageListener);

            // Request iframe to send message updates
            if (iframe && iframe.contentWindow) {
                // Tell iframe to start sending updates
                iframe.contentWindow.postMessage({
                    type: 'enable-message-updates'
                }, '*');
            }
        },

        // Ensure typing indicator exists in fullscreen mode
        ensureFullscreenTypingIndicator() {
            const messagesArea = document.querySelector('.hybridai-fullscreen-messages');
            if (!messagesArea) return;
            
            let typingIndicator = messagesArea.querySelector('.hybridai-fullscreen-typing-indicator');
            if (!typingIndicator) {
                console.log('HybridAI: Creating typing indicator');
                // Create typing indicator
                typingIndicator = document.createElement('div');
                typingIndicator.className = 'hybridai-fullscreen-typing-indicator';
                typingIndicator.style.cssText = `
                    display: none;
                    padding: 12px 16px;
                    margin-bottom: 12px;
                    align-self: flex-start;
                    background-color: var(--fs-bot-message-bg);
                    color: var(--fs-bot-message-color);
                    border-radius: var(--fs-message-border-radius);
                    max-width: var(--fs-message-max-width);
                `;
                
                // Create the animated dots
                for (let i = 0; i < 3; i++) {
                    const dot = document.createElement('span');
                    dot.className = 'hybridai-fullscreen-typing-dot';
                    dot.style.cssText = `
                        display: inline-block;
                        width: 8px;
                        height: 8px;
                        margin-right: 4px;
                        background-color: var(--fs-bot-message-color);
                        border-radius: 50%;
                        opacity: 0.3;
                        animation: hybridai-fullscreen-typing-blink 1.5s infinite;
                        animation-delay: ${i * 0.3}s;
                    `;
                    typingIndicator.appendChild(dot);
                }
                
                messagesArea.appendChild(typingIndicator);
            }
        },

        // Show typing indicator in fullscreen mode
        showFullscreenTypingIndicator() {
            this.ensureFullscreenTypingIndicator();
            const typingIndicator = document.querySelector('.hybridai-fullscreen-typing-indicator');
            if (typingIndicator) {
                console.log('HybridAI: Showing typing indicator');
                typingIndicator.style.display = 'block';
                // Use smart scrolling for typing indicator
                const messagesArea = document.querySelector('.hybridai-fullscreen-messages');
                if (messagesArea) {
                    setTimeout(() => {
                        this.scrollToTypingIndicator(messagesArea);
                    }, 100);
                }
            } else {
                console.log('HybridAI: Typing indicator not found');
            }
        },

        // Hide typing indicator in fullscreen mode
        hideFullscreenTypingIndicator() {
            const typingIndicator = document.querySelector('.hybridai-fullscreen-typing-indicator');
            if (typingIndicator) {
                typingIndicator.style.display = 'none';
            }
        }
    };
    
    // Initialize widget
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", () => HybridAIWidget.init());
    } else {
        HybridAIWidget.init();
    }
    
    // Expose to global scope for debugging
    window.HybridAIWidget = HybridAIWidget;
})();