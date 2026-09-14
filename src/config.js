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
    TITLE: "Lomba Baris-Berbaris Mu\u2019allimin 2026",

    /** Konten meta description untuk SEO */
    DESCRIPTION: "Website Resmi Lomba Baris-Berbaris Mu\u2019allimin 2026 Tingkat SD/MI & SMP/MTs Se-DIY.",

    /** Tahun kegiatan – dipakai di berbagai tempat */
    YEAR: '2026',

    /** Sub-label di logo footer */
    TAGLINE: "Mu\u2019allimin Yogyakarta",

    /** Paragraf deskripsi singkat di footer */
    FOOTER_DESCRIPTION:
        'Ajang kompetisi baris-berbaris tingkat pelajar terbesar se-DIY. '
        + 'Menjunjung tinggi sportivitas, kreativitas, dan disiplin untuk mencetak '
        + 'generasi pemimpin masa depan.',

    /** Teks hak cipta footer */
    COPYRIGHT: '\u00A9 2026 LBB Mu\u2019allimin. All rights reserved.',
};

// ---------------------------------------------------------------------------
// HERO – konten hero section
// ---------------------------------------------------------------------------
export const HERO = {
    /** Baris pertama judul hero */
    TITLE_LINE1: 'LOMBA BARIS BERBARIS',

    /** Baris kedua judul hero */
    TITLE_LINE2: "MU\u2019ALLIMIN 2026",

    /** Teks deskripsi singkat di bawah judul (HTML) */
    SUBTITLE:
        'Ajang pembuktian <span class="text-white font-bold">Disiplin</span>, '
        + '<span class="text-white font-bold">Karakter</span>, dan '
        + '<span class="text-white font-bold">Solidaritas</span> pelajar terbaik se-DIY.',

    /** URL video background hero */
    VIDEO_URL: 'https://assets.mixkit.co/videos/preview/mixkit-red-smoke-on-a-black-background-video-2953-large.mp4',
};

