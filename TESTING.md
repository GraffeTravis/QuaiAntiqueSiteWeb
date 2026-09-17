# Tests du front

`npm run check` vérifie la syntaxe et les routes. `npm run test:e2e` lance le serveur local sur le port 5512 et teste avec Playwright la navigation, la redirection de réservation et de compte, le menu mobile Bootstrap, les droits admin et la galerie (ajout, renommage, suppression). Les réponses API sont simulées ; aucune écriture n'est envoyée à la production.

Sous Windows, Playwright utilise Edge installé. En CI, Chromium est installé puis utilisé automatiquement (`CI=1`). La CI exécute les deux commandes à chaque push et pull request. Les ressources externes de police sont bloquées et le script Bootstrap est servi depuis la dépendance locale pour rendre les scénarios reproductibles.
