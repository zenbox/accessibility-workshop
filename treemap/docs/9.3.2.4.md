# Prüfschritt 9.3.2.4 Konsistente Bezeichnung

Navigation und wiederkehrende Funktionen müssen überall einheitlich benannt sein.

-   Einheitliche Bezeichnungen erleichtern die Orientierung und Wiedererkennbarkeit
-   Menüeinträge und Funktionen sollen klar und konsistent benannt sein
-   Prüfpunkt: Verschiedene Seiten aufrufen und Begriffe in Navigation und Funktionen vergleichen
-   Menüeinträge sollten mit den Überschriften der Zielseiten übereinstimmen
-   Falls Frames verwendet werden, müssen gleiche Inhalte immer an der gleichen Stelle eingebunden sein

_BITV-Originaltext:_

## Was wird geprüft?

Navigationsmechanismen und Funktionen, die innerhalb eines Webauftritts wiederholt eingesetzt werden, sollen einheitlich bezeichnet sein.

## Warum wird das geprüft?

Klare und durchgängig verwendete Bezeichnungen für die Navigation und sich wiederholende Funktionen erleichtern Benutzern das Verständnis der Inhalte des Angebots. Gesuchtes wird leichter gefunden, Zusammenhänge sind einfacher zu erkennen.

## Wie wird geprüft?

### 1\. Anwendbarkeit des Prüfschritts

Der Prüfschritt ist immer anwendbar

### 2\. Prüfung

#### 2.1 Sind Navigation und sich wiederholende Funktionen einheitlich bezeichnet?

-   Ausgehend von der Startseite verschiedene Bereiche des Webangebots aufsuchen.
-   Prüfen, ob Navigationsmechanismen, Menüeinträge und sich wiederholende Funktionen in verschiedenen Bereichen des Webauftritts aussagekräftig und einheitlich benannt sind.
-   Orientieren sich die (oft kürzeren) Menüeinträge an den Überschriften der Zielseiten?
-   Falls das Angebot Framesets zur Gliederung der Inhaltsbereiche benutzt: Mit der [Web Developer Toolbar](https://www.bitvtest.de/bitv_test/das_testverfahren_im_detail/werkzeugliste.html#webdeveloper) auf verschiedenen Seiten mit der Funktion _Outline > Outline Frames_ gefolgt von _Information > Display Element Information_ und dann einem Klick mit dem Cursor-Fadenkreuz auf den Rahmen der Frames prüfen, ob Frames mit gleichen Inhalten (etwa Navigationsmenü) immer an der gleichen Stelle im `frameset` eingebunden sind.

### 3\. Bewertung

Bewertung als nicht oder teilweise erfüllt immer erläutern!

## Einordnung des Prüfschritts

### Abgrenzung von anderen Prüfschritten

-   Während es in diesem Prüfschritt darum geht, ob die eingesetzten Navigationsmechanismen durchgängig einheitliche Bezeichnungen verwendet werden, wird in Prüfschritt 9.3.2.3 "Konsistente Navigation" dagegen geprüft, ob die Navigationsmechanismen und Menüeinträge in verschiedenen Bereichen des Webauftritts durchgängig einheitlich angeordnet sind.

### Einordnung des Prüfschritts nach WCAG 2.1

#### Guideline

-   [Guideline 3.2 Make Web pages appear and operate in predictable ways.](https://www.w3.org/TR/WCAG21/#predictable)

#### Success criteria

-   [3.2.4 Consistent Identification](https://www.w3.org/TR/WCAG21/#consistent-identification) (Level AA)

#### Techniques

##### General Techniques

-   [G131: Providing descriptive labels](https://www.w3.org/WAI/WCAG21/Techniques/general/G131.html)
-   [G197: Using labels, names, and text alternatives consistently for content that has the same functionality](https://www.w3.org/WAI/WCAG21/Techniques/general/G197.html)

##### HTML Techniques

-   [H70: Using frame elements to group blocks of repeated material](https://www.w3.org/WAI/WCAG21/Techniques/html/H70.html)

##### Failures

-   [F31: Failure of Success Criterion 3.2.4 due to using two different labels for the same function on different Web pages within a set of Web pages](https://www.w3.org/WAI/WCAG21/Techniques/failures/F31.html)
