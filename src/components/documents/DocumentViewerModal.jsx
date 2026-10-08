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
                <p>6. Titik Pergantian Pemain Cadangan di Arena: Dilaksanakan pada saat materi "Bubar", yaitu di antara Materi No. 16 dan 17 (SD/MI) serta di antara Materi No. 22 dan 23 (SMP/MTs). Waktu stopwatch tetap berjalan.</p>
                <p>7. Laporan Penutup, Penghormatan Penutup & Penghentian Waktu: Stopwatch BERHENTI saat aba-aba pelaksanaan "GERAK" pada penghormatan penutup ("Tegak = GERAK"). Nomor dada dikembalikan kepada petugas pos sebelum kembali ke basecamp.</p>
              </div>

              <div className="space-y-3 pt-2">
                <h4 className="font-black text-sm uppercase text-red-700">F. TAHAP IV: PASCA-LOMBA - PENILAIAN, LIVE SCORE, SANGGAH & PENENTUAN JUARA</h4>
                <p>1. Penilaian oleh 6 Dewan Juri (TNI, POLRI, PPI). Rasio penilaian peleton 1:1 (Kebenaran Teknik dan Kekompakan), rentang 50 s.d. 90 poin. Nilai Akhir = Nilai Murni – Penalti.</p>
                <p>2. Nilai Danton = (Penguasaan Materi × 35%) + (Kualitas Suara/Vokal × 25%) + (Sikap & Pelaporan × 20%) + (Penguasaan Lapangan × 20%) – Penalti Danton.</p>
                <p>3. Poin Juara Umum: Juara 1 Peleton (6), Juara 2 (5), Juara 3 (4), Juara Harapan 1 (3), Harapan 2 (2), Harapan 3 (1). Juara 1 Danton (3), Juara 2 (2), Juara 3 (1). Tie-breaker: Peringkat Tertinggi Peleton &gt; Nilai Murni Peleton &gt; Nilai Kebenaran Teknik PBB &gt; Capaian Peleton Berikutnya &gt; Capaian Komandan Terbaik &gt; Sidang Pleno Juri.</p>
                <p>4. Transparansi Nilai (Rolling Release): Rilis mandiri privat di portal lbb.tontimuallimin.com via login Gmail estimasi ±1 jam setelah tampil.</p>
                <p>5. Masa Sanggah Ditutup Pukul 15.00 WIB di Ruang Informasi Panitia secara tertulis menggunakan Formulir Sanggahan Resmi untuk dugaan kekeliruan administratif non-penilaian.</p>
                <p>6. Pengosongan Basecamp selambat-lambatnya pukul 15.00 WIB (4 langkah: bersihkan ruangan, serahkan 2 kantong sampah terpilah ke Pos Checkout, inspeksi lolos verifikasi, ambil KTP/SIM jaminan).</p>
              </div>

              <div className="space-y-3 pt-2">
                <h4 className="font-black text-sm uppercase text-red-700">G. GANGGUAN SISTEM DIGITAL DAN PROSEDUR BACKUP</h4>
                <p>Didukung formulir/dokumen manual cadangan untuk pencatatan peserta, administrasi, dan hasil penilaian juri. Gangguan teknis sistem tidak dapat dijadikan dasar untuk menghilangkan atau mengubah nilai peserta.</p>
              </div>

              <div className="space-y-3 pt-2">
                <h4 className="font-black text-sm uppercase text-red-700">H. KETENTUAN SANKSI DAN PENALTI PENGURANGAN NILAI</h4>
                <p>1. Upacara Pembukaan: Tidak hadir -150 poin; terlambat -50 poin per kelipatan 5 menit (Nilai Peleton).</p>
                <p>2. Keterlambatan Hadir di DP 1: Setelah 3x panggilan (interval 2 menit) penalti -100 poin & urutan digeser paling akhir; tetap tidak hadir = DISKUALIFIKASI (Nilai Peleton).</p>
                <p>3. Jumlah Personel Kurang: Kurang dari 22 orang penalti tetap -75 poin (Nilai Peleton).</p>
                <p>4. Kelebihan Durasi Waktu: Melebihi 8 mnt (SD) / 12 mnt (SMP) penalti -50 poin untuk setiap rentang 1 s.d. 30 detik dan kelipatannya (Nilai Peleton & Komandan).</p>
                <p>5. Pelanggaran Garis: Anggota injak/keluar garis penalti -50 poin/kejadian (Nilai Peleton & Komandan); Komandan injak/keluar Kotak Danton 1,5x1,5m penalti -50 poin/kejadian (Nilai Komandan saja, tidak mengurangi nilai Peleton).</p>
                <p>6. Gerakan Penyesuaian: Tidak dibatasi jumlahnya dan 0 poin penalti (pengurangan skor kualitatif Penguasaan Lapangan Komandan bobot 20%).</p>
                <p>7. Gerakan Terlewat / Tidak Urut: Terlewat tapi dilakukan di luar urutan = Nilai Minimal (50); tidak dilaksanakan = Nilai 0 (Penguasaan Materi Danton).</p>
                <p>8. Peleton Hafalan: Danton salah aba-aba tapi peleton hafal = Nilai 0 Kebenaran Teknik Peleton & potong Penguasaan Materi Danton.</p>
                <p>9. Gerakan Berangkai Terputus: Rangkaian bertanda (-) diselingi jeda/gerakan tambahan = Nilai Minimal (50) & potong Penguasaan Materi Danton.</p>
                <p>10. Kebersihan Basecamp: Meninggalkan kotor/berantakan = Penalti -50 poin.</p>
                <p>11. Yel-Yel Selama Penampilan: Peringatan 1, Peringatan 2, lalu penalti -50 poin/kejadian (pelanggaran berat dapat langsung penalti -50 poin).</p>
                <p>12. Kerusakan Fasilitas Basecamp: KTP/SIM ditahan, ganti rugi fisik penuh + denda administratif Rp 500.000.</p>
              </div>

              <div className="space-y-3 pt-2">
                <h4 className="font-black text-sm uppercase text-red-700">I & J. KEADAAN KAHAR (FORCE MAJEURE) & PENUTUP</h4>
                <p>Gerimis perlombaan tetap berjalan. Hujan deras/badai ekstrem yang membahayakan peserta dihentikan sementara dan diulang dari awal masuk arena (stopwatch reset 00:00). Helpdesk Resmi: 0819-4749-1505 (Admin), Website: https://lbb.tontimuallimin.com/ , Email: lbb@tontimuallimin.com, Instagram: @lbbmuin | @mualliminjogja | TikTok: @tontimuallimin.</p>
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
                  <div className="h-16 flex items-center justify-center text-slate-300 italic text-[10px]">
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
