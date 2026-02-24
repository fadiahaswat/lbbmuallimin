/**
 * tabs.js
 * Handles SD / SMP tab switching in the Materi Lomba section.
 */
import { TABS } from './config.js';

function switchTab(tab) {
    const btnSD = document.getElementById('btn-sd');
    const btnSMP = document.getElementById('btn-smp');
    const contentSD = document.getElementById('content-sd');
    const contentSMP = document.getElementById('content-smp');

    if (!btnSD || !btnSMP || !contentSD || !contentSMP) return;

    if (tab === 'sd') {
        btnSD.className = `${TABS.BASE_CLASS} ${TABS.ACTIVE_CLASS}`;
        btnSMP.className = `${TABS.BASE_CLASS} ${TABS.INACTIVE_CLASS}`;
        contentSD.classList.remove('hidden');
        contentSMP.classList.add('hidden');
    } else {
        btnSMP.className = `${TABS.BASE_CLASS} ${TABS.ACTIVE_CLASS}`;
        btnSD.className = `${TABS.BASE_CLASS} ${TABS.INACTIVE_CLASS}`;
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
