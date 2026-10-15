import { chromium } from 'playwright-core';
import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const dir = path.dirname(fileURLToPath(import.meta.url));
const FPS = 30, DUR = Number(process.env.DUR || 30);
const SCENE = process.env.SCENE || 'scene.html', CUEF = process.env.CUES || 'cues.json', FR = process.env.FR || 'frames';
const stills = process.argv[2]; // comma-separated seconds for preview stills
const out = path.join(dir, stills ? 'preview' : FR);
fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });

const browser = await chromium.launch({
  executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  headless: true,
});
const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
page.on('console', m => console.log('[page]', m.text()));
page.on('pageerror', e => console.log('[pageerror]', e.message));
await page.goto(pathToFileURL(path.join(dir, SCENE)).href);
await page.waitForFunction('window.READY===true');
await page.evaluate(() => document.fonts.ready);

const cues = await page.evaluate(() => window.CUES);
fs.writeFileSync(path.join(dir, CUEF), JSON.stringify(cues.sort((a, b) => a.t - b.t)));
console.log('cues:', cues.length);

if (stills) {
  for (const s of stills.split(',').map(Number)) {
    await page.evaluate(t => window.seek(t), s);
    await page.screenshot({ path: path.join(out, `t_${s.toFixed(2)}.jpg`), type: 'jpeg', quality: 90 });
  }
} else {
  const total = FPS * DUR;
  for (let f = 0; f < total; f++) {
    await page.evaluate(t => window.seek(t), f / FPS);
    await page.screenshot({ path: path.join(out, `f_${String(f).padStart(4, '0')}.jpg`), type: 'jpeg', quality: 93 });
    if (f % 60 === 0) console.log('frame', f, '/', total);
  }
}
await browser.close();
console.log('done');


