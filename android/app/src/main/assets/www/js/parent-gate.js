/* ============================================================
   parent-gate.js — دروازه والدین (Parental Gate)
   - سوال ریاضی تصادفی ساده — برای بزرگ‌ترها نه کودک
   - ۲ فرصت اشتباه + cooldown ۳۰ ثانیه
   - پس از موفقیت state ریست می‌شود
   - MasterPrompt §۱۳: سوال ریاضی تصادفی (نه PIN ثابت)
   ============================================================ */
(function (g) {
  'use strict';

  const COOLDOWN_MS = 30 * 1000;
  const WAIT_BEFORE_FOCUS_MS = 250;
  const POOL = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  const FA_TO_EN = { '۰': 0, '۱': 1, '۲': 2, '۳': 3, '۴': 4, '۵': 5, '۶': 6, '۷': 7, '۸': 8, '۹': 9 };

  let lastFailAt = 0;
  let pendingResolve = null;
  let pendingFailCount = 0;
  const MAX_FAIL_PER_OPEN = 2;

  function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function randQuestion() {
    const a = POOL[randInt(0, POOL.length - 1)];
    const b = POOL[randInt(0, POOL.length - 1)];
    const op = Math.random() < 0.5 ? '+' : '-';
    let ans, x, y;
    if (op === '+') {
      x = a; y = b; ans = a + b;
    } else {
      x = Math.max(a, b); y = Math.min(a, b); ans = x - y;
    }
    return { text: x + ' ' + op + ' ' + y + ' = ?', answer: ans };
  }

  function parseAnswerFromText(text) {
    if (!text) return null;
    const norm = text.replace(/[\u06F0-\u06F9]/g, function (ch) { return FA_TO_EN[ch]; });
    const m = norm.match(/(-?\d+)\s*([+\-\u00D7\u00F7])\s*(-?\d+)/);
    if (!m) return null;
    const a = parseInt(m[1], 10);
    const b = parseInt(m[3], 10);
    switch (m[2]) {
      case '+': return a + b;
      case '-': return a - b;
      case '\u00D7': return a * b;
      case '\u00F7': return Math.floor(a / b);
    }
    return null;
  }

  function setPromise(resolve) {
    if (pendingResolve) {
      try { pendingResolve(false); } catch (_) {}
    }
    pendingResolve = resolve;
  }

  function open() {
    if (typeof document === 'undefined') return Promise.resolve(false);
    const modal = document.getElementById('parent-gate-modal');
    const qEl = document.getElementById('pg-question');
    const inp = document.getElementById('pg-input');
    const err = document.getElementById('pg-error');
    const tip = document.getElementById('pg-hint');
    const locked = document.getElementById('pg-locked');
    if (!modal) return Promise.resolve(false);

    pendingFailCount = 0;

    if (Date.now() - lastFailAt < COOLDOWN_MS) {
      if (locked) locked.classList.remove('is-hidden');
      if (inp) { inp.disabled = true; inp.value = ''; }
      const q = randQuestion();
      if (qEl) qEl.textContent = q.text;
      if (tip) tip.textContent = '\u23F3 \u0644\u0637\u0641\u0627\u064B \u06A9\u0645\u06CC \u0635\u0628\u0631 \u06A9\u0646...';
      modal.classList.remove('is-hidden');
      return new Promise(function (resolve) { setPromise(resolve); });
    }

    if (locked) locked.classList.add('is-hidden');
    if (inp) { inp.disabled = false; inp.value = ''; }

    const q = randQuestion();
    if (qEl) qEl.textContent = q.text;
    if (err) { err.textContent = ''; err.classList.remove('is-show'); }
    if (tip) tip.textContent = '\u0627\u06CC\u0646 \u0633\u0648\u0627\u0644 \u0631\u0648 \u06CC\u06A9 \u0628\u0632\u0631\u06AF\u200C\u062A\u0631 \u06A9\u0645\u06A9\u062A \u0645\u06CC\u200C\u06A9\u0646\u0647 \uD83C\uDF1F';
    modal.classList.remove('is-hidden');

    return new Promise(function (resolve) {
      setPromise(resolve);
      setTimeout(function () {
        if (inp) { try { inp.focus({ preventScroll: true }); } catch (_) { inp.focus(); } }
      }, WAIT_BEFORE_FOCUS_MS);
    });
  }

  function close(passed) {
    if (typeof document !== 'undefined') {
      const modal = document.getElementById('parent-gate-modal');
      if (modal) modal.classList.add('is-hidden');
      const locked = document.getElementById('pg-locked');
      if (locked) locked.classList.add('is-hidden');
      const inp = document.getElementById('pg-input');
      if (inp) inp.disabled = false;
    }
    const resolver = pendingResolve;
    pendingResolve = null;
    pendingFailCount = 0;
    if (passed) lastFailAt = 0;
    if (resolver) {
      try { resolver(!!passed); } catch (_) {}
    }
  }

  function fail(reason) {
    if (typeof document === 'undefined') return;
    const err = document.getElementById('pg-error');
    const inp = document.getElementById('pg-input');
    const qEl = document.getElementById('pg-question');

    if (reason === 'cooldown') {
      lastFailAt = Date.now();
      if (err) {
        err.textContent = '\u23F3 \u0686\u0646\u062F \u0628\u0627\u0631 \u0627\u0634\u062A\u0628\u0627\u0647 \u0634\u062F. \u066B\u0663\u0660 \u062B\u0627\u0646\u06CC\u0647 \u0635\u0628\u0631 \u06A9\u0646 \u062F\u0648\u0628\u0627\u0631\u0647 \u0627\u0645\u062A\u062D\u0627\u0646 \u06A9\u0646.';
        err.classList.add('is-show');
      }
      return;
    }

    pendingFailCount++;
    if (pendingFailCount >= MAX_FAIL_PER_OPEN) {
      lastFailAt = Date.now();
      const locked = document.getElementById('pg-locked');
      if (locked) locked.classList.remove('is-hidden');
      if (inp) inp.disabled = true;
      if (err) {
        err.textContent = '\u23F3 \u0628\u0631\u0627\u06CC \u0627\u0645\u0646\u06CC\u062A\u060C \u066B\u0663\u0660 \u062B\u0627\u0646\u06CC\u0647 \u0635\u0628\u0631 \u06A9\u0646 \u0648 \u062F\u0648\u0628\u0627\u0631\u0647 \u0627\u0645\u062A\u062D\u0627\u0646 \u06A9\u0646.';
        err.classList.add('is-show');
      }
      const q = randQuestion();
      if (qEl) qEl.textContent = q.text;
      return;
    }

    if (err) {
      err.textContent = '\u274C \u062C\u0648\u0627\u0628 \u062F\u0631\u0633\u062A \u0646\u0628\u0648\u062F. \u062F\u0648\u0628\u0627\u0631\u0647 \u0627\u0645\u062A\u062D\u0627\u0646 \u06A9\u0646.' + (pendingFailCount > 1 ? ' (\u06CC\u06A9 \u0641\u0631\u0635\u062A \u062F\u06CC\u06AF\u0631 \u062F\u0627\u0631\u06CC)' : '');
      err.classList.add('is-show');
    }
    const q = randQuestion();
    if (qEl) qEl.textContent = q.text;
    if (inp) { inp.value = ''; try { inp.focus({ preventScroll: true }); } catch (_) { inp.focus(); } }
  }

  function init() {
    const confirm = document.getElementById('pg-confirm');
    const cancel  = document.getElementById('pg-cancel');
    const inp     = document.getElementById('pg-input');
    if (!confirm) return;

    confirm.addEventListener('click', function () {
      if (Date.now() - lastFailAt < COOLDOWN_MS) {
        fail('cooldown');
        return;
      }
      const qEl = document.getElementById('pg-question');
      const ans = qEl ? parseAnswerFromText(qEl.textContent) : null;
      const val = parseInt(((inp && inp.value) || '').trim(), 10);
      if (ans !== null && val === ans) { close(true); } else { fail(); }
    });

    cancel.addEventListener('click', function () { close(false); });

    if (inp) {
      inp.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') { e.preventDefault(); confirm.click(); }
        if (e.key === 'Escape') { e.preventDefault(); cancel.click(); }
      });
      inp.addEventListener('focus', function () { inp.select(); });
    }

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && pendingResolve) {
        e.preventDefault();
        cancel.click();
      }
    }, { capture: true });
  }

  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init, { once: true });
    } else {
      init();
    }
  }

  const api = { open: open, close: close };

  g.ParentGate = api;
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  }
})(typeof window !== 'undefined' ? window : globalThis);
