Sehr gerne! Hier sind alle Kriterien für Entwickler, die sich auf HTML, CSS und ARIA beziehen:

### Level A (grundlegend)

1. **1.1.1 Non-text Content** - Alternativtexte für Bilder und nicht-textuelle Inhalte
   - HTML: alt-Attribute für Bilder, area-Elemente, input-Elemente vom Typ "image"
   - ARIA: aria-label, aria-labelledby für Objekte ohne native Textentsprechung

2. **1.3.1 Info and Relationships** - Strukturinformationen programmatisch verfügbar machen
   - HTML: Semantische Elemente (h1-h6, ul, ol, dl, table, etc.), label für Formularelemente
   - ARIA: ARIA-Landmarks (role="main", "navigation", etc.), aria-required für Pflichtfelder

3. **1.3.2 Meaningful Sequence** - Logische Reihenfolge im DOM
   - CSS: Positioning nicht zur Änderung der logischen Reihenfolge verwenden
   - HTML: Sinnvolle Reihenfolge im Markup

4. **2.1.1 Keyboard** - Alle Funktionen per Tastatur bedienbar
   - HTML: Native interaktive Elemente verwenden (a, button, input, select)
   - ARIA: Bei benutzerdefinierten Steuerelementen korrekte Rollen und Zustände setzen

5. **2.1.2 No Keyboard Trap** - Keine Tastaturfallen
   - JavaScript: Fokus nicht festhalten, Ausgang immer möglich

6. **2.1.4 Character Key Shortcuts** (seit 2.1) - Einzel-Tasten-Shortcuts deaktivierbar
   - JavaScript: Tastaturkürzel mit Modifikatortasten oder deaktivierbar gestalten

7. **2.4.1 Bypass Blocks** - Möglichkeit, Blöcke zu überspringen
   - HTML: Skip-Links, Überschriften, Landmarks
   - ARIA: ARIA-Landmarks für Hauptbereiche definieren

8. **2.4.3 Focus Order** - Logische Fokus-Reihenfolge
   - HTML: Natürliche Reihenfolge im DOM, tabindex nur wenn nötig

9. **2.4.4 Link Purpose (In Context)** - Linkzweck erkennbar
   - HTML: Aussagekräftiger Linktext, title-Attribute bei Bedarf

10. **3.1.1 Language of Page** - Sprache der Seite festlegen
    - HTML: lang-Attribut im html-Element

11. **3.2.1 On Focus** - Kein Kontextwechsel bei Fokus
    - JavaScript: Keine automatischen Formularübermittlungen bei Fokusänderung

12. **3.2.2 On Input** - Kein Kontextwechsel bei Eingabe
    - HTML: Explicit submit buttons für Formulare
    - JavaScript: Keine automatischen Formularübermittlungen bei Eingabeänderung

13. **3.3.1 Error Identification** - Fehler identifizieren
    - ARIA: aria-invalid für Fehlerfelder
    - HTML: Fehlertext in Verbindung mit Fehlerfeldern

14. **3.3.2 Labels or Instructions** - Beschriftungen oder Anweisungen
    - HTML: label-Elemente, fieldset/legend
    - ARIA: aria-labelledby, aria-describedby

15. **4.1.2 Name, Role, Value** - Name, Rolle, Wert programmatisch verfügbar
    - HTML: Korrekte semantische Elemente und Attribute
    - ARIA: Entsprechende Rollen und Zustände für benutzerdefinierte Steuerelemente

### Level AA (erweitert)

16. **1.3.5 Identify Input Purpose** (seit 2.1) - Zweck von Eingabefeldern programmatisch erkennbar
    - HTML: autocomplete-Attribute für Formulareingaben verwenden

17. **1.4.3 Contrast (Minimum)** - Kontrastverhältnis von 4,5:1 für Text
    - CSS: Ausreichende Kontrastverhältnisse für Text und Hintergrund

18. **1.4.4 Resize Text** - Text auf 200% vergrößerbar
    - CSS: Relative Einheiten verwenden (em, rem, %), keine festen Pixelgrößen für Text

19. **1.4.5 Images of Text** - Vermeidung von Text in Bildern
    - CSS: Text mit CSS stylen statt als Bild

20. **1.4.10 Reflow** (seit 2.1) - Inhalte bei 320px ohne horizontales Scrollen
    - CSS: Responsive Design, flexbox, grid, media queries

21. **1.4.11 Non-text Contrast** (seit 2.1) - Kontrast für UI-Komponenten
    - CSS: 3:1 Kontrastverhältnis für Benutzeroberflächen-Komponenten und grafische Objekte

22. **1.4.12 Text Spacing** (seit 2.1) - Anpassbare Textabstände
    - CSS: Keine Inhalts- oder Funktionsverluste bei angepassten Textabständen

23. **2.4.5 Multiple Ways** - Mehrere Wege zur Navigation
    - HTML: Sitemaps, Suche, Navigation, Inhaltsverzeichnis

24. **2.4.6 Headings and Labels** - Beschreibende Überschriften und Beschriftungen
    - HTML: Aussagekräftige h1-h6 Überschriften und label Elemente

