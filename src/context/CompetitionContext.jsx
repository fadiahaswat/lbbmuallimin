import React, { createContext, useContext, useState, useEffect } from 'react';
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

  // 1. Roles: 'publik' | 'peserta' | 'admin' | 'juri' | 'superadmin'
  const [role, setRole] = useState(() => {
    return localStorage.getItem(STORAGE_KEYS.ROLE) || 'publik';
  });

  // 2. Active View: 'landing' | 'admin' | 'juri' | 'superadmin' | 'announcement' | 'peserta_dashboard'
  const [activeView, setActiveView] = useState('landing');

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

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ROLE, role);
  }, [role]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TEAMS, JSON.stringify(teams));
  }, [teams]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SCORES, JSON.stringify(scores));
  }, [scores]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  }, [currentUser]);

  function openAuthModal(tab = 'login') {
    setAuthModal({ isOpen: true, tab });
  }

  function closeAuthModal() {
    setAuthModal({ isOpen: false, tab: 'login' });
  }

  function loginUser(email, name = null) {
    const cleanEmail = email.trim().toLowerCase();
    let user = users.find(u => u.email.toLowerCase() === cleanEmail);

    if (!user) {
      let detectedRole = 'peserta';
      let detectedLabel = 'Official Peserta';
      if (cleanEmail.includes('admin')) {
        detectedRole = 'admin';
        detectedLabel = 'Panitia Sekretariat';
      } else if (cleanEmail.includes('juri')) {
        detectedRole = 'juri';
        detectedLabel = 'Dewan Juri';
      } else if (cleanEmail.includes('ketua') || cleanEmail.includes('super')) {
        detectedRole = 'superadmin';
        detectedLabel = 'Ketua Panitia';
      }

      // Check if email matches existing registered team
      const matchedTeam = teams.find(t => t.email.toLowerCase() === cleanEmail);

      user = {
        id: `user-${Date.now()}`,
        name: name || cleanEmail.split('@')[0].toUpperCase(),
        email: cleanEmail,
        role: detectedRole,
        roleLabel: detectedLabel,
        teamId: matchedTeam ? matchedTeam.id : null,
        avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${cleanEmail}`,
      };

      setUsers(prev => [user, ...prev]);
    }

    setCurrentUser(user);
    setRole(user.role);

    if (user.role === 'admin') {
      setActiveView('admin');
    } else if (user.role === 'juri') {
      setActiveView('juri');
    } else if (user.role === 'superadmin') {
      setActiveView('superadmin');
    } else if (user.role === 'peserta') {
      if (user.teamId) {
        setCurrentTeamId(user.teamId);
      }
      setActiveView('peserta_dashboard');
    }

    closeAuthModal();
    return user;
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
        openModal('statusCheck');
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

    // Open PIN prompt
    setPinPrompt({
      isOpen: true,
      targetRole,
      pin: '',
      error: '',
    });
  }

  function closePinPrompt() {
    setPinPrompt({ isOpen: false, targetRole: null, pin: '', error: '' });
  }

  function submitPinPrompt(enteredPin) {
    const target = pinPrompt.targetRole;
    const success = switchRole(target, enteredPin);
    if (success) {
      closePinPrompt();
      return true;
    } else {
      setPinPrompt(prev => ({
        ...prev,
        error: `PIN salah! Petunjuk demo: admin='admin2026', juri='juri2026', super='super2026'`,
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
      category: newTeamData.category || 'Campuran',
      platoonName: newTeamData.platoonName || `Pleton ${newTeamData.schoolName}`,
      coachName: newTeamData.coachName,
      waNumber: newTeamData.waNumber,
      email: newTeamData.email,
      address: newTeamData.address || '',
      status: 'pending', // Awal pendaftaran selalu 'pending'
      lotNumber: null,
      drawTime: null,
      registeredAt: new Date().toISOString(),
      wave: newTeamData.wave || 1,
      feeAmount: newTeamData.feeAmount || 450000,
      paymentStatus: 'paid',
      files: newTeamData.files || {
        recommendationLetter: { name: 'Surat_Rekomendasi.pdf', uploadedAt: new Date().toISOString(), url: '#' },
        paymentProof: { name: 'Bukti_Transfer_BRI.jpg', uploadedAt: new Date().toISOString(), url: '#' },
        personnelPhotos: { name: 'Pasfoto_Personil.zip', uploadedAt: new Date().toISOString(), url: '#' },
        schoolLogo: { name: 'Logo_Sekolah.png', uploadedAt: new Date().toISOString(), url: '#' },
      },
      revisionNote: '',
      roster: newTeamData.roster || generatePersonnels(newTeamData.schoolName, jenjang, 'Anggota'),
    };

    setTeams(prev => [createdTeam, ...prev]);
    setCurrentTeamId(createdTeam.id);
    setRole('peserta');
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

  // --- Modal Helpers ---
  function openModal(modalName, data = null) {
    setActiveModal(modalName);
    setModalData(data);
  }

  function closeModal() {
    setActiveModal(null);
    setModalData(null);
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

    const rows = teams.map(t => [
      `"${t.regCode}"`,
      `"${t.schoolName}"`,
      `"${t.jenjang}"`,
      `"${t.category}"`,
      `"${t.platoonName}"`,
      `"${t.status.toUpperCase()}"`,
      `"${t.lotNumber || '-'}"`,
      `"${t.coachName}"`,
      `"${t.waNumber}"`,
      `"${t.email}"`,
      `"${t.feeAmount}"`,
      `"${t.paymentStatus}"`,
      `"${new Date(t.registeredAt).toLocaleString('id-ID')}"`,
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

  return (
    <CompetitionContext.Provider
      value={{
        // State
        role,
        activeView,
        setActiveView,
        teams,
        scores,
        settings,
        currentTeam,
        currentTeamId,
        activeModal,
        modalData,

        // User Auth
        currentUser,
        users,
        authModal,
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

        // Modals
        openModal,
        closeModal,
      }}
    >
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
