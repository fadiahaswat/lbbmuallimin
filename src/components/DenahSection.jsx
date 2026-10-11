import React, { useState } from 'react';
import {
  Map,
  Maximize2,
  Download,
  X,
  Compass,
  ShieldAlert,
} from 'lucide-react';
import { VENUE } from '../config.js';

export default function DenahSection() {
  const [isZoomOpen, setIsZoomOpen] = useState(false);

  return (
    <section id="denah" className="py-16 sm:py-24 lg:py-32 bg-white relative overflow-hidden text-slate-800 font-sans border-t border-slate-200">
      {/* Background accents */}
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px] opacity-60 pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-red-100/50 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-100/50 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header */}
        <div className="mb-10 sm:mb-14 md:mb-16 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-100 border border-slate-200/80 text-slate-600 text-xs font-semibold uppercase tracking-wider mb-4">
            <Compass className="w-3.5 h-3.5 text-red-700" />
            <span>Tata Ruang & Navigasi</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight leading-tight py-1 text-slate-900">
            Denah Area <span className="text-red-700">Perlombaan</span>
          </h2>
          <div className="w-16 h-1 bg-red-700 mx-auto mt-4 rounded-full"></div>
          <p className="text-slate-600 text-base mt-4 leading-relaxed font-normal">
            Tata letak resmi arena perlombaan LBB Mu'allimin 2027 di Kampus Terpadu Sedayu: jalur pergerakan peleton, Daerah Persiapan (DP), basecamp kontingen, dan pos juri.
          </p>
        </div>

        {/* Main Denah Showcase Card */}
        <div className="max-w-6xl mx-auto bg-slate-50 border border-slate-200/90 rounded-2xl p-4 sm:p-7 shadow-sm relative">
          {/* Top Bar */}
          <div className="flex items-center justify-between pb-4 sm:pb-5 border-b border-slate-200">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-slate-200/80 text-slate-800 flex items-center justify-center shrink-0">
                <Map className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 uppercase tracking-tight">
                  Peta Tata Letak & Zona Lomba
                </h3>
                <p className="text-xs text-slate-500 font-normal">
                  Kampus Terpadu Madrasah Mu'allimin Sedayu, Bantul, D.I. Yogyakarta
                </p>
              </div>
            </div>
          </div>

          {/* Image Display Area */}
          <div className="mt-5 space-y-5">
            <div
              onClick={() => setIsZoomOpen(true)}
              className="relative rounded-xl bg-white p-2.5 sm:p-5 shadow-sm border border-slate-200/80 cursor-pointer group overflow-hidden transition-all hover:border-slate-300"
              title="Klik untuk memperbesar denah layar penuh"
            >
              <div className="w-full flex items-center justify-center min-h-[260px] sm:min-h-[500px] lg:min-h-[700px] bg-white py-2">
                <img
                  src="/denah-perlombaan.png"
                  alt="Denah Resmi Area Perlombaan LBB Mu'allimin 2027"
                  className="w-full max-w-4xl max-h-[820px] object-contain mx-auto transition-transform duration-200 group-hover:scale-[1.005]"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </div>

            {/* Ketertiban Zona & Catatan Tambahan - Clean Neutral Notice */}
            <div className="relative rounded-xl bg-white border border-slate-200 p-4 sm:p-5 shadow-sm">
              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                  <ShieldAlert className="w-4 h-4" />
                </div>

                <div className="flex-1 text-xs text-slate-800 leading-relaxed">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="text-slate-950 font-bold text-xs uppercase tracking-wider">
                      Ketertiban Zona & Keamanan Kampus
                    </span>
                    <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-amber-100 text-amber-900">
                      Pemberitahuan
                    </span>
                  </div>
                  <p className="text-slate-600 text-xs mt-1">
                    Seluruh peserta, pembina, suporter, dan pengunjung <strong className="text-red-700 font-semibold">dilarang masuk ke area Asrama Santri</strong> demi menjaga ketertiban dan privasi santri. Detail alur pergerakan resmi akan dipaparkan saat Technical Meeting.
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
                href="/denah-perlombaan.png"
                download="DENAH-PERLOMBAAN-LBB-MUALLIMIN-2027.png"
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
                src="/denah-perlombaan.png"
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
