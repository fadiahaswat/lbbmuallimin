import React from 'react';
import { Crown, Trophy, Medal, Award, Megaphone, UserCheck, FileCheck } from 'lucide-react';
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

        {/* Featured Rolling Trophy Card */}
        <div className="max-w-4xl mx-auto mb-16 relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-yellow-600 via-red-600 to-yellow-600 rounded-3xl blur opacity-30 group-hover:opacity-60 transition duration-1000"></div>

          <div className="bg-gradient-to-br from-slate-900 to-black rounded-3xl p-8 md:p-10 border border-slate-700 relative overflow-hidden text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-yellow-700 rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-[0_0_40px_rgba(234,179,8,0.3)] border-2 border-white/20 transform group-hover:scale-110 transition-transform duration-500">
              <Trophy className="w-10 h-10 text-white fill-white/20" />
            </div>

            <h3 className="text-3xl md:text-4xl font-black text-white uppercase italic tracking-tight mb-2">
              {PRIZES.ROLLING_TROPHY_TITLE}
            </h3>
            <p className="text-slate-400 text-sm mb-8 font-medium">Penghargaan Tertinggi LBB Mu'allimin 2026</p>

            <div className="grid md:grid-cols-2 gap-4 text-left">
              <div className="glass p-4 rounded-xl hover:bg-white/10 transition-colors flex items-center gap-4">
                <span className="w-8 h-8 rounded-lg bg-red-600 text-white font-bold flex items-center justify-center text-xs shadow-lg shadow-red-900/50">
                  SD
                </span>
                <div>
                  <span className="text-yellow-500 font-bold text-sm block uppercase">Tingkat SD/MI</span>
                  <span className="text-slate-400 text-xs">{PRIZES.ROLLING_TROPHY_SD}</span>
                </div>
              </div>

              <div className="glass p-4 rounded-xl hover:bg-white/10 transition-colors flex items-center gap-4">
                <span className="w-8 h-8 rounded-lg bg-blue-600 text-white font-bold flex items-center justify-center text-xs shadow-lg shadow-blue-900/50">
                  SMP
                </span>
                <div>
                  <span className="text-yellow-500 font-bold text-sm block uppercase">Tingkat SMP/MTs</span>
                  <span className="text-slate-400 text-xs">{PRIZES.ROLLING_TROPHY_SMP}</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Category breakdown: SD vs SMP */}
        <div className="grid lg:grid-cols-2 gap-10 mb-16">
          {/* SD / MI */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <span className="w-2 h-8 bg-red-600 rounded-full"></span>
              <h3 className="text-2xl font-black text-white uppercase italic">Kategori SD / MI</h3>
            </div>

            <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 hover:border-red-500/50 transition-colors group">
              <div className="flex items-start justify-between mb-4 border-b border-slate-800 pb-4">
                <div>
                  <h4 className="text-lg font-bold text-white uppercase">Juara Utama</h4>
                  <p className="text-xs text-slate-500">Peringkat 1, 2, dan 3</p>
                </div>
                <Medal className="w-5 h-5 text-red-500" />
              </div>
              <ul className="space-y-3 text-sm text-slate-400">
                <li className="flex items-start gap-3">
                  <span className="font-bold text-white min-w-[20px]">1.</span>
                  <span>Piala Tetap Juara I + <span className="text-green-400 font-bold">Uang Pembinaan</span></span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="font-bold text-white min-w-[20px]">2.</span>
                  <span>Piala Tetap Juara II + <span className="text-green-400 font-bold">Uang Pembinaan</span></span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="font-bold text-white min-w-[20px]">3.</span>
                  <span>Piala Tetap Juara III + <span className="text-green-400 font-bold">Uang Pembinaan</span></span>
                </li>
              </ul>
            </div>

            <div className="bg-slate-900/50 rounded-2xl p-6 border border-slate-800 hover:border-slate-600 transition-colors">
              <div className="flex items-start justify-between mb-4 border-b border-slate-800 pb-4">
                <div>
                  <h4 className="text-lg font-bold text-white uppercase">Juara Harapan</h4>
                  <p className="text-xs text-slate-500">Harapan 1, 2, dan 3</p>
                </div>
                <Award className="w-5 h-5 text-slate-500" />
              </div>
              <ul className="space-y-3 text-sm text-slate-400">
                <li className="flex items-start gap-3"><span className="font-bold text-slate-300 min-w-[70px]">Harapan I:</span> Piala Tetap Juara Harapan I</li>
                <li className="flex items-start gap-3"><span className="font-bold text-slate-300 min-w-[70px]">Harapan II:</span> Piala Tetap Juara Harapan II</li>
                <li className="flex items-start gap-3"><span className="font-bold text-slate-300 min-w-[70px]">Harapan III:</span> Piala Tetap Juara Harapan III</li>
              </ul>
            </div>
          </div>

          {/* SMP / MTs */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <span className="w-2 h-8 bg-blue-600 rounded-full"></span>
              <h3 className="text-2xl font-black text-white uppercase italic">Kategori SMP / MTs</h3>
            </div>

            <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 hover:border-blue-500/50 transition-colors group">
              <div className="flex items-start justify-between mb-4 border-b border-slate-800 pb-4">
                <div>
                  <h4 className="text-lg font-bold text-white uppercase">Juara Utama</h4>
                  <p className="text-xs text-slate-500">Peringkat 1, 2, dan 3</p>
                </div>
                <Medal className="w-5 h-5 text-blue-500" />
              </div>
              <ul className="space-y-3 text-sm text-slate-400">
                <li className="flex items-start gap-3">
                  <span className="font-bold text-white min-w-[20px]">1.</span>
                  <span>Piala Tetap Juara I + <span className="text-green-400 font-bold">Uang Pembinaan</span></span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="font-bold text-white min-w-[20px]">2.</span>
                  <span>Piala Tetap Juara II + <span className="text-green-400 font-bold">Uang Pembinaan</span></span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="font-bold text-white min-w-[20px]">3.</span>
                  <span>Piala Tetap Juara III + <span className="text-green-400 font-bold">Uang Pembinaan</span></span>
                </li>
              </ul>
            </div>

            <div className="bg-slate-900/50 rounded-2xl p-6 border border-slate-800 hover:border-slate-600 transition-colors">
              <div className="flex items-start justify-between mb-4 border-b border-slate-800 pb-4">
                <div>
                  <h4 className="text-lg font-bold text-white uppercase">Juara Harapan</h4>
                  <p className="text-xs text-slate-500">Harapan 1, 2, dan 3</p>
                </div>
                <Award className="w-5 h-5 text-slate-500" />
              </div>
              <ul className="space-y-3 text-sm text-slate-400">
                <li className="flex items-start gap-3"><span className="font-bold text-slate-300 min-w-[70px]">Harapan I:</span> Piala Tetap Juara Harapan I</li>
                <li className="flex items-start gap-3"><span className="font-bold text-slate-300 min-w-[70px]">Harapan II:</span> Piala Tetap Juara Harapan II</li>
                <li className="flex items-start gap-3"><span className="font-bold text-slate-300 min-w-[70px]">Harapan III:</span> Piala Tetap Juara Harapan III</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Special Awards */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-950 rounded-3xl border border-slate-800 p-8 md:p-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Megaphone className="w-28 h-28 text-white" />
          </div>

          <div className="relative z-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 border-b border-slate-800 pb-6">
              <div>
                <span className="text-yellow-500 font-bold text-xs uppercase tracking-widest mb-2 block">Special Awards</span>
                <h3 className="text-3xl font-black text-white uppercase italic">Komandan Peleton Terbaik</h3>
              </div>
              <p className="text-slate-400 text-sm max-w-md md:text-right">
                Penghargaan individu bagi pemimpin lapangan dengan performa instruksi, suara, dan kepemimpinan terbaik.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-red-500 uppercase flex items-center gap-2">
                  <UserCheck className="w-4 h-4" /> Tingkat SD / MI
                </h4>
                <ul className="space-y-3">
                  <li className="glass backdrop-blur-sm p-3 rounded-lg flex justify-between items-center">
                    <span className="text-slate-300 text-sm font-medium">Terbaik I</span>
                    <span className="text-xs font-bold text-yellow-500 bg-yellow-900/20 px-2 py-1 rounded">Piala + Uang Pembinaan</span>
                  </li>
                  <li className="glass backdrop-blur-sm p-3 rounded-lg flex justify-between items-center">
                    <span className="text-slate-300 text-sm font-medium">Terbaik II</span>
                    <span className="text-xs font-bold text-slate-400 bg-slate-800 px-2 py-1 rounded">Piala Tetap</span>
                  </li>
                  <li className="glass backdrop-blur-sm p-3 rounded-lg flex justify-between items-center">
                    <span className="text-slate-300 text-sm font-medium">Terbaik III</span>
                    <span className="text-xs font-bold text-slate-400 bg-slate-800 px-2 py-1 rounded">Piala Tetap</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-bold text-blue-500 uppercase flex items-center gap-2">
                  <UserCheck className="w-4 h-4" /> Tingkat SMP / MTs
                </h4>
                <ul className="space-y-3">
                  <li className="glass backdrop-blur-sm p-3 rounded-lg flex justify-between items-center">
                    <span className="text-slate-300 text-sm font-medium">Terbaik I</span>
                    <span className="text-xs font-bold text-yellow-500 bg-yellow-900/20 px-2 py-1 rounded">Piala + Uang Pembinaan</span>
                  </li>
                  <li className="glass backdrop-blur-sm p-3 rounded-lg flex justify-between items-center">
                    <span className="text-slate-300 text-sm font-medium">Terbaik II</span>
                    <span className="text-xs font-bold text-slate-400 bg-slate-800 px-2 py-1 rounded">Piala Tetap</span>
                  </li>
                  <li className="glass backdrop-blur-sm p-3 rounded-lg flex justify-between items-center">
                    <span className="text-slate-300 text-sm font-medium">Terbaik III</span>
                    <span className="text-xs font-bold text-slate-400 bg-slate-800 px-2 py-1 rounded">Piala Tetap</span>
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
