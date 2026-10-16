/**
 * Study companion. Facts come from guide/kb. Voice stays off until a choice asks for it.
 * window.BA_GUIDE.endpoint stays null unless a page sets it first.
 */
import { answerQuestion, roomBlurb } from "./engine.mjs";

var base = new URL(".", import.meta.url);
var prior = window.BA_GUIDE && typeof window.BA_GUIDE.endpoint === "string" ? window.BA_GUIDE.endpoint : null;
window.BA_GUIDE = { endpoint: prior };

var session = load("ba-guide") || {
  badges: [],
  course: 0,
  voice: false,
  hidden: false,
  rate: 0.9,
  pitch: 0.96,
  voiceName: "",
  x: null,
  y: null
};
var kb = null;
var quizIndex = 0;
var speaking = [];
var speakIndex = 0;
var paused = false;
var readState = null;
var audioCtx = null;
var soundNodes = null;
var drag = null;

var host = document.createElement("div");
host.className = "ba-guide";
host.innerHTML =
  '<button type="button" class="ba-monkey" aria-expanded="false" aria-controls="ba-guide-panel" aria-label="BA guide">' +
  monkeySvg() + "</button>" +
  '<section class="ba-panel" id="ba-guide-panel" hidden role="dialog" aria-modal="false" aria-labelledby="ba-guide-title">' +
  '<header><div><h2 id="ba-guide-title">BA guide</h2><p class="ba-status">Voice is off</p></div>' +
  '<div class="ba-actions"><button type="button" data-hide>Hide</button><button type="button" data-close>Close</button></div></header>' +
  '<div class="ba-scroll">' +
  '<div class="ba-log" role="log" aria-live="polite"></div>' +
  '<div class="ba-voice">' +
  '<label>Voice <select data-voice-pick aria-label="Voice"></select></label>' +
  '<label>Rate <input data-rate type="range" min="0.7" max="1.15" step="0.05" value="0.9"></label>' +
  '<label>Pitch <input data-pitch type="range" min="0.8" max="1.2" step="0.05" value="0.96"></label>' +
  '<button type="button" data-sound>Soft sound off</button>' +
  '<button type="button" data-pause>Pause</button>' +
  '<button type="button" data-resume>Resume</button>' +
  '<button type="button" data-next-section>Next section</button>' +
  '<button type="button" data-stop>Stop</button>' +
  "</div></div>" +
  '<div class="ba-choices"></div>' +
  '<form class="ba-form"><input type="text" aria-label="Ask about this room" placeholder="Ask, or say take me to a room" autocomplete="off">' +
  '<button type="button" data-mic aria-label="Speak a question">Mic</button><button type="submit">Send</button></form>' +
  "</section>";
document.body.appendChild(host);

var css = document.createElement("link");
css.rel = "stylesheet";
css.href = new URL("guide.css", base).href;
document.head.appendChild(css);

var panel = host.querySelector(".ba-panel");
var log = host.querySelector(".ba-log");
var monkey = host.querySelector(".ba-monkey");
var status = host.querySelector(".ba-status");
host.querySelector("[data-rate]").value = String(session.rate || 0.9);
host.querySelector("[data-pitch]").value = String(session.pitch || 0.96);

function load(key) {
  try { return JSON.parse(localStorage.getItem(key) || "null"); } catch (err) { return null; }
}
function save() {
  try { localStorage.setItem("ba-guide", JSON.stringify(session)); } catch (err) { /* ignore */ }
}
function page() { return document.body.dataset.page || "home"; }
function pose(name) {
  monkey.dataset.pose = name;
  if (name === "greeting") monkey.dataset.mood = "wave";
  else if (name === "celebrate") monkey.dataset.mood = "cheer";
  else if (name === "encourage") monkey.dataset.mood = "wave";
  else monkey.dataset.mood = "idle";
}

function monkeySvg() {
  return '<span class="ba-aura" aria-hidden="true"></span><span class="ba-glow" aria-hidden="true"></span>' +
    '<svg viewBox="0 0 80 80" aria-hidden="true">' +
    '<defs><radialGradient id="bafur" cx="40%" cy="32%" r="70%"><stop offset="0" stop-color="#ffe7a3"/><stop offset=".55" stop-color="#f6b73c"/><stop offset="1" stop-color="#c2410c"/></radialGradient></defs>' +
    '<ellipse class="ear left" cx="16" cy="36" rx="11" ry="13"/>' +
    '<ellipse class="ear right" cx="64" cy="36" rx="11" ry="13"/>' +
    '<ellipse class="face" cx="40" cy="42" rx="24" ry="22"/>' +
    '<ellipse class="muzzle" cx="40" cy="52" rx="13" ry="10"/>' +
    '<g class="specs"><circle cx="31" cy="40" r="8"/><circle cx="49" cy="40" r="8"/><path d="M39 40h2"/><path d="M18 38l5 2M62 38l-5 2"/></g>' +
    '<circle class="eye" cx="31" cy="40" r="2"/><circle class="eye" cx="49" cy="40" r="2"/>' +
    '<path class="smile" d="M32 54c3 3 13 3 16 0"/>' +
    '<path class="arm" d="M14 56c8 12 14 8 16-2"/>' +
    "</svg>";
}

