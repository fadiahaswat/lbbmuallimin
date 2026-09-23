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

    /** Sub-label di logo footer */
    TAGLINE: "Mu\u2019allimin Yogyakarta",

    /** Paragraf deskripsi singkat di footer */
    FOOTER_DESCRIPTION:
        'Ajang kompetisi baris-berbaris tingkat pelajar terbesar se-DIY. '
        + 'Menjunjung tinggi sportivitas, kreativitas, dan disiplin untuk mencetak '
        + 'generasi pemimpin masa depan.',

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

    /** Teks deskripsi singkat di bawah judul (HTML) */
    SUBTITLE:
        'Ajang pembuktian <span class="text-white font-bold">Disiplin</span>, '
        + '<span class="text-white font-bold">Karakter</span>, dan '
        + '<span class="text-white font-bold">Solidaritas</span> pelajar terbaik se-DIY.',
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
    TECHNICAL_MEETING_MAPS_URL: "https://www.google.com/maps/dir/?api=1&destination=Madrasah+Mu'allimin+Muhammadiyah+Yogyakarta+Jl.+Letjen+S.+Parman+No.+68+Wirobrajan",

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

// ---------------------------------------------------------------------------
// COMPETITION – aturan & komposisi peserta
// ---------------------------------------------------------------------------
export const COMPETITION = {
    MAX_PLATOONS_PER_SCHOOL: 2,
    MAX_PLATOONS_PER_SCHOOL_LABEL: 'Max 2 Peleton per sekolah.',

    MAX_PERSONNEL: 25,
    MAX_PERSONNEL_LABEL: 'Komposisi (Max 25 Orang)',

    COMMANDER_COUNT: 1,
    CORE_TROOPS: 21,
    RESERVE_TROOPS: 3,

    OFFICIAL_TEAM_LABEL: 'Max 2 Pelatih + 1 Dokumentasi.',
    TOTAL_PERSONNEL_LABEL: 'Total: 25 Personil',

    /** FAQ: teks komposisi lengkap */
    COMPOSITION_DETAIL: 'Maksimal 25 orang: 1 Komandan, 21 Pasukan, 3 Cadangan.',

    /** FAQ: minimal tampil */
    MIN_PERFORM_DETAIL: 'Minimal Tampil: 22 orang (1 Komandan + 21 Pasukan).',

    /** Jumlah anggota per peleton (dipakai di Juknis) */
    MEMBERS_PER_TEAM: 25,

    /** Kuota total peleton yang bisa ikut */
    MAX_TEAMS_TOTAL: 36,
    MAX_TEAMS_SD: 18,
    MAX_TEAMS_SMP: 18,

    /** Batas waktu tampil (dalam menit, dipakai di Juknis – nilai umum/rata-rata) */
    PERFORMANCE_TIME_LIMIT_MINUTES: '10 (SD/MI) / 13 (SMP/MTs)',

    /** Deskripsi unsur dewan juri */
    JURY_MEMBERS: 'TNI, POLRI, dan Militer Profesional',

    /** Proporsi penilaian (%) untuk ditampilkan di Juknis */
    SCORING_PROPORTIONS: {
        PBB: 60,
        DANTON: 25,
        VARIASI: 15,
    },

    SD: {
        TARGET_PLATOONS: 18,
        TOTAL_PERSONNEL_LABEL: 'Total: 25 Personil',
        ARENA_SIZE: '25m \u00D7 14m',
        ARENA_WIDTH_LABEL: '25 METER',
        ARENA_HEIGHT_LABEL: '14m',
        DURATION_LABEL: 'Durasi Max: 10 Menit',
        SUBSTITUTION_LABEL: 'Gerakan No. 20 & 21',
        ARENA_SPEC_LABEL: 'Ukuran Pos 25 \u00D7 14 Meter \u2013 Waktu 10 Menit',
    },
    SMP: {
        TARGET_PLATOONS: 18,
        TOTAL_PERSONNEL_LABEL: 'Total: 25 Personil',
        ARENA_SIZE: '26m \u00D7 15m',
        ARENA_WIDTH_LABEL: '26 METER',
        ARENA_HEIGHT_LABEL: '15m',
        DURATION_LABEL: 'Durasi Max: 13 Menit',
        SUBSTITUTION_LABEL: 'Gerakan No. 17 & 18',
        ARENA_SPEC_LABEL: 'Ukuran Pos 26 \u00D7 15 Meter \u2013 Waktu 13 Menit',
    },
};

