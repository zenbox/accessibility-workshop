# Web Components

Web Components sind wiederverwendbare, gekapselte und isolierte UI-Elemente. Sie werden mit nativen HTML, CSS und JavaScript erstellt. Es gibt drei Haupttechnologien, die zusammen Web Components ermöglichen:

1. **Custom Elements**: Ermöglicht das Erstellen benutzerdefinierter HTML-Tags.
2. **Shadow DOM**: Kapselt das interne HTML und CSS eines Web Components, sodass es vom restlichen Dokument isoliert ist.
3. **HTML Templates**: Ermöglicht die Wiederverwendung von HTML-Strukturen und deren spätere Instanziierung.

### Schritt 1: Ein einfaches Custom Element definieren

Das zentrale Element in Web Components ist das Custom Element. Hier ist ein einfaches Beispiel:

```html
<!DOCTYPE html>
<html lang="de">
    <head>
        <meta charset="UTF-8" />
        <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
        />
        <title>Web Component Beispiel</title>
    </head>
    <body>
        <!-- Verwende dein Custom Element im HTML -->
        <custom-element></custom-element>

        <script>
            // Definiere eine Klasse für dein Custom Element
            class CustomElement extends HTMLElement {
                constructor() {
                    super() // Immer den Super-Constructor aufrufen
                    this.attachShadow({ mode: "open" }) // Shadow DOM verwenden
                    this.shadowRoot.innerHTML = `
          <style>
            p {
              color: blue;
            }
          </style>
          <p>Hallo, ich bin ein benutzerdefiniertes Element!</p>
        `
                }
            }

            // Registriere das Custom Element
            customElements.define("custom-element", CustomElement)
        </script>
    </body>
</html>
```

### Erklärungen:

1. **Custom Element Klasse**: Hier wird die Klasse `CustomElement` definiert, die von `HTMLElement` erbt. Im Konstruktor dieser Klasse werden die Initialisierungen vorgenommen.
2. **Shadow DOM**: Mit `this.attachShadow({ mode: 'open' })` erstellst du ein Shadow DOM. Alles, was innerhalb dieses Shadow DOMs ist, ist isoliert und hat keinen Einfluss auf den restlichen HTML-Code.

3. **InnerHTML im Shadow Root**: Das HTML und CSS, das du in `this.shadowRoot.innerHTML` einfügst, wird ausschließlich im Scope dieses Custom Elements gerendert.

4. **Registrierung des Custom Elements**: Mit `customElements.define('custom-element', CustomElement)` registrierst du dein Element und verknüpfst es mit einem benutzerdefinierten Tag (`<custom-element>`).

### Schritt 2: Erweiterte Features nutzen

Du kannst Custom Elements dynamischer gestalten, indem du Attribute, Eigenschaften und Ereignisse verwendest.

#### Attribute beobachten:

Wenn dein Custom Element bestimmte Attribute überwachen soll, kannst du die Methode `observedAttributes` nutzen und darauf reagieren:

```javascript
class CustomElement extends HTMLElement {
    constructor() {
        super()
        this.attachShadow({ mode: "open" })
        this.shadowRoot.innerHTML = `<p>Initialer Text</p>`
    }

    static get observedAttributes() {
        return ["data-text"]
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === "data-text") {
            this.shadowRoot.querySelector("p").textContent = newValue
        }
    }
}

customElements.define("custom-element", CustomElement)
```

Hier überwacht das Element das Attribut `data-text`. Sobald dieses Attribut im DOM geändert wird, aktualisiert sich der Text innerhalb des `<p>`-Tags entsprechend.

#### Nutzung:

```html
<custom-element data-text="Dynamischer Text"></custom-element>
```

### Schritt 3: Slots für benutzerdefinierte Inhalte

Web Components unterstützen auch "Slots", um benutzerdefinierten Content einzubetten:

```javascript
class CustomElement extends HTMLElement {
    constructor() {
        super()
        this.attachShadow({ mode: "open" })
        this.shadowRoot.innerHTML = `
      <style>
        p { color: red; }
      </style>
      <p>Statischer Text</p>
      <slot></slot> <!-- Platz für benutzerdefinierten Inhalt -->
    `
    }
}

customElements.define("custom-element", CustomElement)
```

#### Nutzung:

```html
<custom-element>
    <span>Benutzerdefinierter Inhalt im Slot</span>
</custom-element>
```

