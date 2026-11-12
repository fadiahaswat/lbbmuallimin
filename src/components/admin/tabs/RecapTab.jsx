import React, { useState } from 'react';
import { Printer, Trophy, FileText, ExternalLink, Check, X } from 'lucide-react';

export default function RecapTab({
  teams,
  scores,
  selectedJenjang,
  setSelectedJenjang,
  totalRevenue,
  openModal,
  setActiveView,
  settings,
  updateSettings
}) {
  const [isDriveModalOpen, setIsDriveModalOpen] = useState(false);
  const [driveForm, setDriveForm] = useState({
    sd: settings?.beritaAcaraUrlSD || '',
    smp: settings?.beritaAcaraUrlSMP || ''
  });
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleOpenDriveModal = () => {
    setDriveForm({
      sd: settings?.beritaAcaraUrlSD || '',
      smp: settings?.beritaAcaraUrlSMP || ''
    });
    setSaveSuccess(false);
    setIsDriveModalOpen(true);
  };

  const handleSaveDrive = (e) => {
    e?.preventDefault();
    if (typeof updateSettings === 'function') {
      updateSettings({
        beritaAcaraUrlSD: driveForm.sd.trim(),
        beritaAcaraUrlSMP: driveForm.smp.trim(),
        beritaAcaraUrl: (driveForm.sd.trim() || driveForm.smp.trim())
      });
    }
    setSaveSuccess(true);
    setTimeout(() => {
      setIsDriveModalOpen(false);
      setSaveSuccess(false);
    }, 800);
  };
  return (
    <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 border border-slate-200 shadow-xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            <span className="shrink-0 whitespace-nowrap text-[10px] font-black uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded border border-amber-200">
              Tahap 4 Hasil Perlombaan
            </span>
            <span className="text-xs text-slate-400">• Rekapitulasi Dewan Juri Resmi</span>
          </div>
          <h3 className="font-black text-base sm:text-xl text-slate-900 uppercase mt-1 leading-snug">
            4. Rekap Nilai & Pengumuman Juara LBB
          </h3>
          <p className="text-[11px] sm:text-xs text-slate-500 mt-1 leading-relaxed">
            Rekapitulasi nilai akumulasi Danton, PBB Peleton (Teknik & Kekompakan), serta Pengurangan Nilai (Penalti) dari sistem penjurian.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleOpenDriveModal}
            className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold rounded-xl flex items-center gap-1.5 border border-red-200 transition-all cursor-pointer"
            title="Kelola link Google Drive Berita Acara untuk tombol download publik"
          >
            <FileText className="w-4 h-4" />
            <span>Link Berita Acara Drive</span>
          </button>
          <button
            onClick={() => openModal('docViewer', { docId: 'official-scores' })}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Berita Acara Nilai</span>
          </button>
          <button
            onClick={() => setActiveView('live_leaderboard')}
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
                      <div className="text-[11px] text-slate-500">Danton: {t.roster?.danton?.name || t.dantonName || '-'}</div>
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
                        <span className="text-slate-400 text-[11px]">Belum dinilai juri</span>
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

      {/* Modal Input Link Google Drive Berita Acara */}
      {isDriveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-lg bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-2xl space-y-4">
            <div className="flex items-start justify-between gap-3 border-b border-slate-200 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center border border-red-200">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-base uppercase">Link Google Drive Berita Acara</h3>
                  <p className="text-xs text-slate-500">Target unduhan dokumen sah pada Leaderboard Live publik</p>
                </div>
              </div>
              <button
                onClick={() => setIsDriveModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveDrive} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase text-slate-700 block">Link Google Drive — Jenjang SD/MI</label>
                <div className="relative">
                  <input
                    type="url"
                    placeholder="https://drive.google.com/file/d/... atau folder"
                    value={driveForm.sd}
                    onChange={(e) => setDriveForm(prev => ({ ...prev, sd: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl text-xs font-mono border border-slate-300 bg-slate-50 text-slate-900 focus:bg-white focus:border-red-600"
                  />
                  {driveForm.sd && (
                    <a
                      href={driveForm.sd}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute right-2.5 top-2.5 text-xs text-red-600 hover:text-red-700 flex items-center gap-1 font-bold"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Tes</span>
                    </a>
                  )}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase text-slate-700 block">Link Google Drive — Jenjang SMP/MTs</label>
                <div className="relative">
                  <input
                    type="url"
                    placeholder="https://drive.google.com/file/d/... atau folder"
                    value={driveForm.smp}
                    onChange={(e) => setDriveForm(prev => ({ ...prev, smp: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl text-xs font-mono border border-slate-300 bg-slate-50 text-slate-900 focus:bg-white focus:border-red-600"
                  />
                  {driveForm.smp && (
                    <a
                      href={driveForm.smp}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute right-2.5 top-2.5 text-xs text-red-600 hover:text-red-700 flex items-center gap-1 font-bold"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Tes</span>
                    </a>
                  )}
                </div>
              </div>

              {saveSuccess && (
                <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Link Berita Acara berhasil disimpan dan diperbarui!</span>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsDriveModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold border border-slate-300 hover:bg-slate-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-black bg-red-600 hover:bg-red-700 text-white flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Simpan Link Berita Acara</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
