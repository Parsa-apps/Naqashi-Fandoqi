/* ============================================================
   save-anim.js — انیمیشن موفقیت پس از ذخیرهٔ نقاشی
   - نمایش کارت طلایی با پیش‌نمایش نقاشی + ذرات جشن
   - پس از ~۱٫۵ ثانیه fade out — انگار برنده شده
   ============================================================ */
(function (g) {
  'use strict';

  const HAS_DOC = typeof document !== 'undefined';

  const COLORS = ['#ffd54f', '#ff7eb6', '#7dd3fc', '#86efac', '#fda4af', '#fef08a'];
  const SPARKLES = ['\u2728', '\uD83C\uDF1F', '\uD83D\uDC8E'];

  let el = null;
  let img = null;
  let titleEl = null;
  let subEl = null;
  let particleEl = null;
  let hideTimer = null;
  let cleanupTimer = null;

  function buildParticles(count) {
    if (!particleEl) return;
    particleEl.innerHTML = '';
    for (let i = 0; i < count; i++) {
      const p = document.createElement('span');
      p.className = 'p';
      // موقعیت مرکز کارت
      p.style.left = '50%';
      p.style.top = '50%';
      // زاویهٔ پرتاب
      const ang = (i / count) * Math.PI * 2 + Math.random() * 0.6;
      const dist = 120 + Math.random() * 90;
      const dx = Math.cos(ang) * dist;
      const dy = -20 + Math.sin(ang) * dist * 0.8 + Math.random() * 30;
      p.style.setProperty('--dx', dx.toFixed(0) + 'px');
      p.style.setProperty('--dy', dy.toFixed(0) + 'px');
      p.style.setProperty('--rot', (Math.random() * 540).toFixed(0) + 'deg');
      // استایل: دایرهٔ رنگی یا ایموجی
      if (i % 4 === 0) {
        p.style.background = SPARKLES[i % SPARKLES.length];
        p.style.color = COLORS[i % COLORS.length];
        p.textContent = SPARKLES[i % SPARKLES.length];
        p.style.fontSize = '1.25rem';
        p.style.display = 'flex';
        p.style.alignItems = 'center';
        p.style.justifyContent = 'center';
      } else {
        p.style.background = COLORS[i % COLORS.length];
        p.style.boxShadow = '0 0 12px ' + COLORS[i % COLORS.length];
      }
      // تاخیر تصادفی برای طبیعی‌تر شدن
      p.style.animationDelay = (Math.random() * 0.25).toFixed(2) + 's';
      particleEl.appendChild(p);
    }
  }

  function show(opts) {
    if (!HAS_DOC) return;
    if (!el) return;
    const data = opts || {};
    if (img && data.thumb) img.src = data.thumb;
    if (titleEl && data.name) titleEl.textContent = '\u0630\u062E\u06CC\u0631\u0647 \u0634\u062F: ' + data.name;
    if (subEl) subEl.textContent = data.sub || '\u0634\u0627\u0647\u06A9\u0627\u0631\u062A \u062F\u0631 \u0622\u0644\u0628\u0648\u0645 \u0645\u062D\u0627\u0641\u0638 \u0634\u062F \uD83C\uDF31';
    buildParticles(28);
    el.classList.add('is-visible');
    if (hideTimer) clearTimeout(hideTimer);
    if (cleanupTimer) clearTimeout(cleanupTimer);
    hideTimer = setTimeout(function () {
      el.classList.remove('is-visible');
      cleanupTimer = setTimeout(function () {
        if (particleEl) particleEl.innerHTML = '';
      }, 400);
    }, 1500);
  }

  function hide() {
    if (!el) return;
    el.classList.remove('is-visible');
    if (hideTimer) { clearTimeout(hideTimer); hideTimer = null; }
    if (cleanupTimer) { clearTimeout(cleanupTimer); cleanupTimer = null; }
    if (particleEl) particleEl.innerHTML = '';
  }

  function init() {
    if (!HAS_DOC) return;
    el = document.getElementById('save-success');
    if (!el) return;
    img = document.getElementById('save-success-img');
    titleEl = document.getElementById('save-success-title');
    subEl = document.getElementById('save-success-sub');
    particleEl = document.getElementById('save-success-particles');
  }

  const api = { show: show, hide: hide, init: init };

  if (HAS_DOC && document.readyState !== 'loading') {
    init();
  } else if (HAS_DOC) {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  }

  g.SaveAnim = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis);
