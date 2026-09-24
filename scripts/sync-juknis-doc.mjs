const JUKNIS_URL = 'https://script.google.com/macros/s/AKfycbyHS_8y4GTHXsD_-xWjOtMhIziPNiKkg7VvuYZ-Oz6ex7vQW4SidVBJNeZ1hrmjTdI5Ww/exec';
const SECRET_TOKEN = 'LBB_JUKNIS_ADMIN_2027';

async function updateJuknis() {
  console.log('Menyelaraskan dokumen Petunjuk Teknis Lapangan (Juknis)...');

  const replacements = [
    // 1. Tahun Kegiatan
    { find: "MU'ALLIMIN TAHUN 2025", replace: "MU'ALLIMIN TAHUN 2027" },
    { find: "Tahun  2025", replace: "Tahun 2027" },
    { find: "Tahun 2025", replace: "Tahun 2027" },

    // 2. Durasi Waktu SD
    { find: "8 menit untuk tingkat SD/MI", replace: "10 menit untuk tingkat SD/MI" },
    { find: "8 menit", replace: "10 menit" },

    // 3. Penegasan Arena Pelaksanaan di Sedayu
    {
      find: "Ukuran lapangan perlombaan adalah:",
      replace: "Ukuran lapangan perlombaan (di Kampus Terpadu Sedayu):"
    },
    {
      find: "Tingkat SD/MI: 25m x 14m",
      replace: "Tingkat SD/MI: 25m x 14m (Arena 1: Lapangan Basket, Durasi Maksimal 10 Menit)"
    },
    {
      find: "Tingkat SMP/MTs: 26m x 15m",
      replace: "Tingkat SMP/MTs: 26m x 15m (Arena 2: Pelataran Embung, Durasi Maksimal 13 Menit)"
    },

    // 4. Komposisi Dewan Juri
    { 
      find: "Keputusan dewan juri bersifat mutlak dan tidak dapat diganggu", 
      replace: "Keputusan Dewan Juri (terdiri dari 6 Dewan Juri unsur TNI, POLRI, dan PPI: 3 Juri SD & 3 Juri SMP) bersifat mutlak dan tidak dapat diganggu" 
    }
  ];

  console.log(`Mengirim ${replacements.length} penyesuaian teks ke Google Docs Juknis...`);

  const res = await fetch(JUKNIS_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'batchReplace',
      token: SECRET_TOKEN,
      replacements: replacements
    }),
    redirect: 'follow'
  });

  const resText = await res.text();
  console.log('Respon Server Juknis:', resText);
}

updateJuknis().catch(console.error);
