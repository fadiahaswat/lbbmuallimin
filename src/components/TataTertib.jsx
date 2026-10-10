import React, { useState, useMemo } from 'react';
import {
  Scale,
  ShieldCheck,
  Clock,
  MapPin,
  AlertTriangle,
  Trophy,
  ChevronDown,
  Search,
  X,
  BookOpen
} from 'lucide-react';
import { EVENT, VENUE, VENUE_INDUK } from '../config.js';
import { TATA_TERTIB_ARTICLES } from '../data/tataTertibArticles.js';

export default function TataTertib() {
  const [searchQuery, setSearchQuery] = useState('');
  const [openAccordions, setOpenAccordions] = useState({
    1: false,
    2: false,
    3: false,
    4: false,
    5: false,
    6: false,
    7: false,
    8: false,
    9: false,
    10: false,
    11: false,
    12: false,
    13: false,
    14: false,
    15: false,
  });

  function toggleAccordion(pasalNum) {
    setOpenAccordions(prev => ({
      ...prev,
      [pasalNum]: !prev[pasalNum],
    }));
  }

  const articles = TATA_TERTIB_ARTICLES;

  const query = searchQuery.trim().toLowerCase();

  const filteredArticles = useMemo(() => {
    if (!query) return articles;
    return articles.filter(item => {
      const titleMatch = item.title.toLowerCase().includes(query);
      const phaseMatch = item.phase.toLowerCase().includes(query);
      const pasalMatch = `pasal ${item.pasal}`.includes(query);
      const pointsMatch = item.points.some(p => p.toLowerCase().includes(query));
      return titleMatch || phaseMatch || pasalMatch || pointsMatch;
    });
  }, [query, articles]);

  const isSearching = Boolean(query);

  function isArticleOpen(pasalNum) {
    return isSearching ? true : Boolean(openAccordions[pasalNum]);
  }

  return (
    <section id="tata-tertib" className="py-24 lg:py-32 bg-white relative overflow-hidden font-sans border-t border-slate-200">
      <div className="hidden sm:block absolute top-0 right-0 w-[500px] h-[500px] bg-slate-100 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-60 pointer-events-none transform-gpu"></div>
      <div className="hidden sm:block absolute bottom-0 left-0 w-[500px] h-[500px] bg-red-50 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 opacity-60 pointer-events-none transform-gpu"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="mb-12 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 border border-slate-200 text-slate-700 text-[10px] font-bold uppercase tracking-widest mb-4 rounded-full shadow-xs">
            <Scale className="w-3.5 h-3.5 text-slate-700" /> Dokumen Resmi Non-Teknis & Etika
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 uppercase italic tracking-tighter mb-4 leading-tight py-1">
            Tata Tertib{' '}
            <span className="inline-block pr-3 sm:pr-4 pb-1 text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-800">
              Peserta
            </span>
          </h2>
          <p className="text-slate-500 font-mono text-xs sm:text-sm uppercase tracking-wide">
            15 PASAL RESMI LOMBA BARIS – BERBARIS MU'ALLIMIN TAHUN 2027
          </p>
          <p className="text-slate-500 mt-3 text-sm leading-relaxed max-w-2xl mx-auto font-medium">
            Pedoman kedisiplinan, zonasi pesantren, pemanfaatan basecamp, check-in KTP, larangan modifikasi sol sepatu, dan sanksi penalti resmi.
          </p>
        </div>

        <div className="max-w-4xl mx-auto flex flex-col gap-6">
          {/* Smart Search Bar */}
          <div className="relative group">
            <div className="relative flex items-center bg-slate-50 border-2 border-slate-200 focus-within:border-red-600 focus-within:bg-white focus-within:shadow-xl rounded-2xl transition-all duration-300">
              <div className="pl-4 pr-2 text-slate-400 group-focus-within:text-red-600 transition-colors">
                <Search className="w-5 h-5" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari pasal atau kata kunci tata tertib (contoh: seragam, basecamp, ktp, sampah, suporter)..."
                className="w-full py-4 pr-12 text-slate-800 placeholder-slate-400 font-medium text-sm sm:text-base bg-transparent focus:outline-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 p-1.5 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                  title="Hapus pencarian"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {isSearching && (
              <div className="mt-3 flex items-center justify-between text-xs text-slate-500 font-medium px-1">
                <span>
                  Menampilkan hasil untuk: <strong className="text-red-700 font-bold">"{searchQuery}"</strong>
                </span>
                <span className="bg-red-100/80 text-red-800 px-2.5 py-0.5 rounded-full font-bold">
                  {filteredArticles.length} Pasal Ditemukan
                </span>
              </div>
            )}
          </div>

          {/* Quick Toggle Accordion Controls */}
          <div className="flex items-center justify-between gap-3 text-xs px-1">
            <span className="text-slate-500 font-semibold flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-slate-400" />
              15 Pasal Regulasi Non-Teknis & Etika
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  const allOpen = articles.reduce((acc, a) => ({ ...acc, [a.pasal]: true }), {});
                  setOpenAccordions(allOpen);
                }}
                className="px-3.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 text-slate-700 font-bold transition-all shadow-xs cursor-pointer text-xs"
              >
                Buka Semua
              </button>
              <button
                type="button"
                onClick={() => {
                  const allClosed = articles.reduce((acc, a) => ({ ...acc, [a.pasal]: false }), {});
                  setOpenAccordions(allClosed);
                }}
                className="px-3.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 text-slate-700 font-bold transition-all shadow-xs cursor-pointer text-xs"
              >
                Tutup Semua
              </button>
            </div>
          </div>

          {/* List of Accordions */}
          <div className="space-y-4">
            {filteredArticles.map((item) => {
              const isOpen = isArticleOpen(item.pasal);
              return (
                <div
                  key={item.pasal}
                  className="group border border-slate-200 rounded-2xl overflow-hidden bg-white hover:border-red-500/40 hover:shadow-md transition-all duration-300"
                >
                  <button
                    type="button"
                    onClick={() => toggleAccordion(item.pasal)}
                    className="w-full flex justify-between items-center p-5 text-left bg-slate-50/70 hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3.5 min-w-0 pr-3">
                      <span className="w-8 h-8 rounded-xl bg-slate-200 text-slate-800 font-black flex items-center justify-center text-xs font-mono shadow-xs shrink-0">
                        {item.pasal}
                      </span>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-base md:text-lg text-slate-900 leading-snug">
                            Pasal {item.pasal}: {item.title}
                          </span>
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mt-0.5">
                          {item.phase}
                        </span>
                      </div>
                    </div>
                    <ChevronDown
                      className={`text-slate-400 transition-transform duration-300 w-5 h-5 shrink-0 ${
                        isOpen ? 'rotate-180 text-red-600' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="bg-white border-t border-slate-100 p-6 sm:p-7 text-slate-700 text-sm leading-relaxed space-y-3.5 animate-fade">
                      <div className="grid grid-cols-1 gap-3.5">
                        {item.points.map((pt, idx) => (
                          <div
                            key={idx}
                            className="p-4 sm:p-5 rounded-2xl bg-slate-50/60 border border-slate-200/90 hover:bg-white hover:border-slate-300 transition-all flex items-start gap-3.5"
                          >
                            <span className="w-7 h-7 rounded-lg bg-slate-900 text-white font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                              {idx + 1}
                            </span>
                            <div className="text-slate-700 text-xs sm:text-sm leading-relaxed space-y-1.5 flex-1">
                              {pt.split('\n').map((line, lIdx) => (
                                <p key={lIdx} className={line.startsWith('  ') ? 'pl-4 text-slate-600' : ''}>
                                  {line}
                                </p>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
