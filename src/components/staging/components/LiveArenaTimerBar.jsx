import React from 'react';
import { Play, Pause, RotateCcw, CheckCircle2 } from 'lucide-react';

export default function LiveArenaTimerBar({
  activeArenaTeam,
  fieldTimer,
  maxDuration,
  elapsed,
  remaining,
  isOvertime,
  overtimeSeconds,
  overtimePenalty,
  progressPct,
  timerTheme,
  progressColor,
  formatTime,
  resumeFieldTimer,
  startFieldTimer,
  pauseFieldTimer,
  stopAndSaveFieldTimer,
  resetFieldTimer
}) {
  return (
    <div className={`rounded-3xl p-6 border shadow-sm transition-all ${timerTheme}`}>
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        {/* Left: Active Team Info */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-[11px] font-black uppercase tracking-wider bg-red-600 text-white px-2.5 py-0.5 rounded-full animate-pulse shadow-xs">
              <span className="w-2 h-2 rounded-full bg-white" />
              KOTAK LOMBA SEDANG AKTIF
            </span>
            <span className="text-xs text-slate-600 font-mono font-bold">
              Maksimal: {Math.floor(maxDuration / 60)} Menit ({activeArenaTeam?.jenjang || 'SMP'})
            </span>
          </div>

          {activeArenaTeam ? (
            <div>
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-1 bg-amber-400 text-slate-950 font-mono font-black text-sm rounded-lg shadow-xs">
                  No. {activeArenaTeam.lotNumber ? String(activeArenaTeam.lotNumber).padStart(2, '0') : '--'}
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 uppercase tracking-tight">
                  {activeArenaTeam.schoolName}
                </h2>
              </div>
              <p className="text-xs text-slate-600 mt-1">
                Peleton: <strong className="text-slate-900">{activeArenaTeam.platoonName}</strong> • Danton: <strong className="text-slate-900">{activeArenaTeam.roster?.danton?.name || activeArenaTeam.dantonName || '-'}</strong>
              </p>
            </div>
          ) : (
            <div>
              <h2 className="text-xl font-bold text-slate-500 italic">
                Belum ada peleton yang sedang tampil di arena.
              </h2>
              <p className="text-xs text-slate-500">
                Pilih peleton dari DP 3 dan klik "Mulai Tampil (Masuk Arena)" di bawah.
              </p>
            </div>
          )}
        </div>

        {/* Center: Big Digital Clock */}
        <div className="flex flex-col items-center justify-center text-center">
          <div className="font-mono font-black text-5xl sm:text-6xl tracking-tight text-slate-900 drop-shadow-xs">
            {formatTime(elapsed)}
          </div>
          <div className="flex items-center gap-4 text-xs mt-2 font-mono">
            <span className="text-slate-600">
              Sisa: <strong className="text-slate-900 font-bold">{formatTime(remaining)}</strong>
            </span>
            {isOvertime && (
              <span className="text-rose-700 font-bold bg-rose-100 px-2 py-0.5 rounded border border-rose-300 animate-bounce">
                OVERTIME +{formatTime(overtimeSeconds)} (-{overtimePenalty} Poin)
              </span>
            )}
          </div>
        </div>

        {/* Right: Stopwatch Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {!fieldTimer.isRunning ? (
            <button
              disabled={!activeArenaTeam}
              onClick={() => {
                if (activeArenaTeam) {
                  if (fieldTimer.elapsedSeconds > 0) resumeFieldTimer();
                  else startFieldTimer(activeArenaTeam.id);
                }
              }}
              className="px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-sm transition-all active:scale-95 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>{fieldTimer.elapsedSeconds > 0 ? 'Lanjutkan Timer' : 'Mulai Tampil'}</span>
            </button>
          ) : (
            <button
              onClick={pauseFieldTimer}
              className="px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-sm transition-all active:scale-95 cursor-pointer"
            >
              <Pause className="w-4 h-4 fill-current" />
              <span>Jeda Sementara</span>
            </button>
          )}

          <button
            disabled={!activeArenaTeam}
            onClick={() => {
              if (activeArenaTeam && window.confirm(`Konfirmasi selesai tampil untuk ${activeArenaTeam.schoolName}? Waktu akhir ${formatTime(elapsed)} akan dikunci.`)) {
                stopAndSaveFieldTimer(activeArenaTeam.id, activeArenaTeam.jenjang);
              }
            }}
            className="px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-sm transition-all active:scale-95 cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Selesai & Kunci Waktu</span>
          </button>

          <button
            onClick={resetFieldTimer}
            title="Reset Timer"
            className="p-3 rounded-2xl bg-white hover:bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200 shadow-xs transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-5 w-full bg-slate-200/80 rounded-full h-2.5 overflow-hidden">
        <div
          className={`h-full transition-all duration-300 ${progressColor}`}
          style={{ width: `${progressPct}%` }}
        />
      </div>
    </div>
  );
}
