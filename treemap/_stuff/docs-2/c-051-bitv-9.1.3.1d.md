# Prüfschritt 9.1.3.1d Inhalt gegliedert

Textabsätze müssen mit geeigneten HTML-Strukturelementen wie `p` ausgezeichnet sein. Doppelte `br`-Elemente zur Erzeugung von Umbrüchen sind zu vermeiden. Wichtige Hervorhebungen sollten mit `strong` oder `em` und nicht nur mit visuellen Stilen oder `b`/`i` erfolgen.

Seite prüfen und sicherstellen, dass Absätze korrekt als solche ausgezeichnet sind und Hervorhebungen semantisch erfolgen. `br`-Elemente dürfen nicht zur Absatzstrukturierung genutzt werden.

-   Erfüllt: Alle Absätze sind mit `p` oder passenden Strukturelementen ausgezeichnet, Hervorhebungen mit `strong` oder `em`.
-   Teilweise erfüllt: Doppelte `br` für Absätze oder Leerzeichen (`&nbsp;`) zur Formatierung verwendet.
-   Nicht erfüllt: Keine geeigneten Absatz-Elemente, stattdessen `br` für Absätze oder `b`/`i` für Hervorhebungen.

_BITV-Originaltext:_

## Was wird geprüft?

Absätze sind mit geeigneten Strukturelementen ausgezeichnet, Zeilenumbrüche über doppelte `br` Elemente werden vermieden.

Hervorhebungen in Texten sind mit `strong` oder `em` ausgezeichnet.

## Warum wird das geprüft?

Die Unterteilung in kleinere Einheiten erleichtert die Handhabung und das Verständnis.

Die Verwendung der vorgesehenen HTML-Strukturelemente stellt sicher, dass die Gliederung der Inhalte auch programmatisch ermittelbar festgelegt und zugänglich ist. So können z.B. Screenreader-Nutzende im Lesemodus die Inhalte Absatz für Absatz durchlaufen. Benutzer, die mit der vorgegebenen visuellen Präsentation der Elemente auf der Seite nichts anfangen können, finden sich dann trotzdem zurecht, oder sie können eine eigene, besser passende Präsentation anwenden. Werden Absatzumbrüche über doppelte `br`\- Elemente geschaffen, entstehen im Lesemodus der Screenreader ggf. leere Fokuspositionen, die irritieren und das Erfassen der Inhalte verlangsamen.

Die Auszeichnungen `strong` und `em` sind allgemein und nicht darstellungsbezogen (wie `b`, `i` oder eine nur mit CSS realisierte visuelle Hervorhebung).

## Wie wird geprüft?

### 1\. Anwendbarkeit des Prüfschritts

Der Prüfschritt ist anwendbar, wenn es auf der Seite gegliederte Textinhalte mit Absätzen gibt.

### 2\. Prüfung

#### 2.1 Prüfung mit Bookmarklet

