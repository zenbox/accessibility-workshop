/*
 *   This content is licensed according to the W3C Software License at
 *   https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 *
 *   Simple accordion pattern example
 */

"use strict"

class Accordion {
    constructor(domNode) {
        this.rootEl = domNode
        this.buttonEl = this.rootEl.querySelector("button[aria-expanded]")

        const controlsId = this.buttonEl.getAttribute("aria-controls")
        this.contentEl = document.getElementById(controlsId)

        this.open = this.buttonEl.getAttribute("aria-expanded") === "true"

        // add event listeners
        this.buttonEl.addEventListener("click", this.onButtonClick.bind(this))
    }

    onButtonClick() {
        this.toggle(!this.open)
    }

    toggle(open) {
        // don't do anything if the open state doesn't change
        if (open === this.open) {
            return
        }

        // update the internal state
        this.open = open

        // handle DOM updates
        this.buttonEl.setAttribute("aria-expanded", `${open}`)
        if (open) {
            this.contentEl.removeAttribute("hidden")
        } else {
            this.contentEl.setAttribute("hidden", "")
        }
    }

    // Add public open and close methods for convenience
    open() {
        this.toggle(true)
    }

    close() {
        this.toggle(false)
    }
}

// init accordions
const accordions = document.querySelectorAll(".accordion h3")
accordions.forEach((accordionEl) => {
    new Accordion(accordionEl)
})

window.addEventListener("load", function () {
    var button = document.getElementById("alert-trigger")

    button.addEventListener("click", addAlert)
})

/*
 * @function addAlert
 *
 * @desc Adds an alert to the page
 *
 * @param   {object}  event  -  Standard W3C event object
 *
 */

function addAlert() {
    var example = document.getElementById("example")
    var template = document.getElementById("alert-template").innerHTML

    example.innerHTML = template
}

/**
 * @namespace aria
 */

var aria = aria || {}

/**
 * @description
 *  Key code constants
 */
aria.KeyCode = {
    BACKSPACE: 8,
    TAB: 9,
    RETURN: 13,
    SHIFT: 16,
    ESC: 27,
    SPACE: 32,
    PAGE_UP: 33,
    PAGE_DOWN: 34,
    END: 35,
    HOME: 36,
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,
    DELETE: 46,
}

aria.Utils = aria.Utils || {}

// Polyfill src https://developer.mozilla.org/en-US/docs/Web/API/Element/matches
aria.Utils.matches = function (element, selector) {
    if (!Element.prototype.matches) {
        Element.prototype.matches =
            Element.prototype.matchesSelector ||
            Element.prototype.mozMatchesSelector ||
            Element.prototype.msMatchesSelector ||
            Element.prototype.oMatchesSelector ||
            Element.prototype.webkitMatchesSelector ||
            function (s) {
                var matches = element.parentNode.querySelectorAll(s)
                var i = matches.length
                while (--i >= 0 && matches.item(i) !== this) {
                    // empty
                }
                return i > -1
            }
    }

    return element.matches(selector)
}

aria.Utils.remove = function (item) {
    if (item.remove && typeof item.remove === "function") {
        return item.remove()
    }
    if (
        item.parentNode &&
        item.parentNode.removeChild &&
        typeof item.parentNode.removeChild === "function"
    ) {
        return item.parentNode.removeChild(item)
    }
    return false
}

aria.Utils.isFocusable = function (element) {
    if (element.tabIndex < 0) {
        return false
    }

    if (element.disabled) {
        return false
    }

    switch (element.nodeName) {
        case "A":
            return !!element.href && element.rel != "ignore"
        case "INPUT":
            return element.type != "hidden"
        case "BUTTON":
        case "SELECT":
        case "TEXTAREA":
            return true
        default:
            return false
    }
}

aria.Utils.getAncestorBySelector = function (element, selector) {
    if (!aria.Utils.matches(element, selector + " " + element.tagName)) {
        // Element is not inside an element that matches selector
        return null
    }

    // Move up the DOM tree until a parent matching the selector is found
    var currentNode = element
    var ancestor = null
    while (ancestor === null) {
        if (aria.Utils.matches(currentNode.parentNode, selector)) {
            ancestor = currentNode.parentNode
        } else {
            currentNode = currentNode.parentNode
        }
    }

    return ancestor
}

aria.Utils.hasClass = function (element, className) {
    return new RegExp("(\\s|^)" + className + "(\\s|$)").test(element.className)
}

aria.Utils.addClass = function (element, className) {
    if (!aria.Utils.hasClass(element, className)) {
        element.className += " " + className
    }
}

aria.Utils.removeClass = function (element, className) {
    var classRegex = new RegExp("(\\s|^)" + className + "(\\s|$)")
    element.className = element.className.replace(classRegex, " ").trim()
}

aria.Utils.bindMethods = function (object /* , ...methodNames */) {
    var methodNames = Array.prototype.slice.call(arguments, 1)
    methodNames.forEach(function (method) {
        object[method] = object[method].bind(object)
    })
}
/*
 *   This content is licensed according to the W3C Software License at
 *   https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 */
;("use strict")

var aria = aria || {}

