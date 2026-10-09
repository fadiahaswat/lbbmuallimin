import React, { useState, useEffect } from 'react';
import { ArrowRight, Download, ChevronsDown, ExternalLink } from 'lucide-react';
import { HERO, EVENT, VENUE } from '../config.js';
import { useCompetition } from '../context/CompetitionContext.jsx';
import logoImg from '../assets/logo-tonti.png';
import logoTonti from '../assets/logo-tonti-muallimin.png';
import logoMuallimin from '../assets/logo-muallimin-white.png';

const CADET_FIGURES = [
  {
    src: '/fotoslide/1.webp',
    fallback: '/fotoslide/1.png',
    title: 'Paskibra Mu\'allimin 1',
    isLandscape: true,
  },
  {
    src: '/fotoslide/2.webp',
    fallback: '/fotoslide/2.png',
    title: 'Paskibra Mu\'allimin 2',
    isLandscape: false,
  },
  {
    src: '/fotoslide/3.webp',
    fallback: '/fotoslide/3.png',
    title: 'Paskibra Mu\'allimin 3',
    isLandscape: false,
  },
  {
    src: '/fotoslide/4.webp',
    fallback: '/fotoslide/4.png',
    title: 'Paskibra Mu\'allimin 4',
    isLandscape: true,
  },
  {
    src: '/fotoslide/5.webp',
    fallback: '/fotoslide/5.png',
    title: 'Paskibra Mu\'allimin 5',
    isLandscape: false,
  },
];

