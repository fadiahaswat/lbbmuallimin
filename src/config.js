/**
 * src/config.js
 * =============
 * SATU-SATUNYA FILE YANG PERLU DIUBAH untuk memperbarui konten website.
 *
 * Sections:
 *  SITE         → judul halaman, meta, branding global
 *  HERO         → teks utama di hero section
 *  EVENT        → semua tanggal & waktu kegiatan
 *  VENUE        → lokasi pelaksanaan
 *  COMPETITION  → aturan & komposisi peserta
 *  ACHIEVEMENTS → daftar prestasi panitia (badge)
 *  REGISTRATION → portal daftar & prosedur
 *  PAYMENT      → rekening & biaya
 *  DOWNLOADS    → daftar file yang bisa diunduh
 *  CONTACT      → kontak panitia
 *  SOCIAL       → link & handle media sosial
 *  NAVBAR / CLIPBOARD / TABS / COUNTDOWN → perilaku UI
 */

// ---------------------------------------------------------------------------
// SITE – branding & metadata halaman
// ---------------------------------------------------------------------------
export const SITE = {
    /** Judul tab browser */
    TITLE: "Lomba Baris-Berbaris Mu\u2019allimin 2027",

    /** Konten meta description untuk SEO */
    DESCRIPTION: "Website Resmi Lomba Baris-Berbaris Mu\u2019allimin 2027 Tingkat SD/MI & SMP/MTs Se-DIY.",

    /** Tahun kegiatan – dipakai di berbagai tempat */
    YEAR: '2027',

    /** Tema resmi kegiatan */
    THEME: "SEMANGAT SEBAGAI KSATRIA, BERJUANG DENGAN GEMBIRA",

    /** Sub-label di logo footer */
    TAGLINE: "Semangat Sebagai Ksatria, Berjuang Dengan Gembira",

    /** Paragraf deskripsi singkat di footer */
    FOOTER_DESCRIPTION:
        'Ajang kompetisi baris-berbaris tingkat pelajar terbesar se-DIY. '
        + 'Mengusung tema "Semangat Sebagai Ksatria, Berjuang Dengan Gembira", menjunjung tinggi sportivitas, '
        + 'karakter, dan disiplin untuk mencetak generasi pemimpin masa depan.',

    /** Teks hak cipta footer */
    COPYRIGHT: '\u00A9 2027 LBB Mu\u2019allimin. All rights reserved.',
};

// ---------------------------------------------------------------------------
// HERO – konten hero section
// ---------------------------------------------------------------------------
export const HERO = {
    /** Baris pertama judul hero */
    TITLE_LINE1: 'LOMBA BARIS BERBARIS',

    /** Baris kedua judul hero */
    TITLE_LINE2: "MU\u2019ALLIMIN 2027",

    /** Tema resmi hero */
    THEME: "SEMANGAT SEBAGAI KSATRIA, BERJUANG DENGAN GEMBIRA",

    /** Teks deskripsi singkat di bawah judul (HTML) */
    SUBTITLE:
        'Ajang pembuktian <span class="text-white font-bold">Disiplin</span>, '
        + '<span class="text-white font-bold">Karakter</span>, dan '
        + '<span class="text-white font-bold">Solidaritas</span> pelajar SD/MI & SMP/MTs se-Daerah Istimewa Yogyakarta.',
};

// ---------------------------------------------------------------------------
// EVENT – semua tanggal & waktu kegiatan
// ---------------------------------------------------------------------------
export const EVENT = {
    /** Teks badge di hero */
    REGISTRATION_BADGE: 'Pendaftaran: 5 Oktober \u2013 1 November 2026',

    /** Rentang pendaftaran daring */
    REGISTRATION_RANGE: '5 Oktober \u2013 1 November 2026',

    /** Rentang verifikasi berkas oleh panitia */
    VERIFICATION_RANGE: '2 \u2013 8 November 2026',

    /** Tanggal pembukaan pendaftaran daring */
    REGISTRATION_START: '2026-10-05T00:00:00+07:00',

    /** Tanggal batas akhir pendaftaran – dipakai countdown timer */
    REGISTRATION_DEADLINE: '2026-11-01T23:59:59+07:00',

    /** Tanggal Technical Meeting Peserta */
    TECHNICAL_MEETING_DATE: '10 Januari 2027',

    /** Waktu Technical Meeting (singkat, di timeline) */
    TECHNICAL_MEETING_TIME: '13.00 WIB \u2013 Selesai',

    /** Hari + tanggal lengkap Technical Meeting (untuk FAQ & kartu) */
    TECHNICAL_MEETING_FULL_DATE: 'Sabtu, 10 Januari 2027',

    /** Rentang jam Technical Meeting */
    TECHNICAL_MEETING_TIME_RANGE: '13.00 WIB \u2013 Selesai',

    /** Lokasi / venue Technical Meeting */
    TECHNICAL_MEETING_VENUE:
        "Kampus Induk Madrasah Mu\u2019allimin Muhammadiyah Yogyakarta, Jalan Letjen S. Parman No. 68, Wirobrajan, Kota Yogyakarta, Daerah Istimewa Yogyakarta.",
    TECHNICAL_MEETING_VENUE_NAME: "Kampus Induk Madrasah Mu\u2019allimin Muhammadiyah Yogyakarta",
    TECHNICAL_MEETING_ADDRESS: "Jl. Letjen S. Parman No.68, Notoprajan, Ngampilan / Wirobrajan, Kota Yogyakarta, DIY",
    TECHNICAL_MEETING_MAPS_URL: "https://maps.app.goo.gl/8tSQHpribqPXTSA79",

    /** Uji Coba Lapangan */
    FIELD_TRIAL_DATE: '17 Januari 2027',
    FIELD_TRIAL_FULL_DATE: 'Minggu, 17 Januari 2027',
    FIELD_TRIAL_TIME_RANGE: '08.00 \u2013 13.30 WIB',

    /** Hari & tanggal hari-H */
    COMPETITION_DATE: 'Sabtu, 24 Januari 2027',

    /** Rentang waktu hari-H */
    COMPETITION_TIME_RANGE: '06.00 WIB \u2013 17.00 WIB',

    /** Jam mulai hari-H (untuk teks "Mulai 06.00 WIB") */
    COMPETITION_TIME_START_LABEL: 'Mulai 06.00 WIB',
};

export const TIMELINE = EVENT;

// ---------------------------------------------------------------------------
// VENUE – lokasi pelaksanaan
// ---------------------------------------------------------------------------
export const VENUE = {
    NAME: "Kampus Terpadu Madrasah Mu\u2019allimin",

    /** Alamat lengkap yang tampil di kartu lokasi */
    ADDRESS: 'Bandut Lor, Argorejo, Sedayu, Kabupaten Bantul, Daerah Istimewa Yogyakarta.',

    /** Alamat singkat untuk footer */
    SHORT_ADDRESS: 'Bandut Lor, Argorejo, Sedayu, Bantul, DIY.',

    /** URL Google Maps */
    MAPS_URL: 'https://maps.app.goo.gl/fVMgg5xZcwRQ4kN78',

    /** URL Embed Google Maps untuk preview iframe */
    MAPS_EMBED_URL: 'https://maps.google.com/maps?q=-7.806784,110.2683762&hl=id&z=15&output=embed',

    /** Label mini-map di bagian kontak/FAQ */
    MAPS_PREVIEW_NAME: "Kampus Terpadu Mu\u2019allimin",
    MAPS_PREVIEW_ADDRESS: 'Bandut Lor, Argorejo, Sedayu, Bantul, DIY',

    /** Ukuran arena/lapangan lomba untuk Juknis */
    FIELD_SIZE: '26m \u00D7 15m (SMP/MTs) & 25m \u00D7 14m (SD/MI)',
};

export const VENUE_INDUK = {
    NAME: "Kampus Induk Madrasah Mu\u2019allimin",
    SUBTITLE: "Lokasi Technical Meeting (TM)",
    ADDRESS: "Jalan Letjen S. Parman No. 68, Notoprajan, Ngampilan / Wirobrajan, Kota Yogyakarta, D.I. Yogyakarta 55262.",
    SHORT_ADDRESS: "Jl. Letjen S. Parman No. 68, Wirobrajan, Yogyakarta.",
    MAPS_URL: "https://maps.app.goo.gl/8tSQHpribqPXTSA79",
    MAPS_EMBED_URL: "https://maps.google.com/maps?q=-7.8075522,110.351427&hl=id&z=17&output=embed",
    GPS: "-7.8076, 110.3514",
    DISTRICT: "Wirobrajan, Kota Yogyakarta",
};

