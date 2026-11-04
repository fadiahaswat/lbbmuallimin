const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');
const ffmpegPath = require('ffmpeg-static');

async function renderFullVideo() {
  console.log('================================================================');
  console.log('🎬 STUDIO RENDER VIDEO TONTI MU\'ALLIMIN 2027');
  console.log('   Format: MP4 (H.264 1080x1080 @ 30 FPS High Profile)');
  console.log('   Durasi: 5.0 Detik (150 Frames)');
  console.log('================================================================');

  const outputMp4 = path.resolve('public', 'LOGO_TONTI_MUALLIMIN_MOTION.mp4');
  const outputWebm = path.resolve('public', 'LOGO_TONTI_MUALLIMIN_MOTION.webm');

  // 1. Launch Chrome Headless
  const port = 9225;
  console.log('[1/4] Meluncurkan Chrome Headless Engine pada port', port, '...');
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    '--window-size=1080,1080',
    '--hide-scrollbars',
    '--disable-gpu-vsync',
    'http://localhost:5173/render-frame.html'
  ]);

  // Wait for Chrome
  await new Promise(r => setTimeout(r, 2000));

  // 2. Connect via WebSocket
  console.log('[2/4] Menghubungkan ke Chrome DevTools Protocol...');
  const targets = await new Promise((resolve, reject) => {
    http.get(`http://127.0.0.1:${port}/json`, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve(JSON.parse(data)));
    }).on('error', reject);
  });

  const pageTarget = targets.find(t => t.type === 'page' && t.url.includes('render-frame.html'));
  if (!pageTarget) {
    chrome.kill();
    throw new Error('Target page render-frame.html tidak ditemukan!');
  }

  const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);
  let msgId = 1;
  const pending = new Map();

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.id && pending.has(data.id)) {
      const { resolve, reject } = pending.get(data.id);
      pending.delete(data.id);
      if (data.error) reject(data.error);
      else resolve(data.result);
    }
  };

  const send = (method, params = {}) => {
    return new Promise((resolve, reject) => {
      const id = msgId++;
      pending.set(id, { resolve, reject });
      ws.send(JSON.stringify({ id, method, params }));
    });
  };

  await new Promise(r => ws.onopen = r);
  await send('Page.enable');
  await send('Runtime.enable');

  // Verify animations
  const animCountRes = await send('Runtime.evaluate', {
    expression: 'document.getAnimations().length',
    returnByValue: true
  });
  console.log(`[3/4] Terdeteksi ${animCountRes.result.value} animasi aktif. Memulai encoding frame...`);

  // Start FFmpeg for MP4
  const ffmpegArgs = [
    '-y',
    '-f', 'image2pipe',
    '-vcodec', 'png',
    '-r', '30',
    '-i', '-',
    '-c:v', 'libx264',
    '-pix_fmt', 'yuv420p',
    '-preset', 'slow',
    '-crf', '17',
    '-movflags', '+faststart',
    outputMp4
  ];

  const ffmpeg = spawn(ffmpegPath, ffmpegArgs);
  ffmpeg.stderr.on('data', () => {}); // silence verbose output

  const totalFrames = 150; // 5.0 seconds * 30 FPS
  const startTime = Date.now();

  for (let i = 0; i < totalFrames; i++) {
    const timeMs = (i / 30) * 5000;
    await send('Runtime.evaluate', { expression: `seekTo(${timeMs})` });
    const screenRes = await send('Page.captureScreenshot', {
      format: 'png',
      clip: { x: 0, y: 0, width: 1080, height: 1080, scale: 1 }
    });
    const buf = Buffer.from(screenRes.data, 'base64');
    ffmpeg.stdin.write(buf);

    if (i % 15 === 0 || i === totalFrames - 1) {
      const pct = Math.round(((i + 1) / totalFrames) * 100);
      const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
      process.stdout.write(`\r   🎞️ Progress: ${pct}% (Frame ${i + 1}/${totalFrames}) - ${elapsed}s elapsed`);
    }
  }

  process.stdout.write('\n');
  console.log('[4/4] Menyelesaikan pengkodean MP4...');
  ffmpeg.stdin.end();

  await new Promise((resolve) => {
    ffmpeg.on('close', resolve);
  });

  ws.close();
  chrome.kill();

  if (fs.existsSync(outputMp4)) {
    const stat = fs.statSync(outputMp4);
    console.log(`\n✅ SUKSES! File video MP4 berhasil dirender!`);
    console.log(`   Lokasi : ${outputMp4}`);
    console.log(`   Ukuran : ${(stat.size / 1024 / 1024).toFixed(2)} MB`);

    // Also convert/copy to WebM for universal web playback
    console.log('   Membuat salinan WebM untuk web preview...');
    const ffmpegWebm = spawn(ffmpegPath, [
      '-y',
      '-i', outputMp4,
      '-c:v', 'libvpx-vp9',
      '-crf', '24',
      '-b:v', '0',
      outputWebm
    ]);
    await new Promise(r => ffmpegWebm.on('close', r));

    // Copy both to dist/
    if (fs.existsSync('dist')) {
      fs.copyFileSync(outputMp4, path.resolve('dist', 'LOGO_TONTI_MUALLIMIN_MOTION.mp4'));
      if (fs.existsSync(outputWebm)) {
        fs.copyFileSync(outputWebm, path.resolve('dist', 'LOGO_TONTI_MUALLIMIN_MOTION.webm'));
      }
      console.log('   Tersinkronisasi ke folder dist/');
    }
  } else {
    throw new Error('Gagal menghasilkan file MP4!');
  }
}

renderFullVideo().catch(err => {
  console.error('\n❌ Terjadi kesalahan saat render video:', err);
  process.exit(1);
});
