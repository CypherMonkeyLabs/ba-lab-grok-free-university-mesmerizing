/** Build guide/kb/index.json from the lab catalog. */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const catalog = JSON.parse(readFileSync(join(root, "assets/data/catalog.json"), "utf8"));
const facts = [];

function add(page, title, text, href) {
  if (!text) return;
  facts.push({ page, title, text, href: href || (page === "home" ? "index.html" : page + ".html") });
}

(catalog.items || []).forEach(function (item) {
  const extra = (item.points || []).slice(0, 2).join(" ");
  const tbd = item.tbd ? " To be confirmed: " + item.tbd : "";
  add(item.section, item.title, item.summary + (extra ? " " + extra : "") + tbd, item.section + ".html#" + item.id);
});
(catalog.certs || []).forEach(function (cert) {
  add("certs", cert.title, cert.summary + " " + (cert.facts || []).slice(0, 2).join(" "), "certs.html#" + cert.id);
});
(catalog.glossary || []).forEach(function (term) {
  add("glossary", term.term, term.meaning, "glossary.html");
});

const rooms = {
  home: { title: "Home", blurb: "The front door. Start with the one-hour path.", chips: ["What is this lab?", "Start the course", "Quiz"] },
  start: { title: "Start here", blurb: "A one-hour reading path.", chips: ["Course", "How do I use this?"] },
  foundations: { title: "Foundations", blurb: "Need, value, stakeholders, and neighboring roles.", chips: ["What is business analysis?", "BACCM"] },
  ecosystem: { title: "Ecosystem", blurb: "Sister roles and where the practice sits.", chips: ["Sister roles", "Future hooks"] },
  babok: { title: "BABOK", blurb: "Six knowledge areas and technique names.", chips: ["Knowledge areas", "Techniques"] },
  requirements: { title: "Requirements", blurb: "Stories, Gherkin, and traceability.", chips: ["User story", "RTM", "Gherkin"] },
  modeling: { title: "Modeling", blurb: "BPMN, UML, ERD, and C4.", chips: ["BPMN", "C4"] },
  agile: { title: "Agile", blurb: "Scrum, Kanban, design sprint, jobs to be done.", chips: ["Scrum events", "CSPO fee"] },
  data: { title: "Data", blurb: "SQL, KPIs, HEART, process mining.", chips: ["KPI", "Power BI"] },
  tools: { title: "Tools", blurb: "Where teams keep the work.", chips: ["Jira", "Figma"] },
  ai: { title: "AI for BAs", blurb: "Draft, then a person checks.", chips: ["Responsible AI", "Handoff"] },
  domains: { title: "Domains", blurb: "Same moves, different constraints.", chips: ["Healthcare", "Contact center"] },
  product: { title: "Product craft", blurb: "Discovery, case, change, risk, vendors.", chips: ["Business case", "ADKAR"] },
  certs: { title: "Certifications", blurb: "Cited fees. Unknowns stay unknown.", chips: ["ECBA cost", "CBAP hours", "PMI-PBA fee"] },
  careers: { title: "Careers", blurb: "Interviews and sponsorship notes. No pay claims.", chips: ["STAR", "Sponsorship"] },
  practice: { title: "Practice", blurb: "Cards, quiz, and a sort game.", chips: ["Quiz", "Flashcards"] },
  diagrams: { title: "Diagrams", blurb: "Study drawings, not vendor figures.", chips: ["How many diagrams?"] },
  flows: { title: "Flows", blurb: "Sequences from need to accepted change.", chips: ["Traceability flow"] },
  charts: { title: "Charts", blurb: "Exam blueprints and this repo's counts.", chips: ["CBAP blueprint"] },
  glossary: { title: "Glossary", blurb: "Short definitions.", chips: ["What is an RTM?"] },
  resources: { title: "Resources", blurb: "Only links that opened.", chips: ["Which links?"] },
  templates: { title: "Templates", blurb: "Outlines you can copy.", chips: ["RACI", "BRD"] },
  downloads: { title: "Downloads", blurb: "PDF, PPTX, DOCX, and HTML sheets.", chips: ["Where are the files?"] },
  search: { title: "Search", blurb: "Find a note.", chips: ["Traceability"] }
};

const kb = {
  builtFrom: "assets/data/catalog.json",
  facts: facts,
  rooms: rooms,
  course: catalog.course || [],
  quizzes: catalog.quizzes || [],
  cards: catalog.flashcards || [],
  narration: catalog.narration || ""
};

const dest = join(root, "guide/kb");
mkdirSync(dest, { recursive: true });
writeFileSync(join(dest, "index.json"), JSON.stringify(kb));
console.log("kb facts", facts.length);
