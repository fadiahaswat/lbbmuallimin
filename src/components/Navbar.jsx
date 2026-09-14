import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowRight,
  Menu,
  LogIn,
  LogOut,
  ChevronDown,
  LayoutDashboard,
  Award
} from 'lucide-react';
import { NAVBAR } from '../config.js';
import { useCompetition } from '../context/CompetitionContext.jsx';
import logoImg from '../assets/logo-tonti.png';

export default function Navbar({ onOpenMobileMenu }) {
  const { openModal, currentUser, openAuthModal, logoutUser, setActiveView } = useCompetition();
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

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

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsUserDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function handleOpenUserPortal() {
    setIsUserDropdownOpen(false);
    if (!currentUser) return;
    if (currentUser.role === 'admin') setActiveView('admin');
    else if (currentUser.role === 'juri') setActiveView('juri');
    else if (currentUser.role === 'superadmin') setActiveView('superadmin');
    else setActiveView('peserta_dashboard');
  }

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
            src={logoImg}
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

          <button
            type="button"
            onClick={() => openModal('statusCheck')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
              isScrolled
                ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                : 'bg-black/30 hover:bg-black/50 text-slate-200 border border-white/15'
            }`}
          >
            Cek Status
          </button>

          {!currentUser ? (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => openAuthModal('login')}
                className={`px-4 py-1.5 rounded-full text-xs font-extrabold transition-all flex items-center gap-1.5 ${
                  isScrolled
                    ? 'bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-300'
                    : 'bg-white/15 hover:bg-white/25 text-white border border-white/25 backdrop-blur-md'
                }`}
              >
                <LogIn className="w-3.5 h-3.5 text-yellow-400" />
                <span>Masuk</span>
              </button>

              <button
                type="button"
                onClick={() => openAuthModal('register')}
                className="group relative px-5 py-2 bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 text-slate-950 rounded-full font-black hover:shadow-[0_0_20px_rgba(255,215,0,0.4)] hover:-translate-y-0.5 active:scale-95 transition-all border border-yellow-400/60 overflow-hidden shadow-md"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                <span className="relative flex items-center gap-1.5 uppercase tracking-wider text-xs font-black">
                  Daftar <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </span>
              </button>
            </div>
          ) : (
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                className={`flex items-center gap-2 pl-1.5 pr-3 py-1 rounded-full border transition-all ${
                  isScrolled
                    ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-900'
                    : 'bg-black/50 hover:bg-black/70 border-white/25 text-white backdrop-blur-md'
                }`}
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-7 h-7 rounded-full border border-yellow-400 object-cover"
                />
                <div className="text-left">
                  <div className="text-xs font-bold truncate max-w-[110px] leading-tight">
                    {currentUser.name.split(' ')[0]}
                  </div>
                  <div className="text-[10px] uppercase font-extrabold text-yellow-400 leading-tight">
                    {currentUser.role}
                  </div>
                </div>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isUserDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {isUserDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-slate-950/95 backdrop-blur-xl border border-slate-800 rounded-2xl p-2 shadow-2xl z-50 text-white text-xs animate-in fade-in zoom-in-95 duration-150 space-y-1">
                  <div className="px-3 py-2 border-b border-slate-800">
                    <p className="font-bold text-white truncate">{currentUser.name}</p>
                    <p className="text-[11px] text-slate-400 truncate">{currentUser.email}</p>
                    <span className="inline-block mt-1 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-yellow-400/20 text-yellow-400 border border-yellow-400/30">
                      {currentUser.roleLabel || currentUser.role}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={handleOpenUserPortal}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-white/10 text-left transition-colors font-bold text-white"
                  >
                    <LayoutDashboard className="w-4 h-4 text-yellow-400 shrink-0" />
                    <span>Buka Portal Dashboard</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsUserDropdownOpen(false);
                      setActiveView('announcement');
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-white/10 text-left transition-colors text-slate-200"
                  >
                    <Award className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Papan Pengumuman & Skor</span>
                  </button>

                  <div className="border-t border-slate-800 my-1"></div>

                  <button
                    type="button"
                    onClick={() => {
                      setIsUserDropdownOpen(false);
                      logoutUser();
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-red-500/20 text-left transition-colors text-red-400 hover:text-red-300 font-semibold"
                  >
                    <LogOut className="w-4 h-4 shrink-0" />
                    <span>Keluar (Logout)</span>
                  </button>
                </div>
              )}
            </div>
          )}
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
