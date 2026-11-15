/* Fas Tur service worker — KAPATMA SÜRÜMÜ (15.11.2026, Hilal Hanım)
   Önbellek görevlisi, sık güncellemelerde cihazda eski dosyaları tutup siteyi "bozuk" gösteriyordu.
   Bu sürüm: cihazdaki tüm fastur önbelleklerini siler, kendini kaldırır ve açık sayfaları bir kez taze yükler.
   Fetch dinleyicisi YOK: hiçbir isteğe karışmaz, her şey doğrudan ağdan gelir.
   Bu dosya en az birkaç ay yerinde kalmalı (eski görevlisi olan cihazlar buraya bakarak kapanır); silinmez. */
var SURUM = 'fastur-kapat-1';
self.addEventListener('install', function () { self.skipWaiting(); });
self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys()
      .then(function (ks) { return Promise.all(ks.filter(function (k) { return k.indexOf('fastur-') === 0; }).map(function (k) { return caches.delete(k); })); })
      .then(function () { return self.registration.unregister(); })
      .then(function () { return self.clients.matchAll({ type: 'window' }); })
      .then(function (cs) { cs.forEach(function (c) { try { c.navigate(c.url); } catch (er) { } }); })
  );
});
