import { formatImageUrl } from '../services/sheetService.js';

export const STORAGE_KEYS = {
  TEAMS: 'lbb_muallimin_teams_v3',
  SCORES: 'lbb_muallimin_scores_v3',
  SETTINGS: 'lbb_muallimin_settings_v7',
  ROLE: 'lbb_muallimin_active_role_v3',
  CURRENT_TEAM_ID: 'lbb_muallimin_current_team_id_v3',
  USERS: 'lbb_muallimin_users_v4',
  CURRENT_USER: 'lbb_muallimin_current_user_v4',
  STAGING: 'lbb_muallimin_staging_v3',
};

// Bersihkan data sampah/dummy legacy versi sebelumnya dari browser
export function cleanLegacyStorage() {
  try {
    const legacyPrefixes = [
      'lbb_muallimin_teams_',
      'lbb_muallimin_scores_',
      'lbb_muallimin_staging_',
      'lbb_muallimin_votes_',
      'lbb_muallimin_users_',
      'lbb_muallimin_current_user_'
    ];
    Object.keys(localStorage).forEach(k => {
      if (k.startsWith('lbb_muallimin_users_') && k !== STORAGE_KEYS.USERS) {
        localStorage.removeItem(k);
      }
      if (k.startsWith('lbb_muallimin_current_user_') && k !== STORAGE_KEYS.CURRENT_USER) {
        localStorage.removeItem(k);
      }
      if (legacyPrefixes.some(p => k.startsWith(p) && !k.endsWith('_v3') && !k.endsWith('_v4') && !k.endsWith('_v5') && !k.endsWith('_v6') && !k.endsWith('_v7'))) {
        localStorage.removeItem(k);
      }
      if (k === 'lbb_muallimin_settings_v3' || k === 'lbb_muallimin_settings_v4' || k === 'lbb_muallimin_settings_v5' || k === 'lbb_muallimin_settings_v6') {
        localStorage.removeItem(k);
      }
    });
  } catch {
    // safe ignore if localStorage is restricted
  }
}

// Helper for resilient localStorage access without crashing on QuotaExceededError
export function safeSetItem(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch (e) {
    console.warn(`[CompetitionContext] Storage quota warning for key "${key}":`, e);
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

  return {
    isEligible: issues.length === 0,
    issues,
  };
}

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
    if (!Array.isArray(t.roster.officials)) {
      t.roster.officials = [];
    }
    const defaultTemplates = [
      { id: 'off-1', name: '', phone: '', role: 'Official (Pelatih / Pembina)', category: 'official' },
      { id: 'off-2', name: '', phone: '', role: 'Pendukung 1 (Medis / Dokum)', category: 'pendukung' },
      { id: 'off-3', name: '', phone: '', role: 'Pendukung 2 (Medis / Dokum)', category: 'pendukung' },
    ];
    const normalizedOfficials = [];
    for (let i = 0; i < 3; i++) {
      const existingOff = t.roster.officials[i];
      if (existingOff) {
        let cleanRole = existingOff.role || defaultTemplates[i].role;
        if (cleanRole === 'Pembina / Pelatih 1') {
          cleanRole = 'Official (Pelatih / Pembina)';
        } else if (cleanRole === 'Pembina / Pelatih 2') {
          cleanRole = 'Pendukung 1 (Medis / Dokum)';
        }
        normalizedOfficials.push({
          ...defaultTemplates[i],
          ...existingOff,
          role: cleanRole,
          category: i === 0 ? 'official' : 'pendukung',
        });
      } else {
        normalizedOfficials.push({ ...defaultTemplates[i] });
      }
    }
    t.roster.officials = normalizedOfficials;
  }

  t.waNumber = t.waNumber != null ? String(t.waNumber) : '';
  return t;
}
