# Prüfschritt 9.2.4.3 Schlüssige Reihenfolge bei der Tastaturbedienung

Die Reihenfolge, in der Links, Formularelemente und interaktive Objekte mit der Tastatur bedient werden, muss schlüssig und nachvollziehbar sein.

-   Die Tabulatorreihenfolge soll der visuellen Anordnung folgen
-   Keine Sprünge oder unerwartete Reihenfolgen bei der Navigation mit der Tabulatortaste
-   Dynamisch eingefügte Inhalte sollen nach dem auslösenden Element im Quellcode erscheinen
-   Modal-Fenster und Dialoge müssen den Fokus erhalten und ihn nach Schließen an das auslösende Element zurückgeben
-   Keine mehrfach aufeinanderfolgenden unsichtbaren Tab-Ziele

_BITV-Originaltext:_

## Was wird geprüft?

Wenn die Webseite mit der Tastatur bedient wird, soll die Reihenfolge, in der Links, Formularelemente und Objekte angesteuert werden, schlüssig und nachvollziehbar sein.

## Warum wird das geprüft?

Die Bedienung soll geräteunabhängig möglich sein. Das bedeutet: Sie muss sowohl mit einem Zeiger (Maus, Touch-Geste) als auch mit der Tastatur möglich sein. Auch andere Eingabeformen, etwa die Spracheingabe oder Schaltersteuerung, sind auf eine gute Tastaturbedienbarkeit und eine sinnvolle Fokusreihenfolge angewiesen.

Probleme gibt es meistens mit der Tastaturbedienung, denn die Mehrzahl der Webnutzenden arbeitet mit der Maus, daher wird oft nur an sie gedacht. Auf die Tastaturbedienbarkeit angewiesen sind zum Beispiel viele motorisch eingeschränkte Menschen oder Blinde.

Bei einer nicht nachvollziehbaren Fokusreihenfolge laufen Nutzende Gefahr, die Orientierung zu verlieren, die Tastaturbedienbarkeit kann dadurch erheblich beeinträchtigt sein.

Manche Seiten präsentieren mittels JavaScript dynamische Inhalte. Rückmeldungen bei fehlerhaften Formular-Eingaben werden beispielsweise dynamisch unter dem Feld angezeigt oder Dialoge werden eingeblendet. Während diese Änderungen der Seite für sehende Nutzende unmittelbar wahrnehmbar sind, werden sie von Screenreader-Nutzenden gar nicht oder erst mit Verzögerung wahrgenommen.

Werden weitere Elemente über DOM-Scripting in den Quellcode einer Seite dynamisch eingefügt (d.h. ohne dass die Seite neu lädt), soll diese Einfügung **unterhalb** des auslösenden Elements geschehen, damit Screenreader hinzugefügte Elemente bemerken und vorlesen.

Werden Elemente an anderer Stelle im DOM eingefügt, etwa am Seitenende (das ist oft bei Modalen Dialogen der Fall), müssen Scripte für ein sinnvolles Fokusmanagement sorgen und damit eine sinnvolle Fokusreihenfolge gewährleisten.

## Wie wird geprüft?

### 1\. Anwendbarkeit des Prüfschritts

Der Prüfschritt ist anwendbar, wenn die Seite Links, Formularelemente oder Objekte (z. B. Menüs oder Dialoge, die nach Interaktion eingeblendet werden) enthält.

### 2\. Prüfung

1.  Seite im Firefox Browser laden.
2.  Mit der Tabulatortaste die Links, Formularelemente und Objekte durchgehen und prüfen, ob die Reihenfolge im Wesentlichen nachvollziehbar ist.
3.  Seite in Chrome aufrufen und die Prüfung wiederholen.

#### 2.1 Prüfung von dynamisch eingefügten Inhalten

Wenn Inhalte dynamisch generiert werden (also Interaktionen auf der Seite Inhalte hinzufügen, die nicht schon in der Ansicht ohne CSS auf der frisch geladenen Seite sichtbar sind):

