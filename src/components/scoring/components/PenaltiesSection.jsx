import React from 'react';

export default function PenaltiesSection({
  penalties,
  setPenalties,
  selectedTeam,
  penaltyDeduction
}) {
  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div>
          <span className="text-[10px] font-black uppercase text-rose-700 tracking-wider block">
            Hakim Garis & Petugas Timer Lapangan
          </span>
          <h4 className="font-black text-base text-slate-900 uppercase">
            Kalkulator Pengurangan Nilai (Penalti Lapangan)
          </h4>
        </div>
        <div className="text-right bg-rose-50 border border-rose-200 px-4 py-2 rounded-2xl">
          <span className="text-[10px] text-rose-700 uppercase block font-bold">Total Pengurangan</span>
          <span className="font-mono font-black text-2xl text-rose-700">-{penaltyDeduction} Poin</span>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3.5 text-xs">
        {/* Injak Garis (Hakim Garis) */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col justify-between">
          <div className="flex justify-between items-center mb-1">
            <span className="font-bold text-slate-900 text-sm">Hakim Garis: Injak Garis</span>
            <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">-50 / kejadian</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1 mb-3">Personel yang terbukti menginjak garis kotak arena lomba</p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPenalties(p => ({ ...p, injakGarisCount: Math.max(0, p.injakGarisCount - 1) }))}
              className="w-8 h-8 bg-white hover:bg-slate-100 text-slate-800 rounded-xl font-black text-sm flex items-center justify-center transition-all cursor-pointer border border-slate-300 shadow-xs"
            >-</button>
            <span className="font-mono font-black text-base w-10 text-center text-slate-900">{penalties.injakGarisCount}</span>
            <button
              type="button"
              onClick={() => setPenalties(p => ({ ...p, injakGarisCount: p.injakGarisCount + 1 }))}
              className="w-8 h-8 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-black text-sm flex items-center justify-center transition-all cursor-pointer shadow-xs"
            >+</button>
          </div>
        </div>

        {/* Kelebihan Waktu (Timer) */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col justify-between">
          <div className="flex justify-between items-center mb-1">
            <span className="font-bold text-slate-900 text-sm">Timer: Kelebihan Waktu</span>
            <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">-50 / 30 dtk</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1 mb-3">Tiap 30 detik melebihi kuota {selectedTeam?.jenjang === 'SD' ? '10' : '13'} menit</p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPenalties(p => ({ ...p, overTimeBlocks: Math.max(0, p.overTimeBlocks - 1) }))}
              className="w-8 h-8 bg-white hover:bg-slate-100 text-slate-800 rounded-xl font-black text-sm flex items-center justify-center transition-all cursor-pointer border border-slate-300 shadow-xs"
            >-</button>
            <span className="font-mono font-black text-base w-10 text-center text-slate-900">{penalties.overTimeBlocks}</span>
            <button
              type="button"
              onClick={() => setPenalties(p => ({ ...p, overTimeBlocks: p.overTimeBlocks + 1 }))}
              className="w-8 h-8 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-black text-sm flex items-center justify-center transition-all cursor-pointer shadow-xs"
            >+</button>
          </div>
        </div>

        {/* Personel Kurang */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="font-bold text-slate-900 text-sm">Personel Kurang</span>
              <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">-75 Poin</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Pasukan kurang dari 22 orang di lapangan</p>
          </div>
          <label className="flex items-center gap-2.5 mt-3 cursor-pointer bg-white p-2 rounded-xl border border-slate-200 hover:border-slate-300">
            <input
              type="checkbox"
              checked={penalties.personelKurang}
              onChange={e => setPenalties({ ...penalties, personelKurang: e.target.checked })}
              className="w-4 h-4 text-rose-600 accent-rose-600 rounded cursor-pointer"
            />
            <span className="text-[11px] font-bold text-slate-700">Terapkan Penalti</span>
          </label>
        </div>

        {/* Terlambat DP 1 */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="font-bold text-slate-900 text-sm">Tidak Hadir DP 1</span>
              <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">-100 Poin</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Tidak hadir setelah 3x pemanggilan berturut-turut</p>
          </div>
          <label className="flex items-center gap-2.5 mt-3 cursor-pointer bg-white p-2 rounded-xl border border-slate-200 hover:border-slate-300">
            <input
              type="checkbox"
              checked={penalties.dp1}
              onChange={e => setPenalties({ ...penalties, dp1: e.target.checked })}
              className="w-4 h-4 text-rose-600 accent-rose-600 rounded cursor-pointer"
            />
            <span className="text-[11px] font-bold text-slate-700">Terapkan Penalti</span>
          </label>
        </div>

        {/* Tidak Ikut Upacara */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col justify-between sm:col-span-2">
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="font-bold text-slate-900 text-sm">Tidak Ikut Upacara Pembukaan</span>
              <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">-150 Poin</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Perwakilan peleton tidak mengikuti apel / upacara pembukaan resmi</p>
          </div>
          <label className="flex items-center gap-2.5 mt-3 cursor-pointer bg-white p-2 rounded-xl border border-slate-200 hover:border-slate-300">
            <input
              type="checkbox"
              checked={penalties.upacara}
              onChange={e => setPenalties({ ...penalties, upacara: e.target.checked })}
              className="w-4 h-4 text-rose-600 accent-rose-600 rounded cursor-pointer"
            />
            <span className="text-[11px] font-bold text-slate-700">Terapkan Penalti</span>
          </label>
        </div>
      </div>
    </div>
  );
}
