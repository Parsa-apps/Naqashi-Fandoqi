/* ============================================================
   settings.js — پنل تنظیمات فندوقی
   - کنترل صدا، تم، حجم، دستاوردها، بازنشانی اطلاعات
   ============================================================ */
(function (g) {
  'use strict';

  const HAS_DOC = typeof document !== 'undefined';

  let el = null;
  let cb = {};

  function open(opts) {
    if (!HAS_DOC) return;
    if (!el) ensureInit();
    if (!el) return;
    render();
    el.classList.remove('is-hidden');
  }

  function close() {
    if (!el) return;
    el.classList.add('is-hidden');
  }

  function isOpen() {
    if (!el) return false;
    return !el.classList.contains('is-hidden');
  }

  function ensureInit() {
    if (!HAS_DOC) return;
    el = document.getElementById('settings-modal');
    if (!el) return;
    wireEvents();
    render();
  }

  function render() {
    if (!el) return;
    // صدا
    const soundCheck = el.querySelector('#set-sound');
    if (soundCheck) soundCheck.checked = g.Sound ? g.Sound.isEnabled() : true;
    // حجم
    const vol = el.querySelector('#set-volume');
    const volNum = el.querySelector('#set-volume-num');
    const curVol = g.Sound && g.Sound.getVolume ? g.Sound.getVolume() : 1;
    if (vol) vol.value = curVol;
    if (volNum) volNum.textContent = Math.round(curVol * 100) + '%';
    // تم
    const themeSelect = el.querySelector('#set-theme');
    if (themeSelect && g.Theme && g.Theme.current) {
      themeSelect.value = g.Theme.current();
    }
    // دکمه‌های toggle
    el.querySelectorAll('.settings-toggle').forEach(function (tg) {
      const field = tg.dataset.field;
      if (!field) return;
      if (field === 'sound') tg.classList.toggle('is-on', !!(g.Sound && g.Sound.isEnabled()));
      if (field === 'theme') tg.classList.toggle('is-on', !!(g.Theme && g.Theme.current() === 'dark'));
      if (field === 'music') tg.classList.toggle('is-on', !!(g.Music && g.Music.isEnabled()));
      if (field === 'music') tg.classList.toggle('is-on', !!(g.Music && g.Music.isEnabled()));
    });
    // گالری دستاوردها
    renderAchievements();
  }

  function renderAchievements() {
    const gal = el && el.querySelector('.gal-ach-list');
    if (!gal) return;
    gal.innerHTML = '';
    if (!g.Achievements || !g.Achievements.CATALOG) return;
    const CATALOG = g.Achievements.CATALOG;
    const unlocked = (g.Achievements.list && g.Achievements.list()) || [];
    const unlockedIds = {};
    unlocked.forEach(function (u) { unlockedIds[u.id] = true; });
    Object.keys(CATALOG).forEach(function (id) {
      const def = CATALOG[id];
      const item = document.createElement('div');
      item.className = 'gal-ach' + (unlockedIds[id] ? '' : ' is-locked');
      item.title = def.title + ' — ' + def.sub;
      const ico = document.createElement('span');
      ico.className = 'gal-ico';
      ico.textContent = def.ico;
      const name = document.createElement('span');
      name.className = 'gal-name';
      name.textContent = def.title;
      item.appendChild(ico);
      item.appendChild(name);
      gal.appendChild(item);
    });
  }

  function wireEvents() {
    if (!el) return;
    const closeBtn = el.querySelector('#settings-close');
    if (closeBtn) closeBtn.addEventListener('click', close);

    el.addEventListener('mousedown', function (e) {
      if (e.target === el) close();
    });

    // toggle ها
    el.querySelectorAll('.settings-toggle').forEach(function (tg) {
      tg.addEventListener('click', function () {
        const field = tg.dataset.field;
        if (field === 'sound' && g.Sound) {
          g.Sound.setEnabled(!g.Sound.isEnabled());
          if (g.StorageCore) g.StorageCore.saveFlag(g.StorageCore.KEYS.sound, g.Sound.isEnabled());
          tg.classList.toggle('is-on', g.Sound.isEnabled());
          render();
        }
        if (field === 'theme' && g.Theme) {
          g.Theme.toggle();
          tg.classList.toggle('is-on', g.Theme.current() === 'dark');
          render();
        }
        if (field === 'music' && g.Music) {
          g.Music.toggle();
          tg.classList.toggle('is-on', g.Music.isEnabled());
          if (g.Utils && g.Utils.toast) {
            g.Utils.toast(g.Music.isEnabled() ? 'موسیقی آرام پخش‌سازی' : 'موسیقی خاموش شد', 'info');
          }
        }
        if (field === 'music' && g.Music) {
          g.Music.toggle();
          tg.classList.toggle('is-on', g.Music.isEnabled());
          if (g.Utils && g.Utils.toast) {
            g.Utils.toast(g.Music.isEnabled() ? 'موزیک آرام پاکسازی' : 'موزیک خاموش شد', 'info');
          }
        }
      });
    });

    // تغییر تم از select
    const themeSelect = el.querySelector('#set-theme');
    if (themeSelect && g.Theme) {
      themeSelect.addEventListener('change', function () {
        if (themeSelect.value !== g.Theme.current()) g.Theme.toggle();
      });
    }

    // حجم صدا
    const vol = el.querySelector('#set-volume');
    if (vol && g.Sound) {
      vol.addEventListener('input', function () {
        const v = parseFloat(vol.value);
        g.Sound.setVolume(v);
        const num = el.querySelector('#set-volume-num');
        if (num) num.textContent = Math.round(v * 100) + '%';
        if (typeof g.Sound.click === 'function' && v > 0) g.Sound.click();
      });
    }

    // بازنشانی همهٔ داده‌ها
    const resetBtn = el.querySelector('#btn-reset-all');
    if (resetBtn) {
      resetBtn.addEventListener('click', function () {
        if (g.ParentGate && typeof g.ParentGate.open === 'function') {
          g.ParentGate.open().then(function (passed) {
            if (passed) doReset();
          });
        } else {
          doReset();
        }
      });
    }

    // بازنشانی onboarding
    const onboardResetBtn = el.querySelector('#btn-reset-onboard');
    if (onboardResetBtn) {
      onboardResetBtn.addEventListener('click', function () {
        if (g.Onboarding && typeof g.Onboarding.resetSeen === 'function') {
          g.Onboarding.resetSeen();
          if (g.Utils && g.Utils.toast) g.Utils.toast('\u062E\u0648\u0634 \u0622\u0645\u062F\u06AF\u0648\u06CC \u062F\u0648\u0628\u0627\u0631\u0647 \u062E\u0648\u0627\u0647\u062F \u0634\u062F!', 'success');
        }
      });
    }

    // سفر به استیکرها
    const backupBtn = el.querySelector('#btn-backup-all');
    if (backupBtn) {
      backupBtn.addEventListener('click', function () {
        if (g.Backup && typeof g.Backup.exportToFile === 'function') {
          g.Backup.exportToFile();
          if (g.Utils && g.Utils.toast) g.Utils.toast('\u067e\u0634\u062a\u06cc\u0628\u0627\u0646 \u0633\u0627\u062e\u062a\u0647 \u0634\u062f! \u0628\u0631\u0627\u06cc \u0627\u0646\u062a\u0642\u0627\u0644 \u062a\u0645\u0627\u0645 \u0634\u062f \uD83D\uDCBE', 'success');
        }
      });
    }
    const restoreBtn = el.querySelector('#btn-restore-all');
    if (restoreBtn) {
      restoreBtn.addEventListener('click', function () {
        if (!g.Backup || typeof g.Backup.restoreInteractive !== 'function') return;
        g.Backup.restoreInteractive().then(function (res) {
          if (!res || !res.ok) {
            if (res && res.reason !== 'cancelled' && g.Utils && g.Utils.toast) {
              g.Utils.toast('فایل پشتیبان نامعتبر بود', 'error');
            }
            return;
          }
          if (res.count > 0 && g.Utils && g.Utils.toast) {
            g.Utils.toast(res.count + ' مورد بازگردانی شد. صفحه رفرش می‌شود...', 'success');
          }
          setTimeout(function () { g.location.reload(); }, 1200);
        });
      });
    }
    const stickersBtn = el.querySelector('#btn-show-stickers');
    if (stickersBtn) {
      stickersBtn.addEventListener('click', function () {
        close();
        if (g.Stickers && typeof g.Stickers.showTray === 'function') {
          setTimeout(function () { g.Stickers.showTray(); }, 250);
        }
      });
    }
  }

  function doReset() {
    try {
      ['nf.v1.album', 'nf.v1.draft', 'nf.v1.progress', 'fandoqi.achievements', 'fandoqi.unlockedStickers', 'fandoqi.onboarded', 'fandoqi.theme'].forEach(function (k) {
        if (g.localStorage) g.localStorage.removeItem(k);
      });
      if (g.Engine && typeof g.Engine.clear === 'function') g.Engine.clear();
      if (g.Album && typeof g.Album.refresh === 'function') g.Album.refresh();
      if (g.Achievements && typeof g.Achievements.renderTray === 'function') g.Achievements.renderTray();
      // رنگ پیش‌فرض
      if (g.Theme && typeof g.Theme.apply === 'function') g.Theme.apply('light', true);
      if (g.Utils && g.Utils.toast) g.Utils.toast('\u0647\u0645\u0647 \u0686\u06CC\u0632 \u0628\u0647 \u062D\u0627\u0644 \u0627\u0648\u0644\u06CC\u0647 \u0628\u0631\u06AF\u0634\u062A! \uD83C\uDF31', 'success');
      close();
      setTimeout(function () { g.location.reload(); }, 800);
    } catch (_) {}
  }

  if (HAS_DOC && document.readyState !== 'loading') {
    // صبر کن تا Splash.js لود بشه و سرویس‌ها آماده بشن
    setTimeout(ensureInit, 50);
  } else if (HAS_DOC) {
    document.addEventListener('DOMContentLoaded', function () { setTimeout(ensureInit, 50); }, { once: true });
  }

  const api = { open: open, close: close, isOpen: isOpen, render: render, ensureInit: ensureInit };

  g.Settings = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis);
