import React, { useState, useMemo } from 'react';
import {
  ChevronDown,
  Headset,
  MessageCircle,
  ExternalLink,
  MapPin,
  Search,
  HelpCircle,
  FileCheck2,
  ShieldAlert,
  ArrowRight,
  X,
  Mail,
  Check,
  Copy,
  BookOpen,
  Scale,
  Compass,
  Sparkles,
  ChevronsUpDown,
  Award,
  AlertTriangle,
  Building2,
} from 'lucide-react';
import { CONTACT, EVENT, VENUE, VENUE_INDUK } from '../config.js';

const CATEGORIES = [
  { id: 'Semua', label: 'Semua Topik' },
  { id: 'Administrasi', label: 'Administrasi & TM' },
  { id: 'Lapangan', label: 'Lapangan & Penalti' },
  { id: 'Logistik', label: 'Seragam & Basecamp' },
  { id: 'Penilaian', label: 'Nilai & Sanggah' },
];

const CATEGORY_META = {
  Administrasi: {
    label: 'Administrasi & TM',
    badgeClass: 'bg-blue-50 text-blue-700 border-blue-200/80',
    icon: FileCheck2,
  },
  Lapangan: {
    label: 'Lapangan & Penalti',
    badgeClass: 'bg-red-50 text-red-700 border-red-200/80',
    icon: ShieldAlert,
  },
  Logistik: {
    label: 'Seragam & Basecamp',
    badgeClass: 'bg-amber-50 text-amber-800 border-amber-200/80',
    icon: Building2,
  },
  Penilaian: {
    label: 'Nilai & Sanggah',
    badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
    icon: Award,
  },
};

