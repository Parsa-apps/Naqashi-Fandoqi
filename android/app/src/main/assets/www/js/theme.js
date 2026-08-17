/* ============================================================
   theme.js — مدیریت حالت تیره (Dark Mode) فندوقی
   - تشخیص اولیه از localStorage / سیستم
   - تعویض با ترنزیشن نرم
   - ذخیره در localStorage
   ============================================================ */
(function (g) {
  'use strict';

  const STORAGE_KEY = 'fandoqi.theme';
  const root = g.document.documentElement;

  function getStored() {
    try { return g.localStorage.getItem(STORAGE_KEY); } catch (_) { return null; }
  }
  function setStored(v) {
    try { g.localStorage.setItem(STORAGE_KEY, v); } catch (_) {}
  }

  function current() { return root.getAttribute('data-theme') || 'light'; }

  function apply(theme, skipTransition) {
    if (theme !== 'light' && theme !== 'dark') theme = 'light';
    root.setAttribute('data-theme', theme);
    setStored(theme);
    syncMeta(theme);
    const btn = g.document.getElementById('theme-toggle');
    if (btn) {
      const lbl = (theme === 'dark') ? 'روشن کردن تم' : 'تیره کردن تم';
      btn.setAttribute('aria-label', lbl);
      btn.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
    }
  }

  function syncMeta(theme) {
    g.document.querySelectorAll('meta[name="theme-color"]').forEach(function (m) {
      m.setAttribute('content', theme === 'dark' ? '#2b2540' : '#8a5cff');
    });
    g.document.querySelectorAll('meta[name="color-scheme"]').forEach(function (m) {
      m.setAttribute('content', theme === 'dark' ? 'dark' : 'light');
    });
  }

  function detectInitial() {
    const stored = getStored();
    if (stored === 'light' || stored === 'dark') return stored;
    return g.matchMedia && g.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function toggle() {
    apply(current() === 'dark' ? 'light' : 'dark');
  }

  function init() {
    apply(detectInitial(), true);
    const btn = g.document.getElementById('theme-toggle');
    if (btn) btn.addEventListener('click', toggle);

    // اگر کاربر هنوز انتخاب صریح نکرده، تغییر سیستم را دنبال کن
    if (!getStored() && g.matchMedia) {
      const mq = g.matchMedia('(prefers-color-scheme: dark)');
      const onChange = function (e) {
        if (!getStored()) apply(e.matches ? 'dark' : 'light', true);
      };
      if (mq.addEventListener) mq.addEventListener('change', onChange);
      else if (mq.addListener) mq.addListener(onChange);
    }
  }

  g.Theme = { apply: apply, toggle: toggle, current: current };
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})(typeof window !== 'undefined' ? window : globalThis);
