import React, { useEffect } from 'react';
import {
  Home,
  Info,
  CalendarDays,
  ClipboardList,
  BookOpen,
  Trophy,
  Download,
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
  Crown
} from 'lucide-react';
import { SOCIAL } from '../config.js';
import { useCompetition } from '../context/CompetitionContext.jsx';

export default function MobileMenu({ isOpen, onClose }) {
  const {
    openModal,
    setActiveView,
    currentUser,
    openAuthModal,
    logoutUser,
    getUserAvatar
  } = useCompetition();

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
    { href: '#time-location', label: 'Waktu & Tempat', icon: CalendarDays },
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

        <div className="mt-4 pt-4 border-t border-white/10 space-y-2.5">
          {currentUser ? (
            <div className="space-y-3">
              {/* User Profile Header Card */}
              <div className="p-3 bg-white/10 rounded-2xl border border-white/15 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative shrink-0">
                    <img
                      src={avatarUrl}
                      alt={currentUser.name}
                      className={`w-10 h-10 rounded-xl shadow-md ${
                        isSchoolLogo ? 'object-contain bg-white p-0.5' : 'object-cover ring-2 ring-yellow-400/30'
                      }`}
                      onError={(e) => {
                        if (currentUser.googleAvatar) {
                          e.target.src = currentUser.googleAvatar;
                        } else {
                          e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.name)}&background=8B0000&color=fff`;
                        }
                      }}
                    />
                    <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-950" title="Online" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-white leading-tight truncate">
                      {currentUser.role === 'peserta' ? (currentUser.schoolName || currentUser.name) : currentUser.name}
                    </p>
                    {currentUser.role === 'peserta' && currentUser.name && currentUser.name !== currentUser.schoolName ? (
                      <p className="text-[10px] text-slate-400 truncate">Official: {currentUser.name}</p>
                    ) : (
                      <p className="text-[10px] text-slate-400 truncate mt-0.5">{currentUser.email}</p>
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    logoutUser();
                  }}
                  className="p-2 text-red-400 hover:text-red-300 hover:bg-white/5 rounded-xl transition-colors cursor-pointer"
                  title="Keluar"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>

              {/* Role-Authorized Quick Actions List */}
              <div className="space-y-1.5">
                {/* 1. PESERTA */}
                {currentUser.role === 'peserta' && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      setActiveView('peserta_dashboard');
                    }}
                    className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-yellow-500/50 text-left transition-all font-bold text-white cursor-pointer group"
                  >
                    <div className="flex items-center gap-2.5">
                      <LayoutDashboard className="w-4 h-4 text-yellow-400 shrink-0" />
                      <span className="text-xs">Portal Kontingen Peleton</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-yellow-400 transition-colors" />
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
                      className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-blue-500/50 text-left transition-all font-bold text-white cursor-pointer group"
                    >
                      <div className="flex items-center gap-2.5">
                        <ClipboardList className="w-4 h-4 text-blue-400 shrink-0" />
                        <span className="text-xs">Verifikasi Berkas & Pendaftaran</span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-blue-400 transition-colors" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        setActiveView('tm');
                      }}
                      className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-500/50 text-left transition-all font-bold text-slate-200 hover:text-white cursor-pointer group"
                    >
                      <div className="flex items-center gap-2.5">
                        <CalendarCheck className="w-4 h-4 text-amber-400 shrink-0" />
                        <span className="text-xs">Kocok Undian TM & No. Dada</span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 transition-colors" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        setActiveView('field_trial');
                      }}
                      className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 text-left transition-all font-bold text-slate-200 hover:text-white cursor-pointer group"
                    >
                      <div className="flex items-center gap-2.5">
                        <Compass className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span className="text-xs">Jadwal Uji Coba Lapangan</span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition-colors" />
                    </button>
                  </>
                )}

                {/* 3. CHECK-IN / BASECAMP OFFICER */}
                {currentUser.role === 'checkin' && (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        setActiveView('checkin');
                      }}
                      className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500/50 text-left transition-all font-bold text-white cursor-pointer group"
                    >
                      <div className="flex items-center gap-2.5">
                        <LogIn className="w-4 h-4 text-cyan-400 shrink-0" />
                        <span className="text-xs">Meja Registrasi Check-In Hari-H</span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition-colors" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        setActiveView('checkout');
                      }}
                      className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-teal-500/50 text-left transition-all font-bold text-slate-200 hover:text-white cursor-pointer group"
                    >
                      <div className="flex items-center gap-2.5">
                        <LogOut className="w-4 h-4 text-teal-400 shrink-0" />
                        <span className="text-xs">Inspeksi Barak & Check-Out</span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-teal-400 transition-colors" />
                    </button>
                  </>
                )}

                {/* 4. DAERAH PERSIAPAN (DP 1-3) OFFICER */}
                {(currentUser.role === 'dp' || currentUser.role === 'staging') && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      setActiveView('dp');
                    }}
                    className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-orange-500/50 text-left transition-all font-bold text-white cursor-pointer group"
                  >
                    <div className="flex items-center gap-2.5">
                      <Clock className="w-4 h-4 text-orange-400 shrink-0" />
                      <span className="text-xs">Panel Daerah Persiapan (DP 1-3)</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-orange-400 transition-colors" />
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
                    className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 text-left transition-all font-bold text-white cursor-pointer group"
                  >
                    <div className="flex items-center gap-2.5">
                      <Award className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span className="text-xs">Lembar E-Scoring Juri LBB</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition-colors" />
                  </button>
                )}

                {/* 6. OPERATOR PENGINPUT NILAI */}
                {currentUser.role === 'penginput' && (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        setActiveView('juri');
                      }}
                      className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-indigo-500/50 text-left transition-all font-bold text-white cursor-pointer group"
                    >
                      <div className="flex items-center gap-2.5">
                        <Award className="w-4 h-4 text-indigo-400 shrink-0" />
                        <span className="text-xs">Input Nilai Fisik & Foto Blangko</span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 transition-colors" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        setActiveView('rekap_nilai');
                      }}
                      className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-indigo-500/50 text-left transition-all font-bold text-slate-200 hover:text-white cursor-pointer group"
                    >
                      <div className="flex items-center gap-2.5">
                        <FileSpreadsheet className="w-4 h-4 text-indigo-400 shrink-0" />
                        <span className="text-xs">Monitoring Status Draft Nilai</span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 transition-colors" />
                    </button>
                  </>
                )}

                {/* 7. VERIFIKATOR NILAI */}
                {currentUser.role === 'verifikator' && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      setActiveView('rekap_nilai');
                    }}
                    className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-teal-500/50 text-left transition-all font-bold text-white cursor-pointer group"
                  >
                    <div className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                      <span className="text-xs">Panel Verifikasi & Validasi Blangko</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-teal-400 transition-colors" />
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
                    className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-500/50 text-left transition-all font-bold text-white cursor-pointer group"
                  >
                    <div className="flex items-center gap-2.5">
                      <Trophy className="w-4 h-4 text-amber-400 shrink-0" />
                      <span className="text-xs">Penguncian Skor & Berita Acara</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 transition-colors" />
                  </button>
                )}

                {/* 9. SUPERADMIN (KETUA PELAKSANA / IT MASTER) */}
                {currentUser.role === 'superadmin' && (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        setActiveView('superadmin');
                      }}
                      className="w-full flex items-center justify-between p-3 rounded-xl bg-rose-950/40 border border-rose-800/60 hover:border-rose-500 text-left transition-all text-rose-300 font-bold cursor-pointer group"
                    >
                      <div className="flex items-center gap-2.5">
                        <Crown className="w-4 h-4 text-rose-400 shrink-0" />
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
                      className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-blue-500/50 text-left transition-all font-bold text-slate-200 hover:text-white cursor-pointer group"
                    >
                      <div className="flex items-center gap-2.5">
                        <ClipboardList className="w-4 h-4 text-blue-400 shrink-0" />
                        <span className="text-xs">Dashboard Admin Sekretariat</span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-blue-400 transition-colors" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        setActiveView('dp');
                      }}
                      className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-orange-500/50 text-left transition-all font-bold text-slate-200 hover:text-white cursor-pointer group"
                    >
                      <div className="flex items-center gap-2.5">
                        <Clock className="w-4 h-4 text-orange-400 shrink-0" />
                        <span className="text-xs">Panel DP (Daerah Persiapan)</span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-orange-400 transition-colors" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        setActiveView('rekap_nilai');
                      }}
                      className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-500/50 text-left transition-all font-bold text-slate-200 hover:text-white cursor-pointer group"
                    >
                      <div className="flex items-center gap-2.5">
                        <Award className="w-4 h-4 text-amber-400 shrink-0" />
                        <span className="text-xs">Rekap & Penguncian Nilai</span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 transition-colors" />
                    </button>
                  </>
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
              className="w-full py-3.5 bg-gradient-to-r from-yellow-400 to-amber-500 text-slate-950 font-black rounded-xl text-center shadow-md active:scale-95 transition-transform text-xs uppercase tracking-wider flex items-center justify-center gap-2"
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
              <span>Daftar/Masuk</span>
            </button>
          )}

          <div>
            <button
              type="button"
              onClick={() => {
                onClose();
                setActiveView('announcement');
              }}
              className="w-full py-2.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-semibold rounded-xl text-center border border-amber-500/20 transition-colors text-xs flex items-center justify-center gap-2"
            >
              <Trophy className="w-4 h-4 text-yellow-400" />
              <span>Papan Juara & Pengumuman</span>
            </button>
          </div>

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