aria.Utils = aria.Utils || {}
;(function () {
    /*
     * When util functions move focus around, set this true so the focus listener
     * can ignore the events.
     */
    aria.Utils.IgnoreUtilFocusChanges = false

    aria.Utils.dialogOpenClass = "has-dialog"

    /**
     * @description Set focus on descendant nodes until the first focusable element is
     *       found.
     * @param element
     *          DOM node for which to find the first focusable descendant.
     * @returns {boolean}
     *  true if a focusable element is found and focus is set.
     */
    aria.Utils.focusFirstDescendant = function (element) {
        for (var i = 0; i < element.childNodes.length; i++) {
            var child = element.childNodes[i]
            if (
                aria.Utils.attemptFocus(child) ||
                aria.Utils.focusFirstDescendant(child)
            ) {
                return true
            }
        }
        return false
    } // end focusFirstDescendant

    /**
     * @description Find the last descendant node that is focusable.
     * @param element
     *          DOM node for which to find the last focusable descendant.
     * @returns {boolean}
     *  true if a focusable element is found and focus is set.
     */
    aria.Utils.focusLastDescendant = function (element) {
        for (var i = element.childNodes.length - 1; i >= 0; i--) {
            var child = element.childNodes[i]
            if (
                aria.Utils.attemptFocus(child) ||
                aria.Utils.focusLastDescendant(child)
            ) {
                return true
            }
        }
        return false
    } // end focusLastDescendant

    /**
     * @description Set Attempt to set focus on the current node.
     * @param element
     *          The node to attempt to focus on.
     * @returns {boolean}
     *  true if element is focused.
     */
    aria.Utils.attemptFocus = function (element) {
        if (!aria.Utils.isFocusable(element)) {
            return false
        }

        aria.Utils.IgnoreUtilFocusChanges = true
        try {
            element.focus()
        } catch (e) {
            // continue regardless of error
        }
        aria.Utils.IgnoreUtilFocusChanges = false
        return document.activeElement === element
    } // end attemptFocus

    /* Modals can open modals. Keep track of them with this array. */
    aria.OpenDialogList = aria.OpenDialogList || new Array(0)

    /**
     * @returns {object} the last opened dialog (the current dialog)
     */
    aria.getCurrentDialog = function () {
        if (aria.OpenDialogList && aria.OpenDialogList.length) {
            return aria.OpenDialogList[aria.OpenDialogList.length - 1]
        }
    }

    aria.closeCurrentDialog = function () {
        var currentDialog = aria.getCurrentDialog()
        if (currentDialog) {
            currentDialog.close()
            return true
        }

        return false
    }

    aria.handleEscape = function (event) {
        var key = event.which || event.keyCode

        if (key === aria.KeyCode.ESC && aria.closeCurrentDialog()) {
            event.stopPropagation()
        }
    }

    document.addEventListener("keyup", aria.handleEscape)

    /**
     * @class
     * @description Dialog object providing modal focus management.
     *
     * Assumptions: The element serving as the dialog container is present in the
     * DOM and hidden. The dialog container has role='dialog'.
     * @param dialogId
     *          The ID of the element serving as the dialog container.
     * @param focusAfterClosed
     *          Either the DOM node or the ID of the DOM node to focus when the
     *          dialog closes.
     * @param focusFirst
     *          Optional parameter containing either the DOM node or the ID of the
     *          DOM node to focus when the dialog opens. If not specified, the
     *          first focusable element in the dialog will receive focus.
     */
    aria.Dialog = function (dialogId, focusAfterClosed, focusFirst) {
        this.dialogNode = document.getElementById(dialogId)
        if (this.dialogNode === null) {
            throw new Error('No element found with id="' + dialogId + '".')
        }

        var validRoles = ["dialog", "alertdialog"]
        var isDialog = (this.dialogNode.getAttribute("role") || "")
            .trim()
            .split(/\s+/g)
            .some(function (token) {
                return validRoles.some(function (role) {
                    return token === role
                })
            })
        if (!isDialog) {
            throw new Error(
                "Dialog() requires a DOM element with ARIA role of dialog or alertdialog."
            )
        }

        // Wrap in an individual backdrop element if one doesn't exist
        // Native <dialog> elements use the ::backdrop pseudo-element, which
        // works similarly.
        var backdropClass = "dialog-backdrop"
        if (this.dialogNode.parentNode.classList.contains(backdropClass)) {
            this.backdropNode = this.dialogNode.parentNode
        } else {
            this.backdropNode = document.createElement("div")
            this.backdropNode.className = backdropClass
            this.dialogNode.parentNode.insertBefore(
                this.backdropNode,
                this.dialogNode
            )
            this.backdropNode.appendChild(this.dialogNode)
        }
        this.backdropNode.classList.add("active")

        // Disable scroll on the body element
        document.body.classList.add(aria.Utils.dialogOpenClass)

        if (typeof focusAfterClosed === "string") {
            this.focusAfterClosed = document.getElementById(focusAfterClosed)
        } else if (typeof focusAfterClosed === "object") {
            this.focusAfterClosed = focusAfterClosed
        } else {
            throw new Error(
                "the focusAfterClosed parameter is required for the aria.Dialog constructor."
            )
        }

        if (typeof focusFirst === "string") {
            this.focusFirst = document.getElementById(focusFirst)
        } else if (typeof focusFirst === "object") {
            this.focusFirst = focusFirst
        } else {
            this.focusFirst = null
        }

        // Bracket the dialog node with two invisible, focusable nodes.
        // While this dialog is open, we use these to make sure that focus never
        // leaves the document even if dialogNode is the first or last node.
        var preDiv = document.createElement("div")
        this.preNode = this.dialogNode.parentNode.insertBefore(
            preDiv,
            this.dialogNode
        )
        this.preNode.tabIndex = 0
        var postDiv = document.createElement("div")
        this.postNode = this.dialogNode.parentNode.insertBefore(
            postDiv,
            this.dialogNode.nextSibling
        )
        this.postNode.tabIndex = 0

        // If this modal is opening on top of one that is already open,
        // get rid of the document focus listener of the open dialog.
        if (aria.OpenDialogList.length > 0) {
            aria.getCurrentDialog().removeListeners()
        }

        this.addListeners()
        aria.OpenDialogList.push(this)
        this.clearDialog()
        this.dialogNode.className = "default_dialog" // make visible

        if (this.focusFirst) {
            this.focusFirst.focus()
        } else {
            aria.Utils.focusFirstDescendant(this.dialogNode)
        }

        this.lastFocus = document.activeElement
    } // end Dialog constructor

    aria.Dialog.prototype.clearDialog = function () {
        Array.prototype.map.call(
            this.dialogNode.querySelectorAll("input"),
            function (input) {
                input.value = ""
            }
        )
    }

    /**
     * @description
     *  Hides the current top dialog,
     *  removes listeners of the top dialog,
     *  restore listeners of a parent dialog if one was open under the one that just closed,
     *  and sets focus on the element specified for focusAfterClosed.
     */
    aria.Dialog.prototype.close = function () {
        aria.OpenDialogList.pop()
        this.removeListeners()
        aria.Utils.remove(this.preNode)
        aria.Utils.remove(this.postNode)
        this.dialogNode.className = "hidden"
        this.backdropNode.classList.remove("active")
        this.focusAfterClosed.focus()

        // If a dialog was open underneath this one, restore its listeners.
        if (aria.OpenDialogList.length > 0) {
            aria.getCurrentDialog().addListeners()
        } else {
            document.body.classList.remove(aria.Utils.dialogOpenClass)
        }
    } // end close

    /**
     * @description
     *  Hides the current dialog and replaces it with another.
     * @param newDialogId
     *  ID of the dialog that will replace the currently open top dialog.
     * @param newFocusAfterClosed
     *  Optional ID or DOM node specifying where to place focus when the new dialog closes.
     *  If not specified, focus will be placed on the element specified by the dialog being replaced.
     * @param newFocusFirst
     *  Optional ID or DOM node specifying where to place focus in the new dialog when it opens.
     *  If not specified, the first focusable element will receive focus.
     */
    aria.Dialog.prototype.replace = function (
        newDialogId,
        newFocusAfterClosed,
        newFocusFirst
    ) {
        aria.OpenDialogList.pop()
        this.removeListeners()
        aria.Utils.remove(this.preNode)
        aria.Utils.remove(this.postNode)
        this.dialogNode.className = "hidden"
        this.backdropNode.classList.remove("active")

        var focusAfterClosed = newFocusAfterClosed || this.focusAfterClosed
        new aria.Dialog(newDialogId, focusAfterClosed, newFocusFirst)
    } // end replace

    aria.Dialog.prototype.addListeners = function () {
        document.addEventListener("focus", this.trapFocus, true)
    } // end addListeners

    aria.Dialog.prototype.removeListeners = function () {
        document.removeEventListener("focus", this.trapFocus, true)
    } // end removeListeners

    aria.Dialog.prototype.trapFocus = function (event) {
        if (aria.Utils.IgnoreUtilFocusChanges) {
            return
        }
        var currentDialog = aria.getCurrentDialog()
        if (currentDialog.dialogNode.contains(event.target)) {
            currentDialog.lastFocus = event.target
        } else {
            aria.Utils.focusFirstDescendant(currentDialog.dialogNode)
            if (currentDialog.lastFocus == document.activeElement) {
                aria.Utils.focusLastDescendant(currentDialog.dialogNode)
            }
            currentDialog.lastFocus = document.activeElement
        }
    } // end trapFocus

    window.openDialog = function (dialogId, focusAfterClosed, focusFirst) {
        new aria.Dialog(dialogId, focusAfterClosed, focusFirst)
    }

    window.closeDialog = function (closeButton) {
        var topDialog = aria.getCurrentDialog()
        if (topDialog.dialogNode.contains(closeButton)) {
            topDialog.close()
        }
    } // end closeDialog

    window.replaceDialog = function (
        newDialogId,
        newFocusAfterClosed,
        newFocusFirst
    ) {
        var topDialog = aria.getCurrentDialog()
        if (topDialog.dialogNode.contains(document.activeElement)) {
            topDialog.replace(newDialogId, newFocusAfterClosed, newFocusFirst)
        }
    } // end replaceDialog
})()

/*
 *   This content is licensed according to the W3C Software License at
 *   https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 *
 *   JS code for the button design pattern
 */
;("use strict")

var ICON_MUTE_URL = "#icon-mute"
var ICON_SOUND_URL = "#icon-sound"

