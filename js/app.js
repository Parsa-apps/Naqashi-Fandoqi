/* ============================================================
   app.js — اتصال همهٔ ماژول‌ها، ناوبری، مودال‌ها و رویدادها
   ============================================================ */
(function (g) {
  'use strict';

  const U = g.Utils;
  const SC = g.StorageCore;
  const Engine = g.Engine;
  const Album = g.Album;
  const Tutorials = g.Tutorials;
  const Sound = g.Sound;
  const Offline = g.Offline;

  /* ---------- ناوبری تب‌ها ---------- */

  function switchTab(name, opts) {
    const options = opts || {};
    const list = ['draw', 'album', 'learn'];
    if (list.indexOf(name) === -1) name = 'draw';
    list.forEach(function (n) {
      const tab = U.$('#tab-' + n);
      const view = U.$('#view-' + n);
      if (!tab || !view) return;
      const active = n === name;
      tab.classList.toggle('is-active', active);
      tab.setAttribute('aria-selected', active ? 'true' : 'false');
      view.classList.toggle('is-hidden', !active);
    });
    if (name === 'album') Album.refresh();
    if (!options.silent) Sound.click();
    // به‌روزرسانی hash برای PWA shortcuts آفلاین
    try {
      if (history && history.replaceState) {
        history.replaceState(null, '', '#' + name);
      } else {
        location.hash = name;
      }
    } catch (e) {}
    // ذخیره آخرین تب برای بازگشت آفلاین
    try { SC.safeSet(SC.KEYS.lastTab, name); } catch (e) {}
  }

  function getInitialTab() {
    try {
      const h = (location.hash || '').replace('#', '').trim();
      if (['draw', 'album', 'learn'].indexOf(h) !== -1) return h;
      const saved = SC.safeGet(SC.KEYS.lastTab, null);
      if (saved && ['draw', 'album', 'learn'].indexOf(saved) !== -1) return saved;
    } catch (e) {}
    return 'draw';
  }

  /* ---------- ابزارها ---------- */

  function wireTools() {
    U.$$('.tool-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        U.$$('.tool-btn').forEach(function (b) { b.classList.remove('is-active'); });
        btn.classList.add('is-active');
        // میکرو تعامل: پالس کوتاه
        btn.classList.remove('is-clicked');
        void btn.offsetWidth;
        btn.classList.add('is-clicked');
        setTimeout(function () { btn.classList.remove('is-clicked'); }, 400);
        Engine.setTool(btn.dataset.tool);
        if (Engine.isMagicTool(btn.dataset.tool)) Sound.magic();
        else Sound.tool();
      });
    });
  }

  function wireColors() {
    const swatches = U.$('#swatches');
    const custom = U.$('#custom-color');
    swatches.addEventListener('click', function (e) {
      const sw = e.target.closest('.swatch');
      if (!sw) return;
      U.$$('.swatch').forEach(function (s) { s.classList.remove('is-active'); });
      sw.classList.add('is-active');
      Engine.setColor(sw.dataset.color);
      custom.value = sw.dataset.color;
      Sound.click();
    });
    custom.addEventListener('input', function () {
      U.$$('.swatch').forEach(function (s) { s.classList.remove('is-active'); });
      Engine.setColor(custom.value);
    });
  }

  function wireSize() {
    const slider = U.$('#size-slider');
    const label = U.$('#size-label');
    slider.addEventListener('input', function () {
      const v = Number(slider.value);
      Engine.setSize(v);
      label.textContent = 'ضخامت: ' + U.toFaDigits(v);
    });
  }

  /* ---------- تاریخچه و اکشن‌ها ---------- */

  function updateHistoryButtons(state) {
    U.$('#btn-undo').disabled = !state.canUndo;
    U.$('#btn-redo').disabled = !state.canRedo;
    Engine.saveDraftDebounced();
  }

  function wireActions() {
    U.$('#btn-undo').addEventListener('click', function () { Engine.undo(); Sound.click(); });
    U.$('#btn-redo').addEventListener('click', function () { Engine.redo(); Sound.click(); });

    U.$('#btn-clear').addEventListener('click', function () {
      if (Engine.isEmpty()) {
        U.toast('بوم که خالی است! اول چیزی بکش 🎨', 'info');
        return;
      }
      confirmWithGate('🧹 همهٔ نقاشی پاک شود؟').then(function (yes) {
        if (!yes) return;
        Engine.clear();
        U.toast('بوم پاک شد؛ حالا یک شاهکار جدید بکش! 🎨', 'info');
      });
    });

    U.$('#btn-download').addEventListener('click', function () {
      if (Engine.isEmpty()) {
        U.toast('اول یک نقاشی بکش بعد دانلودش کن! ⬇️', 'error');
        return;
      }
      U.download(Engine.exportDataUrl(), 'shahkar-naqashi.png');
      Sound.save();
      U.toast('نقاشی دانلود شد! 🎉', 'success');
    });

    U.$('#btn-save').addEventListener('click', openSaveModal);
  }

  /* ---------- مودال ذخیره ---------- */

  function openSaveModal() {
    if (Engine.isEmpty()) {
      U.toast('اول یک نقاشی بکش بعد ذخیره‌اش کن! 🎨', 'error');
      Sound.error();
      return;
    }
    const nameInput = U.$('#save-name');
    nameInput.value = 'شاهکار ' + U.formatDateFa(Date.now());
    U.$('#save-preview').src = Engine.exportThumb(240);
    showModal('save-modal');
    nameInput.focus();
    nameInput.select();
  }

  function wireSaveModal() {
    U.$('#save-confirm').addEventListener('click', function () {
      const name = SC.sanitizeName(U.$('#save-name').value);
      const dataUrl = Engine.exportDataUrl(1100);
      const thumb = Engine.exportThumb(300);
      const res = Album.add(name, dataUrl, thumb);
      if (res.ok) {
        hideModal('save-modal');
        Sound.save();
        // اگر ماژول SaveAnim لود شده، نمایش پیش‌نمایش قشنگ با ذرات طلایی
        if (g.SaveAnim && g.SaveAnim.show) {
          const nth = res.album.length;
          g.SaveAnim.show({
            name: name,
            thumb: thumb,
            sub: 'شاهکار شماره\u2060\u200B ' + nth + ' \u062F\u0631 \u0622\u0644\u0628\u0648\u0645\u062A! \uD83C\uDF31'
          });
        } else {
          U.toast('ثبت شد!', 'success');
        }
        if (g.Achievements && g.Achievements.checkAlbumSize && g.Album && typeof g.Album.list === 'function') {
          g.Achievements.checkAlbumSize(g.Album.list().length);
        }
      } else if (res.reason === 'full') {
        Sound.error();
        U.toast('آلبوم پر است! چند نقاشی قدیمی را حذف کن 🗑️', 'error');
      } else if (res.reason === 'space') {
        Sound.error();
        U.toast('حافظهٔ مرورگر پر است؛ یک نقاشی قدیمی را حذف کن 😢', 'error');
      } else {
        Sound.error();
        U.toast('ذخیره نشد! دوباره تلاش کن 😢', 'error');
      }
    });
    U.$('#save-cancel').addEventListener('click', function () { hideModal('save-modal'); });
    U.$('#save-name').addEventListener('keydown', function (e) {
      if (e.key === 'Enter') U.$('#save-confirm').click();
    });
  }

  /* ---------- مودال نمایش ---------- */

  let viewingRec = null;

  function openViewModal(rec) {
    viewingRec = rec;
    U.$('#view-name').textContent = rec.name;
    U.$('#view-date').textContent = U.formatDateFa(rec.date);
    U.$('#view-date').dateTime = new Date(rec.date).toISOString();
    U.$('#view-img').src = rec.dataUrl;
    showModal('view-modal');
  }

  function wireViewModal() {
    U.$('#view-close').addEventListener('click', function () { hideModal('view-modal'); });
    U.$('#view-download').addEventListener('click', function () {
      if (!viewingRec) return;
      U.download(viewingRec.dataUrl, viewingRec.name + '.png');
      Sound.save();
    });
    U.$('#view-edit').addEventListener('click', function () {
      if (!viewingRec) return;
      hideModal('view-modal');
      Engine.loadImage(viewingRec.dataUrl, false);
      switchTab('draw');
      U.toast('حالا ادامهٔ نقاشی‌ات را بکش! 🖌️', 'success');
    });
    U.$('#view-delete').addEventListener('click', function () {
      if (!viewingRec) return;
      const rec = viewingRec;
      hideModal('view-modal');
      confirmWithGate('🗑️ «' + rec.name + '» برای همیشه حذف شود؟').then(function (yes) {
        if (!yes) return;
        Album.remove(rec.id);
        Sound.error();
        U.toast('نقاشی حذف شد', 'info');
      });
    });
  }

  /* ---------- مودال تأیید ---------- */

  let confirmResolver = null;

  function confirmDialog(text) {
    U.$('#confirm-text').textContent = text;
    showModal('confirm-modal');
    return new Promise(function (resolve) {
      confirmResolver = resolve;
    });
  }

  // تأیید حساس — ابتدا دروازهٔ والدین با سوال ریاضی، سپس تأیید
  function confirmWithGate(text) {
    if (g.ParentGate && typeof g.ParentGate.open === 'function') {
      return g.ParentGate.open().then(function (passed) {
        if (!passed) return false;
        return confirmDialog(text);
      });
    }
    return confirmDialog(text);
  }

  function wireConfirmModal() {
    const finish = function (yes) {
      hideModal('confirm-modal');
      if (confirmResolver) {
        confirmResolver(yes);
        confirmResolver = null;
      }
    };
    U.$('#confirm-yes').addEventListener('click', function () { finish(true); });
    U.$('#confirm-no').addEventListener('click', function () { finish(false); });
  }

  /* ---------- ابزار مودال ---------- */

  function showModal(id) {
    U.$('#' + id).classList.remove('is-hidden');
  }

  function hideModal(id) {
    U.$('#' + id).classList.add('is-hidden');
  }

  function wireModalBackdrops() {
    U.$$('.modal-backdrop').forEach(function (backdrop) {
      backdrop.addEventListener('mousedown', function (e) {
        if (e.target === backdrop) {
          if (backdrop.id === 'confirm-modal' && confirmResolver) confirmResolver(false);
          confirmResolver = null;
          backdrop.classList.add('is-hidden');
        }
      });
    });
  }

  /* ---------- صدا ---------- */

  function wireSound() {
    const btn = U.$('#sound-toggle');
    const apply = function () {
      const on = Sound.isEnabled();
      btn.textContent = on ? '🔊' : '🔇';
      btn.setAttribute('aria-pressed', on ? 'false' : 'true');
      btn.setAttribute('aria-label', on ? 'قطع صدا' : 'وصل صدا');
    };
    btn.addEventListener('click', function () {
      Sound.setEnabled(!Sound.isEnabled());
      SC.saveFlag(SC.KEYS.sound, Sound.isEnabled());
      if (Sound.isEnabled()) Sound.click();
      apply();
    });
    Sound.setEnabled(SC.loadFlag(SC.KEYS.sound, true));
    apply();
  }

  /* ---------- میان‌برهای صفحه‌کلید ---------- */

  function wireKeyboard() {
    g.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        const open = U.$$('.modal-backdrop').filter(function (b) { return !b.classList.contains('is-hidden'); });
        if (open.length) {
          if (confirmResolver) { confirmResolver(false); confirmResolver = null; }
          open.forEach(function (b) { b.classList.add('is-hidden'); });
          return;
        }
      }
      const tag = (e.target.tagName || '').toLowerCase();
      if (tag === 'input' || tag === 'textarea') return;
      const mod = e.ctrlKey || e.metaKey;
      if (mod && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        if (e.shiftKey) Engine.redo();
        else Engine.undo();
      } else if (mod && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        Engine.redo();
      } else if (e.key === '[') {
        const slider = U.$('#size-slider');
        slider.value = U.clamp(Number(slider.value) - 4, 2, 64);
        slider.dispatchEvent(new Event('input', { bubbles: true }));
      } else if (e.key === ']') {
        const slider = U.$('#size-slider');
        slider.value = U.clamp(Number(slider.value) + 4, 2, 64);
        slider.dispatchEvent(new Event('input', { bubbles: true }));
      }
    });
  }

  /* ---------- شروع ---------- */

  function wireOffline() {
    if (!Offline) return;
    // پیام‌های آفلاین کودک‌پسند با گوش دادن به رویداد اتصال
    g.addEventListener('fandoqi:connectivity', function (e) {
      const hint = U.$('#offline-hint');
      if (!hint) return;
      if (e.detail && e.detail.isOnline) {
        hint.textContent = '🌐 آنلاین';
        hint.style.background = 'rgba(232,247,238,0.9)';
        hint.style.color = '#2e7d32';
        setTimeout(function () {
          hint.textContent = '💚 آفلاین';
          hint.style.background = '';
          hint.style.color = '';
        }, 3500);
      } else {
        hint.textContent = '📴 آفلاین';
        hint.style.background = 'rgba(255,240,243,0.9)';
        hint.style.color = '#8a4a2b';
      }
    });

    // تلاش برای ثبت SW اگر قبلا در index.html ثبت نشده
    try {
      if (!Offline.getRegistration()) {
        Offline.init();
      }
    } catch (e) {}
  }

  function init() {
    wireSound();
    wireOffline();
    Engine.init(U.$('#board'));
    Engine.setHistoryListener(updateHistoryButtons);

    wireTools();
    wireColors();
    wireSize();
    wireActions();
    wireSaveModal();
    wireViewModal();
    wireConfirmModal();
    wireModalBackdrops();
    wireKeyboard();

    // تب اولیه از hash یا ذخیره‌شده — برای PWA آفلاین
    const initial = getInitialTab();

    U.$$('.tab').forEach(function (tab) {
      tab.addEventListener('click', function () {
        switchTab(tab.id.replace('tab-', ''));
      });
    });
    // سوئیچ اولیه بدون صدا
    switchTab(initial, { silent: true });

    Album.init({
      gridEl: U.$('#album-grid'),
      emptyEl: U.$('#album-empty'),
      callbacks: {
        view: openViewModal,
        download: function (rec) {
          U.download(rec.dataUrl, rec.name + '.png');
          Sound.save();
          U.toast('نقاشی دانلود شد! 🎉', 'success');
        },
        edit: function (rec) {
          Engine.loadImage(rec.dataUrl, false);
          switchTab('draw');
          U.toast('حالا ادامهٔ نقاشی‌ات را بکش! 🖌️', 'success');
        },
        delete: function (rec) {
          confirmWithGate('🗑️ «' + rec.name + '» برای همیشه حذف شود؟').then(function (yes) {
            if (!yes) return;
            Album.remove(rec.id);
            U.toast('نقاشی حذف شد', 'info');
          });
        }
      }
    });

    Tutorials.init({
      learnHome: U.$('#learn-home'),
      learnDetail: U.$('#learn-detail'),
      lessonGrid: U.$('#lesson-grid'),
      tipsGrid: U.$('#tips-grid'),
      lessonBack: U.$('#lesson-back'),
      lessonEmoji: U.$('#lesson-emoji'),
      lessonTitle: U.$('#lesson-title'),
      lessonLevel: U.$('#lesson-level'),
      stepIndicator: U.$('#step-indicator'),
      stepSvg: U.$('#step-svg'),
      stepText: U.$('#step-text'),
      stepPrev: U.$('#step-prev'),
      stepNext: U.$('#step-next'),
      stepDone: U.$('#step-done'),
      lessonDone: U.$('#lesson-done')
    });

    g.addEventListener('pointerdown', function () { Sound.unlock(); }, { once: true });

    // فعال‌سازی «دربارهٔ ما» + دستاوردها + استیکرها + Onboarding
    if (g.About && g.About.init) g.About.init();
    if (g.Stickers && g.Stickers.init) {
      g.Stickers.init({
        trayEl: U.$('#sticker-tray'),
        toggleBtn: U.$('#sticker-toggle')
      });
    }
    if (g.Achievements && g.Achievements.checkInstalled && matchMedia('(display-mode: standalone)').matches) {
      g.Achievements.checkInstalled();
    }
    // خوش‌آمدگویی فقط در اولین اجرا (اگر دیده نشده و آلبوم کاملاً خالی است)
    try {
      if (g.Onboarding && typeof g.Onboarding.show === 'function' && !g.Onboarding.isSeen()) {
        setTimeout(function () {
          if (Album.list().length === 0) g.Onboarding.show();
        }, 600);
      }
    } catch (_) {}

    // بازگرداندن پیش‌نویس نیمه‌کاره
    const restored = Engine.tryRestoreDraft();
    if (restored) {
      setTimeout(function () {
        U.toast('نقاشی قبلی‌ات برگشت! ادامه‌اش را بکش 🎨', 'success');
      }, 400);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})(typeof window !== 'undefined' ? window : globalThis);
