# 🔧 رفع ورک‌فلو ساخت APK — راهنمای ۲ دقیقه‌ای

## مشکل چه بود؟

1. فایل `.github/workflows/Apk.yml` **ناقص بود** — بعد از مرحله «سینک فایل‌ها» قطع شده بود و
   هیچ‌وقت دستور ساخت (gradle) اجرا نمی‌شد. برای همین در تمام این مدت ورک‌فلو «سبز» می‌شد
   ولی هیچ APK تازه‌ای ساخته نمی‌شد.
2. در نتیجه `fandoqi.apk` و `apk/fandoqi-debug.apk` داخل ریپو **کهنه** ماندند — نسخه‌ای از
   چند ماه پیش که فقط ۹ فایل JS از ۲۲ فایل و ۲ فایل CSS از ۱۳ فایل فعلی را داشت.
   (`main.yml` هم به‌جای YAML، چند خط دستور ترمینال بود و در هر پوش fail می‌شد.)

## راه‌حل

محتوای درست و کامل هر دو ورک‌فلو آماده شده:

- `workflows/Apk.yml` → باید برود به `.github/workflows/Apk.yml`
- `workflows/main.yml` → باید برود به `.github/workflows/main.yml`

از این به بعد در هر پوش، ورک‌فلو خودش APK را می‌سازد و `fandoqi.apk` و `apk/fandoqi-debug.apk`
را در ریپو به‌روز می‌کند — دیگر هیچ‌وقت APK کهنه نمی‌شود. 📦

## چرا این فایل‌ها را خود ایجنت مستقیم جابه‌جا نکرد؟

اتصال گیت‌هاب ایجنت (GitHub App) دسترسی ویرایش فایل‌های `.github/workflows/` را ندارد
(گیت‌هاب برای تغییر ورک‌فلوها دسترسی ویژه «Workflows» می‌خواهد). بقیه تغییرات را ایجنت
پوش کرده؛ فقط این دو فایل باید یکی از دو راه زیر فعال شوند:

## راه ۱ — دادن دسترسی به اپ (توصیه‌شده، یک‌بار برای همیشه) ⭐

1. در گیت‌هاب: `Settings → Applications → Arena (یا ایجنت متصل) → Configure`
2. در بخش Repository permissions مقدار **Workflows** را روی **Read and write** بگذار
   (یا اتصال گیت‌هاب را در Arena قطع و دوباره وصل کن).
3. به ایجنت بگو «دسترسی را دادم» — ایجنت خودش فایل‌ها را پوش می‌کند و از آن به بعد
   همه‌چیز خودکار است.

## راه ۲ — کپی دستی با وب (۲ دقیقه) ⭐

> ⚠️ **مواظب جابه‌جا نشدن فایل‌ها:** هر فایل خام فقط باید داخل فایل هم‌نام خودش در `.github/workflows/` پیست شود.
> `workflows/Apk.yml` (ساخت APK، ~۸۵ خط) → `.github/workflows/Apk.yml`
> `workflows/main.yml` (تست‌ها، ~۲۷ خط) → `.github/workflows/main.yml`
> بعد از paste چک کن: خط اول باید `name: 📱 Build Fandoqi APK` (برای Apk.yml) یا `name: 🧪 Fandoqi Tests` (برای main.yml) باشد.

لینک‌های زیر مستقیم صفحهٔ ویرایش هر فایل را روی برنچ `arena/01a013ac-naqashi-fandoqi` باز می‌کنند:

1. این لینک را باز کن (ویرایش Apk.yml):
   👉 `https://github.com/Parsa-apps/Naqashi-Fandoqi/edit/arena/01a013ac-naqashi-fandoqi/.github/workflows/Apk.yml`
2. محتوای این لینک را باز کن، **کامل کپی** کن (Ctrl+A سپس Ctrl+C):
   📄 `https://raw.githubusercontent.com/Parsa-apps/Naqashi-Fandoqi/arena/01a013ac-naqashi-fandoqi/workflows/Apk.yml`
3. برگرد به صفحهٔ ویرایش، همهٔ محتوا را پاک/انتخاب کن (Ctrl+A) و جایگزین کن (Ctrl+V)
4. پایین صفحه «Commit changes» — مطمئن شو گزینهٔ **Commit directly to the `arena/01a013ac-naqashi-fandoqi` branch** انتخاب شده → Commit
5. همین ۴ قدم را برای main.yml تکرار کن:
   - ویرایش: `https://github.com/Parsa-apps/Naqashi-Fandoqi/edit/arena/01a013ac-naqashi-fandoqi/.github/workflows/main.yml`
   - محتوا: `https://raw.githubusercontent.com/Parsa-apps/Naqashi-Fandoqi/arena/01a013ac-naqashi-fandoqi/workflows/main.yml`
6. بعد از commit، ورک‌فلو خودکار اجرا می‌شود، APK تازه ساخته و در ریپو commit می‌شود ✅

## بعد از رفع، از کجا بفهمم درست شد؟

- تب **Actions** → اجرای «📱 Build Fandoqi APK» باید حدود ۳-۵ دقیقه طول بکشد (نه ۳۰ ثانیه!)
- داخل اجرا، لاگ مرحله «Check APKs» باید تعداد فایل‌های `assets/www` را نشان دهد (۳۸+ فایل)
- حجم `fandoqi.apk` در ریپو حدود **۱.۴ تا ۱.۶ مگابایت** خواهد بود
- روی گوشی: تنظیمات → Apps → فندوقی → نسخه باید **2.1.0** باشد
- ⚠️ اگر نسخه قدیمی (`com.quadrats...`) روی گوشی نصب است، اول آن را حذف کن
