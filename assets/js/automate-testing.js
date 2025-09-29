/**
 * Abstract base class for accessibility tests following the Single Responsibility Principle
 * Each test is responsible for one specific accessibility rule
 */
class AccessibilityTest {
    constructor(name, ruleId, description) {
        if (this.constructor === AccessibilityTest) {
            throw new Error(
                "Cannot instantiate abstract class AccessibilityTest"
            )
        }
        this.name = name
        this.ruleId = ruleId
        this.description = description
    }

    /**
     * Abstract method that must be implemented by concrete test classes
     * Returns the default example code for this test
     */
    getDefaultExample() {
        throw new Error("getDefaultExample must be implemented by subclass")
    }

    /**
     * Template method that runs the axe test with the specific rule
     * Follows the Open/Closed Principle - open for extension, closed for modification
     */
    async runTest(element) {
        try {
            const results = await axe.run(element, {
                rules: {
                    [this.ruleId]: { enabled: true },
                },
            })
            return this.processResults(results)
        } catch (error) {
            return {
                success: false,
                error: `Fehler beim Ausführen des Tests: ${error.message}`,
            }
        }
    }

    /**
     * Processes the raw axe results into a standardized format
     * Can be overridden by subclasses for specific processing needs
     */
    processResults(results) {
        const violations = results.violations.filter(
            (v) => v.id === this.ruleId
        )

        return {
            success: violations.length === 0,
            violations: violations,
            testName: this.name,
            timestamp: new Date().toISOString(),
        }
    }
}

/**
 * Concrete implementation for Target Size test
 * Follows Single Responsibility Principle - only handles target size testing
 */
class TargetSizeTest extends AccessibilityTest {
    constructor() {
        super(
            "Target Size (Minimum)",
            "target-size",
            "Überprüft ob interaktive Elemente mindestens 24x24 CSS-Pixel groß sind"
        )
    }

    getDefaultExample() {
        return {
            html: `<!-- Navigation mit verschiedenen Button-Größen -->
  

<nav aria-label="Hauptnavigation">
  <ul class="nav-list">
    <li><a href="#" class="nav-button small">Klein (18x18px)</a></li>
    <li><a href="#"  class="nav-button medium">Mittel (24x24px)</a></li>
    <li><a href="#"  class="nav-button large">Groß (44x44px)</a></li>
  </ul>
</nav>

<div class="interactive-elements">
  <h3>Weitere interaktive Elemente:</h3>
  <a href="#" class="small-link">Kleiner Link</a>
  <a href="#" class="good-link">Guter Link</a>
  <input type="checkbox" id="small-checkbox" class="small-checkbox">
  <label for="small-checkbox">Kleines Checkbox</label>

  <input type="checkbox" id="good-checkbox" class="good-checkbox">
  <label for="good-checkbox">Gutes Checkbox</label>
</div>`,
            css: `/* Navigation Styles */
.nav-list {
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
}

.nav-button {
border: 2px solid #333;
background: #f0f0f0;
cursor: pointer;
font-family: inherit;
transition: all 0.3s ease;
}

.nav-button:hover {
background: #e0e0e0;
}

.nav-button:focus {
outline: 2px solid #0066cc;
outline-offset: 2px;
}

/* Verschiedene Größen für Target Size Test */
.nav-button.small {
width: 18px;  /* Zu klein - wird Test fehlschlagen lassen */
height: 18px;
font-size: 10px;
}

.nav-button.medium {
width: 24px;  /* Mindestgröße - sollte Test bestehen */
height: 24px;
font-size: 12px;
}

.nav-button.large {
width: 44px;  /* Empfohlene Größe - wird Test bestehen */
height: 44px;
font-size: 14px;
}

/* Link Styles */
.small-link {
font-size: 10px;  /* Zu klein */
padding: 2px;
display: inline-block;
color: #0066cc;
text-decoration: none;
}

.good-link {
font-size: 16px;  /* Gute Größe */
padding: 12px;
display: inline-block;
color: #0066cc;
text-decoration: none;
margin-left: 20px;
}

/* Checkbox Styles */
.small-checkbox {
width: 12px;  /* Zu klein */
height: 12px;
margin: 10px 5px;
}

.good-checkbox {
width: 24px;  /* Mindestgröße */
height: 24px;
margin: 10px 5px;
}

/* General Styles */
.interactive-elements {
margin-top: 30px;
padding: 20px;
border: 1px solid #ddd;
border-radius: 8px;
}

.interactive-elements h3 {
margin-top: 0;
color: #333;
}

body {
font-family: Arial, sans-serif;
line-height: 1.6;
color: #333;
padding: 20px;
}`,
        }
    }
}

