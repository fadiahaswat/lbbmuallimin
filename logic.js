// --- DATA & STATE MANAGEMENT ---
const DB_KEY = 'lbb_muallimin_v4_juknis'; // New version

const initialData = {
    users: [
        { id: 'admin', pass: 'admin', role: 'admin', name: 'Super Admin' },
        { id: 'panitia', pass: 'panitia', role: 'panitia', name: 'Panitia Lomba' },
        { id: 'peserta', pass: 'peserta', role: 'peserta', name: 'MTS Muallimin', level: 'SMP/MTs', peletonName: 'Caraka Bhaskara' } 
    ],
    teams: [], 
    activeRun: null 
};

function loadDB() {
    const data = localStorage.getItem(DB_KEY);
    return data ? JSON.parse(data) : initialData;
}

function saveDB(data) {
    localStorage.setItem(DB_KEY, JSON.stringify(data));
}

let db = loadDB();
let currentUser = null;
let timerInterval = null;
let elapsedTime = 0;
let selectedTeamId = null;

// --- DOM ELEMENTS (Shortcut) ---
const el = (id) => document.getElementById(id);
const hide = (id) => el(id)?.classList.add('hide');
const show = (id) => el(id)?.classList.remove('hide');

// --- AUTO-FIX UI LAYOUT ---
function fixButtonZIndex() {
    const startBtn = el('btn-timer-start');
    if (startBtn && startBtn.parentElement) {
        startBtn.parentElement.style.position = 'relative';
        startBtn.parentElement.style.zIndex = '100';
    }
}

// --- AUTHENTICATION ---
function handleLogin() {
    const u = el('login-user').value;
    const p = el('login-pass').value;
    
    if (u.startsWith('team_')) {
        const team = db.teams.find(t => t.username === u && t.pass === p);
        if (team) { 
            currentUser = { ...team, role: 'peserta' }; 
            enterDashboard(); 
            return; 
        }
    }

    const user = db.users.find(user => user.id === u && user.pass === p);
    if (user) { 
        currentUser = user; 
        enterDashboard(); 
    } else { 
        showToast("Username/Password salah!", "error"); 
    }
}

function logout() {
    currentUser = null;
    clearInterval(timerInterval);
    hide('dashboard-layout');
    show('login-screen');
    el('login-pass').value = '';
}

function enterDashboard() {
    hide('login-screen');
    show('dashboard-layout');
    el('role-badge').textContent = currentUser.role.toUpperCase();
    
    renderSidebar();
    
    if(currentUser.role === 'admin') navigate('admin-dashboard');
    else if(currentUser.role === 'panitia') navigate('panitia-dashboard');
    else navigate('peserta-dashboard');
}

// --- NAVIGATION ---
function renderSidebar() {
    const menu = el('sidebar-menu');
    menu.innerHTML = '';
    
    const links = [];
    if (currentUser.role === 'admin') {
        links.push({ id: 'admin-dashboard', icon: 'fa-chart-pie', label: 'Dashboard' });
        links.push({ id: 'admin-teams', icon: 'fa-users-gear', label: 'Data Peserta' });
    } else if (currentUser.role === 'panitia') {
        links.push({ id: 'panitia-verification', icon: 'fa-list-check', label: 'Verifikasi' });
        links.push({ id: 'panitia-live', icon: 'fa-stopwatch-20', label: 'Live Scoring' });
    } else if (currentUser.role === 'peserta') {
        links.push({ id: 'peserta-dashboard', icon: 'fa-house-user', label: 'Beranda Tim' });
        links.push({ id: 'peserta-juknis', icon: 'fa-book-open-reader', label: 'Juknis Pendaftaran' });
        links.push({ id: 'peserta-data', icon: 'fa-file-signature', label: 'Data Peleton' });
        links.push({ id: 'peserta-docs', icon: 'fa-cloud-arrow-up', label: 'Upload Berkas' });
        links.push({ id: 'peserta-schedule', icon: 'fa-bullhorn', label: 'Pengumuman' });
    }

    links.forEach(link => {
        const btn = document.createElement('button');
        btn.className = 'sidebar-link w-full text-left px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all flex items-center gap-3 text-sm font-medium mb-1';
        btn.onclick = () => {
            document.querySelectorAll('.sidebar-link').forEach(b => {
                b.classList.remove('bg-primary-600/10', 'text-primary-400');
                b.classList.add('text-slate-400');
            });
            btn.classList.add('bg-primary-600/10', 'text-primary-400');
            btn.classList.remove('text-slate-400');
            navigate(link.id);
        };
        btn.innerHTML = `<i class="fa-solid ${link.icon} w-5 text-center"></i> ${link.label}`;
        menu.appendChild(btn);
    });
}

