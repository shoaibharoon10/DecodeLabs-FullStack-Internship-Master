/**
 * main.js — Muhammad Shoaib Portfolio
 * DecodeLabs Industrial Training | Batch 2026 | Project 1
 *
 * Philosophy: Progressive Enhancement.
 * Every feature degrades gracefully — the page is fully usable if this
 * file fails to load. No framework dependencies. Pure vanilla JS.
 *
 * Sections:
 *   1. Lucide Icon Hydration
 *   2. Colour Theme Toggle  (Light ↔ Grounded Dark)
 *   3. Mobile Navigation Toggle
 *   4. Dynamic Footer Year
 */

'use strict';


/* ==========================================================================
   1. LUCIDE ICON HYDRATION
   Replaces every <i data-lucide="icon-name"> with the corresponding SVG.
   Called first so icons are present before any other JS reads the DOM.

   Guard check: lucide may be undefined if the CDN call failed (offline,
   ad-blocker, etc.). The guard ensures no uncaught TypeError.
   ========================================================================== */

if (typeof lucide !== 'undefined') {
  lucide.createIcons();
}


/* ==========================================================================
   2. COLOUR THEME TOGGLE — Light (default) ↔ Grounded Dark
   ──────────────────────────────────────────────────────────────────────────
   Architecture:
   · [data-theme="dark"] on <html> activates the dark CSS token block.
   · Light mode = attribute absent (no [data-theme] at all — cleaner than
     setting data-theme="light" which has no matching CSS rule).
   · The inline <script> in <head> applies the saved theme synchronously
     before first paint, preventing FOUC for returning dark-mode users.
     This JS block only syncs the button label on load and wires the click.
   ========================================================================== */

const themeToggle = document.getElementById('themeToggle');
const html        = document.documentElement;

/**
 * Updates the toggle button's aria-label to always describe the NEXT action,
 * not the current state. "Switch to dark mode" means "currently light; click
 * to go dark." This follows WCAG SC 4.1.2 (Name, Role, Value).
 *
 * @param {boolean} isDark — true when dark mode is currently active.
 */
const syncThemeLabel = (isDark) => {
  if (!themeToggle) return;
  themeToggle.setAttribute(
    'aria-label',
    isDark ? 'Switch to light mode' : 'Switch to dark mode'
  );
};

// Sync button label with whatever theme the inline script already applied.
syncThemeLabel(html.getAttribute('data-theme') === 'dark');

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const isDark   = html.getAttribute('data-theme') === 'dark';
    const newTheme = isDark ? 'light' : 'dark';

    // Apply theme: set attribute for dark, remove it entirely for light.
    if (newTheme === 'dark') {
      html.setAttribute('data-theme', 'dark');
    } else {
      html.removeAttribute('data-theme');
    }

    // Persist preference across sessions.
    try {
      localStorage.setItem('theme', newTheme);
    } catch (e) { /* noop — private browsing may block localStorage */ }

    syncThemeLabel(newTheme === 'dark');
  });
}


/* ==========================================================================
   3. MOBILE NAVIGATION TOGGLE
   ──────────────────────────────────────────────────────────────────────────
   Toggles .is-open on the <ul> and syncs both aria-expanded and aria-label
   on the <button> across three dismissal paths:
     a) clicking the toggle button
     b) clicking outside the menu
     c) pressing Escape
   All three paths must update state identically to keep AT in sync.
   ========================================================================== */

const navToggle = document.getElementById('navToggle');
const navMenu   = document.getElementById('navMenu');

if (navToggle && navMenu) {

  // a) Toggle button click
  navToggle.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('is-open');

    navToggle.setAttribute('aria-expanded', String(isOpen));
    navToggle.setAttribute(
      'aria-label',
      isOpen ? 'Close navigation menu' : 'Open navigation menu'
    );
  });

  // b) Outside-click dismissal
  document.addEventListener('click', (e) => {
    const clickedOutside =
      !navToggle.contains(e.target) && !navMenu.contains(e.target);

    if (clickedOutside && navMenu.classList.contains('is-open')) {
      navMenu.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.setAttribute('aria-label', 'Open navigation menu');
    }
  });

  // c) Escape key dismissal — returns focus to the trigger (WCAG 2.1.1)
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('is-open')) {
      navMenu.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.setAttribute('aria-label', 'Open navigation menu');
      navToggle.focus();
    }
  });

}


/* ==========================================================================
   4. DYNAMIC FOOTER YEAR
   Writes the current year into #currentYear so the copyright notice never
   goes stale. A server-side template is not available in a static project,
   so one line of JS is the right tool for this job.
   ========================================================================== */

const yearEl = document.getElementById('currentYear');
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}
