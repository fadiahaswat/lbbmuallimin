import QRCode from 'qrcode';

export const OFFICIAL_BASE_URL = 'https://lbb.tontimuallimin.com';

/**
 * Generate QR code as Data URL with embedded logo in the center
 * exactly like example 2 (clean crisp white contour, no dirty shadows or stacking)
 * @param {string} text - URL or text to encode
 * @param {object} options - Options
 * @returns {Promise<string>} Data URL PNG
 */
export async function generateParticipantQRCode(text, options = {}) {
  const {
    size = 1000,
    logoUrl = '/logo-badge-contour.png',
  } = options;

  // 1. Generate QR Code on an offscreen canvas
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;

  await QRCode.toCanvas(canvas, text, {
    width: size,
    margin: 3,
    errorCorrectionLevel: 'H',
    color: {
      dark: '#000000',
      light: '#ffffff',
    },
  });

  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas.toDataURL('image/png');

  // 2. Load the contour badge logo (crisp white contour around logo)
  try {
    const logoImg = await new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = logoUrl;
    });

    // Match exact proportions from the reference (around 24% - 25% of QR width)
    const logoSize = Math.round(size * 0.245);
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

    // Draw the crisp contour badge logo directly onto canvas in 1 clean pass
    ctx.drawImage(logoImg, left, top, drawW, drawH);

  } catch (err) {
    console.warn('Could not embed logo into QR Code:', err);
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
