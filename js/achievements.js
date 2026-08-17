/* ============================================================
   achievements.js — سیستم دستاورد (Achievement)
   - ذخیره در localStorage (هم‌خوان با StorageCore)
   - نمایش پاپ‌آپ طلایی هنگام باز شدن دستاورد
   - بند ۱۶ MasterPrompt: قابلیت ارزش‌آفرین برای کودکان
   ============================================================ */
(function (g) {
  'use strict';

  // تعریف دستاوردها — هر کدام یک eventId دارد که در بازی صدا زده می‌شود
  const CATALOG = {
    'first-draw':  { ico: '🎨', title: 'اولین شاهکار!',        sub: 'اولین نقاشی‌ات را در آلبوم ذخیره کردی' },
    'three-draw':  { ico: '🖼️', title: 'هنرمند پرکار',          sub: '۳ نقاشی در آلبومت داری' },
    'ten-draw':    { ico: '🏆', title: 'استاد آلبوم',             sub: '۱۰ شاهکار در آلبومت ثبت شد' },
    'first-step':  { ico: '✏️', title: 'اولین قدم!',             sub: 'اولین قدم یک آموزش را یاد گرفتی' },
    'tutorial-1':  { ico: '🥉', title: 'یادگیرندهٔ مبتدی',         sub: '۱ آموزش را کامل کردی' },
    'tutorial-3':  { ico: '🥈', title: 'هنرجوی فعال',            sub: '۳ آموزش را کامل کردی' },
    'all-tutorials': { ico: '🥇', title: 'استاد نقاشی فندوقی!',   sub: 'همهٔ آموزش‌ها را کامل کردی' },
    'share-me':    { ico: '📲', title: 'نصب فندوقی',              sub: 'فندوقی را روی دستگاهت نصب کردی' },
  };

  const STORAGE_KEY = 'fandoqi.achievements';

  let cache = null;
  let timer = null;

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
    } catch (_) { /* quota — بی‌صدا رد شو */ }
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

  // نمایش پاپ‌آپ طلایی
  function show(id) {
    const def = CATALOG[id];
    const pop = g.document.getElementById('achievement-pop');
    if (!pop || !def) return;

    const ico = g.document.getElementById('ach-ico');
    const title = g.document.getElementById('ach-title');
    const sub = g.document.getElementById('ach-sub');
    if (ico)  ico.textContent  = def.ico;
    if (title) title.textContent = def.title;
    if (sub)  sub.textContent = def.sub;

    pop.classList.add('is-visible');

    // صدای تشویقی
    try {
      if (g.Sound && g.Sound.isEnabled && g.Sound.isEnabled() && g.Sound.chime) {
        g.Sound.chime();
      }
    } catch (_) { /* بی‌صدا بشو اگر صدا غیرفعال است */ }

    if (timer) clearTimeout(timer);
    timer = setTimeout(function () {
      pop.classList.remove('is-visible');
    }, 3200);
  }

  // وقتی کاربر کل آموزش‌ها را تمام کند
  function checkAllTutorials(doneCount, totalCount) {
    if (doneCount >= 1)   unlock('tutorial-1');
    if (doneCount >= 3)   unlock('tutorial-3');
    if (doneCount >= totalCount && totalCount > 0) unlock('all-tutorials');
  }

  // وقتی نقاشی ذخیره شد
  function checkAlbumSize(size) {
    if (size >= 1)  unlock('first-draw');
    if (size >= 3)  unlock('three-draw');
    if (size >= 10) unlock('ten-draw');
  }

  // وقتی اپ نصب شد
  function checkInstalled() {
    unlock('share-me');
  }

  // وقتی یک قدم یاد گرفته شد
  function checkFirstStep() {
    unlock('first-step');
  }

  const api = {
    CATALOG: CATALOG,
    has: has,
    list: list,
    unlock: unlock,
    checkAllTutorials: checkAllTutorials,
    checkAlbumSize: checkAlbumSize,
    checkInstalled: checkInstalled,
    checkFirstStep: checkFirstStep,
  };

  g.Achievements = api;
})(typeof window !== 'undefined' ? window : globalThis);
