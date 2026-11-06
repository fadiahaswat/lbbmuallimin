import React, { useState, useMemo } from 'react';
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
  Building2,
  BookOpen,
  ShieldAlert,
  Coins,
  ChevronLeft,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen
} from 'lucide-react';
import { useCompetition } from '../../context/CompetitionContext.jsx';
import logoLbb from '../../assets/logo-tonti.png';
import logoTonti from '../../assets/logo-tonti-muallimin.png';
import logoMuallimin from '../../assets/logo-muallimin.png';
import titleLogoImg from '../../assets/title-logo.png';

export default function SimpaskorSidebarLayout({
  activeMenu = 'dashboard',
  title = 'Dashboard',
  subtitle = 'Ringkasan data dan informasi operasional lomba',
  rightActions = null,
  onSelectMenu = null,
  hideHeader = false,
  fullWidth = false,
  children
}) {
  const {
    currentUser,
    currentTeam,
    role,
    setActiveView,
    logoutUser,
    logoutTeam,
    navigateToStage,
    adminActiveTab,
    stagingActiveMode,
    stagingBasecampAction,
    canAccessStage,
    getUserAvatar
  } = useCompetition();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(() => {
    try {
      return localStorage.getItem('lbb_sidebar_collapsed') === 'true';
    } catch (e) {
      return false;
    }
  });

  const toggleSidebarCollapse = () => {
    setIsCollapsed(prev => {
      const next = !prev;
      try {
        localStorage.setItem('lbb_sidebar_collapsed', String(next));
      } catch (e) {
        // ignore
      }
      return next;
    });
  };

  const userRole = currentUser?.role || (currentTeam ? 'peserta' : (role || 'publik'));

  const avatarMeta = useMemo(() => {
    if (!currentUser && !currentTeam) return null;
    if (getUserAvatar) {
      return getUserAvatar(currentUser || { role: 'peserta', schoolName: currentTeam?.schoolName, teamId: currentTeam?.id });
    }
    return null;
  }, [currentUser, currentTeam, getUserAvatar]);

  const displayName = userRole === 'peserta'
    ? (currentUser?.schoolName || currentTeam?.schoolName || currentUser?.name || 'Peleton Peserta')
    : (currentUser?.name || 'Panitia LBB');

  const displaySubtitle = currentUser?.email || currentTeam?.email || (currentUser?.roleLabel || (userRole === 'peserta' ? 'Official Tim Peserta' : userRole));

  const isSchoolLogo = userRole === 'peserta' && (
    avatarMeta?.isSchoolLogo || Boolean(currentTeam?.files?.schoolLogo?.url && currentTeam.files.schoolLogo.url !== '#' && !currentTeam.files.schoolLogo.url.startsWith('#'))
  );

  const fallbackInitialAvatar = useMemo(() => {
    const bg = userRole === 'peserta' ? '8B0000' : '020617';
    const color = userRole === 'peserta' ? 'fff' : 'fbbf24';
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=${bg}&color=${color}&bold=true`;
  }, [userRole, displayName]);

  const avatarUrl = avatarMeta?.url || currentUser?.avatar || (isSchoolLogo ? currentTeam?.files?.schoolLogo?.url : null) || fallbackInitialAvatar;

  // Menu items disesuaikan dengan role
  const getNavItems = () => {
    // 1. Peserta
    if (userRole === 'peserta') {
      return [
        { id: 'overview', label: 'Beranda', icon: Home, view: 'peserta_dashboard' },
        { id: 'idcard', label: 'ID Card', icon: QrCode, view: 'peserta_dashboard' },
        { id: 'roster', label: 'Personel', icon: Users, view: 'peserta_dashboard' },
        { id: 'documents', label: 'Berkas', icon: FileText, view: 'peserta_dashboard' },
        { id: 'scores', label: 'Rekap', icon: Trophy, view: 'peserta_dashboard' },
      ];
    }

    // 2. Panitia: 9 Tahap Terpadu LBB Mu'allimin (Difilter ketat sesuai hak akses role akun)
    const baseNav = [
      { id: 'pendaftaran', label: 'Berkas', icon: ClipboardList, stage: 'pendaftaran' },
      { id: 'tm', label: 'Tech-Meet', icon: CalendarCheck, stage: 'tm' },
      { id: 'uji_coba', label: 'UCL', icon: Compass, stage: 'uji_coba' },
      { id: 'checkin', label: 'Basecamp', icon: Building2, stage: 'checkin' },
      { id: 'dp', label: 'DP', icon: Clock, stage: 'dp' },
      { id: 'penjurian', label: 'Penjurian', icon: Award, stage: 'penjurian' },
      { id: 'rekap_nilai', label: 'Rekap Nilai', icon: FileSpreadsheet, stage: 'rekap_nilai' },
      { id: 'klasemen', label: 'Klasemen', icon: Trophy, stage: 'klasemen' },
    ];

    if (canAccessStage) {
      return baseNav.filter(item => canAccessStage(item.stage, userRole));
    }

    return baseNav;
  };

  // Helper resolusi ikon modul untuk Standardized Header
  const getModuleIcon = (menuId) => {
    switch (menuId) {
      case 'pendaftaran':
      case 'admin':
        return ClipboardList;
      case 'tm':
        return CalendarCheck;
      case 'uji_coba':
        return Compass;
      case 'checkin':
      case 'checkout':
      case 'basecamp':
        return Building2;
      case 'dp':
        return Clock;
      case 'penjurian':
      case 'juri':
        return Award;
      case 'rekap_nilai':
      case 'recap':
        return FileSpreadsheet;
      case 'klasemen':
      case 'leaderboard':
        return Trophy;
      case 'dokumen':
      case 'juknis':
      case 'tatib':
      case 'rundown':
      case 'proposal':
      case 'timeline':
        return BookOpen;
      case 'superadmin':
        return Crown;
      case 'overview':
      case 'dashboard':
        return Home;
      default:
        return ShieldCheck;
    }
  };

  const saasDocItems = useMemo(() => {
    // Untuk peserta: Dokumen SaaS tidak perlu tampil di dasbor peserta
    if (userRole === 'peserta') {
      return [];
    }

    // Untuk Admin, Panitia, dan Superadmin: 1 Menu Tunggal Terpadu (Pusat Dokumen & Regulasi)
    return [
      { id: 'dokumen', label: 'Pusat Regulasi & Dokumen', icon: BookOpen, view: 'dokumen' },
    ];
  }, [userRole]);

  const navItems = getNavItems();

  const isItemActive = (item) => {
    if (activeMenu === item.id) return true;
    if ((activeMenu === 'checkin' || activeMenu === 'checkout') && item.id === 'checkin') return true;
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
    logoutUser();
  };


  return (
    <div className="min-h-screen bg-[#F8F9FA] text-slate-800 flex font-sans">
      {/* 1. DESKTOP SIDEBAR (Fixed Left, Clean SaaS Layout & Precision Aligned) */}
      <aside
        className={`hidden lg:flex flex-col bg-white border-r border-slate-200/80 fixed top-0 bottom-0 left-0 h-screen select-none shrink-0 z-30 shadow-[1px_0_12px_rgba(15,23,42,0.03)] transition-all duration-300 ${
          isCollapsed ? 'w-[72px]' : 'w-72'
        }`}
      >
        {/* Brand Header + Integrated Collapse Toggle */}
        <div
          className={`flex items-center shrink-0 border-b border-slate-100 ${
            isCollapsed ? 'flex-col gap-2 px-2 py-3 justify-center' : 'justify-between px-4 h-16'
          }`}
        >
          <div
            onClick={() => setActiveView('landing')}
            className={`flex items-center cursor-pointer group min-w-0 ${
              isCollapsed ? 'justify-center' : 'gap-2.5'
            }`}
            title="Ke Beranda Utama LBB Mu'allimin"
          >
            <img
              src={logoLbb}
              alt="Logo LBB Mu'allimin"
              className={`w-auto object-contain shrink-0 group-hover:scale-105 transition-transform ${
                isCollapsed ? 'h-8' : 'h-9'
              }`}
            />
            {!isCollapsed && (
              <img
                src={titleLogoImg}
                alt="LBB Mu'allimin 2027"
                className="h-7 w-auto max-w-[148px] object-contain"
              />
            )}
          </div>

          <button
            type="button"
            onClick={toggleSidebarCollapse}
            className="w-7 h-7 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center transition-colors shrink-0 cursor-pointer"
            title={isCollapsed ? 'Perbesar Menu Samping' : 'Kecilkan Menu Samping'}
            aria-label={isCollapsed ? 'Perbesar Menu' : 'Kecilkan Menu'}
          >
            {isCollapsed ? (
              <PanelLeftOpen className="w-4 h-4 text-slate-500" />
            ) : (
              <PanelLeftClose className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Navigation Content (Consistent vertical rhythm, scrollable if viewport is short) */}
        <div className={`flex-1 overflow-y-auto no-scrollbar py-3 flex flex-col gap-4 ${
          isCollapsed ? 'px-2' : 'px-3'
        }`}>
          {/* Section 1: Tahapan Lomba / Portal Peleton */}
          <div>
            {!isCollapsed && (
              <div className="px-2.5 mb-2 flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                  <span className="w-1 h-3 bg-red-600 rounded-full inline-block" />
                  {userRole === 'peserta' ? 'Portal Peleton' : 'Tahapan Lomba'}
                </span>
                <span className="text-[9px] font-bold tracking-wide text-slate-500 bg-slate-100 border border-slate-200/70 px-2 py-0.5 rounded-full">
                  {userRole === 'peserta' ? 'Official' : `${navItems.length} Tahap`}
                </span>
              </div>
            )}

            <div className="space-y-1">
              {navItems.map((item, index) => {
                const Icon = item.icon;
                const isActive = isItemActive(item);
                const stageNum = String(index + 1).padStart(2, '0');

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleNavClick(item)}
                    title={item.label}
                    className={`w-full flex items-center rounded-xl transition-all duration-150 cursor-pointer relative group ${
                      isCollapsed ? 'justify-center p-2' : 'justify-between px-2.5 py-2'
                    } ${
                      isActive
                        ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-sm shadow-red-600/20 font-bold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 font-semibold'
                    }`}
                  >
                    <div className={`flex items-center min-w-0 ${isCollapsed ? 'justify-center' : 'gap-3'}`}>
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-all duration-150 ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-slate-100 group-hover:bg-white group-hover:shadow-2xs text-slate-500 group-hover:text-red-600'
                      }`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      {!isCollapsed && (
                        <span className="text-[12.5px] tracking-tight truncate leading-snug">
                          {item.label}
                        </span>
                      )}
                    </div>

                    {!isCollapsed && (
                      <div className="flex items-center shrink-0 ml-2">
                        {isActive ? (
                          <span className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_6px_rgba(255,255,255,0.9)]" />
                        ) : (
                          <span className="text-[10px] font-mono font-semibold tabular-nums text-slate-400 group-hover:text-slate-600 transition-colors">
                            {stageNum}
                          </span>
                        )}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 2: Dokumen & Regulasi + Master System */}
          {(saasDocItems.length > 0 || userRole === 'superadmin') && (
            <div className={`pt-3 border-t border-slate-100 ${isCollapsed ? 'border-dashed' : ''}`}>
              {!isCollapsed && (
                <div className="px-2.5 mb-2 flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                    <span className="w-1 h-3 bg-slate-400 rounded-full inline-block" />
                    {userRole === 'superadmin' ? 'Regulasi & Sistem' : 'Dokumen & Regulasi'}
                  </span>
                </div>
              )}

              <div className="space-y-1">
                {saasDocItems.map(item => {
                  const Icon = item.icon;
                  const isActive = item.id === 'dokumen'
                    ? ['dokumen', 'juknis', 'tatib', 'rundown', 'proposal', 'timeline'].includes(activeMenu)
                    : activeMenu === item.id;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleNavClick(item)}
                      title={item.label}
                      className={`w-full flex items-center rounded-xl transition-all duration-150 cursor-pointer group ${
                        isCollapsed ? 'justify-center p-2' : 'justify-between px-2.5 py-2'
                      } ${
                        isActive
                          ? 'bg-slate-900 text-white shadow-sm font-bold'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 font-semibold'
                      }`}
                    >
                      <div className={`flex items-center min-w-0 ${isCollapsed ? 'justify-center' : 'gap-3'}`}>
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-all ${
                          isActive
                            ? 'bg-white/15 text-white'
                            : 'bg-slate-100 group-hover:bg-white group-hover:shadow-2xs text-slate-500 group-hover:text-slate-800'
                        }`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        {!isCollapsed && (
                          <span className="text-[12.5px] tracking-tight truncate leading-snug">
                            {item.label}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}

                {/* Master System (KHUSUS Superadmin Tertinggi: tontimuallimin2026@gmail.com) */}
                {userRole === 'superadmin' && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setActiveView('superadmin');
                    }}
                    title="Master System"
                    className={`w-full flex items-center rounded-xl transition-all duration-150 cursor-pointer group ${
                      isCollapsed ? 'justify-center p-2' : 'justify-between px-2.5 py-2'
                    } ${
                      activeMenu === 'superadmin'
                        ? 'bg-gradient-to-r from-purple-700 to-indigo-700 text-white shadow-sm shadow-purple-600/25 font-bold'
                        : 'text-slate-600 hover:text-purple-900 hover:bg-purple-50/70 font-semibold'
                    }`}
                  >
                    <div className={`flex items-center min-w-0 ${isCollapsed ? 'justify-center' : 'gap-3'}`}>
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-all ${
                        activeMenu === 'superadmin'
                          ? 'bg-white/20 text-white'
                          : 'bg-purple-100/80 group-hover:bg-purple-100 text-purple-700'
                      }`}>
                        <Crown className="w-4 h-4" />
                      </div>
                      {!isCollapsed && (
                        <span className="text-[12.5px] tracking-tight truncate leading-snug">
                          Master System
                        </span>
                      )}
                    </div>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Card & Quick Actions Footer */}
        <div className={`border-t border-slate-100 shrink-0 ${isCollapsed ? 'p-2' : 'p-3'}`}>
          <div className={`bg-slate-50/90 border border-slate-200/80 rounded-xl transition-all ${
            isCollapsed ? 'p-1.5 flex flex-col items-center gap-1.5' : 'p-2.5 flex items-center justify-between gap-2'
          }`}>
            {isCollapsed ? (
              <>
                <div className="relative flex items-center justify-center">
                  <img
                    src={avatarUrl}
                    alt={displayName}
                    className="w-8 h-8 rounded-lg object-cover ring-1 ring-slate-200 shadow-2xs"
                    title={`${displayName} (${displaySubtitle})`}
                  />
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white" />
                </div>
                <button
                  type="button"
                  onClick={() => setActiveView('landing')}
                  className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-500 hover:text-slate-900 hover:bg-white transition-all cursor-pointer"
                  title="Ke Beranda Depan"
                >
                  <Home className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all cursor-pointer"
                  title="Keluar (Logout)"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </>
            ) : (
              <>
                {/* User Info Left */}
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <div className="relative shrink-0">
                    <img
                      src={avatarUrl}
                      alt={displayName}
                      className={`w-9 h-9 rounded-xl shadow-2xs shrink-0 ${
                        isSchoolLogo
                          ? 'object-contain bg-white p-0.5 border border-slate-200'
                          : 'object-cover ring-1 ring-slate-200/90 bg-slate-900 text-[10px]'
                      }`}
                      loading="lazy"
                      decoding="async"
                      onError={(e) => {
                        if (currentUser?.googleAvatar && e.target.src !== currentUser.googleAvatar) {
                          e.target.src = currentUser.googleAvatar;
                        } else if (e.target.src !== fallbackInitialAvatar) {
                          e.target.src = fallbackInitialAvatar;
                        }
                      }}
                    />
                    <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white" title="Akun Aktif" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-bold text-slate-900 leading-snug truncate" title={displayName}>
                      {displayName}
                    </div>
                    <div className="text-[10.5px] text-slate-500 truncate leading-tight mt-0.5" title={displaySubtitle}>
                      {currentUser?.email || currentTeam?.email || (userRole === 'superadmin' ? 'Administrator' : userRole === 'peserta' ? 'Official Tim' : 'Panitia LBB')}
                    </div>
                  </div>
                </div>

                {/* Quick Action Icons Right */}
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => setActiveView('landing')}
                    className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-500 hover:text-slate-900 hover:bg-white border border-transparent hover:border-slate-200/80 transition-all cursor-pointer active:scale-95"
                    title="Kembali ke Beranda Utama"
                  >
                    <Home className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200/80 transition-all cursor-pointer active:scale-95"
                    title="Keluar dari akun ini"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              </>
            )}
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
          <div className="relative w-80 max-w-[86vw] bg-white h-full shadow-2xl flex flex-col p-4 sm:p-5 z-10 justify-between">
            <div className="flex flex-col min-h-0 flex-1 overflow-hidden">
              <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 mb-3 shrink-0">
                <div 
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setActiveView('landing');
                  }}
                  className="flex items-center gap-2 cursor-pointer min-w-0"
                  title="Ke Beranda Utama"
                >
                  <img src={logoLbb} alt="Logo LBB" className="h-8 w-8 object-contain shrink-0" />
                  <img src={titleLogoImg} alt="LBB Mu'allimin 2027" className="h-6 w-auto max-w-[130px] object-contain shrink-0" />
                </div>
                <button
                  type="button"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 shrink-0 cursor-pointer transition-colors"
                  aria-label="Tutup Menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-1 overflow-y-auto no-scrollbar flex-1 pb-2">
                <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-3 pt-1 mb-2 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <span className="w-1 h-3.5 bg-red-600 rounded-full inline-block" />
                    {userRole === 'peserta' ? 'Portal Peleton' : 'Tahapan Lomba'}
                  </span>
                  <span className="text-[9px] font-bold tracking-wider text-slate-500 bg-slate-100 border border-slate-200/60 px-2 py-0.5 rounded-full">
                    {userRole === 'peserta' ? 'Official' : `${navItems.length} Tahap`}
                  </span>
                </div>
                {navItems.map((item, index) => {
                  const Icon = item.icon;
                  const isActive = isItemActive(item);
                  const stageNum = String(index + 1).padStart(2, '0');

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleNavClick(item)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        isActive
                          ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-md shadow-red-500/25 font-black'
                          : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                          isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                        }`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="truncate">{item.label}</span>
                      </div>
                      <span className={`text-[10px] font-mono shrink-0 ml-2 ${
                        isActive ? 'text-white/90 font-bold' : 'text-slate-400'
                      }`}>
                        {stageNum}
                      </span>
                    </button>
                  );
                })}

                {/* Dokumen & Regulasi + Master System Mobile */}
                {(saasDocItems.length > 0 || userRole === 'superadmin') && (
                  <div className="pt-3 mt-2 border-t border-slate-100 space-y-1">
                    <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-3 mb-1.5 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <span className="w-1 h-3 bg-slate-400 rounded-full inline-block" />
                        {userRole === 'superadmin' ? 'Regulasi & Sistem' : 'Dokumen & Regulasi'}
                      </span>
                    </div>
                    {saasDocItems.map(item => {
                      const Icon = item.icon;
                      const isActive = item.id === 'dokumen'
                        ? ['dokumen', 'juknis', 'tatib', 'rundown', 'proposal', 'timeline'].includes(activeMenu)
                        : activeMenu === item.id;

                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => handleNavClick(item)}
                          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            isActive
                              ? 'bg-slate-900 text-white shadow-md font-black'
                              : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                              isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                            }`}>
                              <Icon className="w-4 h-4" />
                            </div>
                            <span className="truncate">{item.label}</span>
                          </div>
                        </button>
                      );
                    })}

                    {/* Master System (KHUSUS Superadmin Tertinggi: tontimuallimin2026@gmail.com) */}
                    {userRole === 'superadmin' && (
                      <button
                        type="button"
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          setActiveView('superadmin');
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          activeMenu === 'superadmin'
                            ? 'bg-gradient-to-r from-purple-700 to-indigo-700 text-white shadow-md shadow-purple-600/30 font-black'
                            : 'text-slate-600 hover:text-purple-950 hover:bg-purple-50/70'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                            activeMenu === 'superadmin' ? 'bg-white/20 text-white' : 'bg-purple-100 text-purple-700'
                          }`}>
                            <Crown className="w-4 h-4" />
                          </div>
                          <span className="truncate">Master System</span>
                        </div>
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Footer: User Card + Split Actions */}
            <div className="pt-3 border-t border-slate-100 shrink-0">
              <div className="p-2.5 bg-gradient-to-br from-slate-50 to-slate-100/90 border border-slate-200/90 rounded-2xl mb-2.5">
                <div className="flex items-start gap-2.5 min-w-0">
                  <div className="relative shrink-0 flex items-center justify-center">
                    <img
                      src={avatarUrl}
                      alt={displayName}
                      className={`w-9 h-9 rounded-xl shadow-xs ${
                        isSchoolLogo 
                          ? 'object-contain bg-white p-0.5 border border-slate-200' 
                          : 'object-cover ring-1 ring-slate-200/80 bg-slate-900 text-[10px]'
                      }`}
                      loading="lazy"
                      decoding="async"
                      onError={(e) => {
                        if (currentUser?.googleAvatar && e.target.src !== currentUser.googleAvatar) {
                          e.target.src = currentUser.googleAvatar;
                        } else if (e.target.src !== fallbackInitialAvatar) {
                          e.target.src = fallbackInitialAvatar;
                        }
                      }}
                    />
                    <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white shadow-xs" title="Online" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-xs font-black text-slate-900 leading-tight truncate">
                        {displayName}
                      </span>
                      <span className={`text-[8px] font-black px-1.5 py-0.5 rounded-md uppercase tracking-wide shrink-0 ${
                        userRole === 'superadmin'
                          ? 'bg-purple-100 text-purple-700'
                          : userRole === 'peserta'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}>
                        {userRole === 'superadmin' ? 'Admin' : userRole === 'peserta' ? 'Official' : 'Panitia'}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono truncate mt-0.5">
                      {currentUser?.email || currentTeam?.email || displaySubtitle}
                    </div>
                  </div>
                </div>

                {/* Split Action Buttons: Beranda & Keluar */}
                <div className="grid grid-cols-2 gap-1.5 pt-2 mt-2 border-t border-slate-200/60">
                  <button
                    type="button"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setActiveView('landing');
                    }}
                    className="flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200/80 text-slate-700 text-[11px] font-bold transition-all cursor-pointer shadow-2xs active:scale-95"
                  >
                    <Home className="w-3.5 h-3.5 text-slate-500" />
                    <span>Beranda</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      handleLogout();
                    }}
                    className="flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl bg-white hover:bg-red-50 border border-slate-200/80 hover:border-red-200 text-slate-600 hover:text-red-700 text-[11px] font-bold transition-all cursor-pointer shadow-2xs active:scale-95"
                  >
                    <LogOut className="w-3.5 h-3.5 text-slate-400" />
                    <span>Keluar</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. MAIN CONTENT AREA (Offset dinamis: lg:pl-[72px] saat collapsed, lg:pl-72 saat expanded) */}
      <div className={`flex-1 flex flex-col min-w-0 pb-20 lg:pb-8 transition-all duration-300 ${
        isCollapsed ? 'lg:pl-[72px]' : 'lg:pl-72'
      }`}>
        {/* Mobile-only Header Bar (Branding & Menu Toggle) */}
        <div className="lg:hidden px-3 sm:px-4 py-2.5 sm:py-3 bg-white/90 backdrop-blur-md border-b border-slate-200/70 flex items-center justify-between sticky top-0 z-20">
          {/* Sisi Kiri: Tombol Menu Garis Tiga (Hamburger) + Logo Branding */}
          <div className="flex items-center gap-2.5 min-w-0">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 active:scale-95 transition-all flex items-center justify-center border border-slate-200/70 bg-slate-50/80 shrink-0 cursor-pointer"
              aria-label="Buka Menu"
              title="Buka Menu"
            >
              <Menu className="w-5 h-5 text-slate-800" />
            </button>

            {/* Mobile Branding: logo lbb + logo title */}
            <div 
              onClick={() => setActiveView('landing')}
              className="flex items-center gap-2 cursor-pointer min-w-0"
              title="Ke Beranda Utama"
            >
              <img
                src={logoLbb}
                alt="Logo LBB"
                className="h-8 w-auto object-contain shrink-0"
              />
              <img
                src={titleLogoImg}
                alt="LBB Mu'allimin"
                className="h-6 w-auto object-contain max-w-[125px]"
              />
            </div>
          </div>

          {/* Sisi Kanan: Tombol Logout */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleLogout}
              className="p-2 rounded-xl text-slate-500 hover:text-red-600 hover:bg-red-50 active:scale-95 transition-all flex items-center justify-center border border-slate-200/70 bg-slate-50/80 cursor-pointer"
              title="Keluar (Logout)"
              aria-label="Keluar (Logout)"
            >
              <LogOut className="w-4 h-4 text-slate-600 hover:text-red-600" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <main className={`p-3 sm:p-5 lg:p-6 w-full mx-auto transition-all duration-300 ${
          fullWidth ? 'max-w-none' : (isCollapsed ? 'max-w-[1700px]' : 'max-w-7xl')
        }`}>
          {/* ======================================================== */}
          {/* STANDARDIZED EXECUTIVE COMMAND HEADER (IDENTIK DI SEMUA HALAMAN) */}
          {/* Grafis Resmi title-logo.png + Icon Modul + Judul + Aksi Cepat */}
          {/* ======================================================== */}
          {!hideHeader && (
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.04)] mb-4 sm:mb-6 overflow-hidden">
              <div className="px-4 py-3 sm:px-6 sm:py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4 bg-slate-50/50">
                <div className="flex items-center gap-3 sm:gap-4 flex-wrap min-w-0">
                  {/* 1. Icon Modul */}
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0 font-bold shadow-sm">
                    {React.createElement(getModuleIcon(activeMenu), { className: "w-4 h-4 sm:w-5 sm:h-5 text-amber-400" })}
                  </div>

                  {/* 2. Logo Title Grafis Resmi (UI yang diminta user) */}
                  <img
                    src={titleLogoImg}
                    alt="LBB Mu'allimin 2027"
                    className="h-6 sm:h-8 w-auto object-contain shrink-0"
                  />

                  {/* 3. Pemisah Halus Vertikal */}
                  <div className="hidden sm:block h-6 w-px bg-slate-300/80 shrink-0" />

                  {/* 4. Judul & Subtitle Halaman */}
                  <div className="min-w-0 flex-1">
                    <h1 className="text-sm sm:text-base md:text-lg font-black text-slate-900 tracking-tight leading-tight">
                      {title}
                    </h1>
                    {subtitle && (
                      <p className="text-[10px] sm:text-xs text-slate-500 font-medium line-clamp-2 sm:truncate max-w-xl mt-0.5 sm:mt-1">
                        {subtitle}
                      </p>
                    )}
                  </div>
                </div>

                {/* 5. Quick Action Buttons (Sisi Kanan) */}
                {rightActions && (
                  <div className="flex items-center gap-2 shrink-0 self-start md:self-center">
                    {rightActions}
                  </div>
                )}
              </div>
            </div>
          )}

          {children}
        </main>
      </div>

      {/* 4. MOBILE BOTTOM NAVIGATION BAR (ala Simpaskor & Modern Apps) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-slate-200 px-1 py-1.5 z-40 flex items-center justify-around shadow-lg safe-area-pb">
        {navItems.slice(0, 5).map(item => {
          const Icon = item.icon;
          const isActive = isItemActive(item);
          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item)}
              className={`flex flex-col items-center gap-0.5 px-1 sm:px-2.5 py-1 rounded-xl transition-all min-w-0 flex-1 ${
                isActive ? 'text-red-600 font-black' : 'text-slate-400 hover:text-slate-700 font-medium'
              }`}
            >
              <Icon className="w-4.5 h-4.5 shrink-0" />
              <span className="text-[9.5px] leading-tight truncate max-w-[62px] text-center">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
