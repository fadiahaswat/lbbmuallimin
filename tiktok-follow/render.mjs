import { chromium } from '../video-tutorial/node_modules/playwright-core/index.mjs';
import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const dir = path.dirname(fileURLToPath(import.meta.url));
const FPS = 30;
const DUR = Number(process.env.DUR || 18);
const SCENE = process.env.SCENE || 'scene.html';
const CUEF = process.env.CUES || 'cues.json';
const stills = process.argv[2];

const out = path.join(dir, stills ? 'preview' : 'frames');
if (stills) {
  fs.rmSync(out, { recursive: true, force: true });
  fs.mkdirSync(out, { recursive: true });
} else {
  fs.mkdirSync(out, { recursive: true });
}

console.log(`Launching Edge browser for ${stills ? 'stills: ' + stills : 'all frames'}...`);
const browser = await chromium.launch({
  executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  headless: true,
});

const page = await browser.newPage({
  viewport: { width: 1080, height: 1920 },
  deviceScaleFactor: 1,
});

page.on('console', m => console.log('[page]', m.text()));
page.on('pageerror', e => console.error('[pageerror]', e.message));

await page.goto(pathToFileURL(path.join(dir, SCENE)).href);
await page.waitForFunction('window.READY === true');
await page.evaluate(() => document.fonts.ready);

const cues = await page.evaluate(() => window.CUES);
fs.writeFileSync(path.join(dir, CUEF), JSON.stringify(cues.sort((a, b) => a.t - b.t), null, 2));
console.log(`Saved ${cues.length} audio cues to ${CUEF}`);

if (stills) {
  for (const s of stills.split(',').map(Number)) {
    await page.evaluate(t => window.seek(t), s);
    const p = path.join(out, `t_${s.toFixed(2)}.jpg`);
    await page.screenshot({ path: p, type: 'jpeg', quality: 90 });
    console.log(`Rendered preview still at t=${s.toFixed(2)}s -> ${p}`);
  }
} else {
  const total = FPS * DUR;
  console.log(`Rendering ${total} frames (${DUR}s at ${FPS} FPS)...`);
  for (let f = 0; f < total; f++) {
    const t = f / FPS;
    await page.evaluate(t => window.seek(t), t);
    const p = path.join(out, `f_${String(f).padStart(4, '0')}.jpg`);
    await page.screenshot({ path: p, type: 'jpeg', quality: 95 });
    if (f % 60 === 0 || f === total - 1) {
      console.log(`Frame ${f + 1} / ${total} (${((f + 1) / total * 100).toFixed(1)}%)`);
    }
  }
}

await browser.close();
console.log('Browser done.');
