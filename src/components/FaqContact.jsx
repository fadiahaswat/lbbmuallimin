import React, { useState } from 'react';
import {
  ChevronDown,
  Headset,
  MessageCircle,
  ExternalLink,
  MapPin
} from 'lucide-react';
import { CONTACT, EVENT, COMPETITION, PAYMENT, VENUE } from '../config.js';

const FAQ_DATA = [
  {
    id: 1,
    category: 'Umum',
    q: 'Apa itu LBB Mu’allimin Tahun 2026?',
    a: 'LBB Mu’allimin Tahun 2026 adalah ajang perlombaan baris-berbaris antar pelajar tingkat SD/MI dan SMP/MTs atau sederajat di wilayah Daerah Istimewa Yogyakarta yang diselenggarakan oleh Madrasah Mu’allimin Muhammadiyah Yogyakarta.',
  },
  {
    id: 2,
    category: 'Umum',
    q: 'Siapa saja yang boleh mengikuti lomba ini?',
    a: 'Peserta adalah siswa/i aktif SD/MI, SMP/MTs atau yang sederajat, berasal dari sekolah di wilayah Daerah Istimewa Yogyakarta.',
  },
  {
    id: 3,
    category: 'Umum',
    q: 'Apakah sekolah boleh mengirim lebih dari satu tim?',
    a: `Ya. Setiap sekolah maksimal boleh mendaftarkan ${COMPETITION.MAX_PLATOONS_PER_SCHOOL} peleton.`,
  },
  {
    id: 4,
    category: 'Teknis',
    q: 'Apakah peleton boleh campuran putra dan putri?',
    a: 'Boleh. Komposisi peleton diperbolehkan heterogen (putra dan putri).',
  },
  {
    id: 5,
    category: 'Biaya',
    q: 'Berapa biaya pendaftaran lomba?',
    a: `Biaya pendaftaran sebesar ${PAYMENT.FEE_FULL}`,
  },
  {
    id: 6,
    category: 'Biaya',
    q: 'Ke mana biaya pendaftaran ditransfer?',
    a: `Bank: ${PAYMENT.BANK_NAME} | No. Rekening: ${PAYMENT.ACCOUNT_NUMBER} | Atas Nama: ${PAYMENT.ACCOUNT_NAME}`,
  },
  {
    id: 7,
    category: 'Biaya',
    q: 'Apakah biaya pendaftaran bisa dikembalikan?',
    a: 'Tidak. Biaya pendaftaran bersifat non-refundable dengan alasan apa pun.',
  },
  {
    id: 8,
    category: 'Umum',
    q: 'Apakah ada sistem booking kuota?',
    a: 'Tidak. Status pendaftaran hanya sah setelah seluruh prosedur dan pembayaran diselesaikan.',
  },
  {
    id: 9,
    category: 'Umum',
    q: 'Kapan pendaftaran dibuka dan ditutup?',
    a: `Pendaftaran daring resmi dibuka mulai ${EVENT.REGISTRATION_RANGE} s.d. pukul 23.59 WIB.`,
  },
  {
    id: 10,
    category: 'Teknis',
    q: 'Kapan & Dimana penyerahan berkas fisik?',
    a: `Waktu: ${EVENT.TECHNICAL_MEETING_FULL_DATE} (${EVENT.TECHNICAL_MEETING_TIME_RANGE}) | Lokasi: ${EVENT.TECHNICAL_MEETING_VENUE}`,
  },
  {
    id: 11,
    category: 'Teknis',
    q: 'Ketentuan jumlah personel peleton?',
    a: `${COMPETITION.COMPOSITION_DETAIL} ${COMPETITION.MIN_PERFORM_DETAIL} Satu personel TIDAK boleh terdaftar di dua peleton berbeda. Official: Max 2 official + 1 dokumentasi.`,
  },
  {
    id: 12,
    category: 'Teknis',
    q: 'Bagaimana prosedur pendaftaran?',
    a: '1. Transfer biaya pendaftaran. 2. Isi formulir daring & Upload Formulir B (.docx) + Bukti Bayar. 3. Formulir B tidak perlu TTD Kepala Sekolah saat upload. 4. Data online dianggap final. 5. Serahkan berkas fisik (Form A, B, C).',
  },
  {
    id: 13,
    category: 'Teknis',
    q: 'Ketentuan berkas fisik & map?',
    a: 'Berkas: Formulir A, B, dan C. Map SD/MI: MERAH (Biola). Map SMP/MTs: BIRU (Biola). Wajib diserahkan langsung, tidak boleh via pos.',
  },
  {
    id: 14,
    category: 'Teknis',
    q: 'Info Teknis Lapangan (Clear Area, DP, Ukuran)?',
    a: 'Clear Area: Area steril (Peleton, 2 Official, 1 Dokum, Panitia). DP 1: Tunggu/Verifikasi (Hadir min 15 menit sebelum tampil). DP 2: Persiapan akhir. Ukuran Lapangan: SD (25x14m), SMP (26x15m).',
  },
  {
    id: 15,
    category: 'Teknis',
    q: 'Aturan Pergantian Pemain & Danton?',
    a: 'Boleh di DP atau Jeda Materi (SD: Materi 20-21, SMP: Materi 17-18). Danton: TIDAK BOLEH diganti kecuali darurat medis (pingsan/sakit parah).',
  },
  {
    id: 16,
    category: 'Teknis',
    q: 'Penilaian, Waktu, & Sanksi?',
    a: 'Dasar: Perpang TNI No. 57 & 58 Tahun 2018. Durasi: SD (10 menit), SMP (13 menit). Sanksi: Tidak ikut Upacara (-150), Terlambat DP 1 (-100). Protes: Max 60 menit setelah rekap. Hanya teknis.',
  },
];

