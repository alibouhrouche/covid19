var version = 'v1::1::';

self.addEventListener("install", (event) => {
    event.waitUntil(async function() {
      const cache = await caches.open(version + 'static');
      await cache.addAll([
        '/',
        '/style.css',
        '/script.js',
        '/icons.svg',
        '/freakflags.css',
        '/favicon.ico',
        'https://cdn.glitch.com/f2f5091a-5f0a-4796-94fa-c7393a3b1aae/flagSprite60.png?v=1584651917190'
      ]);
    }());
});

self.addEventListener("activate", function(event) {
    event.waitUntil(
      caches.keys()
        .then(function (keys) {
          return Promise.all(
            keys
              .filter(function (key) {
                // Filter by keys that don't start with the latest version prefix.
                return !key.startsWith(version);
              })
              .map(function (key) {
                /* Return a promise that's fulfilled
                   when each outdated cache is deleted.
                */
                return caches.delete(key);
              })
          );
        })
    );
});

self.addEventListener('fetch', (event) => {
    // Parse the URL:
    const requestURL = new URL(event.request.url);
  
    // Handle requests to a particular host specifically
    if (requestURL.hostname == 'cdn.glitch.com') {
      //event.respondWith(/* some combination of patterns */);
      return;
    }
    // Routing for local URLs
    if (requestURL.origin == location.origin) {
      if (requestURL.pathname.endsWith('.json')) {
        event.respondWith(/* some other combination of patterns */);
        return;
      }
    }
  
    // A sensible default pattern
    event.respondWith(async function() {
      const cachedResponse = await caches.match(event.request);
      return cachedResponse || fetch(event.request);
    }());
});