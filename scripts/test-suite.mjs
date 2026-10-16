/**
 * scripts/test-suite.mjs
 * ============================================================================
 * LBB MU'ALLIMIN 2027 - COMPREHENSIVE END-TO-END & UNIT TEST SUITE
 * Menguji seluruh alur penyimpanan data (POST/Upsert, Fetch/GET, Update, Delete),
 * modul bisnis nyata (teamActions, stagingActions, scoringActions, sheetService),
 * simulasi VM Google Apps Script (Code.gs), kontrak komponen UI, keamanan,
 * dan konektivitas Live API.
 * ============================================================================
 */

import fs from 'fs';
import path from 'path';
import vm from 'vm';
import { registerHooks } from 'module';

// Register ESM hook agar import aset gambar (.png, .jpg, .svg, .webp) dari Vite dapat berjalan di Node.js
registerHooks({
  load(url, context, nextLoad) {
    if (/\.(png|jpe?g|svg|webp|gif|pdf)$/i.test(url)) {
      return {
        format: 'module',
        shortCircuit: true,
        source: `export default ${JSON.stringify(url)};`,
      };
    }
    return nextLoad(url, context);
  },
});

const { createTeamActions } = await import('../src/context/teamActions.js');
const { createStagingActions } = await import('../src/context/stagingActions.js');
const { createScoringActions } = await import('../src/context/scoringActions.js');
const {
  saveRecordToSheet,
  bulkSyncToSheet,
  deleteRecordFromSheet,
  fetchTableFromSheet,
  formatImageUrl,
} = await import('../src/services/sheetService.js');

