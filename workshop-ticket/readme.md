# Tickets

Der Fahrschein-kaufen Screen soll in Seminare als Übungsfeld für WCAG Kriterien dienen. Die App soll es den Teilnehmenden ermöglichen, den Fahrscheinkauf so zu gestalten, dass er den WCAG 2.1 AA Richtlinien entspricht. Sie ist also ein interaktives Übungsfeld, in dem headless und ohne Edotir die einzelnen Aspekte hinzugefügt und bearbeitet werden können.

Den Fahrscheinkauf so vorbereiten, dass
1. UX/UI Designer Farben, Layout und Typografie anpassen können.
2. UX Texter die Texte anpassen können.
3. Entwickler die Semantik, ARIA Attribute und Logik anpassen können.

Die App soll so gestaltet werden, dass sie auf Desktop und Mobilgeräten gut aussieht und funktioniert. 

Alle Bearbeitungen sollen inpage gemacht werden können, ohne dass die Seite neu geladen werden muss oder ein Quelltexteditor geöffnet werden muss.

Für Farben gibt es ein Farbauswahl-Tool, mit dem die Farben ausgewählt werden können. Die Farben sollen in einem Farbschema gespeichert werden, das in der App verwendet wird. Das Farbschema soll im localStorage gespeichert werden und als JSON-Datei gespeichert werden können, die auch von der App geladen werden kann.

Es soll --primary, --secondary, --tertiary, --background, --foreground und --error, --warning, --success und --info Farben geben. Diese Farben sollen in der App verwendet werden. Das Farbauswahl-Tool soll eine Farbpalette mit den Farben des Farbschemas anzeigen.

Die Farben sollen auf WCAG Kontrast und Farbenfehlsichtigkeit getestet werden können.

Die Typografie und das Layout sollen responsiv sein und auch bei einer Gerätebreite von 320 Pixeln gut aussehen und umbrechen und nicht horizontal scrollen müssen. Es soll die Vergrößerbarkeit auf 1000% getestet werden können. (500% durch den Browser, weitere adaptive Schriftgrößen durch ein Konfigurationsmenü).

Texte können direkt bei den Eingabefeldern bearbeitet werden. Es gibt für das Formular eine <legend>, für die Felder <label> und für jedes Feld 'placeholder' Attribute. Ausserdem können zusätzliche Texte unterdem Feld angelegt werden: Fahlerhinweise, Hinweise zum Beheben der Fehler und Texte, die eine falsche Eingabe vermeiden helfen. 

Die gesamte technische Umsetzung soll in HTML, CSS und JavaScript erfolgen. Es soll kein Framework verwendet werden. Die Programmierung des System erfolgt in SOLID OO Weise und setzt alle Funktionalitäten in Webkomonenten um.