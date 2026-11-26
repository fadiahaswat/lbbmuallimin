import React, { useState, useEffect } from 'react';
import { EVENT, COMPETITION, PAYMENT } from '../config.js';
import { useCompetition } from '../context/CompetitionContext.jsx';
import { isTestingTeam } from '../context/competitionHelpers.js';

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
    phase: 'open_until_full', // 'upcoming' | 'open' | 'open_until_full' | 'expired' | 'full'
    label: 'Status Pendaftaran',
  });

  // Check quota fullness (SD + SMP)
  const totalTargetSD = settings?.quotaSD || COMPETITION.SD.TARGET_PLATOONS || 18;
  const totalTargetSMP = settings?.quotaSMP || COMPETITION.SMP.TARGET_PLATOONS || 18;
  const totalQuota = totalTargetSD + totalTargetSMP;
  const registeredSD = (teams || []).filter(t => t.jenjang === 'SD' && t.status !== 'rejected' && !isTestingTeam(t)).length;
  const registeredSMP = (teams || []).filter(t => t.jenjang === 'SMP' && t.status !== 'rejected' && !isTestingTeam(t)).length;
  const isQuotaFull = registeredSD >= totalTargetSD && registeredSMP >= totalTargetSMP;

  const eventDates = settings?.eventDates || {};
  const regStartStr = eventDates.registrationStart || EVENT.REGISTRATION_START;
  const regDeadlineStr = EVENT.REGISTRATION_OPEN_UNTIL_QUOTA_FULL
    ? ''
    : (eventDates.registrationDeadline || EVENT.REGISTRATION_DEADLINE || '');
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

      // Kasus 2: Mode dibuka sampai kuota habis (tanpa batas tanggal)
      if (!regDeadlineStr) {
        setTimerState(prev => ({
          ...prev,
          phase: 'open_until_full',
          label: 'Pendaftaran Dibuka s.d. Kuota Penuh',
        }));
        if (intervalId) clearInterval(intervalId);
        return;
      }

      // Kasus 3: Sudah lewat batas akhir (jika batas tanggal aktif)
      const deadline = new Date(regDeadlineStr).getTime();
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

      // Kasus 4: Periode aktif pendaftaran dengan batas tanggal
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

  if (timerState.phase === 'open_until_full') {
    return (
      <div className="w-full flex flex-col items-center lg:items-start text-center lg:text-left">
        <div className="inline-flex items-center gap-2 mb-3">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
          </span>
          <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-emerald-400">
            Pendaftaran Aktif
          </span>
        </div>

        <h3 className="text-2xl sm:text-[26px] font-black tracking-tight leading-[1.15] text-white">
          Dibuka Hingga{' '}
          <span className="text-amber-400 block sm:inline lg:block">
            Kuota Terpenuhi
          </span>
        </h3>

        <p className="text-xs text-slate-400 mt-2.5 leading-relaxed max-w-xs">
          Pendaftaran otomatis ditutup setelah seluruh kuota {totalQuota} peleton terisi penuh.
        </p>

        <div className="w-full mt-5 pt-4 border-t border-white/10 flex items-center justify-between gap-3">
          <div className="text-left">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Tarif Berlaku
            </span>
            <span className="text-xs font-semibold text-slate-200">
              Gelombang 2 · Semua Pendaftar
            </span>
          </div>
          <div className="text-right shrink-0">
            <span className="font-mono text-lg sm:text-xl font-black text-amber-400 tracking-tight block leading-none">
              Rp{PAYMENT.FEE_DISPLAY}
            </span>
            <span className="text-[10px] text-slate-400 mt-1 block">
              / peleton (kode 108)
            </span>
          </div>
        </div>
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
              <div className="w-13 sm:w-16 h-13 sm:h-16 px-2 rounded-xl bg-black/40 border border-white/10 shadow-sm flex items-center justify-center">
                <span className="font-mono text-xl sm:text-2xl md:text-3xl font-bold text-amber-400 tracking-tight">
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
