# "Du bist Experte für Barrierefreiheit. Nenne mir die WCAG Kriterien die auf Vergrößerung einzahlen."

Die **Web Content Accessibility Guidelines (WCAG)** definieren verschiedene Erfolgskriterien, die sicherstellen, dass Webinhalte für Menschen mit Behinderungen zugänglich sind. Im Kontext der **Vergrößerung** von Inhalten gibt es mehrere Kriterien, die darauf abzielen, Menschen mit Sehbehinderungen den Zugang zu Informationen zu erleichtern. Hier sind die wichtigsten WCAG-Kriterien, die auf die Vergrößerung einzahlen:

### 1. **1.4.4 - Textgröße ändern (Resize text) (AA)**

-   **Anforderung**: Der Benutzer muss in der Lage sein, den Text um **bis zu 200% zu vergrößern**, ohne dass dabei Inhalte oder Funktionen verloren gehen.
-   **Bedeutung**: Diese Anforderung sorgt dafür, dass die Textinhalte auf einer Webseite lesbarer werden, indem die Benutzer die Größe des Textes anpassen können, ohne dass sie auf horizontales Scrollen oder Informationsverlust stoßen.

### 2. **1.4.10 - Reflow (AA)**

-   **Anforderung**: Inhalte müssen auf der Website so angeordnet sein, dass sie bei einer Vergrößerung von bis zu **400%** ohne Verlust an Funktionalität angezeigt werden können. Der Nutzer soll dabei nicht horizontal scrollen müssen, um den Text zu lesen.
-   **Bedeutung**: Diese Anforderung stellt sicher, dass Inhalte flexibel sind und auf verschiedenen Bildschirmgrößen, wie mobilen Geräten, und bei starker Vergrößerung gut nutzbar bleiben.

### 3. **1.4.12 - Textabstände (Text Spacing) (AA)**

-   **Anforderung**: Benutzer müssen in der Lage sein, den Zeilenabstand, die Buchstaben- und Wortabstände so anzupassen, dass der Text gut lesbar ist, ohne dass Inhalte oder Funktionen verloren gehen.
-   **Bedeutung**: Diese Anforderung ist besonders wichtig bei der Vergrößerung, da eine Erhöhung des Abstands die Lesbarkeit verbessert, insbesondere für Menschen mit Sehbehinderungen.

### 4. **1.4.3 - Kontrast (Mindestkontrast) (AA)**

-   **Anforderung**: Der visuelle Kontrast zwischen Text und Hintergrund muss mindestens **4.5:1** betragen, damit der Text auch bei Vergrößerung gut lesbar bleibt.
-   **Bedeutung**: Menschen mit Sehschwächen oder Farbenblindheit benötigen einen höheren Kontrast, damit der Text, selbst wenn er vergrößert wird, klar erkennbar bleibt.

### 5. **1.4.11 - Nicht-Text-Inhalte (Non-text Contrast) (AA)**

-   **Anforderung**: Der Kontrast zwischen benutzeroberflächenrelevanten visuellen Elementen (z. B. Schaltflächen, Bedienelemente) und angrenzenden Farben muss mindestens **3:1** betragen.
-   **Bedeutung**: Neben der Vergrößerung von Text müssen auch Bedienelemente wie Schaltflächen und Symbole gut sichtbar und erkennbar bleiben.

### 6. **2.1.1 - Tastaturbedienbarkeit (Keyboard Accessible) (A)**

-   **Anforderung**: Alle Funktionen auf einer Webseite müssen per Tastatur zugänglich sein.
-   **Bedeutung**: Menschen, die Sehbehinderungen haben und Vergrößerungstools verwenden, navigieren häufig über die Tastatur, da die Mausnutzung bei hoher Vergrößerung schwierig sein kann.

### 7. **2.4.7 - Fokus sichtbar (Focus Visible) (AA)**

-   **Anforderung**: Der Tastaturfokus muss sichtbar sein, wenn Benutzer durch Inhalte navigieren.
-   **Bedeutung**: Menschen, die Bildschirmlupen oder Vergrößerungssoftware verwenden, müssen in der Lage sein zu erkennen, welches Element gerade den Fokus hat.

### 8. **1.3.1 - Info und Beziehungen (Info and Relationships) (A)**

