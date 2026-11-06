/**
 * src/utils/extractLogoColor.js
 * Ekstraksi warna dominan dari logo sekolah untuk menghasilkan tema dinamis pada kartu profil
 */

// Cache hasil ekstraksi warna agar tidak hitung berulang kali
const colorCache = new Map();

/**
 * Menghasilkan warna fallback deterministik berdasarkan nama sekolah jika logo gagal dibaca
 */
function getFallbackSchoolTheme(schoolName = '') {
  const name = String(schoolName || '').toLowerCase();
  
  // Muhammadiyah / Aisyiyah -> Hijau Daun & Emas
  if (name.includes('muhammadiyah') || name.includes('aisyiyah')) {
    return {
      r: 16, g: 120, b: 68, // #107844 (Hijau Muhammadiyah)
      secondary: { r: 234, g: 179, b: 8 }, // Amber / Gold
    };
  }
  // Negeri / SMPN / SDN -> Biru Royal
  if (name.includes('negeri') || name.includes('smpn') || name.includes('sdn')) {
    return {
      r: 29, g: 78, b: 216, // #1d4ed8 (Biru Teladan)
      secondary: { r: 245, g: 158, b: 11 },
    };
  }
  // Tarakanita / Katolik / Kristen -> Biru Dongker / Marun
  if (name.includes('tarakanita') || name.includes('kanisius')) {
    return {
      r: 30, g: 58, b: 138, // Blue 900
      secondary: { r: 225, g: 29, b: 72 },
    };
  }
  // Al-Azhar / Islam Terpadu -> Hijau Emerald / Teal
  if (name.includes('azhar') || name.includes('islam') || name.includes('it')) {
    return {
      r: 13, g: 148, b: 136, // Teal 600
      secondary: { r: 245, g: 158, b: 11 },
    };
  }
  // Default LBB Brand Red
  return {
    r: 139, g: 0, b: 0, // #8B0000 Marun Mu'allimin
    secondary: { r: 217, g: 119, b: 6 },
  };
}

/**
 * Mengubah RGB ke Hex
 */
function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map(x => Math.round(x).toString(16).padStart(2, '0')).join('');
}

/**
 * Menghitung tingkat kecerahan (perceived luminance)
 */
function getLuminance(r, g, b) {
  return 0.299 * r + 0.587 * g + 0.114 * b;
}

/**
 * Menyesuaikan warna agar memiliki kontras aman untuk teks gelap di Light Mode
 */
function getSafeDarkTextRgb(r, g, b) {
  // Jika warna terlalu terang, gelapkan agar terbaca jelas
  let factor = 1;
  const lum = getLuminance(r, g, b);
  if (lum > 130) {
    factor = 0.55;
  } else if (lum > 90) {
    factor = 0.75;
  }
  return {
    r: Math.max(15, Math.round(r * factor)),
    g: Math.max(15, Math.round(g * factor)),
    b: Math.max(15, Math.round(b * factor))
  };
}

/**
 * Ekstraksi palet warna dominan dari gambar logo
 * @param {string} imageUrl URL atau Base64 gambar
 * @param {string} schoolName Nama sekolah untuk fallback
 * @returns {Promise<Object>} Objek tema CSS siap pakai
 */
