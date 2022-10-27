import Ui from "./Ui.js"

export default class Responsive {
    constructor() {
        this.init()
    }

    init() {
        this.breakpoints = []
        this.ui = new Ui()
        this.ui.setInterface()
    }

    addBreakpoint(_type, _breakpoint) {
        let type = _type,
            breakpoint = _breakpoint

        this.breakpoints[type] = breakpoint

        return this.breakpoints[type]
    }

    setBreakpoints() {
        let note = this.ui.addNote("Breakpoints"),
            group = document.createElement("ul")

        note.setAttribute("id", "ui-breakpoints")

        console.log(this.breakpoints)

        for (let key in this.breakpoints) {
            let value = this.breakpoints[key],
                element = document.createElement("li"),
                content = document.createTextNode(`${key}: ${value}`)

            element.appendChild(content)
            group.appendChild(element)
        }
        note.appendChild(group)
    }

    setWindowSizes() {
        let note =
            document.querySelector("#ui-window-sizes") ||
            this.ui.addNote("Responsive Layout")

        note.setAttribute("id", "ui-window-sizes")

        let rem = parseInt(
                window
                    .getComputedStyle(document.querySelector("html"))
                    .getPropertyValue("font-size")
            ),
            w = {},
            h = {},
            context = document.querySelector("#ui-window-sizes"),
            content = []

        w.px = window.innerWidth
        h.px = window.innerHeight
        w.rem = (window.innerWidth / rem).toFixed(1)
        h.rem = (window.innerHeight / rem).toFixed(1)

        content[0] = "viewport size:"
        content[1] = `${w.px}px, ${h.px}px `
        content[2] = `${w.rem}rem, ${h.rem}rem `

        context.innerHTML = ""
        context.appendChild(this.ui.addListWithContentArray(content))
    }

    setLayer(level) {
        let context = document.body,
            level_1 = document.querySelectorAll("body > *"),
            level_2 = document.querySelectorAll("body > * > *")

        level_2.forEach((element) => {
            // element.classList.add("invisible")
        })
    }
}
