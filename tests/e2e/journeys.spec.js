import { readFileSync } from "node:fs";
import { test, expect } from "@playwright/test";

const bootstrap = readFileSync(new URL("../../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js", import.meta.url));

test.beforeEach(async ({ page }) => {
  await page.route(url => new URL(url).hostname !== "127.0.0.1", route =>
    route.request().url().includes("bootstrap.bundle.min.js")
      ? route.fulfill({ contentType: "text/javascript", body: bootstrap })
      : route.abort()
  );
});

test("navigation, reservation et compte anonyme", async ({ page }) => {
  await page.goto("/", { waitUntil: "commit" });
  await expect(page.getByRole("heading", { name: "Quai Antique", level: 1 })).toBeVisible();
  await page.locator(".hero-scene a[href='/reserver']").click();
  await expect(page).toHaveURL(/\/signin\?redirect=%2Freserver$/);
  await expect(page.getByRole("heading", { name: "Connexion" })).toBeVisible();

  await page.goto("/account", { waitUntil: "commit" });
  await expect(page).toHaveURL(/\/signin\?redirect=%2Faccount$/);
  await page.goto("/galerie", { waitUntil: "commit" });
  await expect(page.getByRole("heading", { name: "Galerie" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Ajouter une photo" })).toBeHidden();
});

test("la carte, les menus, la galerie d'accueil et les horaires", async ({ page }) => {
  await page.route("**/api/restaurants/1/pictures", route => route.fulfill({
    contentType: "application/json",
    body: JSON.stringify({ pictures: [
      { id: 1, title: "Soupe maison", imageUrl: "/images/gallery-preview/soupe-oignon.jpg" },
      { id: 2, title: "Poisson du jour", imageUrl: "/images/gallery-preview/filet-poisson.jpg" },
      { id: 3, title: "Tarte tatin", imageUrl: "/images/gallery-preview/tarte-tatin.jpg" }
    ] })
  }));
  await page.route("**/api/restaurants/1", route => route.fulfill({
    contentType: "application/json",
    body: JSON.stringify({ amOpeningTime: ["12:00", "14:00"], pmOpeningTime: ["19:00", "21:00"] })
  }));
  await page.route("**/api/foods", route => route.fulfill({
    contentType: "application/json",
    body: JSON.stringify({ foods: [{ title: "Truite de Savoie", description: "Légumes de saison", price: 24 }] })
  }));
  await page.route("**/api/menus", route => route.fulfill({
    contentType: "application/json",
    body: JSON.stringify({ menus: [{ title: "Menu Découverte", description: "Entrée, plat et dessert", price: 47 }] })
  }));

  await page.goto("/", { waitUntil: "commit" });
  await expect(page.locator("#homeGallery img")).toHaveCount(3);
  await expect(page.locator("#homeMenus .home-menu-title p")).toHaveText(/47,00\s*€/);
  await expect(page.locator(".footer-hours dd[data-service-hours]")).toHaveCount(6);
  await expect(page.locator(".footer-hours dd[data-service-hours]").first()).toHaveText("12h00–14h00 · 19h00–21h00");

  await page.getByRole("link", { name: "La carte", exact: true }).first().click();
  await expect(page.getByRole("heading", { name: "La carte", level: 1 })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Truite de Savoie" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Menu Découverte" })).toHaveCount(0);

  await page.getByRole("link", { name: "Menus", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Les menus", level: 1 })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Menu Découverte" })).toBeVisible();
  await expect(page.locator("#menusList .carte-price")).toHaveText("47.00 €");
  await expect(page.getByRole("link", { name: "Menus", exact: true })).toHaveAttribute("aria-current", "page");
  await expect(page.getByRole("heading", { name: "Truite de Savoie" })).toHaveCount(0);
  await page.locator("footer .footer-brand").click();
  await expect(page.getByRole("heading", { name: "Quai Antique", level: 1 })).toBeVisible();
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
});

