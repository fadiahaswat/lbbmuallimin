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

// Database pengguna awal: email dipetakan ke role (admin, juri, superadmin)
export const INITIAL_USERS = [
  {
    id: 'user-admin',
    name: 'Kak Rusyda (Sekretariat)',
    email: 'admin@lbbmuallimin.com',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces',
    roleLabel: 'Panitia Sekretariat',
  },
  {
    id: 'user-juri',
    name: 'Mayor (Mar) Bambang S., S.E.',
    email: 'juri@lbbmuallimin.com',
    role: 'juri',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces',
    roleLabel: 'Dewan Juri Utama',
  },
  {
    id: 'user-super',
    name: 'Falhan Zuhdi Mubarok',
    email: 'ketua@lbbmuallimin.com',
    role: 'superadmin',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=faces',
    roleLabel: 'Ketua Panitia',
  },
  {
    id: 'user-fadia',
    name: 'Andi Aqillah Fadia Haswat',
    email: 'andiaqillahfadiahaswat@gmail.com',
    role: 'superadmin',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=faces',
    googleAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=faces',
    roleLabel: 'Ketua Panitia / Administrator',
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

