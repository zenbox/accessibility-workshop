const WebSocket = require("ws")
const randomColor = require("randomcolor")
const fs = require("fs")
const https = require("https")
const path = require("path")
const os = require("os")

const DEFAULT_WS_PORT = 21665
const DEFAULT_WS_HOST = "0.0.0.0"
const WS_PORT = Number.parseInt(
    process.env.WS_PORT || process.env.PORT || String(DEFAULT_WS_PORT),
    10
)
const effectiveWsPort = Number.isFinite(WS_PORT) ? WS_PORT : DEFAULT_WS_PORT

// Bind on all interfaces by default so it works on remote/Ubuntu servers.
// Override with WS_HOST/HOST if you need to restrict exposure.
const WS_HOST = String(
    process.env.WS_HOST || process.env.HOST || DEFAULT_WS_HOST
).trim()
const effectiveWsHost = WS_HOST || DEFAULT_WS_HOST

// Optional TLS (WSS) mode: provide absolute paths via env vars.
// This avoids the need for a reverse proxy, but requires:
// - the port to be reachable publicly (firewall/security group)
// - a valid TLS certificate for the hostname (Let's Encrypt etc.)
const TLS_KEY_PATH = String(process.env.WS_TLS_KEY || "").trim()
const TLS_CERT_PATH = String(process.env.WS_TLS_CERT || "").trim()
const useTls = Boolean(TLS_KEY_PATH && TLS_CERT_PATH)

let httpServer = null
let server = null

if (useTls) {
    const key = fs.readFileSync(TLS_KEY_PATH)
    const cert = fs.readFileSync(TLS_CERT_PATH)
    httpServer = https.createServer({ key, cert }, (req, res) => {
        res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" })
        res.end("WebSocket server is running.\n")
    })
    server = new WebSocket.Server({ server: httpServer })
    httpServer.listen({ port: effectiveWsPort, host: effectiveWsHost })
} else {
    server = new WebSocket.Server({
        port: effectiveWsPort,
        host: effectiveWsHost,
    })
}

// ---------------------------------------------------------------------------
// Bestehende Collaborative-Editor-Logik (nicht verändern/brechen)
let users = []
let documentContent = ""

// ---------------------------------------------------------------------------
// WCAG-Test Kollaboration (Session-basierte Zustands-Synchronisation)
// Zentraler Speicher: lokales Dateisystem auf dem Host, keine Cloud.
const wcagSessions = new Map()

// IMPORTANT:
// When serving pages via Live Server (e.g. https://127.0.0.1:5504), any file change
// inside the workspace folder can trigger a full page reload.
// Our collaboration layer saves state to disk frequently (on ops), so storing files
// under the workspace would cause constant reloads (WS close code 1001).
// Therefore we store outside the workspace by default.
const BASE_STORE_DIR = String(process.env.COLLAB_STORE_DIR || "").trim()
    ? path.resolve(process.env.COLLAB_STORE_DIR)
    : path.join(os.homedir(), ".a11y-workshop-collab")

const WCAG_STORE_DIR = path.join(BASE_STORE_DIR, "sessions")

// ---------------------------------------------------------------------------
// Workspace Kollaboration (Treemap v4 + Whiteboard)
// Gemeinsames JSON-Schema (später kompatibel mit WCAG-Test zusammenführbar)
const workspaceSessions = new Map()
const WORKSPACE_STORE_DIR = path.join(BASE_STORE_DIR, "workspaces")

function sessionStats() {
    let totalClients = 0
    for (const session of wcagSessions.values()) {
        totalClients += session.clients?.size || 0
    }
    return {
        sessions: wcagSessions.size,
        totalClients,
    }
}

