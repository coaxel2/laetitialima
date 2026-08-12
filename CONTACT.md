# Formulaire de contact

Le site est statique : il n'a pas de serveur pour envoyer les e-mails. Le
formulaire fonctionne donc en deux modes.

## Mode actuel (aucune configuration)

Sans service configuré, le bouton « Envoyer » ouvre la messagerie du visiteur
avec un message pré-rempli (nom, e-mail, sujet, contenu). C'est fonctionnel dès
la mise en ligne, mais le visiteur doit finir l'envoi depuis son client mail.

## Recevoir les messages directement (recommandé, gratuit)

1. Créer un compte sur [formspree.io](https://formspree.io) (offre gratuite :
   50 messages par mois).
2. Créer un formulaire, récupérer son identifiant — une URL de la forme
   `https://formspree.io/f/xxxxxxxx`.
3. Dans `contact/index.html`, remplacer :

   ```html
   action="https://formspree.io/f/REMPLACER_PAR_VOTRE_ID"
   ```

   par l'URL obtenue.

Le script détecte automatiquement que le service est configuré et bascule sur
l'envoi direct, sans ouvrir de client mail. Si l'envoi échoue (réseau coupé,
quota dépassé), il repasse tout seul sur la messagerie pour que le message ne
soit pas perdu.

Tout autre service acceptant un `POST` en JSON fonctionne de la même façon
(Web3Forms, Getform, Basin…).

## Protection anti-spam

Le formulaire contient un champ « Société » invisible pour un humain. Les robots
le remplissent, les visiteurs non : toute soumission où ce champ est rempli est
ignorée sans message d'erreur.

## Revoir l'animation d'entrée

L'intro « Débloquer ma marque » se joue une fois par session : une fois passée,
elle ne réapparaît pas tant que l'onglet reste ouvert. Pour la revoir :

- ouvrir le site dans un nouvel onglet, ou
- ajouter `?intro` à l'adresse : <https://laetitialima.fr/?intro>
