# Prüfschritt 7.2.3 Erhaltung von Audiodeskription

Webanwendungen, die **Videos mit Audiodeskription** übertragen, konvertieren oder aufnehmen, müssen sicherstellen, dass die **Audiodeskription erhalten bleibt** und weiterhin **synchron zu Bild und Ton** abgespielt werden kann.

Die Anforderungen aus **Prüfschritt 7.2.1 (Wiedergabe von Audiodeskription) und 7.2.2 (Synchrone Audiodeskription)** müssen weiterhin erfüllt sein.

Mögliche Prüfmethoden:

-   Nach der **Konvertierung oder Aufnahme** prüfen, ob die Audiodeskription weiterhin vorhanden ist.
-   Sicherstellen, dass die **Audiodeskription abrufbar und zuschaltbar** bleibt.
-   Überprüfen, ob die **Audiodeskription weiterhin synchron zu Bild und Ton** läuft.

Wenn die Audiodeskription **nach der Umwandlung oder Aufnahme nicht mehr verfügbar oder asynchron** ist, ist dieser Prüfschritt nicht erfüllt.

_BITV-Originaltext:_

## Was wird geprüft?

Wenn das Webangebot Videos mit Audiodeskription überträgt, konvertiert oder aufnimmt, bleibt die Audiodeskription nach dem Vorgang erhalten. Sie ist weiterhin zuschaltbar und wird synchron zu Bild und Ton dargestellt. Die Prüfschritte 7.2.1 "Wiedergabe von Audiodeskription" und 7.2.2 "Synchrone Audiodeskription" sind weiterhin erfüllt.

## Warum wird das geprüft?

Wenn das Webangebot Videos mit Audiodeskription überträgt, konvertiert oder aufnimmt, soll die Audiodeskription in gleicher Weise nutzbar sein wie vor dem Vorgang. Dazu gehört, dass sie ausgegeben werden kann und synchron abgespielt wird.

## Wie wird geprüft?

### 1\. Anwendbarkeit des Prüfschritts

Der Prüfschritt ist anwendbar, wenn das Webangebot Videos mit Audiodeskription übertragen, konvertieren oder aufnehmen kann.

### 2\. Prüfung

Wenn das Webangebot Videos mit Audiodeskription konvertiert oder aufnimmt, das Video anschließend in einem konformen Player abspielen:

-   Ist Audiodeskription aus der Quelle weiterhin vorhanden?
-   Lässt sich Audiodeskription abspielen?
-   Ist die Audiodeskription weiterhin synchron zu Bild und Ton?

### 3\. Hinweise

Hinweise zu diesem Prüfschritt können Sie auf GitHub [in einem Issue hinterlassen](https://github.com/BIK-BITV/BIK-Web-Test/issues).

### 4\. Bewertung

#### Nicht erfüllt:

## Einordnung des Prüfschritts

### Abgrenzung zu anderen Prüfschritten

In diesem Prüfschritt wird geprüft, ob es durch die Übertragung, Konvertierung oder Aufnahme zu Problemen hinsichtlich der Ausgabe oder Synchronität von Audiodeskription kommt. In den Prüfschritten 7.2.1 "Wiedergabe von Audiodeskription" und 7.2.2 "Synchrone Audiodeskription" geht es hingegen um Videos, die auf der Webseite bereits vorhanden sind.

### Einordnung des Prüfschritts nach EN 301 549 V3.2.1

#### 7.2.3 Preservation of audio description

> Where ICT transmits, converts, or records video with synchronized audio, it shall preserve audio description data such that it can be played in a manner consistent with clauses 7.2.1 and 7.2.2.
