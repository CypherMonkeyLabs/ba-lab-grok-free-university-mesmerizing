/* Load the lab scripts in order after first paint. */
requestAnimationFrame(function () {
  requestAnimationFrame(function () {
  var sources = [
    ["assets/js/brand.js"],
    ["assets/js/frame.js"],
    ["assets/js/app.js"],
    ["guide/guide.js", "module"],
    ["assets/js/onboard.js"],
    ["assets/js/pwa.js"]
  ];
  function load(index) {
    if (index >= sources.length) return;
    var spec = sources[index];
    var node = document.createElement("script");
    if (spec[1]) node.type = spec[1];
    node.src = spec[0];
    node.onload = function () { load(index + 1); };
    document.body.appendChild(node);
  }
  load(0);
  });
});
