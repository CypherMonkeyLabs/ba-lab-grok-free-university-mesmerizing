/** Headless checks that standalone downloads carry the disclaimer. */
import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer-core";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const catalog = JSON.parse(readFileSync(join(root, "assets/data/catalog.json"), "utf8"));
const rows = [];

function add(file, kind, check, pass, detail) {
  rows.push({ file, kind, check, pass, detail: detail || "" });
}

function pdfHasDisclaimer(file) {
  const script = `
import re, sys, zlib
from pathlib import Path
def ascii85(s):
    s = re.sub(rb"\\s+", b"", s)
    if s.endswith(b"~>"):
        s = s[:-2]
    out = bytearray()
    i = 0
    while i < len(s):
        if s[i] == ord("z"):
            out += b"\\x00\\x00\\x00\\x00"
            i += 1
            continue
        chunk = s[i:i+5]
        i += len(chunk)
        pad = 5 - len(chunk)
        if pad:
            chunk += b"u" * pad
        val = 0
        for c in chunk:
            val = val * 85 + (c - 33)
        raw = val.to_bytes(4, "big")
        out += raw[:4 - pad] if pad else raw
    return bytes(out)
data = Path(sys.argv[1]).read_bytes()
texts = []
for match in re.finditer(br"<<(.*?)>>\\s*stream\\n", data, re.S):
    header, length = match.group(1), re.search(br"/Length\\s+(\\d+)", match.group(1))
    if not length:
        continue
    blob = data[match.end():match.end() + int(length.group(1))]
    if b"ASCII85Decode" in header:
        blob = ascii85(blob)
    if b"FlateDecode" in header:
        blob = zlib.decompress(blob)
    texts.append(blob.decode("latin1", "ignore"))
text = "\\n".join(texts)
print("yes" if "Independent" in text else "no")
`;
  return execFileSync("python3", ["-c", script, file], { encoding: "utf8" }).trim() === "yes";
}

function zipXml(file, pattern) {
  const script = `
import zipfile, sys
path, pattern = sys.argv[1], sys.argv[2]
with zipfile.ZipFile(path) as zf:
    names = [name for name in zf.namelist() if name.startswith(pattern)]
    text = "\\n".join(zf.read(name).decode("utf-8", "ignore") for name in names)
print("Independent" in text and "CypherMonkey" in text)
`;
  const out = execFileSync("python3", ["-c", script, file, pattern], { encoding: "utf8" }).trim();
  return out === "True";
}

const htmlFiles = [];
for (const item of catalog.downloads || []) {
  const path = join(root, item.file);
  const kind = item.kind;
  if (!statSync(path, { throwIfNoEntry: false })) {
    add(item.file, kind, "exists", false, "missing");
    continue;
  }
  if (kind === "HTML") htmlFiles.push(item.file);
  else if (kind === "PDF") {
    const buf = readFileSync(path);
    const header = buf.subarray(0, 4).toString() === "%PDF";
    const mark = header && pdfHasDisclaimer(path);
    add(item.file, kind, "pdf disclaimer", header && mark, header ? (mark ? "ok" : "missing Independent") : "not a pdf");
  } else if (kind === "DOCX") {
    const ok = zipXml(path, "word/");
    add(item.file, kind, "docx disclaimer", ok, ok ? "ok" : "missing disclaimer");
  } else if (kind === "PPTX") {
    const ok = zipXml(path, "ppt/slides/");
    add(item.file, kind, "pptx disclaimer", ok, ok ? "ok" : "missing disclaimer");
  } else if (kind === "JSON") {
    const text = readFileSync(path, "utf8");
    const ok = text.includes("\"title\"");
    add(item.file, kind, "json payload", ok, ok ? "ok" : "unexpected");
  } else if (kind === "PNG" || kind === "SVG" || kind === "ZIP") {
    const size = statSync(path).size;
    add(item.file, kind, "bytes", size > 32, String(size));
  } else {
    add(item.file, kind, "bytes", statSync(path).size > 0, "unchecked kind");
  }
}

const browser = await puppeteer.launch({
  executablePath: "/usr/local/bin/google-chrome",
  headless: true,
  args: ["--no-sandbox", "--disable-dev-shm-usage"]
});
const page = await browser.newPage();
for (const file of htmlFiles) {
  await page.goto("file://" + join(root, file), { waitUntil: "domcontentloaded" });
  const info = await page.evaluate(() => {
    const text = document.body ? document.body.innerText : "";
    return {
      affiliated: text.includes("Not affiliated"),
      brand: text.includes("CypherMonkey"),
      links: Array.from(document.querySelectorAll("a[href]")).map((node) => node.href)
    };
  });
  const banned = info.links.some((href) => /x\.com|linkedin\.com|huggingface\.co|twitter\.com/i.test(href));
  const pass = info.affiliated && info.brand && !banned;
  add(file, "HTML", "headless standalone", pass, pass ? "ok" : "missing disclaimer or extra social link");
}
await browser.close();

const failed = rows.filter((row) => !row.pass);
const summary = rows.length + " checks, " + failed.length + " failed.";
const report = { summary, generated: new Date().toISOString().slice(0, 10), rows };
mkdirSync(join(root, "assets/data"), { recursive: true });
mkdirSync(join(root, "docs"), { recursive: true });
writeFileSync(join(root, "assets/data/download-tests.json"), JSON.stringify(report, null, 2));
const table = [
  "# Download checks",
  "",
  summary,
  "",
  "| File | Kind | Check | Result |",
  "| --- | --- | --- | --- |",
  ...rows.map((row) => `| \`${row.file}\` | ${row.kind} | ${row.check} | ${row.pass ? "Pass" : "Fail"} |`)
].join("\n") + "\n";
writeFileSync(join(root, "docs/download-tests.md"), table);
console.log(summary);
if (failed.length) {
  console.error(failed.slice(0, 12).map((row) => row.file + " " + row.detail).join("\n"));
  process.exit(1);
}
