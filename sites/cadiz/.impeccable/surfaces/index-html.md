---
version: 1
slug: "index-html"
primary_target: "index.html"
related_targets: []
---

Scope: `sites/cadiz/index.html` — die Startseite des Reiseblogs unter `cadiz.halfpap.io`.
Visitor mode: **Experience**. Das Werk führt vom ersten Viewport; die Erklärung tritt zurück.

Audience: zwei Gruppen, gleichrangig. Familie und Freunde lesen mit Wiedererkennung; Fremde,
die Cádiz erwägen, kennen weder Stadt noch Personen. Ein Kapitel, das nur für einen Kreis
funktioniert, ist unfertig.

Job: einen Einstieg finden und sich hineinziehen lassen. Chronologisch ist der Standardweg;
Karte und Übersicht stehen als Schnellnavigation daneben (Henning 20.09.).

Signature interaction — die Karte als Popout (Henning 20.09., begründet): Ein kleines
Kartenobjekt liegt dauerhaft in der Ecke, auf jeder Seite. Es zeigt im Hover sichtbar, daß
dahinter etwas Anklickbares liegt, und öffnet sich zur Routenkarte. Darin steht jeder Ort für
ein Foto, das zum Beitrag des Tages führt, an dem man dort war. **Begründung des Nutzers, die
die Gestaltung bindet:** Er liest eine Karte als Seemann sofort — ein zufälliger Leser aber
erwartet einen digitalen Kartendienst und schreckt zurück. Deshalb führt das Foto den Einstieg
und die Karte bleibt Werkzeug. Die Karte wird als Papier gezeichnet, nie als Kartendienst.

Ortszuordnung, an den Texten verifiziert: Cádiz → 03.09. (Anreisetag) · Gibraltar → 07.09. ·
Jerez → 08.09. · Rota → 10.09. · El Puerto de Santa María → **15.09.**, nicht 05.09.: am 05.09.
wurde die Fähre nicht verlassen, was der Text vom 15.09. wörtlich belegt.

Proof/content: 63.739 Zeichen eigener Text, abends während der Reise geschrieben; 1.534 eigene
Medien in Originalqualität; 479 verortete Aufnahmen; fünfzehn Tage mit Material.

Constraints: rein statisch, kein Server, kein Key-Gate. CSP der Plattform verbietet Inline-Styles
und -Skripte sowie externe Ressourcen. Bildunterschrift und ALT je Bild. `prefers-reduced-motion`
muß die Seite vollständig benutzbar lassen.

Entschieden (Henning 20.09.): Die Kapitel erzählen den Erlebnistag, nicht den Schreibtag.
Facebook war das Tagebuch aus dem Moment, der Blog ist die kuratierte zweite Ansicht mit
Abstand — er darf ordnen, weglassen und nachpflegen, aber nie ausschmücken. Stimme und
belegte Fakten bleiben unantastbar. Der 14.09. bekommt dadurch ein volles Kapitel.

## Direction contract

THESIS: Eine Chronik, die aus Dingen besteht statt aus Feldern. Sie verweigert die Anordnung,
die jeder Reiseblog liefert — randloses Foto, zentrierter Serifentitel darüber, Kartenraster mit
abgerundeten Ecken darunter. Hier trägt ein physischer Gegenstand die Seite, und die Bilder
liegen darauf, wie sie in einem Album liegen.

OWN-WORLD: Schwarzer Albumkarton `#14120F` als durchgehender Grund, fibrig, nie creme und nie
Pergament. Darauf ein kleines, festes Vokabular echter Objekte: weiße Papier-Fotoecken,
Briefmarken mit ausgestanzter Perforation, Streifen ockerfarbenen Klebebands `#C98A3E`,
gerissene Papierreiter `#F2F0EB`, Silberstift-Handschrift für Titel, runde Ortsstempel in
gedämpftem Zinnober `#C6362C`. Tiefes Atlantikblau `#0F3B57` markiert Zustände an der Kante,
nie über den Farbton allein. Fließtext in einer klaren Grotesk, hell auf dem schwarzen Karton.
Schatten nur dort, wo ein physisches Objekt wirklich einen wirft.

STORY: Der Besucher erkennt in Sekunden, daß hier jemand wirklich war und selbst erzählt — kein
Reiseportal, kein Prospekt. Er versteht, daß zwei Wochen vor ihm liegen, geordnet nach Tagen,
und daß er an jedem Tag einsteigen kann. Er greift sich einen Reiter oder folgt dem Scroll.

FIRST VIEWPORT: Schwarze Albumseite über die volle Breite. Oben, etwa 58 % der Höhe, der
Kopfbereich: links der Titel „Cádiz 2026" in Silberstift, darunter „zwei Wochen am Atlantik"
und fünf Zeilen Einleitung; rechts daneben, etwa 62 % der Breite, das Panorama der Landzunge in
vier weißen Fotoecken, um rund 1,5° gedreht, oben von einem Klebestreifen gehalten, an der
oberen rechten Ecke überlappt von einer perforierten Briefmarke mit Ortsstempel „CÁDIZ ·
03.09.2026". Darunter, ab 58 % Höhe, beginnt die chronologische Tagesfolge als Zeilen: je Zeile
links ein quadratisches Foto in Fotoecken, dann das Datum in Silberstift, dann ein Zweizeiler,
rechts ein gerissener Reiter — Ausflugstage mit blauer Kerbe `#0F3B57` an der Kante, Stadttage
ohne. Die dritte Zeile ist vom Rand angeschnitten, damit der Fortgang sichtbar ist. Fest in der
unteren rechten Ecke, höchstens 70 px groß und über allem liegend: eine zusammengefaltete
Papierkarte, mit zwei Streifen Klebeband angeheftet — Tinten-Küstenlinie und Routenlinie auf
Papier, ausdrücklich **kein** digitaler Kartendienst. Der primäre Weg ist die Tagesfolge; die
Karte ist das zweite, jederzeit erreichbare Werkzeug.

FORM: Das Reisealbum, Kandidat 5 der sieben abgeleiteten Richtungen, zugewiesen durch den Wurf.
Seed-Key `a90630a6`. Fünf Anhebungen aus den abgelehnten Herausforderern, jede benannt: ein
Material trägt die ganze Fläche (Rennstall-Lackierung); der Scroll ist eine choreographierte
Abfolge statt eines Haufens (Versailles); Levante und Poniente werden Material statt Textstelle
(Wolkensteinbruch); die Leerstelle wird mitgestaltet, der 14.09. bekommt eine Form
(Sieben-Segment-Anzeige); Zustände kodieren über Form, nie allein über Farbe (Steckfeld).

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the
verdict, DESIGN.md, and every shipping raster carrying its provenance
