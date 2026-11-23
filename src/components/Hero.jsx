import React, { useState, useEffect } from 'react';
import { ArrowRight, Download, Calendar, ChevronDown } from 'lucide-react';
import { EVENT, DOWNLOADS } from '../config.js';
import { useCompetition } from '../context/CompetitionContext.jsx';
import logoImg from '../assets/logo-tonti.png';
import logoTonti from '../assets/logo-tonti-muallimin.png';
import logoMuallimin from '../assets/logo-muallimin-white.png';
import titleLogo from '../assets/title-logo.png';
import titleLogoMobile from '../assets/logo-title-tabmobile.png';

const CADET_FIGURES = [
  {
    src: '/fotoslide/1.webp',
    fallback: '/fotoslide/1.png',
    title: "Paskibra Mu'allimin 1",
    isLandscape: true,
  },
  {
    src: '/fotoslide/2.webp',
    fallback: '/fotoslide/2.png',
    title: "Paskibra Mu'allimin 2",
    isLandscape: false,
  },
  {
    src: '/fotoslide/3.webp',
    fallback: '/fotoslide/3.png',
    title: "Paskibra Mu'allimin 3",
    isLandscape: false,
  },
  {
    src: '/fotoslide/4.webp',
    fallback: '/fotoslide/4.png',
    title: "Paskibra Mu'allimin 4",
    isLandscape: true,
  },
  {
    src: '/fotoslide/5.webp',
    fallback: '/fotoslide/5.png',
    title: "Paskibra Mu'allimin 5",
    isLandscape: false,
  },
];

