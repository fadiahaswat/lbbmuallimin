import React, { useState } from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  FileText,
  Clock,
  Printer,
  Download,
  ExternalLink,
  Users,
  Search,
  Scale,
  Sparkles
} from 'lucide-react';
import { useCompetition } from '../../context/CompetitionContext.jsx';
import { DOWNLOADS, EVENT, VENUE } from '../../config.js';
import SimpaskorSidebarLayout from '../navigation/SimpaskorSidebarLayout.jsx';

export default function TataTertibView() {
  const [searchPenalty, setSearchPenalty] = useState('');

  // Sanksi & Penalti Resmi LBB Mu'allimin 2027 (Bab G Juknis Lapangan & Pasal 6, 7, 8, 9, 14 Tata Tertib)
  const penaltiesList = [
    {
      violation: 'Tidak Mengikuti Upacara Pembukaan (Peleton No. 1–5)',
      points: 150,
      pointsDisplay: '-150 Poin',
      rule: 'Bab H.1 Juknis / Pasal 6.2 Tatib',
      desc: 'Peleton nomor urut 1 sampai 5 (SD-111 s.d. SD-119 dan SMP-222 s.d. SMP-240) yang tidak hadir lengkap (1 komandan + 15 anggota) saat upacara pembukaan resmi. Penalti berlaku terhadap nilai Peleton.',
      type: 'Disiplin Upacara',
    },
    {
      violation: 'Keterlambatan Hadir Upacara Pembukaan',
      points: 50,
      pointsDisplay: '-50 Poin / kelipatan 5 mnt',
      rule: 'Bab H.1 Juknis / Pasal 6.3 Tatib',
      desc: 'Keterlambatan hadir berbaris pada upacara pembukaan dihitung per kelipatan 5 menit. Penalti berlaku terhadap nilai Peleton.',
      type: 'Disiplin Upacara',
    },
    {
      violation: 'Keterlambatan Memasuki Pos DP 1 (3x Pemanggilan Resmi)',
      points: 100,
      pointsDisplay: '-100 Poin & Urutan Akhir',
      rule: 'Bab H.2 Juknis / Pasal 7.3 Tatib',
      desc: 'Peleton tidak hadir di DP 1 setelah 3 kali pemanggilan resmi lewat pengeras suara (interval 2 menit). Urutan tampil digeser paling akhir. Jika tanpa konfirmasi resmi = DISKUALIFIKASI. Penalti berlaku terhadap nilai Peleton.',
      type: 'Ketepatan Waktu',
    },
    {
      violation: 'Kekurangan Personel Pasukan di Arena (< 22 Orang)',
      points: 75,
      pointsDisplay: '-75 Poin Tetap',
      rule: 'Bab H.3 Juknis',
      desc: 'Peleton memasuki arena dengan jumlah personel kurang dari 22 orang (1 Komandan Peleton + 21 Anggota). Penalti berlaku terhadap nilai Peleton.',
      type: 'Komposisi Personel',
    },
    {
      violation: 'Kelebihan Durasi Waktu Tampil di Arena',
      points: 50,
      pointsDisplay: '-50 Poin / rentang 1–30 dtk',
      rule: 'Bab H.4 Juknis',
      desc: 'Kelebihan durasi maksimal (10 menit SD, 13 menit SMP) dikenai penalti -50 poin untuk setiap rentang 1 s.d. 30 detik dan kelipatannya. Penalti diberlakukan terhadap nilai Peleton dan nilai Komandan Peleton.',
      type: 'Waktu Tampil',
    },
    {
      violation: 'Pelanggaran Garis Arena / Kotak Danton (Asas "Garis sebagai Garis")',
      points: 50,
      pointsDisplay: '-50 Poin / kejadian',
      rule: 'Bab H.5 & Bab A.4 Juknis',
      desc: 'Anggota peleton menginjak/keluar garis arena penalti -50 poin pada nilai Peleton & nilai Komandan. Komandan menginjak/keluar Kotak Danton (1,5×1,5 m) penalti -50 poin pada nilai Komandan (tidak mengurangi nilai Peleton).',
      type: 'Arena & Garis',
    },
    {
      violation: 'Kelebihan Gerakan Penyesuaian (> 3 Kali)',
      points: 25,
      pointsDisplay: '-25 Poin / gerakan',
      rule: 'Bab H.6 Juknis',
      desc: 'Gerakan penyesuaian (hanya hadap, balik, atau langkah terbatas) melebihi kuota 3 kali dikenai penalti -25 poin per gerakan tambahan terhadap nilai Komandan Peleton.',
      type: 'Teknik Gerakan',
    },
    {
      violation: 'Gerakan Terlewat / Tidak Urut',
      points: 0,
      pointsDisplay: 'Nilai Minimal / Nilai 0',
      rule: 'Bab H.7 Juknis',
      desc: 'Gerakan terlewat namun dilaksanakan di luar urutan diberi nilai minimal (50). Gerakan terlewat dan tidak dilaksanakan sama sekali diberi nilai 0 (nol). Memengaruhi penilaian Penguasaan Materi Danton.',
      type: 'Teknis Materi',
    },
    {
      violation: 'Peleton Hafalan (Gerakan Tidak Sesuai Aba-Aba Danton)',
      points: 0,
      pointsDisplay: 'Nilai 0 & Potong Nilai Danton',
      rule: 'Bab H.8 Juknis',
      desc: 'Komandan salah aba-aba tetapi peleton tetap bergerak benar hafalan: nilai 0 pada Kebenaran Teknik Peleton, dan kesalahan aba-aba diperhitungkan pada Penguasaan Materi Komandan.',
      type: 'Teknis Aba-Aba',
    },
    {
      violation: 'Gerakan Berangkai Terputus',
      points: 0,
      pointsDisplay: 'Nilai Minimal',
      rule: 'Bab H.9 Juknis',
      desc: 'Rangkaian gerakan bertanda "-" yang diselingi jeda atau gerakan tambahan yang tidak diperintahkan: nilai minimal (50) pada Kebenaran Teknik Peleton, dan diperhitungkan pada Penguasaan Materi Komandan.',
      type: 'Teknik Gerakan',
    },
    {
      violation: 'Pelanggaran Kebersihan Basecamp',
      points: 50,
      pointsDisplay: '-50 Poin',
      rule: 'Bab H.10 Juknis / Pasal 14.4 Tatib',
      desc: 'Meninggalkan ruang basecamp dalam keadaan kotor atau berantakan dikenai penalti -50 poin pada rekapitulasi nilai akhir peleton.',
      type: 'Kebersihan & Lingkungan',
    },
    {
      violation: 'Yel-Yel Selama Penampilan di Arena',
      points: 50,
      pointsDisplay: '-50 Poin (Setelah Peringatan 1 & 2)',
      rule: 'Bab H.11 Juknis / Pasal 9.2 Tatib',
      desc: 'Dilarang meneriakkan yel-yel/aba-aba saat peleton tampil. Pelanggaran 1 & 2 diberi peringatan; pelanggaran ke-3 dan seterusnya penalti -50 poin terhadap nilai Peleton. Pelanggaran berat dapat langsung penalti -50 poin.',
      type: 'Etika & Suporter',
    },
    {
      violation: 'Atribut / Aksesoris Terlepas atau Terjatuh di Arena',
      points: 0,
      pointsDisplay: '0 Poin (TIDAK PENALTI)',
      rule: 'Bab E.3.i Juknis',
      desc: 'Atribut topi/peci, dasi, pin, lencana, sabuk, sarung tangan, dll. yang terlepas/jatuh TIDAK DIKENAKAN PENALTI (0 poin). Peleton dilarang memungut atribut hingga keluar arena.',
      type: 'Kerapian Atribut',
    },
    {
      violation: 'Kerusakan Fisik atau Kehilangan Sarana-Prasarana Basecamp',
      points: 0,
      pointsDisplay: 'Ganti Rugi + Denda Rp 500.000',
      rule: 'Pasal 14.5 Tatib',
      desc: 'Kerusakan meja, kursi, kaca jendela, stopkontak, LCD proyektor: kartu jaminan KTP/SIM DITAHAN, wajib ganti rugi fisik penuh + denda administratif perbaikan aset Rp 500.000.',
      type: 'Sanksi Aset & Fasilitas',
    },
  ];

  const filteredPenalties = penaltiesList.filter(p =>
    p.violation.toLowerCase().includes(searchPenalty.toLowerCase()) ||
    p.desc.toLowerCase().includes(searchPenalty.toLowerCase()) ||
    p.type.toLowerCase().includes(searchPenalty.toLowerCase())
  );

  const handlePrintTatib = () => {
    window.print();
  };

  return (
    <SimpaskorSidebarLayout
      activeMenu="tatib"
      title="Tata Tertib & Sanksi Penalti"
      subtitle="Regulasi kepatuhan kontingen 15 Pasal, kewajiban suporter, matriks sanksi penalti Perpang TNI, & mekanisme sanggah 60 menit"
      rightActions={
        <div className="flex items-center gap-2">
          <a
            href={DOWNLOADS[1]?.url || "https://docs.google.com/document/d/1rkVVB0XgycFRQgx8N4Zs7K6LB6T2J0cjYTtmALxpDzM/edit?usp=sharing"}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Unduh Dokumen Tatib</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-80" />
          </a>
          <button
            onClick={handlePrintTatib}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span className="hidden sm:inline">Cetak</span>
          </button>
        </div>
      }
    >
      <div className="space-y-6">

        {/* Top Header Card */}
        <div className="bg-gradient-to-r from-red-950 via-slate-900 to-rose-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-red-900/40 relative overflow-hidden">
          <div className="absolute -right-8 -bottom-8 w-60 h-60 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 border border-red-400/30 text-red-300 text-xs font-black uppercase tracking-wider">
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>15 Pasal Resmi & Matriks Penalti Bab G Juknis</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">
                Tata Tertib & Matriks Sanksi Penalti
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                Pedoman kepatuhan kontingen, zonasi privasi Asrama Santri, kebersihan basecamp dengan jaminan KTP, sanksi pelanggaran arena dewan juri, serta transparansi live quick count & batas sanggah 60 menit.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-4 text-center min-w-[140px] shrink-0">
              <span className="text-[10px] uppercase font-bold text-red-300 block">Sanggah Resmi</span>
              <span className="text-2xl font-black text-white font-mono">60 Menit</span>
              <span className="text-[10px] text-slate-300 block mt-0.5">Setelah Pengumuman</span>
            </div>
          </div>
        </div>

        {/* Hak & Kewajiban Kontingen Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <h3 className="text-sm font-black text-slate-900 uppercase">Kewajiban Peserta & Official (Pasal 5, 8, 14)</h3>
            </div>
            <ul className="text-xs text-slate-600 space-y-2.5">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0 mt-1.5"></span>
                <span>Hadir di lokasi lomba Kampus Terpadu Sedayu untuk daftar ulang pukul 06.00 – 09.00 WIB.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0 mt-1.5"></span>
                <span>Menyerahkan 1 KTP/SIM perwakilan sekolah di meja registrasi sebagai jaminan kebersihan basecamp.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0 mt-1.5"></span>
                <span>Menyematkan nomor dada resmi di dada sebelah kiri personel penjuru depan tengah (S2B1).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0 mt-1.5"></span>
                <span>Mengikuti Upacara Pembukaan bagi Peleton No. 1–5 SD & SMP (SD-111 s.d. SD-119 & SMP-222 s.d. SMP-240; 1 Danton + 15 Anggota Lengkap berseragam lomba).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0 mt-1.5"></span>
                <span>Membersihkan basecamp, memilah sampah organik & anorganik, dan checkout selambat-lambatnya pukul 15.00 WIB (1 jam sebelum Upacara Penutupan, Pasal 14.2).</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
              <XCircle className="w-5 h-5 text-rose-600" />
              <h3 className="text-sm font-black text-slate-900 uppercase">Larangan Keras & Diskualifikasi (Pasal 8, 9)</h3>
            </div>
            <ul className="text-xs text-slate-600 space-y-2.5">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-600 shrink-0 mt-1.5"></span>
                <span><strong>DILARANG KERAS</strong> memasuki kawasan privat <strong>Asrama Santri</strong> Kampus Terpadu Mu'allimin.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-600 shrink-0 mt-1.5"></span>
                <span><strong>DILARANG KERAS</strong> menggunakan sepatu modifikasi berpines, paku payung, atau spikes (diperiksa di DP 1).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-600 shrink-0 mt-1.5"></span>
                <span>Wali murid, suporter, dan penonton <strong>DILARANG MASUK</strong> ke area basecamp/ruang kelas peserta.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-600 shrink-0 mt-1.5"></span>
                <span>Suporter dilarang membunyikan instrumen/toa saat peleton tampil dan dilarang bersorak sinis saat peleton lain salah.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-600 shrink-0 mt-1.5"></span>
                <span>Membawa senjata tajam, miras, melakukan kekerasan, atau hoaks bernuansa SARA = <strong>DISKUALIFIKASI</strong>.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Tabel Matriks Sanksi Penalti */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-base font-black text-slate-900 uppercase flex items-center gap-2">
                <Scale className="w-4 h-4 text-red-600" />
                <span>Matriks Pengurangan Nilai Penalti Resmi (Bab G Juknis & Tatib)</span>
              </h3>
              <p className="text-xs text-slate-500">Pengurangan poin resmi dewan juri dan panitera yang dihitung langsung pada rekapitulasi nilai akhir</p>
            </div>

            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchPenalty}
                onChange={e => setSearchPenalty(e.target.value)}
                placeholder="Cari jenis pelanggaran..."
                className="pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:bg-white"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-3">Landasan Aturan</th>
                  <th className="py-3 px-3">Bentuk Pelanggaran</th>
                  <th className="py-3 px-3">Kategori</th>
                  <th className="py-3 px-3">Keterangan Regulasi</th>
                  <th className="py-3 px-3 text-right">Ketentuan Sanksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPenalties.map((pen, idx) => (
                  <tr key={idx} className="hover:bg-red-50/30 transition-colors">
                    <td className="py-3.5 px-3 font-mono font-bold text-slate-500 text-[11px] whitespace-nowrap">
                      {pen.rule}
                    </td>
                    <td className="py-3.5 px-3 font-bold text-slate-900">
                      {pen.violation}
                    </td>
                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                        {pen.type}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-slate-600 max-w-sm leading-relaxed">
                      {pen.desc}
                    </td>
                    <td className="py-3.5 px-3 text-right font-mono font-black text-sm whitespace-nowrap">
                      <span className={pen.points > 0 ? 'text-rose-600' : pen.points === 0 && pen.pointsDisplay.includes('0 Poin') ? 'text-emerald-600' : 'text-amber-600'}>
                        {pen.pointsDisplay}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mekanisme Protes / Sanggah Resmi */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center font-bold">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 uppercase">Mekanisme Pengajuan Sanggah & Live Score (Pasal 13)</h3>
              <p className="text-xs text-slate-500">Transparansi live score quick count via akun Gmail terdaftar & prosedur legal nota sanggahan</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2 text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="font-mono font-black text-amber-700 text-sm block">1. Transparansi Nilai</span>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Rilis bertahap (rolling release) via lbb.tontimuallimin.com estimasi ±1 jam setelah tampil, login akun Gmail peleton.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="font-mono font-black text-amber-700 text-sm block">2. Ditutup Pukul 15.00 WIB</span>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Dapat diajukan sejak nilai terbit di portal, dan seluruh masa sanggah resmi DITUTUP SERENTAK pukul 15.00 WIB.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="font-mono font-black text-amber-700 text-sm block">3. Formulir & Bukti Valid</span>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Diajukan tertulis menggunakan Formulir Sanggahan Resmi oleh 1 Official resmi disertai bukti valid di Ruang Informasi Panitia.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="font-mono font-black text-amber-700 text-sm block">4. Objek Sanggahan</span>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Hanya diterima untuk dugaan kesalahan administratif non-penilaian (salah jumlah, input data, penalti). Mutu gerakan juri bersifat mutlak.
              </p>
            </div>
          </div>
        </div>

      </div>
    </SimpaskorSidebarLayout>
  );
}
