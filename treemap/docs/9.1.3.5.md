# Prüfschritt 9.1.3.5 Eingabefelder zu Nutzerdaten vermitteln den Zweck

Eingabefelder für Nutzerdaten (z. B. Name, E-Mail, Telefonnummer) sollten den Zweck des Feldes klar vermitteln. Dies geschieht durch das HTML-Attribut `autocomplete`, das eine sprachunabhängige Identifikation ermöglicht.

Seite prüfen, ob:

-   Alle relevanten Eingabefelder das `autocomplete`-Attribut mit einem passenden Wert nutzen
-   Keine falschen `autocomplete`-Werte verwendet wurden

-   Nicht erfüllt: Felder für Nutzerdaten haben kein `autocomplete`-Attribut oder es ist falsch gesetzt.

_BITV-Originaltext:_

## Was wird geprüft?

Eingabefelder, die sich auf den Nutzer selbst beziehen, sollten eine semantisch eindeutige, sprachunabhängige Bestimmung ihres Zweckes ermöglichen. Geeignet dafür ist zur Zeit das HTML `autocomplete`\-Attribut, mit dem sich der Eingabezweck für Felder wie etwa Name, E-Mail oder Telefonnummer ebenso wie für Adress-Daten oder Kreditkarten-Daten definieren lässt.

Es wird erwartet, dass andere Taxonomien zur Festlegung des Zwecks von Interface-Komponenten entwickelt werden, welche die Verwendung von `autocomplete` ersetzen können.

## Warum wird das geprüft?

Die Festlegung des Eingabezwecks erlaubt es neuartigen Hilfsmitteln, bei Formularfeldern, welche sich auf Daten des Nutzers beziehen, zusätzliche Informationen anzuzeigen, und zwar unabhängig vom der jeweils gewählten Beschriftung des Feldes und unabhängig von der natürlichen Sprache des Angebots.

Zusätzliche Informationen können etwa Bilder bzw. Icons sein, die über ein Browser-Plugin oder eine externe assistive Technologie bereitgestellt werden und über bzw. vor dem jeweiligen Eingabefeld angezeigt werden, etwa wenn Nutzer eine bestimmte Tastenkombination drücken. Für Menschen, die Schwierigkeiten mit dem Lesen haben oder bevorzugt über Bilder kommunizieren, erleichtert dies eine Identifizierung von nutzerbezogenen Feldern in Formularen.

Darüber hinaus bietet `autocomplete` Eingabevorschläge für das Feld, welche Nutzer einfach übernehmen können. Das erleichtert die Texteingabe.

## Wie wird geprüft?

### 1\. Anwendbarkeit des Prüfschritts

Der Prüfschritt ist anwendbar, wenn Formular-Eingabefelder vorhanden sind, die sich auf Nutzerdaten beziehen (etwa Login / Anmeldung, Kontaktformulare, oder Seiten zum Anlegen eines Nutzerprofils).

### 2\. Prüfung

Bei Eingabefeldern, die sich auf Daten des Nutzers beziehen, mittels Developer Tools den Code inspizieren. Prüfen, ob `autocomplete`\-Werte definiert sind oder andere unterstützte Taxonomien den Eingabezweck angeben - bei Nutzung von `autocomplete` vergl. [WCAG 2.1, Abschnitt 7 Input Purposes for User Interface Components](https://www.w3.org/TR/WCAG21/#input-purposes). Prüfen, ob die korrekten Werte verwendet wurden (das `autocomplete`\-Attribut _tel_ etwa sollte nicht für eine Kreditkartennummer verwendet werden).

### 3\. Hinweis

Die Anforderung gilt nur für Felder, die sich auf den Nutzer selbst beziehen. Sie gilt nicht für Seiten, auf denen die Eingabe von persönlichen Daten mehrerer Personen möglich ist und die Felder für den Nutzer selbst nicht besonders gekennzeichnet sind. Ein Beispiel dafür sind Ticketbuchungsseiten von Fluglinien. Hier sind die Eingabefelder für den Nutzer nicht von den Feldern für Mitreisende unterscheidbar.

### 4\. Bewertung

#### Prüfschritt erfüllt

-   Alle Eingabefelder, die sich klar auf den Nutzer selbst beziehen und den dokumentierten Werten in Abschnitt 7 der WCAG 2.1 entsprechen ( [Input Purposes for User Interface Components](https://www.w3.org/TR/WCAG21/#input-purposes)), vermitteln den Zweck des jeweiligen Feldes über ein sprachunabhängiges Attribut (hinreichend unterstützt wird zur Zeit nur das `autocomplete`\-Attribut).

## Einordnung des Prüfschritts

### Einordnung des Prüfschritts nach WCAG 2.1

#### Guideline

-   [Guideline 1.3 Adaptable: Create content that can be presented in different ways (for example simpler layout) without losing information or structure.](https://www.w3.org/TR/WCAG21/#adaptable)

#### Success criterion

-   [1.3.5 Identify Input Purpose](https://www.w3.org/TR/WCAG21/#identify-input-purpose) (Level AA)

#### Sufficient Techniques

-   [H98: Using HTML 5.2 autocomplete attributes](https://www.w3.org/WAI/WCAG21/Techniques/html/H98)

#### Failures

-   [F107: Failure of Success Criterion 1.3.5 due to incorrect autocomplete attribute values](https://www.w3.org/WAI/WCAG21/Techniques/failures/F107)

## Quellen

-   [Understanding Success Criterion 1.3.5: Identify Input Purpose](https://www.w3.org/WAI/WCAG21/Understanding/identify-input-purpose.html) (zur Zeit nur auf Englisch verfügbar)