export default function Hero() {
  const { openModal, settings, canAccessRegistration } = useCompetition();
  const [activeCadetIndex, setActiveCadetIndex] = useState(0);
  const [scheduleIndex, setScheduleIndex] = useState(0);
  const [isDesktop, setIsDesktop] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 1024;
    }
    return false;
  });

  const availableCadets = isDesktop
    ? CADET_FIGURES.filter(c => !c.isLandscape)
    : CADET_FIGURES;

  const regRangeText = settings?.eventDates?.registrationRangeText || EVENT.REGISTRATION_RANGE;
  const compDateText = settings?.eventDates?.competitionDate || EVENT.COMPETITION_DATE;
  const tmDateText =
    settings?.eventDates?.technicalMeetingFullDate ||
    settings?.eventDates?.technicalMeetingDate ||
    EVENT.TECHNICAL_MEETING_FULL_DATE ||
    EVENT.TECHNICAL_MEETING_DATE;
  const trialDateText =
    settings?.eventDates?.fieldTrialFullDate ||
    settings?.eventDates?.fieldTrialDate ||
    EVENT.FIELD_TRIAL_FULL_DATE ||
    EVENT.FIELD_TRIAL_DATE;

  const schedules = [
    { label: 'Hari-H Lomba', date: compDateText },
    { label: 'Pendaftaran', date: regRangeText },
    { label: 'TM Peserta', date: tmDateText },
    { label: 'Uji Coba', date: trialDateText },
  ];

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    window.addEventListener('resize', handleResize, { passive: true });

    availableCadets.forEach(cadet => {
      const img = new Image();
      img.src = cadet.src;
    });

    const timer = setInterval(() => {
      setActiveCadetIndex(prev => (prev + 1) % availableCadets.length);
    }, 6000);

    const scheduleTimer = setInterval(() => {
      setScheduleIndex(prev => (prev + 1) % 4);
    }, 3500);

    return () => {
      window.removeEventListener('resize', handleResize);
      clearInterval(timer);
      clearInterval(scheduleTimer);
    };
  }, [availableCadets.length]);

  function scrollToAbout() {
    const el = document.getElementById('about');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }

  const currentCadet = availableCadets[activeCadetIndex % availableCadets.length];
  const isLandscape = currentCadet.isLandscape;
  const currentSchedule = schedules[scheduleIndex];

  return (
    <section
      id="home"
      className="relative w-full min-h-screen supports-[height:100svh]:min-h-[100svh] flex flex-col justify-between bg-[#1a0406] text-white pt-24 sm:pt-28 lg:pt-24 pb-8 lg:pb-0 overflow-hidden font-sans"
    >
      {/* ========================================================
          ATMOSPHERIC CINEMATIC BACKDROP
          ======================================================== */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden select-none" aria-hidden="true">
        {/* Deep Crimson-to-Obsidian Radial Lighting */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 75% 65% at 72% 38%, rgba(139, 0, 0, 0.58) 0%, rgba(74, 6, 10, 0.45) 45%, rgba(2, 6, 23, 0.96) 100%)',
          }}
        />

        {/* Subtle Architectural Dot Grid */}
        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:28px_28px] opacity-25" />

        {/* Warm Gold Rim Glow Behind Subject */}
        <div className="hidden lg:block absolute top-1/4 right-[12%] w-[460px] h-[460px] bg-amber-500/[0.08] rounded-full blur-[120px]" />

        {/* Ornamental Milad Graphic Motif (Desktop Top Right) */}
        <div className="hidden lg:block absolute -top-20 -right-20 w-[640px] pointer-events-none">
          <img
            src="/logo-milad-red.svg"
            alt=""
            className="w-full h-auto object-contain opacity-[0.08] saturate-[0.3] brightness-110 mix-blend-screen"
            loading="eager"
            decoding="async"
          />
        </div>

        {/* Seamless Transition Floor into Slate-950 */}
        <div className="absolute inset-x-0 bottom-0 h-56 sm:h-72 lg:h-96 bg-gradient-to-t from-slate-950 via-slate-950/85 via-40% to-transparent" />
      </div>

      {/* ========================================================
          MAIN CONTENT GRID
          ======================================================== */}
      <div className="container mx-auto px-4 sm:px-6 relative z-10 flex-1 flex items-center">
        <div className="grid lg:grid-cols-12 gap-6 lg:gap-10 items-center lg:items-end w-full max-w-7xl mx-auto">
          {/* LEFT COLUMN: BRANDING, TITLE, CTAS & KEY FACTS (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left space-y-5 sm:space-y-6 lg:self-center lg:pb-12">
            {/* 1. Trio Brand Lockup */}
            <div className="flex items-center gap-3.5 sm:gap-5">
              <img
                src={logoImg}
                alt="Logo Resmi LBB Mu'allimin 2027"
                className="h-16 sm:h-20 md:h-24 w-auto object-contain drop-shadow-[0_6px_18px_rgba(0,0,0,0.45)]"
                width="120"
                height="120"
                loading="eager"
              />
              <div className="h-10 sm:h-12 w-px bg-gradient-to-b from-transparent via-white/25 to-transparent" />
              <img
                src={logoTonti}
                alt="Logo Korps Tonti Mu'allimin"
                className="hidden sm:block h-11 md:h-12 w-auto object-contain opacity-95"
                loading="eager"
              />
              <img
                src={logoMuallimin}
                alt="Logo Madrasah Mu'allimin Muhammadiyah Yogyakarta"
                className="h-9 sm:h-11 md:h-12 w-auto object-contain opacity-90"
                loading="eager"
              />
            </div>

            {/* 2. Interactive Rotating Schedule Pill */}
            <button
              type="button"
              onClick={() => setScheduleIndex(prev => (prev + 1) % schedules.length)}
              className="group inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.06] hover:bg-white/[0.1] border border-white/15 backdrop-blur-md transition-colors cursor-pointer max-w-full"
              title="Klik untuk melihat jadwal berikutnya"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse shrink-0" />
              <Calendar className="w-3.5 h-3.5 text-amber-400 shrink-0 hidden sm:block" />
              <span className="text-[10.5px] sm:text-xs font-bold tracking-wider uppercase text-slate-200 truncate">
                <span className="text-amber-300 mr-1.5">{currentSchedule.label}:</span>
                <span className="text-white">{currentSchedule.date}</span>
              </span>
            </button>

            {/* 3. Official Title Graphic */}
            <div className="select-none w-full flex justify-center lg:justify-start">
              <h1 className="sr-only">Lomba Baris-Berbaris Mu&apos;allimin 2027</h1>
              <img
                src={titleLogoMobile}
                alt="LOMBA BARIS BERBARIS MU'ALLIMIN 2027"
                className="block lg:hidden h-auto w-full max-w-[320px] sm:max-w-[440px] md:max-w-[520px] object-contain drop-shadow-[0_10px_28px_rgba(0,0,0,0.6)] mx-auto"
                loading="eager"
              />
              <img
                src={titleLogo}
                alt="LOMBA BARIS BERBARIS MU'ALLIMIN 2027"
                className="hidden lg:block h-auto w-full lg:max-w-[660px] object-contain drop-shadow-[0_12px_32px_rgba(0,0,0,0.65)]"
                loading="eager"
              />
            </div>

            {/* 4. Concise Editorial Subtitle */}
            <p className="text-xs sm:text-sm md:text-base text-slate-300 font-normal leading-relaxed max-w-xl">
              Kompetisi baris-berbaris tingkat{' '}
              <strong className="text-white font-semibold">SD/MI</strong> dan{' '}
              <strong className="text-white font-semibold">SMP/MTs sederajat</strong> se-Daerah Istimewa Yogyakarta oleh Madrasah Mu&apos;allimin Muhammadiyah Yogyakarta.
            </p>

            {/* 5. Primary & Secondary CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto pt-1">
              <button
                type="button"
                onClick={() => openModal('regWizard')}
                className="group px-7 py-3.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-xl shadow-[0_10px_30px_-8px_rgba(251,191,36,0.5)] hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2 text-xs sm:text-sm tracking-wider uppercase cursor-pointer active:scale-[0.98]"
              >
                <span>{canAccessRegistration ? 'Daftar Sekarang' : 'Daftar (Buka 26 Okt)'}</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>

              <a
                href={
                  DOWNLOADS[0]?.url ||
                  'https://drive.google.com/file/d/1owEDyb680TNB3TkFvZGVfjD_OCbagffQ/view?usp=sharing'
                }
                target="_blank"
                rel="noopener noreferrer"
                className="group px-6 py-3.5 bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 hover:border-white/25 backdrop-blur-md text-white rounded-xl hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2 text-xs sm:text-sm font-bold tracking-wider uppercase cursor-pointer active:scale-[0.98]"
              >
                <span>Unduh Juknis</span>
                <Download className="w-4 h-4 text-slate-300 transition-transform group-hover:translate-y-0.5" />
              </a>
            </div>

            {/* 6. Minimal Editorial Key-Facts Strip (Zero Box Clutter) */}
            <div className="pt-3 sm:pt-4 border-t border-white/10 w-full max-w-lg flex items-center justify-center lg:justify-start gap-5 sm:gap-7 text-left">
              <div>
                <span className="text-sm sm:text-base font-black text-white font-mono leading-none block">
                  36 Peleton
                </span>
                <span className="text-[10px] sm:text-[11px] text-slate-400 font-medium block mt-1">
                  Kuota Se-DIY
                </span>
              </div>

              <div className="h-7 w-px bg-white/15 shrink-0" />

              <div>
                <span className="text-sm sm:text-base font-black text-white leading-none block">
                  SD &amp; SMP
                </span>
                <span className="text-[10px] sm:text-[11px] text-slate-400 font-medium block mt-1">
                  2 Jenjang Resmi
                </span>
              </div>

              <div className="h-7 w-px bg-white/15 shrink-0" />

              <div>
                <span className="text-sm sm:text-base font-black text-amber-400 leading-none block">
                  24 Jan 2027
                </span>
                <span className="text-[10px] sm:text-[11px] text-slate-400 font-medium block mt-1">
                  Sedayu, Bantul
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: DRAMATIC CADET STAGE (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col items-center justify-end relative mt-2 lg:mt-0 h-[380px] sm:h-[480px] lg:h-[620px] xl:h-[680px] w-full select-none lg:self-end">
            {/* Breathing Halo */}
            <span aria-hidden="true" className="hero-foto-cahaya" />

            {/* Mobile/Tablet Ornamental Milad Motif Behind Cadet */}
            <div
              className="block lg:hidden absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] sm:w-[360px] pointer-events-none z-0"
              aria-hidden="true"
            >
              <img
                src="/logo-milad-red.svg"
                alt=""
                className="w-full h-auto object-contain opacity-[0.09] saturate-[0.3] brightness-110 mix-blend-screen"
                loading="eager"
                decoding="async"
              />
            </div>

            {/* Soft Floor Shadow */}
            <div
              className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-4/5 h-24 bg-slate-950/95 blur-2xl rounded-full pointer-events-none z-0"
              aria-hidden="true"
            />

            {/* Stable Cadet Container */}
            <div className="relative w-full h-full flex items-end justify-center overflow-visible pointer-events-none">
              <img
                key={activeCadetIndex}
                src={currentCadet.src}
                onError={e => {
                  if (currentCadet.fallback && e.currentTarget.src !== currentCadet.fallback) {
                    e.currentTarget.src = currentCadet.fallback;
                  }
                }}
                alt={currentCadet.title}
                loading="eager"
                decoding="async"
                className={`hero-foto hero-foto-smooth max-w-none pointer-events-auto relative z-10 ${
                  isLandscape
                    ? 'w-[115%] sm:w-[125%] lg:w-[135%] max-h-[82%] object-contain object-bottom mb-4 sm:mb-6 lg:mb-8'
                    : 'w-auto max-w-[85%] sm:max-w-[80%] h-auto max-h-[96%] object-contain object-bottom'
                }`}
              />

              {/* Seamless Bottom Feathering into Slate-950 */}
              <div
                className="absolute inset-x-0 bottom-0 h-28 sm:h-36 lg:h-44 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent pointer-events-none z-20"
                aria-hidden="true"
              />
            </div>

            {/* Subtle Slide Indicator Dots */}
            <div className="absolute bottom-4 right-2 sm:right-4 z-30 flex items-center gap-1.5">
              {availableCadets.map((_, idx) => {
                const isCurrent = idx === activeCadetIndex % availableCadets.length;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveCadetIndex(idx)}
                    aria-label={`Tampilkan foto kadet ${idx + 1}`}
                    className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                      isCurrent ? 'w-5 bg-amber-400' : 'w-1.5 bg-white/25 hover:bg-white/50'
                    }`}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================
          MINIMAL SCROLL CUE
          ======================================================== */}
      <button
        type="button"
        onClick={scrollToAbout}
        aria-label="Gulir ke bagian Tentang LBB"
        className="relative lg:absolute lg:bottom-5 lg:left-1/2 lg:-translate-x-1/2 z-30 mx-auto mt-2 lg:mt-0 inline-flex flex-col items-center gap-1 text-white/55 hover:text-amber-400 transition-colors cursor-pointer select-none"
      >
        <span className="text-[9px] font-bold uppercase tracking-[0.28em] indent-[0.28em]">
          Scroll
        </span>
        <ChevronDown className="w-4 h-4 text-amber-400/80" />
      </button>
    </section>
  );
}
