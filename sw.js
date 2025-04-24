const CACHE_NAME = "ecommerce-cache-v1";
const FILES_TO_CACHE = [
  "/",
  "/index.html",
  "/styles.css",
  "/main.js",
  "/offline.html"
];

// INSTALL Event
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log("[Service Worker] Caching app shell");
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// ACTIVATE Event
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keyList => {
      return Promise.all(
        keyList.map(key => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      );
    })
  );
  self.clients.claim();
});

// FETCH Event
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      if (response) {
        console.log("[Service Worker] Fetched from cache:", event.request.url);
        return response;
      }
      return fetch(event.request).then(networkResponse => {
        if (event.request.url.indexOf(".html") !== -1) {
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, networkResponse.clone()));
        }
        return networkResponse;
      }).catch(() => caches.match("/offline.html"));
    })
  );
});

// SYNC Event (Background Sync)
self.addEventListener("sync", event => {
  if (event.tag === "sync-order") {
    console.log("[Service Worker] Syncing order data...");
    event.waitUntil(
      self.registration.showNotification("Sync Successful", {
        body: "Order data synced successfully!",
        icon: "https://picsum.photos/128"
      })
    );
  }
});

// PUSH Event
self.addEventListener("push", event => {
  const data = event.data ? event.data.text() : "New Notification";
  console.log("[Service Worker] Push event received:", data);

  const options = {
    body: data,
    icon: "https://picsum.photos/128"
  };

  event.waitUntil(
    self.registration.showNotification("ShopEase", options)
      .catch(error => console.error("Error showing notification:", error))
  );
});
