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
import { COMPETITION, DOWNLOADS, MATERIALS } from '../../config.js';
import SimpaskorSidebarLayout from '../navigation/SimpaskorSidebarLayout.jsx';

export default function JuknisView() {
  const [selectedJenjang, setSelectedJenjang] = useState('SD');
  const [searchQuery, setSearchQuery] = useState('');

  // 28 Gerakan Resmi SD/MI LBB Mu'allimin 2027 (MATERI SD LBB MUALLIMIN 2027.docx)
  const pbbMateriSD = MATERIALS.SD.map((name, idx) => {
    let category = 'Di Tempat';
    const lower = name.toLowerCase();
    if (lower.includes('penghormatan') || lower.includes('laporan')) {
      category = 'Protokoler Lapangan';
    } else if (lower.includes('langkah ke') || lower.includes('buka barisan')) {
      category = 'Berpindah Tempat';
    } else if (lower.includes('hadap') || lower.includes('balik')) {
      category = 'Perubahan Arah';
    } else if (lower.includes('maju jalan') || lower.includes('langkah tegap') || lower.includes('hormat kanan') || lower.includes('belok') || lower.includes('melintang') || lower.includes('haluan')) {
      category = 'Berjalan & Manuver';
    } else if (lower.includes('istirahat') || lower.includes('periksa') || lower.includes('lencang') || lower.includes('hitung') || lower.includes('jalan di tempat')) {
      category = 'Di Tempat';
    }

    return {
      no: idx + 1,
      name,
      category,
      isSubstitutionPoint: idx === 19 // antara no 20 & 21
    };
  });

  // 26 Gerakan Resmi SMP/MTs LBB Mu'allimin 2027 (MATERI SMP LBB MUALLIMIN 2027.docx)
  const pbbMateriSMP = MATERIALS.SMP.map((name, idx) => {
    let category = 'Di Tempat';
    const lower = name.toLowerCase();
    if (lower.includes('penghormatan') || lower.includes('laporan')) {
      category = 'Protokoler Lapangan';
    } else if (lower.includes('lari') || lower.includes('melintang') || lower.includes('haluan') || lower.includes('belok') || lower.includes('langkah tegap') || lower.includes('langkah perlahan') || lower.includes('ganti langkah')) {
      category = 'Berjalan & Manuver Dinamis';
    } else if (lower.includes('langkah ke') || lower.includes('buka barisan') || lower.includes('bubar') || lower.includes('berhimpun') || lower.includes('berkumpul')) {
      category = 'Berpindah & Formasi';
    } else if (lower.includes('hadap') || lower.includes('balik')) {
      category = 'Perubahan Arah';
    } else if (lower.includes('istirahat') || lower.includes('periksa') || lower.includes('lencang') || lower.includes('hitung') || lower.includes('jalan di tempat')) {
      category = 'Di Tempat';
    }

    return {
      no: idx + 1,
      name,
      category,
      isSubstitutionPoint: idx === 16 // antara no 17 (Berhimpun) & 18 (Berkumpul Bersaf)
    };
  });

  const currentList = selectedJenjang === 'SD' ? pbbMateriSD : pbbMateriSMP;

  const filteredMateri = currentList.filter(m =>
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SimpaskorSidebarLayout
      activeMenu="juknis"
      title="Petunjuk Teknis (Juknis) & Materi PBB"
      subtitle="Pedoman baku urutan materi gerakan PBB resmi, pergantian pemain, ketentuan arena, & rubrik penilaian juri 1:1"
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
                <span>Standar Regulasi Perpang TNI No. 58 & 57 Th 2018</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">
                Petunjuk Teknis & Materi Gerakan Lomba
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                Panduan materi PBB Murni (Perpang TNI No. 58 & 57 Th 2018 dan No. 45 Th 2014 untuk Hormat Kanan/Kiri), slot pergantian pemain resmi, matriks penilaian 1:1, dan spesifikasi 2 arena paralel.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-4 text-center min-w-[150px] shrink-0">
              <span className="text-[10px] uppercase font-bold text-blue-300 block">Rasio Peleton</span>
              <span className="text-2xl font-black text-white font-mono">1 : 1</span>
              <span className="text-[10px] text-slate-300 block mt-0.5">Kebenaran 50% • Kompak 50%</span>
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
              {selectedJenjang === 'SD' ? 'Arena 1: Lapangan Basket Kampus Terpadu' : 'Arena 2: Pelataran Embung Kampus Terpadu'}
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
            <span className="text-[10px] font-bold uppercase text-slate-400 block">Batas Durasi Tampil</span>
            <span className="text-lg font-black text-slate-900 block font-mono">
              {selectedJenjang === 'SD' ? 'Maksimal 10 Menit' : 'Maksimal 13 Menit'}
            </span>
            <p className="text-[11px] text-slate-500">
              {selectedJenjang === 'SD' ? 'Peluit 1x panjang menit ke-8, 2x panjang menit ke-10.' : 'Peluit 1x panjang menit ke-11, 2x panjang menit ke-13.'}
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
            <span className="text-[10px] font-bold uppercase text-slate-400 block">Slot Pergantian Pemain</span>
            <span className="text-lg font-black text-emerald-700 block font-mono">
              {selectedJenjang === 'SD' ? 'Antara Gerakan No. 20 & 21' : 'Antara Gerakan No. 17 & 18'}
            </span>
            <p className="text-[11px] text-slate-500">
              Maksimal 3 anggota cadangan dengan lapor dan konfirmasi juri.
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
                Tingkat SD / MI (28 Gerakan Resmi)
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
                Tingkat SMP / MTs (26 Gerakan Resmi)
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
                className={`p-4 rounded-2xl border transition-all flex items-start gap-3.5 group ${
                  m.isSubstitutionPoint
                    ? 'bg-emerald-50/60 border-emerald-300 hover:border-emerald-500'
                    : 'bg-slate-50/70 border-slate-200 hover:border-blue-400 hover:bg-blue-50/30'
                }`}
              >
                <span className={`w-8 h-8 rounded-xl font-mono font-black text-xs flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 ${
                  m.isSubstitutionPoint ? 'bg-emerald-700 text-white' : 'bg-slate-900 text-white'
                }`}>
                  {String(m.no).padStart(2, '0')}
                </span>
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-xs font-black text-slate-900 group-hover:text-blue-700 transition-colors leading-snug">
                      {m.name}
                    </h4>
                  </div>
                  <div className="flex items-center gap-2 pt-0.5">
                    <span className="text-[9px] font-bold text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded-full shrink-0">
                      {m.category}
                    </span>
                    {m.isSubstitutionPoint && (
                      <span className="text-[9px] font-bold text-emerald-800 bg-emerald-100 border border-emerald-200 px-2 py-0.5 rounded-full">
                        Titik Pergantian Pemain
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Rubrik Penilaian Khusus: Juri 1:1 & Danton */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
            <h3 className="text-sm font-black text-slate-900 uppercase flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-600" />
              <span>Kriteria Penilaian Komandan Peleton (4 Aspek Baku)</span>
            </h3>
            <ul className="text-xs text-slate-600 space-y-2">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                <span><strong>Penguasaan Materi Aba-Aba (35%):</strong> Kebenaran urutan aba-aba petunjuk, peringatan, dan pelaksanaan sesuai juknis.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                <span><strong>Kualitas Suara (25%):</strong> Kejelasan artikulasi, intonasi, tempo, ritme, dan kekuatan vokal (IKIT).</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                <span><strong>Sikap Tampang & Keberanian (20%):</strong> Ketenangan, ketegasan pandangan mata, wibawa kepemimpinan, dan kerapian.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                <span><strong>Penguasaan Lapangan (20%):</strong> Penempatan posisi relatif terhadap pasukan dan dewan juri serta efektivitas kotak Danton (1,5 × 1,5 m).</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
            <h3 className="text-sm font-black text-slate-900 uppercase flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-600" />
              <span>Sistem Penilaian Peleton 1:1 (Rentang 50 s.d. 90 Genap)</span>
            </h3>
            <ul className="text-xs text-slate-600 space-y-2">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                <span><strong>Kebenaran Gerak (Bobot 50%):</strong> Kesesuaian teknik gerak dengan Perpang TNI 58 & 57 Tahun 2018 (serta No. 45 Tahun 2014).</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                <span><strong>Kekompakan (Bobot 50%):</strong> Keselarasan tempo, irama hentakan kaki, kesamaan sudut ayunan tangan, dan kelurusan saf/banjar.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                <span><strong>Skala Nilai:</strong> Diberikan dalam rentang 50 s.d. 90 poin (bilangan genap) oleh 6 Dewan Juri Independen (TNI, POLRI, PPI).</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                <span><strong>Atribut Terjatuh:</strong> Diberlakukan penalti 0 poin (tidak ada pengurangan nilai) agar konsentrasi peleton terjaga.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bab H & Prosedur Khusus: Force Majeure, Sanggah & Checkout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-amber-50/60 border border-amber-200/80 rounded-3xl p-6 space-y-3">
            <h3 className="text-sm font-black text-amber-950 uppercase flex items-center gap-2">
              <Shield className="w-4 h-4 text-amber-700" />
              <span>Bab H: Protokol Keadaan Kahar (Force Majeure)</span>
            </h3>
            <ul className="text-xs text-amber-900/80 space-y-2 leading-relaxed">
              <li>
                <strong>Hujan Ringan (Gerimis):</strong> Perlombaan tetap berlangsung secara normal dan waktu lomba tetap berjalan.
              </li>
              <li>
                <strong>Hujan Deras / Badai Ekstrem:</strong> Panitia bersama Dewan Juri berhak menghentikan lomba sementara demi keselamatan.
              </li>
              <li>
                <strong>Mekanisme Reset Waktu:</strong> Peleton yang penampilannya terhenti di tengah materi akibat badai akan diulang dari awal masuk arena dengan stopwatch di-reset ke 00:00 setelah cuaca kondusif.
              </li>
              <li>
                <strong>Wewenang Mutlak:</strong> Keputusan penghentian dan kelanjutan perlombaan merupakan wewenang mutlak Panitia Pelaksana dan Dewan Juri.
              </li>
            </ul>
          </div>

          <div className="bg-slate-900 text-white rounded-3xl p-6 space-y-3 border border-slate-800">
            <h3 className="text-sm font-black text-white uppercase flex items-center gap-2">
              <Clock className="w-4 h-4 text-red-400" />
              <span>Pasca Lomba: Transparansi, Sanggah & Checkout</span>
            </h3>
            <ul className="text-xs text-slate-300 space-y-2 leading-relaxed">
              <li>
                <strong>Transparansi Live Score:</strong> Official dapat mengakses lembar rekap nilai mandiri di portal <span className="text-red-400 font-mono">lbb.tontimuallimin.com</span> via login Gmail resmi terdaftar.
              </li>
              <li>
                <strong>Masa Sanggah 60 Menit:</strong> Protes hanya diterima untuk kekeliruan administratif non-penilaian, diajukan tertulis via Formulir Sanggahan Resmi oleh Official di Meja Informasi Panitia.
              </li>
              <li>
                <strong>Batas Checkout Pukul 14.00 WIB:</strong> Pengosongan basecamp wajib tuntas 1 jam sebelum Apel Penutupan melalui 4 langkah verifikasi kebersihan untuk pengembalian KTP/SIM jaminan.
              </li>
            </ul>
          </div>
        </div>

      </div>
    </SimpaskorSidebarLayout>
  );
}
