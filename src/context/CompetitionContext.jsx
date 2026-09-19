import React, { createContext, useContext, useState, useEffect, useMemo, useRef } from 'react';
import {
  INITIAL_TEAMS,
  INITIAL_SCORES,
  INITIAL_SETTINGS,
  INITIAL_USERS,
  INITIAL_STAGING,
  generatePersonnels
} from '../data/seedData.js';
import { JURY_POSTS, STAGING_CONFIG } from '../config.js';
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

export function checkTeamVerificationEligibility(team) {
  if (!team) return { isEligible: false, issues: ['Data peleton tidak valid'] };
  const issues = [];

  // 1. Surat Rekomendasi Kepala Sekolah
  const recUrl = team.files?.recommendationLetter?.url;
  const hasRecLetter = Boolean(recUrl && recUrl !== '#' && !recUrl.startsWith('#'));
  if (!hasRecLetter) {
    issues.push('Surat Rekomendasi/Tugas Kepala Sekolah belum diunggah');
  }

  // 2. Biodata Komandan (Danton): Nama, NISN, Kelas
  const danton = team.roster?.danton;
  const hasDantonName = Boolean((danton?.name || team.dantonName) && (danton?.name || team.dantonName) !== '-' && (danton?.name || team.dantonName).trim() !== '');
  const hasDantonNisn = Boolean(danton?.nisn && danton.nisn !== '-' && danton.nisn.trim() !== '');
  const hasDantonClass = Boolean(danton?.class && danton.class !== '-' && danton.class.trim() !== '');

  if (!hasDantonName || !hasDantonNisn || !hasDantonClass) {
    const missingDanton = [];
    if (!hasDantonName) missingDanton.push('Nama');
    if (!hasDantonNisn) missingDanton.push('NISN');
    if (!hasDantonClass) missingDanton.push('Kelas');
    issues.push(`Biodata Komandan (Danton) belum lengkap (${missingDanton.join(', ')})`);
  }

  // 3. Biodata 21 Anggota Pasukan Inti: Harus 21 orang dan lengkap (Nama, NISN, Kelas)
  const pasukan = Array.isArray(team.roster?.pasukan) ? team.roster.pasukan : [];
  if (pasukan.length < 21) {
    issues.push(`Jumlah personel pasukan inti belum genap 21 (saat ini ${pasukan.length}/21)`);
  } else {
    const incompletePasukan = pasukan.slice(0, 21).filter(p => {
      const hasName = Boolean(p?.name && p.name !== '-' && p.name.trim() !== '');
      const hasNisn = Boolean(p?.nisn && p.nisn !== '-' && p.nisn.trim() !== '');
      const hasClass = Boolean(p?.class && p.class !== '-' && p.class.trim() !== '');
      return !hasName || !hasNisn || !hasClass;
    });
    if (incompletePasukan.length > 0) {
      issues.push(`${incompletePasukan.length} dari 21 personel pasukan inti belum lengkap biodatanya (Nama, NISN, Kelas)`);
    }
  }

  // Catatan: 3 Cadangan bersifat OPSIONAL, tidak menghalangi kelulusan

  return {
    isEligible: issues.length === 0,
    issues,
  };
}

