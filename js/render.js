/**
 * render.js
 * =========
 * Membaca nilai dari config.js dan mengisi elemen-elemen HTML secara otomatis.
 *
 * Atribut HTML yang didukung:
 *   data-config="KUNCI.SUBKUNCI"        → mengisi textContent elemen
 *   data-config-html="KUNCI.SUBKUNCI"   → mengisi innerHTML (untuk teks dengan tag HTML)
 *   data-config-href="KUNCI.SUBKUNCI"   → mengisi atribut href
 *   data-config-src="KUNCI.SUBKUNCI"    → mengisi atribut src (video/gambar)
 *   data-config-render="nama"           → merender blok konten dinamis
 */

import * as CONFIG from './config.js';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Mengambil nilai bersarang dari CONFIG dengan path "A.B.C" */
function get(path) {
    return path.split('.').reduce((obj, key) => obj?.[key], CONFIG);
}

// ---------------------------------------------------------------------------
// Text & attribute renderers
// ---------------------------------------------------------------------------

function renderText() {
    document.querySelectorAll('[data-config]').forEach(el => {
        const val = get(el.dataset.config);
        if (val !== undefined) el.textContent = val;
    });
}

function renderHtml() {
    document.querySelectorAll('[data-config-html]').forEach(el => {
        const val = get(el.dataset.configHtml);
        if (val !== undefined) el.innerHTML = val;
    });
}

function renderHrefs() {
    document.querySelectorAll('[data-config-href]').forEach(el => {
        const val = get(el.dataset.configHref);
        if (val !== undefined) el.href = val;
    });
}

function renderSrcs() {
    document.querySelectorAll('[data-config-src]').forEach(el => {
        const val = get(el.dataset.configSrc);
        if (val !== undefined) el.src = val;
    });
}

// ---------------------------------------------------------------------------
// Page metadata
// ---------------------------------------------------------------------------

function renderMeta() {
    document.title = CONFIG.SITE.TITLE;

    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', CONFIG.SITE.DESCRIPTION);
}

// ---------------------------------------------------------------------------
// Achievements badges
// ---------------------------------------------------------------------------

function renderAchievements() {
    const container = document.querySelector('[data-config-render="achievements"]');
    if (!container) return;

    const BADGE_CLASS =
        'px-3 py-1 bg-white border border-slate-200 rounded-lg text-[10px] font-bold text-slate-600 shadow-sm';

    container.innerHTML = CONFIG.ACHIEVEMENTS
        .map(text => `<span class="${BADGE_CLASS}">${text}</span>`)
        .join('');
}

// ---------------------------------------------------------------------------
// Contact person cards (contact section – big cards)
// ---------------------------------------------------------------------------

function renderContactPersons() {
    document.querySelectorAll('[data-config-render="contact-persons"]').forEach(el => {
        const idx = parseInt(el.dataset.configIndex ?? 0, 10);
        const person = CONFIG.CONTACT.PERSONS[idx];
        if (!person) return;

        const nameEl  = el.querySelector('[data-slot="name"]');
        const phoneEl = el.querySelector('[data-slot="phone"]');

        if (nameEl)  nameEl.textContent  = person.NAME;
        if (phoneEl) phoneEl.textContent = person.PHONE_DISPLAY;
        el.href = person.WA_URL;
    });
}

// ---------------------------------------------------------------------------
// Contact persons – inline text list (Juknis / info section)
// ---------------------------------------------------------------------------

function renderContactPersonsInline() {
    document.querySelectorAll('[data-config-render="contact-persons-inline"]').forEach(el => {
        const idx = parseInt(el.dataset.configIndex ?? 0, 10);
        const person = CONFIG.CONTACT.PERSONS[idx];
        if (!person) return;

        const nameEl  = el.querySelector('[data-slot="name"]');
        const phoneEl = el.querySelector('[data-slot="phone"]');
        const linkEl  = el.querySelector('[data-slot="link"]');

        if (nameEl)  nameEl.textContent  = person.SHORT_NAME;
        if (phoneEl) phoneEl.textContent = person.PHONE_DISPLAY;
        if (linkEl) {
            linkEl.href        = person.WA_URL;
            linkEl.textContent = person.PHONE_DISPLAY;
        }
    });
}

// ---------------------------------------------------------------------------
// Downloads section
// ---------------------------------------------------------------------------

