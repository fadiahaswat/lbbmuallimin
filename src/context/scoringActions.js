import { saveRecordToSheet } from '../services/sheetService.js';
import { parseMaterialsList } from '../config.js';
import { appAlert } from '../utils/appDialog.js';

// Jeda rilis bertahap (rolling release) nilai ke dasbor peserta: 1 jam setelah selesai tampil (Juknis Bab A.9)
export const SCORE_RELEASE_DELAY_MS = 60 * 60 * 1000;

/**
 * Mengevaluasi apakah nilai suatu peleton sudah boleh ditampilkan ke dasbor peserta.
 * - Jika `settings.announcementPublished` aktif -> langsung tampil beserta peringkat.
 * - Jika belum -> mode rolling release privat:
 *   1. Nilai wajib sudah disahkan (`status === 'finalized'` atau `isLocked === true`).
 *   2. Jika ada `finishedAt` dari staging arena (dan belum di-override `forceReleased`),
 *      tunggu hingga `finishedAt + 1 jam` (`SCORE_RELEASE_DELAY_MS`).
 *   3. Peringkat/Juara (`canShowRank`) tetap disembunyikan sampai `announcementPublished === true`.
 */
export function evaluateParticipantScoreRelease(score, stagingRecord = null, settings = {}, nowMs = Date.now()) {
  const announcementPublished = Boolean(settings?.announcementPublished);
  const finishedAtIso = stagingRecord?.finishedAt || score?.finishedAt || null;
  const parsedFinishedMs = finishedAtIso ? new Date(finishedAtIso).getTime() : NaN;
  const hasValidFinishedAt = Number.isFinite(parsedFinishedMs) && parsedFinishedMs > 0;
  const releaseAtMs = hasValidFinishedAt ? parsedFinishedMs + SCORE_RELEASE_DELAY_MS : null;
  const releaseAtIso = releaseAtMs ? new Date(releaseAtMs).toISOString() : null;
  const remainingMs = releaseAtMs ? Math.max(0, releaseAtMs - nowMs) : 0;
  const isFinalized = Boolean(score && (score.status === 'finalized' || score.isLocked === true));
  const hasPerformed = Boolean(
    hasValidFinishedAt ||
    stagingRecord?.stage === 'finished' ||
    stagingRecord?.status === 'finished'
  );

  // 1. Pengumuman resmi sudah dibuka secara global
  if (announcementPublished) {
    if (score) {
      return {
        isReleased: true,
        canShowRank: true,
        isFinalized,
        hasPerformed: true,
        reason: 'announcement_published',
        finishedAtIso,
        releaseAtIso,
        remainingMs: 0,
      };
    }
    return {
      isReleased: false,
      canShowRank: true,
      isFinalized: false,
      hasPerformed,
      reason: hasPerformed ? 'awaiting_finalization' : 'not_performed',
      finishedAtIso,
      releaseAtIso,
      remainingMs,
    };
  }

  // 2. Belum ada nilai atau belum disahkan oleh Finalisator
  if (!isFinalized) {
    return {
      isReleased: false,
      canShowRank: false,
      isFinalized: false,
      hasPerformed,
      reason: hasPerformed ? 'awaiting_finalization' : 'not_performed',
      finishedAtIso,
      releaseAtIso,
      remainingMs,
    };
  }

  // 3. Nilai sudah disahkan + ada override rilis langsung oleh Finalisator/Superadmin
  if (score.forceReleased || score.releasedToParticipantAt) {
    return {
      isReleased: true,
      canShowRank: false,
      isFinalized: true,
      hasPerformed: true,
      reason: 'manual_release',
      finishedAtIso,
      releaseAtIso: score.releasedToParticipantAt || releaseAtIso,
      remainingMs: 0,
    };
  }

  // 4. Nilai sudah disahkan + cek jeda 1 jam pascatampil dari finishedAt
  if (hasValidFinishedAt) {
    if (nowMs >= releaseAtMs) {
      return {
        isReleased: true,
        canShowRank: false,
        isFinalized: true,
        hasPerformed: true,
        reason: 'rolling_release_ready',
        finishedAtIso,
        releaseAtIso,
        remainingMs: 0,
      };
    }
    return {
      isReleased: false,
      canShowRank: false,
      isFinalized: true,
      hasPerformed: true,
      reason: 'waiting_release_window',
      finishedAtIso,
      releaseAtIso,
      remainingMs,
    };
  }

  // 5. Fallback aman: sudah disahkan tetapi staging finishedAt tidak tercatat
  return {
    isReleased: true,
    canShowRank: false,
    isFinalized: true,
    hasPerformed: true,
    reason: 'finalized_no_staging_timestamp',
    finishedAtIso: null,
    releaseAtIso: score.finalizedAt || null,
    remainingMs: 0,
  };
}

