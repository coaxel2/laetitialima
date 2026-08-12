/* ====================================
   LOGIQUE ADMIN — admin.js
   Génère les pages + injecte les cartes
==================================== */

// Outil local, non publié (dossier _tools ignoré par Jekyll).
// L'authentification par mot de passe en clair a été retirée : sur un site
// statique elle était lisible dans le source et ne protégeait rien.

// --- Sélection type de page ---
var typeBtns = document.querySelectorAll('.type-btn');
var formExp = document.getElementById('form-experience');
var formProj = document.getElementById('form-projet');

typeBtns.forEach(function(btn) {
    btn.addEventListener('click', function() {
        typeBtns.forEach(function(b) { b.classList.remove('active'); });
        this.classList.add('active');
        if (this.dataset.type === 'experience') {
            formExp.style.display = 'block';
            formProj.style.display = 'none';
        } else {
            formExp.style.display = 'none';
            formProj.style.display = 'block';
        }
        document.getElementById('result-zone').style.display = 'none';
    });
});

// --- Ajout dynamique ---
var expRealCount = 1;
document.getElementById('btn-add-exp-realisation').addEventListener('click', function() {
    expRealCount++;
    var container = document.getElementById('exp-realisations-container');
    var block = document.createElement('div');
    block.className = 'realisation-block';
    block.innerHTML =
        '<div class="form-group"><label>Titre de la r\u00e9alisation ' + expRealCount + '</label>' +
        '<input type="text" class="exp-real-titre" placeholder="Titre"></div>' +
        '<div class="form-group"><label>Description ' + expRealCount + '</label>' +
        '<textarea class="exp-real-desc" rows="3" placeholder="Description..."></textarea></div>' +
        '<button type="button" class="btn-remove" onclick="this.parentElement.remove()">\u2715 Supprimer</button>';
    container.appendChild(block);
});

var projRealCount = 1;
document.getElementById('btn-add-proj-realisation').addEventListener('click', function() {
    projRealCount++;
    var container = document.getElementById('proj-realisations-container');
    var block = document.createElement('div');
    block.className = 'realisation-block';
    block.innerHTML =
        '<div class="form-group"><label>Titre de la r\u00e9alisation ' + projRealCount + '</label>' +
        '<input type="text" class="proj-real-titre" placeholder="Titre"></div>' +
        '<div class="form-group"><label>Description ' + projRealCount + '</label>' +
        '<textarea class="proj-real-desc" rows="3" placeholder="Description..."></textarea></div>' +
        '<button type="button" class="btn-remove" onclick="this.parentElement.remove()">\u2715 Supprimer</button>';
    container.appendChild(block);
});

var projGalCount = 1;
document.getElementById('btn-add-proj-galerie').addEventListener('click', function() {
    projGalCount++;
    var container = document.getElementById('proj-galerie-container');
    var block = document.createElement('div');
    block.className = 'galerie-block';
    block.innerHTML =
        '<div class="form-grid"><div class="form-group"><label>Chemin image ' + projGalCount + '</label>' +
        '<input type="text" class="proj-galerie-src" placeholder="Chemin"></div>' +
        '<div class="form-group"><label>Alt ' + projGalCount + '</label>' +
        '<input type="text" class="proj-galerie-alt" placeholder="Texte alternatif"></div></div>' +
        '<button type="button" class="btn-remove" onclick="this.parentElement.remove()">\u2715 Supprimer</button>';
    container.appendChild(block);
});

// --- Utilitaires ---
function esc(text) {
    var div = document.createElement('div');
    div.textContent = text || '';
    return div.innerHTML;
}

