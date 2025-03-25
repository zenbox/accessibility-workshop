/**
 * markdown-loader.js
 * Enhanced functionality for loading Markdown and descriptions
 * for the Treemap v3 application
 */

// Store for descriptions cache
window.descriptionsCache = null

// Store for ID mapping
window.idMapping = null

/**
 * Initialize markdown loader
 * Loads descriptions.json and any available ID mapping
 */
async function initMarkdownLoader() {
    try {
        // Load descriptions
        await loadDescriptions()

        // Try to load ID mapping
        await loadIdMapping()

        console.log("Markdown loader initialized successfully")

        // Return true to indicate initialization was successful
        return true
    } catch (error) {
        console.error("Error initializing Markdown loader:", error)
        return false
    }
}

/**
 * Loads the descriptions.json file and caches it for tooltips
 */
async function loadDescriptions() {
    try {
        const response = await fetch("./data/descriptions.json")
        if (!response.ok) {
            console.warn(
                `Descriptions file not found or not accessible: ${response.status}`
            )
            window.descriptionsCache = {}
            return {}
        }

        const data = await response.json()
        window.descriptionsCache = data
        console.log(`Loaded ${Object.keys(data).length} descriptions`)
        return data
    } catch (error) {
        console.error("Error loading descriptions:", error)
        window.descriptionsCache = {}
        return {}
    }
}

/**
 * Attempts to load ID mapping from docs/id-mapping.json
 * This allows us to map old IDs to new IDs
 */
async function loadIdMapping() {
    try {
        const response = await fetch("./docs/id-mapping.json")
        if (!response.ok) {
            console.warn("ID mapping file not found, will use direct IDs")
            window.idMapping = {}
            return {}
        }

        const data = await response.json()
        window.idMapping = data
        console.log(`Loaded mapping for ${Object.keys(data).length} IDs`)
        return data
    } catch (error) {
        console.error("Error loading ID mapping:", error)
        window.idMapping = {}
        return {}
    }
}

/**
 * Get a mapped ID if available
 * @param {string} id - The original ID
 * @returns {string} The mapped ID or the original if no mapping exists
 */
function getMappedId(id) {
    if (window.idMapping && window.idMapping[id]) {
        return window.idMapping[id]
    }
    return id
}

/**
 * Extracts the original ID from a new format ID
 * Example: c-001-bitv-9-1.1.1a -> 9.1.1.1a
 */
function extractOriginalId(id) {
    // For new format IDs like c-001-bitv-9-1.1.1a
    const match = id.match(/c-\d+-(bitv|wcag)-([^-]+)/)
    if (match) {
        return match[2]
    }

    // For intermediate format IDs like bitv-9-1.1.1a
    const intermediateMatch = id.match(/(bitv|wcag)-(.+)/)
    if (intermediateMatch) {
        return intermediateMatch[2]
    }

    // Return the original ID if no pattern matches
    return id
}

/**
 * Loads Markdown content for a prüfschritt
 * Tries multiple possible filenames based on different ID formats
 * @param {string} id - The prüfschritt ID
 * @returns {Promise<string|null>} The Markdown content or null if not found
 */
async function loadMarkdownContent(id) {
    if (!id) {
        console.error("No ID provided for loadMarkdownContent")
        return null
    }

    // Get mapped ID if available
    const mappedId = getMappedId(id)

    // Original ID (extracted from new format if necessary)
    const originalId = extractOriginalId(mappedId)

    // Array of possible file paths to try
    const possiblePaths = [
        `./docs/${mappedId}.md`, // New format ID (c-001-bitv-9-1.1.1a.md)
        `./docs/${originalId}.md`, // Original/legacy ID (9.1.1.1a.md)
        `./docs/${id}.md`, // Fallback to the exact provided ID
    ]

    // Log paths we're trying (in debug mode)
    console.debug("Trying to load markdown from paths:", possiblePaths)

    // Try each path until successful
    for (const path of possiblePaths) {
        try {
            const response = await fetch(path)
            if (response.ok) {
                const content = await response.text()
                console.log(`Successfully loaded markdown from ${path}`)
                return content
            }
        } catch (error) {
            console.warn(`Could not load markdown from ${path}:`, error)
        }
    }

    // If all attempts failed, return null
    console.warn(`Could not find any markdown file for ID: ${id}`)
    return null
}

/**
 * Gets a tooltip description for a pruefschritt
 * @param {Object} pruefschritt - The pruefschritt object
 * @returns {string} The description to show in the tooltip
 */
