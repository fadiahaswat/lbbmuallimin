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

  const saasDocItems = useMemo(() => {
    // Untuk peserta: HANYA tampilkan Juknis dan Tata Tertib
    // Sembunyikan Proposal Internal, RAB & Keuangan, serta Timeline Panitia
    if (userRole === 'peserta') {
      return [
        { id: 'juknis', label: 'Juknis & Materi PBB', icon: BookOpen, view: 'juknis' },
        { id: 'tatib', label: 'Tata Tertib & Sanksi', icon: ShieldAlert, view: 'tatib' },
      ];
    }

    // Untuk Admin, Panitia, dan Superadmin: Tampilkan semua dokumen SaaS
    return [
      { id: 'proposal', label: 'Proposal Resmi', icon: FileText, view: 'proposal' },
      { id: 'juknis', label: 'Juknis & Materi PBB', icon: BookOpen, view: 'juknis' },
      { id: 'tatib', label: 'Tata Tertib & Sanksi', icon: ShieldAlert, view: 'tatib' },
      { id: 'rab', label: 'RAB & Keuangan LBB', icon: Coins, view: 'rab' },
      { id: 'timeline', label: 'Timeline Panitia', icon: Calendar, view: 'timeline' },
    ];
  }, [userRole]);

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
    logoutUser();
  };


  return (
    <div className="min-h-screen bg-[#F8F9FA] text-slate-800 flex font-sans">
      {/* 1. DESKTOP SIDEBAR (Fixed Left, Full 100vh, Sleek & Professional with Collapse support) */}
      <aside 
        className={`hidden lg:flex flex-col bg-white border-r border-slate-200/90 fixed top-0 bottom-0 left-0 h-screen select-none shrink-0 z-30 justify-between shadow-[1px_0_12px_rgba(0,0,0,0.03)] transition-all duration-300 ${
          isCollapsed ? 'w-20 px-2.5 py-4' : 'w-72 px-4 py-5'
        }`}
      >
        {/* Toggle Collapse Button (Posisi kanan atas sidebar) */}
        <button
          type="button"
          onClick={toggleSidebarCollapse}
          className="absolute -right-3.5 top-6 w-7 h-7 bg-white border border-slate-200 rounded-full shadow-md flex items-center justify-center text-slate-500 hover:text-slate-900 hover:scale-110 active:scale-95 transition-all z-40 cursor-pointer"
          title={isCollapsed ? 'Perbesar Menu Samping' : 'Kecilkan Menu Samping (Collapse)'}
          aria-label={isCollapsed ? 'Perbesar Menu' : 'Kecilkan Menu'}
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4 text-purple-600" />
          ) : (
            <ChevronLeft className="w-4 h-4 text-slate-600" />
          )}
        </button>

        <div className="flex flex-col min-h-0 flex-1 overflow-hidden">
          {/* Brand Header: Logo LBB & title-logo */}
          <div 
            onClick={() => setActiveView('landing')}
            className={`flex items-center rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-100 cursor-pointer group transition-all duration-200 shrink-0 mb-4 ${
              isCollapsed ? 'justify-center py-2 px-1' : 'justify-center py-2.5 px-3'
            }`}
            title="Ke Beranda Utama LBB Mu'allimin"
          >
            <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-2.5'}`}>
              <img
                src={logoLbb}
                alt="Logo LBB Mu'allimin"
                className={`w-auto object-contain filter drop-shadow-sm group-hover:scale-105 transition-transform shrink-0 ${
                  isCollapsed ? 'h-9' : 'h-10'
                }`}
              />
              {!isCollapsed && (
                <img
                  src={titleLogoImg}
                  alt="LBB Mu'allimin"
                  className="h-8 w-auto object-contain max-w-[150px]"
                />
              )}
            </div>
          </div>

          {/* Navigation Items (Scrollable jika layar pendek) */}
          <div className="flex-1 space-y-1.5 overflow-y-auto pr-1 pb-2">
            {!isCollapsed && (
              <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-3 pt-1 mb-2">
                <span>9 Tahap Lomba</span>
              </div>
            )}
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = isItemActive(item);

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavClick(item)}
                  title={item.label}
                  className={`w-full flex items-center rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isCollapsed ? 'justify-center p-2.5' : 'justify-between px-3.5 py-2.5'
                  } ${
                    isActive
                      ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-sm shadow-red-600/30'
                      : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100/80'
                  }`}
                >
                  <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'}`}>
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    {!isCollapsed && <span>{item.label}</span>}
                  </div>
                  {!isCollapsed && isActive && <div className="w-1.5 h-1.5 rounded-full bg-white shadow-xs" />}
                </button>
              );
            })}

            {/* Dokumen & Regulasi SaaS */}
            <div className={`pt-4 mt-3 border-t border-slate-100 ${isCollapsed ? 'border-dashed' : ''}`}>
              {!isCollapsed && (
                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-3 mb-2 flex items-center justify-between">
                  <span>Dokumen SaaS</span>
                  <span className="text-[9px] bg-red-50 text-red-700 border border-red-200/50 px-2 py-0.5 rounded-full font-bold">Resmi</span>
                </div>
              )}
              <div className="space-y-1">
                {saasDocItems.map(item => {
                  const Icon = item.icon;
                  const isActive = activeMenu === item.id;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleNavClick(item)}
                      title={item.label}
                      className={`w-full flex items-center rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        isCollapsed ? 'justify-center p-2.5' : 'justify-between px-3.5 py-2.5'
                      } ${
                        isActive
                          ? 'bg-slate-900 text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100/80'
                      }`}
                    >
                      <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'}`}>
                        <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                        {!isCollapsed && <span>{item.label}</span>}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Master System (KHUSUS Superadmin Tertinggi: tontimuallimin2026@gmail.com) */}
            {userRole === 'superadmin' && (
              <div className={`pt-3 mt-3 border-t border-slate-100 ${isCollapsed ? 'border-dashed' : ''}`}>
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setActiveView('superadmin');
                  }}
                  title="Master System"
                  className={`w-full flex items-center rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isCollapsed ? 'justify-center p-2.5' : 'justify-between px-3.5 py-2.5'
                  } ${
                    activeMenu === 'superadmin'
                      ? 'bg-purple-600 text-white shadow-sm shadow-purple-600/30'
                      : 'text-slate-500 hover:text-slate-950 hover:bg-slate-100/80'
                  }`}
                >
                  <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'}`}>
                    <Crown className={`w-4 h-4 shrink-0 ${activeMenu === 'superadmin' ? 'text-white' : 'text-purple-600'}`} />
                    {!isCollapsed && <span>Master System</span>}
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* User Card & Logout di Footer Sidebar (Paling Bawah) */}
        <div className="pt-4 border-t border-slate-100 mt-auto shrink-0">
          <div className={`bg-slate-50/90 border border-slate-200/80 rounded-2xl flex items-center justify-between shadow-xs ${
            isCollapsed ? 'p-2 flex-col gap-2' : 'p-3 gap-3'
          }`}>
            <div className={`flex items-center min-w-0 ${isCollapsed ? 'justify-center' : 'gap-3'}`}>
              <div className="relative shrink-0 flex items-center justify-center">
                <img
                  src={avatarUrl}
                  alt={displayName}
                  className={`rounded-xl shadow-xs ${
                    isCollapsed ? 'w-8 h-8' : 'w-9 h-9'
                  } ${
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
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white" title="Online" />
              </div>
              {!isCollapsed && (
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-black text-slate-900 leading-tight truncate" title={displayName}>
                    {displayName}
                  </div>
                  <div className="text-[10px] text-slate-400 font-medium leading-tight truncate mt-1" title={displaySubtitle}>
                    {displaySubtitle}
                  </div>
                </div>
              )}
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
                <div className="flex items-center gap-2.5 min-w-0">
                  <img src={logoLbb} alt="Logo" className="h-8 w-auto object-contain shrink-0" />
                  <img src={titleLogoImg} alt="LBB Mu'allimin" className="h-6 w-auto object-contain max-w-[120px]" />
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1.5 rounded-xl text-slate-400 hover:bg-slate-100 shrink-0"
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
                    <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white" title="Online" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-black text-slate-900 leading-tight truncate">
                      {displayName}
                    </div>
                    <div className="text-[10px] text-slate-400 font-medium leading-tight truncate mt-0.5">
                      {displaySubtitle}
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

      {/* 3. MAIN CONTENT AREA (Offset dinamis: lg:pl-20 saat collapsed, lg:pl-72 saat expanded) */}
      <div className={`flex-1 flex flex-col min-w-0 pb-20 lg:pb-8 transition-all duration-300 ${
        isCollapsed ? 'lg:pl-20' : 'lg:pl-72'
      }`}>
        {/* Mobile-only Header Bar (Branding & Menu Toggle) */}
        <div className="lg:hidden px-4 py-3 bg-white/90 backdrop-blur-md border-b border-slate-200/70 flex items-center justify-between sticky top-0 z-20">
          {/* Mobile Branding: logo lbb + logo title di kiri */}
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

          {/* Menu Strip 3 Paling Kanan */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setActiveView('landing')}
              className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 active:scale-95 transition-all flex items-center justify-center border border-slate-200/70 bg-slate-50/80"
              title="Ke Beranda"
              aria-label="Ke Beranda"
            >
              <Home className="w-4 h-4 text-slate-700" />
            </button>
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 active:scale-95 transition-all flex items-center justify-center border border-slate-200/70 bg-slate-50/80"
              aria-label="Buka Menu"
              title="Buka Menu"
            >
              <Menu className="w-5 h-5 text-slate-800" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <main className={`p-4 sm:p-6 lg:p-8 w-full mx-auto transition-all duration-300 ${
          isCollapsed ? 'max-w-[1700px]' : 'max-w-7xl'
        }`}>
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
