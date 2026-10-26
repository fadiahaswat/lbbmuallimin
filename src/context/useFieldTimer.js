import { useState, useRef, useEffect } from 'react';
import { STAGING_CONFIG } from '../config.js';
import { saveRecordToSheet } from '../services/sheetService.js';
import { calculatePenalties } from './scoringActions.js';

export function useFieldTimer({ updateTeamStaging, setScores }) {
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
    if (!teamId) return;
    const maxSeconds = jenjang === 'SD' ? STAGING_CONFIG.DURATIONS.SD : STAGING_CONFIG.DURATIONS.SMP;
    const elapsed = fieldTimer.elapsedSeconds;
    const overtimeSeconds = Math.max(0, elapsed - maxSeconds);
    const overtimeBlocks = Math.ceil(overtimeSeconds / 30);

    updateTeamStaging(teamId, 'finished', {
      durationSeconds: elapsed,
      overtimePenaltyBlocks: overtimeBlocks,
    });

    let updatedScoreRecord = null;

    setScores(prev => {
      const existing = prev[teamId] || {
        id: teamId,
        teamId,
        status: 'draft',
        juries: {},
        pbb: { total: 0, j1: 0, j2: 0, rubricScores: {} },
        danton: { total: 0, rubricScores: {} },
        penalties: {
          upacara: false,
          upacaraTerlambatBlocks: 0,
          dp1: false,
          personelKurang: false,
          overTimeBlocks: 0,
          injakGarisCount: 0,
          kotakDantonCount: 0,
          penyesuaianCount: 0,
          yelYelCount: 0,
          rokokCount: 0,
          basecampKotor: false,
          totalPenalty: 0,
        },
        finalScore: 0,
        isLocked: false,
      };

      if (existing.isLocked || existing.status === 'finalized') {
        return prev;
      }

      const pen = calculatePenalties({
        ...(existing.penalties || {}),
        overTimeBlocks: overtimeBlocks,
      });

      const pbbTotal = Number(existing.nilaiMurniPeleton ?? existing.pbb?.total ?? 0);
      const dantonTotal = Number(existing.nilaiMurniDanton ?? existing.danton?.total ?? 0);
      const nilaiAkhirPeleton = Math.max(0, parseFloat((pbbTotal - pen.peletonPenalty).toFixed(2)));
      const nilaiAkhirDanton = Math.max(0, parseFloat((dantonTotal - pen.dantonPenalty).toFixed(2)));
      const finalScore = Math.max(0, parseFloat((nilaiAkhirPeleton + nilaiAkhirDanton).toFixed(2)));

      const nextScore = {
        ...existing,
        id: teamId,
        teamId,
        penalties: pen,
        peletonPenalty: pen.peletonPenalty,
        dantonPenalty: pen.dantonPenalty,
        nilaiAkhirPeleton,
        nilaiAkhirDanton,
        fieldTimerData: {
          ...(existing.fieldTimerData || {}),
          durationSeconds: elapsed,
          overtimeSeconds,
          overtimeBlocks,
          recordedAt: new Date().toISOString(),
        },
        finalScore,
      };
      updatedScoreRecord = nextScore;

      return {
        ...prev,
        [teamId]: nextScore,
      };
    });

    if (updatedScoreRecord) {
      saveRecordToSheet('scores', { id: teamId, ...updatedScoreRecord }).catch(err =>
        console.warn('[CompetitionContext] Sync stopAndSaveFieldTimer score to sheet failed:', err)
      );
    }

    resetFieldTimer();
  }

  return {
    fieldTimer,
    startFieldTimer,
    pauseFieldTimer,
    resumeFieldTimer,
    resetFieldTimer,
    stopAndSaveFieldTimer
  };
}
