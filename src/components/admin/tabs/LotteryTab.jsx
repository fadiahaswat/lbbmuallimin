import React from 'react';
import { Shuffle, CheckCircle2 } from 'lucide-react';

export default function LotteryTab({
  teams,
  handleRandomize,
  lotSuccessMsg,
  updateTeamDraw
}) {
  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded border border-purple-200">
              Tahap 3 Undian Lapangan (TM)
            </span>
            <span className="text-xs text-slate-400">• Hanya Peleton Berstatus Sah</span>
          </div>
          <h3 className="font-black text-xl text-slate-900 uppercase italic mt-1">
            3. Undian (Nomor Urut Tampil & Nomor Dada Lapangan)
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Pengundian nomor urut tampil dilakukan resmi saat Technical Meeting (Sabtu, 10 Januari 2027). Masukkan <strong>Nomor Urut Tampil</strong> dan <strong>Nomor Dada</strong> peleton yang diperoleh.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] text-slate-400 italic hidden sm:inline">Input Manual Lapangan</span>
          <button
            onClick={() => handleRandomize('SD')}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center gap-1.5 border border-slate-200 transition-all cursor-pointer"
            title="Opsi otomatis jika pengundian memakai sistem acak komputer"
          >
            <Shuffle className="w-3.5 h-3.5 text-slate-500" />
            <span>Kocok Cepat SD</span>
          </button>
          <button
            onClick={() => handleRandomize('SMP')}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center gap-1.5 border border-slate-200 transition-all cursor-pointer"
            title="Opsi otomatis jika pengundian memakai sistem acak komputer"
          >
            <Shuffle className="w-3.5 h-3.5 text-slate-500" />
            <span>Kocok Cepat SMP</span>
          </button>
        </div>
      </div>

      {lotSuccessMsg && (
        <div className="bg-emerald-600 text-white p-3.5 rounded-xl text-xs font-bold flex items-center gap-2 animate-in fade-in duration-300">
          <CheckCircle2 className="w-4 h-4" />
          <span>{lotSuccessMsg}</span>
        </div>
      )}

      {/* 2 Columns: SD & SMP Running Order Tables */}
      <div className="grid lg:grid-cols-2 gap-6">
        {['SD', 'SMP'].map(jenjang => {
          const list = teams
            .filter(t => t.jenjang === jenjang && (t.status === 'verified' || t.status === 'drawn'))
            .sort((a, b) => (a.lotNumber || 999) - (b.lotNumber || 999));

          return (
            <div key={jenjang} className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider">
                    Daftar Peleton Terverifikasi
                  </span>
                  <h4 className="font-black text-lg text-slate-900 uppercase">
                    Jenjang {jenjang === 'SD' ? 'SD / MI' : 'SMP / MTs'}
                  </h4>
                </div>
                <span className="text-xs font-bold text-slate-600 bg-white px-3 py-1 rounded-lg border border-slate-200">
                  {list.length} Peleton Sah
                </span>
              </div>

              <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
                {list.length === 0 ? (
                  <p className="text-xs text-slate-400 italic py-6 text-center">
                    Belum ada peleton {jenjang} dengan status sah (terverifikasi). Lakukan verifikasi di Tab 2 terlebih dahulu.
                  </p>
                ) : (
                  list.map((t) => (
                    <div
                      key={t.id}
                      className="bg-white p-3.5 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs hover:border-slate-300 transition-all"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-slate-900 text-yellow-400 font-mono font-black text-sm flex flex-col items-center justify-center shrink-0 shadow-xs leading-none">
                          <span>{t.lotNumber ? String(t.lotNumber).padStart(2, '0') : '-'}</span>
                          <span className="text-[8px] text-slate-400 font-sans uppercase tracking-tight mt-0.5">Urut</span>
                        </div>
                        <div className="min-w-0">
                          <span className="font-black text-slate-900 text-xs block truncate">{t.schoolName}</span>
                          <span className="text-[10px] text-slate-500 block truncate">
                            {t.platoonName} • Danton: <strong className="text-slate-700">{t.dantonName || t.roster?.danton?.name || '-'}</strong>
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 shrink-0 bg-slate-50 p-1.5 rounded-xl border border-slate-200 self-end sm:self-center">
                        <div className="flex flex-col">
                          <span className="text-[9px] font-bold uppercase text-slate-400 tracking-wider">No. Urut</span>
                          <input
                            type="number"
                            min={1}
                            max={100}
                            value={t.lotNumber || ''}
                            onChange={e => updateTeamDraw(t.id, e.target.value, t.chestNumber, t.estimatedTime, t.basecampNumber)}
                            placeholder="1"
                            className="w-16 px-2 py-1 bg-white border border-slate-300 rounded-lg text-xs font-mono font-bold text-center focus:ring-2 focus:ring-purple-500 outline-none"
                          />
                        </div>

                        <div className="flex flex-col">
                          <span className="text-[9px] font-bold uppercase text-slate-400 tracking-wider">No. Dada</span>
                          <input
                            type="text"
                            value={t.chestNumber || ''}
                            onChange={e => updateTeamDraw(t.id, t.lotNumber, e.target.value, t.estimatedTime, t.basecampNumber)}
                            placeholder="Contoh: 07"
                            className="w-18 px-2 py-1 bg-white border border-slate-300 rounded-lg text-xs font-mono font-bold text-center focus:ring-2 focus:ring-purple-500 outline-none"
                          />
                        </div>

                        <div className="flex flex-col">
                          <span className="text-[9px] font-bold uppercase text-slate-400 tracking-wider">Est. Tampil</span>
                          <input
                            type="text"
                            value={t.estimatedTime || ''}
                            onChange={e => updateTeamDraw(t.id, t.lotNumber, t.chestNumber, e.target.value, t.basecampNumber)}
                            placeholder="08.30"
                            className="w-18 px-2 py-1 bg-white border border-slate-300 rounded-lg text-xs font-mono font-bold text-center focus:ring-2 focus:ring-purple-500 outline-none"
                            title="Format: HH.MM (contoh: 08.30)"
                          />
                        </div>

                        <div className="flex flex-col">
                          <span className="text-[9px] font-bold uppercase text-slate-400 tracking-wider">Basecamp</span>
                          <input
                            type="text"
                            value={t.basecampNumber || ''}
                            onChange={e => updateTeamDraw(t.id, t.lotNumber, t.chestNumber, t.estimatedTime, e.target.value)}
                            placeholder="R. 101"
                            className="w-18 px-2 py-1 bg-white border border-slate-300 rounded-lg text-xs font-mono font-bold text-center focus:ring-2 focus:ring-purple-500 outline-none"
                            title="Contoh: Ruang 101 atau BC-01"
                          />
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