// ---------------------------------------------------------------------------
// COMPETITION – aturan & komposisi peserta
// ---------------------------------------------------------------------------
export const COMPETITION = {
    MAX_PLATOONS_PER_SCHOOL: 2,
    MAX_PLATOONS_PER_SCHOOL_LABEL: 'Max 2 Peleton per sekolah.',

    MAX_PERSONNEL: 25,
    MAX_PERSONNEL_LABEL: 'Komposisi (25 Personil Peleton + 3 Pendamping)',

    COMMANDER_COUNT: 1,
    CORE_TROOPS: 21,
    RESERVE_TROOPS: 3,
    OFFICIAL_COUNT: 1,
    SUPPORTER_STAFF_COUNT: 2,

    OFFICIAL_TEAM_LABEL: 'Maks. 1 Official (Pelatih/Pembina) + 2 Pendukung (Medis/Dokumentasi)',
    TOTAL_PERSONNEL_LABEL: 'Total: 25 Personil Peleton + 3 Pendamping Resmi',

    /** FAQ: teks komposisi lengkap */
    COMPOSITION_DETAIL: 'Maksimal 25 orang peleton: 1 Komandan Peleton, 21 Pasukan Inti (3 saf x 7 banjar), 3 Cadangan (didampingi 1 Official & 2 Pendukung ber-ID Card).',

    /** FAQ: minimal tampil */
    MIN_PERFORM_DETAIL: 'Minimal Tampil di Arena: 22 orang (1 Komandan + 21 Pasukan Inti).',

    /** Jumlah anggota per peleton (dipakai di Juknis) */
    MEMBERS_PER_TEAM: 25,

    /** Kuota total peleton yang bisa ikut */
    MAX_TEAMS_TOTAL: 36,
    MAX_TEAMS_SD: 18,
    MAX_TEAMS_SMP: 18,

    /** Batas waktu tampil (dalam menit, dipakai di Juknis) */
    PERFORMANCE_TIME_LIMIT_MINUTES: '10 (SD/MI) / 13 (SMP/MTs)',

    /** Deskripsi unsur dewan juri */
    JURY_MEMBERS: '6 Dewan Juri Independen (unsur TNI, POLRI, dan PPI: 3 Juri SD & 3 Juri SMP)',

    /** Proporsi penilaian peleton & danton */
    SCORING_PROPORTIONS: {
        PBB_TEKNIK: 50,
        PBB_KEKOMPAKAN: 50,
        RATIO_LABEL: 'Perbandingan 1:1 (Kebenaran Gerak 1 : Kekompakan 1)',
        SCORE_RANGE: 'Rentang Nilai: 50 s.d. 90 Poin (Bilangan Genap)',
        DANTON: {
            MATERI: 35,
            SUARA: 25,
            SIKAP: 20,
            LAPANGAN: 20,
        },
    },

    SD: {
        TARGET_PLATOONS: 18,
        TOTAL_PERSONNEL_LABEL: 'Total: 25 Personil',
        ARENA_NAME: 'Arena 1 (Lapangan Basket Kampus Terpadu Sedayu)',
        ARENA_SIZE: '25m \u00D7 14m',
        ARENA_WIDTH_LABEL: '25 METER',
        ARENA_HEIGHT_LABEL: '14m',
        DURATION_LABEL: 'Durasi Max: 10 Menit',
        SUBSTITUTION_LABEL: 'Di antara Gerakan No. 20 & 21',
        ARENA_SPEC_LABEL: 'Ukuran Pos 25 \u00D7 14 Meter \u2013 Waktu 10 Menit',
    },
    SMP: {
        TARGET_PLATOONS: 18,
        TOTAL_PERSONNEL_LABEL: 'Total: 25 Personil',
        ARENA_NAME: 'Arena 2 (Pelataran Embung Kampus Terpadu Sedayu)',
        ARENA_SIZE: '26m \u00D7 15m',
        ARENA_WIDTH_LABEL: '26 METER',
        ARENA_HEIGHT_LABEL: '15m',
        DURATION_LABEL: 'Durasi Max: 13 Menit',
        SUBSTITUTION_LABEL: 'Di antara Gerakan No. 17 & 18',
        ARENA_SPEC_LABEL: 'Ukuran Pos 26 \u00D7 15 Meter \u2013 Waktu 13 Menit',
    },
};

// ---------------------------------------------------------------------------
// ACHIEVEMENTS – prestasi panitia (tampil sebagai badge)
// ---------------------------------------------------------------------------
export const ACHIEVEMENTS = [
    '\uD83C\uDFC6 Juara Umum LBB Manggala Bhakti (2025)',
    '\uD83C\uDFC6 Juara Umum LKBB Bela Negara (2025)',
    '\uD83C\uDFC6 Juara Umum LBB Pembangunan (2026)',
    '\uD83C\uDFC6 Juara Umum LBB Kota Yogyakarta (2026)',
];

// ---------------------------------------------------------------------------
// REGISTRATION – portal & prosedur pendaftaran
// ---------------------------------------------------------------------------
export const REGISTRATION = {
    /** URL portal pendaftaran online */
    PORTAL_URL: 'https://lbb.tontimuallimin.com/',

    /** Nama domain yang tampil di UI */
    PORTAL_NAME: 'lbb.tontimuallimin.com',
};

// ---------------------------------------------------------------------------
// PAYMENT – data rekening & biaya
// ---------------------------------------------------------------------------
export const PAYMENT = {
    /** Nomor rekening – dipakai copy to clipboard & FAQ */
    ACCOUNT_NUMBER: '300701003561505',

    ACCOUNT_NAME: 'FALHAN ZUHDI MUBAROK',
    ACCOUNT_HOLDER: 'FALHAN ZUHDI MUBAROK',
    BANK_NAME: 'BRI',

    /** Teks biaya yang tampil di UI (tanpa "Rp") */
    FEE_DISPLAY: '350.000',

    /** Daftar gelombang / tier biaya pendaftaran */
    FEE_TIERS: [
        { name: 'Gelombang 1 (5 \u2013 18 Okt)', amount: '350.000', label: '5 \u2013 18 Oktober 2026', endDate: '2026-10-18T23:59:59+07:00' },
        { name: 'Gelombang 2 (19 Okt \u2013 1 Nov)', amount: '400.000', label: '19 Oktober \u2013 1 November 2026', endDate: '2026-11-01T23:59:59+07:00' },
    ],

    /** Teks biaya lengkap untuk FAQ */
    FEE_FULL: 'Rp350.000,- (5–18 Oktober 2026) dan Rp400.000,- (19 Oktober – 1 November 2026) per peleton.',

    /** Keterangan format berita transfer */
    TRANSFER_NOTE_FORMAT: 'NAMA SEKOLAH_JUMLAH PELETON',

    REFUNDABLE: false,
};

// ---------------------------------------------------------------------------
// DOWNLOADS – daftar file yang dapat diunduh
// ---------------------------------------------------------------------------
export const DOWNLOADS = [
    {
        id: 'juknis',
        title: 'Petunjuk Teknis Lengkap (Juknis)',
        description: 'Dokumen panduan teknis resmi pelaksanaan LBB Mu\'allimin 2027 yang memuat ketentuan lomba, materi urutan PBB baku murni sesuai Perpang TNI No. 57 & 58 Tahun 2018, kriteria Danton, serta sistem penilaian juri.',
        size: 'Google Docs / PDF',
        type: 'DOCS / PDF',
        url: 'https://docs.google.com/document/d/1BN1RuwDcEiuibVvoBG4-5R7Rq8neV5st3nAZoISVQi0/edit?usp=sharing',
        badge: 'Wajib Unduh',
        featured: true,
        icon: 'BookOpen',
        colorScheme: 'blue',
    },
    {
        id: 'tatib',
        title: 'Tata Tertib Peserta & Official',
        description: 'Peraturan tata tertib, hak & kewajiban peserta, pembina, serta official selama berada di lokasi perlombaan Kampus Terpadu Sedayu.',
        size: 'Google Docs / PDF',
        type: 'DOCS / PDF',
        url: 'https://docs.google.com/document/d/1rkVVB0XgycFRQgx8N4Zs7K6LB6T2J0cjYTtmALxpDzM/edit?usp=sharing',
        badge: 'Regulasi',
        featured: false,
        icon: 'Shield',
        colorScheme: 'red',
    },
    {
        id: 'denah',
        title: 'Denah Area Perlombaan 2027',
        description: 'Peta tata letak arena pos lomba SD & SMP, Daerah Persiapan (DP), basecamp peserta, panggung upacara, pos kesehatan, dan fasilitas kampus.',
        size: 'Gambar HD PNG',
        type: 'PNG / GAMBAR',
        url: '/denah-lbb-muallimin-2027.png',
        badge: 'Denah Lokasi',
        featured: false,
        icon: 'MapPin',
        colorScheme: 'yellow',
    },
];

// ---------------------------------------------------------------------------
// CONTACT – kontak panitia
// ---------------------------------------------------------------------------
export const CONTACT = {
    EMAIL: 'lbb@tontimuallimin.com',
    EMAIL_HREF: 'mailto:lbb@tontimuallimin.com',
    PHONE_DISPLAY: '0812-3009-3737',

    /** URL tombol WA mengambang (FAB) */
    WA_FAB_URL: 'https://wa.me/6281230093737',

    /** Portal resmi informasi & pendaftaran */
    PORTAL_URL: 'https://lbb.tontimuallimin.com/',
    PORTAL_DISPLAY: 'lbb.tontimuallimin.com',

    /** Daftar contact person panitia */
    PERSONS: [
        {
            NAME: 'Kak Rusyda',
            SHORT_NAME: 'Kak Rusyda',
            PHONE_DISPLAY: '0812-3009-3737',
            WA_URL: 'https://wa.me/6281230093737',
        },
    ],
};

// ---------------------------------------------------------------------------
// SOCIAL – link & handle media sosial
// ---------------------------------------------------------------------------
export const SOCIAL = {
    INSTAGRAM_URL: 'https://www.instagram.com/mualliminjogja/',
    YOUTUBE_URL: '#',
    TIKTOK_URL: 'https://www.tiktok.com/@tontimuallimin',

    /** Handle Instagram resmi event */
    INSTAGRAM_HANDLE: '@mualliminjogja',

    /** Handle TikTok resmi */
    TIKTOK_HANDLE: '@tontimuallimin',

    /** Teks gabungan handle yang ditampilkan di info section */
    HANDLES_DISPLAY: '@mualliminjogja • @tontimuallimin',
};

// ---------------------------------------------------------------------------
// NAVBAR – perilaku navigasi saat scroll
// ---------------------------------------------------------------------------
export const NAVBAR = {
    SCROLL_SOLID_THRESHOLD: 20,
    STICKY_CTA_THRESHOLD: 600,
};

// ---------------------------------------------------------------------------
// CLIPBOARD – tombol salin nomor rekening
// ---------------------------------------------------------------------------
export const CLIPBOARD = {
    RESET_DELAY_MS: 2000,
};

// ---------------------------------------------------------------------------
// SCORING – bobot penilaian & rubrik standar LKBB Baratasetra (K / C / B / BS)
// ---------------------------------------------------------------------------
export const SCORING = {
    PLATOON_TECHNIQUE_PCT: 50,
    PLATOON_COHESION_PCT: 50,
    PLATOON_RATIO: '1:1 (Kebenaran Gerak 1 : Kekompakan 1)',
    SCORE_RANGE_PELETON: '50 s.d. 90 Poin (Bilangan Genap)',
    DANTON_MASTERY_PCT: 35,
    DANTON_VOICE_PCT: 25,
    DANTON_ATTITUDE_PCT: 20,
    DANTON_FIELD_PCT: 20,
    SCORE_RANGE_LABEL: 'Rubrik Skala K / C / B / BS Berjenjang',
};

