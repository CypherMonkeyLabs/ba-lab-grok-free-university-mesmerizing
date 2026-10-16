/* Apply saved display settings before first paint. */
(function () {
  var root = document.documentElement;
  var themes = {
    aurora: 1,
    neon: 1,
    holographic: 1,
    cyberpunk: 1,
    sunset: 1,
    light: 1,
    contrast: 1
  };
  try {
    var theme = localStorage.getItem("ba-theme") || "aurora";
    if (!themes[theme]) theme = "aurora";
    root.dataset.theme = theme;
    var font = localStorage.getItem("ba-font") || "md";
    if (font !== "sm" && font !== "md" && font !== "lg") font = "md";
    root.dataset.font = font;
    var motion = localStorage.getItem("ba-motion") || "";
    if (motion === "reduce" || motion === "full") root.dataset.motion = motion;
    var ink = localStorage.getItem("ba-ink") || "";
    if (/^#[0-9a-fA-F]{6}$/.test(ink)) {
      root.style.setProperty("--ink-custom", ink);
      root.dataset.ink = "custom";
    }
  } catch (err) {
    root.dataset.theme = "aurora";
    root.dataset.font = "md";
  }
})();
