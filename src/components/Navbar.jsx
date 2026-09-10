import React, { useState, useEffect } from 'react';
import { ArrowRight, Menu } from 'lucide-react';
import { NAVBAR } from '../config.js';

export default function Navbar({ onOpenMobileMenu }) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    function handleScroll() {
      if (window.scrollY > NAVBAR.SCROLL_SOLID_THRESHOLD) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    }

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      id="navbar"
      className={`fixed top-0 w-full z-50 transition-all duration-300 border-b ${
        isScrolled
          ? 'bg-white shadow-md py-3 border-slate-200/50'
          : 'bg-transparent py-4 md:py-5 border-transparent'
      }`}
    >
      <div className="container mx-auto px-6 flex justify-between items-center">
        <a
          href="#home"
          className="group flex items-center gap-3 focus:outline-none transition-transform hover:scale-105 duration-300"
          aria-label="Kembali ke Beranda"
        >
          <img
            src="/LOGO TONTI 400px.png"
            alt="Logo LBB Tonti"
            className="h-12 md:h-14 w-auto drop-shadow-lg filter brightness-110"
          />
        </a>

        <div className="hidden lg:flex items-center gap-4">
          <div
            id="nav-pill"
            className={`flex items-center gap-1 px-2 py-1.5 rounded-full backdrop-blur-md shadow-2xl transition-colors duration-300 ${
              isScrolled
                ? 'bg-slate-100 border border-slate-200'
                : 'bg-black/30 border border-white/10'
            }`}
          >
            {[
              { href: '#home', label: 'Beranda' },
              { href: '#about', label: 'Tentang' },
              { href: '#registration', label: 'Pendaftaran' },
              { href: '#rules', label: 'Juknis' },
              { href: '#downloads', label: 'Unduhan' },
              { href: '#contact', label: 'Kontak' },
            ].map(link => (
              <a
                key={link.href}
                href={link.href}
                className={`relative px-5 py-2 text-sm font-bold uppercase transition-colors group ${
                  isScrolled ? 'text-slate-700 hover:text-slate-950' : 'text-gray-200 hover:text-white'
                }`}
              >
                {link.label}
                <span className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-lbb-gold transition-all duration-300 group-hover:w-[60%] shadow-[0_0_8px_rgba(255,215,0,0.8)]"></span>
              </a>
            ))}
          </div>

          <a
            href="#registration"
            className="group relative px-6 py-2.5 bg-gradient-to-br from-lbb-gold to-yellow-600 text-lbb-red rounded-full font-black hover:shadow-[0_0_20px_rgba(255,215,0,0.5)] hover:-translate-y-0.5 active:scale-95 transition-all border border-yellow-400/50 overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/30 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            <span className="relative flex items-center gap-2 uppercase tracking-wide text-xs md:text-sm font-extrabold">
              Daftar <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </span>
          </a>
        </div>

        <button
          id="mobile-menu-btn"
          onClick={onOpenMobileMenu}
          className={`lg:hidden p-2.5 rounded-xl backdrop-blur-md border transition-all active:scale-95 ${
            isScrolled
              ? 'bg-slate-100 border-slate-200 text-slate-900 hover:bg-slate-200 hover:text-lbb-red'
              : 'bg-black/30 border-white/10 text-white hover:bg-black/50 hover:text-lbb-gold'
          }`}
          aria-label="Buka Menu"
        >
          <Menu className="w-7 h-7" />
        </button>
      </div>
    </nav>
  );
}
