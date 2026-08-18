/* ============================================================
   music.js — موسیقی آرام‌بخش پس\u200Cزمینه برای فندوقی
   - ملودی ساده با ۵ نت تکراری (بدون فایل خارجی)
   - کنترل در settings panel
   ============================================================ */
(function (g) {
  'use strict';

  const STORAGE_KEY = 'fandoqi.music';

  let enabled = false;
  let volume = 0.3;
  let ctx = null;
  let osc = null;
  let gain = null;
  let stepIndex = 0;
  let interval = null;

  // پنتاتونیک ساده در لا مینور — ۵ نت آرام
  const NOTES = [262, 294, 330, 392, 440];

  function ensureCtx() {
    if (ctx) return true;
    const AC = g.AudioContext || g.webkitAudioContext;
    if (!AC) return false;
    try {
      ctx = new AC();
      if (ctx.state === 'suspended') ctx.resume().catch(function () {});
      return true;
    } catch (_) { return false; }
  }

  function playStep() {
    if (!enabled || !ctx) return;
    try {
      const freq = NOTES[stepIndex % NOTES.length];
      const t0 = ctx.currentTime;
      if (gain) {
        gain.gain.cancelScheduledValues(t0);
        gain.gain.setValueAtTime(0.0001, t0);
        gain.gain.exponentialRampToValueAtTime(volume, t0 + 0.5);
        gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 1.8);
      }
      if (osc) {
        osc.frequency.cancelScheduledValues(t0);
        osc.frequency.setValueAtTime(freq, t0);
        osc.frequency.linearRampToValueAtTime(freq, t0 + 1.8);
      }
      stepIndex++;
    } catch (_) {}
  }

  function start() {
    if (enabled) return true;
    if (!ensureCtx()) return false;
    enabled = true;
    try { g.localStorage.setItem(STORAGE_KEY, JSON.stringify({ enabled: true, volume: volume })); } catch (_) {}
    try {
      osc = ctx.createOscillator();
      gain = ctx.createGain();
      gain.gain.value = 0.0001;
      osc.type = 'sine';
      osc.frequency.value = NOTES[0];
      osc.connect(gain).connect(ctx.destination);
      osc.start();
    } catch (_) { return false; }
    interval = setInterval(playStep, 1900);
    return true;
  }

  function stop() {
    if (!enabled) return;
    enabled = false;
    try { g.localStorage.setItem(STORAGE_KEY, JSON.stringify({ enabled: false, volume: volume })); } catch (_) {}
    if (interval) { clearInterval(interval); interval = null; }
    if (osc) { try { osc.stop(); } catch (_) {} osc = null; }
    gain = null;
  }

  function toggle() {
    if (enabled) stop();
    else start();
    return enabled;
  }

  function setVolume(v) {
    volume = Math.max(0, Math.min(1, Number(v) || 0));
    if (gain) gain.gain.value = volume;
    try { g.localStorage.setItem(STORAGE_KEY, JSON.stringify({ enabled: enabled, volume: volume })); } catch (_) {}
    return volume;
  }

  function getVolume() { return volume; }

  function isEnabled() { return enabled; }

  function loadFromStorage() {
    try {
      const raw = g.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const s = JSON.parse(raw);
        if (typeof s.volume === 'number') volume = Math.max(0, Math.min(1, s.volume));
      }
    } catch (_) {}
  }

  loadFromStorage();

  const api = {
    start: start,
    stop: stop,
    toggle: toggle,
    setVolume: setVolume,
    getVolume: getVolume,
    isEnabled: isEnabled,
    NOTES: NOTES,
    STORAGE_KEY: STORAGE_KEY
  };

  g.Music = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis);
