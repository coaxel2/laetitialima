/**
 * Page d'accueil — intro de marque, carrousel, accordéons, timeline.
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
       CARROUSEL DE PROJETS
       Défilement natif avec scroll-snap : le swipe, le trackpad et la navigation
       clavier sont gérés par le navigateur. Le JS ne fait que piloter les boutons
       et refléter la position courante dans les puces.
    ──────────────────────────────── */
    (function initCarousel() {
        var carousel = document.getElementById('carousel');
        var dotsBox = document.getElementById('carouselDots');
        if (!carousel) return;

        var cards = Array.prototype.slice.call(carousel.children);
        if (!cards.length) return;

        var prevBtn = document.querySelector('.carousel-prev');
        var nextBtn = document.querySelector('.carousel-next');

        var scrollToCard = function (i) {
            var card = cards[Math.max(0, Math.min(i, cards.length - 1))];
            carousel.scrollTo({
                left: card.offsetLeft - carousel.offsetLeft,
                behavior: reduceMotion ? 'auto' : 'smooth'
            });
        };

        var currentIndex = function () {
            var center = carousel.scrollLeft + carousel.clientWidth / 2;
            var best = 0;
            var bestDist = Infinity;
            cards.forEach(function (card, i) {
                var cardCenter = card.offsetLeft - carousel.offsetLeft + card.offsetWidth / 2;
                var dist = Math.abs(cardCenter - center);
                if (dist < bestDist) {
                    bestDist = dist;
                    best = i;
                }
            });
            return best;
        };

        if (prevBtn) prevBtn.addEventListener('click', function () { scrollToCard(currentIndex() - 1); });
        if (nextBtn) nextBtn.addEventListener('click', function () { scrollToCard(currentIndex() + 1); });

        // Puces de navigation, générées d'après le nombre réel de cartes
        var dots = [];
        if (dotsBox) {
            cards.forEach(function (card, i) {
                var dot = document.createElement('button');
                dot.type = 'button';
                dot.className = 'indicator';
                dot.setAttribute('aria-label', 'Aller au projet ' + (i + 1));
                dot.addEventListener('click', function () { scrollToCard(i); });
                dotsBox.appendChild(dot);
                dots.push(dot);
            });
        }

        var syncUi = function () {
            var i = currentIndex();
            dots.forEach(function (dot, j) {
                dot.classList.toggle('active', j === i);
                dot.setAttribute('aria-current', j === i ? 'true' : 'false');
            });
            // Un carrousel non débordant (desktop large) n'a rien à faire défiler
            var scrollable = carousel.scrollWidth - carousel.clientWidth > 1;
            if (prevBtn) prevBtn.disabled = !scrollable || i === 0;
            if (nextBtn) nextBtn.disabled = !scrollable || i === cards.length - 1;
        };

        var pending = false;
        carousel.addEventListener('scroll', function () {
            if (!pending) {
                pending = true;
                requestAnimationFrame(function () {
                    pending = false;
                    syncUi();
                });
            }
        }, { passive: true });

        window.addEventListener('resize', syncUi);
        syncUi();
    })();

    /* ────────────────────────────────
       ACCORDÉONS COMPÉTENCES
    ──────────────────────────────── */
    document.querySelectorAll('.accordion-header').forEach(function (header) {
        header.addEventListener('click', function () {
            var content = document.getElementById(header.getAttribute('aria-controls'));
            var open = header.getAttribute('aria-expanded') === 'true';

            header.setAttribute('aria-expanded', String(!open));
            header.classList.toggle('active', !open);
            if (content) content.classList.toggle('active', !open);
        });
    });

    /* ────────────────────────────────
       APPARITION AU SCROLL
       Les éléments montent une fois puis restent visibles : rien ne disparaît
       quand on continue de faire défiler la page.
    ──────────────────────────────── */
    (function initReveal() {
        var targets = document.querySelectorAll('.experience-item, .about-container, .skill-accordion');
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
        }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

        targets.forEach(function (el) {
            el.classList.add('reveal');
            observer.observe(el);
        });
    })();

    /* ────────────────────────────────
       PARALLAXE DU HERO
    ──────────────────────────────── */
    (function initParallax() {
        var heroContent = document.querySelector('.hero-content');
        if (!heroContent || reduceMotion) return;

        var pending = false;

        var update = function () {
            pending = false;
            var y = window.scrollY;
            var limit = window.innerHeight;

            if (y < limit) {
                heroContent.style.transform = 'translateY(' + (y * 0.25) + 'px)';
                heroContent.style.opacity = String(1 - (y / limit) * 0.9);
            } else {
                // Au-delà du hero, on relâche la main sur les styles inline
                heroContent.style.transform = '';
                heroContent.style.opacity = '0.1';
            }
        };

        window.addEventListener('scroll', function () {
            if (!pending) {
                pending = true;
                requestAnimationFrame(update);
            }
        }, { passive: true });

        update();
    })();

    /* ────────────────────────────────
       ANCRES INTERNES
       scroll-behavior est déjà géré en CSS ; on ne garde ce handler que pour
       déplacer le focus, sinon la navigation clavier reste bloquée en haut.
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
