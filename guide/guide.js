/**
 * Study companion. Facts come from guide/kb, built from the catalog.
 * window.BA_GUIDE.endpoint stays null. Voice stays off until the learner turns it on.
 */
import { answerQuestion, roomBlurb } from "./engine.mjs";

var base = new URL(".", import.meta.url);
var root = document.documentElement;
var endpoint = window.BA_GUIDE && typeof window.BA_GUIDE.endpoint === "string" ? window.BA_GUIDE.endpoint : null;
window.BA_GUIDE = { endpoint: endpoint };

var session = load("ba-guide") || { badges: [], course: 0, voice: false, nudge: false, quiz: [] };
var kb = null;
var open = false;
var quizIndex = 0;
var cardIndex = 0;

var host = document.createElement("div");
host.className = "ba-guide";
host.innerHTML =
  '<div class="ba-nudge" hidden><p>One-hour path is on Start here. I can walk it.</p><button type="button" data-nudge-go>Show me</button> <button type="button" data-nudge-hide>Dismiss</button></div>' +
  '<button type="button" class="ba-monkey" aria-expanded="false" aria-controls="ba-guide-panel" aria-label="Study monkey. Open notes for this room.">' +
  monkeySvg() + "</button>" +
  '<section class="ba-panel" id="ba-guide-panel" hidden role="dialog" aria-modal="false" aria-labelledby="ba-guide-title">' +
  '<header><div><h2 id="ba-guide-title">Study monkey</h2><p class="ba-status">Notes in this browser</p></div>' +
  '<div><button type="button" data-voice aria-pressed="false">Voice off</button><button type="button" data-close>Close</button></div></header>' +
  '<div class="ba-log" role="log" aria-label="Messages"></div>' +
  '<div class="ba-chips" role="group" aria-label="Suggestions"></div>' +
  '<form class="ba-form"><input type="text" aria-label="Ask about this room" placeholder="Ask about this room" autocomplete="off"><button type="submit">Send</button></form>' +
  "</section>";
document.body.appendChild(host);

var css = document.createElement("link");
css.rel = "stylesheet";
css.href = new URL("guide.css", base).href;
document.head.appendChild(css);

var panel = host.querySelector(".ba-panel");
var log = host.querySelector(".ba-log");
var chips = host.querySelector(".ba-chips");
var form = host.querySelector(".ba-form");
var input = form.querySelector("input");
var monkey = host.querySelector(".ba-monkey");
var nudge = host.querySelector(".ba-nudge");
var voiceBtn = host.querySelector("[data-voice]");

