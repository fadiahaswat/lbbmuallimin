// Render "Alur Pendaftaran": `node render_alur.mjs` (full) or `node render_alur.mjs preview 2 8 16`
import puppeteer from 'puppeteer-core';
import QRCode from 'qrcode';
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import ffmpegPath from 'ffmpeg-static';
const dir = path.dirname(fileURLToPath(import.meta.url));
const T = (await import('./timeline_alur.js')).default;

const qr = QRCode.create('https://lbb.tontimuallimin.com/', { errorCorrectionLevel: 'M' });
const n = qr.modules.size, rows = [];
for (let r = 0; r < n; r++) { let s = ''; for (let c = 0; c < n; c++) s += qr.modules.get(r, c) ? '1' : '0'; rows.push(s); }
fs.writeFileSync(path.join(dir, 'qr.js'), 'window.QRM=' + JSON.stringify(rows) + ';');

const args = process.argv.slice(2), preview = args[0] === 'preview';
const chrome = fs.existsSync('C:/Program Files/Google/Chrome/Application/chrome.exe') ? 'C:/Program Files/Google/Chrome/Application/chrome.exe' : 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const browser = await puppeteer.launch({ executablePath: chrome, headless: true, args: ['--allow-file-access-from-files'], defaultViewport: { width: 1080, height: 1920, deviceScaleFactor: 1 } });
const page = await browser.newPage();
page.on('pageerror', e => console.log('PAGE ERROR', e.message));
page.on('console', m => console.log('PAGE', m.text()));
await page.goto(pathToFileURL(path.join(dir, 'index_alur.html')).href);
await page.evaluate(() => window.ready);
const el = await page.$('#c');
const silent = path.join(dir, 'video_alur_silent.mp4');

if (preview) {
  const out = path.join(dir, 'preview_alur'); fs.mkdirSync(out, { recursive: true });
  for (const t of args.slice(1).map(Number)) { await page.evaluate(t => window.renderFrame(t), t); await el.screenshot({ path: path.join(out, `t${t}.png`) }); }
} else {
  const ff = spawn(ffmpegPath, ['-y', '-f', 'image2pipe', '-framerate', String(T.fps), '-c:v', 'mjpeg', '-i', '-', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-preset', 'medium', '-crf', '16', '-r', String(T.fps), silent], { stdio: ['pipe', 'ignore', 'ignore'] });
  const total = T.fps * T.dur;
  for (let f = 0; f < total; f++) {
    await page.evaluate(t => window.renderFrame(t), f / T.fps);
    const buf = await el.screenshot({ type: 'jpeg', quality: 95 });
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
    if (f % 120 === 0) console.log('frame', f, '/', total);
  }
  ff.stdin.end(); await new Promise(r => ff.on('close', r));
}
await browser.close();

if (!preview && fs.existsSync(path.join(dir, 'audio_alur.wav'))) {
  const final = path.join(dir, 'LBB_Muallimin_2027_Alur_Pendaftaran.mp4');
  const mx = spawn(ffmpegPath, ['-y', '-i', silent, '-i', path.join(dir, 'audio_alur.wav'), '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-shortest', '-movflags', '+faststart', final], { stdio: 'ignore' });
  await new Promise(r => mx.on('close', r));
  console.log('wrote', final);
}
