/* Umre kontrol listesi: işaretler yalnız bu tarayıcıda (localStorage). Depolama kapalıysa sessizce çalışmaya devam eder. */
(function () {
  'use strict';
  var KEY = 'fastur-umre-liste-v1', kutular = [].slice.call(document.querySelectorAll('input[data-ur]')), durum = {};
  if (!kutular.length) return;
  try { durum = JSON.parse(localStorage.getItem(KEY) || '{}') || {}; } catch (e) { durum = {}; }
  function kaydet() { try { localStorage.setItem(KEY, JSON.stringify(durum)); } catch (e) { /* depolama kapalı */ } }
  function say() { var n = kutular.filter(function (k) { return k.checked; }).length, el = document.getElementById('ur-ilerle'); if (el) el.textContent = n + ' / ' + kutular.length + ' madde tamam'; }
  kutular.forEach(function (k) {
    k.checked = !!durum[k.getAttribute('data-ur')];
    k.addEventListener('change', function () { if (k.checked) durum[k.getAttribute('data-ur')] = 1; else delete durum[k.getAttribute('data-ur')]; kaydet(); say(); });
  });
  var y = document.getElementById('ur-yazdir'); if (y) y.addEventListener('click', function () { window.print(); });
  var s = document.getElementById('ur-sifirla'); if (s) s.addEventListener('click', function () { durum = {}; kutular.forEach(function (k) { k.checked = false; }); kaydet(); say(); });
  say();
})();
