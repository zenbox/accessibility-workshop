# Prüfschritt 9.1.4.3 Kontraste von Texten ausreichend

Texte müssen ausreichenden Kontrast zum Hintergrund haben, um für alle Nutzenden gut lesbar zu sein.

-   Alle Texte haben ein Kontrastverhältnis von mindestens 4,5:1 für normale Schrift
-   Große Schriften (ab 24px oder 18,7px fett) haben ein Verhältnis von mindestens 3:1
-   Alle Zustände (z. B. Hover, Fokus) haben ausreichenden Kontrast
-   Falls eine alternative kontrastreiche Ansicht existiert, ist der Wechsel dorthin gut zugänglich

-   **Nicht erfüllt:** Texte mit zu geringem Kontrast oder unzureichender Hervorhebung
-   **Nicht voll erfüllt:** Wichtige Bedienelemente oder Schaltflächen haben nicht in allen Zuständen ausreichenden Kontrast

_BITV-Originaltext:_

## Was wird geprüft?

Alle Texte der Seite sollen in allen Zuständen ausreichende Helligkeitskontraste haben.

## Warum wird das geprüft?

Wenn Vordergrund- und Hintergrundfarbe sich in der Helligkeit ähneln, haben Texte unter Umständen zu wenig Kontrast. Gute Kontraste sorgen dafür, dass Nutzende Texte leichter lesen können. Insbesondere Menschen, die aufgrund einer verringerten Sehschärfe, einer Farbfehlsichtigkeit oder aufgrund des Alters eine verminderte Kontrastempfindlichkeit haben, profitieren von guten Kontrasten.

## Wie wird geprüft?

### 1\. Anwendbarkeit des Prüfschritts

Der Prüfschritt ist anwendbar, wenn die Seite Text enthält. Grafische Schriften sind ebenfalls Gegenstand des Prüfschritts.

### 2\. Prüfung

#### 2.1 Prüfung der Textkontraste der Standardversion

##### Prüfung nicht festgelegter Farben

