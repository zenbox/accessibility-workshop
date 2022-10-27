let host = "localhost" // "192.168.188.30"
const socket = io(`ws://${host}:21665`)

socket.on("live", (data) => {
    switch (data) {
        case "update":
            window.location.reload(true)
            break
    }
})
