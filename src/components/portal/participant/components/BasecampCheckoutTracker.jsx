import React from 'react';
import { Home, Key, CheckCircle2, AlertTriangle, Trash2, Clock, ShieldCheck, MapPin, Sparkles } from 'lucide-react';

export default function BasecampCheckoutTracker({ currentTeam, stagingInfo }) {
  const displayBasecamp = currentTeam.basecampNumber || (currentTeam.lotNumber ? `Ruang ${String(currentTeam.lotNumber).padStart(2, '0')}` : null);
  const logistics = stagingInfo?.basecampLogistics || {};

  // Status flags
  const isCheckedIn = Boolean(logistics.ktpDeposited || stagingInfo?.stage === 'basecamp' || currentTeam.status === 'checkin_done');
  const isCheckedOut = Boolean(stagingInfo?.stage === 'checkout' || logistics.roomCleanChecked);

  return (
    <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-slate-200/90 shadow-xs space-y-4 sm:space-y-5">
      {/* Header Widget */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
            <Home className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-black text-sm sm:text-base text-slate-900 uppercase">
                Basecamp & Alur Checkout
              </h4>
              <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${
                isCheckedOut
                  ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                  : isCheckedIn
                  ? 'bg-blue-100 text-blue-800 border-blue-300'
                  : 'bg-slate-100 text-slate-700 border-slate-200'
              }`}>
                {isCheckedOut ? '✓ Selesai Checkout' : isCheckedIn ? 'Sedang Digunakan' : 'Belum Check-In'}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Pasal 14 Tata Tertib: Maksimal pengosongan ruangan pukul <strong>15.00 WIB</strong>
            </p>
          </div>
        </div>

        {/* Room Info Badge */}
        <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-3 py-1.5 self-start sm:self-auto">
          <span className="text-[10px] font-bold text-amber-900 uppercase">Alokasi Kelas:</span>
          <strong className="text-xs sm:text-sm font-black text-amber-950 font-mono">
            {displayBasecamp || 'Ditetapkan Saat TM'}
          </strong>
        </div>
      </div>

      {/* Informasi Regulasi Basecamp & Jaminan KTP */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Box 1: Status Jaminan Identitas KTP/SIM */}
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-amber-600" />
              <span>Jaminan KTP/SIM Official</span>
            </span>
            <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded ${
              logistics.ktpReturned
                ? 'bg-emerald-100 text-emerald-700'
                : logistics.ktpDeposited
                ? 'bg-amber-100 text-amber-800'
                : 'bg-slate-200 text-slate-600'
            }`}>
              {logistics.ktpReturned ? 'Sudah Diambil' : logistics.ktpDeposited ? 'Ditahan Panitia' : 'Saat Check-In'}
            </span>
          </div>
          <p className="text-xs text-slate-700 leading-snug">
            Official menyerahkan 1 kartu identitas (KTP/SIM) di Gedung Madrasah Lantai 1 saat registrasi hari-H. KTP dikembalikan setelah checkout lolos verifikasi.
          </p>
        </div>

        {/* Box 2: Batas Waktu & Penalti Kebersihan */}
        <div className="p-3.5 rounded-2xl bg-rose-50/70 border border-rose-200 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-rose-800 uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-rose-600" />
              <span>Tenggat Maksimal</span>
            </span>
            <span className="text-[10px] font-black text-rose-800 bg-rose-200/80 px-2 py-0.5 rounded font-mono">
              Pukul 15.00 WIB
            </span>
          </div>
          <p className="text-xs text-rose-900 leading-snug">
            Peleton yang meninggalkan basecamp dalam keadaan kotor/sampah tidak diserahkan dikenakan <strong>penalti -50 poin</strong> (Pasal 14 ayat 4).
          </p>
        </div>
      </div>

      {/* 4 Tahap Prosedur Checkout Resmi (Pasal 14 Ayat 3) */}
      <div className="space-y-2.5">
        <span className="text-xs font-black uppercase text-slate-900 tracking-wider block">
          4 Langkah Prosedur Checkout Resmi (Pasal 14 Ayat 3):
        </span>
        
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs">
          {/* Step 1 */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-slate-900 text-[11px]">
              <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-800 text-[10px] flex items-center justify-center font-bold">1</span>
              <span>Tata Ruangan</span>
            </div>
            <p className="text-[10px] text-slate-500 leading-relaxed">
              Rapikan kembali meja-kursi dan pastikan tidak ada barang bawaan tertinggal.
            </p>
          </div>

          {/* Step 2 */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-slate-900 text-[11px]">
              <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-800 text-[10px] flex items-center justify-center font-bold">2</span>
              <span>2 Trash Bag</span>
            </div>
            <p className="text-[10px] text-slate-500 leading-relaxed">
              Pilah sampah organik & anorganik ke kantong resmi lalu serahkan ke Pos Checkout.
            </p>
          </div>

          {/* Step 3 */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-slate-900 text-[11px]">
              <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-800 text-[10px] flex items-center justify-center font-bold">3</span>
              <span>Inspeksi LO</span>
            </div>
            <p className="text-[10px] text-slate-500 leading-relaxed">
              Pemeriksaan kebersihan ruangan oleh LO/Petugas untuk peroleh Bukti Lolos.
            </p>
          </div>

          {/* Step 4 */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-slate-900 text-[11px]">
              <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-800 text-[10px] flex items-center justify-center font-bold">4</span>
              <span>Ambil KTP/SIM</span>
            </div>
            <p className="text-[10px] text-slate-500 leading-relaxed">
              Tunjukkan Bukti Lolos di Meja Registrasi Lantai 1 untuk ambil kembali kartu jaminan.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
