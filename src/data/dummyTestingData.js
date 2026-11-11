/**
 * src/data/dummyTestingData.js
 * Master Dataset Dummy Testing Lengkap untuk Lingkungan Localhost & Superadmin
 * Berisi 18 Peleton SD/MI dan 18 Peleton SMP/MTs (Total 36 Peleton)
 * Lengkap dengan Danton, 21 Pasukan Inti, 3 Cadangan, 3 Official, Berkas Sah, dan Siap Diuji
 * Menghubungkan seluruh alur: Pendaftaran, TM, Uji Coba, Basecamp, DP, Penjurian, Rekap, dan Klasemen!
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
 * Terkoneksi dengan status undian TM, status verifikasi berkas, dan profil peleton
 */
export function generate36DummyTeams({ realisticWorkflow = true } = {}) {
  const dummyTeams = [];

  // 18 Tim SD
  SD_SCHOOL_PROFILES.forEach((p, idx) => {
    const numStr = String(idx + 1).padStart(2, '0');
    const id = `dummy-team-sd-${numStr}`;
    const regCode = `LBB27-SD-${numStr}-${p.name.substring(0, 4).toUpperCase().replace(/[^A-Z]/g, '')}`;
    const regDateIso = new Date(2026, 9, 1, 8, idx * 35).toISOString();

    // Skenario realistis: 14 tim sudah undi nomor (1-14), 4 tim belum undi (15-18) untuk test TM
    let lotNumber = null;
    let drawTime = null;
    let status = 'verified';
    let revisionNote = '';

    if (realisticWorkflow) {
      if (idx < 14) {
        lotNumber = idx + 1;
        drawTime = '2027-01-09T14:15:00+07:00';
      }
      if (idx === 15 || idx === 16) {
        status = 'pending'; // Siap diuji fungsi verifikasi Admin
      } else if (idx === 17) {
        status = 'revision';
        revisionNote = 'Surat rekomendasi kepala sekolah dan foto roster pasukan belum diunggah.';
      }
    }

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
      address: p.address || (idx === 0 ? 'Jl. Timoho No. 29, Demangan, Kec. Gondokusuman, Kota Yogyakarta' : 'Daerah Istimewa Yogyakarta'),
      schoolAddress: idx === 0 ? 'Jl. Timoho No. 29, Demangan, Kec. Gondokusuman' : 'Daerah Istimewa Yogyakarta',
      schoolRegion: 'Kota Yogyakarta',
      status,
      lotNumber,
      drawTime,
      loName: 'Kak Rizky Fauzi (Panitia LBB)',
      loPhone: '081947491505',
      loRole: 'LO Pendamping Peleton',
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
      revisionNote,
      fieldTrial: {
        interested: true,
        chosenSlotId: idx + 1,
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

    let lotNumber = null;
    let drawTime = null;
    let status = 'verified';
    let revisionNote = '';

    if (realisticWorkflow) {
      if (idx < 14) {
        lotNumber = idx + 1;
        drawTime = '2027-01-09T14:45:00+07:00';
      }
      if (idx === 15 || idx === 16) {
        status = 'pending';
      } else if (idx === 17) {
        status = 'revision';
        revisionNote = 'Berkas formulir A.1 dan KTP Pembina belum dibubuhi stempel resmi.';
      }
    }

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
      status,
      lotNumber,
      drawTime,
      loName: 'Kak Rizky Fauzi (Panitia LBB)',
      loPhone: '081947491505',
      loRole: 'LO Pendamping Peleton',
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
      revisionNote,
      fieldTrial: {
        interested: true,
        chosenSlotId: idx + 1,
      },
      roster: createFullRoster(p.name, 'SMP', p.danton, p.official),
    });
  });

  return dummyTeams;
}

/**
 * Generate Data Alur Staging Lapangan Lengkap (Pos Basecamp, DP 1, DP 2, Arena, Selesai)
 */
