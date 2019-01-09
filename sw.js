let version = 5;
let myCache = [`'REST_CACHE-v${version}'`];

self.addEventListener('install', e => {
  console.log('installed');
  //   const urlsToCache =
  e.waitUntil(
    caches
      .open(myCache)
      .then(cache =>
        cache.addAll([
          '/',
          '/index.html',
          '/restaurant.html',
          '/css/styles.css',
          '/js/main.js',
          '/js/restaurant_info.js',
          '/data/restaurants.json',
          '/js/dbhelper.js',
          '/img/1.jpg',
          '/img/2.jpg',
          '/img/3.jpg',
          '/img/4.jpg',
          '/img/5.jpg',
          '/img/6.jpg',
          '/img/7.jpg',
          '/img/8.jpg',
          '/img/9.jpg',
          '/img/10.jpg',
        ])
      )
      .catch(error => console.log(`'Cache failed with error ${error}'`))
  );
});
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (!myCache.includes(key)) {
            return caches.delete(key);
          }
        })
      ).catch(err => console.log(err))
    )
  );
});
// self.addEventListener('fetch', e => {
//   //   console.log(e.request);
//   e.respondWith(
//     caches.match(e.request).then(response => {
//       return response || fetch(e.request);
//     })
//   );
// });
self.addEventListener('fetch', event => {
  if (event.request.mode === 'navigate') {
    // See /web/fundamentals/getting-started/primers/async-functions
    // for an async/await primer.
    event.respondWith(
      (async function() {
        // Optional: Normalize the incoming URL by removing query parameters.
        // Instead of https://example.com/page?key=value,
        // use https://example.com/page when reading and writing to the cache.
        // For static HTML documents, it's unlikely your query parameters will
        // affect the HTML returned. But if you do use query parameters that
        // uniquely determine your HTML, modify this code to retain them.
        const normalizedUrl = new URL(event.request.url);
        normalizedUrl.search = '';

        // Create promises for both the network response,
        // and a copy of the response that can be used in the cache.
        const fetchResponseP = fetch(normalizedUrl);
        const fetchResponseCloneP = fetchResponseP.then(r => r.clone());

        // event.waitUntil() ensures that the service worker is kept alive
        // long enough to complete the cache update.
        event.waitUntil(
          (async function() {
            const cache = await caches.open('my-cache-name');
            await cache.put(normalizedUrl, await fetchResponseCloneP);
          })()
        );

        // Prefer the cached response, falling back to the fetch response.
        return (await caches.match(normalizedUrl)) || fetchResponseP;
      })()
    );
  }
});
