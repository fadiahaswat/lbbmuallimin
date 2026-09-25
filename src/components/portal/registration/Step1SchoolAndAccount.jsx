import React from 'react';
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
  Users,
  UserCheck,
  ArrowRight
} from 'lucide-react';

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
  return (
    <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-9 shadow-sm hover:shadow-md transition-shadow space-y-6 animate-fade">
      <div className="border-b border-slate-100 pb-4 flex items-start gap-3.5">
        <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center text-red-700 shrink-0">
          <School className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg sm:text-xl font-black text-slate-900 uppercase italic tracking-wide">
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
          <input
            type="email"
            required
            placeholder="contoh: tonti.mtsmuallimin@gmail.com"
            value={formData.email}
            onChange={e => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-4 py-3 bg-slate-50 hover:bg-white border border-slate-200 focus:border-red-600 focus:bg-white focus:ring-2 focus:ring-red-600/10 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 transition-all outline-none"
          />
          <div className="mt-2 p-2.5 rounded-xl bg-amber-50/80 border border-amber-200/80 flex items-start gap-2">
            <Lock className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
            <span className="text-[11px] text-amber-800 leading-relaxed">
              Gunakan akun email Google aktif. Akses masuk ke portal akun resmi hanya dapat dilakukan melalui Akun Google setelah pendaftaran di-ACC oleh Admin.
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
                activeClass: 'bg-red-50 border-2 border-red-700 text-red-900 shadow-xs ring-2 ring-red-600/10',
                activeIcon: 'text-red-700',
                activeBadge: isSDFull ? 'bg-red-200 text-red-800' : 'bg-red-100 text-red-800 border border-red-200',
                hoverBorder: 'hover:border-red-300',
              },
              {
                id: 'SMP',
                label: 'Tingkat SMP / MTs',
                badge: isSMPFull ? 'KUOTA PENUH' : `Sisa ${Math.max(0, quotaSMP - registeredSMP)} Slot`,
                isFull: isSMPFull,
                activeClass: 'bg-blue-50 border-2 border-blue-600 text-blue-950 shadow-xs ring-2 ring-blue-600/10',
                activeIcon: 'text-blue-600',
                activeBadge: isSMPFull ? 'bg-rose-200 text-rose-900' : 'bg-blue-100 text-blue-800 border border-blue-200',
                hoverBorder: 'hover:border-blue-300',
              },
            ].map(item => {
              const isSelected = formData.jenjang === item.id;
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
                      : `bg-white border border-slate-200 text-slate-600 ${item.hoverBorder} hover:text-slate-900 cursor-pointer`
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Building2 className={`w-4 h-4 ${isSelected ? item.activeIcon : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
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
                <span className="text-[11px] text-slate-500 mt-1">Format PNG, JPG, JPEG (Maks. 3 MB)</span>
                <input
                  type="file"
                  accept="image/*"
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
                      ? 'bg-red-50 border-2 border-red-700 shadow-xs ring-2 ring-red-600/10'
                      : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <span className={`text-xs font-black uppercase block ${isSelected ? 'text-red-800' : 'text-slate-800'}`}>
                    {t.title}
                  </span>
                  <span className="text-[11px] text-slate-500 mt-1 block leading-relaxed">{t.desc}</span>
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
                    {formData.homogenGender === 'Putri' ? '👧 Peleton Putri' : '👦 Peleton Putra'}
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
                          ? 'bg-white border-2 border-red-700 shadow-sm ring-2 ring-red-600/10'
                          : 'bg-slate-50/70 hover:bg-white border border-slate-200/90 text-slate-600 hover:border-slate-300'
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
                              isGenderActive ? 'text-slate-950' : 'text-slate-700'
                            }`}
                          >
                            {g.label}
                          </span>
                          <span
                            className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded ${
                              isGenderActive
                                ? 'bg-red-100 text-red-800'
                                : 'bg-slate-200/70 text-slate-600'
                            }`}
                          >
                            {g.tag}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-1 leading-snug">
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