export function generateDummyStaging(teams = []) {
  const staging = {};

  teams.forEach(team => {
    const isSD = team.jenjang === 'SD';
    const num = parseInt(team.id.replace(/[^0-9]/g, ''), 10) || 1;

    // Skenario Distribusi Alur Realistis
    if (num === 1) {
      // Sedang di DP 1 (Pemeriksaan Berkas & Seragam)
      staging[team.id] = {
        id: team.id,
        teamId: team.id,
        stage: 'dp1',
        basecamp: {
          roomName: isSD ? 'Ruang A.101' : 'Ruang B.201',
          ktpDeposited: true,
          ktpOfficialName: team.officialName,
          ktpHolderName: team.officialName,
          ktpType: 'KTP Fisik',
          ktpNumber: `347101${String(1000000000 + num * 4821).slice(-10)}`,
          waterBoxGiven: true,
          chestNumberGiven: true,
          cocardGiven: true,
          trashBagGiven: true,
          checkInTime: '2027-01-24T06:15:00+07:00',
          checkedInAt: '06.15 WIB',
          checkedInBy: 'Panitia Basecamp & Barak',
          checkedOut: false,
        },
        dp1: {
          personnelChecked: true,
          personnelCount: 22,
          uniformChecked: true,
          cocardChecked: true,
          enteredDP1At: '2027-01-24T07:15:00+07:00',
          passedBy: 'Petugas Pos DP 1',
        },
        checklist: {
          basecampCheckIn: true,
          dp1Verification: true,
        },
        durationSeconds: 0,
        overtimePenaltyBlocks: 0,
        notes: 'Peleton lengkap 1 Danton + 21 Pasukan, siap maju ke DP 2',
        updatedAt: new Date().toISOString(),
      };
    } else if (num === 2) {
      // Sedang di DP 2 (Gladi Bersih & Pemanasan 10 Menit)
      staging[team.id] = {
        id: team.id,
        teamId: team.id,
        stage: 'dp2',
        basecamp: {
          roomName: isSD ? 'Ruang A.102' : 'Ruang B.202',
          ktpDeposited: true,
          ktpOfficialName: team.officialName,
          ktpHolderName: team.officialName,
          ktpType: 'KTP Fisik',
          ktpNumber: `347101${String(1000000000 + num * 4821).slice(-10)}`,
          waterBoxGiven: true,
          chestNumberGiven: true,
          cocardGiven: true,
          trashBagGiven: true,
          checkInTime: '2027-01-24T06:25:00+07:00',
          checkedInAt: '06.25 WIB',
          checkedInBy: 'Panitia Basecamp & Barak',
          checkedOut: false,
        },
        dp1: {
          personnelChecked: true,
          personnelCount: 22,
          uniformChecked: true,
          cocardChecked: true,
          enteredDP1At: '2027-01-24T07:00:00+07:00',
          passedBy: 'Petugas Pos DP 1',
        },
        dp2: {
          warmingUpStartedAt: '2027-01-24T07:20:00+07:00',
          readyForArena: true,
        },
        checklist: {
          basecampCheckIn: true,
          dp1Verification: true,
          dp2Warmup: true,
        },
        durationSeconds: 480,
        overtimePenaltyBlocks: 0,
        notes: 'Gladi pemanasan selesai, siap memasuki arena perlombaan',
        updatedAt: new Date().toISOString(),
      };
    } else if (num === 3) {
      // Sedang Tampil di Arena Perlombaan
      staging[team.id] = {
        id: team.id,
        teamId: team.id,
        stage: 'arena',
        basecamp: {
          roomName: isSD ? 'Ruang A.103' : 'Ruang B.203',
          ktpDeposited: true,
          ktpOfficialName: team.officialName,
          ktpHolderName: team.officialName,
          ktpType: 'KTP Fisik',
          waterBoxGiven: true,
          chestNumberGiven: true,
          cocardGiven: true,
          trashBagGiven: true,
          checkInTime: '2027-01-24T06:35:00+07:00',
          checkedInAt: '06.35 WIB',
          checkedInBy: 'Panitia Basecamp & Barak',
          checkedOut: false,
        },
        enteredArenaAt: '2027-01-24T07:35:00+07:00',
        checklist: {
          basecampCheckIn: true,
          dp1Verification: true,
          dp2Warmup: true,
          arenaEntered: true,
        },
        durationSeconds: 360,
        overtimePenaltyBlocks: 0,
        notes: 'Sedang melaksanakan materi PBB di depan 3 Dewan Juri',
        updatedAt: new Date().toISOString(),
      };
    } else if (num === 4) {
      // Sudah Selesai & Sudah Check-Out (Kliring Barak Selesai)
      staging[team.id] = {
        id: team.id,
        teamId: team.id,
        stage: 'finished',
        basecamp: {
          roomName: isSD ? 'Ruang A.104' : 'Ruang B.204',
          ktpDeposited: true,
          ktpOfficialName: team.officialName,
          ktpHolderName: team.officialName,
          ktpType: 'KTP Fisik',
          waterBoxGiven: true,
          chestNumberGiven: true,
          cocardGiven: true,
          trashBagGiven: true,
          checkInTime: '2027-01-24T06:45:00+07:00',
          checkedInAt: '06.45 WIB',
          checkedInBy: 'Panitia Basecamp & Barak',
          checkedOut: true,
          checkOutTime: '2027-01-24T14:30:00+07:00',
          checkedOutAt: '14.30 WIB',
          checkedOutBy: 'Petugas Inspeksi Barak',
          cleanlinessVerified: true,
          trashBagsReturned: true,
          ktpReturned: true,
          notes: 'Ruang kelas rapi dan bersih, sampah terpilah lengkap',
        },
        checklist: {
          basecampCheckIn: true,
          dp1Verification: true,
          dp2Warmup: true,
          arenaEntered: true,
          performanceFinished: true,
          basecampCheckOut: true,
        },
        finishedAt: '2027-01-24T08:00:00+07:00',
        durationSeconds: 580,
        overtimePenaltyBlocks: 0,
        notes: 'Peleton telah selesai tampil dan menyelesaikan kliring',
        updatedAt: new Date().toISOString(),
      };
    } else if (num >= 5 && num <= 8) {
      // Sudah Check-In di Basecamp (Menunggu Panggilan DP 1)
      staging[team.id] = {
        id: team.id,
        teamId: team.id,
        stage: 'basecamp',
        basecamp: {
          roomName: isSD ? `Ruang A.10${num}` : `Ruang B.20${num}`,
          ktpDeposited: true,
          ktpOfficialName: team.officialName,
          ktpHolderName: team.officialName,
          ktpType: 'KTP Fisik',
          waterBoxGiven: true,
          chestNumberGiven: true,
          cocardGiven: true,
          trashBagGiven: true,
          checkInTime: `2027-01-24T07:${String(num * 7).padStart(2, '0')}:00+07:00`,
          checkedInAt: `07.${String(num * 7).padStart(2, '0')} WIB`,
          checkedInBy: 'Panitia Basecamp & Barak',
          checkedOut: false,
        },
        checklist: {
          basecampCheckIn: true,
        },
        durationSeconds: 0,
        overtimePenaltyBlocks: 0,
        notes: 'Peleton standby di ruang kelas transit',
        updatedAt: new Date().toISOString(),
      };
    } else {
      // Belum Tiba (Siap ditest scan QR / input check-in)
      staging[team.id] = {
        id: team.id,
        teamId: team.id,
        stage: 'waiting',
        checklist: {},
        durationSeconds: 0,
        overtimePenaltyBlocks: 0,
        notes: '',
        updatedAt: new Date().toISOString(),
      };
    }
  });

  return staging;
}

