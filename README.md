# flow · Onepager

Die Website von Flo (Florian Piechullek Communications & Brandbuilding), Marke **flow**.
Stand: **V0.1, Testversion**. Die Seite ist nicht indexiert (`noindex` + `robots.txt`).

Live: https://flowdmc.github.io/

## Was wo steht

| Datei | Inhalt |
|---|---|
| `index.html` | Alle Texte der Seite, nach Sektionen kommentiert |
| `404.html` | Seite nicht gefunden |
| `impressum.html`, `datenschutz.html` | **Entwürfe**, Angaben fehlen noch, vor öffentlicher Nutzung prüfen lassen |
| `assets/css/style.css` | Gestaltung, Farbrollen für Tag und Nacht als CSS-Variablen |
| `assets/js/main.js` | Schalter Tag/Nacht, Protokollzeile, Menü mobil, Anfrage-Leiste, Formular |
| `assets/fonts/` | Poppins und Lato als woff2, lokal (SIL Open Font License, siehe `OFL-*.txt`) |
| `assets/img/` | Favicon, später Fotos als WebP |
| `robots.txt` | Sperrt Suchmaschinen, solange Testversion |

Texte ändern: direkt in `index.html`. Kein Build-Schritt, kein Framework.

## Lokal ansehen

```
python3 -m http.server 8000
```

Dann http://localhost:8000 öffnen.

## Deploy

GitHub Pages aus `main`, Ordner root. Jeder Push auf `main` ist nach ein bis zwei Minuten live.

## Offene Schritte

1. **Form.taxi:** Formular-ID in `index.html` bei `data-form-id` eintragen und `action="https://form.taxi/s/<ID>"` setzen. Bis dahin zeigt das Formular einen Hinweis auf LinkedIn.
2. **Impressum und Datenschutz:** Anschrift, E-Mail, Telefon, Umsatzsteuerstatus ergänzen, Texte prüfen lassen.
3. **Foto:** als WebP nach `assets/img/`, in `.foto` im Kopf einsetzen (`width`, `height`, `alt`).
4. **Nachweise:** Nach Freigabe MD Elektro und Sony nennen (Stellen in `index.html` kommentiert).
5. **Livegang öffentlich:** eigene Domain per `CNAME`, dann `noindex` und `robots.txt` erst mit Flos Freigabe öffnen.
