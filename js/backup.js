/* ============================================================
   backup.js — پشتیبان‌گیری و بازگردانی JSON
   - خروجی کامل: آلبوم + دستاوردها + پیشرفت آموزش + تنظیمات
   - شامل: تغییرات آینده backward-compatible
   ============================================================ */
(function (g) {
  'use strict';

  const HAS_DOC = typeof document !== 'undefined';

  const KEYS_TO_BACKUP = [
    'nf.v1.album',
    'nf.v1.progress',
    'nf.v1.sound',
    'fandoqi.achievements',
    'fandoqi.unlockedStickers',
    'fandoqi.theme'
  ];

  const KEY_ALIASES = {
    'nf.v1.album': 'album',
    'nf.v1.progress': 'progress',
    'nf.v1.sound': 'sound',
    'fandoqi.achievements': 'achievements',
    'fandoqi.unlockedStickers': 'unlockedStickers',
    'fandoqi.theme': 'theme'
  };

  function snapshot() {
    const snap = { version: '1.0', app: 'fandoqi', created: new Date().toISOString(), data: {} };
    try {
      KEYS_TO_BACKUP.forEach(function (k) {
        let raw = null;
        try { raw = g.localStorage.getItem(k); } catch (_) {}
        if (raw == null) { snap.data[KEY_ALIASES[k] || k] = null; return; }
        try { snap.data[KEY_ALIASES[k] || k] = JSON.parse(raw); }
        catch (_) { snap.data[KEY_ALIASES[k] || k] = raw; }
      });
    } catch (_) {}
    return snap;
  }

  function exportToFile() {
    const data = JSON.stringify(snapshot(), null, 2);
    const filename = 'fandoqi-backup-' + new Date().toISOString().slice(0, 10) + '.json';
    if (g.Utils && g.Utils.download) {
      g.Utils.download('data:application/json;charset=utf-8,' + encodeURIComponent(data), filename);
      return true;
    }
    try {
      const a = document.createElement('a');
      a.href = 'data:application/json;charset=utf-8,' + encodeURIComponent(data);
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      return true;
    } catch (_) { return false; }
  }

  function applySnapshot(snap) {
    if (!snap || !snap.data) return { ok: false, count: 0 };
    let count = 0;
    Object.keys(snap.data).forEach(function (alias) {
      let fullKey = null;
      Object.keys(KEY_ALIASES).forEach(function (k) { if (KEY_ALIASES[k] === alias) fullKey = k; });
      if (!fullKey) return;
      try {
        const v = snap.data[alias];
        if (v === null || typeof v === 'undefined') {
          try { g.localStorage.removeItem(fullKey); } catch (_) {}
        } else {
          try { g.localStorage.setItem(fullKey, JSON.stringify(v)); count++; } catch (_) {}
        }
      } catch (_) {}
    });
    return { ok: true, count: count };
  }

  function restoreFromText(jsonText) {
    let snap;
    try { snap = JSON.parse(String(jsonText)); }
    catch (_) { return { ok: false, reason: 'parse' }; }
    if (!snap || !snap.data || snap.app !== 'fandoqi') return { ok: false, reason: 'format' };
    return applySnapshot(snap);
  }

  function restoreFromFile(file) {
    if (!file || !file.text) return Promise.resolve({ ok: false, reason: 'nofile' });
    return file.text().then(function (t) {
      const applied = restoreFromText(t);
      applied.fileName = file.name;
      return applied;
    });
  }

  function pickFile() {
    if (!HAS_DOC) return Promise.resolve(null);
    return new Promise(function (resolve) {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'application/json,.json';
      input.style.display = 'none';
      input.addEventListener('change', function () {
        const f = input.files && input.files[0];
        document.body.removeChild(input);
        resolve(f || null);
      });
      input.click();
    });
  }

  async function restoreInteractive() {
    const f = await pickFile();
    if (!f) return { ok: false, reason: 'cancelled' };
    return restoreFromFile(f);
  }

  const api = {
    KEYS_TO_BACKUP: KEYS_TO_BACKUP,
    snapshot: snapshot,
    exportToFile: exportToFile,
    restoreFromText: restoreFromText,
    restoreFromFile: restoreFromFile,
    restoreInteractive: restoreInteractive,
    pickFile: pickFile
  };

  g.Backup = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis);
