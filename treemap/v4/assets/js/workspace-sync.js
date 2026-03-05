/* eslint-disable no-console */

const DEFAULT_WS_PORT = 21665

function formatHostForUrl(hostname) {
    const h = String(hostname || "").trim()
    if (!h) return "localhost"
    // IPv6 needs brackets in URLs
    if (h.includes(":")) return `[${h}]`
    return h
}

export function guessDefaultWsUrl({ port = DEFAULT_WS_PORT } = {}) {
    const isHttps = globalThis.location?.protocol === "https:"
    const hostname = globalThis.location?.hostname || "localhost"
    const host = formatHostForUrl(hostname)

    // On HTTPS pages the browser will block insecure ws:// connections.
    // Default to a same-origin WSS reverse-proxy endpoint.
    if (isHttps) {
        return `wss://${host}/services/ws`
    }

    const p = Number(port)
    const effectivePort = Number.isFinite(p) ? p : DEFAULT_WS_PORT
    return `ws://${host}:${effectivePort}`
}

function safeJsonParse(text) {
    try {
        return JSON.parse(text)
    } catch {
        return null
    }
}

function debounce(fn, waitMs) {
    let timeout = null
    return (...args) => {
        if (timeout) globalThis.clearTimeout(timeout)
        timeout = globalThis.setTimeout(() => fn(...args), waitMs)
    }
}

export function getQueryParam(name, fallback = "") {
    const url = new URL(globalThis.location?.href || "http://localhost/")
    return url.searchParams.get(name) || fallback
}

export function setQueryParams(params) {
    const url = new URL(globalThis.location?.href || "http://localhost/")
    for (const [key, value] of Object.entries(params)) {
        if (
            value === undefined ||
            value === null ||
            String(value).trim() === ""
        ) {
            url.searchParams.delete(key)
        } else {
            url.searchParams.set(key, String(value))
        }
    }
    globalThis.history?.replaceState({}, "", url.toString())
}

function defaultWorkspaceState() {
    return {
        version: 1,
        wcagTest: null,
        collections: {},
        whiteboard: {
            items: {},
            hiddenThemes: {},
            textFrames: {},
            zOrder: [],
            locks: {},
        },
        meta: {
            updatedAt: new Date().toISOString(),
        },
    }
}

function workspaceStateHasContent(state) {
    if (!state || typeof state !== "object") return false
    const collections = state.collections || {}
    const hasCollections = Object.keys(collections).some((k) => {
        const arr = collections[k]
        return Array.isArray(arr) && arr.length > 0
    })
    const items = state.whiteboard?.items || {}
    const hasWhiteboard = Object.keys(items).length > 0
    const textFrames = state.whiteboard?.textFrames || {}
    const hasTextFrames = Object.keys(textFrames).length > 0
    return Boolean(hasCollections || hasWhiteboard || hasTextFrames)
}

function ensureWorkspaceShape(state) {
    if (!state || typeof state !== "object") return defaultWorkspaceState()
    state.collections = state.collections || {}
    state.whiteboard = state.whiteboard || {}
    state.whiteboard.items = state.whiteboard.items || {}
    state.whiteboard.hiddenThemes = state.whiteboard.hiddenThemes || {}
    state.whiteboard.textFrames = state.whiteboard.textFrames || {}
    state.whiteboard.zOrder = Array.isArray(state.whiteboard.zOrder)
        ? state.whiteboard.zOrder
        : []
    state.whiteboard.locks = state.whiteboard.locks || {}
    state.meta = state.meta || {}
    return state
}

