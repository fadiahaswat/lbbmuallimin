/**
 * tabs.js
 * Handles SD / SMP tab switching in the Materi Lomba section.
 */

const TAB_CLASSES = {
    base: 'flex-1 py-4 text-center transition-colors uppercase tracking-wider',
    active: 'bg-white text-lbb-red border-b-4 border-lbb-red font-black shadow-sm',
    inactive: 'text-zinc-400 bg-zinc-100 hover:text-zinc-600 font-bold border-b-0',
};

function switchTab(tab) {
    const btnSD = document.getElementById('btn-sd');
    const btnSMP = document.getElementById('btn-smp');
    const contentSD = document.getElementById('content-sd');
    const contentSMP = document.getElementById('content-smp');

    if (!btnSD || !btnSMP || !contentSD || !contentSMP) return;

    if (tab === 'sd') {
        btnSD.className = `${TAB_CLASSES.base} ${TAB_CLASSES.active}`;
        btnSMP.className = `${TAB_CLASSES.base} ${TAB_CLASSES.inactive}`;
        contentSD.classList.remove('hidden');
        contentSMP.classList.add('hidden');
    } else {
        btnSMP.className = `${TAB_CLASSES.base} ${TAB_CLASSES.active}`;
        btnSD.className = `${TAB_CLASSES.base} ${TAB_CLASSES.inactive}`;
        contentSMP.classList.remove('hidden');
        contentSD.classList.add('hidden');
    }
}

export function initTabs() {
    const btnSD = document.getElementById('btn-sd');
    const btnSMP = document.getElementById('btn-smp');

    if (btnSD) btnSD.addEventListener('click', () => switchTab('sd'));
    if (btnSMP) btnSMP.addEventListener('click', () => switchTab('smp'));
}
