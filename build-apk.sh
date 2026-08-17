#!/usr/bin/env bash
# build-apk.sh — ساخت APK فندوقی برای همه گوشی‌های اندروید 📱🌰
# استفاده: ./build-apk.sh

set -e

ROOT="$(cd "$(dirname "$0")" && pwd)"
ANDROID="$ROOT/android"
WWW="$ANDROID/app/src/main/assets/www"

echo "🌰 فندوقی — ساخت APK آفلاین برای همه گوشی‌ها"
echo "============================================"

# 1. سینک کردن آخرین نسخه وب به assets
echo "📂 [1/4] سینک کردن فایل‌های وب به Android assets..."
rm -rf "$WWW"/*
mkdir -p "$WWW"
cp -r "$ROOT/index.html" "$ROOT/manifest.json" "$ROOT/sw.js" "$ROOT/css" "$ROOT/js" "$ROOT/icons" "$WWW"/ 2>/dev/null || cp -r "$ROOT/index.html" "$ROOT/manifest.json" "$ROOT/sw.js" "$ROOT/css" "$ROOT/js" "$ROOT/icons" "$WWW/"
echo "  ✅ فایل‌ها کپی شد:"
ls -lh "$WWW"/ | sed 's/^/     /'

# 2. چک کردن Android SDK
echo ""
echo "🔍 [2/4] بررسی ابزارهای اندروید..."
if [ -f "$ANDROID/gradlew" ]; then
  chmod +x "$ANDROID/gradlew"
  echo "  ✅ gradlew پیدا شد"
else
  echo "  ❌ gradlew پیدا نشد!"
  exit 1
fi

if command -v java >/dev/null 2>&1; then
  echo "  ✅ Java: $(java -version 2>&1 | head -n1)"
else
  echo "  ⚠️  Java پیدا نشد — روی GitHub Actions خودکار نصب می‌شود، روی PC باید JDK 17 نصب کنی"
fi

# 3. بیلد
echo ""
echo "🏗️  [3/4] ساخت APK..."
cd "$ANDROID"

if ./gradlew assembleDebug --stacktrace; then
  echo ""
  echo "🎉 [4/4] APK ساخته شد!"
  echo ""
  APK="$ANDROID/app/build/outputs/apk/debug/app-debug.apk"
  if [ -f "$APK" ]; then
    SIZE=$(du -h "$APK" | cut -f1)
    echo "📦 فایل APK: $APK"
    echo "📏 حجم: $SIZE"
    echo ""
    echo "📲 نصب روی گوشی:"
    echo "   1. فایل را به گوشی انتقال بده (تلگرام / کابل)"
    echo "   2. روی فایل بزن → تایید نصب از منابع ناشناس"
    echo "   3. تمام! حتی بدون اینترنت کار می‌کند 🌰📴"
    echo ""
    # اگر adb وصل است، نصب خودکار
    if command -v adb >/dev/null 2>&1 && adb devices | grep -q device; then
      echo "🔌 گوشی با adb وصل است — نصب خودکار..."
      adb install -r "$APK" && echo "✅ روی گوشی نصب شد!"
    fi
  fi
else
  echo ""
  echo "❌ بیلد محلی ناموفق — احتمالاً Android SDK نداری. نگران نباش!"
  echo ""
  echo "دو راه دیگر داری:"
  echo "  1) Android Studio: پوشه android را باز کن → Build → Build APK(s) → 1 کلیک!"
  echo "  2) GitHub Actions: فایل workflows/build-apk.yml.example را به .github/workflows/ کپی کن، push کن، APK از تب Actions دانلود می‌شود"
  echo ""
  echo "راهنمای کامل: cat docs/APK_GUIDE.md"
  exit 2
fi
