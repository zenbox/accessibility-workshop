# Prüfschritt 9.3.2.1 Keine unerwartete Kontextänderung bei Fokus

-   Der Fokus auf einem Element darf keine unerwartete Änderung auslösen
-   Automatische Formular-Übermittlungen oder Pop-ups beim Fokuserhalt sind problematisch
-   Neue Fenster dürfen nicht direkt beim Laden der Seite geöffnet werden
-   Skriptgesteuerte modale Dialoge oder Tooltips gelten nicht als Kontextänderung
-   Test: Mit Tab durch die interaktiven Elemente navigieren und prüfen, ob sich der Kontext verändert

_BITV-Originaltext:_

## Was wrd geprüft?

Wenn irgendeine Komponente der Seite den Fokus erhält, soll dies nicht zu einer unerwarteten Kontextänderung führen.

## Warum wird das geprüft?

Unerwartete und unangekündigte Kontextänderungen bei Fokussierung einer Komponente (z. B. das automatische Abschicken von Formularen), kann die Orientierung von Nutzenden beeinträchtigen. Kontextänderungen auf der Seite selbst können Nutzende ablenken und verwirren oder auch unbemerkt bleiben und dadurch für Verwirrung sorgen. Sie sollten deshalb erwartet und klar nachvollziehbar sein.

Das Öffnen neuer Fenster bei Fokussierung einer Komponente oder beim Laden einer Seite kann die Orientierung der Nutzenden ebenfalls beeinträchtigen. Das gilt ganz besonders für blinde und sehbehinderte Nutzende. Sie bemerken möglicherweise nicht, dass sich der Kontext geändert hat. Wenn das neue Fenster den Fokus erhält, funktioniert der Zurück-Button des Browsers nicht mehr. Der Überblick kann verloren gehen, möglicherweise wird dann versehentlich das falsche Fenster (mit der Historie der bislang besuchten Seiten) geschlossen.

## Wie wird geprüft?

### 1\. Anwendbarkeit des Prüfschritts

Der Prüfschritt ist anwendbar, wenn der Webauftritt interaktive Elemente enthält.

### 2\. Prüfung

1.  Seite im [Firefox](https://www.bitvtest.de/bitv_test/das_testverfahren_im_detail/werkzeugliste.html#firefox) aufrufen. Das Laden der Seite sollte kein neues Fenster öffnen.
2.  Mit der Tabulatortaste die Links und Formularelemente durchgehen.
3.  Der Fokuserhalt soll keine automatischen Kontextänderungen (etwa Pop-up-Fenster oder automatisches Abschicken von Formularen) auslösen.

### 3\. Hinweise

Der Prüfschritt bezieht sich nur auf neue Browserfenster, nicht auf skriptgesteuerte Seiten-Elemente, die den Inhalt überlagern (Stichwort modaler Dialog).

Das Öffnen von Custom Tooltips, also nicht modalen Fenstern, die sich beim Weitertabben oder Mausklick selbständig schließen, gilt dabei nicht als Kontextänderung.

## Einordnung des Prüfschritts

### Einordnung des Prüfschritts nach WCAG 2.1

#### Guideline

-   [Guideline 3.2 Predictable: Make Web pages appear and operate in predictable ways.](https://www.w3.org/TR/WCAG21/#predictable)

#### Success criterion

-   [3.2.1 On Focus](https://www.w3.org/TR/WCAG21/#on-focus) (Level A)

#### Techniques

##### General Techniques

-   [G107: Using "activate" rather than "focus" as a trigger for changes of context](https://www.w3.org/WAI/WCAG21/Techniques/general/G107.html)

##### Advisory Techniques

-   [G200: Opening new windows and tabs from a link only when necessary](https://www.w3.org/WAI/WCAG21/Techniques/general/G200.html)
-   [G201: Giving users advanced warning when opening a new window](https://www.w3.org/WAI/WCAG21/Techniques/general/G201.html)

##### Failures

-   [F52: Failure of Success Criterion 3.2.1 due to opening a new window as soon as a new page is loaded](https://www.w3.org/WAI/WCAG21/Techniques/failures/F52.html)

## Fragen zu diesem Prüfschritt

### Der Prüfschritt bezieht sich nur auf das Öffnen neuer Fenster beim Laden der Seite, erlaubt die BITV 2.0 jetzt das unangekündigte Öffnen von neuen Fenstern über Links?

Die WCAG empfehlen in den _Advisory Techniques_ [G200](https://www.w3.org/WAI/WCAG21/Techniques/general/G200.html) und [G201](https://www.w3.org/WAI/WCAG21/Techniques/general/G201.html), das Öffnen neuer Fenster auf Fälle zu beschränken, in denen das aus einer Zugänglichkeitsperspektive sinnvoll ist und Benutzer zuvor über das Öffnen eines neuen Fensters zu informieren (etwa als Teil des Links, der das Fenster öffnet).

Das unangekündigte Öffnen neuer Fenster bei der Aktivierung von Links wird jedoch grundsätzlich akzeptiert. Dies ist dadurch gerechtfertigt, das moderne Benutzeragenten Einstellungsmöglichkeiten für den Umgang mit automatisch öffnenden Fenstern bieten. In den meisten aktuellen Browser-Versionen lässt sich inzwischen festlegen, ob neue Fenster also zusätzliches Browser-Fenster oder in einem Tab (Registrierkarte) geöffnet werden sollen oder ob unangekündigte Fenster grundsätzlich unterdrückt werden sollen (Stichwort Popup-Blocker). Einige Browser (Firefox) erlauben auch die Festlegung, ob neue Tabs im Vordergrund geöffnet werden sollen (also den Fokus erhalten sollen) oder nicht.
