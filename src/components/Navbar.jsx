import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowRight,
  Home,
  Menu,
  LogIn,
  LogOut,
  ChevronDown,
  LayoutDashboard,
  Award,
  Trophy,
  ClipboardList,
  CalendarCheck,
  Clock,
  FileSpreadsheet,
  Compass,
  CheckCircle2,
} from 'lucide-react';
import { NAVBAR } from '../config.js';
import { useCompetition } from '../context/CompetitionContext.jsx';
import logoLbb from '../assets/logo-tonti.png';
import titleLogo from '../assets/title-logo.png';

const NAV_LINKS = [
  { href: '#home', id: 'home', label: 'Beranda' },
  { href: '#about', id: 'about', label: 'Informasi' },
  { href: '#registration', id: 'registration', label: 'Pendaftaran' },
  { href: '#rules', id: 'rules', label: 'Juknis' },
  { href: '#prizes', id: 'prizes', label: 'Kejuaraan' },
  { href: '#contact', id: 'contact', label: 'Kontak' },
];

export default function Navbar({ onOpenMobileMenu }) {
  const { currentUser, openAuthModal, logoutUser, setActiveView, getUserAvatar } = useCompetition();
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const avatarMeta = currentUser && getUserAvatar ? getUserAvatar(currentUser) : null;
  const avatarUrl = avatarMeta?.url || currentUser?.avatar;
  const isSchoolLogo = avatarMeta?.isSchoolLogo;

  useEffect(() => {
    const sectionMap = [
      { id: 'contact', menu: 'contact' },
      { id: 'denah', menu: 'contact' },
      { id: 'prizes', menu: 'prizes' },
      { id: 'tata-tertib', menu: 'rules' },
      { id: 'scoring', menu: 'rules' },
      { id: 'materi-lomba', menu: 'rules' },
      { id: 'rules', menu: 'rules' },
      { id: 'registration', menu: 'registration' },
      { id: 'time-location', menu: 'about' },
      { id: 'about', menu: 'about' },
      { id: 'home', menu: 'home' },
    ];
    let ticking = false;

    function checkActiveSection() {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > NAVBAR.SCROLL_SOLID_THRESHOLD);

      if (window.innerHeight + scrollY >= document.documentElement.scrollHeight - 60) {
        setActiveSection('contact');
        return;
      }

      const scrollPosition = scrollY + 220;
      for (const item of sectionMap) {
        const el = document.getElementById(item.id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(item.menu);
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

  const showBrand = !(activeSection === 'home' && !isScrolled);

  return (
    <nav
      id="navbar"
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/90 backdrop-blur-xl border-b border-slate-200/80 shadow-[0_4px_24px_-8px_rgba(15,23,42,0.12)] py-2.5'
          : 'bg-transparent border-b border-transparent py-4'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl flex items-center justify-between gap-4">
        {/* Left: Brand Lockup (Reveals smoothly on scroll) */}
        <a
          href="#home"
          className={`group flex items-center gap-2 sm:gap-2.5 focus:outline-none transition-all duration-300 shrink-0 ${
            showBrand
              ? 'opacity-100 translate-x-0 pointer-events-auto visible'
              : 'opacity-0 -translate-x-3 pointer-events-none invisible'
          }`}
          aria-label="Kembali ke Beranda"
        >
          <img
            src={logoLbb}
            alt="Logo LBB Mu'allimin"
            className="h-9 sm:h-10 w-auto shrink-0 transition-transform duration-200 group-hover:scale-105"
            width="44"
            height="44"
            decoding="async"
          />
          <img
            src={titleLogo}
            alt="LBB Mu'allimin 2027"
            className="h-6 sm:h-7 w-auto object-contain select-none"
            decoding="async"
          />
        </a>

        {/* Desktop: Unified Floating Glass Navigation Dock */}
        <div
          id="nav-pill"
          className={`hidden lg:flex items-center p-1.5 rounded-full transition-all duration-300 ${
            isScrolled
              ? 'bg-slate-100/90 border border-slate-200/90'
              : 'bg-black/25 backdrop-blur-md border border-white/10 shadow-[0_8px_28px_rgba(0,0,0,0.28)]'
          }`}
        >
          {/* Navigation Links */}
          <div className="flex items-center gap-0.5">
            {NAV_LINKS.map(link => {
              const isActive = activeSection === link.id;
              return (
                <a
                  key={link.href}
                  href={link.href}
                  className={`relative px-3.5 xl:px-4 py-1.5 rounded-full text-[13px] font-semibold tracking-tight transition-all duration-200 whitespace-nowrap ${
                    isActive
                      ? isScrolled
                        ? 'bg-slate-900 text-white shadow-sm'
                        : 'bg-white/15 text-white'
                      : isScrolled
                        ? 'text-slate-600 hover:text-slate-950 hover:bg-slate-200/60'
                        : 'text-white/75 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <span className="inline-flex items-center gap-1.5">
                    {isActive && (
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          isScrolled ? 'bg-amber-400' : 'bg-amber-400'
                        }`}
                      />
                    )}
                    <span>{link.label}</span>
                  </span>
                </a>
              );
            })}
          </div>

          {/* Subtle Divider */}
          <div
            className={`h-5 w-px mx-2 shrink-0 ${
              isScrolled ? 'bg-slate-300/80' : 'bg-white/15'
            }`}
          />

          {/* Auth CTA or Logged-in Profile Dropdown */}
          {!currentUser ? (
            <button
              type="button"
              onClick={() => openAuthModal('login')}
              className={`group px-4 py-1.5 rounded-full font-bold text-xs tracking-wide transition-all flex items-center gap-2 cursor-pointer active:scale-95 shrink-0 ${
                isScrolled
                  ? 'bg-red-700 hover:bg-red-800 text-white shadow-sm'
                  : 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-sm'
              }`}
            >
              <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fill="currentColor"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                />
                <path
                  fill="currentColor"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                />
                <path
                  fill="currentColor"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                />
                <path
                  fill="currentColor"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
              <span>Masuk / Daftar</span>
            </button>
          ) : (
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                className={`group flex items-center gap-2 pl-1 pr-3 py-1 rounded-full transition-all duration-200 select-none cursor-pointer ${
                  isScrolled
                    ? 'bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 shadow-xs'
                    : 'bg-white/[0.08] hover:bg-white/[0.14] border border-white/10 text-white'
                }`}
              >
                <img
                  src={avatarUrl}
                  alt={currentUser.name}
                  className={
                    isSchoolLogo
                      ? 'w-7 h-7 object-contain drop-shadow-sm shrink-0'
                      : 'w-7 h-7 rounded-full object-cover ring-1 ring-amber-400/50 shrink-0'
                  }
                  width="28"
                  height="28"
                  loading="lazy"
                  decoding="async"
                  onError={e => {
                    if (currentUser.googleAvatar) {
                      e.target.src = currentUser.googleAvatar;
                    } else {
                      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        currentUser.name
                      )}&background=8B0000&color=fff`;
                    }
                  }}
                />
                <span
                  className="text-xs font-bold truncate max-w-[120px] leading-none"
                  title={
                    currentUser.role === 'peserta'
                      ? currentUser.schoolName || currentUser.name
                      : currentUser.name
                  }
                >
                  {currentUser.role === 'peserta'
                    ? currentUser.schoolName || currentUser.name
                    : currentUser.name
                      ? currentUser.name.split(' ')[0]
                      : 'Staff'}
                </span>
                <ChevronDown
                  className={`w-3.5 h-3.5 opacity-60 transition-transform duration-200 shrink-0 ${
                    isUserDropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {isUserDropdownOpen && (
                <div className="absolute right-0 mt-3 w-72 max-h-[85vh] overflow-y-auto bg-slate-950/95 backdrop-blur-2xl border border-slate-800 rounded-2xl p-2.5 shadow-2xl z-50 text-white text-xs space-y-1.5 ring-1 ring-white/10">
                  {/* Profile Header */}
                  <div className="px-3 py-2.5 bg-slate-900/90 border border-slate-800 rounded-xl flex items-center gap-3">
                    <img
                      src={avatarUrl}
                      alt={currentUser.name}
                      className={
                        isSchoolLogo
                          ? 'w-10 h-10 object-contain shrink-0'
                          : 'w-10 h-10 rounded-xl object-cover ring-2 ring-amber-400/40 shrink-0'
                      }
                      onError={e => {
                        e.target.src =
                          currentUser.googleAvatar ||
                          `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            currentUser.schoolName || currentUser.name
                          )}&background=8B0000&color=fff`;
                      }}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="font-black text-sm text-white truncate leading-tight">
                        {currentUser.role === 'peserta'
                          ? currentUser.schoolName || currentUser.name
                          : currentUser.name}
                      </p>
                      {currentUser.role === 'peserta' &&
                        currentUser.name &&
                        currentUser.name !== currentUser.schoolName && (
                          <p className="text-[10px] text-slate-400 truncate">
                            Official: {currentUser.name}
                          </p>
                        )}
                      <p className="text-[11px] text-slate-400 truncate mt-0.5">
                        {currentUser.email}
                      </p>
                    </div>
                  </div>

                  {/* Role-Partitioned Actions */}
                  <div className="space-y-0.5 pt-1">
                    {currentUser.role === 'peserta' && (
                      <button
                        type="button"
                        onClick={() => {
                          setIsUserDropdownOpen(false);
                          setActiveView('peserta_dashboard');
                        }}
                        className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-white/10 text-left transition-colors font-bold text-white cursor-pointer group"
                      >
                        <div className="flex items-center gap-2.5">
                          <LayoutDashboard className="w-4 h-4 text-amber-400 shrink-0" />
                          <span>Portal Kontingen Peleton</span>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-amber-400 transition-colors" />
                      </button>
                    )}

                    {currentUser.role === 'admin' && (
                      <>
                        <button
                          type="button"
                          onClick={() => {
                            setIsUserDropdownOpen(false);
                            setActiveView('admin');
                          }}
                          className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-blue-500/15 text-left transition-colors font-bold text-white cursor-pointer group"
                        >
                          <div className="flex items-center gap-2.5">
                            <ClipboardList className="w-4 h-4 text-blue-400 shrink-0" />
                            <span>Verifikasi Berkas &amp; Pendaftaran</span>
                          </div>
                          <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-blue-400 transition-colors" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setIsUserDropdownOpen(false);
                            setActiveView('tm');
                          }}
                          className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-amber-500/15 text-left transition-colors font-bold text-slate-200 hover:text-white cursor-pointer group"
                        >
                          <div className="flex items-center gap-2.5">
                            <CalendarCheck className="w-4 h-4 text-amber-400 shrink-0" />
                            <span>Undian TM &amp; Jadwal Tampil</span>
                          </div>
                          <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-amber-400 transition-colors" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setIsUserDropdownOpen(false);
                            setActiveView('field_trial');
                          }}
                          className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-emerald-500/15 text-left transition-colors font-bold text-slate-200 hover:text-white cursor-pointer group"
                        >
                          <div className="flex items-center gap-2.5">
                            <Compass className="w-4 h-4 text-emerald-400 shrink-0" />
                            <span>Jadwal Uji Coba Lapangan</span>
                          </div>
                          <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400 transition-colors" />
                        </button>
                      </>
                    )}

                    {currentUser.role === 'checkin' && (
                      <>
                        <button
                          type="button"
                          onClick={() => {
                            setIsUserDropdownOpen(false);
                            setActiveView('checkin');
                          }}
                          className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-cyan-500/15 text-left transition-colors font-bold text-white cursor-pointer group"
                        >
                          <div className="flex items-center gap-2.5">
                            <LogIn className="w-4 h-4 text-cyan-400 shrink-0" />
                            <span>Meja Registrasi Check-In Hari-H</span>
                          </div>
                          <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 transition-colors" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setIsUserDropdownOpen(false);
                            setActiveView('checkout');
                          }}
                          className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-teal-500/15 text-left transition-colors font-bold text-slate-200 hover:text-white cursor-pointer group"
                        >
                          <div className="flex items-center gap-2.5">
                            <LogOut className="w-4 h-4 text-teal-400 shrink-0" />
                            <span>Inspeksi Barak &amp; Check-Out</span>
                          </div>
                          <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-teal-400 transition-colors" />
                        </button>
                      </>
                    )}

                    {(currentUser.role === 'dp' || currentUser.role === 'staging') && (
                      <button
                        type="button"
                        onClick={() => {
                          setIsUserDropdownOpen(false);
                          setActiveView('dp');
                        }}
                        className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-orange-500/15 text-left transition-colors font-bold text-white cursor-pointer group"
                      >
                        <div className="flex items-center gap-2.5">
                          <Clock className="w-4 h-4 text-orange-400 shrink-0" />
                          <span>Panel Daerah Persiapan (DP 1-2)</span>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-orange-400 transition-colors" />
                      </button>
                    )}

                    {currentUser.role === 'juri' && (
                      <button
                        type="button"
                        onClick={() => {
                          setIsUserDropdownOpen(false);
                          setActiveView('juri');
                        }}
                        className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-emerald-500/15 text-left transition-colors font-bold text-white cursor-pointer group"
                      >
                        <div className="flex items-center gap-2.5">
                          <Award className="w-4 h-4 text-emerald-400 shrink-0" />
                          <span>Lembar E-Scoring Juri LBB</span>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400 transition-colors" />
                      </button>
                    )}

                    {currentUser.role === 'penginput' && (
                      <>
                        <button
                          type="button"
                          onClick={() => {
                            setIsUserDropdownOpen(false);
                            setActiveView('juri');
                          }}
                          className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-indigo-500/15 text-left transition-colors font-bold text-white cursor-pointer group"
                        >
                          <div className="flex items-center gap-2.5">
                            <Award className="w-4 h-4 text-indigo-400 shrink-0" />
                            <span>Input Nilai Fisik &amp; Foto Blangko</span>
                          </div>
                          <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-indigo-400 transition-colors" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setIsUserDropdownOpen(false);
                            setActiveView('rekap_nilai');
                          }}
                          className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-indigo-500/15 text-left transition-colors font-bold text-slate-200 hover:text-white cursor-pointer group"
                        >
                          <div className="flex items-center gap-2.5">
                            <FileSpreadsheet className="w-4 h-4 text-indigo-400 shrink-0" />
                            <span>Monitoring Status Draft Nilai</span>
                          </div>
                          <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-indigo-400 transition-colors" />
                        </button>
                      </>
                    )}

                    {currentUser.role === 'verifikator' && (
                      <button
                        type="button"
                        onClick={() => {
                          setIsUserDropdownOpen(false);
                          setActiveView('rekap_nilai');
                        }}
                        className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-teal-500/15 text-left transition-colors font-bold text-white cursor-pointer group"
                      >
                        <div className="flex items-center gap-2.5">
                          <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                          <span>Panel Verifikasi &amp; Validasi Blangko</span>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-teal-400 transition-colors" />
                      </button>
                    )}

                    {currentUser.role === 'finalisator' && (
                      <button
                        type="button"
                        onClick={() => {
                          setIsUserDropdownOpen(false);
                          setActiveView('rekap_nilai');
                        }}
                        className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-amber-500/15 text-left transition-colors font-bold text-white cursor-pointer group"
                      >
                        <div className="flex items-center gap-2.5">
                          <Trophy className="w-4 h-4 text-amber-400 shrink-0" />
                          <span>Penguncian Skor &amp; Berita Acara</span>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-amber-400 transition-colors" />
                      </button>
                    )}

                    {currentUser.role === 'superadmin' && (
                      <button
                        type="button"
                        onClick={() => {
                          setIsUserDropdownOpen(false);
                          setActiveView('staff_home');
                        }}
                        className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/25 text-left transition-colors text-rose-200 hover:text-white cursor-pointer font-bold group"
                      >
                        <div className="flex items-center gap-2.5">
                          <Home className="w-4 h-4 text-rose-400 shrink-0" />
                          <span>Beranda Panitia</span>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-rose-400 group-hover:translate-x-0.5 transition-transform" />
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        setIsUserDropdownOpen(false);
                        setActiveView('live_leaderboard');
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-white/[0.06] text-left transition-colors text-slate-300 hover:text-white font-medium cursor-pointer"
                    >
                      <Trophy className="w-4 h-4 text-slate-400 shrink-0" />
                      <span>Papan Klasemen</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setIsUserDropdownOpen(false);
                        setActiveView('rundown');
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-white/[0.06] text-left transition-colors text-slate-300 hover:text-white font-medium cursor-pointer"
                    >
                      <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                      <span>Rundown Kegiatan</span>
                    </button>
                  </div>

                  <div className="border-t border-slate-800/80 my-1" />

                  <button
                    type="button"
                    onClick={() => {
                      setIsUserDropdownOpen(false);
                      logoutUser();
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-red-500/15 text-left transition-colors text-red-400 hover:text-red-300 font-semibold cursor-pointer"
                  >
                    <LogOut className="w-4 h-4 shrink-0" />
                    <span>Keluar</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile Right Actions: Quick Auth + Clean Menu Button */}
        <div className="flex lg:hidden items-center gap-2">
          {!currentUser && (
            <button
              type="button"
              onClick={() => openAuthModal('login')}
              className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all active:scale-95 cursor-pointer ${
                isScrolled
                  ? 'bg-red-700 text-white shadow-xs'
                  : 'bg-amber-400 text-slate-950 shadow-sm'
              }`}
            >
              Masuk
            </button>
          )}

          <button
            id="mobile-menu-btn"
            type="button"
            onClick={onOpenMobileMenu}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all active:scale-90 cursor-pointer border ${
              isScrolled
                ? 'bg-slate-100 border-slate-200 text-slate-900 hover:bg-slate-200'
                : 'bg-white/10 border-white/15 backdrop-blur-md text-white hover:bg-white/15'
            }`}
            aria-label="Buka Menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>
    </nav>
  );
}