function init() {
    var actionButton = document.getElementById("action")
    actionButton.addEventListener("click", activateActionButton)
    actionButton.addEventListener("keydown", actionButtonKeydownHandler)
    actionButton.addEventListener("keyup", actionButtonKeyupHandler)

    var toggleButton = document.getElementById("toggle")
    toggleButton.addEventListener("click", toggleButtonClickHandler)
    toggleButton.addEventListener("keydown", toggleButtonKeydownHandler)
    toggleButton.addEventListener("keyup", toggleButtonKeyupHandler)
}

/**
 * Activates the action button with the enter key.
 *
 * @param {KeyboardEvent} event
 */
function actionButtonKeydownHandler(event) {
    // The action button is activated by space on the keyup event, but the
    // default action for space is already triggered on keydown. It needs to be
    // prevented to stop scrolling the page before activating the button.
    if (event.keyCode === 32) {
        event.preventDefault()
    }
    // If enter is pressed, activate the button
    else if (event.keyCode === 13) {
        event.preventDefault()
        activateActionButton()
    }
}

/**
 * Activates the action button with the space key.
 *
 * @param {KeyboardEvent} event
 */
function actionButtonKeyupHandler(event) {
    if (event.keyCode === 32) {
        event.preventDefault()
        activateActionButton()
    }
}

function activateActionButton() {
    window.print()
}

/**
 * Toggles the toggle button’s state if it’s actually a button element or has
 * the `role` attribute set to `button`.
 *
 * @param {MouseEvent} event
 */
function toggleButtonClickHandler(event) {
    if (
        event.currentTarget.tagName === "button" ||
        event.currentTarget.getAttribute("role") === "button"
    ) {
        toggleButtonState(event.currentTarget)
    }
}

/**
 * Toggles the toggle button’s state with the enter key.
 *
 * @param {KeyboardEvent} event
 */
function toggleButtonKeydownHandler(event) {
    if (event.keyCode === 32) {
        event.preventDefault()
    } else if (event.keyCode === 13) {
        event.preventDefault()
        toggleButtonState(event.currentTarget)
    }
}

/**
 * Toggles the toggle button’s state with space key.
 *
 * @param {KeyboardEvent} event
 */
function toggleButtonKeyupHandler(event) {
    if (event.keyCode === 32) {
        event.preventDefault()
        toggleButtonState(event.currentTarget)
    }
}

/**
 * Toggles the toggle button’s state between *pressed* and *not pressed*.
 *
 * @param {HTMLElement} button
 */
function toggleButtonState(button) {
    var isAriaPressed = button.getAttribute("aria-pressed") === "true"

    button.setAttribute("aria-pressed", isAriaPressed ? "false" : "true")

    var icon = button.querySelector("use")
    icon.setAttribute(
        "xlink:href",
        isAriaPressed ? ICON_SOUND_URL : ICON_MUTE_URL
    )
}

window.onload = init

/*
 *   File:   carousel-tablist.js
 *
 *   Desc:   Carousel Tablist widget that implements ARIA Authoring Practices
 *
 */
;("use strict")

// takes options object: { accessibleCaptions: boolean, autoplay: boolean, playButton: boolean }
// defaults are: { accessibleCaptions: true, autoplay: false, playButton: true }

var CarouselTablist = function (node, options) {
    // merge passed options with defaults
    options = Object.assign(
        { moreaccessible: false, paused: false, norotate: false },
        options || {}
    )

    // a prefers-reduced-motion user setting must always override autoplay
    var hasReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)")
    if (hasReducedMotion.matches) {
        options.paused = true
    }

    /* DOM properties */
    this.domNode = node

    this.tablistNode = node.querySelector("[role=tablist]")
    this.containerNode = node.querySelector(".carousel-items")

    this.tabNodes = []
    this.tabpanelNodes = []

    this.liveRegionNode = node.querySelector(".carousel-items")
    this.pausePlayButtonNode = document.querySelector(
        ".carousel-tablist .controls button.rotation"
    )

    this.playLabel = "Start automatic slide show"
    this.pauseLabel = "Stop automatic slide show"

    /* State properties */
    this.hasUserActivatedPlay = false // set when the user activates the play/pause button
    this.isAutoRotationDisabled = options.norotate // This property for disabling auto rotation
    this.isPlayingEnabled = !options.paused // This property is also set in updatePlaying method
    this.timeInterval = 5000 // length of slide rotation in ms
    this.currentIndex = 0 // index of current slide
    this.slideTimeout = null // save reference to setTimeout

    // initialize tabs
    this.tablistNode.addEventListener("focusin", this.handleTabFocus.bind(this))
    this.tablistNode.addEventListener("focusout", this.handleTabBlur.bind(this))

    var nodes = node.querySelectorAll('[role="tab"]')

    for (var i = 0; i < nodes.length; i++) {
        var n = nodes[i]

        this.tabNodes.push(n)

        n.addEventListener("keydown", this.handleTabKeydown.bind(this))
        n.addEventListener("click", this.handleTabClick.bind(this))

        // initialize tabpanels

        var tabpanelNode = document.getElementById(
            n.getAttribute("aria-controls")
        )

        if (tabpanelNode) {
            this.tabpanelNodes.push(tabpanelNode)

            // support stopping rotation when any element receives focus in the tabpanel
            tabpanelNode.addEventListener(
                "focusin",
                this.handleTabpanelFocusIn.bind(this)
            )
            tabpanelNode.addEventListener(
                "focusout",
                this.handleTabpanelFocusOut.bind(this)
            )

            var imageLink = tabpanelNode.querySelector(".carousel-image a")

            if (imageLink) {
                imageLink.addEventListener(
                    "focus",
                    this.handleImageLinkFocus.bind(this)
                )
                imageLink.addEventListener(
                    "blur",
                    this.handleImageLinkBlur.bind(this)
                )
            }
        } else {
            this.tabpanelNodes.push(null)
        }
    }

    // Pause Button
    if (this.pausePlayButtonNode) {
        this.pausePlayButtonNode.addEventListener(
            "click",
            this.handlePausePlayButtonClick.bind(this)
        )
    }

    // Handle hover events
    this.domNode.addEventListener("mouseover", this.handleMouseOver.bind(this))
    this.domNode.addEventListener("mouseout", this.handleMouseOut.bind(this))

    // initialize behavior based on options

    this.enableOrDisableAutoRotation(options.norotate)
    this.updatePlaying(!options.paused && !options.norotate)
    this.setAccessibleStyling(options.moreaccessible)
    this.rotateSlides()
}

/* Public function to disable/enable rotation and if false, hide pause/play button*/
CarouselTablist.prototype.enableOrDisableAutoRotation = function (disable) {
    this.isAutoRotationDisabled = disable
    this.pausePlayButtonNode.hidden = disable
}

/* Public function to update controls/caption styling */
CarouselTablist.prototype.setAccessibleStyling = function (accessible) {
    if (accessible) {
        this.domNode.classList.add("carousel-tablist-moreaccessible")
    } else {
        this.domNode.classList.remove("carousel-tablist-moreaccessible")
    }
}

CarouselTablist.prototype.hideTabpanel = function (index) {
    var tabNode = this.tabNodes[index]
    var panelNode = this.tabpanelNodes[index]

    tabNode.setAttribute("aria-selected", "false")
    tabNode.setAttribute("tabindex", "-1")

    if (panelNode) {
        panelNode.classList.remove("active")
    }
}

CarouselTablist.prototype.showTabpanel = function (index, moveFocus) {
    var tabNode = this.tabNodes[index]
    var panelNode = this.tabpanelNodes[index]

    tabNode.setAttribute("aria-selected", "true")
    tabNode.removeAttribute("tabindex")

    if (panelNode) {
        panelNode.classList.add("active")
    }

    if (moveFocus) {
        tabNode.focus()
    }
}

CarouselTablist.prototype.setSelectedTab = function (index, moveFocus) {
    if (index === this.currentIndex) {
        return
    }
    this.currentIndex = index

    for (var i = 0; i < this.tabNodes.length; i++) {
        this.hideTabpanel(i)
    }

    this.showTabpanel(index, moveFocus)
}

