/**
 * Formatiert HTML-Code
 * @param {string} html - Der zu formatierende HTML-Code
 * @returns {string} Formatierter HTML-Code
 */
 
import { LanguageControl } from './languageControl.js';
import { MessageControl } from './messageControl.js';
 
export function formatHTML(html) {
    if (!html || !html.trim()) return ""

    try {
        let formatted = ""
        let indent = 0
        const tags = html.split(/(<\/?[^>]+>)/g)

        for (let i = 0; i < tags.length; i++) {
            let tag = tags[i].trim()
            if (!tag) continue

            // Selbstschließende Tags erkennen
            const isSelfClosing = tag.match(/<[^>]+\/>/)
            // Inline Elemente erkennen
            const isInline = tag.match(
                /<(a|span|em|strong|code|b|i|small|time)\b[^>]*>/i
            )
            const isClosingInline = tag.match(
                /<\/(a|span|em|strong|code|b|i|small|time)>/i
            )
            // DOCTYPE oder Kommentare erkennen
            const isSpecial = tag.match(/<!([^>]+)>/)

            // Schließende Tags
            if (tag.startsWith("</")) {
                if (!isClosingInline) {
                    indent--
                    formatted += "\n" + "  ".repeat(indent)
                }
                formatted += tag
            }
            // Öffnende Tags
            else if (tag.startsWith("<")) {
                if (!isInline && !isSpecial) {
                    formatted += "\n" + "  ".repeat(indent)
                }
                formatted += tag

                if (!isSelfClosing && !isInline && !isSpecial) {
                    indent++
                }
            }
            // Textinhalt
            else {
                // Mehrzeiligen Text erhalten
                const lines = tag.split(/\n/g)
                lines.forEach((line, index) => {
                    if (index > 0) formatted += "\n" + "  ".repeat(indent)
                    formatted += line.trim()
                })
            }
        }

        return formatted.trim() + "\n"
    } catch (error) {
        console.warn("HTML Formatierungsfehler:", error)
        return html
    }
}

/**
 * Formatiert CSS-Code
 * @param {string} css - Der zu formatierende CSS-Code
 * @returns {string} Formatierter CSS-Code
 */
