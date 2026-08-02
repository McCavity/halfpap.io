/**
 * Maintenance shim for halfpap.io
 *
 * Sits in front of the tunnel-backed hostnames. Normal traffic passes straight
 * through. When the origin cannot be reached, this returns a self-contained
 * maintenance page instead of a Cloudflare error screen.
 *
 * Why a Worker and not a static fallback: the Worker runs at the edge, so it
 * still works precisely when the origin is gone — which is the only moment it
 * matters. `wetter.halfpap.io` is deliberately out of scope; it is served from
 * different hardware and survives on its own.
 *
 * Deliberately NOT implemented (see README):
 *   - scheduled announcement banners (would need a redeploy per window)
 *   - a manual on/off switch (would need KV; the automatic case covers the need)
 *
 * The page is fully self-contained: no external CSS, no web fonts, no images.
 * The site's own fonts are self-hosted ON the origin, so they are unavailable
 * in exactly the situation this page exists for.
 */

/** Upstream statuses that mean "origin is not answering", not "origin said no". */
const UPSTREAM_FAILURE = new Set([502, 503, 504, 521, 522, 523, 524, 525, 526, 530]);

/** Seconds a client should wait before retrying. */
const RETRY_AFTER = 900;

export default {
  async fetch(request) {
    let response;
    try {
      response = await fetch(request);
    } catch {
      // Network-level failure between edge and origin.
      return maintenanceResponse(request);
    }

    if (UPSTREAM_FAILURE.has(response.status)) {
      return maintenanceResponse(request);
    }

    // 404, 410, 500 and friends are real answers from a living origin.
    return response;
  },
};

/**
 * Content negotiation, matching the site principle "human-beautiful,
 * agent-readable": the same information with or without the visual layer.
 */
function maintenanceResponse(request) {
  const accept = request.headers.get("accept") || "";
  const headers = {
    "cache-control": "no-store",
    "retry-after": String(RETRY_AFTER),
  };

  if (accept.includes("application/json")) {
    return new Response(JSON.stringify(maintenanceData(), null, 2) + "\n", {
      status: 503,
      headers: { ...headers, "content-type": "application/json; charset=utf-8" },
    });
  }

  if (accept.includes("text/plain") && !accept.includes("text/html")) {
    return new Response(maintenanceText(), {
      status: 503,
      headers: { ...headers, "content-type": "text/plain; charset=utf-8" },
    });
  }

  return new Response(maintenancePage(), {
    status: 503,
    headers: { ...headers, "content-type": "text/html; charset=utf-8" },
  });
}

export function maintenanceData() {
  return {
    status: "unavailable",
    code: 503,
    message: "Origin unreachable. The site will be back shortly.",
    retry_after_seconds: RETRY_AFTER,
    unaffected: ["wetter.halfpap.io"],
  };
}

export function maintenanceText() {
  return [
    "halfpap.io — gerade nicht erreichbar",
    "",
    "Sie kommt in Kürze zurück — bitte in ein paar Minuten noch einmal versuchen.",
    "This site is temporarily unavailable and will be back shortly.",
    "",
    "Nicht betroffen / unaffected: wetter.halfpap.io",
    "",
    `Retry-After: ${RETRY_AFTER}s`,
  ].join("\n") + "\n";
}

/** The visual page. Tokens mirror shared/css/tokens.css, inlined by necessity. */
export function maintenancePage() {
  return `<!doctype html>
<html lang="de">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>Gerade nicht erreichbar — halfpap.io</title>
<style>
  :root {
    --font-body: ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif;
    --radius: 0.75rem;
    --bg: #f7f9fc; --surface: #ffffff; --text: #11151c;
    --accent: #1f5fd0; --border: rgba(15, 23, 42, 0.12);
  }
  @media (prefers-color-scheme: dark) {
    :root {
      --bg: #0a0c10; --surface: #12151c; --text: #e7eaf0;
      --accent: #6aa0ff; --border: rgba(255, 255, 255, 0.10);
    }
  }
  @media (prefers-contrast: more) {
    :root {
      --bg: #ffffff; --surface: #ffffff; --text: #000000;
      --accent: #0b3aa0; --border: #000000;
    }
  }
  @media (prefers-contrast: more) and (prefers-color-scheme: dark) {
    :root {
      --bg: #000000; --surface: #000000; --text: #ffffff;
      --accent: #9bc1ff; --border: #ffffff;
    }
  }
  * { box-sizing: border-box; }
  body {
    margin: 0; min-height: 100svh; display: grid; place-items: center;
    padding: 1.5rem; background: var(--bg); color: var(--text);
    font-family: var(--font-body); line-height: 1.6;
    -webkit-text-size-adjust: 100%;
  }
  main {
    width: min(34rem, 100%); background: var(--surface);
    border: 1px solid var(--border); border-radius: var(--radius);
    padding: clamp(1.5rem, 4vw, 2.5rem);
  }
  h1 { margin: 0 0 .75rem; font-size: clamp(1.35rem, 4vw, 1.75rem); line-height: 1.25; }
  p { margin: 0 0 1rem; }
  p:last-of-type { margin-bottom: 0; }
  .lead { font-size: 1.05rem; }
  .en { color: var(--text); opacity: .72; font-size: .95rem; }
  .rule { height: 1px; background: var(--border); border: 0; margin: 1.5rem 0; }
  .note { font-size: .9rem; }
  a { color: var(--accent); }
  @media (prefers-reduced-motion: no-preference) {
    .dot { animation: pulse 2s ease-in-out infinite; }
  }
  .dot {
    display: inline-block; width: .5rem; height: .5rem; border-radius: 50%;
    background: var(--accent); margin-right: .5rem; vertical-align: baseline;
  }
  @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: .35; } }
</style>
</head>
<body>
<main>
  <h1><span class="dot" aria-hidden="true"></span>Gerade nicht erreichbar</h1>
  <p class="lead">Sie kommt in Kürze zurück — bitte in ein paar Minuten noch einmal versuchen.</p>
  <p class="en" lang="en">This site is temporarily unavailable and will be back shortly.</p>
  <hr class="rule">
  <p class="note">
    Nicht betroffen ist <a href="https://wetter.halfpap.io">wetter.halfpap.io</a> —
    die Wetterkonsole läuft auf eigener Hardware.
  </p>
</main>
</body>
</html>
`;
}
