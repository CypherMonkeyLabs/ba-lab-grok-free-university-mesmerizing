/** Local answerer. No network. Unknown stays unknown. */

const SYNONYMS = {
  ba: ["business", "analyst", "analysis"],
  rtm: ["traceability", "matrix", "requirements"],
  uat: ["acceptance", "testing", "user"],
  bpmn: ["process", "model", "flow"],
  uml: ["diagram", "model"],
  erd: ["entity", "relationship", "data"],
  c4: ["context", "container", "component"],
  okr: ["objective", "key", "result"],
  heart: ["happiness", "engagement", "adoption", "retention"],
  adkar: ["awareness", "desire", "knowledge", "ability", "reinforcement"],
  cbap: ["certification", "iiba", "senior"],
  ecba: ["entry", "certificate", "iiba"],
  ccba: ["capability", "iiba"],
  cbda: ["data", "analytics", "iiba"],
  aac: ["agile", "iiba"],
  pba: ["pmi", "certification"],
  po: ["product", "owner", "backlog"],
  nfr: ["quality", "nonfunctional", "performance"],
  gherkin: ["given", "when", "then", "scenario"],
  kpi: ["metric", "measure", "indicator"],
  raci: ["responsible", "accountable", "consulted", "informed"],
  swot: ["strength", "weakness", "opportunity", "threat"],
  sql: ["query", "select", "database"],
  jtbd: ["job", "jobs", "done"],
};

export function tokens(text) {
  return String(text || "")
    .toLowerCase()
    .replace(/[^a-z0-9+#.\s-]/g, " ")
    .split(/\s+/)
    .filter(function (word) { return word.length > 1; });
}

export function expand(word) {
  const out = [word];
  Object.keys(SYNONYMS).forEach(function (key) {
    const family = SYNONYMS[key].concat([key]);
    if (family.indexOf(word) !== -1) family.forEach(function (item) { if (out.indexOf(item) === -1) out.push(item); });
  });
  return out;
}

export function scoreFact(query, fact) {
  const wanted = tokens(query);
  if (!wanted.length) return 0;
  const have = {};
  tokens(fact.title + " " + fact.text).forEach(function (word) { have[word] = 1; });
  let hit = 0;
  wanted.forEach(function (word) {
    const family = expand(word);
    if (family.some(function (item) { return have[item]; })) hit += 1;
  });
  return hit / wanted.length;
}

export function answerQuestion(query, kb, page) {
  const facts = (kb && kb.facts) || [];
  let best = null;
  let bestScore = 0;
  facts.forEach(function (fact) {
    let value = scoreFact(query, fact);
    if (fact.page === page) value += 0.05;
    if (value > bestScore) {
      bestScore = value;
      best = fact;
    }
  });
  if (!best || bestScore < 0.34) {
    return {
      matched: false,
      text: "I only have the notes in this lab. I do not have an answer for that in these pages. Try a word from the room you are in, or say so if the lab should add a source.",
      href: "",
      title: ""
    };
  }
  return {
    matched: true,
    text: best.text,
    href: best.href,
    title: best.title
  };
}

export function roomBlurb(kb, page) {
  const rooms = (kb && kb.rooms) || {};
  return rooms[page] || rooms.home || { title: "This room", blurb: "Ask about the notes on this page.", chips: ["What is this room?", "Quiz", "Course"] };
}
