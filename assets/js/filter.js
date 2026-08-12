/**
 * Filtrage par catégorie — page projets.
 *
 * L'ancien système croisait une année et douze compétences pour cinq projets :
 * beaucoup de bruit visuel pour un filtrage que personne n'utilisait. Ici, une
 * seule rangée de catégories et un compteur.
 */
(function () {
    'use strict';

    var chips = document.querySelectorAll('.filter-chips .chip');
    var counter = document.querySelector('.filter-count [data-count]');
    var cards = document.querySelectorAll('[data-category]');

    if (!chips.length || !cards.length) return;

    var apply = function (filter) {
        var visible = 0;

        cards.forEach(function (card) {
            var match = filter === 'all' || card.getAttribute('data-category') === filter;
            card.hidden = !match;
            if (match) visible++;
        });

        chips.forEach(function (chip) {
            var active = chip.getAttribute('data-filter') === filter;
            chip.classList.toggle('is-active', active);
            chip.setAttribute('aria-pressed', String(active));
        });

        if (counter) counter.textContent = String(visible);
    };

    chips.forEach(function (chip) {
        chip.addEventListener('click', function () {
            apply(chip.getAttribute('data-filter'));
        });
    });

    apply('all');
})();
