import React, { useState } from 'react';
import {
  X,
  Printer,
  Award,
  Shield,
  FileCheck2,
  Calendar,
  MapPin,
  Clock,
  Sparkles,
  Trophy,
  Filter
} from 'lucide-react';
import { useCompetition } from '../../context/CompetitionContext.jsx';
import { SITE, COMPETITION, VENUE, TIMELINE, JURY_POSTS } from '../../config.js';
import logoImg from '../../assets/logo-tonti.png';

export default function OfficialScoreRecapModal({ isOpen, onClose, initialJenjang = 'ALL' }) {
  const { teams, scores } = useCompetition();
  const [selectedJenjang, setSelectedJenjang] = useState(initialJenjang);
  const [awardCategory, setAwardCategory] = useState('all'); // 'all' | 'danton' | 'pbb'

  if (!isOpen) return null;

  // Filter & rank verified/drawn teams
  const targetTeams = teams
    .filter(t => t.status === 'verified' || t.status === 'drawn')
    .filter(t => selectedJenjang === 'ALL' || t.jenjang === selectedJenjang);

  // Compute ranks
  const computedTeams = [...targetTeams].map(team => {
    const s = scores[team.id];
    const juries = s?.juries || {};

    const juri1Teknik = juries.pos1?.total !== undefined
      ? Number(juries.pos1.total)
      : (s?.pbb?.total !== undefined ? Number(s.pbb.total) : (s?.pbb?.j1 !== undefined ? Number(s.pbb.j1) : 0));

    const juri2Kekompakan = juries.pos2?.total !== undefined
      ? Number(juries.pos2.total)
      : (s?.kekompakan?.total !== undefined ? Number(s.kekompakan.total) : (s?.pbb?.j2 !== undefined ? Number(s.pbb.j2) : 0));

    // Peleton combined: (J1 Teknik * 70%) + (J2 Kekompakan * 30%)
    const peletonCombined = (juri1Teknik > 0 && juri2Kekompakan > 0)
      ? parseFloat((juri1Teknik * 0.7 + juri2Kekompakan * 0.3).toFixed(2))
      : (juri1Teknik || juri2Kekompakan || 0);

    const juri3Danton = juries.pos3?.total !== undefined
      ? Number(juries.pos3.total)
      : (s?.danton?.total !== undefined ? Number(s.danton.total) : 0);

    const penaltiesTotal = s?.penalties?.totalPenalty !== undefined
      ? Number(s.penalties.totalPenalty)
      : 0;

    const finalScore = s?.finalScore !== undefined
      ? Number(s.finalScore)
      : Math.max(0, parseFloat((peletonCombined + juri3Danton - penaltiesTotal).toFixed(2)));

    return {
      team,
      juri1Teknik,
      juri2Kekompakan,
      peletonCombined,
      juri3Danton,
      penaltiesTotal,
      finalScore: isNaN(finalScore) ? 0 : finalScore,
      scored: Boolean(s),
      status: s?.status || 'draft',
      verifiedBy: s?.verifiedBy || null,
      paperEvidenceUrl: s?.paperEvidenceUrl || null,
    };
  });

  // Sort based on award category with official Multi-Tier Tie Breaker (Juknis LBB Mu'allimin)
  const rankedTeams = computedTeams.sort((a, b) => {
    if (awardCategory === 'danton') {
      if (b.juri3Danton !== a.juri3Danton) return b.juri3Danton - a.juri3Danton;
      return a.penaltiesTotal - b.penaltiesTotal;
    }
    if (awardCategory === 'pbb') {
      if (b.peletonCombined !== a.peletonCombined) return b.peletonCombined - a.peletonCombined;
      if (b.juri1Teknik !== a.juri1Teknik) return b.juri1Teknik - a.juri1Teknik;
      return a.penaltiesTotal - b.penaltiesTotal;
    }
    if (awardCategory === 'kekompakan') {
      if (b.juri2Kekompakan !== a.juri2Kekompakan) return b.juri2Kekompakan - a.juri2Kekompakan;
      return a.penaltiesTotal - b.penaltiesTotal;
    }
    // Juara Umum / Akumulasi Utama:
    // 1. Total Final Score
    if (b.finalScore !== a.finalScore) return b.finalScore - a.finalScore;
    // 2. Tie Breaker 1: Nilai Murni Peleton (70:30)
    if (b.peletonCombined !== a.peletonCombined) return b.peletonCombined - a.peletonCombined;
    // 3. Tie Breaker 2: Nilai Murni Juri 1 (Kebenaran Teknik PBB)
    if (b.juri1Teknik !== a.juri1Teknik) return b.juri1Teknik - a.juri1Teknik;
    // 4. Tie Breaker 3: Nilai Murni Juri 2 (Kekompakan Peleton)
    if (b.juri2Kekompakan !== a.juri2Kekompakan) return b.juri2Kekompakan - a.juri2Kekompakan;
    // 5. Tie Breaker 4: Nilai Murni Juri 3 (Danton)
    if (b.juri3Danton !== a.juri3Danton) return b.juri3Danton - a.juri3Danton;
    // 6. Tie Breaker 5: Poin Penalti Terkecil
    return a.penaltiesTotal - b.penaltiesTotal;
  });

  // Helper title gelar juara resmi berdasarkan proposal & juknis
  function getAwardTitle(rank) {
    if (awardCategory === 'danton') {
      if (rank === 1) return 'Danton Terbaik I';
      if (rank === 2) return 'Danton Terbaik II';
      if (rank === 3) return 'Danton Terbaik III';
      return null;
    }
    if (awardCategory === 'pbb') {
      if (rank === 1) return 'Peleton PBB Terbaik';
      return null;
    }
    if (awardCategory === 'kekompakan') {
      if (rank === 1) return 'Kekompakan Terbaik';
      return null;
    }
    // Juara Umum / Utama
    if (rank === 1) return 'Juara Utama I (Piala Bergilir)';
    if (rank === 2) return 'Juara Utama II';
    if (rank === 3) return 'Juara Utama III';
    if (rank === 4) return 'Juara Harapan I';
    if (rank === 5) return 'Juara Harapan II';
    if (rank === 6) return 'Juara Harapan III';
    return null;
  }

  function handlePrint() {
    window.print();
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 print:p-0 print:bg-white print:static">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-5xl overflow-hidden print:border-none print:shadow-none print:rounded-none">
        {/* Top Action Bar (Hidden when printing) */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-yellow-500/20 text-yellow-400 flex items-center justify-center font-bold">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black uppercase tracking-wide">Berita Acara Rekapitulasi Nilai Resmi</h2>
              <p className="text-xs text-slate-400">Format Cetak Dokumen Dewan Juri & Panitia Pelaksana</p>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* Filter Kategori Juara */}
            <div className="flex items-center bg-slate-800 rounded-xl p-1 border border-slate-700">
              <button
                onClick={() => setAwardCategory('all')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  awardCategory === 'all' ? 'bg-amber-400 text-slate-950 font-black' : 'text-slate-400 hover:text-white'
                }`}
              >
                Juara Umum
              </button>
              <button
                onClick={() => setAwardCategory('pbb')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  awardCategory === 'pbb' ? 'bg-blue-500 text-white font-black' : 'text-slate-400 hover:text-white'
                }`}
              >
                Peleton PBB
              </button>
              <button
                onClick={() => setAwardCategory('kekompakan')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  awardCategory === 'kekompakan' ? 'bg-purple-500 text-white font-black' : 'text-slate-400 hover:text-white'
                }`}
              >
                Kekompakan
              </button>
              <button
                onClick={() => setAwardCategory('danton')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  awardCategory === 'danton' ? 'bg-red-500 text-white font-black' : 'text-slate-400 hover:text-white'
                }`}
              >
                Danton Terbaik
              </button>
            </div>

            {/* Filter Jenjang */}
            <div className="flex items-center bg-slate-800 rounded-xl p-1 border border-slate-700">
              <button
                onClick={() => setSelectedJenjang('ALL')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  selectedJenjang === 'ALL' ? 'bg-yellow-400 text-slate-950' : 'text-slate-400 hover:text-white'
                }`}
              >
                Semua
              </button>
              <button
                onClick={() => setSelectedJenjang('SMP')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  selectedJenjang === 'SMP' ? 'bg-yellow-400 text-slate-950' : 'text-slate-400 hover:text-white'
                }`}
              >
                SMP/MTs
              </button>
              <button
                onClick={() => setSelectedJenjang('SD')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  selectedJenjang === 'SD' ? 'bg-yellow-400 text-slate-950' : 'text-slate-400 hover:text-white'
                }`}
              >
                SD/MI
              </button>
            </div>

            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-400 to-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow hover:shadow-lg transition-all active:scale-95 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              Cetak / PDF
            </button>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Official Printable Document Content */}
        <div className="p-8 sm:p-10 text-slate-900 bg-white print:p-6 print:m-0" id="printable-recap">
          {/* Header Kop Surat */}
          <div className="border-b-4 border-double border-slate-900 pb-5 mb-6">
            <div className="flex items-center justify-between gap-4">
              <div className="w-20 h-20 flex-shrink-0 flex items-center justify-center">
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
              <div className="w-20 h-20 flex-shrink-0 flex flex-col items-center justify-center border-2 border-slate-900 rounded-xl p-1 text-center">
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
              <span><strong>Rekapitulasi:</strong> {
                awardCategory === 'danton' ? '🎖️ Komandan Peleton (Danton) Terbaik' :
                awardCategory === 'pbb' ? '🎖️ Peleton PBB Terbaik (Akumulasi 70:30)' :
                awardCategory === 'kekompakan' ? '🎖️ Kekompakan Peleton Terbaik' :
                '🏆 Juara Umum & Akumulasi Nilai'
              }</span>
              <span>•</span>
              <span><strong>Tanggal:</strong> {TIMELINE.COMPETITION_DATE}</span>
              <span>•</span>
              <span><strong>Lokasi:</strong> {VENUE.NAME}</span>
            </div>
          </div>

          {/* Table of Scores */}
          <div className="overflow-x-auto rounded-xl border border-slate-300 mb-8">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-slate-900 text-white font-bold text-[11px] uppercase tracking-wider text-center">
                  <th className="py-2.5 px-2 border-r border-slate-700 w-10">Peringkat</th>
                  <th className="py-2.5 px-2 border-r border-slate-700 w-12">No. Undi</th>
                  <th className="py-2.5 px-3 border-r border-slate-700 text-left">Peleton & Asal Sekolah</th>
                  <th className="py-2.5 px-2 border-r border-slate-700 w-14">Jenjang</th>
                  <th className="py-2.5 px-2 border-r border-slate-700 w-18 bg-blue-900/60">
                    Juri 1<br /><span className="text-[9px] font-normal text-blue-300">Teknik (70%)</span>
                  </th>
                  <th className={`py-2.5 px-2 border-r border-slate-700 w-18 ${awardCategory === 'kekompakan' ? 'bg-purple-600 text-white font-black' : 'bg-purple-950/60'}`}>
                    Juri 2<br /><span className="text-[9px] font-normal text-purple-300">Kekompakan (30%)</span>
                  </th>
                  <th className={`py-2.5 px-2 border-r border-slate-700 w-20 ${awardCategory === 'pbb' ? 'bg-emerald-600 text-white font-black ring-2 ring-emerald-300' : 'bg-slate-800'}`}>
                    Nilai Peleton<br /><span className="text-[9px] font-normal text-emerald-300">(70:30)</span>
                  </th>
                  <th className={`py-2.5 px-2 border-r border-slate-700 w-18 ${awardCategory === 'danton' ? 'bg-red-600 text-white font-black ring-2 ring-red-300' : 'bg-slate-800'}`}>
                    Juri 3<br /><span className="text-[9px] font-normal text-red-300">(Danton)</span>
                  </th>
                  <th className="py-2.5 px-2 border-r border-slate-700 w-16 text-red-300">
                    Penalti<br /><span className="text-[9px] font-normal">(-)</span>
                  </th>
                  <th className="py-2.5 px-3 w-24 bg-yellow-500 text-slate-950 font-black">
                    Skor Akhir
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-medium">
                {rankedTeams.map((item, idx) => {
                  const rank = idx + 1;
                  const isPodium = rank <= 3;
                  return (
                    <tr
                      key={item.team.id}
                      className={`text-center ${isPodium ? 'bg-yellow-50/50 font-semibold' : (idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/60')}`}
                    >
                      <td className="py-2.5 px-2 border-r border-slate-200">
                        {isPodium ? (
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-yellow-400 text-slate-950 font-black text-xs shadow-xs">
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
                          {getAwardTitle(rank) && (
                            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-amber-400 text-slate-950 border border-amber-500/50 shadow-2xs">
                              🏆 {getAwardTitle(rank)}
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-500">{item.team.platoonName} • Danton: {item.team.roster?.danton?.name || item.team.dantonName || '-'}</div>
                      </td>
                      <td className="py-2.5 px-2 border-r border-slate-200 font-bold text-slate-700">
                        {item.team.jenjang}
                      </td>
                      <td className="py-2.5 px-2 border-r border-slate-200 font-mono text-slate-800">
                        {item.juri1Teknik > 0 ? item.juri1Teknik.toFixed(1) : '-'}
                      </td>
                      <td className={`py-2.5 px-2 border-r border-slate-200 font-mono ${awardCategory === 'kekompakan' ? 'font-black bg-purple-50 text-purple-900' : 'text-slate-800'}`}>
                        {item.juri2Kekompakan > 0 ? item.juri2Kekompakan.toFixed(1) : '-'}
                      </td>
                      <td className={`py-2.5 px-2 border-r border-slate-200 font-mono ${awardCategory === 'pbb' ? 'font-black bg-emerald-50 text-emerald-900' : 'font-bold text-slate-900'}`}>
                        {item.peletonCombined > 0 ? item.peletonCombined.toFixed(2) : '-'}
                      </td>
                      <td className={`py-2.5 px-2 border-r border-slate-200 font-mono ${awardCategory === 'danton' ? 'font-black bg-red-50 text-red-900' : 'text-slate-800'}`}>
                        {item.juri3Danton > 0 ? item.juri3Danton.toFixed(1) : '-'}
                      </td>
                      <td className="py-2.5 px-2 border-r border-slate-200 font-mono text-red-600 font-bold">
                        {item.penaltiesTotal > 0 ? `-${item.penaltiesTotal}` : '0'}
                      </td>
                      <td className="py-2.5 px-3 font-mono font-black text-sm text-slate-950 bg-yellow-100/40">
                        {item.finalScore.toFixed(2)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Legal Statement */}
          <div className="text-xs text-slate-600 italic leading-relaxed mb-10 border-l-2 border-slate-400 pl-3">
            Catatan Dewan Juri: Rekapitulasi nilai ini sah dan final setelah ditandatangani oleh Dewan Juri LBB Mu'allimin 2027. Sesuai Petunjuk Teknis LBB Mu'allimin 2027, Nilai Peleton dihitung dengan bobot 70% Kebenaran Teknik PBB (Juri 1) + 30% Kekompakan Peleton (Juri 2). Skor akhir merupakan penjumlahan Nilai Peleton + Nilai Komandan Peleton (Juri 3) dikurangi akumulasi penalti lapangan. Keputusan Dewan Juri bersifat mutlak dan tidak dapat diganggu gugat.
          </div>

          {/* Official Signatures Grid */}
          <div className="grid grid-cols-3 gap-6 text-center text-xs pt-4 print:pt-2 border-t border-slate-200">
            {/* Juri 1 */}
            <div className="flex flex-col items-center justify-between h-36">
              <div>
                <p className="font-bold text-slate-800">Juri 1 (Kebenaran Teknik PBB)</p>
                <p className="text-[11px] text-slate-500">Unsur TNI / Kodim (Bobot 70%)</p>
              </div>
              <div className="w-40 border-b border-slate-900 pb-1">
                <span className="font-bold text-slate-900">{JURY_POSTS.pos1.defaultName}</span>
              </div>
            </div>

            {/* Juri 2 */}
            <div className="flex flex-col items-center justify-between h-36">
              <div>
                <p className="font-bold text-slate-800">Juri 2 (Kekompakan Peleton)</p>
                <p className="text-[11px] text-slate-500">Unsur PPI / Paskibra (Bobot 30%)</p>
              </div>
              <div className="w-40 border-b border-slate-900 pb-1">
                <span className="font-bold text-slate-900">{JURY_POSTS.pos2.defaultName}</span>
              </div>
            </div>

            {/* Juri 3 */}
            <div className="flex flex-col items-center justify-between h-36">
              <div>
                <p className="font-bold text-slate-800">Juri 3 (Komandan Peleton)</p>
                <p className="text-[11px] text-slate-500">Unsur Polresta / Korps Danton</p>
              </div>
              <div className="w-40 border-b border-slate-900 pb-1">
                <span className="font-bold text-slate-900">{JURY_POSTS.pos3.defaultName}</span>
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
                <span className="font-bold text-slate-900">{JURY_POSTS.pos1.defaultName}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
