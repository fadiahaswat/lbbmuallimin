import React, { useState, useMemo } from 'react';
import {
  ChevronDown,
  Headset,
  MessageCircle,
  ExternalLink,
  MapPin,
  Search,
  HelpCircle,
  CreditCard,
  FileCheck2,
  Users2,
  Calendar,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Clock,
  Layers
} from 'lucide-react';
import { CONTACT, EVENT, COMPETITION, PAYMENT, VENUE, VENUE_INDUK } from '../config.js';

const FAQ_DATA = [
  // --- KATEGORI 1: PENDAFTARAN & SYARAT ---
  {
    id: 1,
    category: 'Pendaftaran',
    icon: 'Users2',
    q: 'Siapa saja yang berhak mengikuti perlombaan LBB Mu\'allimin 2027?',
    a: 'Peserta adalah siswa/i aktif tingkat SD/MI dan SMP/MTs (atau sederajat) yang terdaftar di sekolah wilayah Daerah Istimewa Yogyakarta (Kota Yogyakarta, Sleman, Bantul, Kulon Progo, dan Gunungkidul). Keabsahan dibuktikan dengan Kartu Pelajar atau Surat Keterangan Kepala Sekolah.',
  },
  {
    id: 2,
    category: 'Pendaftaran',
    icon: 'Users2',
    q: 'Berapa jumlah maksimal peleton yang dapat dikirimkan tiap sekolah?',
    a: `Tiap pangkalan sekolah berhak mengirimkan maksimal ${COMPETITION.MAX_PLATOONS_PER_SCHOOL} peleton (misal: Peleton A dan Peleton B). Kuota dibatasi sebanyak 18 Peleton SD/MI dan 18 Peleton SMP/MTs (total 36 peleton se-DIY).`,
  },
  {
    id: 3,
    category: 'Pendaftaran',
    icon: 'Users2',
    q: 'Apakah diperbolehkan peleton campuran (putra dan putri)?',
    a: 'Sangat diperbolehkan. Peleton bersifat terbuka: boleh murni putra, murni putri, maupun peleton campuran (heterogen) putra dan putri dalam satu barisan.',
  },
  {
    id: 4,
    category: 'Pendaftaran',
    icon: 'FileCheck2',
    q: 'Kapan periode pendaftaran online dibuka dan ditutup?',
    a: `Pendaftaran online resmi dibuka mulai ${EVENT.REGISTRATION_RANGE} pukul 23.59 WIB melalui portal web resmi. Pendaftaran dapat ditutup lebih awal apabila kuota kuota 18 peleton per jenjang telah terpenuhi.`,
  },
  {
    id: 5,
    category: 'Pendaftaran',
    icon: 'FileCheck2',
    q: 'Bagaimana alur pendaftaran peleton secara digital?',
    a: 'Pendaftaran 100% paperless: (1) Klik tombol "Daftar Peleton" di web; (2) Masukkan data identitas sekolah & email; (3) Masukkan data Komandan Peleton & Official; (4) Unggah bukti transfer pembayaran & bubuhkan tanda tangan digital Pakta Integritas; (5) Dapatkan Kode Registrasi resmi untuk memantau status validasi berkas.',
  },

  // --- KATEGORI 2: BIAYA & PEMBAYARAN ---
  {
    id: 6,
    category: 'Biaya',
    icon: 'CreditCard',
    q: 'Berapa besaran biaya pendaftaran dan bagaimana skema periodenya?',
    a: `Biaya pendaftaran dibagi menjadi 2 gelombang: Gelombang 1 (5 – 18 Oktober 2026) sebesar Rp350.000,- per peleton; Gelombang 2 (19 Oktober – 1 November 2026) sebesar Rp400.000,- per peleton. Biaya sudah mencakup sertifikat cetak resmi, fasilitas air minum, ID Card, dan akses basecamp peleton.`,
  },
  {
    id: 7,
    category: 'Biaya',
    icon: 'CreditCard',
    q: 'Ke rekening mana pembayaran pendaftaran ditransfer?',
    a: `Pembayaran dilakukan melalui transfer bank ke rekening resmi panitia: Bank ${PAYMENT.BANK_NAME} No. Rekening: ${PAYMENT.ACCOUNT_NUMBER} a.n. ${PAYMENT.ACCOUNT_NAME}. Pastikan mencantumkan berita transfer: [NAMA SEKOLAH]_[JUMLAH PELETON].`,
  },
  {
    id: 8,
    category: 'Biaya',
    icon: 'CreditCard',
    q: 'Apakah biaya pendaftaran dapat dibatalkan atau ditarik kembali (refund)?',
    a: 'Tidak. Sesuai regulasi pada juknis, seluruh biaya pendaftaran yang telah ditransfer bersifat non-refundable (tidak dapat dikembalikan dengan alasan apa pun) jika pihak sekolah mengundurkan diri secara sepihak.',
  },

  // --- KATEGORI 3: TEKNIS & ARENA LOMBA ---
  {
    id: 9,
    category: 'Teknis',
    icon: 'Layers',
    q: 'Berapa komposisi anggota pasukan di setiap peleton?',
    a: 'Maksimal 25 orang per peleton: terdiri dari 1 Komandan Peleton (Danton), 21 Pasukan Utama (formasi 3 banjar × 7 bersyaf), dan 3 Pasukan Cadangan. Minimal pasukan yang tampil di lapangan adalah 22 orang (1 Danton + 21 Pasukan). Tim Official dibatasi maksimal 2 Pelatih/Pembina dan 1 Dokumentasi.',
  },
  {
    id: 10,
    category: 'Teknis',
    icon: 'Layers',
    q: 'Berapa ukuran kotak arena dan durasi tampil masing-masing jenjang?',
    a: 'Jenjang SD/MI: Kotak arena berukuran 25 meter × 14 meter di Arena Basket dengan batas durasi tampil maksimal 10 menit. Jenjang SMP/MTs: Kotak arena berukuran 26 meter × 15 meter di Pelataran Embung dengan durasi tampil maksimal 13 menit. Waktu dihitung sejak Komandan Peleton menginjak garis arena hingga peleton melintasi garis keluar.',
  },
  {
    id: 11,
    category: 'Teknis',
    icon: 'Layers',
    q: 'Kapan pergantian personel pasukan cadangan boleh dilakukan?',
    a: 'Pergantian personel cadangan hanya dapat dilakukan di Daerah Persiapan (DP) sebelum tampil, atau pada saat Jeda Materi pergantian di dalam arena pos: SD/MI pada Gerakan No. 20 & 21; SMP/MTs pada Gerakan No. 17 & 18. Komandan Peleton TIDAK DAPAT diganti kecuali mengalami keadaan darurat medis parah dengan persetujuan tim medis & juri.',
  },
  {
    id: 12,
    category: 'Teknis',
    icon: 'Calendar',
    q: 'Apa acuan baku peraturan baris-berbaris yang digunakan dewan juri?',
    a: 'Unsur penilaian materi lomba 100% murni mengacu pada Peraturan Panglima Tentara Nasional Indonesia (Perpang TNI) No. 57 & 58 Tahun 2018 tentang Peraturan Baris-Berbaris TNI (Kebenaran Teknik PBB & Kekompakan Peleton) dipadukan dengan kriteria kepemimpinan dan vokal Komandan Peleton (Danton). Tidak ada kategori variasi & formasi.',
  },
  {
    id: 13,
    category: 'Teknis',
    icon: 'Calendar',
    q: 'Siapa saja dewan juri yang bertugas menilai?',
    a: 'Penilaian dilakukan secara objektif dan independen oleh 6 Dewan Juri berkompeten dari unsur profesional militer TNI, POLRI, dan Purna Paskibraka Indonesia (PPI) DIY yang berpengalaman di berbagai kejuaraan nasional.',
  },

  // --- KATEGORI 4: JADWAL & LOKASI ---
  {
    id: 14,
    category: 'Jadwal',
    icon: 'Calendar',
    q: 'Kapan dan di mana pelaksanaan Technical Meeting (TM)?',
    a: `Technical Meeting (TM) diselenggarakan pada ${EVENT.TECHNICAL_MEETING_FULL_DATE} pukul ${EVENT.TECHNICAL_MEETING_TIME_RANGE} bertempat di Kampus Induk Madrasah Mu'allimin Jl. Letjen S. Parman No. 68 Wirobrajan. Agenda wajib meliputi pengundian nomor urut tampil, verifikasi faktual berkas, dan penegasan tata tertib lomba.`,
  },
  {
    id: 15,
    category: 'Jadwal',
    icon: 'Calendar',
    q: 'Apakah ada fasilitas uji coba orientasi lapangan sebelum hari-H?',
    a: `Ya. Uji coba orientasi kontur lapangan dijadwalkan pada ${EVENT.FIELD_TRIAL_FULL_DATE} pukul ${EVENT.FIELD_TRIAL_TIME_RANGE} di Kampus Terpadu Sedayu agar peserta dapat beradaptasi langsung dengan arena perlombaan.`,
  },
  {
    id: 16,
    category: 'Jadwal',
    icon: 'MapPin',
    q: 'Di mana lokasi perlombaan pada hari-H dan fasilitas apa saja yang tersedia?',
    a: `Hari-H dilaksanakan pada ${EVENT.COMPETITION_DATE} (mulai pukul 06.00 WIB) di Kampus Terpadu Mu'allimin Sedayu, Bantul. Fasilitas lengkap meliputi: Basecamp transit ruang kelas, Masjid Hj. Yuliana untuk ibadah, kantin & stan kuliner 1918 Foodcourt / Math'am, area parkir luas, pos kesehatan & ambulans siaga, serta arena upacara mini soccer.`,
  },
];

