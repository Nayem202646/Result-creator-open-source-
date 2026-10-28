const CACHE='charshi-pages-v15';
const BASE=new URL('.',self.registration.scope).pathname;
const HOME=BASE;
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll([HOME,BASE+'manifest.webmanifest',BASE+'assets/justice-for-hadi.png',BASE+'assets/nayem-logo.png',BASE+'assets/nayem-logo.png']))));
self.addEventListener('activate',event=>event.waitUntil((async()=>{for(const key of await caches.keys())if(key.startsWith('charshi-pages-')&&key!==CACHE)await caches.delete(key);await self.clients.claim()})()));
self.addEventListener('fetch',event=>{
 const request=event.request,url=new URL(request.url);
 if(request.method!=='GET'||url.origin!==self.location.origin||!url.pathname.startsWith(BASE)||url.pathname.startsWith(BASE+'api/'))return;
 event.respondWith((async()=>{try{const response=await fetch(request);if(response.ok)(await caches.open(CACHE)).put(request,response.clone());return response}catch{const cache=await caches.open(CACHE);return await cache.match(request)||(request.mode==='navigate'?await cache.match(HOME):Response.error())}})())
});