function downloadFile(content, filename) {
    var blob = new Blob([content], { type: 'text/html;charset=utf-8' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// --- Blocs HTML communs ---
function htmlHead(titre) {
    return '<!DOCTYPE html>\n<html lang="fr">\n<head>\n' +
    '    <meta charset="UTF-8">\n' +
    '    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n' +
    '    <title>' + esc(titre) + ' | LL Portfolio</title>\n' +
    '    <link rel="stylesheet" href="/assets/css/style.css">\n' +
    '    <link rel="stylesheet" href="/assets/css/experience.css">\n' +
    '    <link rel="preconnect" href="https://fonts.googleapis.com">\n' +
    '    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n' +
    '    <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600&family=Inter:wght@300;400;500&display=swap" rel="stylesheet">\n' +
    '</head>\n<body class="project-page">\n';
}

function htmlNav() {
    return '    <header class="header">\n' +
    '        <nav class="nav">\n' +
    '            <a href="/" class="logo">\n' +
    '                <span class="logo-letter logo-dark">L</span>\n' +
    '                <span class="logo-letter logo-light">L</span>\n' +
    '            </a>\n' +
    '            <button class="menu-toggle" aria-label="Menu">\n' +
    '                <span></span><span></span><span></span>\n' +
    '            </button>\n' +
    '                <ul class="nav-links">\n' +
    '                    <li><a href="/experiences/">Exp\u00e9riences</a></li>\n' +
    '                    <li><a href="/projets/">Projets</a></li>\n' +
    '                    <li><a href="/contact/">Contact</a></li>\n' +
    '                </ul>\n' +
    '            <div class="nav-overlay"></div>\n' +
    '        </nav>\n' +
    '    </header>\n\n';
}

function htmlFooter() {
    return '    <footer class="footer" id="contact">\n' +
    '        <div class="footer-content">\n' +
    '            <div class="footer-brand">\n' +
    '                <div class="footer-logo">\n' +
    '                    <span class="logo-letter logo-dark">L</span>\n' +
    '                    <span class="logo-letter logo-light">L</span>\n' +
    '                </div>\n' +
    '                <p>Cr\u00e9ons ensemble quelque chose d\'exceptionnel.</p>\n' +
    '                <div class="footer-contact">\n' +
    '                    <a href="mailto:laetitialmp67@gmail.com">laetitialmp67@gmail.com</a>\n' +
    '                    <a href="https://www.linkedin.com/in/laetitialima">LinkedIn</a>\n' +
    '                </div>\n' +
    '            </div>\n' +
    '            <div class="footer-links">\n' +
    '                <div class="footer-nav">\n' +
    '                    <a href="/experiences/">Exp\u00e9riences</a>\n' +
    '                    <a href="/projets/">Projets</a>\n' +
    '                    <a href="/contact/">Contact</a>\n' +
    '                </div>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '        <div class="footer-bottom">\n' +
    '            <p>&copy; 2026 La\u00ebtitia Lima. Tous droits r\u00e9serv\u00e9s.</p>\n' +
    '        </div>\n' +
    '    </footer>\n\n' +
    '    <script src="/assets/js/main.js"><\/script>\n' +
    '</body>\n</html>';
}

// ===========================================
// GENERATION EXPERIENCE
// ===========================================
document.getElementById('form-experience').addEventListener('submit', function(e) {
    e.preventDefault();

    var titre = document.getElementById('exp-titre').value;
    var slug = document.getElementById('exp-slug').value || titre.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    var logo = document.getElementById('exp-logo').value;
    var altLogo = document.getElementById('exp-alt-logo').value || titre;
    var entreprise = document.getElementById('exp-entreprise').value;
    var secteur = document.getElementById('exp-secteur').value;
    var poste = document.getElementById('exp-poste').value;
    var periode = document.getElementById('exp-periode').value;
    var lieu = document.getElementById('exp-lieu').value;
    var competences = document.getElementById('exp-competences').value.split(',').map(function(c) { return c.trim(); }).filter(function(c) { return c; });
    var descTitre = document.getElementById('exp-description-titre').value;
    var description = document.getElementById('exp-description').value;
    var image = document.getElementById('exp-image').value;
    var altImage = document.getElementById('exp-alt-image').value;
    var missions = document.getElementById('exp-missions').value.split('\n').filter(function(m) { return m.trim(); });
    var apprentissage = document.getElementById('exp-apprentissage').value.split('\n\n').filter(function(p) { return p.trim(); });

    // Champs carte
    var periodeBadge = document.getElementById('exp-periode-badge').value;
    var anneeData = document.getElementById('exp-annee-data').value;
    var role = document.getElementById('exp-role').value;
    var logoCarte = document.getElementById('exp-logo-carte').value;
    var descCourte = document.getElementById('exp-desc-courte').value;
    var skillsData = document.getElementById('exp-skills-data').value;

    // Realisations
    var realTitres = document.querySelectorAll('.exp-real-titre');
    var realDescs = document.querySelectorAll('.exp-real-desc');
    var realisationsHTML = '';
    realTitres.forEach(function(input, i) {
        if (input.value.trim()) {
            realisationsHTML +=
                '                                <div class="achievement-item">\n' +
                '                                    <h3>' + esc(input.value) + '</h3>\n' +
                '                                    <p>' + esc(realDescs[i].value) + '</p>\n' +
                '                                </div>\n';
        }
    });

    var skillsHTML = '';
    competences.forEach(function(c) {
        skillsHTML += '\n                                <span class="skill-tag">' + esc(c) + '</span>';
    });

    var missionsHTML = '';
    missions.forEach(function(m) {
        missionsHTML += '\n                                <li>' + esc(m.trim()) + '</li>';
    });

    var apprentissageHTML = '';
    apprentissage.forEach(function(p, i) {
        if (i === 0) {
            apprentissageHTML += '\n                            <p>' + esc(p.trim()) + '</p>';
        } else {
            apprentissageHTML += '\n                            <p class="text-spacing-top">' + esc(p.trim()) + '</p>';
        }
    });

    // --- Page complete ---
    var pageHTML = htmlHead(titre) + htmlNav() +
    '    <main class="experience-page">\n' +
    '        <section class="hero-experience">\n' +
    '            <div class="container">\n' +
    '                <img src="' + esc(logo) + '" alt="' + esc(altLogo) + '" class="experience-logo">\n' +
    '            </div>\n' +
    '        </section>\n\n' +
    '        <section class="experience-content">\n' +
    '            <div class="container">\n' +
    '                <a href="/experiences/" class="back-link">\n' +
    '                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">\n' +
    '                        <path d="M19 12H5M12 19l-7-7 7-7"/>\n' +
    '                    </svg>\n' +
    '                    Retour aux exp\u00e9riences\n' +
    '                </a>\n' +
    '                <div class="content-grid">\n' +
    '                    <aside class="experience-sidebar">\n' +
    '                        <div class="info-card">\n' +
    '                            <h3>Informations</h3>\n' +
    '                            <ul class="info-list">\n' +
    '                                <li><strong>Entreprise</strong><span>' + esc(entreprise) + '</span></li>\n' +
    '                                <li><strong>Secteur</strong><span>' + esc(secteur) + '</span></li>\n' +
    '                                <li><strong>Poste</strong><span>' + esc(poste) + '</span></li>\n' +
    '                                <li><strong>P\u00e9riode</strong><span>' + esc(periode) + '</span></li>\n' +
    '                                <li><strong>Lieu</strong><span>' + esc(lieu) + '</span></li>\n' +
    '                            </ul>\n' +
    '                        </div>\n' +
    '                        <div class="skills-card">\n' +
    '                            <h3>Comp\u00e9tences d\u00e9velopp\u00e9es</h3>\n' +
    '                            <div class="skill-tags">' + skillsHTML + '\n' +
    '                            </div>\n' +
    '                        </div>\n' +
    '                    </aside>\n\n' +
    '                    <div class="experience-main">\n' +
    '                        <div class="content-section">\n' +
    '                            <h2>' + esc(descTitre) + '</h2>\n' +
    '                            <p>' + esc(description) + '</p>\n' +
    '                        </div>\n\n' +
    '                        <div class="content-section">\n' +
    '                            <img src="' + esc(image) + '" alt="' + esc(altImage) + '" class="project-detail-img">\n' +
    '                        </div>\n\n' +
    '                        <div class="content-section">\n' +
    '                            <h2>Mes missions</h2>\n' +
    '                            <ul class="mission-list">' + missionsHTML + '\n' +
    '                            </ul>\n' +
    '                        </div>\n\n' +
    '                        <div class="content-section">\n' +
    '                            <h2>R\u00e9alisations cl\u00e9s</h2>\n' +
    '                            <div class="achievements">\n' + realisationsHTML +
    '                            </div>\n' +
    '                        </div>\n\n' +
    '                        <div class="content-section">\n' +
    '                            <h2>Ce que j\'ai appris</h2>' + apprentissageHTML + '\n' +
    '                        </div>\n' +
    '                    </div>\n' +
    '                </div>\n' +
    '            </div>\n' +
    '        </section>\n' +
    '    </main>\n\n' + htmlFooter();

    // --- Carte pour la page listing ---
    var tagsHTML = '';
    competences.forEach(function(c) {
        tagsHTML += '                                <span class="tag">' + esc(c) + '</span>\n';
    });

    var cardHTML = '\n                    <!-- ' + esc(titre) + ' -->\n' +
    '                    <article class="experience-card-large" data-year="' + esc(anneeData) + '" data-skills="' + esc(skillsData) + '">\n' +
    '                        <div class="experience-image">\n' +
    '                            <img src="' + esc(logoCarte) + '" alt="' + esc(altLogo) + '" class="experience-logo">\n' +
    '                        </div>\n' +
    '                        <div class="experience-content">\n' +
    '                            <div class="experience-period-badge">' + esc(periodeBadge) + '</div>\n' +
    '                            <h2 class="experience-company">' + esc(titre) + '</h2>\n' +
    '                            <p class="experience-role">' + esc(role) + '</p>\n' +
    '                            <p class="experience-description">\n' +
    '                                ' + esc(descCourte) + '\n' +
    '                            </p>\n' +
    '                            <div class="experience-tags">\n' +
    tagsHTML +
    '                            </div>\n' +
    '                            <a href="/experiences/' + slug + '/" class="experience-link">\n' +
    '                                En savoir plus\n' +
    '                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">\n' +
    '                                    <path d="M5 12h14M12 5l7 7-7 7"/>\n' +
    '                                </svg>\n' +
    '                            </a>\n' +
    '                        </div>\n' +
    '                    </article>\n';

    // --- Charger experiences.html, injecter la carte ---
    fetch('/experiences/')
        .then(function(r) { return r.text(); })
        .then(function(listingHTML) {
            var marker = '<div class="experiences-grid">';
            var idx = listingHTML.indexOf(marker);
            if (idx === -1) {
                alert('Erreur : impossible de trouver la grille dans experiences/index.html');
                return;
            }
            var insertPos = idx + marker.length;
            var updatedListing = listingHTML.substring(0, insertPos) + cardHTML + listingHTML.substring(insertPos);

            // Mettre a jour le compteur
            updatedListing = updatedListing.replace(
                /<span class="results-count">\d+ r\u00e9sultats?<\/span>/,
                function(match) {
                    var oldCount = parseInt(match.match(/\d+/)[0]);
                    return '<span class="results-count">' + (oldCount + 1) + ' r\u00e9sultats</span>';
                }
            );

            showResults(pageHTML, slug + '/index.html', 'experiences/', updatedListing, 'experiences/index.html');
        })
        .catch(function(err) {
            console.error(err);
            alert('Erreur lors du chargement de /experiences/.\nOuvrez admin.html via Live Server (clic droit > Open with Live Server).');
        });
});

// ===========================================
// GENERATION PROJET
// ===========================================
document.getElementById('form-projet').addEventListener('submit', function(e) {
    e.preventDefault();

    var titre = document.getElementById('proj-titre').value;
    var slug = document.getElementById('proj-slug').value || titre.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    var logo = document.getElementById('proj-logo').value;
    var altLogo = document.getElementById('proj-alt-logo').value || titre;
    var client = document.getElementById('proj-client').value;
    var type = document.getElementById('proj-type').value;
    var domaine = document.getElementById('proj-domaine').value;
    var annee = document.getElementById('proj-annee').value;
    var competences = document.getElementById('proj-competences').value.split(',').map(function(c) { return c.trim(); }).filter(function(c) { return c; });
    var descTitre = document.getElementById('proj-description-titre').value;
    var description = document.getElementById('proj-description').value;
    var image = document.getElementById('proj-image').value;
    var altImage = document.getElementById('proj-alt-image').value;
    var conceptTitre = document.getElementById('proj-concept-titre').value;
    var concept = document.getElementById('proj-concept').value;

    // Champs carte
    var categorie = document.getElementById('proj-categorie').value;
    var logoCarte = document.getElementById('proj-logo-carte').value;
    var descCourte = document.getElementById('proj-desc-courte').value;
    var skillsData = document.getElementById('proj-skills-data').value;

    // Galerie
    var galSrcs = document.querySelectorAll('.proj-galerie-src');
    var galAlts = document.querySelectorAll('.proj-galerie-alt');
    var galerieHTML = '';
    galSrcs.forEach(function(input, i) {
        if (input.value.trim()) {
            galerieHTML += '                                <img src="' + esc(input.value) + '" alt="' + esc(galAlts[i].value) + '" class="project-detail-img project-detail-img--full">\n';
        }
    });

    // Realisations
    var realTitres = document.querySelectorAll('.proj-real-titre');
    var realDescs = document.querySelectorAll('.proj-real-desc');
    var realisationsHTML = '';
    realTitres.forEach(function(input, i) {
        if (input.value.trim()) {
            realisationsHTML +=
                '                                <div class="achievement-item">\n' +
                '                                    <h3>' + esc(input.value) + '</h3>\n' +
                '                                    <p>' + esc(realDescs[i].value) + '</p>\n' +
                '                                </div>\n';
        }
    });

    var skillsHTML = '';
    competences.forEach(function(c) {
        skillsHTML += '\n                                <span class="skill-tag">' + esc(c) + '</span>';
    });

    // --- Page complete ---
    var pageHTML = htmlHead(titre) + htmlNav() +
    '    <main class="experience-page">\n' +
    '        <section class="hero-experience">\n' +
    '            <div class="container">\n' +
    '                <img src="' + esc(logo) + '" alt="' + esc(altLogo) + '" class="experience-logo">\n' +
    '            </div>\n' +
    '        </section>\n\n' +
    '        <section class="experience-content">\n' +
    '            <div class="container">\n' +
    '                <a href="/projets/" class="back-link">\n' +
    '                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">\n' +
    '                        <path d="M19 12H5M12 19l-7-7 7-7"/>\n' +
    '                    </svg>\n' +
    '                    Retour aux projets\n' +
    '                </a>\n' +
    '                <div class="content-grid">\n' +
    '                    <aside class="experience-sidebar">\n' +
    '                        <div class="info-card">\n' +
    '                            <h3>Informations</h3>\n' +
    '                            <ul class="info-list">\n' +
    '                                <li><strong>Client</strong><span>' + esc(client) + '</span></li>\n' +
    '                                <li><strong>Type</strong><span>' + esc(type) + '</span></li>\n' +
    '                                <li><strong>Domaine</strong><span>' + esc(domaine) + '</span></li>\n' +
    '                                <li><strong>Ann\u00e9e</strong><span>' + esc(annee) + '</span></li>\n' +
    '                            </ul>\n' +
    '                        </div>\n' +
    '                        <div class="skills-card">\n' +
    '                            <h3>Comp\u00e9tences utilis\u00e9es</h3>\n' +
    '                            <div class="skill-tags">' + skillsHTML + '\n' +
    '                            </div>\n' +
    '                        </div>\n' +
    '                    </aside>\n\n' +
    '                    <div class="experience-main">\n' +
    '                        <div class="content-section">\n' +
    '                            <h2>' + esc(descTitre) + '</h2>\n' +
    '                            <p>' + esc(description) + '</p>\n' +
    '                        </div>\n\n' +
    '                        <div class="content-section">\n' +
    '                            <img src="' + esc(image) + '" alt="' + esc(altImage) + '" class="project-detail-img project-detail-img--full">\n' +
    '                        </div>\n\n' +
    '                        <div class="content-section">\n' +
    '                            <h2>' + esc(conceptTitre) + '</h2>\n' +
    '                            <p>' + esc(concept) + '</p>\n' +
    '                        </div>\n\n' +
    '                        <div class="content-section">\n' +
    '                            <h2>Visuels du projet</h2>\n' +
    '                            <div class="project-gallery">\n' + galerieHTML +
    '                            </div>\n' +
    '                        </div>\n\n' +
    '                        <div class="content-section">\n' +
    '                            <h2>R\u00e9alisations</h2>\n' +
    '                            <div class="achievements">\n' + realisationsHTML +
    '                            </div>\n' +
    '                        </div>\n' +
    '                    </div>\n' +
    '                </div>\n' +
    '            </div>\n' +
    '        </section>\n' +
    '    </main>\n\n' + htmlFooter();

    // --- Carte pour la page listing ---
    var tagsHTML = '';
    competences.forEach(function(c) {
        tagsHTML += '                                <span class="tag">' + esc(c) + '</span>\n';
    });

    var cardHTML = '\n                    <!-- ' + esc(titre) + ' -->\n' +
    '                    <article class="project-card-large" data-year="' + esc(annee) + '" data-skills="' + esc(skillsData) + '">\n' +
    '                        <div class="project-image">\n' +
    '                            <img src="' + esc(logoCarte) + '" alt="' + esc(altLogo) + '" class="project-logo">\n' +
    '                        </div>\n' +
    '                        <div class="project-info">\n' +
    '                            <h2 class="project-title">' + esc(titre) + '</h2>\n' +
    '                            <p class="project-category">' + esc(categorie) + '</p>\n' +
    '                            <p class="project-description">\n' +
    '                               ' + esc(descCourte) + '\n' +
    '                            </p>\n' +
    '                            <div class="project-tags">\n' +
    tagsHTML +
    '                            </div>\n' +
    '                            <a href="/projets/' + slug + '/" class="project-link">\n' +
    '                                Voir le projet\n' +
    '                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">\n' +
    '                                    <path d="M5 12h14M12 5l7 7-7 7"/>\n' +
    '                                </svg>\n' +
    '                            </a>\n' +
    '                        </div>\n' +
    '                    </article>\n';

    // --- Charger projets.html, injecter la carte ---
    fetch('/projets/')
        .then(function(r) { return r.text(); })
        .then(function(listingHTML) {
            var marker = '<div class="projects-grid">';
            var idx = listingHTML.indexOf(marker);
            if (idx === -1) {
                alert('Erreur : impossible de trouver la grille dans projets/index.html');
                return;
            }
            var insertPos = idx + marker.length;
            var updatedListing = listingHTML.substring(0, insertPos) + cardHTML + listingHTML.substring(insertPos);

            // Mettre a jour le compteur
            updatedListing = updatedListing.replace(
                /<span class="results-count">\d+ r\u00e9sultats?<\/span>/,
                function(match) {
                    var oldCount = parseInt(match.match(/\d+/)[0]);
                    return '<span class="results-count">' + (oldCount + 1) + ' r\u00e9sultats</span>';
                }
            );

            showResults(pageHTML, slug + '/index.html', 'projets/', updatedListing, 'projets/index.html');
        })
        .catch(function(err) {
            console.error(err);
            alert('Erreur lors du chargement de /projets/.\nOuvrez admin.html via Live Server (clic droit > Open with Live Server).');
        });
});

// ===========================================
// AFFICHER RESULTATS + TELECHARGEMENTS
// ===========================================
var currentPageHTML = '';
var currentPageFilename = '';
var currentListingHTML = '';
var currentListingFilename = '';

function showResults(pageHTML, pageFilename, folder, listingHTML, listingFilename) {
    currentPageHTML = pageHTML;
    currentPageFilename = pageFilename;
    currentListingHTML = listingHTML;
    currentListingFilename = listingFilename;

    document.getElementById('result-filename').textContent = folder + pageFilename;
    document.getElementById('result-listing-filename').textContent = listingFilename;
    document.getElementById('instr-page').textContent = pageFilename;
    document.getElementById('instr-folder').textContent = folder;
    document.getElementById('instr-listing').textContent = listingFilename;
    document.getElementById('result-code').textContent = pageHTML;
    document.getElementById('result-listing-code').textContent = listingHTML;

    var zone = document.getElementById('result-zone');
    zone.style.display = 'block';
    zone.scrollIntoView({ behavior: 'smooth' });
}

document.getElementById('btn-download-page').addEventListener('click', function() {
    downloadFile(currentPageHTML, currentPageFilename);
});

document.getElementById('btn-download-listing').addEventListener('click', function() {
    downloadFile(currentListingHTML, currentListingFilename);
});
