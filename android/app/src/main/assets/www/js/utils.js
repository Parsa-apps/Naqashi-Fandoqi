/* ============================================================
   utils.js — ابزارهای عمومی
   ============================================================ */
(function (g) {
  'use strict';

  const $ = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));

  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

  const debounce = (fn, ms) => {
    let t;
    return function (...args) {
      clearTimeout(t);
      t = setTimeout(() => fn.apply(this, args), ms);
    };
  };

  function hexToRgb(hex) {
    const m = /^#?([0-9a-f]{6})$/i.exec(String(hex || '').trim());
    if (!m) return null;
    const n = parseInt(m[1], 16);
    return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
  }

  const rgba = (hex, alpha) => {
    const c = hexToRgb(hex);
    if (!c) return 'rgba(0,0,0,' + alpha + ')';
    return 'rgba(' + c.r + ',' + c.g + ',' + c.b + ',' + alpha + ')';
  };

  function formatDateFa(ts) {
    try {
      return new Intl.DateTimeFormat('fa-IR', { year: 'numeric', month: 'long', day: 'numeric' })
        .format(new Date(ts));
    } catch (e) {
      return new Date(ts).toLocaleDateString();
    }
  }

  const FA_DIGITS = '۰۱۲۳۴۵۶۷۸۹';

  function toFaDigits(value) {
    return String(value).replace(/\d/g, function (d) {
      return FA_DIGITS[Number(d)];
    });
  }

  /* ---------- توست ---------- */

  const TOAST_ICONS = { success: '✅', error: '❌', info: '💡' };

  function toast(message, kind) {
    const k = TOAST_ICONS[kind] ? kind : 'info';
    let box = $('#toasts');
    if (!box) {
      box = document.createElement('div');
      box.id = 'toasts';
      box.className = 'toasts';
      document.body.appendChild(box);
    }
    const el = document.createElement('div');
    el.className = 'toast';
    el.textContent = TOAST_ICONS[k] + ' ' + message;
    box.appendChild(el);
    setTimeout(() => {
      el.classList.add('out');
      setTimeout(() => el.remove(), 320);
    }, 2600);
  }

  /* ---------- دانلود ---------- */

  function download(dataUrl, filename) {
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  const api = {
    $, $$, clamp, debounce, hexToRgb, rgba, formatDateFa, toFaDigits, toast, download
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
      clamp, debounce, hexToRgb, rgba, formatDateFa, toFaDigits
    };
  }
  g.Utils = api;
})(typeof window !== 'undefined' ? window : globalThis);
