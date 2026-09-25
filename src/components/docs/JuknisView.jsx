import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  Download,
  Printer,
  ChevronDown,
  CheckCircle2,
  Clock,
  Swords,
  Trophy,
  Users,
  Shield,
  Layers,
  ArrowRight,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { useCompetition } from '../../context/CompetitionContext.jsx';
import { COMPETITION, DOWNLOADS } from '../../config.js';
import SimpaskorSidebarLayout from '../navigation/SimpaskorSidebarLayout.jsx';

export default function JuknisView() {
  const [selectedJenjang, setSelectedJenjang] = useState('SD');
  const [searchQuery, setSearchQuery] = useState('');

  // 21 Gerakan Baku SD/MI
  const pbbMateriSD = [
    { no: 1, name: 'Sikap Sempurna', desc: 'Berdiri tegak, tumit rapat, sudut 45 derajat, pandangan lurus.', category: 'Di Tempat' },
    { no: 2, name: 'Istirahat di Tempat', desc: 'Kaki kiri dibuka selebar bahu, tangan kiri memegang pergelangan tangan kanan.', category: 'Di Tempat' },
    { no: 3, name: 'Periksa Kerapian', desc: 'Dimulai dari aba-aba pelaksanaan, memeriksa ujung tali sepatu hingga tutup kepala.', category: 'Di Tempat' },
    { no: 4, name: 'Hormat', desc: 'Tangan kanan diangkat lurus jari merapat ke ujung alis kanan/pelipis.', category: 'Di Tempat' },
    { no: 5, name: 'Hitung', desc: 'Saf depan menoleh ke kanan serentak, saf belakang diam, menyebutkan angka berurutan.', category: 'Di Tempat' },
    { no: 6, name: 'Setengah Lengan Lencang Kanan', desc: 'Tangan kanan di pinggang, siku sejajar bahu, pandangan serong ke kanan.', category: 'Di Tempat' },
    { no: 7, name: 'Lencang Kanan', desc: 'Tangan kanan lurus ke samping menyentuh bahu kiri kawan di sampingnya.', category: 'Di Tempat' },
    { no: 8, name: 'Hadap Kanan', desc: 'Kaki kiri melintang, putar tumit kanan 90 derajat, rapatkan kaki kiri.', category: 'Perubahan Arah' },
    { no: 9, name: 'Hadap Kiri', desc: 'Kaki kanan melintang, putar tumit kiri 90 derajat, rapatkan kaki kanan.', category: 'Perubahan Arah' },
    { no: 10, name: 'Balik Kanan', desc: 'Kaki kiri melintang di ujung kaki kanan, putar tumit kanan 180 derajat.', category: 'Perubahan Arah' },
    { no: 11, name: 'Hadap Serong Kanan', desc: 'Perubahan arah serong 45 derajat ke kanan.', category: 'Perubahan Arah' },
    { no: 12, name: 'Hadap Serong Kiri', desc: 'Perubahan arah serong 45 derajat ke kiri.', category: 'Perubahan Arah' },
    { no: 13, name: 'Jalan di Tempat', desc: 'Mengangkat lutut 90 derajat rata-rata air, dimulai dengan kaki kiri bergantian.', category: 'Di Tempat' },
    { no: 14, name: 'Langkah Biasa (Maju Jalan)', desc: 'Langkah teratur, ayunan lengan 45 derajat ke depan dan 30 derajat ke belakang.', category: 'Berjalan' },
    { no: 15, name: 'Langkah Tegap', desc: 'Langkah tegas hentakan telapak kaki penuh, ayunan lengan lurus 90 derajat mendatar.', category: 'Berjalan' },
    { no: 16, name: 'Hormat Kanan (Saat Langkah Tegap)', desc: 'Kepala dipalingkan 45 derajat ke kanan serentak, pandangan ke podium inspektur.', category: 'Berjalan' },
    { no: 17, name: 'Tiap-tiap Banjar Dua Kali Belok Kanan', desc: 'Manuver perubahan arah berputar per banjar secara beruntun.', category: 'Manuver' },
    { no: 18, name: 'Ganti Langkah', desc: 'Menyesuaikan irama langkah tanpa menghentikan pergerakan regu.', category: 'Berjalan' },
    { no: 19, name: '4 Langkah ke Depan / Belakang', desc: 'Langkah teratur tanpa ayunan tangan.', category: 'Berpindah Tempat' },
    { no: 20, name: '4 Langkah ke Kiri / Kanan', desc: 'Langkah menyamping rata, titik pergantian personel cadangan resmi.', category: 'Pergantian Pemain' },
    { no: 21, name: 'Pergantian Anggota Resmi & Laporan', desc: 'Cadangan memasuki barisan menggantikan anggota yang ditunjuk secara tertib.', category: 'Pergantian Pemain' },
  ];

  // 18 Gerakan Baku SMP/MTs
  const pbbMateriSMP = [
    { no: 1, name: 'Sikap Sempurna & Istirahat di Tempat', desc: 'Standar Perpang TNI No. 57 Tahun 2018.', category: 'Di Tempat' },
    { no: 2, name: 'Periksa Kerapian Terpimpin', desc: 'Inspeksi seragam, pet, sabuk, dan tali sepatu.', category: 'Di Tempat' },
    { no: 3, name: 'Lencang Kanan & Lencang Depan', desc: 'Pelurusan saf dan banjar dalam formasi kompi.', category: 'Di Tempat' },
    { no: 4, name: 'Hadap Kanan / Hadap Kiri / Balik Kanan', desc: 'Ketepatan tempo dan kestabilan poros tumit.', category: 'Perubahan Arah' },
    { no: 5, name: 'Hadap Serong Kanan & Serong Kiri', desc: 'Sudut 45 derajat presisi.', category: 'Perubahan Arah' },
    { no: 6, name: 'Buka Barisan & Tutup Barisan', desc: 'Pelebaran jarak banjar 2 langkah.', category: 'Formasi' },
    { no: 7, name: 'Langkah ke Kanan, Kiri, Depan, Belakang', desc: 'Langkah serempak tanpa ayunan lengan.', category: 'Berpindah Tempat' },
    { no: 8, name: 'Jalan di Tempat ke Berhenti', desc: 'Ketinggian paha rata-rata air 90 derajat.', category: 'Di Tempat' },
    { no: 9, name: 'Langkah Biasa (Maju Jalan)', desc: 'Langkah konstan 120 langkah per menit.', category: 'Berjalan' },
    { no: 10, name: 'Langkah Tegap Maju', desc: 'Ayunan tangan 90 derajat, kaki lurus hentakan mantap.', category: 'Berjalan' },
    { no: 11, name: 'Hormat Kanan Sambil Berjalan', desc: 'Penghormatan dewan juri tanpa mengubah tempo langkah.', category: 'Berjalan' },
    { no: 12, name: 'Belok Kanan / Belok Kiri', desc: 'Poros berputar 90 derajat beraturan.', category: 'Manuver' },
    { no: 13, name: 'Dua Kali Belok Kanan / Belok Kiri', desc: 'Manuver 180 derajat dalam formasi berbanjar.', category: 'Manuver' },
    { no: 14, name: 'Tiap-tiap Banjar Dua Kali Belok Kanan', desc: 'Pemisahan laju putar per banjar serempak.', category: 'Manuver' },
    { no: 15, name: 'Haluan Kanan / Haluan Kiri', desc: 'Manuver mengubah arah hadap saf dengan poros banjar sayap.', category: 'Manuver Tingkat Lanjut' },
    { no: 16, name: 'Melintang Kanan / Melintang Kiri', desc: 'Perubahan dari berbanjar menjadi bersaf sambil berjalan.', category: 'Manuver Tingkat Lanjut' },
    { no: 17, name: 'Pergantian Pemain / Anggota Peleton', desc: 'Titik jeda pergantian 1-3 personel cadangan resmi.', category: 'Pergantian Pemain' },
    { no: 18, name: 'Langkah Perlahan & Bubar Barisan', desc: 'Manuver langkah perlahan dan penghormatan penutup.', category: 'Penutup' },
  ];

  const currentList = selectedJenjang === 'SD' ? pbbMateriSD : pbbMateriSMP;

  const filteredMateri = currentList.filter(m =>
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SimpaskorSidebarLayout
      activeMenu="juknis"
      title="Petunjuk Teknis (Juknis) & Materi PBB"
      subtitle="Pedoman baku urutan materi gerakan PBB, pergantian pemain, ketentuan arena, & rubrik penilaian juri"
      rightActions={
        <div className="flex items-center gap-2">
          <a
            href={DOWNLOADS[0]?.url || "https://docs.google.com/document/d/1BN1RuwDcEiuibVvoBG4-5R7Rq8neV5st3nAZoISVQi0/edit?usp=sharing"}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Unduh Juknis Lengkap</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-80" />
          </a>
        </div>
      }
    >
      <div className="space-y-6">

        {/* Top Header Card */}
        <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-blue-900/40 relative overflow-hidden">
          <div className="absolute -right-8 -bottom-8 w-60 h-60 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-black uppercase tracking-wider">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Standar Regulasi Perpang TNI No. 57 & 58</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">
                Petunjuk Teknis & Materi Gerakan Lomba
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                Panduan komprehensif materi PBB Murni (Perpang TNI No. 57 & 58 Th 2018), ketentuan pergantian anggota di jeda gerakan resmi, kriteria penilaian komandan peleton (Danton), dan batas arena.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-4 text-center min-w-[140px] shrink-0">
              <span className="text-[10px] uppercase font-bold text-blue-300 block">Bobot Skor PBB</span>
              <span className="text-2xl font-black text-white font-mono">70%</span>
              <span className="text-[10px] text-slate-300 block mt-0.5">Teknik 70% • Kekompakan 30%</span>
            </div>
          </div>
        </div>

        {/* Arena & Duration Spec Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
            <span className="text-[10px] font-bold uppercase text-slate-400 block">Ukuran Arena Pertandingan</span>
            <span className="text-lg font-black text-slate-900 block font-mono">
              {selectedJenjang === 'SD' ? '25 Meter × 14 Meter' : '26 Meter × 15 Meter'}
            </span>
            <p className="text-[11px] text-slate-500">
              {selectedJenjang === 'SD' ? 'Arena 1: Lapangan Basket Outdoor' : 'Arena 2: Pelataran Embung Sedayu'}
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
            <span className="text-[10px] font-bold uppercase text-slate-400 block">Batas Durasi Tampil</span>
            <span className="text-lg font-black text-slate-900 block font-mono">
              {selectedJenjang === 'SD' ? 'Maksimal 10 Menit' : 'Maksimal 13 Menit'}
            </span>
            <p className="text-[11px] text-slate-500">
              Peringatan peluit menit ke-8 & ke-11. Over time terkena penalti.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
            <span className="text-[10px] font-bold uppercase text-slate-400 block">Slot Pergantian Pemain</span>
            <span className="text-lg font-black text-emerald-700 block font-mono">
              {selectedJenjang === 'SD' ? 'Gerakan No. 20 & 21' : 'Gerakan No. 17 & 18'}
            </span>
            <p className="text-[11px] text-slate-500">
              Pergantian terencana atau insidental maksimal 3 cadangan.
            </p>
          </div>
        </div>

        {/* Jenjang Switcher & Search Bar */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2 p-1.5 bg-slate-100 rounded-2xl">
              <button
                type="button"
                onClick={() => setSelectedJenjang('SD')}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  selectedJenjang === 'SD'
                    ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Tingkat SD / MI (21 Gerakan Baku)
              </button>
              <button
                type="button"
                onClick={() => setSelectedJenjang('SMP')}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  selectedJenjang === 'SMP'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Tingkat SMP / MTs (18 Gerakan Baku)
              </button>
            </div>

            <div className="relative flex-1 sm:max-w-xs">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Cari butir gerakan PBB..."
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:bg-white"
              />
            </div>
          </div>

          {/* List of Movements */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredMateri.map(m => (
              <div
                key={m.no}
                className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200 hover:border-blue-400 hover:bg-blue-50/30 transition-all flex items-start gap-3.5 group"
              >
                <span className="w-8 h-8 rounded-xl bg-blue-600 text-white font-mono font-black text-xs flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  {String(m.no).padStart(2, '0')}
                </span>
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-xs font-black text-slate-900 group-hover:text-blue-700 transition-colors">
                      {m.name}
                    </h4>
                    <span className="text-[9px] font-bold text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded-full shrink-0">
                      {m.category}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    {m.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Rubrik Penilaian Khusus: Danton & Kekompakan */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
            <h3 className="text-sm font-black text-slate-900 uppercase flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-600" />
              <span>Kriteria Penilaian Danton (Juri 3 - Bobot 100% Danton)</span>
            </h3>
            <ul className="text-xs text-slate-600 space-y-2">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                <span><strong>Penguasaan Materi Aba-Aba (35%):</strong> Urutan aba-aba tepat, tidak terbalik, ketegasan vokal.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                <span><strong>Kualitas Suara IKIT (25%):</strong> Intonasi, kejelasan artikulasi, irama, tempo, dan resonansi suara.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                <span><strong>Sikap Tampang & Pelaporan (20%):</strong> Kerapian seragam, ketenangan, wibawa, dan tata cara laporan resmi militer.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                <span><strong>Penguasaan Lapangan (20%):</strong> Penempatan posisi terhadap dewan juri dan penjuru saf peleton.</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
            <h3 className="text-sm font-black text-slate-900 uppercase flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-600" />
              <span>Kriteria Kekompakan Gerakan Peleton (Juri 2 - Bobot 30%)</span>
            </h3>
            <ul className="text-xs text-slate-600 space-y-2">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                <span><strong>Keseragaman Langkah & Ayunan:</strong> Kesamaan sudut ayunan tangan dan ketinggian angkatan paha/kaki.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                <span><strong>Kelurusan Saf & Banjar:</strong> Kerapian interval jarak antaranggota, kerapian banjar saat manuver dan henti.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                <span><strong>Irama, Tempo, & Harmonisasi:</strong> Keserentakan hentakan kaki tanpa ada yang mendahului atau tertinggal.</span>
              </li>
            </ul>
          </div>
        </div>

      </div>
    </SimpaskorSidebarLayout>
  );
}