/** Kategori Predikat Mutu Sesuai Tampilan Standar Simpaskor / LKBB */
export const RUBRIC_GRADES = [
    {
        key: 'K',
        label: 'KURANG',
        shortLabel: 'K',
        headerBg: 'bg-red-600',
        headerText: 'text-white',
        colBg: 'bg-red-500/10 dark:bg-red-950/20',
        border: 'border-red-500/30',
        activeBtn: 'bg-red-600 text-white shadow-md shadow-red-600/40 ring-2 ring-red-400',
        inactiveBtn: 'bg-red-950/40 text-red-300 hover:bg-red-600 hover:text-white border border-red-500/30',
        color: 'text-red-400 bg-red-950/60 border-red-500/40'
    },
    {
        key: 'C',
        label: 'CUKUP',
        shortLabel: 'C',
        headerBg: 'bg-amber-500',
        headerText: 'text-slate-950 font-black',
        colBg: 'bg-amber-500/10 dark:bg-amber-950/20',
        border: 'border-amber-500/30',
        activeBtn: 'bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/40 ring-2 ring-amber-300',
        inactiveBtn: 'bg-amber-950/40 text-amber-300 hover:bg-amber-500 hover:text-slate-950 border border-amber-500/30',
        color: 'text-amber-400 bg-amber-950/60 border-amber-500/40'
    },
    {
        key: 'B',
        label: 'BAIK',
        shortLabel: 'B',
        headerBg: 'bg-emerald-600',
        headerText: 'text-white',
        colBg: 'bg-emerald-500/10 dark:bg-emerald-950/20',
        border: 'border-emerald-500/30',
        activeBtn: 'bg-emerald-600 text-white shadow-md shadow-emerald-600/40 ring-2 ring-emerald-400',
        inactiveBtn: 'bg-emerald-950/40 text-emerald-300 hover:bg-emerald-600 hover:text-white border border-emerald-500/30',
        color: 'text-emerald-400 bg-emerald-950/60 border-emerald-500/40'
    },
    {
        key: 'BS',
        label: 'SANGAT BAIK',
        shortLabel: 'BS',
        headerBg: 'bg-blue-600',
        headerText: 'text-white',
        colBg: 'bg-blue-500/10 dark:bg-blue-950/20',
        border: 'border-blue-500/30',
        activeBtn: 'bg-blue-600 text-white shadow-md shadow-blue-600/40 ring-2 ring-blue-400',
        inactiveBtn: 'bg-blue-950/40 text-blue-300 hover:bg-blue-600 hover:text-white border border-blue-500/30',
        color: 'text-blue-400 bg-blue-950/60 border-blue-500/40'
    },
];

/**
 * Rentang Skala Nilai Standar Baratasetra:
 * - Ditempat Dasar (4-10): [4, 5, 6, 7, 8, 9, 10]
 * - Berpindah Tempat (8-19): [8, 10, 12, 14, 16, 18, 19]
 * - Berjalan Biasa (10-27): [10, 13, 16, 19, 22, 25, 27]
 * - Berjalan Dinamis / Kompleks (12-29): [12, 15, 18, 21, 24, 27, 29]
 * - Parade Kerapian Khusus (12-30): [12, 15, 18, 21, 24, 27, 30]
 */
export const RUBRIC_SCALE_TEMPLATES = {
    DITEMPAT: [
        { grade: 'K', val: 4 }, { grade: 'K', val: 5 },
        { grade: 'C', val: 6 }, { grade: 'C', val: 7 },
        { grade: 'B', val: 8 }, { grade: 'B', val: 9 },
        { grade: 'BS', val: 10 }
    ],
    BERPINDAH: [
        { grade: 'K', val: 8 }, { grade: 'K', val: 10 },
        { grade: 'C', val: 12 }, { grade: 'C', val: 14 },
        { grade: 'B', val: 16 }, { grade: 'B', val: 18 },
        { grade: 'BS', val: 19 }
    ],
    BERJALAN: [
        { grade: 'K', val: 10 }, { grade: 'K', val: 13 },
        { grade: 'C', val: 16 }, { grade: 'C', val: 19 },
        { grade: 'B', val: 22 }, { grade: 'B', val: 25 },
        { grade: 'BS', val: 27 }
    ],
    BERJALAN_KOMPLEKS: [
        { grade: 'K', val: 12 }, { grade: 'K', val: 15 },
        { grade: 'C', val: 18 }, { grade: 'C', val: 21 },
        { grade: 'B', val: 24 }, { grade: 'B', val: 27 },
        { grade: 'BS', val: 29 }
    ],
    KERAPIAN_PARADE: [
        { grade: 'K', val: 12 }, { grade: 'K', val: 15 },
        { grade: 'C', val: 18 }, { grade: 'C', val: 21 },
        { grade: 'B', val: 24 }, { grade: 'B', val: 27 },
        { grade: 'BS', val: 30 }
    ],
    BUBAR_BERKUMPUL: [
        { grade: 'K', val: 13 }, { grade: 'K', val: 15 },
        { grade: 'C', val: 17 }, { grade: 'C', val: 19 },
        { grade: 'B', val: 21 }, { grade: 'B', val: 23 },
        { grade: 'BS', val: 24 }
    ],
    DANTON_UMUM: [
        { grade: 'K', val: 8 }, { grade: 'K', val: 10 },
        { grade: 'C', val: 12 }, { grade: 'C', val: 14 },
        { grade: 'B', val: 16 }, { grade: 'B', val: 18 },
        { grade: 'BS', val: 19 }
    ],
    DANTON_IKIT: [
        { grade: 'K', val: 16 }, { grade: 'K', val: 18 },
        { grade: 'C', val: 21 }, { grade: 'C', val: 23 },
        { grade: 'B', val: 26 }, { grade: 'B', val: 27 },
        { grade: 'BS', val: 28 }
    ],
};

/** Kriteria Penilaian Komandan Pasukan (Danton) Gaya Baratasetra */
export const DANTON_CRITERIA = [
    { id: 'sikap', name: 'Sikap Tampang & Sikap Sempurna', template: 'DANTON_UMUM', defaultScore: 16 },
    { id: 'penguasaanMateri', name: 'Penguasaan Materi Gerakan', template: 'DANTON_UMUM', defaultScore: 16 },
    { id: 'penguasaanLapangan', name: 'Penguasaan & Penempatan Lapangan', template: 'DANTON_UMUM', defaultScore: 16 },
    { id: 'ikit', name: 'IKIT (Intonasi, Ketepatan Irama & Tempo)', template: 'DANTON_IKIT', defaultScore: 26 },
    { id: 'volumeSuara', name: 'Volume & Artikulasi Suara', template: 'DANTON_UMUM', defaultScore: 16 },
];

/** Helper untuk menentukan template skala gerakan berdasarkan teks materi */
export function getScaleTemplateForMaterial(materiText) {
    const lower = (materiText || '').toLowerCase();
    if (lower.includes('periksa kerapian') || lower.includes('periksa kerapihan')) {
        return 'KERAPIAN_PARADE';
    }
    if (lower.includes('bubar') || lower.includes('berkumpul') || lower.includes('berhimpun')) {
        return 'BUBAR_BERKUMPUL';
    }
    if (lower.includes('langkah ke') || lower.includes('langkah ke kanan') || lower.includes('langkah ke kiri') || lower.includes('langkah ke depan') || lower.includes('langkah ke belakang')) {
        return 'BERPINDAH';
    }
    if (
        lower.includes('maju jalan') ||
        lower.includes('langkah tegap') ||
        lower.includes('hormat kanan') ||
        lower.includes('belok kanan') ||
        lower.includes('belok kiri') ||
        lower.includes('melintang') ||
        lower.includes('haluan') ||
        lower.includes('lari') ||
        lower.includes('ganti langkah') ||
        lower.includes('langkah perlahan')
    ) {
        if (lower.includes('lari') || lower.includes('2x belok') || lower.includes('hormat kanan') || lower.includes('melintang') || lower.includes('haluan')) {
            return 'BERJALAN_KOMPLEKS';
        }
        return 'BERJALAN';
    }
    return 'DITEMPAT';
}


// ---------------------------------------------------------------------------
// PENALTIES – daftar sanksi & pengurangan nilai resmi (Bab G Juknis Lapangan & Tatib)
// ---------------------------------------------------------------------------
export const PENALTIES = [
    { label: 'Tidak ikut Upacara Pembukaan (Peleton No. 1–5)', value: '-150 Poin' },
    { label: 'Keterlambatan Upacara Pembukaan',               value: '-50 Poin / kelipatan 5 menit' },
    { label: 'Tidak Hadir di DP 1 (3x Pemanggilan @ 2 mnt)',   value: 'Urutan Paling Akhir & -100 Poin' },
    { label: 'Jumlah Personel Kurang (< 22 orang di arena)',   value: '-75 Poin' },
    { label: 'Kelebihan Durasi Waktu Tampil (per 1–30 detik)', value: '-50 Poin' },
    { label: 'Injak / Keluar Garis Arena atau Kotak Danton',   value: '-50 Poin / kejadian (Semaphore Merah)' },
    { label: 'Kelebihan Gerakan Penyesuaian (> 3 kali)',       value: '-25 Poin / gerakan tambahan' },
    { label: 'Atribut Terlepas / Terjatuh di Arena',           value: '0 Poin (TIDAK DIKENAKAN PENALTI)' },
    { label: 'Ruang Basecamp Ditinggalkan Kotor / Berantakan', value: '-50 Poin' },
    { label: 'Kerusakan / Kehilangan Aset Ruang Basecamp',     value: 'Ganti Rugi + Denda Rp 500.000 (KTP Ditahan)' },
    { label: 'Gerakan Terlewat / Tidak Urut',                  value: 'Nilai Minimal / Nilai 0' },
    { label: 'Peleton Hafalan (Danton Salah Aba-Aba)',         value: 'Nilai 0 pada Gerakan & Potong Nilai Danton' },
];

