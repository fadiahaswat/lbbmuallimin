/**
 * src/data/dummyTestingData.js
 * Master Dataset Dummy Testing Lengkap untuk Lingkungan Localhost & Superadmin
 * Berisi 18 Peleton SD/MI dan 18 Peleton SMP/MTs (Total 36 Peleton)
 * Lengkap dengan Danton, 21 Pasukan Inti, 3 Cadangan, 3 Official, Berkas Sah, dan Siap Diuji.
 */

const SD_SCHOOL_PROFILES = [
  { name: 'SD Muhammadiyah Sapen Yogyakarta', danton: 'M. Fadhil Arkananta', platoon: 'Peleton Singo Menggolo', official: 'Drs. Hendro Wibowo', category: 'Homogen Putra' },
  { name: 'SD Muhammadiyah Sukonandi Yogyakarta', danton: 'Raditya Bagas Prakoso', platoon: 'Peleton Ki Ageng Pemanahan', official: 'Ahmad Sofyan, S.Pd.', category: 'Homogen Putra' },
  { name: "MI Mu'allimin Muhammadiyah Yogyakarta", danton: 'Devga Aulia Rahman', platoon: "Peleton Pasukan Inti Mu'allimin", official: 'Ust. Nurul Huda, S.Pd.I.', category: 'Homogen Putra' },
  { name: 'MIN 1 Yogyakarta', danton: 'Ahmad Rayhan Al-Fatih', platoon: 'Peleton Al-Fatih Pratama', official: 'Rahmat Basuki, S.Pd.', category: 'Homogen Putra' },
  { name: 'SD Muhammadiyah Condongcatur Sleman', danton: 'Arya Bima Sakti', platoon: 'Peleton Cakra Baskara', official: 'Budi Santoso, M.Pd.', category: 'Homogen Putra' },
  { name: 'SD Tarakanita Bumijo Yogyakarta', danton: 'Gregorius Kevin Pratama', platoon: 'Peleton Pandawa Tarakanita', official: 'Antonius Joko, S.Pd.', category: 'Campuran' },
  { name: 'SD Muhammadiyah Karanganyar', danton: 'Dimas Wahyu Utomo', platoon: 'Peleton Satria Karanganyar', official: 'Eko Prasetyo, S.Pd.', category: 'Homogen Putra' },
  { name: 'SD Muhammadiyah Suronatan Yogyakarta', danton: 'Hanif Raihan Nugroho', platoon: 'Peleton Laskar Suronatan', official: 'Drs. Maryanto', category: 'Homogen Putra' },
  { name: 'SD Negeri Ungaran 1 Yogyakarta', danton: 'Farhan Maulana Yusuf', platoon: 'Peleton Kusuma Bangsa Ungaran', official: 'Siti Aminah, M.Pd.', category: 'Campuran' },
  { name: 'MIN 2 Sleman', danton: 'Naufal Zhafran Rabbani', platoon: 'Peleton Bintang Sembilan MIN 2', official: 'Ikhsanudin, S.Ag.', category: 'Homogen Putra' },
  { name: 'SD Islam Al Azhar 31 Yogyakarta', danton: 'Muhammad Azka Al-Ghifari', platoon: 'Peleton Laskar Al Azhar', official: 'Zainal Arifin, S.Pd.', category: 'Homogen Putra' },
  { name: 'SD Muhammadiyah Wirobrajan 3', danton: 'Rizky Ilham Pratama', platoon: 'Peleton Senopati Wirobrajan', official: 'Wawan Hermawan, S.Pd.', category: 'Homogen Putra' },
  { name: 'SD Muhammadiyah Notoprajan Yogyakarta', danton: 'Aditia Surya Kusuma', platoon: 'Peleton Gajah Mada Notoprajan', official: 'Agus Salim, M.Pd.', category: 'Homogen Putra' },
  { name: 'SD Negeri Percobaan 2 Sleman', danton: 'Bintang Putra Ramadhan', platoon: 'Peleton Elang Percobaan 2', official: 'Tri Wahyuni, S.Pd.', category: 'Campuran' },
  { name: 'SD Muhammadiyah Bantul Kota', danton: 'Fauzan Dwi Ananta', platoon: 'Peleton Wira Kartika Bantul', official: 'Bambang Supriyanto, S.Pd.', category: 'Homogen Putra' },
  { name: 'MI Al-Islam Grobagan Surakarta', danton: 'Wildan Firdaus Hakim', platoon: 'Peleton Sang Pencerah Grobagan', official: 'Sulaiman, S.Pd.I.', category: 'Homogen Putra' },
  { name: 'MI Muhammadiyah Karangkajen Yogyakarta', danton: 'Gilang Ramadhan Saputra', platoon: 'Peleton Satria Karangkajen', official: 'Drs. M. Taufiq', category: 'Homogen Putra' },
  { name: 'SD Muhammadiyah Kleco Yogyakarta', danton: 'Danendra Putra Wicaksana', platoon: 'Peleton Rajawali Kleco', official: 'Yulianto, S.Pd.', category: 'Homogen Putra' },
];

