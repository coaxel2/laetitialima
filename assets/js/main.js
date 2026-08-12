/**
 * Script partagé — chargé sur toutes les pages.
 * Header au scroll, menu mobile, marqueur de page active.
 */
(function () {
    'use strict';

    /* ── Header : ombre au scroll ──
       Le listener est passif et le travail est repoussé dans un rAF, pour ne pas
       recalculer le style à chaque évènement de scroll. */
    var header = document.querySelector('.header');

    if (header) {
        var scrolled = false;
        var pending = false;

        var syncHeader = function () {
            pending = false;
            var next = window.scrollY > 50;
            if (next !== scrolled) {
                scrolled = next;
                header.classList.toggle('scrolled', next);
            }
        };

        window.addEventListener('scroll', function () {
            if (!pending) {
                pending = true;
                requestAnimationFrame(syncHeader);
            }
        }, { passive: true });

        syncHeader();
    }

    /* ── Menu mobile ── */
    var menuToggle = document.querySelector('.menu-toggle');
    var navLinks = document.querySelector('.nav-links');
    var navOverlay = document.querySelector('.nav-overlay');

    if (menuToggle && navLinks) {
        var setMenu = function (open) {
            menuToggle.classList.toggle('active', open);
            menuToggle.setAttribute('aria-expanded', String(open));
            menuToggle.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
            navLinks.classList.toggle('open', open);
            if (navOverlay) navOverlay.classList.toggle('active', open);
            document.body.classList.toggle('menu-open', open);
        };

        menuToggle.addEventListener('click', function () {
            setMenu(!navLinks.classList.contains('open'));
        });

        if (navOverlay) {
            navOverlay.addEventListener('click', function () { setMenu(false); });
        }

        navLinks.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function () { setMenu(false); });
        });

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && navLinks.classList.contains('open')) {
                setMenu(false);
                menuToggle.focus();
            }
        });

        // Repasser en état fermé si l'on revient en desktop pendant que le menu est ouvert
        window.matchMedia('(min-width: 769px)').addEventListener('change', function (e) {
            if (e.matches) setMenu(false);
        });
    }

    /* ── Marqueur de page active ──
       Les URLs sont des dossiers (/projets/, /experiences/…) : on compare donc
       des préfixes de chemin, pas un nom de fichier. */
    var path = window.location.pathname.replace(/\/+$/, '') || '/';

    document.querySelectorAll('.nav-links a').forEach(function (link) {
        var href = (link.getAttribute('href') || '').replace(/\/+$/, '') || '/';
        var active = href === '/' ? path === '/' : path === href || path.indexOf(href + '/') === 0;

        if (active) {
            link.classList.add('active');
            link.setAttribute('aria-current', 'page');
        }
    });
})();