// ---------------------------------------------------------------------------
// PRIZES – penghargaan & piala bergilir (Pasal 11 Tata Tertib & Juknis)
// ---------------------------------------------------------------------------
export const PRIZES = {
    TOTAL_LABEL:           'Total Uang Pembinaan Rp 9.600.000 + Trofi & Piagam',
    ROLLING_TROPHY_TITLE:  'Piala Bergilir Juara Umum',
    ROLLING_TROPHY_SD:     'Piala Bergilir Juara Umum Tingkat SD/MI Sederajat',
    ROLLING_TROPHY_SMP:    'Piala Bergilir Juara Umum Tingkat SMP/MTs Sederajat',
    TOTAL_CASH_PRIZE:      9600000,
    POINTS_CHAMPIONSHIP: [
        { rank: 'Juara 1 Peleton', points: 6 },
        { rank: 'Juara 2 Peleton', points: 5 },
        { rank: 'Juara 3 Peleton', points: 4 },
        { rank: 'Juara Harapan 1 Peleton', points: 3 },
        { rank: 'Juara Harapan 2 Peleton', points: 2 },
        { rank: 'Juara Harapan 3 Peleton', points: 1 },
        { rank: 'Juara 1 Komandan Terbaik', points: 3 },
        { rank: 'Juara 2 Komandan Terbaik', points: 2 },
        { rank: 'Juara 3 Komandan Terbaik', points: 1 },
    ],
};

// ---------------------------------------------------------------------------
// MATERIALS – daftar gerakan materi lomba resmi (Perpang TNI No. 58 & 57 Th 2018 & No. 45 Th 2014)
// ---------------------------------------------------------------------------
export const MATERIALS = {
    SD: [
        'Penghormatan Dewan Juri(Aba-aba Pelaksanaan Waktu Dimulai) \u2013 Laporan Pembuka',
        'Istirahat Di Tempat(Parade)',
        'Periksa Kerapian(Parade) \u2013 Sikap Sempurna',
        'Setengah Lengan Lencang Kanan \u2013 Tegak',
        'Lencang Kanan \u2013 Tegak',
        'Hitung(Bersaf)',
        'Hadap Kanan',
        'Lencang Depan \u2013 Tegak',
        'Hitung(Berbanjar)',
        'Buka Barisan \u2013 Tutup Barisan',
        'Hadap Kiri',
        'Hadap Serong Kanan',
        'Balik Kanan',
        'Hadap Serong Kiri',
        'Jalan Di Tempat \u2013 Henti',
        '3 Langkah Ke Kiri \u2013 Balik Kanan',
        '4 Langkah Ke Kanan',
        'Hadap Kiri',
        '3 Langkah Ke Depan \u2013 Balik Kanan',
        '4 Langkah Ke Belakang',
        'Maju Jalan \u2013 Tiap-tiap Banjar 2X Belok Kiri',
        'Langkah Tegap(Dari Posisi Langkah Biasa)',
        'Hormat Kanan \u2013 Tegak \u2013 Jalan Di Tempat \u2013 Henti',
        'Tiap-tiap Banjar 2X Belok Kanan Maju(Dari Posisi Berhenti) \u2013 Henti',
        'Melintang Kanan(Berhenti ke Berhenti) \u2013 Henti \u2013 Balik Kanan',
        'Maju Jalan \u2013 Haluan Kanan(Berjalan ke Berhenti) \u2013 Henti',
        'Istirahat Di Tempat(Untuk Perhatian \u2013 Motivasi & Evaluasi Tema LBB) \u2013 Sikap Sempurna',
        'Laporan Penutup \u2013 Penghormatan Dewan Juri(Aba-aba Pelaksanaan Waktu Berakhir)',
    ],
    SMP: [
        'Penghormatan Dewan Juri(Aba-aba Pelaksanaan Waktu Dimulai) \u2013 Laporan Pembuka',
        'Hadap Kanan \u2013 Langkah Biasa(Dari Posisi Berhenti)',
        'Melintang Kanan(Berjalan ke Berjalan) \u2013 Langkah Biasa \u2013 Balik Kanan Henti',
        'Jalan Di Tempat \u2013 Langkah Tegap \u2013 Haluan Kanan(Berjalan ke Berjalan) \u2013 Langkah Biasa \u2013 Henti)',
        'Hadap Kiri Maju(Dari Posisi Berhenti) \u2013 Tiap-tiap Banjar 2X Belok Kanan \u2013 Balik Kanan Maju',
        'Ganti Langkah \u2013 2X Belok Kiri',
        'Lari(Dari Langkah Biasa) \u2013 2X Belok Kanan',
        'Langkah Biasa \u2013 Tiap-tiap Banjar 2X Belok Kanan \u2013 Hadap Serong Kiri Henti',
        'Lari(Dari Posisi Berhenti) \u2013 Balik Kanan Lari Maju \u2013 Hadap Kiri Henti',
        'Hadap Serong Kiri Maju \u2013 2X Belok Kiri',
        'Langkah Tegap \u2013 Hormat Kanan \u2013 Tegak',
        'Tiap-tiap Banjar 2X Belok Kiri(Dari Langkah Tegap) \u2013 Langkah Biasa',
        'Langkah Perlahan(Dari Langkah Biasa) \u2013 Henti',
        'Tiap-tiap Banjar 2X Belok Kanan Maju \u2013 Henti \u2013 3 Langkah Ke Kanan',
        'Balik Kanan Maju \u2013 Hadap Kiri Henti',
        'Bubar \u2013 Berhimpun(Motivasi & Evaluasi Tema LBB) \u2013 Selesai \u2013 Berkumpul Bersaf',
        'Jalan Di Tempat \u2013 Henti \u2013 Hadap Serong Kiri \u2013 3 Langkah Ke Depan',
        'Hadap Kanan \u2013 2 Langkah Ke Kanan \u2013 Balik Kanan',
        'Hadap Serong Kanan \u2013 Balik Kanan',
        'Buka Barisan \u2013 Tutup Barisan',
        'Lencang Depan \u2013 Hitung(Berbanjar) \u2013 Hadap Kanan',
        'Setengah Lengan Lencang Kiri \u2013 Lencang Kiri \u2013 Hitung(Bersaf) \u2013 Balik Kanan',
        'Istirahat Di Tempat(Parade) \u2013 Periksa Kerapian(Parade) \u2013 Sikap Sempurna',
        'Laporan Penutup \u2013 Penghormatan Dewan Juri(Aba-aba Pelaksanaan Waktu Berakhir)',
    ],
};

// ---------------------------------------------------------------------------
// GOOGLE_AUTH – Konfigurasi Layanan Resmi Google Identity Services (GIS)
// ---------------------------------------------------------------------------
export const GOOGLE_AUTH = {
    /**
     * Google Cloud OAuth 2.0 Client ID resmi
     * Buat di: https://console.cloud.google.com/apis/credentials
     * Mendukung pembacaan dari environment variable VITE_GOOGLE_CLIENT_ID
     */
    CLIENT_ID: (typeof import.meta !== 'undefined' && import.meta.env?.VITE_GOOGLE_CLIENT_ID) || '587440262077-ms6nf4jopejuqre6f1pan5as2umlv2nr.apps.googleusercontent.com',
};

// ---------------------------------------------------------------------------
// JURY_POSTS – Konfigurasi Dewan Juri Resmi LBB Mu'allimin 2027
// 2 Pos Lapangan: Pos SD/MI dan Pos SMP/MTs
// 3 Dewan Juri per Pos:
// 1. Juri Kebenaran Teknik Gerakan PBB (Bobot 70% Peleton)
// 2. Juri Kekompakan Gerakan Peleton (Bobot 30% Peleton)
// 3. Juri Komandan Peleton / Danton (Bobot 100% Danton)
// ---------------------------------------------------------------------------
export const JURY_ROLES = {
    teknik: {
        id: 'teknik',
        roleKey: 'juri_teknik',
        title: 'Juri 1: Kebenaran Teknik PBB',
        shortTitle: 'Juri 1 (Teknik PBB)',
        badge: 'Kebenaran Teknik PBB',
        weightPct: 70,
        description: 'Menilai presisi, ketepatan urutan aba-aba & gerakan PBB berpedoman pada Perpang TNI No. 57 & 58 Th 2018 (Bobot 70% Peleton).',
        defaultNameSD: 'Mayor (Mar) Bambang S., S.E.',
        defaultNameSMP: 'Mayor Inf. Supriyadi, M.M.',
    },
    kekompakan: {
        id: 'kekompakan',
        roleKey: 'juri_kekompakan',
        title: 'Juri 2: Kekompakan Peleton',
        shortTitle: 'Juri 2 (Kekompakan)',
        badge: 'Kekompakan Peleton',
        weightPct: 50,
        description: 'Menilai keseragaman langkah, kelurusan saf/banjar, irama, tempo, serta harmonisasi gerakan peleton (Rasio 1:1 Peleton, nilai 50 s.d. 90 genap).',
        defaultNameSD: 'Kapten Kav. Hendra Wijaya',
        defaultNameSMP: 'Kapten Arh. Agus Prasetyo',
    },
    komandan: {
        id: 'komandan',
        roleKey: 'juri_komandan',
        title: 'Juri 3: Komandan Peleton (Danton)',
        shortTitle: 'Juri 3 (Danton)',
        badge: 'Komandan Peleton',
        weightPct: 100,
        description: 'Menilai penguasaan materi (35%), kualitas & intonasi vokal IKIT (25%), sikap & pelaporan (20%), serta penguasaan medan (20%).',
        defaultNameSD: 'AKP Tri Wibowo, S.H.',
        defaultNameSMP: 'AKP Danang Kusuma, S.I.K.',
    }
};

