# Prüfschritt 9.1.3.1g Kein Strukturmarkup für Layouttabellen

Layouttabellen dürfen keine semantischen Tabellen-Elemente (`th`, `caption`, `summary`, `headers`, `id`) enthalten. Diese sind nur für echte Datentabellen vorgesehen, damit Screenreader und andere Hilfsmittel die Struktur korrekt erfassen.

Seite prüfen, ob Tabellen ohne inhaltliche Strukturierung vorhanden sind und ob sie fälschlicherweise als Datentabellen ausgezeichnet wurden.

-   Erfüllt: Keine Strukturmarkierungen in Layouttabellen.
-   Nicht erfüllt: Layouttabellen enthalten `th`, `caption`, `summary` oder ähnliche semantische Elemente.

_BITV-Originaltext:_

## Was wird geprüft?

Tabellenstruktur-Mark-up soll nicht für Layouttabellen verwendet werden.

## Wie wird geprüft?

### 1\. Anwendbarkeit des Prüfschritts

Der Prüfschritt ist anwendbar, wenn die Seite Tabellen für das Layout verwendet.

### 2\. Prüfung

-   Seite im [Firefox](https://www.bitvtest.de/bitv_test/das_testverfahren_im_detail/werkzeugliste.html#firefox) aufrufen.
-   Das [Tables bookmarklet](https://www.bitvtest.de/bitv_test/das_testverfahren_im_detail/werkzeugliste.html#tablesbm) aufrufen. Tabellen-Auszeichnungen werden jetzt angezeigt.
-   Prüfen, ob strukturelle Auszeichnungen (`th`, `caption`, `summary`, `headers`, `id`) in Layouttabellen vermieden werden.

### 3\. Hinweis

Auch wenn Tabellen mit `role="presentation"` bzw. `role="none"` ausgezeichnet sind, sollten semantische Elemente nicht benutzt werden.

### 4\. Bewertung

#### Nicht erfüllt

-   In Layouttabellen werden die Elemente `th` oder `caption` oder die Attribute `summary`, `headers` oder `id` verwendet.

## Einordnung des Prüfschritts

### Einordnung des Prüfschritts nach WCAG 2.1

#### Guideline

-   [Guideline 1.3 Adaptable: Create content that can be presented in different ways (for example simpler layout) without losing information or structure](https://www.w3.org/WAI/WCAG21/quickref/?showtechniques=131#adaptable)

#### Success criterion

-   [1.3.1 Info and Relationships](https://www.w3.org/WAI/WCAG21/quickref/?showtechniques=131#info-and-relationships) (Level A)

#### Techniques

##### General Techniques

-   [https://www.w3.org/WAI/WCAG21/Techniques/general/G115.html](https://www.w3.org/WAI/WCAG21/Techniques/general/G115.html)\[ G115: Using semantic elements to mark up structure
-   [G140: Separating information and structure from presentation to enable different presentations](https://www.w3.org/WAI/WCAG21/Techniques/general/G140.html)

##### HTML Techniques

-   [H39 Using `caption` elements to associate data table captions with data tables](https://www.w3.org/WAI/WCAG21/Techniques/html/H39.html)
-   [H73 Using the `summary` attribute of the `table` element](https://www.w3.org/WAI/WCAG21/Techniques/html/H73.html)

##### Failures

-   [F46 Failure of Success Criterion 1.3.1 due to using `th` elements, `caption` elements, or non-empty `summary` attributes in layout tables](https://www.w3.org/WAI/WCAG21/Techniques/failures/F46.html)

## Quellen

### F46: Failure of Success Criterion 1.3.1 due to using `th` elements, `caption` elements, or non-empty `summary` attributes in layout tables

> Although WCAG 2.1 does not prohibit the use of layout tables, CSS-based layouts are recommended in order to retain the defined semantic meaning of the HTML table elements and to conform to the coding practice of separating presentation from content. When a table is used for layout purposes the th element should not be used. Since the table is not presenting data there is no need to mark any cells as column or row headers. Likewise, there is no need for an additional description of a table which is only used to layout content. Do not include a summary attribute and do not use the `summary` attribute to describe the table as, for instance, "layout table"When spoken, this information does not provide value and will only distract users navigating the content via a screen reader. Empty summary attributes are acceptable on layout tables, but not recommended.

([https://www.w3.org/WAI/WCAG21/Techniques/failures/F46.html](https://www.w3.org/WAI/WCAG21/Techniques/failures/F46.html))
