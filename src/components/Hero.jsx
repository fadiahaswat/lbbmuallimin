import React from 'react';
import { ArrowRight, Download, ChevronsDown } from 'lucide-react';
import { HERO, EVENT } from '../config.js';
import { useCompetition } from '../context/CompetitionContext.jsx';

export default function Hero() {
  const { openModal } = useCompetition();

  function scrollToAbout() {
    const el = document.getElementById('about');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <section
      id="home"
      className="relative w-full min-h-screen supports-[height:100svh]:min-h-[100svh] flex flex-col items-center justify-center bg-gradient-to-b from-[#3a0505] via-[#6d0a0a] to-[#250303] text-white overflow-hidden isolate pt-24 pb-16"
    >
      {/* Background Media & Lighting */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-25 mix-blend-screen filter grayscale-[0.2]"
        >
          <source src={HERO.VIDEO_URL} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/30 to-black/85"></div>
        {/* Subtle radial spotlight */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-red-600/20 blur-[130px] rounded-full pointer-events-none"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10 flex flex-col items-center justify-center h-full">
        <div className="flex flex-col items-center justify-center w-full max-w-4xl space-y-6 md:space-y-8 text-center">
          
          {/* Subtle Event Badge */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 bg-black/40 border border-white/15 rounded-full backdrop-blur-md shadow-sm cursor-default">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
            </span>
            <span className="text-[10px] sm:text-xs font-bold tracking-widest uppercase text-slate-200">
              {EVENT.REGISTRATION_BADGE}
            </span>
          </div>

          {/* Main Title - Clean, Bold, Focused */}
          <div className="relative text-center z-10 cursor-default max-w-4xl mx-auto">
            <h1 className="font-black uppercase tracking-tight flex flex-col gap-1 sm:gap-2 select-none py-1">
              <span className="block pr-2 pb-1 text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white drop-shadow-md">
                {HERO.TITLE_LINE1}
              </span>
              <span className="block pr-2 pb-1 text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-500 drop-shadow-lg">
                {HERO.TITLE_LINE2}
              </span>
            </h1>
          </div>

          {/* Subtitle & Buttons */}
          <div className="flex flex-col items-center gap-8 w-full max-w-2xl mx-auto">
            <p
              className="text-sm sm:text-base md:text-lg text-slate-200/90 text-center font-normal leading-relaxed"
              dangerouslySetInnerHTML={{ __html: HERO.SUBTITLE }}
            />

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full justify-center px-4 sm:px-0">
              <button
                type="button"
                onClick={() => openModal('regWizard')}
                className="group px-8 py-3.5 bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 hover:from-yellow-300 hover:to-amber-400 text-slate-950 font-black rounded-xl shadow-lg shadow-yellow-500/25 hover:shadow-yellow-500/40 hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 text-xs sm:text-sm tracking-widest uppercase"
              >
                <span>Daftar Sekarang</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                type="button"
                onClick={() => openModal('docViewer', { docId: 'juknis' })}
                className="group px-8 py-3.5 bg-black/40 hover:bg-black/60 text-white hover:text-yellow-400 border border-white/20 hover:border-yellow-400/50 rounded-xl backdrop-blur-md shadow-lg shadow-black/20 hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 text-xs sm:text-sm font-bold tracking-widest uppercase"
              >
                <span>Unduh Juknis</span>
                <Download className="w-4 h-4 transition-transform group-hover:translate-y-0.5 text-yellow-400" />
              </button>
            </div>
          </div>

        </div>
      </div>

      <div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 cursor-pointer"
        onClick={scrollToAbout}
      >
        <div className="flex flex-col items-center gap-2 opacity-60 hover:opacity-100 transition-opacity animate-bounce">
          <span className="text-[9px] uppercase tracking-[0.3em] text-white pl-[0.3em] font-semibold">Scroll Down</span>
          <ChevronsDown className="w-4 h-4 text-yellow-400" />
        </div>
      </div>
    </section>
  );
}