function load(key) {
  try { return JSON.parse(localStorage.getItem(key) || "null"); } catch (err) { return null; }
}
function save() {
  try { localStorage.setItem("ba-guide", JSON.stringify(session)); } catch (err) { /* ignore */ }
}
function page() { return document.body.dataset.page || "home"; }
function say(text, who) {
  var bubble = document.createElement("p");
  bubble.className = "ba-bubble " + (who || "bot");
  bubble.textContent = text;
  log.appendChild(bubble);
  log.scrollTop = log.scrollHeight;
  if (who !== "me" && session.voice) speak(text);
}
function speak(text) {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(new SpeechSynthesisUtterance(text));
}
function setChips(list) {
  chips.innerHTML = "";
  list.forEach(function (label) {
    var button = document.createElement("button");
    button.type = "button";
    button.textContent = label;
    button.addEventListener("click", function () { onChip(label); });
    chips.appendChild(button);
  });
}
function greet() {
  log.innerHTML = "";
  var room = kb ? roomBlurb(kb, page()) : { blurb: "Loading notes.", chips: [] };
  say(room.blurb + " Voice is off until you turn it on.");
  setChips((room.chips || []).concat(["Tour", "Quiz", "Flashcards", "Teach me", "Fun fact", "Daily", "Course", "Badges"]));
}
function onChip(label) {
  var map = {
    "Tour": startTour,
    "Quiz": startQuiz,
    "Flashcards": startCards,
    "Teach me": teach,
    "Fun fact": funFact,
    "Daily": daily,
    "Course": course,
    "Badges": badges,
    "Start the course": course
  };
  if (map[label]) map[label]();
  else ask(label);
}
function ask(text) {
  say(text, "me");
  if (!kb) {
    say("The notes have not loaded yet.");
    return;
  }
  var result = answerQuestion(text, kb, page());
  if (!result.matched && endpoint) {
    fetch(endpoint, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ message: text, href: location.href, context: page() })
    }).then(function (response) { return response.json(); }).then(function (body) {
      say(body && body.text ? body.text : "The cloud hook returned no text.");
    }).catch(function () {
      say(result.text);
    });
    return;
  }
  var line = result.text;
  if (result.href) line += " Open " + result.href + " for the note.";
  say(line);
}
function startTour() {
  var steps = [
    { href: "index.html", text: "Home shows the path and the spinning study objects. On a phone they sit still." },
    { href: "start.html", text: "Start here is the one-hour sequence." },
    { href: "babok.html", text: "BABOK is the map of the six knowledge areas." },
    { href: "practice.html", text: "Practice keeps score in this browser." },
    { href: "downloads.html", text: "Downloads lists every sheet and its size." }
  ];
  var params = new URLSearchParams(location.search);
  var step = Number(params.get("tour") || "0");
  var item = steps[step] || steps[0];
  say("Tour " + (step + 1) + " of " + steps.length + ". " + item.text);
  if (step < steps.length - 1) {
    var next = document.createElement("p");
    next.className = "ba-bubble bot";
    var link = document.createElement("a");
    var file = location.pathname.split("/").pop() || "index.html";
    link.href = item.href.indexOf(file) !== -1 && file === item.href ? steps[step + 1].href + "?tour=" + (step + 1) : steps[step].href + "?tour=" + step;
    if ((location.pathname.split("/").pop() || "index.html") !== item.href) {
      link.href = item.href + "?tour=" + step;
      link.textContent = "Go to this stop";
    } else {
      link.href = steps[step + 1].href + "?tour=" + (step + 1);
      link.textContent = "Next stop";
    }
    next.appendChild(link);
    log.appendChild(next);
  } else {
    say("Tour finished.");
    addBadge("Tour finished");
  }
}
function startQuiz() {
  if (!kb || !kb.quizzes.length) return say("No quiz in the notes.");
  var item = kb.quizzes[quizIndex % kb.quizzes.length];
  say(item.q);
  item.choices.forEach(function (choice, index) {
    var button = document.createElement("button");
    button.type = "button";
    button.textContent = choice;
    button.addEventListener("click", function () {
      var ok = index === item.answer;
      say(ok ? "Yes. " + item.why : "Not that one. " + item.why);
      if (ok) addBadge("Guide quiz answer");
      quizIndex += 1;
      session.quiz.push(ok ? 1 : 0);
      save();
    });
    var row = document.createElement("p");
    row.className = "ba-bubble bot";
    row.appendChild(button);
    log.appendChild(row);
  });
}
function startCards() {
  if (!kb || !kb.cards.length) return;
  var card = kb.cards[cardIndex % kb.cards.length];
  say(card.front);
  var button = document.createElement("button");
  button.type = "button";
  button.textContent = "Show back";
  button.addEventListener("click", function () {
    say(card.back);
    cardIndex += 1;
  });
  var row = document.createElement("p");
  row.className = "ba-bubble bot";
  row.appendChild(button);
  log.appendChild(row);
}
function teach() {
  if (!kb) return;
  var found = kb.facts.filter(function (fact) { return fact.page === page(); }).slice(0, 3);
  if (!found.length) return say(roomBlurb(kb, page()).blurb);
  found.forEach(function (fact) { say(fact.title + ". " + fact.text); });
}
function funFact() {
  if (!kb) return;
  var pool = kb.facts.filter(function (fact) { return fact.text.length < 280; });
  var fact = pool[Math.floor(Math.random() * pool.length)];
  say(fact ? fact.title + ": " + fact.text : "No short note yet.");
}
function daily() {
  if (!kb || !kb.quizzes.length) return;
  var day = new Date().toISOString().slice(0, 10);
  var index = 0;
  for (var i = 0; i < day.length; i += 1) index = (index + day.charCodeAt(i)) % kb.quizzes.length;
  var item = kb.quizzes[index];
  say("Daily challenge for " + day + ". " + item.q);
  quizIndex = index;
  startQuiz();
}
function course() {
  if (!kb) return;
  var step = kb.course[session.course] || kb.course[0];
  if (!step) return say("The course is not in the notes.");
  say("Minute block " + step.minutes + ". " + step.title + ". " + step.text);
  var link = document.createElement("a");
  link.href = step.href;
  link.textContent = "Open " + step.title;
  var row = document.createElement("p");
  row.className = "ba-bubble bot";
  row.appendChild(link);
  log.appendChild(row);
  var next = document.createElement("button");
  next.type = "button";
  next.textContent = "I read this. Next block.";
  next.addEventListener("click", function () {
    session.course = Math.min(kb.course.length, session.course + 1);
    save();
    if (session.course >= kb.course.length) {
      say("That is the hour. Practice is the next room when you want it.");
      addBadge("Course finished");
    } else course();
  });
  var row2 = document.createElement("p");
  row2.className = "ba-bubble bot";
  row2.appendChild(next);
  log.appendChild(row2);
}
function badges() {
  say(session.badges.length ? "Badges: " + session.badges.join(", ") : "No badges yet. Finish a tour, a quiz, or the course.");
}
function addBadge(name) {
  if (session.badges.indexOf(name) === -1) session.badges.push(name);
  save();
}
function setOpen(next) {
  open = next;
  panel.hidden = !open;
  monkey.setAttribute("aria-expanded", open ? "true" : "false");
  if (open) {
    nudge.hidden = true;
    input.focus();
  }
}
function place() {
  var footer = document.getElementById("site-footer");
  if (!footer) return;
  var top = footer.getBoundingClientRect().top;
  if (top < 88) {
    host.style.visibility = "hidden";
    return;
  }
  if (document.body.dataset.menu !== "open") host.style.visibility = "";
  var overlap = Math.max(0, window.innerHeight - top);
  host.style.bottom = (12 + overlap) + "px";
}
function monkeySvg() {
  return '<svg viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="34" r="16" fill="#fbbf24"/><circle cx="18" cy="24" r="7" fill="#f59e0b"/><circle cx="46" cy="24" r="7" fill="#f59e0b"/><circle cx="26" cy="32" r="2.2" fill="#1c1917"/><circle cx="38" cy="32" r="2.2" fill="#1c1917"/><path d="M26 40c2.2 3 9.8 3 12 0" fill="none" stroke="#1c1917" stroke-width="2" stroke-linecap="round"/></svg>';
}