export default function FaqContact() {
  const [selectedFilter, setSelectedFilter] = useState('Semua');
  const [openIds, setOpenIds] = useState({});

  function toggleFaq(id) {
    setOpenIds(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  }

  const filteredFaqs = FAQ_DATA.filter(item => {
    if (selectedFilter === 'Semua') return true;
    return item.category === selectedFilter;
  });

  return (
    <section id="contact" className="relative py-24 lg:py-32 bg-slate-950 overflow-hidden text-white border-t border-slate-900 font-sans">
      <div className="absolute inset-0 opacity-10 bg-carbon-pattern pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-900/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-yellow-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <span className="text-yellow-500 font-bold tracking-[0.2em] text-xs uppercase mb-2 block animate-pulse">
            Knowledge Base
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-white uppercase italic tracking-tighter mb-4 leading-tight py-1">
            FAQ & <span className="inline-block pr-3 sm:pr-4 pb-1 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">Bantuan</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Temukan jawaban lengkap seputar pendaftaran, teknis lomba, hingga aturan main di sini.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16">
          {/* FAQ Accordion Column */}
          <div className="lg:col-span-8">
            {/* Filter Buttons */}
            <div className="flex flex-wrap gap-2 mb-6">
              {['Semua', 'Umum', 'Biaya', 'Teknis'].map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedFilter(category)}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-colors ${
                    selectedFilter === category
                      ? 'bg-red-600 text-white border border-red-500'
                      : 'glass text-slate-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>


            {/* Accordion List */}
            <div className="space-y-3 max-h-[800px] overflow-y-auto custom-scrollbar pr-2">
              {filteredFaqs.map(faq => {
                const isOpen = !!openIds[faq.id];
                return (
                  <div key={faq.id} className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden">
                    <button
                      onClick={() => toggleFaq(faq.id)}
                      className="w-full flex justify-between items-center p-4 text-left hover:bg-slate-800/50 transition-colors"
                    >
                      <span className="font-bold text-slate-200 text-sm">{faq.q}</span>
                      <ChevronDown
                        className={`text-slate-400 w-4 h-4 transition-transform duration-300 shrink-0 ml-2 ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="bg-slate-950/30 border-t border-slate-800 p-4 text-xs text-slate-400 leading-relaxed animate-fade">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Contact Cards */}
          <div className="lg:col-span-4 space-y-6">
            <div className="glass-dark rounded-3xl p-8 border-white/8 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-600/20 rounded-bl-full -mr-8 -mt-8 blur-xl"></div>

              <h3 className="text-xl font-black text-white mb-6 uppercase italic flex items-center gap-3">
                <Headset className="w-5 h-5 text-yellow-500" /> Hubungi Panitia
              </h3>

              <div className="space-y-4">
                {CONTACT.PERSONS.map((person, idx) => (
                  <a
                    key={idx}
                    href={person.WA_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-4 p-4 rounded-xl glass hover:bg-white/10 hover:border-green-600/40 transition-all duration-300"
                  >
                    <div className="w-10 h-10 rounded-full bg-green-900/50 flex items-center justify-center text-green-500 border border-green-800">
                      <MessageCircle className="w-4 h-4" />
                    </div>
                    <div className="flex-grow">
                      <h4 className="font-bold text-white text-sm group-hover:text-green-500 transition-colors">
                        {person.NAME}
                      </h4>
                      <p className="text-[10px] text-slate-400 font-mono">{person.PHONE_DISPLAY}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>


            <a
              href={VENUE.MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl overflow-hidden relative border border-slate-800 hover:border-red-500/50 transition-all h-36 group block bg-slate-900/90 shadow-md"
            >
              <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px] opacity-25 group-hover:opacity-45 transition-opacity"></div>
              <div className="absolute top-3 right-3 z-10">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-800/90 border border-slate-700 text-[10px] font-bold text-yellow-500 group-hover:bg-red-950 group-hover:border-red-500/50 group-hover:text-red-300 transition-all">
                  <MapPin className="w-3 h-3 text-red-500" />
                  Buka Maps
                  <ExternalLink className="w-3 h-3" />
                </span>
              </div>
              <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black via-black/85 to-transparent">
                <p className="text-xs font-bold text-white group-hover:text-yellow-400 transition-colors">
                  {VENUE.MAPS_PREVIEW_NAME}
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {VENUE.MAPS_PREVIEW_ADDRESS}
                </p>
              </div>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
