# Prüfschritt 9.3.3.1 Fehlererkennung

Fehler in Formularen müssen klar benannt und die fehlerhaften Felder identifiziert werden.

-   Fehlerhafte oder unvollständige Eingaben sollen durch Textmeldungen verständlich erklärt werden
-   Betroffene Felder müssen eindeutig hervorgehoben oder mit passenden Labels ergänzt sein
-   Fehlermeldungen können am Seitenanfang, direkt neben den Feldern oder per ARIA (`aria-describedby`, `role="alert"`) bereitgestellt werden
-   Nach Korrektur und erneutem Abschicken sollen frühere Fehlermeldungen verschwinden
-   Unzureichend: Nur grafische Hervorhebung ohne Text oder das Löschen aller Eingaben nach einem Fehler

_BITV-Originaltext:_

## Was wird geprüft?

Wenn ein Formular Fehlermeldungen erzeugt, sollen die fehlerhaft ausgefüllten Felder identifiziert und der Fehler in Textform beschrieben werden.

## Warum wird das geprüft?

Bei Formulareingaben kommt es öfters zu Fehlern: Nutzer verschreiben sich oder überspringen benötigte Eingaben.

Wenn das Angebot Nutzereingaben überprüft, sollen die Felder mit fehlerhaften oder fehlenden Eingaben identifiziert werden. Dies erleichtert den Nutzern, Eingaben zu korrigieren.

## Wie wird geprüft?

### 1\. Anwendbarkeit des Prüfschritts

Der Prüfschritt ist anwendbar, wenn die Seite Formulare enthält, welche bei inkorrektem Ausfüllen Fehlermeldungen erzeugen. Dies kann schon während der Eingabe oder erst nach dem Abschicken des Formulars geschehen.

### 2\. Prüfung

1.  Formular unvollständig oder fehlerhaft ausfüllen, etwa durch das Leerlassen von Pflichtfeldern oder das Eingeben syntaktisch nicht korrekter E-Mail-Adressen.
2.  Falls das Abschicken des Formulars eine Fehlermeldung erzeugt: Prüfen, ob die betroffenen Felder identifiziert werden und der Fehler mit Hilfe von Text beschrieben wird. Die Identifizierung der betroffenen Felder kann, auch abhängig von der Länge des Formulars, auf verschiedene Arten geschehen:

    -   Bei Neuanzeige des Formulars werden am Seitenbeginn fehlerhaft ausgefüllte Felder identifiziert.
    -   Fehlerhaft ausgefüllte Felder werden zusätzlich deutlich hervorgehoben.
    -   Die Labeltexte fehlerhaft ausgefüllter Felder ändern sich, um auf die Fehler darstellungsunabhängig hinzuweisen.
    -   Fehlermeldungen, die nahe am Formularfeld positioniert sind, aber nicht Teil des Labels sind, sind programmatisch ermittelbar, etwa durch die Verknüpfung mittels `aria-labelledby` oder `aria-describedby`.
    -   Fehlermeldungen werden mit Hilfe von Live-Regionen oder Benachrichtigungen (`alertdialog`) bereitgestellt.

3.  Prüfen, ob nach Korrektur der Eingaben und erneutem Abschicken des Formulars zuvor angezeigte Fehlermeldungen verschwinden.

### 3\. Hinweise