function reveal(node) {
  var scroller = host.querySelector(".ba-scroll");
  if (!scroller || !node) return;
  var top = node.offsetTop;
  if (top < scroller.scrollTop) scroller.scrollTop = top;
  var bottom = top + node.offsetHeight;
  if (bottom > scroller.scrollTop + scroller.clientHeight) scroller.scrollTop = bottom - scroller.clientHeight;
}
function say(text, who) {
  var bubble = document.createElement("p");
  bubble.className = "ba-bubble " + (who || "bot");
  if (who === "me") bubble.textContent = text;
  else {
    text.split(/(?<=[.!?])\s+/).forEach(function (sentence) {
      var span = document.createElement("span");
      span.className = "sent";
      span.textContent = sentence + " ";
      bubble.appendChild(span);
    });
  }
  log.appendChild(bubble);
  if (log.childElementCount > 1) reveal(bubble);
  if (who !== "me" && session.voice && !readState) speak(text, bubble);
  return bubble;
}
function rankedVoices() {
  var voices = window.speechSynthesis ? window.speechSynthesis.getVoices() : [];
  return voices.slice().sort(function (a, b) { return scoreVoice(b) - scoreVoice(a); });
}
function scoreVoice(voice) {
  var name = (voice.name + " " + voice.lang).toLowerCase();
  var score = 0;
  if (name.indexOf("natural") !== -1 || name.indexOf("neural") !== -1 || name.indexOf("online") !== -1) score += 80;
  if (name.indexOf("aria") !== -1 || name.indexOf("jenny") !== -1) score += 60;
  if (name.indexOf("guy") !== -1 || name.indexOf("sara") !== -1 || name.indexOf("sonia") !== -1) score += 40;
  if (name.indexOf("google") !== -1 && name.indexOf("en") !== -1) score += 35;
  if (name.indexOf("samantha") !== -1 || name.indexOf("karen") !== -1) score += 30;
  if (name.indexOf("enhanced") !== -1 || name.indexOf("premium") !== -1) score += 25;
  if (voice.lang === "en-US" || name.indexOf("en-us") !== -1) score += 15;
  if (/zarvox|bells|whisper|trinoids|boing|bubbles|cellos|albert|bad news|bahh|jester|organ|superstar/.test(name)) score -= 80;
  return score;
}
function fillVoices() {
  var select = host.querySelector("[data-voice-pick]");
  if (!select || !window.speechSynthesis) return;
  var voices = rankedVoices();
  select.innerHTML = "";
  if (!voices.length) {
    var empty = document.createElement("option");
    empty.textContent = "Browser default";
    empty.value = "";
    select.appendChild(empty);
    return;
  }
  voices.forEach(function (voice, index) {
    var option = document.createElement("option");
    option.value = voice.name;
    option.textContent = voice.name;
    if (session.voiceName ? voice.name === session.voiceName : index === 0) option.selected = true;
    select.appendChild(option);
  });
  if (!session.voiceName && voices[0]) session.voiceName = voices[0].name;
}
function pickVoice() {
  var voices = rankedVoices();
  for (var i = 0; i < voices.length; i += 1) if (voices[i].name === session.voiceName) return voices[i];
  return voices[0] || null;
}
function speak(text, bubble) {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  speaking = bubble ? Array.prototype.slice.call(bubble.querySelectorAll(".sent")) : [];
  speakIndex = 0;
  paused = false;
  speakNext();
}
function speakNext() {
  if (!speaking.length || speakIndex >= speaking.length) return;
  speaking.forEach(function (node) { node.classList.remove("is-on"); });
  var node = speaking[speakIndex];
  node.classList.add("is-on");
  var utter = new SpeechSynthesisUtterance(node.textContent);
  var voice = pickVoice();
  if (voice) utter.voice = voice;
  utter.rate = Number(session.rate) || 0.9;
  utter.pitch = Number(session.pitch) || 0.96;
  utter.onend = function () {
    speakIndex += 1;
    if (!paused) speakNext();
  };
  window.speechSynthesis.speak(utter);
}
function stopSpeech() {
  speaking = [];
  readState = null;
  paused = false;
  if (window.speechSynthesis) window.speechSynthesis.cancel();
  document.querySelectorAll(".is-reading, .is-live, .is-spoken").forEach(function (node) {
    node.classList.remove("is-reading", "is-live", "is-spoken");
  });
}
function setVoice(on) {
  session.voice = !!on;
  status.textContent = session.voice ? "Voice on, calm pace" : "Voice is off";
  save();
}
function setSound(on) {
  try { localStorage.setItem("ba-sound", on ? "on" : "off"); } catch (err) { /* ignore */ }
  var button = host.querySelector("[data-sound]");
  if (button) button.textContent = on ? "Soft sound on" : "Soft sound off";
  button && button.setAttribute("aria-pressed", on ? "true" : "false");
  if (!on) {
    if (soundNodes) {
      try { soundNodes.osc.stop(); } catch (err) { /* ignore */ }
      soundNodes = null;
    }
    return;
  }
  var Ctx = window.AudioContext || window.webkitAudioContext;
  if (!Ctx) {
    say("This browser has no soft-sound generator. The page stays quiet.");
    return;
  }
  if (!audioCtx) audioCtx = new Ctx();
  if (audioCtx.state === "suspended") audioCtx.resume();
  if (soundNodes) return;
  var osc = audioCtx.createOscillator();
  var gain = audioCtx.createGain();
  osc.type = "sine";
  osc.frequency.value = 174;
  gain.gain.value = 0.015;
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start();
  soundNodes = { osc: osc, gain: gain };
}
window.BA_SET_SOUND = setSound;

