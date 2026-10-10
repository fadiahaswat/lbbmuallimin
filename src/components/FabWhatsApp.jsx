import React from 'react';
import { Phone } from 'lucide-react';
import { CONTACT } from '../config.js';

export default function FabWhatsApp({ isShiftedUp }) {
  return (
    <a
      href={CONTACT.WA_FAB_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={`fixed right-4 sm:right-6 z-40 group hidden lg:flex items-center justify-center transition-all duration-300 ease-in-out hover:scale-115 active:scale-95 bottom-6`}
      aria-label="Chat WhatsApp Panitia LBB Mu'allimin 2027"
      title="Tanya Panitia via WhatsApp"
    >
      {/* Gambar Maskot Murni Tanpa Wadah, Tanpa Shadow, Tanpa Dot Hijau (Ukuran Pas & Proporsional) */}
      <div className="relative select-none">
        <img
          src="/manganperpunk.png"
          alt="Maskot Komandan Peleton - Manganperpunk"
          className="w-20 h-20 sm:w-24 sm:h-24 lg:w-[104px] lg:h-[104px] object-contain transition-transform duration-300 group-hover:rotate-6 animate-bounce [animation-duration:2.5s]"
          loading="eager"
        />
      </div>

      {/* Tooltip on hover */}
      <span className="absolute right-full mr-2 hidden sm:group-hover:flex items-center px-3 py-1.5 rounded-xl bg-slate-900/95 text-white text-xs font-bold whitespace-nowrap shadow-xl border border-slate-800 backdrop-blur-xs transition-opacity">
        Tanya Panitia! 💬
      </span>
    </a>
  );
}
