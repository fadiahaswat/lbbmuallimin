import { formatImageUrl } from '../services/sheetService.js';

/**
 * Mapping Resmi Nomor Urut Tampil ke Nomor Dada Peleton
 * Berpasangan saat Technical Meeting (TM)
 */
export const LOTTERY_CHEST_MAP = {
  SD: [
    '111', '113', '115', '117', '119',
    '131', '133', '135', '137', '139',
    '151', '153', '155', '157', '159',
    '171', '173', '175',
  ],
  SMP: [
    '222', '224', '226', '228',
    '240', '242', '244', '246', '248',
    '260', '262', '264', '266', '268',
    '280', '282', '284', '286',
  ],
};

/**
 * Dapatkan Nomor Dada resmi berdasarkan Jenjang dan Urutan Tampil (lotNumber 1-indexed)
 * Contoh: Urutan 1 SD -> "111", Urutan 1 SMP -> "222"
 */
export function getChestNumberByLot(jenjang, lotNumber) {
  if (!lotNumber || isNaN(lotNumber)) return '';
  const num = parseInt(lotNumber, 10);
  if (num < 1) return '';
  const jKey = String(jenjang || '').toUpperCase().includes('SD') ? 'SD' : 'SMP';
  const list = LOTTERY_CHEST_MAP[jKey] || [];
  return list[num - 1] || '';
}

/**
 * Kalkulasi jadwal dinamis Uji Coba Lapangan (UCL).
 * Jika ada tim yang menolak/berhalangan hadir (status === 'declined'), slot waktu di belakangnya otomatis dimajukan.
 *
 * @param {Array} allTeams - Seluruh tim terdaftar
 * @param {Object} masterSchedule - UJI_COBA_SCHEDULE (SD & SMP)
 * @returns {Object} Mapping teamId -> { slotIndex, schedule, originalLot, isDeclined }
 */
export function calculateDynamicTrialSchedule(allTeams = [], masterSchedule = {}) {
  const result = {};

  ['SD', 'SMP'].forEach(jenjangKey => {
    // Ambil tim per jenjang yang sudah memiliki lotNumber (hasil TM)
    const jenjangTeams = allTeams.filter(t => {
      const matchJenjang = String(t.jenjang || '').toUpperCase().includes(jenjangKey);
      return matchJenjang && t.lotNumber;
    });

    // Urutkan berdasarkan lotNumber awal
    jenjangTeams.sort((a, b) => parseInt(a.lotNumber, 10) - parseInt(b.lotNumber, 10));

    // Pisahkan yang bersedia hadir vs yang menolak
    // Tim yang belum konfirmasi defaultnya tetap dianggap hadir sampai deadline/panitia menutup
    const attendingTeams = [];
    const declinedTeams = [];

    jenjangTeams.forEach(t => {
      const isDeclined = t.vehicleSurveys?.trialAttendance?.status === 'declined';
      if (isDeclined) {
        declinedTeams.push(t);
      } else {
        attendingTeams.push(t);
      }
    });

    const slots = masterSchedule[jenjangKey] || [];

    // Petakan tim yang hadir ke slot berurutan dari 0 (dirapatkan maju)
    attendingTeams.forEach((team, slotIdx) => {
      const schedule = slots[slotIdx] || null;
      result[team.id] = {
        slotIndex: slotIdx,
        schedule,
        isDeclined: false,
        isAdvanced: slotIdx < (parseInt(team.lotNumber, 10) - 1),
        originalLot: parseInt(team.lotNumber, 10)
      };
    });

    // Tim yang berhalangan hadir tidak mendapat slot aktif
    declinedTeams.forEach(team => {
      result[team.id] = {
        slotIndex: -1,
        schedule: null,
        isDeclined: true,
        isAdvanced: false,
        originalLot: parseInt(team.lotNumber, 10)
      };
    });
  });

  return result;
}

export const STORAGE_KEYS = {
  TEAMS: 'lbb_muallimin_teams_v5',
  SCORES: 'lbb_muallimin_scores_v5',
  SETTINGS: 'lbb_muallimin_settings_v10',
  ROLE: 'lbb_muallimin_active_role_v3',
  ACTIVE_VIEW: 'lbb_muallimin_active_view_v1',
  CURRENT_TEAM_ID: 'lbb_muallimin_current_team_id_v5',
  USERS: 'lbb_muallimin_users_v4',
  CURRENT_USER: 'lbb_muallimin_current_user_v4',
  STAGING: 'lbb_muallimin_staging_v5',
};

