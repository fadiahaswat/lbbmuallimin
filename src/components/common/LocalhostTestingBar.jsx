import React, { useState } from 'react';
import {
  FlaskConical,
  RefreshCw,
  Trash2,
  ChevronUp,
  ChevronDown,
  X,
  CheckCircle2,
  Sparkles,
  Layers,
  ArrowRight
} from 'lucide-react';
import { useCompetition } from '../../context/CompetitionContext.jsx';

export default function LocalhostTestingBar() {
  const {
    isLocalhost,
    teams,
    scores,
    staging,
    loadFullLocalhostDummySuite,
    clearAllLocalhostData,
    navigateToStage,
    setActiveView
  } = useCompetition();

  const [isOpen, setIsOpen] = useState(false);
  const [toast, setToast] = useState('');

  // SANGAT PENTING: Komponen ini HANYA boleh muncul di lingkungan localhost
  if (!isLocalhost) {
    return null;
  }

  const handleLoadDummy = () => {
    const res = loadFullLocalhostDummySuite();
    if (res.success) {
      setToast('Berhasil memuat dataset dummy lengkap di 8 menu!');
      setTimeout(() => setToast(''), 3500);
    }
  };

  const handleClearData = () => {
    if (confirm('Kosongkan semua data testing di localhost?')) {
      const res = clearAllLocalhostData();
      if (res.success) {
        setToast('Data localhost berhasil dikosongkan.');
        setTimeout(() => setToast(''), 3500);
      }
    }
  };

  const scoredCount = Object.keys(scores || {}).length;
  const stagingCount = Object.values(staging || {}).filter(s => s.stage && s.stage !== 'waiting').length;

  const quickMenus = [
    { label: 'Pendaftaran', stage: 'pendaftaran' },
    { label: 'TM', stage: 'tm' },
    { label: 'Uji Coba', stage: 'uji_coba' },
    { label: 'Pos Basecamp', stage: 'checkin' },
    { label: 'Daerah Persiapan', stage: 'dp' },
    { label: 'Penjurian', stage: 'penjurian' },
    { label: 'Rekap Nilai', stage: 'rekap_nilai' },
    { label: 'Klasemen', stage: 'klasemen' },
  ];

  return (
    <div className="fixed bottom-16 sm:bottom-4 right-3 sm:right-4 z-50 font-sans print:hidden select-none">
      {/* Toast Alert */}
      {toast && (
        <div className="mb-2 bg-emerald-600 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-200" />
          <span>{toast}</span>
        </div>
      )}

      {/* Main Bar Panel */}
      {isOpen ? (
        <div className="bg-slate-950/95 backdrop-blur-md text-white border border-amber-500/40 rounded-2xl p-4 shadow-2xl max-w-sm w-[92vw] sm:w-96 space-y-3.5 transition-all animate-in fade-in zoom-in-95">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
                <FlaskConical className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-amber-400 block leading-tight">
                  Localhost Testing Helper
                </span>
                <span className="text-xs font-bold text-slate-200">
                  Data Dummy 8 Menu Operasional
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-all cursor-pointer"
              title="Tutup Panel Testing"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
            <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-slate-400 block">Peleton</span>
              <span className="font-mono font-bold text-amber-400 text-sm">{teams.length} Tim</span>
            </div>
            <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-slate-400 block">Pos Lapangan</span>
              <span className="font-mono font-bold text-emerald-400 text-sm">{stagingCount} Aktif</span>
            </div>
            <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-slate-400 block">Rekap Nilai</span>
              <span className="font-mono font-bold text-cyan-400 text-sm">{scoredCount} Nilai</span>
            </div>
          </div>

          {/* Primary Action Buttons */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              type="button"
              onClick={handleLoadDummy}
              className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 active:scale-95 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-md shadow-amber-950/40 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Isi Dummy 8 Menu</span>
            </button>
            <button
              type="button"
              onClick={handleClearData}
              className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-red-950/60 hover:text-red-400 hover:border-red-500/40 border border-slate-700 active:scale-95 text-slate-300 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Kosongkan</span>
            </button>
          </div>

          {/* Quick Jump Buttons to 8 Menus */}
          <div className="space-y-1.5 pt-1 border-t border-slate-800/80">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Pintas Menuju Menu Testing:
            </span>
            <div className="grid grid-cols-4 gap-1.5">
              {quickMenus.map(m => (
                <button
                  key={m.stage}
                  type="button"
                  onClick={() => {
                    navigateToStage(m.stage);
                    setIsOpen(false);
                  }}
                  className="py-1 px-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-[10px] font-bold text-slate-300 hover:text-white border border-slate-800 transition-all text-center truncate cursor-pointer"
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Collapsed Floating Pill */
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-slate-950/90 hover:bg-slate-900 text-white border border-amber-500/40 shadow-xl active:scale-95 transition-all cursor-pointer group"
          title="Buka Alat Pengujian Dummy Localhost"
        >
          <div className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30 group-hover:scale-110 transition-transform">
            <FlaskConical className="w-3.5 h-3.5" />
          </div>
          <div className="text-left hidden sm:block">
            <span className="text-[9px] font-black uppercase tracking-wider text-amber-400 block leading-none">
              Localhost Testing
            </span>
            <span className="text-[11px] font-bold text-slate-200 leading-tight">
              Dummy 8 Menu Aktif
            </span>
          </div>
          <ChevronUp className="w-4 h-4 text-slate-400 group-hover:text-white" />
        </button>
      )}
    </div>
  );
}
