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

## License

MIT — see [LICENSE](LICENSE).
