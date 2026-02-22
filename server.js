const WebSocket = require("ws")
const randomColor = require("randomcolor")
const fs = require("fs")
const path = require("path")

const WS_PORT = 21665
const server = new WebSocket.Server({ port: WS_PORT })

// ---------------------------------------------------------------------------
// Bestehende Collaborative-Editor-Logik (nicht verändern/brechen)
let users = []
let documentContent = ""

// ---------------------------------------------------------------------------
// WCAG-Test Kollaboration (Session-basierte Zustands-Synchronisation)
// Zentraler Speicher: lokales Dateisystem auf dem Host (localhost), keine Cloud.
const wcagSessions = new Map()

const WCAG_STORE_DIR = path.join(__dirname, ".wcag-collab", "sessions")

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

server.on("listening", () => {
    console.log("✅ WebSocket Server gestartet")
    console.log(`- Port: ${WS_PORT}`)
    console.log(`- WCAG Session Store: ${WCAG_STORE_DIR}`)
})

server.on("error", (err) => {
    console.error("❌ WebSocket Server Fehler:", err?.message || err)
    if (err && err.code === "EADDRINUSE") {
        console.error(
            `❌ Port ${WS_PORT} ist bereits belegt. Stoppe den anderen Prozess oder ändere den Port.`
        )
    }
    process.exitCode = 1
})

function ensureWcagStoreDir() {
    try {
        fs.mkdirSync(WCAG_STORE_DIR, { recursive: true })
    } catch (e) {
        console.error("❌ Konnte WCAG Store Dir nicht erstellen:", e)
    }
}

function sanitizeSessionId(sessionId) {
    return String(sessionId || "")
        .trim()
        .replace(/[^a-zA-Z0-9_-]/g, "_")
        .slice(0, 64)
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

server.on("connection", (socket) => {
    socket.on("message", (message) => {
        let data
        try {
            data = JSON.parse(message)
        } catch (e) {
            console.error("❌ Ungültige WS-Nachricht (kein JSON)")
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

    socket.on("close", () => {
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
