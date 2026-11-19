import React from 'react';
import { Minus, Plus, Check, Clock } from 'lucide-react';

export default function PenaltiesSection({
  penalties = {},
  setPenalties,
  selectedTeam,
  peletonPenalty = 0,
  dantonPenalty = 0,
  isInputDisabled = false,
  durationMinutes = '',
  durationSecondsPart = '',
  onDurationChange,
}) {
  const totalCombinedPenalty = peletonPenalty + dantonPenalty;
  const maxMinutes = selectedTeam?.jenjang === 'SD' ? 8 : 12;
  const maxSeconds = maxMinutes * 60;
  const parsedMin = durationMinutes === '' ? null : Math.max(0, parseInt(durationMinutes, 10) || 0);
  const parsedSec = durationSecondsPart === '' ? null : Math.min(59, Math.max(0, parseInt(durationSecondsPart, 10) || 0));
  const hasDurationInput = parsedMin !== null || parsedSec !== null;
  const totalDurationSec = hasDurationInput ? (parsedMin || 0) * 60 + (parsedSec || 0) : 0;
  const overtimeSec = hasDurationInput ? Math.max(0, totalDurationSec - maxSeconds) : 0;
  const autoOvertimeBlocks = overtimeSec > 0 ? Math.ceil(overtimeSec / 30) : 0;
  const formatMMSS = (secs) => `${String(Math.floor(secs / 60)).padStart(2, '0')}:${String(secs % 60).padStart(2, '0')}`;

  const peletonItems = [
    {
      key: 'injakGarisCount',
      type: 'stepper',
      title: 'Keluar Garis Arena',
      desc: 'Anggota menginjak / keluar garis batas',
      rateLabel: '-50 / kejadian',
      unitPoints: 50,
    },
    {
      key: 'overTimeBlocks',
      type: 'stepper',
      title: 'Kelebihan Durasi Tampil',
      desc: `Tiap 1–30 dtk melebihi batas (${selectedTeam?.jenjang === 'SD' ? '8' : '12'} mnt)`,
      rateLabel: '-20 / 30 dtk',
      unitPoints: 20,
    },
    {
      key: 'personelKurang',
      type: 'toggle',
      title: 'Personel Kurang',
      desc: 'Tampil < 22 orang (kecuali evakuasi medis)',
      rateLabel: '-75 Poin',
      unitPoints: 75,
    },
    {
      key: 'dp1',
      type: 'toggle',
      title: 'Terlambat Masuk DP 1',
      desc: '3× panggilan interval 2 menit',
      rateLabel: '-100 Poin',
      unitPoints: 100,
    },
    {
      key: 'upacara',
      type: 'toggle',
      title: 'Absen Upacara',
      desc: 'Urutan 6–10 tidak ikut upacara',
      rateLabel: '-150 Poin',
      unitPoints: 150,
    },
    {
      key: 'upacaraTerlambatBlocks',
      type: 'stepper',
      title: 'Terlambat Upacara',
      desc: 'Tiap kelipatan 5 menit',
      rateLabel: '-50 / 5 mnt',
      unitPoints: 50,
    },
    {
      key: 'basecampKotor',
      type: 'toggle',
      title: 'Basecamp Kotor',
      desc: 'Sampah tidak diserahkan ke pos checkout',
      rateLabel: '-150 Poin',
      unitPoints: 150,
    },
    {
      key: 'rokokCount',
      type: 'stepper',
      title: 'Rokok / Vape Kontingen',
      desc: 'Setelah teguran panitia (Bab C.9)',
      rateLabel: '-75 / kejadian',
      unitPoints: 75,
    },
    {
      key: 'yelYelCount',
      type: 'stepper',
      title: 'Yel-Yel Mengganggu',
      desc: 'Pelanggaran ke-3 dst (Bab C.10)',
      rateLabel: '-50 / kejadian',
      unitPoints: 50,
    },
  ];

  const renderPenaltyCard = (item) => {
    if (item.type === 'toggle') {
      const checked = Boolean(penalties[item.key]);
      return (
        <button
          key={item.key}
          type="button"
          disabled={isInputDisabled}
          onClick={() => setPenalties(p => ({ ...p, [item.key]: !checked }))}
          className={`p-3.5 rounded-xl border text-left transition-all flex items-start justify-between gap-3 cursor-pointer disabled:cursor-default ${
            checked
              ? 'bg-rose-50/80 border-rose-300 ring-1 ring-rose-200'
              : 'bg-white border-slate-200/90 hover:border-slate-300 hover:bg-slate-50/50'
          }`}
        >
          <div className="flex items-start gap-2.5 min-w-0">
            <span className={`w-4.5 h-4.5 mt-0.5 rounded-md border flex items-center justify-center shrink-0 transition-colors ${
              checked
                ? 'bg-rose-600 border-rose-600 text-white'
                : 'bg-white border-slate-300'
            }`}>
              {checked && <Check className="w-3 h-3 stroke-[3]" />}
            </span>
            <div className="min-w-0">
              <div className="font-bold text-xs text-slate-900 leading-snug">{item.title}</div>
              <div className="text-[10.5px] text-slate-500 mt-0.5 leading-snug">{item.desc}</div>
            </div>
          </div>
          <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border shrink-0 ${
            checked
              ? 'bg-rose-600 text-white border-rose-600'
              : 'bg-rose-50 text-rose-700 border-rose-200/80'
          }`}>
            {item.rateLabel}
          </span>
        </button>
      );
    }

    const count = Number(penalties[item.key] || 0);
    const active = count > 0;
    return (
      <div
        key={item.key}
        className={`p-3.5 rounded-xl border transition-all flex flex-col justify-between gap-2.5 ${
          active
            ? 'bg-rose-50/80 border-rose-300 ring-1 ring-rose-200'
            : 'bg-white border-slate-200/90'
        }`}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="font-bold text-xs text-slate-900 leading-snug">{item.title}</div>
            <div className="text-[10.5px] text-slate-500 mt-0.5 leading-snug">{item.desc}</div>
          </div>
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-200/80 shrink-0">
            {item.rateLabel}
          </span>
        </div>

        <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-100">
          <span className={`text-[11px] font-mono font-bold ${active ? 'text-rose-700' : 'text-slate-400'}`}>
            {active ? `-${count * item.unitPoints} Poin` : '0 Poin'}
          </span>
          <div className="inline-flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200/80">
            <button
              type="button"
              disabled={isInputDisabled || count === 0}
              onClick={() => setPenalties(p => ({ ...p, [item.key]: Math.max(0, (p[item.key] || 0) - 1) }))}
              className="w-7 h-7 rounded-md bg-white hover:bg-slate-50 text-slate-700 flex items-center justify-center cursor-pointer disabled:opacity-40 transition-colors"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="font-mono font-black text-xs w-7 text-center text-slate-900">
              {count}
            </span>
            <button
              type="button"
              disabled={isInputDisabled}
              onClick={() => setPenalties(p => ({ ...p, [item.key]: (p[item.key] || 0) + 1 }))}
              className="w-7 h-7 rounded-md bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center cursor-pointer disabled:opacity-40 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <fieldset disabled={isInputDisabled} className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs space-y-5 disabled:opacity-75">
      {/* Header Ringkas */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-3.5 gap-3">
        <div>
          <h4 className="font-extrabold text-sm text-slate-900 uppercase tracking-tight">
            Kalkulator Penalti Lapangan &amp; Tata Tertib
          </h4>
          <p className="text-[11.5px] text-slate-500 mt-0.5">
            Pedoman Juknis Penilaian Bab A.3.c &amp; Bab C · Klik kartu untuk mengaktifkan penalti
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap shrink-0">
          <div className="px-2.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase text-slate-500">Peleton</span>
            <span className="font-mono font-black text-xs text-rose-700">-{peletonPenalty}</span>
          </div>
          <div className="px-2.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase text-slate-500">Danton</span>
            <span className="font-mono font-black text-xs text-rose-700">-{dantonPenalty}</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-rose-50 border border-rose-200 flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase text-rose-700">Total</span>
            <span className="font-mono font-black text-sm text-rose-800">-{totalCombinedPenalty}</span>
          </div>
        </div>
      </div>

      {/* Input Manual Durasi Waktu Tampil (Auto-Hitung Penalti Overtime) */}
      <div className="p-3.5 sm:p-4 rounded-xl bg-slate-50/90 border border-slate-200/90 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-start gap-2.5 min-w-0">
          <div className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 ${
            overtimeSec > 0
              ? 'bg-rose-50 text-rose-600 border-rose-200'
              : hasDurationInput
              ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
              : 'bg-white text-slate-500 border-slate-200'
          }`}>
            <Clock className="w-4.5 h-4.5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-extrabold text-xs text-slate-900 uppercase tracking-wide">
                Durasi Waktu Tampil Lapangan
              </span>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-white text-slate-600 border border-slate-200">
                Batas {selectedTeam?.jenjang === 'SD' ? 'SD' : 'SMP'}: {String(maxMinutes).padStart(2, '0')}:00
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Input durasi dari timer lapangan (Menit : Detik). Kelebihan waktu otomatis menghitung penalti -20 / 30 detik.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap shrink-0">
          <div className="inline-flex items-center gap-1.5 bg-white p-1.5 rounded-xl border border-slate-200 shadow-2xs">
            <input
              type="number"
              min="0"
              max="59"
              inputMode="numeric"
              placeholder="00"
              value={durationMinutes}
              onChange={(e) => onDurationChange?.(e.target.value, durationSecondsPart)}
              aria-label="Menit durasi tampil"
              className="w-12 py-1 text-center font-mono font-black text-sm text-slate-900 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-slate-900 outline-none"
            />
            <span className="font-mono font-black text-slate-400 text-sm">:</span>
            <input
              type="number"
              min="0"
              max="59"
              inputMode="numeric"
              placeholder="00"
              value={durationSecondsPart}
              onChange={(e) => onDurationChange?.(durationMinutes, e.target.value)}
              aria-label="Detik durasi tampil"
              className="w-12 py-1 text-center font-mono font-black text-sm text-slate-900 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-slate-900 outline-none"
            />
            <span className="text-[10px] font-bold text-slate-400 px-1">mnt:dtk</span>
          </div>

          {hasDurationInput && (
            overtimeSec > 0 ? (
              <span className="px-2.5 py-1.5 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 text-[11px] font-bold font-mono">
                +{formatMMSS(overtimeSec)} ({autoOvertimeBlocks} blok)
              </span>
            ) : (
              <span className="px-2.5 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold">
                Aman (≤ {String(maxMinutes).padStart(2, '0')}:00)
              </span>
            )
          )}
        </div>
      </div>

      {/* Bagian A: Penalti Peleton */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <h5 className="font-bold text-[11px] uppercase tracking-wider text-slate-500">
            A. Pengurangan Nilai Peleton
          </h5>
          <span className="text-[10.5px] text-slate-400">Terhadap Nilai Murni Peleton</span>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {peletonItems.map(renderPenaltyCard)}
        </div>
      </div>

      {/* Bagian B: Penalti Danton */}
      <div className="space-y-2.5 pt-3 border-t border-slate-100">
        <div className="flex items-center justify-between">
          <h5 className="font-bold text-[11px] uppercase tracking-wider text-slate-500">
            B. Pengurangan Nilai Komandan (Danton)
          </h5>
          <span className="text-[10.5px] text-slate-400">Terhadap Nilai Murni Danton</span>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {renderPenaltyCard({
            key: 'kotakDantonCount',
            type: 'stepper',
            title: 'Keluar Garis Kotak Danton',
            desc: 'Menginjak / keluar kotak 1,5 × 1,5 m',
            rateLabel: '-50 / kejadian',
            unitPoints: 50,
          })}
        </div>
      </div>

      {/* Footer Catatan Juknis Ringkas */}
      <div className="text-[11px] text-slate-400 flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
        <span>Catatan Juknis: Gerakan penyesuaian &amp; atribut terlepas = 0 poin penalti.</span>
        <span>Otomatis memotong rekapitulasi nilai.</span>
      </div>
    </fieldset>
  );
}
