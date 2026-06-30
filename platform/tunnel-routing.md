# Cloudflare Tunnel routing

How `www.halfpap.io` and `henning.halfpap.io` reach the Caddy container. TLS is
terminated by Cloudflare; the tunnel forwards plain HTTP to Caddy on port `8080`.

> **Sanitized doc.** Real internal hostnames/IPs live only in `deploy.env`
> (gitignored), never in this public repo. Placeholders below: `<docker-host>` =
> the Docker host running Caddy, `<nas-tunnel>` = the existing Cloudflare Tunnel
> on the NAS.

## Topology

```
Browser ──HTTPS──▶ Cloudflare edge ──▶ <nas-tunnel> (cloudflared on the NAS)
                                          │  Public Hostname routes
                                          ▼
                                   http://<docker-host>:8080
                                          │  Host-header routing (Caddyfile)
                            ┌─────────────┴─────────────┐
                            ▼                           ▼
                  www.halfpap.io → /srv/www   henning.halfpap.io → /srv/henning
```

The tunnel already exists (it previously served the Ghost instance). Only the
Public Hostname routes change — no new tunnel, no new `cloudflared`.

## Public Hostname routes (Cloudflare Zero Trust → Networks → Tunnels → `<nas-tunnel>`)

| Public hostname        | Service                          |
|------------------------|----------------------------------|
| `www.halfpap.io`       | `http://<docker-host>:8080`      |
| `henning.halfpap.io`   | `http://<docker-host>:8080`      |

Caddy distinguishes the two by the `Host` header (see `platform/Caddyfile`), so
both routes point at the same origin `:8080`.

## Ghost cutover

1. Add the two Public Hostname routes above.
2. **Repoint** the existing `www.halfpap.io` route (currently → Ghost) to
   `http://<docker-host>:8080`.
3. Leave the **Ghost container running internally** — it is harmless once no
   tunnel route points at it. No data is migrated in Iteration 1.

## Post-cutover verification

```bash
for u in https://www.halfpap.io/ https://henning.halfpap.io/ \
         https://www.halfpap.io/impressum/ https://www.halfpap.io/datenschutz/ \
         https://henning.halfpap.io/llms.txt; do
  echo "$u -> $(curl -s -o /dev/null -w '%{http_code}' "$u")"
done
```

Expected: all `200`.
