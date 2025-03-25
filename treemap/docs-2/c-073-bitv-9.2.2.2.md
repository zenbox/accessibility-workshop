# Prüfschritt 9.2.2.2 Bewegte Inhalte abschaltbar

Bewegte oder blinkende Inhalte dürfen Nutzer nicht ablenken oder die Nutzung der Seite erschweren. Sie müssen von allein nach 5 Sekunden stoppen oder abschaltbar sein.

-   Prüfen, ob bewegte oder automatisch aktualisierte Inhalte nach 5 Sekunden aufhören
-   Prüfen, ob es eine sichtbare Möglichkeit gibt, die Bewegung zu stoppen
-   Prüfen, ob die Bewegung nach dem Anhalten nicht von selbst wieder startet

_BITV-Originaltext:_

## Was wird geprüft?

Ablenkung durch blinkende oder sich bewegende Elemente soll vermieden werden, auf 5 Sekunden begrenzt sein oder abschaltbar sein.

Bewegte oder automatisch aktualisierte Inhalte, z. B. periodisch wechselnde Nachrichten-Aufmacher (Teaser) sollen zum Lesen anhaltbar sein.

## Warum wird das geprüft?

Viele Benutzer haben Schwierigkeiten, Seiten zu nutzen, die mit blinkenden oder sich bewegenden Elementen (zum Beispiel Werbung) ausgestattet sind. Solche Elemente lenken ab. Der Benutzer kann sich möglicherweise nicht auf andere Elemente des Webauftritts konzentrieren.

Viele Benutzer haben außerdem Schwierigkeiten, blinkende oder bewegte Inhalte zu lesen, etwa bei Newstickern.

Interaktive bewegte Inhalte können für Benutzer mit motorischen Einschränkungen problematisch sein.

Automatisch aktualisierte Nachrichten-Aufmacher (Teaser) ändern unangekündigt die angezeigten Inhalte und stören dadurch die Wahrnehmung und Orientierung. Das beeinträchtigt besonders Nutzer von Bildschirmvergrößerungssoftware und solche, die mehr Zeit zum Lesen brauchen. Bei Screenreader-Nutzern kann es zu unvermittelten Fokus-Verschiebungen kommen.

Einige Bewegungen (etwa von animated gifs) lassen sich über die esc-Taste beenden, aber die meisten Nutzer kennen diese Funktion nicht. Auch das Deaktivieren von JavaScript führt in manchen Fällen zum Beenden der Bewegung, etwa von skriptgesteuerten Tickern oder wechselnden Teasern. Dieses Deaktivieren ist aber zunehmend problematisch, da sich immer mehr Websites auf aktiviertes JavaScript verlassen. Selbst wenn die Website dann noch funktioniert, wissen Nutzer nicht, was ihnen ohne JavaScript entgeht.

Schaltflächen zum Beenden der Bewegung sind problematisch. Sie müssen erst einmal gefunden werden, bevor Benutzer mit ihnen die Bewegung stoppen können. Da sie zur Zeit sehr selten eingesetzt werden, erwarten und erkennen Benutzer sie häufig nicht.

## Wie wird geprüft?

### 1\. Anwendbarkeit des Prüfschritts

Der Prüfschritt ist immer anwendbar, wenn bewegte Inhalte gleichzeitig mit anderen nicht bewegten Inhalten (etwa die Navigation oder statische Inhalte) dargestellt werden.

Nicht anwendbar ist der Prüfschritt auf essenziell wichtige Aktualisierungen von Inhalten, zum Beispiel, wenn die verbleibende Zeit einer Session heruntergezählt wird oder die Höhe eines Auktionsgebots dynamisch aktualisiert wird.

### 2\. Prüfung

Falls die Seite blinkende, bewegte oder automatisch aktualisierte Inhalte enthält, zum Beispiel Nachrichten-Aufmacher (Teaser), laufende Texte, oder animierte Werbung:

1.  Prüfen, ob die Bewegung innerhalb von 5 Sekunden nach Anzeige der Seite von selbst aufhört.
2.  Falls das nicht der Fall ist: Feststellen, ob sich auf der Seite eine Schaltfläche befindet, mit der man die Bewegung stoppen kann, eine gleichwertige nicht-animierte Version der Seite laden kann, oder ob es eine klare Anweisung gibt, wie die Bewegung mit der Tastatur angehalten werden kann.
3.  Prüfen, ob das Aktivieren der Schaltfläche oder des Tastatur-Shortcuts die Bewegung tatsächlich anhält und sie auch nicht wieder von allein erneut beginnt.

Zusätzlich sollte geprüft werden, ob das erneute Aktivieren der Schaltfläche die Bewegung wieder in Gang setzt, und zwar (bei Videos oder Animationen) von dem Punkt aus, der beim letztem Anhalten erreicht wurde. Ist das nicht der Fall, sollte dies angemerkt werden. Dieser Mangel ist aber nicht als Verstoß gegen die Anforderung dieses Prüfschritts zu verstehen.

### 3\. Hinweise

Die Schaltfläche oder die Anweisung, mit der man die Bewegung anhalten kann, muss eindeutig sein und deutlich sichtbar am Seitenbeginn oder im direkten Kontext des bewegten Inhalts platziert sein.

Alle Inhalte müssen nach dem Anhalten der Bewegung verfügbar bleiben.