Der `<slot>`-Tag ermöglicht es, beliebige Inhalte von außen einzufügen, die innerhalb des Custom Elements gerendert werden.

### Zusammenfassung:

-   **Custom Elements** bieten dir die Möglichkeit, neue HTML-Tags zu erstellen.
-   **Shadow DOM** sorgt dafür, dass das HTML und CSS in deinem Web Component isoliert vom restlichen Dokument ist.
-   **HTML Templates** und **Slots** ermöglichen eine saubere Trennung und Wiederverwendbarkeit von UI-Komponenten.

Das Erstellen von Web Components bietet eine elegante Lösung, um wiederverwendbare und wartbare Webanwendungen zu entwickeln.

# Integration von ARIA in Webcompopnents

Die Integration von ARIA (Accessible Rich Internet Applications) in Web Components ist ein wichtiger Schritt, um sicherzustellen, dass deine benutzerdefinierten Elemente zugänglich sind, insbesondere für Menschen, die auf Screenreader angewiesen sind. ARIA-Attribute helfen Screenreadern dabei, semantische Informationen über deine Web Components zu verstehen, die sie ohne ARIA möglicherweise nicht korrekt interpretieren würden.

Hier sind die Schritte und Empfehlungen, wie du ARIA in Web Components integrieren kannst:

### 1. ARIA-Attribute im Shadow DOM setzen

Wenn du ein Web Component erstellst, solltest du sicherstellen, dass du relevante ARIA-Attribute in deinem Shadow DOM hinzufügst. Diese Attribute liefern wichtige Informationen über den Zustand und die Rolle eines Elements, sodass Screenreader korrekt darauf reagieren können.

#### Beispiel: Ein Button mit ARIA-Attributen

```html
<!DOCTYPE html>
<html lang="de">
    <head>
        <meta charset="UTF-8" />
        <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
        />
        <title>ARIA in Web Components</title>
    </head>
    <body>
        <!-- Das benutzerdefinierte Element -->
        <accessible-button></accessible-button>

        <script>
            class AccessibleButton extends HTMLElement {
                constructor() {
                    super()
                    this.attachShadow({ mode: "open" })
                    this.shadowRoot.innerHTML = `
          <button aria-pressed="false" role="button">
            <slot>Drück mich</slot>
          </button>
        `
                }

                // Beispiel für die Änderung von ARIA-Attributen
                togglePressedState() {
                    const button = this.shadowRoot.querySelector("button")
                    const isPressed =
                        button.getAttribute("aria-pressed") === "true"
                    button.setAttribute(
                        "aria-pressed",
                        isPressed ? "false" : "true"
                    )
                }

                connectedCallback() {
                    this.shadowRoot
                        .querySelector("button")
                        .addEventListener("click", () =>
                            this.togglePressedState()
                        )
                }
            }

            customElements.define("accessible-button", AccessibleButton)
        </script>
    </body>
</html>
```

#### Erklärungen:

-   Das `button`-Element hat das ARIA-Attribut `aria-pressed`, das von einem Screenreader als ein Zustand (gedrückt oder nicht gedrückt) erkannt wird.
-   Das Attribut `role="button"` stellt sicher, dass auch bei Verwendung eines benutzerdefinierten Buttons der richtige semantische Kontext für Screenreader gegeben ist.
-   Mit der Methode `togglePressedState()` wird der Wert von `aria-pressed` dynamisch geändert, je nachdem, ob der Button gedrückt wird oder nicht.

### 2. ARIA in Bezug auf den Host (Custom Element)

Ein häufiges Problem bei Web Components ist, dass Screenreader die Inhalte des Shadow DOM nicht automatisch erkennen, weil sie vom restlichen DOM isoliert sind. Um dieses Problem zu umgehen, kannst du ARIA-Attribute direkt auf dem Host-Element (dem Custom Element selbst) setzen, anstatt nur im Shadow DOM.

#### Beispiel:

```html
<custom-tooltip aria-label="Dies ist ein Tooltip"></custom-tooltip>
```

Du kannst das ARIA-Attribut `aria-label` auf das benutzerdefinierte Element setzen. Dadurch kann ein Screenreader dieses Attribut direkt auf dem `<custom-tooltip>`-Tag erkennen, ohne dass es den Inhalt des Shadow DOMs einsehen muss.

### 3. Nutzung von Slots und ARIA

