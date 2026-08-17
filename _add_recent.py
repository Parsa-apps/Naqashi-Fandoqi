import os
os.chdir('/home/user/Naqashi-Fandoqi')
ENG = 'js/engine.js'
with open(ENG, 'r', encoding='utf-8') as f:
    eng = f.read()
OLD = "  let hasDrawing = false;"
NEW = "  let hasDrawing = false;\n  const recentColors = [];"
if OLD not in eng:
    print('OLD NOT FOUND'); raise SystemExit(1)
eng = eng.replace(OLD, NEW, 1)

OLD_API = "    saveDraftDebounced: typeof saveDraftDebounced === 'function' ? saveDraftDebounced : function () {},"
NEW_API = """    saveDraftDebounced: typeof saveDraftDebounced === 'function' ? saveDraftDebounced : function () {},
    addRecentColor: function (c) {
      if (!c) return;
      if (!recentColors.includes(c)) recentColors.unshift(c);
      else recentColors.splice(recentColors.indexOf(c), 1);
      if (recentColors.length > 8) recentColors.length = 8;
    },
    getRecentColors: function () { return recentColors.slice(); },"""
if OLD_API not in eng:
    print('API NOT FOUND'); raise SystemExit(1)
eng = eng.replace(OLD_API, NEW_API, 1)

OLD_SETC = "  function setColor(c) { color = c; }"
NEW_SETC = """  function setColor(c) {
    color = c;
    if (c) {
      if (!recentColors.includes(c)) recentColors.unshift(c);
      else recentColors.splice(recentColors.indexOf(c), 1);
      if (recentColors.length > 8) recentColors.length = 8;
    }
  }"""
if OLD_SETC not in eng:
    print('SETC NOT FOUND'); raise SystemExit(1)
eng = eng.replace(OLD_SETC, NEW_SETC, 1)
with open(ENG, 'w', encoding='utf-8') as f:
    f.write(eng)
print('Engine OK')
