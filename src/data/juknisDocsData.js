/**
 * src/data/juknisDocsData.js
 * Dokumen Resmi Terpisah: 
 * 1. PETUNJUK TEKNIS PENILAIAN & KEJUARAAN (Bab A s.d. D Verbatim)
 * 2. PETUNJUK TEKNIS PENDAFTARAN (Bab A s.d. B Verbatim)
 * 3. RUNDOWN RESMI KEGIATAN (TM, Uji Coba, Hari-H Verbatim)
 * Single Source of Truth untuk modul tampilan Juknis & Regulasi
 */

export const JUKNIS_PENILAIAN_CHAPTERS = [
  {
    id: 'bab-a',
    letter: 'A',
    title: 'SISTEM PENILAIAN, SANGGAH & PENENTUAN JUARA',
    points: [
      {
        number: 1,
        title: 'Mekanisme dan Aspek Penilaian Dewan Juri',
        content: `Penilaian dilakukan secara objektif dan independen oleh 6 Dewan Juri (unsur TNI, POLRI, dan Profesional/Sipil: 3 Juri Arena 1 (SD) & 3 Juri Arena 2 (SMP)). Dewan Juri menilai performa materi PBB Peleton dan performa Komandan Peleton (Danton) secara simultan dalam satu lembar penilaian terpadu. Keputusan Dewan Juri mengenai mutu gerak bersifat mutlak dan tidak dapat diganggu gugat.`
      },
      {
        number: 2,
        title: 'Metode Penilaian (Sistem Coret 5 Predikat Baku)',
        content: `Penilaian menggunakan sistem coret nominal angka langsung pada lembar juri (tanpa pembobotan desimal di lapangan). Angka yang dicoret mencerminkan paduan Kebenaran Teknik dan Kekompakan:`,
        subItems: [
          `a. KS (Kurang Sekali) : 1 opsi angka pasti (50).`,
          `b. K (Kurang) : 3 opsi angka (Teknik Salah & Tidak Kompak).`,
          `c. C (Cukup) : 3 opsi angka (Teknik Salah & Kompak).`,
          `d. B (Baik) : 3 opsi angka (Teknik Benar & Tidak Kompak).`,
          `e. BS (Baik Sekali) : 1 opsi angka maksimal (Teknik Benar & Kompak Sempurna).`
        ]
      },
      {
        number: 3,
        title: 'Kriteria Penilaian dan Sebaran Nilai',
        content: `Kriteria penilaian dan sebaran nilai mencakup sebaran materi peleton, sebaran komandan peleton, serta formula nilai murni dan nilai akhir:`,
        subItems: [
          `a. Sebaran Nilai Materi Peleton:`,
          `• Sederhana: KS = 50 | K = 52, 54, 56 | C = 58, 60, 62 | B = 64, 66, 68 | BS = 70`,
          `• Menengah: KS = 50 | K = 53, 56, 59 | C = 62, 65, 68 | B = 71, 74, 77 | BS = 80`,
          `• Kompleks: KS = 50 | K = 54, 58, 62 | C = 66, 70, 74 | B = 78, 82, 86 | BS = 90`,
          `Gerakan yang terlewat atau tidak dilaksanakan sama sekali diberi nilai 0 (nol).`,
          `b. Sebaran Nilai Komandan Peleton (Danton): Dinilai pada 4 aspek dengan sebaran nilai skala maksimal 90 (KS=50 | K=54, 58, 62 | C=66, 70, 74 | B=78, 82, 86 | BS=90):`,
          `1) Aspek 1: Penguasaan Materi Lomba (Bobot 35%)`,
          `2) Aspek 2: Kualitas Suara / Vokal (Bobot 25%)`,
          `3) Aspek 3: Sikap & Pelaporan (Bobot 20%)`,
          `4) Aspek 4: Penguasaan Lapangan (Bobot 20%)`,
          `c. Formula Nilai Murni & Nilai Akhir (Akumulasi 3 Dewan Juri):`,
          `1) Nilai Murni Peleton = Skor Peleton Juri 1 + Skor Peleton Juri 2 + Skor Peleton Juri 3.`,
          `2) Nilai Akhir Peleton = (Nilai Murni Peleton) – (Total Akumulasi Penalti Peleton).`,
          `3) Skor Danton Juri n = (Materi × 35%) + (Vokal × 25%) + (Sikap × 20%) + (Lapangan × 20%).`,
          `4) Nilai Murni Danton = Skor Danton Juri 1 + Skor Danton Juri 2 + Skor Danton Juri 3.`,
          `5) Nilai Akhir Danton = (Nilai Murni Danton) – (Total Akumulasi Penalti Danton).`
        ]
      },
      {
        number: 4,
        title: 'Definisi Nilai Murni Peleton/Komandan',
        content: `Nilai Murni adalah total skor yang diperoleh Peleton/Komandan dari akumulasi 3 Dewan Juri sebelum dikurangi penalti lapangan maupun sanksi tata tertib.`
      },
      {
        number: 5,
        title: 'Kriteria Penentuan & Tie-Breaker Juara Peleton',
        content: `Penentuan Juara Peleton didasarkan pada perolehan Nilai Akhir Peleton tertinggi. Apabila terdapat kesamaan Nilai Akhir Peleton, peringkat ditentukan berdasarkan urutan prioritas:`,
        subItems: [
          `a. Nilai Murni Peleton tertinggi (akumulasi 3 juri sebelum penalti);`,
          `b. Akumulasi pengurangan poin penalti paling sedikit;`,
          `c. Nilai Murni Komandan Peleton (Danton) tertinggi; dan`,
          `d. Hasil musyawarah Dewan Juri dalam Sidang Pleno Juri yang bersifat final dan mengikat.`
        ]
      },
      {
        number: 6,
        title: 'Kriteria Penentuan & Tie-Breaker Juara Komandan',
        content: `Penentuan Juara Danton didasarkan pada perolehan Nilai Akhir Komandan tertinggi. Apabila terdapat kesamaan Nilai Akhir Komandan, peringkat ditentukan berdasarkan urutan prioritas:`,
        subItems: [
          `a. Nilai Murni Danton tertinggi (akumulasi 3 juri sebelum penalti);`,
          `b. Akumulasi pengurangan poin penalti Danton paling sedikit;`,
          `c. Akumulasi nilai tertinggi pada Aspek Penguasaan Materi Lomba (bobot 35%);`,
          `d. Akumulasi nilai tertinggi pada Aspek Kualitas Suara/Vokal (bobot 25%); dan`,
          `e. Hasil musyawarah Dewan Juri dalam Sidang Pleno Juri yang bersifat final dan mengikat.`
        ]
      },
      {
        number: 7,
        title: 'Sistem Perolehan Poin Juara Umum',
        content: `Juara Umum ditetapkan secara terpisah untuk tingkat SD/MI dan SMP/MTs berdasarkan akumulasi poin prestasi dari seluruh perwakilan sekolah yang sama:`,
        pointCards: [
          { label: 'Juara 1 Peleton', score: '6 Poin', type: 'peleton' },
          { label: 'Juara 2 Peleton', score: '5 Poin', type: 'peleton' },
          { label: 'Juara 3 Peleton', score: '4 Poin', type: 'peleton' },
          { label: 'Juara Harapan 1 Peleton', score: '3 Poin', type: 'peleton' },
          { label: 'Juara Harapan 2 Peleton', score: '2 Poin', type: 'peleton' },
          { label: 'Juara Harapan 3 Peleton', score: '1 Poin', type: 'peleton' },
          { label: 'Juara 1 Komandan Terbaik', score: '3 Poin', type: 'danton' },
          { label: 'Juara 2 Komandan Terbaik', score: '2 Poin', type: 'danton' },
          { label: 'Juara 3 Komandan Terbaik', score: '1 Poin', type: 'danton' },
        ],
        extraText: `Total Poin Sekolah = (Total Poin Prestasi Peleton) + (Total Poin Prestasi Danton). Sekolah dengan akumulasi poin tertinggi dinobatkan sebagai Juara Umum.`
      },
      {
        number: 8,
        title: 'Tie-Breaker Juara Umum',
        content: `Apabila terdapat dua atau lebih sekolah yang memperoleh Total Poin Juara Umum yang sama, penentuan peringkat Juara Umum dilakukan berdasarkan urutan prioritas:`,
        subItems: [
          `a. Nilai Murni Peleton Tertinggi dari peleton terbaik perwakilan sekolah tersebut;`,
          `b. Akumulasi Penalti Peleton Paling Sedikit dari peleton terbaik perwakilan sekolah tersebut;`,
          `c. Nilai Murni Komandan Peleton (Danton) Tertinggi dari perwakilan sekolah tersebut; dan`,
          `d. Hasil musyawarah Dewan Juri dalam Sidang Pleno Juri yang keputusannya bersifat final dan mengikat.`
        ]
      },
      {
        number: 9,
        title: 'Transparansi Nilai (Akses e-Rekapitulasi Berbasis Akun Gmail Peleton)',
        content: `Publikasi rekapitulasi nilai peleton menerapkan sistem rilis bertahap (rolling release) pada portal resmi https://lbb.tontimuallimin.com dengan estimasi waktu ±1 (satu) jam setelah peleton menyelesaikan penampilan. Official peleton dapat mengakses lembar rekapitulasi nilai secara privat menggunakan akun Gmail resmi yang terdaftar saat registrasi.`
      },
      {
        number: 10,
        title: 'Mekanisme Pengajuan Sanggah (Protes Resmi)',
        content: `Ketentuan resmi pengajuan sanggahan:`,
        subItems: [
          `a. Batasan Sanggah: Protes HANYA diterima untuk dugaan kekeliruan administratif non-penilaian (kesalahan penjumlahan skor, keliru input sistem dari lembar juri, atau ketidaksesuaian catatan penalti). Penilaian kualitatif dewan juri mengenai mutu gerakan bersifat mutlak dan tidak dapat disanggah.`,
          `b. Batas Waktu Pengajuan: Dibuka sejak nilai dirilis di portal dan DITUTUP SERENTAK pukul 15.00 WIB.`,
          `c. Prosedur Sanggah: Diajukan secara TERTULIS menggunakan Formulir Sanggahan Resmi oleh 1 (satu) orang Official resmi terdaftar di Ruang Informasi Resmi Panitia dengan melampirkan bukti fisik/digital yang valid. Panitia TIDAK melayani protes secara lisan.`,
          `d. Keputusan Sanggah: Jika protes diterima dan sah, Panitia menerbitkan 'Pemberitahuan Koreksi Hasil Resmi' sebelum upacara penutupan.`
        ]
      }
    ]
  },
  {
    id: 'bab-b',
    letter: 'B',
    title: 'PROSEDUR BACKUP DAN MITIGASI GANGGUAN SISTEM E-PENILAIAN',
    points: [
      {
        number: 1,
        title: 'Penerapan Prosedur Manual Fisik Saat Gangguan',
        content: `Apabila terjadi gangguan teknis atau koneksi pada sistem digital e-penilaian (input nilai juri, kalkulasi skor, portal rilis nilai, dan database), panitia menerapkan prosedur pencatatan manual fisik untuk menjamin kelancaran lomba.`
      },
      {
        number: 2,
        title: 'Pencatatan Formulir Fisik Oleh Juri',
        content: `Juri dan/atau Asisten Juri mencatat nilai secara manual pada formulir fisik yang telah disiapkan panitia. Catatan fisik tersebut menjadi dokumen otentik dan dasar verifikasi saat sistem kembali normal.`
      },
      {
        number: 3,
        title: 'Input dan Verifikasi Ulang Pasca-Pemulihan',
        content: `Setelah sistem berfungsi normal, operator dan panitia berwenang melakukan input dan verifikasi ulang data berdasarkan lembar fisik yang sah.`
      }
    ]
  },
  {
    id: 'bab-c',
    letter: 'C',
    title: 'KETENTUAN SANKSI DAN PENALTI PENGURANGAN NILAI',
    tableNote: `Pelanggaran teknis dan ketentuan lapangan dikenai sanksi berupa pengurangan nilai secara kumulatif pada rekapitulasi nilai akhir. Pengurangan nilai diberlakukan sesuai dengan pihak yang melakukan pelanggaran, yaitu Peleton, Komandan Peleton, atau keduanya.`,
    points: [
      {
        number: 1,
        title: 'Upacara Pembukaan',
        content: 'Peleton yang diwajibkan mengikuti Upacara Pembukaan (SD/SMP Urutan Tampil 6 s.d. 10) tetapi tidak hadir dikenai penalti sebesar -150 poin. Peleton yang terlambat hadir dikenai penalti sebesar -50 poin untuk setiap kelipatan keterlambatan 5 menit. Penalti berlaku terhadap nilai Peleton.'
      },
      {
        number: 2,
        title: 'Keterlambatan Hadir di DP 1',
        content: 'Peleton yang tidak hadir di DP 1 setelah 3 (tiga) kali pemanggilan resmi melalui pengeras suara, dengan interval 2 (dua) menit antar pemanggilan, dikenai pengurangan nilai sebesar -100 poin dan urutan tampil digeser ke posisi paling akhir. Apabila peleton tetap tidak hadir tanpa konfirmasi resmi, peserta dikenai sanksi DISKUALIFIKASI. Penalti berlaku terhadap nilai Peleton.'
      },
      {
        number: 3,
        title: 'Jumlah Personel Kurang',
        content: 'Peleton yang memasuki arena dengan jumlah personel kurang dari 22 orang, terdiri atas 1 Komandan Peleton dan 21 anggota, dikenai penalti tetap sebesar -75 poin. Penalti berlaku terhadap nilai Peleton.'
      },
      {
        number: 4,
        title: 'Kelebihan Durasi Waktu',
        content: 'Peleton dan Komandan Peleton wajib menyelesaikan materi lomba dalam durasi maksimal 8 menit untuk SD dan 12 menit untuk SMP. Kelebihan durasi dikenai penalti sebesar -50 poin untuk setiap rentang 1 s.d. 30 detik dan kelipatannya. Penalti diberlakukan terhadap nilai Peleton.'
      },
      {
        number: 5,
        title: 'Pelanggaran Garis',
        content: 'Pelanggaran garis dibedakan berdasarkan pihak yang melakukan pelanggaran:',
        subItems: [
          'a. Anggota Peleton yang menginjak atau keluar dari garis arena dikenai penalti -50 poin untuk setiap kejadian terhadap nilai Peleton.',
          'b. Komandan Peleton yang menginjak atau keluar dari Kotak Danton berukuran 1,5 × 1,5 meter dikenai penalti -50 poin untuk setiap kejadian terhadap nilai Komandan Peleton.'
        ]
      },
      {
        number: 6,
        title: 'Gerakan Terlewat / Tidak Urut',
        content: 'Gerakan yang terlewat tetapi kemudian dilaksanakan di luar urutan diberikan nilai minimal (50) pada gerakan tersebut. Gerakan yang terlewat dan tidak dilaksanakan sama sekali diberikan nilai 0 (nol). Kesalahan gerakan terlewat/tidak urut diperhitungkan dalam penilaian Penguasaan Materi Komandan Peleton.'
      },
      {
        number: 7,
        title: 'Gerakan Berangkai Terputus',
        content: 'Rangkaian gerakan yang ditandai dengan tanda "-" wajib dilaksanakan secara berkesinambungan. Apabila rangkaian tersebut diselingi jeda atau gerakan tambahan yang tidak diperintahkan, maka:',
        subItems: [
          'a. Gerakan tersebut diberikan nilai minimal (50) pada penilaian Kebenaran Teknik Peleton.',
          'b. Kesalahan gerakan berangkai terputus diperhitungkan dalam penilaian Penguasaan Materi Komandan Peleton.',
          'Dengan demikian, kesalahan Komandan dan respons Peleton dinilai pada kategori masing-masing.'
        ]
      },
      {
        number: 8,
        title: 'Pelanggaran Kebersihan Basecamp',
        content: 'Meninggalkan ruang basecamp dalam keadaan kotor atau berantakan dikenai penalti -150 poin pada rekapitulasi nilai akhir peleton sesuai ketentuan Pasal 14 Tata Tertib Peserta.'
      },
      {
        number: 9,
        title: 'Pelanggaran Kawasan Tanpa Rokok & Vape',
        content: 'Pelanggaran terang-terangan di ruang basecamp atau yang melibatkan personel kontingen berseragam setelah diberikan teguran dikenai penalti sebesar -50 poin terhadap nilai Peleton sesuai Pasal 9 Tata Tertib Peserta.'
      },
      {
        number: 10,
        title: 'Yel-Yel Selama Penampilan',
        content: 'Peserta, Official, atau pihak yang menjadi bagian dari tim dilarang meneriakkan yel-yel, memberikan aba-aba, atau memberikan bentuk dukungan suara yang dapat memengaruhi jalannya penampilan selama Peleton sedang tampil.',
        subItems: [
          'a. Pelanggaran ke-1 dan ke-2 diberikan Peringatan Lisan oleh Panitia Lapangan.',
          'b. Pelanggaran ketiga dan setiap pelanggaran berikutnya dikenai penalti -50 poin terhadap Nilai Peleton dan Nilai Komandan Peleton untuk setiap kejadian.',
          'c. Pelanggaran sengaja, berulang, atau berat dapat langsung dikenai penalti tanpa peringatan awal.',
          'd. Penalti akibat kegaduhan suporter dibebankan terhadap NILAI PELETON dan NILAI DANTON.'
        ]
      },
      {
        number: 11,
        title: 'Pencatatan Penalti',
        content: 'Seluruh penalti dicatat oleh Asisten Juri dan Hakim Garis pada Berita Acara / Lembar Pengawasan Lapangan, lalu disahkan untuk dipotongkan pada rekapitulasi nilai akhir.'
      }
    ],
    closingNote: 'Seluruh penalti dicatat oleh Asisten Juri dan Hakim Garis pada Berita Acara / Lembar Pengawasan Lapangan, lalu disahkan untuk dipotongkan pada rekapitulasi nilai akhir.'
  },
  {
    id: 'bab-d',
    letter: 'D',
    title: 'PENUTUP',
    content: `Petunjuk Teknis Penilaian dan Kejuaraan ini menjadi pedoman operasional resmi bagi seluruh panitia, dewan juri, dan peserta LBB Mu'allimin Tahun 2027. Seluruh hal teknis tambahan yang disepakati bersama dalam forum Technical Meeting mengikat secara sah dan menjadi bagian tak terpisahkan dari juknis ini.`
  }
];

