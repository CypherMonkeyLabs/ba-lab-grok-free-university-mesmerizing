/* Chrome: top-left menu, one banner row, phone bar, boxed disclaimer. */
(function () {
  var SECTIONS = [
    ["home", "Home", "index.html", "home", "Front door and the one-hour path.", "Start"],
    ["start", "Start here", "start.html", "rocket", "A short path from foundations to a portfolio piece.", "Start"],
    ["foundations", "Foundations", "foundations.html", "book", "What business analysis is, and how the roles differ.", "Learn"],
    ["ecosystem", "Ecosystem", "ecosystem.html", "globe", "Glossary, mind map, sister technologies, integrations, and bridges.", "Learn"],
    ["babok", "BABOK", "babok.html", "layers", "Six knowledge areas and the technique map.", "Learn"],
    ["requirements", "Requirements", "requirements.html", "list", "Stories, acceptance criteria, and traceability.", "Learn"],
    ["modeling", "Modeling", "modeling.html", "flow", "BPMN, UML, ERD, and C4.", "Learn"],
    ["agile", "Agile", "agile.html", "cycle", "Scrum, Kanban, design thinking, and jobs.", "Learn"],
    ["data", "Data", "data.html", "chart", "SQL, KPIs, and process mining.", "Learn"],
    ["tools", "Tools", "tools.html", "tool", "Where teams keep the work.", "Learn"],
    ["ai", "AI for BAs", "ai.html", "spark", "Draft, then a person checks.", "Learn"],
    ["domains", "Domains", "domains.html", "building", "Same moves, different constraints.", "Learn"],
    ["omni", "Omnichannel", "omni.html", "channels", "Voice, chat, SMS, WhatsApp, email, and social journeys.", "Learn"],
    ["metrics", "Contact metrics", "metrics.html", "gauge", "AHT, service level, FCR, abandonment, occupancy, and CSAT.", "Learn"],
    ["migrate", "Cloud migration", "migrate.html", "move", "BA artifacts for a legacy contact center moving to the cloud.", "Learn"],
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
    ["credits", "Legal and credits", "credits.html", "spark", "Disclaimer, copyright, privacy, and corrections.", "Take"],
    ["help", "Help", "help.html", "book", "Menu, course, guide, and downloads, including the tour.", "Start"],
    ["search", "Search", "search.html", "link", "Find a note by words you remember.", "Start"]
  ];
  var BANNER = ["home", "downloads", "start", "foundations", "babok", "requirements", "omni", "metrics", "migrate", "ecosystem", "modeling", "agile", "practice", "diagrams"];
  var GLOW = { diagrams: 1, practice: 1, downloads: 1 };
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
    channels: '<path d="M5 15a4 4 0 0 1 4-4h0M9 11V8a3 3 0 0 1 6 0v3M15 11a4 4 0 0 1 4 4"/><circle cx="7" cy="16.5" r="1.2"/><circle cx="12" cy="16.5" r="1.2"/><circle cx="17" cy="16.5" r="1.2"/>',
    gauge: '<path d="M5 16a7 7 0 0 1 14 0"/><path d="M12 16l4-4"/><path d="M6 19h12"/>',
    move: '<path d="M4 8h11M15 8l-2.5-2.5M15 8l-2.5 2.5M20 16H9M9 16l2.5-2.5M9 16l2.5 2.5"/>',
    gem: '<path d="M12 3 20 10 12 21 4 10z"/>',
    check: '<circle cx="12" cy="12" r="8"/><path d="m8.5 12.2 2.3 2.3 4.7-5"/>',
    mic: '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M6 11a6 6 0 0 0 12 0M12 17v4"/>',
    cards: '<rect x="3" y="6" width="12" height="14" rx="2"/><rect x="9" y="4" width="12" height="14" rx="2"/>',
    image: '<rect x="4" y="5" width="16" height="14" rx="2"/><circle cx="9" cy="10" r="1.4"/><path d="m7 16 3.2-3.2L13 15l2-2 2 3"/>',
    link: '<path d="M10 13a5 5 0 0 0 7.1.1l1.9-1.9a5 5 0 0 0-7.1-7.1L10.8 5"/><path d="M14 11a5 5 0 0 0-7.1-.1L5 12.8a5 5 0 0 0 7.1 7.1l1.1-1.1"/>',
    download: '<path d="M12 4v10M8 10l4 4 4-4M5 19h14"/>',
    menu: '<path d="M5 7h14M5 12h14M5 17h14"/>'
  };
  var SOCIALS = [
    { id: "site", label: "CypherMonkey Labs website", href: "https://cyphermonkeylabs.com" },
    { id: "github", label: "GitHub organization", href: "https://github.com/CypherMonkeyLabs" },
    { id: "profile", label: "Profile links", href: "https://linktr.ee/cypherMonkey", iconOnly: true }
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
  var DISCLAIMER = "Independent, free, learning-only student project. Respects every company and vendor. Trademarks belong to their owners. Not affiliated or endorsed. Names in the contact-center rooms are citations of pages opened in October 2026, not endorsements. Concerns are removed or corrected promptly via the contact form at https://cyphermonkeylabs.com/#contact. Nothing is sold. Happy to volunteer for any organization.";

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
      return '<a class="chip' + (on ? " is-current" : "") + (GLOW[item[0]] ? " glow-ico" : "") + '" href="' + esc(item[2]) + '"' +
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
        return '<a class="menu-link' + (on ? " is-current" : "") + (GLOW[item[0]] ? " glow-ico" : "") + '" href="' + esc(item[2]) + '"' +
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
    function barControl(tag, attrs, icon, label, glow) {
      return "<" + tag + ' class="' + (glow ? "glow-ico" : "") + '" ' + attrs + ">" +
        '<span class="bar-ico" aria-hidden="true">' + svg(icon) + "</span><span>" + label + "</span></" + tag + ">";
    }
    bar.innerHTML =
      barControl("button", 'type="button" data-phone="menu"', "menu", "Menu", true) +
      barControl("a", 'href="foundations.html"', "book", "Learn", false) +
      barControl("a", 'href="diagrams.html"', "image", "Diagrams", true) +
      barControl("a", 'href="practice.html"', "cards", "Play", true) +
      barControl("button", 'type="button" data-phone="listen"', "mic", "Listen", true) +
      barControl("button", 'type="button" data-phone="guide"', "spark", "Guide", false);
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

  function brandArt(value, key) {
    if (!value) return "";
    return typeof value === "function" ? value(key) : value;
  }
  function renderFooter() {
    var footer = document.getElementById("site-footer");
    if (!footer) return;
    var marks = window.CANON_BRAND || {};
    var icons =
      '<a class="brand-icon brand-web" href="https://cyphermonkeylabs.com" aria-label="CypherMonkey Labs website">' + brandArt(marks.monkey, "ft") + "</a>" +
      '<a class="brand-icon brand-gh" href="https://github.com/CypherMonkeyLabs" aria-label="GitHub organization">' + brandArt(marks.github, "gh") + "</a>" +
      '<a class="brand-icon brand-lt" href="https://linktr.ee/cypherMonkey" aria-label="Linktree">' + brandArt(marks.linktree, "lt") + "</a>";
    footer.innerHTML =
      '<div class="footer-inner">' +
      '<div class="disclaimer-box"><p><span class="shield" aria-hidden="true">🛡️</span> ' + esc(DISCLAIMER).replace(
        "the contact form at https://cyphermonkeylabs.com/#contact",
        '<a href="https://cyphermonkeylabs.com/#contact">the contact form</a>'
      ) + "</p></div>" +
      '<p class="footer-brand">CypherMonkey Labs</p>' +
      '<nav class="brand-icons" aria-label="CypherMonkey Labs links">' + icons + "</nav>" +
      '<p class="copyline">© 2026 CypherMonkeyLabs</p>' +
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

  var menuBtn = document.getElementById("menu-btn");
  if (menuBtn) menuBtn.classList.add("glow-ico");
  document.querySelectorAll("[data-listen]").forEach(function (node) { node.classList.add("glow-ico"); });
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
  window.BA_FRAME = { sections: SECTIONS, socials: SOCIALS, icon: svg };
  var root = document.documentElement;
  function motionOff() {
    if (root.dataset.motion === "reduce") return true;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }
  if (!motionOff()) {
    var pending = false;
    window.addEventListener("scroll", function () {
      if (pending || motionOff()) return;
      pending = true;
      requestAnimationFrame(function () {
        pending = false;
        root.style.setProperty("--shift", Math.round((window.scrollY || 0) * 0.14) + "px");
      });
    }, { passive: true });
  }
})();