const SMP_SCHOOL_PROFILES = [
  { name: "MTs Mu'allimin Muhammadiyah Yogyakarta", danton: 'M. Haikal Firjatullah', platoon: "Tonti Mu'allimin Jaya", official: 'Ust. Zulfikar, S.Pd.', category: 'Homogen Putra' },
  { name: "MTs Mu'allimaat Muhammadiyah Yogyakarta", danton: 'Syarifah Aini Nurul Huda', platoon: "Tonti Mu'allimaat Hebat", official: 'Usth. Anisa Rahma, S.Pd.', category: 'Homogen Putri' },
  { name: 'SMP Negeri 5 Yogyakarta', danton: 'Daffa Raditya Kusuma', platoon: 'Satria Pawiyatan Teladan', official: 'Haryanto, M.Pd.', category: 'Homogen Putra' },
  { name: 'SMP Negeri 8 Yogyakarta', danton: 'Zhafran Akmal Syarif', platoon: 'Bhayangkara Delapan', official: 'Sunaryo, S.Pd.', category: 'Homogen Putra' },
  { name: 'SMP Muhammadiyah 2 Yogyakarta', danton: 'Farrel Danendra Wicaksono', platoon: 'Pasukan Muchild Sakti', official: 'Roni Wijaya, S.Pd.', category: 'Homogen Putra' },
  { name: 'MTsN 1 Kota Yogyakarta', danton: 'Hafizh Syahputra Ramadhan', platoon: 'Garuda Matsayo', official: 'Abdul Rozak, M.Pd.I.', category: 'Homogen Putra' },
  { name: 'SMP Negeri 1 Yogyakarta', danton: 'Daniswara Satria Wibawa', platoon: 'Laskar Satria Spensa', official: 'Drs. Subagyo, M.Pd.', category: 'Homogen Putra' },
  { name: 'SMP Muhammadiyah 3 Depok Sleman', danton: 'Ibnu Sina Al-Habsyi', platoon: 'Kresna Mugadeta Depok', official: 'Fajar Nugroho, S.Pd.', category: 'Homogen Putra' },
  { name: 'SMP Negeri 2 Bantul', danton: 'Aditya Ryan Pratama', platoon: 'Singa Barong Espero', official: 'Supriyanto, S.Pd.', category: 'Homogen Putra' },
  { name: 'SMP Islam Al Azhar 26 Yogyakarta', danton: 'M. Kenzie Alvaro', platoon: 'Al Azhar Satria Nusantara', official: 'Aris Munandar, S.Pd.', category: 'Homogen Putra' },
  { name: 'MTs Muhammadiyah Karangkajen', danton: 'Rayhan Fadlullah', platoon: 'Elang Sakti Muhkar', official: 'Drs. Syamsuddin', category: 'Homogen Putra' },
  { name: 'SMP Muhammadiyah 1 Yogyakarta', danton: 'Fathan Nur Hidayat', platoon: 'Pasukan Inti Moehi', official: 'Teguh Wibowo, S.Pd.', category: 'Homogen Putra' },
  { name: 'MTsN 2 Sleman', danton: 'Fauzul Adhim', platoon: 'Matsanda Bima Sakti', official: 'Mahmudin, M.Pd.I.', category: 'Homogen Putra' },
  { name: 'SMP Negeri 1 Kalasan Sleman', danton: 'Andhika Prasetya Utama', platoon: 'Pasukan Prambanan Spensaka', official: 'Drs. Joko Suwito', category: 'Homogen Putra' },
  { name: 'SMP Muhammadiyah 7 Yogyakarta', danton: 'Iqbal Maulana', platoon: 'Satria Mutu Kotagede', official: 'Arif Hidayat, S.Pd.', category: 'Homogen Putra' },
  { name: 'MTs PPMI Assalaam Sukoharjo', danton: 'Dzaky Anshari Robbani', platoon: 'Laskar Santri Assalaam', official: 'Ust. Marwan, S.Ag.', category: 'Homogen Putra' },
  { name: 'SMP Negeri 6 Yogyakarta', danton: 'Bagus Purnomo Aji', platoon: 'Satria Taruna Enam', official: 'Budi Raharjo, S.Pd.', category: 'Homogen Putra' },
  { name: 'SMP Muhammadiyah Al Mujahidin Gunungkidul', danton: 'Rizqullah Al-Fariq', platoon: 'Wira Mujahidin Handayani', official: 'Triyono, S.Pd.', category: 'Homogen Putra' },
];

