// --- DATA & STATE MANAGEMENT ---
const DB_KEY = 'lbb_muallimin_split_v1';

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

// --- AUTHENTICATION ---
function handleLogin() {
    const u = el('login-user').value;
    const p = el('login-pass').value;
    
    // Check mock teams first
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
    
    // Default Routes
    if(currentUser.role === 'admin') navigate('admin-dashboard');
    else if(currentUser.role === 'panitia') navigate('panitia-dashboard');
    else navigate('peserta-dashboard');
}

// --- NAVIGATION & ROUTING ---
function renderSidebar() {
    const menu = el('sidebar-menu');
    menu.innerHTML = '';
    
    const links = [];
    if (currentUser.role === 'admin') {
        links.push({ id: 'admin-dashboard', icon: 'fa-gauge', label: 'Dashboard' });
        links.push({ id: 'admin-teams', icon: 'fa-users', label: 'Data Peserta' });
    } else if (currentUser.role === 'panitia') {
        links.push({ id: 'panitia-verification', icon: 'fa-file-circle-check', label: 'Verifikasi' });
        links.push({ id: 'panitia-live', icon: 'fa-stopwatch', label: 'LIVE SCORING' });
    } else if (currentUser.role === 'peserta') {
        links.push({ id: 'peserta-dashboard', icon: 'fa-circle-info', label: 'Info' });
        links.push({ id: 'peserta-juknis', icon: 'fa-book', label: 'Juknis' });
        links.push({ id: 'peserta-data', icon: 'fa-id-card', label: 'Data Peleton' });
        links.push({ id: 'peserta-docs', icon: 'fa-file-upload', label: 'Dokumen' });
        links.push({ id: 'peserta-schedule', icon: 'fa-bullhorn', label: 'Pengumuman' });
    }

    links.forEach(link => {
        const btn = document.createElement('button');
        btn.className = 'sidebar-link w-full text-left px-6 py-3 text-blue-100 hover:bg-blue-800 hover:text-white transition flex items-center gap-3 text-sm';
        btn.onclick = () => navigate(link.id);
        btn.innerHTML = `<i class="fa-solid ${link.icon} w-5"></i> ${link.label}`;
        menu.appendChild(btn);
    });
}

function navigate(viewId) {
    // 1. Hide all views
    document.querySelectorAll('.view-section').forEach(s => s.classList.add('hide'));
    
    // 2. Show selected view
    show('view-' + viewId);

    // 3. Initialize specific view data
    db = loadDB(); // Refresh DB
    if(viewId === 'admin-dashboard') initAdminDashboard();
    if(viewId === 'admin-teams') initAdminTeams();
    if(viewId === 'panitia-verification') initPanitiaVerification();
    if(viewId === 'panitia-live') initPanitiaLive();
    if(viewId === 'peserta-dashboard') initPesertaDashboard();
    if(viewId === 'peserta-data') initPesertaData();
    if(viewId === 'peserta-docs') initPesertaDocs();
}

// --- VIEW INITIALIZERS (Populate HTML) ---

function initAdminDashboard() {
    el('admin-total-teams').textContent = db.teams.length;
}

function initAdminTeams() {
    const tbody = el('admin-teams-list');
    tbody.innerHTML = '';
    db.teams.forEach(t => {
        const tr = document.createElement('tr');
        tr.className = 'border-b hover:bg-gray-50';
        tr.innerHTML = `
            <td class="p-3"><strong>${t.peletonName}</strong><br><span class="text-xs text-gray-500">${t.school} (${t.level})</span></td>
            <td class="p-3">${t.official1 || '-'}<br><span class="text-xs text-gray-500">${t.phone1 || '-'}</span></td>
            <td class="p-3"><span class="bg-gray-200 px-2 py-1 rounded text-xs font-bold">${t.status}</span></td>
        `;
        tbody.appendChild(tr);
    });
}

