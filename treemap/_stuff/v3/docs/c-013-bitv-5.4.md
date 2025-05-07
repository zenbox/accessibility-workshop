# Prüfschritt 5.4 Erhaltung von Barrierefreiheitsinformationen bei Konvertierung

Der Prüfschritt 5.4 stellt sicher, dass bei der Konvertierung von Dokumenten in andere Formate **alle Barrierefreiheitsinformationen erhalten bleiben**, wenn das Zielformat diese unterstützt.

-   Barrierefreie Inhalte wie **Überschriften, Links oder Untertitel** sollen beim Umwandeln erhalten bleiben.
-   Falls das neue Format diese Informationen grundsätzlich speichern kann, dürfen sie nicht durch die Konvertierung verloren gehen.

Menschen, die auf Barrierefreiheitsfunktionen angewiesen sind, dürfen durch eine Formatänderung **keine wichtigen Inhalte verlieren**. Eine fehlerhafte Konvertierung könnte z. B. dazu führen, dass Bildschirmleseprogramme Inhalte nicht mehr richtig erkennen.

_BITV-Originaltext:_

## Was wird geprüft?

Wenn die Webseite Dokumente in andere Formate konvertiert, sollen vorhandene Barrierefreiheits-Informationen im Zielformat übernommen werden, wenn das Zielformat diese Informationen grundsätzlich unterstützt.

## Warum wird das geprüft?

Wenn die Webseite Konvertierungsfunktionen anbietet, sollen Barrierefreiheitsinformationen im Ausgangsformat nicht unnötigerweise im Zielformat verloren gehen. Unnötig ist der Verlust von Barrierefreiheitsinformationen dann, wenn das Zielformat prinzipiell die Aufnahme der Barrierefreiheitsinformation unterstützt, durch die Konvertierungsfunktion jedoch nicht genutzt wird. Beispielsweise unterstützen HTML- und PDF-Dateien die Auszeichnung von Überschriften, eine Konvertierungsfunktion könnte daher problemlos die Überschriftenauszeichnung aus dem HTML-Quelltext für PDF adaptieren.

Hinzunehmen ist der Verlust von Barrierefreiheitsinformationen nur dann, wenn das Zielformat keine Unterstützung für die im Ausgangsformat genutzte Informationsart anbietet.

## Wie wird geprüft?

### 1\. Anwendbarkeit des Prüfschritts

Der Prüfschritt ist grundsätzlich anwendbar, wenn die Webseite digitale Formate wie Text, Audio und Video konvertiert. Sind jedoch entweder das Ausgangs- oder das Zielformat der Konvertierung nicht HTML, kann der Prüfschritt nicht in diesem Verfahren allein geprüft werden, denn hier müsste zusätzlich eine Prüfung des abweichenden Formats durchgeführt werden. Hinsichtlich der Bewertung siehe "3. Hinweise".

### 2\. Prüfung

Die Prüfung ist sehr individuell und richtet sich nach den verwendeten Quell- und Zielformaten. Die zusätzliche Prüfung des abweichenden Formats kann nicht im Rahmen dieses Prüfverfahrens durchgeführt werden.

1.  Gegebenenfalls Beispieldokumente mit Barrierefreiheits-Informationen in das Zielformat konvertieren.
2.  Sind vom Format grundsätzlich unterstützte Barrierefreiheits-Informationen nach der Konvertierung im Zielformat erhalten geblieben?

### 3\. Hinweise

Da die Prüfung eines Nicht-HTML-Formats nicht mit diesem Prüfverfahren erfolgen kann, muss der Prüfschritt mit "nicht anwendbar" bewertet werden. Es sollte jedoch in einer Anmerkungen darauf hingewiesen werden, dass die Barrierefreiheits-Informationen (z.B. semantische Überschriften, Links oder Untertitel) im Zielformat erhalten bleiben sollen.

### 4\. Bewertung

#### Erfüllt

Das Zielformat enthält alle Barrierefreiheits-Informationen des HTML-Ausgangsformats, die grundsätzlich unterstützt werden.

#### Nicht voll erfüllt

Grundsätzlich vom Zielformat unterstützte Barrierefreiheits-Informationen des HTML-Ausgangsformats gehen bei der Konvertierung verloren.

## Quellen

-   Zurzeit keine Quellen.

## Einordnung des Prüfschritts

### Einordnung des Prüfschritts nach EN 301 549 V3.2.1

#### 5.4 Preservation of accessibility information during conversion

> Where ICT converts information or communication it shall preserve all documented non-proprietary information that is provided for accessibility, to the extent that such information can be contained in or supported by the destination format.
