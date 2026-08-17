#!/usr/bin/env python3
import os
os.chdir('/home/user/Naqashi-Fandoqi')
SETTINGS = 'js/settings.js'
INDEX = 'index.html'

with open(SETTINGS, 'r', encoding='utf-8') as f:
    st = f.read()

# 1) render(): اضافه کردن music toggle
HOOK_R = "      if (field === 'theme') tg.classList.toggle('is-on', !!(g.Theme && g.Theme.current() === 'dark'));"
NEW_R = """      if (field === 'theme') tg.classList.toggle('is-on', !!(g.Theme && g.Theme.current() === 'dark'));
      if (field === 'music') tg.classList.toggle('is-on', !!(g.Music && g.Music.isEnabled()));"""
if HOOK_R not in st:
    print('HOOK_R NOT FOUND'); raise SystemExit(1)
st = st.replace(HOOK_R, NEW_R, 1)

# 2) wireEvents(): click handler برای music toggle
HOOK_W = "        if (field === 'theme' && g.Theme) {\n          g.Theme.toggle();\n          tg.classList.toggle('is-on', g.Theme.current() === 'dark');\n          render();\n        }"
NEW_W = """        if (field === 'theme' && g.Theme) {
          g.Theme.toggle();
          tg.classList.toggle('is-on', g.Theme.current() === 'dark');
          render();
        }
        if (field === 'music' && g.Music) {
          g.Music.toggle();
          tg.classList.toggle('is-on', g.Music.isEnabled());
          if (g.Utils && g.Utils.toast) {
            g.Utils.toast(g.Music.isEnabled() ? '\u0645\u0648\u0632\u06CC\u06A9 \u0622\u0631\u0627\u0645 \u067E\u0627\u06A9\u0633\u0627\u0632\u06CC' : '\u0645\u0648\u0632\u06CC\u06A9 \u062E\u0627\u0645\u0648\u0634 \u0634\u062F', 'info');
          }
        }"""
if HOOK_W not in st:
    print('HOOK_W NOT FOUND'); raise SystemExit(1)
st = st.replace(HOOK_W, NEW_W, 1)

with open(SETTINGS, 'w', encoding='utf-8') as f:
    f.write(st)
print('Settings OK')

# 3) HTML: اضافه کردن music toggle button بعد از sound toggle
with open(INDEX, 'r', encoding='utf-8', errors='surrogateescape') as f:
    html = f.read()
SOUND = '<button type="button" class="settings-toggle" data-field="sound" aria-label="\u0635\u062F\u0627 \u0631\u0627 \u0641\u0639\u0627\u0644/\u063A\u06CC\u0631\u0641\u0639\u0627\u0644 \u06A9\u0646"></button>'
MUSIC = '<button type="button" class="settings-toggle" data-field="music" aria-label="\u0645\u0648\u0632\u06CC\u06A9 \u0622\u0631\u0627\u0645">\uD83C\uDFB5</button>'
if SOUND not in html:
    print('SOUND NOT FOUND'); raise SystemExit(1)
html = html.replace(SOUND, SOUND + '\n          ' + MUSIC, 1)

with open(INDEX, 'w', encoding='utf-8', errors='surrogateescape') as f:
    f.write(html)
print('Index OK')

# Cleanup the patch script
os.remove('_patch_music.py')
print('Cleanup OK')