function applyWorkspaceOp(state, op, { clientId, username } = {}) {
    const next = ensureWorkspaceShape(state)
    if (!op || typeof op !== "object") return next
    const t = String(op.type || "")
    const wb = next.whiteboard

    if (t === "collections.toggle") {
        const theme = String(op.theme || "").trim()
        const criteriaId = String(op.criteriaId || "").trim()
        if (!theme || !criteriaId) return next
        next.collections = next.collections || {}
        const existing = Array.isArray(next.collections[theme])
            ? next.collections[theme]
            : []
        if (existing.includes(criteriaId)) {
            next.collections[theme] = existing.filter((x) => x !== criteriaId)
        } else {
            next.collections[theme] = [...existing, criteriaId]
        }
        return next
    }

    if (t === "wb.item.move") {
        const key = String(op.key || "")
        const x = Number(op.x)
        const y = Number(op.y)
        if (!key || !Number.isFinite(x) || !Number.isFinite(y)) return next
        wb.items[key] = {
            x: Math.round(Math.max(0, x)),
            y: Math.round(Math.max(0, y)),
        }
        return next
    }

    if (t === "wb.items.batch") {
        const updates = Array.isArray(op.updates) ? op.updates : []
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
        return next
    }

    if (t === "wb.hidden.set") {
        const theme = String(op.theme || "").trim()
        if (!theme) return next
        wb.hiddenThemes[theme] = Boolean(op.hidden)
        return next
    }

    if (t === "wb.text.create") {
        const id = String(op.id || "")
        const x = Number(op.x)
        const y = Number(op.y)
        if (!id || !Number.isFinite(x) || !Number.isFinite(y)) return next
        wb.textFrames[id] = wb.textFrames[id] || {}
        wb.textFrames[id].text = String(op.text || "")
        wb.items[id] = {
            x: Math.round(Math.max(0, x)),
            y: Math.round(Math.max(0, y)),
        }
        return next
    }

    if (t === "wb.text.set") {
        const id = String(op.id || "")
        if (!id) return next
        wb.textFrames[id] = wb.textFrames[id] || {}
        wb.textFrames[id].text = String(op.text || "")
        return next
    }

    if (t === "wb.zorder.set") {
        const z = Array.isArray(op.zOrder) ? op.zOrder : null
        if (!z) return next
        wb.zOrder = z.map((k) => String(k || "")).filter(Boolean)
        return next
    }

    if (t === "wb.lock") {
        const id = String(op.id || "")
        if (!id) return next
        const locked = Boolean(op.locked)
        if (locked) {
            wb.locks[id] = {
                clientId: String(clientId || ""),
                username: String(username || "").trim() || "Anonym",
                at: new Date().toISOString(),
            }
        } else {
            const existing = wb.locks[id]
            if (!existing) return next
            if (String(existing.clientId || "") === String(clientId || "")) {
                delete wb.locks[id]
            }
        }
        return next
    }

    if (t === "wb.lock.releaseByClient") {
        const by = String(op.clientId || "")
        if (!by) return next
        const locks = wb.locks || {}
        for (const [id, lock] of Object.entries(locks)) {
            if (String(lock?.clientId || "") === by) {
                delete locks[id]
            }
        }
        wb.locks = locks
        return next
    }

    return next
}

export class WorkspaceSync {
    constructor({
        wsUrl,
        sessionId,
        clientId,
        username,
        onStatus,
        onState,
        onUsers,
    } = {}) {
        this.wsUrl = wsUrl || guessDefaultWsUrl()
        this.sessionId = sessionId || "default"
        this.clientId =
            clientId ||
            (globalThis.crypto &&
            typeof globalThis.crypto.randomUUID === "function"
                ? globalThis.crypto.randomUUID()
                : String(Date.now()) +
                  "-" +
                  Math.random().toString(16).slice(2))
        this.username = username || "Anonym"
        this.onStatus = onStatus || (() => {})
        this.onState = onState || (() => {})
        this.onUsers = onUsers || (() => {})

        this.socket = null
        this.rev = 0
        this.state = defaultWorkspaceState()
        this.isApplyingRemote = false

        this._debouncedSendUpdate = debounce(() => {
            this._sendUpdateNow()
        }, 250)
    }

