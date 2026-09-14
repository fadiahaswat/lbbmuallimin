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
  X,
  LogIn,
  LogOut,
  LayoutDashboard,
  Heart,
  ShieldCheck
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

        {/* Staff & Operasional Lapangan Quick Link */}
        <div className="mt-4 pt-4 border-t border-white/10 space-y-2">
          <button
            type="button"
            onClick={() => {
              onClose();
              setActiveView('staging');
            }}
            className="w-full p-3 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl text-left transition-all flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-indigo-400" />
              <span className="text-xs font-bold text-slate-300">Operator Lapangan & Staging DP</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500" />
          </button>
        </div>

        <div className="mt-4 pt-4 border-t border-white/10 space-y-2.5">
          {currentUser ? (
            <div className="space-y-2">
              <div className="p-3 bg-white/10 rounded-2xl border border-white/15 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={avatarUrl}
                    alt={currentUser.name}
                    className={`w-10 h-10 rounded-full ${
                      isSchoolLogo ? 'object-contain bg-white p-0.5' : 'object-cover'
                    }`}
                    onError={(e) => {
                      if (currentUser.googleAvatar) {
                        e.target.src = currentUser.googleAvatar;
                      } else {
                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.name)}&background=8B0000&color=fff`;
                      }
                    }}
                  />
                  <div>
                    <p className="text-sm font-bold text-white leading-tight">{currentUser.name}</p>
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-yellow-400/20 text-yellow-300">
                      {currentUser.roleLabel || currentUser.role}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    logoutUser();
                  }}
                  className="p-2 text-red-400 hover:text-red-300 hover:bg-white/5 rounded-xl transition-colors"
                  title="Keluar"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  if (currentUser.role === 'admin') setActiveView('admin');
                  else if (currentUser.role === 'juri') setActiveView('juri');
                  else if (currentUser.role === 'superadmin') setActiveView('superadmin');
                  else setActiveView('peserta_dashboard');
                }}
                className="w-full py-3.5 bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 text-slate-950 font-black rounded-xl text-center shadow-lg shadow-yellow-500/20 active:scale-95 transition-transform flex justify-center items-center gap-2 uppercase tracking-widest text-xs"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Buka Dashboard ({currentUser.role.toUpperCase()})</span>
              </button>
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
