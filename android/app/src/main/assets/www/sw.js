/* ============================================================
   sw.js — Service Worker آفلاین برای کودکان 🌰
   استراتژی: Cache First + Network Fallback
   نسخه: v3.0.0 — تمام فایل‌های پروژهٔ فندوقی در pre-cache
   ============================================================ */

const CACHE_NAME = 'fandoqi-v3-offline-kids';
const OFFLINE_URL = './index.html';

// لیست تمام فایل‌های ضروری برای کار آفلاین — v3 with ALL new modules
const PRECACHE_URLS = [
  './',
  './index.html',
  './manifest.json',
  './css/style.css',
  './css/fonts.css',
  './css/about.css',
  './css/splash.css',
  './css/parent-gate.css',
  './css/theme.css',
  './css/transitions.css',
  './css/save-anim.css',
  './css/stickers.css',
  './css/onboarding.css',
  './css/settings.css',
  './css/templates.css',
  './js/storage-core.js',
  './js/utils.js',
  './js/sound.js',
  './js/engine.js',
  './js/album.js',
  './js/tutorials.js',
  './js/parent-gate.js',
  './js/theme.js',
  './js/achievements.js',
  './js/offline.js',
  './js/splash.js',
  './js/about.js',
  './js/stickers.js',
  './js/save-anim.js',
  './js/onboarding.js',
  './js/settings.js',
  './js/templates.js',
  './js/app.js',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/apple-touch-icon.png',
  './icons/favicon-32.png'
];

// نصب — کش کردن همه چیز
self.addEventListener('install', (event) => {
  console.log('[SW] نصب نسخه', CACHE_NAME);
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] کش کردن فایل‌های آفلاین (' + PRECACHE_URLS.length + ' مورد)');
      return cache.addAll(PRECACHE_URLS);
    }).then(() => {
      // فعال‌سازی فوری بدون منتظر ماندن
      return self.skipWaiting();
    })
  );
});

// فعال‌سازی — پاک کردن کش‌های قدیمی
self.addEventListener('activate', (event) => {
  console.log('[SW] فعال‌سازی', CACHE_NAME);
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((k) => k !== CACHE_NAME).map((k) => {
          console.log('[SW] حذف کش قدیمی', k);
          return caches.delete(k);
        })
      );
    }).then(() => self.clients.claim())
  );
});

// درخواست‌ها — Cache First برای کودکان (سریع‌ترین و آفلاین‌ترین)
self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // فقط درخواست‌های هم‌دامنه را کش می‌کنیم
  if (url.origin !== location.origin) {
    return;
  }

  // برای فایل‌های POST یا درخواست‌های غیر GET، مستقیم از شبکه
  if (req.method !== 'GET') {
    return;
  }

  // استراتژی: ابتدا کش، سپس شبکه
  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) {
        // اگر در کش موجود بود، فورا برگردان، و در پس‌زمینه به‌روزرسانی کن
        const fetchPromise = fetch(req).then((networkRes) => {
          if (networkRes && networkRes.status === 200) {
            caches.open(CACHE_NAME).then((cache) => cache.put(req, networkRes.clone()));
          }
          return networkRes;
        }).catch(() => { /* آفلاین — اشکالی ندارد */ });

        // برای فایل‌های html، شبکه را هم امتحان کن ولی کش را سریع بده
        if (req.headers.get('accept')?.includes('text/html')) {
          return fetch(req).then((networkRes) => {
            if (networkRes.ok) {
              caches.open(CACHE_NAME).then((c) => c.put(req, networkRes.clone()));
              return networkRes;
            }
            return cached;
          }).catch(() => cached);
        }

        return cached;
      }

      // اگر در کش نبود، از شبکه بیاور و کش کن
      return fetch(req).then((networkRes) => {
        if (!networkRes || networkRes.status !== 200) {
          return networkRes;
        }
        const copy = networkRes.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
        return networkRes;
      }).catch(() => {
        // اگر آفلاین و در کش هم نبود، برای صفحات html صفحه اصلی را بده
        if (req.headers.get('accept')?.includes('text/html')) {
          return caches.match(OFFLINE_URL);
        }
        // برای سایر فایل‌ها، خطا
        return new Response('آفلاین هستی! اما نگران نباش، همه چیز قبلا ذخیره شده 🌰', {
          status: 503,
          headers: { 'Content-Type': 'text/plain; charset=utf-8' }
        });
      });
    })
  );
});

// پیام‌ها از کلاینت
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_NAME });
  }
});
