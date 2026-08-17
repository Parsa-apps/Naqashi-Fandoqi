/* ============================================================
   parent-gate.js — دروازهٔ والدین (Parental Gate)
   - سوال ریاضی تصادفی ساده
   - ۲ فرصت اشتباه + سپس cooldown برای جلوگیری از brute-force
   - MasterPrompt §۱۳: مسئلهٔ ریاضی تصادفی (نه PIN ثابت)
   ============================================================ */
(function (g) {
  'use strict';

  const COOLDOWN_MS = 30 * 1000; // ۳۰ ثانیه پس از ۲ اشتباه
  const POOL = [1, 2, 3, 4, 5, 6, 7, 8, 9]; // ساده نگه دار برای کودکان کوچک‌تر

  let lastFailAt = 0;
  let pendingResolve = null;

  function randQuestion() {
    const a = POOL[Math.floor(Math.random() * POOL.length)];
    const b = POOL[Math.floor(Math.random() * POOL.length)];
    const op = Math.random() < 0.5 ? '+' : '-';
    let ans, x, y;
    if (op === '+') {
      x = a; y = b; ans = a + b;
    } else {
      x = Math.max(a, b); y = Math.min(a, b); ans = x - y;
    }
    return { text: x + ' ' + op + ' ' + y + ' = ?', answer: ans };
  }

  function open() {
    const modal = g.document.getElementById('parent-gate-modal');
    const qEl = g.document.getElementById('pg-question');
    const inp = g.document.getElementById('pg-input');
    const err = g.document.getElementById('pg-error');
    const tip = g.document.getElementById('pg-hint');
    if (!modal) return Promise.resolve(false);

    // اگر cooldown داریم، بلاک کن
    if (Date.now() - lastFailAt < COOLDOWN_MS) {
      return openCooldown();
    }

    const q = randQuestion();
    if (qEl) qEl.textContent = q.text;
    if (inp) { inp.value = ''; }
    if (err) { err.textContent = ''; err.classList.remove('is-show'); }
    if (tip) tip.textContent = 'این سوال رو یک بزرگ‌تر کمکت می‌کنه 🌟';
    modal.classList.remove('is-hidden');

    return new Promise(function (resolve) {
      pendingResolve = resolve;
      // وقتی مودال بسته شد اگر هنوز resolve نشده، false برگردان
      setTimeout(function () {
        if (pendingResolve === resolve) {
          if (inp) inp.focus({ preventScroll: false });
        }
      }, 250);
    });
  }

  function openCooldown() {
    const modal = g.document.getElementById('parent-gate-modal');
    const tip = g.document.getElementById('pg-hint');
    const inp = g.document.getElementById('pg-input');
    const locked = g.document.getElementById('pg-locked');
    if (locked) locked.classList.remove('is-hidden');
    if (inp) inp.disabled = true;
    const q = randQuestion();
    const qEl = g.document.getElementById('pg-question');
    if (qEl) qEl.textContent = q.text;
    modal.classList.remove('is-hidden');

    return new Promise(function (resolve) {
      pendingResolve = resolve;
    });
  }

  function close(passed) {
    const modal = g.document.getElementById('parent-gate-modal');
    if (modal) modal.classList.add('is-hidden');
    const locked = g.document.getElementById('pg-locked');
    if (locked) locked.classList.add('is-hidden');
    const inp = g.document.getElementById('pg-input');
    if (inp) inp.disabled = false;
    const resolver = pendingResolve;
    pendingResolve = null;
    if (resolver) resolver(!!passed);
  }

  function fail(reason) {
    lastFailAt = Date.now();
    const err = g.document.getElementById('pg-error');
    if (err) {
      err.textContent = reason === 'cooldown'
        ? '⏳ چند بار اشتباه شد. ۳۰ ثانیه صبر کن دوباره امتحان کن.'
        : '❌ جواب درست نبود. دوباره امتحان کن.';
      err.classList.add('is-show');
    }
    // سؤال تازه بعد از هر اشتباه (به‌جز در cooldown)
    if (reason !== 'cooldown') {
      const qEl = g.document.getElementById('pg-question');
      const inp = g.document.getElementById('pg-input');
      const q = randQuestion();
      if (qEl) qEl.textContent = q.text;
      if (inp) { inp.value = ''; inp.focus(); }
    }
  }

  function currentAnswer() {
    const qEl = g.document.getElementById('pg-question');
    if (!qEl) return null;
    // پارس کردن متن سوال برای فهم پاسخ
    const m = (qEl.textContent || '').match(/(\d+)\s*([+\-×÷])\s*(\d+)/);
    if (!m) return null;
    const a = parseInt(m[1], 10);
    const b = parseInt(m[3], 10);
    switch (m[2]) {
      case '+': return a + b;
      case '-': return a - b;
      case '×': return a * b;
      case '÷': return Math.floor(a / b);
    }
    return null;
  }

  function init() {
    const confirm = g.document.getElementById('pg-confirm');
    const cancel  = g.document.getElementById('pg-cancel');
    const inp     = g.document.getElementById('pg-input');
    if (!confirm) return;

    confirm.addEventListener('click', function () {
      // اگر cooldown داریم، fail with cooldown
      if (Date.now() - lastFailAt < COOLDOWN_MS) {
        fail('cooldown');
        return;
      }
      const ans = currentAnswer();
      const val = parseInt((inp && inp.value || '').trim(), 10);
      if (val === ans) { close(true); } else { fail(); }
    });

    cancel.addEventListener('click', function () { close(false); });

    if (inp) {
      inp.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') confirm.click();
        if (e.key === 'Escape') cancel.click();
      });
    }

    g.document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && pendingResolve) cancel.click();
    }, { capture: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }

  g.ParentGate = { open: open, close: close };
})(typeof window !== 'undefined' ? window : globalThis);