-   **Anforderung**: Die Struktur und die semantischen Beziehungen der Inhalte müssen über entsprechende Markup-Codes oder visuell erkennbar gemacht werden.
-   **Bedeutung**: Bei der Vergrößerung können visuelle Hinweise verloren gehen. Diese Regel stellt sicher, dass die semantischen Beziehungen durch korrektes HTML-Markup erhalten bleiben, was auch assistive Technologien unterstützt.

---

Diese Kriterien fördern zusammen die **Barrierefreiheit für Menschen mit Sehbehinderungen**, indem sie sicherstellen, dass Inhalte auch bei Vergrößerung gut lesbar und benutzbar bleiben, ohne dass wesentliche Informationen oder Funktionen verloren gehen.

# "Mache mir eine Liste der BITV Prüfschritte, die prüfen, ob überall wo nötig alternative Texte vorhanden sind."

Die **Barrierefreie-Informationstechnik-Verordnung** (BITV) orientiert sich an den internationalen Richtlinien der Web Content Accessibility Guidelines (WCAG). Ein wichtiger Bestandteil der BITV-Prüfung ist die Bewertung, ob alternative Texte (Alt-Texte) für Inhalte wie Bilder, Grafiken und Multimedia-Dateien korrekt und vollständig vorhanden sind.

Hier ist eine Liste der relevanten BITV-Prüfschritte, die überprüfen, ob alternative Texte überall da vorhanden sind, wo sie erforderlich sind:

### 1. **Prüfschritt 1.1.1a - Text-Alternativen für Nicht-Text-Inhalte**

-   **Beschreibung**: Überprüfung, ob alle Nicht-Text-Inhalte (z. B. Bilder, Grafiken, Videos) alternative Texte enthalten, die deren Zweck und Funktion angemessen beschreiben.
-   **Warum wichtig**: Für sehbehinderte oder blinde Nutzer sind Alternativtexte notwendig, um den Inhalt und die Funktion von visuellen Elementen wahrzunehmen.
-   **WCAG-Kriterium**: 1.1.1 (Nicht-Text-Inhalt)

### 2. **Prüfschritt 2.4.4a - Eindeutige und beschreibende Linktexte**

-   **Beschreibung**: Prüfung, ob alternative Texte für verlinkte Bilder und Grafiken sinnvoll und verständlich sind und den Zweck des Links klar angeben.
-   **Warum wichtig**: Für Nutzer, die Screenreader verwenden, muss klar erkennbar sein, wohin ein Link führt oder welche Aktion durch das Klicken auf das Bild ausgeführt wird.
-   **WCAG-Kriterium**: 2.4.4 (Linkzweck im Kontext)

### 3. **Prüfschritt 1.1.1b - Kein redundanter oder leerer Alternativtext**

-   **Beschreibung**: Dieser Prüfschritt überprüft, ob für dekorative Grafiken, die keine inhaltliche Funktion haben, entweder kein Alternativtext vorhanden ist oder ein leerer Alt-Text (`alt=""`) verwendet wird.
-   **Warum wichtig**: Dekorative Bilder sollten keine unnötigen Informationen für Nutzer von Screenreadern darstellen, um die Navigation effizient zu gestalten.
-   **WCAG-Kriterium**: 1.1.1 (Nicht-Text-Inhalt)

### 4. **Prüfschritt 1.1.1c - Audiovisuelle Inhalte haben eine Textalternative**

-   **Beschreibung**: Überprüfung, ob für audiovisuelle Inhalte wie Videos, Podcasts oder Animationen entweder Textbeschreibungen oder Alternativen in Form von Untertiteln, Audiodeskriptionen oder Volltext-Alternativen verfügbar sind.
-   **Warum wichtig**: Nutzer, die den visuellen oder auditiven Teil von Inhalten nicht wahrnehmen können, benötigen eine alternative Darstellung.
-   **WCAG-Kriterium**: 1.1.1 (Nicht-Text-Inhalt)

### 5. **Prüfschritt 1.4.5a - Texte in Bildern haben Alternativen**

-   **Beschreibung**: Es wird geprüft, ob für Bilder, die Text enthalten (z. B. Logos oder Infografiken), alternative Texte vorhanden sind, die den gleichen Inhalt vermitteln.
-   **Warum wichtig**: Bilder, die Text enthalten, müssen für blinde oder sehbehinderte Nutzer ebenso zugänglich sein wie für sehende Nutzer.
-   **WCAG-Kriterium**: 1.4.5 (Text in Bildern)