export default function FaqContact() {
  const [selectedFilter, setSelectedFilter] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [openIds, setOpenIds] = useState({ 1: true }); // Default buka pertanyaan pertama

  function toggleFaq(id) {
    setOpenIds(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  }

  const categories = [
    { label: 'Semua', count: FAQ_DATA.length },
    { label: 'Pendaftaran', count: FAQ_DATA.filter(f => f.category === 'Pendaftaran').length },
    { label: 'Biaya', count: FAQ_DATA.filter(f => f.category === 'Biaya').length },
    { label: 'Teknis', count: FAQ_DATA.filter(f => f.category === 'Teknis').length },
    { label: 'Jadwal', count: FAQ_DATA.filter(f => f.category === 'Jadwal').length },
  ];

  const filteredFaqs = useMemo(() => {
    return FAQ_DATA.filter(item => {
      const matchCategory = selectedFilter === 'Semua' || item.category === selectedFilter;
      const matchSearch =
        searchQuery.trim() === '' ||
        item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.a.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [selectedFilter, searchQuery]);

  return (
    <section id="contact" className="relative py-24 lg:py-32 bg-slate-950 overflow-hidden text-white border-t border-slate-900 font-sans">
      {/* Background Ambience */}
      <div className="absolute inset-0 opacity-15 bg-carbon-pattern pointer-events-none"></div>
      <div className="absolute top-1/4 right-0 w-[550px] h-[550px] bg-red-900/10 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-10 left-0 w-[550px] h-[550px] bg-yellow-600/10 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-14 md:mb-20 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-yellow-500/15 border border-yellow-500/30 text-yellow-400 text-xs font-bold uppercase tracking-wider mb-4 shadow-sm">
            <HelpCircle className="w-4 h-4 text-yellow-400" />
            <span>Pusat Informasi & Bantuan Resmi</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter leading-tight py-1">
            FAQ & <span className="inline-block pr-3 sm:pr-4 pb-1 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-amber-400 to-red-500">Bantuan Lomba</span>
          </h2>
          <div className="w-20 h-1.5 bg-yellow-500 mx-auto mt-4 rounded-full skew-x-12 shadow-[0_0_15px_rgba(234,179,8,0.5)]"></div>
          <p className="text-slate-400 text-sm sm:text-base mt-6 leading-relaxed">
            Temukan jawaban lengkap seputar pendaftaran digital, syarat peleton, tata tertib arena pos, dewan juri, hingga fasilitas lokasi lomba.
          </p>

          {/* Quick Search Input */}
          <div className="mt-8 max-w-xl mx-auto relative">
            <div className="relative flex items-center">
              <Search className="w-5 h-5 text-slate-500 absolute left-4 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Cari pertanyaan (contoh: biaya, durasi, danton, TM, juri)..."
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 text-white text-xs sm:text-sm placeholder-slate-500 focus:outline-none focus:border-yellow-400/70 focus:ring-2 focus:ring-yellow-400/20 transition-all shadow-inner"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 text-xs text-slate-400 hover:text-white px-2 py-1 bg-slate-800 rounded-lg cursor-pointer transition-colors"
                >
                  Reset
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* FAQ Column (Left - 8 Cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-2 pb-2 border-b border-slate-800/80">
              {categories.map(cat => (
                <button
                  key={cat.label}
                  onClick={() => setSelectedFilter(cat.label)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-sm ${
                    selectedFilter === cat.label
                      ? 'bg-gradient-to-r from-red-600 to-amber-600 text-white shadow-md shadow-red-950/50 scale-[1.02]'
                      : 'bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  <span>{cat.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-md ${
                      selectedFilter === cat.label ? 'bg-black/30 text-white' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {cat.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Accordion Questions List */}
            {filteredFaqs.length === 0 ? (
              <div className="p-10 rounded-2xl bg-slate-900/50 border border-slate-800 text-center">
                <HelpCircle className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                <h4 className="text-base font-bold text-white mb-1">Pertanyaan tidak ditemukan</h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Kata kunci "{searchQuery}" tidak cocok dengan FAQ. Silakan hubungi langsung panitia resmi di samping.
                </p>
              </div>
            ) : (
              <div className="space-y-3.5">
                {filteredFaqs.map(faq => {
                  const isOpen = !!openIds[faq.id];
                  return (
                    <div
                      key={faq.id}
                      className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                        isOpen
                          ? 'bg-slate-900/90 border-yellow-500/40 shadow-xl shadow-black/40'
                          : 'bg-slate-900/50 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/70'
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => toggleFaq(faq.id)}
                        className="w-full flex items-start justify-between gap-4 p-5 text-left cursor-pointer group"
                      >
                        <div className="flex items-start gap-3.5">
                          <span
                            className={`w-6 h-6 rounded-lg text-xs font-black flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                              isOpen
                                ? 'bg-yellow-400 text-slate-950'
                                : 'bg-slate-800 text-slate-400 group-hover:bg-slate-700 group-hover:text-slate-200'
                            }`}
                          >
                            Q
                          </span>
                          <span
                            className={`font-bold text-sm sm:text-base leading-snug transition-colors ${
                              isOpen ? 'text-yellow-400' : 'text-slate-200 group-hover:text-white'
                            }`}
                          >
                            {faq.q}
                          </span>
                        </div>
                        <div
                          className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-all ${
                            isOpen
                              ? 'bg-yellow-400/20 text-yellow-400 rotate-180'
                              : 'bg-slate-800/80 text-slate-400 group-hover:bg-slate-800'
                          }`}
                        >
                          <ChevronDown className="w-4 h-4 transition-transform duration-300" />
                        </div>
                      </button>

                      {isOpen && (
                        <div className="px-5 pb-5 pt-1 text-slate-300 text-xs sm:text-sm leading-relaxed border-t border-slate-800/60 bg-slate-950/40 animate-fade">
                          <div className="flex gap-3 items-start pt-3">
                            <span className="w-6 h-6 rounded-lg bg-red-600/20 text-red-400 text-xs font-black flex items-center justify-center shrink-0">
                              A
                            </span>
                            <div className="space-y-2 text-slate-300">
                              <p>{faq.a}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Column: Interactive Panitia & Quick Action Cards (4 Cols) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Direct Contact Card */}
            <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 rounded-3xl p-6 sm:p-7 border border-slate-800 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-yellow-500/10 rounded-full blur-2xl pointer-events-none"></div>
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-red-600/10 rounded-full blur-2xl pointer-events-none"></div>

              <div className="flex items-center gap-3 mb-4 relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-yellow-500/15 border border-yellow-500/30 text-yellow-400 flex items-center justify-center shadow-inner">
                  <Headset className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-yellow-400 block">
                    Contact Person
                  </span>
                  <h3 className="text-lg font-black text-white uppercase tracking-tight">
                    Layanan Panitia
                  </h3>
                </div>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed mb-5 relative z-10">
                Punya pertanyaan khusus mengenai surat dispensasi, pendaftaran kontingen, atau konfirmasi berkas? Tim kami siap melayani Anda.
              </p>

              <div className="space-y-3 relative z-10">
                {CONTACT.PERSONS.map((person, idx) => (
                  <a
                    key={idx}
                    href={person.WA_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between p-4 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-emerald-500/50 hover:bg-emerald-950/20 transition-all duration-300 shadow-md cursor-pointer"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-11 h-11 rounded-xl bg-emerald-600/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                        <MessageCircle className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-sm group-hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                          <span>{person.NAME}</span>
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                        </h4>
                        <p className="text-[11px] text-slate-400 font-mono mt-0.5">{person.PHONE_DISPLAY}</p>
                      </div>
                    </div>
                    <span className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center gap-1 group-hover:bg-emerald-500 transition-colors shadow-sm">
                      <span>Chat</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Action Navigation Links Card */}
            <div className="bg-slate-900/90 rounded-3xl p-6 border border-slate-800 shadow-xl space-y-3">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
                <span>Akses Cepat Dokumen</span>
              </h4>

              <a
                href="#denah"
                className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80 hover:border-slate-700 hover:bg-slate-800/50 transition-all flex items-center justify-between text-xs group"
              >
                <div className="flex items-center gap-2.5">
                  <MapPin className="w-4 h-4 text-red-500" />
                  <span className="font-bold text-slate-200 group-hover:text-white">Denah Tata Ruang Arena</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-yellow-400 group-hover:translate-x-1 transition-all" />
              </a>

              <a
                href="#rules"
                className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80 hover:border-slate-700 hover:bg-slate-800/50 transition-all flex items-center justify-between text-xs group"
              >
                <div className="flex items-center gap-2.5">
                  <FileCheck2 className="w-4 h-4 text-blue-400" />
                  <span className="font-bold text-slate-200 group-hover:text-white">Buku Juknis & Materi PBB</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-yellow-400 group-hover:translate-x-1 transition-all" />
              </a>

              <a
                href="#registration"
                className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80 hover:border-slate-700 hover:bg-slate-800/50 transition-all flex items-center justify-between text-xs group"
              >
                <div className="flex items-center gap-2.5">
                  <CreditCard className="w-4 h-4 text-amber-400" />
                  <span className="font-bold text-slate-200 group-hover:text-white">Alur Pendaftaran & Pembayaran</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-yellow-400 group-hover:translate-x-1 transition-all" />
              </a>
            </div>

            {/* Dual Campus Location & Maps Section (Direct display, without tab switcher) */}
            <div className="space-y-4">
              {/* KAMPUS 1: Kampus Terpadu Sedayu (Pelaksanaan Lomba & Uji Coba) */}
              <div className="bg-slate-900/95 rounded-3xl p-5 border border-slate-800 shadow-xl space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-red-600/20 text-red-400 border border-red-500/30 flex items-center justify-center shrink-0">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-white uppercase tracking-wider">
                        {VENUE.NAME}
                      </h4>
                      <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded bg-red-600/25 text-red-300 border border-red-500/30 inline-block mt-0.5">
                        Hari H & Uji Coba Lapangan
                      </span>
                    </div>
                  </div>
                  <a
                    href={VENUE.MAPS_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-950 border border-slate-700 text-[10px] font-bold text-yellow-400 hover:text-white hover:bg-red-700 transition-all shrink-0 shadow-sm"
                  >
                    <span>Buka Maps</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-[11px] text-slate-300 leading-snug">
                  <span className="font-bold text-red-400">Fungsi:</span> Lokasi perlombaan PBB SD & SMP, apel besar, transit kontingen, serta arena latihan uji coba lapangan.
                  <p className="text-[10px] text-slate-400 mt-1 font-mono">{VENUE.ADDRESS}</p>
                </div>

                {/* Interactive Map Preview Terpadu */}
                <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-inner group">
                  <iframe
                    title="Peta Kampus Terpadu Mu'allimin Sedayu"
                    src={VENUE.MAPS_EMBED_URL || "https://maps.google.com/maps?q=-7.806784,110.2683762&hl=id&z=15&output=embed"}
                    className="w-full h-32 border-0 opacity-85 group-hover:opacity-100 transition-opacity"
                    loading="lazy"
                  ></iframe>
                </div>
              </div>

              {/* KAMPUS 2: Kampus Induk Wirobrajan (Technical Meeting) */}
              <div className="bg-slate-900/95 rounded-3xl p-5 border border-slate-800 shadow-xl space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center shrink-0">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-white uppercase tracking-wider">
                        {VENUE_INDUK.NAME}
                      </h4>
                      <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded bg-blue-600/25 text-blue-300 border border-blue-500/30 inline-block mt-0.5">
                        Technical Meeting (TM)
                      </span>
                    </div>
                  </div>
                  <a
                    href={VENUE_INDUK.MAPS_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-950 border border-slate-700 text-[10px] font-bold text-yellow-400 hover:text-white hover:bg-blue-700 transition-all shrink-0 shadow-sm"
                  >
                    <span>Buka Maps</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-[11px] text-slate-300 leading-snug">
                  <span className="font-bold text-blue-400">Fungsi:</span> Pertemuan teknis official & pembina, pengundian nomor urut dada peleton, dan verifikasi akhir berkas fisik.
                  <p className="text-[10px] text-slate-400 mt-1 font-mono">{VENUE_INDUK.ADDRESS}</p>
                </div>

                {/* Interactive Map Preview Induk */}
                <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-inner group">
                  <iframe
                    title="Peta Kampus Induk Mu'allimin Yogyakarta"
                    src={VENUE_INDUK.MAPS_EMBED_URL}
                    className="w-full h-32 border-0 opacity-85 group-hover:opacity-100 transition-opacity"
                    loading="lazy"
                  ></iframe>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