-   Wenn serverseitig eine Fehlermeldung auf neuer Seite ausgegeben wird, wird diese wie ein Seitenzustand unter der Ausgangsseite mitgeprüft. Geprüft wird auch die Erfüllung anderer relevanter Prüfkriterien.
-   Wenn Formulare keine Fehlermeldungen erzeugen, ist dies nicht negativ zu bewerten.
-   Die Verknüpfung von Fehlermeldungen mit `aria-errormessage` (siehe [WAI-ARIA 1.1 Spec](https://www.w3.org/TR/wai-aria-1.1/#aria-errormessage)) ist bislang noch nicht ausreichend von Browsern unterstützt, um Fehlermeldungen ausreichend zugänglich für Screenreader-Nutzende zu verknüpfen.

### 4\. Bewertung

#### Nicht voll erfüllt

-   Die Fehlermeldung nach Formularüberprüfung benennt Felder mit fehlender oder fehlerhafter Eingabe nicht klar oder verweist nicht deutlich darauf (etwa durch Änderung des dem Feld zugeordneten Labels, semantische Hervorhebung, oder Links).
-   Unspezifische Fehlermeldung, Felder mit Eingabefehlern oder fehlenden Eingaben werden lediglich grafisch hervorgehoben.

#### Nicht erfüllt

-   Die Fehlermeldung gibt keinen Aufschluss darüber, welche Eingabe den Fehler erzeugt hat.
-   Bei fehlerhafter Eingabe wird das Formular neu angezeigt. Bereits gemachte korrekte Eingaben sind gelöscht, die Felder sind wieder leer und müssen erneut ausgefüllt werden. Ausnahme: Das Löschen bereits gemachter Eingaben ist sinnvoll bei sicherheitsrelevanten Daten wie Passwörtern oder Benutzernamen.

## Einordnung des Prüfschritts

### Abgrenzung von anderen Prüfschritten

Ob infolge von Fehleingaben generierte oder eingeblendete Fehlermeldungen an der richtigen Stelle im Quelltext stehen, ist Gegenstand des Prüfschritts 9.1.3.2 "Sinnvolle Reihenfolge".

### Einordnung des Prüfschritts nach WCAG 2.1

#### Guideline

-   [Guideline 3.3 Input Assistance: Help users avoid and correct mistakes.](https://www.w3.org/TR/WCAG21/#input-assistance)

#### Success criteria

-   [3.3.1 Error Identification](https://www.w3.org/TR/WCAG21/#error-identification) (Level A)

#### Techniques

##### General Techniques

-   [G83: Providing text descriptions to identify required fields that were not completed](https://www.w3.org/WAI/WCAG21/Techniques/general/G83.html)
-   [G84: Providing a text description when the user provides information that is not in the list of allowed values](https://www.w3.org/WAI/WCAG21/Techniques/general/G84.html)
-   [G85: Providing a text description when user input falls outside the required format or values](https://www.w3.org/WAI/WCAG21/Techniques/general/G85.html)

##### Scripting Techniques

-   [SCR18: Providing client-side validation and alert](https://www.w3.org/WAI/WCAG21/Techniques/client-side-script/SCR18.html)
-   [SCR32: Providing client-side validation and adding error text via the DOM](https://www.w3.org/WAI/WCAG21/Techniques/client-side-script/SCR32.html)

##### ARIATechniques

-   [ARIA18: Using aria-alertdialog to Identify Errors](https://www.w3.org/WAI/WCAG21/Techniques/aria/ARIA18)
-   [ARIA19: Using ARIA role=alert or Live Regions to Identify Errors](https://www.w3.org/WAI/WCAG21/Techniques/aria/ARIA19)
-   [ARIA21: Using Aria-Invalid to Indicate An Error Field](https://www.w3.org/WAI/WCAG21/Techniques/aria/ARIA21)

## Quellen

### DOM Scripting und WAI ARIA zur Erzeugung von Fehlermeldungen während der Formular-Eingabe

-   Marco’s accessibility blog: [Easy ARIA tip #3: aria-invalid and role "alert"](http://www.marcozehe.de/2008/07/16/easy-aria-tip-3-aria-invalid-and-role-alert/) (Juli 2008, englischer Text)

## Fragen zu diesem Prüfschritt

### Warum wird nicht grundsätzlich bei allen Formularen eine Fehlerüberprüfung verlangt?

Eine Fehlerbehandlung ist oft sinnvoll, aber nicht grundsätzlich bei allen Formularen. Das hängt ab vom Zweck des Formulars und der Art des Angebots. So kann es unter Umständen sinnvoll sein, grundsätzlich alle Eingaben, auch solche mit Fehlern, zu verwerten.

Wenn jedoch irgendwelche Fehlermeldungen generiert werden, müssen diese brauchbar sein. Das wird in diesem Prüfschritt überprüft.