    connect() {
        if (
            this.socket &&
            (this.socket.readyState === WebSocket.OPEN ||
                this.socket.readyState === WebSocket.CONNECTING)
        ) {
            return
        }

        this.onStatus({
            connected: false,
            message: `Verbinde zu ${this.wsUrl} …`,
        })
        const socket = new WebSocket(this.wsUrl)
        this.socket = socket

        socket.addEventListener("open", () => {
            this.onStatus({
                connected: true,
                message: `Verbunden (${this.sessionId})`,
            })
            socket.send(
                JSON.stringify({
                    type: "workspace-join",
                    sessionId: this.sessionId,
                    clientId: this.clientId,
                    username: this.username,
                })
            )
        })

        socket.addEventListener("message", (event) => {
            const payload =
                typeof event.data === "string"
                    ? safeJsonParse(event.data)
                    : null
            if (!payload || !payload.type) return

            if (payload.type === "workspace-error") {
                this.onStatus({
                    connected: false,
                    message: payload.message || "Serverfehler",
                })
                return
            }

            if (payload.type === "workspace-user-list") {
                this.onUsers(payload.users || [])
                return
            }

            if (payload.type === "workspace-state") {
                const incomingRev = Number(payload.rev || 0)
                if (incomingRev < this.rev) return

                // Snapshots can overwrite newer op-based changes and feel like a reset.
                // We only accept snapshots as an initial load when we don't have content yet.
                // Additionally, never accept an empty snapshot if we already have content.
                const currentHasContent = workspaceStateHasContent(this.state)
                const incomingState = ensureWorkspaceShape(
                    payload.state || defaultWorkspaceState()
                )
                const incomingHasContent =
                    workspaceStateHasContent(incomingState)
                if (currentHasContent && !incomingHasContent) {
                    return
                }
                if (currentHasContent && payload.updatedBy) {
                    return
                }

                this.rev = incomingRev
                this.isApplyingRemote = true
                this.state = incomingState
                this.isApplyingRemote = false
                this.onState({
                    state: this.state,
                    rev: this.rev,
                    updatedBy: payload.updatedBy,
                    source: "state",
                })
                return
            }

            if (payload.type === "workspace-op") {
                const incomingRev = Number(payload.rev || 0)
                if (incomingRev < this.rev) return

                this.rev = incomingRev

                // The server broadcasts ops to all clients, including the sender.
                // We already applied our own ops optimistically in sendOp().
                // Re-applying the echoed op can cause redundant UI work that feels like a reload.
                if (
                    String(payload.updatedBy || "") ===
                    String(this.clientId || "")
                ) {
                    return
                }

                this.isApplyingRemote = true
                this.state = applyWorkspaceOp(this.state, payload.op, {
                    clientId: payload.updatedBy,
                    username: "",
                })
                this.state.meta = this.state.meta || {}
                this.state.meta.updatedAt = new Date().toISOString()
                this.isApplyingRemote = false
                this.onState({
                    state: this.state,
                    rev: this.rev,
                    updatedBy: payload.updatedBy,
                    source: "op",
                    op: payload.op,
                })
                return
            }
        })

        socket.addEventListener("close", (event) => {
            const code = Number(event?.code)
            const reason = String(event?.reason || "").trim()
            const codeText = Number.isFinite(code) && code ? ` (${code})` : ""
            const reasonText = reason ? ` – ${reason}` : ""
            this.onStatus({
                connected: false,
                message: `Getrennt${codeText}${reasonText}`,
            })
            this.socket = null
        })

        socket.addEventListener("error", () => {
            this.onStatus({ connected: false, message: "WebSocket Fehler" })
        })
    }

    disconnect() {
        if (!this.socket) return
        try {
            this.socket.close()
        } catch {
            // ignore
        }
        this.socket = null
        this.onStatus({ connected: false, message: "Getrennt" })
    }

    setIdentity({ sessionId, username, wsUrl } = {}) {
        if (wsUrl) this.wsUrl = wsUrl
        if (sessionId) this.sessionId = sessionId
        if (username) this.username = username
    }

    updateState(mutatorFn) {
        const next =
            typeof structuredClone === "function"
                ? structuredClone(this.state)
                : JSON.parse(JSON.stringify(this.state))
        mutatorFn(next)
        next.meta = next.meta || {}
        next.meta.updatedAt = new Date().toISOString()

        this.state = ensureWorkspaceShape(next)
        this.onState({ state: this.state, rev: this.rev, source: "state" })
        this._debouncedSendUpdate()
    }

    sendOp(op) {
        if (!op || typeof op !== "object") return

        // Optimistic local apply.
        this.state = applyWorkspaceOp(this.state, op, {
            clientId: this.clientId,
            username: this.username,
        })
        this.state.meta = this.state.meta || {}
        this.state.meta.updatedAt = new Date().toISOString()
        this.onState({
            state: this.state,
            rev: this.rev,
            updatedBy: this.clientId,
            source: "op",
            op,
        })

        if (this.isApplyingRemote) return
        if (!this.socket || this.socket.readyState !== WebSocket.OPEN) return

        this.socket.send(
            JSON.stringify({
                type: "workspace-op",
                sessionId: this.sessionId,
                clientId: this.clientId,
                username: this.username,
                op,
            })
        )
    }

    _sendUpdateNow() {
        if (this.isApplyingRemote) return
        if (!this.socket || this.socket.readyState !== WebSocket.OPEN) return

        this.socket.send(
            JSON.stringify({
                type: "workspace-update",
                sessionId: this.sessionId,
                clientId: this.clientId,
                state: this.state,
            })
        )
    }
}
