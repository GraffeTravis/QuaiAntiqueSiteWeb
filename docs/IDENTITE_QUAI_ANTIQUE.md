# Quai Antique : identité de la maison

Version du 18 septembre 2026. Dossier éditorial pour la refonte locale.

## Statut et ligne directrice

Le Quai Antique et Arnaud Michant appartiennent au scénario fictif du projet ECF. La biographie, les dates d'ouverture et la maison décrites ci-dessous sont des créations éditoriales, pas des faits découverts sur Internet. Les références géographiques et culinaires sont documentées séparément. Aucun restaurant réel cité dans l'étude n'est un partenaire du projet.

**Signature : La Savoie, au rythme du marché.**

Le Quai Antique est la troisième table d'Arnaud Michant. Installée à Chambéry dans notre récit, elle propose une cuisine savoyarde contemporaine : précise dans les cuissons, généreuse dans l'accueil, attentive aux saisons. Le produit doit rester reconnaissable. Une sauce courte, une juste acidité et un accompagnement de saison donnent du relief au plat sans le surcharger.

Le positionnement est celui d'une gastronomie accessible, entre le bistrot de marché et la table de destination. Ce n'est pas une promesse d'établissement étoilé, ni une auberge dont l'offre se limiterait aux spécialités fromagères. La carte comporte poissons, légumes, champignons, fromages et desserts ; l'identité alpine s'exprime toute l'année.

## Ce que les documents imposent

| Source locale | Ce qu'elle établit | Conséquence pour la refonte |
| --- | --- | --- |
| `INFO/CDC_Quai_Antique.pdf`, p. 1 | Arnaud Michant, passion pour les produits et producteurs de Savoie, troisième restaurant à Chambéry, expérience gastronomique sans artifice | Conserver le chef et cette implantation. Raconter une troisième maison, pas une reconversion ni un premier restaurant. |
| CDC, p. 2 | Ouverture du mardi au dimanche, jours non paramétrables, deux services de deux heures, horaires et capacité administrables | Lundi fermé. Pas d'horaires différents le week-end inventés par le texte marketing. |
| CDC, p. 2-3 | Photos titrées, appel à réserver après la galerie, plats par catégories, menus avec description des choix et prix | Les contenus administrés demeurent la référence commerciale. La galerie mène à une réservation. |
| CDC, p. 3 | Créneaux de quinze minutes, capacité sur un service, validation d'une réservation après connexion | Les horaires racontés doivent être compatibles avec les choix du formulaire et les contrôles API. |
| `INFO/charte_graphiqueQuaiAntique.png` | Base ocre, neutres, sombre ; Montserrat et Hind Madurai, avec Lora dans la vignette | Garder l'ocre comme accent et Hind Madurai. La branche actuelle utilise déjà Playfair Display et un vert profond : évolution éditoriale assumée de la charte, pas reproduction exacte. |
| Diagrammes UML et cas d'utilisation | L'administrateur possède les contenus, horaires, capacité et réservations | Le récit ne remplace pas les données administrables par des valeurs fixes dans plusieurs pages. |
| Dossiers ECF, surtout la version du 16 septembre 2026 | Deux dépôts, API REST, galerie et carte dynamiques, jours fixes, tests et déploiement séparés | Appliquer les changements localement et vérifier les interfaces entre pages et API. |

L'ancienne copie ECF contient des informations techniques devenues obsolètes. Pour le fonctionnement, le code et la version datée priment ; pour les exigences, le CDC prime. Les données personnelles et accès des dossiers ECF ne sont pas des contenus éditoriaux et ne sont pas repris ici.

## Ancrage réel : Chambéry, pas une station de ski générique

L'implantation fictive est le centre de Chambéry, dans le secteur des Halles et de la Leysse. Ce périmètre donne un contexte précis sans attribuer à notre établissement l'adresse d'un commerce existant. Les Halles et leurs commerces alimentaires justifient le fil conducteur du marché [S1]. La proximité de la Leysse avec le secteur du Palais de Justice donne une résonance au mot « Quai » [S2].

Le nom n'affirme pas l'existence d'un quai antique classé ou d'un ancien port romain. Dans le récit, « Quai » évoque une halte en ville et « Antique » les gestes transmis, les sauces, le pain partagé et le temps passé à table.

Les allées du centre ancien et les portiques de la rue de Boigne constituent une référence d'ambiance : pierre, passages, lumière de cour et accueil urbain [S3]. Nous n'inventons ni une vue sur le lac du Bourget depuis la salle, ni un chalet au pied des pistes.

