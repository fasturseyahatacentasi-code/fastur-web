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
  var _b = new Date(), BUGUN = _b.getFullYear() + '-' + String(_b.getMonth() + 1).padStart(2, '0') + '-' + String(_b.getDate()).padStart(2, '0'), AY = ['OCAK', 'ŞUBAT', 'MART', 'NİSAN', 'MAYIS', 'HAZİRAN', 'TEMMUZ', 'AĞUSTOS', 'EYLÜL', 'EKİM', 'KASIM', 'ARALIK'];

  /* ---- kayan şerit metni ---- */
  var sonraki = (FT.turlar || []).filter(function (t) { return t.aktif && (t.baslangic ? t.baslangic >= BUGUN : (t.bitis || '9999') >= BUGUN); }).sort(function (a, b) { var x = a.baslangic || '9999', y = b.baslangic || '9999'; return x < y ? -1 : 1; })[0];   /* tarihli tur önce; tarihsiz (tekrar) sonra */
  var kayanParca = '<b data-i18n="hud.siradaki">SIRADAKİ KALKIŞ</b> · ' + (sonraki ? esc((sonraki.baslangic ? Number(sonraki.baslangic.slice(8)) + ' ' + AY[Number(sonraki.baslangic.slice(5, 7)) - 1] : BUYUK(sonraki.tekrar || '')) + ' · ' + BUYUK(sonraki.ad)) : '<b data-i18n="hud.yakinda">YAKINDA</b>');
  var kayanHtml = '<span>' + kayanParca + '</span><span>' + kayanParca + '</span>';

  /* GİZLİ (19.11.2026): yanlışlıkla yayına çıktı; hazır olunca veri.js > yzFilm içine "yayinda": true eklenince menü görünür. */
  /* YZ Film & Animasyon menüsü (Hilal Hanım 19.11.2026, referans uphbacademy.com.tr): üstüne gelince/tıklayınca küçük görselli liste */
  var YZ = FT.yzFilm || {}, YZK = YZ.karakterler || [], YZ_AD = YZ.menu || 'YZ Film & Animasyon';
  /* yayinda:false iken menü yalnız Hilal Hanım'ın bilgisayarında (localhost) görünür; canlı sitede gizli (21.11.2026) */
  if (YZ.yayinda === false && !/^(localhost|127\.0\.0\.1)$/.test(location.hostname)) YZK = [];
  var YZ_LISTE = YZK.map(function (k) {
    return '<a class="yz-mi" href="' + K + 'yz-film/' + esc(k.id) + '/"><img src="' + K + esc(k.gorsel) + '-kucuk.webp" alt="" width="48" height="60"><span><b>' + esc(k.ad) + '</b><small>' + esc(k.alt || '') + '</small></span></a>';
  }).join('');
  var YZ_HTML = YZK.length ? '<div class="hud-yz"><a class="hud-yz-btn" href="' + K + 'yz-film/" aria-haspopup="true">' + esc(YZ_AD) + ' <span aria-hidden="true">▾</span></a><div class="hud-yz-liste">' + YZ_LISTE + '<a class="yz-hepsi" href="' + K + 'yz-film/">Hepsini gör →</a></div></div>' : '';

  ust.outerHTML =
    '<header class="hud"><div class="wrap hud-bar">' +
    '<a class="marka" href="' + K + '" aria-label="Fas Tur ana sayfa"><img src="' + K + 'assets/img/genel/logo/fastur-logo-hud.svg" alt="Fas Tur" width="169" height="60"></a>' +
    '<div class="hud-saat" role="timer" aria-label="İstanbul yerel saati"><i class="canli"></i><span>İSTANBUL</span><time id="hud-saat">--:--</time></div>' +
    '<button class="hud-mod" type="button" aria-pressed="false" aria-label="Gündüz / gece modu" title="Gündüz / gece (çift tıklama: otomatik)"><span aria-hidden="true"></span></button>' +
    '<div class="hud-kayan" aria-live="off"><div class="kayan-ic">' + kayanHtml + '</div></div>' +
    '<button class="hud-rota" type="button" aria-expanded="false" aria-controls="pano"><span class="kare" aria-hidden="true"></span>Rotalar</button>' +
    YZ_HTML +
    '<select class="hud-dil" data-dil-sec aria-label="Language / Dil"><option value="tr">TR</option><option value="en">EN</option></select>' +
    '<a class="btn btn-ana btn-kucuk hud-talep" href="' + K + 'talep/" data-i18n="hud.talep">Talep Bırakın</a>' +
    '</div></header>';

  /* gündüz / gece modu: İstanbul saatine göre otomatik (06–18 gündüz); elle değiştirme localStorage'da saklanır */
  var modBtn = document.querySelector('.hud-mod'), kok = document.documentElement;
  /* Gündüz modu anahtarı: false yapılırsa site hep gece olur ve düğme gizlenir (ayrıca uret_turlar.py <head> betiği 'gece'ye sabitlenmeli). 12.11.2026: Hilal Hanım AÇIK istedi. */
  var GUNDUZ_ACIK = false;   /* 15.11.2026 Hilal Hanım: gece/gündüz kaldırıldı, tek zemin */
  if (!GUNDUZ_ACIK) { kok.setAttribute('data-mod', 'gece'); if (modBtn) modBtn.parentNode.removeChild(modBtn); try { localStorage.removeItem('ft_mod'); } catch (e) { } }
  else {
  function otoMod() { try { var h = +new Intl.DateTimeFormat('en-GB', { hour: 'numeric', hour12: false, timeZone: 'Europe/Istanbul' }).format(new Date()); return (h >= 6 && h < 18) ? 'gunduz' : 'gece'; } catch (e) { return 'gece'; } }
  function modUygula(m) { kok.setAttribute('data-mod', m); var g = m === 'gunduz'; modBtn.setAttribute('aria-pressed', g); modBtn.firstChild.textContent = g ? '☾' : '☀'; modBtn.setAttribute('aria-label', g ? 'Gece moduna geç' : 'Gündüz moduna geç'); }
  modUygula(kok.getAttribute('data-mod') || otoMod());
  modBtn.addEventListener('click', function () { var m = kok.getAttribute('data-mod') === 'gunduz' ? 'gece' : 'gunduz'; modUygula(m); try { localStorage.setItem('ft_mod', m); } catch (e) { } });
  modBtn.addEventListener('dblclick', function () { try { localStorage.removeItem('ft_mod'); } catch (e) { } modUygula(otoMod()); });
  }

  var saat = document.getElementById('hud-saat');
  /* ---- ülke sayfasında üstte o ülkenin saati + hava durumu (Hilal Hanım 19.11.2026: "Fas'ı tıklayınca Fas hava durumu") ----
     Kategori: adres turlar/<kat>/ ya da sayfadaki kırıntı bağlantısı. Koordinatlar sehirler.js'ten (uydurma yok).
     Hava: Open-Meteo (ücretsiz, anahtarsız, çerezsiz); 30 dk tarayıcıda saklanır. Alınamazsa yalnız saat görünür. */
  var ULKE = {
    'fas': ['FAS', 'Marakeş', 31.63, -7.98, 'Africa/Casablanca'],
    'misir': ['MISIR', 'Kahire', 30.04, 31.24, 'Africa/Cairo'],
    'urdun': ['ÜRDÜN', 'Amman', 31.95, 35.93, 'Asia/Amman'],
    'dubai': ['DUBAİ', 'Dubai', 25.20, 55.27, 'Asia/Dubai'],
    'bosna-hersek': ['BOSNA', 'Saraybosna', 43.86, 18.41, 'Europe/Sarajevo'],
    'ozbekistan': ['ÖZBEKİSTAN', 'Taşkent', 41.30, 69.24, 'Asia/Tashkent'],
    'hindistan': ['HİNDİSTAN', 'Delhi', 28.61, 77.21, 'Asia/Kolkata'],
    'japonya': ['JAPONYA', 'Tokyo', 35.68, 139.69, 'Asia/Tokyo'],
    'guney-kore': ['G. KORE', 'Seul', 37.57, 126.98, 'Asia/Seoul'],
    'vietnam': ['VİETNAM', 'Hanoi', 21.03, 105.85, 'Asia/Ho_Chi_Minh'],
    'kambocya': ['KAMBOÇYA', 'Siem Reap', 13.36, 103.86, 'Asia/Phnom_Penh'],
    'laos': ['LAOS', 'Luang Prabang', 19.89, 102.13, 'Asia/Vientiane'],
    'tayland': ['TAYLAND', 'Bangkok', 13.76, 100.50, 'Asia/Bangkok'],
    'malezya': ['MALEZYA', 'Kuala Lumpur', 3.14, 101.69, 'Asia/Kuala_Lumpur'],
    'bali': ['BALİ', 'Bali', -8.65, 115.22, 'Asia/Makassar'],
    'rusya': ['RUSYA', 'Moskova', 55.76, 37.62, 'Europe/Moscow'],
    'ispanya': ['İSPANYA', 'Sevilla', 37.39, -5.98, 'Europe/Madrid']
  };
  var ulkeK = null;
  (function () {
    var yol = location.pathname; try { yol = decodeURIComponent(yol); } catch (e) { }
    var m = yol.toLowerCase().match(/\/turlar\/([a-z-]+)(\/(index\.html)?)?$/);
    if (m && ULKE[m[1]]) { ulkeK = m[1]; return; }
    [].slice.call(document.querySelectorAll('.kirinti a[href]')).some(function (a) {
      var k = (a.getAttribute('href').match(/turlar\/([a-z-]+)\/?$/) || [])[1];
      if (k && ULKE[k]) { ulkeK = k; return true; }
    });
  })();
  var SAAT_TZ = ulkeK ? ULKE[ulkeK][4] : 'Europe/Istanbul';
  function saatYaz() { try { saat.textContent = new Intl.DateTimeFormat('tr-TR', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: SAAT_TZ }).format(new Date()); } catch (e) { } }
  saatYaz(); setInterval(saatYaz, 20000);
  if (ulkeK && saat) {
    var U = ULKE[ulkeK], kutu = saat.parentNode, etiket = kutu.querySelector('span');
    if (etiket) etiket.textContent = U[0];
    kutu.setAttribute('aria-label', U[1] + ' yerel saati ve hava durumu'); kutu.title = U[1] + ' · yerel saat ve hava durumu';
    var hv = document.createElement('b'); hv.className = 'hud-hava'; hv.style.cssText = 'font-size:14px;font-weight:600;color:#fff;letter-spacing:.02em;white-space:nowrap'; kutu.appendChild(hv);
    var HAVA = function (c) {
      return c === 0 ? ['☀', 'Açık'] : c <= 2 ? ['🌤', 'Az bulutlu'] : c === 3 ? ['☁', 'Bulutlu'] : c === 45 || c === 48 ? ['🌫', 'Sisli']
        : c >= 51 && c <= 57 ? ['🌦', 'Çisenti'] : (c >= 61 && c <= 67) || (c >= 80 && c <= 82) ? ['🌧', 'Yağmurlu'] : (c >= 71 && c <= 77) || c === 85 || c === 86 ? ['🌨', 'Karlı'] : c >= 95 ? ['⛈', 'Fırtına'] : ['', ''];
    };
    var havaYaz = function (v) {
      var h = HAVA(Number(v.k)); hv.textContent = (h[0] ? h[0] + ' ' : '') + Math.round(v.s) + '°';
      kutu.title = U[1] + ' · yerel saat · ' + (h[1] ? h[1] + ', ' : '') + Math.round(v.s) + '°C';
    };
    var AN = 'ft_hava_' + ulkeK, kayit = null;
    try { kayit = JSON.parse(sessionStorage.getItem(AN) || 'null'); } catch (e) { }
    if (kayit && Date.now() - kayit.t < 30 * 60 * 1000) havaYaz(kayit);
    else if (window.fetch) {
      fetch('https://api.open-meteo.com/v1/forecast?latitude=' + U[2] + '&longitude=' + U[3] + '&current=temperature_2m,weather_code&timezone=auto')
        .then(function (r) { if (!r.ok) throw 0; return r.json(); })
        .then(function (j) {
          var c = j && j.current; if (!c || typeof c.temperature_2m !== 'number') return;
          var v = { t: Date.now(), s: c.temperature_2m, k: c.weather_code };
          havaYaz(v); try { sessionStorage.setItem(AN, JSON.stringify(v)); } catch (e) { }
        })
        .catch(function () { });
    }
  }

  /* ---- Rotalar menüsü (13.11.2026, Hilal Hanım: Burak Tur menüsü referans) ----
     Açık renkli, okunaklı mega menü: üstte hızlı bağlantılar, ortada gruplar (büyük başlık) altında ülkeler ve tur sayısı,
     altta kurumsal bağlantılar. Kategori ve grup listesi veri.js'ten (ozet.js) gelir; gizli kategoriler (Umre) zaten yoktur. */
  var kats = FT.kategoriler || [];
  var kurumsal = [['Tur Takvimi', 'tur-takvimi/', 'TAKVİM', '', ''], ['Tüm Turlar', 'turlar/', 'LİSTE', 'pano.tum', 'pano.liste'], ['Bana Uygun Turu Bul', 'tur-bul/', 'ARAÇ', 'nav.turbul', ''], ['Umre Hazırlık Rehberi', 'umre-rehberi/', 'REHBER', 'nav.umre', 'pano.rehber'], ['Hakkımızda', 'hakkimizda/', 'KURUMSAL', 'nav.hakkimizda', 'pano.kurumsal'], ['Seyahat İpuçları', 'seyahat-ipuclari/', 'REHBER', '', 'pano.rehber'], ['Haberler', 'haberler/', 'YAZILAR', 'nav.haberler', 'pano.yazilar'], ['İletişim', 'iletisim/', 'ULAŞIN', 'nav.iletisim', 'pano.ulasin'], ['Bilgi / Rezervasyon Talebi', 'talep/', 'FORM', 'nav.talep', 'pano.form'],
    ['Kişisel Verilerin Korunması', 'kisisel-verilerin-korunmasi/', 'KVKK', '', 'pano.kvkk'], ['Gizlilik Sözleşmesi', 'gizlilik-sozlesmesi/', 'METİN', '', 'pano.metin'], ['Kullanıcı Sözleşmesi', 'kullanici-sozlesmesi/', 'METİN', '', 'pano.metin'], ['Tur ve Otel Satış Sözleşmesi', 'tur-ve-otel-satis-sozlesmesi/', 'METİN', '', 'pano.metin']];
  if (S.umreGoster === false) kurumsal = kurumsal.filter(function (k) { return k[1] !== 'umre-rehberi/'; });   /* Umre şimdilik gizli */
  var HARF = 'ABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVYZ0123456789 ';
  function tt(k, d) { return k && window.FT_DIL ? window.FT_DIL.t(k, d) : d; }

  var gruplar = [], gi = {};
  kats.filter(function (k) { return k.sayi > 0; }).forEach(function (k) { var g = k.grup || 'Diğer';   /* yalnız turu olan ülkeler (Hilal Hanım 13.11.2026) */ if (!(g in gi)) { gi[g] = gruplar.length; gruplar.push({ ad: g, k: [] }); } gruplar[gi[g]].k.push(k); });
  var gruplarHtml = gruplar.map(function (g) {
    return '<section class="mm-grup"><h3>' + esc(g.ad) + '</h3><ul>' +
      g.k.map(function (k) { return '<li><a href="' + K + 'turlar/' + esc(k.slug) + '/"' + (k.sayi ? '' : ' class="mm-bos"') + '><span>' + esc(k.ad) + '</span></a></li>'; }).join('') + '</ul></section>';
  }).join('');
  var hizli = [['Tur Takvimi', 'tur-takvimi/', '', 'mm-h-takvim'], ['Tüm Turlar', 'turlar/', 'pano.tum', ''], ['Bana Uygun Turu Bul', 'tur-bul/', 'nav.turbul', ''], ['Talep Bırakın', 'talep/', 'hud.talep', 'mm-h-talep']];
  var hizliHtml = hizli.map(function (h) { return '<a class="mm-hizli-a ' + h[3] + '" href="' + K + h[1] + '">' + esc(tt(h[2], h[0])) + '</a>'; }).join('');
  var kurumsalHtml = kurumsal.filter(function (k) { return ['tur-takvimi/', 'turlar/', 'tur-bul/', 'talep/'].indexOf(k[1]) < 0; })
    .map(function (k) { return '<a href="' + K + k[1] + '">' + esc(tt(k[3], k[0])) + '</a>'; }).join('');

  var pano = document.createElement('div');
  pano.id = 'pano'; pano.className = 'pano pano-yeni'; pano.hidden = true; pano.setAttribute('role', 'dialog'); pano.setAttribute('aria-modal', 'true'); pano.setAttribute('aria-label', 'Rotalar menüsü');
  pano.innerHTML = '<div class="mm">' +
    '<div class="mm-ust"><div class="mm-baslik"><span class="mm-etiket">FAS TUR · ROTALAR</span><h2>Nereye gitmek istersiniz?</h2></div>' +
    '<div class="pano-arac"><button class="hud-mod pano-mod" type="button" aria-label="Gündüz / gece modu"><span aria-hidden="true"></span></button><select class="hud-dil pano-dil" aria-label="Language / Dil"><option value="tr">TR</option><option value="en">EN</option></select></div>' +
    '<button class="pano-kapat" type="button" aria-label="Menüyü kapat">Kapat <span aria-hidden="true">✕</span></button></div>' +
    '<div class="mm-hizli">' + hizliHtml + '</div>' +
    (YZK.length ? '<div class="mm-yz"><span class="mm-etiket">' + esc(YZ_AD) + '</span>' + YZ_LISTE + '</div>' : '') +
    /* 13.11.2026 Hilal Hanım: menüde yalnız bu tek sıra. Ülke grupları (gruplarHtml) ve kurumsal satır (kurumsalHtml) hazır duruyor; geri istenirse buraya eklenir. Kurumsal bağlantılar sitenin alt bilgisinde var. */
    '</div>';
  document.body.appendChild(pano);

  /* ---- dil seçici (HUD + mobil pano kopyası) ---- */
  var dilHud = document.querySelector('.hud-dil'), dilPano = pano.querySelector('.pano-dil'), modPano = pano.querySelector('.pano-mod');
  function dilDegis(v) { if (window.FT_DIL) window.FT_DIL.sec(v); dilHud.value = v; dilPano.value = v; if (!pano.hidden) setTimeout(hepsiniYaz, 150); }
  dilHud.addEventListener('change', function () { dilDegis(dilHud.value); }); dilPano.addEventListener('change', function () { dilDegis(dilPano.value); });
  function dilEsitle() { var d = window.FT_DIL ? window.FT_DIL.dil() : 'tr'; dilHud.value = d; dilPano.value = d; }
  if (!GUNDUZ_ACIK) { if (modPano) modPano.parentNode.removeChild(modPano); }
  else { modPano.firstChild.textContent = modBtn.firstChild.textContent; modPano.addEventListener('click', function () { modBtn.click(); modPano.firstChild.textContent = modBtn.firstChild.textContent; }); }
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
