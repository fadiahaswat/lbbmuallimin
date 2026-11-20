import React, { useState, useEffect, useMemo } from 'react';
import {
  BookOpen,
  Sparkles,
  Copy,
  Check,
  Timer,
  Ruler,
  Award,
  Layers,
  Scale,
  ArrowLeftRight,
  Search,
  Compass,
  Maximize2,
  ShieldAlert
} from 'lucide-react';
import { COMPETITION, MATERIALS } from '../../../../config.js';
import BacaPerpangTab from './BacaPerpangTab.jsx';

export default function MateriTemaTab({ currentTeam, initialSubTab = 'materi' }) {
  const [activeSubTab, setActiveSubTab] = useState(initialSubTab); // 'materi' | 'perpang'
  const hasTeamJenjang = Boolean(currentTeam?.jenjang);
  const teamJenjang = currentTeam?.jenjang === 'SMP' ? 'SMP' : 'SD';
  const [selectedLevel, setSelectedLevel] = useState(teamJenjang);
  const [copiedLevel, setCopiedLevel] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [movementFilter, setMovementFilter] = useState('all'); // 'all' | 'berangkai' | 'khusus'

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
  const arenaName = isSD ? 'Arena 1: Lapangan Basket Kampus Sedayu' : 'Arena 2: Pelataran Embung Kampus Sedayu';
  const arenaDim = isSD ? '25m × 14m' : '26m × 15m';
  const maxDuration = isSD ? '8 Menit' : '12 Menit';
  const subMovementNum = isSD ? 16 : 19;
  const themeMovementNum = isSD ? 25 : 20;

  const indexedMovements = useMemo(() => {
    return list.map((materiText, idx) => {
      const num = idx + 1;
      const isBerantai = materiText.includes('–') || materiText.includes('-');
      const isThemeMovement = materiText.includes('**') || num === themeMovementNum;
      const isStartEnd = num === 1 || num === list.length;
      const isSubMovement = num === subMovementNum;
      const cleanText = materiText.replace(/\*\*/g, '');
      return {
        num,
        materiText,
        cleanText,
        isBerantai,
        isThemeMovement,
        isStartEnd,
        isSubMovement,
        isSpecial: isStartEnd || isSubMovement || isThemeMovement,
      };
    });
  }, [list, subMovementNum, themeMovementNum]);

  const filteredMovements = useMemo(() => {
    return indexedMovements.filter(item => {
      if (movementFilter === 'berangkai' && !item.isBerantai) return false;
      if (movementFilter === 'khusus' && !item.isSpecial) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const numStr = String(item.num).padStart(2, '0');
        if (!item.cleanText.toLowerCase().includes(q) && !numStr.includes(q)) return false;
      }
      return true;
    });
  }, [indexedMovements, movementFilter, searchQuery]);

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
      text += `${idx + 1}. ${item.replace(/\*\*/g, '')}\n`;
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

  const berantaiCount = indexedMovements.filter(m => m.isBerantai).length;

  return (
    <section className="space-y-4">
      {/* ============================================================== */}
      {/* 1. CLEAN COMPACT HEADER & SUB-TAB BAR                          */}
      {/* ============================================================== */}
      <div className="rounded-3xl bg-white border border-slate-200/90 px-5 sm:px-6 py-4 shadow-[0_10px_28px_rgba(15,23,42,0.04)] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-amber-400 shadow-2xs">
            <BookOpen className="w-5 h-5" />
          </span>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base sm:text-lg font-black tracking-tight text-slate-950 leading-tight">
                Materi Gerakan &amp; Regulasi PBB
              </h2>
              {hasTeamJenjang ? (
                <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md border shrink-0 ${
                  isSD
                    ? 'bg-rose-50 text-rose-700 border-rose-200'
                    : 'bg-blue-50 text-blue-700 border-blue-200'
                }`}>
                  {isSD ? 'SD / MI · 26 Gerakan' : 'SMP / MTs · 28 Gerakan'}
                </span>
              ) : (
                <div className="inline-flex items-center p-0.5 rounded-lg bg-slate-100 border border-slate-200 text-[10px] font-bold">
                  <button
                    type="button"
                    onClick={() => setSelectedLevel('SD')}
                    className={`px-2 py-0.5 rounded-md transition cursor-pointer ${isSD ? 'bg-rose-600 text-white' : 'text-slate-600 hover:text-slate-950'}`}
                  >
                    SD / MI
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedLevel('SMP')}
                    className={`px-2 py-0.5 rounded-md transition cursor-pointer ${!isSD ? 'bg-blue-600 text-white' : 'text-slate-600 hover:text-slate-950'}`}
                  >
                    SMP / MTs
                  </button>
                </div>
              )}
            </div>
            <p className="text-[11.5px] text-slate-500 truncate mt-0.5">
              Pedoman urutan PBB Perpang TNI &amp; amanat tema Komandan Peleton LBB Mu'allimin 2027
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="inline-flex items-center p-1 rounded-xl bg-slate-100 border border-slate-200/80">
            <button
              type="button"
              onClick={() => setActiveSubTab('materi')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                activeSubTab === 'materi'
                  ? 'bg-slate-950 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-950'
              }`}
            >
              <BookOpen className={`w-3.5 h-3.5 ${activeSubTab === 'materi' ? 'text-amber-400' : 'text-slate-400'}`} />
              <span>Materi &amp; Tema</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveSubTab('perpang')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                activeSubTab === 'perpang'
                  ? 'bg-slate-950 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-950'
              }`}
            >
              <Scale className={`w-3.5 h-3.5 ${activeSubTab === 'perpang' ? 'text-rose-400' : 'text-slate-400'}`} />
              <span>Dokumen Perpang</span>
            </button>
          </div>

          {activeSubTab === 'materi' && (
            <button
              type="button"
              onClick={() => handleCopy(selectedLevel)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-950 text-xs font-bold transition shadow-2xs cursor-pointer active:scale-95"
              title="Salin Daftar Materi Gerakan ke Clipboard"
            >
              {copiedLevel === selectedLevel ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Tersalin</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-500" />
                  <span className="hidden sm:inline">Salin Materi</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* ============================================================== */}
      {/* 2. MAIN CONTENT: DOKUMEN PERPANG vs MATERI & TEMA              */}
      {/* ============================================================== */}
      {activeSubTab === 'perpang' ? (
        <div className="rounded-3xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-[0_12px_32px_rgba(15,23,42,0.05)] animate-in fade-in duration-200">
          <BacaPerpangTab embedded={true} />
        </div>
      ) : (
        <div className="space-y-4 animate-in fade-in duration-200">
          {/* Unified 2-Tier Dark Obsidian Theme & Specs Card */}
          <div className="rounded-3xl bg-slate-950 border border-slate-800/90 text-white shadow-[0_16px_40px_rgba(15,23,42,0.14)] overflow-hidden">
            {/* Tier 1: Theme Hero + Amanat Danton */}
            <div className="relative px-5 sm:px-7 py-5 sm:py-6 border-b border-slate-800/90 bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950/60 overflow-hidden">
              <div className="absolute -right-12 -top-12 h-44 w-44 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
              <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                <div className="space-y-2 max-w-2xl">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-300 text-[10px] font-black uppercase tracking-wider">
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    <span>Tema Resmi LBB Mu'allimin 2027</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl lg:text-[26px] font-black uppercase tracking-tight text-white leading-snug">
                    &ldquo;Semangat Sebagai Ksatria, Berjuang Dengan Gembira&rdquo;
                  </h3>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-4 lg:max-w-sm shrink-0 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5" />
                      <span>Amanat Komandan Peleton</span>
                    </span>
                    <span className="text-[9.5px] font-mono font-bold text-amber-200 bg-amber-400/15 border border-amber-400/25 px-2 py-0.5 rounded-md">
                      Bobot 35%
                    </span>
                  </div>
                  <p className="text-[11.5px] text-slate-300 leading-relaxed">
                    {isSD ? (
                      <>
                        Disampaikan pada <strong className="text-white">Gerakan #25</strong> (<em>Untuk Perhatian, Istirahat di Tempat</em>) secara jelas, tegas, dan penuh penghayatan.
                      </>
                    ) : (
                      <>
                        Disampaikan pada <strong className="text-white">Gerakan #20</strong> (<em>Berhimpun</em>) secara jelas, tegas, dan penuh penghayatan sebelum mengakhiri materi berhimpun.
                      </>
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* Tier 2: Integrated 3-Column Arena & Regulation Specs */}
            <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-slate-800/90 bg-slate-950">
              <div className="px-5 py-3.5 flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${
                  isSD ? 'bg-rose-500/10 border-rose-500/25 text-rose-400' : 'bg-blue-500/10 border-blue-500/25 text-blue-400'
                }`}>
                  <Ruler className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-[9.5px] font-black uppercase tracking-wider text-slate-500">Spesifikasi Arena</p>
                  <p className="text-xs font-mono font-black text-white">{arenaDim}</p>
                  <p className="text-[10.5px] text-slate-400 truncate">{arenaName}</p>
                </div>
              </div>

              <div className="px-5 py-3.5 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-400 flex items-center justify-center shrink-0">
                  <Timer className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-[9.5px] font-black uppercase tracking-wider text-slate-500">Durasi Maksimal</p>
                  <p className="text-xs font-mono font-black text-white">{maxDuration}</p>
                  <p className="text-[10.5px] text-slate-400 truncate">Penalti -20 poin / 30 detik lebih</p>
                </div>
              </div>

              <div className="px-5 py-3.5 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-sky-500/10 border border-sky-500/25 text-sky-400 flex items-center justify-center shrink-0">
                  <Layers className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-[9.5px] font-black uppercase tracking-wider text-slate-500">Regulasi Rujukan</p>
                  <p className="text-xs font-black text-white truncate">Perpang TNI 58 &amp; 57/2018</p>
                  <p className="text-[10.5px] text-slate-400 truncate">Hormat Kanan: Perpang 45/2014</p>
                </div>
              </div>
            </div>
          </div>

          {/* Structured 2-Column Movement Ledger */}
          <div className="rounded-3xl border border-slate-200/90 bg-white shadow-[0_12px_32px_rgba(15,23,42,0.05)] overflow-hidden">
            {/* Compact Toolbar: Title + Filter Chips + Search */}
            <div className="px-5 py-3.5 border-b border-slate-200/80 bg-slate-50/70 flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h4 className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-900">
                  Urutan Gerakan Resmi
                </h4>
                <span className="text-[10px] font-mono font-bold text-slate-600 bg-white border border-slate-200 px-2 py-0.5 rounded-full">
                  {list.length} Wajib Berurutan
                </span>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                {/* Quick Filter Pills */}
                <div className="inline-flex items-center p-0.5 rounded-xl bg-slate-200/70 border border-slate-200/80 text-[11px] font-bold">
                  {[
                    { id: 'all', label: `Semua (${list.length})` },
                    { id: 'berangkai', label: `Berangkai (${berantaiCount})` },
                    { id: 'khusus', label: 'Titik Khusus' },
                  ].map(f => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setMovementFilter(f.id)}
                      className={`px-2.5 py-1 rounded-lg transition cursor-pointer whitespace-nowrap ${
                        movementFilter === f.id
                          ? 'bg-slate-900 text-white shadow-2xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>

                {/* Search Input */}
                <div className="relative flex-1 sm:flex-initial">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari gerakan / nomor..."
                    className="pl-8 pr-7 py-1.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 transition-all w-full sm:w-48"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 text-sm cursor-pointer"
                    >
                      ×
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* 2-Column Ledger Body */}
            {filteredMovements.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-400">
                Tidak ada gerakan yang cocok dengan pencarian &ldquo;{searchQuery}&rdquo;.
              </div>
            ) : (() => {
              const halfCount = Math.ceil(filteredMovements.length / 2);
              const leftCol = filteredMovements.slice(0, halfCount);
              const rightCol = filteredMovements.slice(halfCount);

              const renderRow = (item) => (
                <div
                  key={item.num}
                  className={`flex items-center gap-3 px-4 sm:px-5 py-3 transition-colors ${
                    item.isSubMovement
                      ? 'bg-emerald-50/70'
                      : item.isThemeMovement
                      ? 'bg-amber-50/70'
                      : item.isStartEnd
                      ? 'bg-rose-50/40'
                      : 'bg-white hover:bg-slate-50/80'
                  }`}
                >
                  {/* Number Pill */}
                  <span
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg font-mono text-[11px] font-black ${
                      item.isSubMovement
                        ? 'bg-emerald-600 text-white'
                        : item.isThemeMovement
                        ? 'bg-amber-500 text-white'
                        : item.isStartEnd
                        ? 'bg-rose-700 text-white'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {String(item.num).padStart(2, '0')}
                  </span>

                  {/* Movement Title + Milestone Tag */}
                  <div className="flex-1 min-w-0 flex items-center justify-between gap-2">
                    <p className={`text-xs sm:text-[12.5px] leading-snug ${
                      item.isSubMovement
                        ? 'font-black text-emerald-950'
                        : item.isThemeMovement
                        ? 'font-black text-amber-950'
                        : 'font-bold text-slate-800'
                    }`}>
                      {item.cleanText}
                    </p>

                    <div className="flex items-center gap-1 shrink-0">
                      {item.isSubMovement && (
                        <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-100 border border-emerald-300/80 px-2 py-0.5 rounded-full whitespace-nowrap">
                          <ArrowLeftRight className="w-2.5 h-2.5" />
                          <span className="hidden sm:inline">Pergantian Pemain</span>
                          <span className="sm:hidden">Ganti</span>
                        </span>
                      )}
                      {item.isThemeMovement && (
                        <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-wider text-amber-900 bg-amber-200/80 border border-amber-300 px-2 py-0.5 rounded-full whitespace-nowrap">
                          <Sparkles className="w-2.5 h-2.5" />
                          <span>Amanat Tema</span>
                        </span>
                      )}
                      {item.isBerantai && !item.isThemeMovement && !item.isSubMovement && (
                        <span className="text-[9px] font-bold text-slate-500 bg-slate-100 border border-slate-200/80 px-1.5 py-0.5 rounded-md whitespace-nowrap">
                          Berangkai
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );

              return (
                <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-200/80">
                  <div className="divide-y divide-slate-100">
                    {leftCol.map(renderRow)}
                  </div>
                  <div className="divide-y divide-slate-100">
                    {rightCol.map(renderRow)}
                  </div>
                </div>
              );
            })()}

            {/* Subtle Legend Footer */}
            <div className="px-5 py-2.5 border-t border-slate-100 bg-slate-50/70 flex flex-wrap items-center justify-between gap-2 text-[10.5px] text-slate-500">
              <span>Tanda strip (<strong className="text-slate-700">–</strong>) menandakan gerakan berantai wajib dilaksanakan satu rangkaian.</span>
              <span className="font-mono text-slate-400">
                Menampilkan {filteredMovements.length}/{list.length} gerakan
              </span>
            </div>
          </div>

          {/* 3. Technical Rules: Crisp 3-Column Executive Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-2xs space-y-2">
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-200/80 text-amber-600 flex items-center justify-center shrink-0">
                  <Compass className="w-4 h-4" />
                </span>
                <h5 className="text-xs font-black text-slate-900 uppercase tracking-wide">
                  Gerakan Penyesuaian
                </h5>
              </div>
              <p className="text-[11.5px] text-slate-600 leading-relaxed">
                Danton diperkenankan melakukan hadap, balik kanan, atau langkah terbatas untuk merapikan formasi, namun berpengaruh langsung pada nilai <em>Penguasaan Lapangan</em>.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-2xs space-y-2">
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-200/80 text-blue-600 flex items-center justify-center shrink-0">
                  <Maximize2 className="w-4 h-4" />
                </span>
                <h5 className="text-xs font-black text-slate-900 uppercase tracking-wide">
                  Kotak Danton 1,5m × 1,5m
                </h5>
              </div>
              <p className="text-[11.5px] text-slate-600 leading-relaxed">
                Batas garis bersifat mutlak (dinding imajiner) menghadap Dewan Juri. Dilarang menginjak atau keluar kotak kecuali saat berhimpun, bubar, atau perhatian istirahat.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-2xs space-y-2">
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-xl bg-rose-50 border border-rose-200/80 text-rose-600 flex items-center justify-center shrink-0">
                  <ShieldAlert className="w-4 h-4" />
                </span>
                <h5 className="text-xs font-black text-slate-900 uppercase tracking-wide">
                  Pelarangan Spikes / Pines
                </h5>
              </div>
              <p className="text-[11.5px] text-slate-600 leading-relaxed">
                Dilarang keras menggunakan pines, paku payung, spikes, atau pul logam pada alas sepatu yang berpotensi merusak permukaan lapangan lomba.
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