Le territoire nourrit trois familles d'inspiration :

- **Les Bauges et les alpages** : fromages, notamment la Tome des Bauges AOP, dont l'aire est le massif entre Chambéry et Annecy [S4].
- **Le marché et les jardins** : légumes, herbes, fruits, soupes et plats dont la composition évolue avec l'approvisionnement. Les Halles sont un repère culturel, pas un fournisseur contractuellement établi [S1].
- **Les eaux et les coteaux** : poissons d'eau douce, blancs de Savoie et mondeuse comme univers culinaire régional [S5, S6]. Une origine de poisson précise ne sera affichée que si elle est réellement renseignée dans la carte ; « local » ne signifie pas « tout vient d'un seul lac ».

La matouille, le gâteau des Bauges et le vermouth font partie du répertoire décrit par l'office de tourisme [S7]. Ce sont des pistes de création, pas des plats ajoutés automatiquement à notre carte.

## Histoire fictive du chef et des trois maisons

Arnaud Michant naît à Chambéry en 1981. Il grandit entre la ville et les Bauges, où les repas familiaux lui apprennent à reconnaître un fromage affiné, une pomme mûre et le parfum d'un bouillon. Les matinées de marché avec sa mère deviennent son premier apprentissage du goût : regarder, sentir, poser des questions, puis cuisiner ce qui est bon ce jour-là.

À la fin des années 1990, il entre en apprentissage en Savoie. Il travaille ensuite plusieurs années dans des brigades lyonnaises. Il y apprend les fonds, les sauces, la régularité et l'organisation du service. Cette période explique sa précision technique sans lui attribuer un diplôme, un maître célèbre ou une récompense réelle.

En 2012, il ouvre une première petite table à Aix-les-Bains. Le poisson et les légumes y prennent une place centrale. En 2018, une deuxième maison voit le jour à Albertville, davantage tournée vers les plats mijotés et les produits de montagne. Ces établissements restent non nommés : aucune affiliation à un restaurant existant n'est suggérée.

En 2024, Arnaud revient à Chambéry pour ouvrir le Quai Antique, sa troisième adresse. Il rassemble ce qu'il préfère dans ses deux premières maisons : la fraîcheur, la profondeur d'une sauce et une salle où l'on se sent attendu. Son équipe fait vivre le service au quotidien ; le récit ne prétend pas qu'il cuisine simultanément dans ses trois restaurants.

Citation de marque inventée pour le personnage : « Un beau produit n'a pas besoin de bruit autour de lui. »

## Mission, expérience et ton

**Mission :** faire découvrir la diversité savoyarde par une cuisine de saison lisible, et donner autant de soin à l'accueil qu'à l'assiette.

La maison s'adresse aux Chambériens qui souhaitent un déjeuner soigné, aux couples et familles réunis autour d'un repas, ainsi qu'aux visiteurs curieux du territoire. Le midi peut être plus bref, le dîner plus posé ; l'exigence culinaire reste la même.

Dans le décor fictif : bois, pierre, lumière douce, tables dégagées, quelques touches végétales. Le service est attentif et naturel. Le récit privilégie des gestes concrets : une cuisson douce, un jus réduit, une pâte croustillante, un fromage servi à bonne température.

Le vocabulaire de marque est simple : maison, marché, saison, assiette, jus, partager, accueillir. Éviter les superlatifs accumulés, les prétentions « meilleur restaurant », « chef étoilé », les avis clients fabriqués, les logos de labels et les partenariats non établis. Aucun pourcentage de produits locaux ou engagement de certification n'est inventé.

Les allergies sont recueillies pendant la réservation. Le site ne promet pas une cuisine sans traces d'allergènes ni une adaptation systématique de tous les plats.

## Prix : étude et décision

Repères consultés le 18 septembre 2026, indicatifs et non assimilables à un audit de rentabilité :

| Établissement réel | Observation publiée | Lecture pour notre positionnement |
| --- | --- | --- |
| Bistrot du Verger, Chambéry [S8] | Carte datée septembre 2026 : déjeuner complet 24 €, plats courants 20-26 €, desserts 8 € | Base de comparaison pour une cuisine de bistrot travaillée. |
| Café de Lyon, Chambéry [S9] | Menu à 29,90 €, plat végétarien à 19 € | Un déjeuner autour de 29 € est crédible, mais notre formule à deux éléments est plus chère relativement. |
| Carré des Sens, fiche Gault&Millau 2026 [S10] | Formules publiées de 25 à 60 €, dont trois plats à 39 € | Un menu à 42 € se situe dans une gamme intermédiaire soignée. Source de guide, à distinguer d'un prix confirmé directement par le restaurateur. |

