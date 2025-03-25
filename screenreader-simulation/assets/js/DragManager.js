/**
 * DragManager class - Makes the overlay draggable
 */
export default class DragManager {
    constructor(element) {
        this.element = element
        this.header = element.querySelector("#sr-header")
        this.isDragging = false
        this.startX = 0
        this.startY = 0
        this.offsetX = 0
        this.offsetY = 0

        this.setupDragging()
    }

    setupDragging() {
        // Only set up dragging if the header element exists
        if (this.header) {
            this.header.addEventListener("mousedown", this.startDrag.bind(this))

            // Touch support
            this.header.addEventListener(
                "touchstart",
                this.startDragTouch.bind(this)
            )
        } else {
            console.warn(
                "Header element with ID 'sr-header' not found. Dragging functionality disabled."
            )
        }

        // These can stay, as they're on document
        document.addEventListener("mousemove", this.drag.bind(this))
        document.addEventListener("mouseup", this.stopDrag.bind(this))
        document.addEventListener("touchmove", this.dragTouch.bind(this))
        document.addEventListener("touchend", this.stopDrag.bind(this))
    }

    startDrag(event) {
        this.isDragging = true
        this.startX = event.clientX
        this.startY = event.clientY
        this.offsetX = this.element.offsetLeft
        this.offsetY = this.element.offsetTop
        this.header.style.cursor = "grabbing"
    }

    startDragTouch(event) {
        if (event.touches.length === 1) {
            const touch = event.touches[0]
            this.isDragging = true
            this.startX = touch.clientX
            this.startY = touch.clientY
            this.offsetX = this.element.offsetLeft
            this.offsetY = this.element.offsetTop
        }
    }

    drag(event) {
        if (!this.isDragging) return

        const x = event.clientX
        const y = event.clientY

        const newLeft = this.offsetX + (x - this.startX)
        const newTop = this.offsetY + (y - this.startY)

        // Ensure the overlay doesn't go outside the viewport
        const maxLeft = window.innerWidth - this.element.offsetWidth
        const maxTop = window.innerHeight - this.element.offsetHeight

        this.element.style.left = `${Math.max(0, Math.min(newLeft, maxLeft))}px`
        this.element.style.top = `${Math.max(0, Math.min(newTop, maxTop))}px`
    }

    dragTouch(event) {
        if (!this.isDragging || event.touches.length !== 1) return

        const touch = event.touches[0]
        const x = touch.clientX
        const y = touch.clientY

        const newLeft = this.offsetX + (x - this.startX)
        const newTop = this.offsetY + (y - this.startY)

        // Ensure the overlay doesn't go outside the viewport
        const maxLeft = window.innerWidth - this.element.offsetWidth
        const maxTop = window.innerHeight - this.element.offsetHeight

        this.element.style.left = `${Math.max(0, Math.min(newLeft, maxLeft))}px`
        this.element.style.top = `${Math.max(0, Math.min(newTop, maxTop))}px`
    }

    stopDrag() {
        this.isDragging = false
        this.header.style.cursor = "move"
    }
}