function logListening() {
    console.log("✅ WebSocket Server gestartet")
    console.log(
        `- Mode: ${useTls ? "wss" : "ws"} (${useTls ? "TLS" : "no TLS"})`
    )
    console.log(`- Bind: ${effectiveWsHost}:${effectiveWsPort}`)
    try {
        const isPrivateIpv4 = (ip) => {
            const s = String(ip || "").trim()
            const m = s.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/)
            if (!m) return false
            const a = Number(m[1])
            const b = Number(m[2])
            if (
                ![a, b, Number(m[3]), Number(m[4])].every(
                    (n) => n >= 0 && n <= 255
                )
            ) {
                return false
            }
            // RFC1918
            if (a === 10) return true
            if (a === 172 && b >= 16 && b <= 31) return true
            if (a === 192 && b === 168) return true
            return false
        }

        const nets = os.networkInterfaces()
        const candidates = []
        for (const addrs of Object.values(nets || {})) {
            for (const addr of addrs || []) {
                if (!addr || addr.internal) continue
                if (addr.family !== "IPv4" && addr.family !== 4) continue
                candidates.push(addr.address)
            }
        }
        const unique = Array.from(new Set(candidates)).sort()
        if (unique.length) {
            console.log("- Erreichbar (Beispiele):")
            for (const ip of unique.slice(0, 6)) {
                console.log(`  - ws://${ip}:${effectiveWsPort}`)
            }
            if (unique.length > 6) {
                console.log(`  - … (${unique.length - 6} weitere)`)
            }

            const hasNonPrivate = unique.some((ip) => !isPrivateIpv4(ip))
            if (!hasNonPrivate) {
                console.log(
                    "- Hinweis: Das sind private IPs (z.B. 172.16–31.x.x). Von außerhalb (Internet) ist der WS-Port so meist NICHT direkt erreichbar."
                )
                console.log(
                    "  Typisch brauchst du entweder (a) Security-Group/UFW Port-Freigabe + Public-IP oder (b) einen Reverse-Proxy über 443 (wss://...) der auf ws://127.0.0.1:" +
                        effectiveWsPort +
                        " weiterleitet."
                )
            }
        }
    } catch {
        // ignore
    }
    console.log(`- WCAG Session Store: ${WCAG_STORE_DIR}`)
    console.log(`- Workspace Store: ${WORKSPACE_STORE_DIR}`)
}

// In TLS mode the underlying HTTP server emits the listening event.
if (httpServer) {
    httpServer.on("listening", logListening)
} else {
    server.on("listening", logListening)
}

function handleServerError(err) {
    console.error("❌ WebSocket Server Fehler:", err?.message || err)
    if (err && err.code === "EADDRINUSE") {
        console.error(
            `❌ Port ${effectiveWsPort} ist bereits belegt. Stoppe den anderen Prozess oder ändere den Port (z.B. \\"WS_PORT=21666 node server.js\\").`
        )
    }
    process.exitCode = 1
}

server.on("error", handleServerError)
if (httpServer) httpServer.on("error", handleServerError)

function ensureWcagStoreDir() {
    try {
        fs.mkdirSync(WCAG_STORE_DIR, { recursive: true })
    } catch (e) {
        console.error("❌ Konnte WCAG Store Dir nicht erstellen:", e)
    }
}

function ensureWorkspaceStoreDir() {
    try {
        fs.mkdirSync(WORKSPACE_STORE_DIR, { recursive: true })
    } catch (e) {
        console.error("❌ Konnte Workspace Store Dir nicht erstellen:", e)
    }
}

function sanitizeSessionId(sessionId) {
    return String(sessionId || "")
        .trim()
        .replace(/[^a-zA-Z0-9_-]/g, "_")
        .slice(0, 64)
}

function getWorkspaceFilePath(sessionId) {
    return path.join(
        WORKSPACE_STORE_DIR,
        `${sanitizeSessionId(sessionId)}.json`
    )
}

function loadWorkspaceFromDisk(sessionId) {
    ensureWorkspaceStoreDir()
    const filePath = getWorkspaceFilePath(sessionId)
    try {
        if (!fs.existsSync(filePath)) return null
        const raw = fs.readFileSync(filePath, "utf8")
        const parsed = JSON.parse(raw)
        if (!parsed || typeof parsed !== "object") return null
        if (!parsed.state) return null
        console.log(
            `📥 Workspace geladen: ${sanitizeSessionId(sessionId)} (rev ${typeof parsed.rev === "number" ? parsed.rev : 0})`
        )
        return {
            rev: typeof parsed.rev === "number" ? parsed.rev : 0,
            state: parsed.state,
        }
    } catch (e) {
        console.error("❌ Fehler beim Laden des Workspace:", sessionId, e)
        return null
    }
}