test("les créneaux et le footer suivent les horaires administrés, le lundi reste fermé", async ({ page }) => {
  await page.addInitScript(() => {
    document.cookie = "accesstoken=test-client; path=/";
    document.cookie = "role=client; path=/";
  });
  await page.route("**/api/restaurants/1", route => route.fulfill({
    contentType: "application/json",
    body: JSON.stringify({ amOpeningTime: ["11:30", "13:30"], pmOpeningTime: ["18:30", "20:30"] })
  }));
  await page.route("**/api/account/me", route => route.fulfill({
    contentType: "application/json",
    body: JSON.stringify({ firstName: "Camille", lastName: "Test", guestNumber: 2 })
  }));
  let availabilityFails = false;
  await page.route("**/api/bookings/availability?**", route => route.fulfill({
    status: availabilityFails ? 503 : 200,
    contentType: "application/json",
    body: JSON.stringify({ available: true, remaining: 12 })
  }));

  await page.goto("/reserver", { waitUntil: "commit" });
  await expect(page.locator("#selectHour option")).toHaveCount(18);
  await expect(page.locator("#selectHour option").first()).toHaveText("11:30");
  await expect(page.locator("#selectHour option").last()).toHaveText("20:30");
  await expect(page.locator("[data-service-hours]").first()).toHaveText("11h30–13h30 · 18h30–20h30");
  await page.getByLabel("Date", { exact: true }).fill("2030-01-08");
  await expect(page.locator("#bookingSubmitBtn")).toBeEnabled();
  await page.getByLabel("Date", { exact: true }).fill("2030-01-07");
  await expect(page.locator("#availabilityMessage")).toContainText("fermé le lundi");
  await expect(page.locator("#bookingSubmitBtn")).toBeDisabled();

  availabilityFails = true;
  await page.getByLabel("Date", { exact: true }).fill("2030-01-08");
  await expect(page.locator("#availabilityMessage")).toContainText("Disponibilité impossible à vérifier");
  await expect(page.locator("#bookingSubmitBtn")).toBeDisabled();
});

test("les horaires indisponibles ne créent pas de faux créneaux", async ({ page }) => {
  await page.addInitScript(() => {
    document.cookie = "accesstoken=test-client; path=/";
    document.cookie = "role=client; path=/";
  });
  await page.route("**/api/restaurants/1", route => route.fulfill({ status: 503, body: "" }));
  await page.goto("/reserver", { waitUntil: "commit" });
  await expect(page.locator("#reservationMessage")).toContainText("horaires ne sont pas disponibles");
  await expect(page.locator("#selectHour")).toBeDisabled();
  await expect(page.locator("#selectHour option")).toHaveCount(0);
  await expect(page.locator("#bookingSubmitBtn")).toBeDisabled();
  await expect(page.locator("#serviceHoursNote")).toBeVisible();
});

test("l'accueil distingue les menus vides et indisponibles sans inventer de prix", async ({ page }) => {
  let fails = false;
  await page.route("**/api/menus", route => route.fulfill({
    status: fails ? 503 : 200,
    contentType: "application/json",
    body: JSON.stringify({ menus: [] })
  }));
  await page.goto("/", { waitUntil: "commit" });
  await expect(page.locator("#homeMenus")).toContainText("Le chef prépare les prochains menus");
  await expect(page.locator("#homeMenus .home-menu-item")).toHaveCount(0);
  fails = true;
  await page.reload({ waitUntil: "commit" });
  await expect(page.locator("#homeMenus")).toContainText("Les menus ne sont pas disponibles");
  await expect(page.locator("#homeMenus .home-menu-item")).toHaveCount(0);
});

test("l'accueil affiche uniquement les photos API et les actualise au retour", async ({ page }) => {
  const imageUrl = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/iRsAAAAASUVORK5CYII=";
  let title = "Dernière photo en base";
  let requests = 0;
  await page.route("**/api/restaurants/1/pictures", route => {
    requests++;
    return route.fulfill({ json: { pictures: Array.from({ length: 4 }, (_, id) => ({ id, title: id === 0 ? title : `Photo API ${id}`, imageUrl })) } });
  });
  await page.goto("/", { waitUntil: "commit" });
  await expect(page.locator("#homeGallery img")).toHaveCount(3);
  await expect(page.locator("#homeGallery img").first()).toHaveAttribute("src", imageUrl);
  await expect(page.locator("#homeGallery img").first()).toHaveAttribute("alt", title);
  await page.locator("#homeGallery a").first().click();
  await expect(page).toHaveURL(/\/galerie$/);
  title = "Photo renommée en base";
  const previousRequests = requests;
  await page.locator("header .navbar-brand").click();
  await expect(page.locator("#homeGallery img").first()).toHaveAttribute("alt", title);
  expect(requests).toBeGreaterThan(previousRequests);
});

test("la galerie vide ou indisponible ne remplace jamais les photos par des images locales", async ({ page }) => {
  let status = 200;
  let body = { pictures: [] };
  await page.route("**/api/restaurants/1/pictures", route => route.fulfill({ status, json: body }));
  await page.goto("/", { waitUntil: "commit" });
  await expect(page.locator("#homeGallery")).toContainText("arrivent bientôt");
  await expect(page.locator("#homeGallery img")).toHaveCount(0);
  for(const invalidResponse of [false, true]){
    status = invalidResponse ? 200 : 503;
    body = invalidResponse ? {} : { pictures: [] };
    await page.reload({ waitUntil: "commit" });
    await expect(page.locator("#homeGallery")).toContainText("momentanément indisponible");
    await expect(page.locator("#homeGallery img")).toHaveCount(0);
    await expect(page.locator("#homeGallery")).toHaveAttribute("aria-busy", "false");
  }
});

