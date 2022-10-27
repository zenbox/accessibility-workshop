/** Webservice Application
 *
 * @package Webapplication
 * @author Michael <michael.reichart@gfu.net>
 * @version v1.0.0
 * @since 2022-10-10
 * @see i.e. inspired by ... {link to}
 * @license MIT {https://opensource.org/licenses/MIT}
 * @copyright (c) 2022 Michael Reichart, Cologne
 */
// ES module type (recommended)
// - - - - - - - - - -
import path from "path"
import express from "express"

import live from "./src/lib/live.js"

const app = express()
const host = "http://localhost"
const port = 3000

// Webservice Configuration
// Static routes
app.use(express.static(path.resolve("./static")))

// Template engine(s)
app.set("view engine", "pug")
app.set("views", path.resolve("./src/views"))

// Dynamic routes
app.use("/parallax", (request, response, next) => {
    response.status(200).render("parallax")
})
app.use("/", (request, response, next) => {
    response.status(200).render("index")
})

// Run service:
app.listen(port, (error) => {
    if (error) throw error

    console.log(`Webservice runs on port ${port}`)
})
