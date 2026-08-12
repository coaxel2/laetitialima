/**
 * Page d'accueil — intro de marque, apparitions au scroll, ancres.
 *
 * La liste de projets et les compétences sont désormais entièrement en CSS :
 * plus de carrousel à piloter ni d'accordéons à ouvrir.
 */
(function () {
    'use strict';

    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ────────────────────────────────
       INTRO DE MARQUE
       Superposée à la page et jouée une seule fois par session. Le contenu est
       déjà dans le DOM en dessous : si le script échoue, le site reste utilisable.
    ──────────────────────────────── */
    (function initIntro() {
        var root = document.documentElement;
        // La classe est posée par le script inline du <head>, avant le rendu.
        if (!root.classList.contains('intro-pending')) return;

        var intro = document.getElementById('intro');
        var introBtn = document.getElementById('introBtn');
        if (!intro || !introBtn) {
            root.classList.remove('intro-pending');
            return;
        }

        introBtn.focus();

        var closed = false;

        var close = function () {
            if (closed) return;
            closed = true;

            intro.classList.add('is-closing');
            try { sessionStorage.setItem('intro-seen', '1'); } catch (e) { /* ignoré */ }

            var finish = function () {
                root.classList.remove('intro-pending');
                var main = document.getElementById('main');
                if (main) {
                    main.setAttribute('tabindex', '-1');
                    main.focus({ preventScroll: true });
                }
            };
            // Filet de sécurité si transitionend ne se déclenche pas
            var timer = setTimeout(finish, 900);
            intro.addEventListener('transitionend', function onEnd(e) {
                if (e.target !== intro || e.propertyName !== 'opacity') return;
                intro.removeEventListener('transitionend', onEnd);
                clearTimeout(timer);
                finish();
            });
        };

        introBtn.addEventListener('click', close);
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' || e.key === 'Enter') close();
        });

        // Curseur « clé » qui suit la souris, uniquement sur pointeur fin
        if (window.matchMedia('(pointer: fine)').matches) {
            intro.classList.add('has-cursor');
            var x = 0, y = 0, queued = false;

            intro.addEventListener('pointermove', function (e) {
                x = e.clientX;
                y = e.clientY;
                if (!queued) {
                    queued = true;
                    requestAnimationFrame(function () {
                        queued = false;
                        intro.style.setProperty('--cursor-x', x + 'px');
                        intro.style.setProperty('--cursor-y', y + 'px');
                    });
                }
            });
        }
    })();

    /* ────────────────────────────────
       APPARITION AU SCROLL
       Les éléments montent une fois puis restent visibles.
    ──────────────────────────────── */
    (function initReveal() {
        var targets = document.querySelectorAll(
            '.project-row, .xp-row, .about-container, .skill-group, .cta-title'
        );
        if (!targets.length) return;

        if (reduceMotion || !('IntersectionObserver' in window)) {
            targets.forEach(function (el) { el.classList.add('in-view'); });
            return;
        }

        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

        targets.forEach(function (el, i) {
            el.classList.add('reveal');
            // léger décalage pour que les lignes s'enchaînent au lieu d'arriver en bloc
            el.style.transitionDelay = (Math.min(i, 4) * 60) + 'ms';
            observer.observe(el);
        });
    })();

    /* ────────────────────────────────
       ANCRES INTERNES
       scroll-behavior est géré en CSS ; ce handler ne sert qu'à déplacer le
       focus, sinon la navigation clavier reste bloquée en haut de page.
    ──────────────────────────────── */
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            var id = this.getAttribute('href');
            if (id === '#') return;

            var target = document.querySelector(id);
            if (!target) return;

            e.preventDefault();
            target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });

            if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
            target.focus({ preventScroll: true });
        });
    });
})();