function saveWorkspaceToDisk(sessionId, session) {
    ensureWorkspaceStoreDir()
    const filePath = getWorkspaceFilePath(sessionId)
    try {
        fs.writeFileSync(
            filePath,
            JSON.stringify(
                {
                    sessionId: sanitizeSessionId(sessionId),
                    rev: session.rev,
                    savedAt: new Date().toISOString(),
                    state: session.state,
                },
                null,
                2
            ),
            "utf8"
        )
        console.log(
            `💾 Workspace gespeichert: ${sanitizeSessionId(sessionId)} (rev ${session.rev}) -> ${path.relative(
                process.cwd(),
                filePath
            )}`
        )
    } catch (e) {
        console.error("❌ Fehler beim Speichern des Workspace:", sessionId, e)
    }
}

function scheduleWorkspaceSave(
    session,
    { delayMs = 250, immediate = false } = {}
) {
    if (!session) return
    if (session.__workspaceSaveTimeout) {
        clearTimeout(session.__workspaceSaveTimeout)
        session.__workspaceSaveTimeout = 0
    }
    if (immediate) {
        saveWorkspaceToDisk(session.id, session)
        return
    }
    session.__workspaceSaveTimeout = setTimeout(
        () => {
            session.__workspaceSaveTimeout = 0
            saveWorkspaceToDisk(session.id, session)
        },
        Math.max(0, Number(delayMs) || 0)
    )
}

function getOrCreateWorkspace(sessionId) {
    const id = sanitizeSessionId(sessionId)
    if (!id) return null

    if (!workspaceSessions.has(id)) {
        const fromDisk = loadWorkspaceFromDisk(id)
        workspaceSessions.set(id, {
            id,
            rev: fromDisk?.rev ?? 0,
            state: fromDisk?.state ?? null,
            clients: new Set(),
            users: new Map(), // clientId -> { username, color }
        })
    }
    const session = workspaceSessions.get(id)
    ensureWorkspaceStateShape(session)
    return session
}

function workspaceBroadcast(session, payload, excludeSocket = null) {
    const msg = JSON.stringify(payload)
    session.clients.forEach((clientSocket) => {
        if (excludeSocket && clientSocket === excludeSocket) return
        if (clientSocket.readyState === WebSocket.OPEN) {
            clientSocket.send(msg)
        }
    })
}

function workspaceUserList(session) {
    return Array.from(session.users.entries()).map(([clientId, user]) => ({
        clientId,
        username: user.username,
        color: user.color,
    }))
}

function ensureWorkspaceStateShape(session) {
    if (!session.state || typeof session.state !== "object") {
        session.state = {
            version: 1,
            wcagTest: null,
            collections: {},
            whiteboard: { items: {} },
            meta: { updatedAt: new Date().toISOString() },
        }
    }
    session.state.collections = session.state.collections || {}
    session.state.whiteboard = session.state.whiteboard || {}
    session.state.whiteboard.items = session.state.whiteboard.items || {}
    session.state.whiteboard.hiddenThemes =
        session.state.whiteboard.hiddenThemes || {}
    session.state.whiteboard.textFrames =
        session.state.whiteboard.textFrames || {}
    session.state.whiteboard.zOrder = Array.isArray(
        session.state.whiteboard.zOrder
    )
        ? session.state.whiteboard.zOrder
        : []
    session.state.whiteboard.locks = session.state.whiteboard.locks || {}
    session.state.meta = session.state.meta || {}
    session.state.meta.updatedAt = new Date().toISOString()
}

function workspaceStateHasContent(state) {
    if (!state || typeof state !== "object") return false
    const collections = state.collections || {}
    const hasCollections = Object.keys(collections).some((k) => {
        const arr = collections[k]
        return Array.isArray(arr) && arr.length > 0
    })
    const wb = state.whiteboard || {}
    const hasItems =
        wb.items &&
        typeof wb.items === "object" &&
        Object.keys(wb.items).length > 0
    const hasText =
        wb.textFrames &&
        typeof wb.textFrames === "object" &&
        Object.keys(wb.textFrames).length > 0
    return Boolean(hasCollections || hasItems || hasText)
}

