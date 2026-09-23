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
  School
} from 'lucide-react';
import { EVENT, COMPETITION, PAYMENT, REGISTRATION, CONTACT, SOCIAL, CLIPBOARD } from '../config.js';
import { useCompetition } from '../context/CompetitionContext.jsx';
import CountdownTimer from './CountdownTimer.jsx';

export default function Registration() {
  const { openModal, setActiveView, teams, settings } = useCompetition();
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

  const isRegistrationAvailable = isRegOpenMaster && !isQuotaFull;

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
    <section id="registration" className="pt-6 sm:pt-8 pb-16 lg:pb-24 bg-slate-50 relative overflow-hidden font-sans">
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'linear-gradient(#8B0000 1px, transparent 1px), linear-gradient(to right, #8B0000 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      ></div>
      <div className="absolute left-0 top-1/4 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute right-0 bottom-1/4 w-96 h-96 bg-red-900/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="mb-6 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-red-50 border border-red-100 text-red-700 text-[10px] font-bold uppercase tracking-[0.15em] mb-2 shadow-sm cursor-default hover:bg-red-100 transition-colors">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
            </span>
            Juknis Resmi 2027
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 uppercase italic tracking-tighter mb-2 leading-tight py-0.5">
            Informasi{' '}
            <span className="relative inline-block pr-3 sm:pr-4 pb-1">
              <span className="relative z-10 inline-block pr-2 text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-800">
                Pendaftaran
              </span>
              <svg
                className="absolute w-[105%] h-2.5 -bottom-0.5 -left-[2%] text-yellow-500 z-0 opacity-90"
                viewBox="0 0 100 10"
                preserveAspectRatio="none"
              >
                <path d="M0 5 Q 50 12 100 5" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" />
              </svg>
            </span>
          </h2>

          <p className="text-slate-500 text-sm md:text-base font-medium leading-relaxed max-w-2xl mx-auto">
            Pedoman resmi tata cara pendaftaran LBB Mu’allimin 2027.
            <span className="mx-2 hidden sm:inline">•</span>
            <span className="inline-flex items-center gap-1.5 mt-1 sm:mt-0 text-red-700 font-bold bg-red-50 px-2.5 py-0.5 rounded-md border border-red-100/50 text-xs">
              <AlertCircle className="w-3.5 h-3.5 stroke-[2.5]" />
              Sistem First Come, First Served
            </span>
          </p>
        </div>

        {/* Hero Urgency & Info Hub (Maximized Width & Space-Efficient) */}
        <div className="max-w-6xl mx-auto mb-10">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl shadow-slate-950/25 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-red-700/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="relative z-10 p-5 sm:p-7">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
                {/* Left Column: Countdown Timer */}
                <div className="lg:col-span-5 flex flex-col justify-center items-center lg:border-r lg:border-slate-800/80 lg:pr-6">
                  <CountdownTimer />
                </div>

                {/* Right Column: Slot Kuota Peleton */}
                <div className="lg:col-span-7 flex flex-col justify-center space-y-3.5">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/60 pb-2.5">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                      <Users className="w-4 h-4 text-yellow-400 shrink-0" />
                      <span>Informasi Slot Kuota Peleton</span>
                    </span>
                    <span className="text-[11px] font-black uppercase px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-400">
                      Total Tersisa: {totalRemaining} / {totalTargetSD + totalTargetSMP} Peleton
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
                    {/* Slot SD */}
                    <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800/80 flex items-center justify-between hover:border-slate-700 transition-colors">
                      <div>
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-0.5">
                          Tingkat SD / MI
                        </span>
                        <span className="text-sm font-black text-white">
                          Tersisa <span className="text-yellow-400 font-mono text-lg">{remainingSD}</span> Slot
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-[11px] text-slate-400 block font-medium">Kuota: {totalTargetSD}</span>
                        <span className="text-[10px] font-bold text-slate-500">Terisi: {registeredSD}</span>
                      </div>
                    </div>

                    {/* Slot SMP */}
                    <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800/80 flex items-center justify-between hover:border-slate-700 transition-colors">
                      <div>
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-0.5">
                          Tingkat SMP / MTs
                        </span>
                        <span className="text-sm font-black text-white">
                          Tersisa <span className="text-yellow-400 font-mono text-lg">{remainingSMP}</span> Slot
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-[11px] text-slate-400 block font-medium">Kuota: {totalTargetSMP}</span>
                        <span className="text-[10px] font-bold text-slate-500">Terisi: {registeredSMP}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Integrated Space-Efficient Notice Bar */}
            <div className="bg-slate-950/80 border-t border-slate-800/80 px-5 sm:px-7 py-3 flex flex-col sm:flex-row items-center gap-3 text-left">
              <div className="flex items-center gap-2 text-amber-400 shrink-0">
                <MonitorSmartphone className="w-4 h-4" />
                <span className="text-[11px] font-black uppercase tracking-wider">Pendaftaran 100% Online:</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Pendaftaran akun dan unggah berkas dilakukan daring melalui portal. Berkas fisik asli (Formulir A, B, C berstempel resmi) wajib diserahkan saat <strong>Technical Meeting</strong> untuk verifikasi faktual.
              </p>
            </div>
          </div>
        </div>

        {/* 3 Overview Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20 items-stretch">
          {/* Timeline Card */}
          <div className="group bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-lg hover:shadow-2xl hover:border-slate-300 transition-all duration-300 flex flex-col justify-between relative overflow-hidden text-left">
            <div className="absolute top-0 right-0 w-36 h-36 bg-amber-100/40 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none group-hover:scale-125 transition-transform duration-500"></div>

            <div className="relative z-10">
              {/* Card Header */}
              <div className="flex items-start justify-between gap-3 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-slate-900 text-yellow-400 flex items-center justify-center shadow-md shadow-slate-900/15 group-hover:scale-105 transition-transform">
                    <CalendarClock className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider block">
                      Agenda Pelaksanaan
                    </span>
                    <h3 className="font-black text-xl text-slate-900 uppercase italic tracking-tight">
                      Lini Masa (Timeline)
                    </h3>
                  </div>
                </div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg border border-slate-200">
                  5 Tahap
                </span>
              </div>

              {/* Timeline Steps */}
              <div className="relative pl-6 border-l-2 border-slate-200 space-y-3.5 my-2">
                {/* Step 1: Pendaftaran Daring */}
                <div className="relative">
                  <div className="absolute -left-[31px] top-1.5 w-3.5 h-3.5 rounded-full bg-amber-500 border-2 border-white shadow-sm ring-2 ring-amber-500/20"></div>
                  <div className="bg-slate-50/80 hover:bg-amber-50/50 p-2.5 rounded-xl border border-slate-100 transition-colors">
                    <div className="flex items-center justify-between gap-2 mb-0.5">
                      <span className="text-[10px] font-extrabold text-amber-700 uppercase tracking-wider">
                        {regRange}
                      </span>
                      <span className="text-[9px] font-bold bg-amber-100/80 text-amber-800 px-1.5 py-0.5 rounded">
                        Tahap 1
                      </span>
                    </div>
                    <p className="text-sm font-black text-slate-900 leading-tight">Pendaftaran Daring</p>
                    <p className="text-xs text-slate-500 mt-0.5">Unggah berkas via portal resmi s.d. 23.59 WIB (atau tutup jika kuota penuh)</p>
                  </div>
                </div>

                {/* Step 2: Verifikasi Berkas */}
                <div className="relative">
                  <div className="absolute -left-[31px] top-1.5 w-3.5 h-3.5 rounded-full bg-blue-500 border-2 border-white shadow-sm ring-2 ring-blue-500/20"></div>
                  <div className="bg-slate-50/80 hover:bg-blue-50/50 p-2.5 rounded-xl border border-slate-100 transition-colors">
                    <div className="flex items-center justify-between gap-2 mb-0.5">
                      <span className="text-[10px] font-extrabold text-blue-700 uppercase tracking-wider">
                        {verifRange}
                      </span>
                      <span className="text-[9px] font-bold bg-blue-100/80 text-blue-800 px-1.5 py-0.5 rounded">
                        Tahap 2
                      </span>
                    </div>
                    <p className="text-sm font-black text-slate-900 leading-tight">Verifikasi Berkas</p>
                    <p className="text-xs text-slate-500 mt-0.5">Pemeriksaan & kurasi kelengkapan oleh panitia</p>
                  </div>
                </div>

                {/* Step 3: Technical Meeting */}
                <div className="relative">
                  <div className="absolute -left-[31px] top-1.5 w-3.5 h-3.5 rounded-full bg-purple-500 border-2 border-white shadow-sm ring-2 ring-purple-500/20"></div>
                  <div className="bg-slate-50/80 hover:bg-purple-50/50 p-2.5 rounded-xl border border-slate-100 transition-colors">
                    <div className="flex items-center justify-between gap-2 mb-0.5">
                      <span className="text-[10px] font-extrabold text-purple-700 uppercase tracking-wider">
                        {tmDate}
                      </span>
                      <span className="text-[9px] font-bold bg-purple-100/80 text-purple-800 px-1.5 py-0.5 rounded">
                        Tahap 3
                      </span>
                    </div>
                    <p className="text-sm font-black text-slate-900 leading-tight">Technical Meeting</p>
                    <p className="text-xs text-slate-500 mt-0.5">Pengundian nomor urut & verifikasi fisik • {tmTime}</p>
                  </div>
                </div>

                {/* Step 4: Uji Coba Lapangan */}
                <div className="relative">
                  <div className="absolute -left-[31px] top-1.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white shadow-sm ring-2 ring-emerald-500/20"></div>
                  <div className="bg-slate-50/80 hover:bg-emerald-50/50 p-2.5 rounded-xl border border-slate-100 transition-colors">
                    <div className="flex items-center justify-between gap-2 mb-0.5">
                      <span className="text-[10px] font-extrabold text-emerald-700 uppercase tracking-wider">
                        {trialDate}
                      </span>
                      <span className="text-[9px] font-bold bg-emerald-100/80 text-emerald-800 px-1.5 py-0.5 rounded">
                        Tahap 4
                      </span>
                    </div>
                    <p className="text-sm font-black text-slate-900 leading-tight">Uji Coba Lapangan</p>
                    <p className="text-xs text-slate-500 mt-0.5">Orientasi pos perlombaan peserta • {trialTime}</p>
                  </div>
                </div>

                {/* Step 5: Hari H */}
                <div className="relative">
                  <div className="absolute -left-[31px] top-1.5 w-3.5 h-3.5 rounded-full bg-red-600 border-2 border-white shadow-sm ring-2 ring-red-600/30 animate-pulse"></div>
                  <div className="bg-red-50/70 hover:bg-red-50 p-2.5 rounded-xl border border-red-200/70 transition-colors">
                    <div className="flex items-center justify-between gap-2 mb-0.5">
                      <span className="text-[10px] font-black text-red-700 uppercase tracking-wider">
                        {compDate}
                      </span>
                      <span className="text-[9px] font-black bg-red-600 text-white px-1.5 py-0.5 rounded animate-pulse">
                        Hari H
                      </span>
                    </div>
                    <p className="text-sm font-black text-slate-900 leading-tight">Daftar Ulang & Pelaksanaan Lomba</p>
                    <p className="text-xs text-slate-600 mt-0.5">Pembukaan & kompetisi • {compTimeStart}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Footer Info */}
            <div className="relative z-10 mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span className="inline-flex items-center gap-1.5 font-semibold text-slate-700">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                Zona Waktu WIB
              </span>
              <span className="font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                Jadwal Resmi
              </span>
            </div>
          </div>

          {/* Quota & Personnel Card */}
          <div className="group bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-lg hover:shadow-2xl hover:border-red-500/30 transition-all duration-300 flex flex-col justify-between relative overflow-hidden text-left">
            <div className="absolute top-0 right-0 w-36 h-36 bg-red-100/40 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none group-hover:scale-125 transition-transform duration-500"></div>

            <div className="relative z-10">
              {/* Card Header */}
              <div className="flex items-start justify-between gap-3 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-red-700 text-white flex items-center justify-center shadow-md shadow-red-700/25 group-hover:scale-105 transition-transform">
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-red-700 uppercase tracking-wider block">
                      Regulasi Kontingen
                    </span>
                    <h3 className="font-black text-xl text-slate-900 uppercase italic tracking-tight">
                      Kuota & Personel
                    </h3>
                  </div>
                </div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider bg-red-50 text-red-700 px-2.5 py-1 rounded-lg border border-red-100">
                  Maks. 25
                </span>
              </div>

              <div className="space-y-3.5 my-2">
                {/* 1. Kuota Sekolah */}
                <div className="bg-slate-50/80 p-3 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-2 mb-1">
                    <CheckCircle2 className="w-4 h-4 text-red-600 shrink-0" />
                    <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">Kuota per Sekolah</span>
                  </div>
                  <p className="text-sm font-black text-slate-800 ml-6">
                    {COMPETITION.MAX_PLATOONS_PER_SCHOOL_LABEL}
                  </p>
                  <p className="text-xs text-slate-500 ml-6 mt-0.5">
                    Tiap sekolah dapat mengirimkan tim putra, putri, atau campuran.
                  </p>
                </div>

                {/* 2. Komposisi Personil (Micro-cards grid) */}
                <div className="bg-slate-50/80 p-3 rounded-2xl border border-slate-100">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-red-600 shrink-0" />
                      <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">Komposisi Peleton</span>
                    </div>
                    <span className="text-[10px] font-bold text-slate-500">Max 25 Orang</span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 ml-1 text-center">
                    <div className="bg-white p-2 rounded-xl border border-slate-200/80 shadow-xs">
                      <div className="w-7 h-7 rounded-lg bg-red-100 text-red-700 flex items-center justify-center mx-auto mb-1">
                        <UserCheck className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-xs font-black text-slate-900 block">1 Danton</span>
                      <span className="text-[10px] text-slate-500">Komandan</span>
                    </div>

                    <div className="bg-white p-2 rounded-xl border border-slate-200/80 shadow-xs">
                      <div className="w-7 h-7 rounded-lg bg-red-100 text-red-700 flex items-center justify-center mx-auto mb-1">
                        <Users className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-xs font-black text-slate-900 block">21 Pasukan</span>
                      <span className="text-[10px] text-slate-500">Pasukan Inti</span>
                    </div>

                    <div className="bg-white p-2 rounded-xl border border-slate-200/80 shadow-xs">
                      <div className="w-7 h-7 rounded-lg bg-red-100 text-red-700 flex items-center justify-center mx-auto mb-1">
                        <PlusCircle className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-xs font-black text-slate-900 block">3 Cadangan</span>
                      <span className="text-[10px] text-slate-500">Pengganti</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-500 ml-1 mt-2">
                    * Minimal tampil di lapangan: 22 personil (1 Danton + 21 Pasukan).
                  </p>
                </div>

                {/* 3. Sifat Pasukan & Official */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-slate-50/80 p-2.5 rounded-xl border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Sifat Pasukan</span>
                    <span className="text-xs font-bold text-slate-800 mt-0.5 block">Homogen / Campuran</span>
                  </div>
                  <div className="bg-slate-50/80 p-2.5 rounded-xl border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Official Tim</span>
                    <span className="text-xs font-bold text-slate-800 mt-0.5 block">2 Pelatih + 1 Dok.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Footer Info */}
            <div className="relative z-10 mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span className="inline-flex items-center gap-1.5 font-semibold text-slate-700">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Standar Juknis Resmi
              </span>
              <span className="font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded text-[11px]">
                Validasi Faktual
              </span>
            </div>
          </div>

          {/* Payment Card */}
          <div className="group bg-white p-6 sm:p-8 rounded-[28px] border-2 border-yellow-400 shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col justify-between relative overflow-hidden z-10 md:-mt-2 md:mb-2 text-left">
            {/* Top Right Pill Badge: NON-REFUNDABLE */}
            <div className="absolute top-0 right-0 bg-[#f59e0b] text-slate-950 text-[11px] font-black px-5 py-1.5 rounded-bl-2xl uppercase tracking-wider shadow-sm select-none">
              NON-REFUNDABLE
            </div>

            <div className="relative z-10">
              {/* Card Header */}
              <div className="flex items-center gap-3.5 mb-6">
                <div className="w-13 h-13 rounded-2xl bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center shadow-md shadow-amber-500/10 shrink-0">
                  <Wallet className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[11px] font-extrabold text-amber-700 uppercase tracking-widest block">
                    INVESTASI TIM
                  </span>
                  <h3 className="font-black text-2xl text-slate-900 uppercase italic tracking-tight">
                    BIAYA PENDAFTARAN
                  </h3>
                </div>
              </div>

              {PAYMENT.FEE_TIERS ? (
                <div className="space-y-3 mb-5">
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
                            ? 'bg-rose-50/70 border-rose-300 ring-1 ring-rose-300/80 shadow-xs'
                            : isPast
                            ? 'bg-slate-100/60 border-slate-200 opacity-60'
                            : 'bg-slate-50/80 border-slate-200'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm font-black text-slate-900 block tracking-tight">
                                {tier.name}
                              </span>
                              {isActive && (
                                <span className="text-[10px] font-black uppercase tracking-wider bg-[#dc2626] text-white px-2 py-0.5 rounded-md">
                                  AKTIF
                                </span>
                              )}
                              {isPast && (
                                <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-200 text-slate-500 px-1.5 py-0.5 rounded">
                                  Berakhir
                                </span>
                              )}
                            </div>
                            <span className="text-xs text-slate-500 block font-medium">
                              {tier.label} • Non-refundable
                            </span>
                          </div>
                          <div className="text-right shrink-0">
                            <span className={`text-xl font-black block tracking-tight ${isActive ? 'text-[#dc2626]' : 'text-slate-800'}`}>
                              Rp{tier.amount}
                            </span>
                            <span className="text-[10px] text-slate-500 font-semibold block italic">
                              / peleton
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <>
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className="text-sm text-slate-500 font-bold">Rp</span>
                    <span className="text-5xl font-black text-red-700 tracking-tighter">{PAYMENT.FEE_DISPLAY}</span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium mb-6">/ Peleton (Termasuk Atribut & Sertifikat)</p>
                </>
              )}

              {/* Bank Account Box */}
              <div className="bg-[#f8fafc] rounded-2xl p-4 border border-dashed border-slate-200 relative">
                <div className="flex justify-between items-center mb-2.5">
                  <span className="text-[11px] font-black text-slate-500 uppercase tracking-wider">
                    REKENING TUJUAN
                  </span>
                  <span className="text-[10px] font-black text-white bg-[#1d4ed8] px-2.5 py-0.5 rounded-md">
                    {PAYMENT.BANK_NAME}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2 bg-white border border-slate-200 p-3 rounded-xl shadow-xs mb-3">
                  <span id="rek-number" className="font-mono text-lg sm:text-xl font-black text-slate-900 tracking-wider truncate">
                    {PAYMENT.ACCOUNT_NUMBER}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyAccount}
                    className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                      copied
                        ? 'bg-green-500 text-white'
                        : 'text-slate-400 hover:text-blue-600 hover:bg-blue-50'
                    }`}
                    aria-label="Salin nomor rekening"
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <div className="space-y-1 text-xs">
                  <p className="text-slate-500 font-medium">
                    A.n: <strong className="text-slate-900 font-black">{PAYMENT.ACCOUNT_NAME}</strong>
                  </p>
                  <p className="text-slate-500 font-medium">
                    Berita: <span className="text-[#dc2626] font-mono font-bold bg-red-50 px-1.5 py-0.5 rounded text-[11px]">{PAYMENT.TRANSFER_NOTE_FORMAT}</span>
                  </p>
                </div>
                <div className="absolute -bottom-7 left-0 w-full flex justify-center">
                  <span
                    className={`text-[10px] font-bold text-green-700 bg-green-100 border border-green-200 px-3 py-1 rounded-full transition-opacity duration-300 flex items-center gap-1 shadow-sm ${
                      copied ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
                  >
                    <Check className="w-3 h-3" /> Rekening Tersalin!
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Footer Info */}
            <div className="relative z-10 mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span className="text-[11px] text-slate-600 font-medium">Unggah bukti di portal</span>
              <span className="font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 rounded text-[11px]">
                Verifikasi 1×24 Jam
              </span>
            </div>
          </div>
        </div>

        {/* 5 Steps Registration Procedure */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200/90 p-6 sm:p-10 lg:p-12 relative overflow-hidden mb-16">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-700 via-amber-500 to-red-700"></div>
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-red-50/60 rounded-full blur-3xl pointer-events-none"></div>

          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12 relative z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-100/60 border border-red-200 text-red-800 text-xs font-bold uppercase tracking-widest mb-3">
              Alur Pendaftaran Peleton
            </div>
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 uppercase italic tracking-tight">
              Prosedur <span className="text-red-700">Pendaftaran</span>
            </h3>
            <p className="text-sm sm:text-base text-slate-600 mt-2 font-medium">
              Ikuti 5 tahapan praktis berikut untuk mendaftarkan peleton sekolah Anda hingga status terverifikasi resmi.
            </p>
          </div>

          {/* 5 Process Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 relative z-10 mb-10">
            {/* Step 1 */}
            <div className="group/step bg-slate-50 hover:bg-white p-5 rounded-2xl border border-slate-200/80 hover:border-red-500/40 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between text-left">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="w-9 h-9 rounded-xl bg-white border border-slate-200 text-slate-700 group-hover/step:bg-red-700 group-hover/step:text-white group-hover/step:border-red-700 flex items-center justify-center font-black text-sm shadow-xs transition-colors">
                    01
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
                    <MonitorSmartphone className="w-4 h-4" />
                  </div>
                </div>
                <h4 className="font-black text-slate-900 uppercase tracking-tight text-sm mb-1.5 group-hover/step:text-red-700 transition-colors">
                  Akses Formulir
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Buka portal resmi dan klik tombol <strong className="text-slate-800">"Daftar Peleton"</strong> untuk membuka formulir wizard digital.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <span>Langkah Awal</span>
                <span className="text-slate-600">Online</span>
              </div>
            </div>

            {/* Step 2 */}
            <div className="group/step bg-slate-50 hover:bg-white p-5 rounded-2xl border border-slate-200/80 hover:border-red-500/40 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between text-left">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="w-9 h-9 rounded-xl bg-white border border-slate-200 text-slate-700 group-hover/step:bg-red-700 group-hover/step:text-white group-hover/step:border-red-700 flex items-center justify-center font-black text-sm shadow-xs transition-colors">
                    02
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
                    <School className="w-4 h-4" />
                  </div>
                </div>
                <h4 className="font-black text-slate-900 uppercase tracking-tight text-sm mb-1.5 group-hover/step:text-red-700 transition-colors">
                  Sekolah & Akun
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Pilih jenjang (SD/SMP), masukkan email akun Google aktif, data sekolah, upload logo, & pilih tipe peleton.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <span>Tahap 1 Wizard</span>
                <span className="text-slate-600">Profil Tim</span>
              </div>
            </div>

            {/* Step 3 */}
            <div className="group/step bg-slate-50 hover:bg-white p-5 rounded-2xl border border-slate-200/80 hover:border-red-500/40 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between text-left">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="w-9 h-9 rounded-xl bg-white border border-slate-200 text-slate-700 group-hover/step:bg-red-700 group-hover/step:text-white group-hover/step:border-red-700 flex items-center justify-center font-black text-sm shadow-xs transition-colors">
                    03
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
                    <UserCheck className="w-4 h-4" />
                  </div>
                </div>
                <h4 className="font-black text-slate-900 uppercase tracking-tight text-sm mb-1.5 group-hover/step:text-red-700 transition-colors">
                  Danton & Official
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Lengkapi identitas Danton & Kartu Pelajar, serta nama Official/Pelatih, No. WhatsApp aktif, & KTP.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <span>Tahap 2 Wizard</span>
                <span className="text-slate-600">Personel Inti</span>
              </div>
            </div>

            {/* Step 4 */}
            <div className="group/step bg-slate-50 hover:bg-white p-5 rounded-2xl border border-slate-200/80 hover:border-red-500/40 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between text-left">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="w-9 h-9 rounded-xl bg-white border border-slate-200 text-slate-700 group-hover/step:bg-red-700 group-hover/step:text-white group-hover/step:border-red-700 flex items-center justify-center font-black text-sm shadow-xs transition-colors">
                    04
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center">
                    <CreditCard className="w-4 h-4" />
                  </div>
                </div>
                <h4 className="font-black text-slate-900 uppercase tracking-tight text-sm mb-1.5 group-hover/step:text-red-700 transition-colors">
                  Bayar & Pakta
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Unggah bukti transfer pembayaran dan bubuhkan tanda tangan digital Pakta Integritas Online di kanvas resmi.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <span>Tahap 3 Wizard</span>
                <span className="text-slate-600">TTD Digital</span>
              </div>
            </div>

            {/* Step 5 */}
            <div className="group/step bg-gradient-to-b from-red-50/80 to-red-100/50 hover:from-red-100 hover:to-red-200/60 p-5 rounded-2xl border border-red-200 hover:border-red-400 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between text-left relative overflow-hidden">
              <div className="absolute -right-3 -top-3 w-16 h-16 bg-red-600/10 rounded-full blur-xl pointer-events-none"></div>
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="w-9 h-9 rounded-xl bg-red-700 text-white flex items-center justify-center font-black text-sm shadow-sm shadow-red-700/30">
                    05
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-red-600 text-white flex items-center justify-center shadow-xs">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                </div>
                <h4 className="font-black text-slate-900 uppercase tracking-tight text-sm mb-1.5">
                  Validasi & Dashboard
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Terima Kode Registrasi resmi, panitia memverifikasi dalam 1×24 jam, dan pantau status via <strong>Dashboard Tim</strong>.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-red-200 flex items-center justify-between text-[10px] font-black text-red-800 uppercase tracking-wider">
                <span>Finalisasi</span>
                <span className="bg-red-600 text-white px-1.5 py-0.5 rounded text-[9px]">Selesai</span>
              </div>
            </div>
          </div>

          {/* CTA Banner with Portal Link */}
          <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-72 h-72 bg-red-600/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="relative z-10 text-left">
              <span className="text-yellow-400 font-extrabold uppercase text-[11px] tracking-wider block mb-1">
                Portal Registrasi Resmi LBB 2026
              </span>
              <h4 className="text-lg sm:text-xl font-black text-white tracking-tight">
                Siap Mendaftarkan Peleton Terbaik Sekolah Anda?
              </h4>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl leading-relaxed">
                Akses formulir digital, pastikan kelengkapan berkas, dan amankan kuota sebelum pendaftaran ditutup.
              </p>
            </div>
            <div className="relative z-10 shrink-0 w-full sm:w-auto flex flex-col sm:flex-row items-center gap-3">
              {isRegistrationAvailable ? (
                <button
                  type="button"
                  onClick={() => openModal('regWizard')}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-gradient-to-r from-red-700 via-red-600 to-red-700 text-white font-extrabold rounded-xl hover:from-red-600 hover:to-red-700 shadow-lg shadow-red-950/40 hover:shadow-red-700/30 transition-all transform hover:-translate-y-0.5 text-sm uppercase tracking-wide cursor-pointer"
                >
                  <span>Buka Formulir Pendaftaran</span>
                  <ExternalLink className="w-4 h-4" />
                </button>
              ) : (
                <div className="w-full sm:w-auto px-6 py-3.5 bg-slate-800 border border-slate-700 text-slate-300 font-bold rounded-xl text-center text-xs uppercase tracking-wide">
                  {isQuotaFull ? 'Pendaftaran Ditutup (Kuota Penuh)' : 'Pendaftaran Sedang Ditutup'}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Required Documents & Center Info */}
        <div className="grid lg:grid-cols-12 gap-8 mb-16 items-stretch">
          {/* Left Column (7 cols): Dokumen Unggahan */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-lg flex flex-col justify-between relative overflow-hidden text-left">
            <div className="absolute top-0 right-0 w-40 h-40 bg-blue-50/60 rounded-full blur-3xl pointer-events-none"></div>

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
                <div className="w-11 h-11 bg-blue-50 text-blue-700 rounded-2xl flex items-center justify-center border border-blue-100 shadow-xs">
                  <FileUp className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-black text-slate-900 uppercase tracking-tight text-lg">
                    Dokumen Unggahan (Wajib)
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Berkas digital yang wajib diunggah saat pendaftaran online di portal.
                  </p>
                </div>
              </div>

              {/* Grid of Document Cards (6 Cards: Rekomendasi, Bukti Transfer, Kartu Pelajar, KTP Official, Pasfoto, Logo Sekolah) */}
              <div className="grid sm:grid-cols-2 gap-3.5">
                {/* Doc 1: Surat Rekomendasi */}
                <div className="bg-slate-50/80 hover:bg-white p-4 rounded-2xl border border-slate-100 hover:border-slate-200 hover:shadow-md transition-all flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2.5">
                      <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shadow-xs">
                        <FileSignature className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-blue-700 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-lg">
                        PDF / JPG
                      </span>
                    </div>
                    <h5 className="font-black text-slate-900 text-xs sm:text-sm mb-1">Surat Rekomendasi</h5>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      Dari Kepala Sekolah / Madrasah asli dengan tanda tangan & stempel basah.
                    </p>
                  </div>
                  <div className="mt-2.5 pt-2 border-t border-slate-200/50 text-[10px] text-slate-400 font-medium">
                    Maks. 2 MB
                  </div>
                </div>

                {/* Doc 2: Bukti Transfer */}
                <div className="bg-slate-50/80 hover:bg-white p-4 rounded-2xl border border-slate-100 hover:border-slate-200 hover:shadow-md transition-all flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2.5">
                      <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-xs">
                        <ImageIcon className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-lg">
                        JPG / PNG
                      </span>
                    </div>
                    <h5 className="font-black text-slate-900 text-xs sm:text-sm mb-1">Bukti Transfer Biaya</h5>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      Foto/Scan struk atau screenshot m-banking jelas dengan nominal sesuai gelombang.
                    </p>
                  </div>
                  <div className="mt-2.5 pt-2 border-t border-slate-200/50 text-[10px] text-slate-400 font-medium">
                    Maks. 2 MB
                  </div>
                </div>

                {/* Doc 3: Kartu Pelajar Komandan */}
                <div className="bg-slate-50/80 hover:bg-white p-4 rounded-2xl border border-slate-100 hover:border-slate-200 hover:shadow-md transition-all flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2.5">
                      <div className="w-8 h-8 rounded-xl bg-red-100 text-red-700 flex items-center justify-center shadow-xs">
                        <CreditCard className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-red-700 bg-red-50 border border-red-100 px-2 py-0.5 rounded-lg">
                        Foto / PDF
                      </span>
                    </div>
                    <h5 className="font-black text-slate-900 text-xs sm:text-sm mb-1">Kartu Pelajar Komandan</h5>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      Scan/Foto Kartu Pelajar sah Komandan Peleton (Danton) pangkalan sekolah bersangkutan.
                    </p>
                  </div>
                  <div className="mt-2.5 pt-2 border-t border-slate-200/50 text-[10px] text-slate-400 font-medium">
                    Maks. 3 MB
                  </div>
                </div>

                {/* Doc 4: KTP Official / Pelatih */}
                <div className="bg-slate-50/80 hover:bg-white p-4 rounded-2xl border border-slate-100 hover:border-slate-200 hover:shadow-md transition-all flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2.5">
                      <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shadow-xs">
                        <UserCheck className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-amber-700 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-lg">
                        Foto / PDF
                      </span>
                    </div>
                    <h5 className="font-black text-slate-900 text-xs sm:text-sm mb-1">KTP Official / Pelatih</h5>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      Scan/Foto KTP asli Official atau Pelatih pendamping resmi peleton sekolah.
                    </p>
                  </div>
                  <div className="mt-2.5 pt-2 border-t border-slate-200/50 text-[10px] text-slate-400 font-medium">
                    Maks. 3 MB
                  </div>
                </div>

                {/* Doc 5: Pasfoto Personel */}
                <div className="bg-slate-50/80 hover:bg-white p-4 rounded-2xl border border-slate-100 hover:border-slate-200 hover:shadow-md transition-all flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2.5">
                      <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center shadow-xs">
                        <Users className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-blue-800 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-lg">
                        Foto 3×4
                      </span>
                    </div>
                    <h5 className="font-black text-slate-900 text-xs sm:text-sm mb-1">Pasfoto Personel & Official</h5>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      Latar <span className="text-red-700 font-bold">Merah (SD)</span> atau <span className="text-blue-700 font-bold">Biru (SMP)</span>. Diunggah langsung per nama di menu Susunan Personel portal.
                    </p>
                  </div>
                  <div className="mt-2.5 pt-2 border-t border-slate-200/50 text-[10px] text-slate-400 font-medium">
                    Diinput di Menu Personel
                  </div>
                </div>

                {/* Doc 6: Logo Sekolah */}
                <div className="bg-slate-50/80 hover:bg-white p-4 rounded-2xl border border-slate-100 hover:border-slate-200 hover:shadow-md transition-all flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2.5">
                      <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shadow-xs">
                        <School className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-purple-700 bg-purple-50 border border-purple-100 px-2 py-0.5 rounded-lg">
                        PNG Transparan
                      </span>
                    </div>
                    <h5 className="font-black text-slate-900 text-xs sm:text-sm mb-1">Logo Sekolah</h5>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      Format PNG transparan resolusi tinggi (tidak pecah) untuk keperluan piagam & backdrop.
                    </p>
                  </div>
                  <div className="mt-2.5 pt-2 border-t border-slate-200/50 text-[10px] text-slate-400 font-medium">
                    HD Resolution
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Reminder Strip */}
            <div className="relative z-10 mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span className="inline-flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="w-4 h-4 text-blue-600" />
                Format digital diunggah ke formulir portal
              </span>
              <span className="font-bold text-slate-700 text-[11px]">
                Validasi TM Fisik
              </span>
            </div>
          </div>

          {/* Right Column (5 cols): Sanksi & Pusat Informasi */}
          <div className="lg:col-span-5 flex flex-col gap-6 justify-between text-left">
            {/* Sanksi & Pembatalan Card */}
            <div className="bg-red-50/80 border border-red-200/80 p-6 rounded-3xl shadow-sm relative overflow-hidden">
              <div className="flex items-center gap-2 mb-3 text-red-800">
                <AlertOctagon className="w-5 h-5 text-red-600" />
                <h4 className="font-black uppercase text-sm tracking-tight">Sanksi & Ketentuan Pembatalan</h4>
              </div>
              <ul className="space-y-2.5 text-xs text-red-900/90 leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-600 shrink-0 mt-1.5"></span>
                  <span><strong>Diskualifikasi Mutlak:</strong> Jika terbukti pemalsuan berkas, identitas, atau status keaktifan siswa.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-600 shrink-0 mt-1.5"></span>
                  <span><strong>Non-Refundable:</strong> Biaya registrasi yang telah disetor tidak dapat ditarik kembali bila tim mundur.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-600 shrink-0 mt-1.5"></span>
                  <span><strong>Perubahan Data Personil:</strong> Hanya dilayani saat forum Technical Meeting dengan membawa bukti resmi.</span>
                </li>
              </ul>
            </div>

            {/* Pusat Informasi Resmi Card */}
            <div className="bg-slate-900 text-white p-6 sm:p-7 rounded-3xl shadow-xl border border-slate-800 relative overflow-hidden flex-1 flex flex-col justify-between">
              <div className="absolute top-0 right-0 w-40 h-40 bg-yellow-500/10 rounded-full blur-3xl pointer-events-none"></div>

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-white/10 text-yellow-400 flex items-center justify-center border border-white/10">
                      <Headset className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-black uppercase text-sm tracking-tight text-white">
                        Pusat Informasi Resmi
                      </h4>
                      <span className="text-[10px] font-bold text-yellow-400 uppercase tracking-wider block">
                        4 Kanal Resmi
                      </span>
                    </div>
                  </div>
                  <span className="text-[9px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                    Terverifikasi
                  </span>
                </div>

                <p className="text-xs text-slate-400 mb-5 leading-relaxed">
                  Seluruh pengumuman resmi dan koordinasi hanya dilayani melalui kanal berikut:
                </p>

                <div className="space-y-2.5 text-xs">

                  {/* WhatsApp Kak Rusyda */}
                  {CONTACT.PERSONS.map((person, idx) => (
                    <a
                      key={idx}
                      href={person.WA_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all group"
                    >
                      <div className="flex items-center gap-2.5">
                        <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                        <div>
                          <span className="text-[10px] text-slate-400 block">WhatsApp ({person.SHORT_NAME})</span>
                          <span className="font-bold text-white group-hover:text-emerald-400">{person.PHONE_DISPLAY}</span>
                        </div>
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-transform" />
                    </a>
                  ))}

                  {/* Instagram & TikTok in 2-col mini grid */}
                  <div className="grid grid-cols-2 gap-2.5 pt-1">
                    <a
                      href={SOCIAL.INSTAGRAM_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all group"
                    >
                      <Instagram className="w-4 h-4 text-pink-400 shrink-0" />
                      <div className="truncate">
                        <span className="text-[9px] text-slate-400 block">Instagram</span>
                        <span className="font-bold text-slate-200 group-hover:text-pink-400 truncate block">{SOCIAL.INSTAGRAM_HANDLE}</span>
                      </div>
                    </a>

                    <a
                      href={SOCIAL.TIKTOK_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all group"
                    >
                      <Video className="w-4 h-4 text-cyan-400 shrink-0" />
                      <div className="truncate">
                        <span className="text-[9px] text-slate-400 block">TikTok</span>
                        <span className="font-bold text-slate-200 group-hover:text-cyan-400 truncate block">{SOCIAL.TIKTOK_HANDLE}</span>
                      </div>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
