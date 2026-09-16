import React, { createContext, useContext, useState, useEffect, useMemo, useRef } from 'react';
import {
  INITIAL_TEAMS,
  INITIAL_SCORES,
  INITIAL_SETTINGS,
  INITIAL_PINS,
  INITIAL_USERS,
  INITIAL_STAGING,
  INITIAL_VOTES,
  generatePersonnels
} from '../data/seedData.js';
import { JURY_POSTS, STAGING_CONFIG, VOTING_CONFIG } from '../config.js';
import {
  saveRecordToSheet,
  bulkSyncToSheet,
  deleteRecordFromSheet,
  fetchAllDataFromSheet,
  isGoogleSheetConfigured,
  pingSheetDatabase,
  formatImageUrl
} from '../services/sheetService.js';

const CompetitionContext = createContext(null);

const STORAGE_KEYS = {
  TEAMS: 'lbb_muallimin_teams_v3',
  SCORES: 'lbb_muallimin_scores_v3',
  SETTINGS: 'lbb_muallimin_settings_v3',
  ROLE: 'lbb_muallimin_active_role_v3',
  CURRENT_TEAM_ID: 'lbb_muallimin_current_team_id_v3',
  USERS: 'lbb_muallimin_users_v4',
  CURRENT_USER: 'lbb_muallimin_current_user_v4',
  STAGING: 'lbb_muallimin_staging_v3',
  VOTES: 'lbb_muallimin_votes_v3',
  USER_VOTES: 'lbb_muallimin_user_votes_v3',
};

// Bersihkan data sampah/dummy legacy versi sebelumnya dari browser
try {
  const legacyPrefixes = ['lbb_muallimin_teams_', 'lbb_muallimin_scores_', 'lbb_muallimin_staging_', 'lbb_muallimin_votes_', 'lbb_muallimin_users_', 'lbb_muallimin_current_user_'];
  Object.keys(localStorage).forEach(k => {
    if (k.startsWith('lbb_muallimin_users_') && k !== STORAGE_KEYS.USERS) {
      localStorage.removeItem(k);
    }
    if (k.startsWith('lbb_muallimin_current_user_') && k !== STORAGE_KEYS.CURRENT_USER) {
      localStorage.removeItem(k);
    }
    if (legacyPrefixes.some(p => k.startsWith(p) && !k.endsWith('_v3') && !k.endsWith('_v4'))) {
      localStorage.removeItem(k);
    }
  });
} catch {
  // safe ignore if localStorage is restricted
}

// Resolusi foto profil:
// - Untuk peserta: Prioritas 1: Logo sekolah, Prioritas 2: Profil Google, Fallback: Inisial sekolah
// - Untuk non-peserta: Profil Google, Fallback: Inisial staff
export function resolveUserAvatar(user, teamsList = []) {
  if (!user) return null;

  if (user.role === 'peserta') {
    const matchedTeam = teamsList.find(
      t => t.id === user.teamId || (user.schoolName && t.schoolName === user.schoolName)
    );
    const schoolLogoUrl = matchedTeam?.files?.schoolLogo?.url;
    if (schoolLogoUrl && schoolLogoUrl !== '#' && !schoolLogoUrl.startsWith('#')) {
      return { url: formatImageUrl(schoolLogoUrl), isSchoolLogo: true };
    }
    if (user.googleAvatar) {
      return { url: user.googleAvatar, isSchoolLogo: false };
    }
    if (user.avatar && !user.avatar.includes('dicebear.com/7.x/bottts')) {
      return { url: user.avatar, isSchoolLogo: false };
    }
    const label = user.schoolName || user.name || 'Peserta';
    return {
      url: `https://ui-avatars.com/api/?name=${encodeURIComponent(label)}&background=8B0000&color=fff&bold=true`,
      isSchoolLogo: false,
    };
  }

  // Non-peserta (admin, superadmin, juri)
  if (user.googleAvatar) {
    return { url: user.googleAvatar, isSchoolLogo: false };
  }
  if (user.avatar && !user.avatar.includes('dicebear.com/7.x/bottts')) {
    return { url: user.avatar, isSchoolLogo: false };
  }
  const staffName = user.name || user.email || 'Admin';
  return {
    url: `https://ui-avatars.com/api/?name=${encodeURIComponent(staffName)}&background=020617&color=fbbf24&bold=true`,
    isSchoolLogo: false,
  };
}

export function normalizeTeamData(team) {
  if (!team || typeof team !== 'object') return team;
  const t = { ...team };

  if (typeof t.files === 'string') {
    try { t.files = JSON.parse(t.files); } catch (e) { t.files = {}; }
  }
  if (!t.files || typeof t.files !== 'object') {
    t.files = {};
  }

  if (typeof t.roster === 'string') {
    try { t.roster = JSON.parse(t.roster); } catch (e) { t.roster = null; }
  }
  if (!t.roster || typeof t.roster !== 'object') {
    t.roster = {
      danton: {
        name: t.dantonName || '-',
        nisn: '-',
        class: '-',
      },
      pasukan: [],
      cadangan: [],
      officials: []
    };
  } else {
    if (!t.roster.danton) {
      t.roster.danton = {
        name: t.dantonName || '-',
        nisn: '-',
        class: '-',
      };
    }
    if (!Array.isArray(t.roster.pasukan)) t.roster.pasukan = [];
    if (!Array.isArray(t.roster.cadangan)) t.roster.cadangan = [];
    if (!Array.isArray(t.roster.officials)) t.roster.officials = [];
  }

  return t;
}

