# meteowerk — design

> Date: 2026-07-26
> Status: approved, not yet implemented
> Scope: a new site `meteowerk.halfpap.io` carrying a narrative overview and a
> standalone build guide for a Davis Vantage Pro 2 weather console, plus the
> matching changes to `henning.halfpap.io`.

## 1. Goal

Turn the `jeelink-davis` project into something a stranger can rebuild, and make
that visible from the business card.

Two audiences, deliberately not merged:

* Someone who wants to **build the thing**. Success for them: a working console,
  no follow-up questions.
* Someone who wants to **judge the author**. Success for them: five minutes and
  they know how this person works.

The guide must also work as a **deep link** — quoted into a meteorology forum
without dragging the rest of the author's web presence along.

### Why this has value to strangers

Connecting a Vantage Pro 2 to anything beyond its own console has been a sore
point for well over a decade. The traditional path required Davis' own data
logger — a serial-to-USB converter at a hardware price — *and* a second machine
next to it running something like meteohub to do anything useful with the
stream.

A JeeLink receives the ISS radio traffic directly. No proprietary logger, no
second box. That is the sentence the whole site hangs from, and it belongs at
the top of both pages.

## 2. Name

`meteowerk.halfpap.io`, subtitle **"Wireless Receiver Kit"**.

Constraints it satisfies: readable in German and English, not confusable with
`wetter.halfpap.io` (the live instrument), carries no third-party product or
company name.

Two candidates were rejected for reasons worth recording, because they will come
up again:

* **`meteologger`** — sits inside an existing commercial product family in the
  same niche (meteohub, meteobridge, meteoplug). A reader would file it as a
  clone. Also "logger" names the least distinctive part; logging is not what is
  new here.
* **Anything containing `…link`** — Davis' own software is called *WeatherLink*.
  (The `JeeLink` keeps its name; that is the receiver's actual product name, not
  a choice made here.)

`meteowerk` was preferred over a vowel-dropped `meteowrk`: "werk" already reads
as "work" to an English speaker, so dropping the `e` buys no extra bilinguality
and costs pronounceability — which matters for a name whose entire purpose is
being passed along by voice and in forum posts.

## 3. Structure

A new site directory `sites/meteowerk/`, served exactly like `sites/maclist/`
and `sites/ki-arbeitspartner/`: static files behind Caddy, one additional public
hostname route on the existing tunnel. No new platform components.

| Path | Purpose | Audience |
|---|---|---|
| `/` | Narrative overview — the sore point, the decisions, the mistakes and how they were found | Someone judging the author |
| `/guide/` | The recipe — exactly one build, no variants, deep-linkable | Someone building it |
| `/de/`, `/de/guide/` | German translations, added after the English pages ship | German readers |

English is the source language; German follows. Rationale: the source material
(`jeelink-davis` README, code comments, `docs/console.md`) is already English,
the hardware is more widespread outside Germany, and the forum target is
international. The German version is expected to lag between revisions; that is
accepted.

Both language trees carry `hreflang` and `canonical` links. The site gets its
own `llms.txt` and schema.org markup, consistent with the rest of the domain.

**The guide must not be served from the weather station's own host.** A
successful forum post would otherwise drive strangers' traffic onto the small
single-board computer that runs the station. Documentation lives on the web
platform; the instrument stays separate.

## 4. The recipe

### Definition of done, stated at the top

The reader is finished when:

1. the console is running on the touch display, and
2. the dashboard answers on port 8000 from the local network.

Nothing beyond that is promised.

### Exactly one build

The guide describes **one** hardware combination and does not branch. Anyone who
deviates — by choice or necessity — is pointed at the repository README, and may
need to fork. Saying this plainly at the top is what keeps the guide short and
verifiable.

The bill of materials includes prices **and a total**, each marked with a date
("as of mid-2026"). "What does this cost me altogether" is the second question a
forum reader asks, right after "does this really work without the logger".

### Chapters

1. What this builds, and what it costs (BOM, prices, total)
2. Why — no proprietary logger, no second machine
3. Parts and where to get them
4. Flashing the JeeLink firmware
5. Preparing the single-board computer (fresh card)
6. Wiring the indoor sensor · placing the receiver
7. Installation — happy path only
8. Display, case, kiosk mode
9. Checking the definition of done
10. "If you want the data elsewhere" — one sentence, pointing at the README

### Two details that only come from having built it twice

* **A long USB cable for the receiver.** It belongs away from the computer,
  which is noisy at 868 MHz.
* **Receiver placement is measurable, not guesswork.** The console's own status
  page shows RSSI with today's range. The guide tells the reader to move the
  stick until that value is stable, instead of hoping.

### Deliberately excluded

* **Public exposure via a CDN or tunnel** — not mentioned at all. It is one of
  many ways to publish a dashboard, it carries a security burden, and a recipe
  that puts beginners' hardware on the open internet unasked would be
  irresponsible.
* **InfluxDB / MQTT integrations** — one closing sentence and a link. Each
  integration drags in third-party infrastructure the recipe cannot control.
