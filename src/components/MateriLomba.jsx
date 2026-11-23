import React, { useState, useMemo } from 'react';
import {
  Ruler,
  Copy,
  Check,
  FileDown,
  Map,
  Timer,
  Info,
  School,
  GraduationCap,
  Search,
  X,
  Maximize2,
  MapPin,
  Link2,
  RefreshCw,
  BookOpen,
} from 'lucide-react';
import { COMPETITION, MATERIALS } from '../config.js';

const LEVEL_CONFIG = {
  SD: {
    id: 'SD',
    label: 'SD / MI Sederajat',
    shortLabel: 'Tingkat SD / MI',
    arenaShort: 'Lap. Basket (Arena 1)',
    size: '25 × 14 m',
    duration: '8 Menit',
    specLabel: COMPETITION.SD.ARENA_SPEC_LABEL,
    substitution: COMPETITION.SD.SUBSTITUTION_LABEL,
    pdfUrl:
      COMPETITION.SD.MATERI_URL ||
      'https://drive.google.com/file/d/10ok02901aIjpoHAvWdanzMK5aW9cx3Js/view?usp=sharing',
    posImage: '/pos-sd.png',
    posAlt: 'Denah Pos Arena SD/MI 25×14 Meter',
    materials: MATERIALS.SD,
    specialNote:
      '**Untuk Perhatian, Istirahat di Tempat: Komandan Peleton memberi arahan dengan tema LBB Mu’allimin 2027.',
    icon: School,
    activeTab: 'bg-red-700 text-white shadow-md shadow-red-900/20',
    accentText: 'text-red-700',
    accentSoft: 'bg-red-50 text-red-700 border-red-200',
    accentBtn: 'bg-red-700 hover:bg-red-800 text-white',
    hoverRow: 'hover:bg-red-50/40',
    numActive: 'bg-red-50 text-red-700 border-red-200/80',
  },
  SMP: {
    id: 'SMP',
    label: 'SMP / MTs Sederajat',
    shortLabel: 'Tingkat SMP / MTs',
    arenaShort: 'Pelataran Embung (Arena 2)',
    size: '26 × 15 m',
    duration: '12 Menit',
    specLabel: COMPETITION.SMP.ARENA_SPEC_LABEL,
    substitution: COMPETITION.SMP.SUBSTITUTION_LABEL,
    pdfUrl:
      COMPETITION.SMP.MATERI_URL ||
      'https://drive.google.com/file/d/1YLVhlAGhLN2L0iwgkq5bM6WqJsgdrbjV/view?usp=sharing',
    posImage: '/pos-smp.png',
    posAlt: 'Denah Pos Arena SMP/MTs 26×15 Meter',
    materials: MATERIALS.SMP,
    specialNote:
      '**Materi Berhimpun: Komandan Peleton memberi arahan dengan tema LBB Mu’allimin 2027.',
    icon: GraduationCap,
    activeTab: 'bg-blue-700 text-white shadow-md shadow-blue-900/20',
    accentText: 'text-blue-700',
    accentSoft: 'bg-blue-50 text-blue-700 border-blue-200',
    accentBtn: 'bg-blue-700 hover:bg-blue-800 text-white',
    hoverRow: 'hover:bg-blue-50/40',
    numActive: 'bg-blue-50 text-blue-700 border-blue-200/80',
  },
};