var PRIMARY = [
  ["Finish in 10 minutes", "ten"],
  ["Full course", "course"],
  ["Just download", "download"]
];
var MORE = [
  ["1-minute clip", "clip"],
  ["10-minute trailer", "trailer"],
  ["1-hour guided walk", "hour"],
  ["Cheat codes", "cheats"],
  ["Quiz me", "quiz"],
  ["Teach me this room", "teach"],
  ["Interview practice", "interview"],
  ["Games", "games"],
  ["Mute me and just read", "mute"]
];

function welcome() {
  log.innerHTML = "";
  pose("greeting");
  say("Welcome to CypherMonkey Labs. I am your BA guide. Pick a way to study. I will not speak unless you choose a path that reads aloud.");
  var wrap = host.querySelector(".ba-choices");
  wrap.innerHTML = "";
  PRIMARY.forEach(function (pair) {
    var button = document.createElement("button");
    button.type = "button";
    button.textContent = pair[0];
    button.addEventListener("click", function () { onChoice(pair[1]); });
    wrap.appendChild(button);
  });
  var more = document.createElement("button");
  more.type = "button";
  more.textContent = "More";
  more.addEventListener("click", function () {
    more.hidden = true;
    MORE.forEach(function (pair) {
      var button = document.createElement("button");
      button.type = "button";
      button.textContent = pair[0];
      button.addEventListener("click", function () { onChoice(pair[1]); });
      wrap.appendChild(button);
    });
  });
  wrap.appendChild(more);
  var scroller = host.querySelector(".ba-scroll");
  if (scroller) scroller.scrollTop = 0;
}
function onChoice(id) {
  if (id === "mute") {
    setVoice(false);
    stopSpeech();
    say("Muted. The notes stay on the page.");
    pose("encourage");
    return;
  }
  if (id === "ten") return chooseTen();
  if (id === "course") return chooseCourse();
  if (id === "download") return chooseDownload();
  if (id === "clip" || id === "trailer" || id === "hour") setVoice(true);
  if (id === "clip") return runScript(scriptClip(), "One-minute clip");
  if (id === "trailer") return runScript(scriptTrailer(), "Ten-minute trailer");
  if (id === "hour") return runScript(scriptHour(), "One-hour walk");
  if (id === "cheats") {
    say("Cheat codes: need before tool. One owner. Trace to a test. Draw the unhappy path. Leave unknown blank. Confirm a fee before you pay. This lab states no salaries.");
    return;
  }
  if (id === "quiz") return startQuiz();
  if (id === "teach") return teach();
  if (id === "interview") {
    say("Interview practice uses a generic story. Situation, task, action, result. Do not invent an employer, a salary, or a tool you have not used. Open Careers for the written examples.");
    return;
  }
  if (id === "games") {
    say("Games live on the Practice page: sort, match, interview prompts, triage, and a BPMN order.");
    return;
  }
}
function chooseTen() {
  sessionStorage.setItem("ba-intent", "ten");
  if (page() !== "start") {
    location.href = "start.html";
    return;
  }
  setVoice(true);
  readState = { token: 0, index: 0, sent: 0, paused: true };
  say("Ten-minute finish. I will read this page. Pause, resume, or skip to the next section.");
  pose("greeting");
  startReadAlong(0);
}
function chooseCourse() {
  if (!kb || !kb.course || !kb.course.length) return say("The course list has not loaded yet.");
  sessionStorage.setItem("ba-intent", "read-course");
  sessionStorage.setItem("ba-step", "0");
  var here = page() === "home" ? "index.html" : page() + ".html";
  if (here !== kb.course[0].href) {
    location.href = kb.course[0].href;
    return;
  }
  setVoice(true);
  readState = { token: 0, index: 0, sent: 0, paused: true };
  say("Full course. I will read this room, then open the next one.");
  pose("greeting");
  startReadAlong(0);
}
function chooseDownload() {
  sessionStorage.removeItem("ba-intent");
  if (page() !== "downloads") {
    location.href = "downloads.html";
    return;
  }
  say("The Downloads page lists every file. Open app returns to the lab. View repo opens the organization repository. Each room's Export button offers PDF, HTML, DOCX, PPTX, and JSON.");
  pose("encourage");
}
function offerExport() {
  say("For this section, a sensible export is downloads/rooms/" + page() + ".pdf. The Export button also offers HTML, DOCX, PPTX, and JSON.");
}
function sections() {
  return (window.BA_FRAME && window.BA_FRAME.sections) || [];
}
function tryNavigate(text) {
  var match = String(text).match(/take me to\s+(.+)/i);
  if (!match) return false;
  var query = match[1].toLowerCase().replace(/[?.!]/g, "").trim();
  var list = sections();
  var hit = null;
  for (var i = 0; i < list.length; i += 1) {
    var name = list[i][1].toLowerCase();
    var id = list[i][0].toLowerCase();
    if (name.indexOf(query) !== -1 || id === query || query.indexOf(id) !== -1) {
      hit = list[i];
      break;
    }
  }
  if (!hit) {
    say("I do not have a room with that name. Try foundations, BABOK, downloads, or help.");
    pose("encourage");
    return true;
  }
  say("Opening " + hit[1] + ". I will point at the export when we arrive.");
  pose("encourage");
  sessionStorage.setItem("ba-offer", "1");
  window.setTimeout(function () { location.href = hit[2]; }, 280);
  return true;
}
function scriptClip() {
  var line = (kb && kb.narration) || "This is a free study lab for business analysis.";
  return [line, "Checkpoint: a requirement without a test is still a draft."];
}
function scriptTrailer() {
  var steps = (kb && kb.course ? kb.course : []).slice(0, 4);
  var lines = ["Ten-minute trailer. Four stops, then a question."];
  steps.forEach(function (step) { lines.push(step.title + ". " + step.text); });
  lines.push("Checkpoint: name the need before you name the tool.");
  return lines;
}
function scriptHour() {
  var steps = (kb && kb.course) || [];
  var lines = ["One-hour walk. Pause between stops if you want to read the room."];
  steps.forEach(function (step, index) {
    lines.push("Stop " + (index + 1) + ", about " + step.minutes + " minutes. " + step.title + ". " + step.text + " Open " + step.href + ".");
  });
  lines.push("Checkpoint: read one fee cell, and leave any missing fee marked to be confirmed.");
  return lines;
}
function runScript(lines, badgeName) {
  var i = 0;
  function next() {
    if (i >= lines.length) {
      addBadge(badgeName);
      say("That pass is done. The badge stays in this browser.");
      pose("celebrate");
      return;
    }
    var bubble = say(lines[i]);
    i += 1;
    var button = document.createElement("button");
    button.type = "button";
    button.textContent = i === lines.length ? "Finish" : "Next";
    button.addEventListener("click", next);
    bubble.appendChild(document.createElement("br"));
    bubble.appendChild(button);
  }
  next();
}
function teach() {
  if (!kb) return say("The notes have not loaded yet.");
  var room = roomBlurb(kb, page());
  setVoice(true);
  readState = { token: 0, index: 0, sent: 0, paused: true };
  say(room.blurb);
  offerExport();
  pose("encourage");
  startReadAlong(0);
}
function startQuiz() {
  if (!kb || !kb.quizzes || !kb.quizzes.length) return say("No quiz loaded.");
  quizIndex = quizIndex % kb.quizzes.length;
  var item = kb.quizzes[quizIndex];
  var bubble = say(item.q);
  pose("thinking");
  item.choices.forEach(function (choice, choiceIndex) {
    var button = document.createElement("button");
    button.type = "button";
    button.textContent = choice;
    button.addEventListener("click", function () {
      var ok = choiceIndex === item.answer;
      say(ok ? "Yes. " + item.why : "Not that one. " + item.why);
      pose(ok ? "celebrate" : "encourage");
      quizIndex += 1;
    });
    bubble.appendChild(document.createElement("br"));
    bubble.appendChild(button);
  });
}
function ask(text) {
  say(text, "me");
  pose("thinking");
  if (tryNavigate(text)) return;
  if (!kb) return say("The notes have not loaded yet.");
  var result = answerQuestion(text, kb, page());
  if (!result.matched && window.BA_GUIDE.endpoint) {
    fetch(window.BA_GUIDE.endpoint, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ message: text, href: location.href, context: page() })
    }).then(function (response) { return response.json(); }).then(function (body) {
      say(body && body.text ? body.text : "The cloud hook returned no text.");
      pose("encourage");
    }).catch(function () { say(result.text); pose("encourage"); });
    return;
  }
  say(result.text + (result.href ? " Open " + result.href + " for the note." : ""));
  offerExport();
  pose("encourage");
}
function addBadge(name) {
  if (session.badges.indexOf(name) === -1) session.badges.push(name);
  save();
  try {
    var badges = JSON.parse(localStorage.getItem("ba-badges") || "[]");
    if (badges.indexOf(name) === -1) badges.push(name);
    localStorage.setItem("ba-badges", JSON.stringify(badges));
  } catch (err) { /* ignore */ }
}
function plainText(node) {
  if (node.classList && node.classList.contains("read-sent")) return node.textContent.trim();
  var clone = node.cloneNode(true);
  clone.querySelectorAll("button, .export-pop, .export-menu").forEach(function (item) { item.remove(); });
  return (clone.textContent || "").replace(/\s+/g, " ").trim();
}
function ensureSentences(block) {
  var found = block.querySelectorAll(":scope > .read-sent, .read-sent");
  if (block.querySelector(".read-sent")) return Array.prototype.slice.call(block.querySelectorAll(".read-sent"));
  var walker = document.createTreeWalker(block, NodeFilter.SHOW_TEXT, {
    acceptNode: function (node) {
      if (!node.nodeValue || !node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
      var parent = node.parentElement;
      if (!parent || parent.closest("button, a, script, svg, .export-menu, .export-pop")) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    }
  });
  var texts = [];
  while (walker.nextNode()) texts.push(walker.currentNode);
  texts.forEach(function (textNode) {
    var parts = textNode.nodeValue.split(/(?<=[.!?])\s+/);
    var frag = document.createDocumentFragment();
    parts.forEach(function (part, index) {
      if (!part) return;
      var span = document.createElement("span");
      span.className = "read-sent";
      span.textContent = part + (index < parts.length - 1 ? " " : "");
      frag.appendChild(span);
    });
    if (textNode.parentNode) textNode.parentNode.replaceChild(frag, textNode);
  });
  found = block.querySelectorAll(".read-sent");
  if (found.length) return Array.prototype.slice.call(found);
  return [block];
}
function glowOutline(block) {
  document.querySelectorAll(".is-reading, .is-live, .is-spoken").forEach(function (node) {
    node.classList.remove("is-reading", "is-live", "is-spoken");
  });
  block.classList.add("is-reading");
  var chip = document.querySelector(".chip[aria-current='page']");
  var link = document.querySelector(".menu-link[aria-current='page']");
  if (chip) {
    chip.classList.add("is-live");
    chip.scrollIntoView({ inline: "center", block: "nearest" });
  }
  if (link) link.classList.add("is-live");
  block.scrollIntoView({ behavior: document.documentElement.dataset.motion === "reduce" ? "auto" : "smooth", block: "center" });
}
function finishRead() {
  var intent = sessionStorage.getItem("ba-intent");
  readState = null;
  if (intent === "read-course" && kb && kb.course) {
    var href = page() === "home" ? "index.html" : page() + ".html";
    var index = -1;
    kb.course.forEach(function (step, stepIndex) { if (step.href === href) index = stepIndex; });
    if (index >= 0 && kb.course[index + 1]) {
      say("Next room: " + kb.course[index + 1].title + ".");
      pose("encourage");
      sessionStorage.setItem("ba-step", String(index + 1));
      location.href = kb.course[index + 1].href;
      return;
    }
  }
  sessionStorage.removeItem("ba-intent");
  say("That reading is done.");
  offerExport();
  pose("celebrate");
}
function speakSentences(sentences, index) {
  if (!readState) return;
  var token = readState.token;
  if (index >= sentences.length) {
    readState.index += 1;
    readStep();
    return;
  }
  readState.sent = index;
  sentences.forEach(function (node, nodeIndex) {
    node.classList.toggle("is-spoken", nodeIndex === index);
  });
  var text = plainText(sentences[index]);
  if (!text) {
    speakSentences(sentences, index + 1);
    return;
  }
  if (!session.voice || !window.speechSynthesis) {
    window.setTimeout(function () {
      if (!readState || readState.token !== token || readState.paused) return;
      speakSentences(sentences, index + 1);
    }, 500);
    return;
  }
  window.speechSynthesis.cancel();
  var utter = new SpeechSynthesisUtterance(text);
  var voice = pickVoice();
  if (voice) utter.voice = voice;
  utter.rate = Number(session.rate) || 0.9;
  utter.pitch = Number(session.pitch) || 0.96;
  utter.onend = function () {
    if (!readState || readState.token !== token || readState.paused) return;
    speakSentences(sentences, index + 1);
  };
  utter.onerror = function () {
    if (!readState || readState.token !== token || readState.paused) return;
    speakSentences(sentences, index + 1);
  };
  window.speechSynthesis.speak(utter);
}
function readStep() {
  if (!readState) return;
  var blocks = Array.prototype.slice.call(document.querySelectorAll("main [data-read]"));
  if (readState.index >= blocks.length) {
    finishRead();
    return;
  }
  var block = blocks[readState.index];
  glowOutline(block);
  var sentences = ensureSentences(block);
  speakSentences(sentences, 0);
}
function startReadAlong(index) {
  var blocks = document.querySelectorAll("main [data-read]");
  if (!blocks.length) {
    say("This page has no section marked for read-along yet.");
    pose("encourage");
    return;
  }
  if (window.speechSynthesis) window.speechSynthesis.cancel();
  readState = { token: Date.now(), index: index || 0, sent: 0, paused: false };
  pose("greeting");
  readStep();
}
function pauseRead() {
  paused = true;
  if (readState) readState.paused = true;
  if (window.speechSynthesis && window.speechSynthesis.speaking) window.speechSynthesis.pause();
}
function resumeRead() {
  paused = false;
  if (readState) readState.paused = false;
  if (window.speechSynthesis && window.speechSynthesis.paused) {
    window.speechSynthesis.resume();
    return;
  }
  if (!readState) return;
  var block = document.querySelectorAll("main [data-read]")[readState.index];
  if (!block) return;
  speakSentences(ensureSentences(block), readState.sent || 0);
}
function nextSection() {
  if (window.speechSynthesis) window.speechSynthesis.cancel();
  pose("encourage");
  if (!readState) {
    setVoice(true);
    startReadAlong(0);
    return;
  }
  readState.paused = false;
  readState.index += 1;
  readStep();
}
function openPanel(skipWelcome) {
  host.hidden = false;
  session.hidden = false;
  panel.hidden = false;
  monkey.setAttribute("aria-expanded", "true");
  if (!log.childElementCount && !skipWelcome) welcome();
  else pose("greeting");
  save();
}
function closePanel() {
  panel.hidden = true;
  monkey.setAttribute("aria-expanded", "false");
  stopSpeech();
}
var readyHandled = false;
function onReady() {
  if (!kb || !window.BA_CATALOG || readyHandled) return;
  readyHandled = true;
  applyDock();
  if (sessionStorage.getItem("ba-offer") === "1") {
    sessionStorage.removeItem("ba-offer");
    openPanel(true);
    offerExport();
  }
  var intent = sessionStorage.getItem("ba-intent");
  if (intent === "ten" || intent === "read-course") {
    openPanel(true);
    setVoice(true);
    readState = { token: 0, index: 0, sent: 0, paused: true };
    say(intent === "ten" ? "Ten-minute finish. I will read this page." : "Full course. I will read this room, then open the next one.");
    startReadAlong(0);
  }
}
function applyDock() {
  if (host.classList.contains("is-greeting")) return;
  if (typeof session.x === "number" && typeof session.y === "number") {
    var maxX = Math.max(0, window.innerWidth - host.offsetWidth);
    var maxY = Math.max(0, window.innerHeight - host.offsetHeight);
    session.x = Math.min(Math.max(0, session.x), maxX);
    session.y = Math.min(Math.max(0, session.y), maxY);
    host.style.left = session.x + "px";
    host.style.top = session.y + "px";
    host.style.right = "auto";
    host.style.bottom = "auto";
    return;
  }
  host.style.left = "auto";
  host.style.right = "0px";
  host.style.bottom = "auto";
  host.style.top = "38%";
}
function listen() {
  var Rec = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!Rec) {
    pose("encourage");
    say("This browser has no speech recognition. Type the question instead.");
    var field = host.querySelector("input[type=text]");
    if (field) field.focus();
    return;
  }
  var rec = new Rec();
  rec.lang = "en-US";
  rec.interimResults = false;
  pose("listening");
  status.textContent = "Listening";
  rec.onresult = function (event) {
    var text = event.results && event.results[0] && event.results[0][0] ? event.results[0][0].transcript : "";
    pose("thinking");
    status.textContent = session.voice ? "Voice on, calm pace" : "Voice is off";
    if (text) ask(text);
    else {
      pose("encourage");
      say("I heard nothing. Type the question instead.");
    }
  };
  rec.onerror = function () {
    pose("encourage");
    status.textContent = session.voice ? "Voice on, calm pace" : "Voice is off";
    say("I could not hear that. Type it instead.");
  };
  try { rec.start(); } catch (err) {
    pose("encourage");
    say("The microphone did not start. Type the question instead.");
  }
}

