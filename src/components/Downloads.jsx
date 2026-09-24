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

        {/* Dual Document Cards (Juknis & Tata Tertib Google Docs) */}
        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto mb-8">
          {/* Card 1: Juknis Lapangan */}
          <div className="relative group bg-gradient-to-br from-slate-950 via-slate-900 to-slate-900 rounded-3xl p-7 sm:p-8 border border-slate-800 shadow-xl hover:border-red-500/40 transition-all duration-300 flex flex-col justify-between overflow-hidden">
            <div className="absolute -top-12 -right-12 w-40 h-40 bg-red-600/15 rounded-full blur-2xl group-hover:bg-red-500/25 transition-all duration-500 pointer-events-none"></div>

            <div className="relative z-10 space-y-4">
              <div className="flex items-center justify-between gap-3">
                <div className="p-3 bg-red-600/20 text-red-400 border border-red-500/30 rounded-2xl">
                  <BookOpen className="w-6 h-6" />
                </div>
                <span className="px-2.5 py-1 bg-red-700/90 text-white text-[10px] font-extrabold rounded-full uppercase tracking-wider">
                  Wajib Dipelajari
                </span>
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl font-black text-white leading-snug">
                  Petunjuk Teknis (Juknis) Lapangan
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed font-normal">
                  Panduan operasional lengkap pelaksanaan lomba, ketentuan teknis gerakan PBB, durasi, kriteria penilaian dewan juri, hingga regulasi penalti.
                </p>
              </div>

              <div className="space-y-1.5 pt-1 text-xs text-slate-400 font-medium">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Materi PBB baku SD/MI & SMP/MTs</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Sistem penilaian & rekapitulasi poin</span>
                </div>
              </div>
            </div>

            <div className="relative z-10 pt-6 mt-6 border-t border-slate-800">
              <a
                href={DOWNLOADS[0]?.url || 'https://docs.google.com/document/d/1BN1RuwDcEiuibVvoBG4-5R7Rq8neV5st3nAZoISVQi0/edit?usp=sharing'}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-5 bg-gradient-to-r from-red-700 via-red-600 to-amber-600 hover:from-red-600 hover:to-amber-500 text-white rounded-2xl text-xs sm:text-sm font-black uppercase tracking-wider shadow-lg shadow-red-950/40 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2.5 cursor-pointer text-center"
              >
                <FileText className="w-4 h-4" />
                <span>Buka Juknis Lapangan</span>
                <ExternalLink className="w-4 h-4 opacity-80" />
              </a>
            </div>
          </div>

          {/* Card 2: Tata Tertib Peserta & Official */}
          <div className="relative group bg-gradient-to-br from-slate-950 via-slate-900 to-slate-900 rounded-3xl p-7 sm:p-8 border border-slate-800 shadow-xl hover:border-amber-500/40 transition-all duration-300 flex flex-col justify-between overflow-hidden">
            <div className="absolute -top-12 -right-12 w-40 h-40 bg-amber-500/10 rounded-full blur-2xl group-hover:bg-amber-500/20 transition-all duration-500 pointer-events-none"></div>

            <div className="relative z-10 space-y-4">
              <div className="flex items-center justify-between gap-3">
                <div className="p-3 bg-amber-500/15 text-amber-400 border border-amber-500/30 rounded-2xl">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <span className="px-2.5 py-1 bg-amber-600/80 text-white text-[10px] font-extrabold rounded-full uppercase tracking-wider">
                  Regulasi Tempat
                </span>
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl font-black text-white leading-snug">
                  Tata Tertib Peserta & Official
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed font-normal">
                  Ketentuan tata tertib, hak & kewajiban kontingen peleton, pembina, serta official selama berada di kawasan Kampus Terpadu Sedayu.
                </p>
              </div>

              <div className="space-y-1.5 pt-1 text-xs text-slate-400 font-medium">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Protokol basecamp & kebersihan area</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Ketentuan atribut seragam & suporter</span>
                </div>
              </div>
            </div>

            <div className="relative z-10 pt-6 mt-6 border-t border-slate-800">
              <a
                href={DOWNLOADS[1]?.url || 'https://docs.google.com/document/d/1rkVVB0XgycFRQgx8N4Zs7K6LB6T2J0cjYTtmALxpDzM/edit?usp=sharing'}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-5 bg-slate-800 hover:bg-slate-700 text-slate-100 hover:text-white rounded-2xl text-xs sm:text-sm font-black uppercase tracking-wider border border-slate-700 hover:border-slate-600 shadow-md hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2.5 cursor-pointer text-center"
              >
                <FileText className="w-4 h-4 text-amber-400" />
                <span>Buka Tata Tertib</span>
                <ExternalLink className="w-4 h-4 opacity-80" />
              </a>
            </div>
          </div>
        </div>

        {/* Paperless & Online Registration Banner */}
        <div className="max-w-5xl mx-auto bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-red-100 text-red-700 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 leading-tight">
                Pendaftaran & Administrasi 100% Digital
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Pengisian biodata peleton dan unggah berkas dilakukan langsung di website tanpa perlu mencetak formulir.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => openModal('regWizard')}
            className="w-full sm:w-auto px-6 py-2.5 bg-slate-900 hover:bg-red-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 shrink-0 cursor-pointer shadow-sm hover:shadow"
          >
            Buka Formulir Online
          </button>
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