export async function extractLogoTheme(imageUrl, schoolName = '') {
  if (!imageUrl || imageUrl === '#' || imageUrl.startsWith('#')) {
    const fallback = getFallbackSchoolTheme(schoolName);
    return createThemeStyles(fallback.r, fallback.g, fallback.b, fallback.secondary);
  }

  // Cek cache
  if (colorCache.has(imageUrl)) {
    return colorCache.get(imageUrl);
  }

  return new Promise((resolve) => {
    // Timeout 1.5 detik jika gambar macet
    const timeout = setTimeout(() => {
      const fallback = getFallbackSchoolTheme(schoolName);
      const theme = createThemeStyles(fallback.r, fallback.g, fallback.b, fallback.secondary);
      colorCache.set(imageUrl, theme);
      resolve(theme);
    }, 1500);

    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      clearTimeout(timeout);
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        
        // Sampling ukuran kecil untuk performa instan
        const size = 64;
        canvas.width = size;
        canvas.height = size;
        ctx.drawImage(img, 0, 0, size, size);

        const imgData = ctx.getImageData(0, 0, size, size).data;
        const colorBuckets = {};

        for (let i = 0; i < imgData.length; i += 4) {
          const r = imgData[i];
          const g = imgData[i + 1];
          const b = imgData[i + 2];
          const a = imgData[i + 3];

          // Abaikan piksel transparan
          if (a < 128) continue;

          // Abaikan warna mendekati putih (latar belakang kertas/kotak logo)
          if (r > 235 && g > 235 && b > 235) continue;

          // Abaikan warna sangat gelap/hitam pekat kecuali jika tidak ada warna lain
          if (r < 20 && g < 20 && b < 20) continue;

          // Hitung saturasi warna (prioritaskan warna yang 'hidup' daripada abu-abu)
          const max = Math.max(r, g, b);
          const min = Math.min(r, g, b);
          const delta = max - min;
          const saturation = max === 0 ? 0 : delta / max;

          // Kelompokkan dalam bucket 24 step
          const br = Math.round(r / 24) * 24;
          const bg = Math.round(g / 24) * 24;
          const bb = Math.round(b / 24) * 24;
          const key = `${br},${bg},${bb}`;

          // Berikan bobot lebih tinggi pada warna bersaturasi tinggi
          const weight = 1 + saturation * 2;
          colorBuckets[key] = (colorBuckets[key] || 0) + weight;
        }

        // Cari bucket dengan bobot tertinggi
        let dominantKey = null;
        let maxWeight = 0;

        for (const key in colorBuckets) {
          if (colorBuckets[key] > maxWeight) {
            maxWeight = colorBuckets[key];
            dominantKey = key;
          }
        }

        let primaryRgb;
        if (dominantKey) {
          const [r, g, b] = dominantKey.split(',').map(Number);
          primaryRgb = { r, g, b };
        } else {
          primaryRgb = getFallbackSchoolTheme(schoolName);
        }

        const theme = createThemeStyles(primaryRgb.r, primaryRgb.g, primaryRgb.b);
        colorCache.set(imageUrl, theme);
        resolve(theme);
      } catch (err) {
        // Jika canvas terkena CORS security taint, gunakan fallback deterministik
        const fallback = getFallbackSchoolTheme(schoolName);
        const theme = createThemeStyles(fallback.r, fallback.g, fallback.b, fallback.secondary);
        colorCache.set(imageUrl, theme);
        resolve(theme);
      }
    };

    img.onerror = () => {
      clearTimeout(timeout);
      const fallback = getFallbackSchoolTheme(schoolName);
      const theme = createThemeStyles(fallback.r, fallback.g, fallback.b, fallback.secondary);
      colorCache.set(imageUrl, theme);
      resolve(theme);
    };

    img.src = imageUrl;
  });
}

/**
 * Menyusun bundle variabel style untuk kartu dan wadah profil
 */
function createThemeStyles(r, g, b, secondary = null) {
  const hex = rgbToHex(r, g, b);
  const rgb = `${r}, ${g}, ${b}`;
  const darkText = getSafeDarkTextRgb(r, g, b);
  const darkTextRgb = `${darkText.r}, ${darkText.g}, ${darkText.b}`;

  const secR = secondary ? secondary.r : Math.min(255, r + 40);
  const secG = secondary ? secondary.g : Math.min(255, g + 30);
  const secB = secondary ? secondary.b : Math.max(0, b - 20);
  const secRgb = `${secR}, ${secG}, ${secB}`;

  return {
    hex,
    rgb,
    secRgb,
    // Background wadah utama kartu peleton (Dynamic tint yang elegan dan bersih)
    cardBackground: `linear-gradient(135deg, rgba(${rgb}, 0.08) 0%, rgba(${secRgb}, 0.03) 50%, #ffffff 100%)`,
    cardBorder: `rgba(${rgb}, 0.22)`,
    cardShadow: `0 10px 25px -5px rgba(${rgb}, 0.1), 0 8px 10px -6px rgba(${rgb}, 0.06)`,
    
    // Top gradient accent stripe
    accentStripe: `linear-gradient(90deg, rgb(${rgb}) 0%, rgb(${secRgb}) 50%, rgb(${rgb}) 100%)`,
    
    // Ambient subtle radial glow
    ambientGlow: `radial-gradient(circle at 90% 10%, rgba(${rgb}, 0.14) 0%, transparent 60%)`,
    
    // Bottom information row container (Danton, Official, WA)
    subtleBoxBg: `linear-gradient(to right, rgba(${rgb}, 0.05), rgba(${secRgb}, 0.03))`,
    subtleBoxBorder: `rgba(${rgb}, 0.16)`,
    
    // Avatar ring & accents
    avatarRing: `rgba(${rgb}, 0.35)`,
    avatarBg: `rgba(${rgb}, 0.06)`,
    
    // Text accent (misal nama peleton)
    accentText: `rgb(${darkTextRgb})`,
    accentBadgeBg: `rgba(${rgb}, 0.1)`,
    accentBadgeText: `rgb(${darkTextRgb})`,
    accentBadgeBorder: `rgba(${rgb}, 0.25)`,
  };
}
