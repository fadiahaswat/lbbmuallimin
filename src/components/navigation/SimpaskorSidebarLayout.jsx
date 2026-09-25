import React, { useState } from 'react';
import {
  Home,
  Shield,
  ShieldCheck,
  Award,
  Users,
  Trophy,
  Crown,
  Settings,
  LogOut,
  QrCode,
  FileSpreadsheet,
  FileText,
  Clock,
  Menu,
  X,
  Bell,
  Search,
  CheckCircle2,
  Calendar,
  Sparkles,
  ClipboardList,
  CalendarCheck,
  Compass,
  LogIn,
  BookOpen,
  ShieldAlert,
  Coins,
} from 'lucide-react';
import { useCompetition } from '../../context/CompetitionContext.jsx';
import logoLbb from '../../assets/logo-tonti.png';
import logoTonti from '../../assets/logo-tonti-muallimin.png';
import logoMuallimin from '../../assets/logo-muallimin.png';

export default function SimpaskorSidebarLayout({
  activeMenu = 'dashboard',
  title = 'Dashboard',
  subtitle = 'Ringkasan data dan informasi operasional lomba',
  rightActions = null,
  onSelectMenu = null,
  children
}) {
  const {
    currentUser,
    role,
    setActiveView,
    logoutTeam,
    navigateToStage,
    adminActiveTab,
    stagingActiveMode,
    stagingBasecampAction,
    canAccessStage,
    getUserAvatar
  } = useCompetition();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const userRole = currentUser?.role || role || 'publik';

  const avatarMeta = currentUser && getUserAvatar ? getUserAvatar(currentUser) : null;
  const avatarUrl = avatarMeta?.url || currentUser?.avatar;
  const isSchoolLogo = avatarMeta?.isSchoolLogo;

  // Menu items disesuaikan dengan role
  const getNavItems = () => {
    // 1. Peserta
    if (userRole === 'peserta') {
      return [
        { id: 'overview', label: 'Dashboard', icon: Home, view: 'peserta_dashboard' },
        { id: 'idcard', label: 'ID Card & QR', icon: QrCode, view: 'peserta_dashboard' },
        { id: 'roster', label: '25 Personel', icon: Users, view: 'peserta_dashboard' },
        { id: 'documents', label: 'Berkas Tim', icon: FileText, view: 'peserta_dashboard' },
        { id: 'scores', label: 'Hasil Nilai', icon: Trophy, view: 'peserta_dashboard' },
      ];
    }

    // 2. Panitia: 9 Tahap Terpadu LBB Mu'allimin (Difilter ketat sesuai hak akses role akun)
    const baseNav = [
      { id: 'pendaftaran', label: 'Pendaftaran', icon: ClipboardList, stage: 'pendaftaran' },
      { id: 'tm', label: 'Technical Meeting', icon: CalendarCheck, stage: 'tm' },
      { id: 'uji_coba', label: 'Uji Coba Lapangan', icon: Compass, stage: 'uji_coba' },
      { id: 'checkin', label: 'Check-In', icon: LogIn, stage: 'checkin' },
      { id: 'dp', label: 'Daerah Persiapan', icon: Clock, stage: 'dp' },
      { id: 'penjurian', label: 'Penjurian', icon: Award, stage: 'penjurian' },
      { id: 'rekap_nilai', label: 'Rekap Nilai', icon: FileSpreadsheet, stage: 'rekap_nilai' },
      { id: 'klasemen', label: 'Klasemen', icon: Trophy, stage: 'klasemen' },
      { id: 'checkout', label: 'Check-Out', icon: LogOut, stage: 'checkout' },
    ];

    if (canAccessStage) {
      return baseNav.filter(item => canAccessStage(item.stage, userRole));
    }

    return baseNav;
  };

  const saasDocItems = [
    { id: 'proposal', label: 'Proposal Resmi', icon: FileText, view: 'proposal' },
    { id: 'juknis', label: 'Juknis & Materi PBB', icon: BookOpen, view: 'juknis' },
    { id: 'tatib', label: 'Tata Tertib & Sanksi', icon: ShieldAlert, view: 'tatib' },
    { id: 'rab', label: 'RAB & Keuangan LBB', icon: Coins, view: 'rab' },
    { id: 'timeline', label: 'Timeline Panitia', icon: Calendar, view: 'timeline' },
  ];

  const navItems = getNavItems();

  const isItemActive = (item) => {
    if (activeMenu === item.id) return true;
    if (userRole === 'peserta') return false;

    // Map legacy / contextual activeMenu
    if (activeMenu === 'admin') {
      if (adminActiveTab === 'lottery') return item.id === 'tm';
      if (adminActiveTab === 'recap') return item.id === 'rekap_nilai';
      return item.id === 'pendaftaran';
    }
    if (activeMenu === 'staging') {
      if (stagingActiveMode === 'basecamp') {
        return stagingBasecampAction === 'checkout' ? item.id === 'checkout' : item.id === 'checkin';
      }
      return item.id === 'dp';
    }
    if (activeMenu === 'juri') return item.id === 'penjurian';
    if (activeMenu === 'leaderboard') return item.id === 'klasemen';
    return false;
  };

  const handleNavClick = (item) => {
    setIsMobileMenuOpen(false);
    if (onSelectMenu && userRole === 'peserta' && item.view === 'peserta_dashboard') {
      onSelectMenu(item.id);
      return;
    }
    if (item.stage && navigateToStage) {
      navigateToStage(item.stage);
    } else if (item.view) {
      setActiveView(item.view);
    }
  };

  const handleLogout = () => {
    if (userRole === 'peserta') {
      logoutTeam();
    } else {
      setActiveView('landing');
    }
  };


  return (
    <div className="min-h-screen bg-[#F8F9FA] text-slate-800 flex font-sans">
      {/* 1. DESKTOP SIDEBAR (Fixed Left, Full 100vh, Sleek & Professional) */}
      <aside className="hidden lg:flex flex-col w-72 bg-white border-r border-slate-200/90 px-4 py-5 fixed top-0 bottom-0 left-0 h-screen select-none shrink-0 z-30 justify-between shadow-[1px_0_12px_rgba(0,0,0,0.03)]">
        <div className="flex flex-col min-h-0 flex-1 overflow-hidden">
          {/* Brand Header: Logo LBB & Logo Mu'allimin */}
          <div 
            onClick={() => setActiveView('landing')}
            className="flex items-center justify-center py-2.5 px-3 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-100 cursor-pointer group transition-all duration-200 shrink-0 mb-4"
            title="Ke Beranda Utama LBB Mu'allimin"
          >
            <div className="flex items-center gap-3.5">
              <img
                src={logoLbb}
                alt="Logo LBB Mu'allimin"
                className="h-10 w-auto object-contain filter drop-shadow-sm group-hover:scale-105 transition-transform"
              />
              <div className="h-7 w-px bg-slate-200/90" />
              <img
                src={logoMuallimin}
                alt="Logo Madrasah Mu'allimin"
                className="h-8 w-auto object-contain opacity-95 group-hover:opacity-100 transition-opacity"
              />
            </div>
          </div>

          {/* Official Role Identity Badge (Compact & Professional) */}
          <div className="mb-4 px-0.5">
            <div className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-slate-50/90 border border-slate-200/80 hover:border-slate-300 transition-colors shadow-2xs">
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="relative flex h-2 w-2 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-xs font-bold text-slate-800 truncate leading-none">
                  {currentUser?.roleLabel || (currentUser?.role ? currentUser.role.toUpperCase() : 'Publik')}
                </span>
              </div>
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 ml-1.5" title="Akun Terverifikasi" />
            </div>
          </div>

          {/* Navigation Items (Scrollable jika layar pendek) */}
          <div className="flex-1 space-y-1.5 overflow-y-auto pr-1 pb-2">
            <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-3 pt-1 mb-2 flex items-center justify-between">
              <span>9 Tahap Lomba</span>
              <span className="text-[9px] text-slate-400 font-bold bg-slate-100 px-1.5 py-0.5 rounded">
                SIMPASKOR
              </span>
            </div>
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = isItemActive(item);

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavClick(item)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-sm shadow-red-600/30'
                      : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100/80'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {isActive && <div className="w-1.5 h-1.5 rounded-full bg-white shadow-xs" />}
                </button>
              );
            })}

            {/* Dokumen & Regulasi SaaS */}
            <div className="pt-4 mt-3 border-t border-slate-100">
              <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-3 mb-2 flex items-center justify-between">
                <span>Dokumen SaaS</span>
                <span className="text-[9px] bg-red-50 text-red-700 border border-red-200/50 px-2 py-0.5 rounded-full font-bold">Resmi</span>
              </div>
              <div className="space-y-1">
                {saasDocItems.map(item => {
                  const Icon = item.icon;
                  const isActive = activeMenu === item.id;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleNavClick(item)}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        isActive
                          ? 'bg-slate-900 text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100/80'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                        <span>{item.label}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Master System (KHUSUS Superadmin Tertinggi: tontimuallimin2026@gmail.com) */}
            {userRole === 'superadmin' && (
              <div className="pt-3 mt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setActiveView('superadmin');
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeMenu === 'superadmin'
                      ? 'bg-purple-600 text-white shadow-sm shadow-purple-600/30'
                      : 'text-slate-500 hover:text-slate-950 hover:bg-slate-100/80'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Crown className={`w-4 h-4 ${activeMenu === 'superadmin' ? 'text-white' : 'text-purple-600'}`} />
                    <span>Master System</span>
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* User Card & Logout di Footer Sidebar (Paling Bawah) */}
        <div className="pt-4 border-t border-slate-100 mt-auto shrink-0">
          <div className="p-3 bg-slate-50/90 border border-slate-200/80 rounded-2xl flex items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative shrink-0">
                <img
                  src={avatarUrl}
                  alt={currentUser?.name || 'User'}
                  className={`w-9 h-9 rounded-xl shadow-xs ${
                    isSchoolLogo ? 'object-contain bg-white p-0.5 border border-slate-200' : 'object-cover ring-1 ring-slate-200'
                  }`}
                  onError={(e) => {
                    if (currentUser?.googleAvatar) {
                      e.target.src = currentUser.googleAvatar;
                    } else {
                      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser?.name || 'User')}&background=020617&color=fbbf24&bold=true`;
                    }
                  }}
                />
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white" title="Online" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-black text-slate-900 leading-tight truncate" title={currentUser?.name || currentUser?.schoolName || 'Panitia LBB'}>
                  {currentUser?.role === 'peserta' ? (currentUser.schoolName || currentUser.name) : (currentUser?.name || 'Panitia LBB')}
                </div>
                <div className="text-[10px] text-slate-400 font-medium leading-tight truncate mt-1" title={currentUser?.email || ''}>
                  {currentUser?.email || (currentUser?.roleLabel || userRole)}
                </div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50/80 transition-colors shrink-0"
              title="Keluar / Ganti Akun"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* 2. MOBILE DRAWER OVERLAY */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div 
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity"
          />
          <div className="relative w-72 max-w-[85vw] bg-white h-full shadow-2xl flex flex-col p-5 z-10 justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
                <div className="flex items-center gap-3">
                  <img src={logoLbb} alt="Logo" className="h-8 w-auto object-contain" />
                  <span className="text-xs font-black uppercase text-slate-800 tracking-wider">Menu LBB</span>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1.5 rounded-xl text-slate-400 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-1 overflow-y-auto max-h-[70vh]">
                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-3 mb-2">
                  Menu Utama
                </div>
                {navItems.map(item => {
                  const Icon = item.icon;
                  const isActive = isItemActive(item);

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleNavClick(item)}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                        isActive
                          ? 'bg-red-600 text-white shadow-lg shadow-red-600/30'
                          : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                        <span>{item.label}</span>
                      </div>
                    </button>
                  );
                })}

                {/* Dokumen & Regulasi SaaS Mobile */}
                <div className="pt-3 mt-2 border-t border-slate-100">
                  <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-3 mb-1.5 flex items-center justify-between">
                    <span>Dokumen SaaS</span>
                    <span className="text-[9px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded-full font-bold">Resmi</span>
                  </div>
                  {saasDocItems.map(item => {
                    const Icon = item.icon;
                    const isActive = activeMenu === item.id;

                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleNavClick(item)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          isActive
                            ? 'bg-slate-900 text-white shadow-md'
                            : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                          <span>{item.label}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Master System (KHUSUS Superadmin Tertinggi: tontimuallimin2026@gmail.com) */}
                {userRole === 'superadmin' && (
                  <div className="pt-2 mt-2 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        setActiveView('superadmin');
                      }}
                      className={`w-full flex items-center justify-between px-3.5 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                        activeMenu === 'superadmin'
                          ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                          : 'text-slate-500 hover:text-slate-950 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Crown className={`w-4 h-4 ${activeMenu === 'superadmin' ? 'text-white' : 'text-purple-600'}`} />
                        <span>Master System</span>
                      </div>
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100">
              <div className="p-2.5 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-center justify-between gap-2.5 mb-2.5">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="relative shrink-0">
                    <img
                      src={avatarUrl}
                      alt={currentUser?.name || 'User'}
                      className={`w-9 h-9 rounded-xl shadow-xs ${
                        isSchoolLogo ? 'object-contain bg-white p-0.5 border border-slate-200' : 'object-cover ring-1 ring-slate-200'
                      }`}
                      onError={(e) => {
                        if (currentUser?.googleAvatar) {
                          e.target.src = currentUser.googleAvatar;
                        } else {
                          e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser?.name || 'User')}&background=020617&color=fbbf24&bold=true`;
                        }
                      }}
                    />
                    <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white" title="Online" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-black text-slate-900 leading-tight truncate">
                      {currentUser?.role === 'peserta' ? (currentUser.schoolName || currentUser.name) : (currentUser?.name || 'Panitia LBB')}
                    </div>
                    <div className="text-[10px] text-slate-400 font-medium leading-tight truncate mt-0.5">
                      {currentUser?.email || (currentUser?.roleLabel || userRole)}
                    </div>
                  </div>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 p-2.5 rounded-xl bg-slate-100 hover:bg-red-50 text-slate-700 hover:text-red-700 text-xs font-bold transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>{userRole === 'peserta' ? 'Keluar Akun' : 'Ke Beranda Depan'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. MAIN CONTENT AREA (Offset lg:pl-72 untuk fixed sidebar w-72) */}
      <div className="flex-1 flex flex-col min-w-0 pb-20 lg:pb-8 lg:pl-72">
        {/* Top Header Bar */}
        <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/70 px-4 sm:px-8 py-3.5 sticky top-0 z-20 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div>
              <h1 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">{title}</h1>
              <p className="text-xs text-slate-500 hidden sm:block">{subtitle}</p>
            </div>
          </div>

          {/* Right Area (Notification, Date, Actions) */}
          <div className="flex items-center gap-3">
            {rightActions}

            <button
              onClick={() => setActiveView('landing')}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all flex items-center gap-1.5"
            >
              <Home className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Beranda</span>
            </button>
          </div>
        </header>

        {/* Content Body */}
        <main className="p-4 sm:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

      {/* 4. MOBILE BOTTOM NAVIGATION BAR (ala Simpaskor & Modern Apps) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-slate-200 p-2 z-40 flex items-center justify-around shadow-lg">
        {navItems.slice(0, 5).map(item => {
          const Icon = item.icon;
          const isActive = isItemActive(item);
          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item)}
              className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all ${
                isActive ? 'text-red-600 font-black' : 'text-slate-400 hover:text-slate-700 font-medium'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] leading-tight">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
