# Prüfschritt 9.2.1.1 Ohne Maus nutzbar

Alle Funktionen einer Webseite müssen auch ohne Maus, nur mit der Tastatur, nutzbar sein.

-   Mit der Tabulatortaste müssen alle interaktiven Elemente erreichbar und bedienbar sein
-   Elemente, die wie Bedienelemente aussehen, müssen auch per Tastatur ansteuerbar sein
-   Inhalte in scrollbaren Bereichen müssen auch ohne Maus erreichbar sein
-   Drag-and-Drop-Funktionen brauchen tastaturfreundliche Alternativen
-   Die Prüfung erfolgt in Firefox und Chrome mit eingeschaltetem JavaScript

_BITV-Originaltext:_

## Was wird geprüft?

Die Webseite soll auch ohne Maus - also ausschließlich mit der Tastatur - zu benutzen sein.

## Warum wird das geprüft?

Die Bedienung soll geräteunabhängig möglich sein. Das bedeutet: Sie muss sowohl mit der Maus als auch mit der Tastatur möglich sein. Denn auch andere Spezialgeräte verhalten sich so wie eine Maus oder wie eine Tastatur.

Probleme gibt es meistens mit der Tastaturbedienung, denn die Mehrzahl der Webnutzer arbeitet mit der Maus, daher wird oft nur an die gedacht.

Auf die Tastaturbedienbarkeit angewiesen sind zum Beispiel viele motorisch eingeschränkte Menschen oder Blinde.

## Wie wird geprüft?

### 1\. Anwendbarkeit des Prüfschritts

Der Prüfschritt ist anwendbar, wenn der Webauftritt interaktive Elemente enthält.

### 2\. Prüfung

1.  Seite im Firefox Browser aufrufen.
2.  Mit der Tabulatortaste die Links und Formularelemente durchgehen.
3.  Prüfen, ob alle wesentlichen Links und Formularelemente erreicht und benutzt werden können
4.  Falls die Seite Elemente enthält, die wie Bedienelemente aussehen, jedoch nicht mit der Tabulatortaste angesteuert werden, prüfen, ob diese Elemente auf die Maus reagieren (zum Beispiel mit Bewegung, Vergrößerung, Einblenden von weiteren Inhalten).
5.  Falls die Seite scrollbare Bereiche enthält, sollen nicht sichtbare Inhalte dieser Bereiche auch über die Tastatur erreichbar sein.
6.  Seite im Chrome Browser aufrufen und Schritte 2 bis 5 wiederholen.

### 3\. Hinweise

#### 3.1 Allgemeine Hinweise

-   Prüfende müssen mit der Funktionsweise der eingesetzten Browser vertraut sein, sie müssen wissen, welche Tasten und Tastenkombinationen für die Tastaturbedienung vorgesehen sind.
-   Probleme bei der Bedienung werden in der Regel durch die Verwendung von JavaScript verursacht. Die Prüfung erfolgt also bei eingeschaltetem JavaScript.
-   Unwesentlich können zum Beispiel Funktionen sein, die schon vom Browser selbst angeboten werden (beispielsweise "Fenster schließen").
-   Auch die Tastaturbedienbarkeit von Elementen ohne Fokushervorhebung wird geprüft. Zur Anzeige des Fokus kann ein geignetes Bookmarklet wie Force Show Keyboard Focus genutzt werden.

Wichtig in diesem Zusammenhang:

-   Wenn das Browserfenster nicht den Fokus hat, darf man nicht einfach hinein klicken und dann erst mit der Tastaturbedienung anfangen. Der Fokus muss vielmehr per Tastatur (F6) zum Browserfenster bewegt werden.
-   Auswahllisten ohne Submit-Button, die auf “onchange” reagieren, können ggf. mit den Pfeiltasten allein nicht bedient werden, da immer schon die erste Listenoption ausgelöst wird. Um solche Auswahllisten durchzublättern, muss man sie ggf. zunächst mit der Tastenkombination "Alt + Pfeil nach unten" öffnen. Dann kann man mit den Pfeiltasten nach oben und unten durch die Optionen blättern und mit der Eingabetaste eine Option auswählen.
-   Die Nutzung per Tastatur muss nicht genau der Nutzung per Maus entsprechen. Es ist beispielsweise kein Mangel, wenn per Maus über Ausklappmenüs in einem Schritt tiefe Links aufgerufen werden können, per Tastatur aber für den Aufruf der betreffenden Seiten mehrere Schritte erforderlich sind.

Manche Elemente lassen sich ggf. bei eingeschaltetem Screenreader NVDA nicht aktivieren (oder nur bei zusätzlichem Drücken der `alt`\-Taste). Dies ist in der Regel auf fehlerhafte ARIA-Auszeichnung zurückzuführen und wird in Prüfschritt 9.4.1.2 "Name, Rolle, Wert verfügbar" bewertet.

#### 3.2 Hinweis zu Drag-and-Drop-Funktionen

