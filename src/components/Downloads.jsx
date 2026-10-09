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
          <div className="inline-flex items-center justify-center gap-2 px-3.5 sm:px-4 py-1.5 rounded-full bg-red-100/70 border border-red-200 text-red-800 text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-4 max-w-full text-center leading-normal">
            <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 text-red-700" />
            <span className="truncate sm:whitespace-normal">Sistem Pendaftaran 100% Paperless & Online</span>
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

        {/* Single Unified Document Card: PETUNJUK TEKNIS LBB MU'ALLIMIN 2027 */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="relative group bg-gradient-to-br from-slate-950 via-slate-900 to-slate-900 rounded-3xl p-7 sm:p-10 border border-slate-800 shadow-2xl hover:border-red-500/40 transition-all duration-300 overflow-hidden">
            <div className="absolute -top-16 -right-16 w-56 h-56 bg-red-600/15 rounded-full blur-3xl group-hover:bg-red-500/25 transition-all duration-500 pointer-events-none"></div>

            <div className="relative z-10 space-y-6">
              <div className="flex items-center justify-between gap-3">
                <div className="p-3.5 bg-red-600/20 text-red-400 border border-red-500/30 rounded-2xl shadow-sm">
                  <BookOpen className="w-7 h-7" />
                </div>
                <span className="px-3 py-1 bg-red-600 text-white text-[10px] sm:text-xs font-black rounded-full uppercase tracking-wider shadow-sm">
                  Dokumen Resmi Utama
                </span>
              </div>

              <div>
                <span className="text-xs font-black uppercase tracking-widest text-red-400 block mb-1">
                  Petunjuk Teknis
                </span>
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-white leading-tight uppercase italic tracking-tight">
                  LBB MU'ALLIMIN 2027
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 mt-3 leading-relaxed font-normal max-w-2xl">
                  Dokumen regulasi resmi terpadu yang memuat petunjuk teknis gerakan PBB baku, kriteria penilaian dewan juri, tata tertib peserta & official, protokol keamanan kawasan, hingga ketentuan penalti.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-3 pt-2 text-xs text-slate-300 font-medium border-t border-slate-800/80">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Juknis Lapangan & Materi PBB SD & SMP</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Sistem Penilaian, Durasi & Rekapitulasi</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Tata Tertib Kontingen & Basecamp</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Ketentuan Atribut, Suporter & Penalti</span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800">
                <a
                  href={DOWNLOADS[0]?.url || 'https://docs.google.com/document/d/1BN1RuwDcEiuibVvoBG4-5R7Rq8neV5st3nAZoISVQi0/edit?usp=sharing'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-3 py-4 px-8 bg-gradient-to-r from-red-700 via-red-600 to-amber-600 hover:from-red-600 hover:to-amber-500 text-white rounded-2xl text-sm font-black uppercase tracking-wider shadow-xl shadow-red-950/50 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer text-center"
                >
                  <FileText className="w-5 h-5" />
                  <span>Buka Petunjuk Teknis LBB Mu'allimin 2027</span>
                  <ExternalLink className="w-4 h-4 opacity-80" />
                </a>
              </div>
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
