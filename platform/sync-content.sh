#!/usr/bin/env bash
#
# sync-content.sh — mirror shared/ assets into the site roots (Platform ⊥
# Application build step). Source of truth lives in shared/; the mirrored copies
# in sites/*/ are gitignored build artifacts. Run before serving locally or
# before deploy (platform/deploy.sh calls this in Task 6). Idempotent.
#
set -euo pipefail

# Repo root = parent of this script's directory.
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

echo "→ syncing shared/css + shared/fonts into site roots"
for site in www henning; do
	mkdir -p "sites/$site/css" "sites/$site/fonts"
	cp shared/css/*.css "sites/$site/css/"
	cp shared/fonts/*.woff2 "sites/$site/fonts/"
done

echo "→ mirroring canonical legal pages under www/"
mkdir -p sites/www/impressum sites/www/datenschutz
cp shared/legal/impressum.html sites/www/impressum/index.html
cp shared/legal/datenschutz.html sites/www/datenschutz/index.html

echo "✓ content sync complete"
