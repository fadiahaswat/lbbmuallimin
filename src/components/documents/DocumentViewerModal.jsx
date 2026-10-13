import React, { useState } from 'react';
import {
  X,
  Printer,
  FileText,
  Download,
  CheckCircle2,
  Shield,
  Award,
  ArrowLeft,
  BookOpen,
  FileCheck2,
  FileBadge2
} from 'lucide-react';
import { SITE, EVENT, VENUE, COMPETITION, PAYMENT, MATERIALS, PENALTIES } from '../../config.js';
import { useCompetition } from '../../context/CompetitionContext.jsx';

export default function DocumentViewerModal({ isOpen, onClose }) {
  const { goBack } = useCompetition();

  if (isOpen === false) return null;

  function handlePrint() {
    window.print();
  }

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      goBack();
    }
  };

  return (
    <div className="min-h-screen bg-slate-200/70 text-slate-900 flex flex-col selection:bg-red-200">
      {/* Sticky Top Navigation Bar */}
      <header className="sticky top-0 z-30 bg-slate-950/95 backdrop-blur-md border-b border-slate-800 text-white py-3 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white transition-all text-xs font-bold flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Kembali</span>
            </button>
            <div className="h-5 w-px bg-slate-800 hidden sm:block"></div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-red-700 text-white flex items-center justify-center">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-yellow-400 block leading-none">
                  Dokumen Resmi
                </span>
                <span className="text-xs font-bold text-white">Petunjuk Teknis (Juknis) LBB Mu'allimin 2027</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-red-700 hover:bg-red-600 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-md shadow-red-950/30"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak / Simpan PDF</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Document Reading Area (Paper Sheet View) */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-8 flex justify-center">
        <div className="bg-white p-8 sm:p-14 rounded-2xl shadow-xl border border-slate-300/80 w-full text-slate-900 font-serif leading-relaxed text-sm my-auto">
          
          {/* Kop Surat Resmi Gambar & Teks */}
          <div className="border-b-4 border-double border-slate-900 pb-4 mb-6 text-center">
            <img
              src="/kop-lbb.png"
              alt="KOP Resmi LBB Mu'allimin 2027"
              className="w-full max-h-24 sm:max-h-28 object-contain mx-auto mb-2"
              loading="lazy"
            />
            <p className="text-[11px] font-sans text-slate-500">
              Kampus Terpadu Madrasah Mu'allimin Muhammadiyah Yogyakarta • Website: lbb.tontimuallimin.com • WhatsApp: 0819-4749-1505
            </p>
          </div>

          {/* DOKUMEN: JUKNIS RESMI */}
          <div className="space-y-4 font-sans text-xs sm:text-sm text-slate-800">
            <div className="text-center mb-6">
                <h3 className="font-black text-lg uppercase underline">PETUNJUK TEKNIS PELAKSANAAN</h3>
                <span className="font-bold text-xs text-slate-500">Nomor: 001/PAN-LBB/MUALLIMIN/IX/2027</span>
              </div>

              <div className="space-y-3">
                <h4 className="font-black text-sm uppercase text-red-700">A. DEFINISI ISTILAH DAN KETENTUAN DASAR LAPANGAN</h4>
                <p><strong>1. Clear Area:</strong> Area steril di sekeliling arena perlombaan yang hanya dapat dimasuki oleh peleton yang sedang berkompetisi (termasuk Cadangan), maksimal 1 (satu) orang Official resmi (Pelatih/Pembina), 2 (dua) orang Pendukung Resmi (Medis/Dokumentasi) yang mengenakan ID Card resmi, serta panitia pelaksana dan Dewan Juri yang bertugas.</p>
                <p><strong>2. Daerah Persiapan (DP):</strong> Area transisi berjenjang sebelum peleton memasuki arena perlombaan, terdiri dari Daerah Persiapan 1 (DP 1) sebagai Pos Pengecekan Personel dan Verifikasi Fisik, serta Daerah Persiapan 2 (DP 2) yang difungsikan murni sebagai Ruang Tunggu Siap Tampil (Holding Area). Peleton dilarang keras memasuki DP 1 sebelum dipanggil resmi oleh panitia melalui pengeras suara (mic).</p>
                <p><strong>3. Ketentuan Kotak Danton dan Pergerakan Komandan Peleton:</strong> Kotak Danton berukuran 1,5 x 1,5 meter terletak di batas depan arena dan menghadap langsung ke arah Peleton yang bersangkutan. Komandan Peleton mengawali penampilan dari posisi tengah arena untuk melaksanakan penghormatan dan pelaporan awal kepada juri, kemudian berpindah memasuki Kotak Danton untuk memimpin jalannya materi perlombaan. Selama memimpin di dalam kotak, Komandan Peleton wajib berada di posisi menghadap peleton (posisi komando), dilarang keras membelakangi meja Dewan Juri, serta tidak diperbolehkan menginjak maupun melangkah keluar dari garis batas kotak, kecuali pada instruksi materi yang secara teknis mengharuskannya keluar kotak seperti bubar peleton, berhimpun, atau perhatian/istirahat di tempat.</p>
                <p><strong>4. Prinsip Garis Batas dan Penilaian Pelanggaran:</strong> Seluruh garis batas arena perlombaan maupun batas Kotak Danton menganut asas "Garis sebagai Garis" (pelanggaran dihitung berdasarkan kontak fisik/pijakan, bukan dinding imajiner di udara). Pelanggaran dinyatakan sah terjadi apabila terdapat alas kaki atau bagian tubuh peserta maupun Komandan Peleton yang secara nyata menyentuh/menginjak garis atau menapak di luar area batas yang telah ditentukan. Setiap bentuk pelanggaran akan ditandai secara langsung melalui kibasan bendera oleh Hakim Garis dan dikenakan sanksi pemotongan nilai pada rekapitulasi penilaian.</p>
                <p><strong>5. Sinyal dan Alat Komunikasi Petugas Lapangan:</strong> Untuk menjamin keteraturan dan kepastian teknis di lapangan, panitia menetapkan penggunaan sinyal resmi: peluit digunakan khusus sebagai penanda perhitungan waktu lomba oleh Timekeeper, sedangkan bendera digunakan khusus oleh Hakim Garis untuk menandai terjadinya pelanggaran garis batas arena dan batas Kotak Danton.</p>
                <p><strong>6. Gerakan Penyesuaian:</strong> Gerakan tambahan di tempat yang bertujuan untuk memperbaiki posisi atau formasi peleton di dalam arena lomba. Gerakan penyesuaian HANYA meliputi: Hadap (Kanan/Kiri/Serong), Balik (Kanan), dan Langkah Terbatas (langkah ke Kiri/Kanan/Depan/Belakang). Penggunaan Gerakan Penyesuaian TIDAK DIBATASI jumlahnya (tidak dikenakan penalti potongan angka kuota), namun frekuensi dan efektivitas penggunaannya berpengaruh langsung terhadap penilaian aspek Penguasaan Lapangan Komandan Peleton. Ditegaskan bahwa dilarang keras menggunakan gerakan tambahan yang menyerupai materi sebelum dan sesudah gerakan tambahan tersebut dilakukan.</p>
                <p><strong>7. Spesifikasi Dimensi Arena Perlombaan:</strong> Perlombaan dilaksanakan secara terpisah dan simultan di Kampus Terpadu Sedayu pada dua arena resmi: (a) Tingkat SD/MI: Arena 1 bertempat di Lapangan Basket dengan ukuran 25 meter x 14 meter. Durasi tampil maksimal 8 menit; (b) Tingkat SMP/MTs: Arena 2 bertempat di Pelataran Embung dengan ukuran 26 meter x 15 meter. Durasi tampil maksimal 12 menit.</p>
                <p><strong>8. Ketentuan Pendamping dan Dokumentasi Peleton:</strong> Setiap peleton didampingi oleh maksimal 1 (satu) orang Official (Pelatih/Pembina), 2 (dua) orang Pendukung Resmi (masing-masing dapat berfungsi sebagai Medis dan Dokumentasi), serta seluruh anggota cadangan resmi. Petugas dokumentasi dari pihak peleton hanya diizinkan mengambil dokumentasi dari batas area yang telah ditentukan oleh panitia, dilarang keras berada di posisi yang sejajar dengan meja Dewan Juri, serta tidak diperkenankan menghalangi pandangan maupun mengganggu jalannya perlombaan dan proses penilaian.</p>
              </div>

              <div className="space-y-3 pt-2">
                <h4 className="font-black text-sm uppercase text-red-700">B. TAHAP I: PRA-LOMBA - TEKNIS TECHNICAL MEETING (TM) PESERTA</h4>
                <p>1. Waktu dan Tempat Pelaksanaan: Dilaksanakan pada hari Sabtu, 9 Januari 2027 pukul 13.00 - 16.30 WIB bertempat di Aula Kampus Induk Madrasah Mu'allimin Muhammadiyah Yogyakarta (Jl. Letjen S. Parman No. 68, Patangpuluhan, Wirobrajan, Kota Yogyakarta).</p>
                <p>2. Ketentuan Kehadiran Delegasi: Setiap peleton wajib mendelegasikan maksimal 2 (dua) orang perwakilan resmi (Official/Pelatih/Pembina atau Komandan Peleton). Seluruh perwakilan wajib mengenakan pakaian rapi, sopan, dan bersepatu. Perwakilan putri wajib mengenakan pakaian berlengan panjang.</p>
                <p>3. Agenda Registrasi dan Verifikasi Berkas Fisik Asli (12.30 - 13.00 WIB): Surat Tugas / Rekomendasi Resmi Kepala Sekolah asli berstempel basah (1 Danton, 21 Inti, 3 Cadangan, 1 Official, 2 Pendukung Resmi) & Pakta Integritas bermaterai Rp 10.000 yang ditandatangani basah oleh Official.</p>
                <p>4. Pemaparan Materi Teknis & Juknis Lomba (13.00 - 14.30 WIB): Penjelasan Perpang TNI No. 58 & 57 Tahun 2018 (serta No. 45 Tahun 2014 untuk Hormat Kanan/Kiri), rasio penilaian 1:1, ketentuan gerakan penyesuaian tanpa kuota yang mempengaruhi Penguasaan Lapangan Danton, garis batas, kotak danton, stopwatch, dan rilis nilai di website lbb.tontimuallimin.com.</p>
                <p>5. Sesi Tanya Jawab Teknis (14.30 - 15.15 WIB) dicatat dalam Notulensi Resmi TM.</p>
                <p>6. Pengundian Resmi (Lotting) Nomor Urut Tampil (15.15 - 16.00 WIB): Tingkat SD/MI: Nomor undian SD-111 s.d. SD-175; Tingkat SMP/MTs: Nomor undian SMP-222 s.d. SMP-286.</p>
                <p>7. Konfirmasi Uji Coba Lapangan & Penutupan (16.00 – 16.30 WIB): Pengisian survei mandiri via web-app lbb.tontimuallimin.com.</p>
              </div>

              <div className="space-y-3 pt-2">
                <h4 className="font-black text-sm uppercase text-red-700">C. TAHAP I: PRA-LOMBA - TEKNIS UJI COBA LAPANGAN (FAMILIARISASI MEDAN)</h4>
                <p>1. Waktu dan Tempat Pelaksanaan: Dilaksanakan pada hari Sabtu, 16 Januari 2027 pukul 07.00 – 13.00 WIB bertempat di Kampus Terpadu Sedayu.</p>
                <p>2. Sistem Pelaksanaan Paralel di Dua Arena: Arena 1 (Lapangan Basket, 25 m x 14 m) untuk SD/MI; Arena 2 (Pelataran Embung, 26 m x 15 m) untuk SMP/MTs.</p>
                <p>3. Alokasi Waktu Resmi per Peleton: Tepat 15 – 18 menit (waktu efektif 8 menit untuk SD/MI dan 12 menit untuk SMP/MTs, ditambah 5 menit transisi).</p>
                <p>4. Ketentuan Perlengkapan: Seragam olahraga/latihan sekolah yang seragam, rapi, celana panjang, bersepatu. DILARANG KERAS sol berpaku/berpines.</p>
                <p>5. Murni kegiatan orientasi medan dan TIDAK ADA penilaian dari juri.</p>
              </div>

              <div className="space-y-3 pt-2">
                <h4 className="font-black text-sm uppercase text-red-700">D. TAHAP II: HARI PERLOMBAAN - REGISTRASI S.D. UPACARA PEMBUKAAN</h4>
                <p>1. Kedatangan dan Check-In Peleton (Pukul 06.00–09.00 WIB) di Ruang Registrasi Resmi Gedung Madrasah Lantai 1 dengan jaminan KTP/SIM. Menerima Nomor Dada (disematkan pada Saf 2 Banjar 1 / S2B1), 3 ID Card (1 Official & 2 Pendukung), 1 dus air botol, dan 2 kantong sampah terpilah. Registrasi ditutup tepat pukul 09.00 WIB. Bus wajib parkir di Lapangan Hibrida Argomulyo setelah drop-off.</p>
                <p>2. Sterilisasi Arena Perlombaan (Pukul 06.45 WIB): Arena disterilkan, upacara pembukaan mulai pukul 07.00 WIB, sesi pertama lomba mulai pukul 08.00 WIB.</p>
                <p>3. Pelaksanaan Upacara Pembukaan Resmi (Pukul 07.00 - 07.45 WIB): Peleton urutan tampil 6 sampai dengan 10 pada masing-masing tingkatan WAJIB mengikuti: SD/MI (SD-131, SD-133, SD-135, SD-137, SD-139) dan SMP/MTs (SMP-242, SMP-244, SMP-246, SMP-248, SMP-260) dengan formasi 1 Danton dan 15 Anggota (5 trio) berseragam lomba.</p>
              </div>

              <div className="space-y-3 pt-2">
                <h4 className="font-black text-sm uppercase text-red-700">E. TAHAP III: HARI PERLOMBAAN - ALUR PERSIAPAN & PELAKSANAAN TAMPIL DI ARENA</h4>
                <p>1. Kesiapan di DP 1: Masuk HANYA setelah dipanggil resmi melalui mic (dilarang masuk sebelum dipanggil). Verifikasi jumlah 22 orang di arena, nomor dada S2B1, sol sepatu tanpa pines/paku.</p>
                <p>2. DP 2 difungsikan murni sebagai Holding Area (Ruang Tunggu Siap Tampil) yang tenang.</p>
                <p>3. Pelaksanaan di Arena: Penghormatan awal (stopwatch DIMULAI saat aba-aba pelaksanaan "GERAK"), laporan pembuka ("Lapor, peleton dengan nomor dada ... siap melaksanakan materi gerakan lomba"), masuk Kotak Danton 1,5 x 1,5 meter.</p>
                <p>4. Durasi Tampil: Maksimal 8 menit (SD/MI) dan 12 menit (SMP/MTs). Sinyal peluit 1x panjang (sisa 1 menit: menit ke-7 SD / menit ke-11 SMP), sinyal peluit 2x panjang (waktu habis: menit ke-8 SD / menit ke-12 SMP). Garis batas dipantau bendera Hakim Garis.</p>
                <p>5. Atribut Terjatuh: TIDAK DIKENAKAN PENALTI PENGURANGAN NILAI (dilarang memungut hingga keluar arena).</p>
                <p>6. Titik Pergantian Pemain Cadangan di Arena: Dilaksanakan pada saat materi "Bubar", yaitu di antara Materi No. 16 dan 17 (SD/MI) serta di antara Materi No. 19 dan 20 (SMP/MTs). Waktu stopwatch tetap berjalan.</p>
                <p>7. Laporan Penutup, Penghormatan Penutup & Penghentian Waktu: Stopwatch BERHENTI saat aba-aba pelaksanaan "GERAK" pada penghormatan penutup ("Hormat = GERAK"). Nomor dada dikembalikan kepada petugas pos sebelum kembali ke basecamp.</p>
              </div>

              <div className="space-y-3 pt-2">
                <h4 className="font-black text-sm uppercase text-red-700">F. KETENTUAN PASCA-LOMBA DAN PROSEDUR CHECKOUT BASECAMP</h4>
                <p>1. Batas Waktu Maksimal Pengosongan: Seluruh peleton wajib menyelesaikan proses checkout dan mengosongkan ruang kelas basecamp selambat-lambatnya pukul 15.00 WIB (1 jam sebelum Upacara Penutupan dimulai).</p>
                <p>2. Alur 4 Langkah Checkout Resmi: (1) Merapikan kembali susunan meja-kursi dan memastikan tidak ada barang peleton tertinggal; (2) Membawa dan menyerahkan 2 (dua) kantong sampah terpilah (Organik & Non-Organik) ke Pos/Area Checkout Panitia; (3) Pemeriksaan langsung kebersihan dan keutuhan fasilitas ruangan kelas oleh LO/Panitia Kebersihan guna memperoleh Tanda Bukti Lolos Verifikasi Checkout; (4) Pengambilan kembali kartu identitas jaminan (KTP/SIM) di Ruang Informasi Panitia dengan menunjukkan Tanda Bukti Lolos Verifikasi.</p>
                <p>3. Ketentuan Sanksi & Denda: Peleton yang meninggalkan basecamp dalam keadaan kotor atau berantakan dikenai sanksi penalti pengurangan nilai sesuai Petunjuk Teknis Penilaian & Kejuaraan. Apabila terjadi kerusakan fisik atau kehilangan fasilitas kelas, kartu jaminan KTP/SIM ditahan serta pihak sekolah dikenakan sanksi ganti rugi penuh dan denda administratif sesuai Pasal 14 Tata Tertib Peserta.</p>
              </div>

              <div className="space-y-3 pt-2">
                <h4 className="font-black text-sm uppercase text-red-700">G. KEADAAN KAHAR (FORCE MAJEURE)</h4>
                <p>1. Ruang Lingkup Kahar: Keadaan kahar mencakup kondisi atau kejadian di luar kendali Panitia Pelaksana maupun peserta yang dapat mengganggu atau membahayakan pelaksanaan perlombaan, antara lain hujan deras ekstrem, badai atau angin kencang, bencana alam, gangguan keamanan, pemadaman listrik total, atau kondisi lain yang dinilai membahayakan keselamatan.</p>
                <p>2. Kondisi Hujan Ringan (Gerimis): Perlombaan tetap dilaksanakan sesuai jadwal. Peserta tetap mengikuti perlombaan dengan memperhatikan arahan Panitia dan Dewan Juri.</p>
                <p>3. Kondisi Hujan Deras / Badai Ekstrem: Apabila kondisi cuaca dinilai membahayakan keselamatan peserta, Panitia Pelaksana bersama Dewan Juri berwenang menghentikan perlombaan sementara. Apabila perlombaan dihentikan saat peleton sedang melaksanakan penampilan, penampilan peleton tersebut dinyatakan dihentikan dan akan diulang setelah kondisi dinyatakan aman dan kondusif. Penampilan ulang dimulai dari awal masuk arena, dengan waktu penampilan dihitung kembali dari 00:00.</p>
                <p>4. Wewenang Keputusan: Keputusan penghentian dan kelanjutan perlombaan merupakan wewenang mutlak Panitia Pelaksana dan Dewan Juri.</p>
              </div>

              <div className="space-y-3 pt-2">
                <h4 className="font-black text-sm uppercase text-red-700">H. PENUTUP (JUKNIS LAPANGAN)</h4>
                <p>Petunjuk Teknis Lapangan ini menjadi pedoman operasional resmi bagi seluruh panitia, dewan juri, dan peserta LBB Mu'allimin Tahun 2027. Seluruh hal teknis tambahan yang disepakati bersama dalam forum Technical Meeting mengikat secara sah dan menjadi bagian tak terpisahkan dari juknis ini.</p>
              </div>

              <div className="space-y-3 pt-4 border-t border-slate-300">
                <h4 className="font-black text-base uppercase text-amber-700">PETUNJUK TEKNIS PENILAIAN & KEJUARAAN</h4>
                <p><strong>A. Sistem Penilaian, Sanggah & Penentuan Juara:</strong> Penilaian dilakukan oleh 6 Dewan Juri (TNI, POLRI, PPI: 3 Juri Arena 1 SD & 3 Juri Arena 2 SMP). Nilai Peleton 1:1 (Kebenaran Teknik dan Kekompakan skala 50–90 poin). Nilai Danton = (Penguasaan Materi × 35%) + (Kualitas Suara/Vokal × 25%) + (Sikap & Pelaporan × 20%) + (Penguasaan Lapangan × 20%). Poin Juara Umum: Juara 1 Peleton (6), Juara 2 (5), Juara 3 (4), Harapan 1 (3), Harapan 2 (2), Harapan 3 (1). Juara 1 Danton (3), Juara 2 (2), Juara 3 (1). Tie-breaker Juara Umum: Peringkat Tertinggi Peleton &gt; Nilai Murni Peleton &gt; Nilai Kebenaran Teknik PBB &gt; Capaian Peleton Berikutnya &gt; Capaian Komandan Terbaik &gt; Sidang Pleno Juri. Transparansi e-rekapitulasi rolling release akun Gmail ±1 jam setelah tampil. Pengajuan sanggah tertulis ditutup pukul 15.00 WIB.</p>
                <p><strong>B. Prosedur Backup & Mitigasi Gangguan Sistem E-Penilaian:</strong> Prosedur backup manual diterapkan apabila sistem digital mengalami gangguan untuk menjamin kelancaran penilaian dan data penting lainnya.</p>
                <p><strong>C. Ketentuan Sanksi dan Penalti Pengurangan Nilai:</strong> Tidak hadir Upacara Pembukaan (-150 poin), terlambat Upacara Pembukaan (-50 poin/5 menit), telat DP 1 setelah 3x pemanggilan (-100 poin & urutan akhir; tidak hadir = Diskualifikasi), personel &lt; 22 orang (-75 poin), kelebihan durasi waktu (-50 poin / 1–30 detik pada nilai Peleton & Danton), anggota peleton injak/keluar garis (-50 poin/kejadian pada nilai Peleton & Danton), komandan injak/keluar kotak danton (-50 poin/kejadian pada nilai Komandan saja), gerakan penyesuaian (0 poin penalti), gerakan terlewat di luar urutan (Nilai Minimal 50; tidak dilakukan = Nilai 0), peleton hafalan (Nilai 0 Kebenaran Teknik Peleton & potong Penguasaan Materi Danton), gerakan berangkai terputus (Nilai Minimal 50 & potong Penguasaan Materi Danton), pelanggaran kebersihan basecamp (-50 poin), yel-yel selama penampilan (Peringatan 1, Peringatan 2, lalu -50 poin/kejadian), atribut terjatuh (0 poin penalti).</p>
                <p><strong>D. Penutup:</strong> Menjadi pedoman operasional resmi bagi seluruh panitia, dewan juri, dan peserta LBB Mu'allimin Tahun 2027.</p>
              </div>

              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center justify-between text-xs">
                <span className="text-red-900 font-semibold">Tersedia versi dokumen interaktif lengkap di Google Docs:</span>
                <a
                  href="https://docs.google.com/document/d/1BN1RuwDcEiuibVvoBG4-5R7Rq8neV5st3nAZoISVQi0/edit?usp=sharing"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1 bg-red-700 hover:bg-red-800 text-white font-bold rounded shadow transition-colors inline-flex items-center gap-1.5"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  Buka Google Docs
                </a>
              </div>

              <div className="pt-8 flex justify-end text-center text-xs">
                <div>
                  <p>Yogyakarta, 1 September 2026</p>
                  <p className="font-bold mt-1">Ketua Panitia Pelaksana,</p>
                  <div className="h-16 flex items-center justify-center text-slate-300 text-[10px]">
                    (Tanda Tangan & Cap Panitia)
                  </div>
                  <p className="font-bold underline">Falhan Zuhdi Mubarok</p>
                  <p className="text-[10px] text-slate-500">NIM/NBM. Panitia LBB 2027</p>
                </div>
              </div>
            </div>
        </div>
      </main>

      {/* Page Footer */}
      <footer className="border-t border-slate-300/80 bg-white py-6 text-center text-xs text-slate-500">
        <p>© 2027 Madrasah Mu'allimin Muhammadiyah Yogyakarta • Panitia Pelaksana LBB 2027</p>
      </footer>
    </div>
  );
}
