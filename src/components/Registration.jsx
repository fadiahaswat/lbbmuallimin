import React, { useState } from 'react';
import { appPrompt } from '../utils/appDialog.js';
import {
  AlertCircle,
  Users,
  CheckCircle2,
  Wallet,
  Copy,
  Check,
  FileUp,
  ListChecks,
  School,
  GraduationCap,
  Clock,
  ArrowRight,
  FileCheck2,
  ShieldAlert,
} from 'lucide-react';
import { COMPETITION, PAYMENT, CLIPBOARD } from '../config.js';
import { useCompetition } from '../context/CompetitionContext.jsx';
import CountdownTimer from './CountdownTimer.jsx';
import RegisteredSchoolsShowcase from './RegisteredSchoolsShowcase.jsx';

const TABS = [
  { id: 'payment', label: 'Biaya & Pembayaran', mobileLabel: 'Biaya', icon: Wallet },
  { id: 'steps', label: 'Alur 5 Langkah', mobileLabel: 'Alur', icon: ListChecks },
  { id: 'docs', label: 'Syarat & Berkas', mobileLabel: 'Berkas', icon: FileUp },
];

const STEPS = [
  {
    num: '01',
    title: 'Buka Formulir',
    desc: 'Klik "Buka Formulir Pendaftaran" untuk memulai registrasi daring.',
  },
  {
    num: '02',
    title: 'Data Sekolah & Akun',
    desc: 'Pilih jenjang (SD/SMP), isi email Gmail aktif, biodata, & logo sekolah.',
  },
  {
    num: '03',
    title: 'Danton & Official',
    desc: 'Lengkapi data Danton + Kartu Pelajar, nama Official, & WhatsApp aktif.',
  },
  {
    num: '04',
    title: 'Transfer & Pakta',
    desc: 'Unggah bukti transfer (kode unik 108) & tanda tangan Pakta Integritas.',
  },
  {
    num: '05',
    title: 'Verifikasi & Dashboard',
    desc: 'Terima Kode Registrasi. Setelah diverifikasi (≤24 jam), lengkapi roster di Dashboard.',
  },
];

const DIGITAL_DOCS = [
  {
    name: 'Surat Rekomendasi Kepala Sekolah',
    note: 'Asli bertanda tangan & stempel basah',
    spec: 'PDF / JPG · Maks 2 MB',
  },
  {
    name: 'Bukti Transfer Biaya Pendaftaran',
    note: 'Struk ATM / m-banking jelas dengan kode unik 108',
    spec: 'JPG / PNG · Maks 2 MB',
  },
  {
    name: 'Kartu Pelajar Komandan (Danton)',
    note: 'Dapat diganti KIA atau Surat Keterangan Sekolah',
    spec: 'Foto / PDF · Maks 3 MB',
  },
  {
    name: 'Logo Sekolah / Peleton',
    note: 'Resolusi tinggi untuk piagam, ID card & backdrop',
    spec: 'PNG Transparan · HD',
  },
  {
    name: 'Pasfoto 3×4 Personel (25 Anggota)',
    note: 'Latar MERAH (SD/MI) / BIRU (SMP/MTs) · Diinput di Dashboard sebelum TM',
    spec: 'Foto 3×4 · Maks 2 MB',
  },
];

