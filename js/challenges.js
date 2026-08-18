/* ============================================================
   challenges.js — چالش‌های روزانه فندوقی
   - هر روز یک موضوع تازه برای کودک
   - streak tracking (روزهای متوالی)
   - وقتی کودک یک نقاشی ذخیره کرد، streak افزایش می‌یابد
   ============================================================ */
(function (g) {
  'use strict';

  const HAS_DOC = typeof document !== 'undefined';

  // چرخهٔ ۷ روزهٔ چالش‌ها — هر روز یک موضوع
  const POOL = [
    { id: 'animal',  emoji: '\uD83D\uDC3B', title: '\u06CC\u06A9 \u062D\u06CC\u0648\u0627\u0646', desc: '\u062D\u06CC\u0648\u0627\u0646 \u0645\u0648\u0631\u062F \u0639\u0644\u0627\u0642\u0647\u200C\u062A \u0631\u0627 \u0628\u06A9\u0634' },
    { id: 'flower',  emoji: '\uD83C\uDF38', title: '\u06CC\u06A9 \u06AF\u0644', desc: '\u06AF\u0644\u06CC \u06A9\u0647 \u062F\u0648\u0633\u062A \u062F\u0627\u0631\u06CC \u062F\u0627\u0631\u062F' },
    { id: 'sun',     emoji: '\u2600\uFE0F', title: '\u062E\u0648\u0631\u0634\u06CC\u062F', desc: '\u062E\u0648\u0631\u0634\u06CC\u062F \u0631\u0648\u0632 \u0631\u0627 \u0628\u06A9\u0634' },
    { id: 'moon',    emoji: '\uD83C\uDF19', title: '\u0645\u0627\u0647', desc: '\u06CC\u06A9 \u0634\u0628 \u0622\u0633\u0645\u0627\u0646 \u0628\u0627 \u0645\u0627\u0647' },
    { id: 'home',    emoji: '\uD83C\uDFE0', title: '\u062E\u0627\u0646\u0647', desc: '\u062E\u0627\u0646\u0647\u200C\u0627\u06CC \u06A9\u0647 \u062F\u0631 \u0631\u0648\u06CC\u0627\u06CC \u06A9\u0648\u0647 \u0645\u06CC\u200C\u0633\u0627\u0632\u06CC' },
    { id: 'food',    emoji: '\uD83C\uDF54', title: '\u063A\u0630\u0627', desc: '\u063A\u0630\u0627\u06CC \u0645\u0648\u0631\u062F \u0639\u0644\u0627\u0642\u0647\u200C\u062A \u0631\u0627 \u0628\u06A9\u0634' },
    { id: 'friend',  emoji: '\uD83D\uDC66', title: '\u062F\u0648\u0633\u062A', desc: '\u062F\u0648\u0633\u062A \u0635\u0645\u06CC\u0645\u06CC \u062E\u0648\u062F \u0631\u0627 \u0628\u06A9\u0634' }
  ];

  const STORAGE_KEY = 'fandoqi.challenge';
  let cardEl = null;

  function dayIndex() {
    // شمارهٔ روز از epoch (UTC) — ثبات در طول روز
    const now = Date.now();
    return Math.floor(now / 86400000);
  }

  function getChallenge(idx) {
    return POOL[((idx % POOL.length) + POOL.length) % POOL.length];
  }

  function loadState() {
    try {
      const raw = g.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const s = JSON.parse(raw);
        if (typeof s === 'object') return s;
      }
    } catch (_) {}
    return { lastDoneDay: -1, streak: 0, best: 0 };
  }

  function saveState(s) {
    try { g.localStorage.setItem(STORAGE_KEY, JSON.stringify(s)); } catch (_) {}
  }

  function currentChallenge() {
    return getChallenge(dayIndex());
  }

  function markDone() {
    const today = dayIndex();
    const s = loadState();
    const wasNew = s.lastDoneDay !== today;
    if (!wasNew) return s;
    if (s.lastDoneDay === today - 1) s.streak++;
    else s.streak = 1;
    s.best = Math.max(s.best || 0, s.streak);
    s.lastDoneDay = today;
    saveState(s);
    // رویداد سفارشی برای ارتباط با سیستم دستاوردها
    try {
      if (typeof g.dispatchEvent === 'function') {
        g.dispatchEvent(new CustomEvent('fandoqi-challenge-done', { detail: { streak: s.streak, best: s.best } }));
      }
    } catch (_) {}
    return s;
  }

  function getStreak() {
    const s = loadState();
    return { current: s.streak || 0, best: s.best || 0 };
  }

  // ---------- رندر کارت ----------
  function renderCard() {
    if (!cardEl || !HAS_DOC) return;
    const ch = currentChallenge();
    const st = getStreak();
    cardEl.innerHTML = '';
    const emoji = document.createElement('span');
    emoji.className = 'ch-emoji';
    emoji.textContent = ch.emoji;
    const body = document.createElement('div');
    body.className = 'ch-body';
    const title = document.createElement('h3');
    title.textContent = '\u0686\u0627\u0644\u0634 \u0631\u0648\u0632: ' + ch.title;
    const desc = document.createElement('p');
    desc.textContent = ch.desc;
    const meta = document.createElement('span');
    meta.className = 'ch-meta';
    const streakTxt = st.current > 0
      ? '\uD83D\uDD25 \u0633\u062A\u0631\u06CC\u06A9: ' + st.current + ' \u0631\u0648\u0632'
      : '\u2728 \u0627\u0648\u0644\u06CC\u0646 \u0686\u0627\u0644\u0634 \u062A\u0648';
    meta.textContent = streakTxt;
    body.appendChild(title);
    body.appendChild(desc);
    body.appendChild(meta);
    cardEl.appendChild(emoji);
    cardEl.appendChild(body);
  }

  function show() {
    if (!cardEl || !HAS_DOC) return;
    cardEl.classList.remove('is-hidden');
    cardEl.classList.add('is-show');
    renderCard();
  }

  function hide() {
    if (!cardEl || !HAS_DOC) return;
    cardEl.classList.remove('is-show');
    cardEl.classList.add('is-hidden');
  }

  function init(opts) {
    if (!HAS_DOC) return;
    cardEl = opts && opts.cardEl;
    if (cardEl) renderCard();
  }

  // ---------- API ----------
  const api = {
    POOL: POOL,
    init: init,
    currentChallenge: currentChallenge,
    dayIndex: dayIndex,
    markDone: markDone,
    getStreak: getStreak,
    show: show,
    hide: hide,
    renderCard: renderCard,
    STORAGE_KEY: STORAGE_KEY
  };

  g.Challenges = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis);
