/* ============================================================
   engine.js — موتور نقاشی
   بوم، ابزارهای حرفه‌ای، براش‌های جادویی، تاریخچه و پیش‌نویس
   ============================================================ */
(function (g) {
  'use strict';

  const HISTORY_LIMIT = 25;
  const HISTORY_SNAP_MAX = 2400;   // سقف ابعاد اسنپشات‌های تاریخچه (مدیریت حافظه)
  const MAX_DPR = 1.5;
  const DRAFT_MAX_DIM = 1280;
  const ALBUM_MAX_DIM = 1100;
  const THUMB_DIM = 300;

  const SHAPE_TOOLS = ['line', 'rect', 'ellipse', 'triangle', 'star'];
  const STAMP_TOOLS = ['stamp-heart', 'stamp-star', 'stamp-flower', 'stamp-butterfly', 'stamp-smiley'];
  const MAGIC_TOOLS = ['rainbow', 'sparkle', 'glow'].concat(STAMP_TOOLS);

  let canvas = null;
  let ctx = null;
  let wrap = null;
  let dpr = 1;

  let tool = 'brush';
  let color = '#ec407a';
  let size = 12;

  let drawing = false;
  let lastX = 0;
  let lastY = 0;
  let hue = 0;
  let sprayTimer = null;
  let shapeStart = null;
  let shapeSnap = null;
  let hasDrawing = false;

  let history = [];
  let hIndex = -1;
  let onHistoryChange = null;

  /* ---------- تنظیم بوم ---------- */

  function fitCanvas() {
    const w = wrap.clientWidth;
    const h = wrap.clientHeight;
    if (!w || !h) return;
    dpr = Math.min(g.devicePixelRatio || 1, MAX_DPR);
    const pw = Math.round(w * dpr);
    const ph = Math.round(h * dpr);
    if (pw === canvas.width && ph === canvas.height) return;

    // حفظ نقاشی فعلی هنگام تغییر اندازه
    const tmp = document.createElement('canvas');
    tmp.width = canvas.width;
    tmp.height = canvas.height;
    tmp.getContext('2d').drawImage(canvas, 0, 0);

    canvas.width = pw;
    canvas.height = ph;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    fillWhite();
    if (tmp.width > 0) {
      ctx.drawImage(tmp, 0, 0, tmp.width, tmp.height, 0, 0, w, h);
    }
  }

  function fillWhite() {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width / dpr, canvas.height / dpr);
  }

  function pos(e) {
    const r = canvas.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  }

  /* ---------- تاریخچه ---------- */

  function snapshotUrl() {
    try {
      return exportDataUrl(HISTORY_SNAP_MAX);
    } catch (e) {
      return null;
    }
  }

  function pushHistory() {
    const url = snapshotUrl();
    if (!url) return;
    if (history[hIndex] === url) return; // تغییری نکرده
    history = history.slice(0, hIndex + 1);
    history.push(url);
    if (history.length > HISTORY_LIMIT) history.shift();
    hIndex = history.length - 1;
    emitHistory();
  }

  function restoreTo(url) {
    const img = new Image();
    img.onload = function () {
      fillWhite();
      ctx.drawImage(img, 0, 0, img.naturalWidth / dpr, img.naturalHeight / dpr);
      emitHistory();
    };
    img.src = url;
  }

  function emitHistory() {
    if (onHistoryChange) onHistoryChange({ canUndo: hIndex > 0, canRedo: hIndex < history.length - 1 });
  }

  function undo() {
    if (hIndex <= 0) return;
    hIndex--;
    restoreTo(history[hIndex]);
  }

  function redo() {
    if (hIndex >= history.length - 1) return;
    hIndex++;
    restoreTo(history[hIndex]);
  }

  /* ---------- ترسیم پایه ---------- */

  function dot(x, y, col, glow) {
    ctx.save();
    if (glow) {
      ctx.shadowColor = col;
      ctx.shadowBlur = size * 1.6;
    }
    ctx.fillStyle = col;
    ctx.beginPath();
    ctx.arc(x, y, Math.max(size / 2, 1), 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function segment(from, to, spacing, cb) {
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const dist = Math.hypot(dx, dy);
    const steps = Math.max(1, Math.floor(dist / Math.max(spacing, 1)));
    for (let i = 1; i <= steps; i++) {
      cb(from.x + (dx * i) / steps, from.y + (dy * i) / steps);
    }
  }

  function lineTo(x, y, width, style) {
    ctx.save();
    ctx.strokeStyle = style;
    ctx.lineWidth = width;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.restore();
  }

  /* ---------- ابزارهای حرفه‌ای ---------- */

  function drawBrush(x, y) {
    lineTo(x, y, size, color);
  }

  function drawPencil(x, y) {
    ctx.save();
    ctx.globalAlpha = 0.9;
    lineTo(x, y, Math.max(1, size * 0.4), color);
    ctx.restore();
  }

  function drawEraser(x, y) {
    lineTo(x, y, Math.max(6, size * 1.8), '#ffffff');
  }

  function sprayDot(x, y) {
    const r = Math.max(6, size * 2);
    for (let i = 0; i < 10; i++) {
      const ang = Math.random() * Math.PI * 2;
      const dist = Math.random() * r;
      const px = x + Math.cos(ang) * dist;
      const py = y + Math.sin(ang) * dist;
      ctx.save();
      ctx.globalAlpha = 0.4 + Math.random() * 0.6;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(px, py, Math.max(1, size * 0.18), 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  function floodFill(x, y) {
    const w = canvas.width;
    const h = canvas.height;
    const img = ctx.getImageData(0, 0, w, h);
    const data = img.data;
    const px = Math.round(x * dpr);
    const py = Math.round(y * dpr);
    if (px < 0 || py < 0 || px >= w || py >= h) return;

    const targetIdx = (py * w + px) * 4;
    const tr = data[targetIdx];
    const tg = data[targetIdx + 1];
    const tb = data[targetIdx + 2];
    const ta = data[targetIdx + 3];

    const c = g.Utils.hexToRgb(color);
    if (!c) return;
    if (tr === c.r && tg === c.g && tb === c.b && ta === 255) return; // هم‌رنگ است

    const TOL = 32;
    const match = function (i) {
      return Math.abs(data[i] - tr) <= TOL &&
        Math.abs(data[i + 1] - tg) <= TOL &&
        Math.abs(data[i + 2] - tb) <= TOL &&
        Math.abs(data[i + 3] - ta) <= 8;
    };

    const stack = [[px, py]];
    const seen = new Uint8Array(w * h);
    while (stack.length) {
      const p = stack.pop();
      const ix = p[0];
      const iy = p[1];
      if (ix < 0 || iy < 0 || ix >= w || iy >= h) continue;
      const posIdx = iy * w + ix;
      if (seen[posIdx]) continue;
      seen[posIdx] = 1;
      const di = posIdx * 4;
      if (!match(di)) continue;
      data[di] = c.r;
      data[di + 1] = c.g;
      data[di + 2] = c.b;
      data[di + 3] = 255;
      stack.push([ix + 1, iy], [ix - 1, iy], [ix, iy + 1], [ix, iy - 1]);
    }
    ctx.putImageData(img, 0, 0);
  }

  /* ---------- براش‌های جادویی ---------- */

  function drawRainbow(x, y) {
    const col = 'hsl(' + hue + ', 90%, 55%)';
    hue = (hue + 10) % 360;
    dot(x, y, col, false);
  }

  function glitter(x, y) {
    const white = Math.random() < 0.4;
    const col = white ? '#ffffff' : color;
    const len = 3 + Math.random() * Math.max(3, size * 0.8);
    ctx.save();
    ctx.strokeStyle = col;
    ctx.lineWidth = 1.6;
    ctx.lineCap = 'round';
    ctx.beginPath();
    const ang = Math.random() * Math.PI;
    for (let i = 0; i < 4; i++) {
      const a = ang + (i * Math.PI) / 4;
      ctx.moveTo(x - Math.cos(a) * len, y - Math.sin(a) * len);
      ctx.lineTo(x + Math.cos(a) * len, y + Math.sin(a) * len);
    }
    ctx.stroke();
    ctx.fillStyle = col;
    ctx.beginPath();
    ctx.arc(x, y, 1.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function drawGlow(x, y) {
    ctx.save();
    ctx.shadowColor = color;
    ctx.shadowBlur = size * 1.5;
    ctx.strokeStyle = color;
    ctx.lineWidth = Math.max(2, size * 0.7);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = Math.max(1, size * 0.25);
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.restore();
  }

  /* ---------- مهرهای جادویی ---------- */

  function starPath(c, x, y, r, inset, rot) {
    c.beginPath();
    for (let i = 0; i < 10; i++) {
      const rad = (i % 2 === 0) ? r : r * inset;
      const a = rot + (i * Math.PI) / 5;
      const px = x + Math.cos(a) * rad;
      const py = y + Math.sin(a) * rad;
      if (i === 0) c.moveTo(px, py);
      else c.lineTo(px, py);
    }
    c.closePath();
  }

  function stampHeart(x, y, s) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(x, y + s * 0.45);
    ctx.bezierCurveTo(x + s * 1.15, y - s * 0.35, x + s * 0.6, y - s * 1.15, x, y - s * 0.5);
    ctx.bezierCurveTo(x - s * 0.6, y - s * 1.15, x - s * 1.15, y - s * 0.35, x, y + s * 0.45);
    ctx.fill();
  }

  function stampStar(x, y, s) {
    ctx.fillStyle = color;
    starPath(ctx, x, y, s, 0.45, -Math.PI / 2);
    ctx.fill();
  }

  function stampFlower(x, y, s) {
    ctx.fillStyle = color;
    for (let i = 0; i < 6; i++) {
      const a = (i * Math.PI) / 3;
      ctx.beginPath();
      ctx.arc(x + Math.cos(a) * s * 0.55, y + Math.sin(a) * s * 0.55, s * 0.42, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = '#ffd54f';
    ctx.beginPath();
    ctx.arc(x, y, s * 0.4, 0, Math.PI * 2);
    ctx.fill();
  }

  function stampButterfly(x, y, s) {
    ctx.save();
    ctx.translate(x, y);
    ctx.fillStyle = color;
    // بال‌های بالا
    ctx.beginPath();
    ctx.ellipse(-s * 0.55, -s * 0.15, s * 0.5, s * 0.58, -0.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(s * 0.55, -s * 0.15, s * 0.5, s * 0.58, 0.5, 0, Math.PI * 2);
    ctx.fill();
    // بال‌های پایین
    ctx.beginPath();
    ctx.ellipse(-s * 0.42, s * 0.35, s * 0.32, s * 0.4, -0.25, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(s * 0.42, s * 0.35, s * 0.32, s * 0.4, 0.25, 0, Math.PI * 2);
    ctx.fill();
    // بدن
    ctx.fillStyle = '#5d4037';
    ctx.beginPath();
    ctx.ellipse(0, 0, s * 0.12, s * 0.55, 0, 0, Math.PI * 2);
    ctx.fill();
    // شاخک‌ها
    ctx.strokeStyle = '#5d4037';
    ctx.lineWidth = Math.max(1.5, s * 0.07);
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(-s * 0.08, -s * 0.5);
    ctx.quadraticCurveTo(-s * 0.4, -s * 0.8, -s * 0.55, -s * 0.9);
    ctx.moveTo(s * 0.08, -s * 0.5);
    ctx.quadraticCurveTo(s * 0.4, -s * 0.8, s * 0.55, -s * 0.9);
    ctx.stroke();
    ctx.restore();
  }

  function stampSmiley(x, y, s) {
    ctx.save();
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, s, 0, Math.PI * 2);
    ctx.fill();
    // سوراخ‌کردن چشم‌ها و لبخند با حالت destination-out
    ctx.globalCompositeOperation = 'destination-out';
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(x - s * 0.35, y - s * 0.3, s * 0.16, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x + s * 0.35, y - s * 0.3, s * 0.16, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#000';
    ctx.lineWidth = s * 0.14;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.arc(x, y + s * 0.12, s * 0.45, 0.15 * Math.PI, 0.85 * Math.PI);
    ctx.stroke();
    ctx.restore();
  }

  function drawStamp(x, y) {
    const s = Math.max(10, size * 1.7);
    switch (tool) {
      case 'stamp-heart': stampHeart(x, y, s); break;
      case 'stamp-star': stampStar(x, y, s); break;
      case 'stamp-flower': stampFlower(x, y, s); break;
      case 'stamp-butterfly': stampButterfly(x, y, s); break;
      case 'stamp-smiley': stampSmiley(x, y, s); break;
    }
  }

  /* ---------- اشکال ---------- */

  function drawShape(a, b) {
    const w = Math.abs(b.x - a.x);
    const h = Math.abs(b.y - a.y);
    const left = Math.min(a.x, b.x);
    const top = Math.min(a.y, b.y);
    ctx.save();
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = Math.max(2, size);
    ctx.strokeStyle = color;
    ctx.fillStyle = g.Utils.rgba(color, 0.14);
    ctx.beginPath();
    switch (tool) {
      case 'line':
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        break;
      case 'rect':
        ctx.rect(left, top, w, h);
        break;
      case 'ellipse':
        ctx.ellipse(left + w / 2, top + h / 2, Math.max(w / 2, 1), Math.max(h / 2, 1), 0, 0, Math.PI * 2);
        break;
      case 'triangle': {
        ctx.moveTo(left + w / 2, top);
        ctx.lineTo(left + w, top + h);
        ctx.lineTo(left, top + h);
        ctx.closePath();
        break;
      }
      case 'star':
        starPath(ctx, left + w / 2, top + h / 2, Math.max(w, h) / 2, 0.45, -Math.PI / 2);
        break;
    }
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }

  function snapshotForShape() {
    shapeSnap = document.createElement('canvas');
    shapeSnap.width = canvas.width;
    shapeSnap.height = canvas.height;
    shapeSnap.getContext('2d').drawImage(canvas, 0, 0);
  }

  /* ---------- رویدادها ---------- */

  function beginStroke(x, y) {
    lastX = x;
    lastY = y;

    if (tool === 'fill') {
      floodFill(x, y);
      pushHistory();
      hasDrawing = true;
      return;
    }
    if (SHAPE_TOOLS.indexOf(tool) !== -1) {
      drawing = true;
      shapeStart = { x: x, y: y };
      snapshotForShape();
      return;
    }

    drawing = true;
    hasDrawing = true;
    if (tool === 'spray') {
      sprayDot(x, y);
      sprayTimer = setInterval(function () { sprayDot(lastX, lastY); }, 30);
    } else if (tool === 'rainbow') {
      drawRainbow(x, y);
    } else if (tool === 'sparkle') {
      glitter(x, y);
    } else if (tool === 'glow') {
      dot(x, y, color, true);
    } else if (STAMP_TOOLS.indexOf(tool) !== -1) {
      drawStamp(x, y);
      pushHistory();
      drawing = false;
    } else if (tool === 'pencil') {
      drawPencil(x, y);
    } else if (tool === 'eraser') {
      drawEraser(x, y);
    } else {
      drawBrush(x, y);
    }
  }

  function moveStroke(x, y) {
    if (!drawing) return;

    if (shapeStart) {
      if (shapeSnap) {
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(shapeSnap, 0, 0);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      }
      drawShape(shapeStart, { x: x, y: y });
      return;
    }

    if (tool === 'rainbow') {
      segment({ x: lastX, y: lastY }, { x: x, y: y }, Math.max(2.5, size * 0.35), function (px, py) {
        drawRainbow(px, py);
      });
    } else if (tool === 'sparkle') {
      segment({ x: lastX, y: lastY }, { x: x, y: y }, 8, function (px, py) {
        glitter(px, py);
      });
    } else if (tool === 'glow') {
      drawGlow(x, y);
    } else if (tool === 'spray') {
      // اسپری در تایمر خودش نقاشی می‌کند؛ اینجا فقط موقعیت به‌روز می‌شود
    } else if (tool === 'pencil') {
      drawPencil(x, y);
    } else if (tool === 'eraser') {
      drawEraser(x, y);
    } else {
      drawBrush(x, y);
    }
    lastX = x;
    lastY = y;
  }

  function endStroke() {
    if (!drawing) return;
    drawing = false;
    if (sprayTimer) {
      clearInterval(sprayTimer);
      sprayTimer = null;
    }
    if (shapeStart) {
      shapeStart = null;
      shapeSnap = null;
    }
    pushHistory();
  }

  function onDown(e) {
    if (!e.isPrimary) return;
    e.preventDefault();
    canvas.setPointerCapture(e.pointerId);
    const p = pos(e);
    beginStroke(p.x, p.y);
  }

  function onMove(e) {
    if (!e.isPrimary) return;
    e.preventDefault();
    const p = pos(e);
    moveStroke(p.x, p.y);
  }

  function onUp(e) {
    if (!e.isPrimary) return;
    e.preventDefault();
    endStroke();
  }

  /* ---------- صادرات ---------- */

  function exportDataUrl(maxDim) {
    if (!maxDim || canvas.width <= maxDim) {
      return canvas.toDataURL('image/png');
    }
    const scale = maxDim / canvas.width;
    const tmp = document.createElement('canvas');
    tmp.width = Math.round(canvas.width * scale);
    tmp.height = Math.round(canvas.height * scale);
    tmp.getContext('2d').drawImage(canvas, 0, 0, tmp.width, tmp.height);
    return tmp.toDataURL('image/png');
  }

  function exportThumb(maxDim) {
    const dim = maxDim || THUMB_DIM;
    const scale = Math.min(1, dim / canvas.width);
    const tmp = document.createElement('canvas');
    tmp.width = Math.max(1, Math.round(canvas.width * scale));
    tmp.height = Math.max(1, Math.round(canvas.height * scale));
    tmp.getContext('2d').fillStyle = '#fff';
    tmp.getContext('2d').fillRect(0, 0, tmp.width, tmp.height);
    tmp.getContext('2d').drawImage(canvas, 0, 0, tmp.width, tmp.height);
    return tmp.toDataURL('image/jpeg', 0.85);
  }

  function loadImage(dataUrl, fit) {
    const img = new Image();
    img.onload = function () {
      pushHistory();
      fillWhite();
      const iw = img.naturalWidth / dpr;
      const ih = img.naturalHeight / dpr;
      const cw = canvas.width / dpr;
      const ch = canvas.height / dpr;
      if (fit) {
        const scale = Math.min(cw / iw, ch / ih, 1);
        const dw = iw * scale;
        const dh = ih * scale;
        ctx.drawImage(img, (cw - dw) / 2, (ch - dh) / 2, dw, dh);
      } else {
        ctx.drawImage(img, 0, 0, iw, ih);
      }
      hasDrawing = true;
      pushHistory();
    };
    img.src = dataUrl;
  }

  /* ---------- پیش‌نویس ---------- */

  function saveDraftNow() {
    if (!hasDrawing) return;
    const url = exportDataUrl(DRAFT_MAX_DIM);
    g.StorageCore.saveDraft(url);
  }

  const saveDraftDebounced = g.Utils.debounce(saveDraftNow, 600);

  function tryRestoreDraft() {
    const draft = g.StorageCore.loadDraft();
    if (!draft) return false;
    loadImage(draft, true);
    return true;
  }

  /* ---------- API ---------- */

  function init(canvasEl) {
    canvas = canvasEl;
    ctx = canvas.getContext('2d');
    if (!ctx) return api; // مرورگر بدون پشتیبانی Canvas → برنامه بدون نقاشی اما سالم
    wrap = canvas.parentElement;

    canvas.addEventListener('pointerdown', onDown);
    canvas.addEventListener('pointermove', onMove);
    canvas.addEventListener('pointerup', onUp);
    canvas.addEventListener('pointercancel', onUp);
    canvas.addEventListener('contextmenu', function (e) { e.preventDefault(); });

    if (typeof ResizeObserver !== 'undefined') {
      new ResizeObserver(fitCanvas).observe(wrap);
    }
    g.addEventListener('resize', fitCanvas);
    g.addEventListener('visibilitychange', function () {
      if (document.visibilityState === 'hidden') saveDraftNow();
    });

    fitCanvas();
    fillWhite();
    history = [];
    hIndex = -1;
    pushHistory(); // وضعیت اولیه (بوم سفید)
    return api;
  }

  const api = {
    init: init,
    setTool: function (t) { tool = t; },
    setColor: function (c) { color = c; },
    setSize: function (s) { size = g.Utils.clamp(Number(s) || 12, 2, 64); },
    getTool: function () { return tool; },
    getColor: function () { return color; },
    getSize: function () { return size; },
    isMagicTool: function (t) { return MAGIC_TOOLS.indexOf(t || tool) !== -1; },
    undo: undo,
    redo: redo,
    canUndo: function () { return hIndex > 0; },
    canRedo: function () { return hIndex < history.length - 1; },
    clear: function () {
      fillWhite();
      pushHistory();
    },
    isEmpty: function () { return !hasDrawing; },
    exportDataUrl: exportDataUrl,
    exportThumb: exportThumb,
    loadImage: loadImage,
    saveDraftNow: saveDraftNow,
    saveDraftDebounced: saveDraftDebounced,
    tryRestoreDraft: tryRestoreDraft,
    setHistoryListener: function (fn) { onHistoryChange = fn; }
  };

  g.Engine = api;
})(typeof window !== 'undefined' ? window : globalThis);
