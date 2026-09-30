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
import logoLbb from '../assets/logo-tonti.png';

const ABOUT_BG_PHOTO = {
  webp: '/section-tentang.webp',
  fallback: '/section-tentang.jpg'
};

export default function About() {
  return (
    <section 
      id="about" 
      className="pt-24 sm:pt-32 pb-[420px] sm:pb-[560px] md:pb-[660px] lg:pb-[780px] bg-slate-950 relative overflow-hidden font-sans isolate text-white"
    >
      {/* 1. Background: 1 Foto Utuh Proporsional (Tanpa Zoom/Crop, Bawah Jelas) */}
      <div className="absolute inset-x-0 bottom-0 z-0 pointer-events-none overflow-hidden select-none">
        <picture>
          <source srcSet={ABOUT_BG_PHOTO.webp} type="image/webp" />
          <img
            src={ABOUT_BG_PHOTO.fallback}
            alt="Dokumentasi Peleton Inti Tonti Mu'allimin"
            className="w-full h-auto max-w-none block filter brightness-100 contrast-105"
            loading="lazy"
          />
        </picture>

        {/* Gradient Overlay: Bawah terbuka transparan, semakin ke atas memudar halus ke latar gelap section */}
        <div className="absolute inset-0 bg-gradient-to-t from-transparent from-20% via-slate-950/60 via-55% to-slate-950 to-85%" />
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-slate-950 to-transparent" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="max-w-4xl mx-auto text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center justify-center gap-2 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-red-900/50 border border-red-500/30 text-red-200 text-[10px] sm:text-xs font-bold uppercase tracking-wider sm:tracking-widest mb-5 max-w-full text-center leading-normal">
            <Scroll className="w-3.5 h-3.5 shrink-0 text-amber-400" />
            <span className="truncate sm:whitespace-normal">Dasar Pelaksanaan: QS. As-Saff Ayat 4</span>
          </div>

          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-white uppercase italic tracking-tighter mb-4 leading-tight py-1">
            <span className="block whitespace-nowrap">
              Membangun{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-amber-400 to-yellow-400">
                Generasi Unggul
              </span>
            </span>
            <span className="block whitespace-nowrap mt-1">
              Berkarakter{' '}
              <span className="relative inline-block pr-2 pb-1">
                <span className="relative z-10 text-amber-400 font-extrabold">Ksatria</span>
                <svg
                  className="absolute w-full h-3 -bottom-1 left-0 text-amber-400 -z-0"
                  viewBox="0 0 100 10"
                  preserveAspectRatio="none"
                >
                  <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" opacity="0.7" />
                </svg>
              </span>
            </span>
          </h2>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-medium max-w-3xl mx-auto">
            <strong className="text-white">LBB Mu'allimin 2027</strong> hadir sebagai manifestasi peran historis Madrasah Mu'allimin sejak 1918. Mengusung tema resmi <em className="text-amber-300 font-bold">"SEMANGAT SEBAGAI KSATRIA, BERJUANG DENGAN GEMBIRA"</em>, kawah candradimuka penempa Profil Pelajar Pancasila dan Kader Bangsa berlandaskan nilai CADRE (Creative, Active, Discipline, Religious, Entrepreneur).
          </p>
        </div>

        {/* 2-Column Section Layout: Ketinggian Seimbang & Sejajar */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
          
          {/* KOLOM KIRI: Tema Resmi & Nilai Filosofis */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            {/* Header Level Sejajar dengan Kanan */}
            <div className="flex items-center justify-between gap-3 mb-4 h-6">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-amber-400"></div>
                <h4 className="text-xs sm:text-sm font-bold uppercase tracking-widest text-slate-200">
                  Landasan & Filosofi
                </h4>
              </div>
              <span className="text-[11px] font-semibold text-amber-300 bg-amber-500/15 border border-amber-500/30 px-3 py-1 rounded-full">
                Edisi 2027
              </span>
            </div>

            <div className="relative bg-slate-900/90 backdrop-blur-md text-white p-5 sm:p-6 rounded-3xl shadow-2xl border border-white/10 overflow-hidden flex flex-col justify-between flex-1">
              <div className="absolute inset-0 bg-carbon-pattern opacity-20 pointer-events-none"></div>
              <Shield className="absolute -right-8 -bottom-8 text-white/5 w-48 h-48 pointer-events-none" />

              <div className="relative z-10">
                {/* Header Tema dengan Logo LBB di kanan */}
                <div className="pb-4 border-b border-white/10 flex items-center justify-between gap-4">
                  <div>
                    <span className="text-yellow-400 font-bold tracking-[0.3em] text-[10px] sm:text-[11px] uppercase mb-1 block">Tema Resmi 2027</span>
                    <h3 className="text-base sm:text-lg font-black uppercase italic leading-snug py-0.5">
                      <span className="block pb-0.5 text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-200">SEMANGAT SEBAGAI KSATRIA,</span>
                      <span className="block text-yellow-400">BERJUANG DENGAN GEMBIRA</span>
                    </h3>
                  </div>

                  <img
                    src={logoLbb}
                    alt="Logo LBB Mu'allimin"
                    className="shrink-0 w-12 h-12 sm:w-14 sm:h-14 object-contain drop-shadow-md hover:scale-105 transition-transform"
                  />
                </div>

                {/* Nilai-Nilai Tema */}
                <div className="py-3.5 space-y-2.5">
                  <div className="flex gap-3 items-start p-3 rounded-2xl bg-white/[0.04] border border-white/5 hover:border-white/10 transition-colors">
                    <div className="w-8 h-8 rounded-xl bg-yellow-500/10 flex items-center justify-center shrink-0 border border-yellow-500/20 text-yellow-400 shadow-sm mt-0.5">
                      <HeartHandshake className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs sm:text-sm text-white">Semangat Sebagai Ksatria (Internal)</h4>
                      <p className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">Menempa integritas, kehormatan, disiplin, kepemimpinan melayani, dan pantang menyerah.</p>
                    </div>
                  </div>

                  <div className="flex gap-3 items-start p-3 rounded-2xl bg-white/[0.04] border border-white/5 hover:border-white/10 transition-colors">
                    <div className="w-8 h-8 rounded-xl bg-yellow-500/10 flex items-center justify-center shrink-0 border border-yellow-500/20 text-yellow-400 shadow-sm mt-0.5">
                      <Activity className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs sm:text-sm text-white">Berjuang Dengan Gembira (Sikap & Energi)</h4>
                      <p className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">Daya juang barisan PBB yang dijalani dengan sukacita, sportivitas, dan energi positif.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tujuan & Manfaat (3 Badges Horizontal Kompak) */}
              <div className="relative z-10 pt-3 border-t border-white/10">
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-2 rounded-xl bg-white/[0.03] border border-white/5">
                    <Trophy className="w-3.5 h-3.5 text-red-400 mx-auto mb-1" />
                    <span className="text-[10px] font-bold text-slate-200 block truncate">Sportivitas</span>
                    <span className="text-[8px] text-slate-400 hidden sm:block">Kompetisi Sehat</span>
                  </div>
                  <div className="p-2 rounded-xl bg-white/[0.03] border border-white/5">
                    <BrainCircuit className="w-3.5 h-3.5 text-blue-400 mx-auto mb-1" />
                    <span className="text-[10px] font-bold text-slate-200 block truncate">Soft Skills</span>
                    <span className="text-[8px] text-slate-400 hidden sm:block">Mental Juang</span>
                  </div>
                  <div className="p-2 rounded-xl bg-white/[0.03] border border-white/5">
                    <Network className="w-3.5 h-3.5 text-yellow-400 mx-auto mb-1" />
                    <span className="text-[10px] font-bold text-slate-200 block truncate">Kader 1918</span>
                    <span className="text-[8px] text-slate-400 hidden sm:block">Nilai CADRE</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* KOLOM KANAN: Target Peserta SD & SMP (Tinggi Seimbang) */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            
            {/* Header Label Target */}
            <div className="flex items-center justify-between gap-3 mb-4 h-6">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></div>
                <h4 className="text-xs sm:text-sm font-bold uppercase tracking-widest text-slate-200">
                  Target Peserta Se-DIY
                </h4>
              </div>
              <span className="text-[11px] font-semibold text-amber-300 bg-amber-500/15 border border-amber-500/30 px-3 py-1 rounded-full">
                Kuota Terbatas: 36 Peleton
              </span>
            </div>

            {/* 2 Kolom Card Target SD & SMP */}
            <div className="grid sm:grid-cols-2 gap-4 sm:gap-5 flex-1">
              {/* SD Card */}
              <a
                href="#rules"
                className="group relative bg-slate-900/85 backdrop-blur-md rounded-3xl p-5 sm:p-6 border border-white/10 shadow-xl hover:border-red-500/50 hover:bg-slate-900/95 transition-all duration-300 flex flex-col justify-between overflow-hidden text-left cursor-pointer"
              >
                <div className="absolute top-0 right-0 w-36 h-36 bg-gradient-to-bl from-red-600/15 via-red-900/10 to-transparent rounded-full blur-xl pointer-events-none group-hover:scale-125 transition-transform duration-500"></div>
                <div className="absolute -right-1 bottom-2 text-6xl font-black text-white/[0.04] select-none pointer-events-none tracking-tighter">
                  SD
                </div>

                <div className="relative z-10">
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 to-red-800 text-white flex items-center justify-center shadow-md shadow-red-700/30 group-hover:scale-105 transition-transform">
                        <School className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="inline-block text-[10px] font-bold text-red-400 uppercase tracking-wider">
                          Tingkat Dasar
                        </span>
                        <h4 className="text-lg font-black text-white tracking-tight leading-tight">
                          SD / MI
                        </h4>
                      </div>
                    </div>

                    <div className="text-right bg-red-950/60 border border-red-500/30 px-2.5 py-1 rounded-xl">
                      <span className="text-[9px] font-black uppercase tracking-wider text-red-400 block">
                        Target
                      </span>
                      <p className="text-base font-black text-white leading-none mt-0.5">
                        {COMPETITION.SD.TARGET_PLATOONS}{' '}
                        <span className="text-[10px] font-semibold text-slate-400">Peleton</span>
                      </p>
                    </div>
                  </div>

                  {/* Squad Composition */}
                  <div className="grid grid-cols-3 gap-1.5 mb-3.5 text-center">
                    <div className="bg-white/[0.04] group-hover:bg-red-950/40 p-2 rounded-xl border border-white/5 transition-colors">
                      <UserCheck className="w-3.5 h-3.5 text-red-400 mx-auto mb-1" />
                      <span className="text-xs font-black text-white block">1 Danton</span>
                      <span className="text-[9px] text-slate-400">Komandan</span>
                    </div>
                    <div className="bg-white/[0.04] group-hover:bg-red-950/40 p-2 rounded-xl border border-white/5 transition-colors">
                      <Users className="w-3.5 h-3.5 text-red-400 mx-auto mb-1" />
                      <span className="text-xs font-black text-white block">21 Pasukan</span>
                      <span className="text-[9px] text-slate-400">Inti</span>
                    </div>
                    <div className="bg-white/[0.04] group-hover:bg-red-950/40 p-2 rounded-xl border border-white/5 transition-colors">
                      <PlusCircle className="w-3.5 h-3.5 text-red-400 mx-auto mb-1" />
                      <span className="text-xs font-black text-white block">3 Cadangan</span>
                      <span className="text-[9px] text-slate-400">Pengganti</span>
                    </div>
                  </div>

                  {/* Specs */}
                  <div className="grid grid-cols-2 gap-1.5 pt-2 pb-2.5 border-t border-white/10 text-[11px] text-slate-300">
                    <div className="flex items-center gap-1 bg-white/[0.03] px-2 py-1.5 rounded-lg border border-white/5">
                      <Maximize2 className="w-3 h-3 text-red-400 shrink-0" />
                      <span className="truncate">Arena: <strong className="text-white">{COMPETITION.SD.ARENA_SIZE}</strong></span>
                    </div>
                    <div className="flex items-center gap-1 bg-white/[0.03] px-2 py-1.5 rounded-lg border border-white/5">
                      <Timer className="w-3 h-3 text-red-400 shrink-0" />
                      <span className="truncate">Durasi: <strong className="text-white">{COMPETITION.SD.DURATION_LABEL.replace('Durasi Max: ', '')}</strong></span>
                    </div>
                  </div>
                </div>

                <div className="relative z-10 pt-2.5 border-t border-white/10 flex items-center justify-end">
                  <span className="text-[11px] font-bold text-red-400 flex items-center gap-1 group-hover:text-red-300">
                    Lihat Juknis SD <ArrowRight className="w-3.5 h-3.5 text-red-400 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </a>

              {/* SMP Card */}
              <a
                href="#rules"
                className="group relative bg-slate-900/85 backdrop-blur-md rounded-3xl p-5 sm:p-6 border border-white/10 shadow-xl hover:border-blue-500/50 hover:bg-slate-900/95 transition-all duration-300 flex flex-col justify-between overflow-hidden text-left cursor-pointer"
              >
                <div className="absolute top-0 right-0 w-36 h-36 bg-gradient-to-bl from-blue-600/15 via-blue-900/10 to-transparent rounded-full blur-xl pointer-events-none group-hover:scale-125 transition-transform duration-500"></div>
                <div className="absolute -right-1 bottom-2 text-6xl font-black text-white/[0.04] select-none pointer-events-none tracking-tighter">
                  SMP
                </div>

                <div className="relative z-10">
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-blue-800 text-white flex items-center justify-center shadow-md shadow-blue-700/30 group-hover:scale-105 transition-transform">
                        <GraduationCap className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="inline-block text-[10px] font-bold text-blue-400 uppercase tracking-wider">
                          Tingkat Menengah
                        </span>
                        <h4 className="text-lg font-black text-white tracking-tight leading-tight">
                          SMP / MTs
                        </h4>
                      </div>
                    </div>

                    <div className="text-right bg-blue-950/60 border border-blue-500/30 px-2.5 py-1 rounded-xl">
                      <span className="text-[9px] font-black uppercase tracking-wider text-blue-400 block">
                        Target
                      </span>
                      <p className="text-base font-black text-white leading-none mt-0.5">
                        {COMPETITION.SMP.TARGET_PLATOONS}{' '}
                        <span className="text-[10px] font-semibold text-slate-400">Peleton</span>
                      </p>
                    </div>
                  </div>

                  {/* Squad Composition */}
                  <div className="grid grid-cols-3 gap-1.5 mb-3.5 text-center">
                    <div className="bg-white/[0.04] group-hover:bg-blue-950/40 p-2 rounded-xl border border-white/5 transition-colors">
                      <UserCheck className="w-3.5 h-3.5 text-blue-400 mx-auto mb-1" />
                      <span className="text-xs font-black text-white block">1 Danton</span>
                      <span className="text-[9px] text-slate-400">Komandan</span>
                    </div>
                    <div className="bg-white/[0.04] group-hover:bg-blue-950/40 p-2 rounded-xl border border-white/5 transition-colors">
                      <Users className="w-3.5 h-3.5 text-blue-400 mx-auto mb-1" />
                      <span className="text-xs font-black text-white block">21 Pasukan</span>
                      <span className="text-[9px] text-slate-400">Inti</span>
                    </div>
                    <div className="bg-white/[0.04] group-hover:bg-blue-950/40 p-2 rounded-xl border border-white/5 transition-colors">
                      <PlusCircle className="w-3.5 h-3.5 text-blue-400 mx-auto mb-1" />
                      <span className="text-xs font-black text-white block">3 Cadangan</span>
                      <span className="text-[9px] text-slate-400">Pengganti</span>
                    </div>
                  </div>

                  {/* Specs */}
                  <div className="grid grid-cols-2 gap-1.5 pt-2 pb-2.5 border-t border-white/10 text-[11px] text-slate-300">
                    <div className="flex items-center gap-1 bg-white/[0.03] px-2 py-1.5 rounded-lg border border-white/5">
                      <Maximize2 className="w-3 h-3 text-blue-400 shrink-0" />
                      <span className="truncate">Arena: <strong className="text-white">{COMPETITION.SMP.ARENA_SIZE}</strong></span>
                    </div>
                    <div className="flex items-center gap-1 bg-white/[0.03] px-2 py-1.5 rounded-lg border border-white/5">
                      <Timer className="w-3 h-3 text-blue-400 shrink-0" />
                      <span className="truncate">Durasi: <strong className="text-white">{COMPETITION.SMP.DURATION_LABEL.replace('Durasi Max: ', '')}</strong></span>
                    </div>
                  </div>
                </div>

                <div className="relative z-10 pt-2.5 border-t border-white/10 flex items-center justify-end">
                  <span className="text-[11px] font-bold text-blue-400 flex items-center gap-1 group-hover:text-blue-300">
                    Lihat Juknis SMP <ArrowRight className="w-3.5 h-3.5 text-blue-400 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </a>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
