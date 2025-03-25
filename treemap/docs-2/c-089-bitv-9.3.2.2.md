# Prüfschritt 9.3.2.2 Keine unerwartete Kontextänderung bei Eingabe

-   Formulareingaben dürfen keine unerwarteten Kontextänderungen auslösen
-   Automatisches Absenden oder das Öffnen neuer Fenster bei Eingabeänderungen ist problematisch
-   Dynamische Änderungen müssen nachvollziehbar und unterhalb des auslösenden Elements erfolgen
-   Der Fokus darf sich durch Änderungen nicht unerwartet verschieben
-   Test: Formularelemente durchgehen und prüfen, ob Eingaben ohne Vorwarnung den Kontext ändern

_BITV-Originaltext:_

## Was wird geprüft?

Eingaben von Nutzenden auf Formularen sollen nicht zu unerwarteten Kontext-Änderungen führen. Alle Kontextänderungen müssen unterhalb des auslösenden Elements geschehen und sollen klar nachvollziehbar sein, der Fokus soll nicht versetzt werden.

## Warum wird das geprüft?

Unerwartete und unangekündigte Kontextänderungen bei einer Auswahl in Formularen können die Orientierung von Nutzern beeinträchtigen (z.B. die Auswahl einer Checkbox oder ein Radio-Button ruft eine neue Seite auf, eine Auswahlliste ohne Submit-Button reagiert auf `onchange`. Kontextänderungen auf der Seite selbst können Nutzende ablenken und verwirren oder auch unbemerkt bleiben und dadurch für Verwirrung sorgen (plötzlich sind Inhalte verändert). Sie sollten deshalb erwartet und klar nachvollziehbar sein.

Wenn Kontextänderungen auf der selben Seite nicht **unterhalb** des Elements stattfinden, das sie auslöst, werden sie von blinden Nutzenden häufig nicht wahrgenommen.

## Wie wird geprüft?

### 1\. Anwendbarkeit des Prüfschritts

Der Prüfschritt ist anwendbar, wenn die Seite Formularelemente enthält.

### 2\. Prüfung

1.  Seite im Browser (Chrome oder Firefox) aufrufen.
2.  Formularelemente (Checkboxes, Radio Buttons, Auswahllisten) ausprobieren. Werden unerwartete und nicht angekündigte Kontextänderungen erzeugt?
3.  Überprüfen, ob Inhaltsänderungen hervorgerufen werden (etwa Einblendungen zusätzlicher Formularfelder).
4.  Sind die Inhaltsänderungen begrenzt und gut nachvollziehbar oder werden **vor** dem auslösenden Element angekündigt bzw. erklärt?
5.  Prüfen, ob Inhaltsänderungen **unterhalb** des Elements, das sie auslöst, hervorgerufen werden.
6.  Prüfen, ob durch Formulareingaben hervorgerufene Kontextänderungen (etwa dynamisch eingeblendete Elemente) den aktuellen Fokus versetzen.

### 3\. Hinweise

Fehlermeldungen, die über die JavaScript-Funktion `alert()` ausgegeben werden, gelten nicht als Pop-Ups im Sinne des Prüfschritts. Sie öffnen sich als Antwort auf Eingaben von Nutzenden und sie sind modal, in Hinblick auf die Orientierung daher unproblematisch.

Änderungen, die über Skripte und _ARIA Live Regions_ vorgenommen werden, etwa die automatische Einblendung von Vorschlägen unterhalb des Texteingabefelds einer Such-Funktion, sollen nicht den aktuellen Fokus versetzen.

Zur Abgrenzung von Kontextänderungen und Inhaltsänderungen:

-   Klare Kontextänderungen (_changes of context_) sind laut WCAG 2.1 etwa Sprünge zu anderen Seiten und das Öffnen neuer Fenster, aber auch das dynamische Laden von neuen Inhalten auf der selben Seite, wenn diese Inhalte wie eine neue Seite _wirken_ oder Inhalte in stark veränderter Anordnung erscheinen. Auch das Auslösen von Sprunglinks zu Ankern auf derselben Seite ist als Kontextänderung zu betrachten.
-   Davon abgrenzen muss man bloße Inhaltsänderungen (in den WCAG 2.1: _changes of content_). Diese liegen vor, wenn etwa die Auswahl in einer Auswahlliste (`select`) die Inhalte einer darunter befindlichen Auswahlliste dynamisch aktualisiert (etwa: die Wahl eines Kontinents aktualisiert eine Auswahlliste mit Ländern). Auch das Ausklappen zusätzlicher Formularbereiche _unterhalb_ des auslösenden Elements kann als Inhaltsänderung gelten, wenn Fokus und Scrollstatus der Seite unverändert bleiben.

Ob Änderungen _unerwartet_ sind oder nicht, lässt sich nur aus dem Gesamtkontext heraus bestimmen.

Vergleiche: WCAG 2.1, Appendix A: Glossary: [changes of context](http://www.w3.org/TR/WCAG20/#context-changedef)

### 4\. Bewertung

#### Nicht voll erfüllt

-   Die Interaktion mit Formularelementen führt zu unerwarteten und nicht angekündigten Kontextänderungen.

#### Nicht erfüllt

-   Formulare werden automatisch abgeschickt, wenn der Fokus das Formular verlässt.
-   Das Ändern des Status einer Checkbox oder eines Radio-Buttons löst automatisch eine unerwartete Kontextänderung aus (öffnet etwa ein neues Fenster).

## Einordnung des Prüfschritts

### Abgrenzung von anderen Prüfschritten

Die Verwendung von Submit-Buttons, die in den Techniken [G80](https://www.w3.org/WAI/WCAG21/Techniques/general/G80.html) und [H32](https://www.w3.org/WAI/WCAG21/Techniques/html/H32.html) dem Success Criterion [3.2.2 On Input \[no automatic change of context](https://www.w3.org/TR/WCAG21/#on-input)\] zugeordnet ist, wird nur indirekt im Prüfschritt 9.2.1.1 "Ohne Maus nutzbar" geprüft.

### Einordnung des Prüfschritts nach WCAG 2.1

#### Guideline

-   [Guideline 3.2 Predictable: Make Web pages appear and operate in predictable ways](https://www.w3.org/TR/WCAG21/#predictable)

#### Success criterion

-   [3.2.2 On Input](https://www.w3.org/TR/WCAG21/#on-input) (Level A)

#### Techniques

##### General Techniques

-   [G80: Providing a submit button to initiate a change of context using a technology-specific technique listed below](https://www.w3.org/WAI/WCAG21/Techniques/general/G80.html)  
    _Hinweis:_ Die Technik G80 ist SC 3.2.2 zugeordnet, wird aber nur indirekt geprüft.
-   [G13: Describing what will happen before a change to a form control that causes a change of context to occur is made](https://www.w3.org/WAI/WCAG21/Techniques/general/G13.html)

##### HTML Techniques

-   [H32: Providing submit buttons](https://www.w3.org/WAI/WCAG21/Techniques/html/H32.html)  
    _Hinweis:_ Die Technik H32 ist SC 3.2.2 zugeordnet, wird aber nur indirekt geprüft.
-   [H84: Using a button with a select element to perform an action](https://www.w3.org/WAI/WCAG21/Techniques/html/H84.html)

#### Failures

-   [F36: Failure of Success Criterion 3.2.2 due to automatically submitting a form and presenting new content without prior warning when the last field in the form is given a value](https://www.w3.org/WAI/WCAG21/Techniques/failures/F36.html)
-   [F37: Failure of Success Criterion 3.2.2 due to launching a new window without prior warning when the status of a radio button, check box or select list is changed](https://www.w3.org/WAI/WCAG21/Techniques/failures/F37.html)
