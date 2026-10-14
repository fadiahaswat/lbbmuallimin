/**
 * src/data/juknisDocsData.js
 * Dokumen Resmi Terpisah: 
 * 1. PETUNJUK TEKNIS PENILAIAN & KEJUARAAN (Bab A s.d. D Verbatim)
 * 2. PETUNJUK TEKNIS PENDAFTARAN (Bab A s.d. B Verbatim)
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
        content: `Penilaian dilakukan secara objektif oleh 6 Dewan Juri (unsur TNI, POLRI, dan PPI: 3 Juri Arena 1 SD & 3 Juri Arena 2 SMP). Keputusan Dewan Juri mengenai mutu gerak bersifat mutlak dan tidak dapat diganggu gugat.`
      },
      {
        number: 2,
        title: 'Kriteria Penilaian',
        content: `Kriteria penilaian meliputi:`,
        subItems: [
          `Penilaian Peleton: Perbandingan penilaian peleton adalah 1:1, yaitu Kebenaran Teknik (1) dan Kekompakan (1). Masing-masing aspek memiliki rentang nilai 50 s.d. 90 poin.`,
          `Nilai Murni Peleton = Total Nilai Kebenaran Teknik + Total Nilai Kekompakan.`,
          `Nilai Akhir Peleton = (Nilai Murni Peleton) – (Total Akumulasi Poin Penalti Peleton).`,
          `Nilai Murni Komandan = (Penguasaan Materi × 35%) + (Kualitas Suara/Vokal × 25%) + (Sikap dan Pelaporan × 20%) + (Penguasaan Lapangan × 20%).`,
          `Nilai Akhir Komandan = (Nilai Murni Komandan) – (Total Akumulasi Poin Penalti Komandan).`
        ]
      },
      {
        number: 3,
        title: 'Kriteria Penentuan Juara Peleton',
        content: `Penentuan Juara Peleton didasarkan pada Nilai Akhir Peleton dengan perolehan skor tertinggi. Apabila terdapat kesamaan Nilai Akhir Peleton, penentuan peringkat kejuaraan dilakukan berdasarkan urutan prioritas sebagai berikut:`,
        subItems: [
          `a. Nilai tertinggi pada aspek Kebenaran Teknik;`,
          `b. Nilai tertinggi pada aspek Kekompakan;`,
          `c. Akumulasi poin penalti paling sedikit; dan`,
          `d. Hasil musyawarah serta pertimbangan Dewan Juri dalam Sidang Pleno Juri yang keputusannya bersifat final dan mengikat.`
        ]
      },
      {
        number: 4,
        title: 'Kriteria Penentuan Juara Komandan',
        content: `Penentuan Juara Komandan Peleton didasarkan pada Nilai Akhir Komandan dengan perolehan skor tertinggi dari seluruh aspek penilaian. Apabila terdapat kesamaan Nilai Akhir Komandan, penentuan peringkat kejuaraan dilakukan berdasarkan urutan prioritas sebagai berikut:`,
        subItems: [
          `a. Nilai tertinggi pada aspek Penguasaan Materi Lomba;`,
          `b. Nilai tertinggi pada aspek Kualitas Suara/Vokal;`,
          `c. Nilai tertinggi pada aspek Sikap & Pelaporan; dan`,
          `d. Hasil musyawarah dan pertimbangan Dewan Juri dalam Sidang Pleno Juri yang keputusannya bersifat final serta mengikat.`
        ]
      },
      {
        number: 5,
        title: 'Sistem Perolehan Poin Juara Umum',
        content: `Juara Umum ditetapkan secara terpisah untuk masing-masing tingkatan, yaitu SD/MI dan SMP/MTs. Penetapan Juara Umum didasarkan pada akumulasi prestasi seluruh perwakilan yang berasal dari sekolah yang sama, meliputi capaian Juara Peleton dan Juara Komandan. Poin kejuaraan diberikan dengan ketentuan sebagai berikut:`,
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
        extraText: `Seluruh poin yang diperoleh oleh peleton dan komandan dari sekolah yang sama dijumlahkan sebagai akumulasi poin sekolah. Sekolah dengan total poin tertinggi ditetapkan sebagai Juara Umum pada tingkatannya.`
      },
      {
        number: 6,
        title: 'Definisi Nilai Murni Peleton/Komandan',
        content: `Nilai Murni Peleton/Komandan adalah nilai yang diperoleh Peleton/Komandan berdasarkan hasil penilaian Dewan Juri sebelum dikurangi seluruh penalti atau pengurangan nilai yang dikenakan berdasarkan ketentuan Juknis Lapangan.`
      },
      {
        number: 7,
        title: 'Tie-Breaker Juara Umum',
        content: `Apabila terdapat dua atau lebih sekolah yang memperoleh total poin Juara Umum yang sama, penentuan peringkat dilakukan berdasarkan urutan prioritas sebagai berikut:`,
        subItems: [
          `a. Peringkat Tertinggi Peleton: Dibandingkan berdasarkan peringkat tertinggi yang berhasil diraih oleh peleton masing-masing sekolah. Peringkat yang lebih tinggi memiliki prioritas lebih besar. Contoh, Juara 1 Peleton lebih diprioritaskan daripada Juara 2 Peleton.`,
          `b. Nilai Murni Peleton: Apabila peringkat tertinggi Peleton yang diraih masih sama, penentuan dilanjutkan berdasarkan nilai murni tertinggi dari peleton yang memiliki peringkat tertinggi tersebut.`,
          `c. Nilai Kebenaran Teknik Gerakan PBB: Apabila nilai murni Peleton masih sama, penentuan dilanjutkan berdasarkan nilai murni tertinggi pada aspek Kebenaran Teknik Gerakan PBB dari peleton yang dibandingkan.`,
          `d. Capaian Peleton Berikutnya: Apabila seluruh kriteria pada peleton dengan peringkat tertinggi masih sama, perbandingan dilanjutkan pada capaian peleton berikutnya secara berurutan berdasarkan peringkat yang diraih.`,
          `e. Capaian Komandan Terbaik: Apabila seluruh capaian Peleton masih menghasilkan nilai yang sama, penentuan dilanjutkan berdasarkan peringkat Komandan Terbaik yang diraih oleh masing-masing sekolah.`,
          `f. Sidang Pleno Juri: Apabila seluruh kriteria tersebut masih menghasilkan kedudukan yang sama, penentuan akhir dilakukan melalui musyawarah Dewan Juri dalam Sidang Pleno Juri.`,
          `g. Keputusan Akhir: Keputusan Dewan Juri dalam Sidang Pleno Juri bersifat mutlak dan tidak dapat diganggu gugat.`
        ]
      },
      {
        number: 8,
        title: 'Transparansi Nilai (Akses e-Rekapitulasi Berbasis Akun Gmail Peleton)',
        content: `Sebagai wujud integritas dan transparansi modern, publikasi rekapitulasi nilai peleton menerapkan sistem rilis bertahap (rolling release) tanpa harus menunggu seluruh peserta selesai tampil. Rincian perolehan nilai masing-masing peleton akan dirilis dan dapat diakses pada portal resmi https://lbb.tontimuallimin.com dengan estimasi waktu ±1 (satu) jam setelah peleton yang bersangkutan menyelesaikan penampilan di arena perlombaan. Official peleton dapat melihat lembar rekapitulasi nilai lengkap secara privat dan mandiri dengan login menggunakan akun Gmail masing-masing yang telah didaftarkan saat registrasi.`
      },
      {
        number: 9,
        title: 'Mekanisme Pengajuan Sanggah (Protes Resmi)',
        content: `Ketentuan resmi pengajuan sanggahan:`,
        subItems: [
          `a. Batasan Sanggah: Protes HANYA diterima untuk dugaan kekeliruan administratif non-penilaian (kesalahan penjumlahan skor, keliru input sistem dari lembar juri, atau ketidaksesuaian catatan penalti). Penilaian kualitatif juri mengenai mutu gerakan tidak dapat disanggah.`,
          `b. Batas Waktu Pengajuan: Pengajuan sanggah dapat dilakukan sejak nilai peleton dirilis di portal, dan seluruh masa sanggah resmi DITUTUP SERENTAK pukul 15.00 WIB. Penetapan hasil pasca-sanggah bersifat final dan mengikat sebelum Upacara Penutupan pukul 16.00 WIB.`,
          `c. Prosedur Sanggah: Diajukan secara TERTULIS menggunakan Formulir Sanggahan Resmi oleh 1 (satu) orang Official resmi terdaftar di Ruang Informasi Resmi Panitia (Ruang Registrasi Gedung Madrasah Lantai 1) dengan melampirkan bukti valid (video/foto/catatan). Panitia TIDAK melayani protes secara lisan.`,
          `d. Keputusan Sanggah: Jika protes diterima dan sah, Panitia menerbitkan 'Pemberitahuan Koreksi Hasil Resmi' yang menjadi dasar ketetapan kejuaraan.`
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
        title: 'Penerapan Prosedur Backup Manual',
        content: `Apabila terjadi gangguan pada sistem digital e-penilaian yang digunakan dalam LBB Mu’allimin 2027 (sistem input nilai juri, kalkulasi skor, portal rilis nilai, dan penyimpanan database), panitia menerapkan prosedur backup manual untuk menjamin kelancaran penilaian.`
      },
      {
        number: 2,
        title: 'Kesiapan Media Backup Manual',
        content: `Panitia menyiapkan prosedur dan media backup manual sebagai alternatif apabila sistem digital mengalami gangguan. Backup dapat mencakup data identitas peserta, rekapitulasi peserta, lembar penilaian, hasil perolehan nilai, serta data penting lainnya yang diperlukan dalam penyelenggaraan LBB Mu’allimin 2027.`
      },
      {
        number: 3,
        title: 'Pencatatan Manual Saat Gangguan',
        content: `Apabila terjadi gangguan pada sistem penilaian yang mengakibatkan nilai tidak tersimpan, tidak dapat diakses, atau berpotensi hilang, juri dan/atau asisten juri wajib melakukan pencatatan nilai secara manual menggunakan formulir atau media pencatatan yang telah disiapkan panitia. Hasil pencatatan tersebut menjadi dasar verifikasi dan pemulihan data setelah sistem kembali berfungsi normal.`
      },
      {
        number: 4,
        title: 'Verifikasi dan Pemulihan Data',
        content: `Setelah sistem digital kembali berfungsi normal, panitia melakukan verifikasi dan pemulihan data berdasarkan catatan manual, dokumen resmi, serta bukti pendukung yang dapat dipertanggungjawabkan. Data yang telah diverifikasi dimasukkan kembali ke dalam sistem oleh petugas yang berwenang. Apabila ditemukan perbedaan data, penyelesaiannya dilakukan berdasarkan dokumen dan catatan resmi yang menjadi bukti.`
      },
      {
        number: 5,
        title: 'Kewenangan Panitia dan Dasar Pemulihan',
        content: `Dalam hal terjadi gangguan sistem digital, panitia berwenang menetapkan langkah penanganan dan penggunaan prosedur backup berdasarkan kondisi yang terjadi serta bukti dan catatan resmi yang tersedia. Gangguan sistem digital tidak dapat dijadikan alasan untuk menghapus, mengubah, atau menetapkan data secara sepihak tanpa dasar yang dapat dipertanggungjawabkan. Setiap koreksi atau pemulihan data wajib melalui proses verifikasi oleh pihak yang berwenang.`
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
        content: 'Peleton dan Komandan Peleton wajib menyelesaikan materi lomba dalam durasi maksimal 8 menit untuk SD dan 12 menit untuk SMP. Kelebihan durasi dikenai penalti sebesar -50 poin untuk setiap rentang 1 s.d. 30 detik dan kelipatannya. Penalti diberlakukan terhadap nilai Peleton dan nilai Komandan Peleton.'
      },
      {
        number: 5,
        title: 'Pelanggaran Garis (Asas "Garis sebagai Garis")',
        content: 'Pelanggaran garis dibedakan berdasarkan pihak yang melakukan pelanggaran:',
        subItems: [
          'a. Anggota Peleton yang menginjak atau keluar dari garis arena dikenai penalti -50 poin untuk setiap kejadian terhadap nilai Peleton.',
          'b. Komandan Peleton yang menginjak atau keluar dari Kotak Danton berukuran 1,5 × 1,5 meter dikenai penalti -50 poin untuk setiap kejadian terhadap nilai Komandan Peleton.',
          'c. Pelanggaran yang dilakukan Komandan Peleton tidak mengurangi nilai Peleton.',
          'd. Pelanggaran yang dilakukan anggota Peleton mengurangi nilai Komandan Peleton.',
          'e. Setiap pelanggaran ditandai dengan bendera oleh Hakim Garis dan dicatat berdasarkan kategori penilaiannya.'
        ]
      },
      {
        number: 6,
        title: 'Gerakan Terlewat / Tidak Urut',
        content: 'Gerakan yang terlewat tetapi kemudian dilaksanakan di luar urutan diberikan nilai minimal (50) pada gerakan tersebut. Gerakan yang terlewat dan tidak dilaksanakan sama sekali diberikan nilai 0 (nol). Kesalahan gerakan terlewat/tidak urut diperhitungkan dalam penilaian Penguasaan Materi Komandan Peleton.'
      },
      {
        number: 7,
        title: 'Peleton Hafalan',
        content: 'Apabila Komandan Peleton memberikan aba-aba yang salah, tetapi Peleton tetap melaksanakan gerakan yang benar berdasarkan hafalan, maka: (a) Gerakan tersebut diberikan nilai 0 (nol) pada penilaian Kebenaran Teknik Peleton; (b) Kesalahan aba-aba diperhitungkan dalam penilaian Penguasaan Materi Komandan Peleton. Dengan demikian, kesalahan Komandan dan respons Peleton dinilai pada kategori masing-masing.'
      },
      {
        number: 8,
        title: 'Gerakan Berangkai Terputus',
        content: 'Rangkaian gerakan yang ditandai dengan tanda "-" wajib dilaksanakan secara berkesinambungan. Apabila rangkaian tersebut diselingi jeda atau gerakan tambahan yang tidak diperintahkan, maka: (a) Gerakan tersebut diberikan nilai minimal (50) pada penilaian Kebenaran Teknik Peleton; (b) Kesalahan gerakan berangkai terputus diperhitungkan dalam penilaian Penguasaan Materi Komandan Peleton. Dengan demikian, kesalahan Komandan dan respons Peleton dinilai pada kategori masing-masing.'
      },
      {
        number: 9,
        title: 'Pelanggaran Kebersihan Basecamp',
        content: 'Meninggalkan ruang basecamp dalam keadaan kotor atau berantakan dikenai penalti -50 poin pada rekapitulasi nilai akhir peleton sesuai ketentuan Pasal 14 Tata Tertib Peserta.'
      },
      {
        number: 10,
        title: 'Pelanggaran Kawasan Tanpa Rokok & Vape',
        content: 'Pelanggaran terang-terangan di ruang basecamp atau yang melibatkan personel kontingen berseragam setelah diberikan teguran dikenai penalti sebesar -50 poin terhadap nilai Peleton sesuai Pasal 9 Tata Tertib Peserta.'
      },
      {
        number: 11,
        title: 'Yel-Yel Selama Penampilan',
        content: 'Peserta, Official, atau pihak yang menjadi bagian dari tim dilarang meneriakkan yel-yel, memberikan aba-aba, atau memberikan bentuk dukungan suara yang dapat memengaruhi jalannya penampilan selama Peleton sedang tampil.',
        subItems: [
          'a. Pelanggaran pertama diberikan Peringatan Pertama oleh Panitia Lapangan.',
          'b. Pelanggaran kedua diberikan Peringatan Kedua oleh Panitia Lapangan.',
          'c. Pelanggaran ketiga dan setiap pelanggaran berikutnya dikenai penalti sebesar -50 poin terhadap nilai Peleton untuk setiap kejadian.',
          'd. Yel-yel atau bentuk dukungan suara yang dilakukan secara sengaja, berulang, atau dengan intensitas yang mengganggu jalannya penampilan dan dinilai sebagai pelanggaran berat dapat langsung dikenai penalti sebesar -50 poin tanpa melalui Peringatan Pertama dan Peringatan Kedua.',
          'e. Panitia berhak melakukan verifikasi identitas suporter melalui koordinasi dengan Official sekolah bersangkutan sebelum menjatuhkan sanksi pengurangan nilai.',
          'f. Peringatan dan penalti dicatat oleh Panitia Lapangan atau Asisten Juri pada lembar pengawasan dan disampaikan kepada Dewan Juri untuk dicatat dalam rekapitulasi nilai.'
        ]
      },
      {
        number: 12,
        title: 'Pencatatan Penalti',
        content: 'Setiap penalti dicatat oleh Asisten Juri pada lembar penilaian sesuai dengan kategori pelanggaran dan pihak yang dikenai penalti.'
      }
    ],
    closingNote: `Setiap penalti dicatat oleh Asisten Juri pada lembar penilaian sesuai dengan kategori pelanggaran dan pihak yang dikenai penalti.`
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
          `Pendaftaran administratif awal LBB Mu’allimin 2027 dilaksanakan secara daring melalui Portal Resmi Sistem Informasi LBB Mu’allimin pada laman https://lbb.tontimuallimin.com/ , dengan verifikasi dokumen fisik yang dilaksanakan pada saat Technical Meeting (TM).`,
          `Panitia tidak melayani pendaftaran manual secara luring/offline di tempat maupun pendaftaran susulan setelah kuota resmi terpenuhi.`,
          `Sistem pendaftaran menerapkan prinsip first-come, first-served, di mana tim yang menyelesaikan pengisian formulir, melengkapi berkas unggahan, dan memverifikasi setoran pembayaran terlebih dahulu yang berhak mengamankan slot kuota resmi.`
        ]
      },
      {
        number: 2,
        title: 'Alokasi Kuota Peserta',
        sub: [
          `Batas total kuota peserta adalah 36 Peleton se-Daerah Istimewa Yogyakarta, dengan alokasi berimbang: (1) Tingkat SD/MI Sederajat: Kuota 18 Peleton (Arena 1 - Lapangan Basket); (2) Tingkat SMP/MTs Sederajat: Kuota 18 Peleton (Arena 2 - Pelataran Embung).`,
          `Setiap sekolah/madrasah diperkenankan mengirimkan maksimal 2 (dua) peleton (dapat berupa peleton putra, peleton putri, maupun peleton campuran).`
        ]
      },
      {
        number: 3,
        title: 'Jadwal dan Lini Masa Pendaftaran',
        sub: [
          `Periode Pendaftaran Daring: Dibuka mulai 19 Oktober 2026 pukul 00.00 WIB s.d. 29 November 2026 pukul 23.59 WIB (pendaftaran otomatis ditutup lebih awal apabila kuota 36 peleton telah terpenuhi).`,
          `Technical Meeting & Verifikasi Dokumen Fisik: Sabtu, 9 Januari 2027 pukul 13.00 - 16.30 WIB di Aula Kampus Induk Madrasah Mu’allimin Wirobrajan.`,
          `Uji Coba Lapangan: Sabtu, 16 Januari 2027 pukul 07.00 – 13.00 WIB di Kampus Terpadu Sedayu.`,
          `Hari Pelaksanaan Lomba & Daftar Ulang: Ahad, 24 Januari 2027 mulai pukul 06.00 WIB di Kampus Terpadu Sedayu.`
        ]
      },
      {
        number: 4,
        title: 'Biaya Pendaftaran dan Tata Cara Pembayaran',
        sub: [
          `Biaya pendaftaran per peleton terbagi ke dalam 2 (dua) gelombang berjenjang (bersifat Non-Refundable / tidak dapat ditarik kembali apabila peleton mengundurkan diri): Gelombang 1 (19 Oktober – 8 November 2026): Rp 350.000,- / peleton; Gelombang 2 (9 November – 29 November 2026/Kuota Penuh): Rp 400.000,- / peleton; Gelombang 2 hanya dibuka jika sisa kuota masih ada. Keterangan: Setiap pembayaran wajib menggunakan kode unik 108 pada nominal transfer.`,
          `Pembayaran disetorkan via transfer perbankan ke rekening resmi panitia: Bank Tujuan: BSI (Bank Syariah Indonesia) | Nomor Rekening: 2600051817 | Atas Nama: Kepala Urusan Admisi, Humas, dan Kerja Sama | Format Berita Transfer Wajib: NAMA SEKOLAH_JUMLAH PELETON (Contoh: MTS MU’ALLIMIN YK_1).`,
          `Ketentuan Nominal Pembayaran: 1 (satu) peleton Gelombang 1: Rp350.108,-; 2 (dua) peleton Gelombang 1: Rp700.108,-; 1 (satu) peleton Gelombang 2: Rp400.108,-; 2 (dua) peleton Gelombang 2: Rp800.108,-.`,
          `Bukti transfer asli (struk ATM/teller atau tangkapan layar m-banking yang jelas) wajib diunggah pada formulir digital pendaftaran.`,
          `Setiap peleton terdaftar berhak mendapatkan fasilitas: ruang kelas basecamp, 1 (satu) dus Air Minum Kemasan (botol) per peleton saat registrasi ulang, 3 buah ID Card resmi (1 Official & 2 Pendukung Resmi), Nomor Dada Peleton, 2 kantong sampah terpilah, akses kantong parkir, dan E-Sertifikat resmi.`
        ]
      },
      {
        number: 5,
        title: 'Alur Prosedur Pendaftaran Digital (5 Langkah)',
        sub: [
          `Langkah 1 (Akses Formulir): Perwakilan sekolah/peleton membuka portal resmi https://lbb.tontimuallimin.com/ lalu meng-klik tombol "Daftar Peleton" untuk masuk ke formulir pendaftaran.`,
          `Langkah 2 (Data Sekolah & Akun Tim): Memilih jenjang perlombaan (SD/MI atau SMP/MTs), mendaftarkan email Google aktif (digunakan untuk login Dashboard Tim), mengisi biodata sekolah, mengunggah logo sekolah, dan memilih kategori peleton (Putra/Putri/Campuran).`,
          `Langkah 3 (Data Danton & Official): Meng-input identitas lengkap Komandan Peleton beserta unggahan scan Kartu Pelajar sah, serta mengisi identitas Official/Pelatih pendamping lengkap dengan nomor WhatsApp aktif dan unggahan scan KTP asli.`,
          `Langkah 4 (Pembayaran & Pakta Integritas): Mengunggah bukti transfer biaya pendaftaran yang valid dan membubuhkan tanda tangan digital pada kanvas Pakta Integritas Online.`,
          `Langkah 5 (Konfirmasi & Aktivasi Dashboard Tim): Tim menerima Kode Registrasi unik resmi. Panitia melakukan verifikasi dalam 1x24 jam. Setelah diverifikasi, tim dapat login ke Dashboard Peserta untuk melengkapi susunan identitas peleton.`
        ]
      },
      {
        number: 6,
        title: 'Dokumen Persyaratan yang Wajib Diunggah (Digital)',
        sub: [
          `Surat Tugas / Rekomendasi Resmi dari Kepala Sekolah/Madrasah asli bertanda tangan dan berstempel basah (format PDF/JPG, maks. 2 MB).`,
          `Bukti transfer biaya pendaftaran sesuai biaya pendaftaran gelombang berjalan (format JPG/PNG, maks. 2 MB).`,
          `Scan/Foto Kartu Pelajar sah Komandan Peleton (Danton) pangkalan bersangkutan (format Foto/PDF, maks. 3 MB).`,
          `Scan/Foto KTP asli Official atau Pelatih pendamping resmi peleton sekolah (format Foto/PDF, maks. 3 MB).`,
          `Logo peleton atau sekolah/madrasah beresolusi tinggi format PNG transparan.`,
          `Pasfoto resmi seluruh personel peleton ukuran 3x4 (latar belakang Merah untuk jenjang SD/MI dan latar belakang Biru untuk jenjang SMP/MTs) diunggah melalui menu Identitas Personel di portal peserta.`,
          `Data identitas seluruh personel peleton berupa Nama Lengkap sesuai ijazah terakhir atau dokumen resmi (digunakan untuk penerbitan sertifikat), NISN, Tempat dan Tanggal Lahir, serta Kelas. Data diisi melalui portal peserta sesuai format yang telah disediakan.`
        ]
      },
      {
        number: 7,
        title: 'Regulasi Komposisi Personel Peleton',
        sub: [
          `Komposisi resmi peleton berjumlah maksimal 25 personel, terdiri atas: 1 Komandan Peleton (Danton), 21 Anggota Inti (3 saf x 7 banjar), dan 3 Orang Cadangan.`,
          `Didampingi maksimal 3 orang pendamping peleton: 1 Official (Pelatih/Pembina) dan 2 Pendukung Resmi (Medis/Dokumentasi) yang akan mengenakan ID Card resmi panitia.`,
          `Batas minimal personel tampil di arena adalah 22 orang (1 Danton + 21 Anggota Inti). Penggantian pemain inti dengan cadangan hanya diperkenankan saat transisi resmi yang diatur dalam materi juknis.`
        ]
      },
      {
        number: 8,
        title: 'Kewajiban Penyerahan Berkas Fisik Asli saat Technical Meeting',
        sub: [
          `Meskipun proses pendaftaran awal diselenggarakan secara digital, delegasi resmi sekolah/madrasah (maksimal 2 orang perwakilan per SEKOLAH/MADRASAH, baik yang mengirimkan 1 maupun 2 peleton) WAJIB membawa dan menyerahkan berkas fisik asli pada saat registrasi Technical Meeting (Sabtu, 9 Januari 2027 pukul 12.30 - 13.00 WIB di Aula Kampus Induk Mu’allimin Wirobrajan). Bagi sekolah yang mengirimkan 2 (dua) peleton, delegasi yang hadir berhak mewakili proses verifikasi kedua peleton tersebut sekaligus.`,
          `Berkas fisik asli yang diserahkan meliputi: (1) Surat Tugas / Rekomendasi Kepala Sekolah asli berstempel basah yang memuat daftar nama lengkap seluruh peleton (1 Danton, 21 Inti, 3 Cadangan, 1 Official, 2 Pendukung Resmi); (2) Pakta Integritas fisik bermaterai Rp 10.000 yang telah ditandatangani basah oleh Official bersangkutan.`
        ]
      },
      {
        number: 9,
        title: 'Ketentuan Diskualifikasi & Sanksi Administrasi',
        sub: [
          `Diskualifikasi Mutlak: Diberikan kepada peleton yang memanipulasi data identitas siswa, memalsukan stempel/tanda tangan surat rekomendasi kepala sekolah, atau menyertakan siswa dari luar pangkalan sekolah yang bersangkutan.`,
          `Ketentuan Pembatalan (Non-Refundable): Uang pendaftaran yang telah dibayarkan tidak dapat ditarik kembali apabila peleton membatalkan keikutsertaan secara sepihak.`,
          `Pergantian Personel: Perubahan data personel, termasuk nama, susunan, posisi, foto, maupun pergantian individu, diperbolehkan sampai dengan sebelum pelaksanaan Technical Meeting (TM). Setiap perubahan wajib dilaporkan dan disesuaikan dengan Surat Tugas/Rekomendasi resmi dari Kepala Sekolah/Madrasah. Perubahan yang tidak tercantum atau tidak sesuai dengan Surat Tugas/Rekomendasi resmi dinyatakan tidak sah.`
        ]
      },
      {
        number: 10,
        title: 'Pusat Layanan dan Narahubung Resmi',
        sub: [
          `Website Portal Pendaftaran: https://lbb.tontimuallimin.com/`,
          `WhatsApp Helpdesk Resmi: https://wa.me/6281947491505 (Admin: 0819-4749-1505)`,
          `Email Resmi: lbb@tontimuallimin.com`,
          `Instagram Resmi: @lbbmuin | @mualliminjogja | TikTok: @tontimuallimin`
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
      { time: '07.00 – 07.45', duration: "45'", agenda: 'Upacara Pembukaan Resmi LBB Mu\'allimin 2027', desc: 'Upacara resmi pembukaan dipimpin Direktur Madrasah Mu\'allimin. Pembacaan Janji Wasit/Juri dan Janji Peserta, prosesi simbolis pembukaan, dan doa.', location: 'Lapangan Mini Soccer' },
      { time: '07.45 – 08.00', duration: "15'", agenda: 'Jeda Kesiapan Peserta, Mobilisasi Pos Juri & Pemanggilan DP 1', desc: 'Transisi peleton awal. Dewan Juri menempati meja penilaian di Arena 1 & 2. Peleton urutan 1 (SD-111 & SMP-222) dipanggil resmi ke DP 1 pukul 07.45 WIB.', location: 'Pos DP 1 & Meja Dewan Juri' },
      { time: '08.00 – 11.30', duration: "210'", agenda: 'Pelaksanaan Lomba Sesi I (Pagi) (Urutan Tampil 1 s.d. 14)', desc: 'Dilaksanakan secara simultan/paralel: Arena 1 (Basket): SD-111 s.d. SD-157 (14 Peleton); Arena 2 (Embung): SMP-222 s.d. SMP-268 (14 Peleton). Estimasi rolling release e-nilai ±1 jam setelah tampil.', location: 'Arena 1 (Lap. Basket) & Arena 2 (Pelataran Embung)' },
      { time: '11.30 – 12.30', duration: "60'", agenda: 'ISHOMA (Istirahat, Salat Dhuhur Berjamaah, & Makan Siang)', desc: 'Penghentian sementara seluruh aktivitas arena lomba. Salat Dhuhur berjamaah di Masjid Kampus Terpadu. Jamuan makan siang juri, panitia, dan peserta di 1918 Foodcourt.', location: 'Masjid Kampus Terpadu Sedayu & 1918 Foodcourt' },
      { time: '12.30 – 13.30', duration: "60'", agenda: 'Pelaksanaan Lomba Sesi II (Siang) (Urutan Tampil 15 s.d. 18)', desc: 'Lanjutan penampilan 4 peleton terakhir: Arena 1 (Basket): SD-159 s.d. SD-175 (4 Peleton); Arena 2 (Embung): SMP-280 s.d. SMP-286 (4 Peleton). Seluruh penampilan tuntas pukul 13.30 WIB.', location: 'Arena 1 (Lap. Basket) & Arena 2 (Pelataran Embung)' },
      { time: '13.30 – 15.00', duration: "90'", agenda: 'Sidang Pleno Dewan Juri, Masa Sanggah & Checkout Basecamp', desc: 'Sidang Pleno: Rekapitulasi final, pengesahan nilai murni, pemotongan penalti, dan penandatanganan SK Juara Umum/Peleton oleh Dewan Juri. Masa Sanggah Administrasi: Ditutup tepat pukul 15.00 WIB. Checkout Basecamp: Pembersihan kelas, penyerahan 2 trash bag sampah ke pos checkout, inspeksi LO, dan penukaran kartu identitas jaminan KTP/SIM.', location: 'Ruang VIP Pleno Juri, Ruang Informasi Sanggah, & Basecamp' },
      { time: '15.00 – 15.45', duration: "45'", agenda: 'Istirahat Sore, Salat Ashar Berjamaah & Pembagian Kudapan', desc: 'Pelaksanaan salat Ashar berjamaah di Masjid Kampus Terpadu dan pembagian snack sore kontingen.', location: 'Masjid Kampus Terpadu & 1918 Foodcourt' },
      { time: '15.45 – 16.00', duration: "15'", agenda: 'Standby & Pengecekan Barisan Apel Penutupan', desc: 'Seluruh perwakilan kontingen (1 Danton + 4 Anggota berseragam lengkap) wajib telah berbaris rapi di Lapangan Mini Soccer. Pengecekan kehadiran oleh protokol panitia.', location: 'Lapangan Mini Soccer' },
      { time: '16.00 – 16.30', duration: "30'", agenda: 'Upacara / Apel Penutupan Resmi', desc: 'Upacara penutupan resmi dipimpin Pimpinan Madrasah Mu\'allimin Muhammadiyah Yogyakarta dan amanat penutup.', location: 'Lapangan Mini Soccer' },
      { time: '16.30 – 17.15', duration: "45'", agenda: 'Pengumuman Kejuaraan & Penganugerahan Hadiah', desc: 'Pembacaan SK Kejuaraan oleh Koordinator Juri. Penyerahan Piala Bergilir Juara Umum SD & SMP, Trophy Tetap, Piagam Penghargaan, dan Uang Pembinaan secara simbolis.', location: 'Panggung Kehormatan Lapangan Mini Soccer' },
      { time: '17.15 – Selesai', duration: "-", agenda: 'Pembubaran Kontingen & Kepulangan Peserta', desc: 'Pelepasan kepulangan armada peleton secara tertib meninggalkan kawasan kampus melalui koordinasi petugas keamanan dan parkir.', location: 'Gerbang Utama Kampus Terpadu Sedayu' }
    ]
  }
};