export function calculatePenalties(penalties = {}) {
  let peletonPenalty = 0;
  let dantonPenalty = 0;

  // Peleton Penalties (Bab A.3.c & Bab H)
  if (penalties.upacara) peletonPenalty += 150;
  peletonPenalty += (penalties.upacaraTerlambatBlocks || 0) * 50;
  if (penalties.dp1) peletonPenalty += 100;
  if (penalties.personelKurang) peletonPenalty += 75;
  peletonPenalty += (penalties.overTimeBlocks || 0) * 20;
  peletonPenalty += (penalties.injakGarisCount || 0) * 50;
  if (penalties.basecampKotor) peletonPenalty += 150;
  peletonPenalty += (penalties.rokokCount || 0) * 75;

  // Danton Penalties (Bab A.3.c & Bab C.5.b: -10 poin per kejadian)
  dantonPenalty += (penalties.kotakDantonCount || 0) * 10;

  // Yel-Yel Pelanggaran ke-3 dst: Potong Nilai Peleton (Bab C.10.b & d)
  const yelCount = penalties.yelYelCount !== undefined ? penalties.yelYelCount : (penalties.penyesuaianCount || 0);
  const yelYelDeduction = (yelCount || 0) * 50;
  peletonPenalty += yelYelDeduction;

  let totalPenalty = peletonPenalty + dantonPenalty;

  // Fallback jika caller hanya mengirim totalPenalty eksplisit tanpa rincian flag
  if (totalPenalty === 0 && Number(penalties.totalPenalty) > 0) {
    const hasAnyExplicitFlag = [
      'upacara', 'upacaraTerlambatBlocks', 'dp1', 'personelKurang',
      'overTimeBlocks', 'injakGarisCount', 'basecampKotor', 'rokokCount',
      'kotakDantonCount', 'yelYelCount', 'penyesuaianCount'
    ].some(k => penalties[k] !== undefined && penalties[k] !== false && penalties[k] !== 0);
    if (!hasAnyExplicitFlag) {
      peletonPenalty = Number(penalties.peletonPenalty ?? penalties.totalPenalty);
      dantonPenalty = Number(penalties.dantonPenalty ?? 0);
      totalPenalty = peletonPenalty + dantonPenalty;
    }
  }

  return {
    ...penalties,
    peletonPenalty,
    dantonPenalty,
    totalPenalty,
  };
}

export function calculateDantonScoreFromRubric(dantonRubricScores = {}) {
  const materi = Number(dantonRubricScores.materi || 0);
  const vokal = Number(dantonRubricScores.vokal || 0);
  const sikap = Number(dantonRubricScores.sikap || 0);
  const lapangan = Number(dantonRubricScores.lapangan || 0);

  // Jika rubrik belum diisi secara terpisah, fallback ke total yang tersimpan
  if (!materi && !vokal && !sikap && !lapangan) {
    return 0;
  }

  const rawScore = (materi * 0.35) + (vokal * 0.25) + (sikap * 0.20) + (lapangan * 0.20);
  return parseFloat(rawScore.toFixed(2));
}

