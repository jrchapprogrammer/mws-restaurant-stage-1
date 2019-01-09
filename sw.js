let version = 2;
const myCache = `'REST_CACHE-v${version}'`;

self.addEventListener('install', e => {
  console.log('installed');
  const urlsToCache = [
    '/',
    '/index.html',
    '/restaurant.html',
    '/restaurant.html?id=\\d/',
    '/css/styles.css',
    '/js/main.js',
    '/js/restaurant_info.js',
    '/img/.jpg$/',
  ];
  e.waitUntil(
    caches
      .open(myCache[myCache])
      .then(cache => {
        console.log('caches cached');
        return cache.addAll(urlsToCache);
      })
      .catch(error => console.log(`'Cache failed with error ${error}'`))
  );
});
self.addEventListener('activate', e => {
  e.waitUntil(
    caches
      .keys()
      .then(cacheNames =>
        Promise.all(
          cacheNames
            .filter(
              cacheName =>
                cacheName.startsWith('REST_CACHE-') && cacheName != myCache
            )
            .map(cacheName => cache.delete(cacheName))
        ).catch(err => console.log(err))
      )
  );
});
self.addEventListener('fetch', e => {
  console.log(e.request);
  e.respondWith(
    caches.match(e.request).then(response => {
      if (response) {
        return response;
      }
      return fetch(e.request);
    })
  );
});
