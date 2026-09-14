import React from 'react';
import {
  X,
  Printer,
  FileText,
  Download,
  CheckCircle2,
  Shield,
  Award
} from 'lucide-react';
import { SITE, EVENT, VENUE, COMPETITION, PAYMENT, MATERIALS, PENALTIES } from '../../config.js';
import { useCompetition } from '../../context/CompetitionContext.jsx';

export default function DocumentViewerModal({ isOpen, onClose, data }) {
  const { teams, scores } = useCompetition();

  if (!isOpen || !data) return null;

  const docId = data.docId || 'juknis';
  const team = data.team || null;

  function handlePrint() {
    window.print();
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] my-auto animate-in fade-in zoom-in-95 duration-200 text-slate-900">
        
        {/* Header Bar */}
        <div className="bg-slate-900 text-white p-4 sm:p-5 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-700 text-white flex items-center justify-center shadow-sm">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-yellow-400 block">
                Dokumen Resmi LBB Mu'allimin 2026
              </span>
              <h3 className="font-black text-base sm:text-lg text-white">
                {docId === 'juknis' && 'Petunjuk Teknis (Juknis) Resmi 2026'}
                {docId === 'form-a' && 'Formulir A – Identitas Instansi & Sekolah'}
                {docId === 'form-b' && 'Formulir B – Biodata 25 Personel Peleton'}
                {docId === 'form-c' && 'Formulir C – Surat Pernyataan Kesanggupan'}
                {docId === 'tata-tertib' && 'Tata Tertib & Ketentuan Perlombaan'}
                {docId === 'juknis-lapangan' && 'Petunjuk Teknis Lapangan & Denah Arena'}
                {docId === 'berita-acara' && 'Berita Acara Rekapitulasi Nilai Dewan Juri'}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-red-700 hover:bg-red-600 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-md"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak Dokumen</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Body (A4 Style Paper View) */}
        <div className="p-6 sm:p-10 overflow-y-auto flex-1 bg-slate-100 flex justify-center">
          <div className="bg-white p-8 sm:p-12 rounded-xl shadow-lg border border-slate-300 max-w-3xl w-full text-slate-900 font-serif leading-relaxed text-sm">
            
            {/* Kop Surat Resmi */}
            <div className="border-b-4 border-double border-slate-900 pb-4 mb-6 text-center">
              <h2 className="font-black text-lg sm:text-xl uppercase tracking-wider font-sans text-slate-900">
                PANITIA PELAKSANA LOMBA BARIS-BERBARIS (LBB)
              </h2>
              <h1 className="font-black text-xl sm:text-2xl uppercase tracking-tight font-sans text-red-700 mt-0.5">
                MU'ALLIMIN YOGYAKARTA TAHUN 2026
              </h1>
              <p className="text-xs font-sans text-slate-600 mt-1">
                Kampus Terpadu Madrasah Mu'allimin Muhammadiyah Yogyakarta • Dusun Bandut Lor, Argorejo, Sedayu, Bantul, DIY
              </p>
              <p className="text-[11px] font-sans text-slate-500">
                Website: lbb.tontimuallimin.com • Email: panitia@lbbmuallimin.com • WhatsApp: 0812-3009-3737
              </p>
            </div>

            {/* DOKUMEN: JUKNIS RESMI */}
            {docId === 'juknis' && (
              <div className="space-y-4 font-sans text-xs sm:text-sm text-slate-800">
                <div className="text-center mb-6">
                  <h3 className="font-black text-lg uppercase underline">PETUNJUK TEKNIS PELAKSANAAN</h3>
                  <span className="font-bold text-xs text-slate-500">Nomor: 001/PAN-LBB/MUALLIMIN/IX/2026</span>
                </div>

                <div className="space-y-2">
                  <h4 className="font-black text-sm uppercase text-red-700">BAB I: KETENTUAN UMUM</h4>
                  <p>1. Lomba Baris-Berbaris (LBB) Mu'allimin 2026 diselenggarakan untuk tingkat SD/MI dan SMP/MTs se-Daerah Istimewa Yogyakarta.</p>
                  <p>2. Pelaksanaan lomba bertempat di {VENUE.NAME}, {VENUE.ADDRESS}.</p>
                  <p>3. Hari dan tanggal pelaksanaan: <strong>{EVENT.COMPETITION_DATE}</strong>, waktu: {EVENT.COMPETITION_TIME_RANGE}.</p>
                  <p>4. Technical Meeting dilaksanakan pada <strong>{EVENT.TECHNICAL_MEETING_DATE}</strong> pukul {EVENT.TECHNICAL_MEETING_TIME}.</p>
                </div>

                <div className="space-y-2 pt-2">
                  <h4 className="font-black text-sm uppercase text-red-700">BAB II: PESERTA & PELETON</h4>
                  <p>1. Kuota peserta dibatasi maksimal 18 peleton SD/MI dan 18 peleton SMP/MTs (Sistem First Come, First Served).</p>
                  <p>2. Komposisi tiap peleton maksimal 25 orang: 1 Komandan Peleton (Danton), 21 Pasukan Inti (3 saf × 7 banjar), dan 3 Cadangan.</p>
                  <p>3. Minimal tampil di arena adalah 22 orang (1 Danton + 21 Pasukan Inti).</p>
                </div>

                <div className="space-y-2 pt-2">
                  <h4 className="font-black text-sm uppercase text-red-700">BAB III: SISTEM PENILAIAN</h4>
                  <p>1. Penilaian Danton: Penguasaan Materi (35%), Vokal (25%), Sikap Tampang (20%), Penguasaan Lapangan (20%). Skor 50–90.</p>
                  <p>2. Penilaian Pasukan PBB: Teknik Gerakan (70%), Kekompakan & Keselarasan (30%).</p>
                  <p>3. Pengurangan Nilai (Penalti): Injak garis (-50), overtime (-50/30 dtk), personel kurang (-75), absen upacara (-150).</p>
                </div>
              </div>
            )}

            {/* DOKUMEN: FORMULIR A (SEKOLAH) */}
            {docId === 'form-a' && (
              <div className="space-y-5 font-sans text-xs sm:text-sm text-slate-800">
                <div className="text-center mb-6">
                  <h3 className="font-black text-lg uppercase underline">FORMULIR A: DATA INSTANSI SEKOLAH</h3>
                  <span className="font-bold text-xs text-slate-500">LBB MU'ALLIMIN YOGYAKARTA 2026</span>
                </div>

                <div className="grid grid-cols-3 gap-y-3 text-xs sm:text-sm border p-4 rounded-xl bg-slate-50">
                  <span className="font-bold">Nama Sekolah/Madrasah</span>
                  <span className="col-span-2">: {team?.schoolName || '...................................................'}</span>

                  <span className="font-bold">Jenjang / Kategori</span>
                  <span className="col-span-2">: {team ? `${team.jenjang} / Peleton ${team.category}` : 'SD / SMP ......................................'}</span>

                  <span className="font-bold">Nama Peleton</span>
                  <span className="col-span-2">: {team?.platoonName || '...................................................'}</span>

                  <span className="font-bold">Alamat Sekolah</span>
                  <span className="col-span-2">: {team?.address || '...................................................'}</span>

                  <span className="font-bold">Nama Kepala Sekolah</span>
                  <span className="col-span-2">: ...................................................</span>

                  <span className="font-bold">Nama Pembina/Pelatih</span>
                  <span className="col-span-2">: {team?.coachName || '...................................................'}</span>

                  <span className="font-bold">Nomor WhatsApp Aktif</span>
                  <span className="col-span-2">: {team?.waNumber || '...................................................'}</span>
                </div>

                <div className="pt-8 flex justify-between text-center text-xs">
                  <div>
                    <p>Mengetahui,</p>
                    <p className="font-bold mt-1">Kepala Sekolah / Madrasah</p>
                    <div className="h-16"></div>
                    <p>( ................................................... )</p>
                    <p className="text-[10px] text-slate-500">NIP: .......................................</p>
                  </div>
                  <div>
                    <p>Yogyakarta, {new Date().toLocaleDateString('id-ID')}</p>
                    <p className="font-bold mt-1">Pembina / Official Peleton</p>
                    <div className="h-16"></div>
                    <p>( {team?.coachName || '...................................................'} )</p>
                  </div>
                </div>
              </div>
            )}

            {/* DOKUMEN: FORMULIR B (BIODATA 25 PERSONEL) */}
            {docId === 'form-b' && (
              <div className="space-y-4 font-sans text-xs text-slate-800">
                <div className="text-center mb-4">
                  <h3 className="font-black text-base sm:text-lg uppercase underline">FORMULIR B: DAFTAR SUSUNAN PERSONEL PELETON</h3>
                  <span className="font-bold text-xs text-slate-600">
                    Sekolah: {team?.schoolName || '...................................................'} ({team?.jenjang || 'SD/SMP'})
                  </span>
                </div>

                {/* Danton */}
                <div className="bg-red-50 p-2.5 rounded-lg border border-red-200">
                  <span className="font-black text-red-800 uppercase block">KOMANDAN PELETON (DANTON):</span>
                  <span className="font-bold text-slate-900">{team?.roster?.danton?.name || '1. ...................................................'}</span>
                  <span className="text-slate-600 ml-2">(NISN: {team?.roster?.danton?.nisn || '-'} • Kelas: {team?.roster?.danton?.class || '-'})</span>
                </div>

                {/* 21 Pasukan Table */}
                <table className="w-full border-collapse border border-slate-300 text-[11px]">
                  <thead>
                    <tr className="bg-slate-100">
                      <th className="border border-slate-300 p-1.5 w-8">No</th>
                      <th className="border border-slate-300 p-1.5 text-left">Nama Lengkap Pasukan</th>
                      <th className="border border-slate-300 p-1.5 w-16">Saf</th>
                      <th className="border border-slate-300 p-1.5 w-16">Banjar</th>
                      <th className="border border-slate-300 p-1.5 w-24">NISN</th>
                      <th className="border border-slate-300 p-1.5 w-16">Kelas</th>
                    </tr>
                  </thead>
                  <tbody>
                    {team?.roster?.pasukan?.map((p, idx) => (
                      <tr key={p.id}>
                        <td className="border border-slate-300 p-1 text-center font-bold">{idx + 1}</td>
                        <td className="border border-slate-300 p-1 font-semibold">{p.name}</td>
                        <td className="border border-slate-300 p-1 text-center">{p.safNumber}</td>
                        <td className="border border-slate-300 p-1 text-center">{p.banjarNumber}</td>
                        <td className="border border-slate-300 p-1 font-mono text-center">{p.nisn}</td>
                        <td className="border border-slate-300 p-1 text-center">{p.class}</td>
                      </tr>
                    )) || (
                      Array.from({ length: 21 }).map((_, i) => (
                        <tr key={i}>
                          <td className="border border-slate-300 p-1 text-center">{i + 1}</td>
                          <td className="border border-slate-300 p-1">...................................................</td>
                          <td className="border border-slate-300 p-1 text-center">{Math.ceil((i + 1) / 7)}</td>
                          <td className="border border-slate-300 p-1 text-center">{(i % 7) + 1}</td>
                          <td className="border border-slate-300 p-1 text-center">-</td>
                          <td className="border border-slate-300 p-1 text-center">-</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>

                {/* Cadangan & Official */}
                <div className="grid grid-cols-2 gap-3 pt-2 text-[11px]">
                  <div className="border p-2 rounded-lg bg-slate-50">
                    <span className="font-bold block text-slate-800 uppercase mb-1">3 Personel Cadangan:</span>
                    {team?.roster?.cadangan?.map((c, i) => (
                      <div key={c.id}>C{i + 1}. {c.name} ({c.nisn || '-'})</div>
                    )) || <div>1. ................................. 2. ................................. 3. .................................</div>}
                  </div>
                  <div className="border p-2 rounded-lg bg-slate-50">
                    <span className="font-bold block text-slate-800 uppercase mb-1">Tim Official (3 Orang):</span>
                    {team?.roster?.officials?.map(o => (
                      <div key={o.id}>• {o.role}: {o.name}</div>
                    )) || <div>• Pelatih 1: ............................. • Pelatih 2: .............................</div>}
                  </div>
                </div>
              </div>
            )}

            {/* DOKUMEN: FORMULIR C (PERNYATAAN) */}
            {docId === 'form-c' && (
              <div className="space-y-4 font-sans text-xs sm:text-sm text-slate-800 leading-relaxed">
                <div className="text-center mb-6">
                  <h3 className="font-black text-lg uppercase underline">FORMULIR C: SURAT PERNYATAAN DAN KESANGGUPAN</h3>
                  <span className="font-bold text-xs text-slate-500">LBB MU'ALLIMIN YOGYAKARTA 2026</span>
                </div>

                <p>Yang bertanda tangan di bawah ini:</p>
                <div className="pl-4 space-y-1">
                  <div>Nama Lengkap : <strong>{team?.coachName || '...................................................'}</strong></div>
                  <div>Jabatan / Peran : Pembina / Pelatih Peleton</div>
                  <div>Asal Instansi/Sekolah : <strong>{team?.schoolName || '...................................................'}</strong></div>
                  <div>No. Handphone/WA : {team?.waNumber || '...................................................'}</div>
                </div>

                <p className="pt-2">Dengan ini menyatakan dengan penuh kesadaran dan tanggung jawab bahwa:</p>
                <ol className="list-decimal pl-5 space-y-2">
                  <li>Seluruh personil yang kami daftarkan adalah benar siswa/siswi aktif dari sekolah kami yang sah.</li>
                  <li>Sanggup mematuhi dan tunduk pada seluruh Petunjuk Teknis, Tata Tertib, dan Regulasi LBB Mu'allimin 2026.</li>
                  <li>Menerima segala keputusan Dewan Juri secara mutlak dan tidak dapat diganggu gugat oleh pihak manapun.</li>
                  <li>Bersedia menjaga sportivitas, etika, kesopanan, dan kebersihan lingkungan kampus selama perlombaan berlangsung.</li>
                </ol>

                <div className="pt-8 flex justify-end text-center text-xs">
                  <div>
                    <p>Yogyakarta, {new Date().toLocaleDateString('id-ID')}</p>
                    <p className="font-bold mt-1">Yang Membuat Pernyataan,</p>
                    <div className="h-16 flex items-center justify-center text-slate-300 italic text-[10px]">
                      (Materai Rp10.000)
                    </div>
                    <p className="font-bold underline">( {team?.coachName || '...................................................'} )</p>
                    <p className="text-[10px] text-slate-500">Pembina Peleton</p>
                  </div>
                </div>
              </div>
            )}

            {/* DOKUMEN: BERITA ACARA REKAPITULASI NILAI DEWAN JURI */}
            {docId === 'berita-acara' && (
              <div className="space-y-4 font-sans text-xs text-slate-800">
                <div className="text-center mb-6">
                  <h3 className="font-black text-base sm:text-lg uppercase underline">BERITA ACARA REKAPITULASI HASIL PENILAIAN DEWAN JURI</h3>
                  <span className="font-bold text-xs text-slate-500">Nomor: 009/BA-JURI/LBB-MUALLIMIN/XI/2026</span>
                </div>

                <p>
                  Pada hari ini, <strong>{EVENT.COMPETITION_DATE}</strong>, bertempat di {VENUE.NAME}, Dewan Juri Lomba Baris-Berbaris Mu'allimin 2026 telah melaksanakan penilaian teknis dan rekapitulasi nilai akhir dengan hasil sebagai berikut:
                </p>

                {/* Tabel Rekapitulasi */}
                <table className="w-full border-collapse border border-slate-300 text-[11px] my-3">
                  <thead>
                    <tr className="bg-slate-100">
                      <th className="border border-slate-300 p-1.5">Rank</th>
                      <th className="border border-slate-300 p-1.5 text-left">Nama Sekolah & Peleton</th>
                      <th className="border border-slate-300 p-1.5">Jenjang</th>
                      <th className="border border-slate-300 p-1.5 text-center">Nilai Danton</th>
                      <th className="border border-slate-300 p-1.5 text-center">Nilai PBB</th>
                      <th className="border border-slate-300 p-1.5 text-center">Penalti</th>
                      <th className="border border-slate-300 p-1.5 text-right font-black">Total Poin</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teams
                      .filter(t => scores[t.id])
                      .map(t => ({ ...t, score: scores[t.id] }))
                      .sort((a, b) => b.score.finalScore - a.score.finalScore)
                      .map((t, idx) => (
                        <tr key={t.id}>
                          <td className="border border-slate-300 p-1 text-center font-bold">{idx + 1}</td>
                          <td className="border border-slate-300 p-1 font-bold">{t.schoolName} ({t.platoonName})</td>
                          <td className="border border-slate-300 p-1 text-center">{t.jenjang}</td>
                          <td className="border border-slate-300 p-1 text-center font-mono">{t.score.danton.total}</td>
                          <td className="border border-slate-300 p-1 text-center font-mono">{t.score.pbb.total}</td>
                          <td className="border border-slate-300 p-1 text-center font-mono text-rose-700">-{t.score.penalties.totalPenalty}</td>
                          <td className="border border-slate-300 p-1 text-right font-mono font-black">{t.score.finalScore}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>

                <p className="text-[11px]">
                  Demikian Berita Acara ini dibuat dengan sebenar-benarnya berdasarkan ketentuan teknis yang berlaku, bersifat mutlak dan tidak dapat diganggu gugat.
                </p>

                <div className="pt-6 grid grid-cols-2 text-center text-xs">
                  <div>
                    <p>Mengetahui,</p>
                    <p className="font-bold">Ketua Panitia LBB Mu'allimin 2026</p>
                    <div className="h-16"></div>
                    <p className="font-bold underline">( Falhan Zuhdi Mubarok )</p>
                  </div>
                  <div>
                    <p>Ditetapkan di Bantul, DIY</p>
                    <p className="font-bold">Ketua Dewan Juri (TNI/Polri)</p>
                    <div className="h-16"></div>
                    <p className="font-bold underline">( Mayor (Mar) Bambang S., S.E. )</p>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}
