const APP_PREFIX ='Budget-Tracker';
const VERSION ='version_01';
const CACHE_NAME = APP_PREFIX + VERSION;
// Choose a cache name
// const cacheName = 'cache-v1';
// List the files to precache
// const FILES_TO_CACHE
const precacheResources = [
'/', 
'/index.html', 
'/css/style.css', 
'/js/main.js', 
'/js/index.js',
'/js/ibd.js',
'/icons',
// '/js/app/editor.js', 
// '/js/lib/actions.js'
];

// When the service worker is installing, open the cache and add the precache resources to it
self.addEventListener('install', (event) => {
  console.log('Service worker install event!');
  event.waitUntil(caches.open(cacheName).then((cache) => cache.addAll(precacheResources)));
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then(keyList =>{
        let cacheKeeplist = keyList.filer(key=>{
            return key.indexof(APP_PREFIX);
        });
        cacheKeeplist.push(CACHE_NAME);

        return Promise.all(
            keyList.map(key,i=>{
                if(cacheKeeplist.indexof(key)=== -1){
                    console.log('deleting cache : '+ keyList[i]);
                    return caches.delete(keyList[i]);
                }
            })
        );
        })
    );
});
//   console.log('Service worker activate event!');

// When there's an incoming fetch request, try and respond with a precached resource, otherwise fall back to the network
self.addEventListener('fetch', (event) => {
  console.log('Fetch intercepted for:', event.request.url)
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      else{ console.log('file is not cached,fetching :' +event.request.url)}
      return fetch(event.request);
    }),
  );
});