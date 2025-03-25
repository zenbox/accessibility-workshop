# Prüfschritt 7.2.1 Wiedergabe von Audiodeskription

Webanwendungen mit Videos müssen eine **Wiedergabeoption für Audiodeskription** bereitstellen, wenn eine alternative Version mit Audiodeskription verfügbar ist.

Audiodeskription ist wichtig für blinde und sehbehinderte Menschen, um visuelle Inhalte durch gesprochene Beschreibungen zugänglich zu machen.

Mögliche technische Lösungen:

-   **Bedienelement im Videoplayer**, um Audiodeskription ein- oder auszuschalten.
-   **Auswahl einer alternativen Tonspur**, die Audiodeskription enthält.
-   **Bereitstellung eines separaten Videos** mit integrierter Audiodeskription.

Der Prüfschritt ist erfüllt, wenn eine **einfache und zugängliche Möglichkeit** zur Aktivierung der Audiodeskription vorhanden ist. Fehlt diese Option im Player, ist der Prüfschritt nicht erfüllt.

_BITV-Originaltext:_

## Was wird geprüft?

Wenn Videos mit synchroner Bild- und Tonspur vorhanden sind und eine alternative Version mit Audiodeskription verfügbar ist, gibt es einen Mechanismus für die Auswahl und Wiedergabe der verfügbaren Audiodeskription.

Für die Auswahl der Version mit Audiodeskription muss der eingesetzte Player ein entsprechendes AD-Bedienelement haben oder die Möglichkeit bieten, eine Tonspur mit Audiodeskription in den Spracheinstellungen zu aktivieren. Alternativ kann eine Version mit Audiodeskription auch im unmittelbaren Kontext des Players angeboten werden.

## Warum wird das geprüft?

Werden für visuelle Inhalte eines Videos Beschreibungen dieser visuellen Inhalte in einer Version mit Audiodeskription angeboten, soll sich diese Version auswählen bzw. zuschalten lassen.

## Wie wird geprüft?

### 1\. Anwendbarkeit des Prüfschritts

Der Prüfschritt ist anwendbar, wenn auf der Webseite ein oder mehrere aufgezeichnete Videos mit synchroner Bild- und Tonspur vorhanden sind und für diese Videos Alternativen mit Audiodeskription bereitstehen.

### 2\. Prüfung

1.  Das Video wird im auf der Website eingebundenen Player abgespielt.
2.  Prüfen, ob der Player ein Bedienelement anbietet, dass das Ein- und Ausschalten von Audiodeskription ermöglicht.
3.  Sollte es keine Schaltfläche für Audiodeskription geben, prüfen, ob aus einer von mehreren Tonspuren Audiodeskription ausgewählt werden kann.

### 3\. Hinweise

-   Weder das Laden eines zweiten Videos mit Audiodeskription (bei Aktivierung eines AD-Buttons), noch die Bereitstellung von Audiodeskription mit Hilfe eines zweiten Videos über einen zweiten Player wird negativ bewertet.
-   Wenn alle wichtigen Informationen der Bildsequenz bereits über die Audiospur vermittelt werden, ist keine Audiodeskription und damit auch kein AD-Button erforderlich.
-   Die Anforderung 7.2.1 erlaubt zwar die Auswahl der Audiodeskription aus einer von mehreren Tonspuren. Anforderung 7.3 verlangt jedoch, dass sich die Bedienelemente zur Aktivierung der Audiodeskription auf der gleichen Interaktionsebene wie die Bedienelemente zur Wiedergabekontrolle (z.B. Abspielen, Pause, Lautstärke etc.) befinden.
-   Wenn 7.3 "Bedienelemente für Untertitel und Audiodeskription" erfüllt ist, ist 7.2.1 "Wiedergabe von Audiodeskription" (dieser Prüfschritt) ebenfalls erfüllt.

### 4\. Bewertung

#### Nicht erfüllt:

-   Der Videoplayer bietet keine Möglichkeit, Audiodeskription zuzuschalten.

## Quellen

-   Zurzeit keine Quellen.

## Einordnung des Prüfschritts

### Abgrenzung zu anderen Prüfschritten

Dieser Prüfschritt fordert, dass in Fällen, wo für Videos Versionen mit Audiodeskription bereit gestellt werden, Bedienelemente zum Ein- und Ausschalten der Audiodeskription angeboten werden. In Prüfschritt 9.1.2.5 "Audiodeskription für Videos" wird hingegen geprüft, ob für Inhalte eines Videos, die nur über Bilder vermittelt werden, eine Audiodeskription vorhanden ist. Es geht dort um die inhaltliche Beurteilung.

Wird 9.1.2.5 negativ bewertet (eine notwendige Audiodeskription ist nicht vorhanden), ist dieser Prüfschritt nicht anwendbar. 7.2.1 ist nur anwendbar, wenn eine Audiodeskription angeboten wird.

### Einordnung des Prüfschritts nach EN 301 549 V3.2.1

#### 7.2.1 Audio description playback

> Where ICT displays video with synchronized audio, it shall provide a mechanism to select and play available audio description to the default audio channel.
>
> Where video technologies do not have explicit and separate mechanisms for audio description, an ICT is deemed to satisfy this requirement if the ICT enables the user to select and play several audio tracks.
>
> NOTE 1: In such cases, the video content can include the audio description as one of the available audio tracks.
>
> NOTE 2: Audio descriptions in digital media sometimes include information to allow descriptions that are longer than the gaps between dialogue. Support in digital media players for this "extended audio description" feature is useful, especially for digital media that is viewed personally.
