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
curl -H "Host: www.halfpap.io"     http://localhost:8080/
curl -H "Host: henning.halfpap.io" http://localhost:8080/
```

## License

MIT — see [LICENSE](LICENSE).
