# Semantische Prüfung nach BITV 2.0

**9.1.3.1a HTML-Strukturelemente für Überschriften**

https://addons.mozilla.org/de/firefox/addon/headingsmap/

```html
<h1>Überschrift 1</h1>
<h2>Überschrift 2</h2>
<h3>Überschrift 3</h3>
<h4>Überschrift 4</h4>
<h5>Überschrift 5</h5>
<h6>Überschrift 6</h6>
```

**9.1.3.1b HTML-Strukturelemente für Listen**



```html
<ul>
    <li>Eintrag 1</li>
    <li>Eintrag 2</li>
    <li>Eintrag 3</li>
</ul>

<ol>
    <li>Eintrag 1</li>
    <li>Eintrag 2</li>
    <li>Eintrag 3</li>
</ol>

<dl>
    <dt>Begriff 1</dt>
    <dd>Erklärung 1</dd>
    <dt>Begriff 2</dt>
    <dd>Erklärung 2</dd>
</dl>
```

**Navigationslisten**

```html
<nav> oder <div role="navigation">
    <ul>
        <li><a href="link1.html">Link 1</a></li>
        <li><a href="link2.html">Link 2</a></li>
        <li><a href="link3.html">Link 3</a></li>
    </ul>
</nav>
```

**9.1.3.1c HTML-Strukturelemente für Zitate**

```html
<blockquote>
    Zitat
    <cite>Quelle</cite>
</blockquote>

<q>Zitat</q>
```

**9.1.3.1d Inhalt gegliedert**

```html
<p>Absatz 1 lorem ipsum dolor sit</p>
<p>Absatz 2 lorem ipsum dolor sit</p>
<p>Absatz 3 lorem ipsum dolor sit</p>
```

9.1.3.1e Datentabellen richtig aufgebaut

```html
<table>
    <caption>
        Überschrift
    </caption>
    <thead>
        <tr>
            <th>Spalte 1</th>
            <th>Spalte 2</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Wert 1</td>
            <td>Wert 2</td>
        </tr>
    </tbody>
</table>
```

9.1.3.1f Zuordnung von Tabellenzellen

````html
<table>
    <caption>
        Überschrift
    </caption>
    <thead>
        <tr>
            <td>[leer]</td>
            <th>Spalte 1</th>
            <th>Spalte 2</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <th scope="row">Zeile:</th>
            <td>Wert 1</td>
            <td>Wert 2</td>
        </tr>
    </tbody>
</table>

9.1.3.1g Kein Struktur– markup für Layouttabellen Tabellen nicht für andere
Zwecke als Daten verwenden! 9.1.3.1h Beschriftung von Formularelementen
programmatisch ermittelbar ```html
<form>
    <label for="vorname">Vorname</label>
    <input
        type="text"
        name="vorname"
        id="vorname"
    />
</form>
````

````html
<form>
    <fieldset>
        <legend>Eingabefeld-Gruppe</legend>
        ...
    </fieldset>
</form>
```

```html
<button aria-label="suchen"><i class="search-icon"></i></button>
```

9.4.1.2 Name, Rolle, Wert verfügbar 

```html
<input
    type="text"
    name="vorname"
    id="vorname"
    aria-label="Vorname"
    aria-required="true"
/>

Login-Widget:
<div
    role="form"
    aria-label="Login-Formular"
>
    <label for="username">Benutzername</label>
    <input
        type="text"
        name="username"
        id="username"
        aria-required="true"
    />
    <label for="password">Passwort</label>
    <input
        type="password"
        name="password"
        id="password"
        aria-required="true"
    />
    <button type="submit">Anmelden</button>
</div>
````

9.4.1.1 Korrekte Syntax

9.1.3.2 Sinnvolle Reihenfolge

9.3.1.1 Hauptsprache angegeben

```html
<html lang="de"></html>
```

9.3.12 Anderssprachige Wörter und Abschnitte ausgezeichnet

```html
<p>Das Wort <span lang="en">"computer"</span> ist englisch.</p>
```