function applyWorkspaceOp(session, op, { clientId, username }) {
    ensureWorkspaceStateShape(session)
    if (!op || typeof op !== "object") return false
    const t = String(op.type || "")
    const wb = session.state.whiteboard

    if (t === "collections.toggle") {
        const theme = String(op.theme || "").trim()
        const criteriaId = String(op.criteriaId || "").trim()
        if (!theme || !criteriaId) return false
        session.state.collections = session.state.collections || {}
        const existing = Array.isArray(session.state.collections[theme])
            ? session.state.collections[theme]
            : []
        if (existing.includes(criteriaId)) {
            session.state.collections[theme] = existing.filter(
                (x) => x !== criteriaId
            )
        } else {
            session.state.collections[theme] = [...existing, criteriaId]
        }
        return true
    }

    if (t === "wb.item.move") {
        const key = String(op.key || "")
        const x = Number(op.x)
        const y = Number(op.y)
        if (!key || !Number.isFinite(x) || !Number.isFinite(y)) return false
        wb.items[key] = {
            x: Math.round(Math.max(0, x)),
            y: Math.round(Math.max(0, y)),
        }
        return true
    }

    if (t === "wb.items.batch") {
        const updates = Array.isArray(op.updates) ? op.updates : []
        if (!updates.length) return false
        for (const u of updates) {
            const key = String(u?.key || "")
            const x = Number(u?.x)
            const y = Number(u?.y)
            if (!key || !Number.isFinite(x) || !Number.isFinite(y)) continue
            wb.items[key] = {
                x: Math.round(Math.max(0, x)),
                y: Math.round(Math.max(0, y)),
            }
        }
        return true
    }

    if (t === "wb.hidden.set") {
        const theme = String(op.theme || "").trim()
        if (!theme) return false
        wb.hiddenThemes[theme] = Boolean(op.hidden)
        return true
    }

    if (t === "wb.text.create") {
        const id = String(op.id || "")
        const x = Number(op.x)
        const y = Number(op.y)
        if (!id || !Number.isFinite(x) || !Number.isFinite(y)) return false
        wb.textFrames[id] = wb.textFrames[id] || {}
        wb.textFrames[id].text = String(op.text || "")
        wb.items[id] = {
            x: Math.round(Math.max(0, x)),
            y: Math.round(Math.max(0, y)),
        }
        return true
    }

    if (t === "wb.text.set") {
        const id = String(op.id || "")
        if (!id) return false
        wb.textFrames[id] = wb.textFrames[id] || {}
        wb.textFrames[id].text = String(op.text || "")
        return true
    }

    if (t === "wb.zorder.set") {
        const z = Array.isArray(op.zOrder) ? op.zOrder : null
        if (!z) return false
        wb.zOrder = z.map((k) => String(k || "")).filter(Boolean)
        return true
    }

    if (t === "wb.lock") {
        const id = String(op.id || "")
        const locked = Boolean(op.locked)
        if (!id) return false

        if (locked) {
            wb.locks[id] = {
                clientId: String(clientId || ""),
                username: String(username || "").trim() || "Anonym",
                at: new Date().toISOString(),
            }
            return true
        }

        // Only the lock owner may clear the lock.
        const existing = wb.locks[id]
        if (!existing) return true
        if (String(existing.clientId || "") !== String(clientId || "")) {
            return false
        }
        delete wb.locks[id]
        return true
    }

    if (t === "wb.lock.releaseByClient") {
        const by = String(op.clientId || "")
        if (!by) return false
        const locks = wb.locks || {}
        let changed = false
        for (const [id, lock] of Object.entries(locks)) {
            if (String(lock?.clientId || "") === by) {
                delete locks[id]
                changed = true
            }
        }
        wb.locks = locks
        return changed
    }

    return false
}

function getWcagSessionFilePath(sessionId) {
    return path.join(WCAG_STORE_DIR, `${sanitizeSessionId(sessionId)}.json`)
}

function loadWcagSessionFromDisk(sessionId) {
    ensureWcagStoreDir()
    const filePath = getWcagSessionFilePath(sessionId)
    try {
        if (!fs.existsSync(filePath)) return null
        const raw = fs.readFileSync(filePath, "utf8")
        const parsed = JSON.parse(raw)
        if (!parsed || typeof parsed !== "object") return null
        if (!parsed.state) return null
        console.log(
            `📥 WCAG Session geladen: ${sanitizeSessionId(sessionId)} (rev ${typeof parsed.rev === "number" ? parsed.rev : 0})`
        )
        return {
            rev: typeof parsed.rev === "number" ? parsed.rev : 0,
            state: parsed.state,
        }
    } catch (e) {
        console.error("❌ Fehler beim Laden der WCAG Session:", sessionId, e)
        return null
    }
}

