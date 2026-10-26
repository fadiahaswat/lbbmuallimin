import React from 'react';

export default function PenaltiesSection({
  penalties = {},
  setPenalties,
  selectedTeam,
  peletonPenalty = 0,
  dantonPenalty = 0,
}) {
  const totalCombinedPenalty = peletonPenalty + dantonPenalty;

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 gap-3">
        <div>
          <span className="text-[10px] font-black uppercase text-rose-700 tracking-wider block">
            Hakim Garis, Timer & Panitia Lapangan
          </span>
          <h4 className="font-black text-base text-slate-900 uppercase">
            Kalkulator Pengurangan Nilai (Penalti Lapangan & Tata Tertib)
          </h4>
          <p className="text-xs text-slate-500 mt-0.5">
            Berpedoman resmi pada Petunjuk Teknis Penilaian & Kejuaraan Bab A.3.c & Bab C
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl">
            <span className="text-[10px] text-slate-500 uppercase block font-bold">Penalti Peleton</span>
            <span className="font-mono font-black text-lg text-rose-700">-{peletonPenalty}</span>
          </div>
          <div className="text-right bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl">
            <span className="text-[10px] text-slate-500 uppercase block font-bold">Penalti Danton</span>
            <span className="font-mono font-black text-lg text-rose-700">-{dantonPenalty}</span>
          </div>
          <div className="text-right bg-rose-50 border border-rose-200 px-4 py-1.5 rounded-xl">
            <span className="text-[10px] text-rose-700 uppercase block font-bold">Total Akumulasi</span>
            <span className="font-mono font-black text-lg text-rose-800">-{totalCombinedPenalty}</span>
          </div>
        </div>
      </div>

      {/* Bagian 1: PENALTI PELETON */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-600"></span>
            <h5 className="font-bold text-xs uppercase tracking-wider text-slate-800">
              A. Pengurangan Nilai Peleton
            </h5>
          </div>
          <span className="text-[11px] font-mono text-slate-500">
            Diberlakukan terhadap Nilai Murni Peleton
          </span>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
          {/* Garis Batas Arena Luar */}
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 flex flex-col justify-between">
            <div className="flex justify-between items-start mb-1">
              <div>
                <span className="font-bold text-slate-900 text-xs block">Keluar Garis Arena</span>
                <span className="text-[10px] text-slate-500">Anggota menginjak/keluar garis batas</span>
              </div>
              <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200 shrink-0">
                -50 / kejadian
              </span>
            </div>
            <div className="flex items-center gap-2 mt-3">
              <button
                type="button"
                onClick={() => setPenalties(p => ({ ...p, injakGarisCount: Math.max(0, (p.injakGarisCount || 0) - 1) }))}
                className="w-8 h-8 bg-white hover:bg-slate-100 text-slate-800 rounded-xl font-black text-sm flex items-center justify-center transition-all cursor-pointer border border-slate-300 shadow-xs"
              >-</button>
              <span className="font-mono font-black text-base w-10 text-center text-slate-900">{penalties.injakGarisCount || 0}</span>
              <button
                type="button"
                onClick={() => setPenalties(p => ({ ...p, injakGarisCount: (p.injakGarisCount || 0) + 1 }))}
                className="w-8 h-8 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-black text-sm flex items-center justify-center transition-all cursor-pointer shadow-xs"
              >+</button>
            </div>
          </div>

          {/* Kelebihan Waktu */}
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 flex flex-col justify-between">
            <div className="flex justify-between items-start mb-1">
              <div>
                <span className="font-bold text-slate-900 text-xs block">Kelebihan Durasi Tampil</span>
                <span className="text-[10px] text-slate-500">Tiap 1–30 dtk melebihi batas ({selectedTeam?.jenjang === 'SD' ? '8' : '12'} mnt)</span>
              </div>
              <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200 shrink-0">
                -20 / 30 dtk
              </span>
            </div>
            <div className="flex items-center gap-2 mt-3">
              <button
                type="button"
                onClick={() => setPenalties(p => ({ ...p, overTimeBlocks: Math.max(0, (p.overTimeBlocks || 0) - 1) }))}
                className="w-8 h-8 bg-white hover:bg-slate-100 text-slate-800 rounded-xl font-black text-sm flex items-center justify-center transition-all cursor-pointer border border-slate-300 shadow-xs"
              >-</button>
              <span className="font-mono font-black text-base w-10 text-center text-slate-900">{penalties.overTimeBlocks || 0}</span>
              <button
                type="button"
                onClick={() => setPenalties(p => ({ ...p, overTimeBlocks: (p.overTimeBlocks || 0) + 1 }))}
                className="w-8 h-8 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-black text-sm flex items-center justify-center transition-all cursor-pointer shadow-xs"
              >+</button>
            </div>
          </div>

          {/* Personel Kurang */}
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 flex flex-col justify-between">
            <div className="flex justify-between items-start mb-1">
              <div>
                <span className="font-bold text-slate-900 text-xs block">Personel Kurang</span>
                <span className="text-[10px] text-slate-500">Tampil &lt; 22 orang (kecuali evakuasi medis)</span>
              </div>
              <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200 shrink-0">
                -75 Poin
              </span>
            </div>
            <label className="flex items-center gap-2.5 mt-3 cursor-pointer bg-white p-2 rounded-xl border border-slate-200 hover:border-slate-300">
              <input
                type="checkbox"
                checked={penalties.personelKurang || false}
                onChange={e => setPenalties({ ...penalties, personelKurang: e.target.checked })}
                className="w-4 h-4 text-rose-600 accent-rose-600 rounded cursor-pointer"
              />
              <span className="text-[11px] font-bold text-slate-700">Terapkan Penalti</span>
            </label>
          </div>

          {/* Terlambat Hadir DP 1 */}
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 flex flex-col justify-between">
            <div className="flex justify-between items-start mb-1">
              <div>
                <span className="font-bold text-slate-900 text-xs block">Terlambat Masuk DP 1</span>
                <span className="text-[10px] text-slate-500">3x panggilan interval 2 menit</span>
              </div>
              <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200 shrink-0">
                -100 Poin
              </span>
            </div>
            <label className="flex items-center gap-2.5 mt-3 cursor-pointer bg-white p-2 rounded-xl border border-slate-200 hover:border-slate-300">
              <input
                type="checkbox"
                checked={penalties.dp1 || false}
                onChange={e => setPenalties({ ...penalties, dp1: e.target.checked })}
                className="w-4 h-4 text-rose-600 accent-rose-600 rounded cursor-pointer"
              />
              <span className="text-[11px] font-bold text-slate-700">Terapkan Penalti</span>
            </label>
          </div>

          {/* Tidak Ikut Upacara Pembukaan */}
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 flex flex-col justify-between">
            <div className="flex justify-between items-start mb-1">
              <div>
                <span className="font-bold text-slate-900 text-xs block">Absen Upacara</span>
                <span className="text-[10px] text-slate-500">Urutan 6-10 tidak ikut upacara</span>
              </div>
              <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200 shrink-0">
                -150 Poin
              </span>
            </div>
            <label className="flex items-center gap-2.5 mt-3 cursor-pointer bg-white p-2 rounded-xl border border-slate-200 hover:border-slate-300">
              <input
                type="checkbox"
                checked={penalties.upacara || false}
                onChange={e => setPenalties({ ...penalties, upacara: e.target.checked })}
                className="w-4 h-4 text-rose-600 accent-rose-600 rounded cursor-pointer"
              />
              <span className="text-[11px] font-bold text-slate-700">Terapkan Penalti</span>
            </label>
          </div>

          {/* Keterlambatan Upacara */}
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 flex flex-col justify-between">
            <div className="flex justify-between items-start mb-1">
              <div>
                <span className="font-bold text-slate-900 text-xs block">Terlambat Upacara</span>
                <span className="text-[10px] text-slate-500">Tiap kelipatan 5 menit</span>
              </div>
              <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200 shrink-0">
                -50 / 5 mnt
              </span>
            </div>
            <div className="flex items-center gap-2 mt-3">
              <button
                type="button"
                onClick={() => setPenalties(p => ({ ...p, upacaraTerlambatBlocks: Math.max(0, (p.upacaraTerlambatBlocks || 0) - 1) }))}
                className="w-8 h-8 bg-white hover:bg-slate-100 text-slate-800 rounded-xl font-black text-sm flex items-center justify-center transition-all cursor-pointer border border-slate-300 shadow-xs"
              >-</button>
              <span className="font-mono font-black text-base w-10 text-center text-slate-900">{penalties.upacaraTerlambatBlocks || 0}</span>
              <button
                type="button"
                onClick={() => setPenalties(p => ({ ...p, upacaraTerlambatBlocks: (p.upacaraTerlambatBlocks || 0) + 1 }))}
                className="w-8 h-8 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-black text-sm flex items-center justify-center transition-all cursor-pointer shadow-xs"
              >+</button>
            </div>
          </div>

          {/* Basecamp Kotor */}
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 flex flex-col justify-between">
            <div className="flex justify-between items-start mb-1">
              <div>
                <span className="font-bold text-slate-900 text-xs block">Basecamp Kotor</span>
                <span className="text-[10px] text-slate-500">Sampah tidak diserahkan ke pos checkout</span>
              </div>
              <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200 shrink-0">
                -150 Poin
              </span>
            </div>
            <label className="flex items-center gap-2.5 mt-3 cursor-pointer bg-white p-2 rounded-xl border border-slate-200 hover:border-slate-300">
              <input
                type="checkbox"
                checked={penalties.basecampKotor || false}
                onChange={e => setPenalties({ ...penalties, basecampKotor: e.target.checked })}
                className="w-4 h-4 text-rose-600 accent-rose-600 rounded cursor-pointer"
              />
              <span className="text-[11px] font-bold text-slate-700">Terapkan Penalti</span>
            </label>
          </div>

          {/* Kawasan Bebas Rokok / Vape */}
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 flex flex-col justify-between">
            <div className="flex justify-between items-start mb-1">
              <div>
                <span className="font-bold text-slate-900 text-xs block">Rokok / Vape Kontingen</span>
                <span className="text-[10px] text-slate-500">Setelah teguran panitia (Bab C.9 & Pasal 9)</span>
              </div>
              <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200 shrink-0">
                -75 / kejadian
              </span>
            </div>
            <div className="flex items-center gap-2 mt-3">
              <button
                type="button"
                onClick={() => setPenalties(p => ({ ...p, rokokCount: Math.max(0, (p.rokokCount || 0) - 1) }))}
                className="w-8 h-8 bg-white hover:bg-slate-100 text-slate-800 rounded-xl font-black text-sm flex items-center justify-center transition-all cursor-pointer border border-slate-300 shadow-xs"
              >-</button>
              <span className="font-mono font-black text-base w-10 text-center text-slate-900">{penalties.rokokCount || 0}</span>
              <button
                type="button"
                onClick={() => setPenalties(p => ({ ...p, rokokCount: (p.rokokCount || 0) + 1 }))}
                className="w-8 h-8 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-black text-sm flex items-center justify-center transition-all cursor-pointer shadow-xs"
              >+</button>
            </div>
          </div>

          {/* Yel-Yel Selama Tampil (Kena Nilai Peleton sesuai Bab C.10.b & d) */}
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 flex flex-col justify-between">
            <div className="flex justify-between items-start mb-1">
              <div>
                <span className="font-bold text-slate-900 text-xs block">Yel-Yel Mengganggu Penampilan</span>
                <span className="text-[10px] text-slate-500">Pelanggaran ke-3 dst: potong Nilai Peleton (Bab C.10)</span>
              </div>
              <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200 shrink-0">
                -50 / kejadian
              </span>
            </div>
            <div className="flex items-center gap-2 mt-3">
              <button
                type="button"
                onClick={() => setPenalties(p => ({ ...p, yelYelCount: Math.max(0, (p.yelYelCount || 0) - 1) }))}
                className="w-8 h-8 bg-white hover:bg-slate-100 text-slate-800 rounded-xl font-black text-sm flex items-center justify-center transition-all cursor-pointer border border-slate-300 shadow-xs"
              >-</button>
              <span className="font-mono font-black text-base w-10 text-center text-slate-900">{penalties.yelYelCount || 0}</span>
              <button
                type="button"
                onClick={() => setPenalties(p => ({ ...p, yelYelCount: (p.yelYelCount || 0) + 1 }))}
                className="w-8 h-8 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-black text-sm flex items-center justify-center transition-all cursor-pointer shadow-xs"
              >+</button>
            </div>
          </div>
        </div>
      </div>

      {/* Bagian 2: PENALTI KOMANDAN PELETON (DANTON) */}
      <div className="space-y-3 pt-2 border-t border-slate-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-600"></span>
            <h5 className="font-bold text-xs uppercase tracking-wider text-slate-800">
              B. Pengurangan Nilai Komandan Peleton (Danton)
            </h5>
          </div>
          <span className="text-[11px] font-mono text-slate-500">
            Diberlakukan terhadap Nilai Murni Komandan
          </span>
        </div>

        <div className="grid sm:grid-cols-2 gap-3 text-xs">
          {/* Keluar Kotak Danton 1,5 x 1,5 meter */}
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 flex flex-col justify-between">
            <div className="flex justify-between items-start mb-1">
              <div>
                <span className="font-bold text-slate-900 text-xs block">Keluar Garis Kotak Danton</span>
                <span className="text-[10px] text-slate-500">Komandan menginjak / keluar batas kotak 1,5×1,5 m</span>
              </div>
              <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200 shrink-0">
                -50 / kejadian
              </span>
            </div>
            <div className="flex items-center gap-2 mt-3">
              <button
                type="button"
                onClick={() => setPenalties(p => ({ ...p, kotakDantonCount: Math.max(0, (p.kotakDantonCount || 0) - 1) }))}
                className="w-8 h-8 bg-white hover:bg-slate-100 text-slate-800 rounded-xl font-black text-sm flex items-center justify-center transition-all cursor-pointer border border-slate-300 shadow-xs"
              >-</button>
              <span className="font-mono font-black text-base w-10 text-center text-slate-900">{penalties.kotakDantonCount || 0}</span>
              <button
                type="button"
                onClick={() => setPenalties(p => ({ ...p, kotakDantonCount: (p.kotakDantonCount || 0) + 1 }))}
                className="w-8 h-8 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-black text-sm flex items-center justify-center transition-all cursor-pointer shadow-xs"
              >+</button>
            </div>
          </div>
        </div>
      </div>

      {/* Catatan Juknis Resmi Bebas Penalti */}
      <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-slate-600 gap-2">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-800">Catatan Juknis Lapangan:</span>
          <span>• Gerakan Penyesuaian: Bebas kuota (0 Poin penalti)</span>
          <span>• Atribut Terlepas: 0 Poin penalti</span>
        </div>
        <span className="text-slate-500 italic">Nilai penalti otomatis terakumulasi pada rekapitulasi nilai</span>
      </div>
    </div>
  );
}
