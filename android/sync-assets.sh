#!/usr/bin/env bash
# sync-assets.sh — کپی فایل‌های وب به اندروید
set -e
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DEST="$ROOT/android/app/src/main/assets/www"
echo "📂 Syncing web assets to $DEST"
rm -rf "$DEST"/*
mkdir -p "$DEST"
cp -r "$ROOT/index.html" "$ROOT/manifest.json" "$ROOT/sw.js" "$ROOT/css" "$ROOT/js" "$ROOT/icons" "$DEST"/
echo "✅ Done:"
ls -lh "$DEST"
