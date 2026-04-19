#!/usr/bin/env bash
# Serves the GitHub Pages repo root so GearCheck is at http://localhost:5173/gearage/
set -euo pipefail
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(cd "$HERE/.." && pwd)"
cd "$ROOT"
PORT="${PORT:-5173}"
if command -v npx >/dev/null 2>&1; then
  exec npx --yes serve . -l "$PORT"
fi
echo "npx not found; using Python (http.server). Open http://localhost:${PORT}/gearage/"
exec python3 -m http.server "$PORT"