Es spielt keine Rolle, ob es sich bei den blinkenden oder sich bewegenden Inhalten um Werbung oder um redaktionelle Inhalte handelt.

### 4\. Bewertung

#### Nicht voll erfüllt

-   Bewegung endet nicht von allein, bewegte und automatisch aktualisierte Inhalte können nicht angehalten, ausgeblendet oder in ihrer Aktualisierungsfrequenz angepasst werden.
-   Das Element zum Anhalten der Bewegung befindet sich nicht im unmittelbaren Kontext des sich bewegenden Elements oder am Beginn der Ansicht, oder erfüllt nicht alle Anforderungen der Barrierefreiheit.

## Einordnung des Prüfschritts

### Abgrenzung der Prüfschritte 9.2.2.1 und 9.2.2.2

Dieser Prüfschritt 9.2.2.2 betrifft bewegte Inhalte, die Benutzer ablenken oder durch ihren vorgegebenen zeitlichen Ablauf für bestimmte Benutzer schwierig wahrnehmbar sind. Hier wird geprüft, ob Benutzer die Möglichkeit haben, bewegte Inhalte anzuhalten oder auszublenden.

Der Prüfschritt 9.2.2.1 "Zeitbegrenzungen anpassbar" betrifft Zeitbegrenzungen, welche die ganze Seite betreffen, unabhängig davon, ob die zeitbegrenzten Inhalte bewegt sind (also ablenken) oder nicht. Geprüft wird, ob solche Zeitbegrenzungen abschaltbar oder verlängerbar sind.

Zur Abgrenzung von Blinken und Flackern siehe Abschnitt "Quellen" bei Prüfschritt 9.2.3.1 "Verzicht auf Flackern".

### Einordnung des Prüfschritts nach WCAG 2.1

#### Guideline

-   [Guideline 2.2 Enough Time: Provide users enough time to read and use content.](https://www.w3.org/TR/WCAG21/#enough-time)

#### Success criterion

-   [2.2.2 Pause, Stop, Hide](https://www.w3.org/TR/WCAG21/#pause-stop-hide) (Level A)

#### Techniques

##### General Techniques

-   [G4: Allowing the content to be paused and restarted from where it was paused](https://www.w3.org/WAI/WCAG21/Techniques/general/G4)
-   [G11: Creating content that blinks for less than 5 seconds](https://www.w3.org/WAI/WCAG21/Techniques/general/G11.html)
-   [G152: Setting animated gif images to stop blinking after n cycles (within 5 seconds)](https://www.w3.org/WAI/WCAG21/Techniques/general/G152.html)
-   [G186: Using a control in the Web page that stops moving, blinking, or auto-updating content](https://www.w3.org/WAI/WCAG21/Techniques/general/G186.html)
-   [G191: Providing a link, button, or other mechanism that reloads the page without any blinking content](https://www.w3.org/WAI/WCAG21/Techniques/general/G191.html)

##### Scripting Techniques

-   [SCR22: Using scripts to control blinking and stop it in five seconds or less](https://www.w3.org/WAI/WCAG21/Techniques/client-side-script/SCR22.html)
-   [SCR33: Using script to scroll content, and providing a mechanism to pause it](https://www.w3.org/WAI/WCAG21/Techniques/client-side-script/SCR33.html)

##### Failures

-   [F4: Failure of Success Criterion 2.2.2 due to using text-decoration:blink without a mechanism to stop it in less than five seconds](https://www.w3.org/WAI/WCAG21/Techniques/failures/F4.html)
-   [F7: Failure of Success Criterion 2.2.2 due to an `object` or `applet`, such as Java or Flash, that has blinking content without a mechanism to pause the content that blinks for more than five seconds](https://www.w3.org/WAI/WCAG21/Techniques/failures/F7.html)
-   [F16: Failure of Success Criterion 2.2.2 due to including scrolling content where movement is not essential to the activity without also including a mechanism to pause and restart the content](https://www.w3.org/WAI/WCAG21/Techniques/failures/F16.html)
-   [F47: Failure of Success Criterion 2.2.2 due to using the blink element](https://www.w3.org/WAI/WCAG21/Techniques/failures/F47.html)
-   [F50: Failure of Success Criterion 2.2.2 due to a script that causes a blink effect without a mechanism to stop the blinking at 5 seconds or less](https://www.w3.org/WAI/WCAG21/Techniques/failures/F50.html)

## Quellen

### Die WCAG 2.1 zum Anhalten und Fortsetzen bei aufgezeichneten Inhalten und Echtzeit-Inhalten

> Content that is paused can either resume in real-time or continue playing from the point in the presentation where the user left off.
>
> Pausing and resuming where the user left off is best for users who want to pause to read content and works best when the content is not associated with a real-time event or status.
>
> _Note_: See [Understanding Success Criterion 2.2.1 Timing Adjustable](https://www.w3.org/WAI/WCAG21/Understanding/timing-adjustable.html) for additional requirements related to time-limits for reading. Pausing and jumping to current display (when pause is released) is better for information that is real-time or "status" in nature. For example, weather radar, a stock ticker, a traffic camera, or an auction timer, would present misleading information if a pause caused it to display old information when the content was restarted.
>
> _Note_: Hiding content would have the same result as pausing and jumping to current display (when pause is released).

( [Pause, Stop, Hide: Understanding SC 2.2.2](https://www.w3.org/WAI/WCAG21/Understanding/pause-stop-hide.html))
