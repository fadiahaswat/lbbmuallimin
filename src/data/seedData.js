/**
 * src/data/seedData.js
 * Master seed data untuk LBB Mu'allimin 2026
 * Berisi data realistis sekolah SD & SMP di DIY dengan berbagai status
 */

import logoImg from '../assets/logo-tonti.png';

export const INITIAL_SETTINGS = {
  registrationOpen: true,
  scoringOpen: true,
  announcementPublished: true, // Publikasi pengumuman hasil kejuaraan
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
    id: 'user-super-tonti',
    name: 'Tonti Muallimin 2026',
    email: 'tontimuallimin2026@gmail.com',
    role: 'superadmin',
    avatar: 'https://ui-avatars.com/api/?name=Tonti+Muallimin&background=881337&color=fbbf24&bold=true',
    roleLabel: 'Ketua Panitia (Superadmin)',
  },
];

// Helper untuk membuat susunan 25 personel standar
export function generatePersonnels(schoolName, jenjang, prefixName) {
  const danton = {
    id: 'p-danton',
    role: 'danton',
    name: `${prefixName} Pratama`,
    nisn: jenjang === 'SD' ? '0129384711' : '0098765411',
    class: jenjang === 'SD' ? 'VI A' : 'IX B',
    uniformSize: 'M',
    shoeSize: '39',
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
      name: `${prefixName} Anggota ${i}`,
      nisn: jenjang === 'SD' ? `01293847${10 + i}` : `00987654${10 + i}`,
      class: jenjang === 'SD' ? (i % 2 === 0 ? 'V B' : 'VI A') : (i % 2 === 0 ? 'VIII A' : 'IX C'),
    });
  }

  const cadangan = [
    { id: 'c-1', role: 'cadangan', name: `${prefixName} Cadangan 1`, nisn: jenjang === 'SD' ? '0129384791' : '0098765491', class: jenjang === 'SD' ? 'V A' : 'VIII C' },
    { id: 'c-2', role: 'cadangan', name: `${prefixName} Cadangan 2`, nisn: jenjang === 'SD' ? '0129384792' : '0098765492', class: jenjang === 'SD' ? 'V B' : 'VIII B' },
    { id: 'c-3', role: 'cadangan', name: `${prefixName} Cadangan 3`, nisn: jenjang === 'SD' ? '0129384793' : '0098765493', class: jenjang === 'SD' ? 'VI B' : 'VIII A' },
  ];

  const officials = [
    { id: 'o-1', role: 'pelatih1', name: `Bripka (Purn) Herman Sujono`, phone: '081223344551' },
    { id: 'o-2', role: 'pelatih2', name: `Kak Dian Permata, S.Pd.`, phone: '081223344552' },
    { id: 'o-3', role: 'dokumentasi', name: `Rizky Fauzan`, phone: '081223344553' },
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