const FAQ_DATA = [
  // --- ADMINISTRASI & TM ---
  {
    id: 1,
    category: 'Administrasi',
    tag: 'Batas 8 Jan 2027',
    q: 'Bolehkah mengganti anggota pasukan, Danton, atau susunan posisi setelah pendaftaran terverifikasi?',
    summary: 'Boleh, maksimal H-1 Technical Meeting (8 Januari 2027 pukul 23.59 WIB) dan wajib sinkron dengan Surat Tugas Kepala Sekolah.',
    a: 'Perubahan data personel—termasuk pergantian individu, Danton, susunan posisi, maupun pasfoto—masih diperbolehkan hingga 8 Januari 2027 pukul 23.59 WIB. Setiap perubahan wajib dilaporkan ke panitia dan disesuaikan dengan Surat Tugas/Rekomendasi resmi dari Kepala Sekolah/Madrasah. Perubahan personel yang tidak tercantum di Surat Tugas resmi dinyatakan tidak sah.',
    ref: 'Juknis Pendaftaran Bab A.9.c',
  },
  {
    id: 2,
    category: 'Administrasi',
    tag: 'Wajib Saat TM',
    q: 'Pendaftaran sudah 100% online — apakah saat Technical Meeting (TM) masih wajib membawa berkas fisik?',
    summary: 'Wajib. Delegasi (maks. 2 orang per sekolah) harus menyerahkan 2 dokumen fisik asli saat registrasi TM.',
    a: `Meskipun pendaftaran awal dilakukan paperless, utusan resmi sekolah (maksimal 2 orang per sekolah, termasuk bagi sekolah yang mengirim 2 peleton) WAJIB hadir dan menyerahkan berkas fisik asli saat registrasi TM (${EVENT.TECHNICAL_MEETING_FULL_DATE}, pukul 12.30–13.00 WIB): (1) Surat Tugas/Rekomendasi Kepala Sekolah asli berstempel basah berisi daftar lengkap seluruh personel & pendamping, serta (2) Pakta Integritas fisik bertanda tangan basah Official.`,
    ref: 'Pasal 2 & 3 Tata Tertib',
  },
  {
    id: 3,
    category: 'Administrasi',
    tag: 'Akses e-Nilai',
    q: 'Mengapa akun Gmail yang didaftarkan saat registrasi tidak boleh sembarangan atau lupa aksesnya?',
    summary: 'Gmail terdaftar adalah satu-satunya kunci privat untuk login Dashboard Tim dan mengakses lembar e-Rekapitulasi Nilai.',
    a: 'Akun Google (Gmail) yang didaftarkan pada formulir pendaftaran menjadi identitas login tunggal ke Dashboard Peserta sekaligus akses eksklusif untuk melihat rincian e-Rekapitulasi Nilai peleton Anda saat hari-H. Panitia tidak membuka rincian nilai tim ke publik, sehingga kehilangan akses Gmail dapat menghambat pengecekan nilai dan proses pengajuan sanggah.',
    ref: 'Pasal 13.3 Tatib & Bab A.9 Penilaian',
  },
  {
    id: 4,
    category: 'Administrasi',
    tag: 'Mitigasi Server',
    q: 'Bagaimana jika terjadi kendala teknis server saat mendaftar atau mengunggah berkas di portal?',
    summary: 'Tersedia jalur verifikasi darurat manual via WhatsApp Helpdesk khusus untuk gangguan sistem portal.',
    a: 'Apabila peserta mengalami gagal login atau gagal unggah berkas akibat gangguan teknis pada server portal resmi, panitia menyediakan mekanisme verifikasi dan pengumpulan berkas darurat secara manual melalui koordinasi WhatsApp Helpdesk resmi. Namun, keterlambatan akibat kelalaian peserta hingga melewati batas waktu atau kehabisan kuota tidak termasuk cakupan mitigasi ini.',
    ref: 'Juknis Pendaftaran Bab A.11',
  },

  // --- LAPANGAN & PENALTI ---
  {
    id: 5,
    category: 'Lapangan',
    tag: 'Insiden Medis',
    q: 'Bagaimana jika di tengah penampilan ada anggota yang pingsan/cedera sehingga pasukan kurang dari 22 orang?',
    summary: 'Dievakuasi medis saat tampil berlangsung TIDAK kena penalti; masuk arena < 22 orang dari awal kena -75 poin.',
    a: 'Penalti tetap sebesar -75 poin terhadap Nilai Peleton hanya diberlakukan apabila peleton memasuki arena dengan jumlah personel kurang dari 22 orang (1 Danton + 21 Pasukan Inti). Apabila seluruh 22 personel lengkap saat masuk lalu ada anggota yang harus dievakuasi tim medis saat penampilan berlangsung, peleton TIDAK dikenai penalti pengurangan personel.',
    ref: 'Juknis Penilaian Bab C.3',
  },
  {
    id: 6,
    category: 'Lapangan',
    tag: 'Stopwatch Jalan',
    q: 'Kapan tepatnya pergantian pasukan cadangan diizinkan, dan apakah stopwatch dihentikan sementara?',
    summary: 'Hanya sah pada jeda Materi "Bubar" (No. 16→17 SD / No. 19→20 SMP) dan stopwatch tetap berjalan terus.',
    a: 'Pergantian personel inti dengan pasukan cadangan di dalam arena hanya diperbolehkan tepat pada saat Materi "Bubar" (di antara Gerakan No. 16 dan 17 untuk jenjang SD/MI; di antara No. 19 dan 20 untuk SMP/MTs). Selama proses pergantian berlangsung, stopwatch resmi tetap berjalan tanpa jeda maupun tambahan waktu.',
    ref: 'Juknis Lapangan & Materi Lomba',
  },
  {
    id: 7,
    category: 'Lapangan',
    tag: 'Nilai 0 vs 50',
    q: 'Apa bedanya sanksi gerakan terlewat lalu diulang, tidak dilakukan sama sekali, atau gerakan berangkai terputus?',
    summary: 'Diulang di luar urutan / berangkai terputus = Nilai 50; tidak dilakukan sama sekali = Nilai 0. Semuanya memotong nilai Danton.',
    a: 'Gerakan yang terlewat tetapi dilaksanakan kemudian di luar urutan diberi Nilai Minimal (50) pada gerakan tersebut. Gerakan yang terlewat dan tidak dilaksanakan sama sekali diberi Nilai 0. Sementara itu, rangkaian gerakan bertanda penghubung (-) yang terputus jeda atau gerakan tambahan diberi Nilai Minimal (50). Ketiga jenis kesalahan tersebut sekaligus memotong skor aspek Penguasaan Materi Danton (bobot 35%).',
    ref: 'Juknis Penilaian Bab C.6 & C.7',
  },
  {
    id: 8,
    category: 'Lapangan',
    tag: 'Urutan 6–10',
    q: 'Apakah semua peleton wajib ikut Upacara Pembukaan, dan apa konsekuensinya jika terlambat?',
    summary: 'Upacara Pembukaan wajib khusus Urutan Tampil 6–10 (-150 poin jika absen). Apel Penutupan wajib seluruh kontingen.',
    a: 'Tidak semua peleton. Upacara Pembukaan (pukul 07.00 WIB, barisan siap 06.45 WIB) WAJIB diikuti khusus peleton urutan tampil 6 s.d. 10 (SD-131 s.d. SD-139 & SMP-242 s.d. SMP-260) dengan formasi 1 Danton + 15 anggota berseragam lomba. Tidak hadir dikenai -150 poin; terlambat dikenai -50 poin per kelipatan 5 menit (maks. toleransi 15 menit). Adapun Apel Penutupan (hadir 15.45 WIB) wajib diikuti seluruh kontingen (1 Danton + 4 anggota).',
    ref: 'Pasal 6 & 13.1 Tatib; Bab C.1 Penilaian',
  },
  {
    id: 9,
    category: 'Lapangan',
    tag: 'Penalti -100 & Geser',
    q: 'Apa yang terjadi jika peleton telat datang ke Daerah Persiapan (DP 1), dan bolehkah masuk sebelum dipanggil?',
    summary: 'Dilarang masuk sebelum dipanggil mic. Lewat 3× panggilan (jeda 2 menit) = -100 poin & digeser ke urutan paling akhir.',
    a: 'Peleton DILARANG KERAS memasuki DP 1 sebelum dipanggil resmi melalui pengeras suara. Jika peleton tidak hadir setelah 3× panggilan berturut-turut dengan jeda 2 menit antar panggilan, peleton dikenai penalti -100 poin dan urutan tampilnya digeser ke posisi paling akhir. Apabila tetap tidak hadir tanpa konfirmasi sah, peleton dikenai sanksi DISKUALIFIKASI.',
    ref: 'Pasal 7 Tata Tertib & Bab C.2 Penilaian',
  },

  // --- SERAGAM & BASECAMP ---
  {
    id: 10,
    category: 'Logistik',
    tag: 'Cek Fisik DP 1',
    q: 'Apakah wajib memakai seragam Tonti khusus, dan bagaimana aturan sepatu serta peserta putri?',
    summary: 'Boleh seragam OSIS/nasional/Tonti asal seragam. Putri ber-rok wajib legging; sol sepatu dilarang keras berpines/paku.',
    a: 'Peserta tidak wajib memiliki seragam Tonti khusus—boleh mengenakan seragam Paskibra, OSIS, nasional, atau seragam kesepakatan sekolah asalkan seragam se-peleton dan Komandan memiliki tanda pembeda yang jelas. Ketentuan mengikat: peserta putri yang mengenakan rok WAJIB memakai legging di dalamnya, dan DILARANG KERAS menempelkan pines, paku payung, spikes, atau pul logam pada sol sepatu (diperiksa fisik di DP 1 dan berlaku juga saat Uji Coba Lapangan).',
    ref: 'Pasal 1.5, 4.4 & 7.4 Tata Tertib',
  },
  {
    id: 11,
    category: 'Logistik',
    tag: 'Zonasi & Parkir Bus',
    q: 'Apakah wali murid, suporter, dan bus kontingen boleh masuk ke area basecamp atau parkir di dalam kampus?',
    summary: 'Basecamp steril dari wali murid/suporter. Bus hanya boleh drop-off lalu wajib parkir di Lapangan Hibrida Argomulyo.',
    a: 'Area basecamp (1 ruang kelas untuk maks. 2 peleton; prioritas se-ruang bagi sekolah pengirim 2 peleton) dijaga ketat dan HANYA boleh dimasuki personel berseragam lengkap serta 1 Official + 2 Pendukung Resmi ber-ID Card (cadangan tidak diberi ID Card tapi wajib berseragam lengkap). Wali murid dan suporter dilarang keras masuk basecamp maupun area Asrama Santri. Untuk armada: bus kontingen hanya diizinkan drop-off di dalam kampus lalu wajib parkir di Lapangan Hibrida Argomulyo, sedangkan mobil/motor parkir di dalam kampus (dialihkan ke Hibrida jika penuh).',
    ref: 'Pasal 5.3.c & Pasal 8 Tata Tertib',
  },
  {
    id: 12,
    category: 'Logistik',
    tag: 'Checkout 15.00 WIB',
    q: 'Mengapa saat check-in pagi harus menjaminkan KTP/SIM Official, dan bagaimana syarat pengambilannya?',
    summary: 'Jaminan kebersihan & keutuhan basecamp. Checkout maks. 15.00 WIB; kotor kena -150 poin, rusak kena denda Rp500.000.',
    a: 'Daftar ulang hari-H dibuka pukul 06.00–09.00 WIB (lewat 09.00 WIB tidak dilayani dan peleton gugur). Official wajib menjaminkan 1 KTP/SIM asli. Sebelum pukul 15.00 WIB, peleton wajib membersihkan kelas, menata ulang meja/kursi, memilah sampah ke 2 trash bag resmi (organik & anorganik) untuk diserahkan ke Pos Checkout, dan lolos inspeksi LO agar KTP/SIM dapat diambil kembali. Basecamp kotor dikenai -150 poin; kerusakan fasilitas dikenai ganti rugi penuh + denda administratif Rp500.000.',
    ref: 'Pasal 5 & Pasal 14 Tata Tertib',
  },
  {
    id: 13,
    category: 'Logistik',
    tag: 'Penalti Suporter',
    q: 'Bagaimana aturan sorakan suporter dan rokok/vape? Bisakah ulah suporter memotong nilai peleton?',
    summary: 'Bisa. Yel-yel/alat tabuh saat tim tampil kena -50 poin (pelanggaran ke-3 dst.); rokok/vape di kampus kena -75 poin.',
    a: 'Bisa dan berlaku langsung ke Nilai Peleton. Suporter dilarang membunyikan alat tabuh, peluit, terompet/toa, meneriakkan yel-yel saat peleton tampil, atau mencemooh tim lain—pelanggaran ke-3 dan seterusnya dikenai -50 poin (pelanggaran sengaja/berat langsung dipotong tanpa peringatan). Selain itu, seluruh kawasan kampus adalah Kawasan Bebas Rokok & Vape/Pod; pelanggaran terang-terangan di basecamp atau melibatkan personel berseragam dikenai penalti -75 poin.',
    ref: 'Pasal 8.9 & 9 Tatib; Bab C.9–10 Penilaian',
  },

  // --- PENILAIAN & SANGGAH ---
  {
    id: 14,
    category: 'Penilaian',
    tag: 'Aturan Tie-Breaker',
    q: 'Jika ada dua peleton atau dua sekolah memiliki total nilai/poin sama persis, bagaimana penentuannya?',
    summary: 'Dipecah berjenjang dari Nilai Murni tertinggi, penalti paling sedikit (Juara Umum), Nilai Murni Danton, hingga Pleno Juri.',
    a: 'Untuk seri Juara Peleton, prioritas pemecahnya: (1) Nilai Murni Peleton tertinggi sebelum penalti, (2) Nilai Murni Danton tertinggi, lalu (3) Sidang Pleno Dewan Juri. Untuk seri Juara Umum sekolah: (1) Nilai Murni Peleton terbaik sekolah tersebut, (2) akumulasi penalti paling sedikit, (3) Nilai Murni Danton tertinggi, lalu (4) Sidang Pleno Juri. Catatan penting: gelar Juara Harapan 1–3 tidak diperhitungkan dalam akumulasi poin Juara Umum.',
    ref: 'Juknis Penilaian Bab A.5–A.8',
  },
  {
    id: 15,
    category: 'Penilaian',
    tag: 'Tutup 15.00 WIB',
    q: 'Kapan rincian nilai bisa dilihat, dan hal apa saja yang boleh (serta tidak boleh) disanggah?',
    summary: 'Nilai rilis ±1 jam pascatampil via Portal. Sanggah tertulis hanya untuk kesalahan administratif, ditutup serentak pukul 15.00 WIB.',
    a: 'Rekapitulasi nilai peleton dirilis bertahap (rolling release) di Portal Peserta sekitar ±1 jam setelah penampilan selesai. Protes/sanggah HANYA dilayani untuk kekeliruan administratif non-penilaian (kesalahan penjumlahan skor, keliru input dari lembar juri, atau catatan penalti)—mutu penilaian juri bersifat mutlak. Pengajuan wajib tertulis menggunakan Formulir Sanggahan Resmi oleh 1 Official terdaftar di Ruang Informasi dengan bukti valid, dan ditutup serentak pukul 15.00 WIB.',
    ref: 'Pasal 13 Tatib & Bab A.9–10 Penilaian',
  },
  {
    id: 16,
    category: 'Penilaian',
    tag: 'Nomor Dada & Sertifikat',
    q: 'Apakah nomor dada peleton harus dikembalikan setelah tampil, dan bagaimana penerbitan E-Sertifikat?',
    summary: 'Nomor dada (dipasang di Saf 2 Banjar 1) menjadi suvenir resmi sekolah. E-Sertifikat dicetak sesuai nama input di Portal.',
    a: 'Nomor Dada Peleton resmi—yang wajib disematkan pada dada personel banjar paling kanan saf kedua (Saf 2 Banjar 1 / S2B1)—TIDAK PERLU dikembalikan ke panitia dan menjadi hak milik serta cenderamata resmi sekolah. Sementara itu, seluruh pemenang (Juara I–III, Harapan I–III Peleton, serta Danton Terbaik I–III) akan menerima E-Sertifikat resmi yang diterbitkan berdasarkan nama lengkap personel di Portal Peserta, sehingga ejaan wajib disesuaikan dengan ijazah/dokumen resmi.',
    ref: 'Pasal 5.3.b, 5.4 & 11.2 Tata Tertib',
  },
];

