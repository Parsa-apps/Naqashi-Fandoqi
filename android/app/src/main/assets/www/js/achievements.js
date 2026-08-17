/* ============================================================
   achievements.js — سیستم دستاورد (Achievement)
   - ذخیره در localStorage (هم‌خوان با StorageCore)
   - نمایش پاپ‌آپ طلایی هنگام باز شدن دستاورد
   - بند ۱۶ MasterPrompt: قابلیت ارزش‌آفرین برای کودکان
   ============================================================ */
(function (g) {
  'use strict';

  const HAS_DOC = typeof document !== 'undefined';

  const CATALOG = {
    'first-draw':  { ico: '\uD83C\uDFA8', title: '\u0627\u0648\u0644\u06CC\u0646 \u0634\u0627\u0647\u06A9\u0627\u0631!',        sub: '\u0627\u0648\u0644\u06CC\u0646 \u0646\u0642\u0627\u0634\u06CC\u200C\u0627\u062A \u0631\u0627 \u062F\u0631 \u0622\u0644\u0628\u0648\u0645 \u0630\u062E\u06CC\u0631\u0647 \u06A9\u0631\u062F\u06CC' },
    'three-draw':  { ico: '\uD83D\uDDBC\uFE0F', title: '\u0647\u0646\u0631\u0645\u0646\u062F \u067E\u0631\u06A9\u0627\u0631',          sub: '\u066B\u0663 \u0646\u0642\u0627\u0634\u06CC \u062F\u0631 \u0622\u0644\u0628\u0648\u0645\u062A \u062F\u0627\u0631\u06CC' },
    'ten-draw':    { ico: '\uD83C\uDFC6', title: '\u0627\u0633\u062A\u0627\u062F \u0622\u0644\u0628\u0648\u0645',             sub: '\u066B\u0661\u0660 \u0634\u0627\u0647\u06A9\u0627\u0631 \u062F\u0631 \u0622\u0644\u0628\u0648\u0645\u062A \u062B\u0628\u062A \u0634\u062F' },
    'first-step':  { ico: '\u270F\uFE0F', title: '\u0627\u0648\u0644\u06CC\u0646 \u0642\u062F\u0645!',             sub: '\u0627\u0648\u0644\u06CC\u0646 \u0642\u062F\u0645 \u06CC\u06A9 \u0622\u0645\u0648\u0632\u0634 \u0631\u0627 \u06CC\u0627\u062F \u06AF\u0631\u0641\u062A\u06CC' },
    'tutorial-1':  { ico: '\uD83E\uDD49', title: '\u06CC\u0627\u062F\u06AF\u06CC\u0631\u0646\u062F\u0647\u0654 \u0645\u0628\u062A\u062F\u06CC',         sub: '\u066B\u0661 \u0622\u0645\u0648\u0632\u0634 \u0631\u0627 \u06A9\u0627\u0645\u0644 \u06A9\u0631\u062F\u06CC' },
    'tutorial-3':  { ico: '\uD83E\uDD48', title: '\u0647\u0646\u0631\u062C\u0648\u06CC \u0641\u0639\u0627\u0644',            sub: '\u066B\u0663 \u0622\u0645\u0648\u0632\u0634 \u0631\u0627 \u06A9\u0627\u0645\u0644 \u06A9\u0631\u062F\u06CC' },
    'all-tutorials': { ico: '\uD83E\uDD47', title: '\u0627\u0633\u062A\u0627\u062F \u0646\u0642\u0627\u0634\u06CC \u0641\u0646\u062F\u0648\u0642\u06CC!',   sub: '\u0647\u0645\u0647\u0654 \u0622\u0645\u0648\u0632\u0634\u200C\u0647\u0627 \u0631\u0627 \u06A9\u0627\u0645\u0644 \u06A9\u0631\u062F\u06CC' },
    'all-stamps':  { ico: '\uD83C\uDF39', title: '\u0633\u062A\u0627\u0631\u0647\u200C\u0686\u06CC\u0646',              sub: '\u0647\u0645\u0647 \u0633\u062A\u0627\u0631\u0647\u200C\u0647\u0627\u06CC \u062C\u0627\u062F\u0648\u06CC \u0631\u0627 \u0628\u0647 \u062F\u0633\u062A \u0622\u0648\u0631\u062F\u06CC' },
    'share-me':    { ico: '\uD83D\uDCF2', title: '\u0646\u0635\u0628 \u0641\u0646\u062F\u0648\u0642\u06CC',              sub: '\u0641\u0646\u062F\u0648\u0642\u06CC \u0631\u0627 \u0631\u0648\u06CC \u062F\u0633\u062A\u06AF\u0627\u0647\u062A \u0646\u0635\u0628 \u06A9\u0631\u062F\u06CC' },
  };

  const STORAGE_KEY = 'fandoqi.achievements';

  let cache = null;
  let hideTimer = null;

  function load() {
    if (cache) return cache;
    try {
      cache = JSON.parse(g.localStorage.getItem(STORAGE_KEY) || '{}');
      if (!cache || typeof cache !== 'object') cache = {};
    } catch (_) {
      cache = {};
    }
    return cache;
  }

  function save() {
    try {
      g.localStorage.setItem(STORAGE_KEY, JSON.stringify(cache));
    } catch (_) {}
  }

  function has(id) { return !!load()[id]; }

  function list() {
    const out = [];
    const data = load();
    Object.keys(CATALOG).forEach(function (id) {
      if (data[id]) out.push(Object.assign({ id: id, at: data[id] }, CATALOG[id]));
    });
    return out;
  }

  function unlock(id) {
    if (!CATALOG[id]) return false;
    const data = load();
    if (data[id]) return false;
    data[id] = Date.now();
    cache = data;
    save();
    show(id);
    return true;
  }

  function show(id) {
    if (!HAS_DOC) return;
    const def = CATALOG[id];
    const pop = document.getElementById('achievement-pop');
    if (!pop || !def) return;

    const ico = document.getElementById('ach-ico');
    const title = document.getElementById('ach-title');
    const sub = document.getElementById('ach-sub');
    if (ico)  ico.textContent  = def.ico;
    if (title) title.textContent = def.title;
    if (sub)  sub.textContent = def.sub;

    pop.classList.add('is-visible');

    try {
      const snd = g.Sound;
      if (snd && typeof snd.isEnabled === 'function' && snd.isEnabled()) {
        if (typeof snd.chime === 'function')      snd.chime();
        else if (typeof snd.save === 'function') snd.save();
      }
    } catch (_) {}

    if (hideTimer) clearTimeout(hideTimer);
    hideTimer = setTimeout(function () {
      pop.classList.remove('is-visible');
    }, 3200);
  }

  function checkAllTutorials(doneCount, totalCount) {
    if (doneCount >= 1)   unlock('tutorial-1');
    if (doneCount >= 3)   unlock('tutorial-3');
    if (doneCount >= totalCount && totalCount > 0) unlock('all-tutorials');
  }

  function checkAlbumSize(size) {
    if (size >= 1)  unlock('first-draw');
    if (size >= 3)  unlock('three-draw');
    if (size >= 10) unlock('ten-draw');
  }

  function checkInstalled() { unlock('share-me'); }
  function checkFirstStep() { unlock('first-step'); }
  function checkAllStamps() { unlock('all-stamps'); }

  const api = {
    CATALOG: CATALOG,
    has: has,
    list: list,
    unlock: unlock,
    checkAllTutorials: checkAllTutorials,
    checkAlbumSize: checkAlbumSize,
    checkInstalled: checkInstalled,
    checkFirstStep: checkFirstStep,
    checkAllStamps: checkAllStamps
  };

  g.Achievements = api;
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  }

  // پاک‌سازی هنگام خروج — فقط در مرورگر
  if (typeof window !== 'undefined' && window.addEventListener) {
    window.addEventListener('beforeunload', function () {
      if (hideTimer) clearTimeout(hideTimer);
    });
  }
})(typeof window !== 'undefined' ? window : globalThis);
