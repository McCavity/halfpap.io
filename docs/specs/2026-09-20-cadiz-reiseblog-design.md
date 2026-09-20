# Design: Reiseblog `cadiz.halfpap.io`

> Erstellt: 2026-09-20
> Status: Approved (Brainstorm mit Henning)
> Modul: `sites/cadiz/` im Monorepo `halfpap.io`
> Löst ein: privater Vault, `04-projects/halfpap-io/spec.md` → „cadiz-countdown nach Ablauf: Reiseblog?"

## Ziel

Aus zwei Wochen Cádiz (03.–17.09.2026) einen öffentlichen Reiseblog bauen. Er soll
**unterhalten und gut aussehen**, darf **Werbung für die Stadt** machen und **ein bisschen
Wissen vermitteln** — angelehnt an den Bildungsauftrag öffentlich-rechtlicher Medien, aber
**höchstens ein solcher Absatz pro Kapitel und immer aus dem Erlebten heraus**, nie davorgestellt.

Die Seite ersetzt den abgelaufenen Countdown unter derselben Domain. Sie ist kein Ersatz für
ihn: `cadiz-countdown` wird **archiviert, nicht weggeworfen**, und kehrt bei einem neuen
Reisetermin zurück.

## Die drei Grundsatzentscheidungen

Der Auftrag stand seit dem 16.09. offen, weil drei Fragen ungeklärt waren. Sie sind es nicht
mehr.

### 1. Ort: `sites/cadiz/` im Monorepo — nicht in `cadiz-countdown`, kein eigenes Repo