Wenn du `slot`-Elemente in deinem Custom Element verwendest, um benutzerdefinierte Inhalte von außen zu empfangen, kannst du sicherstellen, dass die ARIA-Attribute korrekt auf den Host angewendet werden.

#### Beispiel: Tooltip mit einem `slot`

```html
<!DOCTYPE html>
<html lang="de">
    <head>
        <meta charset="UTF-8" />
        <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
        />
        <title>Web Component Tooltip mit ARIA</title>
    </head>
    <body>
        <custom-tooltip aria-label="Zusätzliche Informationen">
            <span slot="message">Hier sind einige Tooltip-Informationen</span>
        </custom-tooltip>

        <script>
            class CustomTooltip extends HTMLElement {
                constructor() {
                    super()
                    this.attachShadow({ mode: "open" })
                    this.shadowRoot.innerHTML = `
          <style>
            div {
              display: none;
              background: lightgray;
              padding: 10px;
              border: 1px solid gray;
            }
            :host(:hover) div {
              display: block;
            }
          </style>
          <div role="tooltip">
            <slot name="message"></slot>
          </div>
        `
                }
            }

            customElements.define("custom-tooltip", CustomTooltip)
        </script>
    </body>
</html>
```

#### Erklärungen:

-   Das `<div>`-Element im Shadow DOM hat das `role="tooltip"`-Attribut, um einem Screenreader mitzuteilen, dass dieses Element als Tooltip interpretiert werden soll.
-   Die `aria-label` auf dem Host-Element `<custom-tooltip>` wird für den Tooltip selbst verwendet, sodass Screenreader den Tooltip als semantisch richtig erkennen.

### 4. Dynamische ARIA-Attribute

Du kannst ARIA-Attribute dynamisch ändern, basierend auf Benutzerinteraktionen oder Zustandsänderungen. Dies ist besonders nützlich für interaktive Komponenten wie Schaltflächen, Dialoge, Akkordeons oder Schieberegler, die Zustandsänderungen durch den Benutzer erfordern.

#### Beispiel: ARIA bei einem Akkordeon

```html
<!DOCTYPE html>
<html lang="de">
    <head>
        <meta charset="UTF-8" />
        <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
        />
        <title>Akkordeon Web Component mit ARIA</title>
    </head>
    <body>
        <custom-accordion>
            <button aria-expanded="false">Mehr anzeigen</button>
            <div hidden>
                <p>Hier sind die zusätzlichen Informationen</p>
            </div>
        </custom-accordion>

        <script>
            class CustomAccordion extends HTMLElement {
                constructor() {
                    super()
                    this.attachShadow({ mode: "open" })
                    this.shadowRoot.innerHTML = `
          <slot></slot>
        `
                }

                connectedCallback() {
                    const button = this.querySelector("button")
                    const content = this.querySelector("div")

                    button.addEventListener("click", () => {
                        const expanded =
                            button.getAttribute("aria-expanded") === "true"
                        button.setAttribute("aria-expanded", !expanded)
                        content.hidden = expanded
                    })
                }
            }

            customElements.define("custom-accordion", CustomAccordion)
        </script>
    </body>
</html>
```

#### Erklärungen:

-   Das `aria-expanded`-Attribut zeigt dem Screenreader an, ob der Akkordeon-Bereich ausgeklappt (`true`) oder eingeklappt (`false`) ist.
-   Wenn der Benutzer den Button klickt, wird der Wert von `aria-expanded` dynamisch geändert, und der Inhalt im Akkordeon wird ein- oder ausgeblendet.

### Zusammenfassung der Best Practices:

1. **ARIA-Attribute im Shadow DOM setzen**, um Screenreadern semantische Hinweise zu geben.
2. **ARIA-Attribute auf dem Host-Element hinzufügen**, wenn die Informationen im Shadow DOM schwer zugänglich sind.
3. **Rolle und Status (z.B. `role="button"`, `aria-expanded`, `aria-pressed`)** korrekt und dynamisch aktualisieren, wenn sich der Zustand des Elements ändert.
4. **Benutzerdefinierte Inhalte über Slots** und korrekte ARIA-Integration für Slots berücksichtigen.

Mit diesen Ansätzen kannst du Web Components entwickeln, die nicht nur ästhetisch und funktional sind, sondern auch für Benutzer mit assistiven Technologien zugänglich bleiben.