const COLOR_MAP = {
    blue:   { accent: 'bg-blue-500',   icon: 'bg-blue-50 text-blue-600',   hover: 'hover:border-blue-200',  btn: 'text-blue-600 hover:bg-blue-50'   },
    red:    { accent: 'bg-red-500',    icon: 'bg-red-50 text-red-600',     hover: 'hover:border-red-200',   btn: 'text-red-600 hover:bg-red-50'     },
    orange: { accent: 'bg-orange-500', icon: 'bg-orange-50 text-orange-600', hover: 'hover:border-orange-200', btn: 'text-orange-600 hover:bg-orange-50' },
};

function buildDownloadCard(item) {
    const c = COLOR_MAP[item.colorScheme] || COLOR_MAP.red;

    if (item.featured) {
        return `
        <div class="group bg-slate-900 rounded-2xl p-8 shadow-2xl hover:shadow-slate-900/40 hover:-translate-y-2 transition-all duration-300 relative overflow-hidden flex flex-col border border-slate-700 md:col-span-2 lg:col-span-1 lg:row-span-2">
            <div class="absolute -top-12 -right-12 w-32 h-32 bg-blue-600/30 rounded-full blur-3xl group-hover:bg-blue-500/50 transition-all duration-500"></div>
            <div class="flex items-start justify-between mb-8">
                <div class="p-4 bg-white/10 text-white rounded-2xl border border-white/10 group-hover:bg-blue-600 group-hover:border-blue-500 transition-colors shadow-lg">
                    <i data-lucide="${item.icon}" width="40" height="40"></i>
                </div>
                <span class="px-3 py-1 bg-blue-600 text-white text-[10px] font-bold rounded-full uppercase tracking-wider shadow-lg shadow-blue-900/50">${item.badge ?? ''}</span>
            </div>
            <h3 class="font-black text-2xl text-white mb-3 leading-tight group-hover:text-blue-400 transition-colors">${item.title}</h3>
            <p class="text-sm text-slate-400 mb-8 flex-grow leading-relaxed">${item.description}</p>
            <div class="mt-auto pt-6 border-t border-white/10 flex items-center justify-between">
                <div class="flex flex-col">
                    <span class="text-[10px] text-slate-500 uppercase font-bold">Ukuran File</span>
                    <span class="text-sm font-bold text-white">${item.size}</span>
                </div>
                <a href="${item.url}" class="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-600/30 transition-all active:scale-95" ${item.url !== '#' ? 'download' : ''}>
                    Download <i data-lucide="arrow-down-to-line" width="18"></i>
                </a>
            </div>
        </div>`;
    }

    return `
    <div class="group bg-white rounded-2xl p-6 shadow-sm border border-zinc-200 hover:shadow-xl ${c.hover} hover:-translate-y-1 transition-all duration-300 relative overflow-hidden flex flex-col">
        <div class="absolute top-0 left-0 w-1.5 h-full ${c.accent}"></div>
        <div class="flex items-start justify-between mb-4 pl-4">
            <div class="p-3 ${c.icon} rounded-xl group-hover:scale-110 transition-transform">
                <i data-lucide="${item.icon}" width="28" height="28"></i>
            </div>
            <span class="px-2 py-1 bg-zinc-100 text-zinc-500 text-[10px] font-bold rounded uppercase tracking-wider border border-zinc-200">${item.type}</span>
        </div>
        <h3 class="font-bold text-lg text-slate-800 mb-2 pl-4 group-hover:${c.btn.split(' ')[0]} transition-colors">${item.title}</h3>
        <p class="text-sm text-slate-400 mb-6 flex-grow pl-4">${item.description}</p>
        <div class="flex items-center justify-between mt-auto pt-4 border-t border-zinc-50 pl-4">
            <span class="text-xs font-semibold text-slate-400">${item.size}</span>
            <a href="${item.url}" class="${c.btn} p-2 rounded-lg transition-colors" ${item.url !== '#' ? 'download' : ''}>
                <i data-lucide="download" width="20"></i>
            </a>
        </div>
    </div>`;
}

function renderDownloads() {
    const container = document.querySelector('[data-config-render="downloads"]');
    if (!container) return;

    container.innerHTML = CONFIG.DOWNLOADS.map(buildDownloadCard).join('');
    lucide.createIcons();
}

// ---------------------------------------------------------------------------
// Entry point
// ---------------------------------------------------------------------------

export function initRender() {
    renderMeta();
    renderText();
    renderHtml();
    renderHrefs();
    renderSrcs();
    renderAchievements();
    renderContactPersons();
    renderContactPersonsInline();
    renderDownloads();
}
