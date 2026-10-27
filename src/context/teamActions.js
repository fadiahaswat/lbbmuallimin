import { saveRecordToSheet, bulkSyncToSheet, deleteRecordFromSheet } from '../services/sheetService.js';
import { generatePersonnels } from '../data/seedData.js';
import { checkTeamVerificationEligibility, getChestNumberByLot, canFillRegistrationForm, findTeamByEmail } from './competitionHelpers.js';
import { EVENT } from '../config.js';

export function createTeamActions({ teams, setTeams, scores, setScores, setStaging, setCurrentUser, setUsers }) {
  function registerTeam(newTeamData) {
    if (!canFillRegistrationForm(EVENT.REGISTRATION_START)) {
      throw new Error('Pendaftaran daring baru dibuka resmi pada 26 Oktober 2026 pukul 00.00 WIB.');
    }

    const cleanEmail = (newTeamData.email || '').trim().toLowerCase();
    if (!cleanEmail) {
      throw new Error('Email akun peleton wajib dihubungkan melalui Google Sign-In.');
    }

    const duplicateTeam = findTeamByEmail(cleanEmail, teams);
    if (duplicateTeam) {
      throw new Error(
        `Email "${cleanEmail}" sudah digunakan oleh "${duplicateTeam.schoolName || 'peleton lain'}". 1 peleton 1 Gmail, tidak bisa 1 email 2 peleton. Silakan isi email yang lain.`
      );
    }

    const jenjang = (newTeamData.jenjang || 'SMP').toUpperCase();
    
    // Generate kode pendaftaran unik 8 karakter (2 blok x 4 karakter):
    // Format: LBB27-{JENJANG}-{WAKTU_UNIK}-{RANDOM} (contoh: LBB27-SMP-M5K8-7X9B)
    const timePart = Date.now().toString(36).toUpperCase().slice(-4);
    const randPart = Math.random().toString(36).substring(2, 6).toUpperCase();
    const regCode = `LBB27-${jenjang}-${timePart}-${randPart}`;
    const id = `TEAM-${jenjang}-${Date.now()}-${randPart}`;

    const nowIso = new Date().toISOString();
    const createdTeam = {
      id,
      regCode,
      schoolName: newTeamData.schoolName,
      schoolBaseName: newTeamData.schoolBaseName || newTeamData.schoolName,
      teamUnit: newTeamData.teamUnit || 'Tim A',
      jenjang: newTeamData.jenjang,
      teamType: newTeamData.teamType || 'Homogen',
      category: newTeamData.category || newTeamData.teamType || 'Homogen',
      platoonName: newTeamData.platoonName || `Peleton ${newTeamData.schoolName}`,
      dantonName: newTeamData.dantonName || '',
      officialName: newTeamData.officialName || '',
      waNumber: newTeamData.waNumber || '',
      email: (newTeamData.email || '').trim().toLowerCase(),
      address: newTeamData.address || '',
      status: 'pending',
      lotNumber: null,
      drawTime: null,
      registeredAt: nowIso,
      updatedAt: nowIso,
      wave: newTeamData.wave || 1,
      feeAmount: newTeamData.feeAmount || 450000,
      paymentStatus: 'unverified',
      files: {
        schoolLogo: newTeamData.files?.schoolLogo || null,
        dantonCard: newTeamData.files?.dantonCard || null,
        officialKtp: newTeamData.files?.officialKtp || null,
        paymentProof: newTeamData.files?.paymentProof || null,
        integrityPact: newTeamData.files?.integrityPact || null,
        recommendationLetter: newTeamData.files?.recommendationLetter || null,
      },
      revisionNote: '',
      roster: generatePersonnels(newTeamData.schoolName, jenjang, 'Anggota', newTeamData.dantonName),
    };

    setTeams(prev => [createdTeam, ...prev]);

    saveRecordToSheet('teams', createdTeam).catch(err => {
      console.warn('[CompetitionContext] Sync registerTeam to sheet failed:', err);
    });

    return createdTeam;
  }

  function updateTeamFiles(teamId, fileKey, fileData) {
    let updatedTeam = null;
    const nowIso = new Date().toISOString();

    setTeams(prev =>
      prev.map(team => {
        if (team.id === teamId) {
          const updatedFiles = {
            ...team.files,
            [fileKey]: fileData,
          };
          const nextStatus = team.status === 'revision' ? 'registered' : team.status;
          updatedTeam = {
            ...team,
            files: updatedFiles,
            status: nextStatus,
            updatedAt: nowIso,
          };
          return updatedTeam;
        }
        return team;
      })
    );

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

    const fallbackTeam = teams.find(t => t.id === teamId);
    const toSave = updatedTeam || (fallbackTeam ? {
      ...fallbackTeam,
      files: { ...fallbackTeam.files, [fileKey]: fileData },
      status: fallbackTeam.status === 'revision' ? 'registered' : fallbackTeam.status,
      updatedAt: nowIso,
    } : null);

    if (toSave) {
      saveRecordToSheet('teams', toSave).catch(err =>
        console.warn('[CompetitionContext] Sync file update failed:', err)
      );
    }
  }

  function updateTeamRoster(teamId, newRoster) {
    let updatedTeam = null;
    const nowIso = new Date().toISOString();

    setTeams(prev =>
      prev.map(team => {
        if (team.id === teamId) {
          updatedTeam = {
            ...team,
            roster: newRoster,
            dantonName: newRoster?.danton?.name || team.dantonName,
            updatedAt: nowIso,
          };
          return updatedTeam;
        }
        return team;
      })
    );

    if (updatedTeam) {
      saveRecordToSheet('teams', updatedTeam).catch(err =>
        console.warn('[CompetitionContext] Sync updateTeamRoster failed:', err)
      );
    }
  }

  function updateTeamProfile(teamId, profileData) {
    let updatedTeam = null;
    const nowIso = new Date().toISOString();

    setTeams(prev =>
      prev.map(team => {
        if (team.id === teamId) {
          updatedTeam = {
            ...team,
            ...profileData,
            schoolName: profileData.schoolName !== undefined ? profileData.schoolName : team.schoolName,
            city: profileData.city !== undefined ? profileData.city : team.city,
            province: profileData.province !== undefined ? profileData.province : team.province,
            address: profileData.address !== undefined ? profileData.address : team.address,
            waNumber: profileData.waNumber !== undefined ? profileData.waNumber : team.waNumber,
            officialName: profileData.officialName !== undefined ? profileData.officialName : team.officialName,
            platoonName: profileData.platoonName !== undefined ? profileData.platoonName : team.platoonName,
            updatedAt: nowIso,
          };
          return updatedTeam;
        }
        return team;
      })
    );

    if (updatedTeam) {
      saveRecordToSheet('teams', updatedTeam).catch(err =>
        console.warn('[CompetitionContext] Sync updateTeamProfile failed:', err)
      );
    }
    return { success: true };
  }

  function updateTeamVehicleSurvey(teamId, agendaKey, surveyData) {
    let updatedTeam = null;
    const nowIso = new Date().toISOString();

    setTeams(prev =>
      prev.map(team => {
        if (team.id === teamId) {
          const existingSurveys = team.vehicleSurveys || {};
          const updatedSurveys = {
            ...existingSurveys,
            [agendaKey]: {
              ...(existingSurveys[agendaKey] || {}),
              ...surveyData,
              updatedAt: nowIso
            }
          };
          updatedTeam = {
            ...team,
            vehicleSurveys: updatedSurveys,
            updatedAt: nowIso,
          };
          return updatedTeam;
        }
        return team;
      })
    );

    if (updatedTeam) {
      saveRecordToSheet('teams', updatedTeam).catch(err =>
        console.warn('[CompetitionContext] Sync vehicleSurveys failed:', err)
      );
    }
  }

  function verifyTeam(teamId, newStatus, note = '') {
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

    let updatedTeam = null;
    const nowIso = new Date().toISOString();

    setTeams(prev =>
      prev.map(team => {
        if (team.id === teamId) {
          // Ketika status di-ACC menjadi 'registered' atau 'verified', pembayaran pendaftaran resmi disahkan (paid)
          const nextPaymentStatus = (newStatus === 'registered' || newStatus === 'verified' || newStatus === 'drawn') 
            ? 'paid' 
            : (newStatus === 'pending' ? 'unverified' : team.paymentStatus);

          updatedTeam = {
            ...team,
            status: newStatus,
            paymentStatus: nextPaymentStatus,
            revisionNote: note,
            updatedAt: nowIso,
          };
          return updatedTeam;
        }
        return team;
      })
    );

    if (updatedTeam) {
      saveRecordToSheet('teams', updatedTeam).catch(err =>
        console.warn('[CompetitionContext] Sync verifyTeam failed:', err)
      );
    }

    return { success: true };
  }

  function assignLotNumber(teamId, lotNumber, chestNumber = undefined, estimatedTime = undefined, basecampNumber = undefined) {
    const target = teams.find(t => t.id === teamId);
    const num = (lotNumber !== undefined && lotNumber !== '' && lotNumber !== null) ? parseInt(lotNumber, 10) : null;
    
    // Validasi ketat: Peleton HANYA bisa diundi jika berkas & biodata (Danton, 21 Pasukan, Surat Rekomendasi) sudah lengkap
    if (num && target) {
      const eligibility = checkTeamVerificationEligibility(target);
      if (!eligibility.isEligible) {
        console.warn(`[CompetitionContext] Peleton ${target.schoolName} belum dapat diundi:`, eligibility.issues);
        alert(`Peleton belum dapat diundi karena belum lengkap:\n\n• ${eligibility.issues.join('\n• ')}`);
        return { success: false, issues: eligibility.issues };
      }
    }

    let updatedTeam = null;
    const nowIso = new Date().toISOString();

    setTeams(prev =>
      prev.map(team => {
        if (team.id === teamId) {
          // Auto-pair nomor dada sesuai aturan berpasangan jenjang jika tidak diisi manual atau jika nomor undian berubah
          const defaultChestFromLot = num ? getChestNumberByLot(team.jenjang, num) : '';
          let chest = team.chestNumber || '';
          if (chestNumber !== undefined) {
            chest = chestNumber ? String(chestNumber).trim() : defaultChestFromLot;
          } else if (num && !chest) {
            chest = defaultChestFromLot;
          }

          const estTime = (estimatedTime !== undefined) ? (estimatedTime ? String(estimatedTime).trim() : '') : (team.estimatedTime || '');
          const basecamp = (basecampNumber !== undefined) ? (basecampNumber ? String(basecampNumber).trim() : '') : (team.basecampNumber || '');
          const nextStatus = num ? 'drawn' : (team.status === 'drawn' ? 'verified' : team.status);
          updatedTeam = {
            ...team,
            lotNumber: num,
            chestNumber: chest,
            estimatedTime: estTime,
            basecampNumber: basecamp,
            status: nextStatus,
            drawTime: num ? nowIso : null,
            updatedAt: nowIso,
          };
          return updatedTeam;
        }
        return team;
      })
    );

    if (updatedTeam) {
      saveRecordToSheet('teams', updatedTeam).catch(err =>
        console.warn('[CompetitionContext] Sync assignLot failed:', err)
      );
    }
  }

  function updateTeamDraw(teamId, lotNumber, chestNumber, estimatedTime, basecampNumber) {
    assignLotNumber(teamId, lotNumber, chestNumber, estimatedTime, basecampNumber);
  }

  function randomizeLotNumbers(jenjang) {
    const eligibleTeams = teams.filter(t => t.jenjang === jenjang && (t.status === 'verified' || t.status === 'drawn'));
    if (eligibleTeams.length === 0) return 0;

    const numbers = Array.from({ length: eligibleTeams.length }, (_, i) => i + 1);
    for (let i = numbers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
    }

    const idToNumber = {};
    eligibleTeams.forEach((t, idx) => {
      idToNumber[t.id] = numbers[idx];
    });

    const nowIso = new Date().toISOString();
    const updatedList = [];

    setTeams(prev =>
      prev.map(t => {
        if (idToNumber[t.id] !== undefined) {
          const lotNum = idToNumber[t.id];
          const autoChest = getChestNumberByLot(t.jenjang, lotNum);
          const updated = {
            ...t,
            lotNumber: lotNum,
            chestNumber: autoChest || t.chestNumber || '',
            status: 'drawn',
            drawTime: nowIso,
            updatedAt: nowIso,
          };
          updatedList.push(updated);
          return updated;
        }
        return t;
      })
    );

    if (updatedList.length > 0) {
      bulkSyncToSheet('teams', updatedList).catch(err =>
        console.warn('[CompetitionContext] Sync randomizeLot bulk failed:', err)
      );
    }

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
    if (setStaging) {
      setStaging(prev => {
        if (!prev || !prev[teamId]) return prev;
        const next = { ...prev };
        delete next[teamId];
        return next;
      });
      deleteRecordFromSheet('staging', teamId).catch(err =>
        console.warn('[CompetitionContext] Sync deleteStaging failed:', err)
      );
    }
  }

  return {
    registerTeam,
    updateTeamFiles,
    updateTeamRoster,
    updateTeamProfile,
    updateTeamVehicleSurvey,
    verifyTeam,
    assignLotNumber,
    updateTeamDraw,
    randomizeLotNumbers,
    deleteTeam
  };
}