---

### **Fazit**:

Diese Prüfschritte stellen sicher, dass alternative Texte in Webseiten vorhanden sind, um Nicht-Text-Inhalte für Nutzer mit Behinderungen zugänglich zu machen. Alternative Texte sind besonders wichtig für sehbehinderte Menschen, die Screenreader nutzen, und spielen eine zentrale Rolle in der Barrierefreiheit von Webseiten.

# "Du bist blind und arbeitest mit einem Screenreader. Welche zusätzlichen Textinformationen erwartest du beim Ausfüllen eines E-Mail-Feldes, um Fehler zu vermeiden?"

Wenn ich als blinder Nutzer mit einem **Screenreader** ein E-Mail-Feld ausfülle, erwarte ich zusätzliche Textinformationen, um sicherzustellen, dass ich das Feld korrekt ausfülle und mögliche Fehler vermeide. Hier sind die wichtigsten Informationen, die mir dabei helfen würden:

### 1. **Erklärung des erwarteten Formats**

-   Eine klare Beschreibung des **erwarteten Formats** für die E-Mail-Adresse ist entscheidend. Zum Beispiel: „Bitte geben Sie eine gültige E-Mail-Adresse im Format name@domain.com ein“.
-   **Warum wichtig**: Dies hilft, das korrekte Format einer E-Mail-Adresse zu verstehen und sicherzustellen, dass keine unzulässigen Zeichen oder Lücken enthalten sind.

### 2. **Echtzeit-Validierung mit akustischem Feedback**

-   Eine sofortige akustische Rückmeldung, wenn die Eingabe **nicht den Anforderungen entspricht**, wäre hilfreich. Zum Beispiel könnte der Screenreader nach der Eingabe sagen: „Ungültige E-Mail-Adresse, bitte überprüfen“.
-   **Warum wichtig**: So erfahre ich direkt, wenn ein Fehler vorliegt (z. B. ein fehlendes „@“ oder ein Tippfehler in der Domain), und kann den Fehler sofort beheben.

### 3. **Hinweis auf Pflichtfelder**

-   Es sollte deutlich gemacht werden, ob das E-Mail-Feld ein **Pflichtfeld** ist. Zum Beispiel durch den Hinweis „Dieses Feld ist erforderlich“.
-   **Warum wichtig**: Wenn das Feld zwingend ausgefüllt werden muss, weiß ich sofort, dass eine Eingabe notwendig ist, und kann so vermeiden, das Formular unvollständig abzusenden.

### 4. **Fehlermeldungen bei falschen Eingaben**

-   Wenn die E-Mail-Adresse falsch eingegeben wurde und eine Fehlermeldung auftritt, sollte diese für den Screenreader **klar und verständlich** vorgelesen werden. Zum Beispiel: „Die E-Mail-Adresse ist ungültig. Bitte überprüfen Sie Ihre Eingabe“.
-   **Warum wichtig**: Ohne sichtbare Hinweise muss der Screenreader explizit auf den Fehler hinweisen, damit ich die nötigen Korrekturen vornehmen kann.

### 5. **Erfolgsbestätigung**

-   Nach korrekter Eingabe sollte eine **Bestätigung** gegeben werden, etwa „E-Mail-Adresse erfolgreich eingegeben“ oder „Validierung erfolgreich“.
-   **Warum wichtig**: So weiß ich, dass meine Eingabe korrekt ist und das Feld abgeschlossen werden kann.

### 6. **Automatische Vervollständigung oder Vorschläge**

-   Wenn das E-Mail-Feld eine **automatische Vervollständigung** unterstützt, wie das Vorschlagen von Domains (z. B. „@gmail.com“, „@yahoo.com“), sollte der Screenreader diese Vorschläge ankündigen und zur Auswahl anbieten.
-   **Warum wichtig**: Dies erleichtert die Eingabe und reduziert die Wahrscheinlichkeit von Fehlern bei der Eingabe der Domain.

---

### **Zusammenfassung**:

Als blinder Nutzer, der mit einem Screenreader arbeitet, benötige ich klare und deutliche Informationen, um das E-Mail-Feld korrekt auszufüllen. Dazu gehören Hinweise auf das erwartete Format, Echtzeit-Feedback bei Fehlern, eindeutige Fehlermeldungen und gegebenenfalls Vorschläge für die Autovervollständigung. Solche Informationen machen den Prozess effizienter und tragen dazu bei, dass Fehler vermieden werden.

