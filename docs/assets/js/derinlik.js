/* ============================================================
   FAS TUR — DERİNLİK (zoom-through parallax, scrollytelling)
   Ana sayfadaki her hikâye durağı (section[data-durak]) 3 derinlik katmanı alır:
     arka : veri.js > katmanlar.bolumler.<id>.arka varsa o (video/poster), yoksa data-arka görseli
     orta : katmanlar ... .orta varsa o, yoksa hafif ışık/parçacık katmanı (CSS, dosyasız)
     ön   : kemer çerçevesi (SVG) — kaydırınca kameraya doğru büyüyüp geçer; sahnenin "içine" girilir.
            Rehber karakter (ön katman videosu ya da .rehber-konus fotoğrafı) içerikle birlikte hafifçe süzülür.
   Kaydırma ilerlemesi t (0 = durak ekranın altına giriyor, 1 = durak ekranın üstünden çıktı) ile
   katmanlar FARKLI hızlarda ölçeklenir: arka yavaş, orta orta, ön hızlı.
   Hero (yola-cikis): çıkarken arka büyür, rehber öne gelip kaybolur, yazı yukarı süzülür.
   Telefon (<760px) ya da Veri Tasarrufu: orta katman yok, hareket aralığı küçük, arka görselin küçük sürümü.
   "Hareketi azalt" açıksa: dinleyici yok, katmanlar durağan (kemer gizli).
   Yalnız transform/opacity değişir; görünmeyen duraklar hesaplanmaz.
   Test: ?derinlik=0 kapatır.
   ============================================================ */
