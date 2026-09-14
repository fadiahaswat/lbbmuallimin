import React, { useState } from 'react';
import {
  Users,
  Shield,
  Award,
  Crown,
  Globe,
  Lock,
  LogOut,
  Sparkles,
  CheckCircle,
  Eye,
  FileSpreadsheet
} from 'lucide-react';
import { useCompetition } from '../../context/CompetitionContext.jsx';

export default function RoleBar() {
  const {
    role,
    activeView,
    setActiveView,
    switchRole,
    currentTeam,
    logoutTeam,
    openModal,
    teams,
    requestRoleAccess
  } = useCompetition();

  const roleList = [
    { id: 'publik', label: 'Publik', icon: Globe, badge: 'Info & Juknis', color: 'text-slate-200 hover:text-white' },
    { id: 'peserta', label: 'Peserta', icon: Users, badge: currentTeam ? currentTeam.regCode : 'Portal Tim', color: 'text-amber-300 hover:text-amber-200' },
    { id: 'admin', label: 'Panitia (Admin)', icon: Shield, badge: 'Sekretariat', color: 'text-blue-300 hover:text-blue-200', needsPin: true },
    { id: 'juri', label: 'Dewan Juri', icon: Award, badge: 'E-Scoring', color: 'text-emerald-300 hover:text-emerald-200', needsPin: true },
    { id: 'superadmin', label: 'Superadmin', icon: Crown, badge: 'Master', color: 'text-rose-300 hover:text-rose-200', needsPin: true },
  ];

  function handleRoleClick(targetRole, needsPin) {
    if (targetRole === role && activeView !== 'landing') {
      // already in role
      return;
    }

    if (!needsPin) {
      if (targetRole === 'peserta' && !currentTeam) {
        // Open status / login page for participant
        openModal('statusCheck');
        return;
      }
      switchRole(targetRole);
      return;
    }

    // Role butuh PIN -> arahkan ke halaman PIN Auth (tanpa modal pop-up)
    requestRoleAccess(targetRole);
  }

  const pendingCount = teams.filter(t => t.status === 'pending').length;

  return (
    <>
      {/* Top Role Bar */}
      <div className="bg-slate-950 text-white border-b border-slate-800 text-xs py-1.5 px-4 sticky top-0 z-50 shadow-md">
        <div className="container mx-auto flex flex-wrap items-center justify-between gap-2">
          {/* Left Info */}
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 font-bold uppercase tracking-wider text-[10px] text-yellow-400 bg-yellow-400/10 px-2 py-0.5 rounded border border-yellow-400/20">
              <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse"></span>
              Sistem Terpadu LBB 2026
            </span>
            <span className="hidden sm:inline text-slate-400 text-[11px]">
              Mode Akses: <strong className="text-white uppercase tracking-wide">{role}</strong>
            </span>
            {role === 'peserta' && currentTeam && (
              <span className="bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded border border-amber-500/30 text-[10px] font-bold">
                {currentTeam.schoolName} ({currentTeam.regCode})
              </span>
            )}
            {pendingCount > 0 && (role === 'admin' || role === 'superadmin') && (
              <span className="bg-red-500/20 text-red-300 px-2 py-0.5 rounded border border-red-500/30 text-[10px] font-extrabold animate-pulse">
                {pendingCount} Verifikasi Pending
              </span>
            )}
          </div>

          {/* Role Navigation Buttons */}
          <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto py-0.5">
            {roleList.map(item => {
              const Icon = item.icon;
              const isActive = role === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleRoleClick(item.id, item.needsPin)}
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-red-700 text-white shadow-sm ring-1 ring-red-500'
                      : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800'
                  }`}
                  title={`Beralih ke mode ${item.label}`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                  {item.needsPin && !isActive && (
                    <Lock className="w-2.5 h-2.5 opacity-60 text-slate-400" />
                  )}
                </button>
              );
            })}

            {/* Shortcut ke Pengumuman Resmi / Live Leaderboard */}
            <button
              onClick={() => setActiveView(activeView === 'announcement' ? 'landing' : 'announcement')}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold transition-all whitespace-nowrap ${
                activeView === 'announcement'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 border border-amber-500/30'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>Pengumuman & Juara</span>
            </button>

            {/* Jika sedang di sub-view, tombol kembali ke Beranda Publik */}
            {activeView !== 'landing' && (
              <button
                onClick={() => {
                  setActiveView('landing');
                  if (role !== 'publik' && role !== 'peserta') switchRole('publik');
                }}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 ml-1 transition-all"
                title="Lihat Landing Page Utama"
              >
                <Globe className="w-3.5 h-3.5 text-yellow-400" />
                <span>Beranda Web</span>
              </button>
            )}

            {/* Logout Tim jika role Peserta */}
            {role === 'peserta' && currentTeam && (
              <button
                onClick={logoutTeam}
                className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium bg-red-950 hover:bg-red-900 text-red-300 border border-red-800/50 ml-1"
                title="Keluar dari sesi tim"
              >
                <LogOut className="w-3 h-3" />
                <span>Keluar</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
