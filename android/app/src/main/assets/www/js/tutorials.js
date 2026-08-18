/* ============================================================
   tutorials.js — آموزش صفر تا صد و ترفندهای طلایی
   داده‌های آموزش (خالص و قابل تست) + رندر رابط کاربری
   ============================================================ */
(function (g) {
  'use strict';

  const OUTLINE = '#5d4e37';

  /* ---------- داده‌های آموزش ---------- */

  const TUTORIALS = [
    {
      id: 'cat',
      title: 'گربهٔ بامزه',
      emoji: '🐱',
      level: 'آسان',
      steps: [
        {
          text: 'یک دایرهٔ بزرگ برای سر گربه بکش. ساده بود، نه؟',
          svg: '<svg viewBox="0 0 200 170" xmlns="http://www.w3.org/2000/svg"><circle cx="100" cy="75" r="42" fill="#fff3e0" stroke="#5d4e37" stroke-width="4"/></svg>'
        },
        {
          text: 'دو مثلث کوچک بالای دایره بگذار؛ این‌ها گوش‌های گربه‌اند!',
          svg: '<svg viewBox="0 0 200 170" xmlns="http://www.w3.org/2000/svg"><circle cx="100" cy="75" r="42" fill="#fff3e0" stroke="#5d4e37" stroke-width="4"/><path d="M63 48 L57 12 L95 33 Z" fill="#fff3e0" stroke="#5d4e37" stroke-width="4" stroke-linejoin="round"/><path d="M137 48 L143 12 L105 33 Z" fill="#fff3e0" stroke="#5d4e37" stroke-width="4" stroke-linejoin="round"/></svg>'
        },
        {
          text: 'دو چشم گرد و یک بینی کوچک صورتی برایش بکش.',
          svg: '<svg viewBox="0 0 200 170" xmlns="http://www.w3.org/2000/svg"><circle cx="100" cy="75" r="42" fill="#fff3e0" stroke="#5d4e37" stroke-width="4"/><path d="M63 48 L57 12 L95 33 Z" fill="#fff3e0" stroke="#5d4e37" stroke-width="4" stroke-linejoin="round"/><path d="M137 48 L143 12 L105 33 Z" fill="#fff3e0" stroke="#5d4e37" stroke-width="4" stroke-linejoin="round"/><circle cx="85" cy="72" r="5" fill="#5d4e37"/><circle cx="115" cy="72" r="5" fill="#5d4e37"/><path d="M94 84 L106 84 L100 92 Z" fill="#f48fb1"/></svg>'
        },
        {
          text: 'سبیل‌هایش را بکش و یک لبخند قشنگ به او بده!',
          svg: '<svg viewBox="0 0 200 170" xmlns="http://www.w3.org/2000/svg"><circle cx="100" cy="75" r="42" fill="#fff3e0" stroke="#5d4e37" stroke-width="4"/><path d="M63 48 L57 12 L95 33 Z" fill="#fff3e0" stroke="#5d4e37" stroke-width="4" stroke-linejoin="round"/><path d="M137 48 L143 12 L105 33 Z" fill="#fff3e0" stroke="#5d4e37" stroke-width="4" stroke-linejoin="round"/><circle cx="85" cy="72" r="5" fill="#5d4e37"/><circle cx="115" cy="72" r="5" fill="#5d4e37"/><path d="M94 84 L106 84 L100 92 Z" fill="#f48fb1"/><path d="M100 92 q-10 12 -16 6 M100 92 q10 12 16 6" fill="none" stroke="#5d4e37" stroke-width="3" stroke-linecap="round"/><path d="M60 78 L36 74 M60 86 L36 88 M140 78 L164 74 M140 86 L164 88" stroke="#5d4e37" stroke-width="3" stroke-linecap="round"/></svg>'
        },
        {
          text: 'بدن و دمش را اضافه کن. آفرین! گربهٔ تو آماده است 🎉',
          svg: '<svg viewBox="0 0 200 170" xmlns="http://www.w3.org/2000/svg"><circle cx="100" cy="75" r="42" fill="#fff3e0" stroke="#5d4e37" stroke-width="4"/><path d="M63 48 L57 12 L95 33 Z" fill="#fff3e0" stroke="#5d4e37" stroke-width="4" stroke-linejoin="round"/><path d="M137 48 L143 12 L105 33 Z" fill="#fff3e0" stroke="#5d4e37" stroke-width="4" stroke-linejoin="round"/><circle cx="85" cy="72" r="5" fill="#5d4e37"/><circle cx="115" cy="72" r="5" fill="#5d4e37"/><path d="M94 84 L106 84 L100 92 Z" fill="#f48fb1"/><path d="M100 92 q-10 12 -16 6 M100 92 q10 12 16 6" fill="none" stroke="#5d4e37" stroke-width="3" stroke-linecap="round"/><path d="M60 78 L36 74 M60 86 L36 88 M140 78 L164 74 M140 86 L164 88" stroke="#5d4e37" stroke-width="3" stroke-linecap="round"/><ellipse cx="100" cy="141" rx="36" ry="25" fill="#fff3e0" stroke="#5d4e37" stroke-width="4"/><path d="M132 131 q44 -4 36 22" fill="none" stroke="#5d4e37" stroke-width="6" stroke-linecap="round"/></svg>'
        }
      ]
    },
    {
      id: 'house',
      title: 'خانهٔ رویایی',
      emoji: '🏠',
      level: 'آسان',
      steps: [
        {
          text: 'یک مربع بزرگ برای دیوارهای خانه بکش و یک خط برای زمین.',
          svg: '<svg viewBox="0 0 200 160" xmlns="http://www.w3.org/2000/svg"><rect x="60" y="72" width="80" height="68" fill="#ffe0b2" stroke="#5d4e37" stroke-width="4"/><line x1="40" y1="140" x2="160" y2="140" stroke="#8d6e63" stroke-width="4" stroke-linecap="round"/></svg>'
        },
        {
          text: 'یک مثلث بالای مربع بگذار؛ این سقف خانه است!',
          svg: '<svg viewBox="0 0 200 160" xmlns="http://www.w3.org/2000/svg"><rect x="60" y="72" width="80" height="68" fill="#ffe0b2" stroke="#5d4e37" stroke-width="4"/><line x1="40" y1="140" x2="160" y2="140" stroke="#8d6e63" stroke-width="4" stroke-linecap="round"/><path d="M46 74 L100 30 L154 74 Z" fill="#ff8a65" stroke="#5d4e37" stroke-width="4" stroke-linejoin="round"/></svg>'
        },
        {
          text: 'یک در قهوه‌ای و یک پنجرهٔ آبی بکش.',
          svg: '<svg viewBox="0 0 200 160" xmlns="http://www.w3.org/2000/svg"><rect x="60" y="72" width="80" height="68" fill="#ffe0b2" stroke="#5d4e37" stroke-width="4"/><line x1="40" y1="140" x2="160" y2="140" stroke="#8d6e63" stroke-width="4" stroke-linecap="round"/><path d="M46 74 L100 30 L154 74 Z" fill="#ff8a65" stroke="#5d4e37" stroke-width="4" stroke-linejoin="round"/><rect x="88" y="100" width="24" height="40" fill="#8d6e63" stroke="#5d4e37" stroke-width="3"/><rect x="66" y="88" width="18" height="18" fill="#81d4fa" stroke="#5d4e37" stroke-width="3"/></svg>'
        },
        {
          text: 'دودکش بگذار و دودهایی که از آن بیرون می‌آید!',
          svg: '<svg viewBox="0 0 200 160" xmlns="http://www.w3.org/2000/svg"><rect x="60" y="72" width="80" height="68" fill="#ffe0b2" stroke="#5d4e37" stroke-width="4"/><line x1="40" y1="140" x2="160" y2="140" stroke="#8d6e63" stroke-width="4" stroke-linecap="round"/><path d="M46 74 L100 30 L154 74 Z" fill="#ff8a65" stroke="#5d4e37" stroke-width="4" stroke-linejoin="round"/><rect x="88" y="100" width="24" height="40" fill="#8d6e63" stroke="#5d4e37" stroke-width="3"/><rect x="66" y="88" width="18" height="18" fill="#81d4fa" stroke="#5d4e37" stroke-width="3"/><rect x="124" y="44" width="14" height="26" fill="#a1887f" stroke="#5d4e37" stroke-width="3"/><circle cx="131" cy="34" r="6" fill="#e0e0e0" opacity="0.9"/><circle cx="140" cy="24" r="8" fill="#e0e0e0" opacity="0.7"/></svg>'
        },
        {
          text: 'یک خورشید خندان و چند گل بکار. خانه‌ات رویایی شد! 🌻',
          svg: '<svg viewBox="0 0 200 160" xmlns="http://www.w3.org/2000/svg"><rect x="60" y="72" width="80" height="68" fill="#ffe0b2" stroke="#5d4e37" stroke-width="4"/><line x1="40" y1="140" x2="160" y2="140" stroke="#8d6e63" stroke-width="4" stroke-linecap="round"/><path d="M46 74 L100 30 L154 74 Z" fill="#ff8a65" stroke="#5d4e37" stroke-width="4" stroke-linejoin="round"/><rect x="88" y="100" width="24" height="40" fill="#8d6e63" stroke="#5d4e37" stroke-width="3"/><rect x="66" y="88" width="18" height="18" fill="#81d4fa" stroke="#5d4e37" stroke-width="3"/><rect x="124" y="44" width="14" height="26" fill="#a1887f" stroke="#5d4e37" stroke-width="3"/><circle cx="131" cy="34" r="6" fill="#e0e0e0" opacity="0.9"/><circle cx="140" cy="24" r="8" fill="#e0e0e0" opacity="0.7"/><circle cx="168" cy="36" r="13" fill="#ffd54f" stroke="#5d4e37" stroke-width="3"/><path d="M56 148 q4 -16 8 0" fill="none" stroke="#4caf50" stroke-width="3" stroke-linecap="round"/><path d="M140 148 q4 -16 8 0" fill="none" stroke="#4caf50" stroke-width="3" stroke-linecap="round"/><circle cx="52" cy="134" r="5" fill="#f06292"/><circle cx="62" cy="130" r="5" fill="#f06292"/><circle cx="144" cy="130" r="5" fill="#f06292"/><circle cx="136" cy="134" r="5" fill="#f06292"/></svg>'
        }
      ]
    },
    {
      id: 'fish',
      title: 'ماهی شاد',
      emoji: '🐠',
      level: 'آسان',
      steps: [
        {
          text: 'یک بیضی بزرگ برای بدن ماهی بکش.',
          svg: '<svg viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg"><ellipse cx="100" cy="80" rx="52" ry="30" fill="#ffe082" stroke="#5d4e37" stroke-width="4"/></svg>'
        },
        {
          text: 'یک مثلث در سمت راست بگذار؛ این دم ماهی است!',
          svg: '<svg viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg"><ellipse cx="100" cy="80" rx="52" ry="30" fill="#ffe082" stroke="#5d4e37" stroke-width="4"/><path d="M146 80 L180 52 L180 108 Z" fill="#ffb74d" stroke="#5d4e37" stroke-width="4" stroke-linejoin="round"/></svg>'
        },
        {
          text: 'یک چشم گرد و یک دهان کوچک برایش بکش.',
          svg: '<svg viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg"><ellipse cx="100" cy="80" rx="52" ry="30" fill="#ffe082" stroke="#5d4e37" stroke-width="4"/><path d="M146 80 L180 52 L180 108 Z" fill="#ffb74d" stroke="#5d4e37" stroke-width="4" stroke-linejoin="round"/><circle cx="78" cy="72" r="6" fill="#5d4e37"/><path d="M58 88 q12 10 24 4" fill="none" stroke="#5d4e37" stroke-width="3" stroke-linecap="round"/></svg>'
        },
        {
          text: 'باله‌های بالا و پایین ماهی را اضافه کن.',
          svg: '<svg viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg"><ellipse cx="100" cy="80" rx="52" ry="30" fill="#ffe082" stroke="#5d4e37" stroke-width="4"/><path d="M146 80 L180 52 L180 108 Z" fill="#ffb74d" stroke="#5d4e37" stroke-width="4" stroke-linejoin="round"/><circle cx="78" cy="72" r="6" fill="#5d4e37"/><path d="M58 88 q12 10 24 4" fill="none" stroke="#5d4e37" stroke-width="3" stroke-linecap="round"/><path d="M92 54 Q112 22 138 56 Z" fill="#ffb74d" stroke="#5d4e37" stroke-width="4" stroke-linejoin="round"/><path d="M92 106 Q112 138 138 104 Z" fill="#ffb74d" stroke="#5d4e37" stroke-width="4" stroke-linejoin="round"/></svg>'
        },
        {
          text: 'حباب‌های هوا و موج‌های آب را بکش. ماهی شنا می‌کند! 🫧',
          svg: '<svg viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg"><ellipse cx="100" cy="80" rx="52" ry="30" fill="#ffe082" stroke="#5d4e37" stroke-width="4"/><path d="M146 80 L180 52 L180 108 Z" fill="#ffb74d" stroke="#5d4e37" stroke-width="4" stroke-linejoin="round"/><circle cx="78" cy="72" r="6" fill="#5d4e37"/><path d="M58 88 q12 10 24 4" fill="none" stroke="#5d4e37" stroke-width="3" stroke-linecap="round"/><path d="M92 54 Q112 22 138 56 Z" fill="#ffb74d" stroke="#5d4e37" stroke-width="4" stroke-linejoin="round"/><path d="M92 106 Q112 138 138 104 Z" fill="#ffb74d" stroke="#5d4e37" stroke-width="4" stroke-linejoin="round"/><circle cx="170" cy="46" r="7" fill="none" stroke="#4fc3f7" stroke-width="3"/><circle cx="182" cy="30" r="4" fill="none" stroke="#4fc3f7" stroke-width="3"/><circle cx="166" cy="18" r="3" fill="none" stroke="#4fc3f7" stroke-width="3"/><path d="M16 140 q10 -8 20 0 t20 0 M116 140 q10 -8 20 0 t20 0" fill="none" stroke="#4fc3f7" stroke-width="3" stroke-linecap="round"/></svg>'
        }
      ]
    },
    {
      id: 'tree',
      title: 'درخت سبز',
      emoji: '🌳',
      level: 'آسان',
      steps: [
        {
          text: 'تنهٔ درخت را مثل یک مستطیل باریک بکش.',
          svg: '<svg viewBox="0 0 200 170" xmlns="http://www.w3.org/2000/svg"><path d="M92 150 L96 84 L104 84 L108 150 Z" fill="#8d6e63" stroke="#5d4e37" stroke-width="4" stroke-linejoin="round"/></svg>'
        },
        {
          text: 'دو شاخه به سمت چپ و راست بکش.',
          svg: '<svg viewBox="0 0 200 170" xmlns="http://www.w3.org/2000/svg"><path d="M92 150 L96 84 L104 84 L108 150 Z" fill="#8d6e63" stroke="#5d4e37" stroke-width="4" stroke-linejoin="round"/><path d="M96 100 Q78 84 66 74 M104 100 Q122 84 134 74" fill="none" stroke="#8d6e63" stroke-width="6" stroke-linecap="round"/></svg>'
        },
        {
          text: 'سه دایرهٔ سبز روی شاخه‌ها بگذار؛ این‌ها برگ‌ها هستند!',
          svg: '<svg viewBox="0 0 200 170" xmlns="http://www.w3.org/2000/svg"><path d="M92 150 L96 84 L104 84 L108 150 Z" fill="#8d6e63" stroke="#5d4e37" stroke-width="4" stroke-linejoin="round"/><path d="M96 100 Q78 84 66 74 M104 100 Q122 84 134 74" fill="none" stroke="#8d6e63" stroke-width="6" stroke-linecap="round"/><circle cx="100" cy="58" r="30" fill="#81c784" stroke="#5d4e37" stroke-width="4"/><circle cx="72" cy="78" r="23" fill="#81c784" stroke="#5d4e37" stroke-width="4"/><circle cx="128" cy="78" r="23" fill="#81c784" stroke="#5d4e37" stroke-width="4"/></svg>'
        },
        {
          text: 'چند سیب قرمز روی برگ‌ها بگذار. هوس سیب کردم! 🍎',
          svg: '<svg viewBox="0 0 200 170" xmlns="http://www.w3.org/2000/svg"><path d="M92 150 L96 84 L104 84 L108 150 Z" fill="#8d6e63" stroke="#5d4e37" stroke-width="4" stroke-linejoin="round"/><path d="M96 100 Q78 84 66 74 M104 100 Q122 84 134 74" fill="none" stroke="#8d6e63" stroke-width="6" stroke-linecap="round"/><circle cx="100" cy="58" r="30" fill="#81c784" stroke="#5d4e37" stroke-width="4"/><circle cx="72" cy="78" r="23" fill="#81c784" stroke="#5d4e37" stroke-width="4"/><circle cx="128" cy="78" r="23" fill="#81c784" stroke="#5d4e37" stroke-width="4"/><circle cx="86" cy="66" r="6" fill="#ef5350"/><circle cx="118" cy="58" r="6" fill="#ef5350"/><circle cx="102" cy="82" r="6" fill="#ef5350"/></svg>'
        },
        {
          text: 'چمن سبز و یک خورشید بکش. درختت کامل شد! ☀️',
          svg: '<svg viewBox="0 0 200 170" xmlns="http://www.w3.org/2000/svg"><path d="M92 150 L96 84 L104 84 L108 150 Z" fill="#8d6e63" stroke="#5d4e37" stroke-width="4" stroke-linejoin="round"/><path d="M96 100 Q78 84 66 74 M104 100 Q122 84 134 74" fill="none" stroke="#8d6e63" stroke-width="6" stroke-linecap="round"/><circle cx="100" cy="58" r="30" fill="#81c784" stroke="#5d4e37" stroke-width="4"/><circle cx="72" cy="78" r="23" fill="#81c784" stroke="#5d4e37" stroke-width="4"/><circle cx="128" cy="78" r="23" fill="#81c784" stroke="#5d4e37" stroke-width="4"/><circle cx="86" cy="66" r="6" fill="#ef5350"/><circle cx="118" cy="58" r="6" fill="#ef5350"/><circle cx="102" cy="82" r="6" fill="#ef5350"/><path d="M24 152 q8 -10 16 0 t16 0 M120 152 q8 -10 16 0 t16 0" fill="none" stroke="#4caf50" stroke-width="4" stroke-linecap="round"/><circle cx="170" cy="30" r="13" fill="#ffd54f" stroke="#5d4e37" stroke-width="3"/></svg>'
        }
      ]
    },
    {
      id: 'butterfly',
      title: 'پروانهٔ رنگارنگ',
      emoji: '🦋',
      level: 'متوسط',
      steps: [
        {
          text: 'یک بیضی بلند وسط صفحه بکش؛ این بدن پروانه است.',
          svg: '<svg viewBox="0 0 200 170" xmlns="http://www.w3.org/2000/svg"><ellipse cx="100" cy="82" rx="9" ry="34" fill="#6d4c41" stroke="#5d4e37" stroke-width="3"/></svg>'
        },
        {
          text: 'دو بال بزرگ بالا بکش؛ یکی چپ و یکی راست.',
          svg: '<svg viewBox="0 0 200 170" xmlns="http://www.w3.org/2000/svg"><ellipse cx="100" cy="82" rx="9" ry="34" fill="#6d4c41" stroke="#5d4e37" stroke-width="3"/><path d="M100 68 Q60 14 38 44 Q30 76 96 82 Z" fill="#ce93d8" stroke="#5d4e37" stroke-width="4" stroke-linejoin="round"/><path d="M100 68 Q140 14 162 44 Q170 76 104 82 Z" fill="#ce93d8" stroke="#5d4e37" stroke-width="4" stroke-linejoin="round"/></svg>'
        },
        {
          text: 'دو بال کوچک‌تر زیر آن‌ها بکش.',
          svg: '<svg viewBox="0 0 200 170" xmlns="http://www.w3.org/2000/svg"><ellipse cx="100" cy="82" rx="9" ry="34" fill="#6d4c41" stroke="#5d4e37" stroke-width="3"/><path d="M100 68 Q60 14 38 44 Q30 76 96 82 Z" fill="#ce93d8" stroke="#5d4e37" stroke-width="4" stroke-linejoin="round"/><path d="M100 68 Q140 14 162 44 Q170 76 104 82 Z" fill="#ce93d8" stroke="#5d4e37" stroke-width="4" stroke-linejoin="round"/><path d="M98 82 Q60 96 52 122 Q56 146 92 126 Z" fill="#ba68c8" stroke="#5d4e37" stroke-width="4" stroke-linejoin="round"/><path d="M102 82 Q140 96 148 122 Q144 146 108 126 Z" fill="#ba68c8" stroke="#5d4e37" stroke-width="4" stroke-linejoin="round"/></svg>'
        },
        {
          text: 'شاخک‌های پروانه را بکش و روی بال‌ها خال بگذار.',
          svg: '<svg viewBox="0 0 200 170" xmlns="http://www.w3.org/2000/svg"><ellipse cx="100" cy="82" rx="9" ry="34" fill="#6d4c41" stroke="#5d4e37" stroke-width="3"/><path d="M100 68 Q60 14 38 44 Q30 76 96 82 Z" fill="#ce93d8" stroke="#5d4e37" stroke-width="4" stroke-linejoin="round"/><path d="M100 68 Q140 14 162 44 Q170 76 104 82 Z" fill="#ce93d8" stroke="#5d4e37" stroke-width="4" stroke-linejoin="round"/><path d="M98 82 Q60 96 52 122 Q56 146 92 126 Z" fill="#ba68c8" stroke="#5d4e37" stroke-width="4" stroke-linejoin="round"/><path d="M102 82 Q140 96 148 122 Q144 146 108 126 Z" fill="#ba68c8" stroke="#5d4e37" stroke-width="4" stroke-linejoin="round"/><path d="M94 48 Q80 28 72 24 M106 48 Q120 28 128 24" fill="none" stroke="#6d4c41" stroke-width="3" stroke-linecap="round"/><circle cx="52" cy="54" r="7" fill="#fff59d"/><circle cx="148" cy="54" r="7" fill="#fff59d"/><circle cx="66" cy="112" r="6" fill="#fff59d"/><circle cx="134" cy="112" r="6" fill="#fff59d"/></svg>'
        },
        {
          text: 'دو گل کنار پروانه بکش و رنگ‌هایش را کامل کن. فوق‌العاده شد! 🌸',
          svg: '<svg viewBox="0 0 200 170" xmlns="http://www.w3.org/2000/svg"><ellipse cx="100" cy="82" rx="9" ry="34" fill="#6d4c41" stroke="#5d4e37" stroke-width="3"/><path d="M100 68 Q60 14 38 44 Q30 76 96 82 Z" fill="#ce93d8" stroke="#5d4e37" stroke-width="4" stroke-linejoin="round"/><path d="M100 68 Q140 14 162 44 Q170 76 104 82 Z" fill="#ce93d8" stroke="#5d4e37" stroke-width="4" stroke-linejoin="round"/><path d="M98 82 Q60 96 52 122 Q56 146 92 126 Z" fill="#ba68c8" stroke="#5d4e37" stroke-width="4" stroke-linejoin="round"/><path d="M102 82 Q140 96 148 122 Q144 146 108 126 Z" fill="#ba68c8" stroke="#5d4e37" stroke-width="4" stroke-linejoin="round"/><path d="M94 48 Q80 28 72 24 M106 48 Q120 28 128 24" fill="none" stroke="#6d4c41" stroke-width="3" stroke-linecap="round"/><circle cx="52" cy="54" r="7" fill="#fff59d"/><circle cx="148" cy="54" r="7" fill="#fff59d"/><circle cx="66" cy="112" r="6" fill="#fff59d"/><circle cx="134" cy="112" r="6" fill="#fff59d"/><path d="M40 160 q6 -18 12 0" fill="none" stroke="#4caf50" stroke-width="3" stroke-linecap="round"/><path d="M160 160 q6 -18 12 0" fill="none" stroke="#4caf50" stroke-width="3" stroke-linecap="round"/><circle cx="46" cy="142" r="6" fill="#f06292"/><circle cx="40" cy="138" r="6" fill="#f06292"/><circle cx="52" cy="138" r="6" fill="#f06292"/><circle cx="166" cy="142" r="6" fill="#f48fb1"/><circle cx="160" cy="138" r="6" fill="#f48fb1"/><circle cx="172" cy="138" r="6" fill="#f48fb1"/><circle cx="46" cy="140" r="3" fill="#ffd54f"/><circle cx="166" cy="140" r="3" fill="#ffd54f"/></svg>'
        }
      ]
    },

    /* ---------- متد ۱: نقاشی از روی اعداد ---------- */
    {
      id: 'butterfly-number',
      title: 'پروانه از عدد ۸',
      emoji: '🧮',
      level: 'مبتدی',
      tag: 'عدد',
      steps: [
        {
          text: 'یک عدد «۸» بکش — این می‌شه بدن و بال‌های پروانه!',
          svg: '<svg viewBox="0 0 200 170" xmlns="http://www.w3.org/2000/svg"><text x="100" y="120" font-size="120" font-weight="900" text-anchor="middle" fill="#fff3e0" stroke="#5d4e37" stroke-width="4">۸</text></svg>'
        },
        {
          text: 'یک خط عمودی وسط «۸» بکش تا بدن پروانه معلوم بشه.',
          svg: '<svg viewBox="0 0 200 170" xmlns="http://www.w3.org/2000/svg"><text x="100" y="120" font-size="120" font-weight="900" text-anchor="middle" fill="#fff3e0" stroke="#5d4e37" stroke-width="4">۸</text><line x1="100" y1="50" x2="100" y2="130" stroke="#5d4e37" stroke-width="6" stroke-linecap="round"/></svg>'
        },
        {
          text: 'حالا شکل «۸» را به بال‌های گرد تبدیل کن — مثل پروانه!',
          svg: '<svg viewBox="0 0 200 170" xmlns="http://www.w3.org/2000/svg"><ellipse cx="60" cy="78" rx="30" ry="38" fill="#fff3e0" stroke="#5d4e37" stroke-width="4"/><ellipse cx="140" cy="78" rx="30" ry="38" fill="#fff3e0" stroke="#5d4e37" stroke-width="4"/><ellipse cx="60" cy="118" rx="22" ry="28" fill="#fff3e0" stroke="#5d4e37" stroke-width="4"/><ellipse cx="140" cy="118" rx="22" ry="28" fill="#fff3e0" stroke="#5d4e37" stroke-width="4"/><line x1="100" y1="60" x2="100" y2="140" stroke="#5d4e37" stroke-width="6" stroke-linecap="round"/></svg>'
        },
        {
          text: 'دو شاخک بالای سر، و کناره‌های بال‌ها را گرد کن.',
          svg: '<svg viewBox="0 0 200 170" xmlns="http://www.w3.org/2000/svg"><ellipse cx="60" cy="78" rx="30" ry="38" fill="#ce93d8" stroke="#5d4e37" stroke-width="4"/><ellipse cx="140" cy="78" rx="30" ry="38" fill="#ce93d8" stroke="#5d4e37" stroke-width="4"/><ellipse cx="60" cy="118" rx="22" ry="28" fill="#ba68c8" stroke="#5d4e37" stroke-width="4"/><ellipse cx="140" cy="118" rx="22" ry="28" fill="#ba68c8" stroke="#5d4e37" stroke-width="4"/><line x1="100" y1="60" x2="100" y2="140" stroke="#5d4e37" stroke-width="6" stroke-linecap="round"/><path d="M94 56 Q80 32 72 26 M106 56 Q120 32 128 26" fill="none" stroke="#5d4e37" stroke-width="3" stroke-linecap="round"/></svg>'
        },
        {
          text: 'بال‌ها را با رنگ و خال‌های قشنگ پر کن. تمام شد! 🦋✨',
          svg: '<svg viewBox="0 0 200 170" xmlns="http://www.w3.org/2000/svg"><ellipse cx="60" cy="78" rx="30" ry="38" fill="#ce93d8" stroke="#5d4e37" stroke-width="4"/><ellipse cx="140" cy="78" rx="30" ry="38" fill="#ce93d8" stroke="#5d4e37" stroke-width="4"/><ellipse cx="60" cy="118" rx="22" ry="28" fill="#ba68c8" stroke="#5d4e37" stroke-width="4"/><ellipse cx="140" cy="118" rx="22" ry="28" fill="#ba68c8" stroke="#5d4e37" stroke-width="4"/><line x1="100" y1="60" x2="100" y2="140" stroke="#5d4e37" stroke-width="6" stroke-linecap="round"/><path d="M94 56 Q80 32 72 26 M106 56 Q120 32 128 26" fill="none" stroke="#5d4e37" stroke-width="3" stroke-linecap="round"/><circle cx="50" cy="64" r="6" fill="#fff59d"/><circle cx="68" cy="84" r="5" fill="#fff59d"/><circle cx="130" cy="64" r="6" fill="#fff59d"/><circle cx="148" cy="84" r="5" fill="#fff59d"/><circle cx="60" cy="120" r="4" fill="#fff59d"/><circle cx="142" cy="120" r="4" fill="#fff59d"/></svg>'
        }
      ]
    },

    /* ---------- متد ۲: تکنیک نقطه‌چین (Stippling) ---------- */
    {
      id: 'starry-sky',
      title: 'آسمان پرستاره',
      emoji: '🌌',
      level: 'متوسط',
      tag: 'نقطه‌چین',
      steps: [
        {
          text: 'یک خط افق بکش و نیمهٔ پایین را با قهوه‌ای پر کن — این زمین است.',
          svg: '<svg viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg"><rect x="0" y="80" width="200" height="70" fill="#6d4c41"/><line x1="0" y1="80" x2="200" y2="80" stroke="#5d4e37" stroke-width="3"/></svg>'
        },
        {
          text: 'نیمهٔ بالا را با آبی تیره پر کن — این آسمان شب است.',
          svg: '<svg viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg"><rect x="0" y="0" width="200" height="80" fill="#1a237e"/><rect x="0" y="80" width="200" height="70" fill="#6d4c41"/><line x1="0" y1="80" x2="200" y2="80" stroke="#5d4e37" stroke-width="3"/></svg>'
        },
        {
          text: 'حالا تکنیک «نقطه‌چین» — با قلم نازک، چند ستارهٔ کوچک بکش.',
          svg: '<svg viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg"><rect x="0" y="0" width="200" height="80" fill="#1a237e"/><rect x="0" y="80" width="200" height="70" fill="#6d4c41"/><line x1="0" y1="80" x2="200" y2="80" stroke="#5d4e37" stroke-width="3"/><circle cx="30" cy="20" r="2" fill="#fff59d"/><circle cx="60" cy="40" r="1.5" fill="#fff" stroke="#fff" stroke-width="0"/><circle cx="90" cy="22" r="2" fill="#fff59d"/><circle cx="120" cy="50" r="1.5" fill="#fff" stroke="#fff" stroke-width="0"/><circle cx="160" cy="30" r="2" fill="#fff59d"/><circle cx="50" cy="65" r="1.5" fill="#fff" stroke="#fff" stroke-width="0"/><circle cx="110" cy="14" r="1.5" fill="#fff" stroke="#fff" stroke-width="0"/><circle cx="180" cy="60" r="2" fill="#fff59d"/></svg>'
        },
        {
          text: 'تعداد نقطه‌ها را زیاد کن تا آسمان پرستاره بشه.',
          svg: '<svg viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg"><rect x="0" y="0" width="200" height="80" fill="#1a237e"/><rect x="0" y="80" width="200" height="70" fill="#6d4c41"/><line x1="0" y1="80" x2="200" y2="80" stroke="#5d4e37" stroke-width="3"/><g fill="#fff59d"><circle cx="30" cy="20" r="2"/><circle cx="90" cy="22" r="2"/><circle cx="160" cy="30" r="2"/><circle cx="180" cy="60" r="2"/><circle cx="40" cy="50" r="1.5"/><circle cx="100" cy="40" r="1.5"/><circle cx="150" cy="60" r="1.5"/></g><g fill="#fff"><circle cx="20" cy="35" r="1"/><circle cx="55" cy="15" r="1"/><circle cx="70" cy="55" r="1"/><circle cx="80" cy="38" r="1"/><circle cx="105" cy="62" r="1"/><circle cx="115" cy="20" r="1"/><circle cx="130" cy="14" r="1"/><circle cx="145" cy="46" r="1"/><circle cx="170" cy="18" r="1"/><circle cx="190" cy="46" r="1"/><circle cx="65" cy="68" r="1"/><circle cx="48" cy="30" r="1"/><circle cx="125" cy="35" r="1"/><circle cx="200" cy="40" r="1"/></g></svg>'
        },
        {
          text: 'یک ماه بزرگ با صورت خندان بکش. آسمان شبِ تو آماده است! 🌙',
          svg: '<svg viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg"><rect x="0" y="0" width="200" height="80" fill="#1a237e"/><rect x="0" y="80" width="200" height="70" fill="#6d4c41"/><line x1="0" y1="80" x2="200" y2="80" stroke="#5d4e37" stroke-width="3"/><g fill="#fff59d"><circle cx="30" cy="20" r="2"/><circle cx="90" cy="22" r="2"/><circle cx="160" cy="30" r="2"/><circle cx="180" cy="60" r="2"/><circle cx="40" cy="50" r="1.5"/><circle cx="100" cy="40" r="1.5"/><circle cx="150" cy="60" r="1.5"/></g><g fill="#fff"><circle cx="20" cy="35" r="1"/><circle cx="55" cy="15" r="1"/><circle cx="70" cy="55" r="1"/><circle cx="80" cy="38" r="1"/><circle cx="105" cy="62" r="1"/><circle cx="115" cy="20" r="1"/><circle cx="130" cy="14" r="1"/><circle cx="145" cy="46" r="1"/><circle cx="170" cy="18" r="1"/><circle cx="190" cy="46" r="1"/><circle cx="65" cy="68" r="1"/><circle cx="48" cy="30" r="1"/><circle cx="125" cy="35" r="1"/></g><circle cx="46" cy="36" r="14" fill="#fff59d" stroke="#5d4e37" stroke-width="3"/><circle cx="42" cy="32" r="1.5" fill="#5d4e37"/><circle cx="52" cy="32" r="1.5" fill="#5d4e37"/><path d="M40 38 q6 4 12 0" fill="none" stroke="#5d4e37" stroke-width="2" stroke-linecap="round"/><path d="M58 22 L66 14 M62 32 L72 30 M58 50 L66 56" stroke="#fff" stroke-width="1.5" stroke-linecap="round"/></svg>'
        }
      ]
    },

    /* ---------- متد ۳: تکنیک لایه‌بندی (Layering / عمق) ---------- */
    {
      id: 'layered-landscape',
      title: 'منظرهٔ سه‌لایه',
      emoji: '🏞️',
      level: 'پیشرفته',
      tag: 'لایه‌بندی',
      steps: [
        {
          text: 'یک خط افق بکش. لایهٔ ۱: کوه‌های دور با رنگ آبی کمرنگ.',
          svg: '<svg viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg"><line x1="0" y1="100" x2="200" y2="100" stroke="#5d4e37" stroke-width="2"/><path d="M0 100 L40 60 L80 100 Z" fill="#bbdefb" stroke="#5d4e37" stroke-width="3"/><path d="M60 100 L100 50 L140 100 Z" fill="#bbdefb" stroke="#5d4e37" stroke-width="3"/><path d="M120 100 L165 65 L200 100 Z" fill="#bbdefb" stroke="#5d4e37" stroke-width="3"/></svg>'
        },
        {
          text: 'لایهٔ ۲: تپه‌های میانی با سبز روشن — کمی جلوتر از کوه‌ها.',
          svg: '<svg viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg"><line x1="0" y1="100" x2="200" y2="100" stroke="#5d4e37" stroke-width="2"/><path d="M0 100 L40 60 L80 100 Z" fill="#bbdefb" stroke="#5d4e37" stroke-width="3"/><path d="M60 100 L100 50 L140 100 Z" fill="#bbdefb" stroke="#5d4e37" stroke-width="3"/><path d="M120 100 L165 65 L200 100 Z" fill="#bbdefb" stroke="#5d4e37" stroke-width="3"/><path d="M0 100 Q25 80 50 100 Q75 78 100 100 Q125 76 150 100 Q175 78 200 100 Z" fill="#aed581" stroke="#5d4e37" stroke-width="3"/></svg>'
        },
        {
          text: 'لایهٔ ۳: چمن جلویی با سبز پُررنگ — رنگش از لایهٔ قبل تیره‌تره.',
          svg: '<svg viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg"><line x1="0" y1="100" x2="200" y2="100" stroke="#5d4e37" stroke-width="2"/><path d="M0 100 L40 60 L80 100 Z" fill="#bbdefb" stroke="#5d4e37" stroke-width="3"/><path d="M60 100 L100 50 L140 100 Z" fill="#bbdefb" stroke="#5d4e37" stroke-width="3"/><path d="M120 100 L165 65 L200 100 Z" fill="#bbdefb" stroke="#5d4e37" stroke-width="3"/><path d="M0 100 Q25 80 50 100 Q75 78 100 100 Q125 76 150 100 Q175 78 200 100 Z" fill="#aed581" stroke="#5d4e37" stroke-width="3"/><path d="M0 100 Q40 112 80 100 Q120 110 160 100 Q200 112 200 100 L200 150 L0 150 Z" fill="#388e3c" stroke="#5d4e37" stroke-width="3"/></svg>'
        },
        {
          text: 'یک درخت بزرگ در لایهٔ جلویی بکش و رنگ‌های سه لایه را ببین!',
          svg: '<svg viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg"><line x1="0" y1="100" x2="200" y2="100" stroke="#5d4e37" stroke-width="2"/><path d="M0 100 L40 60 L80 100 Z" fill="#bbdefb" stroke="#5d4e37" stroke-width="3"/><path d="M60 100 L100 50 L140 100 Z" fill="#bbdefb" stroke="#5d4e37" stroke-width="3"/><path d="M120 100 L165 65 L200 100 Z" fill="#bbdefb" stroke="#5d4e37" stroke-width="3"/><path d="M0 100 Q25 80 50 100 Q75 78 100 100 Q125 76 150 100 Q175 78 200 100 Z" fill="#aed581" stroke="#5d4e37" stroke-width="3"/><path d="M0 100 Q40 112 80 100 Q120 110 160 100 Q200 112 200 100 L200 150 L0 150 Z" fill="#388e3c" stroke="#5d4e37" stroke-width="3"/><rect x="44" y="80" width="8" height="34" fill="#6d4c41" stroke="#5d4e37" stroke-width="2"/><circle cx="48" cy="68" r="22" fill="#2e7d32" stroke="#5d4e37" stroke-width="3"/></svg>'
        },
        {
          text: 'یک خورشید، یک ابر کوچک و چند گل اضافه کن. منظورهٔ تو کامل شد! 🌄',
          svg: '<svg viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg"><line x1="0" y1="100" x2="200" y2="100" stroke="#5d4e37" stroke-width="2"/><path d="M0 100 L40 60 L80 100 Z" fill="#bbdefb" stroke="#5d4e37" stroke-width="3"/><path d="M60 100 L100 50 L140 100 Z" fill="#bbdefb" stroke="#5d4e37" stroke-width="3"/><path d="M120 100 L165 65 L200 100 Z" fill="#bbdefb" stroke="#5d4e37" stroke-width="3"/><path d="M0 100 Q25 80 50 100 Q75 78 100 100 Q125 76 150 100 Q175 78 200 100 Z" fill="#aed581" stroke="#5d4e37" stroke-width="3"/><path d="M0 100 Q40 112 80 100 Q120 110 160 100 Q200 112 200 100 L200 150 L0 150 Z" fill="#388e3c" stroke="#5d4e37" stroke-width="3"/><rect x="44" y="80" width="8" height="34" fill="#6d4c41" stroke="#5d4e37" stroke-width="2"/><circle cx="48" cy="68" r="22" fill="#2e7d32" stroke="#5d4e37" stroke-width="3"/><circle cx="170" cy="26" r="12" fill="#ffd54f" stroke="#5d4e37" stroke-width="3"/><path d="M170 9 L170 5 M170 42 L170 46 M153 26 L149 26 M187 26 L191 26 M158 14 L155 11 M182 38 L185 41 M158 38 L155 41 M182 14 L185 11" stroke="#ffd54f" stroke-width="2" stroke-linecap="round"/><ellipse cx="155" cy="44" rx="14" ry="6" fill="#fff" stroke="#5d4e37" stroke-width="2"/><circle cx="100" cy="138" r="3" fill="#f06292"/><circle cx="120" cy="142" r="3" fill="#ffd54f"/><circle cx="140" cy="138" r="3" fill="#ce93d8"/></svg>'
        }
      ]
    }
  ];

  /* ---------- ترفندهای طلایی ---------- */

  const TIPS = [
    { emoji: '🌈', title: 'از شکل‌های ساده شروع کن', text: 'خانه، گربه و ماهی... همه با دایره، مربع و مثلث ساخته شده‌اند. اول شکل‌های ساده را بکش، بعد جزئیات را اضافه کن!' },
    { emoji: '✏️', title: 'خط‌های کمک کمرنگ بکش', text: 'اول طرح را با مداد خیلی کمرنگ بکش. وقتی مطمئن شدی شکل درست است، با قلم‌مو رویش پررنگ بکش.' },
    { emoji: '🧩', title: 'اول بزرگ، بعد ریز', text: 'اول شکل‌های بزرگ را سر جایشان بگذار، بعد چشم‌ها، دکمه‌ها و جزئیات ریز را اضافه کن. این‌طوری هیچ‌چیز جا نمی‌ماند!' },
    { emoji: '🎨', title: 'رنگ‌های همسایه', text: 'رنگ‌هایی که در رنگین‌کمان کنار هم هستند، کنار هم قشنگ‌تر دیده می‌شوند؛ مثل آبی و سبز، یا صورتی و بنفش.' },
    { emoji: '🧽', title: 'اشتباه؟ اشکالی ندارد!', text: 'هر نقاش بزرگی هزار بار اشتباه کرده است. پاک‌کن دوست توست؛ پاک کن و دوباره بکش. مهم شجاعت کشیدن است!' },
    { emoji: '🌟', title: 'هر روز یک شاهکار', text: 'هر روز کمی نقاشی بکش. نقاشی‌هایت را در آلبوم نگه دار تا ببینی هر هفته چقدر بهتر شده‌ای!' },
    { emoji: '🧮', title: 'از عدد بکش!', text: 'متد جدید: با اعداد نقاشی بکش! عدد «۸» می‌شه پروانه، عدد «۳» می‌شه گربه، و عدد «۰» می‌شه یک چشم درشت. عدد دوست توئه!' },
    { emoji: '✨', title: 'تکنیک نقطه‌چین', text: 'برای آسمان شب، مه و دانه‌های برف، به جای خط از نقطه‌های ریز استفاده کن. با ابزار «نئون» و ضخامت کم، آسمان پرستاره بکش!' },
    { emoji: '🏞️', title: 'تکنیک سه لایه', text: 'برای نقاشی منظره، سه لایه رنگی بکش: لایهٔ دور (آبی کمرنگ)، لایهٔ میانی (سبز روشن)، لایهٔ جلو (سبز پُررنگ). عمق نقاشی چند برابر می‌شه!' }
  ];

  /* ---------- رندر رابط کاربری ---------- */

  let els = {};
  let currentTutorial = null;
  let currentStep = 0;
  let progress = {};

  function loadProgress() {
    progress = g.StorageCore.loadProgress();
  }

  function isStepDone(tutId, idx) {
    const arr = progress[tutId];
    return Array.isArray(arr) && arr.indexOf(idx) !== -1;
  }

  function markStepDone(tutId, idx) {
    if (!Array.isArray(progress[tutId])) progress[tutId] = [];
    if (progress[tutId].indexOf(idx) === -1) progress[tutId].push(idx);
    g.StorageCore.saveProgress(progress);

    // دستاورد: اولین قدم
    if (g.Achievements && g.Achievements.checkFirstStep) g.Achievements.checkFirstStep();
  }

  function tutorialsCompletedCount() {
    let n = 0;
    TUTORIALS.forEach(function (tut) {
      if (tutorialDoneCount(tut) === tut.steps.length) n++;
    });
    return n;
  }

  function tutorialDoneCount(tut) {
    let n = 0;
    for (let i = 0; i < tut.steps.length; i++) {
      if (isStepDone(tut.id, i)) n++;
    }
    return n;
  }

  function renderHome() {
    els.lessonGrid.innerHTML = '';
    TUTORIALS.forEach(function (tut) {
      const done = tutorialDoneCount(tut);
      const card = document.createElement('button');
      card.type = 'button';
      card.className = 'lesson-card' + (done === tut.steps.length ? ' is-done' : '');
      card.dataset.id = tut.id;

      const emoji = document.createElement('span');
      emoji.className = 'lesson-emoji';
      emoji.textContent = tut.emoji;
      emoji.setAttribute('aria-hidden', 'true');

      const title = document.createElement('h3');
      title.textContent = tut.title;

      const badge = document.createElement('span');
      badge.className = 'badge';
      badge.textContent = tut.level;

      const line = document.createElement('span');
      line.className = 'progress-line';
      line.textContent = '✅ ' + done + ' از ' + tut.steps.length + ' قدم';

      card.appendChild(emoji);
      card.appendChild(title);
      card.appendChild(badge);
      card.appendChild(line);
      els.lessonGrid.appendChild(card);
    });

    els.tipsGrid.innerHTML = '';
    TIPS.forEach(function (tip) {
      const card = document.createElement('article');
      card.className = 'tip-card';
      const emoji = document.createElement('div');
      emoji.className = 'tip-emoji';
      emoji.textContent = tip.emoji;
      emoji.setAttribute('aria-hidden', 'true');
      const title = document.createElement('h4');
      title.textContent = tip.title;
      const text = document.createElement('p');
      text.textContent = tip.text;
      card.appendChild(emoji);
      card.appendChild(title);
      card.appendChild(text);
      els.tipsGrid.appendChild(card);
    });
  }

  function openTutorial(id) {
    const tut = TUTORIALS.find(function (t) { return t.id === id; });
    if (!tut) return;
    currentTutorial = tut;
    currentStep = 0;
    els.learnHome.classList.add('is-hidden');
    els.learnDetail.classList.remove('is-hidden');
    renderDetail();
  }

  function closeTutorial() {
    els.learnDetail.classList.add('is-hidden');
    els.learnHome.classList.remove('is-hidden');
    currentTutorial = null;
    renderHome();
  }

  function renderDetail() {
    const tut = currentTutorial;
    if (!tut) return;
    const step = tut.steps[currentStep];

    els.lessonEmoji.textContent = tut.emoji;
    els.lessonTitle.textContent = tut.title;
    els.lessonLevel.textContent = tut.level;
    els.stepIndicator.textContent = 'قدم ' + g.Utils.toFaDigits(currentStep + 1) + ' از ' + g.Utils.toFaDigits(tut.steps.length);
    els.stepSvg.innerHTML = step.svg; // SVG ثابت و مورد اعتماد (دادهٔ داخلی برنامه)
    els.stepText.textContent = step.text;

    els.stepPrev.disabled = currentStep === 0;
    els.stepNext.disabled = currentStep === tut.steps.length - 1;

    const done = isStepDone(tut.id, currentStep);
    els.stepDone.classList.toggle('is-done', done);
    els.stepDone.textContent = done ? '✓ یاد گرفتم!' : '✅ این قدم را یاد گرفتم!';

    const allDone = tutorialDoneCount(tut) === tut.steps.length;
    els.lessonDone.classList.toggle('is-hidden', !allDone);
  }

  function init(opts) {
    els = opts;
    loadProgress();
    els.lessonGrid.addEventListener('click', function (e) {
      const card = e.target.closest('.lesson-card');
      if (card) openTutorial(card.dataset.id);
    });
    els.lessonBack.addEventListener('click', closeTutorial);
    els.stepPrev.addEventListener('click', function () {
      if (currentStep > 0) { currentStep--; renderDetail(); }
    });
    els.stepNext.addEventListener('click', function () {
      if (currentTutorial && currentStep < currentTutorial.steps.length - 1) {
        currentStep++;
        renderDetail();
      }
    });
    els.stepDone.addEventListener('click', function () {
      if (!currentTutorial) return;
      markStepDone(currentTutorial.id, currentStep);
      renderDetail();
      renderHome();
      g.Sound.save();

      // دستاورد: تعداد آموزش‌های کامل‌شده
      if (g.Achievements && g.Achievements.checkAllTutorials) {
        g.Achievements.checkAllTutorials(tutorialsCompletedCount(), TUTORIALS.length);
      }
    });
    renderHome();
  }

  /* ---------- خروجی ---------- */

  const api = { TUTORIALS: TUTORIALS, TIPS: TIPS, init: init };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { TUTORIALS: TUTORIALS, TIPS: TIPS };
  }
  g.Tutorials = api;
})(typeof window !== 'undefined' ? window : globalThis);