export function formatCSS(css) {
    if (!css || !css.trim()) return ""

    try {
        // Kommentare temporär entfernen und speichern
        const comments = []
        let cssWithoutComments = css.replace(/\/\*[\s\S]*?\*\//g, (match) => {
            comments.push(match)
            return `/*COMMENT${comments.length - 1}*/`
        })

        // Leerzeichen um Operatoren normalisieren
        cssWithoutComments = cssWithoutComments
            .replace(/\s+/g, " ")
            .replace(/([{:;,])\s+/g, "$1")
            .replace(/\s+([{:;,])/g, "$1")
            .replace(/,(\S)/g, ", $1")
            .replace(/\s*{\s*/g, " {\n    ")
            .replace(/\s*}\s*/g, "\n}\n\n")
            .replace(/;\s*/g, ";\n    ")
            .replace(/{\n\s*}/g, "{}")
            // Klammern in Media Queries
            .replace(/@media[^{]+{\s*/g, (match) => match.replace(/\s+/g, " "))
            // Extra Leerzeichen in Selektoren entfernen
            .replace(/([+>~])\s+/g, "$1")
            .replace(/\s+([+>~])/g, "$1")
            // Werte formatieren
            .replace(/:\s*(\S+\s+\S+(\s+\S+)?)/g, ": $1")

        // Kommentare wiederherstellen
        let formatted = cssWithoutComments.replace(
            /\/\*COMMENT(\d+)\*\//g,
            (_, i) => {
                const comment = comments[i]
                // Einrückung für mehrzeilige Kommentare
                return comment.includes("\n")
                    ? comment.replace(/\n/g, "\n    ")
                    : comment
            }
        )

        // Leerzeichen am Ende der Zeilen entfernen
        formatted = formatted.replace(/[ \t]+$/gm, "")

        // Überschüssige Leerzeilen reduzieren
        formatted = formatted.replace(/\n{3,}/g, "\n\n")

        return formatted.trim() + "\n"
    } catch (error) {
        console.warn("CSS Formatierungsfehler:", error)
        return css
    }
}

/**
 * Formatiert Markdown-Code
 * @param {string} markdown - Der zu formatierende Markdown-Code
 * @returns {string} Formatierter Markdown-Code
 */
 /**
 * Formatiert Markdown-Code mit Unterstützung für Data-Attribute
 * @param {string} markdown - Der zu formatierende Markdown-Code
 * @returns {string} Formatierter Markdown-Code
 */
export function formatMarkdown(markdown) {
    if (!markdown || !markdown.trim()) return "";

    try {
        // Platzhalter für Markdown-Elemente
        const markers = {
            codeBlocks: [],
            boldText: [],
            italicText: [],
            boldItalicText: [],
            inlineCode: [],
            tables: [],
            footnotes: [],
            strikethrough: [],
            taskLists: [],
            defLists: [],
            lists: []
        };

        // Hilfsfunktion für Listen-Formatierung
        function formatLists(text) {
            return text.replace(/^((?:[\t ]*[-*+]|\d+\.)[^\n]*(?:\n(?:[\t ]*(?:[-*+]|\d+\.|\s+)[^\n]+|\n(?![\t ]*(?:[-*+]|\d+\.)))*)*)+/gm, (listBlock) => {
                let currentMainLevel = -1;
                let inSublist = false;

                return "\n" + listBlock.split("\n").map(line => {
                    if (!line.trim()) return line;

                    const indent = line.match(/^[\t ]*/)[0];
                    const indentLevel = Math.floor(indent.replace(/\t/g, "    ").length / 2);
                    const listMatch = line.trimLeft().match(/^([-*+]|\d+\.)/);

                    if (listMatch) {
                        const originalMarker = listMatch[1];
                        const content = line.trim().slice(originalMarker.length).trim();

                        if (currentMainLevel === -1) {
                            currentMainLevel = indentLevel;
                        }

                        inSublist = indentLevel > currentMainLevel;
                        return "  ".repeat(indentLevel) + originalMarker + " " + content;
                    } else {
                        const targetIndent = inSublist ? indentLevel : currentMainLevel + 1;
                        return "  ".repeat(targetIndent) + line.trim();
                    }
                }).join("\n") + "\n";
            });
        }

        // ---- Markdown-Elemente sichern ----

        // 1. Code-Blöcke
        let processedText = markdown.replace(/```[\s\S]*?```/g, (match) => {
            markers.codeBlocks.push(match);
            return `\n§CODE_BLOCK_${markers.codeBlocks.length - 1}§\n`;
        });

        // 2. Inline-Code
        processedText = processedText.replace(/`[^`\n]+`/g, (match) => {
            markers.inlineCode.push(match);
            return `§INLINE_CODE_${markers.inlineCode.length - 1}§`;
        });

        // 3. Tabellen
        processedText = processedText.replace(/^\|[\s\S]*?\n[ \t]*\|[-\s|]*\|[\s\S]*?(?=\n[^|]|\n$|$)/gm, (match) => {
            markers.tables.push(match);
            return `§TABLE_${markers.tables.length - 1}§\n`;
        });

        // 4. Fußnoten
        processedText = processedText.replace(/^\[\^[^\]]+\]:[\s\S]*?(?=\n(?:\n|[\^[])|$)/gm, (match) => {
            markers.footnotes.push(match);
            return `§FOOTNOTE_${markers.footnotes.length - 1}§\n`;
        });

        // 5. Definition Lists
        processedText = processedText.replace(/^[^\n]+\n:[\s\S]*?(?=\n\n|$)/gm, (match) => {
            if (match.includes('\n: ')) {
                markers.defLists.push(match);
                return `§DEF_LIST_${markers.defLists.length - 1}§\n`;
            }
            return match;
        });

        // 6. Task Lists
        processedText = processedText.replace(/^(\s*)[*+-]\s+\[([ x])\]/gm, (match) => {
            markers.taskLists.push(match);
            return `§TASK_${markers.taskLists.length - 1}§`;
        });

        // 7. Verschachtelte Formatierungen
        processedText = processedText.replace(/\*\*\*[^*\n]+\*\*\*/g, (match) => {
            markers.boldItalicText.push(match);
            return `§BOLD_ITALIC_${markers.boldItalicText.length - 1}§`;
        });

        // 8. Strikethrough
        processedText = processedText.replace(/~~[^~\n]+~~/g, (match) => {
            markers.strikethrough.push(match);
            return `§STRIKE_${markers.strikethrough.length - 1}§`;
        });

        // 9. Fett
        processedText = processedText.replace(/\*\*[^*\n]+\*\*/g, (match) => {
            markers.boldText.push(match);
            return `§BOLD_${markers.boldText.length - 1}§`;
        });

        // 10. Kursiv
        processedText = processedText.replace(/(?<!\*)\*(?!\*)[^*\n]+\*/g, (match) => {
            markers.italicText.push(match);
            return `§ITALIC_${markers.italicText.length - 1}§`;
        });

        // 11. Listen
        processedText = processedText.replace(/^((?:[\t ]*[-*+]|\d+\.)[^\n]*(?:\n(?:[\t ]*(?![-*+]|\d+\.)[^\n]+|\n(?![\t ]*(?:[-*+]|\d+\.)))*)*)+/gm, (match) => {
            markers.lists.push(match);
            return `§LIST_${markers.lists.length - 1}§`;
        });

        // ---- Data-Attribute verarbeiten ----
        processedText = processedText.replace(/^(#{1,6}\s+.*?)(?:\s*\{([^}]+)\})*\s*$/gm, (match, header, attributes) => {
            if (!attributes) return match;

            // Sammle alle Attribute-Blöcke
            const allAttributes = match.match(/\{[^}]+\}/g) || [];
            const attrs = {};

            // Verarbeite jeden Attribute-Block
            allAttributes.forEach(attrBlock => {
                attrBlock.slice(1, -1).split(/\s+/).forEach(attr => {
                    const [key, value] = attr.split('=');
                    if (key && key.startsWith('data-')) {
                        attrs[key] = value.replace(/['"]/g, '');
                    }
                });
            });

            // Wenn keine data-Attribute gefunden wurden, Original zurückgeben
            if (Object.keys(attrs).length === 0) return match;

            // Erstelle div mit allen Attributen
            const attrString = Object.entries(attrs)
                .map(([k, v]) => `${k}="${v}"`)
                .join(' ');
            
            return `<div ${attrString}>\n${header}\n</div>`;
        });

        // ---- Basis-Formatierung durchführen ----
        let formatted = processedText
            // Überschriften
            .replace(/^(#{1,6})(?!\#)\s*/gm, "$1 ")
            .replace(/^(#{1,6}.*?)$/gm, "\n$1\n")

            // Blockquotes
            .replace(/^(>\s*.*?)$/gm, "$1\n")
            .replace(/^(>+)(?!\s)/gm, "$1 ")
            .replace(/^((?:>+\s.*\n?)+)/gm, "\n$1\n")

            // Links und Bilder
            .replace(/\[\s*(.*?)\s*\]\(\s*(.*?)\s*(?:"(.*?)")?\s*\)/g, 
                (_, text, url, title) => title ? `[${text}](${url} "${title}")` : `[${text}](${url})`)
            .replace(/!\[\s*(.*?)\s*\]\(\s*(.*?)\s*(?:"(.*?)")?\s*\)/g, 
                (_, text, url, title) => title ? `![${text}](${url} "${title}")` : `![${text}](${url})`)

            // Horizontale Linien
            .replace(/^[\s-_*]{3,}\s*$/gm, "\n---\n");

        // ---- Gesicherte Elemente wiederherstellen ----
        
        // Listen
        formatted = formatted.replace(/§LIST_(\d+)§/g, (_, i) => formatLists(markers.lists[i]));

        // Definition Lists
        formatted = formatted.replace(/§DEF_LIST_(\d+)§/g, (_, i) => {
            const list = markers.defLists[i];
            return '\n' + list.split('\n').map(line => {
                if (line.startsWith(': ')) {
                    return ':   ' + line.slice(2).trim();
                }
                return line;
            }).join('\n') + '\n';
        });

        // Task Lists
        formatted = formatted.replace(/§TASK_(\d+)§/g, (_, i) => {
            return markers.taskLists[i].replace(/\[([ x])\]/, 
                (match, check) => `[${check === 'x' ? 'x' : ' '}]`);
        });

        // Tabellen
        formatted = formatted.replace(/§TABLE_(\d+)§/g, (_, i) => {
            const table = markers.tables[i];
            const rows = table.trim().split('\n');
            
            const cellWidths = [];
            rows.forEach(row => {
                const cells = row.split('|').filter((_, i, arr) => i > 0 && i < arr.length - 1);
                cells.forEach((cell, i) => {
                    cellWidths[i] = Math.max(cellWidths[i] || 0, cell.trim().length);
                });
            });
            
            return '\n' + rows.map((row, rowIndex) => {
                const cells = row.split('|').filter((_, i, arr) => i > 0 && i < arr.length - 1);
                if (rowIndex === 1) {
                    return '|' + cells.map((cell, i) => {
                        const align = cell.trim();
                        const width = cellWidths[i];
                        if (align.startsWith(':') && align.endsWith(':')) return ` ${':'.padEnd(width - 1, '-')}:`;
                        if (align.startsWith(':')) return ` ${':'.padEnd(width, '-')} `;
                        if (align.endsWith(':')) return ` ${'-'.repeat(width - 1)}:`;
                        return ` ${'-'.repeat(width)} `;
                    }).join('|') + '|';
                }
                return '|' + cells.map((cell, i) => ` ${cell.trim().padEnd(cellWidths[i])} `).join('|') + '|';
            }).join('\n') + '\n';
        });

        // Fußnoten
        formatted = formatted.replace(/§FOOTNOTE_(\d+)§/g, (_, i) => {
            const [ref, content] = markers.footnotes[i].split(']:');
            return `${ref.trim()}]: ${content.trim()}\n`;
        });

        // Code-Blöcke
        formatted = formatted.replace(/§CODE_BLOCK_(\d+)§/g, (_, i) => {
            const block = markers.codeBlocks[i];
            const lang = block.match(/```(\w+)?/)?.[1] || '';
            const code = block.replace(/```(\w+)?\n/, '').replace(/```$/, '').trim();
            return `\n\`\`\`${lang}\n${code}\n\`\`\`\n`;
        });

        // Inline-Formatierungen
        formatted = formatted
            .replace(/§INLINE_CODE_(\d+)§/g, (_, i) => markers.inlineCode[i])
            .replace(/§BOLD_ITALIC_(\d+)§/g, (_, i) => markers.boldItalicText[i])
            .replace(/§STRIKE_(\d+)§/g, (_, i) => markers.strikethrough[i])
            .replace(/§BOLD_(\d+)§/g, (_, i) => markers.boldText[i])
            .replace(/§ITALIC_(\d+)§/g, (_, i) => markers.italicText[i]);

        // Finale Bereinigung
        return formatted
            .replace(/\n{3,}/g, '\n\n')    // Reduziere mehrfache Leerzeilen
            .replace(/^\n+/, '')           // Entferne Leerzeilen am Anfang
            .replace(/\n+$/, '\n')         // Nur eine Leerzeile am Ende
            .trim() + '\n';

    } catch (error) {
        console.warn("Markdown Formatierungsfehler:", error);
        return markdown;
    }
}