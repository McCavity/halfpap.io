# halfpap.io — Brand-Assets

Wortmarken und H-Mark, abgeleitet aus der Design-DNA der Seite
(`shared/css/tokens.css`, `shared/favicon.svg`). Alle SVGs sind **pfadbasiert**
(Glyphen in Kurven konvertiert) → sie brauchen keine installierte Schrift und
funktionieren überall (Web, GIMP, InkScape, Word, Print). PNG-Exporte (4×,
transparent) liegen unter `png/`.

## Bausteine

| Datei | Inhalt | Einsatz |
|---|---|---|
| `wortmarke-halfpap-io-ink.svg` | `halfpap.io` einfarbig (Tinte `#11151c`) | S/W, Briefkopf, Print, helle Fläche |
| `wortmarke-halfpap-io-white.svg` | `halfpap.io` einfarbig (weiß) | dunkle Fläche |
| `wortmarke-halfpap-io-akzent.svg` | `halfpap` Tinte + `.io` Akzentblau `#1f5fd0` | farbig, helle Fläche |
| `wortmarke-halfpap-io-akzent-dark.svg` | `halfpap` weiß + `.io` `#6aa0ff` | farbig, dunkle Fläche |
| `wortmarke-name-ink.svg` | `Henning Halfpap` + Subline (justiert) | Signatur/Briefkopf, helle Fläche |
| `wortmarke-name-white.svg` | dito, weiß | dunkle Fläche |
| `mark.svg` | H-Mark (blaues Rundquadrat, weißes H) | Favicon, Avatar, Stempel |

## Regeln

- **Mark nie mit der Wortmarke kombinieren** — eine Majuskel-Marke neben dem
  konsequent kleingeschriebenen Schriftzug beißt sich typografisch. Das Mark
  steht **solo** (Favicon/Avatar), die Wortmarke steht **allein**.
- **Wortmarke kleingeschrieben** (`halfpap.io`) — nie kapitalisieren.
- Subline der Namens-Wortmarke ist auf die exakte Namensbreite justiert
  (Whitespace ums `·` symmetrisch aufgezogen); nicht manuell umbrechen.

## Farben & Schrift

- Akzent: `#1f5fd0` (hell) · `#6aa0ff` (dunkel)
- Tinte: `#11151c` · Weiß: `#ffffff` · Muted: `#525a68` / `#9aa3b2`
- Schrift: **Space Grotesk 700** (Wortmarke/Name), **Inter 500** (Subline)

> Generiert aus den self-hosted Fonts via fontTools (Pfad-Extraktion) +
> Chrome-headless (PNG-Raster). Regenerierbar bei Font-/Farb-Änderung.
