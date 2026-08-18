/* ============================================================
   about.js — صفحه «دربارهٔ ما / پارسا اپس»
   بند ۱۵ MasterPrompt: هاله طلايي متحرک، لينک پشتيباني
   ============================================================ */
(function (g) {
  'use strict';

  const HAS_DOC = typeof document !== 'undefined';

  function open() {
    if (typeof window !== 'undefined' && window.App && typeof window.App.showModal === 'function') {
      window.App.showModal('about-modal');
    } else if (HAS_DOC) {
      const el = document.getElementById('about-modal');
      if (el) el.classList.remove('is-hidden');
    }
  }

  function close() {
    if (typeof window !== 'undefined' && window.App && typeof window.App.hideModal === 'function') {
      window.App.hideModal('about-modal');
    } else if (HAS_DOC) {
      const el = document.getElementById('about-modal');
      if (el) el.classList.add('is-hidden');
    }
  }

  function init() {
    if (!HAS_DOC) return;
    const btn = document.getElementById('about-btn');
    if (btn) btn.addEventListener('click', open);

    const closeBtn = document.getElementById('about-close');
    if (closeBtn) closeBtn.addEventListener('click', close);

    const tgBtn = document.getElementById('about-telegram');
    if (tgBtn) {
      tgBtn.addEventListener('click', function () {
        try {
          window.open('https://t.me/Parsaappsadmin', '_blank', 'noopener');
        } catch (_) {}
      });
    }
  }

  const api = { open: open, close: close, init: init };

  g.About = api;
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  }

  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init, { once: true });
    } else {
      init();
    }
  }
})(typeof window !== 'undefined' ? window : globalThis);
