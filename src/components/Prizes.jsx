import React, { useState } from 'react';
import {
  Crown,
  Trophy,
  Medal,
  Award,
  School,
  GraduationCap,
  CheckCircle2,
  Sparkles,
  Banknote,
  FileBadge,
  ShieldCheck,
  Star,
} from 'lucide-react';
import { PRIZES } from '../config.js';
import RankMedal from './common/RankMedal.jsx';

const DIVISIONS = {
  sd: {
    id: 'sd',
    label: 'SD / MI Sederajat',
    shortLabel: 'Tingkat Dasar',
    rollingTitle: PRIZES.ROLLING_TROPHY_SD,
    icon: School,
    accentPill: 'bg-red-600 text-white shadow-lg shadow-red-900/40',
    accentBorder: 'border-red-500/30',
    accentText: 'text-red-400',
    accentSoftBg: 'bg-red-500/10 border-red-500/25 text-red-300',
    glowClass: 'bg-red-600/15',
  },
  smp: {
    id: 'smp',
    label: 'SMP / MTs Sederajat',
    shortLabel: 'Tingkat Menengah',
    rollingTitle: PRIZES.ROLLING_TROPHY_SMP,
    icon: GraduationCap,
    accentPill: 'bg-blue-600 text-white shadow-lg shadow-blue-900/40',
    accentBorder: 'border-blue-500/30',
    accentText: 'text-blue-400',
    accentSoftBg: 'bg-blue-500/10 border-blue-500/25 text-blue-300',
    glowClass: 'bg-blue-600/15',
  },
};

const MAIN_PODIUM = [
  {
    rank: 1,
    title: 'Juara I Peleton',
    subtitle: 'Peringkat Terbaik 1',
    points: 10,
    rewards: ['Piala Tetap', 'Uang Pembinaan', 'E-Sertifikat'],
    orderClass: 'md:order-2 md:-mt-5',
    cardClass:
      'bg-gradient-to-b from-amber-500/[0.14] via-slate-900/95 to-slate-950 border-amber-400/45 shadow-2xl shadow-amber-950/30',
    topBarClass: 'from-amber-300 via-yellow-400 to-amber-500',
    medalSize: 'w-16 h-16 sm:w-20 sm:h-20',
    badgeClass: 'bg-amber-400/20 text-amber-300 border-amber-400/40',
    featured: true,
  },
  {
    rank: 2,
    title: 'Juara II Peleton',
    subtitle: 'Peringkat Terbaik 2',
    points: 3,
    rewards: ['Piala Tetap', 'Uang Pembinaan', 'E-Sertifikat'],
    orderClass: 'md:order-1',
    cardClass:
      'bg-gradient-to-b from-slate-300/[0.08] via-slate-900/90 to-slate-950 border-slate-400/25 shadow-xl',
    topBarClass: 'from-slate-300 via-slate-100 to-slate-400',
    medalSize: 'w-14 h-14 sm:w-16 sm:h-16',
    badgeClass: 'bg-slate-400/15 text-slate-200 border-slate-400/30',
    featured: false,
  },
  {
    rank: 3,
    title: 'Juara III Peleton',
    subtitle: 'Peringkat Terbaik 3',
    points: 1,
    rewards: ['Piala Tetap', 'Uang Pembinaan', 'E-Sertifikat'],
    orderClass: 'md:order-3',
    cardClass:
      'bg-gradient-to-b from-orange-500/[0.08] via-slate-900/90 to-slate-950 border-orange-400/25 shadow-xl',
    topBarClass: 'from-orange-400 via-amber-600 to-orange-500',
    medalSize: 'w-14 h-14 sm:w-16 sm:h-16',
    badgeClass: 'bg-orange-400/15 text-orange-300 border-orange-400/30',
    featured: false,
  },
];

const HARAPAN_LIST = [
  { rank: 4, label: 'Juara Harapan I' },
  { rank: 5, label: 'Juara Harapan II' },
  { rank: 6, label: 'Juara Harapan III' },
];

