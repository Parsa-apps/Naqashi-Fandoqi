# فندوقی — پروژه اندروید آفلاین 📱🌰

این پوشه یک پروژه کامل اندروید است که اپ وب فندوقی را به یک فایل **APK** تبدیل می‌کند که روی **همه گوشی‌های اندروید ۵ به بالا (API 21+)** نصب می‌شود — حتی بدون اینترنت!

## 🎯 چی داره؟

- **WebView آفلاین**: کل اپ (HTML/CSS/JS) داخل `assets/www` کپی شده — بدون نیاز به اینترنت
- **Universal APK**: یک فایل APK برای همه معماری‌ها (ARM, ARM64, x86) و همه اندازه صفحه‌ها
- **minSdk 21**: اندروید ۵ (Lollipop) تا اندروید ۱۴+ — یعنی ۹۹٪ گوشی‌های ایران
- **بدون وابستگی خارجی**: فقط Android SDK — هیچ کتابخانه خارجی نیست

## 📂 ساختار

```
android/
  app/
    src/main/
      java/com/fandoqi/app/MainActivity.java — اکتیویتی WebView
      AndroidManifest.xml — مجوزها و تنظیمات
      assets/www/ — کپی کامل اپ وب (index.html, css, js, icons...)
      res/mipmap-*/ic_launcher.png — آیکون
    build.gradle — تنظیمات بیلد universal APK
  build.gradle — پروژه
  settings.gradle
  gradlew / gradlew.bat — wrapper برای بیلد
```

## 🚀 ساخت APK — سه راه آسان

### راه ۱ — Android Studio (آسان‌ترین، ۱ کلیک)

1. Android Studio را نصب کن (https://developer.android.com/studio)
2. این پروژه را باز کن: `File → Open → پوشه android`
3. صبر کن تا Gradle sync شود (اولین بار اینترنت می‌خواهد)
4. بزن `Build → Build Bundle(s) / APK(s) → Build APK(s)`
5. بعد از تمام شدن: `app/build/outputs/apk/debug/app-debug.apk` را بردار — همین فایل روی همه گوشی‌ها نصب می‌شود!

### راه ۲ — خط فرمان (اگر Android SDK داری)

```bash
cd android
# کپی آخرین نسخه وب به assets (مهم!)
./sync-assets.sh   # یا: rm -rf app/src/main/assets/www/* && cp -r ../index.html ../css ../js ../icons ../manifest.json ../sw.js app/src/main/assets/www/

# بیلد
./gradlew assembleDebug

# خروجی:
# app/build/outputs/apk/debug/app-debug.apk
```

این فایل را روی گوشی کپی کن و نصب کن — تمام!

### راه ۳ — GitHub Actions (خودکار، بدون نیاز به SDK روی کامپیوتر شخصی)

1. ورک‌فلو از قبل فعال است: `.github/workflows/Apk.yml` — در هر پوش خودکار اجرا می‌شود، APK می‌سازد و `fandoqi.apk` و `apk/fandoqi-debug.apk` را در ریپو به‌روز می‌کند
2. وضعیت را از تب Actions ببین؛ APKهای خام هم در Artifacts هر اجرا هستند
4. APK آماده نصب!

## 📲 نصب روی گوشی

1. فایل `app-debug.apk` را به گوشی انتقال بده (تلگرام، کابل، گوگل درایو...)
2. روی فایل بزن — اگر گفت "نصب از منابع ناشناس" → تایید کن (این طبیعی است)
3. تمام! آیکون فندوقی روی صفحه می‌آید 🌰
4. حالا حتی در حالت هواپیما هم کار می‌کند! 📴

### چرا "منابع ناشناس"؟

چون APK را خودت ساختی و در گوگل پلی نیست — مثل همه اپ‌های ایرانی. امن است چون کدش همین‌جاست و هیچ داده به اینترنت نمی‌فرستد.

## 🔧 تنظیمات برای انتشار در کافه‌بازار / مایکت

اگر می‌خواهی در کافه‌بازار منتشر کنی:

1. در `app/build.gradle`:
   - `applicationId` را به شناسه خودت تغییر بده: مثلا `com.yourname.fandoqi`
   - `versionCode` را زیاد کن (هر آپدیت +۱)
   - `versionName` را مثلا "2.1" بگذار

2. یک keystore بساز:
```bash
keytool -genkey -v -keystore fandoqi.jks -keyalg RSA -keysize 2048 -validity 10000 -alias fandoqi
```

3. در `app/build.gradle` قسمت signingConfigs را به keystore خودت وصل کن

4. بیلد release:
```bash
./gradlew assembleRelease
# خروجی: app/build/outputs/apk/release/app-release.apk
```

## ❓ سوالات متداول

**آیا روی همه گوشی‌ها نصب می‌شود؟**
بله! minSdk 21 یعنی اندروید ۵ به بالا — یعنی حتی گوشی‌های ۸ سال پیش. universal APK یعنی یک فایل برای همه CPUها.

**آیا اینترنت می‌خواهد؟**
بعد از نصب، اصلاً! تمام فایل‌ها داخل APK هستند. فقط اولین بار برای بیلد کردن APK اینترنت لازم است (برای دانلود Gradle).

**حجم APK چقدر است؟**
حدود ۳-۵ مگابایت — چون فقط WebView + فایل‌های وب است.

**آیا می‌توانم آیکون یا نام را عوض کنم؟**
بله! در `res/mipmap-*` آیکون‌ها را عوض کن و در `AndroidManifest.xml` نام را.

## 🌰 حرف آخر

این پروژه را بده به هر برنامه‌نویس اندروید — با یک کلیک APK می‌سازد که روی همه گوشی‌ها نصب می‌شود و بدون اینترنت کار می‌کند — دقیقا مثل چیزی که برای کودکان روستا می‌خواستیم 💚
