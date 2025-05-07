# Prüfschritt 6.5.2 Auflösung bei Videotelefonie

Webanwendungen mit Videotelefonie müssen eine Mindestauflösung von **QVGA (320x240 Pixel)** oder eine gleichwertige Anzahl von **76.800 Bildpunkten** bei anderen Seitenverhältnissen unterstützen.

Ein ausreichendes Videobild ist besonders wichtig für gehörlose Menschen, die auf das Mundbild, Mimik und Gestik angewiesen sind, um Inhalte zu verstehen.

Mögliche Prüfmethoden:

-   Überprüfung der technischen Dokumentation auf eine Mindestauflösung von 320x240 Pixel.
-   Testübertragung zur visuellen Einschätzung der Bildqualität.

Eine klare und hochauflösende Videoübertragung verbessert die Verständlichkeit für alle Nutzenden und sorgt für eine barrierefreie Kommunikation.

_BITV-Originaltext:_

## Was wird geprüft?

Web-Anwendungen mit Videotelefonie-Funktion sollen mindestens die QVGA-Auflösung für die Videoübertragung unterstützen. Üblicherweise entspricht dies 320x240 Pixel. Bei anderen Seitenverhältnissen müssen entsprechend 76.800 Bildpunkte geboten werden.

## Warum wird das geprüft?

Für manche Menschen mit Behinderung ist ein Videobild mit ausreichender Auflösung besonders wichtig - zum Beispiel für gehörlose Menschen, die über das Mundbild von Sprechern die Inhalte verstehen oder durch die zusätzliche Aufnahme von Mundbild, Mimik und Gestik eine simultane Verschriftlichung besser verstehen können.

## Wie wird geprüft?

### 1\. Anwendbarkeit des Prüfschritts

Der Prüfschritt ist anwendbar, wenn die Web-App Videotelefonie unterstützt.

### 2\. Prüfung

1.  Die technische Dokumentation der Web-App konsultieren. Wird mindestens eine QVGA (320x240 Pixel) angegeben?
2.  Testübertragung: Den visuellen Eindruck prüfen. Ist die Angabe in der App-Dokumentation plausibel?

### 3\. Hinweise

Für Hinweise zu diesem Prüfschritt eröffnen Sie gerne [ein Issue auf GitHub](https://github.com/BIK-BITV/BIK-Web-Test/issues).

## Quellen

-   Zurzeit keine Quellen.

## Einordnung des Prüfschritts

### Einordnung des Prüfschritts nach EN 301 549 V3.2.1

#### 6.5.2 Resolution

> Where ICT that provides two-way voice communication includes real-time video functionality, the ICT:
>
> -   shall support at least QVGA resolution
