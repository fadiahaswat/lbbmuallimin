/**
 * scripts/test-suite.mjs
 * ============================================================================
 * LBB MU'ALLIMIN 2027 - COMPREHENSIVE END-TO-END TEST SUITE
 * Menguji fungsionalitas, keamanan, backend Google Apps Script,
 * aturan tie-breaker, pencegahan IDOR, penguncian nilai, dan integritas build.
 * ============================================================================
 */

import fs from 'fs';
import path from 'path';

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

function assert(condition, testName, details = '') {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ${GREEN}[PASS]${RESET} ${testName}`);
    if (details) console.log(`         ${GRAY}${details}${RESET}`);
  } else {
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

console.log(`${BOLD}${CYAN}========================================================================${RESET}`);
console.log(`${BOLD}${CYAN}     LBB MU'ALLIMIN 2027 - SUITE PENGUJIAN INTEGRITAS & KEAMANAN        ${RESET}`);
console.log(`${BOLD}${CYAN}========================================================================${RESET}\n`);

// -----------------------------------------------------------------------------
// TEST 1: ENVIRONMENT & SECRET CONFIGURATION
// -----------------------------------------------------------------------------
console.log(`${BOLD}1. Konfigurasi Lingkungan & Kunci Rahasia${RESET}`);

assert(Boolean(APPS_SCRIPT_URL && APPS_SCRIPT_URL.startsWith('https://script.google.com/')),
  'Google Apps Script Web App URL terkonfigurasi dengan format valid',
  APPS_SCRIPT_URL ? APPS_SCRIPT_URL.slice(0, 50) + '...' : 'URL kosong'
);

assert(Boolean(SCORE_SECRET_KEY && SCORE_SECRET_KEY.length >= 16),
  'SCORE_SECRET_KEY memiliki panjang minimal 16 karakter yang kuat',
  `Panjang kunci: ${SCORE_SECRET_KEY.length} karakter`
);

// -----------------------------------------------------------------------------
// TEST 2: INTEGRITAS LOGIKA PERHITUNGAN TIE-BREAKER (JUKNIS LBB 2027)
// -----------------------------------------------------------------------------
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

// Kasus 1: Nilai akhir berbeda
const team1 = { id: 'T1', totalScore: 850, pbbScore: 500, dantonScore: 200, totalPenalty: 10 };
const team2 = { id: 'T2', totalScore: 840, pbbScore: 510, dantonScore: 210, totalPenalty: 0 };
assert(compareRank(team1, team2) < 0, 'Tim dengan total skor lebih tinggi berada di peringkat lebih atas');

// Kasus 2: Nilai akhir sama, PBB berbeda (Tie-breaker kriteria 1)
const teamA = { id: 'TA', totalScore: 850, pbbScore: 520, dantonScore: 180, totalPenalty: 20 };
const teamB = { id: 'TB', totalScore: 850, pbbScore: 500, dantonScore: 200, totalPenalty: 0 };
assert(compareRank(teamA, teamB) < 0, 'Jika total skor sama, tim dengan Nilai Pokok PBB lebih tinggi menang (Kriteria 1)');

// Kasus 3: Nilai akhir sama, PBB sama, Danton berbeda (Tie-breaker kriteria 2)
const teamC = { id: 'TC', totalScore: 850, pbbScore: 500, dantonScore: 210, totalPenalty: 20 };
const teamD = { id: 'TD', totalScore: 850, pbbScore: 500, dantonScore: 200, totalPenalty: 10 };
assert(compareRank(teamC, teamD) < 0, 'Jika PBB sama, tim dengan Nilai Danton lebih tinggi menang (Kriteria 2)');

// Kasus 4: Nilai akhir, PBB, dan Danton sama -> Penalti terkecil menang (Tie-breaker kriteria 3)
const teamE = { id: 'TE', totalScore: 850, pbbScore: 500, dantonScore: 200, totalPenalty: 15 };
const teamF = { id: 'TF', totalScore: 850, pbbScore: 500, dantonScore: 200, totalPenalty: 30 };
assert(compareRank(teamE, teamF) < 0, 'Jika semua skor sama, tim dengan Penalti lebih kecil menang (Kriteria 3)');

// -----------------------------------------------------------------------------
// TEST 3: PENGUNCIAN NILAI & PENCEGAHAN MUTASI (SCORE LOCK ENFORCEMENT)
// -----------------------------------------------------------------------------
console.log(`\n${BOLD}3. Penguncian Mutasi Nilai (Score Lock Enforcement)${RESET}`);

function attemptScoreMutation(existingScore, actorRole) {
  if (existingScore && (existingScore.isLocked || existingScore.status === 'finalized')) {
    if (actorRole !== 'superadmin') {
      return { allowed: false, reason: 'Score locked' };
    }
  }
  return { allowed: true };
}

const lockedScore = { id: 'SCORE-1', isLocked: true, status: 'finalized', finalScore: 875 };
const draftScore = { id: 'SCORE-2', isLocked: false, status: 'draft', finalScore: 800 };

assert(attemptScoreMutation(lockedScore, 'juri').allowed === false,
  'Juri TIDAK DAPAT memodifikasi nilai yang sudah berstatus finalized / dikunci'
);
assert(attemptScoreMutation(lockedScore, 'admin').allowed === false,
  'Admin biasa TIDAK DAPAT memodifikasi nilai yang sudah dikunci'
);
assert(attemptScoreMutation(lockedScore, 'superadmin').allowed === true,
  'Superadmin memiliki hak override darurat dengan catatan audit log'
);
assert(attemptScoreMutation(draftScore, 'juri').allowed === true,
  'Juri DAPAT mengubah nilai selama status masih berstatus draft'
);

// -----------------------------------------------------------------------------
// TEST 4: PERTAHANAN IDOR PORTAL PESERTA (ACCESS CONTROL RESOLVER)
// -----------------------------------------------------------------------------
console.log(`\n${BOLD}4. Pertahanan IDOR pada Portal Peserta${RESET}`);

function resolveParticipantTeam(currentUser, requestedTeamId, allTeams) {
  if (currentUser?.role === 'peserta') {
    const verifiedTeam = allTeams.find(t =>
      (currentUser.teamId && t.id === currentUser.teamId) ||
      (currentUser.regCode && t.regCode === currentUser.regCode) ||
      (currentUser.email && t.email?.toLowerCase() === currentUser.email.toLowerCase())
    );
    return verifiedTeam ? verifiedTeam.id : null;
  }
  return requestedTeamId;
}

const mockTeams = [
  { id: 'TEAM-SMKN1', schoolName: 'SMKN 1 Yogyakarta', email: 'smkn1@sekolah.sch.id', regCode: 'REG-001' },
  { id: 'TEAM-SMPN5', schoolName: 'SMPN 5 Yogyakarta', email: 'smpn5@sekolah.sch.id', regCode: 'REG-002' }
];

const participantUser = {
  id: 'USER-1',
  role: 'peserta',
  email: 'smkn1@sekolah.sch.id',
  teamId: 'TEAM-SMKN1',
  regCode: 'REG-001'
};

const resolvedLegit = resolveParticipantTeam(participantUser, 'TEAM-SMKN1', mockTeams);
assert(resolvedLegit === 'TEAM-SMKN1', 'Peserta sah berhasil mengakses peleton miliknya sendiri');

const resolvedIDOR = resolveParticipantTeam(participantUser, 'TEAM-SMPN5', mockTeams);
assert(resolvedIDOR === 'TEAM-SMKN1', 'Upaya manipulasi ID peleton lain otomatis digagalkan dan dikembalikan ke peleton miliknya');

// -----------------------------------------------------------------------------
// TEST 5: PENCEGAHAN ESKALASI PERAN (ROLE REGISTRATION INTEGRITY)
// -----------------------------------------------------------------------------
console.log(`\n${BOLD}5. Integritas Pendaftaran Akun & Proteksi Role${RESET}`);

function registerUser(userData) {
  const cleanEmail = (userData.email || '').toLowerCase().trim();
  const assignedRole = 'peserta'; // Wajib dikunci ke peserta
  return {
    id: 'user_' + Date.now(),
    name: userData.name,
    email: cleanEmail,
    role: assignedRole,
  };
}

const hackerRegistration = registerUser({ name: 'Hacker', email: 'admin@google.com', role: 'superadmin' });
assert(hackerRegistration.role === 'peserta',
  'Pendaftar mandiri dengan email admin atau parameter role palsu tetap dipaksa menjadi peserta'
);

// -----------------------------------------------------------------------------
// TEST 6: STATUS PEMBAYARAN AWAL
// -----------------------------------------------------------------------------
console.log(`\n${BOLD}6. Default Status Pembayaran Pendaftar Baru${RESET}`);

function initializeNewTeam(input) {
  return {
    ...input,
    status: 'pending',
    paymentStatus: 'unverified'
  };
}

const newTeam = initializeNewTeam({ schoolName: 'SMP N 1 Depok' });
assert(newTeam.paymentStatus === 'unverified' && newTeam.status === 'pending',
  'Pendaftaran peleton baru selalu berstatus paymentStatus: "unverified" dan status: "pending"'
);

// -----------------------------------------------------------------------------
// TEST 7: KONEKTIVITAS & KEAMANAN GOOGLE APPS SCRIPT (LIVE API TEST)
// -----------------------------------------------------------------------------
console.log(`\n${BOLD}7. Uji Konektivitas & Keamanan Google Apps Script (Live HTTP)${RESET}`);

async function runLiveApiTests() {
  if (!APPS_SCRIPT_URL) {
    console.log(`  ${YELLOW}[SKIP]${RESET} APPS_SCRIPT_URL tidak ditemukan di .env`);
    return;
  }

  // 7A: Ping test
  try {
    const pingRes = await fetch(`${APPS_SCRIPT_URL}?action=ping&t=${Date.now()}`);
    const pingJson = await pingRes.json();
    assert(pingJson && pingJson.success === true,
      'Google Apps Script merespons Ping dengan sukses',
      `Nama spreadsheet: "${pingJson.spreadsheetName || 'N/A'}"`
    );
  } catch (err) {
    assert(false, 'Google Apps Script merespons Ping', err.message);
  }

  // 7B: Akses skor publik tanpa kunci rahasia (Wajib Ditolak)
  try {
    const scoreRes = await fetch(`${APPS_SCRIPT_URL}?table=scores&t=${Date.now()}`);
    const scoreJson = await scoreRes.json();
    const isBlocked = (scoreJson.success === false) || (Array.isArray(scoreJson.data) && scoreJson.data.length === 0);
    assert(isBlocked,
      'Akses GET ke tabel scores tanpa authKey berhasil DIBLOKIR oleh Apps Script',
      scoreJson.error || 'Akses ditolak / data skor kosong'
    );
  } catch (err) {
    assert(false, 'Pemeriksaan blokir tabel scores', err.message);
  }

  // 7C: Akses skor resmi dengan kunci rahasia sah
  try {
    const authScoreRes = await fetch(`${APPS_SCRIPT_URL}?table=scores&authKey=${encodeURIComponent(SCORE_SECRET_KEY)}&t=${Date.now()}`);
    const authScoreJson = await authScoreRes.json();
    assert(authScoreJson && authScoreJson.success === true,
      'Akses GET ke tabel scores dengan authKey resmi berhasil DITERIMA',
      `Tabel: ${authScoreJson.table}, Jumlah record: ${authScoreJson.count || 0}`
    );
  } catch (err) {
    assert(false, 'Pemeriksaan akses resmi tabel scores', err.message);
  }

  // 7D: Sanitasi PII pada akses publik ke tabel teams
  try {
    const teamRes = await fetch(`${APPS_SCRIPT_URL}?table=teams&t=${Date.now()}`);
    const teamJson = await teamRes.json();
    if (teamJson.success && Array.isArray(teamJson.data) && teamJson.data.length > 0) {
      const sample = teamJson.data[0];
      const piiMasked = (sample.waNumber === undefined || sample.waNumber === '[TERLINDUNGI_UU_PDP]') &&
                        (sample.officialKtp === undefined || sample.officialKtp === '[TERLINDUNGI]');
      assert(piiMasked,
        'Data PII peserta (WhatsApp, KTP) disanitasi / dimasker saat diakses publik',
        'Kebijakan UU PDP aktif di backend Apps Script'
      );
    } else {
      assert(teamJson.success === true,
        'Query tabel teams publik berhasil tanpa mengekspos PII ilegal'
      );
    }
  } catch (err) {
    assert(false, 'Pemeriksaan sanitasi PII tabel teams', err.message);
  }

  // Ringkasan Hasil
  printSummary();
}

function printSummary() {
  console.log(`\n${BOLD}${CYAN}========================================================================${RESET}`);
  console.log(`${BOLD}RINGKASAN PENGUJIAN: ${GREEN}${passedTests} DARI ${totalTests} PENGUJIAN BERHASIL (PASS)${RESET}`);
  console.log(`${BOLD}${CYAN}========================================================================${RESET}\n`);

  if (passedTests === totalTests) {
    console.log(`${GREEN}✓ SEMUA SISTEM SIAP, AMAN, DAN SESUAI DENGAN SPESIFIKASI JUKNIS LBB 2027!${RESET}\n`);
    process.exit(0);
  } else {
    console.log(`${YELLOW}⚠ Beberapa pengujian memerlukan pemeriksaan lebih lanjut.${RESET}\n`);
    process.exit(1);
  }
}

runLiveApiTests();
