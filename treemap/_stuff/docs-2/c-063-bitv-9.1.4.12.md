# Prüfschritt 9.1.4.12 Textabstände anpassbar

Texte müssen auch mit veränderten Abständen lesbar bleiben, ohne dass Inhalte abgeschnitten oder überlappt werden.

-   Zeilenhöhe auf 1,5-fache, Absatzabstand auf 2-fache, Buchstabenabstand auf 0,12-fache und Wortabstand auf 0,16-fache der Schriftgröße einstellbar
-   Anpassungen dürfen keine Inhalte verdecken oder Funktionalitäten einschränken
-   Prüfung mit Bookmarklet oder Browser-Erweiterung möglich
-   Gilt nur für echten Text, nicht für ungestylte `input type="file"`-Felder

_BITV-Originaltext:_

## Was wird geprüft?

Die Anpassung der Zeilenhöhe auf das 1,5-fache der Textgröße, des Abstands nach Absätzen auf das 2-fache der Textgröße, von Buchstabenabständen auf das 0,12-fache der Textgröße und von Wortabständen auf das 0,16-fache der Textgröße führt nicht zu einem Verlust an Inhalten oder Funktionalitäten, zum Beispiel durch das Abschneiden von Inhalten in Elementen, deren Größe sich bei Einstellung größerer Textabstände und dadurch erfolgender Textspreizungen oder Umbrüche nicht dynamisch anpasst.

Anmerkung: Die Anforderung verlangt nicht von Autoren, die genannten Werte bei Ihren Inhalten umzusetzen, sondern lediglich, dass von Nutzern vorgenommene Anpassungen nicht zum Abschneiden von Text oder Verlust von Funktionalitäten führt.

## Warum wird das geprüft?

Menschen mit Sehbehinderungen können die Lesbarkeit von Texten verbessern, wenn sie über Werkzeuge wie Bookmarklets oder über eigene Stylesheets die Abstände zwischen Zeilen, Absätzen, Zeichen und Worten anpassen können. Solche Anpassungen führen dazu, dass Texte ggf. mehr Platz brauchen und Inhalts-Container dementsprechend dynamisch angelegt sein müssen, um den längeren Text ohne Verlust zu zeigen.

## Wie wird geprüft?

### 1\. Anwendbarkeit des Prüfschritts

Der Prüfschritt ist anwendbar, wenn die Seite echten Text enthält (also Text, der nicht über eine Grafik bereitgestellt wird).

### 2\. Prüfung

1.  Textabstände mit dem [Bookmarklet Textabstände](https://www.bitvtest.de/bitv_test/das_testverfahren_im_detail/werkzeugliste/bookmarklets.html) oder mit einer Browser-Erweiterung setzen. Die Werte für Zeilenhöhe, Abstand nach Absätzen, Buchstabenabstand und Wortabstand werden auf die maximal geforderten Werte gesetzt.
2.  Prüfen, ob es durch die neuen Werte zum Abschneiden oder Überlappen von Text oder den Verlust von Funktionalität kommt.

### 3\. Hinweise

-   Die Anforderung ist nicht anwendbar ist auf Elemente wie `input type="file"`, auf die CSS-Anpassungen keine Auswirkung haben.

### 4\. Bewertung

#### Erfüllt:

-   Nach Anwendung des Bookmarklets sind alle Texte, auch in Ausklappbereichen und Menüs, vollständig lesbar, Sie sind nicht abgeschnitten und überlagern keine anderen Inhalte.

## Einordnung des Prüfschritts

### Einordnung des Prüfschritts nach WCAG 2.1

#### Guideline

-   [Guideline 1.4 Distinguishable: Make it easier for users to see and hear content including separating foreground from background](https://www.w3.org/TR/WCAG21/#distinguishable)

#### Success criterion

-   [1.4.12 Text Spacing](https://www.w3.org/TR/WCAG21/#text-spacing) (Level AA)

#### Sufficient Techniques

-   [C36: Allowing for text spacing override](https://www.w3.org/WAI/WCAG21/Techniques/css/C36.html)
-   [C35: Allowing for text spacing without wrapping](https://www.w3.org/WAI/WCAG21/Techniques/css/C35.html)

#### Failures

-   [F104: Failure of Success Criterion 1.4.12 due to clipped or overlapped content when text spacing is adjusted](https://www.w3.org/WAI/WCAG21/Techniques/failures/F104)

## Quellen

-   [Understanding Success Criterion 1.4.12: Text Spacing](https://www.w3.org/WAI/WCAG21/Understanding/text-spacing.html) (zur Zeit nur auf Englisch verfügbar)
-   [Stylus Browsererweiterung](https://github.com/openstyles/stylus/blob/master/README.md)
-   [Text Spacing Bookmarklet](https://www.html5accessibility.com/tests/tsbookmarklet.html)
