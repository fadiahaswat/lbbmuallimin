import React, { useEffect } from 'react';
import {
  Home,
  Info,
  ClipboardList,
  BookOpen,
  Trophy,
  Download,
  Phone,
  ChevronRight,
  ArrowRight,
  Instagram,
  Video,
  X
} from 'lucide-react';
import { SOCIAL } from '../config.js';

export default function MobileMenu({ isOpen, onClose }) {
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    }

    if (isOpen) {
      document.body.classList.add('overflow-hidden');
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.classList.remove('overflow-hidden');
    }

    return () => {
      document.body.classList.remove('overflow-hidden');
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const links = [
    { href: '#home', label: 'Beranda', icon: Home },
    { href: '#about', label: 'Tentang', icon: Info },
    { href: '#registration', label: 'Pendaftaran', icon: ClipboardList },
    { href: '#rules', label: 'Juknis & Materi', icon: BookOpen },
    { href: '#prizes', label: 'Kategori & Hadiah', icon: Trophy },
    { href: '#downloads', label: 'Unduhan', icon: Download },
    { href: '#contact', label: 'Kontak', icon: Phone },
  ];

  return (
    <div
      id="mobile-menu"
      className="fixed inset-0 z-50 bg-slate-950/98 backdrop-blur-2xl pt-24 px-6 flex flex-col transition-opacity duration-300 overflow-y-auto"
    >
      <div className="absolute top-0 right-0 w-64 h-64 bg-red-900/20 rounded-full blur-3xl pointer-events-none -z-10"></div>

      <button
        onClick={onClose}
        className="absolute top-6 right-6 p-2 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-all"
        aria-label="Tutup Menu"
      >
        <X className="w-6 h-6" />
      </button>

      <div className="flex flex-col h-full pb-8">
        <div className="flex-1 flex flex-col gap-3">
          {links.map(item => {
            const Icon = item.icon;
            return (
              <a
                key={item.href}
                href={item.href}
                onClick={onClose}
                className="group flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/10 transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-lg bg-slate-900 flex items-center justify-center text-slate-400 group-hover:text-lbb-gold group-hover:bg-slate-950 transition-colors shadow-inner">
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-lg font-bold text-slate-200 group-hover:text-white tracking-wide">
                  {item.label}
                </span>
                <ChevronRight className="ml-auto text-slate-600 group-hover:text-lbb-gold opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-1 w-5 h-5" />
              </a>
            );
          })}
        </div>

        <div className="mt-6 pt-6 border-t border-white/10 space-y-6">
          <a
            href="#registration"
            onClick={onClose}
            className="w-full py-4 bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 hover:from-yellow-300 hover:to-yellow-400 text-slate-950 font-black rounded-xl text-center shadow-lg shadow-yellow-500/20 active:scale-95 transition-transform flex justify-center items-center gap-3 uppercase tracking-widest text-sm"
          >
            Daftar Sekarang <ArrowRight className="w-5 h-5" />
          </a>

          <div className="flex justify-between items-center px-4">
            <span className="text-xs text-slate-400 font-medium">Ikuti Update:</span>
            <div className="flex gap-4">
              <a
                href={SOCIAL.INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-white transition-colors"
                aria-label="Instagram Resmi LBB"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href={SOCIAL.TIKTOK_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-white transition-colors"
                aria-label="TikTok Resmi Tonti"
              >
                <Video className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
