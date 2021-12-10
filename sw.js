var VERSION = 'v1';

var cacheFirstFiles = [
  // add paths and URLs to pull from cache first if it has been loaded before. Else fetch from network.
  // if loading from cache, fetch from network in the background to update the resource. Examples:
  "textures/button.png",
  "textures/ceiling.png",
  "textures/fin.png",
  "textures/finbig.png",
  "textures/floor.png",
  "textures/start.png",
  "textures/wall.png",

  "index.css",

  "canvas-only.html",

  "sw.js",
  "game/generation.js",
  "game/keydrown.min.js",
  "game/model_loader.js",
  "game/object_defines.js",
  "game/player_controller.js",
  "game/surface.js",
  "game/three.module.js",
  "game/utils.js",

];

var networkFirstFiles = [
  // add paths and URLs to pull from network first. Else fall back to cache if offline
  "maze95.js",
  "index.html"
];

// Below is the service worker code.

var cacheFiles = cacheFirstFiles.concat(networkFirstFiles);

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(VERSION).then(cache => {
      return cache.addAll(cacheFiles);
    })
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') { return; }
  if (networkFirstFiles.indexOf(event.request.url) !== -1) {
    event.respondWith(networkElseCache(event));
  } else if (cacheFirstFiles.indexOf(event.request.url) !== -1) {
    event.respondWith(cacheElseNetwork(event));
  } else {
    event.respondWith(fetch(event.request));
  }
});

// If cache else network.
// For images and assets that are not critical to be fully up-to-date.
// developers.google.com/web/fundamentals/instant-and-offline/offline-cookbook/
// #cache-falling-back-to-network
function cacheElseNetwork (event) {
  return caches.match(event.request).then(response => {
    function fetchAndCache () {
       return fetch(event.request).then(response => {
        // Update cache.
        caches.open(VERSION).then(cache => cache.put(event.request, response.clone()));
        return response;
      });
    }

    // If not exist in cache, fetch.
    if (!response) { return fetchAndCache(); }

    // If exists in cache, return from cache while updating cache in background.
    fetchAndCache();
    return response;
  });
}

// If network else cache.
// For assets we prefer to be up-to-date (i.e., JavaScript file).
function networkElseCache (event) {
  return caches.match(event.request).then(match => {
    if (!match) { return fetch(event.request); }
    return fetch(event.request).then(response => {
      // Update cache.
      caches.open(VERSION).then(cache => cache.put(event.request, response.clone()));
      return response;
    }) || response;
  });
}