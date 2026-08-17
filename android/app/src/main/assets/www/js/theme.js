/* ============================================================
   theme.js — مديريت حالت تيره/روشن فندقي
   - مهم‌ترين کار: اعمال تم قبل از رنگ DOM براي جلوگيري از فلش
   - تشخيص از localStorage و سيستم
   - تعويض با ترنزيشن نرم (نه در لود اوليه)
   - دنبال کردن تغيير سيستمي (فقط اگر کاربر انتخاب صريح نکرده)
   ============================================================ */
(function (g) {
  'use strict';

  const STORAGE_KEY = 'fandoqi.theme';
  const HAS_DOC = typeof document !== 'undefined';
  const root = HAS_DOC ? g.document.documentElement : null;

  // ---------- درج فوري تم قبل از لود CSS — جلوگيري از فلش ----------
  function applyEarly() {
    if (!HAS_DOC) return;
    try {
      const stored = g.localStorage.getItem(STORAGE_KEY);
      let theme;
      if (stored === 'light' || stored === 'dark') theme = stored;
      else theme = (g.matchMedia && g.matchMedia('(prefers-color-scheme: dark)').matches) ? 'dark' : 'light';
      root.setAttribute('data-theme', theme);
    } catch (_) {
      root.setAttribute('data-theme', 'light');
    }
  }

  if (HAS_DOC) applyEarly();

  function getStored() {
    try { return g.localStorage.getItem(STORAGE_KEY); } catch (_) { return null; }
  }
  function setStored(v) {
    try { g.localStorage.setItem(STORAGE_KEY, v); } catch (_) {}
  }

  function current() { return root ? (root.getAttribute('data-theme') || 'light') : 'light'; }

  function apply(theme, skipTransition) {
    if (theme !== 'light' && theme !== 'dark') theme = 'light';
    if (HAS_DOC) {
      if (skipTransition) {
        const prevDur = root.style.getPropertyValue('--transition-theme');
        root.style.setProperty('--transition-theme', 'none');
        root.setAttribute('data-theme', theme);
        setStored(theme);
        syncMeta(theme);
        void root.offsetHeight;
        requestAnimationFrame(function () {
          root.style.setProperty('--transition-theme', prevDur || '');
        });
      } else {
        root.setAttribute('data-theme', theme);
        setStored(theme);
        syncMeta(theme);
      }
      const btn = g.document.getElementById('theme-toggle');
      if (btn) {
        const lbl = (theme === 'dark') ? '\u0631\u0648\u0634\u0646 \u06A9\u0631\u062F\u0646 \u062A\u0645' : '\u062A\u06CC\u0631\u0647 \u06A9\u0631\u062F\u0646 \u062A\u0645';
        btn.setAttribute('aria-label', lbl);
        btn.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
      }
    }
  }

  function syncMeta(theme) {
    if (!HAS_DOC) return;
    try {
      g.document.querySelectorAll('meta[name="theme-color"]').forEach(function (m) {
        m.setAttribute('content', theme === 'dark' ? '#2b2540' : '#8a5cff');
      });
      g.document.querySelectorAll('meta[name="color-scheme"]').forEach(function (m) {
        m.setAttribute('content', theme === 'dark' ? 'dark' : 'light');
      });
    } catch (_) {}
  }

  function detectInitial() {
    const stored = getStored();
    if (stored === 'light' || stored === 'dark') return stored;
    return (g.matchMedia && g.matchMedia('(prefers-color-scheme: dark)').matches) ? 'dark' : 'light';
  }

  function toggle() {
    apply(current() === 'dark' ? 'light' : 'dark', false);
  }

  // ---------- مقداردهي اوليه ----------
  let initialized = false;
  function init() {
    if (!HAS_DOC) return;
    if (initialized) return;
    initialized = true;
    apply(detectInitial(), true);
    const btn = g.document.getElementById('theme-toggle');
    if (btn) btn.addEventListener('click', toggle);

    if (!getStored() && g.matchMedia) {
      const mq = g.matchMedia('(prefers-color-scheme: dark)');
      const onChange = function (e) {
        if (!getStored()) apply(e.matches ? 'dark' : 'light', true);
      };
      if (mq.addEventListener) mq.addEventListener('change', onChange);
      else if (mq.addListener) mq.addListener(onChange);
    }
  }

  const api = {
    apply: apply,
    toggle: toggle,
    current: current,
    detect: detectInitial,
    _init: init
  };

  g.Theme = api;
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  }

  if (HAS_DOC) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init, { once: true });
    } else {
      init();
    }
  }
})(typeof window !== 'undefined' ? window : globalThis);
