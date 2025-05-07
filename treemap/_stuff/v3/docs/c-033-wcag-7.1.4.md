# Prüfschritt 7.1.4 Untertitel-Anpassungen

Webanwendungen mit Videos und zuschaltbaren Untertiteln (**closed captions**) müssen Anpassungsmöglichkeiten für die Darstellung der Untertitel bieten.

Anpassungen sind besonders wichtig für Menschen mit Sehbehinderungen oder kognitiven Einschränkungen, um die Lesbarkeit zu verbessern.

Mögliche Anpassungsoptionen:

-   **Schriftgröße** ändern
-   **Schriftart (Font)** anpassen
-   **Vordergrund- und Hintergrundfarbe** verändern
-   **Transparenz des Untertitelbereichs** einstellen

Der Prüfschritt ist auch erfüllt, wenn diese Anpassungen **über Browser- oder Systemeinstellungen** möglich sind.

Fehlen jegliche Anpassungsmöglichkeiten für **closed captions**, ist dieser Prüfschritt nicht erfüllt.

_BITV-Originaltext:_

## Was wird geprüft?

Wenn das Webangebot Videos mit Untertiteln enthält, lassen sich Untertitel anpassen, z.B. hinsichtlich der Schriftgröße.

## Warum wird das geprüft?

Bei Videos mit Untertiteln ist es für Untertitel-Nutzende hilfreich, die visuelle Darstellung der Untertitel anpassen zu können, zum Beispiel, die Schrift größer stellen zu können oder den Kontrast des Texts erhöhen zu können.

## Wie wird geprüft?

### 1\. Anwendbarkeit des Prüfschritts

Der Prüfschritt ist anwendbar, wenn das Webangebot Videos mit Untertiteln enthält und sich die Untertitel zuschalten lassen (closed captions). Auf permanent sichtbare Untertitel, die Teil des Videobildes sind (open captions), ist der Prüfschritt nicht anwendbar.

### 2\. Prüfung

1.  Webangebot öffnen.
2.  Video mit Untertitelung abspielen.
3.  Falls es sich um zuschaltbare Untertitel handelt: Prüfen, ob es Einstellungsmöglichkeiten für die Darstellung der Untertitel gibt, etwa, um Schriftgröße, Schriftart (Font), Vorder- und Hintergrundfarbe, oder Transparenz des Untertitel-Bereichs anpassen zu können.

Hinweise zu diesem Prüfschritt können Sie auf GitHub [in einem Issue hinterlassen](https://github.com/BIK-BITV/BIK-Web-Test/issues).

### 3\. Hinweise

-   Art und Umfang der Anpassungsmöglichkeiten sind nicht normativ festgelegt. Die Norm nennt beispielhaft Hinter- und Vordergrundfarbe der Untertitel, Schriftart, Größe, Transparenz des Untertitel-Bereichs und Kontur der Schrift.
-   Der Prüfschritt ist auch erfüllt, wenn sich die Darstellung der Untertitel nicht über Einstellungen des Video-Players, sondern durch browserseitige oder systemseitige Einstellungen anpassen lässt (wenn also etwa die Vergrößerung der Schriftgröße oder angepasste Farb-Schemata in den Browser-Einstellungen sich auf die Darstellung der Untertitel auswirken).

### 4\. Bewertung

#### Nicht erfüllt:

-   Bei zuschaltbaren Untertiteln (closed captions) gibt es keinerlei Anpassungsmöglichkeiten für Position, Textgröße, Text-Vorder- und Hintergrundfarbe, Textstil oder Text-Font.

## Quellen

-   Zurzeit keine Quellen.

## Einordnung des Prüfschritts

### Einordnung des Prüfschritts nach EN 301 549 v.3.2.1

#### 7.1.4 Captions characteristics

> Where ICT displays captions, it shall provide a way for the user to adapt the displayed characteristics of captions to their individual requirements, except where the captions are displayed as unmodifiable characters.
>
> NOTE 1: Defining the background and foreground colour of subtitles, font type, size opacity of the background box of subtitles, and the contour or border of the fonts can contribute to meeting this requirement.
>
> NOTE 2: Subtitles that are bitmap images are examples of unmodifiable characters.
