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
  ShieldCheck,
  Crown,
  ClipboardList,
  CalendarCheck,
  Clock,
  FileSpreadsheet,
  Compass,
  CheckCircle2,
  ExternalLink,
  User
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
    const sections = ['home', 'about', 'time-location', 'registration', 'rules', 'prizes', 'downloads', 'contact'];
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
              { href: '#time-location', label: 'Waktu & Tempat' },
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
                className={`group flex items-center gap-2.5 pl-1.5 pr-3.5 py-1.5 rounded-full border transition-all duration-200 select-none cursor-pointer ${
                  isScrolled
                    ? 'bg-white/90 hover:bg-slate-50 border-slate-200/90 shadow-xs hover:border-slate-300 text-slate-800'
                    : 'bg-slate-950/60 hover:bg-slate-900/80 backdrop-blur-md border-white/15 hover:border-white/25 text-white shadow-md'
                }`}
              >
                {/* Avatar with subtle online status indicator */}
                <div className="relative shrink-0">
                  <img
                    src={avatarUrl}
                    alt={currentUser.name}
                    className={`w-8 h-8 rounded-full ${
                      isSchoolLogo 
                        ? 'object-contain bg-white p-0.5 border border-slate-200/80' 
                        : 'object-cover ring-1.5 ring-amber-400/40'
                    }`}
                    width="32"
                    height="32"
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
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-slate-900" title="Online" />
                </div>

                {/* Name & Role Badge */}
                <div className="text-left flex flex-col justify-center min-w-0">
                  <div 
                    className="text-xs font-bold truncate max-w-[130px] leading-snug group-hover:text-amber-400 transition-colors" 
                    title={currentUser.role === 'peserta' ? (currentUser.schoolName || currentUser.name) : currentUser.name}
                  >
                    {currentUser.role === 'peserta'
                      ? (currentUser.schoolName || currentUser.name)
                      : (currentUser.name ? currentUser.name.split(' ')[0] : 'Staff')}
                  </div>
                  <div className="flex items-center gap-1">
                    <span className={`text-[9px] font-black uppercase tracking-wider leading-none ${
                      isScrolled ? 'text-amber-600' : 'text-amber-400'
                    }`}>
                      {currentUser.role}
                    </span>
                  </div>
                </div>

                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 group-hover:text-white transition-transform duration-200 ml-0.5 shrink-0 ${isUserDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {isUserDropdownOpen && (
                <div className="absolute right-0 mt-2.5 w-72 bg-slate-950/95 backdrop-blur-2xl border border-slate-800/80 rounded-2xl p-2.5 shadow-2xl z-50 text-white text-xs animate-in fade-in zoom-in-95 duration-150 space-y-1.5 ring-1 ring-white/10">
                  {/* User Profile Header Card */}
                  <div className="px-3 py-2.5 bg-slate-900/80 border border-slate-800 rounded-xl flex items-center gap-3">
                    <div className="relative shrink-0">
                      <img
                        src={avatarUrl}
                        alt={currentUser.name}
                        className={`w-11 h-11 rounded-xl shadow-md ${
                          isSchoolLogo ? 'object-contain bg-white p-1' : 'object-cover ring-2 ring-yellow-400/40'
                        }`}
                        onError={(e) => {
                          e.target.src = currentUser.googleAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.schoolName || currentUser.name)}&background=8B0000&color=fff`;
                        }}
                      />
                      <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-slate-950" title="Online" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-black text-sm text-white truncate leading-tight">
                        {currentUser.role === 'peserta' ? (currentUser.schoolName || currentUser.name) : currentUser.name}
                      </p>
                      {currentUser.role === 'peserta' && currentUser.name && currentUser.name !== currentUser.schoolName && (
                        <p className="text-[10px] text-slate-400 truncate">Official: {currentUser.name}</p>
                      )}
                      <p className="text-[11px] text-slate-400 truncate mt-0.5">{currentUser.email}</p>
                    </div>
                  </div>

                  {/* Navigation Actions strictly partitioned by Role Authorization */}
                  <div className="space-y-0.5 pt-1">
                    {/* 1. PESERTA */}
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
                          <LayoutDashboard className="w-4 h-4 text-yellow-400 shrink-0" />
                          <span>Portal Kontingen Peleton</span>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-yellow-400 transition-colors" />
                      </button>
                    )}

                    {/* 2. ADMIN (SEKRETARIAT & PENDAFTARAN) */}
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
                            <span>Verifikasi Berkas & Pendaftaran</span>
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
                            <span>Kocok Undian TM & No. Dada</span>
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

                    {/* 3. CHECK-IN / BASECAMP OFFICER */}
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
                            <span>Inspeksi Barak & Check-Out</span>
                          </div>
                          <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-teal-400 transition-colors" />
                        </button>
                      </>
                    )}

                    {/* 4. DAERAH PERSIAPAN (DP 1-3) OFFICER */}
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
                          <span>Panel Daerah Persiapan (DP 1-3)</span>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-orange-400 transition-colors" />
                      </button>
                    )}

                    {/* 5. DEWAN JURI LAPANGAN */}
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

                    {/* 6. OPERATOR PENGINPUT NILAI */}
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
                            <span>Input Nilai Fisik & Foto Blangko</span>
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

                    {/* 7. VERIFIKATOR NILAI */}
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
                          <span>Panel Verifikasi & Validasi Blangko</span>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-teal-400 transition-colors" />
                      </button>
                    )}

                    {/* 8. FINALISATOR (KETUA DEWAN JURI) */}
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
                          <span>Penguncian Skor & Berita Acara</span>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-amber-400 transition-colors" />
                      </button>
                    )}

                    {/* 9. SUPERADMIN (KETUA PELAKSANA / IT MASTER) */}
                    {currentUser.role === 'superadmin' && (
                      <>
                        <button
                          type="button"
                          onClick={() => {
                            setIsUserDropdownOpen(false);
                            setActiveView('superadmin');
                          }}
                          className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-rose-500/20 text-left transition-colors text-rose-300 hover:text-rose-200 cursor-pointer font-black group"
                        >
                          <div className="flex items-center gap-2.5">
                            <Crown className="w-4 h-4 text-rose-400 shrink-0" />
                            <span>Superadmin Master Authority</span>
                          </div>
                          <ArrowRight className="w-3.5 h-3.5 text-rose-400 group-hover:translate-x-0.5 transition-transform" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setIsUserDropdownOpen(false);
                            setActiveView('admin');
                          }}
                          className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-white/10 text-left transition-colors font-bold text-slate-200 hover:text-white cursor-pointer group"
                        >
                          <div className="flex items-center gap-2.5">
                            <LayoutDashboard className="w-4 h-4 text-yellow-400 shrink-0" />
                            <span>Dashboard Administrasi</span>
                          </div>
                          <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-yellow-400 transition-colors" />
                        </button>
                      </>
                    )}

                    {/* Shared Link: Live Leaderboard (terbuka untuk staf atau saat pengumuman dipublikasikan) */}
                    <button
                      type="button"
                      onClick={() => {
                        setIsUserDropdownOpen(false);
                        setActiveView('live_leaderboard');
                      }}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-white/10 text-left transition-colors text-slate-300 hover:text-white cursor-pointer group"
                    >
                      <div className="flex items-center gap-2.5">
                        <Trophy className="w-4 h-4 text-amber-400 shrink-0" />
                        <span>Lihat Papan Klasemen</span>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-amber-400 transition-colors" />
                    </button>
                  </div>

                  <div className="border-t border-slate-800/80 my-1"></div>

                  {/* Logout Button */}
                  <button
                    type="button"
                    onClick={() => {
                      setIsUserDropdownOpen(false);
                      logoutUser();
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-red-500/20 text-left transition-colors text-red-400 hover:text-red-300 font-bold cursor-pointer group"
                  >
                    <div className="flex items-center gap-2.5">
                      <LogOut className="w-4 h-4 shrink-0" />
                      <span>Keluar (Logout)</span>
                    </div>
                    <span className="text-[10px] text-red-400/60 group-hover:text-red-300">Akun Google</span>
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