export const JUKNIS_PENDAFTARAN_CHAPTERS = [
  {
    id: 'reg-a',
    letter: 'A',
    title: 'KETENTUAN UMUM DAN ALUR TEKNIS PENDAFTARAN',
    items: [
      {
        number: 1,
        title: 'Sistem dan Mekanisme Pendaftaran',
        sub: [
          `a. Pendaftaran administratif awal LBB Mu’allimin 2027 dilaksanakan secara daring melalui Portal Resmi Sistem Informasi LBB Mu’allimin pada laman https://lbb.tontimuallimin.com/ , dengan verifikasi dokumen fisik yang dilaksanakan pada saat Technical Meeting (TM).`,
          `b. Panitia tidak melayani pendaftaran manual secara luring/offline di tempat maupun pendaftaran susulan setelah kuota resmi terpenuhi.`,
          `c. Sistem pendaftaran menerapkan prinsip first-come, first-served, di mana tim yang menyelesaikan pengisian formulir, melengkapi berkas unggahan, dan memverifikasi setoran pembayaran terlebih dahulu yang berhak mengamankan slot kuota resmi.`
        ]
      },
      {
        number: 2,
        title: 'Alokasi Kuota Peserta',
        sub: [
          `a. Batas total kuota peserta adalah 36 Peleton se-Daerah Istimewa Yogyakarta, dengan alokasi berimbang:\n1) Tingkat SD/MI Sederajat: Kuota 18 Peleton (Arena 1 - Lapangan Basket).\n2) Tingkat SMP/MTs Sederajat: Kuota 18 Peleton (Arena 2 - Pelataran Embung).`,
          `b. Setiap sekolah/madrasah diperkenankan mengirimkan maksimal 2 (dua) peleton (dapat berupa peleton putra, peleton putri, maupun peleton campuran).`
        ]
      },
      {
        number: 3,
        title: 'Jadwal dan Lini Masa Pendaftaran',
        sub: [
          `a. Periode Pendaftaran Daring: Dibuka mulai Senin, 26 Oktober 2026 pukul 00.00 WIB s.d. Ahad, 22 November 2026 pukul 23.59 WIB (pendaftaran otomatis ditutup lebih awal apabila total kuota 36 peleton telah terpenuhi).`,
          `b. Technical Meeting & Verifikasi Dokumen Fisik: Sabtu, 9 Januari 2027 pukul 13.00 - 16.30 WIB di Aula Kampus Induk Madrasah Mu’allimin Wirobrajan.`,
          `c. Uji Coba Lapangan: Sabtu, 16 Januari 2027 pukul 07.00 – 13.00 WIB di Kampus Terpadu Sedayu.`,
          `d. Hari Pelaksanaan Lomba & Daftar Ulang: Ahad, 24 Januari 2027 mulai pukul 06.00 WIB di Kampus Terpadu Sedayu.`
        ]
      },
      {
        number: 4,
        title: 'Biaya Pendaftaran dan Tata Cara Pembayaran',
        sub: [
          `a. Biaya pendaftaran per peleton terbagi ke dalam 2 (dua) gelombang berjenjang (bersifat Non-Refundable / tidak dapat ditarik kembali apabila peleton mengundurkan diri):\n1) Gelombang 1 (26 Oktober – 8 November 2026): Rp 350.000,- / peleton.\n2) Gelombang 2 (9 November – 22 November 2026/Kuota Penuh): Rp 400.000,- / peleton.\n3) Gelombang 2 hanya dibuka jika sisa kuota masih ada.\n4) Keterangan: Setiap pembayaran wajib menggunakan kode unik 108 pada nominal transfer.`,
          `b. Pembayaran disetorkan via transfer perbankan ke rekening resmi panitia:\n1) Bank Tujuan: BSI (Bank Syariah Indonesia)\n2) Nomor Rekening: 2600051817\n3) Atas Nama: Kepala Urusan Admisi, Humas, dan Kerja Sama\n4) Format Berita Transfer Wajib: NAMA SEKOLAH_JUMLAH PELETON (Contoh: MTS MU’ALLIMIN YK_1).`,
          `c. Ketentuan Nominal Pembayaran:\n1) 1 (satu) peleton Gelombang 1: Rp350.108,-\n2) 2 (dua) peleton Gelombang 1: Rp700.108,-\n3) 1 (satu) peleton Gelombang 2: Rp400.108,-\n4) 2 (dua) peleton Gelombang 2: Rp800.108,-`,
          `d. Bukti transfer asli (struk ATM/teller atau tangkapan layar m-banking yang jelas) wajib diunggah pada formulir digital pendaftaran.`,
          `e. Setiap peleton terdaftar berhak mendapatkan fasilitas: ruang kelas basecamp, 1 (satu) dus Air Minum Kemasan (botol) per peleton saat registrasi ulang, 3 buah ID Card resmi (1 Official & 2 Pendukung Resmi), Nomor Dada Peleton, 2 kantong sampah terpilah, akses kantong parkir, dan E-Sertifikat resmi.`
        ]
      },
      {
        number: 5,
        title: 'Alur Prosedur Pendaftaran Digital (5 Langkah)',
        sub: [
          `a. Langkah 1 (Akses Formulir): Perwakilan sekolah/peleton membuka portal resmi https://lbb.tontimuallimin.com/ lalu meng-klik tombol "Daftar Peleton" untuk masuk ke formulir pendaftaran.`,
          `b. Langkah 2 (Data Sekolah & Akun Tim): Memilih jenjang perlombaan (SD/MI atau SMP/MTs), mendaftarkan email Google aktif (digunakan untuk login Dashboard Tim), mengisi biodata sekolah, mengunggah logo sekolah, dan memilih kategori peleton (Putra/Putri/Campuran).`,
          `c. Langkah 3 (Data Danton & Official): Meng-input identitas lengkap Komandan Peleton beserta unggahan scan Kartu Pelajar sah, serta mengisi identitas Official/Pelatih pendamping lengkap dengan nomor WhatsApp aktif dan unggahan scan KTP asli.`,
          `d. Langkah 4 (Pembayaran & Pakta Integritas): Mengunggah bukti transfer biaya pendaftaran yang valid dan membubuhkan tanda tangan digital pada kanvas Pakta Integritas Online.`,
          `e. Langkah 5 (Konfirmasi & Aktivasi Dashboard Tim): Tim menerima Kode Registrasi unik resmi. Panitia melakukan verifikasi dalam 1x24 jam. Setelah diverifikasi, tim dapat login ke Dashboard Peserta untuk melengkapi susunan identitas peleton.`
        ]
      },
      {
        number: 6,
        title: 'Dokumen Persyaratan yang Wajib Diunggah (Digital)',
        sub: [
          `a. Surat Tugas / Rekomendasi Resmi dari Kepala Sekolah/Madrasah asli bertanda tangan dan berstempel basah (format PDF/JPG, maks. 2 MB).`,
          `b. Bukti transfer biaya pendaftaran sesuai biaya pendaftaran gelombang berjalan (format JPG/PNG, maks. 2 MB).`,
          `c. Scan/Foto Kartu Pelajar sah Komandan Peleton (Danton) pangkalan bersangkutan (format Foto/PDF, maks. 3 MB).`,
          `d. Scan/Foto KTP asli Official atau Pelatih pendamping resmi peleton sekolah (format Foto/PDF, maks. 3 MB).`,
          `e. Logo peleton atau sekolah/madrasah beresolusi tinggi format PNG transparan.`,
          `f. Pasfoto resmi seluruh personel peleton ukuran 3x4 (latar belakang Merah untuk jenjang SD/MI dan latar belakang Biru untuk jenjang SMP/MTs) diunggah melalui menu Identitas Personel di portal peserta.`,
          `g. Data identitas seluruh personel peleton berupa Nama Lengkap sesuai ijazah terakhir atau dokumen resmi (digunakan untuk penerbitan sertifikat), NISN, Tempat dan Tanggal Lahir, serta Kelas. Data diisi melalui portal peserta sesuai format yang telah disediakan.`
        ]
      },
      {
        number: 7,
        title: 'Regulasi Komposisi Personel Peleton',
        sub: [
          `a. Komposisi resmi peleton berjumlah maksimal 25 personel, terdiri atas: 1 Komandan Peleton (Danton), 21 Anggota Inti (3 saf x 7 banjar), dan 3 Orang Cadangan.`,
          `b. Didampingi maksimal 3 orang pendamping peleton: 1 Official (Pelatih/Pembina) dan 2 Pendukung Resmi (Medis/Dokumentasi) yang akan mengenakan ID Card resmi panitia.`,
          `c. Batas minimal personel tampil di arena adalah 22 orang (1 Danton + 21 Anggota Inti). Penggantian pemain inti dengan cadangan hanya diperkenankan saat transisi resmi yang diatur dalam materi juknis.`
        ]
      },
      {
        number: 8,
        title: 'Kewajiban Penyerahan Berkas Fisik Asli saat Technical Meeting',
        sub: [
          `a. Meskipun proses pendaftaran awal diselenggarakan secara digital, delegasi resmi sekolah/madrasah (maksimal 2 orang perwakilan per SEKOLAH/MADRASAH, baik yang mengirimkan 1 maupun 2 peleton) WAJIB membawa dan menyerahkan berkas fisik asli pada saat registrasi Technical Meeting (Sabtu, 9 Januari 2027 pukul 12.30 - 13.00 WIB di Aula Kampus Induk Mu’allimin Wirobrajan). Bagi sekolah yang mengirimkan 2 (dua) peleton, delegasi yang hadir berhak mewakili proses verifikasi kedua peleton tersebut sekaligus.`,
          `b. Berkas fisik asli yang diserahkan meliputi:\n1) Surat Tugas / Rekomendasi Kepala Sekolah asli berstempel basah yang memuat daftar nama lengkap seluruh peleton (1 Danton, 21 Inti, 3 Cadangan, 1 Official, 2 Pendukung Resmi).\n2) Pakta Integritas fisik bermaterai Rp 10.000 yang telah ditandatangani basah oleh Official bersangkutan.`
        ]
      },
      {
        number: 9,
        title: 'Ketentuan Diskualifikasi & Sanksi Administrasi',
        sub: [
          `a. Diskualifikasi Mutlak: Diberikan kepada peleton yang memanipulasi data identitas siswa, memalsukan stempel/tanda tangan surat rekomendasi kepala sekolah, atau menyertakan siswa dari luar pangkalan sekolah yang bersangkutan.`,
          `b. Ketentuan Pembatalan (Non-Refundable): Uang pendaftaran yang telah dibayarkan tidak dapat ditarik kembali apabila peleton membatalkan keikutsertaan secara sepihak.`,
          `c. Pergantian Personel: Perubahan data personel, termasuk nama, susunan, posisi, foto, maupun pergantian individu, diperbolehkan sampai dengan sebelum pelaksanaan Technical Meeting (TM). Setiap perubahan wajib dilaporkan dan disesuaikan dengan Surat Tugas/Rekomendasi resmi dari Kepala Sekolah/Madrasah. Perubahan yang tidak tercantum atau tidak sesuai dengan Surat Tugas/Rekomendasi resmi dinyatakan tidak sah.`
        ]
      },
      {
        number: 10,
        title: 'Pusat Layanan dan Narahubung Resmi',
        sub: [
          `a. Seluruh komunikasi, koordinasi, dan konfirmasi resmi pendaftaran dilayani melalui saluran:\n1) Website Portal Pendaftaran: https://lbb.tontimuallimin.com/\n2) WhatsApp Helpdesk Resmi: https://wa.me/6281947491505 (Admin)\n3) Email Resmi: lbb@tontimuallimin.com\n4) Instagram Resmi: @lbbmuin | @mualliminjogja | TikTok: @tontimuallimin`
        ]
      },
      {
        number: 11,
        title: 'Mitigasi Gangguan Sistem Digital Pendaftaran',
        sub: [
          `Apabila peserta mengalami kendala teknis login atau gagal unggah dokumen akibat gangguan server/portal resmi, panitia menyediakan mekanisme verifikasi dan pengumpulan dokumen secara manual/darurat melalui koordinasi Helpdesk Resmi WhatsApp. Kendala akibat kelalaian peserta melewati batas waktu tidak termasuk dalam ketentuan ini.`
        ]
      }
    ]
  },
  {
    id: 'reg-b',
    letter: 'B',
    title: 'PENUTUP',
    content: `Petunjuk Teknis Pendaftaran ini menjadi pedoman operasional resmi bagi seluruh panitia, dewan juri, dan peserta LBB Mu'allimin Tahun 2027. Seluruh hal teknis tambahan yang disepakati bersama dalam forum Technical Meeting mengikat secara sah dan menjadi bagian tak terpisahkan dari juknis ini.`
  }
];

