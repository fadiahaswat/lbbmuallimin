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
  PanelLeftOpen,
  MoreVertical,
  Scale,
  Download
} from 'lucide-react';
import { useCompetition } from '../../context/CompetitionContext.jsx';
import { formatImageUrl, getFallbackImageUrl } from '../../services/sheetService.js';
import logoLbb from '../../assets/logo-tonti.png';
import logoTonti from '../../assets/logo-tonti-muallimin.png';
import logoMuallimin from '../../assets/logo-muallimin.png';
import titleLogoImg from '../../assets/title-logo.png';

export default function SimpaskorSidebarLayout({
  activeMenu = 'dashboard',
  title = 'Dashboard',
  subtitle = 'Ringkasan data dan informasi operasional lomba',
  currentTeam: propCurrentTeam = null,
  rightActions = null,
  onSelectMenu = null,
  hideHeader = false,
  fullWidth = false,
  onLogout = null,
  children
}) {
  const {
    currentUser,
    currentTeam: contextCurrentTeam,
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

  const currentTeam = propCurrentTeam || contextCurrentTeam;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showLogoutConfirmModal, setShowLogoutConfirmModal] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(() => {
    try {
      return localStorage.getItem('lbb_sidebar_collapsed') === 'true';
    } catch (e) {
      return false;
    }
  });

  React.useEffect(() => {
    if (!showUserMenu) return;
    const handleClickOutside = (e) => {
      if (!e.target.closest('#user-profile-menu-container') && !e.target.closest('#mobile-user-profile-container')) {
        setShowUserMenu(false);
      }
    };
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, [showUserMenu]);

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
  const isPeserta = userRole === 'peserta';

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

  const teamInitials = useMemo(() => {
    if (!displayName) return 'M';
    const cleaned = displayName.trim().replace(/^(SD|SMP|SMA|SMK|MTs|MI)\s+/i, '').trim();
    const words = cleaned.split(/\s+/);
    if (words.length === 0 || !words[0]) return 'M';
    if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
    return (words[0][0] + words[1][0]).toUpperCase();
  }, [displayName]);

  const fallbackInitialAvatar = useMemo(() => {
    const bg = userRole === 'peserta' ? '8B0000' : '020617';
    const color = userRole === 'peserta' ? 'fff' : 'fbbf24';
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=${bg}&color=${color}&bold=true`;
  }, [userRole, displayName]);

  const avatarUrl = avatarMeta?.url || currentUser?.avatar || (isSchoolLogo ? currentTeam?.files?.schoolLogo?.url : null) || fallbackInitialAvatar;

  const rawSchoolLogo = currentTeam?.files?.schoolLogo?.url || currentTeam?.file_logo_sekolah || currentTeam?.logoUrl || (avatarMeta?.isSchoolLogo ? avatarMeta.url : '');
  const hasSchoolLogo = Boolean(rawSchoolLogo && rawSchoolLogo !== '#' && !rawSchoolLogo.startsWith('#'));
  const schoolLogoFormatted = hasSchoolLogo ? formatImageUrl(rawSchoolLogo) : '';

  // Navigasi Terstruktur SaaS Minimalist (Sesuai Referensi Simple & Clean dengan Brand UI)
  const getNavSections = () => {
    // 1. Peserta
    if (userRole === 'peserta') {
      return [
        {
          id: 'peleton',
          title: 'PORTAL PELETON',
          tag: 'Official',
          tagColor: 'text-slate-600 bg-slate-100 border-slate-200/80',
          items: [
            { id: 'overview', index: '01', label: 'Beranda', icon: Home, view: 'peserta_dashboard', activeGradient: 'from-rose-600 to-red-600' },
            { id: 'roster', index: '02', label: 'Personel', icon: Users, view: 'peserta_dashboard', activeGradient: 'from-teal-700 to-emerald-600' },
            { id: 'documents', index: '03', label: 'Berkas', icon: FileText, view: 'peserta_dashboard', activeGradient: 'from-purple-600 to-violet-600' },
          ]
        },
        {
          id: 'arena',
          title: 'PERSIAPAN & ARENA',
          tag: 'Arena',
          tagColor: 'text-emerald-700 bg-emerald-50 border-emerald-200/80',
          items: [
            { id: 'uji_coba', index: '04', label: 'UCL', icon: Compass, view: 'field_trial', activeGradient: 'from-cyan-600 to-teal-600' },
            { id: 'materi_tema', index: '05', label: 'Materi & Tema Lomba', icon: BookOpen, view: 'peserta_dashboard', activeGradient: 'from-amber-500 to-orange-500' },
            { id: 'denah_basecamp', index: '06', label: 'Denah Basecamp', icon: Building2, view: 'peserta_dashboard', activeGradient: 'from-teal-600 to-emerald-600' },
          ]
        },
        {
          id: 'penilaian',
          title: 'HASIL & KLASEMEN',
          tag: 'Hasil',
          tagColor: 'text-amber-700 bg-amber-50 border-amber-200/80',
          items: [
            { id: 'scores', index: '07', label: 'Rekap Nilai', icon: FileSpreadsheet, view: 'peserta_dashboard', activeGradient: 'from-amber-500 to-orange-500' },
            { id: 'klasemen', index: '08', label: 'Klasemen', icon: Trophy, view: 'live_leaderboard', activeGradient: 'from-teal-700 via-emerald-600 to-teal-600' },
          ]
        }
      ];
    }

    // 2. Panitia / Staff
    const baseTahapan = [
      { id: 'pendaftaran', index: '01', label: 'Berkas Registrasi', icon: ClipboardList, stage: 'pendaftaran', activeGradient: 'from-blue-600 to-indigo-600' },
      { id: 'tm', index: '02', label: 'Technical Meeting', icon: CalendarCheck, stage: 'tm', activeGradient: 'from-amber-500 to-orange-500' },
      { id: 'uji_coba', index: '03', label: 'Uji Coba Lapangan', icon: Compass, stage: 'uji_coba', activeGradient: 'from-cyan-600 to-teal-600' },
      { id: 'checkin', index: '04', label: 'Basecamp', icon: Building2, stage: 'checkin', activeGradient: 'from-emerald-600 to-teal-600' },
      { id: 'dp', index: '05', label: 'Daerah Persiapan', icon: Clock, stage: 'dp', activeGradient: 'from-violet-600 to-purple-600' },
    ];

    const basePenilaian = [
      { id: 'penjurian', index: '06', label: 'Penjurian Lapangan', icon: Award, stage: 'penjurian', activeGradient: 'from-rose-600 to-red-600' },
      { id: 'rekap_nilai', index: '07', label: 'Rekap Nilai', icon: FileSpreadsheet, stage: 'rekap_nilai', activeGradient: 'from-amber-600 to-orange-600' },
      { id: 'klasemen', index: '08', label: 'Klasemen', icon: Trophy, stage: 'klasemen', activeGradient: 'from-amber-500 via-yellow-500 to-amber-600' },
    ];

    const filterAccessible = (list) => {
      if (!canAccessStage) return list;
      return list.filter(item => canAccessStage(item.stage, userRole));
    };

    const sections = [
      {
        id: 'utama',
        title: 'UTAMA',
        tag: 'Ringkasan',
        tagColor: 'text-red-700 bg-red-50 border-red-200/80',
        items: [
          { id: 'staff_home', index: '00', label: 'Beranda', icon: Home, view: 'staff_home', activeGradient: 'from-red-600 to-rose-600' },
        ],
      },
    ];
    const tahapan = filterAccessible(baseTahapan);
    if (tahapan.length > 0) {
      sections.push({ 
        id: 'tahapan', 
        title: 'TAHAPAN LOMBA', 
        tag: 'Juknis',
        tagColor: 'text-blue-700 bg-blue-50 border-blue-200/80',
        items: tahapan 
      });
    }

    const penilaian = filterAccessible(basePenilaian);
    if (penilaian.length > 0) {
      sections.push({ 
        id: 'penilaian', 
        title: 'PENILAIAN & REKAP', 
        tag: 'Penjurian',
        tagColor: 'text-amber-700 bg-amber-50 border-amber-200/80',
        items: penilaian 
      });
    }

    const sistemItems = [];
    if (userRole === 'superadmin') {
      sistemItems.push({ id: 'superadmin', index: '09', label: 'Master System', icon: Crown, view: 'superadmin', activeGradient: 'from-purple-700 to-indigo-700' });
    }
    if (sistemItems.length > 0) {
      sections.push({ 
        id: 'sistem', 
        title: 'SISTEM', 
        tag: 'Sistem',
        tagColor: 'text-purple-700 bg-purple-50 border-purple-200/80',
        items: sistemItems 
      });
    }

    return sections;
  };

  const navSections = getNavSections();
  const getNavItems = () => navSections.flatMap(s => s.items);

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
      case 'denah_basecamp':
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
      case 'baca_perpang':
        return Scale;
      case 'unduhan':
        return Download;
      case 'materi_tema':
      case 'rundown':
        return BookOpen;
      case 'superadmin':
        return Crown;
      case 'overview':
      case 'dashboard':
      case 'staff_home':
        return Home;
      default:
        return ShieldCheck;
    }
  };

  const getModuleTheme = (menuId) => {
    switch (menuId) {
      case 'pendaftaran':
      case 'admin':
      case 'idcard':
      case 'unduhan':
        return { 
          bg: 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20 ring-1 ring-white/20', 
          iconColor: 'text-white', 
          badgeColor: 'bg-blue-50 text-blue-800',
          kicker: 'PUSAT DOKUMEN & UNDUHAN RESMI',
          accentGradient: 'from-blue-600 via-indigo-500 to-cyan-500'
        };
      case 'baca_perpang':
        return { 
          bg: 'bg-gradient-to-br from-red-600 to-rose-600 text-white shadow-md shadow-red-500/20 ring-1 ring-white/20', 
          iconColor: 'text-white', 
          badgeColor: 'bg-red-50 text-red-800',
          kicker: 'REGULASI RESMI PERPANG TNI',
          accentGradient: 'from-red-600 via-rose-500 to-red-800'
        };
      case 'tm':
        return { 
          bg: 'bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-md shadow-amber-500/20 ring-1 ring-white/20', 
          iconColor: 'text-white', 
          badgeColor: 'bg-amber-50 text-amber-800',
          kicker: 'TECHNICAL MEETING & UNDIAN',
          accentGradient: 'from-amber-500 via-orange-500 to-yellow-500'
        };
      case 'uji_coba':
      case 'field_trial':
        return { 
          bg: 'bg-gradient-to-br from-cyan-600 to-teal-600 text-white shadow-md shadow-cyan-500/20 ring-1 ring-white/20', 
          iconColor: 'text-white', 
          badgeColor: 'bg-teal-50 text-teal-800',
          kicker: 'JADWAL UJI COBA LAPANGAN (UCL)',
          accentGradient: 'from-cyan-600 via-teal-500 to-emerald-500'
        };
      case 'roster':
        return { 
          bg: 'bg-gradient-to-br from-teal-700 to-emerald-600 text-white shadow-md shadow-teal-500/20 ring-1 ring-white/20', 
          iconColor: 'text-white', 
          badgeColor: 'bg-teal-50 text-teal-800',
          kicker: 'STRUKTUR PERSONEL PELETON',
          accentGradient: 'from-teal-600 via-emerald-500 to-teal-800'
        };
      case 'documents':
        return { 
          bg: 'bg-gradient-to-br from-purple-600 to-violet-600 text-white shadow-md shadow-purple-500/20 ring-1 ring-white/20', 
          iconColor: 'text-white', 
          badgeColor: 'bg-purple-50 text-purple-800',
          kicker: 'BERKAS ADMINISTRASI PELETON',
          accentGradient: 'from-purple-600 via-violet-500 to-indigo-600'
        };
      case 'checkin':
      case 'checkout':
      case 'basecamp':
      case 'denah_basecamp':
        return { 
          bg: 'bg-gradient-to-br from-teal-600 to-emerald-600 text-white shadow-md shadow-teal-500/20 ring-1 ring-white/20', 
          iconColor: 'text-white', 
          badgeColor: 'bg-teal-50 text-teal-800',
          kicker: 'LOKASI & AKOMODASI BASECAMP',
          accentGradient: 'from-teal-600 via-emerald-500 to-cyan-600'
        };
      case 'dp':
        return { 
          bg: 'bg-gradient-to-br from-orange-500 to-amber-600 text-white shadow-md shadow-orange-500/20 ring-1 ring-white/20', 
          iconColor: 'text-white', 
          badgeColor: 'bg-orange-50 text-orange-800',
          kicker: 'DAERAH PERSIAPAN (DP)',
          accentGradient: 'from-orange-500 via-amber-500 to-yellow-500'
        };
      case 'penjurian':
      case 'juri':
        return { 
          bg: 'bg-gradient-to-br from-rose-600 to-red-600 text-white shadow-md shadow-rose-500/20 ring-1 ring-white/20', 
          iconColor: 'text-white', 
          badgeColor: 'bg-rose-50 text-rose-800',
          kicker: 'PENJURIAN RESMI LAPANGAN',
          accentGradient: 'from-rose-600 via-red-600 to-amber-600'
        };
      case 'rekap_nilai':
      case 'recap':
        return { 
          bg: 'bg-gradient-to-br from-indigo-600 to-blue-600 text-white shadow-md shadow-indigo-500/20 ring-1 ring-white/20', 
          iconColor: 'text-white', 
          badgeColor: 'bg-indigo-50 text-indigo-800',
          kicker: 'REKAPITULASI HASIL PENILAIAN',
          accentGradient: 'from-indigo-600 via-blue-500 to-indigo-800'
        };
      case 'scores':
        return { 
          bg: 'bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-md shadow-amber-500/20 ring-1 ring-white/20', 
          iconColor: 'text-white', 
          badgeColor: 'bg-amber-50 text-amber-800',
          kicker: 'REKAP NILAI PELETON',
          accentGradient: 'from-amber-500 via-orange-500 to-amber-700'
        };
      case 'klasemen':
      case 'leaderboard':
      case 'live_leaderboard':
        return { 
          bg: 'bg-gradient-to-br from-amber-500 via-orange-500 to-red-600 text-white shadow-md shadow-amber-500/25 ring-1 ring-white/20', 
          iconColor: 'text-white', 
          badgeColor: 'bg-amber-50 text-amber-800',
          kicker: 'PAPAN PERINGKAT RESMI DEWAN JURI',
          accentGradient: 'from-red-600 via-amber-500 to-rose-600'
        };
      case 'materi_tema':
      case 'rundown':
        return { 
          bg: 'bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-md shadow-amber-500/20 ring-1 ring-white/20', 
          iconColor: 'text-white', 
          badgeColor: 'bg-amber-50 text-amber-800',
          kicker: 'REGULASI & MATERI LOMBA',
          accentGradient: 'from-amber-500 via-orange-500 to-red-600'
        };
      case 'superadmin':
        return { 
          bg: 'bg-gradient-to-br from-purple-700 to-indigo-700 text-white shadow-md shadow-purple-500/20 ring-1 ring-white/20', 
          iconColor: 'text-white', 
          badgeColor: 'bg-purple-50 text-purple-800',
          kicker: 'SISTEM KONTROL PUSAT SUPERADMIN',
          accentGradient: 'from-purple-700 via-indigo-600 to-violet-700'
        };
      case 'overview':
      case 'dashboard':
        return { 
          bg: 'bg-gradient-to-br from-red-600 to-rose-700 text-white shadow-md shadow-red-600/20 ring-1 ring-white/20', 
          iconColor: 'text-white', 
          badgeColor: 'bg-red-50 text-red-800',
          kicker: 'PORTAL RESMI PELETON',
          accentGradient: 'from-red-600 via-rose-600 to-red-800'
        };
      default:
        return { 
          bg: 'bg-gradient-to-br from-slate-700 to-slate-900 text-white shadow-md shadow-slate-500/20 ring-1 ring-white/20', 
          iconColor: 'text-white', 
          badgeColor: 'bg-slate-100 text-slate-800',
          kicker: 'SIMPASKOR OFFICIAL 2027',
          accentGradient: 'from-red-600 via-slate-600 to-red-800'
        };
    }
  };

  const navItems = getNavItems();

  const participantBottomNav = useMemo(() => [
    { 
      id: 'overview', 
      label: 'Beranda', 
      icon: Home, 
      view: 'peserta_dashboard',
      activeBg: 'bg-gradient-to-r from-red-600 to-rose-600',
      activeShadow: 'shadow-red-600/30'
    },
    { 
      id: 'roster', 
      label: 'Personel', 
      icon: Users, 
      view: 'peserta_dashboard',
      activeBg: 'bg-gradient-to-r from-teal-700 to-emerald-600',
      activeShadow: 'shadow-emerald-600/30'
    },
    { 
      id: 'documents', 
      label: 'Berkas', 
      icon: FileText, 
      view: 'peserta_dashboard',
      activeBg: 'bg-gradient-to-r from-purple-600 to-violet-600',
      activeShadow: 'shadow-purple-600/30'
    },
    { 
      id: 'materi_tema', 
      label: 'Materi', 
      icon: BookOpen, 
      view: 'peserta_dashboard',
      activeBg: 'bg-gradient-to-r from-amber-500 to-orange-500',
      activeShadow: 'shadow-amber-500/30'
    },
    { 
      id: 'scores', 
      label: 'Rekap', 
      icon: Trophy, 
      view: 'peserta_dashboard',
      activeBg: 'bg-gradient-to-r from-amber-500 to-orange-500',
      activeShadow: 'shadow-amber-500/30'
    }
  ], []);

  const mobileBottomNavItems = isPeserta ? participantBottomNav : navItems.slice(0, 5);

  const isItemActive = (item) => {
    if (activeMenu === item.id) return true;
    if (userRole === 'peserta' && activeMenu === 'unduhan' && item.id === 'documents') return true;
    if (userRole === 'peserta' && activeMenu === 'baca_perpang' && item.id === 'materi_tema') return true;
    if ((activeMenu === 'checkin' || activeMenu === 'checkout') && item.id === 'checkin') return true;
    if ((activeMenu === 'field_trial' || activeMenu === 'uji_coba') && (item.id === 'field_trial' || item.id === 'uji_coba')) return true;
    if ((activeMenu === 'live_leaderboard' || activeMenu === 'leaderboard' || activeMenu === 'klasemen') && item.id === 'klasemen') return true;
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
    if (userRole === 'peserta' && item.view === 'peserta_dashboard') {
      try {
        localStorage.setItem('lbb_participant_active_tab', item.id);
      } catch {}
      if (onSelectMenu) {
        onSelectMenu(item.id);
      }
      if (setActiveView) {
        setActiveView('peserta_dashboard');
      }
      return;
    }
    if (item.stage && navigateToStage) {
      navigateToStage(item.stage);
    } else if (item.view) {
      setActiveView(item.view);
    }
  };

  const handleLogout = () => {
    setShowLogoutConfirmModal(true);
  };

  const confirmLogout = (e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    setShowLogoutConfirmModal(false);
    try {
      if (typeof onLogout === 'function') {
        onLogout();
      }
      if (isPeserta) {
        if (typeof logoutTeam === 'function') logoutTeam();
        if (typeof logoutUser === 'function') logoutUser();
      } else {
        if (typeof logoutUser === 'function') logoutUser();
      }
      if (typeof setActiveView === 'function') {
        setActiveView('landing');
      }
    } catch (err) {
      console.error('Logout error:', err);
      try {
        localStorage.clear();
        window.location.reload();
      } catch (ex) {}
    }
  };


  return (
    <div className="min-h-screen bg-[#F8F9FA] text-slate-800 flex font-sans">
      {/* 1. UNIFIED DARK SIDEBAR & MOBILE DRAWER (Peserta & Panitia) */}
      <aside
        className={`hidden lg:flex fixed inset-y-0 left-0 z-30 flex-col border-r border-white/5 bg-[#0d1421] text-white shadow-[12px_0_35px_rgba(15,23,42,.08)] transition-all duration-300 ${
          isCollapsed ? 'w-[76px]' : 'w-[280px]'
        }`}
      >
        {/* Top Brand Header */}
        <div
          className={`flex shrink-0 items-center border-b border-white/[.07] transition-all duration-300 ${
            isCollapsed
              ? 'flex-col justify-center gap-2 px-2 py-3.5 h-[88px]'
              : 'justify-between gap-2.5 px-4 h-[88px]'
          }`}
        >
          <div
            onClick={() => {
              setActiveView('landing');
            }}
            className={`flex items-center cursor-pointer group min-w-0 ${
              isCollapsed ? 'justify-center' : 'gap-2.5 flex-1'
            }`}
            title="Ke Beranda Utama LBB Mu'allimin"
          >
            <img
              src={logoLbb}
              alt="Logo LBB"
              className={`w-auto object-contain shrink-0 group-hover:scale-105 transition-transform drop-shadow-md ${
                isCollapsed ? 'h-8' : 'h-10'
              }`}
            />
            {!isCollapsed && (
              <img
                src={titleLogoImg}
                alt="LBB Mu'allimin 2027"
                className="h-7 w-auto object-contain max-w-[145px] sm:max-w-[155px]"
              />
            )}
          </div>

          {/* Collapse Toggle Button (Desktop Only) */}
          <button
            type="button"
            onClick={toggleSidebarCollapse}
            className="h-8 w-8 flex items-center justify-center rounded-xl text-slate-400 transition-colors hover:bg-white/10 hover:text-white cursor-pointer shrink-0"
            title={isCollapsed ? 'Perbesar Sidebar' : 'Kecilkan Sidebar'}
            aria-label={isCollapsed ? 'Perbesar Sidebar' : 'Kecilkan Sidebar'}
          >
            {isCollapsed ? (
              <PanelLeftOpen className="w-4 h-4 text-slate-300" />
            ) : (
              <PanelLeftClose className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Scrollable Nav Area */}
        <div className={`sidebar-scroll flex-1 overflow-y-auto ${isCollapsed ? 'px-2 py-3' : 'px-3.5 py-4'}`}>
          {navSections.map((section, idx) => (
            <div key={section.id} className={idx > 0 ? (isCollapsed ? 'mt-3' : 'mt-5') : ''}>
              {!isCollapsed ? (
                <p className="flex items-center gap-2 px-2.5 text-[9px] font-extrabold tracking-[.18em] text-slate-500 uppercase">
                  <span className="h-3.5 w-1 rounded-full bg-red-600 shrink-0" /> {section.title}
                </p>
              ) : (
                idx > 0 && <div className="my-1.5 border-t border-white/[0.08]" title={section.title} />
              )}
              <nav className="mt-1.5 space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const active = isItemActive(item);

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleNavClick(item)}
                      title={item.label}
                      className={`nav-item ${active ? 'nav-item-active' : ''} ${
                        isCollapsed ? '!justify-center !px-0 !gap-0' : ''
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      {!isCollapsed && <span className="truncate">{item.label}</span>}
                      {!isCollapsed && item.badge && (
                        <span
                          className={`ml-auto rounded-full px-2 py-0.5 text-[9px] font-black transition-colors ${
                            active
                              ? 'bg-red-500/20 text-red-200 border border-red-500/30'
                              : 'bg-white/10 text-slate-400'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>
          ))}
        </div>

        {/* Bottom Account Card (Desktop) */}
        <div className={`shrink-0 border-t border-white/[.07] ${isCollapsed ? 'p-2' : 'p-4'}`}>
          {isCollapsed ? (
            <div className="flex flex-col items-center gap-2">
              <div className="relative flex h-10 w-10 shrink-0 items-center justify-center" title={displayName}>
                {isSchoolLogo && avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={displayName}
                    className="w-full h-full object-contain filter drop-shadow-md"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                ) : !isPeserta && avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={displayName}
                    className="h-10 w-10 rounded-xl object-cover ring-1 ring-white/15 shadow-md"
                    onError={(e) => {
                      if (currentUser?.googleAvatar && e.target.src !== currentUser.googleAvatar) {
                        e.target.src = currentUser.googleAvatar;
                      } else if (e.target.src !== fallbackInitialAvatar) {
                        e.target.src = fallbackInitialAvatar;
                      }
                    }}
                  />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-red-600 to-red-800 text-[11px] font-black text-white shadow-md">
                    <span>{teamInitials}</span>
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="flex h-8 w-8 items-center justify-center rounded-xl text-slate-400 transition hover:bg-white/10 hover:text-white cursor-pointer"
                title={isPeserta ? 'Ganti akun tim' : 'Keluar akun'}
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="rounded-2xl border border-white/[.08] bg-white/[.035] p-3">
              <div className="flex items-center gap-3">
                <div className="relative flex h-10 w-10 shrink-0 items-center justify-center">
                  {isSchoolLogo && avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt={displayName}
                      className="w-full h-full object-contain filter drop-shadow-md"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  ) : !isPeserta && avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt={displayName}
                      className="h-10 w-10 rounded-xl object-cover ring-1 ring-white/15 shadow-md"
                      onError={(e) => {
                        if (currentUser?.googleAvatar && e.target.src !== currentUser.googleAvatar) {
                          e.target.src = currentUser.googleAvatar;
                        } else if (e.target.src !== fallbackInitialAvatar) {
                          e.target.src = fallbackInitialAvatar;
                        }
                      }}
                    />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-red-600 to-red-800 text-[11px] font-black text-white shadow-md">
                      <span>{teamInitials}</span>
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[10px] font-black text-white" title={displayName}>
                    {displayName}
                  </p>
                  <p className="mt-0.5 truncate text-[8px] font-medium text-slate-500">
                    {currentTeam?.email || currentUser?.email || displaySubtitle}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="mt-3 flex w-full items-center justify-center gap-2 border-t border-white/[.07] pt-3 text-[9px] font-bold text-slate-400 transition hover:text-white cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>{isPeserta ? 'Ganti akun tim' : 'Keluar akun'}</span>
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* 2. MOBILE DRAWER OVERLAY (Unified Dark Mode) */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="relative w-[285px] max-w-[85vw] bg-[#0d1421] text-white h-full shadow-2xl flex flex-col border-r border-white/10 z-10 justify-between animate-in slide-in-from-left duration-200">
            {/* Mobile Drawer Top Brand Header */}
            <div className="flex shrink-0 items-center justify-between gap-2.5 px-4 h-16 sm:h-[72px] border-b border-white/[.07]">
              <div
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setActiveView('landing');
                }}
                className="flex items-center gap-2.5 cursor-pointer min-w-0 flex-1"
                title="Ke Beranda Utama LBB Mu'allimin"
              >
                <img
                  src={logoLbb}
                  alt="Logo LBB"
                  className="h-9 w-auto object-contain shrink-0 drop-shadow-md"
                />
                <img
                  src={titleLogoImg}
                  alt="LBB Mu'allimin 2027"
                  className="h-6 w-auto object-contain max-w-[135px]"
                />
              </div>

              <button
                type="button"
                aria-label="Tutup sidebar"
                onClick={() => setIsMobileMenuOpen(false)}
                className="rounded-xl p-2 text-slate-400 transition hover:bg-white/10 hover:text-white cursor-pointer shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Drawer Scrollable Nav Area */}
            <div className="sidebar-scroll flex-1 overflow-y-auto px-3.5 py-4">
              {navSections.map((section, idx) => (
                <div key={section.id} className={idx > 0 ? 'mt-4' : ''}>
                  <p className="flex items-center gap-2 px-2.5 text-[9px] font-extrabold tracking-[.18em] text-slate-400 uppercase">
                    <span className="h-3.5 w-1 rounded-full bg-red-600 shrink-0" /> {section.title}
                  </p>
                  <nav className="mt-1.5 space-y-1">
                    {section.items.map((item) => {
                      const Icon = item.icon;
                      const active = isItemActive(item);

                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => handleNavClick(item)}
                          title={item.label}
                          className={`nav-item ${active ? 'nav-item-active' : ''}`}
                        >
                          <Icon className="w-4 h-4 shrink-0" />
                          <span className="truncate flex-1 text-left">{item.label}</span>
                          {item.badge && (
                            <span
                              className={`ml-auto rounded-full px-2 py-0.5 text-[9px] font-black transition-colors ${
                                active
                                  ? 'bg-red-500/20 text-red-200 border border-red-500/30'
                                  : 'bg-white/10 text-slate-400'
                              }`}
                            >
                              {item.badge}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </nav>
                </div>
              ))}
            </div>

            {/* Mobile Drawer Bottom Account Card */}
            <div className="shrink-0 border-t border-white/[.07] p-3.5 bg-[#090e17]/80">
              <div className="rounded-2xl border border-white/[.08] bg-white/[.035] p-3">
                <div className="flex items-center gap-3">
                  <div className="relative flex h-10 w-10 shrink-0 items-center justify-center">
                    {isSchoolLogo && avatarUrl ? (
                      <img
                        src={avatarUrl}
                        alt={displayName}
                        className="w-full h-full object-contain filter drop-shadow-md"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    ) : !isPeserta && avatarUrl ? (
                      <img
                        src={avatarUrl}
                        alt={displayName}
                        className="h-10 w-10 rounded-xl object-cover ring-1 ring-white/15 shadow-md"
                        onError={(e) => {
                          if (currentUser?.googleAvatar && e.target.src !== currentUser.googleAvatar) {
                            e.target.src = currentUser.googleAvatar;
                          } else if (e.target.src !== fallbackInitialAvatar) {
                            e.target.src = fallbackInitialAvatar;
                          }
                        }}
                      />
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-red-600 to-red-800 text-[11px] font-black text-white shadow-md">
                        <span>{teamInitials}</span>
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[11px] font-black text-white" title={displayName}>
                      {displayName}
                    </p>
                    <p className="mt-0.5 truncate text-[9px] font-medium text-slate-400">
                      {currentTeam?.email || currentUser?.email || displaySubtitle}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="mt-3 flex w-full items-center justify-center gap-2 border-t border-white/[.07] pt-2.5 text-[10px] font-bold text-slate-400 transition hover:text-white cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>{isPeserta ? 'Ganti akun tim' : 'Keluar akun'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. MAIN CONTENT AREA */}
      <div className={`flex-1 flex flex-col min-w-0 pb-24 lg:pb-8 transition-all duration-300 ${
        isCollapsed ? 'lg:pl-[76px]' : 'lg:pl-[280px]'
      }`}>
        {/* Top Sticky Header Bar (Unified untuk Peserta & Panitia) */}
        <header className="sticky top-0 z-20 flex h-16 sm:h-[72px] items-center justify-between border-b border-slate-200/80 bg-white/95 px-3 sm:px-7 lg:px-9 backdrop-blur-xl gap-2.5">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
            <button
              type="button"
              aria-label="Buka menu"
              className="rounded-xl border border-slate-200 p-2 text-slate-700 hover:bg-slate-100 lg:hidden cursor-pointer shrink-0 active:scale-95 transition-transform"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </button>
            {/* Logo LBB + Logo Title */}
            <div
              onClick={() => {
                if (setActiveView) setActiveView('landing');
              }}
              className="flex items-center gap-2 sm:gap-2.5 cursor-pointer min-w-0 group select-none"
              title="Ke Beranda Utama LBB Mu'allimin"
            >
              <img
                src={logoLbb}
                alt="Logo LBB"
                className="h-8 sm:h-9 w-auto object-contain shrink-0 group-hover:scale-105 transition-transform drop-shadow-xs"
              />
              <img
                src={titleLogoImg}
                alt="LBB Mu'allimin 2027"
                className="h-6 sm:h-7 w-auto object-contain max-w-[130px] sm:max-w-[160px]"
              />
            </div>
          </div>

          {/* Sisi Kanan: Identitas Akun & Tombol Keluar */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0 min-w-0">
            {isPeserta && currentTeam ? (
              <div className="hidden sm:flex items-center gap-2.5 md:gap-3 shrink-0 min-w-0">
                <div className="text-right min-w-0 max-w-[180px] md:max-w-sm">
                  <span
                    className="text-xs sm:text-sm font-black uppercase tracking-tight text-slate-900 leading-tight block truncate"
                    title={currentTeam?.schoolName || displayName}
                  >
                    {currentTeam?.schoolName || displayName}
                  </span>
                </div>

                {hasSchoolLogo && schoolLogoFormatted ? (
                  <img
                    src={schoolLogoFormatted}
                    alt={currentTeam?.schoolName || 'Logo Sekolah'}
                    referrerPolicy="no-referrer"
                    className="h-8 sm:h-9 w-auto max-w-[38px] sm:max-w-[44px] object-contain shrink-0 drop-shadow-xs"
                    onError={(e) => {
                      const fallback = getFallbackImageUrl(rawSchoolLogo);
                      if (fallback && e.currentTarget.src !== fallback) {
                        e.currentTarget.src = fallback;
                      } else {
                        e.currentTarget.style.display = 'none';
                        if (e.currentTarget.nextElementSibling) {
                          e.currentTarget.nextElementSibling.style.display = 'flex';
                        }
                      }
                    }}
                  />
                ) : null}
                <div
                  className="h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-red-600 text-white font-black text-xs flex items-center justify-center shrink-0 shadow-xs"
                  style={{ display: hasSchoolLogo && schoolLogoFormatted ? 'none' : 'flex' }}
                >
                  {teamInitials}
                </div>

                <div className="h-7 w-px bg-slate-200 shrink-0" />
              </div>
            ) : !isPeserta ? (
              <div className="hidden sm:flex items-center gap-2.5 shrink-0 min-w-0">
                <div className="text-right min-w-0 max-w-[200px]">
                  <span className="text-xs font-black text-slate-900 leading-tight block truncate">
                    {displayName}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block truncate">
                    {userRole === 'superadmin' ? 'Superadmin' : 'Panitia LBB'}
                  </span>
                </div>
                <img
                  src={avatarUrl}
                  alt={displayName}
                  className="h-8 w-8 sm:h-9 sm:w-9 rounded-xl object-cover ring-1 ring-slate-200 shrink-0"
                  onError={(e) => {
                    if (currentUser?.googleAvatar && e.target.src !== currentUser.googleAvatar) {
                      e.target.src = currentUser.googleAvatar;
                    } else if (e.target.src !== fallbackInitialAvatar) {
                      e.target.src = fallbackInitialAvatar;
                    }
                  }}
                />
                <div className="h-7 w-px bg-slate-200 shrink-0" />
              </div>
            ) : null}

            {/* Tombol Keluar (Paling Kanan) */}
            <button
              type="button"
              onClick={handleLogout}
              className="p-2 sm:p-2.5 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 transition-all cursor-pointer shrink-0 flex items-center justify-center shadow-2xs active:scale-95"
              title={isPeserta ? 'Ganti Akun Tim' : 'Keluar (Logout)'}
              aria-label={isPeserta ? 'Ganti Akun Tim' : 'Keluar (Logout)'}
            >
              <LogOut className="w-4 h-4 text-red-600 shrink-0" />
            </button>
          </div>
        </header>

        {/* Content Body */}
        <main className={`p-3 sm:p-5 lg:p-6 w-full mx-auto transition-all duration-300 ${
          fullWidth ? 'max-w-none' : (isCollapsed ? 'max-w-[1700px]' : 'max-w-7xl')
        }`}>
          {/* ======================================================== */}
          {/* CLEAN PANEL HEADER (Sesuai Referensi Portal Peserta)     */}
          {/* ======================================================== */}
          {!hideHeader && (
            <section className={`rounded-2xl sm:rounded-[26px] border border-slate-200/80 bg-white px-4 py-3.5 sm:px-6 sm:py-4 shadow-[0_12px_32px_rgba(15,23,42,0.045)] mb-4 sm:mb-6 ${
              isPeserta ? 'max-w-6xl mx-auto' : ''
            }`}>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <span className="flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-sm">
                    {React.createElement(getModuleIcon(activeMenu), { className: 'w-5 h-5 text-amber-400' })}
                  </span>
                  <div className="min-w-0 flex-1">
                    <h1 className="text-base sm:text-lg font-black tracking-tight text-slate-950 truncate">
                      {title}
                    </h1>
                    {subtitle && (
                      <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                        {subtitle}
                      </p>
                    )}
                  </div>
                </div>

                {rightActions && (
                  <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
                    {rightActions}
                  </div>
                )}
              </div>
            </section>
          )}

          {children}
        </main>
      </div>

      {/* 4. FLOATING PILL MOBILE BOTTOM NAVIGATION (Dark Mode - Dynamic Island Style) */}
      {mobileBottomNavItems.length > 0 && (
        <nav
          aria-label="Navigasi Menu Utama Mobile"
          className={`lg:hidden fixed bottom-3.5 left-1/2 -translate-x-1/2 z-30 bg-[#0d1421]/95 backdrop-blur-2xl border border-white/15 rounded-full p-1.5 shadow-[0_16px_40px_rgba(0,0,0,0.45),0_0_1px_1px_rgba(255,255,255,0.08)] flex items-center justify-center gap-1 max-w-[94vw] sm:max-w-md transition-all duration-300 ring-1 ring-black/40 ${
            isMobileMenuOpen ? 'opacity-0 pointer-events-none translate-y-8 invisible' : 'opacity-100 translate-y-0 visible'
          }`}
        >
          {mobileBottomNavItems.map(item => {
            const Icon = item.icon;
            const isActive = isItemActive(item);
            const shortLabels = {
              staff_home: 'Beranda',
              pendaftaran: 'Berkas',
              tm: 'TM',
              uji_coba: 'UCL',
              field_trial: 'UCL',
              checkin: 'Basecamp',
              checkout: 'Basecamp',
              dp: 'DP',
              penjurian: 'Juri',
              rekap_nilai: 'Rekap',
              klasemen: 'Klasemen',
              superadmin: 'Master',
            };
            const shortLabel = shortLabels[item.id] || item.label.split(' ')[0];
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item)}
                title={item.label}
                className={`flex items-center gap-1.5 transition-all duration-300 cursor-pointer select-none active:scale-95 shrink-0 ${
                  isActive
                    ? `${item.activeBg || 'bg-gradient-to-r from-red-600 to-rose-600'} text-white px-3.5 py-2 rounded-full shadow-lg ${item.activeShadow || 'shadow-red-600/30'} font-bold text-xs ring-1 ring-white/20`
                    : 'text-slate-400 hover:text-white p-2.5 rounded-full hover:bg-white/10'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {isActive && (
                  <span className="whitespace-nowrap tracking-tight animate-in fade-in duration-200 font-bold">
                    {shortLabel}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      )}

      {/* Modal Konfirmasi Logout / Ganti Akun */}
      {showLogoutConfirmModal && (
        <div 
          onClick={() => setShowLogoutConfirmModal(false)}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-xs animate-in fade-in duration-200 cursor-pointer"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl sm:p-7 space-y-5 animate-in zoom-in-95 duration-200 cursor-default"
          >
            <div className="flex items-start gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center shrink-0 shadow-xs">
                <LogOut className="w-6 h-6 stroke-[2.2]" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-black uppercase tracking-wider text-rose-600">
                  Konfirmasi Sesi
                </p>
                <h3 className="text-lg sm:text-xl font-black text-slate-900 leading-tight mt-0.5">
                  {isPeserta ? 'Yakin Ingin Ganti Akun?' : 'Yakin Ingin Keluar?'}
                </h3>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  {isPeserta ? (
                    <>Sesi peleton <strong className="text-slate-800 font-bold">{displayName || 'Anda'}</strong> akan diakhiri di perangkat ini. Anda perlu memasukkan kode akses atau nomor registrasi tim kembali untuk masuk ke portal.</>
                  ) : (
                    <>Sesi akun panitia/admin <strong className="text-slate-800 font-bold">{displayName || 'Anda'}</strong> akan diakhiri. Pastikan semua perubahan telah tersimpan.</>
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowLogoutConfirmModal(false);
                }}
                className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs transition-colors cursor-pointer active:scale-95"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  confirmLogout(e);
                }}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-bold text-xs shadow-md shadow-red-600/25 flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>{isPeserta ? 'Ya, Ganti Akun' : 'Ya, Keluar'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
