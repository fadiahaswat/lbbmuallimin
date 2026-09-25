import React from 'react';
import {
  Shield,
  ShieldCheck,
  Award,
  Users,
  Home,
  Crown,
  Trophy,
  Heart,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { useCompetition } from '../../context/CompetitionContext.jsx';
import logoImg from '../../assets/logo-tonti.png';

/**
 * TopAppNavigationBar
 * Navigasi Terpadu (Unified Top Navigation Bar)
 * Menyediakan tautan berpindah modul antar backoffice & portal lomba yang konsisten,
 * jelas, elegan, dan informatif bagi Admin, Petugas Lapangan, Juri, dan Superadmin.
 */
export default function TopAppNavigationBar({
  currentModule = 'admin', // 'admin' | 'staging' | 'juri' | 'superadmin' | 'peserta' | 'leaderboard'
  extraActions = null,
}) {
  const { currentUser, setActiveView, role } = useCompetition();

  const isStaffOrAdmin = ['admin', 'superadmin', 'penginput', 'verifikator', 'finalisator', 'juri'].includes(currentUser?.role || role);

  const modules = [
    {
      id: 'admin',
      label: 'Sekretariat',
      sublabel: 'Verifikasi & Undian',
      icon: Shield,
      view: 'admin',
      activeColor: 'bg-blue-600 text-white shadow-blue-900/40 ring-2 ring-blue-400',
      badgeColor: 'bg-blue-500/20 text-blue-300',
      visible: ['admin', 'superadmin'].includes(currentUser?.role || role),
    },
    {
      id: 'staging',
      label: 'Staging & DP',
      sublabel: 'Operasional Hari-H',
      icon: ShieldCheck,
      view: 'staging',
      activeColor: 'bg-indigo-600 text-white shadow-indigo-900/40 ring-2 ring-indigo-400',
      badgeColor: 'bg-indigo-500/20 text-indigo-300',
      visible: isStaffOrAdmin,
    },
    {
      id: 'juri',
      label: 'Portal Juri',
      sublabel: 'E-Scoring Dewan Juri',
      icon: Award,
      view: 'juri',
      activeColor: 'bg-amber-500 text-slate-950 font-black shadow-amber-950/40 ring-2 ring-amber-300',
      badgeColor: 'bg-amber-500/20 text-amber-300',
      visible: isStaffOrAdmin,
    },
    {
      id: 'leaderboard',
      label: 'Klasemen Juara',
      sublabel: 'Live Scoreboard',
      icon: Trophy,
      view: 'live_leaderboard',
      activeColor: 'bg-emerald-600 text-white shadow-emerald-900/40 ring-2 ring-emerald-400',
      badgeColor: 'bg-emerald-500/20 text-emerald-300',
      visible: true,
    },
    {
      id: 'superadmin',
      label: 'Master System',
      sublabel: 'Kontrol Penuh',
      icon: Crown,
      view: 'superadmin',
      activeColor: 'bg-rose-600 text-white shadow-rose-900/40 ring-2 ring-rose-400',
      badgeColor: 'bg-rose-500/20 text-rose-300',
      visible: (currentUser?.role || role) === 'superadmin',
    },
  ];

  const visibleModules = modules.filter(m => m.visible);

  return (
    <div className="bg-slate-900/95 backdrop-blur-xl border border-slate-800 rounded-3xl p-3 sm:p-4 shadow-2xl flex flex-col lg:flex-row lg:items-center justify-between gap-4">
      {/* Brand Identity & Current User Indicator */}
      <div className="flex items-center gap-3.5">
        <button
          type="button"
          onClick={() => setActiveView('landing')}
          className="flex items-center gap-2.5 p-1.5 rounded-2xl hover:bg-slate-800/80 transition-all text-left group cursor-pointer"
          title="Kembali ke Beranda Depan LBB"
        >
          <img
            src={logoImg}
            alt="Logo LBB Mu'allimin"
            className="w-10 h-10 object-contain drop-shadow group-hover:scale-105 transition-transform"
          />
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-black uppercase tracking-widest text-yellow-400">
                LBB MU'ALLIMIN 2027
              </span>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 font-mono">
                v2.0
              </span>
            </div>
            <div className="text-xs font-black text-white flex items-center gap-1 group-hover:text-yellow-400 transition-colors">
              <Home className="w-3 h-3 text-slate-400" />
              <span>Portal Terpadu Panitia</span>
            </div>
          </div>
        </button>

        {currentUser && (
          <div className="hidden sm:flex items-center gap-2 pl-3 border-l border-slate-800 text-xs text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-bold text-slate-300 truncate max-w-[140px]">
              {currentUser.name ? currentUser.name.split(' ')[0] : currentUser.email}
            </span>
            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-slate-800 text-yellow-400 border border-slate-700">
              {currentUser.roleLabel || currentUser.role}
            </span>
          </div>
        )}
      </div>

      {/* Main Module Switcher (Pill Navigation) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
        {visibleModules.map((m) => {
          const isActive = currentModule === m.id;
          const Icon = m.icon;

          return (
            <button
              key={m.id}
              type="button"
              onClick={() => setActiveView(m.view)}
              className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
                isActive
                  ? `${m.activeColor} shadow-md`
                  : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/70 hover:border-slate-600'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <div className="text-left">
                <span className="block leading-tight font-black tracking-tight">{m.label}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Extra Actions Toolbar / Quick Exit Button */}
      <div className="flex items-center gap-2 justify-end shrink-0">
        {extraActions}

        <button
          type="button"
          onClick={() => setActiveView('landing')}
          className="px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-bold transition-all border border-slate-700 flex items-center gap-1.5 cursor-pointer"
        >
          <Home className="w-3.5 h-3.5" />
          <span>Beranda</span>
        </button>
      </div>
    </div>
  );
}
