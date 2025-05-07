# Prüfschritt 9.3.1.2 Anderssprachige Wörter und Abschnitte ausgezeichnet

Anderssprachige Wörter und Abschnitte müssen mit `lang` ausgezeichnet sein.

-   Screenreader benötigen die korrekte Sprachauszeichnung für eine verständliche Aussprache
-   Einzelne Fremdwörter können als Teil der Hauptsprache betrachtet werden, wenn sie gebräuchlich sind
-   Fachbegriffe oder gemischte Wörter (z. B. "Webauftritt") müssen nicht ausgezeichnet werden
-   Im Quelltext wird geprüft, ob `lang="en"` oder andere Sprachattribute korrekt gesetzt sind
-   Mindestens 90 % der anderssprachigen Wörter sollten ausgezeichnet sein

_BITV-Originaltext:_

## Was wirdgeprüft?

Wenn innerhalb einer Seite Wörter und Textabschnitte in einer anderen Sprache vorkommen, müssen diese mithilfe des `lang`\-Attributs ausgezeichnet werden.

## Warum wird das geprüft?

Screenreader verwenden Wortlisten, in denen die Aussprache der Wörter festgelegt ist. Sie müssen wissen, zu welcher Sprache ein Text gehört, damit sie die richtige Wortliste verwenden und den Text korrekt aussprechen können.

## Wie wird geprüft?

### 1\. Anwendbarkeit des Prüfschritts

Der Prüfschritt ist anwendbar, wenn die Seite Wörter, ganze Sätze, Absätze oder andere größere Abschnitte in einer anderen Sprache enthält.

### 2\. Prüfung

1.  Seite im Firefox aufrufen.
2.  Das [Lang bookmarklet](https://www.bitvtest.de/bitv_test/das_testverfahren_im_detail/werkzeugliste.html) aufrufen.
3.  Prüfen, ob anderssprachige Wörter und Abschnitte richtig ausgezeichnet sind. Ausnahmen gelten für Eigennamen, Fachbegriffe und unklare Sprache (siehe [\[3.Hinweise\]](#3.Hinweise)).

### 3\. Hinweise

-   Einzelne fremdsprachige Wörter können als Teil der Sprache des umgebenden Textes betrachtet werden und müssen nicht ausgezeichnet werden, es sei denn, es ist klar, dass eine Änderung der Sprache beabsichtigt war oder die Aussprache ohne einen Sprachwechsel unverständlich wäre. In deutschen Texten ist z.B. bei Wörtern wie "Enter" oder "Helpdesk" eine Auszeichnung nicht sinnvoll: solche Begriffe sind zum einen tendenziell bereits Teil der deutschen Sprache und werden zum anderen deutsch und englisch sehr ähnlich ausgeprochen, so dass ohne Sprachauszeichnung kein praktisches Problem entsteht.
-   Ebenfalls nicht ausgezeichnet werden sollten "gemischte" Wörter. Beispiele für solche Wörter: Webauftritt, Checkpunkt.
-   Einzelne fremdsprachige Wörter müssen ausgezeichnet werden, wenn sie keinen Eingang in den deutschen Sprachgebrauch gefunden haben. Wörter, die im aktuellen "Deutschen Universalwörterbuch" des Duden-Verlags aufgenommen sind, müssen nicht ausgezeichnet werden. Die Online-Duden-Suche unter [http://www.duden.de/suchen](http://www.duden.de/suchen) erlaubt leider keine Differenzierung mehr, in welchem Duden-Wörterbuch Einträge gefunden wurden. Sie kann also allenfalls unterstützend herangezogen werden.
-   Die Wortlisten von Screenreadern sollten auch geläufige Fremdwörter enthalten. Dies ist jedoch nicht durchgängig der Fall, auch geläufige Fremdwörter werden ohne Auszeichnung falsch ausgesprochen. Daher macht ihre Auszeichnung Sinn, auch wenn sie nicht gefordert wird. Beispiele für geläufige Fremdwörter, die ausgezeichnet werden können, aber nicht müssen: Copyright, Website, Site, Homepage.

### 4\. Bewertung

### Erfüllt

-   Anderssprachige Wörter und Abschnitte sind durchgängig ausgezeichnet. Wenn einzelne anderssprachige Wörter "vergessen" worden sind, soll das nicht negativ bewertet werden. Sie sollten aber zu mindestens 90% ausgezeichnet sein

### Nicht erfüllt

-   Weniger als 50 % der anderssprachigen Wörter sind ausgezeichnet.

## Einordnung des Prüfschritts

### Abgrenzung zu anderen Prüfschritten

-   Prüfschritt 9.3.1.1 "Hauptsprache angegeben"

### Einordnung des Prüfschritts nach WCAG 2.1

#### Guideline

-   [Guideline 3.1 Readable: Make text content readable and understandable](https://www.w3.org/TR/WCAG21/#readable)

#### Success criterion

-   [3.1.2 Language of Parts](https://www.w3.org/TR/WCAG21/#language-of-parts) (Level AA)

#### Techniques

##### HTML Techniques

-   [H58: Using language attributes to identify changes in the human language](https://www.w3.org/WAI/WCAG21/Techniques/html/H58.html)

## Quellen

### Wichtigkeit der Sprachauszeichnung nach WCAG 2.1

> Identifying changes in language is important for a number of reasons:
>
> -   It allows braille translation software to follow changes in language, e.g., substitute control codes for accented characters, and insert control codes necessary to prevent erroneous creation of Grade 2 braille contractions.
> -   Speech synthesizers that support multiple languages will be able to speak the text in the appropriate accent with proper pronunciation. If changes are not marked, the synthesizer will try its best to speak the words in the default language it works in. Thus, the French word for car, "voiture" would be pronounced "voyture" by a speech synthesizer that uses English as its default language.
> -   Marking changes in language can benefit future developments in technology, for example users who are unable to translate between languages themselves will be able to use machines to translate unfamiliar languages.
> -   Marking changes in language can also assist user agents in providing definitions using a dictionary.

( [Language of Parts: Understanding SC 3.1.2](https://www.w3.org/WAI/WCAG21/Understanding/language-of-parts.html))
