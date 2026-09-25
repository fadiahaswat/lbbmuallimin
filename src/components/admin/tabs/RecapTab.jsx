import React from 'react';
import { Printer, Trophy } from 'lucide-react';

export default function RecapTab({
  teams,
  scores,
  selectedJenjang,
  setSelectedJenjang,
  totalRevenue,
  openModal,
  setActiveView
}) {
  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded border border-amber-200">
              Tahap 4 Hasil Perlombaan
            </span>
            <span className="text-xs text-slate-400">• Rekapitulasi Dewan Juri Resmi</span>
          </div>
          <h3 className="font-black text-xl text-slate-900 uppercase italic mt-1">
            4. Rekap Nilai & Pengumuman Juara LBB
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Rekapitulasi nilai akumulasi Danton, PBB Peleton (Teknik & Kekompakan), serta Pengurangan Nilai (Penalti) dari sistem penjurian.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => openModal('docViewer', { docId: 'official-scores' })}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Berita Acara Nilai</span>
          </button>
          <button
            onClick={() => setActiveView('leaderboard')}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
          >
            <Trophy className="w-4 h-4" />
            <span>Leaderboard Live</span>
          </button>
        </div>
      </div>

      {/* Filter Jenjang untuk Rekap Nilai */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200 text-xs font-bold">
          {['ALL', 'SD', 'SMP'].map(j => (
            <button
              key={j}
              onClick={() => setSelectedJenjang(j)}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                selectedJenjang === j ? 'bg-white text-slate-950 shadow-xs font-extrabold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {j === 'ALL' ? 'Semua Jenjang' : `Jenjang ${j}`}
            </button>
          ))}
        </div>

        <span className="text-xs text-slate-500 font-medium">
          Peringkat dihitung otomatis berdasarkan akumulasi poin akhir tertinggi.
        </span>
      </div>

      {/* Score Recapitulation Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
            <tr>
              <th className="p-3 text-center">Rank</th>
              <th className="p-3">No. Undian</th>
              <th className="p-3">Pangkalan & Peleton</th>
              <th className="p-3 text-center">Jenjang</th>
              <th className="p-3 text-center">Nilai Danton</th>
              <th className="p-3 text-center">Nilai PBB</th>
              <th className="p-3 text-center text-rose-700">Penalti</th>
              <th className="p-3 text-right font-black text-slate-900">Total Nilai Akhir</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {teams
              .filter(t => selectedJenjang === 'ALL' || t.jenjang === selectedJenjang)
              .map(t => ({ ...t, scoreData: scores?.[t.id] || null }))
              .sort((a, b) => {
                const scoreA = a.scoreData?.finalScore ?? -1;
                const scoreB = b.scoreData?.finalScore ?? -1;
                return scoreB - scoreA;
              })
              .map((t, idx) => {
                const sc = t.scoreData;
                const hasScore = Boolean(sc && typeof sc.finalScore === 'number');

                return (
                  <tr key={t.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3 text-center">
                      {hasScore ? (
                        <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full font-black text-xs ${
                          idx === 0 ? 'bg-amber-400 text-slate-950 shadow-xs' :
                          idx === 1 ? 'bg-slate-300 text-slate-900' :
                          idx === 2 ? 'bg-amber-700 text-white' :
                          'bg-slate-100 text-slate-600'
                        }`}>
                          {idx + 1}
                        </span>
                      ) : (
                        <span className="text-slate-300 font-mono">-</span>
                      )}
                    </td>
                    <td className="p-3 font-mono font-bold text-slate-700">
                      {t.lotNumber ? `#${String(t.lotNumber).padStart(2, '0')}` : '-'}
                    </td>
                    <td className="p-3">
                      <div className="font-black text-slate-900">{t.schoolName}</div>
                      <div className="text-[11px] text-slate-500">{t.platoonName} • Danton: {t.roster?.danton?.name || t.dantonName || '-'}</div>
                    </td>
                    <td className="p-3 text-center">
                      <span className="font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                        {t.jenjang}
                      </span>
                    </td>
                    <td className="p-3 text-center font-mono font-bold text-slate-800">
                      {sc?.danton?.total ?? '-'}
                    </td>
                    <td className="p-3 text-center font-mono font-bold text-slate-800">
                      {sc?.pbb?.total ?? '-'}
                    </td>
                    <td className="p-3 text-center font-mono font-bold text-rose-700">
                      {sc?.penalties?.totalPenalty ? `-${sc.penalties.totalPenalty}` : '0'}
                    </td>
                    <td className="p-3 text-right">
                      {hasScore ? (
                        <span className="font-mono font-black text-sm text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
                          {sc.finalScore}
                        </span>
                      ) : (
                        <span className="text-slate-400 italic text-[11px]">Belum dinilai juri</span>
                      )}
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>

      {/* Financial Summary card within recap */}
      <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <div>
          <span className="font-black text-slate-800 uppercase block">Rekapitulasi Biaya Pendaftaran LBB</span>
          <span className="text-slate-500">
            Total Penerimaan Kas: <strong>Rp{totalRevenue.toLocaleString('id-ID')},-</strong> ({teams.length} peleton terdata)
          </span>
        </div>
        <button
          onClick={() => window.print()}
          className="px-4 py-2 bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 font-bold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>Cetak Lembar Rekap Keuangan</span>
        </button>
      </div>
    </div>
  );
}
