/**
 * accordion.js
 * Handles accordion expand/collapse for Juknis and FAQ sections.
 */
export function initAccordion() {
    // Unified handler for ALL accordion buttons (Juknis + FAQ).
    // Uses the CSS `active` class so the max-height/opacity transition
    // defined in styles.css fires consistently in both sections.
    document.querySelectorAll('.accordion-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            const content = this.nextElementSibling;
            const icon = this.querySelector('.rotate-icon');
            const isOpen = content.classList.contains('active');

            content.classList.toggle('active', !isOpen);
            if (icon) icon.classList.toggle('rotate-180', !isOpen);
        });
    });
}