/**
 * Factory class for creating test instances
 * Follows the Factory Pattern and makes adding new tests easy (Open/Closed Principle)
 */
class TestFactory {
    static tests = {
        "target-size": TargetSizeTest,
    }

    static createTest(testType) {
        const TestClass = this.tests[testType]
        if (!TestClass) {
            throw new Error(`Unknown test type: ${testType}`)
        }
        return new TestClass()
    }

    static getAvailableTests() {
        return Object.keys(this.tests)
    }

    /**
     * Method to register new tests - follows Open/Closed Principle
     * New tests can be added without modifying existing code
     */
    static registerTest(testType, testClass) {
        this.tests[testType] = testClass
    }
}

/**
 * Main application class that orchestrates the testing interface
 * Follows Single Responsibility Principle - manages UI interactions and test execution
 */
class AccessibilityTestInterface {
    constructor() {
        this.currentTest = null
        this.initializeElements()
        this.setupEventListeners()
        this.loadInitialTest()
    }

    /**
     * Initialize DOM element references
     * Follows Dependency Inversion Principle - depends on abstractions (DOM elements)
     */
    initializeElements() {
        this.elements = {
            testSelect: document.getElementById("testSelect"),
            htmlEditor: document.getElementById("htmlEditor"),
            cssEditor: document.getElementById("cssEditor"),
            previewContainer: document.getElementById("previewContainer"),
            previewFrame: document.getElementById("previewFrame"),
            previewHeader: document.querySelector(".preview-header"),
            previewInfo: document.getElementById("previewInfo"),
            resultsContainer: document.getElementById("resultsContainer"),
            resultsHeader: document.getElementById("resultsHeader"),
            resultsContent: document.getElementById("resultsContent"),
            loadExampleBtn: document.getElementById("loadExample"),
            updatePreviewBtn: document.getElementById("updatePreview"),
            runTestBtn: document.getElementById("runTest"),
        }
    }

    /**
     * Setup event listeners for user interactions
     * Follows Interface Segregation Principle - each handler has a specific purpose
     */
    setupEventListeners() {
        this.elements.testSelect.addEventListener("change", (e) => {
            this.loadTest(e.target.value)
        })

        this.elements.loadExampleBtn.addEventListener("click", () => {
            this.loadExample()
        })

        this.elements.updatePreviewBtn.addEventListener("click", () => {
            this.updatePreview()
        })

        this.elements.runTestBtn.addEventListener("click", () => {
            this.runAccessibilityTest()
        })

        // Auto-update preview when editors change
        ;[this.elements.htmlEditor, this.elements.cssEditor].forEach(
            (editor) => {
                editor.addEventListener("input", () => {
                    clearTimeout(this.updateTimeout)
                    this.updateTimeout = setTimeout(() => {
                        this.updatePreview()
                    }, 1000)
                })
            }
        )
    }

    /**
     * Load initial test on startup
     */
    loadInitialTest() {
        this.loadTest("target-size")
        this.loadExample()
    }

    /**
     * Load a specific test type
     * Follows Liskov Substitution Principle - any AccessibilityTest subclass works
     */
    loadTest(testType) {
        try {
            this.currentTest = TestFactory.createTest(testType)
            console.log(`Loaded test: ${this.currentTest.name}`)
        } catch (error) {
            console.error("Error loading test:", error)
            alert(`Fehler beim Laden des Tests: ${error.message}`)
        }
    }

    /**
     * Load example code for current test
     */
    loadExample() {
        if (!this.currentTest) {
            alert("Kein Test ausgewählt")
            return
        }

        const example = this.currentTest.getDefaultExample()
        this.elements.htmlEditor.value = example.html
        this.elements.cssEditor.value = example.css
        this.updatePreview()
    }

