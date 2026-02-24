/**
 * mobileMenu.js
 * Handles mobile menu open/close toggle.
 */
export function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    if (!mobileMenuBtn || !mobileMenu) return;

    function openMenu() {
        mobileMenu.classList.remove('hidden');
        mobileMenu.classList.add('flex');
        mobileMenuBtn.setAttribute('aria-label', 'Tutup Menu');
        document.body.classList.add('overflow-hidden');
    }

    function closeMenu() {
        mobileMenu.classList.add('hidden');
        mobileMenu.classList.remove('flex');
        mobileMenuBtn.setAttribute('aria-label', 'Buka Menu');
        document.body.classList.remove('overflow-hidden');
    }

    mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.contains('hidden') ? openMenu() : closeMenu();
    });

    mobileLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && !mobileMenu.classList.contains('hidden')) {
            closeMenu();
        }
    });
}