1.  Seite in [Firefox](https://www.bitvtest.de/bitv_test/das_testverfahren_im_detail/werkzeugliste.html#firefox) aufrufen.
2.  Das Bookmarklet [Inhalte gegliedert](https://ergebnis.bitvtest.de/test-methodik/web/werkzeugliste#c359) aufrufen.
3.  Prüfen, ob Absätze mit `p` oder anderer passender Semantik ausgezeichnet sind. Da die Auszeichnung von Absätzen mit `div` statt mit `p`\-Elementen für Screenreader-Nutzende im Lesemodus keinen wesentlichen Nachteil mit sich bringt, kann sie in bestimmten Fällen (z. B. wenig Fließtext oder optisch kein richtiger Textabsatz) akzeptiert werden.
4.  Werden doppelte `br`\-Elemente für Zeilenumbrüche genutzt?

Prüfen, ob Hervorhebungen in Texten mit `strong` oder `em` ausgezeichnet sind.

#### 2.2 Missbräuchliche Nutzung von typographischen Zeichen

-   Prüfen, ob Leerzeichen (`&nbsp;`) zur Formatierung von Text benutzt werden (etwa zur Schaffung von Spalten).
-   Prüfen, ob typographische Zeichen, etwa Reihen von Bindestrichen, zur Erzeugung von Trennlinien eingesetzt werden und nicht programmatisch versteckt sind (etwa über `aria-hidden="true"`).

### 3\. Hinweise

-   Es soll nicht bewertet werden, ob die vorhandene, sichtbare Gliederung der Seite sinnvoll ist, sondern nur, ob sie mit geeigneten HTML-Elementen umgesetzt wurde.
-   Das für Absätze vorgesehene Element ist grundsätzlich `p`. Dennoch ist eine Nutzung von `div` anstelle von `p` in der programmatischen Ausgabe, etwa durch Screenreader, in der Regel nicht mit Nachteilen verbunden. Die Nutzung von `div` anstelle von `p` für Textabsätze sollte deshalb in der Regel nicht zu einer Bewertung des Prüfschritts mit "teilweise erfüllt" oder schlechter führen.
-   Die Verwendung von HTML-Strukturelementen für Tabellen, Überschriften, Listen und Zitate ist bereits durch andere Prüfkriterien abgedeckt und wird dort bewertet.
-   Die Inhalte von iframes werden ebenso überprüft wie andere Seiteninhalte. Dazu muss unter Umständen der iframe in einem neuen Fenster geladen werden.
-   Textinhalte mittels CSS-Attribut `content` werden heute in der Regel von Screenreadern ausgegeben und stellen deshalb meist keine praktische Barriere dar. Der Einsatz von CSS `content` sollte deshalb nicht zu einer Bewertung als "teilweise erfüllt" oder schlechter führen. Im Sinne einer konsequenten Trennung von Semantik und optischer Darstellung (HTML / CSS) ist die Einbringung von Textinhalten über CSS dennoch nicht empfehlenswert, denn in manchen Nutzungsszenarien (eigene Stylesheets, Darstellung ohne CSS) können Inhalte fehlen.

### 4\. Bewertung

#### Erfüllt

-   Textabsätze sind mit geeigneten Absatz-Elementen ausgezeichnet.
-   Auf Umbrüche von Textabsätzen über doppelte `br` Elemente wird verzichtet.
-   Für semantische Hervorhebungen im Text wird `strong` oder `em` verwendet.

#### Nicht voll erfüllt

-   Textabsätze sind nicht mit geeigneten Absatz-Elementen ausgezeichnet.
-   Zur Schaffung von Textabsätzen werden anstelle von Absatz-Elementen doppelte Zeilenumbrüche (`br`) verwendet.
-   Leerzeichen (`&nbsp;`) werden zur Schaffung von Spalten eingesetzt.

## Einordnung des Prüfschritts

### Abgrenzung zu anderen Prüfschritten

Andere auf Strukturierung bezogenen Prüfkriterien sind:

-   Prüfschritt 9.1.3.1a "HTML-Strukturelemente für Überschriften"
-   Prüfschritt 9.1.3.1b "HTML-Strukturelemente für Listen"
-   Prüfschritt 9.1.3.1c "HTML-Strukturelemente für Zitate"
-   Prüfschritt 9.1.3.1e "Datentabellen richtig aufgebaut"

Die Textalternative für Font-Icons wird im Prüfschritt 9.1.1.1a "Alternativtexte für Bedienelemente" und 9.1.1.1b "Alternativtexte für Grafiken und Objekte" geprüft.

### Einordnung des Prüfschritts nach WCAG 2.1

#### Guideline

-   [Guideline 1.3 Adaptable: Create content that can be presented in different ways (for example simpler layout) without losing information or structure](https://www.w3.org/WAI/WCAG21/quickref/?showtechniques=131#adaptable)

#### Success criterion

-   [1.3.1 Info and Relationships](https://www.w3.org/WAI/WCAG21/quickref/?showtechniques=131#info-and-relationships) (Level A)

#### Techniques

##### General Techniques

-   [G115: Using semantic elements to mark up structure](https://www.w3.org/WAI/WCAG21/Techniques/general/G115.html)
-   [G140: Separating information and structure from presentation to enable different presentations](https://www.w3.org/WAI/WCAG21/Techniques/general/G140.html)

##### HTML Techniques

-   [H49: Using semantic markup to mark emphasized or special text](https://www.w3.org/WAI/WCAG21/Techniques/html/H49.html)

##### Failures

-   [F2: Failure of Success Criterion 1.3.1 due to using changes in text presentation to convey information without using the appropriate markup or text](https://www.w3.org/WAI/WCAG21/Techniques/failures/F2.html)
-   [F33: Failure of Success Criterion 1.3.1 and 1.3.2 due to using white space characters to create multiple columns in plain text content](https://www.w3.org/WAI/WCAG21/Techniques/failures/F33.html)
-   [F43: Failure of Success Criterion 1.3.1 due to using structural markup in a way that does not represent relationships in the content](https://www.w3.org/WAI/WCAG21/Techniques/failures/F43.html)
-   [F48: Failure of Success Criterion 1.3.1 due to using the pre element to markup tabular information](https://www.w3.org/WAI/WCAG21/Techniques/failures/F48.html)
-   [F87: Failure of Success Criterion 1.3.1 due to inserting non-decorative content by using :before and :after pseudo-elements and the 'content' property in CSS](https://www.w3.org/WAI/WCAG21/Techniques/failures/F87.html)
-   [F92: Failure of Success Criterion 1.3.1 due to the use of role presentation on content which conveys semantic information](https://www.w3.org/WAI/WCAG21/Techniques/failures/F92.html)
