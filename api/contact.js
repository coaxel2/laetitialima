/**
 * Envoi du formulaire de contact — fonction serverless Vercel.
 *
 * Deux modes d'expédition, choisis d'après les variables présentes :
 *
 *   1. SMTP  — si SMTP_USER et le mot de passe sont définis. Réutilise un
 *              compte SMTP existant, sans créer de service tiers.
 *   2. Resend — si RESEND_API_KEY est définie.
 *
 * Sans aucune des deux, l'API répond 503 et le formulaire invite le visiteur à
 * écrire directement. Voir CONTACT.md.
 */
import nodemailer from 'nodemailer';

const TO = process.env.CONTACT_TO || 'contact@laetitialima.fr';
const MAX = { name: 120, email: 200, subject: 160, message: 5000 };

function clean(value, limit) {
    return typeof value === 'string' ? value.trim().slice(0, limit) : '';
}

function escapeHtml(value) {
    return value.replace(/[&<>"']/g, function (c) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
}

function buildBodies({ name, email, subject, message }) {
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

    return { text, html };
}

// Le mot de passe est accepté sous les deux noms courants : le projet
// axelcourty utilise SMTP_PASSWORD, d'autres gabarits utilisent SMTP_PASS.
function smtpPassword() {
    return process.env.SMTP_PASS || process.env.SMTP_PASSWORD || '';
}

async function sendWithSmtp(data) {
    const port = Number(process.env.SMTP_PORT || 465);
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'ssl0.ovh.net',
        port: port,
        secure: port === 465,
        auth: {
            user: process.env.SMTP_USER,
            pass: smtpPassword()
        }
    });

    const { text, html } = buildBodies(data);

    // L'expéditeur doit rester la boîte authentifiée, sinon OVH refuse l'envoi.
    // L'adresse du visiteur passe en Reply-To : répondre lui écrit directement.
    await transporter.sendMail({
        from: '"Portfolio Laëtitia Lima" <' + process.env.SMTP_USER + '>',
        to: TO,
        replyTo: data.name + ' <' + data.email + '>',
        subject: '[Portfolio] ' + data.subject + ' — ' + data.name,
        text: text,
        html: html
    });
}

async function sendWithResend(data) {
    const { text, html } = buildBodies(data);
    const from = process.env.CONTACT_FROM || 'Portfolio <onboarding@resend.dev>';

    const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + process.env.RESEND_API_KEY,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            from: from,
            to: [TO],
            reply_to: data.email,
            subject: '[Portfolio] ' + data.subject + ' — ' + data.name,
            text: text,
            html: html
        })
    });

    if (!response.ok) {
        throw new Error('Resend ' + response.status + ' : ' + (await response.text()));
    }
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

    const data = {
        name: clean(body.name, MAX.name),
        email: clean(body.email, MAX.email),
        subject: clean(body.subject, MAX.subject) || 'Contact',
        message: clean(body.message, MAX.message)
    };

    const errors = [];
    if (data.name.length < 2) errors.push('name');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(data.email)) errors.push('email');
    if (data.message.length < 10) errors.push('message');

    if (errors.length) {
        return res.status(400).json({ error: 'Champs invalides.', fields: errors });
    }

    const hasSmtp = Boolean(process.env.SMTP_USER && smtpPassword());
    const hasResend = Boolean(process.env.RESEND_API_KEY);

    if (!hasSmtp && !hasResend) {
        console.error('Aucun mode d’envoi configuré (ni SMTP_USER + SMTP_PASSWORD, ni RESEND_API_KEY).');
        return res.status(503).json({ error: 'Service d’envoi non configuré.' });
    }

    try {
        if (hasSmtp) {
            await sendWithSmtp(data);
        } else {
            await sendWithResend(data);
        }
        return res.status(200).json({ ok: true });
    } catch (err) {
        // Le détail reste dans les journaux Vercel : il peut contenir des
        // informations de configuration qui n'ont rien à faire côté visiteur.
        console.error('Échec de l’envoi :', err && err.message ? err.message : err);
        return res.status(502).json({ error: 'L’envoi a échoué.' });
    }
}
