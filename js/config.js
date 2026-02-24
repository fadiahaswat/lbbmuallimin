/**
 * config.js
 * =========
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

    /** Teks deskripsi singkat di bawah judul */
    SUBTITLE:
        'Ajang pembuktian <span class="text-white font-bold border-b border-lbb-gold/50">Disiplin</span>, '
        + '<span class="text-white font-bold border-b border-lbb-gold/50">Karakter</span>, dan '
        + '<span class="text-white font-bold border-b border-lbb-gold/50">Solidaritas</span> pelajar terbaik se-DIY.',

    /** URL video background hero */
    VIDEO_URL: 'https://assets.mixkit.co/videos/preview/mixkit-red-smoke-on-a-black-background-video-2953-large.mp4',
};

// ---------------------------------------------------------------------------
// EVENT – semua tanggal & waktu kegiatan
// ---------------------------------------------------------------------------
export const EVENT = {
    /** Teks badge di hero (contoh: "Open Reg: 14 – 28 Juli 2026") */
    REGISTRATION_BADGE: 'Open Reg: 1 \u2013 24 April 2026',

    /** Rentang pendaftaran daring */
    REGISTRATION_RANGE: '1 \u2013 24 April 2026',

    /** Rentang verifikasi berkas oleh panitia */
    VERIFICATION_RANGE: '25 \u2013 1 Mei 2026',

    /** Tanggal batas akhir pendaftaran – dipakai countdown timer */
    REGISTRATION_DEADLINE: 'April 24, 2026 23:59:59',

    /** Tanggal Technical Meeting */
    TECHNICAL_MEETING_DATE: '10 Mei 2026',

    /** Waktu Technical Meeting (singkat, di timeline) */
    TECHNICAL_MEETING_TIME: '08.00 WIB - Selesai',

    /** Hari + tanggal lengkap Technical Meeting (untuk FAQ) */
    TECHNICAL_MEETING_FULL_DATE: 'Ahad, 10 Mei 2026',

    /** Rentang jam Technical Meeting */
    TECHNICAL_MEETING_TIME_RANGE: '09.00 WIB \u2013 Selesai',

    /** Lokasi / venue Technical Meeting */
    TECHNICAL_MEETING_VENUE:
        "Perpustakaan Ahmad Syafii Maarif Kampus Terpadu Madrasah Mu\u2019allimin Muhammadiyah Yogyakarta, "
        + "Dusun Badut Lor, Argorejo, Kec. Sedayu, Kabupaten Bantul, Daerah Istimewa Yogyakarta.",

    /** Hari & tanggal hari-H */
    COMPETITION_DATE: 'Ahad, 24 Mei 2026',

    /** Rentang waktu hari-H */
    COMPETITION_TIME_RANGE: '06.00 WIB \u2013 17.00 WIB',

    /** Jam mulai hari-H (untuk teks "Mulai 06.00 WIB") */
    COMPETITION_TIME_START_LABEL: 'Mulai 06.00 WIB',
};

// ---------------------------------------------------------------------------
// VENUE – lokasi pelaksanaan
// ---------------------------------------------------------------------------
export const VENUE = {
    NAME: "Kampus Terpadu Madrasah Mu\u2019allimin",

    /** Alamat lengkap yang tampil di kartu lokasi */
    ADDRESS: 'Bandut Lor, Argorejo, Sedayu, Kabupaten Bantul, Daerah Istimewa Yogyakarta.',

    /** Alamat singkat untuk footer */
    SHORT_ADDRESS: 'Bandut Lor, Argorejo, Sedayu, Bantul, DIY.',

    /** URL Google Maps – ganti dengan link Maps yang benar */
    MAPS_URL: 'https://maps.app.goo.gl/fVMgg5xZcwRQ4kN78',
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
        TARGET_PLATOONS: 16,
        TOTAL_PERSONNEL_LABEL: 'Total: 25 Personil',
    },
    SMP: {
        TARGET_PLATOONS: 16,
        TOTAL_PERSONNEL_LABEL: 'Total: 25 Personil',
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
    PORTAL_URL: 'https://tontimuallimin.com/',

    /** Nama domain yang tampil di UI */
    PORTAL_NAME: 'tontimuallimin.com',
};

