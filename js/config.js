/**
 * config.js
 * =========
 * SATU-SATUNYA FILE YANG PERLU DIUBAH untuk memperbarui konten website.
 *
 * Bagian yang sering berubah:
 *  - EVENT   → tanggal pendaftaran, hari-H, technical meeting
 *  - VENUE   → lokasi & link Google Maps
 *  - COMPETITION → jumlah peleton, komposisi personel
 *  - ACHIEVEMENTS → daftar prestasi panitia
 *  - PAYMENT → rekening, biaya pendaftaran
 *  - CONTACT → kontak panitia (WA, email, telepon)
 *  - SOCIAL  → link media sosial
 *  - NAVBAR / CLIPBOARD / TABS / COUNTDOWN → perilaku UI
 */

// ---------------------------------------------------------------------------
// EVENT – semua tanggal & waktu kegiatan
// ---------------------------------------------------------------------------
export const EVENT = {
    YEAR: '2026',

    /** Teks badge di hero (contoh: "Open Reg: 14 - 28 Juli 2026") */
    REGISTRATION_BADGE: 'Open Reg: 14 - 28 Juli 2026',

    /** Rentang pendaftaran daring */
    REGISTRATION_RANGE: '14 – 28 Juli 2026',

    /** Rentang verifikasi berkas oleh panitia */
    VERIFICATION_RANGE: '15 – 29 Juli 2026',

    /** Tanggal batas akhir pendaftaran – dipakai countdown timer */
    REGISTRATION_DEADLINE: 'July 28, 2026 23:59:59',

    /** Tanggal Technical Meeting */
    TECHNICAL_MEETING_DATE: '3 Agustus 2026',

    /** Waktu Technical Meeting */
    TECHNICAL_MEETING_TIME: '08.00 WIB - Selesai',

    /** Hari & tanggal hari-H */
    COMPETITION_DATE: 'Sabtu, 6 September 2026',

    /** Rentang waktu hari-H */
    COMPETITION_TIME_RANGE: '06.00 WIB – 17.00 WIB',

    /** Jam mulai hari-H (untuk teks "Mulai 06.00 WIB") */
    COMPETITION_TIME_START_LABEL: 'Mulai 06.00 WIB',
};

// ---------------------------------------------------------------------------
// VENUE – lokasi pelaksanaan
// ---------------------------------------------------------------------------
export const VENUE = {
    NAME: "Kampus Terpadu Madrasah Mu'allimin",

    /** Alamat lengkap yang tampil di kartu lokasi */
    ADDRESS: 'Bandut Lor, Argorejo, Sedayu, Kabupaten Bantul, Daerah Istimewa Yogyakarta, 55752.',

    /** Alamat singkat untuk footer */
    SHORT_ADDRESS: 'Jl. Bantul Km 3, Yogyakarta',

    /** URL Google Maps – ganti dengan link Maps yang benar */
    MAPS_URL: 'https://goo.gl/maps/placeholder',
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
    '🏆 Juara Umum LBB Prayata 2024',
    '🏆 Juara Umum LKBB Bela Negara',
    '🏆 Piala Walikota Yogyakarta',
];

// ---------------------------------------------------------------------------
// PAYMENT – data rekening & biaya
// ---------------------------------------------------------------------------
export const PAYMENT = {
    /** Nomor rekening – dipakai clipboard.js */
    ACCOUNT_NUMBER: '300701003561505',

    ACCOUNT_NAME: 'FALHAN ZUHDI MUBAROK',
    BANK_NAME: 'BRI',

    /** Teks biaya yang tampil di UI (tanpa "Rp") */
    FEE_DISPLAY: '350.000',

    /** Keterangan format berita transfer */
    TRANSFER_NOTE_FORMAT: 'NAMA SEKOLAH_JUMLAH PELETON',

    REFUNDABLE: false,
};

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
            PHONE_DISPLAY: '0853-1420-9369',
            WA_URL: 'https://wa.me/6285314209369',
        },
        {
            NAME: 'Kak Dandi',
            PHONE_DISPLAY: '0823-2948-3126',
            WA_URL: 'https://wa.me/6282329483126',
        },
    ],
};

// ---------------------------------------------------------------------------
// SOCIAL – link media sosial
// ---------------------------------------------------------------------------
export const SOCIAL = {
    INSTAGRAM_URL: '#',
    YOUTUBE_URL: '#',
    TIKTOK_URL: '#',
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
