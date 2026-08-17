/* ============================================================
   splash.js — مدير اسپلش اسكرين فندوقي
   - شروع خودکار بلافاصله پس از لود اسکريپت
   - رعايت حداقل ۱.۳s براي حس حرفه‌اي
   - fade out چندمرحله‌اي: bye → gone → remove
   - حذف تميز از DOM پس از پايان
   ============================================================ */
(function (g) {
  'use strict';

  const MIN_TIME = 1300;
  const FADE_DURATION = 700;
  const REMOVE_DELAY = 200;

  let boot = null;
  let progressInterval = null;
  let doneCalled = false;

  function start() {
    if (boot !== null) return;
    if (typeof document === 'undefined') return;
    boot = Date.now();
    const el = g.document.getElementById('splash');
    if (!el) return;
    animateProgress(el);
  }

  function animateProgress(el) {
    const bar = el.querySelector('.splash-progress-bar');
    const txt = el.querySelector('.splash-loading-text');
    if (!bar) return;

    const msgs = [
      '\u062F\u0631 \u062D\u0627\u0644 \u0622\u0645\u0627\u062F\u0647\u200C\u0633\u0627\u0632\u06CC \u0631\u0646\u06AF\u200C\u0647\u0627...',
      '\u067E\u0631 \u06A9\u0631\u062F\u0646 \u0642\u0644\u0645\u200C\u0645\u0648\u0647\u0627...',
      '\u06AF\u0631\u0645 \u06A9\u0631\u062F\u0646 \u062A\u062E\u062A\u0647\u0654 \u0646\u0642\u0627\u0634\u06CC...',
      '\u0631\u0648\u0634\u0646 \u06A9\u0631\u062F\u0646 \u0686\u0631\u0627\u063A\u200C\u0647\u0627...'
    ];
    let i = 0;
    let pct = 8;
    progressInterval = setInterval(function () {
      pct = Math.min(94, pct + 6 + Math.random() * 8);
      bar.style.width = pct + '%';
      if (txt) txt.textContent = msgs[(i++) % msgs.length];
      if (pct >= 94) stopProgress();
    }, 220);
  }

  function stopProgress() {
    if (progressInterval) {
      clearInterval(progressInterval);
      progressInterval = null;
    }
  }

  function done() {
    if (doneCalled) return;
    if (typeof document === 'undefined') return;
    doneCalled = true;
    const el = g.document.getElementById('splash');
    if (!el || el.classList.contains('is-gone')) return;

    stopProgress();

    const bar = el.querySelector('.splash-progress-bar');
    const txt = el.querySelector('.splash-loading-text');
    if (bar) bar.style.width = '100%';
    if (txt) txt.textContent = '\u0622\u0645\u0627\u062F\u0647\u200C\u0627\u06CC! \uD83C\uDF30';

    const elapsed = boot ? (Date.now() - boot) : MIN_TIME;
    const wait = Math.max(0, MIN_TIME - elapsed);

    setTimeout(function () {
      el.classList.add('is-bye');
      setTimeout(function () {
        el.classList.add('is-gone');
        // رویداد سفارشی برای هماهنگی با Hero Animation در اپ
        try {
          g.dispatchEvent(new CustomEvent('fandoqi:splash-done'));
        } catch (_) {}
        setTimeout(function () {
          if (el.parentNode) el.parentNode.removeChild(el);
        }, FADE_DURATION);
      }, REMOVE_DELAY);
    }, wait);
  }

  function autoWire() {
    if (typeof document === 'undefined') return;
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', start, { once: true });
    } else {
      start();
    }
    if (document.readyState === 'complete') {
      done();
    } else if (g.addEventListener) {
      g.addEventListener('load', done, { once: true });
    }
  }

  const api = { start: start, done: done, stop: stopProgress };

  g.Splash = api;
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  }
  autoWire();
})(typeof window !== 'undefined' ? window : globalThis);
