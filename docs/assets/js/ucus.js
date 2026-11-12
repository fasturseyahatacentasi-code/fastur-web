/* ============================================================
   FAS TUR — kaydırmaya bağlı uçuş (yalnız ana sayfa)
   Sağ kenarda dikey bir rota çizgisi: küçük uçak kaydırdıkça ilerler, ışık izi bırakır; her bölüm bir "durak".
   Mobil (<900 px) ve prefers-reduced-motion: üstte ince STATİK ilerleme çubuğu (uçak yok, geçiş yok).
   Durak listesi: aşağıdaki DURAKLAR (bölüm id'leri). Süs amaçlıdır (aria-hidden).
   ============================================================ */
(function () {
  'use strict';
  var DURAKLAR = [['yola-cikis', 'Yola çıkış'], ['yorunge', 'Rotanı seç'], ['umre', 'Umre'], ['fas', 'Fas'], ['dunya', 'Dünya'], ['rota-sesleri', 'Rota sesleri'], ['anilar', 'Anılar'], ['sira-sizde', 'Sıra sizde']]
    .map(function (d) { var e = document.getElementById(d[0]) || (d[0] === 'yola-cikis' ? document.querySelector('.kahraman') : null); return e ? { e: e, ad: d[1] } : null; }).filter(Boolean);
  if (DURAKLAR.length < 3) return;
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var a = document.createElement('aside'); a.className = 'yol'; a.setAttribute('aria-hidden', 'true');
  a.innerHTML = '<div class="yol-cizgi"><i class="yol-dolu"></i></div>' + DURAKLAR.map(function () { return '<b class="durak"></b>'; }).join('') + '<span class="ucak">✈&#xFE0E;</span><em class="yol-etiket"></em>';
  document.body.appendChild(a);
  var dolu = a.querySelector('.yol-dolu'), ucak = a.querySelector('.ucak'), et = a.querySelector('.yol-etiket'), dur = [].slice.call(a.querySelectorAll('.durak')), yz = [];
  function bar() { return reduce || innerWidth < 900; }
  function olc() {
    a.classList.toggle('bar', bar());
    var toplam = Math.max(1, document.documentElement.scrollHeight - innerHeight);
    yz = DURAKLAR.map(function (d) { return Math.min(1, Math.max(0, (d.e.getBoundingClientRect().top + scrollY) / toplam)); });
    dur.forEach(function (x, i) { x.style[bar() ? 'left' : 'top'] = (yz[i] * 100) + '%'; x.style[bar() ? 'top' : 'left'] = ''; });
    guncelle();
  }
  function guncelle() {
    var toplam = Math.max(1, document.documentElement.scrollHeight - innerHeight), p = Math.min(1, Math.max(0, scrollY / toplam)), k = 0;
    yz.forEach(function (y, i) { if (y <= p + 0.015) k = i; });
    dur.forEach(function (x, i) { x.classList.toggle('gecti', yz[i] <= p + 0.015); x.classList.toggle('simdi', i === k); });
    if (bar()) { dolu.style.width = (p * 100) + '%'; dolu.style.height = ''; ucak.style.left = (p * 100) + '%'; ucak.style.top = ''; }
    else { dolu.style.height = (p * 100) + '%'; dolu.style.width = ''; ucak.style.top = (p * 100) + '%'; ucak.style.left = ''; }
    et.textContent = DURAKLAR[k].ad; et.style[bar() ? 'left' : 'top'] = (p * 100) + '%';
  }
  var bekle = false;
  addEventListener('scroll', function () { if (!bekle) { bekle = true; requestAnimationFrame(function () { bekle = false; guncelle(); }); } }, { passive: true });
  addEventListener('resize', olc); addEventListener('load', olc); olc(); setTimeout(olc, 1500);
})();
