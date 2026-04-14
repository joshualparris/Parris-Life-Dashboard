const fs = require("node:fs");
const path = require("node:path");

function scan(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const items = [];
  for (const e of entries) {
    if (e.name.startsWith(".")) continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) {
      items.push({ type: "dir", name: e.name });
    } else {
      items.push({ type: "file", name: e.name });
    }
  }
  return items;
}

function main() {
  const root = process.cwd();
  const folders = ["JoshHub", "Game-Fixer", "Serenity-Keep-Flying"];
  const report = {};
  for (const f of folders) {
    const p = path.join(root, f);
    if (fs.existsSync(p)) {
      report[f] = scan(p);
    }
  }
  const out = path.join(root, "projects-inventory.json");
  fs.writeFileSync(out, JSON.stringify(report, null, 2));
  console.log("Wrote", out);
}

main();
