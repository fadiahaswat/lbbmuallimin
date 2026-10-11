import React from 'react';
import {
  Crown,
  Trophy,
  Medal,
  Award,
  Sparkles,
  School,
  GraduationCap,
  CheckCircle2
} from 'lucide-react';
import { PRIZES } from '../config.js';

export default function Prizes() {
  return (
    <section id="prizes" className="py-24 lg:py-32 bg-slate-950 relative overflow-hidden font-sans border-t border-slate-900 text-white">
      {/* Background Lighting */}
      <div className="absolute inset-0 opacity-15 bg-carbon-pattern pointer-events-none"></div>
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-amber-500/10 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-red-600/10 rounded-full blur-[128px] pointer-events-none"></div>

      <div className="container mx-auto px-6 relative z-10">
        
        {/* ========================================================
            SECTION HEADER
            ======================================================== */}
        <div className="mb-14 md:mb-16 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center justify-center gap-2 px-3.5 py-1 rounded-full bg-white/[0.06] border border-white/10 text-slate-300 text-xs font-semibold uppercase tracking-wider mb-4">
            <Crown className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>{PRIZES.TOTAL_LABEL}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight leading-tight py-1 text-white">
            <span>Kategori & </span>
            <span className="text-amber-400">
              Penghargaan
            </span>
          </h2>
          <div className="w-16 h-1 bg-red-700 mx-auto mt-4 rounded-full"></div>

          <p className="text-slate-300 text-sm sm:text-base mt-4 leading-relaxed font-normal max-w-2xl mx-auto">
            Apresiasi resmi bagi peleton dan danton terbaik berdasarkan akumulasi penilaian rubrik juri di arena perlombaan.
          </p>
        </div>

        {/* ========================================================
            1. SUPREME SHOWCASE: PIALA BERGILIR JUARA UMUM
            ======================================================== */}
        <div className="max-w-5xl mx-auto mb-12 sm:mb-16">
          <div className="relative rounded-2xl bg-slate-900/90 border border-white/[0.08] shadow-lg p-6 sm:p-8 lg:p-10 overflow-hidden text-center">
            
            {/* Top Trophy Icon Badge */}
            <div className="w-14 h-14 bg-amber-500 rounded-xl flex items-center justify-center mb-4 mx-auto shadow-md">
              <Trophy className="w-7 h-7 text-slate-950" />
            </div>

            <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-amber-400 mb-1">
              Supremasi Kejuaraan LBB Mu'allimin 2027
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white uppercase tracking-tight mb-2">
              {PRIZES.ROLLING_TROPHY_TITLE}
            </h3>
            <p className="text-slate-300 text-xs sm:text-sm max-w-xl mx-auto mb-8 font-normal leading-relaxed">
              Dianugerahkan kepada pangkalan sekolah dengan akumulasi poin kejuaraan tertinggi (Peleton + Danton) pada masing-masing jenjang.
            </p>

            {/* Dual Trophies (SD & SMP) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 text-left">
              {/* SD Rolling Trophy */}
              <div className="p-4 sm:p-5 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-white/[0.06] border border-white/10 text-red-400 flex items-center justify-center shrink-0">
                  <School className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white/[0.06] text-slate-300 border border-white/10">
                      Tingkat SD / MI
                    </span>
                  </div>
                  <h4 className="text-sm sm:text-base font-bold text-white leading-snug">
                    {PRIZES.ROLLING_TROPHY_SD}
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Diperebutkan seluruh peleton tingkat dasar se-Daerah Istimewa Yogyakarta.
                  </p>
                </div>
              </div>

              {/* SMP Rolling Trophy */}
              <div className="p-4 sm:p-5 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-white/[0.06] border border-white/10 text-blue-400 flex items-center justify-center shrink-0">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white/[0.06] text-slate-300 border border-white/10">
                      Tingkat SMP / MTs
                    </span>
                  </div>
                  <h4 className="text-sm sm:text-base font-bold text-white leading-snug">
                    {PRIZES.ROLLING_TROPHY_SMP}
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Diperebutkan seluruh peleton tingkat menengah se-Daerah Istimewa Yogyakarta.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* ========================================================
            2. CATEGORY BREAKDOWN: SD / MI vs SMP / MTs
            ======================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-12 sm:mb-16">
          
          {/* SD / MI Column */}
          <div className="space-y-4 sm:space-y-5">
            {/* Column Header */}
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-600/20 text-red-400 border border-red-500/30 flex items-center justify-center shadow-md">
                  <School className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-red-400 uppercase tracking-widest block">
                    Tingkat Dasar
                  </span>
                  <h3 className="text-lg sm:text-xl font-black text-white uppercase italic tracking-tight">
                    Kategori SD / MI
                  </h3>
                </div>
              </div>
              <span className="text-[10px] sm:text-[11px] font-semibold text-slate-400 bg-white/[0.04] border border-white/10 px-2.5 sm:px-3 py-1 rounded-full shrink-0 whitespace-nowrap">
                6 Gelar Juara
              </span>
            </div>

            {/* Juara Utama Card */}
            <div className="rounded-2xl bg-slate-900/90 border border-white/[0.08] p-5 sm:p-6 shadow-md transition-all">
              <div className="flex items-center justify-between gap-2 pb-3 mb-4 border-b border-white/10">
                <div className="flex items-center gap-2 min-w-0">
                  <Medal className="w-4 h-4 text-amber-400 shrink-0" />
                  <h4 className="text-sm sm:text-base font-bold text-white uppercase tracking-wider truncate">
                    Juara Utama
                  </h4>
                </div>
                <span className="text-[10px] font-semibold uppercase text-slate-400 shrink-0 whitespace-nowrap">
                  Peringkat 1, 2, dan 3
                </span>
              </div>

              <div className="space-y-2.5">
                {/* Juara 1 */}
                <div className="p-3.5 rounded-xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-lg bg-amber-500 text-slate-950 font-bold text-xs flex items-center justify-center shrink-0">
                      1
                    </span>
                    <div>
                      <span className="text-xs sm:text-sm font-bold text-white block">Juara I</span>
                      <span className="text-[11px] text-slate-300">Piala Tetap + Piagam</span>
                    </div>
                  </div>
                  <span className="text-xs font-bold uppercase px-2.5 py-1 rounded-md bg-white/[0.08] text-amber-300 shrink-0">
                    + Uang Pembinaan
                  </span>
                </div>

                {/* Juara 2 */}
                <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-lg bg-slate-400 text-slate-950 font-bold text-xs flex items-center justify-center shrink-0">
                      2
                    </span>
                    <div>
                      <span className="text-xs sm:text-sm font-bold text-white block">Juara II</span>
                      <span className="text-[11px] text-slate-300">Piala Tetap + Piagam</span>
                    </div>
                  </div>
                  <span className="text-xs font-bold uppercase px-2.5 py-1 rounded-md bg-white/[0.08] text-amber-300 shrink-0">
                    + Uang Pembinaan
                  </span>
                </div>

                {/* Juara 3 */}
                <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-lg bg-amber-700 text-white font-bold text-xs flex items-center justify-center shrink-0">
                      3
                    </span>
                    <div>
                      <span className="text-xs sm:text-sm font-bold text-white block">Juara III</span>
                      <span className="text-[11px] text-slate-300">Piala Tetap + Piagam</span>
                    </div>
                  </div>
                  <span className="text-xs font-bold uppercase px-2.5 py-1 rounded-md bg-white/[0.08] text-amber-300 shrink-0">
                    + Uang Pembinaan
                  </span>
                </div>
              </div>
            </div>

            {/* Juara Harapan Card */}
            <div className="rounded-3xl bg-gradient-to-b from-slate-900/80 to-slate-950/90 border border-white/10 p-5 sm:p-6 shadow-lg backdrop-blur-xl">
              <div className="flex items-center justify-between gap-2 pb-3 mb-3 border-b border-white/10">
                <div className="flex items-center gap-2 min-w-0">
                  <Award className="w-4 h-4 text-slate-400 shrink-0" />
                  <h4 className="text-sm sm:text-base font-black text-white uppercase tracking-wider truncate">
                    Juara Harapan
                  </h4>
                </div>
                <span className="text-[10px] font-bold uppercase text-slate-400 shrink-0 whitespace-nowrap">
                  Peringkat Harapan 1, 2, 3
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-center">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Harapan I</span>
                  <span className="text-xs font-black text-white block">Piala Tetap</span>
                  <span className="text-[10px] text-slate-400">+ Piagam</span>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-center">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Harapan II</span>
                  <span className="text-xs font-black text-white block">Piala Tetap</span>
                  <span className="text-[10px] text-slate-400">+ Piagam</span>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-center">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Harapan III</span>
                  <span className="text-xs font-black text-white block">Piala Tetap</span>
                  <span className="text-[10px] text-slate-400">+ Piagam</span>
                </div>
              </div>
            </div>
          </div>

          {/* SMP / MTs Column */}
          <div className="space-y-4 sm:space-y-5">
            {/* Column Header */}
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center shadow-md">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest block">
                    Tingkat Menengah
                  </span>
                  <h3 className="text-lg sm:text-xl font-black text-white uppercase italic tracking-tight">
                    Kategori SMP / MTs
                  </h3>
                </div>
              </div>
              <span className="text-[10px] sm:text-[11px] font-semibold text-slate-400 bg-white/[0.04] border border-white/10 px-2.5 sm:px-3 py-1 rounded-full shrink-0 whitespace-nowrap">
                6 Gelar Juara
              </span>
            </div>

            {/* Juara Utama Card */}
            <div className="rounded-2xl bg-slate-900/90 border border-white/[0.08] p-5 sm:p-6 shadow-md transition-all">
              <div className="flex items-center justify-between gap-2 pb-3 mb-4 border-b border-white/10">
                <div className="flex items-center gap-2 min-w-0">
                  <Medal className="w-4 h-4 text-amber-400 shrink-0" />
                  <h4 className="text-sm sm:text-base font-bold text-white uppercase tracking-wider truncate">
                    Juara Utama
                  </h4>
                </div>
                <span className="text-[10px] font-semibold uppercase text-slate-400 shrink-0 whitespace-nowrap">
                  Peringkat 1, 2, dan 3
                </span>
              </div>

              <div className="space-y-2.5">
                {/* Juara 1 */}
                <div className="p-3.5 rounded-xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-lg bg-amber-500 text-slate-950 font-bold text-xs flex items-center justify-center shrink-0">
                      1
                    </span>
                    <div>
                      <span className="text-xs sm:text-sm font-bold text-white block">Juara I</span>
                      <span className="text-[11px] text-slate-300">Piala Tetap + Piagam</span>
                    </div>
                  </div>
                  <span className="text-xs font-bold uppercase px-2.5 py-1 rounded-md bg-white/[0.08] text-amber-300 shrink-0">
                    + Uang Pembinaan
                  </span>
                </div>

                {/* Juara 2 */}
                <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-lg bg-slate-400 text-slate-950 font-bold text-xs flex items-center justify-center shrink-0">
                      2
                    </span>
                    <div>
                      <span className="text-xs sm:text-sm font-bold text-white block">Juara II</span>
                      <span className="text-[11px] text-slate-300">Piala Tetap + Piagam</span>
                    </div>
                  </div>
                  <span className="text-xs font-bold uppercase px-2.5 py-1 rounded-md bg-white/[0.08] text-amber-300 shrink-0">
                    + Uang Pembinaan
                  </span>
                </div>

                {/* Juara 3 */}
                <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-lg bg-amber-700 text-white font-bold text-xs flex items-center justify-center shrink-0">
                      3
                    </span>
                    <div>
                      <span className="text-xs sm:text-sm font-bold text-white block">Juara III</span>
                      <span className="text-[11px] text-slate-300">Piala Tetap + Piagam</span>
                    </div>
                  </div>
                  <span className="text-xs font-bold uppercase px-2.5 py-1 rounded-md bg-white/[0.08] text-amber-300 shrink-0">
                    + Uang Pembinaan
                  </span>
                </div>
              </div>
            </div>

            {/* Juara Harapan Card */}
            <div className="rounded-3xl bg-gradient-to-b from-slate-900/80 to-slate-950/90 border border-white/10 p-5 sm:p-6 shadow-lg backdrop-blur-xl">
              <div className="flex items-center justify-between gap-2 pb-3 mb-3 border-b border-white/10">
                <div className="flex items-center gap-2 min-w-0">
                  <Award className="w-4 h-4 text-slate-400 shrink-0" />
                  <h4 className="text-sm sm:text-base font-black text-white uppercase tracking-wider truncate">
                    Juara Harapan
                  </h4>
                </div>
                <span className="text-[10px] font-bold uppercase text-slate-400 shrink-0 whitespace-nowrap">
                  Peringkat Harapan 1, 2, 3
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-center">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Harapan I</span>
                  <span className="text-xs font-black text-white block">Piala Tetap</span>
                  <span className="text-[10px] text-slate-400">+ Piagam</span>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-center">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Harapan II</span>
                  <span className="text-xs font-black text-white block">Piala Tetap</span>
                  <span className="text-[10px] text-slate-400">+ Piagam</span>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-center">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Harapan III</span>
                  <span className="text-xs font-black text-white block">Piala Tetap</span>
                  <span className="text-[10px] text-slate-400">+ Piagam</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* ========================================================
            3. SPECIAL AWARDS: KOMANDAN PELETON (DANTON) TERBAIK
            ======================================================== */}
        <div className="rounded-2xl bg-slate-900/90 border border-white/[0.08] p-6 sm:p-8 lg:p-10 shadow-lg relative overflow-hidden mb-12">
          <div className="relative z-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-white/10 text-left">
              <div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-white uppercase tracking-tight">
                  Komandan Peleton (Danton) Terbaik
                </h3>
              </div>
            </div>

            {/* 2 Columns: SD & SMP */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              {/* Danton SD */}
              <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/5 space-y-3">
                <div className="flex items-center gap-2 text-red-400 pb-2 border-b border-white/5">
                  <School className="w-4 h-4" />
                  <h4 className="text-xs font-black uppercase tracking-wider">
                    Tingkat SD / MI
                  </h4>
                </div>
                
                <div className="space-y-2">
                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded-md bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center">1</span>
                      <span className="text-xs font-bold text-white">Danton Terbaik I</span>
                    </div>
                    <span className="text-[11px] font-black text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded border border-amber-500/30">
                      Piala + Uang Pembinaan
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded-md bg-slate-400 text-slate-950 font-black text-xs flex items-center justify-center">2</span>
                      <span className="text-xs font-bold text-white">Danton Terbaik II</span>
                    </div>
                    <span className="text-[11px] font-bold text-slate-300 bg-white/5 px-2 py-0.5 rounded">
                      Piala Tetap + Piagam
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded-md bg-amber-700 text-white font-black text-xs flex items-center justify-center">3</span>
                      <span className="text-xs font-bold text-white">Danton Terbaik III</span>
                    </div>
                    <span className="text-[11px] font-bold text-slate-300 bg-white/5 px-2 py-0.5 rounded">
                      Piala Tetap + Piagam
                    </span>
                  </div>
                </div>
              </div>

              {/* Danton SMP */}
              <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/5 space-y-3">
                <div className="flex items-center gap-2 text-blue-400 pb-2 border-b border-white/5">
                  <GraduationCap className="w-4 h-4" />
                  <h4 className="text-xs font-black uppercase tracking-wider">
                    Tingkat SMP / MTs
                  </h4>
                </div>
                
                <div className="space-y-2">
                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded-md bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center">1</span>
                      <span className="text-xs font-bold text-white">Danton Terbaik I</span>
                    </div>
                    <span className="text-[11px] font-black text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded border border-amber-500/30">
                      Piala + Uang Pembinaan
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded-md bg-slate-400 text-slate-950 font-black text-xs flex items-center justify-center">2</span>
                      <span className="text-xs font-bold text-white">Danton Terbaik II</span>
                    </div>
                    <span className="text-[11px] font-bold text-slate-300 bg-white/5 px-2 py-0.5 rounded">
                      Piala Tetap + Piagam
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded-md bg-amber-700 text-white font-black text-xs flex items-center justify-center">3</span>
                      <span className="text-xs font-bold text-white">Danton Terbaik III</span>
                    </div>
                    <span className="text-[11px] font-bold text-slate-300 bg-white/5 px-2 py-0.5 rounded">
                      Piala Tetap + Piagam
                    </span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* ========================================================
            4. CERTIFICATE NOTICE BADGE
            ======================================================== */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-xs text-slate-300 shadow-lg backdrop-blur-sm">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              <strong className="text-white font-bold">Semua Pemenang</strong> (Juara 1–3, Harapan 1–3, dan Danton 1–3) berhak mendapatkan{' '}
              <span className="text-emerald-400 font-bold">E-Sertifikat & Piagam Penghargaan Resmi Panitia</span>.
            </span>
          </div>
        </div>

      </div>
    </section>
  );
}
