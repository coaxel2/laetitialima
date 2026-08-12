/**
 * Envoi du formulaire de contact — fonction serverless Vercel.
 *
 * Le message part vers CONTACT_TO via Resend. L'adresse du visiteur est mise
 * en Reply-To : répondre depuis sa boîte répond directement à la personne.
 *
 * Variables d'environnement attendues :
 *   RESEND_API_KEY  (obligatoire) clé API Resend
 *   CONTACT_TO      (optionnel)   destinataire, par défaut contact@laetitialima.fr
 *   CONTACT_FROM    (optionnel)   expéditeur, par défaut le domaine de test Resend
 */

const TO = process.env.CONTACT_TO || 'contact@laetitialima.fr';

// Le domaine par défaut de Resend fonctionne sans configuration DNS.
// Pour envoyer depuis laetitialima.fr, vérifier le domaine dans Resend puis
// définir CONTACT_FROM (les enregistrements SPF/DKIM sont à ajouter chez OVH).
const FROM = process.env.CONTACT_FROM || 'Portfolio <onboarding@resend.dev>';

const MAX = { name: 120, email: 200, subject: 160, message: 5000 };

function clean(value, limit) {
    return typeof value === 'string' ? value.trim().slice(0, limit) : '';
}

function escapeHtml(value) {
    return value.replace(/[&<>"']/g, function (c) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
}

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).json({ error: 'Méthode non autorisée.' });
    }

    let body = req.body;
    if (typeof body === 'string') {
        try {
            body = JSON.parse(body);
        } catch (e) {
            return res.status(400).json({ error: 'Requête illisible.' });
        }
    }
    body = body || {};

    // Champ piège : rempli uniquement par les robots. On répond 200 pour ne pas
    // leur signaler qu'ils ont été filtrés.
    if (clean(body.company, 100)) {
        return res.status(200).json({ ok: true });
    }

    const name = clean(body.name, MAX.name);
    const email = clean(body.email, MAX.email);
    const subject = clean(body.subject, MAX.subject) || 'Contact';
    const message = clean(body.message, MAX.message);

    const errors = [];
    if (name.length < 2) errors.push('name');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) errors.push('email');
    if (message.length < 10) errors.push('message');

    if (errors.length) {
        return res.status(400).json({ error: 'Champs invalides.', fields: errors });
    }

    if (!process.env.RESEND_API_KEY) {
        console.error('RESEND_API_KEY absente : impossible d’envoyer le message.');
        return res.status(503).json({ error: 'Service d’envoi non configuré.' });
    }

    const text =
        'Nouveau message depuis laetitialima.fr\n\n' +
        'Nom : ' + name + '\n' +
        'E-mail : ' + email + '\n' +
        'Sujet : ' + subject + '\n\n' +
        message;

    const html =
        '<div style="font-family:system-ui,sans-serif;line-height:1.6;color:#241812">' +
        '<h2 style="margin:0 0 16px">Nouveau message depuis laetitialima.fr</h2>' +
        '<p style="margin:0 0 4px"><strong>Nom :</strong> ' + escapeHtml(name) + '</p>' +
        '<p style="margin:0 0 4px"><strong>E-mail :</strong> ' + escapeHtml(email) + '</p>' +
        '<p style="margin:0 0 16px"><strong>Sujet :</strong> ' + escapeHtml(subject) + '</p>' +
        '<hr style="border:none;border-top:1px solid #e6ded3;margin:16px 0">' +
        '<p style="white-space:pre-wrap;margin:0">' + escapeHtml(message) + '</p>' +
        '</div>';

    try {
        const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + process.env.RESEND_API_KEY,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                from: FROM,
                to: [TO],
                reply_to: email,
                subject: '[Portfolio] ' + subject + ' — ' + name,
                text: text,
                html: html
            })
        });

        if (!response.ok) {
            const detail = await response.text();
            console.error('Resend a refusé l’envoi :', response.status, detail);
            return res.status(502).json({ error: 'L’envoi a échoué.' });
        }

        return res.status(200).json({ ok: true });
    } catch (err) {
        console.error('Erreur réseau vers Resend :', err);
        return res.status(502).json({ error: 'L’envoi a échoué.' });
    }
}
