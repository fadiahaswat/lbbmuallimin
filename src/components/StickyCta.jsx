import React from 'react';
import { Download, ArrowRight } from 'lucide-react';
import { useCompetition } from '../context/CompetitionContext.jsx';

export default function StickyCta({ isVisible }) {
  const { openModal } = useCompetition();

  return (
    <div
      id="sticky-cta"
      className={`fixed bottom-0 left-0 w-full bg-white/90 backdrop-blur-md border-t border-slate-200 p-3 shadow-[0_-5px_15px_rgba(0,0,0,0.1)] z-40 lg:hidden flex gap-3 transition-transform duration-300 ${
        isVisible ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <button
        type="button"
        onClick={() => openModal('docViewer', { docId: 'juknis' })}
        className="flex-1 flex items-center justify-center gap-2 py-3 text-sm font-bold text-slate-700 bg-slate-100 border border-slate-200 rounded-lg active:scale-95 transition-transform"
      >
        <Download className="w-4 h-4" /> Juknis
      </button>
      <button
        type="button"
        onClick={() => openModal('regWizard')}
        className="flex-[2] flex items-center justify-center gap-2 py-3 text-sm font-bold text-white bg-red-700 rounded-lg shadow-lg shadow-red-700/25 active:scale-95 transition-transform hover:bg-red-800"
      >
        Daftar Sekarang <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}
