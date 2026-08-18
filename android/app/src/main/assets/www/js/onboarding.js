/* ============================================================
   onboarding.js — تور خوش‌آمدگویی برای کاربر اولین‌بار
   - ۴ کارت: نقاشی / استیکر / آلبوم / آموزش
   - فقط یک‌بار در ابتدا نشان داده می‌شود
   - هر کاربر می‌تواند با دکمهٔ «دیدن دوباره» آن را ببیند
   ============================================================ */
(function (g) {
  'use strict';

  const HAS_DOC = typeof document !== 'undefined';
  const STORAGE_KEY = 'fandoqi.onboarded';

  const CARDS = [
    {
      emoji: '\uD83C\uDFA8',
      title: '\u0628\u0647 \u0641\u0646\u062F\u0648\u0642\u06CC \u062E\u0648\u0634 \u0622\u0645\u062F\u06CC!',
      text: '\u06CC\u06A9 \u0627\u0633\u062A\u0648\u062F\u06CC\u0648\u06CC \u0646\u0642\u0627\u0634\u06CC \u0628\u0631\u0627\u06CC \u062A\u0648. \u0628\u0627 \u0627\u0628\u0632\u0627\u0631\u0647\u0627\u06CC \u062D\u0631\u0641\u0647\u200C\u0627\u06CC \u0648 \u062C\u0627\u062F\u0648\u06AF\u0631\u0647\u0627\u06CC \u062C\u0627\u06AF\u0631 \u0627\u06CC\u0646\u200C\u062C\u0627 \u0647\u0645\u0647 \u0686\u06CC\u0632 \u0631\u0648 \u0628\u0647 \u062A\u0648 \u062F\u0627\u0631\u0646.',
      accent: '#ff8fab'
    },
    {
      emoji: '\uD83C\uDFA8',
      title: '\u06A9\u0634\u06CC\u062F\u0646 \u0631\u0648\u06CC \u0628\u0648\u0645!',
      text: '\u0627\u0632 \u0642\u0644\u0645\u200C\u0645\u0648\u060C \u0645\u062F\u0627\u062F\u060C \u0627\u0633\u0648\u0627\u0631\u06CC \u0648 \u062D\u062A\u06CC \u0628\u0631\u0627\u06CC \u0628\u0631\u0627\u06CC \u06A9\u0634\u06CC\u062F\u0646 \u0627\u0633\u062A\u0641\u0627\u062F\u0647 \u06A9\u0646. \u0628\u0631\u0627\u06CC \u0633\u0648\u0627\u0644\u200C\u062A\u0631 \u06A9\u0644\u06CC\u06A9 \u06A9\u0646\u060C \u0627\u0628\u0632\u0627\u0631 \u0639\u0648\u0636 \u0645\u06CC\u200C\u0634\u0647!',
      accent: '#7b5cff'
    },
    {
      emoji: '\uD83C\uDFAF',
      title: '\u0627\u0633\u062A\u06CC\u06A9\u0631\u0647\u0627 \u067E\u0627\u06CC \u062A\u0648 \u0627\u0645\u062A!',
      text: '\u0631\u0648\u06CC \u062F\u06A9\u0645\u0647\u0654 \u0627\u0633\u062A\u0648\u06CC\u0648 \u0628\u0628\u0648\u064644 \u0633\u062A\u0627\u0631\u0647 \u0647\u0633\u062A. \u06A9\u0644\u06CC\u06A9 \u06A9\u0646 \u062A\u0627 \u0633\u062A\u0627\u0631\u0647 \u0631\u0648\u06CC \u0628\u0648\u0645 \u0628\u06CC\u0627\u062F!',
      accent: '#ffd54f'
    },
    {
      emoji: '\uD83D\uDCBE',
      title: '\u0630\u062E\u06CC\u0631\u0647 \u06A9\u0646 \u062F\u0631 \u0622\u0644\u0628\u0648\u0645',
      text: '\u0647\u0631 \u0634\u0627\u0647\u06A9\u0627\u0631 \u0631\u0627 \u062F\u0631 \u0622\u0644\u0628\u0648\u0645 \u0630\u062E\u06CC\u0631\u0647 \u06A9\u0646 \u062A\u0627 \u0647\u0645\u06CC\u0634\u0647 \u0628\u062A\u0648\u0627\u0646\u06CC \u0628\u0631\u06AF\u0631\u062F\u06CC \u0648 \u0627\u062F\u0627\u0645\u0647 \u0628\u062F\u0647\u06CC! \u062A\u0645\u0627\u0645 \u0646\u0642\u0627\u0634\u06CC\u200C\u0647\u0627 \u062F\u0631 \u062F\u0633\u062A\u06AF\u0627\u0647 \u062E\u0648\u062F\u062A \u0630\u062E\u06CC\u0631\u0647 \u0645\u06CC\u200C\u0634\u0648\u0646\u062F.',
      accent: '#43a047'
    }
  ];

  const globals = {
    el: null,
    dotsEl: null,
    cardWrapEl: null,
    nextBtn: null,
    skipBtn: null,
    backBtn: null,
    onDone: null,
    index: 0,
    shown: false
  };

  function renderCard() {
    if (!globals.cardWrapEl) return;
    const c = CARDS[globals.index];
    globals.cardWrapEl.innerHTML = '';
    const card = document.createElement('div');
    card.className = 'onb-card';
    card.style.setProperty('--onb-accent', c.accent);
    const e = document.createElement('div');
    e.className = 'onb-emoji';
    e.textContent = c.emoji;
    const t = document.createElement('h3');
    t.className = 'onb-title';
    t.textContent = c.title;
    const x = document.createElement('p');
    x.className = 'onb-text';
    x.textContent = c.text;
    card.appendChild(e);
    card.appendChild(t);
    card.appendChild(x);
    globals.cardWrapEl.appendChild(card);
    // restart animation
    void card.offsetWidth;
    card.classList.add('is-in');

    // dots
    if (globals.dotsEl) {
      globals.dotsEl.innerHTML = '';
      CARDS.forEach(function (_, i) {
        const d = document.createElement('span');
        d.className = 'onb-dot' + (i === globals.index ? ' is-active' : '');
        globals.dotsEl.appendChild(d);
      });
    }

    if (globals.backBtn) globals.backBtn.disabled = globals.index === 0;
    if (globals.nextBtn) {
      globals.nextBtn.textContent = globals.index === CARDS.length - 1 ? '\u0628\u06CC\u0627 \u0628\u0631\u0648 \u0628\u0647 \u0641\u0646\u062F\u0648\u0642\u06CC \uD83D\uDE80' : '\u0628\u0639\u062F\u06CC \u25B6';
      globals.nextBtn.classList.toggle('primary', globals.index === CARDS.length - 1);
    }
  }

  function next() {
    if (globals.index >= CARDS.length - 1) { finish(); return; }
    globals.index++;
    renderCard();
  }

  function back() {
    if (globals.index === 0) return;
    globals.index--;
    renderCard();
  }

  function skip() {
    finish();
  }

  function finish() {
    if (!globals.el) return;
    globals.el.classList.remove('is-show');
    globals.shown = false;
    try { g.localStorage.setItem(STORAGE_KEY, '1'); } catch (_) {}
    if (typeof globals.onDone === 'function') globals.onDone();
  }

  function show(opts) {
    if (!HAS_DOC) return Promise.resolve(false);
    if (!globals.el) init();
    if (!globals.el) return Promise.resolve(false);
    const o = opts || {};
    globals.onDone = o.onDone;
    globals.index = 0;
    renderCard();
    globals.el.classList.add('is-show');
    globals.shown = true;
  }

  function hide() {
    if (!globals.el) return;
    globals.el.classList.remove('is-show');
    globals.shown = false;
  }

  function isShown() { return globals.shown; }

  function isSeen() {
    try { return !!g.localStorage.getItem(STORAGE_KEY); } catch (_) { return true; }
  }

  function resetSeen() {
    try { g.localStorage.removeItem(STORAGE_KEY); } catch (_) {}
  }

  function init() {
    if (!HAS_DOC) return;
    globals.el = document.getElementById('onboarding');
    if (!globals.el) return;
    globals.dotsEl = globals.el.querySelector('.onb-dots');
    globals.cardWrapEl = globals.el.querySelector('.onb-card-wrap');
    globals.nextBtn = globals.el.querySelector('.onb-next');
    globals.skipBtn = globals.el.querySelector('.onb-skip');
    globals.backBtn = globals.el.querySelector('.onb-back');
    if (globals.nextBtn) globals.nextBtn.addEventListener('click', next);
    if (globals.skipBtn) globals.skipBtn.addEventListener('click', skip);
    if (globals.backBtn) globals.backBtn.addEventListener('click', back);
    // کلیک روی backdrop → skip
    globals.el.addEventListener('mousedown', function (e) {
      if (e.target === globals.el && globals.skipBtn) skip();
    });
  }

  function ensureInit() {
    if (!globals.el) init();
  }

  if (HAS_DOC && document.readyState !== 'loading') init();
  else if (HAS_DOC) document.addEventListener('DOMContentLoaded', init, { once: true });

  const api = {
    show: show, hide: hide, isShown: isShown,
    isSeen: isSeen, resetSeen: resetSeen,
    skip: skip, ensureInit: ensureInit
  };

  g.Onboarding = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis);