export function CompetitionProvider({ children }) {
  // 0. User Auth State
  const [users, setUsers] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USERS);
      return saved ? JSON.parse(saved) : INITIAL_USERS;
    } catch {
      return INITIAL_USERS;
    }
  });

  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [authModal, setAuthModal] = useState({ isOpen: false, tab: 'login' });
  const [authTab, setAuthTab] = useState('login');

  // 1. Roles: 'publik' | 'peserta' | 'admin' | 'juri' | 'superadmin'
  const [role, setRole] = useState(() => {
    return localStorage.getItem(STORAGE_KEYS.ROLE) || 'publik';
  });

  // 2. Active View: 'landing' | 'register' | 'status_check' | 'document_viewer' | 'auth' | 'pin_auth' | 'admin' | 'juri' | 'superadmin' | 'announcement' | 'peserta_dashboard'
  const [activeView, setActiveView] = useState('landing');
  const [previousView, setPreviousView] = useState('landing');
  const [docViewerData, setDocViewerData] = useState(null);

  // 3. Teams data
  const [teams, setTeams] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TEAMS);
      const list = saved ? JSON.parse(saved) : INITIAL_TEAMS;
      return Array.isArray(list) ? list.map(normalizeTeamData) : INITIAL_TEAMS;
    } catch {
      return INITIAL_TEAMS;
    }
  });

  // 4. Scores data
  const [scores, setScores] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SCORES);
      return saved ? JSON.parse(saved) : INITIAL_SCORES;
    } catch {
      return INITIAL_SCORES;
    }
  });

  // 5. Competition settings
  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
    } catch {
      return INITIAL_SETTINGS;
    }
  });

  // 6. Current logged-in team (if role === 'peserta')
  const [currentTeamId, setCurrentTeamId] = useState(() => {
    return localStorage.getItem(STORAGE_KEYS.CURRENT_TEAM_ID) || null;
  });

  // 7. Modals
  const [activeModal, setActiveModal] = useState(null); // 'regWizard' | 'statusCheck' | 'docViewer' | 'teamDetail' | 'pinModal'
  const [modalData, setModalData] = useState(null);

  // 8. Staging & Field Operations (Fase 2)
  const [staging, setStaging] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.STAGING);
      return saved ? JSON.parse(saved) : INITIAL_STAGING;
    } catch {
      return INITIAL_STAGING;
    }
  });

  // 9. E-Voting Suporter (Fase 3)
  const [votes, setVotes] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.VOTES);
      return saved ? JSON.parse(saved) : INITIAL_VOTES;
    } catch {
      return INITIAL_VOTES;
    }
  });

  // 10. User Device Vote History (Anti-Spam Daily Limit Check)
  const [userVotes, setUserVotes] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USER_VOTES);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // 11. Stopwatch / Field Timer (Fase 2)
  const [fieldTimer, setFieldTimer] = useState({
    isRunning: false,
    elapsedSeconds: 0,
    activeTeamId: null,
  });
  const timerIntervalRef = useRef(null);

  useEffect(() => {
    if (fieldTimer.isRunning) {
      timerIntervalRef.current = setInterval(() => {
        setFieldTimer(prev => ({
          ...prev,
          elapsedSeconds: prev.elapsedSeconds + 1,
        }));
      }, 1000);
    } else if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [fieldTimer.isRunning]);

  // Sync staging, votes, userVotes to localStorage
  useEffect(() => {
    safeSetItem(STORAGE_KEYS.STAGING, JSON.stringify(staging));
  }, [staging]);

  useEffect(() => {
    safeSetItem(STORAGE_KEYS.VOTES, JSON.stringify(votes));
  }, [votes]);

  useEffect(() => {
    safeSetItem(STORAGE_KEYS.USER_VOTES, JSON.stringify(userVotes));
  }, [userVotes]);

// Helper for resilient localStorage access without crashing on QuotaExceededError
function safeSetItem(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch (e) {
    console.warn(`[CompetitionContext] Storage quota warning for key "${key}":`, e);
    // If it's TEAMS, strip out oversized base64 data URLs to save critical metadata safely
    if (key === STORAGE_KEYS.TEAMS) {
      try {
        const teamsData = JSON.parse(value);
        const slimTeams = teamsData.map(team => {
          if (!team.files) return team;
          const slimFiles = {};
          for (const [fKey, fVal] of Object.entries(team.files)) {
            if (fVal && typeof fVal === 'object') {
              const isLargeUrl = typeof fVal.url === 'string' && fVal.url.length > 50000;
              const isLargeSig = typeof fVal.signatureUrl === 'string' && fVal.signatureUrl.length > 50000;
              slimFiles[fKey] = {
                ...fVal,
                url: isLargeUrl ? '' : fVal.url,
                signatureUrl: isLargeSig ? '' : fVal.signatureUrl,
              };
            } else {
              slimFiles[fKey] = fVal;
            }
          }
          return { ...team, files: slimFiles };
        });
        localStorage.setItem(key, JSON.stringify(slimTeams));
      } catch (innerErr) {
        console.error(`[CompetitionContext] Fallback storage save failed:`, innerErr);
      }
    }
  }
}

  // Sync to localStorage
  useEffect(() => {
    safeSetItem(STORAGE_KEYS.ROLE, role);
  }, [role]);

  useEffect(() => {
    safeSetItem(STORAGE_KEYS.TEAMS, JSON.stringify(teams));
  }, [teams]);

  useEffect(() => {
    safeSetItem(STORAGE_KEYS.SCORES, JSON.stringify(scores));
  }, [scores]);

  useEffect(() => {
    safeSetItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    safeSetItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (currentUser) {
      safeSetItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(currentUser));
    } else {
      try {
        localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
      } catch (e) {
        // ignore
      }
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentTeamId) {
      safeSetItem(STORAGE_KEYS.CURRENT_TEAM_ID, currentTeamId);
    } else {
      try {
        localStorage.removeItem(STORAGE_KEYS.CURRENT_TEAM_ID);
      } catch (e) {
        // ignore
      }
    }
  }, [currentTeamId]);

  // Initial Sync: Mengambil data terbaru dari Google Sheet jika sudah terkonfigurasi
  useEffect(() => {
    if (!isGoogleSheetConfigured()) return;

    let isMounted = true;
    fetchAllDataFromSheet().then(res => {
      if (!isMounted || !res || !res.success || !res.data) return;

      const { teams: sheetTeams, scores: sheetScores, settings: sheetSettings } = res.data;

      // Update teams jika sheet memiliki data
      if (Array.isArray(sheetTeams) && sheetTeams.length > 0) {
        setTeams(prev => {
          // Gabungkan data sheet dengan prioritas data sheet terbaru
          const map = new Map();
          prev.forEach(t => map.set(t.id, normalizeTeamData(t)));
          sheetTeams.forEach(t => map.set(t.id, normalizeTeamData(t)));
          return Array.from(map.values());
        });
      }

      // Update scores jika sheet memiliki data
      if (Array.isArray(sheetScores) && sheetScores.length > 0) {
        setScores(prev => {
          const nextScores = { ...prev };
          sheetScores.forEach(sc => {
            if (sc.teamId) {
              nextScores[sc.teamId] = sc;
            }
          });
          return nextScores;
        });
      }

      // Update settings jika sheet memiliki data
      if (Array.isArray(sheetSettings) && sheetSettings.length > 0) {
        const remoteSettings = sheetSettings[0];
        if (remoteSettings) {
          setSettings(prev => ({ ...prev, ...remoteSettings }));
        }
      }
    }).catch(err => {
      console.warn('[CompetitionContext] Sync sheet on load failed:', err);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  function navigateTo(targetView, data = null) {
    setPreviousView(activeView);
    if (data) {
      setModalData(data);
      if (targetView === 'document_viewer') {
        setDocViewerData(data);
      }
    }
    setActiveView(targetView);
    try {
      window.scrollTo({ top: 0, behavior: 'instant' });
    } catch {
      window.scrollTo(0, 0);
    }
  }

  function goBack() {
    const fallback = previousView && previousView !== activeView ? previousView : 'landing';
    setActiveView(fallback);
    try {
      window.scrollTo({ top: 0, behavior: 'instant' });
    } catch {
      window.scrollTo(0, 0);
    }
  }

  function openAuthModal(tab = 'login') {
    setAuthTab(tab);
    setAuthModal({ isOpen: true, tab });
    navigateTo('auth');
  }

  function closeAuthModal() {
    setAuthModal({ isOpen: false, tab: 'login' });
    goBack();
  }

  function loginUser(email, name = null, googleAvatar = null) {
    const cleanEmail = email.trim().toLowerCase();

    // 1. Cek kredensial admin / panitia / superadmin resmi
    const OFFICIAL_STAFF_EMAILS = {
      'andiaqillah@muallimin.sch.id': { role: 'admin', roleLabel: 'Panitia Sekretariat (Admin)' },
      'tontimuallimin2026@gmail.com': { role: 'superadmin', roleLabel: 'Ketua Panitia (Superadmin)' },
    };

    if (OFFICIAL_STAFF_EMAILS[cleanEmail] || users.some(u => u.email.toLowerCase() === cleanEmail && ['admin', 'juri', 'superadmin'].includes(u.role))) {
      let user = users.find(u => u.email.toLowerCase() === cleanEmail);
      if (!user && OFFICIAL_STAFF_EMAILS[cleanEmail]) {
        const staffMeta = OFFICIAL_STAFF_EMAILS[cleanEmail];
        const staffName = name || cleanEmail.split('@')[0].toUpperCase();
        user = {
          id: `user-${Date.now()}`,
          name: staffName,
          email: cleanEmail,
          role: staffMeta.role,
          roleLabel: staffMeta.roleLabel,
          avatar: googleAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(staffName)}&background=020617&color=fbbf24&bold=true`,
          googleAvatar: googleAvatar || null,
        };
        setUsers(prev => [user, ...prev]);
      } else if (user) {
        if (googleAvatar) {
          user = {
            ...user,
            avatar: googleAvatar,
            googleAvatar,
            name: name || user.name,
          };
          setUsers(prev => prev.map(u => (u.id === user.id ? user : u)));
        }
      }

      if (user) {
        setCurrentUser(user);
        setRole(user.role);
        if (user.role === 'admin') setActiveView('admin');
        else if (user.role === 'juri') setActiveView('juri');
        else if (user.role === 'superadmin') setActiveView('superadmin');
        closeAuthModal();
        return { success: true, user };
      }
    }

    // 2. Cek pendaftaran tim peserta berdasarkan email
    const matchedTeam = teams.find(t => t.email && t.email.toLowerCase() === cleanEmail);
    const existingUser = users.find(u => u.email.toLowerCase() === cleanEmail);

    if (!matchedTeam && !existingUser) {
      return {
        success: false,
        error: 'not_registered',
        message: `Email "${cleanEmail}" belum terdaftar di pendaftaran lomba. Silakan daftarkan peleton sekolah Anda terlebih dahulu melalui menu Daftar Lomba.`
      };
    }

    const team = matchedTeam || (existingUser?.teamId ? teams.find(t => t.id === existingUser.teamId) : null);

    if (team) {
      if (team.status === 'pending') {
        return {
          success: false,
          error: 'pending_approval',
          message: `Pendaftaran peleton ${team.schoolName} (${team.regCode}) masih dalam antrean verifikasi pendaftaran awal dan BELUM DI-ACC oleh Admin. Silakan tunggu persetujuan oleh panitia sekretariat.`
        };
      }
      if (team.status === 'rejected') {
        return {
          success: false,
          error: 'rejected',
          message: `Pendaftaran peleton ${team.schoolName} ditolak oleh panitia. Silakan hubungi Sekretariat Panitia.`
        };
      }

      // Status 'registered', 'revision', 'verified', 'drawn' diizinkan masuk ke portal!
      // Foto profil untuk peserta:
      // Prioritas 1: Logo sekolah yang diunggah
      // Prioritas 2: Profil Google
      // Prioritas 3: Inisial sekolah
      const schoolLogoUrl = team.files?.schoolLogo?.url && team.files?.schoolLogo?.url !== '#' && !team.files?.schoolLogo?.url.startsWith('#')
        ? team.files.schoolLogo.url
        : null;

      const resolvedAvatar = schoolLogoUrl
        || googleAvatar
        || existingUser?.googleAvatar
        || (existingUser?.avatar && !existingUser.avatar.includes('dicebear') ? existingUser.avatar : null)
        || `https://ui-avatars.com/api/?name=${encodeURIComponent(team.schoolName)}&background=8B0000&color=fff&bold=true`;

      const user = {
        id: existingUser?.id || `user-${Date.now()}`,
        name: team.officialName || team.coachName || name || existingUser?.name || team.schoolName,
        email: cleanEmail,
        role: 'peserta',
        roleLabel: 'Calon Peserta Resmi',
        teamId: team.id,
        schoolName: team.schoolName,
        avatar: resolvedAvatar,
        googleAvatar: googleAvatar || existingUser?.googleAvatar || null,
      };

      if (!existingUser) {
        setUsers(prev => [user, ...prev]);
      } else {
        setUsers(prev => prev.map(u => (u.id === user.id ? user : u)));
      }
      setCurrentUser(user);
      setRole('peserta');
      setCurrentTeamId(team.id);
      setActiveView('peserta_dashboard');
      closeAuthModal();
      return { success: true, user };
    }

    if (existingUser) {
      setCurrentUser(existingUser);
      setRole(existingUser.role);
      if (existingUser.teamId) setCurrentTeamId(existingUser.teamId);
      setActiveView(existingUser.role === 'peserta' ? 'peserta_dashboard' : 'landing');
      closeAuthModal();
      return { success: true, user: existingUser };
    }

    return {
      success: false,
      error: 'unknown',
      message: 'Gagal melakukan otentikasi. Silakan periksa kembali email Anda.'
    };
  }

  function registerUser(name, email, password, requestedRole = 'peserta', schoolName = '') {
    const cleanEmail = email.trim().toLowerCase();
    const existing = users.find(u => u.email.toLowerCase() === cleanEmail);
    if (existing) {
      return { success: false, message: 'Email sudah terdaftar. Silakan gunakan tab Masuk.' };
    }

    const newUser = {
      id: `user-${Date.now()}`,
      name,
      email: cleanEmail,
      role: requestedRole,
      roleLabel:
        requestedRole === 'admin'
          ? 'Panitia Sekretariat'
          : requestedRole === 'juri'
          ? 'Dewan Juri'
          : requestedRole === 'superadmin'
          ? 'Ketua Panitia'
          : 'Official Peserta',
      teamId: null,
      schoolName,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name || cleanEmail)}&background=${requestedRole === 'peserta' ? '8B0000' : '020617'}&color=${requestedRole === 'peserta' ? 'fff' : 'fbbf24'}&bold=true`,
    };

    setUsers(prev => [newUser, ...prev]);
    setCurrentUser(newUser);
    setRole(newUser.role);

    if (newUser.role === 'admin') {
      setActiveView('admin');
    } else if (newUser.role === 'juri') {
      setActiveView('juri');
    } else if (newUser.role === 'superadmin') {
      setActiveView('superadmin');
    } else {
      setActiveView('peserta_dashboard');
    }

    closeAuthModal();
    return { success: true, user: newUser };
  }

  function logoutUser() {
    setCurrentUser(null);
    setRole('publik');
    setActiveView('landing');
    setCurrentTeamId(null);
  }

  // 8. Global PIN Prompt State
  const [pinPrompt, setPinPrompt] = useState({
    isOpen: false,
    targetRole: null,
    pin: '',
    error: '',
  });

  // Current active team object
  const currentTeam = teams.find(t => t.id === currentTeamId) || null;

  // --- Auth & Role Switching ---
  function switchRole(targetRole, pin = null) {
    if (targetRole === 'publik') {
      setRole('publik');
      setActiveView('landing');
      return true;
    }

    if (targetRole === 'peserta') {
      setRole('peserta');
      setActiveView(currentTeamId ? 'peserta_dashboard' : 'landing');
      return true;
    }

    // Role yang butuh PIN
    const requiredPin = INITIAL_PINS[targetRole];
    if (pin === requiredPin || pin === INITIAL_PINS.superadmin) {
      setRole(targetRole);

      // Sinkronkan data currentUser resmi sesuai role
      if (targetRole === 'admin') {
        const adminUser = users.find(u => u.email === 'andiaqillah@muallimin.sch.id') || INITIAL_USERS.find(u => u.email === 'andiaqillah@muallimin.sch.id');
        if (adminUser) setCurrentUser(adminUser);
        setActiveView('admin');
      }
      if (targetRole === 'juri') {
        setActiveView('juri');
      }
      if (targetRole === 'superadmin') {
        const superUser = users.find(u => u.email === 'tontimuallimin2026@gmail.com') || INITIAL_USERS.find(u => u.email === 'tontimuallimin2026@gmail.com');
        if (superUser) setCurrentUser(superUser);
        setActiveView('superadmin');
      }
      return true;
    }

    return false;
  }

  function requestRoleAccess(targetRole) {
    if (targetRole === 'publik') {
      switchRole('publik');
      return;
    }

    if (targetRole === 'peserta') {
      if (currentTeamId) {
        switchRole('peserta');
      } else {
        navigateTo('peserta_dashboard');
      }
      return;
    }

    if (targetRole === 'announcement') {
      setActiveView('announcement');
      return;
    }

    // If already in that role
    if (role === targetRole) {
      if (targetRole === 'admin') setActiveView('admin');
      if (targetRole === 'juri') setActiveView('juri');
      if (targetRole === 'superadmin') setActiveView('superadmin');
      return;
    }

    // Open PIN prompt as dedicated page
    setPinPrompt({
      isOpen: true,
      targetRole,
      pin: '',
      error: '',
    });
    navigateTo('pin_auth');
  }

  function closePinPrompt() {
    setPinPrompt({ isOpen: false, targetRole: null, pin: '', error: '' });
    goBack();
  }

  function submitPinPrompt(enteredPin) {
    const target = pinPrompt.targetRole;
    const success = switchRole(target, enteredPin);
    if (success) {
      setPinPrompt({ isOpen: false, targetRole: null, pin: '', error: '' });
      return true;
    } else {
      setPinPrompt(prev => ({
        ...prev,
        error: 'PIN keamanan tidak valid. Silakan periksa kembali atau hubungi Sekretariat Panitia jika Anda mengalami kendala akses.',
      }));
      return false;
    }
  }

  // --- Participant Operations ---
  function registerTeam(newTeamData) {
    const jenjang = newTeamData.jenjang || 'SMP';
    const existingSameJenjang = teams.filter(t => t.jenjang === jenjang);
    const nextNumber = String(existingSameJenjang.length + 1).padStart(3, '0');
    const regCode = `LBB26-${jenjang}-${nextNumber}`;
    const id = `TEAM-${jenjang}-${Date.now()}`;

    const createdTeam = {
      id,
      regCode,
      schoolName: newTeamData.schoolName,
      schoolBaseName: newTeamData.schoolBaseName || newTeamData.schoolName,
      teamUnit: newTeamData.teamUnit || 'Tim A',
      jenjang: newTeamData.jenjang,
      teamType: newTeamData.teamType || 'Homogen', // 'Homogen' | 'Heterogen'
      category: newTeamData.category || newTeamData.teamType || 'Homogen',
      platoonName: newTeamData.platoonName || `Pleton ${newTeamData.schoolName}`,
      dantonName: newTeamData.dantonName || '',
      officialName: newTeamData.officialName || '',
      coachName: newTeamData.officialName || '',
      waNumber: newTeamData.waNumber || '',
      email: (newTeamData.email || '').trim().toLowerCase(),
      address: newTeamData.address || '',
      status: 'pending', // Awal pendaftaran selalu 'pending' sampai di-ACC oleh Admin
      lotNumber: null,
      drawTime: null,
      registeredAt: new Date().toISOString(),
      wave: newTeamData.wave || 1,
      feeAmount: newTeamData.feeAmount || 450000,
      paymentStatus: 'paid',
      files: {
        schoolLogo: newTeamData.files?.schoolLogo || null,
        dantonCard: newTeamData.files?.dantonCard || null,
        officialKtp: newTeamData.files?.officialKtp || null,
        paymentProof: newTeamData.files?.paymentProof || null,
        selfie: newTeamData.files?.selfie || null,
        integrityPact: newTeamData.files?.integrityPact || null,
      },
      revisionNote: '',
      roster: generatePersonnels(newTeamData.schoolName, jenjang, 'Anggota'),
    };

    setTeams(prev => [createdTeam, ...prev]);

    // Kirim otomatis ke Google Sheets (Tab 'teams' otomatis terbuat jika belum ada)
    saveRecordToSheet('teams', createdTeam).catch(err => {
      console.warn('[CompetitionContext] Sync registerTeam to sheet failed:', err);
    });

    // Status PENDING: Pengguna belum otomatis login sebelum di-ACC Admin
    return createdTeam;
  }

  function loginAsTeam(identifier) {
    // Bisa pakai regCode (e.g. LBB26-SMP-001) atau No WA
    const cleanId = identifier.trim().toLowerCase();
    const found = teams.find(
      t => t.regCode.toLowerCase() === cleanId || t.waNumber.replace(/\D/g, '') === cleanId.replace(/\D/g, '')
    );
    if (found) {
      if (found.status === 'pending') {
        return {
          success: false,
          message: `Pendaftaran peleton ${found.schoolName} (${found.regCode}) masih dalam antrean verifikasi pendaftaran awal dan BELUM DI-ACC oleh Admin. Silakan tunggu persetujuan oleh panitia sekretariat.`
        };
      }
      if (found.status === 'rejected') {
        return {
          success: false,
          message: `Pendaftaran peleton ${found.schoolName} ditolak oleh panitia.`
        };
      }

      setCurrentTeamId(found.id);
      setRole('peserta');
      const schoolLogo = found.files?.schoolLogo?.url && found.files?.schoolLogo?.url !== '#' && !found.files?.schoolLogo?.url.startsWith('#')
        ? found.files.schoolLogo.url
        : null;
      const teamUser = {
        id: `user-team-${found.id}`,
        name: found.officialName || found.schoolName,
        email: found.email || '',
        role: 'peserta',
        roleLabel: 'Official Tim',
        teamId: found.id,
        schoolName: found.schoolName,
        avatar: schoolLogo || `https://ui-avatars.com/api/?name=${encodeURIComponent(found.schoolName)}&background=8B0000&color=fff&bold=true`,
      };
      setCurrentUser(teamUser);
      setActiveView('peserta_dashboard');
      return { success: true, team: found };
    }
    return { success: false, message: 'Kode Pendaftaran atau Nomor WhatsApp tidak ditemukan.' };
  }

  function logoutTeam() {
    setCurrentTeamId(null);
    setRole('publik');
    setActiveView('landing');
  }

  function updateTeamFiles(teamId, fileKey, fileData) {
    setTeams(prev =>
      prev.map(team => {
        if (team.id === teamId) {
          const updatedFiles = {
            ...team.files,
            [fileKey]: fileData,
          };
          // Jika tim berstatus 'revision', kembalikan ke 'registered' setelah re-upload
          const nextStatus = team.status === 'revision' ? 'registered' : team.status;
          return {
            ...team,
            files: updatedFiles,
            status: nextStatus,
          };
        }
        return team;
      })
    );

    // Jika yang di-upload adalah logo sekolah, sinkronkan ke avatar profil pengguna peserta
    if (fileKey === 'schoolLogo' && fileData?.url && fileData.url !== '#' && !fileData.url.startsWith('#')) {
      setCurrentUser(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          avatar: fileData.url,
        };
      });
      setUsers(prev =>
        prev.map(u => (u.teamId === teamId ? { ...u, avatar: fileData.url } : u))
      );
    }

    // Sync team update to Sheet
    const targetTeam = teams.find(t => t.id === teamId);
    if (targetTeam) {
      saveRecordToSheet('teams', {
        ...targetTeam,
        files: { ...targetTeam.files, [fileKey]: fileData },
        status: targetTeam.status === 'revision' ? 'registered' : targetTeam.status,
      }).catch(err => console.warn('[CompetitionContext] Sync file update failed:', err));
    }
  }

  function updateTeamRoster(teamId, newRoster) {
    setTeams(prev =>
      prev.map(team => {
        if (team.id === teamId) {
          const updated = {
            ...team,
            roster: newRoster,
            dantonName: newRoster?.danton?.name || team.dantonName,
          };
          saveRecordToSheet('teams', updated).catch(err =>
            console.warn('[CompetitionContext] Sync updateTeamRoster failed:', err)
          );
          return updated;
        }
        return team;
      })
    );
  }

  // --- Admin Operations ---
  function verifyTeam(teamId, newStatus, note = '') {
    setTeams(prev =>
      prev.map(team => {
        if (team.id === teamId) {
          const updated = {
            ...team,
            status: newStatus,
            revisionNote: note,
          };
          saveRecordToSheet('teams', updated).catch(err =>
            console.warn('[CompetitionContext] Sync verifyTeam failed:', err)
          );
          return updated;
        }
        return team;
      })
    );
  }

  function assignLotNumber(teamId, lotNumber) {
    setTeams(prev =>
      prev.map(team => {
        if (team.id === teamId) {
          const num = lotNumber ? parseInt(lotNumber, 10) : null;
          const nextStatus = num ? 'drawn' : (team.status === 'drawn' ? 'verified' : team.status);
          const updated = {
            ...team,
            lotNumber: num,
            status: nextStatus,
            drawTime: num ? new Date().toISOString() : null,
          };
          saveRecordToSheet('teams', updated).catch(err =>
            console.warn('[CompetitionContext] Sync assignLot failed:', err)
          );
          return updated;
        }
        return team;
      })
    );
  }

  function randomizeLotNumbers(jenjang) {
    // Ambil semua tim jenjang ini yang terverifikasi (status 'verified' atau 'drawn')
    const eligibleTeams = teams.filter(t => t.jenjang === jenjang && (t.status === 'verified' || t.status === 'drawn'));
    if (eligibleTeams.length === 0) return 0;

    // Buat array nomor 1 s.d. jumlah tim
    const numbers = Array.from({ length: eligibleTeams.length }, (_, i) => i + 1);
    // Shuffle array (Fisher-Yates)
    for (let i = numbers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
    }

    const idToNumber = {};
    eligibleTeams.forEach((t, idx) => {
      idToNumber[t.id] = numbers[idx];
    });

    const nowIso = new Date().toISOString();
    setTeams(prev =>
      prev.map(t => {
        if (idToNumber[t.id] !== undefined) {
          const updated = {
            ...t,
            lotNumber: idToNumber[t.id],
            status: 'drawn',
            drawTime: nowIso,
          };
          saveRecordToSheet('teams', updated).catch(err =>
            console.warn('[CompetitionContext] Sync randomizeLot failed:', err)
          );
          return updated;
        }
        return t;
      })
    );

    return eligibleTeams.length;
  }

  function deleteTeam(teamId) {
    setTeams(prev => prev.filter(t => t.id !== teamId));
    deleteRecordFromSheet('teams', teamId).catch(err =>
      console.warn('[CompetitionContext] Sync deleteTeam failed:', err)
    );
    if (scores[teamId]) {
      setScores(prev => {
        const next = { ...prev };
        delete next[teamId];
        return next;
      });
      deleteRecordFromSheet('scores', teamId).catch(err =>
        console.warn('[CompetitionContext] Sync deleteScore failed:', err)
      );
    }
  }

  // --- Jury & Scoring Operations ---
  function saveScore(teamId, scoreData) {
    const pbbVal = Number(scoreData.pbb?.total || 0);
    const dantonVal = Number(scoreData.danton?.total || 0);
    const vaforVal = Number(scoreData.vafor?.total || 0);
    const penaltyVal = Number(scoreData.penalties?.totalPenalty || 0);

    const finalScore = Math.max(0, (pbbVal + dantonVal + vaforVal) - penaltyVal);

    const record = {
      teamId,
      juryName: scoreData.juryName || 'Dewan Juri LBB Muallimin',
      juryRole: scoreData.juryRole || 'Juri Lapangan',
      scoredAt: new Date().toISOString(),
      danton: scoreData.danton,
      pbb: scoreData.pbb,
      vafor: scoreData.vafor,
      penalties: scoreData.penalties,
      finalScore: parseFloat(finalScore.toFixed(2)),
      notes: scoreData.notes || '',
    };

    setScores(prev => ({
      ...prev,
      [teamId]: record,
    }));

    // Sinkronkan nilai juri ke Google Sheet (Tab 'scores' otomatis dibuat jika belum ada)
    saveRecordToSheet('scores', { id: teamId, ...record }).catch(err =>
      console.warn('[CompetitionContext] Sync saveScore to sheet failed:', err)
    );

    return record;
  }

  // Multi-Juri Scoring Engine (Pos 1: PBB, Pos 2: Vafor & Kostum, Pos 3: Danton)
  function saveJuryPostScore(teamId, postKey, postScoreData) {
    let updatedRecord = null;
    setScores(prev => {
      const currentTeamScore = prev[teamId] || {
        teamId,
        juries: {},
        penalties: {
          upacara: false,
          dp1: false,
          personelKurang: false,
          overTimeBlocks: 0,
          injakGarisCount: 0,
          penyesuaianCount: 0,
          totalPenalty: 0,
        },
        notes: '',
      };

      const updatedJuries = {
        ...(currentTeamScore.juries || {}),
        [postKey]: {
          ...postScoreData,
          savedAt: new Date().toISOString(),
        },
      };

      // Recalculate combined penalties
      const incomingPen = postScoreData.penalties || currentTeamScore.penalties || {};
      let totalPenalty = 0;
      if (incomingPen.upacara) totalPenalty += 150;
      if (incomingPen.dp1) totalPenalty += 100;
      if (incomingPen.personelKurang) totalPenalty += 75;
      totalPenalty += (incomingPen.overTimeBlocks || 0) * 50;
      totalPenalty += (incomingPen.injakGarisCount || 0) * 50;
      if ((incomingPen.penyesuaianCount || 0) > 3) totalPenalty += 25;
      const mergedPenalties = {
        ...incomingPen,
        totalPenalty,
      };

      // Extract Pos 1 (PBB)
      const pbbTotal = updatedJuries.pos1?.total !== undefined
        ? Number(updatedJuries.pos1.total)
        : (currentTeamScore.pbb?.total !== undefined ? Number(currentTeamScore.pbb.total) : 85);

      // Extract Pos 2 (Vafor & Kerapian)
      const vaforTotal = updatedJuries.pos2?.total !== undefined
        ? Number(updatedJuries.pos2.total)
        : (currentTeamScore.vafor?.total !== undefined ? Number(currentTeamScore.vafor.total) : 84);

      // Extract Pos 3 (Danton)
      const dantonTotal = updatedJuries.pos3?.total !== undefined
        ? Number(updatedJuries.pos3.total)
        : (currentTeamScore.danton?.total !== undefined ? Number(currentTeamScore.danton.total) : 85);

      // Grand Total: Pos 1 + Pos 2 + Pos 3 - Penalti
      const finalScore = Math.max(0, parseFloat((pbbTotal + vaforTotal + dantonTotal - totalPenalty).toFixed(2)));

      updatedRecord = {
        ...currentTeamScore,
        id: teamId,
        teamId,
        juries: updatedJuries,
        penalties: mergedPenalties,
        pbb: updatedJuries.pos1 ? { ...updatedJuries.pos1, total: pbbTotal } : (currentTeamScore.pbb || { total: pbbTotal }),
        vafor: updatedJuries.pos2 ? { ...updatedJuries.pos2, total: vaforTotal } : (currentTeamScore.vafor || { total: vaforTotal }),
        danton: updatedJuries.pos3 ? { ...updatedJuries.pos3, total: dantonTotal } : (currentTeamScore.danton || { total: dantonTotal }),
        finalScore,
        scoredAt: new Date().toISOString(),
        lastUpdatedBy: postScoreData.juryName || 'Juri Pos',
        isLocked: Boolean(updatedJuries.pos1 && updatedJuries.pos2 && updatedJuries.pos3),
        notes: postScoreData.notes || currentTeamScore.notes || '',
      };

      return {
        ...prev,
        [teamId]: updatedRecord,
      };
    });

    if (updatedRecord) {
      saveRecordToSheet('scores', updatedRecord).catch(err =>
        console.warn('[CompetitionContext] Sync saveJuryPostScore to sheet failed:', err)
      );
    }

    return updatedRecord;
  }

  function getAggregatedScore(teamId) {
    return scores[teamId] || null;
  }

  // --- Staging & Field Operations (Fase 2) ---
  function updateTeamStaging(teamId, newStage, updates = {}) {
    setStaging(prev => {
      const current = prev[teamId] || {
        teamId,
        stage: 'waiting',
        checklist: {},
        durationSeconds: 0,
        overtimePenaltyBlocks: 0,
        notes: '',
      };

      const next = {
        ...current,
        stage: newStage,
        ...updates,
        checklist: {
          ...(current.checklist || {}),
          ...(updates.checklist || {}),
        },
        updatedAt: new Date().toISOString(),
      };

      if (newStage === 'arena' && !next.enteredArenaAt) {
        next.enteredArenaAt = new Date().toISOString();
      }
      if (newStage === 'finished' && !next.finishedAt) {
        next.finishedAt = new Date().toISOString();
      }

      return {
        ...prev,
        [teamId]: next,
      };
    });
  }

  // Stopwatch / Timer Controls
  function startFieldTimer(teamId) {
    setFieldTimer({
      isRunning: true,
      elapsedSeconds: 0,
      activeTeamId: teamId,
    });
    updateTeamStaging(teamId, 'arena');
  }

  function pauseFieldTimer() {
    setFieldTimer(prev => ({ ...prev, isRunning: false }));
  }

  function resumeFieldTimer() {
    setFieldTimer(prev => ({ ...prev, isRunning: true }));
  }

  function resetFieldTimer() {
    setFieldTimer({
      isRunning: false,
      elapsedSeconds: 0,
      activeTeamId: null,
    });
  }

  function stopAndSaveFieldTimer(teamId, jenjang = 'SMP') {
    const maxSeconds = jenjang === 'SD' ? STAGING_CONFIG.DURATIONS.SD : STAGING_CONFIG.DURATIONS.SMP;
    const elapsed = fieldTimer.elapsedSeconds;
    const overtimeSeconds = Math.max(0, elapsed - maxSeconds);
    const overtimeBlocks = Math.ceil(overtimeSeconds / 30);

    updateTeamStaging(teamId, 'finished', {
      durationSeconds: elapsed,
      overtimePenaltyBlocks: overtimeBlocks,
    });

    // Otomatis sinkronkan penalti overtime ke data skor tim
    setScores(prev => {
      const existing = prev[teamId];
      if (!existing) return prev;
      const pen = {
        ...(existing.penalties || {}),
        overTimeBlocks: overtimeBlocks,
      };
      let totalPenalty = 0;
      if (pen.upacara) totalPenalty += 150;
      if (pen.dp1) totalPenalty += 100;
      if (pen.personelKurang) totalPenalty += 75;
      totalPenalty += (pen.overTimeBlocks || 0) * 50;
      totalPenalty += (pen.injakGarisCount || 0) * 50;
      if ((pen.penyesuaianCount || 0) > 3) totalPenalty += 25;
      pen.totalPenalty = totalPenalty;

      const pbbTotal = existing.pbb?.total || 0;
      const vaforTotal = existing.vafor?.total || 0;
      const dantonTotal = existing.danton?.total || 0;
      const finalScore = Math.max(0, parseFloat((pbbTotal + vaforTotal + dantonTotal - totalPenalty).toFixed(2)));

      return {
        ...prev,
        [teamId]: {
          ...existing,
          penalties: pen,
          finalScore,
        },
      };
    });

    resetFieldTimer();
  }

  // --- E-Voting Suporter (Fase 3) ---
  function getTodayKey() {
    return new Date().toISOString().slice(0, 10);
  }

  function hasVotedToday(teamId, category = 'peleton') {
    const today = getTodayKey();
    const voteKey = `${teamId}_${category}`;
    return Boolean(userVotes[today]?.[voteKey]);
  }

  function castVote(teamId, category = 'peleton') {
    const today = getTodayKey();
    const voteKey = `${teamId}_${category}`;

    if (userVotes[today]?.[voteKey]) {
      return {
        success: false,
        message: 'Perangkat Anda sudah memberikan suara untuk kategori ini hari ini. Kuota harian diperbarui besok.',
      };
    }

    setVotes(prev => {
      const cur = prev[teamId] || { peleton: 0, danton: 0 };
      return {
        ...prev,
        [teamId]: {
          ...cur,
          [category]: (cur[category] || 0) + 1,
        },
      };
    });

    setUserVotes(prev => {
      const todayVotes = prev[today] || {};
      return {
        ...prev,
        [today]: {
          ...todayVotes,
          [voteKey]: true,
        },
      };
    });

    return {
      success: true,
      message: 'Alhamdulillah! Dukungan Anda untuk pleton sekolah berhasil dicatat.',
    };
  }

  // --- Superadmin / System Settings Operations ---
  function updateSettings(newSettings) {
    setSettings(prev => ({ ...prev, ...newSettings }));
  }

  function resetToSeedData() {
    setTeams(INITIAL_TEAMS);
    setScores(INITIAL_SCORES);
    setSettings(INITIAL_SETTINGS);
    setStaging(INITIAL_STAGING);
    setVotes(INITIAL_VOTES);
    setUserVotes({});
    setFieldTimer({ isRunning: false, elapsedSeconds: 0, activeTeamId: null });
    setRole('publik');
    setActiveView('landing');
    setCurrentTeamId(null);
    localStorage.removeItem(STORAGE_KEYS.TEAMS);
    localStorage.removeItem(STORAGE_KEYS.SCORES);
    localStorage.removeItem(STORAGE_KEYS.SETTINGS);
    localStorage.removeItem(STORAGE_KEYS.STAGING);
    localStorage.removeItem(STORAGE_KEYS.VOTES);
    localStorage.removeItem(STORAGE_KEYS.USER_VOTES);
    localStorage.removeItem(STORAGE_KEYS.ROLE);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_TEAM_ID);
  }

  // --- Page / Modal Navigation Helpers ---
  function openModal(modalName, data = null) {
    setModalData(data);
    if (modalName === 'regWizard') {
      navigateTo('register');
    } else if (modalName === 'statusCheck') {
      navigateTo('status_check');
    } else if (modalName === 'docViewer') {
      setDocViewerData(data);
      navigateTo('document_viewer', data);
    } else if (modalName === 'pinModal') {
      navigateTo('pin_auth');
    } else {
      setActiveModal(modalName);
    }
  }

  function closeModal() {
    setActiveModal(null);
    setModalData(null);
    goBack();
  }

  // --- Export Data ---
  function exportTeamsCSV() {
    const headers = [
      'Kode Registrasi',
      'Nama Sekolah',
      'Jenjang',
      'Kategori',
      'Nama Peleton',
      'Status Verifikasi',
      'No Undian',
      'Nama Pembina',
      'No WA',
      'Email',
      'Biaya (Rp)',
      'Status Bayar',
      'Tanggal Daftar'
    ];

    // Helper sanitasi CSV Formula Injection (CWE-1236)
    const sanitizeCsvCell = (val) => {
      if (val === null || val === undefined) return '""';
      let str = String(val).replace(/"/g, '""');
      // Bila diawali simbol kalkulasi excel/csv, prefix dengan tanda petik tunggal (')
      if (/^[=+\-@\t\r]/.test(str)) {
        str = `'${str}`;
      }
      return `"${str}"`;
    };

    const rows = teams.map(t => [
      sanitizeCsvCell(t.regCode),
      sanitizeCsvCell(t.schoolName),
      sanitizeCsvCell(t.jenjang),
      sanitizeCsvCell(t.category),
      sanitizeCsvCell(t.platoonName),
      sanitizeCsvCell(t.status ? t.status.toUpperCase() : ''),
      sanitizeCsvCell(t.lotNumber || '-'),
      sanitizeCsvCell(t.coachName),
      sanitizeCsvCell(t.waNumber),
      sanitizeCsvCell(t.email),
      sanitizeCsvCell(t.feeAmount),
      sanitizeCsvCell(t.paymentStatus),
      sanitizeCsvCell(new Date(t.registeredAt).toLocaleString('id-ID')),
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Rekap_Pendaftar_LBB_Muallimin_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  const contextValue = useMemo(
    () => ({
      // State & Navigation
      role,
      activeView,
      setActiveView,
      previousView,
      navigateTo,
      goBack,
      teams,
      scores,
      settings,
      currentTeam,
      currentTeamId,
      activeModal,
      modalData,
      docViewerData,
      setDocViewerData,

      // User Auth
      currentUser,
      users,
      authModal,
      authTab,
      setAuthTab,
      openAuthModal,
      closeAuthModal,
      loginUser,
      registerUser,
      logoutUser,
      getUserAvatar: (u = currentUser) => resolveUserAvatar(u, teams),

      // Auth & Role
      switchRole,
      loginAsTeam,
      logoutTeam,
      pinPrompt,
      setPinPrompt,
      requestRoleAccess,
      closePinPrompt,
      submitPinPrompt,

      // Teams
      registerTeam,
      updateTeamFiles,
      updateTeamRoster,
      verifyTeam,
      assignLotNumber,
      randomizeLotNumbers,
      deleteTeam,

      // Scoring (Fase 1)
      saveScore,
      saveJuryPostScore,
      getAggregatedScore,

      // Staging & Field Operations (Fase 2)
      staging,
      updateTeamStaging,
      fieldTimer,
      startFieldTimer,
      pauseFieldTimer,
      resumeFieldTimer,
      resetFieldTimer,
      stopAndSaveFieldTimer,

      // E-Voting Suporter (Fase 3)
      votes,
      castVote,
      hasVotedToday,

      // Settings & System
      updateSettings,
      resetToSeedData,
      exportTeamsCSV,

      // Google Spreadsheet Database Sync Operations
      isGoogleSheetConfigured: isGoogleSheetConfigured(),
      pingSheetDatabase,
      syncAllToGoogleSheet: async () => {
        const results = {};
        if (teams.length > 0) {
          results.teams = await bulkSyncToSheet('teams', teams);
        }
        const scoreArray = Object.values(scores).map(s => ({ id: s.teamId, ...s }));
        if (scoreArray.length > 0) {
          results.scores = await bulkSyncToSheet('scores', scoreArray);
        }
        results.settings = await saveRecordToSheet('settings', { id: 'competition_settings', ...settings });
        return results;
      },
      pullFromGoogleSheet: async () => {
        const res = await fetchAllDataFromSheet();
        if (res && res.success && res.data) {
          const { teams: sheetTeams, scores: sheetScores, settings: sheetSettings } = res.data;
          if (Array.isArray(sheetTeams) && sheetTeams.length > 0) {
            setTeams(sheetTeams.map(normalizeTeamData));
          }
          if (Array.isArray(sheetScores) && sheetScores.length > 0) {
            const nextScores = {};
            sheetScores.forEach(sc => {
              if (sc.teamId) nextScores[sc.teamId] = sc;
            });
            setScores(nextScores);
          }
          if (Array.isArray(sheetSettings) && sheetSettings[0]) {
            setSettings(prev => ({ ...prev, ...sheetSettings[0] }));
          }
        }
        return res;
      },

      // Modals / Pages Navigation
      openModal,
      closeModal,
    }),
    [
      role,
      activeView,
      previousView,
      teams,
      scores,
      settings,
      currentTeam,
      currentTeamId,
      activeModal,
      modalData,
      docViewerData,
      currentUser,
      users,
      authModal,
      authTab,
      pinPrompt,
      staging,
      votes,
      userVotes,
      fieldTimer,
    ]
  );

  return (
    <CompetitionContext.Provider value={contextValue}>
      {children}
    </CompetitionContext.Provider>
  );
}

export function useCompetition() {
  const context = useContext(CompetitionContext);
  if (!context) {
    throw new Error('useCompetition must be used within a CompetitionProvider');
  }
  return context;
}
