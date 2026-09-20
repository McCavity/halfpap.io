#!/usr/bin/env python3
"""Vorflugkontrolle fuer sites/cadiz.

    uv run --no-project --with pillow -- python pruefen.py

Prueft, was sich mechanisch pruefen laesst und worin diese Seite schon
Fehler hatte:

  * interne Verweise (href, src, poster) zeigen auf existierende Dateien
  * jedes <img> hat alt, jedes <video> ein aria-label und kein autoplay
  * deklarierte width/height stimmen mit der Datei ueberein (Layout-Shift)
  * jede Mediendatei unter assets/ hat ihren .json-Herkunftsnachweis
  * <p>-Tags sind ausgeglichen

⚠️ Der Nachweis-Test deckt ALLE Unterordner von assets/ ab. Eine fruehere
Fassung prueft nur assets/photos und assets/video — und liess
assets/plates/album-card.png jahrelang ohne Nachweis durchgehen. Eine Grenze
schneidet immer den gesuchten Fall aus.

Exit 0 sauber, 1 Funde.

Kalibriert am 20.09.2026 an einer Kopie des Bestands: alle sechs Fehlerarten
wurden einzeln eingebaut und alle sechs gemeldet (fehlendes alt, fehlendes
aria-label, autoplay, toter Verweis, falsch deklarierte Masse, fehlender
Nachweis) — am unveraenderten Bestand meldet dasselbe Skript nichts. Beim
ersten Lauf schlug der alt-Fall NICHT an: nicht weil das Skript taub war,
sondern weil der Testaufbau danebengriff. Wer nur die Fundzahl liest und
nicht mitzaehlt, haelt so einen stillen Fehlschlag fuer ein Ergebnis.
"""
import pathlib, re, sys
from PIL import Image

WURZEL = pathlib.Path(__file__).parent
funde = []


def melde(datei, was):
    funde.append(f"{datei}: {was}")


seiten = [WURZEL / "index.html"] + sorted(WURZEL.glob("tag/*/index.html"))
verweise = 0

for s in seiten:
    h = s.read_text()
    rel = s.relative_to(WURZEL)

    for m in re.finditer(r"<img\b[^>]*>", h):
        if not re.search(r'\balt="', m.group(0)):
            melde(rel, "img ohne alt")
    for m in re.finditer(r"<video\b[^>]*>", h):
        if "aria-label=" not in m.group(0):
            melde(rel, "video ohne aria-label")
        if "autoplay" in m.group(0):
            melde(rel, "video mit autoplay (verletzt prefers-reduced-motion)")

    for _, val in re.findall(r'\b(href|src|poster)="([^"#][^"]*)"', h):
        if val.startswith(("http://", "https://", "mailto:")):
            continue
        verweise += 1
        ziel = (s.parent / val.split("#")[0]).resolve()
        if ziel.is_dir():
            ziel = ziel / "index.html"
        if not ziel.exists():
            melde(rel, f"toter Verweis: {val}")

    for m in re.finditer(r'<img[^>]*src="([^"]+)"[^>]*width="(\d+)" height="(\d+)"', h):
        f = (s.parent / m.group(1)).resolve()
        if f.exists():
            echt = Image.open(f).size
            if echt != (int(m.group(2)), int(m.group(3))):
                melde(rel, f"{m.group(1)}: deklariert {m.group(2)}x{m.group(3)}, ist {echt[0]}x{echt[1]}")

    if h.count("<p") != h.count("</p>"):
        melde(rel, f"<p> unbalanciert ({h.count('<p')} auf, {h.count('</p>')} zu)")

# Nachbarschaft: zeigt jedes Kapitel auf seine echten Nachbarn?
# ⚠️ Diese Pruefung fehlte, und genau deshalb blieb im Kapitel 12.09. ein
# `../../#tag-13-09` stehen, nachdem das Kapitel 13.09. gebaut war. Der Link
# war gueltig — er zielte nur an die Startseite statt auf das Kapitel. Wer nur
# prueft, ob ein Verweis aufloest, findet so etwas nie.
kapitel = sorted((WURZEL / "tag").glob("*/index.html"))
namen = [k.parent.name for k in kapitel]
for i, k in enumerate(kapitel):
    h = k.read_text()
    rel = k.relative_to(WURZEL)
    for richtung, nachbar in (("prev", namen[i - 1] if i else None),
                              ("next", namen[i + 1] if i + 1 < len(namen) else None)):
        m = re.search(r'chapter__nav-link--' + richtung + r'" href="([^"]+)"', h)
        if nachbar is None:
            continue
        if not m:
            melde(rel, f"kein {richtung}-Link, erwartet wurde {nachbar}")
        elif m.group(1) != f"../{nachbar}/":
            melde(rel, f"{richtung} zeigt auf {m.group(1)}, erwartet ../{nachbar}/")

# Startseite: fuehrt das Tagesbild dahin wie sein Reiter?
start = (WURZEL / "index.html").read_text()
for m in re.finditer(r'<li class="day[^"]*" id="tag-(\d\d-\d\d)">(.*?)</li>', start, re.S):
    tag, block = m.group(1), m.group(2)
    bild = re.search(r'day__thumblink" href="([^"]+)"', block)
    reiter = re.search(r'day__tab" href="([^"]+)"', block)
    if reiter and not bild:
        melde("index.html", f"Tag {tag}: Reiter verlinkt, das Bild nicht")
    elif bild and reiter and bild.group(1) != reiter.group(1):
        melde("index.html", f"Tag {tag}: Bild -> {bild.group(1)}, Reiter -> {reiter.group(1)}")

# Arbeitsreste, die nie ausgeliefert werden duerfen
for p in WURZEL.rglob("*.vor-anonymisierung"):
    melde(p.relative_to(WURZEL), "Sicherung vor der Anonymisierung — gehoert nicht ins Repo")

medien = [p for p in (WURZEL / "assets").rglob("*")
          if p.is_file() and p.suffix.lower() in {".jpg", ".jpeg", ".png", ".mp4", ".webp", ".svg"}]
for p in medien:
    if not (p.parent / (p.name + ".json")).exists():
        melde(p.relative_to(WURZEL), "kein Herkunftsnachweis (.json)")

groesse = sum(p.stat().st_size for p in medien) / 1048576
print(f"{len(seiten)} Seiten · {verweise} interne Verweise · {len(medien)} Mediendateien ({groesse:.1f} MB)")
if funde:
    print(f"\n{len(funde)} Fund(e):")
    for f in funde:
        print("  ", f)
    sys.exit(1)
print("sauber")