function saveWcagSessionToDisk(sessionId, session) {
    ensureWcagStoreDir()
    const filePath = getWcagSessionFilePath(sessionId)
    try {
        fs.writeFileSync(
            filePath,
            JSON.stringify(
                {
                    sessionId: sanitizeSessionId(sessionId),
                    rev: session.rev,
                    savedAt: new Date().toISOString(),
                    state: session.state,
                },
                null,
                2
            ),
            "utf8"
        )
        console.log(
            `💾 WCAG Session gespeichert: ${sanitizeSessionId(sessionId)} (rev ${session.rev}) -> ${path.relative(
                process.cwd(),
                filePath
            )}`
        )
    } catch (e) {
        console.error(
            "❌ Fehler beim Speichern der WCAG Session:",
            sessionId,
            e
        )
    }
}

function getOrCreateWcagSession(sessionId) {
    const id = sanitizeSessionId(sessionId)
    if (!id) return null

    if (!wcagSessions.has(id)) {
        const fromDisk = loadWcagSessionFromDisk(id)
        wcagSessions.set(id, {
            id,
            rev: fromDisk?.rev ?? 0,
            state: fromDisk?.state ?? null,
            clients: new Set(),
            users: new Map(), // clientId -> { username, color }
        })
    }
    return wcagSessions.get(id)
}

function wcagBroadcast(session, payload, excludeSocket = null) {
    const msg = JSON.stringify(payload)
    session.clients.forEach((clientSocket) => {
        if (excludeSocket && clientSocket === excludeSocket) return
        if (clientSocket.readyState === WebSocket.OPEN) {
            clientSocket.send(msg)
        }
    })
}

function wcagUserList(session) {
    return Array.from(session.users.entries()).map(([clientId, user]) => ({
        clientId,
        username: user.username,
        color: user.color,
    }))
}