25. **2.4.7 Focus Visible** - Sichtbarer Tastaturfokus
    - CSS: Fokus-Stile nicht entfernen, deutliche Fokusmarkierungen

26. **2.4.11 Focus Not Obscured (Minimum)** (seit 2.2) - Fokus nicht vollständig verdeckt
    - CSS: Keine komplette Verdeckung von fokussierten Elementen

27. **2.5.7 Dragging Movements** (seit 2.2) - Alternative zu Ziehbewegungen
    - JavaScript: Zieh-Operationen auch durch Einzelklicks möglich machen

28. **2.5.8 Target Size (Minimum)** (seit 2.2) - Klickziele mindestens 24x24 CSS-Pixel
    - CSS: Ausreichende Größe für interaktive Elemente

29. **3.1.2 Language of Parts** - Sprache von Textpassagen
    - HTML: lang-Attribut für Abschnitte in anderen Sprachen

30. **3.2.3 Consistent Navigation** - Konsistente Navigation
    - HTML/CSS: Gleichbleibende Reihenfolge für wiederholte Navigationsmechanismen

31. **3.2.4 Consistent Identification** - Konsistente Identifikation
    - HTML/ARIA: Gleiche Funktionalität konsistent benennen

32. **3.3.3 Error Suggestion** - Fehlervorschläge
    - ARIA: aria-describedby für Fehlerhinweise

33. **3.3.4 Error Prevention** - Fehlervermeidung
    - HTML/JavaScript: Überprüfung, Bestätigung, Rückgängig-Möglichkeit

34. **3.3.7 Redundant Entry** (seit 2.2) - Redundante Eingaben vermeiden
    - HTML/JavaScript: Bereits eingegebene Daten auto-ausfüllen oder zur Auswahl anbieten

35. **3.3.8 Accessible Authentication** (seit 2.2) - Zugängliche Authentifizierung
    - HTML: Eingabefelder für E-Mail und Passwort richtig markieren

36. **4.1.3 Status Messages** (seit 2.1) - Statusmeldungen
    - ARIA: role="status", role="alert", aria-live für dynamische Aktualisierungen

### Level AAA (umfassend)

37. **1.3.6 Identify Purpose** (seit 2.1) - Zweck von UI-Komponenten identifizierbar
    - ARIA: Landmarks und zusätzliche semantische Informationen

38. **1.4.6 Contrast (Enhanced)** - Erhöhtes Kontrastverhältnis von 7:1
    - CSS: Höhere Kontrastverhältnisse für Text und Hintergrund

39. **1.4.8 Visual Presentation** - Visuelle Darstellung von Text
    - CSS: Anpassbare Vorder- und Hintergrundfarben, Zeilenbreite, Ausrichtung, Zeilenabstand

40. **1.4.9 Images of Text (No Exception)** - Keine Bilder von Text
    - CSS: Text mit CSS anstelle von Bildern, keine Ausnahmen

41. **2.1.3 Keyboard (No Exception)** - Tastatur ohne Ausnahme
    - JavaScript: Alle Funktionen via Tastatur bedienbar, keine Ausnahmen

42. **2.4.8 Location** - Position des Nutzers
    - HTML: Breadcrumbs, hervorgehobene Navigationsitems

43. **2.4.9 Link Purpose (Link Only)** - Linkzweck allein aus dem Linktext
    - HTML: Selbsterklärende Links ohne Kontext

44. **2.4.10 Section Headings** - Abschnittsüberschriften
    - HTML: Verwendung von h1-h6 zur Strukturierung

45. **2.4.12 Focus Not Obscured (Enhanced)** (seit 2.2) - Fokus gar nicht verdeckt
    - CSS: Keine teilweise Verdeckung von fokussierten Elementen

46. **2.4.13 Focus Appearance** (seit 2.2) - Deutliche Fokusanzeige
    - CSS: Hoher Kontrast für Fokusanzeige, mindestens 2px Umriss

47. **2.5.5 Target Size (Enhanced)** (seit 2.1) - Größere Klickziele (44x44px)
    - CSS: Große interaktive Elemente

48. **2.5.6 Concurrent Input Mechanisms** (seit 2.1) - Gleichzeitige Eingabemethoden
    - JavaScript: Keine Einschränkung der Eingabegeräte

49. **3.2.5 Change on Request** - Änderungen nur auf Anfrage
    - JavaScript: Keine automatischen Aktualisierungen oder Weiterleitungen

50. **3.3.5 Help** - Kontextsensitive Hilfe
    - HTML: Hilfsinformationen an passenden Stellen

51. **3.3.6 Error Prevention (All)** - Fehlervermeidung bei allen Eingaben
    - HTML/JavaScript: Überprüfung/Bestätigung für alle Eingaben

52. **3.3.9 Accessible Authentication (Enhanced)** (seit 2.2) - Erweiterte zugängliche Authentifizierung
    - JavaScript/HTML: Alternativen zu kognitiven Funktionstests

Diese Liste umfasst alle HTML-, CSS- und ARIA-bezogenen Kriterien aus WCAG 2.2, die besonders für Entwickler relevant sind. Die Kriterien sind nach Konformitätsstufen (A, AA, AAA) sortiert und enthalten zusätzliche Hinweise zur technischen Umsetzung.