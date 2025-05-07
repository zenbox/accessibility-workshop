# Prüfschritt 9.4.1.2 Name, Rolle, Wert verfügbar

_BITV-Originaltext:_

## Was wird geprüft?

Alle selbst gestalteten Komponenten einer Website (also Elemente oder Widgets, die nicht auf interaktiven HTML-Elementen beruhen) sind so umgesetzt, dass die semantischen Informationen (Name, Rolle, Eigenschaften) vorhanden sind. Werden nicht semantische Elemente (etwa `div` oder `span`) eingesetzt und mithilfe von JavaScript zu Bedienelementen umfunktioniert, wird die Semantik mithilfe von WAI-ARIA bereitgestellt.

Die wechselnden Zustände der Bedienelemente werden nicht nur visuell über CSS und JavaScript abgebildet, sondern auch über scriptgesteuerte Änderung der Werte der ARIA-Attribute, damit die Semantik auch bei nicht-visueller Nutzung verfügbar ist.

## Warum wird das geprüft?

Standard-HTML-Bedienelemente wie Links (`a`\-Element) und Formularelemente (`input`, `button`, `checkbox` etc.) haben Namen, Rollen, Wert und Zustände, sofern sie gemäß Spezifikation umgesetzt sind und sind für Hilfsmittel wie Screenreader generell erkennbar. So bekommen etwa blinde Nutzer mit, wenn sie auf einen Link tabben und können diesem dann folgen. Auch Zustände, beispielsweise einer Checkbox (ausgewählt oder nicht ausgewählt) werden vermittelt. Interaktive Schaltflächen sollten deshalb mit Hilfe von geeigneten nativen HTML-Elementen umgesetzt werden, damit ihre Bedeutung klar wird.

Falls ungeeignete (weil nicht semantische) Elemente (etwa `div` oder `span`) mithilfe von JavaScript zu Links oder Bedienelementen umfunktioniert werden, kann die Semantik mit Hilfe von WAI-ARIA bereit gestellt werden. Dies betrifft auch Komponenten (Widgets wie z. B. Tabpanels, Akkordeons etc.), die in nativem HTML so nicht zur Verfügung stehen und mit Hilfe von nicht semantischen Elementen und Scripten umgesetzt sind. WAI-ARIA Attribute helfen, diese zu verstehen, indem semantische Informationen vom Browser an die Hilfsmitteltechnologien übermittelt werden.

## Wie wird geprüft?

### 1\. Anwendbarkeit des Prüfschritts

Der Prüfschritt ist anwendbar, wenn die Seite interaktive Bedienelemente (Links, Formularelemente, oder programmierte Elemente, die auf `onclick` oder andere Event Handler reagieren) enthält.

### 2\. Prüfung

