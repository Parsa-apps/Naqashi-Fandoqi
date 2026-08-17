/* ============================================================
   tests/e2e.mjs — تست یکپارچه‌سازی مدیر (مرورگر شبیه‌سازی‌شده)
   اجرای کامل اپ در jsdom + رندر واقعی Canvas با @napi-rs/canvas
   اجرا:  node tests/e2e.mjs
   ============================================================ */
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { JSDOM } from 'jsdom';
import { createCanvas, ImageData as NapiImageData } from '@napi-rs/canvas';
import { PNG } from 'pngjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const JS_FILES = [
  'js/storage-core.js', 'js/utils.js', 'js/sound.js',
  'js/engine.js', 'js/album.js', 'js/tutorials.js', 'js/app.js'
];

let pass = 0;
let fail = 0;
function ok(name, cond, extra) {
  if (cond) { pass++; console.log('  ✔ ' + name); }
  else { fail++; console.log('  ✘ ' + name + (extra ? '  ← ' + extra : '')); }
}
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

console.log('■ راه‌اندازی برنامه در مرورگر شبیه‌سازی‌شده...');

const html = readFileSync(join(ROOT, 'index.html'), 'utf8');
const dom = new JSDOM(html, {
  url: 'https://fandoqi.test/',
  pretendToBeVisual: true,
  runScripts: 'outside-only'
});
const { window } = dom;
const document = window.document;

/* ---------- اتصال Canvas واقعی به DOM ---------- */
const backing = new WeakMap();
function getBacking(c) {
  if (!backing.has(c)) backing.set(c, createCanvas(c.width || 300, c.height || 150));
  return backing.get(c);
}
const canvasProto = window.HTMLCanvasElement.prototype;
canvasProto.getContext = function (type) {
  if (type !== '2d') return null;
  const nctx = getBacking(this).getContext('2d');
  return new Proxy(nctx, {
    get(t, p) {
      if (p === 'drawImage') {
        return function (...args) {
          const a0 = args[0];
          if (a0 && a0.nodeName === 'CANVAS') args[0] = getBacking(a0);
          else if (a0 && a0._napiCanvas) args[0] = a0._napiCanvas;
          return t.drawImage.apply(t, args);
        };
      }
      const v = t[p];
      return typeof v === 'function' ? v.bind(t) : v;
    },
    set(t, p, v) { t[p] = v; return true; }
  });
};
canvasProto.toDataURL = function (type) {
  const isJpeg = String(type || '').includes('jpeg');
  return 'data:image/' + (isJpeg ? 'jpeg' : 'png') + ';base64,' +
    getBacking(this).toBuffer(isJpeg ? 'image/jpeg' : 'image/png').toString('base64');
};
canvasProto.setPointerCapture = function () {};

/* ---------- پلی‌فیل PointerEvent و Image ---------- */
class Ptr extends window.MouseEvent {
  constructor(type, init = {}) {
    super(type, { bubbles: true, cancelable: true, view: window, ...init });
    this.pointerId = init.pointerId == null ? 1 : init.pointerId;
    this.isPrimary = init.isPrimary == null ? true : init.isPrimary;
  }
}
window.PointerEvent = Ptr;

window.Image = class {
  // دیکد PNG با pngjs (دیکد Image داخلی napi در این محیط خروجی شفاف می‌دهد)
  set src(v) {
    this._src = v;
    const buf = Buffer.from(String(v).split(',')[1] || '', 'base64');
    const png = PNG.sync.read(buf);
    this.naturalWidth = png.width;
    this.naturalHeight = png.height;
    const id = new NapiImageData(new Uint8ClampedArray(png.data), png.width, png.height);
    const tmp = createCanvas(png.width, png.height);
    tmp.getContext('2d').putImageData(id, 0, 0);
    this._napiCanvas = tmp;
    setTimeout(() => { if (this.onload) this.onload(); }, 0);
  }
  get src() { return this._src; }
};

/* ---------- بارگذاری ماژول‌ها ---------- */
for (const f of JS_FILES) {
  window.eval(readFileSync(join(ROOT, f), 'utf8'));
}
await new Promise((r) => window.addEventListener('load', r));
await sleep(30);