(function () {
  'use strict';
  if (/[?&]derinlik=0/.test(location.search)) return;
  /* Tüm site katmanlı (Hilal Hanım 13.11.2026): işaretsiz ana bölümler de durak olur */
  [].slice.call(document.querySelectorAll('main > section.bolum:not([data-durak])')).forEach(function (s) { s.setAttribute('data-durak', ''); });
  [].slice.call(document.querySelectorAll('main > section.sayfa-ust:not([data-durak])')).forEach(function (s) { s.setAttribute('data-durak', ''); s.setAttribute('data-giris', ''); });
  var duraklar = [].slice.call(document.querySelectorAll('[data-durak]'));
  if (!duraklar.length) return;
  var K = document.body.getAttribute('data-kok') || './';
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var con = navigator.connection || {}, tasarruf = !!con.saveData || /(^|-)2g$/.test(con.effectiveType || '');
  var hafif = innerWidth < 760 || tasarruf;
  var root = document.documentElement;
  root.classList.add('derinlik');
  if (reduce) root.classList.add('derinlik-durgun');
  if (hafif) root.classList.add('derinlik-hafif');

  var KEMER = '<svg viewBox="0 0 160 100" preserveAspectRatio="xMidYMid slice" aria-hidden="true">' +
    '<path class="duvar" fill-rule="evenodd" d="M0 0H160V100H0Z M54 100V50C54 31 66 19 80 11C94 19 106 31 106 50V100Z"/>' +
    '<path class="kenar" fill="none" d="M54 100V50C54 31 66 19 80 11C94 19 106 31 106 50V100"/></svg>';

  function el(cls, ic) { var d = document.createElement('div'); d.className = cls; if (ic) d.innerHTML = ic; return d; }
  function clamp(x, a, b) { return x < a ? a : x > b ? b : x; }

  var sahneler = duraklar.map(function (sec) {
    var hero = sec.classList.contains('kahraman') || sec.hasAttribute('data-giris');
    var s = { sec: sec, hero: hero };
    if (sec.classList.contains('kahraman')) {
      s.arka = [sec.querySelector('.slaytlar'), sec.querySelector(':scope > .katmanlar')].filter(Boolean);
      s.on = sec.querySelector('.rehber-hero');
      s.yazi = sec.querySelector('.wrap > div:first-child');
      return s;
    }
    if (hero) {                                                     /* diğer sayfaların giriş sahnesi: kategori başlığı, tur kapağı */
      var kapak = sec.querySelector(':scope > img');
      if (kapak) s.arka = [kapak];
      else {
        var dg = el('derinlik-sahne giris'); dg.setAttribute('aria-hidden', 'true');
        var ga = el('dp dp-arka'), go = el('dp dp-orta dp-isik');
        var gg = (hafif && sec.getAttribute('data-arka-mobil')) || sec.getAttribute('data-arka');
        if (gg) { var gi2 = el('dp-gorsel'); gi2.style.backgroundImage = 'url("' + K + gg + '")'; ga.appendChild(gi2); } else ga.classList.add('bos');
        dg.appendChild(ga); if (!hafif) dg.appendChild(go);
        sec.insertBefore(dg, sec.firstChild);
        s.arka = [ga]; s.orta = hafif ? null : go;
      }
      s.yazi = sec.querySelector('.wrap');
      return s;
    }
    var d = el('derinlik-sahne'); d.setAttribute('aria-hidden', 'true');
    var a = el('dp dp-arka'), o = el('dp dp-orta'), n = el('dp dp-on', KEMER);
    /* katman.js'in kurduğu video/poster katmanlarını derinlik katmanlarına taşı */
    var kt = sec.querySelector(':scope > .katmanlar');
    var ktA = kt && kt.querySelector('.kt-arka'), ktO = kt && kt.querySelector('.kt-orta');
    if (ktA) a.appendChild(ktA);
    else {
      var g = (hafif && sec.getAttribute('data-arka-mobil')) || sec.getAttribute('data-arka');
      if (g) { var gi = el('dp-gorsel'); gi.style.backgroundImage = 'url("' + K + g + '")'; a.appendChild(gi); }
      else a.classList.add('bos');
    }
    if (ktO) o.appendChild(ktO); else o.classList.add('dp-isik');
    if (kt && !kt.children.length) kt.parentNode.removeChild(kt);
    d.appendChild(a); if (!hafif || ktO) d.appendChild(o); d.appendChild(n);
    sec.insertBefore(d, sec.firstChild);
    s.arka = [a]; s.orta = d.contains(o) ? o : null; s.kemer = n;
    s.rehber = [].slice.call(sec.querySelectorAll('.rehber-konus .foto, :scope > .kt-on-bolum'));
    return s;
  });

  if (reduce) return;                                               /* durağan: katmanlar yerinde, dinleyici yok */

  var R = hafif ? { a: .05, o: 0, n: 1.4, r: 10 } : { a: .14, o: .55, n: 2.6, r: 26 };
  function tf(x, y, sc) { return 'translate3d(' + x + 'px,' + y.toFixed(1) + 'px,0) scale(' + sc.toFixed(4) + ')'; }

  function guncelle() {
    bekliyor = false;
    var vh = innerHeight;
    for (var i = 0; i < sahneler.length; i++) {
      var s = sahneler[i], r = s.sec.getBoundingClientRect();
      if (r.bottom < -40 || r.top > vh + 40) continue;               /* ekranda değil: dokunma */
      if (s.hero) {
        var x = clamp(-r.top / Math.max(r.height, 1), 0, 1);         /* 0 = en üstte, 1 = hero tamamen geçti */
        s.arka.forEach(function (e) { e.style.transform = tf(0, x * 60, 1 + x * R.a * 2); });
        if (s.orta) { s.orta.style.transform = tf(0, x * 30, 1 + x * R.o); s.orta.style.opacity = (1 - x).toFixed(3); }
        if (s.on) { s.on.style.transform = tf(0, -x * R.r * 4, 1 + x * (hafif ? .15 : .45)); s.on.style.opacity = (1 - x * 1.6).toFixed(3); }
        if (s.yazi) { s.yazi.style.transform = tf(0, -x * R.r * 3, 1); s.yazi.style.opacity = (1 - x * 1.3).toFixed(3); }
        continue;
      }
      var t = clamp((vh - r.top) / (vh + r.height), 0, 1);           /* 0 giriş · .5 ortada · 1 çıkış */
      s.arka[0].style.transform = tf(0, (t - .5) * -R.r * 2, 1.04 + t * R.a);
      if (s.orta) { s.orta.style.transform = tf(0, (t - .5) * -R.r * 4, .9 + t * R.o); s.orta.style.opacity = Math.sin(t * Math.PI).toFixed(3); }
      var k = clamp((t - .08) / .34, 0, 1);                          /* kemer: girişte kapıdan geçiş */
      s.kemer.style.transform = tf(0, 0, 1 + k * k * R.n);
      s.kemer.style.opacity = (1 - k).toFixed(3);
      s.kemer.style.visibility = k >= 1 ? 'hidden' : '';
      for (var j = 0; j < s.rehber.length; j++) s.rehber[j].style.transform = tf(0, (t - .5) * -R.r * 1.6, 1);
    }
  }
  var bekliyor = false;
  function iste() { if (!bekliyor) { bekliyor = true; requestAnimationFrame(guncelle); } }
  addEventListener('scroll', iste, { passive: true });
  addEventListener('resize', iste);
  guncelle();
  window.FT_DERINLIK = { duraklar: sahneler.length, hafif: hafif, guncelle: guncelle };
})();
