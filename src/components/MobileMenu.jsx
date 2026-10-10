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

      // Detect current section on open
      const sections = ['home', 'about', 'time-location', 'registration', 'rules', 'prizes', 'contact'];
      const scrollPos = window.scrollY + 200;
      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(sectionId);
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
    { href: '#about', id: 'about', label: 'Tentang', icon: Info, desc: 'Sejarah, tema & nilai LBB' },
    { href: '#time-location', id: 'time-location', label: 'Waktu & Tempat', icon: CalendarDays, desc: 'Jadwal hari H & venue' },
    { href: '#registration', id: 'registration', label: 'Pendaftaran', icon: ClipboardList, desc: 'Alur pendaftaran & kuota' },
    { href: '#rules', id: 'rules', label: 'Juknis & Materi', icon: BookOpen, desc: 'Regulasi & materi gerakan PBB' },
    { href: '#prizes', id: 'prizes', label: 'Kategori & Hadiah', icon: Trophy, desc: 'Trofi, sertifikat & penghargaan' },
    { href: '#contact', id: 'contact', label: 'Kontak', icon: Phone, desc: 'Narahubung & sekretariat' },
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
                      ? 'bg-gradient-to-r from-red-950/70 via-red-900/40 to-slate-900/80 border-red-500/40 shadow-lg text-white'
                      : 'bg-white/[0.03] hover:bg-white/[0.07] border-white/5 hover:border-white/10 text-slate-300 hover:text-white'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors shadow-sm ${
                    isActive
                      ? 'bg-red-600 text-white shadow-red-700/30'
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
          </div>
        </div>

        {/* User Account / Auth Section */}
        <div className="pt-2 border-t border-white/10">
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block px-2 mb-3">
            {currentUser ? 'Akun & Akses Sistem' : 'Akses Portal'}
          </span>
          {currentUser ? (
            <div className="space-y-3">
              {/* User Profile Header Card */}
              <div className="p-3.5 bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 rounded-2xl border border-white/10 flex items-center justify-between shadow-lg">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative shrink-0">
                    <img
                      src={avatarUrl}
                      alt={currentUser.name}
                      className={`w-11 h-11 rounded-xl shadow-md ${
                        isSchoolLogo ? 'object-contain bg-white p-0.5' : 'object-cover ring-2 ring-yellow-400/40'
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
                    <p className="text-sm font-black text-white leading-tight truncate">
                      {currentUser.role === 'peserta' ? (currentUser.schoolName || currentUser.name) : currentUser.name}
                    </p>
                    {currentUser.role === 'peserta' && currentUser.name && currentUser.name !== currentUser.schoolName ? (
                      <p className="text-[11px] text-slate-400 truncate mt-0.5">Official: {currentUser.name}</p>
                    ) : (
                      <p className="text-[11px] text-slate-400 truncate mt-0.5 font-mono">{currentUser.email}</p>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    logoutUser();
                  }}
                  className="w-9 h-9 rounded-xl bg-red-950/40 hover:bg-red-900/60 text-red-400 hover:text-white border border-red-500/20 flex items-center justify-center transition-all cursor-pointer shrink-0 ml-2 active:scale-95"
                  title="Keluar"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>

              {/* Role-Authorized Quick Actions List */}
              <div className="space-y-2">
                {/* 1. PESERTA */}
                {currentUser.role === 'peserta' && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      setActiveView('peserta_dashboard');
                    }}
                    className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-slate-900/90 border border-amber-500/30 hover:border-amber-400 text-left transition-all font-bold text-white cursor-pointer group shadow-md"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
                        <LayoutDashboard className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-xs font-bold block text-white">Portal Kontingen Peleton</span>
                        <span className="text-[10px] text-slate-400 block font-normal">Dashboard peserta resmi</span>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
                  </button>
                )}

                {/* 2. ADMIN (SEKRETARIAT & PENDAFTARAN) */}
                {currentUser.role === 'admin' && (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        setActiveView('admin');
                      }}
                      className="w-full flex items-center justify-between p-3 rounded-2xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/10 hover:border-blue-500/40 text-left transition-all font-bold text-white cursor-pointer group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-600/15 border border-blue-500/30 flex items-center justify-center text-blue-400">
                          <ClipboardList className="w-4 h-4" />
                        </div>
                        <span className="text-xs">Verifikasi Berkas & Pendaftaran</span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        setActiveView('tm');
                      }}
                      className="w-full flex items-center justify-between p-3 rounded-2xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/10 hover:border-amber-500/40 text-left transition-all font-bold text-slate-200 hover:text-white cursor-pointer group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
                          <CalendarCheck className="w-4 h-4" />
                        </div>
                        <span className="text-xs">Undian TM & Jadwal Tampil</span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        setActiveView('field_trial');
                      }}
                      className="w-full flex items-center justify-between p-3 rounded-2xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/10 hover:border-emerald-500/40 text-left transition-all font-bold text-slate-200 hover:text-white cursor-pointer group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                          <Compass className="w-4 h-4" />
                        </div>
                        <span className="text-xs">Jadwal Uji Coba Lapangan</span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all" />
                    </button>
                  </>
                )}

                {/* 3. CHECK-IN / BASECAMP OFFICER */}
                {currentUser.role === 'checkin' && (
                  <div className="space-y-2">
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        setActiveView('checkin');
                      }}
                      className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/10 hover:border-cyan-500/40 text-left transition-all font-bold text-white cursor-pointer group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-cyan-600/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                          <LogIn className="w-4 h-4" />
                        </div>
                        <span className="text-xs">Meja Registrasi Check-In Hari-H</span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        setActiveView('checkout');
                      }}
                      className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/10 hover:border-teal-500/40 text-left transition-all font-bold text-slate-200 hover:text-white cursor-pointer group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-teal-600/15 border border-teal-500/30 flex items-center justify-center text-teal-400">
                          <LogOut className="w-4 h-4" />
                        </div>
                        <span className="text-xs">Inspeksi Barak & Check-Out</span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-teal-400 group-hover:translate-x-0.5 transition-all" />
                    </button>
                  </div>
                )}

                {/* 4. DAERAH PERSIAPAN (DP 1-2) OFFICER */}
                {(currentUser.role === 'dp' || currentUser.role === 'staging') && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      setActiveView('dp');
                    }}
                    className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/10 hover:border-orange-500/40 text-left transition-all font-bold text-white cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-orange-600/15 border border-orange-500/30 flex items-center justify-center text-orange-400">
                        <Clock className="w-4 h-4" />
                      </div>
                      <span className="text-xs">Panel Daerah Persiapan (DP 1-2)</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-orange-400 group-hover:translate-x-0.5 transition-all" />
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
                    className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/10 hover:border-emerald-500/40 text-left transition-all font-bold text-white cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-600/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                        <Award className="w-4 h-4" />
                      </div>
                      <span className="text-xs">Lembar E-Scoring Juri LBB</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all" />
                  </button>
                )}

                {/* 6. OPERATOR PENGINPUT NILAI */}
                {currentUser.role === 'penginput' && (
                  <div className="space-y-2">
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        setActiveView('juri');
                      }}
                      className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/10 hover:border-indigo-500/40 text-left transition-all font-bold text-white cursor-pointer group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-indigo-600/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                          <Award className="w-4 h-4" />
                        </div>
                        <span className="text-xs">Input Nilai Fisik & Foto Blangko</span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        setActiveView('rekap_nilai');
                      }}
                      className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/10 hover:border-indigo-500/40 text-left transition-all font-bold text-slate-200 hover:text-white cursor-pointer group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-indigo-600/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                          <FileSpreadsheet className="w-4 h-4" />
                        </div>
                        <span className="text-xs">Monitoring Status Draft Nilai</span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all" />
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
                    className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/10 hover:border-teal-500/40 text-left transition-all font-bold text-white cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-teal-600/15 border border-teal-500/30 flex items-center justify-center text-teal-400">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <span className="text-xs">Panel Verifikasi & Validasi Blangko</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-teal-400 group-hover:translate-x-0.5 transition-all" />
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
                    className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/10 hover:border-amber-500/40 text-left transition-all font-bold text-white cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-amber-600/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
                        <Trophy className="w-4 h-4" />
                      </div>
                      <span className="text-xs">Penguncian Skor & Berita Acara</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all" />
                  </button>
                )}

                {/* 9. SUPERADMIN (KETUA PELAKSANA / IT MASTER) */}
                {currentUser.role === 'superadmin' && (
                  <div className="space-y-2">
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        setActiveView('superadmin');
                      }}
                      className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-gradient-to-r from-rose-950/40 to-slate-900 border border-rose-500/30 hover:border-rose-400 text-left transition-all text-rose-300 font-bold cursor-pointer group shadow-sm"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400">
                          <Crown className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-black">Superadmin Master Authority</span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-rose-400 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        setActiveView('admin');
                      }}
                      className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/10 hover:border-blue-500/40 text-left transition-all font-bold text-slate-200 hover:text-white cursor-pointer group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-600/15 border border-blue-500/30 flex items-center justify-center text-blue-400">
                          <ClipboardList className="w-4 h-4" />
                        </div>
                        <span className="text-xs">Dashboard Admin Sekretariat</span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        setActiveView('dp');
                      }}
                      className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/10 hover:border-orange-500/40 text-left transition-all font-bold text-slate-200 hover:text-white cursor-pointer group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-orange-600/15 border border-orange-500/30 flex items-center justify-center text-orange-400">
                          <Clock className="w-4 h-4" />
                        </div>
                        <span className="text-xs">Panel DP (Daerah Persiapan)</span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-orange-400 group-hover:translate-x-0.5 transition-all" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        setActiveView('rekap_nilai');
                      }}
                      className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/10 hover:border-amber-500/40 text-left transition-all font-bold text-slate-200 hover:text-white cursor-pointer group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-amber-600/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
                          <Award className="w-4 h-4" />
                        </div>
                        <span className="text-xs">Rekap & Penguncian Nilai</span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all" />
                    </button>
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
              className="w-full py-3.5 px-4 bg-gradient-to-r from-yellow-400 via-amber-400 to-amber-500 hover:brightness-110 text-slate-950 font-black rounded-2xl text-center shadow-lg shadow-amber-500/20 active:scale-98 transition-all text-xs uppercase tracking-wider flex items-center justify-center gap-2.5 cursor-pointer"
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
              className="w-full p-3.5 bg-gradient-to-r from-amber-500/10 via-yellow-500/5 to-transparent hover:from-amber-500/15 rounded-2xl border border-amber-500/25 hover:border-amber-400/40 text-left transition-all group flex items-center justify-between cursor-pointer shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                  <Trophy className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-amber-300 block">Papan Juara & Pengumuman</span>
                  <span className="text-[10px] text-slate-400 block font-normal">Hasil lomba & live leaderboard</span>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-amber-400 group-hover:translate-x-0.5 transition-transform shrink-0" />
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
                className="w-8 h-8 rounded-xl bg-white/5 hover:bg-pink-600/20 border border-white/10 hover:border-pink-500/30 text-slate-400 hover:text-pink-400 flex items-center justify-center transition-all"
                aria-label="Instagram Resmi LBB"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={SOCIAL.TIKTOK_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-xl bg-white/5 hover:bg-cyan-600/20 border border-white/10 hover:border-cyan-500/30 text-slate-400 hover:text-cyan-400 flex items-center justify-center transition-all"
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