CarouselTablist.prototype.setSelectedToPreviousTab = function (moveFocus) {
    var nextIndex = this.currentIndex - 1

    if (nextIndex < 0) {
        nextIndex = this.tabNodes.length - 1
    }

    this.setSelectedTab(nextIndex, moveFocus)
}

CarouselTablist.prototype.setSelectedToNextTab = function (moveFocus) {
    var nextIndex = this.currentIndex + 1

    if (nextIndex >= this.tabNodes.length) {
        nextIndex = 0
    }

    this.setSelectedTab(nextIndex, moveFocus)
}

CarouselTablist.prototype.rotateSlides = function () {
    if (!this.isAutoRotationDisabled) {
        if (
            (!this.hasFocus && !this.hasHover && this.isPlayingEnabled) ||
            this.hasUserActivatedPlay
        ) {
            this.setSelectedToNextTab(false)
        }
    }

    this.slideTimeout = setTimeout(
        this.rotateSlides.bind(this),
        this.timeInterval
    )
}

CarouselTablist.prototype.updatePlaying = function (play) {
    this.isPlayingEnabled = play

    if (play) {
        this.pausePlayButtonNode.setAttribute("aria-label", this.pauseLabel)
        this.pausePlayButtonNode.classList.remove("play")
        this.pausePlayButtonNode.classList.add("pause")
        this.liveRegionNode.setAttribute("aria-live", "off")
    } else {
        this.pausePlayButtonNode.setAttribute("aria-label", this.playLabel)
        this.pausePlayButtonNode.classList.remove("pause")
        this.pausePlayButtonNode.classList.add("play")
        this.liveRegionNode.setAttribute("aria-live", "polite")
    }
}

/* Event Handlers */

CarouselTablist.prototype.handleImageLinkFocus = function () {
    this.liveRegionNode.classList.add("focus")
}

CarouselTablist.prototype.handleImageLinkBlur = function () {
    this.liveRegionNode.classList.remove("focus")
}

CarouselTablist.prototype.handleMouseOver = function (event) {
    if (!this.pausePlayButtonNode.contains(event.target)) {
        this.hasHover = true
    }
}

CarouselTablist.prototype.handleMouseOut = function () {
    this.hasHover = false
}

/* EVENT HANDLERS */

CarouselTablist.prototype.handlePausePlayButtonClick = function () {
    this.hasUserActivatedPlay = !this.isPlayingEnabled
    this.updatePlaying(!this.isPlayingEnabled)
}

/* Event Handlers for Tabs*/

CarouselTablist.prototype.handleTabKeydown = function (event) {
    var flag = false

    switch (event.key) {
        case "ArrowRight":
            this.setSelectedToNextTab(true)
            flag = true
            break

        case "ArrowLeft":
            this.setSelectedToPreviousTab(true)
            flag = true
            break

        case "Home":
            this.setSelectedTab(0, true)
            flag = true
            break

        case "End":
            this.setSelectedTab(this.tabNodes.length - 1, true)
            flag = true
            break

        default:
            break
    }

    if (flag) {
        event.stopPropagation()
        event.preventDefault()
    }
}

CarouselTablist.prototype.handleTabClick = function (event) {
    var index = this.tabNodes.indexOf(event.currentTarget)
    this.setSelectedTab(index, true)
}

CarouselTablist.prototype.handleTabFocus = function () {
    this.tablistNode.classList.add("focus")
    this.liveRegionNode.setAttribute("aria-live", "polite")
    this.hasFocus = true
}

CarouselTablist.prototype.handleTabBlur = function () {
    this.tablistNode.classList.remove("focus")
    if (this.playState) {
        this.liveRegionNode.setAttribute("aria-live", "off")
    }

    this.hasFocus = false
}

/* Event Handlers for Tabpanels*/

CarouselTablist.prototype.handleTabpanelFocusIn = function () {
    this.hasFocus = true
}

CarouselTablist.prototype.handleTabpanelFocusOut = function () {
    this.hasFocus = false
}

/* Initialize Carousel Tablists and options */

window.addEventListener(
    "load",
    function () {
        var carouselEls = document.querySelectorAll(".carousel-tablist")
        var carousels = []

        // set example behavior based on
        // default setting of the checkboxes and the parameters in the URL
        // update checkboxes based on any corresponding URL parameters
        var checkboxes = document.querySelectorAll(
            ".carousel-options input[type=checkbox]"
        )
        var urlParams = new URLSearchParams(location.search)
        var carouselOptions = {}

        // initialize example features based on
        // default setting of the checkboxes and the parameters in the URL
        // update checkboxes based on any corresponding URL parameters
        checkboxes.forEach(function (checkbox) {
            var checked = checkbox.checked

            if (urlParams.has(checkbox.value)) {
                var urlParam = urlParams.get(checkbox.value)
                if (typeof urlParam === "string") {
                    checked = urlParam === "true"
                    checkbox.checked = checked
                }
            }

            carouselOptions[checkbox.value] = checkbox.checked
        })

        carouselEls.forEach(function (node) {
            carousels.push(new CarouselTablist(node, carouselOptions))
        })

        // add change event to checkboxes
        checkboxes.forEach(function (checkbox) {
            var updateEvent
            switch (checkbox.value) {
                case "moreaccessible":
                    updateEvent = "setAccessibleStyling"
                    break
                case "norotate":
                    updateEvent = "enableOrDisableAutoRotation"
                    break
            }

            // update the carousel behavior and URL when a checkbox state changes
            checkbox.addEventListener("change", function (event) {
                urlParams.set(event.target.value, event.target.checked + "")
                window.history.replaceState(
                    null,
                    "",
                    window.location.pathname + "?" + urlParams
                )

                if (updateEvent) {
                    carousels.forEach(function (carousel) {
                        carousel[updateEvent](event.target.checked)
                    })
                }
            })
        })
    },
    false
)

/*
 *   This content is licensed according to the W3C Software License at
 *   https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 *
 *   File:   CheckboxMixed.js
 *
 *   Desc:   CheckboxMixed widget that implements ARIA Authoring Practices
 *           for a menu of links
 */

class CheckboxMixed {
    constructor(domNode) {
        this.mixedNode = domNode.querySelector('[role="checkbox"]')
        this.checkboxNodes = domNode.querySelectorAll('input[type="checkbox"]')

        this.mixedNode.addEventListener(
            "keydown",
            this.onMixedKeydown.bind(this)
        )
        this.mixedNode.addEventListener("keyup", this.onMixedKeyup.bind(this))
        this.mixedNode.addEventListener("click", this.onMixedClick.bind(this))
        this.mixedNode.addEventListener("focus", this.onMixedFocus.bind(this))
        this.mixedNode.addEventListener("blur", this.onMixedBlur.bind(this))

        for (var i = 0; i < this.checkboxNodes.length; i++) {
            var checkboxNode = this.checkboxNodes[i]

            checkboxNode.addEventListener(
                "click",
                this.onCheckboxClick.bind(this)
            )
            checkboxNode.addEventListener(
                "focus",
                this.onCheckboxFocus.bind(this)
            )
            checkboxNode.addEventListener(
                "blur",
                this.onCheckboxBlur.bind(this)
            )
            checkboxNode.setAttribute("data-last-state", checkboxNode.checked)
        }

        this.updateMixed()
    }

    updateMixed() {
        var count = 0

        for (var i = 0; i < this.checkboxNodes.length; i++) {
            if (this.checkboxNodes[i].checked) {
                count++
            }
        }

        if (count === 0) {
            this.mixedNode.setAttribute("aria-checked", "false")
        } else {
            if (count === this.checkboxNodes.length) {
                this.mixedNode.setAttribute("aria-checked", "true")
            } else {
                this.mixedNode.setAttribute("aria-checked", "mixed")
                this.updateCheckboxStates()
            }
        }
    }

