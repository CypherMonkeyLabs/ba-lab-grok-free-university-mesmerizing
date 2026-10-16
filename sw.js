/* Network-first. A small cache is only a fallback when the network fails. */
var CACHE = "ba-lab-v3";
var PRECACHE = ["./index.html", "./assets/css/lab.css", "./assets/js/boot.js", "./manifest.webmanifest"];

self.addEventListener("install", function (event) {
  event.waitUntil(caches.open(CACHE).then(function (cache) {
    return cache.addAll(PRECACHE);
  }));
  self.skipWaiting();
});

self.addEventListener("activate", function (event) {
  event.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (key) { return key !== CACHE; }).map(function (key) {
      return caches.delete(key);
    }));
  }));
  self.clients.claim();
});

self.addEventListener("fetch", function (event) {
  var request = event.request;
  if (request.method !== "GET") return;
  event.respondWith(fetch(request).then(function (response) {
    return response;
  }).catch(function () {
    return caches.match(request).then(function (cached) {
      return cached || caches.match("./index.html");
    });
  }));
});
