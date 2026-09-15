import { readdirSync, statSync } from "node:fs";
import { extname, join, relative } from "node:path";
import { spawnSync } from "node:child_process";

const roots = ["Router", "js", "dev-server.mjs"];
const files = [];

function collect(path) {
  const stats = statSync(path);

  if (stats.isDirectory()) {
    for (const entry of readdirSync(path)) {
      collect(join(path, entry));
    }
    return;
  }

  if ([".js", ".mjs"].includes(extname(path))) {
    files.push(path);
  }
}

for (const root of roots) {
  collect(root);
}

for (const file of files) {
  const result = spawnSync(process.execPath, ["--check", file], {
    encoding: "utf8",
  });

  if (result.status !== 0) {
    console.error(`Erreur de syntaxe dans ${relative(process.cwd(), file)}`);
    console.error(result.stderr || result.stdout);
    process.exit(result.status ?? 1);
  }
}

console.log(`${files.length} fichiers JavaScript verifies.`);
