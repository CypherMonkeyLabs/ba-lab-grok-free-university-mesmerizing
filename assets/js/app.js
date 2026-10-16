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
      studyBlock(data, "home") +
      '<section><h2>Rooms</h2><div class="room-grid">' +
      (window.BA_FRAME ? window.BA_FRAME.sections : []).filter(function (s) { return s[0] !== "home"; }).map(function (s) {
        return '<a class="card" href="' + esc(s[2]) + '"><h3>' + esc(s[1]) + "</h3><p>" + esc(s[4]) + "</p></a>";
      }).join("") +
      "</div></section>";
    bindListen(main, data.narration);
  }

  function studyBlock(data, section) {
    var study = (data.study || {})[section];
    if (!study) return "";
    var diagram = (data.diagrams || []).filter(function (item) { return item.id === study.visual; })[0];
    var visual = diagram
      ? '<figure class="diagram-frame"><img src="' + esc(diagram.file) + '" alt="' + esc(diagram.alt) + '"><figcaption>' + esc(diagram.caption) + "</figcaption></figure>"
      : "";
    var example = (study.example || []).map(function (line) { return "<p>" + esc(line) + "</p>"; }).join("");
    return '<section class="five"><h2>Learn it in 5 minutes</h2><p>' + esc(study.five || "") + "</p></section>" +
      visual +
      '<section class="callout"><h2>' + esc(study.exampleTitle || "Worked example") + "</h2>" + example + "</section>";
  }
  function roomQuiz(data, section, host) {
    if (!host) return;
    var quizzes = (data.quizzes || []).filter(function (item) { return item.section === section; });
    if (!quizzes.length) quizzes = (data.quizzes || []).slice(0, 1);
    renderQuiz(data, host, quizzes, "ba-quiz-" + section);
  }
  function renderNotes(data, section, title, lede) {
    var items = bySection(data, section).map(card).join("");
    main.innerHTML = "<h1>" + esc(title) + "</h1><p class=\"lede\">" + esc(lede) + "</p>" +
      studyBlock(data, section) +
      '<div class="card-grid">' + items + "</div>" +
      '<section><h2>Check yourself</h2><div data-room-quiz></div></section>';
    roomQuiz(data, section, main.querySelector("[data-room-quiz]"));
  }

  function renderStart(data) {
    var steps = (data.course || []).map(function (step, index) {
      return '<article class="item"><p><span class="step-no">' + (index + 1) + "</span> " + esc(step.minutes) + " min</p><h3><a href=\"" + esc(step.href) + "\">" + esc(step.title) + "</a></h3><p>" + esc(step.text) + "</p></article>";
    }).join("");
    main.innerHTML =
      "<h1>Start here</h1>" +
      "<p class=\"lede\">About one hour if you read the path and skip the long rooms. Come back for the diagrams, games, and downloads.</p>" +
      studyBlock(data, "start") +
      listenButton(data.narration) +
      '<div class="card-grid">' + steps + "</div>" +
      '<section class="callout"><h2>How to use the lab</h2><ul>' +
      "<li>The top-left menu slides in. Text size, theme, text color, motion, and search live there.</li>" +
      "<li>The banner is one row. Arrows move it.</li>" +
      "<li>The monkey is a study companion. Voice is off until you ask it to speak.</li>" +
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
    main.innerHTML = "<h1>Certifications</h1><p class=\"lede\">Fees below are copied from pages opened on 16 October 2026. They are in US dollars and IIBA says they can change. This lab does not repeat salary claims from vendor marketing.</p>" +
      studyBlock(data, "certs") +
      '<div class="card-grid">' + blocks + "</div>" +
      '<section><h2>Check yourself</h2><div data-room-quiz></div></section>';
    roomQuiz(data, "certs", main.querySelector("[data-room-quiz]"));
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
    main.innerHTML = "<h1>Glossary</h1><p class=\"lede\">Short study definitions. They are not a substitute for the cited standard.</p>" + studyBlock(data, "glossary");
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
    main.innerHTML = "<h1>Resources</h1><p class=\"lede\">Every link in this table was requested on the date shown. A page that did not open is omitted, and the related note says so.</p>" + studyBlock(data, "resources") + "<table><thead><tr><th>Link</th><th>Why it is here</th><th>Checked</th></tr></thead><tbody>" + rows + "</tbody></table>";
  }

  function renderDownloads(data) {
    var rows = (data.downloads || []).map(function (item) {
      return "<tr><td><a href=\"" + esc(item.file) + "\">" + esc(item.title) + "</a></td><td>" + esc(item.kind) + "</td><td>" + esc(sizeLabel(item.bytes)) + "</td></tr>";
    }).join("");
    main.innerHTML = "<h1>Downloads</h1>" + studyBlock(data, "downloads") +
      "<p class=\"lede\">Each file stands alone and carries the disclaimer. Filter by kind. PNG images appear after the render step.</p>" +
      '<div class="filters" data-kind-filters><button type="button" data-kind="all" aria-pressed="true">All</button></div>' +
      '<table><thead><tr><th>File</th><th>Kind</th><th>Size</th></tr></thead><tbody data-download-rows>' + rows + "</tbody></table>";
    var kinds = {};
    (data.downloads || []).forEach(function (item) { kinds[item.kind] = true; });
    var filters = main.querySelector("[data-kind-filters]");
    Object.keys(kinds).sort().forEach(function (kind) {
      var button = document.createElement("button");
      button.type = "button";
      button.setAttribute("data-kind", kind);
      button.textContent = kind;
      filters.appendChild(button);
    });
    filters.addEventListener("click", function (event) {
      var button = event.target.closest("[data-kind]");
      if (!button) return;
      var kind = button.getAttribute("data-kind");
      filters.querySelectorAll("button").forEach(function (node) {
        node.setAttribute("aria-pressed", node === button ? "true" : "false");
      });
      main.querySelectorAll("[data-download-rows] tr").forEach(function (row) {
        var cell = row.children[1] ? row.children[1].textContent : "";
        row.hidden = kind !== "all" && cell !== kind;
      });
    });
  }

  function renderTemplates(data) {
    var blocks = (data.templates || []).map(function (item) {
      var lines = (item.lines || []).map(function (line) { return "<li>" + esc(line) + "</li>"; }).join("");
      return '<article class="item"><h3>' + esc(item.title) + "</h3><p>" + esc(item.summary) + "</p><ul>" + lines + "</ul><p><a href=\"downloads.html\">Download the set</a></p></article>";
    }).join("");
    main.innerHTML = "<h1>Templates</h1><p class=\"lede\">Outlines you can copy into your own notes. They are study scaffolds, not a company's official form.</p>" + studyBlock(data, "templates") + '<div class="card-grid">' + blocks + "</div>";
  }

  function renderDiagrams(data) {
    var blocks = (data.diagrams || []).map(function (item) {
      return '<article class="item"><h3>' + esc(item.title) + '</h3><div class="diagram-frame"><img src="' + esc(item.file) + '" alt="' + esc(item.alt) + '"></div><p>' + esc(item.caption) + "</p>" + sourceLine(item) + "</article>";
    }).join("");
    main.innerHTML = "<h1>Diagrams</h1><p class=\"lede\">Drawings made for this lab. They illustrate the notes. They are not copies of a vendor's figure.</p>" + studyBlock(data, "diagrams") + blocks;
  }

  function renderFlows(data) {
    var blocks = (data.flows || []).map(function (flow) {
      var steps = (flow.steps || []).map(function (step) {
        return '<div class="card"><strong>' + esc(step) + '</strong><div class="flow-track" aria-hidden="true"><i class="packet"></i></div></div>';
      }).join("");
      return '<article class="item"><h3>' + esc(flow.title) + "</h3><p>" + esc(flow.caption) + "</p>" + steps + sourceLine(flow) + "</article>";
    }).join("");
    main.innerHTML = "<h1>Flows</h1><p class=\"lede\">Each track is a sequence, not a timer from a real project. On a phone, or with reduced motion, the moving dot stays still.</p>" + studyBlock(data, "flows") + blocks;
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
    main.innerHTML = "<h1>Charts</h1><p class=\"lede\">Blueprint percentages come from the cited exam pages. Repository counts are the files in this lab, not a market statistic.</p>" + studyBlock(data, "charts") + blocks;
  }

  function renderPractice(data) {
    main.innerHTML =
      "<h1>Practice</h1>" +
      "<p class=\"lede\">Scores stay in this browser. Questions were written for this lab. They are not retired exam items.</p>" +
      studyBlock(data, "practice") +
      '<div class="filters" role="tablist">' +
      '<button type="button" data-tab="cards" aria-pressed="true">Flashcards</button>' +
      '<button type="button" data-tab="quiz" aria-pressed="false">Quiz</button>' +
      '<button type="button" data-tab="game" aria-pressed="false">Sort game</button>' +
      '<button type="button" data-tab="daily" aria-pressed="false">Daily</button>' +
      '<button type="button" data-tab="match" aria-pressed="false">Match</button>' +
      '<button type="button" data-tab="interview" aria-pressed="false">Interview</button>' +
      '<button type="button" data-tab="triage" aria-pressed="false">Triage</button>' +
      '<button type="button" data-tab="bpmn" aria-pressed="false">BPMN</button></div>' +
      '<div data-panel="cards"></div><div data-panel="quiz" hidden></div><div data-panel="game" hidden></div><div data-panel="daily" hidden></div>' +
      '<div data-panel="match" hidden></div><div data-panel="interview" hidden></div><div data-panel="triage" hidden></div><div data-panel="bpmn" hidden></div>';
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
    renderMatch(data, main.querySelector('[data-panel="match"]'));
    renderInterview(data, main.querySelector('[data-panel="interview"]'));
    renderTriage(data, main.querySelector('[data-panel="triage"]'));
    renderBpmn(data, main.querySelector('[data-panel="bpmn"]'));
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

  function renderCredits(data) {
    var blocks = (data.credits || []).map(function (item) {
      return '<article class="item"><h3>' + esc(item.name) + "</h3><p>" + esc(item.note) + "</p><p class=\"meta\">" + esc(item.license) + "</p></article>";
    }).join("");
    main.innerHTML = "<h1>Credits</h1>" + studyBlock(data, "credits") + '<div class="card-grid">' + blocks + "</div>";
  }
  function renderSearch(data) {
    var params = new URLSearchParams(location.search);
    var q = (params.get("q") || "").trim().toLowerCase();
    var input = '<form class="search-form" action="search.html"><input type="search" name="q" value="' + esc(params.get("q") || "") + '" aria-label="Search the lab"><button type="submit">Search</button></form>';
    if (!q) {
      main.innerHTML = "<h1>Search</h1>" + studyBlock(data, "search") + input + "<p>Type a term such as traceability, CBAP, or BPMN.</p>";
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

  function renderMatch(data, host) {
    var pairs = ((data.games || {}).match) || [];
    var rights = pairs.map(function (pair) { return pair[1]; });
    host.innerHTML = "<h2>Match the term</h2><p>Pick the meaning that belongs to each term.</p>";
    var chosen = {};
    pairs.forEach(function (pair, index) {
      var article = document.createElement("article");
      article.className = "item";
      article.innerHTML = "<h3>" + esc(pair[0]) + "</h3>" + rights.map(function (meaning) {
        return '<button type="button" class="choice" data-i="' + index + '" data-v="' + esc(meaning) + '">' + esc(meaning) + "</button>";
      }).join("");
      host.appendChild(article);
    });
    var out = document.createElement("p");
    var check = document.createElement("button");
    check.type = "button";
    check.textContent = "Check";
    host.appendChild(check);
    host.appendChild(out);
    host.addEventListener("click", function (event) {
      var button = event.target.closest(".choice");
      if (button) {
        chosen[button.getAttribute("data-i")] = button.getAttribute("data-v");
        button.parentElement.querySelectorAll(".choice").forEach(function (node) {
          node.setAttribute("aria-pressed", node === button ? "true" : "false");
        });
      }
      if (event.target === check) {
        var correct = 0;
        pairs.forEach(function (pair, index) { if (chosen[index] === pair[1]) correct += 1; });
        out.textContent = correct + " of " + pairs.length + " match.";
        if (correct === pairs.length) addBadge("Match cleared");
      }
    });
  }
  function renderInterview(data, host) {
    var rounds = ((data.games || {}).interview) || [];
    var bank = (data.interviews || []).map(function (item) {
      return "<article class=\"item\"><h3>" + esc(item.q) + "</h3><p>" + esc(item.star) + "</p></article>";
    }).join("");
    host.innerHTML = "<h2>Stakeholder interview</h2><p>These prompts are generic. They are not a biography and they claim no tool experience.</p>" +
      rounds.map(function (item) {
        return '<article class="item"><h3>' + esc(item.ask) + "</h3><p><strong>A useful shape.</strong> " + esc(item.better) + "</p><p><strong>A weaker shape.</strong> " + esc(item.weaker) + "</p></article>";
      }).join("") +
      "<h2>STAR bank</h2>" + bank;
  }
  function renderTriage(data, host) {
    var items = ((data.games || {}).triage) || [];
    host.innerHTML = "<h2>Requirements triage</h2><p>Now, later, or drop. This is a study key for a generic clinic, not a company policy.</p>";
    var chosen = {};
    items.forEach(function (pair, index) {
      var article = document.createElement("article");
      article.className = "item";
      article.innerHTML = "<p>" + esc(pair[0]) + "</p>" + ["Now", "Later", "Drop"].map(function (lane) {
        return '<button type="button" class="choice" data-i="' + index + '" data-v="' + lane + '">' + lane + "</button>";
      }).join("");
      host.appendChild(article);
    });
    var out = document.createElement("p");
    var check = document.createElement("button");
    check.type = "button";
    check.textContent = "Check";
    host.appendChild(check);
    host.appendChild(out);
    host.addEventListener("click", function (event) {
      var button = event.target.closest(".choice");
      if (button) {
        chosen[button.getAttribute("data-i")] = button.getAttribute("data-v");
        button.parentElement.querySelectorAll(".choice").forEach(function (node) {
          node.setAttribute("aria-pressed", node === button ? "true" : "false");
        });
      }
      if (event.target === check) {
        var correct = 0;
        items.forEach(function (pair, index) { if (chosen[index] === pair[1]) correct += 1; });
        out.textContent = correct + " of " + items.length + " match the study key.";
        if (correct === items.length) addBadge("Triage cleared");
      }
    });
  }
  function renderBpmn(data, host) {
    var order = ((data.games || {}).bpmn) || [];
    var pool = order.slice().reverse();
    host.innerHTML = "<h2>BPMN builder</h2><p>Put the pieces in an order that can tell the return story. This is a study sequence, not a graded exam item.</p><div data-built></div><div data-pool></div><p data-bpmn-out></p>";
    var built = [];
    function draw() {
      host.querySelector("[data-built]").innerHTML = "<p><strong>Your flow.</strong> " + (built.map(esc).join(" → ") || "Empty") + "</p>";
      host.querySelector("[data-pool]").innerHTML = pool.map(function (token) {
        return '<button type="button" class="choice" data-token="' + esc(token) + '">' + esc(token) + "</button>";
      }).join(" ") + ' <button type="button" data-undo>Undo</button> <button type="button" data-bpmn-check>Check</button>';
    }
    host.addEventListener("click", function (event) {
      var token = event.target.closest("[data-token]");
      if (token) {
        var name = token.getAttribute("data-token");
        var index = pool.indexOf(name);
        if (index >= 0) {
          pool.splice(index, 1);
          built.push(name);
          draw();
        }
      }
      if (event.target.closest("[data-undo]") && built.length) {
        pool.unshift(built.pop());
        draw();
      }
      if (event.target.closest("[data-bpmn-check]")) {
        var ok = built.join("|") === order.join("|");
        host.querySelector("[data-bpmn-out]").textContent = ok ? "That matches the study sequence." : "Not yet. Start, lookup, the question, then the two endings.";
        if (ok) addBadge("BPMN sequence cleared");
      }
    });
    draw();
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
      window.BA_SPEAK = function () {
        var text = data.narration || "";
        if (!window.speechSynthesis) return;
        if (speechSynthesis.speaking) {
          speechSynthesis.cancel();
          return;
        }
        speechSynthesis.speak(new SpeechSynthesisUtterance(text));
      };
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
      else if (page === "credits") renderCredits(data);
      else if (TITLES[page]) renderNotes(data, page, TITLES[page][0], TITLES[page][1]);
      else main.innerHTML = "<h1>This room is not in the catalog.</h1>";
      document.dispatchEvent(new CustomEvent("ba-ready"));
    })
    .catch(function () {
      main.innerHTML = "<h1>The catalog did not load.</h1><p>Check that assets/data/catalog.json sits next to this page.</p>";
    });
})();
