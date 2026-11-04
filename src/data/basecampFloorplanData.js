// Data Struktur Denah Basecamp Kampus Terpadu Madrasah Mu'allimin Muhammadiyah Yogyakarta
// Tahun Ajaran 2026/2027 - Berdasarkan Dokumen Resmi Arsitektur Gedung 4 Lantai

export const FLOORS_CONFIG = [
  {
    floor: 1,
    title: 'Lantai 1 (Ground Floor)',
    shortTitle: 'Lantai 1',
    image: '/denah-basecamp/denah-lantai-1.jpg',
    description: 'Akses langsung halaman utama, 2 area taman terbuka, dan 11 ruang kelas transit reguler (kelas internasional steril).',
    stats: {
      classes: 11,
      international: 4,
      facilities: 6,
      stairs: 3,
      gardens: 2,
    },
    zones: [
      {
        id: 'L1-NORTH',
        wing: 'north',
        wingLabel: 'Koridor Utama (Utara)',
        rooms: [
          { id: 'L1-N-01', code: 'KM-DPR', name: 'Kamar Mandi & Ruang Pegawai Dapur', category: 'facility', categoryLabel: 'Sanitasi & Dapur', lbbRole: 'Area Logistik Konsumsi & Toilet Barat' },
          { id: 'L1-N-02', code: 'R-MINUM', name: 'Ruang Minum', category: 'facility', categoryLabel: 'Fasilitas Minum', lbbRole: 'Pos Air Minum & Refill Kontingen' },
          { id: 'L1-N-03', code: '1C', name: 'Ruang Kelas 1C', category: 'class', categoryLabel: 'Ruang Kelas', isBasecampCandidate: true, lbbRole: 'Basecamp Peleton SD/MI' },
          { id: 'L1-N-04', code: '1D', name: 'Ruang Kelas 1D', category: 'class', categoryLabel: 'Ruang Kelas', isBasecampCandidate: true, lbbRole: 'Basecamp Peleton SD/MI' },
          { id: 'L1-N-05', code: '1E', name: 'Ruang Kelas 1E', category: 'class', categoryLabel: 'Ruang Kelas', isBasecampCandidate: true, lbbRole: 'Basecamp Peleton SD/MI' },
          { id: 'L1-N-06', code: '1F', name: 'Ruang Kelas 1F', category: 'class', categoryLabel: 'Ruang Kelas', isBasecampCandidate: true, lbbRole: 'Basecamp Peleton SD/MI' },
          { id: 'L1-N-07', code: '1G', name: 'Ruang Kelas 1G', category: 'class', categoryLabel: 'Ruang Kelas', isBasecampCandidate: true, lbbRole: 'Basecamp Peleton SD/MI' },
          { id: 'L1-N-08', code: 'R-CS', name: 'Ruang Cleaning Service', category: 'facility', categoryLabel: 'Operasional Kebersihan', lbbRole: 'Pos Sarpras & Kebersihan Timur' },
        ]
      },
      {
        id: 'L1-WEST',
        wing: 'west',
        wingLabel: 'Sayap Barat (West Wing)',
        rooms: [
          { id: 'L1-W-01', code: 'R-OS', name: 'Ruang Organisasi Santri', category: 'office', categoryLabel: 'Ruang Organisasi', lbbRole: 'Posko Perlengkapan & Logistik Panitia' },
          { id: 'L1-W-02', code: '1-LSC', name: 'Ruang Kelas 1 Lower Secondary C', category: 'international', categoryLabel: 'Kelas Internasional', isBasecampCandidate: false, isInternational: true, lbbRole: 'Steril / Tidak Digunakan (Kelas Internasional)' },
          { id: 'L1-W-03', code: '1-LSB', name: 'Ruang Kelas 1 Lower Secondary B', category: 'international', categoryLabel: 'Kelas Internasional', isBasecampCandidate: false, isInternational: true, lbbRole: 'Steril / Tidak Digunakan (Kelas Internasional)' },
          { id: 'L1-W-04', code: '1-LSA', name: 'Ruang Kelas 1 Lower Secondary A', category: 'international', categoryLabel: 'Kelas Internasional', isBasecampCandidate: false, isInternational: true, lbbRole: 'Steril / Tidak Digunakan (Kelas Internasional)' },
        ]
      },
      {
        id: 'L1-CENTER',
        wing: 'center',
        wingLabel: 'Sayap Tengah (Central Wing)',
        rooms: [
          { id: 'L1-C-KM', code: 'KM-TGH', name: 'Kamar Mandi Sayap Tengah', category: 'facility', categoryLabel: 'Sanitasi & Toilet', lbbRole: 'Toilet Umum Peserta (Tengah)' },
          { id: 'L1-C-01', code: '1B', name: 'Ruang Kelas 1B', category: 'class', categoryLabel: 'Ruang Kelas', isBasecampCandidate: true, lbbRole: 'Basecamp Peleton SD/MI' },
          { id: 'L1-C-02', code: '1A', name: 'Ruang Kelas 1A', category: 'class', categoryLabel: 'Ruang Kelas', isBasecampCandidate: true, lbbRole: 'Basecamp Peleton SD/MI' },
          { id: 'L1-C-03', code: '3-USA', name: 'Ruang Kelas 3 Upper Secondary A', category: 'international', categoryLabel: 'Kelas Internasional', isBasecampCandidate: false, isInternational: true, lbbRole: 'Steril / Tidak Digunakan (Kelas Internasional)' },
        ]
      },
      {
        id: 'L1-EAST',
        wing: 'east',
        wingLabel: 'Sayap Timur (East Wing)',
        rooms: [
          { id: 'L1-E-01', code: 'RB-1', name: 'Ruangan Baru (Utara)', category: 'class', categoryLabel: 'Ruang Serbaguna', isBasecampCandidate: true, lbbRole: 'Ruang Transit Official / Pendamping' },
          { id: 'L1-E-02', code: 'RKB-1', name: 'Ruang Kelas Baru 1', category: 'class', categoryLabel: 'Ruang Kelas Baru', isBasecampCandidate: true, lbbRole: 'Basecamp Peleton SD/MI' },
          { id: 'L1-E-03', code: 'RKB-2', name: 'Ruang Kelas Baru 2', category: 'class', categoryLabel: 'Ruang Kelas Baru', isBasecampCandidate: true, lbbRole: 'Basecamp Peleton SD/MI' },
          { id: 'L1-E-04', code: 'RB-2', name: 'Ruangan Baru (Selatan)', category: 'class', categoryLabel: 'Ruang Serbaguna', isBasecampCandidate: true, lbbRole: 'Ruang Ganti & Istirahat Peleton' },
        ]
      }
    ]
  },
  {
    floor: 2,
    title: 'Lantai 2 (Pusat Pendidik & Basecamp)',
    shortTitle: 'Lantai 2',
    image: '/denah-basecamp/denah-lantai-2.jpg',
    description: 'Pusat operasional dewan guru, Ruang BK, MIC Office, dan 3 ruang kelas transit reguler (kelas internasional steril).',
    stats: {
      classes: 3,
      international: 6,
      facilities: 5,
      stairs: 3,
      gardens: 0,
    },
    zones: [
      {
        id: 'L2-NORTH',
        wing: 'north',
        wingLabel: 'Koridor Utama (Utara)',
        rooms: [
          { id: 'L2-N-01', code: 'KM-CS', name: 'Kamar Mandi & Cleaning Service Barat', category: 'facility', categoryLabel: 'Sanitasi & Kebersihan', lbbRole: 'Toilet Panitia & Tamu' },
          { id: 'L2-N-02', code: 'R-BK', name: 'Ruang Bimbingan Konseling (BK)', category: 'office', categoryLabel: 'Ruang BK', lbbRole: 'Posko Medis & Penanganan Khusus' },
          { id: 'L2-N-03', code: 'R-GURU', name: 'Ruang Guru Utama (Besar)', category: 'office', categoryLabel: 'Pusat Guru / Transit Utama', lbbRole: 'Ruang Transit Juri & Tamu VIP Undangan' },
          { id: 'L2-N-04', code: 'R-PIKET', name: 'Ruang Piket Guru & Kamar Mandi', category: 'office', categoryLabel: 'Piket & Sanitasi', lbbRole: 'Posko Monitoring Lapangan' },
        ]
      },
      {
        id: 'L2-WEST',
        wing: 'west',
        wingLabel: 'Sayap Barat (West Wing)',
        rooms: [
          { id: 'L2-W-01', code: 'MIC', name: 'MIC Office (Muallimin International Center)', category: 'office', categoryLabel: 'Kantor MIC', lbbRole: 'Posko Sekretariat & Meja Registrasi Ulang' },
          { id: 'L2-W-02', code: '2-LSC', name: 'Ruang Kelas 2 Lower Secondary C', category: 'international', categoryLabel: 'Kelas Internasional', isBasecampCandidate: false, isInternational: true, lbbRole: 'Steril / Tidak Digunakan (Kelas Internasional)' },
          { id: 'L2-W-03', code: '2-LSB', name: 'Ruang Kelas 2 Lower Secondary B', category: 'international', categoryLabel: 'Kelas Internasional', isBasecampCandidate: false, isInternational: true, lbbRole: 'Steril / Tidak Digunakan (Kelas Internasional)' },
          { id: 'L2-W-04', code: '2-LSA', name: 'Ruang Kelas 2 Lower Secondary A', category: 'international', categoryLabel: 'Kelas Internasional', isBasecampCandidate: false, isInternational: true, lbbRole: 'Steril / Tidak Digunakan (Kelas Internasional)' },
        ]
      },
      {
        id: 'L2-CENTER',
        wing: 'center',
        wingLabel: 'Sayap Tengah (Central Wing)',
        rooms: [
          { id: 'L2-C-01', code: '3-USB', name: 'Ruang Kelas 3 Upper Secondary B', category: 'international', categoryLabel: 'Kelas Internasional', isBasecampCandidate: false, isInternational: true, lbbRole: 'Steril / Tidak Digunakan (Kelas Internasional)' },
          { id: 'L2-C-02', code: '4-USB', name: 'Ruang Kelas 4 Upper Secondary B', category: 'international', categoryLabel: 'Kelas Internasional', isBasecampCandidate: false, isInternational: true, lbbRole: 'Steril / Tidak Digunakan (Kelas Internasional)' },
          { id: 'L2-C-03', code: '4-USA', name: 'Ruang Kelas 4 Upper Secondary A', category: 'international', categoryLabel: 'Kelas Internasional', isBasecampCandidate: false, isInternational: true, lbbRole: 'Steril / Tidak Digunakan (Kelas Internasional)' },
        ]
      },
      {
        id: 'L2-EAST',
        wing: 'east',
        wingLabel: 'Sayap Timur (East Wing)',
        rooms: [
          { id: 'L2-E-01', code: 'R-PENGAWAS', name: 'Ruang Pengawasan', category: 'office', categoryLabel: 'Ruang Pengawasan', lbbRole: 'Posko Dewan Kehormatan & Inspektor Lomba' },
          { id: 'L2-E-02', code: '2A', name: 'Ruang Kelas 2A', category: 'class', categoryLabel: 'Ruang Kelas', isBasecampCandidate: true, lbbRole: 'Basecamp Peleton SMP/MTs' },
          { id: 'L2-E-03', code: '2B', name: 'Ruang Kelas 2B', category: 'class', categoryLabel: 'Ruang Kelas', isBasecampCandidate: true, lbbRole: 'Basecamp Peleton SMP/MTs' },
          { id: 'L2-E-04', code: '3A', name: 'Ruang Kelas 3A', category: 'class', categoryLabel: 'Ruang Kelas', isBasecampCandidate: true, lbbRole: 'Basecamp Peleton SMP/MTs' },
        ]
      }
    ]
  },
  {
    floor: 3,
    title: 'Lantai 3 (Lab Komputer & Basecamp)',
    shortTitle: 'Lantai 3',
    image: '/denah-basecamp/denah-lantai-3.jpg',
    description: 'Laboratorium Komputer 1 & 2 terpadu, Studio Musik, serta 11 ruang kelas representatif.',
    stats: {
      classes: 11,
      facilities: 4,
      stairs: 3,
      gardens: 0,
    },
    zones: [
      {
        id: 'L3-NORTH',
        wing: 'north',
        wingLabel: 'Koridor Utama (Utara)',
        rooms: [
          { id: 'L3-N-01', code: 'KM-PKT', name: 'Kamar Mandi & Ruang Piket Guru Barat', category: 'facility', categoryLabel: 'Sanitasi & Piket', lbbRole: 'Pos Piket Lantai 3' },
          { id: 'L3-N-02', code: '2F', name: 'Ruang Kelas 2F', category: 'class', categoryLabel: 'Ruang Kelas', isBasecampCandidate: true, lbbRole: 'Basecamp Peleton SMP/MTs' },
          { id: 'L3-N-03', code: '2G', name: 'Ruang Kelas 2G', category: 'class', categoryLabel: 'Ruang Kelas', isBasecampCandidate: true, lbbRole: 'Basecamp Peleton SMP/MTs' },
          { id: 'L3-N-04', code: '2H', name: 'Ruang Kelas 2H', category: 'class', categoryLabel: 'Ruang Kelas', isBasecampCandidate: true, lbbRole: 'Basecamp Peleton SMP/MTs' },
          { id: 'L3-N-05', code: '3E', name: 'Ruang Kelas 3E', category: 'class', categoryLabel: 'Ruang Kelas', isBasecampCandidate: true, lbbRole: 'Basecamp Peleton SMP/MTs' },
          { id: 'L3-N-06', code: '3F', name: 'Ruang Kelas 3F', category: 'class', categoryLabel: 'Ruang Kelas', isBasecampCandidate: true, lbbRole: 'Basecamp Peleton SMP/MTs' },
          { id: 'L3-N-07', code: 'CS-KM', name: 'Ruang Cleaning Service & Kamar Mandi Timur', category: 'facility', categoryLabel: 'Sanitasi & Sarpras', lbbRole: 'Toilet Lantai 3 Timur' },
        ]
      },
      {
        id: 'L3-WEST',
        wing: 'west',
        wingLabel: 'Sayap Barat (West Wing)',
        rooms: [
          { id: 'L3-W-01', code: 'STUDIO', name: 'Studio Musik', category: 'facility', categoryLabel: 'Studio Audio/Akustik', lbbRole: 'Ruang Sound System & Multimedia' },
          { id: 'L3-W-02', code: '2E', name: 'Ruang Kelas 2E', category: 'class', categoryLabel: 'Ruang Kelas', isBasecampCandidate: true, lbbRole: 'Basecamp Peleton SMP/MTs' },
          { id: 'L3-W-03', code: '2D', name: 'Ruang Kelas 2D', category: 'class', categoryLabel: 'Ruang Kelas', isBasecampCandidate: true, lbbRole: 'Basecamp Peleton SMP/MTs' },
          { id: 'L3-W-04', code: '2C', name: 'Ruang Kelas 2C', category: 'class', categoryLabel: 'Ruang Kelas', isBasecampCandidate: true, lbbRole: 'Basecamp Peleton SMP/MTs' },
        ]
      },
      {
        id: 'L3-CENTER',
        wing: 'center',
        wingLabel: 'Sayap Tengah (Central Wing)',
        rooms: [
          { id: 'L3-C-01', code: '3D', name: 'Ruang Kelas 3D', category: 'class', categoryLabel: 'Ruang Kelas', isBasecampCandidate: true, lbbRole: 'Basecamp Peleton SMP/MTs' },
          { id: 'L3-C-02', code: '3C', name: 'Ruang Kelas 3C', category: 'class', categoryLabel: 'Ruang Kelas', isBasecampCandidate: true, lbbRole: 'Basecamp Peleton SMP/MTs' },
          { id: 'L3-C-03', code: '3B', name: 'Ruang Kelas 3B', category: 'class', categoryLabel: 'Ruang Kelas', isBasecampCandidate: true, lbbRole: 'Basecamp Peleton SMP/MTs' },
        ]
      },
      {
        id: 'L3-EAST',
        wing: 'east',
        wingLabel: 'Sayap Timur (East Wing)',
        rooms: [
          { id: 'L3-E-01', code: 'LAB-KOM-2', name: 'Laboratorium Komputer 2', category: 'lab', categoryLabel: 'Lab Komputer Server', lbbRole: 'Pusat Rekapitulasi Nilai & Live Score IT' },
          { id: 'L3-E-02', code: 'LAB-KOM-1', name: 'Laboratorium Komputer 1', category: 'lab', categoryLabel: 'Lab Komputer Client', lbbRole: 'Ruang Verifikasi Sertifikat & Operator Tabulasi' },
        ]
      }
    ]
  },
  {
    floor: 4,
    title: 'Lantai 4 (Sains Labs & Ruang Rapat)',
    shortTitle: 'Lantai 4',
    image: '/denah-basecamp/denah-lantai-4.jpg',
    description: 'Kompleks Laboratorium Sains (Biologi, Fisika, Kimia, IPA, IPS, Kewirausahaan) dan Ruang Rapat Pleno.',
    stats: {
      classes: 8,
      facilities: 9,
      stairs: 0,
      gardens: 0,
    },
    zones: [
      {
        id: 'L4-NORTH',
        wing: 'north',
        wingLabel: 'Koridor Utama (Utara)',
        rooms: [
          { id: 'L4-N-01', code: 'KM-CS', name: 'Kamar Mandi & Ruang Cleaning Service Barat', category: 'facility', categoryLabel: 'Sanitasi Barat', lbbRole: 'Toilet Lantai 4 Barat' },
          { id: 'L4-N-02', code: '4D', name: 'Ruang Kelas 4D', category: 'class', categoryLabel: 'Ruang Kelas', isBasecampCandidate: true, lbbRole: 'Ruang Transit Kontingen Cadangan' },
          { id: 'L4-N-03', code: '4E', name: 'Ruang Kelas 4E', category: 'class', categoryLabel: 'Ruang Kelas', isBasecampCandidate: true, lbbRole: 'Ruang Transit Kontingen Cadangan' },
          { id: 'L4-N-04', code: '4F', name: 'Ruang Kelas 4F', category: 'class', categoryLabel: 'Ruang Kelas', isBasecampCandidate: true, lbbRole: 'Ruang Transit Kontingen Cadangan' },
          { id: 'L4-N-05', code: '3G', name: 'Ruang Kelas 3G', category: 'class', categoryLabel: 'Ruang Kelas', isBasecampCandidate: true, lbbRole: 'Ruang Transit Kontingen Cadangan' },
          { id: 'L4-N-06', code: '3H', name: 'Ruang Kelas 3H', category: 'class', categoryLabel: 'Ruang Kelas', isBasecampCandidate: true, lbbRole: 'Ruang Transit Kontingen Cadangan' },
          { id: 'L4-N-07', code: 'TRANSIT-GURU', name: 'Ruang Transit Guru & Kamar Mandi', category: 'office', categoryLabel: 'Transit & Sanitasi', lbbRole: 'Ruang Istirahat Dewan Juri / VIP' },
        ]
      },
      {
        id: 'L4-WEST',
        wing: 'west',
        wingLabel: 'Sayap Barat (West Wing)',
        rooms: [
          { id: 'L4-W-01', code: 'R-RAPAT', name: 'Ruang Rapat Pleno', category: 'office', categoryLabel: 'Ruang Rapat Utama', lbbRole: 'Sidang Pleno Dewan Juri & Evaluasi Lomba' },
          { id: 'L4-W-02', code: '4C', name: 'Ruang Kelas 4C', category: 'class', categoryLabel: 'Ruang Kelas', isBasecampCandidate: true, lbbRole: 'Ruang Transit Official / Pelatih' },
          { id: 'L4-W-03', code: '4B', name: 'Ruang Kelas 4B', category: 'class', categoryLabel: 'Ruang Kelas', isBasecampCandidate: true, lbbRole: 'Ruang Transit Official / Pelatih' },
          { id: 'L4-W-04', code: '4A', name: 'Ruang Kelas 4A', category: 'class', categoryLabel: 'Ruang Kelas', isBasecampCandidate: true, lbbRole: 'Ruang Transit Official / Pelatih' },
        ]
      },
      {
        id: 'L4-CENTER',
        wing: 'center',
        wingLabel: 'Sayap Tengah (Sains & Riset)',
        rooms: [
          { id: 'L4-C-01', code: 'LAB-BIO', name: 'Laboratorium Biology', category: 'lab', categoryLabel: 'Laboratorium Biologi', lbbRole: 'Area Steril / Khusus Panitia' },
          { id: 'L4-C-02', code: 'LAB-FIS', name: 'Laboratorium Physics', category: 'lab', categoryLabel: 'Laboratorium Fisika', lbbRole: 'Area Steril / Khusus Panitia' },
          { id: 'L4-C-03', code: 'LAB-KIM', name: 'Laboratorium Chemistry', category: 'lab', categoryLabel: 'Laboratorium Kimia', lbbRole: 'Area Steril / Khusus Panitia' },
        ]
      },
      {
        id: 'L4-EAST',
        wing: 'east',
        wingLabel: 'Sayap Timur (Riset Terpadu)',
        rooms: [
          { id: 'L4-E-01', code: 'LAB-IPA', name: 'Laboratorium IPA', category: 'lab', categoryLabel: 'Laboratorium IPA', lbbRole: 'Gudang Trophy, Plakat & Logistik Utama' },
          { id: 'L4-E-02', code: 'LAB-ENT', name: 'Laboratorium Entrepreneur', category: 'lab', categoryLabel: 'Lab Entrepreneurship', lbbRole: 'Posko Sponsor, Partnership & Media Partner' },
          { id: 'L4-E-03', code: 'LAB-IPS', name: 'Laboratorium IPS', category: 'lab', categoryLabel: 'Laboratorium IPS', lbbRole: 'Posko Dokumentasi & Live Broadcast Studio' },
        ]
      }
    ]
  }
];

// Helper untuk mendapatkan seluruh daftar ruangan datar (flat array)
export const getAllRoomsFlat = () => {
  const flat = [];
  FLOORS_CONFIG.forEach(fl => {
    fl.zones.forEach(zn => {
      zn.rooms.forEach(rm => {
        flat.push({
          ...rm,
          floor: fl.floor,
          floorTitle: fl.title,
          wing: zn.wing,
          wingLabel: zn.wingLabel,
        });
      });
    });
  });
  return flat;
};
