/**
 * Formulaire de contact.
 *
 * Le message part vers /api/contact, qui l'envoie par e-mail. Aucune ouverture
 * du client mail du visiteur : tout se passe sur la page.
 */
(function () {
    'use strict';

    var form = document.getElementById('contactForm');
    if (!form) return;

    var status = document.getElementById('formStatus');
    var submitBtn = document.getElementById('submitBtn');
    var endpoint = form.getAttribute('action') || '/api/contact';

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
            message: form.elements.message.value.trim(),
            company: ''
        };

        submitBtn.disabled = true;
        var label = submitBtn.textContent;
        submitBtn.textContent = 'Envoi en cours…';
        setStatus('Envoi en cours…', 'info');

        fetch(endpoint, {
            method: 'POST',
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })
            .then(function (res) {
                return res.json().catch(function () { return {}; }).then(function (payload) {
                    return { ok: res.ok, status: res.status, payload: payload };
                });
            })
            .then(function (r) {
                if (r.ok) {
                    form.reset();
                    setStatus('Message envoyé. Je vous réponds sous 48 heures.', 'success');
                    return;
                }
                if (r.status === 503) {
                    setStatus('Le service d’envoi est momentanément indisponible. Écrivez-moi directement à contact@laetitialima.fr.', 'error');
                    return;
                }
                setStatus(
                    (r.payload && r.payload.error) ||
                    'L’envoi a échoué. Réessayez ou écrivez-moi à contact@laetitialima.fr.',
                    'error'
                );
            })
            .catch(function () {
                setStatus('Connexion impossible. Vérifiez votre réseau, ou écrivez-moi à contact@laetitialima.fr.', 'error');
            })
            .finally(function () {
                submitBtn.disabled = false;
                submitBtn.textContent = label;
            });
    });
})();