La page du Bistrot Maison de Savoie présentait des informations tarifaires différentes entre l'index de recherche et la page ouverte : elle a été écartée du benchmark chiffré. Les prix et horaires des concurrents servent de comparaison, pas de données à copier.

**Décision : conserver les prix déjà définis dans `SeedProductionCommand.php`.** Ils sont cohérents avec la maison imaginée et évitent une divergence gratuite avec l'administration. Ce sont les valeurs locales d'initialisation, pas une vérification de la base de production.

| Offre du projet | Prix de référence | Composition ou portée |
| --- | --- | --- |
| Menu du Midi | 29 € | Plat du marché et dessert, du mardi au vendredi midi |
| Menu Découverte | 42 € | Entrée, plat et dessert autour des produits de Savoie |
| Entrées | 14-18 € | Velouté de champignons ; tartare de truite |
| Plats | 24-28 € | Ravioles forestières ; filet de féra |
| Desserts | 11-12 € | Tarte aux myrtilles ; crémeux chocolat |

La formule à 29 € suppose une qualité d'accueil et d'assiette supérieure à une formule de brasserie courante. Le menu à 42 € propose des choix composés par le chef : il ne signifie pas que toute combinaison de plats à la carte est incluse. Le prix d'un repas complet à la carte est distinct du prix d'un menu.

Pistes saisonnières, uniquement éditoriales : asperges et herbes au printemps ; courgette et petits fruits en été ; champignons, courge et poire à l'automne ; légumes racines, bouillons et pommes au four en hiver. Toute concrétisation doit passer par les catégories, plats et menus administrés.

## Horaires et capacité

| Jours | Déjeuner | Dîner |
| --- | --- | --- |
| Lundi | Fermé | Fermé |
| Mardi à dimanche | 12h00-14h00 | 19h00-21h00 |

Ces plages de deux heures sont celles de l'initialisation actuelle et respectent le CDC. Les ouvertures restent administrables ; les jours ne le sont pas. Les créneaux de réservation suivent un pas de quinze minutes, borne finale comprise conformément à l'exemple du CDC. Le site les nomme « horaires de service » pour ne pas inventer une heure distincte d'évacuation de la salle.

La capacité est gérée par l'administration : ne pas annoncer arbitrairement « 30 couverts » ou « 40 places » dans l'histoire. Ne pas promettre de dérogations les jours fériés, que le modèle actuel ne sait pas représenter.

## Traduction visuelle et éditoriale

Conserver le vert profond de la branche appréciée par l'utilisateur, le bordeaux pour la réservation et un ocre lisible pour les petits repères. Ouvrir davantage les sections sur du blanc minéral. Le vert renvoie aux reliefs et à la salle, le bordeaux aux coteaux, les filets sobres aux menus imprimés. La couleur ne doit pas remplacer la lisibilité : titres sombres sur fond clair, accents plus lumineux sur fond foncé.

Conserver Playfair Display pour la marque et les titres éditoriaux, Hind Madurai pour les textes et contrôles. La divergence par rapport à Montserrat dans la charte initiale est une décision explicite de la refonte, à reporter dans le dossier de soutenance si cette direction est retenue.

Ordre de l'accueil :

1. Quai Antique, la signature et deux accès directs : réserver ou voir les menus.
2. La maison : troisième adresse, ouverture fictive en 2024, ancrage chambérien.
3. Le chef : parcours court et trois repères chronologiques.
4. Le territoire : Bauges, marché, eaux et coteaux, présentés en trois rubriques.
5. Les menus : données et prix récupérés depuis l'API, comme sur la page Menus.
6. La galerie, immédiatement suivie d'un appel à réserver.
7. À table : ambiance du lieu, informations pratiques et accueil des allergies.
8. Footer : rappel de marque, jours et services, mention discrète du caractère fictif du projet.

Les photos du dépôt sont des illustrations, pas des preuves d'une adresse réelle, d'un portrait authentique d'Arnaud Michant ou de l'origine d'un plat. Le filet rose photographié n'est notamment pas renommé « féra du Bourget ». La galerie administrée conserve ses vrais titres. Aucune image de concurrents n'est réutilisée.