monkey.addEventListener("click", function () {
  if (host.classList.contains("is-greeting")) {
    endGreet();
    return;
  }
  if (monkey.dataset.dragged === "true") {
    monkey.dataset.dragged = "false";
    return;
  }
  if (panel.hidden) openPanel(false);
  else closePanel();
});
host.querySelector("[data-close]").addEventListener("click", closePanel);
host.querySelector("[data-hide]").addEventListener("click", function () {
  session.hidden = true;
  host.hidden = true;
  closePanel();
  save();
});
host.querySelector("form").addEventListener("submit", function (event) {
  event.preventDefault();
  var input = host.querySelector("input[type=text]");
  var text = input.value.trim();
  if (!text) return;
  input.value = "";
  ask(text);
});
host.querySelector("[data-mic]").addEventListener("click", listen);
host.querySelector("[data-rate]").addEventListener("input", function (event) {
  session.rate = Number(event.target.value);
  save();
});
host.querySelector("[data-pitch]").addEventListener("input", function (event) {
  session.pitch = Number(event.target.value);
  save();
});
host.querySelector("[data-voice-pick]").addEventListener("change", function (event) {
  session.voiceName = event.target.value;
  save();
});
host.querySelector("[data-sound]").addEventListener("click", function () {
  var on = false;
  try { on = localStorage.getItem("ba-sound") === "on"; } catch (err) { on = false; }
  setSound(!on);
});
host.querySelector("[data-pause]").addEventListener("click", pauseRead);
host.querySelector("[data-resume]").addEventListener("click", resumeRead);
host.querySelector("[data-next-section]").addEventListener("click", nextSection);
host.querySelector("[data-stop]").addEventListener("click", stopSpeech);
document.addEventListener("keydown", function (event) {
  if (event.key === "Escape" && !panel.hidden && document.body.dataset.tour !== "open") closePanel();
});
document.addEventListener("ba-open-guide", function () { openPanel(false); });
document.addEventListener("ba-ready", onReady);
if (window.speechSynthesis) {
  fillVoices();
  window.speechSynthesis.addEventListener("voiceschanged", fillVoices);
}
window.addEventListener("resize", applyDock);
applyDock();

