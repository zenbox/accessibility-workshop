# Prüfschritt 9.1.1.1c Leere alt-Attribute für Layoutgrafiken

Bilder, die nur zur Dekoration oder für das Layout genutzt werden, brauchen keinen Alternativtext. Damit Screenreader diese Bilder ignorieren, sollte das `alt`-Attribut leer sein (`alt=""`). Ohne `alt`-Attribut liest der Screenreader stattdessen den Dateinamen vor, was für Nutzer störend ist.

Dekorative Icons, die über Schriftarten (Icon Fonts) oder als SVG eingebunden sind, sollten mit `aria-hidden="true"` versteckt werden, damit sie nicht unnötig vorgelesen werden.

Wichtig ist, dass nur wirklich bedeutungslose Bilder ein leeres `alt`-Attribut haben. Bilder mit Informationsgehalt müssen eine sinnvolle Beschreibung bekommen.

Wenn eine Webseite automatisch leere `alt`-Attribute vergibt, sollte geprüft werden, ob dabei nicht versehentlich wichtige Bilder unzugänglich gemacht werden.

Das Ziel ist eine möglichst barrierefreie Nutzung von Webseiten für alle, insbesondere für Menschen, die auf Screenreader angewiesen sind.

_BITV-Originaltext:_

## Was wird geprüft?

Eine Grafik, die keine informative Funktion hat, benötigt keinen Alternativtext. Grafiken ohne informative Funktion sind zum Beispiel Abstandshalter, Farbflächen, Muster, oder rein dekorative Fotos. Solche Grafiken sollen mit einem leeren `alt`\-Attribut (`alt=""`) ausgezeichnet werden.

Thema des Prüfschritts sind auch Icons, die mittels Icon Font eingebunden sind und SVGs.

## Warum wird das geprüft?

Screenreader behandeln Bilder **ohne** `alt`\-Attribut anders als Bilder **mit leerem** `alt`\-Attribut.

Wenn ein Screenreader auf ein Bild ohne `alt`\-Attribut stößt, liest er normalerweise den Namen der Bilddatei vor. In vielen Fällen muss man für die Benutzung von Seiten unbedingt wissen, was auf Bildern gezeigt wird. Dateinamen können dafür manchmal brauchbare Hinweise liefern.

Wenn Bilder nur der Dekoration dienen, ist das Vorlesen des Dateinamens dagegen störend. Bei diesen Bildern wäre es besser, wenn der Screenreader sie einfach übergehen würde.

Das leere `alt`\-Attribut informiert den Screenreader darüber, dass das betreffende Bild nur der Dekoration dient und sein Inhalt unbedeutend ist. Der Screenreader ignoriert das Bild dann komplett, er tut so, als sei es nicht vorhanden.

Das leere `alt`\-Attribut ist also sehr wichtig. Es stellt sicher, dass der Besucher mit Screenreader nicht durch das dauernde Vorlesen bedeutungsloser Dateinamen an der Nutzung der Seite gehindert wird.

Icon Fonts sind Schriftarten, die Symbole statt Buchstaben beinhalten. Sie werden per CSS eingebunden. Manche moderne Browser übergeben an den Screenreader ein Unicode-Äquivalent, was bei dekorativen Icons störend ist.

## Wie wird geprüft?

### 1\. Anwendbarkeit des Prüfschritts

Der Prüfschritt ist anwendbar, wenn als `img-`Element eingebundene Grafiken, Font Icons oder SVGs für Layoutzwecke verwendet werden.

### 2\. Prüfung

#### 2.1 Leere `alt`\-Attribute für Layoutgrafiken