1.  Seite im Firefox Browser aufrufen
2.  Bedienelemente der Seite auf korrekte Semantik prüfen:

    -   Gibt es offensichtliche Links oder Schaltflächen ohne `href`\-Attribut? Dies lässt sich z. B. mit Hilfe der [Web Developer Toolbar](http://www.bitvtest.de/werkzeugliste-2011#webdeveloper) über die Funktion _Information_ > _Verweisdetails anzeigen (display link details)_ feststellen.
    -   Gibt es Formularelemente wie Checkboxen oder Radio-Buttons, die von der systemüblichen Darstellung abweichen, da sie mit anderen Elementen wie `div` oder `img` nachgebildet wurden?
    -   Gibt es auf der Seite selbstgebaute Widgets wie etwa Schieberegler oder Tabpanels?

3.  Mittels Developer Tools prüfen, ob über WAI-ARIA Name, Eigenschaften und gegebenenfalls Zustände abgebildet werden. Zustandsänderungen müssen durch Änderungen der Attribute-Werte reflektiert werden. Grafische Zustandsänderungen durch den geskripteten Austausch von Bildern, die anstelle von Bedienelementen eingesetzt werden, müssen auch für Hilfsmittel verfügbare sinnvolle Änderungen von `alt`\-Attributen bzw. WAI-ARIA Eigenschaften erzeugen.

### 3\. Hinweise

-   Im Zweifelsfall den [ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/) konsultieren.
-   Unsemantische Elemente wie `span` oder `div` sind nur dann mit der Tastatur fokussierbar, wenn das `tabindex`\-Attribut gesetzt wurde. Falls das nicht der Fall ist, müssen Elemente also gegebenenfalls mit dem Cursor-Werkzeug des aViewers untersucht werden.
-   Für die Prüfung von komplexen Widgets sollte der Screenreader ergänzend genutzt werden.
-   Bei dynamischen eingeblendeten Elementen (etwa den Ausklapplisten von Comboboxen) kann es notwendig sein, den laufenden Script anzuhalten, um eingeblendete Inhalte zu untersuchen. Hierzu eignet sich die Eingabe des Scripts `setTimeout(function(){debugger}, 5000);` in der Konsole der Entwicklerwerkzeuge (diese sind aufrufbar mit F12), unmittelbar gefolgt vom Aufruf der einzublendenden Inhalte. Fünf Sekunden nach Aktivierung des Konsolen-Scripts stoppt die Ausführung des Scripts der Seite, die dynamischen Elemente können nur mittels Entwicklerwerkzeugen untersucht werden.

### 4\. Bewertung

#### Nicht erfüllt

-   Wichtige Bedienelemente sind mit unsemantischen HTML-Elementen oder `a`\-Elementen ohne `href`\-Attribut umgesetzt, ohne dass die Semantik mit WAI-ARIA nachgebildet wurde.

## Einordnung des Prüfschritts

### Abgrenzung von anderen Prüfschritten

In diesem Prüfschritt geht es nicht um die Bewertung der Tastaturbedienbarkeit geskripteter Bedienelemente. Dies ist Gegenstand von Prüfschritt 9.2.1.1 "Ohne Maus nutzbar".

### Einordnung des Prüfschritts nach WCAG 2.1

#### Guideline

-   [Guideline 4.1 Compatible: Maximize compatibility with current and future user agents, including assistive technologies.](https://www.w3.org/TR/WCAG21/#compatible)

#### Success criterion

-   [4.1.2 Name, Role, Value](https://www.w3.org/TR/WCAG21/#name-role-value) (Level A)

#### Techniques

##### General Techniques

-   [G10: Creating components using a technology that supports the accessibility API features of the platforms on which the user agents will be run to expose the names and roles, allow user-settable properties to be directly set, and provide notification of changes](https://www.w3.org/WAI/WCAG21/Techniques/general/G10.html)
-   [G108: Using markup features to expose the name and role, allow user-settable properties to be directly set, and provide notification of changes](https://www.w3.org/WAI/WCAG21/Techniques/general/G108.html)
-   [G135: Using the accessibility API features of a technology to expose names and roles, to allow user-settable properties to be directly set, and to provide notification of changes](https://www.w3.org/WAI/WCAG21/Techniques/general/G135.html)

##### HTML Techniques

-   [H64: Using the title attribute of the frame and iframe elements](https://www.w3.org/WAI/WCAG21/Techniques/html/H64.html)
-   [H91: Using HTML form controls and links](https://www.w3.org/WAI/WCAG21/Techniques/html/H91.html)

##### ARIA Techniques

-   [ARIA4: Using a WAI-ARIA role to expose the role of a user interface component](https://www.w3.org/WAI/WCAG21/Techniques/aria/ARIA4.html)
-   [ARIA5: Using WAI-ARIA state and property attributes to expose the state of a user interface component](https://www.w3.org/WAI/WCAG21/Techniques/aria/ARIA5.html)
-   [ARIA14: Using aria-label to provide an invisible label where a visible label cannot be used](https://www.w3.org/WAI/WCAG21/Techniques/aria/ARIA14.html)
-   [ARIA16: Using aria-labelledby to provide a name for user interface controls](https://www.w3.org/WAI/WCAG21/Techniques/aria/ARIA16.html)

#### Failures

-   [F15: Failure of Success Criterion 4.1.2 due to implementing custom controls that do not use an accessibility API for the technology, or do so incompletely](https://www.w3.org/WAI/WCAG21/Techniques/failures/F15.html)
-   [F20: Failure of Success Criterion 1.1.1 and 4.1.2 due to not updating text alternatives when changes to non-text content occur](https://www.w3.org/WAI/WCAG21/Techniques/failures/F20.html)
-   [F59: Failure of Success Criterion 4.1.2 due to using script to make div or span a user interface control in HTML](https://www.w3.org/WAI/WCAG21/Techniques/failures/F59.html)
-   [F79: Failure of Success Criterion 4.1.2 due to the focus state of a user interface component not being programmatically determinable or no notification of change of focus state available](https://www.w3.org/WAI/WCAG21/Techniques/failures/F79.html)

## Quellen

### WAI-ARIA Spezifikation

-   [https://www.w3.org/TR/wai-aria/](https://www.w3.org/TR/wai-aria/)
-   [Accessible Rich Internet Applications (WAI-ARIA) 1.1](https://www.w3.org/TR/wai-aria-1.1/) (zur Zeit _Candidate Recommendation_)

### ARIA in HTML

-   [ARIA in HTML](https://www.w3.org/TR/html-aria/)

### ARIA-Widgets

-   [ARIA Authoring Practice Guide (APG)](https://www.w3.org/WAI/ARIA/apg/)
