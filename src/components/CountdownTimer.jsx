import React, { useState, useEffect } from 'react';
import { EVENT } from '../config.js';

function pad(num) {
  return String(num).padStart(2, '0');
}

export default function CountdownTimer() {
  const [timerState, setTimerState] = useState({
    days: '00',
    hours: '00',
    minutes: '00',
    seconds: '00',
    phase: 'open', // 'upcoming' | 'open' | 'expired'
    label: 'Batas Akhir Pendaftaran',
  });

  useEffect(() => {
    let intervalId = null;

    function updateTimer() {
      const now = Date.now();
      const start = EVENT.REGISTRATION_START ? new Date(EVENT.REGISTRATION_START).getTime() : null;
      const deadline = new Date(EVENT.REGISTRATION_DEADLINE).getTime();

      // Kasus 1: Belum buka (Sebelum 14 September)
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

      // Kasus 2: Sudah lewat batas akhir (Setelah 30 September 23:59 WIB)
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

      // Kasus 3: Periode aktif pendaftaran (14 - 30 September)
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
  }, []);

  if (timerState.phase === 'expired') {
    return (
      <div className="flex gap-3 text-red-400 font-bold bg-black/60 px-5 py-2.5 rounded-xl border border-red-500/40 shadow-lg">
        PENDAFTARAN TELAH DITUTUP
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
