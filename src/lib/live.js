import { createServer } from "http"
import { Server } from "socket.io"
import chokidar from "chokidar"

class Live {
    constructor() {
        this.httpServer = createServer()
        this.init()
    }

    init() {
        this.io = new Server(this.httpServer, {
            cors: {
                origin: "http://localhost:3000", // "http://192.168.188.30:3000",
            },
        })

        this.io.on("connection", (socket) => {
            this.socket = socket
            this.connect()
            this.send("connected ...")
        })

        this.httpServer.listen(21665)
        this.addWatcher()
    }

    connect() {
        this.socket.on("live", (data) => {
            console.log(data)
        })
    }

    send(data) {
        let i = 0,
            interval = setInterval(() => {
                console.log("interval set ...")

                if (this.socket !== undefined) {
                    this.socket.emit("live", data)
                    clearInterval(interval)

                    console.log(i, "interval cleared ...")
                } else {
                    i++
                }
            }, 1000)
    }

    addWatcher() {
        this.watcher = chokidar.watch("dir", {
            ignored: /(^|[\/\\])\../, // ignore dotfiles
            persistent: true,
        })

        this.watcher.add("./static")
        this.watcher.add("./src/views")

        this.watcher.on("change", (path) => {
            console.log(`${path} changed ...`)
            this.send("update")
        })

        this.watcher.on("add", (path) => {
            console.log(`${path} add ...`)
            this.send("update")
        })
    }
}

const live = new Live()

export default live
