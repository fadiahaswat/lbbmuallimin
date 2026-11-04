import fs from 'fs';
const raw = fs.readFileSync('LOGO TONTI MU\'ALLIMIN.svg', 'utf8');
const lines = raw.split(/\r?\n/);
const CX = 4572, CY = 8127.99;

const d = lines[69].match(/d="([^"]+)"/)[1];
const parts = d.split('zm');
parts.forEach((p, idx) => {
  const m = p.match(/[Mm]\s*([-0-9.]+)\s*([-0-9.]+)/);
  if (m) {
    const x = parseFloat(m[1]), y = parseFloat(m[2]);
    const ang = Math.atan2(y - CY, x - CX) * 180 / Math.PI;
    console.log(`Subpath ${idx}: (${x}, ${y}) ang = ${ang.toFixed(1)}`);
  }
});