// ---------------------------------------------------------------------------
// EVENT – semua tanggal & waktu kegiatan
// ---------------------------------------------------------------------------
export const EVENT = {
    /** Teks badge di hero (contoh: "Open Reg: 14 – 28 Juli 2026") */
    REGISTRATION_BADGE: 'Open Reg: 21 September \u2013 5 Oktober 2026',

    /** Rentang pendaftaran daring */
    REGISTRATION_RANGE: '21 September \u2013 5 Oktober 2026',

    /** Rentang verifikasi berkas oleh panitia */
    VERIFICATION_RANGE: '6 \u2013 10 Oktober 2026',

    /** Tanggal pembukaan pendaftaran daring */
    REGISTRATION_START: '2026-09-21T00:00:00+07:00',

    /** Tanggal batas akhir pendaftaran – dipakai countdown timer */
    REGISTRATION_DEADLINE: '2026-10-05T23:59:59+07:00',

    /** Tanggal Technical Meeting */
    TECHNICAL_MEETING_DATE: '23 Oktober 2026',

    /** Waktu Technical Meeting (singkat, di timeline) */
    TECHNICAL_MEETING_TIME: '13.00 WIB - Selesai',

    /** Hari + tanggal lengkap Technical Meeting (untuk FAQ) */
    TECHNICAL_MEETING_FULL_DATE: 'Jumat, 23 Oktober 2026',

    /** Rentang jam Technical Meeting */
    TECHNICAL_MEETING_TIME_RANGE: '13.00 WIB \u2013 Selesai',

    /** Lokasi / venue Technical Meeting */
    TECHNICAL_MEETING_VENUE:
        "Perpustakaan Ahmad Syafii Maarif Kampus Terpadu Madrasah Mu\u2019allimin Muhammadiyah Yogyakarta, "
        + "Dusun Bandut Lor, Argorejo, Kec. Sedayu, Kabupaten Bantul, Daerah Istimewa Yogyakarta.",

    /** Hari & tanggal hari-H */
    COMPETITION_DATE: 'Ahad, 8 November 2026',

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

    /** Label mini-map di bagian kontak/FAQ */
    MAPS_PREVIEW_NAME: "Kampus Terpadu Mu\u2019allimin",
    MAPS_PREVIEW_ADDRESS: 'Bandut Lor, Argorejo, Sedayu, Bantul, DIY',
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
    FEE_DISPLAY: '450.000',

    /** Daftar gelombang / tier biaya pendaftaran */
    FEE_TIERS: [
        { name: 'Gelombang 1 (21 \u2013 27 Sep)', amount: '450.000', label: '21 \u2013 27 September 2026', endDate: '2026-09-27T23:59:59+07:00' },
        { name: 'Gelombang 2 (28 Sep \u2013 5 Okt)', amount: '500.000', label: '28 September \u2013 5 Oktober 2026', endDate: '2026-10-05T23:59:59+07:00' },
    ],

    /** Teks biaya lengkap untuk FAQ */
    FEE_FULL: 'Rp450.000,- (21–27 September 2026) dan Rp500.000,- (28 September – 5 Oktober 2026) per peleton.',

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
        title: 'Petunjuk Teknis Lengkap',
        description: 'Dokumen utama yang berisi seluruh aturan, mekanisme pendaftaran, dan detail teknis pelaksanaan lomba.',
        size: '2.5 MB',
        type: 'PDF',
        url: '#',
        badge: 'Wajib Unduh',
        featured: true,
        icon: 'BookOpen',
        colorScheme: 'blue',
    },
    {
        id: 'form-a',
        title: 'Formulir A (Sekolah)',
        description: 'Data instansi sekolah & penanggung jawab.',
        size: '1.2 MB',
        type: 'PDF',
        url: '#',
        icon: 'FileText',
        colorScheme: 'red',
    },
    {
        id: 'form-b',
        title: 'Formulir B (Biodata)',
        description: 'Template biodata peserta (dapat diedit).',
        size: '500 KB',
        type: 'DOCX',
        url: '#',
        icon: 'FileEdit',
        colorScheme: 'blue',
    },
    {
        id: 'form-c',
        title: 'Formulir C (Pernyataan)',
        description: 'Surat kesanggupan & integritas peserta.',
        size: '800 KB',
        type: 'PDF',
        url: '#',
        icon: 'FileCheck',
        colorScheme: 'red',
    },
    {
        id: 'juknis-lapangan',
        title: 'Juknis Lapangan',
        description: 'Denah lapangan dan kriteria penilaian.',
        size: '3.1 MB',
        type: 'PDF',
        url: '#',
        icon: 'Map',
        colorScheme: 'red',
    },
    {
        id: 'tata-tertib',
        title: 'Tata Tertib Peserta',
        description: 'Peraturan dan larangan kegiatan.',
        size: '1.0 MB',
        type: 'PDF',
        url: '#',
        icon: 'ShieldAlert',
        colorScheme: 'orange',
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
    INSTAGRAM_URL: 'https://www.instagram.com/lbbmuallimin/',
    YOUTUBE_URL: '#',
    TIKTOK_URL: 'https://www.tiktok.com/@tontimuallimin',

    /** Handle Instagram resmi event */
    INSTAGRAM_HANDLE: '@lbbmuallimin',

    /** Handle TikTok resmi */
    TIKTOK_HANDLE: '@tontimuallimin',

    /** Teks gabungan handle yang ditampilkan di info section */
    HANDLES_DISPLAY: '@lbbmuallimin • @tontimuallimin',
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
// SCORING – bobot penilaian
// ---------------------------------------------------------------------------
export const SCORING = {
    PLATOON_TECHNIQUE_PCT: 70,
    PLATOON_COHESION_PCT: 30,
    DANTON_MASTERY_PCT: 35,
    DANTON_VOICE_PCT: 25,
    DANTON_ATTITUDE_PCT: 20,
    DANTON_FIELD_PCT: 20,
    SCORE_RANGE_LABEL: '50-90 (Interval 2 poin)',
};

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
    CLIENT_ID: import.meta.env.VITE_GOOGLE_CLIENT_ID || '587440262077-ms6nf4jopejuqre6f1pan5as2umlv2nr.apps.googleusercontent.com',
};