// Bersihkan data sampah/dummy legacy versi sebelumnya dari browser
export function cleanLegacyStorage() {
  try {
    const legacyPrefixes = [
      'lbb_muallimin_teams_',
      'lbb_muallimin_scores_',
      'lbb_muallimin_staging_',
      'lbb_muallimin_votes_'
    ];
    Object.keys(localStorage).forEach(k => {
      if (k.startsWith('lbb_muallimin_users_') && k !== STORAGE_KEYS.USERS) {
        localStorage.removeItem(k);
      }
      if (k.startsWith('lbb_muallimin_current_user_') && k !== STORAGE_KEYS.CURRENT_USER) {
        localStorage.removeItem(k);
      }
      if (legacyPrefixes.some(p => k.startsWith(p) && !k.endsWith('_v5') && !k.endsWith('_v9'))) {
        localStorage.removeItem(k);
      }
      if (k.startsWith('lbb_muallimin_settings_') && k !== STORAGE_KEYS.SETTINGS) {
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

  if (!t.files.schoolLogo && (t.file_logo_sekolah || t.file_schoolLogo)) {
    t.files.schoolLogo = { url: t.file_logo_sekolah || t.file_schoolLogo, name: 'Logo_Sekolah.png' };
  }
  if (!t.files.dantonCard && (t.file_kartu_danton || t.file_dantonCard)) {
    t.files.dantonCard = { url: t.file_kartu_danton || t.file_dantonCard, name: 'Kartu_Pelajar_Danton.jpg' };
  }
  if (!t.files.officialKtp && (t.file_ktp_official || t.file_officialKtp)) {
    t.files.officialKtp = { url: t.file_ktp_official || t.file_officialKtp, name: 'KTP_Official.jpg' };
  }
  if (!t.files.paymentProof && (t.file_bukti_bayar || t.file_paymentProof)) {
    t.files.paymentProof = { url: t.file_bukti_bayar || t.file_paymentProof, name: 'Bukti_Bayar.jpg' };
  }
  if (!t.files.recommendationLetter && (t.file_surat_rekomendasi || t.file_recommendationLetter)) {
    t.files.recommendationLetter = { url: t.file_surat_rekomendasi || t.file_recommendationLetter, name: 'Surat_Rekomendasi.pdf' };
  }
  if (!t.files.integrityPact && (t.file_pakta_integritas || t.file_integrityPact)) {
    t.files.integrityPact = { url: t.file_pakta_integritas || t.file_integrityPact, name: 'Pakta_Integritas.pdf' };
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

  // Nomor dada HANYA ada setelah tim diundi (memiliki nomor undian lotNumber)
  if (!t.lotNumber || isNaN(parseInt(t.lotNumber, 10)) || parseInt(t.lotNumber, 10) < 1) {
    t.lotNumber = null;
    t.chestNumber = '';
  } else if (!t.chestNumber) {
    t.chestNumber = getChestNumberByLot(t.jenjang, parseInt(t.lotNumber, 10)) || '';
  }

  t.waNumber = t.waNumber != null ? String(t.waNumber) : '';
  return t;
}

/**
 * Mendeteksi apakah aplikasi sedang diakses dari lingkungan lokal / localhost untuk keperluan testing
 */
export function isLocalhostEnvironment() {
  if (typeof window === 'undefined') return true;
  const hostname = window.location.hostname || '';
  return (
    hostname === 'localhost' ||
    hostname === '127.0.0.1' ||
    hostname === '::1' ||
    hostname.startsWith('192.168.') ||
    hostname.startsWith('10.') ||
    hostname.startsWith('172.') ||
    hostname.endsWith('.local')
  );
}

/**
 * Memeriksa apakah waktu saat ini telah mencapai tanggal resmi dibukanya pendaftaran
 * (Senin, 26 Oktober 2026 pukul 00.00 WIB)
 * @param {string} regStartStr - Format ISO tanggal pendaftaran dibuka
 * @returns {boolean} True jika sudah mencapai/melewati waktu pembukaan
 */
export function isRegistrationDateReached(regStartStr) {
  if (!regStartStr) return true;
  const startTime = new Date(regStartStr).getTime();
  if (isNaN(startTime)) return true;
  return Date.now() >= startTime;
}

/**
 * Memeriksa apakah pengisian formulir pendaftaran diizinkan:
 * - Dibuka jika tanggal sudah masuk minimal 26 Oktober 2026 pukul 00.00 WIB
 * - KECUALI jika diakses dari localhost (bisa langsung daftar untuk testing)
 * @param {string} regStartStr - Format ISO tanggal pendaftaran dibuka
 * @returns {boolean} True jika diizinkan mengisi formulir pendaftaran
 */
export function canFillRegistrationForm(regStartStr) {
  if (isLocalhostEnvironment()) return true;
  return isRegistrationDateReached(regStartStr);
}
