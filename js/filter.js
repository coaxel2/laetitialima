/* ========================================
   SYSTÈME DE FILTRAGE - Projets & Expériences
======================================== */

document.addEventListener('DOMContentLoaded', function() {
    // Initialisation des filtres
    initFilters();
});

function initFilters() {
    const filterContainer = document.querySelector('.filters-container');
    if (!filterContainer) return;

    const yearFilter = document.getElementById('year-filter');
    const skillFilters = document.querySelectorAll('.skill-filter');
    const skillsSelectMobile = document.getElementById('skills-filter');
    const resetBtn = document.querySelector('.reset-filters');
    
    // Détecter si on est sur la page projets ou expériences
    const isProjectsPage = document.querySelector('.projects-grid');
    const isExperiencesPage = document.querySelector('.experiences-grid');
    
    const items = isProjectsPage 
        ? document.querySelectorAll('.project-card-large')
        : document.querySelectorAll('.experience-card-large');

    // État des filtres actifs
    let activeFilters = {
        year: 'all',
        skills: []
    };

    // Filtre par année
    if (yearFilter) {
        yearFilter.addEventListener('change', function() {
            activeFilters.year = this.value;
            applyFilters(items, activeFilters);
            updateActiveState();
        });
    }

    // Filtres par compétences (boutons)
    skillFilters.forEach(filter => {
        filter.addEventListener('click', function() {
            const skill = this.dataset.skill;
            
            if (this.classList.contains('active')) {
                // Retirer le filtre
                this.classList.remove('active');
                activeFilters.skills = activeFilters.skills.filter(s => s !== skill);
            } else {
                // Ajouter le filtre
                this.classList.add('active');
                activeFilters.skills.push(skill);
            }
            
            applyFilters(items, activeFilters);
            updateActiveState();
        });
    });

    // Filtre par compétences (select mobile)
    if (skillsSelectMobile) {
        skillsSelectMobile.addEventListener('change', function() {
            const selectedSkill = this.value;
            
            if (selectedSkill === 'all') {
                // Réinitialiser les compétences
                activeFilters.skills = [];
                skillFilters.forEach(filter => filter.classList.remove('active'));
            if (skillsSelectMobile) skillsSelectMobile.value = 'all';
            } else {
                // Ajouter la compétence si elle n'est pas déjà présente
                if (!activeFilters.skills.includes(selectedSkill)) {
                    activeFilters.skills = [selectedSkill];
                    skillFilters.forEach(filter => {
                        if (filter.dataset.skill === selectedSkill) {
                            filter.classList.add('active');
                        } else {
                            filter.classList.remove('active');
                        }
                    });
                }
            }
            
            applyFilters(items, activeFilters);
            updateActiveState();
        });
    }

    // Reset des filtres
    if (resetBtn) {
        resetBtn.addEventListener('click', function() {
            // Reset année
            if (yearFilter) yearFilter.value = 'all';
            activeFilters.year = 'all';
            
            // Reset compétences
            skillFilters.forEach(filter => filter.classList.remove('active'));
            activeFilters.skills = [];
            
            // Afficher tous les éléments
            items.forEach(item => {
                item.style.display = '';
                item.classList.remove('hidden');
                setTimeout(() => item.classList.add('visible'), 10);
            });
            
            updateActiveState();
        });
    }

    // Fonction pour mettre à jour l'état visuel
    function updateActiveState() {
        const hasActiveFilters = activeFilters.year !== 'all' || activeFilters.skills.length > 0;
        if (resetBtn) {
            resetBtn.style.opacity = hasActiveFilters ? '1' : '0.5';
            resetBtn.style.pointerEvents = hasActiveFilters ? 'auto' : 'none';
        }
        
        // Mettre à jour le compteur de résultats
        const visibleItems = document.querySelectorAll('.project-card-large:not(.hidden), .experience-card-large:not(.hidden)');
        const resultsCount = document.querySelector('.results-count');
        if (resultsCount) {
            const total = items.length;
            const visible = visibleItems.length;
            resultsCount.textContent = visible === total 
                ? `${total} résultat${total > 1 ? 's' : ''}`
                : `${visible} sur ${total} résultat${total > 1 ? 's' : ''}`;
        }
    }

    // Initialiser l'état
    updateActiveState();
}

function applyFilters(items, filters) {
    items.forEach(item => {
        const itemYear = item.dataset.year;
        const itemSkills = item.dataset.skills ? item.dataset.skills.split(',').map(s => s.trim().toLowerCase()) : [];
        
        let showByYear = filters.year === 'all' || itemYear === filters.year;
        let showBySkills = filters.skills.length === 0 || 
            filters.skills.some(skill => itemSkills.includes(skill.toLowerCase()));
        
        if (showByYear && showBySkills) {
            item.classList.remove('hidden');
            item.style.display = '';
            setTimeout(() => item.classList.add('visible'), 10);
        } else {
            item.classList.add('hidden');
            item.classList.remove('visible');
            setTimeout(() => {
                if (item.classList.contains('hidden')) {
                    item.style.display = 'none';
                }
            }, 300);
        }
    });
}
