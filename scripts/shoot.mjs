import puppeteer from "puppeteer-core";
import { mkdirSync } from "node:fs";

const out = "docs/screenshots";
mkdirSync(out, { recursive: true });
const browser = await puppeteer.launch({
  executablePath: "/usr/local/bin/google-chrome",
  headless: true,
  args: ["--no-sandbox", "--disable-dev-shm-usage"]
});
const shots = [
  ["home", "/", false, false, false],
  ["room", "/foundations.html", false, false, false],
  ["downloads", "/downloads.html", false, false, false],
  ["menu", "/", true, false, false],
  ["guide", "/", false, true, false],
  ["tour", "/?tour=1", false, false, true],
  ["footer", "/", false, false, false]
];
const sizes = [[1440, 900], [390, 844]];

for (const [width, height] of sizes) {
  const page = await browser.newPage();
  await page.setCacheEnabled(false);
  await page.setViewport({ width, height, deviceScaleFactor: 1 });
  for (const [name, path, menu, guide, tour] of shots) {
    await page.goto("http://127.0.0.1:8742" + path, { waitUntil: "networkidle0" });
    await page.evaluate(() => {
      localStorage.clear();
      localStorage.setItem("ba-onboard", "done");
    });
    await page.reload({ waitUntil: "networkidle0" });
    if (tour) await page.goto("http://127.0.0.1:8742/?tour=1", { waitUntil: "networkidle0" });
    await page.waitForSelector("h1, .hero h1, #ba-tour-title");
    if (menu) {
      await page.click("#menu-btn");
      await new Promise((resolve) => setTimeout(resolve, 400));
    }
    if (guide) {
      await page.click(".ba-monkey");
      await new Promise((resolve) => setTimeout(resolve, 400));
    }
    if (name === "footer") {
      await page.evaluate(() => document.querySelector(".site-footer").scrollIntoView());
      await new Promise((resolve) => setTimeout(resolve, 300));
    }
    const info = await page.evaluate(() => {
      function box(node) {
        if (!node) return null;
        const r = node.getBoundingClientRect();
        return { t: Math.round(r.top), b: Math.round(r.bottom), l: Math.round(r.left), r: Math.round(r.right) };
      }
      function hit(a, b) {
        if (!a || !b) return false;
        return !(a.r < b.l || a.l > b.r || a.b < b.t || a.t > b.b);
      }
      const drawer = document.getElementById("drawer");
      const h1 = document.querySelector("h1");
      const menuBtn = document.getElementById("menu-btn");
      const monkey = document.querySelector(".ba-monkey");
      const panel = document.querySelector(".ba-panel");
      const copy = document.querySelector(".copyline");
      const bar = document.getElementById("phone-bar");
      const tourCard = document.querySelector(".ba-tour-card");
      const badges = document.querySelectorAll(".badge-row a");
      const h1r = box(h1);
      const mr = box(menuBtn);
      const monkeyBox = box(monkey);
      return {
        scrollWidth: document.documentElement.scrollWidth,
        inner: window.innerWidth,
        menu: document.body.dataset.menu || "",
        tour: document.body.dataset.tour || "",
        drawer: drawer ? getComputedStyle(drawer).transform : "",
        h1: h1 ? h1.innerText.slice(0, 40) : "",
        h1OverlapMenu: hit(h1r, mr),
        h1OverlapMonkey: hit(h1r, monkeyBox),
        monkey: monkeyBox,
        panelHidden: panel ? panel.hidden : null,
        panel: panel && !panel.hidden ? box(panel) : null,
        copy: box(copy),
        bar: box(bar),
        badges: badges.length,
        exports: document.querySelectorAll(".export-btn").length,
        tourCard: box(tourCard),
        guideHidden: document.querySelector(".ba-guide") ? getComputedStyle(document.querySelector(".ba-guide")).visibility : ""
      };
    });
    console.log(width, name, JSON.stringify(info));
    await page.screenshot({ path: `${out}/${name}-${width}.png` });
  }
  await page.close();
}
await browser.close();
