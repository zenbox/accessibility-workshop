import Color from "./classes/Color.js"
import Slider from "./classes/Slider.js"

window.onload = () => {
    document.body.classList.add("color-conversion")

    let context = document.querySelector("#colors"),
        sections = [],
        colors = [],
        sliders = [],
        contrastSection = document.createElement("section")

    contrastSection.classList.add("contrast")

    function contrast(rgb1, rgb2) {
        var lum1 = colors[0].luminance(rgb1[0], rgb1[1], rgb1[2])
        var lum2 = colors[1].luminance(rgb2[0], rgb2[1], rgb2[2])
        var brightest = Math.max(lum1, lum2)
        var darkest = Math.min(lum1, lum2)
        return ((brightest + 0.05) / (darkest + 0.05)).toFixed(2)
    }
    
    function switchToDark() {
        let luminance_1 = colors[0].luminance(
            colors[0]._r,
            colors[0]._g,
            colors[0]._b
        )
        let luminance_2 = colors[1].luminance(
            colors[1]._r,
            colors[1]._g,
            colors[1]._b
        )

        let treshold = 0.1825
        if (luminance_1 > treshold)
            document.querySelector("#color_0").classList.add("dark")
        else document.querySelector("#color_0").classList.remove("dark")

        if (luminance_2 > treshold)
            document.querySelector("#color_1").classList.add("dark")
        else document.querySelector("#color_1").classList.remove("dark")
    }

    // for (let index = 0; index < 2; index++) {
    //     sections[index] = document.createElement("section")
    //     colors[index] = new Color(index)
    //     sliders[index] = new Slider(colors[index], sections[index])
    //     context.appendChild(sections[index])
    // }

    // context.append(contrastSection)
    // contrastSection.innerHTML = contrast(
    //     [colors[0]._r, colors[0]._g, colors[0]._b],
    //     [colors[1]._r, colors[1]._g, colors[1]._b]
    // )

    // switchToDark()

    // document.body.addEventListener("input", (event) => {
    //     let rgb_1 = [colors[0]._r, colors[0]._g, colors[0]._b],
    //         rgb_2 = [colors[1]._r, colors[1]._g, colors[1]._b]

    //     contrastSection.innerHTML = contrast(rgb_1, rgb_2)
    //     switchToDark()
    // })

    function switchDisabilites() {
        document.querySelector("section").classList.toggle("red-disability")
    }

    console.log(contrast([255, 10, 10], [255, 255, 255]))
    // - - - - - - - - - -
}
