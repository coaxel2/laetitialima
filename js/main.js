/**
 * ========================================
 * PORTFOLIO - Script Principal
 * ========================================
 * Gestion des interactions et animations
 */

document.addEventListener('DOMContentLoaded', () => {
    // Éléments DOM
    const landing = document.getElementById('landing');
    const home = document.getElementById('home');
    const enterBtn = document.getElementById('enterBtn');

    /**
     * Transition de la landing vers la page d'accueil
     * Animation fluide avec délai pour l'effet visuel
     */
    const enterSite = () => {
        // Ajout de la classe pour masquer la landing
        landing.classList.add('hidden');
        
        // Affichage de la page d'accueil après un court délai
        setTimeout(() => {
            home.classList.add('visible');
            // Permettre le scroll une fois la transition terminée
            document.body.style.overflow = 'auto';
        }, 400);

        // Suppression complète de la landing après l'animation
        setTimeout(() => {
            landing.style.display = 'none';
        }, 1000);
    };

    // Écouteur d'événement sur le bouton
    enterBtn.addEventListener('click', enterSite);

    // Permettre l'entrée avec la touche Entrée
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !landing.classList.contains('hidden')) {
            enterSite();
        }
    });

    /**
     * Animation des éléments au scroll (Intersection Observer)
     * Pour animer les éléments quand ils entrent dans le viewport
     */
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observer les cartes de projet
    document.querySelectorAll('.project-card').forEach(card => {
        observer.observe(card);
    });

    /**
     * Effet parallaxe léger sur le hero (optionnel)
     * Ajoute de la profondeur à l'expérience
     */
    let ticking = false;
    
    const updateParallax = () => {
        const scrolled = window.pageYOffset;
        const heroContent = document.querySelector('.hero-content');
        
        if (heroContent && scrolled < window.innerHeight) {
            heroContent.style.transform = `translateY(${scrolled * 0.3}px)`;
            heroContent.style.opacity = 1 - (scrolled / window.innerHeight) * 0.5;
        }
        
        ticking = false;
    };

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    });

    /**
     * Navigation fluide pour les liens internes
     */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    /**
     * Empêcher le scroll sur la landing page
     */
    document.body.style.overflow = 'hidden';

    /**
     * Effet de hover avancé sur les cartes projet
     * Suit le curseur pour un effet de lumière
     */
    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });

    console.log('✨ Portfolio initialisé avec succès');
});