function initPanitiaVerification() {
    const container = el('verification-list');
    container.innerHTML = '';
    const pending = db.teams.filter(t => t.status === 'PENDING' || t.status === 'REVISION');
    
    if(pending.length === 0) container.innerHTML = '<p class="text-gray-500">Tidak ada antrean.</p>';
    
    pending.forEach(t => {
        const div = document.createElement('div');
        div.className = 'bg-white p-4 rounded shadow border-l-4 border-yellow-400 flex justify-between items-center';
        div.innerHTML = `
            <div>
                <h3 class="font-bold">${t.peletonName}</h3>
                <p class="text-xs text-gray-600">${t.school}</p>
                <div class="mt-2 text-xs flex gap-2">
                    <span class="${t.documents?.formB?'text-green-600':'text-red-500'}"><i class="fa-solid fa-file-word"></i> Form B</span>
                    <span class="${t.documents?.payment?'text-green-600':'text-red-500'}"><i class="fa-solid fa-receipt"></i> Bukti</span>
                </div>
            </div>
            <button onclick="verifyTeam('${t.id}')" class="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700">Setujui</button>
        `;
        container.appendChild(div);
    });
}

function initPanitiaLive() {
    const select = el('live-team-select');
    select.innerHTML = '<option value="">-- Pilih Tim --</option>';
    const readyTeams = db.teams.filter(t => t.status === 'VERIFIED' || t.status === 'READY');
    
    readyTeams.forEach(t => {
        const opt = document.createElement('option');
        opt.value = t.id;
        opt.textContent = `${t.peletonName} (${t.level}) ${t.scoreTotal ? '✅' : ''}`;
        if(db.activeRun?.teamId === t.id) opt.selected = true;
        select.appendChild(opt);
    });

    if(db.activeRun) selectLiveTeam(db.activeRun.teamId);
}

function initPesertaDashboard() {
    el('dash-peserta-name').textContent = currentUser.peletonName || currentUser.name;
    
    const cardStatus = el('card-status');
    el('val-status').textContent = currentUser.status || 'BELUM LENGKAP';
    cardStatus.className = `bg-white p-5 rounded-lg shadow border-l-4 ${currentUser.status === 'VERIFIED' ? 'border-green-500' : 'border-yellow-500'}`;
    
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
    // Payment UI
    const payBtn = el('action-doc-payment');
    const payIcon = el('icon-doc-payment');
    if(currentUser.documents?.payment) {
        payIcon.innerHTML = '<i class="fa-solid fa-circle-check text-green-500 text-xl"></i>';
        payBtn.innerHTML = '<div class="bg-green-50 text-green-700 px-3 py-2 rounded text-sm font-medium border border-green-200">Terupload</div>';
    } else {
        payIcon.innerHTML = '<i class="fa-regular fa-circle text-gray-300 text-xl"></i>';
        payBtn.innerHTML = '<button onclick="uploadDoc(\'payment\')" class="w-full bg-blue-600 text-white py-2 rounded text-sm hover:bg-blue-700">Upload</button>';
    }

    // Form B UI
    const fbBtn = el('action-doc-formB');
    const fbIcon = el('icon-doc-formB');
    if(currentUser.documents?.formB) {
        fbIcon.innerHTML = '<i class="fa-solid fa-circle-check text-green-500 text-xl"></i>';
        fbBtn.innerHTML = '<div class="bg-green-50 text-green-700 px-3 py-2 rounded text-sm font-medium border border-green-200">Terupload</div>';
    } else {
        fbIcon.innerHTML = '<i class="fa-regular fa-circle text-gray-300 text-xl"></i>';
        fbBtn.innerHTML = '<button onclick="uploadDoc(\'formB\')" class="w-full bg-blue-600 text-white py-2 rounded text-sm hover:bg-blue-700">Upload</button>';
    }

    const mapColor = currentUser.level === 'SD/MI' ? 'MERAH' : 'BIRU';
    const mapText = el('val-map-color');
    mapText.textContent = mapColor;
    mapText.className = `text-xl ${mapColor==='MERAH'?'text-red-600':'text-blue-600'}`;
}

// --- EVENT LISTENERS & ACTIONS ---

// Login Buttons
el('btn-login').addEventListener('click', handleLogin);
el('btn-logout').addEventListener('click', logout);
el('btn-logout-mobile').addEventListener('click', logout);

// Simulation Quick Login
document.querySelectorAll('.sim-login-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        el('login-user').value = e.target.dataset.user;
        el('login-pass').value = e.target.dataset.pass;
    });
});

