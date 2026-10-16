/* Chrome: top-left menu, one banner row, phone bar, boxed disclaimer. */
(function () {
  var SECTIONS = [
    ["home", "Home", "index.html", "home", "Front door and the one-hour path.", "Start"],
    ["start", "Start here", "start.html", "rocket", "A short path from foundations to a portfolio piece.", "Start"],
    ["foundations", "Foundations", "foundations.html", "book", "What business analysis is, and how the roles differ.", "Learn"],
    ["ecosystem", "Ecosystem", "ecosystem.html", "globe", "Sister roles and where the practice sits.", "Learn"],
    ["babok", "BABOK", "babok.html", "layers", "Six knowledge areas and the technique map.", "Learn"],
    ["requirements", "Requirements", "requirements.html", "list", "Stories, acceptance criteria, and traceability.", "Learn"],
    ["modeling", "Modeling", "modeling.html", "flow", "BPMN, UML, ERD, and C4.", "Learn"],
    ["agile", "Agile", "agile.html", "cycle", "Scrum, Kanban, design thinking, and jobs.", "Learn"],
    ["data", "Data", "data.html", "chart", "SQL, KPIs, and process mining.", "Learn"],
    ["tools", "Tools", "tools.html", "tool", "Where teams keep the work.", "Learn"],
    ["ai", "AI for BAs", "ai.html", "spark", "Draft, then a person checks.", "Learn"],
    ["domains", "Domains", "domains.html", "building", "Same moves, different constraints.", "Learn"],
    ["product", "Product craft", "product.html", "gem", "Discovery, case, change, and vendors.", "Learn"],
    ["certs", "Certifications", "certs.html", "check", "Cited fees. Unknowns stay unknown.", "Practice"],
    ["careers", "Careers", "careers.html", "mic", "Interviews and sponsorship notes. No pay claims.", "Practice"],
    ["practice", "Practice", "practice.html", "cards", "Cards, quizzes, and short games.", "Practice"],
    ["diagrams", "Diagrams", "diagrams.html", "image", "Study drawings made for this lab.", "Show"],
    ["flows", "Flows", "flows.html", "flow", "Animated sequences from need to change.", "Show"],
    ["charts", "Charts", "charts.html", "chart", "Exam blueprints and counts from this lab.", "Show"],
    ["glossary", "Glossary", "glossary.html", "book", "Short definitions with a source.", "Practice"],
    ["resources", "Resources", "resources.html", "link", "Only links that opened in the October 2026 check.", "Take"],
    ["templates", "Templates", "templates.html", "cards", "BRD, FRD, SRS, story, RACI, SWOT, process map.", "Take"],
    ["downloads", "Downloads", "downloads.html", "download", "Diagrams, sheets, cards, and the deck.", "Take"],
    ["credits", "Credits", "credits.html", "spark", "What this lab made, and what it left out.", "Take"],
    ["search", "Search", "search.html", "link", "Find a note by words you remember.", "Start"]
  ];
  var BANNER = ["start", "foundations", "babok", "requirements", "modeling", "agile", "practice", "diagrams", "downloads"];
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
    menu: '<path d="M5 7h14M5 12h14M5 17h14"/>'
  };
  var MONKEY = '<svg viewBox="0 0 64 64" aria-hidden="true"><ellipse cx="32" cy="36" rx="16" ry="15" fill="#f6c56b"/><ellipse cx="14" cy="32" rx="8" ry="9" fill="#e8a84a"/><ellipse cx="50" cy="32" rx="8" ry="9" fill="#e8a84a"/><ellipse cx="26" cy="34" rx="7" ry="6" fill="#fff7e8"/><ellipse cx="38" cy="34" rx="7" ry="6" fill="#fff7e8"/><circle cx="26" cy="34" r="2.2" fill="#1c1917"/><circle cx="38" cy="34" r="2.2" fill="#1c1917"/><path d="M28 42c2 2 6 2 8 0" fill="none" stroke="#1c1917" stroke-width="1.6" stroke-linecap="round"/><circle cx="26" cy="34" r="6.2" fill="none" stroke="#0f172a" stroke-width="1.6"/><circle cx="38" cy="34" r="6.2" fill="none" stroke="#0f172a" stroke-width="1.6"/><path d="M32 30.5v7" stroke="#0f172a" stroke-width="1.6"/></svg>';
  var BRAND = {
    github: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 .5A11.5 11.5 0 0 0 .5 12.3c0 5.22 3.38 9.65 8.07 11.22.59.12.8-.26.8-.57v-2.02c-3.28.73-3.97-1.42-3.97-1.42-.53-1.38-1.3-1.75-1.3-1.75-1.07-.75.08-.73.08-.73 1.18.08 1.8 1.24 1.8 1.24 1.05 1.84 2.76 1.31 3.43.99.1-.78.41-1.31.75-1.61-2.62-.31-5.37-1.34-5.37-5.98 0-1.32.46-2.4 1.22-3.25-.12-.3-.53-1.53.12-3.18 0 0 1-.33 3.3 1.25a11.3 11.3 0 0 1 6 0c2.3-1.58 3.3-1.25 3.3-1.25.65 1.65.24 2.88.12 3.18.76.85 1.22 1.93 1.22 3.25 0 4.65-2.76 5.66-5.39 5.96.42.38.8 1.12.8 2.26v3.35c0 .31.21.7.81.57A11.52 11.52 0 0 0 23.5 12.3 11.5 11.5 0 0 0 12 .5z"/></svg>',
    site: MONKEY,
    profile: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" fill="#43e660"/><path fill="#1c1917" d="M10 8.2h2.3v3.1H15v1.8h-2.7V17H10v-3.9H7.4V11.3H10z"/></svg>',
    x: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M14.6 3h3.2l-7 8L19.2 21h-3.3l-5.1-6.2L6.4 21H3.2l7.4-8.5L4.4 3h3.4l4.6 5.7L14.6 3zm-1.1 16.2h1.8L7.6 4.7H5.8l7.7 14.5z"/></svg>',
    linkedin: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M4.7 3.3a1.8 1.8 0 1 0 0 3.6 1.8 1.8 0 0 0 0-3.6zM3.2 8.4h3v12.2h-3zM10 8.4h2.9v1.7h.1c.4-.8 1.4-1.7 3-1.7 3.2 0 3.8 2.1 3.8 4.8v7.4h-3v-6.6c0-1.6 0-3.6-2.2-3.6s-2.5 1.7-2.5 3.5v6.7H10z"/></svg>',
    huggingface: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10" fill="#FFD21F"/><circle cx="8.2" cy="10.2" r="1.35" fill="#1c1917"/><circle cx="15.8" cy="10.2" r="1.35" fill="#1c1917"/><path d="M8 14.7c1.1 1.4 2.4 2.1 4 2.1s2.9-.7 4-2.1" fill="none" stroke="#1c1917" stroke-width="1.4" stroke-linecap="round"/></svg>',
    contact: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 6h16v12H4z"/><path d="m4 7 8 6 8-6"/></svg>'
  };
  var SOCIALS = [
    { id: "site", label: "CypherMonkey Labs website", href: "https://cyphermonkeylabs.com" },
    { id: "github", label: "GitHub organization", href: "https://github.com/CypherMonkeyLabs" },
    { id: "profile", label: "Profile links", href: "https://linktr.ee/cyphermonkey", iconOnly: true },
    { id: "x", label: "X", href: "https://x.com/Cypher0x9" },
    { id: "linkedin", label: "LinkedIn", href: "https://www.linkedin.com/in/luckylakshmanucwebex" },
    { id: "huggingface", label: "Hugging Face", href: "https://huggingface.co/Cypher0x9" },
    { id: "contact", label: "Contact", href: "https://cyphermonkeylabs.com/#contact" }
  ];
  var THEMES = [
    ["aurora", "Aurora"],
    ["midnight", "Midnight"],
    ["neon", "Neon"],
    ["holographic", "Holographic"],
    ["cyberpunk", "Cyberpunk"],
    ["sunset", "Sunset"],
    ["light", "Light"],
    ["contrast", "High contrast"]
  ];
  var SWATCHES = [
    ["#1e1b4b", "Indigo text"],
    ["#0f172a", "Ink text"],
    ["#14532d", "Forest text"],
    ["#7f1d1d", "Wine text"],
    ["#f8fafc", "Paper text"]
  ];
  var DISCLAIMER = "Independent, free, learning-only student project. Respects every company and vendor. Trademarks belong to their owners. Not affiliated or endorsed. Concerns are removed or corrected promptly via the contact form at https://cyphermonkeylabs.com/#contact. Nothing is sold. Happy to volunteer for any organization.";

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
  function findSection(id) {
    for (var i = 0; i < SECTIONS.length; i += 1) if (SECTIONS[i][0] === id) return SECTIONS[i];
    return null;
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
    return (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
  }
  function themeBg() {
    var probe = getComputedStyle(document.documentElement).getPropertyValue("--bg").trim();
    if (/^#[0-9a-fA-F]{6}$/.test(probe)) return probe;
    return "#fff7ed";
  }

  function renderDisplay(host) {
    var theme = document.documentElement.dataset.theme || "aurora";
    var font = document.documentElement.dataset.font || "md";
    var motion = document.documentElement.dataset.motion === "reduce";
    var options = THEMES.map(function (pair) {
      return '<option value="' + pair[0] + '"' + (pair[0] === theme ? " selected" : "") + ">" + pair[1] + "</option>";
    }).join("");
    var swatches = SWATCHES.map(function (pair) {
      return '<button type="button" class="swatch" data-ink="' + pair[0] + '" style="background:' + pair[0] + '" aria-label="' + esc(pair[1]) + '"></button>';
    }).join("");
    host.innerHTML =
      '<div class="group" role="group" aria-label="Text size">' +
      '<button type="button" data-font="sm" aria-pressed="' + (font === "sm") + '">A−</button>' +
      '<button type="button" data-font="md" aria-pressed="' + (font === "md") + '">A</button>' +
      '<button type="button" data-font="lg" aria-pressed="' + (font === "lg") + '">A+</button></div>' +
      '<label class="lbl" for="theme-select">Theme</label><select id="theme-select">' + options + "</select>" +
      '<label class="lbl" for="ink-pick">Text color</label><input id="ink-pick" type="color" value="#1e1b4b" aria-label="Custom text color">' +
      swatches +
      '<button type="button" data-ink-clear>Theme text</button>' +
      '<button type="button" data-motion aria-pressed="' + motion + '">' + (motion ? "Motion off" : "Reduce motion") + "</button>" +
      '<form class="search-form" role="search" action="search.html"><input type="search" name="q" aria-label="Search the lab" placeholder="Search"></form>' +
      '<p class="contrast-note" data-contrast hidden></p>';
    host.addEventListener("click", onDisplayClick);
    host.addEventListener("change", onDisplayChange);
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
      var button = event.target.closest("[data-motion]");
      button.setAttribute("aria-pressed", next === "reduce" ? "true" : "false");
      button.textContent = next === "reduce" ? "Motion off" : "Reduce motion";
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
    note.hidden = ratio >= 4.5;
    if (ratio < 4.5) note.textContent = "Text contrast is about " + ratio.toFixed(1) + ":1 on this background. Pick another color for body text.";
  }

  function renderBanner() {
    var host = document.getElementById("section-banner");
    if (!host) return;
    var current = pageId();
    var chips = BANNER.map(function (id) {
      var item = findSection(id);
      if (!item) return "";
      var on = item[0] === current;
      return '<a class="chip' + (on ? " is-current" : "") + '" href="' + esc(item[2]) + '"' +
        (on ? ' aria-current="page"' : "") + ' title="' + esc(item[4]) + '">' +
        svg(item[3]) + "<span>" + esc(item[1]) + "</span></a>";
    }).join("");
    host.innerHTML =
      '<div class="banner-row">' +
      '<button type="button" class="banner-arrow" data-banner="-1" aria-label="Scroll sections left">‹</button>' +
      '<nav class="chip-rail" aria-label="Sections">' + chips + "</nav>" +
      '<button type="button" class="banner-arrow" data-banner="1" aria-label="Scroll sections right">›</button></div>';
    var rail = host.querySelector(".chip-rail");
    host.addEventListener("click", function (event) {
      var arrow = event.target.closest("[data-banner]");
      if (!arrow || !rail) return;
      rail.scrollBy({ left: Number(arrow.getAttribute("data-banner")) * Math.max(180, rail.clientWidth * 0.6), behavior: "smooth" });
    });
  }

  function renderDrawer() {
    if (document.getElementById("drawer")) return;
    var backdrop = document.createElement("div");
    backdrop.className = "drawer-backdrop";
    backdrop.hidden = false;
    var panel = document.createElement("nav");
    panel.id = "drawer";
    panel.className = "drawer";
    panel.setAttribute("aria-label", "Menu");
    panel.setAttribute("aria-hidden", "true");
    panel.setAttribute("inert", "");
    var current = pageId();
    var groups = ["Start", "Learn", "Show", "Practice", "Take"];
    var body = groups.map(function (group) {
      var links = SECTIONS.filter(function (item) { return item[5] === group; }).map(function (item) {
        var on = item[0] === current;
        return '<a class="menu-link' + (on ? " is-current" : "") + '" href="' + esc(item[2]) + '"' +
          (on ? ' aria-current="page"' : "") + '>' +
          svg(item[3]) + "<strong>" + esc(item[1]) + "</strong><span class=\"desc\">" + esc(item[4]) + "</span></a>";
      }).join("");
      return '<h2>' + group + "</h2>" + links;
    }).join("");
    panel.innerHTML =
      '<div class="drawer-head"><strong>Menu</strong><button type="button" data-close-drawer>Close</button></div>' +
      '<div class="display-controls" id="display-controls"></div>' +
      '<p class="drawer-path"><a href="start.html">Start here</a> is the short path. Search sits with the display controls.</p>' +
      body;
    document.body.appendChild(backdrop);
    document.body.appendChild(panel);
    renderDisplay(panel.querySelector("#display-controls"));
    var tab = document.getElementById("menu-btn");
    function openMenu() {
      document.body.dataset.menu = "open";
      panel.removeAttribute("inert");
      panel.setAttribute("aria-hidden", "false");
      backdrop.dataset.open = "true";
      if (tab) tab.setAttribute("aria-expanded", "true");
      var close = panel.querySelector("[data-close-drawer]");
      if (close) close.focus();
    }
    function closeMenu() {
      delete document.body.dataset.menu;
      panel.setAttribute("inert", "");
      panel.setAttribute("aria-hidden", "true");
      delete backdrop.dataset.open;
      if (tab) tab.setAttribute("aria-expanded", "false");
    }
    if (tab) {
      tab.addEventListener("click", function () {
        if (document.body.dataset.menu === "open") closeMenu();
        else openMenu();
      });
    }
    backdrop.addEventListener("click", closeMenu);
    panel.addEventListener("click", function (event) {
      if (event.target.closest("[data-close-drawer]") || event.target.closest("a")) closeMenu();
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && document.body.dataset.menu === "open") {
        closeMenu();
        if (tab) tab.focus();
      }
    });
    window.BA_OPEN_MENU = openMenu;
  }

  function renderPhone() {
    var bar = document.getElementById("phone-bar");
    if (!bar) return;
    bar.innerHTML =
      '<button type="button" data-phone="menu">Menu</button>' +
      '<a href="foundations.html">Learn</a>' +
      '<a href="diagrams.html">Diagrams</a>' +
      '<a href="practice.html">Play</a>' +
      '<button type="button" data-phone="listen">Listen</button>' +
      '<button type="button" data-phone="guide">Guide</button>';
    bar.addEventListener("click", function (event) {
      var button = event.target.closest("[data-phone]");
      if (!button) return;
      var kind = button.getAttribute("data-phone");
      if (kind === "menu" && window.BA_OPEN_MENU) window.BA_OPEN_MENU();
      if (kind === "listen") {
        if (window.BA_SPEAK) window.BA_SPEAK();
        else button.textContent = "Soon";
      }
      if (kind === "guide") document.dispatchEvent(new CustomEvent("ba-open-guide"));
    });
  }

  function renderFooter() {
    var footer = document.getElementById("site-footer");
    if (!footer) return;
    var badges = SOCIALS.map(function (item) {
      var text = item.iconOnly ? "" : "<span>" + esc(item.label === "Contact" ? "Contact" : "") + "</span>";
      if (item.id === "contact") text = "<span>Contact</span>";
      return '<a class="badge badge-' + esc(item.id) + '" href="' + esc(item.href) + '" aria-label="' + esc(item.label) + '">' +
        (BRAND[item.id] || "") + text + "</a>";
    }).join("");
    footer.innerHTML =
      '<div class="footer-inner">' +
      '<div class="disclaimer-box"><p><span class="shield" aria-hidden="true">🛡️</span> ' + esc(DISCLAIMER).replace(
        "https://cyphermonkeylabs.com/#contact",
        '<a href="https://cyphermonkeylabs.com/#contact">the contact form</a>'
      ) + "</p></div>" +
      "<p><strong>CypherMonkey Labs</strong></p>" +
      '<div class="badge-row">' + badges + "</div>" +
      '<p class="copyline">© 2026 CypherMonkeyLabs 🐒</p>' +
      '<ul class="identity-counts" aria-label="Library size">' +
      '<li><b data-count="notes">0</b> notes</li>' +
      '<li><b data-count="diagrams">0</b> diagrams</li>' +
      '<li><b data-count="flows">0</b> flows</li>' +
      '<li><b data-count="cards">0</b> cards</li></ul></div>';
  }

  window.BA_SET_COUNTS = function (counts) {
    document.querySelectorAll("[data-count]").forEach(function (node) {
      var key = node.getAttribute("data-count");
      if (!counts || counts[key] == null) return;
      node.textContent = String(counts[key]);
    });
  };

  renderBanner();
  renderDrawer();
  renderPhone();
  renderFooter();
  try {
    var key = "ba-visits";
    var data = JSON.parse(localStorage.getItem(key) || "{}");
    data[pageId()] = Date.now();
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) { /* ignore */ }
  window.BA_FRAME = { sections: SECTIONS, socials: SOCIALS };
})();
