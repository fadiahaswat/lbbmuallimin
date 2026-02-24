/**
 * countdown.js
 * Handles the registration deadline countdown timer.
 */
import { EVENT, COUNTDOWN } from './config.js';

function pad(value) {
    return value < 10 ? '0' + value : String(value);
}

export function initCountdown() {
    const targetTime = new Date(EVENT.REGISTRATION_DEADLINE).getTime();

    // Cache DOM references once – avoids repeated lookups on every tick
    const elDays = document.getElementById('cd-days');
    const elHours = document.getElementById('cd-hours');
    const elMinutes = document.getElementById('cd-minutes');
    const elSeconds = document.getElementById('cd-seconds');

    const timer = setInterval(() => {
        const distance = targetTime - Date.now();

        if (distance < 0) {
            clearInterval(timer);
            const expiredEl = document.querySelector(COUNTDOWN.EXPIRED_SELECTOR);
            if (expiredEl) expiredEl.innerHTML = COUNTDOWN.EXPIRED_HTML;
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        if (elDays) elDays.innerText = pad(days);
        if (elHours) elHours.innerText = pad(hours);
        if (elMinutes) elMinutes.innerText = pad(minutes);
        if (elSeconds) elSeconds.innerText = pad(seconds);
    }, 1000);
}
