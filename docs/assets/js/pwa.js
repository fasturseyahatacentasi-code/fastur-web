/* 15.11.2026 (Hilal Hanım): önbellek görevlisi (service worker) KAPATILDI.
   Sık güncellemelerde cihazda kalan eski dosyalar siteyi bozuk gösteriyordu. Bu dosya artık görevli KAYDETMEZ;
   cihazda eskisi varsa kaldırır, fastur önbelleklerini siler ve (eski görevli sayfayı yönetiyorduysa) sayfayı bir kez taze yükler.
   http(s) dışında (file://) sessizce geçer. */
(function () {
  'use strict';
  if (!/^https?:$/.test(location.protocol)) return;
  var yonetiliyordu = !!(navigator.serviceWorker && navigator.serviceWorker.controller);
  var isler = [];
  if ('serviceWorker' in navigator && navigator.serviceWorker.getRegistrations) {
    isler.push(navigator.serviceWorker.getRegistrations().then(function (rs) { return Promise.all(rs.map(function (r) { return r.unregister(); })); }).catch(function () { }));
  }
  if (window.caches && caches.keys) {
    isler.push(caches.keys().then(function (ks) { return Promise.all(ks.filter(function (k) { return k.indexOf('fastur-') === 0; }).map(function (k) { return caches.delete(k); })); }).catch(function () { }));
  }
  Promise.all(isler).then(function () {
    if (!yonetiliyordu) return;
    var A = 'ft_sw_temizlendi';
    try { if (sessionStorage.getItem(A)) return; sessionStorage.setItem(A, '1'); } catch (e) { return; }   /* tek sefer; döngü olmaz */
    location.reload();
  });
})();