server.on("connection", (socket, req) => {
    const ua = String(req?.headers?.["user-agent"] || "").slice(0, 160)
    const origin = String(req?.headers?.origin || "").slice(0, 160)
    socket.__userAgent = ua
    socket.__origin = origin
    socket.on("message", (message) => {
        let data
        try {
            data = JSON.parse(message)
        } catch (e) {
            console.error("❌ Ungültige WS-Nachricht (kein JSON)")
            return
        }

        // ------------------------------------------------------------
        // Workspace Kollaboration (Treemap v4 + Whiteboard)
        if (data.type === "workspace-join") {
            const sessionId = data.sessionId
            const clientId = String(data.clientId || "").trim()
            const username = String(data.username || "").trim() || "Anonym"

            const session = getOrCreateWorkspace(sessionId)
            if (!session || !clientId) {
                socket.send(
                    JSON.stringify({
                        type: "workspace-error",
                        message: "Ungültige Session oder Client-ID",
                    })
                )
                return
            }

            socket.__workspaceSessionId = session.id
            socket.__workspaceClientId = clientId

            // Prevent multiple concurrent sockets with the same clientId in one session.
            // This can happen when a link with clientId was shared, or during fast reconnects.
            // We treat the new join as the latest connection and close the previous one.
            for (const other of session.clients) {
                if (other === socket) continue
                if (other.__workspaceClientId === clientId) {
                    try {
                        other.close(4000, "Replaced by new connection")
                    } catch {
                        // ignore
                    }
                    session.clients.delete(other)
                }
            }

            session.clients.add(socket)
            if (!session.users.has(clientId)) {
                session.users.set(clientId, {
                    username,
                    color: randomColor(),
                })
            } else {
                const existing = session.users.get(clientId)
                existing.username = username
                session.users.set(clientId, existing)
            }

            socket.send(
                JSON.stringify({
                    type: "workspace-state",
                    sessionId: session.id,
                    rev: session.rev,
                    state: session.state,
                })
            )

            console.log(
                `👥 Workspace join: session=${session.id} user=${username} clientId=${clientId} (clients in session: ${session.clients.size}) ua=${String(
                    socket.__userAgent || ""
                )} origin=${String(socket.__origin || "")}`
            )

            workspaceBroadcast(session, {
                type: "workspace-user-list",
                sessionId: session.id,
                users: workspaceUserList(session),
            })
            return
        }

        if (data.type === "workspace-request-state") {
            const session = getOrCreateWorkspace(data.sessionId)
            if (!session) return
            socket.send(
                JSON.stringify({
                    type: "workspace-state",
                    sessionId: session.id,
                    rev: session.rev,
                    state: session.state,
                })
            )
            return
        }

        if (data.type === "workspace-update") {
            const session = getOrCreateWorkspace(data.sessionId)
            if (!session) return

            // Full snapshots can easily overwrite newer op-based changes and feel like
            // a "document reset". Therefore we only accept workspace-update as an initial
            // seed when the server state is still empty.
            const hadContent = workspaceStateHasContent(session.state)
            const incomingHasContent = workspaceStateHasContent(data.state)
            if (hadContent || !incomingHasContent) {
                console.log(
                    `⛔️ Ignored workspace-update (snapshots disabled): session=${session.id} by=${String(
                        data.clientId || ""
                    )}`
                )
                return
            }

            session.rev = (session.rev || 0) + 1
            session.state = data.state
            ensureWorkspaceStateShape(session)
            scheduleWorkspaceSave(session, { immediate: true })

            console.log(
                `📝 Workspace seed: session=${session.id} rev=${session.rev} by=${String(
                    data.clientId || ""
                )}`
            )

            workspaceBroadcast(session, {
                type: "workspace-state",
                sessionId: session.id,
                rev: session.rev,
                state: session.state,
                updatedBy: String(data.clientId || ""),
            })
            return
        }

        if (data.type === "workspace-op") {
            const session = getOrCreateWorkspace(data.sessionId)
            if (!session) return

            const clientId = String(data.clientId || "").trim()
            const username =
                session.users.get(clientId)?.username ||
                String(data.username || "")

            const ok = applyWorkspaceOp(session, data.op, {
                clientId,
                username,
            })
            if (!ok) return

            session.rev = (session.rev || 0) + 1
            {
                const t = String(data.op?.type || "")
                const isMove = t === "wb.item.move" || t === "wb.items.batch"
                scheduleWorkspaceSave(session, {
                    delayMs: isMove ? 700 : 200,
                })
            }

            console.log(
                `🧩 Workspace op: session=${session.id} rev=${session.rev} by=${clientId} op=${String(
                    data.op?.type || ""
                )}`
            )

            workspaceBroadcast(session, {
                type: "workspace-op",
                sessionId: session.id,
                rev: session.rev,
                op: data.op,
                updatedBy: clientId,
            })
            return
        }

        // ------------------------------------------------------------
        // WCAG-Test Kollaboration
        if (data.type === "wcag-join") {
            const sessionId = data.sessionId
            const clientId = String(data.clientId || "").trim()
            const username = String(data.username || "").trim() || "Anonym"

            const session = getOrCreateWcagSession(sessionId)
            if (!session || !clientId) {
                socket.send(
                    JSON.stringify({
                        type: "wcag-error",
                        message: "Ungültige Session oder Client-ID",
                    })
                )
                return
            }

            socket.__wcagSessionId = session.id
            socket.__wcagClientId = clientId

            session.clients.add(socket)
            if (!session.users.has(clientId)) {
                session.users.set(clientId, {
                    username,
                    color: randomColor(),
                })
            } else {
                // Name aktualisieren, falls sich der Client neu verbindet
                const existing = session.users.get(clientId)
                existing.username = username
                session.users.set(clientId, existing)
            }

            // Initial State an den neuen Client
            socket.send(
                JSON.stringify({
                    type: "wcag-state",
                    sessionId: session.id,
                    rev: session.rev,
                    state: session.state,
                })
            )

            const stats = sessionStats()
            console.log(
                `👥 WCAG join: session=${session.id} user=${username} clientId=${clientId} (clients in session: ${session.clients.size}, sessions total: ${stats.sessions}, clients total: ${stats.totalClients})`
            )

            // User-List broadcast
            wcagBroadcast(session, {
                type: "wcag-user-list",
                sessionId: session.id,
                users: wcagUserList(session),
            })
            return
        }

        if (data.type === "wcag-request-state") {
            const session = getOrCreateWcagSession(data.sessionId)
            if (!session) return
            socket.send(
                JSON.stringify({
                    type: "wcag-state",
                    sessionId: session.id,
                    rev: session.rev,
                    state: session.state,
                })
            )
            return
        }

        if (data.type === "wcag-update") {
            const session = getOrCreateWcagSession(data.sessionId)
            if (!session) return

            // Last-write-wins: Server akzeptiert den neuen Gesamtzustand und bump't die Revision.
            session.rev = (session.rev || 0) + 1
            session.state = data.state
            saveWcagSessionToDisk(session.id, session)

            console.log(
                `📝 WCAG update: session=${session.id} rev=${session.rev} by=${String(
                    data.clientId || ""
                )}`
            )

            wcagBroadcast(session, {
                type: "wcag-state",
                sessionId: session.id,
                rev: session.rev,
                state: session.state,
                updatedBy: String(data.clientId || ""),
            })
            return
        }

        // ------------------------------------------------------------
        // Bestehende Collaborative-Editor-Logik
        if (data.type === "join") {
            const user = {
                username: data.username,
                color: randomColor(),
                socket,
            }
            users.push(user)

            // Sende aktuelle Benutzerliste an alle
            broadcast({
                type: "user-list",
                users: users.map((u) => ({
                    username: u.username,
                    color: u.color,
                })),
            })
        }

        if (data.type === "edit") {
            documentContent = data.content
            broadcast({ type: "edit", content: documentContent })
        }

        if (data.type === "mousemove") {
            broadcast({
                type: "mousemove",
                username: data.username,
                x: data.x,
                y: data.y,
                color: users.find((u) => u.username === data.username).color,
            })
        }
    })

    socket.on("close", (code, reason) => {
        // Workspace cleanup
        const workspaceSessionId = socket.__workspaceSessionId
        const workspaceClientId = socket.__workspaceClientId
        if (workspaceSessionId && workspaceSessions.has(workspaceSessionId)) {
            const session = workspaceSessions.get(workspaceSessionId)
            session.clients.delete(socket)

            const reasonText = reason ? String(reason) : ""
            console.log(
                `🔌 Workspace socket closed: session=${workspaceSessionId} clientId=${String(
                    workspaceClientId || ""
                )} code=${typeof code === "number" ? code : ""} reason=${reasonText} ua=${String(
                    socket.__userAgent || ""
                )}`
            )

            // Release locks held by this client.
            if (workspaceClientId && session?.state?.whiteboard?.locks) {
                const released = applyWorkspaceOp(
                    session,
                    {
                        type: "wb.lock.releaseByClient",
                        clientId: workspaceClientId,
                    },
                    { clientId: workspaceClientId, username: "" }
                )
                if (released) {
                    session.rev = (session.rev || 0) + 1
                    scheduleWorkspaceSave(session, {
                        immediate: session.clients.size === 0,
                        delayMs: 200,
                    })
                    workspaceBroadcast(session, {
                        type: "workspace-op",
                        sessionId: session.id,
                        rev: session.rev,
                        op: {
                            type: "wb.lock.releaseByClient",
                            clientId: workspaceClientId,
                        },
                        updatedBy: workspaceClientId,
                    })
                }
            }

            workspaceBroadcast(session, {
                type: "workspace-user-list",
                sessionId: session.id,
                users: workspaceUserList(session),
            })
        }

        // WCAG Session cleanup
        const sessionId = socket.__wcagSessionId
        const clientId = socket.__wcagClientId
        if (sessionId && wcagSessions.has(sessionId)) {
            const session = wcagSessions.get(sessionId)
            session.clients.delete(socket)

            // Optional: User nur entfernen, wenn kein weiterer Socket mit gleicher clientId offen ist.
            // Für die einfache Umsetzung entfernen wir bei Close den user nicht zwingend.

            wcagBroadcast(session, {
                type: "wcag-user-list",
                sessionId: session.id,
                users: wcagUserList(session),
            })
        }

        users = users.filter((user) => user.socket !== socket)
        broadcast({
            type: "user-list",
            users: users.map((u) => ({ username: u.username, color: u.color })),
        })
    })
})

function broadcast(data) {
    server.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(data))
        }
    })
}
