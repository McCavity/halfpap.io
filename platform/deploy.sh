#!/usr/bin/env bash
#
# deploy.sh — push halfpap.io to the Docker host and (re)start Caddy.
#
# Platform ⊥ Application: this script materializes the build-synced content
# (shared/ → site roots), rsyncs the repo to the host OUTSIDE the Dockge public
# directory, and brings up the Caddy container there. TLS is terminated upstream
# by the Cloudflare Tunnel; Caddy speaks plain HTTP on :8080.
#
# The deploy TARGET is read from platform/deploy.env (gitignored — never commit
# real internal hostnames). Copy platform/deploy.env.example to get started.
#
# Idempotent: safe to run repeatedly.
#
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

ENV_FILE="platform/deploy.env"
if [ ! -f "$ENV_FILE" ]; then
	echo "✗ Missing $ENV_FILE — copy platform/deploy.env.example and fill in the target." >&2
	exit 1
fi
# shellcheck disable=SC1090
set -a; . "$ENV_FILE"; set +a

: "${DEPLOY_HOST:?set DEPLOY_HOST in deploy.env}"
: "${DEPLOY_USER:?set DEPLOY_USER in deploy.env}"
DEPLOY_PATH="${DEPLOY_PATH:-/root/stacks/halfpap-io}"
SSH_TARGET="${DEPLOY_USER}@${DEPLOY_HOST}"

echo "→ [1/3] materializing build-synced content (shared/ → site roots)"
./platform/sync-content.sh

echo "→ [2/3] rsync → ${SSH_TARGET}:${DEPLOY_PATH}"
ssh "$SSH_TARGET" "mkdir -p '${DEPLOY_PATH}'"
rsync -az --delete \
	--exclude='.git/' \
	--exclude='*.local' \
	--exclude='platform/deploy.env' \
	./ "${SSH_TARGET}:${DEPLOY_PATH}/"

echo "→ [3/3] (re)starting Caddy on ${DEPLOY_HOST}"
ssh "$SSH_TARGET" "cd '${DEPLOY_PATH}/platform' && docker compose up -d"

echo "✓ deployed to ${DEPLOY_HOST}:${DEPLOY_PATH}"
echo "  verify locally on the host:  curl -sI -H 'Host: www.halfpap.io' http://localhost:8080/"
