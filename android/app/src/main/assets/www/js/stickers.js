/* ============================================================
   stickers.js — جعبه استیکر
   - کودک می‌تواند استیکر را روی بوم بچیند (drag/click)
   - پالت رنگ هر استیکر قابل تنظیم است
   - استیکرهای جدید با کسب دستاورد باز می‌شوند
   - بند ۱۶ MasterPrompt: قابلیت ارزش‌آفرین
   ============================================================ */
(function (g) {
  'use strict';

  const HAS_DOC = typeof document !== 'undefined';

  // -------- کاتالوگ استیکرها (ico, رنگ پیش‌فرض، فقط ایکون یا متن) --------
  const STICKERS = [
    // همیشه در دسترس
    { id: 'star',        ico: '\u2B50', color: '#ffc94d', always: true,  cat: 'classic' },
    { id: 'heart',       ico: '\u2764\uFE0F', color: '#ef5350', always: true,  cat: 'classic' },
    { id: 'smile',       ico: '\uD83D\uDE0A', color: '#ffb300', always: true,  cat: 'classic' },
    { id: 'sun',         ico: '\u2600\uFE0F', color: '#fdd835', always: true,  cat: 'classic' },
    { id: 'flower',      ico: '\uD83C\uDF38', color: '#f06292', always: true,  cat: 'classic' },
    { id: 'butterfly',   ico: '\uD83E\uDD8B', color: '#ba68c8', always: true,  cat: 'classic' },
    { id: 'rainbow',     ico: '\uD83C\uDF08', color: '#26c6da', always: true,  cat: 'classic' },
    { id: 'balloon',     ico: '\uD83C\uDF88', color: '#ec407a', always: true,  cat: 'classic' },

    // بازشدنی با دستاورد
    { id: 'trophy',      ico: '\uD83C\uDFC6', color: '#ffb300', unlock: 'ten-draw',   cat: 'special' },
    { id: 'crown',       ico: '\uD83D\uDC51', color: '#ffd700', unlock: 'all-tutorials',  cat: 'special' },
    { id: 'lightbulb',   ico: '\uD83D\uDCA1', color: '#ffeb3b', unlock: 'tutorial-3', cat: 'special' },
    { id: 'sparkles',    ico: '\u2728',           color: '#ffd54f', unlock: 'first-step',  cat: 'special' },
    { id: 'palette',     ico: '\uD83C\uDFA8', color: '#ab47bc', unlock: 'first-draw', cat: 'special' },
  ];

  const STORAGE_KEY = 'fandoqi.unlockedStickers';

  let unlocked = null;
  let activeSticker = null;
  let trayEl = null;
  let btnEl = null;
  let trayTimer = null;

  function loadUnlocked() {
    if (unlocked !== null) return unlocked;
    try {
      const raw = JSON.parse(g.localStorage.getItem(STORAGE_KEY) || '{}');
      unlocked = (raw && typeof raw === 'object') ? raw : {};
    } catch (_) {
      unlocked = {};
    }
    return unlocked;
  }

  function saveUnlocked() {
    try {
      g.localStorage.setItem(STORAGE_KEY, JSON.stringify(unlocked));
    } catch (_) {}
  }

  function isUnlocked(sticker) {
    if (sticker.always) return true;
    return !!loadUnlocked()[sticker.id];
  }

  function listAvailable() {
    return STICKERS.filter(isUnlocked);
  }

  function listLocked() {
    return STICKERS.filter(function (s) { return !isUnlocked(s); });
  }

  function tryUnlock(achievementId) {
    const matching = STICKERS.filter(function (s) { return s.unlock === achievementId; });
    if (matching.length === 0) return false;
    let any = false;
    matching.forEach(function (s) {
      if (!loadUnlocked()[s.id]) {
        loadUnlocked()[s.id] = Date.now();
        any = true;
      }
    });
    if (any) {
      saveUnlocked();
      if (trayEl) renderTray();
    }
    return any;
  }

  // -------- ارتباط با موتور --------
  function selectSticker(sticker) {
    activeSticker = sticker;
    if (g.Engine && typeof g.Engine.setStickerMode === 'function') {
      g.Engine.setStickerMode(sticker);
    }
    updateActiveUI();
  }

  function deselect() {
    activeSticker = null;
    if (g.Engine && typeof g.Engine.setStickerMode === 'function') {
      g.Engine.setStickerMode(null);
    }
    updateActiveUI();
  }

  function placeStickerAt(x, y) {
    if (!activeSticker) return false;
    if (g.Engine && typeof g.Engine.placeSticker === 'function') {
      g.Engine.placeSticker(activeSticker, x, y);
      return true;
    }
    return false;
  }

  function currentSticker() { return activeSticker; }

  function updateActiveUI() {
    if (!trayEl) return;
    trayEl.querySelectorAll('.sticker-btn').forEach(function (b) {
      b.classList.toggle('is-active', activeSticker && b.dataset.id === activeSticker.id);
    });
    if (btnEl) btnEl.classList.toggle('is-active', !!activeSticker);
  }

  // -------- رنجر پالت --------
  function renderTray() {
    if (!trayEl || !HAS_DOC) return;
    trayEl.innerHTML = '';
    const avail = listAvailable();
    avail.forEach(function (s) {
      const b = document.createElement('button');
      b.type = 'button';
      b.dataset.id = s.id;
      b.className = 'sticker-btn';
      b.style.color = s.color;
      b.textContent = s.ico;
      b.title = s.id;
      b.setAttribute('aria-label', 'استیکر ' + s.id);
      b.addEventListener('click', function (e) {
        e.preventDefault();
        if (activeSticker && activeSticker.id === s.id) deselect();
        else selectSticker(Object.assign({}, s));
      });
      trayEl.appendChild(b);
    });

    // دکمه‌های قفل‌شده (برای انگیزش)
    const locked = listLocked();
    if (locked.length > 0) {
      const hint = document.createElement('span');
      hint.className = 'sticker-locked-hint';
      const rest = avail.length === 0 ? 'ابتدا یک نقاشی ذخیره کن!' : locked.length + ' استیکر قفل — با کسب دستاورد باز می‌شود';
      hint.textContent = rest;
      trayEl.appendChild(hint);
    }
    updateActiveUI();
  }

  function showTray() {
    if (!trayEl) return;
    trayEl.classList.remove('is-hidden');
    trayEl.classList.add('is-show');
    if (trayTimer) clearTimeout(trayTimer);
  }

  function hideTray() {
    if (!trayEl) return;
    trayEl.classList.remove('is-show');
    trayEl.classList.add('is-hidden');
  }

  // -------- اتصال به دکمه‌ها و رویدادها --------
  function init(opts) {
    if (!HAS_DOC) return;
    trayEl = opts.trayEl;
    btnEl = opts.toggleBtn;
    if (!trayEl) return;

    if (btnEl) {
      btnEl.addEventListener('click', function (e) {
        e.preventDefault();
        if (trayEl.classList.contains('is-hidden') || !trayEl.classList.contains('is-show')) showTray();
        else hideTray();
        renderTray();
      });
    }

    // گوش دادن به کلیک روی بوم برای چسباندن استیکر
    const board = document.getElementById('board');
    if (board) {
      board.addEventListener('click', function (e) {
        if (!activeSticker) return;
        const r = board.getBoundingClientRect();
        const x = e.clientX - r.left;
        const y = e.clientY - r.top;
        if (placeStickerAt(x, y)) {
          if (g.Sound && g.Sound.click) g.Sound.click();
          flashAt(e.clientX, e.clientY);
        }
      }, { capture: true });
    }

    // هنگام تغییر ابزار، استیکر را غیرفعال کن
    if (g.Engine && typeof g.Engine.setTool === 'function') {
      const origSetTool = g.Engine.setTool;
      g.Engine.setTool = function (t) {
        origSetTool(t);
        if (t && t !== 'sticker') deselect();
      };
    }

    // گوش به achievement: اگر unlock داشت، فعالش کن
    g.addEventListener('fandoqi-achievement-unlocked', function (e) {
      if (e && e.detail && e.detail.id && tryUnlock(e.detail.id)) {
        showTray();
        setTimeout(hideTray, 3000);
      }
    });

    renderTray();
  }

  // اعلان انفجار ذرات کوچک هنگام چسباندن
  function flashAt(x, y) {
    if (!HAS_DOC) return;
    const layer = document.getElementById('sticker-flash');
    if (!layer) return;
    const sp = document.createElement('span');
    sp.className = 'sticker-pop';
    sp.style.left = x + 'px';
    sp.style.top = y + 'px';
    sp.textContent = activeSticker ? activeSticker.ico : '\u2728';
    layer.appendChild(sp);
    setTimeout(function () { sp.remove(); }, 600);
  }

  // -------- API --------
  const api = {
    init: init,
    STICKERS: STICKERS,
    listAvailable: listAvailable,
    listLocked: listLocked,
    selectSticker: selectSticker,
    deselect: deselect,
    currentSticker: currentSticker,
    placeStickerAt: placeStickerAt,
    tryUnlock: tryUnlock,
    showTray: showTray,
    hideTray: hideTray,
    renderTray: renderTray,
    isUnlocked: isUnlocked
  };

  g.Stickers = api;
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  }
})(typeof window !== 'undefined' ? window : globalThis);
