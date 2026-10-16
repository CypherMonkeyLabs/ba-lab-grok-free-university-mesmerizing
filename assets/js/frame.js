/* Chrome: display bar, section banner, wheel menu, footer. Guide bot mounts separately. */
(function () {
  var SECTIONS = [
    ["home", "Home", "index.html", "home", "Front door, study counts, and the one-hour path."],
    ["start", "Start here", "start.html", "rocket", "A short path from foundations to a portfolio piece."],
    ["foundations", "Foundations", "foundations.html", "book", "What business analysis is, and how the roles differ."],
    ["ecosystem", "Ecosystem", "ecosystem.html", "globe", "Glossary, mind map, sister roles, and future hooks."],
    ["babok", "BABOK", "babok.html", "layers", "Six knowledge areas and a map of the technique list."],
    ["requirements", "Requirements", "requirements.html", "list", "Elicitation, stories, acceptance criteria, and traceability."],
    ["modeling", "Modeling", "modeling.html", "flow", "BPMN, UML, ERD, and C4 in plain language."],
    ["agile", "Agile", "agile.html", "cycle", "Scrum, Kanban, SAFe, design thinking, and jobs to be done."],
    ["data", "Data", "data.html", "chart", "SQL, spreadsheets, KPIs, and process mining."],
    ["tools", "Tools", "tools.html", "tool", "Jira, Confluence, Visio, Miro, Lucid, and Figma."],
    ["ai", "AI for BAs", "ai.html", "spark", "Prompting, review, agents, and responsible use."],
    ["domains", "Domains", "domains.html", "building", "Healthcare, banking, insurance, retail, telecom, and contact centers."],
    ["product", "Product craft", "product.html", "gem", "Discovery, business case, change, risk, and vendors."],
    ["certs", "Certifications", "certs.html", "check", "IIBA, PMI-PBA, and adjacent credentials with cited fees."],
    ["careers", "Careers", "careers.html", "mic", "Roles, interviews, and sponsorship notes. No pay claims."],
    ["practice", "Practice", "practice.html", "cards", "Flashcards, quizzes, and short games."],
    ["diagrams", "Diagrams", "diagrams.html", "image", "Study drawings made for this lab."],
    ["flows", "Flows", "flows.html", "flow", "Animated sequences from need to accepted change."],
    ["charts", "Charts", "charts.html", "chart", "Exam blueprints and counts from this repository."],
    ["glossary", "Glossary", "glossary.html", "book", "Short definitions with a source on each term."],
    ["resources", "Resources", "resources.html", "link", "Only links that opened in the October 2026 check."],
    ["templates", "Templates", "templates.html", "cards", "BRD, FRD, SRS, story, RACI, SWOT, and process map."],
    ["downloads", "Downloads", "downloads.html", "download", "PDF, PPTX, DOCX, and HTML sheets with sizes."]
  ];
  var ICONS = {
    home: '<path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1z"/>',
    rocket: '<path d="M14 4c2 3 3 6 3 8a5 5 0 0 1-5 5c-2 0-5-1-8-3 2-3 3-6 3-8a5 5 0 0 1 5-5z"/><path d="M9 15l-2 5 5-2"/>',
    book: '<path d="M5 5.5A2.5 2.5 0 0 1 7.5 3H20v16H7.5A2.5 2.5 0 0 0 5 21.5z"/>',
    globe: '<circle cx="12" cy="12" r="8"/><path d="M4 12h16M12 4c2.2 2.3 3.4 5 3.4 8s-1.2 5.7-3.4 8c-2.2-2.3-3.4-5-3.4-8s1.2-5.7 3.4-8z"/>',
    layers: '<path d="m12 3 8 4-8 4-8-4 8-4zM4 12l8 4 8-4M4 16l8 4 8-4"/>',
    list: '<path d="M8 6h12M8 12h12M8 18h12"/><circle cx="4.5" cy="6" r="1"/><circle cx="4.5" cy="12" r="1"/><circle cx="4.5" cy="18" r="1"/>',
    flow: '<path d="M4 7h6M14 7h6M4 12h16M4 17h6M14 17h6"/><circle cx="12" cy="7" r="2"/><circle cx="12" cy="17" r="2"/>',
    cycle: '<path d="M20 12a8 8 0 1 1-2.2-5.5"/><path d="M20 4v5h-5"/>',
    chart: '<path d="M4 19h16M7 16v-5M12 16V7M17 16v-3"/>',
    tool: '<path d="M14.5 6.2a4 4 0 0 0-5.6 5.1L4 16.2 7.8 20l4.9-4.9a4 4 0 0 0 5.1-5.6L15 12l-3-3z"/>',
    spark: '<path d="M12 3l1.6 5.2L19 10l-5.4 1.8L12 17l-1.6-5.2L5 10l5.4-1.8z"/>',
    building: '<path d="M4 20h16M6 20V6h8v14M14 10h4v10M8 9h2M8 12h2M8 15h2"/>',
    gem: '<path d="M12 3 20 10 12 21 4 10z"/>',
    check: '<circle cx="12" cy="12" r="8"/><path d="m8.5 12.2 2.3 2.3 4.7-5"/>',
    mic: '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M6 11a6 6 0 0 0 12 0M12 17v4"/>',
    cards: '<rect x="3" y="6" width="12" height="14" rx="2"/><rect x="9" y="4" width="12" height="14" rx="2"/>',
    image: '<rect x="4" y="5" width="16" height="14" rx="2"/><circle cx="9" cy="10" r="1.4"/><path d="m7 16 3.2-3.2L13 15l2-2 2 3"/>',
    link: '<path d="M10 13a5 5 0 0 0 7.1.1l1.9-1.9a5 5 0 0 0-7.1-7.1L10.8 5"/><path d="M14 11a5 5 0 0 0-7.1-.1L5 12.8a5 5 0 0 0 7.1 7.1l1.1-1.1"/>',
    download: '<path d="M12 4v10M8 10l4 4 4-4M5 19h14"/>',
    menu: '<circle cx="12" cy="12" r="8"/><path d="M12 4v3M12 17v3M4 12h3M17 12h3"/>'
  };
  var BRAND = {
    github: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 .5A11.5 11.5 0 0 0 .5 12.3c0 5.22 3.38 9.65 8.07 11.22.59.12.8-.26.8-.57v-2.02c-3.28.73-3.97-1.42-3.97-1.42-.53-1.38-1.3-1.75-1.3-1.75-1.07-.75.08-.73.08-.73 1.18.08 1.8 1.24 1.8 1.24 1.05 1.84 2.76 1.31 3.43.99.1-.78.41-1.31.75-1.61-2.62-.31-5.37-1.34-5.37-5.98 0-1.32.46-2.4 1.22-3.25-.12-.3-.53-1.53.12-3.18 0 0 1-.33 3.3 1.25a11.3 11.3 0 0 1 6 0c2.3-1.58 3.3-1.25 3.3-1.25.65 1.65.24 2.88.12 3.18.76.85 1.22 1.93 1.22 3.25 0 4.65-2.76 5.66-5.39 5.96.42.38.8 1.12.8 2.26v3.35c0 .31.21.7.81.57A11.52 11.52 0 0 0 23.5 12.3 11.5 11.5 0 0 0 12 .5z"/></svg>',
    site: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M3 12h18M12 3c2.5 2.6 3.8 5.4 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.4-3.8-9s1.3-6.4 3.8-9z" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>',
    x: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M14.6 3h3.2l-7 8L19.2 21h-3.3l-5.1-6.2L6.4 21H3.2l7.4-8.5L4.4 3h3.4l4.6 5.7L14.6 3zm-1.1 16.2h1.8L7.6 4.7H5.8l7.7 14.5z"/></svg>',
    linkedin: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M4.7 3.3a1.8 1.8 0 1 0 0 3.6 1.8 1.8 0 0 0 0-3.6zM3.2 8.4h3v12.2h-3zM10 8.4h2.9v1.7h.1c.4-.8 1.4-1.7 3-1.7 3.2 0 3.8 2.1 3.8 4.8v7.4h-3v-6.6c0-1.6 0-3.6-2.2-3.6s-2.5 1.7-2.5 3.5v6.7H10z"/></svg>',
    huggingface: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10" fill="#FFD21F"/><circle cx="8.2" cy="10.2" r="1.35" fill="#1c1917"/><circle cx="15.8" cy="10.2" r="1.35" fill="#1c1917"/><path d="M8 14.7c1.1 1.4 2.4 2.1 4 2.1s2.9-.7 4-2.1" fill="none" stroke="#1c1917" stroke-width="1.4" stroke-linecap="round"/></svg>'
  };
  var SOCIALS = [
    { id: "github", label: "GitHub", href: "https://github.com/CypherMonkeyLabs" },
    { id: "site", label: "Website", href: "https://cyphermonkeylabs.com" },
    { id: "x", label: "X", href: "https://x.com/Cypher0x9" },
    { id: "linkedin", label: "LinkedIn", href: "https://www.linkedin.com/in/luckylakshmanucwebex" },
    { id: "huggingface", label: "Hugging Face", href: "https://huggingface.co/Cypher0x9" }
  ];
  var THEMES = [
    ["aurora", "Aurora"],
    ["neon", "Neon"],
    ["holographic", "Holographic"],
    ["cyberpunk", "Cyberpunk"],
    ["sunset", "Sunset"],
    ["light", "Light"],
    ["contrast", "High contrast"]
  ];
  var SWATCHES = [
    ["#f8fafc", "Paper white text"],
    ["#1e293b", "Slate text"],
    ["#312e81", "Indigo text"],
    ["#14532d", "Forest text"],
    ["#7f1d1d", "Wine text"]
  ];

  function svg(name) {
    return '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' + (ICONS[name] || ICONS.spark) + "</svg>";
  }
  function esc(value) {
    return String(value == null ? "" : value).replace(/[&<>"']/g, function (ch) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch];
    });
  }
  function pageId() {
    return document.body.dataset.page || "home";
  }
  function fineMotion() {
    var root = document.documentElement;
    if (root.dataset.motion === "reduce") return false;
    if (window.matchMedia("(max-width: 720px)").matches) return false;
    if (root.dataset.motion === "full") return true;
    return !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }
  function contrastRatio(hex, bg) {
    function lin(c) {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    }
    function lum(h) {
      var n = h.replace("#", "");
      var r = parseInt(n.slice(0, 2), 16);
      var g = parseInt(n.slice(2, 4), 16);
      var b = parseInt(n.slice(4, 6), 16);
      return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
    }
    var L1 = lum(hex);
    var L2 = lum(bg);
    var light = Math.max(L1, L2);
    var dark = Math.min(L1, L2);
    return (light + 0.05) / (dark + 0.05);
  }
  function themeBg() {
    var probe = getComputedStyle(document.documentElement).getPropertyValue("--bg").trim();
    if (/^#[0-9a-fA-F]{6}$/.test(probe)) return probe;
    return document.documentElement.dataset.theme === "light" ? "#fbf7f1" : "#07111f";
  }

  function renderDisplay() {
    var bar = document.getElementById("display-bar");
    if (!bar) return;
    var theme = document.documentElement.dataset.theme || "aurora";
    var font = document.documentElement.dataset.font || "md";
    var motion = document.documentElement.dataset.motion === "reduce";
    var options = THEMES.map(function (pair) {
      return '<option value="' + pair[0] + '"' + (pair[0] === theme ? " selected" : "") + ">" + pair[1] + "</option>";
    }).join("");
    var swatches = SWATCHES.map(function (pair) {
      return '<button type="button" class="swatch" data-ink="' + pair[0] + '" style="background:' + pair[0] + '" aria-label="' + esc(pair[1]) + '"></button>';
    }).join("");
    bar.innerHTML =
      '<div class="group" role="group" aria-label="Text size">' +
      '<button type="button" data-font="sm" aria-pressed="' + (font === "sm") + '">A−</button>' +
      '<button type="button" data-font="md" aria-pressed="' + (font === "md") + '">A</button>' +
      '<button type="button" data-font="lg" aria-pressed="' + (font === "lg") + '">A+</button></div>' +
      '<div class="group"><label class="lbl" for="theme-select">Theme</label><select id="theme-select" aria-label="Theme">' + options + "</select></div>" +
      '<div class="group"><label class="lbl" for="ink-pick">Text color</label>' +
      '<input id="ink-pick" type="color" value="#f8fafc" aria-label="Custom text color">' +
      swatches +
      '<button type="button" data-ink-clear>Theme text</button></div>' +
      '<div class="group"><button type="button" data-motion aria-pressed="' + motion + '">' + (motion ? "Motion off" : "Reduce motion") + "</button></div>" +
      '<form class="search-form" role="search" action="search.html"><input type="search" name="q" aria-label="Search the lab" placeholder="Search the lab"></form>' +
      '<p class="contrast-note" data-contrast hidden></p>';
    bar.addEventListener("click", onDisplayClick);
    bar.addEventListener("change", onDisplayChange);
    updateContrast();
  }
  function onDisplayClick(event) {
    var fontBtn = event.target.closest("[data-font]");
    if (fontBtn) {
      setFont(fontBtn.getAttribute("data-font"));
      return;
    }
    var inkBtn = event.target.closest("[data-ink]");
    if (inkBtn) {
      setInk(inkBtn.getAttribute("data-ink"));
      return;
    }
    if (event.target.closest("[data-ink-clear]")) {
      setInk("");
      return;
    }
    if (event.target.closest("[data-motion]")) {
      var next = document.documentElement.dataset.motion === "reduce" ? "full" : "reduce";
      document.documentElement.dataset.motion = next;
      try { localStorage.setItem("ba-motion", next); } catch (err) { /* ignore */ }
      event.target.closest("[data-motion]").setAttribute("aria-pressed", next === "reduce" ? "true" : "false");
      event.target.closest("[data-motion]").textContent = next === "reduce" ? "Motion off" : "Reduce motion";
    }
  }
  function onDisplayChange(event) {
    if (event.target.id === "theme-select") {
      document.documentElement.dataset.theme = event.target.value;
      try { localStorage.setItem("ba-theme", event.target.value); } catch (err) { /* ignore */ }
      updateContrast();
    }
    if (event.target.id === "ink-pick") setInk(event.target.value);
  }
  function setFont(size) {
    document.documentElement.dataset.font = size;
    try { localStorage.setItem("ba-font", size); } catch (err) { /* ignore */ }
    document.querySelectorAll("[data-font]").forEach(function (btn) {
      btn.setAttribute("aria-pressed", btn.getAttribute("data-font") === size ? "true" : "false");
    });
  }
  function setInk(hex) {
    if (!hex) {
      document.documentElement.dataset.ink = "";
      document.documentElement.style.removeProperty("--ink-custom");
      try { localStorage.removeItem("ba-ink"); } catch (err) { /* ignore */ }
    } else {
      document.documentElement.style.setProperty("--ink-custom", hex);
      document.documentElement.dataset.ink = "custom";
      try { localStorage.setItem("ba-ink", hex); } catch (err) { /* ignore */ }
    }
    updateContrast();
  }
  function updateContrast() {
    var note = document.querySelector("[data-contrast]");
    if (!note) return;
    if (document.documentElement.dataset.ink !== "custom") {
      note.hidden = true;
      return;
    }
    var ink = getComputedStyle(document.documentElement).getPropertyValue("--ink-custom").trim();
    if (!/^#[0-9a-fA-F]{6}$/.test(ink)) {
      note.hidden = true;
      return;
    }
    var ratio = contrastRatio(ink, themeBg());
    if (ratio < 4.5) {
      note.hidden = false;
      note.textContent = "Text contrast is about " + ratio.toFixed(1) + ":1 on this background. Pick another color for body text.";
    } else {
      note.hidden = true;
    }
  }

  function renderBanner() {
    var host = document.getElementById("section-banner");
    if (!host) return;
    var current = pageId();
    var chips = SECTIONS.map(function (item) {
      var on = item[0] === current;
      return '<a class="chip' + (on ? " is-current" : "") + '" href="' + esc(item[2]) + '"' +
        (on ? ' aria-current="page"' : "") + ' title="' + esc(item[4]) + '">' +
        svg(item[3]) + "<span>" + esc(item[1]) + "</span></a>";
    }).join("");
    host.innerHTML =
      '<nav class="chip-rail" aria-label="Sections">' + chips + "</nav>" +
      '<p class="identity-line">A student\'s open lab: business analysis, free for everyone.</p>' +
      '<ul class="identity-counts" aria-label="Library size">' +
      '<li><b data-count="notes">0</b> notes</li>' +
      '<li><b data-count="diagrams">0</b> diagrams</li>' +
      '<li><b data-count="flows">0</b> flows</li>' +
      '<li><b data-count="cards">0</b> cards</li></ul>';
    rise(host);
  }
  function rise(scope) {
    (scope || document).querySelectorAll("[data-count]").forEach(function (node) {
      var target = Number(node.getAttribute("data-count-value") || node.textContent);
      if (!target) return;
      if (!fineMotion()) {
        node.textContent = String(target);
        return;
      }
      var start = performance.now();
      function tick(now) {
        var p = Math.min(1, (now - start) / 800);
        node.textContent = String(Math.round(target * (1 - Math.pow(1 - p, 3))));
        if (p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    });
  }
  window.BA_SET_COUNTS = function (counts) {
    document.querySelectorAll("[data-count]").forEach(function (node) {
      var key = node.getAttribute("data-count");
      if (counts[key] == null) return;
      node.setAttribute("data-count-value", String(counts[key]));
      node.textContent = "0";
    });
    rise(document);
  };

  function renderWheel() {
    if (document.querySelector(".wheel-tab")) return;
    var tab = document.createElement("button");
    tab.type = "button";
    tab.className = "wheel-tab";
    tab.setAttribute("aria-expanded", "false");
    tab.setAttribute("aria-controls", "wheel-panel");
    tab.setAttribute("aria-label", "Open section menu");
    tab.innerHTML = svg("menu");
    var backdrop = document.createElement("div");
    backdrop.className = "wheel-backdrop";
    backdrop.hidden = true;
    var panel = document.createElement("nav");
    panel.id = "wheel-panel";
    panel.className = "wheel-panel";
    panel.hidden = true;
    panel.setAttribute("aria-label", "All sections");
    var current = pageId();
    var links = SECTIONS.map(function (item) {
      var on = item[0] === current;
      return '<a class="menu-link' + (on ? " is-current" : "") + '" href="' + esc(item[2]) + '"' +
        (on ? ' aria-current="page"' : "") + '>' +
        svg(item[3]) + "<strong>" + esc(item[1]) + "</strong><span class=\"desc\">" + esc(item[4]) + "</span></a>";
    }).join("");
    panel.innerHTML =
      '<div class="wheel-head"><strong>Sections</strong><button type="button" data-close-wheel>Close</button></div>' + links;
    document.body.appendChild(tab);
    document.body.appendChild(backdrop);
    document.body.appendChild(panel);
    function openMenu() {
      panel.hidden = false;
      backdrop.hidden = false;
      tab.setAttribute("aria-expanded", "true");
      document.body.dataset.menu = "open";
      var close = panel.querySelector("[data-close-wheel]");
      if (close) close.focus();
    }
    function closeMenu() {
      panel.hidden = true;
      backdrop.hidden = true;
      tab.setAttribute("aria-expanded", "false");
      delete document.body.dataset.menu;
    }
    tab.addEventListener("click", function () {
      if (panel.hidden) openMenu();
      else closeMenu();
    });
    backdrop.addEventListener("click", closeMenu);
    panel.addEventListener("click", function (event) {
      if (event.target.closest("[data-close-wheel]") || event.target.closest("a")) closeMenu();
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && !panel.hidden) {
        closeMenu();
        tab.focus();
      }
    });
    function placeTab() {
      var footer = document.getElementById("site-footer");
      var narrow = window.matchMedia("(max-width: 800px)").matches;
      if (!narrow) {
        tab.style.top = "";
        tab.style.bottom = "";
        tab.style.visibility = "";
        return;
      }
      var top = footer ? footer.getBoundingClientRect().top : window.innerHeight;
      if (top < 88) {
        tab.style.visibility = "hidden";
        return;
      }
      tab.style.visibility = "";
      var overlap = Math.max(0, window.innerHeight - top);
      tab.style.top = "auto";
      tab.style.bottom = (16 + overlap) + "px";
    }
    window.addEventListener("scroll", placeTab, { passive: true });
    window.addEventListener("resize", placeTab);
    document.addEventListener("ba-ready", placeTab);
    placeTab();
  }

  function renderFooter() {
    var footer = document.getElementById("site-footer");
    if (!footer) return;
    var badges = SOCIALS.map(function (item) {
      return '<a class="badge" href="' + esc(item.href) + '">' + (BRAND[item.id] || "") + "<span>" + esc(item.label) + "</span></a>";
    }).join("");
    footer.innerHTML =
      '<div class="footer-inner">' +
      '<p class="disclaimer">Independent, free, learning-only student project. Respects every company, tradition, and vendor. Trademarks and sources belong to their owners. Not sold. Concerns are handled by correcting or removing content promptly via <a href="https://cyphermonkeylabs.com/#contact">https://cyphermonkeylabs.com/#contact</a>. Happy to volunteer for any organization.</p>' +
      '<p><strong>CypherMonkey Labs</strong></p>' +
      '<div class="badge-row">' + badges + "</div>" +
      '<p class="copyline">© 2026 CypherMonkeyLabs 🐒</p></div>';
  }

  function rememberVisit() {
    try {
      var key = "ba-visits";
      var data = JSON.parse(localStorage.getItem(key) || "{}");
      data[pageId()] = Date.now();
      localStorage.setItem(key, JSON.stringify(data));
    } catch (err) { /* ignore */ }
  }

  renderDisplay();
  renderBanner();
  renderWheel();
  renderFooter();
  rememberVisit();
  window.BA_FRAME = { sections: SECTIONS, socials: SOCIALS };
})();
