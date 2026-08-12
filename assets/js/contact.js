/**
 * Formulaire de contact.
 *
 * Envoi via le service configuré dans l'attribut `action` du formulaire.
 * Tant qu'aucun identifiant n'est renseigné, on bascule sur le client mail du
 * visiteur : le formulaire reste utilisable dès la mise en ligne, sans compte
 * ni clé d'API. Voir CONTACT.md pour brancher un service.
 */
(function () {
    'use strict';

    var form = document.getElementById('contactForm');
    if (!form) return;

    var status = document.getElementById('formStatus');
    var submitBtn = document.getElementById('submitBtn');
    var endpoint = form.getAttribute('action') || '';
    var isConfigured = endpoint.indexOf('REMPLACER_PAR') === -1 && /^https?:/.test(endpoint);

    var fields = [
        { el: form.elements.name, error: 'name-error', test: function (v) { return v.trim().length > 1; } },
        { el: form.elements.email, error: 'email-error', test: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()); } },
        { el: form.elements.message, error: 'message-error', test: function (v) { return v.trim().length > 9; } }
    ];

    var setError = function (field, invalid) {
        var box = document.getElementById(field.error);
        if (box) box.hidden = !invalid;
        field.el.setAttribute('aria-invalid', String(invalid));
        field.el.classList.toggle('is-invalid', invalid);
    };

    // Le message d'erreur disparaît dès que la saisie redevient valide
    fields.forEach(function (field) {
        if (!field.el) return;
        field.el.addEventListener('input', function () {
            if (field.el.classList.contains('is-invalid') && field.test(field.el.value)) {
                setError(field, false);
            }
        });
    });

    var setStatus = function (message, kind) {
        if (!status) return;
        status.textContent = message;
        status.className = 'form-status' + (kind ? ' is-' + kind : '');
    };

    var mailtoFallback = function (data) {
        var to = form.getAttribute('data-fallback-email');
        var body = 'Nom : ' + data.name + '\nE-mail : ' + data.email + '\n\n' + data.message;
        window.location.href = 'mailto:' + to +
            '?subject=' + encodeURIComponent('[Portfolio] ' + data.subject) +
            '&body=' + encodeURIComponent(body);
        setStatus('Votre messagerie va s’ouvrir avec le message pré-rempli.', 'info');
    };

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        // Champ piège rempli : requête automatisée, on ignore silencieusement
        if (form.elements.company && form.elements.company.value) return;

        var firstInvalid = null;
        fields.forEach(function (field) {
            if (!field.el) return;
            var invalid = !field.test(field.el.value);
            setError(field, invalid);
            if (invalid && !firstInvalid) firstInvalid = field.el;
        });

        if (firstInvalid) {
            firstInvalid.focus();
            setStatus('Merci de corriger les champs signalés.', 'error');
            return;
        }

        var data = {
            name: form.elements.name.value.trim(),
            email: form.elements.email.value.trim(),
            subject: form.elements.subject ? form.elements.subject.value : 'Contact',
            message: form.elements.message.value.trim()
        };

        if (!isConfigured) {
            mailtoFallback(data);
            return;
        }

        submitBtn.disabled = true;
        setStatus('Envoi en cours…', 'info');

        fetch(endpoint, {
            method: 'POST',
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })
            .then(function (res) {
                if (!res.ok) throw new Error('HTTP ' + res.status);
                form.reset();
                setStatus('Message envoyé. Je vous réponds sous 48 heures.', 'success');
            })
            .catch(function () {
                // L'envoi a échoué : on ne perd pas le message, on le repasse au client mail
                setStatus('L’envoi automatique a échoué. Ouverture de votre messagerie…', 'error');
                setTimeout(function () { mailtoFallback(data); }, 1200);
            })
            .finally(function () {
                submitBtn.disabled = false;
            });
    });
})();