monkey.addEventListener("click", function () {
  setOpen(!open);
  if (open && log.childElementCount === 0) greet();
  else if (open) funFact();
});
host.querySelector("[data-close]").addEventListener("click", function () { setOpen(false); monkey.focus(); });
host.querySelector("[data-nudge-hide]").addEventListener("click", function () {
  nudge.hidden = true;
  session.nudge = true;
  save();
});
host.querySelector("[data-nudge-go]").addEventListener("click", function () {
  nudge.hidden = true;
  session.nudge = true;
  save();
  setOpen(true);
  greet();
  course();
});
voiceBtn.addEventListener("click", function () {
  session.voice = !session.voice;
  voiceBtn.setAttribute("aria-pressed", session.voice ? "true" : "false");
  voiceBtn.textContent = session.voice ? "Voice on" : "Voice off";
  save();
  if (!session.voice && window.speechSynthesis) window.speechSynthesis.cancel();
});
form.addEventListener("submit", function (event) {
  event.preventDefault();
  var text = input.value.trim();
  if (!text) return;
  input.value = "";
  ask(text);
});
document.addEventListener("keydown", function (event) {
  if (event.key === "Escape" && open) setOpen(false);
});
window.addEventListener("scroll", place, { passive: true });
window.addEventListener("resize", place);
document.addEventListener("ba-ready", place);
place();

if (session.voice) {
  voiceBtn.setAttribute("aria-pressed", "true");
  voiceBtn.textContent = "Voice on";
}

fetch(new URL("kb/index.json", base).href)
  .then(function (response) { return response.json(); })
  .then(function (data) {
    kb = data;
    if (new URLSearchParams(location.search).get("tour") != null) {
      setOpen(true);
      greet();
      startTour();
    }
  })
  .catch(function () {
    say("The study notes file did not load.");
  });

setTimeout(function () {
  if (!session.nudge && !open) nudge.hidden = false;
}, 20000);
