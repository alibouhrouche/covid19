var version = 'v1::00002::';

self.addEventListener("install", (event) => {
    event.waitUntil(async function() {
      const cache = await caches.open(version);
      await cache.addAll([
        '/',
        '/style.css',
        '/script.js',
        '/icons.svg',
        '/freakflags.css',
        '/favicon.ico',
        'https://cdn.glitch.com/f2f5091a-5f0a-4796-94fa-c7393a3b1aae/flagSprite60.png?v=1584651917190'
      ]);
        return self.skipWaiting();
    }());
});

self.addEventListener("activate", function(event) {
    event.waitUntil(
      caches.keys()
        .then(function (keys) {
          return Promise.all(
            keys
              .filter(function (key) {
                return !key.startsWith(version);
              })
              .map(function (key) {
                return caches.delete(key);
              })
          );
        })
    );
});


self.addEventListener('fetch', (event) => {
    const requestURL = new URL(event.request.url);
    if (requestURL.origin == location.origin) {
      if (requestURL.pathname == "/data") {
        return;
      }
    }
    event.respondWith(async function() {
      const cachedResponse = await caches.match(event.request);
      return cachedResponse || fetch(event.request);
    }());
});