Die Ausgangsfrage lautete „einziehen oder ablösen". Beide Antworten betreffen
`cadiz-countdown`. Am System gemessen gibt es einen dritten Ort, den keine der Quellen
erwähnte: **das Monorepo `halfpap.io` existiert, ist gebaut und produktiv.** Der Stand vom
30.06. („bereit für Implementierungsplan") ist überholt.

| Gemessen am 20.09.2026 | |
|---|---|
| Sites | `www` · `henning` · `maclist` · `ki-arbeitspartner` |
| Plattform | Caddy 2, Host-Port 8082, Multi-Host über `Host`-Header |
| Design-System | `shared/css` + selbst gehostete Fonts, per `sync-content.sh` gespiegelt |
| Deploy | `platform/deploy.sh` → rsync + `docker compose up -d` |
| Letzter Commit | 09.08.2026 |
| Sichtbarkeit | PUBLIC |

Damit erbt der Blog Plattform und Deploy. Er erbt **nicht** das Design-System — das war die
Bedingung, unter der diese Option gewählt wurde, und sie ist technisch gedeckt:

1. `sync-content.sh` arbeitet über eine **explizite Site-Liste**
   (`for site in www henning maclist ki-arbeitspartner`). Wer nicht darin steht, bekommt kein
   `tokens.css`. `cadiz` wird nicht eingetragen.
2. Jeder Caddy-`handle`-Block hat einen **eigenen Dokument-Root**. Was unter `sites/cadiz/`
   liegt, bestimmt allein die Site.
3. Der einzige repoweite Zwang ist die **CSP** des `(common)`-Snippets
   (`style-src 'self'; script-src 'self'; img-src 'self' data:`). Sie verbietet Inline-Styles
   und externe CDNs, nicht eigene Dateien. Canvas, WebGL, scroll-getriebene Animationen und
   View Transitions laufen damit. `sites/ki-arbeitspartner/js/genesis.js` lebt bereits so und
   nennt den Grund im Kopfkommentar. Braucht das Design mehr, bekommt der Host einen eigenen
   Header-Block.

Gegen ein eigenes Repo spricht die Rechnung, nicht das Gefühl: es kostet eine zweite
Caddy-Instanz, einen zweiten Deploy-Weg und einen zweiten Tunnel-Eintrag für null gewonnene
Gestaltungsfreiheit. Die Rechtsseiten sind ohnehin schon cross-origin verlinkt
(`https://www.halfpap.io/impressum/` aus allen Nebensites) — das wäre kein Argument gewesen.

**Eingriffe in die Plattform:**

| Datei | Änderung |
|---|---|
| `platform/Caddyfile` | ein `handle @cadiz`-Block, Root `/srv/cadiz` |
| `platform/compose.yaml` | Volume `../sites/cadiz:/srv/cadiz:ro` |
| `platform/sync-content.sh` | **keine** — `cadiz` bleibt aus der Schleife |
| Cloudflare-Tunnel | Route `cadiz.halfpap.io`: von Port 8090 (Countdown) auf Port 8082 (Caddy), selber Host |
| `cadiz-countdown` | **keine.** Repo unberührt, Container darf laufen oder gestoppt werden |

### 2. Sichtbarkeit: kein Key-Gate

Der Blog ist **vollständig öffentlich**. Damit bleibt er rein statisch — kein Server, keine
Logik, keine Sitzungen. Die Caddy-Plattform liefert ihn aus wie jede andere Site.

Das Key-Gate stirbt nicht, es **wandert nicht mit**: Es lebt unverändert in
`cadiz-countdown` weiter und kehrt mit dem Countdown zurück. Ein key-gated Zusatzbereich im
Blog hätte einen eigenen Server-Container neben Caddy erzwungen; dafür gibt es keinen Anlaß,
weil alles Veröffentlichte ohnehin geprüft wird.

### 3. Medien: im Repo-Baum, gitignored bis zum Einfrieren

Der Trennstrich verläuft nicht zwischen „Medien" und „Code", sondern zwischen **Archiv** und
**Derivat**:

- **Archiv** sind die Originale — 1.421 Fotos und 113 Videos in der Photos.app unter
  `Urlaub/2026/Cádiz/alle`, mit iCloud-Backup. Sie kommen **nie** ins Repo.
- **Derivate** sind web-optimierte Ableitungen (AVIF/WebP, ~1600 px). Sie sind Build-Input,
  nicht Bestand.

Der Kostenpunkt bei Derivaten im Git ist nicht die Größe, sondern die **Iteration**: Git kann
JPEG und AVIF nicht deltakomprimieren. Jede Design-Runde legt eine weitere vollständige Kopie
in die Historie — dauerhaft, in einem öffentlichen Repo.

**Gewählter Weg (Henning 20.09.):** Die Derivate liegen in `sites/cadiz/media/`, sind
zunächst **gitignored** und werden **beim Einfrieren des Designs** in einem einzigen Commit
getrackt. Die Seite ist danach weitgehend statisch; laufende Überarbeitung ist nicht zu
erwarten.

⭐ **Das kostet keine zusätzliche Mechanik.** Gemessen am 20.09.: `deploy.sh` rsynct das
**Arbeitsverzeichnis** (`rsync -az --delete --exclude='.git/'`), nicht den Git-Index.
Gitignorierte Dateien werden mitübertragen. Nachgewiesen an einem gebauten Fall: eine Datei
unter einem gitignorierten Ordner erscheint im rsync-Ziel, während `git ls-files` sie nicht
kennt. Derselbe Deploy funktioniert in beiden Phasen identisch.

**Drei Präzisierungen zu diesem Weg:**

1. ⚠️ **Die Schwelle heißt „Design eingefroren", nicht „live".** Der erste Livegang zeigt
   eine Teilstrecke, während die Gestaltung noch läuft. Würde dort getrackt, tracken wir
   mitten in der Iteration.
2. ❗ **Der Track-Commit ist die harte Veröffentlichungsschwelle**, nicht der Deploy. Von der
   Seite läßt sich ein Bild entfernen; aus der Historie eines öffentlichen Repos nicht.
3. ⭐ **`media-manifest.json` wird ab dem ersten Commit getrackt.** Solange die Derivate
   ungetrackt sind, existiert die Kuratierung nur lokal — und die Kuratierung ist die
   eigentliche Arbeit, das Bild nur ihr Abdruck. Das Manifest hält je Bild fest:
   Herkunftsdatei, Kapitel, **Bildunterschrift**, **ALT-Text**, GPS. Damit sind Unterschrift
   und ALT nicht nachgereichtes Beiwerk, sondern Teil des Datensatzes.

## Seitenstruktur

```
sites/cadiz/
  index.html              Startseite: Titel, Wind-Einleitung, Route-Karte, Tageskacheln
  tag/<datum>-<ort>/      je Kapitel eine eigene Seite mit eigener URL
  css/                    eigenes Design-System (nicht aus shared/)
  js/                     externe Skripte (CSP verbietet inline)
  media/                  Derivate — gitignored bis zum Einfrieren
  media-manifest.json     getrackt ab Tag 1
  llms.txt  robots.txt
```

**Startseite + Kapitel-Seiten**, nicht eine durchgehende Scrollstory. Der Unterschied ist die
Seitengrenze, nicht die gestalterische Höhe: eine Kapitelseite darf selbst eine Scrollstory
sein. Gewonnen wird damit:

- eigene URL je Kapitel — teilbar, indexierbar, agent-native
- beherrschbare Ladezeit statt 56.000 Zeichen und hunderter Bilder in einem Dokument
- **gestaffelter Livegang**: fertige Kapitel gehen online, während andere entstehen

Thematische statt chronologische Kapitel wurden verworfen: der Stilbefund sagt ausdrücklich
„chronologisch erzählt, nicht thematisch — der Tag läuft ab, wie er ablief". Thematisch zu
schneiden hieße, jeden Beitrag zu zerlegen.

### Kapitelschnitt

Aus **16 substantiellen Beiträgen** werden **14 Kapitel** (03.–17.09.) — bei Umsortierung
nach Erlebnistag **15**, weil der 14.09. dann ein eigenes bekommt (siehe unten). Der 09.09.
und der 17.09. tragen je zwei Beiträge, die in ein Kapitel zusammenlaufen. Die vier Beiträge
vom 01.09. bleiben draußen — Nerd-Humor ohne Reisebezug.

| Kapitel | Ort | Zeichen |
|---|---|---|
| 03.09. | Cádiz (Ankunft) | 5.486 |
| 04.09. | Cádiz | 3.895 |
| 05.09. | Cádiz | 2.788 |
| 06.09. | Cádiz | 1.711 |
| 07.09. | **Gibraltar** | 9.859 |
| 08.09. | **Jerez de la Frontera** | 6.597 |
| 09.09. | Cádiz (zwei Beiträge) | 4.137 |
| 10.09. | **Rota** | 4.911 |
| 11.09. | Cádiz | 1.830 |
| 12.09. | Cádiz | 9.880 |
| 13.09. | Cádiz | 4.153 |
| 15.09. | **El Puerto de Santa María** | 9.004 |
| 16.09. | Cádiz | 1.765 |
| 17.09. | Rückreise (zwei Beiträge) | 2.136 |

Die vier fett gesetzten Ausflugskapitel bekommen eine eigene Karte; die Stadtkapitel nicht.

### ⚠️ Ein Beitrag ist nicht ein Tag — das ist in der Design-Phase zu entscheiden

Am Bestand gemessen (20.09.): **zehn der vierzehn Beiträge greifen auf den Vortag zurück** —
04., 05., 06., 07., 09., 10., 11., 12., 13. und 15.09. Das ist die Regel, nicht die Ausnahme,
und die Zeitstempel erklären warum: geschrieben wird abends zwischen 18:33 und 23:00. Der
Abend eines Tages hat beim Schreiben noch nicht stattgefunden und landet deshalb im Beitrag
des Folgetags.

Die tatsächliche Struktur der Quelle lautet also:

> **Beitrag vom Tag N = Abend von Tag N−1 + Tag N bis zum Schreibzeitpunkt**

Daraus folgt eine Entscheidung, die **nicht** vorweggenommen wird (Henning 20.09.):

| Weg | Gewinn | Preis |
|---|---|---|
| **Beiträge 1:1 übernehmen** | Hennings Erzählfluß bleibt unangetastet | Kapitel überlappen; „gestern Abend" steht im falschen Kapitel |
| **Nach Erlebnistag umsortieren** | jeder Tag wird eine eigenständige Episode | schneidet in die Prosa; Bilder müssen mit umziehen |

Zu klären ist das **zusammen mit der Bildzuordnung** — die Vorabend-Fotos gehören zum selben
Umzug. Die Entscheidung fällt in der Design-Phase, an einem konkreten Kapitel erprobt, nicht
am Schreibtisch.

⚠️ **Der 14.09. fehlt nicht versehentlich, und er war auch kein leerer Tag.** An ihm wurde
bewußt fast nichts getan — ein Hoteltag mit Poolbar. **Erzählt ist er trotzdem**, nämlich im
Beitrag vom 15.09., der mit „Gestern haben wir uns eine Auszeit genommen" beginnt. Er ist
damit der klarste Beleg für das Muster oben: ein Tag ohne eigenen Beitrag, dessen Inhalt im
Folgebeitrag steckt. Wird umsortiert, bekommt er sein eigenes Kapitel.

## Medienpipeline

1. **Export aus Photos.app** per AppleScript. Originale bleiben unangetastet.
2. **Derivate erzeugen** mit `sips` (Bordmittel, vorhanden; `exiftool` ist es **nicht**):
   AVIF/WebP, zwei Breiten für responsive Auslieferung.
3. **Ablage** in `sites/cadiz/media/`, gitignored; der Deploy nimmt sie mit.
4. **Track-Commit** beim Einfrieren, nach vollständiger Veröffentlichungsprüfung.

**Geodaten für die Routenkarten.** 479 der 639 Export-Medien tragen GPS. Die Quelle ist der
Facebook-Datenexport vom 20.09.2026, der lokal unter `~/Downloads/` vorliegt (218 MB, 711
Dateien). Die Photos-Originale tragen ihre Koordinaten ebenfalls selbst.

❗ **Datenschutz beim Einlesen des Exports: `upload_ip` steht in 625 Einträgen.** Gezielt nur
`taken_timestamp`, `latitude`, `longitude` herausziehen — **nie den EXIF-Block als Ganzes
weiterreichen**. Am 20.09. ist genau dieser Fehler schon einmal passiert, und das
Sitzungsprotokoll ist ein Veröffentlichungskanal wie jedes Repo.

⚠️ **Die Facebook-Medien sind nicht die Bildquelle.** Sie sind komprimiert und eine Teilmenge.
Bilder kommen aus Photos, Texte und Geodaten aus dem Export.

## Design-Sprache

Kein Freihand-Entwurf. Der Weg führt über **`impeccable`** — die Route, die die Dach-Spec für
den Design-Pass vorsieht.

⚠️ **Der lokale Stand ist veraltet und muß vor der Nutzung aktualisiert werden.** Gemessen am
20.09.:

| | Version |
|---|---|
| Lokal in `ki-os/.claude/skills/impeccable/` | Skill **3.0.6** |
| Aktuell (`pbakaus/impeccable`) | Skill **4.3.1** (09.09.2026) |

⚠️ **Skill und CLI sind getrennt versioniert.** `npm view impeccable version` liefert **4.1.0**
— das ist die CLI, nicht der Skill. Wer diese Zahl für den Skillstand hält, unterschätzt den
Abstand. Maßgeblich sind die `skill-v*`-Tags des Repos.

Was der Umbau für dieses Projekt bedeutet:

- **`/impeccable craft` ist abgeschafft.** Der Skill erkennt selbst, ob ein leeres Blatt, eine
  Ergänzung oder ein Redesign vorliegt. Ein Blog von null ist ein leeres Blatt.
- ⭐ **„Direction by dice"** adressiert genau die Homogenitätsfalle, die die Dach-Spec benennt
  („nicht den Default-Look übernehmen: Teal-Gradient/Serif/Status-Blink"). Ein externer Seed
  weist eine Richtung zu und stellt sechs Herausforderer aus 188 kuratierten Welten daneben.
  Jeder Wurf druckt einen Schlüssel, der ihn reproduzierbar macht.
- **Entscheidungsseite im Browser:** Henning wählt die Richtung selbst, an vollwertigen
  Entwürfen statt an Skizzen.
- **Vier Besuchermodi** statt Marke/Produkt: Persuade · Operate · Read · **Experience**. Ein
  Reiseblog ist **Experience** — das steuert die ganze Gestaltung.
- **Kein Node/npm mehr nötig** ab 4.2 (statisches Binary).
- ⚠️ **Entwürfe brauchen Bildgenerierung.** Erste Wahl ist das native Bildwerkzeug des
  Harness; ersatzweise ein `OPENAI_API_KEY`, der **auf Hennings Rechnung** geht. Ob der
  vorhandene `nanobanana-render`-MCP als natives Werkzeug durchgeht, ist in der Design-Phase
  zu klären — **nicht anzunehmen**.

⚠️ **Installationsort.** `impeccable` liegt heute als Projekt-Skill in `ki-os`, nicht in
`halfpap.io`. Gebaut wird aber in `halfpap.io`. Der Skill wird dort per
`npx impeccable install --scope=project` eigenständig installiert — konform zur Regel
„immer auf Projektebene, nie global". Das ist kein Textduplikat, sondern eine
Werkzeuginstallation mit eigenem Pflegeweg (`npx impeccable update`).

⭐ **Nebenfund als Prüfmittel:** `npx impeccable detect` prüft HTML/CSS/JSX gegen 61
deterministische Regeln — AI-Slop-Muster, WCAG-Verstöße, Typografie- und Layoutprobleme — und
kann auch eine **Live-URL** scannen. Das wird Teil der Verifikation, nicht nur der
Gestaltung.

## Texte

Die 26 Beiträge sind **Rohmaterial, unredigiert**
(`<privater Vault>/08-resources/cadiz-2026-reisetexte.md`). Je Kapitel:

- Rechtschreib- und Tippfehler raus, **Ton und Stimme unangetastet**. Der **Stilbefund** in
  derselben Datei ist das Maß, nicht das eigene Sprachgefühl. Signatur sind die
  sekundengenauen Zahlen („Pushback schon um 04:41", „2:34 Stunden statt der avisierten
  2:40"), der mündliche Ton, die Anekdote mit Pointe, die alte Rechtschreibung.
- **Höchstens ein Wissensabsatz**, aus dem Erlebten heraus entwickelt, nie davorgestellt.

**Die Einleitung liegt fertig vor**
(`<privater Vault>/08-resources/cadiz-2026-einleitung.md`) — Levante gegen Poniente, die
windumtoste Stadt. ⚠️ **Von Henning noch nicht gegengelesen.** Sie geht nicht ungeprüft live.

**Zwei Faktenprüfungen vor Veröffentlichung:**

1. ⚠️ Die **9.500 Kreuzfahrtgäste** sind Hennings Eindruck vor Ort, keine belegte Zahl —
   gegen die Hafenstatistik prüfen oder weicher formulieren.
2. ⚠️ **Keine harte Jahreszahl zur Stadtgründung** ohne Beleg. „Rund dreitausend Jahre" trägt
   beide gängigen Datierungen (traditionell 1104 v. Chr., archäologisch 9./8. Jh. v. Chr.).

⭐ **Ein Blogabschnitt steht bereits inhaltlich fest:** die bemerkenswerte Sauberkeit der
Stadt — kaum Müll, gefühlt alle zwei Meter ein Eimer, alle zehn Meter eine Trinkwasserstelle,
selbst in den Bahngleisen nichts. Der Kontrast macht daraus erst eine Geschichte: eine Stadt,
die bis zu drei Kreuzfahrtschiffe gleichzeitig verkraftet, so sauber zu halten, ist die
eigentliche Leistung.

## Barrierefreiheit

Baseline der Dach-Spec gilt unverändert:

- **Jedes Bild mit Bildunterschrift und ALT** (Vorgabe Henning 16.09.) — im Manifest geführt,
  nicht nachgereicht.
- Semantisches HTML mit Landmarks, korrekte Heading-Hierarchie, sichtbare Focus-States,
  volle Tastatur-Bedienbarkeit.
- `prefers-reduced-motion` respektieren — bei einem animationsstarken Design **kein
  Nebenpunkt**, sondern Kernanforderung.
- Light/Dark, Kontraste mindestens WCAG AA.

## Veröffentlichungsprüfung

❗ Das Repo ist **public**, die Bilder sind **privat**, die Seite ist **öffentlich**. Bei 1.534
Medien ist die Prüfung keine Formalie.

**Zwei Schwellen, verschieden hart:**

| Schwelle | Prüfung | Rücknehmbar? |
|---|---|---|
| vor dem **Deploy** | fremde Gesichter ohne Einverständnis, Hausnummern, Kennzeichen, Buchungsbelege | ja — Bild von der Seite entfernen |
| vor dem **Track-Commit** | dieselbe Prüfung | **nein** — Historie eines public Repos |

Dazu `leak-check --staged` vor jedem Commit und `leak-check --diff origin/main..HEAD` vor
jedem Push. ⚠️ **Exit 2 heißt „nichts geprüft", nicht „sauber"** (0 sauber · 1 Funde · 2 fail
closed).

## Zuschnitt: die erste Teilstrecke

⚠️ **Ehrlicher Ist-Stand am 20.09.:** Es existiert **keine einzige aufbereitete Bilddatei**.
Die Texte liegen vor, aber unredigiert. Das Design existiert nicht.

**Erste Teilstrecke = die Startseite.** Sie braucht:

- das Design-System (Ergebnis des `impeccable`-Laufs)
- die Einleitung — liegt vor, braucht Hennings Gegenlesen
- ein Titelbild — ein einziges Derivat aus Photos
- die Tagesliste als Kacheln, zunächst ohne Kapitelseiten dahinter
- `llms.txt`, `robots.txt`, Footer mit den kanonischen Rechtslinks

Das ersetzt eine tote Countdown-Seite durch eine lebende. Route-Karte und Kapitel folgen.

⚠️ **„Livegang heute" ist ein selbst gesetztes Ziel, kein Fremdtermin.** Es rechtfertigt kein
Überspringen der Veröffentlichungsprüfung. Lieber eine geprüfte Teilstrecke als eine
ungeprüfte ganze. Das Tempo gehört Henning.

## Erfolgskriterien

- [ ] `cadiz.halfpap.io` liefert den Blog, HTTP 200, valides HTML; der Tunnel zeigt auf Caddy
      (8082), nicht mehr auf `cadiz-countdown` (8090).
- [ ] `cadiz-countdown` ist unverändert — `git status` sauber, Repo reaktivierbar, Key-Gate
      intakt.
- [ ] `sites/cadiz/` bindet **kein** `tokens.css`/`base.css` aus `shared/` ein; `cadiz` steht
      **nicht** in der Schleife von `sync-content.sh`.
- [ ] Jedes ausgelieferte Bild hat Bildunterschrift **und** ALT; beides steht im Manifest.
- [ ] `npx impeccable detect https://cadiz.halfpap.io/` ohne kritische Befunde.
- [ ] Veröffentlichungsprüfung dokumentiert durchgeführt; `leak-check` mit **Exit 0** (nicht 2)
      vor Commit und Push.
- [ ] Rechtslinks im Footer auf `https://www.halfpap.io/impressum/` und `/datenschutz/`.
- [ ] `prefers-reduced-motion` nachweislich wirksam — am laufenden Browser geprüft, nicht am
      Quelltext.

## Bewußt außerhalb

- **Fotobuch (Once Upon)** und **Reisefilm** — eigene Ausgaben derselben Quelle, eigene
  Stränge (→ Loop `cadiz-nachbereitung`).
- **Reaktivierung des Countdowns** samt der zwei notierten Änderungswünsche (eigene Fotos
  statt Fremdfotos, Klapp-Bug in `style.css` 186–196). Henning ausdrücklich: „das reicht
  alles, wenn es so weit ist".
- **Automatisches Füllen des `Best of`-Albums** über `taken_timestamp` — machbar, eigene
  Aufgabe.
- Was bis zur Reaktivierung mit dem `cadiz-countdown`-Container geschieht (weiterlaufen oder
  stoppen) — betrifft den Blog nicht, sobald der Tunnel umgebogen ist.

## Offene Punkte

- [ ] **`impeccable` aktualisieren** (3.0.6 → 4.3.1) und in `halfpap.io` installieren — Befehl
      Henning vorlegen, nicht ungefragt ausführen.
- [ ] **Bildgenerierung für die Entwürfe** klären: natives Werkzeug, `nanobanana-render` oder
      `OPENAI_API_KEY` (kostenpflichtig).
- [ ] **Einleitung gegenlesen lassen** — es ist Hennings Text.
- [ ] **Hafenstatistik** für die 9.500 Kreuzfahrtgäste.