monkey.addEventListener("pointerdown", function (event) {
  if (event.button != null && event.button !== 0) return;
  var rect = host.getBoundingClientRect();
  drag = { x: event.clientX, y: event.clientY, left: rect.left, top: rect.top, moved: false, id: event.pointerId };
  try { monkey.setPointerCapture(event.pointerId); } catch (err) { /* ignore */ }
});
window.addEventListener("pointermove", function (event) {
  if (!drag || (drag.id != null && event.pointerId !== drag.id)) return;
  var dx = event.clientX - drag.x;
  var dy = event.clientY - drag.y;
  if (Math.abs(dx) + Math.abs(dy) > 8) drag.moved = true;
  if (!drag.moved) return;
  var left = Math.max(0, Math.min(window.innerWidth - host.offsetWidth, drag.left + dx));
  var top = Math.max(0, Math.min(window.innerHeight - host.offsetHeight, drag.top + dy));
  host.style.left = left + "px";
  host.style.top = top + "px";
  host.style.right = "auto";
  host.style.bottom = "auto";
});
window.addEventListener("pointerup", function (event) {
  if (!drag || (drag.id != null && event.pointerId !== drag.id)) return;
  if (drag.moved) {
    monkey.dataset.dragged = "true";
    var rect = host.getBoundingClientRect();
    session.x = Math.round(rect.left);
    session.y = Math.round(rect.top);
    save();
  }
  drag = null;
});

