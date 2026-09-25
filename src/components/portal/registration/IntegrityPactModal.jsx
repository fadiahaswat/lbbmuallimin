import React from 'react';
import { X, PenTool, RotateCcw, Check } from 'lucide-react';
import logoImg from '../../../assets/logo-tonti.png';

export default function IntegrityPactModal({
  isOpen,
  onClose,
  formData,
  getFullSchoolName,
  canvasRef,
  startDrawing,
  draw,
  stopDrawing,
  clearCanvasSignature,
  saveOnlineSignature
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-5 text-slate-900 shadow-2xl max-h-[90vh] overflow-y-auto relative">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
          <div className="flex items-center gap-3">
            <img src={logoImg} alt="Logo Tonti" className="h-9 w-auto filter drop-shadow-xs" />
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-red-700 block">
                Dokumen Resmi Digital LBB 2026
              </span>
              <h3 className="text-base sm:text-lg font-black text-slate-900 uppercase italic">
                Pakta Integritas & Keabsahan
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Konten Surat Pakta Integritas */}
        <div className="space-y-3 text-xs text-slate-600 leading-relaxed bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200">
          <p className="font-semibold text-slate-900">
            Yang bertanda tangan di bawah ini secara sah dan sadar:
          </p>
          <div className="grid grid-cols-3 gap-1.5 text-[11px] bg-white p-3 rounded-xl border border-slate-200">
            <span className="text-slate-500">Nama Official:</span>
            <span className="col-span-2 font-bold text-slate-900">{formData.officialName || '(Nama Official di Step 2)'}</span>
            <span className="text-slate-500">Sekolah:</span>
            <span className="col-span-2 font-bold text-slate-900">{getFullSchoolName() || '(Nama Sekolah di Step 1)'}</span>
            <span className="text-slate-500">Nama Komandan:</span>
            <span className="col-span-2 font-bold text-slate-900">{formData.dantonName || '(Nama Komandan di Step 2)'}</span>
          </div>

          <p className="font-bold text-red-700 text-[11px] pt-1 uppercase tracking-wider">
            Menyatakan dengan sesungguhnya bahwa:
          </p>
          <ol className="list-decimal pl-4 space-y-1.5 text-[11px] text-slate-600 leading-relaxed">
            <li>Seluruh anggota peleton yang didaftarkan adalah siswa/siswi aktif dari sekolah bersangkutan yang dibuktikan dengan Kartu Pelajar sah.</li>
            <li>Tidak memanipulasi identitas, usia, jenjang sekolah, maupun data personel peleton.</li>
            <li>Menjunjung tinggi kehormatan korps, sportivitas luhur, dan integritas perlombaan baris berbaris.</li>
            <li>Mentaati seluruh Petunjuk Teknis LBB Mu'allimin 2026 dan menerima keputusan Dewan Juri secara mutlak.</li>
            <li>Bersedia menerima sanksi diskualifikasi apabila ditemukan pelanggaran terhadap butir-butir pakta ini.</li>
          </ol>
        </div>

        {/* Canvas Tanda Tangan Digital */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <PenTool className="w-3.5 h-3.5 text-red-700" />
              <span>Bubuhkan Tanda Tangan Digital di Bawah Ini:</span>
            </label>
            <button
              type="button"
              onClick={clearCanvasSignature}
              className="text-[11px] text-slate-500 hover:text-slate-800 flex items-center gap-1 font-semibold"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Bersihkan / Ulangi</span>
            </button>
          </div>

          <div className="border-2 border-dashed border-slate-300 bg-white rounded-2xl overflow-hidden cursor-crosshair touch-none">
            <canvas
              ref={canvasRef}
              width={500}
              height={150}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
              className="w-full h-36 block"
            />
          </div>
          <p className="text-[10px] text-slate-400 text-center italic">
            *Gunakan jari pada layar sentuh ponsel atau kursor mouse pada laptop untuk membubuhkan tanda tangan.
          </p>
        </div>

        <div className="pt-2 flex justify-end gap-2.5 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 rounded-xl border border-slate-200 hover:bg-slate-100 transition-colors"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={saveOnlineSignature}
            className="px-6 py-2.5 bg-red-700 hover:bg-red-800 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-xs transition-all flex items-center gap-1.5 active:scale-95"
          >
            <Check className="w-4 h-4 text-white stroke-[3]" />
            <span>Simpan & Sahkan Pakta Integritas</span>
          </button>
        </div>
      </div>
    </div>
  );
}
