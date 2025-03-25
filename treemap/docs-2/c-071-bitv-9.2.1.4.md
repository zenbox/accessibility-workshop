# Prüfschritt 9.2.1.4 Tastatur-Kurzbefehle abschaltbar oder anpassbar

Tastatur-Kurzbefehle mit einzelnen Tasten dürfen nicht ungewollt ausgelöst werden und müssen anpassbar oder abschaltbar sein.

-   Alle Buchstaben-, Zahlen- und Symboltasten testen, ob sie Funktionen auslösen
-   Falls Einzeltasten Befehle auslösen, prüfen, ob sie abgeschaltet oder auf Tastenkombinationen mit Modifikator-Tasten umgestellt werden können
-   Wenn Tastaturkurzbefehle nur aktiv sind, wenn ein bestimmtes Interface-Element den Fokus hat, ist das erlaubt

_BITV-Originaltext:_

## Was wird geprüft?

Wenn Webseiten Tastaturkurzbefehle über Einzeltasten (Buchstaben, Zahlen, Satzzeichen oder Symbole) implementieren, können diese entweder abgeschaltet oder auf eine Tastenkombination mit Modifikator-Tasten umgestellt werden, oder sie sind nur aktiv für bestimmte Schnittstellen-Elemente, wenn diese den Fokus haben.

## Warum wird das geprüft?

Tastaturkurzbefehle sind für Menschen, die am Computer oder einem mobilen Gerät die Spracheingabe benutzen, häufig problematisch. Spracheingaben können unerwartet Befehle für Funktionen auslösen, der Nutzungskontext geht dadurch verloren.

## Wie wird geprüft?

### 1\. Anwendbarkeit des Prüfschritts

Der Prüfschritt ist immer anwendbar.

### 2\. Prüfung

1.  Seite neu laden.
2.  Wenn dies den Fokus auf ein Interface-Element setzt (z. B. auf ein Eingabefeld), auf einen leeren Bereich der Seite klicken, um sicherzustellen, dass keine Interface-Elemente fokussiert sind.
3.  Mit Ausnahme der Modifikator- und Steuertasten wie STR, ALT, ENTER, Tab, Pfeiltasten und Funktionstasten F1-F12, nacheinander auf alle Tastaturtasten drücken, d. h. auf alle Nummern- Buchstaben-, Symbol- und Zeichensetzungs-Tasten.
4.  Die Umschalttaste halten und die gleichen Tasten erneut betätigen.
5.  Falls einzelne Tasten Funktionen auslösen, prüfen, ob die Website oder App Einstellungen bereithält, um diese Tastaturkurzbefehle über Einzeltasten abzuschalten oder auf Tastaturkurzbefehle mit einer Modifikator-Taste zu mappen.

### 3\. Hinweise

Die Anforderung gilt nicht, wenn die Tastaturkurzbefehle nur aktiv sind, sobald bestimmte Interface-Elemente den Fokus haben, etwa ein Auswahllisten-Element bzw. \`select\`Hier dient z. B. das Drücken einer Buchstabentaste zur schnellen Navigation innerhalb der Auswahllisten-Optionen.

Über das Anzeigen von Seitenskripten und das Suchen nach typischen Tastatur-Event-Handlern wie `document.addEventListener` oder das Vorhandensein der `.keycode`\-Eigenschaft lässt sich ggf. das Vorhandensein von Skripten überprüfen, welche auf Tasteneingaben reagieren, bei denen nicht Modifikator-Tasten wie ALT oder STR gleichzeitig gedrückt werden. Da es mehrere Möglichkeiten gibt, Tastatur-Events zu implementieren, ist diese Methode aber nicht als zuverlässig zu betrachten.

Einige Browser verwenden Tastenkombinationen mit der Umschalttaste. So öffnet Firefox eine Seitensuche, wenn man Umschalttaste + / drückt, und eine Suche in Seitenlinks, wenn man Umschalttaste + ' drückt. In diesen Fällen ist es notwendig, die ESC-Taste zu drücken oder auf einen leeren Teil der Seite zu klicken, um den Fokus aus der Browser-Sucheingabe zu entfernen.

### 4\. Bewertung

#### Prüfschritt erfüllt

-   Durch das Drücken der Tasten geschehen keinerlei Änderungen des Inhalts oder des Kontexts.
-   Es gibt Tastatur-Kurzbefehle über Einzeltasten, aber diese sind über Einstellungen der Website oder App abschaltbar oder auf Tastenkombinationen mit Modifikator-Tasten umstellbar.
-   Tastaturkurzbefehle über Einzeltasten sind nur wirksam, wenn bestimmte interaktive Elemente den Fokus haben (z.B. Auswahllisten).

## Einordnung des Prüfschritts

### Einordnung des Prüfschritts nach WCAG 2.1

#### Guideline

-   [Guideline 2.1 Keyboard Accessible: Make all functionality available from a keyboard](https://www.w3.org/TR/WCAG21/#keyboard-accessible)

#### Success criterion

-   [2.1.4 Character Key Shortcuts](https://www.w3.org/TR/WCAG21/#character-key-shortcuts) (Level A)

#### Sufficient Techniques

-   [G217: Providing a mechanism to allow users to remap or turn off character key shortcuts](https://www.w3.org/WAI/WCAG21/Techniques/general/G217)

#### Failures

-   [F99: Failure of Success Criterion 2.1.4 due to implementing character key shortcuts that cannot be turned off or remapped](https://www.w3.org/WAI/WCAG21/Techniques/failures/F99)

## Quellen

-   [Bookmarklet "Tastatur-Kurzbefehle auslösen"](https://www.bitvtest.de/bitv_test/das_testverfahren_im_detail/werkzeugliste/bookmarklets.html) von Prüfstelle T-Systems MMS kann ggf. zusätzlich eingesetzt werden, um der Reihe nach alle erforderlichen Tasten auszulösen. Dabei muss die Seite genau beobachtet werden, ob sich etwas ändert bzw. geändert hat. Die Konsole der Entwickler-Tools zeigt die simulierten Eingaben.
-   [Understanding Success Criterion 2.1.4: Character Key Shortcuts](https://www.w3.org/WAI/WCAG21/Understanding/character-key-shortcuts.html) (zur Zeit nur auf Englisch verfügbar)

## Fragen zu diesem Prüfschritt

### Das eingebundene Video reagiert auf Tastaturkurzbefehle über Einzeltasten, z.B: "k" zum Pausieren/Abspielen und "m" zum Stummschalten. Ist das als Verstoß gegen 2.1.4 "Tastatur-Kurzbefehle abschaltbar oder anpassbar" zu werten?

Diese Tastaturkurzbefehle sind für Tastaturnutzer zweifellos hilfreich. Ob dadurch Nachteile für Spracheingabenutzer entstehen, versuchen wir zur Zeit zu klären. Noch offen ist, ob ein Video als [User Interface Component](https://www.w3.org/TR/WCAG21/#dfn-user-interface-components) im Sinne der normativen Anforderung interpretiert werden kann. Es gibt dazu [eine längere Diskussion in dem Github-Issue der Accessibility Guidelines Working Group](https://github.com/w3c/wcag/issues/1950). Solange diese Frage nicht klar entschieden ist, sollten Tastaturkurzbefehle auf fokussierten Videos nicht als Fehler bewertet werden.
