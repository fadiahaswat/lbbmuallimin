import fs from 'fs';
const raw = fs.readFileSync('LOGO TONTI MU\'ALLIMIN.svg', 'utf8');
const lines = raw.split(/\r?\n/);
const starLine = lines[68];
const d = starLine.match(/d="([^"]+)"/)[1];
const parts = d.split('z').map(s => s.trim()).filter(Boolean);

let curX = 0, curY = 0;
const stars = [];

for (let i = 0; i < parts.length; i++) {
  const p = parts[i];
  // extract initial command
  let startX, startY;
  if (p.startsWith('M')) {
    const coords = p.slice(1).trim().split(/[\s,]+/);
    startX = parseFloat(coords[0]);
    startY = parseFloat(coords[1]);
  } else if (p.startsWith('m')) {
    const coords = p.slice(1).trim().split(/[\s,]+/);
    startX = curX + parseFloat(coords[0]);
    startY = curY + parseFloat(coords[1]);
  }
  
  // Create an absolute path for this single star:
  // replace initial M/m with `M ${startX} ${startY}`
  const bodyWithoutInitial = p.replace(/^[Mm]\s*[-0-9.]+\s*[-0-9.]+/, '');
  const absPath = `M${startX} ${startY}${bodyWithoutInitial}z`;

  // calculate approx center:
  // Each star has top tip at startX, startY
  // and bottom extent around startY + 290
  const cx = startX;
  const cy = startY + 145;

  stars.push({ index: i, startX, startY, cx, cy, d: absPath });
  curX = startX;
  curY = startY;
}

// Sort stars from left to right by cx
stars.sort((a, b) => a.cx - b.cx);
console.log('Stars sorted left to right:');
stars.forEach((s, idx) => {
  console.log(`Star ${idx + 1}: cx=${s.cx}, cy=${s.cy}, startX=${s.startX}, startY=${s.startY}`);
});
fs.writeFileSync('tonti-motion/stars_parsed.json', JSON.stringify(stars, null, 2));
