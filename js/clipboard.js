/**
 * clipboard.js
 * Handles copy-to-clipboard for the bank account number.
 */

const REKENING_NUMBER = '300701003561505';

function copyToClipboard(btn) {
    const feedback = document.getElementById('copy-feedback');

    navigator.clipboard.writeText(REKENING_NUMBER).then(() => {
        btn.innerHTML = '<i data-lucide="check" width="18" height="18"></i>';
        lucide.createIcons();

        btn.classList.remove('text-blue-600', 'hover:bg-blue-600', 'hover:text-white');
        btn.classList.add('bg-green-500', 'text-white', 'border-green-500');

        if (feedback) feedback.classList.remove('opacity-0');

        setTimeout(() => {
            btn.innerHTML = '<i data-lucide="copy" width="18" height="18"></i>';
            lucide.createIcons();

            btn.classList.add('text-blue-600', 'hover:bg-blue-600', 'hover:text-white');
            btn.classList.remove('bg-green-500', 'text-white', 'border-green-500');

            if (feedback) feedback.classList.add('opacity-0');
        }, 2000);
    }).catch(err => {
        console.error('Gagal menyalin: ', err);
        alert('Gagal menyalin otomatis. Silakan salin manual.');
    });
}

export function initClipboard() {
    const copyBtn = document.querySelector('[data-action="copy-rekening"]');
    if (copyBtn) {
        copyBtn.addEventListener('click', function () {
            copyToClipboard(this);
        });
    }
}
