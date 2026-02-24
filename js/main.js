/**
 * main.js
 * Entry point – initialises all UI modules after the DOM is ready.
 */

import { initRender } from './render.js';
import { initNavbar } from './navbar.js';
import { initMobileMenu } from './mobileMenu.js';
import { initTabs } from './tabs.js';
import { initAccordion } from './accordion.js';
import { initClipboard } from './clipboard.js';
import { initCountdown } from './countdown.js';

document.addEventListener('DOMContentLoaded', () => {
    initRender();    // fill content from config.js first
    lucide.createIcons();

    initNavbar();
    initMobileMenu();
    initTabs();
    initAccordion();
    initClipboard();
    initCountdown();
});
