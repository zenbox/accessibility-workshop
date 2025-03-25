# Prüfschritt 9.1.3.2 Sinnvolle Reihenfolge

Die Reihenfolge von Inhalten auf einer Webseite muss logisch und verständlich sein, unabhängig von der visuellen Darstellung. Screenreader lesen Inhalte in der Reihenfolge des Quellcodes vor, daher dürfen wichtige zusammengehörige Elemente nicht auseinandergerissen werden. Dynamische Inhalte, die standardmäßig verborgen sind, müssen auch für Screenreader unsichtbar sein.

Seite prüfen, ob:

-   Inhalte in einer sinnvollen Reihenfolge stehen
-   Dynamische Inhalte für Screenreader verborgen sind, wenn sie visuell nicht sichtbar sind
-   Layout-Tabellen ohne Strukturmarkup linearisierbar sind

-   Nicht erfüllt: Unverständliche Reihenfolge oder nicht versteckte Inhalte für Screenreader.

_BITV-Originaltext:_

## Was wird geprüft?

Seiteninhalte sollen unabhängig von der Darstellung in einer sinnvollen und brauchbaren Reihenfolge stehen. Was inhaltlich zusammengehört (etwa eine Überschrift und dazugehörige Inhalte darunter), soll nicht auseinandergerissen werden. Mittels CSS versteckte Seiteninhalte sollen deshalb an sinnvoller Stelle im Seitenquelltext erscheinen.

Dynamische Inhalte, die im Ausgangszustand visuell versteckt sind, sollen auch für Screenreader verborgen sein, damit sie nicht die Lesereihenfolge stören.

Ausschlaggebend bei der Prüfung ist nicht, ob die Seite in der Ansicht ohne CSS visuell eine verständliche Lesereihenfolge hat. Denn häufig sind Seiteninhalte schlecht lesbar, wenn CSS abgeschaltet ist, es kommt zu Überlappungen oder Inhalte erscheinen auseinandergerissen. Ausschlaggebend ist dagegen, ob **bei eingeschaltetem CSS** die Reihenfolge beim linearen Lesen mit dem Screenreader sinnvoll ist.

## Warum wird das geprüft?

Screenreader lesen die Elemente, die auf dem Bildschirm in der Fläche angeordnet sind, **nacheinander** vor - und zwar in der Reihenfolge, in der sie im Quellcode stehen. Die Reihenfolge der Elemente muss also gut verständlich und nutzbar sein.

## Wie wird geprüft?

### 1\. Anwendbarkeit des Prüfschritts

Der Prüfschritt ist anwendbar, wenn CSS verwendet wird, insbesondere für die Positionierung von Inhalten, und wenn Inhalte dynamisch eingeblendet oder eingefügt werden.

### 2\. Prüfung

#### 2.1 Lesereihenfolge für Screenreader-Nutzende

-   Seite im Browser Chrome oder Firefox aufrufen.
-   Über eine Quellcode-Analyse die Lesereihenfolge der Elemente im DOM prüfen.
-   Gegebenenfalls zusätzlich NVDA aktivieren, die Seiteninhalte im Lesemodus des Screenreaders (mit Abwärts-Pfeiltaste) durchlaufen.
-   Gibt es Linearisierungsprobleme, die bei der Screenreader-Nutzung störend sind? Beispiel: Beschriftungen werden nicht vor dem jeweiligen Eingabefeld ausgegeben.
-   Sind Inhalte wie Ausklappmenüs, Ausklappbereiche, oder Dialoge, die standarmäßig visuell ausgeblendet sind, mit geeigneten Techniken für Screenreader-Nutzende verborgen?

#### 2.2 Prüfung der Linearisierbarkeit von Layouttabellen

Wenn Tabellen für das Layout (die Anordnung von Elementen auf der Seite) eingesetzt werden, müssen sie linearisierbar sein.

