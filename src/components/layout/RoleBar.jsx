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
    teams
  } = useCompetition();

  const [pinPrompt, setPinPrompt] = useState({ isOpen: false, targetRole: null, pin: '', error: '' });

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
        // Open status / login modal for participant
        openModal('statusCheck');
        return;
      }
      switchRole(targetRole);
      return;
    }

    // Role butuh PIN
    setPinPrompt({
      isOpen: true,
      targetRole,
      pin: '',
      error: '',
    });
  }

  function handlePinSubmit(e) {
    e.preventDefault();
    const success = switchRole(pinPrompt.targetRole, pinPrompt.pin);
    if (success) {
      setPinPrompt({ isOpen: false, targetRole: null, pin: '', error: '' });
    } else {
      setPinPrompt(prev => ({
        ...prev,
        error: `PIN salah! Petunjuk: admin='admin2026', juri='juri2026', super='super2026'`,
      }));
    }
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

      {/* PIN Prompt Modal */}
      {pinPrompt.isOpen && (
        <div className="fixed inset-0 z-[100] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 text-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-red-600/20 border border-red-500/30 text-red-400 flex items-center justify-center">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-black text-lg text-white capitalize">
                  Akses {pinPrompt.targetRole === 'admin' ? 'Panitia Sekretariat' : pinPrompt.targetRole === 'juri' ? 'Dewan Juri' : 'Superadmin'}
                </h3>
                <p className="text-xs text-slate-400">Masukkan PIN otoritas untuk melanjutkan.</p>
              </div>
            </div>

            <form onSubmit={handlePinSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  PIN Keamanan
                </label>
                <input
                  type="password"
                  autoFocus
                  value={pinPrompt.pin}
                  onChange={e => setPinPrompt(prev => ({ ...prev, pin: e.target.value, error: '' }))}
                  placeholder="Masukkan PIN..."
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono text-sm focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                />
                {pinPrompt.error && (
                  <p className="text-xs text-red-400 font-medium mt-1.5">{pinPrompt.error}</p>
                )}
                <div className="mt-2 text-[11px] text-slate-500 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
                  <span className="font-bold text-slate-400 block mb-0.5">PIN Akses Demo / Panitia:</span>
                  <span className="font-mono text-yellow-400">
                    {pinPrompt.targetRole === 'admin' && 'admin2026'}
                    {pinPrompt.targetRole === 'juri' && 'juri2026'}
                    {pinPrompt.targetRole === 'superadmin' && 'super2026'}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setPinPrompt({ isOpen: false, targetRole: null, pin: '', error: '' })}
                  className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-extrabold bg-red-700 hover:bg-red-600 text-white rounded-xl shadow-md shadow-red-950/50 transition-colors"
                >
                  Verifikasi & Masuk
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
