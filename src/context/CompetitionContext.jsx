import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  INITIAL_TEAMS,
  INITIAL_SCORES,
  INITIAL_SETTINGS,
  INITIAL_USERS,
  INITIAL_STAGING
} from '../data/seedData.js';
import {
  saveRecordToSheet,
  bulkSyncToSheet,
  fetchAllDataFromSheet,
  isGoogleSheetConfigured,
  pingSheetDatabase
} from '../services/sheetService.js';

// Modular helpers & actions
import {
  STORAGE_KEYS,
  cleanLegacyStorage,
  safeSetItem,
  checkTeamVerificationEligibility,
  resolveUserAvatar,
  normalizeTeamData
} from './competitionHelpers.js';
import { useFieldTimer } from './useFieldTimer.js';
import { createScoringActions } from './scoringActions.js';
import { createStagingActions } from './stagingActions.js';
import { createTeamActions } from './teamActions.js';

// Re-export helpers for backward compatibility
export { checkTeamVerificationEligibility, resolveUserAvatar, normalizeTeamData };

// Clean legacy storage on module init
cleanLegacyStorage();

const CompetitionContext = createContext(null);

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

  // 2. Active View
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
      if (!saved) return INITIAL_SETTINGS;
      const parsed = JSON.parse(saved);
      return {
        ...INITIAL_SETTINGS,
        ...parsed,
        eventDates: {
          ...INITIAL_SETTINGS.eventDates,
          ...(parsed.eventDates || {}),
        }
      };
    } catch {
      return INITIAL_SETTINGS;
    }
  });

  // 6. Current logged-in team (if role === 'peserta')
  const [currentTeamId, setCurrentTeamId] = useState(() => {
    return localStorage.getItem(STORAGE_KEYS.CURRENT_TEAM_ID) || null;
  });

  // 7. Modals
  const [activeModal, setActiveModal] = useState(null);
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

  // 9. Stage Routing State
  const [adminActiveTab, setAdminActiveTab] = useState('registration');
  const [stagingActiveMode, setStagingActiveMode] = useState('pipeline');
  const [stagingBasecampAction, setStagingBasecampAction] = useState('checkin');

  function navigateToStage(stageId) {
    if (stageId === 'pendaftaran') {
      setAdminActiveTab('registration');
      setActiveView('admin');
    } else if (stageId === 'tm') {
      setActiveView('tm');
    } else if (stageId === 'uji_coba') {
      setActiveView('field_trial');
    } else if (stageId === 'checkin') {
      setActiveView('checkin');
    } else if (stageId === 'dp') {
      setActiveView('dp');
    } else if (stageId === 'penjurian') {
      setActiveView('juri');
    } else if (stageId === 'rekap_nilai') {
      setActiveView('rekap_nilai');
    } else if (stageId === 'klasemen') {
      setActiveView('live_leaderboard');
    } else if (stageId === 'checkout') {
      setActiveView('checkout');
    } else if (stageId === 'superadmin') {
      setActiveView('superadmin');
    } else {
      setActiveView(stageId);
    }
    try {
      window.scrollTo({ top: 0, behavior: 'instant' });
    } catch {
      window.scrollTo(0, 0);
    }
  }

  // Multi-Role Authorization Matrix Helper
  const canAccessStage = (stageId, targetRole = role) => {
    const userR = currentUser?.role || targetRole || 'publik';
    if (userR === 'superadmin') return true;
    if (userR === 'publik') return ['klasemen', 'uji_coba'].includes(stageId);
    if (userR === 'peserta') return ['tm', 'uji_coba', 'klasemen'].includes(stageId);
    if (userR === 'checkin') return ['checkin', 'checkout'].includes(stageId);
    if (userR === 'dp' || userR === 'staging') return ['dp', 'uji_coba'].includes(stageId);
    if (userR === 'juri') return ['penjurian'].includes(stageId);
    if (userR === 'penginput') return ['penjurian', 'rekap_nilai'].includes(stageId);
    if (userR === 'verifikator') return ['rekap_nilai', 'klasemen'].includes(stageId);
    if (userR === 'finalisator') return ['rekap_nilai', 'klasemen'].includes(stageId);
    if (userR === 'admin') return ['pendaftaran', 'tm', 'uji_coba', 'klasemen'].includes(stageId);
    return false;
  };

  // Modular Staging Actions
  const {
    updateTeamStaging,
    checkInBasecamp,
    checkOutBasecamp,
    updateDP1PersonnelInspection,
    passToDP2
  } = useMemo(() => createStagingActions({ staging, setStaging, currentUser }), [staging, currentUser]);

  // Modular Field Timer
  const {
    fieldTimer,
    startFieldTimer,
    pauseFieldTimer,
    resumeFieldTimer,
    resetFieldTimer,
    stopAndSaveFieldTimer
  } = useFieldTimer({ updateTeamStaging, setScores });

  // Modular Team Actions
  const {
    registerTeam,
    updateTeamFiles,
    updateTeamRoster,
    verifyTeam,
    assignLotNumber,
    updateTeamDraw,
    randomizeLotNumbers,
    deleteTeam
  } = useMemo(
    () => createTeamActions({ teams, setTeams, scores, setScores, setCurrentUser, setUsers }),
    [teams, scores]
  );

  // Modular Scoring Actions
  const {
    saveScore,
    saveJuryPostScore,
    saveDraftScore,
    verifyScore,
    finalizeScore
  } = useMemo(() => createScoringActions({ setScores, currentUser }), [currentUser]);

  function getAggregatedScore(teamId) {
    return scores[teamId] || null;
  }

  // Local Storage Synchronizations
  useEffect(() => {
    safeSetItem(STORAGE_KEYS.STAGING, JSON.stringify(staging));
  }, [staging]);

  useEffect(() => {
    safeSetItem(STORAGE_KEYS.ROLE, role);
  }, [role]);

  useEffect(() => {
    safeSetItem(STORAGE_KEYS.TEAMS, JSON.stringify(teams));
  }, [teams]);

  useEffect(() => {
    const isStaffOrJury = ['admin', 'juri', 'superadmin'].includes(role);
    if (isStaffOrJury || settings.announcementPublished) {
      safeSetItem(STORAGE_KEYS.SCORES, JSON.stringify(scores));
    } else {
      try {
        localStorage.removeItem(STORAGE_KEYS.SCORES);
      } catch (e) {}
    }
  }, [scores, role, settings.announcementPublished]);

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
      } catch (e) {}
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentTeamId) {
      safeSetItem(STORAGE_KEYS.CURRENT_TEAM_ID, currentTeamId);
    } else {
      try {
        localStorage.removeItem(STORAGE_KEYS.CURRENT_TEAM_ID);
      } catch (e) {}
    }
  }, [currentTeamId]);

  // Initial & Role-Based Sync: Mengambil data terbaru dari Google Sheet jika sudah terkonfigurasi
  useEffect(() => {
    if (!isGoogleSheetConfigured()) return;

    const isStaffOrJury = ['admin', 'juri', 'superadmin'].includes(role);
    const allowScoresSync = isStaffOrJury || Boolean(settings.announcementPublished);

    let isMounted = true;
    fetchAllDataFromSheet(allowScoresSync).then(res => {
      if (!isMounted || !res || !res.success || !res.data) return;

      const { teams: sheetTeams, scores: sheetScores, settings: sheetSettings } = res.data;

      if (Array.isArray(sheetTeams) && sheetTeams.length > 0) {
        setTeams(prev => {
          const map = new Map();
          prev.forEach(t => map.set(t.id, normalizeTeamData(t)));

          sheetTeams.forEach(rawSheetTeam => {
            const normalizedSheetTeam = normalizeTeamData(rawSheetTeam);
            const existing = map.get(normalizedSheetTeam.id);

            if (existing) {
              const mergedFiles = {
                ...existing.files,
                ...normalizedSheetTeam.files,
              };
              Object.keys(existing.files || {}).forEach(k => {
                if (existing.files[k]?.url && (!mergedFiles[k]?.url || mergedFiles[k]?.url === '#')) {
                  mergedFiles[k] = existing.files[k];
                }
              });

              const existingRoster = existing.roster || {};
              const sheetRoster = normalizedSheetTeam.roster || {};

              const mergedDanton = {
                ...existingRoster.danton,
                ...sheetRoster.danton,
                name: (sheetRoster.danton?.name && sheetRoster.danton.name !== '-' && sheetRoster.danton.name !== 'Anggota Pratama') 
                  ? sheetRoster.danton.name 
                  : (existingRoster.danton?.name || existing.dantonName || normalizedSheetTeam.dantonName || '-'),
                photo: (sheetRoster.danton?.photo && sheetRoster.danton.photo !== '#' && !sheetRoster.danton.photo.startsWith('#'))
                  ? sheetRoster.danton.photo
                  : (existingRoster.danton?.photo || null),
              };

              const sheetPasukan = Array.isArray(sheetRoster.pasukan) ? sheetRoster.pasukan : [];
              const existingPasukan = Array.isArray(existingRoster.pasukan) ? existingRoster.pasukan : [];
              const maxPasukanLen = Math.max(sheetPasukan.length, existingPasukan.length, 21);
              const mergedPasukan = [];

              for (let i = 0; i < maxPasukanLen; i++) {
                const sP = sheetPasukan[i];
                const eP = existingPasukan[i];
                if (!sP && !eP) continue;

                const pId = sP?.id || eP?.id || `p-${i + 1}`;
                const safNumber = sP?.safNumber || eP?.safNumber || Math.ceil((i + 1) / 7);
                const banjarNumber = sP?.banjarNumber || eP?.banjarNumber || (((i) % 7) + 1);

                mergedPasukan.push({
                  id: pId,
                  role: 'pasukan',
                  safNumber,
                  banjarNumber,
                  name: (sP?.name && sP.name !== '-') ? sP.name : (eP?.name || ''),
                  nisn: (sP?.nisn && sP.nisn !== '-') ? sP.nisn : (eP?.nisn || ''),
                  class: (sP?.class && sP.class !== '-') ? sP.class : (eP?.class || ''),
                  birthPlace: sP?.birthPlace || eP?.birthPlace || '',
                  birthDate: sP?.birthDate || eP?.birthDate || '',
                  photo: (sP?.photo && sP.photo !== '#' && !sP.photo.startsWith('#'))
                    ? sP.photo
                    : (eP?.photo || null),
                });
              }

              const sheetCadangan = Array.isArray(sheetRoster.cadangan) ? sheetRoster.cadangan : [];
              const existingCadangan = Array.isArray(existingRoster.cadangan) ? existingRoster.cadangan : [];
              const maxCadLen = Math.max(sheetCadangan.length, existingCadangan.length, 3);
              const mergedCadangan = [];

              for (let i = 0; i < maxCadLen; i++) {
                const sC = sheetCadangan[i];
                const eC = existingCadangan[i];
                if (!sC && !eC) continue;
                mergedCadangan.push({
                  id: sC?.id || eC?.id || `c-${i + 1}`,
                  role: 'cadangan',
                  name: (sC?.name && sC.name !== '-') ? sC.name : (eC?.name || ''),
                  nisn: (sC?.nisn && sC.nisn !== '-') ? sC.nisn : (eC?.nisn || ''),
                  class: (sC?.class && sC.class !== '-') ? sC.class : (eC?.class || ''),
                  birthPlace: sC?.birthPlace || eC?.birthPlace || '',
                  birthDate: sC?.birthDate || eC?.birthDate || '',
                  photo: (sC?.photo && sC.photo !== '#' && !sC.photo.startsWith('#'))
                    ? sC.photo
                    : (eC?.photo || null),
                });
              }

              const sheetOfficials = Array.isArray(sheetRoster.officials) ? sheetRoster.officials : [];
              const existingOfficials = Array.isArray(existingRoster.officials) ? existingRoster.officials : [];
              const maxOffLen = Math.max(sheetOfficials.length, existingOfficials.length, 3);
              const mergedOfficials = [];

              const defaultRoles = [
                'Official (Pelatih / Pembina)',
                'Pendukung 1 (Medis / Dokum)',
                'Pendukung 2 (Medis / Dokum)'
              ];

              for (let i = 0; i < maxOffLen; i++) {
                const sO = sheetOfficials[i];
                const eO = existingOfficials[i];
                if (!sO && !eO && i >= 3) continue;
                mergedOfficials.push({
                  id: sO?.id || eO?.id || `off-${i + 1}`,
                  role: sO?.role || eO?.role || defaultRoles[i] || `Pendukung ${i + 1}`,
                  category: i === 0 ? 'official' : 'pendukung',
                  name: (sO?.name && sO.name !== '-') ? sO.name : (eO?.name || ''),
                  phone: sO?.phone || eO?.phone || '',
                  photo: (sO?.photo && sO.photo !== '#' && !sO.photo.startsWith('#'))
                    ? sO.photo
                    : (eO?.photo || null),
                });
              }

              map.set(normalizedSheetTeam.id, {
                ...existing,
                ...normalizedSheetTeam,
                files: mergedFiles,
                roster: {
                  danton: mergedDanton,
                  pasukan: mergedPasukan,
                  cadangan: mergedCadangan,
                  officials: mergedOfficials,
                },
                dantonName: mergedDanton.name || normalizedSheetTeam.dantonName || existing.dantonName,
              });
            } else {
              map.set(normalizedSheetTeam.id, normalizedSheetTeam);
            }
          });

          return Array.from(map.values());
        });
      }

      if (allowScoresSync && Array.isArray(sheetScores) && sheetScores.length > 0) {
        setScores(prev => {
          const nextScores = { ...prev };
          sheetScores.forEach(sc => {
            if (sc.teamId) nextScores[sc.teamId] = sc;
          });
          return nextScores;
        });
      }

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
  }, [role, settings.announcementPublished]);

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

  function closeAuthModal(targetView = null) {
    setAuthModal({ isOpen: false, tab: 'login' });
    if (targetView) {
      setActiveView(targetView);
    } else if (activeView === 'auth') {
      goBack();
    }
  }

  async function loginUser(email, name = null, googleAvatar = null) {
    const rawEmail = String(email || '').trim().toLowerCase();
    const normalizeGmail = (e) => {
      const parts = String(e || '').trim().toLowerCase().split('@');
      if (parts.length !== 2) return e;
      if (parts[1] === 'gmail.com' || parts[1] === 'googlemail.com') {
        const username = parts[0].replace(/\./g, '').split('+')[0];
        return `${username}@gmail.com`;
      }
      return `${parts[0]}@${parts[1]}`;
    };

    const cleanEmail = rawEmail;
    const normEmail = normalizeGmail(cleanEmail);

    let user = users.find(
      u => u.email && (u.email.toLowerCase() === cleanEmail || normalizeGmail(u.email) === normEmail) && ['admin', 'superadmin', 'penginput', 'verifikator', 'finalisator'].includes(u.role)
    );

    const DEFAULT_STAFF_SEEDS = {
      'tontimuallimin2026@gmail.com': { role: 'superadmin', roleLabel: 'Ketua Panitia (Superadmin)' },
      'andiaqillah@muallimin.sch.id': { role: 'admin', roleLabel: 'Panitia Sekretariat (Admin)' },
      'andiaqillah.2018@student.uny.ac.id': { role: 'admin', roleLabel: 'Panitia Sekretariat & Staging' },
      'penginput@lbbmuallimin.com': { role: 'penginput', roleLabel: 'Operator Input Nilai Kertas' },
      'verifikator@lbbmuallimin.com': { role: 'verifikator', roleLabel: 'Verifikator & Checker Nilai' },
      'finalisator@lbbmuallimin.com': { role: 'finalisator', roleLabel: 'Finalisator & Pengesah Rekap Nilai' },
    };

    if (!user && DEFAULT_STAFF_SEEDS[cleanEmail]) {
      const staffMeta = DEFAULT_STAFF_SEEDS[cleanEmail];
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
    }

    if (user) {
      if (googleAvatar) {
        user = {
          ...user,
          avatar: googleAvatar,
          googleAvatar,
          name: name || user.name,
        };
        setUsers(prev => prev.map(u => (u.id === user.id ? user : u)));
      }

      setCurrentUser(user);
      setRole(user.role);
      let targetView = 'landing';
      if (user.role === 'admin') targetView = 'admin';
      else if (user.role === 'superadmin') targetView = 'superadmin';
      else if (user.role === 'checkin') targetView = 'checkin';
      else if (user.role === 'dp') targetView = 'dp';
      else if (['juri', 'penginput'].includes(user.role)) targetView = 'juri';
      else if (['verifikator', 'finalisator'].includes(user.role)) targetView = 'rekap_nilai';
      closeAuthModal(targetView);
      return { success: true, user };
    }

    let currentTeamsList = teams;
    let matchedTeam = currentTeamsList.find(t => t.email && (t.email.toLowerCase() === cleanEmail || normalizeGmail(t.email) === normEmail));
    let existingUser = users.find(u => u.email && (u.email.toLowerCase() === cleanEmail || normalizeGmail(u.email) === normEmail));

    if ((!matchedTeam || matchedTeam.status === 'pending') && isGoogleSheetConfigured()) {
      try {
        const sheetRes = await fetchAllDataFromSheet(false);
        if (sheetRes && sheetRes.success && sheetRes.data?.teams && Array.isArray(sheetRes.data.teams)) {
          const freshTeams = sheetRes.data.teams.map(normalizeTeamData);
          setTeams(prev => {
            const map = new Map();
            prev.forEach(t => map.set(t.id, t));
            freshTeams.forEach(ft => map.set(ft.id, ft));
            return Array.from(map.values());
          });
          currentTeamsList = freshTeams;
          matchedTeam = freshTeams.find(t => t.email && (t.email.toLowerCase() === cleanEmail || normalizeGmail(t.email) === normEmail)) || matchedTeam;
        }
      } catch (err) {
        console.warn('[CompetitionContext] Auto-refresh teams from sheet on login failed:', err);
      }
    }

    if (!matchedTeam && !existingUser) {
      return {
        success: false,
        error: 'not_registered',
        message: `Email "${cleanEmail}" belum terdaftar di pendaftaran lomba. Silakan daftarkan peleton sekolah Anda terlebih dahulu melalui menu Formulir Pendaftaran.`
      };
    }

    const team = matchedTeam || (existingUser?.teamId ? currentTeamsList.find(t => t.id === existingUser.teamId) : null);

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
      closeAuthModal('peserta_dashboard');
      return { success: true, user };
    }

    if (existingUser) {
      setCurrentUser(existingUser);
      setRole(existingUser.role);
      if (existingUser.teamId) setCurrentTeamId(existingUser.teamId);
      const targetView = existingUser.role === 'peserta' ? 'peserta_dashboard' : existingUser.role;
      closeAuthModal(targetView);
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

    const targetView =
      newUser.role === 'admin'
        ? 'admin'
        : newUser.role === 'juri'
        ? 'juri'
        : newUser.role === 'superadmin'
        ? 'superadmin'
        : 'peserta_dashboard';

    closeAuthModal(targetView);
    return { success: true, user: newUser };
  }

  function logoutUser() {
    setCurrentUser(null);
    setRole('publik');
    setActiveView('landing');
    setCurrentTeamId(null);
  }

  function addStaffUser({ name, email, role, roleLabel }) {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) return { success: false, message: 'Email tidak boleh kosong.' };

    const exists = users.find(u => u.email.toLowerCase() === cleanEmail);
    if (exists) {
      return { success: false, message: `Email ${cleanEmail} sudah terdaftar sebagai ${exists.roleLabel || exists.role}.` };
    }

    const defaultRoleLabels = {
      superadmin: 'Ketua Panitia (Superadmin)',
      admin: 'Panitia Sekretariat (Admin)',
      penginput: 'Operator Input Nilai Kertas',
      verifikator: 'Verifikator & Checker Nilai',
      finalisator: 'Finalisator & Pengesah Rekap Nilai',
    };

    const newStaff = {
      id: `user-staff-${Date.now()}`,
      name: name?.trim() || cleanEmail.split('@')[0].toUpperCase(),
      email: cleanEmail,
      role: role || 'penginput',
      roleLabel: roleLabel?.trim() || defaultRoleLabels[role] || 'Petugas Resmi LBB',
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name || cleanEmail)}&background=0f172a&color=38bdf8&bold=true`,
      googleAvatar: null,
    };

    setUsers(prev => [newStaff, ...prev]);
    return { success: true, message: `Petugas ${newStaff.name} (${cleanEmail}) berhasil ditambahkan sebagai ${newStaff.roleLabel}.`, user: newStaff };
  }

  function updateStaffUser(userId, updates) {
    const targetUser = users.find(u => u.id === userId);
    if (!targetUser) return { success: false, message: 'Petugas tidak ditemukan.' };

    if (updates.email) {
      const cleanEmail = updates.email.trim().toLowerCase();
      const duplicate = users.find(u => u.id !== userId && u.email.toLowerCase() === cleanEmail);
      if (duplicate) {
        return { success: false, message: `Email ${cleanEmail} sudah dipakai oleh petugas lain.` };
      }
      updates.email = cleanEmail;
    }

    setUsers(prev => prev.map(u => (u.id === userId ? { ...u, ...updates } : u)));

    if (currentUser?.id === userId) {
      setCurrentUser(prev => ({ ...prev, ...updates }));
      if (updates.role) setRole(updates.role);
    }

    return { success: true, message: 'Data petugas dan email role berhasil diperbarui.' };
  }

  function deleteStaffUser(userId) {
    const targetUser = users.find(u => u.id === userId);
    if (!targetUser) return { success: false, message: 'Petugas tidak ditemukan.' };

    if (targetUser.role === 'superadmin' && targetUser.email === 'tontimuallimin2026@gmail.com') {
      return { success: false, message: 'Akun Superadmin Utama tidak dapat dihapus demi keamanan sistem.' };
    }

    setUsers(prev => prev.filter(u => u.id !== userId));

    if (currentUser?.id === userId) {
      logoutUser();
    }

    return { success: true, message: `Akun ${targetUser.email} berhasil dihapus dari daftar otoritas.` };
  }

  const currentTeam = useMemo(() => {
    if (currentTeamId) {
      const found = teams.find(t => t.id === currentTeamId);
      if (found) return found;
    }
    if (currentUser?.teamId) {
      const found = teams.find(t => t.id === currentUser.teamId);
      if (found) return found;
    }
    if (currentUser?.email && currentUser.role === 'peserta') {
      const cleanEmail = currentUser.email.toLowerCase();
      const found = teams.find(t => t.email && t.email.toLowerCase() === cleanEmail);
      if (found) return found;
    }
    if (currentUser?.schoolName && currentUser.role === 'peserta') {
      const found = teams.find(t => t.schoolName === currentUser.schoolName);
      if (found) return found;
    }
    return null;
  }, [teams, currentTeamId, currentUser]);

  useEffect(() => {
    if (currentTeam && currentTeam.id !== currentTeamId) {
      setCurrentTeamId(currentTeam.id);
    }
  }, [currentTeam, currentTeamId]);

  function switchRole(targetRole) {
    if (targetRole === 'publik') {
      setRole('publik');
      setActiveView('landing');
      return true;
    }

    if (targetRole === 'peserta') {
      setRole('peserta');
      if (currentTeamId || currentUser?.teamId) {
        setActiveView('peserta_dashboard');
        return true;
      }
      const matched = currentUser?.email ? teams.find(t => t.email?.toLowerCase() === currentUser.email?.toLowerCase()) : null;
      if (matched) {
        setCurrentTeamId(matched.id);
        setActiveView('peserta_dashboard');
        return true;
      }
      setActiveView('peserta_dashboard');
      return true;
    }

    if (currentUser && (currentUser.role === targetRole || currentUser.role === 'superadmin')) {
      setRole(targetRole);
      if (targetRole === 'admin') setActiveView('admin');
      else if (['penginput', 'verifikator', 'finalisator', 'juri'].includes(targetRole)) setActiveView('juri');
      else if (targetRole === 'superadmin') setActiveView('superadmin');
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
      if (currentTeam || currentTeamId || currentUser?.role === 'peserta') {
        switchRole('peserta');
      } else {
        openAuthModal('login');
      }
      return;
    }

    if (targetRole === 'announcement') {
      setActiveView('announcement');
      return;
    }

    if (currentUser && (currentUser.role === targetRole || currentUser.role === 'superadmin')) {
      switchRole(targetRole);
      return;
    }

    openAuthModal('login');
  }

  function loginAsTeam(identifier) {
    const rawInput = String(identifier || '').trim();
    if (!rawInput) {
      return { success: false, message: 'Harap masukkan Kode Pendaftaran, Nomor WhatsApp, atau Email.' };
    }

    const cleanId = rawInput.toLowerCase();
    const cleanDigits = cleanId.replace(/\D/g, '');
    const cleanDigitsNormalized = cleanDigits.replace(/^(0|62)/, '');

    const found = teams.find(t => {
      if (t.id && t.id.toLowerCase() === cleanId) return true;
      const teamReg = String(t.regCode || '').trim().toLowerCase();
      if (teamReg && teamReg === cleanId) return true;
      const teamEmail = String(t.email || '').trim().toLowerCase();
      if (teamEmail && teamEmail === cleanId) return true;
      const teamWa = String(t.waNumber || '').replace(/\D/g, '');
      const teamWaNormalized = teamWa.replace(/^(0|62)/, '');
      if (cleanDigitsNormalized && teamWaNormalized && cleanDigitsNormalized === teamWaNormalized) {
        return true;
      }
      if (cleanDigits && teamWa && cleanDigits === teamWa) {
        return true;
      }
      const teamSchool = String(t.schoolName || '').trim().toLowerCase();
      if (cleanId.length >= 4 && (teamSchool === cleanId || teamSchool.includes(cleanId))) {
        return true;
      }
      return false;
    });

    if (found) {
      if (found.status === 'pending') {
        return {
          success: false,
          error: 'pending_approval',
          message: `Pendaftaran peleton ${found.schoolName} (${found.regCode}) masih dalam antrean verifikasi pendaftaran awal dan BELUM DI-ACC oleh Admin. Silakan tunggu persetujuan oleh panitia sekretariat.`
        };
      }
      if (found.status === 'rejected') {
        return {
          success: false,
          error: 'rejected',
          message: `Pendaftaran peleton ${found.schoolName} ditolak oleh panitia. Silakan hubungi Sekretariat Panitia.`
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
      setUsers(prev => {
        const exists = prev.some(u => u.id === teamUser.id || (teamUser.email && u.email?.toLowerCase() === teamUser.email.toLowerCase()));
        return exists
          ? prev.map(u => (u.id === teamUser.id || (teamUser.email && u.email?.toLowerCase() === teamUser.email.toLowerCase()) ? teamUser : u))
          : [teamUser, ...prev];
      });
      setCurrentUser(teamUser);
      setAuthModal({ isOpen: false, tab: 'login' });
      setActiveView('peserta_dashboard');
      return { success: true, team: found, user: teamUser };
    }
    return { success: false, message: 'Kode Pendaftaran, Nomor WhatsApp, atau Email tidak ditemukan.' };
  }

  function logoutTeam() {
    setCurrentTeamId(null);
    setRole('publik');
    setActiveView('landing');
  }

  function updateSettings(newSettings) {
    setSettings(prev => {
      const merged = { ...prev, ...newSettings };
      if (newSettings?.eventDates) {
        merged.eventDates = {
          ...(prev?.eventDates || {}),
          ...newSettings.eventDates,
        };
      }
      return merged;
    });
  }

  function resetToSeedData() {
    setTeams(INITIAL_TEAMS);
    setScores(INITIAL_SCORES);
    setSettings(INITIAL_SETTINGS);
    setStaging(INITIAL_STAGING);
    resetFieldTimer();
    setRole('publik');
    setActiveView('landing');
    setCurrentTeamId(null);
    localStorage.removeItem(STORAGE_KEYS.TEAMS);
    localStorage.removeItem(STORAGE_KEYS.SCORES);
    localStorage.removeItem(STORAGE_KEYS.SETTINGS);
    localStorage.removeItem(STORAGE_KEYS.STAGING);
    localStorage.removeItem(STORAGE_KEYS.ROLE);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_TEAM_ID);
  }

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

    const sanitizeCsvCell = (val) => {
      if (val === null || val === undefined) return '""';
      let str = String(val).replace(/"/g, '""');
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

      addStaffUser,
      updateStaffUser,
      deleteStaffUser,

      switchRole,
      loginAsTeam,
      logoutTeam,
      requestRoleAccess,

      registerTeam,
      updateTeamFiles,
      updateTeamRoster,
      verifyTeam,
      assignLotNumber,
      updateTeamDraw,
      randomizeLotNumbers,
      deleteTeam,

      saveScore,
      saveJuryPostScore,
      saveDraftScore,
      verifyScore,
      finalizeScore,
      getAggregatedScore,

      staging,
      updateTeamStaging,
      checkInBasecamp,
      checkOutBasecamp,
      updateDP1PersonnelInspection,
      passToDP2,
      fieldTimer,
      startFieldTimer,
      pauseFieldTimer,
      resumeFieldTimer,
      resetFieldTimer,
      stopAndSaveFieldTimer,

      updateSettings,
      resetToSeedData,
      exportTeamsCSV,

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

      openModal,
      closeModal,

      adminActiveTab,
      setAdminActiveTab,
      stagingActiveMode,
      setStagingActiveMode,
      stagingBasecampAction,
      setStagingBasecampAction,
      navigateToStage,
      canAccessStage,
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
      staging,
      fieldTimer,
      adminActiveTab,
      stagingActiveMode,
      stagingBasecampAction,
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