1.  Die Seite im Firefox laden.
2.  In der [Web Developer Toolbar](https://www.bitvtest.de/bitv_test/das_testverfahren_im_detail/werkzeugliste.html#webdeveloper) das Menü _Images > Display Alt Attributes_ aufrufen. Alternativ kann auch das [Images bookmarklet](https://www.bitvtest.de/bitv_test/das_testverfahren_im_detail/werkzeugliste.html#imagesbm) eingesetzt werden.
3.  Prüfen, ob Layoutgrafiken und dekorative Grafiken leere `alt`\-Attribute enthalten. Falls bei solchen Grafiken `title`\-Attribute vergeben sind, müssen auch diese leer sein. Zu bemängeln sind komplett fehlende `alt`\-Attribute (werden durch die Toolbar-Funktion mit "No Alt!" gekennzeichnet) und auch Bezeichnungen wie "Abstandshalter", "spacer", "leer" etc. für Layoutgrafiken.

#### 2.2 Dekorative Icon Fonts:

Beim Einsatz von Icon Fonts ist es nicht möglich, das leere `alt`\-Attribut einzusetzen.

Ein dekoratives Icon wird von assistiven Technologien ignoriert, wenn es mit einem geeigneten Verfahren vor diesen versteckt wird (z. B. `aria-hidden="true"`).

##### Prüfung

1.  Seite in [Firefox](https://www.bitvtest.de/bitv_test/das_testverfahren_im_detail/werkzeugliste.html#firefox) aufrufen.
2.  Mit den Web Developer Tools prüfen, ob mit der CSS-Eigenschaft `content` für die Pseudoelemente `:before` oder `:after` Inhalt (Font Icons) zu dekorativen Zwecken eingebunden wird.
3.  Falls für diese Icons Text ausgegeben wird (z. B. `content: "k"`), prüfen, ob das Icon mit einer geeigneten Technik für Screenreader versteckt wird (z. B. `aria-hidden="true"`).

#### 2.3 Dekorative SVGs

##### Prüfung

1.  Seite in [Firefox](https://www.bitvtest.de/bitv_test/das_testverfahren_im_detail/werkzeugliste.html#firefox) aufrufen.
2.  Mit den Web Developer Tools prüfen, ob es sich um eine direkt in HTML eingebundene SVG handelt (Inline SVG).
3.  Prüfen, ob die Grafik mit `aria-hidden="true"` versteckt wird.

### 3\. Hinweise

Bei aus mehreren Teilbildern zusammengesetzten Bildern mit Informationsgehalt sollte eines der Teilbilder einen Alternativtext haben, der über den Inhalt des zusammengesetzten Bildes informiert. Die anderen Teilbilder sollten mit leeren `alt`\-Attributen versehen sein.

### 4\. Bewertung

#### Nicht voll erfüllt

-   Layoutgrafiken haben kein `alt`\-Attribut
-   Layoutgrafiken sind mit Alternativtexten wie "Platzhalter" oder "leer" versehen
-   Layoutgrafiken haben `title`\-Attribute, die nicht leer sind

## Einordnung des Prüfschritts

### Einordnung des Prüfschritts nach WCAG 2.1

#### Guideline

-   [Guideline 1.1 Text Alternatives: Provide text alternatives for any non-text content so that it can be changed into other forms people need, such as large print, braille, speech, symbols or simpler language](http://www.w3.org/TR/WCAG21/#text-alternatives)

#### Success criterion

-   [1.1.1 Non-text Content](http://www.w3.org/TR/WCAG21/#x1-1-1-non-text-content) (Level A)

#### Techniques

##### HTML Techniques

-   [H67: Using null alt text and no title attribute on img elements for images that AT should ignore](https://www.w3.org/WAI/WCAG21/Techniques/html/H67)

##### CSS Techniques

-   [C9: Using CSS to include decorative images](https://www.w3.org/WAI/WCAG21/Techniques/css/C9)

##### Failures

-   [F38: Failure of Success Criterion 1.1.1 due to omitting the `alt`\-attribute for non-text content used for decorative purposes only in HTML](https://www.w3.org/WAI/WCAG21/Techniques/failures/F38)
-   [F39: Failure of Success Criterion 1.1.1 due to providing a text alternative that is not null(e.g. `alt='spacer'` or `alt='image'`) for images that should be ignored by assistive technology](https://www.w3.org/WAI/WCAG21/Techniques/failures/F39)

## Quellen

Die WCAG 2.0-Technik [H67](https://www.w3.org/WAI/WCAG21/Techniques/html/H67.html) sieht zusätzlich vor, dass bei Layout-Grafiken auch kein `title`\-Attribut vorhanden sein soll oder dass das `title`\-Attribut leer ist:

> For each image that should be ignored:
>
> Check that `title` attribute is either absent or empty. Check that `alt` attribute is present and empty or contains only whitespace (but not )

([H67: Using null alt text and no title attribute on img elements for images that AT should ignore](https://www.w3.org/WAI/WCAG21/Techniques/html/H67.html))

## Fragen zu diesem Prüfschritt

### Grafiken mit informativem Charakter

Auf der Seite sind auch Grafiken, die ganz klar informativen Charakter haben, mit leeren `alt`\-Attributen versehen.

Vermutlich wird automatisch ein leeres `alt`\-Attribut erzeugt, wenn zu einem Bild kein entsprechender Text eingegeben worden ist. Zu welchem Prüfschritt gehört das?

So ist das leere `alt`\-Attribut für dekorative Grafiken ganz sicher nicht gedacht. Das **leere** `alt`\-Attribut ist ja nicht dasselbe wie ein **fehlendes** `alt`\-Attribut. Es soll dem Besucher sagen, dass die Grafik keinen wichtigen Inhalt enthält und nur der Dekoration dient. Der Besucher weiß dann, dass er nichts versäumt, wenn er die Grafik nicht sieht. Die automatische Vergabe leerer Alternativtexte für informative Grafiken ist ein Missbrauch des leeren `alt`\-Attributs. Sie sorgt dafür, dass man sich auf dieses Kennzeichen nicht mehr verlassen kann.

Dies wird nur in Prüfschritt 9.1.1.1b "Alternativtexte für Grafiken und Objekte" bewertet.

### Aufgabe des Bildes in den Alternativtext?

Warum soll man bei Layoutgrafiken nicht die jeweilige Aufgabe des Bildes, also zum Beispiel "Abstandhalter" in den Alternativtext schreiben?

Wofür sollte das gut sein? Den Abstand herstellen, also die Aufgabe des Bildes übernehmen kann der Alternativtext nicht. Die Information, dass da irgendwo Abstände zwischen Elementen der Seite sind, ist nutzlos. Wie die Elemente auf der Seite angeordnet sind, lässt sich der Tatsache, dass an irgend welchen Stellen Abstandhalter sind, auch nicht entnehmen.

Solche Alternativtexte haben also keinen Nutzen. Auf der anderen Seite kann es sehr störend sein, wenn der Screenreader dauernd "Abstandhalter Abstandhalter Abstandhalter …​" vorliest.

### Warum müssen Layoutgrafiken mit leeren `alt`\-Attributen versehen werden?

Sie werden ohnehin nicht gebraucht, warum also nicht einfach das `alt`\-Attribut ganz weglassen?

Leider ist es noch nicht selbstverständlich, dass informative Grafiken mit Alternativtexten versehen sind. Wenn eine Webseite Grafiken ohne Alternativtext enthält, kann der blinde Besucher also nicht davon ausgehen, dass diese Grafiken nur dem Layout dienen und für ihn nicht relevant sind. Daher die Festlegung, dass der Webdesigner Grafiken durch Zuordnung eines leeren `alt`\-Attributs ausdrücklich als Layoutgrafiken kennzeichnen soll.
