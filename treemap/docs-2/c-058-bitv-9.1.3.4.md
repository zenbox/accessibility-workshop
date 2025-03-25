# Prüfschritt 9.1.3.4 Keine Beschränkung der Bildschirmausrichtung

Webinhalte müssen sich an die gewählte Ausrichtung des Bildschirms anpassen und sowohl im Hoch- als auch im Querformat funktionieren. Eine Einschränkung ist nur erlaubt, wenn eine bestimmte Ausrichtung zwingend erforderlich ist, etwa bei einem Klavier-Tutorial oder VR-Inhalten.

Seite prüfen, ob:

-   Inhalte in beiden Ausrichtungen lesbar und nutzbar sind
-   Keine Aufforderung erscheint, das Gerät zu drehen
-   Falls nur eine Ausrichtung genutzt wird, dies für den Inhalt zwingend notwendig ist

-   Nicht erfüllt: Inhalte sind nur in einer Ausrichtung verfügbar, ohne dass dies notwendig ist.

_BITV-Originaltext:_

## Was wird geprüft?

Webinhalte sollen sich an die nutzergewählte Ausrichtung von Ausgabegeräten anpassen. Sie sollten sowohl im Hochformat als auch im Querformat dargestellt werden und nutzbar sein, es sei denn, eine bestimmte Ausrichtung des Inhalts ist unerlässlich.

Beispiele für Inhalte, bei denen die Ausrichtung unerlässlich sein können, sind ein Bankcheck, eine Online-Klavier-Tastatur, Präsentationsfolien für einen Projektor oder Bildschirm, oder Inhalte einer Virtual-Reality (VR) Anwendung bei der es keine binäre Ausrichtung gibt (also nicht: entweder Hoch- oder Querformat).

Es wird nicht verlangt, dass in beiden Ausrichtungen Inhalte und Funktionen in der gleichen Form angeboten werden. So können in einer anderen Orientierung Inhalte ggf. erst nach Aktivierung von Ausklappbereichen oder mittels Links auf andere Seiten angeboten werden.

## Warum wird das geprüft?

Für Menschen mit Behinderung ist es oft besonders wichtig, ein Ausgabegerät (z. B. ein Smartphone) in einer bestimmten Ausrichtung nutzen zu können. Wenn beispielsweise Text stark vergrößert wird, bietet die Verwendung des Querformats oft ein besseres Leseerlebnis, da mehr Wörter in eine Zeile passen.

Außerdem haben einige Benutzer ihre Geräte in einer festen Ausrichtung montiert (z. B. am Arm eines Elektrorollstuhls). Daher sollten Websites und Anwendungen die Darstellung von Inhalten **nicht** auf lediglich eine Ausrichtung einschränken.

## Wie wird geprüft?

### 1\. Anwendbarkeit des Prüfschritts

Die Prüfung des Wechsels der Bildschirmausrichtung sollte immer anwendbar sein, außer es gibt spezielle Inhalte, die nur in einer Ausrichtung funktionieren.

### 2\. Prüfung

1.  Ein aktuelles mobiles Gerät (z.B. ein iPhone oder Android-Handy) zur Prüfung verwenden.
2.  Sicherstellen, dass auf dem mobilen Prüfgerät die Ausrichtung nicht hardware- oder betriebssystemseitig festgestellt bzw. arretiert ist.
3.  Der zu prüfende Inhalt wird im Browser Chrome (Android) oder Safari (iOS) erst in der einen Ausrichtung neu geladen.
4.  Prüfen, ob Inhalte dargestellt werden und nutzbar sind.
5.  Gerät um 90 Grad drehen. Der zu prüfende Inhalt wird in der anderen Ausrichtung neu geladen.
6.  Prüfen, ob Inhalte auch in der anderen Ausrichtung dargestellt werden und nutzbar sind. Treten Beschränkungen beim Wechsel der Ausrichtung auf, etwa Meldungen, welche zur Nutzung der jeweils anderen Ausrichtung auffordern?
7.  Wenn nur eine Ausrichtung unterstützt wird und in der anderen Ausrichtung entweder der Inhalt nicht erscheint, um 90 Grad gedreht erscheint, oder aber eine Meldung ausgegeben wird, dass die andere Ausrichtung zu nutzen ist: Prüfen, ob die unterstützte Ausrichtung für den Inhalt unbedingt erforderlich ist, die Inhalte in der nicht unterstützten Ausrichtung also nicht oder nur schlecht dargestellt werden könnten.

### 3\. Hinweise

Es wird nicht verlangt, dass eine Änderung der Ausrichtung die Inhalte dynamisch anpasst (obwohl dies wünschenswert und bei responsiven Angeboten meist auch der Fall ist). Der Inhalt muss also ggf. in beiden Ausrichtungen jeweils neu geladen werden.

### 4\. Bewertung

#### Prüfschritt erfüllt

-   Beide Ausrichtungen werden unterstützt.
-   Wenn nur eine Ausrichtung angeboten wird, ist sie für den Inhalt unbedingt erforderlich.

## Einordnung des Prüfschritts

### Abgrenzung zu anderen Prüfschritten

Gegenstand dieses Prüfschritts ist die Anpassbarkeit der Bildschirm-Ausrichtung, nicht jedoch Änderungen hinsichtlich der Verfügbarkeit von Inhalten oder Funktionalität, die durch den Wechsel hervorgerufen werden. Dies ist Gegenstand von Prüfschritt 9.1.4.4 "Text auf 200% vergrößerbar" und 9.1.4.10 "Inhalte brechen um".

### Einordnung des Prüfschritts nach WCAG 2.1

#### Guideline

-   [Guideline 1.3 Adaptable: Create content that can be presented in different ways (for example simpler layout) without losing information or structure.](https://www.w3.org/TR/WCAG21/#adaptable)

#### Success criterion

-   [1.3.4 Orientation](https://www.w3.org/TR/WCAG21/#orientation) (Level AA)

#### Sufficient Techniques

-   [G214: Using a control to allow access to content in different orientations which is otherwise restricted](https://www.w3.org/WAI/WCAG21/Techniques/general/G214)

#### Failures

-   [F97: Failure due to locking the orientation to landscape or portrait view](https://www.w3.org/WAI/WCAG21/Techniques/failures/F97.html)
-   [F100: Failure of Success Criterion 1.3.4 due to showing a message asking to reorient device](https://www.w3.org/WAI/WCAG21/Techniques/failures/F100)

## Quellen

-   [Understanding Success Criterion 1.3.4: Orientation](https://www.w3.org/WAI/WCAG21/Understanding/orientation.html) (zur Zeit nur auf Englisch verfügbar)
