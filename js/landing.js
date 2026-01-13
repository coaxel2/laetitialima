/**
 * ========================================
 * LANDING PAGE - Script dédié
 * ========================================
 * Animations et interactions de la landing
 */

document.addEventListener('DOMContentLoaded', () => {
    const enterBtn = document.getElementById('enterBtn');
    const customCursor = document.getElementById('customCursor');

    /**
     * Curseur personnalisé qui suit la souris
     */
    document.addEventListener('mousemove', (e) => {
        customCursor.style.left = e.clientX + 'px';
        customCursor.style.top = e.clientY + 'px';
    });

    /**
     * Effet de grossissement de la clé au hover du bouton
     */
    enterBtn.addEventListener('mouseenter', () => {
        customCursor.style.transform = 'translate(-50%, -50%) scale(1.3)';
    });

    enterBtn.addEventListener('mouseleave', () => {
        customCursor.style.transform = 'translate(-50%, -50%) scale(1)';
    });

    /**
     * Animation au clic sur le bouton
     */
    enterBtn.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Animation de sortie et redirection
        document.body.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        document.body.style.opacity = '0';
        document.body.style.transform = 'scale(1.02)';
        
        setTimeout(() => {
            window.location.href = 'home.html';
        }, 500);
    });

    /**
     * Permettre l'entrée avec la touche Entrée
     */
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            enterBtn.click();
        }
    });

    /**
     * Effet de suivi du curseur sur le fond (optionnel)
     * Ajoute une interaction subtile
     */
    document.addEventListener('mousemove', (e) => {
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;
        
        document.querySelector('.landing').style.backgroundPosition = 
            `${x * 100}% ${y * 100}%`;
    });

    console.log('✨ Landing page initialisée');
});
