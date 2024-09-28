class CelestialBody {
    constructor(name, symbol, L0, M0, nFactor, sinFactor) {
        this.name = name
        this.symbol = symbol
        this.L0 = L0
        this.M0 = M0
        this.nFactor = nFactor
        this.sinFactor = sinFactor
    }

    position(julianDay) {
        const n = julianDay - 2451545.0
        const L = (this.L0 + this.nFactor * n) % 360
        const M = (this.M0 + this.nFactor * n) % 360
        const lambda = L + this.sinFactor * Math.sin((M * Math.PI) / 180)
        return lambda
    }
}

class PlacidusHouses {
    constructor(julianDay, latitude, longitude) {
        this.julianDay = julianDay
        this.latitude = latitude
        this.longitude = longitude
        this.siderealTime = this.calculateSiderealTime()
    }

    calculateSiderealTime() {
        const T = (this.julianDay - 2451545.0) / 36525.0
        const ST =
            280.46061837 +
            360.98564736629 * (this.julianDay - 2451545.0) +
            T * T * (0.000387933 - T / 38710000.0)
        return (ST + this.longitude) % 360
    }

    calculateHouses() {
        const houses = []
        const MC = this.siderealTime
        const ascendant = this.calculateAscendant(MC)

        houses.push(ascendant)
        houses.push(this.calculateHouseCusp(2, ascendant, MC))
        houses.push(this.calculateHouseCusp(3, ascendant, MC))
        houses.push(MC)
        houses.push(this.calculateHouseCusp(5, ascendant, MC))
        houses.push(this.calculateHouseCusp(6, ascendant, MC))
        houses.push((ascendant + 180) % 360)
        houses.push(this.calculateHouseCusp(8, ascendant, MC))
        houses.push(this.calculateHouseCusp(9, ascendant, MC))
        houses.push((MC + 180) % 360)
        houses.push(this.calculateHouseCusp(11, ascendant, MC))
        houses.push(this.calculateHouseCusp(12, ascendant, MC))

        return houses
    }

    calculateAscendant(MC) {
        const tanL = Math.tan((this.latitude * Math.PI) / 180)
        const tanM = Math.tan((MC * Math.PI) / 180)
        const asc = (Math.atan(tanL / tanM) * 180) / Math.PI
        return (asc + 360) % 360
    }

    calculateHouseCusp(houseNumber, ascendant, MC) {
        const intermediateAngle = (houseNumber - 1) * 30
        const cusp = (ascendant + intermediateAngle) % 360
        return cusp
    }
}

class Planet {
    constructor(symbol, position, centerX, centerY, radius) {
        this.symbol = symbol
        this.position = position
        this.centerX = centerX
        this.centerY = centerY
        this.radius = radius
    }

    draw(svg) {
        const svgNS = "http://www.w3.org/2000/svg"
        const angle = (this.position - 90) * (Math.PI / 180)
        const x = this.centerX + (this.radius - 50) * Math.cos(angle)
        const y = this.centerY + (this.radius - 50) * Math.sin(angle)

        const svgImage = document.createElementNS(svgNS, "image")
        svgImage.setAttribute("x", x)
        svgImage.setAttribute("y", y)
        svgImage.setAttribute("width", "30")
        svgImage.setAttribute("height", "30")
        svgImage.setAttributeNS(
            "http://www.w3.org/1999/xlink",
            "href",
            `./../assets/figures/ephemerides/${this.symbol}.svg`
        )
        svgImage.classList.add("svg-image")
        svg.appendChild(svgImage)
    }
}

// class HoroscopeSVG {
//     constructor(planets, houses) {
//         this.planets = planets
//         this.houses = houses
//         this.radius = 200
//         this.centerX = 250
//         this.centerY = 250
//     }

//     drawCircle(svg) {
//         const svgNS = "http://www.w3.org/2000/svg"
//         const circle = document.createElementNS(svgNS, "circle")
//         circle.setAttribute("cx", this.centerX)
//         circle.setAttribute("cy", this.centerY)
//         circle.setAttribute("r", this.radius)
//         circle.classList.add("svg-line")
//         svg.appendChild(circle)
//     }

//     drawPlanets(svg) {
//         const planets = {
//             mercury: "mercury.svg",
//             venus: "venus.svg",
//             earth: "earth.svg",
//             moon: "moon.svg",
//             sun: "sun.svg",
//             mars: "mars.svg",
//             jupiter: "jupiter.svg",
//             saturn: "saturn.svg",
//             uranus: "uranus.svg",
//             neptune: "neptune.svg",
//             pluto: "pluto.svg",
//         }

//         const svgNS = "http://www.w3.org/2000/svg"
//         this.planets.forEach((planet) => {
//             const angle = (planet.position - 90) * (Math.PI / 180)
//             const x = this.centerX + (this.radius - 50) * Math.cos(angle)
//             const y = this.centerY + (this.radius - 50) * Math.sin(angle)

