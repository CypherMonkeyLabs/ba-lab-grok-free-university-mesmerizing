/* Prepared iframe helper. Not a versioned SDK. Copy it beside the lab pages. */
(function () {
  var frame = document.createElement("iframe");
  frame.title = "Business Analyst Free University";
  frame.src = "index.html";
  frame.style.width = "100%";
  frame.style.minHeight = "40rem";
  frame.style.border = "0";
  var host = document.currentScript && document.currentScript.parentElement;
  if (host) host.appendChild(frame);
})();
