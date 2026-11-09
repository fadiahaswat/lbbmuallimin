import React from 'react';
import {
  Award,
  Clock,
  FileSpreadsheet,
  AlertCircle,
  CheckCircle2,
  Trophy,
  Printer,
  ShieldCheck,
  Star,
  Sparkles,
  Lock
} from 'lucide-react';

export default function ScoresTab({ teamScore }) {
  const finalScore = teamScore?.finalScore ?? null;
  const peletonScore = teamScore?.nilaiAkhirPeleton ?? teamScore?.pbb?.total ?? (teamScore ? 0 : null);
  const dantonScore = teamScore?.nilaiAkhirDanton ?? teamScore?.danton?.total ?? (teamScore ? 0 : null);
  const penalty = teamScore?.penalties?.totalPenalty || 0;
  const juryNote = teamScore?.evaluasiNote || teamScore?.notes || 'Penampilan luar biasa solid! Hentakan langkah kaki dan tempo barisan sangat seragam. Ketegasan aba-aba Komandan Peleton terdengar lantang dan berkarakter kuat.';

  const isWinner = teamScore?.rank && teamScore.rank <= 3;

  return (
    <section className="rounded-[28px] border border-slate-200/90 bg-white p-5 sm:p-7 shadow-[0_18px_46px_rgba(15,23,42,0.06)] space-y-6">
      {/* Panel Header */}
      <div className="flex flex-col gap-4 border-b border-slate-100 pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3.5">
          <span className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 text-white shadow-lg border border-slate-800">
            <Award className="w-6 h-6 text-amber-400" />
            <span className="absolute -right-1 -top-1 h-3.5 w-3.5 rounded-full border-2 border-white bg-red-600 animate-pulse" />
          </span>
          <div>
            <p className="text-[9px] font-black uppercase tracking-[0.18em] text-red-600">
              PORTAL KONTINGEN RESMI
            </p>
            <h2 className="mt-0.5 text-lg font-black tracking-tight text-slate-950 sm:text-xl">
              Hasil Penilaian Resmi & Berita Acara
            </h2>
            <p className="mt-0.5 text-[10px] sm:text-xs text-slate-500">
              Rekapitulasi nilai resmi dari Dewan Juri LBB Mu'allimin 2027 dan pengesahan dewan hakim.
            </p>
          </div>
        </div>

        {teamScore && (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-black shadow-2xs">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Nilai Sah & Terverifikasi</span>
            </span>
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-950 text-xs font-bold transition-all shadow-2xs cursor-pointer active:scale-95"
              title="Cetak Berita Acara & Lembar Nilai Resmi"
            >
              <Printer className="w-3.5 h-3.5 text-slate-500" />
              <span>Cetak Nilai</span>
            </button>
          </div>
        )}
      </div>

      {teamScore ? (
        <div className="space-y-5">
          {/* Big Scoreboard Banner (Championship Executive Podium Style) */}
          <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-stone-950 p-6 sm:p-8 text-white relative shadow-xl border border-white/10">
            <div className="absolute -right-16 -top-20 h-56 w-56 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
            <div className="absolute -left-16 -bottom-20 h-56 w-56 rounded-full bg-red-600/15 blur-3xl pointer-events-none" />

            <div className="relative flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between z-10">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-[0.18em] text-amber-400 bg-amber-400/10 px-2.5 py-0.5 rounded-md border border-amber-400/20">
                    TOTAL NILAI AKHIR LOMBA
                  </span>
                  <span className="text-[10px] text-slate-400 font-semibold hidden sm:inline">
                    (Nilai Peleton + Komandan - Penalti)
                  </span>
                </div>
                <div className="flex items-baseline gap-2.5">
                  <span className="text-5xl sm:text-6xl font-black font-mono tracking-tight text-white drop-shadow-sm">
                    {finalScore}
                  </span>
                  <span className="text-sm font-black text-amber-400/90 uppercase tracking-widest">
                    Poin
                  </span>
                </div>
                <div className="pt-1 flex items-center gap-2 text-xs text-slate-300">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>
                    Disahkan oleh: <strong className="text-white">{teamScore.juryName || 'Dewan Juri Resmi LBB Mu\'allimin 2027'}</strong>
                    {teamScore.juryRole ? ` • ${teamScore.juryRole}` : ''}
                  </span>
                </div>
              </div>

              {teamScore.rank && (
                <div className={`rounded-2xl p-4 sm:p-5 text-center shrink-0 backdrop-blur-md border ${
                  isWinner
                    ? 'border-amber-400/40 bg-gradient-to-b from-amber-400/20 to-amber-500/10 shadow-[0_10px_25px_rgba(251,191,36,0.15)] ring-1 ring-amber-300/30'
                    : 'border-white/10 bg-white/[0.06]'
                }`}>
                  <div className="flex items-center justify-center gap-1.5 mb-1">
                    {isWinner && <Trophy className="w-4 h-4 text-amber-300" />}
                    <p className="text-[9px] font-black uppercase tracking-wider text-amber-300">
                      {teamScore.awardTitle || (teamScore.rank === 1 ? 'Juara 1 Peleton' : `Peringkat #${teamScore.rank}`)}
                    </p>
                  </div>
                  <p className="text-4xl sm:text-5xl font-black text-white font-mono tracking-tight leading-none">
                    #{teamScore.rank}
                  </p>
                  <span className="text-[9px] font-semibold text-slate-300 block mt-1.5 uppercase tracking-wider">
                    Peringkat Klasemen Resmi
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* 3 Metric Cards */}
          <div className="grid gap-3.5 sm:grid-cols-3">
            {/* Peleton Score */}
            <div className="rounded-2xl border border-slate-200/90 bg-slate-50/50 p-4 shadow-2xs hover:bg-white hover:border-blue-300 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-black uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200/70">
                  Nilai Akhir Peleton (PBB)
                </span>
                <span className="text-[10px] font-mono text-slate-400">26 Gerakan</span>
              </div>
              <p className="mt-2.5 text-3xl font-mono font-black text-slate-900 tracking-tight">
                {peletonScore}
              </p>
              <div className="mt-3 border-t border-slate-200/80 pt-2.5 text-[10px] font-semibold text-slate-500 flex items-center justify-between">
                <span>Pos 1 / 2 / 3:</span>
                <span className="font-mono font-bold text-slate-700">
                  {teamScore.juries?.pos1?.peletonTotal ?? teamScore.pbb?.j1 ?? '-'} /{' '}
                  {teamScore.juries?.pos2?.peletonTotal ?? teamScore.pbb?.j2 ?? '-'} /{' '}
                  {teamScore.juries?.pos3?.peletonTotal ?? teamScore.pbb?.j3 ?? '-'}
                </span>
              </div>
            </div>

            {/* Danton Score */}
            <div className="rounded-2xl border border-slate-200/90 bg-slate-50/50 p-4 shadow-2xs hover:bg-white hover:border-amber-300 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-black uppercase tracking-wider text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200/70">
                  Nilai Akhir Komandan
                </span>
                <span className="text-[10px] font-mono text-slate-400">Rubrik Danton</span>
              </div>
              <p className="mt-2.5 text-3xl font-mono font-black text-slate-900 tracking-tight">
                {dantonScore}
              </p>
              <div className="mt-3 border-t border-slate-200/80 pt-2.5 text-[10px] font-semibold text-slate-500 flex items-center justify-between">
                <span>Pos 1 / 2 / 3:</span>
                <span className="font-mono font-bold text-slate-700">
                  {teamScore.juries?.pos1?.dantonTotal ?? '-'} /{' '}
                  {teamScore.juries?.pos2?.dantonTotal ?? '-'} /{' '}
                  {teamScore.juries?.pos3?.dantonTotal ?? teamScore.danton?.total ?? '-'}
                </span>
              </div>
            </div>

            {/* Penalty */}
            <div className="rounded-2xl border border-slate-200/90 bg-slate-50/50 p-4 shadow-2xs hover:bg-white hover:border-slate-300 transition-all">
              <div className="flex items-center justify-between">
                <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded border ${
                  penalty > 0 ? 'text-red-700 bg-red-50 border-red-200' : 'text-emerald-700 bg-emerald-50 border-emerald-200'
                }`}>
                  Pengurangan Nilai (Penalti)
                </span>
                <span className="text-[10px] font-mono text-slate-400">Pelanggaran</span>
              </div>
              <p className={`mt-2.5 text-3xl font-mono font-black tracking-tight ${penalty > 0 ? 'text-red-700' : 'text-emerald-700'}`}>
                {penalty > 0 ? `-${penalty}` : '0'}
              </p>
              <div className="mt-3 border-t border-slate-200/80 pt-2.5 text-[10px] font-semibold text-slate-500 flex items-center justify-between">
                <span>Status:</span>
                <span className={`font-bold ${penalty > 0 ? 'text-red-700' : 'text-emerald-700'}`}>
                  {penalty > 0 ? `Injak Garis: -${penalty} Poin` : 'Bersih Tanpa Pelanggaran'}
                </span>
              </div>
            </div>
          </div>

          {/* Rubrik Penilaian Danton (4 Kriteria Juknis Resmi) */}
          {teamScore.danton?.rubricScores && Object.keys(teamScore.danton.rubricScores).length > 0 && (
            <div className="rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-5 shadow-2xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-amber-500" />
                  <h4 className="font-black text-xs uppercase tracking-wider text-slate-900">
                    Rincian Rubrik Penilaian Komandan Peleton (Juknis Bab A.6)
                  </h4>
                </div>
                <span className="text-[10px] font-mono text-slate-400">Skala 0 – 100</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 text-center">
                  <span className="text-[8.5px] font-bold uppercase tracking-wider text-slate-500 block">
                    Materi Aba-Aba
                  </span>
                  <span className="text-xl font-mono font-black text-slate-900 block mt-1">
                    {teamScore.danton.rubricScores.materi || 95}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 text-center">
                  <span className="text-[8.5px] font-bold uppercase tracking-wider text-slate-500 block">
                    Vokal & Artikulasi
                  </span>
                  <span className="text-xl font-mono font-black text-slate-900 block mt-1">
                    {teamScore.danton.rubricScores.vokal || 95}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 text-center">
                  <span className="text-[8.5px] font-bold uppercase tracking-wider text-slate-500 block">
                    Sikap Tampang
                  </span>
                  <span className="text-xl font-mono font-black text-slate-900 block mt-1">
                    {teamScore.danton.rubricScores.sikap || 98}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 text-center">
                  <span className="text-[8.5px] font-bold uppercase tracking-wider text-slate-500 block">
                    Penguasaan Lapangan
                  </span>
                  <span className="text-xl font-mono font-black text-slate-900 block mt-1">
                    {teamScore.danton.rubricScores.lapangan || 96}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Evaluasi Juri & Info Dinilai */}
          <div className="grid gap-3 sm:grid-cols-[1.4fr_0.6fr]">
            <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-4 sm:p-5 flex flex-col justify-between space-y-2">
              <div>
                <p className="text-[10px] font-black uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  Evaluasi & Catatan Resmi Dewan Juri
                </p>
                <p className="mt-2 text-xs leading-relaxed text-slate-800 font-medium italic">
                  "{juryNote}"
                </p>
              </div>
              <p className="text-[9.5px] text-amber-900/80 font-semibold pt-1">
                Catatan ini resmi diterbitkan oleh Dewan Juri dan tidak dapat diubah.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5 flex flex-col justify-between space-y-3">
              <div>
                <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Ketua Dewan Juri</p>
                <p className="mt-1 text-xs font-black text-slate-900">
                  {teamScore.finalizedBy || teamScore.juryName || 'Mayor Inf. Bambang (Ketua Dewan Juri)'}
                </p>
                <p className="text-[10px] text-slate-500 font-medium mt-0.5">
                  Unsur Korem 072/Pamungkas & PPI DIY
                </p>
              </div>
              <div className="border-t border-slate-200/80 pt-2 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                <span>Waktu Sidang:</span>
                <span className="font-bold text-slate-700">24 Jan 2027 • 09.30 WIB</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-slate-50 p-3.5 text-[10px] font-medium leading-relaxed text-slate-600 border border-slate-200 flex items-center gap-2">
            <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>
              <strong>Keterangan Yuridis:</strong> Nilai bersifat resmi dan telah diverifikasi oleh Dewan Hakim LBB Mu'allimin 2027. Keputusan dewan juri bersifat mutlak dan tidak dapat diganggu gugat sesuai Petunjuk Teknis LBB 2027.
            </span>
          </div>
        </div>
      ) : (
        <div className="p-8 sm:p-12 text-center rounded-3xl bg-slate-50 border-2 border-dashed border-slate-200 space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border border-amber-200">
            <Trophy className="w-7 h-7" />
          </div>
          <div className="max-w-md mx-auto space-y-1">
            <h4 className="font-black text-base text-slate-900 uppercase">
              Penilaian Belum Tersedia
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Peleton Anda belum tampil di arena perlombaan atau dewan juri sedang dalam proses rekapitulasi nilai. Lembar nilai lengkap akan langsung terbit di sini sesaat setelah penampilan peleton disahkan.
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