export default function Registration() {
  const {
    openModal,
    teams,
    settings,
    canAccessRegistration,
  } = useCompetition();

  const [activeTab, setActiveTab] = useState('payment');
  const [platoonCalc, setPlatoonCalc] = useState(1);
  const [copied, setCopied] = useState(false);

  // Perhitungan kuota & slot tersisa realtime (abaikan tim yang ditolak / rejected)
  const totalTargetSD = settings?.quotaSD || COMPETITION.SD.TARGET_PLATOONS || 18;
  const totalTargetSMP = settings?.quotaSMP || COMPETITION.SMP.TARGET_PLATOONS || 18;
  const registeredSD = (teams || []).filter(t => t.jenjang === 'SD' && t.status !== 'rejected').length;
  const registeredSMP = (teams || []).filter(t => t.jenjang === 'SMP' && t.status !== 'rejected').length;
  const remainingSD = Math.max(0, totalTargetSD - registeredSD);
  const remainingSMP = Math.max(0, totalTargetSMP - registeredSMP);
  const totalRemaining = remainingSD + remainingSMP;

  const isQuotaFull = totalRemaining <= 0;
  const isRegOpenMaster = settings?.registrationOpen !== false;
  const isRegistrationAvailable = isRegOpenMaster && !isQuotaFull && canAccessRegistration;

  function triggerCopied() {
    setCopied(true);
    setTimeout(() => setCopied(false), CLIPBOARD.RESET_DELAY_MS);
  }

  function handleCopyAccount() {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard
        .writeText(PAYMENT.ACCOUNT_NUMBER)
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
        appPrompt('Silakan salin nomor rekening berikut:', PAYMENT.ACCOUNT_NUMBER, {
          title: 'Salin Nomor Rekening',
          confirmText: 'Tutup',
          readOnly: true,
        });
      }
    } catch {
      appPrompt('Silakan salin nomor rekening berikut:', PAYMENT.ACCOUNT_NUMBER, {
        title: 'Salin Nomor Rekening',
        confirmText: 'Tutup',
        readOnly: true,
      });
    }
  }

  const calculatedAmount = platoonCalc === 2 ? '800.108' : PAYMENT.FEE_DISPLAY || '400.108';

  return (
    <section
      id="registration"
      className="py-20 lg:py-28 bg-slate-950 relative overflow-hidden font-sans border-t border-slate-900 text-white"
    >
      {/* Subtle Background Lighting */}
      <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />
      <div className="absolute top-1/4 -left-24 w-96 h-96 bg-red-600/10 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-24 w-96 h-96 bg-amber-500/10 rounded-full blur-[130px] pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 relative z-10 max-w-5xl">
        {/* ========================================================
            1. SECTION HEADER
            ======================================================== */}
        <div className="mb-10 sm:mb-12 text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/[0.06] border border-white/10 text-slate-300 text-xs font-semibold uppercase tracking-wider mb-4">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span>Juknis &amp; Administrasi 2027</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight leading-tight text-white">
            Informasi <span className="text-amber-400">Pendaftaran</span>
          </h2>
          <div className="w-16 h-1 bg-red-700 mx-auto mt-4 rounded-full" />
          <p className="text-slate-400 text-sm sm:text-base mt-4 leading-relaxed">
            Pantau kuota peleton secara langsung, cek nominal pembayaran, dan lengkapi persyaratan pendaftaran dalam satu tempat.
          </p>
        </div>

        {/* ========================================================
            2. LIVE QUOTA & COUNTDOWN HUB
            ======================================================== */}
        <div className="mb-10">
          <div className="bg-slate-900/80 border border-white/10 rounded-3xl shadow-2xl p-6 sm:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left: Countdown */}
              <div className="lg:col-span-5 flex flex-col justify-center items-center lg:border-r lg:border-white/10 lg:pr-8">
                <CountdownTimer />
              </div>

              {/* Right: Live Quota */}
              {(() => {
                const totalQuota = totalTargetSD + totalTargetSMP;
                const pctSD = Math.min(100, Math.round((registeredSD / Math.max(1, totalTargetSD)) * 100));
                const pctSMP = Math.min(100, Math.round((registeredSMP / Math.max(1, totalTargetSMP)) * 100));
                const isSDFull = remainingSD <= 0;
                const isSMPFull = remainingSMP <= 0;
                const isLowTotal = totalRemaining > 0 && totalRemaining <= 10;

                const quotaCards = [
                  {
                    key: 'SD',
                    label: 'SD / MI',
                    Icon: School,
                    remaining: remainingSD,
                    registered: registeredSD,
                    target: totalTargetSD,
                    pct: pctSD,
                    isFull: isSDFull,
                    isLow: !isSDFull && remainingSD <= 5,
                    iconWrap: 'bg-red-500/15 border-red-500/30 text-red-400',
                    barClass: 'bg-gradient-to-r from-red-600 via-red-500 to-amber-400',
                  },
                  {
                    key: 'SMP',
                    label: 'SMP / MTs',
                    Icon: GraduationCap,
                    remaining: remainingSMP,
                    registered: registeredSMP,
                    target: totalTargetSMP,
                    pct: pctSMP,
                    isFull: isSMPFull,
                    isLow: !isSMPFull && remainingSMP <= 5,
                    iconWrap: 'bg-blue-500/15 border-blue-500/30 text-blue-400',
                    barClass: 'bg-gradient-to-r from-blue-600 via-blue-500 to-sky-400',
                  },
                ];

                return (
                  <div className="lg:col-span-7 space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-white/10">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-amber-400" />
                        <span className="text-xs font-extrabold uppercase tracking-wider text-white">
                          Slot Kuota Peleton
                        </span>
                        <span className="text-[11px] text-slate-500">
                          · {registeredSD + registeredSMP}/{totalQuota} terisi
                        </span>
                      </div>

                      <span
                        className={`inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full border ${
                          isQuotaFull
                            ? 'bg-red-500/15 border-red-500/35 text-red-300'
                            : isLowTotal
                              ? 'bg-amber-500/15 border-amber-400/35 text-amber-300'
                              : 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                        }`}
                      >
                        {!isQuotaFull && (
                          <span
                            className={`w-1.5 h-1.5 rounded-full animate-pulse ${
                              isLowTotal ? 'bg-amber-400' : 'bg-emerald-400'
                            }`}
                          />
                        )}
                        <span>
                          {isQuotaFull ? 'Kuota Penuh' : `Sisa ${totalRemaining} Slot`}
                        </span>
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      {quotaCards.map(card => {
                        const CardIcon = card.Icon;
                        return (
                          <div
                            key={card.key}
                            className={`p-4 rounded-2xl border ${
                              card.isFull
                                ? 'bg-white/[0.02] border-white/[0.06]'
                                : 'bg-white/[0.04] border-white/10'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-2 mb-3">
                              <div className="flex items-center gap-2">
                                <div
                                  className={`w-7 h-7 rounded-lg border flex items-center justify-center shrink-0 ${
                                    card.isFull
                                      ? 'bg-white/[0.04] border-white/10 text-slate-500'
                                      : card.iconWrap
                                  }`}
                                >
                                  <CardIcon className="w-3.5 h-3.5" />
                                </div>
                                <span
                                  className={`text-xs font-extrabold uppercase ${
                                    card.isFull ? 'text-slate-400' : 'text-white'
                                  }`}
                                >
                                  {card.label}
                                </span>
                              </div>

                              {card.isFull ? (
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-400">
                                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                                  Penuh
                                </span>
                              ) : (
                                <span
                                  className={`text-[10px] font-bold ${
                                    card.isLow ? 'text-amber-300' : 'text-emerald-300'
                                  }`}
                                >
                                  {card.isLow ? 'Hampir Penuh' : 'Tersedia'}
                                </span>
                              )}
                            </div>

                            <div className="flex items-baseline justify-between gap-2 mb-2.5">
                              {card.isFull ? (
                                <span className="text-xl font-black text-slate-400">
                                  Kuota Penuh
                                </span>
                              ) : (
                                <div className="flex items-baseline gap-1.5">
                                  <span className="font-mono text-3xl font-black text-white leading-none tabular-nums">
                                    {card.remaining}
                                  </span>
                                  <span className="text-[11px] text-slate-400">slot tersisa</span>
                                </div>
                              )}
                              <span className="font-mono text-xs font-bold text-slate-300 tabular-nums">
                                {card.registered}/{card.target}
                              </span>
                            </div>

                            <div className="w-full h-1.5 rounded-full bg-white/[0.07] overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all duration-700 ${
                                  card.isFull ? 'bg-slate-600' : card.barClass
                                }`}
                                style={{ width: `${card.pct}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {((isSMPFull && !isSDFull) || (isSDFull && !isSMPFull)) && (
                      <p className="text-[11px] text-amber-200/90 flex items-center gap-2 pt-0.5">
                        <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span>
                          {isSMPFull
                            ? `Kuota SMP/MTs penuh. Pendaftaran masih dibuka untuk SD/MI (${remainingSD} slot tersisa).`
                            : `Kuota SD/MI penuh. Pendaftaran masih dibuka untuk SMP/MTs (${remainingSMP} slot tersisa).`}
                        </span>
                      </p>
                    )}
                  </div>
                );
              })()}
            </div>
          </div>
        </div>

        {/* ========================================================
            3. REGISTERED SCHOOLS LOGO STRIP
            ======================================================== */}
        <RegisteredSchoolsShowcase variant="grid" />

        {/* ========================================================
            4. UNIFIED CLEAN TABBED REGISTRATION HUB
            ======================================================== */}
        <div className="rounded-3xl bg-slate-900/80 border border-white/10 shadow-2xl overflow-hidden">
          {/* Top Accent Line */}
          <div className="h-1 w-full bg-gradient-to-r from-red-700 via-amber-400 to-red-700" />

          {/* Clean Segmented Tab Header */}
          <div className="px-4 sm:px-8 pt-5 sm:pt-6 pb-4 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="grid grid-cols-3 sm:inline-flex w-full sm:w-auto p-1 rounded-2xl bg-slate-950/90 border border-white/10 gap-1">
              {TABS.map(tab => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-2.5 sm:px-4 py-2.5 sm:py-2 rounded-xl text-[11px] sm:text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer whitespace-nowrap ${
                      isActive
                        ? 'bg-white text-slate-950 shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-red-700' : ''}`} />
                    <span className="sm:hidden">{tab.mobileLabel}</span>
                    <span className="hidden sm:inline">{tab.label}</span>
                  </button>
                );
              })}
            </div>

            <span className="text-[11px] text-slate-400 font-medium hidden md:inline">
              Maks. 2 Peleton/Sekolah · 25 Personel (1 Danton + 21 Inti + 3 Cadangan)
            </span>
          </div>

          {/* Tab Panel Body */}
          <div className="p-6 sm:p-8">
            {/* TAB 1: BIAYA & PEMBAYARAN */}
            {activeTab === 'payment' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
                {/* Left: Fee & Composition Summary (5 Cols) */}
                <div className="lg:col-span-5 space-y-5">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        Gelombang 2 (s.d. Kuota Penuh)
                      </span>
                      <span className="text-[9px] font-black uppercase bg-red-600 text-white px-2 py-0.5 rounded-full">
                        Aktif
                      </span>
                    </div>

                    <div className="flex items-baseline gap-2">
                      <span className="font-mono text-4xl sm:text-5xl font-black text-amber-400 tracking-tight tabular-nums">
                        Rp{calculatedAmount}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">
                      Sudah termasuk <strong className="text-slate-200">kode unik {PAYMENT.UNIQUE_CODE}</strong> · Bersifat non-refundable.
                    </p>
                  </div>

                  {/* 1 vs 2 Peleton Toggle */}
                  <div className="inline-flex p-1 rounded-xl bg-slate-950 border border-white/10">
                    {[1, 2].map(count => (
                      <button
                        key={count}
                        type="button"
                        onClick={() => setPlatoonCalc(count)}
                        className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          platoonCalc === count
                            ? 'bg-amber-400 text-slate-950'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        {count} Peleton
                      </button>
                    ))}
                  </div>

                  {/* Clean Key Rules List (No Heavy Boxes) */}
                  <div className="pt-4 border-t border-white/10 space-y-2.5 text-xs text-slate-300">
                    <div className="flex items-baseline justify-between gap-3">
                      <span className="text-slate-400 shrink-0">Kuota Sekolah</span>
                      <span className="font-bold text-white text-right">Maks. {COMPETITION.MAX_PLATOONS_PER_SCHOOL} Peleton</span>
                    </div>
                    <div className="flex items-baseline justify-between gap-3">
                      <span className="text-slate-400 shrink-0">Komposisi</span>
                      <span className="font-bold text-white text-right">1 Danton + 21 Inti + 3 Cadangan</span>
                    </div>
                    <div className="flex items-baseline justify-between gap-3">
                      <span className="text-slate-400 shrink-0">Pendamping</span>
                      <span className="font-bold text-white text-right">1 Official + 2 Pendukung</span>
                    </div>
                  </div>
                </div>

                {/* Right: Clean BSI Transfer Card (7 Cols) */}
                <div className="lg:col-span-7 rounded-2xl bg-slate-950/90 border border-white/10 p-5 sm:p-6 space-y-5">
                  <div className="flex items-center justify-between gap-3 pb-4 border-b border-white/10">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block">
                        Rekening Resmi Panitia
                      </span>
                      <span className="text-sm font-bold text-white">{PAYMENT.BANK_NAME}</span>
                    </div>
                    <img
                      src="/Bank_Syariah_Indonesia_white.svg"
                      alt="Bank Syariah Indonesia"
                      className="h-8 sm:h-9 w-auto object-contain opacity-95"
                    />
                  </div>

                  <div className="flex items-center justify-between gap-3 bg-white/[0.04] border border-white/10 px-4 py-3.5 rounded-xl">
                    <div className="min-w-0">
                      <span className="text-[10px] uppercase tracking-wider text-slate-400 block">
                        Nomor Rekening
                      </span>
                      <span className="font-mono text-xl sm:text-2xl font-black text-white tracking-wider block truncate">
                        {PAYMENT.ACCOUNT_NUMBER}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={handleCopyAccount}
                      className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all shrink-0 cursor-pointer ${
                        copied
                          ? 'bg-emerald-500 text-slate-950'
                          : 'bg-white/10 hover:bg-amber-400 text-white hover:text-slate-950'
                      }`}
                      aria-label="Salin nomor rekening"
                    >
                      {copied ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Tersalin</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Salin</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4 text-xs pt-1">
                    <div>
                      <span className="text-slate-400 block mb-0.5">Atas Nama</span>
                      <strong className="text-white font-bold">{PAYMENT.ACCOUNT_NAME}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block mb-0.5">Format Berita Transfer</span>
                      <span className="text-amber-400 font-mono font-bold">
                        {PAYMENT.TRANSFER_NOTE_FORMAT}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: ALUR 5 LANGKAH */}
            {activeTab === 'steps' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                {STEPS.map((step, idx) => (
                  <div key={step.num} className="space-y-2.5">
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`text-xs font-black font-mono px-2.5 py-1 rounded-lg ${
                          idx === STEPS.length - 1
                            ? 'bg-red-600 text-white'
                            : 'bg-white/[0.08] text-amber-400'
                        }`}
                      >
                        {step.num}
                      </span>
                      <div className="h-px flex-1 bg-white/10 hidden lg:block" />
                    </div>
                    <h4 className="text-sm font-extrabold text-white leading-snug">
                      {step.title}
                    </h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* TAB 3: SYARAT & BERKAS */}
            {activeTab === 'docs' && (
              <div className="space-y-6">
                {/* Clean Divided List (No Nested Box Clutter) */}
                <div className="divide-y divide-white/[0.08]">
                  {DIGITAL_DOCS.map((doc, idx) => (
                    <div
                      key={idx}
                      className="py-3 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                    >
                      <div>
                        <h4 className="text-xs sm:text-sm font-bold text-white">{doc.name}</h4>
                        <p className="text-[11px] text-slate-400 mt-0.5">{doc.note}</p>
                      </div>
                      <span className="self-start sm:self-center text-[10px] font-mono font-bold text-slate-300 bg-white/[0.05] border border-white/10 px-2.5 py-1 rounded-lg shrink-0">
                        {doc.spec}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Compact Bottom Notes: Physical TM Docs + Revision/Disqualification */}
                <div className="grid sm:grid-cols-2 gap-3.5 pt-2">
                  <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-400/25 flex items-start gap-2.5">
                    <FileCheck2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div className="text-[11px] text-slate-200 leading-relaxed">
                      <strong className="text-amber-300 block mb-0.5">Wajib Dibawa Fisik Saat TM:</strong>
                      Surat Rekomendasi asli berstempel basah &amp; print-out Pakta Integritas bertanda tangan basah Official.
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/25 flex items-start gap-2.5">
                    <ShieldAlert className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                    <div className="text-[11px] text-slate-200 leading-relaxed">
                      <strong className="text-red-300 block mb-0.5">Ketentuan Penting:</strong>
                      Revisi data personel maksimal H-1 TM (8 Jan 2027). Pemalsuan berkas berujung diskualifikasi mutlak.
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Always-Visible Clean CTA Footer Bar */}
          <div className="px-6 sm:px-8 py-5 bg-slate-950/75 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h4 className="text-sm sm:text-base font-black text-white">
                Siap Mendaftarkan Peleton Sekolah Anda?
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Pendaftaran 100% digital · Verifikasi berkas maksimal 1×24 jam.
              </p>
            </div>

            {isRegistrationAvailable ? (
              <button
                type="button"
                onClick={() => openModal('regWizard')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-xs uppercase tracking-wider transition-all shadow-lg shadow-red-900/35 shrink-0 cursor-pointer active:scale-[0.98]"
              >
                <span>Buka Formulir Pendaftaran</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : !canAccessRegistration ? (
              <button
                type="button"
                onClick={() => openModal('regWizard')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs uppercase tracking-wider transition-all shrink-0 cursor-pointer"
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
      </div>
    </section>
  );
}