/* ---------- ابزارهای تست ---------- */
const $ = (s) => document.querySelector(s);
const $$ = (s) => Array.from(document.querySelectorAll(s));
const px = (x, y) => {
  const d = getBacking($('#board')).getContext('2d').getImageData(x, y, 1, 1).data;
  return [d[0], d[1], d[2], d[3]];
};
const pxEq = (x, y, rgb, tol = 30) => {
  const p = px(x, y);
  return Math.abs(p[0] - rgb[0]) <= tol && Math.abs(p[1] - rgb[1]) <= tol && Math.abs(p[2] - rgb[2]) <= tol;
};
const regionHasColor = (x0, y0, x1, y1, rgb, tol = 40) => {
  const c = getBacking($('#board'));
  const img = c.getContext('2d').getImageData(x0, y0, x1 - x0, y1 - y0).data;
  for (let i = 0; i < img.length; i += 4) {
    if (Math.abs(img[i] - rgb[0]) <= tol && Math.abs(img[i + 1] - rgb[1]) <= tol && Math.abs(img[i + 2] - rgb[2]) <= tol) return true;
  }
  return false;
};
// تشخیص پیکسل «آبی‌وار» حتی اگر نیمه‌شفاف روی زمینهٔ سفید باشد
const regionHasBluish = (x0, y0, x1, y1) => {
  const c = getBacking($('#board'));
  const img = c.getContext('2d').getImageData(x0, y0, x1 - x0, y1 - y0).data;
  for (let i = 0; i < img.length; i += 4) {
    if (img[i + 2] > img[i] + 40 && img[i + 2] > img[i + 1] + 40) return true;
  }
  return false;
};
// تشخیص پیکسل با اشباع رنگ بالا (برای براش رنگین‌کمان با رنگ‌های HSL)
const regionHasSaturation = (x0, y0, x1, y1, minSpan = 120) => {
  const c = getBacking($('#board'));
  const img = c.getContext('2d').getImageData(x0, y0, x1 - x0, y1 - y0).data;
  for (let i = 0; i < img.length; i += 4) {
    const mx = Math.max(img[i], img[i + 1], img[i + 2]);
    const mn = Math.min(img[i], img[i + 1], img[i + 2]);
    if (mx - mn >= minSpan) return true;
  }
  return false;
};
function stroke(x0, y0, x1, y1, steps = 12) {
  const c = $('#board');
  c.dispatchEvent(new Ptr('pointerdown', { clientX: x0, clientY: y0 }));
  for (let i = 1; i <= steps; i++) {
    c.dispatchEvent(new Ptr('pointermove', {
      clientX: x0 + ((x1 - x0) * i) / steps,
      clientY: y0 + ((y1 - y0) * i) / steps
    }));
  }
  c.dispatchEvent(new Ptr('pointerup', { clientX: x1, clientY: y1 }));
}

/* ============================================================
   اجرای سناریوها
   ============================================================ */

console.log('\n■ سناریو ۱: راه‌اندازی و حالت اولیه');
ok('Engine و Album و Tutorials بارگذاری شدند', !!(window.Engine && window.Album && window.Tutorials));
ok('بوم اولیه سفید است', pxEq(10, 10, [255, 255, 255], 2));
ok('تب نقاشی فعال است', $('#tab-draw').getAttribute('aria-selected') === 'true');
ok('نمای آلبوم و آموزش مخفی‌اند', $('#view-album').classList.contains('is-hidden') && $('#view-learn').classList.contains('is-hidden'));
ok('دکمه‌های برگردان/دوباره غیرفعال‌اند', $('#btn-undo').disabled && $('#btn-redo').disabled);

console.log('\n■ سناریو ۲: ناوبری تب‌ها');
$('#tab-album').click();
ok('تب آلبوم فعال شد', $('#view-album').classList.contains('is-hidden') === false && $('#tab-album').getAttribute('aria-selected') === 'true');
ok('حالت خالی آلبوم نمایش داده می‌شود', $('#album-empty').classList.contains('is-hidden') === false);
$('#tab-learn').click();
ok('تب آموزش فعال شد', $('#view-learn').classList.contains('is-hidden') === false);
ok('۸ کارت آموزش رندر شد', $$('.lesson-card').length === 8);
ok('۹ ترفند رندر شد', $$('.tip-card').length === 9);
$('#tab-draw').click();

