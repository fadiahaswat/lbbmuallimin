import React from 'react';
import { FileText, ArrowRight, MessageCircle } from 'lucide-react';
import { useCompetition } from '../context/CompetitionContext.jsx';
import { CONTACT } from '../config.js';

export default function StickyCta({ isVisible }) {
  const { openModal } = useCompetition();

  return (
    <div
      id="sticky-cta"
      className={`fixed bottom-0 left-0 w-full bg-white/95 backdrop-blur-md border-t border-slate-200/80 px-3 pt-2 pb-[max(0.625rem,env(safe-area-inset-bottom))] shadow-[0_-8px_20px_rgba(0,0,0,0.08)] z-40 lg:hidden flex items-center gap-2 transition-transform duration-300 ${
        isVisible ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      {/* Tombol Icon WA Resmi */}
      <a
        href={CONTACT.WA_FAB_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Hubungi Panitia via WhatsApp"
        title="Hubungi Panitia via WhatsApp"
        className="shrink-0 flex items-center justify-center w-11 h-10 text-white bg-[#25D366] hover:bg-[#20ba5a] active:bg-[#1caa52] rounded-xl shadow-sm shadow-[#25D366]/30 active:scale-95 transition-all text-center"
      >
        <svg
          viewBox="0 0 24 24"
          width="20"
          height="20"
          fill="currentColor"
          className="shrink-0"
        >
          <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 15 3.8 13.47 3.8 11.91C3.81 7.37 7.5 3.67 12.05 3.67M9.04 7.22C8.87 7.22 8.59 7.28 8.36 7.53C8.12 7.78 7.46 8.4 7.46 9.66C7.46 10.93 8.38 12.14 8.51 12.31C8.64 12.48 10.28 15.01 12.8 16.1C13.4 16.36 13.86 16.51 14.23 16.63C14.83 16.82 15.38 16.79 15.81 16.73C16.29 16.66 17.29 16.13 17.5 15.54C17.71 14.95 17.71 14.45 17.65 14.34C17.59 14.23 17.43 14.17 17.18 14.05C16.93 13.92 15.71 13.32 15.48 13.24C15.26 13.16 15.1 13.11 14.93 13.36C14.77 13.61 14.29 14.17 14.15 14.34C14 14.5 13.86 14.53 13.61 14.4C13.36 14.27 12.57 14.01 11.62 13.17C10.88 12.51 10.38 11.7 10.25 11.45C10.13 11.2 10.24 11.07 10.36 10.95C10.47 10.84 10.61 10.66 10.74 10.51C10.86 10.36 10.9 10.26 10.98 10.09C11.06 9.92 11.02 9.78 10.96 9.66C10.9 9.53 10.43 8.34 10.21 7.85C10.01 7.37 9.8 7.44 9.65 7.43C9.5 7.42 9.34 7.42 9.17 7.42L9.04 7.22Z" />
        </svg>
      </a>

      {/* Tombol Juknis */}
      <a
        href="https://docs.google.com/document/d/1BN1RuwDcEiuibVvoBG4-5R7Rq8neV5st3nAZoISVQi0/edit?usp=sharing"
        target="_blank"
        rel="noopener noreferrer"
        className="flex-1 min-w-0 flex items-center justify-center gap-1.5 h-10 px-3 text-xs sm:text-sm font-bold text-slate-700 bg-slate-100 hover:bg-slate-200/80 active:bg-slate-200 border border-slate-200/80 rounded-xl active:scale-95 transition-all whitespace-nowrap text-center"
      >
        <FileText className="w-4 h-4 text-red-600 shrink-0" />
        <span>Juknis</span>
      </a>

      {/* Tombol Daftar */}
      <button
        type="button"
        onClick={() => openModal('regWizard')}
        className="flex-[1.6] min-w-0 flex items-center justify-center gap-1.5 h-10 px-3 text-xs sm:text-sm font-bold text-white bg-red-700 hover:bg-red-800 active:bg-red-900 rounded-xl shadow-md shadow-red-700/20 active:scale-95 transition-all whitespace-nowrap text-center"
      >
        <span className="truncate">Daftar Sekarang!</span>
        <ArrowRight className="w-4 h-4 shrink-0" />
      </button>
    </div>
  );
}
