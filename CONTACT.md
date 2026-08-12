# Formulaire de contact

Le formulaire de `/contact/` envoie le message par e-mail sans ouvrir la
messagerie du visiteur. Tout se passe sur la page.

## Comment ça marche

1. `assets/js/contact.js` valide les champs puis envoie le contenu en JSON à
   `/api/contact/`.
2. `api/contact.js` — une fonction serverless Vercel — revalide côté serveur
   puis expédie le message.
3. Il arrive sur **contact@laetitialima.fr**, avec l'adresse du visiteur en
   `Reply-To` : répondre lui écrit directement.

## Ce que permet l'offre e-mail du domaine

L'offre OVH rattachée à `laetitialima.fr` est **« redirect »** : quota de
comptes e-mail **0 / 0**, uniquement des redirections.

Conséquence : `contact@laetitialima.fr` fonctionne très bien **en réception**
(la redirection transmet à la vraie boîte), mais il n'existe aucun compte sur
lequel s'authentifier pour **envoyer**. L'expédition doit donc passer par un
compte SMTP existant ailleurs, ou par un service d'envoi.

## Mode 1 — SMTP (recommandé ici)

Aucun compte à créer : les identifiants SMTP déjà utilisés par le projet
`axelcourty-portfolio` conviennent. Le message part de cette boîte, arrive sur
`contact@laetitialima.fr`, et la réponse va au visiteur.

| Variable | Obligatoire | Défaut |
|---|---|---|
| `SMTP_USER` | oui | — adresse complète de la boîte d'envoi |
| `SMTP_PASSWORD` | oui | — (`SMTP_PASS` est aussi accepté) |
| `SMTP_HOST` | non | `ssl0.ovh.net` |
| `SMTP_PORT` | non | `465` (SSL) — utiliser `587` pour STARTTLS |
| `CONTACT_TO` | non | `contact@laetitialima.fr` |

```bash
cd ~/Documents/laetitialima
vercel env add SMTP_USER production
vercel env add SMTP_PASSWORD production   # saisie masquée
vercel --prod
```

Le mot de passe peut aussi être recopié depuis l'autre projet via
*Vercel → Settings → Environment Variables*, sans jamais transiter par un
fichier du dépôt.

## Mode 2 — Resend

Si un service dédié est préféré : compte sur [resend.com](https://resend.com),
offre gratuite de 3 000 e-mails par mois.

```bash
vercel env add RESEND_API_KEY production
vercel --prod
```

Par défaut l'expéditeur est le domaine de test de Resend, ce qui fonctionne
sans toucher aux DNS. Pour envoyer depuis `laetitialima.fr`, vérifier le
domaine dans Resend, ajouter les enregistrements DKIM chez OVH, puis définir
`CONTACT_FROM`. **Le SPF existant (`v=spf1 include:mx.ovh.com -all`) doit être
complété, pas remplacé** — sinon la réception des e-mails du domaine est
perturbée.

## Si aucun mode n'est configuré

L'API répond `503` et le formulaire affiche un message invitant à écrire
directement à `contact@laetitialima.fr`. Rien ne casse, mais aucun message
n'est transmis.

## Protection anti-spam

Le formulaire contient un champ « Société » invisible pour un humain. Les robots
le remplissent, les visiteurs non : toute soumission où ce champ est rempli est
ignorée, avec une réponse `200` pour ne pas signaler le filtrage.

La validation est faite deux fois — dans le navigateur pour le confort, sur le
serveur parce qu'une requête peut contourner la page.

## Revoir l'animation d'entrée

L'intro « Débloquer ma marque » se joue une fois par session. Pour la revoir :
ouvrir le site dans un nouvel onglet, ou ajouter `?intro` à l'adresse —
<https://laetitialima.fr/?intro>.
