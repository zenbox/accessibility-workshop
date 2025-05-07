# Prüfschritt 6.5.3 Bildwiederholfrequenz bei Videotelefonie

Webanwendungen mit Videotelefonie müssen eine Bildwiederholfrequenz von **mindestens 20 Bildern pro Sekunde (FPS)** unterstützen. Eine Frequenz von **30 FPS** wird empfohlen, um eine flüssigere Darstellung zu gewährleisten.

Eine hohe Bildwiederholfrequenz ist besonders wichtig für gehörlose Menschen, die auf das Mundbild, Mimik und Gestik angewiesen sind.

Mögliche Prüfmethoden:

-   Überprüfung der technischen Dokumentation auf die unterstützte Bildwiederholfrequenz.
-   Testanruf zwischen zwei Geräten zur visuellen Einschätzung der Flüssigkeit der Videodarstellung.

Eine flüssige Bildübertragung sorgt für eine bessere Verständlichkeit und eine barrierefreie Kommunikation.

_BITV-Originaltext:_

## Was wird geprüft?

Wenn das Web-Angebot Videotelefonie unterstützt, soll sie eine Bildwiederholfrequenz (framerate) von mindestens 20 Bildern pro Sekunde unterstützen. Besser ist eine Bildwiederholfrequenz von 30 Bildern pro Sekunde.

## Warum wird das geprüft?

Eine ausreichende Bildwiederholfrequenz ist besonders wichtig für Menschen mit Hörbehinderungen, die Bildinformationen auswerten, etwa gehörlose Menschen, die das Mundbild von Sprechenden lesen. Auch die unterstützende Wahrnehmung von Mimik und Gestik verlangt eine ausreichende Bildwiederholfrequenz.

## Wie wird geprüft?

### 1\. Anwendbarkeit des Prüfschritts

Der Prüfschritt ist anwendbar, wenn das Web-Angebot Videotelefonie unterstützt.

### 2\. Prüfung

Zur Beurteilung der Konformität mit diesem Prüfschritt müssen derzeit die Angaben des Software-Herstellers mit den eigenen visuellen Eindrücken abgeglichen werden. Für die Prüfung muss das Web-Angebot auf zwei Geräten geöffnet werden.

1.  Die unterstützte Bildwiederholfrequenz der Dokumentation des Web-Angebots entnehmen oder vom Hersteller erfragen. Werden mindestens 20 Bilder pro Sekunde unterstützt?
2.  Web-Angebot auf zwei Geräten öffnen
3.  Videotelefonieverbindung zwischen den Geräten herstellen
4.  Prüfen, ob das Bild flüssig dargestellt wird. Scheint die Angabe des Herstellers über die Bildwiederholfrequenz plausibel?

### 3\. Hinweise

Für die Videotelefonie ist eine Bildwiederholfrequenz von 30 Bildern pro Sekunde empfehlenswert, um eine flüssige Darstellung des Bildes zu gewährleisten.

Eine genaue Methode zur Messung der unterstützten Bildwiederholfrequenz ist noch offen. Hinweise zur Weiterentwicklung des Prüfschritts können Sie auf GitHub [in einem Issue](https://github.com/BIK-BITV/BIK-Web-Test/issues) hinterlassen.

## Quellen

-   Zurzeit keine Quellen.

## Einordnung des Prüfschritts

### Einordnung des Prüfschritts nach EN 301 549 V3.2.1

#### 6.5.3 Framerate

> Where ICT that provides two-way voice communication includes real-time video functionality, the ICT:
>
> -   shall support a frame rate of at least 20 frames per second (FPS)