const STORAGE_KEYS = {
  TEAMS: 'lbb_muallimin_teams_v3',
  SCORES: 'lbb_muallimin_scores_v3',
  SETTINGS: 'lbb_muallimin_settings_v6',
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
    if (legacyPrefixes.some(p => k.startsWith(p) && !k.endsWith('_v3') && !k.endsWith('_v4') && !k.endsWith('_v5') && !k.endsWith('_v6'))) {
      localStorage.removeItem(k);
    }
    // Hapus cache settings lama (v3, v4, v5) agar tahun 2027 langsung tersinkron
    if (k === 'lbb_muallimin_settings_v3' || k === 'lbb_muallimin_settings_v4' || k === 'lbb_muallimin_settings_v5') {
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

  // Fallback jika file_* tersimpan di root record (dari Google Sheet)
  if (!t.files.schoolLogo && t.file_logo_sekolah) {
    t.files.schoolLogo = { url: t.file_logo_sekolah, name: 'Logo_Sekolah.png' };
  }
  if (!t.files.dantonCard && t.file_kartu_danton) {
    t.files.dantonCard = { url: t.file_kartu_danton, name: 'Kartu_Pelajar_Danton.jpg' };
  }
  if (!t.files.officialKtp && t.file_ktp_official) {
    t.files.officialKtp = { url: t.file_ktp_official, name: 'KTP_Official.jpg' };
  }
  if (!t.files.paymentProof && t.file_bukti_bayar) {
    t.files.paymentProof = { url: t.file_bukti_bayar, name: 'Bukti_Bayar.jpg' };
  }
  if (!t.files.recommendationLetter && t.file_surat_rekomendasi) {
    t.files.recommendationLetter = { url: t.file_surat_rekomendasi, name: 'Surat_Rekomendasi.pdf' };
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
        nisn: '',
        class: '',
      };
    } else if (t.dantonName && (!t.roster.danton.name || t.roster.danton.name === 'Anggota Pratama' || t.roster.danton.name === '-')) {
      t.roster.danton.name = t.dantonName;
    }
    if (!Array.isArray(t.roster.pasukan)) t.roster.pasukan = [];
    if (!Array.isArray(t.roster.cadangan)) t.roster.cadangan = [];
    if (!Array.isArray(t.roster.officials)) t.roster.officials = [];
  }

  // Pastikan waNumber selalu berupa string aman
  t.waNumber = t.waNumber != null ? String(t.waNumber) : '';

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
    // If it's TEAMS, only strip out truly gigantic base64 strings (> 200KB) to preserve logo & thumbnails
    if (key === STORAGE_KEYS.TEAMS) {
      try {
        const teamsData = JSON.parse(value);
        const slimTeams = teamsData.map(team => {
          if (!team.files) return team;
          const slimFiles = {};
          for (const [fKey, fVal] of Object.entries(team.files)) {
            if (fVal && typeof fVal === 'object') {
              const isLargeUrl = typeof fVal.url === 'string' && fVal.url.length > 200000;
              const isLargeSig = typeof fVal.signatureUrl === 'string' && fVal.signatureUrl.length > 200000;
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

  // Sync scores to localStorage HANYA JIKA sedang login sebagai staff/juri atau hasil resmi sudah dipublikasi
  useEffect(() => {
    const isStaffOrJury = ['admin', 'juri', 'superadmin'].includes(role);
    if (isStaffOrJury || settings.announcementPublished) {
      safeSetItem(STORAGE_KEYS.SCORES, JSON.stringify(scores));
    } else {
      // Jika peran adalah publik / peserta biasa dan pengumuman belum dibuka, jangan tinggalkan data nilai di localStorage browser
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

  // Initial & Role-Based Sync: Mengambil data terbaru dari Google Sheet jika sudah terkonfigurasi
  // KUNCI KEAMANAN: Skor HANYA diambil jika user adalah panitia/juri atau hasil resmi telah dipublikasi
  useEffect(() => {
    if (!isGoogleSheetConfigured()) return;

    const isStaffOrJury = ['admin', 'juri', 'superadmin'].includes(role);
    const allowScoresSync = isStaffOrJury || Boolean(settings.announcementPublished);

    let isMounted = true;
    fetchAllDataFromSheet(allowScoresSync).then(res => {
      if (!isMounted || !res || !res.success || !res.data) return;

      const { teams: sheetTeams, scores: sheetScores, settings: sheetSettings } = res.data;

      // Update teams jika sheet memiliki data
      if (Array.isArray(sheetTeams) && sheetTeams.length > 0) {
        setTeams(prev => {
          // Gabungkan data sheet dengan menjaga integritas data roster dan foto lokal
          const map = new Map();
          prev.forEach(t => map.set(t.id, normalizeTeamData(t)));

          sheetTeams.forEach(rawSheetTeam => {
            const normalizedSheetTeam = normalizeTeamData(rawSheetTeam);
            const existing = map.get(normalizedSheetTeam.id);

            if (existing) {
              // Pertahankan file lokal jika di remote sheet kosong/tidak terupdate
              const mergedFiles = {
                ...existing.files,
                ...normalizedSheetTeam.files,
              };
              Object.keys(existing.files || {}).forEach(k => {
                if (existing.files[k]?.url && (!mergedFiles[k]?.url || mergedFiles[k]?.url === '#')) {
                  mergedFiles[k] = existing.files[k];
                }
              });

              // Pertahankan roster & foto-foto personel jika di sheet terpotong/kosong
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

              // Merge 21 Pasukan
              const sheetPasukan = Array.isArray(sheetRoster.pasukan) ? sheetRoster.pasukan : [];
              const existingPasukan = Array.isArray(existingRoster.pasukan) ? existingRoster.pasukan : [];
              const maxPasukanLen = Math.max(sheetPasukan.length, existingPasukan.length, 21);
              const mergedPasukan = [];

              for (let i = 0; i < maxPasukanLen; i++) {
                const sP = sheetPasukan[i];
                const eP = existingPasukan[i];
                if (!sP && !eP) continue;

                const baseP = sP || eP;
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

              // Merge Cadangan
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

              // Merge Officials
              const sheetOfficials = Array.isArray(sheetRoster.officials) ? sheetRoster.officials : [];
              const existingOfficials = Array.isArray(existingRoster.officials) ? existingRoster.officials : [];
              const maxOffLen = Math.max(sheetOfficials.length, existingOfficials.length, 2);
              const mergedOfficials = [];

              for (let i = 0; i < maxOffLen; i++) {
                const sO = sheetOfficials[i];
                const eO = existingOfficials[i];
                if (!sO && !eO) continue;
                mergedOfficials.push({
                  id: sO?.id || eO?.id || `off-${i + 1}`,
                  role: sO?.role || eO?.role || `Pembina / Pelatih ${i + 1}`,
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

      // Update scores HANYA jika diizinkan (staff atau pengumuman dibuka)
      if (allowScoresSync && Array.isArray(sheetScores) && sheetScores.length > 0) {
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

  function loginUser(email, name = null, googleAvatar = null) {
    const cleanEmail = email.trim().toLowerCase();

    // 1. Cek kredensial staff resmi dari daftar `users` yang dikelola oleh Superadmin
    let user = users.find(
      u => u.email && u.email.toLowerCase() === cleanEmail && ['admin', 'superadmin', 'penginput', 'verifikator', 'finalisator'].includes(u.role)
    );

    // Fallback akun default bawaan sistem jika belum ada di users
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
      else if (['penginput', 'verifikator', 'finalisator'].includes(user.role)) targetView = 'juri';
      closeAuthModal(targetView);
      return { success: true, user };
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

  // Superadmin: Kelola Pengguna & Email Role Staf Resmi (CRUD Staf)
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

    // Jika user yang diupdate sedang aktif login, sinkronkan juga currentUser
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

  // 8. Role Switching & Access via Google Auth
  const currentTeam = teams.find(t => t.id === currentTeamId) || null;

  function switchRole(targetRole) {
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

    // Role Staff resmi (superadmin, admin, penginput, verifikator, finalisator)
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

    // Jika user sudah login dan berhak
    if (currentUser && (currentUser.role === targetRole || currentUser.role === 'superadmin')) {
      switchRole(targetRole);
      return;
    }

    // Arahkan ke Google Login resmi
    openAuthModal('login');
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
        integrityPact: newTeamData.files?.integrityPact || null,
      },
      revisionNote: '',
      roster: generatePersonnels(newTeamData.schoolName, jenjang, 'Anggota', newTeamData.dantonName),
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
    const cleanId = String(identifier || '').trim().toLowerCase();
    const cleanDigits = cleanId.replace(/\D/g, '');
    const found = teams.find(
      t => {
        const teamReg = String(t.regCode || '').toLowerCase();
        const teamWa = String(t.waNumber || '').replace(/\D/g, '');
        return teamReg === cleanId || (cleanDigits && teamWa === cleanDigits);
      }
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
      setAuthModal({ isOpen: false, tab: 'login' });
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
    // Validasi keamanan: jika ingin ACC Sah ('verified'), pastikan syarat terpenuhi
    if (newStatus === 'verified') {
      const targetTeam = teams.find(t => t.id === teamId);
      if (targetTeam) {
        const check = checkTeamVerificationEligibility(targetTeam);
        if (!check.isEligible) {
          console.warn('[CompetitionContext] Peleton belum memenuhi syarat verifikasi:', check.issues);
          return { success: false, issues: check.issues };
        }
      }
    }

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
    return { success: true };
  }

  function assignLotNumber(teamId, lotNumber, chestNumber = undefined, estimatedTime = undefined, basecampNumber = undefined) {
    setTeams(prev =>
      prev.map(team => {
        if (team.id === teamId) {
          const num = (lotNumber !== undefined && lotNumber !== '' && lotNumber !== null) ? parseInt(lotNumber, 10) : null;
          const chest = (chestNumber !== undefined) ? (chestNumber ? String(chestNumber).trim() : '') : (team.chestNumber || '');
          const estTime = (estimatedTime !== undefined) ? (estimatedTime ? String(estimatedTime).trim() : '') : (team.estimatedTime || '');
          const basecamp = (basecampNumber !== undefined) ? (basecampNumber ? String(basecampNumber).trim() : '') : (team.basecampNumber || '');
          const nextStatus = num ? 'drawn' : (team.status === 'drawn' ? 'verified' : team.status);
          const updated = {
            ...team,
            lotNumber: num,
            chestNumber: chest,
            estimatedTime: estTime,
            basecampNumber: basecamp,
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

  function updateTeamDraw(teamId, lotNumber, chestNumber, estimatedTime, basecampNumber) {
    assignLotNumber(teamId, lotNumber, chestNumber, estimatedTime, basecampNumber);
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
  // Sistem Penilaian LBB Mu'allimin 2027:
  // Juri 1: PBB Gerakan Materi Pasukan
  // Juri 2: PBB Gerakan Materi Pasukan
  // Juri 3: Komandan Peleton (Danton)
  // Rata-rata PBB = (Juri 1 + Juri 2) / 2
  // Total Skor Akhir = Rata-rata PBB + Danton Juri 3 - Penalti
  function saveScore(teamId, scoreData) {
    const pbb1Val = Number(scoreData.juries?.pos1?.total ?? scoreData.pbb1?.total ?? scoreData.pbb?.total ?? 0);
    const pbb2Val = Number(scoreData.juries?.pos2?.total ?? scoreData.pbb2?.total ?? 0);
    
    // Hitung rata-rata PBB jika keduanya ada, atau ambil yang terisi
    let pbbAvg = 0;
    if (pbb1Val > 0 && pbb2Val > 0) {
      pbbAvg = (pbb1Val + pbb2Val) / 2;
    } else {
      pbbAvg = pbb1Val || pbb2Val || 0;
    }

    const dantonVal = Number(scoreData.danton?.total || scoreData.juries?.pos3?.total || 0);
    const penaltyVal = Number(scoreData.penalties?.totalPenalty || 0);

    const finalScore = Math.max(0, parseFloat((pbbAvg + dantonVal - penaltyVal).toFixed(2)));

    const record = {
      teamId,
      juryName: scoreData.juryName || 'Dewan Juri LBB Muallimin',
      juryRole: scoreData.juryRole || 'Juri Lapangan',
      scoredAt: new Date().toISOString(),
      juries: scoreData.juries || {},
      danton: scoreData.danton,
      pbb: {
        total: parseFloat(pbbAvg.toFixed(2)),
        j1: pbb1Val,
        j2: pbb2Val,
        rubricScores: scoreData.pbb?.rubricScores || {},
      },
      penalties: scoreData.penalties,
      finalScore,
      notes: scoreData.notes || '',
    };

    setScores(prev => ({
      ...prev,
      [teamId]: record,
    }));

    // Sinkronkan nilai juri ke Google Sheet
    saveRecordToSheet('scores', { id: teamId, ...record }).catch(err =>
      console.warn('[CompetitionContext] Sync saveScore to sheet failed:', err)
    );

    return record;
  }

  // Multi-Juri Scoring Engine (Juri 1: PBB, Juri 2: PBB, Juri 3: Danton)
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

      // Extract Juri 1 (PBB Pasukan)
      const juri1Total = updatedJuries.pos1?.total !== undefined
        ? Number(updatedJuries.pos1.total)
        : (currentTeamScore.juries?.pos1?.total !== undefined ? Number(currentTeamScore.juries.pos1.total) : null);

      // Extract Juri 2 (PBB Pasukan)
      const juri2Total = updatedJuries.pos2?.total !== undefined
        ? Number(updatedJuries.pos2.total)
        : (currentTeamScore.juries?.pos2?.total !== undefined ? Number(currentTeamScore.juries.pos2.total) : null);

      // Rata-rata PBB Juri 1 & Juri 2
      let pbbAvg = 0;
      if (juri1Total !== null && juri2Total !== null) {
        pbbAvg = (juri1Total + juri2Total) / 2;
      } else if (juri1Total !== null) {
        pbbAvg = juri1Total;
      } else if (juri2Total !== null) {
        pbbAvg = juri2Total;
      } else if (currentTeamScore.pbb?.total !== undefined) {
        pbbAvg = Number(currentTeamScore.pbb.total);
      }

      // Extract Juri 3 (Danton)
      const dantonTotal = updatedJuries.pos3?.total !== undefined
        ? Number(updatedJuries.pos3.total)
        : (currentTeamScore.danton?.total !== undefined ? Number(currentTeamScore.danton.total) : 0);

      // Grand Total: Rata-rata PBB (Juri 1 & 2) + Danton (Juri 3) - Penalti
      const finalScore = Math.max(0, parseFloat((pbbAvg + dantonTotal - totalPenalty).toFixed(2)));

      updatedRecord = {
        ...currentTeamScore,
        id: teamId,
        teamId,
        juries: updatedJuries,
        penalties: mergedPenalties,
        pbb: {
          total: parseFloat(pbbAvg.toFixed(2)),
          j1: juri1Total,
          j2: juri2Total,
          rubricScores: updatedJuries.pos1?.rubricScores || updatedJuries.pos2?.rubricScores || currentTeamScore.pbb?.rubricScores || {},
        },
        danton: updatedJuries.pos3 ? { ...updatedJuries.pos3, total: dantonTotal } : (currentTeamScore.danton || { total: dantonTotal }),
        finalScore,
        scoredAt: new Date().toISOString(),
        lastUpdatedBy: postScoreData.juryName || 'Dewan Juri',
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
      const dantonTotal = existing.danton?.total || 0;
      const finalScore = Math.max(0, parseFloat((pbbTotal + dantonTotal - totalPenalty).toFixed(2)));

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

  // --- Basecamp Operations (Hari-H Registrasi & Logistik) ---
  // SOP Check-in: Scan QR tiket/ID Card peleton, serah terima 1 KTP/SIM fisik, beri 1 dus air mineral, no dada, cocard official, karung sampah.
  function checkInBasecamp(teamId, logistikData = {}) {
    const defaultData = {
      ktpDeposited: true,
      ktpHolderName: logistikData.ktpHolderName || '',
      ktpNumber: logistikData.ktpNumber || '',
      waterBoxGiven: true, // 1 dus air minum
      chestNumberGiven: true, // nomor dada
      cocardGiven: true, // cocard official
      trashBagGiven: true, // karung sampah untuk pemilahan
      checkInTime: new Date().toISOString(),
      checkedInBy: currentUser?.name || 'Panitia Basecamp',
    };

    updateTeamStaging(teamId, 'basecamp', {
      basecampLogistics: {
        ...(staging[teamId]?.basecampLogistics || {}),
        ...defaultData,
        ...logistikData,
      },
    });

    return { success: true, message: 'Check-in Basecamp berhasil! Logistik telah diserahterimakan dan KTP/SIM tercatat.' };
  }

  // SOP Check-out: Cek kebersihan basecamp, cek sampah sudah dipilah, scan QR checkout, kembalikan KTP/SIM fisik.
  function checkOutBasecamp(teamId, checkoutData = {}) {
    const currentLogistics = staging[teamId]?.basecampLogistics || {};
    const updated = {
      ...currentLogistics,
      roomCleanChecked: checkoutData.roomCleanChecked ?? true,
      sortedTrashReturned: checkoutData.sortedTrashReturned ?? true,
      ktpReturned: checkoutData.ktpReturned ?? true,
      checkOutTime: new Date().toISOString(),
      checkedOutBy: currentUser?.name || 'Panitia Basecamp',
    };

    updateTeamStaging(teamId, 'checkout', {
      basecampLogistics: updated,
    });

    return { success: true, message: 'Check-out Basecamp sukses! Ruangan bersih, sampah terpilah terkumpul, dan KTP/SIM dikembalikan.' };
  }

  // --- DP 1: Pemeriksaan Personel & Foto Berdasarkan Hasil Pendaftaran Menggunakan Tab/iPad ---
  function updateDP1PersonnelInspection(teamId, personId, isVerified, note = '') {
    setStaging(prev => {
      const cur = prev[teamId] || { teamId, stage: 'dp1', dp1Inspections: {} };
      const inspections = cur.dp1Inspections || {};
      const updatedInspections = {
        ...inspections,
        [personId]: {
          verified: isVerified,
          inspectedAt: new Date().toISOString(),
          inspectedBy: currentUser?.name || 'Panitia DP 1',
          note: note || '',
        },
      };

      return {
        ...prev,
        [teamId]: {
          ...cur,
          dp1Inspections: updatedInspections,
          updatedAt: new Date().toISOString(),
        },
      };
    });
  }

  // Loloskan dari DP 1 ke DP 2 (Ruang Tunggu Steril)
  function passToDP2(teamId) {
    updateTeamStaging(teamId, 'dp2', {
      dp1PassedAt: new Date().toISOString(),
      dp1PassedBy: currentUser?.name || 'Panitia DP 1',
    });
  }

  // --- Multi-Juri 3 Stage Scrutineering (Penginput -> Verifikator -> Finalisator) ---
  // Juri 1: PBB Pasukan, Juri 2: Komandan (Danton), Juri 3: Variasi & Formasi
  // Ditambah: Hakim Garis (Injak Garis) & Timer (Waktu Tampil)
  function saveDraftScore(teamId, draftData) {
    const pbbVal = Number(draftData.pbb?.total ?? draftData.juries?.pos1?.total ?? 0);
    const dantonVal = Number(draftData.danton?.total ?? draftData.juries?.pos2?.total ?? 0);
    const variasiVal = Number(draftData.variasi?.total ?? draftData.juries?.pos3?.total ?? 0);
    const penaltyVal = Number(draftData.penalties?.totalPenalty ?? 0);

    const calculatedFinal = Math.max(0, parseFloat((pbbVal + dantonVal + variasiVal - penaltyVal).toFixed(2)));

    const record = {
      teamId,
      status: 'draft', // DRAFT -> VERIFIED -> FINALIZED
      inputBy: currentUser?.name || 'Operator Penginput',
      inputAt: new Date().toISOString(),
      paperEvidenceUrl: draftData.paperEvidenceUrl || '', // Foto scan blangko kertas fisik juri
      paperEvidenceName: draftData.paperEvidenceName || 'Lembar_Kertas_Juri.jpg',
      juries: {
        pos1: {
          title: 'Juri 1: PBB Pasukan',
          total: pbbVal,
          rubricScores: draftData.pbb?.rubricScores || draftData.juries?.pos1?.rubricScores || {},
        },
        pos2: {
          title: 'Juri 2: Komandan (Danton)',
          total: dantonVal,
          rubricScores: draftData.danton?.rubricScores || draftData.juries?.pos2?.rubricScores || {},
        },
        pos3: {
          title: 'Juri 3: Variasi & Formasi',
          total: variasiVal,
          rubricScores: draftData.variasi?.rubricScores || draftData.juries?.pos3?.rubricScores || {},
        },
      },
      pbb: { total: pbbVal, rubricScores: draftData.pbb?.rubricScores || {} },
      danton: { total: dantonVal, rubricScores: draftData.danton?.rubricScores || {} },
      variasi: { total: variasiVal, rubricScores: draftData.variasi?.rubricScores || {} },
      penalties: draftData.penalties || { totalPenalty: 0 },
      fieldTimerData: draftData.fieldTimerData || {},
      finalScore: calculatedFinal,
      notes: draftData.notes || '',
      verificationNotes: '',
    };

    setScores(prev => ({
      ...prev,
      [teamId]: record,
    }));

    saveRecordToSheet('scores', { id: teamId, ...record }).catch(err =>
      console.warn('[CompetitionContext] Sync draftScore to sheet failed:', err)
    );

    return record;
  }

  // Verifikator Action: Approve atau Reject (kembalikan ke Penginput)
  function verifyScore(teamId, isApproved, note = '') {
    setScores(prev => {
      const existing = prev[teamId];
      if (!existing) return prev;

      const updated = {
        ...existing,
        status: isApproved ? 'verified' : 'rejected_to_draft',
        verifiedBy: currentUser?.name || 'Verifikator Nilai',
        verifiedAt: new Date().toISOString(),
        verificationNotes: note,
      };

      saveRecordToSheet('scores', { id: teamId, ...updated }).catch(err =>
        console.warn('[CompetitionContext] Sync verifyScore to sheet failed:', err)
      );

      return {
        ...prev,
        [teamId]: updated,
      };
    });
  }

  // Finalisator Action: Lock & Sign Berita Acara Rekap Nilai Sah
  function finalizeScore(teamId, signatureName = null) {
    setScores(prev => {
      const existing = prev[teamId];
      if (!existing) return prev;

      const updated = {
        ...existing,
        status: 'finalized', // Kunci permanen
        isLocked: true,
        finalizedBy: signatureName || currentUser?.name || 'Ketua Dewan Juri',
        finalizedAt: new Date().toISOString(),
      };

      saveRecordToSheet('scores', { id: teamId, ...updated }).catch(err =>
        console.warn('[CompetitionContext] Sync finalizeScore to sheet failed:', err)
      );

      return {
        ...prev,
        [teamId]: updated,
      };
    });
  }

  // --- Superadmin / System Settings Operations ---
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

      // Superadmin: Staff Email & Role Management
      addStaffUser,
      updateStaffUser,
      deleteStaffUser,

      // Auth & Role
      switchRole,
      loginAsTeam,
      logoutTeam,
      requestRoleAccess,

      // Teams
      registerTeam,
      updateTeamFiles,
      updateTeamRoster,
      verifyTeam,
      assignLotNumber,
      updateTeamDraw,
      randomizeLotNumbers,
      deleteTeam,

      // Scoring (3-Stage Scrutineering: Penginput, Verifikator, Finalisator)
      saveScore,
      saveJuryPostScore,
      saveDraftScore,
      verifyScore,
      finalizeScore,
      getAggregatedScore,

      // Staging & Field Operations (Hari H: Basecamp & DP 1-3)
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
      staging,
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