# "Welche BITV Prüfschritte prüfen all das?"

Die **BITV** (Barrierefreie Informationstechnik-Verordnung) enthält mehrere Prüfschritte, die sicherstellen, dass Formulare – einschließlich E-Mail-Felder – für alle Benutzer, einschließlich Menschen mit Behinderungen, zugänglich und verständlich sind. Hier sind die relevanten Prüfschritte, die sicherstellen, dass blinde Nutzer mit Screenreadern alle notwendigen Informationen erhalten, um E-Mail-Felder korrekt auszufüllen und Fehler zu vermeiden:

### 1. **Prüfschritt 9.1.1a – Beschriftungen und Anweisungen zu Eingabefeldern**

-   **Beschreibung**: Dieser Prüfschritt stellt sicher, dass **Eingabefelder korrekt beschriftet** und mit Screenreadern zugänglich sind. Dies betrifft auch E-Mail-Felder, bei denen eine beschreibende Label-Information vorhanden sein muss, die den Zweck des Feldes klar angibt (z. B. „E-Mail-Adresse“).
-   **Warum wichtig**: Nutzer müssen den Zweck des Eingabefeldes klar verstehen, bevor sie es ausfüllen. Dies hilft blinden Nutzern zu erkennen, dass es sich um ein E-Mail-Feld handelt.

### 2. **Prüfschritt 9.1.1b – Fehlermeldungen klar und verständlich**

-   **Beschreibung**: Dieser Prüfschritt überprüft, ob **Fehlermeldungen klar und verständlich** sind, wenn Benutzer falsche Daten eingeben (z. B. eine ungültige E-Mail-Adresse). Fehlermeldungen müssen über den Screenreader zugänglich und verständlich sein.
-   **Warum wichtig**: Wenn eine ungültige E-Mail-Adresse eingegeben wird, muss der Screenreader die Fehlermeldung eindeutig wiedergeben, sodass der Nutzer weiß, was er korrigieren muss.

### 3. **Prüfschritt 9.1.2a – Hilfestellung bei Eingabefehlern**

-   **Beschreibung**: Hier wird geprüft, ob das System den Nutzern **Hilfestellung bei der Korrektur von Eingabefehlern** gibt. Dies könnte durch klare Fehlermeldungen oder Vorschläge zur Korrektur erfolgen (z. B. „Bitte geben Sie eine gültige E-Mail-Adresse im Format name@domain.com ein“).
-   **Warum wichtig**: Dies hilft sicherzustellen, dass Nutzer verstehen, wie sie den Fehler beheben können, indem sie klare Anweisungen erhalten.

### 4. **Prüfschritt 9.2.1a – Pflichtfelder sind eindeutig gekennzeichnet**

-   **Beschreibung**: Dieser Prüfschritt stellt sicher, dass **Pflichtfelder eindeutig als solche gekennzeichnet** sind. Für Screenreader-Nutzer muss es klar sein, dass ein E-Mail-Feld obligatorisch ist, z. B. durch eine Textmeldung „Dieses Feld ist erforderlich“.
-   **Warum wichtig**: Pflichtfelder sollten als solche markiert sein, damit der Nutzer keine wichtigen Felder übersieht oder versehentlich leer lässt.

### 5. **Prüfschritt 9.3.1a – Beschriftung von Formularfeldern durch Label-Elemente**

-   **Beschreibung**: Überprüfung, ob Eingabefelder durch **korrekte Labels** beschriftet sind. Das Label-Element ist besonders wichtig für die korrekte Ansage der Funktion eines Formularfeldes (z. B. „E-Mail-Adresse“), die vom Screenreader vorgelesen wird.
-   **Warum wichtig**: Eine korrekte Beschriftung ermöglicht es blinden Nutzern, schnell und effizient zu verstehen, welche Eingabe von ihnen erwartet wird.

### 6. **Prüfschritt 9.3.2a – Automatische Fehlererkennung und Korrekturvorschläge**