const DANTON_LIST = [
  {
    rank: 1,
    label: 'Danton Terbaik I',
    points: 5,
    hasCash: true,
    rewardText: 'Piala Tetap + Uang Pembinaan + E-Sertifikat',
  },
  {
    rank: 2,
    label: 'Danton Terbaik II',
    points: 2,
    hasCash: false,
    rewardText: 'Piala Tetap + E-Sertifikat',
  },
  {
    rank: 3,
    label: 'Danton Terbaik III',
    points: 1,
    hasCash: false,
    rewardText: 'Piala Tetap + E-Sertifikat',
  },
];

const SUMMARY_METRICS = [
  { icon: Crown, value: '2', label: 'Piala Bergilir Juara Umum', color: 'text-amber-400' },
  { icon: Trophy, value: '18', label: 'Trofi Tetap SD & SMP', color: 'text-red-400' },
  { icon: Banknote, value: '8', label: 'Kategori Uang Pembinaan', color: 'text-emerald-400' },
  { icon: FileBadge, value: '100%', label: 'E-Sertifikat Pemenang', color: 'text-blue-400' },
];

export default function Prizes() {
  const [activeDivision, setActiveDivision] = useState('sd');
  const division = DIVISIONS[activeDivision];

  return (
    <section
      id="prizes"
      className="py-20 lg:py-28 bg-slate-950 relative overflow-hidden font-sans border-t border-slate-900 text-white"
    >
      {/* Ambient Lighting & Subtle Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:24px_24px] opacity-35 pointer-events-none" />
      <div className="absolute top-24 left-1/2 -translate-x-1/2 w-[680px] h-[420px] bg-amber-500/10 rounded-full blur-[130px] pointer-events-none" />
      <div
        className={`absolute bottom-16 right-0 w-[420px] h-[420px] rounded-full blur-[130px] pointer-events-none transition-colors duration-500 ${division.glowClass}`}
      />

      <div className="container mx-auto px-4 sm:px-6 relative z-10 max-w-6xl">
        {/* ========================================================
            1. SECTION HEADER + SUMMARY METRICS
            ======================================================== */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1 rounded-full bg-white/[0.06] border border-white/10 text-slate-300 text-[10px] sm:text-xs font-semibold uppercase tracking-normal sm:tracking-wider mb-4 max-w-full">
            <Crown className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="sm:hidden">Trofi, Uang Pembinaan &amp; Piagam</span>
            <span className="hidden sm:inline">{PRIZES.TOTAL_LABEL}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight leading-tight text-white">
            Kategori &amp; <span className="text-amber-400">Penghargaan</span>
          </h2>
          <div className="w-16 h-1 bg-red-700 mx-auto mt-4 rounded-full" />
          <p className="text-slate-300 text-sm sm:text-base mt-4 leading-relaxed max-w-2xl mx-auto">
            Apresiasi resmi bagi pangkalan sekolah, peleton, dan komandan terbaik tingkat SD/MI &amp; SMP/MTs se-Daerah Istimewa Yogyakarta.
          </p>
        </div>

        {/* 4-Metric Prestige Strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-10 sm:mb-12">
          {SUMMARY_METRICS.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-white/[0.03] border border-white/[0.08] p-4 flex items-center gap-3.5 backdrop-blur-sm"
              >
                <div className="w-10 h-10 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center shrink-0">
                  <Icon className={`w-5 h-5 ${item.color}`} />
                </div>
                <div className="min-w-0">
                  <span className="text-lg sm:text-xl font-black text-white leading-none block">
                    {item.value}
                  </span>
                  <span className="text-[11px] text-slate-400 font-medium block mt-1 leading-tight">
                    {item.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* ========================================================
            2. SUPREME SHOWCASE: PIALA BERGILIR JUARA UMUM + SKEMA POIN
            ======================================================== */}
        <div className="relative rounded-3xl bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border border-amber-400/25 shadow-2xl overflow-hidden mb-12 sm:mb-16">
          {/* Top Gold Shimmer Bar */}
          <div className="h-1 w-full bg-gradient-to-r from-red-700 via-amber-400 to-red-700" />
          <div className="absolute -top-24 left-1/4 w-72 h-72 bg-amber-400/10 rounded-full blur-[100px] pointer-events-none" />

          <div className="p-6 sm:p-8 lg:p-10 relative z-10">
            <div className="grid lg:grid-cols-12 gap-8 items-center">
              {/* Left: Rolling Trophy Showcase (7 Cols) */}
              <div className="lg:col-span-7 space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center gap-5">
                  <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center shrink-0 shadow-lg shadow-amber-500/10">
                    <RankMedal
                      rank={1}
                      className="w-16 h-16 sm:w-20 sm:h-20 drop-shadow-[0_6px_18px_rgba(245,158,11,0.45)]"
                      title="Piala Bergilir Juara Umum"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <span className="inline-flex items-center gap-1.5 text-[10px] sm:text-[11px] font-black uppercase tracking-wider sm:tracking-widest text-amber-400 leading-snug">
                      <Sparkles className="w-3.5 h-3.5 shrink-0" />
                      <span>Supremasi LBB Mu&apos;allimin 2027</span>
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight leading-tight">
                      {PRIZES.ROLLING_TROPHY_TITLE}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      Dianugerahkan terpisah untuk 1 sekolah terbaik tingkat SD/MI dan 1 sekolah terbaik tingkat SMP/MTs berdasarkan akumulasi poin kejuaraan tertinggi.
                    </p>
                  </div>
                </div>

                {/* Dual Division Badges */}
                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-xl bg-white/[0.04] border border-red-500/20 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-red-500/15 border border-red-500/30 text-red-400 flex items-center justify-center shrink-0">
                      <School className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-red-300 block">
                        Tingkat SD / MI
                      </span>
                      <span className="text-xs font-bold text-white leading-snug block">
                        Piala Bergilir Juara Umum SD/MI
                      </span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-white/[0.04] border border-blue-500/20 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-blue-500/15 border border-blue-500/30 text-blue-400 flex items-center justify-center shrink-0">
                      <GraduationCap className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-blue-300 block">
                        Tingkat SMP / MTs
                      </span>
                      <span className="text-xs font-bold text-white leading-snug block">
                        Piala Bergilir Juara Umum SMP/MTs
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: Official Championship Points Matrix (5 Cols) */}
              <div className="lg:col-span-5 rounded-2xl bg-white/[0.04] border border-white/10 p-5 space-y-3.5">
                <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-amber-400" />
                    <h4 className="text-xs font-black uppercase tracking-wider text-white">
                      Bobot Poin Juara Umum
                    </h4>
                  </div>
                  <span className="text-[10px] font-semibold text-slate-400">Per Gelar</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {PRIZES.POINTS_CHAMPIONSHIP.map((pt, idx) => {
                    const shortLabel = pt.rank
                      .replace(/^Juara\s+(\d+)\s+Peleton$/i, 'Peleton $1')
                      .replace(/^Juara\s+(\d+)\s+Komandan Terbaik$/i, 'Danton $1');
                    return (
                      <div
                        key={idx}
                        className="flex items-center justify-between gap-2 px-3 py-2 rounded-xl bg-slate-950/70 border border-white/[0.07]"
                      >
                        <span className="text-[11px] font-semibold text-slate-200 whitespace-nowrap">
                          {shortLabel}
                        </span>
                        <span className="text-xs font-black text-amber-400 font-mono shrink-0">
                          +{pt.points}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <p className="text-[11px] text-slate-400 leading-relaxed pt-1">
                  Gelar <strong className="text-slate-200">Juara Harapan I–III</strong> tidak dihitung dalam akumulasi poin Juara Umum.
                </p>
              </div>
            </div>

            {/* Pasal 11 Footnote */}
            <div className="mt-6 pt-4 border-t border-white/[0.08] flex items-start gap-2.5 text-[11px] sm:text-xs text-slate-400 leading-relaxed">
              <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <p>
                <strong className="text-amber-300">Ketentuan Piala Bergilir (Pasal 11 Ayat 1.a.3):</strong> Penerima Piala Bergilir berkewajiban merawat dan menjaga piala dengan baik, serta siap mengembalikannya kepada panitia untuk penyelenggaraan kejuaraan berikutnya.
              </p>
            </div>
          </div>
        </div>

        {/* ========================================================
            3. INTERACTIVE DIVISION SWITCHER + CHAMPIONSHIP PODIUM
            ======================================================== */}
        <div className="space-y-8">
          {/* Switcher Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <span className="text-[11px] font-bold uppercase tracking-widest text-amber-400 block">
                Rincian Gelar Per Jenjang
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight mt-0.5">
                Podium &amp; Penghargaan {division.label}
              </h3>
            </div>

            {/* Segmented Control */}
            <div className="grid grid-cols-2 w-full sm:w-auto sm:inline-flex p-1.5 rounded-2xl bg-slate-900 border border-white/10 shadow-inner gap-1">
              {Object.values(DIVISIONS).map(div => {
                const Icon = div.icon;
                const isActive = activeDivision === div.id;
                const mobileName = div.id === 'sd' ? 'SD / MI' : 'SMP / MTs';
                return (
                  <button
                    key={div.id}
                    type="button"
                    onClick={() => setActiveDivision(div.id)}
                    className={`px-3 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap ${
                      isActive
                        ? div.accentPill
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="sm:hidden">{mobileName}</span>
                    <span className="hidden sm:inline">{div.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* A. 3-STEP PODIUM: JUARA UTAMA PELETON */}
          <div>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <Medal className="w-4 h-4 text-amber-400" />
                <h4 className="text-xs sm:text-sm font-black uppercase tracking-wider text-white">
                  Juara Utama Peleton — {division.label}
                </h4>
              </div>
              <span className="text-[11px] font-semibold text-slate-400 hidden sm:inline">
                Peringkat 1, 2 &amp; 3 Terbaik
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 md:items-end pt-2">
              {MAIN_PODIUM.map(item => (
                <div
                  key={item.rank}
                  className={`relative rounded-3xl border overflow-hidden transition-all duration-300 ${item.cardClass} ${item.orderClass}`}
                >
                  {/* Top Metallic Accent Bar */}
                  <div className={`h-1.5 w-full bg-gradient-to-r ${item.topBarClass}`} />

                  <div className="p-6 text-center space-y-4">
                    {/* Points Badge */}
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        {item.subtitle}
                      </span>
                      <span
                        className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border ${item.badgeClass}`}
                      >
                        +{item.points} Poin
                      </span>
                    </div>

                    {/* Medal Emblem */}
                    <div className="flex justify-center py-1">
                      <RankMedal
                        rank={item.rank}
                        className={`${item.medalSize} drop-shadow-[0_8px_18px_rgba(0,0,0,0.45)]`}
                        title={item.title}
                      />
                    </div>

                    {/* Title */}
                    <div>
                      <h5 className="text-lg sm:text-xl font-black text-white uppercase tracking-tight">
                        {item.title}
                      </h5>
                      <span className={`text-[11px] font-bold ${division.accentText}`}>
                        {division.label}
                      </span>
                    </div>

                    {/* Reward Chips */}
                    <div className="pt-3 border-t border-white/10 flex flex-wrap items-center justify-center gap-1.5">
                      {item.rewards.map((reward, rIdx) => (
                        <span
                          key={rIdx}
                          className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border ${
                            reward === 'Uang Pembinaan'
                              ? 'bg-amber-400/15 text-amber-300 border-amber-400/35'
                              : 'bg-white/[0.05] text-slate-200 border-white/10'
                          }`}
                        >
                          {reward}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* B. BOTTOM SPLIT: JUARA HARAPAN (5 Cols) + DANTON TERBAIK (7 Cols) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
            {/* Juara Harapan Peleton */}
            <div className="lg:col-span-5 rounded-3xl bg-slate-900/80 border border-white/[0.08] p-5 sm:p-6 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between gap-2 pb-3.5 mb-4 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-slate-300" />
                    <h4 className="text-xs sm:text-sm font-black uppercase tracking-wider text-white">
                      Juara Harapan Peleton
                    </h4>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${division.accentSoftBg}`}>
                    {division.shortLabel}
                  </span>
                </div>

                <div className="space-y-2.5">
                  {HARAPAN_LIST.map(item => (
                    <div
                      key={item.rank}
                      className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <RankMedal rank={item.rank} className="w-9 h-9" title={item.label} />
                        <div className="min-w-0">
                          <span className="text-xs sm:text-sm font-bold text-white block">
                            {item.label}
                          </span>
                          <span className="text-[11px] text-slate-400 block">
                            Piala Tetap + E-Sertifikat
                          </span>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-slate-400 bg-white/[0.04] border border-white/[0.08] px-2.5 py-1 rounded-lg shrink-0">
                        Piala Tetap
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <p className="text-[11px] text-slate-500 pt-1">
                Berlaku identik untuk kedua jenjang (SD/MI &amp; SMP/MTs).
              </p>
            </div>

            {/* Komandan Peleton (Danton) Terbaik */}
            <div className="lg:col-span-7 rounded-3xl bg-slate-900/80 border border-white/[0.08] p-5 sm:p-6 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between gap-2 pb-3.5 mb-4 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-amber-400" />
                    <h4 className="text-xs sm:text-sm font-black uppercase tracking-wider text-white">
                      Komandan Peleton (Danton) Terbaik
                    </h4>
                  </div>
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-md border whitespace-nowrap shrink-0 ${division.accentSoftBg}`}>
                    <span className="sm:hidden">{division.id === 'sd' ? 'SD / MI' : 'SMP / MTs'}</span>
                    <span className="hidden sm:inline">{division.label}</span>
                  </span>
                </div>

                <div className="space-y-2.5">
                  {DANTON_LIST.map(item => (
                    <div
                      key={item.rank}
                      className={`p-3.5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                        item.hasCash
                          ? 'bg-amber-500/[0.09] border-amber-400/35'
                          : 'bg-white/[0.03] border-white/[0.06]'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <RankMedal rank={item.rank} className="w-10 h-10" title={item.label} />
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs sm:text-sm font-extrabold text-white">
                              {item.label}
                            </span>
                            <span className="text-[10px] font-black font-mono px-2 py-0.5 rounded-md bg-white/10 text-amber-300">
                              +{item.points} Poin
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-300 block mt-0.5">
                            {item.rewardText}
                          </span>
                        </div>
                      </div>

                      <span
                        className={`self-start sm:self-center text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-lg border shrink-0 whitespace-nowrap ${
                          item.hasCash
                            ? 'bg-amber-400/20 text-amber-300 border-amber-400/40'
                            : 'bg-white/[0.05] text-slate-300 border-white/10'
                        }`}
                      >
                        {item.hasCash ? '+ Uang Pembinaan' : 'Piala Tetap'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <p className="text-[11px] text-slate-400 pt-1">
                Dinilai dari 4 aspek resmi: Penguasaan Materi (35%), Vokal (25%), Sikap &amp; Pelaporan (20%), dan Penguasaan Lapangan (20%).
              </p>
            </div>
          </div>
        </div>

        {/* ========================================================
            4. OFFICIAL CERTIFICATE NOTICE BAR
            ======================================================== */}
        <div className="mt-10 sm:mt-12">
          <div className="rounded-2xl bg-emerald-500/10 border border-emerald-500/25 px-5 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-start sm:items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5 sm:mt-0" />
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                <strong className="text-white font-bold">Seluruh Pemenang</strong> (Juara I–III, Harapan I–III, serta Danton Terbaik I–III pada jenjang SD/MI &amp; SMP/MTs) berhak menerima{' '}
                <span className="text-emerald-400 font-bold">E-Sertifikat &amp; Piagam Penghargaan Resmi Panitia</span>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
