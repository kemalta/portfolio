#!/usr/bin/env bash
# Builds the static export and publishes ./out to the `gh-pages` branch.
#
# GitHub Pages serves that branch at https://kemalta.github.io/portfolio/ with
# no server and no cost. The `main` branch keeps the source; this branch holds
# only the generated files.
#
#   npm run deploy
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

: "${NEXT_PUBLIC_BASE_PATH:=/portfolio}"
: "${NEXT_PUBLIC_SITE_URL:=https://kemalta.github.io/portfolio}"
export NEXT_PUBLIC_BASE_PATH NEXT_PUBLIC_SITE_URL
export NEXT_PUBLIC_CONTACT_MODE="${NEXT_PUBLIC_CONTACT_MODE:-mailto}"
export GITHUB_PAGES=1

npm run build:pages

REMOTE="$(git remote get-url origin)"
STAGE="$(mktemp -d)"
trap 'rm -rf "$STAGE"' EXIT

cp -R out/. "$STAGE"/
touch "$STAGE/.nojekyll"

cd "$STAGE"
git init -q -b gh-pages
git add -A
git -c user.name="Kemal Talha Ekici" \
    -c user.email="kemaltalhaekici@gmail.com" \
    commit -qm "Deploy $(date -u +%Y-%m-%dT%H:%M:%SZ)"
git push -f "$REMOTE" gh-pages

echo "Yayınlandı: $NEXT_PUBLIC_SITE_URL/"
