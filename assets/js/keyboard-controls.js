document.addEventListener("DOMContentLoaded", () => {
    // - - - - -
    const message = document.createElement("dialog")
    message.setAttribute("open", "true")
    message.setAttribute("aria-hidden", "true")
    message.style = `display:block;position:fixed;bottom:1vh;left:80vw;transform:translate(-50%,-50%);padding:1rem;background:hsla(0deg,0%,0%,0.85);color:hsla(0deg,0%,100%,0.85);border:1px solid #000;border-radius: 4rem;z-index:9999;font-size:0.7rem;font-family:monospace;`
    message.textContent = ``
    setTimeout(() => {
        message.textContent =``
    }, 5000)
    document.body.appendChild(message)

    const table = document.getElementById("data-table")
    const cells = table.querySelectorAll("table,  td,  th")
    const cellsPerRow = table.querySelectorAll("tr:first-child th").length
    let currentCellIndex = 0

    table.addEventListener("focus", (event) => {
        cells.forEach((cell, index) => {
            cell.setAttribute("tabindex", "1") // Add tabindex to make cells focusable

            cell.addEventListener("keydown", (event) => {
                switch (event.key) {
                    case "ArrowDown":
                        if (index < cells.length - cellsPerRow) {
                            event.preventDefault()
                            cells[currentCellIndex].blur()
                            currentCellIndex = index + cellsPerRow
                            cells[currentCellIndex].focus()
                        }
                        break
                    case "ArrowUp":
                        if (index >= cellsPerRow) {
                            event.preventDefault()
                            cells[currentCellIndex].blur()
                            currentCellIndex = index - cellsPerRow
                            cells[currentCellIndex].focus()
                        }
                        break
                    case "Tab":
                    case "ArrowRight":
                    case "ArrowLeft":
                        event.preventDefault()
                        if (event.shiftKey || event.key === "ArrowLeft") {
                            currentCellIndex =
                                (currentCellIndex - 1 + cells.length) %
                                cells.length
                        } else {
                            currentCellIndex = (index + 1) % cells.length
                        }
                        cells[currentCellIndex].focus()
                        break
                    case "Escape":
                        cells[currentCellIndex].blur()
                        cells.forEach((cell) =>
                            cell.removeAttribute("tabindex")
                        )
                        const nextElement = table.nextElementSibling

                        if (nextElement) {
                            nextElement.focus()
                        }
                        break
                }
            })
        })

        message.textContent = `new tabs set`
            setTimeout(() => {
                message.textContent = ``
            }, 5000)
    })

    // - - - - -
})
