import { saveRecordToSheet } from '../services/sheetService.js';

export function createStagingActions({ staging, setStaging, currentUser }) {
  function updateTeamStaging(teamId, newStage, updates = {}) {
    let nextRecord = null;
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
        id: teamId,
        teamId,
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

      nextRecord = next;
      return {
        ...prev,
        [teamId]: next,
      };
    });

    if (nextRecord) {
      saveRecordToSheet('staging', nextRecord).catch(err =>
        console.warn('[CompetitionContext] Sync updateTeamStaging to sheet failed:', err)
      );
    }
  }

  function checkInBasecamp(teamId, logistikData = {}) {
    const timeStr = logistikData.checkedInAt || new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    const officialName = logistikData.ktpOfficialName || logistikData.ktpHolderName || '';
    const ktpType = logistikData.ktpType || 'KTP Fisik';
    const logisticsObj = logistikData.logistics || {};

    const defaultData = {
      ktpDeposited: true,
      ktpOfficialName: officialName,
      ktpHolderName: officialName,
      ktpType,
      ktpNumber: logistikData.ktpNumber || '',
      waterBoxGiven: logistikData.waterBoxGiven ?? logisticsObj.waterBox ?? true,
      chestNumberGiven: logistikData.chestNumberGiven ?? logisticsObj.chestNumber ?? true,
      cocardGiven: logistikData.cocardOfficialGiven ?? logistikData.cocardGiven ?? logisticsObj.cocardOfficial ?? true,
      trashBagGiven: logistikData.trashBagGiven ?? logisticsObj.trashBag ?? true,
      checkInTime: new Date().toISOString(),
      checkedInAt: timeStr,
      checkedInBy: currentUser?.name || 'Panitia Basecamp',
    };

    updateTeamStaging(teamId, 'basecamp', {
      checkedIn: true,
      checkedInAt: timeStr,
      ktpOfficialName: officialName,
      ktpType,
      basecampLogistics: {
        ...(staging[teamId]?.basecampLogistics || {}),
        ...defaultData,
        ...logistikData,
      },
    });

    return { success: true, message: 'Check-in Basecamp berhasil! Logistik telah diserahterimakan dan KTP/SIM tercatat.' };
  }

  function checkOutBasecamp(teamId, checkoutData = {}) {
    const timeStr = checkoutData.checkedOutAt || new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    const currentLogistics = staging[teamId]?.basecampLogistics || {};
    const updated = {
      ...currentLogistics,
      roomCleanChecked: checkoutData.roomCleanChecked ?? true,
      sortedTrashReturned: checkoutData.sortedTrashReturned ?? true,
      ktpReturned: checkoutData.ktpReturned ?? true,
      checkOutTime: new Date().toISOString(),
      checkedOutAt: timeStr,
      checkedOutBy: currentUser?.name || 'Panitia Basecamp',
    };

    updateTeamStaging(teamId, 'checkout', {
      checkedIn: true,
      checkedOut: true,
      checkedOutAt: timeStr,
      basecampLogistics: updated,
    });

    return { success: true, message: 'Check-out Basecamp sukses! Ruangan bersih, sampah terpilah terkumpul, dan KTP/SIM dikembalikan.' };
  }

  function getPersonnelKeyAliases(personId) {
    const idStr = String(personId || '');
    if (idStr === 'danton' || idStr === 'p-danton') return ['danton', 'p-danton'];
    const pMatch = idStr.match(/^(?:p|pasukan)-(\d+)$/);
    if (pMatch) return [`p-${pMatch[1]}`, `pasukan-${pMatch[1]}`];
    const cMatch = idStr.match(/^(?:c|cadangan)-(\d+)$/);
    if (cMatch) return [`c-${cMatch[1]}`, `cadangan-${cMatch[1]}`];
    return [idStr];
  }

  function updateDP1PersonnelInspection(teamId, personIdOrList, isVerified, note = '') {
    let nextRecord = null;
    const nowIso = new Date().toISOString();
    const targetIds = Array.isArray(personIdOrList) ? personIdOrList : [personIdOrList];

    setStaging(prev => {
      const cur = prev[teamId] || { id: teamId, teamId, stage: 'dp1', dp1Inspections: {} };
      const updatedInspections = { ...(cur.dp1Inspections || {}) };

      const entry = {
        verified: isVerified,
        inspectedAt: nowIso,
        inspectedBy: currentUser?.name || 'Panitia DP 1',
        note: note || '',
      };

      targetIds.forEach(pid => {
        getPersonnelKeyAliases(pid).forEach(aliasKey => {
          updatedInspections[aliasKey] = entry;
        });
      });

      const next = {
        ...cur,
        id: teamId,
        teamId,
        dp1Inspections: updatedInspections,
        updatedAt: nowIso,
      };
      nextRecord = next;

      return {
        ...prev,
        [teamId]: next,
      };
    });

    if (nextRecord) {
      saveRecordToSheet('staging', nextRecord).catch(err =>
        console.warn('[CompetitionContext] Sync updateDP1PersonnelInspection to sheet failed:', err)
      );
    }
  }

  function passToDP2(teamId) {
    updateTeamStaging(teamId, 'dp2', {
      dp1Passed: true,
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
