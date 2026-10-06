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
      borderClass: 'border-red-200 hover:border-red-400',
      bgClass: 'bg-red-50/50 hover:bg-red-50',
      iconBg: 'bg-red-100 text-red-700 border-red-200',
      titleColor: 'text-slate-900 group-hover:text-red-700',
    },
    {
      label: 'Pos SMP/MTs (Arena 2)',
      desc: 'Pelataran Embung Sedayu',
      icon: Trophy,
      borderClass: 'border-blue-200 hover:border-blue-400',
      bgClass: 'bg-blue-50/50 hover:bg-blue-50',
      iconBg: 'bg-blue-100 text-blue-700 border-blue-200',
      titleColor: 'text-slate-900 group-hover:text-blue-700',
    },
    {
      label: 'Daerah Persiapan (DP)',
      desc: 'Area Warming Up & Baris Peleton',
      icon: Timer,
      borderClass: 'border-purple-200 hover:border-purple-400',
      bgClass: 'bg-purple-50/50 hover:bg-purple-50',
      iconBg: 'bg-purple-100 text-purple-700 border-purple-200',
      titleColor: 'text-slate-900 group-hover:text-purple-700',
    },
    {
      label: 'Lapangan Upacara',
      desc: 'Lapangan Mini Soccer (Apel & Closing)',
      icon: Flag,
      borderClass: 'border-emerald-200 hover:border-emerald-400',
      bgClass: 'bg-emerald-50/50 hover:bg-emerald-50',
      iconBg: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      titleColor: 'text-slate-900 group-hover:text-emerald-700',
    },
    {
      label: 'Tempat Transit Peserta',
      desc: 'Basecamp & Ruang Istirahat Tim',
      icon: Tent,
      borderClass: 'border-teal-200 hover:border-teal-400',
      bgClass: 'bg-teal-50/50 hover:bg-teal-50',
      iconBg: 'bg-teal-100 text-teal-700 border-teal-200',
      titleColor: 'text-slate-900 group-hover:text-teal-700',
    },
    {
      label: 'Pusat Informasi & Sekretariat',
      desc: 'Layanan Panitia & Registrasi Ulang',
      icon: Megaphone,
      borderClass: 'border-amber-200 hover:border-amber-400',
      bgClass: 'bg-amber-50/50 hover:bg-amber-50',
      iconBg: 'bg-amber-100 text-amber-700 border-amber-200',
      titleColor: 'text-slate-900 group-hover:text-amber-800',
    },
    {
      label: 'Lapak Kuliner & 1918 Mart',
      desc: "Kompleks Math'am & Foodcourt",
      icon: ShoppingBag,
      borderClass: 'border-orange-200 hover:border-orange-400',
      bgClass: 'bg-orange-50/50 hover:bg-orange-50',
      iconBg: 'bg-orange-100 text-orange-700 border-orange-200',
      titleColor: 'text-slate-900 group-hover:text-orange-700',
    },
    {
      label: 'Area Parkir Terpadu',
      desc: 'Parkir Kendaraan Roda 2 & Roda 4',
      icon: Car,
      borderClass: 'border-slate-200 hover:border-slate-400',
      bgClass: 'bg-slate-50 hover:bg-slate-100',
      iconBg: 'bg-slate-200 text-slate-700 border-slate-300',
      titleColor: 'text-slate-900 group-hover:text-slate-800',
    },
    {
      label: 'Pos Satpam & Gerbang Utama',
      desc: 'Akses Masuk & Pengamanan Kampus',
      icon: ShieldCheck,
      borderClass: 'border-slate-200 hover:border-slate-400',
      bgClass: 'bg-slate-50 hover:bg-slate-100',
      iconBg: 'bg-slate-200 text-slate-700 border-slate-300',
      titleColor: 'text-slate-900 group-hover:text-slate-800',
    },
  ];

  return (
    <section id="denah" className="py-24 lg:py-32 bg-white relative overflow-hidden text-slate-800 font-sans border-t border-slate-200">
      {/* Background accents */}
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px] opacity-60 pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-red-100/50 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-100/50 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="mb-14 md:mb-20 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-100 border border-red-200 text-red-800 text-xs font-bold uppercase tracking-wider mb-4 shadow-sm">
            <Compass className="w-4 h-4 text-red-700" />
            <span>Tata Ruang & Navigasi Arena</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter leading-tight py-1 text-slate-900">
            Denah Area <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-800">Perlombaan</span>
          </h2>
          <div className="w-20 h-1.5 bg-red-600 mx-auto mt-4 rounded-full skew-x-12 shadow-sm"></div>
          <p className="text-slate-600 text-sm sm:text-base mt-4 leading-relaxed">
            Layout resmi arena perlombaan LBB Mu'allimin 2027 di Kampus Terpadu Sedayu. Seluruh jalur pergerakan, Daerah Persiapan (DP), basecamp, hingga area kuliner tertata secara terintegrasi.
          </p>
        </div>

        {/* Main Denah Showcase Card */}
        <div className="max-w-6xl mx-auto bg-slate-50 border border-slate-200 rounded-3xl p-4 sm:p-8 shadow-xl relative">
          {/* Top Bar */}
          <div className="flex items-center justify-between pb-6 border-b border-slate-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-100 border border-red-200 text-red-700 flex items-center justify-center shrink-0 shadow-sm">
                <Map className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black text-slate-900 uppercase tracking-tight">
                  Peta Tata Letak & Zona Lomba
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Kampus Terpadu Madrasah Mu'allimin Sedayu &bull; Bantul, D.I. Yogyakarta
                </p>
              </div>
            </div>

            <div className="hidden sm:flex items-center gap-2 text-xs font-bold text-slate-600 bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Resolusi HD Resmi</span>
            </div>
          </div>

          {/* Image Display Area with pure white background - Grand Display */}
          <div className="mt-6 space-y-6">
            {/* Grand Clean White Image Canvas */}
            <div
              onClick={() => setIsZoomOpen(true)}
              className="relative rounded-2xl bg-white p-4 sm:p-8 shadow-lg border border-slate-200 cursor-pointer group overflow-hidden transition-all hover:border-red-400 hover:shadow-xl"
              title="Klik untuk memperbesar denah layar penuh"
            >
              {/* Visual badge top right */}
              <div className="absolute top-4 right-4 z-10 bg-slate-900/90 text-white text-xs font-bold px-3 py-1.5 rounded-xl backdrop-blur-sm border border-slate-700 flex items-center gap-2 shadow-lg">
                <Maximize2 className="w-3.5 h-3.5 text-amber-400" />
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

            {/* Legend & Navigation Guide below the giant image - COMPACT & CLEAN */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-md relative overflow-hidden">
              {/* Header Legend Compact */}
              <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-red-100 text-red-700 border border-red-200">
                    <Layers className="w-4 h-4" />
                  </span>
                  <h4 className="text-xs sm:text-sm font-black text-slate-900 uppercase tracking-wider">
                    Keterangan & Legenda Area Lomba
                  </h4>
                </div>
                <span className="text-[11px] font-semibold text-slate-500 bg-slate-50 border border-slate-200 px-2.5 py-0.5 rounded-full">
                  9 Titik Vital
                </span>
              </div>

              {/* Compact 3-Column Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {legendItems.map((item, idx) => {
                  const IconComp = item.icon;
                  return (
                    <div
                      key={idx}
                      className={`relative overflow-hidden rounded-xl border p-3 transition-all duration-300 group cursor-pointer ${item.bgClass} ${item.borderClass}`}
                    >
                      <div className="flex items-center gap-3">
                        {/* Icon Box */}
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border shadow-sm transition-all duration-300 ${item.iconBg}`}>
                          <IconComp className="w-4 h-4" />
                        </div>

                        {/* Text */}
                        <div className="flex-1 min-w-0">
                          <h5 className={`text-xs font-bold transition-colors truncate ${item.titleColor}`}>
                            {item.label}
                          </h5>
                          <p className="text-[11px] text-slate-600 transition-colors truncate leading-tight mt-0.5">
                            {item.desc}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Ketertiban Zona & Catatan Tambahan - Alert Banner */}
            <div className="relative overflow-hidden rounded-2xl bg-amber-50 border-2 border-amber-300 p-4 sm:p-5 shadow-sm">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-md">
                  <ShieldAlert className="w-5 h-5" />
                </div>

                <div className="flex-1 text-xs text-slate-800 leading-relaxed">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="text-slate-950 font-black text-xs uppercase tracking-wide">
                      Ketertiban Zona & Keamanan Kampus
                    </span>
                    <span className="text-[10px] font-black uppercase tracking-wider bg-amber-200 text-amber-900 border border-amber-300 px-2 py-0.5 rounded-full">
                      Penting
                    </span>
                  </div>
                  <p className="text-slate-700 text-xs mt-1">
                    Seluruh peserta, pembina, suporter, dan pengunjung <strong className="text-red-700 font-bold bg-red-100 px-1.5 py-0.5 rounded border border-red-200">DILARANG MASUK ke area Asrama Santri</strong> demi menjaga ketertiban, keamanan, dan privasi santri. Detail alur pergerakan resmi akan dipaparkan secara rinci saat Technical Meeting.
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
