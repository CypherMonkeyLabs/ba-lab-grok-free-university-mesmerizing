/* Register a network-first service worker so the lab can be installed. */
(function () {
  if (!("serviceWorker" in navigator)) return;
  window.addEventListener("load", function () {
    navigator.serviceWorker.register("sw.js").catch(function () { /* ignore */ });
  });
})();
