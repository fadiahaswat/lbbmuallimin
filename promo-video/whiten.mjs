import { createRequire } from 'module';
const require = createRequire('d:/lbbmuallimin/package.json');
const sharp = require('sharp');

const src = {
  tonti: 'd:/lbbmuallimin/public/logo-tonti-muallimin.png',
  mangan: 'd:/lbbmuallimin/public/manganperpunk.png',
  muallimin: 'd:/lbbmuallimin/public/logo-muallimin.png',
};
for (const [k, f] of Object.entries(src)) {
  const { data, info } = await sharp(f).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  let min = 255, opaque = 0;
  for (let i = 3; i < data.length; i += 4) { if (data[i] < min) min = data[i]; if (data[i] > 250) opaque++; }
  console.log(k, info.width, info.height, 'minAlpha', min, 'opaque%', (100 * opaque / (data.length / 4)).toFixed(1));
  // If no transparency, derive alpha from distance to white background.
  const hasAlpha = min < 250;
  const detail = k !== 'muallimin'; // dark parts become white, light parts become transparent
  for (let i = 0; i < data.length; i += 4) {
    if (detail) {
      const lum = (0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]) / 255;
      const m = Math.min(1, Math.max(0, (0.82 - lum) / 0.5));
      data[i + 3] = Math.round(data[i + 3] * m);
    } else if (!hasAlpha) {
      const d = 255 - Math.min(data[i], data[i + 1], data[i + 2]);
      data[i + 3] = Math.min(255, d * 2);
    }
    data[i] = data[i + 1] = data[i + 2] = 255;
  }
  await sharp(data, { raw: info }).png().toFile(`d:/lbbmuallimin/promo-video/assets/${k}-white.png`);
}
