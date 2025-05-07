# Prüfschritt 9.2.4.7 Aktuelle Position des Fokus deutlich

Der Tastaturfokus muss für Nutzer deutlich sichtbar sein, entweder durch Standard-Browser-Hervorhebung oder eine eigene Gestaltung mit ausreichendem Kontrast.

-   Interaktive Elemente müssen eine visuell erkennbare Fokusmarkierung haben
-   Falls die Fokushervorhebung nur über Farbwechsel erfolgt, muss der Kontrast mindestens 3:1 betragen
-   Standard-Fokusrahmen darf nicht durch CSS oder Skripte unterdrückt werden
-   Versteckte Sprunglinks müssen bei Fokuserhalt sichtbar werden

_BITV-Originaltext:_

## Was wird geprüft?

Der Tastaturfokus soll deutlich hervorgehoben werden. Wenn Autoren keine eigene Fokushervorhebung umsetzen, darf die Standardhervorhebung durch den Browser nicht über CSS unterdrückt werden. Der Kontrast der Fokushervorhebung (z.B. Fokusrahmen um Elemente, Unterstreichung, Farbumkehr) zum nicht-fokussierten Zustand muss mindestens 3:1 betragen.

Versteckte Sprunglinks sollen bei Fokuserhalt eingeblendet werden.

## Warum wird das geprüft?

Für Tastaturnutzende ist es wichtig, zu sehen, wo sich der Tastaturfokus gerade befindet, also welcher Link oder Schalter ausgelöst wird, wenn sie die Enter-Taste drücken, oder welches Eingabefeld oder andere Formularelement gerade den Fokus hat.

## Wie wird geprüft?

### 1\. Anwendbarkeit des Prüfschritts

Der Prüfschritt ist anwendbar, wenn die Seite interaktive Elemente enthält.

### 2\. Prüfung

1.  Seite in Firefox laden.
2.  Alle Bedienelemente mit Tabulator durchlaufen und prüfen, ob sie mit grafischen Veränderungen auf den Fokus reagieren (zum Beispiel mit Farbwechseln, Unterstreichungen oder eingeblendeten Symbolen). Versteckte Sprunglinks sollen bei Fokuserhalt eingeblendet werden.
3.  Wenn die Fokushervorhebung ausschließlich über einen Farbwechsel geschieht, prüfen, ob der Kontrastabstand zwischen fokussiertem und unfokussiertem Zustand mindestens 3:1 beträgt.
4.  Bei Links, die sich nicht grafisch verändern, prüfen, ob sie auf den Mauszeiger reagieren.
5.  Wenn dies der Fall ist: Abbruch oder weiter mit 6.
6.  Wenn nur der Standard-Browser-Tastaturfokus (Systemkranz) erscheint, prüfen, ob dieser an dieser vor gestalteten (also etwa über CSS gefärbten) Hintergründen gut zu erkennen ist.
7.  In Zweifelsfällen gemäß Prüfschritt [9.1.4.11 Kontraste von Grafiken und grafischen Bedienelementen ausreichend](9.1.4.11 Kontraste von Grafiken und grafischen Bedienelementen ausreichend.html) bzw. [9.1.4.3 Kontraste von Texten ausreichend](9.1.4.3 Kontraste von Texten ausreichend.html) ermitteln, ob der Kontrastabstand zwischen Systemfokus und Hintergrund mindestens 3:1 beträgt.
8.  Seite im Chrome Browser laden und die Schritte 2-7 wiederholen.

### 3\. Hinweise

-   Die Prüfung muss mit aktiviertem JavaScript erfolgen.
-   Der Prüfschritt ist nicht erfüllt, wenn überhaupt kein Tastaturfokus vorhanden ist, die Webseite also den browsereigenen Tastaturfokus (zum Beispiel mit JavaScript `blur()` oder CSS `outline:none`) unterdrückt.
-   Grundsätzlich hat sich die Standard-Hervorhebung des Tastaturfokus im Browser bei fehlender Gestaltung durch Autoren in den letzten Jahren verbessert. Abhängig von Betriebssystem und Browser, der Hintergrundfarbe und anderen Aspekten des Designs ist die Standard-Hervorhebung der Browser in manchen Fällen jedoch nicht gut sichtbar. Eine gezielte Gestaltung in CSS, z.B. über die `:focus` Pseudo-Klasse, stellt sicher, dass der Tastaturfokus immer gut sichtbar ist.