## Impacts et dépendances vérifiés

| Sujet | Source technique | Choix appliqué ou limite constatée |
| --- | --- | --- |
| Identité narrative | Ce dossier et `pages/home.html` | Fiction originale, mention dans le footer, aucun nom de fournisseur réel présenté comme partenaire. |
| Prix de l'accueil | `GET /api/menus` ; même source que `js/menu.js` | Pas de prix commercial en dur dans l'accueil. Une API indisponible n'affiche pas de faux tarifs actuels. |
| Horaires du footer et réservations | `GET /api/restaurants/1` ; `js/restaurant.js` | Une même lecture des plages configurées ; les créneaux du formulaire ne restent plus bloqués sur les horaires d'initialisation. |
| Lundi | `BookingController::isOpenAt` et `BookingControllerTest::testRestaurantIsClosedOnMonday` | Déjà refusé côté API ; inutile de réinventer une règle backend. Le formulaire l'indique aussi. |
| Galerie | `GET /api/restaurants/1/pictures` | Aperçu plafonné à trois photos ; images du dépôt uniquement en secours d'une indisponibilité. |
| Navigation longue | Routeur et liens de l'accueil | Retour en haut lors d'un changement de page et indication de la page active ; liens d'ancre conservés. |
| Administration | Plats, menus, galerie, capacité, horaires | Aucune mutation de données de production ni modification du modèle relationnel pour cette identité. |

Constats hors de cette modification : le CDC demande des plats rangés par catégories, des descriptions détaillant les choix des menus et une capacité évaluée sur tout un service. Ces points doivent faire l'objet d'une recette métier dédiée ; ce dossier ne les présente pas comme validés par la seule refonte. La source d'initialisation propose actuellement des descriptions de menus très courtes.

Pour chaque évolution : identifier les pages consommatrices et la source de la donnée, relire la contrainte du CDC, vérifier les états vide/erreur et les droits concernés, puis tester le parcours affecté. Une modification d'horaire ou de prix n'est pas seulement une modification de texte.

La recette locale est consignée dans `TESTING.md` : compilation et contrôles de syntaxe réussis, huit parcours automatisés réussis avec réponses API simulées, accueil contrôlé sur quatre largeurs d'écran. Cela ne remplace pas une recette sur l'API réelle avant publication. Aucun changement n'a été déployé.

## Sources externes

Consultées le 18 septembre 2026. Les faits ci-dessus sont résumés ; aucun récit ni texte marketing d'un établissement n'est repris.

- **S1** : [Ville de Chambéry, les marchés](https://www.chambery.fr/64-les-marches.htm). Marché couvert, accès et commerces alimentaires.
- **S2** : [Ville de Chambéry, place du Palais de Justice](https://www.chambery.fr/545-amenagement-de-la-place-du-palais-de-justice-robert-badinter.htm). Situation dans le centre et en bord de Leysse.
- **S3** : [Chambéry Montagnes, centre historique](https://www.chamberymontagnes.com/que-faire/visites-culture-patrimoine/centre-historique-de-chambery-chambery-fr-5783264/). Allées, cours et portiques.
- **S4** : [INAO, Tome des Bauges](https://www.inao.gouv.fr/node/1941/printable/pdf). Produit AOP et aire de production.
- **S5** : [Chambéry Montagnes, gastronomie](https://www.chamberymontagnes.com/preparer/gastronomie/). Répertoire régional, poissons, fromages et légumes.
- **S6** : [Chambéry Montagnes, producteurs locaux](https://www.chamberymontagnes.com/preparer/savoir-faire-local/producteurs-locaux/). Familles de produits et cépages régionaux.
- **S7** : [Chambéry Montagnes, spécialités culinaires](https://www.chamberymontagnes.com/decouvrir/specialites-culinaires/). Matouille, gâteau des Bauges et vermouth.
- **S8** : [Bistrot du Verger, carte de septembre 2026](https://www.bistrotduverger.fr/). Comparaison de prix, site de l'établissement.
- **S9** : [Café de Lyon, carte](https://www.lecafedelyon.com/). Comparaison de prix, site de l'établissement.
- **S10** : [Gault&Millau, Carré des Sens, avis 2026](https://fr.gaultmillau.com/fr/restaurants/carre-des-sens-restaurant). Comparaison complémentaire, source de guide.
