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
  Scale
} from 'lucide-react';
import { useCompetition } from '../../context/CompetitionContext.jsx';
import { DOWNLOADS } from '../../config.js';
import SimpaskorSidebarLayout from '../navigation/SimpaskorSidebarLayout.jsx';

export default function TataTertibView() {
  const [searchPenalty, setSearchPenalty] = useState('');

  // Sanksi & Penalti Resmi LBB Mu'allimin 2027
  const penaltiesList = [
    {
      violation: 'Tidak Mengikuti Apel Besar / Upacara Pembukaan',
      points: 150,
      rule: 'Pasal 4 Ayat 1',
      desc: 'Peleton tidak hadir lengkap saat apel pembukaan resmi di Lapangan Mini Soccer.',
      type: 'Disiplin Umum',
    },
    {
      violation: 'Keterlambatan Memasuki Pos DP 1 (> 5 Menit)',
      points: 100,
      rule: 'Pasal 6 Ayat 3',
      desc: 'Peleton belum tiba di DP 1 saat nomor urut tampilnya dipanggil 3 kali oleh panitia.',
      type: 'Ketepatan Waktu',
    },
    {
      violation: 'Kekurangan Personel Pasukan Inti (< 21 Pasukan)',
      points: 75,
      rule: 'Pasal 5 Ayat 2',
      desc: 'Tampil dengan jumlah pasukan inti kurang dari 21 orang di dalam arena perlombaan.',
      type: 'Komposisi Personel',
    },
    {
      violation: 'Kelebihan Durasi Waktu Tampil di Arena',
      points: 50,
      rule: 'Pasal 7 Ayat 4',
      desc: 'Dikenakan per 10 detik kelipatan setelah peluit panjang tanda batas waktu dibunyikan.',
      type: 'Waktu Tampil',
    },
    {
      violation: 'Menginjak atau Melewati Garis Batas Arena (Dinding Imajiner)',
      points: 50,
      rule: 'Pasal 8 Ayat 1',
      desc: 'Setiap anggota peleton yang menginjak/melewati garis batas lapangan putih (25x14m atau 26x15m).',
      type: 'Arena & Garis',
    },
    {
      violation: 'Gerakan Penyesuaian Ilegal di Luar Ketentuan',
      points: 25,
      rule: 'Pasal 8 Ayat 5',
      desc: 'Melakukan gerakan penyesuaian posisi yang tidak diatur dalam urutan materi juknis.',
      type: 'Teknik Gerakan',
    },
    {
      violation: 'Atribut / Aksesoris Terjatuh di Arena',
      points: 15,
      rule: 'Pasal 9 Ayat 2',
      desc: 'Topi, lencana, tanda pangkat, tali kur, atau atribut peleton yang terlepas/jatuh di lapangan.',
      type: 'Kerapian Atribut',
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
      subtitle="Regulasi kepatuhan kontingen, kewajiban suporter, tabel sanksi penalti Perpang TNI, & mekanisme sanggah"
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
                <span>Kode Etik & Regulasi Kedisiplinan Lomba</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">
                Tata Tertib & Matriks Sanksi Penalti
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                Aturan baku pelaksanaan perlombaan, larangan keras bagi official & suporter, pedoman pemotongan nilai dewan juri, serta prosedur legal pengajuan nota protes resmi 60 menit.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-4 text-center min-w-[140px] shrink-0">
              <span className="text-[10px] uppercase font-bold text-red-300 block">Sanggah Resmi</span>
              <span className="text-2xl font-black text-white font-mono">60 Menit</span>
              <span className="text-[10px] text-slate-300 block mt-0.5">Pasca Skor Sementara</span>
            </div>
          </div>
        </div>

        {/* Hak & Kewajiban Kontingen Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <h3 className="text-sm font-black text-slate-900 uppercase">Kewajiban Peserta & Official</h3>
            </div>
            <ul className="text-xs text-slate-600 space-y-2.5">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0 mt-1.5"></span>
                <span>Hadir di lokasi perlombaan Kampus Terpadu Sedayu paling lambat pukul 06.00 WIB.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0 mt-1.5"></span>
                <span>Mengikuti Apel Pembukaan Lengkap berseragam peleton resmi.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0 mt-1.5"></span>
                <span>Menyerahkan identitas KTP Pembina di Pos Check-In Basecamp dan menjaga kebersihan ruang transit.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0 mt-1.5"></span>
                <span>Mematuhi seluruh keputusan dewan juri yang bersifat mutlak dan tidak dapat diganggu gugat.</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
              <XCircle className="w-5 h-5 text-rose-600" />
              <h3 className="text-sm font-black text-slate-900 uppercase">Larangan Keras di Lokasi Lomba</h3>
            </div>
            <ul className="text-xs text-slate-600 space-y-2.5">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-600 shrink-0 mt-1.5"></span>
                <span>Dilarang membawa senjata tajam, kembang api, flare, smoke bomb, dan laser pointer.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-600 shrink-0 mt-1.5"></span>
                <span>Official / Pelatih dilarang memberikan aba-aba atau instruksi fisik saat peleton berada di arena.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-600 shrink-0 mt-1.5"></span>
                <span>Suporter dilarang memicu keributan, menyanyikan ujaran kebencian, atau merusak sarana kampus.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-600 shrink-0 mt-1.5"></span>
                <span>Pelanggaran berat dapat berakibat <strong>Diskualifikasi Langsung</strong> bagi peleton bersangkutan.</span>
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
                <span>Matriks Pengurangan Nilai Penalti Resmi</span>
              </h3>
              <p className="text-xs text-slate-500">Kalkulasi potongan poin otomatis yang diterapkan langsung pada lembar rekapitulasi nilai</p>
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
                  <th className="py-3 px-3">Pasal</th>
                  <th className="py-3 px-3">Bentuk Pelanggaran</th>
                  <th className="py-3 px-3">Kategori</th>
                  <th className="py-3 px-3">Keterangan Regulasi</th>
                  <th className="py-3 px-3 text-right">Potongan Poin</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPenalties.map((pen, idx) => (
                  <tr key={idx} className="hover:bg-red-50/30 transition-colors">
                    <td className="py-3.5 px-3 font-mono font-bold text-slate-500">
                      {pen.rule}
                    </td>
                    <td className="py-3.5 px-3 font-bold text-slate-900">
                      {pen.violation}
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                        {pen.type}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-slate-600 max-w-sm">
                      {pen.desc}
                    </td>
                    <td className="py-3.5 px-3 text-right font-mono font-black text-rose-600 text-sm">
                      -{pen.points} Poin
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
              <h3 className="text-base font-black text-slate-900 uppercase">Mekanisme Pengajuan Sanggah / Nota Protes</h3>
              <p className="text-xs text-slate-500">Prosedur resmi jika kontingen menemukan indikasi kesalahan input hitung data</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2 text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="font-mono font-black text-amber-700 text-sm block">1. Batas 60 Menit</span>
              <p className="text-slate-600 text-[11px]">
                Pengajuan protes hanya dilayani maksimal 60 menit setelah skor sementara ditayangkan di portal.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="font-mono font-black text-amber-700 text-sm block">2. Surat Resmi Tertulis</span>
              <p className="text-slate-600 text-[11px]">
                Wajib diajukan secara tertulis oleh Pembina / Pelatih resmi bertandatangan di Meja Sekretariat.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="font-mono font-black text-amber-700 text-sm block">3. Uang Jaminan Sanggah</span>
              <p className="text-slate-600 text-[11px]">
                Menyertakan uang jaminan protes Rp500.000,- yang dikembalikan utuh jika terbukti terjadi kekeliruan panitia.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="font-mono font-black text-amber-700 text-sm block">4. Sidang Dewan Juri</span>
              <p className="text-slate-600 text-[11px]">
                Ketua Dewan Juri memeriksa ulang rekaman video resmi & blangko fisik asli, keputusan sidang bersifat final.
              </p>
            </div>
          </div>
        </div>

      </div>
    </SimpaskorSidebarLayout>
  );
}
