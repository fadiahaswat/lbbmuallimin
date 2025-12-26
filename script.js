/**
 * LBB Mu'allimin 2025 - Website Logic
 * Handles Navigation, Mobile Menu, Tabs, and Accordions
 */

// Initialize Icons (Lucide)
lucide.createIcons();

// 1. SCROLL LISTENER (Navbar & Sticky CTA)
const navbar = document.getElementById('navbar');
const logoText = document.getElementById('nav-logo-text');
const desktopLinks = document.querySelectorAll('.nav-link');
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const stickyCta = document.getElementById('sticky-cta'); // Elemen baru
const waFab = document.querySelector('.fixed.bottom-6.right-6'); // Tombol WA

window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY;

    // A. Logika Navbar (Seperti sebelumnya)
    if (scrollPos > 20) {
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

    // B. Logika Sticky CTA (Baru)
    // Muncul setelah user melewati Hero Section (kira-kira 600px)
    if (scrollPos > 600) {
        if(stickyCta) stickyCta.classList.remove('translate-y-full'); // Slide Up (Muncul)
        
        // Geser tombol WA ke atas agar tidak tertutup CTA
        if(waFab) waFab.style.bottom = "90px"; 
    } else {
        if(stickyCta) stickyCta.classList.add('translate-y-full'); // Slide Down (Sembunyi)
        
        // Kembalikan posisi tombol WA
        if(waFab) waFab.style.bottom = "24px"; // 6 tailwind = 24px
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
function switchTab(tab) {
    const btnSD = document.getElementById('btn-sd');
    const btnSMP = document.getElementById('btn-smp');
    const contentSD = document.getElementById('content-sd');
    const contentSMP = document.getElementById('content-smp');

    // Class untuk Tab Aktif (Style Kapsul Putih)
    const activeClasses = ['bg-white', 'text-blue-700', 'shadow-sm', 'ring-1', 'ring-black/5'];
    // Class untuk Tab Pasif (Style Abu-abu transparan)
    const inactiveClasses = ['text-slate-500', 'hover:bg-slate-200/50'];

    if (tab === 'sd') {
        // Aktifkan SD
        btnSD.classList.add(...activeClasses);
        btnSD.classList.remove(...inactiveClasses);
        
        // Matikan SMP
        btnSMP.classList.remove(...activeClasses);
        btnSMP.classList.add(...inactiveClasses);
        
        // Toggle Content (Animasi Fade In)
        contentSD.classList.remove('hidden');
        contentSMP.classList.add('hidden');
    } else {
        // Aktifkan SMP
        btnSMP.classList.add(...activeClasses);
        btnSMP.classList.remove(...inactiveClasses);
        
        // Matikan SD
        btnSD.classList.remove(...activeClasses);
        btnSD.classList.add(...inactiveClasses);
        
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

// 5. COPY TO CLIPBOARD FUNCTION
function copyRekening(btn) {
    const nomorRekening = "7123456789"; // Hardcoded untuk keamanan data
    const feedback = document.getElementById('copy-feedback');
    
    // API Clipboard Modern
    navigator.clipboard.writeText(nomorRekening).then(() => {
        // 1. Ubah Ikon jadi Ceklis
        // Kita ganti innerHTML tombol sementara
        btn.innerHTML = '<i data-lucide="check" width="18" height="18"></i>';
        lucide.createIcons(); // Render ulang ikon baru
        
        // Ubah style tombol jadi hijau (sukses)
        btn.classList.remove('text-blue-600', 'hover:bg-blue-600', 'hover:text-white');
        btn.classList.add('bg-green-500', 'text-white', 'border-green-500');

        // 2. Munculkan Teks Feedback "Berhasil disalin!"
        feedback.classList.remove('opacity-0');

        // 3. Reset kembali setelah 2 detik
        setTimeout(() => {
            btn.innerHTML = '<i data-lucide="copy" width="18" height="18"></i>';
            lucide.createIcons();
            
            // Kembalikan style tombol biru
            btn.classList.add('text-blue-600', 'hover:bg-blue-600', 'hover:text-white');
            btn.classList.remove('bg-green-500', 'text-white', 'border-green-500');
            
            // Sembunyikan feedback
            feedback.classList.add('opacity-0');
        }, 2000);

    }).catch(err => {
        console.error('Gagal menyalin: ', err);
        alert('Gagal menyalin otomatis. Silakan salin manual.');
    });
}
