/**
 * ========================================
 * PAGE CONTACT - Script
 * ========================================
 * Gestion du formulaire de contact
 */

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contactForm');
    const formSuccess = document.getElementById('formSuccess');
    const header = document.querySelector('.header');

    /**
     * Effet blur au scroll sur le header
     */
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });

    /**
     * Gestion de la soumission du formulaire
     */
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Récupération des données du formulaire
        const formData = new FormData(form);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            subject: formData.get('subject'),
            message: formData.get('message')
        };

        // Animation du bouton de soumission
        const submitBtn = form.querySelector('.submit-btn');
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;

        try {
            // Simulation d'envoi (à remplacer par votre API)
            await simulateFormSubmission(data);

            // Afficher le message de succès
            form.style.opacity = '0';
            form.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                form.style.display = 'none';
                formSuccess.style.display = 'block';
                setTimeout(() => {
                    formSuccess.style.opacity = '1';
                    formSuccess.style.transform = 'translateY(0)';
                }, 50);
            }, 400);

            // Réinitialiser le formulaire après 5 secondes
            setTimeout(() => {
                formSuccess.style.opacity = '0';
                formSuccess.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    formSuccess.style.display = 'none';
                    form.style.display = 'block';
                    form.reset();
                    
                    setTimeout(() => {
                        form.style.opacity = '1';
                        form.style.transform = 'translateY(0)';
                        submitBtn.classList.remove('loading');
                        submitBtn.disabled = false;
                    }, 50);
                }, 400);
            }, 5000);

        } catch (error) {
            console.error('Erreur lors de l\'envoi:', error);
            alert('Une erreur est survenue. Veuillez réessayer.');
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
        }
    });

    /**
     * Simulation d'envoi de formulaire
     * À remplacer par votre propre logique d'envoi
     */
    function simulateFormSubmission(data) {
        return new Promise((resolve) => {
            console.log('Données du formulaire:', data);
            setTimeout(resolve, 1500);
        });
    }

    /**
     * Validation en temps réel des champs
     */
    const inputs = form.querySelectorAll('input, textarea, select');
    
    inputs.forEach(input => {
        input.addEventListener('blur', () => {
            validateField(input);
        });

        input.addEventListener('input', () => {
            if (input.classList.contains('error')) {
                validateField(input);
            }
        });
    });

    function validateField(field) {
        if (field.hasAttribute('required') && !field.value.trim()) {
            field.classList.add('error');
            return false;
        }

        if (field.type === 'email' && field.value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(field.value)) {
                field.classList.add('error');
                return false;
            }
        }

        field.classList.remove('error');
        return true;
    }

    /**
     * Animation d'entrée de la page
     */
    document.body.classList.add('page-loaded');

    console.log('✨ Page de contact initialisée');
});