export const RUNDOWN_DATA = {
  tm: {
    title: 'Rundown Technical Meeting (TM) Peserta',
    date: 'Sabtu, 9 Januari 2027',
    venue: 'Aula Kampus Induk Madrasah Mu’allimin Wirobrajan (Jl. Letjen S. Parman No. 68, Yogyakarta)',
    items: [
      { time: '12.30 – 13.00', duration: "30'", agenda: 'Registrasi & Verifikasi Dokumen Fisik Asli', desc: 'Delegasi resmi sekolah (maksimal 2 orang) melakukan presensi dan menyerahkan berkas fisik: Surat Rekomendasi/Tugas Kepala Sekolah asli berstempel basah & Pakta Integritas bermaterai Rp 10.000. (Divisi Kesekretariatan)' },
      { time: '13.00 – 13.15', duration: "15'", agenda: 'Pembukaan Technical Meeting', desc: 'Pembukaan forum TM oleh MC, pembacaan kalam ilahi, menyanyikan lagu Indonesia Raya & Mars Sang Surya. (Divisi Acara)' },
      { time: '13.15 – 13.30', duration: "15'", agenda: 'Sambutan Panitia & Pimpinan', desc: 'Sambutan Perwakilan Direksi Madrasah Mu\'allimin Muhammadiyah Yogyakarta.' },
      { time: '13.30 – 14.30', duration: "60'", agenda: 'Pemaparan Materi Teknis & Juknis Lomba', desc: 'Pemaparan regulasi PBB Perpang TNI 58 & 57/2018 (Hormat Kanan Perpang 45/2014), ketentuan arena, alur DP 1 & DP 2, sistem e-penilaian, dan tata tertib madrasah/basecamp. (Divisi Acara & Dewan Juri)' },
      { time: '14.30 – 15.15', duration: "45'", agenda: 'Sesi Tanya Jawab Teknis', desc: 'Diskusi interaktif, klarifikasi materi teknis perlombaan, dan penandatanganan Berita Acara / Notulen Resmi TM yang mengikat secara sah.' },
      { time: '15.15 – 16.00', duration: "45'", agenda: 'Pengundian Terbuka (Lotting) Nomor Urut Tampil', desc: 'Lotting resmi nomor dada: SD (SD-111 s.d. SD-175) dan SMP (SMP-222 s.d. SMP-286). Pencatatan resmi daftar urutan tampil. (Divisi Acara)' },
      { time: '16.00 – 16.30', duration: "30'", agenda: 'Konfirmasi Uji Coba Lapangan & Penutup', desc: 'Penjelasan teknis orientasi medan/uji coba lapangan, pengisian survei kesediaan melalui portal digital, doa bersama, dan penutupan.' }
    ]
  },
  trial: {
    title: 'Rundown Uji Coba Lapangan (Orientasi Medan)',
    date: 'Sabtu, 16 Januari 2027',
    venue: 'Kampus Terpadu Madrasah Mu’allimin Sedayu, Bantul',
    notes: 'Berjalan paralel di 2 arena (Arena 1 Lapangan Basket untuk SD/MI; Arena 2 Pelataran Embung untuk SMP/MTs). Setiap peleton dialokasikan waktu total 15 menit (orientasi bersih sesuai durasi lomba + 5 menit transisi).',
    slots: [
      { time: '06.30 – 07.00', arena1: 'Presensi & Kedatangan Kontingen', arena2: 'Presensi & Kedatangan Kontingen' },
      { time: '07.00 – 07.15', arena1: 'Peleton Urutan 1 SD/MI', arena2: 'Peleton Urutan 1 SMP/MTs' },
      { time: '07.15 – 07.30', arena1: 'Peleton Urutan 2 SD/MI', arena2: 'Peleton Urutan 2 SMP/MTs' },
      { time: '07.30 – 07.45', arena1: 'Peleton Urutan 3 SD/MI', arena2: 'Peleton Urutan 3 SMP/MTs' },
      { time: '07.45 – 08.00', arena1: 'Peleton Urutan 4 SD/MI', arena2: 'Peleton Urutan 4 SMP/MTs' },
      { time: '08.00 – 08.15', arena1: 'Peleton Urutan 5 SD/MI', arena2: 'Peleton Urutan 5 SMP/MTs' },
      { time: '08.15 – 08.30', arena1: 'Peleton Urutan 6 SD/MI', arena2: 'Peleton Urutan 6 SMP/MTs' },
      { time: '08.30 – 08.45', arena1: 'Peleton Urutan 7 SD/MI', arena2: 'Peleton Urutan 7 SMP/MTs' },
      { time: '08.45 – 09.00', arena1: 'Peleton Urutan 8 SD/MI', arena2: 'Peleton Urutan 8 SMP/MTs' },
      { time: '09.00 – 09.15', arena1: 'Peleton Urutan 9 SD/MI', arena2: 'Peleton Urutan 9 SMP/MTs' },
      { time: '09.15 – 09.30', arena1: 'Peleton Urutan 10 SD/MI', arena2: 'Peleton Urutan 10 SMP/MTs' },
      { time: '09.30 – 09.45', arena1: 'Peleton Urutan 11 SD/MI', arena2: 'Peleton Urutan 11 SMP/MTs' },
      { time: '09.45 – 10.00', arena1: 'Peleton Urutan 12 SD/MI', arena2: 'Peleton Urutan 12 SMP/MTs' },
      { time: '10.00 – 10.15', arena1: 'Peleton Urutan 13 SD/MI', arena2: 'Peleton Urutan 13 SMP/MTs' },
      { time: '10.15 – 10.30', arena1: 'Peleton Urutan 14 SD/MI', arena2: 'Peleton Urutan 14 SMP/MTs' },
      { time: '10.30 – 10.45', arena1: 'Peleton Urutan 15 SD/MI', arena2: 'Peleton Urutan 15 SMP/MTs' },
      { time: '10.45 – 11.00', arena1: 'Peleton Urutan 16 SD/MI', arena2: 'Peleton Urutan 16 SMP/MTs' },
      { time: '11.00 – 11.15', arena1: 'Peleton Urutan 17 SD/MI', arena2: 'Peleton Urutan 17 SMP/MTs' },
      { time: '11.15 – 11.30', arena1: 'Peleton Urutan 18 SD/MI', arena2: 'Peleton Urutan 18 SMP/MTs' },
      { time: '11.30 – 12.00', arena1: 'Evaluasi & Pengosongan Venue', arena2: 'Evaluasi & Pengosongan Venue' }
    ]
  },
  competition: {
    title: 'Rundown Hari-H Perlombaan',
    date: 'Ahad, 24 Januari 2027',
    venue: 'Kampus Terpadu Madrasah Mu’allimin Sedayu, Bantul',
    items: [
      { time: '06.00 – 06.45', duration: "45'", agenda: 'Kedatangan Peleton, Check-In & Penempatan Basecamp', desc: 'Official menyerahkan kartu identitas (KTP/SIM) sebagai jaminan basecamp, menerima Nomor Dada Peleton resmi, 3 ID Card (1 Official & 2 Pendukung), 1 dus air mineral, dan 2 trash bag terpilah. Pengawalan LO ke ruang basecamp. (Registrasi ditutup tepat 09.00 WIB).', location: 'Meja Registrasi (Gd. Madrasah Lt. 1) & Basecamp' },
      { time: '06.45 – 07.00', duration: "15'", agenda: 'Sterilisasi Arena, Penyambutan Juri & Penyiapan Upacara', desc: 'Seluruh arena ditutup dari aktivitas umum. Barisan Upacara disiapkan di Lapangan Mini Soccer. Peleton Wajib Upacara: Urutan tampil 6 s.d. 10 (SD-131 s.d. SD-139 dan SMP-242 s.d. SMP-260). Penyambutan Dewan Juri di Ruang VIP.', location: 'Lapangan Mini Soccer & Ruang VIP' },
      { time: '07.00 – 07.45', duration: "45'", agenda: 'Upacara Pembukaan Resmi LBB Mu\'allimin 2027', desc: 'Upacara resmi pembukaan dipimpin Direktur Madrasah Mu\'allimin. Laporan ketua panitia, prosesi simbolis pembukaan, dan doa.', location: 'Lapangan Mini Soccer' },
      { time: '07.45 – 08.00', duration: "15'", agenda: 'Jeda Kesiapan Peserta, Mobilisasi Pos Juri & Pemanggilan DP 1', desc: 'Transisi peleton awal. Dewan Juri menempati meja penilaian di Arena 1 & 2. Peleton urutan 1 (SD-111 & SMP-222) dipanggil resmi ke DP 1 pukul 07.45 WIB.', location: 'Pos DP 1 & Meja Dewan Juri' },
      { time: '08.00 – 11.30', duration: "210'", agenda: 'Pelaksanaan Lomba Sesi I (Pagi) (Urutan Tampil 1 s.d. 14)', desc: 'Dilaksanakan secara simultan/paralel: • Arena 1 (Basket): SD-111 s.d. SD-157 (14 Peleton) • Arena 2 (Embung): SMP-222 s.d. SMP-268 (14 Peleton). Estimasi rolling release e-nilai ±1 jam setelah tampil.', location: '• Arena 1 (Lap. Basket) • Arena 2 (Pelataran Embung)' },
      { time: '11.30 – 12.30', duration: "60'", agenda: 'ISHOMA (Istirahat, Salat Dhuhur Berjamaah, & Makan Siang)', desc: 'Penghentian sementara seluruh aktivitas arena lomba. Salat Dhuhur berjamaah di Masjid Kampus Terpadu.', location: 'Masjid Kampus Terpadu Sedayu & 1918 Foodcourt' },
      { time: '12.30 – 13.30', duration: "60'", agenda: 'Pelaksanaan Lomba Sesi II (Siang) (Urutan Tampil 15 s.d. 18)', desc: 'Lanjutan penampilan 4 peleton terakhir: • Arena 1 (Basket): SD-159 s.d. SD-175 (4 Peleton) • Arena 2 (Embung): SMP-280 s.d. SMP-286 (4 Peleton). Seluruh penampilan tuntas pukul 13.30 WIB.', location: '• Arena 1 (Lap. Basket) • Arena 2 (Pelataran Embung)' },
      { time: '13.30 – 15.00', duration: "90'", agenda: 'Sidang Pleno Dewan Juri, Masa Sanggah & Checkout Basecamp', desc: '• Sidang Pleno: Rekapitulasi final, pengesahan nilai murni, pemotongan penalti, dan penandatanganan SK Juara Umum/Peleton oleh Dewan Juri. • Masa Sanggah Administrasi: Ditutup tepat pukul 15.00 WIB. • Checkout Basecamp: Pembersihan kelas, penyerahan 2 trash bag sampah ke pos checkout, inspeksi LO, dan penukaran kartu identitas jaminan KTP/SIM.', location: '• Ruang VIP Pleno Juri • Ruang Informasi Sanggah • Ruang Kelas Basecamp' },
      { time: '15.00 – 15.45', duration: "45'", agenda: 'Istirahat Sore, Salat Ashar Berjamaah & Pembagian Kudapan', desc: 'Pelaksanaan salat Ashar berjamaah di Masjid Kampus Terpadu.', location: 'Masjid Kampus Terpadu & 1918 Foodcourt' },
      { time: '15.45 – 16.00', duration: "15'", agenda: 'Standby & Pengecekan Barisan Apel Penutupan', desc: 'Seluruh perwakilan kontingen (1 Danton + 4 Anggota berseragam lengkap) wajib telah berbaris rapi di Lapangan Mini Soccer. Pengecekan kehadiran oleh protokol panitia.', location: 'Lapangan Mini Soccer' },
      { time: '16.00 – 16.30', duration: "30'", agenda: 'Upacara / Apel Penutupan Resmi', desc: 'Upacara penutupan resmi dipimpin Pimpinan Madrasah Mu\'allimin Muhammadiyah Yogyakarta dan amanat penutup.', location: 'Lapangan Mini Soccer' },
      { time: '16.30 – 17.15', duration: "45'", agenda: 'Pengumuman Kejuaraan & Penganugerahan Hadiah', desc: 'Pembacaan SK Kejuaraan oleh Koordinator Juri. Penyerahan Piala Bergilir Juara Umum SD & SMP, Trophy Tetap, Piagam Penghargaan, dan Uang Pembinaan secara simbolis.', location: 'Panggung Kehormatan Lapangan Mini Soccer' },
      { time: '17.15 – Selesai', duration: "-", agenda: 'Pembubaran Kontingen & Kepulangan Peserta', desc: 'Pelepasan kepulangan armada peleton secara tertib meninggalkan kawasan kampus melalui koordinasi petugas keamanan dan parkir.', location: 'Gerbang Utama Kampus Terpadu Sedayu' }
    ]
  }
};
