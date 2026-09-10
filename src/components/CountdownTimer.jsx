import React, { useState, useEffect } from 'react';
import { EVENT } from '../config.js';

function pad(num) {
  return String(num).padStart(2, '0');
}

export default function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState({
    days: '00',
    hours: '00',
    minutes: '00',
    seconds: '00',
    isExpired: false,
  });

  useEffect(() => {
    const target = new Date(EVENT.REGISTRATION_DEADLINE).getTime();

    function updateTimer() {
      const now = Date.now();
      const distance = target - now;

      if (distance < 0) {
        setTimeLeft({
          days: '00',
          hours: '00',
          minutes: '00',
          seconds: '00',
          isExpired: true,
        });
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft({
        days: pad(days),
        hours: pad(hours),
        minutes: pad(minutes),
        seconds: pad(seconds),
        isExpired: false,
      });
    }

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  if (timeLeft.isExpired) {
    return (
      <div className="flex gap-3 text-red-500 font-bold bg-black/40 px-4 py-2 rounded-lg border border-red-500/30">
        PENDAFTARAN DITUTUP
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <div className="flex flex-col items-center">
        <div className="bg-black/20 border border-white/10 rounded-lg w-10 h-10 md:w-12 md:h-12 flex items-center justify-center backdrop-blur-sm">
          <span className="text-base md:text-xl font-black text-lbb-gold">{timeLeft.days}</span>
        </div>
        <span className="text-[8px] font-bold uppercase tracking-wider text-white/60 mt-1">Hari</span>
      </div>
      <div className="text-white/30 text-lg font-black pb-4">:</div>
      <div className="flex flex-col items-center">
        <div className="bg-black/20 border border-white/10 rounded-lg w-10 h-10 md:w-12 md:h-12 flex items-center justify-center backdrop-blur-sm">
          <span className="text-base md:text-xl font-black text-lbb-gold">{timeLeft.hours}</span>
        </div>
        <span className="text-[8px] font-bold uppercase tracking-wider text-white/60 mt-1">Jam</span>
      </div>
      <div className="text-white/30 text-lg font-black pb-4">:</div>
      <div className="flex flex-col items-center">
        <div className="bg-black/20 border border-white/10 rounded-lg w-10 h-10 md:w-12 md:h-12 flex items-center justify-center backdrop-blur-sm">
          <span className="text-base md:text-xl font-black text-lbb-gold">{timeLeft.minutes}</span>
        </div>
        <span className="text-[8px] font-bold uppercase tracking-wider text-white/60 mt-1">Min</span>
      </div>
      <div className="text-white/30 text-lg font-black pb-4">:</div>
      <div className="flex flex-col items-center">
        <div className="bg-black/20 border border-white/10 rounded-lg w-10 h-10 md:w-12 md:h-12 flex items-center justify-center backdrop-blur-sm">
          <span className="text-base md:text-xl font-black text-lbb-gold">{timeLeft.seconds}</span>
        </div>
        <span className="text-[8px] font-bold uppercase tracking-wider text-white/60 mt-1">Det</span>
      </div>
    </div>
  );
}
