import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowRight,
  Menu,
  LogIn,
  LogOut,
  ChevronDown,
  LayoutDashboard,
  Award,
  Trophy,
  Heart,
  ShieldCheck
} from 'lucide-react';
import { NAVBAR } from '../config.js';
import { useCompetition } from '../context/CompetitionContext.jsx';
import logoLbb from '../assets/logo-tonti.png';

export default function Navbar({ onOpenMobileMenu }) {
  const { openModal, currentUser, openAuthModal, logoutUser, setActiveView, getUserAvatar } = useCompetition();
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const avatarMeta = currentUser && getUserAvatar ? getUserAvatar(currentUser) : null;
  const avatarUrl = avatarMeta?.url || currentUser?.avatar;
  const isSchoolLogo = avatarMeta?.isSchoolLogo;

  useEffect(() => {
    const sections = ['home', 'about', 'registration', 'rules', 'prizes', 'downloads', 'contact'];
    let ticking = false;

    function checkActiveSection() {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > NAVBAR.SCROLL_SOLID_THRESHOLD);

      // Jika user sudah sampai dekat dasar halaman, aktifkan kontak
      if (window.innerHeight + scrollY >= document.documentElement.scrollHeight - 60) {
        setActiveSection('contact');
        return;
      }

      const scrollPosition = scrollY + 200;
      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    }

    function handleScroll() {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          checkActiveSection();
          ticking = false;
        });
        ticking = true;
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    checkActiveSection();
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
    else if (['penginput', 'verifikator', 'finalisator', 'juri'].includes(currentUser.role)) setActiveView('juri');
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
          className={`group flex items-center gap-3 focus:outline-none transition-all duration-300 ${
            activeSection === 'home' && !isScrolled
              ? 'opacity-0 -translate-x-4 pointer-events-none'
              : 'opacity-100 translate-x-0 pointer-events-auto hover:scale-105'
          }`}
          aria-label="Kembali ke Beranda"
        >
          <img
            src={logoLbb}
            alt="Logo LBB Mu'allimin"
            className="h-11 md:h-13 w-auto drop-shadow-md filter brightness-105"
            width="52"
            height="52"
            decoding="async"
          />
        </a>

        <div className="hidden lg:flex items-center gap-3 xl:gap-4">
          <div
            id="nav-pill"
            className={`flex items-center gap-0.5 px-2 py-1.5 rounded-full backdrop-blur-md shadow-xl transition-colors duration-300 ${
              isScrolled
                ? 'bg-slate-100/90 border border-slate-200'
                : 'glass'
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

          {!currentUser ? (
            <button
              type="button"
              onClick={() => openAuthModal('login')}
              className="group relative px-5 py-2 bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 text-slate-950 rounded-full font-black hover:shadow-[0_0_20px_rgba(255,215,0,0.4)] hover:-translate-y-0.5 active:scale-95 transition-all border border-yellow-400/60 overflow-hidden shadow-md flex items-center gap-2"
            >
              <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#020617"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                />
                <path
                  fill="#020617"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                />
                <path
                  fill="#020617"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                />
                <path
                  fill="#020617"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
              <span className="uppercase tracking-wider text-xs font-black">
                Daftar/Masuk
              </span>
            </button>
          ) : (
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                className={`flex items-center gap-2 pl-1.5 pr-3 py-1 rounded-full border transition-all ${
                  isScrolled
                    ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-900'
                    : 'glass hover:bg-white/12 text-white'
                }`}
              >
                <img
                  src={avatarUrl}
                  alt={currentUser.name}
                  className={`w-7 h-7 rounded-full ${
                    isSchoolLogo ? 'object-contain bg-white p-0.5' : 'object-cover'
                  }`}
                  width="28"
                  height="28"
                  loading="lazy"
                  decoding="async"
                  onError={(e) => {
                    if (currentUser.googleAvatar) {
                      e.target.src = currentUser.googleAvatar;
                    } else {
                      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.name)}&background=8B0000&color=fff`;
                    }
                  }}
                />
                <div className="text-left">
                  <div className="text-xs font-bold truncate max-w-[130px] leading-tight" title={currentUser.role === 'peserta' ? (currentUser.schoolName || currentUser.name) : currentUser.name}>
                    {currentUser.role === 'peserta'
                      ? (currentUser.schoolName || currentUser.name)
                      : (currentUser.name ? currentUser.name.split(' ')[0] : 'Staff')}
                  </div>
                  <div className="text-[10px] uppercase font-extrabold text-yellow-400 leading-tight">
                    {currentUser.role}
                  </div>
                </div>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isUserDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {isUserDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-slate-950/95 backdrop-blur-xl border border-slate-800 rounded-2xl p-2 shadow-2xl z-50 text-white text-xs animate-in fade-in zoom-in-95 duration-150 space-y-1">
                  <div className="px-3 py-2 border-b border-slate-800 flex items-center gap-2.5">
                    <img
                      src={avatarUrl}
                      alt={currentUser.name}
                      className={`w-9 h-9 rounded-full ${
                        isSchoolLogo ? 'object-contain bg-white p-0.5' : 'object-cover'
                      }`}
                      onError={(e) => {
                        e.target.src = currentUser.googleAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.schoolName || currentUser.name)}&background=8B0000&color=fff`;
                      }}
                    />
                    <div className="min-w-0">
                      <p className="font-bold text-white truncate">
                        {currentUser.role === 'peserta' ? (currentUser.schoolName || currentUser.name) : currentUser.name}
                      </p>
                      {currentUser.role === 'peserta' && currentUser.name && currentUser.name !== currentUser.schoolName && (
                        <p className="text-[10px] text-slate-400 truncate">Official: {currentUser.name}</p>
                      )}
                      <p className="text-[11px] text-slate-400 truncate">{currentUser.email}</p>
                      <span className="inline-block mt-0.5 text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-yellow-400/20 text-yellow-400 border border-yellow-400/30">
                        {currentUser.roleLabel || currentUser.role}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleOpenUserPortal}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-white/10 text-left transition-colors font-bold text-white"
                  >
                    <LayoutDashboard className="w-4 h-4 text-yellow-400 shrink-0" />
                    <span>Buka Portal Dashboard</span>
                  </button>

                  {currentUser.role !== 'peserta' && (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          setIsUserDropdownOpen(false);
                          setActiveView('staging');
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-white/10 text-left transition-colors text-slate-200 cursor-pointer"
                      >
                        <ShieldCheck className="w-4 h-4 text-indigo-400 shrink-0" />
                        <span>Operator Lapangan & Staging</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setIsUserDropdownOpen(false);
                          setActiveView('juri');
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-white/10 text-left transition-colors text-slate-200 cursor-pointer"
                      >
                        <Award className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>E-Scoring Juri LBB</span>
                      </button>

                      {currentUser.role === 'superadmin' && (
                        <button
                          type="button"
                          onClick={() => {
                            setIsUserDropdownOpen(false);
                            setActiveView('superadmin');
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-rose-500/20 text-left transition-colors text-rose-300 cursor-pointer font-bold"
                        >
                          <Crown className="w-4 h-4 text-rose-400 shrink-0" />
                          <span>Superadmin Master Panel</span>
                        </button>
                      )}
                    </>
                  )}

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
              : 'glass text-white hover:bg-white/12 hover:text-lbb-gold'
          }`}
          aria-label="Buka Menu"
        >
          <Menu className="w-7 h-7" />
        </button>

      </div>
    </nav>
  );
}
