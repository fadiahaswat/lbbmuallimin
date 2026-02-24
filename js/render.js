/**
 * render.js
 * =========
 * Membaca nilai dari config.js dan mengisi elemen-elemen HTML yang telah
 * ditandai dengan atribut data-config* secara otomatis saat halaman dimuat.
 *
 * Atribut yang didukung:
 *   data-config="KUNCI.SUBKUNCI"   → mengisi textContent elemen
 *   data-config-href="KUNCI.SUB"   → mengisi atribut href elemen
 *   data-config-render="nama"      → merender blok konten dinamis
 *                                    (achievements, contact-persons)
 */

import * as CONFIG from './config.js';

/** Mengambil nilai bersarang dari CONFIG dengan path "A.B.C" */
function get(path) {
    return path.split('.').reduce((obj, key) => obj?.[key], CONFIG);
}

/** Mengisi textContent semua elemen bertanda data-config */
function renderText() {
    document.querySelectorAll('[data-config]').forEach(el => {
        const val = get(el.dataset.config);
        if (val !== undefined) el.textContent = val;
    });
}

/** Mengisi atribut href semua elemen bertanda data-config-href */
function renderHrefs() {
    document.querySelectorAll('[data-config-href]').forEach(el => {
        const val = get(el.dataset.configHref);
        if (val !== undefined) el.href = val;
    });
}

/**
 * Merender daftar badge prestasi panitia ke dalam elemen
 * bertanda data-config-render="achievements"
 */
function renderAchievements() {
    const container = document.querySelector('[data-config-render="achievements"]');
    if (!container) return;

    const BADGE_CLASS =
        'px-3 py-1 bg-white border border-slate-200 rounded-lg text-[10px] font-bold text-slate-600 shadow-sm';

    container.innerHTML = CONFIG.ACHIEVEMENTS.map(
        text => `<span class="${BADGE_CLASS}">${text}</span>`
    ).join('');
}

/**
 * Merender kartu contact person ke dalam setiap elemen
 * bertanda data-config-render="contact-persons"
 * Elemen tersebut harus memiliki atribut data-config-index="0" dst.
 */
function renderContactPersons() {
    document.querySelectorAll('[data-config-render="contact-persons"]').forEach(el => {
        const idx = parseInt(el.dataset.configIndex ?? 0, 10);
        const person = CONFIG.CONTACT.PERSONS[idx];
        if (!person) return;

        const nameEl = el.querySelector('[data-slot="name"]');
        const phoneEl = el.querySelector('[data-slot="phone"]');

        if (nameEl) nameEl.textContent = person.NAME;
        if (phoneEl) phoneEl.textContent = person.PHONE_DISPLAY;
        el.href = person.WA_URL;
    });
}

/** Entry point – dipanggil dari main.js */
export function initRender() {
    renderText();
    renderHrefs();
    renderAchievements();
    renderContactPersons();
}