// ---------------------------------------------------------------------------
// PAYMENT – data rekening & biaya
// ---------------------------------------------------------------------------
export const PAYMENT = {
    /** Nomor rekening – dipakai clipboard.js & FAQ */
    ACCOUNT_NUMBER: '300701003561505',

    ACCOUNT_NAME: 'FALHAN ZUHDI MUBAROK',
    BANK_NAME: 'BRI',

    /** Teks biaya yang tampil di UI (tanpa "Rp") */
    FEE_DISPLAY: '350.000',

    /** Teks biaya lengkap untuk FAQ */
    FEE_FULL: 'Rp350.000,- per peleton.',

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
        url: '#',                // ganti dengan URL unduhan yang sesungguhnya
        badge: 'Wajib Unduh',
        featured: true,         // tampil sebagai kartu besar
        icon: 'book-open',
        colorScheme: 'blue',
    },
    {
        id: 'form-a',
        title: 'Formulir A (Sekolah)',
        description: 'Data instansi sekolah & penanggung jawab.',
        size: '1.2 MB',
        type: 'PDF',
        url: '#',
        icon: 'file-text',
        colorScheme: 'red',
    },
    {
        id: 'form-b',
        title: 'Formulir B (Biodata)',
        description: 'Template biodata peserta (dapat diedit).',
        size: '500 KB',
        type: 'DOCX',
        url: '#',
        icon: 'file-edit',
        colorScheme: 'blue',
    },
    {
        id: 'form-c',
        title: 'Formulir C (Pernyataan)',
        description: 'Surat kesanggupan & integritas peserta.',
        size: '800 KB',
        type: 'PDF',
        url: '#',
        icon: 'file-check',
        colorScheme: 'red',
    },
    {
        id: 'juknis-lapangan',
        title: 'Juknis Lapangan',
        description: 'Denah lapangan dan kriteria penilaian.',
        size: '3.1 MB',
        type: 'PDF',
        url: '#',
        icon: 'map',
        colorScheme: 'red',
    },
    {
        id: 'tata-tertib',
        title: 'Tata Tertib Peserta',
        description: 'Peraturan dan larangan kegiatan.',
        size: '1.0 MB',
        type: 'PDF',
        url: '#',
        icon: 'shield-alert',
        colorScheme: 'orange',
    },
];

// ---------------------------------------------------------------------------
// CONTACT – kontak panitia
// ---------------------------------------------------------------------------
export const CONTACT = {
    EMAIL: 'panitia@lbbmuallimin.com',
    EMAIL_HREF: 'mailto:panitia@lbbmuallimin.com',
    PHONE_DISPLAY: '+62 812-3456-7890',

    /** URL tombol WA mengambang (FAB) */
    WA_FAB_URL: 'https://wa.me/6285314209369',

    /** Portal pendaftaran resmi */
    PORTAL_URL: 'https://lbbmuallimin.carrd.co/',
    PORTAL_DISPLAY: 'lbbmuallimin.carrd.co',

    /** Daftar contact person panitia */
    PERSONS: [
        {
            NAME: 'Kak Arhan',
            SHORT_NAME: 'Sdr. Arhan',
            PHONE_DISPLAY: '0853-1420-9369',
            WA_URL: 'https://wa.me/6285314209369',
        },
        {
            NAME: 'Kak Dandi',
            SHORT_NAME: 'Sdr. Dandi',
            PHONE_DISPLAY: '0823-2948-3126',
            WA_URL: 'https://wa.me/6282329483126',
        },
    ],
};

// ---------------------------------------------------------------------------
// SOCIAL – link & handle media sosial
// ---------------------------------------------------------------------------
export const SOCIAL = {
    INSTAGRAM_URL: '#',
    YOUTUBE_URL: '#',
    TIKTOK_URL: '#',

    /** Handle Instagram event */
    INSTAGRAM_HANDLE: '@lbbmuallimin',

    /** Handle TikTok / sekunder */
    TIKTOK_HANDLE: '@tontimuallimin',

    /** Teks gabungan handle yang ditampilkan di info section */
    HANDLES_DISPLAY: '@lbbmuallimin // @tontimuallimin',
};

// ---------------------------------------------------------------------------
// NAVBAR – perilaku navigasi saat scroll
// ---------------------------------------------------------------------------
export const NAVBAR = {
    /** Jarak scroll (px) sebelum navbar berubah jadi solid */
    SCROLL_SOLID_THRESHOLD: 20,

    /** Jarak scroll (px) sebelum sticky CTA muncul */
    STICKY_CTA_THRESHOLD: 600,

    /** Posisi bawah tombol WA saat sticky CTA muncul */
    WA_FAB_BOTTOM_SHIFTED: '90px',

    /** Posisi bawah tombol WA saat sticky CTA tersembunyi */
    WA_FAB_BOTTOM_DEFAULT: '24px',
};

// ---------------------------------------------------------------------------
// CLIPBOARD – tombol salin nomor rekening
// ---------------------------------------------------------------------------
export const CLIPBOARD = {
    /** Durasi (ms) sebelum tombol salin kembali ke tampilan awal */
    RESET_DELAY_MS: 2000,
};

// ---------------------------------------------------------------------------
// TABS – style tombol tab SD / SMP
// ---------------------------------------------------------------------------
export const TABS = {
    BASE_CLASS: 'flex-1 py-4 text-center transition-colors uppercase tracking-wider',
    ACTIVE_CLASS: 'bg-white text-lbb-red border-b-4 border-lbb-red font-black shadow-sm',
    INACTIVE_CLASS: 'text-zinc-400 bg-zinc-100 hover:text-zinc-600 font-bold border-b-0',
};

// ---------------------------------------------------------------------------
// COUNTDOWN – konfigurasi timer habis
// ---------------------------------------------------------------------------
export const COUNTDOWN = {
    /** CSS selector elemen yang diganti saat pendaftaran ditutup */
    EXPIRED_SELECTOR: '.flex.gap-3.text-slate-400',

    /** HTML yang ditampilkan saat pendaftaran ditutup */
    EXPIRED_HTML: "<span class='text-red-500 font-bold'>PENDAFTARAN DITUTUP</span>",
};
