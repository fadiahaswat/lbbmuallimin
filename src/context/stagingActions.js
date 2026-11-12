import { saveRecordToSheet } from '../services/sheetService.js';
import { calculatePenalties } from './scoringActions.js';

export function createStagingActions({ staging = {}, setStaging, scores = {}, setScores = null, currentUser }) {
  function syncStagingPenaltyToScores(teamId, penaltyUpdates = {}) {
    if (typeof setScores !== 'function') return;
    let updatedScoreRecord = null;

    const buildScoreWithPenalty = (existing) => {
      const base = existing || {
        id: teamId,
        teamId,
        status: 'draft',
        juries: {},
        pbb: { total: 0, nilaiMurni: 0, nilaiAkhir: 0, j1: 0, j2: 0, j3: 0, rubricScores: {} },
        danton: { total: 0, nilaiMurni: 0, nilaiAkhir: 0, j1: 0, j2: 0, j3: 0, rubricScores: {} },
        penalties: {
          upacara: false,
          upacaraTerlambatBlocks: 0,
          dp1: false,
          personelKurang: false,
          overTimeBlocks: 0,
          injakGarisCount: 0,
          kotakDantonCount: 0,
          yelYelCount: 0,
          rokokCount: 0,
          basecampKotor: false,
          totalPenalty: 0,
        },
        nilaiMurniPeleton: 0,
        nilaiAkhirPeleton: 0,
        nilaiMurniDanton: 0,
        nilaiAkhirDanton: 0,
        finalScore: 0,
        isLocked: false,
      };

      if (base.isLocked || base.status === 'finalized') return null;

      const pen = calculatePenalties({
        ...(base.penalties || {}),
        ...penaltyUpdates,
      });

      const pbbMurni = Number(base.nilaiMurniPeleton ?? base.pbb?.total ?? 0);
      const dantonMurni = Number(base.nilaiMurniDanton ?? base.danton?.total ?? 0);
      const nilaiAkhirPeleton = Math.max(0, parseFloat((pbbMurni - pen.peletonPenalty).toFixed(2)));
      const nilaiAkhirDanton = Math.max(0, parseFloat((dantonMurni - pen.dantonPenalty).toFixed(2)));
      const finalScore = Math.max(0, parseFloat((nilaiAkhirPeleton + nilaiAkhirDanton).toFixed(2)));

      return {
        ...base,
        id: teamId,
        teamId,
        penalties: pen,
        peletonPenalty: pen.peletonPenalty,
        dantonPenalty: pen.dantonPenalty,
        nilaiAkhirPeleton,
        nilaiAkhirDanton,
        pbb: {
          ...(base.pbb || {}),
          total: pbbMurni,
          nilaiMurni: pbbMurni,
          nilaiAkhir: nilaiAkhirPeleton,
        },
        danton: {
          ...(base.danton || {}),
          total: dantonMurni,
          nilaiMurni: dantonMurni,
          nilaiAkhir: nilaiAkhirDanton,
        },
        finalScore,
      };
    };

    setScores(prev => {
      const existing = prev[teamId];
      const next = buildScoreWithPenalty(existing);
      if (!next) return prev;
      updatedScoreRecord = next;
      return {
        ...prev,
        [teamId]: next,
      };
    });

    if (!updatedScoreRecord) {
      updatedScoreRecord = buildScoreWithPenalty(scores[teamId]);
    }

    if (updatedScoreRecord) {
      saveRecordToSheet('scores', { id: teamId, ...updatedScoreRecord }).catch(err =>
        console.warn('[CompetitionContext] Sync staging penalty to scores failed:', err)
      );
    }
  }

  function updateTeamStaging(teamId, newStage, updates = {}) {
    let nextRecord = null;
    const nowIso = new Date().toISOString();

    const buildStagingRecord = (currentObj) => {
      const current = currentObj || {
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
        status: updates.status || newStage,
        ...updates,
        checklist: {
          ...(current.checklist || {}),
          ...(updates.checklist || {}),
        },
        updatedAt: nowIso,
      };

      if (newStage === 'arena' && !next.enteredArenaAt) {
        next.enteredArenaAt = nowIso;
      }
      if (newStage === 'finished' && !next.finishedAt) {
        next.finishedAt = nowIso;
      }
      return next;
    };

    setStaging(prev => {
      const next = buildStagingRecord(prev[teamId]);
      nextRecord = next;
      return {
        ...prev,
        [teamId]: next,
      };
    });

    if (!nextRecord) {
      nextRecord = buildStagingRecord(staging[teamId]);
    }

    if (nextRecord) {
      saveRecordToSheet('staging', nextRecord).catch(err =>
        console.warn('[CompetitionContext] Sync updateTeamStaging to sheet failed:', err)
      );
    }
    return nextRecord;
  }

  function checkInBasecamp(teamId, logistikData = {}) {
    const nowIso = new Date().toISOString();
    const timeStr = logistikData.checkedInAt || new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    const officialName = logistikData.ktpOfficialName || logistikData.ktpHolderName || logistikData.ktpGuarantee?.holderName || '';
    const ktpType = logistikData.ktpType || logistikData.ktpGuarantee?.type || 'KTP Fisik';
    const ktpNumber = logistikData.ktpNumber || logistikData.ktpGuarantee?.idNumber || '';
    const logisticsObj = logistikData.logistics || {};
    const officerName = logistikData.officerName || currentUser?.name || 'Panitia Basecamp';

    const waterBoxGiven = logistikData.waterBoxGiven ?? logisticsObj.waterBox ?? logisticsObj.airMineral ?? true;
    const chestNumberGiven = logistikData.chestNumberGiven ?? logisticsObj.chestNumber ?? logisticsObj.nomorDada ?? true;
    const cocardGiven = logistikData.cocardOfficialGiven ?? logistikData.cocardGiven ?? logisticsObj.cocardOfficial ?? logisticsObj.idCard ?? true;
    const trashBagGiven = logistikData.trashBagGiven ?? logisticsObj.trashBag ?? true;

    const defaultData = {
      ktpDeposited: true,
      ktpOfficialName: officialName,
      ktpHolderName: officialName,
      ktpType,
      ktpNumber,
      waterBoxGiven,
      chestNumberGiven,
      cocardGiven,
      trashBagGiven,
      checkInTime: nowIso,
      checkedInAt: timeStr,
      checkedInBy: officerName,
      note: logistikData.note || '',
    };

    const currentRecord = staging[teamId] || {};
    const keepStage = ['dp1', 'dp2', 'dp3', 'arena', 'finished', 'checkout'].includes(currentRecord.stage)
      ? currentRecord.stage
      : 'basecamp';

    updateTeamStaging(teamId, keepStage, {
      checkedIn: true,
      checkedInAt: timeStr,
      ktpOfficialName: officialName,
      ktpType,
      basecamp: {
        ...(currentRecord.basecamp || {}),
        ...defaultData,
      },
      basecampLogistics: {
        ...(currentRecord.basecampLogistics || {}),
        ...defaultData,
        ...logistikData,
      },
      checkIn: {
        checkedIn: true,
        timestamp: nowIso,
        checkedInAt: timeStr,
        officerName,
        ktpGuarantee: {
          deposited: true,
          type: ktpType,
          holderName: officialName,
          idNumber: ktpNumber,
        },
        logistics: {
          nomorDada: chestNumberGiven,
          idCard: cocardGiven,
          airMineral: waterBoxGiven,
          trashBag: trashBagGiven,
        },
        note: logistikData.note || '',
      },
    });

    return { success: true, message: 'Check-in Basecamp berhasil! Logistik telah diserahterimakan dan KTP/SIM tercatat.' };
  }

  function checkOutBasecamp(teamId, checkoutData = {}) {
    const nowIso = new Date().toISOString();
    const timeStr = checkoutData.checkedOutAt || new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    const currentRecord = staging[teamId] || {};
    const currentLogistics = currentRecord.basecampLogistics || {};
    const officerName = checkoutData.officerName || currentUser?.name || 'Panitia Basecamp';

    const roomCleanChecked = checkoutData.roomCleanChecked ?? checkoutData.cleanlinessVerified ?? true;
    const sortedTrashReturned = checkoutData.sortedTrashReturned ?? checkoutData.trashBagReturned ?? true;
    const ktpReturned = checkoutData.ktpReturned ?? true;

    const updated = {
      ...currentLogistics,
      roomCleanChecked,
      sortedTrashReturned,
      ktpReturned,
      checkOutTime: nowIso,
      checkedOutAt: timeStr,
      checkedOutBy: officerName,
      note: checkoutData.note || '',
    };

    updateTeamStaging(teamId, 'checkout', {
      checkedIn: true,
      checkedOut: true,
      checkedOutAt: timeStr,
      basecampLogistics: updated,
      basecamp: {
        ...(currentRecord.basecamp || {}),
        ...updated,
      },
      checkOut: {
        checkedOut: true,
        timestamp: nowIso,
        checkedOutAt: timeStr,
        officerName,
        cleanlinessVerified: roomCleanChecked,
        trashBagReturned: sortedTrashReturned,
        ktpReturned,
        note: checkoutData.note || '',
      },
    });

    // Juknis Bab D.3 & Bab H: Penalti kebersihan basecamp (-150 poin) jika ruangan kotor / trash bag tidak dikembalikan
    const isBasecampDirty = !roomCleanChecked || !sortedTrashReturned;
    syncStagingPenaltyToScores(teamId, { basecampKotor: isBasecampDirty });

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

  const CANONICAL_PERSONNEL_KEYS = [
    ['danton', 'p-danton'],
    ...Array.from({ length: 21 }, (_, i) => [`p-${i + 1}`, `pasukan-${i + 1}`]),
    ...Array.from({ length: 3 }, (_, i) => [`c-${i + 1}`, `cadangan-${i + 1}`]),
  ];

  function countVerifiedPersonnels(inspectionsObj = {}) {
    return CANONICAL_PERSONNEL_KEYS.filter(aliases =>
      aliases.some(k => inspectionsObj[k]?.verified === true)
    ).length;
  }

  function updateDP1PersonnelInspection(teamId, personIdOrList, isVerified, note = '') {
    let nextRecord = null;
    const nowIso = new Date().toISOString();
    const targetIds = Array.isArray(personIdOrList) ? personIdOrList : [personIdOrList];

    const buildInspectionRecord = (curObj) => {
      const cur = curObj || { id: teamId, teamId, stage: 'dp1', dp1Inspections: {} };
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

      const verifiedTotal = countVerifiedPersonnels(updatedInspections);
      const meetsMinRequirement = verifiedTotal >= 22;
      const isPostDP = ['arena', 'finished', 'checkout'].includes(cur.stage);

      const nextStage = isPostDP
        ? cur.stage
        : meetsMinRequirement
        ? 'dp2'
        : verifiedTotal > 0
        ? 'dp1'
        : (cur.checkedIn || cur.basecamp?.ktpDeposited ? 'basecamp' : 'dp1');

      return {
        ...cur,
        id: teamId,
        teamId,
        stage: nextStage,
        status: nextStage,
        dp1Passed: isPostDP ? true : meetsMinRequirement,
        readyForScoring: isPostDP ? true : meetsMinRequirement,
        dp1PassedAt: meetsMinRequirement ? (cur.dp1PassedAt || nowIso) : null,
        dp1PassedBy: meetsMinRequirement ? (cur.dp1PassedBy || currentUser?.name || 'Panitia DP 1') : null,
        checklist: {
          ...(cur.checklist || {}),
          dp1Verification: isPostDP ? true : meetsMinRequirement,
          dp2Warmup: isPostDP ? true : meetsMinRequirement,
        },
        dp1Inspections: updatedInspections,
        updatedAt: nowIso,
      };
    };

    setStaging(prev => {
      const next = buildInspectionRecord(prev[teamId]);
      nextRecord = next;
      return {
        ...prev,
        [teamId]: next,
      };
    });

    if (!nextRecord) {
      nextRecord = buildInspectionRecord(staging[teamId]);
    }

    if (nextRecord) {
      saveRecordToSheet('staging', nextRecord).catch(err =>
        console.warn('[CompetitionContext] Sync updateDP1PersonnelInspection to sheet failed:', err)
      );
    }
    return nextRecord;
  }

  function passToDP2(teamId) {
    const nowIso = new Date().toISOString();
    const cur = staging[teamId] || {};
    const verifiedTotal = countVerifiedPersonnels(cur.dp1Inspections || {});
    const isShortPersonnel = verifiedTotal > 0 && verifiedTotal < 22;

    updateTeamStaging(teamId, 'dp2', {
      status: 'dp2',
      dp1Passed: true,
      readyForScoring: true,
      dp1PassedAt: nowIso,
      dp1PassedBy: currentUser?.name || 'Panitia DP 1',
      personelKurangPenalty: isShortPersonnel,
      checklist: {
        dp1Verification: true,
        dp2Warmup: true,
      },
    });

    // Juknis Bab E.1.d & Bab H: Jika personel < 22 (1 Danton + 21 Pasukan), kenakan penalti personelKurang (-75 poin)
    if (verifiedTotal > 0) {
      syncStagingPenaltyToScores(teamId, { personelKurang: isShortPersonnel });
    }
  }

  return {
    updateTeamStaging,
    checkInBasecamp,
    checkOutBasecamp,
    updateDP1PersonnelInspection,
    passToDP2
  };
}
