import React from 'react';
import {
  Scroll,
  Shield,
  HeartHandshake,
  Activity,
  Trophy,
  BrainCircuit,
  Network,
  School,
  GraduationCap,
  UserCheck,
  Users,
  PlusCircle,
  Timer,
  Maximize2,
  ArrowRight
} from 'lucide-react';
import { COMPETITION } from '../config.js';

export default function About() {
  return (
    <section id="about" className="py-24 lg:py-32 bg-slate-50 relative overflow-hidden font-sans">
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:20px_20px] opacity-40"></div>
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-red-900/5 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-yellow-500/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="max-w-4xl mx-auto text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-100/50 border border-red-200 text-red-800 text-xs font-bold uppercase tracking-widest mb-6">
            <Scroll className="w-3.5 h-3.5" /> Dasar Pelaksanaan: QS. As-Saff Ayat 4
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 uppercase italic tracking-tighter mb-6 leading-tight py-1">
            Membangun <span className="inline-block pr-3 sm:pr-4 pb-1 text-transparent bg-clip-text bg-gradient-to-r from-red-700 to-red-600">Generasi Unggul</span><br />
            Berkarakter{' '}
            <span className="relative inline-block pr-3 pb-1">
              <span className="relative z-10 text-amber-700 font-extrabold">Ksatria</span>
              <svg
                className="absolute w-full h-3 -bottom-1 left-0 text-amber-400 -z-0"
                viewBox="0 0 100 10"
                preserveAspectRatio="none"
              >
                <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" opacity="0.7" />
              </svg>
            </span>
          </h2>

          <p className="text-lg text-slate-600 leading-relaxed font-medium">
            <strong className="text-slate-900">LBB Mu'allimin 2026</strong> hadir sebagai manifestasi peran historis Madrasah Mu'allimin sejak 1918. Ini bukan sekadar kompetisi, melainkan kawah candradimuka untuk menanamkan nilai{' '}
            <span className="text-red-700 font-bold">Disiplin</span>,{' '}
            <span className="text-red-700 font-bold">Kepemimpinan</span>, dan{' '}
            <span className="text-red-700 font-bold">Solidaritas</span> demi mencetak Profil Pelajar Pancasila dan Kader Bangsa yang Berkemajuan.
          </p>
        </div>

        {/* Theme Card */}
        <div className="max-w-4xl mx-auto mb-24 relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-red-900 to-slate-900 rounded-3xl -rotate-1 scale-[1.02] opacity-80 blur-lg group-hover:rotate-0 transition-all duration-500"></div>

          <div className="relative bg-slate-900 text-white p-8 sm:p-12 lg:p-14 rounded-2xl shadow-2xl border border-slate-800 overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
            <Shield className="absolute -right-10 -bottom-10 text-white/5 w-64 h-64 pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
              <div className="md:max-w-xs lg:max-w-sm">
                <span className="text-yellow-500 font-bold tracking-[0.3em] text-xs uppercase mb-2 block">Tema Resmi 2026</span>
                <h3 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase italic leading-tight py-1">
                  <span className="block pb-1 text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-300">Jiwa Ksatria</span>
                  <span className="block text-yellow-500">Derap Gemilang</span>
                </h3>
              </div>

              <div className="space-y-5 max-w-md">
                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0 border border-white/10 text-yellow-400 shadow-sm">
                    <HeartHandshake className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-base text-white">Jiwa Ksatria (Internal)</h4>
                    <p className="text-sm text-slate-400 mt-0.5 leading-relaxed">Integritas, Kehormatan, Tanggung Jawab, dan Mental Pantang Menyerah.</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0 border border-white/10 text-yellow-400 shadow-sm">
                    <Activity className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-base text-white">Derap Gemilang (Eksternal)</h4>
                    <p className="text-sm text-slate-400 mt-0.5 leading-relaxed">Keunggulan Teknis, Presisi Gerak, Kekompakan, dan Prestasi Cemerlang.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tujuan & Manfaat */}
        <div className="mb-20">
          <h3 className="text-3xl font-black text-center text-slate-900 uppercase italic mb-10">
            Tujuan & <span className="text-red-700">Manfaat</span>
          </h3>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="group p-6 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-red-500/30 transition-all duration-300">
              <div className="w-12 h-12 bg-red-100 text-red-700 rounded-xl flex items-center justify-center mb-4 group-hover:bg-red-600 group-hover:text-white transition-colors">
                <Trophy className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-slate-900 mb-2">Kompetisi Berkualitas</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Menyediakan wadah kompetisi yang sehat, sportif, dan transparan untuk mengukur kemampuan PBB pelajar se-DIY.
              </p>
            </div>

            <div className="group p-6 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-blue-500/30 transition-all duration-300">
              <div className="w-12 h-12 bg-blue-100 text-blue-700 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <BrainCircuit className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-slate-900 mb-2">Asah Soft Skills</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Mengembangkan komunikasi efektif, problem solving, manajemen waktu, dan ketahanan mental (AQ).
              </p>
            </div>

            <div className="group p-6 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-yellow-500/30 transition-all duration-300">
              <div className="w-12 h-12 bg-yellow-100 text-yellow-700 rounded-xl flex items-center justify-center mb-4 group-hover:bg-yellow-500 group-hover:text-white transition-colors">
                <Network className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-slate-900 mb-2">Jaringan & Pendidikan</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Memperkenalkan nilai <strong>CADRE</strong> Mu'allimin dan mempererat silaturahmi antar institusi pendidikan se-DIY.
              </p>
            </div>
          </div>
        </div>

        {/* Target Peserta */}
        <div className="relative">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-100/60 border border-red-200 text-red-800 text-xs font-bold uppercase tracking-widest mb-3">
              Kategori & Kuota Lomba
            </div>
            <h3 className="text-3xl sm:text-4xl font-black text-slate-900 uppercase italic tracking-tight">
              Target Peserta <span className="text-red-700">Se-DIY</span>
            </h3>
            <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto mt-2 font-medium">
              Terbuka bagi pangkalan SD/MI dan SMP/MTs sederajat se-Daerah Istimewa Yogyakarta dengan kuota terbatas.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* SD Card */}
            <a
              href="#rules"
              className="group relative bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-lg hover:shadow-2xl hover:border-red-500/40 transition-all duration-300 flex flex-col justify-between overflow-hidden text-left cursor-pointer"
            >
              {/* Subtle decorative glow & watermark */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-red-100/60 via-red-50/20 to-transparent rounded-full blur-2xl -mr-12 -mt-12 pointer-events-none group-hover:scale-125 transition-transform duration-500"></div>
              <div className="absolute -right-1 bottom-4 text-7xl sm:text-8xl font-black text-red-950/[0.03] select-none pointer-events-none tracking-tighter">
                SD
              </div>

              <div className="relative z-10">
                {/* Header: Badge & Target Kuota */}
                <div className="flex items-start justify-between gap-4 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-red-700 text-white flex items-center justify-center shadow-md shadow-red-700/25 group-hover:scale-105 transition-transform">
                      <School className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="inline-block text-[11px] font-bold text-red-700 uppercase tracking-wider">
                        Tingkat Dasar
                      </span>
                      <h4 className="text-2xl font-black text-slate-900 tracking-tight leading-tight">
                        SD / MI
                      </h4>
                    </div>
                  </div>

                  <div className="text-right bg-red-50/90 border border-red-100 px-3.5 py-1.5 rounded-2xl shadow-xs">
                    <span className="text-[10px] font-black uppercase tracking-wider text-red-600 block">
                      Target Kuota
                    </span>
                    <p className="text-xl font-black text-slate-900 leading-none mt-0.5">
                      {COMPETITION.SD.TARGET_PLATOONS}{' '}
                      <span className="text-xs font-semibold text-slate-500">Peleton</span>
                    </p>
                  </div>
                </div>

                {/* Squad Composition: 3-column micro-cards */}
                <div className="mb-6">
                  <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-2.5">
                    <span className="uppercase tracking-wider">Komposisi Pasukan</span>
                    <span className="font-bold text-slate-700">Maks. 25 Orang</span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 sm:gap-3">
                    <div className="bg-slate-50 group-hover:bg-red-50/40 p-3 rounded-2xl border border-slate-100 group-hover:border-red-100 text-center transition-colors">
                      <div className="w-8 h-8 rounded-xl bg-red-100 text-red-700 flex items-center justify-center mx-auto mb-1.5 shadow-xs">
                        <UserCheck className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-black text-slate-900 block">1 Danton</span>
                      <span className="text-[11px] text-slate-500 font-medium">Komandan</span>
                    </div>

                    <div className="bg-slate-50 group-hover:bg-red-50/40 p-3 rounded-2xl border border-slate-100 group-hover:border-red-100 text-center transition-colors">
                      <div className="w-8 h-8 rounded-xl bg-red-100 text-red-700 flex items-center justify-center mx-auto mb-1.5 shadow-xs">
                        <Users className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-black text-slate-900 block">21 Pasukan</span>
                      <span className="text-[11px] text-slate-500 font-medium">Pasukan Inti</span>
                    </div>

                    <div className="bg-slate-50 group-hover:bg-red-50/40 p-3 rounded-2xl border border-slate-100 group-hover:border-red-100 text-center transition-colors">
                      <div className="w-8 h-8 rounded-xl bg-red-100 text-red-700 flex items-center justify-center mx-auto mb-1.5 shadow-xs">
                        <PlusCircle className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-black text-slate-900 block">3 Cadangan</span>
                      <span className="text-[11px] text-slate-500 font-medium">Pengganti</span>
                    </div>
                  </div>
                </div>

                {/* Technical Specs Row: Arena & Durasi */}
                <div className="grid grid-cols-2 gap-2.5 pt-2 pb-5 border-t border-slate-100">
                  <div className="flex items-center gap-2 text-xs text-slate-600 bg-slate-50/80 px-3 py-2 rounded-xl border border-slate-100">
                    <Maximize2 className="w-3.5 h-3.5 text-red-600 shrink-0" />
                    <span>Arena: <strong className="text-slate-800">{COMPETITION.SD.ARENA_SIZE}</strong></span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-600 bg-slate-50/80 px-3 py-2 rounded-xl border border-slate-100">
                    <Timer className="w-3.5 h-3.5 text-red-600 shrink-0" />
                    <span>Durasi: <strong className="text-slate-800">{COMPETITION.SD.DURATION_LABEL.replace('Durasi Max: ', '')}</strong></span>
                  </div>
                </div>
              </div>

              {/* Card Footer: Personnel Summary & Action Link */}
              <div className="relative z-10 pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-red-800 bg-red-100/90 px-3 py-1 rounded-lg">
                  Minimal Tampil: 22 Personil
                </span>
                <span className="text-xs font-bold text-red-700 flex items-center gap-1.5 group-hover:text-red-800">
                  Lihat Juknis SD <ArrowRight className="w-4 h-4 text-red-600 group-hover:translate-x-1.5 transition-transform" />
                </span>
              </div>
            </a>

            {/* SMP Card */}
            <a
              href="#rules"
              className="group relative bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-lg hover:shadow-2xl hover:border-blue-500/40 transition-all duration-300 flex flex-col justify-between overflow-hidden text-left cursor-pointer"
            >
              {/* Subtle decorative glow & watermark */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-blue-100/60 via-blue-50/20 to-transparent rounded-full blur-2xl -mr-12 -mt-12 pointer-events-none group-hover:scale-125 transition-transform duration-500"></div>
              <div className="absolute -right-1 bottom-4 text-7xl sm:text-8xl font-black text-blue-950/[0.03] select-none pointer-events-none tracking-tighter">
                SMP
              </div>

              <div className="relative z-10">
                {/* Header: Badge & Target Kuota */}
                <div className="flex items-start justify-between gap-4 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-blue-700 text-white flex items-center justify-center shadow-md shadow-blue-700/25 group-hover:scale-105 transition-transform">
                      <GraduationCap className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="inline-block text-[11px] font-bold text-blue-700 uppercase tracking-wider">
                        Tingkat Menengah
                      </span>
                      <h4 className="text-2xl font-black text-slate-900 tracking-tight leading-tight">
                        SMP / MTs
                      </h4>
                    </div>
                  </div>

                  <div className="text-right bg-blue-50/90 border border-blue-100 px-3.5 py-1.5 rounded-2xl shadow-xs">
                    <span className="text-[10px] font-black uppercase tracking-wider text-blue-600 block">
                      Target Kuota
                    </span>
                    <p className="text-xl font-black text-slate-900 leading-none mt-0.5">
                      {COMPETITION.SMP.TARGET_PLATOONS}{' '}
                      <span className="text-xs font-semibold text-slate-500">Peleton</span>
                    </p>
                  </div>
                </div>

                {/* Squad Composition: 3-column micro-cards */}
                <div className="mb-6">
                  <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-2.5">
                    <span className="uppercase tracking-wider">Komposisi Pasukan</span>
                    <span className="font-bold text-slate-700">Maks. 25 Orang</span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 sm:gap-3">
                    <div className="bg-slate-50 group-hover:bg-blue-50/40 p-3 rounded-2xl border border-slate-100 group-hover:border-blue-100 text-center transition-colors">
                      <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mx-auto mb-1.5 shadow-xs">
                        <UserCheck className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-black text-slate-900 block">1 Danton</span>
                      <span className="text-[11px] text-slate-500 font-medium">Komandan</span>
                    </div>

                    <div className="bg-slate-50 group-hover:bg-blue-50/40 p-3 rounded-2xl border border-slate-100 group-hover:border-blue-100 text-center transition-colors">
                      <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mx-auto mb-1.5 shadow-xs">
                        <Users className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-black text-slate-900 block">21 Pasukan</span>
                      <span className="text-[11px] text-slate-500 font-medium">Pasukan Inti</span>
                    </div>

                    <div className="bg-slate-50 group-hover:bg-blue-50/40 p-3 rounded-2xl border border-slate-100 group-hover:border-blue-100 text-center transition-colors">
                      <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mx-auto mb-1.5 shadow-xs">
                        <PlusCircle className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-black text-slate-900 block">3 Cadangan</span>
                      <span className="text-[11px] text-slate-500 font-medium">Pengganti</span>
                    </div>
                  </div>
                </div>

                {/* Technical Specs Row: Arena & Durasi */}
                <div className="grid grid-cols-2 gap-2.5 pt-2 pb-5 border-t border-slate-100">
                  <div className="flex items-center gap-2 text-xs text-slate-600 bg-slate-50/80 px-3 py-2 rounded-xl border border-slate-100">
                    <Maximize2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span>Arena: <strong className="text-slate-800">{COMPETITION.SMP.ARENA_SIZE}</strong></span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-600 bg-slate-50/80 px-3 py-2 rounded-xl border border-slate-100">
                    <Timer className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span>Durasi: <strong className="text-slate-800">{COMPETITION.SMP.DURATION_LABEL.replace('Durasi Max: ', '')}</strong></span>
                  </div>
                </div>
              </div>

              {/* Card Footer: Personnel Summary & Action Link */}
              <div className="relative z-10 pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-blue-800 bg-blue-100/90 px-3 py-1 rounded-lg">
                  Minimal Tampil: 22 Personil
                </span>
                <span className="text-xs font-bold text-blue-700 flex items-center gap-1.5 group-hover:text-blue-800">
                  Lihat Juknis SMP <ArrowRight className="w-4 h-4 text-blue-600 group-hover:translate-x-1.5 transition-transform" />
                </span>
              </div>
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