console.log('\n■ سناریو ۳: ابزارها، رنگ و اندازه');
const rainbowBtn = $('[data-tool="rainbow"]');
rainbowBtn.click();
ok('ابزار رنگین‌کمان انتخاب شد', window.Engine.getTool() === 'rainbow' && rainbowBtn.classList.contains('is-active'));
const blueSwatch = $('[data-color="#1e88e5"]');
blueSwatch.click();
ok('رنگ آبی از پالت انتخاب شد', window.Engine.getColor() === '#1e88e5' && blueSwatch.classList.contains('is-active'));
const custom = $('#custom-color');
custom.value = '#00ff00';
custom.dispatchEvent(new window.Event('input', { bubbles: true }));
ok('رنگ دلخواه اعمال شد', window.Engine.getColor() === '#00ff00');
const slider = $('#size-slider');
slider.value = '40';
slider.dispatchEvent(new window.Event('input', { bubbles: true }));
ok('اندازه قلم ۴۰ شد و برچسب به‌روز شد', window.Engine.getSize() === 40 && $('#size-label').textContent.includes('۴۰'));

console.log('\n■ سناریو ۴: کشیدن با قلم‌مو و تاریخچه');
$('[data-tool="brush"]').click();
stroke(60, 300, 300, 300);
ok('خط سبز روی بوم کشیده شد', pxEq(180, 300, [0, 255, 0]));
ok('دکمه برگردان فعال شد', $('#btn-undo').disabled === false);
window.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'z', ctrlKey: true, bubbles: true }));
await sleep(30);
ok('Ctrl+Z نقاشی را برگرداند', pxEq(180, 300, [255, 255, 255], 2));
window.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'Z', ctrlKey: true, shiftKey: true, bubbles: true }));
await sleep(30);
ok('Ctrl+Shift+Z دوباره انجام داد', pxEq(180, 300, [0, 255, 0]));

console.log('\n■ سناریو ۵: پاک‌کن و اسپری و سطل رنگ');
$('[data-tool="eraser"]').click();
stroke(60, 300, 300, 300);
ok('پاک‌کن خط را پاک کرد', pxEq(180, 300, [255, 255, 255], 2));
$('[data-tool="spray"]').click();
window.Engine.setColor('#1e88e5');
window.Engine.setSize(2);
const c = $('#board');
c.dispatchEvent(new Ptr('pointerdown', { clientX: 400, clientY: 100 }));
for (let i = 1; i <= 8; i++) {
  c.dispatchEvent(new Ptr('pointermove', { clientX: 400 + i * 15, clientY: 100 }));
}
await sleep(120);
c.dispatchEvent(new Ptr('pointerup', { clientX: 520, clientY: 100 }));
ok('اسپری نقاط رنگی پاشید', regionHasBluish(360, 60, 540, 140));
// بررسی باگ خط توپُر: در مسیر حرکت نباید خط ممتد (پیکسل توپُر) باشد
let solidCount = 0;
for (let i = 1; i <= 8; i++) {
  const d = px(400 + i * 15, 100);
  if (Math.abs(d[0] - 30) <= 40 && Math.abs(d[1] - 136) <= 40 && Math.abs(d[2] - 229) <= 40 && d[3] === 255) solidCount++;
}
ok('اسپری خط ممتد نمی‌کشد (فقط نقطه می‌پاشد)', solidCount < 4, 'solid=' + solidCount);
$('[data-tool="fill"]').click();
window.Engine.setColor('#fdd835');
c.dispatchEvent(new Ptr('pointerdown', { clientX: 800, clientY: 500 }));
ok('سطل رنگ کل بوم سفید را زرد کرد', pxEq(10, 10, [253, 216, 53]) && pxEq(800, 500, [253, 216, 53]));
window.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'z', ctrlKey: true, bubbles: true }));
await sleep(30);
ok('برگردان بعد از سطل رنگ کار می‌کند', pxEq(10, 10, [255, 255, 255], 2));

