/**
 * ========================================
 * PAGE D'ACCUEIL - Script
 * ========================================
 * Gestion des interactions et animations
 */

document.addEventListener('DOMContentLoaded', () => {

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
     * Effet parallaxe léger sur le hero
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

    /**
     * Animation d'entrée de la page
     */
    document.body.classList.add('page-loaded');

    console.log('✨ Page d\'accueil initialisée');
});
