/* Renders each room from assets/data/catalog.json. Relative paths only. */
(function () {
  var page = document.body.dataset.page || "home";
  var main = document.getElementById("main");

  function esc(value) {
    return String(value == null ? "" : value).replace(/[&<>"']/g, function (ch) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch];
    });
  }
  function sourceLine(item) {
    if (!item || !item.source) return "";
    var asOf = item.asOf ? " · as of " + esc(item.asOf) : "";
    if (item.url) {
      return '<p class="source">Source: <a href="' + esc(item.url) + '">' + esc(item.source) + "</a>" + asOf + "</p>";
    }
    return '<p class="source">Source: ' + esc(item.source) + asOf + "</p>";
  }
  function card(item) {
    var points = (item.points || []).map(function (line) {
      return "<li>" + esc(line) + "</li>";
    }).join("");
    return '<article class="item" id="' + esc(item.id) + '">' +
      '<p class="level">' + esc(item.level || "note") + "</p>" +
      "<h3>" + esc(item.title) + "</h3>" +
      "<p>" + esc(item.summary) + "</p>" +
      (points ? "<ul>" + points + "</ul>" : "") +
      (item.tbd ? '<p class="tbd">To be confirmed: ' + esc(item.tbd) + "</p>" : "") +
      sourceLine(item) +
      "</article>";
  }
  function bySection(data, section) {
    return (data.items || []).filter(function (item) { return item.section === section; });
  }
  function listenButton(text) {
    return '<p><button type="button" class="btn" data-listen>Listen</button> <span class="meta">Speech stays off until you press Listen.</span></p>' +
      '<p class="listen-script meta">' + esc(text) + "</p>";
  }
  function bindListen(root, text) {
    var btn = root.querySelector("[data-listen]");
    if (!btn) return;
    var utter = null;
    btn.addEventListener("click", function () {
      if (!window.speechSynthesis) {
        btn.textContent = "Speech is not available in this browser";
        return;
      }
      if (speechSynthesis.speaking) {
        speechSynthesis.cancel();
        btn.textContent = "Listen";
        return;
      }
      utter = new SpeechSynthesisUtterance(text);
      utter.onend = function () { btn.textContent = "Listen"; };
      btn.textContent = "Stop";
      speechSynthesis.speak(utter);
    });
  }
  function sizeLabel(bytes) {
    if (!bytes && bytes !== 0) return "";
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  }

  function renderHome(data) {
    var steps = (data.course || []).map(function (step, index) {
      return "<li><a href=\"" + esc(step.href) + "\">" + esc(step.title) + "</a> · " + esc(step.minutes) + " min. " + esc(step.text) + "</li>";
    }).join("");
    main.innerHTML =
      '<section class="hero">' +
      '<div>' +
      '<p class="kicker">Business analysis · free study lab</p>' +
      "<h1>Business Analyst Free University</h1>" +
      "<p class=\"lede\">Notes from fundamentals through modeling, delivery, data, and credentials. Lucky is a student sharing what he is learning about systems, contact centers, and AI omni-channel work. This lab is not a vendor course and it is not for sale.</p>" +
      '<p class="actions"><a class="btn primary" href="start.html">Start here</a><a class="btn ghost" href="babok.html">BABOK map</a><a class="btn ghost" href="practice.html">Practice</a><a class="btn ghost" href="downloads.html">Downloads</a></p>' +
      listenButton(data.narration) +
      "</div>" +
      '<div class="stage3d" aria-hidden="true">' +
      '<div class="obj doc">📄<span>Brief</span></div>' +
      '<div class="obj flow">🔀<span>Flow</span></div>' +
      '<div class="obj card3">🗂️<span>Kanban</span></div>' +
      '<div class="obj funnel">🔻<span>Funnel</span></div>' +
      '<div class="obj bars">📊<span>Chart</span></div>' +
      '<div class="obj gear">⚙️<span>Gear</span></div>' +
      "</div></section>" +
      '<section><h2>One-hour path</h2><ol class="path-list">' + steps + "</ol></section>" +
      '<section><h2>Rooms</h2><div class="room-grid">' +
      (window.BA_FRAME ? window.BA_FRAME.sections : []).filter(function (s) { return s[0] !== "home"; }).map(function (s) {
        return '<a class="card" href="' + esc(s[2]) + '"><h3>' + esc(s[1]) + "</h3><p>" + esc(s[4]) + "</p></a>";
      }).join("") +
      "</div></section>";
    bindListen(main, data.narration);
  }

  function renderNotes(data, section, title, lede) {
    var items = bySection(data, section).map(card).join("");
    main.innerHTML = "<h1>" + esc(title) + "</h1><p class=\"lede\">" + esc(lede) + "</p><div class=\"card-grid\">" + items + "</div>";
  }

  function renderStart(data) {
    var steps = (data.course || []).map(function (step, index) {
      return '<article class="item"><p><span class="step-no">' + (index + 1) + "</span> " + esc(step.minutes) + " min</p><h3><a href=\"" + esc(step.href) + "\">" + esc(step.title) + "</a></h3><p>" + esc(step.text) + "</p></article>";
    }).join("");
    main.innerHTML =
      "<h1>Start here</h1>" +
      "<p class=\"lede\">About one hour if you read the path and skip the long rooms. Come back for the diagrams, games, and downloads.</p>" +
      listenButton(data.narration) +
      '<div class="card-grid">' + steps + "</div>" +
      '<section class="callout"><h2>How to use the lab</h2><ul>' +
      "<li>The top rail and the left wheel open the same rooms.</li>" +
      "<li>Text size, theme, text color, and motion stay in this browser.</li>" +
      "<li>The monkey at the lower right is a study companion. Voice is off until you turn it on.</li>" +
      "<li>If a fee or rule is marked to be confirmed, the public page did not show it on the check date.</li></ul></section>";
    bindListen(main, data.narration);
  }

  function renderCerts(data) {
    var blocks = (data.certs || []).map(function (cert) {
      var rows = (cert.facts || []).map(function (fact) {
        return "<li>" + esc(fact) + "</li>";
      }).join("");
      return '<article class="item" id="' + esc(cert.id) + '"><h3>' + esc(cert.title) + "</h3><p>" + esc(cert.summary) + "</p><ul>" + rows + "</ul>" +
        (cert.tbd ? '<p class="tbd">To be confirmed: ' + esc(cert.tbd) + "</p>" : "") +
        sourceLine(cert) + "</article>";
    }).join("");
    main.innerHTML = "<h1>Certifications</h1><p class=\"lede\">Fees below are copied from pages opened on 16 October 2026. They are in US dollars and IIBA says they can change. This lab does not repeat salary claims from vendor marketing.</p><div class=\"card-grid\">" + blocks + "</div>";
  }

  function renderGlossary(data) {
    var q = "";
    var list = document.createElement("div");
    function draw() {
      var needle = q.trim().toLowerCase();
      var rows = (data.glossary || []).filter(function (term) {
        return !needle || (term.term + " " + term.meaning).toLowerCase().indexOf(needle) !== -1;
      }).map(function (term) {
        return "<tr><th>" + esc(term.term) + "</th><td>" + esc(term.meaning) + sourceLine(term) + "</td></tr>";
      }).join("");
      list.innerHTML = '<table><tbody>' + rows + "</tbody></table>";
    }
    main.innerHTML = "<h1>Glossary</h1><p class=\"lede\">Short study definitions. They are not a substitute for the cited standard.</p>";
    var input = document.createElement("input");
    input.type = "search";
    input.setAttribute("aria-label", "Filter glossary");
    input.placeholder = "Filter terms";
    input.addEventListener("input", function () { q = input.value; draw(); });
    main.appendChild(input);
    main.appendChild(list);
    draw();
  }

  function renderResources(data) {
    var rows = (data.resources || []).map(function (item) {
      return "<tr><td><a href=\"" + esc(item.url) + "\">" + esc(item.title) + "</a></td><td>" + esc(item.note) + "</td><td>" + esc(item.asOf) + "</td></tr>";
    }).join("");
    main.innerHTML = "<h1>Resources</h1><p class=\"lede\">Every link in this table was requested on the date shown. A page that did not open is omitted, and the related note says so.</p><table><thead><tr><th>Link</th><th>Why it is here</th><th>Checked</th></tr></thead><tbody>" + rows + "</tbody></table>";
  }

  function renderDownloads(data) {
    var rows = (data.downloads || []).map(function (item) {
      return "<tr><td><a href=\"" + esc(item.file) + "\">" + esc(item.title) + "</a></td><td>" + esc(item.kind) + "</td><td>" + esc(sizeLabel(item.bytes)) + "</td></tr>";
    }).join("");
    main.innerHTML = "<h1>Downloads</h1><p class=\"lede\">Cheat sheets and templates. Each file carries the same disclaimer and owner line as the site footer.</p><table><thead><tr><th>File</th><th>Kind</th><th>Size</th></tr></thead><tbody>" + rows + "</tbody></table>";
  }

  function renderTemplates(data) {
    var blocks = (data.templates || []).map(function (item) {
      var lines = (item.lines || []).map(function (line) { return "<li>" + esc(line) + "</li>"; }).join("");
      return '<article class="item"><h3>' + esc(item.title) + "</h3><p>" + esc(item.summary) + "</p><ul>" + lines + "</ul><p><a href=\"downloads.html\">Download the set</a></p></article>";
    }).join("");
    main.innerHTML = "<h1>Templates</h1><p class=\"lede\">Outlines you can copy into your own notes. They are study scaffolds, not a company's official form.</p><div class=\"card-grid\">" + blocks + "</div>";
  }

  function renderDiagrams(data) {
    var blocks = (data.diagrams || []).map(function (item) {
      return '<article class="item"><h3>' + esc(item.title) + '</h3><div class="diagram-frame"><img src="' + esc(item.file) + '" alt="' + esc(item.alt) + '"></div><p>' + esc(item.caption) + "</p>" + sourceLine(item) + "</article>";
    }).join("");
    main.innerHTML = "<h1>Diagrams</h1><p class=\"lede\">Drawings made for this lab. They illustrate the notes. They are not copies of a vendor's figure.</p>" + blocks;
  }

  function renderFlows(data) {
    var blocks = (data.flows || []).map(function (flow) {
      var steps = (flow.steps || []).map(function (step) {
        return '<div class="card"><strong>' + esc(step) + '</strong><div class="flow-track" aria-hidden="true"><i class="packet"></i></div></div>';
      }).join("");
      return '<article class="item"><h3>' + esc(flow.title) + "</h3><p>" + esc(flow.caption) + "</p>" + steps + sourceLine(flow) + "</article>";
    }).join("");
    main.innerHTML = "<h1>Flows</h1><p class=\"lede\">Each track is a sequence, not a timer from a real project. On a phone, or with reduced motion, the moving dot stays still.</p>" + blocks;
  }

  function renderCharts(data) {
    var blocks = (data.charts || []).map(function (chart) {
      var max = Math.max.apply(null, chart.rows.map(function (row) { return row.value; }).concat([1]));
      var rows = chart.rows.map(function (row) {
        var width = Math.round((row.value / max) * 100);
        return '<div class="bar-row"><span>' + esc(row.label) + '</span><span class="bar"><i style="--w:' + width + '%"></i></span><span>' + esc(row.value) + (chart.unit || "") + "</span></div>";
      }).join("");
      return '<article class="item"><h3>' + esc(chart.title) + "</h3>" + rows + sourceLine(chart) + "</article>";
    }).join("");
    main.innerHTML = "<h1>Charts</h1><p class=\"lede\">Blueprint percentages come from the cited exam pages. Repository counts are the files in this lab, not a market statistic.</p>" + blocks;
  }

  function renderPractice(data) {
    main.innerHTML =
      "<h1>Practice</h1>" +
      "<p class=\"lede\">Scores stay in this browser. Questions were written for this lab. They are not retired exam items.</p>" +
      '<div class="filters" role="tablist">' +
      '<button type="button" data-tab="cards" aria-pressed="true">Flashcards</button>' +
      '<button type="button" data-tab="quiz" aria-pressed="false">Quiz</button>' +
      '<button type="button" data-tab="game" aria-pressed="false">Sort game</button>' +
      '<button type="button" data-tab="daily" aria-pressed="false">Daily challenge</button></div>' +
      '<div data-panel="cards"></div><div data-panel="quiz" hidden></div><div data-panel="game" hidden></div><div data-panel="daily" hidden></div>';
    main.querySelector(".filters").addEventListener("click", function (event) {
      var btn = event.target.closest("[data-tab]");
      if (!btn) return;
      main.querySelectorAll("[data-tab]").forEach(function (node) {
        node.setAttribute("aria-pressed", node === btn ? "true" : "false");
      });
      main.querySelectorAll("[data-panel]").forEach(function (panel) {
        panel.hidden = panel.getAttribute("data-panel") !== btn.getAttribute("data-tab");
      });
    });
    renderCards(data, main.querySelector('[data-panel="cards"]'));
    renderQuiz(data, main.querySelector('[data-panel="quiz"]'), data.quizzes, "ba-quiz");
    renderGame(main.querySelector('[data-panel="game"]'));
    renderDaily(data, main.querySelector('[data-panel="daily"]'));
  }

  function renderCards(data, host) {
    var index = 0;
    var cards = data.flashcards || [];
    function draw() {
      var cardItem = cards[index];
      if (!cardItem) {
        host.innerHTML = "<p>No cards yet.</p>";
        return;
      }
      host.innerHTML =
        '<p class="meta">Card ' + (index + 1) + " of " + cards.length + "</p>" +
        '<button type="button" class="card flip" data-flip><span class="front"><strong>' + esc(cardItem.front) + '</strong><br><span class="meta">Press to flip</span></span><span class="back">' + esc(cardItem.back) + "</span></button>" +
        '<p><button type="button" data-again>Again</button> <button type="button" data-know>Know</button></p>' +
        sourceLine(cardItem);
    }
    host.addEventListener("click", function (event) {
      if (event.target.closest("[data-flip]")) {
        event.target.closest("[data-flip]").classList.toggle("is-flipped");
      }
      if (event.target.closest("[data-know]") || event.target.closest("[data-again]")) {
        var know = !!event.target.closest("[data-know]");
        try {
          var stats = JSON.parse(localStorage.getItem("ba-cards") || "{\"know\":0,\"again\":0}");
          stats[know ? "know" : "again"] += 1;
          localStorage.setItem("ba-cards", JSON.stringify(stats));
          if (stats.know >= 10) addBadge("Ten cards marked know");
        } catch (err) { /* ignore */ }
        index = (index + 1) % cards.length;
        draw();
      }
    });
    draw();
  }

  function renderQuiz(data, host, questions, storageKey) {
    var list = questions || [];
    var picked = new Array(list.length);
    function draw(done) {
      var blocks = list.map(function (item, qi) {
        var choices = item.choices.map(function (choice, ci) {
          return '<button type="button" class="quiz-option" data-q="' + qi + '" data-c="' + ci + '">' + esc(choice) + "</button>";
        }).join("");
        var why = done ? "<p>" + esc(item.why) + "</p>" + sourceLine(item) : "";
        return '<article class="item"><h3>' + (qi + 1) + ". " + esc(item.q) + "</h3>" + choices + why + "</article>";
      }).join("");
      var score = 0;
      if (done) {
        list.forEach(function (item, qi) { if (picked[qi] === item.answer) score += 1; });
      }
      host.innerHTML = blocks + '<p><button type="button" data-score>Score</button></p><p class="score" data-score-out>' +
        (done ? score + " / " + list.length : "") + "</p>";
      if (done) {
        host.querySelectorAll(".quiz-option").forEach(function (btn) {
          var qi = Number(btn.getAttribute("data-q"));
          var ci = Number(btn.getAttribute("data-c"));
          if (ci === list[qi].answer) btn.classList.add("is-right");
          else if (ci === picked[qi]) btn.classList.add("is-wrong");
        });
        try {
          var prev = JSON.parse(localStorage.getItem(storageKey) || "[]");
          prev.push({ score: score, total: list.length, at: Date.now() });
          localStorage.setItem(storageKey, JSON.stringify(prev.slice(-20)));
          addBadge("Quiz finished");
        } catch (err) { /* ignore */ }
      }
    }
    host.addEventListener("click", function (event) {
      var choice = event.target.closest(".quiz-option");
      if (choice && !host.querySelector("[data-score-out]").textContent) {
        picked[Number(choice.getAttribute("data-q"))] = Number(choice.getAttribute("data-c"));
        var group = choice.parentElement.querySelectorAll(".quiz-option");
        group.forEach(function (btn) { btn.setAttribute("aria-pressed", btn === choice ? "true" : "false"); });
      }
      if (event.target.closest("[data-score]")) draw(true);
    });
    draw(false);
  }

  function renderGame(host) {
    var items = [
      ["A legal retention rule for stored reports", "Must"],
      ["A dashboard filter the sponsor asked for first", "Should"],
      ["A color theme the team likes", "Could"],
      ["A rewrite of an unrelated billing engine", "Won't"]
    ];
    host.innerHTML =
      "<h2>MoSCoW sort</h2><p>Place each statement. This uses the priority words Must, Should, Could, and Won't. The DSDM page did not open in the October 2026 check, so the link is omitted and this is a study exercise only.</p>" +
      '<div class="card-grid" data-bank></div><p><button type="button" data-check-game>Check</button></p><p data-game-out></p>';
    var bank = host.querySelector("[data-bank]");
    items.forEach(function (pair, index) {
      var article = document.createElement("article");
      article.className = "item";
      article.innerHTML = "<p>" + esc(pair[0]) + "</p>" +
        ["Must", "Should", "Could", "Won't"].map(function (name) {
          return '<button type="button" class="choice" data-i="' + index + '" data-v="' + name + '">' + name + "</button>";
        }).join("");
      bank.appendChild(article);
    });
    var chosen = {};
    host.addEventListener("click", function (event) {
      var btn = event.target.closest(".choice");
      if (btn) {
        chosen[btn.getAttribute("data-i")] = btn.getAttribute("data-v");
        btn.parentElement.querySelectorAll(".choice").forEach(function (node) {
          node.setAttribute("aria-pressed", node === btn ? "true" : "false");
        });
      }
      if (event.target.closest("[data-check-game]")) {
        var correct = 0;
        items.forEach(function (pair, index) {
          var ok = chosen[index] === pair[1];
          if (ok) correct += 1;
          var node = bank.children[index];
          node.querySelectorAll(".choice").forEach(function (button) {
            if (button.getAttribute("data-v") === pair[1]) button.classList.add("is-right");
          });
        });
        host.querySelector("[data-game-out]").textContent = correct + " of " + items.length + " match the study key.";
        if (correct === items.length) addBadge("MoSCoW sort cleared");
      }
    });
  }

  function renderDaily(data, host) {
    var day = new Date().toISOString().slice(0, 10);
    var list = data.quizzes || [];
    var index = 0;
    for (var i = 0; i < day.length; i += 1) index = (index + day.charCodeAt(i)) % Math.max(list.length, 1);
    var item = list[index];
    if (!item) {
      host.innerHTML = "<p>No daily question yet.</p>";
      return;
    }
    host.innerHTML = "<h2>Daily challenge · " + esc(day) + "</h2>";
    var wrap = document.createElement("div");
    host.appendChild(wrap);
    renderQuiz(data, wrap, [item], "ba-daily");
  }

  function renderSearch(data) {
    var params = new URLSearchParams(location.search);
    var q = (params.get("q") || "").trim().toLowerCase();
    var input = '<form class="search-form" action="search.html"><input type="search" name="q" value="' + esc(params.get("q") || "") + '" aria-label="Search the lab"><button type="submit">Search</button></form>';
    if (!q) {
      main.innerHTML = "<h1>Search</h1>" + input + "<p>Type a term such as traceability, CBAP, or BPMN.</p>";
      return;
    }
    var hits = [];
    (data.items || []).forEach(function (item) {
      var blob = (item.title + " " + item.summary + " " + (item.points || []).join(" ")).toLowerCase();
      if (blob.indexOf(q) !== -1) hits.push(card(item));
    });
    (data.glossary || []).forEach(function (term) {
      if ((term.term + " " + term.meaning).toLowerCase().indexOf(q) !== -1) {
        hits.push("<article class=\"item\"><h3>" + esc(term.term) + "</h3><p>" + esc(term.meaning) + "</p>" + sourceLine(term) + "</article>");
      }
    });
    main.innerHTML = "<h1>Search</h1>" + input + "<p>" + hits.length + " matches for “" + esc(params.get("q") || "") + "”.</p><div class=\"card-grid\">" + hits.join("") + "</div>";
  }

  function addBadge(name) {
    try {
      var badges = JSON.parse(localStorage.getItem("ba-badges") || "[]");
      if (badges.indexOf(name) === -1) badges.push(name);
      localStorage.setItem("ba-badges", JSON.stringify(badges));
    } catch (err) { /* ignore */ }
  }

  var TITLES = {
    foundations: ["Foundations", "The job, the neighboring roles, and the words a team uses before anyone writes a requirement."],
    ecosystem: ["Ecosystem", "How business analysis sits beside product, project, data, architecture, and contact-center work."],
    babok: ["BABOK guide", "A study map of A Guide to the Business Analysis Body of Knowledge. Summaries are original. They are not the guide's text."],
    requirements: ["Requirements", "From a conversation to a traced, testable statement a team can accept or reject."],
    modeling: ["Modeling", "Pictures that make a rule, a process, or a system boundary easier to argue about."],
    agile: ["Agile and discovery", "Delivery frames a business analyst meets. Course prices that did not load are marked to be confirmed."],
    data: ["Data skills", "Enough SQL, modeling, and measurement to ask a better question. This lab does not claim tool experience for Lucky."],
    tools: ["Tools", "Where teams often keep work. The tool does not replace the analysis."],
    ai: ["AI for business analysis", "Use a model as a draft partner. A person still owns the requirement."],
    domains: ["Domains", "The same analysis moves, with different constraints. Constraints are cited where a public page opened."],
    product: ["Product craft", "Discovery, the business case, change, ethics, estimation, risk, and buying."],
    careers: ["Careers", "Role names and interview practice. No salary figures. Sponsorship is an employer and legal question, not a promise."]
  };

  fetch("assets/data/catalog.json")
    .then(function (response) {
      if (!response.ok) throw new Error("catalog");
      return response.json();
    })
    .then(function (data) {
      window.BA_CATALOG = data;
      if (window.BA_SET_COUNTS && data.counts) window.BA_SET_COUNTS(data.counts);
      if (page === "home") renderHome(data);
      else if (page === "start") renderStart(data);
      else if (page === "certs") renderCerts(data);
      else if (page === "glossary") renderGlossary(data);
      else if (page === "resources") renderResources(data);
      else if (page === "downloads") renderDownloads(data);
      else if (page === "templates") renderTemplates(data);
      else if (page === "diagrams") renderDiagrams(data);
      else if (page === "flows") renderFlows(data);
      else if (page === "charts") renderCharts(data);
      else if (page === "practice") renderPractice(data);
      else if (page === "search") renderSearch(data);
      else if (TITLES[page]) renderNotes(data, page, TITLES[page][0], TITLES[page][1]);
      else main.innerHTML = "<h1>This room is not in the catalog.</h1>";
      document.dispatchEvent(new CustomEvent("ba-ready"));
    })
    .catch(function () {
      main.innerHTML = "<h1>The catalog did not load.</h1><p>Check that assets/data/catalog.json sits next to this page.</p>";
    });
})();
