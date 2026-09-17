# Quêtes d’Anomalies — plateau jouable

Jeu : https://kitout3.github.io/Jeux/

Le dépôt **kitout3/Jeux** contient l'application. Le dépôt **kitout3/livre-de-regle** reste la référence éditoriale et n'est pas modifié.

## Utilisation

Choisir de 2 à 6 personnages, humains ou ordinateurs, puis commencer.
Le jeu gère le déplacement, les combats, les ressources, les quêtes, les six personnages, les Anomalies, l'Altération et le classement.
Mode local sur un écran partagé ; pas de multijoueur réseau.
Sauvegarde automatique dans le navigateur et export/import JSON.

La version précédente est conservée dans `ancienne-version.html`, avec ses propres clés de sauvegarde inchangées.

## Règles et adaptation

Source : livre-de-regle, index.html, commit fa0b3f6062b680fd73b447af3642576746ec080a.
L'objectif Or coûte 9 Or. Les quatre monopoles valent 3 PV. Les pouvoirs, les quêtes, la mort et les Altérations suivent le livret.
L'aide du jeu détaille les conventions requises quand le livret ne précise pas les valeurs.
En particulier le parcours de 48 cases est une adaptation fonctionnelle et non une reproduction exacte de la carte miniature fournie.
Les noms des territoires sont ajoutés ; les valeurs initiales, les trois boss et la durée classique sont reprises de l'application antérieure.

## Développement et validation

Aucune dépendance pour exécuter le jeu : fichiers statiques et modules JavaScript.
Servir le dossier avec un serveur HTTP (par exemple `python3 -m http.server 8000`).
`npm test` lance les tests de règles et les simulations reproductibles.
La validation GitHub Actions exécute aussi les parcours navigateur sur ordinateur et mobile (Chromium et WebKit).

Les contenus utilisateur importés sont validés et échappés avant affichage. Les dés utilisent un générateur déterministe afin de reprendre une partie sans changer son état aléatoire.
