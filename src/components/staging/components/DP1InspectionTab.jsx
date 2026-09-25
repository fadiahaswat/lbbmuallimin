import React, { useState } from 'react';
import { Tablet, Users, ArrowRight, UserCheck, UserX } from 'lucide-react';

export default function DP1InspectionTab({
  eligibleTeams,
  staging,
  updateDP1PersonnelInspection,
  passToDP2,
  initialSelectedTeamId
}) {
  const [selectedDP1TeamId, setSelectedDP1TeamId] = useState(initialSelectedTeamId || null);

  const selectedDP1Team =
    teamsFind(eligibleTeams, selectedDP1TeamId) ||
    eligibleTeams.find(t => (staging[t.id]?.stage || 'waiting') === 'dp1') ||
    eligibleTeams[0] ||
    null;

  function teamsFind(list, id) {
    return id ? list.find(t => t.id === id) : null;
  }

  const dp1TeamInspections = selectedDP1Team ? (staging[selectedDP1Team.id]?.dp1Inspections || {}) : {};

  // Susunan 25 personel DP 1: Danton + Pasukan 1-21 + Cadangan 1-3
  const dp1Personnels = [];
  if (selectedDP1Team) {
    const r = selectedDP1Team.roster || {};
    // Danton
    dp1Personnels.push({
      id: 'danton',
      role: 'Komandan (Danton)',
      name: r.danton?.name || selectedDP1Team.dantonName || 'Komandan Peleton',
      nisn: r.danton?.nisn || '-',
      class: r.danton?.class || '-',
      photo: r.danton?.photo || null,
      isDanton: true,
    });
    // 21 Pasukan
    const pasukan = Array.isArray(r.pasukan) ? r.pasukan : [];
    for (let i = 0; i < 21; i++) {
      const p = pasukan[i];
      const saf = Math.ceil((i + 1) / 7);
      const banjar = (i % 7) + 1;
      dp1Personnels.push({
        id: `pasukan-${i + 1}`,
        role: `Pasukan Inti (Saf ${saf}, Banjar ${banjar})`,
        name: p?.name || `Personel ${i + 1}`,
        nisn: p?.nisn || '-',
        class: p?.class || '-',
        photo: p?.photo || null,
        isPasukan: true,
      });
    }
    // 3 Cadangan
    const cadangan = Array.isArray(r.cadangan) ? r.cadangan : [];
    for (let i = 0; i < 3; i++) {
      const c = cadangan[i];
      dp1Personnels.push({
        id: `cadangan-${i + 1}`,
        role: `Cadangan ${i + 1}`,
        name: c?.name || `Cadangan ${i + 1}`,
        nisn: c?.nisn || '-',
        class: c?.class || '-',
        photo: c?.photo || null,
        isCadangan: true,
      });
    }
  }

  const dp1VerifiedCount = dp1Personnels.filter(p => dp1TeamInspections[p.id]?.verified).length;
  const isDP1AllVerified = dp1Personnels.length > 0 && dp1VerifiedCount >= 22; // Minimal Danton + 21 Pasukan

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200">
                DP 1: INSPEKSI FOTO TAB / IPAD
              </span>
              <span className="text-xs text-slate-500 font-medium">Verifikasi 25 Personel Peleton</span>
            </div>
            <h2 className="text-xl font-black uppercase text-slate-900 mt-1">
              Pemeriksaan Wajah & Personel Lapangan
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Cocokkan pasfoto pendaftaran dengan fisik siswa di lapangan sebelum meloloskan ke DP 2 (Ruang Tunggu Steril).
            </p>
          </div>

          {/* Pilih Peleton yang Sedang Di DP 1 */}
          <div className="flex items-center gap-2">
            <select
              value={selectedDP1Team?.id || ''}
              onChange={(e) => setSelectedDP1TeamId(e.target.value)}
              className="px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900 max-w-xs focus:outline-none focus:border-indigo-500 cursor-pointer shadow-xs"
            >
              {eligibleTeams.map(t => (
                <option key={t.id} value={t.id}>
                  No. {t.lotNumber ? String(t.lotNumber).padStart(2, '0') : '--'} - {t.schoolName} ({t.jenjang})
                </option>
              ))}
            </select>
          </div>
        </div>

        {selectedDP1Team && (
          <div className="space-y-6">
            {/* Team Bar & Pass to DP 2 Button */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-mono font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  {selectedDP1Team.regCode} • No. Undi #{selectedDP1Team.lotNumber || '-'}
                </span>
                <h3 className="text-lg font-black text-slate-900 uppercase mt-1">{selectedDP1Team.schoolName}</h3>
                <p className="text-xs text-slate-500">{selectedDP1Team.platoonName}</p>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Terverifikasi</span>
                  <span className="text-sm font-mono font-black text-emerald-600">
                    {dp1VerifiedCount} / {dp1Personnels.length} Personel
                  </span>
                </div>

                <button
                  onClick={() => {
                    passToDP2(selectedDP1Team.id);
                    alert(`Peleton ${selectedDP1Team.schoolName} berhasil diloloskan ke DP 2 (Ruang Tunggu Steril)!`);
                  }}
                  className={`px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
                    isDP1AllVerified
                      ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-sm'
                      : 'bg-slate-200 text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <span>Loloskan ke DP 2</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Tablet/iPad Touch-Friendly Cards Grid (25 Personel: Danton + 21 Pasukan + 3 Cadangan) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
              {dp1Personnels.map((person) => {
                const verified = Boolean(dp1TeamInspections[person.id]?.verified);

                return (
                  <div
                    key={person.id}
                    className={`p-3.5 rounded-2xl border transition-all ${
                      verified
                        ? 'bg-emerald-50/70 border-emerald-300 shadow-xs'
                        : 'bg-white border-slate-200 shadow-xs'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {/* Pasfoto */}
                      <div className="w-16 h-20 bg-slate-100 rounded-xl overflow-hidden border border-slate-200 shrink-0 flex items-center justify-center">
                        {person.photo ? (
                          <img
                            src={person.photo}
                            alt={person.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Users className="w-6 h-6 text-slate-400" />
                        )}
                      </div>

                      {/* Biodata */}
                      <div className="flex-1 min-w-0">
                        <span className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded block w-fit mb-1 ${
                          person.isDanton ? 'bg-amber-100 text-amber-800 border border-amber-300' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {person.role}
                        </span>
                        <h4 className="font-bold text-xs text-slate-900 truncate" title={person.name}>
                          {person.name}
                        </h4>
                        <p className="text-[10px] text-slate-500">NISN: {person.nisn}</p>
                        <p className="text-[10px] text-slate-500">Kelas: {person.class}</p>

                        {/* Toggle Hadir / Sesuai Wajah */}
                        <div className="mt-2 flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => updateDP1PersonnelInspection(selectedDP1Team.id, person.id, !verified)}
                            className={`flex-1 py-1.5 px-2 rounded-lg text-[10px] font-bold uppercase transition-all flex items-center justify-center gap-1 cursor-pointer ${
                              verified
                                ? 'bg-emerald-600 text-white font-black shadow-xs'
                                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                            }`}
                          >
                            {verified ? (
                              <>
                                <UserCheck className="w-3.5 h-3.5" />
                                <span>Sesuai</span>
                              </>
                            ) : (
                              <>
                                <UserX className="w-3.5 h-3.5" />
                                <span>Periksa</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
