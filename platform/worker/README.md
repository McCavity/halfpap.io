# Maintenance shim (Cloudflare Worker)

An edge-side fallback for the tunnel-backed hostnames. Normal traffic passes
through untouched; when the origin cannot be reached, visitors get a
self-contained maintenance page instead of a Cloudflare error screen.

**Status: written, not deployed.** Deploying needs a Cloudflare API token that
does not exist yet — see *Deploying* below.

## Why this exists

The static site is served by Caddy on the Docker host and reaches the internet
through a Cloudflare Tunnel running on separate hardware. When the Docker host
is down — planned maintenance on the hypervisor, for instance — the tunnel
stays up and reports an origin failure, and Cloudflare shows its own error page.

A Worker runs at the edge. It therefore still works in precisely the situation
it exists for, which no origin-side solution can claim.

`wetter.halfpap.io` is deliberately **out of scope**: it is served from
different hardware and stays up on its own.

## What it does

| Situation | Response |
|---|---|
| Origin answers normally | passed through unchanged |
| Origin answers 404 / 410 / 500 | passed through — a living origin said "no" |
| Origin unreachable, or 502/503/504/52x/530 | maintenance page, HTTP 503 |

The maintenance response honours the site principle *human-beautiful,
agent-readable* and negotiates on `Accept`:

- `text/html` → the visual page
- `application/json` → a small status object
- `text/plain` → the same information as text

All three carry `503` with `Retry-After: 900` and `Cache-Control: no-store`.
The `no-store` matters: a cached maintenance page would outlive the outage.

## What it deliberately does **not** do

- **No scheduled announcement banner.** Injecting "maintenance on <date>" into
  live pages would need a redeploy per window and a second code path that is
  exercised twice a year. The outage itself is short and acceptable.
- **No manual on/off switch.** That would need KV or a redeploy to flip. The
  automatic case already covers the need.

Both are easy to add later if a real reason appears. Neither has one today.

## The page

Fully self-contained: no external CSS, no web fonts, no images. This is not
minimalism for its own sake — the site's fonts are self-hosted **on the origin**
and are therefore unavailable in exactly this situation. Colour tokens mirror
`shared/css/tokens.css` and cover light, dark and both high-contrast variants;
the pulse animation is suppressed under `prefers-reduced-motion`.

Rendered and inspected in light and dark before commit — not imagined.

## Local check

```bash
cd platform/worker
node --input-type=module -e "
  import { maintenancePage } from './maintenance.js';
  import { writeFileSync } from 'fs';
  writeFileSync('/tmp/wartung.html', maintenancePage());
"
open /tmp/wartung.html
```

## Deploying

**Workers is available on this account** — checked in the dashboard on
2026-08-02: Free plan, `0 / 100,000` requests, and the one-time `workers.dev`
subdomain is already configured. Free-plan limits that matter here: 100,000
requests/day, 10 ms CPU per request. A pass-through costs almost no CPU (the
wait on the origin does not count), and the failure path builds a ~2.7 kB
string.

Steps:

1. **Authenticate.** `npx wrangler login` — OAuth in the browser. **No API
   token needed**, and therefore no long-lived secret to store or rotate.
2. **Deploy the script only**, without routes. Nothing on the live site is
   touched yet.
3. **Add routes one at a time**, starting with the least critical hostname, and
   confirm normal traffic still works after each. See `../tunnel-routing.md`
   for the list. **Not** `wetter.halfpap.io`.
4. **Verify against the failure case, not the happy path.** Stop the Caddy
   container, load the site, confirm the fallback page appears; start Caddy,
   confirm the site returns. A fallback that has never actually caught anything
   is untested.

Step 4 is the one that decides whether this works. The others only decide
whether it exists.

## A note on wording

The page deliberately does **not** say "scheduled maintenance". It answers
*every* origin outage, including ones nobody planned — and a page claiming a
planned window during an unplanned crash would be stating something untrue on
the operator's own business card. "Gerade nicht erreichbar" is true either way.
