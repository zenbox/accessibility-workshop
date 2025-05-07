# Prüfschritt 9.2.4.2 Sinnvolle Dokumenttitel

Der Titel einer Webseite sollte den Inhalt der Seite klar benennen und das Webangebot erkennbar machen.

-   Der Titel soll den spezifischen Inhalt der Seite beschreiben
-   Der Titel soll den Namen des Webangebots enthalten
-   Keine typographischen Schmuckelemente wie ,, ~~ ==== verwenden
-   Frames und iframes brauchen einen sinnvollen Titel

_BITV-Originaltext:_

## Was wird geprüft?

Dokumenttitel bezeichnen den Inhalt der individuellen Seiten und das Webangebot. Sie können für die Unterscheidung und Auswahl von Seiten genutzt werden.

## Warum wird das geprüft?

Dokumenttitel vertreten die Seiten, zum Beispiel in Listen mit Bookmarks. Sie sind wichtig für die Navigation und Orientierung in Webangeboten. Wenn das Angebot oder der Inhalt der Seite nicht bezeichnet sind, ist die Orientierung beeinträchtigt.

Typographische Schmuckelemente werden Screenreader-Nutzern unter Umständen vorgelesen und stören dadurch.

## Wie wird geprüft?

### 1\. Anwendbarkeit des Prüfschritts

Der Prüfschritt ist immer anwendbar.

### 2\. Prüfung

1.  Dokumenttitel in der Browserleiste ansehen.
2.  Bezeichnet der Titel den Inhalt der individuellen Seite und ggf. auch das Webangebot? Ist er für die Unterscheidung und Auswahl von Seiten geeignet?

Falls Seiten Frames haben:

1.  Einzelne Frames in neuem Tab oder Fenster öffnen.
2.  Dokumenttitel in der Browserleiste ansehen. Haben die Frame-Seiten sinnvolle Titel, die Zweck oder Inhalt des Frames kennzeichnen?

### 3\. Hinweise

Der Dokumenttitel muss nicht den Pfad von der Startseite zur aktuellen Seite wiedergeben. Ein guter Dokumenttitel "vertritt" die Seite zum Beispiel in einer Bookmarks-Liste. Es ist daher sinnvoll, nicht nur den Inhalt der Seite, sondern auch das Webangebot selbst zu nennen. Die Nennung des Angebots ist in der Regel an zweiter Stelle sinnvoll: Der erste Teil benennt die Seite selbst, der zweite das Angebot und damit den Kontext der Seite.

### 4\. Bewertung

#### Erfüllt

-   Der Dokumenttitel enthält zwei Bestandteile: eine unterscheidende, individuelle Bezeichnung der jeweiligen Seite und eine immer gleiche, allgemeine Bezeichnung des Webauftritts

#### Eher erfüllt

-   Der Dokumenttitel enthält eine unterscheidende, individuelle Bezeichnung der jeweiligen Seite, nennt jedoch nicht das Angebot.

#### Nicht voll erfüllt

-   Die individuelle Bezeichnung der Seite ist nicht sinnvoll, er bezeichnet den Inhalt nicht aussagekräftig.
-   Frame-Seiten haben keine sinnvollen Dokumenttitel
-   Dokumenttitel enthalten typographischen Schmuck (etwa , ~~, ====)

## Einordnung des Prüfschritts

### Einordnung des Prüfschritts nach WCAG 2.1

#### Guideline

-   [Guideline 2.4 Navigable: Provide ways to help users navigate, find content, and determine where they are](https://www.w3.org/WAI/WCAG21/quickref/?showtechniques=241#navigable)

#### Success criteria

-   [2.4.2 Page Titled: Web pages have titles that describe topic or purpose.](https://www.w3.org/WAI/WCAG21/quickref/?showtechniques=241#page-titled) (Level A)

#### Techniques

##### General Techniques

-   [G88: Providing descriptive titles for Web pages](https://www.w3.org/WAI/WCAG21/Techniques/general/G88.html)
-   [G127: Identifying a Web page’s relationship to a larger collection of Web pages](https://www.w3.org/WAI/WCAG21/Techniques/general/G127.html)

##### HTML Techniques

-   [H25: Providing a title using the title element](https://www.w3.org/WAI/WCAG21/Techniques/html/H25.html)
-   [H86: Providing text alternatives for ASCII art, emoticons, and leetspeak](https://www.w3.org/WAI/WCAG21/Techniques/html/H86.html)

#### Failures

-   [F25: Failure of Success Criterion 2.4.2 due to the title of a Web page not identifying the contents](https://www.w3.org/WAI/WCAG21/Techniques/failures/F25.html)

## Quellen

### Bedeutung von Dokumenttiteln nach WCAG 2.1

> **Specific Benefits of Success Criterion 2.4.2:**
>
> -   This criterion benefits all users in allowing users to quickly and easily identify whether the information contained in the Web page is relevant to their needs.
> -   People with visual disabilities will benefit from being able to differentiate content when multiple Web pages are open.
> -   People with cognitive disabilities, limited short-term memory and reading disabilities also benefit from the ability to identify content by its title.
> -   This criterion also benefits people with severe mobility impairments whose mode of operation relies on audio when navigating between Web pages.

( [Page Titled: Understanding SC 2.4.2](https://www.w3.org/WAI/WCAG21/Understanding/page-titled.html))
