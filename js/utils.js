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

  /* ---------- اشتراك‌گذاري (Web Share API) ---------- */

  function blobFromDataUrl(dataUrl) {
    try {
      const parts = String(dataUrl).split(',');
      const mime = (parts[0].match(/:(.*?);/) || [, 'image/png'])[1];
      const bin = atob(parts[1]);
      const arr = new Uint8Array(bin.length);
      for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
      return new Blob([arr], { type: mime });
    } catch (_) {
      return null;
    }
  }

  function dataUrlToFile(dataUrl, filename) {
    const blob = blobFromDataUrl(dataUrl);
    return blob ? new File([blob], filename, { type: blob.type }) : null;
  }

  async function share(opts) {
    if (typeof navigator === 'undefined' || !navigator.share) return false;
    const o = opts || {};
    try {
      let payload = { title: o.title || 'شاهکار فندوقی', text: o.text || '', url: o.url || undefined };
      if (o.file || o.dataUrl) {
        const file = o.file || dataUrlToFile(o.dataUrl, o.filename || 'fandoqi.png');
        if (file && typeof navigator.canShare === 'function' && navigator.canShare({ files: [file] })) {
          payload.files = [file];
          delete payload.url;
        }
      }
      await navigator.share(payload);
      return true;
    } catch (_) {
      return false;
    }
  }

  function canShare() {
    return typeof navigator !== 'undefined' && !!navigator.share;
  }

  const api = {
    $, $$, clamp, debounce, hexToRgb, rgba, formatDateFa, toFaDigits, toast, download, share, canShare
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
      clamp, debounce, hexToRgb, rgba, formatDateFa, toFaDigits, canShare,
      share, blobFromDataUrl, dataUrlToFile
    };
  }
  g.Utils = api;
})(typeof window !== 'undefined' ? window : globalThis);
