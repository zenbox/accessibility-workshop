# Prüfschritt 9.1.4.5 Schriftgrafiken

**Texte sollen als echte Schrift und nicht als Bild dargestellt werden.**  
Ausnahme: Logos und Fotos, in denen Schrift vorkommt.

-   Alle Texte auf der Seite sind als echte Schrift umgesetzt (kein Text in Bildern)
-   SVG-Texte sind als `<text>`-Elemente eingebunden

-   **Nicht voll erfüllt:** Schriftgrafiken werden für Bedienelemente wie Schaltflächen oder Menüpunkte genutzt
-   **Nicht erfüllt:** Wichtige Inhalte, wie Überschriften oder Menüpunkte, sind nur als Grafik eingebunden und nicht als Text vorhanden

_BITV-Originaltext:_

## Was wird geprüft?

Grafiken sollen nicht für die Darstellung von Schriften verwendet werden. Logos sind hiervon ausgenommen.

## Warum wird das geprüft?

Schriftgrafiken, die als Bitmap-Grafik eingebunden werden (z. B. als JPEG, PNG, oder GIF), können nicht oder nur eingeschränkt an Benutzeranforderungen angepasst werden. Ihre Farben können nicht individuell eingestellt werden, auch die individuelle Anpassung der Schriftgröße wirkt nicht auf grafische Schriften. Und bei Zoomvergrößerung werden die Schriftkanten unscharf.

## Wie wird geprüft?

### 1\. Anwendbarkeit des Prüfschritts

Der Prüfschritt ist anwendbar, wenn das Webangebot Schriftgrafiken enthält.

### 2\. Prüfung

1.  Die Seite im [Firefox](https://www.bitvtest.de/bitv_test/das_testverfahren_im_detail/werkzeugliste.html#firefox) aufrufen.
2.  In der [Web Developer Toolbar](https://www.bitvtest.de/bitv_test/das_testverfahren_im_detail/werkzeugliste.html#webdeveloper) die Funktion _Bilder > Bilder deaktivieren > Alle Bilder deaktivieren_ aufrufen, um alle Grafiken auszublenden (oder alternativ _Bilder > Bilder mit ALT-Attributen ersetzen_).
3.  Prüfen, ob dadurch Schrift verschwindet.

### 3\. Hinweise

In der Regel nicht negativ bewertet werden grafische Schriften auf **Logos** oder in **Fotos**.

Ebenfalls nicht negativ bewertet wird, wenn das SVG `text`\-Element in Inline-SVGs verwendet wird.

Bei Schriftgrafiken, die den Informationsinhalt im Kontext auch als Text wiedergeben, kann dieser Text als konforme Alternativversion der Schriftgrafik gelten. Das ist zum Beispiel der Fall, wenn Abbildungen von Broschüren, Plakaten oder ähnlichen Dokumenten, die Text im Bild enthalten, als Teaser-Bild verwendet werden und der Titel der Broschüre ebenfalls unmittelbar darunter, darüber oder daneben als Text zu lesen steht.

### 4\. Bewertung

#### Nicht voll erfüllt

-   Für Schalter oder Schaltflächen werden Schriftgrafiken verwendet.

#### Nicht erfüllt

-   Für wichtige Texte, zum Beispiel Überschriften, Menüoptionen oder für Schaltflächen, deren Beschriftung gelesen werden muss, werden Schriftgrafiken verwendet.

## Einordnung des Prüfschritts

### Abgrenzung zu anderen Prüfschritten

Die Bereitstellung von Alternativtexten für Schriftgrafiken ist Gegenstand der Prüfschritte 9.1.1.1a "Alternativtexte für Bedienelemente" und 9.1.1.1b "Alternativtexte für Grafiken und Objekte".

### Einordnung des Prüfschritts nach WCAG 2.1

#### Guideline

-   [Guideline 1.4 Distinguishable: Make it easier for users to see and hear content including separating foreground from background](https://www.w3.org/TR/WCAG21/#distinguishable)

#### Success criterion

-   [1.4.5 Images of Text](https://www.w3.org/TR/WCAG21/#images-of-text) (Level AA)

#### Techniques

##### General Techniques

-   [G140: Separating information and structure from presentation to enable different presentations](https://www.w3.org/WAI/WCAG21/Techniques/general/G140.html)

##### CSS Techniques

-   [C22: Using CSS to control visual presentation of text](https://www.w3.org/WAI/WCAG21/Techniques/css/C22.html)
-   [C30: Using CSS to replace text with images of text and providing user interface controls to switch](https://www.w3.org/WAI/WCAG21/Techniques/css/C30.html)

## Quellen

-   [Does SVG text pass WCAG 1.4.5 (Images of Text)?](https://www.paciellogroup.com/blog/2015/12/does-svg-text-pass-wcag-1-4-5-images-of-text/) (Léonie Watson, The Paciello Group blog, Dezember 2015)
-   [Accessible SVGs in High Contrast Mode](https://css-tricks.com/accessible-svgs-high-contrast-mode/) (Eric Bailey, CSS-Tricks, June 2017)

## Fragen zu diesem Prüfschritt

### Wie ist es mit der Darstellung von Schriftzeichen, die nicht auf allen Computern zur Verfügung stehen? Also zum Beispiel arabische Schriftzeichen: sollten dafür nicht besser Grafiken verwendet werden?

Moderne Betriebssysteme stellen die Schriftzeichen aller verbreiteten Sprachen zur Verfügung. In aller Regel sind Schriftzeichen, mit denen ein möglicher Nutzer etwas anfangen könnte, auch installiert. Die grafische Darstellung von Schriftzeichen ist daher nur als zusätzliches Angebot sinnvoll.

Im BITV-Test wird nur geprüft, ob Text in Form von Text verfügbar ist. Zusätzliche grafische Angebote werden nicht berücksichtigt.

### Was ist mit auf Fotos abgebildeten Schriften?

Schriftgrafiken sollen nicht verwendet werden, weil die Darstellung des Textes dann nicht mehr flexibel ist. Bei abgebildeten Schriften, also zum Beispiel bei Fotos mit Ladenschildern sind Inhalt und Darstellung zusammengehörig. Dieser Prüfschritt ist also nicht anwendbar.

Davon ausgenommen sind allerdings Abbildungen, die wie Schriftgrafiken verwendet werden, also zum Beispiel als Überschriften dienen.

### Oft ist es nicht möglich, auf Schriftgrafiken zu verzichten, denn das Corporate Design gilt auch für den Webauftritt, und die für Texte verfügbaren Schrifttypen passen nicht.

Sicher gibt es gute Gründe für den Einsatz von Schriftgrafiken. Der Einsatz von Schriftgrafiken ist aber auf der anderen Seite aus Sicht der Barrierefreiheit problematisch. Es muss also entschieden werden, ob das einheitliche Corporate Design wichtiger ist, als die barrierefreie Zugänglichkeit des Webauftritts. Wenn die barrierefreie Zugänglichkeit der im Webauftritt bereitgestellten Inhalte Priorität haben soll, wird es erforderlich sein, das Corporate Design anzupassen oder auf seinen durchgängigen Einsatz zu verzichten.

### Wie wird Text in Firmenlogos bewertet?

In diesem Prüfschritt geht es um die Verwendung von grafischen Schriften für Texte, Überschriften und Bedienelemente. Das Firmenlogo ist nicht relevant, so lange es nicht (oder nur zusätzlich) als Überschrift oder Bedienelement eingesetzt wird.
