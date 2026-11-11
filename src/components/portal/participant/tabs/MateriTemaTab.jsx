import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Sparkles,
  Copy,
  Check,
  Download,
  AlertCircle,
  Timer,
  Ruler,
  ShieldCheck,
  Award,
  Layers,
  ChevronRight,
  Info,
  ExternalLink,
  Scale
} from 'lucide-react';
import { COMPETITION, MATERIALS, DOWNLOADS } from '../../../../config.js';
import BacaPerpangTab from './BacaPerpangTab.jsx';

export default function MateriTemaTab({ currentTeam, initialSubTab = 'materi' }) {
  const [activeSubTab, setActiveSubTab] = useState(initialSubTab); // 'materi' | 'perpang'
  const hasTeamJenjang = Boolean(currentTeam?.jenjang);
  const teamJenjang = currentTeam?.jenjang === 'SMP' ? 'SMP' : 'SD';
  const [selectedLevel, setSelectedLevel] = useState(teamJenjang);
  const [copiedLevel, setCopiedLevel] = useState(null);

  useEffect(() => {
    if (currentTeam?.jenjang) {
      setSelectedLevel(currentTeam.jenjang === 'SMP' ? 'SMP' : 'SD');
    }
  }, [currentTeam?.jenjang]);

  useEffect(() => {
    if (initialSubTab) {
      setActiveSubTab(initialSubTab);
    }
  }, [initialSubTab]);

  const isSD = selectedLevel === 'SD';
  const list = isSD ? MATERIALS.SD : MATERIALS.SMP;
  const specLabel = isSD ? COMPETITION.SD.ARENA_SPEC_LABEL : COMPETITION.SMP.ARENA_SPEC_LABEL;
  const arenaName = isSD ? 'Arena 1: Lapangan Basket Kampus Sedayu' : 'Arena 2: Pelataran Embung Kampus Sedayu';
  const arenaDim = isSD ? '18m × 20m' : '20m × 22m';
  const maxDuration = isSD ? '8 Menit' : '12 Menit';

  function generateTextMateri(level) {
    const isLevelSD = level === 'SD';
    const title = isLevelSD ? 'MATERI LOMBA TINGKAT SD/MI SEDERAJAT' : 'MATERI LOMBA TINGKAT SMP/MTS SEDERAJAT';
    const spec = isLevelSD ? COMPETITION.SD.ARENA_SPEC_LABEL : COMPETITION.SMP.ARENA_SPEC_LABEL;
    const items = isLevelSD ? MATERIALS.SD : MATERIALS.SMP;

    let text = `========================================================\n`;
    text += `${title}\n`;
    text += `LOMBA BARIS - BERBARIS MU'ALLIMIN TAHUN 2027\n`;
    text += `${spec}\n`;
    text += `TEMA: "SEMANGAT SEBAGAI KSATRIA, BERJUANG DENGAN GEMBIRA"\n`;
    text += `========================================================\n\n`;
    text += `URUTAN GERAKAN MATERI LOMBA:\n`;
    items.forEach((item, idx) => {
      text += `${idx + 1}. ${item}\n`;
    });
    text += `\nKETENTUAN PENTING:\n`;
    if (isLevelSD) {
      text += `a. Pada Gerakan #25 ("Untuk Perhatian, Istirahat di Tempat"), Komandan Peleton wajib menyampaikan arahan bertema resmi LBB Mu'allimin 2027;\n`;
    } else {
      text += `a. Pada Gerakan #20 ("Berhimpun"), Komandan Peleton wajib menyampaikan arahan bertema resmi LBB Mu'allimin 2027;\n`;
    }
    text += `b. Gerakan materi dilaksanakan secara berurutan sesuai nomor urut;\n`;
    text += `c. Materi gerakan berantai bertanda strip ( – ) wajib dilaksanakan satu rangkaian tanpa gerakan tambahan;\n`;
    text += `d. Gerakan penyesuaian diperbolehkan (Hadap, Balik Kanan, Langkah Terbatas) dan dinilai dalam Penguasaan Lapangan Komandan Peleton;\n`;
    text += `e. Berpedoman pada Perpang TNI No. 58 & 57 Tahun 2018 (Hormat Kanan No. 45 Tahun 2014).\n`;
    text += `========================================================\n`;
    return text;
  }

  const handleCopy = (level) => {
    const text = generateTextMateri(level);
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedLevel(level);
      setTimeout(() => setCopiedLevel(null), 2500);
    }
  };

  return (
    <section className="rounded-[28px] border border-slate-200/90 bg-white p-5 sm:p-7 shadow-[0_18px_46px_rgba(15,23,42,0.06)] space-y-6">
      {/* 1. Header Tab */}
      <div className="flex flex-col gap-4 border-b border-slate-100 pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3.5">
          <span className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/20">
            <BookOpen className="w-6 h-6 text-white" />
            <span className="absolute -right-1 -top-1 h-3.5 w-3.5 rounded-full border-2 border-white bg-red-600" />
          </span>
          <div>
            <p className="text-[9px] font-black uppercase tracking-[0.18em] text-amber-600">
              REGULASI MATERI & TEMA LOMBA
            </p>
            <h2 className="mt-0.5 text-lg font-black tracking-tight text-slate-950 sm:text-xl">
              Materi Gerakan Wajib & Tema Resmi 2027
            </h2>
            <p className="mt-0.5 text-[10px] sm:text-xs text-slate-500">
              Pedoman urutan PBB Perpang TNI dan amanat tema Komandan Peleton di arena.
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => handleCopy(selectedLevel)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-950 text-xs font-bold transition shadow-2xs cursor-pointer active:scale-95"
            title="Salin Teks Materi Gerakan ke Clipboard"
          >
            {copiedLevel === selectedLevel ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700">Tersalin!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-500" />
                <span>Salin Materi</span>
              </>
            )}
          </button>

          {DOWNLOADS?.JUKNIS && (
            <a
              href={DOWNLOADS.JUKNIS}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition shadow-xs cursor-pointer active:scale-95"
              title="Unduh Berkas PDF Juknis Resmi"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Unduh Juknis</span>
            </a>
          )}
        </div>
      </div>

      {/* 2. Sub-Tab Switcher: Materi Gerakan & Tema vs Baca Perpang TNI */}
      <div className="flex p-1.5 bg-slate-100 rounded-2xl border border-slate-200/80 gap-1.5">
        <button
          type="button"
          onClick={() => setActiveSubTab('materi')}
          className={`flex-1 py-2 sm:py-2.5 px-2 sm:px-4 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer whitespace-nowrap ${
            activeSubTab === 'materi'
              ? 'bg-white text-slate-950 shadow-sm border border-slate-200/60'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
        >
          <BookOpen className={`w-4 h-4 shrink-0 ${activeSubTab === 'materi' ? 'text-amber-500' : 'text-slate-400'}`} />
          <span className="hidden sm:inline">Materi Gerakan & Tema 2027</span>
          <span className="sm:hidden">Materi & Tema</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('perpang')}
          className={`flex-1 py-2 sm:py-2.5 px-2 sm:px-4 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer whitespace-nowrap ${
            activeSubTab === 'perpang'
              ? 'bg-white text-slate-950 shadow-sm border border-slate-200/60'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
        >
          <Scale className={`w-4 h-4 shrink-0 ${activeSubTab === 'perpang' ? 'text-red-600' : 'text-slate-400'}`} />
          <span className="hidden sm:inline">Baca Dokumen Perpang TNI</span>
          <span className="sm:hidden">Dokumen Perpang</span>
          <span className={`hidden sm:inline-block px-2 py-0.5 rounded-full text-[9px] font-bold ${activeSubTab === 'perpang' ? 'bg-red-100 text-red-700' : 'bg-slate-200 text-slate-600'}`}>
            3 PDF Resmi
          </span>
        </button>
      </div>

      {activeSubTab === 'perpang' ? (
        <div className="pt-2 animate-in fade-in duration-200">
          <BacaPerpangTab embedded={true} />
        </div>
      ) : (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* 3. Official Theme Hero Banner */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950 p-5 sm:p-7 text-white shadow-xl border border-amber-500/20">
        <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-amber-500/10 blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-300 text-[10px] font-black uppercase tracking-wider">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>Tema Resmi LBB Mu'allimin 2027</span>
            </div>
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-black uppercase tracking-tight text-white leading-tight">
              &ldquo;Semangat Sebagai Ksatria, Berjuang Dengan Gembira&rdquo;
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
              Tema ini menjadi pedoman bagi seluruh peserta dalam mengikuti perlombaan. Setiap peleton diharapkan menjunjung tinggi sportivitas, menjaga sikap, menaati peraturan, serta menunjukkan kekompakan dan semangat selama perlombaan berlangsung.
            </p>
          </div>

          {/* Badge Arahan Danton */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-4 backdrop-blur-xs md:max-w-xs shrink-0 space-y-2">
            <p className="text-[10px] font-black uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5" />
              <span>Amanat Komandan Peleton</span>
            </p>
            <p className="text-[11px] text-slate-200 leading-snug">
              {isSD ? (
                <>
                  Pada <strong>Gerakan #25</strong> (<em>Untuk Perhatian, Istirahat di Tempat</em>), Danton menyampaikan inti tema lomba dengan jelas, tegas, dan penuh penghayatan.
                </>
              ) : (
                <>
                  Pada <strong>Gerakan #20</strong> (<em>Berhimpun</em>), Danton menyampaikan inti tema lomba dengan jelas, tegas, dan penuh penghayatan sebelum mengakhiri materi berhimpun.
                </>
              )}
            </p>
            <div className="text-[9.5px] text-amber-300/90 font-bold bg-amber-400/10 px-2.5 py-1 rounded-lg border border-amber-400/20">
              Bobot Penguasaan Materi Danton: 35%
            </div>
          </div>
        </div>
      </div>

      {/* 3. Jenjang Header & Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
        {hasTeamJenjang ? (
          /* Khusus Peserta: Hanya tampilkan jenjang timnya (SD tampil SD saja, SMP tampil SMP saja) */
          <div className="w-full sm:w-auto">
            <div className={`w-full sm:w-auto inline-flex flex-wrap sm:flex-nowrap items-center justify-between sm:justify-start gap-2 sm:gap-2.5 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-2xl text-white text-xs font-black shadow-sm ${
              isSD ? 'bg-red-700' : 'bg-blue-700'
            }`}>
              <span className="whitespace-nowrap">Materi Lomba Tingkat {isSD ? 'SD / MI' : 'SMP / MTs'}</span>
              <span className={`text-[10px] px-2.5 py-0.5 rounded-full whitespace-nowrap shrink-0 ${
                isSD ? 'bg-red-900/60' : 'bg-blue-900/60'
              }`}>
                {isSD ? '26 Gerakan Wajib' : '28 Gerakan Wajib'}
              </span>
            </div>
          </div>
        ) : (
          /* Fallback umum jika tidak terikat kontingen */
          <div className="flex items-center gap-2 p-1.5 bg-slate-100 rounded-2xl max-w-md border border-slate-200/80">
            <button
              type="button"
              onClick={() => setSelectedLevel('SD')}
              className={`flex-1 py-2 px-4 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-2 ${
                isSD
                  ? 'bg-red-700 text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <span>Tingkat SD / MI</span>
              <span className={`text-[9.5px] px-2 py-0.5 rounded-full ${isSD ? 'bg-red-900/60 text-white' : 'bg-slate-200 text-slate-700'}`}>
                26 Gerakan
              </span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedLevel('SMP')}
              className={`flex-1 py-2 px-4 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-2 ${
                !isSD
                  ? 'bg-blue-700 text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <span>Tingkat SMP / MTs</span>
              <span className={`text-[9.5px] px-2 py-0.5 rounded-full ${!isSD ? 'bg-blue-900/60 text-white' : 'bg-slate-200 text-slate-700'}`}>
                28 Gerakan
              </span>
            </button>
          </div>
        )}

        <div className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
          <span>Jenjang Kontingen: <strong className="text-slate-900">{isSD ? 'SD / MI' : 'SMP / MTs'}</strong></span>
        </div>
      </div>

      {/* 4. Arena Spec & Durasi Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-3.5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-100 text-red-700 flex items-center justify-center shrink-0">
            <Ruler className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">
              Spesifikasi Arena
            </p>
            <p className="text-xs font-black text-slate-900 truncate">
              {arenaDim}
            </p>
            <p className="text-[10px] text-slate-500 truncate">{arenaName}</p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-3.5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
            <Timer className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">
              Durasi Maksimal
            </p>
            <p className="text-xs font-black text-slate-900">
              {maxDuration}
            </p>
            <p className="text-[10px] text-slate-500">Penalti -20 poin / 30 detik lebih</p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-3.5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
            <Layers className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">
              Regulasi Rujukan
            </p>
            <p className="text-xs font-black text-slate-900 truncate">
              Perpang TNI 58 & 57/2018
            </p>
            <p className="text-[10px] text-slate-500">Hormat Kanan: Perpang 45/2014</p>
          </div>
        </div>
      </div>

      {/* 5. Daftar Materi Gerakan Wajib */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-1 gap-1.5 sm:gap-2">
          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            <h4 className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-900">
              Urutan Gerakan Resmi ({list.length} Gerakan)
            </h4>
            <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full whitespace-nowrap shrink-0">
              Wajib Berurutan
            </span>
          </div>
          <span className="text-[10px] text-slate-400 hidden sm:inline">
            Tanda strip ( – ) = Gerakan berantai wajib satu rangkaian
          </span>
        </div>

        {/* Daftar Gerakan: Kolom 1 (Atas ke Bawah), lanjut Kolom 2 */}
        {(() => {
          const halfCount = Math.ceil(list.length / 2);
          const leftColumn = list.slice(0, halfCount);
          const rightColumn = list.slice(halfCount);

          const renderCard = (materiText, num) => {
            const isBerantai = materiText.includes('–') || materiText.includes('-');
            const isThemeMovement = materiText.includes('**');
            const isStartEnd = num === 1 || num === list.length;

            return (
              <div
                key={`${materiText}-${num}`}
                className={`relative flex items-start gap-3 rounded-2xl border p-3 transition-all ${
                  isThemeMovement
                    ? 'border-amber-300 bg-amber-50/60 shadow-xs'
                    : isStartEnd
                    ? 'border-red-200 bg-red-50/40'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-2xs'
                }`}
              >
                {/* Nomor Urut */}
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-xl text-xs font-black shadow-2xs ${
                    isThemeMovement
                      ? 'bg-amber-500 text-white'
                      : isStartEnd
                      ? 'bg-red-700 text-white'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {String(num).padStart(2, '0')}
                </span>

                {/* Deskripsi Gerakan */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <p className="text-xs font-bold text-slate-900 leading-snug">
                      {materiText.replace(/\*\*/g, '')}
                    </p>
                    {isThemeMovement && (
                      <span className="inline-flex items-center gap-1 text-[8.5px] font-black uppercase tracking-wider text-amber-800 bg-amber-200/80 px-2 py-0.5 rounded-md">
                        <Sparkles className="w-2.5 h-2.5 text-amber-700" />
                        Amanat Tema
                      </span>
                    )}
                    {isBerantai && !isThemeMovement && (
                      <span className="text-[8.5px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded-md">
                        Berangkai
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          };

          return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 items-start">
              {/* Kolom 1 (Urutan 1 ke bawah) */}
              <div className="space-y-2.5">
                {leftColumn.map((materiText, i) => renderCard(materiText, i + 1))}
              </div>

              {/* Kolom 2 (Lanjutan urutan ke bawah) */}
              <div className="space-y-2.5">
                {rightColumn.map((materiText, i) => renderCard(materiText, halfCount + i + 1))}
              </div>
            </div>
          );
        })()}
      </div>

          {/* 6. Catatan Teknis Gerakan Penyesuaian & Kotak Danton */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50/90 p-4 space-y-2.5 text-xs text-slate-600">
            <div className="flex items-center gap-2 font-black text-slate-900 uppercase tracking-wider text-[11px]">
              <Info className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Aturan Teknis Gerakan Penyesuaian & Batas Kotak Danton</span>
            </div>
            <ul className="list-disc pl-5 space-y-1 text-[11px] leading-relaxed">
              <li>
                <strong>Gerakan Penyesuaian:</strong> Danton diperkenankan melakukan gerakan penyesuaian (Hadap Kanan/Kiri/Serong, Balik Kanan, Langkah Terbatas) untuk merapikan formasi peleton di arena. Namun, penggunaannya berpengaruh langsung terhadap penilaian aspek <em>Penguasaan Lapangan</em> Danton.
              </li>
              <li>
                <strong>Batas Garis Mutlak (Dinding Imajiner):</strong> Kotak Danton berukuran 1,5m × 1,5m menghadap Dewan Juri. Dilarang menginjak atau melangkah keluar kotak kecuali pada materi berhimpun, bubar, atau perhatian istirahat di tempat.
              </li>
              <li>
                <strong>Pelarangan Spikes/Pines:</strong> Dilarang keras menggunakan pines, paku payung, spikes, atau pul logam pada alas sepatu yang dapat merusak lapangan.
              </li>
            </ul>
          </div>
        </div>
      )}
    </section>
  );
}
