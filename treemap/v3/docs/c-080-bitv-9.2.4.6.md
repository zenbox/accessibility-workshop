# Prüfschritt 9.2.4.6 Aussagekräftige Überschriften und Beschriftungen

Überschriften müssen den nachfolgenden Inhalt sinnvoll beschreiben, und Beschriftungen von Formularelementen müssen verständlich sein.

-   Überschriften sollen den Inhalt logisch strukturieren
-   Formularelemente müssen aussagekräftig beschriftet sein
-   Versteckte oder programmatisch hinterlegte Beschriftungen (z. B. aria-label) müssen verständlich sein
-   Gruppenbeschriftungen mit `fieldset` und `legend` sollen sinnvoll sein
-   Fachausdrücke sind erlaubt, wenn sie in der Zielgruppe etabliert sind

_BITV-Originaltext:_

## Was wird geprüft?

Überschriften beschreiben den folgenden Inhalt, Beschriftungen sind aussagekräftig.

## Warum wird das geprüft?

Visuell werden Webseiten-Inhalte durch Überschriften strukturiert. Dank dieser Strukturierung wissen Nutzende, was zusammengehört, können die Inhalte der Webseite leicht überblicken und gezielt auf Inhalte zugreifen, die sie interessieren.

Wenn Formularelemente aussagekräftig beschriftet sind, können Sie von Nutzenden als solche erkannt und bedient werden.

## Wie wird geprüft?

### 1\. Anwendbarkeit des Prüfschritts

Der Prüfschritt ist anwendbar, wenn es auf der Seite Inhalte gibt, die durch Überschriften strukturiert werden und wenn die Seite Formularelemente enthält.

### 2\. Prüfung

1.  Seite im [Firefox](https://www.bitvtest.de/bitv_test/das_testverfahren_im_detail/werkzeugliste.html#firefox) laden.
2.  Prüfen, ob die Überschriften im Zusammenhang mit den durch sie strukturierten Inhalten aussagekräftig sind.
3.  Prüfen, ob Beschriftungen von Formularelementen aussagekräftig sind.
4.  Prüfen, ob programmatisch hinterlegte Beschriftungen aussagekräftig sind - etwa bei visuellen Linktexten, die mittels `aria-label` überschrieben werden, und hinterlegte Beschriftungen von grafischen Bedienelementen. Dazu gehört auch die Nutzung der richtigen Sprache.
5.  Wenn zur Gruppen-Beschriftung `fieldset` mit `legend` eingesetzt wird: Ist die Ausgabe von `legend` und `label` im Zusammenhang aussagekräftig?

### 3\. Hinweise

#### 3.1 Hinweise zu Fachausdrücken

Besonders in Fachanwendungen gibt es häufiger Beschriftungen und Überschriften mit Fachausdrücken, Abkürzungen oder Codes, die nicht allgemeinverständlich sind, aber der Zielgruppe bekannt sind. Die Verwendung diese Fachausdrücke bringt Vorteile mit sich (Wiedererkennbarkeit, Präzision, Kürze), kann aber auch dazu führen, dass sie nicht allgemein aussagekräftig sind: sie müssen erlernt werden. Das ist bei Fachanwendungen vertretbar und sollte nicht zu einer negativen Bewertung führen.

### 4\. Bewertung

#### Erfüllt:

-   Überschriften passen zu den ihnen folgenden Inhalten, Beschriftungen von Formularelementen sind aussagekräftig.

#### Nicht voll erfüllt:

-   Überschriften oder Beschriftungen sind obskur oder schwer verständlich (z.B. unübersetzt)
-   Durch Flüchtigkeits- oder Kopierfehler haben Formularelemente unrichtige, nicht zutreffende Beschriftungen
-   Bestimmte Eingabeformate sind für valide Eingaben erforderlich, werden aber nicht über zusätzliche Beschriftungen vermittelt
-   Besonders in Fachanwendungen gibt es Labels und Überschriften, die in dem betreffenden Nutzerkreis bestimmten, etablierten Vokabularen entsprechen (einschließlich viel genutzter Abkürzungen). Die Verwendung fachspezifischer Beschriftungen bringt Vorteile mit sich (Wiedererkennbarkeit, Präzision, Kürze), kann aber auch dazu führen, dass sie nicht unbedingt für jeden aussagekräftig oder anschaulich sind, was aber nicht zu einer negativen Bewertung führen soll.
-   Bei Angeboten, die Komponenten aus Frameworks einsetzen, finden sich häufig englischsprachige hinterlegte Beschriftungen, die nicht übersetzt wurden, etwa ein Schließen-Icon mit `aria-label="close"`. In solchen Fällen kann der Prüfschritt 9.1.1.1a "Alternativtexte für Bedienelemente" mit "erfüllt" bewertet werden, der Mangel liegt in der mangelnden Aussagekraft, die hier bewertet wird.

## Einordnung des Prüfschritts

### Abgrenzung von anderen Prüfschritten

-   In diesem Prüfschritt geht es um die Aussagekraft von Überschriften und Beschriftungen, auch wenn diese visuell versteckt sind. Die programmatische Ermittelbarkeit durch Assistive Technologien ist den Prüfkriterien 9.1.3.1a "HTML-Strukturelemente für Überschriften" und 9.1.3.1h "Beschriftung von Formularelementen programmatisch ermittelbar" zugeordnet.
-   Alternativtexte von Bildern, etwa Teaser-Grafiken (Vorschaubildern) werden in Prüfschritt [9.1.1.1a Alternativtexte für Bedienelemente.adoc](9.1.1.1a Alternativtexte für Bedienelemente.html) bewertet. Hier wird nur die Aussagekraft hinterlegter Beschriftungen von grafischen Bedienelementen bzw. Icons bewertet, falls **überhaupt** eine Beschriftung vorhanden ist. Ist bei grafischen Bedienelementen **keine** programmatisch ermittelbare Beschriftung vorhanden, ist dies bei 9.1.1.1a zu bewerten.

### Einordnung des Prüfschritts nach WCAG 2.1

#### Guideline

-   [Guideline 2.4 Navigable: Provide ways to help users navigate, find content, and determine where they are.](https://www.w3.org/TR/WCAG21/#navigable)

#### Success criterion

-   [2.4.6 Headings and Labels](https://www.w3.org/TR/WCAG21/#headings-and-labels) (Level A)

#### Techniques

##### General Techniques

-   [G130: Providing descriptive headings](https://www.w3.org/WAI/WCAG21/Techniques/general/G130.html)
-   [G131: Providing descriptive labels](https://www.w3.org/WAI/WCAG21/Techniques/general/G131.html)
