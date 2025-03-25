# Prüfschritt 6.5.5 Visuelle Anzeige von Audio-Aktivität

Webanwendungen mit Videotelefonie müssen eine **visuelle Anzeige der Audio-Aktivität** bereitstellen, damit gehörlose Menschen erkennen können, wenn jemand spricht und wer spricht.

Ein visueller Indikator hilft dabei, Sprachaktivität wahrzunehmen, auch ohne Ton.

Mögliche technische Lösungen:

-   **Blinkendes Icon oder LED** zur Anzeige von Sprachaktivität.
-   **Visuelle Animationen**, die auf Ton reagieren.
-   **Farbliche Hervorhebung des aktiven Sprechers** im Videobild.

Prüfung erfolgt durch einen Testanruf auf zwei Geräten, bei dem überprüft wird, ob Sprachaktivität visuell signalisiert wird.

Ein gut sichtbarer Indikator stellt sicher, dass auch Menschen mit Hörbehinderungen aktiv an der Kommunikation teilnehmen können.

_BITV-Originaltext:_

## Was wird geprüft?

Wenn das Webangebot Videotelefonie unterstützt, soll Audio-Aktivität visuell angezeigt werden.

## Warum wird das geprüft?

Die Anzeige der Audio-Aktivität ermöglicht gehörlosen Nutzenden die Wahrnehmung, dass jemand spricht und wer spricht.

## Wie wird geprüft?

### Anwendbarkeit des Prüfschritts

Der Prüfschritt ist anwendbar, wenn das Webangebot Videotelefonie mit Sprachübertragung unterstützt.

### Prüfung

1.  Webangebot auf zwei verschiedenen Geräten im Browser mit abweichenden Nutzenden-Konten starten.
2.  Videotelefonie-Verbindung zwischen den beiden Instanzen des Webangebots herstellen.
3.  Auf dem verbundenen Gerät Sprache eingeben und auf dem Prüfgerät überprüfen, ob die Spracheingabe visuell wahrnehmbar ist.

### Hinweise

Für den Indikator der Sprachaktivität gelten weitere Anforderungen, z.B. bezüglich Grafik-Kontrast.

Der visuelle Indikator der Audio-Aktivität kann ein einfacher visueller Punkt, eine LED oder eine andere Art von Ein- / Aus-Anzeige sein, die flackert.

Für Hinweise zu diesem Prüfschritt können Sie auf GitHub [ein Issue anlegen](https://github.com/BIK-BITV/BIK-App-Test/issues).

## Quellen

## Einordnung des Prüfschritts

### Einordnung des Prüfschritts nach EN 301 549 V3.2.1

#### 6.5.5 Visual indicator of audio with video

> Where ICT provides two-way voice communication, and includes real-time video functionality, the ICT shall provide a real-time visual indicator of audio activity.
>
> NOTE 1: The visual indicator may be a simple visual dot or LED, or other type of on/off indicator, that flickers to reflect audio activity.
>
> NOTE 2: Without this indication a person who lacks the ability to hear does not know when someone is talking.
