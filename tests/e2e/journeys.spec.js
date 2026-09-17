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
