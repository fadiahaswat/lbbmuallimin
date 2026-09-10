import React from 'react';
import { ArrowRight, Download, ChevronsDown } from 'lucide-react';
import { HERO, EVENT } from '../config.js';
import CountdownTimer from './CountdownTimer.jsx';

export default function Hero() {
  function scrollToAbout() {
    const el = document.getElementById('about');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <section
      id="home"
      className="relative w-full min-h-screen supports-[height:100svh]:min-h-[100svh] flex flex-col items-center justify-center bg-gradient-to-b from-red-950 via-[#8B0000] to-red-950 text-white overflow-hidden isolate pt-24 pb-16"
    >
      <div className="absolute inset-0 z-0 pointer-events-none">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-20 mix-blend-multiply filter grayscale-[0.3]"
        >
          <source src={HERO.VIDEO_URL} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80"></div>
        <div className="absolute inset-0 bg-halftone z-0 opacity-10"></div>
      </div>

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-600 rounded-full blur-[120px] opacity-20 mix-blend-screen pointer-events-none"></div>

      <div className="container mx-auto px-4 relative z-10 flex flex-col items-center justify-center h-full">
        <div className="flex flex-col items-center justify-center w-full max-w-4xl space-y-6 md:space-y-7 text-center">
          
          {/* Badge & Countdown */}
          <div className="flex flex-col items-center gap-3 md:gap-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-black/40 border border-yellow-500/30 rounded-full backdrop-blur-md shadow-lg hover:border-lbb-gold/60 transition-all cursor-default">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-lbb-gold opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-500"></span>
              </span>
              <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-yellow-100/90">
                {EVENT.REGISTRATION_BADGE}
              </span>
            </div>

            <CountdownTimer />
          </div>

          {/* Title */}
          <div className="relative text-center z-10 group cursor-default">
            <h1 className="font-black leading-none tracking-tighter italic flex flex-col gap-1 md:gap-2">
              <span className="relative block text-3xl md:text-5xl lg:text-7xl">
                <span
                  className="absolute inset-0 text-transparent select-none pointer-events-none"
                  style={{ WebkitTextStroke: '1px rgba(255,255,255,0.2)' }}
                >
                  {HERO.TITLE_LINE1}
                </span>
                <span className="relative text-transparent bg-clip-text bg-gradient-to-b from-white via-zinc-200 to-zinc-400 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                  {HERO.TITLE_LINE1}
                </span>
              </span>

              <span className="relative block text-4xl md:text-6xl lg:text-8xl mt-1">
                <span className="absolute inset-0 text-lbb-gold blur-2xl opacity-40 group-hover:opacity-60 transition-opacity duration-500 select-none pointer-events-none">
                  {HERO.TITLE_LINE2}
                </span>
                <span className="relative text-transparent bg-clip-text bg-gradient-to-br from-yellow-200 via-lbb-gold to-yellow-600 filter drop-shadow-[0_0_30px_rgba(234,179,8,0.4)] group-hover:drop-shadow-[0_0_50px_rgba(234,179,8,0.6)] transition-all duration-300">
                  {HERO.TITLE_LINE2}
                </span>
                <span
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent bg-clip-text text-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                  style={{ mixBlendMode: 'overlay' }}
                >
                  {HERO.TITLE_LINE2}
                </span>
              </span>
            </h1>
          </div>

          {/* Subtitle & Buttons */}
          <div className="flex flex-col items-center gap-6 w-full">
            <p
              className="text-sm md:text-base text-red-100/80 max-w-lg text-center font-medium leading-relaxed hidden sm:block"
              dangerouslySetInnerHTML={{ __html: HERO.SUBTITLE }}
            />

            <div className="flex flex-col sm:flex-row gap-3 w-full justify-center px-6">
              <a
                href="#registration"
                className="group relative px-8 py-3 bg-lbb-gold text-red-950 font-black rounded-xl overflow-hidden transition-all hover:scale-105 hover:shadow-[0_0_25px_rgba(234,179,8,0.5)] w-full sm:w-auto text-center flex justify-center items-center gap-2"
              >
                <span className="relative z-20 uppercase tracking-widest text-xs md:text-sm font-extrabold">
                  Daftar Sekarang
                </span>
                <ArrowRight className="w-4 h-4 relative z-20 transition-transform group-hover:translate-x-1" />
              </a>

              <a
                href="#downloads"
                className="group px-8 py-3 bg-white/10 border border-white/20 text-white font-bold rounded-xl backdrop-blur-md transition-all hover:bg-white/20 hover:border-yellow-500/50 w-full sm:w-auto text-center flex justify-center items-center gap-2"
              >
                <span className="uppercase tracking-widest text-xs md:text-sm font-bold">Unduh Juknis</span>
                <Download className="w-4 h-4 transition-transform group-hover:translate-y-1 text-lbb-gold" />
              </a>
            </div>
          </div>

        </div>
      </div>

      <div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 cursor-pointer"
        onClick={scrollToAbout}
      >
        <div className="flex flex-col items-center gap-2 opacity-50 hover:opacity-100 transition-opacity animate-bounce">
          <span className="text-[8px] uppercase tracking-[0.3em] text-white pl-[0.3em]">Scroll Down</span>
          <ChevronsDown className="w-3.5 h-3.5 text-lbb-gold" />
        </div>
      </div>
    </section>
  );
}
