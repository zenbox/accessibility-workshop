# Prüfschritt 9.1.1.1d Alternativen für CAPTCHAs

CAPTCHAs sind Prüfmechanismen, um echte Nutzer von Bots zu unterscheiden. Bildbasierte CAPTCHAs mit verzerrten Zeichen sind für blinde und sehbehinderte Menschen nicht nutzbar, Audio-CAPTCHAs sind für hörgeschädigte Personen problematisch. Deshalb muss es mindestens eine barrierefreie Alternative geben.

Das Bild eines CAPTCHA muss einen Alternativtext haben, der den Zweck beschreibt (z. B. „Geben Sie die Zeichen aus dem Bild ein“) und darauf hinweist, wie eine alternative Methode genutzt werden kann.

Webseiten sollten sicherstellen, dass barrierefreie Alternativen direkt in der Nähe des CAPTCHAs angeboten werden. Ohne eine solche Alternative ist das CAPTCHA nicht barrierefrei und verstößt gegen die Richtlinien.

_BITV-Originaltext:_

## Was wird geprüft?

In bildbasierten CAPTCHAs soll der Alternativtext des Bildes den Zweck des CAPTCHAs beschreiben und angeben, wie eine nicht bildbasierte Alternative zu finden ist.

Mindestens eine CAPTCHA-Alternative für ein Grafik-Captcha oder Audio-Captcha muss vorhanden sein.

## Warum wird das geprüft?

In bildbasierten CAPTCHAs werden Bilder von Zeichenfolgen eingesetzt, welche Nutzer als Text eingeben müssen, um bestimmte Bereiche von Webangeboten zu erreichen. Für blinde und sehbehinderte Nutzer sind solche CAPTCHAs nicht zugänglich. Audio-Captchas sind für höreingeschränkte Nutzer nicht zugänglich. Deshalb soll in beiden Fällen mindestens eine CAPTCHA-Alternative angeboten werden.

Bei bildbasierten CAPCHAs soll der Alternativtext den Zweck des CAPTCHAs beschreiben und angeben, wie CAPTCHA-Alternativen zu finden sind.

## Wie wird geprüft?

### 1\. Anwendbarkeit des Prüfschritts

Der Prüfschritt ist anwendbar, wenn CAPTCHAs vorhanden sind.

Die Leserlichkeit der Zeichenfolge in einem bildbasierten CAPTCHA ist nicht Teil der Prüfung und wird nicht bewertet.

### 2\. Prüfung

#### 2.1 Prüfung der Alternativtexte von CAPTCHA-Bildern

1.  Die Seite im [Firefox](https://www.bitvtest.de/bitv_test/das_testverfahren_im_detail/werkzeugliste.html#firefox) laden.
2.  In der _Web Developer Toolbar_ das Menü _Images > Display Alt Attributes_ aufrufen. Alternativ kann auch das [Images bookmarklet](https://www.bitvtest.de/bitv_test/das_testverfahren_im_detail/werkzeugliste.html#imagesbm) eingesetzt werden.
3.  Prüfen, ob beim CAPTCHA-Bild das `alt`\-Attribut vorhanden ist und der dort hinterlegte Alternativtext den Zweck des CAPTCHAs beschreibt (zum Beispiel: "Geben sie die im Bild dargestellte Zeichenfolge ein").

#### 2.2 Vorhandensein von CAPTCHA-Alternativen

-   Prüfen, ob im unmittelbaren Kontext des bildbasierten CAPTCHAs oder Audio-Captchas eine Alternative angeboten wird.

### 3\. Hinweise

CAPTCHAs sind generell problematisch, da jede Form von CAPTCHA für manche Nutzer mit Behinderungen unzugänglich ist (siehe die WCAG 2.0 [Note on CAPTCHA](http://www.w3.org/TR/UNDERSTANDING-WCAG20/text-equiv-all.html#text-equiv-all-3-head)).

### 4\. Bewertung

#### Nicht voll erfüllt

-   Alternativtexte nennen nicht den Zweck des CAPTCHAs
-   Alternativ-CAPTCHA ist vorhanden, aber es wird darauf nicht im Alternativtext verwiesen oder es ist nicht im unmittelbaren Kontext zugänglich

#### Nicht erfüllt

-   Eine Alternative zu bildbasierten CAPTCHAs oder Audio-Captchas ist nicht vorhanden.

## Einordnung des Prüfschritts

### Abgrenzung zu anderen Prüfschritten

Auch die Texteingabe des Captchas muss zugänglich gestaltet sein, damit es insgesamt zugänglich ist. Die Zugänglichkeit der CAPTCHA-Texteingabe wird im Prüfschritt 9.3.3.2 "Beschriftungen von Formularelementen vorhanden"