    updateCheckboxStates() {
        for (var i = 0; i < this.checkboxNodes.length; i++) {
            var checkboxNode = this.checkboxNodes[i]
            checkboxNode.setAttribute("data-last-state", checkboxNode.checked)
        }
    }

    anyLastChecked() {
        var count = 0

        for (var i = 0; i < this.checkboxNodes.length; i++) {
            if (
                this.checkboxNodes[i].getAttribute("data-last-state") == "true"
            ) {
                count++
            }
        }

        return count > 0
    }

    setCheckboxes(value) {
        for (var i = 0; i < this.checkboxNodes.length; i++) {
            var checkboxNode = this.checkboxNodes[i]

            switch (value) {
                case "last":
                    checkboxNode.checked =
                        checkboxNode.getAttribute("data-last-state") === "true"
                    break

                case "true":
                    checkboxNode.checked = true
                    break

                default:
                    checkboxNode.checked = false
                    break
            }
        }
        this.updateMixed()
    }

    toggleMixed() {
        var state = this.mixedNode.getAttribute("aria-checked")

        if (state === "false") {
            if (this.anyLastChecked()) {
                this.setCheckboxes("last")
            } else {
                this.setCheckboxes("true")
            }
        } else {
            if (state === "mixed") {
                this.setCheckboxes("true")
            } else {
                this.setCheckboxes("false")
            }
        }

        this.updateMixed()
    }

    /* EVENT HANDLERS */

    // Prevent page scrolling on space down
    onMixedKeydown(event) {
        if (event.key === " ") {
            event.preventDefault()
        }
    }

    onMixedKeyup(event) {
        switch (event.key) {
            case " ":
                this.toggleMixed()
                event.stopPropagation()
                break

            default:
                break
        }
    }

    onMixedClick() {
        this.toggleMixed()
    }

    onMixedFocus() {
        this.mixedNode.classList.add("focus")
    }

    onMixedBlur() {
        this.mixedNode.classList.remove("focus")
    }

    onCheckboxClick(event) {
        event.currentTarget.setAttribute(
            "data-last-state",
            event.currentTarget.checked
        )
        this.updateMixed()
    }

    onCheckboxFocus(event) {
        event.currentTarget.parentNode.classList.add("focus")
    }

    onCheckboxBlur(event) {
        event.currentTarget.parentNode.classList.remove("focus")
    }
}

// Initialize mixed checkboxes on the page
window.addEventListener("load", function () {
    let mixed = document.querySelectorAll(".checkbox-mixed")
    for (let i = 0; i < mixed.length; i++) {
        new CheckboxMixed(mixed[i])
    }
})

/*
 *   This content is licensed according to the W3C Software License at
 *   https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 *
 *   File:   sortable-table.js
 *
 *   Desc:   Adds sorting to a HTML data table that implements ARIA Authoring Practices
 */

class SortableTable {
    constructor(tableNode) {
        this.tableNode = tableNode

        this.columnHeaders = tableNode.querySelectorAll("thead th")

        this.sortColumns = []

        for (var i = 0; i < this.columnHeaders.length; i++) {
            var ch = this.columnHeaders[i]
            var buttonNode = ch.querySelector("button")
            if (buttonNode) {
                this.sortColumns.push(i)
                buttonNode.setAttribute("data-column-index", i)
                buttonNode.addEventListener(
                    "click",
                    this.handleClick.bind(this)
                )
            }
        }

        this.optionCheckbox = document.querySelector(
            'input[type="checkbox"][value="show-unsorted-icon"]'
        )

        if (this.optionCheckbox) {
            this.optionCheckbox.addEventListener(
                "change",
                this.handleOptionChange.bind(this)
            )
            if (this.optionCheckbox.checked) {
                this.tableNode.classList.add("show-unsorted-icon")
            }
        }
    }

    setColumnHeaderSort(columnIndex) {
        if (typeof columnIndex === "string") {
            columnIndex = parseInt(columnIndex)
        }

        for (var i = 0; i < this.columnHeaders.length; i++) {
            var ch = this.columnHeaders[i]
            var buttonNode = ch.querySelector("button")
            if (i === columnIndex) {
                var value = ch.getAttribute("aria-sort")
                if (value === "descending") {
                    ch.setAttribute("aria-sort", "ascending")
                    this.sortColumn(
                        columnIndex,
                        "ascending",
                        ch.classList.contains("num")
                    )
                } else {
                    ch.setAttribute("aria-sort", "descending")
                    this.sortColumn(
                        columnIndex,
                        "descending",
                        ch.classList.contains("num")
                    )
                }
            } else {
                if (ch.hasAttribute("aria-sort") && buttonNode) {
                    ch.removeAttribute("aria-sort")
                }
            }
        }
    }

    sortColumn(columnIndex, sortValue, isNumber) {
        function compareValues(a, b) {
            if (sortValue === "ascending") {
                if (a.value === b.value) {
                    return 0
                } else {
                    if (isNumber) {
                        return a.value - b.value
                    } else {
                        return a.value < b.value ? -1 : 1
                    }
                }
            } else {
                if (a.value === b.value) {
                    return 0
                } else {
                    if (isNumber) {
                        return b.value - a.value
                    } else {
                        return a.value > b.value ? -1 : 1
                    }
                }
            }
        }

        if (typeof isNumber !== "boolean") {
            isNumber = false
        }

        var tbodyNode = this.tableNode.querySelector("tbody")
        var rowNodes = []
        var dataCells = []

        var rowNode = tbodyNode.firstElementChild

        var index = 0
        while (rowNode) {
            rowNodes.push(rowNode)
            var rowCells = rowNode.querySelectorAll("th, td")
            var dataCell = rowCells[columnIndex]

            var data = {}
            data.index = index
            data.value = dataCell.textContent.toLowerCase().trim()
            if (isNumber) {
                data.value = parseFloat(data.value)
            }
            dataCells.push(data)
            rowNode = rowNode.nextElementSibling
            index += 1
        }

        dataCells.sort(compareValues)

        // remove rows
        while (tbodyNode.firstChild) {
            tbodyNode.removeChild(tbodyNode.lastChild)
        }

        // add sorted rows
        for (var i = 0; i < dataCells.length; i += 1) {
            tbodyNode.appendChild(rowNodes[dataCells[i].index])
        }
    }

    /* EVENT HANDLERS */

    handleClick(event) {
        var tgt = event.currentTarget
        this.setColumnHeaderSort(tgt.getAttribute("data-column-index"))
    }

    handleOptionChange(event) {
        var tgt = event.currentTarget

        if (tgt.checked) {
            this.tableNode.classList.add("show-unsorted-icon")
        } else {
            this.tableNode.classList.remove("show-unsorted-icon")
        }
    }
}

// Initialize sortable table buttons
window.addEventListener("load", function () {
    var sortableTables = document.querySelectorAll("table.sortable")
    for (var i = 0; i < sortableTables.length; i++) {
        new SortableTable(sortableTables[i])
    }
})

/*
 *   This content is licensed according to the W3C Software License at
 *   https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 *
 *   File:   tabs-automatic.js
 *
 *   Desc:   Tablist widget that implements ARIA Authoring Practices
 */
;("use strict")

class TabsAutomatic {
    constructor(groupNode) {
        this.tablistNode = groupNode

        this.tabs = []

        this.firstTab = null
        this.lastTab = null

        this.tabs = Array.from(this.tablistNode.querySelectorAll("[role=tab]"))
        this.tabpanels = []

        for (var i = 0; i < this.tabs.length; i += 1) {
            var tab = this.tabs[i]
            var tabpanel = document.getElementById(
                tab.getAttribute("aria-controls")
            )

            tab.tabIndex = -1
            tab.setAttribute("aria-selected", "false")
            this.tabpanels.push(tabpanel)

            tab.addEventListener("keydown", this.onKeydown.bind(this))
            tab.addEventListener("click", this.onClick.bind(this))

            if (!this.firstTab) {
                this.firstTab = tab
            }
            this.lastTab = tab
        }

        this.setSelectedTab(this.firstTab, false)
    }

