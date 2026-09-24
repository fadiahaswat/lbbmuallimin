import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

async function optimizeImages() {
  console.log('--- Starting Image Optimization ---');

  // 1. Optimize fotoslide images (public/fotoslide)
  const fotoslideDir = path.resolve('public/fotoslide');
  const fotoslideFiles = ['1.png', '2.png', '3.png', '4.png', '5.png'];
  
  for (const file of fotoslideFiles) {
    const ext = path.extname(file);
    const base = path.basename(file, ext);
    const inputPath = path.join(fotoslideDir, file);
    const webpPath = path.join(fotoslideDir, `${base}.webp`);

    console.log(`Processing fotoslide: ${file}...`);
    const inputBuffer = fs.readFileSync(inputPath);
    
    // WebP version
    const webpBuffer = await sharp(inputBuffer)
      .resize({ width: 1400, withoutEnlargement: true })
      .webp({ quality: 80, effort: 6 })
      .toBuffer();
    fs.writeFileSync(webpPath, webpBuffer);

    // Optimized PNG version
    const pngBuffer = await sharp(inputBuffer)
      .resize({ width: 1400, withoutEnlargement: true })
      .png({ quality: 80, compressionLevel: 9, effort: 6 })
      .toBuffer();
    fs.writeFileSync(inputPath, pngBuffer);
  }

  // 2. Optimize galeri-tonti (public/galeri-tonti)
  const galeriDir = path.resolve('public/galeri-tonti');
  const galeriFiles = fs.readdirSync(galeriDir).filter(f => /^IMG_\d+\.jpg$/i.test(f));

  for (const file of galeriFiles) {
    const ext = path.extname(file);
    const base = path.basename(file, ext);
    const inputPath = path.join(galeriDir, file);
    const webpPath = path.join(galeriDir, `${base}.webp`);

    console.log(`Processing galeri: ${file}...`);
    const inputBuffer = fs.readFileSync(inputPath);

    // WebP version (great for low bandwidth mobile)
    const webpBuffer = await sharp(inputBuffer)
      .resize({ width: 1100, withoutEnlargement: true })
      .webp({ quality: 78, effort: 6 })
      .toBuffer();
    fs.writeFileSync(webpPath, webpBuffer);

    // Compressed JPG fallback
    const jpgBuffer = await sharp(inputBuffer)
      .resize({ width: 1100, withoutEnlargement: true })
      .jpeg({ quality: 75, mozjpeg: true })
      .toBuffer();
    fs.writeFileSync(inputPath, jpgBuffer);
  }

  // Clean any stray -opt files
  const leftoverFiles = fs.readdirSync(galeriDir).filter(f => f.includes('-opt'));
  for (const l of leftoverFiles) {
    try { fs.unlinkSync(path.join(galeriDir, l)); } catch(e){}
  }

  // 3. Optimize Denah (public/denah-lbb-muallimin-2027.png)
  const denahPath = path.resolve('public/denah-lbb-muallimin-2027.png');
  const denahWebp = path.resolve('public/denah-lbb-muallimin-2027.webp');
  if (fs.existsSync(denahPath)) {
    console.log('Processing denah image...');
    const denahBuffer = fs.readFileSync(denahPath);
    const webpBuf = await sharp(denahBuffer)
      .resize({ width: 1600, withoutEnlargement: true })
      .webp({ quality: 80, effort: 6 })
      .toBuffer();
    fs.writeFileSync(denahWebp, webpBuf);

    const pngBuf = await sharp(denahBuffer)
      .resize({ width: 1600, withoutEnlargement: true })
      .png({ quality: 80, compressionLevel: 9, effort: 6 })
      .toBuffer();
    fs.writeFileSync(denahPath, pngBuf);
  }

  // 4. Optimize Root/Assets logos
  const logoTargets = [
    'public/logo-tonti.png',
    'public/logo-tonti-muallimin.png',
    'public/logo-muallimin.png',
    'src/assets/logo-tonti.png',
    'src/assets/logo-tonti-muallimin.png',
    'src/assets/logo-muallimin.png'
  ];

  for (const relPath of logoTargets) {
    const fullPath = path.resolve(relPath);
    if (fs.existsSync(fullPath)) {
      console.log(`Optimizing logo: ${relPath}...`);
      const base = path.basename(fullPath, path.extname(fullPath));
      const dir = path.dirname(fullPath);
      const webpPath = path.join(dir, `${base}.webp`);

      const logoBuffer = fs.readFileSync(fullPath);
      const webpBuf = await sharp(logoBuffer)
        .resize({ width: 600, withoutEnlargement: true })
        .webp({ quality: 85, effort: 6 })
        .toBuffer();
      fs.writeFileSync(webpPath, webpBuf);

      const pngBuf = await sharp(logoBuffer)
        .resize({ width: 600, withoutEnlargement: true })
        .png({ quality: 85, compressionLevel: 9, effort: 6 })
        .toBuffer();
      fs.writeFileSync(fullPath, pngBuf);
    }
  }

  console.log('=== Image Optimization Complete! ===');
}

optimizeImages().catch(err => {
  console.error(err);
  process.exit(1);
});
