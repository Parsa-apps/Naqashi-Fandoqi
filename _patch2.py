#!/usr/bin/env python3
import os
os.chdir('/home/user/Naqashi-Fandoqi')
INDEX = 'index.html'

# خواندن با surrogateescape
with open(INDEX, 'r', encoding='utf-8', errors='surrogateescape') as f:
    html = f.read()

# با متن JSON-like که شامل escape های surrogate پاک نشده
SOUND = '<button type="button" class="settings-toggle" data-field="sound" aria-label="\u0635\u062F\u0627 \u0631\u0627 \u0641\u0639\u0627\u0644/\u063A\u06CC\u0631\u0641\u0639\u0627\u0644 \u06A9\u0646"></button>'
MUSIC = '<button type="button" class="settings-toggle" data-field="music" aria-label="\u0645\u0648\u0632\u06CC\u06A9 \u0622\u0631\u0627\u0645">\uD83C\uDFB5</button>'

if SOUND not in html:
    print('SOUND NOT FOUND')
    raise SystemExit(1)
html = html.replace(SOUND, SOUND + '\n          ' + MUSIC, 1)

# نوشتن با surrogateescape
with open(INDEX, 'w', encoding='utf-8', errors='surrogateescape') as f:
    f.write(html)
print('Index OK')

os.remove('_patch2.py')
print('Cleanup OK')
