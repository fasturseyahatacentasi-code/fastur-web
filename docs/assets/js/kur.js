/* TL karşılığı (19.11.2026 Hilal Hanım): Ziraat Katılım satış kuru, assets/data/kur.json (GitHub Actions 30 dk'da bir, yalnız 09:00–18:00 hafta içi).
   data-tl="tutar|PARA" olan fiyatların altına "≈ 75.600 TL" yazar; [data-kur-not] yerine kaynak + güncelleme saati + uyarı. Kur yoksa hiçbir şey eklenmez. */
(function () {
  'use strict';
  var K = document.body.getAttribute('data-kok') || './', KUR = null;
  function tl(n) { return Math.round(n / 100) * 100; }
  function bicim(n) { try { return tl(n).toLocaleString('tr-TR'); } catch (e) { return String(tl(n)); } }
  function saat(z) { var m = /T(\d\d:\d\d)/.exec(z || ''); var g = /(\d{4})-(\d\d)-(\d\d)/.exec(z || ''); return (g ? g[3] + '.' + g[2] + '.' + g[1] + ' ' : '') + (m ? m[1] : ''); }
  function uygula(kok) {
    if (!KUR) return;
    (kok || document).querySelectorAll('[data-tl]').forEach(function (el) {
      if (el.querySelector('.tl-karsilik')) return;
      var p = el.getAttribute('data-tl').split('|'), n = parseFloat(p[0]), para = (p[1] || '').toUpperCase(), k = KUR[para];
      if (!n || !k) return;
      var s = document.createElement('small'); s.className = 'tl-karsilik'; s.textContent = '≈ ' + bicim(n * k) + ' TL';
      el.appendChild(s);
    });
    (kok || document).querySelectorAll('[data-kur-not]').forEach(function (el) {
      el.textContent = '≈ TL tutarlar: Banka satış kuru, güncelleme ' + saat(KUR.zaman) + ' · Bilgi amaçlıdır, kesin fiyat için bize ulaşın.';
      el.hidden = false;
    });
  }
  window.FT_KUR = { uygula: uygula };
  var b = Math.floor(Date.now() / 600000);
  fetch(K + 'assets/data/kur.json?b=' + b, { cache: 'no-store' }).then(function (r) { return r.ok ? r.json() : null; }).then(function (j) {
    if (j && j.USD && j.EUR) { KUR = j; uygula(); }
  }).catch(function () { });
})();
