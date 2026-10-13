import { saveRecordToSheet } from '../services/sheetService.js';

export function createScoringActions({ setScores, currentUser }) {
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

    setScores(prev => {
      const existing = prev[teamId];
      if (existing && (existing.isLocked || existing.status === 'finalized') && currentUser?.role !== 'superadmin') {
        console.warn(`[Security] Nilai peleton ${teamId} sudah dikunci dan tidak dapat diubah.`);
        alert('Peringatan: Nilai peleton ini sudah disahkan & dikunci (Finalized). Perubahan ditolak.');
        return prev;
      }
      previousRecord = existing;

      const pbb1Val = Number(scoreData.juries?.pos1?.total ?? scoreData.pbb1?.total ?? scoreData.pbb?.total ?? 0);
      const pbb2Val = Number(scoreData.juries?.pos2?.total ?? scoreData.pbb2?.total ?? 0);
      
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
        juryName: scoreData.juryName || currentUser?.name || 'Dewan Juri LBB Muallimin',
        juryRole: scoreData.juryRole || currentUser?.roleLabel || 'Juri Lapangan',
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
        isLocked: existing?.isLocked || false,
        status: existing?.status || 'draft',
      };
      newRecord = record;

      return {
        ...prev,
        [teamId]: record,
      };
    });

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
    setScores(prev => {
      const existing = prev[teamId];
      if (existing && (existing.isLocked || existing.status === 'finalized') && currentUser?.role !== 'superadmin') {
        console.warn(`[Security] Nilai peleton ${teamId} sudah dikunci (finalized).`);
        alert('Peringatan: Nilai peleton ini sudah dikunci secara sah. Perubahan ditolak.');
        return prev;
      }
      prevRecord = existing;

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

      const incomingPen = postScoreData.penalties || currentTeamScore.penalties || {};
      let totalPenalty = 0;
      if (incomingPen.upacara) totalPenalty += 150;
      if (incomingPen.dp1) totalPenalty += 100;
      if (incomingPen.personelKurang) totalPenalty += 75;
      totalPenalty += (incomingPen.overTimeBlocks || 0) * 50;
      totalPenalty += (incomingPen.injakGarisCount || 0) * 50;
      // Penalti Yel-Yel Selama Penampilan (Bab H.11): -50 poin per pelanggaran
      totalPenalty += (incomingPen.yelYelCount || 0) * 50;
      // Gerakan penyesuaian: 0 poin penalti (Bab H.6 & Bab A.6)
      const mergedPenalties = {
        ...incomingPen,
        totalPenalty,
      };

      const juri1Total = updatedJuries.pos1?.total !== undefined
        ? Number(updatedJuries.pos1.total)
        : (currentTeamScore.juries?.pos1?.total !== undefined ? Number(currentTeamScore.juries.pos1.total) : null);

      const juri2Total = updatedJuries.pos2?.total !== undefined
        ? Number(updatedJuries.pos2.total)
        : (currentTeamScore.juries?.pos2?.total !== undefined ? Number(currentTeamScore.juries.pos2.total) : null);

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

      const dantonTotal = updatedJuries.pos3?.total !== undefined
        ? Number(updatedJuries.pos3.total)
        : (currentTeamScore.danton?.total !== undefined ? Number(currentTeamScore.danton.total) : 0);

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
      recordAuditLog(teamId, 'saveJuryPostScore', prevRecord, updatedRecord, currentUser, `Update pos ${postKey}`);
    }

    return updatedRecord;
  }

  function saveDraftScore(teamId, draftData) {
    let prevDraftRecord = null;
    let createdRecord = null;

    setScores(prev => {
      const existing = prev[teamId];
      if (existing && (existing.isLocked || existing.status === 'finalized') && currentUser?.role !== 'superadmin') {
        console.warn(`[Security] Nilai peleton ${teamId} sudah dikunci (finalized). Input draft ditolak.`);
        alert('Peringatan: Nilai peleton ini sudah dikunci (Finalized). Operator tidak dapat menimpa dengan draft baru.');
        return prev;
      }
      prevDraftRecord = existing;

      const pbb1Val = Number(draftData.pbb1?.total ?? draftData.juries?.pos1?.total ?? draftData.pbb?.total ?? 0);
      const pbb2Val = Number(draftData.pbb2?.total ?? draftData.juries?.pos2?.total ?? draftData.kekompakan?.total ?? 0);
      
      let pbbVal = 0;
      if (pbb1Val > 0 && pbb2Val > 0) {
        pbbVal = parseFloat(((pbb1Val + pbb2Val) / 2).toFixed(2));
      } else {
        pbbVal = pbb1Val || pbb2Val || Number(draftData.pbb?.total ?? 0);
      }

      const dantonVal = Number(draftData.danton?.total ?? draftData.juries?.pos3?.total ?? 0);
      const penaltyVal = Number(draftData.penalties?.totalPenalty ?? 0);

      const calculatedFinal = Math.max(0, parseFloat((pbbVal + dantonVal - penaltyVal).toFixed(2)));

      const record = {
        teamId,
        status: 'draft',
        inputBy: currentUser?.name || 'Operator Penginput',
        inputAt: new Date().toISOString(),
        paperEvidenceUrl: draftData.paperEvidenceUrl || '',
        paperEvidenceName: draftData.paperEvidenceName || 'Lembar_Kertas_Juri.jpg',
        juries: {
          pos1: {
            title: 'Juri 1: Kebenaran Teknik PBB',
            total: pbb1Val,
            rubricScores: draftData.pbb1?.rubricScores || draftData.juries?.pos1?.rubricScores || draftData.pbb?.rubricScores || {},
          },
          pos2: {
            title: 'Juri 2: Kekompakan Peleton',
            total: pbb2Val,
            rubricScores: draftData.pbb2?.rubricScores || draftData.juries?.pos2?.rubricScores || draftData.kekompakan?.rubricScores || {},
          },
          pos3: {
            title: 'Juri 3: Komandan Peleton (Danton)',
            total: dantonVal,
            rubricScores: draftData.danton?.rubricScores || draftData.juries?.pos3?.rubricScores || {},
          },
        },
        pbb: {
          total: pbbVal,
          j1: pbb1Val,
          j2: pbb2Val,
          rubricScores: draftData.pbb?.rubricScores || draftData.pbb1?.rubricScores || {},
        },
        danton: { total: dantonVal, rubricScores: draftData.danton?.rubricScores || {} },
        penalties: draftData.penalties || { totalPenalty: 0 },
        fieldTimerData: draftData.fieldTimerData || {},
        finalScore: calculatedFinal,
        notes: draftData.notes || '',
        verificationNotes: '',
        isLocked: false,
      };
      createdRecord = record;

      return {
        ...prev,
        [teamId]: record,
      };
    });

    if (createdRecord) {
      saveRecordToSheet('scores', { id: teamId, ...createdRecord }).catch(err =>
        console.warn('[CompetitionContext] Sync draftScore to sheet failed:', err)
      );
      recordAuditLog(teamId, 'saveDraftScore', prevDraftRecord, createdRecord, currentUser, 'Input draft lembar fisik juri');
    }

    return createdRecord;
  }

  function verifyScore(teamId, isApproved, note = '') {
    if (!['verifikator', 'superadmin'].includes(currentUser?.role)) {
      console.warn('[Security] Unauthorized call to verifyScore:', currentUser);
      alert('Akses Ditolak: Hanya Verifikator Nilai atau Superadmin yang berhak memverifikasi skor.');
      return;
    }

    let prevRecord = null;
    let nextRecord = null;

    setScores(prev => {
      const existing = prev[teamId];
      if (!existing) return prev;
      prevRecord = existing;

      const updated = {
        ...existing,
        status: isApproved ? 'verified' : 'rejected_to_draft',
        verifiedBy: currentUser?.name || 'Verifikator Nilai',
        verifiedAt: new Date().toISOString(),
        verificationNotes: note,
      };
      nextRecord = updated;

      saveRecordToSheet('scores', { id: teamId, ...updated }).catch(err =>
        console.warn('[CompetitionContext] Sync verifyScore to sheet failed:', err)
      );

      return {
        ...prev,
        [teamId]: updated,
      };
    });

    if (nextRecord) {
      recordAuditLog(teamId, isApproved ? 'verifyScore_approve' : 'verifyScore_reject', prevRecord, nextRecord, currentUser, note);
    }
  }

  function finalizeScore(teamId, signatureName = null) {
    if (!['finalisator', 'superadmin'].includes(currentUser?.role)) {
      console.warn('[Security] Unauthorized call to finalizeScore:', currentUser);
      alert('Akses Ditolak: Hanya Finalisator (Ketua Dewan Juri) atau Superadmin yang berhak mengesahkan & mengunci skor.');
      return;
    }

    let prevRecord = null;
    let nextRecord = null;

    setScores(prev => {
      const existing = prev[teamId];
      if (!existing) return prev;
      prevRecord = existing;

      const updated = {
        ...existing,
        status: 'finalized',
        isLocked: true,
        finalizedBy: signatureName || currentUser?.name || 'Ketua Dewan Juri',
        finalizedAt: new Date().toISOString(),
      };
      nextRecord = updated;

      saveRecordToSheet('scores', { id: teamId, ...updated }).catch(err =>
        console.warn('[CompetitionContext] Sync finalizeScore to sheet failed:', err)
      );

      return {
        ...prev,
        [teamId]: updated,
      };
    });

    if (nextRecord) {
      recordAuditLog(teamId, 'finalizeScore', prevRecord, nextRecord, currentUser, `Finalisasi mutlak oleh ${signatureName || currentUser?.name}`);
    }
  }

  return {
    saveScore,
    saveJuryPostScore,
    saveDraftScore,
    verifyScore,
    finalizeScore
  };
}
