#!/usr/bin/env node

const fs = require("fs")
const path = require("path")
const crypto = require("crypto")

function sha1(input) {
    return crypto.createHash("sha1").update(String(input)).digest("hex")
}

function parseSizeFromUrl(url) {
    try {
        const u = new URL(url)
        const w = Number(u.searchParams.get("w"))
        const h = Number(u.searchParams.get("h"))
        if (Number.isFinite(w) && w > 0 && Number.isFinite(h) && h > 0)
            return { w, h }
    } catch {
        // ignore
    }
    return null
}

function pickPicsumUrl(seed, size) {
    const w = Math.max(1, Math.min(3840, Math.round(size?.w ?? 1200)))
    const h = Math.max(1, Math.min(3840, Math.round(size?.h ?? 800)))
    return `https://picsum.photos/seed/${encodeURIComponent(seed)}/${w}/${h}`
}

function replacePrismicImages(html) {
    // Replace all Prismic image URLs (in meta tags, CSS background-image, img src, etc.)
    // Matches until a quote/paren/whitespace terminator.
    const prismicRe =
        /https:\/\/(images\.prismic\.io|l-one\.cdn\.prismic\.io)\/l-one\/[^\s"')>]+/g

    let count = 0
    const replaced = html.replace(prismicRe, (match) => {
        count += 1
        const size = parseSizeFromUrl(match)
        const seed = `c-company-prismic-${sha1(match).slice(0, 10)}`
        return pickPicsumUrl(seed, size)
    })

    return { html: replaced, count }
}

function replaceImgTags(html) {
    // Replace all <img ... src="..."> that are not data: and not already picsum.
    // Keep attributes (including classes) intact.
    const imgRe = /<img\b[^>]*\bsrc=("|')([^"']+)(\1)[^>]*>/gi

    let count = 0
    const replaced = html.replace(imgRe, (full, quote, src) => {
        const trimmed = String(src).trim()
        if (/^data:/i.test(trimmed)) return full
        if (/^https?:\/\/picsum\.photos\//i.test(trimmed)) return full

        // Attempt to infer size from width/height attributes.
        const widthMatch = full.match(/\bwidth=("|')(\d+)(\1)/i)
        const heightMatch = full.match(/\bheight=("|')(\d+)(\1)/i)
        const w = widthMatch ? Number(widthMatch[2]) : undefined
        const h = heightMatch ? Number(heightMatch[2]) : undefined

        const seed = `c-company-img-${sha1(trimmed).slice(0, 10)}`
        const picsum = pickPicsumUrl(seed, { w: w ?? 800, h: h ?? 600 })

        count += 1
        return full.replace(
            new RegExp(
                `\\bsrc=${quote}${src.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}${quote}`,
                "i"
            ),
            `src=${quote}${picsum}${quote}`
        )
    })

    return { html: replaced, count }
}

function replaceBranding(html) {
    let out = html

    // Remove the original "saved from url" comment (keeps file safe to share).
    out = out.replace(
        /<!--\s*saved from url=\([^)]*\)[^>]*-->/i,
        "<!-- anonymized copy for accessibility workshop -->"
    )

    // Title
    out = out.replace(
        /<title>[^<]*<\/title>/i,
        "<title>C-Company - Die Outsourcing-Experten für Softwareentwicklung</title>"
    )

    // Meta description/keywords: replace company names but keep other text.
    out = out
        .replace(/\bL-One Systems\b/g, "C-Company")
        .replace(/\bL-One\b/g, "C-Company")

    // Also handle non-breaking hyphen variants like "L‑One".
    out = out.replace(/\bL[\u2010\u2011\u2012\u2013\u2014-]One\b/g, "C-Company")
    out = out.replace(/\bl[\u2010\u2011\u2012\u2013\u2014-]one\b/g, "c-company")

    // Lowercase phrase occurrences (common in ids / headings).
    out = out.replace(/\bl-one systems\b/gi, "c-company")

    // Domains / canonical / og:url links
    out = out
        .replace(
            /https:\/\/www\.l-one\.de\b\/?/g,
            "https://www.c-company.example/"
        )
        .replace(
            /https?:\/\/calendly\.com\/l-one-systems\//g,
            "https://calendly.com/c-company/"
        )

    // Cleanup common leftover mail/links.
    out = out
        .replace(/mailto:info@l-one\.de/gi, "mailto:info@c-company.example")
        .replace(
            /https?:\/\/l-one\.systems\//gi,
            "https://www.c-company.example/"
        )
        .replace(/https?:\/\/l-one\.de\//gi, "https://www.c-company.example/")

    // Normalize new placeholder contacts (avoid real-looking domains).
    out = out
        .replace(/mailto:info@c-company\.de/gi, "mailto:info@c-company.example")
        .replace(/\binfo@c-company\.de\b/gi, "info@c-company.example")
        .replace(
            /https?:\/\/c-company\.systems\//gi,
            "https://www.c-company.example/"
        )

    // Avoid L-One slugs in URL paths.
    out = out.replace(/\/(l-one)-/g, "/c-company-")
    out = out.replace(
        /kennenlernen-l-one-[a-z0-9-]+/gi,
        "kennenlernen-c-company"
    )

    // De-brand clutch profile link if present.
    out = out.replace(
        /https?:\/\/clutch\.co\/profile\/l-one-systems-gmbh#reviews/gi,
        "https://www.c-company.example/reviews"
    )

    // Favicon (keep rel/icon but debrand)
    out = out.replace(
        /<link\s+rel=("|')icon\1\s+href=("|')[^"']+(\2)\s*\/>?/i,
        `<link rel="icon" href="https://picsum.photos/seed/c-company-favicon/32/32">`
    )

    return out
}

function normalizeHeadMeta(html) {
    // The saved HTML has everything on one line; do conservative, idempotent replacements.
    // Ensure OG/Twitter images and canonical/icon are well-formed and not concatenated.
    const ogImage = pickPicsumUrl("c-company-og", { w: 1200, h: 627 })
    const twImage = pickPicsumUrl("c-company-twitter", { w: 1200, h: 627 })
    const canonicalHref = "https://www.c-company.example/"
    const iconHref = pickPicsumUrl("c-company-favicon", { w: 32, h: 32 })

    let out = html

    // Fix accidental double quote in og:description attribute.
    out = out.replace(
        /\bproperty=("|')og:description\1\1/gi,
        'property="og:description"'
    )

    // Fix a previously broken og:image tag that swallowed following meta tags.
    out = out.replace(
        /<meta\s+name=("|')image\1\s+property=("|')og:image\2\s+content=("|')[\s\S]*?<meta\s+property=og:description/gi,
        `<meta property="og:image" content="${ogImage}"><meta property="og:description"`
    )

    // Ensure a sane og:image tag exists.
    if (!/\bproperty=("|')og:image\1/i.test(out)) {
        out = out.replace(
            /<head[^>]*>/i,
            (m) => `${m}<meta property="og:image" content="${ogImage}">`
        )
    } else {
        out = out.replace(
            /<meta\s+[^>]*\bproperty=("|')og:image\1\b[^>]*>/gi,
            `<meta property="og:image" content="${ogImage}">`
        )
    }

    // Fix malformed twitter:image meta that may have swallowed the start of the canonical link.
    out = out.replace(
        /<meta\s+name=("|')twitter:image\1[\s\S]*?<link\s+rel=("|')canonical\2/gi,
        `<meta name="twitter:image" content="${twImage}"><link rel="canonical"`
    )

    // Ensure a sane twitter:image tag exists.
    if (!/\bname=("|')twitter:image\1/i.test(out)) {
        out = out.replace(
            /<head[^>]*>/i,
            (m) => `${m}<meta name="twitter:image" content="${twImage}">`
        )
    } else {
        out = out.replace(
            /<meta\s+[^>]*\bname=("|')twitter:image\1\b[^>]*>/gi,
            `<meta name="twitter:image" content="${twImage}">`
        )
    }

    // Canonical link
    out = out.replace(
        /<link\s+rel=("|')canonical\1\s+href=("|')[^"']*(\2)\s*\/>?/gi,
        `<link rel="canonical" href="${canonicalHref}">`
    )
    // Also fix malformed variants like <link rel=canonical" href="...">
    out = out.replace(
        /<link\s+rel=canonical[^>]*>/gi,
        `<link rel="canonical" href="${canonicalHref}">`
    )

    // Icon link
    out = out.replace(
        /<link\s+rel=("|')icon\1\s+href=("|')[^"']*(\2)\s*\/>?/gi,
        `<link rel="icon" href="${iconHref}">`
    )

    return out
}

function ensureMaterialIconsLink(html) {
    if (/fonts\.googleapis\.com\/icon\?family=Material\+Icons/i.test(html))
        return html
    const linkTag =
        '<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">'
    return html.replace(/<head[^>]*>/i, (m) => `${m}${linkTag}`)
}

function replaceCommonInlineSvgs(html) {
    let count = 0
    let out = html

    // Arrow forward (heroicons-ish): viewBox="0 0 20 20"
    out = out.replace(
        /<svg\b([^>]*\bviewBox=("|')0 0 20 20\2[^>]*)>[\s\S]*?<\/svg>/gi,
        (_full, attrs) => {
            count += 1
            // Preserve common class attribute if present
            const classMatch = attrs.match(/\bclass=("|')([^"']+)(\1)/i)
            const cls = classMatch ? classMatch[2] : ""
            const mergedClass = cls ? `material-icons ${cls}` : "material-icons"
            return `<span class="${mergedClass}">arrow_forward</span>`
        }
    )

    // Hamburger menu: viewBox="0 0 512 512"
    out = out.replace(
        /<svg\b([^>]*\bviewBox=("|')0 0 512 512\2[^>]*)>[\s\S]*?<\/svg>/gi,
        (_full, attrs) => {
            count += 1
            const classMatch = attrs.match(/\bclass=("|')([^"']+)(\1)/i)
            const cls = classMatch ? classMatch[2] : ""
            const mergedClass = cls ? `material-icons ${cls}` : "material-icons"
            return `<span class="${mergedClass}">menu</span>`
        }
    )

    return { html: out, count }
}

function main() {
    const inputPath = process.argv[2]
    if (!inputPath) {
        console.error(
            "Usage: node tools/anonymize-website-to-test.js <path-to-html>"
        )
        process.exit(2)
    }

    const abs = path.resolve(process.cwd(), inputPath)
    const original = fs.readFileSync(abs, "utf8")

    let html = original

    html = replaceBranding(html)
    html = ensureMaterialIconsLink(html)
    html = normalizeHeadMeta(html)

    const prismic = replacePrismicImages(html)
    html = prismic.html

    const imgs = replaceImgTags(html)
    html = imgs.html

    const svgs = replaceCommonInlineSvgs(html)
    html = svgs.html

    if (html === original) {
        console.log("No changes were made (already anonymized?)")
        return
    }

    fs.writeFileSync(abs, html, "utf8")
    console.log(
        JSON.stringify(
            {
                file: inputPath,
                replacedPrismicUrls: prismic.count,
                replacedImgSrc: imgs.count,
                replacedInlineSvgs: svgs.count,
            },
            null,
            2
        )
    )
}

main()
