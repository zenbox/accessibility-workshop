import Color from "./Color.js"

export default class Ui {
    constructor() {
        this.init()
    }

    init() {
        this.setInterface()
    }

    setInterface() {
        this.interface = document.querySelector(".ui")

        if (this.interface === null) {
            this.interface = document.createElement("div")
            this.interface.setAttribute("aria-hidden", true)
            this.interface.classList.add("ui")
            this.interface.classList.add("invisibile")
            document.body.appendChild(this.interface)
        }
    }
    /**
     * @param {string} label - the button label
     * @returns {object} button with label
     */
    addButton(label, group) {
        let element = document.createElement("button"),
            content = document.createTextNode(label)

        element.classList.add("ui-button")

        element.appendChild(content)

        if (group) group.appendChild(element)
        else this.interface.appendChild(element)

        return element
    }

    /**
     * @param {string} labelText - the slider label
     * @param {string} min    - minimum value
     * @param {string} max    - maximum value
     * @param {string} value  - initial value
     * @returns {object} section with slider
     */
    addSlider(labelText = "range", min = 0, max = 1, value = 0) {
        let group = document.createElement("section"),
            input = document.createElement("input"),
            label = document.createElement("label"),
            output = document.createElement("output"),
            content = document.createTextNode(labelText)

        input.setAttribute("type", "range")
        input.setAttribute("min", min)
        input.setAttribute("max", max)
        input.setAttribute("step", "0.01")
        input.setAttribute("value", value)

        output.value = value

        label.appendChild(content)

        group.appendChild(label)
        group.appendChild(output)
        group.appendChild(input)
        group.classList.add("ui-slider")

        input.addEventListener("input", (event) => {
            output.value = input.value
        })

        this.interface.appendChild(group)

        return group
    }

    /**
     * @param {string} text - the text
     * @returns {object} span with text
     */
    addTitle(text, group) {
        let element = document.createElement("span"),
            content = document.createTextNode(text)

        element.classList.add("ui-title")

        element.appendChild(content)

        if (group) group.appendChild(element)
        else this.interface.appendChild(element)

        return element
    }

    /**
     * @param {string} id - the group id
     * @returns {object} section with id
     */
    addGroup(id) {
        let element = document.createElement("section")

        element.id = id

        this.interface.appendChild(element)

        return element
    }

    /**
     * @param {string} text - the text
     * @returns {object} section with text
     */
    addNote(text = "note") {
        let element = document.createElement("section"),
            content = document.createTextNode(text)

        element.classList.add("ui-note")

        element.appendChild(content)
        this.interface.appendChild(element)

        return element
    }

    addListWithContentArray(content) {
        let ul = document.createElement("ul")
        content.forEach((c) => {
            let li = document.createElement("li"),
                text = document.createTextNode(c)
            li.appendChild(text)
            ul.appendChild(li)
        })
        return ul
    }

    /**
     * @param {string} type    - any description, what the color is for
     * @param {string} root - root element to change the color variable
     * @param {string} context - document context to append as child
     * @param {string} color   - any color value in rgb or hsl
     * @returns {object} section with a color slider
     */
    addColorSelector(
        type,
        root = document.querySelector("svg"),
        context = document.querySelector("main"),
        color = "#00FFFF"
    ) {
        let group = document.createElement("section"),
            element = document.createElement("input"),
            label = document.createElement("label"),
            colorValue = window
                .getComputedStyle(document.querySelector(`.${type}`), null)
                .getPropertyValue("color")

        color = color.trim()

        label.innerHTML = type

        colorValue = Color.rgbToHex(colorValue)

        element.setAttribute("type", "color")
        element.setAttribute("value", colorValue)
        context.appendChild(element)

        element.addEventListener("input", (event) => {
            root.style.setProperty(`--${type}`, event.target.value)
        })

        group.appendChild(element)
        group.appendChild(label)

        this.interface.appendChild(group)

        return group
    }

    addVisionDesease(title = "vision-desease") {
        let group = this.addGroup(title),
            _title = this.addTitle(title, group),
            button = this.addButton("switch ...", group)

        button.classList.add("vision-desease")
    }
}