-   **Beschreibung**: Dieser Prüfschritt stellt sicher, dass das Formular **automatisch Eingabefehler erkennt** (z. B. eine falsch formatierte E-Mail-Adresse) und dem Nutzer **Korrekturvorschläge** macht.
-   **Warum wichtig**: Blinde Nutzer, die Fehler machen, sollten direkte Rückmeldungen bekommen, und das System sollte Vorschläge zur Korrektur geben, wie z. B. „Die E-Mail-Adresse scheint ungültig zu sein. Bitte überprüfen Sie das @-Zeichen“.

### 7. **Prüfschritt 9.4.1a – Benutzerfreundliche Vorschläge und Autovervollständigung**

-   **Beschreibung**: Prüfung, ob **benutzerfreundliche Vorschläge** oder eine **Autovervollständigung** angeboten werden, wenn es relevant ist. Zum Beispiel könnten Vorschläge für die E-Mail-Domain angezeigt werden (z. B. „@gmail.com“).
-   **Warum wichtig**: Diese Funktion erleichtert das Ausfüllen und reduziert Fehler bei der Eingabe, insbesondere für blinde Nutzer.

---

### **Fazit**:

Die genannten BITV-Prüfschritte decken alle wichtigen Anforderungen ab, um sicherzustellen, dass blinde Nutzer mit Screenreadern ein E-Mail-Feld korrekt ausfüllen können. Sie umfassen die richtige Beschriftung von Feldern, die Bereitstellung von klaren Fehlermeldungen und Korrekturvorschlägen sowie die Markierung von Pflichtfeldern. Diese Maßnahmen tragen erheblich zur Barrierefreiheit von Formularen bei.

# "Bitte mache eine Liste der Prüfkapitel zu denen die erwähnten Prüfschritte gehören. Es sind keine Erläuterungen nötig."

Hier ist die Liste der Prüfkapitel, zu denen die erwähnten Prüfschritte gehören:

1. **9.1.1a – Beschriftungen und Anweisungen zu Eingabefeldern**

    - **Kapitel 9.1 – Verständliche Eingabehilfen**

2. **9.1.1b – Fehlermeldungen klar und verständlich**

    - **Kapitel 9.1 – Verständliche Eingabehilfen**

3. **9.1.2a – Hilfestellung bei Eingabefehlern**

    - **Kapitel 9.1 – Verständliche Eingabehilfen**

4. **9.2.1a – Pflichtfelder sind eindeutig gekennzeichnet**

    - **Kapitel 9.2 – Pflichtfelder**

5. **9.3.1a – Beschriftung von Formularfeldern durch Label-Elemente**

    - **Kapitel 9.3 – Strukturierte und beschriftete Eingabefelder**

6. **9.3.2a – Automatische Fehlererkennung und Korrekturvorschläge**

    - **Kapitel 9.3 – Strukturierte und beschriftete Eingabefelder**

7. **9.4.1a – Benutzerfreundliche Vorschläge und Autovervollständigung**
    - **Kapitel 9.4 – Benutzerfreundlichkeit bei der Eingabe**

# "baue aus den BITV Prüfschritten einen U-Bahn-Plan mit Linien in verschiedenen Farben. Die Bahnlinien sollen sich an den Prüfkapiteln orientieren. Eine Streckte entsteht durch Aneinanderreihung von Prüfschritten."

Um einen U-Bahn-Plan auf Basis der **BITV-Prüfschritte** (Barrierefreie-Informationstechnik-Verordnung) zu gestalten, lässt sich jede Bahnlinie einem Prüfcapitel zuordnen. Jede Linie besteht dann aus mehreren Stationen, die jeweils einen Prüfschritt repräsentieren. Die verschiedenen Kapitel und ihre Prüfschritte werden zu "Bahnlinien" in unterschiedlichen Farben, die sich an bestimmten Stationen ("Prüfschritte") kreuzen, wo Prüfungen in mehreren Bereichen relevant sind.

Hier eine Struktur für den U-Bahn-Plan:

### **Linien (Kapitel)**

1. **Linie 1: Wahrnehmbarkeit** (z. B. Blau)
    - Prüfschritte: 1.1.1, 1.1.2, 1.2.1, 1.3.1, etc.
2. **Linie 2: Bedienbarkeit** (z. B. Rot)
    - Prüfschritte: 2.1.1, 2.2.1, 2.4.1, 2.5.1, etc.
3. **Linie 3: Verständlichkeit** (z. B. Grün)
    - Prüfschritte: 3.1.1, 3.2.1, 3.3.1, etc.
4. **Linie 4: Robustheit** (z. B. Gelb)
    - Prüfschritte: 4.1.1, 4.1.2, etc.

