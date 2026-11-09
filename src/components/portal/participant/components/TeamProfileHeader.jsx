import React, { useState } from 'react';
import {
  Camera,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ShieldCheck,
  User,
  Users,
  Shield,
  Phone,
  Sparkles,
  School,
  MapPin,
  Edit3,
  X,
  Save,
  Loader2
} from 'lucide-react';
import { formatImageUrl, getFallbackImageUrl } from '../../../../services/sheetService.js';
import { extractLogoTheme } from '../../../../utils/extractLogoColor.js';
import { useCompetition } from '../../../../context/CompetitionContext.jsx';

export default function TeamProfileHeader({
  currentTeam: propCurrentTeam,
  hasLogo: propHasLogo,
  logoLoadFailed: propLogoLoadFailed,
  logoFormattedUrl: propLogoFormattedUrl,
  rawLogoUrl: propRawLogoUrl,
  setLogoLoadFailed: propSetLogoLoadFailed,
  triggerFileUpload,
  updateTeamProfile
}) {
  const compCtx = useCompetition?.() || {};
  const currentTeam = propCurrentTeam || compCtx.currentTeam;
  const activeUpdateTeamProfile = updateTeamProfile || compCtx.updateTeamProfile;

  const [internalLogoLoadFailed, setInternalLogoLoadFailed] = useState(false);
  const logoLoadFailed = propLogoLoadFailed !== undefined ? propLogoLoadFailed : internalLogoLoadFailed;
  const setLogoLoadFailed = propSetLogoLoadFailed || setInternalLogoLoadFailed;

  const rawLogoUrl = propRawLogoUrl !== undefined
    ? propRawLogoUrl
    : (currentTeam?.files?.schoolLogo?.url || currentTeam?.file_logo_sekolah || currentTeam?.logoUrl || '');
  const hasLogo = propHasLogo !== undefined
    ? propHasLogo
    : Boolean(rawLogoUrl && rawLogoUrl !== '#' && !rawLogoUrl.startsWith('#'));
  const logoFormattedUrl = propLogoFormattedUrl !== undefined
    ? propLogoFormattedUrl
    : (hasLogo ? formatImageUrl(rawLogoUrl) : '');

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [logoTheme, setLogoTheme] = useState(null);

  const teamInitials = React.useMemo(() => {
    if (!currentTeam?.schoolName) return 'LM';
    const cleaned = currentTeam.schoolName.trim().replace(/^(SD|SMP|SMA|SMK|MTs|MI)\s+/i, '').trim();
    const words = cleaned.split(/\s+/);
    if (words.length === 0 || !words[0]) return 'LM';
    if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
    return (words[0][0] + words[1][0]).toUpperCase();
  }, [currentTeam?.schoolName]);

  // Form edit profil
  const [editForm, setEditForm] = useState({
    city: currentTeam?.city || '',
    province: currentTeam?.province || '',
    platoonName: currentTeam?.platoonName || '',
    waNumber: currentTeam?.waNumber || '',
    officialName: currentTeam?.roster?.officials?.[0]?.name || currentTeam?.officialName || currentTeam?.coachName || ''
  });

  const handleOpenEdit = () => {
    if (!currentTeam) return;
    setEditForm({
      city: currentTeam.city || '',
      province: currentTeam.province || '',
      platoonName: currentTeam.platoonName || '',
      waNumber: currentTeam.waNumber || '',
      officialName: currentTeam.roster?.officials?.[0]?.name || currentTeam.officialName || currentTeam.coachName || ''
    });
    setIsEditModalOpen(true);
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!activeUpdateTeamProfile || isSaving || !currentTeam?.id) return;
    setIsSaving(true);
    try {
      await activeUpdateTeamProfile(currentTeam.id, {
        city: editForm.city.trim(),
        province: editForm.province.trim(),
        platoonName: editForm.platoonName.trim(),
        waNumber: editForm.waNumber.trim(),
        officialName: editForm.officialName.trim()
      });
      setIsEditModalOpen(false);
    } catch (err) {
      console.error('Gagal memperbarui profil peleton:', err);
      alert('Terjadi kesalahan saat menyimpan perubahan profil.');
    } finally {
      setIsSaving(false);
    }
  };

  const dantonName = currentTeam.roster?.danton?.name || currentTeam.dantonName || '-';
  const officialName = currentTeam.roster?.officials?.[0]?.name || currentTeam.officialName || currentTeam.coachName || '-';
  const waNumber = currentTeam.waNumber || '-';

  // Format Asal Daerah Sekolah: Kab/Kota sesuai yang dipilih di formulir (schoolRegion / city / address)
  const resolveKabKota = () => {
    if (currentTeam.schoolRegion) return currentTeam.schoolRegion;
    if (currentTeam.city) return currentTeam.city;
    // Deteksi jika tersimpan di address
    const addr = currentTeam.address || '';
    if (addr.includes('Kota Yogyakarta')) return 'Kota Yogyakarta';
    if (addr.includes('Bantul')) return 'Kab. Bantul';
    if (addr.includes('Sleman')) return 'Kab. Sleman';
    if (addr.includes('Kulon Progo')) return 'Kab. Kulon Progo';
    if (addr.includes('Gunungkidul') || addr.includes('Gunung Kidul')) return 'Kab. Gunungkidul';
    return 'Kota Yogyakarta';
  };

  const locationText = resolveKabKota();

  const resolveAddress = () => {
    if (currentTeam.schoolAddress && currentTeam.schoolAddress.trim()) {
      return currentTeam.schoolRegion 
        ? `${currentTeam.schoolAddress.trim()}, ${currentTeam.schoolRegion}`
        : currentTeam.schoolAddress.trim();
    }
    if (currentTeam.address && currentTeam.address.trim() && currentTeam.address.trim() !== 'Daerah Istimewa Yogyakarta') {
      return currentTeam.address.trim();
    }
    // Default address map by school name
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

  // Config status badge (Light Mode Brand UI)
  const statusConfig = {
    pending: {
      label: 'Menunggu Verifikasi',
      icon: Clock,
      theme: 'bg-amber-50 text-amber-800 border-amber-200'
    },
    registered: {
      label: 'Terdaftar',
      icon: CheckCircle2,
      theme: 'bg-blue-50 text-blue-700 border-blue-200'
    },
    revision: {
      label: 'Perlu Revisi',
      icon: AlertTriangle,
      theme: 'bg-rose-50 text-rose-700 border-rose-200'
    },
    verified: {
      label: 'Terverifikasi Sah',
      icon: ShieldCheck,
      theme: 'bg-emerald-50 text-emerald-700 border-emerald-200'
    },
    drawn: {
      label: 'Siap Tampil',
      icon: Sparkles,
      theme: 'bg-amber-50 text-amber-700 border-amber-300'
    }
  };

  const status = statusConfig[currentTeam.status] || statusConfig.registered;
  const StatusIcon = status.icon;

  const showSubtitle =
    currentTeam.platoonName &&
    currentTeam.platoonName.trim().toLowerCase() !== currentTeam.schoolName?.trim().toLowerCase() &&
    currentTeam.platoonName.trim().toLowerCase() !== `peleton ${currentTeam.schoolName?.trim().toLowerCase()}` &&
    currentTeam.platoonName.trim().toLowerCase() !== `pleton ${currentTeam.schoolName?.trim().toLowerCase()}`;

  if (!currentTeam) return null;

  return (
    <div className="profile-banner">
      <div className="profile-pattern" />

      {/* Main Content Card Container */}
      <div className="relative z-10 p-5 sm:p-7 grid gap-5 lg:grid-cols-[minmax(0,1fr)_250px] lg:items-stretch">
        {/* Sisi Kiri: Logo + Nama Sekolah + Badge Jenjang/Kategori/Daerah */}
        <div className="flex min-w-0 flex-col justify-center gap-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-5">
            {/* Logo Sekolah - Rata Kiri & Diperbesar */}
            <div className="relative shrink-0 self-start w-fit flex items-center justify-start">
              {hasLogo && !logoLoadFailed ? (
                <div className="w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center">
                  <img
                    src={logoFormattedUrl}
                    alt="Logo Sekolah"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      const fallback = getFallbackImageUrl(rawLogoUrl);
                      if (fallback && e.currentTarget.src !== fallback) {
                        e.currentTarget.src = fallback;
                      } else {
                        setLogoLoadFailed(true);
                      }
                    }}
                    className="w-full h-full object-contain filter drop-shadow-md"
                  />
                </div>
              ) : (
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl sm:rounded-[24px] flex items-center justify-center overflow-hidden bg-gradient-to-br from-red-600 to-red-800 text-white font-black text-2xl sm:text-3xl shadow-[0_14px_28px_rgba(185,28,28,0.24)] ring-4 ring-white">
                  <span>{teamInitials}</span>
                </div>
              )}

              {/* Quick Upload Button (Sleek dark circular button) */}
              <button
                type="button"
                onClick={() => {
                  if (triggerFileUpload) {
                    triggerFileUpload('schoolLogo');
                  } else {
                    handleOpenEdit();
                  }
                }}
                className="absolute -top-1 -right-1 p-1.5 rounded-full bg-slate-900/85 hover:bg-slate-950 text-white shadow-sm hover:scale-110 active:scale-95 transition-all cursor-pointer ring-2 ring-white"
                title="Ganti Logo Sekolah"
              >
                <Camera className="w-2.5 h-2.5" />
              </button>
            </div>

            {/* Nama Sekolah & Metadata */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="h-px w-5 bg-red-600 shrink-0" />
                <p className="text-[9px] font-black uppercase tracking-[0.18em] text-red-700">
                  {status.label === 'Terverifikasi Sah' ? 'Kontingen terverifikasi' : status.label}
                </p>
              </div>

              <h2 className="mt-1.5 text-xl sm:text-2xl lg:text-[28px] font-black uppercase leading-[1.12] tracking-[-0.03em] text-slate-950 max-w-3xl">
                {currentTeam.schoolName}
              </h2>

              <p className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-slate-500">
                <MapPin className="w-3.5 h-3.5 text-red-600 shrink-0" />
                <span className="font-semibold text-slate-600 truncate max-w-2xl">
                  {resolveAddress()}
                </span>
              </p>

              {/* Badges Row */}
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-[0.08em] text-slate-600">
                  Jenjang {currentTeam.jenjang}
                </span>
                <span className="rounded-full border border-red-100 bg-red-50 px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-[0.08em] text-red-700">
                  {currentTeam.category}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-[0.08em] text-emerald-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                  <span>{locationText}</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Sisi Kanan: Kartu Registrasi Gelap (Figma Luxury Card) */}
        <div className="relative flex min-h-[145px] flex-col justify-between overflow-hidden rounded-[20px] bg-slate-950 p-5 text-white shadow-[0_18px_38px_rgba(15,23,42,0.16)]">
          <div className="absolute -right-10 -top-14 h-36 w-36 rounded-full border-[22px] border-white/[0.04] pointer-events-none" />
          <div className="relative flex items-start justify-between">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-600 text-white shadow-md">
              <Shield className="w-4 h-4" />
            </span>
            <button
              type="button"
              onClick={handleOpenEdit}
              className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.06] px-2.5 py-1.5 text-[8px] font-black text-slate-300 transition hover:bg-white/10 hover:text-white cursor-pointer"
            >
              <Edit3 className="w-3 h-3" />
              <span>Edit profil</span>
            </button>
          </div>
          <div className="relative mt-2">
            <p className="text-[8px] font-black uppercase tracking-[0.18em] text-slate-400">
              Kode registrasi
            </p>
            <p className="mt-1 text-base font-black tracking-[0.08em] font-mono text-white">
              {currentTeam.regCode || 'LBB27-SD-01-SDM'}
            </p>
            <p className="mt-1.5 flex items-center gap-1.5 text-[8px] font-bold text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              <span>Registrasi aktif</span>
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Bar: Personel & Kontak (3 Kolom Elegan Persis Referensi) */}
      <div className="relative grid border-t border-slate-200/80 bg-slate-50/70 sm:grid-cols-3">
        {[
          { icon: Users, label: 'Komandan Peleton', value: dantonName },
          { icon: Shield, label: 'Official / Pendamping', value: officialName },
          { icon: Phone, label: 'WhatsApp Tim', value: waNumber, isPhone: true },
        ].map((item, index) => {
          const ItemIcon = item.icon;
          if (!currentTeam) return null;

  return (
            <div
              key={item.label}
              className={`flex items-center gap-3 px-5 py-3.5 sm:px-6 ${
                index < 2 ? 'border-b border-slate-200/80 sm:border-b-0 sm:border-r' : ''
              }`}
            >
              <span className="icon-well">
                <ItemIcon className="w-4 h-4" />
              </span>
              <div className="min-w-0">
                <p className="text-[8px] font-black uppercase tracking-[0.12em] text-slate-400">
                  {item.label}
                </p>
                <p
                  className={`mt-0.5 truncate text-[11px] sm:text-xs font-black ${
                    item.isPhone ? 'text-emerald-700 font-mono' : 'text-slate-900'
                  }`}
                >
                  {item.value}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Edit Profil Peleton */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            {/* Header Modal */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
                  <Edit3 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">Edit Profil Peleton</h3>
                  <p className="text-xs text-slate-500">Perbarui identitas & kontak resmi tim</p>
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

            {/* Form Fields */}
            <form onSubmit={handleSaveProfile} className="space-y-3.5">
              {/* Asal Kab / Kota */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Kabupaten / Kota Asal Sekolah
                </label>
                <div className="relative">
                  <select
                    value={editForm.city || editForm.schoolRegion || 'Kota Yogyakarta'}
                    onChange={(e) => setEditForm(prev => ({ ...prev, city: e.target.value, schoolRegion: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-red-600 focus:bg-white focus:ring-1 focus:ring-red-600 cursor-pointer font-medium"
                  >
                    <option value="Kota Yogyakarta">Kota Yogyakarta</option>
                    <option value="Kab. Bantul">Kab. Bantul</option>
                    <option value="Kab. Sleman">Kab. Sleman</option>
                    <option value="Kab. Kulon Progo">Kab. Kulon Progo</option>
                    <option value="Kab. Gunungkidul">Kab. Gunungkidul</option>
                  </select>
                </div>
              </div>

              {/* Nama Pasukan / Peleton */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Nama Peleton / Julukan Pasukan
                </label>
                <input
                  type="text"
                  value={editForm.platoonName}
                  onChange={(e) => setEditForm(prev => ({ ...prev, platoonName: e.target.value }))}
                  placeholder={`Contoh: Peleton ${currentTeam.schoolName}`}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-red-600 focus:bg-white focus:ring-1 focus:ring-red-600 font-medium"
                />
              </div>

              {/* Nama Official / Pendamping */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Nama Official / Pendamping Utama
                </label>
                <input
                  type="text"
                  value={editForm.officialName}
                  onChange={(e) => setEditForm(prev => ({ ...prev, officialName: e.target.value }))}
                  placeholder="Nama lengkap pendamping/pembina"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-red-600 focus:bg-white focus:ring-1 focus:ring-red-600 font-medium"
                />
              </div>

              {/* Nomor WhatsApp Tim */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  No. WhatsApp Aktif (Official/Danton)
                </label>
                <input
                  type="tel"
                  value={editForm.waNumber}
                  onChange={(e) => setEditForm(prev => ({ ...prev, waNumber: e.target.value }))}
                  placeholder="Contoh: 081234567890"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-red-600 focus:bg-white focus:ring-1 focus:ring-red-600 font-mono font-medium"
                />
              </div>

              {/* Action Buttons */}
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
                  className="inline-flex items-center gap-1.5 px-4.5 py-2 rounded-xl bg-red-700 hover:bg-red-800 text-white text-xs font-bold shadow-xs hover:shadow-sm transition-all cursor-pointer disabled:opacity-50"
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
    </div>
  );
}
