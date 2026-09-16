/**
 * src/data/seedData.js
 * Master initial data untuk LBB Mu'allimin 2026
 * Data tim, nilai, staging, dan voting murni bersih (kosong) siap menerima data registrasi riil
 */

import logoImg from '../assets/logo-tonti.png';

export const INITIAL_SETTINGS = {
  registrationOpen: true,
  scoringOpen: true,
  announcementPublished: false, // Skor bersifat RAHASIA sampai dibuka resmi oleh Superadmin
  activeAcademicYear: '2026',
  quotaSD: 18,
  quotaSMP: 18,
  currentWave: 1, // Gelombang 1
};

export const INITIAL_PINS = {
  admin: 'admin2026',
  juri: 'juri2026',
  superadmin: 'super2026',
};

// Database pengguna resmi:
// Admin: andiaqillah@muallimin.sch.id
// Superadmin: tontimuallimin2026@gmail.com
export const INITIAL_USERS = [
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
    roleLabel: 'Panitia & Juri Penilai',
  },
  {
    id: 'user-super-tonti',
    name: 'Tonti Muallimin 2026',
    email: 'tontimuallimin2026@gmail.com',
    role: 'superadmin',
    avatar: 'https://ui-avatars.com/api/?name=Tonti+Muallimin&background=881337&color=fbbf24&bold=true',
    roleLabel: 'Ketua Panitia (Superadmin)',
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

