const CACHE_NAME='qx-signal-v1';
const URLS_TO_CACHE=[
  './',
  './index.html',
  './manifest.json'
];

self.addEventListener('install',function(event){
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache){
      return cache.addAll(URLS_TO_CACHE);
    })
  );
});

self.addEventListener('fetch',function(event){
  event.respondWith(
    caches.match(event.request).then(function(response){
      if(response)return response;
      return fetch(event.request).then(function(response){
        if(!response||response.status!==200||response.type!=='basic')return response;
        var responseToCache=response.clone();
        caches.open(CACHE_NAME).then(function(cache){
          cache.put(event.request,responseToCache);
        });
        return response;
      }).catch(function(){
        return caches.match('./index.html');
      });
    })
  );
});

self.addEventListener('activate',function(event){
  event.waitUntil(
    caches.keys().then(function(cacheNames){
      return Promise.all(
        cacheNames.map(function(cacheName){
          if(cacheName!==CACHE_NAME)return caches.delete(cacheName);
        })
      );
    })
  );
});
