import React, { useState } from 'react';
import {
  Compass,
  Calendar,
  Clock,
  MapPin,
  ExternalLink,
  ShieldCheck,
  Users,
  CheckCircle2,
  AlertTriangle,
  Info,
  Flag,
  Swords,
  Trophy,
  ArrowRight,
  Maximize2,
  Timer
} from 'lucide-react';
import { useCompetition } from '../../context/CompetitionContext.jsx';
import { EVENT, VENUE } from '../../config.js';
import { RUNDOWN_DATA } from '../../data/juknisDocsData.js';
import SimpaskorSidebarLayout from '../navigation/SimpaskorSidebarLayout.jsx';

export default function FieldTrialView() {
  const { teams, currentUser, role, setActiveView } = useCompetition();
  const [selectedJenjang, setSelectedJenjang] = useState('ALL');
  const [showParallelTable, setShowParallelTable] = useState(true);

  // Teams eligible for field trial: registered, verified, drawn
  const trialTeams = teams.filter(t => ['registered', 'verified', 'drawn'].includes(t.status));
  const sdTeams = trialTeams.filter(t => t.jenjang === 'SD');
  const smpTeams = trialTeams.filter(t => t.jenjang === 'SMP');

  const filteredTeams = selectedJenjang === 'ALL'
    ? trialTeams
    : trialTeams.filter(t => t.jenjang === selectedJenjang);

  // Generate official schedule slot for each team according to Section B Juknis:
  // 15 minutes per peleton, running parallel in Arena 1 & Arena 2 starting at 07.00 WIB
  const getTrialSlot = (team, index) => {
    const isSD = team.jenjang === 'SD';
    const teamIndex = isSD ? sdTeams.findIndex(t => t.id === team.id) : smpTeams.findIndex(t => t.id === team.id);
    const safeIndex = teamIndex >= 0 ? teamIndex : index;

    const baseMinutes = 7 * 60; // 07.00 WIB start
    const startMinutes = baseMinutes + (safeIndex % 18) * 15;
    const startH = String(Math.floor(startMinutes / 60)).padStart(2, '0');
    const startM = String(startMinutes % 60).padStart(2, '0');
    const endMinutes = startMinutes + 15;
    const endH = String(Math.floor(endMinutes / 60)).padStart(2, '0');
    const endM = String(endMinutes % 60).padStart(2, '0');

    return `${startH}.${startM} – ${endH}.${endM} WIB`;
  };

  return (
    <SimpaskorSidebarLayout
      activeMenu="uji_coba"
      title="Uji Coba Lapangan"
      subtitle="Jadwal gladi adaptasi kontur arena, alur lintasan, & orientasi lapangan LBB 2027"
      rightActions={
        <a
          href={VENUE.MAPS_URL || "https://maps.app.goo.gl/fVMgg5xZcwRQ4kN78"}
          target="_blank"
          rel="noopener noreferrer"
          className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-md shadow-emerald-950/20 cursor-pointer"
        >
          <MapPin className="w-4 h-4" />
          <span className="hidden sm:inline">Rute Lokasi Arena</span>
          <ExternalLink className="w-3.5 h-3.5 opacity-80" />
        </a>
      }
    >
      <div className="space-y-6">

        {/* Hero Banner Uji Coba Lapangan */}
        <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-emerald-900/40 relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-black uppercase tracking-wider">
                <Compass className="w-3.5 h-3.5" />
                <span>Tahap Orientasi & Simulasi Lapangan</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">
                Uji Coba Lapangan & Orientasi Kontur
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                Fasilitas gladi resmi bagi seluruh peleton terdaftar untuk beradaptasi dengan kontur, angin, batas arena, dan akustik aba-aba komandan peleton di Kampus Terpadu Sedayu.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-4 sm:p-5 shrink-0 space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-300">
                <Calendar className="w-4 h-4" />
                <span>{EVENT.FIELD_TRIAL_FULL_DATE || 'Sabtu, 16 Januari 2027'}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-200">
                <Clock className="w-4 h-4 text-emerald-400" />
                <span>{EVENT.FIELD_TRIAL_TIME_RANGE || '06.30 – 12.00 WIB'}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="truncate max-w-[200px]">{VENUE.NAME}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 3 Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center font-black shrink-0">
              <Timer className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-slate-500 uppercase block">Durasi Efektif Arena</span>
              <span className="text-xl font-black text-slate-900 font-mono">15 Menit/Tim</span>
              <p className="text-[10px] text-slate-400 mt-0.5">8 mnt SD, 12 mnt SMP (+ 5 mnt transisi)</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center font-black shrink-0">
              <Swords className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-slate-500 uppercase block">Arena 1 (SD/MI)</span>
              <span className="text-2xl font-black text-slate-900 font-mono">{sdTeams.length} Tim</span>
              <p className="text-[10px] text-slate-400 mt-0.5">Lapangan Basket Outdoor (07.00 – 11.30)</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center font-black shrink-0">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-slate-500 uppercase block">Arena 2 (SMP/MTs)</span>
              <span className="text-2xl font-black text-slate-900 font-mono">{smpTeams.length} Tim</span>
              <p className="text-[10px] text-slate-400 mt-0.5">Pelataran Embung (07.00 – 11.30)</p>
            </div>
          </div>
        </div>

        {/* SOP & Ketentuan Gladi Lapangan */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center">
              <Info className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 uppercase">
                Protokol & Ketentuan Orientasi Lapangan
              </h3>
              <p className="text-xs text-slate-500">
                Harap ditaati oleh seluruh pembina, pelatih, komandan peleton, dan anggota pasukan
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-xs font-bold text-slate-900 block">Pakaian Seragam Latihan</strong>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  Peserta tidak wajib memakai seragam lomba resmi. Diperkenankan menggunakan seragam olahraga sekolah / pakaian training kontingen yang rapi dan sopan.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-xs font-bold text-slate-900 block">Waktu Kedatangan Kontingen</strong>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  Peleton wajib tiba di area Kampus Terpadu Sedayu paling lambat 20 menit sebelum jadwal estimasi sesi uji coba masing-masing dimulai.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-xs font-bold text-slate-900 block">Simulasi Masuk & Keluar Arena</strong>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  Manfaatkan waktu efektif uji coba (8 menit SD / 12 menit SMP) untuk mengenali titik DP (Daerah Persiapan), jalur lintas langkah tegap masuk arena, dan arah hadap peleton terhadap meja dewan juri.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-xs font-bold text-slate-900 block">Kebersihan Ruang Transit Gladi</strong>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  Setiap kontingen bertanggung jawab penuh atas kebersihan area istirahat / selasar tunggu yang digunakan selama pelaksanaan uji coba berlangsung.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Rundown Resmi Uji Coba: 2 Arena Paralel (Section B Juknis) */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md bg-teal-50 text-teal-800 border border-teal-200 text-[10px] font-black uppercase tracking-wider">
                  Bagian B Juknis
                </span>
                <h3 className="text-base font-black text-slate-900 uppercase">
                  Rundown Uji Coba Lapangan (2 Arena Paralel)
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Sabtu, 16 Januari 2027 • 18 Slot 15 Menit/Peleton di Kampus Terpadu Sedayu
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowParallelTable(!showParallelTable)}
                className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>{showParallelTable ? 'Tutup Matriks' : 'Buka Matriks Paralel'}</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveView('rundown')}
                className="px-3.5 py-1.5 rounded-xl bg-teal-700 hover:bg-teal-600 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <span>Rundown Lengkap</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>

          {showParallelTable && (
            <div className="rounded-2xl border border-slate-200 overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900 text-white uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="py-2.5 px-3 text-center w-12">No</th>
                    <th className="py-2.5 px-4 w-36">Waktu (WIB)</th>
                    <th className="py-2.5 px-4 bg-red-950/80 text-red-100 border-r border-slate-800">
                      Arena 1 (SD/MI - Lapangan Basket)
                    </th>
                    <th className="py-2.5 px-4 bg-blue-950/80 text-blue-100">
                      Arena 2 (SMP/MTs - Pelataran Embung)
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-sans">
                  {RUNDOWN_DATA.trial.slots.map((slot, idx) => {
                    const isSpecial = idx === 0 || idx === RUNDOWN_DATA.trial.slots.length - 1;
                    return (
                      <tr key={idx} className={`${isSpecial ? 'bg-slate-50 font-bold' : 'hover:bg-slate-50'} transition-colors`}>
                        <td className="py-2.5 px-3 text-center font-mono text-slate-400">
                          {idx === 0 ? '-' : idx === RUNDOWN_DATA.trial.slots.length - 1 ? '-' : idx}
                        </td>
                        <td className="py-2.5 px-4 font-bold font-mono text-slate-900 whitespace-nowrap">{slot.time} WIB</td>
                        <td className="py-2.5 px-4 border-r border-slate-100 text-red-700 font-semibold">{slot.arena1}</td>
                        <td className="py-2.5 px-4 text-blue-700 font-semibold">{slot.arena2}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Jadwal Antrean Uji Coba per Peleton */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-black text-slate-900 uppercase">
                Estimasi Jadwal Sesi Gladi Peleton
              </h3>
              <p className="text-xs text-slate-500">
                Slot waktu alokasi orientasi lapangan per sekolah terverifikasi
              </p>
            </div>

            {/* Filter Jenjang */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
              {[
                { id: 'ALL', label: 'Semua Peleton' },
                { id: 'SD', label: 'SD / MI' },
                { id: 'SMP', label: 'SMP / MTs' },
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setSelectedJenjang(f.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    selectedJenjang === f.id
                      ? 'bg-white text-slate-950 shadow-xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {filteredTeams.length === 0 ? (
            <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <Compass className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-600">Belum ada tim yang terverifikasi</p>
              <p className="text-xs text-slate-400 mt-1">Peleton akan otomatis terjadwal setelah lolos verifikasi berkas</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase text-[10px] tracking-wider">
                    <th className="py-3 px-3">No</th>
                    <th className="py-3 px-3">Slot Waktu</th>
                    <th className="py-3 px-3">Peleton / Sekolah</th>
                    <th className="py-3 px-3">Jenjang & Arena</th>
                    <th className="py-3 px-3">Danton & Pembina</th>
                    <th className="py-3 px-3">Status Berkas</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredTeams.map((team, idx) => {
                    const slot = getTrialSlot(team, idx);
                    const isSD = team.jenjang === 'SD';

                    return (
                      <tr key={team.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-3 font-mono font-bold text-slate-400">
                          {String(idx + 1).padStart(2, '0')}
                        </td>
                        <td className="py-3.5 px-3">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 font-mono font-bold text-[11px]">
                            <Clock className="w-3 h-3 text-emerald-600" />
                            {slot}
                          </span>
                        </td>
                        <td className="py-3.5 px-3">
                          <div className="font-bold text-slate-900">{team.schoolName}</div>
                          <div className="text-[10px] text-slate-400 font-mono">{team.regCode}</div>
                        </td>
                        <td className="py-3.5 px-3">
                          <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 text-slate-700 border border-slate-200">
                            {team.jenjang} • {isSD ? 'Arena Basket' : 'Pelataran Embung'}
                          </span>
                        </td>
                        <td className="py-3.5 px-3 text-slate-600">
                          <div className="font-semibold text-slate-800">{team.dantonName || '-'}</div>
                          <div className="text-[10px] text-slate-400">Pembina: {team.coachName || '-'}</div>
                        </td>
                        <td className="py-3.5 px-3">
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3" />
                            Siap Gladi
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Lokasi & Embed Maps Kampus Terpadu Sedayu */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-black text-slate-900 uppercase">
                Lokasi Gladi: Kampus Terpadu Sedayu
              </h3>
              <p className="text-xs text-slate-500">{VENUE.ADDRESS}</p>
            </div>
            <a
              href={VENUE.MAPS_URL || "https://maps.app.goo.gl/fVMgg5xZcwRQ4kN78"}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer active:scale-95"
            >
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              <span>Petunjuk Arah Google Maps</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-70" />
            </a>
          </div>

          <div className="rounded-2xl overflow-hidden border border-slate-200 aspect-[16/7] w-full bg-slate-100 relative">
            <iframe
              title="Google Maps Lokasi Kampus Terpadu Sedayu"
              src={VENUE.MAPS_EMBED_URL || "https://maps.google.com/maps?q=-7.806784,110.2683762&hl=id&z=15&output=embed"}
              className="w-full h-full border-0"
              allowFullScreen=""
              loading="lazy"
            />
          </div>
        </div>

      </div>
    </SimpaskorSidebarLayout>
  );
}