    /**
     * Update the preview with current HTML and CSS
     */
    updatePreview() {
        const html = this.elements.htmlEditor.value
        const css = this.elements.cssEditor.value

        const styledHtml = `
                <style>
                    ${css}
                    
                    /* Accessibility test highlighting styles */
                    .axe-violation {
                        position: relative;
                    }
                    
                    .axe-pass {
                        position: relative;
                    }
                    
                    .axe-violation::after {
                        content: "❌";
                        position: absolute;
                        top: -10px;
                        right: -10px;
                        background: #dc3545;
                        color: white;
                        border-radius: 50%;
                        width: 20px;
                        height: 20px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 12px;
                        z-index: 1000;
                    }
                    
                    .axe-pass::after {
                        content: "✓";
                        position: absolute;
                        top: -10px;
                        right: -10px;
                        background: #28a745;
                        color: white;
                        border-radius: 50%;
                        width: 20px;
                        height: 20px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 12px;
                        z-index: 1000;
                    }
                </style>
                ${html}
            `

        this.elements.previewFrame.innerHTML = styledHtml
        this.elements.previewInfo.textContent = `Aktualisiert: ${new Date().toLocaleTimeString()}`

        // Reset preview styling when updated
        this.resetPreviewStyling()

        // Hide previous results when preview is updated
        this.elements.resultsContainer.style.display = "none"
    }

    /**
     * Reset preview container styling to default state
     */
    resetPreviewStyling() {
        const container = this.elements.previewContainer
        const header = this.elements.previewHeader

        container.className = "preview-container"
        header.className = "preview-header"

        // Remove any element highlighting
        this.clearElementHighlighting()
    }

    /**
     * Clear all element highlighting from previous tests
     */
    clearElementHighlighting() {
        const highlightedElements = this.elements.previewFrame.querySelectorAll(
            ".axe-violation, .axe-pass"
        )
        highlightedElements.forEach((element) => {
            element.classList.remove("axe-violation", "axe-pass")
            element.style.removeProperty("outline")
            element.style.removeProperty("outline-offset")
        })
    }

    /**
     * Highlight individual elements based on test results
     * Red for violations, green for passed elements
     */
    highlightTestedElements(results) {
        // Clear previous highlighting
        this.clearElementHighlighting()

        // Highlight violation elements in red
        if (results.violations && results.violations.length > 0) {
            results.violations.forEach((violation) => {
                violation.nodes.forEach((nodeResult) => {
                    const element = this.findElementBySelector(
                        nodeResult.target[0]
                    )
                    if (element) {
                        element.classList.add("axe-violation")
                        element.style.outline = "3px solid #dc3545"
                        element.style.outlineOffset = "2px"

                        // Add tooltip with violation info
                        element.title = `Barrierefreiheits-Verstoß: ${violation.description}`
                    }
                })
            })
        }

        // Highlight passed elements in green (interactive elements that passed the test)
        this.highlightPassedElements()
    }

    /**
     * Highlight elements that passed the accessibility test
     */
    highlightPassedElements() {
        // Find all interactive elements that could be tested
        const interactiveSelectors = [
            "button",
            "a[href]",
            'input[type="button"]',
            'input[type="submit"]',
            'input[type="reset"]',
            'input[type="checkbox"]',
            'input[type="radio"]',
            '[role="button"]',
            "[tabindex]",
        ]

        interactiveSelectors.forEach((selector) => {
            const elements =
                this.elements.previewFrame.querySelectorAll(selector)
            elements.forEach((element) => {
                // Only highlight if not already marked as violation
                if (!element.classList.contains("axe-violation")) {
                    element.classList.add("axe-pass")
                    element.style.outline = "3px solid #28a745"
                    element.style.outlineOffset = "2px"

                    // Add tooltip for passed elements
                    element.title = "Barrierefreiheits-Test bestanden"
                }
            })
        })
    }

    /**
     * Find element by CSS selector in preview frame
     */
    findElementBySelector(selector) {
        try {
            return this.elements.previewFrame.querySelector(selector)
        } catch (error) {
            console.warn("Could not find element with selector:", selector)
            return null
        }
    }

