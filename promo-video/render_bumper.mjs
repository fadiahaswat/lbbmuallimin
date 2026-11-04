import puppeteer from 'puppeteer-core';
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import ffmpegPath from 'ffmpeg-static';

const dir = path.dirname(fileURLToPath(import.meta.url));
const T = (await import('./timeline_bumper.js')).default;

const args = process.argv.slice(2);
const preview = args[0] === 'preview';
const chrome = fs.existsSync('C:/Program Files/Google/Chrome/Application/chrome.exe')
  ? 'C:/Program Files/Google/Chrome/Application/chrome.exe'
  : 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';

const browser = await puppeteer.launch({
  executablePath: chrome,
  headless: true,
  args: ['--allow-file-access-from-files', '--disable-gpu-vsync'],
  defaultViewport: { width: 1080, height: 1920, deviceScaleFactor: 1 }
});

const page = await browser.newPage();
page.on('pageerror', e => console.error('PAGE ERROR:', e.message, e.stack));
page.on('console', m => console.log('PAGE LOG:', m.type(), m.text()));

await page.goto(pathToFileURL(path.join(dir, 'index_bumper.html')).href);
try {
  await page.evaluate(async () => {
    try {
      await window.ready;
      console.log('window.ready resolved successfully');
    } catch(err) {
      console.error('window.ready rejected:', err && err.stack ? err.stack : err);
      throw err;
    }
  });
} catch(e) {
  console.error('evaluate error:', e);
  process.exit(1);
}

if (preview) {
  const prevDir = path.join(dir, 'preview_bumper');
  fs.mkdirSync(prevDir, { recursive: true });
  for (const t of args.slice(1).map(Number)) {
    await page.evaluate(tv => window.renderFrame(tv), t);
    const outPng = path.join(prevDir, `t${t}.png`);
    await (await page.$('#c')).screenshot({ path: outPng, omitBackground: true });
    console.log('saved preview', outPng);
  }
} else {
  // Capture transparent PNG sequence piped directly to ffmpeg
  const silentMp4 = path.join(dir, 'video_bumper_silent.mp4');
  const proresMov = path.join(dir, 'LBB_Muallimin_2027_Bumper_Logo_Alpha.mov');

  // 1. Standard H.264 MP4 with black fade-in
  const ffMp4 = spawn(ffmpegPath, [
    '-y',
    '-f', 'image2pipe',
    '-framerate', String(T.fps),
    '-c:v', 'png',
    '-i', '-',
    '-c:v', 'libx264',
    '-pix_fmt', 'yuv420p',
    '-preset', 'medium',
    '-crf', '15',
    '-r', String(T.fps),
    silentMp4
  ], { stdio: ['pipe', 'inherit', 'inherit'] });

  // 2. ProRes 4444 MOV with 100% full Alpha Transparency support for video editors (Premiere, CapCut, DaVinci, After Effects)
  const ffMov = spawn(ffmpegPath, [
    '-y',
    '-f', 'image2pipe',
    '-framerate', String(T.fps),
    '-c:v', 'png',
    '-i', '-',
    '-c:v', 'prores_ks',
    '-profile:v', '4444',
    '-pix_fmt', 'yuva444p10le',
    '-r', String(T.fps),
    proresMov
  ], { stdio: ['pipe', 'inherit', 'inherit'] });

  const total = Math.round(T.fps * T.dur);
  const el = await page.$('#c');
  for (let f = 0; f < total; f++) {
    await page.evaluate(tv => window.renderFrame(tv), f / T.fps);
    const buf = await el.screenshot({ type: 'png', omitBackground: true });
    
    if (!ffMp4.stdin.write(buf)) await new Promise(r => ffMp4.stdin.once('drain', r));
    if (!ffMov.stdin.write(buf)) await new Promise(r => ffMov.stdin.once('drain', r));

    if (f % 60 === 0 || f === total - 1) console.log(`frame ${f + 1} / ${total}`);
  }
  ffMp4.stdin.end();
  ffMov.stdin.end();
  await Promise.all([
    new Promise(r => ffMp4.on('close', r)),
    new Promise(r => ffMov.on('close', r))
  ]);
  console.log('Video renders complete.');
}

await browser.close();

if (!preview && fs.existsSync(path.join(dir, 'audio_bumper.wav'))) {
  const finalMp4 = path.join(dir, 'LBB_Muallimin_2027_Bumper_Logo_9x16.mp4');
  const mx = spawn(ffmpegPath, [
    '-y',
    '-i', path.join(dir, 'video_bumper_silent.mp4'),
    '-i', path.join(dir, 'audio_bumper.wav'),
    '-c:v', 'copy',
    '-c:a', 'aac',
    '-b:a', '192k',
    '-shortest',
    '-movflags', '+faststart',
    finalMp4
  ], { stdio: 'inherit' });
  await new Promise(r => mx.on('close', r));
  console.log('wrote final deliverable:', finalMp4);

  // Also mux audio into the ProRes 4444 MOV with uncompressed PCM audio for pro editors
  const finalMov = path.join(dir, 'LBB_Muallimin_2027_Bumper_Logo_Alpha.mov');
  const tempMov = path.join(dir, 'LBB_Muallimin_2027_Bumper_Logo_Alpha_temp.mov');
  if (fs.existsSync(finalMov)) {
    fs.renameSync(finalMov, tempMov);
    const mxMov = spawn(ffmpegPath, [
      '-y',
      '-i', tempMov,
      '-i', path.join(dir, 'audio_bumper.wav'),
      '-c:v', 'copy',
      '-c:a', 'pcm_s16le',
      '-shortest',
      finalMov
    ], { stdio: 'inherit' });
    await new Promise(r => mxMov.on('close', r));
    fs.unlinkSync(tempMov);
    console.log('wrote final transparent ProRes 4444 deliverable:', finalMov);
  }
}
