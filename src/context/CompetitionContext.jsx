import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  INITIAL_TEAMS,
  INITIAL_SCORES,
  INITIAL_SETTINGS,
  INITIAL_PINS,
  INITIAL_USERS,
  generatePersonnels
} from '../data/seedData.js';

const CompetitionContext = createContext(null);

const STORAGE_KEYS = {
  TEAMS: 'lbb_muallimin_teams_v2',
  SCORES: 'lbb_muallimin_scores_v2',
  SETTINGS: 'lbb_muallimin_settings_v2',
  ROLE: 'lbb_muallimin_active_role_v2',
  CURRENT_TEAM_ID: 'lbb_muallimin_current_team_id_v2',
  USERS: 'lbb_muallimin_users_v2',
  CURRENT_USER: 'lbb_muallimin_current_user_v2',
};

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
      return saved ? JSON.parse(saved) : INITIAL_TEAMS;
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

  function loginUser(email, name = null) {
    const cleanEmail = email.trim().toLowerCase();

    // 1. Cek kredensial admin / panitia / juri / superadmin (Strict Match)
    const OFFICIAL_STAFF_EMAILS = {
      'admin@lbbmuallimin.com': { role: 'admin', roleLabel: 'Panitia Sekretariat' },
      'juri@lbbmuallimin.com': { role: 'juri', roleLabel: 'Dewan Juri' },
      'ketua@lbbmuallimin.com': { role: 'superadmin', roleLabel: 'Ketua Panitia' },
    };

    if (OFFICIAL_STAFF_EMAILS[cleanEmail] || users.some(u => u.email.toLowerCase() === cleanEmail && ['admin', 'juri', 'superadmin'].includes(u.role))) {
      let user = users.find(u => u.email.toLowerCase() === cleanEmail);
      if (!user && OFFICIAL_STAFF_EMAILS[cleanEmail]) {
        const staffMeta = OFFICIAL_STAFF_EMAILS[cleanEmail];
        user = {
          id: `user-${Date.now()}`,
          name: name || cleanEmail.split('@')[0].toUpperCase(),
          email: cleanEmail,
          role: staffMeta.role,
          roleLabel: staffMeta.roleLabel,
          avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${cleanEmail}`,
        };
        setUsers(prev => [user, ...prev]);
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
          message: `Pendaftaran peleton ${team.schoolName} (${team.regCode}) masih dalam antrean verifikasi dan BELUM DI-ACC oleh Admin. Silakan tunggu persetujuan oleh panitia sekretariat.`
        };
      }
      if (team.status === 'revision') {
        return {
          success: false,
          error: 'revision',
          message: `Pendaftaran peleton ${team.schoolName} memerlukan perbaikan berkas: "${team.revisionNote || 'Mohon lengkapi berkas'}". Hubungi panitia untuk informasi revisi.`
        };
      }
      if (team.status === 'rejected') {
        return {
          success: false,
          error: 'rejected',
          message: `Pendaftaran peleton ${team.schoolName} ditolak oleh panitia. Silakan hubungi Sekretariat Panitia.`
        };
      }

      // Status 'verified' -> Di-ACC oleh Admin!
      const user = {
        id: existingUser?.id || `user-${Date.now()}`,
        name: team.officialName || team.coachName || existingUser?.name || team.schoolName,
        email: cleanEmail,
        role: 'peserta',
        roleLabel: 'Calon Peserta Resmi',
        teamId: team.id,
        schoolName: team.schoolName,
        avatar: existingUser?.avatar || team.files?.schoolLogo?.url || `https://api.dicebear.com/7.x/bottts/svg?seed=${cleanEmail}`,
      };

      if (!existingUser) {
        setUsers(prev => [user, ...prev]);
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
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${cleanEmail}`,
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
      if (targetRole === 'admin') setActiveView('admin');
      if (targetRole === 'juri') setActiveView('juri');
      if (targetRole === 'superadmin') setActiveView('superadmin');
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
      jenjang: newTeamData.jenjang,
      teamType: newTeamData.teamType || 'Homogen', // 'Homogen' | 'Heterogen'
      category: newTeamData.teamType || 'Homogen',
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
      setCurrentTeamId(found.id);
      setRole('peserta');
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
          // Jika tim berstatus 'revision', kembalikan ke 'pending' setelah re-upload
          const nextStatus = team.status === 'revision' ? 'pending' : team.status;
          return {
            ...team,
            files: updatedFiles,
            status: nextStatus,
          };
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
          return {
            ...team,
            status: newStatus,
            revisionNote: note,
          };
        }
        return team;
      })
    );
  }

  function assignLotNumber(teamId, lotNumber) {
    setTeams(prev =>
      prev.map(team => {
        if (team.id === teamId) {
          return {
            ...team,
            lotNumber: lotNumber ? parseInt(lotNumber, 10) : null,
            drawTime: lotNumber ? new Date().toISOString() : null,
          };
        }
        return team;
      })
    );
  }

  function randomizeLotNumbers(jenjang) {
    // Ambil semua tim jenjang ini yang terverifikasi
    const verifiedTeams = teams.filter(t => t.jenjang === jenjang && t.status === 'verified');
    if (verifiedTeams.length === 0) return 0;

    // Buat array nomor 1 s.d. jumlah tim
    const numbers = Array.from({ length: verifiedTeams.length }, (_, i) => i + 1);
    // Shuffle array (Fisher-Yates)
    for (let i = numbers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
    }

    const idToNumber = {};
    verifiedTeams.forEach((t, idx) => {
      idToNumber[t.id] = numbers[idx];
    });

    const nowIso = new Date().toISOString();
    setTeams(prev =>
      prev.map(t => {
        if (idToNumber[t.id] !== undefined) {
          return {
            ...t,
            lotNumber: idToNumber[t.id],
            drawTime: nowIso,
          };
        }
        return t;
      })
    );

    return verifiedTeams.length;
  }

  function deleteTeam(teamId) {
    setTeams(prev => prev.filter(t => t.id !== teamId));
    if (scores[teamId]) {
      setScores(prev => {
        const next = { ...prev };
        delete next[teamId];
        return next;
      });
    }
  }

  // --- Jury & Scoring Operations ---
  function saveScore(teamId, scoreData) {
    const finalScore = (Number(scoreData.danton.total) + Number(scoreData.pbb.total)) - Number(scoreData.penalties.totalPenalty);

    const record = {
      teamId,
      juryName: scoreData.juryName || 'Dewan Juri LBB Muallimin',
      juryRole: scoreData.juryRole || 'Juri Lapangan',
      scoredAt: new Date().toISOString(),
      danton: scoreData.danton,
      pbb: scoreData.pbb,
      penalties: scoreData.penalties,
      finalScore: parseFloat(finalScore.toFixed(2)),
      notes: scoreData.notes || '',
    };

    setScores(prev => ({
      ...prev,
      [teamId]: record,
    }));

    return record;
  }

  // --- Superadmin / System Settings Operations ---
  function updateSettings(newSettings) {
    setSettings(prev => ({ ...prev, ...newSettings }));
  }

  function resetToSeedData() {
    setTeams(INITIAL_TEAMS);
    setScores(INITIAL_SCORES);
    setSettings(INITIAL_SETTINGS);
    setRole('publik');
    setActiveView('landing');
    setCurrentTeamId(null);
    localStorage.removeItem(STORAGE_KEYS.TEAMS);
    localStorage.removeItem(STORAGE_KEYS.SCORES);
    localStorage.removeItem(STORAGE_KEYS.SETTINGS);
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
      verifyTeam,
      assignLotNumber,
      randomizeLotNumbers,
      deleteTeam,

      // Scoring
      saveScore,

      // Settings & System
      updateSettings,
      resetToSeedData,
      exportTeamsCSV,

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
