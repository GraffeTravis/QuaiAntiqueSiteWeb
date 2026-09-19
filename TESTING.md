# Tests du front

`npm run check` vérifie la syntaxe et les routes. `npm run test:e2e` lance le serveur local sur le port 5512 et teste avec Playwright la navigation, la redirection de réservation et de compte, le menu mobile Bootstrap, les droits admin et la galerie (ajout, renommage, suppression). Les réponses API sont simulées ; aucune écriture n'est envoyée à la production.

Sous Windows, Playwright utilise Edge installé. En CI, Chromium est installé puis utilisé automatiquement (`CI=1`). La CI exécute les deux commandes à chaque push et pull request. Les ressources externes de police sont bloquées et le script Bootstrap est servi depuis la dépendance locale pour rendre les scénarios reproductibles.

La refonte d'identité vérifie aussi que les prix de l'accueil et de la page Menus viennent de la même réponse API, que le footer et le formulaire utilisent les horaires administrés, que le lundi reste fermé et qu'une API indisponible ne propose pas de créneaux fictifs. Les états vide et erreur des menus sont testés. Le contrôle visuel doit couvrir l'accueil sur ordinateur et mobile, puis la navigation depuis le bas de cette page longue.

Après une modification SCSS, `npm run build:css` régénère la feuille CSS servie par le site et sa source map. Le dossier `docs/IDENTITE_QUAI_ANTIQUE.md` consigne les sources, les choix fictifs et les dépendances à vérifier pour les prochaines évolutions.

## Recette du 18 septembre 2026

- Compilation CSS réussie ; avertissements de dépréciation Sass/Bootstrap existants, sans erreur de compilation.
- Syntaxe de 18 fichiers JavaScript et 11 routes vérifiées.
- `npm run test:e2e -- --workers=2` : 8 tests réussis. Le premier passage à 6 navigateurs a dépassé le délai sur le scénario de galerie ; le passage complet à 2 navigateurs est réussi.
- Captures de l'accueil à 320, 390, 768 et 1440 pixels : pas de débordement horizontal, les cinq images de contenu sont chargées. Les captures utilisent des menus simulés et les polices de secours, les ressources externes étant bloquées pour cette recette.
- Aucun déploiement ni changement dans les données de production. Une recette avec l'API réelle reste nécessaire avant publication.

Sous Windows, si l'arrêt du serveur lancé par Playwright reste bloqué, démarrer séparément `dev-server.mjs` avec `PORT=5512` avant les tests : Playwright réutilise ce serveur. Arrêter ensuite uniquement ce processus de test, en conservant le serveur d'aperçu sur 5500.
