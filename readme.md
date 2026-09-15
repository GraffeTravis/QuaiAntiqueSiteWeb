# Quai Antique — Front-end

Application web vitrine du restaurant **Quai Antique**, développée dans le cadre de la formation **Développeur Web et Web Mobile** et de l'ECF.

Le site permet aux visiteurs de découvrir le restaurant, sa galerie, sa carte et ses fonctionnalités de réservation. Il propose également des espaces dédiés aux utilisateurs authentifiés.

Le front-end communique avec une API REST Symfony pour récupérer et modifier les données du restaurant.

## Présentation

Le front-end constitue l'interface utilisateur de l'application Quai Antique.

Il permet notamment :

* de présenter le restaurant ;
* d'afficher la galerie de photographies ;
* d'afficher la carte ;
* de permettre l'inscription et la connexion des utilisateurs ;
* de gérer l'espace personnel ;
* de permettre la consultation et la gestion des réservations ;
* de proposer une interface adaptée aux différents rôles utilisateurs ;
* de communiquer avec l'API REST du projet.

L'application est développée en JavaScript natif sans framework front-end lourd. Un système de routage personnalisé permet de charger dynamiquement les différentes pages du site.

## Architecture du projet

```text
Quai Antique
│
├── Front-end
│   ├── HTML
│   ├── JavaScript
│   ├── SCSS
│   ├── Bootstrap
│   └── Bootstrap Icons
│
└── API REST
    ├── Symfony
    ├── Doctrine ORM
    └── PostgreSQL
```

Repository associé au back-end :

https://github.com/GraffeTravis/api_restaurantQuaiAntique

## Technologies

| Technologie     | Utilisation                                 |
| --------------- | ------------------------------------------- |
| HTML5           | Structure des pages                         |
| CSS3            | Mise en forme                               |
| SCSS            | Organisation et personnalisation des styles |
| JavaScript ES6+ | Logique applicative                         |
| Bootstrap 5.3   | Composants et responsive design             |
| Bootstrap Icons | Icônes de l'interface                       |
| Fetch API       | Communication avec le back-end              |
| Git / GitHub    | Versionnement du projet                     |

Les dépendances front-end actuellement déclarées comprennent Bootstrap `5.3.8` et Bootstrap Icons `1.13.1`.

## Structure

La structure actuelle du projet est organisée autour des pages, des scripts JavaScript, du routeur et des styles :

```text
.
├── Router/
│   ├── Route.js
│   ├── allRoutes.js
│   └── router.js
│
├── js/
│   ├── auth/
│   │   ├── account.js
│   │   ├── editPassword.js
│   │   ├── signin.js
│   │   └── signup.js
│   ├── reservations/
│   │   ├── allResa.js
│   │   └── reserver.js
│   ├── admin.js
│   ├── galerie.js
│   ├── lacarte.js
│   └── script.js
│
├── pages/
│   ├── auth/
│   ├── reservations/
│   ├── admin.html
│   ├── galerie.html
│   ├── lacarte.html
│   └── home.html
│
├── scripts/
│   ├── check-routes.mjs
│   └── check-syntax.mjs
│
├── scss/
│   ├── main.scss
│   └── custom.scss
│
├── images/
├── dev-server.mjs
├── index.html
├── package.json
└── package-lock.json
```

La structure exacte peut évoluer au cours du développement.

## Routage

Le projet utilise un routeur JavaScript personnalisé.

Les routes sont définies dans :

```text
Router/allRoutes.js
```

Le routeur principal :

```text
Router/router.js
```

permet de :

* déterminer la page correspondant à l'URL courante ;
* gérer les routes inexistantes avec une page 404 ;
* charger dynamiquement le contenu HTML ;
* charger le JavaScript associé à la page ;
* modifier le titre du document ;
* gérer la navigation avec l'historique du navigateur ;
* appliquer les règles d'accès définies pour chaque route.

Les routes actuellement déclarées comprennent notamment :

```text
/
/galerie
/lacarte
/signin
/signup
/account
/editPassword
/allresa
/reserver
/admin
```

Les routes d'authentification et de réservation sont associées à des règles d'accès selon l'état ou le rôle de l'utilisateur.

## Interface utilisateur

L'interface utilise **Bootstrap** pour fournir une base responsive et des composants d'interface.

Le projet utilise également des styles personnalisés en SCSS afin d'adapter l'identité visuelle du restaurant.

Les styles comprennent notamment :

* navigation ;
* footer ;
* sections principales ;
* galerie ;
* cartes ;
* boutons ;
* affichage responsive ;
* éléments spécifiques aux réservations.

Le fichier principal `main.scss` importe notamment Bootstrap Icons et les styles personnalisés du projet.

## Pages principales

### Accueil

La page d'accueil présente le restaurant et son univers graphique.

### Galerie

