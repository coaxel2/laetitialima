/**
 * Script partagé — chargé sur toutes les pages.
 * Header au scroll, menu mobile, marqueur de page active.
 */
(function () {
    'use strict';

    var motionOk = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ── Onde du changement de thème ──
       Un dégradé rond, dimensionné pour couvrir l'écran depuis le bouton,
       qui s'étale et s'efface pendant que les couleurs se fondent. Il ne
       masque rien et ne fige rien : la page reste vivante dessous. */
    var onde = function (el) {
        var cadre = el.getBoundingClientRect();
        var x = cadre.left + cadre.width / 2;
        var y = cadre.top + cadre.height / 2;
        // Rayon nécessaire pour atteindre le coin le plus éloigné
        var r = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));

        var bulle = document.createElement('div');
        bulle.className = 'theme-ripple';
        bulle.setAttribute('aria-hidden', 'true');
        bulle.style.left = x + 'px';
        bulle.style.top = y + 'px';
        bulle.style.width = bulle.style.height = (r * 2) + 'px';

        var retirer = function () {
            if (bulle.parentNode) bulle.remove();
        };

        bulle.addEventListener('animationend', retirer);
        // Filet : sans animation jouée, l'élément resterait dans la page
        setTimeout(retirer, 1200);

        document.body.appendChild(bulle);
    };

    /* ── Pastille du sélecteur de langue ──
       Le fond sombre de la langue active est recopié dans un élément à part,
       qui glisse jusqu'à la langue demandée. C'est le seul mouvement que
       l'œil regarde au moment du clic : il se passe sous le curseur. */
    var glisserPastille = function (selecteur, cible) {
        var actif = selecteur.querySelector('.lang-link.is-active');

        // Les libellés échangent leurs couleurs quoi qu'il arrive
        var marquer = function () {
            selecteur.querySelectorAll('.lang-link').forEach(function (l) {
                var estActif = l === cible;
                l.classList.toggle('is-active', estActif);
                if (estActif) l.setAttribute('aria-current', 'true');
                else l.removeAttribute('aria-current');
            });
        };

        if (!actif || actif === cible) {
            marquer();
            return;
        }

        var base = selecteur.getBoundingClientRect();
        var depart = actif.getBoundingClientRect();
        var arrivee = cible.getBoundingClientRect();

        var pastille = document.createElement('span');
        pastille.className = 'lang-pill';
        pastille.setAttribute('aria-hidden', 'true');
        pastille.style.left = (depart.left - base.left) + 'px';
        pastille.style.top = (depart.top - base.top) + 'px';
        pastille.style.width = depart.width + 'px';
        pastille.style.height = depart.height + 'px';

        // En premier enfant : les liens, rendus positionnés par `is-sliding`,
        // se dessinent alors par-dessus.
        selecteur.insertBefore(pastille, selecteur.firstChild);
        selecteur.classList.add('is-sliding');
        marquer();

        // Un cycle de rendu avant de lancer le mouvement, sinon la position
        // de départ n'est jamais peinte et la pastille apparaît arrivée.
        requestAnimationFrame(function () {
            pastille.style.transform = 'translateX(' + (arrivee.left - depart.left) + 'px)';
            pastille.style.width = arrivee.width + 'px';
        });
    };

    /* Retour arrière : la page peut être restaurée telle qu'elle a été
       quittée, contenu effacé compris. On la remet en état. */
    window.addEventListener('pageshow', function (e) {
        if (!e.persisted) return;
        document.documentElement.classList.remove('is-leaving');
        document.querySelectorAll('.theme-ripple, .lang-pill').forEach(function (n) { n.remove(); });
        document.querySelectorAll('.lang-switch').forEach(function (s) { s.classList.remove('is-sliding'); });
    });

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

    /* ── Thème clair / sombre ──
       Le thème est déjà posé par le script du <head> avant le premier rendu.
       Ici on ne gère que la bascule et la mémorisation du choix. */
    (function initTheme() {
        var root = document.documentElement;
        var toggle = document.getElementById('themeToggle');

        var barre = document.querySelector('meta[name="theme-color"]');

        var libelle = function () {
            var sombre = root.getAttribute('data-theme') === 'dark';
            // La barre d'adresse mobile se colore d'après cette balise
            if (barre) barre.setAttribute('content', sombre ? '#17120F' : '#FAF8F3');
            if (!toggle) return;
            toggle.setAttribute('aria-label',
                sombre ? 'Passer au thème clair' : 'Passer au thème sombre');
            toggle.setAttribute('aria-pressed', String(sombre));
        };

        libelle();

        // La transition n'est activée qu'après le premier rendu : sinon le
        // chargement d'une page déjà en sombre se ferait en fondu depuis le clair.
        requestAnimationFrame(function () {
            root.classList.add('theme-ready');
        });

        if (toggle) {
            var basculer = function () {
                var sombre = root.getAttribute('data-theme') === 'dark';
                if (sombre) {
                    root.removeAttribute('data-theme');
                } else {
                    root.setAttribute('data-theme', 'dark');
                }
                try {
                    localStorage.setItem('theme', sombre ? 'light' : 'dark');
                } catch (e) { /* stockage indisponible : le choix ne survit pas à la page */ }
                libelle();
            };

            toggle.addEventListener('click', function () {
                basculer();
                // Les couleurs se fondent d'elles-mêmes (transition CSS) ;
                // l'onde ne fait qu'indiquer d'où vient le changement.
                if (motionOk) onde(toggle);
            });
        }

        // Suivre le réglage du système tant que l'utilisateur n'a rien choisi
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
            var choix;
            try { choix = localStorage.getItem('theme'); } catch (err) { choix = null; }
            if (choix) return;
            if (e.matches) {
                root.setAttribute('data-theme', 'dark');
            } else {
                root.removeAttribute('data-theme');
            }
            libelle();
        });
    })();

    /* ── Choix de langue ──
       Cliquer dans le sélecteur vaut décision : la détection automatique du
       <head> ne doit plus jamais s'y substituer, sur cette visite comme sur
       les suivantes. */
    (function initLangue() {
        var selecteur = document.querySelector('.lang-switch');
        if (!selecteur) return;

        selecteur.addEventListener('click', function (e) {
            var lien = e.target.closest('a[lang]');
            if (!lien) return;

            var code = lien.getAttribute('lang');

            try {
                localStorage.setItem('lang', code);
                sessionStorage.setItem('lang-auto', '1');
            } catch (err) { /* stockage indisponible : le choix ne survit pas à la page */ }

            // Ouverture dans un autre onglet, langue déjà affichée, mouvement
            // refusé : on laisse le navigateur faire, sans mise en scène.
            if (!motionOk || e.defaultPrevented || e.button !== 0 ||
                e.metaKey || e.ctrlKey || e.shiftKey || e.altKey ||
                lien.target === '_blank' || lien.pathname === location.pathname) return;

            e.preventDefault();

            glisserPastille(selecteur, lien);
            document.documentElement.classList.add('is-leaving');

            // Le temps que le contenu sorte et que la pastille arrive
            setTimeout(function () { location.href = lien.href; }, 400);
        });
    })();

    /* ── Curseur personnalisé ──
       Un point qui suit le pointeur au pixel près et un anneau qui le rattrape
       avec un léger retard. Activé uniquement sur pointeur fin : sur un écran
       tactile il n'y a pas de pointeur à remplacer.
       Les éléments sont créés en JS pour ne pas avoir à les répéter dans
       chacune des pages. */
    (function initCursor() {
        if (!window.matchMedia('(pointer: fine)').matches) return;
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        var root = document.documentElement;
        var wrap = document.createElement('div');
        wrap.className = 'cursor';
        wrap.setAttribute('aria-hidden', 'true');
        wrap.innerHTML = '<span class="cursor-dot"></span><span class="cursor-ring"></span>';
        document.body.appendChild(wrap);

        var dot = wrap.querySelector('.cursor-dot');
        var ring = wrap.querySelector('.cursor-ring');

        root.classList.add('has-custom-cursor');

        var x = window.innerWidth / 2, y = window.innerHeight / 2;
        var rx = x, ry = y;
        var visible = false;
        var running = false;

        // L'anneau seul est animé. Le point, lui, est positionné directement
        // dans le gestionnaire d'évènement : requestAnimationFrame est gelé
        // quand l'onglet passe en arrière-plan, et le curseur resterait figé.
        var render = function () {
            rx += (x - rx) * 0.18;
            ry += (y - ry) * 0.18;
            ring.style.transform = 'translate3d(' + rx + 'px,' + ry + 'px,0)';

            // On s'arrête dès que l'anneau a rattrapé le point
            if (Math.abs(x - rx) < 0.1 && Math.abs(y - ry) < 0.1) {
                rx = x;
                ry = y;
                ring.style.transform = 'translate3d(' + rx + 'px,' + ry + 'px,0)';
                running = false;
                return;
            }
            requestAnimationFrame(render);
        };

        var kick = function () {
            if (!running) {
                running = true;
                requestAnimationFrame(render);
            }
        };

        document.addEventListener('pointermove', function (e) {
            if (e.pointerType !== 'mouse') return;
            x = e.clientX;
            y = e.clientY;
            dot.style.transform = 'translate3d(' + x + 'px,' + y + 'px,0)';

            if (!visible) {
                visible = true;
                wrap.classList.add('is-visible');
            }
            kick();
        }, { passive: true });

        // Masquer quand le pointeur quitte la fenêtre, sinon il reste figé au bord
        document.addEventListener('mouseleave', function () {
            visible = false;
            wrap.classList.remove('is-visible');
        });

        document.addEventListener('mouseenter', function () {
            visible = true;
            wrap.classList.add('is-visible');
        });

        // État accentué au survol de tout ce qui est cliquable
        var interactive = 'a, button, [role="button"], .chip, summary';

        document.addEventListener('pointerover', function (e) {
            if (e.target.closest && e.target.closest(interactive)) {
                wrap.classList.add('is-active');
            }
        }, { passive: true });

        document.addEventListener('pointerout', function (e) {
            if (e.target.closest && e.target.closest(interactive)) {
                wrap.classList.remove('is-active');
            }
        }, { passive: true });

        document.addEventListener('pointerdown', function () { wrap.classList.add('is-down'); }, { passive: true });
        document.addEventListener('pointerup', function () { wrap.classList.remove('is-down'); }, { passive: true });
    })();
})();
