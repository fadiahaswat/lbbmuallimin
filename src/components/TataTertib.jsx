import React, { useState, useMemo } from 'react';
import {
  Scale,
  ShieldCheck,
  AlertTriangle,
  ChevronDown,
  Search,
  X,
  BadgeCheck
} from 'lucide-react';
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
      const phaseMatch = item.phase ? item.phase.toLowerCase().includes(query) : false;
      const pasalMatch = `pasal ${item.pasal}`.includes(query) || `${item.pasal}`.includes(query);
      const pointsMatch = item.points.some(p => p.toLowerCase().includes(query));
      return titleMatch || phaseMatch || pasalMatch || pointsMatch;
    });
  }, [query, articles]);

  const isSearching = Boolean(query);

  function isArticleOpen(pasalNum) {
    return isSearching ? true : Boolean(openAccordions[pasalNum]);
  }

  const openCount = useMemo(
    () => articles.filter(a => openAccordions[a.pasal]).length,
    [articles, openAccordions]
  );

  return (
    <section
      id="tata-tertib"
      className="py-24 lg:py-32 bg-slate-50 relative overflow-hidden font-sans border-t border-slate-200"
    >
      {/* Subtle Dot Grid & Top Accent */}
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:18px_18px] opacity-60 pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-600/80 to-transparent" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="mb-10 sm:mb-12 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-white border border-slate-200/90 text-slate-600 text-xs font-semibold uppercase tracking-wider mb-4 rounded-full shadow-2xs">
            <Scale className="w-3.5 h-3.5 text-red-700" />
            <span>Dokumen Etika &amp; Regulasi</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 uppercase tracking-tight mb-4 leading-tight">
            Tata Tertib <span className="text-red-700">Peserta</span>
          </h2>
          <div className="w-16 h-1 bg-red-700 mx-auto rounded-full mb-4" />
          <p className="text-slate-600 text-base font-normal leading-relaxed max-w-2xl mx-auto">
            Pedoman kedisiplinan 15 pasal resmi: zonasi kampus, pemanfaatan basecamp kontingen, check-in identitas, kepatuhan seragam, dan sanksi penalti.
          </p>
        </div>

        <div className="max-w-4xl mx-auto flex flex-col gap-6">
          {/* 3-Card Quick Highlights Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
              <div className="w-9 h-9 rounded-xl bg-red-50 border border-red-100 text-red-700 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Cakupan Aturan
                </span>
                <span className="text-xs font-extrabold text-slate-900 block truncate">
                  15 Pasal Etika &amp; Zonasi
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
              <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200/80 text-amber-700 flex items-center justify-center shrink-0">
                <BadgeCheck className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Jaminan Check-In
                </span>
                <span className="text-xs font-extrabold text-slate-900 block truncate">
                  KTP / SIM Asli Official
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
              <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-4 h-4 text-red-600" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Larangan Keras
                </span>
                <span className="text-xs font-extrabold text-slate-900 block truncate">
                  Sol Sepatu Paku / Pines
                </span>
              </div>
            </div>
          </div>

          {/* Unified Search & Accordion Toolbar */}
          <div className="space-y-2.5">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
              <div className="relative group flex-1">
                <div className="relative flex items-center bg-white border border-slate-200 focus-within:border-red-600 focus-within:ring-4 focus-within:ring-red-600/10 shadow-xs rounded-xl transition-all duration-200">
                  <div className="pl-3.5 pr-2 text-slate-400 group-focus-within:text-red-600 transition-colors">
                    <Search className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari pasal (seragam, basecamp, ktp, sampah, suporter)..."
                    className="w-full py-2.5 pr-10 text-slate-800 placeholder-slate-400 font-medium text-sm bg-transparent focus:outline-none"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                      title="Hapus pencarian"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              <div className="inline-grid grid-cols-2 sm:flex items-center gap-1 p-1 rounded-xl bg-slate-200/70 border border-slate-200/90 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    const allOpen = articles.reduce((acc, a) => ({ ...acc, [a.pasal]: true }), {});
                    setOpenAccordions(allOpen);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-white hover:bg-red-50 text-slate-700 hover:text-red-700 font-bold transition-all shadow-2xs cursor-pointer text-xs text-center whitespace-nowrap"
                >
                  Buka Semua
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const allClosed = articles.reduce((acc, a) => ({ ...acc, [a.pasal]: false }), {});
                    setOpenAccordions(allClosed);
                  }}
                  className="px-3 py-1.5 rounded-lg hover:bg-white text-slate-600 hover:text-slate-900 font-bold transition-all cursor-pointer text-xs text-center whitespace-nowrap"
                >
                  Tutup Semua
                </button>
              </div>
            </div>

            {isSearching && (
              <div className="flex items-center justify-between text-xs text-slate-500 font-medium px-1">
                <span>
                  Hasil untuk: <strong className="text-red-700 font-bold">"{searchQuery}"</strong>
                </span>
                <span className="text-red-700 font-bold">
                  {filteredArticles.length} Pasal Ditemukan
                </span>
              </div>
            )}
          </div>

          {/* Empty State */}
          {filteredArticles.length === 0 ? (
            <div className="rounded-2xl bg-white border border-slate-200 p-10 text-center space-y-3 shadow-2xs">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <Search className="w-5 h-5" />
              </div>
              <p className="text-sm font-bold text-slate-800">
                Tidak ada pasal yang cocok dengan "{searchQuery}"
              </p>
              <p className="text-xs text-slate-500">
                Coba gunakan kata kunci lain seperti seragam, basecamp, ktp, atau sanksi.
              </p>
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors cursor-pointer"
              >
                Reset Pencarian
              </button>
            </div>
          ) : (
            /* List of Accordions */
            <div className="space-y-3">
              {filteredArticles.map((item) => {
                const isOpen = isArticleOpen(item.pasal);
                return (
                  <div
                    key={item.pasal}
                    className={`group rounded-2xl overflow-hidden bg-white border transition-all duration-200 ${
                      isOpen
                        ? 'border-red-600/35 shadow-md ring-1 ring-red-600/10'
                        : 'border-slate-200/90 hover:border-slate-300 hover:shadow-xs'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => toggleAccordion(item.pasal)}
                      className={`w-full flex justify-between items-center gap-3 p-4 sm:p-5 text-left transition-colors cursor-pointer ${
                        isOpen ? 'bg-red-50/40' : 'bg-white hover:bg-slate-50/80'
                      }`}
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <span
                          className={`w-9 h-9 rounded-xl font-black flex items-center justify-center text-xs font-mono shrink-0 transition-colors ${
                            isOpen
                              ? 'bg-red-700 text-white shadow-xs'
                              : 'bg-slate-100 text-slate-700 group-hover:bg-red-50 group-hover:text-red-700 border border-slate-200/80'
                          }`}
                        >
                          {String(item.pasal).padStart(2, '0')}
                        </span>
                        <div className="min-w-0">
                          <span className="font-extrabold text-sm sm:text-base text-slate-900 leading-snug block">
                            Pasal {item.pasal}: {item.title}
                          </span>
                          <span className="text-[11px] font-medium text-slate-500 mt-0.5 block">
                            {item.points.length} butir ketentuan resmi
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span
                          className={`hidden sm:inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                            isOpen
                              ? 'bg-red-100/80 text-red-700 border-red-200'
                              : 'bg-slate-100 text-slate-500 border-slate-200/80'
                          }`}
                        >
                          {item.points.length} Poin
                        </span>
                        <span
                          className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
                            isOpen
                              ? 'bg-red-100 text-red-700 rotate-180'
                              : 'bg-slate-100 text-slate-400 group-hover:bg-slate-200/70 group-hover:text-slate-700'
                          }`}
                        >
                          <ChevronDown className="w-4 h-4" />
                        </span>
                      </div>
                    </button>

                    {isOpen && (
                      <div className="bg-white border-t border-slate-100 p-5 sm:p-6 text-slate-700 text-sm leading-relaxed space-y-3 animate-fade">
                        <div className="grid grid-cols-1 gap-3">
                          {item.points.map((pt, idx) => (
                            <div
                              key={idx}
                              className="p-4 sm:p-5 rounded-xl bg-slate-50/70 border border-slate-200/80 hover:bg-white hover:border-slate-300 transition-all flex items-start gap-3.5"
                            >
                              <span className="w-6 h-6 rounded-lg bg-slate-900 text-white font-mono font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
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
          )}
        </div>
      </div>
    </section>
  );
}
