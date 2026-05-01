const CACHE_NAME = "betsie-lite-v2";
const PRECACHE_URLS = [
  "/",
  "/index.html",
  "/manifest.webmanifest",
  "/icons/favicon-16.png",
  "/icons/favicon-32.png",
  "/icons/apple-touch-icon.png",
  "/icons/icon-192.png",
  "/icons/icon-512.png"
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

  if (isNavigationRequest) {
    // Always prefer fresh HTML so users see latest deployed code.
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response && response.status === 200 && isSameOrigin) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put("/index.html", responseClone));
          }
          return response;
        })
        .catch(async () => {
          const cachedIndex = await caches.match("/index.html");
          return cachedIndex || caches.match("/");
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
        .catch(() => caches.match("/index.html"));
    })
  );
});
