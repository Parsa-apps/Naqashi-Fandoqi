/* ============================================================
   templates.js — قالب‌های از پیش ترسیم‌شده
   - کودک یک شکل خط‌چین را انتخاب می‌کند
   - رنگ‌آمیزی و تکمیل آن
   - بند ۱۶ MasterPrompt: قابلیت ارزش‌آفرین
   ============================================================ */
(function (g) {
  'use strict';

  const HAS_DOC = typeof document !== 'undefined';

  // -------- قالب‌ها با SVG شکل‌های ساده --------
  const TEMPLATES = [
    {
      id: 'teddy',
      emoji: '\uD83E\uDDDA',
      title: 'خرس فندوقی',
      desc: 'یک خرس ساده که فقط باید رنگش کنی',
      svg: makeBearSvg()
    },
    {
      id: 'cupcake',
      emoji: '\uD83E\uDDC1',
      title: 'کاپ‌کیک',
      desc: 'کاپ‌کیک خامه‌ای آماده برای تزئین',
      svg: makeCupcakeSvg()
    },
    {
      id: 'rocket',
      emoji: '\uD83D\uDE80',
      title: 'موشک',
      desc: 'موشک کاغذی آمادهٔ پرواز',
      svg: makeRocketSvg()
    },
    {
      id: 'garden',
      emoji: '\uD83C\uDF31',
      title: 'باغچه',
      desc: 'باغچهٔ آماده برای کاشت گل',
      svg: makeGardenSvg()
    }
  ];

  function makeBearSvg() {
    return '' +
      '<svg viewBox="0 0 200 180" xmlns="http://www.w3.org/2000/svg">' +
        '<ellipse cx="100" cy="115" rx="52" ry="38" fill="#fff3e0" stroke="#5d4037" stroke-width="3" stroke-dasharray="6 4"/>' +
        '<circle cx="100" cy="60" r="42" fill="#fff3e0" stroke="#5d4037" stroke-width="3" stroke-dasharray="6 4"/>' +
        '<circle cx="115" cy="34" r="13" fill="#fff3e0" stroke="#5d4037" stroke-width="3" stroke-dasharray="6 4"/>' +
        '<circle cx="85" cy="34" r="13" fill="#fff3e0" stroke="#5d4037" stroke-width="3" stroke-dasharray="6 4"/>' +
        '<circle cx="115" cy="34" r="6" fill="#fff8e1" stroke="#5d4037" stroke-width="2"/>' +
        '<circle cx="85" cy="34" r="6" fill="#fff8e1" stroke="#5d4037" stroke-width="2"/>' +
        '<circle cx="85" cy="55" r="4" fill="#212121"/>' +
        '<circle cx="115" cy="55" r="4" fill="#212121"/>' +
        '<path d="M93 75 q7 8 14 0" fill="none" stroke="#5d4037" stroke-width="3" stroke-linecap="round"/>' +
        '<circle cx="100" cy="72" r="5" fill="#5d4037"/>' +
        '<ellipse cx="100" cy="155" rx="32" ry="10" fill="none" stroke="#5d4037" stroke-width="3" stroke-linecap="round"/>' +
      '</svg>';
  }

  function makeCupcakeSvg() {
    return '' +
      '<svg viewBox="0 0 200 180" xmlns="http://www.w3.org/2000/svg">' +
        '<path d="M40 100 L160 100 L150 165 L50 165 Z" fill="#fffaf0" stroke="#8d6e63" stroke-width="3" stroke-dasharray="6 4"/>' +
        '<path d="M58 100 q-6 -8 0 -16 q-2 -10 8 -8 q4 -8 14 -2 q8 -10 16 -2 q10 -8 12 4 q10 -2 8 8 q6 10 -2 16 Z" fill="#fff" stroke="#8d6e63" stroke-width="3" stroke-dasharray="6 4"/>' +
        '<path d="M60 122 L140 122" stroke="#8d6e63" stroke-width="2" stroke-dasharray="3 3" fill="none"/>' +
        '<line x1="78" y1="140" x2="78" y2="148" stroke="#8d6e63" stroke-width="2" stroke-dasharray="3 2"/>' +
        '<line x1="100" y1="142" x2="100" y2="150" stroke="#8d6e63" stroke-width="2" stroke-dasharray="3 2"/>' +
        '<line x1="122" y1="140" x2="122" y2="148" stroke="#8d6e63" stroke-width="2" stroke-dasharray="3 2"/>' +
        '<circle cx="100" cy="78" r="3" fill="#fff8e1" stroke="#8d6e63" stroke-width="2"/>' +
      '</svg>';
  }

  function makeRocketSvg() {
    return '' +
      '<svg viewBox="0 0 200 180" xmlns="http://www.w3.org/2000/svg">' +
        '<path d="M100 14 Q120 36 120 110 L120 150 L80 150 L80 110 Q80 36 100 14 Z" fill="#fff3e0" stroke="#37474f" stroke-width="3" stroke-dasharray="6 4"/>' +
        '<circle cx="100" cy="56" r="14" fill="#e3f2fd" stroke="#37474f" stroke-width="3" stroke-dasharray="6 4"/>' +
        '<path d="M80 110 Q60 136 56 150 L80 144 Z" fill="#fff3e0" stroke="#37474f" stroke-width="3" stroke-dasharray="6 4"/>' +
        '<path d="M120 110 Q140 136 144 150 L120 144 Z" fill="#fff3e0" stroke="#37474f" stroke-width="3" stroke-dasharray="6 4"/>' +
        '<path d="M84 50 L116 50 M92 38 L108 38 M100 26 L100 18" stroke="#37474f" stroke-width="2" stroke-dasharray="3 3" fill="none"/>' +
        '<path d="M92 150 Q92 162 96 168 M100 150 Q100 168 104 168 M108 150 Q108 162 104 160" fill="none" stroke="#37474f" stroke-width="2.5" stroke-linecap="round"/>' +
      '</svg>';
  }

  function makeGardenSvg() {
    return '' +
      '<svg viewBox="0 0 200 180" xmlns="http://www.w3.org/2000/svg">' +
        '<rect x="0" y="120" width="200" height="60" fill="#fff8e1" stroke="#8d6e63" stroke-width="3" stroke-dasharray="6 4"/>' +
        '<path d="M100 120 Q100 90 100 70" stroke="#558b2f" stroke-width="3" stroke-dasharray="6 4" fill="none"/>' +
        '<path d="M100 100 q-30 -8 -30 -28" fill="none" stroke="#558b2f" stroke-width="3" stroke-dasharray="6 4"/>' +
        '<path d="M100 90 q30 -8 30 -28" fill="none" stroke="#558b2f" stroke-width="3" stroke-dasharray="6 4"/>' +
        '<path d="M100 80 q-20 -6 -20 -22" fill="none" stroke="#558b2f" stroke-width="3" stroke-dasharray="6 4"/>' +
        '<path d="M100 74 q20 -4 20 -18" fill="none" stroke="#558b2f" stroke-width="3" stroke-dasharray="6 4"/>' +
        '<circle cx="70" cy="68" r="9" fill="#fff" stroke="#ad1457" stroke-width="3" stroke-dasharray="6 4"/>' +
        '<circle cx="130" cy="58" r="9" fill="#fff" stroke="#ad1457" stroke-width="3" stroke-dasharray="6 4"/>' +
        '<circle cx="80" cy="56" r="9" fill="#fff" stroke="#ad1457" stroke-width="3" stroke-dasharray="6 4"/>' +
        '<circle cx="120" cy="54" r="9" fill="#fff" stroke="#ad1457" stroke-width="3" stroke-dasharray="6 4"/>' +
        '<path d="M40 130 q6 -8 14 0" stroke="#558b2f" stroke-width="2" stroke-dasharray="4 3" fill="none"/>' +
        '<path d="M150 130 q6 -8 14 0" stroke="#558b2f" stroke-width="2" stroke-dasharray="4 3" fill="none"/>' +
      '</svg>';
  }

  let trayEl = null;
  let btnEl = null;

  function list() { return TEMPLATES.slice(); }

  function loadTemplate(id) {
    const t = TEMPLATES.find(function (x) { return x.id === id; });
    if (!t) return false;
    return drawSvgOnCanvas(t.svg) || false;
  }

  function drawSvgOnCanvas(svgString) {
    if (typeof g.Engine !== 'object') return false;
    const rasterizeFn = g.Engine.rasterizeSvg || rasterizeFallback;
    return !!rasterizeFn(svgString);
  }

  function rasterizeFallback() { return false; }

  function openTray() {
    if (!trayEl || !HAS_DOC) return;
    trayEl.classList.remove('is-hidden');
    trayEl.classList.add('is-show');
  }

  function closeTray() {
    if (!trayEl || !HAS_DOC) return;
    trayEl.classList.remove('is-show');
    trayEl.classList.add('is-hidden');
  }

  function isOpen() {
    if (!trayEl) return false;
    return trayEl.classList.contains('is-show');
  }

  function renderTray() {
    if (!trayEl || !HAS_DOC) return;
    trayEl.innerHTML = '';
    TEMPLATES.forEach(function (tpl) {
      const card = document.createElement('button');
      card.type = 'button';
      card.className = 'tpl-card';
      card.dataset.id = tpl.id;
      card.setAttribute('aria-label', tpl.title);
      const em = document.createElement('span');
      em.className = 'tpl-emoji';
      em.textContent = tpl.emoji;
      const ti = document.createElement('span');
      ti.className = 'tpl-title';
      ti.textContent = tpl.title;
      const ds = document.createElement('span');
      ds.className = 'tpl-desc';
      ds.textContent = tpl.desc;
      card.appendChild(em);
      card.appendChild(ti);
      card.appendChild(ds);
      card.addEventListener('click', function () {
        if (loadTemplate(tpl.id)) {
          if (g.Sound && g.Sound.save) g.Sound.save();
          closeTray();
        } else if (g.Utils && g.Utils.toast) {
          g.Utils.toast('قالب در دسترس نیست...', 'info');
        }
      });
      trayEl.appendChild(card);
    });
  }

  function init(opts) {
    if (!HAS_DOC) return;
    trayEl = opts && opts.trayEl;
    btnEl = opts && opts.toggleBtn;
    if (!trayEl) return;
    if (btnEl) {
      btnEl.addEventListener('click', function () {
        if (isOpen()) closeTray();
        else { openTray(); renderTray(); }
      });
    }
    renderTray();
  }

  const api = {
    init: init,
    TEMPLATES: TEMPLATES,
    list: list,
    loadTemplate: loadTemplate,
    openTray: openTray,
    closeTray: closeTray,
    isOpen: isOpen,
    renderTray: renderTray
  };

  g.Templates = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis);