console.log('\n■ سناریو ۶: براش‌های جادویی و مهرها');
$('[data-tool="rainbow"]').click();
window.Engine.setSize(12);
stroke(100, 400, 400, 400);
ok('رنگین‌کمان رنگ‌های متنوع کشید', regionHasSaturation(100, 380, 400, 420));
$('[data-tool="glow"]').click();
window.Engine.setColor('#8e24aa');
stroke(100, 480, 400, 480);
ok('نئون بنفش کشید', regionHasColor(100, 460, 400, 500, [142, 36, 170], 70));
$('[data-tool="stamp-heart"]').click();
window.Engine.setColor('#ff00ff');
window.Engine.setSize(20);
c.dispatchEvent(new Ptr('pointerdown', { clientX: 500, clientY: 200 }));
ok('مهر قلب کشیده شد', regionHasColor(460, 160, 540, 240, [255, 0, 255], 40));
$('[data-tool="stamp-smiley"]').click();
c.dispatchEvent(new Ptr('pointerdown', { clientX: 650, clientY: 200 }));
ok('مهر لبخند کشیده شد', regionHasColor(610, 160, 690, 240, [255, 0, 255], 40));

console.log('\n■ سناریو ۷: اشکال');
$('[data-tool="rect"]').click();
window.Engine.setColor('#212121');
stroke(500, 400, 700, 520);
ok('قاب مستطیل کشیده شد', pxEq(500, 460, [33, 33, 33], 60) || pxEq(700, 460, [33, 33, 33], 60));
ok('داخل مستطیل به‌آرامی پر شد', !pxEq(600, 460, [255, 255, 255], 30));
$('[data-tool="star"]').click();
stroke(760, 100, 860, 200);
ok('ستاره کشیده شد', regionHasColor(760, 100, 860, 200, [33, 33, 33], 60));

console.log('\n■ سناریو ۸: پاک‌کردن صفحه با تأیید');
$('#btn-clear').click();
ok('مودال تأیید باز شد', $('#confirm-modal').classList.contains('is-hidden') === false);
$('#confirm-yes').click();
await Promise.resolve(); // اجرای کال‌بک‌های promise (Engine.clear)
await Promise.resolve();
ok('بوم کاملاً سفید شد', pxEq(5, 5, [255, 255, 255], 2) && pxEq(400, 300, [255, 255, 255], 2));

console.log('\n■ سناریو ۹: ذخیره در آلبوم و نمایش');
window.Engine.setColor('#fb8c00');
window.Engine.setSize(12);
$('[data-tool="brush"]').click();
stroke(100, 200, 500, 200);
$('#btn-save').click();
ok('مودال ذخیره باز شد و نام پیش‌فرض دارد', $('#save-modal').classList.contains('is-hidden') === false && $('#save-name').value.length > 0);
$('#save-name').value = 'گربه نارنجی';
$('#save-confirm').click();
ok('رکورد در آلبوم ذخیره شد', window.Album.list().length === 1);
ok('کارت در شبکهٔ آلبوم رندر شد', $$('.album-card').length === 1);
ok('نام کارت با textContent امن رندر شد', $('.album-card h3').textContent === 'گربه نارنجی');
$('#tab-album').click();
ok('آلبوم با یک کارت نمایش داده می‌شود', $$('.album-card').length === 1 && $('#album-empty').classList.contains('is-hidden'));
const viewBtn = $('.album-card [data-act="view"]');
viewBtn.click();
ok('مودال نمایش باز شد', $('#view-modal').classList.contains('is-hidden') === false && $('#view-name').textContent === 'گربه نارنجی');
$('#view-close').click();
ok('مودال نمایش بسته شد', $('#view-modal').classList.contains('is-hidden'));

console.log('\n■ سناریو ۱۰: ادامهٔ نقاشی از آلبوم');
const editBtn = $('.album-card [data-act="edit"]');
editBtn.click();
await sleep(30);
ok('به تب نقاشی برگشت', $('#tab-draw').getAttribute('aria-selected') === 'true');
ok('نقاشی ذخیره‌شده روی بوم بارگذاری شد', pxEq(300, 200, [251, 140, 0], 60));

