import React, { useState, useEffect } from 'react';
import { ArrowRight, Menu } from 'lucide-react';
import { NAVBAR } from '../config.js';

export default function Navbar({ onOpenMobileMenu }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const sections = ['home', 'about', 'registration', 'rules', 'prizes', 'downloads', 'contact'];

    function handleScroll() {
      setIsScrolled(window.scrollY > NAVBAR.SCROLL_SOLID_THRESHOLD);

      // Jika user sudah sampai dekat dasar halaman, aktifkan kontak
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 60) {
        setActiveSection('contact');
        return;
      }

      const scrollPosition = window.scrollY + 200;
      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const rect = el.getBoundingClientRect();
          const top = rect.top + window.scrollY;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      id="navbar"
      className={`fixed top-0 w-full z-50 transition-all duration-300 border-b ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-md py-2.5 border-slate-200/60'
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
            className="h-11 md:h-13 w-auto drop-shadow-md filter brightness-105"
          />
        </a>

        <div className="hidden lg:flex items-center gap-3 xl:gap-4">
          <div
            id="nav-pill"
            className={`flex items-center gap-0.5 px-2 py-1.5 rounded-full backdrop-blur-md shadow-xl transition-colors duration-300 ${
              isScrolled
                ? 'bg-slate-100/90 border border-slate-200'
                : 'bg-black/35 border border-white/15'
            }`}
          >
            {[
              { href: '#home', label: 'Beranda' },
              { href: '#about', label: 'Tentang' },
              { href: '#registration', label: 'Pendaftaran' },
              { href: '#rules', label: 'Juknis' },
              { href: '#prizes', label: 'Hadiah' },
              { href: '#downloads', label: 'Unduhan' },
              { href: '#contact', label: 'Kontak' },
            ].map(link => {
              const targetId = link.href.replace('#', '');
              const isActive = activeSection === targetId;

              return (
                <a
                  key={link.href}
                  href={link.href}
                  className={`relative px-3.5 xl:px-4 py-1.5 text-xs xl:text-sm font-bold uppercase transition-all duration-200 group ${
                    isActive
                      ? (isScrolled ? 'text-red-700 font-extrabold' : 'text-yellow-300 font-extrabold')
                      : (isScrolled ? 'text-slate-600 hover:text-slate-950' : 'text-slate-200 hover:text-white')
                  }`}
                >
                  {link.label}
                  <span
                    className={`absolute bottom-0.5 left-1/2 -translate-x-1/2 h-0.5 bg-yellow-400 transition-all duration-300 shadow-[0_0_8px_rgba(255,215,0,0.8)] ${
                      isActive ? 'w-[70%]' : 'w-0 group-hover:w-[50%]'
                    }`}
                  ></span>
                </a>
              );
            })}
          </div>

          <a
            href="#registration"
            className="group relative px-5 xl:px-6 py-2 bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 text-slate-950 rounded-full font-black hover:shadow-[0_0_20px_rgba(255,215,0,0.4)] hover:-translate-y-0.5 active:scale-95 transition-all border border-yellow-400/60 overflow-hidden shadow-md"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            <span className="relative flex items-center gap-1.5 uppercase tracking-wider text-xs md:text-xs xl:text-sm font-black">
              Daftar <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
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
