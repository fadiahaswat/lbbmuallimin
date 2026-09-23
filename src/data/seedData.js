/**
 * src/data/seedData.js
 * Master initial data untuk LBB Mu'allimin 2027
 * Data tim, nilai, staging, dan voting murni bersih (kosong) siap menerima data registrasi riil
 */

import logoImg from '../assets/logo-tonti.png';

export const INITIAL_SETTINGS = {
  registrationOpen: true,
  scoringOpen: true,
  announcementPublished: false, // Skor bersifat RAHASIA sampai dibuka resmi oleh Superadmin
  activeAcademicYear: '2027',
  quotaSD: 18,
  quotaSMP: 18,
  currentWave: 1, // Gelombang 1
  eventDates: {
    registrationStart: '2026-10-05T00:00:00+07:00',
    registrationDeadline: '2026-11-01T23:59:59+07:00',
    registrationRangeText: '5 Oktober – 1 November 2026',
    verificationRangeText: '2 – 8 November 2026',
    technicalMeetingDate: '10 Januari 2027',
    technicalMeetingTime: '13.00 WIB – Selesai',
    technicalMeetingFullDate: 'Sabtu, 10 Januari 2027',
    technicalMeetingVenue: "Kampus Induk Madrasah Mu'allimin Muhammadiyah Yogyakarta, Jalan Letjen S. Parman No. 68, Wirobrajan, Kota Yogyakarta, Daerah Istimewa Yogyakarta.",
    fieldTrialDate: '17 Januari 2027',
    fieldTrialTime: '08.00 – 13.30 WIB',
    fieldTrialFullDate: 'Minggu, 17 Januari 2027',
    competitionDate: 'Sabtu, 24 Januari 2027',
    competitionTimeRange: '06.00 WIB – 17.00 WIB',
  },
};

// Database pengguna resmi terotorisasi via Google Account:
// 1. Superadmin (Ketua Pelaksana / IT Master)
// 2. Admin (Sekretariat & Operasional Lomba)
// 3. Penginput (Operator Input Nilai Kertas Lapangan)
// 4. Verifikator (Pemeriksa Kesesuaian Nilai vs Bukti Foto)
// 5. Finalisator (Ketua Dewan Juri / Pengesah & Kunci Nilai Akhir)
export const INITIAL_USERS = [
  {
    id: 'user-super-tonti',
    name: 'Tonti Muallimin 2026',
    email: 'tontimuallimin2026@gmail.com',
    role: 'superadmin',
    avatar: 'https://ui-avatars.com/api/?name=Tonti+Muallimin&background=881337&color=fbbf24&bold=true',
    roleLabel: 'Ketua Panitia (Superadmin)',
  },
  {
    id: 'user-admin-andi',
    name: 'Andi Aqillah',
    email: 'andiaqillah@muallimin.sch.id',
    role: 'admin',
    avatar: 'https://ui-avatars.com/api/?name=Andi+Aqillah&background=0f172a&color=38bdf8&bold=true',
    roleLabel: 'Panitia Sekretariat (Admin)',
  },
  {
    id: 'user-staff-uny',
    name: 'Andi Aqillah (UNY)',
    email: 'andiaqillah.2018@student.uny.ac.id',
    role: 'admin',
    avatar: 'https://ui-avatars.com/api/?name=Andi+Aqillah&background=047857&color=ffffff&bold=true',
    roleLabel: 'Panitia Sekretariat & Staging',
  },
  {
    id: 'user-penginput-1',
    name: 'Petugas Penginput Nilai',
    email: 'penginput@lbbmuallimin.com',
    role: 'penginput',
    avatar: 'https://ui-avatars.com/api/?name=Penginput+Nilai&background=1e3a8a&color=93c5fd&bold=true',
    roleLabel: 'Operator Input Nilai Kertas',
  },
  {
    id: 'user-verifikator-1',
    name: 'Petugas Verifikator Nilai',
    email: 'verifikator@lbbmuallimin.com',
    role: 'verifikator',
    avatar: 'https://ui-avatars.com/api/?name=Verifikator+Nilai&background=065f46&color=6ee7b7&bold=true',
    roleLabel: 'Verifikator & Checker Nilai',
  },
  {
    id: 'user-finalisator-1',
    name: 'Ketua Dewan Juri (Finalisator)',
    email: 'finalisator@lbbmuallimin.com',
    role: 'finalisator',
    avatar: 'https://ui-avatars.com/api/?name=Finalisator+Juri&background=7c2d12&color=fdba74&bold=true',
    roleLabel: 'Finalisator & Pengesah Rekap Nilai',
  },
];

// Helper untuk membuat susunan 25 personel standar
export function generatePersonnels(schoolName, jenjang, prefixName, dantonName = '') {
  const danton = {
    id: 'p-danton',
    role: 'danton',
    name: dantonName ? dantonName.trim().toUpperCase() : '',
    nisn: '',
    class: '',
    birthPlace: '',
    birthDate: '',
    uniformSize: 'M',
    shoeSize: '39',
    photo: null,
  };

  const pasukan = [];
  for (let i = 1; i <= 21; i++) {
    const saf = Math.ceil(i / 7);
    const banjar = ((i - 1) % 7) + 1;
    pasukan.push({
      id: `p-${i}`,
      role: 'pasukan',
      safNumber: saf,
      banjarNumber: banjar,
      name: '',
      nisn: '',
      class: '',
      birthPlace: '',
      birthDate: '',
      photo: null,
    });
  }

  const cadangan = [
    { id: 'c-1', role: 'cadangan', name: '', nisn: '', class: '', birthPlace: '', birthDate: '', photo: null },
    { id: 'c-2', role: 'cadangan', name: '', nisn: '', class: '', birthPlace: '', birthDate: '', photo: null },
    { id: 'c-3', role: 'cadangan', name: '', nisn: '', class: '', birthPlace: '', birthDate: '', photo: null },
  ];

  // Tim Official: Maksimal 2, tidak terisi otomatis (kosong untuk diisi mandiri)
  const officials = [
    { id: 'o-1', role: 'Pembina / Pelatih 1', name: '', phone: '', photo: null },
    { id: 'o-2', role: 'Pembina / Pelatih 2', name: '', phone: '', photo: null },
  ];

  return { danton, pasukan, cadangan, officials };
}

// Data tim/peserta awal (kosong - siap menerima pendaftaran real)
export const INITIAL_TEAMS = [];

// Data nilai awal (kosong)
export const INITIAL_SCORES = {};

// INITIAL_STAGING: Data alur lapangan & antrean pleton (kosong)
export const INITIAL_STAGING = {};

// INITIAL_VOTES: Data perolehan suara suporter online (kosong)
export const INITIAL_VOTES = {};

