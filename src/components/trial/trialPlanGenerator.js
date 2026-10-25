/**
 * src/components/trial/trialPlanGenerator.js
 * 
 * Algoritma Penyusunan Rencana Jadwal Uji Coba Lapangan (UCL) LBB Mu'allimin 2027
 * Mengimplementasikan 3 Tingkat Prioritas:
 * 1. Prioritas 1: Hanya Peleton yang Bersedia Ikut (Berdasarkan Survei di Dasbor Peserta)
 * 2. Prioritas 2: 2 Peleton dari Satu Sekolah yang Sama Dibuat Berdampingan (Adjacent Slots)
 * 3. Prioritas 3: Menyesuaikan Jam Hasil Pengundian TM (lotNumber)
 */

export const TRIAL_TIME_SLOTS = [
  { index: 1, time: '07.00 – 07.15 WIB', arrival: '06.30 WIB', checkIn: '06.30 WIB', checkOut: '07.15 WIB', callDP: '06.45 WIB', enterArena: '07.00 WIB' },
  { index: 2, time: '07.15 – 07.30 WIB', arrival: '06.45 WIB', checkIn: '06.45 WIB', checkOut: '07.30 WIB', callDP: '07.00 WIB', enterArena: '07.15 WIB' },
  { index: 3, time: '07.30 – 07.45 WIB', arrival: '07.00 WIB', checkIn: '07.00 WIB', checkOut: '07.45 WIB', callDP: '07.15 WIB', enterArena: '07.30 WIB' },
  { index: 4, time: '07.45 – 08.00 WIB', arrival: '07.15 WIB', checkIn: '07.15 WIB', checkOut: '08.00 WIB', callDP: '07.30 WIB', enterArena: '07.45 WIB' },
  { index: 5, time: '08.00 – 08.15 WIB', arrival: '07.30 WIB', checkIn: '07.30 WIB', checkOut: '08.15 WIB', callDP: '07.45 WIB', enterArena: '08.00 WIB' },
  { index: 6, time: '08.15 – 08.30 WIB', arrival: '07.45 WIB', checkIn: '07.45 WIB', checkOut: '08.30 WIB', callDP: '08.00 WIB', enterArena: '08.15 WIB' },
  { index: 7, time: '08.30 – 08.45 WIB', arrival: '08.00 WIB', checkIn: '08.00 WIB', checkOut: '08.45 WIB', callDP: '08.15 WIB', enterArena: '08.30 WIB' },
  { index: 8, time: '08.45 – 09.00 WIB', arrival: '08.15 WIB', checkIn: '08.15 WIB', checkOut: '09.00 WIB', callDP: '08.30 WIB', enterArena: '08.45 WIB' },
  { index: 9, time: '09.00 – 09.15 WIB', arrival: '08.30 WIB', checkIn: '08.30 WIB', checkOut: '09.15 WIB', callDP: '08.45 WIB', enterArena: '09.00 WIB' },
  { index: 10, time: '09.15 – 09.30 WIB', arrival: '08.45 WIB', checkIn: '08.45 WIB', checkOut: '09.30 WIB', callDP: '09.00 WIB', enterArena: '09.15 WIB' },
  { index: 11, time: '09.30 – 09.45 WIB', arrival: '09.00 WIB', checkIn: '09.00 WIB', checkOut: '09.45 WIB', callDP: '09.15 WIB', enterArena: '09.30 WIB' },
  { index: 12, time: '09.45 – 10.00 WIB', arrival: '09.15 WIB', checkIn: '09.15 WIB', checkOut: '10.00 WIB', callDP: '09.30 WIB', enterArena: '09.45 WIB' },
  { index: 13, time: '10.00 – 10.15 WIB', arrival: '09.30 WIB', checkIn: '09.30 WIB', checkOut: '10.15 WIB', callDP: '09.45 WIB', enterArena: '10.00 WIB' },
  { index: 14, time: '10.15 – 10.30 WIB', arrival: '09.45 WIB', checkIn: '09.45 WIB', checkOut: '10.30 WIB', callDP: '10.00 WIB', enterArena: '10.15 WIB' },
  { index: 15, time: '10.30 – 10.45 WIB', arrival: '10.00 WIB', checkIn: '10.00 WIB', checkOut: '10.45 WIB', callDP: '10.15 WIB', enterArena: '10.30 WIB' },
  { index: 16, time: '10.45 – 11.00 WIB', arrival: '10.15 WIB', checkIn: '10.15 WIB', checkOut: '11.00 WIB', callDP: '10.30 WIB', enterArena: '10.45 WIB' },
  { index: 17, time: '11.00 – 11.15 WIB', arrival: '10.30 WIB', checkIn: '10.30 WIB', checkOut: '11.15 WIB', callDP: '10.45 WIB', enterArena: '11.00 WIB' },
  { index: 18, time: '11.15 – 11.30 WIB', arrival: '10.45 WIB', checkIn: '10.45 WIB', checkOut: '11.30 WIB', callDP: '11.00 WIB', enterArena: '11.15 WIB' },
];

