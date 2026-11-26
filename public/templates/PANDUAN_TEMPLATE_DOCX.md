# Panduan Edit Template Word (.docx) — BA & SK LBB Mu'allimin 2027

File `.docx` di folder ini adalah **template aktif** yang dibaca otomatis setiap kali Anda mengekspor **Berita Acara (BA)** atau **Surat Keputusan (SK)** di website.

## Cara Menggunakan
1. Buka file `.docx` di **Microsoft Word**.
2. Ubah bebas tata letak, margin, redaksi kalimat, nomor surat, kop surat, ukuran huruf, warna tabel, maupun nama penandatangan.
3. **Jangan hapus atau memotong tanda kurung kurawal `{...}`** agar data otomatis dari sistem tetap terisi rapi.
4. Simpan (`Ctrl+S`) di folder ini (`public/templates/`) dengan **nama file yang sama**.
5. Klik tombol ekspor di website — hasil unduhan otomatis mengikuti template editan terbaru Anda.

---

## 1. `05_BA_Rekapitulasi_Nilai.docx` (Menu Rekap Nilai)
- `{nomorBA}`, `{hariTanggal}`, `{tanggalTerbilang}`, `{tempat}`, `{tanggalPendek}`
- Tabel Peleton SD (`{#peletonSdRows}`) & SMP (`{#peletonSmpRows}`):
  - `{rank}`, `{noDada}`, `{sekolah}`, `{juri1}`, `{juri2}`, `{juri3}`, `{nilaiMurni}`, `{penalti}`, `{nilaiAkhir}`
- Tabel Danton SD (`{#dantonSdRows}`) & SMP (`{#dantonSmpRows}`):
  - `{rank}`, `{noDada}`, `{danton}`, `{sekolah}`, `{juri1}`, `{juri2}`, `{juri3}`, `{nilaiMurni}`, `{penalti}`, `{nilaiAkhir}`

## 2. `06_SK_Penetapan_Pemenang.docx` (Menu Papan Klasemen)
- `{nomorSK}`, `{nomorBA}`, `{jumlahSd}`, `{jumlahSmp}`, `{totalPeleton}`, `{hariTanggal}`, `{tempat}`, `{tanggalTM}`, `{tanggalPendek}`
- Tabel Harapan & Utama Peleton (`{#harapanSdRows}`, `{#harapanSmpRows}`, `{#utamaSdRows}`, `{#utamaSmpRows}`):
  - `{predikat}`, `{noDada}`, `{sekolah}`, `{nilaiMurni}`, `{penalti}`, `{nilaiAkhir}`
- Tabel Komandan (`{#dantonSdRows}`, `{#dantonSmpRows}`):
  - `{predikat}`, `{noDada}`, `{danton}`, `{sekolah}`, `{penalti}`, `{nilaiAkhir}`
- Tabel Juara Umum (`{#juaraUmumRows}`):
  - `{predikat}`, `{sekolah}`, `{rincian}`, `{totalPoin}`
