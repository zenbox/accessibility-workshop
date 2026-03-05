/* eslint-disable no-console */

function firstValue(obj) {
    if (!obj || typeof obj !== "object") return null
    const keys = Object.keys(obj)
    if (keys.length === 0) return null
    return obj[keys[0]]
}

export async function loadPruefschritte() {
    const response = await fetch("../../assets/data/criterias.json")
    if (!response.ok) {
        throw new Error(`Failed to load criterias.json: ${response.status}`)
    }

    const data = await response.json()
    const sections = Array.isArray(data.sections) ? data.sections : []

    const items = []
    for (
        let sectionIndex = 0;
        sectionIndex < sections.length;
        sectionIndex += 1
    ) {
        const sectionObj = sections[sectionIndex]
        const section = firstValue(sectionObj) || sectionObj
        if (!section) continue

        const sectionTitle = String(section.title || "").trim()
        const pruefschritte = Array.isArray(section.pruefschritte)
            ? section.pruefschritte
            : []

        for (const step of pruefschritte) {
            if (!step?.id) continue
            items.push({
                id: String(step.id),
                title: String(step.title || step.id),
                sectionTitle,
                sectionIndex: sectionIndex + 1,
                bitvId: step.bitvId || "",
                wcagId: step.wcagId || "",
                bitInklusivId: step.bitInklusivId || "",
                conformanceLevel: step.conformanceLevel || "",
                details: step.details || null,
            })
        }
    }

    return items
}
