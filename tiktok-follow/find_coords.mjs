import { chromium } from '../video-tutorial/node_modules/playwright-core/index.mjs';
import path from 'path';
import { pathToFileURL } from 'url';

const browser = await chromium.launch({
  executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  headless: true
});
const page = await browser.newPage({ viewport: { width: 590, height: 1280 } });
const imgUrl = pathToFileURL(path.resolve('assets/follow.jpg')).href;
await page.goto(imgUrl);

const info = await page.evaluate(() => {
  const img = document.querySelector('img');
  const canvas = document.createElement('canvas');
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0);

  // Avatar center and radius
  // Avatar is an orange circular badge on left side around y=180-320, x=20-160
  // Let's find avatar bounding box:
  let avTop = -1, avBottom = -1, avLeft = -1, avRight = -1;
  for (let y = 160; y < 350; y++) {
    for (let x = 10; x < 200; x++) {
      const d = ctx.getImageData(x, y, 1, 1).data;
      // Orange/gold avatar has high red and green, lower blue: e.g. R > 150, G > 90, B < 80
      if (d[0] > 140 && d[1] > 80 && d[2] < 70) {
        if (avTop === -1 || y < avTop) avTop = y;
        if (y > avBottom) avBottom = y;
        if (avLeft === -1 || x < avLeft) avLeft = x;
        if (x > avRight) avRight = x;
      }
    }
  }

  // Bio lines are below avatar and above buttons (between y=320 and y=450)
  // Let's check text lines by horizontal projection of white pixels (R>180, G>180, B>180)
  const lineDensity = [];
  for (let y = 320; y < 450; y++) {
    let whiteCount = 0;
    for (let x = 20; x < 550; x++) {
      const d = ctx.getImageData(x, y, 1, 1).data;
      if (d[0] > 180 && d[1] > 180 && d[2] > 180) whiteCount++;
    }
    lineDensity.push({ y, whiteCount });
  }

  return { avTop, avBottom, avLeft, avRight, lineDensity: lineDensity.filter(l => l.whiteCount > 15) };
});

console.log('Avatar:', { top: info.avTop, bottom: info.avBottom, left: info.avLeft, right: info.avRight });
console.log('Line density peaks:', info.lineDensity.map(l => l.y));
await browser.close();