//             const text = document.createElementNS(svgNS, "text")
//             text.setAttribute("x", x)
//             text.setAttribute("y", y + 4)
//             text.classList.add("svg-text")

//             console.log(planet.symbol)
//             let sign = planets[planet.symbol]
//             let textX = x
//             let textY = y

//             const svgImage = document.createElementNS(svgNS, "image")
//             svgImage.setAttribute("x", textX)
//             svgImage.setAttribute("y", textY)
//             svgImage.setAttribute("width", "30")
//             svgImage.setAttribute("height", "30")
//             svgImage.setAttributeNS(
//                 "http://www.w3.org/1999/xlink",
//                 "href",
//                 `./../assets/figures/ephemerides/${sign}`
//             )
//             svgImage.classList.add("svg-image")
//             svg.appendChild(svgImage)
//         })
//     }

//     drawHouses(svg) {
//         const svgNS = "http://www.w3.org/2000/svg"
//         this.houses.forEach((house, index) => {
//             const angle = (house - 90) * (Math.PI / 180)
//             const x1 = this.centerX + (this.radius - 10) * Math.cos(angle)
//             const y1 = this.centerY + (this.radius - 10) * Math.sin(angle)
//             const x2 = this.centerX + this.radius * Math.cos(angle)
//             const y2 = this.centerY + this.radius * Math.sin(angle)
//             const line = document.createElementNS(svgNS, "line")
//             line.setAttribute("x1", x1)
//             line.setAttribute("y1", y1)
//             line.setAttribute("x2", x2)
//             line.setAttribute("y2", y2)

//             line.classList.add("svg-line")

//             svg.appendChild(line)

//             const textAngle = (house - 75) * (Math.PI / 180)
//             const textX =
//                 this.centerX + (this.radius - 10) * Math.cos(textAngle)
//             const textY =
//                 this.centerY + (this.radius - 10) * Math.sin(textAngle)
//             const text = document.createElementNS(svgNS, "text")
//             text.setAttribute("x", textX)
//             text.setAttribute("y", textY)
//             text.classList.add("svg-text")
//             text.textContent = index + 1
//             svg.appendChild(text)
//         })
//     }

//     drawSigns(svg) {
//         const svgNS = "http://www.w3.org/2000/svg"

//         const signs = [
//             "aries.svg",
//             "taurus.svg",
//             "gemini.svg",
//             "cancer.svg",
//             "leo.svg",
//             "virgo.svg",
//             "libra.svg",
//             "scorpio.svg",
//             "sagittarius.svg",
//             "capricorn.svg",
//             "aquarius.svg",
//             "pisces.svg",
//         ]
//         signs.forEach((sign, index) => {
//             const startAngle = (index * 30 - 90) * (Math.PI / 180)
//             const endAngle = ((index + 1) * 30 - 90) * (Math.PI / 180)

//             // Start line
//             const x1 = this.centerX + this.radius * Math.cos(startAngle)
//             const y1 = this.centerY + this.radius * Math.sin(startAngle)
//             const x2 = this.centerX + (this.radius + 10) * Math.cos(startAngle)
//             const y2 = this.centerY + (this.radius + 10) * Math.sin(startAngle)
//             const startLine = document.createElementNS(svgNS, "line")
//             startLine.setAttribute("x1", x1)
//             startLine.setAttribute("y1", y1)
//             startLine.setAttribute("x2", x2)
//             startLine.setAttribute("y2", y2)
//             startLine.classList.add("svg-line")

//             svg.appendChild(startLine)

//             // End line
//             const x3 = this.centerX + this.radius * Math.cos(endAngle)
//             const y3 = this.centerY + this.radius * Math.sin(endAngle)
//             const x4 = this.centerX + (this.radius + 10) * Math.cos(endAngle)
//             const y4 = this.centerY + (this.radius + 10) * Math.sin(endAngle)
//             const endLine = document.createElementNS(svgNS, "line")
//             endLine.setAttribute("x1", x3)
//             endLine.setAttribute("y1", y3)
//             endLine.setAttribute("x2", x4)
//             endLine.setAttribute("y2", y4)
//             endLine.classList.add("svg-line")

//             svg.appendChild(endLine)