### 4\. Bewertung

#### Erfüllt

Die Fokussierung interaktiver Elemente ist visuell wahrnehmbar:

-   Rahmen, Unterstreichung, Farbumkehr, Formänderungen oder zusätzliche Markierungen werden bei Tastaturfokussierung eingesetzt.
-   Wenn die Fokussierung von Links oder Buttons nur über die Änderung der Text- oder Hintergrundfarbe vermittelt wird, beträgt deren Kontrastabstand zum unfokussierten Zustand mindestens 3:1.
-   Wenn nur der Standard-Browser-Tastaturfokus angezeigt wird, ist dieser vor gestalteten Hintergründen ausreichend sichtbar, er erfüllt den Prüfschritt 9.1.4.11 "Kontraste von Grafiken und grafischen Bedienelementen ausreichend".

#### Nicht voll erfüllt

-   Sprunglinks bleiben bei Fokuserhalt versteckt.

#### Nicht erfüllt

Der Standard-Browser-Tastaturfokus wird unterdrückt, bei Tastaturnutzung wird kein Fokus angezeigt.

## Einordnung des Prüfschritts

### Bezug zu 1.4.11 Non-Text Contrast (Sichtbarkeit der Fokushervorhebung)

Der [Understanding-Text zur WCAG Anforderung 1.4.11 Non-Text Contrast](https://www.w3.org/WAI/WCAG21/Understanding/non-text-contrast.html) führt im Abschnitt "Relationship with Use of Color and Focus Visible" aus:

> In combination with 2.4.7 Focus Visible, the visual focus indicator for a component must have sufficient contrast against the adjacent background when the component is focused, except where the appearance of the component is determined by the user agent and not modified by the author. If the focus state relies on a change of color (e.g., changing only the background color of a button), then changing from one color to another that has at least a 3:1 contrast ratio with the previous state of the control is a method for meeting the Focus visible criteria.

### Einordnung des Prüfschritts nach WCAG 2.1

#### Guideline

-   [Guideline 2.4 Navigable: Provide ways to help users navigate, find content, and determine where they are](https://www.w3.org/TR/WCAG21/#navigable)

#### Success criterion

-   [2.4.7 Focus Visible](https://www.w3.org/TR/WCAG21/#focus-visible) (Level AA)
-   [1.4.11 Non-Text Contrast](https://www.w3.org/TR/WCAG21/#non-text-contrast) (Level AA)

#### Techniques

##### General Techniques

-   [G149: Using user interface components that are highlighted by the user agent when they receive focus](https://www.w3.org/WAI/WCAG21/Techniques/general/G149.html)
-   [G165: Using the default focus indicator for the platform so that high visibility default focus indicators will carry over](https://www.w3.org/WAI/WCAG21/Techniques/general/G165.html)
-   [G195: Using an author-supplied, highly visible focus indicator](https://www.w3.org/WAI/WCAG21/Techniques/general/G195.html)

##### CSS Techniques

-   [C15: Using CSS to change the presentation of a user interface component when it receives focus](https://www.w3.org/WAI/WCAG21/Techniques/css/C15.html)

##### Client-side Scripting Techniques

-   [SCR31: Using script to change the background color or border of the element with focus](https://www.w3.org/WAI/WCAG21/Techniques/client-side-script/SCR31.html)

##### Failures

-   [F55: Failure of Success Criteria 2.1.1, 2.4.7, and 3.2.1 due to using script to remove focus when focus is received](https://www.w3.org/WAI/WCAG21/Techniques/failures/F55.html)
-   [F78: Failure of Success Criterion 2.4.7 due to styling element outlines and borders in a way that removes or renders non-visible the visual focus indicator](https://www.w3.org/WAI/WCAG21/Techniques/failures/F78.html)

## Fragen zu diesem Prüfschritt

### Ist die Anzeige des Fokus nicht Sache des Browsers?

Alle Browser zeigen dem Tastaturnutzer in irgendeiner Weise, wo der Fokus ist, wenn diese Anzeige nicht aktiv unterdrückt wird.

Dennoch ist die Anzeige des Fokus nicht allein Sache des Browsers. Die Webseite legt fest, wie sie im Browser aussehen soll. Sie ändert etwa die Farben fokussierter Links und Linkhintergründe oder setzt andere Gestaltungselemente ein. In dieser von der Webseite festgelegten Umgebung muss der Fokus für Tastaturnutzer gut sichtbar sein.
