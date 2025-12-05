# Übung zum semantischen Aufbau

In dieser Übung geht es darum, den semantischen Aufbau eines HTML-Dokuments zu verbessern. Du erhältst ein einfaches HTML-Dokument, das hauptsächlich aus `<div>`-Elementen besteht. Deine Aufgabe ist es, die `<div>`-Elemente durch semantischere HTML5-Elemente zu ersetzen, um die Struktur und Bedeutung des Inhalts klarer zu machen.

## Ausgangsdokument

```html<!DOCTYPE html>
<html lang="de">
    <head>
        <meta charset="UTF-8" />
        <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
        />
        <title>Meine Webseite</title>
    </head>
    <body>
        <div id="header">
            <div class="logo">Mein Logo</div>
            <div class="nav">
                <a href="#home">Home</a>
                <a href="#about">Über uns</a>
                <a href="#contact">Kontakt</a>
            </div>
        </div>
        <div id="main-content">
            <div class="article">
                <h1>Willkommen auf meiner Webseite</h1>
                <p>Dies ist ein Beispieltext für meine Webseite.</p>
            </div>
            <div class="sidebar">
                <h2>Neuigkeiten</h2>
                <p>Hier findest du die neuesten Updates.</p>
            </div>
        </div>
        <div id="footer">
            <p>&copy; 2024 Meine Webseite</p>
        </div>
    </body>
</html>
```

## Aufgabe

Ersetze die `<div>`-Elemente im obigen HTML-Dokument durch passende semantische HTML5-Elemente wie `<header>`, `<nav>`, `<main>`, `<article>`, `<aside>`, und `<footer>`. Achte darauf, dass die Struktur und Bedeutung des Inhalts erhalten bleibt.

## Lösungsvorschlag

```html<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Meine Webseite</title>
</head>
<body>
    <header>
        <div class="logo">Mein Logo</div>
        <nav>
            <a href="#home">Home</a>
            <a href="#about">Über uns</a>
            <a href="#contact">Kontakt</a>
        </nav>
    </header>
    <main>
        <article>
            <h1>Willkommen auf meiner Webseite</h1>
            <p>Dies ist ein Beispieltext für meine Webseite.</p>
        </article>
        <aside>
            <h2>Neuigkeiten</h2>
            <p>Hier findest du die neuesten Updates.</p>
        </aside>
    </main>
    <footer>
        <p>&copy; 2024 Meine Webseite</p>
    </footer>
</body>
</html>
```

## Hier ist ein fehlerhaftes Dokument

```html<!DOCTYPE html>
<html>
<head>
    <title>Fehlerhaftes Dokument</title>
</head>
<body>
    <div class="header">
        <h1>Willkommen</h1>
    </div>
    <div class="content">
        <p>Dies ist ein Beispieltext.</p>
    </div>
    <div class="footer">
        <p>&copy; 2024 Beispiel</p>
    </div>
</body>
</html>
```