La galerie permet d'afficher les photographies du restaurant et des plats.

Les éléments de galerie disposent notamment d'un comportement visuel au survol permettant d'afficher leur titre et les actions disponibles.

### La carte

La page présente les éléments de la carte du restaurant.

### Connexion

La page de connexion permet à un utilisateur de transmettre son adresse e-mail et son mot de passe à l'API.

La réponse de l'API permet ensuite d'établir la session applicative côté front-end.

### Inscription

La page d'inscription permet à un visiteur de créer un compte client.

### Mon compte

L'espace personnel permet à un utilisateur authentifié de gérer ses informations personnelles.

### Réservations

Les pages de réservation permettent notamment :

* de créer une réservation ;
* de consulter les réservations ;
* de modifier ou supprimer les réservations selon les droits de l'utilisateur.

## Gestion des utilisateurs

Le front-end distingue plusieurs états utilisateur :

```text
Visiteur
    │
    ├── Connexion
    └── Inscription
          │
          ▼
       Client
          │
          ├── Compte
          ├── Réservations
          └── Modification du mot de passe

Administrateur
    │
    ├── Compte
    ├── Gestion des contenus
    └── Gestion des réservations
```

Le routeur définit actuellement des autorisations pour certaines pages selon les rôles `client`, `admin` ou `disconnected`.

## Communication avec l'API

Le front-end communique avec le back-end grâce à la **Fetch API**.

Les principales opérations comprennent notamment :

```text
POST /api/login
POST /api/registration
GET  /api/account/me
```

Les requêtes authentifiées transmettent actuellement le token d'accès via l'en-tête :

```http
X-AUTH-TOKEN: <token>
```

L'URL de l'API est centralisée dans le script principal :

```javascript
const localApiUrl = "http://127.0.0.1:8000/api/";
const productionApiUrl = "https://quai-antique-api-21f25094150b.herokuapp.com/api/";
```

Le front-end utilise automatiquement l'API locale quand il est ouvert depuis `localhost` ou `127.0.0.1`, et l'API Heroku lorsqu'il est déployé en production.

## Authentification côté front-end

Après une authentification réussie, le front-end récupère le token fourni par l'API et conserve également le rôle utilisateur.

Le système actuel utilise des cookies JavaScript pour conserver :

```text
accesstoken
role
```

Le script principal utilise ensuite ces informations pour adapter l'affichage de l'interface et déterminer si certaines pages sont accessibles.

> Le contrôle des routes côté front-end est uniquement une mesure d'interface utilisateur. Il ne constitue pas une frontière de sécurité. Les autorisations réelles sont contrôlées par l'API back-end.

## Sécurité

Le front-end applique plusieurs mécanismes destinés à améliorer la sécurité et la robustesse de l'application :

* validation des données saisies dans les formulaires ;
* gestion de l'état connecté/déconnecté ;
* contrôle d'accès aux pages selon le rôle ;
* transmission du token aux endpoints protégés ;
* gestion des erreurs des requêtes API ;
* fonction de neutralisation du contenu HTML dynamique ;
* séparation des interfaces selon les rôles.

Une fonction `sanitizeHtml()` est notamment présente dans le script principal afin d'échapper du contenu texte avant une éventuelle utilisation dans du HTML.

> La validation et les contrôles réalisés côté front-end ne remplacent jamais ceux du back-end. Toute donnée reçue par l'API doit être considérée comme non fiable et validée côté serveur.

## Responsive design

Le site utilise Bootstrap ainsi que des styles SCSS personnalisés afin de proposer une interface adaptée aux différentes tailles d'écran.

La navigation principale utilise notamment le système responsive de Bootstrap avec une navigation réduite sur les petits écrans.

## Installation

### Prérequis

* Git ;
* un navigateur web moderne ;
* Node.js et npm pour installer les dépendances front-end ;
* l'API Quai Antique disponible pour les fonctionnalités nécessitant des données dynamiques.

### 1. Cloner le repository

```bash
git clone https://github.com/GraffeTravis/QuaiAntiqueSiteWeb.git
cd QuaiAntiqueSiteWeb
```

### 2. Installer les dépendances

```bash
npm install
```

Les dépendances du projet sont déclarées dans `package.json`.

### 3. Configurer l'API

En développement, l'URL de l'API est actuellement définie dans :

```text
js/script.js
```

Configuration actuelle :

```javascript
const localApiUrl = "http://127.0.0.1:8000/api/";
const productionApiUrl = "https://quai-antique-api-21f25094150b.herokuapp.com/api/";
```

Si l'API de production change d'adresse, la valeur `productionApiUrl` doit être mise à jour.

### 4. Lancer le front-end

Le projet étant composé de fichiers HTML, JavaScript et SCSS, il est recommandé d'utiliser un serveur HTTP local plutôt que d'ouvrir directement `index.html` avec `file://`.

