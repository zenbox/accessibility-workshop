# Prüfschritt 6.5.6 Sprecher-Anzeige für Gebärdensprachen-Kommunikation

Webanwendungen mit Videotelefonie müssen eine **Sprecher-Anzeige für Gebärdensprach-Nutzer** bereitstellen, wenn sie bereits eine Anzeige für Sprechende bieten.

Diese Funktion ermöglicht es allen Teilnehmenden, zu erkennen, **wer gerade Gebärdensprache verwendet**.

Mögliche technische Lösungen:

-   **Manuelle Aktivierung**: Nutzende können angeben, dass sie gerade in Gebärdensprache kommunizieren.
-   **Automatische Erkennung**: Das System erkennt Bewegungen als Gebärdensprache und zeigt die Aktivität entsprechend an.
-   **Visuelle Hervorhebung** des aktiven Gebärdenden, z. B. durch eine Umrandung oder ein Symbol.

Die Prüfung erfolgt durch einen Testanruf zwischen zwei Geräten, bei dem überprüft wird, ob Gebärdensprachaktivität angezeigt wird.

Eine gleichwertige Sprecher-Anzeige für Gebärdensprach-Nutzer stellt sicher, dass sie **gleichberechtigt an der Kommunikation teilnehmen** können.

_BITV-Originaltext:_

## Was wird geprüft?

Wenn ein Webangebot Videotelefonie unterstützt und die Aktivität von Sprechenden angezeigt wird, soll dies auch für Nutzende von Gebärdensprache gewährleistet sein.

## Warum wird das geprüft?

Die Anzeige einer Gebärden-Eingabe ermöglicht Nutzenden die Wahrnehmung, dass jemand gerade Eingaben in Gebärdensprache macht und wer dies tut.

## Wie wird geprüft?

### 1\. Anwendbarkeit des Prüfschritts

Der Prüfschritt ist anwendbar, wenn ein Webangebot Videotelefonie unterstützt und eine Anzeige der Sprechaktivität von Sprechenden bietet.

### 2\. Prüfung

1.  Webangebot auf zwei Geräten im Browser mit abweichenden Nutzenden-Konten starten.
2.  Videotelefonie-Verbindung zwischen den beiden Instanzen des Webangebots herstellen.
3.  Auf dem verbundenen Gerät die Eingabe von Gebärden starten.
4.  Prüfen,

    -   ob das Webangebot die Möglichkeit bietet, den Start einer Gebärden-Eingabe manuell zu signalisieren (d.h. die Anzeige des Aktivitätszustandes zu aktivieren) oder
    -   die Eingabe vom Webangebot automatisch erkannt und in der Folge der Aktivitäts-Zustand automatisch gesetzt wird.

5.  Prüfen, ob die Aktivität der Gebärden-Eingabe wahrnehmbar ist.

### 3\. Hinweise

-   Es spielt für die Überprüfung vermutlich keine Rolle, ob die Eingabe von Gebärdensprachen-Kundigen vorgenommen wird oder nur ähnliche Bewegungen gemacht werden, eine Eingabe also nur simuliert wird.
-   Für den Indikator der Aktivität von Gebärdenden gelten weitere Anforderungen, z.B. bezüglich Grafik-Kontrast.

Für Hinweise zu diesem Prüfschritt können Sie auf GitHub [ein Issue anlegen](https://github.com/BIK-BITV/BIK-Web-Test/issues).

## Quellen

-   Zurzeit keine Quellen.

## Einordnung des Prüfschritts

### Einordnung des Prüfschritts nach EN 301 549 V3.2.1

#### 6.5.6 Speaker identification with video (sign language) communication

> Where ICT provides speaker identification for voice users, it shall provide a means for speaker identification for real-time signing and sign language users once the start of signing has been indicated.
>
> NOTE 1: The speaker ID can be in the same location as for voice users for multiparty calls.
>
> NOTE 2: This mechanism might be triggered manually by a user, or automatically where this is technically achievable.
