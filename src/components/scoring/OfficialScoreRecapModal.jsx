import React, { useState } from 'react';
import {
  X,
  Printer,
  FileCheck2
} from 'lucide-react';
import { useCompetition } from '../../context/CompetitionContext.jsx';
import { SITE, VENUE, TIMELINE, JURY_POSTS, PRIZES } from '../../config.js';
import logoImg from '../../assets/logo-tonti.png';

export default function OfficialScoreRecapModal({ isOpen, onClose, initialJenjang = 'ALL' }) {
  const { teams, scores } = useCompetition();
  const [selectedJenjang, setSelectedJenjang] = useState(initialJenjang);
  const [awardCategory, setAwardCategory] = useState('peleton'); // 'peleton' | 'danton' | 'umum'

  if (!isOpen) return null;

  // Filter & hitung skor tim
  const targetTeams = teams
    .filter(t => t.status === 'verified' || t.status === 'drawn')
    .filter(t => selectedJenjang === 'ALL' || t.jenjang === selectedJenjang);

  // Komputasi Skor sesuai Juknis Bab A.3.c
  const computedTeams = targetTeams.map(team => {
    const s = scores[team.id];
    const juries = s?.juries || {};

    // Skor Peleton 3 Dewan Juri
    const j1Peleton = Number(juries.pos1?.peletonTotal ?? juries.pos1?.total ?? s?.pbb?.j1 ?? 0);
    const j2Peleton = Number(juries.pos2?.peletonTotal ?? juries.pos2?.total ?? s?.pbb?.j2 ?? 0);
    const j3Peleton = Number(juries.pos3?.peletonTotal ?? s?.pbb?.j3 ?? 0);

    const nilaiMurniPeleton = s?.nilaiMurniPeleton !== undefined
      ? Number(s.nilaiMurniPeleton)
      : (j1Peleton + j2Peleton + j3Peleton || Number(s?.pbb?.total || 0));

    // Skor Danton 3 Dewan Juri
    const j1Danton = Number(juries.pos1?.dantonTotal ?? 0);
    const j2Danton = Number(juries.pos2?.dantonTotal ?? 0);
    const j3Danton = Number(juries.pos3?.dantonTotal ?? juries.pos3?.total ?? s?.danton?.total ?? 0);

    const nilaiMurniDanton = s?.nilaiMurniDanton !== undefined
      ? Number(s.nilaiMurniDanton)
      : parseFloat((j1Danton + j2Danton + j3Danton || Number(s?.danton?.total || 0)).toFixed(2));

    // Penalti
    const pen = s?.penalties || {};
    const peletonPenalty = Number(pen.peletonPenalty ?? pen.totalPenalty ?? 0);
    const dantonPenalty = Number(pen.dantonPenalty ?? 0);
    const totalPenalty = Number(pen.totalPenalty ?? peletonPenalty + dantonPenalty);

    // Nilai Akhir (Nilai Murni - Penalti)
    const nilaiAkhirPeleton = s?.nilaiAkhirPeleton !== undefined
      ? Number(s.nilaiAkhirPeleton)
      : Math.max(0, parseFloat((nilaiMurniPeleton - peletonPenalty).toFixed(2)));

    const nilaiAkhirDanton = s?.nilaiAkhirDanton !== undefined
      ? Number(s.nilaiAkhirDanton)
      : Math.max(0, parseFloat((nilaiMurniDanton - dantonPenalty).toFixed(2)));

    const finalScore = s?.finalScore !== undefined
      ? Number(s.finalScore)
      : parseFloat((nilaiAkhirPeleton + nilaiAkhirDanton).toFixed(2));

    // Nilai aspek Danton untuk tie-breaker (Materi 35% & Vokal 25%)
    const dantonRubric = juries.pos3?.dantonRubricScores || s?.danton?.rubricScores || {};
    const dantonMateri = Number(dantonRubric.materi || 0);
    const dantonVokal = Number(dantonRubric.vokal || 0);

    return {
      team,
      j1Peleton,
      j2Peleton,
      j3Peleton,
      nilaiMurniPeleton,
      peletonPenalty,
      nilaiAkhirPeleton,
      j1Danton,
      j2Danton,
      j3Danton,
      nilaiMurniDanton,
      dantonPenalty,
      nilaiAkhirDanton,
      dantonMateri,
      dantonVokal,
      totalPenalty,
      finalScore,
      scored: Boolean(s),
      status: s?.status || 'draft',
      verifiedBy: s?.verifiedBy || null,
      paperEvidenceUrl: s?.paperEvidenceUrl || null,
    };
  });

  // Sorting berdasar Tie-Breaker Resmi Juknis Bab A.5 & A.6
  const rankedTeams = [...computedTeams].sort((a, b) => {
    if (awardCategory === 'danton') {
      // 1. Nilai Akhir Komandan tertinggi
      if (b.nilaiAkhirDanton !== a.nilaiAkhirDanton) return b.nilaiAkhirDanton - a.nilaiAkhirDanton;
      // 2. Nilai Murni Danton tertinggi
      if (b.nilaiMurniDanton !== a.nilaiMurniDanton) return b.nilaiMurniDanton - a.nilaiMurniDanton;
      // 3. Akumulasi pengurangan poin penalti danton paling sedikit
      if (a.dantonPenalty !== b.dantonPenalty) return a.dantonPenalty - b.dantonPenalty;
      // 4. Aspek Penguasaan Materi (bobot 35%)
      if (b.dantonMateri !== a.dantonMateri) return b.dantonMateri - a.dantonMateri;
      // 5. Aspek Vokal (bobot 25%)
      return b.dantonVokal - a.dantonVokal;
    }

    if (awardCategory === 'peleton') {
      // 1. Nilai Akhir Peleton tertinggi
      if (b.nilaiAkhirPeleton !== a.nilaiAkhirPeleton) return b.nilaiAkhirPeleton - a.nilaiAkhirPeleton;
      // 2. Nilai Murni Peleton tertinggi
      if (b.nilaiMurniPeleton !== a.nilaiMurniPeleton) return b.nilaiMurniPeleton - a.nilaiMurniPeleton;
      // 3. Poin penalti peleton paling sedikit
      if (a.peletonPenalty !== b.peletonPenalty) return a.peletonPenalty - b.peletonPenalty;
      // 4. Nilai Murni Danton tertinggi
      return b.nilaiMurniDanton - a.nilaiMurniDanton;
    }

    // Default / Juara Peleton
    if (b.finalScore !== a.finalScore) return b.finalScore - a.finalScore;
    if (b.nilaiAkhirPeleton !== a.nilaiAkhirPeleton) return b.nilaiAkhirPeleton - a.nilaiAkhirPeleton;
    return b.nilaiAkhirDanton - a.nilaiAkhirDanton;
  });

  // Helper Penentuan Juara Peleton Resmi (Bab A.5)
  function getPeletonAwardTitle(rank) {
    if (rank === 1) return 'Juara 1 Peleton';
    if (rank === 2) return 'Juara 2 Peleton';
    if (rank === 3) return 'Juara 3 Peleton';
    if (rank === 4) return 'Juara Harapan 1 Peleton';
    if (rank === 5) return 'Juara Harapan 2 Peleton';
    if (rank === 6) return 'Juara Harapan 3 Peleton';
    return null;
  }

  // Helper Penentuan Juara Danton Resmi (Bab A.6)
  function getDantonAwardTitle(rank) {
    if (rank === 1) return 'Juara 1 Komandan Terbaik';
    if (rank === 2) return 'Juara 2 Komandan Terbaik';
    if (rank === 3) return 'Juara 3 Komandan Terbaik';
    return null;
  }

  // Hitung Akumulasi Poin Juara Umum Sekolah (Bab A.7)
  const schoolPointsMap = {};
  targetTeams.forEach(t => {
    if (!schoolPointsMap[t.schoolName]) {
      schoolPointsMap[t.schoolName] = {
        schoolName: t.schoolName,
        jenjang: t.jenjang,
        peletonPoints: 0,
        dantonPoints: 0,
        totalPoints: 0,
        achievements: [],
      };
    }
  });

  // Poin Peleton
  const peletonRanked = [...computedTeams].sort((a, b) => {
    if (b.nilaiAkhirPeleton !== a.nilaiAkhirPeleton) return b.nilaiAkhirPeleton - a.nilaiAkhirPeleton;
    if (b.nilaiMurniPeleton !== a.nilaiMurniPeleton) return b.nilaiMurniPeleton - a.nilaiMurniPeleton;
    return a.peletonPenalty - b.peletonPenalty;
  });

  peletonRanked.forEach((item, idx) => {
    const rank = idx + 1;
    const school = schoolPointsMap[item.team.schoolName];
    if (!school) return;
    let pts = 0;
    if (rank === 1) pts = 6;
    else if (rank === 2) pts = 5;
    else if (rank === 3) pts = 4;
    else if (rank === 4) pts = 3;
    else if (rank === 5) pts = 2;
    else if (rank === 6) pts = 1;

    if (pts > 0) {
      school.peletonPoints += pts;
      school.totalPoints += pts;
      school.achievements.push(`${getPeletonAwardTitle(rank)} (${pts} Poin)`);
    }
  });

  // Poin Danton
  const dantonRanked = [...computedTeams].sort((a, b) => {
    if (b.nilaiAkhirDanton !== a.nilaiAkhirDanton) return b.nilaiAkhirDanton - a.nilaiAkhirDanton;
    if (b.nilaiMurniDanton !== a.nilaiMurniDanton) return b.nilaiMurniDanton - a.nilaiMurniDanton;
    return a.dantonPenalty - b.dantonPenalty;
  });

  dantonRanked.forEach((item, idx) => {
    const rank = idx + 1;
    const school = schoolPointsMap[item.team.schoolName];
    if (!school) return;
    let pts = 0;
    if (rank === 1) pts = 3;
    else if (rank === 2) pts = 2;
    else if (rank === 3) pts = 1;

    if (pts > 0) {
      school.dantonPoints += pts;
      school.totalPoints += pts;
      school.achievements.push(`${getDantonAwardTitle(rank)} (${pts} Poin)`);
    }
  });

  const rankedSchools = Object.values(schoolPointsMap).sort((a, b) => b.totalPoints - a.totalPoints);

  function handlePrint() {
    window.print();
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 print:p-0 print:bg-white print:static">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-5xl overflow-hidden print:border-none print:shadow-none print:rounded-none">
        
        {/* Top Action Bar (Hidden when printing) */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black uppercase tracking-wide">Berita Acara Rekapitulasi Nilai Resmi</h2>
              <p className="text-xs text-slate-400">Petunjuk Teknis Penilaian LBB Mu'allimin 2027 (Bab A)</p>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* Filter Kategori Juara */}
            <div className="flex items-center bg-slate-800 rounded-xl p-1 border border-slate-700">
              <button
                type="button"
                onClick={() => setAwardCategory('peleton')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  awardCategory === 'peleton' ? 'bg-blue-600 text-white font-black' : 'text-slate-400 hover:text-white'
                }`}
              >
                Peleton
              </button>
              <button
                type="button"
                onClick={() => setAwardCategory('danton')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  awardCategory === 'danton' ? 'bg-red-600 text-white font-black' : 'text-slate-400 hover:text-white'
                }`}
              >
                Komandan
              </button>
              <button
                type="button"
                onClick={() => setAwardCategory('umum')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  awardCategory === 'umum' ? 'bg-amber-500 text-slate-950 font-black' : 'text-slate-400 hover:text-white'
                }`}
              >
                Juara Umum
              </button>
            </div>

            {/* Filter Jenjang */}
            <div className="flex items-center bg-slate-800 rounded-xl p-1 border border-slate-700">
              <button
                type="button"
                onClick={() => setSelectedJenjang('ALL')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  selectedJenjang === 'ALL' ? 'bg-white text-slate-950 font-black' : 'text-slate-400 hover:text-white'
                }`}
              >
                Semua
              </button>
              <button
                type="button"
                onClick={() => setSelectedJenjang('SMP')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  selectedJenjang === 'SMP' ? 'bg-white text-slate-950 font-black' : 'text-slate-400 hover:text-white'
                }`}
              >
                SMP/MTs
              </button>
              <button
                type="button"
                onClick={() => setSelectedJenjang('SD')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  selectedJenjang === 'SD' ? 'bg-white text-slate-950 font-black' : 'text-slate-400 hover:text-white'
                }`}
              >
                SD/MI
              </button>
            </div>

            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow transition-all active:scale-95 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak / PDF</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="p-8 sm:p-10 text-slate-900 bg-white print:p-6 print:m-0" id="printable-recap">
          {/* Header Kop Surat */}
          <div className="border-b-4 border-double border-slate-900 pb-5 mb-6">
            <div className="flex items-center justify-between gap-4">
              <div className="w-20 h-20 shrink-0 flex items-center justify-center">
                <img src={logoImg} alt="Logo Tonti" className="w-20 h-20 object-contain" />
              </div>
              <div className="text-center flex-1">
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-600">
                  PANITIA PELAKSANA LOMBA BARIS-BERBARIS
                </h3>
                <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-slate-950">
                  LBB MU'ALLIMIN 2027
                </h1>
                <p className="text-xs font-semibold text-slate-700 mt-1">
                  KORPS PELETON INTI (TONTI) MADRASAH MU'ALLIMIN MUHAMMADIYAH YOGYAKARTA
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Kampus Terpadu Mu'allimin, Sedayu, Bantul, D.I. Yogyakarta | Website: lbb.tontimuallimin.com
                </p>
              </div>
              <div className="w-20 h-20 shrink-0 flex flex-col items-center justify-center border-2 border-slate-900 rounded-xl p-1 text-center">
                <span className="text-[9px] font-black uppercase text-slate-600">Dokumen</span>
                <span className="text-xs font-black text-red-700 uppercase">RESMI</span>
                <span className="text-[8px] font-mono text-slate-500">BA-LBB-27</span>
              </div>
            </div>
          </div>

          {/* Title & Metadata */}
          <div className="text-center mb-6">
            <h2 className="text-base sm:text-lg font-black uppercase underline decoration-2 underline-offset-4 tracking-wide text-slate-950">
              BERITA ACARA REKAPITULASI HASIL PENILAIAN DEWAN JURI
            </h2>
            <p className="text-xs text-slate-600 mt-1">
              Nomor: 042/BA-JURI/LBB-MUALLIMIN/{new Date().getFullYear()}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-slate-700 mt-3 bg-slate-50 border border-slate-200 py-2 px-4 rounded-xl">
              <span><strong>Jenjang:</strong> {selectedJenjang === 'ALL' ? 'SD/MI & SMP/MTs' : (selectedJenjang === 'SMP' ? 'Tingkat SMP/MTs' : 'Tingkat SD/MI')}</span>
              <span>•</span>
              <span><strong>Kategori:</strong> {
                awardCategory === 'danton' ? 'Penilaian Komandan Peleton (Danton)' :
                awardCategory === 'peleton' ? 'Penilaian Performa Materi Peleton' :
                'Akumulasi Poin Prestasi Juara Umum'
              }</span>
              <span>•</span>
              <span><strong>Tanggal:</strong> {TIMELINE.COMPETITION_DATE}</span>
              <span>•</span>
              <span><strong>Lokasi:</strong> {VENUE.NAME}</span>
            </div>
          </div>

          {/* TABEL 1 & 2: REKAP PELETON / DANTON */}
          {awardCategory !== 'umum' && (
            <div className="overflow-x-auto rounded-xl border border-slate-300 mb-8">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-slate-900 text-white font-bold text-[11px] uppercase tracking-wider text-center">
                    <th className="py-2.5 px-2 border-r border-slate-700 w-10">Rank</th>
                    <th className="py-2.5 px-2 border-r border-slate-700 w-12">No. Undi</th>
                    <th className="py-2.5 px-3 border-r border-slate-700 text-left">Peleton & Asal Sekolah</th>
                    <th className="py-2.5 px-2 border-r border-slate-700 w-14">Jenjang</th>
                    
                    {/* Kolom Juri 1, 2, 3 */}
                    <th className="py-2.5 px-2 border-r border-slate-700 w-18 bg-slate-800">
                      Juri 1
                    </th>
                    <th className="py-2.5 px-2 border-r border-slate-700 w-18 bg-slate-800">
                      Juri 2
                    </th>
                    <th className="py-2.5 px-2 border-r border-slate-700 w-18 bg-slate-800">
                      Juri 3
                    </th>

                    {/* Nilai Murni */}
                    <th className="py-2.5 px-2 border-r border-slate-700 w-20 bg-slate-800 font-black">
                      Nilai Murni
                    </th>

                    {/* Penalti */}
                    <th className="py-2.5 px-2 border-r border-slate-700 w-16 text-red-300">
                      Penalti
                    </th>

                    {/* Nilai Akhir */}
                    <th className="py-2.5 px-3 w-24 bg-amber-500 text-slate-950 font-black">
                      Nilai Akhir
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-medium">
                  {rankedTeams.map((item, idx) => {
                    const rank = idx + 1;
                    const isPodium = rank <= 3;
                    const title = awardCategory === 'danton'
                      ? getDantonAwardTitle(rank)
                      : getPeletonAwardTitle(rank);

                    const j1 = awardCategory === 'danton' ? item.j1Danton : item.j1Peleton;
                    const j2 = awardCategory === 'danton' ? item.j2Danton : item.j2Peleton;
                    const j3 = awardCategory === 'danton' ? item.j3Danton : item.j3Peleton;
                    const murni = awardCategory === 'danton' ? item.nilaiMurniDanton : item.nilaiMurniPeleton;
                    const penalti = awardCategory === 'danton' ? item.dantonPenalty : item.peletonPenalty;
                    const akhir = awardCategory === 'danton' ? item.nilaiAkhirDanton : item.nilaiAkhirPeleton;

                    return (
                      <tr
                        key={item.team.id}
                        className={`text-center ${isPodium ? 'bg-amber-50/40 font-semibold' : (idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/60')}`}
                      >
                        <td className="py-2.5 px-2 border-r border-slate-200">
                          {isPodium ? (
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-400 text-slate-950 font-black text-xs">
                              {rank}
                            </span>
                          ) : (
                            <span className="text-slate-600 font-bold">{rank}</span>
                          )}
                        </td>
                        <td className="py-2.5 px-2 border-r border-slate-200 font-mono font-bold text-slate-900">
                          {item.team.lotNumber ? String(item.team.lotNumber).padStart(2, '0') : '-'}
                        </td>
                        <td className="py-2.5 px-3 border-r border-slate-200 text-left">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-slate-900">{item.team.schoolName}</span>
                            {title && (
                              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-amber-400 text-slate-950 border border-amber-500/40">
                                {title}
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-slate-500">
                            {item.team.platoonName} • Komandan: {item.team.roster?.danton?.name || item.team.dantonName || '-'}
                          </div>
                        </td>
                        <td className="py-2.5 px-2 border-r border-slate-200 font-bold text-slate-700">
                          {item.team.jenjang}
                        </td>
                        <td className="py-2.5 px-2 border-r border-slate-200 font-mono text-slate-800">
                          {j1 > 0 ? j1 : '-'}
                        </td>
                        <td className="py-2.5 px-2 border-r border-slate-200 font-mono text-slate-800">
                          {j2 > 0 ? j2 : '-'}
                        </td>
                        <td className="py-2.5 px-2 border-r border-slate-200 font-mono text-slate-800">
                          {j3 > 0 ? j3 : '-'}
                        </td>
                        <td className="py-2.5 px-2 border-r border-slate-200 font-mono font-bold text-slate-900 bg-slate-50">
                          {murni > 0 ? murni : '-'}
                        </td>
                        <td className="py-2.5 px-2 border-r border-slate-200 font-mono text-red-600 font-bold">
                          {penalti > 0 ? `-${penalti}` : '0'}
                        </td>
                        <td className="py-2.5 px-3 font-mono font-black text-sm text-slate-950 bg-amber-100/40">
                          {akhir > 0 ? akhir : '-'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* TABEL 3: REKAPITULASI JUARA UMUM (POIN PRESTASI SEKOLAH) */}
          {awardCategory === 'umum' && (
            <div className="overflow-x-auto rounded-xl border border-slate-300 mb-8">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-slate-900 text-white font-bold text-[11px] uppercase tracking-wider text-center">
                    <th className="py-2.5 px-2 border-r border-slate-700 w-10">Rank</th>
                    <th className="py-2.5 px-4 border-r border-slate-700 text-left">Pangkalan / Asal Sekolah</th>
                    <th className="py-2.5 px-2 border-r border-slate-700 w-16">Jenjang</th>
                    <th className="py-2.5 px-3 border-r border-slate-700 text-left">Rincian Prestasi Diraih</th>
                    <th className="py-2.5 px-3 border-r border-slate-700 w-24">Poin Peleton</th>
                    <th className="py-2.5 px-3 border-r border-slate-700 w-24">Poin Danton</th>
                    <th className="py-2.5 px-4 w-28 bg-amber-500 text-slate-950 font-black">Total Poin</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-medium">
                  {rankedSchools.map((item, idx) => {
                    const rank = idx + 1;
                    const isWinner = rank === 1 && item.totalPoints > 0;
                    return (
                      <tr
                        key={item.schoolName}
                        className={`text-center ${isWinner ? 'bg-amber-50 font-bold' : (idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/60')}`}
                      >
                        <td className="py-2.5 px-2 border-r border-slate-200">
                          {isWinner ? (
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-400 text-slate-950 font-black text-xs">
                              🏆
                            </span>
                          ) : (
                            <span className="text-slate-600 font-bold">{rank}</span>
                          )}
                        </td>
                        <td className="py-2.5 px-4 border-r border-slate-200 text-left">
                          <span className="font-bold text-slate-900 text-sm">{item.schoolName}</span>
                          {isWinner && (
                            <span className="ml-2 text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-amber-400 text-slate-950">
                              JUARA UMUM ({item.jenjang})
                            </span>
                          )}
                        </td>
                        <td className="py-2.5 px-2 border-r border-slate-200 font-bold text-slate-700">
                          {item.jenjang}
                        </td>
                        <td className="py-2.5 px-3 border-r border-slate-200 text-left">
                          {item.achievements.length > 0 ? (
                            <div className="space-y-0.5">
                              {item.achievements.map((ach, aIdx) => (
                                <span key={aIdx} className="inline-block text-[10px] bg-slate-100 text-slate-800 px-2 py-0.5 rounded mr-1.5 mb-1 font-semibold border border-slate-200">
                                  {ach}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span className="text-slate-400 text-[10px] italic">Belum meraih poin</span>
                          )}
                        </td>
                        <td className="py-2.5 px-3 border-r border-slate-200 font-mono font-bold text-slate-800">
                          {item.peletonPoints} Poin
                        </td>
                        <td className="py-2.5 px-3 border-r border-slate-200 font-mono font-bold text-slate-800">
                          {item.dantonPoints} Poin
                        </td>
                        <td className="py-2.5 px-4 font-mono font-black text-base text-slate-950 bg-amber-100/50">
                          {item.totalPoints}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Legal Statement Resmi */}
          <div className="text-xs text-slate-600 leading-relaxed mb-10 border-l-2 border-slate-400 pl-3">
            Sesuai Petunjuk Teknis Penilaian LBB Mu'allimin 2027 Bab A Angka 3, 4, 5, dan 6: Nilai Murni merupakan akumulasi total skor dari 3 Dewan Juri sebelum dikurangi penalti lapangan. Penentuan Juara Peleton didasarkan pada perolehan Nilai Akhir Peleton tertinggi, sedangkan Juara Komandan didasarkan pada Nilai Akhir Komandan tertinggi. Keputusan Dewan Juri bersifat mutlak dan tidak dapat diganggu gugat.
          </div>

          {/* Official Signatures Grid: 3 Dewan Juri Resmi */}
          <div className="grid grid-cols-3 gap-6 text-center text-xs pt-4 print:pt-2 border-t border-slate-200">
            {/* Juri 1 */}
            <div className="flex flex-col items-center justify-between h-36">
              <div>
                <p className="font-bold text-slate-800">
                  {selectedJenjang === 'SMP' ? 'Juri 1 SMP' : selectedJenjang === 'SD' ? 'Juri 1 SD' : 'Dewan Juri 1'}
                </p>
                <p className="text-[11px] text-slate-500">Dewan Juri Penilai</p>
              </div>
              <div className="w-40 border-b border-slate-900 pb-1">
                <span className="font-bold text-slate-900">
                  {selectedJenjang === 'SMP' ? 'Juri 1 SMP' : selectedJenjang === 'SD' ? 'Juri 1 SD' : 'Juri 1'}
                </span>
              </div>
            </div>

            {/* Juri 2 */}
            <div className="flex flex-col items-center justify-between h-36">
              <div>
                <p className="font-bold text-slate-800">
                  {selectedJenjang === 'SMP' ? 'Juri 2 SMP' : selectedJenjang === 'SD' ? 'Juri 2 SD' : 'Dewan Juri 2'}
                </p>
                <p className="text-[11px] text-slate-500">Dewan Juri Penilai</p>
              </div>
              <div className="w-40 border-b border-slate-900 pb-1">
                <span className="font-bold text-slate-900">
                  {selectedJenjang === 'SMP' ? 'Juri 2 SMP' : selectedJenjang === 'SD' ? 'Juri 2 SD' : 'Juri 2'}
                </span>
              </div>
            </div>

            {/* Juri 3 */}
            <div className="flex flex-col items-center justify-between h-36">
              <div>
                <p className="font-bold text-slate-800">
                  {selectedJenjang === 'SMP' ? 'Juri 3 SMP' : selectedJenjang === 'SD' ? 'Juri 3 SD' : 'Dewan Juri 3'}
                </p>
                <p className="text-[11px] text-slate-500">Dewan Juri Penilai</p>
              </div>
              <div className="w-40 border-b border-slate-900 pb-1">
                <span className="font-bold text-slate-900">
                  {selectedJenjang === 'SMP' ? 'Juri 3 SMP' : selectedJenjang === 'SD' ? 'Juri 3 SD' : 'Juri 3'}
                </span>
              </div>
            </div>
          </div>

          {/* Ketua Panitia & Koordinator Dewan Juri */}
          <div className="grid grid-cols-2 gap-12 text-center text-xs mt-8 pt-4">
            <div className="flex flex-col items-center justify-between h-32">
              <p className="font-bold text-slate-800">Mengetahui,<br />Ketua Panitia LBB Mu'allimin 2027</p>
              <div className="w-48 border-b border-slate-900 pb-1">
                <span className="font-bold text-slate-900">Falhan Zuhdi Mubarok</span>
              </div>
            </div>

            <div className="flex flex-col items-center justify-between h-32">
              <p className="font-bold text-slate-800">Menyetujui,<br />Koordinator Dewan Juri</p>
              <div className="w-48 border-b border-slate-900 pb-1">
                <span className="font-bold text-slate-900">Koordinator Dewan Juri</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
