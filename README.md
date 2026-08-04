# halfpap.io

Public web presence for Henning Halfpap — a central landing **hub** (`www.halfpap.io`) and a
personal **business card** (`henning.halfpap.io`), built static, accessible, and **agent-native**.

> **Made with AI. Made for humans and agents alike.**

This site is **largely AI-generated** (built collaboratively with Claude Code) and maintained by
a single operator. Content is human-curated; markup, config, and scaffolding are AI-assisted.

## Principle: human-beautiful, agent-readable

Every page serves humans (semantic, accessible HTML; light/dark/high-contrast themes) **and**
agents (curated `llms.txt`, schema.org JSON-LD, a permissive `robots.txt`) — the same
information, with or without the visual layer.

## Architecture: Platform ⊥ Application

Strict separation of concerns in one repository:

```
platform/   # PLATFORM — server config (Caddy), container, deploy, tunnel routing
sites/      # APPLICATION — content: www/ (hub), henning/ (business card)
shared/     # design system (CSS, self-hosted fonts), agent-native templates, legal pages
```

The static content is served by **Caddy** (Docker), mounted read-only as a volume. TLS is
terminated upstream by a Cloudflare Tunnel; Caddy speaks plain HTTP internally. Swapping the
host means re-pointing the tunnel — platform and content stay decoupled.

## Local development

Requires Docker.

```bash
cd platform
docker compose up -d
curl -H "Host: www.halfpap.io"     http://localhost:8082/
curl -H "Host: henning.halfpap.io" http://localhost:8082/
```

The host port is **8082**, not 8080 — `compose.yaml` maps `8082:8080`, and the
container's own port is the 8080 that used to be quoted here. Whatever else is
listening on 8080 will answer instead and look like a broken deploy: on the
author's machine that is a CheckMK container, which answered a confident `302`
to the command as it was previously written.

## Deploying a CSS change: bump the version stamp

Stylesheets are linked with a version query — `href="/css/base.css?v=2026-08-04"`.
**Change it in the same commit that changes any file under `shared/css/`.**

The reason is a real one, measured on 2026-08-04. Cloudflare caches `.css` at the
edge by extension with `max-age=14400`; HTML is not cached. A deploy therefore
publishes new markup **immediately** and new styles **up to four hours later** —
and in between, visitors get the new page wearing the old stylesheet. That day it
meant a maintenance banner served unstyled on the business card, while both the
origin and the local container were serving the correct file. Every check that
looked at the origin said the deploy was fine.

A changed query string is a new cache key, so the fetch goes to the origin and the
result is correct on the first request. This needs no dashboard access and no API
token for cache purging — which is also why it is preferred over purging.

The version stamp is a date, not a counter: two changes on the same day want the
same key only if the CSS is byte-identical. When in doubt, verify what the *edge*
serves, not what the origin holds:

```bash
curl -s https://www.halfpap.io/css/base.css | grep -c "<the new rule>"
curl -sI https://www.halfpap.io/css/base.css | grep -i "cf-cache-status\|age"
```

## License

MIT — see [LICENSE](LICENSE).
