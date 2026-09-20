# Product

<!-- impeccable:product-schema 1 -->

Gilt für **`sites/cadiz/`** — den Reiseblog unter `cadiz.halfpap.io`. Nicht für die übrigen
Sites des Monorepos; die haben ihre eigene Produktwahrheit oder noch keine.

## Platform

web

## Stack

Statisches HTML/CSS/JS, kein Build-Schritt, keine Dependencies. Ausgeliefert von der
bestehenden Caddy-Plattform des Monorepos (`platform/`), Content read-only gemountet.
Eigenes Design-System unter `sites/cadiz/css/` — **nicht** das gemeinsame `shared/css`;
`cadiz` steht bewußt nicht in der Sync-Schleife von `platform/sync-content.sh`.

## Users

**Zwei Gruppen, gleichrangig:**

1. **Familie und Freunde.** Lesen mit Wiedererkennung; ein Teil kennt die Beteiligten und
   Teile der Reise. Sie kommen für die Erzählung und die Bilder, nicht für Information.
2. **Fremde, die Cádiz erwägen** oder zufällig hier landen. Kennen weder Stadt noch Personen.
   Sie brauchen genug Halt, um hineinzufinden, ohne daß der Text zum Reiseführer wird.

Beide Gruppen müssen von denselben Texten bedient werden. Ein Kapitel, das nur für einen Kreis
funktioniert, ist unfertig.

## Product Purpose

Zwei Wochen Cádiz (03.–17.09.2026) als Reiseblog erzählen. Die Seite soll **unterhalten und
gut aussehen**, darf **Werbung für die Stadt** machen und **ein bisschen Wissen vermitteln** —
angelehnt an den Bildungsauftrag öffentlich-rechtlicher Medien.

Erfolg heißt: jemand liest ein Kapitel zu Ende, der nicht dabei war.

Die Seite löst den abgelaufenen Countdown unter derselben Domain ab. Sie ersetzt ihn nicht:
`cadiz-countdown` bleibt als eigenes Repo erhalten und kehrt bei einem neuen Reisetermin
zurück.

## Positioning

Der Bestand ist der Unterschied, und er ist nicht nachbaubar: **63.739 Zeichen eigener Text,
abends während der Reise geschrieben** — kein nachträglich verfaßter Reisebericht, sondern ein
Tagebuch, das unter dem Eindruck des Tages entstand. Dazu **1.534 eigene Medien** in
Originalqualität.

Die Stimme trägt eine Signatur, die kein Reiseblog-Baukasten liefert: ein Systemingenieur, der
mitschreibt. „Pushback schon um 04:41", „pünktlich um 05:00:05", „2:34 Stunden statt der
avisierten 2:40" — die Zahlen sind gemessen, nicht dekorativ.

## Operating Context

Gelesen wird am Telefon und am Rechner, meist einmal und in einem Zug. Einzelne Kapitel
werden verschickt und verlinkt, deshalb hat jedes seine eigene URL und muß für sich stehen.

Die Seite hat kein Login, keine Kommentare, keine Suche. Sie wird nach Fertigstellung nur noch
selten überarbeitet.

## Capabilities and Constraints

**Ausliefern und Betrieb**

- Rein statisch. **Kein Key-Gate**, keine Sitzungen, kein Anwendungsserver — der Blog ist
  vollständig öffentlich.
- **CSP der Plattform:** `style-src 'self'; script-src 'self'; img-src 'self' data:`. Keine
  Inline-Styles, keine Inline-Skripte, keine externen CDNs oder Schriften. Eigene Dateien aus
  demselben Origin sind unbeschränkt; Canvas, WebGL, scroll-getriebene Animationen und View
  Transitions laufen damit. Braucht das Design mehr, bekommt der Host einen eigenen
  Header-Block — das ist eine bewußte Änderung, keine Nebensache.
- Deploy per rsync des Arbeitsverzeichnisses, nicht des Git-Index. Gitignorierte Dateien
  werden mit übertragen.
- Rechtsseiten sind **nicht** Teil dieser Site: Impressum und Datenschutz liegen kanonisch
  unter `https://www.halfpap.io/` und werden von dort verlinkt.

**Inhalt**

