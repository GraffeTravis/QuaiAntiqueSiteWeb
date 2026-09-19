import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import { chromium, expect as baseExpect } from "@playwright/test";
import { allRoutes } from "../Router/allRoutes.js";

const baseURL = process.argv[2];
const expect = baseExpect.configure({ timeout: 30000 });
assert(baseURL, "Usage: npm run test:release -- <URL> [--proxy-local-api]");
const origin = new URL(baseURL).origin;
const proxyLocalApi = process.argv.includes("--proxy-local-api");
assert(!proxyLocalApi || new URL(origin).hostname === "127.0.0.1", "Proxy limited to local tests");
const api = "https://quai-antique-api-21f25094150b.herokuapp.com";
const report = { date: new Date().toISOString(), origin, proxyLocalApi, checks: [], errors: [] };
const output = `test-results/release-${new URL(origin).hostname}`;
await mkdir(output, { recursive: true });
let browser;

async function check(name, action) {
  await action();
  report.checks.push(name);
  console.log(`PASS ${name}`);
}

try {
  const data = {};
  for (const endpoint of ["menus", "foods", "restaurants/1", "restaurants/1/pictures"]) {
    await check(`API ${endpoint}`, async () => {
      const response = await fetch(`${api}/api/${endpoint}`, { headers: { Origin: origin } });
      assert.equal(response.status, 200);
      if (!proxyLocalApi) assert.equal(response.headers.get("access-control-allow-origin"), origin);
      data[endpoint] = await response.json();
    });
  }
  for (const path of ["/index.html", "/scss/main.css", "/js/home.js", "/js/restaurant.js", "/Router/router.js", ...allRoutes.map(route => route.pathHtml)]) {
    await check(`HTTP ${path}`, async () => {
      const response = await fetch(origin + path);
      assert.equal(response.status, 200);
      assert.match(response.headers.get("content-type"), path.endsWith(".html") ? /text\/html/ : path.endsWith(".css") ? /text\/css/ : /javascript/);
    });
  }

  browser = await chromium.launch({ channel: process.platform === "win32" ? "msedge" : undefined });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  // Production checks are strictly read-only, including unexpected background requests.
  await context.route("**/*", async route => {
    const request = route.request();
    if (!["GET", "HEAD", "OPTIONS"].includes(request.method())) {
      report.errors.push(`Blocked mutation: ${request.method()} ${request.url()}`);
      return route.abort();
    }
    if (proxyLocalApi && request.url().startsWith("http://127.0.0.1:8000/")) {
      const response = await fetch(request.url().replace("http://127.0.0.1:8000", api));
      return route.fulfill({ status: response.status, contentType: response.headers.get("content-type"), body: Buffer.from(await response.arrayBuffer()), headers: { "access-control-allow-origin": origin } });
    }
    return route.continue();
  });
  const page = await context.newPage();
  page.setDefaultTimeout(60000);
  page.on("pageerror", error => report.errors.push(error.message));
  page.on("console", message => { if (message.type() === "error") report.errors.push(message.text()); });
  page.on("response", response => { if (response.status() >= 400) report.errors.push(`HTTP ${response.status()} ${response.url()}`); });
  page.on("requestfailed", request => {
    if (!request.failure()?.errorText.includes("ERR_ABORTED")) report.errors.push(`${request.failure()?.errorText} ${request.url()}`);
  });

  const headings = { "/": "Quai Antique", "/galerie": "Galerie", "/lacarte": "La carte", "/menu": "Les menus", "/signin": "Connexion", "/signup": "Inscription" };
  for (const route of allRoutes) {
    await check(`Browser direct route ${route.url}`, async () => {
      await page.goto(origin + route.url, { waitUntil: "domcontentloaded" });
      if (route.authorize.length && !route.authorize.includes("disconnected")) {
        await expect(page).toHaveURL(`${origin}/signin?redirect=${encodeURIComponent(route.url)}`);
        await expect(page.locator("h1")).toHaveText("Connexion");
      } else {
        await expect(page.locator("h1")).toHaveText(headings[route.url]);
      }
      if (route.url === "/") {
        const pictures = data["restaurants/1/pictures"].pictures.slice(0, 3);
        await expect(page.locator("#homeGallery img")).toHaveCount(pictures.length);
        for (const [index, picture] of pictures.entries()) {
          await expect(page.locator("#homeGallery img").nth(index)).toHaveAttribute("alt", picture.title);
          const expected = new URL(picture.imageUrl, proxyLocalApi ? "http://127.0.0.1:8000" : api).href;
          await expect(page.locator("#homeGallery img").nth(index)).toHaveAttribute("src", expected);
        }
        const menus = data.menus.menus.slice(0, 2);
        await expect(page.locator("#homeMenus h3")).toHaveText(menus.map(menu => menu.title));
        await expect(page.locator("#homeMenus .home-menu-title p")).toHaveText(menus.map(menu => new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(menu.price)));
        const restaurant = data["restaurants/1"];
        const hours = [restaurant.amOpeningTime, restaurant.pmOpeningTime].filter(range => range.length).map(range => range.map(hour => hour.replace(":", "h")).join("–")).join(" · ");
        await expect(page.locator("[data-service-hours]")).toHaveText(Array(6).fill(hours));
        await expect(page.locator("#serviceHoursNote")).toBeHidden();
      }
      if (route.url === "/galerie") await expect(page.locator("#allImages img")).toHaveCount(data["restaurants/1/pictures"].pictures.length);
      if (route.url === "/lacarte") await expect(page.locator("#foodsList h3")).toHaveText(data.foods.foods.map(food => food.title));
      if (route.url === "/menu") await expect(page.locator("#menusList h3")).toHaveText(data.menus.menus.map(menu => menu.title));
      await page.evaluate(async () => {
        const images = [...document.querySelectorAll("main img")].filter(img => !img.closest(".modal"));
        for (const img of images) img.loading = "eager";
        await Promise.all(images.map(img => img.decode()));
        await document.fonts.ready;
      });
    });
  }
  await check("Unknown route", async () => {
    await page.goto(origin + "/route-inconnue-recette", { waitUntil: "domcontentloaded" });
    await expect(page.locator("h1")).toContainText("404");
  });
  await check("Navigation, history and responsive layout", async () => {
    await page.goto(origin, { waitUntil: "domcontentloaded" });
    await page.locator("header a[href='/menu']").click();
    await expect(page.locator("#menusList h3")).toHaveCount(data.menus.menus.length);
    await page.goBack();
    await expect(page.locator(".home-hero")).toBeVisible();
    await expect(page.locator("#homeGallery")).toHaveAttribute("aria-busy", "false");
    await expect(page.locator("#homeMenus")).toHaveAttribute("aria-busy", "false");
    await page.evaluate(async () => {
      for (const image of document.querySelectorAll("main img")) {
        image.loading = "eager";
        await image.decode();
      }
      await document.fonts.ready;
    });
    for (const width of [320, 390, 768, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await page.locator(".house-visit").scrollIntoViewIfNeeded();
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
      assert.equal(await page.evaluate(() => getComputedStyle(document.body, "::before").position), "fixed");
      await page.evaluate(() => scrollTo(0, 0));
      await page.screenshot({ path: `${output}/home-${width}-top.png` });
      await page.locator(".house-introduction").scrollIntoViewIfNeeded();
      await page.screenshot({ path: `${output}/home-${width}-scroll.png` });
    }
    await page.setViewportSize({ width: 390, height: 844 });
    await page.evaluate(() => scrollTo(0, 0));
    await page.locator(".navbar-toggler").click();
    await expect(page.locator(".navbar-toggler")).toHaveAttribute("aria-expanded", "true");
    await page.locator("header a[href='/galerie']").click();
    await expect(page.locator("h1")).toHaveText("Galerie");
  });
  assert.deepEqual(report.errors, [], "Browser console/network errors");
  report.success = true;
} catch (error) {
  report.success = false;
  report.failure = error.stack;
  console.error(error);
  process.exitCode = 1;
} finally {
  await browser?.close();
  await writeFile(`${output}/report.json`, JSON.stringify(report, null, 2));
  console.log(`Report: ${output}/report.json (${report.checks.length} checks)`);
}
