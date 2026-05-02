const CACHE_NAME = "betsie-lite-v3";
const SW_SCRIPT_PATH = self.location.pathname || "/sw.js";
const APP_BASE_PATH = SW_SCRIPT_PATH.slice(0, SW_SCRIPT_PATH.lastIndexOf("/"));
const PRECACHE_URLS = [
  `${APP_BASE_PATH}/`,
  `${APP_BASE_PATH}/index.html`,
  `${APP_BASE_PATH}/manifest.webmanifest`,
  `${APP_BASE_PATH}/icons/favicon-16.png`,
  `${APP_BASE_PATH}/icons/favicon-32.png`,
  `${APP_BASE_PATH}/icons/apple-touch-icon.png`,
  `${APP_BASE_PATH}/icons/icon-192.png`,
  `${APP_BASE_PATH}/icons/icon-512.png`
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") {
    return;
  }

  const requestUrl = new URL(event.request.url);
  const isSameOrigin = requestUrl.origin === self.location.origin;
  const isNavigationRequest = event.request.mode === "navigate";
  const indexPath = `${APP_BASE_PATH}/index.html`;
  const basePathRoot = `${APP_BASE_PATH}/`;

  if (isNavigationRequest) {
    // Always prefer fresh HTML so users see latest deployed code.
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response && response.status === 200 && isSameOrigin) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(indexPath, responseClone));
          }
          return response;
        })
        .catch(async () => {
          const cachedIndex = await caches.match(indexPath);
          return cachedIndex || caches.match(basePathRoot);
        })
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) {
        return cached;
      }

      return fetch(event.request)
        .then((response) => {
          if (
            response &&
            response.status === 200 &&
            isSameOrigin
          ) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone));
          }
          return response;
        })
        .catch(() => caches.match(indexPath));
    })
  );
});
