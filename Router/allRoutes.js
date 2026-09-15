import Route from "./Route.js";

//Définir ici vos routes
export const allRoutes = [
    new Route("/", "Accueil", "/pages/home.html", []),
    new Route("/galerie", "La galerie", "/pages/galerie.html", [], "/js/galerie.js"),
    new Route("/lacarte", "La carte", "/pages/lacarte.html", [], "/js/lacarte.js"),
    new Route("/signin", "Connexion", "/pages/auth/signin.html", ["disconnected"], "/js/auth/signin.js"),
    new Route("/signup", "Inscription", "/pages/auth/signup.html", ["disconnected"], "/js/auth/signup.js"),
    new Route("/account", "Mon compte", "/pages/auth/account.html", ["client", "admin"], "/js/auth/account.js"),
    new Route("/editPassword", "Changement de mot de passe", "/pages/auth/editPassword.html", ["client", "admin"], "/js/auth/editPassword.js"),
    new Route("/allresa", "Vos réservations", "/pages/reservations/allResa.html", ["client", "admin"], "/js/reservations/allResa.js"),
    new Route("/reserver", "Réserver", "/pages/reservations/reserver.html", ["client", "admin"], "/js/reservations/reserver.js"),
    new Route("/admin", "Administration", "/pages/admin.html", ["admin"], "/js/admin.js"),
];

//Le titre s'affiche comme ceci : Route.titre - websitename
export const websiteName = "Quai Antique";
