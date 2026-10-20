import React, { useState } from 'react';
import {
  AlertCircle,
  MonitorSmartphone,
  CalendarClock,
  Users,
  CheckCircle2,
  Wallet,
  Copy,
  Check,
  ExternalLink,
  FileUp,
  FileSignature,
  Image as ImageIcon,
  Shield,
  ShieldCheck,
  UserCheck,
  PlusCircle,
  AlertOctagon,
  Headset,
  Phone,
  Instagram,
  Globe,
  Video,
  CreditCard,
  School,
  GraduationCap,
  Clock
} from 'lucide-react';
import { EVENT, COMPETITION, PAYMENT, REGISTRATION, CONTACT, SOCIAL, CLIPBOARD } from '../config.js';
import { useCompetition } from '../context/CompetitionContext.jsx';
import CountdownTimer from './CountdownTimer.jsx';

export default function Registration() {
  const {
    openModal,
    setActiveView,
    teams,
    settings,
    isLocalhost,
    isRegistrationStarted,
    canAccessRegistration
  } = useCompetition();
  const [copied, setCopied] = useState(false);

  // Perhitungan kuota & slot tersisa realtime
  const totalTargetSD = settings?.quotaSD || COMPETITION.SD.TARGET_PLATOONS || 18;
  const totalTargetSMP = settings?.quotaSMP || COMPETITION.SMP.TARGET_PLATOONS || 18;
  const registeredSD = (teams || []).filter(t => t.jenjang === 'SD').length;
  const registeredSMP = (teams || []).filter(t => t.jenjang === 'SMP').length;
  const remainingSD = Math.max(0, totalTargetSD - registeredSD);
  const remainingSMP = Math.max(0, totalTargetSMP - registeredSMP);
  const totalRemaining = remainingSD + remainingSMP;

  const isQuotaFull = totalRemaining <= 0;
  const isRegOpenMaster = settings?.registrationOpen !== false;

  const eventDates = settings?.eventDates || {};
  const regRange = eventDates.registrationRangeText || EVENT.REGISTRATION_RANGE;
  const verifRange = eventDates.verificationRangeText || EVENT.VERIFICATION_RANGE;
  const tmDate = eventDates.technicalMeetingDate || EVENT.TECHNICAL_MEETING_DATE;
  const tmTime = eventDates.technicalMeetingTime || EVENT.TECHNICAL_MEETING_TIME;
  const trialDate = eventDates.fieldTrialDate || EVENT.FIELD_TRIAL_DATE;
  const trialTime = eventDates.fieldTrialTime || EVENT.FIELD_TRIAL_TIME_RANGE;
  const compDate = eventDates.competitionDate || EVENT.COMPETITION_DATE;
  const compTimeStart = EVENT.COMPETITION_TIME_START_LABEL;

  const isRegistrationAvailable = isRegOpenMaster && !isQuotaFull && canAccessRegistration;

  function triggerCopied() {
    setCopied(true);
    setTimeout(() => setCopied(false), CLIPBOARD.RESET_DELAY_MS);
  }

  function handleCopyAccount() {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(PAYMENT.ACCOUNT_NUMBER)
        .then(() => triggerCopied())
        .catch(() => fallbackCopy());
    } else {
      fallbackCopy();
    }
  }

  function fallbackCopy() {
    try {
      const el = document.createElement('textarea');
      el.value = PAYMENT.ACCOUNT_NUMBER;
      el.setAttribute('readonly', '');
      el.style.position = 'absolute';
      el.style.left = '-9999px';
      document.body.appendChild(el);
      el.select();
      const successful = document.execCommand('copy');
      document.body.removeChild(el);
      if (successful) {
        triggerCopied();
      } else {
        prompt('Silakan salin nomor rekening berikut:', PAYMENT.ACCOUNT_NUMBER);
      }
    } catch {
      prompt('Silakan salin nomor rekening berikut:', PAYMENT.ACCOUNT_NUMBER);
    }
  }

  return (
    <section id="registration" className="py-24 lg:py-32 bg-slate-950 relative overflow-hidden font-sans border-t border-slate-900 text-white">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-carbon-pattern opacity-15 pointer-events-none"></div>
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-red-600/10 rounded-full blur-[128px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-yellow-500/10 rounded-full blur-[128px] pointer-events-none"></div>

      <div className="container mx-auto px-6 relative z-10">
        
        {/* ========================================================
            SECTION HEADER
            ======================================================== */}
        <div className="mb-14 md:mb-16 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/[0.06] border border-white/10 text-slate-300 text-xs font-semibold uppercase tracking-wider mb-4">
            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
            <span>Juknis & Administrasi 2027</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight leading-tight py-1 text-white">
            Informasi{' '}
            <span className="inline-block text-amber-400">
              Pendaftaran
            </span>
          </h2>
          <div className="w-16 h-1 bg-red-700 mx-auto mt-4 rounded-full"></div>

          <p className="text-slate-300 text-sm sm:text-base mt-4 leading-relaxed font-normal max-w-2xl mx-auto">
            Prosedur resmi pengisian formulir, alokasi kuota peleton, rincian biaya, serta verifikasi berkas administrasi peserta.
          </p>
        </div>

        {/* ========================================================
            HERO URGENCY & QUOTA HUB (COUNTDOWN + LIVE SLOTS)
            ======================================================== */}
        <div className="max-w-6xl mx-auto mb-12 sm:mb-16">
          <div className="bg-gradient-to-b from-slate-900/95 via-slate-900/80 to-slate-950/95 border border-white/10 rounded-3xl shadow-2xl backdrop-blur-xl relative overflow-hidden">
            <div className="relative z-10 p-6 sm:p-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                
                {/* Left Column: Countdown Timer */}
                <div className="lg:col-span-5 flex flex-col justify-center items-center lg:border-r lg:border-white/10 lg:pr-8">
                  <CountdownTimer />
                </div>

                {/* Right Column: Slot Kuota Peleton */}
                <div className="lg:col-span-7 flex flex-col justify-center space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-white/10">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                      <Users className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>Informasi Slot Kuota Peleton</span>
                    </span>
                    <span className="text-xs font-black uppercase px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300">
                      Total Tersisa: {totalRemaining} / {totalTargetSD + totalTargetSMP} Peleton
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                    {/* Slot SD */}
                    <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-red-500/30 transition-all">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] font-extrabold uppercase tracking-wider text-red-400 block">
                          Tingkat SD / MI
                        </span>
                        <span className="text-[10px] font-semibold text-slate-400">
                          Kuota {totalTargetSD}
                        </span>
                      </div>
                      <div className="flex items-baseline justify-between">
                        <span className="text-sm font-bold text-slate-300">
                          Tersisa <strong className="text-xl font-black text-white ml-1">{remainingSD}</strong> Slot
                        </span>
                        <span className="text-[11px] font-medium text-slate-400">
                          Terisi: <span className="text-slate-200 font-bold">{registeredSD}</span>
                        </span>
                      </div>
                      {/* Mini Progress Bar */}
                      <div className="w-full bg-white/10 rounded-full h-1.5 mt-2.5 overflow-hidden">
                        <div
                          className="bg-red-500 h-1.5 rounded-full transition-all duration-500"
                          style={{ width: `${Math.min(100, (registeredSD / totalTargetSD) * 100)}%` }}
                        />
                      </div>
                    </div>

                    {/* Slot SMP */}
                    <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-blue-500/30 transition-all">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] font-extrabold uppercase tracking-wider text-blue-400 block">
                          Tingkat SMP / MTs
                        </span>
                        <span className="text-[10px] font-semibold text-slate-400">
                          Kuota {totalTargetSMP}
                        </span>
                      </div>
                      <div className="flex items-baseline justify-between">
                        <span className="text-sm font-bold text-slate-300">
                          Tersisa <strong className="text-xl font-black text-white ml-1">{remainingSMP}</strong> Slot
                        </span>
                        <span className="text-[11px] font-medium text-slate-400">
                          Terisi: <span className="text-slate-200 font-bold">{registeredSMP}</span>
                        </span>
                      </div>
                      {/* Mini Progress Bar */}
                      <div className="w-full bg-white/10 rounded-full h-1.5 mt-2.5 overflow-hidden">
                        <div
                          className="bg-blue-500 h-1.5 rounded-full transition-all duration-500"
                          style={{ width: `${Math.min(100, (registeredSMP / totalTargetSMP) * 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>        {/* ========================================================
            3 OVERVIEW CARDS (TIMELINE, KUOTA & PERSONEL, BIAYA)
            ======================================================== */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-16 lg:mb-20 items-stretch">
          
          {/* Card 1: Timeline Lini Masa */}
          <div className="group rounded-3xl bg-gradient-to-b from-slate-900/90 via-slate-900/80 to-slate-950/95 border border-white/10 hover:border-white/20 p-6 sm:p-7 shadow-xl backdrop-blur-xl flex flex-col justify-between transition-all duration-300 text-left">
            <div>
              {/* Header */}
              <div className="flex items-start justify-between gap-3 mb-6 pb-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/[0.06] border border-white/10 text-amber-400 flex items-center justify-center shrink-0">
                    <CalendarClock className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                      Agenda Pelaksanaan
                    </span>
                    <h3 className="font-bold text-lg text-white uppercase tracking-tight">
                      Lini Masa (Timeline)
                    </h3>
                  </div>
                </div>
                <span className="text-[10px] font-semibold uppercase tracking-wider bg-white/[0.04] text-slate-300 px-2.5 py-1 rounded-md border border-white/10 shrink-0 whitespace-nowrap">
                  5 Tahap
                </span>
              </div>

              {/* Steps */}
              <div className="space-y-3">
                {/* Step 1 */}
                <div className="p-3 rounded-xl bg-white/[0.04] border border-white/[0.08] transition-colors">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-[10px] font-semibold text-slate-300 uppercase tracking-wider">
                      {regRange}
                    </span>
                    <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded-md bg-sky-500/15 border border-sky-500/30 text-sky-300">
                      Tahap 1
                    </span>
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-white">Pendaftaran Daring</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">Unggah berkas via portal resmi s.d. 23.59 WIB.</p>
                </div>

                {/* Step 2 */}
                <div className="p-3 rounded-xl bg-white/[0.04] border border-white/[0.08] transition-colors">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-[10px] font-semibold text-slate-300 uppercase tracking-wider">
                      {verifRange}
                    </span>
                    <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded-md bg-amber-500/15 border border-amber-500/30 text-amber-300">
                      Tahap 2
                    </span>
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-white">Verifikasi Berkas</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">Pemeriksaan & kurasi kelengkapan oleh panitia.</p>
                </div>

                {/* Step 3 */}
                <div className="p-3 rounded-xl bg-white/[0.04] border border-white/[0.08] transition-colors">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-[10px] font-semibold text-slate-300 uppercase tracking-wider">
                      {tmDate}
                    </span>
                    <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded-md bg-purple-500/15 border border-purple-500/30 text-purple-300">
                      Tahap 3
                    </span>
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-white">Technical Meeting</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">Pengundian nomor urut & verifikasi fisik • {tmTime}</p>
                </div>

                {/* Step 4 */}
                <div className="p-3 rounded-xl bg-white/[0.04] border border-white/[0.08] transition-colors">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-[10px] font-semibold text-slate-300 uppercase tracking-wider">
                      {trialDate}
                    </span>
                    <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded-md bg-indigo-500/15 border border-indigo-500/30 text-indigo-300">
                      Tahap 4
                    </span>
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-white">Uji Coba Lapangan</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">Orientasi pos perlombaan peserta • {trialTime}</p>
                </div>

                {/* Step 5 */}
                <div className="p-3 rounded-xl bg-white/[0.06] border border-white/10 transition-colors">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                      {compDate}
                    </span>
                    <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded-md bg-red-700 text-white">
                      Hari H
                    </span>
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-white">Daftar Ulang & Pelaksanaan Lomba</h4>
                  <p className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">Pembukaan & kompetisi • {compTimeStart}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Kuota & Personel */}
          <div className="group rounded-3xl bg-gradient-to-b from-slate-900/90 via-slate-900/80 to-slate-950/95 border border-white/10 hover:border-white/20 p-6 sm:p-7 shadow-xl backdrop-blur-xl flex flex-col justify-between transition-all duration-300 text-left">
            <div>
              {/* Header */}
              <div className="flex items-start justify-between gap-2.5 mb-6 pb-4 border-b border-white/10">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-11 h-11 rounded-2xl bg-white/[0.06] border border-white/10 text-amber-400 flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition-transform">
                    <Users className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block truncate">
                      Regulasi Kontingen
                    </span>
                    <h3 className="font-black text-lg text-white uppercase tracking-tight">
                      Kuota & Personel
                    </h3>
                  </div>
                </div>
                <span className="text-[10px] font-black uppercase tracking-wider bg-white/[0.06] text-slate-200 px-2.5 py-1 rounded-lg border border-white/10 shrink-0 whitespace-nowrap">
                  Maks. 25
                </span>
              </div>

              <div className="space-y-4">
                {/* 1. Target Jenjang Peserta (SD/MI & SMP/MTs Sederajat) - UI Menonjol */}
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                    Jenjang Peserta Se-DIY
                  </span>
                  <div className="grid grid-cols-2 gap-2.5">
                    {/* SD / MI Card */}
                    <div className="rounded-xl bg-white/[0.04] border border-white/[0.08] p-3 text-left">
                      <div className="flex items-center gap-2 mb-1">
                        <School className="w-4 h-4 text-red-400 shrink-0" />
                        <span className="text-xs font-bold text-white">SD / MI</span>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        Sederajat Se-DIY
                      </p>
                    </div>

                    {/* SMP / MTs Card */}
                    <div className="rounded-xl bg-white/[0.04] border border-white/[0.08] p-3 text-left">
                      <div className="flex items-center gap-2 mb-1">
                        <GraduationCap className="w-4 h-4 text-blue-400 shrink-0" />
                        <span className="text-xs font-bold text-white">SMP / MTs</span>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        Sederajat Se-DIY
                      </p>
                    </div>
                  </div>
                </div>

                {/* 2. Kuota per Sekolah - Tersendiri */}
                <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-white/20 transition-colors">
                  <div className="flex items-center gap-2 mb-1">
                    <CheckCircle2 className="w-4 h-4 text-red-400 shrink-0" />
                    <span className="text-xs font-bold text-white uppercase tracking-wider">Kuota per Sekolah</span>
                  </div>
                  <p className="text-sm font-black text-white ml-6">
                    {COMPETITION.MAX_PLATOONS_PER_SCHOOL_LABEL}
                  </p>
                  <p className="text-[11px] text-slate-400 ml-6 mt-0.5 leading-relaxed">
                    Tiap sekolah dapat mengirimkan tim putra, putri, atau campuran.
                  </p>
                </div>

                {/* 2. Komposisi Personil */}
                <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5">
                  <div className="flex items-center justify-between mb-2.5">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-red-400 shrink-0" />
                      <span className="text-xs font-bold text-white uppercase tracking-wider">Komposisi Peleton</span>
                    </div>
                    <span className="text-[10px] font-bold text-slate-400">Maks 25 Orang</span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-white/[0.04] p-2.5 rounded-xl border border-white/5">
                      <UserCheck className="w-4 h-4 text-red-400 mx-auto mb-1" />
                      <span className="text-xs font-black text-white block">1 Danton</span>
                      <span className="text-[10px] text-slate-400">Komandan</span>
                    </div>

                    <div className="bg-white/[0.04] p-2.5 rounded-xl border border-white/5">
                      <Users className="w-4 h-4 text-red-400 mx-auto mb-1" />
                      <span className="text-xs font-black text-white block">21 Pasukan</span>
                      <span className="text-[10px] text-slate-400">Pasukan Inti</span>
                    </div>

                    <div className="bg-white/[0.04] p-2.5 rounded-xl border border-white/5">
                      <PlusCircle className="w-4 h-4 text-red-400 mx-auto mb-1" />
                      <span className="text-xs font-black text-white block">3 Cadangan</span>
                      <span className="text-[10px] text-slate-400">Pengganti</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-2.5 leading-relaxed">
                    * Minimal tampil di lapangan: 22 personil (1 Danton + 21 Pasukan).
                  </p>
                </div>

                {/* 3. Sifat Pasukan & Official */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Sifat Pasukan</span>
                    <span className="text-xs font-bold text-white mt-0.5 block">Homogen / Campuran</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Official Tim</span>
                    <span className="text-xs font-bold text-white mt-0.5 block">1 Official + 2 Pendukung</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Biaya Pendaftaran & Rekening */}
          <div className="group rounded-2xl bg-slate-900/90 border border-white/[0.08] hover:border-white/15 p-6 sm:p-7 shadow-lg flex flex-col justify-between transition-all duration-200 relative text-left">
            <div>
              {/* Header */}
              <div className="flex items-start justify-between gap-2.5 mb-6 pb-4 border-b border-white/10">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-white/[0.06] border border-white/10 text-amber-400 flex items-center justify-center shrink-0">
                    <Wallet className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block truncate">
                      Biaya & Pembayaran
                    </span>
                    <h3 className="font-bold text-lg text-white uppercase tracking-tight">
                      Biaya Pendaftaran
                    </h3>
                  </div>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-white/[0.06] text-amber-300 px-2.5 py-1 rounded-md border border-white/10 shrink-0 whitespace-nowrap">
                  Non-Refundable
                </span>
              </div>

              {/* Fee Tiers */}
              {PAYMENT.FEE_TIERS && (
                <div className="space-y-2.5 mb-5">
                  {PAYMENT.FEE_TIERS.map((tier, idx) => {
                    const now = Date.now();
                    const end = tier.endDate ? new Date(tier.endDate).getTime() : 0;
                    const isPast = end > 0 && now > end;
                    const tier1End = PAYMENT.FEE_TIERS[0].endDate ? new Date(PAYMENT.FEE_TIERS[0].endDate).getTime() : 0;
                    const isActive = idx === 0 ? !isPast : (now > tier1End && !isPast);

                    return (
                      <div
                        key={idx}
                        className={`p-3.5 rounded-2xl border transition-all ${
                          isActive
                            ? 'bg-amber-500/10 border-amber-500/40 shadow-sm'
                            : isPast
                            ? 'bg-white/[0.02] border-white/5 opacity-60'
                            : 'bg-white/[0.03] border-white/5'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-0.5">
                              <span className="text-xs sm:text-sm font-black text-white block">
                                {tier.name}
                              </span>
                              {isActive && (
                                <span className="text-[9px] font-black uppercase tracking-wider bg-red-600 text-white px-2 py-0.5 rounded-full">
                                  Aktif
                                </span>
                              )}
                              {isPast && (
                                <span className="text-[9px] font-bold uppercase tracking-wider bg-white/10 text-slate-400 px-1.5 py-0.5 rounded">
                                  Berakhir
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-slate-400 block">
                              {tier.label} • Non-refundable
                            </span>
                          </div>
                          <div className="text-right shrink-0">
                            <span className={`text-base sm:text-lg font-black block font-mono ${isActive ? 'text-amber-400' : 'text-white'}`}>
                              Rp{tier.amountWithCode || tier.amount}
                            </span>
                            <span className="text-[10px] text-slate-400 block">
                              / peleton
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Catatan Kode Unik 108 - Ringkas & Padat */}
              <div className="mb-4 p-3 rounded-2xl bg-amber-500/10 border border-amber-400/30 flex items-center gap-2.5 text-xs text-slate-300">
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                <p className="text-[11px] leading-relaxed">
                  Nominal sudah termasuk <strong className="text-amber-300 font-bold">kode unik 108</strong> untuk verifikasi sistem otomatis.
                </p>
              </div>

              {/* Bank Account Box */}
              <div className="bg-white/[0.03] rounded-2xl p-4 border border-white/10 relative">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-white/10">
                  <div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">
                      Rekening Tujuan Transfer
                    </span>
                  </div>
                  <img 
                    src="/Bank_Syariah_Indonesia_white.svg" 
                    alt="Bank Syariah Indonesia" 
                    className="h-9 sm:h-10 w-auto object-contain filter drop-shadow-[0_2px_12px_rgba(255,255,255,0.25)] self-start sm:self-auto"
                  />
                </div>

                <div className="flex items-center justify-between gap-2 bg-slate-950 border border-white/10 p-3 rounded-xl mb-2.5">
                  <span className="font-mono text-base sm:text-lg font-black text-white tracking-wider truncate">
                    {PAYMENT.ACCOUNT_NUMBER}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyAccount}
                    className={`p-2 rounded-lg transition-all cursor-pointer ${
                      copied
                        ? 'bg-emerald-500 text-white'
                        : 'text-slate-400 hover:text-white hover:bg-white/10'
                    }`}
                    aria-label="Salin nomor rekening"
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>

                <div className="space-y-1 text-xs text-slate-300">
                  <p>A.n: <strong className="text-white">{PAYMENT.ACCOUNT_NAME}</strong></p>
                  <p>Berita: <span className="text-amber-400 font-mono font-bold">{PAYMENT.TRANSFER_NOTE_FORMAT}</span></p>
                </div>

                {copied && (
                  <div className="mt-2 text-center">
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/20 border border-emerald-500/30 px-3 py-1 rounded-full inline-flex items-center gap-1">
                      <Check className="w-3 h-3" /> Nomor Rekening Berhasil Disalin!
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-white/10 text-[11px] text-slate-400">
              Unggah bukti transfer resmi saat mengisi formulir digital di portal.
            </div>
          </div>

        </div>

        {/* ========================================================
            PROSEDUR PENDAFTARAN (5 TAHAPAN PRAKTIS)
            ======================================================== */}
        <div className="rounded-2xl bg-slate-900/90 border border-white/[0.08] p-6 sm:p-10 shadow-lg relative overflow-hidden mb-16 lg:mb-20">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-amber-400 font-semibold uppercase tracking-wider text-xs block mb-2">
              Alur Pendaftaran Peleton
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-white">
              Prosedur <span className="text-amber-400">Pendaftaran</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed font-normal">
              Ikuti 5 tahapan praktis berikut untuk mendaftarkan peleton sekolah Anda hingga status terverifikasi resmi.
            </p>
          </div>

          {/* 5 Step Process Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            
            {/* Step 1 */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 hover:border-amber-500/30 transition-all text-left flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/25 flex items-center justify-center font-black text-xs">
                    01
                  </span>
                  <MonitorSmartphone className="w-4 h-4 text-slate-400" />
                </div>
                <h4 className="font-black text-white text-xs sm:text-sm mb-1 uppercase tracking-tight">
                  Akses Formulir
                </h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Buka portal resmi dan klik tombol <strong className="text-white">"Daftar Peleton"</strong> untuk membuka formulir wizard digital.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 hover:border-blue-500/30 transition-all text-left flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/25 flex items-center justify-center font-black text-xs">
                    02
                  </span>
                  <School className="w-4 h-4 text-slate-400" />
                </div>
                <h4 className="font-black text-white text-xs sm:text-sm mb-1 uppercase tracking-tight">
                  Sekolah & Akun
                </h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Pilih jenjang (SD/SMP), masukkan email Google aktif, data sekolah, unggah logo, dan pilih tipe peleton.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 hover:border-emerald-500/30 transition-all text-left flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 flex items-center justify-center font-black text-xs">
                    03
                  </span>
                  <UserCheck className="w-4 h-4 text-slate-400" />
                </div>
                <h4 className="font-black text-white text-xs sm:text-sm mb-1 uppercase tracking-tight">
                  Danton & Official
                </h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Lengkapi identitas Danton & Kartu Pelajar, nama Official/Pelatih, dan No. WhatsApp aktif.
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 hover:border-purple-500/30 transition-all text-left flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/25 flex items-center justify-center font-black text-xs">
                    04
                  </span>
                  <CreditCard className="w-4 h-4 text-slate-400" />
                </div>
                <h4 className="font-black text-white text-xs sm:text-sm mb-1 uppercase tracking-tight">
                  Bayar & Pakta
                </h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Unggah bukti transfer pembayaran dan bubuhkan tanda tangan digital Pakta Integritas Online di kanvas resmi.
                </p>
              </div>
            </div>

            {/* Step 5 */}
            <div className="p-4 sm:p-5 rounded-2xl bg-red-950/40 hover:bg-red-950/60 border border-red-500/30 transition-all text-left flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="w-8 h-8 rounded-xl bg-red-600 text-white flex items-center justify-center font-black text-xs shadow-sm">
                    05
                  </span>
                  <ShieldCheck className="w-4 h-4 text-red-400" />
                </div>
                <h4 className="font-black text-white text-xs sm:text-sm mb-1 uppercase tracking-tight">
                  Konfirmasi & Aktivasi
                </h4>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Tim menerima Kode Registrasi unik resmi. Panitia memverifikasi dalam 1×24 jam. Setelah diverifikasi, tim dapat login ke <strong>Dashboard Peserta</strong> untuk melengkapi susunan identitas peleton.
                </p>
              </div>
            </div>

          </div>

          {/* CTA Banner */}
          <div className="rounded-2xl bg-white/[0.03] border border-white/10 p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-5 text-left">
            <div>
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest block mb-1">
                Portal Registrasi Resmi LBB 2027
              </span>
              <h4 className="text-base sm:text-lg font-black text-white">
                Siap Mendaftarkan Peleton Terbaik Sekolah Anda?
              </h4>
              <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                Akses formulir digital sekarang dan amankan kuota sebelum pendaftaran ditutup.
              </p>
            </div>

            {isRegistrationAvailable ? (
              <button
                type="button"
                onClick={() => openModal('regWizard')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-red-700 hover:bg-red-600 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-sm shrink-0 cursor-pointer"
              >
                <span>Buka Formulir Pendaftaran</span>
                <ExternalLink className="w-4 h-4" />
              </button>
            ) : !canAccessRegistration ? (
              <button
                type="button"
                onClick={() => openModal('regWizard')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider transition-all shadow-sm shrink-0 cursor-pointer"
              >
                <Clock className="w-4 h-4 text-slate-950" />
                <span>Dibuka 26 Okt 2026 (00.00 WIB)</span>
              </button>
            ) : (
              <div className="w-full sm:w-auto px-5 py-3 rounded-xl bg-white/5 border border-white/10 text-slate-400 font-bold text-xs uppercase tracking-wider text-center shrink-0">
                {isQuotaFull ? 'Pendaftaran Ditutup (Kuota Penuh)' : 'Pendaftaran Sedang Ditutup'}
              </div>
            )}
          </div>
        </div>

        {/* ========================================================
            DOKUMEN UNGGAHAN & PUSAT INFORMASI
            ======================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Kolom Kiri: Dokumen Unggahan (7 Kolom) */}
          <div className="lg:col-span-7 rounded-3xl bg-gradient-to-b from-slate-900/90 via-slate-900/80 to-slate-950/95 border border-white/10 p-6 sm:p-7 shadow-xl backdrop-blur-xl flex flex-col justify-between text-left">
            <div>
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
                <div className="w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-500/30 text-blue-400 flex items-center justify-center shrink-0">
                  <FileUp className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-black text-white uppercase tracking-tight text-base sm:text-lg">
                    Dokumen Unggahan (Wajib)
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Berkas digital yang wajib diunggah saat pendaftaran daring di portal.
                  </p>
                </div>
              </div>

              {/* Grid 5 Document Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                
                {/* Doc 1 */}
                <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-blue-500/30 transition-all flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <FileSignature className="w-4 h-4 text-blue-400" />
                      <span className="text-[9px] font-black uppercase tracking-wider text-blue-300 bg-blue-500/15 border border-blue-500/30 px-2 py-0.5 rounded">
                        PDF / JPG
                      </span>
                    </div>
                    <h5 className="font-black text-white text-xs mb-1">Surat Rekomendasi</h5>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Dari Kepala Sekolah / Madrasah asli dengan tanda tangan & stempel basah.
                    </p>
                  </div>
                  <span className="text-[10px] text-slate-500 mt-2 block">Maks. 2 MB</span>
                </div>

                {/* Doc 2 */}
                <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-emerald-500/30 transition-all flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <ImageIcon className="w-4 h-4 text-emerald-400" />
                      <span className="text-[9px] font-black uppercase tracking-wider text-emerald-300 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded">
                        JPG / PNG
                      </span>
                    </div>
                    <h5 className="font-black text-white text-xs mb-1">Bukti Transfer Biaya</h5>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Foto/Scan struk atau screenshot m-banking jelas dengan nominal sesuai gelombang.
                    </p>
                  </div>
                  <span className="text-[10px] text-slate-500 mt-2 block">Maks. 2 MB</span>
                </div>

                {/* Doc 3 */}
                <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-red-500/30 transition-all flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <CreditCard className="w-4 h-4 text-red-400" />
                      <span className="text-[9px] font-black uppercase tracking-wider text-red-300 bg-red-500/15 border border-red-500/30 px-2 py-0.5 rounded">
                        Foto / PDF
                      </span>
                    </div>
                    <h5 className="font-black text-white text-xs mb-1">Kartu Pelajar Komandan</h5>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Scan/Foto Kartu Pelajar sah Komandan Peleton (Danton) pangkalan bersangkutan.
                    </p>
                  </div>
                  <span className="text-[10px] text-slate-500 mt-2 block">Maks. 3 MB</span>
                </div>

                {/* Doc 4 */}
                <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-purple-500/30 transition-all flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <School className="w-4 h-4 text-purple-400" />
                      <span className="text-[9px] font-black uppercase tracking-wider text-purple-300 bg-purple-500/15 border border-purple-500/30 px-2 py-0.5 rounded">
                        PNG Transparan
                      </span>
                    </div>
                    <h5 className="font-black text-white text-xs mb-1">Logo Sekolah</h5>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Format PNG transparan resolusi tinggi (tidak pecah) untuk piagam & backdrop.
                    </p>
                  </div>
                  <span className="text-[10px] text-slate-500 mt-2 block">HD Resolution</span>
                </div>

                {/* Doc 5 */}
                <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-blue-500/30 transition-all flex flex-col justify-between sm:col-span-2">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Users className="w-4 h-4 text-blue-400" />
                      <span className="text-[9px] font-black uppercase tracking-wider text-blue-300 bg-blue-500/15 border border-blue-500/30 px-2 py-0.5 rounded">
                        Foto 3×4
                      </span>
                    </div>
                    <h5 className="font-black text-white text-xs mb-1">Pasfoto Personel</h5>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Latar <span className="text-red-400 font-bold">Merah (SD)</span> atau <span className="text-blue-400 font-bold">Biru (SMP)</span>. Diunggah per nama di menu portal peserta.
                    </p>
                  </div>
                  <span className="text-[10px] text-slate-500 mt-2 block">Diinput di Menu Personel</span>
                </div>

              </div>


            </div>
          </div>

          {/* Kolom Kanan: Sanksi & Pusat Informasi (5 Kolom) */}
          <div className="lg:col-span-5 flex flex-col gap-5 text-left">
            
            {/* Sanksi & Pembatalan Card */}
            <div className="rounded-3xl bg-red-950/40 border border-red-500/30 p-5 sm:p-6 shadow-xl backdrop-blur-xl">
              <div className="flex items-center gap-2 mb-3 text-red-400">
                <AlertOctagon className="w-5 h-5 shrink-0" />
                <h4 className="font-black uppercase text-xs sm:text-sm tracking-tight text-white">
                  Sanksi & Ketentuan Pembatalan
                </h4>
              </div>
              <ul className="space-y-2.5 text-xs text-slate-300 leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0 mt-1.5"></span>
                  <span><strong className="text-white">Diskualifikasi Mutlak:</strong> Jika terbukti pemalsuan berkas, identitas, atau status keaktifan siswa.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0 mt-1.5"></span>
                  <span><strong className="text-white">Non-Refundable:</strong> Biaya registrasi yang telah disetor tidak dapat ditarik kembali bila tim mundur.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0 mt-1.5"></span>
                  <span><strong className="text-white">Perubahan Data Personel:</strong> Diperbolehkan sampai sebelum Technical Meeting (TM), wajib dilaporkan dan disesuaikan dengan Surat Tugas/Rekomendasi resmi Kepala Sekolah.</span>
                </li>
              </ul>
            </div>

            {/* Pusat Informasi Resmi Card */}
            <div className="rounded-3xl bg-gradient-to-b from-slate-900/90 via-slate-900/80 to-slate-950/95 border border-white/10 p-5 sm:p-6 shadow-xl backdrop-blur-xl">
              <div className="flex items-center justify-between mb-3 pb-3 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-400 flex items-center justify-center shrink-0">
                    <Headset className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-black uppercase text-xs sm:text-sm tracking-tight text-white">
                      Pusat Informasi Resmi
                    </h4>
                    <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
                      4 Kanal Resmi Panitia
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-400 mb-3 leading-relaxed">
                Seluruh pengumuman resmi dan koordinasi hanya dilayani melalui kanal berikut:
              </p>

              <div className="space-y-2 text-xs">
                {/* WhatsApp */}
                {CONTACT.PERSONS.map((person, idx) => (
                  <a
                    key={idx}
                    href={person.WA_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 hover:border-white/20 transition-all group"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-white/10 text-emerald-400 flex items-center justify-center shrink-0">
                        <Phone className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">WhatsApp Resmi ({person.SHORT_NAME})</span>
                        <span className="font-bold text-white group-hover:text-amber-400">{person.PHONE_DISPLAY}</span>
                      </div>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-400 transition-transform" />
                  </a>
                ))}

                {/* Email */}
                <a
                  href={CONTACT.EMAIL_HREF}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 hover:border-white/20 transition-all group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-white/10 text-slate-300 flex items-center justify-center shrink-0">
                      <Globe className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Email Panitia</span>
                      <span className="font-bold text-white group-hover:text-amber-400">{CONTACT.EMAIL}</span>
                    </div>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-400 transition-transform" />
                </a>

                {/* Socials */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  {/* Instagram Button */}
                  <a
                    href={SOCIAL.INSTAGRAM_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 hover:border-pink-500/40 transition-all group"
                  >
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                      <Instagram className="w-3.5 h-3.5" />
                    </div>
                    <div className="truncate">
                      <span className="text-[9px] text-pink-400 block font-medium">Instagram</span>
                      <span className="font-bold text-slate-200 group-hover:text-white truncate block text-[11px]">
                        {SOCIAL.INSTAGRAM_HANDLE}
                      </span>
                    </div>
                  </a>

                  {/* TikTok Button */}
                  <a
                    href={SOCIAL.TIKTOK_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 hover:border-cyan-500/40 transition-all group"
                  >
                    <div className="w-7 h-7 rounded-lg bg-slate-900 border border-slate-700 text-cyan-400 flex items-center justify-center shrink-0 shadow-xs">
                      <Video className="w-3.5 h-3.5 text-cyan-400" />
                    </div>
                    <div className="truncate">
                      <span className="text-[9px] text-cyan-400 block font-medium">TikTok</span>
                      <span className="font-bold text-slate-200 group-hover:text-white truncate block text-[11px]">
                        {SOCIAL.TIKTOK_HANDLE}
                      </span>
                    </div>
                  </a>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
