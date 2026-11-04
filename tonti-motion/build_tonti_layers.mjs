// build_tonti_layers.mjs
// Extracts individual vector layers from "LOGO TONTI MU'ALLIMIN.svg"
// Strictly only elements from the SVG:
// 1. Monogram HW
// 2. Tameng (Shield)
// 3. 2 Pedang (Left & Right Swords with Clash capability)
// 4. 5 Bintang (Each star individually isolated with exact coordinates)
// 5. Beberapa Layer Lingkaran (Concentric Rings)
// 6. Tulisan Caraka dan Tonti (Curved Typography for circular track reveal)
// 7. Bendera Merah Putih (Unified Background & Ring Band flag)

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const dir = path.dirname(fileURLToPath(import.meta.url));
const svgPath = path.resolve(dir, '..', "LOGO TONTI MU'ALLIMIN.svg");
const raw = fs.readFileSync(svgPath, 'utf8');
const lines = raw.split(/\r?\n/);

// Extract defs (styles + clipPath id0 & id1)
const defs = lines.slice(7, 27).join('\n');

function wrapSvg(body, extraDefs = '') {
  return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 9144 16255.98" style="shape-rendering:geometricPrecision;text-rendering:geometricPrecision;fill-rule:evenodd;clip-rule:evenodd">${defs.replace('</defs>', extraDefs + '</defs>')}<g>${body}</g></svg>`;
}

// 1. Monogram HW (Line 68)
const monogramHwSvg = wrapSvg(lines[67]); // fil7 white HW intertwined

// 2. Tameng (Shield - Lines 57, 58, 59)
const shieldOuterSvg = wrapSvg(lines[56]); // fil4 black outer
const shieldWhiteSvg = wrapSvg(lines[57]); // fil3 white contour
const shieldInnerSvg = wrapSvg(lines[58]); // fil6 black inner field
const shieldFullSvg  = wrapSvg(`${lines[56]}\n${lines[57]}\n${lines[58]}`);

// 3. Pedang (Swords)
// Sword Left (Lines 60..63)
const swordLeftSvg  = wrapSvg(lines.slice(59, 63).join('\n'));
// Sword Right (Lines 64..67)
const swordRightSvg = wrapSvg(lines.slice(63, 67).join('\n'));
const swordsBothSvg = wrapSvg(lines.slice(59, 67).join('\n'));

// 4. 5 Bintang (Parse each star individually from Line 69)
const starLine = lines[68];
const starD = starLine.match(/d="([^"]+)"/)[1];
const starParts = starD.split('z').map(s => s.trim()).filter(Boolean);

let curX = 0, curY = 0;
const starsRaw = [];
for (let i = 0; i < starParts.length; i++) {
  const p = starParts[i];
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
  const bodyWithoutInitial = p.replace(/^[Mm]\s*[-0-9.]+\s*[-0-9.]+/, '');
  const absPath = `M${startX} ${startY}${bodyWithoutInitial}z`;
  starsRaw.push({
    startX,
    startY,
    cx: startX,
    cy: startY + 145,
    d: absPath
  });
  curX = startX;
  curY = startY;
}
// Sort stars left-to-right
starsRaw.sort((a, b) => a.cx - b.cx);

const starsMeta = starsRaw.map((s, idx) => ({
  id: idx + 1,
  cx: s.cx,
  cy: s.cy,
  canvasCx: s.cx * (1080 / 9144),
  canvasCy: s.cy * (1080 / 9144)
}));

const starSvgList = starsRaw.map(s => wrapSvg(`<path class="fil3" d="${s.d}"/>`));
const starsSvg = wrapSvg(lines[68]); // All 5 stars together

// 5. Beberapa Layer Lingkaran (Concentric Rings)
const circleOuterWhiteSvg = wrapSvg(lines[40]); // fil3 r=3373.05
const circleOuterBlackSvg = wrapSvg(lines[41]); // fil4 r=3246.06
const circleInnerWhiteSvg = wrapSvg(lines[42]); // fil3 r=3034.40
const circleBandBlackSvg  = wrapSvg(lines[52]); // fil4 r=2298.88
const circleBandWhiteSvg  = wrapSvg(lines[53]); // fil3 r=2087.22
const circleCoreBlackSvg  = wrapSvg(lines[54]); // fil4 r=1960.23

// 6. Tulisan Caraka dan Tonti
const textCarakaSvg = wrapSvg(lines[55]); // fil5 "CARAKA BHASKARA MUDA"
const textTontiSvg  = wrapSvg(lines[69]); // fil6 "TONTI MU'ALLIMIN"

// 7. Bendera Merah Putih
// Complete background flag (Lines 32..39)
const flagFullSvg = wrapSvg(lines.slice(31, 39).join('\n'));
// Inner circle flag clipped to id1 (Lines 44..51)
const flagCircleSvg = wrapSvg(lines.slice(43, 51).join('\n'));

const payload = {
  vbW: 9144,
  vbH: 16255.98,
  cx: 4572,
  cy: 8127.99,
  starsMeta,
  layers: {
    monogramHwSvg,
    shieldOuterSvg,
    shieldWhiteSvg,
    shieldInnerSvg,
    shieldFullSvg,
    swordLeftSvg,
    swordRightSvg,
    swordsBothSvg,
    starsSvg,
    star1Svg: starSvgList[0],
    star2Svg: starSvgList[1],
    star3Svg: starSvgList[2],
    star4Svg: starSvgList[3],
    star5Svg: starSvgList[4],
    circleOuterWhiteSvg,
    circleOuterBlackSvg,
    circleInnerWhiteSvg,
    circleBandBlackSvg,
    circleBandWhiteSvg,
    circleCoreBlackSvg,
    textCarakaSvg,
    textTontiSvg,
    flagFullSvg,
    flagCircleSvg
  }
};

const outJs = path.join(dir, 'tonti_layers.js');
fs.writeFileSync(outJs, `window.TONTI_LAYERS = ${JSON.stringify(payload)};\nif (typeof module !== 'undefined') module.exports = window.TONTI_LAYERS;\n`);
console.log('Wrote tonti_layers.js successfully. Layer keys:', Object.keys(payload.layers));
console.log('Stars meta:', starsMeta);