* **Hardware variants** — README, and fork if needed.

### The indoor sensor is not optional

The Vantage Pro 2 does **not** transmit barometric pressure over the air; only
its bundled console has a barometer, and that data never reaches the radio.
A build without the extra I²C sensor produces a console with an empty pressure
tile — exactly the gap that generates the first forum question. The sensor is
therefore part of the single supported build.

The guide carries the matching warning: mounted next to the computer and the
display, the sensor read roughly 14 °C too high. The fix was physical relocation
on a longer cable, not a software offset — an offset would have been
load-dependent and unreliable.

## 5. Relationship to the repository

The guide and the README have different **jobs**, not merely different
locations:

* **Guide:** "do this, in this order." Narrative, happy path, no options.
* **README:** "what does this switch mean." Reference, options, integrations.

The guide links into the README at specific points rather than restating it.
This seam holds as both sides grow; a seam drawn at `git clone` would have to be
renegotiated with every new step, and a fully self-contained guide would strip
the repository of its standalone value on GitHub — a real discovery channel.

`docs/console.md` in the project repository already carries the finished-device
photographs and the design reasoning behind the compass rose, the three needle
states and the offline-by-design decision. That material feeds the **overview**
page. No page retells another page's story.

## 6. Changes to `henning.halfpap.io`

* **New third section, "Zum Nachbauen" / "Build it yourself"**, linking to
  `meteowerk.halfpap.io`. The existing sections say "I built things" three times
  over; none says "I wrote it down well enough for a stranger to rebuild it".
  In an operations context that is among the most valuable things a candidate
  can demonstrate, and a section states it without the author having to claim
  it.
* **Add `jeelink-davis` to the repository list.** Its absence is an oversight,
  not a decision — it is the project with the most presentable material.
* **Remove `cadiz-countdown` from the list.** Not for layout reasons: the tile
  grid reflows on its own and never overflows. The countdown targets a date in
  September 2026, so from mid-September it would show a business card counting
  down to a past event. Four tiles remain, and the selection sharpens:
  firmware, tooling, the site itself, the measurement system.

**Known layout wrinkle, worth fixing while in there:** `.tile-grid` uses
`repeat(auto-fit, minmax(min(100%, 16rem), 1fr))`. With `auto-fit` and `1fr`, a
lone tile on the final row stretches to full width. With four tiles this does
not arise at common widths, but `auto-fill` would leave a gap instead of an
overwide card and is the more robust choice.

## 7. Photographs

The existing device photographs ship with the first release — already resized
and stripped of metadata in the project repository.

**Step-by-step photographs are taken during the rebuild, not staged.** Reopening
the current enclosure for posed detail shots would cost more effort and produce
worse material: a grown installation, cables routed by history rather than by
the instructions, and every frame showing a state the reader is not actually in.

## 8. Validation and sequencing

The author's installation **grew**: first without a display, then a display
retrofitted, a PoE hat installed and removed, the indoor sensor relocated, two
deployment scripts repaired mid-flight, an operating system migrated in between.
A reader starts from nothing, on a fresh card, in an order that has never been
walked.

That gap is not theoretical — it is exactly where a "use this script" instruction
once destroyed a production configuration.

**Therefore:**

1. Overview and guide go live on `meteowerk.halfpap.io` (English) as soon as
   they are written. On the author's own site an unverified edge harms nobody,
   and the pages are useful immediately.
2. The German translations follow.
3. A **complete rebuild** — new receiver stick, new computer, new card, new
   indoor sensor — validates the recipe end to end. A fresh card alone would not
   suffice: it would skip **flashing the firmware**, which is third-party, was
   last performed years ago, and is the single step neither the author nor this
   repository controls. That is where a guide like this breaks first.
4. **Only then** does the forum post go out. Publishing on one's own site is an
   offer; publishing into a specialist forum is a claim.

Timing for the rebuild is deliberately loose — it is a side project, plausibly
autumn 2026. Buying parts can start earlier.

## 9. Risks

| Risk | Handling |
|---|---|
| Chapter 4 (firmware) ages fastest — third-party code, third-party links | Keep it short, point at the source rather than retelling it |
| Prices go stale | Date stamp on the bill of materials, refreshed when the page is next touched |
| German translation drifts behind English | Accepted deliberately; revisions touch both anyway |
| Guide is derived, not yet walked | Not emphasised on the author's own site; stated plainly before any forum post |
| Readers deviate from the single supported build | Said explicitly at the top, with the README as the destination |

## 10. Out of scope

An **abstraction layer separating input from processing**, so that other radio
stations, cabled stations, or even the original data logger could feed the same
pipeline. Genuinely interesting, genuinely a different project, and it edges
toward commercial territory.

Worth noting: by describing the chain end to end — sensor unit → radio →
receiver → parser → storage → display — the guide already *documents* that
layering. Naming the boundaries costs nothing now; building them would be the
large project. The guide becomes the map, should that ever be attempted.
