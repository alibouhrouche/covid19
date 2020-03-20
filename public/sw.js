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
        '/script.js',
        'https://cdn.glitch.com/f2f5091a-5f0a-4796-94fa-c7393a3b1aae/flagSprite60.png?v=1584651917190'
      ]);
    }());
});
