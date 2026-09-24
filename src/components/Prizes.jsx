import React from 'react';
import { Crown, Trophy, Medal, Award, Megaphone, UserCheck, FileCheck, GraduationCap, Building2 } from 'lucide-react';
import { PRIZES } from '../config.js';

export default function Prizes() {
  return (
    <section id="prizes" className="py-24 lg:py-32 bg-slate-950 relative overflow-hidden font-sans border-t border-slate-900">
      <div className="absolute inset-0 opacity-10 bg-carbon-pattern pointer-events-none"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-red-900/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="mb-20 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-900/20 border border-yellow-500/30 text-yellow-500 text-[10px] font-bold uppercase tracking-widest mb-4 animate-pulse">
            <Crown className="w-3.5 h-3.5" />
            <span>{PRIZES.TOTAL_LABEL}</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white uppercase italic tracking-tighter mb-4 leading-tight py-1">
            Kategori & <span className="inline-block pr-3 sm:pr-4 pb-1 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">Penghargaan</span>
          </h2>
          <div className="w-32 h-1 bg-gradient-to-r from-transparent via-red-600 to-transparent mx-auto rounded-full"></div>
        </div>

        {/* Featured Rolling Trophy Card - Compact */}
        <div className="max-w-3xl mx-auto mb-10 relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-yellow-600 via-red-600 to-yellow-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-700"></div>

          <div className="bg-gradient-to-br from-slate-900 to-black rounded-2xl p-6 sm:p-7 border border-slate-700 relative overflow-hidden text-center">
            <div className="w-14 h-14 bg-gradient-to-br from-yellow-400 to-yellow-700 rounded-xl flex items-center justify-center mb-3 mx-auto shadow-[0_0_30px_rgba(234,179,8,0.25)] border border-white/20 transform group-hover:scale-105 transition-transform duration-300">
              <Trophy className="w-7 h-7 text-white fill-white/20" />
            </div>

            <h3 className="text-2xl md:text-3xl font-black text-white uppercase italic tracking-tight mb-1">
              {PRIZES.ROLLING_TROPHY_TITLE}
            </h3>
            <p className="text-slate-400 text-xs mb-5 font-medium">Penghargaan Tertinggi LBB Mu'allimin 2027</p>

            <div className="grid sm:grid-cols-2 gap-3 text-left">
              <div className="glass p-3.5 rounded-xl hover:bg-white/10 transition-colors flex items-center gap-3.5 border border-white/5">
                <span className="w-9 h-9 rounded-lg bg-red-600/20 text-red-500 border border-red-500/30 flex items-center justify-center shrink-0 shadow-sm">
                  <GraduationCap className="w-4 h-4" />
                </span>
                <div>
                  <span className="text-yellow-500 font-bold text-xs block uppercase tracking-wider">Tingkat SD/MI</span>
                  <span className="text-slate-300 text-xs font-medium">{PRIZES.ROLLING_TROPHY_SD}</span>
                </div>
              </div>

              <div className="glass p-3.5 rounded-xl hover:bg-white/10 transition-colors flex items-center gap-3.5 border border-white/5">
                <span className="w-9 h-9 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center shrink-0 shadow-sm">
                  <Building2 className="w-4 h-4" />
                </span>
                <div>
                  <span className="text-yellow-500 font-bold text-xs block uppercase tracking-wider">Tingkat SMP/MTs</span>
                  <span className="text-slate-300 text-xs font-medium">{PRIZES.ROLLING_TROPHY_SMP}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Category breakdown: SD vs SMP - Compact Grid */}
        <div className="grid lg:grid-cols-2 gap-6 mb-10">
          {/* SD / MI */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <span className="w-1.5 h-6 bg-red-600 rounded-full"></span>
              <span className="p-1.5 rounded-lg bg-red-500/10 text-red-500 border border-red-500/20">
                <GraduationCap className="w-4 h-4" />
              </span>
              <h3 className="text-xl font-black text-white uppercase italic">Kategori SD / MI</h3>
            </div>

            <div className="bg-slate-900 rounded-xl p-5 border border-slate-800 hover:border-red-500/40 transition-colors group">
              <div className="flex items-start justify-between mb-3 border-b border-slate-800 pb-3">
                <div>
                  <h4 className="text-base font-bold text-white uppercase tracking-wide">Juara Utama</h4>
                  <p className="text-[11px] text-slate-500">Peringkat 1, 2, dan 3</p>
                </div>
                <Medal className="w-4 h-4 text-red-500" />
              </div>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-400">
                <li className="flex items-start gap-2.5">
                  <span className="font-bold text-white min-w-[18px]">1.</span>
                  <span>Piala Tetap Juara I + <span className="text-green-400 font-bold">Uang Pembinaan</span></span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="font-bold text-white min-w-[18px]">2.</span>
                  <span>Piala Tetap Juara II + <span className="text-green-400 font-bold">Uang Pembinaan</span></span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="font-bold text-white min-w-[18px]">3.</span>
                  <span>Piala Tetap Juara III + <span className="text-green-400 font-bold">Uang Pembinaan</span></span>
                </li>
              </ul>
            </div>

            <div className="bg-slate-900/60 rounded-xl p-5 border border-slate-800 hover:border-slate-700 transition-colors">
              <div className="flex items-start justify-between mb-3 border-b border-slate-800 pb-3">
                <div>
                  <h4 className="text-base font-bold text-white uppercase tracking-wide">Juara Harapan</h4>
                  <p className="text-[11px] text-slate-500">Harapan 1, 2, dan 3</p>
                </div>
                <Award className="w-4 h-4 text-slate-500" />
              </div>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-400">
                <li className="flex items-start gap-2.5"><span className="font-bold text-slate-300 min-w-[65px]">Harapan I:</span> Piala Tetap Juara Harapan I</li>
                <li className="flex items-start gap-2.5"><span className="font-bold text-slate-300 min-w-[65px]">Harapan II:</span> Piala Tetap Juara Harapan II</li>
                <li className="flex items-start gap-2.5"><span className="font-bold text-slate-300 min-w-[65px]">Harapan III:</span> Piala Tetap Juara Harapan III</li>
              </ul>
            </div>
          </div>

          {/* SMP / MTs */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <span className="w-1.5 h-6 bg-blue-600 rounded-full"></span>
              <span className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
                <Building2 className="w-4 h-4" />
              </span>
              <h3 className="text-xl font-black text-white uppercase italic">Kategori SMP / MTs</h3>
            </div>

            <div className="bg-slate-900 rounded-xl p-5 border border-slate-800 hover:border-blue-500/40 transition-colors group">
              <div className="flex items-start justify-between mb-3 border-b border-slate-800 pb-3">
                <div>
                  <h4 className="text-base font-bold text-white uppercase tracking-wide">Juara Utama</h4>
                  <p className="text-[11px] text-slate-500">Peringkat 1, 2, dan 3</p>
                </div>
                <Medal className="w-4 h-4 text-blue-500" />
              </div>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-400">
                <li className="flex items-start gap-2.5">
                  <span className="font-bold text-white min-w-[18px]">1.</span>
                  <span>Piala Tetap Juara I + <span className="text-green-400 font-bold">Uang Pembinaan</span></span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="font-bold text-white min-w-[18px]">2.</span>
                  <span>Piala Tetap Juara II + <span className="text-green-400 font-bold">Uang Pembinaan</span></span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="font-bold text-white min-w-[18px]">3.</span>
                  <span>Piala Tetap Juara III + <span className="text-green-400 font-bold">Uang Pembinaan</span></span>
                </li>
              </ul>
            </div>

            <div className="bg-slate-900/60 rounded-xl p-5 border border-slate-800 hover:border-slate-700 transition-colors">
              <div className="flex items-start justify-between mb-3 border-b border-slate-800 pb-3">
                <div>
                  <h4 className="text-base font-bold text-white uppercase tracking-wide">Juara Harapan</h4>
                  <p className="text-[11px] text-slate-500">Harapan 1, 2, dan 3</p>
                </div>
                <Award className="w-4 h-4 text-slate-500" />
              </div>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-400">
                <li className="flex items-start gap-2.5"><span className="font-bold text-slate-300 min-w-[65px]">Harapan I:</span> Piala Tetap Juara Harapan I</li>
                <li className="flex items-start gap-2.5"><span className="font-bold text-slate-300 min-w-[65px]">Harapan II:</span> Piala Tetap Juara Harapan II</li>
                <li className="flex items-start gap-2.5"><span className="font-bold text-slate-300 min-w-[65px]">Harapan III:</span> Piala Tetap Juara Harapan III</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Special Awards - Compact */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-950 rounded-2xl border border-slate-800 p-6 md:p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-6 opacity-10">
            <Megaphone className="w-20 h-20 text-white" />
          </div>

          <div className="relative z-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-slate-800 pb-5">
              <div>
                <span className="text-yellow-500 font-bold text-[10px] uppercase tracking-widest mb-1 block">Special Awards</span>
                <h3 className="text-2xl font-black text-white uppercase italic">Komandan Peleton Terbaik</h3>
              </div>
              <p className="text-slate-400 text-xs max-w-md md:text-right">
                Penghargaan individu bagi pemimpin lapangan dengan performa instruksi, suara, dan kepemimpinan terbaik.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-red-500 uppercase flex items-center gap-2">
                  <GraduationCap className="w-4 h-4" /> Tingkat SD / MI
                </h4>
                <ul className="space-y-2">
                  <li className="glass backdrop-blur-sm p-2.5 rounded-lg flex justify-between items-center text-xs">
                    <span className="text-slate-300 font-medium">Terbaik I</span>
                    <span className="font-bold text-yellow-500 bg-yellow-900/20 px-2 py-0.5 rounded border border-yellow-500/20">Piala + Uang Pembinaan</span>
                  </li>
                  <li className="glass backdrop-blur-sm p-2.5 rounded-lg flex justify-between items-center text-xs">
                    <span className="text-slate-300 font-medium">Terbaik II</span>
                    <span className="font-bold text-slate-400 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">Piala Tetap</span>
                  </li>
                  <li className="glass backdrop-blur-sm p-2.5 rounded-lg flex justify-between items-center text-xs">
                    <span className="text-slate-300 font-medium">Terbaik III</span>
                    <span className="font-bold text-slate-400 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">Piala Tetap</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-bold text-blue-500 uppercase flex items-center gap-2">
                  <Building2 className="w-4 h-4" /> Tingkat SMP / MTs
                </h4>
                <ul className="space-y-2">
                  <li className="glass backdrop-blur-sm p-2.5 rounded-lg flex justify-between items-center text-xs">
                    <span className="text-slate-300 font-medium">Terbaik I</span>
                    <span className="font-bold text-yellow-500 bg-yellow-900/20 px-2 py-0.5 rounded border border-yellow-500/20">Piala + Uang Pembinaan</span>
                  </li>
                  <li className="glass backdrop-blur-sm p-2.5 rounded-lg flex justify-between items-center text-xs">
                    <span className="text-slate-300 font-medium">Terbaik II</span>
                    <span className="font-bold text-slate-400 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">Piala Tetap</span>
                  </li>
                  <li className="glass backdrop-blur-sm p-2.5 rounded-lg flex justify-between items-center text-xs">
                    <span className="text-slate-300 font-medium">Terbaik III</span>
                    <span className="font-bold text-slate-400 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">Piala Tetap</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-3 bg-slate-900 border border-slate-800 rounded-full px-6 py-3 shadow-lg">
            <FileCheck className="w-4 h-4 text-green-500" />
            <span className="text-xs text-slate-300">
              <strong className="text-white">Semua Pemenang</strong> (Juara 1-3, Harapan 1-3, Danton 1-3) mendapatkan{' '}
              <span className="text-green-400 underline decoration-dotted">E-Sertifikat & Piagam Penghargaan Resmi</span>.
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