export const JURY_POSTS = {
    pos1: {
        id: 'pos1',
        title: 'Juri 1: Kebenaran Teknik Gerakan PBB',
        shortTitle: 'Juri 1 (Teknik PBB)',
        badge: 'Kebenaran Teknik',
        defaultName: 'Mayor (Mar) Bambang S., S.E.',
        type: 'teknik',
        aspects: [
            { id: 'materi', label: 'Rubrik Kebenaran Teknik Gerakan PBB (Rasio 1:1)', weight: 50 },
        ],
    },
    pos2: {
        id: 'pos2',
        title: 'Juri 2: Kekompakan Gerakan Peleton',
        shortTitle: 'Juri 2 (Kekompakan)',
        badge: 'Kekompakan Peleton',
        defaultName: 'Kapten Kav. Hendra Wijaya',
        type: 'kekompakan',
        aspects: [
            { id: 'keseragaman', label: 'Keseragaman Langkah & Kelurusan Saf/Banjar', weight: 25 },
            { id: 'iramaTempo', label: 'Irama, Tempo, & Harmonisasi Pasukan', weight: 25 },
        ],
    },
    pos3: {
        id: 'pos3',
        title: 'Juri 3: Komandan Peleton (Danton)',
        shortTitle: 'Juri 3 (Danton)',
        badge: 'Dewan Juri Danton',
        defaultName: 'AKP Tri Wibowo, S.H.',
        type: 'danton',
        aspects: [
            { id: 'penguasaanMateri', label: 'Penguasaan Materi Aba-Aba (35%)', weight: 35 },
            { id: 'kualitasSuara', label: 'Kualitas & Artikulasi Suara IKIT (25%)', weight: 25 },
            { id: 'sikapPelaporan', label: 'Sikap Tampang & Pelaporan (20%)', weight: 20 },
            { id: 'penguasaanMedan', label: 'Penguasaan Medan Lomba (20%)', weight: 20 },
        ],
    },
};

// ---------------------------------------------------------------------------
// STAGING_CONFIG – Konfigurasi Alur Registrasi Hari-H & Staging Lapangan
// Basecamp: Checkin (Scan QR, Titip KTP/SIM, 1 Dus Air, No Dada, Cocard, Karung Sampah)
//           Checkout (Cek Kebersihan Basecamp, Kumpul Sampah Pilah, Scan QR, Balikkan KTP/SIM)
// DP 1: Cek Foto & Kelengkapan Personel Menggunakan Tab/iPad
// DP 2: Ruang Tunggu Steril
// DP 3: Pintu Masuk Lapangan
// Arena: Kotak Lomba Didampingi Hakim Garis & Timer
// ---------------------------------------------------------------------------
export const STAGING_CONFIG = {
    STAGES: [
        { id: 'waiting', label: 'Belum Check-in', shortLabel: 'Standby', color: 'slate', icon: 'Clock' },
        { id: 'basecamp', label: 'Basecamp Kontingen', shortLabel: 'Basecamp', color: 'teal', icon: 'Home' },
        { id: 'dp1', label: 'DP 1: Inspeksi Personel & Foto', shortLabel: 'DP 1 (Inspeksi)', color: 'blue', icon: 'ClipboardCheck' },
        { id: 'dp2', label: 'DP 2: Ruang Tunggu Steril', shortLabel: 'DP 2 (Tunggu)', color: 'amber', icon: 'ShieldCheck' },
        { id: 'dp3', label: 'DP 3: Pintu Masuk Lapangan', shortLabel: 'DP 3', color: 'indigo', icon: 'DoorOpen' },
        { id: 'arena', label: 'Kotak Lomba (Tampil)', shortLabel: 'Tampil', color: 'emerald', icon: 'Play' },
        { id: 'finished', label: 'Selesai Tampil', shortLabel: 'Selesai', color: 'purple', icon: 'CheckCircle2' },
        { id: 'checkout', label: 'Checkout Basecamp (Selesai Total)', shortLabel: 'Checkout', color: 'slate', icon: 'CheckCircle2' },
    ],
    DURATIONS: {
        SD: 10 * 60, // 10 menit dalam detik (600 detik)
        SMP: 13 * 60, // 13 menit dalam detik (780 detik)
    },
    WARNING_TIMES: {
        YELLOW_REMAINING: 120, // sisa 2 menit (sinyal peluit 1 kali panjang)
        RED_REMAINING: 0, // waktu habis (sinyal peluit 2 kali panjang)
    },
    PENALTY_OVERTIME_PER_30_SEC: 50,
};

