import puppeteer from 'puppeteer-core';
import QRCode from 'qrcode';
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import ffmpegPath from 'ffmpeg-static';
const dir = path.dirname(fileURLToPath(import.meta.url));
const T = (await import('./timeline.js')).default;

// QR for the official portal
const qr = QRCode.create('https://lbb.tontimuallimin.com/', { errorCorrectionLevel: 'M' });
const n = qr.modules.size, rows = [];
for (let r = 0; r < n; r++) { let s = ''; for (let c = 0; c < n; c++) s += qr.modules.get(r, c) ? '1' : '0'; rows.push(s); }
fs.writeFileSync(path.join(dir, 'qr.js'), 'window.QRM=' + JSON.stringify(rows) + ';');

const args = process.argv.slice(2);
const preview = args[0] === 'preview';
const chrome = fs.existsSync('C:/Program Files/Google/Chrome/Application/chrome.exe') ? 'C:/Program Files/Google/Chrome/Application/chrome.exe' : 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const browser = await puppeteer.launch({ executablePath: chrome, headless: true, args: ['--allow-file-access-from-files', '--disable-gpu-vsync'], defaultViewport: { width: 1080, height: 1920, deviceScaleFactor: 1 } });
const page = await browser.newPage();
page.on('pageerror', e => console.log('PAGE ERROR', e.message));
await page.goto(pathToFileURL(path.join(dir, 'index.html')).href);
await page.evaluate(() => window.ready);

if (preview) {
  fs.mkdirSync(path.join(dir, 'preview'), { recursive: true });
  for (const t of args.slice(1).map(Number)) {
    await page.evaluate(t => window.renderFrame(t), t);
    await (await page.$('#c')).screenshot({ path: path.join(dir, 'preview', `t${t}.png`) });
  }
} else {
  const out = path.join(dir, 'video_silent.mp4');
  const ff = spawn(ffmpegPath, ['-y', '-f', 'image2pipe', '-framerate', String(T.fps), '-c:v', 'mjpeg', '-i', '-', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-preset', 'medium', '-crf', '16', '-r', String(T.fps), out], { stdio: ['pipe', 'inherit', 'inherit'] });
  const total = T.fps * T.dur;
  const el = await page.$('#c');
  for (let f = 0; f < total; f++) {
    await page.evaluate(t => window.renderFrame(t), f / T.fps);
    const buf = await el.screenshot({ type: 'jpeg', quality: 95 });
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
    if (f % 60 === 0) console.log('frame', f, '/', total);
  }
  ff.stdin.end(); await new Promise(r => ff.on('close', r));
}
await browser.close();

// mux video + audio.wav -> final deliverable
if (!preview && fs.existsSync(path.join(dir, 'audio.wav'))) {
  const final = path.join(dir, 'LBB_Muallimin_2027_Promo_v2.mp4');
  const mx = spawn(ffmpegPath, ['-y', '-i', path.join(dir, 'video_silent.mp4'), '-i', path.join(dir, 'audio.wav'), '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-shortest', '-movflags', '+faststart', final], { stdio: 'inherit' });
  await new Promise(r => mx.on('close', r));
  console.log('wrote', final);
}
