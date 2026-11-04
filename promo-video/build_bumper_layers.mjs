// Parses "LOGO LBB MU'ALLIMIN 2027.svg" and generates promo-video/bumper_layers.js
// Optimized for:
// 1. Unified Backplate (Drop shadow + white sticker contour + black inner plate as ONE intact piece)
// 2. Full MUALLIMIN masked wordmark (full red top + white bottom 9-letter graphic)
// 3. Full 3D gold LBB letters (with specular highlight mask)
// 4. Intact Checkered Flags (cloth + pole)
// 5. Intact Waving Indonesian Flags (left & right)
// 6. 3D Silver 2027 digits
// 7. Shield layers & solar rayburst points
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const dir = path.dirname(fileURLToPath(import.meta.url));
const svgPath = path.resolve(dir, '..', "LOGO LBB MU'ALLIMIN 2027.svg");
const raw = fs.readFileSync(svgPath, 'utf8');
const lines = raw.split(/\r?\n/);

const defs = lines.slice(7, 217).join('\n');

function getAttr(line, attr) {
  const r = new RegExp(`${attr}="([^"]+)"`);
  const m = line.match(r);
  return m ? m[1] : '';
}

function wrapSvg(body, extraDefs = '') {
  return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 19306.8 18627.2" style="fill-rule:evenodd;clip-rule:evenodd">${defs.replace('</defs>', extraDefs + '</defs>')}<g>${body}</g></svg>`;
}

// 1. Shield layers
const shieldOuterSvg   = wrapSvg(lines.slice(219, 227).join('\n'));
const shieldGoldSvg    = wrapSvg(lines.slice(227, 235).join('\n'));
const shieldCorePath   = getAttr(lines[235], 'd');
const shieldRaysPts    = getAttr(lines[307], 'points');
const shieldOuterPath  = getAttr(lines[220], 'd');
const shieldGoldPath   = getAttr(lines[228], 'd');
const badgeOutlinePath = getAttr(lines[316], 'd');

// 2. UNIFIED INTACT BACKPLATE (Shadow line 316 + White line 317 + Black line 318)
// User requirement: "Latar hitam dibawah tulisan LBB, bendera hitam putih, tulisan muallimin,
// dan bendera merahputih itu satu kesatuan, jangan dipotong2, itu muncul sebelum semua elemen di atasnya."
const plateShadowSvg = wrapSvg(lines[315]); // fil12 black 50% opacity shadow offset by 360px
const plateWhiteSvg  = wrapSvg(lines[316]); // fil1 white contour
const plateBlackSvg  = wrapSvg(lines[317]); // fil13 black plate (includes inner negative space holes!)

// 3. MUALLIMIN WORDMARK (Merah-Putih 9-letter graphic)
// Group _2712931400800: lines 318..373
// We keep both the full intact wordmark SVG (for smooth waving flag cloth mask effect!)
// and the individual letters metadata.
const muaFullSvg = wrapSvg(lines.slice(318, 373).join('\n'));

// 4. LBB TROPHY LETTERS (Gold 3D letters)
// Group _2712931399216: lines 374..479 (0-indexed 373..479)
const lbbFullSvg = wrapSvg(lines.slice(373, 479).join('\n'));

// 5. 2027 DIGITS
// Group _2712931430752: lines 480..503 (0-indexed 479..503)
const yrFullSvg = wrapSvg(lines.slice(479, 503).join('\n'));

// 6. CHECKERED FLAGS (Full intact cloth + rigid pole)
const fullClothL = `<polygon class="fil1" points="4989.82,4824.25 5887.75,6582.27 3552.49,7774.99 2654.56,6016.97"/>`;
const fullClothR = `<polygon class="fil1" points="14302.71,4824.25 13404.77,6582.27 15740.02,7774.99 16637.96,6016.97"/>`;
const checkSquaresL = lines.slice(527, 533).join('\n'); // 6 black checker polygons (left)
const checkSquaresR = lines.slice(537, 543).join('\n'); // 6 black checker polygons (right)
const checkPoleL    = lines[533];                       // flagpole + finial (left)
const checkPoleR    = lines[543];                       // flagpole + finial (right)

const flagCheckL = {
  clothSvg: wrapSvg(`${fullClothL}\n${checkSquaresL}`),
  poleSvg:  wrapSvg(checkPoleL),
  baseX: 6180, baseY: 7160,
  tipX: 4910,  tipY: 4560,
  poleTopX: 4989.82, poleTopY: 4824.25,
  poleAngle: Math.atan2(897.93, 1758.02),
  flySpanSvg: 3800,
  side: -1
};

const flagCheckR = {
  clothSvg: wrapSvg(`${fullClothR}\n${checkSquaresR}`),
  poleSvg:  wrapSvg(checkPoleR),
  baseX: 13112, baseY: 7160,
  tipX: 14382,  tipY: 4560,
  poleTopX: 14302.71, poleTopY: 4824.25,
  poleAngle: -Math.atan2(897.94, 1758.02),
  flySpanSvg: 3800,
  side: 1
};

// 7. WAVING INDONESIAN FLAGS (Left lines 503..514, Right lines 514..525)
const flagMpL = {
  clothSvg: wrapSvg(lines.slice(503, 514).join('\n')),
  anchorX: 5740,
  outerX: 1320,
  tipX: 2050, tipY: 12600,
  side: -1
};

const flagMpR = {
  clothSvg: wrapSvg(lines.slice(514, 525).join('\n')),
  anchorX: 13520,
  outerX: 17985,
  tipX: 17250, tipY: 12600,
  side: 1
};

const payload = {
  vbW: 19306.8,
  vbH: 18627.2,
  paths: {
    shieldOuter: shieldOuterPath,
    shieldGold: shieldGoldPath,
    shieldCore: shieldCorePath,
    shieldRaysPts,
    badgeOutline: badgeOutlinePath
  },
  shieldOuterSvg,
  shieldGoldSvg,
  plateShadowSvg,
  plateWhiteSvg,
  plateBlackSvg,
  muaFullSvg,
  lbbFullSvg,
  yrFullSvg,
  flagCheckL,
  flagCheckR,
  flagMpL,
  flagMpR
};

const outJs = `// Auto-generated from "LOGO LBB MU'ALLIMIN 2027.svg" by build_bumper_layers.mjs\nwindow.LOGO_LAYERS = ${JSON.stringify(payload)};\n`;
fs.writeFileSync(path.join(dir, 'bumper_layers.js'), outJs);
console.log('Rebuilt promo-video/bumper_layers.js (' + (outJs.length / 1024).toFixed(1) + ' KB)');
