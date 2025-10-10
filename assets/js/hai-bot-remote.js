class RemoteChatController {
    constructor() {
        this.messages = []
        this.debugLog = []
        this.apiUrl = "http://localhost:3000/api/chat"
        this.chatbotId = "37632ee5-1dd3-4152-b364-6746f8dc8953"
        this.apiToken = "hai-xfhD88u8Tl3gKWhLQbhy6yb7UcFCRo3J"
        this.score = 0
        this.quizResults = []
        this.conversationHistory = [] // Neuer Verlauf-Speicher

        this.initElements()
        this.updateWelcomeTime()
        this.initEventListeners()
        this.initScoreBoard()
        this.log("Controller initialisiert")

        this.statusText.textContent = "Online"
        this.statusDot.classList.remove("error")
    }

    initScoreBoard() {
        const aside = document.createElement("aside")
        aside.id = "scoreBoard"
        aside.innerHTML = `
                        <h3>Quiz-Ergebnisse</h3>
                        <div class="score-display">
                            <span class="score-label">Punktzahl:</span>
                            <span class="score-value" id="scoreValue">0</span>
                        </div>
                        <div class="results-list" id="resultsList"></div>
                    `
        document.querySelector("#hai-bot").appendChild(aside)
    }

    parseQuizResponse(message) {
        const patterns = {
            point: /du erhältst (einen|1) punkt|richtig|korrekt|gut gemacht/i,
            noPoint:
                /leider (falsch|nicht korrekt)|das war nicht richtig|versuche es nochmal/i,
            question: /frage \d+|aufgabe \d+|nächste frage/i,
        }

        let result = null

        if (patterns.point.test(message)) {
            this.score++
            result = {
                type: "correct",
                points: 1,
                timestamp: new Date(),
            }
            this.log("Punkt erkannt! Neuer Score: " + this.score)
        } else if (patterns.noPoint.test(message)) {
            result = {
                type: "incorrect",
                points: 0,
                timestamp: new Date(),
            }
            this.log("Keine Punkte - falsche Antwort erkannt")
        }

        if (result) {
            this.quizResults.push(result)
            this.updateScoreBoard()
        }

        return result
    }  

    updateScoreBoard() {
        const scoreValue = document.getElementById("scoreValue")
        const resultsList = document.getElementById("resultsList")

        if (scoreValue) {
            scoreValue.textContent = this.score
            scoreValue.style.animation = "scoreUpdate 0.3s ease"
            setTimeout(() => {
                scoreValue.style.animation = ""
            }, 300)
        }

        if (resultsList) {
            resultsList.innerHTML = this.quizResults
                .map((result, index) => {
                    const icon = result.type === "correct" ? "✓" : "✗"
                    const className =
                        result.type === "correct" ? "correct" : "incorrect"
                    const time = result.timestamp.toLocaleTimeString("de-DE", {
                        hour: "2-digit",
                        minute: "2-digit",
                    })
                    return `
                                    <div class="result-item ${className}">
                                        <span class="result-icon">${icon}</span>
                                        <span class="result-text">Frage ${
                                            index + 1
                                        }</span>
                                        <span class="result-points">${
                                            result.points
                                        } Punkt${
                        result.points !== 1 ? "e" : ""
                    }</span>
                                        <span class="result-time">${time}</span>
                                    </div>
                                `
                })
                .reverse()
                .join("")
        }
    }
    
    log(message) {
        const timestamp = new Date().toLocaleTimeString()
        const logEntry = `[${timestamp}] ${message}`
        this.debugLog.push(logEntry)
        console.log(logEntry)

        const debugLogEl = document.getElementById("debugLog")
        if (debugLogEl) {
            debugLogEl.innerHTML = this.debugLog
                .slice(-30)
                .map((log) => `<div class="debug-line">${log}</div>`)
                .join("")
            debugLogEl.scrollTop = debugLogEl.scrollHeight
        }
    }
    
    initElements() {
        this.chatMessages = document.getElementById("chatMessages")
        this.chatInput = document.getElementById("chatInput")
        this.sendButton = document.getElementById("sendButton")
        this.typingIndicator = document.getElementById("typingIndicator")
        this.statusText = document.getElementById("statusText")
        this.statusDot = document.getElementById("statusDot")
    }
    
    initEventListeners() {
        this.chatInput.addEventListener("keydown", (e) => {
            if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                this.sendMessage()
            }
        })

        this.chatInput.addEventListener("input", () => {
            this.chatInput.style.height = "auto"
            this.chatInput.style.height =
                Math.min(this.chatInput.scrollHeight, 120) + "px"
        })

        this.sendButton.addEventListener("click", () => {
            this.sendMessage()
        })
    }

    async sendMessage() {
        const message = this.chatInput.value.trim()
        if (!message) return

        this.log("Sende: " + message.substring(0, 30) + "...")

        this.addMessage(message, "user")
        this.conversationHistory.push({
            role: "user",
            content: message,
        })

        // Begrenze History auf letzte 20 Nachrichten (10 Paare)
        let l = 50
        if (this.conversationHistory.length > l) {
            this.conversationHistory = this.conversationHistory.slice(-l)
        }

        this.chatInput.value = ""
        this.chatInput.style.height = "auto"
        this.showTypingIndicator()
        this.sendButton.disabled = true

        try {
            const response = await fetch(this.apiUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    message: message,
                    history: this.conversationHistory,
                }),
            })

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            const data = await response.json()

            if (!data.success) {
                throw new Error(data.error || "Unbekannter Fehler")
            }

            this.log(
                "Antwort empfangen: " + data.message.substring(0, 30) + "..."
            )

            // Füge Bot-Antwort zum Verlauf hinzu
            this.conversationHistory.push({
                role: "assistant",
                content: data.message,
            })

            this.parseQuizResponse(data.message)

            this.hideTypingIndicator()
            const htmlMessage = this.convertMarkdown(data.message)
            this.addMessage(htmlMessage, "bot")
        } catch (error) {
            this.log("Fehler: " + error.message)
            this.hideTypingIndicator()
            this.addMessage(
                "Entschuldigung, es gab einen Fehler bei der Verbindung. Bitte versuche es erneut.",
                "bot"
            )
            this.statusText.textContent = "Fehler"
            this.statusDot.classList.add("error")

            setTimeout(() => {
                this.statusText.textContent = "Online"
                this.statusDot.classList.remove("error")
            }, 3000)
        } finally {
            this.sendButton.disabled = false
        }
    }

    addMessage(content, type) {
        const messageDiv = document.createElement("div")
        messageDiv.className = `message ${type}`

        const bubble = document.createElement("div")
        bubble.className = "message-bubble"

        if (type === "bot") {
            bubble.innerHTML = content
        } else {
            bubble.textContent = content
        }

        const time = document.createElement("div")
        time.className = "message-time"
        time.textContent = this.getCurrentTime()
        bubble.appendChild(time)

        messageDiv.appendChild(bubble)
        this.chatMessages.appendChild(messageDiv)
        this.scrollToBottom()

        this.messages.push({ content, type, time: new Date() })
    }
    
    showTypingIndicator() {
        this.typingIndicator.classList.add("active")
        this.scrollToBottom()
    }

    hideTypingIndicator() {
        this.typingIndicator.classList.remove("active")
    }

    scrollToBottom() {
        setTimeout(() => {
            this.chatMessages.scrollTop = this.chatMessages.scrollHeight
        }, 100)
    }

    getCurrentTime() {
        return new Date().toLocaleTimeString("de-DE", {
            hour: "2-digit",
            minute: "2-digit",
        })
    }

    updateWelcomeTime() {
        const welcomeTime = document.getElementById("welcomeTime")
        if (welcomeTime) {
            welcomeTime.textContent = this.getCurrentTime()
        }
    }
    
    convertMarkdown(text) {
        let html = text
        html = html.replace(/```([\s\S]*?)```/g, "<pre><code>$1</code></pre>")
        html = html.replace(/`([^`]+)`/g, "<code>$1</code>")
        html = html.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
        html = html.replace(/\*([^*]+)\*/g, "<em>$1</em>")
        html = html.replace(
            /\[([^\]]+)\]\(([^)]+)\)/g,
            '<a href="$2" target="_blank">$1</a>'
        )
        html = html.replace(/\n/g, "<br>")
        return html
    }
}

function toggleDebug() {
    document.getElementById("debugPanel").classList.toggle("active")
}

let chatController
window.addEventListener("DOMContentLoaded", () => {
    console.log("Starte Remote Chat Controller")
    chatController = new RemoteChatController()
})
