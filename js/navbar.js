/**
 * navbar.js
 * Handles navbar scroll appearance and sticky CTA visibility.
 */
import { NAVBAR } from './config.js';

export function initNavbar() {
    const navbar = document.getElementById('navbar');
    const logoText = document.getElementById('nav-logo-text');
    const desktopLinks = document.querySelectorAll('.nav-link');
    const navPill = document.getElementById('nav-pill');
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const stickyCta = document.getElementById('sticky-cta');
    const waFab = document.querySelector('.fixed.bottom-6.right-6');

    function onScroll() {
        const scrollPos = window.scrollY;

        if (scrollPos > NAVBAR.SCROLL_SOLID_THRESHOLD) {
            navbar.classList.add('bg-white', 'shadow-md', 'py-3');
            navbar.classList.remove('bg-transparent', 'py-5');

            if (logoText) {
                logoText.classList.remove('text-white');
                logoText.classList.add('text-slate-900');
            }

            mobileMenuBtn.classList.remove('text-white');
            mobileMenuBtn.classList.add('text-slate-900');

            // Fix Bug 3: use text-gray-200 (matches HTML initial class) not text-slate-200
            desktopLinks.forEach(link => {
                link.classList.remove('text-gray-200');
                link.classList.add('text-slate-700');
            });

            // Fix Bug 4: update nav-pill to match white navbar background
            if (navPill) {
                navPill.classList.remove('bg-black/30', 'border-white/10');
                navPill.classList.add('bg-slate-100', 'border-slate-200');
            }
        } else {
            navbar.classList.remove('bg-white', 'shadow-md', 'py-3');
            navbar.classList.add('bg-transparent', 'py-5');

            if (logoText) {
                logoText.classList.add('text-white');
                logoText.classList.remove('text-slate-900');
            }

            mobileMenuBtn.classList.add('text-white');
            mobileMenuBtn.classList.remove('text-slate-900');

            desktopLinks.forEach(link => {
                link.classList.add('text-gray-200');
                link.classList.remove('text-slate-700');
            });

            if (navPill) {
                navPill.classList.add('bg-black/30', 'border-white/10');
                navPill.classList.remove('bg-slate-100', 'border-slate-200');
            }
        }

        if (scrollPos > NAVBAR.STICKY_CTA_THRESHOLD) {
            if (stickyCta) stickyCta.classList.remove('translate-y-full');
            if (waFab) waFab.style.bottom = NAVBAR.WA_FAB_BOTTOM_SHIFTED;
        } else {
            if (stickyCta) stickyCta.classList.add('translate-y-full');
            if (waFab) waFab.style.bottom = NAVBAR.WA_FAB_BOTTOM_DEFAULT;
        }
    }

    window.addEventListener('scroll', onScroll);
}
