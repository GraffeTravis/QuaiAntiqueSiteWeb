import { createReadStream, existsSync } from "node:fs";
import { extname, join, normalize, relative, resolve } from "node:path";
import { createServer } from "node:http";

const host = "127.0.0.1";
const port = Number(process.env.PORT || 5500);
const root = process.cwd();
const appRoutes = new Set(["/", "/galerie", "/lacarte", "/menu", "/signin", "/signup", "/account", "/editPassword", "/allresa", "/reserver", "/admin"]);

const mimeTypes = {
    ".css": "text/css; charset=utf-8",
    ".html": "text/html; charset=utf-8",
    ".js": "text/javascript; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".svg": "image/svg+xml",
    ".webp": "image/webp",
    ".woff": "font/woff",
    ".woff2": "font/woff2",
    ".ttf": "font/ttf"
};

createServer((request, response) => {
    const url = new URL(request.url ?? "/", `http://${host}:${port}`);
    let pathname;
    try {
        pathname = decodeURIComponent(url.pathname);
    } catch {
        response.writeHead(400).end();
        return;
    }

    if (pathname === "/") {
        pathname = "/index.html";
    }

    const requestedPath = resolve(root, normalize(join(root, pathname)));
    const relativePath = relative(root, requestedPath);
    const isInsideRoot = relativePath !== ".." && !relativePath.startsWith(`..${process.platform === "win32" ? "\\" : "/"}`);
    const fileExists = isInsideRoot && existsSync(requestedPath);
    const filePath = fileExists ? requestedPath : join(root, "index.html");
    const isAppRoute = appRoutes.has(pathname);

    if (!fileExists && !isAppRoute) {
        response.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
        createReadStream(join(root, "index.html")).pipe(response);
        return;
    }

    response.writeHead(200, {
        "Content-Type": mimeTypes[extname(filePath)] || "application/octet-stream"
    });
    createReadStream(filePath).pipe(response);
}).listen(port, host, () => {
    console.log(`Front disponible sur http://${host}:${port}`);
});
