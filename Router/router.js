import Route from "./Route.js";
import { allRoutes, websiteName } from "./allRoutes.js";

// Création d'une route pour la page 404 (page introuvable)
const route404 = new Route("404", "Page introuvable", "/pages/404.html", []);

// Fonction pour récupérer la route correspondant à une URL donnée
const getRouteByUrl = (url) => {
  let currentRoute = null;
  // Parcours de toutes les routes pour trouver la correspondance
  allRoutes.forEach((element) => {
    if (element.url == url) {
      currentRoute = element;
    }
  });
  // Si aucune correspondance n'est trouvée, on retourne la route 404
  if (currentRoute != null) {
    return currentRoute;
  } else {
    return route404;
  }
};

// Fonction pour charger le contenu de la page
const LoadContentPage = async () => {
 const path = window.location.pathname;
  // Récupération de l'URL actuelle
  const actualRoute = getRouteByUrl(path);

  //Vérifier les droits d'accès à la page
  const allRolesArray = actualRoute.authorize;

  if(allRolesArray.length > 0){
    if(allRolesArray.includes("disconnected")){
      if(isConnected()){
        window.location.replace("/");
        return;
      }
    }
    else{
      if(!isConnected()){
        window.location.replace(`/signin?redirect=${encodeURIComponent(path)}`);
        return;
      }

      const roleUser = getRole();
      if(!allRolesArray.includes(roleUser)){
        window.location.replace("/");
        return;
      }
    }
  }

  // Récupération du contenu HTML de la route
  const html = await fetch(actualRoute.pathHtml + "?v=" + Date.now()).then((data) => data.text());
  // Ajout du contenu HTML à l'élément avec l'ID "main-page"
  document.getElementById("main-page").innerHTML = html;

  // Ajout du contenu JavaScript
  if (actualRoute.pathJS != "") {
    const oldPageScript = document.getElementById("page-script");

    if(oldPageScript){
      oldPageScript.remove();
    }

    // Création d'une balise script
    var scriptTag = document.createElement("script");
    scriptTag.setAttribute("id", "page-script");
    scriptTag.setAttribute("type", "module");
    scriptTag.setAttribute("src", actualRoute.pathJS + "?v=" + Date.now());

    // Ajout de la balise script au corps du document
    document.querySelector("body").appendChild(scriptTag);
  }

  // Changement du titre de la page
  document.title = actualRoute.title + " - " + websiteName;

  //Afficher et masquer les éléments en fonction du rôle
  showAndHideElementsForRoles();
};

// Fonction pour gérer les événements de routage (clic sur les liens)
const routeEvent = (event) => {
  event = event || window.event;
  event.preventDefault();

  const link = event.target.closest("a");

  if(!link){
    return;
  }

  // Mise à jour de l'URL dans l'historique du navigateur
  window.history.pushState({}, "", link.href);
  // Chargement du contenu de la nouvelle page
  LoadContentPage();
};

document.addEventListener("click", (event) => {
  const link = event.target.closest("a");

  if(!link || link.target === "_blank" || link.hasAttribute("download")){
    return;
  }

  const url = new URL(link.href, window.location.origin);

  if(url.origin !== window.location.origin || url.hash || link.getAttribute("href") === "#"){
    return;
  }

  routeEvent(event);
});

// Gestion de l'événement de retour en arrière dans l'historique du navigateur
window.onpopstate = LoadContentPage;
// Assignation de la fonction routeEvent à la propriété route de la fenêtre
window.route = routeEvent;
// Chargement du contenu de la page au chargement initial
LoadContentPage();
