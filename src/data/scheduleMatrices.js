// Data Matriks Jadwal Uji Coba Lapangan & Hari-H LBB Mu'allimin 2027
// Sinkron dengan Juknis & Rundown Resmi LBB Mu'allimin 2027

import { LOTTERY_CHEST_MAP } from '../context/competitionHelpers.js';

const fmtTime = (totalMins) => {
  const h = Math.floor(totalMins / 60);
  const m = totalMins % 60;
  return `${String(h).padStart(2, '0')}.${String(m).padStart(2, '0')} WIB`;
};

const fmtRange = (startMins, endMins) =>
  `${String(Math.floor(startMins / 60)).padStart(2, '0')}.${String(startMins % 60).padStart(2, '0')} - ${fmtTime(endMins)}`;

const buildUjiCobaSlots = (jenjang) => {
  const isSD = jenjang === 'SD';
  const chestList = LOTTERY_CHEST_MAP[jenjang].slice(0, 18);
  const effectiveMins = isSD ? 8 : 12;

  return chestList.map((chest, idx) => {
    const enterArenaMins = 7 * 60 + idx * 15; // 07.00 s.d. 11.15 (18 slot @ 15 menit)
    const finishArenaMins = enterArenaMins + effectiveMins;
    const exitArenaMins = enterArenaMins + 15;
    return {
      no: `${jenjang}-${chest}`,
      lotNumber: idx + 1,
      category: isSD ? 'SD/MI Sederajat' : 'SMP/MTs Sederajat',
      arena: isSD ? 'Arena 1 (Lap. Basket)' : 'Arena 2 (Pelataran Embung)',
      arrival: fmtTime(enterArenaMins - 30),
      transit: fmtTime(enterArenaMins - 15),
      callDP: fmtTime(enterArenaMins - 15),
      checkDP1: fmtRange(enterArenaMins - 15, enterArenaMins - 5),
      enterDP2: fmtRange(enterArenaMins - 5, enterArenaMins),
      enterArena: fmtTime(enterArenaMins),
      finishArena: fmtTime(finishArenaMins),
      exitArena: fmtTime(exitArenaMins),
      leaveCampus: `Maks. ${fmtTime(exitArenaMins + 30)}`,
      allocation: isSD ? '8 Mnt Bersih + 5 Mnt Transisi' : '12 Mnt Bersih + 5 Mnt Transisi',
      session: 'Uji Coba Paralel (07.00 - 11.30 WIB)',
    };
  });
};

const buildHariHSlots = (jenjang) => {
  const isSD = jenjang === 'SD';
  const chestList = LOTTERY_CHEST_MAP[jenjang].slice(0, 18);
  const durationMins = isSD ? 8 : 12;
  const warningMins = isSD ? 7 : 11;

  return chestList.map((chest, idx) => {
    const isSesi1 = idx < 14; // Urutan 1 s.d. 14: 08.00 - 11.30; Urutan 15 s.d. 18: 12.30 - 13.30
    const startTampilMins = isSesi1
      ? 8 * 60 + idx * 15
      : 12 * 60 + 30 + (idx - 14) * 15;

    const warningAt = startTampilMins + warningMins;
    const stopAt = startTampilMins + durationMins;
    const exitAt = startTampilMins + 15;

    return {
      no: `${jenjang}-${chest}`,
      lotNumber: idx + 1,
      category: isSD ? 'SD/MI Sederajat' : 'SMP/MTs Sederajat',
      arena: isSD ? 'Arena 1 (Lap. Basket)' : 'Arena 2 (Pelataran Embung)',
      readyBasecamp: fmtTime(startTampilMins - 30),
      callDP1: fmtTime(startTampilMins - 15),
      checkDP1: fmtRange(startTampilMins - 15, startTampilMins - 5),
      enterDP2: fmtRange(startTampilMins - 5, startTampilMins),
      enterArena: fmtTime(startTampilMins),
      startTampil: fmtTime(startTampilMins),
      warningPeluit: `${fmtTime(warningAt)} (Peluit 1x)`,
      stopPeluit: `${fmtTime(stopAt)} (Peluit 2x)`,
      exitArena: fmtTime(exitAt),
      session: isSesi1 ? 'Sesi I (Pagi)' : 'Sesi II (Siang)',
    };
  });
};

export const UJI_COBA_SCHEDULE = {
  SD: buildUjiCobaSlots('SD'),
  SMP: buildUjiCobaSlots('SMP'),
};

export const HARI_H_SCHEDULE = {
  SD: buildHariHSlots('SD'),
  SMP: buildHariHSlots('SMP'),
};

export function getScheduleMatrixForJenjang(jenjang = 'SD') {
  const key = String(jenjang || 'SD').toUpperCase().includes('SMP') ? 'SMP' : 'SD';
  return (HARI_H_SCHEDULE[key] || []).map((slot) => ({
    ...slot,
    dp1: slot.callDP1,
    tampil: slot.startTampil,
  }));
}
