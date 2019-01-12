let version = 2;
let myCache = [`'REST_CACHE-v${version}'`];

self.addEventListener('install', e => {
  console.log('installed');
});
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== myCache) {
            return caches.delete(key);
          }
        })
      ).catch(err => console.log(`Not cached! ${err}`))
    )
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    fetch(e.request)
      .then(response => {
        const resClone = response.clone();
        caches.open(myCache).then(cache => {
          cache.put(e.request, resClone);
          console.log('cached');
        });
        return response;
      })
      .catch(err => caches.match(e.request).then(response => response))
  );
});