/**
 * Generate Skor Penjurian & Rekapitulasi Nilai Realistis (Klasemen & Rekap)
 */
export function generateDummyScores(teams = []) {
  const scores = {};

  // Tim yang sudah selesai tampil dan memiliki nilai (Nomor 1 s.d. 14 SD & SMP)
  teams.forEach(team => {
    const num = parseInt(team.id.replace(/[^0-9]/g, ''), 10) || 1;
    const isSD = team.jenjang === 'SD';

    if (num >= 1 && num <= 14) {
      // Skema Nilai Berjenjang Realistis
      // SD: 26 Gerakan (~ 1800 - 2150 total)
      // SMP: 28 Gerakan (~ 1900 - 2250 total)
      const basePbb = isSD ? 1860 : 1940;
      const rankBonus = (15 - num) * 18; // Tim nomor 1 (Sapen) tertinggi: 2112
      const pbbTotal = basePbb + rankBonus;
      const pbb1 = Math.round(pbbTotal * 0.334);
      const pbb2 = Math.round(pbbTotal * 0.333);
      const pbb3 = pbbTotal - pbb1 - pbb2;

      // Rubrik Danton Resmi (Bab A.3.b Juknis: Skala Maksimal 90: KS=50, K=54/58/62, C=66/70/74, B=78/82/86, BS=90)
      // Opsi Baku DANTON_SCALE: [50, 55, 60, 64, 66, 68, 72, 74, 76, 79, 81, 83, 86, 88, 90]
      const bsOptions = [86, 88, 90];
      const bOptions = [79, 81, 83];
      const cOptions = [72, 74, 76];
      const kOptions = [64, 66, 68];

      const pool = num <= 3 ? bsOptions : num <= 8 ? bOptions : num <= 12 ? cOptions : kOptions;
      const dantonMateri = pool[(num) % pool.length];
      const dantonVokal = pool[(num + 1) % pool.length];
      const dantonSikap = pool[(num + 2) % pool.length];
      const dantonLapangan = pool[(num) % pool.length];

      // Formula Juknis Bab A.3.c: (Materi 35%) + (Vokal 25%) + (Sikap 20%) + (Lapangan 20%)
      const calcDantonJury = (m, v, s, l) => parseFloat(((m * 0.35) + (v * 0.25) + (s * 0.20) + (l * 0.20)).toFixed(2));
      const danton1 = calcDantonJury(dantonMateri, dantonVokal, dantonSikap, dantonLapangan);
      const danton2 = calcDantonJury(
        pool[(num + 1) % pool.length],
        pool[(num) % pool.length],
        pool[(num + 1) % pool.length],
        pool[(num + 2) % pool.length]
      );
      const danton3 = calcDantonJury(
        pool[(num + 2) % pool.length],
        pool[(num + 2) % pool.length],
        pool[(num) % pool.length],
        pool[(num + 1) % pool.length]
      );
      const dantonTotal = parseFloat((danton1 + danton2 + danton3).toFixed(2));

      // Contoh tim nomor 6 kena penalti injak garis (-50 poin) untuk simulasi
      let peletonPenalty = 0;
      let injakGarisCount = 0;
      if (num === 6) {
        peletonPenalty = 50;
        injakGarisCount = 1;
      }

      const nilaiAkhirPeleton = Math.max(0, pbbTotal - peletonPenalty);
      const nilaiAkhirDanton = dantonTotal;
      const finalScore = parseFloat((nilaiAkhirPeleton + nilaiAkhirDanton).toFixed(2));

      let status = 'finalized';
      let isLocked = true;
      if (num === 13) {
        status = 'verified';
        isLocked = false;
      } else if (num === 14) {
        status = 'draft';
        isLocked = false;
      }

      const scoreEntry = {
        teamId: team.id,
        juryName: 'Dewan Juri Resmi LBB Muallimin 2027',
        juryRole: 'Juri Lapangan LBB Muallimin 2027',
        scoredAt: '2027-01-24T09:30:00+07:00',
        rank: num,
        categoryRank: num,
        awardTitle: num === 1 ? `Juara 1 Peleton ${isSD ? 'SD' : 'SMP'}` : num === 2 ? `Juara 2 Peleton ${isSD ? 'SD' : 'SMP'}` : num === 3 ? `Juara 3 Peleton ${isSD ? 'SD' : 'SMP'}` : `Peringkat #${num}`,
        juries: {
          pos1: { peletonTotal: pbb1, dantonTotal: danton1, total: parseFloat((pbb1 + danton1).toFixed(2)) },
          pos2: { peletonTotal: pbb2, dantonTotal: danton2, total: parseFloat((pbb2 + danton2).toFixed(2)) },
          pos3: { peletonTotal: pbb3, dantonTotal: danton3, total: parseFloat((pbb3 + danton3).toFixed(2)) },
        },
        pbb: {
          total: pbbTotal,
          nilaiMurni: pbbTotal,
          nilaiAkhir: nilaiAkhirPeleton,
          j1: pbb1,
          j2: pbb2,
          j3: pbb3,
          rubricScores: {},
        },
        danton: {
          total: dantonTotal,
          nilaiMurni: dantonTotal,
          nilaiAkhir: nilaiAkhirDanton,
          j1: danton1,
          j2: danton2,
          j3: danton3,
          rubricScores: {
            materi: dantonMateri,
            vokal: dantonVokal,
            sikap: dantonSikap,
            lapangan: dantonLapangan,
          },
        },
        penalties: {
          peletonPenalty,
          dantonPenalty: 0,
          totalPenalty: peletonPenalty,
          injakGarisCount,
        },
        nilaiMurniPeleton: pbbTotal,
        nilaiAkhirPeleton,
        nilaiMurniDanton: dantonTotal,
        nilaiAkhirDanton,
        pbbTotal,
        dantonTotal,
        penaltiesTotal: peletonPenalty,
        finalScore,
        evaluasiNote: num === 1
          ? 'Penampilan luar biasa solid! Hentakan langkah kaki dan tempo barisan sangat seragam. Ketegasan aba-aba Komandan Peleton terdengar lantang dan berkarakter kuat.'
          : (num === 6 ? 'Terjadi 1x pelanggaran injak garis batas arena (-50 poin). Tata barisan rapi.' : 'Penampilan sangat rapi, sinkronisasi tinggi, formasi presisi.'),
        notes: num === 1
          ? 'Penampilan luar biasa solid! Hentakan langkah kaki dan tempo barisan sangat seragam. Ketegasan aba-aba Komandan Peleton terdengar lantang dan berkarakter kuat.'
          : (num === 6 ? 'Terjadi 1x pelanggaran injak garis batas arena (-50 poin)' : 'Penampilan sangat rapi, sinkronisasi tinggi, formasi presisi.'),
        status,
        isLocked,
        verifiedBy: 'Andi Aqillah (Superadmin)',
        finalizedBy: status === 'finalized' ? 'Mayor Inf. Bambang (Ketua Dewan Juri)' : null,
      };

      scores[team.id] = scoreEntry;
      if (team.id === 'team-sd-01') {
        scores['team-sd-1'] = scoreEntry;
      }
    }
  });

  return scores;
}

/**
 * Generate Smart Plan Uji Coba Lapangan (16 Januari 2027)
 */
export function generateDummyTrialPlan(teams = []) {
  const sdTeams = teams.filter(t => t.jenjang === 'SD');
  const smpTeams = teams.filter(t => t.jenjang === 'SMP');

  const sdSlots = new Array(18).fill(null);
  const smpSlots = new Array(18).fill(null);

  sdTeams.forEach((t, i) => {
    if (i < 18) sdSlots[i] = t.id;
  });

  smpTeams.forEach((t, i) => {
    if (i < 18) smpSlots[i] = t.id;
  });

  return {
    SD: { slots: sdSlots },
    SMP: { slots: smpSlots },
  };
}

/**
 * Master Generator: Menghasilkan seluruh ekosistem data dummy 8 menu untuk localhost
 */
export function generateDummyTestingSuite() {
  const teams = generate36DummyTeams({ realisticWorkflow: true });
  const staging = generateDummyStaging(teams);
  const scores = generateDummyScores(teams);
  const trialPlan = generateDummyTrialPlan(teams);

  return {
    teams,
    staging,
    scores,
    trialPlan,
  };
}