1.  Seite im [Firefox](https://www.bitvtest.de/bitv_test/das_testverfahren_im_detail/werkzeugliste.html#firefox) aufrufen.
2.  Voreinstellung im Firefox: Im Browser-Menü _Einstellungen_ wählen. Dort im Bereich "Surfen" die Option "Markieren von Text mit der Tastatur zulassen" auswählen. Hierdurch wird die Cursor-Position als blinkende Einfügemarke angezeigt. Dies entspricht in der Regel dem Screenreader-Fokus.
3.  Dynamisch eingefügte Inhalte aufrufen, etwa durch Formulareingabe oder Auslösen einer Schaltfläche.
4.  Browsereigenes Entwicklerwerkzeug (_Inspektor_ für Firefox) aufrufen, das Element-Symbol (das Icon zeigt den Cursor auf einer Taste) links in der Menüleiste auswählen und den eingefügten Inhalt anklicken. Im eingeblendeten Fenster lässt sich nun der generierte Quellcode im Zusammenhang einsehen.
5.  Position des eingefügten Elements prüfen.

    -   Fall 1: Erscheint der eingefügte Inhalt im Quellcode **unterhalb** des auslösenden Elements (Siehe dazu die Erläuterung in Abschnitt [3\. Hinweise](#_3_hinweise)).
    -   Fall 2: Wenn generierte Pseudo-Fenster (Modalen Dialogen) im Quellcode nicht direkt nach dem auslösenden Element, sondern **an anderer Stelle**, etwa ganz am Seitenende, eingefügt werden:

6.  Pseudo-Fenster schließen und vom auslösenden Element aus erneut mit der Tastatur aufrufen.
7.  Erkennen auch Screenreader-Nutzer, dass ein neuer Inhalt hinzugefügt wurde? Das kann auf verschiedene Weise geschehen, z. B.:

    -   Der Fokus wird über ein Skript zum Beginn des eingefügten Elements verschoben (die blinkende Einfügemarke ist an dessen Beginn sichtbar)
    -   Der Link-/Button-Text oder eine Eigenschaft des auslösenden Elements (etwa `disabled`) wird geändert **und** beim Weiter-Tabben erhält das hinzugefügte Element den nächsten Fokus

8.  Wird der Fokus auf das auslösende Element zurückverschoben, wenn das Pseudo-Fenster geschlossen wird?

### 3\. Hinweise

-   Die Tabulatorreihenfolge sollte im Wesentlichen der visuellen Anordnung auf dem Bildschirm folgen. Kleinere Abweichungen sind kein Problem, manchmal ist es ja auch gar nicht möglich, aus der Anordnung auf dem Bildschirm eine Reihenfolge zwingend abzuleiten.
-   Die Tabulatorreihenfolge ist schwer nachzuvollziehen, wenn sie über unsichtbare ausführbare Elemente geht. Das betrifft insbesondere aufeinander folgende nicht sichtbare Sprunglinks.
-   Wenn die Tabulatorreihenfolge nicht gut erkennbar ist, weil z. B. die Fokushervorhebung unterdrückt wird, ist das Bookmarklet [Show Tab Focus](https://codepen.io/jeffsmith/details/beb) von Jeff Smith ein hilfreiches Werkzeug zum hervorheben der aktuellen Position.
-   Die Prüfung erfolgt bei **eingeschaltetem** JavaScript.
-   Der Prüfer muss mit der Funktionsweise der eingesetzten Browser vertraut sein, er muss wissen, welche Tasten und Tastenkombinationen für die Tastaturbedienung vorgesehen sind.

    Wichtig in diesem Zusammenhang: **Die Felder von Formularen können ggf. trotz korrekter Auszeichnung unter Umständen nicht mit der Tabulatortaste durchwandert werden. Wenn das Browserfenster nicht den Fokus hat, darf man nicht einfach hineinklicken und dann erst mit der Tastaturbedienung anfangen. Der Fokus muss vielmehr per Tastatur (F6) zum Browserfenster bewegt werden.** Auswahllisten ohne Submit-Button, die auf `onchange` reagieren, können ggf. mit den Pfeiltasten allein nicht bedient werden, da immer schon die erste Listenoption ausgelöst wird. Um solche Auswahllisten durchzublättern, muss man sie ggf. zunächst mit der Tastenkombination "ALT + Pfeil nach unten" öffnen. Dann kann man mit den Pfeiltasten nach oben und unten durch die Optionen blättern und mit der Eingabetaste eine Option auswählen.

-   Die [ARIA Authoring Practices Guide (APG)](https://www.w3.org/WAI/ARIA/apg/) bieten eine Orientierung, welche Fokusreihenfolge / welches Fokusmanagement bei bestimmten Widget-Typen zu erwarten ist.

#### Zur Einfügung dynamisch generierter Inhalte unterhalb des auslösenden Elements

In manchen Fällen kann es angemessen sein, Inhalte nicht unmittelbar nach dem auslösenden Element, sondern weiter unten auf der Seite dynamisch einzufügen bzw. zu aktualisieren. Ein Beispiel ist die dynamische Ergebnisanzeige unterhalb eines mehrstufigen Suchformulars. Hier ist zu prüfen, ob das dynamische Verhalten des Formulars schon aus dem Kontext der Eingabefelder bzw. Auswahllisten heraus bzw. durch erläuternde Texte oder Hilfefunktionen deutlich wird.

### 4\. Bewertung

#### Erfüllt

-   Die Reihenfolge, in der Links, Formularelemente und Objekte mit der Tabulatortaste angesteuert werden, ist im Wesentlichen nachvollziehbar und schlüssig.

#### Nicht voll erfüllt

-   Die Tabulatorreihenfolge ist nicht schlüssig, sie weicht ohne nachvollziehbaren Grund von der visuellen Anordnung ab oder der Tastaturfokus durchläuft mehr als drei aufeinanderfolgende, nicht-sichtbare Stationen.
-   Pseudofenster, die außerhalb der normalen Quellcodereihenfolge, also etwa am Seitenende, eingefügt werden, erhalten nicht unmittelbar oder beim nächsten Tabben den Fokus.
-   Beim Schließen von Pseudofenstern wird der Fokus nicht auf das auslösende Element zurückgesetzt.

#### Nicht erfüllt

-   Die Reihenfolge, in der Links, Formularelemente und Objekte mit der Tabulatortaste angesteuert werden, ist nicht nachvollziehbar und erschwert die Bedienung mit der Tastatur erheblich.

## Quellen

-   Knowbility: [Let’s Focus on Slide-Out Navigation](https://knowbility.org/blog/2020/accessible-slide-menus) (March 2020)

## Einordnung des Prüfschritts

### Abgrenzung zu anderen Prüfschritten

-   In diesem Prüfschritt wird die **Tabreihenfolge** geprüft, egal, ob diese der Anordnung fokussierbarer Elemente im Quellcode entspricht oder über `tabindex` und Skripte erzeugt wird.
-   Die grundsätzliche **Erreichbarkeit** und **Auslösbarkeit** von interaktiven Elementen ist Gegenstand von Prüfschritt 9.2.1.1 "Ohne Maus nutzbar".
-   Die **Sichtbarkeit** des Fokus ist Gegenstand von Prüfschritt 9.2.4.7 "Aktuelle Position des Fokus deutlich".
