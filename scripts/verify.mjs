#!/usr/bin/env node
/** Local checks for the business analysis lab. No network. */
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { answerQuestion } from "../guide/engine.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const problems = [];
function fail(message) { problems.push(message); }

const email = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/;
const banned = [/mailto:/i, /dev\.to/i, /linktr\.ee\/(?!cypherMonkey\b)/];
const bannedHosts = new Set(["x.com", "www.x.com", "twitter.com", "www.twitter.com", "linkedin.com", "www.linkedin.com", "huggingface.co", "www.huggingface.co"]);
const namespaces = new Set([
  "http://www.w3.org/2000/svg",
  "http://www.w3.org/1999/xlink",
  "http://www.w3.org/XML/1998/namespace"
]);

function walk(dir, acc) {
  for (const name of readdirSync(dir)) {
    if (name === "node_modules" || name === ".git" || name === "verify.mjs") continue;
    const path = join(dir, name);
    const st = statSync(path);
    if (st.isDirectory()) walk(path, acc);
    else acc.push(path);
  }
  return acc;
}

const files = walk(root, []);
const textExt = /\.(html|js|mjs|css|json|md|svg|txt)$/;
for (const path of files) {
  if (!textExt.test(path)) continue;
  const text = readFileSync(path, "utf8");
  if (email.test(text)) fail("email-like text in " + path);
  for (const rule of banned) if (rule.test(text)) fail(rule + " in " + path);
  if (path.endsWith(".html") && /(?:href|src)=["']\/(?!\/)/.test(text)) fail("root-absolute path in " + path);
}

const catalog = JSON.parse(readFileSync(join(root, "assets/data/catalog.json"), "utf8"));
if ((catalog.items || []).length < 100) fail("fewer than 100 notes");
if ((catalog.diagrams || []).length < 60) fail("fewer than 60 diagrams");
if ((catalog.flows || []).length < 30) fail("fewer than 30 flows");
if ((catalog.flashcards || []).length < 20) fail("fewer than 20 flashcards");
if ((catalog.quizzes || []).length < 12) fail("fewer than 12 quiz items");

for (const diagram of catalog.diagrams) {
  if (!existsSync(join(root, diagram.file))) fail("missing diagram " + diagram.file);
}
for (const item of catalog.downloads) {
  const path = join(root, item.file);
  if (!existsSync(path)) fail("missing download " + item.file);
  else if (statSync(path).size !== item.bytes) fail("size mismatch " + item.file);
}
for (const page of ["index.html", "start.html", "babok.html", "certs.html", "practice.html", "downloads.html", "credits.html", "help.html", "manifest.webmanifest", "sw.js", "docs/PUBLISHING.md", "docs/download-tests.md", "assets/js/onboard.js", "assets/js/pwa.js", "assets/data/download-tests.json", "extension/manifest.json", "embed/ba-widget.js", "guide/guide.js", "guide/kb/index.json"]) {
  if (!existsSync(join(root, page))) fail("missing " + page);
}

const footerNeedles = ["CypherMonkey Labs", "cyphermonkeylabs.com/#contact", "© 2026 CypherMonkeyLabs"];
const sampleHtml = readFileSync(join(root, "downloads/html/brd-outline.html"), "utf8");
for (const needle of footerNeedles) if (!sampleHtml.includes(needle)) fail("HTML sheet missing " + needle);
const readme = readFileSync(join(root, "README.md"), "utf8");
for (const needle of ["github.com/CypherMonkeyLabs", "https://cyphermonkeylabs.com", "linktr.ee/cypherMonkey", "Not affiliated"]) {
  if (!readme.includes(needle)) fail("README missing " + needle);
}
if (/huggingface\.co|linkedin\.com|x\.com/i.test(readme)) fail("README still has a removed social host");

const cited = new Set();
function collectCited(node) {
  if (typeof node === "string") {
    const re = /https?:\/\/[^\s"'<>)]+/g;
    let match;
    while ((match = re.exec(node))) cited.add(match[0].replace(/[),.;]+$/g, ""));
  } else if (Array.isArray(node)) node.forEach(collectCited);
  else if (node && typeof node === "object") Object.values(node).forEach(collectCited);
}
collectCited(catalog);

function hostAllowed(raw) {
  const cleaned = raw.replace(/[),.;]+$/g, "");
  if (namespaces.has(cleaned)) return true;
  let parsed;
  try { parsed = new URL(cleaned); } catch { return false; }
  const host = parsed.hostname.toLowerCase();
  if (bannedHosts.has(host)) return false;
  if (host === "127.0.0.1" || host === "localhost") return true;
  if (host === "cyphermonkeylabs.com" || host === "www.cyphermonkeylabs.com") return true;
  if (host === "linktr.ee" || host === "www.linktr.ee") return parsed.pathname === "/cypherMonkey" || parsed.pathname === "/cypherMonkey/";
  if (host === "github.com" || host === "www.github.com") return parsed.pathname === "/CypherMonkeyLabs" || parsed.pathname.startsWith("/CypherMonkeyLabs/");
  if (cited.has(cleaned) || cited.has(cleaned.replace(/\/$/, ""))) return true;
  return false;
}
for (const path of files) {
  if (!textExt.test(path)) continue;
  const text = readFileSync(path, "utf8");
  const re = /https?:\/\/[^\s"'<>)]+/g;
  let match;
  while ((match = re.exec(text))) {
    if (!hostAllowed(match[0])) fail("unexpected host " + match[0].replace(/[),.;]+$/g, "") + " in " + path);
  }
}
const tests = JSON.parse(readFileSync(join(root, "assets/data/download-tests.json"), "utf8"));
const failedTests = (tests.rows || []).filter((row) => !row.pass);
if (failedTests.length) fail("download checks failed: " + failedTests.length);

const kb = JSON.parse(readFileSync(join(root, "guide/kb/index.json"), "utf8"));
const hit = answerQuestion("What is an RTM?", kb, "glossary");
if (!hit.matched) fail("guide did not match RTM");
const miss = answerQuestion("quantum banana payroll", kb, "home");
if (miss.matched) fail("guide matched nonsense");
if (!/only have the notes/i.test(miss.text)) fail("fallback text changed");

if (problems.length) {
  console.error(problems.join("\n"));
  process.exit(1);
}
console.log("verify ok", {
  notes: catalog.items.length,
  diagrams: catalog.diagrams.length,
  flows: catalog.flows.length,
  cards: catalog.flashcards.length,
  downloads: catalog.downloads.length,
  facts: kb.facts.length
});
