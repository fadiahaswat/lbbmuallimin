import React from 'react';
import {
  Users,
  UserCheck,
  FileUp,
  FileText,
  UploadCloud,
  Check,
  ShieldCheck,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';

export default function Step2DantonAndOfficial({
  formData,
  setFormData,
  files,
  handleFileChange,
  handleBack,
  handleNext
}) {
  return (
    <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-9 shadow-sm hover:shadow-md transition-shadow space-y-6 animate-fade">
      <div className="border-b border-slate-100 pb-4 flex items-start gap-3.5">
        <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center text-red-700 shrink-0">
          <Users className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg sm:text-xl font-black text-slate-900 uppercase italic tracking-wide">
            2. Komandan Peleton & Official Pelatih
          </h2>
          <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
            Lengkapi identitas komandan peleton beserta kartu pelajar, serta data pelatih/official dengan KTP.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Box Komandan (Danton) */}
        <div className="p-5 sm:p-6 bg-slate-50/80 rounded-2xl border border-slate-200 space-y-4">
          <div className="flex items-center gap-2 text-slate-800 font-black text-xs uppercase tracking-wider bg-white border border-slate-200 px-3 py-1.5 rounded-xl w-fit shadow-xs">
            <UserCheck className="w-4 h-4 text-red-600" />
            <span>Data Komandan Peleton (Danton)</span>
          </div>

          {/* 6. Nama Komandan */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              6. Nama Komandan Peleton (Danton) <span className="text-red-600 font-bold">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="NAMA LENGKAP KOMANDAN SISWA"
              value={formData.dantonName}
              onChange={e => setFormData({ ...formData, dantonName: e.target.value.toUpperCase() })}
              className="w-full px-4 py-3 bg-white border border-slate-200 focus:border-red-600 focus:ring-2 focus:ring-red-600/10 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 transition-all outline-none uppercase font-medium"
            />
          </div>

          {/* 7. Upload Kartu Pelajar Komandan */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1.5">
              <FileUp className="w-3.5 h-3.5 text-red-600" />
              <span>
                7. Upload Kartu Pelajar Komandan (Foto / PDF) <span className="text-red-600 font-bold">*</span>
              </span>
            </label>
            <div className="p-3.5 bg-white border-2 border-dashed border-slate-200 hover:border-red-400 rounded-2xl transition-all">
              {files.dantonCard ? (
                <div className="flex items-center justify-between p-2.5 bg-slate-50/80 rounded-xl border border-slate-200">
                  <div className="flex items-center gap-3 min-w-0">
                    {files.dantonCard.url && files.dantonCard.url.startsWith('data:image') ? (
                      <img
                        src={files.dantonCard.url}
                        alt="Preview Kartu Pelajar"
                        className="w-12 h-12 sm:w-14 sm:h-14 object-cover rounded-lg border border-slate-200 shadow-xs shrink-0 bg-white"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-red-100 border border-red-200 flex items-center justify-center text-red-700 shrink-0">
                        <FileText className="w-6 h-6" />
                      </div>
                    )}
                    <div className="min-w-0 text-left">
                      <span className="text-xs font-bold text-slate-900 truncate block">
                        {files.dantonCard.name}
                      </span>
                      <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-0.5">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                        <span>Berhasil diunggah ({files.dantonCard.size})</span>
                      </span>
                    </div>
                  </div>
                  <label className="cursor-pointer text-xs font-bold text-red-700 hover:text-red-800 px-3.5 py-1.5 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-colors shrink-0 ml-2">
                    Ganti File
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={e => handleFileChange('dantonCard', e)}
                      className="hidden"
                    />
                  </label>
                </div>
              ) : (
                <label className="cursor-pointer flex items-center justify-center gap-2 py-3.5 text-xs font-bold text-slate-700 hover:text-red-700 transition-colors">
                  <UploadCloud className="w-4 h-4 text-red-600" />
                  <span>Pilih Foto / PDF Kartu Pelajar Danton</span>
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={e => handleFileChange('dantonCard', e)}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>
        </div>

        {/* Box Official / Pelatih */}
        <div className="p-5 sm:p-6 bg-slate-50/80 rounded-2xl border border-slate-200 space-y-4">
          <div className="flex items-center gap-2 text-slate-800 font-black text-xs uppercase tracking-wider bg-white border border-slate-200 px-3 py-1.5 rounded-xl w-fit shadow-xs">
            <ShieldCheck className="w-4 h-4 text-red-600" />
            <span>Data Official / Pelatih Pendamping</span>
          </div>

          {/* 8. Nama Official/Pelatih */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              8. Nama Lengkap Official / Pelatih <span className="text-red-600 font-bold">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="NAMA LENGKAP OFFICIAL / GURU PENDAMPING"
              value={formData.officialName}
              onChange={e => setFormData({ ...formData, officialName: e.target.value.toUpperCase() })}
              className="w-full px-4 py-3 bg-white border border-slate-200 focus:border-red-600 focus:ring-2 focus:ring-red-600/10 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 transition-all outline-none uppercase font-medium"
            />
          </div>

          {/* No WhatsApp Official */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center justify-between">
              <span>
                Nomor WhatsApp Official / Pelatih (Aktif) <span className="text-red-600 font-bold">*</span>
              </span>
              <span className="text-[10px] text-slate-400 font-normal lowercase">wajib untuk koordinasi</span>
            </label>
            <input
              type="tel"
              required
              placeholder="Contoh: 081234567890"
              value={formData.waNumber}
              onChange={e => setFormData({ ...formData, waNumber: e.target.value })}
              className="w-full px-4 py-3 bg-white border border-slate-200 focus:border-red-600 focus:ring-2 focus:ring-red-600/10 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 transition-all outline-none"
            />
          </div>

          {/* 9. Upload KTP Official/Pelatih */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1.5">
              <FileUp className="w-3.5 h-3.5 text-red-600" />
              <span>
                9. Upload KTP Official / Pelatih (Foto / PDF) <span className="text-red-600 font-bold">*</span>
              </span>
            </label>
            <div className="p-3.5 bg-white border-2 border-dashed border-slate-200 hover:border-red-400 rounded-2xl transition-all">
              {files.officialKtp ? (
                <div className="flex items-center justify-between p-2.5 bg-slate-50/80 rounded-xl border border-slate-200">
                  <div className="flex items-center gap-3 min-w-0">
                    {files.officialKtp.url && files.officialKtp.url.startsWith('data:image') ? (
                      <img
                        src={files.officialKtp.url}
                        alt="Preview KTP Official"
                        className="w-12 h-12 sm:w-14 sm:h-14 object-cover rounded-lg border border-slate-200 shadow-xs shrink-0 bg-white"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-red-100 border border-red-200 flex items-center justify-center text-red-700 shrink-0">
                        <FileText className="w-6 h-6" />
                      </div>
                    )}
                    <div className="min-w-0 text-left">
                      <span className="text-xs font-bold text-slate-900 truncate block">
                        {files.officialKtp.name}
                      </span>
                      <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-0.5">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                        <span>Berhasil diunggah ({files.officialKtp.size})</span>
                      </span>
                    </div>
                  </div>
                  <label className="cursor-pointer text-xs font-bold text-red-700 hover:text-red-800 px-3.5 py-1.5 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-colors shrink-0 ml-2">
                    Ganti File
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={e => handleFileChange('officialKtp', e)}
                      className="hidden"
                    />
                  </label>
                </div>
              ) : (
                <label className="cursor-pointer flex items-center justify-center gap-2 py-3.5 text-xs font-bold text-slate-700 hover:text-red-700 transition-colors">
                  <UploadCloud className="w-4 h-4 text-red-600" />
                  <span>Pilih Foto / PDF KTP Official / Pelatih</span>
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={e => handleFileChange('officialKtp', e)}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="pt-4 flex justify-between items-center border-t border-slate-100">
        <button
          type="button"
          onClick={handleBack}
          className="px-5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali</span>
        </button>

        <button
          type="button"
          onClick={handleNext}
          className="px-7 py-3 bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 hover:from-yellow-300 hover:to-amber-400 text-slate-950 font-black rounded-xl shadow-md text-xs sm:text-sm uppercase tracking-wider flex items-center gap-2 active:scale-95 transition-all"
        >
          <span>Lanjut ke Berkas & Pakta Online</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