Le projet fournit un serveur local adapté au routeur :

```bash
npm run dev
```

Le front-end est ensuite disponible sur :

```text
http://127.0.0.1:5500
```

Ce serveur permet aussi d'ouvrir directement les routes internes comme `/galerie`, `/lacarte`, `/reserver` ou `/admin`.

## Développement

Lors du développement, les principales zones du projet sont :

```text
pages/
```

pour les interfaces HTML,

```text
js/
```

pour la logique JavaScript,

```text
Router/
```

pour la navigation et la gestion des routes,

```text
scss/
```

pour les styles,

et :

```text
images/
```

pour les ressources graphiques.

## Vérification technique

Un contrôle de syntaxe JavaScript est disponible avec :

```bash
npm run check
```

Cette commande vérifie les scripts du routeur, des pages et du serveur local. Elle vérifie aussi que chaque route déclarée pointe vers des fichiers existants.

## Déploiement

Le front-end est destiné à être déployé séparément de l'API.

Architecture cible :

```text
Utilisateur
    │
    ▼
Front-end web
    │
    │ HTTPS
    ▼
API REST Symfony
    │
    ▼
PostgreSQL
```

Le front-end est configuré avec l'URL publique de l'API Heroku.

L'environnement de production doit notamment respecter les principes suivants :

* utilisation de HTTPS ;
* URL d'API adaptée à la production ;
* configuration CORS correspondante côté API ;
* absence d'identifiants de test dans le code ;
* aucune donnée sensible directement intégrée au front-end.

## Tests fonctionnels

Avant une mise en production, les parcours suivants doivent être vérifiés :

### Visiteur

* [x] accès à l'accueil ;
* [x] accès à la galerie ;
* [x] accès à la carte ;
* [x] accès à la connexion ;
* [x] accès à l'inscription ;
* [x] navigation entre les pages ;
* [x] affichage responsive.

### Client

* [x] inscription ;
* [x] connexion ;
* [x] déconnexion ;
* [x] accès au compte ;
* [ ] modification du mot de passe ;
* [x] création d'une réservation ;
* [x] consultation des réservations ;
* [x] modification d'une réservation ;
* [x] suppression d'une réservation.

### Administrateur

* [x] connexion administrateur ;
* [x] accès aux fonctionnalités administratives ;
* [x] gestion des contenus ;
* [x] gestion des réservations ;
* [x] vérification des restrictions d'accès.

## Points d'attention avant production

Le projet est actuellement fonctionnel autour d'une architecture front-end légère, mais plusieurs éléments doivent être finalisés avant le déploiement définitif.

### Configuration de l'API

Le front-end distingue l'API locale et l'API de production :

```javascript
const localApiUrl = "http://127.0.0.1:8000/api/";
const productionApiUrl = "https://quai-antique-api-21f25094150b.herokuapp.com/api/";
```

Cette configuration reste simple et adaptée au projet ECF. Pour une application plus avancée, elle pourrait être remplacée par une variable d'environnement injectée au build.

### Authentification

Le système actuel repose sur des cookies JavaScript accessibles via `document.cookie`.

Cette architecture devra être évaluée et durcie avant la mise en production, notamment concernant le stockage du token et la gestion du rôle.

### Autorisation

Les restrictions définies dans le routeur améliorent l'expérience utilisateur mais ne doivent pas être considérées comme une protection de sécurité.

Le back-end reste responsable de l'autorisation réelle.

### Gestion des scripts

Le routeur ajoute dynamiquement le script JavaScript correspondant à chaque page lors de la navigation.

Cette architecture devra être surveillée afin d'éviter l'accumulation de scripts ou d'écouteurs d'événements lors de navigations répétées.

## Contexte ECF

Ce repository constitue la partie front-end du projet **Quai Antique** réalisé dans le cadre du titre professionnel **Développeur Web et Web Mobile**.

Le projet permet notamment de mettre en œuvre :

* conception d'une interface web responsive ;
* HTML et CSS ;
* préprocesseur SCSS ;
* JavaScript ;
* manipulation du DOM ;
* routage côté client ;
* communication avec une API REST ;
* authentification utilisateur ;
* gestion des rôles ;
* intégration front-end / back-end ;
* gestion des erreurs ;
* prise en compte de problématiques de sécurité.

## Repositories associés

### Front-end

https://github.com/GraffeTravis/QuaiAntiqueSiteWeb

### Back-end / API

https://github.com/GraffeTravis/api_restaurantQuaiAntique

## Auteur

**Travis Graffe**

Projet réalisé dans le cadre de la formation Développeur Web et Web Mobile.

---

## Licence

Projet pédagogique réalisé dans le cadre de la formation.

Les contenus fournis par le cahier des charges sont utilisés uniquement dans le contexte du projet ECF.
