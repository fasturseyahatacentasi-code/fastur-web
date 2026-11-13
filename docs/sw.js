/* Fas Tur service worker. Çevrimdışı: ana sayfa, turlar listesi, umre rehberi, sihirbaz ve ziyaret edilen sayfalar.
   Video ve ses ÖNBELLEĞE ALINMAZ. Sürüm değişince eski önbellekler silinir (SURUM'u artırın).
   Yollar scope'a göredir: github.io alt klasöründe ve kendi alan adında aynı çalışır. */
var SURUM = 'fastur-v12';
var KOK = self.registration.scope;               // örn. https://x.github.io/fastur-web/  ya da  https://www.fastur.com.tr/
var CEKIRDEK = ['', 'turlar/', 'umre-rehberi/', 'tur-bul/', 'talep/', 'assets/css/site.css', 'assets/css/tur-bul.css',
  'assets/js/ozet.js', 'assets/js/site.js', 'assets/js/dil.js', 'assets/js/tur-bul.js', 'assets/js/umre-rehberi.js', 'assets/js/pwa.js', 'assets/js/pano.js', 'assets/js/zemin.js', 'assets/js/harita.js', 'assets/js/katman.js', 'assets/js/derinlik.js', 'assets/js/muzik.js', 'assets/js/ucus.js', 'assets/js/sehirler.js', 'assets/js/tur-harita.js', 'assets/img/harita/harita-veri.js',
  'assets/img/genel/fastur-logo.png', 'assets/img/genel/favicon.svg', 'assets/img/pwa/icon-192.png'];
var MEDYA = /\.(mp4|webm|mov|m4v|mp3|ogg|wav|m4a)(\?|$)/i;

self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(SURUM).then(function (c) {
    return Promise.all(CEKIRDEK.map(function (u) { return c.add(new Request(KOK + u, { cache: 'reload' })).catch(function () {}); }));   // olmayan dosya kurulumu bozmaz
  }).then(function () { return self.skipWaiting(); }));
});
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (ks) { return Promise.all(ks.filter(function (k) { return k.indexOf('fastur-') === 0 && k !== SURUM; }).map(function (k) { return caches.delete(k); })); }).then(function () { return self.clients.claim(); }));
});
self.addEventListener('fetch', function (e) {
  var r = e.request, u = new URL(r.url);
  if (r.method !== 'GET' || u.origin !== location.origin) return;                  // form gönderimi, harici adresler (Formsubmit, fontlar) dokunulmaz
  if (r.headers.has('range') || MEDYA.test(u.pathname) || r.destination === 'video' || r.destination === 'audio') return;   // medya önbelleğe alınmaz
  if (r.mode === 'navigate') {                                                      // sayfa: önce ağ, olmazsa önbellek
    e.respondWith(fetch(r).then(function (res) { var k = res.clone(); caches.open(SURUM).then(function (c) { c.put(r, k); }); return res; })
      .catch(function () { return caches.match(r).then(function (m) { return m || caches.match(KOK) || Response.error(); }); }));
    return;
  }
  e.respondWith(caches.match(r).then(function (m) {                                 // dosya: önbellekten ver, arkada tazele
    var ag = fetch(r).then(function (res) { if (res && res.ok) { var k = res.clone(); caches.open(SURUM).then(function (c) { c.put(r, k); }); } return res; }).catch(function () { return m; });
    return m || ag;
  }));
});
