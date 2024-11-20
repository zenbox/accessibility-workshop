const WebSocket = require("ws")
const randomColor = require("randomcolor")

const server = new WebSocket.Server({ port: 8080 })
let users = []
let documentContent = ""

server.on("connection", (socket) => {
    socket.on("message", (message) => {
        const data = JSON.parse(message)

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
