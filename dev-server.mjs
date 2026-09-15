import { createReadStream, existsSync } from "node:fs";
import { extname, join, normalize } from "node:path";
import { createServer } from "node:http";

const host = "127.0.0.1";
const port = Number(process.env.PORT || 5500);
const root = process.cwd();

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
    let pathname = decodeURIComponent(url.pathname);

    if (pathname === "/") {
        pathname = "/index.html";
    }

    const requestedPath = normalize(join(root, pathname));
    const filePath = requestedPath.startsWith(root) && existsSync(requestedPath)
        ? requestedPath
        : join(root, "index.html");

    response.writeHead(200, {
        "Content-Type": mimeTypes[extname(filePath)] || "application/octet-stream"
    });
    createReadStream(filePath).pipe(response);
}).listen(port, host, () => {
    console.log(`Front disponible sur http://${host}:${port}`);
});