### **Verschiedene Stationen (Prüfschritte)**

-   **Linie 1: Wahrnehmbarkeit (Blau)**

    -   **1.1.1**: Alternativtexte für Bilder (Erste Station)
    -   **1.1.2**: Audio- und Videoinhalte
    -   **1.2.1**: Unterschriften von nicht-textuellem Inhalt
    -   **1.3.1**: Inhaltsstruktur und Beziehungen

-   **Linie 2: Bedienbarkeit (Rot)**

    -   **2.1.1**: Tastaturbedienbarkeit (Erste Station)
    -   **2.2.1**: Zeitbegrenzungen
    -   **2.4.1**: Navigation und Fokus
    -   **2.5.1**: Eingabehilfen

-   **Linie 3: Verständlichkeit (Grün)**

    -   **3.1.1**: Lesbarkeit (Erste Station)
    -   **3.2.1**: Vorhersehbarkeit der Navigation
    -   **3.3.1**: Eingabefehler erkennen und korrigieren

-   **Linie 4: Robustheit (Gelb)**
    -   **4.1.1**: Kompatibilität mit assistierenden Technologien (Erste Station)
    -   **4.1.2**: Nutzung von validem Code

### **Kreuzungspunkte:**

An einigen Stationen kreuzen sich die Linien. Hier greifen Prüfschritte auf mehreren Ebenen ineinander:

-   **Station 1.1.1 (Alternativtexte)** kann sowohl bei **Wahrnehmbarkeit (Linie 1)** als auch bei **Bedienbarkeit (Linie 2)** eine Rolle spielen.
-   **Station 2.4.1 (Navigation und Fokus)** könnte auch bei **Verständlichkeit (Linie 3)** relevant sein.

**Visualisierungsidee**:

-   **U-Bahn-Linien** in den oben genannten Farben.
-   **Knotenpunkte**, an denen sich Linien kreuzen, stellen Prüfbereiche dar, die für mehrere Zugänglichkeitsaspekte wichtig sind.
-   Jede Linie führt von einer Station (Prüfschritt) zur nächsten.

Falls du möchtest, könnte ich dir eine detaillierte Liste aller Prüfschritte in Form einer Tabelle geben, die du dann für die Planung deines Diagramms oder deiner Visualisierung verwenden kannst!

# Detaillierte Liste aller Prüfschritte in Form einer Tabelle

Hier ist eine detaillierte Tabelle der **BITV 2.0 Prüfschritte**, gegliedert nach Kapiteln und orientiert an der WCAG 2.1 (Web Content Accessibility Guidelines). Du kannst sie als Grundlage für die Linien und Stationen in deinem U-Bahn-Plan verwenden.

### **Kapitel 1: Wahrnehmbarkeit (Linie 1 - Blau)**

| **Prüfschritt** | **Beschreibung**                                                       |
| --------------- | ---------------------------------------------------------------------- |
| **1.1.1**       | Alternativtexte für Nicht-Text-Inhalte                                 |
| **1.2.1**       | Audiodeskription für Multimedia                                        |
| **1.2.2**       | Untertitel für Video                                                   |
| **1.2.3**       | Audiodeskription und Medienalternative                                 |
| **1.3.1**       | Info und Beziehungen korrekt kodieren                                  |
| **1.3.2**       | Bedeutung von Inhalten ist unabhängig von Formatierungen (z. B. Farbe) |
| **1.3.3**       | Eingabefelder korrekt kennzeichnen                                     |
| **1.4.1**       | Farben sind nicht allein Informationsträger                            |
| **1.4.3**       | Kontraste (Text/Bild-Text)                                             |
| **1.4.4**       | Textskalierbarkeit ohne Funktionsverlust                               |
| **1.4.5**       | Nicht-Text-Inhalte in Text-Form (z. B. für Logos)                      |

---

### **Kapitel 2: Bedienbarkeit (Linie 2 - Rot)**

