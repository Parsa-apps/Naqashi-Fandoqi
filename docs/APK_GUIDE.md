# راهنمای ساخت APK فندوقی 📱🌰 — نصب روی همه گوشی‌های اندروید

> **هدف:** یک فایل `app-debug.apk` بسازی که روی **همه گوشی‌های اندروید ۵ تا ۱۴+** نصب شود و **بدون اینترنت** کار کند.

---

## 🎯 سه راه — هر کدام ۱ دقیقه تا ۵ دقیقه

### راه ۱: Android Studio (ساده‌ترین — پیشنهاد من) ⭐

**برای چه کسی؟** کسی که ویندوز/مک دارد و می‌خواهد با یک کلیک APK بسازد.

1. **Android Studio** را نصب کن:
   - https://developer.android.com/studio
   - حجم ~۱ گیگ، یک بار نصب

2. پروژه را باز کن:
   - `File → Open → پوشه android` داخل همین پروژه را انتخاب کن
   - صبر کن تا پایین صفحه `Gradle sync finished` بیاید (اولین بار ۲-۵ دقیقه اینترنت می‌خواهد)

3. APK بساز:
   - منو: `Build → Build Bundle(s) / APK(s) → Build APK(s)`
   - صبر کن تا پایین `BUILD SUCCESSFUL`
   - بزن `locate` → پوشه باز می‌شود

4. فایل را بردار:
   ```
   android/app/build/outputs/apk/debug/app-debug.apk
   ```
   همین فایل را روی هر گوشی اندروید نصب کن!

---

### راه ۲: خط فرمان (برای برنامه‌نویس)

اگر Android SDK و JDK داری:

```bash
# 1. آخرین وب را به اندروید کپی کن
./build-apk.sh
# یا دستی:
rm -rf android/app/src/main/assets/www/*
cp -r index.html manifest.json sw.js css js icons android/app/src/main/assets/www/

# 2. بیلد
cd android
./gradlew assembleDebug

# خروجی:
# app/build/outputs/apk/debug/app-debug.apk
```

---

### راه ۳: GitHub Actions (بدون نیاز به نصب چیزی روی کامپیوتر شخصی) 🤖

**برای چه کسی؟** کسی که نمی‌خواهد Android Studio نصب کند — GitHub خودش APK می‌سازد!

1. ورک‌فلو از قبل فعال است: `.github/workflows/Apk.yml`
   در هر پوش به `main` خودکار اجرا می‌شود و `fandoqi.apk` و `apk/fandoqi-debug.apk` را در ریپو به‌روز می‌کند.

2. برو به گیت‌هاب:
   - تب `Actions` → آخرین Workflow `📱 Build Fandoqi APK` → صبر کن سبز شود (۳-۵ دقیقه)
   - `fandoqi.apk` از ریشه ریپو (یا artifact آخرین اجرا) دانلود کن
   - داخلش `app-debug.apk` است!

3. اگر روی `main` پوش کنی، حتی یک Release خودکار هم ساخته می‌شود با APK!

---

## 📲 نصب APK روی گوشی

1. فایل `app-debug.apk` را به گوشی بفرست:
   - تلگرام به خودت، کابل USB، گوگل درایو، بلوتوث...

2. روی گوشی روی فایل بزن:
   - اگر گفت: **"نصب از منابع ناشناس"** یا **"Install from unknown sources"**
   - برو `تنظیمات → اجازه بده` (این برای همه اپ‌های خارج از گوگل پلی طبیعی است)

3. نصب شد! آیکون **فندوقی 🌰** روی صفحه می‌آید

4. حالا **حالت هواپیما** را روشن کن و اپ را باز کن — هنوز کار می‌کند! 📴🎨

---

## ❓ چرا روی همه گوشی‌ها نصب می‌شود؟

تنظیمات `android/app/build.gradle`:

```gradle
minSdk 21  // اندروید ۵ (Lollipop) — ۲۰۱۴ به بعد
targetSdk 34 // اندروید ۱۴
```

- **minSdk 21**: یعنی حتی گوشی ۸ سال پیش هم نصب می‌کند — ۹۹٪ گوشی‌های ایران
- **Universal APK**: `bundle { enableSplit = false }` یعنی یک فایل برای همه CPUها (arm, arm64, x86)
- **بدون کتابخانه خارجی**: فقط WebView خود اندروید — حجم کم، سازگار بالا

---

## 🔒 آیا امن است؟

بله!

- تمام کد همین‌جاست — `MainActivity.java` فقط ۸۰ خط
- هیچ داده به اینترنت نمی‌فرستد (می‌توانی اینترنت گوشی را قطع کنی و تست کنی)
- اگر می‌خواهی در کافه‌بازار منتشر کنی، فقط یک keystore شخصی بساز (راهنما در `android/README.md`)

---

## 📦 حجم APK چقدر است؟

- Debug APK: حدود ۳-۵ مگابایت
- Release APK (minify): حدود ۲-۴ مگابایت

برای یک اپ نقاشی کامل با ۱۸ ابزار، آلبوم، آموزش — عالی است!

---

## 🛠️ اگر خطا دیدی؟

**`SDK location not found`:**
- در Android Studio یک بار پروژه را باز کن — خودش SDK را می‌سازد
- یا فایل `android/local.properties` بساز و آدرس SDK را بنویس:
  ```
  sdk.dir=/home/user/Android/Sdk  (لینوکس)
  sdk.dir=C\:\\Users\\You\\AppData\\Local\\Android\\Sdk  (ویندوز)
  ```

**`gradle: command not found`:**
- از `./gradlew` استفاده کن نه `gradle`
- یا Android Studio را باز کن

---

## 🎁 هدیه: PWA هم APK می‌سازد!

اگر نخواهی APK دستی بسازی:

1. سایت فندوقی را در **کروم اندروید** باز کن
2. منو (سه نقطه) → **"نصب برنامه"** یا **"Add to Home Screen"**
3. کروم خودش یک APK سبک (WebAPK) می‌سازد و نصب می‌کند — بدون نیاز به Android Studio!

این روش هم روی همه گوشی‌ها کار می‌کند و آفلاین است.

---

**تمام! حالا APK داری که روی همه گوشی‌ها نصب می‌شود — بده به بچه‌ها! 🌰📱**
