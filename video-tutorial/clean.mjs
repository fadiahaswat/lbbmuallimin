import fs from 'fs';
let s = fs.readFileSync('scene90.html', 'utf8');

// Replace mojibake and replace with clean ASCII/clean icons
s = s.replace(/ðŸ[^\s<"]*/g, '')
     .replace(/â[^\s<"]*/g, '')
     .replace(/[""]/g, '"')
     .replace(/[–—]/g, '-')
     .replace(/👤/g, 'J')
     .replace(/🎖/g, '★')
     .replace(/⭐/g, '★')
     .replace(/✔/g, '✓')
     .replace(/🏆/g, '★')
     .replace(/🥇/g, '1')
     .replace(/🥈/g, '2')
     .replace(/🥉/g, '3')
     .replace(/💰/g, 'Rp')
     .replace(/📜/g, 'DOC')
     .replace(/📅/g, '')
     .replace(/🔥/g, '')
     .replace(/⚠️/g, '!')
     .replace(/⏱/g, '')
     .replace(/⚡/g, '•')
     .replace(/📡/g, '•')
     .replace(/💬/g, 'WA')
     .replace(/📷/g, 'IG')
     .replace(/🌐/g, '')
     .replace(/🖨/g, '')
     .replace(/📍/g, '')
     .replace(/⧉/g, '')
     .replace(/•\s*•/g, '•');

// Specific text fixes:
s = s.replace('Standar Resmi: Perpang TNI No. 57 & 58 Tahun 2018', 'Standar Resmi: Perpang TNI No. 57 & 58 Tahun 2018')
     .replace('Perebutan PIALA BERGILIR GUBERNUR DIY', 'Perebutan PIALA BERGILIR GUBERNUR DIY')
     .replace('19 Okt - 29 Nov 2026', '19 Okt - 29 Nov 2026')
     .replace('Ahad, 24 Januari 2027', 'Ahad, 24 Januari 2027')
     .replace('19 Okt - 8 Nov 2026', '19 Okt - 8 Nov 2026')
     .replace('9 - 29 Nov 2026', '9 - 29 Nov 2026');

// Replace non-ascii with nothing
s = s.replace(/[^\x00-\x7F]/g, '');

fs.writeFileSync('scene90.html', s, 'utf8');
console.log('clean done');