// Admin Add Dummy
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

// Peserta Save Data
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
    else if(currentUser.id === 'peserta') { 
        currentUser.status = 'PENDING'; 
        db.teams.push(currentUser); 
    }
    
    saveDB(db);
    showToast("Data Disimpan!");
    // Slight refresh to ensure mock user is persistent
    db = loadDB();
});

// --- GLOBAL FUNCTIONS (Called by onclick in HTML) ---

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
        const naming = prompt("Simulasi: Masukkan nama file (Wajib: NAMA SEKOLAH_NAMA PELETON.docx)");
        if(!naming || !naming.toLowerCase().endsWith('.docx')) { alert("Format salah!"); return; }
        if(!naming.includes('_')) { alert("Gunakan underscore (_)"); return; }
    }
    currentUser.documents[type] = true;
    
    // Save
    const idx = db.teams.findIndex(t => t.id === currentUser.id);
    if(idx !== -1) db.teams[idx] = currentUser;
    else if(currentUser.id === 'peserta') { currentUser.status = 'PENDING'; db.teams.push(currentUser); }
    
    saveDB(db);
    showToast("Berhasil Diunggah");
    initPesertaDocs();
}

// --- LIVE SCORING LOGIC ---

el('live-team-select').addEventListener('change', (e) => selectLiveTeam(e.target.value));

function selectLiveTeam(tid) {
    selectedTeamId = tid;
    const scorePanel = el('scoring-panel');
    const penPanel = el('penalty-panel');
    const subBtn = el('btn-submit-score');

    if (!tid) {
        scorePanel.classList.add('opacity-50', 'pointer-events-none');
        penPanel.classList.add('opacity-50', 'pointer-events-none');
        subBtn.classList.add('opacity-50', 'pointer-events-none');
        return;
    }
    
    scorePanel.classList.remove('opacity-50', 'pointer-events-none');
    penPanel.classList.remove('opacity-50', 'pointer-events-none');
    subBtn.classList.remove('opacity-50', 'pointer-events-none');

    const team = db.teams.find(t => t.id === tid);
    const limit = team.level === 'SD/MI' ? 8 : 13;
    el('timer-limit-label').innerText = `Limit: ${limit} Menit`;

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
el('btn-timer-start').addEventListener('click', () => {
    if (!selectedTeamId) return alert("Pilih Tim!");
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
    el('pen-time').value = 0;
});

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
    el('timer-display').innerText = `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
}

function checkOvertime(seconds) {
    const team = db.teams.find(t => t.id === selectedTeamId);
    const limitSec = (team.level === 'SD/MI' ? 8 : 13) * 60;
    const display = el('timer-display');
    
    if (seconds > limitSec) {
        const diff = seconds - limitSec;
        const penaltyScore = Math.ceil(diff / 30) * 50;
        display.classList.add('text-red-500');
        display.classList.remove('text-green-400');
        el('pen-time').value = penaltyScore;
    } else {
        display.classList.remove('text-red-500');
        display.classList.add('text-green-400');
        el('pen-time').value = 0;
    }
}

// Submit Score
el('btn-submit-score').addEventListener('click', () => {
    if (!selectedTeamId || !confirm("Simpan Nilai Akhir?")) return;
    
    // Calculate
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
    showToast(`Nilai Akhir: ${finalScore}`);
    
    // Reset UI
    el('btn-timer-reset').click();
    selectLiveTeam("");
});

// Utils
function showToast(msg, type='success') {
    const toast = el('toast');
    const toastMsg = el('toast-msg');
    const icon = el('toast-icon');
    
    toastMsg.innerText = msg;
    if(type === 'error') {
        toast.classList.remove('border-green-500');
        toast.classList.add('border-red-500');
        icon.className = 'fa-solid fa-circle-xmark text-red-500';
    } else {
        toast.classList.add('border-green-500');
        toast.classList.remove('border-red-500');
        icon.className = 'fa-solid fa-info-circle text-green-500';
    }
    
    toast.classList.remove('translate-x-full');
    setTimeout(() => toast.classList.add('translate-x-full'), 3000);
}
