import { saveRecordToSheet } from '../services/sheetService.js';

export function createStagingActions({ staging, setStaging, currentUser }) {
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

  function checkInBasecamp(teamId, logistikData = {}) {
    const defaultData = {
      ktpDeposited: true,
      ktpHolderName: logistikData.ktpHolderName || '',
      ktpNumber: logistikData.ktpNumber || '',
      waterBoxGiven: true,
      chestNumberGiven: true,
      cocardGiven: true,
      trashBagGiven: true,
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

  function passToDP2(teamId) {
    updateTeamStaging(teamId, 'dp2', {
      dp1PassedAt: new Date().toISOString(),
      dp1PassedBy: currentUser?.name || 'Panitia DP 1',
    });
  }

  return {
    updateTeamStaging,
    checkInBasecamp,
    checkOutBasecamp,
    updateDP1PersonnelInspection,
    passToDP2
  };
}
