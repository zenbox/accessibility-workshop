# Prüfschritt 9.3.3.2 Beschriftungen von Formularelementen vorhanden

Formularelemente müssen sichtbare Beschriftungen haben, die vor oder über den Feldern stehen.

-   Jedes Eingabefeld benötigt eine sichtbare Beschriftung, außer bei eindeutigen Suchformularen
-   Pflichtfelder müssen erkennbar sein, idealerweise mit Text ("Pflichtfeld") statt nur Symbolen
-   Falls ein bestimmtes Eingabeformat erforderlich ist, muss dies vor dem Feld oder im Placeholder erklärt werden
-   Checkboxen und Radiobuttons sollten rechts von der Beschriftung stehen
-   Unzureichend: Nur `placeholder`-Texte als Beschriftung oder fehlende Kennzeichnung wichtiger Felder

_BITV-Originaltext:_

## Was wird geprüft?

Sichtbare Beschriftungen von Formularelementen sind vorhanden.

Eine sichtbare Beschriftung von Formularelementen soll vor (das heißt links neben oder über) dem zugehörigen Eingabefeld vorhanden sein. Nur die Beschriftung von Checkboxes und Radiobuttons kann (und sollte normalerweise) rechts neben dem zugehörigen Eingabefeld angeordnet werden.

Wenn für die Eingabe ein bestimmtes Format verlangt wird, so sind die Anweisungen für alle Benutzer lesbar.

## Warum wird das geprüft?

Wenn sichtbare Beschriftungen zur Verfügung gestellt werden, wissen Nutzer, welche Eingaben erwartet werden. Fehler können so vermieden werden.

Die Anordnung von Beschriftungen direkt vor oder über dem Eingabefeld entspricht den üblichen Gestaltungskonventionen. Auch in ausschnitthaften Ansichten (etwa in Vergrößerungssoftware) wird schnell klar, welche Beschriftung zu welchem Feld gehört.

## Wie wird geprüft?

### 1\. Anwendbarkeit des Prüfschritts

-   Der Prüfschritt ist anwendbar, wenn die Seite Formularelemente enthält.

### 2\. Prüfung

Die Seite im Firefox oder Chrome Browser aufrufen.

#### 2.1 Sind Beschriftungen vorhanden?

-   Sind alle Formularelemente sichtbar beschriftet?
-   Sind Pflichtfelder über Text gekennzeichnet, etwa durch die Ergänzung (Pflichtfeld) nach der Beschriftung, oder durch die Auszeichnung aller Nicht-Pflichtfelder durch die Ergänzung (optional)? Wenn zur Anzeige der Pflichtfelder Symbole wie Sternchen (\*) genutzt werden, sollte deren Bedeutung erklärt sein (am besten am Beginn des Formulars, bei einem mehrstufigen Formular beim ersten Formular).
-   Wenn Eingabefelder ein bestimmtes Eingabeformat vorgeben, wird dieses **vor** dem Eingabefeld oder auch im Placeholder-Text klar beschrieben (Beispiele wären "Format der Datumseingabe: TT.MM.JJJJ" oder "Telefonnummer: Nur Zahlen ohne Leerstellen oder Bindestriche eingeben").

#### 2.2 Sind Beschriftungen richtig positioniert?