export default function Hero() {
  const { openModal, setActiveView, settings } = useCompetition();
  const [activeCadetIndex, setActiveCadetIndex] = useState(0);
  const [scheduleIndex, setScheduleIndex] = useState(0);

  const regRangeText = settings?.eventDates?.registrationRangeText || EVENT.REGISTRATION_RANGE;

  // Jadwal dinamis bergantian: Perlombaan -> Pendaftaran -> TM -> Uji Coba Lapangan
  const schedules = [
    {
      label: 'Perlombaan',
      date: EVENT.COMPETITION_DATE, // "Sabtu, 24 Januari 2027"
      dotColor: 'bg-yellow-400',
      pingColor: 'bg-yellow-400',
      textColor: 'text-yellow-300',
    },
    {
      label: 'Pendaftaran',
      date: regRangeText, // "11 Oktober – 7 November 2026"
      dotColor: 'bg-amber-500',
      pingColor: 'bg-amber-400',
      textColor: 'text-amber-300',
    },
    {
      label: 'TM Peserta',
      date: EVENT.TECHNICAL_MEETING_FULL_DATE || EVENT.TECHNICAL_MEETING_DATE, // "Sabtu, 9 Januari 2027"
      dotColor: 'bg-blue-400',
      pingColor: 'bg-blue-400',
      textColor: 'text-blue-300',
    },
    {
      label: 'Uji Coba Lapangan',
      date: EVENT.FIELD_TRIAL_FULL_DATE || EVENT.FIELD_TRIAL_DATE, // "Sabtu, 16 Januari 2027"
      dotColor: 'bg-emerald-400',
      pingColor: 'bg-emerald-400',
      textColor: 'text-emerald-300',
    },
  ];

  // Preload remaining slides and auto-rotate cadet illustration every 6 seconds
  useEffect(() => {
    CADET_FIGURES.forEach(cadet => {
      const img = new Image();
      img.src = cadet.src;
    });

    const timer = setInterval(() => {
      setActiveCadetIndex(prev => (prev + 1) % CADET_FIGURES.length);
    }, 6000);

    // Rotasi jadwal badge setiap 3 detik
    const scheduleTimer = setInterval(() => {
      setScheduleIndex(prev => (prev + 1) % 4);
    }, 3200);

    return () => {
      clearInterval(timer);
      clearInterval(scheduleTimer);
    };
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
      className="relative w-full min-h-screen supports-[height:100svh]:min-h-[100svh] flex flex-col items-center justify-center bg-gradient-to-b from-[#2e0404] via-[#630909] to-[#1c0202] text-white pt-24 pb-16"
    >
      <div className="container mx-auto px-4 sm:px-6 relative z-10 flex flex-col justify-center h-full my-auto">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center w-full max-w-7xl mx-auto">

          {/* Left Columns: Text Content & Actions */}
          <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left space-y-5 sm:space-y-6">
            
            {/* Logo Group in Hero Section: Logo LBB - Garis - Logo Tonti Mu'allimin - Logo Mu'allimin */}
            <div className="flex items-center gap-3.5 sm:gap-6">
              {/* Logo Utama LBB Mu'allimin 2027 */}
              <div className="relative group transition-transform duration-300 hover:scale-105">
                <img
                  src={logoImg}
                  alt="Logo Resmi LBB Mu'allimin 2027"
                  className="relative h-20 sm:h-24 md:h-28 w-auto object-contain"
                  width="140"
                  height="140"
                  loading="eager"
                />
              </div>

              {/* Garis Pemisah Halus */}
              <div className="h-12 sm:h-16 w-px bg-gradient-to-b from-transparent via-white/30 to-transparent" />

              {/* Logo Korps Tonti Mu'allimin (sembunyi di mobile, tampil di tablet/desktop) */}
              <div className="hidden sm:block relative group transition-transform duration-300 hover:scale-105">
                <img
                  src={logoTonti}
                  alt="Logo Korps Tonti Mu'allimin"
                  className="h-12 md:h-14 w-auto object-contain"
                  loading="eager"
                />
              </div>

              {/* Logo Madrasah Mu'allimin */}
              <div className="relative group transition-transform duration-300 hover:scale-105 opacity-90 hover:opacity-100">
                <img
                  src={logoMuallimin}
                  alt="Logo Madrasah Mu'allimin Muhammadiyah Yogyakarta"
                  className="h-10 sm:h-12 md:h-14 w-auto object-contain"
                  loading="eager"
                />
              </div>
            </div>

            {/* Event Dynamic Rotating Schedule Badge */}
            {(() => {
              const currentSchedule = schedules[scheduleIndex];
              return (
                <div
                  key={scheduleIndex}
                  className="relative inline-flex items-center gap-2.5 px-4 py-1.5 bg-black/40 border border-white/15 rounded-full shadow-sm cursor-default animate-fade"
                >
                  <span className="relative flex h-2 w-2">
                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${currentSchedule.pingColor} opacity-75`}></span>
                    <span className={`relative inline-flex rounded-full h-2 w-2 ${currentSchedule.dotColor}`}></span>
                  </span>
                  <span className="text-[10px] sm:text-xs font-bold tracking-wider uppercase text-slate-200">
                    <span className="text-white font-bold mr-1">{currentSchedule.label}:</span>
                    <span>{currentSchedule.date}</span>
                  </span>
                </div>
              );
            })()}


            {/* Main Title - Original LBB Mu'allimin Styling */}
            <div className="space-y-1">
              <h1 className="font-black uppercase tracking-tight flex flex-col select-none">
                <span className="block text-3xl sm:text-5xl md:text-6xl font-black text-white">
                  {HERO.TITLE_LINE1}
                </span>
                <span className="block text-4xl sm:text-6xl md:text-7xl font-black text-yellow-400">
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

              <a
                href="https://docs.google.com/document/d/1BN1RuwDcEiuibVvoBG4-5R7Rq8neV5st3nAZoISVQi0/edit?usp=sharing"
                target="_blank"
                rel="noopener noreferrer"
                className="group px-8 py-3.5 bg-black/35 hover:bg-white/10 border border-white/20 hover:border-yellow-400/40 text-white hover:text-yellow-400 rounded-xl shadow-lg shadow-black/20 hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 text-xs sm:text-sm font-bold tracking-widest uppercase cursor-pointer active:scale-95"
              >
                <span>Juknis Lapangan</span>
                <ExternalLink className="w-4 h-4 transition-transform group-hover:translate-x-0.5 text-yellow-400" />
              </a>
            </div>

          </div>

          {/* Right Columns: Adapted Paskibra Cadet Illustration with Fixed Stable Container */}
          <div className="lg:col-span-5 flex flex-col items-center justify-end relative mt-6 lg:mt-0 h-[440px] sm:h-[520px] lg:h-[580px] w-full select-none">
            
            {/* Authentic Simpaskor Breathing Halo (.hero-foto-cahaya) */}
            <span aria-hidden="true" className="hero-foto-cahaya" />

            {/* Stable Stage Container (Prevents Any Shifting of Neighboring Elements) */}
            <div className="relative w-full h-full flex items-end justify-center overflow-visible pointer-events-none">
              {/* Stable Cadet Illustration */}
              <img
                key={activeCadetIndex}
                src={currentCadet.src}
                onError={(e) => {
                  if (currentCadet.fallback && e.currentTarget.src !== currentCadet.fallback) {
                    e.currentTarget.src = currentCadet.fallback;
                  }
                }}
                alt={currentCadet.title}
                loading="eager"
                decoding="async"
                className={`hero-foto hero-foto-smooth max-w-none pointer-events-auto ${
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
        <div className="flex flex-col items-center justify-center gap-1.5 opacity-70 hover:opacity-100 transition-opacity animate-bounce select-none">
          <span className="text-[9px] uppercase tracking-[0.3em] indent-[0.3em] text-white font-semibold text-center block">
            Scroll Down
          </span>
          <ChevronsDown className="w-4 h-4 text-yellow-400" />
        </div>
      </div>
    </section>
  );
}

