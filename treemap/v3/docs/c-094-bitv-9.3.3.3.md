# Prüfschritt 9.3.3.3 Hilfe bei Fehlern

_BITV-Originaltext:_

## Was wird geprüft?

Wenn ein Formular Fehlermeldungen erzeugt, müssen diese verständlich sein und Hinweise geben, wie der Fehler zu korrigieren ist.

## Warum wird das geprüft?

Bei Formulareingaben kommt es öfters zu Fehlern: Nutzer verschreiben sich oder überspringen benötigte Eingaben.

Wenn das Angebot Nutzereingaben überprüft, sollen die ausgegebenen Fehlermeldungen hilfreich sein und es den Nutzenden erleichtern, Eingaben zu korrigieren.

## Wie wird geprüft?

### 1\. Anwendbarkeit des Prüfschritts

Der Prüfschritt ist anwendbar, wenn die Seite Formulare enthält, welche bei inkorrektem Ausfüllen Fehlermeldungen erzeugen. Dies kann schon während der Eingabe oder erst nach dem Abschicken des Formulars geschehen.

### 2\. Prüfung

1.  Formular unvollständig oder fehlerhaft ausfüllen, etwa durch das Leerlassen von Pflichtfeldern oder das Eingeben syntaktisch nicht korrekter E-Mail-Adressen.
2.  Falls das Abschicken des Formulars eine Fehlermeldung erzeugt: Prüfen, ob Fehlermeldungen oder Korrekturvorschläge verständlich und sinnvoll sind. Fehlermeldungen oder Korrekturvorschläge können auf verschiedene Weise zur Verfügung gestellt werden, z. B.:

    -   Bei Neuanzeige des Formulars werden am Seitenbeginn Fehler beschrieben.
    -   Korrekturvorschläge werden nahe der betroffenen Eingabefelder angezeigt und mit einer geeigneten ARIA-Technik verknüpft.

### 3\. Hinweise

-   Wenn serverseitig eine Fehlermeldung auf einer neuen Seite ausgegeben wird, wird diese wie ein Seitenzustand unter der Ausgangsseite mitgeprüft. Geprüft wird auch die Erfüllung anderer relevanter Prüfkriterien.
-   Bei komplizierten Formaten, z. B. Datum, hilft eine Angabe, in welcher Weise das Datum eingegeben werden soll (z. B. tt.mm.jjjj), um Fehler zu vermeiden.
-   Wenn Formulare keine Fehlermeldungen erzeugen, ist dies nicht negativ zu bewerten.
-   Hinweise, wie genau der Fehler korrigiert werden kann, sind nicht erforderlich, wenn diese die Sicherheit des Inhalts gefährden würden. Fehlermeldungen von Anmelde- und Passwortfeldern müssen beispielsweise keine spezifischen Hinweise enthalten, da dies die Sicherheit des Anmeldevorgangs beeinträchtigen würden.

### 4\. Bewertung

#### Nicht erfüllt

-   Fehlermeldungen sind unklar oder irreführend.

## Einordnung des Prüfschritts

### Abgrenzung von anderen Prüfschritten

Die Identifizierung und Benennung des Fehlers, ist Gegenstand des Prüfschritts 9.3.3.1 "Fehlererkennung".

### Einordnung des Prüfschritts nach WCAG 2.1

#### Guideline

-   [Guideline 3.3 Input Assistance: Help users avoid and correct mistakes.](https://www.w3.org/WAI/WCAG21/quickref/?showtechniques=334#input-assistance)

#### Success criteria

-   [3.3.3 Error Suggestion](https://www.w3.org/WAI/WCAG21/quickref/?showtechniques=334#error-suggestion) (Level AA)

##### General Techniques

-   [G83: Providing text descriptions to identify required fields that were not completed](https://www.w3.org/WAI/WCAG21/Techniques/general/G83.html)
-   [G84: Providing a text description when the user provides information that is not in the list of allowed values](https://www.w3.org/WAI/WCAG21/Techniques/general/G84.html)
-   [G85: Providing a text description when user input falls outside the required format or values](https://www.w3.org/WAI/WCAG21/Techniques/general/G85.html)
-   [G177: Providing suggested correction text](https://www.w3.org/WAI/WCAG21/Techniques/general/G177.html)

##### Scripting Techniques

-   [SCR18: Providing client-side validation and alert](https://www.w3.org/WAI/WCAG21/Techniques/client-side-script/SCR18.html)
-   [SCR32: Providing client-side validation and adding error text via the DOM](https://www.w3.org/WAI/WCAG21/Techniques/client-side-script/SCR32.html)

##### ARIATechniques

-   [ARIA2: Identifying a required field with the aria-required property](https://www.w3.org/WAI/WCAG21/Techniques/aria/ARIA2.html)
-   [ARIA18: Using aria-alertdialog to Identify Errors](https://www.w3.org/WAI/WCAG21/Techniques/aria/ARIA18.html)