const PASUKAN_NAMES_POOL = [
  'Bagas Pratama', 'Rian Hidayat', 'Fajar Ramadhan', 'Dwi Cahyo', 'Eko Prasetyo',
  'Aldo Fernando', 'Bayu Anggoro', 'Gilang Pratama', 'Irfan Hakim', 'Dimas Arya',
  'Fikri Haikal', 'Rizky Kurnia', 'Ilham Maulana', 'Hafiz Al-Farisi', 'Yoga Pratama',
  'Satria Yudha', 'Rangga Wijaya', 'Gavin Al-Ghazali', 'Arkan Danendra', 'Naufal Rafi',
  'Fauzan Ardiansyah', 'Zidan Syaputra', 'Danu Tirta', 'Kevin Andreas', 'Fahrur Rozi'
];

/**
 * Membuat data roster lengkap 25 orang (1 Danton + 21 Pasukan + 3 Cadangan + 3 Official)
 */
function createFullRoster(schoolName, jenjang, dantonName, officialName) {
  const isSD = jenjang === 'SD';
  const classGrade = isSD ? 'Kelas 6' : 'Kelas 9';
  const birthYear = isSD ? 2014 : 2011;

  // 1. Danton
  const danton = {
    id: 'p-danton',
    role: 'danton',
    name: dantonName.toUpperCase(),
    nisn: `00${birthYear}${String(Math.floor(100000 + Math.random() * 900000))}`,
    class: classGrade,
    birthPlace: 'Yogyakarta',
    birthDate: `${birthYear}-04-15`,
    uniformSize: isSD ? 'M' : 'L',
    shoeSize: isSD ? '38' : '41',
    photo: `https://ui-avatars.com/api/?name=${encodeURIComponent(dantonName)}&background=8B0000&color=fff&bold=true`,
  };

  // 2. Pasukan 21 Orang (3 saf x 7 banjar)
  const pasukan = [];
  for (let i = 1; i <= 21; i++) {
    const saf = Math.ceil(i / 7);
    const banjar = ((i - 1) % 7) + 1;
    const name = PASUKAN_NAMES_POOL[(i - 1) % PASUKAN_NAMES_POOL.length] + (i > PASUKAN_NAMES_POOL.length ? ` ${i}` : '');
    const month = String(Math.floor(1 + Math.random() * 12)).padStart(2, '0');
    const day = String(Math.floor(1 + Math.random() * 28)).padStart(2, '0');

    pasukan.push({
      id: `p-${i}`,
      role: 'pasukan',
      safNumber: saf,
      banjarNumber: banjar,
      name: name.toUpperCase(),
      nisn: `00${birthYear}${String(100000 + i * 3721)}`,
      class: classGrade,
      birthPlace: 'Yogyakarta',
      birthDate: `${birthYear}-${month}-${day}`,
      photo: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=1e293b&color=94a3b8&bold=true`,
    });
  }

  // 3. Cadangan 3 Orang
  const cadangan = [
    {
      id: 'c-1',
      role: 'cadangan',
      name: 'M. ADITYA NUGRAHA',
      nisn: `00${birthYear}991001`,
      class: classGrade,
      birthPlace: 'Sleman',
      birthDate: `${birthYear}-06-10`,
      photo: `https://ui-avatars.com/api/?name=Aditya+Nugraha&background=334155&color=fff&bold=true`,
    },
    {
      id: 'c-2',
      role: 'cadangan',
      name: 'DANU FAUZAN',
      nisn: `00${birthYear}991002`,
      class: classGrade,
      birthPlace: 'Bantul',
      birthDate: `${birthYear}-07-18`,
      photo: `https://ui-avatars.com/api/?name=Danu+Fauzan&background=334155&color=fff&bold=true`,
    },
    {
      id: 'c-3',
      role: 'cadangan',
      name: 'RAFLI AKBAR',
      nisn: `00${birthYear}991003`,
      class: classGrade,
      birthPlace: 'Kulon Progo',
      birthDate: `${birthYear}-08-22`,
      photo: `https://ui-avatars.com/api/?name=Rafli+Akbar&background=334155&color=fff&bold=true`,
    },
  ];

  // 4. Officials 3 Orang
  const officials = [
    {
      id: 'o-1',
      role: 'Official (Pelatih / Pembina)',
      name: officialName,
      phone: '081234567890',
      category: 'official',
      photo: `https://ui-avatars.com/api/?name=${encodeURIComponent(officialName)}&background=047857&color=fff&bold=true`,
    },
    {
      id: 'o-2',
      role: 'Pendukung 1 (Medis / Dokum)',
      name: 'Siti Rahmawati, A.Md.Keb.',
      phone: '081298765432',
      category: 'pendukung',
      photo: 'https://ui-avatars.com/api/?name=Siti+Rahmawati&background=047857&color=fff&bold=true',
    },
    {
      id: 'o-3',
      role: 'Pendukung 2 (Logistik / Lapangan)',
      name: 'Budi Darmawan',
      phone: '081324567812',
      category: 'pendukung',
      photo: 'https://ui-avatars.com/api/?name=Budi+Darmawan&background=047857&color=fff&bold=true',
    },
  ];

  return { danton, pasukan, cadangan, officials };
}

/**
 * Generate 36 Peleton Dummy Lengkap (18 SD + 18 SMP)
 * Seluruh berkas verified, belum diundi (lotNumber: null) agar siap ditest Technical Meeting
 */
export function generate36DummyTeams() {
  const dummyTeams = [];
  const nowIso = new Date().toISOString();

  // 18 Tim SD
  SD_SCHOOL_PROFILES.forEach((p, idx) => {
    const numStr = String(idx + 1).padStart(2, '0');
    const id = `dummy-team-sd-${numStr}`;
    const regCode = `LBB27-SD-${numStr}-${p.name.substring(0, 4).toUpperCase().replace(/[^A-Z]/g, '')}`;

    const regDateIso = new Date(2026, 9, 1, 8, idx * 35).toISOString();

    dummyTeams.push({
      id,
      regCode,
      schoolName: p.name,
      schoolBaseName: p.name,
      teamUnit: 'Tim Utama',
      jenjang: 'SD',
      teamType: p.category,
      category: p.category,
      platoonName: p.platoon,
      dantonName: p.danton,
      officialName: p.official,
      coachName: p.official,
      waNumber: `0812${String(10000000 + idx * 8371).slice(-8)}`,
      email: `official.sd${numStr}@lbbmuallimin.com`,
      address: 'Daerah Istimewa Yogyakarta',
      status: 'verified', // Terverifikasi sah, siap untuk diundi di TM!
      lotNumber: null, // Belum diundi, siap ditest proses lotting
      drawTime: null,
      registeredAt: regDateIso,
      createdAt: regDateIso,
      updatedAt: regDateIso,
      wave: 1,
      feeAmount: 450000,
      paymentStatus: 'verified',
      files: {
        schoolLogo: {
          name: `Logo_${p.name.replace(/[^a-zA-Z0-9]/g, '_')}.png`,
          url: `https://ui-avatars.com/api/?name=${encodeURIComponent(p.name)}&background=8B0000&color=fff&bold=true`,
        },
        recommendationLetter: {
          name: 'Surat_Rekomendasi_Kepala_Sekolah.pdf',
          url: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=100',
        },
        integrityPact: {
          name: 'Pakta_Integritas_LBB_2027.pdf',
          url: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=100',
        },
        paymentProof: {
          name: 'Bukti_Transfer_Bank_BSI_Lunas.jpg',
          url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=100',
        },
        dantonCard: {
          name: 'KTA_Danton.jpg',
          url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
        },
        officialKtp: {
          name: 'KTP_Official.jpg',
          url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
        },
      },
      revisionNote: '',
      fieldTrial: {
        interested: true,
        chosenSlotId: null,
      },
      roster: createFullRoster(p.name, 'SD', p.danton, p.official),
    });
  });

  // 18 Tim SMP
  SMP_SCHOOL_PROFILES.forEach((p, idx) => {
    const numStr = String(idx + 1).padStart(2, '0');
    const id = `dummy-team-smp-${numStr}`;
    const regCode = `LBB27-SMP-${numStr}-${p.name.substring(0, 4).toUpperCase().replace(/[^A-Z]/g, '')}`;

    const regDateIso = new Date(2026, 9, 1, 9, idx * 30).toISOString();

    dummyTeams.push({
      id,
      regCode,
      schoolName: p.name,
      schoolBaseName: p.name,
      teamUnit: 'Tim Utama',
      jenjang: 'SMP',
      teamType: p.category,
      category: p.category,
      platoonName: p.platoon,
      dantonName: p.danton,
      officialName: p.official,
      coachName: p.official,
      waNumber: `0813${String(20000000 + idx * 7241).slice(-8)}`,
      email: `official.smp${numStr}@lbbmuallimin.com`,
      address: 'Daerah Istimewa Yogyakarta',
      status: 'verified', // Terverifikasi sah, siap untuk diundi di TM!
      lotNumber: null, // Belum diundi, siap ditest proses lotting
      drawTime: null,
      registeredAt: regDateIso,
      createdAt: regDateIso,
      updatedAt: regDateIso,
      wave: 1,
      feeAmount: 450000,
      paymentStatus: 'verified',
      files: {
        schoolLogo: {
          name: `Logo_${p.name.replace(/[^a-zA-Z0-9]/g, '_')}.png`,
          url: `https://ui-avatars.com/api/?name=${encodeURIComponent(p.name)}&background=1e3a8a&color=fff&bold=true`,
        },
        recommendationLetter: {
          name: 'Surat_Rekomendasi_Kepala_Sekolah.pdf',
          url: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=100',
        },
        integrityPact: {
          name: 'Pakta_Integritas_LBB_2027.pdf',
          url: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=100',
        },
        paymentProof: {
          name: 'Bukti_Transfer_Bank_BSI_Lunas.jpg',
          url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=100',
        },
        dantonCard: {
          name: 'KTA_Danton.jpg',
          url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
        },
        officialKtp: {
          name: 'KTP_Official.jpg',
          url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
        },
      },
      revisionNote: '',
      fieldTrial: {
        interested: true,
        chosenSlotId: null,
      },
      roster: createFullRoster(p.name, 'SMP', p.danton, p.official),
    });
  });

  return dummyTeams;
}