    setSelectedTab(currentTab, setFocus) {
        if (typeof setFocus !== "boolean") {
            setFocus = true
        }
        for (var i = 0; i < this.tabs.length; i += 1) {
            var tab = this.tabs[i]
            if (currentTab === tab) {
                tab.setAttribute("aria-selected", "true")
                tab.removeAttribute("tabindex")
                this.tabpanels[i].classList.remove("is-hidden")
                if (setFocus) {
                    tab.focus()
                }
            } else {
                tab.setAttribute("aria-selected", "false")
                tab.tabIndex = -1
                this.tabpanels[i].classList.add("is-hidden")
            }
        }
    }

    setSelectedToPreviousTab(currentTab) {
        var index

        if (currentTab === this.firstTab) {
            this.setSelectedTab(this.lastTab)
        } else {
            index = this.tabs.indexOf(currentTab)
            this.setSelectedTab(this.tabs[index - 1])
        }
    }

    setSelectedToNextTab(currentTab) {
        var index

        if (currentTab === this.lastTab) {
            this.setSelectedTab(this.firstTab)
        } else {
            index = this.tabs.indexOf(currentTab)
            this.setSelectedTab(this.tabs[index + 1])
        }
    }

    /* EVENT HANDLERS */

    onKeydown(event) {
        var tgt = event.currentTarget,
            flag = false

        switch (event.key) {
            case "ArrowLeft":
                this.setSelectedToPreviousTab(tgt)
                flag = true
                break

            case "ArrowRight":
                this.setSelectedToNextTab(tgt)
                flag = true
                break

            case "Home":
                this.setSelectedTab(this.firstTab)
                flag = true
                break

            case "End":
                this.setSelectedTab(this.lastTab)
                flag = true
                break

            default:
                break
        }

        if (flag) {
            event.stopPropagation()
            event.preventDefault()
        }
    }

    onClick(event) {
        this.setSelectedTab(event.currentTarget)
    }
}

// Initialize tablist

window.addEventListener("load", function () {
    var tablists = document.querySelectorAll("[role=tablist].automatic")
    for (var i = 0; i < tablists.length; i++) {
        new TabsAutomatic(tablists[i])
    }
})

/*
 *   This content is licensed according to the W3C Software License at
 *   https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 *
 *   File:  switch-checkbox.js
 *
 *   Desc:  Switch widget using input[type=checkbox] that implements ARIA Authoring Practices
 */
;("use strict")

class CheckboxSwitch {
    constructor(domNode) {
        this.switchNode = domNode
        this.switchNode.addEventListener("focus", () => this.onFocus(event))
        this.switchNode.addEventListener("blur", () => this.onBlur(event))
    }

    onFocus(event) {
        event.currentTarget.parentNode.classList.add("focus")
    }

    onBlur(event) {
        event.currentTarget.parentNode.classList.remove("focus")
    }
}

// Initialize switches
window.addEventListener("load", function () {
    // Initialize the Switch component on all matching DOM nodes
    Array.from(
        document.querySelectorAll("input[type=checkbox][role^=switch]")
    ).forEach((element) => new CheckboxSwitch(element))
})

/*
 *   This content is licensed according to the W3C Software License at
 *   https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 *
 *   File:   menubar-editor.js
 *
 *   Desc:   Creates a menubar to control the styling of text in a textarea element
 */

/* global StyleManager */

;("use strict")

class MenubarEditor {
    constructor(domNode) {
        this.domNode = domNode
        this.menubarNode = domNode.querySelector("[role=menubar]")
        this.textareaNode = domNode.querySelector("textarea")
        this.actionManager = new StyleManager(this.textareaNode)

        this.popups = []
        this.menuitemGroups = {}
        this.menuOrientation = {}
        this.isPopup = {}

        this.firstChars = {} // see Menubar init method
        this.firstMenuitem = {} // see Menubar init method
        this.lastMenuitem = {} // see Menubar init method

        this.initMenu(this.menubarNode)
        this.domNode.addEventListener("focusin", this.onFocusin.bind(this))
        this.domNode.addEventListener("focusout", this.onFocusout.bind(this))

        window.addEventListener(
            "pointerdown",
            this.onBackgroundPointerdown.bind(this),
            true
        )
    }

    getMenuitems(domNode) {
        var nodes = []

        var initMenu = this.initMenu.bind(this)
        var getGroupId = this.getGroupId.bind(this)
        var menuitemGroups = this.menuitemGroups
        var popups = this.popups

        function findMenuitems(node, group) {
            var role, flag, groupId

            while (node) {
                flag = true
                role = node.getAttribute("role")

                switch (role) {
                    case "menu":
                        node.tabIndex = -1
                        initMenu(node)
                        flag = false
                        break

                    case "group":
                        groupId = getGroupId(node)
                        menuitemGroups[groupId] = []
                        break

                    case "menuitem":
                    case "menuitemradio":
                    case "menuitemcheckbox":
                        if (node.getAttribute("aria-haspopup") === "true") {
                            popups.push(node)
                        }
                        nodes.push(node)
                        if (group) {
                            group.push(node)
                        }
                        break

                    default:
                        break
                }

                if (flag && node.firstElementChild) {
                    findMenuitems(
                        node.firstElementChild,
                        menuitemGroups[groupId]
                    )
                }

                node = node.nextElementSibling
            }
        }

        findMenuitems(domNode.firstElementChild, false)

        return nodes
    }

    initMenu(menu) {
        var i, menuitems, menuitem, role

        var menuId = this.getMenuId(menu)

        menuitems = this.getMenuitems(menu)
        this.menuOrientation[menuId] = this.getMenuOrientation(menu)
        this.isPopup[menuId] = menu.getAttribute("role") === "menu"

        this.menuitemGroups[menuId] = []
        this.firstChars[menuId] = []
        this.firstMenuitem[menuId] = null
        this.lastMenuitem[menuId] = null

        for (i = 0; i < menuitems.length; i++) {
            menuitem = menuitems[i]
            role = menuitem.getAttribute("role")

            if (role.indexOf("menuitem") < 0) {
                continue
            }

            menuitem.tabIndex = -1
            this.menuitemGroups[menuId].push(menuitem)
            this.firstChars[menuId].push(menuitem.textContent[0].toLowerCase())

            menuitem.addEventListener("keydown", this.onKeydown.bind(this))
            menuitem.addEventListener("click", this.onMenuitemClick.bind(this))

            menuitem.addEventListener(
                "pointerover",
                this.onMenuitemPointerover.bind(this)
            )

            if (!this.firstMenuitem[menuId]) {
                if (this.hasPopup(menuitem)) {
                    menuitem.tabIndex = 0
                }
                this.firstMenuitem[menuId] = menuitem
            }
            this.lastMenuitem[menuId] = menuitem
        }
    }

    /* MenubarEditor FOCUS MANAGEMENT METHODS */

    setFocusToMenuitem(menuId, newMenuitem) {
        var isAnyPopupOpen = this.isAnyPopupOpen()

        this.closePopupAll(newMenuitem)

        if (this.hasPopup(newMenuitem)) {
            if (isAnyPopupOpen) {
                this.openPopup(newMenuitem)
            }
        } else {
            var menu = this.getMenu(newMenuitem)
            var cmi = menu.previousElementSibling
            if (!this.isOpen(cmi)) {
                this.openPopup(cmi)
            }
        }

        if (this.hasPopup(newMenuitem)) {
            if (this.menuitemGroups[menuId]) {
                this.menuitemGroups[menuId].forEach(function (item) {
                    item.tabIndex = -1
                })
            }
            newMenuitem.tabIndex = 0
        }

        newMenuitem.focus()
    }

    setFocusToFirstMenuitem(menuId) {
        this.setFocusToMenuitem(menuId, this.firstMenuitem[menuId])
    }

