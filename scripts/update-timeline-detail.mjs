import ExcelJS from 'exceljs';

async function updateDetailTimelinePanitia() {
  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet('Timeline Panitia', {
    pageSetup: { orientation: 'landscape', fitToPage: true, fitToWidth: 1, fitToHeight: 0 }
  });

  // Set columns width
  ws.columns = [
    { key: 'no', width: 6 },
    { key: 'waktu', width: 25 },
    { key: 'kegiatan', width: 95 },
    { key: 'pic', width: 38 }
  ];

  const headerFill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF1F4E79' } // Deep Navy Blue
  };

  const sectionFill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFD9E1F2' } // Soft Light Blue
  };

  const milestoneFill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFF2F2F2' } // Highlight light gray
  };

  const headerFont = {
    name: 'Segoe UI',
    size: 11,
    bold: true,
    color: { argb: 'FFFFFFFF' }
  };

  const sectionFont = {
    name: 'Segoe UI',
    size: 11,
    bold: true,
    color: { argb: 'FF1F4E79' }
  };

  const milestoneFont = {
    name: 'Segoe UI',
    size: 10,
    bold: true,
    color: { argb: 'FF002060' }
  };

  const textFont = {
    name: 'Segoe UI',
    size: 10,
    color: { argb: 'FF000000' }
  };

  const borderAll = {
    top: { style: 'thin', color: { argb: 'FFB0C4DE' } },
    left: { style: 'thin', color: { argb: 'FFB0C4DE' } },
    bottom: { style: 'thin', color: { argb: 'FFB0C4DE' } },
    right: { style: 'thin', color: { argb: 'FFB0C4DE' } }
  };

  // Header row
  const headerRow = ws.addRow(['No.', 'Waktu / Periode', 'Kegiatan Utama & Rincian Tugas', 'Penanggung Jawab (PIC)']);
  headerRow.height = 26;
  headerRow.eachCell((cell) => {
    cell.fill = headerFill;
    cell.font = headerFont;
    cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
    cell.border = borderAll;
  });

  function addSection(title) {
    const row = ws.addRow([title, '', '', '']);
    row.height = 24;
    const rowNum = row.number;
    ws.mergeCells(`A${rowNum}:D${rowNum}`);
    row.eachCell({ includeEmpty: true }, (cell) => {
      cell.fill = sectionFill;
      cell.font = sectionFont;
      cell.alignment = { horizontal: 'left', vertical: 'middle', indent: 1 };
      cell.border = borderAll;
    });
  }

  function addDataRow(no, waktu, kegiatan, pic, isMilestone = false, customHeight = null) {
    const row = ws.addRow([no, waktu, kegiatan, pic]);
    if (customHeight) row.height = customHeight;
    row.getCell(1).alignment = { horizontal: 'center', vertical: 'middle' };
    row.getCell(2).alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
    row.getCell(3).alignment = { horizontal: 'left', vertical: 'middle', wrapText: true };
    row.getCell(4).alignment = { horizontal: 'left', vertical: 'middle', wrapText: true };

    row.eachCell((cell) => {
      cell.font = isMilestone ? milestoneFont : textFont;
      if (isMilestone) {
        cell.fill = milestoneFill;
      }
      cell.border = borderAll;
    });
  }

  // ==========================================
  // I. TAHAP PERENCANAAN & PENDAFTARAN
  // ==========================================
  addSection('A. Tahap Perencanaan & Persiapan Awal (September – Awal Oktober 2026)');
  addDataRow(
    '1.',
    '1 – 14 September 2026',
    'Pembentukan struktur panitia inti; Perumusan visi, misi, konsep dasar acara, penetapan tema ("JIWA KSATRIA, DERAP GEMILANG"), dan tagline lomba; Penyusunan draf awal Juklak & Juknis Lomba mengacu pada Perpang TNI No. 57 & 58.',
    'Tim Formatur, Ketua Pelaksana, Divisi Acara'
  );
  addDataRow(
    '2.',
    '15 – 21 September 2026',
    'Penyusunan draf lengkap Proposal Kegiatan & Rencana Anggaran Biaya (RAB target Rp 64.622.250); Pengadaan ATK & kertas kesekretariatan awal.',
    'Ketua Pelaksana, Sekretaris, Bendahara'
  );
  addDataRow(
    '3.',
    '22 – 30 September 2026',
    'Pengajuan proposal & audiensi kepada Direksi Madrasah Mu’allimin (pencairan subsidi madrasah Rp 15.000.000); Pengurusan surat perizinan peminjaman fasilitas Kampus Terpadu Sedayu; Pembuatan draf MoU sponsorship & paket penawaran 20 tenant UMKM (@Rp 300.000).',
    'Ketua Pelaksana, Sekretaris, Divisi Keamanan & Perizinan, Divisi Dana & Kemitraan'
  );
  addDataRow(
    '4.',
    '1 – 4 Oktober 2026',
    'Survei teknis detail layout venue (Arena 1: Lap. Basket untuk SD, Arena 2: Pelataran Embung untuk SMP, Lap. Minisoccer, Perpus ASM, Ruang Kelas basecamp); Desain visual flyer publikasi pendaftaran peserta & tenant, video teaser, dan rilis publikasi awal (Save the Date).',
    'Divisi Teknis Lapangan, Divisi Acara, Divisi DDD, Divisi LO & Humas'
  );

  addSection('B. Tahap Pendaftaran Peserta & Kemitraan (5 Oktober – 1 November 2026)');
  addDataRow(
    '5.',
    '5 – 18 Oktober 2026',
    'PENDAFTARAN GELOMBANG PERTAMA (GELOMBANG 1):\n• Pembukaan pendaftaran resmi tingkat SD/MI dan SMP/MTs.\n• Verifikasi berkas masuk kontingen & pengelolaan database kontak ofisial tim.\n• Distribusi proposal sponsorship aktif ke mitra perusahaan/instansi.\n• Pembukaan pendaftaran stand bazar tenant UMKM.',
    'Divisi Acara (Pendaftaran), Divisi LO & Humas, Divisi Dana & Kemitraan',
    false,
    60
  );
  addDataRow(
    '6.',
    '19 Oktober – 1 November 2026',
    'PENDAFTARAN GELOMBANG KEDUA (GELOMBANG 2):\n• Pendaftaran gelombang kedua dan pemenuhan kuota target: 36 Peleton (18 Peleton SD/MI & 18 Peleton SMP/MTs).\n• Penutupan dan seleksi 20 stand tenant UMKM.\n• Verifikasi administrasi lengkap peserta (biodata peleton, foto resmi, surat rekomendasi sekolah).\n• Pembentukan grup WhatsApp koordinasi ofisial kontingen.',
    'Divisi Acara (Pendaftaran), Divisi LO & Humas, Divisi Dana & Kemitraan',
    false,
    65
  );

  // ==========================================
  // II. AGENDA DETAIL: TM JURI (7 NOVEMBER 2026)
  // ==========================================
  addSection('C. Rangkaian Agenda Technical Meeting Dewan Juri / TM Juri (November 2026)');
  addDataRow(
    '7.',
    '2 – 5 November 2026',
    'PERSIAPAN ADMINISTRASI & LOGISTIK TM JURI:\n• Pengiriman surat tugas resmi permohonan juri ke instansi KODIM/Koramil (TNI), Polresta/Polsek (POLRI), dan PPI Kota Yogyakarta (masing-masing 2 personil: 1 juri SD & 1 juri SMP).\n• Konfirmasi tertulis kesediaan 6 Dewan Juri.\n• Penggandaan draf Juknis/Juklak, rubrik blangko penilaian PBB peleton, danton, dan variasi-formasi.\n• Penyiapan ruang rapat transit ber-AC, proyektor, serta amplop honor transport TM untuk 6 Dewan Juri (@Rp 50.000).',
    'Sekretaris, Divisi Juri & Penilaian, Divisi Perlengkapan, Bendahara',
    false,
    65
  );
  addDataRow(
    '8.',
    'Jumat, 6 November 2026',
    'SIMULASI & BRIEFING INTERNAL PANITIA PRA-TM JURI:\n• Rapat koordinasi Divisi Juri, Divisi Acara, dan Panitia Inti membahas poin krusial Juknis yang akan diselaraskan.\n• Pengecekan kesiapan berkas berita acara, konsumsi coffee break & makan siang juri, dan penjemputan juri (jika diperlukan).',
    'Panitia Inti, Divisi Juri & Penilaian, Divisi Acara, Divisi Konsumsi'
  );
  addDataRow(
    '9.',
    'Sabtu, 7 November 2026',
    'PELAKSANAAN TECHNICAL MEETING DEWAN JURI (TM JURI):\n• 08.30 – 09.00: Registrasi 6 Dewan Juri & Coffee Morning.\n• 09.00 – 09.30: Pembukaan oleh Ketua Pelaksana & pemaparan teknis umum LBB Mu\'allimin 2027.\n• 09.30 – 11.30: Sidang Penyelarasan Persepsi Dewan Juri (Standarisasi materi Perpang TNI 57 & 58, kriteria penilaian vokal danton, batas toleransi waktu, dan aturan penalti/diskualifikasi).\n• Pembagian kamar juri: 3 Juri SD bertugas di Lap. Basket & 3 Juri SMP bertugas di Pelataran Embung.\n• 11.30 – 12.00: Penandatanganan Berita Acara Kesepakatan Dewan Juri, penyerahan uang transport TM, dan makan siang.',
    'Panitia Inti, Divisi Acara, Divisi Juri & Penilaian, Bendahara',
    true,
    85
  );
  addDataRow(
    '10.',
    '8 – 14 November 2026',
    'PASCA-TM JURI (FINALISASI DOKUMEN):\n• Penyusunan Berita Acara & Notulensi hasil TM Juri ke dalam Juknis Final.\n• Pembuatan master template formulir penilaian juri (SD & SMP) dan rumus spreadsheet komputasi rekapitulasi nilai.',
    'Divisi Juri & Penilaian, Sekretaris, Divisi Acara'
  );

  // ==========================================
  // III. PRODUKSI, PENGADAAN & BRIEFING PANITIA
  // ==========================================
  addSection('D. Tahap Produksi, Pengadaan Logistik & TM/Briefing Internal Panitia (Nov – Des 2026)');
  addDataRow(
    '11.',
    '15 – 30 November 2026',
    'PRODUKSI PERLENGKAPAN & SERAGAM PANITIA:\n• Pendataan ukuran & pemesanan seragam panitia (100 pcs Kaos @Rp 85k, 100 Lanyard @Rp 15k, 100 Topi @Rp 35k).\n• Follow-up realisasi pencairan dana sponsorship tahap 1 & 2.\n• Pembuatan draf rundown teknis detik-per-detik untuk seluruh divisi.',
    'Divisi DDD, Divisi Perlengkapan, Bendahara, Divisi Dana & Kemitraan'
  );
  addDataRow(
    '12.',
    '1 – 20 Desember 2026',
    'PENGADAAN PIALA, HADIAH & PERIZINAN MEDIS:\n• Pemesanan piala bergilir (2 paket SD & SMP), piala tetap juara 1-3 & harapan 1-3 SD & SMP (12 paket), serta piala danton terbaik (2 paket).\n• Pembuatan 18 papan simbolis juara & penyiapan pos anggaran uang pembinaan (Rp 9.600.000).\n• Surat permohonan resmi tim medis & mobil ambulans ke Puskesmas/Dinkes Bantul, serta koordinasi tenda pleton DENBEKANG.',
    'Divisi Penghargaan & Medis, Divisi Perlengkapan, Sekretaris'
  );
  addDataRow(
    '13.',
    '21 – 27 Desember 2026',
    'FINALISASI VENDOR & SIMULASI SISTEM PENILAIAN:\n• Finalisasi kontrak sewa alat (70 unit HT, 3 tenda juri, 16 tenda tenant, 3 set sound system).\n• Simulasi komputasi software rekapitulasi nilai real-time (uji coba input ganda nilai 3 Juri SD dan 3 Juri SMP) guna mencegah selisih/error hitung pada hari-H.',
    'Divisi Perlengkapan, Divisi Juri & Penilaian'
  );
  addDataRow(
    '14.',
    '28 – 31 Desember 2026',
    'TECHNICAL MEETING (TM) INTERNAL PANITIA 1:\n• Rapat koordinasi akbar 100 personil panitia pelaksana.\n• Sosialisasi rundown acara, pemaparan matriks tugas antar divisi, jalur komando radio HT, serta pemetaan 36 kontingen.\n• Pembagian tugas awal Liaison Officer (LO) pendamping peleton.',
    'Ketua Pelaksana, Seluruh Koordinator Divisi, Seluruh Panitia',
    true,
    55
  );

  // ==========================================
  // IV. AGENDA DETAIL: TM PESERTA (10 JANUARI 2027)
  // ==========================================
  addSection('E. Rangkaian Agenda Technical Meeting Peserta / TM Peserta (Januari 2027)');
  addDataRow(
    '15.',
    '2 – 8 Januari 2027',
    'PERSIAPAN DETAIL TM PESERTA:\n• Penggandaan Buku Panduan Teknis (Juknis Final pasca-TM Juri), denah 2 arena lomba, tata tertib basecamp, dan rundown acara (cetak 50 eksemplar).\n• Penyiapan perangkat undian (lotting nomor urut tampil): Kategori SD (SD-01 s.d SD-18) dan Kategori SMP (SMP-01 s.d SMP-18).\n• Penyiapan screen/proyektor, sound system aula, presensi barcode/daftar hadir, dan konsumsi snack peserta TM (target 80 orang).\n• Cetak blangko Berita Acara TM Peserta.',
    'Divisi Acara, Divisi LO & Humas, Divisi Perlengkapan, Divisi Konsumsi',
    false,
    65
  );
  addDataRow(
    '16.',
    'Jumat, 9 Januari 2027',
    'GLADI RUANG & BRIEFING OPERASIONAL TM PESERTA:\n• Penataan kursi dan meja aula Kampus Terpadu Sedayu (format seminar/klasikal).\n• Uji coba perangkat presentasi, mic, proyektor, dan slide pengundian nomor urut.\n• Briefing penerima tamu dan petugas presensi TM Peserta.',
    'Divisi Acara, Divisi Perlengkapan, Divisi LO & Humas'
  );
  addDataRow(
    '17.',
    '10 Januari 2027',
    'PELAKSANAAN TECHNICAL MEETING PESERTA (TM PESERTA):\n• 08.00 – 09.00: Registrasi kehadiran perwakilan 36 kontingen (Pembina/Pelatih/Danton) & pembagian materi cetak.\n• 09.00 – 09.20: Pembukaan oleh MC & sambutan Ketua Panitia LBB Mu\'allimin 2027.\n• 09.20 – 10.30: Pemaparan komprehensif Juklak/Juknis: dimensi Lap. Basket (SD) & Pelataran Embung (SMP), durasi waktu tampil (12-14 menit), batas garis materi, alur pemanggilan (DP 1, 2, 3), dan regulasi sanksi.\n• 10.30 – 11.15: Sesi Diskusi & Tanya Jawab teknis peserta bersama Divisi Acara, Lapangan, dan Juri.\n• 11.15 – 12.00: PROSESI PENGUNDIAN NOMOR URUT TAMPIL (Lotting Undian SD-01 s.d SD-18 & SMP-01 s.d SMP-18), penandatanganan Berita Acara TM, serta pembagian jadwal blok waktu Uji Coba Lapangan.',
    'Panitia Inti, Divisi Acara, Divisi LO & Humas, Divisi Teknis Lapangan, Divisi Juri',
    true,
    90
  );
  addDataRow(
    '18.',
    '11 – 12 Januari 2027',
    'PASCA-TM PESERTA:\n• Publikasi hasil resmi pengundian nomor urut tampil 36 peleton ke grup komunikasi kontingen.\n• Penempelan nomor peleton pada berkas administrasi dan database masing-masing tim.',
    'Divisi LO & Humas, Divisi Acara'
  );

  // ==========================================
  // V. AGENDA DETAIL: UJI COBA LAPANGAN (17 JANUARI 2027)
  // ==========================================
  addSection('F. Rangkaian Agenda Uji Coba Lapangan / Familiarisasi Medan (Januari 2027)');
  addDataRow(
    '19.',
    '13 – 15 Januari 2027',
    'PERSIAPAN TEKNIS ARENA & PLOTTING LO UJI COBA:\n• Pembersihan total Lap. Basket dan Pelataran Embung dari debu, pasir, dan kerikil licin.\n• Pembuatan garis marking sementara (temporary line) pada kedua arena sesuai dimensi resmi perlombaan.\n• Penyusunan matriks jadwal slot waktu uji coba (masing-masing kontingen mendapat alokasi 15 menit: 10 menit coba lapangan, 5 menit transisi):\n  - Arena 1 (Basket): 18 Peleton SD (08.00 – 13.00 WIB secara bergiliran SD-01 s.d SD-18).\n  - Arena 2 (Embung): 18 Peleton SMP (08.00 – 13.00 WIB secara bergiliran SMP-01 s.d SMP-18).\n• Distribusi jadwal slot uji coba kepada seluruh kontingen melalui LO masing-masing.',
    'Divisi Teknis Lapangan, Divisi Acara, Divisi LO & Humas',
    false,
    75
  );
  addDataRow(
    '20.',
    'Sabtu, 16 Januari 2027',
    'BRIEFING LAPANGAN & PENGECEKAN FINAL PRA-UJI COBA:\n• Pemasangan nomor antrean pos transit uji coba.\n• Penyiapan posko medis P3K siaga dan penyediaan air galon peserta di pinggir arena.\n• Briefing 36 LO pendamping terkait tugas memandu tim datang tepat waktu sesuai jadwal slot.',
    'Divisi Teknis Lapangan, Divisi LO & Humas, Divisi Medis, Divisi Keamanan'
  );
  addDataRow(
    '21.',
    '17 Januari 2027',
    'PELAKSANAAN UJI COBA LAPANGAN (FAMILIARISASI MEDAN 36 PELETON):\n• 07.30 – 08.00: Kedatangan kontingen, disambut LO dan diarahkan ke holding area.\n• 08.00 – 13.00: Pelaksanaan uji coba lapangan paralel:\n  - Arena 1 (Lap. Basket): Uji coba bergilir 18 Peleton SD/MI (adaptasi medan, langkah belok, formasi).\n  - Arena 2 (Pelataran Embung): Uji coba bergilir 18 Peleton SMP/MTs (adaptasi pantulan gema suara danton di area embung).\n• Pengujian alur waktu tempuh dan timekeeping stopwatch oleh petugas lapangan.\n• Penanganan medis ringan (jika ada atlet kelelahan).',
    'Divisi Teknis Lapangan, Divisi Acara, Divisi LO & Humas, Divisi Medis, Divisi Keamanan',
    true,
    85
  );
  addDataRow(
    '22.',
    '18 – 19 Januari 2027',
    'EVALUASI TEKNIS PASCA-UJI COBA LAPANGAN:\n• Rapat evaluasi Divisi Lapangan dan Acara mencatat titik-titik krusial kendala peleton (titik licin, sudut sempit, pantulan suara).\n• Penyempurnaan penempatan sound/mic juri dan posisi pembatas penonton agar arena lebih steril.',
    'Divisi Teknis Lapangan, Divisi Acara, Divisi Juri'
  );

  // ==========================================
  // VI. GLADI & PERSIAPAN FINAL H-1
  // ==========================================
  addSection('G. Tahap Pemantapan Logistik, Gladi & H-1 (18 – 23 Januari 2027)');
  addDataRow(
    '23.',
    '20 – 22 Januari 2027',
    'PENGAMBILAN LOGISTIK & BRIEFING PANITIA FINAL (TM PANITIA 2):\n• Pengambilan seluruh perlengkapan sewa (70 unit HT, 3 set sound system, tenda juri & tenant).\n• Cetak massal blangko juri (300 lembar), kartu kendali peleton, ID card official (72 pcs), dan ID card panitia (100 pcs).\n• Pembagian seragam (Kaos, Lanyard, Topi, ID Card) ke seluruh 100 personil panitia.\n• TM Panitia Final: Gladi posko pembagian tugas detail hari-H dan pengecekan alur katering konsumsi.',
    'Divisi Perlengkapan, Divisi DDD, Divisi Konsumsi, Seluruh Koordinator Divisi',
    false,
    70
  );
  addDataRow(
    '24.',
    'Jumat, 23 Januari 2027',
    'GLADI KOTOR, GLADI BERSIH & PERSIAPAN VENUE FINAL (H-1):\n• 08.00 – 14.00 (Loading & Setup): Pengangkutan seluruh logistik ke lokasi; Pemasangan tenda juri & tenda tenant; Pembuatan garis cat/marking permanen batas arena lomba 1 & 2; Penataan panggung upacara di Lap. Minisoccer; Instalasi sound system & pengecekan 70 HT.\n• 14.00 – 16.30 (Gladi Kotor & Simulasi Alur): Simulasi menyeluruh alur pergerakan kontingen (Basecamp Kelas -> DP 1 Presensi -> DP 2 Holding -> Arena Lomba -> DP 3 Foto Kontingen -> Basecamp); Uji coba timekeeper & runner form juri.\n• 16.30 – 17.30: Gladi bersih tata upacara pembukaan & penutupan bersama MC dan petugas pengibar/protokoler.\n• 19.30 – 21.00 (Briefing Akbar H-1): Briefing akbar 100 panitia dipimpin Ketua Pelaksana, pemantapan mental & operasional; Penyimpanan trofi piala, piagam, dan uang pembinaan (Rp 9.6jt) di ruang steril terkunci.',
    'Seluruh Panitia Pelaksana, Divisi Teknis Lapangan, Divisi Perlengkapan, Divisi Acara, Divisi DDD',
    true,
    95
  );

  // ==========================================
  // VII. HARI-H LOMBA (24 JANUARI 2027)
  // ==========================================
  addSection('H. Tahap Pelaksanaan Perlombaan (Hari-H: Sabtu, 24 Januari 2027)');
  addDataRow(
    '25.',
    '06.00 – 07.00 WIB',
    'Registrasi ulang 36 kontingen (18 SD & 18 SMP) di Pos Registrasi, pembagian ID card/snack peserta & karcis parkir, pengawalan langsung ke ruang kelas basecamp oleh masing-masing LO.',
    'Divisi Acara (Registrasi), Divisi LO & Humas, Divisi Keamanan'
  );
  addDataRow(
    '26.',
    '07.00 – 07.30 WIB',
    'Pengkondisian seluruh peleton dan tamu undangan di Lapangan Minisoccer; Penyambutan & sarapan pagi 6 Dewan Juri (3 Juri SD + 3 Juri SMP) di Ruang Transit VIP Perpustakaan ASM.',
    'Divisi Acara, Divisi LO & Humas, Divisi Juri & Penilaian, Divisi Konsumsi'
  );
  addDataRow(
    '27.',
    '07.30 – 08.15 WIB',
    'Upacara Pembukaan LBB Mu\'allimin Tahun 2027 secara resmi oleh Pimpinan Madrasah di Lapangan Minisoccer.',
    'Divisi Acara, Protokoler'
  );
  addDataRow(
    '28.',
    '08.15 – 08.30 WIB',
    'Mobilisasi serentak menuju 2 arena perlombaan:\n• 18 Peleton SD/MI & 3 Dewan Juri SD bergerak menuju Arena 1 (Lap. Basket).\n• 18 Peleton SMP/MTs & 3 Dewan Juri SMP bergerak menuju Arena 2 (Pelataran Embung).\n• Distribusi air mineral gelas peserta (36 dus).',
    'Divisi Acara, Divisi Teknis Lapangan, Divisi LO, Divisi Konsumsi'
  );
  addDataRow(
    '29.',
    '08.30 – 11.30 WIB',
    'Pelaksanaan Perlombaan Sesi I (2 Arena Paralel):\n• Arena 1 (Lap. Basket): Penampilan nomor undian SD-01 s.d SD-12 (dinilai 3 Juri SD: TNI, Polri, PPI).\n• Arena 2 (Pelataran Embung): Penampilan nomor undian SMP-01 s.d SMP-12 (dinilai 3 Juri SMP: TNI, Polri, PPI).\n• Pemantauan medis siaga (Dinkes/PMR), sterilisasi ring arena, dokumentasi video/foto, runner mengambil blangko juri per 3 peleton untuk input nilai real-time.',
    'Divisi Acara, Teknis Lapangan, Divisi Juri, LO & Humas, Keamanan, Medis, DDD',
    false,
    65
  );
  addDataRow(
    '30.',
    '11.30 – 12.30 WIB',
    'Ishoma: Sholat Dhuhur berjamaah di Masjid Hajah Yuliana; Distribusi makan siang untuk 6 Dewan Juri (kotak VIP), 100 panitia, dan tamu undangan; Pengisian air galon panitia & peleton.',
    'Divisi Konsumsi, Seluruh Panitia'
  );
  addDataRow(
    '31.',
    '12.30 – 14.00 WIB',
    'Pelaksanaan Perlombaan Sesi II (2 Arena Paralel):\n• Arena 1 (Lap. Basket): Penampilan nomor undian SD-13 s.d SD-18 (6 peleton terakhir SD).\n• Arena 2 (Pelataran Embung): Penampilan nomor undian SMP-13 s.d SMP-18 (6 peleton terakhir SMP).\n• Input nilai real-time dan rekapitulasi data poin sanksi/penalti.',
    'Divisi Acara, Teknis Lapangan, Divisi Juri, LO & Humas, Keamanan, Medis, DDD',
    false,
    55
  );
  addDataRow(
    '32.',
    '14.00 – 15.00 WIB',
    'Sidang Pleno Dewan Juri & Rekapitulasi Akhir di Ruang Steril Gedung Perpustakaan ASM:\n• Sinkronisasi nilai 3 Juri SD dan 3 Juri SMP oleh tim komputasi.\n• Rapat penetapan juara: Juara 1, 2, 3, Harapan 1, 2, 3, dan Danton Terbaik Kategori SD & SMP.\n• Penandatanganan Surat Keputusan (SK) Pemenang oleh Koordinator Dewan Juri.\n• Pembagian snack sore panitia, juri, dan tamu.',
    'Divisi Juri & Penilaian, Divisi Acara, Divisi Konsumsi',
    false,
    65
  );
  addDataRow(
    '33.',
    '15.00 – 15.30 WIB',
    'Upacara Penutupan LBB Mu\'allimin Tahun 2027 di Lapangan Minisoccer; Pengkondisian seluruh kontingen.',
    'Divisi Acara, Protokoler, Divisi Keamanan'
  );
  addDataRow(
    '34.',
    '15.30 – 16.15 WIB',
    'Pengumuman Pemenang dan Upacara Penganugerahan Hadiah:\n• Penyerahan Piala Bergilir, Piala Tetap 1-3 & Harapan 1-3, Piala Danton Terbaik, serta Piagam Penghargaan.\n• Penyerahan simbolis uang pembinaan (total Rp 9.600.000).\n• Penyerahan plakat penghargaan & honorarium transportasi kepada 6 Dewan Juri.',
    'Divisi Acara, Divisi Penghargaan & Medis, Bendahara',
    false,
    60
  );
  addDataRow(
    '35.',
    '16.15 – selesai',
    'Pembubaran kepulangan seluruh kontingen secara tertib; Operasi semut kebersihan area madrasah; Pengembalian logistik, HT, dan pengamanan inventaris panitia.',
    'Seluruh Panitia, Divisi Perlengkapan, Divisi Keamanan, Divisi Konsumsi'
  );

  // ==========================================
  // VIII. PASCA-LOMBA & LPJ
  // ==========================================
  addSection('I. Tahap Pasca-Pelaksanaan & Pelaporan / LPJ (Januari – Februari 2027)');
  addDataRow(
    '36.',
    '25 – 31 Januari 2027',
    'Pengembalian seluruh alat pinjaman/sewaan (HT, sound system, tenda, kabel); Rapat Evaluasi Akbar Panitia Pelaksana (pembahasan kendala per divisi & inventarisasi); Rilis video resmi After Movie LBB Mu\'allimin 2027.',
    'Ketua Pelaksana, Panitia Inti, Divisi Perlengkapan, Divisi DDD'
  );
  addDataRow(
    '37.',
    '1 – 20 Februari 2027',
    'Penyusunan dokumen Laporan Pertanggungjawaban (LPJ) Keuangan & Kegiatan (audit pemasukan pendaftaran 36 peleton, subsidi madrasah, realisasi dana sponsor, sewa 20 tenant, serta pengeluaran operasional).',
    'Sekretaris, Bendahara, Divisi Dana & Kemitraan, Ketua Pelaksana'
  );
  addDataRow(
    '38.',
    '22 – 28 Februari 2027',
    'Penyerahan dokumen fisik LPJ Final (cetak 5 bundel resmi) kepada Pihak Direksi Madrasah Mu\'allimin Yogyakarta; Pembubaran resmi kepanitiaan.',
    'Ketua Pelaksana, Sekretaris, Bendahara'
  );

  await wb.xlsx.writeFile('TIMELINE PANITIA LBB NEW.xlsx');
  console.log('Successfully written TIMELINE PANITIA LBB NEW.xlsx with deep details!');
}

updateDetailTimelinePanitia().catch(console.error);
