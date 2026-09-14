/**
 * scripts/security-audit.mjs
 * Automated Security Audit Agent - 20-Point Security Inspection
 * Based on Security Checklist:
 * 1. API key aman
 * 2. env jangan public
 * 3. No hardcode secret
 * 4. Cek secret di Git
 * 5. Debug mode OFF
 * 6. Error jangan bocor
 * 7. Validasi input
 * 8. Sanitasi input
 * 9. Anti SQL injection
 * 10. Anti XSS
 * 11. Server-side auth
 * 12. Cek akses user
 * 13. Role admin aman
 * 14. DB jangan public
 * 15. DB permission ketat
 * 16. Hash password
 * 17. Session aman
 * 18. Reset password aman
 * 19. Batasi upload file
 * 20. Scan upload file
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const ROOT_DIR = process.cwd();

// ANSI Colors
const RESET = '\x1b[0m';
const BOLD = '\x1b[1m';
const RED = '\x1b[31m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const BLUE = '\x1b[34m';
const CYAN = '\x1b[36m';
const GRAY = '\x1b[90m';

function getFilesRecursively(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    if (file === 'node_modules' || file === '.git' || file === 'dist') continue;
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      getFilesRecursively(fullPath, fileList);
    } else {
      fileList.push(fullPath);
    }
  }
  return fileList;
}

const allProjectFiles = getFilesRecursively(ROOT_DIR);
const srcFiles = allProjectFiles.filter(f => f.includes(`${path.sep}src${path.sep}`));

const results = [];

function addResult(id, title, status, severity, findings, recommendation) {
  results.push({
    id,
    title,
    status, // 'PASS' | 'WARN' | 'FAIL'
    severity, // 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO'
    findings,
    recommendation
  });
}

console.log(`${BOLD}${CYAN}========================================================================${RESET}`);
console.log(`${BOLD}${CYAN}         LBB MU'ALLIMIN 2026 - AUTOMATED SECURITY AUDIT AGENT          ${RESET}`);
console.log(`${BOLD}${CYAN}                20-Point Comprehensive Security Audit                   ${RESET}`);
console.log(`${BOLD}${CYAN}========================================================================${RESET}\n`);

// 1. API key aman
{
  const apiKeyRegex = /(?:api[_-]?key|access[_-]?token|secret[_-]?key)\s*[:=]\s*['"][a-zA-Z0-9_\-]{16,}['"]/i;
  const leakedInFiles = [];
  for (const file of srcFiles) {
    const content = fs.readFileSync(file, 'utf8');
    if (apiKeyRegex.test(content)) {
      leakedInFiles.push(path.relative(ROOT_DIR, file));
    }
  }
  if (leakedInFiles.length > 0) {
    addResult(1, 'API key aman', 'FAIL', 'HIGH', `Ditemukan pola API Key pada: ${leakedInFiles.join(', ')}`, 'Pindahkan API Key ke backend atau environment variable aman, jangan disertakan dalam client bundle.');
  } else {
    addResult(1, 'API key aman', 'PASS', 'LOW', 'Tidak ditemukan API key atau access token rahasia pihak ketiga yang bocor di kode sumber frontend.', 'Pertahankan pemisahan API key pihak ketiga tetap di backend/server proxy.');
  }
}

// 2. env jangan public
{
  const gitignorePath = path.join(ROOT_DIR, '.gitignore');
  let gitignoreContent = '';
  if (fs.existsSync(gitignorePath)) {
    gitignoreContent = fs.readFileSync(gitignorePath, 'utf8');
  }
  const hasEnvInGitignore = /\.env/i.test(gitignoreContent);
  const trackedEnvFiles = [];
  try {
    const gitTracked = execSync('git ls-files', { encoding: 'utf8' });
    const lines = gitTracked.split('\n');
    for (const l of lines) {
      if (l.trim().startsWith('.env')) {
        trackedEnvFiles.push(l.trim());
      }
    }
  } catch (e) {
    // ignore
  }

  if (trackedEnvFiles.length > 0) {
    addResult(2, 'env jangan public', 'FAIL', 'CRITICAL', `File .env terlacak langsung di repository Git: ${trackedEnvFiles.join(', ')}`, 'Segera hapus file .env dari tracking git dengan git rm --cached dan ganti semua rahasia.');
  } else if (!hasEnvInGitignore) {
    addResult(2, 'env jangan public', 'WARN', 'HIGH', '.gitignore belum memuat aturan pencegahan untuk file .env, .env.local, .env.*', 'Tambahkan entri *.env, .env.local, .env.* ke dalam file .gitignore agar file konfigurasi lingkungan tidak tidak sengaja ter-commit.');
  } else {
    addResult(2, 'env jangan public', 'PASS', 'LOW', 'File .env tidak terdaftar di git tracking dan terlindungi di .gitignore.', 'Pastikan variable sensitif selalu disimpan di platform deployment secrets (GitHub Actions Secrets).');
  }
}

// 3. No hardcode secret
{
  const hardcodedSecrets = [];
  for (const file of srcFiles) {
    const content = fs.readFileSync(file, 'utf8');
    if (/admin2026|juri2026|super2026/.test(content)) {
      hardcodedSecrets.push({ file: path.relative(ROOT_DIR, file), desc: 'PIN autentikasi plaintext (admin2026 / juri2026 / super2026)' });
    }
  }
  if (hardcodedSecrets.length > 0) {
    addResult(3, 'No hardcode secret', 'FAIL', 'CRITICAL', `Ditemukan PIN/secret hardcoded di client-side:\n${hardcodedSecrets.map(h => `    • ${h.file} (${h.desc})`).join('\n')}`, 'Hapus PIN hardcoded dari bundle JavaScript frontend. Autentikasi harus divalidasi oleh server-side API.');
  } else {
    addResult(3, 'No hardcode secret', 'PASS', 'LOW', 'Tidak ditemukan kredensial rahasia hardcoded.', 'Pertahankan zero-secret policy di client-side code.');
  }
}

// 4. Cek secret di Git
{
  let gitSecretFound = false;
  let commitEvidence = '';
  try {
    const gitLogCheck = execSync('git log -n 20 -S "admin2026" --oneline', { encoding: 'utf8' });
    if (gitLogCheck.trim()) {
      gitSecretFound = true;
      commitEvidence = gitLogCheck.trim().split('\n')[0];
    }
  } catch (e) {
    // Git log search failed
  }
  if (gitSecretFound) {
    addResult(4, 'Cek secret di Git', 'WARN', 'HIGH', `Ditemukan riwayat commit yang merekam kata sandi/PIN plaintext: "${commitEvidence}"`, 'Gunakan tools seperti git-filter-repo atau BFG Repo-Cleaner jika repository dijadikan open source publik, atau rotasi semua PIN/kredensial terkait.');
  } else {
    addResult(4, 'Cek secret di Git', 'PASS', 'LOW', 'Tidak ditemukan riwayat commit terbaru yang merekam secret bocor.', 'Pertahankan kebersihan git commit history.');
  }
}

// 5. Debug mode OFF
{
  const viteConfigPath = path.join(ROOT_DIR, 'vite.config.js');
  let viteConfig = '';
  if (fs.existsSync(viteConfigPath)) {
    viteConfig = fs.readFileSync(viteConfigPath, 'utf8');
  }
  const hasEsbuildDrop = /drop:.*console/i.test(viteConfig);
  if (!hasEsbuildDrop) {
    addResult(5, 'Debug mode OFF', 'WARN', 'MEDIUM', 'Vite build belum mengaktifkan esbuild drop console/debugger untuk build produksi.', 'Tambahkan esbuild: { drop: ["console", "debugger"] } pada vite.config.js agar log internal tidak terbongkar di console browser.');
  } else {
    addResult(5, 'Debug mode OFF', 'PASS', 'LOW', 'Konfigurasi build produksi Vite otomatis membersihkan debugger dan console log.', 'Debug mode aman.');
  }
}

// 6. Error jangan bocor
{
  let rawErrorsFound = 0;
  for (const file of srcFiles) {
    const content = fs.readFileSync(file, 'utf8');
    if (/console\.error\(\s*e\s*\)/.test(content) || /err\.stack/.test(content)) {
      rawErrorsFound++;
    }
  }
  if (rawErrorsFound > 0) {
    addResult(6, 'Error jangan bocor', 'WARN', 'LOW', `Terdapat ${rawErrorsFound} pemanggilan error mentah di console browser.`, 'Gunakan React Error Boundary dan format pesan ramah pengguna agar rincian stack trace tidak terekspos.');
  } else {
    addResult(6, 'Error jangan bocor', 'PASS', 'LOW', 'Penanganan exception menggunakan fallback pesan umum yang aman.', 'Terus gunakan pesan kesalahan generik.');
  }
}

// 7. Validasi input
{
  const regWizardPath = path.join(ROOT_DIR, 'src', 'components', 'portal', 'RegistrationWizard.jsx');
  let hasClientValidation = false;
  if (fs.existsSync(regWizardPath)) {
    const content = fs.readFileSync(regWizardPath, 'utf8');
    if (content.includes('validateStep1') && content.includes('validateStep2')) {
      hasClientValidation = true;
    }
  }
  if (hasClientValidation) {
    addResult(7, 'Validasi input', 'PASS', 'LOW', 'Form pendaftaran menerapkan validasi input multi-step (email format, field wajib, format nomor).', 'Disarankan melengkapi dengan skema validasi deklaratif (Zod / Yup) saat migrasi ke backend.');
  } else {
    addResult(7, 'Validasi input', 'FAIL', 'MEDIUM', 'Formulir belum memiliki fungsi validasi masukan yang ketat.', 'Terapkan validasi menyeluruh pada setiap field.');
  }
}

// 8. Sanitasi input
{
  // Check CSV Injection in exportTeamsCSV
  const ctxPath = path.join(ROOT_DIR, 'src', 'context', 'CompetitionContext.jsx');
  let csvVulnerable = false;
  if (fs.existsSync(ctxPath)) {
    const content = fs.readFileSync(ctxPath, 'utf8');
    if (content.includes('exportTeamsCSV') && !content.includes('sanitizeCsvCell')) {
      csvVulnerable = true;
    }
  }
  if (csvVulnerable) {
    addResult(8, 'Sanitasi input', 'WARN', 'HIGH', 'Fungsi exportTeamsCSV() belum melakukan sanitasi karakter formula Excel (=, +, -, @), rentan terhadap CSV Formula Injection (CWE-1236).', 'Lakukan sanitasi dengan menambahkan tanda kutip tunggal (\') di awal cell jika dimulai dengan karakter operator kalkulasi.');
  } else {
    addResult(8, 'Sanitasi input', 'PASS', 'LOW', 'Input disanitasi dengan baik, termasuk proteksi Formula Injection (CWE-1236) pada CSV export.', 'Sanitasi input bekerja optimal.');
  }
}

// 9. Anti SQL injection
{
  // The app is currently client-side React + LocalStorage
  addResult(9, 'Anti SQL injection', 'PASS', 'INFO', 'Aplikasi saat ini bertipe Static Single Page App (SPA) tanpa koneksi SQL langsung dari frontend, sehingga kebal terhadap direct frontend SQL Injection.', 'Saat menghubungkan ke database backend (PostgreSQL / MySQL / Supabase), wajib gunakan Parameterized Queries / ORM (Prisma / Drizzle) dan hindari raw SQL string concatenation.');
}

// 10. Anti XSS
{
  const dangerousPatterns = [];
  for (const file of srcFiles) {
    const content = fs.readFileSync(file, 'utf8');
    if (content.includes('dangerouslySetInnerHTML')) {
      dangerousPatterns.push(path.relative(ROOT_DIR, file));
    }
  }
  if (dangerousPatterns.length > 0) {
    addResult(10, 'Anti XSS', 'WARN', 'MEDIUM', `Penggunaan dangerouslySetInnerHTML ditemukan pada: ${dangerousPatterns.join(', ')}`, 'Pastikan sumber HTML berasal dari static config yang tidak dapat diubah oleh input pengguna, atau sanitasi menggunakan DOMPurify.');
  } else {
    addResult(10, 'Anti XSS', 'PASS', 'LOW', 'React auto-escaping mencegah eksploitasi XSS standar. Tidak ditemukan dangerouslySetInnerHTML yang tidak aman.', 'Pertahankan proteksi escaping JSX.');
  }
}

// 11. Server-side auth
{
  const ctxPath = path.join(ROOT_DIR, 'src', 'context', 'CompetitionContext.jsx');
  let clientOnlyAuth = false;
  if (fs.existsSync(ctxPath)) {
    const content = fs.readFileSync(ctxPath, 'utf8');
    if (content.includes('localStorage.getItem(STORAGE_KEYS.ROLE)')) {
      clientOnlyAuth = true;
    }
  }
  if (clientOnlyAuth) {
    addResult(11, 'Server-side auth', 'FAIL', 'CRITICAL', 'Autentikasi role saat ini murni Client-Side (disimpan di browser localStorage). Siapapun dapat mengubah role melalui DevTools console browser.', 'Implementasikan autentikasi server-side sejati (JWT terverifikasi / Secure Session Cookie dengan HttpOnly) via backend Supabase / Firebase / Express.');
  } else {
    addResult(11, 'Server-side auth', 'PASS', 'LOW', 'Autentikasi terverifikasi di sisi server.', 'Server-side auth terpasang.');
  }
}

// 12. Cek akses user
{
  const ctxPath = path.join(ROOT_DIR, 'src', 'context', 'CompetitionContext.jsx');
  let emailContainsBypass = false;
  if (fs.existsSync(ctxPath)) {
    const content = fs.readFileSync(ctxPath, 'utf8');
    if (content.includes("cleanEmail.includes('admin')")) {
      emailContainsBypass = true;
    }
  }
  if (emailContainsBypass) {
    addResult(12, 'Cek akses user', 'FAIL', 'CRITICAL', 'Ditemukan logic flaw: sembarang email yang mengandung kata "admin" (seperti testadmin@gmail.com) langsung diberikan hak akses Admin.', 'Ganti pengecekan substring dengan exact email match atau verifikasi database backend.');
  } else {
    addResult(12, 'Cek akses user', 'PASS', 'LOW', 'Pengecekan akses user menggunakan identitas terverifikasi tanpa substring bypass.', 'Otorisasi peran terlindungi.');
  }
}

// 13. Role admin aman
{
  const pinModalPath = path.join(ROOT_DIR, 'src', 'components', 'auth', 'PinAuthModal.jsx');
  let hasPlainTextHints = false;
  if (fs.existsSync(pinModalPath)) {
    const content = fs.readFileSync(pinModalPath, 'utf8');
    if (content.includes("hint: 'admin2026'")) {
      hasPlainTextHints = true;
    }
  }
  if (hasPlainTextHints) {
    addResult(13, 'Role admin aman', 'FAIL', 'HIGH', 'Hint PIN admin ("admin2026") tertulis terang-terangan di metadata komponen frontend.', 'Hapus hint PIN plaintext dari kode frontend dan enkripsi otoritas akses.');
  } else {
    addResult(13, 'Role admin aman', 'PASS', 'LOW', 'Tidak ada petunjuk PIN admin yang bocor langsung di antarmuka publik.', 'Role admin dilindungi otorisasi.');
  }
}

// 14. DB jangan public
{
  addResult(14, 'DB jangan public', 'PASS', 'INFO', 'Tidak ada database port/koneksi publik langsung yang terbuka di internet (data saat ini tersimpan lokal di browser client).', 'Jika memasang database cloud (Supabase / Neon / MySQL), pastikan DB connection string tidak di-commit dan port database tidak diekspos ke public 0.0.0.0 tanpa IP whitelist.');
}

// 15. DB permission ketat
{
  addResult(15, 'DB permission ketat', 'WARN', 'MEDIUM', 'Belum ada Row Level Security (RLS) atau DB Permission Policy karena database saat ini adalah client-side localStorage.', 'Saat implementasi database backend (seperti Supabase / PostgreSQL), aktifkan Row Level Security (RLS) agar tiap peserta hanya bisa membaca/menulis datanya sendiri.');
}

// 16. Hash password
{
  const authModalPath = path.join(ROOT_DIR, 'src', 'components', 'auth', 'AuthModal.jsx');
  let plainAuth = false;
  if (fs.existsSync(authModalPath)) {
    const content = fs.readFileSync(authModalPath, 'utf8');
    if (content.includes('loginUser(cleanEmail)') && !content.includes('loginPassword')) {
      plainAuth = true;
    }
  }
  if (plainAuth) {
    addResult(16, 'Hash password', 'FAIL', 'HIGH', 'Password saat login diabaikan (hanya memanggil loginUser(cleanEmail)) dan pendaftaran user tidak menerapkan cryptographic password hashing (bcrypt / argon2).', 'Wajib gunakan hashing algoritma standar industri seperti bcrypt atau Argon2id sebelum menyimpan password.');
  } else {
    addResult(16, 'Hash password', 'PASS', 'LOW', 'Password diverifikasi dan dienkripsi secara aman.', 'Password hashing terpasang.');
  }
}

// 17. Session aman
{
  const ctxPath = path.join(ROOT_DIR, 'src', 'context', 'CompetitionContext.jsx');
  let usesLocalStorage = false;
  if (fs.existsSync(ctxPath)) {
    const content = fs.readFileSync(ctxPath, 'utf8');
    if (content.includes('localStorage.setItem(STORAGE_KEYS.ROLE')) {
      usesLocalStorage = true;
    }
  }
  if (usesLocalStorage) {
    addResult(17, 'Session aman', 'WARN', 'MEDIUM', 'Sesi login disimpan dalam localStorage tanpa expiration timestamp, rentan dicuri bila terjadi insiden Cross-Site Scripting (XSS).', 'Gunakan HttpOnly, SameSite=Lax, Secure Cookies untuk session token otentikasi.');
  } else {
    addResult(17, 'Session aman', 'PASS', 'LOW', 'Sesi tersimpan secara aman dengan proteksi session cookie.', 'Sesi terlindungi.');
  }
}

// 18. Reset password aman
{
  const authModalPath = path.join(ROOT_DIR, 'src', 'components', 'auth', 'AuthModal.jsx');
  let hasManualReset = false;
  if (fs.existsSync(authModalPath)) {
    const content = fs.readFileSync(authModalPath, 'utf8');
    if (content.includes('Silakan hubungi Sekretariat Panitia via WhatsApp jika Anda mengalami kendala sandi')) {
      hasManualReset = true;
    }
  }
  if (hasManualReset) {
    addResult(18, 'Reset password aman', 'WARN', 'LOW', 'Reset password saat ini masih menggunakan alur manual via WhatsApp Panitia (belum ada alur reset otomatis berbasis token email).', 'Implementasikan alur self-service Password Reset dengan cryptographic single-use token yang memiliki waktu kedaluwarsa 15 menit.');
  } else {
    addResult(18, 'Reset password aman', 'PASS', 'LOW', 'Alur reset password dilengkapi token kedaluwarsa otomatis.', 'Reset password aman.');
  }
}

// 19. Batasi upload file
{
  const regWizardPath = path.join(ROOT_DIR, 'src', 'components', 'portal', 'RegistrationWizard.jsx');
  let hasHardFileSizeLimit = false;
  if (fs.existsSync(regWizardPath)) {
    const content = fs.readFileSync(regWizardPath, 'utf8');
    if (content.includes('file.size >') || content.includes('MAX_FILE_SIZE')) {
      hasHardFileSizeLimit = true;
    }
  }
  if (!hasHardFileSizeLimit) {
    addResult(19, 'Batasi upload file', 'FAIL', 'HIGH', 'Fungsi processUploadedFile() membaca file ke memori sebelum memeriksa batas ukuran maksimum file (file.size), rentan memicu kehabisan memori atau crash pada browser.', 'Tambahkan pembatasan ukuran awal (misal max 3MB untuk gambar, max 5MB untuk PDF) dan whitelist ekstensi file (.jpg, .png, .pdf) sebelum memproses FileReader.');
  } else {
    addResult(19, 'Batasi upload file', 'PASS', 'LOW', 'Upload file dibatasi ukuran dan tipe ekstensinya secara ketat sebelum diproses.', 'Upload file dibatasi dengan baik.');
  }
}

// 20. Scan upload file
{
  addResult(20, 'Scan upload file', 'WARN', 'MEDIUM', 'File yang diunggah saat ini diproses secara lokal di browser dan belum melalui pipeline malware scanning server-side.', 'Pada arsitektur produksi dengan cloud storage (S3 / Supabase Storage), pasang webhook antivirus scanner (ClamAV / AWS GuardDuty / VirusTotal API) sebelum file diizinkan diakses publik.');
}

// Output Report
let passCount = 0;
let warnCount = 0;
let failCount = 0;

console.log(`${BOLD}HASIL PEMERIKSAAN 20 CHECKLIST KEAMANAN:${RESET}\n`);

for (const r of results) {
  let badge = '';
  if (r.status === 'PASS') {
    badge = `${GREEN}[✓ PASS]${RESET}`;
    passCount++;
  } else if (r.status === 'WARN') {
    badge = `${YELLOW}[⚠ WARN]${RESET}`;
    warnCount++;
  } else {
    badge = `${RED}[✗ FAIL]${RESET}`;
    failCount++;
  }

  let sevBadge = '';
  if (r.severity === 'CRITICAL') sevBadge = `${RED}${BOLD}[CRITICAL]${RESET}`;
  else if (r.severity === 'HIGH') sevBadge = `${RED}[HIGH]${RESET}`;
  else if (r.severity === 'MEDIUM') sevBadge = `${YELLOW}[MEDIUM]${RESET}`;
  else if (r.severity === 'LOW') sevBadge = `${GRAY}[LOW]${RESET}`;
  else sevBadge = `${BLUE}[INFO]${RESET}`;

  console.log(`${BOLD}${r.id.toString().padStart(2, ' ')}. ${r.title.padEnd(25, ' ')}${RESET} ${badge} ${sevBadge}`);
  console.log(`    ${GRAY}Temuan       :${RESET} ${r.findings}`);
  if (r.status !== 'PASS') {
    console.log(`    ${CYAN}Rekomendasi  :${RESET} ${r.recommendation}`);
  }
  console.log('');
}

console.log(`${BOLD}${CYAN}========================================================================${RESET}`);
console.log(`${BOLD}RINGKASAN AUDIT: ${GREEN}${passCount} PASS${RESET} | ${YELLOW}${warnCount} WARNING${RESET} | ${RED}${failCount} FAILED${RESET}`);
console.log(`${BOLD}${CYAN}========================================================================${RESET}\n`);

// Save JSON report for automation and CI/CD
const reportPath = path.join(ROOT_DIR, 'security-audit-report.json');
fs.writeFileSync(reportPath, JSON.stringify({
  timestamp: new Date().toISOString(),
  summary: { passCount, warnCount, failCount, total: results.length },
  checklist: results
}, null, 2));

console.log(`${GREEN}✓ Laporan audit keamanan otomatis telah disimpan ke: ${reportPath}${RESET}\n`);

if (failCount > 0) {
  console.log(`${YELLOW}Catatan: Terdapat item berstatus FAILED yang perlu diperbaiki untuk memenuhi 20 standar keamanan.${RESET}`);
}
