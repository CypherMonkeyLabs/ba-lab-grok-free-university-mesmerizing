/** Render diagram and sheet PNGs, then zip every download. */
import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer-core";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const catalogPath = join(root, "assets/data/catalog.json");
const catalog = JSON.parse(readFileSync(catalogPath, "utf8"));
mkdirSync(join(root, "downloads/diagrams"), { recursive: true });
mkdirSync(join(root, "downloads/png"), { recursive: true });

const browser = await puppeteer.launch({
  executablePath: "/usr/local/bin/google-chrome",
  headless: true,
  args: ["--no-sandbox", "--disable-dev-shm-usage", "--disable-gpu"]
});
const page = await browser.newPage();
await page.setViewport({ width: 1100, height: 800, deviceScaleFactor: 1 });
const added = [];

for (const diagram of catalog.diagrams) {
  const pngRel = `downloads/diagrams/${diagram.id}.png`;
  await page.goto("file://" + join(root, diagram.file), { waitUntil: "load" });
  const svg = await page.$("svg");
  if (svg) await svg.screenshot({ path: join(root, pngRel) });
  else await page.screenshot({ path: join(root, pngRel) });
  added.push({ file: pngRel, title: diagram.title + " PNG", kind: "PNG", bytes: statSync(join(root, pngRel)).size });
}

for (const name of ["cheat-sheet.html", "flashcards.html", "brd-outline.html"]) {
  const pngRel = `downloads/png/${name.replace(".html", ".png")}`;
  await page.goto("file://" + join(root, "downloads/html", name), { waitUntil: "load" });
  await page.screenshot({ path: join(root, pngRel), fullPage: true });
  added.push({ file: pngRel, title: name.replace(".html", " PNG"), kind: "PNG", bytes: statSync(join(root, pngRel)).size });
}

await browser.close();

const kept = (catalog.downloads || []).filter(function (item) {
  return item.kind !== "PNG" && item.file !== "downloads/ba-everything.zip";
});
kept.forEach(function (item) {
  item.bytes = statSync(join(root, item.file)).size;
});
const zipBytes = Number(execFileSync("python3", ["-c", `
import zipfile
from pathlib import Path
root = Path(${JSON.stringify(root)})
dest = root / "downloads" / "ba-everything.zip"
if dest.exists():
    dest.unlink()
with zipfile.ZipFile(dest, "w", zipfile.ZIP_DEFLATED) as zf:
    for path in sorted((root / "downloads").rglob("*")):
        if path.is_file() and path.name != "ba-everything.zip":
            zf.write(path, path.relative_to(root / "downloads").as_posix())
print(dest.stat().st_size)
`], { encoding: "utf8" }).trim());
catalog.downloads = kept.concat(added).concat([{
  file: "downloads/ba-everything.zip",
  title: "Download everything",
  kind: "ZIP",
  bytes: zipBytes
}]);
writeFileSync(catalogPath, JSON.stringify(catalog, null, 2));
console.log("rasterized", added.length, "pngs");