export default function FaqContact() {
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [openIds, setOpenIds] = useState({});
  const [activeCampus, setActiveCampus] = useState('sedayu'); // 'sedayu' | 'induk'
  const [copiedEmail, setCopiedEmail] = useState(false);

  function toggleFaq(id) {
    setOpenIds(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  }

  const categoryCounts = useMemo(() => {
    const counts = { Semua: FAQ_DATA.length };
    for (const item of FAQ_DATA) {
      counts[item.category] = (counts[item.category] || 0) + 1;
    }
    return counts;
  }, []);

  const filteredFaqs = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return FAQ_DATA.filter(item => {
      const matchCat = selectedCategory === 'Semua' || item.category === selectedCategory;
      if (!matchCat) return false;
      if (!q) return true;
      return (
        item.q.toLowerCase().includes(q) ||
        item.summary.toLowerCase().includes(q) ||
        item.a.toLowerCase().includes(q) ||
        item.tag.toLowerCase().includes(q) ||
        item.ref.toLowerCase().includes(q)
      );
    });
  }, [selectedCategory, searchQuery]);

  const allVisibleOpen =
    filteredFaqs.length > 0 && filteredFaqs.every(item => Boolean(openIds[item.id]));

  function handleToggleAllVisible() {
    if (allVisibleOpen) {
      setOpenIds(prev => {
        const next = { ...prev };
        for (const item of filteredFaqs) next[item.id] = false;
        return next;
      });
    } else {
      setOpenIds(prev => {
        const next = { ...prev };
        for (const item of filteredFaqs) next[item.id] = true;
        return next;
      });
    }
  }

  function handleCopyEmail() {
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(CONTACT.EMAIL).then(() => {
        setCopiedEmail(true);
        setTimeout(() => setCopiedEmail(false), 2000);
      });
    }
  }

  const currentVenue =
    activeCampus === 'sedayu'
      ? {
          name: VENUE.NAME,
          badge: 'Hari-H Lomba & Uji Coba Lapangan',
          badgeStyle: 'bg-red-50 text-red-700 border-red-200',
          schedule: `${EVENT.FIELD_TRIAL_DATE} (UCL) • ${EVENT.COMPETITION_DATE} (Hari-H)`,
          address: VENUE.ADDRESS,
          mapsUrl: VENUE.MAPS_URL,
          embedUrl:
            VENUE.MAPS_EMBED_URL ||
            'https://maps.google.com/maps?q=-7.806784,110.2683762&hl=id&z=15&output=embed',
          title: "Peta Kampus Terpadu Mu'allimin Sedayu",
        }
      : {
          name: VENUE_INDUK.NAME,
          badge: 'Lokasi Technical Meeting (TM)',
          badgeStyle: 'bg-blue-50 text-blue-700 border-blue-200',
          schedule: `${EVENT.TECHNICAL_MEETING_FULL_DATE} • ${EVENT.TECHNICAL_MEETING_TIME_RANGE}`,
          address: VENUE_INDUK.ADDRESS,
          mapsUrl: VENUE_INDUK.MAPS_URL,
          embedUrl: VENUE_INDUK.MAPS_EMBED_URL,
          title: "Peta Kampus Induk Mu'allimin Wirobrajan",
        };

  return (
    <section
      id="contact"
      className="relative py-20 lg:py-28 bg-slate-50 overflow-hidden text-slate-800 border-t border-slate-200 font-sans"
    >
      {/* Subtle Architectural Grid & Ambient Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:20px_20px] opacity-45 pointer-events-none" />
      <div className="absolute -top-24 right-0 w-[480px] h-[480px] bg-red-100/45 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 -left-24 w-[420px] h-[420px] bg-amber-100/40 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 relative z-10 max-w-7xl">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 lg:mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-slate-200 text-slate-700 text-xs font-semibold uppercase tracking-wider mb-4 shadow-sm">
            <HelpCircle className="w-3.5 h-3.5 text-red-700" />
            <span>Klarifikasi Teknis &amp; Pusat Bantuan</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight leading-tight text-slate-900">
            FAQ &amp; <span className="text-red-700">Layanan Informasi</span>
          </h2>
          <div className="w-16 h-1 bg-red-700 mx-auto mt-4 rounded-full" />
          <p className="text-slate-600 text-sm sm:text-base mt-4 leading-relaxed">
            Kumpulan jawaban spesifik untuk situasi lapangan, batas revisi data, pengecualian penalti, prosedur basecamp, hingga mekanisme sanggah yang sering ditanyakan official &amp; pelatih.
          </p>
        </div>

        {/* Main 12-Col Grid */}
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* LEFT COLUMN: Unified Search, Category Tabs & Editorial FAQ Accordion (8 Cols) */}
          <div className="lg:col-span-8 space-y-5 min-w-0">
            {/* Unified Command Bar (Search + Category Filter) */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 sm:p-5 space-y-4">
              {/* Search Field */}
              <div className="relative flex items-center">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Cari kasus teknis (misal: pingsan, pines, checkout, sanggah, bus, revisi, tie-breaker)..."
                  className="w-full pl-10 pr-20 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm placeholder-slate-400 focus:bg-white focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-100 transition-all"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-900 px-2.5 py-1 bg-slate-200/70 hover:bg-slate-200 rounded-lg cursor-pointer transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Hapus</span>
                  </button>
                )}
              </div>

              {/* Category Filter Pills + Expand/Collapse Control */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5 sm:flex-wrap">
                  {CATEGORIES.map(cat => {
                    const isActive = selectedCategory === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`shrink-0 whitespace-nowrap px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                          isActive
                            ? 'bg-slate-900 text-white shadow-sm'
                            : 'bg-slate-100/80 text-slate-600 hover:bg-slate-200/70 hover:text-slate-900'
                        }`}
                      >
                        <span>{cat.label}</span>
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded-md font-extrabold ${
                            isActive ? 'bg-red-600 text-white' : 'bg-white text-slate-500'
                          }`}
                        >
                          {categoryCounts[cat.id] || 0}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {filteredFaqs.length > 0 && (
                  <button
                    type="button"
                    onClick={handleToggleAllVisible}
                    className="self-start sm:self-auto shrink-0 inline-flex items-center gap-1.5 text-[11px] font-bold text-slate-500 hover:text-red-700 px-2.5 py-1.5 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                  >
                    <ChevronsUpDown className="w-3.5 h-3.5" />
                    <span>{allVisibleOpen ? 'Tutup Semua' : 'Buka Semua'}</span>
                  </button>
                )}
              </div>
            </div>

            {/* Results Counter when searching */}
            {searchQuery.trim() !== '' && (
              <div className="flex items-center justify-between px-1 text-xs text-slate-500">
                <span>
                  Menampilkan <strong className="text-slate-900">{filteredFaqs.length}</strong> klarifikasi untuk{' '}
                  <span className="font-semibold text-red-700">"{searchQuery}"</span>
                </span>
                {selectedCategory !== 'Semua' && (
                  <button
                    type="button"
                    onClick={() => setSelectedCategory('Semua')}
                    className="text-red-700 font-bold hover:underline cursor-pointer"
                  >
                    Cari di semua topik
                  </button>
                )}
              </div>
            )}

            {/* Accordion List */}
            {filteredFaqs.length === 0 ? (
              <div className="p-10 rounded-2xl bg-white border border-slate-200 text-center shadow-sm">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <h4 className="text-base font-extrabold text-slate-900 mb-1">
                  Topik tidak ditemukan di daftar FAQ
                </h4>
                <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mb-5 leading-relaxed">
                  Kata kunci "{searchQuery}" belum tercatat di sini. Untuk kasus khusus peleton Anda, langsung konfirmasi ke Helpdesk Panitia.
                </p>
                <div className="flex items-center justify-center gap-2.5 flex-wrap">
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('Semua');
                    }}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors cursor-pointer"
                  >
                    Reset Pencarian
                  </button>
                  <a
                    href={CONTACT.HELPDESK.WA_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors shadow-sm"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Tanya Panitia via WhatsApp</span>
                  </a>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredFaqs.map((faq, idx) => {
                  const isOpen = !!openIds[faq.id];
                  const catMeta = CATEGORY_META[faq.category] || CATEGORY_META.Administrasi;
                  const numLabel = String(idx + 1).padStart(2, '0');

                  return (
                    <div
                      key={faq.id}
                      className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                        isOpen
                          ? 'bg-white border-red-200 shadow-md ring-1 ring-red-100/80'
                          : 'bg-white border-slate-200/90 hover:border-slate-300 shadow-sm'
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => toggleFaq(faq.id)}
                        aria-expanded={isOpen}
                        className="w-full flex items-start justify-between gap-3 sm:gap-4 p-4 sm:p-5 text-left cursor-pointer group"
                      >
                        <div className="flex items-start gap-3.5 flex-1 min-w-0">
                          {/* Editorial Index Number */}
                          <span
                            className={`text-xs font-black font-mono px-2 py-1 rounded-lg shrink-0 mt-0.5 transition-colors ${
                              isOpen
                                ? 'bg-red-700 text-white'
                                : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200 group-hover:text-slate-800'
                            }`}
                          >
                            {numLabel}
                          </span>

                          <div className="flex-1 min-w-0 space-y-1.5">
                            {/* Micro Tags Row */}
                            <div className="flex items-center gap-2 flex-wrap">
                              <span
                                className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold border ${catMeta.badgeClass}`}
                              >
                                {catMeta.label}
                              </span>
                              <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-600">
                                {faq.tag}
                              </span>
                            </div>

                            {/* Question Title */}
                            <h3
                              className={`text-sm sm:text-[15px] leading-snug transition-colors break-words ${
                                isOpen
                                  ? 'font-extrabold text-slate-950'
                                  : 'font-bold text-slate-800 group-hover:text-slate-950'
                              }`}
                            >
                              {faq.q}
                            </h3>
                          </div>
                        </div>

                        <span
                          className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                            isOpen
                              ? 'bg-red-50 text-red-700 rotate-180'
                              : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200 group-hover:text-slate-800'
                          }`}
                        >
                          <ChevronDown className="w-4 h-4" />
                        </span>
                      </button>

                      {isOpen && (
                        <div className="px-4 sm:px-5 pb-5 pt-0">
                          <div className="sm:pl-11 space-y-3 border-t border-slate-100 pt-4">
                            {/* Quick Takeaway Box */}
                            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-50/80 border border-amber-200/70">
                              <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                              <p className="text-xs sm:text-[13px] font-bold text-slate-900 leading-relaxed">
                                {faq.summary}
                              </p>
                            </div>

                            {/* Detailed Answer */}
                            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                              {faq.a}
                            </p>

                            {/* Regulation Reference Footer */}
                            <div className="flex items-center justify-between pt-1.5 text-[11px] text-slate-400">
                              <span className="inline-flex items-center gap-1.5 font-semibold text-slate-500">
                                <Scale className="w-3.5 h-3.5 text-red-600/80" />
                                <span>Dasar Regulasi: {faq.ref}</span>
                              </span>
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

          {/* RIGHT COLUMN: Sticky Dark Helpdesk + Unified Campus Map Switcher + Quick Links (4 Cols) */}
          <div className="lg:col-span-4 space-y-5 min-w-0 lg:sticky lg:top-24">
            {/* 1. Premium Dark Helpdesk Card */}
            <div className="bg-slate-950 text-white rounded-3xl p-6 border border-slate-800 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-700 via-amber-400 to-red-700" />
              <div className="absolute -top-12 -right-12 w-36 h-36 bg-red-700/20 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[10px] font-extrabold uppercase tracking-wider">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Helpdesk Resmi Aktif</span>
                  </div>
                  <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 text-amber-400 flex items-center justify-center">
                    <Headset className="w-4 h-4" />
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-black uppercase tracking-tight text-white">
                    Butuh Konfirmasi Khusus?
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed mt-1.5">
                    Untuk permintaan surat dispensasi, revisi data personel sebelum TM, atau kendala akses portal peserta, hubungi tim kesekretariatan kami.
                  </p>
                </div>

                {/* WhatsApp Contacts */}
                <div className="space-y-2.5 pt-1">
                  {CONTACT.PERSONS.map((person, idx) => (
                    <a
                      key={idx}
                      href={person.WA_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center justify-between gap-2.5 p-3 sm:p-3.5 rounded-2xl bg-white/[0.06] hover:bg-emerald-500/15 border border-white/10 hover:border-emerald-400/50 transition-all duration-200 cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                          <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                        </div>
                        <div className="min-w-0">
                          <span className="font-bold text-[13px] sm:text-sm text-white block leading-snug">
                            {person.NAME}
                          </span>
                          <span className="text-[11px] text-slate-400 font-mono block truncate">
                            {person.PHONE_DISPLAY}
                          </span>
                        </div>
                      </div>
                      <span className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-emerald-500 group-hover:bg-emerald-400 text-slate-950 font-extrabold text-[11px] sm:text-xs flex items-center gap-1 shrink-0 transition-colors">
                        <span>Chat</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </span>
                    </a>
                  ))}
                </div>

                {/* Official Email Copy Row */}
                <div className="flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10">
                  <div className="flex items-center gap-2 min-w-0">
                    <Mail className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <a
                      href={CONTACT.EMAIL_HREF}
                      className="text-xs font-mono text-slate-300 hover:text-white truncate transition-colors"
                    >
                      {CONTACT.EMAIL}
                    </a>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-300 hover:text-white px-2 py-1 rounded-lg bg-white/10 hover:bg-white/15 transition-colors shrink-0 cursor-pointer"
                  >
                    {copiedEmail ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-300">Tersalin</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Salin</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* 2. Unified Interactive Dual-Campus Location Card */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-red-700" />
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-900">
                    Lokasi Resmi Kegiatan
                  </h4>
                </div>
                <span className="text-[10px] font-bold text-slate-400">2 Kampus</span>
              </div>

              {/* Campus Switcher Tabs */}
              <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200/80">
                <button
                  type="button"
                  onClick={() => setActiveCampus('sedayu')}
                  className={`py-2 px-2.5 rounded-lg text-[11px] font-extrabold transition-all cursor-pointer ${
                    activeCampus === 'sedayu'
                      ? 'bg-red-700 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Sedayu (Hari-H &amp; UCL)
                </button>
                <button
                  type="button"
                  onClick={() => setActiveCampus('induk')}
                  className={`py-2 px-2.5 rounded-lg text-[11px] font-extrabold transition-all cursor-pointer ${
                    activeCampus === 'induk'
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Wirobrajan (TM)
                </button>
              </div>

              {/* Active Venue Details */}
              <div className="space-y-2.5">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h5 className="text-xs font-black text-slate-900 uppercase tracking-tight">
                      {currentVenue.name}
                    </h5>
                    <span
                      className={`inline-block mt-1 px-2 py-0.5 rounded-md text-[10px] font-bold border ${currentVenue.badgeStyle}`}
                    >
                      {currentVenue.badge}
                    </span>
                  </div>
                  <a
                    href={currentVenue.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-red-700 text-white text-[10px] font-bold transition-colors shrink-0"
                  >
                    <span>Rute</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <p className="text-[11px] font-semibold text-slate-700">
                  {currentVenue.schedule}
                </p>

                <p className="text-[11px] text-slate-500 leading-relaxed p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                  {currentVenue.address}
                </p>

                <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-100">
                  <iframe
                    key={activeCampus}
                    title={currentVenue.title}
                    src={currentVenue.embedUrl}
                    className="w-full h-40 border-0"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>

            {/* 3. Compact Quick Reference Links */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1 block">
                Rujukan Dokumen Terkait
              </span>

              <a
                href="#rules"
                className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all group"
              >
                <div className="flex items-center gap-2.5">
                  <BookOpen className="w-4 h-4 text-blue-600" />
                  <span className="text-xs font-bold text-slate-700 group-hover:text-slate-950">
                    Juknis Lapangan &amp; Materi PBB
                  </span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-red-700 group-hover:translate-x-0.5 transition-all" />
              </a>

              <a
                href="#tata-tertib"
                className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all group"
              >
                <div className="flex items-center gap-2.5">
                  <Scale className="w-4 h-4 text-red-700" />
                  <span className="text-xs font-bold text-slate-700 group-hover:text-slate-950">
                    15 Pasal Tata Tertib Peserta
                  </span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-red-700 group-hover:translate-x-0.5 transition-all" />
              </a>

              <a
                href="#denah"
                className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all group"
              >
                <div className="flex items-center gap-2.5">
                  <Compass className="w-4 h-4 text-amber-600" />
                  <span className="text-xs font-bold text-slate-700 group-hover:text-slate-950">
                    Denah Arena &amp; Basecamp
                  </span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-red-700 group-hover:translate-x-0.5 transition-all" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
