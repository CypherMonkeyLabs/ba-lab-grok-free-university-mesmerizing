/**
 * Study companion. Facts come from guide/kb. Voice stays off until a choice asks for it.
 * window.BA_GUIDE.endpoint stays null unless a page sets it first.
 */
import { answerQuestion, roomBlurb } from "./engine.mjs";

var base = new URL(".", import.meta.url);
var prior = window.BA_GUIDE && typeof window.BA_GUIDE.endpoint === "string" ? window.BA_GUIDE.endpoint : null;
window.BA_GUIDE = { endpoint: prior };

var session = load("ba-guide") || { badges: [], course: 0, voice: false, hidden: false, rate: 0.92, pitch: 1, voiceName: "" };
var kb = null;
var quizIndex = 0;
var speaking = [];
var speakIndex = 0;
var paused = false;

var host = document.createElement("div");
host.className = "ba-guide";
host.innerHTML =
  '<button type="button" class="ba-monkey" aria-expanded="false" aria-controls="ba-guide-panel" aria-label="BA guide">' +
  monkeySvg() + "</button>" +
  '<section class="ba-panel" id="ba-guide-panel" hidden role="dialog" aria-modal="false" aria-labelledby="ba-guide-title">' +
  '<header><div><h2 id="ba-guide-title">BA guide</h2><p class="ba-status">Voice is off</p></div>' +
  '<div class="ba-actions"><button type="button" data-hide>Hide</button><button type="button" data-close>Close</button></div></header>' +
  '<div class="ba-log" role="log" aria-live="polite"></div>' +
  '<div class="ba-voice" hidden>' +
  '<label>Voice <select data-voice-pick></select></label>' +
  '<label>Rate <input data-rate type="range" min="0.7" max="1.15" step="0.05" value="0.92"></label>' +
  '<label>Pitch <input data-pitch type="range" min="0.8" max="1.2" step="0.05" value="1"></label>' +
  '<button type="button" data-pause>Pause</button><button type="button" data-stop>Stop</button>' +
  "</div>" +
  '<form class="ba-form"><input type="text" aria-label="Ask about this room" placeholder="Ask about this room" autocomplete="off"><button type="submit">Send</button></form>' +
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
var voiceBox = host.querySelector(".ba-voice");

function load(key) {
  try { return JSON.parse(localStorage.getItem(key) || "null"); } catch (err) { return null; }
}
function save() {
  try { localStorage.setItem("ba-guide", JSON.stringify(session)); } catch (err) { /* ignore */ }
}
function page() { return document.body.dataset.page || "home"; }
function mood(name) {
  monkey.dataset.mood = name;
  window.setTimeout(function () { if (monkey.dataset.mood === name) monkey.dataset.mood = "idle"; }, 900);
}

function monkeySvg() {
  return '<svg viewBox="0 0 80 80" aria-hidden="true">' +
    '<ellipse class="ear left" cx="16" cy="36" rx="10" ry="12"/>' +
    '<ellipse class="ear right" cx="64" cy="36" rx="10" ry="12"/>' +
    '<ellipse class="face" cx="40" cy="42" rx="22" ry="20"/>' +
    '<ellipse class="muzzle" cx="40" cy="50" rx="12" ry="9"/>' +
    '<g class="specs"><circle cx="32" cy="40" r="7"/><circle cx="48" cy="40" r="7"/><path d="M39 40h2"/></g>' +
    '<circle class="eye" cx="32" cy="40" r="1.8"/><circle class="eye" cx="48" cy="40" r="1.8"/>' +
    '<path class="smile" d="M34 52c2 2 8 2 12 0"/>' +
    '<path class="arm" d="M18 58c6 8 10 6 12 0"/>' +
    "</svg>";
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
  log.scrollTop = log.scrollHeight;
  if (who !== "me" && session.voice) speak(text, bubble);
  return bubble;
}
function rankedVoices() {
  var voices = window.speechSynthesis ? window.speechSynthesis.getVoices() : [];
  return voices.slice().sort(function (a, b) { return scoreVoice(b) - scoreVoice(a); });
}
function scoreVoice(voice) {
  var name = (voice.name + " " + voice.lang).toLowerCase();
  var score = 0;
  if (name.indexOf("natural") !== -1) score += 50;
  if (name.indexOf("aria") !== -1 || name.indexOf("jenny") !== -1 || name.indexOf("guy") !== -1) score += 40;
  if (name.indexOf("google") !== -1 && name.indexOf("en") !== -1) score += 30;
  if (name.indexOf("samantha") !== -1 || name.indexOf("karen") !== -1 || name.indexOf("daniel") !== -1) score += 28;
  if (name.indexOf("enhanced") !== -1 || name.indexOf("premium") !== -1 || name.indexOf("neural") !== -1) score += 20;
  if (name.indexOf("en") === 0 || name.indexOf("en-") !== -1) score += 10;
  return score;
}
function fillVoices() {
  var select = host.querySelector("[data-voice-pick]");
  if (!select || !window.speechSynthesis) return;
  var voices = rankedVoices();
  select.innerHTML = "";
  voices.forEach(function (voice) {
    var option = document.createElement("option");
    option.value = voice.name;
    option.textContent = voice.name;
    if (session.voiceName ? voice.name === session.voiceName : option === select.firstChild) option.selected = true;
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
  utter.rate = Number(session.rate) || 0.92;
  utter.pitch = Number(session.pitch) || 1;
  utter.onend = function () {
    speakIndex += 1;
    if (!paused) speakNext();
  };
  window.speechSynthesis.speak(utter);
}
function stopSpeech() {
  speaking = [];
  if (window.speechSynthesis) window.speechSynthesis.cancel();
}
function setVoice(on) {
  session.voice = !!on;
  status.textContent = session.voice ? "Voice on, in this browser" : "Voice is off";
  voiceBox.hidden = !session.voice;
  save();
}

var CHOICES = [
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
  var bubble = say("Welcome to CypherMonkey Labs, I'm your BA guide. Pick a way to study. I will not speak unless you choose a clip or turn voice on.");
  var wrap = document.createElement("div");
  wrap.className = "choice-grid";
  CHOICES.forEach(function (pair) {
    var button = document.createElement("button");
    button.type = "button";
    button.textContent = pair[0];
    button.addEventListener("click", function () { onChoice(pair[1], pair[0]); });
    wrap.appendChild(button);
  });
  bubble.appendChild(wrap);
  mood("wave");
}
function onChoice(id, label) {
  if (id === "mute") {
    setVoice(false);
    stopSpeech();
    say("Muted. The notes stay on the page. Open a room and read the five-minute block.");
    return;
  }
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
  ask(label);
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
  say(room.blurb + " Ask a shorter question if you want a single note.");
}
function startQuiz() {
  if (!kb || !kb.quizzes || !kb.quizzes.length) return say("No quiz loaded.");
  quizIndex = quizIndex % kb.quizzes.length;
  var item = kb.quizzes[quizIndex];
  var bubble = say(item.q);
  item.choices.forEach(function (choice, index) {
    var button = document.createElement("button");
    button.type = "button";
    button.textContent = choice;
    button.addEventListener("click", function () {
      var ok = index === item.answer;
      say(ok ? "Yes. " + item.why : "Not that one. " + item.why);
      if (ok) mood("cheer");
      quizIndex += 1;
    });
    bubble.appendChild(document.createElement("br"));
    bubble.appendChild(button);
  });
}
function ask(text) {
  say(text, "me");
  if (!kb) return say("The notes have not loaded yet.");
  var result = answerQuestion(text, kb, page());
  if (!result.matched && window.BA_GUIDE.endpoint) {
    fetch(window.BA_GUIDE.endpoint, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ message: text, href: location.href, context: page() })
    }).then(function (response) { return response.json(); }).then(function (body) {
      say(body && body.text ? body.text : "The cloud hook returned no text.");
    }).catch(function () { say(result.text); });
    return;
  }
  say(result.text + (result.href ? " Open " + result.href + " for the note." : ""));
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
function openPanel() {
  host.hidden = false;
  session.hidden = false;
  panel.hidden = false;
  monkey.setAttribute("aria-expanded", "true");
  if (!log.childElementCount) welcome();
  save();
  mood("wave");
}
function closePanel() {
  panel.hidden = true;
  monkey.setAttribute("aria-expanded", "false");
  stopSpeech();
}