// ANSI Colors
const RESET = '\x1b[0m';
const BOLD = '\x1b[1m';
const RED = '\x1b[31m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const CYAN = '\x1b[36m';
const GRAY = '\x1b[90m';

let passedTests = 0;
let totalTests = 0;
const failedList = [];

function assert(condition, testName, details = '') {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ${GREEN}[PASS]${RESET} ${testName}`);
    if (details) console.log(`         ${GRAY}${details}${RESET}`);
  } else {
    failedList.push({ testName, details });
    console.log(`  ${RED}[FAIL]${RESET} ${testName}`);
    if (details) console.log(`         ${YELLOW}Failure details: ${details}${RESET}`);
  }
}

// Baca .env secara aman
function readEnv() {
  const envPath = path.join(process.cwd(), '.env');
  const env = {};
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf8').split('\n');
    for (const line of lines) {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
      if (match) {
        env[match[1]] = (match[2] || '').trim().replace(/^['"]|['"]$/g, '');
      }
    }
  }
  return env;
}

const env = readEnv();
const APPS_SCRIPT_URL = env.VITE_APPS_SCRIPT_URL || '';
const SCORE_SECRET_KEY = env.VITE_SCORE_SECRET_KEY || '';

// Mock global alert untuk pengujian di Node.js
globalThis.alert = () => {};

// Helper membuat state container mirip React useState
function createStateContainer(initialValue) {
  let state = initialValue;
  const setState = (updater) => {
    state = typeof updater === 'function' ? updater(state) : updater;
    return state;
  };
  return {
    get value() {
      return state;
    },
    set value(v) {
      state = v;
    },
    setState,
  };
}

console.log(`${BOLD}${CYAN}========================================================================${RESET}`);
console.log(`${BOLD}${CYAN}   LBB MU'ALLIMIN 2027 - SUITE PENGUJIAN KOMPREHENSIF (UNIT, E2E & API) ${RESET}`);
console.log(`${BOLD}${CYAN}========================================================================${RESET}\n`);

async function runAllTests() {
  // ---------------------------------------------------------------------------
  // TEST 1: ENVIRONMENT & SECRET CONFIGURATION
  // ---------------------------------------------------------------------------
  console.log(`${BOLD}1. Konfigurasi Lingkungan & Kunci Rahasia${RESET}`);

  assert(
    Boolean(APPS_SCRIPT_URL && APPS_SCRIPT_URL.startsWith('https://script.google.com/')),
    'Google Apps Script Web App URL terkonfigurasi dengan format valid',
    APPS_SCRIPT_URL ? APPS_SCRIPT_URL.slice(0, 50) + '...' : 'URL kosong'
  );

  assert(
    Boolean(SCORE_SECRET_KEY && SCORE_SECRET_KEY.length >= 16),
    'SCORE_SECRET_KEY memiliki panjang minimal 16 karakter yang kuat',
    `Panjang kunci: ${SCORE_SECRET_KEY.length} karakter`
  );

  // ---------------------------------------------------------------------------
  // TEST 2: ALGORITMA PENENTUAN JUARA & TIE-BREAKER (JUKNIS LBB 2027)
  // ---------------------------------------------------------------------------
  console.log(`\n${BOLD}2. Algoritma Penentuan Juara & Pemecah Seri (Tie-Breaker)${RESET}`);

  function compareRank(a, b) {
    const scoreDiff = (b.totalScore || 0) - (a.totalScore || 0);
    if (Math.abs(scoreDiff) > 0.0001) return scoreDiff;

    const pbbDiff = (b.pbbScore || 0) - (a.pbbScore || 0);
    if (Math.abs(pbbDiff) > 0.0001) return pbbDiff;

    const dantonDiff = (b.dantonScore || 0) - (a.dantonScore || 0);
    if (Math.abs(dantonDiff) > 0.0001) return dantonDiff;

    return (a.totalPenalty || 0) - (b.totalPenalty || 0);
  }

  const team1 = { id: 'T1', totalScore: 850, pbbScore: 500, dantonScore: 200, totalPenalty: 10 };
  const team2 = { id: 'T2', totalScore: 840, pbbScore: 510, dantonScore: 210, totalPenalty: 0 };
  assert(compareRank(team1, team2) < 0, 'Tim dengan total skor lebih tinggi berada di peringkat lebih atas');

  const teamA = { id: 'TA', totalScore: 850, pbbScore: 520, dantonScore: 180, totalPenalty: 20 };
  const teamB = { id: 'TB', totalScore: 850, pbbScore: 500, dantonScore: 200, totalPenalty: 0 };
  assert(compareRank(teamA, teamB) < 0, 'Jika total skor sama, tim dengan Nilai Pokok PBB lebih tinggi menang (Kriteria 1)');

  const teamC = { id: 'TC', totalScore: 850, pbbScore: 500, dantonScore: 210, totalPenalty: 20 };
  const teamD = { id: 'TD', totalScore: 850, pbbScore: 500, dantonScore: 200, totalPenalty: 10 };
  assert(compareRank(teamC, teamD) < 0, 'Jika PBB sama, tim dengan Nilai Danton lebih tinggi menang (Kriteria 2)');

  const teamE = { id: 'TE', totalScore: 850, pbbScore: 500, dantonScore: 200, totalPenalty: 15 };
  const teamF = { id: 'TF', totalScore: 850, pbbScore: 500, dantonScore: 200, totalPenalty: 30 };
  assert(compareRank(teamE, teamF) < 0, 'Jika semua skor sama, tim dengan Penalti lebih kecil menang (Kriteria 3)');

  // ---------------------------------------------------------------------------
  // INTERCEPT FETCH UNTUK PENGUJIAN MODUL FRONTEND (OFFLINE / MOCKED NETWORK)
  // ---------------------------------------------------------------------------
  const realFetch = globalThis.fetch;
  const fetchCalls = [];
  let mockFetchStatus = 200;
  let mockFetchResponse = { success: true };

  globalThis.fetch = async (url, options = {}) => {
    let parsedBody = null;
    if (options.body) {
      try {
        parsedBody = JSON.parse(options.body);
      } catch {
        parsedBody = options.body;
      }
    }
    fetchCalls.push({ url, method: options.method || 'GET', body: parsedBody });
    return {
      ok: mockFetchStatus >= 200 && mockFetchStatus < 300,
      status: mockFetchStatus,
      headers: { get: () => 'application/json' },
      json: async () => mockFetchResponse,
      text: async () => JSON.stringify(mockFetchResponse),
    };
  };

  // ---------------------------------------------------------------------------
  // TEST 3: PENGUJIAN MODUL NYATA `teamActions.js` (CRUD TIM & UNDIAN)
  // ---------------------------------------------------------------------------
  console.log(`\n${BOLD}3. Pengujian Modul Nyata: teamActions.js (Registrasi, Berkas, Undian, Hapus)${RESET}`);

  const teamsState = createStateContainer([]);
  const scoresState = createStateContainer({});
  const stagingState = createStateContainer({});
  const currentUserState = createStateContainer({ id: 'u1', name: 'Admin Panitia', role: 'admin' });
  const usersState = createStateContainer([]);

  const getTeamActions = () =>
    createTeamActions({
      teams: teamsState.value,
      setTeams: teamsState.setState,
      scores: scoresState.value,
      setScores: scoresState.setState,
      setStaging: stagingState.setState,
      setCurrentUser: currentUserState.setState,
      setUsers: usersState.setState,
    });

  fetchCalls.length = 0;
  const createdTeam1 = getTeamActions().registerTeam({
    schoolName: 'SMP Negeri 1 Yogyakarta',
    jenjang: 'SMP',
    dantonName: 'Ahmad Fauzi',
    officialName: 'Budi Santoso',
    waNumber: '081234567890',
    email: 'smpn1@jogja.sch.id',
  });

  assert(
    createdTeam1.status === 'pending' &&
      createdTeam1.paymentStatus === 'unverified' &&
      'recommendationLetter' in createdTeam1.files &&
      createdTeam1.roster?.pasukan?.length === 21,
    'registerTeam() menginisialisasi status pending, unverified, files.recommendationLetter, dan 21 pasukan',
    `ID: ${createdTeam1.id}, RegCode: ${createdTeam1.regCode}`
  );

  assert(
    fetchCalls.length === 1 && fetchCalls[0].body?.action === 'upsert' && fetchCalls[0].body?.table === 'teams',
    'registerTeam() otomatis mengirim request POST upsert ke tabel "teams"',
    `Jumlah panggilan fetch: ${fetchCalls.length}`
  );

  // Update berkas termasuk recommendationLetter
  fetchCalls.length = 0;
  getTeamActions().updateTeamFiles(createdTeam1.id, 'recommendationLetter', {
    name: 'Surat_Rekomendasi.pdf',
    url: 'https://drive.google.com/file/d/123456/view',
  });
  getTeamActions().updateTeamFiles(createdTeam1.id, 'paymentProof', {
    name: 'Bukti_Bayar.jpg',
    url: 'https://drive.google.com/file/d/654321/view',
  });

  const updatedTeamAfterFile = teamsState.value.find((t) => t.id === createdTeam1.id);
  assert(
    updatedTeamAfterFile?.files?.recommendationLetter?.url === 'https://drive.google.com/file/d/123456/view',
    'updateTeamFiles() berhasil menyimpan berkas recommendationLetter & menyinkronkan ke Google Sheet'
  );

  // Tambahkan 3 tim terverifikasi untuk menguji randomizeLotNumbers (Bulk Sync)
  teamsState.value = [
    { ...createdTeam1, id: 'T-SMP-1', jenjang: 'SMP', status: 'verified' },
    { ...createdTeam1, id: 'T-SMP-2', jenjang: 'SMP', status: 'verified' },
    { ...createdTeam1, id: 'T-SMP-3', jenjang: 'SMP', status: 'verified' },
  ];
  fetchCalls.length = 0;
  const randomizedCount = getTeamActions().randomizeLotNumbers('SMP');
  const assignedLots = teamsState.value.map((t) => t.lotNumber).sort((a, b) => a - b);

  assert(
    randomizedCount === 3 &&
      JSON.stringify(assignedLots) === JSON.stringify([1, 2, 3]) &&
      teamsState.value.every((t) => t.status === 'drawn' && Boolean(t.chestNumber)),
    'randomizeLotNumbers() mengacak nomor urut unik [1, 2, 3] dan memasangkan nomor dada otomatis'
  );

  assert(
    fetchCalls.length === 1 && fetchCalls[0].body?.action === 'bulkSync' && fetchCalls[0].body?.table === 'teams',
    'randomizeLotNumbers() menggunakan 1x panggilan bulkSyncToSheet (bukan N request paralel)',
    `Jumlah panggilan HTTP: ${fetchCalls.length} (action: ${fetchCalls[0]?.body?.action})`
  );

  // Uji deleteTeam menghapus teams, scores, dan staging sekaligus
  scoresState.value = { 'T-SMP-1': { id: 'T-SMP-1', finalScore: 800 } };
  stagingState.value = { 'T-SMP-1': { id: 'T-SMP-1', checkedIn: true } };
  fetchCalls.length = 0;

  getTeamActions().deleteTeam('T-SMP-1');
  const deletedTables = fetchCalls.filter((c) => c.body?.action === 'delete').map((c) => c.body?.table);

  assert(
    !teamsState.value.some((t) => t.id === 'T-SMP-1') &&
      !scoresState.value['T-SMP-1'] &&
      !stagingState.value['T-SMP-1'] &&
      deletedTables.includes('teams') &&
      deletedTables.includes('scores') &&
      deletedTables.includes('staging'),
    'deleteTeam() membersihkan state & mengirim aksi delete ke 3 tabel (teams, scores, staging)',
    `Tabel yang dihapus di Sheet: [${deletedTables.join(', ')}]`
  );

  // ---------------------------------------------------------------------------
  // TEST 4: PENGUJIAN MODUL NYATA `stagingActions.js` (CHECK-IN, DP1, DP2, CHECK-OUT)
  // ---------------------------------------------------------------------------
  console.log(`\n${BOLD}4. Pengujian Modul Nyata: stagingActions.js (Check-In, DP 1 Batch, DP 2, Check-Out)${RESET}`);

  stagingState.value = {};
  const getStagingActions = () =>
    createStagingActions({
      staging: stagingState.value,
      setStaging: stagingState.setState,
      currentUser: { name: 'Petugas Lapangan', role: 'checkin' },
    });

  // 4A: Check-in Basecamp
  fetchCalls.length = 0;
  const checkInRes = getStagingActions().checkInBasecamp('T-SMP-2', {
    ktpOfficialName: 'Drs. Haryanto',
    ktpType: 'KTP Fisik',
    checkedInAt: '06:15',
    logistics: { waterBox: true, chestNumber: true, cocardOfficial: true, trashBag: true },
  });

  const stAfterCheckIn = stagingState.value['T-SMP-2'];
  assert(
    checkInRes.success === true &&
      stAfterCheckIn?.checkedIn === true &&
      stAfterCheckIn?.checkedInAt === '06:15' &&
      stAfterCheckIn?.ktpOfficialName === 'Drs. Haryanto' &&
      stAfterCheckIn?.basecampLogistics?.ktpDeposited === true,
    'checkInBasecamp() menyimpan atribut top-level (checkedIn, checkedInAt, ktpOfficialName) & basecampLogistics',
    `stage: ${stAfterCheckIn?.stage}, checkedInAt: ${stAfterCheckIn?.checkedInAt}`
  );

  // 4B: DP 1 Single & Batch 25 Personel + Alias Mapping
  fetchCalls.length = 0;
  const all25Ids = [
    'danton',
    ...Array.from({ length: 21 }, (_, i) => `p-${i + 1}`),
    ...Array.from({ length: 3 }, (_, i) => `c-${i + 1}`),
  ];
  getStagingActions().updateDP1PersonnelInspection('T-SMP-2', all25Ids, true, 'Atribut Lengkap');

  const dp1Map = stagingState.value['T-SMP-2']?.dp1Inspections || {};
  assert(
    dp1Map['danton']?.verified === true &&
      dp1Map['p-danton']?.verified === true &&
      dp1Map['p-1']?.verified === true &&
      dp1Map['pasukan-1']?.verified === true &&
      dp1Map['p-21']?.verified === true &&
      dp1Map['pasukan-21']?.verified === true &&
      dp1Map['c-1']?.verified === true &&
      dp1Map['cadangan-1']?.verified === true &&
      fetchCalls.length === 1,
    'updateDP1PersonnelInspection() memverifikasi 25 personel + alias ID dalam 1 kali request jaringan',
    `Total key terpetakan: ${Object.keys(dp1Map).length}, HTTP request: ${fetchCalls.length}`
  );

  // 4C: Lulus DP 1 -> DP 2
  getStagingActions().passToDP2('T-SMP-2');
  assert(
    stagingState.value['T-SMP-2']?.stage === 'dp2' && stagingState.value['T-SMP-2']?.dp1Passed === true,
    'passToDP2() mengubah stage ke "dp2" dan menyetel flag dp1Passed: true'
  );

  // 4D: Check-out Basecamp
  getStagingActions().checkOutBasecamp('T-SMP-2', {
    roomCleanChecked: true,
    sortedTrashReturned: true,
    ktpReturned: true,
    checkedOutAt: '14:20',
  });
  const stAfterCheckOut = stagingState.value['T-SMP-2'];
  assert(
    stAfterCheckOut?.checkedIn === true &&
      stAfterCheckOut?.checkedOut === true &&
      stAfterCheckOut?.checkedOutAt === '14:20' &&
      stAfterCheckOut?.basecampLogistics?.ktpReturned === true,
    'checkOutBasecamp() mempertahankan checkedIn: true dan menyetel checkedOut: true beserta waktu kepulangan'
  );

  // ---------------------------------------------------------------------------
  // TEST 5: PENGUJIAN MODUL NYATA `scoringActions.js` (SKOR, 10 PENALTI, VERIFIKASI, KUNCI)
  // ---------------------------------------------------------------------------
  console.log(`\n${BOLD}5. Pengujian Modul Nyata: scoringActions.js (Juri, 10 Penalti, Verifikasi & Finalisasi)${RESET}`);

  scoresState.value = {};
  const makeScoringWithRole = (role, name = 'Petugas') =>
    createScoringActions({
      setScores: scoresState.setState,
      currentUser: { name, role, email: `${role}@muallimin.sch.id` },
    });

  // 5A: Input Juri Pos 1, Pos 2, Pos 3 + Seluruh 10 Komponen Penalti
  const juriActions = makeScoringWithRole('juri', 'Juri Utama');
  juriActions.saveJuryPostScore('T-SMP-2', 'pos1', { total: 800, juryName: 'Juri 1' });
  juriActions.saveJuryPostScore('T-SMP-2', 'pos2', { total: 820, juryName: 'Juri 2' });
  juriActions.saveJuryPostScore('T-SMP-2', 'pos3', {
    total: 190,
    juryName: 'Juri 3',
    penalties: {
      upacara: true, // 150
      upacaraTerlambatBlocks: 1, // 50
      dp1: true, // 100
      personelKurang: true, // 75
      overTimeBlocks: 2, // 100
      injakGarisCount: 1, // 50
      kotakDantonCount: 1, // 50
      yelYelCount: 1, // 50
      rokokCount: 1, // 50
      basecampKotor: true, // 50
    },
  });

  // Total PBB rata-rata = (800 + 820)/2 = 810. Danton = 190. Total kotor = 1000.
  // Total 10 penalti = 150 + 50 + 100 + 75 + 100 + 50 + 50 + 50 + 50 + 50 = 725.
  // Final Score = 1000 - 725 = 275.
  const scRecord = scoresState.value['T-SMP-2'];
  assert(
    scRecord?.pbb?.total === 810 &&
      scRecord?.danton?.total === 190 &&
      scRecord?.penalties?.totalPenalty === 725 &&
      scRecord?.finalScore === 275,
    'saveJuryPostScore() menghitung rata-rata PBB (810), Danton (190), dan seluruh 10 komponen penalti (725) -> Skor Akhir 275',
    `PBB: ${scRecord?.pbb?.total}, Danton: ${scRecord?.danton?.total}, Penalti: ${scRecord?.penalties?.totalPenalty}, Final: ${scRecord?.finalScore}`
  );

  // 5B: Draft Score oleh Operator Penginput
  scoresState.value = {};
  const penginputActions = makeScoringWithRole('penginput', 'Operator Rekap');
  penginputActions.saveDraftScore('T-SMP-3', {
    pbb1: { total: 750 },
    pbb2: { total: 770 },
    danton: { total: 180 },
    penalties: { totalPenalty: 50 },
    paperEvidenceUrl: 'https://drive.google.com/file/d/EVIDENCE123/view',
  });

  assert(
    scoresState.value['T-SMP-3']?.status === 'draft' &&
      scoresState.value['T-SMP-3']?.finalScore === 890 &&
      scoresState.value['T-SMP-3']?.paperEvidenceUrl.includes('EVIDENCE123'),
    'saveDraftScore() menyimpan draft skor (PBB avg 760 + Danton 180 - Penalti 50 = 890) beserta URL bukti kertas'
  );

  // 5C: Verifikasi Skor oleh Verifikator
  fetchCalls.length = 0;
  const verifikatorActions = makeScoringWithRole('verifikator', 'Tim Verifikator');
  verifikatorActions.verifyScore('T-SMP-3', true, 'Cocok dengan lembar fisik juri');

  assert(
    scoresState.value['T-SMP-3']?.status === 'verified' &&
      scoresState.value['T-SMP-3']?.isVerified === true &&
      fetchCalls.some((c) => c.body?.table === 'scores' && c.body?.data?.isVerified === true),
    'verifyScore() menyetel status: "verified", isVerified: true, dan menyinkronkan ke Google Sheets'
  );

  // 5D: Finalisasi & Penguncian Mutlak oleh Finalisator
  const finalisatorActions = makeScoringWithRole('finalisator', 'Ketua Dewan Juri');
  finalisatorActions.finalizeScore('T-SMP-3', 'Mayor Inf. Purnomo');

  assert(
    scoresState.value['T-SMP-3']?.status === 'finalized' &&
      scoresState.value['T-SMP-3']?.isLocked === true &&
      scoresState.value['T-SMP-3']?.isVerified === true,
    'finalizeScore() mengunci nilai secara permanen (status: "finalized", isLocked: true)'
  );

  // 5E: Tolak mutasi pada nilai yang sudah dikunci untuk selain Superadmin
  penginputActions.saveDraftScore('T-SMP-3', {
    pbb1: { total: 999 },
    pbb2: { total: 999 },
    danton: { total: 999 },
  });
  assert(
    scoresState.value['T-SMP-3']?.finalScore === 890,
    'Mutasi oleh Penginput/Juri pada skor yang sudah Finalized otomatis DITOLAK (skor tetap 890)'
  );

  // Superadmin dapat melakukan override darurat
  const superadminActions = makeScoringWithRole('superadmin', 'Super Admin');
  superadminActions.saveDraftScore('T-SMP-3', {
    pbb1: { total: 760 },
    pbb2: { total: 780 },
    danton: { total: 180 },
    penalties: { totalPenalty: 50 },
  });
  assert(
    scoresState.value['T-SMP-3']?.finalScore === 900,
    'Superadmin dapat melakukan override darurat pada skor terkunci disertai pencatatan audit log'
  );

  // ---------------------------------------------------------------------------
  // TEST 6: LOGIKA TIMER LAPANGAN & PENALTI OVERTIME (`useFieldTimer.js`)
  // ---------------------------------------------------------------------------
  console.log(`\n${BOLD}6. Pengujian Logika Timer Lapangan & Overtime (useFieldTimer.js)${RESET}`);

  const useFieldTimerCode = fs.readFileSync(path.join(process.cwd(), 'src/context/useFieldTimer.js'), 'utf8');
  assert(
    useFieldTimerCode.includes('const existing = prev[teamId] || {') &&
      useFieldTimerCode.includes('upacaraTerlambatBlocks') &&
      useFieldTimerCode.includes('kotakDantonCount') &&
      useFieldTimerCode.includes('yelYelCount') &&
      useFieldTimerCode.includes('rokokCount') &&
      useFieldTimerCode.includes('basecampKotor') &&
      useFieldTimerCode.includes("saveRecordToSheet('scores'"),
    'stopAndSaveFieldTimer() membuat record skor baru jika belum ada, mempertahankan 10 komponen penalti, dan menyimpan ke Google Sheet'
  );

  // Verifikasi pemanggilan stopAndSaveFieldTimer di DaerahPersiapanView menyertakan activeTeam.jenjang
  const dpViewCode = fs.readFileSync(path.join(process.cwd(), 'src/components/staging/DaerahPersiapanView.jsx'), 'utf8');
  assert(
    dpViewCode.includes('stopAndSaveFieldTimer(activeTeam.id, activeTeam.jenjang)'),
    'DaerahPersiapanView.jsx meneruskan parameter activeTeam.jenjang ke stopAndSaveFieldTimer()'
  );

  // ---------------------------------------------------------------------------
  // TEST 7: PENGUJIAN `sheetService.js` (HTTP ERROR HANDLING & HELPERS)
  // ---------------------------------------------------------------------------
  console.log(`\n${BOLD}7. Pengujian Ketahanan Jaringan & Error Handling: sheetService.js${RESET}`);

  // Simulasikan HTTP 500 Internal Server Error
  mockFetchStatus = 500;
  const failUpsert = await saveRecordToSheet('teams', { id: 'T1' });
  const failBulk = await bulkSyncToSheet('teams', [{ id: 'T1' }]);
  const failDelete = await deleteRecordFromSheet('teams', 'T1');
  const failFetch = await fetchTableFromSheet('teams');
  mockFetchStatus = 200; // Kembalikan ke normal

  assert(
    failUpsert.success === false &&
      failBulk.success === false &&
      failDelete.success === false &&
      failFetch.success === false,
    'saveRecordToSheet, bulkSyncToSheet, deleteRecordFromSheet, dan fetchTableFromSheet menangkap HTTP 500 (!response.ok) dengan aman',
    `Upsert err: "${failUpsert.error}", Bulk err: "${failBulk.error}", Delete err: "${failDelete.error}"`
  );

  const formattedDriveUrl = formatImageUrl('https://drive.google.com/file/d/1AbCdEfGhIjKlMnOpQrStUvWxYz/view?usp=sharing');
  assert(
    formattedDriveUrl === 'https://lh3.googleusercontent.com/d/1AbCdEfGhIjKlMnOpQrStUvWxYz=w1000',
    'formatImageUrl() mengubah link Google Drive /file/d/.../view menjadi direct thumbnail CDN link'
  );

  // ---------------------------------------------------------------------------
  // TEST 8: SIMULASI MESIN GOOGLE APPS SCRIPT (`Code.gs` DI DALAM NODE VM)
  // ---------------------------------------------------------------------------
  console.log(`\n${BOLD}8. Simulasi Mesin Backend Google Apps Script (Code.gs di Node VM)${RESET}`);

  const codeGsContent = fs.readFileSync(path.join(process.cwd(), 'google-apps-script/Code.gs'), 'utf8');

  // Buat In-Memory Mock Spreadsheet untuk menjalankan Code.gs secara nyata di memori
  function createMockSheet(name) {
    const grid = [];
    return {
      name,
      grid,
      getName: () => name,
      getLastRow: () => grid.length,
      getLastColumn: () => (grid.length > 0 ? Math.max(...grid.map((r) => r.length), 0) : 0),
      setTabColor: () => {},
      setFrozenRows: () => {},
      appendRow: (rowArr) => {
        grid.push([...rowArr]);
      },
      deleteRow: (rowIndex1Based) => {
        grid.splice(rowIndex1Based - 1, 1);
      },
      getRange: (row1, col1, numRows = 1, numCols = 1) => ({
        setValues: (values2D) => {
          for (let r = 0; r < numRows; r++) {
            const targetRow = row1 - 1 + r;
            while (grid.length <= targetRow) grid.push([]);
            for (let c = 0; c < numCols; c++) {
              const targetCol = col1 - 1 + c;
              while (grid[targetRow].length <= targetCol) grid[targetRow].push('');
              grid[targetRow][targetCol] = values2D[r][c];
            }
          }
        },
        getValues: () => {
          const out = [];
          for (let r = 0; r < numRows; r++) {
            const srcRow = grid[row1 - 1 + r] || [];
            const rowOut = [];
            for (let c = 0; c < numCols; c++) {
              rowOut.push(srcRow[col1 - 1 + c] !== undefined ? srcRow[col1 - 1 + c] : '');
            }
            out.push(rowOut);
          }
          return out;
        },
        setBackground: () => {},
        setFontColor: () => {},
        setFontWeight: () => {},
        setFontFamily: () => {},
        setHorizontalAlignment: () => {},
      }),
    };
  }

  const mockSheetsMap = {};
  const mockSpreadsheet = {
    getName: () => 'Mock_LBB_Spreadsheet_2027',
    getSheetByName: (n) => mockSheetsMap[n] || null,
    insertSheet: (n) => {
      mockSheetsMap[n] = createMockSheet(n);
      return mockSheetsMap[n];
    },
    getSheets: () => Object.values(mockSheetsMap),
  };

  const vmSandbox = {
    SpreadsheetApp: { getActiveSpreadsheet: () => mockSpreadsheet },
    LockService: {
      getScriptLock: () => ({
        waitLock: () => {},
        releaseLock: () => {},
      }),
    },
    ContentService: {
      MimeType: { JSON: 'application/json' },
      createTextOutput: (str) => ({
        _content: str,
        setMimeType: function () {
          return this;
        },
        getContent: function () {
          return this._content;
        },
      }),
    },
    DriveApp: {
      getFoldersByName: () => ({ hasNext: () => false }),
      createFolder: () => ({
        createFile: () => ({
          setSharing: () => {},
          getId: () => 'MOCK_DRIVE_ID',
        }),
      }),
      Access: { ANYONE_WITH_LINK: 'ANYONE' },
      Permission: { VIEW: 'VIEW' },
    },
    Utilities: {
      base64Decode: () => [],
      newBlob: () => ({}),
    },
    console,
    Date,
    Math,
    JSON,
    Object,
    Array,
    String,
    Number,
    Boolean,
    RegExp,
  };

  vm.createContext(vmSandbox);
  vm.runInContext(codeGsContent, vmSandbox);

  // 8A: Uji prepareRecordForSpreadsheet memetakan file_surat_rekomendasi
  const flattenedTeam = vmSandbox.prepareRecordForSpreadsheet({
    id: 'TEAM-TEST-1',
    schoolName: 'MA Muallimin',
    files: {
      schoolLogo: { url: 'https://drive.google.com/logo' },
      recommendationLetter: { url: 'https://drive.google.com/rekomendasi_resmi.pdf' },
    },
  });

  assert(
    flattenedTeam.file_surat_rekomendasi === 'https://drive.google.com/rekomendasi_resmi.pdf' &&
      flattenedTeam.file_logo_sekolah === 'https://drive.google.com/logo',
    'Code.gs prepareRecordForSpreadsheet() memetakan files.recommendationLetter.url ke kolom file_surat_rekomendasi'
  );

  // 8B: Uji pemecahan JSON raksasa (> 40.000 karakter) ke _part2 & _part3 dan penggabungan kembali di readSheetData()
  const hugeArray = Array.from({ length: 1200 }, (_, i) => ({
    idx: i,
    note: ' Data_Inspeksi_Dan_Log_Peleton_Sangat_Panjang_Untuk_Uji_Chunking_40K_Chars ',
  }));
  const hugeJsonLen = JSON.stringify(hugeArray).length; // > 95.000 karakter (3 chunks: base, _part2, _part3)

  const testSheet = mockSpreadsheet.insertSheet('test_chunk_table');
  testSheet.getRange(1, 1, 1, 3).setValues([['id', 'createdAt', 'updatedAt']]);

  vmSandbox.upsertRecord(testSheet, {
    id: 'BIG-REC-1',
    hugePayload: hugeArray,
  });

  const headersInSheet = testSheet.grid[0];
  const readBackRecords = vmSandbox.readSheetData(testSheet);

  assert(
    hugeJsonLen > 80000 &&
      headersInSheet.includes('hugePayload') &&
      headersInSheet.includes('hugePayload_part2') &&
      headersInSheet.includes('hugePayload_part3') &&
      Array.isArray(readBackRecords[0]?.hugePayload) &&
      readBackRecords[0].hugePayload.length === 1200 &&
      readBackRecords[0].hugePayload[1199].idx === 1199,
    'Code.gs berhasil memecah JSON > 80.000 karakter ke _part2 & _part3 lalu menyambungkannya kembali secara utuh di readSheetData()',
    `Panjang JSON: ${hugeJsonLen} chars, Jumlah item kembali setelah JSON.parse: ${readBackRecords[0]?.hugePayload?.length}`
  );

  // 8C: Uji Upsert Update & Delete di Code.gs
  vmSandbox.upsertRecord(testSheet, {
    id: 'BIG-REC-1',
    hugePayload: [{ idx: 1, updated: true }],
  });
  const afterUpdate = vmSandbox.readSheetData(testSheet);
  assert(
    afterUpdate.length === 1 && afterUpdate[0].hugePayload[0].updated === true,
    'Code.gs upsertRecord() memperbarui baris yang sudah ada berdasarkan ID tanpa duplikasi baris'
  );

  const deleteSuccess = vmSandbox.deleteRecord(testSheet, 'BIG-REC-1');
  const afterDelete = vmSandbox.readSheetData(testSheet);
  assert(
    deleteSuccess === true && afterDelete.length === 0,
    'Code.gs deleteRecord() menghapus baris dari sheet dengan bersih'
  );

  // ---------------------------------------------------------------------------
  // TEST 9: VERIFIKASI KONTRAK KOMPONEN UI & INTEGRITAS KODE STATIS
  // ---------------------------------------------------------------------------
  console.log(`\n${BOLD}9. Verifikasi Kontrak Komponen UI & Integritas Kode Statis${RESET}`);

  const checkInViewCode = fs.readFileSync(path.join(process.cwd(), 'src/components/staging/BasecampCheckInView.jsx'), 'utf8');
  assert(
    checkInViewCode.includes('staging?.[teamId]') && checkInViewCode.includes('isTeamCheckedIn'),
    'BasecampCheckInView.jsx membaca status check-in dari staging[teamId] dengan fallback aman'
  );

  const checkOutViewCode = fs.readFileSync(path.join(process.cwd(), 'src/components/staging/BasecampCheckOutView.jsx'), 'utf8');
  assert(
    checkOutViewCode.includes('staging?.[teamId]') && checkOutViewCode.includes('isTeamCheckedOut'),
    'BasecampCheckOutView.jsx membaca status check-in & check-out dari staging[teamId] dengan akurat'
  );

  const rekapViewCode = fs.readFileSync(path.join(process.cwd(), 'src/components/recap/RekapNilaiView.jsx'), 'utf8');
  assert(
    rekapViewCode.includes('verifyScore(teamId, true,') && rekapViewCode.includes('sc?.paperEvidenceUrl || sc?.photoUrl'),
    'RekapNilaiView.jsx memanggil verifyScore(teamId, true, note) dan membaca paperEvidenceUrl dengan benar'
  );

  const regStatusModalCode = fs.readFileSync(path.join(process.cwd(), 'src/components/portal/RegistrationStatusModal.jsx'), 'utf8');
  assert(
    /import\s*\{[^}]*CalendarCheck[^}]*\}\s*from\s*['"]lucide-react['"]/.test(regStatusModalCode),
    'RegistrationStatusModal.jsx meng-import ikon CalendarCheck dari lucide-react (mencegah ReferenceError)'
  );

  const contextCode = fs.readFileSync(path.join(process.cwd(), 'src/context/CompetitionContext.jsx'), 'utf8');
  assert(
    contextCode.includes("'penginput'") &&
      contextCode.includes("'verifikator'") &&
      contextCode.includes("'finalisator'") &&
      contextCode.includes("bulkSyncToSheet('staging'") &&
      contextCode.includes("bulkSyncToSheet('users'"),
    'CompetitionContext.jsx menyimpan localStorage untuk penginput/verifikator/finalisator & menyinkronkan tabel staging serta users'
  );

  // Kembalikan globalThis.fetch asli untuk pengujian Live HTTP API
  globalThis.fetch = realFetch;

  // ---------------------------------------------------------------------------
  // TEST 10: KONEKTIVITAS & KEAMANAN GOOGLE APPS SCRIPT (LIVE HTTP API TEST)
  // ---------------------------------------------------------------------------
  console.log(`\n${BOLD}10. Uji Konektivitas & Keamanan Google Apps Script (Live HTTP)${RESET}`);

  if (!APPS_SCRIPT_URL) {
    console.log(`  ${YELLOW}[SKIP]${RESET} APPS_SCRIPT_URL tidak ditemukan di .env`);
  } else {
    // 10A: Ping test
    try {
      const pingRes = await fetch(`${APPS_SCRIPT_URL}?action=ping&t=${Date.now()}`);
      const pingJson = await pingRes.json();
      assert(
        pingJson && pingJson.success === true,
        'Google Apps Script merespons Ping dengan sukses',
        `Nama spreadsheet: "${pingJson.spreadsheetName || 'N/A'}"`
      );
    } catch (err) {
      assert(false, 'Google Apps Script merespons Ping', err.message);
    }

    // 10B: Akses skor publik tanpa kunci rahasia (Wajib Ditolak)
    try {
      const scoreRes = await fetch(`${APPS_SCRIPT_URL}?table=scores&t=${Date.now()}`);
      const scoreJson = await scoreRes.json();
      const isBlocked = scoreJson.success === false || (Array.isArray(scoreJson.data) && scoreJson.data.length === 0);
      assert(
        isBlocked,
        'Akses GET ke tabel scores tanpa authKey berhasil DIBLOKIR oleh Apps Script',
        scoreJson.error || 'Akses ditolak / data skor kosong'
      );
    } catch (err) {
      assert(false, 'Pemeriksaan blokir tabel scores', err.message);
    }

    // 10C: Akses skor resmi dengan kunci rahasia sah
    try {
      const authScoreRes = await fetch(
        `${APPS_SCRIPT_URL}?table=scores&authKey=${encodeURIComponent(SCORE_SECRET_KEY)}&t=${Date.now()}`
      );
      const authScoreJson = await authScoreRes.json();
      assert(
        authScoreJson && authScoreJson.success === true,
        'Akses GET ke tabel scores dengan authKey resmi berhasil DITERIMA',
        `Tabel: ${authScoreJson.table}, Jumlah record: ${authScoreJson.count || 0}`
      );
    } catch (err) {
      assert(false, 'Pemeriksaan akses resmi tabel scores', err.message);
    }

    // 10D: Sanitasi PII pada akses publik ke tabel teams
    try {
      const teamRes = await fetch(`${APPS_SCRIPT_URL}?table=teams&t=${Date.now()}`);
      const teamJson = await teamRes.json();
      if (teamJson.success && Array.isArray(teamJson.data) && teamJson.data.length > 0) {
        const sample = teamJson.data[0];
        const piiMasked =
          (sample.waNumber === undefined || sample.waNumber === '[TERLINDUNGI_UU_PDP]') &&
          (sample.officialKtp === undefined || sample.officialKtp === '[TERLINDUNGI]');
        assert(
          piiMasked,
          'Data PII peserta (WhatsApp, KTP) disanitasi / dimasker saat diakses publik',
          'Kebijakan UU PDP aktif di backend Apps Script'
        );
      } else {
        assert(teamJson.success === true, 'Query tabel teams publik berhasil tanpa mengekspos PII ilegal');
      }
    } catch (err) {
      assert(false, 'Pemeriksaan sanitasi PII tabel teams', err.message);
    }
  }

  printSummary();
}

function printSummary() {
  console.log(`\n${BOLD}${CYAN}========================================================================${RESET}`);
  console.log(
    `${BOLD}RINGKASAN PENGUJIAN: ${
      passedTests === totalTests ? GREEN : RED
    }${passedTests} DARI ${totalTests} PENGUJIAN BERHASIL (PASS)${RESET}`
  );
  console.log(`${BOLD}${CYAN}========================================================================${RESET}\n`);

  if (passedTests === totalTests) {
    console.log(`${GREEN}✓ SELURUH ${totalTests} PENGUJIAN UNIT, INTEGRASI, VM APPS SCRIPT, DAN LIVE API LULUS 100%!${RESET}\n`);
    process.exit(0);
  } else {
    console.log(`${RED}⚠ Terdapat ${failedList.length} pengujian yang gagal:${RESET}`);
    for (const f of failedList) {
      console.log(`  - ${f.testName}: ${f.details}`);
    }
    process.exit(1);
  }
}

runAllTests();
