# Prüfschritt 9.3.2.3 Konsistente Navigation

Die Navigation muss auf allen Seiten eines Webauftritts konsistent bleiben.

-   Navigationselemente sollen auf allen Seiten in gleicher Anordnung erscheinen
-   Einheitliche Menüs, Breadcrumbs und Direktlinks erleichtern die Orientierung
-   Prüfung: Verschiedene Seiten aufrufen und Navigationselemente vergleichen
-   Abweichungen sind erlaubt, wenn sie sich logisch aus dem Inhalt ergeben (z. B. auf der Startseite)
-   Geskriptete Layer-Navigation sollte sich klar von Seitenwechseln unterscheiden

_BITV-Originaltext:_

## Was wird geprüft?

Navigationsmechanismen sollen innerhalb des Webauftritts einheitlich sein.

## Warum wird das geprüft?

Eine einheitliche Navigation innerhalb des Webauftritts erleichtert das Verständnis, Gesuchtes wird leichter gefunden.

## Wie wird geprüft?

### 1\. Anwendbarkeit des Prüfschritts

Der Prüfschritt ist immer anwendbar

### 2\. Prüfung

#### 2.1 Ist die Navigation einheitlich?

-   Ausgehend von der Startseite verschiedene Bereiche des Webangebots aufsuchen, dabei wenn möglich unterschiedliche Navigationsmechanismen verwenden (Menüs, Direktlinks, Breadcrumb, Teaser oder Suche).
-   Prüfen, ob Navigationsmechanismen und Menüeinträge in verschiedenen Bereichen des Webauftritts gleich angeordnet und gestaltet sind.

### 3\. Hinweise

Die Navigation auf der Startseite unterscheidet sich häufig von der Navigation auf anderen Seiten, weil dort noch kein Bereichsmenü angezeigt werden muss oder weil zusätzliche Navigationsmöglichkeiten nur auf der Startseite angeboten werden.

Falls Inhalte über geskriptete Layer eingeblendet werden, sollte geprüft werden, ob sich diese Inhalte deutlich von sonstigen Seiten und Seitenwechseln unterscheiden, da hier die üblichen Navigationsmöglichkeiten (etwa der Zurück-Button des Browsers) nicht gleichermaßen greifen.

### 4\. Bewertung

Bewertung als nicht oder teilweise erfüllt immer erläutern!

## Einordnung des Prüfschritts

### Abgrenzung von anderen Prüfschritten

-   Geprüft wird in der "Normaleinstellung", also mit eingeschaltetem JavaScript und mit den für den Webauftritt vorgesehenen Stylesheets. Der Prüfschritt 9.1.3.3 "Ohne Bezug auf sensorische Merkmale nutzbar" klärt, ob die Navigation auch funktioniert, wenn die zugeordneten Stylesheets nicht verwendet werden.

### Einordnung des Prüfschritts nach WCAG 2.1

#### Guideline

-   [Guideline 3.2 Make Web pages appear and operate in predictable ways.](https://www.w3.org/TR/WCAG21/#predictable)

#### Success criteria

-   [3.2.3 Consistent Navigation](https://www.w3.org/TR/WCAG21/#consistent-navigation) (Level AA)

#### Techniques

##### General Techniques

-   [G61: Presenting repeated components in the same relative order each time they appear](https://www.w3.org/WAI/WCAG21/Techniques/general/G61.html)

##### Failures

-   [F66: Failure of Success Criterion 3.2.3 due to presenting navigation links in a different relative order on different pages](https://www.w3.org/WAI/WCAG21/Techniques/failures/F66.html)

## Quellen

### Die WCAG 2.1 zur Bedeutung einheitlicher Navigation und der Berechtigung abweichender Bereichsnavigation

> Ensuring that repeated components occur in the same order on each page of a site helps users become comfortable that they will able to predict where they can find things on each page. This helps users with cognitive limitations, users with low vision, users with intellectual disabilities, and also those who are blind.
>
> (…​) Individuals with low vision who use screen magnification to display a small portion of the screen at a time often use visual cues and page boundaries to quickly locate repeated content. Presenting repeated content in the same order is also important for visual users who use spatial memory or visual cues within the design to locate repeated content.
>
> It is important to note that the use of the phrase "same order" in this section is not meant to imply that subnavigation menus cannot be used or that blocks of secondary navigation or page structure cannot be used(…​)

( [Consistent Navigation: Understanding SC 3.2.3](https://www.w3.org/WAI/WCAG21/Understanding/consistent-navigation.html))
