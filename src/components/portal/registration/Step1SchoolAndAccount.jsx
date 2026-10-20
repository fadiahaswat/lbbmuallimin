import React, { useState } from 'react';
import {
  School,
  Mail,
  Lock,
  Building2,
  ChevronDown,
  MapPin,
  ImageIcon,
  UploadCloud,
  Check,
  Loader2,
  Users,
  UserCheck,
  ArrowRight
} from 'lucide-react';
import { GOOGLE_AUTH } from '../../../config.js';

export default function Step1SchoolAndAccount({
  formData,
  setFormData,
  files,
  handleFileChange,
  quotaSD,
  quotaSMP,
  registeredSD,
  registeredSMP,
  isSDFull,
  isSMPFull,
  getFullSchoolName,
  handleNext
}) {
  const [isConnectingGoogle, setIsConnectingGoogle] = useState(false);
  const [googleConnectError, setGoogleConnectError] = useState('');

  const clientId = GOOGLE_AUTH.CLIENT_ID;

  const handleConnectGoogle = () => {
    setGoogleConnectError('');

    if (!window.google?.accounts?.oauth2) {
      setGoogleConnectError('Layanan Google SDK sedang memuat, silakan tunggu beberapa detik dan coba lagi.');
      return;
    }

    setIsConnectingGoogle(true);

    try {
      const client = window.google.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope: 'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile openid',
        callback: async (tokenResponse) => {
          if (tokenResponse.error) {
            setIsConnectingGoogle(false);
            if (tokenResponse.error !== 'popup_closed_by_user') {
              setGoogleConnectError(`Gagal menghubungkan Google: ${tokenResponse.error_description || tokenResponse.error}`);
            }
            return;
          }

          try {
            const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
              headers: {
                Authorization: `Bearer ${tokenResponse.access_token}`,
              },
            });

            const googleProfile = await userInfoResponse.json();

            if (!googleProfile.email) {
              setIsConnectingGoogle(false);
              setGoogleConnectError('Tidak dapat membaca alamat email dari akun Google Anda.');
              return;
            }

            const cleanEmail = googleProfile.email.toLowerCase();
            setFormData(prev => ({ ...prev, email: cleanEmail }));
            setIsConnectingGoogle(false);
          } catch (apiErr) {
            setIsConnectingGoogle(false);
            setGoogleConnectError('Gagal mengambil data akun dari server Google.');
          }
        },
      });

      client.requestAccessToken({ prompt: 'select_account' });
    } catch (err) {
      setIsConnectingGoogle(false);
      setGoogleConnectError('Gagal membuka popup Google: ' + err.message);
    }
  };

  return (
    <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-9 shadow-sm hover:shadow-md transition-shadow space-y-6 animate-fade">
      <div className="border-b border-slate-100 pb-4 flex items-start gap-3.5">
        <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center text-red-700 shrink-0">
          <School className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg sm:text-xl font-black text-slate-900 uppercase tracking-wide">
            1. Identitas Sekolah, Akun & Tipe Pasukan
          </h2>
          <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
            Lengkapi data dasar sekolah, email aktif untuk akses login calon peserta, dan tipe peleton.
          </p>
        </div>
      </div>

      <div className="space-y-5">
        {/* 1. Email aktif untuk akun */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5 text-red-600" />
            <span>
              1. Email Aktif untuk Akun Portal <span className="text-red-600 font-bold">*</span>
            </span>
          </label>

          {formData.email ? (
            <div className="flex items-center gap-2">
              <div className="flex-1 flex items-center gap-2.5 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 overflow-hidden">
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                  />
                </svg>
                <span className="truncate">{formData.email}</span>
              </div>
              <button
                type="button"
                onClick={handleConnectGoogle}
                disabled={isConnectingGoogle}
                className="px-4 py-3 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl transition-colors cursor-pointer shrink-0 disabled:opacity-50"
              >
                {isConnectingGoogle ? 'Memuat...' : 'Ganti Akun'}
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleConnectGoogle}
              disabled={isConnectingGoogle}
              className="w-full py-3.5 px-4 bg-white hover:bg-slate-50 border-2 border-dashed border-slate-300 hover:border-slate-400 rounded-xl text-sm font-semibold text-slate-700 hover:text-slate-900 flex items-center justify-center gap-2.5 transition-all cursor-pointer disabled:opacity-60"
            >
              {isConnectingGoogle ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-slate-600" />
                  <span>Menghubungkan ke Google...</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                    />
                  </svg>
                  <span>Pilih Akun Google</span>
                </>
              )}
            </button>
          )}

          {googleConnectError && (
            <p className="mt-1 text-xs text-red-600">{googleConnectError}</p>
          )}

          <div className="mt-2 p-2.5 rounded-xl bg-amber-50/80 border border-amber-200/80 flex items-start gap-2">
            <Lock className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
            <span className="text-[11px] text-amber-800 leading-relaxed">
              Wajib menggunakan Akun Google. Akses masuk ke portal akun resmi hanya dapat dilakukan melalui Akun Google yang terhubung setelah pendaftaran di-ACC oleh Admin.
            </span>
          </div>
        </div>

        {/* 2. Jenjang Sekolah */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
            2. Jenjang Sekolah <span className="text-red-600 font-bold">*</span>
          </label>
          <div className="grid grid-cols-2 gap-3.5">
            {[
              {
                id: 'SD',
                label: 'Tingkat SD / MI',
                badge: isSDFull ? 'KUOTA PENUH' : `Sisa ${Math.max(0, quotaSD - registeredSD)} Slot`,
                isFull: isSDFull,
                icon: School,
                activeClass: 'bg-red-700 border-red-700 text-white shadow-xs',
                activeBadge: isSDFull ? 'bg-red-200 text-red-800' : 'bg-white/20 text-white border border-white/20',
                hoverBorder: 'hover:border-red-300 hover:text-red-700',
              },
              {
                id: 'SMP',
                label: 'Tingkat SMP / MTs',
                badge: isSMPFull ? 'KUOTA PENUH' : `Sisa ${Math.max(0, quotaSMP - registeredSMP)} Slot`,
                isFull: isSMPFull,
                icon: Building2,
                activeClass: 'bg-blue-700 border-blue-700 text-white shadow-xs',
                activeBadge: isSMPFull ? 'bg-rose-200 text-rose-900' : 'bg-white/20 text-white border border-white/20',
                hoverBorder: 'hover:border-blue-300 hover:text-blue-700',
              },
            ].map(item => {
              const isSelected = formData.jenjang === item.id;
              const IconComponent = item.icon;
              return (
                <button
                  key={item.id}
                  type="button"
                  disabled={item.isFull}
                  onClick={() => {
                    if (item.isFull) return;
                    setFormData({ ...formData, jenjang: item.id });
                  }}
                  className={`py-3.5 px-4 rounded-2xl border text-center transition-all duration-200 font-black text-xs sm:text-sm flex flex-col items-center justify-center gap-1.5 ${
                    item.isFull
                      ? 'bg-slate-100 border-slate-300 text-slate-400 cursor-not-allowed opacity-75'
                      : isSelected
                      ? item.activeClass
                      : `bg-white border-slate-200 text-slate-600 ${item.hoverBorder} hover:text-slate-900 cursor-pointer`
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <IconComponent className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </div>
                  <span
                    className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                      item.isFull
                        ? 'bg-red-100 text-red-700 font-black border border-red-200'
                        : isSelected
                        ? item.activeBadge
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {item.badge}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Nama Sekolah & Pembeda Peleton (Tim A / Tim B) */}
        <div className="space-y-2">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                3. Nama Resmi Sekolah <span className="text-red-600 font-bold">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="CONTOH: MTS MU'ALLIMIN YOGYAKARTA"
                value={formData.schoolName}
                onChange={e => setFormData({ ...formData, schoolName: e.target.value.toUpperCase() })}
                className="w-full px-4 py-3 bg-slate-50 hover:bg-white border border-slate-200 focus:border-red-600 focus:bg-white focus:ring-2 focus:ring-red-600/10 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 transition-all outline-none font-medium uppercase"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center justify-between">
                <span>Pembeda Peleton</span>
                <span className="text-[10px] text-slate-400 font-normal lowercase">Maks. 2 tim</span>
              </label>
              <div className="relative">
                <select
                  value={formData.teamUnit}
                  onChange={e => setFormData({ ...formData, teamUnit: e.target.value })}
                  className="w-full px-3.5 py-3 bg-slate-50 hover:bg-white border border-slate-200 focus:border-red-600 focus:bg-white focus:ring-2 focus:ring-red-600/10 rounded-xl text-sm font-bold text-slate-900 transition-all outline-none cursor-pointer appearance-none uppercase"
                >
                  <option value="Tunggal">Peleton Tunggal</option>
                  <option value="Tim A">Peleton A</option>
                  <option value="Tim B">Peleton B</option>
                </select>
                <ChevronDown className="w-4 h-4 text-slate-500 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Live Preview Label Format Terdaftar */}
          {formData.schoolName.trim() && (
            <div className="flex items-center gap-2 px-3.5 py-2 bg-red-50/80 border border-red-100 rounded-xl text-xs text-slate-700 animate-fade">
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 bg-red-700 text-white rounded-md shrink-0">
                Format Terdaftar:
              </span>
              <span className="font-bold text-red-950 truncate">
                {getFullSchoolName()}
              </span>
            </div>
          )}

          {/* Input Alamat Sekolah & Pilihan Wilayah D.I. Yogyakarta */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-red-600" />
                <span>Alamat Lengkap Sekolah <span className="text-red-600 font-bold">*</span></span>
              </label>
              <input
                type="text"
                required
                placeholder="Contoh: Jl. Letjen S. Parman No. 68, Patangpuluhan, Wirobrajan"
                value={formData.schoolAddress}
                onChange={e => setFormData({ ...formData, schoolAddress: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 hover:bg-white border border-slate-200 focus:border-red-600 focus:bg-white focus:ring-2 focus:ring-red-600/10 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 transition-all outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center justify-between">
                <span>Wilayah / Daerah <span className="text-red-600 font-bold">*</span></span>
              </label>
              <div className="relative">
                <select
                  value={formData.schoolRegion}
                  onChange={e => setFormData({ ...formData, schoolRegion: e.target.value })}
                  className="w-full px-3.5 py-3 bg-slate-50 hover:bg-white border border-slate-200 focus:border-red-600 focus:bg-white focus:ring-2 focus:ring-red-600/10 rounded-xl text-sm font-bold text-slate-900 transition-all outline-none cursor-pointer appearance-none"
                >
                  <option value="Kota Yogyakarta">Kota Yogyakarta</option>
                  <option value="Kab. Bantul">Kab. Bantul</option>
                  <option value="Kab. Sleman">Kab. Sleman</option>
                  <option value="Kab. Kulon Progo">Kab. Kulon Progo</option>
                  <option value="Kab. Gunungkidul">Kab. Gunungkidul</option>
                </select>
                <ChevronDown className="w-4 h-4 text-slate-500 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* 4. Upload Logo Sekolah */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1.5">
            <ImageIcon className="w-3.5 h-3.5 text-red-600" />
            <span>
              4. Upload Logo Sekolah (Format Gambar) <span className="text-red-600 font-bold">*</span>
            </span>
          </label>
          <div className="p-4 bg-slate-50/70 border-2 border-dashed border-slate-200 hover:border-red-400 rounded-2xl transition-all text-center group">
            {files.schoolLogo ? (
              <div className="flex items-center justify-between bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
                <div className="flex items-center gap-3.5">
                  <img
                    src={files.schoolLogo.url}
                    alt="Logo Preview"
                    className="w-12 h-12 object-contain bg-slate-50 rounded-lg p-1 border border-slate-100"
                  />
                  <div className="text-left">
                    <p className="text-xs font-bold text-slate-900 truncate max-w-xs">{files.schoolLogo.name}</p>
                    <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1 mt-0.5">
                      <Check className="w-3 h-3 text-emerald-600 stroke-[3]" />
                      <span>Siap diunggah ({files.schoolLogo.size})</span>
                    </span>
                  </div>
                </div>
                <label className="cursor-pointer text-xs font-bold text-red-700 hover:text-red-800 px-3.5 py-1.5 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-colors">
                  Ganti
                  <input
                    type="file"
                    accept="image/*"
                    onChange={e => handleFileChange('schoolLogo', e)}
                    className="hidden"
                  />
                </label>
              </div>
            ) : (
              <label className="cursor-pointer flex flex-col items-center justify-center py-5">
                <div className="w-11 h-11 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center text-red-700 mb-2 group-hover:scale-105 transition-transform">
                  <UploadCloud className="w-5 h-5 text-red-700" />
                </div>
                <span className="text-xs font-bold text-slate-800">Klik untuk memilih file Logo Sekolah</span>
                <span className="text-[11px] text-slate-500 mt-1">Disarankan format PNG transparan (Maks. 3 MB)</span>
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/jpg"
                  onChange={e => handleFileChange('schoolLogo', e)}
                  className="hidden"
                />
              </label>
            )}
          </div>
        </div>

        {/* 5. Homogen apa Heterogen */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
            5. Tipe Pasukan Peleton <span className="text-red-600 font-bold">*</span>
          </label>
          <div className="grid grid-cols-2 gap-3.5">
            {[
              { id: 'Homogen', title: 'Homogen', desc: 'Seluruh personil sejenis (Putra semua / Putri semua)' },
              { id: 'Heterogen', title: 'Heterogen', desc: 'Personil campuran (Kombinasi Putra & Putri)' },
            ].map(t => {
              const isSelected = formData.teamType === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, teamType: t.id })}
                  className={`p-4 rounded-2xl border text-left transition-all duration-200 ${
                    isSelected
                      ? 'bg-slate-900 border border-slate-900 text-white shadow-xs'
                      : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <span className={`text-xs font-black uppercase block ${isSelected ? 'text-white' : 'text-slate-800'}`}>
                    {t.title}
                  </span>
                  <span className={`text-[11px] mt-1 block leading-relaxed ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>{t.desc}</span>
                </button>
              );
            })}
          </div>

          {/* Pilihan Khusus Pasukan Homogen: Putra atau Putri */}
          {formData.teamType === 'Homogen' && (
            <div className="mt-3.5 p-4 sm:p-5 bg-gradient-to-b from-slate-50 to-white rounded-2xl border border-slate-200/90 shadow-xs animate-fade">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3.5 pb-2.5 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-red-100/80 flex items-center justify-center text-red-700 shrink-0 shadow-xs">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <label className="text-xs font-black uppercase tracking-wider text-slate-900 block leading-tight">
                      Pilihan Pasukan Homogen <span className="text-red-600 font-bold">*</span>
                    </label>
                    <span className="text-[11px] text-slate-500">
                      Pilih komposisi jenis kelamin seluruh personil peleton
                    </span>
                  </div>
                </div>
                {formData.homogenGender ? (
                  <span className={`self-start sm:self-center text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full border transition-all ${
                    formData.homogenGender === 'Putri'
                      ? 'bg-red-50 text-red-700 border-red-200'
                      : 'bg-slate-100 text-slate-800 border-slate-200'
                  }`}>
                    {formData.homogenGender === 'Putri' ? 'Peleton Putri' : 'Peleton Putra'}
                  </span>
                ) : (
                  <span className="self-start sm:self-center text-[10px] font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200">
                    Belum dipilih
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  {
                    id: 'Putra',
                    label: 'Pasukan Putra',
                    tag: 'Putra Semua',
                    desc: 'Seluruh 25 personil peleton adalah siswa putra',
                    avatarBg: 'bg-slate-900 text-yellow-400',
                  },
                  {
                    id: 'Putri',
                    label: 'Pasukan Putri',
                    tag: 'Putri Semua',
                    desc: 'Seluruh 25 personil peleton adalah siswi putri',
                    avatarBg: 'bg-red-700 text-white',
                  },
                ].map(g => {
                  const isGenderActive = formData.homogenGender === g.id;
                  return (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, homogenGender: g.id })}
                      className={`p-4 rounded-2xl border text-left transition-all duration-200 relative group flex items-start gap-3.5 ${
                        isGenderActive
                          ? 'bg-slate-900 border border-slate-900 text-white shadow-xs'
                          : 'bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      <div
                        className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 shadow-xs ${
                          isGenderActive
                            ? g.avatarBg
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        <UserCheck className="w-5 h-5" />
                      </div>

                      <div className="flex-1 min-w-0 pr-6">
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-xs sm:text-sm font-black uppercase tracking-tight block ${
                              isGenderActive ? 'text-white' : 'text-slate-800'
                            }`}
                          >
                            {g.label}
                          </span>
                          <span
                            className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded ${
                              isGenderActive
                                ? 'bg-red-700 text-white'
                                : 'bg-slate-200/70 text-slate-600'
                            }`}
                          >
                            {g.tag}
                          </span>
                        </div>
                        <p className={`text-[11px] mt-1 leading-snug ${
                          isGenderActive ? 'text-slate-300' : 'text-slate-500'
                        }`}>
                          {g.desc}
                        </p>
                      </div>

                      <div className="absolute top-4 right-4">
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                            isGenderActive
                              ? 'border-red-700 bg-red-700 text-white shadow-xs'
                              : 'border-slate-300 bg-white'
                          }`}
                        >
                          {isGenderActive && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="pt-4 flex justify-end border-t border-slate-100">
        <button
          type="button"
          onClick={handleNext}
          className="px-7 py-3 bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 hover:from-yellow-300 hover:to-amber-400 text-slate-950 font-black rounded-xl shadow-md text-xs sm:text-sm uppercase tracking-wider flex items-center gap-2 active:scale-95 transition-all"
        >
          <span>Lanjut ke Danton & Official</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
