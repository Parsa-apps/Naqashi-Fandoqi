/* ============================================================
   about.js — صفحهٔ «دربارهٔ ما / پارسا اپس»
   بند ۱۵ MasterPrompt: هالهٔ طلایی متحرک، لینک پشتیبانی
   ============================================================ */
(function (g) {
  'use strict';

  function open() {
    if (window.App && typeof window.App.showModal === 'function') {
      window.App.showModal('about-modal');
    } else {
      const el = document.getElementById('about-modal');
      if (el) el.classList.remove('is-hidden');
    }
  }

  function close() {
    if (window.App && typeof window.App.hideModal === 'function') {
      window.App.hideModal('about-modal');
    } else {
      const el = document.getElementById('about-modal');
      if (el) el.classList.add('is-hidden');
    }
  }

  function init() {
    const btn = document.getElementById('about-btn');
    if (btn) btn.addEventListener('click', open);

    const closeBtn = document.getElementById('about-close');
    if (closeBtn) closeBtn.addEventListener('click', close);

    const tgBtn = document.getElementById('about-telegram');
    if (tgBtn) {
      tgBtn.addEventListener('click', function (e) {
        // اگر تلگرام نصب نبود، لینک وب باز می‌شود
        try {
          window.open('https://t.me/Parsaappsadmin', '_blank', 'noopener');
        } catch (_) {}
      });
    }
  }

  g.About = { open: open, close: close, init: init };
})(typeof window !== 'undefined' ? window : globalThis);
