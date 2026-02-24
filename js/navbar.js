/**
 * navbar.js
 * Handles navbar scroll appearance and sticky CTA visibility.
 */
export function initNavbar() {
    const navbar = document.getElementById('navbar');
    const logoText = document.getElementById('nav-logo-text');
    const desktopLinks = document.querySelectorAll('.nav-link');
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const stickyCta = document.getElementById('sticky-cta');
    const waFab = document.querySelector('.fixed.bottom-6.right-6');

    function onScroll() {
        const scrollPos = window.scrollY;

        if (scrollPos > 20) {
            navbar.classList.add('bg-white', 'shadow-md', 'py-3');
            navbar.classList.remove('bg-transparent', 'py-5');

            if (logoText) {
                logoText.classList.remove('text-white');
                logoText.classList.add('text-slate-900');
            }

            mobileMenuBtn.classList.remove('text-white');
            mobileMenuBtn.classList.add('text-slate-900');

            desktopLinks.forEach(link => {
                link.classList.remove('text-slate-200');
                link.classList.add('text-slate-700');
            });
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
                link.classList.add('text-slate-200');
                link.classList.remove('text-slate-700');
            });
        }

        if (scrollPos > 600) {
            if (stickyCta) stickyCta.classList.remove('translate-y-full');
            if (waFab) waFab.style.bottom = '90px';
        } else {
            if (stickyCta) stickyCta.classList.add('translate-y-full');
            if (waFab) waFab.style.bottom = '24px';
        }
    }

    window.addEventListener('scroll', onScroll);
}
