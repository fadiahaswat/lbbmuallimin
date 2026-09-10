import React from 'react';
import { Phone } from 'lucide-react';
import { CONTACT } from '../config.js';

export default function FabWhatsApp({ isShiftedUp }) {
  return (
    <a
      href={CONTACT.WA_FAB_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={`fixed right-6 z-40 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg shadow-green-500/40 transition-all duration-300 ease-in-out hover:scale-110 flex items-center justify-center ${
        isShiftedUp ? 'bottom-[84px] lg:bottom-6' : 'bottom-6'
      }`}
      aria-label="WhatsApp Panitia"
    >
      <Phone className="w-6 h-6" />
    </a>
  );
}
