import React, { useState } from 'react';
import {
  BookOpen,
  FileText,
  ExternalLink,
  Info,
  CheckCircle2,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { DOWNLOADS } from '../config.js';
import { useCompetition } from '../context/CompetitionContext.jsx';

export default function Downloads() {
  const [toastMessage, setToastMessage] = useState('');
  const { openModal } = useCompetition();

  function handleDownload(e, item) {
    e.preventDefault();
    if (openModal) {
      openModal('docViewer', { docId: item.id });
    } else {
      setToastMessage(`Dokumen "${item.title}" akan segera dibuka.`);
      setTimeout(() => setToastMessage(''), 4000);
    }
  }
  return (
    <section id="downloads" className="py-24 lg:py-32 bg-slate-50 relative overflow-hidden font-sans">
      <div className="absolute top-0 right-0 w-1/2 h-full bg-slate-100 skew-x-12 transform origin-top-right -z-10"></div>
      <div className="hidden sm:block absolute bottom-0 left-0 w-64 h-64 bg-red-100/50 rounded-full blur-3xl opacity-50 pointer-events-none transform-gpu"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="mb-12 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-100/70 border border-red-200 text-red-800 text-xs font-bold uppercase tracking-wider mb-4">
            <ShieldCheck className="w-4 h-4" />
            <span>Sistem Pendaftaran 100% Paperless & Online</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-black text-slate-900 uppercase italic tracking-tighter mb-4 leading-tight py-1">
            Pusat{' '}
            <span className="inline-block pr-3 sm:pr-4 pb-1 text-transparent bg-clip-text bg-gradient-to-r from-red-700 via-red-600 to-amber-600">
              Dokumen & Regulasi
            </span>
          </h2>
          <p className="text-slate-600 text-base sm:text-lg font-medium leading-relaxed">
            Seluruh administrasi pendaftaran, biodata peleton, dan pakta integritas dilakukan secara <strong className="text-slate-900">online digital</strong> di website. Dokumen panduan dapat diakses langsung via <strong>Google Docs Resmi</strong>.
          </p>
        </div>

        {/* Hero Juknis Download Card */}
        <div className="max-w-4xl mx-auto">
          <div className="group bg-gradient-to-br from-slate-950 via-slate-900 to-slate-900 rounded-3xl p-8 sm:p-12 shadow-2xl border border-slate-800 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-8 transition-all hover:border-slate-700">
            {/* Background Glow */}
            <div className="hidden sm:block absolute -top-20 -right-20 w-64 h-64 bg-red-600/25 rounded-full blur-3xl group-hover:bg-red-500/35 transition-all duration-500 pointer-events-none transform-gpu"></div>
            <div className="hidden sm:block absolute -bottom-20 -left-20 w-64 h-64 bg-amber-500/15 rounded-full blur-3xl pointer-events-none transform-gpu"></div>

            <div className="space-y-4 max-w-xl relative z-10">
              <div className="flex items-center gap-3">
                <div className="p-3.5 bg-red-600/20 text-red-400 border border-red-500/30 rounded-2xl shadow-inner">
                  <BookOpen className="w-8 h-8" />
                </div>
                <span className="px-3 py-1 bg-red-700 text-white text-[11px] font-extrabold rounded-full uppercase tracking-wider shadow-md">
                  Dokumen Resmi
                </span>
                <span className="px-2.5 py-0.5 bg-slate-800 text-amber-400 text-xs font-mono font-bold rounded-lg border border-slate-700">
                  Google Docs
                </span>
              </div>

              <div>
                <h3 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                  Buku Petunjuk Teknis (Juknis) Resmi LBB 2027
                </h3>
                <p className="text-sm sm:text-base text-slate-300 mt-2 leading-relaxed font-normal">
                  Memuat regulasi perlombaan lengkap, tata tertib, susunan materi PBB baku, pedoman variasi & formasi, tata cara penilaian juri, serta denah kotak lomba di Lapangan Mu'allimin.
                </p>
              </div>

              {/* Online Features Benefit Pill */}
              <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Biodata personel diisi di portal online</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Pakta integritas bertanda tangan digital</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 shrink-0 relative z-10 w-full md:w-auto md:min-w-[340px]">
              {/* Row 1: 2 Google Docs Buttons Side by Side */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full">
                <a
                  href={DOWNLOADS[0]?.url || 'https://docs.google.com/document/d/1BN1RuwDcEiuibVvoBG4-5R7Rq8neV5st3nAZoISVQi0/edit?usp=sharing'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-3.5 bg-gradient-to-r from-red-700 via-red-600 to-amber-600 hover:from-red-600 hover:to-amber-500 text-white rounded-2xl text-xs font-black uppercase tracking-wider shadow-lg shadow-red-950/40 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer text-center"
                >
                  <FileText className="w-4 h-4 shrink-0" />
                  <span>Juknis Lapangan</span>
                  <ExternalLink className="w-3.5 h-3.5 shrink-0 opacity-80" />
                </a>

                <a
                  href={DOWNLOADS[1]?.url || 'https://docs.google.com/document/d/1rkVVB0XgycFRQgx8N4Zs7K6LB6T2J0cjYTtmALxpDzM/edit?usp=sharing'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-3.5 bg-slate-800/90 hover:bg-slate-700 text-slate-200 hover:text-white rounded-2xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer border border-slate-700 hover:border-slate-600 text-center"
                >
                  <FileText className="w-4 h-4 shrink-0 text-amber-400" />
                  <span>Tata Tertib</span>
                  <ExternalLink className="w-3.5 h-3.5 shrink-0 opacity-70" />
                </a>
              </div>

              {/* Row 2: Buka Formulir Online */}
              <button
                type="button"
                onClick={() => openModal('regWizard')}
                className="w-full py-3 px-5 bg-white/10 hover:bg-white/15 text-slate-200 hover:text-white rounded-2xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer border border-white/10 hover:border-white/20 active:scale-95"
              >
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Buka Formulir Online</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {toastMessage && (
        <div className="fixed bottom-24 lg:bottom-8 left-1/2 -translate-x-1/2 z-50 bg-slate-900/95 text-white px-5 py-3 rounded-xl shadow-2xl border border-yellow-500/40 backdrop-blur-md flex items-center gap-3 animate-fade max-w-md text-xs sm:text-sm">
          <Info className="w-5 h-5 text-yellow-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </section>
  );
}
