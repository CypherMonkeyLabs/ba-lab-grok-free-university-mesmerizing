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
  ["home", "/", false, false],
  ["room", "/foundations.html", false, false],
  ["downloads", "/downloads.html", false, false],
  ["menu", "/", true, false],
  ["guide", "/", false, true]
];
const sizes = [[1440, 900], [390, 844]];

for (const [width, height] of sizes) {
  const page = await browser.newPage();
  await page.setCacheEnabled(false);
  await page.setViewport({ width, height, deviceScaleFactor: 1 });
  for (const [name, path, menu, guide] of shots) {
    if (name === "guide" && width > 500) continue;
    await page.goto("http://127.0.0.1:8742" + path, { waitUntil: "networkidle0" });
    await page.evaluate(() => localStorage.clear());
    await page.reload({ waitUntil: "networkidle0" });
    await page.waitForSelector("h1, .hero h1");
    if (menu) {
      await page.click("#menu-btn");
      await new Promise((r) => setTimeout(r, 400));
    }
    if (guide) {
      await page.click(".ba-monkey");
      await new Promise((r) => setTimeout(r, 300));
    }
    const info = await page.evaluate(() => {
      const drawer = document.getElementById("drawer");
      const h1 = document.querySelector("h1");
      const menuBtn = document.getElementById("menu-btn");
      const box = document.querySelector(".disclaimer-box");
      const h1r = h1 ? h1.getBoundingClientRect() : null;
      const mr = menuBtn ? menuBtn.getBoundingClientRect() : null;
      const overlap = h1r && mr ? !(mr.right < h1r.left || mr.left > h1r.right || mr.bottom < h1r.top || mr.top > h1r.bottom) : false;
      return {
        scrollWidth: document.documentElement.scrollWidth,
        inner: window.innerWidth,
        menu: document.body.dataset.menu || "",
        drawer: drawer ? getComputedStyle(drawer).transform : "",
        disclaimer: box ? box.innerText.slice(0, 80) : "",
        h1: h1 ? h1.innerText.slice(0, 60) : "",
        overlap
      };
    });
    console.log(width, name, JSON.stringify(info));
    await page.screenshot({ path: `${out}/${name}-${width}.png` });
  }
  await page.close();
}
await browser.close();
