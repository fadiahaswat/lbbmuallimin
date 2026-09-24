import React, { useState } from 'react';
import {
  Map,
  Maximize2,
  Download,
  X,
  Compass,
  Store,
  ShieldCheck,
  Flag,
  Car,
  Tent,
  Info,
  ExternalLink,
  AlertCircle,
  Trophy,
  Swords,
  Timer,
  Megaphone,
  ShoppingBag,
  ShieldAlert,
  Sparkles,
  Layers
} from 'lucide-react';
import { VENUE } from '../config.js';

export default function DenahSection() {
  const [isZoomOpen, setIsZoomOpen] = useState(false);

  const legendItems = [
    {
      label: 'Pos SD/MI (Arena 1)',
      desc: 'Lapangan Basket Outdoor',
      icon: Swords,
      hoverClass: 'hover:bg-red-500/10 hover:border-red-500/60 hover:shadow-[0_0_20px_rgba(239,68,68,0.2)]',
      hoverIcon: 'group-hover:bg-red-500 group-hover:text-white group-hover:border-red-400 group-hover:shadow-[0_0_12px_rgba(239,68,68,0.5)]',
      hoverText: 'group-hover:text-red-400',
    },
    {
      label: 'Pos SMP/MTs (Arena 2)',
      desc: 'Pelataran Embung Sedayu',
      icon: Trophy,
      hoverClass: 'hover:bg-blue-600/15 hover:border-blue-500/60 hover:shadow-[0_0_20px_rgba(59,130,246,0.2)]',
      hoverIcon: 'group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-400 group-hover:shadow-[0_0_12px_rgba(59,130,246,0.5)]',
      hoverText: 'group-hover:text-blue-400',
    },
    {
      label: 'Daerah Persiapan (DP)',
      desc: 'Area Warming Up & Baris Peleton',
      icon: Timer,
      hoverClass: 'hover:bg-purple-600/15 hover:border-purple-500/60 hover:shadow-[0_0_20px_rgba(168,85,247,0.2)]',
      hoverIcon: 'group-hover:bg-purple-600 group-hover:text-white group-hover:border-purple-400 group-hover:shadow-[0_0_12px_rgba(168,85,247,0.5)]',
      hoverText: 'group-hover:text-purple-400',
    },
    {
      label: 'Lapangan Upacara',
      desc: 'Lapangan Mini Soccer (Apel & Closing)',
      icon: Flag,
      hoverClass: 'hover:bg-emerald-600/15 hover:border-emerald-500/60 hover:shadow-[0_0_20px_rgba(16,185,129,0.2)]',
      hoverIcon: 'group-hover:bg-emerald-600 group-hover:text-white group-hover:border-emerald-400 group-hover:shadow-[0_0_12px_rgba(16,185,129,0.5)]',
      hoverText: 'group-hover:text-emerald-400',
    },
    {
      label: 'Tempat Transit Peserta',
      desc: 'Basecamp & Ruang Istirahat Tim',
      icon: Tent,
      hoverClass: 'hover:bg-teal-600/15 hover:border-teal-500/60 hover:shadow-[0_0_20px_rgba(20,184,166,0.2)]',
      hoverIcon: 'group-hover:bg-teal-600 group-hover:text-white group-hover:border-teal-400 group-hover:shadow-[0_0_12px_rgba(20,184,166,0.5)]',
      hoverText: 'group-hover:text-teal-400',
    },
    {
      label: 'Pusat Informasi & Sekretariat',
      desc: 'Layanan Panitia & Registrasi Ulang',
      icon: Megaphone,
      hoverClass: 'hover:bg-yellow-500/15 hover:border-yellow-500/60 hover:shadow-[0_0_20px_rgba(234,179,8,0.2)]',
      hoverIcon: 'group-hover:bg-yellow-500 group-hover:text-black group-hover:border-yellow-400 group-hover:shadow-[0_0_12px_rgba(234,179,8,0.5)]',
      hoverText: 'group-hover:text-yellow-400',
    },
    {
      label: 'Lapak Kuliner & 1918 Mart',
      desc: "Kompleks Math'am & Foodcourt",
      icon: ShoppingBag,
      hoverClass: 'hover:bg-amber-500/15 hover:border-amber-500/60 hover:shadow-[0_0_20px_rgba(245,158,11,0.2)]',
      hoverIcon: 'group-hover:bg-amber-500 group-hover:text-white group-hover:border-amber-400 group-hover:shadow-[0_0_12px_rgba(245,158,11,0.5)]',
      hoverText: 'group-hover:text-amber-400',
    },
    {
      label: 'Area Parkir Terpadu',
      desc: 'Parkir Kendaraan Roda 2 & Roda 4',
      icon: Car,
      hoverClass: 'hover:bg-orange-500/15 hover:border-orange-500/60 hover:shadow-[0_0_20px_rgba(249,115,22,0.2)]',
      hoverIcon: 'group-hover:bg-orange-500 group-hover:text-white group-hover:border-orange-400 group-hover:shadow-[0_0_12px_rgba(249,115,22,0.5)]',
      hoverText: 'group-hover:text-orange-400',
    },
    {
      label: 'Pos Satpam & Gerbang Utama',
      desc: 'Akses Masuk & Pengamanan Kampus',
      icon: ShieldCheck,
      hoverClass: 'hover:bg-slate-700/25 hover:border-slate-500/60 hover:shadow-[0_0_20px_rgba(148,163,184,0.15)]',
      hoverIcon: 'group-hover:bg-slate-600 group-hover:text-white group-hover:border-slate-400 group-hover:shadow-[0_0_12px_rgba(148,163,184,0.4)]',
      hoverText: 'group-hover:text-slate-300',
    },
  ];

  return (
    <section id="denah" className="py-24 lg:py-32 bg-slate-900 relative overflow-hidden text-white font-sans border-t border-slate-800">
      {/* Background accents */}
      <div className="absolute inset-0 bg-carbon-pattern opacity-15 pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-[128px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-yellow-500/10 rounded-full blur-[128px] pointer-events-none"></div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="mb-14 md:mb-20 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-500/15 border border-red-500/30 text-red-400 text-xs font-bold uppercase tracking-wider mb-4">
            <Compass className="w-4 h-4 text-yellow-400" />
            <span>Tata Ruang & Navigasi Arena</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter leading-tight py-1 text-white">
            Denah Area <span>Perlombaan</span>
          </h2>
          <div className="w-20 h-1.5 bg-red-600 mx-auto mt-4 rounded-full skew-x-12 shadow-[0_0_15px_rgba(220,38,38,0.5)]"></div>
          <p className="text-slate-400 text-sm sm:text-base mt-6 leading-relaxed">
            Layout resmi arena perlombaan LBB Mu'allimin 2027 di Kampus Terpadu Sedayu. Seluruh jalur pergerakan, Daerah Persiapan (DP), basecamp, hingga area kuliner tertata secara terintegrasi.
          </p>
        </div>

        {/* Main Denah Showcase Card */}
        <div className="max-w-6xl mx-auto bg-slate-950 border border-slate-800 rounded-3xl p-4 sm:p-8 shadow-2xl relative">
          {/* Top Bar */}
          <div className="flex items-center gap-3 pb-6 border-b border-slate-800">
            <div className="w-10 h-10 rounded-xl bg-red-600/20 border border-red-500/30 text-red-400 flex items-center justify-center shrink-0">
              <Map className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-white uppercase tracking-tight">
                Peta Tata Letak & Zona Lomba
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                Kampus Terpadu Madrasah Mu'allimin Sedayu
              </p>
            </div>
          </div>

          {/* Image Display Area with pure white background - Grand Display */}
          <div className="mt-6 space-y-6">
            {/* Grand Clean White Image Canvas */}
            <div
              onClick={() => setIsZoomOpen(true)}
              className="relative rounded-2xl bg-white p-4 sm:p-8 shadow-2xl border-2 border-slate-700 cursor-pointer group overflow-hidden transition-all hover:border-yellow-400"
              title="Klik untuk memperbesar denah layar penuh"
            >
              {/* Visual badge top right */}
              <div className="absolute top-4 right-4 z-10 bg-slate-900/90 text-white text-xs font-bold px-3 py-1.5 rounded-xl backdrop-blur-sm border border-slate-700 flex items-center gap-2 shadow-lg">
                <Maximize2 className="w-3.5 h-3.5 text-yellow-400" />
                <span>Klik untuk Zoom Layar Penuh</span>
              </div>

              {/* Pure White Background wrapper */}
              <div className="w-full flex items-center justify-center min-h-[500px] sm:min-h-[700px] lg:min-h-[850px] bg-white py-4">
                <picture>
                  <source srcSet="/denah-lbb-muallimin-2027.webp" type="image/webp" />
                  <img
                    src="/denah-lbb-muallimin-2027.png"
                    alt="Denah Resmi Area Perlombaan LBB Mu'allimin 2027"
                    className="w-full max-w-4xl max-h-[900px] object-contain mx-auto transition-transform duration-300 group-hover:scale-[1.01]"
                    loading="lazy"
                    decoding="async"
                  />
                </picture>
              </div>
            </div>

            {/* Legend & Navigation Guide below the giant image - COMPACT & IMMERSIVE */}
            <div className="bg-gradient-to-b from-slate-950 via-slate-900/90 to-slate-950 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/5 rounded-full blur-2xl pointer-events-none"></div>

              {/* Header Legend Compact */}
              <div className="flex items-center gap-2 mb-3.5 border-b border-slate-800/80 pb-3">
                <span className="p-1 rounded-lg bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
                  <Layers className="w-3.5 h-3.5" />
                </span>
                <h4 className="text-xs sm:text-sm font-black text-white uppercase tracking-wider">
                  Keterangan & Legenda Area Lomba
                </h4>
              </div>

              {/* Compact 3-Column Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                {legendItems.map((item, idx) => {
                  const IconComp = item.icon;
                  return (
                    <div
                      key={idx}
                      className={`relative overflow-hidden rounded-xl bg-slate-900/80 border border-slate-800 p-2.5 transition-all duration-300 group cursor-pointer ${item.hoverClass}`}
                    >
                      <div className="flex items-center gap-2.5">
                        {/* Icon Box */}
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border bg-slate-800/80 border-slate-700 text-slate-300 transition-all duration-300 ${item.hoverIcon}`}>
                          <IconComp className="w-4 h-4 transition-colors" />
                        </div>

                        {/* Text only */}
                        <div className="flex-1 min-w-0">
                          <h5 className={`text-[11px] sm:text-xs font-bold text-white transition-colors truncate ${item.hoverText}`}>
                            {item.label}
                          </h5>
                          <p className="text-[10.5px] text-slate-400 group-hover:text-slate-300 transition-colors truncate leading-tight mt-0.5">
                            {item.desc}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Ketertiban Zona & Catatan Tambahan - COMPACT Warning Banner */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-950/40 via-slate-950 to-amber-950/30 border border-amber-500/30 p-3.5 sm:p-4 shadow-md">
              <div className="flex items-start sm:items-center gap-3">
                {/* Glowing Warning Emblem Compact */}
                <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-400 flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(245,158,11,0.2)]">
                  <ShieldAlert className="w-4 h-4 text-amber-400" />
                </div>

                <div className="flex-1 text-xs text-slate-300 leading-snug">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="text-white font-bold text-xs uppercase tracking-wide">
                      Ketertiban Zona & Catatan Tambahan
                    </span>
                    <span className="text-[9px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40 px-1.5 py-0.2 rounded">
                      Penting
                    </span>
                  </div>
                  <p className="text-slate-400 text-[11px] sm:text-xs">
                    Seluruh peserta, pembina, suporter, dan pengunjung <span className="text-red-400 font-bold bg-red-950/60 px-1.5 py-0.5 rounded border border-red-500/30">DILARANG MASUK ke area Asrama Santri</span> demi menjaga ketertiban, keamanan, dan privasi santri. Detail alur disosialisasikan saat Technical Meeting.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox / Fullscreen Zoom Modal */}
      {isZoomOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-md flex flex-col p-4 sm:p-6 animate-fade"
          onClick={() => setIsZoomOpen(false)}
        >
          <div className="max-w-6xl w-full mx-auto flex items-center justify-between py-2 text-white border-b border-slate-800 shrink-0">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-red-600"></span>
              <div>
                <h4 className="font-black text-sm uppercase tracking-wide text-white">Denah Lengkap Area Perlombaan LBB Mu'allimin 2027</h4>
                <p className="text-[11px] text-slate-400">Kampus Terpadu Madrasah Mu'allimin Muhammadiyah Yogyakarta (Sedayu)</p>
              </div>
            </div>

            <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
              <a
                href="/denah-lbb-muallimin-2027.png"
                download="DENAH-LBB-MUALLIMIN-2027.png"
                className="px-3.5 py-1.5 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-md"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Unduh HD</span>
              </a>
              <button
                type="button"
                onClick={() => setIsZoomOpen(false)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white transition-all cursor-pointer"
                title="Tutup (Esc)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div
            className="flex-1 flex items-center justify-center p-2 sm:p-4 overflow-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-2xl w-full max-w-6xl max-h-[88vh] overflow-auto flex items-center justify-center border border-slate-700">
              <img
                src="/denah-lbb-muallimin-2027.png"
                alt="Denah Lengkap Area Perlombaan LBB Mu'allimin 2027"
                className="max-h-[82vh] w-auto object-contain select-none pointer-events-auto"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
