import React from 'react';
import { Scale, ShieldCheck, Clock, MapPin, AlertTriangle, Trophy } from 'lucide-react';
import { EVENT, VENUE, VENUE_INDUK } from '../config.js';

export default function TataTertib() {
  const articles = [
    {
      pasal: 1,
      phase: 'Ketentuan Umum',
      title: 'Ketentuan Umum dan Asas Pelaksanaan',
      points: [
        "Lomba Baris - Berbaris Mu'allimin Tahun 2027 (selanjutnya disingkat LBB MU'ALLIMIN 2027) merupakan lomba baris-berbaris tingkat Daerah Istimewa Yogyakarta yang diselenggarakan oleh Madrasah Mu'allimin Muhammadiyah Yogyakarta.",
        "LBB MU'ALLIMIN 2027 dilaksanakan pada hari Ahad, 24 Januari 2027 di Kampus Terpadu Madrasah Mu'allimin Muhammadiyah Yogyakarta (Sedayu, Bantul).",
        "Peserta LBB MU'ALLIMIN 2027 merupakan siswa SD/MI sederajat dan SMP/MTs sederajat dalam lingkup Daerah Istimewa Yogyakarta, sesuai yang tertera pada formulir pendaftaran.",
        "Tata Tertib ini merupakan pedoman resmi yang mengatur seluruh ketentuan non-lomba, etika lingkungan madrasah/pesantren, pemanfaatan basecamp, prosedur Check-In & Checkout, kebersihan, suporter, serta penegakan sportivitas dan integritas. Adapun petunjuk teknis gerakan PBB (berpedoman pada Peraturan Panglima TNI Nomor 58 dan 57 Tahun 2018, serta khusus pelaksanaan Hormat Kanan/Kiri berpedoman pada Peraturan Panglima TNI Nomor 45 Tahun 2014), arena lomba, dan sistem penjurian diatur secara tersendiri dalam Petunjuk Teknis (Juknis) Lapangan.",
        "Ketentuan seragam resmi peserta lomba:\na. Ketentuan Umum: Peserta diperbolehkan mengenakan seragam tonti/paskibra sekolah, seragam nasional, seragam OSIS, atau seragam lain yang telah disepakati secara internal oleh masing-masing sekolah, dengan ketentuan tetap rapi, sopan, seragam, dan sesuai dengan karakter sekolah.\nb. Keseragaman Peleton: Seluruh personel dalam satu peleton wajib mengenakan seragam yang sama dan dilengkapi atribut yang sesuai dengan ketentuan internal sekolah.\nc. Atribut Komandan: Komandan Peleton wajib menggunakan atribut atau tanda pembeda yang jelas dari personel peleton lainnya sehingga mudah dikenali selama perlombaan. Bentuk dan jenis atribut disesuaikan dengan ketentuan internal masing-masing sekolah.\nd. Ketentuan Peserta Putri: Peserta putri yang mengenakan rok wajib menggunakan legging di dalam rok selama mengikuti perlombaan.",
        "Setiap peleton didampingi oleh maksimal 1 (satu) orang Official (Pelatih/Pembina) dan 2 (dua) orang Pendukung Resmi (masing-masing dapat berfungsi sebagai Medis dan Dokumentasi), serta seluruh anggota cadangan resmi yang telah terdaftar."
      ]
    },
    {
      pasal: 2,
      phase: 'Tahap I: Pra-Lomba',
      title: 'Tahap I: Pra-Lomba – Pendaftaran Resmi dan Registrasi Administrasi',
      points: [
        "Pendaftaran resmi dilakukan secara online melalui website resmi: https://lbb.tontimuallimin.com sesuai dengan batas periode waktu yang telah ditentukan oleh panitia.",
        "Seluruh proses pendaftaran bersifat paperless (unggah digital), kecuali berkas fisik asli yang wajib dibawa dan diserahkan langsung saat forum Technical Meeting (TM) Peserta.",
        "Berkas fisik asli yang wajib diserahkan dan diverifikasi saat TM Peserta mencakup:\na. Surat Tugas / Rekomendasi Resmi Kepala Sekolah asli berstempel basah yang memuat daftar nama lengkap seluruh personel peleton: 1 Komandan Peleton (Danton), 21 Anggota Inti, 3 Anggota Cadangan, 1 Official (Pelatih/Pembina), dan 2 Pendukung Resmi (masing-masing dapat berfungsi sebagai Medis dan Dokumentasi).\nb. Pakta Integritas yang telah ditandatangani bermaterai Rp 10.000 oleh Official resmi sekolah."
      ]
    },
    {
      pasal: 3,
      phase: 'Tahap I: Pra-Lomba',
      title: 'Tahap I: Pra-Lomba – Teknis Technical Meeting (TM) Peserta',
      points: [
        "Waktu dan Tempat: Technical Meeting (TM) Peserta dilaksanakan pada hari Sabtu, 9 Januari 2027 pukul 13.00 - 16.30 WIB bertempat di Kampus Induk Madrasah Mu'allimin Muhammadiyah Yogyakarta (Jl. Letjen S. Parman No. 68, Wirobrajan, Kota Yogyakarta).",
        "Kehadiran Delegasi: Setiap peleton wajib diwakili oleh maksimal 2 (dua) orang perwakilan resmi (Official/Pembina atau Komandan Peleton). Perwakilan wajib mengenakan pakaian rapi, sopan, dan bersepatu.",
        "Verifikasi Berkas Fisik Asli (12.30 - 13.00 WIB): Sebelum forum dimulai, perwakilan peleton melakukan presensi kehadiran dan menyerahkan berkas fisik asli di meja registrasi TM panitia.",
        "Agenda Technical Meeting: Agenda TM meliputi pemaparan regulasi teknis oleh Panitia dan Dewan Juri, sesi tanya jawab/klarifikasi, pengundian resmi terbuka (lotting) nomor urut tampil peleton (Tingkat SD/MI SD-111 s.d. SD-175 dan Tingkat SMP/MTs SMP-222 s.d. SMP-286), penandatanganan Berita Acara TM, serta pembagian jadwal resmi slot uji coba lapangan.",
        "Hasil technical meeting wajib dipatuhi dan dilaksanakan selama perlombaan berlangsung. Pada hari pelaksanaan perlombaan, panitia tidak menerima protes tentang ketentuan-ketentuan yang sudah disepakati pada saat technical meeting, baik yang berupa ketentuan tertulis maupun yang tidak tertulis."
      ]
    },
    {
      pasal: 4,
      phase: 'Tahap I: Pra-Lomba',
      title: 'Tahap I: Pra-Lomba – Teknis Uji Coba Lapangan',
      points: [
        "Waktu dan Tempat: Uji Coba Lapangan (Familiarisasi Medan Perlombaan) dilaksanakan pada hari Sabtu, 16 Januari 2027 pukul 07.00 – 13.00 WIB di Kampus Terpadu Madrasah Mu'allimin Muhammadiyah Yogyakarta (Sedayu, Bantul).",
        "Pelaksanaan Paralel di Dua Arena: Uji coba dilaksanakan secara bersamaan di 2 arena resmi:\na. Arena 1 (Lapangan Basket Kampus Terpadu Sedayu): Khusus untuk 18 Peleton Tingkat SD/MI (ukuran 25 m x 14 m).\nb. Arena 2 (Pelataran Embung Kampus Terpadu Sedayu): Khusus untuk 18 Peleton Tingkat SMP/MTs (ukuran 26 m x 15 m).",
        "Alokasi Waktu Resmi Peleton: Setiap peleton memperoleh durasi latihan sesuai waktu lomba, yaitu 10 menit untuk SD dan 13 menit untuk SMP, ditambah 5 menit waktu transisi yang dipandu oleh petugas timekeeper dan LO pendamping. Mohon perhatikan rundown resmi dari panitia, dan setiap peleton wajib bersiap di lokasi 15 menit sebelum gilirannya tiba.",
        "Fokus dan Sasaran Uji Coba: Uji coba lapangan difokuskan murni untuk familiarisasi medan perlombaan bagi peserta (penyesuaian hentakan langkah terhadap tekstur lantai arena serta simulasi alur masuk/keluar arena). Uji coba dilaksanakan tanpa ada penilaian dewan juri.",
        "Ketentuan Perlengkapan Uji Coba: Peserta diperbolehkan mengenakan seragam olahraga/latihan sekolah yang seragam, rapi, dan bersepatu (DILARANG KERAS menggunakan sepatu berpines/paku)."
      ]
    },
    {
      pasal: 5,
      phase: 'Tahap II: Hari Perlombaan',
      title: 'Tahap II: Hari Perlombaan – Daftar Ulang, Check-In, dan Jaminan Identitas',
      points: [
        "Daftar ulang peserta pada hari-H perlombaan dilayani pukul 06.00 - 09.00 WIB di Ruang Registrasi Resmi Kampus Terpadu Sedayu.",
        "Daftar ulang lebih dari pukul 09.00 WIB tidak akan dilayani. Bagi peleton yang tidak melakukan daftar ulang dikenakan sanksi tidak dapat mengikuti perlombaan.",
        "Prosedur Check-In Peleton:\na. Official menyerahkan 1 (satu) kartu identitas resmi (KTP/SIM perwakilan sekolah) sebagai jaminan ketertiban serta kebersihan basecamp.\nb. Official menerima Nomor Dada Peleton resmi (wajib disematkan pada dada sebelah kiri personel banjar paling kanan saf kedua (Saf 2 Banjar 1 / S2B1).\nc. Setiap peleton akan menerima fasilitas resmi berupa: ruang kelas basecamp, 1 (satu) dus Air Minum Kemasan (botol) per peleton, 3 (tiga) buah ID Card resmi (1 untuk Official dan 2 untuk Pendukung Resmi), serta 2 (dua) kantong sampah terpilah (organik dan anorganik). Khusus bagi anggota cadangan tidak diberikan ID Card, namun wajib mengenakan seragam peleton lengkap sebagai tanda pengenal resmi.\nd. Peleton diarahkan dan dikawal oleh LO pendamping menuju ruang kelas basecamp resmi yang telah ditentukan.",
        "Pengembalian nomor dada dilakukan di pos/arena terakhir kepada petugas pos setelah peleton menyelesaikan seluruh rangkaian materi lomba."
      ]
    },
    {
      pasal: 6,
      phase: 'Tahap II: Hari Perlombaan',
      title: 'Tahap II: Hari Perlombaan – Upacara Pembukaan dan Sterilisasi Arena',
      points: [
        "Mulai pukul 06.45 WIB, Lapangan Mini Soccer resmi ditutup dan disterilkan dari seluruh aktivitas umum, penonton, maupun latihan mandiri, serta seluruh peserta upacara pembukaan wajib telah berada di lokasi barisan upacara. Upacara pembukaan dimulai tepat pukul 07.00 WIB. Lapangan hanya diperuntukkan bagi peserta dan petugas upacara pembukaan. Aktivitas peleton di luar rangkaian upacara baru diperbolehkan kembali setelah seluruh rangkaian upacara selesai. Perlombaan dimulai pukul 08.00 WIB.",
        "Upacara pembukaan resmi wajib diikuti oleh peserta dengan nomor urut lomba 1 sampai dengan 5 (SD-111, SD-113, SD-115, SD-117, SD-119 dan SMP-222, SMP-224, SMP-226, SMP-228, SMP-240) dengan formasi 1 komandan dan 15 anggota (5 trio lengkap) mengenakan seragam perlombaan.",
        "Pengecekan barisan upacara dilakukan oleh panitia 15 menit sebelum upacara dimulai. Peleton yang tidak hadir atau terlambat dikenakan sanksi penalti pengurangan nilai sesuai ketentuan Juknis Lapangan."
      ]
    },
    {
      pasal: 7,
      phase: 'Tahap III: Hari Perlombaan',
      title: 'Tahap III: Hari Perlombaan – Prosedur Daerah Persiapan (DP 1 & DP 2)',
      points: [
        "Kesiapan di Basecamp: Peleton bersama official sebaiknya sudah bersiap-siap di ruang basecamp sekurang-kurangnya 15 (lima belas) menit sebelum estimasi waktu nomor urutnya akan dipanggil oleh LO pendamping.",
        "Prosedur Pemanggilan Masuk DP 1: Peleton HANYA diperkenankan masuk ke Daerah Persiapan 1 (DP 1) setelah dipanggil secara resmi oleh panitia melalui pengeras suara (mic). Peleton DILARANG KERAS masuk ke DP 1 sebelum dipanggil.",
        "Sanksi Keterlambatan Hadir di DP 1: Peleton yang tidak hadir di DP 1 setelah 3 (tiga) kali pemanggilan resmi melalui pengeras suara (dengan jeda waktu/jarak antar panggilan selama 2 menit) dikenakan sanksi penalti pengurangan nilai sebesar 100 poin (-100 poin) dan urutan tampilnya digeser ke urutan tampil paling akhir. Apabila peleton tetap tidak hadir tanpa konfirmasi resmi, maka dikenakan sanksi DISKUALIFIKASI.",
        "Pemeriksaan di DP 1: Di DP 1 dilakukan verifikasi jumlah personel (1 Danton, 21 Inti, cadangan, 1 Official, 2 Pendukung Resmi), kartu ID card, nomor dada, dan pemeriksaan fisik sol sepatu (DILARANG KERAS sol berpines, paku payung, spikes, atau pul logam).",
        "Ruang Tunggu DP 2: Setelah lolos DP 1, peleton memasuki DP 2 yang difungsikan murni sebagai Holding Area yang tenang sebelum dipersilakan masuk ke arena perlombaan."
      ]
    },
    {
      pasal: 8,
      phase: 'Tahap III: Hari Perlombaan',
      title: 'Tahap III: Hari Perlombaan – Area Lomba, Penggunaan Basecamp, dan Zonasi Pesantren',
      points: [
        "Lokasi kegiatan dibagi menjadi beberapa area: Area Lomba (Arena 1 & 2), Area Basecamp (ruang kelas transit peleton), Daerah Persiapan (DP 1 Pengecekan Personel & DP 2 Ruang Tunggu), Area Penonton/Suporter, dan Area Steril/Privat Pesantren.",
        "Setiap 1 (satu) ruang kelas difungsikan sebagai basecamp bersama untuk 2 (dua) peleton dengan pembagian resmi yang ditetapkan oleh panitia. Akses masuk ke area ini dijaga ketat dan HANYA diperuntukkan bagi anggota peleton (inti maupun cadangan) yang mengenakan seragam lengkap, serta 1 Official dan 2 Pendukung Resmi yang mengenakan ID Card resmi.",
        "Penentuan pasangan peleton dalam satu ruangan diatur sepenuhnya oleh panitia berdasarkan urutan skala prioritas. Prioritas utama diberikan kepada sekolah yang mengirimkan 2 peleton untuk ditempatkan dalam satu ruang yang sama. Jika kuota tersebut telah terpenuhi, penempatan berikutnya akan mengelompokkan peleton homogen (putra dengan putra, atau putri dengan putri), dan opsi terakhir adalah penggabungan peleton secara heterogen atau campuran.",
        "Wali murid, suporter, maupun penonton DILARANG KERAS memasuki area basecamp / ruang kelas peserta demi menjaga ketertiban, keamanan barang bawaan, dan kenyamanan istirahat peserta lomba.",
        "Peserta dan pendamping DILARANG menggunakan aset/fasilitas ruang kelas (seperti LCD proyektor, papan tulis, perangkat guru, sound kelas) dan DILARANG memindahkan meja maupun kursi keluar dari dalam ruang kelas.",
        "Seluruh unsur peleton DILARANG KERAS memasuki area privat Kampus Terpadu Madrasah Mu'allimin Muhammadiyah Yogyakarta, khususnya kawasan ASRAMA SANTRI. Pelanggaran terhadap batas privasi ini akan dikenakan sanksi tegas oleh Panitia dan Keamanan.",
        "Penegasan Area Mat'ham: Gedung / Area Mat'ham disterilkan dan DILARANG digunakan untuk aktivitas LBB karena dipergunakan untuk perhelatan kejuaraan Mu'allimin Fighting Championship.",
        "Sentra Kuliner & Bazar Tenant: Halaman parkir tidak difungsikan sebagai bazar tenant; seluruh stand tenant kuliner dan pujasera dipusatkan secara eksklusif di 1918 Foodcourt & Mart.",
        "Ketentuan Parkir Kendaraan Peleton: Bus peleton hanya diperkenankan drop-off peserta/barang di dalam kampus terpadu dan wajib parkir di Lapangan Hibrida Argomulyo. Mobil dan motor diparkir di dalam kampus terpadu, dan apabila penuh dialihkan ke Lapangan Hibrida Argomulyo.",
        "Area Lomba bersifat steril (Clear Area) dan hanya dapat diakses oleh peleton yang sedang tampil didampingi 1 Official dan 2 Pendukung Resmi ber-ID Card di pinggir arena. Penonton dan suporter diwajibkan berada di Area Penonton yang telah disediakan."
      ]
    },
    {
      pasal: 9,
      phase: 'Tahap III: Hari Perlombaan',
      title: 'Tahap III: Hari Perlombaan – Etika Suporter, Ketertiban Ibadah, dan Integritas',
      points: [
        "Prinsip Sportivitas: Seluruh peserta, official, pendukung Resmi, dan keluarga besar peleton wajib menjunjung tinggi nilai-nilai sportivitas, kejujuran, saling menghormati, dan kebersamaan pelajar berkarakter.",
        "Ketertiban Suporter saat Tampil: Penonton dan suporter DILARANG membunyikan instrumen musik/alat tabuh, terompet, peluit, megafon/toa, maupun meneriakkan yel-yel saat ada peleton yang sedang tampil di arena perlombaan agar tidak mengganggu konsentrasi komandan, peleton, dan dewan juri.",
        "Larangan Tepukan dan Sorakan Sinis: Tepukan tangan dan yel-yel suporter hanya diizinkan saat jeda pergantian peleton atau sebelum/setelah peleton tampil di arena lomba. DILARANG KERAS melakukan tepukan, teriakan, atau sorakan sinis (mencemooh, mengejek, atau menertawakan) saat melihat peleton lain melakukan kesalahan aba-aba atau gerakan di arena lomba. Pelanggaran terhadap adab suporter ini akan diberi peringatan tegas oleh Divisi Keamanan, dan jika diabaikan dapat berakibat pada sanksi penalti pengurangan nilai bagi peleton yang didukung.",
        "Ketertiban Ibadah Salat: Mengingat Kampus Terpadu Madrasah Mu'allimin merupakan lingkungan Pondok Pesantren, seluruh peserta, official, pendukung resmi, dan penonton diwajibkan menjaga ketenangan, menghentikan aktivitas kegaduhan/yel-yel saat adzan berkumandang dan masuk waktu salat, serta bagi yang beragama Islam dipersilakan menunaikan salat berjamaah di Masjid Kampus Terpadu.",
        "Larangan Ujaran Kebencian, Hoaks, dan Fitnah:\nPeserta, Official, maupun suporter DILARANG KERAS menyebarkan hoaks, fitnah, ujaran kebencian, kata-kata kotor/tidak pantas, serta penghinaan bernuansa SARA, baik secara lisan, tulisan, maupun melalui media sosial, yang ditujukan secara langsung maupun tidak langsung kepada Panitia, Dewan Juri, maupun sesama peserta.\na. Setiap laporan wajib disertai bukti dan diverifikasi oleh Panitia.\nb. Pihak yang diduga melanggar diberikan kesempatan untuk memberikan klarifikasi.\nc. Sanksi hanya diberikan kepada pihak yang terbukti melakukan pelanggaran. Pelanggaran individu tidak otomatis menjadi pelanggaran peleton atau sekolah.\nd. Pelanggaran terbukti dapat dikenai DISKUALIFIKASI, pelaporan kepada pihak sekolah, dan/atau PEMBLOKIRAN (BLACKLIST) berdasarkan keputusan Panitia.\ne. BLACKLIST terhadap peleton atau sekolah hanya dapat diberlakukan apabila terbukti pelanggaran dilakukan secara terorganisasi, mengatasnamakan, atau melibatkan pihak sekolah/peleton.",
        "Larangan Modifikasi Sol Sepatu: DILARANG KERAS menempelkan atau memasang pines, paku payung, paku besi, spikes, pul logam, atau benda tajam/keras lainnya pada alas kaki/sol sepatu yang berpotensi merusak permukaan lantai arena dan membahayakan peserta. Pemeriksaan sepatu dilakukan secara ketat di DP 1.",
        "Larangan Senjata & Tindakan Kekerasan: Peserta dan seluruh unsur pendukungnya DILARANG membawa senjata tajam, senjata api, bahan peledak, rokok, miras, maupun obat-obatan terlarang, serta DILARANG terlibat dalam segala bentuk kekerasan fisik atau perkelahian. Pelanggaran dikenakan sanksi DISKUALIFIKASI dan diserahkan kepada pihak berwajib."
      ]
    },
    {
      pasal: 10,
      phase: 'Kesehatan & Keamanan',
      title: 'Kesehatan dan Penanganan Medis Lapangan',
      points: [
        "Seluruh peserta yang mengikuti lomba diharapkan berada dalam kondisi sehat jasmani dan rohani serta mampu mengikuti seluruh rangkaian perlombaan.",
        "Peserta dan Official wajib menyampaikan informasi mengenai kondisi kesehatan penting atau riwayat medis peserta yang dapat memengaruhi keselamatan selama perlombaan kepada Panitia sebelum lomba berlangsung.",
        "Panitia menyediakan Pos Pertolongan Pertama pada Kecelakaan (P3K) dan tim medis untuk penanganan insiden darurat selama kegiatan berlangsung. Layanan medis didukung oleh Palang Merah Remaja Siswa Mu'allimin (SUMMIT), Puskesmas Sedayu, serta tenaga medis terkait lainnya.",
        "Penanganan medis di lokasi difokuskan pada pertolongan pertama. Apabila diperlukan penanganan lanjutan, tim medis Panitia membantu proses rujukan ke fasilitas kesehatan terdekat dengan koordinasi bersama Official atau pihak sekolah yang bersangkutan.",
        "Keputusan terkait kelanjutan peserta dalam perlombaan setelah mengalami kondisi medis menjadi pertimbangan tim medis dan Panitia dengan mengutamakan keselamatan peserta.",
        "Setiap insiden kesehatan, keamanan, atau kondisi mencurigakan wajib segera dilaporkan kepada Panitia terdekat."
      ]
    },
    {
      pasal: 11,
      phase: 'Penghargaan',
      title: 'Kategori dan Penghargaan Juara',
      points: [
        "Sebagai bentuk apresiasi dan motivasi bagi peserta, panitia LBB Mu'allimin Tahun 2027 menyediakan hadiah dan penghargaan berikut:\na. Piala Bergilir Juara Umum:\n  1) Piala Bergilir Juara Umum Tingkat SD/MI Sederajat\n  2) Piala Bergilir Juara Umum Tingkat SMP/MTs Sederajat\nb. Kategori Peleton Tingkat SD/MI Sederajat: Juara I, II, III (Piala Tetap + Uang Pembinaan) dan Juara Harapan I, II, III (Piala Tetap).\nc. Kategori Peleton Tingkat SMP/MTs Sederajat: Juara I, II, III (Piala Tetap + Uang Pembinaan) dan Juara Harapan I, II, III (Piala Tetap).\nd. Kategori Komandan Peleton Terbaik Tingkat SD/MI: Juara I (Piala Tetap + Uang Pembinaan) serta Juara II dan III (Piala Tetap).\ne. Kategori Komandan Peleton Terbaik Tingkat SMP/MTs: Juara I (Piala Tetap + Uang Pembinaan) serta Juara II dan III (Piala Tetap).",
        "Seluruh Pemenang (mencakup Juara I, II, III Peleton; Juara Harapan I, II, III Peleton; dan Juara I, II, III Komandan Peleton Terbaik untuk setiap tingkatan) akan mendapatkan E-Sertifikat Piagam Penghargaan sesuai dengan prestasi yang telah diraih."
      ]
    },
    {
      pasal: 12,
      phase: 'Penilaian',
      title: 'Penentuan Juara dan Sistem Perolehan Poin',
      points: [
        "Penentuan Juara Peleton, Juara Harapan, dan Komandan Peleton Terbaik (tingkat SD/MI maupun SMP/MTs) ditetapkan secara sah berdasarkan hasil rekapitulasi nilai dan hasil Sidang Dewan Juri independen dari unsur TNI, POLRI, dan PPI. Keputusan ini bersifat mutlak serta tidak dapat diganggu gugat.",
        "Regulasi Teknis Penjurian & Poin Juara Umum: Rincian formula bobot penilaian (Kebenaran Teknik dan Kekompakan 1:1, serta 4 aspek penilaian Komandan Peleton), tabel perolehan poin Juara Umum (skala 6 s.d. 1 poin), kriteria pemecah seri (tie-breaker), serta penalti pengurangan nilai teknis diatur secara lengkap dan mengikat dalam dokumen Petunjuk Teknis (Juknis) Lapangan Bab F dan Bab G.",
        "Keputusan Dewan Juri: Keputusan Dewan Juri mengenai aspek kualitatif penilaian mutu gerakan bersifat mutlak dan tidak dapat diganggu gugat. Segala bentuk sanggahan hanya dilayani untuk kekeliruan administratif sesuai prosedur pada Pasal 13 Tata Tertib ini dan Juknis Lapangan."
      ]
    },
    {
      pasal: 13,
      phase: 'Tahap IV: Pasca-Lomba',
      title: 'Tahap IV: Pasca-Lomba – Apel Penutupan, Pengumuman Juara, dan Mekanisme Sanggah',
      points: [
        "Apel Penutupan: Apel Penutupan wajib diikuti oleh seluruh peserta dengan ketentuan 1 komandan dan 4 anggota peleton. Peserta Apel Penutupan berpakaian rapi, sopan, dan bersepatu.",
        "Pengumuman Kejuaraan: Pengumuman kejuaraan dilaksanakan setelah Apel Penutupan selesai. Area pengumuman di Lapangan Mini Soccer terbuka bagi seluruh peserta dan pendukung peleton.",
        "Nilai setiap peleton akan ditampilkan secara transparan pada portal peserta melalui situs web https://lbb.tontimuallimin.com dengan sistem rilis bertahap (rolling release) tanpa menunggu seluruh peserta selesai tampil. Rekapitulasi nilai diperkirakan akan muncul di portal dengan estimasi waktu ±1 (satu) jam setelah peleton menyelesaikan materi penampilannya di arena lomba. Official atau perwakilan peleton hanya dapat mengakses rekapitulasi nilai peletonnya sendiri secara privat melalui akun Gmail yang telah didaftarkan.",
        "Mekanisme Pengajuan Protes Resmi (Sanggah): Keputusan Dewan Juri mengenai penilaian yang bersifat kualitatif bersifat mutlak dan tidak dapat diganggu gugat. Protes hanya diterima untuk dugaan kesalahan administratif non-penilaian (kesalahan penjumlahan skor, kesalahan input data, atau kesalahan penerapan poin penalti).",
        "Protes hanya sah jika diajukan secara TERTULIS menggunakan Formulir Sanggahan Resmi oleh 1 (satu) orang Official resmi terdaftar dengan menyertakan bukti valid di Ruang Informasi Panitia (sama dengan ruang registrasi). Pengajuan sanggah dapat dilakukan segera setelah nilai peleton terbit di portal, dan seluruh masa sanggah ditutup serentak selambat-lambatnya pukul 15.00 WIB."
      ]
    },
    {
      pasal: 14,
      phase: 'Tahap IV: Pasca-Lomba',
      title: 'Tahap IV: Pasca-Lomba – Kebersihan Basecamp, Checkout, dan Pemulangan',
      points: [
        "Kewajiban Menjaga Kebersihan & Fasilitas: Seluruh partisipan DIWAJIBKAN menjaga kebersihan, kerapian, dan keutuhan fasilitas di lingkungan Kampus Terpadu Madrasah Mu'allimin Muhammadiyah Yogyakarta (Sedayu, Bantul).",
        "Batas Waktu Maksimal Pengosongan Basecamp: Seluruh peleton wajib telah menyelesaikan proses checkout, membersihkan ruangan, menyerahkan sampah terpilah ke Area Checkout, dan mengosongkan ruang kelas basecamp selambat-lambatnya pukul 15.00 WIB (1 jam sebelum Upacara Penutupan dimulai).",
        "Alur dan Prosedur Resmi Checkout Basecamp:\na. Langkah 1 (Pembersihan & Penataan Ruangan): Peserta membersihkan ruang kelas basecamp dari sisa makanan/kotoran, memastikan tidak ada barang bawaan pribadi atau peleton yang tertinggal, serta merapikan dan mengembalikan posisi meja dan kursi sesuai tata letak semula.\nb. Langkah 2 (Pemilahan & Penyerahan Sampah): Sampah wajib dipilah secara tertib ke dalam 2 (dua) buah trash bag resmi yang telah disediakan panitia (Trash Bag Organik dan Non-Organik). Setelah diikat rapi, kedua kantong sampah diserahkan langsung oleh perwakilan peleton ke Pos/Area Checkout Kebersihan Panitia.\nc. Langkah 3 (Inspeksi & Verifikasi Fasilitas Ruang Kelas): Petugas Panitia (Divisi Kebersihan / LO pendamping) bersama Official melakukan pemeriksaan langsung ke ruang kelas basecamp guna memverifikasi kebersihan, kerapian, dan keutuhan inventaris/sarana-prasarana madrasah, kemudian menerbitkan Tanda Bukti Lolos Verifikasi Checkout.\nd. Langkah 4 (Pengambilan Kembali Jaminan Identitas): Official menyerahkan Tanda Bukti Lolos Verifikasi Checkout ke Ruang Informasi/Registrasi Panitia untuk mengambil kembali kartu identitas asli (KTP/SIM) yang dijaminkan saat check-in awal.",
        "Sanksi Pelanggaran Kebersihan Basecamp: Apabila ruang basecamp ditinggalkan dalam keadaan kotor, berantakan, atau sampah tidak diserahkan ke Pos Checkout, peleton dikenai sanksi penalti pengurangan nilai sebesar 50 poin (-50 poin) pada rekapitulasi nilai akhir sesuai ketentuan Bab G Juknis Lapangan.",
        "Sanksi Kerusakan Fasilitas & Aset Madrasah: Apabila terbukti terjadi kerusakan fisik atau kehilangan aset sarana-prasarana ruang kelas (meja, kursi, kaca jendela, stopkontak, LCD/proyektor, perangkat kelas, dll.), kartu identitas jaminan (KTP/SIM) DITAHAN panitia, dan pihak sekolah yang bersangkutan dikenakan sanksi ganti rugi finansial penuh sesuai nilai perbaikan aset serta denda administratif perbaikan sebesar Rp 500.000 (lima ratus ribu rupiah)."
      ]
    },
    {
      pasal: 15,
      phase: 'Ketentuan Penutup',
      title: 'Penutup',
      points: [
        "Demikian Tata Tertib ini dibuat untuk menjadi pedoman resmi bagi seluruh pihak yang terlibat dalam Lomba Baris-Berbaris Mu'allimin Tahun 2027.",
        "Hal-hal yang belum tercantum dalam dokumen ini akan diatur kemudian oleh panitia dan akan disampaikan pada saat Rapat Teknis (Technical Meeting).",
        "Dengan keikutsertaannya, seluruh peserta dianggap telah memahami dan bersedia mematuhi seluruh isi Tata Tertib ini tanpa terkecuali."
      ]
    }
  ];

  return (
    <section id="tata-tertib" className="py-24 lg:py-32 bg-slate-100 relative overflow-hidden font-sans border-t border-slate-200">
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none overflow-hidden">
        <span className="text-[20vw] font-black text-slate-900 -rotate-12 whitespace-nowrap select-none">
          TATA TERTIB
        </span>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="mb-16 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white text-xs font-bold uppercase tracking-widest mb-6 rounded-sm shadow-xl">
            <Scale className="w-4 h-4" /> Dokumen Resmi Non-Teknis & Etika
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 uppercase tracking-tight mb-4 leading-tight">
            Tata Tertib <span className="text-red-700 decoration-4 decoration-slate-900 underline-offset-4">Peserta</span>
          </h2>
          <p className="text-slate-600 font-mono text-xs sm:text-sm uppercase tracking-wide">
            15 PASAL RESMI LOMBA BARIS – BERBARIS MU'ALLIMIN TAHUN 2027
          </p>
          <p className="text-xs text-slate-500 mt-2">
            Pedoman kedisiplinan, zonasi pesantren, pemanfaatan basecamp, check-in KTP, larangan modifikasi sol sepatu, dan sanksi penalti resmi.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          {articles.map((item) => (
            <div
              key={item.pasal}
              className={`p-6 sm:p-8 rounded-2xl shadow-sm border transition-shadow ${
                item.pasal === 14
                  ? 'bg-amber-50/60 border-amber-300 md:col-span-2'
                  : item.pasal === 11 || item.pasal === 12
                  ? 'bg-slate-900 text-slate-200 border-slate-800'
                  : 'bg-white border-slate-200 hover:shadow-md'
              }`}
            >
              <div className="flex items-center justify-between mb-4 border-b border-slate-200/60 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className={`px-2.5 py-1 rounded-md text-xs font-black uppercase ${
                    item.pasal === 11 || item.pasal === 12
                      ? 'bg-red-600 text-white'
                      : 'bg-slate-900 text-white'
                  }`}>
                    PASAL {item.pasal}
                  </span>
                  <h3 className={`font-black text-sm sm:text-base ${
                    item.pasal === 11 || item.pasal === 12 ? 'text-white' : 'text-slate-900'
                  }`}>
                    {item.title}
                  </h3>
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-wider hidden sm:inline ${
                  item.pasal === 11 || item.pasal === 12 ? 'text-slate-400' : 'text-slate-400'
                }`}>
                  {item.phase}
                </span>
              </div>

              <ol className="list-decimal list-outside pl-5 space-y-2.5 text-xs sm:text-sm leading-relaxed marker:font-bold">
                {item.points.map((pt, idx) => (
                  <li key={idx} className={item.pasal === 11 || item.pasal === 12 ? 'text-slate-300' : 'text-slate-700'}>
                    {pt.split('\n').map((line, lIdx) => (
                      <span key={lIdx} className="block">{line}</span>
                    ))}
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
