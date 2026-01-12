// ========================================
// GESTION DU FORMULAIRE DE CONTACT
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Récupération des données du formulaire
            const formData = new FormData(contactForm);
            const data = {
                name: formData.get('name'),
                email: formData.get('email'),
                phone: formData.get('phone'),
                subject: formData.get('subject'),
                budget: formData.get('budget'),
                message: formData.get('message')
            };

            // Afficher un message de chargement
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalText = submitButton.innerHTML;
            submitButton.innerHTML = 'Envoi en cours...';
            submitButton.disabled = true;

            // Simuler l'envoi (à remplacer par un vrai appel API)
            setTimeout(() => {
                // Afficher un message de succès
                showNotification('Message envoyé avec succès ! Je vous répondrai dans les plus brefs délais.', 'success');
                
                // Réinitialiser le formulaire
                contactForm.reset();
                
                // Restaurer le bouton
                submitButton.innerHTML = originalText;
                submitButton.disabled = false;
            }, 1500);

            // Dans un vrai projet, vous feriez quelque chose comme:
            // try {
            //     const response = await fetch('/api/contact', {
            //         method: 'POST',
            //         headers: { 'Content-Type': 'application/json' },
            //         body: JSON.stringify(data)
            //     });
            //     if (response.ok) {
            //         showNotification('Message envoyé avec succès !', 'success');
            //         contactForm.reset();
            //     } else {
            //         throw new Error('Erreur lors de l\'envoi');
            //     }
            // } catch (error) {
            //     showNotification('Erreur lors de l\'envoi. Veuillez réessayer.', 'error');
            // } finally {
            //     submitButton.innerHTML = originalText;
            //     submitButton.disabled = false;
            // }
        });
    }

    // Fonction pour afficher les notifications
    function showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${type === 'success' ? '#10b981' : '#ef4444'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 0.5rem;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
            z-index: 10000;
            animation: slideIn 0.3s ease;
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 4000);
    }

    // Ajouter les animations CSS
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideIn {
                from {
                    transform: translateX(400px);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            @keyframes slideOut {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(400px);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // FAQ Accordéon
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const faqItem = question.parentElement;
            const isActive = faqItem.classList.contains('active');

            // Fermer tous les autres items
            document.querySelectorAll('.faq-item').forEach(item => {
                item.classList.remove('active');
            });

            // Ouvrir ou fermer l'item cliqué
            if (!isActive) {
                faqItem.classList.add('active');
            }
        });
    });
});
