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
    REGISTRATION_BADGE: 'Pendaftaran: 11 Oktober \u2013 7 November 2026',

    /** Rentang pendaftaran daring */
    REGISTRATION_RANGE: '11 Oktober \u2013 7 November 2026',

    /** Rentang verifikasi berkas oleh panitia */
    VERIFICATION_RANGE: '8 \u2013 14 November 2026',

    /** Tanggal pembukaan pendaftaran daring */
    REGISTRATION_START: '2026-10-11T00:00:00+07:00',

    /** Tanggal batas akhir pendaftaran – dipakai countdown timer */
    REGISTRATION_DEADLINE: '2026-11-07T23:59:59+07:00',

    /** TM Juri */
    JURY_TM_DATE: '7 November 2026',
    JURY_TM_FULL_DATE: 'Sabtu, 7 November 2026',
    JURY_TM_TIME_RANGE: '12.30 \u2013 16.00 WIB',
    JURY_TM_VENUE: 'Ruang VIP Gedung Perpustakaan ASM Kampus Terpadu Sedayu',

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
    FIELD_TRIAL_DATE: '16 Januari 2027',
    FIELD_TRIAL_FULL_DATE: 'Sabtu, 16 Januari 2027',
    FIELD_TRIAL_TIME_RANGE: '07.00 WIB \u2013 Selesai',

    /** Hari & tanggal hari-H */
    COMPETITION_DATE: 'Ahad, 24 Januari 2027',

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
        { name: 'Gelombang 1 (11 \u2013 24 Okt)', amount: '350.000', label: '11 \u2013 24 Oktober 2026', endDate: '2026-10-24T23:59:59+07:00' },
        { name: 'Gelombang 2 (25 Okt \u2013 7 Nov)', amount: '400.000', label: '25 Oktober \u2013 7 November 2026', endDate: '2026-11-07T23:59:59+07:00' },
    ],

    /** Teks biaya lengkap untuk FAQ */
    FEE_FULL: 'Rp350.000,- (11–24 Oktober 2026) dan Rp400.000,- (25 Oktober – 7 November 2026) per peleton.',

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
    PHONE_DISPLAY: '0819-4749-1505',

    /** WhatsApp Helpdesk Resmi */
    HELPDESK: {
        NAME: "Admin Tonti Mu'allimin",
        PHONE_DISPLAY: '0819-4749-1505',
        WA_URL: 'https://wa.me/6281947491505',
    },

    /** URL tombol WA mengambang (FAB) */
    WA_FAB_URL: 'https://wa.me/6281947491505',

    /** Portal resmi informasi & pendaftaran */
    PORTAL_URL: 'https://lbb.tontimuallimin.com/',
    PORTAL_DISPLAY: 'lbb.tontimuallimin.com',

    /** Daftar contact person panitia */
    PERSONS: [
        {
            NAME: "Admin Tonti Mu'allimin",
            SHORT_NAME: 'Helpdesk Resmi',
            PHONE_DISPLAY: '0819-4749-1505',
            WA_URL: 'https://wa.me/6281947491505',
        },
    ],
};

