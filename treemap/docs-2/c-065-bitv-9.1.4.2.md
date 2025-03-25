# Prüfschritt 9.1.4.2 Ton abschaltbar

Automatisch abgespielte Töne, die länger als 3 Sekunden dauern, müssen abschaltbar sein.

Seite prüfen, ob:

-   Töne automatisch enden oder weniger als 3 Sekunden dauern
-   Es am Seitenanfang eine gut erreichbare Möglichkeit gibt, den Ton zu stoppen oder leiser zu stellen

-   Nicht erfüllt: Kein Mechanismus vorhanden, um automatisch abgespielte Töne zu stoppen oder herunterzuregulieren.

_BITV-Originaltext:_

## Was wird geprüft?

Automatisch abgespielte Töne, die nicht nach drei Sekunden enden, sollen abschaltbar sein.

## Warum wird das geprüft?

Automatisch abgespielte Töne stören Nutzer, die sich auf einer Seite mittels Sprachausgabe orientieren.

Falls ein Tonelement nach dem Laden einer Seite automatisch startet, ist es deshalb wichtig, dass es sich über einen am Seitenbeginn befindlichen barrierefreien Mechanismus abschalten, anhalten oder herunter regeln lässt.

## Wie wird geprüft?

### 1\. Anwendbarkeit des Prüfschritts

Der Prüfschritt ist anwendbar, wenn nach dem Laden einer Seite Tonelemente auf einer Webseite automatisch länger als drei Sekunden abgespielt werden.

### 2\. Prüfung

Wenn nach Laden der Seite ein Tonelement automatisch abgespielt wird:

-   Prüfen, ob der Ton länger als 3 Sekunden dauert.
-   Wenn das der Fall ist: Prüfen, ob sich am Seitenbeginn ein Mechanismus (Button, Link, oder Lautstärke-Regler) befindet, mit dem sich der Ton abschalten oder unabhängig von der Systemlautstärke herunter regeln lässt.
-   Den Mechanismus bedienen und den Ton abschalten.

Wenn sich die Lautstärke regeln lässt:

-   Das Kontrollelement "Sound" aufrufen: Windows-Menü \_Start > Alle Apps > Windows System > Systemsteuerung (> Kategorie Hardware und Sound) > Sound_In der Registerkarte "Wiedergabe" die Eigenschaften des Lautsprechers aufrufen und den "Pegel" (in gleichnamiger Registerkarte) anzeigen.
-   Ton wieder anschalten oder Seite neu laden, dann die Lautstärke ganz herunterregeln. Ist der Ton verschwunden?
-   Prüfen, ob der Lautstärkeregelung durch den Mechanismus unabhängig von der Systemtonlautstärke ist (Die Lautstärkeeinstellung in "Sound" soll unverändert bleiben). Alternativ kann die Systemlautstärke auch über den das Lautsprechersymbol im einblendbaren Infobereich der Taskleiste geprüft werden.

### 3\. Hinweise

-   Töne, die nicht nach kurzer Zeit enden, können auch die Verständlichkeit der Sprachausgabe des Abschaltmechanismus stören. Deshalb wird auch berücksichtigt, wie störend sich der Ton auswirkt. Sprache oder laute Geräusche etwa stören mehr als eine gleichmäßige Hintergrundmusik.
-   Der Mechanismus zum Herunterregeln des Tones darf nicht die Systemtonlautstärke ändern, da dies auch die Tonausgabe von Hilfsmitteln mit Sprachausgabe beeinträchtigen würde.
-   Der Mechanismus zum Abschalten oder Herunterregeln des Tons muss sich am Seitenbeginn befinden und soll selbst alle Anforderungen an Barrierefreiheit erfüllen, also etwa ausreichende Kontraste haben und tastaturbedienbar sein.
-   Wenn sich der Ton herunterregeln lässt, soll er auf der niedrigsten Stellung des Reglers nicht mehr hörbar sein.
-   Es reicht zur Erfüllung dieses Prüfschritts nicht aus, wenn sich der Ton über Tastaturbefehle (etwa die _Escape_\-Taste) abschalten lässt. Diese Funktion kann sinnvoll sein, wird aber von vielen Nutzern nicht vermutet.

### 4\. Bewertung

#### Erfüllt

-   Automatisch abgespielte Töne dauern nicht länger als drei Sekunden oder sind über einen barrierefreien Mechanismus am Seitenbeginn abschaltbar.

#### Nicht voll erfüllt

-   Automatisch abgespielter Ton enthält von Beginn an längere Sprachpassagen oder andere laute und störende Ton-Ereignisse. Die Sprachausgabe des Abschaltmechanismus kann deshalb nur schlecht wahrgenommen werden.
-   Der Mechanismus zum Abschalten des Tons befindet sich nicht unmittelbar am Seitenbeginn.
-   Es gibt am Seitenbeginn lediglich eine Erklärung, wie der Ton mittels Tastatur abschaltbar ist.

## Einordnung des Prüfschritts

### Einordnung des Prüfschritts nach WCAG 2.1

#### Guideline

-   [Guideline 1.4 Distinguishable: Make it easier for users to see and hear content including separating foreground from background.](https://www.w3.org/TR/WCAG21/#audio-control)

#### Success criterion

-   [1.4.2 Audio Control](https://www.w3.org/TR/WCAG21/#audio-control) (Level A)

#### Techniques

##### General Techniques

-   [G60: Playing a sound that turns off automatically within three seconds](https://www.w3.org/WAI/WCAG21/Techniques/general/G60.html)
-   [G170: Providing a control near the beginning of the Web page that turns off sounds that play automatically](https://www.w3.org/WAI/WCAG21/Techniques/general/G170.html)
-   [G171: Playing sounds only on user request](https://www.w3.org/WAI/WCAG21/Techniques/general/G171.html)

#### Failures

-   [F23: Failure of 1.4.2 due to playing a sound longer than 3 seconds where there is no mechanism to turn it off](https://www.w3.org/WAI/WCAG21/Techniques/failures/F23.html)
-   [F93: Failure of Success Criterion 1.4.2 for absence of a way to pause or stop an HTML5 media element that autoplays](https://www.w3.org/WAI/WCAG21/Techniques/failures/F93.html)

## Quellen

### Bedeutung der Tonabschaltung nach WCAG 2.1

> Individuals who use screen reading software can find it hard to hear the speech output if there is other audio playing at the same time. This difficulty is exacerbated when the screen reader’s speech output is software based (as most are today ) and is controlled via the same volume control as the sound. Therefore, it is important that the user be able to turn off the background sound. Note: Having control of the volume includes being able to reduce its volume to zero.
>
> Note: Playing audio automatically when landing on a page may affect a screen reader user’s ability to find the mechanism to stop it because they navigate by listening and automatically started sounds might interfere with that navigation. Therefore, we discourage the practice of automatically starting sounds (especially if they last more than 3 seconds), and encourage that the sound be started by an action initiated by the user after they reach the page, rather than requiring that the sound be stopped by an action of the user after they land on the page.

( [Audio Control: Understanding SC 1.4.2](https://www.w3.org/WAI/WCAG21/Understanding/audio-control.html))
