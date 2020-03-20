var version = 'v1::1::';

self.addEventListener("install", function(event) {
    console.log('WORKER: install event in progress.');
    event.waitUntil(
      caches
        .open(version + 'assets')
        .then(function(cache) {
          return cache.addAll([
            '/',
            '/style.css',
            '/script.js',
            '/icons.svg',
            '/freakflags.css',
            '/script.js'
          ]);
        })
        .then(function() {
          console.log('WORKER: install completed');
        })
    );
});