// ---------------------------------------------------------------------------
// SOCIAL – link & handle media sosial
// ---------------------------------------------------------------------------
export const SOCIAL = {
    INSTAGRAM_URL: 'https://www.instagram.com/lbbmuin/',
    INSTAGRAM_MUALLIMIN_URL: 'https://www.instagram.com/mualliminjogja/',
    YOUTUBE_URL: '#',
    TIKTOK_URL: 'https://www.tiktok.com/@tontimuallimin',

    /** Handle Instagram resmi event */
    INSTAGRAM_HANDLE: '@lbbmuin',

    /** Handle TikTok resmi */
    TIKTOK_HANDLE: '@tontimuallimin',

    /** Teks gabungan handle yang ditampilkan di info section */
    HANDLES_DISPLAY: '@lbbmuin • @mualliminjogja • @tontimuallimin',
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
        lower.includes('maju') ||
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
    { label: 'Pelanggaran Garis Arena / Kotak Danton',         value: '-50 Poin / kejadian (Asas Garis sebagai Garis)' },
    { label: 'Kelebihan Gerakan Penyesuaian (> 3 kali)',       value: '-25 Poin / gerakan tambahan' },
    { label: 'Gerakan Terlewat / Tidak Urut',                  value: 'Nilai Minimal / Nilai 0' },
    { label: 'Peleton Hafalan (Danton Salah Aba-Aba)',         value: 'Nilai 0 pada Gerakan & Potong Nilai Danton' },
    { label: 'Gerakan Berangkai Terputus',                     value: 'Nilai Minimal' },
    { label: 'Atribut Terlepas / Terjatuh di Arena',           value: '0 Poin (TIDAK DIKENAKAN PENALTI)' },
    { label: 'Ruang Basecamp Ditinggalkan Kotor / Berantakan', value: '-50 Poin' },
    { label: 'Kerusakan / Kehilangan Aset Ruang Basecamp',     value: 'Ganti Rugi + Denda Rp 500.000 (KTP Ditahan)' },
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
        'Hadap Kanan Maju(Dari Posisi Berhenti)',
        'Melintang Kanan(Berjalan ke Berhenti) \u2013 Balik Kanan Henti',
        'Langkah Tegap \u2013 Haluan Kanan(Berjalan ke Berjalan) \u2013 Langkah Biasa \u2013 Henti',
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
        'Bubar',
        'Berhimpun(Motivasi & Evaluasi Tema LBB) \u2013 Selesai \u2013',
        'Berkumpul Bersaf',
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
        { id: 'dp1', label: 'DP 1: Pengecekan Personel & Verifikasi Fisik', shortLabel: 'DP 1 (Verifikasi)', color: 'blue', icon: 'ClipboardCheck' },
        { id: 'dp2', label: 'DP 2: Ruang Tunggu Siap Tampil (Holding Area)', shortLabel: 'DP 2 (Siap Tampil)', color: 'amber', icon: 'ShieldCheck' },
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
                { item: 'Uang Transportasi Hari-H (Ahad, 24 Januari 2027)', volume: 6, unit: 'Orang', price: 50000, total: 300000 },
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
        id: "tl-1",
        phase: "A. Tahap Perencanaan, Legalitas & Persiapan Awal (September - Awal Oktober 2026)",
        period: "1 - 14 September 2026",
        title: "PEMBENTUKAN PANITIA & PERUMUSAN KONSEP DASAR (PANDUAN PERDANA)",
        desc: "Pembentukan struktur panitia lengkap (Ketua, Sekretaris, Bendahara, Acara, Lapangan, Juri, Perlengkapan, DDD, LO, Konsumsi, Medis, Keamanan). Penetapan tema: 'SEMANGAT SEBAGAI KSATRIA, BERJUANG DENGAN GEMBIRA'. Penyusunan draf awal Juklak/Juknis PBB mengacu Perpang TNI No. 58 & 57 Tahun 2018 dan No. 45 Tahun 2014.",
        pic: "Tim Formatur, Ketua Pelaksana, Divisi Acara, Sekretaris",
    },
    {
        id: "tl-2",
        phase: "A. Tahap Perencanaan, Legalitas & Persiapan Awal (September - Awal Oktober 2026)",
        period: "15 - 21 September 2026",
        title: "PENYUSUNAN PROPOSAL & MASTER ANGGARAN (RAB)",
        desc: "Penyusunan proposal resmi kegiatan. Perumusan Rencana Anggaran Biaya (RAB) realistis dengan target pemasukan dari: Subsidi Madrasah, Pendaftaran 36 Peleton (18 SD & 18 SMP), Sewa 20 Tenant Bazar UMKM (@Rp 500.000), dan Sponsorship. Pengadaan perlengkapan ATK kesekretariatan.",
        pic: "Ketua Pelaksana, Sekretaris, Bendahara, Divisi Dana & Kemitraan",
    },
    {
        id: "tl-3",
        phase: "A. Tahap Perencanaan, Legalitas & Persiapan Awal (September - Awal Oktober 2026)",
        period: "22 - 30 September 2026",
        title: "LEGALITAS & PERIZINAN KAMPUS TERPADU SEDAYU & KAMPUS INDUK WIROBRAJAN",
        desc: "Audiensi Direktur Madrasah Mu'allimin Yogyakarta guna persetujuan resmi. Pengajuan izin Aula Kampus Induk Mu'allimin Wirobrajan untuk Technical Meeting Peserta. Pengajuan izin fasilitas Kampus Terpadu Sedayu (Lap. Basket, Pelataran Embung, Lap. Minisoccer, Perpustakaan ASM, Basecamp Kelas, & Parkir).",
        pic: "Ketua Pelaksana, Sekretaris, Divisi Keamanan & Perizinan, Divisi Dana",
    },
    {
        id: "tl-4",
        phase: "A. Tahap Perencanaan, Legalitas & Persiapan Awal (September - Awal Oktober 2026)",
        period: "1 - 10 Oktober 2026",
        title: "SURVEI VENUE, MAPPING 2 ARENA & MATERI PROMOSI",
        desc: "Survei lapangan detail: Arena 1 Basket (SD: 25x14m, durasi 10 menit) dan Arena 2 Embung (SMP: 26x15m, durasi 13 menit). Pemetaan alur: Pos Parkir, Pos Registrasi Ulang, Holding Area DP 1 & DP 2, Ruang Medis, dan Toilet. Desain materi publikasi visual (Flyer Pendaftaran Peserta & Tenant, Twibbon, Teaser Medsos).",
        pic: "Divisi Teknis Lapangan, Divisi Acara, Divisi DDD, Divisi LO & Humas",
    },
    {
        id: "tl-5",
        phase: "B. Tahap Pendaftaran Peserta & Penjualan Stand Tenant (11 Oktober - 7 November 2026)",
        period: "11 - 24 Oktober 2026",
        title: "PENDAFTARAN GELOMBANG PERTAMA (GELOMBANG 1)",
        desc: "Pembukaan pendaftaran online via website resmi untuk SD/MI & SMP/MTs (11 - 24 Oktober 2026) dengan biaya pendaftaran Rp 350.000 per peleton. Verifikasi berkas kontingen (Surat Tugas Kepala Sekolah, NISN siswa, foto resmi, surat sehat). Penjualan stand bazar UMKM / tenant kuliner & merchandise Gelombang 1 (biaya sewa Rp 500.000 per tenant - tenda 2x2m, meja, kursi, listrik). Distribusi proposal sponsor ke instansi perbankan, BUMN/BUMD, dan mitra usaha.",
        pic: "Divisi Acara (Pendaftaran), Divisi LO & Humas, Divisi Dana & Kemitraan",
    },
    {
        id: "tl-6",
        phase: "B. Tahap Pendaftaran Peserta & Penjualan Stand Tenant (11 Oktober - 7 November 2026)",
        period: "25 Oktober - 7 November 2026",
        title: "PENDAFTARAN GELOMBANG KEDUA (GELOMBANG 2) & FINALISASI KUOTA",
        desc: "Pembukaan pendaftaran gelombang kedua (25 Oktober - 7 November 2026) dengan biaya pendaftaran Rp 400.000 per peleton hingga kuota pasti terpenuhi: 36 Peleton (18 SD/MI dan 18 SMP/MTs). Pelunasan biaya sewa 20 tenant UMKM (@Rp 500.000 = total Rp 10.000.000) dan penandatanganan tata tertib tenant. Penutupan pendaftaran resmi, verifikasi berkas administrasi peleton, dan pembentukan Grup WhatsApp Resmi Ofisial Peserta dipandu LO.",
        pic: "Divisi Acara (Pendaftaran), Divisi LO & Humas, Divisi Dana & Kemitraan, Bendahara",
    },
    {
        id: "tl-7",
        phase: "C. Rangkaian Agenda Technical Meeting Dewan Juri / TM Juri (November 2026)",
        period: "2 - 5 November 2026",
        title: "PERSIAPAN ADMINISTRASI & LOGISTIK TM JURI",
        desc: "Penerbitan & pengiriman surat permohonan Dewan Juri ke KODIM/Koramil (TNI), Polresta/Polsek (POLRI), dan PPI Kota Yogyakarta (masing-masing 2 personil: 1 SD & 1 SMP, total 6 juri). Konfirmasi tertulis kesediaan hadir 6 juri pada Sabtu, 7 November 2026 pukul 13.00 WIB. Penggandaan berkas draf juknis & penyiapan uang transport TM (@Rp 50.000).",
        pic: "Sekretaris, Divisi Juri & Penilaian, Bendahara",
    },
    {
        id: "tl-8",
        phase: "C. Rangkaian Agenda Technical Meeting Dewan Juri / TM Juri (November 2026)",
        period: "Jumat, 6 November 2026",
        title: "SETTING RUANG & BRIEFING INTERNAL PANITIA PRA-TM JURI",
        desc: "Penataan meja U-shape di Ruang VIP Gedung Perpustakaan ASM Kampus Terpadu Sedayu. Rapat internal penyelarasan draft regulasi lomba & pemesanan konsumsi coffee break siang dewan juri.",
        pic: "Divisi Juri & Penilaian, Divisi Acara, Divisi Perlengkapan, Divisi Konsumsi",
    },
    {
        id: "tl-9",
        phase: "C. Rangkaian Agenda Technical Meeting Dewan Juri / TM Juri (November 2026)",
        period: "Sabtu, 7 November 2026 (Pukul 12.30 - 16.00 WIB)",
        title: "PELAKSANAAN TECHNICAL MEETING DEWAN JURI (TM JURI)",
        desc: "12.30 - 13.00: Kedatangan 6 Dewan Juri di Ruang VIP Perpustakaan ASM, registrasi, & coffee break siang. 13.00 - 13.30: Pembukaan oleh Ketua Pelaksana & pemaparan profil LBB. 13.30 - 15.15: Sidang Pleno penyelarasan acuan materi (Perpang TNI 58 & 57 Th 2018 dan No 45 Th 2014), rubrik nilai peleton (1:1 Kebenaran:Kekompakan) & danton, penentuan durasi resmi (SD maks 10 mnt, SMP maks 13 mnt), serta sistem denda penalti. 15.15 - 15.45: Peninjauan fisik langsung ke Arena 1 (Basket) & Arena 2 (Embung). 15.45 - 16.00: Penandatanganan Berita Acara TM Juri, penyerahan uang transport TM Juri, dan foto bersama.",
        pic: "Panitia Inti, Divisi Acara, Divisi Juri & Penilaian, Bendahara, Divisi DDD",
    },
    {
        id: "tl-10",
        phase: "C. Rangkaian Agenda Technical Meeting Dewan Juri / TM Juri (November 2026)",
        period: "8 - 14 November 2026",
        title: "PASCA-TM JURI (DOKUMENTASI & SISTEMISASI HASIL)",
        desc: "Perumusan Berita Acara TM Juri ke dalam Buku Juknis Final berkekuatan hukum. Pembuatan master template blangko penilaian cetak. Perancangan formula spreadsheet komputasi rekapitulasi nilai real-time dengan proteksi rumus ganda.",
        pic: "Divisi Juri & Penilaian, Sekretaris, Divisi Acara",
    },
    {
        id: "tl-11",
        phase: "D. Tahap Pengadaan Logistik, Produksi & Pemantapan Sistem (Nov - Des 2026)",
        period: "15 - 30 November 2026",
        title: "PRODUKSI SERAGAM & FOLLOW-UP SPONSOR",
        desc: "Produksi 100 kaos panitia resmi (@Rp 85.000), 100 lanyard (@Rp 15.000), dan 100 topi lapangan (@Rp 35.000). Pencairan dana sponsor dan pembuatan buku panduan saku untuk TM Peserta.",
        pic: "Divisi DDD, Divisi Perlengkapan, Bendahara, Divisi Dana & Kemitraan",
    },
    {
        id: "tl-12",
        phase: "D. Tahap Pengadaan Logistik, Produksi & Pemantapan Sistem (Nov - Des 2026)",
        period: "1 - 20 Desember 2026",
        title: "PENGADAAN TROFI JUARA, DANA PEMBINAAN & DUKUNGAN MEDIS",
        desc: "Pemesanan 2 Piala Bergilir, 12 Piala Tetap Juara 1-3 & Harapan 1-3, dan 2 Piala Danton Terbaik. Pembuatan 18 papan simbolis juara 40x60 cm & alokasi uang tunai pembinaan Rp 9.600.000. Surat tim medis & ambulans siaga ke PMI / Dinkes Bantul, serta permohonan tenda pleton ke DENBEKANG.",
        pic: "Divisi Penghargaan & Medis, Divisi Perlengkapan, Sekretaris, Bendahara",
    },
    {
        id: "tl-13",
        phase: "D. Tahap Pengadaan Logistik, Produksi & Pemantapan Sistem (Nov - Des 2026)",
        period: "21 - 31 Desember 2026",
        title: "FINALISASI VENDOR SEWA & SIMULASI SOFTWARE PENILAIAN",
        desc: "Kontrak vendor sewa: 70 unit HT, tenda juri, sound system arena. Simulasi uji input nilai live score real-time juri SD dan SMP.",
        pic: "Divisi Perlengkapan, Divisi Juri & Penilaian, Divisi Teknis Lapangan",
    },
    {
        id: "tl-14",
        phase: "E. Rangkaian Agenda Technical Meeting Peserta / TM Peserta (Januari 2027)",
        period: "2 - 8 Januari 2027",
        title: "PERSIAPAN ADMINISTRASI & MATERI TM PESERTA",
        desc: "Cetak 50 buku Juknis Final, penyiapan tabung & gulungan nomor undian lotting (SD-01 s.d. SD-18 & SMP-01 s.d. SMP-18), lembar presensi, formulir biodata, dan konsumsi coffee break siang 80 orang.",
        pic: "Divisi Acara, Divisi LO & Humas, Divisi Perlengkapan, Divisi Konsumsi",
    },
    {
        id: "tl-15",
        phase: "E. Rangkaian Agenda Technical Meeting Peserta / TM Peserta (Januari 2027)",
        period: "Jumat, 9 Januari 2027",
        title: "SETTING AULA KAMPUS INDUK WIROBRAJAN & GLADI RUANG TM PESERTA",
        desc: "Penataan kursi di Aula Kampus Induk Mu'allimin Wirobrajan, cek sound/LCD display lotting digital, dan briefing 36 LO pendamping kontingen.",
        pic: "Divisi Acara, Divisi Perlengkapan, Divisi LO & Humas",
    },
    {
        id: "tl-16",
        phase: "E. Rangkaian Agenda Technical Meeting Peserta / TM Peserta (Januari 2027)",
        period: "Sabtu, 10 Januari 2027 (Pukul 12.30 - 16.30 WIB)",
        title: "PELAKSANAAN TECHNICAL MEETING PESERTA (TM PESERTA)",
        desc: "12.30 - 13.00: Registrasi ulang 36 kontingen, verifikasi berkas fisik asli (Surat Tugas berstempel & Pakta Integritas bermaterai Rp 10.000), pembagian snack box siang. 13.00 - 13.20: Pembukaan resmi, lagu Indonesia Raya & Mars Mu'allimin, sambutan Ketua Panitia. 13.20 - 14.30: Pemaparan mendalam Juknis Lapangan, dimensi 2 arena, alur DP 1 & DP 2, gerakan penyesuaian (maks 3x), kotak danton, larangan sol paku/pines, sistem live score website, tata tertib basecamp kelas & parkir. 14.30 - 15.15: Sesi tanya jawab teknis & klarifikasi multitafsir. 15.15 - 16.00: Lotting undian nomor urut tampil resmi (SD-01 s.d. SD-18 & SMP-01 s.d. SMP-18). 16.00 - 16.30: Pembagian slot Uji Coba Lapangan (16 Jan 2027), penandatanganan Berita Acara TM Peserta, dan temu LO pendamping.",
        pic: "Panitia Inti, Divisi Acara, Divisi LO & Humas, Divisi Teknis Lapangan, Divisi Juri",
    },
    {
        id: "tl-17",
        phase: "E. Rangkaian Agenda Technical Meeting Peserta / TM Peserta (Januari 2027)",
        period: "11 - 12 Januari 2027",
        title: "PASCA-TM PESERTA (DISTRIBUSI DATA RESMI)",
        desc: "Rilis matriks resmi nomor undian, urutan tampil, dan pembagian ruang kelas basecamp ke WhatsApp Grup Peserta. Penempelan label nomor peleton pada form penjurian.",
        pic: "Divisi LO & Humas, Divisi Acara, Sekretaris",
    },
    {
        id: "tl-18",
        phase: "F. Rangkaian Agenda Uji Coba Lapangan / Familiarisasi Medan (Januari 2027)",
        period: "13 - 15 Januari 2027",
        title: "PERSIAPAN TEKNIS ARENA & SCHEDULING UJI COBA",
        desc: "Pembersihan menyeluruh lantai Arena 1 Basket & Arena 2 Embung dari debu/pasir. Marking garis batas arena resmi 25x14m (SD) dan 26x15m (SMP). Penyusunan rundown detail simulasi alur masuk kampus, transit, DP, dan keluar arena.",
        pic: "Divisi Teknis Lapangan, Divisi Acara, Divisi LO & Humas",
    },
    {
        id: "tl-19",
        phase: "F. Rangkaian Agenda Uji Coba Lapangan / Familiarisasi Medan (Januari 2027)",
        period: "Jumat, 15 Januari 2027",
        title: "SETTING POS TRANSIT & STERILISASI JALUR UJI COBA",
        desc: "Pemasangan penunjuk arah, setting meja registrasi gerbang, dan briefing keamanan parkir bus di Lapangan Hibrida Argomulyo.",
        pic: "Divisi Perlengkapan, Divisi Keamanan, Divisi LO & Humas",
    },
    {
        id: "tl-20",
        phase: "F. Rangkaian Agenda Uji Coba Lapangan / Familiarisasi Medan (Januari 2027)",
        period: "Sabtu, 16 Januari 2027 (Pukul 07.15 - 14.15 WIB)",
        title: "PELAKSANAAN UJI COBA LAPANGAN (SIMULASI GLADI HARI-H TANPA UPACARA)",
        desc: "07.15: Masuk kampus peleton awal. 08.00: Panggilan DP 1 peleton No. 001 SD & SMP. 08.15 - 11.30: Pelaksanaan Sesi I (No. 001 s.d. 013 @15 menit). 11.30 - 12.30: ISHOMA Sholat Dhuhur di Masjid Hajah Yuliana. 12.30 - 13.45: Pelaksanaan Sesi II (No. 014 s.d. 018 @15 menit). 13.45 - 14.15: Clear area & evaluasi lapangan panitia.",
        pic: "Divisi Teknis Lapangan, Divisi Acara, Divisi LO & Humas, Divisi Medis, Divisi Keamanan",
    },
    {
        id: "tl-21",
        phase: "F. Rangkaian Agenda Uji Coba Lapangan / Familiarisasi Medan (Januari 2027)",
        period: "18 - 19 Januari 2027",
        title: "EVALUASI PASCA-UJI COBA & PERBAIKAN ARENA",
        desc: "Pengecekan ulang cat garis arena pasca-uji coba. Briefing pemantapan LO berdasarkan dinamika waktu kedatangan peserta.",
        pic: "Divisi Teknis Lapangan, Divisi Acara, Divisi LO & Humas",
    },
    {
        id: "tl-22",
        phase: "G. Tahap Pemantapan Logistik, Gladi & H-1 (20 - 23 Januari 2027)",
        period: "20 - 22 Januari 2027",
        title: "LOADING PERALATAN SEWA & DISTRIBUSI LOGISTIK",
        desc: "Loading tenda pleton, sound system, HT 70 unit, meja-kursi juri, traffic cone, dan pembagian trash bag.",
        pic: "Divisi Perlengkapan, Divisi Keamanan, Divisi Konsumsi",
    },
    {
        id: "tl-23",
        phase: "G. Tahap Pemantapan Logistik, Gladi & H-1 (20 - 23 Januari 2027)",
        period: "Jumat, 23 Januari 2027 (Pukul 08.00 - 21.00 WIB)",
        title: "GLADI KOTOR, GLADI BERSIH & STERILISASI TOTAL H-1",
        desc: "Gladi kotor & gladi bersih upacara pembukaan dan penutupan di Lapangan Mini Soccer. Simulasi alur keluar-masuk peleton DP 1 - DP 2 - Arena - Keluar. Sterilisasi penuh ruang kelas basecamp peserta & pemasangan identitas nama sekolah per kelas. Penyimpanan piala, piagam, dan uang pembinaan di brankas steril Perpustakaan ASM.",
        pic: "Seluruh Panitia Pelaksana, Divisi Teknis Lapangan, Divisi Perlengkapan, Divisi Acara, Divisi DDD",
    },
    {
        id: "tl-24",
        phase: "H. Tahap Pelaksanaan Perlombaan (Hari-H: Ahad, 24 Januari 2027)",
        period: "Ahad, 24 Januari 2027 (Pukul 06.00 - 17.00 WIB)",
        title: "PELAKSANAAN RESMI HARI-H LBB MU'ALLIMIN 2027",
        desc: "06.00 - 06.45: Check-in registrasi kontingen & penempatan basecamp kelas. 06.45 - 07.00: Pengkondisian upacara di Mini Soccer & sarapan VIP 6 Dewan Juri di Perpustakaan ASM. 07.00 - 07.45: Upacara Pembukaan Resmi LBB Mu'allimin 2027. 07.45 - 08.15: Jeda kesiapan peleton awal & panggilan resmi DP 1 pukul 08.00 WIB. 08.15 - 11.30: Pelaksanaan Lomba Sesi I (No. 001 s.d. 013 di Arena 1 Basket & Arena 2 Embung). 11.30 - 12.30: ISHOMA Sholat Dhuhur di Masjid Hajah Yuliana & makan siang. 12.30 - 13.45: Pelaksanaan Lomba Sesi II (No. 014 s.d. 018 penutup). 13.45 - 14.45: Sidang Pleno Dewan Juri & Checkout Basecamp Peserta. 14.45 - 15.15: Upacara Penutupan Resmi. 15.15 - 16.00: Pengumuman Juara, Trophy & Uang Pembinaan Rp 9.600.000. 16.00 - 17.00: Masa Sanggah 60 menit, rilis nilai website & kontingen pulang.",
        pic: "Seluruh Panitia Pelaksana, Dewan Juri, Seluruh Kontingen",
    },
    {
        id: "tl-25",
        phase: "I. Tahap Pasca-Pelaksanaan & Pelaporan / LPJ (Januari - Februari 2027)",
        period: "25 - 31 Januari 2027",
        title: "PENGEMBALIAN ALAT SEWA, EVALUASI AKBAR & AFTER MOVIE",
        desc: "Pengembalian seluruh peralatan sewa vendor (HT, tenda, sound system). Rapat evaluasi akbar panitia pelaksana & rilis resmi video After Movie di media sosial.",
        pic: "Ketua Pelaksana, Panitia Inti, Divisi Perlengkapan, Divisi DDD",
    },
    {
        id: "tl-26",
        phase: "I. Tahap Pasca-Pelaksanaan & Pelaporan / LPJ (Januari - Februari 2027)",
        period: "1 - 20 Februari 2027",
        title: "PENYUSUNAN LAPORAN PERTANGGUNGJAWABAN (LPJ)",
        desc: "Penyusunan draf buku LPJ Kegiatan dan LPJ Keuangan lengkap bukti kuitansi pengeluaran, realisasi pendaftaran 36 peleton, pemasukan 20 tenant UMKM (Rp 10.000.000), dana sponsor, dan operasional.",
        pic: "Sekretaris, Bendahara, Divisi Dana & Kemitraan, Ketua Pelaksana",
    },
    {
        id: "tl-27",
        phase: "I. Tahap Pasca-Pelaksanaan & Pelaporan / LPJ (Januari - Februari 2027)",
        period: "22 - 28 Februari 2027",
        title: "PENYERAHAN LPJ FINAL KE MADRASAH & PEMBUBARAN PANITIA",
        desc: "Penyerahan resmi dokumen LPJ Final (cetak 5 bundel hardcover) kepada Direksi Madrasah Mu'allimin Yogyakarta. Syukuran dan pembubaran panitia pelaksana secara resmi.",
        pic: "Ketua Pelaksana, Sekretaris, Bendahara",
    },
];

// ---------------------------------------------------------------------------
// BACKEND_CONFIG – Konfigurasi URL Google Apps Script & Google Client ID
// ---------------------------------------------------------------------------
export const BACKEND_CONFIG = {
    DEFAULT_APPS_SCRIPT_URL: 'https://script.google.com/macros/s/AKfycbxLkfu6DLYOfjwK3gQBOgtKMy6k6ELn_Ma1COMfx0SivJEYGEbb64KAtt2H76XAN8QK/exec',
    DEFAULT_GOOGLE_CLIENT_ID: '587440262077-ms6nf4jopejuqre6f1pan5as2umlv2nr.apps.googleusercontent.com',
    // Kunci otentikasi internal untuk akses lembar skor dewan juri (mencegah inspeksi oleh peserta)
    SCORE_SECRET_KEY: 'LBB_SECURE_JURY_SCORES_MUALLIMIN_2026',
};



