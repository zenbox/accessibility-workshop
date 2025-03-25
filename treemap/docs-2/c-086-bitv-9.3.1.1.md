# Prüfschritt 9.3.1.1 Hauptsprache angegeben

Die Hauptsprache der Webseite muss im `html`-Element mit `lang` angegeben werden.

-   Screenreader benötigen die Sprachangabe für eine korrekte Aussprache
-   Im Quelltext wird geprüft, ob `lang="de"` (oder die passende Sprache) im `<html>`-Tag vorhanden ist
-   Falls die Sprache fehlt oder falsch ist, gilt die Anforderung als nicht erfüllt

_BITV-Originaltext:_

## Was wird geprüft?

Die Hauptsprache der Webseite soll angegeben werden.

## Warum wird das geprüft?

Screenreader verwenden Wortlisten, in denen die Aussprache der Wörter festgelegt ist. Sie müssen wissen, in welcher Sprache ein Text verfasst ist, damit sie die richtige Wortliste verwenden und den Text korrekt aussprechen können.

## Wie wird geprüft?

### 1\. Anwendbarkeit des Prüfschritts

Der Prüfschritt ist immer anwendbar.

### 2\. Prüfung

Quelltextanalyse: Den Quelltext der Seite ansehen und prüfen, ob im öffnenden `html`\-Element das `lang`\-Attribut (bzw. bei xhtml-Seiten das `xml:lang`\-Attribut) verwendet wird und darin die Hauptsprache der Seite richtig angegeben ist.

### 3\. Bewertung

#### Erfüllt

-   Die Hauptsprache der Webseite ist korrekt angegeben.

#### Nicht erfüllt

-   Die Hauptsprache der Webseite ist nicht angegeben oder es wird eine falsche Sprache angegeben.

## Einordnung des Prüfschritts

### Abgrenzung zu anderen Prüfschritten

-   Prüfschritt 9.3.1.2 "Anderssprachige Wörter und Abschnitte ausgezeichnet"

### Einordnung des Prüfschritts nach WCAG 2.1

#### Guideline

-   [Guideline 3.1 Readable: Make text content readable and understandable](https://www.w3.org/TR/WCAG21/#readable)

#### Success criterion

-   [3.1.1 Language of Page](https://www.w3.org/TR/WCAG21/#language-of-page) (Level A)

#### Techniques

##### HTML Techniques

-   [H57: Using language attributes on the html element](https://www.w3.org/WAI/WCAG21/Techniques/html/H57.html)
