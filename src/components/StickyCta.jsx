import React from 'react';
import { FileText, ArrowRight } from 'lucide-react';
import { useCompetition } from '../context/CompetitionContext.jsx';

export default function StickyCta({ isVisible }) {
  const { openModal } = useCompetition();

  return (
    <div
      id="sticky-cta"
      className={`fixed bottom-0 left-0 w-full bg-white/95 backdrop-blur-md border-t border-slate-200/80 px-3.5 pt-2.5 pb-[max(0.625rem,env(safe-area-inset-bottom))] shadow-[0_-8px_20px_rgba(0,0,0,0.08)] z-40 lg:hidden flex items-center gap-2.5 transition-transform duration-300 ${
        isVisible ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <a
        href="https://docs.google.com/document/d/1BN1RuwDcEiuibVvoBG4-5R7Rq8neV5st3nAZoISVQi0/edit?usp=sharing"
        target="_blank"
        rel="noopener noreferrer"
        className="flex-1 min-w-0 flex items-center justify-center gap-1.5 py-2.5 px-2 text-xs sm:text-sm font-bold text-slate-700 bg-slate-100 hover:bg-slate-200/80 active:bg-slate-200 border border-slate-200/80 rounded-xl active:scale-95 transition-all whitespace-nowrap text-center"
      >
        <FileText className="w-4 h-4 text-red-600 shrink-0" />
        <span>Juknis</span>
      </a>
      <button
        type="button"
        onClick={() => openModal('regWizard')}
        className="flex-[1.5] min-w-0 flex items-center justify-center gap-1.5 py-2.5 px-3 text-xs sm:text-sm font-bold text-white bg-red-700 hover:bg-red-800 active:bg-red-900 rounded-xl shadow-md shadow-red-700/20 active:scale-95 transition-all whitespace-nowrap text-center"
      >
        <span className="truncate">Daftar Sekarang</span>
        <ArrowRight className="w-4 h-4 shrink-0" />
      </button>
    </div>
  );
}