export function calculatePeletonScoreFromRubric(rubricScores = {}, materialsList = null) {
  if (!rubricScores) return 0;
  if (materialsList && Array.isArray(materialsList)) {
    const parsed = parseMaterialsList(materialsList);
    let total = 0;
    parsed.forEach(item => {
      item.movements.forEach(m => {
        const val = rubricScores[m.key] !== undefined && rubricScores[m.key] !== null
          ? rubricScores[m.key]
          : (m.subIndex === 0 && rubricScores[item.originalIndex] !== undefined && rubricScores[item.originalIndex] !== null
              ? rubricScores[item.originalIndex]
              : null);
        total += Number(val || 0);
      });
    });
    return total;
  }
  const keys = Object.keys(rubricScores);
  const hasSubKeys = keys.some(k => k.includes('_'));
  if (hasSubKeys) {
    return keys
      .filter(k => k.includes('_'))
      .reduce((acc, k) => acc + (Number(rubricScores[k]) || 0), 0);
  }
  return Object.values(rubricScores || {}).reduce((acc, curr) => acc + (Number(curr) || 0), 0);
}

export function aggregateDantonRubricScores(juries = {}, fallbackRubric = {}) {
  const r1 = juries?.pos1?.dantonRubricScores || {};
  const r2 = juries?.pos2?.dantonRubricScores || {};
  const r3 = juries?.pos3?.dantonRubricScores || {};
  const hasPerJury = [r1, r2, r3].some(r => Object.keys(r).length > 0);
  if (!hasPerJury) return fallbackRubric || {};
  return {
    ...fallbackRubric,
    materi: Number(r1.materi || 0) + Number(r2.materi || 0) + Number(r3.materi || 0),
    vokal: Number(r1.vokal || 0) + Number(r2.vokal || 0) + Number(r3.vokal || 0),
    sikap: Number(r1.sikap || 0) + Number(r2.sikap || 0) + Number(r3.sikap || 0),
    lapangan: Number(r1.lapangan || 0) + Number(r2.lapangan || 0) + Number(r3.lapangan || 0),
  };
}

