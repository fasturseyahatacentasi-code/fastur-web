/* Service worker kaydı. Göreli yol: body[data-kok] + sw.js. http(s) dışında (file://) çalışmaz, sessizce geçer. */
(function () {
  'use strict';
  if (!('serviceWorker' in navigator) || !/^https?:$/.test(location.protocol)) return;
  var K = document.body.getAttribute('data-kok') || './';
  window.addEventListener('load', function () { navigator.serviceWorker.register(K + 'sw.js').catch(function () { /* kayıt başarısız: site yine çalışır */ }); });
})();