    setFocusToLastMenuitem(menuId) {
        this.setFocusToMenuitem(menuId, this.lastMenuitem[menuId])
    }

    setFocusToPreviousMenuitem(menuId, currentMenuitem) {
        var newMenuitem, index

        if (currentMenuitem === this.firstMenuitem[menuId]) {
            newMenuitem = this.lastMenuitem[menuId]
        } else {
            index = this.menuitemGroups[menuId].indexOf(currentMenuitem)
            newMenuitem = this.menuitemGroups[menuId][index - 1]
        }

        this.setFocusToMenuitem(menuId, newMenuitem)

        return newMenuitem
    }

    setFocusToNextMenuitem(menuId, currentMenuitem) {
        var newMenuitem, index

        if (currentMenuitem === this.lastMenuitem[menuId]) {
            newMenuitem = this.firstMenuitem[menuId]
        } else {
            index = this.menuitemGroups[menuId].indexOf(currentMenuitem)
            newMenuitem = this.menuitemGroups[menuId][index + 1]
        }
        this.setFocusToMenuitem(menuId, newMenuitem)

        return newMenuitem
    }

    setFocusByFirstCharacter(menuId, currentMenuitem, char) {
        var start, index

        char = char.toLowerCase()

        // Get start index for search based on position of currentItem
        start = this.menuitemGroups[menuId].indexOf(currentMenuitem) + 1
        if (start >= this.menuitemGroups[menuId].length) {
            start = 0
        }

        // Check remaining slots in the menu
        index = this.getIndexFirstChars(menuId, start, char)

        // If not found in remaining slots, check from beginning
        if (index === -1) {
            index = this.getIndexFirstChars(menuId, 0, char)
        }

        // If match was found...
        if (index > -1) {
            this.setFocusToMenuitem(menuId, this.menuitemGroups[menuId][index])
        }
    }

    // Utilities

    getIndexFirstChars(menuId, startIndex, char) {
        for (var i = startIndex; i < this.firstChars[menuId].length; i++) {
            if (char === this.firstChars[menuId][i]) {
                return i
            }
        }
        return -1
    }

    isPrintableCharacter(str) {
        return str.length === 1 && str.match(/\S/)
    }

    getIdFromAriaLabel(node) {
        var id = node.getAttribute("aria-label")
        if (id) {
            id = id.trim().toLowerCase().replace(" ", "-").replace("/", "-")
        }
        return id
    }

    getMenuOrientation(node) {
        var orientation = node.getAttribute("aria-orientation")

        if (!orientation) {
            var role = node.getAttribute("role")

            switch (role) {
                case "menubar":
                    orientation = "horizontal"
                    break

                case "menu":
                    orientation = "vertical"
                    break

                default:
                    break
            }
        }

        return orientation
    }

    getDataOption(node) {
        var option = false
        var hasOption = node.hasAttribute("data-option")
        var role = node.hasAttribute("role")

        if (!hasOption) {
            while (
                node &&
                !hasOption &&
                role !== "menu" &&
                role !== "menubar"
            ) {
                node = node.parentNode
                if (node) {
                    role = node.getAttribute("role")
                    hasOption = node.hasAttribute("data-option")
                }
            }
        }

        if (node) {
            option = node.getAttribute("data-option")
        }

        return option
    }

    getGroupId(node) {
        var id = false
        var role = node.getAttribute("role")

        while (
            node &&
            role !== "group" &&
            role !== "menu" &&
            role !== "menubar"
        ) {
            node = node.parentNode
            if (node) {
                role = node.getAttribute("role")
            }
        }

        if (node) {
            id = role + "-" + this.getIdFromAriaLabel(node)
        }

        return id
    }

    getMenuId(node) {
        var id = false
        var role = node.getAttribute("role")

        while (node && role !== "menu" && role !== "menubar") {
            node = node.parentNode
            if (node) {
                role = node.getAttribute("role")
            }
        }

        if (node) {
            id = role + "-" + this.getIdFromAriaLabel(node)
        }

        return id
    }

    getMenu(menuitem) {
        var menu = menuitem
        var role = menuitem.getAttribute("role")

        while (menu && role !== "menu" && role !== "menubar") {
            menu = menu.parentNode
            if (menu) {
                role = menu.getAttribute("role")
            }
        }

        return menu
    }

    toggleCheckbox(menuitem) {
        if (menuitem.getAttribute("aria-checked") === "true") {
            menuitem.setAttribute("aria-checked", "false")
            return false
        }
        menuitem.setAttribute("aria-checked", "true")
        return true
    }

    setRadioButton(menuitem) {
        var groupId = this.getGroupId(menuitem)
        var radiogroupItems = this.menuitemGroups[groupId]
        radiogroupItems.forEach(function (item) {
            item.setAttribute("aria-checked", "false")
        })
        menuitem.setAttribute("aria-checked", "true")
        return menuitem.textContent
    }

    updateFontSizeMenu(menuId) {
        var fontSizeMenuitems = this.menuitemGroups[menuId]
        var currentValue = this.actionManager.getFontSize()

        for (var i = 0; i < fontSizeMenuitems.length; i++) {
            var mi = fontSizeMenuitems[i]
            var dataOption = mi.getAttribute("data-option")
            var value = mi.textContent.trim().toLowerCase()

            switch (dataOption) {
                case "font-smaller":
                    if (currentValue === "x-small") {
                        mi.setAttribute("aria-disabled", "true")
                    } else {
                        mi.removeAttribute("aria-disabled")
                    }
                    break

                case "font-larger":
                    if (currentValue === "x-large") {
                        mi.setAttribute("aria-disabled", "true")
                    } else {
                        mi.removeAttribute("aria-disabled")
                    }
                    break

                default:
                    if (currentValue === value) {
                        mi.setAttribute("aria-checked", "true")
                    } else {
                        mi.setAttribute("aria-checked", "false")
                    }
                    break
            }
        }
    }

    // Popup menu methods

    isAnyPopupOpen() {
        for (var i = 0; i < this.popups.length; i++) {
            if (this.popups[i].getAttribute("aria-expanded") === "true") {
                return true
            }
        }
        return false
    }

    openPopup(menuitem) {
        // set aria-expanded attribute
        var popupMenu = menuitem.nextElementSibling

        var rect = menuitem.getBoundingClientRect()

        // set CSS properties
        popupMenu.style.position = "absolute"
        popupMenu.style.top = rect.height - 3 + "px"
        popupMenu.style.left = "0px"
        popupMenu.style.zIndex = 100
        popupMenu.style.display = "block"

        menuitem.setAttribute("aria-expanded", "true")

        return this.getMenuId(popupMenu)
    }

    closePopup(menuitem) {
        var menu, cmi

        if (this.hasPopup(menuitem)) {
            if (this.isOpen(menuitem)) {
                menuitem.setAttribute("aria-expanded", "false")
                menuitem.nextElementSibling.style.display = "none"
                menuitem.nextElementSibling.style.zIndex = 0
            }
        } else {
            menu = this.getMenu(menuitem)
            cmi = menu.previousElementSibling
            cmi.setAttribute("aria-expanded", "false")
            cmi.focus()
            menu.style.display = "none"
            menu.style.zIndex = 0
        }
        return cmi
    }

    doesNotContain(popup, menuitem) {
        if (menuitem) {
            return !popup.nextElementSibling.contains(menuitem)
        }
        return true
    }

    closePopupAll(menuitem) {
        if (typeof menuitem !== "object") {
            menuitem = false
        }

        for (var i = 0; i < this.popups.length; i++) {
            var popup = this.popups[i]
            if (this.isOpen(popup) && this.doesNotContain(popup, menuitem)) {
                this.closePopup(popup)
            }
        }
    }

    hasPopup(menuitem) {
        return menuitem.getAttribute("aria-haspopup") === "true"
    }

    isOpen(menuitem) {
        return menuitem.getAttribute("aria-expanded") === "true"
    }

