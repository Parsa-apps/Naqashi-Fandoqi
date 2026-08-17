/* ============================================================
   sound.js — جلوه‌های صوتی سرگرم‌کننده با Web Audio
   (بدون فایل صوتی خارجی؛ همه‌چیز با اسیلاتور ساخته می‌شود)
   ============================================================ */
(function (g) {
  'use strict';

  let ctx = null;
  let enabled = true;

  function ensure() {
    if (!ctx) {
      const AC = g.AudioContext || g.webkitAudioContext;
      if (!AC) return false;
      try { ctx = new AC(); } catch (e) { ctx = null; return false; }
    }
    if (ctx.state === 'suspended') {
      ctx.resume().catch(function () {});
    }
    return true;
  }

  function tone(freq, dur, type, vol, when, slideTo) {
    if (!ensure()) return;
    const t0 = ctx.currentTime + (when || 0);
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type || 'sine';
    osc.frequency.setValueAtTime(freq, t0);
    if (slideTo) osc.frequency.exponentialRampToValueAtTime(Math.max(slideTo, 40), t0 + dur);
    gain.gain.setValueAtTime(0.0001, t0);
    gain.gain.exponentialRampToValueAtTime(vol || 0.12, t0 + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(gain).connect(ctx.destination);
    osc.start(t0);
    osc.stop(t0 + dur + 0.05);
  }

  function play(notes) {
    if (!enabled) return;
    notes.forEach(function (n) {
      tone(n[0], n[1], n[2], n[3], n[4], n[5]);
    });
  }

  const api = {
    setEnabled(v) { enabled = !!v; return enabled; },
    isEnabled() { return enabled; },
    unlock() { ensure(); },

    click() { play([[660, 0.05, 'square', 0.05]]); },
    tool() { play([[520, 0.07, 'triangle', 0.1, 0, 700]]); },
    magic() {
      play([
        [523, 0.09, 'sine', 0.12, 0],
        [659, 0.09, 'sine', 0.12, 0.08],
        [784, 0.12, 'sine', 0.12, 0.16],
        [1047, 0.18, 'sine', 0.14, 0.24]
      ]);
    },
    save() {
      play([
        [659, 0.1, 'triangle', 0.12, 0],
        [880, 0.16, 'triangle', 0.12, 0.09]
      ]);
    },
    chime() {
      // جشن سه‌نتی بالارونده برای لحظه‌های موفقیت (دستاورد، اتمام آموزش)
      play([
        [523, 0.14, 'sine',     0.12, 0],
        [784, 0.14, 'sine',     0.14, 0.10],
        [1047, 0.22, 'triangle', 0.16, 0.20]
      ]);
    },
    error() { play([[130, 0.18, 'sawtooth', 0.08]]); }
  };

  g.Sound = api;
  if (typeof module !== 'undefined' && module.exports) {
    // برای تست در Node — همه متدها به‌جز ctx به‌دردبخور نیستند
    const nodeSafe = {
      setEnabled: api.setEnabled,
      isEnabled: api.isEnabled,
      click: api.click, tool: api.tool, magic: api.magic,
      save: api.save, chime: api.chime, error: api.error,
      unlock: api.unlock
    };
    module.exports = nodeSafe;
  }
})(typeof window !== 'undefined' ? window : globalThis);
