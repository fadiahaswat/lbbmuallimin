import React, { useEffect, useState } from 'react';
import {
  Home,
  Info,
  CalendarDays,
  ClipboardList,
  BookOpen,
  Trophy,
  Phone,
  ChevronRight,
  ArrowRight,
  Instagram,
  Video,
  X,
  LogIn,
  Building2,
  LogOut,
  LayoutDashboard,
  Heart,
  ShieldCheck,
  CalendarCheck,
  Compass,
  Clock,
  Award,
  FileSpreadsheet,
  CheckCircle2,
  Crown,
  Sparkles
} from 'lucide-react';
import { SOCIAL } from '../config.js';
import { useCompetition } from '../context/CompetitionContext.jsx';
import logoLbb from '../assets/logo-tonti.png';
import titleLogo from '../assets/title-logo.png';

export default function MobileMenu({ isOpen, onClose }) {
  const {
    openModal,
    setActiveView,
    currentUser,
    openAuthModal,
    logoutUser,
    getUserAvatar
  } = useCompetition();

  const [activeSection, setActiveSection] = useState('home');

  const avatarMeta = currentUser && getUserAvatar ? getUserAvatar(currentUser) : null;
  const avatarUrl = avatarMeta?.url || currentUser?.avatar;
  const isSchoolLogo = avatarMeta?.isSchoolLogo;

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    }

    if (isOpen) {
      document.body.classList.add('overflow-hidden');
      window.addEventListener('keydown', handleKeyDown);

      // Detect current section on open (6 grup menu utama)
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
      const scrollPos = window.scrollY + 220;
      for (const item of sectionMap) {
        const el = document.getElementById(item.id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(item.menu);
            break;
          }
        }
      }
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
    { href: '#home', id: 'home', label: 'Beranda', icon: Home, desc: 'Halaman utama kompetisi' },
    { href: '#about', id: 'about', label: 'Informasi', icon: Info, desc: 'Sejarah, tema, jadwal & venue' },
    { href: '#registration', id: 'registration', label: 'Pendaftaran', icon: ClipboardList, desc: 'Alur pendaftaran digital & kuota' },
    { href: '#rules', id: 'rules', label: 'Petunjuk Teknis', icon: BookOpen, desc: 'Juknis lapangan, materi & penilaian' },
    { href: '#prizes', id: 'prizes', label: 'Kejuaraan', icon: Trophy, desc: 'Kategori juara, trofi & penghargaan' },
    { href: '#contact', id: 'contact', label: 'Kontak & Lokasi', icon: Phone, desc: 'Denah arena & narahubung resmi' },
  ];

  return (
    <div
      id="mobile-menu"
      className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-2xl flex flex-col animate-in fade-in duration-200"
    >
      {/* Top Header Bar */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-white/10 shrink-0 bg-slate-950/60 backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <img
            src={logoLbb}
            alt="Logo LBB"
            className="h-10 w-auto object-contain shrink-0"
          />
          <img
            src={titleLogo}
            alt="LBB Mu'allimin 2027"
            className="h-6 w-auto object-contain"
          />
        </div>

        <button
          onClick={onClose}
          className="w-10 h-10 rounded-2xl bg-white/[0.08] hover:bg-white/15 text-slate-300 hover:text-white flex items-center justify-center transition-all border border-white/10 active:scale-95"
          aria-label="Tutup Menu"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Scrollable Body */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
        {/* Navigation Section */}
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block px-2 mb-3">
            Menu Navigasi
          </span>
          <div className="space-y-2">
            {links.map(item => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;

              return (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => {
                    setActiveSection(item.id);
                    onClose();
                  }}
                  className={`group flex items-center gap-3.5 p-3 rounded-2xl border transition-all duration-200 ${
                    isActive
                      ? 'bg-white/[0.08] border-white/20 shadow-sm text-white'
                      : 'bg-white/[0.03] hover:bg-white/[0.07] border-white/5 hover:border-white/10 text-slate-300 hover:text-white'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors shadow-sm ${
                    isActive
                      ? 'bg-white/15 text-amber-400 border border-white/10'
                      : 'bg-white/5 text-slate-400 group-hover:text-amber-400 group-hover:bg-white/10'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-bold block leading-tight">
                      {item.label}
                    </span>
                    <span className="text-[11px] text-slate-400 truncate block mt-0.5">
                      {item.desc}
                    </span>
                  </div>

                  <ChevronRight className={`w-4 h-4 shrink-0 transition-transform ${
                    isActive ? 'text-amber-400 translate-x-0.5' : 'text-slate-600 group-hover:text-slate-400'
                  }`} />
                </a>
              );
            })}

            {/* Rundown Link */}
            <button
              type="button"
              onClick={() => {
                onClose();
                setActiveView('rundown');
              }}
              className="w-full group flex items-center gap-3.5 p-3 rounded-2xl border transition-all duration-200 bg-white/[0.03] hover:bg-white/[0.07] border-white/5 hover:border-white/10 text-slate-300 hover:text-white text-left cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors shadow-sm bg-white/5 text-slate-400 group-hover:text-amber-400 group-hover:bg-white/10">
                <Clock className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-sm font-bold block leading-tight">
                  Rundown Acara
                </span>
                <span className="text-[11px] text-slate-400 truncate block mt-0.5">
                  Hari-H, TM & Uji Coba Lapangan 2027
                </span>
              </div>
              <ChevronRight className="w-4 h-4 shrink-0 transition-transform text-slate-600 group-hover:text-slate-400" />
            </button>
          </div>
        </div>

        {/* User Account / Auth Section */}
        <div className="pt-2 border-t border-white/10">
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block px-2 mb-3">
            {currentUser ? 'Akun & Akses Sistem' : 'Akses Portal'}
          </span>
          {currentUser ? (
            <div className="space-y-3">
              {/* User Profile Header Card - Sleek & Compact */}
              <div className="p-3 bg-white/[0.04] rounded-2xl border border-white/10 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="relative shrink-0">
                    <img
                      src={avatarUrl}
                      alt={currentUser.name}
                      className={`w-9 h-9 rounded-xl shadow-md ${
                        isSchoolLogo ? 'object-contain bg-white p-0.5' : 'object-cover ring-1 ring-white/20'
                      }`}
                      onError={(e) => {
                        if (currentUser.googleAvatar) {
                          e.target.src = currentUser.googleAvatar;
                        } else {
                          e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.name)}&background=8B0000&color=fff`;
                        }
                      }}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <p className="text-xs sm:text-sm font-bold text-white leading-tight truncate">
                        {currentUser.role === 'peserta' ? (currentUser.schoolName || currentUser.name) : currentUser.name}
                      </p>
                      <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-400/10 text-amber-300 border border-amber-400/20 shrink-0">
                        {currentUser.role}
                      </span>
                    </div>
                    {currentUser.role === 'peserta' && currentUser.name && currentUser.name !== currentUser.schoolName ? (
                      <p className="text-[11px] text-slate-400 truncate mt-0.5">Official: {currentUser.name}</p>
                    ) : (
                      <p className="text-[10px] text-slate-400 truncate mt-0.5 font-mono">{currentUser.email}</p>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    logoutUser();
                  }}
                  className="w-8 h-8 rounded-xl bg-white/5 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 border border-white/10 flex items-center justify-center transition-all cursor-pointer shrink-0 ml-2 active:scale-95"
                  title="Keluar"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Role-Authorized Quick Actions - Decluttered & Compact */}
              <div className="space-y-2 pt-0.5">
                {/* 1. PESERTA */}
                {currentUser.role === 'peserta' && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      setActiveView('peserta_dashboard');
                    }}
                    className="w-full flex items-center justify-between p-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-left transition-all font-bold text-white cursor-pointer group active:scale-98"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-amber-500/15 text-amber-400 flex items-center justify-center shrink-0">
                        <LayoutDashboard className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-xs font-bold block text-white">Portal Kontingen Peleton</span>
                        <span className="text-[10px] text-slate-400 block font-normal">Dashboard peserta resmi</span>
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all shrink-0" />
                  </button>
                )}

                {/* 2. ADMIN (SEKRETARIAT & PENDAFTARAN) */}
                {currentUser.role === 'admin' && (
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block px-1">
                      Menu Administrasi:
                    </span>
                    <div className="grid grid-cols-1 gap-1.5">
                      {[
                        { view: 'admin', label: 'Verifikasi Berkas & Pendaftaran', icon: ClipboardList, color: 'text-blue-400' },
                        { view: 'tm', label: 'Undian TM & Jadwal Tampil', icon: CalendarCheck, color: 'text-amber-400' },
                        { view: 'field_trial', label: 'Jadwal Uji Coba Lapangan', icon: Compass, color: 'text-emerald-400' },
                      ].map(item => {
                        const Icon = item.icon;
                        return (
                          <button
                            key={item.view}
                            type="button"
                            onClick={() => {
                              onClose();
                              setActiveView(item.view);
                            }}
                            className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/5 hover:border-white/10 text-left transition-all cursor-pointer group active:scale-98"
                          >
                            <div className="flex items-center gap-2.5">
                              <Icon className={`w-4 h-4 ${item.color} shrink-0`} />
                              <span className="text-xs font-semibold text-slate-200 group-hover:text-white">
                                {item.label}
                              </span>
                            </div>
                            <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-white group-hover:translate-x-0.5 transition-all shrink-0" />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 3. CHECK-IN / BASECAMP OFFICER */}
                {currentUser.role === 'checkin' && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      setActiveView('checkin');
                    }}
                    className="w-full flex items-center justify-between p-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-left transition-all font-semibold text-slate-200 hover:text-white cursor-pointer group active:scale-98"
                  >
                    <div className="flex items-center gap-2.5">
                      <Building2 className="w-4 h-4 text-teal-400 shrink-0" />
                      <div>
                        <span className="text-xs font-bold block text-white">Pos Basecamp & Barak Transit</span>
                        <span className="text-[10px] text-slate-400 block font-normal">Check-In kedatangan & Check-Out kepulangan</span>
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-teal-400 group-hover:translate-x-0.5 transition-all" />
                  </button>
                )}

                {/* 4. DAERAH PERSIAPAN (DP 1-2) OFFICER */}
                {(currentUser.role === 'dp' || currentUser.role === 'staging') && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      setActiveView('dp');
                    }}
                    className="w-full flex items-center justify-between p-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-left transition-all font-semibold text-slate-200 hover:text-white cursor-pointer group active:scale-98"
                  >
                    <div className="flex items-center gap-2.5">
                      <Clock className="w-4 h-4 text-orange-400 shrink-0" />
                      <span className="text-xs font-semibold">Panel Daerah Persiapan (DP 1-2)</span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-orange-400 group-hover:translate-x-0.5 transition-all" />
                  </button>
                )}

                {/* 5. DEWAN JURI LAPANGAN */}
                {currentUser.role === 'juri' && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      setActiveView('juri');
                    }}
                    className="w-full flex items-center justify-between p-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-left transition-all font-semibold text-slate-200 hover:text-white cursor-pointer group active:scale-98"
                  >
                    <div className="flex items-center gap-2.5">
                      <Award className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span className="text-xs font-semibold">Lembar E-Scoring Juri LBB</span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all" />
                  </button>
                )}

                {/* 6. OPERATOR PENGINPUT NILAI */}
                {currentUser.role === 'penginput' && (
                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        setActiveView('juri');
                      }}
                      className="flex items-center gap-2 p-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/5 text-left transition-all cursor-pointer group active:scale-98"
                    >
                      <Award className="w-4 h-4 text-indigo-400 shrink-0" />
                      <span className="text-xs font-semibold text-slate-200 group-hover:text-white truncate">
                        Input Fisik Skor
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        setActiveView('rekap_nilai');
                      }}
                      className="flex items-center gap-2 p-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/5 text-left transition-all cursor-pointer group active:scale-98"
                    >
                      <FileSpreadsheet className="w-4 h-4 text-indigo-400 shrink-0" />
                      <span className="text-xs font-semibold text-slate-200 group-hover:text-white truncate">
                        Monitoring Draft
                      </span>
                    </button>
                  </div>
                )}

                {/* 7. VERIFIKATOR NILAI */}
                {currentUser.role === 'verifikator' && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      setActiveView('rekap_nilai');
                    }}
                    className="w-full flex items-center justify-between p-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-left transition-all font-semibold text-slate-200 hover:text-white cursor-pointer group active:scale-98"
                  >
                    <div className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                      <span className="text-xs font-semibold">Panel Verifikasi & Validasi Blangko</span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-teal-400 group-hover:translate-x-0.5 transition-all" />
                  </button>
                )}

                {/* 8. FINALISATOR (KETUA DEWAN JURI) */}
                {currentUser.role === 'finalisator' && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      setActiveView('rekap_nilai');
                    }}
                    className="w-full flex items-center justify-between p-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-left transition-all font-semibold text-slate-200 hover:text-white cursor-pointer group active:scale-98"
                  >
                    <div className="flex items-center gap-2.5">
                      <Trophy className="w-4 h-4 text-amber-400 shrink-0" />
                      <span className="text-xs font-semibold">Penguncian Skor & Berita Acara</span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all" />
                  </button>
                )}

                {/* 9. SUPERADMIN (KETUA PELAKSANA / IT MASTER) */}
                {currentUser.role === 'superadmin' && (
                  <div className="space-y-2.5">
                    {/* Primary Highlight Master Button */}
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        setActiveView('superadmin');
                      }}
                      className="w-full flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-rose-950/40 via-slate-900 to-slate-900 border border-rose-500/30 hover:border-rose-400/60 text-left transition-all cursor-pointer group active:scale-98 shadow-sm"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
                          <Crown className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-xs font-bold block text-rose-200">Superadmin Master Authority</span>
                          <span className="text-[10px] text-rose-400/80 block font-normal">Pusat kendali & konfigurasi sistem</span>
                        </div>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-rose-400 group-hover:translate-x-0.5 transition-transform shrink-0" />
                    </button>

                    {/* Compact 2-Column Grid of Panitia Tools (Calm & Organized) */}
                    <div className="space-y-1.5 pt-0.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block px-1">
                        Akses Cepat Modul:
                      </span>
                      <div className="grid grid-cols-2 gap-1.5">
                        {[
                          { view: 'admin', label: 'Verifikasi Berkas', icon: ClipboardList, color: 'text-blue-400' },
                          { view: 'tm', label: 'Undian TM', icon: CalendarCheck, color: 'text-amber-400' },
                          { view: 'field_trial', label: 'Uji Lapangan', icon: Compass, color: 'text-emerald-400' },
                          { view: 'checkin', label: 'Pos Basecamp', icon: Building2, color: 'text-teal-400' },
                          { view: 'dp', label: 'Daerah Persiapan', icon: Clock, color: 'text-orange-400' },
                          { view: 'juri', label: 'Scoring Juri', icon: Award, color: 'text-purple-400' },
                          { view: 'rekap_nilai', label: 'Rekap Nilai', icon: FileSpreadsheet, color: 'text-indigo-400' },
                        ].map(tool => {
                          const Icon = tool.icon;
                          return (
                            <button
                              key={tool.view}
                              type="button"
                              onClick={() => {
                                onClose();
                                setActiveView(tool.view);
                              }}
                              className="flex items-center gap-2 p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] active:bg-white/[0.12] border border-white/5 hover:border-white/10 text-left transition-all active:scale-95 group cursor-pointer"
                            >
                              <div className="w-6 h-6 rounded-lg bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-white/10 transition-colors">
                                <Icon className={`w-3.5 h-3.5 ${tool.color}`} />
                              </div>
                              <span className="text-[11px] font-semibold text-slate-300 group-hover:text-white truncate">
                                {tool.label}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => {
                onClose();
                openAuthModal('login');
              }}
              className="w-full py-3.5 px-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-2xl text-center shadow-md active:scale-98 transition-all text-xs uppercase tracking-wider flex items-center justify-center gap-2.5 cursor-pointer border border-amber-600/20"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
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
              <span>Daftar / Masuk Akun Peleton</span>
            </button>
          )}

          {/* Quick Hub: Papan Juara & Pengumuman */}
          <div className="pt-3">
            <button
              type="button"
              onClick={() => {
                onClose();
                setActiveView('announcement');
              }}
              className="w-full p-3.5 bg-white/[0.04] hover:bg-white/[0.07] rounded-2xl border border-white/10 hover:border-white/20 text-left transition-all group flex items-center justify-between cursor-pointer shadow-xs"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/[0.08] border border-white/10 flex items-center justify-center text-amber-400 shrink-0">
                  <Trophy className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-white block">Papan Juara & Pengumuman</span>
                  <span className="text-[10px] text-slate-400 block font-normal">Hasil lomba & live leaderboard</span>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all shrink-0" />
            </button>
          </div>

          {/* Social Media Links */}
          <div className="pt-3 flex items-center justify-between px-2">
            <span className="text-[11px] text-slate-400 font-medium">Ikuti Info Resmi:</span>
            <div className="flex items-center gap-2">
              <a
                href={SOCIAL.INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 hover:border-white/20 text-slate-400 hover:text-white flex items-center justify-center transition-all"
                aria-label="Instagram Resmi LBB"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={SOCIAL.TIKTOK_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 hover:border-white/20 text-slate-400 hover:text-white flex items-center justify-center transition-all"
                aria-label="TikTok Resmi Tonti"
              >
                <Video className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