// ---------------------------------------------------------------------------
// ACHIEVEMENTS – prestasi panitia (tampil sebagai badge)
// ---------------------------------------------------------------------------
export const ACHIEVEMENTS = [
    '\uD83C\uDFC6 Juara Umum LBB Manggala Bhakti 2025',
    '\uD83C\uDFC6 Juara Umum LKBB Bela Negara 2025',
    '\uD83C\uDFC6 Juara 1 LBB Piala Walikota Yogyakarta 2025',
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
        description: 'Dokumen panduan resmi pelaksanaan LBB Mu\'allimin 2027 yang memuat ketentuan lomba, materi PBB & Vafor, kriteria penilaian, dan tata tertib.',
        size: '2.5 MB',
        type: 'PDF',
        url: '#',
        badge: 'Wajib Unduh',
        featured: true,
        icon: 'BookOpen',
        colorScheme: 'blue',
    },
];

// ---------------------------------------------------------------------------
// CONTACT – kontak panitia
// ---------------------------------------------------------------------------
export const CONTACT = {
    EMAIL: 'panitia@lbbmuallimin.com',
    EMAIL_HREF: 'mailto:panitia@lbbmuallimin.com',
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
    PLATOON_TECHNIQUE_PCT: 70,
    PLATOON_COHESION_PCT: 30,
    DANTON_MASTERY_PCT: 35,
    DANTON_VOICE_PCT: 25,
    DANTON_ATTITUDE_PCT: 20,
    DANTON_FIELD_PCT: 20,
    SCORE_RANGE_LABEL: 'Rubrik Skala K / C / B / BS Berjenjang',
};

