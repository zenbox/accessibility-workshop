# Prüfschritt 9.2.3.1 Verzicht auf Flackern

Flackernde Inhalte dürfen nicht mehr als dreimal pro Sekunde aufblitzen, da sie epileptische Anfälle auslösen können.

-   Prüfen, ob es flackernde Elemente gibt
-   Prüfen, ob diese mehr als dreimal pro Sekunde aufblitzen
-   Falls ja, sicherstellen, dass sie spätestens nach dreimaligem Flackern aufhören

_BITV-Originaltext:_

## Was wird geprüft?

Die Seite enthält keine Elemente, die in einem Zeitraum von einer Sekunde häufiger als dreimal aufblitzen.

## Warum wird das geprüft?

Bei Menschen mit Epilepsie kann längeres Flackern in bestimmten Frequenzen einen Anfall auslösen.

## Wie wird geprüft?

### 1\. Anwendbarkeit des Prüfschritts

Der Prüfschritt ist immer anwendbar.

### 2\. Prüfung

Gibt es auf der Webseite flackernde Inhalte, die nicht spätestens nach dreimaligem Flackern in einem Zeitraum von einer Sekunde aufhören?

Zur Einschätzung der Größe des flackernden Bereichs kann, wenn nötig, die WCAG 2.1 [Formel 1](http://www.w3.org/TR/2008/NOTE-WCAG20-TECHS-20081211/G176#smallsafe1) herangezogen werden.

### 3\. Hinweis zur Abwertung

Wenn die Seite größere flackernde Elemente enthält, wird das Gesamtergebnis der Prüfung abgewertet. Flackern wird dadurch hervorgerufen, dass die Farbe oder das Muster einer Fläche pro Sekunde mindestens 4 mal wechselt.

## Einordnung des Prüfschritts

### Einordnung des Prüfschritts nach WCAG 2.1

#### Guidelines

-   [Guideline 2.3 Do not design content in a way that is known to cause seizures](https://www.w3.org/WAI/WCAG21/quickref/#no-timing)

#### Success criteria

-   [2.3.1 Three Flashes or Below Threshold](https://www.w3.org/WAI/WCAG21/quickref/#three-flashes-or-below-threshold)

#### Techniques

##### General Techniques

-   [G15: Using a tool to ensure that content does not violate the general flash threshold or red flash threshold](https://www.w3.org/WAI/WCAG21/Techniques/general/G15.html)
-   [G176: Keeping the flashing area small enough](https://www.w3.org/WAI/WCAG21/Techniques/general/G176.html)

## Quellen

### Die WCAG 2.1 zu General flash and red flash thresholds

> A flash or rapidly changing image sequence is below the threshold (i.e., content passes) if any of the following are true:
>
> there are no more than three general flashes and / or no more than three red flashes within any one-second period; or the combined area of flashes occurring concurrently occupies no more than a total of .006 steradians within any 10 degree visual field on the screen (25% of any 10 degree visual field on the screen) at typical viewing distance
>
> where:
>
> -   A general flash is defined as a pair of opposing changes in relative luminance of 10% or more of the maximum relative luminance where the relative luminance of the darker image is below 0.80; and where "a pair of opposing changes" is an increase followed by a decrease, or a decrease followed by an increase, and
> -   A red flash is defined as any pair of opposing transitions involving a saturated red.

( [Three Flashes or Below Threshold: Understanding SC 2.3.1](https://www.w3.org/WAI/WCAG21/Understanding/three-flashes-or-below-threshold.html))

### Die WCAG 2.1 zur Abgrenzung von Blinken und Flackern

> Note: The terms "blinking" and "flashing" can sometimes refer to the same content.
>
> -   "Blinking" refers to content that causes a distraction problem. Blinking can be allowed for a short time as long as it stops (or can be stopped)
> -   "Flashing" refers to content that can trigger a seizure (if it is more than 3 per second and large and bright enough). This cannot be allowed even for a second or it could cause a seizure. And turning the flash off is also not an option since the seizure could occur faster than most users could turn it off.
> -   Blinking usually does not occur at speeds of 3 per second or more, but it can. If blinking occurs faster than 3 per second, it would also be considered a flash.

( [Pause, Stop, Hide: Understanding SC 2.2.2](https://www.w3.org/WAI/WCAG21/Understanding/pause-stop-hide.html))