function navigate(viewId) {
    document.querySelectorAll('.view-section').forEach(s => s.classList.add('hide'));
    show('view-' + viewId);

    db = loadDB(); 
    if(viewId === 'panitia-live') {
        initPanitiaLive();
        setTimeout(fixButtonZIndex, 100);
    }
    if(viewId === 'admin-dashboard') initAdminDashboard();
    if(viewId === 'admin-teams') initAdminTeams();
    if(viewId === 'panitia-verification') initPanitiaVerification();
    if(viewId === 'peserta-dashboard') initPesertaDashboard();
    if(viewId === 'peserta-data') initPesertaData();
    if(viewId === 'peserta-docs') initPesertaDocs();
}

// --- VIEW INITIALIZERS ---

function initAdminDashboard() {
    el('admin-total-teams').textContent = db.teams.length;
}

function initAdminTeams() {
    const tbody = el('admin-teams-list');
    tbody.innerHTML = '';
    
    if(db.teams.length === 0) {
        tbody.innerHTML = '<tr><td colspan="3" class="p-4 text-center text-slate-500">Belum ada data.</td></tr>';
        return;
    }

    db.teams.forEach(t => {
        const tr = document.createElement('tr');
        tr.className = 'hover:bg-slate-800/50 transition border-b border-slate-700/50';
        tr.innerHTML = `
            <td class="p-4">
                <strong class="text-white block">${t.peletonName}</strong>
                <span class="text-xs text-slate-500">${t.school} (${t.level})</span>
            </td>
            <td class="p-4">
                <span class="text-slate-300">${t.official1 || '-'}</span><br>
                <span class="text-xs text-slate-500">${t.phone1 || '-'}</span>
            </td>
            <td class="p-4">
                <span class="px-2 py-1 rounded text-xs font-bold ${t.status==='VERIFIED'?'bg-green-500/20 text-green-400':'bg-yellow-500/20 text-yellow-400'}">
                    ${t.status}
                </span>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function initPanitiaVerification() {
    const container = el('verification-list');
    container.innerHTML = '';
    const pending = db.teams.filter(t => t.status === 'PENDING' || t.status === 'REVISION');
    
    if(pending.length === 0) container.innerHTML = '<p class="text-slate-500 italic p-4 text-center bg-slate-800 rounded border border-slate-700">Tidak ada antrean.</p>';
    
    pending.forEach(t => {
        const div = document.createElement('div');
        div.className = 'bg-slate-800 p-4 rounded-xl border-l-4 border-yellow-500 shadow flex justify-between items-center';
        div.innerHTML = `
            <div>
                <h3 class="font-bold text-white">${t.peletonName}</h3>
                <p class="text-xs text-slate-400">${t.school}</p>
                <div class="mt-2 text-xs flex gap-3">
                    <span class="${t.documents?.formB?'text-green-400':'text-red-400'} flex items-center gap-1"><i class="fa-solid fa-file-lines"></i> Form B</span>
                    <span class="${t.documents?.payment?'text-green-400':'text-red-400'} flex items-center gap-1"><i class="fa-solid fa-receipt"></i> Bukti</span>
                </div>
            </div>
            <button onclick="verifyTeam('${t.id}')" class="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-bold shadow transition">Setujui</button>
        `;
        container.appendChild(div);
    });
}

function initPanitiaLive() {
    const select = el('live-team-select');
    select.innerHTML = '<option value="">-- Pilih Peleton --</option>';
    const readyTeams = db.teams.filter(t => t.status === 'VERIFIED' || t.status === 'READY');
    
    readyTeams.forEach(t => {
        const opt = document.createElement('option');
        opt.value = t.id;
        opt.textContent = `${t.peletonName} (${t.level})`;
        if(db.activeRun?.teamId === t.id) opt.selected = true;
        select.appendChild(opt);
    });

    if(db.activeRun) selectLiveTeam(db.activeRun.teamId);
}

function initPesertaDashboard() {
    el('dash-peserta-name').textContent = currentUser.peletonName || currentUser.name;
    const statusEl = el('val-status');
    const statusColors = { 'PENDING': 'text-yellow-400', 'VERIFIED': 'text-green-400', 'REVISION': 'text-red-400' };
    statusEl.textContent = currentUser.status || 'BELUM LENGKAP';
    statusEl.className = `text-lg font-bold mt-2 ${statusColors[currentUser.status] || 'text-slate-400'}`;
    el('val-level').textContent = currentUser.level || '-';
}

function initPesertaData() {
    el('team-level').value = currentUser.level || 'SD/MI';
    el('team-school').value = currentUser.school || '';
    el('team-name').value = currentUser.peletonName || '';
    el('team-danton').value = currentUser.danton || '';
    el('team-off1').value = currentUser.official1 || '';
    el('team-phone1').value = currentUser.phone1 || '';
    el('team-off2').value = currentUser.official2 || '';
}

function initPesertaDocs() {
    const payBtn = el('action-doc-payment');
    const payIcon = el('icon-doc-payment');
    if(currentUser.documents?.payment) {
        payIcon.innerHTML = '<i class="fa-solid fa-circle-check text-green-500 text-xl"></i>';
        payBtn.innerHTML = '<div class="bg-green-500/10 text-green-400 px-3 py-2 rounded text-sm font-bold border border-green-500/20 text-center">Terupload</div>';
    } else {
        payIcon.innerHTML = '<i class="fa-regular fa-circle text-slate-600 text-xl"></i>';
        payBtn.innerHTML = '<button onclick="uploadDoc(\'payment\')" class="w-full bg-primary-600 hover:bg-primary-500 text-white font-medium py-2 rounded-lg text-sm transition">Upload</button>';
    }

    const fbBtn = el('action-doc-formB');
    const fbIcon = el('icon-doc-formB');
    if(currentUser.documents?.formB) {
        fbIcon.innerHTML = '<i class="fa-solid fa-circle-check text-green-500 text-xl"></i>';
        fbBtn.innerHTML = '<div class="bg-green-500/10 text-green-400 px-3 py-2 rounded text-sm font-bold border border-green-500/20 text-center">Terupload</div>';
    } else {
        fbIcon.innerHTML = '<i class="fa-regular fa-circle text-slate-600 text-xl"></i>';
        fbBtn.innerHTML = '<button onclick="uploadDoc(\'formB\')" class="w-full bg-primary-600 hover:bg-primary-500 text-white font-medium py-2 rounded-lg text-sm transition">Upload</button>';
    }

    const mapColor = currentUser.level === 'SD/MI' ? 'MERAH' : 'BIRU';
    const mapText = el('val-map-color');
    mapText.textContent = mapColor;
    mapText.className = `font-bold text-lg ${mapColor==='MERAH'?'text-red-500':'text-blue-500'}`;
}

// --- EVENT LISTENERS ---

const sidebar = document.querySelector('aside');
const mobileOverlay = el('mobile-overlay');

if(el('btn-mobile-menu')) {
    el('btn-mobile-menu').addEventListener('click', () => {
        sidebar.classList.remove('hidden'); 
        sidebar.classList.add('fixed', 'inset-y-0', 'left-0'); 
        mobileOverlay.classList.remove('hidden');
    });
}
if(mobileOverlay) {
    mobileOverlay.addEventListener('click', () => {
        sidebar.classList.add('hidden'); 
        sidebar.classList.remove('fixed', 'inset-y-0', 'left-0');
        mobileOverlay.classList.add('hidden');
    });
}

el('btn-login').addEventListener('click', handleLogin);
el('btn-logout').addEventListener('click', logout);
if(el('btn-logout-mobile')) el('btn-logout-mobile').addEventListener('click', logout);

document.querySelectorAll('.sim-login-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        el('login-user').value = e.target.dataset.user;
        el('login-pass').value = e.target.dataset.pass;
    });
});

if(el('btn-add-dummy')) {
    el('btn-add-dummy').addEventListener('click', () => {
        const id = Date.now().toString();
        db.teams.push({ 
            id: id, username: `team_${id.substr(-4)}`, pass: '1234', 
            school: 'Dummy School', peletonName: 'Peleton '+id.substr(-3), 
            level: 'SD/MI', status: 'VERIFIED', role: 'peserta' 
        });
        saveDB(db);
        showToast("Dummy Added");
        initAdminDashboard();
    });
}

if(el('form-peserta-data')) {
    el('form-peserta-data').addEventListener('submit', (e) => {
        e.preventDefault();
        if(!currentUser) return;
        currentUser.level = el('team-level').value;
        currentUser.school = el('team-school').value;
        currentUser.peletonName = el('team-name').value;
        currentUser.danton = el('team-danton').value;
        currentUser.official1 = el('team-off1').value;
        currentUser.phone1 = el('team-phone1').value;
        currentUser.official2 = el('team-off2').value;
        
        const idx = db.teams.findIndex(t => t.id === currentUser.id);
        if(idx !== -1) db.teams[idx] = currentUser;
        else if(currentUser.id === 'peserta') { currentUser.status = 'PENDING'; db.teams.push(currentUser); }
        
        saveDB(db);
        showToast("Data Disimpan");
        db = loadDB();
    });
}

// --- GLOBAL ACTIONS ---

window.verifyTeam = function(id) {
    const t = db.teams.find(team => team.id === id);
    if(t) { 
        t.status = 'VERIFIED'; 
        saveDB(db); 
        initPanitiaVerification(); 
        showToast("Tim Diverifikasi");
    }
}

window.uploadDoc = function(type) {
    currentUser.documents = currentUser.documents || {};
    if(type === 'formB') {
        const naming = prompt("Simulasi: Masukkan nama file (WAJIB KAPITAL: NAMA SEKOLAH_NAMA PELETON.docx)");
        if(!naming) return;
        
        // VALIDASI BARU SESUAI JUKNIS
        if(!naming.toLowerCase().endsWith('.docx')) { alert("Format salah! Harus .docx"); return; }
        if(naming !== naming.toUpperCase()) { alert("Nama file harus HURUF KAPITAL semua!"); return; }
        if(!naming.includes('_')) { alert("Gunakan underscore (_) pemisah Sekolah dan Peleton"); return; }
    }
    
    currentUser.documents[type] = true;
    const idx = db.teams.findIndex(t => t.id === currentUser.id);
    if(idx !== -1) db.teams[idx] = currentUser;
    else if(currentUser.id === 'peserta') { currentUser.status = 'PENDING'; db.teams.push(currentUser); }
    
    saveDB(db);
    showToast("Berhasil Diunggah");
    initPesertaDocs();
}

// --- LIVE SCORING ENGINE ---

if(el('live-team-select')) {
    el('live-team-select').addEventListener('change', (e) => selectLiveTeam(e.target.value));
}

function selectLiveTeam(tid) {
    selectedTeamId = tid;
    const scorePanel = el('scoring-panel');
    const penPanel = el('penalty-panel');
    const subBtn = el('btn-submit-score');
    
    resetTimerVisuals();

    if (!tid) {
        scorePanel.classList.add('opacity-50', 'pointer-events-none');
        penPanel.classList.add('opacity-50', 'pointer-events-none');
        subBtn.classList.add('opacity-50', 'pointer-events-none');
        el('timer-limit-label').innerText = "Limit: -";
        return;
    }
    
    scorePanel.classList.remove('opacity-50', 'pointer-events-none');
    penPanel.classList.remove('opacity-50', 'pointer-events-none');
    subBtn.classList.remove('opacity-50', 'pointer-events-none');

    const team = db.teams.find(t => t.id === tid);
    const limit = team.level === 'SD/MI' ? 8 : 13;
    el('timer-limit-label').innerText = `Limit: ${limit} Menit`;

    fixButtonZIndex();

    if (db.activeRun && db.activeRun.teamId === tid) {
        elapsedTime = Math.floor((Date.now() - db.activeRun.startTime) / 1000);
        startTimerUI();
    } else {
        elapsedTime = 0;
        updateTimerDisplay(0);
        el('btn-timer-start').disabled = false;
        el('btn-timer-stop').disabled = true;
    }
}

// Timer Controls
if(el('btn-timer-start')) {
    el('btn-timer-start').addEventListener('click', () => {
        if (!selectedTeamId) return showToast("Pilih Tim dulu!", "error");
        db.activeRun = { teamId: selectedTeamId, startTime: Date.now() - (elapsedTime * 1000) };
        saveDB(db);
        startTimerUI();
    });

    el('btn-timer-stop').addEventListener('click', () => {
        clearInterval(timerInterval);
        db.activeRun = null;
        saveDB(db);
        el('btn-timer-start').disabled = false;
        el('btn-timer-stop').disabled = true;
        el('live-team-select').disabled = false;
    });

    el('btn-timer-reset').addEventListener('click', () => {
        clearInterval(timerInterval);
        db.activeRun = null;
        saveDB(db);
        el('btn-timer-start').disabled = false;
        el('btn-timer-stop').disabled = true;
        el('live-team-select').disabled = false;
        
        elapsedTime = 0;
        updateTimerDisplay(0);
        resetTimerVisuals();
        el('pen-time').value = 0;
    });
}

function startTimerUI() {
    el('btn-timer-start').disabled = true;
    el('btn-timer-stop').disabled = false;
    el('live-team-select').disabled = true;
    
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        elapsedTime = Math.floor((Date.now() - db.activeRun.startTime) / 1000);
        updateTimerDisplay(elapsedTime);
        checkOvertime(elapsedTime);
    }, 1000); 
}

function updateTimerDisplay(seconds) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    const formatted = `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
    
    el('timer-display').innerText = formatted;
    document.title = `${formatted} - Live Scoring`;

    if(selectedTeamId) {
        const team = db.teams.find(t => t.id === selectedTeamId);
        if(!team) return;

        const limitSec = (team.level === 'SD/MI' ? 8 : 13) * 60;
        const percent = Math.min((seconds / limitSec) * 100, 100);
        
        const progressBar = el('timer-progress');
        if(progressBar) progressBar.style.width = `${percent}%`;
    }
}

function checkOvertime(seconds) {
    const team = db.teams.find(t => t.id === selectedTeamId);
    if(!team) return;

    const limitSec = (team.level === 'SD/MI' ? 8 : 13) * 60;
    const display = el('timer-display');
    const progressBar = el('timer-progress');

    if (seconds > limitSec) {
        const diff = seconds - limitSec;
        const penaltyScore = Math.ceil(diff / 30) * 50;
        
        display.classList.add('text-red-500');
        display.classList.remove('text-white');
        
        if(progressBar) {
            progressBar.classList.remove('bg-blue-500');
            progressBar.classList.add('bg-red-600');
        }

        el('pen-time').value = penaltyScore;
    } else {
        resetTimerVisuals();
        el('pen-time').value = 0;
    }
}

function resetTimerVisuals() {
    const display = el('timer-display');
    const progressBar = el('timer-progress');
    
    display.classList.add('text-white');
    display.classList.remove('text-red-500');
    
    if(progressBar) {
        progressBar.classList.add('bg-blue-500');
        progressBar.classList.remove('bg-red-600');
    }
}

// Submit Score
if(el('btn-submit-score')) {
    el('btn-submit-score').addEventListener('click', () => {
        if (!selectedTeamId || !confirm("Yakin simpan nilai? Data akan dikunci.")) return;
        
        const pbb = parseFloat(el('score-pbb').value)||0;
        const kompak = parseFloat(el('score-kompak').value)||0;
        const dMateri = parseFloat(el('score-danton-materi').value)||0;
        const dSuara = parseFloat(el('score-danton-suara').value)||0;
        const dSikap = parseFloat(el('score-danton-sikap').value)||0;
        const dMedan = parseFloat(el('score-danton-medan').value)||0;
        
        const totalRaw = (pbb * 0.7) + (kompak * 0.3) + (dMateri * 0.35) + (dSuara * 0.25) + (dSikap * 0.20) + (dMedan * 0.20);
        let totalPen = 0;
        if(el('pen-upacara').checked) totalPen += 150;
        if(el('pen-late').checked) totalPen += 100;
        if(el('pen-personel').checked) totalPen += 75;
        totalPen += (parseInt(el('pen-garis').value)||0) * 50;
        totalPen += (parseInt(el('pen-adjustment').value)||0) * 25;
        totalPen += parseInt(el('pen-time').value)||0;

        const finalScore = (totalRaw - totalPen).toFixed(2);
        
        const team = db.teams.find(t => t.id === selectedTeamId);
        team.scoreTotal = finalScore;
        saveDB(db);
        showToast(`Nilai Tersimpan: ${finalScore}`);
        
        el('btn-timer-reset').click();
        selectLiveTeam("");
    });
}

function showToast(msg, type='success') {
    const toast = el('toast');
    const toastMsg = el('toast-msg');
    const icon = el('toast-icon');
    
    toastMsg.innerText = msg;
    
    if(type === 'error') {
        icon.className = 'fa-solid fa-circle-xmark text-red-500 text-lg';
        toast.className = 'fixed top-5 right-5 bg-slate-800 border-l-4 border-red-500 text-white shadow-xl rounded-r px-5 py-4 transform transition-transform duration-300 z-50 flex items-center gap-3 translate-x-0';
    } else {
        icon.className = 'fa-solid fa-check-circle text-green-500 text-lg';
        toast.className = 'fixed top-5 right-5 bg-slate-800 border-l-4 border-green-500 text-white shadow-xl rounded-r px-5 py-4 transform transition-transform duration-300 z-50 flex items-center gap-3 translate-x-0';
    }
    
    setTimeout(() => {
        toast.classList.add('translate-x-full');
        toast.classList.remove('translate-x-0');
    }, 3000);
}