// ---------------------------------------------------------------------------
// OFFICIAL_RAB – Master Anggaran Resmi (RAB LBB MU'ALLIMIN 2027.xlsx)
// ---------------------------------------------------------------------------
export const OFFICIAL_RAB = {
    TOTAL_INCOME: 63711450,
    TOTAL_EXPENSE: 63711450,
    BALANCE: 0,
    INCOME_ITEMS: [
        { no: 1, source: "Dana Subsidi Madrasah Mu'allimin Muhammadiyah Yogyakarta", volume: 1, unit: 'Paket', price: 15000000, total: 15000000 },
        { no: 2, source: "Target Sponsorship Kemitraan Eksternal", volume: 1, unit: 'Paket', price: 25211450, total: 25211450 },
        { no: 3, source: "Pendaftaran Gelombang 1 (18 Peleton SD & SMP)", volume: 18, unit: 'Peleton', price: 350000, total: 6300000 },
        { no: 4, source: "Pendaftaran Gelombang 2 (18 Peleton SD & SMP)", volume: 18, unit: 'Peleton', price: 400000, total: 7200000 },
        { no: 5, source: "Dana Usaha Panitia (Sewa Stand Bazar 20 Tenant UMKM)", volume: 20, unit: 'Stand', price: 500000, total: 10000000 },
    ],
    DIVISIONS: [
        {
            id: 'div-1',
            name: 'Kesekretariatan (Sekretaris & Bendahara)',
            subtotal: 1237500,
            items: [
                { item: 'Cetak & Penggandaan Proposal Kegiatan Resmi', volume: 15, unit: 'Bundel', price: 20000, total: 300000 },
                { item: 'Kertas HVS F4 & A4 (Administrasi & Penilaian)', volume: 10, unit: 'Rim', price: 45000, total: 450000 },
                { item: 'Amplop Surat Resmi Berstempel', volume: 5, unit: 'Pak', price: 37500, total: 187500 },
                { item: 'ATK Panitia (Pulpen, Map Folio, Stapler, Notes)', volume: 1, unit: 'Paket', price: 250000, total: 250000 },
                { item: 'Biaya Cetak Laporan Pertanggungjawaban (LPJ Final Hardcover)', volume: 5, unit: 'Bundel', price: 10000, total: 50000 },
            ],
        },
        {
            id: 'div-2',
            name: 'Divisi Acara',
            subtotal: 1400000,
            items: [
                { item: 'Fotokopi Rundown Acara (Hari-H, TM Juri, TM Peserta)', volume: 2000, unit: 'Lembar', price: 300, total: 600000 },
                { item: 'Perlengkapan Administrasi Pendaftaran & Undian Lotting Peleton', volume: 1, unit: 'Paket', price: 500000, total: 500000 },
                { item: 'Perlengkapan Tambahan Operasional Acara & Cue Card MC', volume: 1, unit: 'Paket', price: 300000, total: 300000 },
            ],
        },
        {
            id: 'div-3',
            name: 'Divisi Juri & Penilaian (6 Dewan Juri: TNI, Polri, PPI)',
            subtotal: 3020000,
            items: [
                { item: 'Honorarium 6 Dewan Juri (3 SD & 3 SMP)', volume: 6, unit: 'Orang', price: 350000, total: 2100000 },
                { item: 'Uang Transportasi TM Juri (Sabtu, 7 November 2026)', volume: 6, unit: 'Orang', price: 50000, total: 300000 },
                { item: 'Uang Transportasi Hari-H (Sabtu, 24 Januari 2027)', volume: 6, unit: 'Orang', price: 50000, total: 300000 },
                { item: 'Cetak Formulir Rubrik Penilaian Resmi Juri (300 Lembar)', volume: 300, unit: 'Lembar', price: 300, total: 90000 },
                { item: 'Cetak Piagam Penghargaan Dewan Juri', volume: 6, unit: 'Lembar', price: 5000, total: 30000 },
                { item: 'Perlengkapan Juri (Papan Dada, Stopwatch, Peluit, ATK)', volume: 1, unit: 'Paket', price: 200000, total: 200000 },
            ],
        },
        {
            id: 'div-4',
            name: 'Divisi Teknis Lapangan (2 Arena: Basket & Embung)',
            subtotal: 4000000,
            items: [
                { item: 'Penyiapan Arena Lomba (Marking Cat Lapangan, Tali, Patok)', volume: 1, unit: 'Paket', price: 1500000, total: 1500000 },
                { item: 'Sewa / Pembuatan Meja Juri & Pos Perlombaan', volume: 3, unit: 'Unit', price: 500000, total: 1500000 },
                { item: 'Kebutuhan Teknis Pembersihan & Penataan Area Lapangan', volume: 1, unit: 'Paket', price: 1000000, total: 1000000 },
            ],
        },
        {
            id: 'div-5',
            name: 'Divisi Penghargaan & Medis',
            subtotal: 16470000,
            items: [
                { item: 'Piala Bergilir Juara Umum (SD/MI & SMP/MTs)', volume: 2, unit: 'Buah', price: 500000, total: 1000000 },
                { item: 'Piala Tetap Juara 1, 2, 3 Utama (SD & SMP)', volume: 6, unit: 'Set', price: 280000, total: 1680000 },
                { item: 'Piala Tetap Juara Harapan 1, 2, 3 (SD & SMP)', volume: 6, unit: 'Set', price: 280000, total: 1680000 },
                { item: 'Piala Danton Terbaik (SD & SMP)', volume: 6, unit: 'Buah', price: 280000, total: 1680000 },
                { item: 'Uang Pembinaan Pemenang Tunai (18 Juara SD & SMP)', volume: 1, unit: 'Paket', price: 9600000, total: 9600000 },
                { item: 'Cetak Papan Simbolis Juara (Ukuran 40 x 60 cm)', volume: 18, unit: 'Lembar', price: 10000, total: 180000 },
                { item: 'Obat-obatan Lapangan & Perlengkapan P3K Lengkap', volume: 1, unit: 'Paket', price: 50000, total: 50000 },
                { item: 'Honor / Transportasi Tim Medis Eksternal & Ambulans Siaga', volume: 3, unit: 'Orang', price: 200000, total: 600000 },
            ],
        },
        {
            id: 'div-6',
            name: 'Divisi Perlengkapan',
            subtotal: 7585000,
            items: [
                { item: 'Sewa Handy Talkie (HT) Frekuensi Jernih', volume: 70, unit: 'Unit', price: 15000, total: 1050000 },
                { item: 'Sewa Tenda Utama Dewan Juri (4m x 5m)', volume: 3, unit: 'Unit', price: 750000, total: 2250000 },
                { item: 'Sewa Tenda Lipat Stand Tenant UMKM (3m x 3m)', volume: 16, unit: 'Unit', price: 100000, total: 1600000 },
                { item: 'Sewa Paket Sound System (Arena 1, Arena 2, Upacara)', volume: 1, unit: 'Paket', price: 1500000, total: 1500000 },
                { item: 'Selotip Police Line Pembatas Jalur', volume: 1, unit: 'Rol', price: 60000, total: 60000 },
                { item: 'Police Line Pembatas Steril', volume: 3, unit: 'Rol', price: 100000, total: 300000 },
                { item: 'Tali Rafia Lapangan', volume: 3, unit: 'Rol', price: 25000, total: 75000 },
                { item: 'Kantong Sampah Besar (Trash Bag Pemilahan)', volume: 5, unit: 'Pak', price: 50000, total: 250000 },
                { item: 'Lakban, Tali Pengikat, Paku, & Logistik Pendukung', volume: 1, unit: 'Paket', price: 150000, total: 150000 },
                { item: 'Perlengkapan Konstruksi Backdrop & Panggung', volume: 1, unit: 'Paket', price: 350000, total: 350000 },
            ],
        },
        {
            id: 'div-7',
            name: 'Divisi Keamanan & Perizinan',
            subtotal: 550000,
            items: [
                { item: 'Perlengkapan Keamanan, Traffic Cone, & Rompi', volume: 1, unit: 'Paket', price: 200000, total: 200000 },
                { item: 'Cetak Karcis Parkir Resmi & Tanda Masuk Bus Kontingen', volume: 10, unit: 'Bendel', price: 25000, total: 250000 },
                { item: 'Staples Tembak, Lakban, dan Isi', volume: 5, unit: 'Buah', price: 20000, total: 100000 },
            ],
        },
        {
            id: 'div-8',
            name: 'Divisi Konsumsi',
            subtotal: 6177000,
            items: [
                { item: 'Air Mineral Gelas Peserta (1 Dus per Peleton x 36)', volume: 36, unit: 'Dus', price: 30000, total: 1080000 },
                { item: 'Air Mineral Galon Isi Ulang Panitia & Transit', volume: 10, unit: 'Galon', price: 10000, total: 100000 },
                { item: 'Snack Box Coffee Break TM Juri (6 Dewan Juri)', volume: 6, unit: 'Box', price: 8000, total: 48000 },
                { item: 'Snack Box TM Peserta (36 Kontingen @ 2 Perwakilan)', volume: 72, unit: 'Box', price: 8000, total: 576000 },
                { item: 'Sarapan Pagi Dewan Juri Hari-H (VIP)', volume: 6, unit: 'Kotak', price: 30000, total: 180000 },
                { item: 'Makan Siang Dewan Juri Hari-H (VIP)', volume: 6, unit: 'Kotak', price: 25000, total: 150000 },
                { item: 'Makan Siang 100 Panitia Pelaksana', volume: 100, unit: 'Kotak', price: 25000, total: 2500000 },
                { item: 'Makan Siang Tamu Undangan VIP', volume: 15, unit: 'Kotak', price: 25000, total: 375000 },
                { item: 'Snack Sore Dewan Juri Hari-H (VIP)', volume: 6, unit: 'Box', price: 8000, total: 48000 },
                { item: 'Snack Sore 100 Panitia Pelaksana', volume: 100, unit: 'Box', price: 8000, total: 800000 },
                { item: 'Snack Sore Tamu Undangan VIP', volume: 15, unit: 'Box', price: 8000, total: 120000 },
                { item: 'Konsumsi Ekstra Petugas Lapangan (Keamanan, Medis, dll.)', volume: 20, unit: 'Dus', price: 10000, total: 200000 },
            ],
        },
        {
            id: 'div-9',
            name: 'Divisi Desain, Dekorasi, & Dokumentasi (DDD)',
            subtotal: 16160000,
            items: [
                { item: 'Cetak Banner Utama, Backdrop Panggung, Spanduk', volume: 1, unit: 'Paket', price: 1500000, total: 1500000 },
                { item: 'Bahan & Ornamen Dekorasi Venue Minisoccer & Arena', volume: 1, unit: 'Paket', price: 300000, total: 300000 },
                { item: 'Produksi Kaos Panitia Resmi (100 Personil)', volume: 100, unit: 'Pcs', price: 85000, total: 8500000 },
                { item: 'ID Card Panitia Lengkap + Tali Lanyard', volume: 100, unit: 'Pcs', price: 5000, total: 500000 },
                { item: 'ID Card Official & Pendukung Kontingen (36 Peleton)', volume: 72, unit: 'Pcs', price: 5000, total: 360000 },
                { item: 'Lanyard Cetak Resmi Panitia & Juri', volume: 100, unit: 'Pcs', price: 15000, total: 1500000 },
                { item: 'Topi Lapangan Panitia', volume: 100, unit: 'Pcs', price: 35000, total: 3500000 },
            ],
        },
        {
            id: 'div-10',
            name: 'Divisi Dana & Kemitraan (Operasional)',
            subtotal: 900000,
            items: [
                { item: 'Cetak & Jilid Proposal Sponsorship Resmi (20 Bundel)', volume: 20, unit: 'Bundel', price: 20000, total: 400000 },
                { item: 'Transportasi & Operasional Pencarian Sponsor/Tenant', volume: 1, unit: 'Paket', price: 500000, total: 500000 },
            ],
        },
        {
            id: 'div-11',
            name: 'Divisi LO & Humas (Operasional)',
            subtotal: 420000,
            items: [
                { item: 'Amplop Permohonan Trofi (Wali Kota & Gubernur)', volume: 2, unit: 'Paket', price: 25000, total: 50000 },
                { item: 'Amplop Undangan Sekolah Peserta', volume: 1, unit: 'Box', price: 20000, total: 20000 },
                { item: 'Map Folio (Merk Biola) Berkas Peserta', volume: 2, unit: 'Pack', price: 35000, total: 70000 },
                { item: 'Cetak & Distribusi Surat Undangan Peserta Resmi', volume: 50, unit: 'Paket', price: 5000, total: 250000 },
                { item: 'Fotokopi Denah Basecamp & Materi untuk 36 LO', volume: 100, unit: 'Lembar', price: 300, total: 30000 },
            ],
        },
        {
            id: 'div-12',
            name: 'Biaya Tak Terduga (10% dari Total Pengeluaran Divisi 1–11)',
            subtotal: 5791950,
            items: [
                { item: 'Dana Taktis & Cadangan Operasional Keadaan Tak Terduga', volume: 1, unit: 'Paket', price: 5791950, total: 5791950 },
            ],
        },
    ],
};

