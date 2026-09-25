import { useState, useRef, useEffect } from 'react';
import { STAGING_CONFIG } from '../config.js';

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
    const maxSeconds = jenjang === 'SD' ? STAGING_CONFIG.DURATIONS.SD : STAGING_CONFIG.DURATIONS.SMP;
    const elapsed = fieldTimer.elapsedSeconds;
    const overtimeSeconds = Math.max(0, elapsed - maxSeconds);
    const overtimeBlocks = Math.ceil(overtimeSeconds / 30);

    updateTeamStaging(teamId, 'finished', {
      durationSeconds: elapsed,
      overtimePenaltyBlocks: overtimeBlocks,
    });

    setScores(prev => {
      const existing = prev[teamId];
      if (!existing) return prev;
      const pen = {
        ...(existing.penalties || {}),
        overTimeBlocks: overtimeBlocks,
      };
      let totalPenalty = 0;
      if (pen.upacara) totalPenalty += 150;
      if (pen.dp1) totalPenalty += 100;
      if (pen.personelKurang) totalPenalty += 75;
      totalPenalty += (pen.overTimeBlocks || 0) * 50;
      totalPenalty += (pen.injakGarisCount || 0) * 50;
      if ((pen.penyesuaianCount || 0) > 3) totalPenalty += 25;
      pen.totalPenalty = totalPenalty;

      const pbbTotal = existing.pbb?.total || 0;
      const dantonTotal = existing.danton?.total || 0;
      const finalScore = Math.max(0, parseFloat((pbbTotal + dantonTotal - totalPenalty).toFixed(2)));

      return {
        ...prev,
        [teamId]: {
          ...existing,
          penalties: pen,
          finalScore,
        },
      };
    });

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
