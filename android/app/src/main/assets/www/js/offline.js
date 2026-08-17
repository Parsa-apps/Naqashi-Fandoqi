/* ============================================================
   offline.js — مدیریت آفلاین کودک‌پسند 🌰
   - ثبت Service Worker
   - تشخیص وضعیت اتصال
   - پیام‌های تشویقی آفلاین
   - مدیریت نصب PWA
   ============================================================ */
(function (g) {
  'use strict';

  const STORAGE_CORE = g.StorageCore;
  const Utils = g.Utils;

  let isOnline = true;
  try { isOnline = navigator.onLine; } catch (e) { isOnline = true; }

  let deferredPrompt = null;
  let swRegistration = null;

  const OFFLINE_MESSAGES = {
    offline: [
      '🌰 آفلاین شدی! ولی نگران نباش، همه چیز کار می‌کنه!',
      '📴 اینترنت قطع شد؟ مهم نیست! نقاشیت رو ادامه بده 🎨',
      '✈️ حالت پرواز؟ عالیه! حالا بدون حواس‌پرتی نقاشی بکش!',
      '🔋 آفلاین هستی ولی فندوقی همیشه همراهته!'
    ],
    online: [
      '🌐 دوباره آنلاینی! ولی فندوقی همیشه آفلاین هم کار می‌کنه 😉',
      '✅ اینترنت وصل شد! نقاشی‌هات امن ذخیره شدن 💾'
    ],
    installed: '🎉 فندوقی نصب شد! حالا مثل یک اپ واقعی کار می‌کنه!',
    ready: '💚 فندوقی آماده‌ست! حتی بدون اینترنت هم می‌تونی نقاشی بکشی!'
  };

  function pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  /* ---------- Service Worker ---------- */

  function registerSW() {
    if (!('serviceWorker' in navigator)) {
      console.log('[Offline] Service Worker پشتیبانی نمی‌شود');
      return Promise.resolve(null);
    }

    // اگر روی فایل لوکال هستیم (file://) SW کار نمی‌کند — طبیعی است
    if (location.protocol === 'file:') {
      console.log('[Offline] روی file:// هستیم — SW ثبت نمی‌شود، اما اپ آفلاین کار می‌کند');
      showBadge('offline-local');
      return Promise.resolve(null);
    }

    return navigator.serviceWorker.register('./sw.js', { scope: './' })
      .then((reg) => {
        swRegistration = reg;
        console.log('[Offline] SW ثبت شد', reg.scope);

        // بررسی آپدیت
        reg.addEventListener('updatefound', () => {
          const newWorker = reg.installing;
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              console.log('[Offline] نسخه جدید آماده');
              if (Utils && Utils.toast) {
                Utils.toast('✨ نسخه جدید فندوقی آماده است! صفحه را تازه کن', 'info');
              }
            }
          });
        });

        // اگر SW قبلا کنترل می‌کند، یعنی آفلاین آماده است
        if (navigator.serviceWorker.controller) {
          showBadge('ready');
        }

        // گوش دادن به کنترل شدن توسط SW
        navigator.serviceWorker.addEventListener('controllerchange', () => {
          console.log('[Offline] کنترلر تغییر کرد — آماده آفلاین');
          showBadge('ready', true);
        });

        return reg;
      })
      .catch((err) => {
        console.warn('[Offline] خطا در ثبت SW', err);
        showBadge('offline-local');
        return null;
      });
  }

  /* ---------- وضعیت اتصال ---------- */

  function wireConnectivity() {
    function updateStatus() {
      const nowOnline = navigator.onLine;
      if (nowOnline !== isOnline) {
        isOnline = nowOnline;
        if (isOnline) {
          showBadge('online');
          if (Utils && Utils.toast) Utils.toast(pick(OFFLINE_MESSAGES.online), 'success');
        } else {
          showBadge('offline');
          if (Utils && Utils.toast) Utils.toast(pick(OFFLINE_MESSAGES.offline), 'info');
        }
        // ارسال رویداد سفارشی برای سایر ماژول‌ها
        g.dispatchEvent(new CustomEvent('fandoqi:connectivity', { detail: { isOnline } }));
      }
    }

    g.addEventListener('online', updateStatus);
    g.addEventListener('offline', updateStatus);

    // بررسی اولیه
    setTimeout(updateStatus, 800);
  }

  /* ---------- بنر آفلاین کودک‌پسند ---------- */

  function ensureBadgeEl() {
    let el = document.getElementById('offline-badge');
    if (el) return el;
    el = document.createElement('div');
    el.id = 'offline-badge';
    el.className = 'offline-badge';
    el.setAttribute('aria-live', 'polite');
    document.body.appendChild(el);
    return el;
  }

  function showBadge(state, force) {
    const el = ensureBadgeEl();
    el.classList.remove('is-online', 'is-offline', 'is-ready', 'is-local');

    let text = '';
    let icon = '';
    if (state === 'offline') {
      el.classList.add('is-offline');
      icon = '📴';
      text = 'آفلاین — ولی همه چیز کار می‌کنه! 🌰';
    } else if (state === 'online') {
      el.classList.add('is-online');
      icon = '🌐';
      text = 'آنلاینی!';
      setTimeout(() => { el.classList.add('is-hidden'); }, 3000);
    } else if (state === 'ready') {
      el.classList.add('is-ready');
      icon = '💚';
      text = 'آفلاین آماده‌ست!';
      if (!force) {
        // فقط اولین بار نشان بده، بعد محو کن
        setTimeout(() => { el.classList.add('is-hidden'); }, 4000);
      }
    } else if (state === 'offline-local') {
      // وقتی از طریق فایل باز شده
      el.classList.add('is-local');
      icon = '💾';
      text = 'حالت آفلاین محلی — نقاشی‌هات ذخیره می‌شن!';
      setTimeout(() => { el.classList.add('is-hidden'); }, 5000);
    }

    el.innerHTML = `<span class="badge-ico">${icon}</span><span class="badge-txt">${text}</span>`;
    el.classList.remove('is-hidden');

    // ذخیره وضعیت
    try {
      if (STORAGE_CORE) {
        STORAGE_CORE.saveFlag('nf.v1.offlineReady', true);
      }
    } catch (e) {}
  }

  /* ---------- نصب PWA ---------- */

  function wireInstallPrompt() {
    // رویداد نصب
    g.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      deferredPrompt = e;
      console.log('[Offline] قابل نصب');
      showInstallButton();
    });

    g.addEventListener('appinstalled', () => {
      console.log('[Offline] نصب شد');
      deferredPrompt = null;
      hideInstallButton();
      if (Utils && Utils.toast) Utils.toast(OFFLINE_MESSAGES.installed, 'success');
      showBadge('ready', true);
    });
  }

  function showInstallButton() {
    let btn = document.getElementById('pwa-install-btn');
    if (btn) return;
    btn = document.createElement('button');
    btn.id = 'pwa-install-btn';
    btn.className = 'pwa-install-btn';
    btn.innerHTML = '📲 نصب فندوقی';
    btn.setAttribute('aria-label', 'نصب برنامه');
    btn.addEventListener('click', () => {
      if (!deferredPrompt) return;
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choice) => {
        console.log('[Offline] انتخاب نصب', choice.outcome);
        deferredPrompt = null;
        hideInstallButton();
      });
    });
    // اضافه به هدر
    const header = document.querySelector('.app-header');
    if (header) header.appendChild(btn);
  }

  function hideInstallButton() {
    const btn = document.getElementById('pwa-install-btn');
    if (btn) btn.remove();
  }

  /* ---------- بررسی آفلاین بودن اولیه ---------- */

  function initialCheck() {
    // اگر localStorage نشان دهد قبلا آفلاین آماده بوده
    try {
      const ready = STORAGE_CORE && STORAGE_CORE.loadFlag('nf.v1.offlineReady', false);
      if (ready) {
        setTimeout(() => showBadge('ready'), 1200);
      }
    } catch (e) {}

    // اگر از اول آفلاین است
    if (!isOnline) {
      setTimeout(() => {
        showBadge('offline');
        if (Utils && Utils.toast) Utils.toast(pick(OFFLINE_MESSAGES.offline), 'info');
      }, 1000);
    }
  }

  /* ---------- API عمومی ---------- */

  const api = {
    init: function () {
      ensureBadgeEl();
      wireConnectivity();
      wireInstallPrompt();
      initialCheck();
      return registerSW();
    },
    isOnline: function () { return isOnline; },
    isReady: function () { return !!swRegistration || location.protocol === 'file:'; },
    getRegistration: function () { return swRegistration; },
    showBadge: showBadge,
    install: function () {
      if (deferredPrompt) {
        deferredPrompt.prompt();
        return true;
      }
      return false;
    }
  };

  g.Offline = api;
})(typeof window !== 'undefined' ? window : globalThis);
