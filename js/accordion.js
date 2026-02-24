/**
 * accordion.js
 * Handles accordion expand/collapse for Juknis and FAQ sections.
 */
export function initAccordion() {
    // General accordions (Juknis section)
    document.querySelectorAll('.accordion-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            const content = this.nextElementSibling;
            const icon = this.querySelector('.rotate-icon');
            const isOpen = content.classList.contains('active');

            if (!isOpen) {
                content.classList.add('active');
                if (icon) icon.classList.add('rotate-180');
            } else {
                content.classList.remove('active');
                if (icon) icon.classList.remove('rotate-180');
            }
        });
    });

    // FAQ accordions (Contact section)
    document.querySelectorAll('#faq-accordion .accordion-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            const content = this.nextElementSibling;
            const icon = this.querySelector('i');

            content.classList.toggle('hidden');
            if (icon) icon.classList.toggle('rotate-180');
        });
    });
}