//             // Sign text
//             const textAngle =
//                 ((index * 30 + (index + 1) * 30) / 2 - 90) * (Math.PI / 180)
//             const textX =
//                 this.centerX + (this.radius + 30) * Math.cos(textAngle)
//             const textY =
//                 this.centerY + (this.radius + 30) * Math.sin(textAngle)
//             const text = document.createElementNS(svgNS, "text")
//             text.setAttribute("x", textX)
//             text.setAttribute("y", textY)
//             // text.classList.add("svg-text")
//             // text.textContent = sign
//             // svg.appendChild(text)
//             const svgImage = document.createElementNS(svgNS, "image")
//             svgImage.setAttribute("x", textX)
//             svgImage.setAttribute("y", textY)
//             svgImage.setAttribute("width", "20")
//             svgImage.setAttribute("height", "20")
//             svgImage.setAttributeNS(
//                 "http://www.w3.org/1999/xlink",
//                 "href",
//                 `./../assets/figures/ephemerides/${sign}`
//             )
//             svgImage.classList.add("svg-image")
//             svg.appendChild(svgImage)
//         })
//     }

//     draw() {
//         const svgNS = "http://www.w3.org/2000/svg"
//         const svg = document.createElementNS(svgNS, "svg")
//         svg.setAttribute("width", "500")
//         svg.setAttribute("height", "500")

//         this.drawCircle(svg)
//         this.drawHouses(svg)
//         this.drawPlanets(svg)
//         this.drawSigns(svg)

//         return svg
//     }
// }



// Funktion zur Berechnung der Julianischen Tageszahl mit Uhrzeit

class HoroscopeSVG {
    constructor(planets, houses) {
        this.planets = planets.map(
            (planet) =>
                new Planet(planet.symbol, planet.position, 250, 250, 200)
        )
        this.houses = houses
        this.radius = 200
        this.centerX = 250
        this.centerY = 250
    }

    drawCircle(svg) {
        const svgNS = "http://www.w3.org/2000/svg"
        const circle = document.createElementNS(svgNS, "circle")
        circle.setAttribute("cx", this.centerX)
        circle.setAttribute("cy", this.centerY)
        circle.setAttribute("r", this.radius)
        circle.classList.add("svg-line")
        svg.appendChild(circle)
    }

    drawHouses(svg) {
        const svgNS = "http://www.w3.org/2000/svg"
        this.houses.forEach((house, index) => {
            const angle = (house - 90) * (Math.PI / 180)
            const x1 = this.centerX + (this.radius - 10) * Math.cos(angle)
            const y1 = this.centerY + (this.radius - 10) * Math.sin(angle)
            const x2 = this.centerX + this.radius * Math.cos(angle)
            const y2 = this.centerY + this.radius * Math.sin(angle)
            const line = document.createElementNS(svgNS, "line")
            line.setAttribute("x1", x1)
            line.setAttribute("y1", y1)
            line.setAttribute("x2", x2)
            line.setAttribute("y2", y2)
            line.classList.add("svg-line")
            svg.appendChild(line)

            const textAngle = (house - 75) * (Math.PI / 180)
            const textX =
                this.centerX + (this.radius - 10) * Math.cos(textAngle)
            const textY =
                this.centerY + (this.radius - 10) * Math.sin(textAngle)
            const text = document.createElementNS(svgNS, "text")
            text.setAttribute("x", textX)
            text.setAttribute("y", textY)
            text.classList.add("svg-text")
            text.textContent = index + 1
            svg.appendChild(text)
        })
    }

    drawSigns(svg) {
        const svgNS = "http://www.w3.org/2000/svg"

        const signs = [
            "aries.svg",
            "taurus.svg",
            "gemini.svg",
            "cancer.svg",
            "leo.svg",
            "virgo.svg",
            "libra.svg",
            "scorpio.svg",
            "sagittarius.svg",
            "capricorn.svg",
            "aquarius.svg",
            "pisces.svg",
        ]
        signs.forEach((sign, index) => {
            const startAngle = (index * 30 - 90) * (Math.PI / 180)
            const endAngle = ((index + 1) * 30 - 90) * (Math.PI / 180)

            // Start line
            const x1 = this.centerX + this.radius * Math.cos(startAngle)
            const y1 = this.centerY + this.radius * Math.sin(startAngle)
            const x2 = this.centerX + (this.radius + 10) * Math.cos(startAngle)
            const y2 = this.centerY + (this.radius + 10) * Math.sin(startAngle)
            const startLine = document.createElementNS(svgNS, "line")
            startLine.setAttribute("x1", x1)
            startLine.setAttribute("y1", y1)
            startLine.setAttribute("x2", x2)
            startLine.setAttribute("y2", y2)
            startLine.classList.add("svg-line")
            svg.appendChild(startLine)

            // End line
            const x3 = this.centerX + this.radius * Math.cos(endAngle)
            const y3 = this.centerY + this.radius * Math.sin(endAngle)
            const x4 = this.centerX + (this.radius + 10) * Math.cos(endAngle)
            const y4 = this.centerY + (this.radius + 10) * Math.sin(endAngle)
            const endLine = document.createElementNS(svgNS, "line")
            endLine.setAttribute("x1", x3)
            endLine.setAttribute("y1", y3)
            endLine.setAttribute("x2", x4)
            endLine.setAttribute("y2", y4)
            endLine.classList.add("svg-line")
            svg.appendChild(endLine)

            // Sign text
            const textAngle =
                ((index * 30 + (index + 1) * 30) / 2 - 90) * (Math.PI / 180)
            const textX =
                this.centerX + (this.radius + 30) * Math.cos(textAngle)
            const textY =
                this.centerY + (this.radius + 30) * Math.sin(textAngle)
            const svgImage = document.createElementNS(svgNS, "image")
            svgImage.setAttribute("x", textX)
            svgImage.setAttribute("y", textY)
            svgImage.setAttribute("width", "20")
            svgImage.setAttribute("height", "20")
            svgImage.setAttributeNS(
                "http://www.w3.org/1999/xlink",
                "href",
                `./../assets/figures/ephemerides/${sign}`
            )
            svgImage.classList.add("svg-image")
            svg.appendChild(svgImage)
        })
    }

