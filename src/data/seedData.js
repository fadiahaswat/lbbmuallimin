/**
 * src/data/seedData.js
 * Master seed data untuk LBB Mu'allimin 2026
 * Berisi data realistis sekolah SD & SMP di DIY dengan berbagai status
 */

export const INITIAL_SETTINGS = {
  registrationOpen: true,
  scoringOpen: true,
  announcementPublished: true, // Hasil sudah dapat dilihat publik untuk demo awal
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

// Database pengguna awal: email dipetakan ke role (admin, juri, superadmin, peserta)
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
    id: 'user-smp1',
    name: 'Dian Permata (SMPN 1 YK)',
    email: 'smpn1yk.tonti@gmail.com',
    role: 'peserta',
    teamId: 'TEAM-SMP-01',
    schoolName: 'SMP Negeri 1 Yogyakarta',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces',
    roleLabel: 'Official Peserta',
  },
  {
    id: 'user-sapen',
    name: 'Bambang Irawan (SD Sapen)',
    email: 'sdmsapen.yk@gmail.com',
    role: 'peserta',
    teamId: 'TEAM-SD-01',
    schoolName: 'SD Muhammadiyah Sapen Yogyakarta',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=faces',
    roleLabel: 'Official Peserta',
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

export const INITIAL_TEAMS = [
  // 1. SMPN 1 Yogyakarta (Terverifikasi, No Undian 03 SMP, Sudah ada Nilai Juri)
  {
    id: 'TEAM-SMP-01',
    regCode: 'LBB26-SMP-001',
    schoolName: 'SMP Negeri 1 Yogyakarta',
    jenjang: 'SMP',
    category: 'Putra',
    platoonName: 'Pleton Satria Utama',
    coachName: 'Dian Permata, S.Pd.',
    waNumber: '081223344552',
    email: 'smpn1yk.tonti@gmail.com',
    address: 'Jl. Cik Di Tiro No. 29, Terban, Gondokusuman, Kota Yogyakarta',
    status: 'verified', // 'pending' | 'verified' | 'revision' | 'rejected'
    lotNumber: 3, // Nomor Undian TM
    drawTime: '2026-10-23T14:15:00+07:00',
    registeredAt: '2026-09-14T08:30:00+07:00',
    wave: 1,
    feeAmount: 450000,
    paymentStatus: 'paid', // 'unpaid' | 'paid'
    files: {
      recommendationLetter: { name: 'Surat_Rekomendasi_SMPN1.pdf', uploadedAt: '2026-09-14T08:35:00+07:00', url: '#' },
      paymentProof: { name: 'Bukti_Transfer_BRI_450rb.jpg', uploadedAt: '2026-09-14T08:36:00+07:00', url: '#' },
      personnelPhotos: { name: 'Pasfoto_SMPN1_25Personil.zip', uploadedAt: '2026-09-14T08:38:00+07:00', url: '#' },
      schoolLogo: { name: 'Logo_SMPN1_YK.png', uploadedAt: '2026-09-14T08:38:00+07:00', url: '#' },
    },
    revisionNote: '',
    roster: generatePersonnels('SMP Negeri 1 Yogyakarta', 'SMP', 'Satria'),
  },

  // 2. SMP Muhammadiyah 2 Yogyakarta (Terverifikasi, No Undian 07 SMP, Sudah dinilai)
  {
    id: 'TEAM-SMP-02',
    regCode: 'LBB26-SMP-002',
    schoolName: 'SMP Muhammadiyah 2 Yogyakarta',
    jenjang: 'SMP',
    category: 'Putri',
    platoonName: 'Pleton Laskar Melati',
    coachName: 'Ustadz Ahmad Fauzi, M.Pd.',
    waNumber: '081398765432',
    email: 'mucil.jogja@gmail.com',
    address: 'Jl. Kapas II No. 7A, Semaki, Umbulharjo, Kota Yogyakarta',
    status: 'verified',
    lotNumber: 7,
    drawTime: '2026-10-23T14:35:00+07:00',
    registeredAt: '2026-09-15T09:15:00+07:00',
    wave: 1,
    feeAmount: 450000,
    paymentStatus: 'paid',
    files: {
      recommendationLetter: { name: 'Surat_Kepsek_Mucil.pdf', uploadedAt: '2026-09-15T09:20:00+07:00', url: '#' },
      paymentProof: { name: 'Bukti_BRI_Mucil.jpg', uploadedAt: '2026-09-15T09:21:00+07:00', url: '#' },
      personnelPhotos: { name: 'Pasfoto_Mucil_Putri.zip', uploadedAt: '2026-09-15T09:22:00+07:00', url: '#' },
      schoolLogo: { name: 'Logo_Mucil.png', uploadedAt: '2026-09-15T09:23:00+07:00', url: '#' },
    },
    revisionNote: '',
    roster: generatePersonnels('SMP Muhammadiyah 2 Yogyakarta', 'SMP', 'Aisyah'),
  },

  // 3. MTsN 1 Yogyakarta (Terverifikasi, No Undian 01 SMP)
  {
    id: 'TEAM-SMP-03',
    regCode: 'LBB26-SMP-003',
    schoolName: 'MTs Negeri 1 Yogyakarta',
    jenjang: 'SMP',
    category: 'Campuran',
    platoonName: 'Garuda Matsayo',
    coachName: 'Fajar Nugroho, S.Pd.I.',
    waNumber: '085712345678',
    email: 'mtsn1yk@kemenag.go.id',
    address: 'Jl. Mandarakan No. 46, Kotagede, Kota Yogyakarta',
    status: 'verified',
    lotNumber: 1,
    drawTime: '2026-10-23T14:10:00+07:00',
    registeredAt: '2026-09-16T11:00:00+07:00',
    wave: 1,
    feeAmount: 450000,
    paymentStatus: 'paid',
    files: {
      recommendationLetter: { name: 'Surat_Rekom_MTsN1.pdf', uploadedAt: '2026-09-16T11:05:00+07:00', url: '#' },
      paymentProof: { name: 'Bukti_Transfer_450k.png', uploadedAt: '2026-09-16T11:06:00+07:00', url: '#' },
      personnelPhotos: { name: 'Pasfoto_Matsayo.zip', uploadedAt: '2026-09-16T11:08:00+07:00', url: '#' },
      schoolLogo: { name: 'Logo_MTsN1.png', uploadedAt: '2026-09-16T11:09:00+07:00', url: '#' },
    },
    revisionNote: '',
    roster: generatePersonnels('MTs Negeri 1 Yogyakarta', 'SMP', 'Fajar'),
  },

  // 4. SMPN 5 Yogyakarta (Menunggu Verifikasi)
  {
    id: 'TEAM-SMP-04',
    regCode: 'LBB26-SMP-004',
    schoolName: 'SMP Negeri 5 Yogyakarta',
    jenjang: 'SMP',
    category: 'Putra',
    platoonName: 'Bhayangkara Pawiyatan',
    coachName: 'Tri Haryanto, S.Pd.',
    waNumber: '082133445566',
    email: 'tonti.pawiyatan5@gmail.com',
    address: 'Jl. Wardhani No. 1, Kotabaru, Gondokusuman, Kota Yogyakarta',
    status: 'pending',
    lotNumber: null,
    drawTime: null,
    registeredAt: '2026-09-17T15:20:00+07:00',
    wave: 1,
    feeAmount: 450000,
    paymentStatus: 'paid',
    files: {
      recommendationLetter: { name: 'Rekomendasi_SMPN5.pdf', uploadedAt: '2026-09-17T15:25:00+07:00', url: '#' },
      paymentProof: { name: 'Struk_ATM_450000.jpg', uploadedAt: '2026-09-17T15:26:00+07:00', url: '#' },
      personnelPhotos: { name: 'Foto_Personel_SMP5.zip', uploadedAt: '2026-09-17T15:27:00+07:00', url: '#' },
      schoolLogo: { name: 'Logo_SMP5.png', uploadedAt: '2026-09-17T15:28:00+07:00', url: '#' },
    },
    revisionNote: '',
    roster: generatePersonnels('SMP Negeri 5 Yogyakarta', 'SMP', 'Bhayangkara'),
  },

  // 5. SD Muhammadiyah Sapen (Terverifikasi, No Undian 04 SD, Sudah Dinilai)
  {
    id: 'TEAM-SD-01',
    regCode: 'LBB26-SD-001',
    schoolName: 'SD Muhammadiyah Sapen Yogyakarta',
    jenjang: 'SD',
    category: 'Campuran',
    platoonName: 'Duta Sapen Hebat',
    coachName: 'Bambang Irawan, S.Pd.Jas.',
    waNumber: '081299887766',
    email: 'sdmsapen.yk@gmail.com',
    address: 'Jl. Bimo Kurdo No. 33, Demangan, Gondokusuman, Kota Yogyakarta',
    status: 'verified',
    lotNumber: 4,
    drawTime: '2026-10-23T13:40:00+07:00',
    registeredAt: '2026-09-14T10:00:00+07:00',
    wave: 1,
    feeAmount: 450000,
    paymentStatus: 'paid',
    files: {
      recommendationLetter: { name: 'Surat_Rekom_Sapen.pdf', uploadedAt: '2026-09-14T10:05:00+07:00', url: '#' },
      paymentProof: { name: 'Bukti_Transfer_BRI_Sapen.jpg', uploadedAt: '2026-09-14T10:06:00+07:00', url: '#' },
      personnelPhotos: { name: 'Pasfoto_Sapen_SD.zip', uploadedAt: '2026-09-14T10:07:00+07:00', url: '#' },
      schoolLogo: { name: 'Logo_Sapen.png', uploadedAt: '2026-09-14T10:08:00+07:00', url: '#' },
    },
    revisionNote: '',
    roster: generatePersonnels('SD Muhammadiyah Sapen', 'SD', 'Sapen'),
  },

  // 6. SDN Ungaran 1 Yogyakarta (Terverifikasi, No Undian 02 SD, Sudah Dinilai)
  {
    id: 'TEAM-SD-02',
    regCode: 'LBB26-SD-002',
    schoolName: 'SD Negeri Ungaran 1 Yogyakarta',
    jenjang: 'SD',
    category: 'Putra',
    platoonName: 'Ksatria Ungaran',
    coachName: 'Wahyu Nugroho, S.Or.',
    waNumber: '087812344321',
    email: 'sdnungaran1.yk@gmail.com',
    address: 'Jl. Ungaran No. 1, Kotabaru, Gondokusuman, Kota Yogyakarta',
    status: 'verified',
    lotNumber: 2,
    drawTime: '2026-10-23T13:30:00+07:00',
    registeredAt: '2026-09-15T14:00:00+07:00',
    wave: 1,
    feeAmount: 450000,
    paymentStatus: 'paid',
    files: {
      recommendationLetter: { name: 'Surat_Kepsek_Ungaran1.pdf', uploadedAt: '2026-09-15T14:05:00+07:00', url: '#' },
      paymentProof: { name: 'Bukti_Bayar_BRI.jpg', uploadedAt: '2026-09-15T14:06:00+07:00', url: '#' },
      personnelPhotos: { name: 'Pasfoto_Ksatria.zip', uploadedAt: '2026-09-15T14:07:00+07:00', url: '#' },
      schoolLogo: { name: 'Logo_Ungaran.png', uploadedAt: '2026-09-15T14:08:00+07:00', url: '#' },
    },
    revisionNote: '',
    roster: generatePersonnels('SD Negeri Ungaran 1', 'SD', 'Ungaran'),
  },

  // 7. SDN Percobaan 2 Sleman (Perlu Revisi Berkas)
  {
    id: 'TEAM-SD-03',
    regCode: 'LBB26-SD-003',
    schoolName: 'SD Negeri Percobaan 2 Sleman',
    jenjang: 'SD',
    category: 'Campuran',
    platoonName: 'Garuda Muda Percobaan',
    coachName: 'Endah Sulistyowati, M.Pd.',
    waNumber: '081566778899',
    email: 'sdnperco2sleman@yahoo.com',
    address: 'Sekip Kolombo, Caturtunggal, Depok, Sleman, DIY',
    status: 'revision',
    lotNumber: null,
    drawTime: null,
    registeredAt: '2026-09-16T16:45:00+07:00',
    wave: 1,
    feeAmount: 450000,
    paymentStatus: 'paid',
    files: {
      recommendationLetter: { name: 'Surat_Rekom_Buram.jpg', uploadedAt: '2026-09-16T16:50:00+07:00', url: '#' },
      paymentProof: { name: 'Struk_Mbanking.jpg', uploadedAt: '2026-09-16T16:51:00+07:00', url: '#' },
      personnelPhotos: { name: 'Foto_Percobaan.zip', uploadedAt: '2026-09-16T16:52:00+07:00', url: '#' },
      schoolLogo: { name: 'Logo_Percobaan2.png', uploadedAt: '2026-09-16T16:53:00+07:00', url: '#' },
    },
    revisionNote: 'Surat Rekomendasi Kepala Sekolah tidak terlihat jelas stempel dinasnya. Mohon scan ulang dalam format PDF resolusi tinggi.',
    roster: generatePersonnels('SD Negeri Percobaan 2', 'SD', 'Garuda'),
  },

  // 8. SD Muhammadiyah Sukonandi (Pending)
  {
    id: 'TEAM-SD-04',
    regCode: 'LBB26-SD-004',
    schoolName: 'SD Muhammadiyah Sukonandi',
    jenjang: 'SD',
    category: 'Putri',
    platoonName: 'Srikandi Sukonandi',
    coachName: 'Anas Mustofa, S.Pd.',
    waNumber: '081299881122',
    email: 'sdmsukonandi@gmail.com',
    address: 'Jl. Sukonandi No. 1, Semaki, Umbulharjo, Kota Yogyakarta',
    status: 'pending',
    lotNumber: null,
    drawTime: null,
    registeredAt: '2026-09-17T09:30:00+07:00',
    wave: 1,
    feeAmount: 450000,
    paymentStatus: 'paid',
    files: {
      recommendationLetter: { name: 'Surat_Kepala_Sekolah.pdf', uploadedAt: '2026-09-17T09:35:00+07:00', url: '#' },
      paymentProof: { name: 'Bukti_Transfer_BRI_Falhan.jpg', uploadedAt: '2026-09-17T09:36:00+07:00', url: '#' },
      personnelPhotos: { name: 'Foto_25_Personil.zip', uploadedAt: '2026-09-17T09:37:00+07:00', url: '#' },
      schoolLogo: { name: 'Logo_Sukonandi.png', uploadedAt: '2026-09-17T09:38:00+07:00', url: '#' },
    },
    revisionNote: '',
    roster: generatePersonnels('SD Muhammadiyah Sukonandi', 'SD', 'Srikandi'),
  },
];

export const INITIAL_SCORES = {
  'TEAM-SMP-01': {
    teamId: 'TEAM-SMP-01',
    juryName: 'Mayor (Mar) Bambang S., S.E.',
    juryRole: 'Juri Utama (TNI/Polri)',
    scoredAt: '2026-11-08T09:30:00+07:00',
    danton: {
      penguasaan: 88,
      vokal: 86,
      sikap: 88,
      lapangan: 86,
      total: 87.1,
    },
    pbb: {
      teknik: 88,
      kekompakan: 86,
      total: 87.4,
    },
    penalties: {
      upacara: false,
      dp1: false,
      personelKurang: false,
      overTimeBlocks: 0,
      injakGarisCount: 0,
      penyesuaianCount: 0,
      totalPenalty: 0,
    },
    finalScore: 174.5,
    notes: 'Penampilan sangat prima, artikulasi danton mantap, kerapian barisan sangat solid.',
  },
  'TEAM-SMP-02': {
    teamId: 'TEAM-SMP-02',
    juryName: 'Mayor (Mar) Bambang S., S.E.',
    juryRole: 'Juri Utama (TNI/Polri)',
    scoredAt: '2026-11-08T11:00:00+07:00',
    danton: {
      penguasaan: 84,
      vokal: 84,
      sikap: 82,
      lapangan: 82,
      total: 83.2,
    },
    pbb: {
      teknik: 84,
      kekompakan: 82,
      total: 83.4,
    },
    penalties: {
      upacara: false,
      dp1: false,
      personelKurang: false,
      overTimeBlocks: 0,
      injakGarisCount: 1,
      penyesuaianCount: 0,
      totalPenalty: 50,
    },
    finalScore: 116.6,
    notes: 'Kekompakan baik, sempat 1 kali personil di banjar kiri menginjak garis arena.',
  },
  'TEAM-SMP-03': {
    teamId: 'TEAM-SMP-03',
    juryName: 'Mayor (Mar) Bambang S., S.E.',
    juryRole: 'Juri Utama (TNI/Polri)',
    scoredAt: '2026-11-08T08:15:00+07:00',
    danton: {
      penguasaan: 86,
      vokal: 84,
      sikap: 84,
      lapangan: 84,
      total: 84.7,
    },
    pbb: {
      teknik: 86,
      kekompakan: 84,
      total: 85.4,
    },
    penalties: {
      upacara: false,
      dp1: false,
      personelKurang: false,
      overTimeBlocks: 0,
      injakGarisCount: 0,
      penyesuaianCount: 0,
      totalPenalty: 0,
    },
    finalScore: 170.1,
    notes: 'Langkah tegap bertenaga, transisi gerakan variasi sangat dinamis.',
  },
  'TEAM-SD-01': {
    teamId: 'TEAM-SD-01',
    juryName: 'Kapten Inf. Hendro Purnomo',
    juryRole: 'Juri Lapangan SD',
    scoredAt: '2026-11-08T09:45:00+07:00',
    danton: {
      penguasaan: 88,
      vokal: 86,
      sikap: 86,
      lapangan: 86,
      total: 86.7,
    },
    pbb: {
      teknik: 86,
      kekompakan: 88,
      total: 86.6,
    },
    penalties: {
      upacara: false,
      dp1: false,
      personelKurang: false,
      overTimeBlocks: 0,
      injakGarisCount: 0,
      penyesuaianCount: 0,
      totalPenalty: 0,
    },
    finalScore: 173.3,
    notes: 'Kekompakan tingkat SD luar biasa, penghormatan dan laporan danton sangat mantap.',
  },
  'TEAM-SD-02': {
    teamId: 'TEAM-SD-02',
    juryName: 'Kapten Inf. Hendro Purnomo',
    juryRole: 'Juri Lapangan SD',
    scoredAt: '2026-11-08T08:50:00+07:00',
    danton: {
      penguasaan: 84,
      vokal: 82,
      sikap: 84,
      lapangan: 82,
      total: 83.1,
    },
    pbb: {
      teknik: 84,
      kekompakan: 84,
      total: 84.0,
    },
    penalties: {
      upacara: false,
      dp1: false,
      personelKurang: false,
      overTimeBlocks: 0,
      injakGarisCount: 0,
      penyesuaianCount: 0,
      totalPenalty: 0,
    },
    finalScore: 167.1,
    notes: 'Gerakan dasar rapi, aba-aba danton terdengar jelas.',
  },
};