function getTooltipDescription(pruefschritt) {
    if (!pruefschritt) return "Keine Beschreibung verfügbar"

    // Get the ID to look up
    const id = pruefschritt.id ? getMappedId(pruefschritt.id) : null

    // Try to get from descriptions cache
    if (id && window.descriptionsCache && window.descriptionsCache[id]) {
        return window.descriptionsCache[id]
    }

    // Fallback to pruefschritt details
    if (pruefschritt.details && pruefschritt.details.description) {
        // Try to extract first sentence
        const description = pruefschritt.details.description.trim()
        const match = description.match(/^(.+?[.!?])\s/)

        if (match) {
            return match[1]
        } else if (description.length > 150) {
            // Truncate long descriptions
            return description.substring(0, 147) + "..."
        } else {
            return description
        }
    }

    return "Keine Beschreibung verfügbar"
}

/**
 * Renders a pruefschritt details when Markdown is not available
 * @param {Object} criterion - The pruefschritt object
 * @param {HTMLElement} container - The container to render into
 */
function renderDetailsFromCriterion(criterion, container) {
    if (!criterion) {
        container.innerHTML = "<p>Keine Daten verfügbar</p>"
        return
    }

    let html = '<div class="fallback-content">'

    // Add title if not already set in the modal header
    html += `<h3>${criterion.title || "Prüfschritt"}</h3>`

    // Add conformance level badge if available
    if (criterion.conformanceLevel) {
        html += `<div class="level-badge ${criterion.conformanceLevel}">${criterion.conformanceLevel}</div>`
    }

    // Add description
    if (criterion.details && criterion.details.description) {
        html += `<div class="description">${criterion.details.description}</div>`
    } else {
        html += "<p>Keine detaillierte Beschreibung verfügbar.</p>"
    }

    // Add IDs section
    html += '<div class="ids-section">'
    if (criterion.bitvId)
        html += `<p><strong>BITV ID:</strong> ${criterion.bitvId}</p>`
    if (criterion.wcagId)
        html += `<p><strong>WCAG ID:</strong> ${criterion.wcagId}</p>`
    if (criterion.en301549Id)
        html += `<p><strong>EN301549 ID:</strong> ${criterion.en301549Id}</p>`
    if (criterion.bitInklusivId)
        html += `<p><strong>BITinklusiv ID:</strong> ${criterion.bitInklusivId}</p>`
    html += "</div>"

    // Add who section (professions)
    if (
        criterion.details &&
        Array.isArray(criterion.details.who) &&
        criterion.details.who.length > 0
    ) {
        html += '<div class="who-section">'
        html += "<h3>Beteiligte Berufsgruppen</h3>"
        html += "<ul>"
        criterion.details.who.forEach((person) => {
            html += `<li>${person}</li>`
        })
        html += "</ul></div>"
    }

    html += "</div>"
    container.innerHTML = html
}

// Override or extend the original showDetails function
function showDetails(pruefschritt) {
    if (!pruefschritt || !pruefschritt.id) {
        console.error("Invalid pruefschritt data")
        return
    }

    const modalElement = document.getElementById("sectionModal")
    const modalTitle = document.getElementById("modalTitle")
    const modalContent = document.getElementById("modalContent")

    // Set the title
    modalTitle.textContent = pruefschritt.title || "Prüfschritt Details"

    // Show loading indicator
    modalContent.innerHTML = '<div class="loading">Lade Inhalt...</div>'
    modalElement.style.display = "block"

    // Try to load the Markdown file based on ID
    loadMarkdownContent(pruefschritt.id)
        .then((content) => {
            if (content) {
                try {
                    // Parse Markdown to HTML if marked library is available
                    if (typeof marked !== "undefined") {
                        modalContent.innerHTML = marked.parse(content)
                    } else {
                        // Simple fallback if marked is not available
                        modalContent.innerHTML = content
                            .replace(/^# (.*)/gm, "<h1>$1</h1>")
                            .replace(/^## (.*)/gm, "<h2>$1</h2>")
                            .replace(/^### (.*)/gm, "<h3>$1</h3>")
                            .replace(/^- (.*)/gm, "<li>$1</li>")
                            .replace(/\n\n/g, "<br><br>")
                    }
                } catch (parseError) {
                    console.error("Error parsing markdown:", parseError)
                    modalContent.innerHTML = `<pre>${content}</pre>`
                }
            } else {
                // Fallback to details from pruefschritt object
                renderDetailsFromCriterion(pruefschritt, modalContent)
            }
        })
        .catch((error) => {
            console.error("Error loading markdown:", error)
            renderDetailsFromCriterion(pruefschritt, modalContent)
        })
}

// Override or extend the original createTooltip function
function createTooltip(pruefschritt) {
    const tooltip = document.createElement("div")
    tooltip.className = "tooltip"

    // Get description for tooltip
    const description = getTooltipDescription(pruefschritt)
    tooltip.innerHTML = description

    return tooltip
}

// Initialize when document is loaded
document.addEventListener("DOMContentLoaded", initMarkdownLoader)

// Export functions for use in other modules
window.markdownLoader = {
    loadMarkdownContent,
    getTooltipDescription,
    renderDetailsFromCriterion,
    showDetails,
    createTooltip,
    getMappedId,
}