    draw() {
        const svgNS = "http://www.w3.org/2000/svg"
        const svg = document.createElementNS(svgNS, "svg")
        svg.setAttribute("width", "500")
        svg.setAttribute("height", "500")

        this.drawCircle(svg)
        this.drawHouses(svg)
        this.planets.forEach((planet) => planet.draw(svg))
        this.drawSigns(svg)

        return svg
    }
}

function julianDay(year, month, day, hour, minute) {
    if (month <= 2) {
        year -= 1
        month += 12
    }
    const A = Math.floor(year / 100)
    const B = 2 - A + Math.floor(A / 4)
    const dayFraction = day + (hour + minute / 60) / 24
    return (
        Math.floor(365.25 * (year + 4716)) +
        Math.floor(30.6001 * (month + 1)) +
        dayFraction +
        B -
        1524.5
    )
}

// Funktion zur Umwandlung von Gradzahlen in Sternzeichen
function zodiacSign(degree) {
    const signs = [
        "Widder",
        "Stier",
        "Zwillinge",
        "Krebs",
        "Löwe",
        "Jungfrau",
        "Waage",
        "Skorpion",
        "Schütze",
        "Steinbock",
        "Wassermann",
        "Fische",
    ]
    const index = Math.floor(degree / 30)
    const signDegree = degree % 30
    return `${signDegree.toFixed(2)} Grad im ${signs[index]}`
}

window.onload = function () {
    // Beispiel: Berechnung der Positionen für den 21. Juni 1965 um 06:44 Uhr in Stuttgart
    let day = 21
    let month = 6
    let year = 1965
    let hour = 6
    let minute = 44
    const latitude = 48.7758
    const longitude = 9.1829
    const jd = julianDay(year, month, day, hour, minute)

    const celestialBodies = [
        new CelestialBody("Sonne", "sun", 280.46, 357.528, 0.9856474, 1.915),
        new CelestialBody("Mond", "moon", 218.316, 134.963, 13.176396, 6.289),
        new CelestialBody(
            "Merkur",
            "mercury",
            252.25084,
            174.7948,
            4.0923388,
            6.74
        ),
        new CelestialBody(
            "Venus",
            "venus",
            181.97973,
            50.4161,
            1.6021305,
            7.72
        ),
        new CelestialBody("Mars", "mars", 355.433, 19.373, 0.5240208, 10.691),
        new CelestialBody("Jupiter", "jupiter", 34.351, 19.65, 0.083091, 0.33),
        new CelestialBody("Saturn", "saturn", 50.077, 317.02, 0.033459, 0.14),
        new CelestialBody("Uranus", "uranus", 314.055, 142.59, 0.011725, 0.05),
        new CelestialBody("Neptun", "neptune", 304.348, 260.247, 0.00602, 0.01),
        new CelestialBody("Pluto", "pluto", 238.929, 14.53, 0.00396, 0.0),
    ]

    const output = document.querySelector("output")
    output.innerHTML = ""
    const planets = []
    let index = 0

    celestialBodies.forEach((body) => {
        const pos = 360 - Math.abs(body.position(jd))
        planets[index++] = {
            name: body.name,
            position: pos,
            symbol: body.symbol,
        }
        output.innerHTML += `Die Position des ${
            body.name
        } am ${day}.${month}.${year} um ${hour}:${minute} Uhr ist ${zodiacSign(
            pos
        )}.<br>`
    })

    const placidus = new PlacidusHouses(jd, latitude, longitude)
    const houses = placidus.calculateHouses()
    houses.forEach((house, index) => {
        output.innerHTML += `Haus ${index + 1}: ${zodiacSign(house)}<br>`
    })

    const horoscope = new HoroscopeSVG(planets, houses)
    const svg = horoscope.draw()

    output.prepend(svg)
}
