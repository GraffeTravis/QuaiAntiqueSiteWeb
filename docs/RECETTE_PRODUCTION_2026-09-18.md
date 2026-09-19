# Recette de publication de la refonte

Date locale : 18 septembre 2026 (Tahiti). Début de recette API : 19 septembre 2026 à 01:51 UTC.

## Périmètre et cible

- Dépôt : `GraffeTravis/QuaiAntiqueSiteWeb`, branche de travail `refonte-style`.
- Production : https://quai-antique-site-web.vercel.app, alimentée par `main` via Vercel.
- API existante : https://quai-antique-api-21f25094150b.herokuapp.com.
- Dernière version de production avant refonte : `1e0e0a93cb2d4bd3ccc10526268a6fb9403ede88`.
- Aucun changement du serveur, du schéma ou des données de production n'est nécessaire.

## Avant publication

| Vérification | Résultat |
| --- | --- |
| Installation depuis le verrou npm | `npm ci --cache .npm-cache` réussi, 18 paquets installés |
| Audit des dépendances | 0 vulnérabilité signalée par npm |
| Compilation Sass | Réussie ; avertissements de dépréciation Bootstrap/Sass, sans erreur |
| CSS généré identique au CSS suivi | `git diff --exit-code -- scss/main.css scss/main.css.map` réussi |
| Syntaxe et routes | 18 fichiers JavaScript et 11 routes vérifiés |
| Tests Playwright avec API simulée | 11 tests réussis, 2 workers |
| Recette locale avec données réelles API | 33 contrôles réussis ; aucune erreur console, JavaScript ou réseau capturée |
| CORS de la production | Réponses API autorisant explicitement `https://quai-antique-site-web.vercel.app` |

L'installation initiale avec le cache npm global a échoué sur une permission Windows ; l'utilisation du cache local au projet a permis l'installation propre. L'ancien échec TLS de PowerShell n'est pas une panne de l'API : les lectures avec Node et le navigateur fonctionnent.

### Non-régression

Les 11 tests couvrent la navigation anonyme, les restrictions de compte/admin, les redirections de réservation, la séparation plats/menus, les prix, les horaires administrés, le lundi fermé, l'indisponibilité de l'API, les menus vides, le menu mobile, les photos de l'accueil, leur actualisation, l'absence de secours local, le fond fixe et l'ajout/modification/suppression de photos avec une API simulée.

### Contrôle en lecture seule

Commande locale : `npm run test:release -- http://127.0.0.1:5500 --proxy-local-api`.

Le proxy de recette transmet les requêtes locales à la véritable API via Node. Il ne fabrique aucune donnée et ne modifie pas le site : ce mode ne prétend pas vérifier le CORS depuis localhost. La commande après publication n'utilise pas ce proxy.

Les 33 contrôles comprennent :

- 4 endpoints publics : menus, plats, restaurant et photos ; 2 menus, 6 plats et 7 photos au moment de la recette.
- 16 ressources HTTP : page principale, CSS, modules partagés et les 11 fragments de route, avec vérification des types de contenu.
- 11 accès directs aux routes, y compris les redirections anonymes vers la connexion pour compte, mot de passe, réservations et administration.
- 1 route inconnue : affichage de la page 404 applicative. Le statut HTTP reste 200 conformément au repli SPA actuel de Vercel.
- 1 parcours navigation/historique/menu mobile et contrôle du débordement à 320, 390, 768 et 1440 pixels.

Les titres, les prix des menus de l'accueil, les horaires et les photos sont comparés aux réponses API. Les images sont décodées dans le navigateur. Les erreurs console, JavaScript, HTTP et réseau font échouer la recette. Toute requête autre que GET, HEAD ou OPTIONS est bloquée et signalée.

Les rapports JSON et captures sont produits dans `test-results/release-<hôte>/` (non versionné). Pour un fond fixe, les captures de référence sont des vues de fenêtre avant/après défilement : une capture intégrale prise en bas de page ne représente pas la position du fond à chaque étape du défilement.

## Procédure de publication

1. Publier `refonte-style` et attendre la réussite de GitHub Actions.
2. Vérifier l'absence de nouvelle modification sur `origin/main` ; intégrer par avance rapide, sans écrasement forcé.
3. Publier `main` et attendre le déploiement Vercel correspondant au commit.
4. Exécuter `npm run test:release -- https://quai-antique-site-web.vercel.app`, sans proxy.
5. Contrôler les captures et la correspondance entre les fichiers servis et le commit publié.

## Limites et retour arrière

Les écritures de réservation, la création de compte et les opérations d'administration réelles ne sont pas exécutées en production pour ne pas polluer la base. Les opérations de galerie sont testées avec une API simulée ; une recette authentifiée avec comptes dédiés peut compléter ces contrôles.

En cas de défaut bloquant après publication, rétablir le déploiement Vercel correspondant à `1e0e0a9` ou créer un commit de retour arrière sur `main`. Ne pas utiliser de push forcé et ne pas modifier la base.

## Après publication

À compléter après confirmation du déploiement et exécution de la recette sur le domaine public.