- **15 Kapitel** (03.–17.09.), eines je Erlebnistag.
- ⭐ **Entschieden (Henning 20.09.): Die Kapitel erzählen den Erlebnistag, nicht den
  Schreibtag.** Zehn der vierzehn Facebook-Beiträge greifen auf den Vorabend zurück, weil
  abends geschrieben wurde. Der Blog zieht das gerade: jedes Kapitel erzählt, was an diesem
  Tag geschah, unabhängig davon, wann es aufgeschrieben wurde.

  **Die Begründung ist redaktionell und trägt weiter als die Frage:** Facebook war das
  Tagebuch, das zeitnah festhielt — der Blog ist die kuratierte zweite Ansicht derselben
  Reise, mit Abstand statt aus dem Moment. Daraus folgen drei Freiheiten: nicht jedes Detail
  der Beiträge muß verdoppelt werden; Details, die damals nicht in einen Beitrag paßten,
  dürfen nachgepflegt werden; und die Erzählung darf ordnen, was das Tagebuch in der
  Reihenfolge des Schreibens hinterließ.

  ⚠️ **Was dabei unantastbar bleibt:** die Stimme und die belegten Fakten. Kuratieren heißt
  auswählen und ordnen, nicht ausschmücken. Ein Detail, das in keiner Quelle steht, kommt
  auch nicht in ein Kapitel.

  Damit bekommt der **14.09.** ein vollwertiges Kapitel statt einer Leerstelle: er ist im
  Beitrag vom 15.09. erzählt und fotografisch mit dreizehn Aufnahmen belegt.

- ❗ **Offen:** Ob der Blog als Arbeitsprobe gilt und von der Visitenkarte verlinkt wird.
  Später zu entscheiden, wenn die Seite steht.
- ❗ **Offen:** Ob der Dach-Slogan „Made with AI. Made for humans and agents alike." auf dieser
  Site erscheint. Nicht einfach übernehmen.

**Veröffentlichung**

- Das Repo ist **public**, die Bildoriginale sind privat, die Seite ist öffentlich.
- Bild-Derivate liegen in **`sites/cadiz/assets/photos/`** und sind **getrackt**.
- ✅ **Die Schwelle ist genommen** (Henning 20.09.): Die Derivate gehören in die Historie. Von
  der Seite läßt sich ein Bild entfernen, aus der Historie eines öffentlichen Repos nicht — die
  Entscheidung ist damit gefallen und gilt für alle weiteren Bilder.

⚠️ **Wie der Stand entstand, ist die eigentliche Lehre.** Das Dokument beschrieb bis zum
20.09. einen Schutz, den es nie gab: Bilder unter `sites/cadiz/media/`, „zunächst gitignored",
und den Track-Commit als bewußt zu nehmende Schwelle. Gemessen am 20.09.:

| Behauptet | Gemessen |
|---|---|
| Pfad `sites/cadiz/media/` | `sites/cadiz/assets/photos/` |
| gitignored bis zum Track-Commit | **keine gitignore-Regel** — weder für den einen Pfad noch für den anderen |
| Ein bewußter Track-Commit | 74 Bilder, mitgelaufen seit `204e42c` |

Die Schwelle wurde also nicht übersprungen, sondern war nie gebaut. Aufgefallen ist es nur,
weil ein Bild als `modified` im Status stand, wo ein ignoriertes Bild gar nicht hätte
auftauchen dürfen. **Eine gitignore-Regel, die man aufschreibt statt sie zu prüfen, schützt
nichts** — `git check-ignore -v <pfad>` beantwortet die Frage in einer Sekunde.

Entschärft haben den Fall zwei Umstände, die beide Glück und nicht Vorsorge waren: die
Derivate tragen **keinen EXIF-Block und keine GPS-Daten** (der PIL-Weg verwirft sie), und zum
Zeitpunkt des Befunds war **nichts gepusht** — 20 Commits lagen lokal voraus. Wäre eine der
beiden Bedingungen anders gewesen, hätte das Dokument den Irrtum gedeckt statt ihn zu zeigen.

✅ **Gegengeprüft am 20.09.**, weil getrackt nicht dasselbe ist wie verwendet: von 77
getrackten Bildern erscheinen 73 auf einer Seite. Die vier übrigen sind Entwurfsartefakte aus
`.impeccable/` (Comp-Raster, Font-Vergleiche, ein Mock) — **kein Reisefoto ist verwaist**. Die
Prüfung gehört vor jeden weiteren Push wiederholt, solange Bilder dazukommen.

## Brand Commitments

**Hennings Stimme ist bindend und am Bestand belegt** (Stilbefund im privaten Vault unter
`08-resources/`, erhoben am 20.09.2026 an 26 eigenen Beiträgen):

- **Alte Rechtschreibung, konsequent** — „mußten", „daß".
- **Sekundengenaue Zahlen als Signatur.** Ohne sie fehlt etwas.
- **Chronologisch erzählt**, nicht thematisch. Der Tag läuft ab, wie er ablief.
- **Mündlicher, lockerer Ton**; Gedankenstrich-Einschübe statt Nebensatzbau;
  Auslassungspunkte als Rhythmus.
