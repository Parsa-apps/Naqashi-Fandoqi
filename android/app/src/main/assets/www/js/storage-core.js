/* ============================================================
   storage-core.js — هستهٔ ذخیره‌سازی (خالص، بدون وابستگی به DOM)
   قابل استفاده در مرورگر و قابل تست در Node.
   ============================================================ */
(function (g) {
  'use strict';

  const MAX_ALBUM_ITEMS = 24;        // حداکثر تعداد نقاشی‌های آلبوم
  const MAX_TOTAL_CHARS = 4500000;   // سقف تقریبی حجم کل (حروف JSON)
  const MAX_NAME_LEN = 40;           // حداکثر طول نام نقاشی

  const KEYS = {
    album: 'nf.v1.album',
    draft: 'nf.v1.draft',
    progress: 'nf.v1.progress',
    sound: 'nf.v1.sound',
    lastTab: 'nf.v1.lastTab',
    offlineReady: 'nf.v1.offlineReady',
    installPrompt: 'nf.v1.installPrompt'
  };

  /* ---------- ابزارهای خالص ---------- */

  function uid() {
    return Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 8);
  }

  function sanitizeName(name) {
    const cleaned = String(name == null ? '' : name)
      .replace(/[\u0000-\u001f\u007f]/g, '')
      .trim()
      .slice(0, MAX_NAME_LEN);
    return cleaned || 'شاهکار بدون نام';
  }

  function estimateSize(value) {
    try {
      return JSON.stringify(value).length;
    } catch (e) {
      return 0;
    }
  }

  function isDataImage(url) {
    return typeof url === 'string' && url.startsWith('data:image') && url.length < 3000000;
  }

  function validateRecord(rec) {
    return !!rec &&
      typeof rec === 'object' &&
      typeof rec.id === 'string' && rec.id.length > 0 &&
      typeof rec.name === 'string' && rec.name.length > 0 &&
      typeof rec.date === 'number' && isFinite(rec.date) &&
      isDataImage(rec.dataUrl) &&
      isDataImage(rec.thumb);
  }

  function createRecord(name, date, dataUrl, thumb) {
    return {
      id: uid(),
      name: sanitizeName(name),
      date: Number.isFinite(Number(date)) ? Number(date) : Date.now(),
      dataUrl: String(dataUrl || ''),
      thumb: String(thumb || '')
    };
  }

  function canAdd(album, newRecord) {
    if (!Array.isArray(album)) return { ok: false, reason: 'bad' };
    if (album.length >= MAX_ALBUM_ITEMS) return { ok: false, reason: 'full' };
    if (estimateSize(album) + estimateSize(newRecord) > MAX_TOTAL_CHARS) {
      return { ok: false, reason: 'space' };
    }
    return { ok: true, reason: null };
  }

  /* ---------- دسترسی امن به حافظه ---------- */

  function defaultStorage() {
    try {
      return typeof localStorage !== 'undefined' ? localStorage : null;
    } catch (e) {
      return null;
    }
  }

  function safeGet(key, fallback, storage) {
    const st = storage || defaultStorage();
    if (!st) return fallback;
    try {
      const raw = st.getItem(key);
      if (raw == null) return fallback;
      return JSON.parse(raw);
    } catch (e) {
      return fallback;
    }
  }

  function safeSet(key, value, storage) {
    const st = storage || defaultStorage();
    if (!st) return false;
    try {
      st.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      return false;
    }
  }

  function safeRemove(key, storage) {
    const st = storage || defaultStorage();
    if (!st) return false;
    try {
      st.removeItem(key);
      return true;
    } catch (e) {
      return false;
    }
  }

  /* ---------- عملیات آلبوم ---------- */

  function loadAlbum(storage) {
    const raw = safeGet(KEYS.album, [], storage);
    if (!Array.isArray(raw)) return [];
    return raw.filter(validateRecord).slice(0, MAX_ALBUM_ITEMS);
  }

  function addToAlbum(record, storage) {
    const album = loadAlbum(storage);
    const check = canAdd(album, record);
    if (!check.ok) return { ok: false, reason: check.reason, album };
    album.push(record);
    if (!safeSet(KEYS.album, album, storage)) return { ok: false, reason: 'storage', album: loadAlbum(storage) };
    return { ok: true, reason: null, album };
  }

  function removeFromAlbum(id, storage) {
    const album = loadAlbum(storage);
    const next = album.filter((r) => r.id !== id);
    if (!safeSet(KEYS.album, next, storage)) return { ok: false, album };
    return { ok: true, album: next };
  }

  function getFromAlbum(id, storage) {
    return loadAlbum(storage).find((r) => r.id === id) || null;
  }

  /* ---------- پیش‌نویس و تنظیمات ---------- */

  function loadDraft(storage) {
    const raw = safeGet(KEYS.draft, null, storage);
    return isDataImage(raw) ? raw : null;
  }

  function saveDraft(dataUrl, storage) {
    if (!isDataImage(dataUrl)) return false;
    return safeSet(KEYS.draft, dataUrl, storage);
  }

  function loadProgress(storage) {
    const raw = safeGet(KEYS.progress, {}, storage);
    return (raw && typeof raw === 'object') ? raw : {};
  }

  function saveProgress(progress, storage) {
    return safeSet(KEYS.progress, progress, storage);
  }

  function loadFlag(key, fallback, storage) {
    const v = safeGet(key, null, storage);
    return typeof v === 'boolean' ? v : fallback;
  }

  function saveFlag(key, value, storage) {
    return safeSet(key, Boolean(value), storage);
  }

  /* ---------- خروجی ---------- */

  const api = {
    MAX_ALBUM_ITEMS,
    MAX_TOTAL_CHARS,
    MAX_NAME_LEN,
    KEYS,
    uid,
    sanitizeName,
    estimateSize,
    isDataImage,
    validateRecord,
    createRecord,
    canAdd,
    safeGet,
    safeSet,
    safeRemove,
    loadAlbum,
    addToAlbum,
    removeFromAlbum,
    getFromAlbum,
    loadDraft,
    saveDraft,
    loadProgress,
    saveProgress,
    loadFlag,
    saveFlag
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  }
  g.StorageCore = api;
})(typeof window !== 'undefined' ? window : globalThis);