| **Prüfschritt** | **Beschreibung**                                                        |
| --------------- | ----------------------------------------------------------------------- |
| **2.1.1**       | Tastaturbedienbarkeit (Alles mit der Tastatur bedienbar)                |
| **2.1.2**       | Keine Tastaturfalle (Fokus kann immer verlassen werden)                 |
| **2.2.1**       | Zeitbegrenzungen (Kontrollierbar oder verlängerbar)                     |
| **2.2.2**       | Bewegungs- oder Blink-Anforderungen minimieren                          |
| **2.3.1**       | Keine Inhalte, die Anfälle auslösen können (z. B. Blitzmuster)          |
| **2.4.1**       | Tastatur-Fokus sichtbar machen                                          |
| **2.4.2**       | Mehrere Navigationswege                                                 |
| **2.4.3**       | Sinnvolle Fokus-Reihenfolge                                             |
| **2.4.4**       | Links haben aussagekräftige Beschreibungen                              |
| **2.5.1**       | Touch-Gesten und Bewegungen als alternative Bedienelemente unterstützen |

---

### **Kapitel 3: Verständlichkeit (Linie 3 - Grün)**

| **Prüfschritt** | **Beschreibung**                                                 |
| --------------- | ---------------------------------------------------------------- |
| **3.1.1**       | Lesbare Inhalte (Sprache klar und eindeutig)                     |
| **3.1.2**       | Dokumentierte Sprache im HTML-Code festlegen                     |
| **3.2.1**       | Keine plötzlichen Kontextwechsel bei Benutzereingaben            |
| **3.2.2**       | Vorhersehbare Navigation                                         |
| **3.3.1**       | Hilfe bei Fehlern (zum Beispiel verständliche Fehlermeldungen)   |
| **3.3.2**       | Unterstützung bei der Eingabe, z. B. durch Autovervollständigung |
| **3.3.3**       | Fehlermeldungen korrekt interpretieren und Benutzer unterstützen |

---

### **Kapitel 4: Robustheit (Linie 4 - Gelb)**

| **Prüfschritt** | **Beschreibung**                                                   |
| --------------- | ------------------------------------------------------------------ |
| **4.1.1**       | Kompatibilität mit Benutzeragenten und assistierenden Technologien |
| **4.1.2**       | Sauberer HTML-Code (ohne Fehler in den Auszeichnungen)             |

---

### **Verbindungspunkte:**

-   **Linie 1 & Linie 2:**
    -   **1.1.1 (Alternativtexte)** → **2.1.1 (Tastaturbedienbarkeit)**: Beide Schritte betreffen die Nutzbarkeit von Inhalten durch Menschen mit verschiedenen Behinderungen.
-   **Linie 1 & Linie 3:**

    -   **1.3.1 (Info und Beziehungen)** → **3.1.1 (Lesbare Inhalte)**: Struktur und Klarheit gehen Hand in Hand.

-   **Linie 2 & Linie 3:**
    -   **2.4.1 (Sichtbarer Fokus)** → **3.2.1 (Vorhersehbares Verhalten)**: Navigationshilfen und Lesbarkeit überschneiden sich.

---

### **Visualisierungsansatz:**

1. **Linienfarben**:
    - Wahrnehmbarkeit = Blau
    - Bedienbarkeit = Rot
    - Verständlichkeit = Grün
    - Robustheit = Gelb
2. **Jede Station** auf der Linie repräsentiert einen Prüfschritt.
3. **Kreuzungen** zeigen, wo Schritte in mehreren Kategorien relevant sind.

Das kann als Grundlage für ein **U-Bahn-Diagramm** dienen, bei dem sich die Linien an den Schnittstellen wie bei einem echten Stadtplan überkreuzen. Wenn du möchtest, kannst du jetzt damit beginnen, diese Struktur grafisch in ein U-Bahn-Netz zu übertragen!

# "Wie kann ich ein sicheres Grün-Rot-Schema entwickelt, das auch für Farbenfehlsichtige unterscheidbar ist?"

Um ein **sicheres Grün-Rot-Schema** zu entwickeln, das auch für **farbenfehlsichtige Personen** (insbesondere Menschen mit Rot-Grün-Schwäche oder Farbenblindheit) gut unterscheidbar ist, müssen einige zusätzliche visuelle Hinweise und Designprinzipien beachtet werden. Hier sind einige Strategien, um ein solches Schema zu erstellen:

### 1. **Farbtöne mit unterschiedlicher Helligkeit wählen**

-   Verwende Grüntöne und Rottöne mit deutlich unterschiedlichen **Helligkeitswerten** (Luminanz). Das sorgt dafür, dass auch Menschen mit Rot-Grün-Sehschwäche die Farben durch Helligkeitsunterschiede voneinander unterscheiden können.
-   **Tipp**: Teste das Farbschema in Graustufen, um sicherzustellen, dass es auch ohne Farbunterscheidung noch erkennbar ist.