    // Menu event handlers

    onFocusin() {
        this.domNode.classList.add("focus")
    }

    onFocusout() {
        this.domNode.classList.remove("focus")
    }

    onBackgroundPointerdown(event) {
        if (!this.menubarNode.contains(event.target)) {
            this.closePopupAll()
        }
    }

    onKeydown(event) {
        var tgt = event.currentTarget,
            key = event.key,
            flag = false,
            menuId = this.getMenuId(tgt),
            id,
            popupMenuId,
            mi,
            role,
            option,
            value

        switch (key) {
            case " ":
            case "Enter":
                if (this.hasPopup(tgt)) {
                    popupMenuId = this.openPopup(tgt)
                    this.setFocusToFirstMenuitem(popupMenuId)
                } else {
                    role = tgt.getAttribute("role")
                    option = this.getDataOption(tgt)
                    switch (role) {
                        case "menuitem":
                            this.actionManager.setOption(
                                option,
                                tgt.textContent
                            )
                            break

                        case "menuitemcheckbox":
                            value = this.toggleCheckbox(tgt)
                            this.actionManager.setOption(option, value)
                            break

                        case "menuitemradio":
                            value = this.setRadioButton(tgt)
                            this.actionManager.setOption(option, value)
                            break

                        default:
                            break
                    }

                    if (this.getMenuId(tgt) === "menu-size") {
                        this.updateFontSizeMenu("menu-size")
                    }
                    this.closePopup(tgt)
                }
                flag = true
                break

            case "ArrowDown":
            case "Down":
                if (this.menuOrientation[menuId] === "vertical") {
                    this.setFocusToNextMenuitem(menuId, tgt)
                    flag = true
                } else {
                    if (this.hasPopup(tgt)) {
                        popupMenuId = this.openPopup(tgt)
                        this.setFocusToFirstMenuitem(popupMenuId)
                        flag = true
                    }
                }
                break

            case "Esc":
            case "Escape":
                this.closePopup(tgt)
                flag = true
                break

            case "Left":
            case "ArrowLeft":
                if (this.menuOrientation[menuId] === "horizontal") {
                    this.setFocusToPreviousMenuitem(menuId, tgt)
                    flag = true
                } else {
                    mi = this.closePopup(tgt)
                    id = this.getMenuId(mi)
                    mi = this.setFocusToPreviousMenuitem(id, mi)
                    this.openPopup(mi)
                }
                break

            case "Right":
            case "ArrowRight":
                if (this.menuOrientation[menuId] === "horizontal") {
                    this.setFocusToNextMenuitem(menuId, tgt)
                    flag = true
                } else {
                    mi = this.closePopup(tgt)
                    id = this.getMenuId(mi)
                    mi = this.setFocusToNextMenuitem(id, mi)
                    this.openPopup(mi)
                }
                break

            case "Up":
            case "ArrowUp":
                if (this.menuOrientation[menuId] === "vertical") {
                    this.setFocusToPreviousMenuitem(menuId, tgt)
                    flag = true
                } else {
                    if (this.hasPopup(tgt)) {
                        popupMenuId = this.openPopup(tgt)
                        this.setFocusToLastMenuitem(popupMenuId)
                        flag = true
                    }
                }
                break

            case "Home":
            case "PageUp":
                this.setFocusToFirstMenuitem(menuId, tgt)
                flag = true
                break

            case "End":
            case "PageDown":
                this.setFocusToLastMenuitem(menuId, tgt)
                flag = true
                break

            case "Tab":
                this.closePopup(tgt)
                break

            default:
                if (this.isPrintableCharacter(key)) {
                    this.setFocusByFirstCharacter(menuId, tgt, key)
                    flag = true
                }
                break
        }

        if (flag) {
            event.stopPropagation()
            event.preventDefault()
        }
    }

    onMenuitemClick(event) {
        var tgt = event.currentTarget
        var value

        if (this.hasPopup(tgt)) {
            if (this.isOpen(tgt)) {
                this.closePopup(tgt)
            } else {
                var menuId = this.openPopup(tgt)
                this.setFocusToMenuitem(menuId, tgt)
            }
        } else {
            var role = tgt.getAttribute("role")
            var option = this.getDataOption(tgt)
            switch (role) {
                case "menuitem":
                    this.actionManager.setOption(option, tgt.textContent)
                    break

                case "menuitemcheckbox":
                    value = this.toggleCheckbox(tgt)
                    this.actionManager.setOption(option, value)
                    break

                case "menuitemradio":
                    value = this.setRadioButton(tgt)
                    this.actionManager.setOption(option, value)
                    break

                default:
                    break
            }

            if (this.getMenuId(tgt) === "menu-size") {
                this.updateFontSizeMenu("menu-size")
            }
            this.closePopup(tgt)
        }

        event.stopPropagation()
        event.preventDefault()
    }

    onMenuitemPointerover(event) {
        var tgt = event.currentTarget

        if (this.isAnyPopupOpen() && this.getMenu(tgt)) {
            this.setFocusToMenuitem(this.getMenu(tgt), tgt)
        }
    }
}

// Initialize menubar editor

window.addEventListener("load", function () {
    var menubarEditors = document.querySelectorAll(".menubar-editor")
    for (var i = 0; i < menubarEditors.length; i++) {
        new MenubarEditor(menubarEditors[i])
    }
})
/*
 *   This content is licensed according to the W3C Software License at
 *   https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 *
 *   File:   TextStyling.js
 *
 *   Desc:   Styling functions for changing the style of an item
 */

;("use strict")

/* exported StyleManager */

class StyleManager {
    constructor(node) {
        this.node = node
        this.fontSize = "medium"
    }

    setFontFamily(value) {
        this.node.style.fontFamily = value
    }

    setTextDecoration(value) {
        this.node.style.textDecoration = value
    }

    setTextAlign(value) {
        this.node.style.textAlign = value
    }

    setFontSize(value) {
        this.fontSize = value
        this.node.style.fontSize = value
    }

    setColor(value) {
        this.node.style.color = value
    }

    setBold(flag) {
        if (flag) {
            this.node.style.fontWeight = "bold"
        } else {
            this.node.style.fontWeight = "normal"
        }
    }

    setItalic(flag) {
        if (flag) {
            this.node.style.fontStyle = "italic"
        } else {
            this.node.style.fontStyle = "normal"
        }
    }

    fontSmaller() {
        switch (this.fontSize) {
            case "small":
                this.setFontSize("x-small")
                break

            case "medium":
                this.setFontSize("small")
                break

            case "large":
                this.setFontSize("medium")
                break

            case "x-large":
                this.setFontSize("large")
                break

            default:
                break
        } // end switch
    }

    fontLarger() {
        switch (this.fontSize) {
            case "x-small":
                this.setFontSize("small")
                break

            case "small":
                this.setFontSize("medium")
                break

            case "medium":
                this.setFontSize("large")
                break

            case "large":
                this.setFontSize("x-large")
                break

            default:
                break
        } // end switch
    }

    isMinFontSize() {
        return this.fontSize === "x-small"
    }

    isMaxFontSize() {
        return this.fontSize === "x-large"
    }

    getFontSize() {
        return this.fontSize
    }

    setOption(option, value) {
        option = option.toLowerCase()
        if (typeof value === "string") {
            value = value.toLowerCase()
        }

        switch (option) {
            case "font-bold":
                this.setBold(value)
                break

            case "font-color":
                this.setColor(value)
                break

            case "font-family":
                this.setFontFamily(value)
                break

            case "font-smaller":
                this.fontSmaller()
                break

            case "font-larger":
                this.fontLarger()
                break

            case "font-size":
                this.setFontSize(value)
                break

            case "font-italic":
                this.setItalic(value)
                break

            case "text-align":
                this.setTextAlign(value)
                break

            case "text-decoration":
                this.setTextDecoration(value)
                break

            default:
                break
        } // end switch
    }
}
