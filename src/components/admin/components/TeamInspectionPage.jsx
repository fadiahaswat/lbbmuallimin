import React, { useState, useEffect } from 'react';
import { appAlert } from '../../../utils/appDialog.js';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  X,
  User,
  FileText,
  Users,
  MessageCircle,
  Mail,
  MapPin,
  Calendar,
  ShieldCheck,
  Award,
  LayoutGrid,
  LayoutList,
  ZoomIn,
  Building2,
  Check,
  Copy,
  QrCode,
  Download,
  Send
} from 'lucide-react';
import { useCompetition, checkTeamVerificationEligibility } from '../../../context/CompetitionContext.jsx';
import { formatImageUrl, getFallbackImageUrl } from '../../../services/sheetService.js';
import { generateParticipantQRCode, downloadDataUrl, OFFICIAL_BASE_URL } from '../../../utils/qrGenerator.js';
import DocumentFileCard from '../components/DocumentFileCard.jsx';

function isValidPhoto(url) {
  return Boolean(
    url &&
    typeof url === 'string' &&
    url !== '#' &&
    !url.startsWith('#') &&
    !url.includes('drive.google.com/open?id=')
  );
}

export default function TeamInspectionPage({
  team,
  teamsList = [],
  onSelectTeam = null,
  inspectionStage = 'registration',
  onBack,
  onVerify
}) {
  const { updateTeamFiles } = useCompetition();
  const [currentStageTab, setCurrentStageTab] = useState(inspectionStage); // 'registration' | 'verification'
  const [rosterView, setRosterView] = useState('grid'); // 'grid' | 'table'
  const [showRevisionBox, setShowRevisionBox] = useState(false);
  const [revisionNoteInput, setRevisionNoteInput] = useState(team.revisionNote || '');
  const [zoomedPerson, setZoomedPerson] = useState(null);
  const [copiedField, setCopiedField] = useState(null);
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [isGeneratingQr, setIsGeneratingQr] = useState(false);

  const qrTargetUrl = team?.regCode
    ? `${OFFICIAL_BASE_URL}/?reg=${encodeURIComponent(team.regCode)}`
    : OFFICIAL_BASE_URL;

  useEffect(() => {
    let cancelled = false;
    if (!team?.regCode) {
      setQrDataUrl('');
      return undefined;
    }
    setIsGeneratingQr(true);
    generateParticipantQRCode(qrTargetUrl, { size: 1000 })
      .then(url => {
        if (!cancelled) setQrDataUrl(url);
      })
      .catch(err => console.error('Failed generating team QR:', err))
      .finally(() => {
        if (!cancelled) setIsGeneratingQr(false);
      });
    return () => {
      cancelled = true;
    };
  }, [team?.regCode, qrTargetUrl]);

  const handleDownloadTeamQR = () => {
    if (!qrDataUrl) return;
    const safeSchool = String(team?.schoolName || 'Peleton')
      .replace(/[^a-zA-Z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 36);
    downloadDataUrl(qrDataUrl, `QR-LBB2027-${team?.regCode || 'PELETON'}-${safeSchool}.png`);
  };

  const qrWhatsappUrl = team?.waNumber
    ? `https://wa.me/${String(team.waNumber).replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
        `Assalamu'alaikum Kak Official ${team.schoolName}.\n\nBerikut tautan Kartu QR Resmi Peleton (${team.regCode}) untuk LBB Mu'allimin 2027:\n${qrTargetUrl}\n\nMohon disimpan untuk proses presensi & check-in hari-H. Terima kasih.`
      )}`
    : null;

  const handleCopy = (key, value) => {
    if (!value) return;
    navigator.clipboard?.writeText(String(value));
    setCopiedField(key);
    setTimeout(() => setCopiedField(null), 1400);
  };

  // Prev/Next team navigation
  const currentTeamIdx = teamsList.findIndex(t => t.id === team.id);
  const canCycle = Boolean(onSelectTeam && teamsList.length > 1 && currentTeamIdx >= 0);
  const handleCycleTeam = (delta) => {
    if (!canCycle) return;
    const nextIdx = (currentTeamIdx + delta + teamsList.length) % teamsList.length;
    const nextTeam = teamsList[nextIdx];
    if (nextTeam) {
      setShowRevisionBox(false);
      setRevisionNoteInput(nextTeam.revisionNote || '');
      onSelectTeam(nextTeam);
    }
  };

  const feeFormatted = (team.feeAmount || 400108).toLocaleString('id-ID');
  const danton = team.roster?.danton;
  const pasukan = Array.isArray(team.roster?.pasukan) ? team.roster.pasukan : [];
  const cadangan = Array.isArray(team.roster?.cadangan) ? team.roster.cadangan : [];
  const officials = Array.isArray(team.roster?.officials) ? team.roster.officials : [];

  const filledPasukanCount = pasukan.filter(p => p?.name && p.name !== '-' && p.name.trim() !== '').length;
  const filledCadanganCount = cadangan.filter(c => c?.name && c.name !== '-' && c.name.trim() !== '').length;
  const eligibility = checkTeamVerificationEligibility(team);
  const isSD = team.jenjang === 'SD';

  const hasFile = (f) => Boolean(f?.url ? f.url !== '#' : f);
  const hasPact = Boolean(
    team.files?.integrityPact?.url || team.files?.integrityPact?.signatureUrl
      ? (team.files.integrityPact.url !== '#' || team.files.integrityPact.signatureUrl !== '#')
      : team.files?.integrityPact
  );

  const docChecks = [
    { key: 'schoolLogo', label: 'Logo Sekolah', ok: hasFile(team.files?.schoolLogo), tab: 'registration' },
    { key: 'dantonCard', label: 'Kartu Pelajar Danton', ok: hasFile(team.files?.dantonCard), tab: 'registration' },
    { key: 'paymentProof', label: 'Bukti Transfer', ok: hasFile(team.files?.paymentProof), tab: 'registration' },
    { key: 'integrityPact', label: 'Pakta Integritas', ok: hasPact, tab: 'registration' },
    { key: 'recommendationLetter', label: 'Surat Rekomendasi', ok: hasFile(team.files?.recommendationLetter), tab: 'registration' },
  ];

  const uploadedDocsCount = docChecks.filter(d => d.ok).length;
  const dantonComplete = Boolean((danton?.name || team.dantonName) && danton?.nisn && danton?.class);
  const pasukanComplete = filledPasukanCount >= 21 && pasukan.filter(p => p?.name && p?.nisn && p?.class).length >= 21;

  const readinessChecklist = [
    ...docChecks,
    { key: 'dantonBio', label: 'Biodata Danton (NISN & Kls)', ok: dantonComplete, tab: 'verification' },
    { key: 'pasukanBio', label: `21 Pasukan Inti (${filledPasukanCount}/21)`, ok: pasukanComplete, tab: 'verification' },
  ];
  const passedChecks = readinessChecklist.filter(c => c.ok).length;
  const readinessPct = Math.round((passedChecks / readinessChecklist.length) * 100);
  const ringRadius = 17;
  const ringCircumference = 2 * Math.PI * ringRadius;
  const ringOffset = ringCircumference * (1 - readinessPct / 100);

  const statusMeta = {
    pending: { label: 'Menunggu ACC', cls: 'bg-amber-500/15 text-amber-300 border-amber-400/30', icon: Clock },
    registered: { label: 'Terdaftar', cls: 'bg-blue-500/15 text-blue-300 border-blue-400/30', icon: CheckCircle2 },
    revision: { label: 'Perlu Revisi', cls: 'bg-rose-500/15 text-rose-300 border-rose-400/30', icon: AlertTriangle },
    verified: { label: 'Sah Terverifikasi', cls: 'bg-emerald-500/15 text-emerald-300 border-emerald-400/30', icon: ShieldCheck },
    drawn: { label: 'Terundi · Siap Tampil', cls: 'bg-purple-500/15 text-purple-300 border-purple-400/30', icon: Sparkles },
  }[team.status] || { label: team.status || 'Terdaftar', cls: 'bg-white/10 text-slate-300 border-white/15', icon: Clock };

  const StatusIcon = statusMeta.icon;

  const flatRosterRows = [
    {
      id: 'danton',
      code: 'DAN',
      roleLabel: 'Komandan Peleton',
      badgeCls: 'bg-rose-600 text-white',
      name: danton?.name || team.dantonName || '',
      className: danton?.class || '',
      nisn: danton?.nisn || '',
      photo: danton?.photo,
      extra: danton?.birthPlace ? `${danton.birthPlace}${danton.birthDate ? `, ${danton.birthDate}` : ''}` : ''
    },
    ...pasukan.map((p, idx) => ({
      id: p.id || `p-${idx + 1}`,
      code: `S${p.safNumber}·B${p.banjarNumber}`,
      roleLabel: `Saf ${p.safNumber} Banjar ${p.banjarNumber}`,
      badgeCls: 'bg-slate-900 text-white',
      name: p.name || '',
      className: p.class || '',
      nisn: p.nisn || '',
      photo: p.photo,
      extra: p.birthPlace ? `${p.birthPlace}${p.birthDate ? `, ${p.birthDate}` : ''}` : ''
    })),
    ...cadangan.map((c, idx) => ({
      id: c.id || `c-${idx + 1}`,
      code: `C${idx + 1}`,
      roleLabel: `Cadangan ${idx + 1}`,
      badgeCls: 'bg-amber-400 text-slate-950',
      name: c.name || '',
      className: c.class || '',
      nisn: c.nisn || '',
      photo: c.photo,
      extra: c.birthPlace ? `${c.birthPlace}${c.birthDate ? `, ${c.birthDate}` : ''}` : ''
    })),
  ];

  return (
    <div className="space-y-5 pb-12">
      {/* 1. UNIFIED DARK OBSIDIAN DOSSIER HEADER (REPLACES DUPLICATE TOP HEADER) */}
      <section className="relative bg-slate-950 text-white rounded-3xl overflow-hidden shadow-lg border border-slate-800/80">
        {/* Subtle Ambient Glow */}
        <div
          className={`pointer-events-none absolute -top-24 -right-24 w-80 h-80 rounded-full blur-3xl opacity-20 ${
            isSD ? 'bg-rose-500' : 'bg-blue-500'
          }`}
        />
        <div className="pointer-events-none absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-emerald-500 blur-3xl opacity-10" />

        {/* Slim Top Navigation Bar inside Dark Banner */}
        <div className="relative z-10 px-5 sm:px-6 py-2.5 border-b border-white/[0.08] flex items-center justify-between gap-3 bg-white/[0.02]">
          <div className="flex items-center gap-2 text-xs min-w-0">
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-1.5 text-slate-300 hover:text-white font-bold transition-colors cursor-pointer shrink-0"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Daftar Peleton</span>
            </button>
          </div>

          {/* Prev / Next Team Switcher */}
          {canCycle && (
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => handleCycleTeam(-1)}
                className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/15 border border-white/10 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                title="Peleton Sebelumnya"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <span className="text-[11px] font-mono font-bold text-slate-400 px-1.5">
                {currentTeamIdx + 1}/{teamsList.length}
              </span>
              <button
                type="button"
                onClick={() => handleCycleTeam(1)}
                className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/15 border border-white/10 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                title="Peleton Berikutnya"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Main Identity + Decision Actions */}
        <div className="relative z-10 px-4 sm:px-6 py-4 sm:py-5 flex flex-col xl:flex-row xl:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3.5 min-w-0">
            {/* Unframed School Logo */}
            {team.files?.schoolLogo?.url && team.files.schoolLogo.url !== '#' ? (
              <img
                src={formatImageUrl(team.files.schoolLogo.url)}
                alt={team.schoolName}
                referrerPolicy="no-referrer"
                onError={(e) => {
                  const fallback = getFallbackImageUrl(team.files.schoolLogo.url);
                  if (fallback && e.currentTarget.src !== fallback) e.currentTarget.src = fallback;
                  else e.currentTarget.style.display = 'none';
                }}
                className="w-11 h-11 sm:w-14 sm:h-14 object-contain shrink-0 drop-shadow-md mt-0.5 sm:mt-0"
              />
            ) : (
              <div className={`w-11 h-11 sm:w-14 sm:h-14 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center font-mono font-black text-base shrink-0 mt-0.5 sm:mt-0 ${isSD ? 'text-rose-300' : 'text-blue-300'}`}>
                {team.jenjang}
              </div>
            )}

            <div className="min-w-0 flex-1 space-y-1.5">
              <h1 className="text-base sm:text-2xl font-black text-white uppercase tracking-tight leading-snug break-words">
                {team.schoolName}
              </h1>
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${statusMeta.cls}`}>
                  <StatusIcon className="w-3 h-3" />
                  <span>{statusMeta.label}</span>
                </span>
                <button
                  type="button"
                  onClick={() => handleCopy('regCode', team.regCode)}
                  className="inline-flex items-center gap-1 font-mono text-[11px] font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
                  title="Salin kode registrasi"
                >
                  <span>{team.regCode}</span>
                  {copiedField === 'regCode' ? (
                    <Check className="w-3 h-3 text-emerald-400" />
                  ) : (
                    <Copy className="w-2.5 h-2.5 opacity-50" />
                  )}
                </button>
                <span className="text-slate-700">·</span>
                <span className="text-[11px] font-medium text-slate-400">
                  {team.teamType || team.category || 'Homogen'}
                </span>
              </div>
            </div>
          </div>

          {/* Primary Decision Actions */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0 pt-3 xl:pt-0 border-t xl:border-t-0 border-white/10">
            <button
              type="button"
              onClick={() => setShowRevisionBox(prev => !prev)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                showRevisionBox
                  ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-md shadow-amber-500/20'
                  : 'bg-white/5 hover:bg-white/10 text-amber-300 border-amber-400/30'
              }`}
            >
              Minta Revisi
            </button>

            {team.status === 'pending' && (
              <button
                type="button"
                onClick={() => onVerify(team.id, 'registered')}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-black rounded-xl shadow-lg shadow-blue-600/25 transition-all inline-flex items-center gap-1.5 cursor-pointer active:scale-95"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>ACC Daftar</span>
              </button>
            )}

            {(team.status === 'registered' || team.status === 'revision') && (
              <button
                type="button"
                onClick={() => {
                  if (!eligibility.isEligible) {
                    appAlert(`Peleton belum dapat diverifikasi sah karena:\n\n• ${eligibility.issues.join('\n• ')}`, { title: 'Berkas Belum Lengkap', variant: 'warning' });
                    return;
                  }
                  onVerify(team.id, 'verified');
                }}
                className={`px-5 py-2.5 text-xs font-black rounded-xl transition-all inline-flex items-center gap-1.5 ${
                  eligibility.isEligible
                    ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/25 cursor-pointer active:scale-95'
                    : 'bg-white/5 text-slate-500 border border-white/10 cursor-not-allowed'
                }`}
                title={
                  eligibility.isEligible
                    ? 'ACC Verifikasi Sah Peleton'
                    : `Belum memenuhi syarat:\n- ${eligibility.issues.join('\n- ')}`
                }
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Verifikasi Sah</span>
              </button>
            )}

            {(team.status === 'verified' || team.status === 'drawn') && (
              <button
                type="button"
                onClick={() => onVerify(team.id, 'registered')}
                className="px-4 py-2.5 bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                Batal Sah
              </button>
            )}
          </div>
        </div>

        {/* Compact Telemetry Footer Strip */}
        <div className="relative z-10 grid grid-cols-2 lg:grid-cols-4 gap-px bg-white/10 border-t border-white/10">
          <div className="bg-slate-950/90 px-4 py-2.5">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block">Berkas</span>
            <span className={`text-sm font-mono font-bold mt-0.5 block ${uploadedDocsCount === 5 ? 'text-emerald-400' : 'text-white'}`}>
              {uploadedDocsCount}<span className="text-slate-500 font-normal">/5</span>
            </span>
          </div>

          <div className="bg-slate-950/90 px-4 py-2.5">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block">Pasukan</span>
            <span className="text-sm font-mono font-bold text-white mt-0.5 block">
              {filledPasukanCount}<span className="text-slate-500 font-normal">/21</span>
              {filledCadanganCount > 0 && (
                <span className="text-[11px] text-slate-400 font-normal"> +{filledCadanganCount}</span>
              )}
            </span>
          </div>

          <div className="bg-slate-950/90 px-4 py-2.5">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block">Biaya</span>
            <span className="text-sm font-mono font-bold text-white mt-0.5 block whitespace-nowrap">
              Rp{feeFormatted}{' '}
              <span className="text-[10.5px] font-sans font-semibold text-emerald-400">
                · G{(() => {
                  const fee = Number(String(team?.feeAmount || '').replace(/\D/g, '')) || 0;
                  if (fee >= 400000) return 2;
                  if (fee > 0 && fee < 400000) return 1;
                  const ts = new Date(team?.registeredAt || team?.createdAt || 0).getTime();
                  if (!Number.isNaN(ts) && ts > 0) return ts > new Date('2026-11-08T23:59:59+07:00').getTime() ? 2 : 1;
                  return Number(team?.wave) || 2;
                })()}
              </span>
            </span>
          </div>

          <div className="bg-slate-950/90 px-4 py-2.5">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block">Undian</span>
            <span className="text-sm font-mono font-bold text-white mt-0.5 block truncate">
              {team.lotNumber ? (
                <>
                  #{String(team.lotNumber).padStart(2, '0')}
                  {team.chestNumber ? ` · ${team.chestNumber}` : ''}
                </>
              ) : (
                <span className="text-slate-400 font-sans font-medium text-xs">Belum Undian</span>
              )}
            </span>
          </div>
        </div>
      </section>

      {/* INLINE REVISION DRAWER */}
      {(showRevisionBox || team.status === 'revision') && (
        <section className="bg-amber-50/90 border border-amber-200 rounded-2xl p-4 sm:p-5 space-y-3 shadow-2xs">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-amber-950 font-bold text-xs">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>Catatan Perbaikan Berkas untuk Kontingen</span>
            </div>
            {showRevisionBox && (
              <button
                type="button"
                onClick={() => setShowRevisionBox(false)}
                className="text-amber-700 hover:text-amber-950 p-1 rounded-lg hover:bg-amber-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <textarea
            rows={2}
            value={revisionNoteInput}
            onChange={e => setRevisionNoteInput(e.target.value)}
            placeholder="Tulis catatan revisi yang akan langsung muncul di portal peserta..."
            className="w-full p-3 bg-white border border-amber-300/80 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />

          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
              {[
                { label: 'Bukti Bayar Buram', text: 'Bukti transfer pembayaran buram/tidak terbaca. Mohon unggah ulang screenshot resmi.' },
                { label: 'Kartu Danton', text: 'Kartu Pelajar / Surat Keterangan Danton belum sesuai jenjang. Mohon diperbarui.' },
                { label: 'Pakta Integritas', text: 'Pakta integritas belum ditandatangani sah. Mohon tandatangani online atau unggah ulang.' },
              ].map(tpl => (
                <button
                  key={tpl.label}
                  type="button"
                  onClick={() => setRevisionNoteInput(tpl.text)}
                  className="px-2.5 py-1 bg-white hover:bg-amber-100 border border-amber-200 text-amber-900 rounded-lg font-semibold transition-colors cursor-pointer"
                >
                  + {tpl.label}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => {
                onVerify(team.id, 'revision', revisionNoteInput);
                setShowRevisionBox(false);
              }}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
            >
              Kirim Revisi
            </button>
          </div>
        </section>
      )}

      {/* 2. TWO-COLUMN STUDIO WORKSPACE */}
      <div className="grid grid-cols-1 lg:grid-cols-[290px_1fr] gap-5 items-start">
        {/* LEFT STICKY SIDEBAR: READINESS RING CHECKLIST + DOSSIER PROFILE */}
        <aside className="space-y-4 lg:sticky lg:top-4">
          {/* Card A: Interactive Verification Readiness Checklist with Circular Ring */}
          <div className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-2xs">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-3">
              <div>
                <span className="text-[11px] font-black uppercase tracking-wider text-slate-900 block">
                  Kelayakan Sah
                </span>
                <span className="text-[11px] text-slate-400 font-medium block mt-0.5">
                  {passedChecks} dari {readinessChecklist.length} syarat terpenuhi
                </span>
              </div>

              {/* Circular SVG Progress Ring */}
              <div className="relative w-11 h-11 shrink-0 flex items-center justify-center">
                <svg className="w-11 h-11 -rotate-90" viewBox="0 0 42 42">
                  <circle
                    cx="21"
                    cy="21"
                    r={ringRadius}
                    fill="none"
                    stroke="#f1f5f9"
                    strokeWidth="4"
                  />
                  <circle
                    cx="21"
                    cy="21"
                    r={ringRadius}
                    fill="none"
                    stroke={readinessPct === 100 ? '#10b981' : '#f59e0b'}
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeDasharray={ringCircumference}
                    strokeDashoffset={ringOffset}
                    className="transition-all duration-500"
                  />
                </svg>
                <span className="absolute text-[10px] font-mono font-black text-slate-900">
                  {readinessPct}%
                </span>
              </div>
            </div>

            <div className="p-2.5 space-y-0.5">
              {readinessChecklist.map(item => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setCurrentStageTab(item.tab)}
                  className="w-full px-2.5 py-2 rounded-xl hover:bg-slate-50 flex items-center justify-between gap-2 text-left transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${
                      item.ok ? 'bg-emerald-500 text-white' : 'bg-slate-100 border border-slate-300 text-transparent'
                    }`}>
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </span>
                    <span className={`text-xs truncate ${item.ok ? 'text-slate-700 font-semibold' : 'text-slate-500 font-medium'}`}>
                      {item.label}
                    </span>
                  </div>
                  <span className={`text-[10px] font-bold shrink-0 ${item.ok ? 'text-emerald-600' : 'text-amber-600'}`}>
                    {item.ok ? 'OK' : 'Belum'}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Card B: Profil & Kontak Kontingen */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-4 space-y-3.5 shadow-2xs">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-900 block">
              Kontak &amp; Profil Kontingen
            </span>

            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-2.5">
                <Award className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Komandan Peleton</span>
                  <span className="font-bold text-slate-900 block truncate">
                    {team.dantonName || danton?.name || '—'}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <User className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Official / Pembina</span>
                  <span className="font-bold text-slate-900 block truncate">
                    {team.officialName || team.coachName || '—'}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Email Akun</span>
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-mono text-[11px] text-slate-700 truncate" title={team.email}>
                      {team.email || '—'}
                    </span>
                    {team.email && (
                      <button
                        type="button"
                        onClick={() => handleCopy('email', team.email)}
                        className="p-1 text-slate-400 hover:text-slate-900 rounded cursor-pointer shrink-0"
                        title="Salin email"
                      >
                        {copiedField === 'email' ? (
                          <Check className="w-3 h-3 text-emerald-600" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Alamat Sekolah</span>
                  <span className="text-slate-600 leading-relaxed block">
                    {team.address || '—'}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Calendar className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Terdaftar</span>
                  <span className="text-slate-600 block">
                    {team.registeredAt ? new Date(team.registeredAt).toLocaleString('id-ID') : '—'}
                  </span>
                </div>
              </div>

              {team.basecampNumber && (
                <div className="flex items-start gap-2.5">
                  <Building2 className="w-4 h-4 text-purple-500 shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold uppercase text-slate-400 block">Basecamp</span>
                    <span className="font-bold text-slate-900 block">Ruang {team.basecampNumber}</span>
                  </div>
                </div>
              )}
            </div>

            {team.waNumber && (
              <a
                href={`https://wa.me/${String(team.waNumber).replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-xs"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp · {team.waNumber}</span>
              </a>
            )}
          </div>
        </aside>

        {/* RIGHT MAIN INSPECTION CANVAS */}
        <div className="min-w-0 space-y-4">
          {/* Sleek Tab Switcher Bar */}
          <div className="bg-white rounded-2xl border border-slate-200/90 px-3 py-2.5 flex flex-wrap items-center justify-between gap-2 shadow-2xs">
            <div className="inline-flex items-center p-1 rounded-xl bg-slate-100 border border-slate-200/70">
              <button
                type="button"
                onClick={() => setCurrentStageTab('registration')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold inline-flex items-center gap-1.5 transition-all cursor-pointer ${
                  currentStageTab === 'registration'
                    ? 'bg-slate-950 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-950'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Berkas Persyaratan ({uploadedDocsCount}/5)</span>
              </button>
              <button
                type="button"
                onClick={() => setCurrentStageTab('verification')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold inline-flex items-center gap-1.5 transition-all cursor-pointer ${
                  currentStageTab === 'verification'
                    ? 'bg-slate-950 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-950'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>Formasi 25 Personel</span>
              </button>
            </div>

            {currentStageTab === 'verification' && (
              <div className="inline-flex items-center p-0.5 rounded-xl bg-slate-100 border border-slate-200/70">
                <button
                  type="button"
                  onClick={() => setRosterView('grid')}
                  className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold inline-flex items-center gap-1 transition-all cursor-pointer ${
                    rosterView === 'grid' ? 'bg-white text-slate-950 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span>Formasi</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRosterView('table')}
                  className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold inline-flex items-center gap-1 transition-all cursor-pointer ${
                    rosterView === 'table' ? 'bg-white text-slate-950 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <LayoutList className="w-3.5 h-3.5" />
                  <span>Tabel Audit</span>
                </button>
              </div>
            )}
          </div>

          {/* TAB 1: BERKAS PERSYARATAN & QR PASS GALLERY (2x3 SYMMETRICAL GRID) */}
          {currentStageTab === 'registration' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <DocumentFileCard
                number="1"
                title="Logo Pangkalan / Peleton"
                file={team.files?.schoolLogo}
                colorClass="text-slate-800"
                onUpload={(fileData) => updateTeamFiles(team.id, 'schoolLogo', fileData)}
                onDelete={() => updateTeamFiles(team.id, 'schoolLogo', null)}
              />
              <DocumentFileCard
                number="2"
                title="Kartu Pelajar Danton"
                file={team.files?.dantonCard}
                colorClass="text-slate-800"
                onUpload={(fileData) => updateTeamFiles(team.id, 'dantonCard', fileData)}
                onDelete={() => updateTeamFiles(team.id, 'dantonCard', null)}
              />
              <DocumentFileCard
                number="3"
                title="Bukti Transfer Pendaftaran"
                file={team.files?.paymentProof}
                colorClass="text-slate-800"
                onUpload={(fileData) => updateTeamFiles(team.id, 'paymentProof', fileData)}
                onDelete={() => updateTeamFiles(team.id, 'paymentProof', null)}
              />
              <DocumentFileCard
                number="4"
                title="Pakta Integritas Resmi"
                file={team.files?.integrityPact}
                colorClass="text-slate-800"
                isSignature={true}
                onUpload={(fileData) => updateTeamFiles(team.id, 'integrityPact', fileData)}
                onDelete={() => updateTeamFiles(team.id, 'integrityPact', null)}
              />
              <DocumentFileCard
                number="5"
                title="Surat Rekomendasi Kepala Sekolah"
                file={team.files?.recommendationLetter}
                colorClass="text-slate-800"
                onUpload={(fileData) => updateTeamFiles(team.id, 'recommendationLetter', fileData)}
                onDelete={() => updateTeamFiles(team.id, 'recommendationLetter', null)}
              />

              {/* CARD 06: DARK OBSIDIAN QR PASS PELETON (DOWNLOADABLE & SHAREABLE) */}
              <div className="bg-slate-950 text-white border border-slate-800 rounded-2xl overflow-hidden flex flex-col justify-between shadow-sm relative group/qr">
                <div className="pointer-events-none absolute -top-12 -right-12 w-36 h-36 rounded-full bg-emerald-500/20 blur-2xl" />

                {/* Header */}
                <div className="relative z-10 px-4 py-3 border-b border-white/10 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-5 h-5 rounded-md bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0">
                      <QrCode className="w-3.5 h-3.5" />
                    </span>
                    <span className="text-xs font-bold text-white truncate">
                      QR Pass Peleton
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-[9.5px] font-bold shrink-0">
                    Siap Kirim
                  </span>
                </div>

                {/* QR Preview Stage */}
                <div className="relative z-10 h-40 px-4 py-3 flex items-center justify-center gap-4">
                  <button
                    type="button"
                    disabled={!qrDataUrl}
                    onClick={() => qrDataUrl && setZoomedPerson({
                      name: `QR Pass · ${team.schoolName}`,
                      photo: qrDataUrl,
                      role: team.regCode,
                      isRawDataUrl: true
                    })}
                    className={`w-32 h-32 rounded-xl bg-white p-2 shadow-md flex items-center justify-center shrink-0 transition-transform ${
                      qrDataUrl ? 'hover:scale-[1.03] cursor-zoom-in' : ''
                    }`}
                    title="Klik untuk perbesar QR"
                  >
                    {isGeneratingQr ? (
                      <span className="text-[10px] font-mono text-slate-400 animate-pulse">Membuat QR...</span>
                    ) : qrDataUrl ? (
                      <img src={qrDataUrl} alt={`QR ${team.regCode}`} className="w-full h-full object-contain" />
                    ) : (
                      <QrCode className="w-8 h-8 text-slate-300" />
                    )}
                  </button>

                  <div className="min-w-0 space-y-2 hidden sm:block">
                    <div>
                      <span className="text-[9.5px] font-bold uppercase tracking-wider text-slate-400 block">Kode Scan</span>
                      <span className="font-mono text-xs font-black text-white block truncate">{team.regCode}</span>
                    </div>
                    <p className="text-[10.5px] text-slate-400 leading-snug">
                      Unduh PNG resolusi tinggi atau kirim link QR langsung ke WA Official.
                    </p>
                  </div>
                </div>

                {/* Action Footer */}
                <div className="relative z-10 px-4 py-2.5 bg-white/[0.03] border-t border-white/10 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    disabled={!qrDataUrl}
                    onClick={handleDownloadTeamQR}
                    className="flex-1 py-1.5 px-3 rounded-lg bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-slate-950 font-black text-[11px] inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Unduh PNG</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleCopy('qrLink', qrTargetUrl)}
                    className="py-1.5 px-2.5 rounded-lg bg-white/10 hover:bg-white/15 text-slate-200 font-bold text-[11px] inline-flex items-center gap-1 transition-colors cursor-pointer"
                    title="Salin link QR"
                  >
                    {copiedField === 'qrLink' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-300">Disalin</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Link</span>
                      </>
                    )}
                  </button>

                  {qrWhatsappUrl && (
                    <a
                      href={qrWhatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-1.5 px-2.5 rounded-lg bg-white/10 hover:bg-emerald-600 text-slate-200 hover:text-white font-bold text-[11px] inline-flex items-center gap-1 transition-colors"
                      title="Kirim link QR via WhatsApp Official"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>WA</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: FORMASI 25 PERSONEL */}
          {currentStageTab === 'verification' && (
            rosterView === 'table' ? (
              <div className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-2xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                      <tr>
                        <th className="py-2.5 px-4">Posisi</th>
                        <th className="py-2.5 px-4">Personel</th>
                        <th className="py-2.5 px-4 text-center">Kelas</th>
                        <th className="py-2.5 px-4">NISN</th>
                        <th className="py-2.5 px-4 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {flatRosterRows.map(row => {
                        const complete = Boolean(row.name && row.name !== '-' && row.nisn && row.className);
                        const hasImg = isValidPhoto(row.photo);
                        return (
                          <tr key={row.id} className="hover:bg-slate-50/70 transition-colors">
                            <td className="py-2.5 px-4 whitespace-nowrap">
                              <span className={`px-2 py-0.5 rounded font-mono text-[10px] font-black ${row.badgeCls}`}>
                                {row.code}
                              </span>
                            </td>
                            <td className="py-2.5 px-4">
                              <div className="flex items-center gap-2.5">
                                <button
                                  type="button"
                                  disabled={!hasImg}
                                  onClick={() => hasImg && setZoomedPerson({ name: row.name, photo: row.photo, role: row.roleLabel })}
                                  className={`w-8 h-8 rounded-lg bg-slate-100 overflow-hidden shrink-0 border border-slate-200/80 flex items-center justify-center ${
                                    hasImg ? 'cursor-zoom-in' : 'cursor-default'
                                  }`}
                                >
                                  {hasImg ? (
                                    <img
                                      src={formatImageUrl(row.photo)}
                                      alt={row.name}
                                      referrerPolicy="no-referrer"
                                      className="w-full h-full object-cover object-top"
                                    />
                                  ) : (
                                    <User className="w-3.5 h-3.5 text-slate-400" />
                                  )}
                                </button>
                                <div className="min-w-0">
                                  <div className="font-bold text-slate-900 uppercase truncate max-w-[240px]">
                                    {row.name || <span className="text-slate-300 font-normal normal-case">Belum diisi</span>}
                                  </div>
                                  {row.extra && (
                                    <div className="text-[10px] text-slate-400 truncate max-w-[240px]">{row.extra}</div>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="py-2.5 px-4 text-center font-mono text-slate-700">
                              {row.className || '—'}
                            </td>
                            <td className="py-2.5 px-4 font-mono text-slate-600">
                              {row.nisn || '—'}
                            </td>
                            <td className="py-2.5 px-4 text-center">
                              <span className={`inline-flex items-center gap-1 text-[10.5px] font-bold px-2 py-0.5 rounded-full ${
                                complete ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                              }`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${complete ? 'bg-emerald-500' : 'bg-amber-400'}`} />
                                {complete ? 'Lengkap' : 'Kurang'}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Pimpinan & Pendamping */}
                <div className="bg-white rounded-2xl border border-slate-200/90 p-4 space-y-3 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-1 h-4 rounded-full bg-rose-600" />
                      <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
                        Pimpinan &amp; Pendamping
                      </h3>
                    </div>
                    <span className="text-[10.5px] font-mono font-bold text-slate-400">
                      {1 + officials.length} Personel
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {/* Danton Card */}
                    <div className="group bg-slate-950 text-white rounded-2xl border border-slate-800 overflow-hidden flex flex-col shadow-sm">
                      <div
                        onClick={() => isValidPhoto(danton?.photo) && setZoomedPerson({ name: danton?.name || team.dantonName, photo: danton.photo, role: 'Komandan Peleton' })}
                        className={`aspect-[3/4] w-full bg-slate-900 relative overflow-hidden flex items-center justify-center ${
                          isValidPhoto(danton?.photo) ? 'cursor-zoom-in' : ''
                        }`}
                      >
                        {isValidPhoto(danton?.photo) ? (
                          <img
                            src={formatImageUrl(danton.photo)}
                            alt="Danton"
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              const fallback = getFallbackImageUrl(danton.photo);
                              if (fallback && e.currentTarget.src !== fallback) e.currentTarget.src = fallback;
                              else e.currentTarget.style.display = 'none';
                            }}
                          />
                        ) : (
                          <div className="flex flex-col items-center justify-center text-slate-500">
                            <User className="w-7 h-7 opacity-40 mb-1" />
                            <span className="text-[9px] font-mono font-bold tracking-wider">DANTON</span>
                          </div>
                        )}
                        <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-rose-600 text-white text-[9px] font-black uppercase tracking-wider shadow-sm">
                          Danton
                        </span>
                        {isValidPhoto(danton?.photo) && (
                          <span className="absolute bottom-2 right-2 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <ZoomIn className="w-3 h-3" />
                          </span>
                        )}
                      </div>
                      <div className="p-2.5 space-y-0.5">
                        <span className="font-black text-[11px] text-white block truncate uppercase" title={danton?.name || team.dantonName}>
                          {danton?.name || team.dantonName || '—'}
                        </span>
                        <div className="text-[10px] text-slate-400 font-mono truncate">
                          {danton?.class ? `Kls ${danton.class}` : '—'} · {danton?.nisn || '—'}
                        </div>
                      </div>
                    </div>

                    {/* Officials */}
                    {officials.map((o, i) => {
                      const hasOPhoto = isValidPhoto(o.photo);
                      const isMainOfficial = i === 0 || o.category === 'official';
                      const displayRole = o.role && o.role !== '-' ? o.role : (isMainOfficial ? 'Official' : `Crew ${i}`);

                      return (
                        <div key={o.id || i} className="group bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col hover:border-slate-300 transition-colors">
                          <div
                            onClick={() => hasOPhoto && setZoomedPerson({ name: o.name, photo: o.photo, role: displayRole })}
                            className={`aspect-[3/4] w-full bg-slate-100 relative overflow-hidden flex items-center justify-center ${
                              hasOPhoto ? 'cursor-zoom-in' : ''
                            }`}
                          >
                            {hasOPhoto ? (
                              <img
                                src={formatImageUrl(o.photo)}
                                alt={o.name}
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                              />
                            ) : (
                              <div className="flex flex-col items-center justify-center text-slate-400">
                                <User className="w-6 h-6 opacity-35 mb-1" />
                                <span className="text-[9px] font-mono font-bold">{isMainOfficial ? 'OFFICIAL' : `CREW ${i}`}</span>
                              </div>
                            )}
                            <span className={`absolute top-2 left-2 px-2 py-0.5 rounded-md text-[9px] font-bold truncate max-w-[80%] ${
                              isMainOfficial ? 'bg-blue-600 text-white' : 'bg-slate-800 text-white'
                            }`}>
                              {displayRole}
                            </span>
                          </div>
                          <div className="p-2.5 space-y-0.5">
                            <span className="font-bold text-[11px] text-slate-900 block truncate uppercase" title={o.name}>
                              {o.name || '—'}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono block truncate">
                              {o.phone || '—'}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 21 Pasukan Inti — 3 Saf */}
                {pasukan.length > 0 ? (
                  [1, 2, 3].map(saf => (
                    <div key={saf} className="bg-white rounded-2xl border border-slate-200/90 p-4 space-y-3 shadow-2xs">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-1 h-4 rounded-full bg-slate-900" />
                          <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
                            Saf {saf} · {saf === 1 ? 'Depan' : saf === 2 ? 'Tengah' : 'Belakang'}
                          </h3>
                        </div>
                        <span className="text-[10.5px] font-mono font-bold text-slate-400">
                          Banjar 1 – 7
                        </span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-7 gap-2.5">
                        {pasukan.filter(p => p.safNumber === saf).map(p => {
                          const hasPPhoto = isValidPhoto(p.photo);
                          const isFilled = Boolean(p.name && p.name !== '-' && p.name.trim() !== '');
                          return (
                            <div
                              key={p.id}
                              className={`group bg-white rounded-xl border overflow-hidden flex flex-col transition-all ${
                                isFilled
                                  ? 'border-slate-200 hover:border-slate-400'
                                  : 'border-dashed border-slate-200 opacity-70'
                              }`}
                            >
                              <div
                                onClick={() => hasPPhoto && setZoomedPerson({ name: p.name, photo: p.photo, role: `Saf ${saf} · Banjar ${p.banjarNumber}` })}
                                className={`aspect-[3/4] w-full bg-slate-100 relative overflow-hidden flex items-center justify-center ${
                                  hasPPhoto ? 'cursor-zoom-in' : ''
                                }`}
                              >
                                {hasPPhoto ? (
                                  <img
                                    src={formatImageUrl(p.photo)}
                                    alt={p.name}
                                    referrerPolicy="no-referrer"
                                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                                    onError={(e) => {
                                      const fallback = getFallbackImageUrl(p.photo);
                                      if (fallback && e.currentTarget.src !== fallback) e.currentTarget.src = fallback;
                                      else e.currentTarget.style.display = 'none';
                                    }}
                                  />
                                ) : (
                                  <div className="flex flex-col items-center justify-center text-slate-400">
                                    <User className="w-5 h-5 opacity-35 mb-0.5" />
                                    <span className="text-[9px] font-mono font-bold">B{p.banjarNumber}</span>
                                  </div>
                                )}
                                <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-slate-950/80 text-white text-[9px] font-mono font-bold">
                                  B{p.banjarNumber}
                                </span>
                              </div>
                              <div className="p-2 space-y-0.5">
                                <span className="font-bold text-[10.5px] text-slate-900 block truncate uppercase" title={p.name}>
                                  {p.name || '—'}
                                </span>
                                <div className="text-[9.5px] text-slate-400 font-mono truncate">
                                  {p.class ? `Kls ${p.class}` : '—'} · {p.nisn || '—'}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center text-xs text-slate-400">
                    Daftar 21 anggota pasukan belum diisi oleh kontingen.
                  </div>
                )}

                {/* 3 Personel Cadangan */}
                {cadangan.length > 0 && (
                  <div className="bg-white rounded-2xl border border-slate-200/90 p-4 space-y-3 shadow-2xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-1 h-4 rounded-full bg-amber-400" />
                        <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
                          Personel Cadangan
                        </h3>
                      </div>
                      <span className="text-[10.5px] font-mono font-bold text-slate-400">
                        Opsional ({filledCadanganCount}/3)
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
                      {cadangan.map((c, i) => {
                        const hasCPhoto = isValidPhoto(c.photo);
                        return (
                          <div key={c.id || i} className="group bg-white rounded-xl border border-slate-200 hover:border-amber-400 overflow-hidden flex flex-col transition-all">
                            <div
                              onClick={() => hasCPhoto && setZoomedPerson({ name: c.name, photo: c.photo, role: `Cadangan ${i + 1}` })}
                              className={`aspect-[3/4] w-full bg-slate-100 relative overflow-hidden flex items-center justify-center ${
                                hasCPhoto ? 'cursor-zoom-in' : ''
                              }`}
                            >
                              {hasCPhoto ? (
                                <img
                                  src={formatImageUrl(c.photo)}
                                  alt={c.name}
                                  referrerPolicy="no-referrer"
                                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                                />
                              ) : (
                                <div className="flex flex-col items-center justify-center text-slate-400">
                                  <User className="w-5 h-5 opacity-35 mb-0.5" />
                                  <span className="text-[9px] font-mono font-bold">C{i + 1}</span>
                                </div>
                              )}
                              <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-amber-400 text-slate-950 text-[9px] font-mono font-black">
                                C{i + 1}
                              </span>
                            </div>
                            <div className="p-2 space-y-0.5">
                              <span className="font-bold text-[10.5px] text-slate-900 block truncate uppercase" title={c.name}>
                                {c.name || '—'}
                              </span>
                              <div className="text-[9.5px] text-slate-400 font-mono truncate">
                                {c.class ? `Kls ${c.class}` : '—'} · {c.nisn || '—'}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )
          )}
        </div>
      </div>

      {/* PHOTO LIGHTBOX MODAL */}
      {zoomedPerson && (
        <div
          onClick={() => setZoomedPerson(null)}
          className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div
            onClick={e => e.stopPropagation()}
            className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden max-w-sm w-full shadow-2xl"
          >
            <div className="px-4 py-3 flex items-center justify-between border-b border-slate-800">
              <div className="min-w-0">
                <div className="text-xs font-black text-white uppercase truncate">{zoomedPerson.name || 'Personel'}</div>
                <div className="text-[10.5px] text-slate-400">{zoomedPerson.role}</div>
              </div>
              <button
                type="button"
                onClick={() => setZoomedPerson(null)}
                className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className={`flex items-center justify-center max-h-[70vh] overflow-hidden ${zoomedPerson.isRawDataUrl ? 'bg-white p-6' : 'bg-slate-950'}`}>
              <img
                src={zoomedPerson.isRawDataUrl ? zoomedPerson.photo : formatImageUrl(zoomedPerson.photo)}
                alt={zoomedPerson.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain max-h-[65vh]"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
