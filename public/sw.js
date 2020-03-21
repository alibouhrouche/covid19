var version = 'v1::000001:000003::sarscov2';

self.addEventListener("install", (event) => {
    event.waitUntil(async function() {
      const cache = await caches.open(version);
      await cache.addAll([
        '/',
        '/style.css',
        '/script.js',
        '/icons.svg',
        '/freakflags.css',
        '/manifest.json',
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
                return (key != version)&&(key != "sarscov2-data");
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
    var request = event.request;
    if (request.method !== 'GET') {
        return;
    }
    if (requestURL.origin == location.origin) {
      if (requestURL.pathname == "/data") {
        return;
      }
    }
    event.respondWith(caches
      .match(request) 
      .then(queriedCache)
    );
    function queriedCache (cached) {
      var networked = fetch(request)
        .then(fetchedFromNetwork, unableToResolve)
        .catch(unableToResolve);
      return cached || networked;
    }
    function fetchedFromNetwork (response) {
        //var clonedResponse = response.clone();
        //caches.open(version).then(function add (cache) {
          //cache.put(request, clonedResponse);
        //});
        return response;
    }
    function unableToResolve () {
      return offlineResponse();
    }
    function offlineResponse () {
      return new Response('', { status: 503, statusText: 'Service Unavailable' });
    }
});

