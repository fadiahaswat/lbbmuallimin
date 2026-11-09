import React, { useState } from 'react';
import {
  Camera,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ShieldCheck,
  User,
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
import { getFallbackImageUrl } from '../../../../services/sheetService.js';
import { extractLogoTheme } from '../../../../utils/extractLogoColor.js';

export default function TeamProfileHeader({
  currentTeam,
  hasLogo,
  logoLoadFailed,
  logoFormattedUrl,
  rawLogoUrl,
  setLogoLoadFailed,
  triggerFileUpload,
  updateTeamProfile
}) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [logoTheme, setLogoTheme] = useState(null);

  // Dynamic School Logo Theme Extraction (Menyesuaikan wadah/kartu secara otomatis)
  React.useEffect(() => {
    let isCancelled = false;
    const targetUrl = hasLogo && !logoLoadFailed ? logoFormattedUrl || rawLogoUrl : null;
    extractLogoTheme(targetUrl, currentTeam?.schoolName).then((theme) => {
      if (!isCancelled && theme) {
        setLogoTheme(theme);
      }
    });
    return () => {
      isCancelled = true;
    };
  }, [hasLogo, logoLoadFailed, logoFormattedUrl, rawLogoUrl, currentTeam?.schoolName]);

  // Form edit profil
  const [editForm, setEditForm] = useState({
    city: currentTeam.city || '',
    province: currentTeam.province || '',
    platoonName: currentTeam.platoonName || '',
    waNumber: currentTeam.waNumber || '',
    officialName: currentTeam.roster?.officials?.[0]?.name || currentTeam.officialName || currentTeam.coachName || ''
  });

  const handleOpenEdit = () => {
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
    if (!updateTeamProfile || isSaving) return;
    setIsSaving(true);
    try {
      await updateTeamProfile(currentTeam.id, {
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

  return (
    <div
      className="relative overflow-hidden rounded-2xl sm:rounded-3xl border shadow-xs transition-all duration-500"
      style={{
        background: logoTheme?.cardBackground || '#ffffff',
        borderColor: logoTheme?.cardBorder || 'rgba(226, 232, 240, 0.9)',
        boxShadow: logoTheme?.cardShadow || '0 10px 25px -5px rgba(0, 0, 0, 0.05)',
      }}
    >
      {/* Dynamic Ambient Glow from Logo Color */}
      {logoTheme?.ambientGlow && (
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-700"
          style={{ background: logoTheme.ambientGlow }}
        />
      )}

      {/* Brand Top Accent Stripe (Harmonized with School Logo Palette) */}
      <div
        className="h-1.5 w-full transition-all duration-500"
        style={{
          background: logoTheme?.accentStripe || 'linear-gradient(90deg, #8B0000 0%, #f59e0b 50%, #8B0000 100%)',
        }}
      />

      {/* Main Content Card Container */}
      <div className="relative z-10 p-4 sm:p-5 lg:p-6 space-y-3.5 sm:space-y-4">
        
        {/* Top Header: Identity & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
          
          {/* Sisi Kiri: Logo + Nama Sekolah + Badge Jenjang/Kategori/Daerah */}
          <div className="flex items-center gap-3.5 sm:gap-4.5 min-w-0 flex-1">
            {/* Logo Sekolah Avatar */}
            <div className="relative shrink-0">
              <div
                className="w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-2xl p-1.5 sm:p-2 flex items-center justify-center overflow-hidden shadow-xs ring-1 transition-all duration-500"
                style={{
                  backgroundColor: logoTheme?.avatarBg || '#f8fafc',
                  borderColor: logoTheme?.avatarRing || '#e2e8f0',
                  borderWidth: '1px',
                  borderStyle: 'solid',
                }}
              >
                {hasLogo && !logoLoadFailed ? (
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
                    className="w-full h-full object-contain filter drop-shadow-xs"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-center p-1">
                    <School className="w-6 h-6 text-slate-400 mb-0.5" />
                    <span className="text-[9px] uppercase font-black text-slate-500 tracking-wider">
                      {currentTeam.jenjang || 'LBB'}
                    </span>
                  </div>
                )}
              </div>

              {/* Quick Upload Button */}
              <button
                onClick={() => triggerFileUpload('schoolLogo')}
                className="absolute -bottom-1 -right-1 p-1 sm:p-1.5 rounded-lg sm:rounded-xl bg-amber-400 text-slate-950 shadow-xs hover:bg-amber-300 hover:scale-105 active:scale-95 transition-all cursor-pointer ring-2 ring-white"
                title="Ganti Logo Sekolah"
              >
                <Camera className="w-3 h-3" />
              </button>
            </div>

            {/* Nama Sekolah & Metadata */}
            <div className="min-w-0 flex-1">
              {/* Badge Metadata */}
              <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                  Tingkat {currentTeam.jenjang}
                </span>
                <span className="text-xs font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded-md border border-red-200">
                  {currentTeam.category}
                </span>

                {/* Badge Asal Kota/Kabupaten */}
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  <MapPin className="w-3 h-3 text-emerald-600 shrink-0" />
                  <span className="truncate max-w-[220px]">{locationText}</span>
                </span>
              </div>

              <h1 className="text-lg sm:text-xl lg:text-2xl font-black text-slate-900 uppercase tracking-tight leading-snug line-clamp-2">
                {currentTeam.schoolName}
              </h1>

              {showSubtitle && (
                <p
                  className="text-xs sm:text-sm font-black mt-0.5 truncate transition-colors duration-500 flex items-center gap-1.5"
                  style={{ color: logoTheme?.accentText || '#b45309' }}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full inline-block"
                    style={{ backgroundColor: logoTheme?.accentText || '#b45309' }}
                  />
                  <span>{currentTeam.platoonName}</span>
                </p>
              )}
            </div>
          </div>

          {/* Sisi Kanan: Status Badge & Tombol Edit Profil Peleton */}
          <div className="shrink-0 flex items-center gap-2 sm:gap-2.5 justify-start sm:justify-end flex-wrap sm:flex-nowrap">
            {/* Tombol Edit Profil */}
            <button
              type="button"
              onClick={handleOpenEdit}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-950 border border-slate-200 text-[11px] sm:text-xs font-bold transition-all shadow-2xs cursor-pointer active:scale-95"
              title="Edit Profil Peleton"
            >
              <Edit3 className="w-3.5 h-3.5 text-slate-600" />
              <span>Edit Profil</span>
            </button>

            {/* Status Badge Mandiri */}
            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[11px] sm:text-xs font-bold uppercase tracking-wider shadow-2xs ${status.theme}`}>
              <StatusIcon className="w-3.5 h-3.5" />
              <span>{status.label}</span>
            </span>
          </div>

        </div>

        {/* Bottom Bar: Personel & Kontak (Data Table / Grid Elegan dengan Tint Logo) */}
        <div
          className="rounded-xl sm:rounded-2xl border p-2.5 sm:p-3 grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3 divide-y sm:divide-y-0 sm:divide-x divide-slate-200/80 transition-all duration-500"
          style={{
            background: logoTheme?.subtleBoxBg || 'rgba(248, 250, 252, 0.8)',
            borderColor: logoTheme?.subtleBoxBorder || 'rgba(226, 232, 240, 0.8)',
          }}
        >
          {/* Danton */}
          <div className="flex items-center gap-2.5 sm:px-2 pt-1 sm:pt-0">
            <div className="w-8 h-8 rounded-lg bg-amber-100/80 border border-amber-200/80 flex items-center justify-center shrink-0">
              <User className="w-4 h-4 text-amber-700" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block leading-tight">
                Komandan Peleton
              </span>
              <span className="text-xs sm:text-sm font-black text-slate-900 truncate block">
                {dantonName}
              </span>
            </div>
          </div>

          {/* Official */}
          <div className="flex items-center gap-2.5 sm:px-2 pt-2 sm:pt-0">
            <div className="w-8 h-8 rounded-lg bg-blue-100/80 border border-blue-200/80 flex items-center justify-center shrink-0">
              <Shield className="w-4 h-4 text-blue-700" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block leading-tight">
                Official / Pendamping
              </span>
              <span className="text-xs sm:text-sm font-black text-slate-900 truncate block">
                {officialName}
              </span>
            </div>
          </div>

          {/* WhatsApp */}
          <div className="flex items-center gap-2.5 sm:px-2 pt-2 sm:pt-0">
            <div className="w-8 h-8 rounded-lg bg-emerald-100/80 border border-emerald-200/80 flex items-center justify-center shrink-0">
              <Phone className="w-4 h-4 text-emerald-700" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block leading-tight">
                No. WhatsApp Tim
              </span>
              <span className="text-xs sm:text-sm font-mono font-black text-emerald-700 truncate block">
                {waNumber}
              </span>
            </div>
          </div>
        </div>

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
