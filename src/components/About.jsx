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
            <span className="block sm:whitespace-nowrap">
              Membangun{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-amber-400 to-yellow-400">
                Generasi Unggul
              </span>
            </span>
            <span className="block sm:whitespace-nowrap mt-1">
              Berkarakter{' '}
              <span className="text-amber-400 font-extrabold">Ksatria</span>
            </span>
          </h2>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-medium max-w-3xl mx-auto">
            <strong className="text-white">LBB Mu'allimin 2027</strong> hadir sebagai manifestasi peran historis Madrasah Mu'allimin sejak 1918. Mengusung tema resmi <em className="text-amber-300 font-bold">"SEMANGAT SEBAGAI KSATRIA, BERJUANG DENGAN GEMBIRA"</em>, kawah candradimuka penempa Profil Pelajar Pancasila dan Kader Bangsa berlandaskan nilai CADRE (Creative, Active, Discipline, Religious, Entrepreneur).
          </p>
        </div>

        {/* Showcase Tema Resmi 2027 & Target Peserta Se-DIY */}
        <div className="max-w-6xl mx-auto space-y-8 lg:space-y-10">
          
          {/* ========================================================
              1. SHOWCASE TEMA RESMI 2027 (PREMIUM GLASS HERO BANNER)
              ======================================================== */}
          <div className="relative rounded-3xl bg-gradient-to-b from-slate-900/90 via-slate-900/80 to-slate-950/95 border border-white/10 shadow-2xl backdrop-blur-xl p-6 sm:p-8 lg:p-10 overflow-hidden">
            {/* Ambient Background Glows */}
            <div className="absolute -top-24 -left-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute inset-0 bg-carbon-pattern opacity-10 pointer-events-none" />
            <Shield className="absolute -right-10 -bottom-10 text-white/[0.03] w-64 h-64 pointer-events-none select-none" />

            <div className="relative z-10">
              {/* Header Bar: Badge, Master Theme Title, & Official Logo */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/10">
                <div className="space-y-2.5">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-300 text-[11px] font-bold uppercase tracking-widest">
                    <Shield className="w-3.5 h-3.5 text-amber-400" />
                    <span>Tema Resmi LBB Mu'allimin 2027</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-black uppercase italic tracking-tight leading-tight">
                    <span className="block text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-slate-300">
                      SEMANGAT SEBAGAI KSATRIA,
                    </span>
                    <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500">
                      BERJUANG DENGAN GEMBIRA
                    </span>
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 max-w-2xl font-medium leading-relaxed">
                    Jiwa dan pedoman kehormatan seluruh kontingen dalam menumbuhkan karakter tangguh, kedisiplinan ksatria, dan sportivitas barisan.
                  </p>
                </div>

                {/* Logo LBB 2027 (Tanpa Wadah - Ukuran Lebih Besar) */}
                <div className="shrink-0 flex items-center justify-center self-start md:self-auto group">
                  <img
                    src={logoLbb}
                    alt="Logo LBB Mu'allimin 2027"
                    className="w-20 h-20 sm:w-28 sm:h-28 md:w-36 md:h-36 object-contain drop-shadow-[0_12px_28px_rgba(0,0,0,0.65)] filter brightness-105 group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </div>

              {/* 2 Philosophy Pillars */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 pt-6">
                {/* Pilar 1 */}
                <div className="group rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-amber-500/20 hover:border-amber-500/40 p-4 sm:p-5 transition-all duration-300 shadow-sm">
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition-transform">
                      <HeartHandshake className="w-5 h-5" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-bold text-sm sm:text-base text-white">Semangat Sebagai Ksatria</h4>
                      <p className="text-xs text-slate-300 leading-relaxed font-normal">
                        Menempa karakter kepemimpinan, integritas, kedisiplinan murni, keteguhan hati, dan mental pantang menyerah di setiap langkah barisan.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Pilar 2 */}
                <div className="group rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-rose-500/20 hover:border-rose-500/40 p-4 sm:p-5 transition-all duration-300 shadow-sm">
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-rose-500/20 to-rose-600/10 border border-rose-500/30 text-rose-400 flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition-transform">
                      <Activity className="w-5 h-5" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-bold text-sm sm:text-base text-white">Berjuang Dengan Gembira</h4>
                      <p className="text-xs text-slate-300 leading-relaxed font-normal">
                        Daya juang barisan PBB yang dijalani penuh sukacita, optimisme, sportivitas persaudaraan, dan energi positif untuk meraih prestasi tertinggi.
                      </p>
                    </div>
                  </div>
                </div>
              </div>



            </div>
          </div>

          {/* ========================================================
              2. TARGET PESERTA SE-DIY (SD/MI & SMP/MTs)
              ======================================================== */}
          <div className="space-y-4">
            
            {/* Header Target Peserta */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-1">
              <div className="flex items-center gap-2.5">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </span>
                <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-200">
                  Target Peserta & Kuota Kejuaraan Se-DIY
                </h3>
              </div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-semibold self-start sm:self-auto">
                <span>Kuota Terbatas: 36 Peleton</span>
              </div>
            </div>

            {/* 2 Kolom Card Target SD & SMP */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6">
              
              {/* SD / MI Card */}
              <div className="group relative bg-gradient-to-b from-slate-900/90 via-slate-900/80 to-slate-950/95 rounded-3xl p-6 sm:p-7 border border-red-500/20 hover:border-red-500/50 shadow-xl backdrop-blur-xl transition-all duration-300 flex flex-col justify-between overflow-hidden">
                {/* Accent Background Glow */}
                <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-red-600/15 via-red-900/10 to-transparent rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition-transform duration-500" />
                <div className="absolute -right-2 bottom-3 text-7xl font-black text-white/[0.03] select-none pointer-events-none tracking-tighter">
                  SD
                </div>

                <div className="relative z-10 space-y-5">
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-600 to-red-800 text-white flex items-center justify-center shadow-lg shadow-red-700/25 group-hover:scale-105 transition-transform">
                        <School className="w-6 h-6" />
                      </div>
                      <div>
                        <span className="inline-block text-[10px] font-bold text-red-400 uppercase tracking-widest">
                          Tingkat Dasar
                        </span>
                        <h4 className="text-xl font-black text-white tracking-tight leading-tight">
                          SD / MI
                        </h4>
                      </div>
                    </div>

                    <div className="text-right bg-red-950/60 border border-red-500/30 px-3 py-1.5 rounded-2xl">
                      <span className="text-[9px] font-black uppercase tracking-wider text-red-400 block">
                        Target Kuota
                      </span>
                      <p className="text-lg font-black text-white leading-none mt-0.5">
                        {COMPETITION.SD.TARGET_PLATOONS}{' '}
                        <span className="text-[11px] font-semibold text-slate-300">Peleton</span>
                      </p>
                    </div>
                  </div>

                  {/* Platoon Composition */}
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                      Komposisi Pasukan Resmi (25 Personel)
                    </span>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="bg-white/[0.04] group-hover:bg-red-950/30 p-2.5 rounded-xl border border-white/5 transition-colors">
                        <UserCheck className="w-4 h-4 text-red-400 mx-auto mb-1" />
                        <span className="text-xs sm:text-sm font-black text-white block">1 Danton</span>
                        <span className="text-[10px] text-slate-400">Komandan</span>
                      </div>
                      <div className="bg-white/[0.04] group-hover:bg-red-950/30 p-2.5 rounded-xl border border-white/5 transition-colors">
                        <Users className="w-4 h-4 text-red-400 mx-auto mb-1" />
                        <span className="text-xs sm:text-sm font-black text-white block">21 Pasukan</span>
                        <span className="text-[10px] text-slate-400">Pasukan Inti</span>
                      </div>
                      <div className="bg-white/[0.04] group-hover:bg-red-950/30 p-2.5 rounded-xl border border-white/5 transition-colors">
                        <PlusCircle className="w-4 h-4 text-red-400 mx-auto mb-1" />
                        <span className="text-xs sm:text-sm font-black text-white block">3 Cadangan</span>
                        <span className="text-[10px] text-slate-400">Pengganti</span>
                      </div>
                    </div>
                  </div>

                  {/* Arena & Time Specs */}
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10 text-xs text-slate-300">
                    <div className="flex items-center gap-2 bg-white/[0.03] px-3 py-2 rounded-xl border border-white/5">
                      <Maximize2 className="w-4 h-4 text-red-400 shrink-0" />
                      <div>
                        <span className="text-[10px] text-slate-400 block">Ukuran Arena</span>
                        <strong className="text-white font-bold">{COMPETITION.SD.ARENA_SIZE}</strong>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 bg-white/[0.03] px-3 py-2 rounded-xl border border-white/5">
                      <Timer className="w-4 h-4 text-red-400 shrink-0" />
                      <div>
                        <span className="text-[10px] text-slate-400 block">Waktu Tampil</span>
                        <strong className="text-white font-bold">{COMPETITION.SD.DURATION_LABEL.replace('Durasi Max: ', '')}</strong>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card CTA Link */}
                <div className="relative z-10 pt-4 mt-4 border-t border-white/10">
                  <a
                    href="#rules"
                    className="w-full py-2.5 px-4 rounded-xl bg-red-600/10 hover:bg-red-600 border border-red-500/30 hover:border-red-500 text-red-300 hover:text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all duration-200 group/btn shadow-sm"
                  >
                    <span>Lihat Petunjuk Teknis SD / MI</span>
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </a>
                </div>
              </div>

              {/* SMP / MTs Card */}
              <div className="group relative bg-gradient-to-b from-slate-900/90 via-slate-900/80 to-slate-950/95 rounded-3xl p-6 sm:p-7 border border-blue-500/20 hover:border-blue-500/50 shadow-xl backdrop-blur-xl transition-all duration-300 flex flex-col justify-between overflow-hidden">
                {/* Accent Background Glow */}
                <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-blue-600/15 via-blue-900/10 to-transparent rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition-transform duration-500" />
                <div className="absolute -right-2 bottom-3 text-7xl font-black text-white/[0.03] select-none pointer-events-none tracking-tighter">
                  SMP
                </div>

                <div className="relative z-10 space-y-5">
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 text-white flex items-center justify-center shadow-lg shadow-blue-700/25 group-hover:scale-105 transition-transform">
                        <GraduationCap className="w-6 h-6" />
                      </div>
                      <div>
                        <span className="inline-block text-[10px] font-bold text-blue-400 uppercase tracking-widest">
                          Tingkat Menengah
                        </span>
                        <h4 className="text-xl font-black text-white tracking-tight leading-tight">
                          SMP / MTs
                        </h4>
                      </div>
                    </div>

                    <div className="text-right bg-blue-950/60 border border-blue-500/30 px-3 py-1.5 rounded-2xl">
                      <span className="text-[9px] font-black uppercase tracking-wider text-blue-400 block">
                        Target Kuota
                      </span>
                      <p className="text-lg font-black text-white leading-none mt-0.5">
                        {COMPETITION.SMP.TARGET_PLATOONS}{' '}
                        <span className="text-[11px] font-semibold text-slate-300">Peleton</span>
                      </p>
                    </div>
                  </div>

                  {/* Platoon Composition */}
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                      Komposisi Pasukan Resmi (25 Personel)
                    </span>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="bg-white/[0.04] group-hover:bg-blue-950/30 p-2.5 rounded-xl border border-white/5 transition-colors">
                        <UserCheck className="w-4 h-4 text-blue-400 mx-auto mb-1" />
                        <span className="text-xs sm:text-sm font-black text-white block">1 Danton</span>
                        <span className="text-[10px] text-slate-400">Komandan</span>
                      </div>
                      <div className="bg-white/[0.04] group-hover:bg-blue-950/30 p-2.5 rounded-xl border border-white/5 transition-colors">
                        <Users className="w-4 h-4 text-blue-400 mx-auto mb-1" />
                        <span className="text-xs sm:text-sm font-black text-white block">21 Pasukan</span>
                        <span className="text-[10px] text-slate-400">Pasukan Inti</span>
                      </div>
                      <div className="bg-white/[0.04] group-hover:bg-blue-950/30 p-2.5 rounded-xl border border-white/5 transition-colors">
                        <PlusCircle className="w-4 h-4 text-blue-400 mx-auto mb-1" />
                        <span className="text-xs sm:text-sm font-black text-white block">3 Cadangan</span>
                        <span className="text-[10px] text-slate-400">Pengganti</span>
                      </div>
                    </div>
                  </div>

                  {/* Arena & Time Specs */}
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10 text-xs text-slate-300">
                    <div className="flex items-center gap-2 bg-white/[0.03] px-3 py-2 rounded-xl border border-white/5">
                      <Maximize2 className="w-4 h-4 text-blue-400 shrink-0" />
                      <div>
                        <span className="text-[10px] text-slate-400 block">Ukuran Arena</span>
                        <strong className="text-white font-bold">{COMPETITION.SMP.ARENA_SIZE}</strong>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 bg-white/[0.03] px-3 py-2 rounded-xl border border-white/5">
                      <Timer className="w-4 h-4 text-blue-400 shrink-0" />
                      <div>
                        <span className="text-[10px] text-slate-400 block">Waktu Tampil</span>
                        <strong className="text-white font-bold">{COMPETITION.SMP.DURATION_LABEL.replace('Durasi Max: ', '')}</strong>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card CTA Link */}
                <div className="relative z-10 pt-4 mt-4 border-t border-white/10">
                  <a
                    href="#rules"
                    className="w-full py-2.5 px-4 rounded-xl bg-blue-600/10 hover:bg-blue-600 border border-blue-500/30 hover:border-blue-500 text-blue-300 hover:text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all duration-200 group/btn shadow-sm"
                  >
                    <span>Lihat Petunjuk Teknis SMP / MTs</span>
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </a>
                </div>
              </div>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
