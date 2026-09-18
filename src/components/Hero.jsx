import React, { useState, useEffect } from 'react';
import { ArrowRight, Download, ChevronsDown } from 'lucide-react';
import { HERO, EVENT, VENUE } from '../config.js';
import { useCompetition } from '../context/CompetitionContext.jsx';
import logoImg from '../assets/logo-tonti.png';
import logoTonti from '../assets/logo-tonti-muallimin.png';
import logoMuallimin from '../assets/logo-muallimin.png';

const CADET_FIGURES = [
  {
    src: '/fotoslide/1.png',
    title: 'Paskibra Mu\'allimin 1',
    isLandscape: true,
  },
  {
    src: '/fotoslide/2.png',
    title: 'Paskibra Mu\'allimin 2',
    isLandscape: false,
  },
  {
    src: '/fotoslide/3.png',
    title: 'Paskibra Mu\'allimin 3',
    isLandscape: false,
  },
  {
    src: '/fotoslide/4.png',
    title: 'Paskibra Mu\'allimin 4',
    isLandscape: true,
  },
  {
    src: '/fotoslide/5.png',
    title: 'Paskibra Mu\'allimin 5',
    isLandscape: false,
  },
];

export default function Hero() {
  const { openModal, setActiveView, settings } = useCompetition();
  const [activeCadetIndex, setActiveCadetIndex] = useState(0);

  const regRangeText = settings?.eventDates?.registrationRangeText || EVENT.REGISTRATION_RANGE;

  // Preload remaining slides when browser is idle, and auto-rotate cadet illustration every 6 seconds
  useEffect(() => {
    const preloadRest = () => {
      // Preload after initial paint
      CADET_FIGURES.slice(1).forEach(cadet => {
        const img = new Image();
        img.src = cadet.src;
      });
    };

    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(preloadRest, { timeout: 2500 });
    } else {
      setTimeout(preloadRest, 1200);
    }

    const timer = setInterval(() => {
      setActiveCadetIndex(prev => (prev + 1) % CADET_FIGURES.length);
    }, 6000);

    return () => clearInterval(timer);
  }, []);

  function scrollToAbout() {
    const el = document.getElementById('about');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }

  const currentCadet = CADET_FIGURES[activeCadetIndex];
  const isLandscape = currentCadet.isLandscape;

  return (
    <section
      id="home"
      className="relative w-full min-h-screen supports-[height:100svh]:min-h-[100svh] flex flex-col items-center justify-center bg-gradient-to-b from-[#3a0505] via-[#6d0a0a] to-[#200202] text-white overflow-hidden isolate pt-24 pb-16"
    >
      {/* Atmospheric Background & Lighting (Clean Pure CSS, No Video Play Icons) */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden select-none" aria-hidden="true">
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/45 to-black/95"></div>
        {/* Animated radial smoke & spotlights */}
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-red-600/20 blur-[160px] rounded-full pointer-events-none animate-pulse-slow"></div>
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[650px] h-[650px] bg-amber-500/15 blur-[160px] rounded-full pointer-events-none"></div>
        <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-red-800/25 blur-[180px] rounded-full pointer-events-none"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10 flex flex-col justify-center h-full my-auto">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center w-full max-w-7xl mx-auto">

          {/* Left Columns: Text Content & Actions */}
          <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left space-y-5 sm:space-y-6">
            
            {/* Logo Group in Hero Section: Big LBB Logo + Smaller White Mu'allimin Logo */}
            <div className="flex items-center gap-4 sm:gap-6">
              {/* Logo Utama LBB Mu'allimin 2026 */}
              <div className="relative group transition-transform duration-300 hover:scale-105">
                <div className="absolute -inset-2 bg-gradient-to-r from-red-600/30 via-yellow-500/20 to-amber-500/30 rounded-2xl blur-xl opacity-60 group-hover:opacity-100 transition-opacity pointer-events-none" />
                <img
                  src={logoImg}
                  alt="Logo Resmi LBB Mu'allimin 2026"
                  className="relative h-20 sm:h-24 md:h-28 w-auto object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.65)] filter brightness-110"
                  width="140"
                  height="140"
                  loading="eager"
                />
              </div>

              {/* Garis Pemisah Halus */}
              <div className="h-12 sm:h-16 w-px bg-gradient-to-b from-transparent via-white/30 to-transparent" />

              {/* Logo Madrasah Mu'allimin (Lebih Kecil & Warna Putih) */}
              <div className="relative group transition-transform duration-300 hover:scale-105 opacity-90 hover:opacity-100">
                <img
                  src={logoMuallimin}
                  alt="Logo Madrasah Mu'allimin Muhammadiyah Yogyakarta"
                  className="h-10 sm:h-12 md:h-14 w-auto object-contain filter brightness-0 invert drop-shadow-[0_4px_12px_rgba(255,255,255,0.25)]"
                  loading="eager"
                />
              </div>
            </div>

            {/* Event Registration Status Badge */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 bg-black/50 border border-white/15 rounded-full backdrop-blur-md shadow-sm cursor-default">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
              </span>
              <span className="text-[10px] sm:text-xs font-bold tracking-widest uppercase text-slate-200">
                Pendaftaran: {regRangeText}
              </span>
            </div>

            {/* Main Title - Original LBB Mu'allimin Styling */}
            <div className="space-y-1">
              <h1 className="font-black uppercase tracking-tight flex flex-col select-none">
                <span className="block text-3xl sm:text-5xl md:text-6xl font-black text-white drop-shadow-md">
                  {HERO.TITLE_LINE1}
                </span>
                <span className="block text-4xl sm:text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-500 drop-shadow-lg">
                  {HERO.TITLE_LINE2}
                </span>
              </h1>
            </div>

            {/* Subtitle */}
            <p
              className="text-sm sm:text-base md:text-lg text-slate-200/90 font-normal leading-relaxed max-w-xl"
              dangerouslySetInnerHTML={{ __html: HERO.SUBTITLE }}
            />

            {/* Primary Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => openModal('regWizard')}
                className="group px-8 py-3.5 bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 hover:from-yellow-300 hover:to-amber-400 text-slate-950 font-black rounded-xl shadow-lg shadow-yellow-500/25 hover:shadow-yellow-500/40 hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 text-xs sm:text-sm tracking-widest uppercase cursor-pointer active:scale-95"
              >
                <span>Daftar Sekarang</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                type="button"
                onClick={() => openModal('docViewer', { docId: 'juknis' })}
                className="group px-8 py-3.5 bg-black/40 hover:bg-black/60 text-white hover:text-yellow-400 border border-white/20 hover:border-yellow-400/50 rounded-xl backdrop-blur-md shadow-lg shadow-black/20 hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 text-xs sm:text-sm font-bold tracking-widest uppercase cursor-pointer active:scale-95"
              >
                <span>Unduh Juknis</span>
                <Download className="w-4 h-4 transition-transform group-hover:translate-y-0.5 text-yellow-400" />
              </button>
            </div>

          </div>

          {/* Right Columns: Adapted Paskibra Cadet Illustration with Fixed Stable Container */}
          <div className="lg:col-span-5 flex flex-col items-center justify-end relative mt-6 lg:mt-0 h-[440px] sm:h-[520px] lg:h-[580px] w-full select-none">
            
            {/* Authentic Simpaskor Breathing Halo (.hero-foto-cahaya) */}
            <span aria-hidden="true" className="hero-foto-cahaya" />

            {/* Stable Stage Container (Prevents Any Shifting of Neighboring Elements) */}
            <div className="relative w-full h-full flex items-end justify-center overflow-visible pointer-events-none">
              <img
                key={activeCadetIndex}
                src={currentCadet.src}
                alt={currentCadet.title}
                loading="eager"
                decoding="async"
                className={`hero-foto hero-foto-glitch max-w-none drop-shadow-[0_20px_40px_rgba(0,0,0,0.9)] transition-transform duration-500 pointer-events-auto ${
                  isLandscape
                    ? 'w-[125%] sm:w-[135%] lg:w-[150%] max-h-[85%] object-contain object-bottom'
                    : 'w-auto max-w-[85%] sm:max-w-[80%] h-auto max-h-[96%] object-contain object-bottom'
                }`}
              />
            </div>

          </div>

        </div>
      </div>

      {/* Scroll Down Indicator */}
      <div
        className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 cursor-pointer"
        onClick={scrollToAbout}
      >
        <div className="flex flex-col items-center gap-1.5 opacity-70 hover:opacity-100 transition-opacity animate-bounce">
          <span className="text-[9px] uppercase tracking-[0.3em] text-white pl-[0.3em] font-semibold">Scroll Down</span>
          <ChevronsDown className="w-4 h-4 text-yellow-400" />
        </div>
      </div>
    </section>
  );
}