### 2. **Zusätzliche visuelle Unterscheidungsmerkmale verwenden**

-   Verwende neben den Farben auch **andere visuelle Elemente** wie Symbole, Muster, Texturen oder Linienarten, um die verschiedenen Zustände zu kennzeichnen.
-   **Beispiele**: Für rot könnte ein Kreuzsymbol oder ein gestricheltes Muster verwendet werden, für grün ein Häkchen oder ein durchgehendes Muster.

### 3. **Verwendung von Farbkontrast**

-   Achte darauf, dass es einen hohen **Kontrast** zwischen den verwendeten Farben gibt. Ein guter Kontrast hilft Menschen mit allen Arten von Sehbehinderungen, die Informationen besser wahrzunehmen.
-   **Tipp**: Nutze Online-Tools zur Überprüfung des Kontrasts, um sicherzustellen, dass der Kontrast auch für Farbenfehlsichtige ausreichend ist (z. B. WebAIM Color Contrast Checker).

### 4. **Verwendung von Farben außerhalb des reinen Grün-Rot-Spektrums**

-   Vermeide reine Grün- und Rottöne. Stattdessen können leicht abgewandelte Farben wie **Gelbgrün** und **Dunkelrot** oder **Türkis** und **Rotbraun** verwendet werden. Diese sind oft für Farbenfehlsichtige besser unterscheidbar.
-   **Empfohlene Farben**:
    -   Grün: #A3D977 (Helles Gelbgrün)
    -   Rot: #D9534F (Dunkleres Rot)

### 5. **Vermeide alleinige Farbkennzeichnung**

-   Farben sollten **nicht das einzige Mittel** sein, um wichtige Informationen zu vermitteln. Ergänze farbige Markierungen immer durch Text, Symbole oder andere visuelle Indikatoren.
-   **Beispiel**: Statt nur ein grünes Licht für „aktiv“ und ein rotes Licht für „inaktiv“ anzuzeigen, könntest du zusätzlich „aktiv“ und „inaktiv“ als Text angeben.

### 6. **Simuliere Farbenfehlsichtigkeit mit Tools**

-   Verwende Online-Simulationstools oder Designsoftware, um zu überprüfen, wie dein Schema für Menschen mit **Protanopie** (Rotblindheit), **Deuteranopie** (Grünblindheit) oder **Tritanopie** (Blaublindheit) aussieht.
-   **Tools**: Coblis (Color Blindness Simulator), Color Oracle, oder in Design-Programmen wie Adobe Photoshop gibt es entsprechende Vorschauen.

### 7. **Testen mit echten Nutzern**

-   Wenn möglich, teste dein Farbschema mit Menschen, die eine Farbsehschwäche haben, um sicherzustellen, dass die Kombinationen in der Praxis gut funktionieren.

### Fazit:

Ein sicheres Grün-Rot-Schema für farbenfehlsichtige Menschen sollte nicht allein auf Farben basieren, sondern auch **Helligkeitsunterschiede**, **Symbole**, **Muster** und **hohen Farbkontrast** einbeziehen. Verwende Tools zur Simulation von Farbsehschwächen und teste dein Design, um sicherzustellen, dass es für alle Nutzer zugänglich ist.

# "Schreibe eine kurze Zusammenfassung davon"

Um ein Grün-Rot-Schema zu entwickeln, das auch für Farbenfehlsichtige unterscheidbar ist, sollten verschiedene Designprinzipien angewendet werden: Verwende **Farbtöne mit unterschiedlicher Helligkeit**, ergänze Farben mit **anderen visuellen Merkmalen** wie Symbole oder Muster und achte auf **hohen Farbkontrast**. Statt reiner Grün- und Rottöne eignen sich abgewandelte Farben wie **Gelbgrün** und **Dunkelrot** besser. Nutze Simulationstools, um die Wirkung auf Farbenfehlsichtige zu überprüfen, und ergänze farbige Markierungen immer durch Text oder Symbole.

![U-Bahn-Plan der BITV Prüfschritte](assets/figures/chat-gpt-map-1.webp)

![U-Bahn-Plan der BITV Prüfschritte](assets/figures/chat-gpt-map-2.webp)