fetch(new URL("kb/index.json", base))
  .then(function (response) { return response.json(); })
  .then(function (data) {
    kb = data;
    if (window.BA_CATALOG) onReady();
  })
  .catch(function () { kb = null; });

if (session.hidden) host.hidden = true;
setVoice(false);

var nudge = document.createElement("div");
nudge.className = "ba-nudge";
nudge.hidden = true;
host.appendChild(nudge);
var pokeTimer = 0;
var greetClosed = false;

function storedFlag(key) {
  try { return localStorage.getItem(key); } catch (err) { return null; }
}
function pokeOff() { return storedFlag("ba-poke-off") === "1"; }
function pokeCount() { return Number(storedFlag("ba-poke-count") || "0") || 0; }
function shotMode() {
  try { return new URLSearchParams(location.search).get("shot") || ""; } catch (err) { return ""; }
}
function hideNudge() {
  nudge.hidden = true;
  nudge.innerHTML = "";
}
function endGreet() {
  if (!host.classList.contains("is-greeting")) return;
  greetClosed = true;
  if (window.speechSynthesis) window.speechSynthesis.cancel();
  host.classList.remove("is-greeting");
  host.style.left = "";
  host.style.top = "";
  host.style.right = "";
  host.style.transform = "";
  hideNudge();
  pose("encourage");
  applyDock();
  schedulePoke();
}
function beginGreet() {
  var force = shotMode() === "greet";
  if (!force && storedFlag("ba-greet-done") === "1") {
    schedulePoke();
    return;
  }
  if (!force) {
    try { localStorage.setItem("ba-greet-done", "1"); } catch (err) { return; }
  }
  greetClosed = false;
  host.classList.add("is-greeting");
  host.style.right = "auto";
  host.style.bottom = "auto";
  host.style.left = "50%";
  host.style.top = "46%";
  host.style.transform = "translate(-50%, -50%)";
  pose("greeting");
  nudge.hidden = false;
  nudge.innerHTML = "<p>Welcome to CypherMonkey Labs. I am your BA guide. I only repeat the notes in this lab.</p>" +
    '<div class="ba-nudge-actions"><button type="button" data-hear>Hear it</button><button type="button" data-dock>Dock on the right</button></div>';
  if (!force) window.setTimeout(function () { if (!greetClosed) endGreet(); }, 8000);
}
function schedulePoke() {
  if (shotMode() === "poke") {
    showPoke();
    return;
  }
  if (shotMode() === "greet" || pokeOff() || pokeCount() >= 3) return;
  window.clearTimeout(pokeTimer);
  var wait = 120000 + Math.floor(Math.random() * 180000);
  pokeTimer = window.setTimeout(showPoke, wait);
}
function showPoke() {
  var force = shotMode() === "poke";
  if (!force && (pokeOff() || pokeCount() >= 3)) return;
  if (!force && (document.body.dataset.tour === "open" || document.body.dataset.menu === "open" || !panel.hidden || host.classList.contains("is-greeting"))) {
    pokeTimer = window.setTimeout(showPoke, 20000);
    return;
  }
  if (!force) {
    try { localStorage.setItem("ba-poke-count", String(pokeCount() + 1)); } catch (err) { return; }
  }
  pose("encourage");
  nudge.hidden = false;
  nudge.innerHTML = "<p>I can read this page with you, or stay quiet.</p>" +
    '<div class="ba-nudge-actions"><button type="button" data-poke="read">Read this page</button>' +
    '<button type="button" data-poke="later">Not now</button><button type="button" data-poke="stop">Stop offering</button></div>';
}
nudge.addEventListener("click", function (event) {
  event.stopPropagation();
  if (event.target.closest("[data-hear]")) {
    if (!window.speechSynthesis) {
      var copy = nudge.querySelector("p");
      if (copy) copy.textContent = "This browser has no speech synthesis. The words stay on screen.";
      return;
    }
    window.speechSynthesis.cancel();
    var utter = new SpeechSynthesisUtterance("Welcome to CypherMonkey Labs. I am your BA guide. I only repeat the notes in this lab.");
    utter.rate = 0.9;
    utter.pitch = 0.96;
    var list = window.speechSynthesis.getVoices();
    var picked = list.filter(function (voice) { return voice.name === session.voiceName; })[0];
    if (picked) utter.voice = picked;
    window.speechSynthesis.speak(utter);
    return;
  }
  if (event.target.closest("[data-dock]")) endGreet();
  if (event.target.closest("[data-poke='read']")) {
    hideNudge();
    openPanel(true);
    setVoice(true);
    startReadAlong(0);
  }
  if (event.target.closest("[data-poke='later']")) {
    hideNudge();
    schedulePoke();
  }
  if (event.target.closest("[data-poke='stop']")) {
    try { localStorage.setItem("ba-poke-off", "1"); } catch (err) { /* ignore */ }
    hideNudge();
  }
});
document.addEventListener("canon-tour-finished", beginGreet);
document.addEventListener("canon-tour-skipped", schedulePoke);
if (shotMode() === "greet") beginGreet();
else if (shotMode() === "poke") showPoke();
else if (storedFlag("canon-tour-done") === "1" && storedFlag("ba-greet-done") !== "1") beginGreet();
else if (storedFlag("canon-tour-done")) schedulePoke();
try {
  if (localStorage.getItem("ba-sound") === "on") {
    document.addEventListener("pointerdown", function () { setSound(true); }, { once: true });
  }
} catch (err) { /* ignore */ }
