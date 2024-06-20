window.onload = () => {
    console.log("script runs ...")

    let all = document.querySelectorAll("*")
    all.forEach((element) => {
        element.addEventListener("mouseenter", (event) => {
            event.stopImmediatePropagation()
            event.target.classList.add("mouseenter")
        })

        element.addEventListener("mouseleave", (event) => {
            event.target.classList.remove("mouseenter")
        })
    })
}