-   Seite im [Firefox](https://www.bitvtest.de/bitv_test/das_testverfahren_im_detail/werkzeugliste.html#firefox) anzeigen.
-   Mittels [Web Developer Toolbar](https://www.bitvtest.de/bitv_test/das_testverfahren_im_detail/werkzeugliste.html#webdeveloper) die Funktion _Miscellaneous > Linearize page_ die Struktur der Seite und damit die der Layouttabelle linearisieren.
-   Prüfen, ob die lineare Reihenfolge der angezeigten Inhalte sinnvoll ist.

### 3\. Hinweise

#### Reihenfolge von Inhalten

Die visuelle Anordnung der Seitenelemente kann von der Reihenfolge im Quelltext abweichen. Sichtbare Inhalte sollen in der Regel in der gleichen Reihenfolge wie im Quelltext stehen. Bei der Nutzung von CSS Layout-Technik `grid` kommt es hier häufiger zu Problemen.

In manchen Fällen können bewusste Abweichungen von der visuellen Reihenfolge akzeptabel sein, etwa, wenn bei Meldungen in einem News-Bereich visuell das Datum der Meldung über der Überschrift steht, in der Lesereihenfolge aber auf diese folgt. Ein anderes Beispiel sind Überschriften mit Dachzeilen (etwa Kategorien von Meldungen). Hier kann es sinnvoll sein, dass die Dachzeile erst nach der Überschrift ausgegeben wird. Das Kriterium bei der Beurteilung ist immer: sind die Inhalte in der ausgegebenen Reihenfolge verständlich?

#### Dynamische Elemente

Häufig werden dynamische Elementen nur visuell ausgeblendet, sind aber für den Screenreader im Lesemodus noch erreichbar, weil sie nicht mit geeigneten Mitteln wie `display:none` versteckt wurden. Grundsätzlich besteht für Screenreader-Nutzende das Problem, dass oft umfangreiche Inhalte (etwa Navigationsmenüs) durchlaufen werden müssen. Für sehbehinderte Nutzende, die den Screenreader zusätzlich einsetzen, besteht zusätzlich das Problem, dass visuelle Inhalte und Screenreader-Ausgabe auseinanderklaffen.

### 4\. Bewertung

#### Nicht voll erfüllt

-   Die Lesereihenfolge entspricht nicht der visuellen, die Inhalte werden dadurch unverständlich oder Zuordnungen (etwa von Beschriftungen und Feldern sind in der Screenreader-Ausgabe fehlerhaft.
-   Visuell versteckte Elemente, etwa Ausklappmenüs oder Dialoge, sind nicht für Screenreader-Nutzende verborgen.

## Einordnung des Prüfschritts

### Abgrenzung zu anderen Prüfschritten

-   Custom controls, die etwa Benutzerschnittstellen aus positionierten `div` s mit Hintergrundbildern erzeugen, werden bereits in einer Reihe von bestehenden Prüfkriterien implizit geprüft, etwa 9.2.4.7 "Aktuelle Position des Fokus deutlich", und 9.4.1.2 "Name, Rolle, Wert verfügbar".
-   Die korrekte **Reihenfolge im Quelltext** bei dynamisch generierten oder eingeblendeten Elementen ist Gegenstand von Prüfschritt 9.2.4.3 "Schlüssige Reihenfolge bei der Tastaturbedienung".

### Einordnung des Prüfschritts nach WCAG 2.1

#### Guideline

-   [Guideline 1.3 Adaptable: Create content that can be presented in different ways (for example simpler layout) without losing information or structure.](https://www.w3.org/WAI/WCAG21/quickref/?showtechniques=131#adaptable)

#### Success criterion

-   [1.3.2 Meaningful Sequence](https://www.w3.org/WAI/WCAG21/quickref/?showtechniques=131#meaningful-sequence) (Level A)

#### Techniques

##### General Techniques

-   [G57 Ordering the content in a meaningful sequence](https://www.w3.org/WAI/WCAG21/Techniques/general/G57.html)

#### CSS Techniques

-   [C6 Positioning content based on structural markup](https://www.w3.org/WAI/WCAG21/Techniques/css/C6.html)
-   [C8 Using CSS letter-spacing to control spacing within a word](https://www.w3.org/WAI/WCAG21/Techniques/css/C8.html)
-   [C27: Making the DOM order match the visual order](https://www.w3.org/WAI/WCAG21/Techniques/css/C27.html)

#### Scripting Techniques

-   [SCR21: Using functions of the Document Object Model (DOM) to add content to a page](https://www.w3.org/WAI/WCAG21/Techniques/client-side-script/SCR21.html)
-   [SCR28: Using an expandable and collapsible menu to bypass block of content](https://www.w3.org/WAI/WCAG21/Techniques/client-side-script/SCR28.html)

#### Failures

-   [F1: Failure of Success Criterion 1.3.2 due to changing the meaning of content by positioning information with CSS](https://www.w3.org/WAI/WCAG21/Techniques/failures/F1.html)
-   [F32: Failure of Success Criterion 1.3.2 due to using white space characters to control spacing within a word](https://www.w3.org/WAI/WCAG21/Techniques/failures/F32.html)
-   [F34: Failure of Success Criterion 1.3.1 and 1.3.2 due to using white space characters to format tables in plain text content](https://www.w3.org/WAI/WCAG21/Techniques/failures/F34.html)
-   [F49 Failure of Success Criterion 1.3.2 due to using an HTML layout table that does not make sense when linearized](https://www.w3.org/WAI/WCAG21/Techniques/failures/F49.html)

## Quellen

-   [Grid by example](https://gridbyexample.com/) (Rachel Andrew)
