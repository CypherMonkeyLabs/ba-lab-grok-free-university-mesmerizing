/* First-visit tour. Stored in this browser. Help can open it again. */
(function () {
  var STEPS = [
    {
      title: "Welcome",
      text: "Welcome to CypherMonkey Labs. I am the study guide for this free business analysis lab. You can read every room in silence. Voice is optional.",
      voice: true
    },
    {
      title: "Menu",
      text: "The top-left button opens the menu. It slides in from the left. Text size, theme, text color, motion, and search live there. Escape, or a tap outside, closes it. On a phone, Menu is the first button in the bottom bar."
    },
    {
      title: "Course",
      text: "Start here is the short path. When you open the guide, it can finish a room in about ten minutes, walk the full course, or send you to the downloads."
    },
    {
      title: "Guide",
      text: "The monkey docks on the right edge. Drag it. This browser remembers the spot. The monkey hides while the menu is open. Open it to ask a question, use the microphone, or have a section read aloud."
    },
    {
      title: "Downloads",
      text: "Every room and section has an Export button for PDF, HTML, DOCX, PPTX, and JSON, whichever of those fits that room. The Downloads page lists every file, plus Open app and View repo. Each file carries the disclaimer and stands on its own."
    },
    {
      title: "Light and sound",
      text: "Aurora is the bright theme. Midnight is the dark one. You can reduce motion from the menu. A soft sound stays off until you tap once. One tap is enough to enable it.",
      sound: true,
      ok: true
    }
  ];

  var overlay = document.createElement("div");
  overlay.className = "ba-tour";
  overlay.hidden = true;
  overlay.setAttribute("role", "dialog");
  overlay.setAttribute("aria-modal", "true");
  overlay.setAttribute("aria-labelledby", "ba-tour-title");
  overlay.innerHTML =
    '<div class="ba-tour-card">' +
    '<p class="ba-tour-step" id="ba-tour-step"></p>' +
    '<h2 id="ba-tour-title"></h2>' +
    '<p id="ba-tour-text"></p>' +
    '<div class="ba-tour-actions"></div>' +
    "</div>";
  document.body.appendChild(overlay);

  var stepNode = overlay.querySelector("#ba-tour-step");
  var titleNode = overlay.querySelector("#ba-tour-title");
  var textNode = overlay.querySelector("#ba-tour-text");
  var actions = overlay.querySelector(".ba-tour-actions");
  var index = 0;

  function shouldShow() {
    var params = new URLSearchParams(location.search);
    if (params.get("tour") === "1") return true;
    if (navigator.webdriver) return false;
    try {
      if (localStorage.getItem("ba-onboard") === "done") return false;
    } catch (err) { /* ignore */ }
    return true;
  }

  function speakGreeting() {
    if (!window.speechSynthesis) {
      textNode.textContent = STEPS[0].text + " This browser has no speech voice, so the greeting stays as text.";
      return;
    }
    var utter = new SpeechSynthesisUtterance("Welcome to CypherMonkey Labs. I am the study guide. Voice stays off until you ask for it, and the soft sound stays off until you tap.");
    utter.rate = 0.9;
    utter.pitch = 0.96;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
  }

  function enableSound() {
    try { localStorage.setItem("ba-sound", "on"); } catch (err) { /* ignore */ }
    if (window.BA_SET_SOUND) window.BA_SET_SOUND(true);
  }

  function finish(openGuide) {
    try { localStorage.setItem("ba-onboard", "done"); } catch (err) { /* ignore */ }
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    overlay.hidden = true;
    delete document.body.dataset.tour;
    if (openGuide) document.dispatchEvent(new CustomEvent("ba-open-guide"));
  }

  function button(label, className) {
    var node = document.createElement("button");
    node.type = "button";
    node.className = className || "";
    node.textContent = label;
    return node;
  }

  function render() {
    var step = STEPS[index];
    stepNode.textContent = "Step " + (index + 1) + " of " + STEPS.length;
    titleNode.textContent = step.title;
    textNode.textContent = step.text;
    actions.innerHTML = "";
    if (step.voice) {
      var hear = button("Hear the greeting");
      hear.addEventListener("click", speakGreeting);
      actions.appendChild(hear);
    }
    if (step.sound) {
      var on = button("Enable soft sound");
      on.addEventListener("click", function () {
        enableSound();
        on.textContent = "Soft sound on";
      });
      actions.appendChild(on);
      var muted = button("Keep muted");
      muted.addEventListener("click", function () {
        try { localStorage.setItem("ba-sound", "off"); } catch (err) { /* ignore */ }
        if (window.BA_SET_SOUND) window.BA_SET_SOUND(false);
        muted.textContent = "Staying muted";
      });
      actions.appendChild(muted);
    }
    var skip = button("Skip");
    skip.addEventListener("click", function () { finish(false); });
    actions.appendChild(skip);
    var next = button(step.ok ? "OK" : "Next", "primary");
    next.addEventListener("click", function () {
      if (step.ok || index >= STEPS.length - 1) finish(true);
      else {
        index += 1;
        render();
      }
    });
    actions.appendChild(next);
    next.focus();
  }

  function show(start) {
    index = start || 0;
    overlay.hidden = false;
    document.body.dataset.tour = "open";
    render();
  }

  overlay.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      finish(false);
      return;
    }
    if (event.key !== "Tab") return;
    var nodes = overlay.querySelectorAll("button");
    if (!nodes.length) return;
    var first = nodes[0];
    var last = nodes[nodes.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  window.BA_SHOW_TOUR = function () { show(0); };

  function maybe() {
    if (shouldShow()) show(0);
  }
  document.addEventListener("ba-ready", maybe);
  if (window.BA_CATALOG) maybe();
})();
