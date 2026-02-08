/**
 * ========================================
 * PORTFOLIO - Script Utilitaire Partagé
 * ========================================
 * Header scroll effect + Menu hamburger mobile
 * Chargé sur toutes les pages sauf index.html et home.html
 */

document.addEventListener('DOMContentLoaded', () => {

    /* ── Header scroll effect ── */
    const header = document.querySelector('.header');

    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    /* ── Hamburger menu mobile ── */
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const navOverlay = document.querySelector('.nav-overlay');

    if (menuToggle && navLinks) {
        const openMenu = () => {
            menuToggle.classList.add('active');
            navLinks.classList.add('open');
            if (navOverlay) navOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        };

        const closeMenu = () => {
            menuToggle.classList.remove('active');
            navLinks.classList.remove('open');
            if (navOverlay) navOverlay.classList.remove('active');
            document.body.style.overflow = '';
        };

        menuToggle.addEventListener('click', () => {
            const isOpen = navLinks.classList.contains('open');
            isOpen ? closeMenu() : openMenu();
        });

        // Fermer le menu au clic sur l'overlay
        if (navOverlay) {
            navOverlay.addEventListener('click', closeMenu);
        }

        // Fermer le menu au clic sur un lien
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', closeMenu);
        });

        // Fermer le menu sur Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navLinks.classList.contains('open')) {
                closeMenu();
            }
        });
    }

    /* ── Marqueur page active dans la nav ── */
    const currentPage = window.location.pathname.split('/').pop() || 'home.html';
    document.querySelectorAll('.nav-links a').forEach(link => {
        const href = link.getAttribute('href').replace('../', '');
        if (href === currentPage) {
            link.classList.add('active');
        }
    });

});
