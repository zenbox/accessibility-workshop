# Prüfschritt 7.1.2 Synchrone Untertitel

Webanwendungen mit Videos müssen sicherstellen, dass **Untertitel und Ton synchron** wiedergegeben werden.

Die Untertitel müssen innerhalb von **100 Millisekunden** zum Ton passen, damit sie für Nutzer\*innen verständlich sind.

Mögliche technische Anforderungen:

-   **Zeitstempel in der Untertitel-Datei (VTT/SRT) korrekt setzen**
-   **Videoplayer muss Untertitel in Echtzeit passend anzeigen**
-   **Prüfung durch Testabspielung im Browser und Quellcode-Inspektion**

Asynchrone Untertitel erschweren die Verständlichkeit, insbesondere für Menschen mit Hörbehinderungen. Eine präzise Synchronisierung sorgt für eine barrierefreie Nutzung.

_BITV-Originaltext:_

## Was wird geprüft?

Sind Videos mit synchroner Bild- und Tonspur vorhanden, ist gewährleistet, dass der Videoplayer Untertitel und Ton synchron darstellt.

Das bedeutet für Untertitel aufgezeichneter Videos: Die Anzeige des Untertitels weicht nicht mehr als 100ms vom Zeitstempel der Untertitel-Datei ab. Dies bezieht sich theoretisch auch auf Live-Untertitel. Hier liegt jedoch naturgemäß einer Verzögerung durch die Konvertierung von gesprochener Sprache in Text vor, besonders, wenn die Konvertierung nicht automatisch, sondern durch Menschen erfolgt.

## Warum wird das geprüft?

Die [Untertitel-Standards](https://www.ndr.de/fernsehen/barrierefreie_angebote/untertitel/Untertitel-Standards,untertitelstandards102.html) fordern für eine Untertitelung "Synchronität". Das bedeutet, dass die Einblendung zeitgleich mit dem Bild/Ton und möglichst lippensynchron erfolgen soll. Hintergrund ist, dass Menschen mit Höreinschränkungen neben der Untertitelung auch auf das Mundbild achten. Außerdem leidet die Gesamtverständlichkeit, wenn Bild/Ton und Untertitel nicht synchron sind.

## Wie wird geprüft?

### 1\. Anwendbarkeit des Prüfschritts

Der Prüfschritt ist anwendbar, wenn auf der Webseite aufgezeichnete Videos mit synchroner Bild- und Tonspur sowie zuschaltbare Untertitel (closed captions) vorhanden sind.

### 2\. Prüfung

#### 2.1 Prüfung von Untertiteln eines aufgezeichneten Videos:

1.  Das Video in dem auf der Webseite eingebundenen Player abspielen.
2.  Prüfen, ob die Untertitel synchron zum Ton angezeigt werden.
3.  Werden Untertitel nicht synchron angezeigt, kann das an den technischen Möglichkeiten des Players oder an fehlerhaften Zeitstempel in der Untertitel-Datei liegen.
4.  Um festzustellen, ob die Ursache beim Player liegt oder an der Untertitel-Datei, können die Zeitstempel der Untertitel-Datei stichprobenartig geprüft werden.

    -   Dazu im Inspektor des Browsers das `track`\-Element suchen. Die Untertitel-Datei ist als .vtt oder .srt-Datei über das `track`\-Element eingebunden.
    -   Mit der Maus über den Dateipfad fahren. Mit der rechten Maustaste das Kontextmenü öffnen und mit Hilfe der Funktion "Link in neuem Tab anzeigen" die Untertitel anzeigen.
    -   Alternativ den Pfad kopieren. Den Pfad im Browser hinter dem / der Top-Level-Domain eingeben.

5.  Prüfen, ob die Zeitstempel korrekt sind.
6.  Wenn die Zeitcodierung in der Track-Datei Fehler aufweist, ist davon auszugehen, dass der Fehler nicht beim Player liegt. Dieser Prüfschritt ist erfüllt.

### 3\. Hinweise

Wenn Fehler in der Zeitcodierung der Track-Datei gefunden werden, ist davon auszugehen, dass der Fehler nicht beim Player liegt. Es ist es jedoch nicht ganz auszuschließen, dass eine nicht vorhandene Synchronität an der Untertitel-Datei _und_ am Player liegt.

Es ist sinnvoll, stichprobenartig zu prüfen, ob es im Webangebot Videos gibt, bei denen die Untertitel synchron zum Ton dargestellt werden. Wenn dies der Fall ist, ist das ein Hinweis, dass der Player Untertitel prinzipiell korrekt darstellt. Der Prüfschritt ist damit erfüllt, Probleme mit der Synchronität sind dann höchstwahrscheinlich bei den Inhalten zu suchen und nicht im eingebundenen Player.

Hinweise zu diesem Prüfschritt können Sie auf GitHub [in einem Issue hinterlassen](https://github.com/BIK-BITV/BIK-Web-Test/issues).

### 4\. Bewertungen

#### Nicht erfüllt:

-   Bild/Ton und Untertitel sind nicht synchron.

## Quellen

-   Zurzeit keine Quellen.

## Einordnung des Prüfschritts

### Abgrenzung zu anderen Prüfschritten

Inhalte, Qualität und Angemessenheit der Untertitel werden in Prüfschritt 9.1.2.2 "Aufgezeichnete Videos mit Untertiteln" geprüft. In diesem Prüfschritt wird geprüft, ob der eingebundene Player grundsätzlich in der Lage ist, Videos mit Untertiteln synchron darzustellen.

### Einordnung des Prüfschritts nach EN 301 549 V3.2.1

#### 7.1.2 Captioning synchronization

> Where ICT displays captions, the mechanism to display captions shall preserve synchronization between the audio and the corresponding captions as follows:
>
> -   Captions in recorded material: within 100 ms of the time stamp of the caption
> -   Live captions: within 100 ms of the availability of the caption to the player.
