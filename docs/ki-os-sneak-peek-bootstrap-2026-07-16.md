# KI-OS-Sneak-Peek — Session-Bootstrap (Fahrplan v2, Session 1)

> Erstellt: 2026-07-16 · Für eine **interaktive Fable-Session** in DIESEM Repo (halfpap.io als CWD, ohne `/start`)
> Auftrag aus: KI-OS-Fahrplan v2, Spur S + "Naechste 3 Sessions" Nr. 1 (Pfad unten)
> Ziel: **KI-OS-Karte in "Aus der Werkstatt" + Detailseite LIVE** - idealerweise vor dem 21.07. (wer nach Henning sucht, soll zum Thema KI-Betriebssystem etwas finden)

## Erstprompt fuer die Session

> "Bitte lies `docs/ki-os-sneak-peek-bootstrap-2026-07-16.md` und fuehre den Auftrag aus."

## Rolle / Modus

Web-Bauer in der etablierten halfpap.io-Designsprache + Texter in Hennings Stimme. **Interaktiv:** an jedem Fork Henning fragen (AskUserQuestion **plus** dieselbe Frage als lesbaren Text). Muster kopieren, nicht neu erfinden - `sites/maclist/` ist die Blaupause.

## Pflicht-Reads

**In diesem Repo (Muster + Infrastruktur):**
1. `sites/maclist/index.html` + `llms.txt` + `robots.txt` - die Blaupause (Designsprache, JSON-LD, Struktur)
2. `sites/henning/index.html` - Werkstatt-Sektion (dort kommt die neue Karte hin)
3. `platform/tunnel-routing.md` + `platform/Caddyfile` + `platform/deploy.sh` - Deploy-Pfad (Caddy-Host + Cloudflare-Route noetig wie bei maclist)

**Im Vault (Quellen - privates Repo; Pfade hier als Platzhalter sanitisiert):**
4. `<vault>/04-projects/ki-os-wartung/ki-os-fahrplan.md` - Spur S (Inhalts-Vorgabe) + Entscheidungen 16.07. (Naming!)
5. `<vault>/04-projects/ki-os-wartung/ki-os-fahrplan-2026-07-09.md` - **§2 Genesis-Diff** (Story-Material: "769-Byte-Nukleus → lebendes System") + §4 Modul-Landkarte (was das System KANN, in Kategorien)
6. Bei Bedarf: `<vault>/08-resources/ki-os-deep-research-stateoftheart-2026-07-09.md` - Kategorie-Sprache/Markt-Einordnung (Leitfrage 6 = Naming-Begruendung)

## Eingefrorene Entscheidungen (nicht neu verhandeln)

- **Naming-Duo (entschieden 16.07.):** "KI-Arbeitspartner" kundenzugewandt, "KI-Betriebssystem" als Fach-/Kategoriebegriff dahinter. NICHT "KI-Partner" solo (Romantik-Kollision, durchgefallen im Deep-Research).
- **Konzept statt Interna:** was ein KI-Betriebssystem ist · was es konkret kann (Betriebs-Beispiele: Gedaechtnis-Architektur, /monthly-Wartungsebene, Credential-Governance, Homelab/MCP-Integration, Genesis-Story) · warum es so gut wie jede(r) brauchen kann - das Grundkonzept ist uebertragbar, Hennings Auspraegung nur eine spezielle Ausrichtung.
- **Keine Repo-Links** (Werkstatt-Konvention - das ki-os-Repo bleibt privat, Existenznachweis anders fuehren).
- **Kein Zeitdruck-Framing** im Text - ruhiger, souveraener Ton ("mehr sein als scheinen").

## Sicherheits-Leitplanken (VOR dem PR pruefen, nicht danach)

- **Sanitisierung:** keine Hostnamen, keine absoluten Pfade (`~/...`, `/Users/...`), keine internen Codenamen, nichts Persoenliches/Finanzielles - auch in sichtbarer Prosa, nicht nur in Hrefs. Vor dem PR danach **greppen**.
- **⚠️ Keine echten Dashboard-Screenshots:** das /start-Dashboard zeigt private Inhalte. Falls ein Visual gewuenscht: Konzept-Diagramm (Mermaid/SVG im Site-Stil) oder ein **nachgestelltes/sanitisiertes** Beispiel mit fiktiven Inhalten - Fork mit Henning klaeren.
- **Aussenwirksamer Text:** normaler Bindestrich statt Emdash, echte Umlaute + scharfes S, Hennings alte Rechtschreibung ("muss" → "muß" etc. wo es seiner Stimme entspricht). Deutsch.

## Offene Forks (mit Henning klaeren, bevor gebaut wird)

1. **URL/Subdomain:** analog maclist eine eigene Subdomain - aber welche? (Kandidaten diskutieren; die Naming-Duo-Entscheidung liefert die Begriffe, aber nicht automatisch den Hostnamen.)
2. **Visual:** Diagramm vs. sanitisiertes Beispiel vs. nur Typo/Text (s. Leitplanke oben).
3. **Umfang Detailseite:** Sneak Peek heisst schlank - was kommt jetzt rein, was waechst spaeter "nebenbei" (Spur S) nach?

## Definition of Done

- Karte in "Aus der Werkstatt" (`sites/henning/index.html`) + neue Detailseite (eigener `sites/`-Ordner, llms.txt + robots.txt + JSON-LD + Favicon nach maclist-Muster)
- Caddy-Host + Tunnel-Route dokumentiert/ergaenzt, deployed via `platform/deploy.sh`
- **Alle URLs real mit HTTP 200 verifiziert** (nicht nur Build gruen - Lehre: gemergter PR ist nicht deployt)
- Sanitisierungs-Grep gelaufen, Ergebnis im PR vermerkt
- PR-Workflow: Session-Branch → PR → **Merge-Gate** (Henning merged; danach Cleanup). Diesen Bootstrap mit in den PR aufnehmen (liegt bewusst uncommitted im Working Tree).
