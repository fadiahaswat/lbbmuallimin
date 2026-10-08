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
          <div className="inline-flex items-center justify-center gap-2 px-3.5 sm:px-4 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[10px] sm:text-xs font-bold uppercase tracking-wider sm:tracking-widest mb-4 shadow-sm max-w-full text-center leading-normal">
            <Crown className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="truncate sm:whitespace-normal">{PRIZES.TOTAL_LABEL}</span>
          </div>

          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black uppercase italic tracking-tighter leading-tight py-1 text-white">
            <span className="block sm:inline">Kategori &{' '}</span>
            <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500">
              Penghargaan
            </span>
          </h2>
          <div className="w-20 h-1.5 bg-gradient-to-r from-red-600 to-amber-500 mx-auto mt-4 rounded-full skew-x-12 shadow-[0_0_15px_rgba(245,158,11,0.5)]"></div>

          <p className="text-slate-400 text-sm sm:text-base mt-5 leading-relaxed font-medium max-w-2xl mx-auto">
            Apresiasi tertinggi bagi kontingen dan komandan terbaik yang menunjukkan disiplin, ketangkasan, dan sportivitas ksatria di arena perlombaan.
          </p>
        </div>

        {/* ========================================================
            1. SUPREME SHOWCASE: PIALA BERGILIR JUARA UMUM
            ======================================================== */}
        <div className="max-w-5xl mx-auto mb-12 sm:mb-16 relative group">
          {/* Subtle Ambient Backlight */}
          <div className="absolute -inset-1 bg-gradient-to-r from-amber-500/20 via-yellow-500/30 to-amber-500/20 rounded-3xl blur-xl opacity-60 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>

          <div className="relative rounded-3xl bg-gradient-to-b from-slate-900/95 via-slate-900/85 to-slate-950/95 border border-amber-500/30 shadow-2xl backdrop-blur-xl p-6 sm:p-8 lg:p-10 overflow-hidden text-center">
            
            {/* Top Trophy Icon Badge */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-600 rounded-2xl flex items-center justify-center mb-4 mx-auto shadow-[0_0_35px_rgba(245,158,11,0.4)] border border-white/20 transform group-hover:scale-105 transition-transform duration-300">
              <Trophy className="w-8 h-8 sm:w-10 sm:h-10 text-slate-950" />
            </div>

            <span className="inline-block text-[11px] font-black uppercase tracking-[0.25em] text-amber-400 mb-1">
              SUPREMASI TERTINGGI LBB MU'ALLIMIN 2027
            </span>
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-white uppercase italic tracking-tight mb-2">
              {PRIZES.ROLLING_TROPHY_TITLE}
            </h3>
            <p className="text-slate-400 text-xs sm:text-sm max-w-xl mx-auto mb-8 font-medium leading-relaxed">
              Dianugerahkan kepada pangkalan sekolah dengan akumulasi poin kejuaraan tertinggi (Peleton + Danton) pada masing-masing jenjang.
            </p>

            {/* Dual Trophies (SD & SMP) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 text-left">
              {/* SD Rolling Trophy */}
              <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-red-500/20 hover:border-red-500/40 transition-all flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-red-600/20 border border-red-500/30 text-red-400 flex items-center justify-center shrink-0 shadow-md">
                  <School className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-red-500/15 text-red-300 border border-red-500/25">
                      Tingkat SD / MI
                    </span>
                  </div>
                  <h4 className="text-sm sm:text-base font-black text-white leading-snug">
                    {PRIZES.ROLLING_TROPHY_SD}
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Diperebutkan seluruh peleton tingkat dasar se-Daerah Istimewa Yogyakarta.
                  </p>
                </div>
              </div>

              {/* SMP Rolling Trophy */}
              <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-blue-500/20 hover:border-blue-500/40 transition-all flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center shrink-0 shadow-md">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-300 border border-blue-500/25">
                      Tingkat SMP / MTs
                    </span>
                  </div>
                  <h4 className="text-sm sm:text-base font-black text-white leading-snug">
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
            <div className="rounded-3xl bg-gradient-to-b from-slate-900/90 via-slate-900/80 to-slate-950/95 border border-red-500/25 hover:border-red-500/40 p-5 sm:p-6 shadow-xl backdrop-blur-xl transition-all">
              <div className="flex items-center justify-between gap-2 pb-3 mb-4 border-b border-white/10">
                <div className="flex items-center gap-2 min-w-0">
                  <Medal className="w-4 h-4 text-amber-400 shrink-0" />
                  <h4 className="text-sm sm:text-base font-black text-white uppercase tracking-wider truncate">
                    Juara Utama
                  </h4>
                </div>
                <span className="text-[10px] font-bold uppercase text-slate-400 shrink-0 whitespace-nowrap">
                  Peringkat 1, 2, dan 3
                </span>
              </div>

              <div className="space-y-2.5">
                {/* Juara 1 */}
                <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-lg bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center shrink-0 shadow-sm">
                      1
                    </span>
                    <div>
                      <span className="text-xs sm:text-sm font-black text-white block">Juara I</span>
                      <span className="text-[11px] text-slate-300">Piala Tetap + Piagam</span>
                    </div>
                  </div>
                  <span className="text-xs font-black uppercase px-2.5 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 shrink-0">
                    + Uang Pembinaan
                  </span>
                </div>

                {/* Juara 2 */}
                <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-lg bg-slate-300 text-slate-950 font-black text-xs flex items-center justify-center shrink-0 shadow-sm">
                      2
                    </span>
                    <div>
                      <span className="text-xs sm:text-sm font-black text-white block">Juara II</span>
                      <span className="text-[11px] text-slate-300">Piala Tetap + Piagam</span>
                    </div>
                  </div>
                  <span className="text-xs font-black uppercase px-2.5 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 shrink-0">
                    + Uang Pembinaan
                  </span>
                </div>

                {/* Juara 3 */}
                <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-lg bg-amber-700 text-white font-black text-xs flex items-center justify-center shrink-0 shadow-sm">
                      3
                    </span>
                    <div>
                      <span className="text-xs sm:text-sm font-black text-white block">Juara III</span>
                      <span className="text-[11px] text-slate-300">Piala Tetap + Piagam</span>
                    </div>
                  </div>
                  <span className="text-xs font-black uppercase px-2.5 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 shrink-0">
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
            <div className="rounded-3xl bg-gradient-to-b from-slate-900/90 via-slate-900/80 to-slate-950/95 border border-blue-500/25 hover:border-blue-500/40 p-5 sm:p-6 shadow-xl backdrop-blur-xl transition-all">
              <div className="flex items-center justify-between gap-2 pb-3 mb-4 border-b border-white/10">
                <div className="flex items-center gap-2 min-w-0">
                  <Medal className="w-4 h-4 text-amber-400 shrink-0" />
                  <h4 className="text-sm sm:text-base font-black text-white uppercase tracking-wider truncate">
                    Juara Utama
                  </h4>
                </div>
                <span className="text-[10px] font-bold uppercase text-slate-400 shrink-0 whitespace-nowrap">
                  Peringkat 1, 2, dan 3
                </span>
              </div>

              <div className="space-y-2.5">
                {/* Juara 1 */}
                <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-lg bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center shrink-0 shadow-sm">
                      1
                    </span>
                    <div>
                      <span className="text-xs sm:text-sm font-black text-white block">Juara I</span>
                      <span className="text-[11px] text-slate-300">Piala Tetap + Piagam</span>
                    </div>
                  </div>
                  <span className="text-xs font-black uppercase px-2.5 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 shrink-0">
                    + Uang Pembinaan
                  </span>
                </div>

                {/* Juara 2 */}
                <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-lg bg-slate-300 text-slate-950 font-black text-xs flex items-center justify-center shrink-0 shadow-sm">
                      2
                    </span>
                    <div>
                      <span className="text-xs sm:text-sm font-black text-white block">Juara II</span>
                      <span className="text-[11px] text-slate-300">Piala Tetap + Piagam</span>
                    </div>
                  </div>
                  <span className="text-xs font-black uppercase px-2.5 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 shrink-0">
                    + Uang Pembinaan
                  </span>
                </div>

                {/* Juara 3 */}
                <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-lg bg-amber-700 text-white font-black text-xs flex items-center justify-center shrink-0 shadow-sm">
                      3
                    </span>
                    <div>
                      <span className="text-xs sm:text-sm font-black text-white block">Juara III</span>
                      <span className="text-[11px] text-slate-300">Piala Tetap + Piagam</span>
                    </div>
                  </div>
                  <span className="text-xs font-black uppercase px-2.5 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 shrink-0">
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
        <div className="rounded-3xl bg-gradient-to-b from-slate-900/95 via-slate-900/80 to-slate-950/95 border border-amber-500/30 p-6 sm:p-8 lg:p-10 shadow-2xl backdrop-blur-xl relative overflow-hidden mb-12">
          {/* Subtle Ambient Glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-white/10 text-left">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[10px] font-bold uppercase tracking-widest mb-2">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Penghargaan Khusus Individu</span>
                </div>
                <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-white uppercase italic tracking-tight">
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
