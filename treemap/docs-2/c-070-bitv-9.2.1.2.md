# Prüfschritt 9.2.1.2 Keine Tastaturfalle

Der Tastaturfokus muss sich immer von einem Element wegbewegen lassen, es darf keine Tastaturfalle geben.

-   Mit der Tabulatortaste müssen alle interaktiven Elemente erreicht und wieder verlassen werden können
-   Die Prüfung erfolgt in Firefox und Chrome mit eingeschaltetem JavaScript
-   Falls eine Tastaturfalle besteht, sind Inhalte nach der Falle nicht mehr erreichbar

_BITV-Originaltext:_

## Was wird geprüft?

Kann der Tastaturfokus auf ein Element der Seite bewegt werden, muss er auch von diesem Element wieder wegbewegt werden können. Der Inhalt darf keine Tastaturfalle erzeugen.

## Warum wird das geprüft?

Die Bedienung soll geräteunabhängig möglich sein. Das bedeutet: Sie muss sowohl mit der Maus als auch mit der Tastatur möglich sein.

Auf die Tastaturbedienbarkeit angewiesen sind zum Beispiel viele motorisch eingeschränkte Menschen oder Blinde.

## Wie wird geprüft?

### 1\. Anwendbarkeit des Prüfschritts

Der Prüfschritt ist immer anwendbar.

### 2\. Prüfung

1.  Seite im Firefox Browser aufrufen.
2.  Mit der Tabulatortaste die Links und Formularelemente durchgehen. Prüfen, ob alle Links und Formularelemente erreicht und wieder verlassen werden können.
3.  Seite in Chrome aufrufen und Schritte 1 bis 2 wiederholen.

### 3\. Hinweise

#### 3.1 Allgemeine Hinweise

Probleme bei der Bedienung werden in der Regel durch die Verwendung von JavaScript verursacht. Die Prüfung erfolgt also bei **eingeschaltetem** JavaScript.

#### 3.2 Hinweise zu Tastaturfallen

-   Wenn die Tastaturfalle verhindert, dass man Inhalte nach der Tastaturfalle erreicht, dann ist eventuell auch Prüfschritt 9.2.1.1 "Ohne Maus nutzbar" nicht erfüllt!

### 4\. Bewertung

#### Erfüllt

-   Es gibt keine Tastaturfallen.

#### Nicht erfüllt

-   Wesentliche Inhalte und Funktionen sind in Chrome oder in Firefox aufgrund einer Tastaturfalle mit der Tastatur nicht erreichbar oder nicht bedienbar.

## Einordnung des Prüfschritts

### Einordnung des Prüfschritts nach WCAG 2.1

#### Guideline

-   [Guideline 2.1 Keyboard Accessible: Make all functionality available from a keyboard.](https://www.w3.org/TR/WCAG21/#keyboard-accessible)

#### Success criteria

-   [2.1.2 No Keyboard Trap](https://www.w3.org/TR/WCAG21/#no-keyboard-trap) (Level A)

#### Techniques

##### General Techniques

-   [G21: Ensuring that users are not trapped in content](https://www.w3.org/WAI/WCAG21/Techniques/general/G21.html)

##### Flash Techniques

-   [FLASH17: Providing keyboard access to a Flash object and avoiding a keyboard trap](https://www.w3.org/WAI/WCAG21/Techniques/flash/FLASH7)

##### Failures

-   [F10: Failure of Success Criterion 2.1.2 and Conformance Requirement 5 due to combining multiple content formats in a way that traps users inside one format type](https://www.w3.org/WAI/WCAG21/Techniques/failures/F10)