/**
 * Normalisasi nama sekolah untuk mendeteksi sekolah yang sama (Priority 2)
 * Contoh: "SD Muhammadiyah Sapen A" dan "SD Muhammadiyah Sapen B" -> "sd muhammadiyah sapen"
 */
export function normalizeSchoolName(name = '') {
  if (!name) return '';
  return name
    .toLowerCase()
    .replace(/\b(peleton|pasukan|tim|regu)\b.*$/gi, '')
    .replace(/[\(\[\{].*?[\)\]\}]/g, '')
    .replace(/\b(a|b|c|1|2|3|putra|putri|pa|pi)\b$/gi, '')
    .trim();
}

/**
 * Mengecek apakah tim bersedia hadir (Priority 1)
 */
export function isTeamWillingToTrial(team) {
  if (!team) return false;
  // Jika secara eksplisit menolak di survei dasbor peserta
  if (team.vehicleSurveys?.trialAttendance?.status === 'declined') return false;
  if (team.fieldTrial?.interested === false) return false;
  // Defaultnya bersedia (atau sudah 'confirmed')
  return true;
}

/**
 * Menyusun Rencana Jadwal Uji Coba Lapangan berdasarkan 3 Prioritas
 * @param {Array} allTeams - Semua tim kompetisi
 * @returns {Object} { SD: { slots: [teamId, ...], declinedIds: [...] }, SMP: { ... } }
 */
export function generateSmartTrialPlan(allTeams = []) {
  const result = {
    SD: { slots: new Array(18).fill(null), declinedIds: [] },
    SMP: { slots: new Array(18).fill(null), declinedIds: [] }
  };

  ['SD', 'SMP'].forEach((jenjangKey) => {
    // 1. Ambil seluruh tim untuk jenjang terkait
    const jenjangTeams = allTeams.filter(t => {
      const match = String(t.jenjang || '').toUpperCase().includes(jenjangKey);
      return match && ['registered', 'verified', 'drawn'].includes(t.status);
    });

    // 2. Prioritas 1: Pisahkan yang bersedia hadir vs menolak
    const attendingTeams = [];
    const declinedTeams = [];

    jenjangTeams.forEach(t => {
      if (isTeamWillingToTrial(t)) {
        attendingTeams.push(t);
      } else {
        declinedTeams.push(t);
      }
    });

    result[jenjangKey].declinedIds = declinedTeams.map(t => t.id);

    // 3. Prioritas 2: Kelompokkan tim dari 1 sekolah yang sama agar berdampingan
    const schoolGroups = {};
    attendingTeams.forEach(t => {
      const baseKey = normalizeSchoolName(t.schoolBaseName || t.schoolName);
      if (!schoolGroups[baseKey]) {
        schoolGroups[baseKey] = [];
      }
      schoolGroups[baseKey].push(t);
    });

    // 4. Prioritas 3: Hitung bobot urutan berdasarkan Nomor Urut TM (lotNumber)
    const groupsWithScore = Object.values(schoolGroups).map(group => {
      // Cari nomor urut TM terendah di grup sekolah ini
      let minLot = 999;
      group.forEach(t => {
        const lot = parseInt(t.lotNumber, 10);
        if (!isNaN(lot) && lot > 0) {
          if (lot < minLot) minLot = lot;
        }
      });

      // Urutkan anggota di dalam grup (misal Tim A dulu baru Tim B)
      group.sort((a, b) => {
        const lotA = parseInt(a.lotNumber, 10) || 999;
        const lotB = parseInt(b.lotNumber, 10) || 999;
        return lotA - lotB;
      });

      return {
        group,
        sortKey: minLot,
        schoolName: group[0]?.schoolName || '',
        isTwin: group.length > 1
      };
    });

    // Urutkan grup berdasarkan hasil TM (nomor undian paling awal tampil lebih dulu di sesi pagi)
    groupsWithScore.sort((a, b) => a.sortKey - b.sortKey);

    // 5. Flatten ke dalam 18 slot waktu (berurutan)
    const flattenedTeams = [];
    groupsWithScore.forEach(item => {
      item.group.forEach(team => {
        flattenedTeams.push(team);
      });
    });

    const slots = new Array(18).fill(null);
    flattenedTeams.slice(0, 18).forEach((team, idx) => {
      slots[idx] = team.id;
    });

    result[jenjangKey].slots = slots;
  });

  return result;
}
