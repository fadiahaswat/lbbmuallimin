import { saveRecordToSheet, deleteRecordFromSheet } from '../services/sheetService.js';
import { generatePersonnels } from '../data/seedData.js';
import { checkTeamVerificationEligibility } from './competitionHelpers.js';

export function createTeamActions({ teams, setTeams, scores, setScores, setCurrentUser, setUsers }) {
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
      teamType: newTeamData.teamType || 'Homogen',
      category: newTeamData.category || newTeamData.teamType || 'Homogen',
      platoonName: newTeamData.platoonName || `Pleton ${newTeamData.schoolName}`,
      dantonName: newTeamData.dantonName || '',
      officialName: newTeamData.officialName || '',
      coachName: newTeamData.officialName || '',
      waNumber: newTeamData.waNumber || '',
      email: (newTeamData.email || '').trim().toLowerCase(),
      address: newTeamData.address || '',
      status: 'pending',
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

    saveRecordToSheet('teams', createdTeam).catch(err => {
      console.warn('[CompetitionContext] Sync registerTeam to sheet failed:', err);
    });

    return createdTeam;
  }

  function updateTeamFiles(teamId, fileKey, fileData) {
    setTeams(prev =>
      prev.map(team => {
        if (team.id === teamId) {
          const updatedFiles = {
            ...team.files,
            [fileKey]: fileData,
          };
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

  return {
    registerTeam,
    updateTeamFiles,
    updateTeamRoster,
    verifyTeam,
    assignLotNumber,
    updateTeamDraw,
    randomizeLotNumbers,
    deleteTeam
  };
}