export function createScoringActions({ scores = {}, setScores, currentUser }) {
  function recordAuditLog(teamId, action, prevScore, newScore, actor, reason = '') {
    const auditEntry = {
      id: `audit-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      teamId,
      action,
      prevFinalScore: prevScore?.finalScore ?? null,
      newFinalScore: newScore?.finalScore ?? null,
      actorName: actor?.name || 'Sistem',
      actorRole: actor?.role || 'operator',
      actorEmail: actor?.email || '-',
      timestamp: new Date().toISOString(),
      reason,
    };
    saveRecordToSheet('scores_audit_log', auditEntry).catch(err => {
      console.warn('[CompetitionContext] Sync audit log to sheet failed:', err);
    });
  }

  function saveScore(teamId, scoreData) {
    let previousRecord = null;
    let newRecord = null;
    let blockedByLock = false;

    const buildScoreRecord = (existing) => {
      if (existing && (existing.isLocked || existing.status === 'finalized') && currentUser?.role !== 'superadmin') {
        blockedByLock = true;
        return null;
      }
      previousRecord = existing;

      const mergedPenalties = calculatePenalties(scoreData.penalties || {});
      const peletonPenalty = mergedPenalties.peletonPenalty;
      const dantonPenalty = mergedPenalties.dantonPenalty;

      // Akumulasi 3 Dewan Juri (Bab A.3.c Juknis)
      const j1Peleton = Number(scoreData.juries?.pos1?.peletonTotal ?? scoreData.juries?.pos1?.total ?? scoreData.pbb1?.total ?? 0);
      const j2Peleton = Number(scoreData.juries?.pos2?.peletonTotal ?? scoreData.juries?.pos2?.total ?? scoreData.pbb2?.total ?? 0);
      const j3Peleton = Number(scoreData.juries?.pos3?.peletonTotal ?? scoreData.juries?.pos3?.total ?? 0);

      const nilaiMurniPeleton = j1Peleton + j2Peleton + j3Peleton;
      const nilaiAkhirPeleton = Math.max(0, parseFloat((nilaiMurniPeleton - peletonPenalty).toFixed(2)));

      const j1Danton = Number(scoreData.juries?.pos1?.dantonTotal ?? 0);
      const j2Danton = Number(scoreData.juries?.pos2?.dantonTotal ?? 0);
      const j3Danton = Number(scoreData.juries?.pos3?.dantonTotal ?? scoreData.danton?.total ?? 0);

      const nilaiMurniDanton = parseFloat((j1Danton + j2Danton + j3Danton).toFixed(2));
      const nilaiAkhirDanton = Math.max(0, parseFloat((nilaiMurniDanton - dantonPenalty).toFixed(2)));

      const finalScore = parseFloat((nilaiAkhirPeleton + nilaiAkhirDanton).toFixed(2));
      const juriesObj = scoreData.juries || {};

      return {
        id: teamId,
        teamId,
        juryName: scoreData.juryName || currentUser?.name || 'Dewan Juri LBB Muallimin',
        juryRole: scoreData.juryRole || currentUser?.roleLabel || 'Juri Lapangan',
        scoredAt: new Date().toISOString(),
        juries: juriesObj,
        danton: {
          total: nilaiMurniDanton,
          nilaiMurni: nilaiMurniDanton,
          nilaiAkhir: nilaiAkhirDanton,
          j1: j1Danton,
          j2: j2Danton,
          j3: j3Danton,
          rubricScores: aggregateDantonRubricScores(juriesObj, scoreData.danton?.rubricScores),
        },
        pbb: {
          total: nilaiMurniPeleton,
          nilaiMurni: nilaiMurniPeleton,
          nilaiAkhir: nilaiAkhirPeleton,
          j1: j1Peleton,
          j2: j2Peleton,
          j3: j3Peleton,
          rubricScores: scoreData.pbb?.rubricScores || {},
        },
        penalties: mergedPenalties,
        durationSeconds: scoreData.durationSeconds ?? existing?.durationSeconds ?? null,
        performanceDuration: scoreData.performanceDuration ?? existing?.performanceDuration ?? '',
        nilaiMurniPeleton,
        nilaiAkhirPeleton,
        nilaiMurniDanton,
        nilaiAkhirDanton,
        finalScore,
        notes: scoreData.notes || '',
        isLocked: existing?.isLocked || false,
        status: existing?.status || 'draft',
      };
    };

    setScores(prev => {
      const existing = prev[teamId];
      const record = buildScoreRecord(existing);
      if (!record) return prev;
      newRecord = record;
      return {
        ...prev,
        [teamId]: record,
      };
    });

    if (blockedByLock) {
      console.warn(`[Security] Nilai peleton ${teamId} sudah dikunci dan tidak dapat diubah.`);
      if (typeof alert === 'function') {
        appAlert('Peringatan: Nilai peleton ini sudah disahkan & dikunci (Finalized). Perubahan ditolak.', { title: 'Nilai Sudah Dikunci', variant: 'danger' });
      }
      return null;
    }

    if (!newRecord) {
      newRecord = buildScoreRecord(scores[teamId]);
      if (blockedByLock) return null;
    }

    if (newRecord) {
      saveRecordToSheet('scores', { id: teamId, ...newRecord }).catch(err =>
        console.warn('[CompetitionContext] Sync saveScore to sheet failed:', err)
      );
      recordAuditLog(teamId, 'saveScore', previousRecord, newRecord, currentUser, 'Update skor via saveScore');
    }

    return newRecord;
  }

  function saveJuryPostScore(teamId, postKey, postScoreData) {
    let updatedRecord = null;
    let prevRecord = null;
    let blockedByLock = false;

    const buildPostScoreRecord = (existing) => {
      if (existing && (existing.isLocked || existing.status === 'finalized') && currentUser?.role !== 'superadmin') {
        blockedByLock = true;
        return null;
      }
      prevRecord = existing;

      const currentTeamScore = existing || {
        teamId,
        juries: {},
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
        notes: '',
      };

      const updatedJuries = {
        ...(currentTeamScore.juries || {}),
        [postKey]: {
          ...postScoreData,
          savedAt: new Date().toISOString(),
        },
      };

      const mergedPenalties = calculatePenalties(postScoreData.penalties || currentTeamScore.penalties || {});
      const peletonPenalty = mergedPenalties.peletonPenalty;
      const dantonPenalty = mergedPenalties.dantonPenalty;

      const j1Peleton = Number(updatedJuries.pos1?.peletonTotal ?? updatedJuries.pos1?.total ?? 0);
      const j2Peleton = Number(updatedJuries.pos2?.peletonTotal ?? updatedJuries.pos2?.total ?? 0);
      const j3Peleton = Number(updatedJuries.pos3?.peletonTotal ?? updatedJuries.pos3?.total ?? 0);

      const nilaiMurniPeleton = j1Peleton + j2Peleton + j3Peleton;
      const nilaiAkhirPeleton = Math.max(0, parseFloat((nilaiMurniPeleton - peletonPenalty).toFixed(2)));

      const j1Danton = Number(updatedJuries.pos1?.dantonTotal ?? 0);
      const j2Danton = Number(updatedJuries.pos2?.dantonTotal ?? 0);
      const j3Danton = Number(updatedJuries.pos3?.dantonTotal ?? 0);

      const nilaiMurniDanton = parseFloat((j1Danton + j2Danton + j3Danton).toFixed(2));
      const nilaiAkhirDanton = Math.max(0, parseFloat((nilaiMurniDanton - dantonPenalty).toFixed(2)));

      const finalScore = parseFloat((nilaiAkhirPeleton + nilaiAkhirDanton).toFixed(2));

      return {
        ...currentTeamScore,
        id: teamId,
        teamId,
        juries: updatedJuries,
        penalties: mergedPenalties,
        pbb: {
          total: nilaiMurniPeleton,
          nilaiMurni: nilaiMurniPeleton,
          nilaiAkhir: nilaiAkhirPeleton,
          j1: j1Peleton,
          j2: j2Peleton,
          j3: j3Peleton,
        },
        danton: {
          total: nilaiMurniDanton,
          nilaiMurni: nilaiMurniDanton,
          nilaiAkhir: nilaiAkhirDanton,
          j1: j1Danton,
          j2: j2Danton,
          j3: j3Danton,
          rubricScores: aggregateDantonRubricScores(updatedJuries, currentTeamScore.danton?.rubricScores),
        },
        nilaiMurniPeleton,
        nilaiAkhirPeleton,
        nilaiMurniDanton,
        nilaiAkhirDanton,
        finalScore,
        scoredAt: new Date().toISOString(),
        lastUpdatedBy: postScoreData.juryName || 'Dewan Juri',
        isLocked: Boolean(currentTeamScore.isLocked),
        notes: postScoreData.notes || currentTeamScore.notes || '',
      };
    };

    setScores(prev => {
      const existing = prev[teamId];
      const record = buildPostScoreRecord(existing);
      if (!record) return prev;
      updatedRecord = record;
      return {
        ...prev,
        [teamId]: record,
      };
    });

    if (blockedByLock) {
      console.warn(`[Security] Nilai peleton ${teamId} sudah dikunci (finalized).`);
      if (typeof alert === 'function') {
        appAlert('Peringatan: Nilai peleton ini sudah dikunci secara sah. Perubahan ditolak.', { title: 'Nilai Sudah Dikunci', variant: 'danger' });
      }
      return null;
    }

    if (!updatedRecord) {
      updatedRecord = buildPostScoreRecord(scores[teamId]);
      if (blockedByLock) return null;
    }

    if (updatedRecord) {
      saveRecordToSheet('scores', updatedRecord).catch(err =>
        console.warn('[CompetitionContext] Sync saveJuryPostScore to sheet failed:', err)
      );
      recordAuditLog(teamId, 'saveJuryPostScore', prevRecord, updatedRecord, currentUser, `Update pos ${postKey}`);
    }

    return updatedRecord;
  }

  function saveDraftScore(teamId, draftData) {
    let prevDraftRecord = null;
    let createdRecord = null;
    let blockedByLock = false;

    const buildDraftRecord = (existing) => {
      if (existing && (existing.isLocked || existing.status === 'finalized') && currentUser?.role !== 'superadmin') {
        blockedByLock = true;
        return null;
      }
      prevDraftRecord = existing;

      const rawPenalties = {
        ...(existing?.penalties || {}),
        ...(draftData.penalties || {}),
      };
      // Pertahankan penalti otomatis dari Field Timer jika tidak ada input manual durasi/overtime
      if (
        existing?.fieldTimerData?.overtimeBlocks &&
        draftData.durationSeconds === undefined &&
        !draftData.penalties?.overTimeBlocks
      ) {
        rawPenalties.overTimeBlocks = existing.fieldTimerData.overtimeBlocks;
      }

      const resolvedDurationSeconds =
        draftData.durationSeconds !== undefined
          ? draftData.durationSeconds
          : (existing?.durationSeconds ?? existing?.fieldTimerData?.durationSeconds ?? null);
      const resolvedPerformanceDuration =
        draftData.performanceDuration !== undefined
          ? draftData.performanceDuration
          : (existing?.performanceDuration ||
              (Number.isFinite(resolvedDurationSeconds) && resolvedDurationSeconds > 0
                ? `${String(Math.floor(resolvedDurationSeconds / 60)).padStart(2, '0')}:${String(resolvedDurationSeconds % 60).padStart(2, '0')}`
                : ''));

      const mergedPenalties = calculatePenalties(rawPenalties);
      const peletonPenalty = mergedPenalties.peletonPenalty;
      const dantonPenalty = mergedPenalties.dantonPenalty;

      // Ambil nilai per juri
      const j1Peleton = Number(draftData.juries?.pos1?.peletonTotal ?? draftData.j1Peleton ?? draftData.pbb1?.total ?? draftData.juries?.pos1?.total ?? 0);
      const j2Peleton = Number(draftData.juries?.pos2?.peletonTotal ?? draftData.j2Peleton ?? draftData.pbb2?.total ?? draftData.juries?.pos2?.total ?? 0);
      const j3Peleton = Number(draftData.juries?.pos3?.peletonTotal ?? draftData.j3Peleton ?? draftData.juries?.pos3?.total ?? 0);

      const nilaiMurniPeleton = j1Peleton + j2Peleton + j3Peleton;
      const nilaiAkhirPeleton = Math.max(0, parseFloat((nilaiMurniPeleton - peletonPenalty).toFixed(2)));

      const j1Danton = Number(draftData.juries?.pos1?.dantonTotal ?? draftData.j1Danton ?? 0);
      const j2Danton = Number(draftData.juries?.pos2?.dantonTotal ?? draftData.j2Danton ?? 0);
      const j3Danton = Number(draftData.juries?.pos3?.dantonTotal ?? draftData.j3Danton ?? draftData.danton?.total ?? 0);

      const nilaiMurniDanton = parseFloat((j1Danton + j2Danton + j3Danton).toFixed(2));
      const nilaiAkhirDanton = Math.max(0, parseFloat((nilaiMurniDanton - dantonPenalty).toFixed(2)));

      const calculatedFinal = parseFloat((nilaiAkhirPeleton + nilaiAkhirDanton).toFixed(2));

      const juriesObj = {
        pos1: {
          title: 'Dewan Juri 1',
          peletonTotal: j1Peleton,
          dantonTotal: j1Danton,
          total: j1Peleton,
          rubricScores: draftData.juries?.pos1?.rubricScores || draftData.pbb1?.rubricScores || {},
          dantonRubricScores: draftData.juries?.pos1?.dantonRubricScores || {},
        },
        pos2: {
          title: 'Dewan Juri 2',
          peletonTotal: j2Peleton,
          dantonTotal: j2Danton,
          total: j2Peleton,
          rubricScores: draftData.juries?.pos2?.rubricScores || draftData.pbb2?.rubricScores || {},
          dantonRubricScores: draftData.juries?.pos2?.dantonRubricScores || {},
        },
        pos3: {
          title: 'Dewan Juri 3',
          peletonTotal: j3Peleton,
          dantonTotal: j3Danton,
          total: j3Peleton,
          rubricScores: draftData.juries?.pos3?.rubricScores || {},
          dantonRubricScores: draftData.juries?.pos3?.dantonRubricScores || draftData.danton?.rubricScores || {},
        },
      };

      return {
        ...(existing || {}),
        id: teamId,
        teamId,
        status: 'draft',
        inputBy: currentUser?.name || 'Operator Penginput',
        inputAt: new Date().toISOString(),
        paperEvidenceUrl: draftData.paperEvidenceUrl || existing?.paperEvidenceUrl || '',
        paperEvidenceName: draftData.paperEvidenceName || existing?.paperEvidenceName || 'Lembar_Kertas_Juri.jpg',
        juries: juriesObj,
        pbb: {
          total: nilaiMurniPeleton,
          nilaiMurni: nilaiMurniPeleton,
          nilaiAkhir: nilaiAkhirPeleton,
          j1: j1Peleton,
          j2: j2Peleton,
          j3: j3Peleton,
          rubricScores: draftData.pbb?.rubricScores || draftData.pbb1?.rubricScores || {},
        },
        danton: {
          total: nilaiMurniDanton,
          nilaiMurni: nilaiMurniDanton,
          nilaiAkhir: nilaiAkhirDanton,
          j1: j1Danton,
          j2: j2Danton,
          j3: j3Danton,
          rubricScores: aggregateDantonRubricScores(juriesObj, draftData.danton?.rubricScores),
        },
        penalties: mergedPenalties,
        durationSeconds: resolvedDurationSeconds,
        performanceDuration: resolvedPerformanceDuration,
        nilaiMurniPeleton,
        nilaiAkhirPeleton,
        nilaiMurniDanton,
        nilaiAkhirDanton,
        finalScore: calculatedFinal,
        notes: draftData.notes !== undefined ? draftData.notes : (existing?.notes || ''),
        verificationNotes: '',
        isLocked: false,
      };
    };

    setScores(prev => {
      const existing = prev[teamId];
      const record = buildDraftRecord(existing);
      if (!record) return prev;
      createdRecord = record;
      return {
        ...prev,
        [teamId]: record,
      };
    });

    if (blockedByLock) {
      console.warn(`[Security] Nilai peleton ${teamId} sudah dikunci (finalized). Input draft ditolak.`);
      if (typeof alert === 'function') {
        appAlert('Peringatan: Nilai peleton ini sudah dikunci (Finalized). Operator tidak dapat menimpa dengan draft baru.', { title: 'Nilai Sudah Dikunci', variant: 'danger' });
      }
      return null;
    }

    if (!createdRecord) {
      createdRecord = buildDraftRecord(scores[teamId]);
      if (blockedByLock) return null;
    }

    if (createdRecord) {
      saveRecordToSheet('scores', { id: teamId, ...createdRecord }).catch(err =>
        console.warn('[CompetitionContext] Sync draftScore to sheet failed:', err)
      );
      recordAuditLog(teamId, 'saveDraftScore', prevDraftRecord, createdRecord, currentUser, 'Input draft lembar fisik juri');
    }

    return createdRecord;
  }

  function verifyScore(teamId, isApproved = true, note = '') {
    if (!['verifikator', 'superadmin'].includes(currentUser?.role)) {
      console.warn('[Security] Unauthorized call to verifyScore:', currentUser);
      if (typeof alert === 'function') {
        appAlert('Akses Ditolak: Hanya Verifikator Nilai atau Superadmin yang berhak memverifikasi skor.', { title: 'Akses Ditolak', variant: 'danger' });
      }
      return;
    }

    const approved = typeof isApproved === 'boolean' ? isApproved : Boolean(isApproved);
    let prevRecord = null;
    let nextRecord = null;

    const buildVerifyRecord = (existing) => {
      if (!existing) return null;
      prevRecord = existing;
      return {
        ...existing,
        id: teamId,
        teamId,
        status: approved ? 'verified' : 'rejected_to_draft',
        isVerified: approved,
        verifiedBy: currentUser?.name || 'Verifikator Nilai',
        verifiedAt: new Date().toISOString(),
        verificationNotes: note,
      };
    };

    setScores(prev => {
      const existing = prev[teamId];
      const updated = buildVerifyRecord(existing);
      if (!updated) return prev;
      nextRecord = updated;
      return {
        ...prev,
        [teamId]: updated,
      };
    });

    if (!nextRecord && scores[teamId]) {
      nextRecord = buildVerifyRecord(scores[teamId]);
    }

    if (nextRecord) {
      saveRecordToSheet('scores', { id: teamId, ...nextRecord }).catch(err =>
        console.warn('[CompetitionContext] Sync verifyScore to sheet failed:', err)
      );
      recordAuditLog(teamId, approved ? 'verifyScore_approve' : 'verifyScore_reject', prevRecord, nextRecord, currentUser, note);
    }
  }

  function finalizeScore(teamId, signatureName = null) {
    if (!['finalisator', 'superadmin'].includes(currentUser?.role)) {
      console.warn('[Security] Unauthorized call to finalizeScore:', currentUser);
      if (typeof alert === 'function') {
        appAlert('Akses Ditolak: Hanya Finalisator (Ketua Dewan Juri) atau Superadmin yang berhak mengesahkan & mengunci skor.', { title: 'Akses Ditolak', variant: 'danger' });
      }
      return;
    }

    let prevRecord = null;
    let nextRecord = null;

    const buildFinalizeRecord = (existing) => {
      if (!existing) return null;
      prevRecord = existing;
      return {
        ...existing,
        id: teamId,
        teamId,
        status: 'finalized',
        isVerified: true,
        isLocked: true,
        finalizedBy: signatureName || currentUser?.name || 'Ketua Dewan Juri',
        finalizedAt: new Date().toISOString(),
      };
    };

    setScores(prev => {
      const existing = prev[teamId];
      const updated = buildFinalizeRecord(existing);
      if (!updated) return prev;
      nextRecord = updated;
      return {
        ...prev,
        [teamId]: updated,
      };
    });

    if (!nextRecord && scores[teamId]) {
      nextRecord = buildFinalizeRecord(scores[teamId]);
    }

    if (nextRecord) {
      saveRecordToSheet('scores', { id: teamId, ...nextRecord }).catch(err =>
        console.warn('[CompetitionContext] Sync finalizeScore to sheet failed:', err)
      );
      recordAuditLog(teamId, 'finalizeScore', prevRecord, nextRecord, currentUser, `Finalisasi mutlak oleh ${signatureName || currentUser?.name}`);
    }
  }

  // 5. Buka Kunci Nilai (Unlock) oleh Superadmin
  function unlockScore(teamId) {
    if (currentUser && currentUser.role !== 'superadmin') {
      console.warn('[Security] Unauthorized call to unlockScore:', currentUser);
      if (typeof alert === 'function') {
        appAlert('Akses Ditolak: Hanya Superadmin yang berhak membuka kunci nilai.', { title: 'Akses Ditolak', variant: 'danger' });
      }
      return;
    }

    let prevRecord = null;
    let nextRecord = null;

    const buildUnlockRecord = (existing) => {
      if (!existing) return null;
      prevRecord = existing;
      return {
        ...existing,
        id: teamId,
        teamId,
        status: 'draft',
        isLocked: false,
        unlockedBy: currentUser?.name || 'Superadmin',
        unlockedAt: new Date().toISOString(),
      };
    };

    setScores(prev => {
      const existing = prev[teamId];
      const updated = buildUnlockRecord(existing);
      if (!updated) return prev;
      nextRecord = updated;
      return {
        ...prev,
        [teamId]: updated,
      };
    });

    if (!nextRecord && scores[teamId]) {
      nextRecord = buildUnlockRecord(scores[teamId]);
    }

    if (nextRecord) {
      saveRecordToSheet('scores', { id: teamId, ...nextRecord }).catch(err =>
        console.warn('[CompetitionContext] Sync unlockScore to sheet failed:', err)
      );
      recordAuditLog(teamId, 'unlockScore', prevRecord, nextRecord, currentUser, `Buka kunci nilai peleton oleh ${currentUser?.name || 'Superadmin'}`);
    }
  }

  return {
    saveScore,
    saveJuryPostScore,
    saveDraftScore,
    verifyScore,
    finalizeScore,
    unlockScore,
  };
}
