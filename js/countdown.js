/**
 * countdown.js
 * Handles the registration deadline countdown timer.
 */

const TARGET_DATE = 'July 28, 2026 23:59:59';
const EXPIRED_SELECTOR = '.flex.gap-3.text-slate-400';
const EXPIRED_HTML = "<span class='text-red-500 font-bold'>PENDAFTARAN DITUTUP</span>";

function pad(value) {
    return value < 10 ? '0' + value : String(value);
}

export function initCountdown() {
    const targetTime = new Date(TARGET_DATE).getTime();

    const timer = setInterval(() => {
        const distance = targetTime - Date.now();

        if (distance < 0) {
            clearInterval(timer);
            const expiredEl = document.querySelector(EXPIRED_SELECTOR);
            if (expiredEl) expiredEl.innerHTML = EXPIRED_HTML;
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        const elDays = document.getElementById('cd-days');
        const elHours = document.getElementById('cd-hours');
        const elMinutes = document.getElementById('cd-minutes');
        const elSeconds = document.getElementById('cd-seconds');

        if (elDays) elDays.innerText = pad(days);
        if (elHours) elHours.innerText = pad(hours);
        if (elMinutes) elMinutes.innerText = pad(minutes);
        if (elSeconds) elSeconds.innerText = pad(seconds);
    }, 1000);
}