test("le fond reste fixe et les sections claires restent translucides sur mobile et ordinateur", async ({ page }) => {
  await page.goto("/", { waitUntil: "commit" });
  await expect(page.locator(".house-introduction")).toBeVisible();
  for(const width of [320, 390, 768, 1440]){
    await page.setViewportSize({ width, height: 900 });
    await page.locator(".house-visit").scrollIntoViewIfNeeded();
    const styles = await page.evaluate(() => {
      const background = getComputedStyle(document.body, "::before");
      return {
        position: background.position,
        top: background.top,
        image: background.backgroundImage,
        sections: [".house-introduction", ".chef-story", ".home-menus", ".house-visit"].map(selector => getComputedStyle(document.querySelector(selector)).backgroundColor),
        overflow: document.documentElement.scrollWidth > innerWidth,
      };
    });
    expect(styles.position).toBe("fixed");
    expect(styles.top).toBe("0px");
    expect(styles.image).toContain("FondHeroScene.jpg");
    expect(styles.sections.every(color => color.startsWith("rgba("))).toBe(true);
    expect(styles.overflow).toBe(false);
  }
});

test("menu mobile Bootstrap", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/", { waitUntil: "commit" });
  const toggle = page.getByRole("button", { name: "Toggle navigation" });
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-expanded", "true");
  await page.getByRole("link", { name: "Galerie", exact: true }).click();
  await expect(page).toHaveURL(/\/galerie$/);
});

test("un administrateur ne voit pas la page compte", async ({ page }) => {
  await page.addInitScript(() => {
    document.cookie = "accesstoken=test-admin; path=/";
    document.cookie = "role=admin; path=/";
  });
  await page.goto("/account", { waitUntil: "commit" });
  await expect(page).toHaveURL("/");
  await expect(page.getByRole("link", { name: "Administration" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Mon compte" })).toBeHidden();
});

test("la galerie admin ajoute, renomme et supprime une photo", async ({ page }) => {
  await page.addInitScript(() => {
    document.cookie = "accesstoken=test-admin; path=/";
    document.cookie = "role=admin; path=/";
  });
  const pictures = [];
  const imageUrl = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/iRsAAAAASUVORK5CYII=";
  await page.route("**/api/restaurants/1/pictures**", async route => {
    const request = route.request();
    const method = request.method();
    const id = Number(new URL(request.url()).pathname.split("/").at(-1));
    let body;
    if (method === "POST") {
      expect(request.headers()["x-auth-token"]).toBe("test-admin");
      expect(request.headers()["content-type"]).toContain("multipart/form-data");
      pictures.push({ id: 1, title: "Photo test", imageUrl });
      body = { picture: pictures[0] };
    } else if (method === "PUT") {
      pictures[0].title = JSON.parse(request.postData()).title;
      body = { picture: pictures[0] };
    } else if (method === "DELETE") {
      expect(id).toBe(1);
      pictures.pop();
      body = { message: "supprimé" };
    } else {
      body = { pictures, total: pictures.length };
    }
    await route.fulfill({ status: method === "POST" ? 201 : 200, contentType: "application/json", body: JSON.stringify(body) });
  });

  await page.goto("/galerie", { waitUntil: "commit" });
  await page.getByRole("button", { name: "Ajouter une photo" }).click();
  await page.getByLabel("Titre", { exact: true }).fill("Photo test");
  await page.getByLabel("Image", { exact: true }).setInputFiles({ name: "photo.png", mimeType: "image/png", buffer: Buffer.from(imageUrl.split(",")[1], "base64") });
  await page.getByRole("button", { name: "Enregistrer" }).click();
  await expect(page.locator("#allImages img")).toHaveCount(1);
  await page.getByRole("button", { name: "Modifier Photo test" }).click();
  await page.getByLabel("Titre", { exact: true }).fill("Photo corrigée");
  await page.getByRole("button", { name: "Enregistrer" }).click();
  await expect(page.getByRole("button", { name: "Supprimer Photo corrigée" })).toBeVisible();
  await page.getByRole("button", { name: "Supprimer Photo corrigée" }).click();
  await page.locator("#confirmDeletePictureBtn").click();
  await expect(page.locator("#allImages img")).toHaveCount(0);
});