console.log('\n■ سناریو ۱۱: حذف از آلبوم');
$('#tab-album').click();
$('.album-card [data-act="delete"]').click();
ok('مودال تأیید حذف باز شد', $('#confirm-modal').classList.contains('is-hidden') === false);
$('#confirm-yes').click();
await Promise.resolve(); // اجرای کال‌بک حذف
await Promise.resolve();
ok('آلبوم خالی شد و حالت خالی برگشت', window.Album.list().length === 0 && $('#album-empty').classList.contains('is-hidden') === false);

console.log('\n■ سناریو ۱۲: آموزش گام‌به‌گام');
$('#tab-learn').click();
$$('.lesson-card')[0].click();
ok('جزئیات درس باز شد', $('#learn-detail').classList.contains('is-hidden') === false);
ok('نمایشگر قدم شروع شد', $('#step-indicator').textContent.includes('قدم'));
ok('SVG قدم رندر شد', $('#step-svg').querySelector('svg') !== null);
const totalSteps = window.Tutorials.TUTORIALS[0].steps.length;
const firstTut = window.Tutorials.TUTORIALS[0];
$('#step-done').click(); // علامت‌زدن قدم ۱
$('#step-next').click();
ok('قدم دوم نمایش داده شد', $('#step-indicator').textContent.includes('۲'));
$('#step-done').click();
const prog = window.StorageCore.loadProgress();
ok('پیشرفت در حافظه ذخیره شد', Array.isArray(prog[firstTut.id]) && prog[firstTut.id].includes(1));
for (let i = 2; i < totalSteps; i++) { $('#step-next').click(); $('#step-done').click(); }
ok('پیام تکمیل درس نمایش داده شد', $('#lesson-done').classList.contains('is-hidden') === false);
$('#lesson-back').click();
ok('بازگشت به فهرست درس‌ها', $('#learn-home').classList.contains('is-hidden') === false);
ok('کارت درس تکمیل‌شده علامت خورد', $$('.lesson-card')[0].classList.contains('is-done'));

console.log('\n■ سناریو ۱۳: پیش‌نویس خودکار و کلید Escape');
$('#tab-draw').click();
stroke(300, 500, 600, 500);
window.Engine.saveDraftNow();
ok('پیش‌نویس در حافظه ذخیره شد', window.StorageCore.loadDraft() !== null);
$('#btn-clear').click();
window.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
ok('کلید Escape مودال تأیید را بست', $('#confirm-modal').classList.contains('is-hidden'));

console.log('\n■ سناریو ۱۴: دکمه صدا');
const soundBtn = $('#sound-toggle');
soundBtn.click();
ok('صدا قطع شد و وضعیت ذخیره گردید', window.Sound.isEnabled() === false && window.StorageCore.loadFlag(window.StorageCore.KEYS.sound, true) === false);
ok('برچسب دکمه صدا به‌روز شد', soundBtn.textContent === '🔇');
soundBtn.click();

console.log('\n■ سناریو ۱۵: میان‌بر اندازه با [ و ]');
slider.value = '20';
slider.dispatchEvent(new window.Event('input', { bubbles: true }));
window.dispatchEvent(new window.KeyboardEvent('keydown', { key: ']', bubbles: true }));
ok('کلید ] اندازه را زیاد کرد', window.Engine.getSize() === 24);
window.dispatchEvent(new window.KeyboardEvent('keydown', { key: '[', bubbles: true }));
window.dispatchEvent(new window.KeyboardEvent('keydown', { key: '[', bubbles: true }));
ok('کلید [ اندازه را کم کرد', window.Engine.getSize() === 16);

/* ---------- خلاصه ---------- */
console.log('\n═══════════════════════════════════');
console.log('نتیجهٔ تست یکپارچه: ' + pass + ' موفق، ' + fail + ' ناموفق');
console.log('═══════════════════════════════════');
process.exit(fail === 0 ? 0 : 1);
