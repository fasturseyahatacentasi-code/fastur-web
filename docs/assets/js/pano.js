/* ============================================================
   FAS TUR — menü: ince HUD şeridi + tam ekran "kalkış panosu" (split-flap / solari)
   - Üstte: logo · İstanbul yerel saati · kayan "sıradaki kalkış" · Rotalar · Talep bırak
   - "Rotalar" -> havalimanı kalkış panosu: kategoriler + kurumsal sayfalar satır satır, harfler çevrilerek yazılır.
   - Erişilebilirlik: gerçek <nav> + <ul> + <a>; Esc kapatır; Tab panoda döner; harf kutuları ekran okuyucudan gizli (aria-label).
   - prefers-reduced-motion: harf çevirme yok, metin hemen yazılır.
   Veri: assets/js/ozet.js (kategoriler, turlar). Menü öğeleri burada, kategori listesi veri.js'ten gelir.
   ============================================================ */
(function () {
  'use strict';
  var FT = window.FT || {}, S = FT.site || {}, K = document.body.getAttribute('data-kok') || './';
  var ust = document.getElementById('ust'); if (!ust) return;
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function BUYUK(s) { return String(s).toLocaleUpperCase('tr'); }
  var BUGUN = new Date().toISOString().slice(0, 10), AY = ['OCAK', 'ŞUBAT', 'MART', 'NİSAN', 'MAYIS', 'HAZİRAN', 'TEMMUZ', 'AĞUSTOS', 'EYLÜL', 'EKİM', 'KASIM', 'ARALIK'];

  /* ---- kayan şerit metni ---- */
  var sonraki = (FT.turlar || []).filter(function (t) { return t.aktif && (t.bitis || '9999') >= BUGUN; }).sort(function (a, b) { return a.baslangic < b.baslangic ? -1 : 1; })[0];
  var kayanParca = '<b data-i18n="hud.siradaki">SIRADAKİ KALKIŞ</b> · ' + (sonraki ? esc(Number(sonraki.baslangic.slice(8)) + ' ' + AY[Number(sonraki.baslangic.slice(5, 7)) - 1] + ' · ' + BUYUK(sonraki.ad)) : '<b data-i18n="hud.yakinda">YAKINDA</b>');
  var kayanHtml = '<span>' + kayanParca + '</span><span>' + kayanParca + '</span>';

  ust.outerHTML =
    '<header class="hud"><div class="wrap hud-bar">' +
    '<a class="marka" href="' + K + '" aria-label="Fas Tur ana sayfa"><img src="' + K + 'assets/img/genel/fastur-logo.png" alt="Fas Tur" width="70" height="34"></a>' +
    '<div class="hud-saat" role="timer" aria-label="İstanbul yerel saati"><i class="canli"></i><span>İSTANBUL</span><time id="hud-saat">--:--</time></div>' +
    '<button class="hud-mod" type="button" aria-pressed="false" aria-label="Gündüz / gece modu" title="Gündüz / gece (çift tıklama: otomatik)"><span aria-hidden="true"></span></button>' +
    '<div class="hud-kayan" aria-live="off"><div class="kayan-ic">' + kayanHtml + '</div></div>' +
    '<button class="hud-rota" type="button" aria-expanded="false" aria-controls="pano"><span class="kare" aria-hidden="true"></span>Rotalar</button>' +
    '<select class="hud-dil" data-dil-sec aria-label="Language / Dil"><option value="tr">TR</option><option value="en">EN</option></select>' +
    '<a class="btn btn-ana btn-kucuk hud-talep" href="' + K + 'talep/" data-i18n="hud.talep">Talep bırak</a>' +
    '</div></header>';

  /* gündüz / gece modu: İstanbul saatine göre otomatik (06–18 gündüz); elle değiştirme localStorage'da saklanır */
  var modBtn = document.querySelector('.hud-mod'), kok = document.documentElement;
  function otoMod() { try { var h = +new Intl.DateTimeFormat('en-GB', { hour: 'numeric', hour12: false, timeZone: 'Europe/Istanbul' }).format(new Date()); return (h >= 6 && h < 18) ? 'gunduz' : 'gece'; } catch (e) { return 'gece'; } }
  function modUygula(m) { kok.setAttribute('data-mod', m); var g = m === 'gunduz'; modBtn.setAttribute('aria-pressed', g); modBtn.firstChild.textContent = g ? '☾' : '☀'; modBtn.setAttribute('aria-label', g ? 'Gece moduna geç' : 'Gündüz moduna geç'); }
  modUygula(kok.getAttribute('data-mod') || otoMod());
  modBtn.addEventListener('click', function () { var m = kok.getAttribute('data-mod') === 'gunduz' ? 'gece' : 'gunduz'; modUygula(m); try { localStorage.setItem('ft_mod', m); } catch (e) { } });
  modBtn.addEventListener('dblclick', function () { try { localStorage.removeItem('ft_mod'); } catch (e) { } modUygula(otoMod()); });

  var saat = document.getElementById('hud-saat');
  function saatYaz() { try { saat.textContent = new Intl.DateTimeFormat('tr-TR', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Europe/Istanbul' }).format(new Date()); } catch (e) { } }
  saatYaz(); setInterval(saatYaz, 20000);

  /* ---- pano satırları ---- */
  var kats = FT.kategoriler || [];
  var KAPI = 'ABCD', satirlar = [], g = 0;
  kats.forEach(function (k, i) { satirlar.push({ ad: k.ad, kapi: KAPI[Math.floor(i / 4) % 4] + (i % 4 + 1), durum: k.sayi ? k.sayi + ' TUR' : 'YAKINDA', href: K + 'turlar/' + k.slug + '/' }); });
  var kurumsal = [['Tüm turlar', 'turlar/', 'LİSTE', 'pano.tum', 'pano.liste'], ['Bana uygun turu bul', 'tur-bul/', 'ARAÇ', 'nav.turbul', ''], ['Umre hazırlık rehberi', 'umre-rehberi/', 'REHBER', 'nav.umre', 'pano.rehber'], ['Hakkımızda', 'hakkimizda/', 'KURUMSAL', 'nav.hakkimizda', 'pano.kurumsal'], ['Seyahat ipuçları', 'seyahat-ipuclari/', 'REHBER', '', 'pano.rehber'], ['Haberler', 'haberler/', 'YAZILAR', 'nav.haberler', 'pano.yazilar'], ['İletişim', 'iletisim/', 'ULAŞIN', 'nav.iletisim', 'pano.ulasin'], ['Bilgi / rezervasyon talebi', 'talep/', 'FORM', 'nav.talep', 'pano.form'],
    ['Kişisel verilerin korunması', 'kisisel-verilerin-korunmasi/', 'KVKK', '', 'pano.kvkk'], ['Gizlilik sözleşmesi', 'gizlilik-sozlesmesi/', 'METİN', '', 'pano.metin'], ['Kullanıcı sözleşmesi', 'kullanici-sozlesmesi/', 'METİN', '', 'pano.metin'], ['Tur ve otel satış sözleşmesi', 'tur-ve-otel-satis-sozlesmesi/', 'METİN', '', 'pano.metin']];
  var HARF = 'ABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVYZ0123456789 ';

  function satirHtml(r, i) {
    var ad = BUYUK(r.ad), tum = r.ad + ', kapı ' + r.kapi + ', ' + r.durum;
    function kutu(t, cls, k) { return '<span class="fk ' + cls + '" aria-hidden="true" data-t="' + esc(t) + '"' + (k ? ' data-k="' + esc(k) + '"' : '') + '></span>'; }
    return '<li class="pano-li"><a class="satir" href="' + esc(r.href) + '" aria-label="' + esc(tum) + '">' + kutu(ad, 'ad', r.kAd) + kutu(r.kapi, 'kapi') + kutu(r.durum, 'durum', r.kDurum) + '<span class="ok" aria-hidden="true">→</span></a></li>';
  }
  var govde = '<li class="grup" role="presentation">ROTALAR · DESTINATIONS</li>' + satirlar.map(satirHtml).join('') +
    '<li class="grup" role="presentation">SİTE · KURUMSAL</li>' + kurumsal.map(function (k, i) { return satirHtml({ ad: k[0], kapi: 'Z' + (i + 1), durum: k[2], href: K + k[1], kAd: k[3], kDurum: k[4] }); }).join('');

  var pano = document.createElement('div');
  pano.id = 'pano'; pano.className = 'pano'; pano.hidden = true; pano.setAttribute('role', 'dialog'); pano.setAttribute('aria-modal', 'true'); pano.setAttribute('aria-label', 'Rota panosu');
  pano.innerHTML = '<div class="pano-ic"><div class="pano-ust"><div><span class="pano-etiket">FAS TUR · İSTANBUL</span><h2>Kalkış panosu</h2></div><button class="pano-kapat" type="button" aria-label="Panoyu kapat">KAPAT <kbd>ESC</kbd></button></div>' +
    '<div class="pano-arac"><button class="hud-mod pano-mod" type="button" aria-label="Gündüz / gece modu"><span aria-hidden="true"></span></button><select class="hud-dil pano-dil" aria-label="Language / Dil"><option value="tr">TR</option><option value="en">EN</option></select></div>' +
    '<div class="pano-baslik" aria-hidden="true"><span>ROTA</span><span>KAPI</span><span>DURUM</span><span></span></div>' +
    '<nav aria-label="Ana menü"><ul class="pano-liste">' + govde + '</ul></nav>' +
    '<p class="pano-alt">Bir satıra dokunun; o rotanın turları açılsın. Telefon: <a href="tel:' + esc(S.telefon) + '">' + esc(S.telefonGoster) + '</a></p></div>';
  document.body.appendChild(pano);

  /* ---- dil seçici (HUD + mobil pano kopyası) ---- */
  var dilHud = document.querySelector('.hud-dil'), dilPano = pano.querySelector('.pano-dil'), modPano = pano.querySelector('.pano-mod');
  function dilDegis(v) { if (window.FT_DIL) window.FT_DIL.sec(v); dilHud.value = v; dilPano.value = v; if (!pano.hidden) setTimeout(hepsiniYaz, 150); }
  dilHud.addEventListener('change', function () { dilDegis(dilHud.value); }); dilPano.addEventListener('change', function () { dilDegis(dilPano.value); });
  function dilEsitle() { var d = window.FT_DIL ? window.FT_DIL.dil() : 'tr'; dilHud.value = d; dilPano.value = d; }
  modPano.firstChild.textContent = modBtn.firstChild.textContent; modPano.addEventListener('click', function () { modBtn.click(); modPano.firstChild.textContent = modBtn.firstChild.textContent; });
  window.addEventListener('load', dilEsitle);

  /* ---- harf çevirme ---- */
  var zamanlar = [];
  function temizle() { zamanlar.forEach(clearTimeout); zamanlar = []; }
  function yaz(el, delay) {
    var t = el.getAttribute('data-t'), k = el.getAttribute('data-k'); if (k && window.FT_DIL) t = BUYUK(window.FT_DIL.t(k, t)); el.textContent = '';
    var harfler = [];
    for (var i = 0; i < t.length; i++) {
      var c = t[i], s = document.createElement('span'); s.className = c === ' ' ? 'fl bos' : 'fl'; if (c !== ' ') s.textContent = reduce ? c : ' ';
      el.appendChild(s); harfler.push([s, c]);
    }
    if (reduce) return;
    harfler.forEach(function (h, i) {
      if (h[1] === ' ') return;
      var tick = 5 + Math.floor(Math.random() * 7), d = delay + i * 38, n = 0;
      (function adim() {
        zamanlar.push(setTimeout(function () {
          n++; var son = n > tick; h[0].textContent = son ? h[1] : HARF[Math.floor(Math.random() * (HARF.length - 1))];
          h[0].classList.remove('cevir'); void h[0].offsetWidth; h[0].classList.add('cevir');
          if (!son) adim();
        }, n === 0 ? d : 55));
      })();
    });
  }
  function hepsiniYaz() {
    temizle();
    var satir = pano.querySelectorAll('.pano-li');
    satir.forEach(function (li, r) { li.querySelectorAll('.fk').forEach(function (el, c) { yaz(el, 120 + r * 70 + c * 40); }); });
  }

  /* ---- aç / kapat ---- */
  var btn = document.querySelector('.hud-rota'), kapat = pano.querySelector('.pano-kapat');
  function ac() {
    dilEsitle();
    pano.hidden = false; document.body.classList.add('pano-acik'); btn.setAttribute('aria-expanded', 'true'); hepsiniYaz();
    setTimeout(function () { kapat.focus(); }, 30);
  }
  function kapa() { pano.hidden = true; document.body.classList.remove('pano-acik'); btn.setAttribute('aria-expanded', 'false'); temizle(); btn.focus(); }
  btn.addEventListener('click', function () { pano.hidden ? ac() : kapa(); });
  kapat.addEventListener('click', kapa);
  pano.addEventListener('click', function (e) { if (e.target === pano) kapa(); });
  document.addEventListener('keydown', function (e) {
    if (pano.hidden) return;
    if (e.key === 'Escape') { kapa(); return; }
    if (e.key === 'Tab') {
      var f = [].slice.call(pano.querySelectorAll('a[href],button')).filter(function (x) { return x.offsetParent !== null; });
      if (!f.length) return; var ilk = f[0], son = f[f.length - 1];
      if (e.shiftKey && document.activeElement === ilk) { e.preventDefault(); son.focus(); }
      else if (!e.shiftKey && document.activeElement === son) { e.preventDefault(); ilk.focus(); }
    }
  });
  if (/[?&]pano=1/.test(location.search)) setTimeout(ac, 100);
  // başka sayfaya gidince açık kalmasın
  pano.addEventListener('click', function (e) { if (e.target.closest && e.target.closest('a')) { document.body.classList.remove('pano-acik'); } });
})();
