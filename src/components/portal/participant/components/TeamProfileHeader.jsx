import React, { useState, useEffect } from 'react';
import { appAlert } from '../../../../utils/appDialog.js';
import {
  Camera,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ShieldCheck,
  Users,
  Shield,
  Phone,
  Sparkles,
  MapPin,
  Edit3,
  X,
  Save,
  Loader2,
  QrCode,
  Download,
  Copy,
  Check,
  Maximize2,
} from 'lucide-react';
import { formatImageUrl, getFallbackImageUrl } from '../../../../services/sheetService.js';
import { useCompetition } from '../../../../context/CompetitionContext.jsx';
import { generateParticipantQRCode, downloadDataUrl, OFFICIAL_BASE_URL } from '../../../../utils/qrGenerator.js';
import RankMedal from '../../../common/RankMedal.jsx';

export default function TeamProfileHeader({
  currentTeam: propCurrentTeam,
  hasLogo: propHasLogo,
  logoLoadFailed: propLogoLoadFailed,
  logoFormattedUrl: propLogoFormattedUrl,
  rawLogoUrl: propRawLogoUrl,
  setLogoLoadFailed: propSetLogoLoadFailed,
  triggerFileUpload,
  updateTeamProfile,
}) {
  const compCtx = useCompetition?.() || {};
  const currentTeam = propCurrentTeam || compCtx.currentTeam;
  const activeUpdateTeamProfile = updateTeamProfile || compCtx.updateTeamProfile;
  const allTeams = compCtx.teams || [];
  const allScores = compCtx.scores || {};
  const isAnnouncementPublished = Boolean(compCtx.settings?.announcementPublished || compCtx.isLocalhost);

  // Hitung medali resmi tim saat pengumuman juara sudah dipublikasikan
  const publishedMedals = React.useMemo(() => {
    if (!isAnnouncementPublished || !currentTeam?.id || !allScores[currentTeam.id]) return [];
    const sameJenjang = allTeams
      .filter(t => t.jenjang === currentTeam.jenjang && allScores[t.id])
      .map(t => {
        const sc = allScores[t.id] || {};
        const juries = sc.juries || {};
        const murniPeleton = Number(
          sc.nilaiMurniPeleton ??
            ((Number(juries.pos1?.peletonTotal ?? 0) +
              Number(juries.pos2?.peletonTotal ?? 0) +
              Number(juries.pos3?.peletonTotal ?? 0)) ||
              Number(sc.pbb?.total ?? 0))
        );
        const penPeleton = Number(sc.penalties?.peletonPenalty ?? sc.penalties?.totalPenalty ?? 0);
        const akhirPeleton = Number(sc.nilaiAkhirPeleton ?? Math.max(0, murniPeleton - penPeleton));

        const murniDanton = Number(
          sc.nilaiMurniDanton ??
            ((Number(juries.pos1?.dantonTotal ?? 0) +
              Number(juries.pos2?.dantonTotal ?? 0) +
              Number(juries.pos3?.dantonTotal ?? 0)) ||
              Number(sc.danton?.total ?? 0))
        );
        const penDanton = Number(sc.penalties?.dantonPenalty ?? 0);
        const akhirDanton = Number(sc.nilaiAkhirDanton ?? Math.max(0, murniDanton - penDanton));

        return { id: t.id, akhirPeleton, murniPeleton, penPeleton, akhirDanton, murniDanton, penDanton };
      });

    const awards = [];
    const peletonRank =
      [...sameJenjang]
        .sort(
          (a, b) =>
            b.akhirPeleton - a.akhirPeleton ||
            b.murniPeleton - a.murniPeleton ||
            a.penPeleton - b.penPeleton ||
            b.murniDanton - a.murniDanton
        )
        .findIndex(x => x.id === currentTeam.id) + 1;
    if (peletonRank >= 1 && peletonRank <= 3) {
      awards.push({ rank: peletonRank, label: `Juara ${peletonRank} Peleton` });
    } else if (peletonRank >= 4 && peletonRank <= 6) {
      awards.push({ rank: peletonRank, label: `Harapan ${peletonRank - 3} Peleton` });
    }

    const dantonRank =
      [...sameJenjang]
        .sort(
          (a, b) =>
            b.akhirDanton - a.akhirDanton ||
            b.murniDanton - a.murniDanton ||
            a.penDanton - b.penDanton
        )
        .findIndex(x => x.id === currentTeam.id) + 1;
    if (dantonRank >= 1 && dantonRank <= 3) {
      awards.push({ rank: dantonRank, label: `Danton Terbaik ${dantonRank}` });
    }

    return awards;
  }, [isAnnouncementPublished, currentTeam?.id, currentTeam?.jenjang, allTeams, allScores]);

  const [internalLogoLoadFailed, setInternalLogoLoadFailed] = useState(false);
  const logoLoadFailed = propLogoLoadFailed !== undefined ? propLogoLoadFailed : internalLogoLoadFailed;
  const setLogoLoadFailed = propSetLogoLoadFailed || setInternalLogoLoadFailed;

  const rawLogoUrl =
    propRawLogoUrl !== undefined
      ? propRawLogoUrl
      : currentTeam?.files?.schoolLogo?.url || currentTeam?.file_logo_sekolah || currentTeam?.logoUrl || '';
  const hasLogo =
    propHasLogo !== undefined
      ? propHasLogo
      : Boolean(rawLogoUrl && rawLogoUrl !== '#' && !rawLogoUrl.startsWith('#'));
  const logoFormattedUrl =
    propLogoFormattedUrl !== undefined
      ? propLogoFormattedUrl
      : hasLogo
        ? formatImageUrl(rawLogoUrl)
        : '';

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  useEffect(() => {
    if (!currentTeam?.regCode) return;
    const targetUrl = `${OFFICIAL_BASE_URL}/?reg=${encodeURIComponent(currentTeam.regCode)}`;
    generateParticipantQRCode(targetUrl, { size: 600 })
      .then(url => setQrDataUrl(url))
      .catch(err => console.error('Error generating TeamProfileHeader QR:', err));
  }, [currentTeam?.regCode]);

  const handleDownloadQR = e => {
    if (e) e.stopPropagation();
    if (!qrDataUrl || !currentTeam) return;
    downloadDataUrl(
      qrDataUrl,
      `QR-${currentTeam.regCode}-${(currentTeam.schoolName || 'peleton').replace(/\s+/g, '_')}.png`
    );
  };

  const handleCopyCode = () => {
    const code = currentTeam?.regCode;
    if (!code || !navigator?.clipboard?.writeText) return;
    navigator.clipboard.writeText(code).then(() => {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    });
  };

  const teamInitials = React.useMemo(() => {
    if (!currentTeam?.schoolName) return 'LM';
    const cleaned = currentTeam.schoolName
      .trim()
      .replace(/^(SD|SMP|SMA|SMK|MTs|MI)\s+/i, '')
      .trim();
    const words = cleaned.split(/\s+/);
    if (words.length === 0 || !words[0]) return 'LM';
    if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
    return (words[0][0] + words[1][0]).toUpperCase();
  }, [currentTeam?.schoolName]);

  const [editForm, setEditForm] = useState({
    city: currentTeam?.city || '',
    province: currentTeam?.province || '',
    platoonName: currentTeam?.platoonName || '',
    waNumber: currentTeam?.waNumber || '',
    officialName:
      currentTeam?.roster?.officials?.[0]?.name || currentTeam?.officialName || currentTeam?.coachName || '',
  });

  const handleOpenEdit = () => {
    if (!currentTeam) return;
    setEditForm({
      city: currentTeam.city || '',
      province: currentTeam.province || '',
      platoonName: currentTeam.platoonName || '',
      waNumber: currentTeam.waNumber || '',
      officialName:
        currentTeam.roster?.officials?.[0]?.name || currentTeam.officialName || currentTeam.coachName || '',
    });
    setIsEditModalOpen(true);
  };

  const handleSaveProfile = async e => {
    e.preventDefault();
    if (!activeUpdateTeamProfile || isSaving || !currentTeam?.id) return;
    setIsSaving(true);
    try {
      await activeUpdateTeamProfile(currentTeam.id, {
        city: editForm.city.trim(),
        province: editForm.province.trim(),
        platoonName: editForm.platoonName.trim(),
        waNumber: editForm.waNumber.trim(),
        officialName: editForm.officialName.trim(),
      });
      setIsEditModalOpen(false);
    } catch (err) {
      console.error('Gagal memperbarui profil peleton:', err);
      appAlert('Terjadi kesalahan saat menyimpan perubahan profil.', {
        title: 'Gagal Menyimpan',
        variant: 'danger',
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (!currentTeam) return null;

  const dantonName = currentTeam.roster?.danton?.name || currentTeam.dantonName || '-';
  const officialName =
    currentTeam.roster?.officials?.[0]?.name || currentTeam.officialName || currentTeam.coachName || '-';
  const waNumber = currentTeam.waNumber || '-';

  const resolveAddress = () => {
    if (currentTeam.schoolAddress && currentTeam.schoolAddress.trim()) {
      return currentTeam.schoolRegion
        ? `${currentTeam.schoolAddress.trim()}, ${currentTeam.schoolRegion}`
        : currentTeam.schoolAddress.trim();
    }
    if (
      currentTeam.address &&
      currentTeam.address.trim() &&
      currentTeam.address.trim() !== 'Daerah Istimewa Yogyakarta'
    ) {
      return currentTeam.address.trim();
    }
    if (currentTeam.schoolName?.includes('Sapen')) {
      return 'Jl. Timoho No. 29, Demangan, Kec. Gondokusuman, Kota Yogyakarta';
    }
    if (currentTeam.schoolName?.includes('Sukonandi')) {
      return 'Jl. Sukonandi No. 1, Semaki, Kec. Umbulharjo, Kota Yogyakarta';
    }
    if (currentTeam.schoolName?.includes("Mu'allimin")) {
      return 'Jl. Letjen S. Parman No. 68, Patangpuluhan, Wirobrajan, Kota Yogyakarta';
    }
    if (currentTeam.city) {
      return `${currentTeam.city}, D.I. Yogyakarta`;
    }
    return currentTeam.address || 'Kota Yogyakarta, Daerah Istimewa Yogyakarta';
  };

  const statusConfig = {
    pending: {
      label: 'Menunggu Verifikasi',
      icon: Clock,
      theme: 'bg-amber-50 text-amber-800 border-amber-200/90',
      dot: 'bg-amber-500',
    },
    registered: {
      label: 'Terdaftar',
      icon: CheckCircle2,
      theme: 'bg-blue-50 text-blue-700 border-blue-200/90',
      dot: 'bg-blue-500',
    },
    revision: {
      label: 'Perlu Revisi',
      icon: AlertTriangle,
      theme: 'bg-rose-50 text-rose-700 border-rose-200/90',
      dot: 'bg-rose-500',
    },
    verified: {
      label: 'Terverifikasi Sah',
      icon: ShieldCheck,
      theme: 'bg-emerald-50 text-emerald-700 border-emerald-200/90',
      dot: 'bg-emerald-500',
    },
    drawn: {
      label: 'Siap Tampil',
      icon: Sparkles,
      theme: 'bg-amber-50 text-amber-800 border-amber-300',
      dot: 'bg-amber-500',
    },
  };

  const status = statusConfig[currentTeam.status] || statusConfig.registered;
  const StatusIcon = status.icon;
  const isSMP = String(currentTeam.jenjang || '').toUpperCase().includes('SMP');
  const categoryLabel = `${currentTeam.jenjang || 'SD'} ${String(
    currentTeam.category || 'Putra'
  ).replace(/homogen\s+/i, '')}`;

  const showSubtitle =
    currentTeam.platoonName &&
    currentTeam.platoonName.trim().toLowerCase() !== currentTeam.schoolName?.trim().toLowerCase() &&
    currentTeam.platoonName.trim().toLowerCase() !==
      `peleton ${currentTeam.schoolName?.trim().toLowerCase()}` &&
    currentTeam.platoonName.trim().toLowerCase() !==
      `pleton ${currentTeam.schoolName?.trim().toLowerCase()}`;

  return (
    <div className="relative rounded-3xl bg-white border border-slate-200/90 shadow-sm overflow-hidden font-sans">
      {/* Subtle Top Brand Accent */}
      <div className="h-1 w-full bg-gradient-to-r from-red-700 via-amber-400 to-slate-900" />

      {/* ========================================================
          UPPER CREDENTIAL BAND (IDENTITY LEFT + INTEGRATED PASS STUB RIGHT)
          ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_330px]">
        {/* LEFT: Team Identity */}
        <div className="p-5 sm:p-6 lg:p-7 flex flex-col justify-center">
          <div className="flex items-start gap-4 sm:gap-5">
            {/* School Logo + Camera Upload Trigger */}
            <div className="relative shrink-0">
              {hasLogo && !logoLoadFailed ? (
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-slate-50 border border-slate-200/80 p-1.5 flex items-center justify-center shadow-xs">
                  <img
                    src={logoFormattedUrl}
                    alt="Logo Sekolah"
                    referrerPolicy="no-referrer"
                    onError={e => {
                      const fallback = getFallbackImageUrl(rawLogoUrl);
                      if (fallback && e.currentTarget.src !== fallback) {
                        e.currentTarget.src = fallback;
                      } else {
                        setLogoLoadFailed(true);
                      }
                    }}
                    className="w-full h-full object-contain"
                  />
                </div>
              ) : (
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center bg-gradient-to-br from-red-700 to-red-900 text-white font-black text-xl sm:text-2xl shadow-sm">
                  <span>{teamInitials}</span>
                </div>
              )}

              <button
                type="button"
                onClick={() => {
                  if (triggerFileUpload) {
                    triggerFileUpload('schoolLogo');
                  } else {
                    handleOpenEdit();
                  }
                }}
                className="absolute -bottom-1.5 -right-1.5 w-7 h-7 rounded-full bg-slate-900 hover:bg-red-700 text-white flex items-center justify-center shadow-sm ring-2 ring-white transition-colors cursor-pointer active:scale-95"
                title="Ganti Logo Sekolah"
              >
                <Camera className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Identity Details */}
            <div className="min-w-0 flex-1 space-y-2">
              {/* Top Row: Status + Category + Edit Button */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-[10px] font-extrabold uppercase tracking-wider ${status.theme}`}
                  >
                    <StatusIcon className="w-3 h-3 shrink-0" />
                    <span>{status.label}</span>
                  </span>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full border text-[10px] font-extrabold uppercase tracking-wider ${
                      isSMP
                        ? 'bg-blue-50 text-blue-700 border-blue-200/80'
                        : 'bg-red-50 text-red-700 border-red-200/80'
                    }`}
                  >
                    {categoryLabel}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleOpenEdit}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 text-[11px] font-bold text-slate-600 hover:text-slate-950 transition-all cursor-pointer active:scale-95 shrink-0"
                  title="Edit data profil peleton & kontak"
                >
                  <Edit3 className="w-3 h-3" />
                  <span>Edit Profil</span>
                </button>
              </div>

              {/* School Name */}
              <div>
                <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-slate-950 leading-tight truncate">
                  {currentTeam.schoolName}
                </h2>
                {showSubtitle && (
                  <p className="text-xs font-bold text-slate-500 mt-0.5 truncate">
                    {currentTeam.platoonName}
                  </p>
                )}
              </div>

              {/* Address */}
              <p className="flex items-center gap-1.5 text-xs text-slate-500">
                <MapPin className="w-3.5 h-3.5 text-red-600 shrink-0" />
                <span className="truncate font-medium text-slate-600">{resolveAddress()}</span>
              </p>

              {/* Published Medals (if any) */}
              {publishedMedals.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  {publishedMedals.map((m, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 pl-1 pr-2.5 py-0.5 text-[10px] font-black uppercase tracking-wide text-amber-900"
                    >
                      <RankMedal rank={m.rank} className="w-4 h-4" title={m.label} />
                      <span>{m.label}</span>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT: Integrated Dark Credential Pass Stub */}
        <div className="bg-slate-950 text-white p-5 sm:p-6 flex items-center justify-between gap-4 border-t lg:border-t-0 lg:border-l border-slate-800 relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />

          <div className="min-w-0 flex-1 space-y-3 relative z-10">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block">
                Kode Registrasi
              </span>
              <div className="flex items-center gap-1.5 mt-1">
                <span
                  className="font-mono text-sm sm:text-base font-black text-white tracking-wider truncate"
                  title={currentTeam.regCode}
                >
                  {currentTeam.regCode || 'LBB27-SD-01-SDM'}
                </span>
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="p-1 rounded-md text-slate-400 hover:text-amber-300 hover:bg-white/10 transition-colors shrink-0 cursor-pointer"
                  title="Salin kode registrasi"
                >
                  {copiedCode ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleDownloadQR}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-[11px] font-bold text-white transition-all cursor-pointer active:scale-95"
                title="Unduh QR Code Peleton"
              >
                <Download className="w-3.5 h-3.5 text-amber-400" />
                <span>Unduh QR</span>
              </button>

              <button
                type="button"
                onClick={() => setIsQrModalOpen(true)}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/10 border border-white/10 text-[11px] font-semibold text-slate-300 hover:text-white transition-all cursor-pointer active:scale-95"
                title="Perbesar QR Code"
              >
                <Maximize2 className="w-3 h-3" />
                <span>Zoom</span>
              </button>
            </div>
          </div>

          {/* Clickable QR Tile */}
          <button
            type="button"
            onClick={() => setIsQrModalOpen(true)}
            className="group relative w-[78px] h-[78px] p-1.5 rounded-2xl bg-white shadow-lg cursor-pointer hover:scale-105 active:scale-95 transition-transform flex items-center justify-center overflow-hidden shrink-0 z-10"
            title="Klik untuk memperbesar QR Code"
          >
            {qrDataUrl ? (
              <img
                src={qrDataUrl}
                alt={`QR Code ${currentTeam.regCode}`}
                className="w-full h-full object-contain block aspect-square"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400">
                <QrCode className="w-6 h-6 animate-pulse text-slate-500" />
              </div>
            )}
          </button>
        </div>
      </div>

      {/* ========================================================
          LOWER METADATA STRIP (3 CLEAN COLUMNS)
          ======================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-3 border-t border-slate-200/80 bg-slate-50/75 divide-y sm:divide-y-0 sm:divide-x divide-slate-200/80">
        {[
          {
            icon: Users,
            label: 'Komandan Peleton',
            value: dantonName,
            iconClass: 'bg-red-50 text-red-700 border-red-100',
            valClass: 'text-slate-900',
          },
          {
            icon: Shield,
            label: 'Official / Pendamping',
            value: officialName,
            iconClass: 'bg-slate-100 text-slate-700 border-slate-200',
            valClass: 'text-slate-900',
          },
          {
            icon: Phone,
            label: 'WhatsApp Tim',
            value: waNumber,
            iconClass: 'bg-emerald-50 text-emerald-700 border-emerald-100',
            valClass: 'text-emerald-700 font-mono',
          },
        ].map(item => {
          const ItemIcon = item.icon;
          return (
            <div key={item.label} className="flex items-center gap-3 px-5 py-3.5 sm:px-6">
              <span
                className={`w-8 h-8 rounded-xl border flex items-center justify-center shrink-0 ${item.iconClass}`}
              >
                <ItemIcon className="w-4 h-4" />
              </span>
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 leading-none">
                  {item.label}
                </p>
                <p className={`mt-1 truncate text-xs sm:text-[13px] font-extrabold ${item.valClass}`}>
                  {item.value}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* ========================================================
          MODAL EDIT PROFIL PELETON
          ======================================================== */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
                  <Edit3 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">Edit Profil Peleton</h3>
                  <p className="text-xs text-slate-500">Perbarui identitas &amp; kontak resmi tim</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Kabupaten / Kota Asal Sekolah
                </label>
                <select
                  value={editForm.city || editForm.schoolRegion || 'Kota Yogyakarta'}
                  onChange={e =>
                    setEditForm(prev => ({
                      ...prev,
                      city: e.target.value,
                      schoolRegion: e.target.value,
                    }))
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-red-600 focus:bg-white focus:ring-1 focus:ring-red-600 cursor-pointer font-medium"
                >
                  <option value="Kota Yogyakarta">Kota Yogyakarta</option>
                  <option value="Kab. Bantul">Kab. Bantul</option>
                  <option value="Kab. Sleman">Kab. Sleman</option>
                  <option value="Kab. Kulon Progo">Kab. Kulon Progo</option>
                  <option value="Kab. Gunungkidul">Kab. Gunungkidul</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Nama Official / Pendamping Utama
                </label>
                <input
                  type="text"
                  value={editForm.officialName}
                  onChange={e => setEditForm(prev => ({ ...prev, officialName: e.target.value }))}
                  placeholder="Nama lengkap pendamping/pembina"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-red-600 focus:bg-white focus:ring-1 focus:ring-red-600 font-medium"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  No. WhatsApp Aktif (Official/Danton)
                </label>
                <input
                  type="tel"
                  value={editForm.waNumber}
                  onChange={e => setEditForm(prev => ({ ...prev, waNumber: e.target.value }))}
                  placeholder="Contoh: 081234567890"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-red-600 focus:bg-white focus:ring-1 focus:ring-red-600 font-mono font-medium"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  disabled={isSaving}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-700 hover:bg-red-800 text-white text-xs font-bold shadow-xs hover:shadow-sm transition-all cursor-pointer disabled:opacity-50"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Menyimpan...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-3.5 h-3.5" />
                      <span>Simpan Perubahan</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL QR CODE BESAR
          ======================================================== */}
      {isQrModalOpen && qrDataUrl && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setIsQrModalOpen(false)}
        >
          <div
            className="relative w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl border border-slate-200 text-center space-y-4"
            onClick={e => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setIsQrModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center gap-2 text-slate-900 font-black text-sm uppercase">
              <QrCode className="w-5 h-5 text-red-600" />
              <span>QR Tiket Registrasi Peleton</span>
            </div>

            <div className="p-3.5 bg-white rounded-2xl border border-slate-200 shadow-inner w-fit mx-auto">
              <img
                src={qrDataUrl}
                alt={`QR ${currentTeam.regCode}`}
                className="w-52 h-52 sm:w-60 sm:h-60 object-contain"
              />
            </div>

            <div className="space-y-1">
              <p className="font-mono font-black text-base text-slate-900 tracking-wider">
                {currentTeam.regCode}
              </p>
              <p className="text-xs text-slate-700 font-bold truncate">{currentTeam.schoolName}</p>
              <p className="text-[11px] text-slate-400">
                Tunjukkan QR ini ke petugas pos gerbang kedatangan &amp; basecamp
              </p>
            </div>

            <button
              type="button"
              onClick={handleDownloadQR}
              className="w-full py-2.5 px-4 rounded-xl bg-red-700 hover:bg-red-800 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all active:scale-95 cursor-pointer"
            >
              <Download className="w-4 h-4 text-amber-300" />
              <span>Unduh Gambar QR</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
