#!/usr/bin/env python3
import os
os.chdir('/home/user/Naqashi-Fandoqi')

# 1) اضافه کردن متد به engine.js — ثبت رنگ‌های اخیر
ENG = 'js/engine.js'
with open(ENG, 'r', encoding='utf-8') as f:
    eng = f.read()
# اضافه کردن متدهای recentColors به API
OLD_API = '    saveDraftDebounced: typeof saveDraftDebounced === \'function\' ? saveDraftDebounced : function () {},'
NEW_API = '''    saveDraftDebounced: typeof saveDraftDebounced === 'function' ? saveDraftDebounced : function () {},
    addRecentColor: function (c) {
      if (!c) return;
      if (!recentColors.includes(c)) recentColors.unshift(c);
      else recentColors.splice(recentColors.indexOf(c), 1);
      if (recentColors.length > 8) recentColors.length = 8;
    },
    getRecentColors: function () { return recentColors.slice(); },'''
assert OLD_API in eng, 'OLD API NOT FOUND'
eng = eng.replace(OLD_API, NEW_API, 1)

# اضافه کردن آرایه recentColors در ابتدای IIFE
OLD_INIT = '  let hasDrawing = false;'
NEW_INIT = '  let hasDrawing = false;\n  const recentColors = [];'
assert OLD_INIT in eng, 'INIT NOT FOUND'
eng = eng.replace(OLD_INIT, NEW_INIT, 1)

# اضافه کردن به setColor برای record کردن رنگ
OLD_SETCOLOR = '''  function setColor(c) { color = c; }'''
NEW_SETCOLOR = '''  function setColor(c) {
    color = c;
    if (c) {
      if (!recentColors.includes(c)) recentColors.unshift(c);
      else recentColors.splice(recentColors.indexOf(c), 1);
      if (recentColors.length > 8) recentColors.length = 8;
    }
  }'''
assert OLD_SETCOLOR in eng, 'SETCOLOR NOT FOUND'
eng = eng.replace(OLD_SETCOLOR, NEW_SETCOLOR, 1)

with open(ENG, 'w', encoding='utf-8') as f:
    f.write(eng)
print('Engine OK')

# 2) CSS برای Recent Colors
CSS = 'css/style.css'
with open(CSS, 'r', encoding='utf-8') as f:
    css = f.read()
APPEND = '''

/* ============================================================
   Recent Colors — رنگ‌های اخیر استفاده‌شده
   ============================================================ */
.recent-colors {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  align-items: center;
  margin-top: 6px;
  padding-top: 6px;
  border-top: 1px dashed rgba(184, 134, 11, 0.32);
  min-height: 32px;
}
.recent-colors .label {
  font-size: 0.74rem;
  color: var(--muted);
  font-weight: 800;
  margin-inline-end: 4px;
  white-space: nowrap;
}
.recent-colors.is-empty {
  display: none;
}
.recent-color {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  border: 2px solid #fff;
  box-shadow: 0 0 0 1px #ddd;
  cursor: pointer;
  transition: transform 0.12s, box-shadow 0.12s;
  padding: 0;
}
.recent-color:hover {
  transform: scale(1.18);
  box-shadow: 0 0 0 2px var(--accent), 0 4px 8px rgba(74, 59, 82, 0.3);
}

:root[data-theme="dark"] .recent-color {
  border-color: rgba(255,255,255,0.4);
  box-shadow: 0 0 0 1px rgba(255,255,255,0.2);
}
:root[data-theme="dark"] .recent-colors {
  border-top-color: rgba(255,255,255,0.15);
}
'''
if 'Recent Colors' not in css:
    css += APPEND
    with open(CSS, 'w', encoding='utf-8') as f:
        f.write(css)
print('CSS OK')

# 3) HTML: اضافه کردن div برای recent colors در controlbar بعد از swatches
INDEX = 'index.html'
with open(INDEX, 'r', encoding='utf-8', errors='surrogateescape') as f:
    html = f.read()
OLD_SWATCHES = '<div class="swatches" id="swatches">'
# نیاز به بستن swatches و اضافه کردن recent-colors بعدش
# شکل فعلی: <div class="control-group"><div class="swatches">...</div><label>...</label></div>
# می‌خوام: بعد از swatches ولی قبل از custom-color
# با استفاده از یک anchor
TARGET = '<input type="color" id="custom-color" value="#ec407a" aria-label="\u0627\u0646\u062A\u062E\u0627\u0628 \u0631\u0646\u06AF \u062F\u0644\u062E\u0648\u0627\u0647">'
INSERT = '<div id="recent-colors" class="recent-colors is-empty" role="group" aria-label="\u0631\u0646\u06AF\u200C\u0647\u0627\u06CC \u0627\u062E\u06CC\u0631"></div>\n          ' + TARGET
assert TARGET in html, 'CUSTOM COLOR NOT FOUND'
html = html.replace(TARGET, INSERT, 1)
with open(INDEX, 'w', encoding='utf-8', errors='surrogateescape') as f:
    f.write(html)
print('Index OK')

# 4) app.js: render recent colors on selection
APP = 'js/app.js'
with open(APP, 'r', encoding='utf-8') as f:
    app = f.read()
# پیدا کردن wireColors و اضافه کردن renderRecentColors
HOOK = "    custom.addEventListener('input', function () {\n      U.$$('.swatch').forEach(function (s) { s.classList.remove('is-active'); });\n      Engine.setColor(custom.value);\n    });\n  }"
NEW_HOOK = '''    custom.addEventListener('input', function () {
      U.$$('.swatch').forEach(function (s) { s.classList.remove('is-active'); });
      Engine.setColor(custom.value);
      renderRecent();
    });
  }
  // \u0631\u0646\u062F\u0631 \u0631\u0646\u06AF\u200C\u0647\u0627\u06CC \u0627\u062E\u06CC\u0631
  function renderRecent() {
    const recentEl = U.$('#recent-colors');
    if (!recentEl || !Engine || typeof Engine.getRecentColors !== 'function') return;
    const list = Engine.getRecentColors().filter(function (c) {
      return c && c !== Engine.getColor();
    });
    recentEl.innerHTML = '';
    if (list.length === 0) {
      recentEl.classList.add('is-empty');
      return;
    }
    recentEl.classList.remove('is-empty');
    const lab = document.createElement('span');
    lab.className = 'label';
    lab.textContent = '\u0627\u062E\u06CC\u0631:';
    recentEl.appendChild(lab);
    list.forEach(function (c) {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'recent-color';
      b.style.background = c;
      b.title = c;
      b.setAttribute('aria-label', '\u0631\u0646\u06AF ' + c);
      b.addEventListener('click', function () {
        U.$$('.swatch').forEach(function (s) { s.classList.remove('is-active'); });
        Engine.setColor(c);
        if (custom) custom.value = c;
        renderRecent();
      });
      recentEl.appendChild(b);
    });
  }'''
assert HOOK in app, 'WIRE COLORS HOOK NOT FOUND'
app = app.replace(HOOK, NEW_HOOK, 1)

# hook to renderRecent after swatch click
HOOK2 = "      Engine.setColor(sw.dataset.color);\n      custom.value = sw.dataset.color;\n      Sound.click();\n    });"
HOOK2_NEW = "      Engine.setColor(sw.dataset.color);\n      custom.value = sw.dataset.color;\n      Sound.click();\n      renderRecent();\n    });"
if HOOK2 in app:
    app = app.replace(HOOK2, HOOK2_NEW, 1)

with open(APP, 'w', encoding='utf-8') as f:
    f.write(app)
print('App OK')
