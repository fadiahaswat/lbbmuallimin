import QRCode from 'qrcode';
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

async function generateQR() {
  const url = 'https://lbb.tontimuallimin.com';
  const qrSize = 1200;

  // 1. Generate QR Code dasar level H
  const qrBuffer = await QRCode.toBuffer(url, {
    errorCorrectionLevel: 'H',
    type: 'png',
    width: qrSize,
    margin: 3,
    color: {
      dark: '#000000',
      light: '#ffffff'
    }
  });

  const logoTargetSize = 280;
  const logoPath = path.resolve('assets-raw/banners-denah/LOGO LBB MU\'ALLIMIN 2027.png');

  // Resize logo LBB
  const resizedLogo = await sharp(logoPath)
    .resize(logoTargetSize, logoTargetSize, { fit: 'inside' })
    .png()
    .toBuffer();

  const logoMeta = await sharp(resizedLogo).metadata();

  // Buat outline / border contour putih yang mengikuti bentuk kurva logo secara alami
  // Jarak padding 12px di sekeliling logo
  const pad = 12;
  const paddedW = logoMeta.width + pad * 2;
  const paddedH = logoMeta.height + pad * 2;

  // Dapatkan mask alpha lalu threshold agar solid
  const alphaMask = await sharp(resizedLogo)
    .extractChannel(3)
    .extend({
      top: pad,
      bottom: pad,
      left: pad,
      right: pad,
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    })
    .blur(5)
    .threshold(30) // solid shape yang sedikit melebar mengikuti kontur logo
    .toBuffer();

  const whiteSilhouette = await sharp({
    create: {
      width: paddedW,
      height: paddedH,
      channels: 4,
      background: { r: 255, g: 255, b: 255, alpha: 1 }
    }
  })
    .composite([
      {
        input: alphaMask,
        blend: 'dest-in'
      }
    ])
    .png()
    .toBuffer();

  // Gabungkan outline putih pelindung + logo LBB
  const logoWithBreathingRoom = await sharp(whiteSilhouette)
    .composite([
      {
        input: resizedLogo,
        gravity: 'centre'
      }
    ])
    .png()
    .toBuffer();

  // Tempel ke tengah QR Code
  const outputPath = path.resolve('public/qr-lbb-muallimin.png');
  await sharp(qrBuffer)
    .composite([
      {
        input: logoWithBreathingRoom,
        gravity: 'centre'
      }
    ])
    .png({ quality: 100 })
    .toFile(outputPath);

  console.log(`QR Code generated successfully at: ${outputPath}`);

  fs.copyFileSync(outputPath, path.resolve('qr-lbb-muallimin.png'));
  console.log('Copy created at qr-lbb-muallimin.png');
}

generateQR().catch(err => {
  console.error('Error generating QR:', err);
  process.exit(1);
});
