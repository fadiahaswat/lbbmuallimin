import fs from 'fs';

const paras = JSON.parse(fs.readFileSync('extracted_proposal.json', 'utf8'));

// Print lines around Bab Waktu, Jadwal, and RAB
for (let i = 0; i < paras.length; i++) {
  const p = paras[i];
  if (p.includes('WAKTU DAN TEMPAT') || p.includes('JADWAL KEGIATAN') || p.includes('Pendaftaran Peserta') || p.includes('Dewan Juri') || p.includes('Kategori') || p.includes('SASARAN') || p.includes('BENTUK KEGIATAN')) {
    console.log(`\n=== INDEX ${i} ===\n${p}`);
    for (let j = Math.max(0, i - 1); j <= Math.min(paras.length - 1, i + 10); j++) {
      console.log(`  [${j}] ${paras[j]}`);
    }
  }
}
