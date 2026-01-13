/**
 * ========================================
 * PAGE D'ACCUEIL - Script
 * ========================================
 * Gestion des interactions et animations
 */

document.addEventListener('DOMContentLoaded', () => {

    /**
     * ========================================
     * CARROUSEL DE PROJETS - Boucle infinie fluide
     * ========================================
     */
    const track = document.querySelector('.carousel-track');
    const prevBtn = document.querySelector('.carousel-prev');
    const nextBtn = document.querySelector('.carousel-next');
    const indicators = document.querySelectorAll('.indicator');
    const originalCards = document.querySelectorAll('.project-card');
    
    let currentIndex = 0;
    const totalCards = originalCards.length;
    let isTransitioning = false;

    // Cloner les cartes pour l'effet de boucle infinie
    const firstClone = originalCards[0].cloneNode(true);
    const lastClone = originalCards[totalCards - 1].cloneNode(true);
    
    track.appendChild(firstClone);
    track.insertBefore(lastClone, originalCards[0]);

    // Positionner sur le premier vrai élément (après le clone)
    currentIndex = 1;
    track.style.transform = `translateX(-${currentIndex * 100}%)`;

    // Fonction pour mettre à jour le carrousel
    const updateCarousel = (direction) => {
        if (isTransitioning) return;
        isTransitioning = true;

        if (direction === 'next') {
            currentIndex++;
        } else if (direction === 'prev') {
            currentIndex--;
        }

        track.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
        track.style.transform = `translateX(-${currentIndex * 100}%)`;

        // Mettre à jour les indicateurs
        const realIndex = ((currentIndex - 1) % totalCards + totalCards) % totalCards;
        indicators.forEach((indicator, i) => {
            indicator.classList.toggle('active', i === realIndex);
        });
    };

    // Gérer la fin de la transition pour la boucle
    track.addEventListener('transitionend', () => {
        if (currentIndex === 0) {
            // On est sur le clone de la dernière carte, revenir à la vraie dernière
            track.style.transition = 'none';
            currentIndex = totalCards;
            track.style.transform = `translateX(-${currentIndex * 100}%)`;
        } else if (currentIndex === totalCards + 1) {
            // On est sur le clone de la première carte, revenir à la vraie première
            track.style.transition = 'none';
            currentIndex = 1;
            track.style.transform = `translateX(-${currentIndex * 100}%)`;
        }
        
        isTransitioning = false;
    });

    // Navigation avec les boutons
    prevBtn.addEventListener('click', () => {
        updateCarousel('prev');
    });

    nextBtn.addEventListener('click', () => {
        updateCarousel('next');
    });

    // Navigation avec les indicateurs
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            if (isTransitioning) return;
            isTransitioning = true;
            currentIndex = index + 1; // +1 car on a le clone au début
            track.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
            track.style.transform = `translateX(-${currentIndex * 100}%)`;
            
            indicators.forEach((ind, i) => {
                ind.classList.toggle('active', i === index);
            });
        });
    });

    // Navigation au clavier
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            updateCarousel('prev');
        } else if (e.key === 'ArrowRight') {
            updateCarousel('next');
        }
    });

    // Swipe sur mobile
    let touchStartX = 0;
    let touchEndX = 0;

    track.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });

    track.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });

    const handleSwipe = () => {
        if (touchEndX < touchStartX - 50) {
            updateCarousel('next'); // Swipe left
        }
        if (touchEndX > touchStartX + 50) {
            updateCarousel('prev'); // Swipe right
        }
    };

    /**
     * ========================================
     * AUTRES ANIMATIONS
     * ========================================
     */

    /**
     * Animation des éléments au scroll (Intersection Observer)
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

    /**
     * Effet parallaxe léger sur le hero
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
     * Animation d'entrée de la page
     */
    document.body.classList.add('page-loaded');

    console.log('✨ Page d\'accueil initialisée avec carrousel');
});
