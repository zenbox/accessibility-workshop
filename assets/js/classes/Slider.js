export default class Slider {
    constructor(color, context) {
        this.color = color
        this.context = context
        this.context.id = `color_${this.color.id}`

        this.init()
    }

    init() {
        this.setFieldset(
            "rgb",
            this.color.r,
            this.color.g,
            this.color.b,
            this.context
        )
        this.setFieldset(
            "hsl",
            this.color.h,
            this.color.s,
            this.color.l,
            this.context
        )
        this.updateSliders()
    }

    setFieldset(type, a, b, c, context) {
        let fieldset = document.createElement("fieldset"),
            legend = document.createElement("legend")

        legend.innerText = type.toUpperCase()
        fieldset.appendChild(legend)

        let label, input, output

        switch (type) {
            case "rgb":
                label = document.createElement("label")
                input = document.createElement("input")
                output = document.createElement("output")

                label.innerText = "Red"
                label.setAttribute("for", "r")

                input.setAttribute("id", "r")
                input.setAttribute("type", "range")
                input.setAttribute("min", "0")
                input.setAttribute("max", "255")
                input.setAttribute("step", "1")
                input.setAttribute("value", a)
                input.addEventListener("input", (event) => {
                    this.onSlide(event)
                })

                output.innerText = Math.round(a)
                output.setAttribute("for", "r")

                fieldset.appendChild(input)
                fieldset.appendChild(label)
                fieldset.appendChild(output)

                context.appendChild(fieldset)

                label = document.createElement("label")
                input = document.createElement("input")
                output = document.createElement("output")

                label.innerText = "Green"
                label.setAttribute("for", "g")

                input.setAttribute("id", "g")
                input.setAttribute("type", "range")
                input.setAttribute("min", "0")
                input.setAttribute("max", "255")
                input.setAttribute("step", "1")
                input.setAttribute("value", b)
                input.addEventListener("input", (event) => {
                    this.onSlide(event)
                })

                output.innerText = Math.round(b)
                output.setAttribute("for", "g")

                fieldset.appendChild(input)
                fieldset.appendChild(label)
                fieldset.appendChild(output)

                context.appendChild(fieldset)

                label = document.createElement("label")
                input = document.createElement("input")
                output = document.createElement("output")

                label.innerText = "Blue"
                label.setAttribute("for", "b")

                input.setAttribute("id", "b")
                input.setAttribute("type", "range")
                input.setAttribute("min", "0")
                input.setAttribute("max", "255")
                input.setAttribute("step", "1")
                input.setAttribute("value", c)
                input.addEventListener("input", (event) => {
                    this.onSlide(event)
                })

                output.innerText = Math.round(c)
                output.setAttribute("for", "b")

                fieldset.appendChild(input)
                fieldset.appendChild(label)
                fieldset.appendChild(output)

                context.appendChild(fieldset)
                break

            case "hsl":
                ;(label = document.createElement("label")),
                    (input = document.createElement("input")),
                    (output = document.createElement("output"))

                label.innerText = "Hue"
                label.setAttribute("for", "h")

                input.setAttribute("id", "h")
                input.setAttribute("type", "range")
                input.setAttribute("min", "0")
                input.setAttribute("max", "1")
                input.setAttribute("step", "0.001")
                input.setAttribute("value", a)
                input.addEventListener("input", (event) => {
                    this.onSlide(event)
                })

                output.innerText = Math.round(a * 360)
                output.setAttribute("for", "h")

                fieldset.appendChild(input)
                fieldset.appendChild(label)
                fieldset.appendChild(output)

                context.appendChild(fieldset)

                label = document.createElement("label")
                input = document.createElement("input")
                output = document.createElement("output")

                label.innerText = "Saturation"
                label.setAttribute("for", "s")

                input.setAttribute("id", "s")
                input.setAttribute("type", "range")
                input.setAttribute("min", "0")
                input.setAttribute("max", "1")
                input.setAttribute("step", "0.001")
                input.setAttribute("value", b)
                input.addEventListener("input", (event) => {
                    this.onSlide(event)
                })

                output.innerText = Math.round(b * 100)
                output.setAttribute("for", "s")

                fieldset.appendChild(input)
                fieldset.appendChild(label)
                fieldset.appendChild(output)

                context.appendChild(fieldset)

                label = document.createElement("label")
                input = document.createElement("input")
                output = document.createElement("output")

                label.innerText = "Luminance"
                label.setAttribute("for", "l")

                input.setAttribute("id", "l")
                input.setAttribute("type", "range")
                input.setAttribute("min", "0")
                input.setAttribute("max", "1")
                input.setAttribute("step", "0.001")
                input.setAttribute("value", c)
                input.addEventListener("input", (event) => {
                    this.onSlide(event)
                })

                output.innerText = Math.round(c * 100)
                output.setAttribute("for", "l")

                fieldset.appendChild(input)
                fieldset.appendChild(label)
                fieldset.appendChild(output)

                context.appendChild(fieldset)
                break
        }
    }

    onSlide(event) {
        let slider = event.target
        this.color[slider.id] = slider.value

        let tmp = []
        switch (slider.id) {
            case "r":
            case "g":
            case "b":
                let hsl = this.color.rgbToHsl(
                    this.color.r,
                    this.color.g,
                    this.color.b
                )
                this.color.r = this.color.r
                this.color.g = this.color.g
                this.color.b = this.color.b
                this.color.h = hsl[0]
                this.color.s = hsl[1]
                this.color.l = hsl[2]
                break
            case "h":
            case "s":
            case "l":
                let rgb = this.color.hslToRgb(
                    this.color.h,
                    this.color.s,
                    this.color.l
                )
                this.color.h = this.color.h
                this.color.s = this.color.s
                this.color.l = this.color.l
                this.color.r = rgb[0]
                this.color.g = rgb[1]
                this.color.b = rgb[2]
                break
        }

        this.updateSliders()
    }

    updateSliders() {
        let sliders = document.querySelectorAll(
            `#color_${this.color.id} input[type=range]`
        )

        sliders.forEach((slider) => {
            let output = document.querySelector(
                `#color_${this.color.id} output[for=${slider.id}]`
            )

            slider.value = this.color[slider.id]

            switch (slider.id) {
                case "r":
                case "g":
                case "b":
                    output.value = `${Math.round(this.color[slider.id])}`
                    break
                case "h":
                    output.value = `${Math.round(360 * this.color[slider.id])}`
                    break
                case "l":
                case "s":
                    output.value = `${Math.round(100 * this.color[slider.id])}`
                    break
            }
        })

        this.context.setAttribute(
            "style",
            this.color.rgbToStyle(this.color.r, this.color.g, this.color.b)
        )
    }
}
