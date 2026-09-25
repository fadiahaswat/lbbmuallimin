import React, { useState } from 'react';
import {
  QrCode,
  Search,
  CheckCircle2,
  PackageCheck,
  CreditCard,
  Droplets,
  Trash2
} from 'lucide-react';

export default function BasecampLogisticsTab({
  teams,
  staging,
  checkInBasecamp,
  checkOutBasecamp,
  basecampActionType,
  setBasecampActionType
}) {
  const [qrInput, setQrInput] = useState('');
  const [selectedBasecampTeamId, setSelectedBasecampTeamId] = useState(null);
  const [ktpOfficialName, setKtpOfficialName] = useState('');
  const [ktpType, setKtpType] = useState('KTP Fisik');
  const [logisticsChecklist, setLogisticsChecklist] = useState({
    waterBox: true,
    chestNumber: true,
    cocardOfficial: true,
    trashBag: true,
  });
  const [checkoutChecklist, setCheckoutChecklist] = useState({
    roomCleanChecked: true,
    sortedTrashReturned: true,
    ktpReturned: true,
  });
  const [basecampToast, setBasecampToast] = useState('');

  // Handler Scan QR / Cari Peleton di Basecamp
  function handleScanOrSearchBasecamp(e) {
    e?.preventDefault();
    if (!qrInput.trim()) return;
    const clean = qrInput.trim().toLowerCase();
    const found = teams.find(t =>
      t.regCode?.toLowerCase() === clean ||
      t.schoolName?.toLowerCase().includes(clean) ||
      t.platoonName?.toLowerCase().includes(clean) ||
      String(t.lotNumber || '') === clean
    );

    if (found) {
      setSelectedBasecampTeamId(found.id);
      setKtpOfficialName(found.officialName || found.coachName || '');
      const s = staging[found.id];
      if (s?.stage === 'finished' || s?.stage === 'checkout') {
        setBasecampActionType('checkout');
      } else {
        setBasecampActionType('checkin');
      }
      setBasecampToast(`Peleton ditemukan: ${found.schoolName} (${found.regCode})`);
      setTimeout(() => setBasecampToast(''), 3500);
    } else {
      alert(`Kode QR / Nama Peleton "${qrInput}" tidak ditemukan dalam database.`);
    }
  }

  // Submit Check-in Basecamp
  function handleSubmitCheckin() {
    if (!selectedBasecampTeamId) return;
    const team = teams.find(t => t.id === selectedBasecampTeamId);
    if (!team) return;

    checkInBasecamp(team.id, {
      ktpOfficialName: ktpOfficialName || team.officialName || 'Official Tim',
      ktpType,
      waterBoxGiven: logisticsChecklist.waterBox,
      chestNumberGiven: logisticsChecklist.chestNumber,
      cocardOfficialGiven: logisticsChecklist.cocardOfficial,
      trashBagGiven: logisticsChecklist.trashBag,
    });

    setBasecampToast(`Check-in Berhasil untuk ${team.schoolName}! Logistik & KTP tersimpan.`);
    setTimeout(() => setBasecampToast(''), 4000);
    setQrInput('');
  }

  // Submit Check-out Basecamp
  function handleSubmitCheckout() {
    if (!selectedBasecampTeamId) return;
    const team = teams.find(t => t.id === selectedBasecampTeamId);
    if (!team) return;

    checkOutBasecamp(team.id, {
      roomCleanChecked: checkoutChecklist.roomCleanChecked,
      sortedTrashReturned: checkoutChecklist.sortedTrashReturned,
      ktpReturned: checkoutChecklist.ktpReturned,
    });

    setBasecampToast(`Check-out Sukses! KTP/SIM ${team.schoolName} telah dikembalikan.`);
    setTimeout(() => setBasecampToast(''), 4000);
    setQrInput('');
  }

  const selectedBasecampTeam = teams.find(t => t.id === selectedBasecampTeamId) || null;

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
        <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded border border-teal-200">
              Pos Meja Registrasi Basecamp
            </span>
            <h2 className="text-xl font-black uppercase text-slate-900 mt-1">
              Check-in & Check-out Basecamp Kontingen
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Scan kode QR dari ID Card / Tiket peleton atau ketik kode pendaftaran untuk proses serah terima logistik.
            </p>
          </div>

          {/* Mode Checkin vs Checkout Switcher */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setBasecampActionType('checkin')}
              className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                basecampActionType === 'checkin' ? 'bg-teal-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              1. Check-in (Tiba)
            </button>
            <button
              onClick={() => setBasecampActionType('checkout')}
              className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                basecampActionType === 'checkout' ? 'bg-amber-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              2. Check-out (Pulang)
            </button>
          </div>
        </div>

        {/* QR Code Scanner / Input Bar */}
        <form onSubmit={handleScanOrSearchBasecamp} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <QrCode className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={qrInput}
              onChange={(e) => setQrInput(e.target.value)}
              placeholder="Scan QR ID Card Peleton atau ketik Kode Registrasi (cth: LBB26-SMP-001)..."
              className="w-full pl-11 pr-4 py-3 bg-white border border-slate-300 rounded-2xl text-slate-900 text-sm font-mono focus:border-teal-500 focus:outline-none placeholder:text-slate-400"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 bg-teal-600 hover:bg-teal-500 text-white font-black text-xs uppercase tracking-wider rounded-2xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
          >
            <Search className="w-4 h-4" />
            <span>Cari / Scan</span>
          </button>
        </form>

        {basecampToast && (
          <div className="p-3 bg-teal-50 border border-teal-200 text-teal-800 rounded-2xl text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-teal-600" />
            <span>{basecampToast}</span>
          </div>
        )}

        {/* Form Interaksi Basecamp jika Peleton Terpilih */}
        {selectedBasecampTeam ? (
          <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 space-y-6">
            {/* Info Peleton */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-black text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    {selectedBasecampTeam.regCode}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">
                    No. Undi: <strong className="text-slate-900">#{selectedBasecampTeam.lotNumber || '-'}</strong>
                  </span>
                  <span className="text-xs text-slate-500 font-medium">
                    Tingkat: <strong className="text-slate-900">{selectedBasecampTeam.jenjang}</strong>
                  </span>
                </div>
                <h3 className="text-2xl font-black uppercase text-slate-900 mt-1">
                  {selectedBasecampTeam.schoolName}
                </h3>
                <p className="text-xs text-slate-600">{selectedBasecampTeam.platoonName}</p>
              </div>

              <div className="bg-white border border-slate-200 p-3 rounded-2xl text-right shadow-xs">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Ruang Basecamp</span>
                <span className="text-lg font-black text-amber-600 font-mono">
                  {selectedBasecampTeam.basecampNumber ? `Ruang ${selectedBasecampTeam.basecampNumber}` : 'Belum Ditentukan'}
                </span>
              </div>
            </div>

            {/* FORM CHECKIN */}
            {basecampActionType === 'checkin' && (
              <div className="space-y-6">
                <div className="bg-teal-50 border border-teal-200 p-4 rounded-2xl space-y-1">
                  <h4 className="font-black text-sm uppercase text-teal-800 flex items-center gap-2">
                    <PackageCheck className="w-4 h-4 text-teal-600" />
                    <span>SOP Check-in Kedatangan Peleton</span>
                  </h4>
                  <p className="text-xs text-teal-700">
                    Pastikan official menyerahkan jaminan identitas (KTP/SIM fisik) dan menerima seluruh paket logistik resmi panitia.
                  </p>
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  {/* Identitas KTP/SIM Fisik */}
                  <div className="space-y-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                    <label className="text-xs font-black uppercase text-slate-800 flex items-center gap-1.5">
                      <CreditCard className="w-4 h-4 text-amber-500" />
                      <span>Jaminan Identitas Fisik (Titip 1 KTP / SIM)</span>
                    </label>
                    <div className="space-y-2">
                      <div>
                        <span className="text-[10px] text-slate-500 block mb-1">Nama Pemilik Identitas:</span>
                        <input
                          type="text"
                          value={ktpOfficialName}
                          onChange={(e) => setKtpOfficialName(e.target.value)}
                          placeholder="Nama Official / Pembina..."
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-teal-500"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 block mb-1">Jenis Kartu:</span>
                        <select
                          value={ktpType}
                          onChange={(e) => setKtpType(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-teal-500 cursor-pointer"
                        >
                          <option value="KTP Fisik">KTP Fisik Asli</option>
                          <option value="SIM Fisik">SIM Fisik Asli</option>
                          <option value="Kartu Pegawai">Kartu Pegawai / Guru Asli</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Serah Terima Paket Logistik */}
                  <div className="space-y-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                    <label className="text-xs font-black uppercase text-slate-800 flex items-center gap-1.5">
                      <Droplets className="w-4 h-4 text-cyan-600" />
                      <span>Serah Terima Logistik Resmi Panitia</span>
                    </label>
                    <div className="space-y-2 text-xs">
                      <label className="flex items-center gap-2 cursor-pointer text-slate-700 hover:text-slate-900">
                        <input
                          type="checkbox"
                          checked={logisticsChecklist.waterBox}
                          onChange={(e) => setLogisticsChecklist({ ...logisticsChecklist, waterBox: e.target.checked })}
                          className="w-4 h-4 rounded accent-teal-600 cursor-pointer"
                        />
                        <span>1 Dus Air Minum Mineral (24 botol / cup)</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer text-slate-700 hover:text-slate-900">
                        <input
                          type="checkbox"
                          checked={logisticsChecklist.chestNumber}
                          onChange={(e) => setLogisticsChecklist({ ...logisticsChecklist, chestNumber: e.target.checked })}
                          className="w-4 h-4 rounded accent-teal-600 cursor-pointer"
                        />
                        <span>Nomor Dada Peleton (Sesuai Undian)</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer text-slate-700 hover:text-slate-900">
                        <input
                          type="checkbox"
                          checked={logisticsChecklist.cocardOfficial}
                          onChange={(e) => setLogisticsChecklist({ ...logisticsChecklist, cocardOfficial: e.target.checked })}
                          className="w-4 h-4 rounded accent-teal-600 cursor-pointer"
                        />
                        <span>Cocard ID Pendamping (3 Pcs: 1 Official + 2 Pendukung)</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer text-slate-700 hover:text-slate-900">
                        <input
                          type="checkbox"
                          checked={logisticsChecklist.trashBag}
                          onChange={(e) => setLogisticsChecklist({ ...logisticsChecklist, trashBag: e.target.checked })}
                          className="w-4 h-4 rounded accent-teal-600 cursor-pointer"
                        />
                        <span>Karung Sampah untuk Pemilahan Sampah Basecamp</span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-3 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={handleSubmitCheckin}
                    className="px-6 py-3 bg-teal-600 hover:bg-teal-500 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-sm flex items-center gap-2 cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Selesaikan Check-in & Masuk Basecamp</span>
                  </button>
                </div>
              </div>
            )}

            {/* FORM CHECKOUT */}
            {basecampActionType === 'checkout' && (
              <div className="space-y-6">
                <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl space-y-1">
                  <h4 className="font-black text-sm uppercase text-amber-800 flex items-center gap-2">
                    <Trash2 className="w-4 h-4 text-amber-600" />
                    <span>SOP Check-out Kepulangan Peleton</span>
                  </h4>
                  <p className="text-xs text-amber-700">
                    Sebelum mengembalikan KTP/SIM, panitia wajib memeriksa kebersihan ruangan basecamp dan memastikan sampah telah dipilah ke karung sampah.
                  </p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-4 shadow-xs">
                  <div className="space-y-2.5 text-xs">
                    <label className="flex items-center gap-2.5 cursor-pointer text-slate-700 hover:text-slate-900">
                      <input
                        type="checkbox"
                        checked={checkoutChecklist.roomCleanChecked}
                        onChange={(e) => setCheckoutChecklist({ ...checkoutChecklist, roomCleanChecked: e.target.checked })}
                        className="w-4 h-4 rounded accent-amber-600 cursor-pointer"
                      />
                      <span className="font-bold">1. Kebersihan Basecamp Telah Diperiksa & Bersih</span>
                    </label>

                    <label className="flex items-center gap-2.5 cursor-pointer text-slate-700 hover:text-slate-900">
                      <input
                        type="checkbox"
                        checked={checkoutChecklist.sortedTrashReturned}
                        onChange={(e) => setCheckoutChecklist({ ...checkoutChecklist, sortedTrashReturned: e.target.checked })}
                        className="w-4 h-4 rounded accent-amber-600 cursor-pointer"
                      />
                      <span className="font-bold">2. Karung Sampah Terpilah Telah Dikembalikan ke Panitia</span>
                    </label>

                    <label className="flex items-center gap-2.5 cursor-pointer text-slate-700 hover:text-slate-900">
                      <input
                        type="checkbox"
                        checked={checkoutChecklist.ktpReturned}
                        onChange={(e) => setCheckoutChecklist({ ...checkoutChecklist, ktpReturned: e.target.checked })}
                        className="w-4 h-4 rounded accent-amber-600 cursor-pointer"
                      />
                      <span className="font-bold">3. KTP/SIM Fisik Official Siap Diserahkan Kembali</span>
                    </label>
                  </div>
                </div>

                <div className="flex justify-end pt-3 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={handleSubmitCheckout}
                    className="px-6 py-3 bg-amber-600 hover:bg-amber-500 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-sm flex items-center gap-2 cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Konfirmasi Check-out & Kembalikan KTP</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12 bg-slate-50 rounded-3xl border border-slate-200 text-slate-600">
            <QrCode className="w-12 h-12 text-slate-400 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-700">Belum Ada Peleton yang Dipilih</p>
            <p className="text-xs text-slate-500 mt-1">
              Gunakan kolom pencarian atau klik salah satu peleton di bawah untuk memproses logistik basecamp.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
