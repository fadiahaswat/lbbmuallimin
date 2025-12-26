/**
 * LBB Mu'allimin 2025 - Website Logic
 * Handles Navigation, Mobile Menu, Tabs, and Accordions
 */

// Initialize Icons (Lucide)
lucide.createIcons();

// 1. SCROLL LISTENER (Navbar Style)
const navbar = document.getElementById('navbar');
const logoText = document.getElementById('nav-logo-text');
const desktopLinks = document.querySelectorAll('.nav-link');
const mobileMenuBtn = document.getElementById('mobile-menu-btn');

window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
        navbar.classList.add('bg-white', 'shadow-md', 'py-3');
        navbar.classList.remove('bg-transparent', 'py-5');
        
        logoText.classList.remove('text-white');
        logoText.classList.add('text-slate-900');
        
        mobileMenuBtn.classList.remove('text-white');
        mobileMenuBtn.classList.add('text-slate-900');

        desktopLinks.forEach(link => {
            link.classList.remove('text-slate-200');
            link.classList.add('text-slate-700');
        });
    } else {
        navbar.classList.remove('bg-white', 'shadow-md', 'py-3');
        navbar.classList.add('bg-transparent', 'py-5');
        
        logoText.classList.add('text-white');
        logoText.classList.remove('text-slate-900');
        
        mobileMenuBtn.classList.add('text-white');
        mobileMenuBtn.classList.remove('text-slate-900');

        desktopLinks.forEach(link => {
            link.classList.add('text-slate-200');
            link.classList.remove('text-slate-700');
        });
    }
});

// 2. MOBILE MENU TOGGLE
const mobileMenu = document.getElementById('mobile-menu');
const mobileLinks = document.querySelectorAll('.mobile-link');

if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
        mobileMenu.classList.toggle('flex');
    });
}

// Close menu when a link is clicked
mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
        mobileMenu.classList.remove('flex');
    });
});

// 3. TAB SWITCHING (SD vs SMP)
// Defined as a global function because it is called via onclick="" in HTML
function switchTab(tab) {
    const btnSD = document.getElementById('btn-sd');
    const btnSMP = document.getElementById('btn-smp');
    const contentSD = document.getElementById('content-sd');
    const contentSMP = document.getElementById('content-smp');

    if (tab === 'sd') {
        // Style Buttons
        btnSD.className = "flex-1 py-4 text-center font-bold transition-colors bg-white text-blue-600 border-b-2 border-blue-600";
        btnSMP.className = "flex-1 py-4 text-center font-bold transition-colors text-slate-500 hover:text-slate-700";
        // Toggle Content
        contentSD.classList.remove('hidden');
        contentSMP.classList.add('hidden');
    } else {
        // Style Buttons
        btnSMP.className = "flex-1 py-4 text-center font-bold transition-colors bg-white text-blue-600 border-b-2 border-blue-600";
        btnSD.className = "flex-1 py-4 text-center font-bold transition-colors text-slate-500 hover:text-slate-700";
        // Toggle Content
        contentSMP.classList.remove('hidden');
        contentSD.classList.add('hidden');
    }
}

// 4. ACCORDION LOGIC
const accordions = document.querySelectorAll('.accordion-btn');

accordions.forEach(acc => {
    acc.addEventListener('click', function() {
        // Toggle the 'active' class on the content div next to the button
        const content = this.nextElementSibling;
        const icon = this.querySelector('.rotate-icon');
        
        // Check if currently open
        const isOpen = content.classList.contains('active');

        // Optional: Close all other accordions
        // document.querySelectorAll('.accordion-content').forEach(c => c.classList.remove('active'));
        // document.querySelectorAll('.rotate-icon').forEach(i => i.classList.remove('rotate-180'));

        if (!isOpen) {
            content.classList.add('active');
            if(icon) icon.classList.add('rotate-180');
        } else {
            content.classList.remove('active');
            if(icon) icon.classList.remove('rotate-180');
        }
    });
});