- **Anekdote mit Pointe am Ende. Selbstironie statt Selbstdarstellung**, nie auf Kosten
  anderer.
- **Emojis sparsam** als Tonfall-Marker.
- **Kurze Absätze** — ein Gedanke, dann Umbruch.
- Sprache: **Deutsch**. Fachbegriffe dürfen englisch bleiben.

⚠️ **Der Stilbefund schlägt das eigene Sprachgefühl.** Der erste Entwurf der Einleitung war
handwerklich sauber und klang trotzdem nicht nach ihm. Erst messen, dann schreiben.

⚠️ **Erzählen, nicht erklären.** Höchstens **ein** Wissensabsatz je Kapitel, und immer aus dem
Erlebten heraus entwickelt — nie davorgestellt.

## Evidence on Hand

**Vorhanden:**

- **26 Beiträge** vom 01.–17.09.2026, davon 21 mit eigenem Text, zusammen **63.739 Zeichen** —
  privater Vault, `08-resources/cadiz-2026-reisetexte.md`. Enthält auch den **Stilbefund**.
- **Einleitung** („Die windumtoste Stadt", Levante gegen Poniente) — privater Vault,
  `08-resources/cadiz-2026-einleitung.md`. ⚠️ **Von Henning noch nicht gegengelesen.**
- **1.421 Fotos und 113 Videos** in Originalqualität, Photos.app, `Urlaub/2026/Cádiz/alle`.
- **Facebook-Datenexport vom 20.09.2026** unter `~/Downloads/` (218 MB): Texte, Zeitstempel,
  Ortsangaben und **479 Medien mit GPS-Koordinaten** — Rohstoff für Routenkarten.
  ❗ **`upload_ip` steht in 625 Einträgen.** Beim Einlesen gezielt nur `taken_timestamp`,
  `latitude`, `longitude` herausziehen; nie den EXIF-Block als Ganzes weiterreichen.
- Ortsangaben bei 17 Beiträgen: Cádiz · Gibraltar · Jerez de la Frontera · Rota · El Puerto de
  Santa María · Flughafen Jerez.

**Nicht vorhanden — und nicht zu erfinden:**

- Keine Besucherzahlen, keine Reichweitendaten, keine Testimonials, keine Presse.
- ✅ **Die 9.500 Kreuzfahrtgäste sind belegt** (Henning 20.09.): Portal de Cádiz meldete am
  4. September 2026 „Más de 9.500 cruceristas" an Bord der drei genannten Schiffe — Norwegian
  Dawn, MSC Opera, Liberty of the Seas. An der Quelle geprüft; Datum, Zahl und alle drei
  Schiffsnamen stimmen überein. Die Zahl steht mit Quellenlink im Kapitel des 04.09.
- ⚠️ **Keine harte Jahreszahl zur Stadtgründung** ohne Beleg. „Rund dreitausend Jahre" trägt
  beide gängigen Datierungen (traditionell 1104 v. Chr., archäologisch 9./8. Jh. v. Chr.).
- Die Facebook-Medien sind **nicht** die Bildquelle: komprimiert und eine Teilmenge. Bilder
  kommen aus Photos, Texte und Geodaten aus dem Export.

## Product Principles

1. **Der Bestand ist das Maß, nicht das Sprachgefühl des Bearbeiters.** Redigiert wird auf
   Fehler, nicht auf Ton.
2. **Erzählen schlägt erklären.** Wissen kommt aus dem Erlebten heraus oder gar nicht.
3. **Beide Lesergruppen von denselben Texten bedienen.** Wiedererkennung für die einen,
   Zugang für die anderen — nicht zwei Fassungen.
4. **Jedes Bild trägt Bildunterschrift und ALT.** Teil des Datensatzes, nicht nachgereicht.
5. **Veröffentlicht wird nur Geprüftes.** Ein selbst gesetzter Termin rechtfertigt kein
   Überspringen.

## Accessibility & Inclusion

- **Jedes Bild mit Bildunterschrift und ALT-Text** — ausdrückliche Vorgabe vom 16.09.2026.
  Rein dekorative Bilder `alt=""`.
- Kontraste mindestens **WCAG AA**, Light und Dark.
- **`prefers-reduced-motion` respektieren.** Bei einem animationsstarken Design kein
  Nebenpunkt, sondern Kernanforderung: die Seite muß ohne Bewegung vollständig funktionieren.
- Semantisches HTML mit Landmarks, korrekte Heading-Hierarchie, sichtbare Focus-States, volle
  Tastatur-Bedienbarkeit.