    /**
     * Update preview styling based on test results
     */
    updatePreviewStyling(success, isRunning = false) {
        const container = this.elements.previewContainer
        const header = this.elements.previewHeader

        if (isRunning) {
            container.className = "preview-container test-running"
            header.className = "preview-header test-running"
        } else if (success) {
            container.className = "preview-container test-success"
            header.className = "preview-header test-success"
        } else {
            container.className = "preview-container test-error"
            header.className = "preview-header test-error"
        }
    }

    /**
     * Run the accessibility test on current preview
     * Follows Single Responsibility Principle - delegates test execution to test object
     */
    async runAccessibilityTest() {
        if (!this.currentTest) {
            alert("Kein Test ausgewählt")
            return
        }

        // Update preview first to ensure we test current code
        this.updatePreview()

        try {
            // Show running state
            this.updatePreviewStyling(false, true)
            this.elements.runTestBtn.textContent = "Test läuft..."
            this.elements.runTestBtn.disabled = true

            const results = await this.currentTest.runTest(
                this.elements.previewFrame
            )

            // Update preview styling based on results
            this.updatePreviewStyling(results.success)

            // Highlight individual elements based on test results
            this.highlightTestedElements(results)

            this.displayResults(results)
        } catch (error) {
            console.error("Error running test:", error)
            this.updatePreviewStyling(false)
            this.displayResults({
                success: false,
                error: `Unerwarteter Fehler: ${error.message}`,
            })
        } finally {
            this.elements.runTestBtn.textContent = "Test ausführen"
            this.elements.runTestBtn.disabled = false
        }
    }

    /**
     * Display test results in the UI
     * Follows Single Responsibility Principle - only handles result display
     */
    displayResults(results) {
        this.elements.resultsContainer.style.display = "block"

        if (results.success) {
            this.elements.resultsContainer.className =
                "results-container success"
            this.elements.resultsHeader.textContent = "✓ Test bestanden"
            this.elements.resultsHeader.className = "results-header success"
            this.elements.resultsContent.innerHTML = `
                    <p><strong>Gratulation!</strong> Der ${
                        results.testName
                    } Test wurde erfolgreich bestanden.</p>
                    <p>Alle interaktiven Elemente erfüllen die Mindestanforderungen für die Barrierefreiheit.</p>
                    <p><em>Getestet am: ${new Date(
                        results.timestamp
                    ).toLocaleString()}</em></p>
                `
        } else {
            this.elements.resultsContainer.className = "results-container error"
            this.elements.resultsHeader.textContent = "✗ Test fehlgeschlagen"
            this.elements.resultsHeader.className = "results-header error"

            if (results.error) {
                this.elements.resultsContent.innerHTML = `
                        <p><strong>Fehler:</strong> ${results.error}</p>
                    `
            } else {
                const violationsHtml = results.violations
                    .map(
                        (violation) => `
                        <div class="violation-item">
                            <h4>${violation.description}</h4>
                            <p><strong>Betroffen:</strong> ${
                                violation.nodes.length
                            } Element(e)</p>
                            <p><strong>Impact:</strong> ${violation.impact}</p>
                            <p><strong>Tags:</strong> ${violation.tags.join(
                                ", "
                            )}</p>
                            <a href="${
                                violation.helpUrl
                            }" target="_blank" class="help-url">Mehr Informationen</a>
                        </div>
                    `
                    )
                    .join("")

                this.elements.resultsContent.innerHTML = `
                        <p><strong>${
                            results.violations.length
                        } Verstöße gefunden:</strong></p>
                        ${violationsHtml}
                        <p><em>Getestet am: ${new Date(
                            results.timestamp
                        ).toLocaleString()}</em></p>
                    `
            }
        }

        // Scroll to results
        this.elements.resultsContainer.scrollIntoView({
            behavior: "smooth",
            block: "start",
        })
    }
}

// Initialize the application when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
    new AccessibilityTestInterface()
})

// Global error handler
window.addEventListener("error", (e) => {
    console.error("Global error:", e.error)
})
