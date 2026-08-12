# Formulaire de contact

Le formulaire de `/contact/` envoie le message par e-mail sans ouvrir la
messagerie du visiteur. Tout se passe sur la page.

## Comment ça marche

1. `assets/js/contact.js` valide les champs puis envoie le contenu en JSON à
   `/api/contact`.
2. `api/contact.js` — une fonction serverless Vercel — revalide côté serveur,
   puis transmet le message à [Resend](https://resend.com), qui l'expédie.
3. Le message arrive sur **contact@laetitialima.fr**, avec l'adresse du visiteur
   en `Reply-To` : il suffit de répondre pour lui écrire directement.

## Configuration requise

Une seule variable d'environnement est obligatoire.

| Variable | Obligatoire | Rôle |
|---|---|---|
| `RESEND_API_KEY` | oui | clé API Resend |
| `CONTACT_TO` | non | destinataire (par défaut `contact@laetitialima.fr`) |
| `CONTACT_FROM` | non | expéditeur (par défaut le domaine de test de Resend) |

### Obtenir la clé et la déclarer

1. Créer un compte sur [resend.com](https://resend.com) — l'offre gratuite
   couvre 3 000 e-mails par mois, sans carte bancaire.
2. Créer une clé d'API et la copier.
3. La déclarer sur le projet Vercel, **sans la faire passer par un fichier du
   dépôt** :

   ```bash
   vercel env add RESEND_API_KEY production
   ```

   La valeur est demandée en saisie masquée. Elle peut aussi être ajoutée depuis
   l'interface : *Project → Settings → Environment Variables*.

4. Redéployer pour que la fonction voie la variable :

   ```bash
   vercel --prod
   ```

Tant que la clé est absente, l'API répond `503` et le formulaire affiche un
message invitant à écrire directement à `contact@laetitialima.fr`. Rien ne
casse, mais aucun message n'est transmis.

### Envoyer depuis laetitialima.fr

Par défaut, l'expéditeur est le domaine de test de Resend : cela fonctionne
immédiatement, sans toucher aux DNS. Pour que les messages partent depuis
`laetitialima.fr` :

1. Vérifier le domaine dans Resend (*Domains → Add Domain*).
2. Ajouter chez OVH les enregistrements DKIM que Resend indique.
3. **Ne pas remplacer le SPF existant** (`v=spf1 include:mx.ovh.com -all`) :
   il faut y ajouter l'inclusion de Resend, sinon la réception des e-mails du
   domaine est perturbée.
4. Définir `CONTACT_FROM`, par exemple `Portfolio <contact@laetitialima.fr>`.

## Protection anti-spam

Le formulaire contient un champ « Société » invisible pour un humain. Les robots
le remplissent, les visiteurs non : toute soumission où ce champ est rempli est
ignorée. Le serveur répond alors `200` pour ne pas signaler le filtrage.

La validation est faite deux fois — dans le navigateur pour le confort, sur le
serveur parce qu'une requête peut contourner la page.

## Revoir l'animation d'entrée

L'intro « Débloquer ma marque » se joue une fois par session. Pour la revoir :
ouvrir le site dans un nouvel onglet, ou ajouter `?intro` à l'adresse —
<https://laetitialima.fr/?intro>.
