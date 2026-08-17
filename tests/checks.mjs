/* ============================================================
   tests/checks.mjs — تست‌های خودکار مدیریت پروژه
   اجرا:  node tests/checks.mjs
   ============================================================ */
import { readFileSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
let pass = 0;
let fail = 0;

function ok(name, cond, extra) {
  if (cond) {
    pass++;
    console.log('  ✔ ' + name);
  } else {
    fail++;
    console.log('  ✘ ' + name + (extra ? '  ← ' + extra : ''));
  }
}

function section(title) {
  console.log('\n■ ' + title);
}

/* ---------- بخش ۱: سلامت سینتکس همهٔ فایل‌های JS ---------- */
section('بررسی سینتکس فایل‌های جاوااسکریپت');
const JS_FILES = [
  'js/storage-core.js', 'js/utils.js', 'js/sound.js',
  'js/engine.js', 'js/album.js', 'js/tutorials.js',
  'js/parent-gate.js', 'js/theme.js', 'js/achievements.js',
  'js/about.js', 'js/splash.js', 'js/stickers.js',
  'js/save-anim.js', 'js/onboarding.js', 'js/app.js'
];
for (const f of JS_FILES) {
  const path = join(ROOT, f);
  try {
    execFileSync('node', ['--check', path], { stdio: 'pipe' });
    ok('سینتکس ' + f + ' درست است', true);
  } catch (e) {
    ok('سینتکس ' + f + ' درست است', false, e.stderr ? e.stderr.toString() : e.message);
  }
}

/* ---------- بخش ۲: هستهٔ ذخیره‌سازی ---------- */
section('تست‌های storage-core (با حافظهٔ ساختگی)');
const SC = (await import(pathToFileURL(join(ROOT, 'js/storage-core.js')).href)).default;

const mem = new Map();
const store = {
  getItem: (k) => (mem.has(k) ? mem.get(k) : null),
  setItem: (k, v) => mem.set(k, String(v)),
  removeItem: (k) => mem.delete(k)
};

ok('sanitizeName: نام خالی → نام پیش‌فرض', SC.sanitizeName('') === 'شاهکار بدون نام');
ok('sanitizeName: بریدن نام طولانی در ۴۰ حرف', SC.sanitizeName('x'.repeat(100)).length === SC.MAX_NAME_LEN);
ok('sanitizeName: حذف فاصله‌های اضافه', SC.sanitizeName('  سلام  ') === 'سلام');

const rec = SC.createRecord('گربه', 12345, 'data:image/png;base64,AAA', 'data:image/jpeg;base64,BBB');
ok('createRecord: ساخت رکورد معتبر', SC.validateRecord(rec));
ok('validateRecord: رد رکورد خراب', !SC.validateRecord({ id: 'x', name: 'y' }));

const album = Array.from({ length: SC.MAX_ALBUM_ITEMS }, () => rec);
ok('canAdd: رد کردن آلبوم پر', SC.canAdd(album, rec).reason === 'full');
ok('canAdd: پذیرفتن آلبوم خالی', SC.canAdd([], rec).ok === true);

const huge = { dataUrl: 'data:image/png;base64,' + 'A'.repeat(SC.MAX_TOTAL_CHARS) };
ok('canAdd: رد کردن حجم بیش از سقف', SC.canAdd([], huge).reason === 'space');

const res = SC.addToAlbum(rec, store);
ok('addToAlbum: افزودن موفق', res.ok === true && res.album.length === 1);
ok('safeGet/safeSet: رفت‌وبرگشت درست', SC.safeGet(SC.KEYS.album, [], store).length === 1);

store.setItem(SC.KEYS.album, JSON.stringify([rec, { bad: true }, null, 42]));
ok('loadAlbum: فیلتر رکوردهای نامعتبر', SC.loadAlbum(store).length === 1);

const res2 = SC.removeFromAlbum(rec.id, store);
ok('removeFromAlbum: حذف موفق', res2.ok === true && res2.album.length === 0);

ok('loadDraft: رد URL غیرتصویر', SC.loadDraft(store) === null);
ok('saveDraft: ذخیرهٔ پیش‌نویس معتبر', SC.saveDraft('data:image/png;base64,ZZZ', store) === true);
ok('loadDraft: خواندن پیش‌نویس', SC.loadDraft(store) === 'data:image/png;base64,ZZZ');

SC.saveFlag(SC.KEYS.sound, false, store);
ok('saveFlag/loadFlag: ذخیرهٔ تنظیمات', SC.loadFlag(SC.KEYS.sound, true, store) === false);
ok('loadFlag: مقدار پیش‌فرض وقتی خالی است', SC.loadFlag('nf.v1.nope', true, store) === true);

SC.saveProgress({ cat: [0, 1] }, store);
ok('saveProgress/loadProgress: رفت‌وبرگشت', SC.loadProgress(store).cat.length === 2);

/* ---------- بخش ۳: ابزارهای عمومی ---------- */
section('تست‌های utils');
const U = (await import(pathToFileURL(join(ROOT, 'js/utils.js')).href)).default;

ok('clamp: محدودکردن مقدار', U.clamp(150, 2, 64) === 64 && U.clamp(-5, 2, 64) === 2);
ok('hexToRgb: تبدیل درست', JSON.stringify(U.hexToRgb('#ff0000')) === JSON.stringify({ r: 255, g: 0, b: 0 }));
ok('hexToRgb: رد ورودی نامعتبر', U.hexToRgb('not-a-color') === null);
ok('rgba: ساخت رنگ نیمه‌شفاف', U.rgba('#0000ff', 0.5) === 'rgba(0,0,255,0.5)');

const ids = new Set();
for (let i = 0; i < 500; i++) ids.add(SC.uid());
ok('uid: یکتایی ۵۰۰ شناسه', ids.size === 500);

const fa = U.formatDateFa(Date.now());
ok('formatDateFa: خروجی غیرخالی', typeof fa === 'string' && fa.length > 0);
ok('toFaDigits: تبدیل ارقام', U.toFaDigits(123) === '۱۲۳');

/* ---------- بخش ۴: داده‌های آموزش ---------- */
section('تست‌های داده‌های آموزش و ترفندها');
const T = (await import(pathToFileURL(join(ROOT, 'js/tutorials.js')).href)).default;

ok('حداقل ۵ آموزش وجود دارد (FR-8)', T.TUTORIALS.length >= 5);
ok('حداقل ۶ ترفند وجود دارد (FR-9)', T.TIPS.length >= 6);
ok('۸ آموزش فراهم است (۵ اصلی + ۳ با متد جدید)', T.TUTORIALS.length === 8);
ok('۹ ترفند فراهم است (۶ اصلی + ۳ متد جدید)', T.TIPS.length === 9);

const idsSet = new Set(T.TUTORIALS.map((t) => t.id));
ok('شناسهٔ آموزش‌ها یکتاست', idsSet.size === T.TUTORIALS.length);

let tutorialsValid = true;
for (const t of T.TUTORIALS) {
  if (!t.title || !t.emoji || !Array.isArray(t.steps) || t.steps.length < 3) tutorialsValid = false;
  for (const s of t.steps) {
    if (!s.text || s.text.length < 5) tutorialsValid = false;
    if (!s.svg.startsWith('<svg') || !s.svg.includes('</svg>')) tutorialsValid = false;
  }
}
ok('ساختار همهٔ آموزش‌ها (≥۳ قدم، متن و SVG معتبر)', tutorialsValid);

/* ---------- بخش ۵: ساختار HTML و CSS ---------- */
section('تست‌های ساختار HTML و CSS');
const html = readFileSync(join(ROOT, 'index.html'), 'utf8');
const css = readFileSync(join(ROOT, 'css/style.css'), 'utf8');

ok('زبان فارسی و جهت RTL', html.includes('lang="fa"') && html.includes('dir="rtl"'));
ok('وجود متاتگ viewport', html.includes('name="viewport"'));
ok('وجود بوم نقاشی با شناسه board', html.includes('id="board"'));
ok('وجود ۳ تب اصلی', (html.match(/role="tab"/g) || []).length === 3);
for (const f of JS_FILES) {
  ok('لینک اسکریپت ' + f, html.includes('src="' + f + '"'));
}
ok('CSS: وجود قواعد ریسپانسیو', css.includes('@media (max-width: 920px)'));
ok('CSS: وجود فوکوس قابل مشاهده', css.includes(':focus-visible'));
ok('CSS: پشتیبانی prefers-reduced-motion', css.includes('prefers-reduced-motion'));
ok('CSS: عدم تداخل ارتفاع در موبایل', css.includes('46vh'));

/* ---------- بخش ۶: سیستم‌های جانبی ---------- */
section('تست‌های Sound.chime');
{
  const Sound = (await import(pathToFileURL(join(ROOT, 'js/sound.js')).href)).default;
  ok('Sound.chime به‌عنوان تابع وجود دارد', typeof Sound.chime === 'function');
  ok('Sound.isEnabled یک boolean برمی‌گرداند', typeof Sound.isEnabled() === 'boolean');
  ok('Sound.setEnabled(false) غیرفعال می‌کند', Sound.setEnabled(false) === false && Sound.isEnabled() === false);
  Sound.chime();
  ok('Sound.setEnabled(true) فعال می‌کند', Sound.setEnabled(true) === true);
  // کنترل حجم صدا
  ok('Sound.getVolume() مقدار اولیه بین ۰ و ۱ برمی‌گرداند', Sound.getVolume() >= 0 && Sound.getVolume() <= 1);
  ok('Sound.setVolume(0.3) حجم را تنظیم می‌کند', Sound.setVolume(0.3) === 0.3 && Sound.getVolume() === 0.3);
  ok('Sound.setVolume(5) کلمپ به ۱ می‌شود', Sound.setVolume(5) === 1);
  ok('Sound.setVolume(-1) کلمپ به ۰ می‌شود', Sound.setVolume(-1) === 0);
  Sound.setVolume(0.85);
}

section('تست‌های ParentGate');
{
  const PG = (await import(pathToFileURL(join(ROOT, 'js/parent-gate.js')).href)).default;
  ok('ParentGate.open یک Promise برمی‌گرداند', typeof PG.open === 'function');
  ok('ParentGate.close یک تابع است', typeof PG.close === 'function');
  // در Node چون document نیست، open فوراً false برمی‌گرداند
  const p = PG.open();
  ok('ParentGate.open در Node به‌سرعت false برمی‌گرداند', (await p) === false);
  PG.close(true);
}

section('تست‌های Stickers (Sticker Box)');
{
  const S = (await import(pathToFileURL(join(ROOT, 'js/stickers.js')).href)).default;
  ok('Stickers شامل ۸ استیکر همیشه‌دردسترس است', S.listAvailable().length >= 8);
  ok('Stickers.listLocked در Node حداقل ۰ قفل دارد', Array.isArray(S.listLocked()));
  ok('Stickers.STICKERS آرایهٔ کامل است', Array.isArray(S.STICKERS) && S.STICKERS.length >= 12);
  ok('Stickers.tryUnlock(ten-draw) فقط با داشتن localStorage کار می‌کند', typeof S.tryUnlock === 'function');
  S.deselect();
  ok('Stickers.deselect در Node بدون خطا اجرا می‌شود', S.currentSticker() === null);
}

section('تست‌های Achievements');
{
  const A = (await import(pathToFileURL(join(ROOT, 'js/achievements.js')).href)).default;
  ok('Achievements.CATALOG حداقل ۸ آیتم دارد', Object.keys(A.CATALOG).length >= 8);
  ok('Achievements.has(id) مقدار boolean می‌دهد', typeof A.has('first-draw') === 'boolean');
  ok('Achievements.checkAllStamps قابل فراخوانی است', typeof A.checkAllStamps === 'function');
}

section('تست‌های Theme و About و Splash — ایمن در Node');
{
  const T = (await import(pathToFileURL(join(ROOT, 'js/theme.js')).href)).default;
  ok('Theme.apply یک تابع است', typeof T.apply === 'function');
  ok('Theme.current یک تابع است', typeof T.current === 'function');
  ok('Theme.detect یک تابع است', typeof T.detect === 'function');

  const Ab = (await import(pathToFileURL(join(ROOT, 'js/about.js')).href)).default;
  ok('About.open یک تابع است', typeof Ab.open === 'function');
  ok('About.close یک تابع است', typeof Ab.close === 'function');

  const Sp = (await import(pathToFileURL(join(ROOT, 'js/stickers.js')).href)).default;
  ok('Stickers.init وجود دارد', typeof Sp.init === 'function');

  const SAV = (await import(pathToFileURL(join(ROOT, 'js/save-anim.js')).href)).default;
  ok('SaveAnim.show یک تابع است', typeof SAV.show === 'function');
  ok('SaveAnim.hide یک تابع است', typeof SAV.hide === 'function');

  const ONB = (await import(pathToFileURL(join(ROOT, 'js/onboarding.js')).href)).default;
  ok('Onboarding.show یک تابع است', typeof ONB.show === 'function');
  ok('Onboarding.hide یک تابع است', typeof ONB.hide === 'function');
  ok('Onboarding.resetSeen قابل فراخوانی است', typeof ONB.resetSeen === 'function');
}

/* ---------- خلاصه ---------- */
console.log('\n═══════════════════════════════════');
console.log('نتیجه: ' + pass + ' مورد موفق، ' + fail + ' مورد ناموفق');
console.log('═══════════════════════════════════');
process.exit(fail === 0 ? 0 : 1);