// ---------------------------------------------------------------------------
// JURY_POSTS – Konfigurasi Pos Dewan Juri (Fase 1: Multi-Jury E-Scoring)
// ---------------------------------------------------------------------------
export const JURY_POSTS = {
    pos1: {
        id: 'pos1',
        title: 'Pos 1: Juri PBB Dasar & Gerakan',
        shortTitle: 'Pos 1 (PBB)',
        badge: 'TNI / Kodim',
        defaultName: 'Mayor (Mar) Bambang S., S.E.',
        aspects: [
            { id: 'teknik', label: 'Teknik Gerakan PBB (Ketepatan & Patah-patah)', weight: 70 },
            { id: 'kekompakan', label: 'Kekompakan & Keseragaman Pasukan', weight: 30 },
        ],
    },
    pos2: {
        id: 'pos2',
        title: 'Pos 2: Juri Variasi, Formasi & Kerapian',
        shortTitle: 'Pos 2 (Vafor)',
        badge: 'Akademi Militer / Purna Paskibraka',
        defaultName: 'Kapten Inf. Hendra Wijaya',
        aspects: [
            { id: 'kreativitas', label: 'Tingkat Kesulitan & Kreativitas Variasi', weight: 40 },
            { id: 'keindahan', label: 'Keindahan & Estetika Formasi', weight: 35 },
            { id: 'kostum', label: 'Kerapian Seragam & Atribut', weight: 25 },
        ],
    },
    pos3: {
        id: 'pos3',
        title: 'Pos 3: Juri Komandan Peleton (Danton)',
        shortTitle: 'Pos 3 (Danton)',
        badge: 'Polresta / Korps Danton',
        defaultName: 'AKP Tri Wibowo, S.H.',
        aspects: [
            { id: 'penguasaan', label: 'Penguasaan Materi & Urutan Aba-Aba', weight: 35 },
            { id: 'vokal', label: 'Intonasi, Kejelasan & Volume Vokal', weight: 25 },
            { id: 'sikap', label: 'Sikap Tampang & Postur Militer', weight: 20 },
            { id: 'lapangan', label: 'Ketenangan & Penguasaan Medan Lomba', weight: 20 },
        ],
    },
};

// ---------------------------------------------------------------------------
// STAGING_CONFIG – Konfigurasi Alur Lapangan & Timer (Fase 2: Staging Ops)
// ---------------------------------------------------------------------------
export const STAGING_CONFIG = {
    STAGES: [
        { id: 'waiting', label: 'Menunggu', shortLabel: 'Standby', color: 'slate', icon: 'Clock' },
        { id: 'dp1', label: 'DP 1: Absensi & Berkas', shortLabel: 'DP 1', color: 'blue', icon: 'ClipboardCheck' },
        { id: 'dp2', label: 'DP 2: Kerapian & Personel', shortLabel: 'DP 2', color: 'amber', icon: 'ShieldCheck' },
        { id: 'dp3', label: 'DP 3: Pintu Masuk Lapangan', shortLabel: 'DP 3', color: 'indigo', icon: 'DoorOpen' },
        { id: 'arena', label: 'Kotak Lomba (Tampil)', shortLabel: 'Tampil', color: 'emerald', icon: 'Play' },
        { id: 'finished', label: 'Selesai Tampil', shortLabel: 'Selesai', color: 'purple', icon: 'CheckCircle2' },
    ],
    DP2_CHECKLIST: [
        { id: 'personnelCount', label: 'Personel Lengkap (Min. 22: 1 Danton + 21 Pasukan)', required: true },
        { id: 'chestNumber', label: 'Nomor Dada Terpasang Rapi', required: true },
        { id: 'whiteGloves', label: 'Sarung Tangan Putih Bersih & Seragam', required: true },
        { id: 'beretCap', label: 'Peci / Baret & Lencana Lengkap', required: true },
        { id: 'footwear', label: 'Sepatu Lomba Sesuai Juknis (Hitam/Lars)', required: true },
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
// VOTING_CONFIG – Konfigurasi E-Voting Suporter Online (Fase 3: E-Voting)
// ---------------------------------------------------------------------------
export const VOTING_CONFIG = {
    TITLE: 'Voting Arena Suporter LBB Mu\'allimin 2026',
    DESCRIPTION: 'Dukung peleton sekolah favoritmu untuk meraih Trofi Peleton Terfavorit & Danton Terfavorit!',
    CATEGORIES: [
        { id: 'peleton', label: 'Peleton Terfavorit', badge: 'Suporter Utama' },
        { id: 'danton', label: 'Danton Terfavorit', badge: 'Komandan Favorit' },
    ],
    DAILY_LIMIT_PER_DEVICE: 1, // 1 vote per hari per pleton
};