Für wichtige Bedienfunktionen, die mittels Drag-and-Drop bedienbar sind, müssen auch tastaturnutzbare Alternativen angeboten werden.

### 4\. Bewertung

#### Erfüllt

-   Alle wesentlichen Inhalte und Funktionen sind in Firefox und Chrome im Prinzip erreichbar und bedienbar.

#### Nicht erfüllt

-   Wesentliche Inhalte und Funktionen sind in Firefox oder Chrome mit der Tastatur nicht erreichbar oder nicht bedienbar.

## Einordnung des Prüfschritts

### Abgrenzung zu anderen Prüfschritten

-   Dieser Prüfschritt betrifft die **Auslösbarkeit** von Funktionen und Links auch über die Tastatur.
-   **Tastaturfallen** sind Gegenstand von Prüfschritt 9.2.1.2 "Keine Tastaturfalle"
-   Bei skriptgenerierten oder über Skripts eingeblendeten Elementen (etwa ausklappenden Texten oder Lightboxen) ist die **sinnvolle Reihenfolge** im Quellcode Gegenstand von Prüfschritt 9.1.3.2 "Sinnvolle Reihenfolge".
-   Die Fokus**hervorhebung** ist Gegenstand von Prüfschritt 9.2.4.7 "Aktuelle Position des Fokus deutlich".
-   In diesen Prüfschritt spielt die Fokus-Reihenfolge, in der Links und Formularelemente angesteuert werden, keine Rolle. Die Sinnvolle Fokus**reihenfolge** wird in 9.2.4.3 "Schlüssige Reihenfolge bei der Tastaturbedienung" bewertet.

### Einordnung des Prüfschritts nach WCAG 2.1

#### Guideline

-   [Guideline 2.1 Keyboard Accessible: Make all functionality available from a keyboard.](https://www.w3.org/TR/WCAG21/#keyboard-accessible)

#### Success criteria

-   [2.1.1 Keyboard](https://www.w3.org/TR/WCAG21/#keyboard) (Level A)

#### Techniques

##### General Techniques

-   [G90: Providing keyboard-triggered event handlers](https://www.w3.org/WAI/WCAG21/Techniques/general/G90.html)
-   [G202: Ensuring keyboard control for all functionality](https://www.w3.org/WAI/WCAG21/Techniques/general/G202.html)

##### HTML Techniques

-   [H91: Using HTML form controls and links](https://www.w3.org/WAI/WCAG21/Techniques/html/H91.html)

##### Scripting Techniques

-   [SCR2: Using redundant keyboard and mouse event handlers](https://www.w3.org/WAI/WCAG21/Techniques/client-side-script/SCR2.html)
-   [SCR20: Using both keyboard and other device-specific functions](https://www.w3.org/WAI/WCAG21/Techniques/client-side-script/SCR20.html)
-   [SCR27: Reordering page sections using the Document Object Model](https://www.w3.org/WAI/WCAG21/Techniques/client-side-script/SCR27.html)
-   [SCR29: Adding keyboard-accessible actions to static HTML elements](https://www.w3.org/WAI/WCAG21/Techniques/client-side-script/SCR29.html)
-   [SCR35: Making actions keyboard accessible by using the onclick event of anchors and buttons](https://www.w3.org/WAI/WCAG21/Techniques/client-side-script/SCR35.html)

##### Failures

-   [F42: Failure of Success Criterion 1.3.1 and 2.1.1 due to using scripting events to emulate links in a way that is not programmatically determinable](https://www.w3.org/WAI/WCAG21/Techniques/failures/F42.html)
-   [F54: Failure of Success Criterion 2.1.1 due to using only pointing-device-specific event handlers (including gesture) for a function](https://www.w3.org/WAI/WCAG21/Techniques/failures/F54.html)
-   [F55: Failure of Success Criteria 2.1.1, 2.4.7, and 3.2.1 due to using script to remove focus when focus is received](https://www.w3.org/WAI/WCAG21/Techniques/failures/F55.html)

## Quellen

### Die WCAG 2.1 zur Tastaturbedienbarkeit

> If all functionality can be achieved using the keyboard, it can be accomplished by keyboard users, by speech input (which creates keyboard input), by mouse (using on-screen keyboards), and by a wide variety of assistive technologies that create simulated keystrokes as their output. No other input form has this flexibility or is universally supported and operable by people with different disabilities, as long as the keyboard input is not time-dependent.
>
> Note that providing universal keyboard input does not mean that other types of input should not be supported. Optimized speech input, optimized mouse/pointer input, etc., are also good. The key is to provide keyboard input and control as well.
>
> Some devices do not have native keyboards? for example, a PDA or cell phone. If these devices have a Web browsing capability, however, they will have some means of generating text or "keystrokes." This guideline uses the term "keyboard interface" to acknowledge that Web content should be controlled from keystrokes that may come from a keyboard, keyboard emulator, or other hardware or software that generates keyboard or text input.

( [Keyboard Accessible: Understanding Guideline 2.1](https://www.w3.org/WAI/WCAG21/Understanding/keyboard.html))