// ---------------------------------------------------------------------------
// OFFICIAL_TIMELINE – Master Jadwal & Timeline Resmi (TIMELINE LBB MU'ALLIMIN 2027.xlsx)
// ---------------------------------------------------------------------------
export const OFFICIAL_TIMELINE = [
    {
        id: 'tl-1',
        phase: 'A. Perencanaan, Legalitas & Persiapan Awal',
        period: '1 – 14 September 2026',
        title: 'Pembentukan Panitia & Perumusan Konsep Dasar',
        desc: 'Pembentukan panitia lengkap (100 personel), penetapan tema resmi "SEMANGAT SEBAGAI KSATRIA, BERJUANG DENGAN GEMBIRA", draf awal juklak/juknis berdasar Perpang TNI 57 & 58 Tahun 2018.',
        pic: 'Tim Formatur, Ketua Pelaksana, Divisi Acara, Sekretaris',
    },
    {
        id: 'tl-2',
        phase: 'A. Perencanaan, Legalitas & Persiapan Awal',
        period: '15 – 21 September 2026',
        title: 'Penyusunan Proposal & Master Anggaran (RAB)',
        desc: 'Penyusunan draf proposal kegiatan resmi, perumusan RAB seimbang Rp 63.711.450 (Subsidi Rp 15 jt, Pendaftaran 36 Peleton, Bazar 20 Tenant @Rp 500 rb, dan Sponsor).',
        pic: 'Ketua Pelaksana, Sekretaris, Bendahara, Divisi Dana & Kemitraan',
    },
    {
        id: 'tl-3',
        phase: 'A. Perencanaan, Legalitas & Persiapan Awal',
        period: '22 – 30 September 2026',
        title: 'Legalitas & Perizinan Kampus Sedayu & Wirobrajan',
        desc: 'Audiensi Direksi Madrasah Mu\'allimin, izin Aula Kampus Induk Wirobrajan (TM Peserta), izin fasilitas Kampus Terpadu Sedayu (2 arena, minisoccer, basecamp kelas, parkir bazar).',
        pic: 'Ketua Pelaksana, Sekretaris, Divisi Keamanan & Perizinan, Divisi Dana',
    },
    {
        id: 'tl-4',
        phase: 'A. Perencanaan, Legalitas & Persiapan Awal',
        period: '1 – 4 Oktober 2026',
        title: 'Survei Venue, Mapping 2 Arena & Materi Promosi',
        desc: 'Survei detail Arena 1 (Lap. Basket 25x14m, durasi 10 menit) dan Arena 2 (Pelataran Embung 26x15m, durasi 13 menit), pemetaan holding area DP 1-2, dan rilis materi promosi.',
        pic: 'Divisi Teknis Lapangan, Divisi Acara, Divisi DDD, Divisi LO & Humas',
    },
    {
        id: 'tl-5',
        phase: 'B. Pendaftaran Peserta & Penjualan Stand Tenant',
        period: '5 – 18 Oktober 2026',
        title: 'Pendaftaran Gelombang 1 (Early Bird Rp 350.000)',
        desc: 'Pembukaan registrasi online portal lbb.tontimuallimin.com, verifikasi berkas awal, penjualan stand bazar UMKM Gelombang 1 (@Rp 500.000), distribusi proposal sponsorship.',
        pic: 'Divisi Acara (Pendaftaran), Divisi LO & Humas, Divisi Dana & Kemitraan',
    },
    {
        id: 'tl-6',
        phase: 'B. Pendaftaran Peserta & Penjualan Stand Tenant',
        period: '19 Oktober – 1 November 2026',
        title: 'Pendaftaran Gelombang 2 (Reguler Rp 400.000) & Finalisasi Kuota',
        desc: 'Pendaftaran gelombang kedua hingga kuota pasti terpenuhi: 36 Peleton (18 SD/MI dan 18 SMP/MTs), pelunasan sewa 20 tenant UMKM (total Rp 10.000.000), pembentukan WAG Ofisial.',
        pic: 'Divisi Acara (Pendaftaran), Divisi LO & Humas, Divisi Dana, Bendahara',
    },
    {
        id: 'tl-7',
        phase: 'C. Agenda Technical Meeting Dewan Juri',
        period: '2 – 5 November 2026',
        title: 'Persiapan Administrasi & Logistik TM Juri',
        desc: 'Penerbitan surat permohonan 6 Dewan Juri (TNI Kodim/Koramil, POLRI Polresta/Polsek, dan PPI Kota YK: 3 juri SD & 3 juri SMP), penggandaan draf rubrik penilaian.',
        pic: 'Sekretaris, Divisi Juri & Penilaian, Bendahara',
    },
    {
        id: 'tl-8',
        phase: 'C. Agenda Technical Meeting Dewan Juri',
        period: '6 November 2026',
        title: 'Setting Ruang & Briefing Internal Pra-TM Juri',
        desc: 'Penataan Ruang Rapat Gedung Perpustakaan ASM Kampus Sedayu, briefing internal penyamaan parameter teknis (durasi 10 & 13 menit, toleransi langkah, peluit, kriteria danton).',
        pic: 'Divisi Juri & Penilaian, Divisi Acara, Divisi Perlengkapan, Divisi Konsumsi',
    },
    {
        id: 'tl-9',
        phase: 'C. Agenda Technical Meeting Dewan Juri',
        period: 'Sabtu, 7 November 2026 (13.00 – 16.00 WIB)',
        title: 'Pelaksanaan Technical Meeting Dewan Juri (TM Juri)',
        desc: 'Sidang pleno standarisasi materi teknis (Perpang TNI 57 & 58 Tahun 2018), pembagian juri SD & SMP, batas waktu & peluit peringatan, peninjauan fisik arena, dan Berita Acara.',
        pic: 'Panitia Inti, Divisi Acara, Divisi Juri & Penilaian, Bendahara, Divisi DDD',
    },
    {
        id: 'tl-10',
        phase: 'C. Agenda Technical Meeting Dewan Juri',
        period: '8 – 14 November 2026',
        title: 'Pasca-TM Juri (Dokumentasi & Sistemisasi Hasil)',
        desc: 'Perumusan Berita Acara TM Juri ke dalam Buku Juknis Final terlegitimasi hukum dewan juri, master template lembar nilai, dan komputasi rekap nilai real-time.',
        pic: 'Divisi Juri & Penilaian, Sekretaris, Divisi Acara',
    },
    {
        id: 'tl-11',
        phase: 'D. Pengadaan Logistik, Produksi & Pemantapan Sistem',
        period: '15 – 30 November 2026',
        title: 'Produksi Seragam Panitia & Follow-Up Sponsor',
        desc: 'Pemesanan seragam panitia (100 pcs Kaos @Rp 85.000, 100 pcs Lanyard, 100 pcs Topi), rekapitulasi DP tenant UMKM, pencairan termin 1 sponsorship.',
        pic: 'Divisi DDD, Divisi Perlengkapan, Bendahara, Divisi Dana & Kemitraan',
    },
    {
        id: 'tl-12',
        phase: 'D. Pengadaan Logistik, Produksi & Pemantapan Sistem',
        period: '1 – 20 Desember 2026',
        title: 'Pengadaan Trofi Juara, Dana Pembinaan & Medis',
        desc: 'Pemesanan 2 Piala Bergilir Juara Umum, 12 Piala Tetap Juara 1-3 & Harapan 1-3, 2 Piala Danton Terbaik, 18 papan simbolis, alokasi uang tunai Rp 9.600.000, kerja sama PMI & Dinkes.',
        pic: 'Divisi Penghargaan & Medis, Divisi Perlengkapan, Sekretaris, Bendahara',
    },
    {
        id: 'tl-13',
        phase: 'D. Pengadaan Logistik, Produksi & Pemantapan Sistem',
        period: '21 – 31 Desember 2026',
        title: 'Finalisasi Vendor Sewa & Simulasi Penilaian',
        desc: 'Kontrak vendor: 70 unit HT frekuensi jernih, 3 tenda juri, 16 tenda tenant, kabel roll, 3 set sound system; simulasi komputasi input ganda real-time di komputer rekap.',
        pic: 'Divisi Perlengkapan, Divisi Juri & Penilaian, Divisi Teknis Lapangan',
    },
    {
        id: 'tl-14',
        phase: 'E. Agenda Technical Meeting Peserta',
        period: '2 – 8 Januari 2027',
        title: 'Persiapan Administrasi & Materi TM Peserta',
        desc: 'Pencetakan Buku Panduan Juknis Final (50 eksemplar), penyiapan perangkat lotting nomor undian SD-01 s.d. SD-18 & SMP-01 s.d. SMP-18, slide presentasi visual denah & alur.',
        pic: 'Divisi Acara, Divisi LO & Humas, Divisi Perlengkapan, Divisi Konsumsi',
    },
    {
        id: 'tl-15',
        phase: 'E. Agenda Technical Meeting Peserta',
        period: '9 Januari 2027',
        title: 'Setting Aula Kampus Induk & Gladi Ruang TM',
        desc: 'Penataan kursi Aula Kampus Induk Mu\'allimin (Jl. Letjen S. Parman No. 68 Wirobrajan), uji coba audio/mic & display lotting digital, briefing 36 Liaison Officer (LO).',
        pic: 'Divisi Acara, Divisi Perlengkapan, Divisi LO & Humas',
    },
    {
        id: 'tl-16',
        phase: 'E. Agenda Technical Meeting Peserta',
        period: 'Sabtu, 10 Januari 2027 (13.00 – 16.30 WIB)',
        title: 'Pelaksanaan Technical Meeting Peserta (TM Peserta)',
        desc: 'Verifikasi berkas fisik asli 36 kontingen, pemaparan juknis oleh panitia & dewan juri, sesi tanya jawab teknis gerakan, pengundian resmi (lotting) nomor tampil, Berita Acara.',
        pic: 'Panitia Inti, Divisi Acara, Divisi LO & Humas, Divisi Teknis Lapangan, Divisi Juri',
    },
    {
        id: 'tl-17',
        phase: 'E. Agenda Technical Meeting Peserta',
        period: '11 – 12 Januari 2027',
        title: 'Pasca-TM Peserta (Distribusi Data Resmi)',
        desc: 'Rilis matriks resmi nomor undian, urutan tampil, dan pembagian ruang kelas basecamp ke WhatsApp Grup Peserta, penempelan label map form juri.',
        pic: 'Divisi LO & Humas, Divisi Acara, Sekretaris',
    },
    {
        id: 'tl-18',
        phase: 'F. Uji Coba Lapangan / Familiarisasi Medan',
        period: '13 – 15 Januari 2027',
        title: 'Persiapan Teknis Arena & Scheduling Uji Coba',
        desc: 'Pembersihan permukaan Lapangan Basket & Pelataran Embung, penandaan batas arena sementara (25x14m & 26x15m), pembagian blok waktu 15 menit per peleton (10 efektif + 5 transisi).',
        pic: 'Divisi Teknis Lapangan, Divisi Acara, Divisi LO & Humas',
    },
    {
        id: 'tl-19',
        phase: 'F. Uji Coba Lapangan / Familiarisasi Medan',
        period: '16 Januari 2027',
        title: 'Setting Pos Transit & Sterilisasi Jalur Uji Coba',
        desc: 'Pemasangan tenda transit holding, penyiapan Posko Medis P3K lengkap dengan tandu & oksigen, galon air minum pinggir arena, rekayasa lalu lintas bus kontingen.',
        pic: 'Divisi Teknis Lapangan, Divisi Keamanan, Divisi Medis, Divisi Perlengkapan',
    },
    {
        id: 'tl-20',
        phase: 'F. Uji Coba Lapangan / Familiarisasi Medan',
        period: 'Minggu, 17 Januari 2027 (08.00 – 13.30 WIB)',
        title: 'Pelaksanaan Uji Coba Lapangan (Familiarisasi Medan)',
        desc: 'Uji coba serentak di 2 arena di Kampus Terpadu Sedayu: Arena 1 Basket (SD-01 s.d. SD-18) & Arena 2 Embung (SMP-01 s.d. SMP-18), adaptasi akustik vokal danton, cengkeraman sepatu, tanpa juri.',
        pic: 'Divisi Teknis Lapangan, Divisi Acara, Divisi LO & Humas, Divisi Medis, Divisi Keamanan',
    },
    {
        id: 'tl-21',
        phase: 'F. Uji Coba Lapangan / Familiarisasi Medan',
        period: '18 – 19 Januari 2027',
        title: 'Evaluasi Pasca-Uji Coba & Perbaikan Arena',
        desc: 'Identifikasi kendala lapangan: penanganan titik licin, perbaikan sudut meja juri agar tidak silau, penyesuaian jarak batas penonton agar aba-aba terdengar jernih.',
        pic: 'Divisi Teknis Lapangan, Divisi Acara, Divisi Perlengkapan',
    },
    {
        id: 'tl-22',
        phase: 'G. Pemantapan Logistik, Gladi & H-1',
        period: '20 – 22 Januari 2027',
        title: 'Pengambilan Logistik & Distribusi Seragam Panitia',
        desc: 'Pengambilan alat sewa (70 HT, 3 tenda juri, 16 tenda bazar, sound system), cetak massal 300 form juri stempel, ID card (100 panitia, 108 official & pendukung), koordinasi katering konsumsi.',
        pic: 'Divisi Perlengkapan, Divisi DDD, Divisi Konsumsi, Divisi Juri & Penilaian',
    },
    {
        id: 'tl-23',
        phase: 'G. Pemantapan Logistik, Gladi & H-1',
        period: 'Jumat, 23 Januari 2027 (08.00 – 21.00 WIB)',
        title: 'Gladi Kotor, Gladi Bersih & Setup Final (H-1)',
        desc: 'Marking cat lapangan paten, pasang tenda juri, panggung upacara minisoccer, 20 stand bazar, instalasi genset & cek sinyal 70 HT, simulasi alur peleton, gladi bersih protokoler, briefing akbar 100 panitia.',
        pic: 'Seluruh Panitia Pelaksana, Divisi Teknis Lapangan, Divisi Perlengkapan, Divisi Acara',
    },
    {
        id: 'tl-24',
        phase: 'H. Pelaksanaan Hari-H Perlombaan',
        period: 'Sabtu, 24 Januari 2027 (06.00 – 07.00 WIB)',
        title: 'Registrasi Ulang 36 Kontingen & Penempatan Basecamp',
        desc: 'Verifikasi kedatangan di Meja Registrasi, serahkan KTP jaminan, terima nomor dada S2B1, ID Card, 2 kantong sampah terpilah, pengawalan LO menuju ruang kelas basecamp.',
        pic: 'Divisi Acara (Registrasi), Divisi LO & Humas, Divisi Keamanan',
    },
    {
        id: 'tl-25',
        phase: 'H. Pelaksanaan Hari-H Perlombaan',
        period: 'Sabtu, 24 Januari 2027 (07.00 – 07.30 WIB)',
        title: 'Pengondisian Upacara & Penyambutan Dewan Juri',
        desc: 'Mobilisasi kontingen apel di Minisoccer, sterilisasi arena pada pukul 07.30 WIB, penyambutan 6 Dewan Juri di Transit VIP Perpustakaan ASM, pembagian sarapan pagi VIP.',
        pic: 'Divisi Acara, Divisi LO & Humas, Divisi Juri & Penilaian, Divisi Konsumsi',
    },
    {
        id: 'tl-26',
        phase: 'H. Pelaksanaan Hari-H Perlombaan',
        period: 'Sabtu, 24 Januari 2027 (07.30 – 08.15 WIB)',
        title: 'Upacara Pembukaan LBB Mu\'allimin 2027',
        desc: 'Wajib diikuti kontingen nomor urut SD-01 s.d. SD-05 & SMP-01 s.d. SMP-05 (1 danton + 15 anggota lengkap), pembukaan resmi oleh Direktur Madrasah Mu\'allimin di Minisoccer.',
        pic: 'Divisi Acara, Protokoler',
    },
    {
        id: 'tl-27',
        phase: 'H. Pelaksanaan Hari-H Perlombaan',
        period: 'Sabtu, 24 Januari 2027 (08.15 – 08.30 WIB)',
        title: 'Mobilisasi Menuju 2 Arena Perlombaan',
        desc: 'Peleton SD & 3 Juri SD menuju Arena 1 Basket; Peleton SMP & 3 Juri SMP menuju Arena 2 Embung; distribusi air minum peserta ke basecamp.',
        pic: 'Divisi Acara, Divisi Teknis Lapangan, Divisi LO & Humas, Divisi Konsumsi',
    },
    {
        id: 'tl-28',
        phase: 'H. Pelaksanaan Hari-H Perlombaan',
        period: 'Sabtu, 24 Januari 2027 (08.30 – 11.30 WIB)',
        title: 'Pelaksanaan Lomba Sesi I (2 Arena Paralel)',
        desc: 'Penampilan nomor urut SD-01 s.d. SD-12 (durasi maks 10 menit) dan SMP-01 s.d. SMP-12 (durasi maks 13 menit), runner membawa form juri ke tim rekap, pos medis siaga.',
        pic: 'Divisi Acara, Teknis Lapangan, Divisi Juri, LO & Humas, Keamanan, Medis, DDD',
    },
    {
        id: 'tl-29',
        phase: 'H. Pelaksanaan Hari-H Perlombaan',
        period: 'Sabtu, 24 Januari 2027 (11.30 – 12.30 WIB)',
        title: 'ISHOMA (Istirahat, Salat Dhuhur & Makan Siang)',
        desc: 'Salat Dhuhur berjamaah di Masjid Kampus Terpadu Sedayu, distribusi makan siang kotak VIP juri, 100 panitia, dan tamu undangan, isi ulang air galon basecamp.',
        pic: 'Divisi Konsumsi, Seluruh Panitia',
    },
    {
        id: 'tl-30',
        phase: 'H. Pelaksanaan Hari-H Perlombaan',
        period: 'Sabtu, 24 Januari 2027 (12.30 – 14.00 WIB)',
        title: 'Pelaksanaan Lomba Sesi II (2 Arena Paralel)',
        desc: 'Penampilan 6 peleton terakhir SD-13 s.d. SD-18 dan SMP-13 s.d. SMP-18, input nilai real-time, rekapitulasi poin penalti lapangan oleh panitera.',
        pic: 'Divisi Acara, Teknis Lapangan, Divisi Juri, LO & Humas, Keamanan, Medis, DDD',
    },
    {
        id: 'tl-31',
        phase: 'H. Pelaksanaan Hari-H Perlombaan',
        period: 'Sabtu, 24 Januari 2027 (14.00 – 15.00 WIB)',
        title: 'Sidang Pleno Dewan Juri & Rekapitulasi Akhir',
        desc: 'Sidang pleno tertutup 6 dewan juri di Gedung Perpustakaan ASM, penetapan Juara 1-3, Harapan 1-3, Danton Terbaik, Juara Umum, penandatanganan SK Juri, snack sore.',
        pic: 'Divisi Juri & Penilaian, Divisi Acara, Divisi Konsumsi',
    },
    {
        id: 'tl-32',
        phase: 'H. Pelaksanaan Hari-H Perlombaan',
        period: 'Sabtu, 24 Januari 2027 (15.00 – 15.30 WIB)',
        title: 'Apel Penutupan LBB Mu\'allimin 2027',
        desc: 'Pengondisian seluruh 36 kontingen di Minisoccer (1 komandan + 4 anggota peleton bersepatu rapi), apel penutupan resmi oleh panitia & pimpinan madrasah.',
        pic: 'Divisi Acara, Protokoler, Divisi Keamanan',
    },
    {
        id: 'tl-33',
        phase: 'H. Pelaksanaan Hari-H Perlombaan',
        period: 'Sabtu, 24 Januari 2027 (15.30 – 16.15 WIB)',
        title: 'Pengumuman Juara & Penganugerahan Hadiah',
        desc: 'Pembacaan SK resmi dewan juri, penyerahan 2 Piala Bergilir Juara Umum, 12 Piala Tetap Juara & Harapan, 2 Piala Danton Terbaik, uang pembinaan tunai total Rp 9.600.000, piagam juri.',
        pic: 'Divisi Acara, Divisi Penghargaan & Medis, Bendahara',
    },
    {
        id: 'tl-34',
        phase: 'H. Pelaksanaan Hari-H Perlombaan',
        period: 'Sabtu, 24 Januari 2027 (16.15 – 18.00 WIB)',
        title: 'Masa Sanggah, Operasi Kebersihan & Checkout Basecamp',
        desc: 'Masa sanggah resmi 60 menit tertulis di Meja Informasi, verifikasi kebersihan ruang kelas & serah terima sampah terpilah di Area Checkout, pengembalian KTP jaminan (maks 18.00 WIB).',
        pic: 'Seluruh Panitia Pelaksana, Divisi Perlengkapan, Divisi Keamanan, Divisi Konsumsi',
    },
    {
        id: 'tl-35',
        phase: 'I. Pasca-Pelaksanaan & Pelaporan / LPJ',
        period: '25 – 31 Januari 2027',
        title: 'Pengembalian Alat Sewa, Evaluasi Akbar & After Movie',
        desc: 'Pengembalian peralatan sewa (HT, tenda, sound), rapat evaluasi akbar 100 personil panitia pelaksana, rilis video After Movie dan dokumentasi resmi di media sosial.',
        pic: 'Ketua Pelaksana, Panitia Inti, Divisi Perlengkapan, Divisi DDD',
    },
    {
        id: 'tl-36',
        phase: 'I. Pasca-Pelaksanaan & Pelaporan / LPJ',
        period: '1 – 20 Februari 2027',
        title: 'Penyusunan Laporan Pertanggungjawaban (LPJ)',
        desc: 'Penyusunan draf buku LPJ Kegiatan dan LPJ Keuangan lengkap bukti kuitansi pengeluaran, realisasi pendaftaran 36 peleton, sewa 20 tenant UMKM (Rp 10.000.000), dana sponsor, dan biaya operasional.',
        pic: 'Sekretaris, Bendahara, Divisi Dana & Kemitraan, Ketua Pelaksana',
    },
    {
        id: 'tl-37',
        phase: 'I. Pasca-Pelaksanaan & Pelaporan / LPJ',
        period: '22 – 28 Februari 2027',
        title: 'Penyerahan LPJ Final ke Madrasah & Pembubaran Panitia',
        desc: 'Penyerahan dokumen LPJ Final (cetak 5 bundel hardcover) kepada Direksi Madrasah Mu\'allimin Muhammadiyah Yogyakarta, syukuran dan pembubaran resmi panitia pelaksana.',
        pic: 'Ketua Pelaksana, Sekretaris, Bendahara',
    },
];

// ---------------------------------------------------------------------------
// BACKEND_CONFIG – Konfigurasi URL Google Apps Script & Google Client ID
// Menjamin aplikasi tetap tersambung ke Google Sheet baik di localhost maupun di GitHub Pages
// ---------------------------------------------------------------------------
export const BACKEND_CONFIG = {
    DEFAULT_APPS_SCRIPT_URL: 'https://script.google.com/macros/s/AKfycbxLkfu6DLYOfjwK3gQBOgtKMy6k6ELn_Ma1COMfx0SivJEYGEbb64KAtt2H76XAN8QK/exec',
    DEFAULT_GOOGLE_CLIENT_ID: '587440262077-ms6nf4jopejuqre6f1pan5as2umlv2nr.apps.googleusercontent.com',
    // Kunci otentikasi internal untuk akses lembar skor dewan juri (mencegah inspeksi oleh peserta)
    SCORE_SECRET_KEY: 'LBB_SECURE_JURY_SCORES_MUALLIMIN_2026',
};



