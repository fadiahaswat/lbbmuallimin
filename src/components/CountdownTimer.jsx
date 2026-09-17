import React, { useState, useEffect } from 'react';
import { EVENT, COMPETITION } from '../config.js';
import { useCompetition } from '../context/CompetitionContext.jsx';

function pad(num) {
  return String(num).padStart(2, '0');
}

export default function CountdownTimer() {
  const { settings, teams } = useCompetition();

  const [timerState, setTimerState] = useState({
    days: '00',
    hours: '00',
    minutes: '00',
    seconds: '00',
    phase: 'open', // 'upcoming' | 'open' | 'expired' | 'full'
    label: 'Batas Akhir Pendaftaran',
  });

  // Check quota fullness (SD + SMP)
  const totalTargetSD = settings?.quotaSD || COMPETITION.SD.TARGET_PLATOONS || 18;
  const totalTargetSMP = settings?.quotaSMP || COMPETITION.SMP.TARGET_PLATOONS || 18;
  const registeredSD = (teams || []).filter(t => t.jenjang === 'SD').length;
  const registeredSMP = (teams || []).filter(t => t.jenjang === 'SMP').length;
  const isQuotaFull = registeredSD >= totalTargetSD && registeredSMP >= totalTargetSMP;

  const eventDates = settings?.eventDates || {};
  const regStartStr = eventDates.registrationStart || EVENT.REGISTRATION_START;
  const regDeadlineStr = eventDates.registrationDeadline || EVENT.REGISTRATION_DEADLINE;
  const isRegOpenMaster = settings?.registrationOpen !== false;

  useEffect(() => {
    let intervalId = null;

    function updateTimer() {
      // Jika manual ditutup oleh Superadmin
      if (!isRegOpenMaster) {
        setTimerState(prev => ({
          ...prev,
          days: '00',
          hours: '00',
          minutes: '00',
          seconds: '00',
          phase: 'expired',
          label: 'Pendaftaran Ditutup Manual oleh Panitia',
        }));
        return;
      }

      // Jika kuota kedua kategori sudah penuh otomatis tutup
      if (isQuotaFull) {
        setTimerState(prev => ({
          ...prev,
          days: '00',
          hours: '00',
          minutes: '00',
          seconds: '00',
          phase: 'full',
          label: 'Pendaftaran Ditutup (Kuota Penuh)',
        }));
        return;
      }

      const now = Date.now();
      const start = regStartStr ? new Date(regStartStr).getTime() : null;
      const deadline = new Date(regDeadlineStr).getTime();

      // Kasus 1: Belum buka
      if (start && now < start) {
        const distance = start - now;
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        setTimerState({
          days: pad(days),
          hours: pad(hours),
          minutes: pad(minutes),
          seconds: pad(seconds),
          phase: 'upcoming',
          label: 'Pendaftaran Dibuka Dalam',
        });
        return;
      }

      // Kasus 2: Sudah lewat batas akhir
      const distance = deadline - now;
      if (distance <= 0) {
        setTimerState(prev => ({
          ...prev,
          days: '00',
          hours: '00',
          minutes: '00',
          seconds: '00',
          phase: 'expired',
          label: 'Pendaftaran Telah Ditutup',
        }));
        if (intervalId) clearInterval(intervalId);
        return;
      }

      // Kasus 3: Periode aktif pendaftaran (21 September - 5 Oktober)
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimerState({
        days: pad(days),
        hours: pad(hours),
        minutes: pad(minutes),
        seconds: pad(seconds),
        phase: 'open',
        label: 'Sisa Waktu Pendaftaran',
      });
    }

    updateTimer();
    intervalId = setInterval(updateTimer, 1000);
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [regStartStr, regDeadlineStr, isRegOpenMaster, isQuotaFull]);

  if (timerState.phase === 'full') {
    return (
      <div className="flex flex-col items-center gap-2 p-3 bg-amber-950/70 border border-amber-500/50 rounded-2xl shadow-xl">
        <span className="text-xs font-black uppercase tracking-widest text-amber-300">
          KUOTA TELAH TERPENUHI
        </span>
        <span className="text-[11px] font-bold text-amber-100/90 text-center">
          Pendaftaran otomatis ditutup karena seluruh kuota (SD & SMP) telah terisi penuh.
        </span>
      </div>
    );
  }

  if (timerState.phase === 'expired') {
    return (
      <div className="flex flex-col items-center gap-1.5 text-red-400 font-bold bg-black/70 px-5 py-3 rounded-2xl border border-red-500/40 shadow-lg text-center">
        <span className="text-xs uppercase tracking-widest font-black text-red-300">
          {timerState.label}
        </span>
        <span className="text-[11px] text-slate-300">
          Masa penerimaan berkas pendaftaran telah berakhir.
        </span>
      </div>
    );
  }

  const items = [
    { value: timerState.days, label: 'Hari' },
    { value: timerState.hours, label: 'Jam' },
    { value: timerState.minutes, label: 'Menit' },
    { value: timerState.seconds, label: 'Detik' },
  ];

  return (
    <div className="flex flex-col items-center gap-2.5">
      <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-yellow-200/80">
        {timerState.label}
      </span>
      <div className="flex items-center gap-2 sm:gap-3">
        {items.map((item, idx) => (
          <React.Fragment key={idx}>
            <div className="flex flex-col items-center">
              <div className="w-13 sm:w-16 h-13 sm:h-16 px-2 rounded-xl bg-black/50 border border-white/15 backdrop-blur-md shadow-lg shadow-black/40 flex items-center justify-center">
                <span className="font-mono text-xl sm:text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 to-amber-500 tracking-tight">
                  {item.value}
                </span>
              </div>
              <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-yellow-100/70 mt-1.5">
                {item.label}
              </span>
            </div>
            {idx < items.length - 1 && (
              <span className="text-yellow-500/50 text-lg sm:text-xl font-black -mt-4 select-none animate-pulse">
                :
              </span>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
