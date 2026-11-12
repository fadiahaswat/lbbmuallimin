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

    const sections = [];
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

    const regulasiItems = [
      { id: 'dokumen', index: '09', label: 'Pusat Dokumen & Regulasi', icon: BookOpen, view: 'dokumen', activeGradient: 'from-slate-700 to-slate-900' },
    ];
    if (userRole === 'superadmin') {
      regulasiItems.push({ id: 'superadmin', index: '10', label: 'Master System', icon: Crown, view: 'superadmin', activeGradient: 'from-purple-700 to-indigo-700' });
    }
    sections.push({ 
      id: 'sistem', 
      title: 'SISTEM & REGULASI', 
      tag: 'Sistem',
      tagColor: 'text-purple-700 bg-purple-50 border-purple-200/80',
      items: regulasiItems 
    });

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
      case 'dokumen':
      case 'materi_tema':
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
      case 'dokumen':
      case 'materi_tema':
      case 'juknis':
      case 'tatib':
      case 'rundown':
      case 'proposal':
      case 'timeline':
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
      {/* 1. SIDEBAR */}
      {isPeserta ? (
        <>
          {/* PARTICIPANT SIDEBAR (Sesuai Referensi Desain Figma & App.tsx) */}
          <aside
            className={`fixed inset-y-0 left-0 z-40 flex flex-col border-r border-white/5 bg-[#0d1421] text-white shadow-[12px_0_35px_rgba(15,23,42,.08)] transition-all duration-300 ${
              isMobileMenuOpen ? 'translate-x-0 w-[280px]' : '-translate-x-full lg:translate-x-0'
            } ${
              isCollapsed ? 'lg:w-[76px]' : 'lg:w-[280px]'
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
                  setIsMobileMenuOpen(false);
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

              {/* Collapse Button (Desktop) & Close Button (Mobile) */}
              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={toggleSidebarCollapse}
                  className="hidden lg:flex h-8 w-8 items-center justify-center rounded-xl text-slate-400 transition-colors hover:bg-white/10 hover:text-white cursor-pointer"
                  title={isCollapsed ? 'Perbesar Sidebar' : 'Kecilkan Sidebar'}
                  aria-label={isCollapsed ? 'Perbesar Sidebar' : 'Kecilkan Sidebar'}
                >
                  {isCollapsed ? (
                    <PanelLeftOpen className="w-4 h-4 text-slate-300" />
                  ) : (
                    <PanelLeftClose className="w-4 h-4" />
                  )}
                </button>
                <button
                  type="button"
                  aria-label="Tutup sidebar"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="rounded-lg p-1.5 text-slate-400 transition hover:bg-white/10 hover:text-white lg:hidden cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
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

            {/* Bottom Team Account Card */}
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
                    title="Ganti akun tim"
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
                        {currentTeam?.email || currentUser?.email || 'official.tim@lbbmuallimin.id'}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="mt-3 flex w-full items-center justify-center gap-2 border-t border-white/[.07] pt-3 text-[9px] font-bold text-slate-500 transition hover:text-white cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Ganti akun tim</span>
                  </button>
                </div>
              )}
            </div>
          </aside>

          {/* Mobile backdrop untuk Peserta */}
          {isMobileMenuOpen && (
            <div
              className="fixed inset-0 z-30 bg-slate-950/60 backdrop-blur-sm lg:hidden transition-opacity"
              onClick={() => setIsMobileMenuOpen(false)}
            />
          )}
        </>
      ) : (
        /* 1. DESKTOP SIDEBAR (Clean & Minimalist SaaS Sidebar Sesuai Referensi untuk Staff/Admin) */
        <aside
          className={`hidden lg:flex flex-col bg-white border-r border-slate-200/70 fixed top-0 bottom-0 left-0 h-screen select-none shrink-0 z-30 transition-all duration-300 ${
            isCollapsed ? 'w-[72px]' : 'w-64'
          }`}
        >
          {/* Brand Header + Collapse Toggle */}
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
                  isCollapsed ? 'h-7' : 'h-8'
                }`}
              />
              {!isCollapsed && (
                <img
                  src={titleLogoImg}
                  alt="LBB Mu'allimin 2027"
                  className="h-6 w-auto max-w-[130px] object-contain"
                />
              )}
            </div>

            <button
              type="button"
              onClick={toggleSidebarCollapse}
              className="w-7 h-7 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center transition-colors shrink-0 cursor-pointer"
              title={isCollapsed ? 'Perbesar Menu' : 'Kecilkan Menu'}
              aria-label={isCollapsed ? 'Perbesar Menu' : 'Kecilkan Menu'}
            >
              {isCollapsed ? (
                <PanelLeftOpen className="w-4 h-4 text-slate-500" />
              ) : (
                <PanelLeftClose className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Navigation Content (Elevated Brand UI & Structured) */}
          <div className={`flex-1 overflow-y-auto no-scrollbar py-3 flex flex-col gap-4 ${
            isCollapsed ? 'px-2' : 'px-3'
          }`}>
            {navSections.map((section) => (
              <div key={section.id} className="space-y-1">
                {!isCollapsed && (
                  <div className="px-2 pt-1 pb-1 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-3.5 bg-red-600 rounded-full inline-block shrink-0" />
                      <span className="text-[11px] font-black tracking-wider text-slate-500 uppercase">
                        {section.title}
                      </span>
                    </div>
                    {section.tag && (
                      <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${section.tagColor || 'text-slate-600 bg-slate-100 border-slate-200'}`}>
                        {section.tag}
                      </span>
                    )}
                  </div>
                )}

                <div className="space-y-1">
                  {section.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = isItemActive(item);

                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleNavClick(item)}
                        title={item.label}
                        className={`w-full flex items-center transition-all duration-200 cursor-pointer group ${
                          isCollapsed ? 'justify-center p-2 rounded-2xl' : 'justify-between px-2.5 py-2 rounded-2xl'
                        } ${
                          isActive
                            ? `bg-gradient-to-r ${item.activeGradient || 'from-teal-700 to-emerald-600'} text-white shadow-md shadow-emerald-950/20`
                            : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100/80 font-bold'
                        }`}
                      >
                        <div className={`flex items-center min-w-0 ${isCollapsed ? 'justify-center' : 'gap-2.5'}`}>
                          {/* Squircle Icon Container */}
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all duration-200 ${
                            isActive
                              ? 'bg-white/20 text-white backdrop-blur-xs shadow-2xs'
                              : 'bg-slate-100 text-slate-500 group-hover:bg-white group-hover:text-slate-900 group-hover:shadow-xs group-hover:scale-105'
                          }`}>
                            <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white stroke-[2.2]' : 'stroke-[1.9]'}`} />
                          </div>

                          {!isCollapsed && (
                            <span className={`text-[13px] font-bold truncate tracking-tight ${
                              isActive ? 'text-white' : 'text-slate-700 group-hover:text-slate-900'
                            }`}>
                              {item.label}
                            </span>
                          )}
                        </div>

                        {!isCollapsed && (
                          <div className="flex items-center gap-2 shrink-0 ml-2">
                            {item.badge ? (
                              <span className={`text-[11px] font-black px-2 py-0.5 rounded-full ${
                                isActive
                                  ? 'bg-white text-slate-900 shadow-2xs'
                                  : 'bg-slate-100 text-slate-600 border border-slate-200/60'
                              }`}>
                                {item.badge}
                              </span>
                            ) : item.index ? (
                              isActive ? null : (
                                <span className="text-[11px] font-mono font-bold text-slate-400 group-hover:text-slate-600">
                                  {item.index}
                                </span>
                              )
                            ) : null}

                            {/* Active Glowing Dot Indicator */}
                            {isActive && (
                              <span className="w-2.5 h-2.5 rounded-full bg-white shadow-xs shrink-0" />
                            )}
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* User Card Footer (Elevated SaaS Profile Card) */}
          <div id="user-profile-menu-container" className={`border-t border-slate-100 shrink-0 relative ${isCollapsed ? 'p-2' : 'p-3'}`}>
            {isCollapsed ? (
              <div className="flex flex-col items-center gap-2.5">
                <div className="relative flex items-center justify-center">
                  <img
                    src={avatarUrl}
                    alt={displayName}
                    className="w-10 h-10 rounded-2xl object-cover ring-1 ring-slate-200/90 shadow-2xs shrink-0 cursor-pointer hover:ring-2 hover:ring-emerald-500 transition-all"
                    title={`${displayName} (${displaySubtitle})`}
                    onClick={() => setShowUserMenu(!showUserMenu)}
                  />
                  
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-8 h-8 flex items-center justify-center rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                  title="Keluar (Logout)"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <>
                <div
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center justify-between p-2 rounded-2xl hover:bg-slate-100/80 transition-all cursor-pointer group border border-transparent hover:border-slate-200/80"
                  title="Klik untuk opsi akun"
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <div className="relative shrink-0">
                      <img
                        src={avatarUrl}
                        alt={displayName}
                        className={`w-10 h-10 rounded-2xl shrink-0 shadow-2xs ${
                          isSchoolLogo
                            ? 'object-contain bg-white p-1 border border-slate-200'
                            : 'object-cover ring-1 ring-slate-200'
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
                      
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-bold text-slate-900 leading-tight truncate">
                        {displayName}
                      </div>
                      <div className="text-[11px] font-medium text-slate-400 truncate leading-tight mt-0.5">
                        {currentUser?.email || currentTeam?.email || (userRole === 'superadmin' ? 'Administrator' : 'Panitia LBB')}
                      </div>
                    </div>
                  </div>

                  <div className="p-1.5 rounded-xl text-slate-400 group-hover:text-slate-700 group-hover:bg-white transition-all shrink-0">
                    <MoreVertical className="w-4 h-4" />
                  </div>
                </div>

                {/* Popover Dropdown Akun */}
                {showUserMenu && (
                  <div className="absolute bottom-16 left-3 right-3 bg-white rounded-2xl border border-slate-200 shadow-xl p-1.5 z-50 animate-in fade-in slide-in-from-bottom-2">
                    <button
                      type="button"
                      onClick={() => {
                        setShowUserMenu(false);
                        handleLogout();
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-rose-600 hover:text-rose-700 hover:bg-rose-50 transition-colors text-left cursor-pointer"
                    >
                      <LogOut className="w-4 h-4 text-rose-500" />
                      <span>Keluar (Logout)</span>
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </aside>
      )}

      {/* 2. MOBILE DRAWER OVERLAY (Hanya untuk non-peserta, karena peserta punya drawer sendiri di atas) */}
      {!isPeserta && isMobileMenuOpen && (
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

              <div className="space-y-4 overflow-y-auto no-scrollbar flex-1 pb-2">
                {navSections.map(section => (
                  <div key={section.id} className="space-y-1">
                    <div className="px-3 pt-1 pb-1 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-3.5 bg-red-600 rounded-full inline-block shrink-0" />
                        <span className="text-[11px] font-black tracking-wider text-slate-500 uppercase">
                          {section.title}
                        </span>
                      </div>
                      {section.tag && (
                        <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${section.tagColor || 'text-slate-600 bg-slate-100 border-slate-200'}`}>
                          {section.tag}
                        </span>
                      )}
                    </div>
                    <div className="space-y-1">
                      {section.items.map(item => {
                        const Icon = item.icon;
                        const isActive = isItemActive(item);

                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => handleNavClick(item)}
                            className={`w-full flex items-center justify-between px-2.5 py-2 rounded-2xl text-[13px] transition-all cursor-pointer ${
                              isActive
                                ? `bg-gradient-to-r ${item.activeGradient || 'from-teal-700 to-emerald-600'} text-white shadow-md shadow-emerald-950/20`
                                : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100/80 font-bold'
                            }`}
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all ${
                                isActive
                                  ? 'bg-white/20 text-white backdrop-blur-xs shadow-2xs'
                                  : 'bg-slate-100 text-slate-500'
                              }`}>
                                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white stroke-[2.2]' : 'stroke-[1.9]'}`} />
                              </div>
                              <span className={`font-bold truncate tracking-tight ${isActive ? 'text-white' : 'text-slate-700'}`}>
                                {item.label}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 shrink-0 ml-2">
                              {item.badge ? (
                                <span className={`text-[11px] font-black px-2 py-0.5 rounded-full ${
                                  isActive
                                    ? 'bg-white text-slate-900 shadow-2xs'
                                    : 'bg-slate-100 text-slate-600 border border-slate-200/60'
                                }`}>
                                  {item.badge}
                                </span>
                              ) : item.index ? (
                                isActive ? null : (
                                  <span className="text-[11px] font-mono font-bold text-slate-400">
                                    {item.index}
                                  </span>
                                )
                              ) : null}
                              {isActive && (
                                <span className="w-2.5 h-2.5 rounded-full bg-white shadow-xs shrink-0" />
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
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
                      className="w-9 h-9 rounded-xl shadow-xs object-cover ring-1 ring-slate-200/80 bg-slate-900 text-[10px]"
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
                    
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-xs font-black text-slate-900 leading-tight truncate">
                        {displayName}
                      </span>
                      <span className={`text-[8px] font-black px-1.5 py-0.5 rounded-md uppercase tracking-wide shrink-0 ${
                        userRole === 'superadmin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {userRole === 'superadmin' ? 'Admin' : 'Panitia'}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono truncate mt-0.5">
                      {currentUser?.email || displaySubtitle}
                    </div>
                  </div>
                </div>

                {/* Action Button: Keluar */}
                <div className="pt-2 mt-2 border-t border-slate-200/60">
                  <button
                    type="button"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      handleLogout();
                    }}
                    className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-white hover:bg-rose-50 border border-slate-200/80 hover:border-rose-200 text-slate-600 hover:text-rose-700 text-xs font-semibold transition-all cursor-pointer shadow-2xs active:scale-95"
                  >
                    <LogOut className="w-3.5 h-3.5 text-rose-500" />
                    <span>Keluar (Logout)</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. MAIN CONTENT AREA (Offset dinamis: lg:pl-[280px] / lg:pl-[76px] saat collapsed untuk Peserta) */}
      <div className={`flex-1 flex flex-col min-w-0 pb-24 lg:pb-8 transition-all duration-300 ${
        isPeserta ? (isCollapsed ? 'lg:pl-[76px]' : 'lg:pl-[280px]') : (isCollapsed ? 'lg:pl-[72px]' : 'lg:pl-64')
      }`}>
        {/* Top Header Bar untuk Peserta (Sticky Sesuai Referensi) */}
        {isPeserta ? (
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
            {/* Sisi Kanan: Nama Peleton & Pills -> Logo Sekolah -> Tombol Keluar (Paling Kanan) */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0 min-w-0">
              {currentTeam && (
                <div className="hidden sm:flex items-center gap-2.5 md:gap-3 shrink-0 min-w-0">
                  {/* Nama Sekolah / Peleton */}
                  <div className="text-right min-w-0 max-w-[180px] md:max-w-sm">
                    <span
                      className="text-xs sm:text-sm font-black uppercase tracking-tight text-slate-900 leading-tight block truncate"
                      title={currentTeam?.schoolName || displayName}
                    >
                      {currentTeam?.schoolName || displayName}
                    </span>
                  </div>

                  {/* Logo Sekolah (Tanpa Wadah - Bersih & Rapi) */}
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
              )}

              {/* Tombol Keluar (Paling Kanan) */}
              <button
                type="button"
                onClick={handleLogout}
                className="p-2 sm:p-2.5 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 transition-all cursor-pointer shrink-0 flex items-center justify-center shadow-2xs active:scale-95"
                title="Ganti Akun Tim"
                aria-label="Ganti Akun Tim"
              >
                <LogOut className="w-4 h-4 text-red-600 shrink-0" />
              </button>
            </div>
          </header>
        ) : (
          /* Mobile-only Header Bar untuk Panitia / Staff */
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

            {/* Sisi Kanan: Tombol Logout Seragam */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleLogout}
                className="p-2 sm:p-2.5 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 transition-all cursor-pointer shrink-0 flex items-center justify-center shadow-2xs active:scale-95"
                title="Keluar (Logout)"
                aria-label="Keluar (Logout)"
              >
                <LogOut className="w-4 h-4 text-red-600 shrink-0" />
              </button>
            </div>
          </div>
        )}

        {/* Content Body */}
        <main className={`p-3 sm:p-5 lg:p-6 w-full mx-auto transition-all duration-300 ${
          fullWidth ? 'max-w-none' : (isCollapsed ? 'max-w-[1700px]' : 'max-w-7xl')
        }`}>
          {/* ======================================================== */}
          {/* STANDARDIZED EXECUTIVE COMMAND HEADER (IDENTIK DI SEMUA HALAMAN) */}
          {/* Grafis Resmi title-logo.png + Icon Modul + Judul + Aksi Cepat */}
          {/* ======================================================== */}
          {!hideHeader && (
            <div className={`relative overflow-hidden rounded-[20px] sm:rounded-2xl border border-slate-200/90 bg-white shadow-[0_4px_20px_rgba(15,23,42,0.04)] mb-4 sm:mb-6 transition-all ${
              isPeserta ? 'max-w-6xl mx-auto' : ''
            }`}>
              {/* 1. Sleek Top Ambient Accent Line (Senada dengan tema modul) */}
              <div className={`h-[3px] w-full bg-gradient-to-r ${getModuleTheme(activeMenu).accentGradient || 'from-red-600 via-amber-500 to-rose-600'}`} />

              {/* 2. Soft Ambient Background Glow (subtle & non-intrusive) */}
              <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-gradient-to-br from-amber-500/5 via-rose-500/5 to-transparent blur-2xl pointer-events-none" />
              <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-gradient-to-tr from-slate-100/60 to-transparent blur-2xl pointer-events-none" />

              <div className="relative z-10 px-3.5 py-3 sm:px-6 sm:py-4 flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4 bg-gradient-to-r from-slate-50/70 via-white to-slate-50/40">
                <div className="flex items-start sm:items-center gap-3.5 sm:gap-4 min-w-0 flex-1">
                  {/* 1. Icon Modul (Rich Gradient Themed Badge) */}
                  <div className="relative shrink-0">
                    <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl flex items-center justify-center font-bold transition-all shadow-md ${getModuleTheme(activeMenu).bg}`}>
                      {React.createElement(getModuleIcon(activeMenu), { className: `w-5 h-5 sm:w-5.5 sm:h-5.5 ${getModuleTheme(activeMenu).iconColor}` })}
                    </div>
                  </div>

                  {/* 2. Logo Title Grafis Resmi (Hanya tampil jika belum ada di top sticky navbar) */}
                  {!isPeserta && (
                    <>
                      <img
                        src={titleLogoImg}
                        alt="LBB Mu'allimin 2027"
                        className="hidden sm:block h-7 md:h-8 w-auto object-contain shrink-0"
                      />
                      <div className="hidden sm:block h-7 w-px bg-slate-200 shrink-0" />
                    </>
                  )}

                  {/* 3. Judul, Kicker & Subtitle Halaman */}
                  <div className="min-w-0 flex-1">
                    
                    <h1 className="text-sm sm:text-base md:text-lg font-black text-slate-950 tracking-tight leading-tight">
                      {title}
                    </h1>
                    {subtitle && (
                      <p className="text-[11px] sm:text-xs text-slate-500 font-medium line-clamp-2 sm:truncate max-w-2xl mt-0.5 sm:mt-1 leading-relaxed">
                        {subtitle}
                      </p>
                    )}
                  </div>
                </div>

                {/* 4. Quick Action Buttons (Sisi Kanan) */}
                <div className="flex items-center gap-2 shrink-0 self-start md:self-center flex-wrap sm:flex-nowrap pt-2 sm:pt-0 border-t border-slate-100 sm:border-0 w-full sm:w-auto justify-start sm:justify-end">
                  {rightActions ? (
                    rightActions
                  ) : (
                    (activeMenu === 'klasemen' || activeMenu === 'leaderboard' || activeMenu === 'live_leaderboard') ? (
                      <div className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200/80 text-[11px] font-bold text-slate-600 shadow-2xs">
                        <Trophy className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        <span>Jenjang SD &amp; SMP</span>
                      </div>
                    ) : null
                  )}
                </div>
              </div>
            </div>
          )}

          {children}
        </main>
      </div>

      {/* 4. FLOATING PILL MOBILE BOTTOM NAVIGATION (Dark Mode - Dynamic Island Style) */}
      <nav
        aria-label="Navigasi Menu Utama Mobile"
        className="lg:hidden fixed bottom-3.5 left-1/2 -translate-x-1/2 z-40 bg-[#0d1421]/95 backdrop-blur-2xl border border-white/15 rounded-full p-1.5 shadow-[0_16px_40px_rgba(0,0,0,0.45),0_0_1px_1px_rgba(255,255,255,0.08)] flex items-center justify-between gap-1 max-w-[92vw] sm:max-w-md transition-all duration-300 ring-1 ring-black/40"
      >
        {mobileBottomNavItems.map(item => {
          const Icon = item.icon;
          const isActive = isItemActive(item);
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleNavClick(item)}
              title={item.label}
              className={`flex items-center gap-2 transition-all duration-300 cursor-pointer select-none active:scale-95 ${
                isActive
                  ? `${item.activeBg || 'bg-gradient-to-r from-red-600 to-rose-600'} text-white px-3.5 py-2 rounded-full shadow-lg ${item.activeShadow || 'shadow-red-600/30'} font-bold text-xs ring-1 ring-white/20`
                  : 'text-slate-400 hover:text-white p-2.5 rounded-full hover:bg-white/10'
              }`}
            >
              <Icon className="w-4.5 h-4.5 shrink-0" />
              {isActive && (
                <span className="whitespace-nowrap tracking-tight animate-in fade-in duration-200 font-bold">
                  {item.label}
                </span>
              )}
            </button>
          );
        })}
      </nav>

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
