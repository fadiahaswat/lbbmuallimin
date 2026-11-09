import React from 'react';
import { X, Printer, Shield, AlertCircle } from 'lucide-react';

export default function PhysicalIntegrityPactModal({
  isOpen,
  onClose,
  team
}) {
  if (!isOpen || !team) return null;

  const schoolName = team.schoolName || team.schoolBaseName || '-';
  const jenjang = team.jenjang || 'SMP';
  const officialName = team.officialName || team.roster?.officials?.[0]?.name || team.coachName || '-';
  const dantonName = team.roster?.danton?.name || team.dantonName || '-';
  const regCode = team.regCode || '-';
  const rawWa = String(team.waNumber || team.roster?.officials?.[0]?.phone || '').trim();
  const formatWa = (num) => {
    if (!num) return '-';
    const cleaned = num.replace(/\D/g, '');
    if (!cleaned) return num;
    if (cleaned.startsWith('62')) return '0' + cleaned.slice(2);
    if (!cleaned.startsWith('0')) return '0' + cleaned;
    return cleaned;
  };
  const waNumber = formatWa(rawWa);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex flex-col items-center justify-start p-2 sm:p-6 overflow-y-auto">
      {/* Print CSS Rules */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #print-area-wrapper, #print-area-wrapper * {
            visibility: visible;
          }
          #print-area-wrapper {
            position: fixed !important;
            left: 0 !important;
            top: 0 !important;
            width: 210mm !important;
            height: 297mm !important;
            margin: 0 !important;
            padding: 0 !important;
            box-shadow: none !important;
            border: none !important;
            background: white !important;
            overflow: hidden !important;
            page-break-after: avoid;
            page-break-before: avoid;
          }
          @page {
            size: A4 portrait;
            margin: 0;
          }
        }
      `}</style>

      <div className="bg-slate-100 sm:border sm:border-slate-300 sm:rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl relative my-auto shrink-0 overflow-hidden">
        
        {/* Header Modal di Layar (Hidden saat di-print) */}
        <div className="bg-slate-950 text-white px-4 sm:px-6 py-3.5 flex items-center justify-between border-b border-slate-800 shadow-md print:hidden shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-red-600 text-white flex items-center justify-center font-black">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 block">
                Lembar Cetak Dokumen Fisik A4 (Bab A.7.b / Pasal 2)
              </span>
              <h3 className="text-xs sm:text-sm font-black text-white uppercase truncate">
                Pakta Integritas Peserta (Tanda Tangan Basah)
              </h3>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-2 bg-red-700 hover:bg-red-600 text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-md cursor-pointer active:scale-95"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak / Print A4</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Body Modal */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-6">
          {/* CONTAINER KERTAS A4 ASLI (Print Area) */}
          <div className="flex justify-center items-center overflow-x-auto">
            <div
              id="print-area-wrapper"
              className="w-[210mm] min-h-[297mm] h-[297mm] bg-white shadow-xl relative text-slate-900 overflow-hidden flex flex-col justify-between shrink-0 select-none"
              style={{
                backgroundImage: 'url(/kop-lbb.png)',
                backgroundSize: '100% 100%',
                backgroundPosition: 'top center',
                backgroundRepeat: 'no-repeat',
              }}
            >
              {/* KONTEN DOKUMEN: Diselaraskan 100% menggunakan font-serif (Times New Roman / Formal) ukuran proporsional */}
              <div 
                className="pt-[34mm] pb-[25mm] px-[20mm] flex-1 text-black font-serif text-[11.5px] leading-relaxed space-y-2.5"
                style={{ fontFamily: '"Times New Roman", Times, serif' }}
              >
                
                {/* JUDUL DOKUMEN: Rata Tengah & Lebih Besar (Tanpa Garis Bawah) */}
                <div className="text-center pb-2 space-y-1">
                  <h4 className="font-bold text-[15px] uppercase tracking-wider text-black">
                    SURAT PERNYATAAN & PAKTA INTEGRITAS PESERTA
                  </h4>
                  <p className="text-[11px] text-black">
                    Nomor Registrasi: <span className="font-bold">{regCode}</span>
                  </p>
                </div>

                {/* PEMBUKA: Rata Kiri */}
                <p className="text-left leading-relaxed">
                  Yang bertanda tangan di bawah ini secara sah, sadar, dan bertindak atas nama kontingen sekolah/madrasah:
                </p>

                {/* BIODATA FORMAL STANDAR SURAT RESMI: Rata Kiri Penuh */}
                <table className="w-full text-[11.5px] border-collapse">
                  <tbody>
                    <tr>
                      <td className="w-52 py-0.5 align-top text-black">Nama Official / Pelatih</td>
                      <td className="w-4 py-0.5 align-top text-black">:</td>
                      <td className="py-0.5 align-top font-bold text-black">{officialName}</td>
                    </tr>
                    <tr>
                      <td className="py-0.5 align-top text-black">Nomor WhatsApp Aktif</td>
                      <td className="py-0.5 align-top text-black">:</td>
                      <td className="py-0.5 align-top text-black">{waNumber}</td>
                    </tr>
                    <tr>
                      <td className="py-0.5 align-top text-black">Sekolah / Madrasah</td>
                      <td className="py-0.5 align-top text-black">:</td>
                      <td className="py-0.5 align-top font-bold text-black">{schoolName} ({jenjang})</td>
                    </tr>
                    <tr>
                      <td className="py-0.5 align-top text-black">Nama Komandan Peleton</td>
                      <td className="py-0.5 align-top text-black">:</td>
                      <td className="py-0.5 align-top font-bold text-black">{dantonName}</td>
                    </tr>
                    <tr>
                      <td className="py-0.5 align-top text-black">Kategori & Satuan Peleton</td>
                      <td className="py-0.5 align-top text-black">:</td>
                      <td className="py-0.5 align-top text-black">{team.category || team.teamType || 'Putra'} - {team.teamUnit || 'Tunggal'}</td>
                    </tr>
                  </tbody>
                </table>

                {/* PERNYATAAN: Rata Kiri */}
                <p className="text-left pt-0.5">
                  Dengan ini menyatakan dengan penuh rasa tanggung jawab dan sungguh-sungguh bahwa:
                </p>

                {/* BUTIR-BUTIR PAKTA: Rata Kiri & Justify dengan Nomor Urut Eksplisit Pasti Muncul */}
                <table className="w-full border-collapse my-1 text-[11px] leading-relaxed">
                  <tbody>
                    <tr>
                      <td className="w-5 align-top font-bold text-black py-0.5">1.</td>
                      <td className="align-top text-justify text-black py-0.5">
                        <strong>Keabsahan Siswa:</strong> Seluruh anggota peleton yang didaftarkan (1 Komandan, 21 Anggota Inti, dan 3 Cadangan) adalah <strong>siswa/siswi aktif</strong> yang sah dari sekolah/madrasah yang bersangkutan, dibuktikan dengan Kartu Pelajar sah dan Surat Tugas Kepala Sekolah.
                      </td>
                    </tr>
                    <tr>
                      <td className="align-top font-bold text-black py-0.5">2.</td>
                      <td className="align-top text-justify text-black py-0.5">
                        <strong>Kejujuran Administrasi:</strong> Tidak memanipulasi data identitas siswa, NISN, pemalsuan stempel/tanda tangan surat rekomendasi kepala sekolah, maupun menyertakan peserta dari luar sekolah/madrasah.
                      </td>
                    </tr>
                    <tr>
                      <td className="align-top font-bold text-black py-0.5">3.</td>
                      <td className="align-top text-justify text-black py-0.5">
                        <strong>Kepatuhan Petunjuk Teknis:</strong> Bersedia mematuhi seluruh ketentuan Petunjuk Teknis Pendaftaran, Lapangan, Penilaian & Kejuaraan, serta Tata Tertib Peserta LBB Mu'allimin 2027.
                      </td>
                    </tr>
                    <tr>
                      <td className="align-top font-bold text-black py-0.5">4.</td>
                      <td className="align-top text-justify text-black py-0.5">
                        <strong>Sportivitas & Keputusan Juri:</strong> Menjunjung tinggi sportivitas, etika madrasah, dan menerima seluruh hasil penilaian serta keputusan Sidang Dewan Juri secara mutlak dan tidak dapat diganggu gugat.
                      </td>
                    </tr>
                    <tr>
                      <td className="align-top font-bold text-black py-0.5">5.</td>
                      <td className="align-top text-justify text-black py-0.5">
                        <strong>Sanksi Mutlak:</strong> Apabila melanggar ketentuan di atas, kami bersedia menerima sanksi pembatalan kejuaraan, pemotongan nilai, hingga <strong>DISKUALIFIKASI MUTLAK</strong> dan pemblokiran (blacklist).
                      </td>
                    </tr>
                  </tbody>
                </table>

                {/* PENUTUP */}
                <p className="text-justify italic text-black pt-0.5">
                  Demikian Surat Pernyataan dan Pakta Integritas ini dibuat dengan sebenar-benarnya tanpa adanya paksaan dari pihak manapun untuk diserahkan sebagai syarat sah registrasi berkas fisik Technical Meeting LBB Mu'allimin 2027.
                </p>

                {/* KOLOM TANDA TANGAN & MATERAI: Tanggal TM Resmi 9 Januari 2027 (Jarak Seimbang & Materai Geser Kiri) */}
                <div className="grid grid-cols-2 gap-6 text-[11.5px] pt-4">
                  {/* Kolom Danton */}
                  <div className="text-center space-y-1">
                    <p className="text-[11px] text-black">Mengetahui,</p>
                    <p className="font-bold text-black">Komandan Peleton</p>
                    <div className="h-16 flex items-end justify-center">
                    </div>
                    <p className="font-bold text-black uppercase text-[11.5px]">{dantonName}</p>
                  </div>

                  {/* Kolom Official */}
                  <div className="text-center space-y-1">
                    <p className="text-[11px] text-black">Yogyakarta, 9 Januari 2027</p>
                    <p className="font-bold text-black">Official / Pelatih Pendamping</p>
                    <div className="h-16 flex items-end justify-center">
                    </div>
                    <p className="font-bold text-black uppercase text-[11.5px]">{officialName}</p>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>

        {/* Footer Modal di Layar (Hidden saat print) */}
        <div className="bg-white border-t border-slate-200 px-6 py-3 flex justify-end gap-2.5 print:hidden shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 rounded-xl border border-slate-200 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Tutup
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="px-6 py-2.5 bg-red-700 hover:bg-red-800 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak / Print PDF Sekarang</span>
          </button>
        </div>

      </div>
    </div>
  );
}
