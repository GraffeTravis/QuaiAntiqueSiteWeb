# Tests du front

La recette de publication de la refonte est consignée dans [docs/RECETTE_PRODUCTION_2026-09-18.md](docs/RECETTE_PRODUCTION_2026-09-18.md). `npm run test:release -- <URL>` teste le site publié en lecture seule avec l'API réelle ; les erreurs du navigateur ou du réseau font échouer la commande. Le mode local `--proxy-local-api` est décrit dans ce rapport.

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

## Complément : fond fixe et galerie exclusivement API

- Fond photographique partagé, fixé à la fenêtre sans animation JavaScript. Sections claires translucides, bandes vertes opaques et formulaires sur un voile plus opaque.
- L'accueil appelle `GET /api/restaurants/1/pictures` sans cache à chaque chargement et conserve les trois premières photos. Le contrôleur serveur lit le dépôt de photos du restaurant, triées par date de création décroissante. Il ne s'agit pas d'une mise à jour en temps réel : revenir sur l'accueil ou recharger la page relit les données.
- Aucun tableau d'images de secours dans le code de l'accueil. Base vide, erreur réseau et réponse invalide ont des états explicites, sans photo locale de remplacement. Les images locales encore référencées par les tests servent uniquement de données de recette.
- `npm run test:e2e -- --workers=2` : 11 tests réussis, dont actualisation des photos, absence de secours local et contrôles de fond fixe/transparence/débordement à 320, 390, 768 et 1440 pixels.
- Captures contrôlées sur ordinateur et mobile, ainsi que sur le formulaire de connexion. Compilation CSS et contrôles de syntaxe/routes réussis.
- La lecture directe de l'API de production depuis PowerShell a échoué lors de la connexion TLS. Les tests utilisent des réponses simulées ; aucune donnée de production n'a été modifiée.