/** Kategori Predikat Mutu */
export const RUBRIC_GRADES = [
    { key: 'K', label: 'Kurang (K)', color: 'text-amber-700 bg-amber-50 border-amber-300' },
    { key: 'C', label: 'Cukup (C)', color: 'text-blue-700 bg-blue-50 border-blue-300' },
    { key: 'B', label: 'Baik (B)', color: 'text-emerald-700 bg-emerald-50 border-emerald-300' },
    { key: 'BS', label: 'Baik Sekali (BS)', color: 'text-purple-700 bg-purple-50 border-purple-300' },
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
// PENALTIES – daftar sanksi & pengurangan nilai
// ---------------------------------------------------------------------------
export const PENALTIES = [
    { label: 'Tidak ikut Upacara Pembukaan',      value: '-150 Poin' },
    { label: 'Tidak Hadir DP 1 (3x Panggilan)',   value: 'Urutan Akhir & -100 Poin' },
    { label: 'Personel Kurang (< 22 orang)',       value: '-75 Poin' },
    { label: 'Kelebihan Waktu (per 30 detik)',     value: '-50 Poin' },
    { label: 'Injak Garis / Keluar Batas',         value: '-50 Poin' },
    { label: 'Gerakan Penyesuaian > 3x',           value: '-25 Poin' },
];

// ---------------------------------------------------------------------------
// PRIZES – penghargaan & piala bergilir
// ---------------------------------------------------------------------------
export const PRIZES = {
    TOTAL_LABEL:           'Total Hadiah Jutaan Rupiah',
    ROLLING_TROPHY_TITLE:  'Piala Bergilir Juara Umum',
    ROLLING_TROPHY_SD:     'Piala Bergilir Gubernur DIY',
    ROLLING_TROPHY_SMP:    'Piala Bergilir Gubernur DIY',
};

// ---------------------------------------------------------------------------
// MATERIALS – daftar gerakan materi lomba
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
        'Jalan Di Tempat',
        'Hadap Kiri Jalan Di Tempat',
        'Hadap Serong Kanan Jalan Di Tempat',
        'Balik Kanan Jalan Di Tempat',
        'Hadap Serong Kiri Jalan Di Tempat \u2013 Henti',
        '3 Langkah Ke Kiri \u2013 Balik Kanan',
        '4 Langkah Ke Kanan',
        'Hadap Kiri Jalan Di Tempat',
        '3 Langkah Ke Depan(Dari Posisi Jalan Di Tempat) \u2013 Balik Kanan Jalan Di Tempat',
        '4 Langkah Ke Belakang(Dari Posisi Jalan Di Tempat) \u2013 Henti',
        'Maju Jalan \u2013 Tiap-tiap Banjar 2X Belok Kiri',
        'Langkah Tegap(Dari Posisi Langkah Biasa)',
        'Hormat Kanan \u2013 Tegak \u2013 Jalan Di Tempat \u2013 Henti',
        'Tiap-tiap Banjar 2X Belok Kanan Maju(Dari Posisi Berhenti) \u2013 Henti',
        'Melintang Kanan(Berhenti ke Berhenti) \u2013 Henti \u2013 Balik Kanan',
        'Maju Jalan \u2013 Haluan Kanan(Berjalan ke Berhenti) \u2013 Henti',
        'Laporan Penutup \u2013 Penghormatan Dewan Juri(Aba-aba Pelaksanaan Waktu Berakhir)',
    ],
    SMP: [
        'Penghormatan Dewan Juri(Aba-aba Pelaksanaan Waktu Dimulai) \u2013 Laporan Pembuka',
        'Bubar \u2013 Berhimpun',
        'Berkumpul Berbanjar \u2013 Langkah Biasa(Dari Posisi Berhenti)',
        'Melintang Kanan(Berjalan ke Berjalan) \u2013 Langkah Biasa \u2013 Balik Kanan Henti',
        'Jalan Di Tempat \u2013 Langkah Tegap \u2013 Haluan Kanan(Berjalan ke Berjalan) \u2013 Langkah Biasa \u2013 Henti)',
        'Hadap Kiri Maju(Dari Posisi Berhenti) \u2013 Tiap-tiap Banjar 2X Belok Kanan \u2013 Balik Kanan Maju',
        'Ganti Langkah \u2013 2X Belok Kiri',
        'Lari(Dari Langkah Biasa) \u2013 2X Belok Kanan',
        'Langkah Biasa \u2013 Tiap-tiap Banjar 2X Belok Kanan \u2013 Hadap Serong Kiri Henti',
        'Lari(Dari Posisi Berhenti) \u2013 Balik Kanan Lari Maju \u2013 Hadap Kiri Henti',
        'Hadap Serong Kiri Maju \u2013 2X Belok Kiri',
        'Langkah Tegap \u2013 Hormat Kanan',
        'Tiap-tiap Banjar 2X Belok Kiri(Dari Langkah Tegap) \u2013 Langkah Biasa',
        'Langkah Perlahan(Dari Langkah Biasa) \u2013 Henti',
        'Tiap-tiap Banjar 2X Belok Kanan Maju \u2013 3 Langkah Ke Kanan',
        'Balik Kanan Maju \u2013 Hadap Kiri Henti',
        'Bubar \u2013 Berkumpul Bersaf',
        'Jalan Di Tempat \u2013 Hadap Serong Kiri(Jalan Di Tempat)\u2013 3 Langkah Ke Depan',
        'Hadap Kanan(Jalan Di Tempat) \u2013 2 Langkah Ke Kanan \u2013 Balik Kanan(Jalan Di Tempat)',
        'Hadap Serong Kanan(Jalan Di Tempat) \u2013 Balik Kanan Henti',
        'Buka Barisan \u2013 Tutup Barisan',
        'Lencang Depan \u2013 Hitung(Berbanjar) \u2013 Hadap Kanan',
        'Setengah Lengan Lencang Kiri \u2013 Lencang Kiri \u2013 Hitung(Bersaf) \u2013 Balik Kanan',
        'Istirahat Di Tempat(Parade) \u2013 Periksa Kerapian(Parade)\u2013 Sikap Sempurna',
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
// JURY_POSTS – Konfigurasi Dewan Juri Resmi LBB Mu'allimin 2027:
// 1. Juri PBB: Seluruh materi gerakan PBB Pasukan
// 2. Juri Komandan: Khusus Komandan Peleton (Danton)
// 3. Juri Variasi & Formasi: Kreativitas, Kerapian, Estetika & Kekompakan
// Ditambah: Hakim Garis (Injak Garis) & Timer Lapangan (Waktu Tampil)
// ---------------------------------------------------------------------------
export const VARIASI_CRITERIA = [
    { id: 'kreativitas', name: 'Kreativitas & Tingkat Kesulitan Gerakan', defaultScore: 25, maxScore: 30 },
    { id: 'kerapian', name: 'Kerapian, Keseragaman & Kelurusan Saf/Banjar', defaultScore: 25, maxScore: 30 },
    { id: 'kekompakan', name: 'Kekompakan, Irama & Tempo Pasukan', defaultScore: 20, maxScore: 25 },
    { id: 'keindahan', name: 'Estetika, Visual Formasi & Kesan Umum', defaultScore: 15, maxScore: 15 },
];

export const JURY_POSTS = {
    pos1: {
        id: 'pos1',
        title: 'Juri 1: PBB Gerakan Materi Pasukan',
        shortTitle: 'Juri 1 (PBB)',
        badge: 'Dewan Juri PBB',
        defaultName: 'Mayor (Mar) Bambang S., S.E.',
        type: 'pbb',
        aspects: [
            { id: 'materi', label: 'Rubrik Gerakan Materi PBB Pasukan', weight: 100 },
        ],
    },
    pos2: {
        id: 'pos2',
        title: 'Juri 2: Komandan Peleton (Danton)',
        shortTitle: 'Juri 2 (Danton)',
        badge: 'Dewan Juri Danton',
        defaultName: 'AKP Tri Wibowo, S.H.',
        type: 'danton',
        aspects: [
            { id: 'sikap', label: 'Sikap Tampang & Sikap Sempurna', weight: 20 },
            { id: 'penguasaanMateri', label: 'Penguasaan Materi Aba-Aba', weight: 25 },
            { id: 'penguasaanLapangan', label: 'Penguasaan Medan Lomba', weight: 20 },
            { id: 'ikit', label: 'Irama / Kecepatan / Intonasi / Tempo (IKIT)', weight: 20 },
            { id: 'volumeSuara', label: 'Kekuatan & Volume Suara', weight: 15 },
        ],
    },
    pos3: {
        id: 'pos3',
        title: 'Juri 3: Variasi & Formasi',
        shortTitle: 'Juri 3 (Variasi & Formasi)',
        badge: 'Dewan Juri Variasi',
        defaultName: 'Kapten Inf. Hendra Wijaya',
        type: 'variasi',
        aspects: [
            { id: 'kreativitas', label: 'Kreativitas & Tingkat Kesulitan', weight: 30 },
            { id: 'kerapian', label: 'Kerapian & Kelurusan Pasukan', weight: 30 },
            { id: 'kekompakan', label: 'Kekompakan & Irama Pasukan', weight: 25 },
            { id: 'keindahan', label: 'Estetika Visual & Kesan Umum', weight: 15 },
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
        YELLOW_REMAINING: 180, // sisa 3 menit
        RED_REMAINING: 60, // sisa 1 menit
    },
    PENALTY_OVERTIME_PER_30_SEC: 50,
};

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