-   Über das Bookmarklet ["Vorder-und Hintergrundfarbe definiert"](https://www.bitvtest.de/bitv_test/das_testverfahren_im_detail/werkzeugliste.html#vorderhintergrundfarbebm) oder ein User Stylesheet (`html {background-color:black;color:white}`) prüfen, ob für jedes Element, für das eine Vordergrundfarbe festgelegt wurde, auch eine Hintergrundfarbe festgelegt ist und umgekehrt.

##### Sichtprüfung

-   Sind die Schriftkontraste stark genug?
-   Im Zweifel den [Contrast Analyser](https://www.bitvtest.de/bitv_test/das_testverfahren_im_detail/werkzeugliste.html#cca) öffnen.
-   Im Bereich _Vordergrund_ mit der Pipette die Vordergrundfarbe auswählen, dann im Bereich _Hintergrund_ die Hintergrundfarbe.
-   Falls unklar ist, ob für Schrift der Wert für große Schrift (3:1) oder für kleine Schrift (4,5:1) gilt: In der [Web Developer Toolbar](https://www.bitvtest.de/bitv_test/das_testverfahren_im_detail/werkzeugliste.html#webdeveloper) die Funktion _Informationen > Elementinformationen einblenden_ aktivieren. Text, der überprüft werden soll, anklicken. Im eingeblendeten Fenster "Elementinformationen" im Bereich "Text" wird die jeweilige Schriftgröße in Pixeln angegeben. Alternativ über die Firefox Web Developer Tools mit dem Cursor das fragliche Element aktivieren und unterm Reiter _Inspektor_ im Bereich CSS im Tab _Berechnet_ die tatsächliche Schriftgröße (font-size) ablesen.
-   Für Schriftgrößen unter 24 px (beziehungsweise 18,7 px bei fetter Schrift) prüfen, ob das Kontrastverhältnis bei 4,5:1 oder größer liegt.
-   Für große Schriften prüfen, ob das Kontrastverhältnis bei 3:1 oder größer liegt.

#### 2.2 Styleswitcher-Prüfung, Prüfung der Textkontraste der alternativen Ansicht

Wenn die Kontraste der Standardversion nicht die Sollwerte erfüllen und die Seite eine kontrastreichere Ansicht über einen Styleswitcher anbietet:

1.  Textkontrast des Styleswitcher-Schaltelements prüfen.
2.  Das Kontrastverhältnis muss 4,5:1 oder besser sein, sofern der Schalter mit Hilfe von Text beschriftet ist (bei grafischen Schaltern gilt ein Mindestkontrast von 3,0:1, vergl. Prüfschritt 9.1.4.11). Auch alle anderen Anforderungen müssen erfüllt sein (zum Beispiel Tastaturbedienbarkeit), sonst Prüfung der alternativen Ansicht abbrechen.
3.  Alternative kontrastreichere Ansicht über den Styleswitcher aufrufen.
4.  Textkontraste der alternativen Ansicht prüfen (wie in [2.1 Prüfung der Textkontraste der Standardversion](#_2_1_prüfung_der_textkontraste_der_standardversion)).

### 3\. Hinweise

#### 3.1 Allgemeine Hinweise

-   Elemente, die unterschiedliche Zustände haben können, sollen in allen Zuständen immer ausreichend Kontrast zum Hintergrund haben. So muss auch die Hervorhebung des Maus- bzw. des Tastaturfokus den allgemeinen Kontrast-Grenzwert von 4,5:1 (bei großen Schriften 3,0:1) erfüllen.
-   Schwache Kontraste können zweckmäßig sein, sie können den Umgang mit einer Webseite erleichtern. Ein Beispiel dafür: Funktionen, die prinzipiell vorgesehen, aktuell aber nicht verfügbar sind, werden schwach kontrastierend dargestellt. Das ist akzeptabel, wenn das ausgeblendete Element für die Orientierung und Bedienung nicht erforderlich ist. Der Prüfschritt ist daher auf die Beschriftungen ausgeblendeter, deaktivierter Bedienelemente in der Regel nicht anwendbar
-   Bei Bereichen, die mit Farbwechseln auf den Mauszeiger reagieren, kann ein Screenshot helfen, den Farbwert im "Ruhezustand" zu ermitteln. Alternativ kann man den Fokuszustand über Tastaturbedienung erzeugen und dann den Kontrast mit der Pipette des Contrast Analyzers messen.
-   Wenn Kontraste dünner Schriften zu prüfen sind, gegebenenfalls Schrift vergrößern und die Schriftenglättung ausschalten.
-   Sollen die Farbwerte sehr kleiner Bereiche (feine Schriften oder kleine Icons) ermittelt werden, ist es unter Umständen einfacher, ein Screenshot zu machen und die leistungsfähigeren Zoom- und Pipettenwerkzeuge eines Bildbearbeitungsprogramms zu nutzen.
-   Der Farbkontrast von Textvorbelegungen von Formularfeldern muss die Mindest-Anforderung von 4,5:1 erfüllen. Ausgenommen sind Textvorbelegungen, wenn eine redundante sichtbare Beschriftung die Kontrastanforderung erfüllt. Als Beschriftung zählt bei Suchfeldern auch ein konventionelles Icon, das die Anforderung für Grafikkontraste erfüllt (vergl. Prüfschritt 9.1.4.11). Wenn zusätzliche Informationen (etwa Datumsformat) im Platzhalter-Text stehen, gilt diese Ausnahme nicht, der Platzhalter-Text muss dann den Kontrast von 4,5:1 erfüllen.

#### 3.2 Hinweise zur Prüfung von Seiten mit Styleswitcher

Die Kontrastprüfung auf durch Styleswitcher aufgerufenen kontrastreicheren Ansicht erfolgt nur unter folgenden Bedingungen:

-   Das Styleswitcher-Schaltelement (oder der direkte Link zu einer Styleswitcher-Seite) ist deutlich sichtbar am Seitenbeginn platziert.
-   Das Schaltelement hat ein Kontrastverhältnis von mindestens 4.5:1 sofern mit Text beschriftet (bei grafischen Schaltern gilt ein Mindestkontrast von 3,0:1, vergl. Prüfschritt 9.1.4.11). Es erfüllt auch alle anderen Anforderungen an Barrierefreiheit (z. B. Tastaturbedienbarkeit)
-   Die alternative kontrastreichere Ansicht muss dieselben Informationen und dieselbe Funktionalität aufweisen wie die Ausgangsansicht.

#### 3.3 Hinweise zur Messung des Kontrastverhältnisses

-   Für die Bewertung zählt das Kontrastverhältnis (_relative luminosity_) nach einer in den WCAG 2.1 definierten Formel.
-   Die Prüfung der Kontraste für normalen Text und großen Text orientiert sich an den gemessenen Werten der Schriftgröße in Pixel ([Web Developer Toolbar](https://www.bitvtest.de/bitv_test/das_testverfahren_im_detail/werkzeugliste.html#webdeveloper), _Funktion Elementinformationen einblenden_), denn eine Messung der tatsächlich dargestellten Punktgröße auf dem Bildschirm mit einem Typometer ist nicht praktikabel. Bei einer Bildschirmauflösung von 96 dpi entsprechen 18 Punkt etwa 24 Pixeln, 14 Punkt entsprechen etwa 18,7 Pixeln.
-   Die Messung des Pixel-Äquivalents ist dadurch gerechtfertigt, dass die bisher getesteten _User Agents_ die Auszeichnung in Pixel und Punkt analog behandeln (im Verhältnis 4:3), also unabhängig von der Bildschirmauflösung, unter der der Text angezeigt wird. Richtiger wäre es, wenn _User Agents_ die Bildschirmauflösung auswerten würden, um die Ausgabegröße zu berechnen (also mehr Pixel pro Punkt bei höher auflösenden Bildschirmen). Für die Prüfung maßgeblich ist der Referenzwert von 96 dpi Bildschirmauflösung, für den die Entsprechung auf jeden Fall gilt.

#### 3.4 Hinweise zu mangelnden Text-Kontrasten nativer Elemente in Browsern (z.B. `select`, datepicker widgets)

Abhängig vom genutzten Browser sind in manchen Zuständen die Kontrastwerte nicht ausreichend. So wird etwa bei `select`\-Elementen in der Darstellung im Chrome-Browser die jeweils ausgewählte Option durch weiße Schrift auf blauem Hintergrund mit einem Kontrast von nur 3,2:1 dargestellt. Formal gesehen wäre deshalb bei der Verwendung nativer Elemente mit Kontrastmängeln dieser Prüfschritt in manchen Browsern nicht erfüllt.

Autoren haben auf die Darstellung von manchen nativen Elementen und Widgets zurzeit keine ausreichenden Einflussmöglichkeiten, um für guten Kontrast in allen Zuständen zu sorgen. Würden sie deshalb native Elemente durch kontrastreichere Custom-Elemente ersetzen, entstünden ggf. andere Probleme: die korrekte Darstellung ist von JavaScript abhängig, es treten umgebungsabhängig Probleme bei der Nutzung mit Screenreadern auf, der Code ist umfangreicher und dadurch fehleranfälliger, usw. Da die Nutzung nativer Elemente große Vorteile gegenüber dem Einsatz von Custom-Elementen bietet, gilt dieser Prüfschritt deshalb trotzdem als erfüllt, wenn die Kontrast-Mängel ausschließlich auf die Darstellung von nativen Elementen durch den jeweiligen Browser zurückzuführen sind.

### 4\. Bewertung

#### Erfüllt

-   Das Kontrastverhältnis (_contrast ratio_) zwischen Vorder- und Hintergrundfarbe liegt für Texte unter 18 Punkt (beziehungsweise für fette Texte unter 14 Punkt) bei mindestens 4,5:1.
-   Das Kontrastverhältnis (_contrast ratio_) zwischen Vorder- und Hintergrundfarbe liegt bei Texten in großer Schriftgröße (18 Punkt und größer, 14 Punkt und größer bei fetter Schrift) bei mindestens 3:1.
-   Wenn die Anforderung nur über eine alternative Ansicht erfüllt wird, erfüllt der Styleswicher selbst die Kontrastforderung von 4,5:1 und andere Anforderungen an Barrierefreiheit.

## Einordnung des Prüfschritts

### Abgrenzung zu anderen Prüfschritten

-   Prüfschritt 9.1.4.11 "Kontraste von Grafiken und grafischen Bedienelementen ausreichend" behandelt den Kontrast von Grafiken
-   Schriftgrafiken (zur Definition vergleiche auch Prüfschritt 9.1.4.5 "Verzicht auf Schriftgrafiken"

### Einordnung des Prüfschritts nach WCAG 2.1

#### Guideline

-   [Guideline 1.4 Distinguishable: Make it easier for users to see and hear content including separating foreground from background](https://www.w3.org/TR/WCAG21/#distinguishable)

#### Success criterion

-   [1.4.3 Contrast (Minimum)](https://www.w3.org/TR/WCAG21/#contrast-minimum) (Level AA)

#### Techniques

##### General Techniques

-   [G18: Ensuring that a contrast ratio of at least 4.5:1 exists between text (and images of text) and background behind the text](https://www.w3.org/WAI/WCAG21/Techniques/general/G18.html)
-   [G145: Ensuring that a contrast ratio of at least 3:1 exists between text (and images of text) and background behind the text](https://www.w3.org/WAI/WCAG21/Techniques/general/G145.html)
-   [G148: Not specifying background color, not specifying text color, and not using technology features that change those defaults](https://www.w3.org/WAI/WCAG21/Techniques/general/G148.html)
-   [G174: Providing a control with a sufficient contrast ratio that allows users to switch to a presentation that uses sufficient contrast](https://www.w3.org/WAI/WCAG21/Techniques/general/G174.html)

#### Failures

-   [F83: Failure of Success Criterion 1.4.3 and 1.4.6 due to using background images that do not provide sufficient contrast with foreground text (or images of text)](https://www.w3.org/WAI/WCAG21/Techniques/failures/F83.html)
-   [F24: Failure of Success Criterion 1.4.3, 1.4.6 and 1.4.8 due to specifying foreground colors without specifying background colors or vice versa](https://www.w3.org/WAI/WCAG21/Techniques/failures/F24.html)

## Quellen

### W3C zum Zusammenhang zwischen `px` und `pt`

[CSS Values and Units Module Level 3: 5.2 Absolute Lengths](https://www.w3.org/TR/css3-values/#absolute-lengths)

## Fragen zu diesem Prüfschritt
