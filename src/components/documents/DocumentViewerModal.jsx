import React, { useState } from 'react';
import {
  X,
  Printer,
  FileText,
  Download,
  CheckCircle2,
  Shield,
  Award,
  ArrowLeft,
  BookOpen,
  FileCheck2,
  FileBadge2
} from 'lucide-react';
import { SITE, EVENT, VENUE, COMPETITION, PAYMENT, MATERIALS, PENALTIES } from '../../config.js';
import { useCompetition } from '../../context/CompetitionContext.jsx';

export default function DocumentViewerModal({ isOpen, onClose, data }) {
  const { teams, scores, docViewerData, goBack } = useCompetition();

  const effectiveData = data || docViewerData || { docId: 'juknis' };
  const [activeDocId, setActiveDocId] = useState(effectiveData.docId || 'juknis');

  // If effectiveData changes, sync activeDocId
  React.useEffect(() => {
    if (effectiveData?.docId) {
      setActiveDocId(effectiveData.docId);
    }
  }, [effectiveData?.docId]);

  if (isOpen === false) return null;

  const docId = activeDocId;
  const team = effectiveData.team || (teams.length > 0 ? teams[0] : null);

  function handlePrint() {
    window.print();
  }

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      goBack();
    }
  };

  const documentTabs = [
    { id: 'juknis', label: 'Petunjuk Teknis (Juknis)' },
    { id: 'form-a', label: 'Formulir A (Sekolah)' },
    { id: 'form-b', label: 'Formulir B (25 Personel)' },
    { id: 'form-c', label: 'Formulir C (Kesanggupan)' },
    { id: 'berita-acara', label: 'Berita Acara Juri' },
  ];

  return (
    <div className="min-h-screen bg-slate-200/70 text-slate-900 flex flex-col selection:bg-red-200">
      {/* Sticky Top Navigation Bar */}
      <header className="sticky top-0 z-30 bg-slate-950/95 backdrop-blur-md border-b border-slate-800 text-white py-3 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white transition-all text-xs font-bold flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Kembali</span>
            </button>
            <div className="h-5 w-px bg-slate-800 hidden sm:block"></div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-red-700 text-white flex items-center justify-center">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-yellow-400 block leading-none">
                  Dokumen Resmi
                </span>
                <span className="text-xs font-bold text-white">LBB Mu'allimin 2026</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-red-700 hover:bg-red-600 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-md shadow-red-950/30"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak / Simpan PDF</span>
            </button>
          </div>
        </div>

        {/* Document Switcher Tab Bar */}
        <div className="max-w-6xl mx-auto mt-3 pt-2 border-t border-slate-800/80 flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <span className="text-[11px] font-bold text-slate-400 mr-1 shrink-0">Pilih Dokumen:</span>
          {documentTabs.map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveDocId(tab.id)}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 ${
                activeDocId === tab.id
                  ? 'bg-red-700 text-white shadow-md'
                  : 'bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      {/* Main Document Reading Area (Paper Sheet View) */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-8 flex justify-center">
        <div className="bg-white p-8 sm:p-14 rounded-2xl shadow-xl border border-slate-300/80 w-full text-slate-900 font-serif leading-relaxed text-sm my-auto">
          
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
                <p>3. Tanggal perlombaan: <strong>{EVENT.COMPETITION_DATE}</strong>.</p>
                <p>4. Kuota peserta dibatasi maksimal {COMPETITION.MAX_TEAMS_TOTAL} peleton ({COMPETITION.MAX_TEAMS_SD} Peleton SD/MI dan {COMPETITION.MAX_TEAMS_SMP} Peleton SMP/MTs).</p>
              </div>

              <div className="space-y-2 pt-2">
                <h4 className="font-black text-sm uppercase text-red-700">BAB II: KOMPOSISI PELETON</h4>
                <p>1. Jumlah anggota dalam satu peleton adalah <strong>{COMPETITION.MEMBERS_PER_TEAM} orang</strong> (1 Komandan Peleton + 21 Pasukan Inti format 3 banjar x 7 saf + 3 Cadangan).</p>
                <p>2. Peleton dapat berupa Peleton Putra, Peleton Putri, ataupun Peleton Campuran (khusus SD/MI).</p>
                <p>3. Setiap sekolah berhak mengirimkan maksimal 2 peleton terbaik.</p>
              </div>

              <div className="space-y-2 pt-2">
                <h4 className="font-black text-sm uppercase text-red-700">BAB III: DURASI & ARENA LOMBA</h4>
                <p>1. Waktu tampil tiap peleton adalah <strong>{COMPETITION.PERFORMANCE_TIME_LIMIT_MINUTES} menit</strong>.</p>
                <p>2. Perhitungan waktu dimulai saat Komandan Peleton menginjak garis arena lomba dan berakhir saat peleton melintasi garis keluar.</p>
                <p>3. Ukuran arena perlombaan berukuran <strong>{VENUE.FIELD_SIZE}</strong> berpaving rata.</p>
              </div>

              <div className="space-y-2 pt-2">
                <h4 className="font-black text-sm uppercase text-red-700">BAB IV: PENILAIAN & DEWAN JURI</h4>
                <p>1. Penilaian dilakukan oleh Dewan Juri independen dan berkompeten dari unsur <strong>{COMPETITION.JURY_MEMBERS}</strong>.</p>
                <p>2. Unsur penilaian meliputi: PBB Dasar & Variasi ({COMPETITION.SCORING_PROPORTIONS.PBB}%), Kepemimpinan Komandan Peleton ({COMPETITION.SCORING_PROPORTIONS.DANTON}%), serta Formasi & Kerapian.</p>
                <p>3. Keputusan Dewan Juri bersifat <strong>mutlak dan tidak dapat diganggu gugat</strong>.</p>
              </div>

              <div className="pt-8 flex justify-end text-center text-xs">
                <div>
                  <p>Yogyakarta, 1 September 2026</p>
                  <p className="font-bold mt-1">Ketua Panitia Pelaksana,</p>
                  <div className="h-16 flex items-center justify-center text-slate-300 italic text-[10px]">
                    (Tanda Tangan & Cap Panitia)
                  </div>
                  <p className="font-bold underline">Falhan Zuhdi Mubarok</p>
                  <p className="text-[10px] text-slate-500">NIM/NBM. Panitia LBB 2026</p>
                </div>
              </div>
            </div>
          )}

          {/* DOKUMEN: FORMULIR A (INSTANSI) */}
          {docId === 'form-a' && (
            <div className="space-y-4 font-sans text-xs sm:text-sm text-slate-800">
              <div className="text-center mb-6">
                <h3 className="font-black text-lg uppercase underline">FORMULIR A: IDENTITAS SEKOLAH & KONTINGEN</h3>
                <span className="font-bold text-xs text-slate-500">LBB MU'ALLIMIN YOGYAKARTA 2026</span>
              </div>

              <table className="w-full border-collapse border border-slate-300 text-xs">
                <tbody>
                  <tr>
                    <td className="border border-slate-300 p-2 font-bold bg-slate-50 w-1/3">Nama Sekolah/Madrasah</td>
                    <td className="border border-slate-300 p-2 font-bold text-slate-900">{team?.schoolName || '-'}</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-300 p-2 font-bold bg-slate-50">Jenjang Pendidikan</td>
                    <td className="border border-slate-300 p-2">{team?.jenjang || '-'}</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-300 p-2 font-bold bg-slate-50">Nama Peleton</td>
                    <td className="border border-slate-300 p-2">{team?.platoonName || '-'}</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-300 p-2 font-bold bg-slate-50">Kategori Peleton</td>
                    <td className="border border-slate-300 p-2">{team?.category || '-'}</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-300 p-2 font-bold bg-slate-50">Nama Pembina / Official</td>
                    <td className="border border-slate-300 p-2">{team?.coachName || '-'}</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-300 p-2 font-bold bg-slate-50">No. WhatsApp / HP</td>
                    <td className="border border-slate-300 p-2 font-mono">{team?.waNumber || '-'}</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-300 p-2 font-bold bg-slate-50">Email Resmi</td>
                    <td className="border border-slate-300 p-2">{team?.email || '-'}</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-300 p-2 font-bold bg-slate-50">Status Pendaftaran</td>
                    <td className="border border-slate-300 p-2 uppercase font-bold text-emerald-700">{team?.status || '-'}</td>
                  </tr>
                </tbody>
              </table>

              <div className="pt-8 flex justify-between text-center text-xs">
                <div>
                  <p>Mengetahui,</p>
                  <p className="font-bold mt-1">Kepala Sekolah / Madrasah</p>
                  <div className="h-16"></div>
                  <p className="font-bold underline">( .................................................... )</p>
                  <p className="text-[10px] text-slate-500">NIP/NBM.</p>
                </div>
                <div>
                  <p>Yogyakarta, {new Date().toLocaleDateString('id-ID')}</p>
                  <p className="font-bold mt-1">Pembina Peleton,</p>
                  <div className="h-16"></div>
                  <p className="font-bold underline">( {team?.coachName || '....................................................'} )</p>
                </div>
              </div>
            </div>
          )}

          {/* DOKUMEN: FORMULIR B (ROSTER 25 PERSONEL) */}
          {docId === 'form-b' && (
            <div className="space-y-4 font-sans text-xs text-slate-800">
              <div className="text-center mb-4">
                <h3 className="font-black text-base sm:text-lg uppercase underline">FORMULIR B: DAFTAR SUSUNAN 25 PERSONEL PELETON</h3>
                <p className="font-bold text-xs text-slate-600">
                  {team?.schoolName || '-'} {team?.regCode ? `(${team.regCode})` : ''}
                </p>
              </div>

              {/* Danton Box */}
              <div className="border border-slate-300 rounded-xl p-3 bg-slate-50 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-black uppercase text-red-700 block">Komandan Peleton (Danton):</span>
                  <span className="font-bold text-sm text-slate-900">{team?.roster?.danton?.name || '-'}</span>
                </div>
                <div className="text-right text-[11px] text-slate-500">
                  <span>NISN: <strong>{team?.roster?.danton?.nisn || '-'}</strong></span> • 
                  <span> Kelas: <strong>{team?.roster?.danton?.class || '-'}</strong></span>
                </div>
              </div>

              {/* Tabel Pasukan Inti */}
              <table className="w-full border-collapse border border-slate-300 text-[10px]">
                <thead>
                  <tr className="bg-slate-100 font-bold">
                    <th className="border border-slate-300 p-1 w-6">No</th>
                    <th className="border border-slate-300 p-1 text-left">Nama Lengkap Siswa</th>
                    <th className="border border-slate-300 p-1 w-12">Saf</th>
                    <th className="border border-slate-300 p-1 w-14">Banjar</th>
                    <th className="border border-slate-300 p-1 w-20">NISN</th>
                    <th className="border border-slate-300 p-1 w-12">Kelas</th>
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
      </main>

      {/* Page Footer */}
      <footer className="border-t border-slate-300/80 bg-white py-6 text-center text-xs text-slate-500">
        <p>© 2026 Madrasah Mu'allimin Muhammadiyah Yogyakarta • Panitia Pelaksana LBB 2026</p>
      </footer>
    </div>
  );
}
