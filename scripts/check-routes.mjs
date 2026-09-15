import { existsSync } from "node:fs";
import { join } from "node:path";
import { allRoutes } from "../Router/allRoutes.js";

const validRoles = new Set(["disconnected", "client", "admin"]);
const routeUrls = new Set();
const errors = [];

for (const route of allRoutes) {
  if (routeUrls.has(route.url)) {
    errors.push(`Route declaree en double : ${route.url}`);
  }

  routeUrls.add(route.url);

  if (!route.url.startsWith("/")) {
    errors.push(`Route invalide, elle doit commencer par / : ${route.url}`);
  }

  if (!existsSync(join(process.cwd(), route.pathHtml.replace(/^\//, "")))) {
    errors.push(`Fichier HTML introuvable pour ${route.url} : ${route.pathHtml}`);
  }

  if (route.pathJS && !existsSync(join(process.cwd(), route.pathJS.replace(/^\//, "")))) {
    errors.push(`Script introuvable pour ${route.url} : ${route.pathJS}`);
  }

  for (const role of route.authorize) {
    if (!validRoles.has(role)) {
      errors.push(`Role inconnu sur ${route.url} : ${role}`);
    }
  }
}

for (const requiredRoute of ["/", "/galerie", "/lacarte", "/signin", "/signup", "/account", "/allresa", "/reserver", "/admin"]) {
  if (!routeUrls.has(requiredRoute)) {
    errors.push(`Route attendue manquante : ${requiredRoute}`);
  }
}

if (errors.length > 0) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log(`${allRoutes.length} routes verifiees.`);
