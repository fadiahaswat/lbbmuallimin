import QRCode from 'qrcode';

export const OFFICIAL_BASE_URL = 'https://lbb.tontimuallimin.com';

/**
 * Generate QR code as Data URL with embedded logo in the center (no box container)
 * @param {string} text - URL or text to encode
 * @param {object} options - Options
 * @returns {Promise<string>} Data URL PNG
 */
export async function generateParticipantQRCode(text, options = {}) {
  const {
    size = 600,
    logoUrl = '/logo-lbb-2027.png',
  } = options;

  // 1. Generate QR Code on an offscreen canvas
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;

  await QRCode.toCanvas(canvas, text, {
    width: size,
    margin: 2,
    errorCorrectionLevel: 'H',
    color: {
      dark: '#0f172a',
      light: '#ffffff',
    },
  });

  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas.toDataURL('image/png');

  // 2. Load Logo Image
  try {
    const logoImg = await new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = reject;
      // Try provided logoUrl, fallback to /logo-muallimin.png
      img.src = logoUrl;
    });

    // Calculate logo dimensions (~23% of QR size)
    const logoSize = Math.round(size * 0.23);
    const aspect = logoImg.width / logoImg.height;
    let drawW = logoSize;
    let drawH = logoSize;
    if (aspect > 1) {
      drawH = logoSize / aspect;
    } else {
      drawW = logoSize * aspect;
    }

    const cx = size / 2;
    const cy = size / 2;
    const left = cx - drawW / 2;
    const top = cy - drawH / 2;

    // 3. Create contour / breathing room around logo without box container
    // We draw multiple semi-transparent / solid white expanded strokes behind logo
    const padding = Math.max(6, Math.round(size * 0.015));
    
    // Draw white silhouette aura by drawing slightly scaled/dilated version or blurred shadow
    ctx.save();
    ctx.shadowColor = '#ffffff';
    ctx.shadowBlur = padding * 2;
    // Repeat to make solid white breathing margin
    for (let i = 0; i < 4; i++) {
      ctx.drawImage(logoImg, left - padding, top - padding, drawW + padding * 2, drawH + padding * 2);
    }
    ctx.restore();

    // 4. Draw crisp logo on top
    ctx.drawImage(logoImg, left, top, drawW, drawH);

  } catch (err) {
    console.warn('Could not embed logo into QR Code, falling back to raw QR:', err);
  }

  return canvas.toDataURL('image/png');
}

/**
 * Trigger download of image data URL
 */
export function downloadDataUrl(dataUrl, filename = 'qr-code-pendaftaran.png') {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
