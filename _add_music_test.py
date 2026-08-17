#!/usr/bin/env python3
import os
os.chdir('/home/user/Naqashi-Fandoqi')
PATH = 'tests/checks.mjs'
with open(PATH, 'r', encoding='utf-8') as f:
    txt = f.read()

BLOCK = '''section('تست‌های Music — موسیقی آرام‌بخش پس‌زمینه');
{
  const M = (await import(pathToFileURL(join(ROOT, 'js/music.js')).href)).default;
  ok('Music.start یک تابع است', typeof M.start === 'function');
  ok('Music.stop یک تابع است', typeof M.stop === 'function');
  ok('Music.toggle یک تابع است', typeof M.toggle === 'function');
  ok('Music.setVolume یک تابع است', typeof M.setVolume === 'function');
  ok('Music.getVolume یک عدد است', typeof M.getVolume() === 'number');
  ok('Music.isEnabled یک تابع است', typeof M.isEnabled === 'function');
  ok('Music.NOTES آرایه‌ای از فرکانس‌هاست', Array.isArray(M.NOTES) && M.NOTES.length >= 5);
  // setVolume باید clamp کند
  ok('Music.setVolume(0.4) عدد برمی\u06AFرداند', M.setVolume(0.4) === 0.4);
  ok('Music.setVolume(2) clamp به 1', M.setVolume(2) === 1);
  ok('Music.setVolume(-1) clamp به 0', M.setVolume(-1) === 0);
  ok('Music.isEnabled() boolean برمی\u06AFرداند', typeof M.isEnabled() === 'boolean');
}

'''
MARKER = '/* ---------- خلاصه ---------- */'
if MARKER not in txt:
    print('MARKER NOT FOUND'); raise SystemExit(1)
txt = txt.replace(MARKER, BLOCK + MARKER, 1)

# اضافه کردن به JS_FILES
OLD = "  'js/challenges.js', 'js/app.js'];"
NEW = "  'js/challenges.js', 'js/music.js', 'js/app.js'];"
if OLD in txt:
    txt = txt.replace(OLD, NEW, 1)
else:
    print('JS_FILES PATTERN NOT FOUND'); raise SystemExit(1)

with open(PATH, 'w', encoding='utf-8') as f:
    f.write(txt)
print('OK')
os.remove('_add_music_test.py')
