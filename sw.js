// 트리오짐 일지 앱: 화면 파일만 저장해 두고(인터넷이 느릴 때 빨리 열기), 기록 저장(구글 서버)은 항상 인터넷으로 해요.
const CACHE = "trio-v1";
self.addEventListener("install", e => self.skipWaiting());
self.addEventListener("activate", e => e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())));
self.addEventListener("fetch", e => {
  const u = new URL(e.request.url);
  if (e.request.method !== "GET" || u.origin !== location.origin) return;   // 구글 서버·유튜브는 건드리지 않음
  e.respondWith(fetch(e.request).then(r => { const c = r.clone(); caches.open(CACHE).then(x => x.put(e.request, c)); return r; }).catch(() => caches.match(e.request, { ignoreSearch: u.pathname.endsWith("/") || u.pathname.endsWith(".html") })));
});