export default function MateriLomba() {
  const [activeLevel, setActiveLevel] = useState('SD');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedLevel, setCopiedLevel] = useState(null);
  const [isZoomOpen, setIsZoomOpen] = useState(false);

  const current = LEVEL_CONFIG[activeLevel];

  function generateTextMateri(level) {
    const isSD = level === 'SD';
    const title = isSD
      ? 'MATERI LOMBA TINGKAT SD/MI SEDERAJAT'
      : 'MATERI LOMBA TINGKAT SMP/MTS SEDERAJAT';
    const spec = isSD ? COMPETITION.SD.ARENA_SPEC_LABEL : COMPETITION.SMP.ARENA_SPEC_LABEL;
    const list = isSD ? MATERIALS.SD : MATERIALS.SMP;

    let text = `========================================================\n`;
    text += `${title}\n`;
    text += `LOMBA BARIS - BERBARIS MU'ALLIMIN TAHUN 2027\n`;
    text += `${spec}\n`;
    text += `========================================================\n\n`;
    text += `URUTAN GERAKAN MATERI LOMBA:\n`;
    list.forEach((item, idx) => {
      text += `${idx + 1}. ${item}\n`;
    });
    text += `\nKETERANGAN:\n`;
    if (isSD) {
      text += `a. **Untuk Perhatian, Istirahat di Tempat Komandan Peleton memberi arahan dengan tema LBB Mu’allimin 2027;\n`;
    } else {
      text += `a. **Materi Berhimpun Komandan Peleton memberi arahan dengan tema LBB Mu’allimin 2027;\n`;
    }
    text += `b. Gerakan materi dilaksanakan secara berurutan sesuai nomor;\n`;
    text += `c. Materi gerakan berantai bertanda strip ( – ) wajib dilaksanakan satu rangkaian tanpa gerakan tambahan;\n`;
    text += `d. Materi gerakan lomba sudah dibuat runtut. Komandan Peleton diperbolehkan melakukan gerakan penyesuaian tanpa pembatasan jumlah, namun penggunaannya berpengaruh langsung terhadap penilaian aspek Penguasaan Lapangan Komandan Peleton;\n`;
    text += `e. Kebenaran teknik gerakan berpedoman pada Perpang TNI No. 58 dan 57 Tahun 2018, khusus pelaksanaan Hormat Kanan berpedoman pada Perpang TNI No. 45 Tahun 2014.\n`;
    text += `========================================================\n`;
    return text;
  }

  function handleCopy(level) {
    const text = generateTextMateri(level);
    navigator.clipboard?.writeText(text);
    setCopiedLevel(level);
    setTimeout(() => setCopiedLevel(null), 2500);
  }

  const filteredMaterials = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return current.materials
      .map((item, idx) => ({ num: idx + 1, text: item }))
      .filter(entry => !q || entry.text.toLowerCase().includes(q) || String(entry.num) === q);
  }, [current.materials, searchQuery]);

  const generalNotes = [
    current.specialNote,
    'Gerakan materi dilaksanakan secara berurutan sesuai nomor.',
    'Gerakan berangkai bertanda strip ( – ) wajib dilaksanakan dalam satu rangkaian tanpa jeda atau gerakan tambahan.',
    'Danton diperbolehkan melakukan gerakan penyesuaian tanpa batas jumlah, namun berpengaruh langsung pada aspek Penguasaan Lapangan.',
    'Acuan teknik: Perpang TNI No. 58 & 57 Tahun 2018 (khusus Hormat Kanan: Perpang TNI No. 45 Tahun 2014).',
  ];

  return (
    <section
      id="materi-lomba"
      className="py-20 lg:py-28 bg-slate-50 relative overflow-hidden font-sans border-t border-slate-200 text-slate-800"
    >
      {/* Subtle Architectural Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:20px_20px] opacity-45 pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 relative z-10 max-w-6xl">
        {/* ========================================================
            1. SECTION HEADER + JENJANG SWITCHER
            ======================================================== */}
        <div className="mb-10 lg:mb-12 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-slate-200 text-slate-700 text-xs font-semibold uppercase tracking-wider mb-4 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-red-600" />
            <span>Regulasi Resmi PBB</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 uppercase tracking-tight leading-tight">
            Materi <span className="text-red-700">Lomba 2027</span>
          </h2>
          <div className="w-16 h-1 bg-red-700 mx-auto mt-4 rounded-full" />
          <p className="text-slate-600 max-w-2xl mx-auto text-sm sm:text-base mt-4 leading-relaxed">
            Urutan gerakan wajib baris-berbaris dan spesifikasi pos arena sesuai Petunjuk Teknis Resmi LBB Mu’allimin 2027.
          </p>

          {/* Segmented Jenjang Switcher */}
          <div className="mt-7 inline-flex p-1.5 rounded-2xl bg-white border border-slate-200 shadow-sm">
            {Object.values(LEVEL_CONFIG).map(lvl => {
              const Icon = lvl.icon;
              const isActive = activeLevel === lvl.id;
              return (
                <button
                  key={lvl.id}
                  type="button"
                  onClick={() => {
                    setActiveLevel(lvl.id);
                    setSearchQuery('');
                  }}
                  className={`px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all flex items-center gap-2 cursor-pointer ${
                    isActive ? lvl.activeTab : 'text-slate-600 hover:text-slate-950'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{lvl.shortLabel}</span>
                  <span
                    className={`hidden sm:inline text-[10px] font-mono px-1.5 py-0.5 rounded-md ${
                      isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {lvl.materials.length}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ========================================================
            2. SIDE-BY-SIDE SPLIT: URUTAN GERAKAN (7 COLS) + DENAH POS (5 COLS)
            ======================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 lg:gap-8 items-start">
          {/* LEFT COLUMN: OFFICIAL MOVEMENT LIST (7 Cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
            {/* Toolbar Header */}
            <div className="p-5 sm:p-6 border-b border-slate-100 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wider border mb-1.5 ${current.accentSoft}`}
                  >
                    {current.label} · {current.materials.length} Gerakan
                  </span>
                  <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                    Urutan Gerakan Wajib PBB
                  </h3>
                </div>

                {/* Copy & Download PDF Actions */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleCopy(activeLevel)}
                    className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-950 text-xs font-bold transition-all inline-flex items-center gap-1.5 cursor-pointer active:scale-95"
                    title="Salin teks materi ke papan klip"
                  >
                    {copiedLevel === activeLevel ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700">Tersalin</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-slate-500" />
                        <span>Salin</span>
                      </>
                    )}
                  </button>

                  <a
                    href={current.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all inline-flex items-center gap-1.5 shadow-sm active:scale-95 no-underline ${current.accentBtn}`}
                  >
                    <FileDown className="w-3.5 h-3.5" />
                    <span>Unduh PDF</span>
                  </a>
                </div>
              </div>

              {/* Compact Search Bar */}
              <div className="relative flex items-center">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder={`Cari gerakan ${current.shortLabel} (misal: hormat, bubar, langkah tegap, lari)...`}
                  className="w-full pl-10 pr-16 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs sm:text-sm placeholder-slate-400 focus:bg-white focus:outline-none focus:border-slate-400 transition-all"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 text-[11px] font-bold text-slate-500 hover:text-slate-900 px-2 py-0.5 bg-slate-200/80 rounded-md cursor-pointer inline-flex items-center gap-1"
                  >
                    <X className="w-3 h-3" />
                    <span>Reset</span>
                  </button>
                )}
              </div>
            </div>

            {/* Clean Editorial List */}
            {filteredMaterials.length === 0 ? (
              <div className="p-10 text-center text-slate-500 text-sm">
                Gerakan "<span className="font-bold text-slate-800">{searchQuery}</span>" tidak ditemukan pada daftar {current.shortLabel}.
              </div>
            ) : (
              <ol className="divide-y divide-slate-100">
                {filteredMaterials.map(entry => {
                  const isChained =
                    entry.text.includes('–') || entry.text.includes(' - ');
                  const isBubar = /\bbubar\b/i.test(entry.text);

                  return (
                    <li
                      key={entry.num}
                      className={`px-5 sm:px-6 py-3 flex items-start sm:items-center justify-between gap-3 transition-colors ${
                        isBubar ? 'bg-amber-50/70' : current.hoverRow
                      }`}
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        <span
                          className={`w-7 h-6 rounded-md border text-[11px] font-black font-mono flex items-center justify-center shrink-0 mt-0.5 sm:mt-0 ${
                            isBubar
                              ? 'bg-amber-100 text-amber-800 border-amber-300'
                              : current.numActive
                          }`}
                        >
                          {String(entry.num).padStart(2, '0')}
                        </span>
                        <span className="text-xs sm:text-sm font-medium text-slate-800 leading-snug">
                          {entry.text}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        {isBubar && (
                          <span
                            className="inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 border border-amber-300 whitespace-nowrap"
                            title="Jeda sah pergantian pasukan cadangan"
                          >
                            <RefreshCw className="w-2.5 h-2.5" />
                            <span>Ganti Cadangan</span>
                          </span>
                        )}
                        {isChained && !isBubar && (
                          <span
                            className="hidden sm:inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-500 whitespace-nowrap"
                            title="Gerakan berangkai wajib satu kesatuan tanpa jeda"
                          >
                            <Link2 className="w-2.5 h-2.5" />
                            <span>Berangkai</span>
                          </span>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ol>
            )}
          </div>

          {/* RIGHT COLUMN: STICKY DENAH POS + SPECS + KETERANGAN (5 Cols) */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-5">
            {/* Card 1: Denah Pos & Spesifikasi */}
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-5 sm:p-6 space-y-4">
              <div className="flex items-center justify-between gap-2 pb-3.5 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <span className={`p-2 rounded-xl border shrink-0 ${current.accentSoft}`}>
                    <Map className="w-4 h-4" />
                  </span>
                  <div>
                    <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">
                      Denah &amp; Spesifikasi Pos
                    </h4>
                    <span className={`text-[11px] font-bold block ${current.accentText}`}>
                      {current.label}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsZoomOpen(true)}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold transition-colors cursor-pointer"
                  title="Perbesar denah pos"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>Zoom</span>
                </button>
              </div>

              {/* 3 Compact Spec Pills */}
              <div className="grid grid-cols-3 gap-2">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                  <span className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-1">
                    <Ruler className="w-3 h-3" />
                    Ukuran
                  </span>
                  <span className="text-xs font-black text-slate-900 block mt-0.5 font-mono">
                    {current.size}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                  <span className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-1">
                    <Timer className="w-3 h-3" />
                    Durasi
                  </span>
                  <span className="text-xs font-black text-slate-900 block mt-0.5 font-mono">
                    {current.duration}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                  <span className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    Lokasi
                  </span>
                  <span
                    className="text-[11px] font-extrabold text-slate-900 block mt-0.5 truncate"
                    title={current.arenaShort}
                  >
                    {current.arenaShort}
                  </span>
                </div>
              </div>

              {/* Arena Diagram Image */}
              <button
                type="button"
                onClick={() => setIsZoomOpen(true)}
                className="w-full bg-slate-50 rounded-2xl p-3 border border-slate-200/90 hover:border-slate-300 transition-all overflow-hidden group cursor-zoom-in block"
              >
                <img
                  key={current.id}
                  src={current.posImage}
                  alt={current.posAlt}
                  className="w-full max-h-[280px] object-contain mx-auto transition-transform duration-300 group-hover:scale-[1.02]"
                  loading="lazy"
                />
              </button>

              {/* Substitution Window Highlight */}
              <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-amber-50 border border-amber-200/90">
                <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <p className="text-xs text-slate-700 leading-relaxed">
                  <strong className="text-amber-900">Pergantian Cadangan:</strong> Dilakukan di dalam pos{' '}
                  <strong className="text-slate-900">{current.substitution}</strong> (stopwatch tetap berjalan).
                </p>
              </div>
            </div>

            {/* Card 2: Keterangan & Pedoman Perpang */}
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-5 sm:p-6 space-y-3">
              <div className="flex items-center gap-2 pb-2.5 border-b border-slate-100">
                <BookOpen className="w-4 h-4 text-slate-500" />
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-900">
                  Keterangan &amp; Pedoman Teknis
                </h4>
              </div>

              <ul className="space-y-2 text-xs text-slate-600 leading-relaxed">
                {generalNotes.map((note, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="font-mono font-bold text-slate-400 shrink-0">
                      {String.fromCharCode(97 + idx)}.
                    </span>
                    <span>{note}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox Zoom Modal for Denah Pos */}
      {isZoomOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setIsZoomOpen(false)}
        >
          <div
            className="bg-white rounded-3xl max-w-4xl w-full p-4 sm:p-6 shadow-2xl space-y-4"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <h4 className="text-sm sm:text-base font-black text-slate-900 uppercase">
                  Denah Pos Arena — {current.label}
                </h4>
                <p className="text-xs text-slate-500">{current.specLabel}</p>
              </div>
              <button
                type="button"
                onClick={() => setIsZoomOpen(false)}
                className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center cursor-pointer"
                aria-label="Tutup pratinjau denah"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="bg-slate-50 rounded-2xl p-3 border border-slate-200">
              <img
                src={current.posImage}
                alt={current.posAlt}
                className="w-full max-h-[75vh] object-contain mx-auto"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