monkey.addEventListener("click", function () {
  if (monkey.dataset.dragged === "true") {
    monkey.dataset.dragged = "false";
    return;
  }
  if (panel.hidden) openPanel();
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
host.querySelector("[data-pause]").addEventListener("click", function () {
  if (!window.speechSynthesis) return;
  if (window.speechSynthesis.paused) window.speechSynthesis.resume();
  else window.speechSynthesis.pause();
});
host.querySelector("[data-stop]").addEventListener("click", stopSpeech);
document.addEventListener("keydown", function (event) {
  if (event.key === "Escape" && !panel.hidden) closePanel();
});
document.addEventListener("ba-open-guide", function () { openPanel(); });
window.addEventListener("scroll", function () { mood("wave"); }, { passive: true });
if (window.speechSynthesis) {
  fillVoices();
  window.speechSynthesis.addEventListener("voiceschanged", fillVoices);
}

var dragged = false;
function place() {
  if (dragged) return;
  if (window.matchMedia("(max-width: 800px)").matches) {
    host.style.top = "auto";
    host.style.left = "auto";
    host.style.right = "0.15rem";
    host.style.bottom = "0.2rem";
    host.style.visibility = "";
    return;
  }
  var footer = document.getElementById("site-footer");
  var top = footer ? footer.getBoundingClientRect().top : window.innerHeight;
  if (top < 120) {
    host.style.visibility = "hidden";
    return;
  }
  host.style.visibility = "";
  var overlap = Math.max(0, window.innerHeight - top);
  host.style.right = "0.75rem";
  host.style.bottom = (16 + overlap) + "px";
  host.style.top = "auto";
  host.style.left = "auto";
}
window.addEventListener("scroll", place, { passive: true });
window.addEventListener("resize", place);
document.addEventListener("ba-ready", place);
place();

var drag = null;
monkey.addEventListener("pointerdown", function (event) {
  if (window.matchMedia("(max-width: 800px)").matches) return;
  drag = { x: event.clientX, y: event.clientY, left: host.getBoundingClientRect().left, top: host.getBoundingClientRect().top, moved: false };
});
window.addEventListener("pointermove", function (event) {
  if (!drag) return;
  var dx = event.clientX - drag.x;
  var dy = event.clientY - drag.y;
  if (Math.abs(dx) + Math.abs(dy) > 8) drag.moved = true;
  if (!drag.moved) return;
  host.style.left = Math.max(8, drag.left + dx) + "px";
  host.style.top = Math.max(8, drag.top + dy) + "px";
  host.style.right = "auto";
  host.style.bottom = "auto";
});
window.addEventListener("pointerup", function () {
  if (drag && drag.moved) {
    monkey.dataset.dragged = "true";
    dragged = true;
  }
  drag = null;
});

fetch(new URL("kb/index.json", base))
  .then(function (response) { return response.json(); })
  .then(function (data) { kb = data; })
  .catch(function () { kb = null; });

if (session.hidden) host.hidden = true;
setVoice(false);
session.voice = false;
save();
