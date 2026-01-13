/**
 * ========================================
 * PAGE PROJET - Script
 * ========================================
 * Gestion du header avec effet blur
 */

document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('.header');
    let lastScroll = 0;
    
    /**
     * Effet blur au scroll sur le header
     */
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });

    console.log('✨ Page projet initialisée');
});
