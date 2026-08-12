#!/bin/bash
# Ouvre l'interface d'administration en local.
#
# L'admin n'est pas publié sur le site : il génère du HTML à coller dans le
# projet, il n'a donc rien à faire en ligne. Ce script sert le dossier du
# projet sur un port local et ouvre la page dans le navigateur.
#
# Utilisation : double-cliquer sur ce fichier depuis le Finder.

set -e
cd "$(dirname "$0")/.."

PORT=8765

# Si le port répond déjà, on réutilise le serveur en cours plutôt que d'en
# lancer un second qui échouerait.
if curl -s -o /dev/null -m 2 "http://localhost:$PORT/" 2>/dev/null; then
    echo "Serveur déjà actif sur le port $PORT."
else
    echo "Démarrage du serveur local sur le port $PORT…"
    python3 -m http.server "$PORT" >/dev/null 2>&1 &
    sleep 1
fi

echo "Ouverture de l'administration…"
open "http://localhost:$PORT/_tools/admin/admin.html"

echo
echo "L'administration est ouverte dans le navigateur."
echo "Aperçu du site : http://localhost:$PORT/"
echo
echo "Ferme cette fenêtre quand tu as terminé (le serveur s'arrête avec elle)."
echo "Appuie sur Ctrl+C pour arrêter maintenant."

# Garde la fenêtre ouverte tant que le serveur tourne
wait
