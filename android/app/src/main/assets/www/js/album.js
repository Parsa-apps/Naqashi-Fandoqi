/* ============================================================
   album.js — آلبوم شاهکارها
   نمایش شبکه‌ای، افزودن، حذف، دانلود و ادامهٔ نقاشی
   ============================================================ */
(function (g) {
  'use strict';

  const SC = g.StorageCore;
  const U = g.Utils;

  let gridEl = null;
  let emptyEl = null;
  let callbacks = {};
  let album = [];

  function refresh() {
    album = SC.loadAlbum();
    gridEl.innerHTML = '';
    const isEmpty = album.length === 0;
    emptyEl.classList.toggle('is-hidden', !isEmpty);
    gridEl.classList.toggle('is-hidden', isEmpty);
    if (isEmpty) return;
    album.forEach(renderCard);
  }

  function renderCard(rec) {
    const card = document.createElement('article');
    card.className = 'album-card';
    card.dataset.id = rec.id;

    const img = document.createElement('img');
    img.className = 'thumb';
    img.src = rec.thumb;
    img.alt = 'نقاشی: ' + rec.name;
    img.loading = 'lazy';

    const info = document.createElement('div');
    info.className = 'card-info';
    const title = document.createElement('h3');
    title.textContent = rec.name; // textContent → بدون خطر XSS
    const time = document.createElement('time');
    time.dateTime = new Date(rec.date).toISOString();
    time.textContent = U.formatDateFa(rec.date);
    info.appendChild(title);
    info.appendChild(time);

    const actions = document.createElement('div');
    actions.className = 'card-actions';
    const defs = [
      ['view', '👁️', 'نمایش بزرگ'],
      ['download', '⬇️', 'دانلود'],
      ['edit', '🖌️', 'ادامهٔ نقاشی'],
      ['delete', '🗑️', 'حذف']
    ];
    defs.forEach(function (d) {
      const b = document.createElement('button');
      b.type = 'button';
      b.dataset.act = d[0];
      b.textContent = d[1];
      b.title = d[2];
      b.setAttribute('aria-label', d[2]);
      actions.appendChild(b);
    });

    card.appendChild(img);
    card.appendChild(info);
    card.appendChild(actions);
    gridEl.appendChild(card);
  }

  function onGridClick(e) {
    const btn = e.target.closest('[data-act]');
    if (!btn || !gridEl.contains(btn)) return;
    const card = btn.closest('.album-card');
    if (!card) return;
    const rec = SC.getFromAlbum(card.dataset.id);
    if (!rec) return;
    const act = btn.dataset.act;
    if (callbacks[act]) callbacks[act](rec);
  }

  function add(name, dataUrl, thumb) {
    const rec = SC.createRecord(name, Date.now(), dataUrl, thumb);
    if (!SC.validateRecord(rec)) return { ok: false, reason: 'bad' };
    const res = SC.addToAlbum(rec);
    if (res.ok) {
      album = res.album;
      refresh();
    }
    return res;
  }

  function remove(id) {
    const res = SC.removeFromAlbum(id);
    if (res.ok) {
      album = res.album;
      refresh();
    }
    return res;
  }

  function init(opts) {
    gridEl = opts.gridEl;
    emptyEl = opts.emptyEl;
    callbacks = opts.callbacks || {};
    gridEl.addEventListener('click', onGridClick);
    refresh();
  }

  g.Album = {
    init: init,
    refresh: refresh,
    add: add,
    remove: remove,
    list: function () { return album.slice(); }
  };
})(typeof window !== 'undefined' ? window : globalThis);
