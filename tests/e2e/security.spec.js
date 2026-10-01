import { readFileSync } from "node:fs";
import { test, expect } from "@playwright/test";

const bootstrap = readFileSync(new URL("../../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js", import.meta.url));
const pixel = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/iRsAAAAASUVORK5CYII=";

async function navigateApp(page, path) {
  await page.goto(path, { waitUntil: "commit" });
  await page.waitForFunction(() => typeof window.route === "function");
  await page.waitForFunction(() => document.querySelector("#main-page")?.childElementCount > 0);
}

test.beforeEach(async ({ page }) => {
  await page.route(url => new URL(url).hostname !== "127.0.0.1", route =>
    route.request().url().includes("bootstrap.bundle.min.js")
      ? route.fulfill({ contentType: "text/javascript", body: bootstrap }) : route.abort());
});

test("API photo titles remain text in home, gallery and admin attributes", async ({ page }) => {
  const title = '" onload="document.body.dataset.injected=1" data-x="<b>Test</b> & \'photo\'';
  await page.addInitScript(() => {
    document.cookie = "accesstoken=test-admin; path=/";
    document.cookie = "role=admin; path=/";
  });
  await page.route("**/api/restaurants/1/pictures", route => route.fulfill({
    json: { pictures: [{ id: 42, title, imageUrl: pixel }] }
  }));
  await navigateApp(page, "/");
  await expect(page.locator("#homeGallery img")).toHaveAttribute("alt", title);
  await expect(page.locator("#homeGallery [onload], #homeGallery b")).toHaveCount(0);
  await navigateApp(page, "/galerie");
  await expect(page.locator("#allImages img")).toHaveAttribute("alt", title);
  await expect(page.locator("#allImages [onload], #allImages b")).toHaveCount(0);
  await expect(page.locator("[data-edit-picture]")).toHaveAttribute("data-title", title);
  await page.locator("[data-edit-picture]").click();
  await expect(page.locator("#NamePhotoInput")).toHaveValue(title);
  await expect(page.locator("body")).not.toHaveAttribute("data-injected", "1");
});

test("image URL policy rejects script, SVG and third-party origins", async ({ page }) => {
  await navigateApp(page, "/");
  await page.waitForFunction(() => typeof window.apiAssetUrl === "function");
  const results = await page.evaluate(pixel => ({
    rejected: ["javascript:alert(1)", "data:image/svg+xml;base64,PHN2Zz4=", "https://external.example/image.jpg", "//external.example/image.jpg"].map(window.apiAssetUrl),
    accepted: [pixel, "/images/example.jpg", "http://127.0.0.1:8000/uploads/example.jpg"].map(window.apiAssetUrl)
  }), pixel);
  expect(results.rejected).toEqual(["", "", "", ""]);
  expect(results.accepted).toEqual([pixel, "/images/example.jpg", "http://127.0.0.1:8000/uploads/example.jpg"]);
});

test("login remember-me and logout follow API session expiry and revocation", async ({ page, context }) => {
  const token = "a".repeat(64);
  const expiry = new Date(Date.now() + 7 * 86400000).toISOString();
  let loginBody;
  let revokedToken;
  await page.route("**/api/login", route => {
    loginBody = route.request().postDataJSON();
    return route.fulfill({ json: { apiToken: token, expiresAt: expiry, roles: ["ROLE_USER"] } });
  });
  await page.route("**/api/logout", route => {
    revokedToken = route.request().headers()["x-auth-token"];
    return route.fulfill({ json: { message: "OK" } });
  });
  await navigateApp(page, "/signin");
  await page.locator("#MailInput").fill("test@example.test");
  await page.locator("#PasswordInput").fill("test-password-long");
  await page.locator("#exampleCheck1").check();
  await page.locator("#btnSignin").click();
  await expect(page).toHaveURL("/");
  expect(loginBody.rememberMe).toBe(true);
  const session = (await context.cookies()).find(cookie => cookie.name === "accesstoken");
  expect(session.value).toBe(token);
  expect(Math.abs(session.expires - Date.parse(expiry) / 1000)).toBeLessThan(2);
  expect(session.sameSite).toBe("Lax");
  await page.locator("#signout-btn").click();
  await expect(page).toHaveURL("/signin");
  expect(revokedToken).toBe(token);
  expect((await context.cookies()).some(cookie => cookie.name === "accesstoken")).toBe(false);
});

test("expired sessions are cleared and local logout works while the API is unavailable", async ({ page, context }) => {
  await navigateApp(page, "/");
  await page.waitForFunction(() => typeof window.setToken === "function");
  await page.evaluate(() => {
    window.setCookie("accesstoken", "old-token", 1);
    window.setCookie("sessionExpiresAt", "2000-01-01T00:00:00Z", 1);
  });
  expect(await page.evaluate(() => window.getToken())).toBeNull();
  await page.evaluate(() => window.setToken("b".repeat(64), new Date(Date.now() + 3600000).toISOString()));
  await page.route("**/api/logout", route => route.abort());
  await page.evaluate(() => window.signout());
  await expect(page).toHaveURL("/signin");
  expect((await context.cookies()).some(cookie => cookie.name === "accesstoken")).toBe(false);
});

test("a protected API 401 clears the session and redirects to sign-in", async ({ page, context }) => {
  await navigateApp(page, "/");
  await page.waitForFunction(() => typeof window.setToken === "function");
  await page.evaluate(() => {
    window.setToken("c".repeat(64), new Date(Date.now() + 3600000).toISOString());
    window.setCookie("role", "client", 1);
  });
  await page.route("**/api/account/me", route => route.fulfill({ status: 401, json: { message: "Expired" } }));
  await navigateApp(page, "/account");
  await expect(page).toHaveURL(/\/signin\?redirect=%2Faccount/);
  expect((await context.cookies()).some(cookie => cookie.name === "accesstoken")).toBe(false);
});

test("unknown routes return an HTTP 404 while known SPA routes remain available", async ({ request }) => {
  const missing = await request.get("/this-route-does-not-exist");
  expect(missing.status()).toBe(404);
  const known = await request.get("/galerie");
  expect(known.status()).toBe(200);
});