1.  Mittels [Web Developer Toolbar](https://www.bitvtest.de/bitv_test/das_testverfahren_im_detail/werkzeugliste.html#webdeveloper) die Funktion _Miscellaneous > Linearize page_ aufrufen und damit die Struktur der Seite linearisieren.
2.  Prüfen, ob in der linearisierten Ansicht die Beschriftung der Eingabefelder klar den Feldern zuzuordnen ist, das heißt, die Beschriftung soll immer direkt **über** oder **vor** dem Feld stehen. Die Beschriftung von Checkboxen und Radiobuttons kann (und sollte in der Regel auch) **nach** dem Formularelement stehen.

### 3\. Hinweise

-   Das `placeholder`\-Attribut ist keine ausreichende Beschriftung im Sinne dieses Prüfschritts. Es verschwindet bei (auch versehentlichen) Nutzereingaben.
-   Bei kombinierten Eingabeelementen hat nicht immer jedes Element eine zugeordnete Beschriftung. In diesem Fall sollen Elemente mit einem erklärenden `title`\-Attribut versehen werden. Beispiel: In einem Formular werden für die Eingabe eines Datums drei Auswahllisten angeboten (Tag, Monat und Jahr). Die drei Auswahllisten haben eine gemeinsame Beschriftung: Datum. Die Auswahllisten für Tag, Monat und Jahr sind mit einem erklärenden `title`\-Attribut versehen.
-   Es kann sinnvoll sein, dass bei Formularen Hinweise zum Eingabeformat oder zu ausgelösten Aktionen einmal am Beginn des Formulars stehen statt vor jedem einzelnen Eingabefeld.
-   Wenn ein einfaches Suchformular nur aus einem Eingabefeld und einem Button besteht, ist oftmals keine sichtbare Beschriftung notwendig. Voraussetzung ist jedoch, dass sich die visuelle Gestaltung des Submit-Buttons an übliche Konventionen orientiert. Es muss visuell verständlich sein, dass es sich um eine Suche handelt (z.B. durch Verwendung eines Lupe-Icons). Die programmatische Ermittelbarkeit einer nicht visuellen Beschriftung ist Gegenstand des Prüfschritts 1.3.1h Beschriftung von Formularelementen programmatisch ermittelbar (siehe dort Abschnitt 3.3). Ein Mangel bzgl. der programmatischen Ermittelbarkeit führt in diesem Prüfschritt nicht zu einer negativen Bewertung.

### 4\. Bewertung

#### Nicht erfüllt

-   Wichtige Formularelemente (z. B. die Sucheingabe) sind ohne sichtbare Beschriftung, auch angrenzende Elemente erklären nicht die Funktion.

#### Teilweise erfüllt oder schlechter

-   Beschriftungen werden nur als Formularfeld-Vorbelegung (`placeholder`\-Attribut) bereitgestellt.

## Einordnung des Prüfschritts

### Abgrenzung von anderen Prüfschritten

In diesem Prüfschritt geht es um sichtbare Beschriftungen. Das Vorhandensein programmatisch ermittelbarer Namen von Formularelementen wird dagegen in Prüfschritt 9.1.3.1h "Beschriftung von Formularelementen programmatisch ermittelbar" geprüft.

### Einordnung des Prüfschritts nach WCAG 2.1

#### Guidelines

-   [Guideline 3.3 Input Assistance: Help users avoid and correct mistakes.](https://www.w3.org/WAI/WCAG21/quickref/?showtechniques=334#input-assistance)

#### Success criteria

-   [3.3.2 Labels or Instructions](https://www.w3.org/WAI/WCAG21/quickref/?showtechniques=334#labels-or-instructions) (Level A)

#### Techniques

##### General Techniques

-   [G13: Describing what will happen before a change to a form control that causes a change of context to occur is made](https://www.w3.org/WAI/WCAG21/Techniques/general/G13.html)
-   [G89: Providing expected data format and example](https://www.w3.org/WAI/WCAG21/Techniques/general/G89.html)
-   [G131: Providing descriptive labels](https://www.w3.org/WAI/WCAG21/Techniques/general/G131.html)
-   [G162: Positioning labels to maximize predictability of relationships](https://www.w3.org/WAI/WCAG21/Techniques/general/G162.html)
-   [G184: Providing text instructions at the beginning of a form or set of fields that describes the necessary input](https://www.w3.org/WAI/WCAG21/Techniques/general/G184.html)

##### HTML Techniques

-   [H44: Using label elements to associate text labels with form controls](https://www.w3.org/WAI/WCAG21/Techniques/html/H44.html)
-   [H65: Using the title attribute to identify form controls when the label element cannot be used](https://www.w3.org/WAI/WCAG21/Techniques/html/H65.html)
-   [H71: Providing a description for groups of form controls using fieldset and legend elements](https://www.w3.org/WAI/WCAG21/Techniques/html/H71.html)
-   [H90: Indicating required form controls using label or legend](https://www.w3.org/WAI/WCAG21/Techniques/html/H90.html)

##### ARIA Techniques

-   [ARIA1: Using the aria-describedby property to provide a descriptive label for user interface controls](https://www.w3.org/WAI/WCAG21/Techniques/aria/ARIA1)
-   [ARIA9: Using aria-labelledby to concatenate a label from several text nodes](https://www.w3.org/WAI/WCAG21/Techniques/aria/ARIA9)
-   [ARIA17: Using grouping roles to identify related form controls](https://www.w3.org/WAI/WCAG21/Techniques/aria/ARIA17.html)

##### Failures

-   [F82: Failure of Success Criterion 3.3.2 by visually formatting a set of phone number fields but not including a text label](https://www.w3.org/WAI/WCAG21/Techniques/failures/F82.html)
