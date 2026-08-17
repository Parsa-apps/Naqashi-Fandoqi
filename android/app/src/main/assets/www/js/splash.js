/* ============================================================
   splash.js — مدیر اسپلش اسکرین فندوقی
   ============================================================ */
(function (g) {
  'use strict';

  const MIN_TIME = 1300;   // حداقل زمان نمایش برای حس «حرفه‌ای»
  const FADE_DELAY = 250;  // تاخیر کوتاه برای نشستن انیمیشن آخر

  let boot = null;

  function start() {
    boot = Date.now();
    const el = g.document.getElementById('splash');
    if (!el) return false;
    animateProgress(el);
    return true;
  }

  function animateProgress(el) {
    const bar = el.querySelector('.splash-progress-bar');
    const txt = el.querySelector('.splash-loading-text');
    if (!bar) return;

    // پیام‌های شاد فارسی برای کودک
    const msgs = ['در حال آماده‌سازی رنگ‌ها...', 'پر کردن قلم‌موها...', 'گرم کردن تختهٔ نقاشی...', 'روشن کردن چراغ‌ها...'];
    let i = 0;
    let pct = 8;
    const tick = setInterval(function () {
      pct = Math.min(94, pct + 6 + Math.random() * 8);
      bar.style.width = pct + '%';
      if (txt) txt.textContent = msgs[(i++) % msgs.length];
      if (pct >= 94) clearInterval(tick);
    }, 220);
    el._splashTick = tick;
  }

  function done() {
    const el = g.document.getElementById('splash');
    if (!el || el.classList.contains('is-gone')) return;

    // پاک کردن تایمر پیشرفت
    if (el._splashTick) clearInterval(el._splashTick);

    // پر کردن نوار نهایی
    const bar = el.querySelector('.splash-progress-bar');
    const txt = el.querySelector('.splash-loading-text');
    if (bar) bar.style.width = '100%';
    if (txt) txt.textContent = 'آماده‌ای! 🌰';

    // رعایت حداقل زمان
    const elapsed = boot ? (Date.now() - boot) : 0;
    const wait = Math.max(0, MIN_TIME - elapsed) + FADE_DELAY;

    setTimeout(function () {
      el.classList.add('is-bye');
      setTimeout(function () {
        el.classList.add('is-gone');
        // حس «premium» — کم‌کم ناپدید شود
        setTimeout(function () {
          if (el && el.parentNode) el.parentNode.removeChild(el);
        }, 800);
      }, 350);
    }, wait);
  }

  // اگر صفحه از قبل آماده نبود، منتظر می‌مانیم تا همه چیز لود شود
  function autoWire() {
    // شروع فوری (حتی قبل از window.onload) تا حس pre-loader القا شود
    if (document.readyState === 'loading') {
      // DOM هنوز کامل نیست؛ بعد از DOMContentLoaded شروع کن
      document.addEventListener('DOMContentLoaded', start, { once: true });
    } else {
      start();
    }

    // پایان هنگام لود کامل پنجره
    if (document.readyState === 'complete') {
      done();
    } else {
      g.addEventListener('load', done, { once: true });
    }
  }

  g.Splash = { start: start, done: done };
  autoWire();
})(typeof window !== 'undefined' ? window : globalThis);
