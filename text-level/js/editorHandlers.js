import { formatCSS, formatHTML, formatMarkdown } from './formatters.js';
import { debounce } from './utils.js';

// Tracking der Cursor-Position
let lastCursorPosition = {
    start: 0,
    end: 0,
    element: null
};

// Event-Handler zum Speichern der letzten Cursor-Position
function trackCursorPosition(element) {
    lastCursorPosition = {
        start: element.selectionStart,
        end: element.selectionEnd,
        element: element
    };
}

// Funktion zum Wiederherstellen der Cursor-Position
function restoreCursorPosition() {
    if (lastCursorPosition.element) {
        lastCursorPosition.element.setSelectionRange(
            lastCursorPosition.start,
            lastCursorPosition.end
        );
    }
}

// Funktion zur Textformatierung mit Cursor-Positionserhaltung
function formatTextWithCursor(text, formatFunc) {
    if (!text || !text.trim()) return "";

    // Position relativ zum Text berechnen
    const beforeCursor = text.substring(0, lastCursorPosition.start);
    const selection = text.substring(lastCursorPosition.start, lastCursorPosition.end);
    const afterCursor = text.substring(lastCursorPosition.end);

    // Formatierung auf die einzelnen Teile anwenden
    const formattedBefore = formatFunc(beforeCursor);
    const formattedSelection = formatFunc(selection);
    const formattedAfter = formatFunc(afterCursor);

    // Neue Cursor-Position berechnen
    lastCursorPosition.start = formattedBefore.length;
    lastCursorPosition.end = formattedBefore.length + formattedSelection.length;

    // Formatierten Text zusammenführen
    return formattedBefore + formattedSelection + formattedAfter;
}

// Updatet Editor und Preview
export function updateEditorAndPreview(content) {
    const editor = document.getElementById("editor");
    if (!editor) return;

    // Aktualisiere nur die Vorschau, keine Formatierung während der Eingabe
    updatePreview(content);

    // Auto-Save des aktuellen Dokuments
    if (window.docHandler?.currentDocumentId) {
        const css = document.getElementById("css-editor")?.value || "";
        const currentDoc = window.docHandler.loadDocument(window.docHandler.currentDocumentId);
        if (currentDoc) {
            window.docHandler.saveDocument(currentDoc.title, content, css);
        }
    }
}

// Rendert die Vorschau
export function updatePreview(content) {
    const output = document.getElementById("output");
    if (!output) return;

    try {
        if (detectContentType(content) === 'html') {
            output.innerHTML = content;
        } else {
            marked.setOptions({
                headerIds: false,
                mangle: false,
                headerPrefix: '',
                gfm: true,
                breaks: true,
                pedantic: false,
                sanitize: false,
                smartLists: true,
                smartypants: true
            });
            const parsedContent = marked.parse(content);
            output.innerHTML = parsedContent;
        }
    } catch (error) {
        console.error('Fehler beim Rendern der Vorschau:', error);
        output.innerHTML = '<span style="color: red;">Fehler beim Rendern der Vorschau</span>';
    }
}

// Wendet CSS auf die Vorschau an
export function applyCSS(css) {
    let styleTag = document.getElementById("dynamic-style");
    if (!styleTag) {
        styleTag = document.createElement("style");
        styleTag.id = "dynamic-style";
        document.head.appendChild(styleTag);
    }
    styleTag.textContent = css;
}

// Erkennt Content-Type (HTML oder Markdown)
function detectContentType(content) {
    if (!content) return 'markdown';

    const htmlPatterns = [
        /<[a-z][^>]*>/i,
        /<!DOCTYPE/i,
        /<!--[\s\S]*?-->/,
        /&[a-z]+;/i
    ];

    const markdownPatterns = [
        /^#{1,6} /m,
        /\*\*[\s\S]+?\*\*/,
        /^- /m,
        /^[0-9]+\. /m,
        /\[[\s\S]+?\]\([\s\S]+?\)/,
        /^>/m,
        /`[^`]+`/,
        /^```[\s\S]*?```/m
    ];

    const htmlScore = htmlPatterns.filter(pattern => pattern.test(content)).length;
    const mdScore = markdownPatterns.filter(pattern => pattern.test(content)).length;

    return htmlScore > mdScore ? 'html' : 'markdown';
}

// Format-Trigger Events
const FORMAT_TRIGGER_KEYS = ['Enter', 'Tab', ';', '}', '{', '>', '<'];

// Setup der Editor Event Listener
export function setupEditorHandlers() {
    // Editor Event Handling
    const editor = document.getElementById("editor");
    if (editor) {
        // Cursor-Position tracken
        editor.addEventListener("mouseup", () => trackCursorPosition(editor));
        editor.addEventListener("keyup", (e) => {
            if (!FORMAT_TRIGGER_KEYS.includes(e.key)) {
                trackCursorPosition(editor);
            }
        });

        // Input handling für Live-Preview
        editor.addEventListener("input", 
            debounce((e) => {
                updateEditorAndPreview(e.target.value);
            }, 300)
        );

        // Format-Trigger handling
        editor.addEventListener("keyup", (e) => {
            if (FORMAT_TRIGGER_KEYS.includes(e.key)) {
                const content = editor.value;
                const type = detectContentType(content);
                const formatter = type === 'html' ? formatHTML : formatMarkdown;
                
                trackCursorPosition(editor);
                editor.value = formatTextWithCursor(content, formatter);
                restoreCursorPosition();
            }
        });

        // Formatierung bei Fokus-Verlust
        editor.addEventListener("blur", () => {
            const content = editor.value;
            const type = detectContentType(content);
            const formatter = type === 'html' ? formatHTML : formatMarkdown;
            
            trackCursorPosition(editor);
            editor.value = formatTextWithCursor(content, formatter);
            restoreCursorPosition();
        });
    }

    // CSS Editor Event Handling
    const cssEditor = document.getElementById("css-editor");
    if (cssEditor) {
        // Cursor-Position tracken
        cssEditor.addEventListener("mouseup", () => trackCursorPosition(cssEditor));
        cssEditor.addEventListener("keyup", (e) => {
            if (!FORMAT_TRIGGER_KEYS.includes(e.key)) {
                trackCursorPosition(cssEditor);
            }
        });

        // Input handling für Live-Preview
        cssEditor.addEventListener("input",
            debounce((e) => {
                const css = e.target.value;
                applyCSS(css);
                
                // Speichern bei CSS Änderungen
                if (window.docHandler?.currentDocumentId) {
                    const currentDoc = window.docHandler.loadDocument(window.docHandler.currentDocumentId);
                    if (currentDoc) {
                        window.docHandler.saveDocument(
                            currentDoc.title,
                            editor?.value || currentDoc.content,
                            css
                        );
                    }
                }
            }, 300)
        );

        // Format-Trigger handling
        cssEditor.addEventListener("keyup", (e) => {
            if (FORMAT_TRIGGER_KEYS.includes(e.key)) {
                trackCursorPosition(cssEditor);
                cssEditor.value = formatTextWithCursor(cssEditor.value, formatCSS);
                restoreCursorPosition();
            }
        });

        // Formatierung bei Fokus-Verlust
        cssEditor.addEventListener("blur", () => {
            trackCursorPosition(cssEditor);
            cssEditor.value = formatTextWithCursor(cssEditor.value, formatCSS);
            restoreCursorPosition();
        });
    }
}