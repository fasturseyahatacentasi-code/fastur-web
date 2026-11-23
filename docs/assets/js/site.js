/* ============================================================
   FAS TUR — ortak site betiği
   Menü, alt bilgi, tur filtresi, yaklaşan turlar, talep formu.
   Veri: assets/js/ozet.js (veri.js'ten tasarim/uret_turlar.py ile üretilir). Bu dosyada tarih/fiyat/telefon YOKTUR.
   Tüm yollar GÖRELİDİR (body[data-kok]); GitHub test adresi alt klasörde çalışır.
   ============================================================ */
(function () {
  'use strict';
  var FT = window.FT || {};
  var S = FT.site || {};
  var B = document.body;
  var K = B.getAttribute('data-kok') || './';
  var _b = new Date(), BUGUN = _b.getFullYear() + '-' + String(_b.getMonth() + 1).padStart(2, '0') + '-' + String(_b.getDate()).padStart(2, '0');   /* yerel tarih (Türkiye) */
  var KAT = {};
  (FT.kategoriler || []).forEach(function (k) { KAT[k.slug] = k; });
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function tarihTr(i) { if (!i) return ''; var p = i.split('-'); return p[2] + '.' + p[1] + '.' + p[0]; }
  function wa(metin) { return 'https://wa.me/' + (S.whatsapp || '') + (metin ? '?text=' + encodeURIComponent(metin) : ''); }
  /* Hilal Hanım 14.11.2026: tarihli tur KALKIŞ GÜNÜ geçince listelerden çıkar (kalkış günü dahil görünür); haftalık (tekrar) turlar bitişe bakar */
  function aktif(t) { return !!t.aktif && (t.baslangic ? t.baslangic >= BUGUN : (t.bitis || '9999') >= BUGUN); }

  var WA_SVG = '<svg viewBox="0 0 32 32" fill="currentColor" aria-hidden="true"><path d="M19.11 17.38c-.27-.14-1.6-.79-1.85-.88-.25-.09-.43-.14-.61.14-.18.27-.7.88-.86 1.06-.16.18-.32.2-.59.07-.27-.14-1.14-.42-2.17-1.34-.8-.71-1.34-1.58-1.5-1.85-.16-.27-.02-.42.12-.56.12-.12.27-.32.41-.48.14-.16.18-.27.27-.45.09-.18.05-.34-.02-.48-.07-.14-.61-1.46-.84-2-.22-.52-.44-.45-.61-.45-.16 0-.34-.02-.52-.02s-.48.07-.73.34c-.25.27-.96.94-.96 2.29 0 1.35.98 2.65 1.12 2.83.14.18 1.93 2.94 4.68 4.12.65.28 1.16.45 1.56.58.65.21 1.24.18 1.7.11.52-.08 1.6-.65 1.83-1.27.23-.62.23-1.15.16-1.27-.07-.12-.25-.18-.52-.32z"/><path d="M26.7 5.3C23.9 2.5 20.1 1 16 1 8.3 1 2 7.3 2 15c0 2.4.6 4.7 1.8 6.8L2 31l9.4-1.7c2 .9 4.2 1.4 6.6 1.4 7.7 0 14-6.3 14-14 0-4.1-1.6-7.9-4.3-10.7zM16 28c-2.2 0-4.3-.6-6.1-1.6l-.4-.2-5.5 1 1-5.4-.2-.4C3.6 19.6 3 17.4 3 15 3 8.4 8.4 3 15 3c3.2 0 6.2 1.3 8.5 3.5S27 10.8 27 14c0 6.6-5.4 12-11 12z"/></svg>';

  /* ---------- rehber karakter / hikâye (veri.js > rehber, hikaye) ---------- */
  var RH = FT.rehber || {};
  function rehberAd() { return (RH.ad && RH.ad !== '[?]') ? RH.ad : 'Yol arkadaşınız'; }
  var HK = {}; (FT.hikaye || []).forEach(function (h) { HK[h.id] = h; });
  function hk(id, yedek) { return HK[id] && HK[id].cumle ? HK[id].cumle : yedek; }

  /* üst menü: pano.js (HUD + kalkış panosu) */

  /* ---------- alt bilgi ---------- */
  var alt = document.getElementById('alt');
  if (alt) {
    /* 21.11.2026 Hilal Hanım: TÜRSAB rozeti görsel olarak (DDS örneğindeki düzen). Bağlantı YOK: tursab.org.tr/tr/ddsv
       fasturtravel.com'dan gelince "kayıt dışı" gösteriyor (DDS'de kayıtlı alan adı eski site). Hilal Hanım gerçek DDS rozet kodunu
       TÜRSAB'dan alınca bu rozet onunla değiştirilecek. */
    /* 23.11.2026 Hilal Hanım: TÜRSAB rozeti DDS rozetinin düzeninde (gri kutu, TÜRSAB logosu, kırmızı şerit yazı, sağda belge no + büyüteç).
       'Dijital Doğrulama Sistemi' ibaresi KULLANILMAZ: o ad TÜRSAB'ın onaylı hizmetidir; gerçek DDS kodu gelince bu rozet onunla değişir.
       Tıklayınca TÜRSAB ana sayfası ("Seyahat Acentası Sorgula" kutusu) açılır. */
    var tursab = (S.tursab && S.tursab !== '[?]') ? '<a class="tursab-dds" href="https://www.tursab.org.tr/" target="_blank" rel="noopener" title="TÜRSAB sitesinde acenta sorgulama" aria-label="A Grubu TÜRSAB belgeli seyahat acentası, belge no ' + esc(S.tursab) + '. TÜRSAB sitesinde sorgulamak için tıklayın" style="display:inline-block;margin-left:clamp(0px,6vw,56px);line-height:0;text-decoration:none;border-radius:10px;box-shadow:0 4px 14px rgba(0,0,0,.35)">' +
      '<svg width="300" height="178" viewBox="0 0 300 178" aria-hidden="true" style="display:block;max-width:100%;height:auto"><defs><linearGradient id="tdg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#dfe2e6"/></linearGradient></defs>' +
      '<rect x="1" y="1" width="298" height="176" rx="10" fill="url(#tdg)" stroke="#b9bec6" stroke-width="1.5"/>' +
      '<text x="138" y="44" text-anchor="middle" font-family="Arial Black,Arial,Helvetica,sans-serif" font-weight="900" font-size="30" fill="#e30a17" textLength="118" lengthAdjust="spacingAndGlyphs">TÜRSAB</text>' +
      '<text x="138" y="54" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-weight="700" font-size="6.2" fill="#222" textLength="118" lengthAdjust="spacingAndGlyphs">TÜRKİYE SEYAHAT ACENTALARI BİRLİĞİ</text>' +
      '<circle cx="262" cy="34" r="13" fill="none" stroke="#8a929c" stroke-width="3"/><path d="M271 44l12 12" stroke="#8a929c" stroke-width="5" stroke-linecap="round"/>' +
      '<text x="150" y="84" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-size="17" letter-spacing="2.2" fill="#e30a17" textLength="270" lengthAdjust="spacing">A GRUBU SEYAHAT ACENTASI</text>' +
      '<path d="M14 94h272" stroke="#c9cdd3"/>' +
      '<g font-family="Arial,Helvetica,sans-serif" font-size="12" fill="#333"><text x="22" y="120"><tspan font-weight="700">TIKLAYIN</tspan> ve acentamızın</text><text x="22" y="137"><tspan font-weight="700" fill="#e30a17">TÜRSAB</tspan>\'a kayıtlı resmi bir acenta</text><text x="22" y="154">olduğunu sorgulayın...</text></g>' +
      '<text x="250" y="122" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-weight="700" font-size="13" fill="#333">Belge No</text>' +
      '<text x="250" y="150" text-anchor="middle" font-family="Arial Black,Arial,Helvetica,sans-serif" font-weight="900" font-size="24" fill="#e30a17">' + esc(S.tursab) + '</text></svg></a>' : '';
    alt.outerHTML =
      '<footer class="alt-bilgi"><div class="wrap"><div class="izgara">' +
      '<div><span class="logo-b"><img src="' + K + 'assets/img/genel/logo/fastur-logo-koyu.svg" alt="Fas Tur Seyahat Acentesi" width="190" height="55"></span>' +
      '<p>' + esc(S.adres) + '</p></div>' +   /* 19.11.2026 Hilal Hanım: şirket unvanı alt bilgide görünmesin */
      /* 14.11.2026 Hilal Hanım: her satır etiketli ve tek numaralı (telefon ile WhatsApp karışmasın) */
      '<div><h4>Yardıma mı ihtiyacınız var?</h4>' +
      '<a class="ab-satir" href="tel:' + esc(S.telefon) + '"><b>Telefon</b><span>' + esc(S.telefonGoster) + '</span></a>' +
      '<a class="ab-satir" href="' + wa('') + '" target="_blank" rel="noopener"><b>WhatsApp</b><span>' + esc(S.telefonGoster) + '</span></a>' +
      (S.whatsapp2 ? '<a class="ab-satir" href="https://wa.me/' + esc(S.whatsapp2) + '?text=Merhaba%2C%20bilgi%20almak%20istiyorum." target="_blank" rel="noopener"><b>WhatsApp</b><span>' + esc(S.telefon2Goster) + '</span></a>' : '') +
      '<a class="ab-satir" href="mailto:' + esc(S.eposta) + '"><b>E-posta</b><span>' + esc(S.eposta) + '</span></a>' +
      (S.instagram ? '<a class="ab-satir" href="https://www.instagram.com/' + esc(S.instagram) + '/" target="_blank" rel="noopener"><b>Instagram</b><span>@' + esc(S.instagram) + '</span></a>' : '') +
      (S.youtube ? '<a class="ab-satir" href="' + esc(S.youtube) + '" target="_blank" rel="noopener"><b>YouTube</b><span>@' + esc(S.youtube.split('@')[1] || 'Fasturtravel') + '</span></a>' : '') +
      '<div style="padding:3px 0">' + esc(S.calisma) + '</div></div>' +
      '<div><h4>Kurumsal</h4><a href="' + K + 'hakkimizda/">Hakkımızda</a><a href="' + K + 'iletisim/">İletişim</a><a href="' + K + 'haberler/">Haberler</a><a href="' + K + 'seyahat-ipuclari/">Seyahat ipuçları</a><a href="' + K + 'talep/">Bilgi / Rezervasyon Talebi</a></div>' +
      '<div><h4>Sözleşmeler ve KVKK</h4><a href="' + K + 'kisisel-verilerin-korunmasi/">Kişisel verilerin korunması</a><a href="' + K + 'gizlilik-sozlesmesi/">Gizlilik sözleşmesi</a><a href="' + K + 'kullanici-sozlesmesi/">Kullanıcı sözleşmesi</a><a href="' + K + 'tur-ve-otel-satis-sozlesmesi/">Tur ve otel satış sözleşmesi</a></div>' +
      '</div><div class="alt-son">' + tursab + '<span>© ' + new Date().getFullYear() + ' Fas Tur</span></div></div></footer>' +   /* 21.11.2026 Hilal Hanım: TÜRSAB logosu solda */
      '<a class="asistan" href="' + wa('Merhaba, bilgi almak istiyorum.') + '" target="_blank" rel="noopener" aria-label="WhatsApp ile yazın"><span class="nokta foto"><img src="' + K + 'assets/img/karakter/karakter-ifade-1.png" alt="" width="46" height="46"></span><span><b>' + rehberAd() + '</b><small>' + hk('asistan', 'Sorunuz mu var? Yazın.') + '</small></span></a>';
  }
  document.querySelectorAll('[data-rehber-ad]').forEach(function (e) { e.textContent = rehberAd() + ((RH.unvan && RH.unvan !== '[?]') ? ' · ' + RH.unvan : ''); });
  document.querySelectorAll('[data-hikaye]').forEach(function (e) { var h = HK[e.getAttribute('data-hikaye')]; if (h && h.cumle) e.textContent = h.cumle; });
  document.querySelectorAll('[data-bolum]').forEach(function (e) { var h = HK[e.getAttribute('data-bolum')]; if (h && h.bolum) e.textContent = h.bolum; });
  document.querySelectorAll('a[data-wa]').forEach(function (a) { a.href = wa('Merhaba, bilgi almak istiyorum.'); });
  document.querySelectorAll('a[href^="https://wa.me/"]').forEach(function (a) { if (a.href.indexOf('?text=') < 0) a.href += '?text=' + encodeURIComponent('Merhaba, bilgi almak istiyorum.'); });   /* hazır mesajsız WhatsApp bağlantısı kalmasın */
  if (S.tursab && S.tursab !== '[?]') {
    document.querySelectorAll('[data-tursab-no]').forEach(function (e) { e.textContent = S.tursab; });
  } else {
    document.querySelectorAll('[data-tursab]').forEach(function (e) { e.classList.add('gizli'); });
  }

  /* ---------- anılar duvarı (izin:"var" olmayan kart GÖSTERİLMEZ) ---------- */
  var ad = document.querySelector('[data-anilar]');
  if (ad) {
    var onayli = (FT.anilar || []).filter(function (a) { return a.izin === 'var' && a.metin; });
    if (onayli.length) {
      ad.innerHTML = onayli.map(function (a) {
        return '<figure class="ani-kart">' + (a.gorsel ? '<img src="' + K + esc(a.gorsel) + '" alt="" loading="lazy">' : '') + '<blockquote>' + esc(a.metin) + '</blockquote><figcaption>' + esc(a.ad) + (a.tur ? ' · ' + esc(a.tur) : '') + '</figcaption></figure>';
      }).join('');
      ad.classList.remove('gizli');
      var ac = document.querySelector('[data-ani-cagri]'); if (ac) ac.classList.add('compact');
    }
  }

  /* ---------- tur kartı (yaklaşan turlar için) ---------- */
  function kart(t) {
    var a = aktif(t), kat = KAT[t.kategori] ? KAT[t.kategori].ad : '';
    var tarih = t.baslangic ? tarihTr(t.baslangic) + (t.bitis ? ' – ' + tarihTr(t.bitis) : '') : (t.tekrar || '');
    var fiyat = (a && t.fiyat) ? '<div class="fiyat"><small>kişi başı</small>' + esc(t.fiyat) + '\'dan</div>' : '<div class="fiyat"><small>Güncel tarih ve fiyat</small>için arayın</div>';
    return '<article class="kart"><div class="gorsel"><img src="' + K + esc(t.gorsel) + '" alt="' + esc(t.ad) + '" loading="lazy" width="440" height="275"><span class="serit-etiket">' + esc(kat) + '</span><span class="arsiv canli">Güncel</span></div>' +
      '<div class="ic"><h3><a href="' + K + 'tur/' + esc(t.slug) + '/">' + esc(t.ad) + '</a></h3><div class="meta">' + (tarih ? '<span>' + tarih + '</span>' : '') + (t.gun ? '<span>' + t.gun + ' gün</span>' : '') + (t.vize ? '<span>' + esc(t.vize) + '</span>' : '') + '</div>' +
      (t.guzergah ? '<div class="rota">' + esc(t.guzergah) + '</div>' : '') + '<div class="alt">' + fiyat + '<span class="git">İncele →</span></div></div></article>';
  }
  var yk = document.querySelector('[data-yaklasan]');
  if (yk) {
    var liste = (FT.turlar || []).filter(aktif).sort(function (a, b) { return (a.baslangic || '') < (b.baslangic || '') ? -1 : 1; }).slice(0, 8);
    var AY = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
    if (liste.length) yk.innerHTML = liste.map(function (t) {
      var d = (t.baslangic || '').split('-');
      var ttar = t.baslangic ? Number(d[2]) + '<small>' + AY[Number(d[1]) - 1] + ' ' + d[0] + '</small>' : '<span aria-hidden="true">↻</span><small>' + esc(t.tekrar || 'Tarih için sorun') + '</small>';   /* tekrar: düzenli kalkış */
      return '<div class="takvim-satir"><div class="takvim-tarih">' + ttar + '</div>' +
        '<a class="takvim-ad" href="' + K + 'tur/' + esc(t.slug) + '/">' + esc(t.ad) + '<small>' + (t.gun ? t.gun + ' gün · ' : '') + esc(t.guzergah || '') + '</small></a>' +
        '<a class="btn btn-ana btn-kucuk" href="' + K + 'talep/?tur=' + esc(t.slug) + '">Talep</a></div>';
    }).join('');
    else yk.removeAttribute('data-yaklasan-dolu');
    if (liste.length) { var y = document.querySelector('[data-yakinda]'); if (y) y.classList.add('gizli'); yk.classList.remove('gizli'); }
  }
  document.querySelectorAll('[data-sayi-kat]').forEach(function (e) {
    var k = KAT[e.getAttribute('data-sayi-kat')]; if (k && k.sayi) e.textContent = k.sayi + ' tur programı →';
  });

  /* ---------- kalkışı geçmiş turlar (14.11.2026) ----------
     Sayfalar üretildiği gün "Güncel" yazar; kalkış günü geçince ziyaretçinin tarayıcısında rozet kendiliğinden düzelir. */
  [].forEach.call(document.querySelectorAll('.kart[data-tarih][data-aktif="1"]'), function (c) {
    if (c.dataset.tarih && c.dataset.tarih < BUGUN) {
      c.dataset.aktif = '0';
      var r = c.querySelector('.arsiv.canli'); if (r) { r.classList.remove('canli'); r.textContent = 'Kalkış gerçekleşti'; }
      var fy = c.querySelector('.fiyat'); if (fy) fy.innerHTML = '<small>Yeni tarihler için</small>bize ulaşın';
    }
  });
  var kapakK = document.querySelector('.tur-kapak[data-kalkis]');
  if (kapakK && kapakK.getAttribute('data-kalkis') && kapakK.getAttribute('data-kalkis') < BUGUN) {
    [].forEach.call(kapakK.querySelectorAll('.rozet'), function (r) { if (r.textContent === 'Güncel') r.textContent = 'Kalkış gerçekleşti'; });
  }

  /* ---------- tur filtresi ---------- */
  var kap = document.querySelector('[data-liste]');
  if (kap) {
    var kartlar = Array.prototype.slice.call(kap.querySelectorAll('.kart'));
    var f = kap.querySelector('[data-filtre]'), sayiEl = kap.querySelector('[data-sayi]'), bosEl = kap.querySelector('[data-bos]'), dahaBtn = kap.querySelector('[data-daha]');
    var kabHost = kap.querySelector('[data-kartlar]');
    var SAYFA = 12, gosterilen = SAYFA;
    var qs = new URLSearchParams(location.search);
    /* 18.11.2026: tarayıcı sayfa yenilenince/geri gelince eski seçimi geri yüklüyordu (ülke sayfasında başka ülke seçili kalıp "tur bulunamadı"); hep sayfanın kendi varsayılanıyla başla */
    f.setAttribute('autocomplete', 'off');
    Array.prototype.forEach.call(f.elements, function (el) {
      if (el.tagName === 'SELECT') { var d = Array.prototype.filter.call(el.options, function (o) { return o.defaultSelected; })[0]; el.value = d ? d.value : (el.options[0] ? el.options[0].value : ''); }
      else if (el.type === 'checkbox') el.checked = el.defaultChecked;
      else if (el.type === 'text' || el.type === 'search') el.value = el.defaultValue;
    });
    ['q', 'k', 'v', 'g', 's'].forEach(function (n) { if (qs.get(n) && f.elements[n]) f.elements[n].value = qs.get(n); });
    if (qs.get('a') === '1') f.elements.a.checked = true;
    function uygula(sifirla) {
      if (sifirla) gosterilen = SAYFA;
      var q = f.elements.q.value.trim().toLowerCase(), k = f.elements.k.value, v = f.elements.v.value, g = f.elements.g.value, a = f.elements.a.checked, s = f.elements.s.value;
      var gm = g ? g.split('-').map(Number) : null;
      var uygun = kartlar.filter(function (c) {
        var d = c.dataset;
        if (q && d.ad.indexOf(q) < 0) return false;
        if (k && d.kat !== k) return false;
        if (v && d.vize !== v) return false;
        if (gm && (Number(d.gun) < gm[0] || Number(d.gun) > gm[1])) return false;
        if (a && d.aktif !== '1') return false;
        return true;
      });
      uygun.sort(function (x, y) {
        if (!s || s === 'yakin') {   /* 18.11.2026: tarihi yakın olan önce; geçmiş programlar sonda */
          var xa = x.dataset.aktif === '1', ya = y.dataset.aktif === '1';
          if (xa !== ya) return xa ? -1 : 1;
          if (x.dataset.tarih === y.dataset.tarih) return 0;
          return xa ? (x.dataset.tarih < y.dataset.tarih ? -1 : 1) : (x.dataset.tarih < y.dataset.tarih ? 1 : -1);
        }
        if (s === 'eski') return x.dataset.tarih < y.dataset.tarih ? -1 : 1;
        if (s === 'gun') return Number(y.dataset.gun) - Number(x.dataset.gun);
        if (s === 'ad') return x.querySelector('h3').textContent.localeCompare(y.querySelector('h3').textContent, 'tr');
        return x.dataset.tarih < y.dataset.tarih ? 1 : -1;
      });
      kartlar.forEach(function (c) { c.classList.add('gizli'); });
      uygun.forEach(function (c, i) { kabHost.appendChild(c); if (i < gosterilen) c.classList.remove('gizli'); });
      sayiEl.textContent = uygun.length + ' tur';
      bosEl.classList.toggle('gizli', uygun.length > 0);
      dahaBtn.classList.toggle('gizli', uygun.length <= gosterilen);
    }
    /* 18.11.2026 Hilal Hanım: ülke sayfasında (yalnız o ülkenin kartları var) başka kategori seçilince "tur bulunamadı" yerine o kategorinin sayfasına git */
    f.elements.k.addEventListener('change', function () {
      var k2 = f.elements.k.value;
      var varMi = !k2 || kartlar.some(function (c) { return c.dataset.kat === k2; });
      if (varMi && (k2 || kartlar.length > 0) && !(k2 === '' && /\/turlar\/[^\/]+\/?$/.test(location.pathname))) return;
      var kok = document.body.getAttribute('data-kok') || './';
      location.href = kok + 'turlar/' + (k2 ? k2 + '/' : '');
    });
    f.addEventListener('input', function () { uygula(true); });
    f.addEventListener('change', function () { uygula(true); });
    f.addEventListener('reset', function () { setTimeout(function () { uygula(true); }, 0); });
    dahaBtn.addEventListener('click', function () { gosterilen += SAYFA; uygula(false); });
    uygula(true);
  }

  /* ---------- talep formu ---------- */
  var TALEP_ADRESI = S.talepAdresi || '';   /* Google Apps Script web uygulaması adresi (…/exec) */
  var tf = document.querySelector('[data-talep]');
  if (tf) {
    var sel = tf.elements.tur, gor = {}, qs2 = new URLSearchParams(location.search), onceki = qs2.get('tur');
    (FT.turlar || []).slice().sort(function (a, b) { return (b.baslangic || '') < (a.baslangic || '') ? -1 : 1; }).forEach(function (t) {
      if (gor[t.ad]) return; gor[t.ad] = 1;
      var o = document.createElement('option'); o.value = t.ad; o.textContent = t.ad; o.setAttribute('data-slug', t.slug); sel.appendChild(o);
    });
    if (onceki) {
      var hedef = (FT.turlar || []).filter(function (t) { return t.slug === onceki; })[0];
      if (hedef) sel.value = hedef.ad;
    }
    var durum = tf.querySelector('[data-durum]');
    function goster(tip, html) { durum.className = 'durum ' + tip; durum.innerHTML = html; }
    function alanlar() {
      var e = tf.elements;
      return { tur: e.tur.value || 'Genel bilgi', ad: e.ad.value.trim(), telefon: e.telefon.value.trim(), eposta: e.eposta.value.trim(), yetiskin: e.yetiskin.value, cocuk: e.cocuk.value, tarih: e.tarih.value.trim(), not: e['not'].value.trim() };
    }
    function metin(d) {
      return 'Merhaba, bilgi / rezervasyon talebim var.\nTur: ' + d.tur + '\nAd soyad: ' + d.ad + '\nTelefon: ' + d.telefon + (d.eposta ? '\nE-posta: ' + d.eposta : '') +
        '\nKişi: ' + d.yetiskin + ' yetişkin, ' + d.cocuk + ' çocuk' + (d.tarih ? '\nTarih/dönem: ' + d.tarih : '') + (d.not ? '\nNot: ' + d.not : '');
    }
    tf.querySelector('[data-wa-gonder]').addEventListener('click', function () {
      if (!tf.reportValidity()) return;
      window.open(wa(metin(alanlar())), '_blank', 'noopener');
      goster('ok', 'WhatsApp açıldı. Mesajı göndermeniz yeterli; ekibimiz size dönüş yapacaktır.');
    });
    tf.addEventListener('submit', function (ev) {
      ev.preventDefault();
      if (!tf.reportValidity()) return;
      if (tf.elements._honey.value) return;
      var d = alanlar(), btn = tf.querySelector('[data-gonder]');
      btn.disabled = true; btn.textContent = 'Gönderiliyor…';
      var govde = { _subject: 'Fas Tur web talebi: ' + d.tur, _template: 'table', _captcha: 'false', Tur: d.tur, 'Ad soyad': d.ad, Telefon: d.telefon, 'E-posta': d.eposta, Yetişkin: d.yetiskin, Çocuk: d.cocuk, 'Tarih / dönem': d.tarih, Not: d.not, 'KVKK açık rıza': 'verildi' };
      /* Talep kutusu (Hilal Hanım 19.11.2026): adres varsa talep e-postaya değil Google Drive'daki talep tablosuna gider, panelde görünür */
      var istek = TALEP_ADRESI
        ? fetch(TALEP_ADRESI, { method: 'POST', body: JSON.stringify({ tur: d.tur, ad: d.ad, telefon: d.telefon, eposta: d.eposta, yetiskin: d.yetiskin, cocuk: d.cocuk, tarih: d.tarih, not: d['not'], kvkk: true, sayfa: location.pathname, _honey: tf.elements._honey.value }) })
        : fetch('https://formsubmit.co/ajax/' + encodeURIComponent(S.formEposta || S.eposta), { method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }, body: JSON.stringify(govde) });
      istek
        .then(function (r) { return r.json(); })
        .then(function (j) {
          if (j && (j.ok === true || j.success === true || j.success === 'true')) { goster('ok', 'Talebiniz alındı. En kısa sürede size dönüş yapacağız. Teşekkür ederiz.'); tf.reset(); }
          else throw new Error('gonderilemedi');
        })
        .catch(function () {
          goster('hata', 'Talebiniz şu an gönderilemedi. Lütfen <strong>WhatsApp ile gönder</strong> düğmesini kullanın ya da <a href="tel:' + esc(S.telefon) + '">' + esc(S.telefonGoster) + '</a> numarasını arayın' + (S.whatsapp2 ? ' (ya da WhatsApp: <a href="https://wa.me/' + esc(S.whatsapp2) + '?text=Merhaba%2C%20bilgi%20almak%20istiyorum." target="_blank" rel="noopener">' + esc(S.telefon2Goster) + '</a>)' : '') + '.');
        })
        .then(function () { btn.disabled = false; btn.textContent = window.FT_DIL ? window.FT_DIL.t('talep.gonder', 'Talebi gönder') : 'Talebi gönder'; });
    });
  }

  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- kaydırınca beliren öğeler ---------- */
  var bel = document.querySelectorAll('.bolum-baslik, .bolge, .kart, .adim, .deger, .yorum, .cagri, .yakinda, .takvim-satir, .metin, .kutu');
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('gor'); io.unobserve(e.target); } }); }, { rootMargin: '0px 0px -8% 0px' });
    bel.forEach(function (e) { e.classList.add('belir'); io.observe(e); });
    setTimeout(function () { bel.forEach(function (e) { e.classList.add('gor'); }); }, 4000);
  }
})();

/* ============================================================
   🔒 GÖRSEL KORUMA (Hilal Hanım 13.11.2026) — yalnız onun açık talimatıyla gevşetilir
   Görsel ve video üzerinde sağ tık / sürükleme / uzun basma kapalı; alt bilgide telif notu.
   (Ekran görüntüsünü hiçbir site engelleyemez; bu katman kolay kopyalamayı durdurur.)
   ============================================================ */
(function () {
  'use strict';
  var SEC = 'img, video, picture, canvas, .slayt, .kt, .dp-gorsel, .sahne-kisi, .foto, .portre, .bolge, .gorsel, .tur-kapak';
  function gorselMi(el) { return el && el.closest && el.closest(SEC); }
  document.addEventListener('contextmenu', function (e) { if (gorselMi(e.target)) e.preventDefault(); }, true);
  document.addEventListener('dragstart', function (e) { if (gorselMi(e.target)) e.preventDefault(); }, true);
  function isaretle() { document.querySelectorAll('img').forEach(function (i) { i.setAttribute('draggable', 'false'); }); }
  function telif() {
    var alt = document.getElementById('alt'); if (!alt || alt.querySelector('.telif-notu')) return;
    var p = document.createElement('p'); p.className = 'telif-notu';
    p.style.cssText = 'font-size:12px;opacity:.75;text-align:center;margin:10px auto 0;max-width:60em;padding:0 16px';
    p.textContent = 'Sitedeki tüm görseller, videolar ve "Okay" karakteri Okyay Turizmcilik Ltd. Şti.\'ye aittir; izinsiz kopyalanamaz, çoğaltılamaz, paylaşılamaz ve yapay zekâ eğitiminde kullanılamaz.';
    alt.appendChild(p);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { isaretle(); telif(); }); else { isaretle(); telif(); }
  addEventListener('load', function () { isaretle(); telif(); });
})();

/* Mevsim efekti ÖRNEĞİ (Hilal Hanım 23.11.2026): yalnız ?mevsim=kis|ilkbahar|yaz|sonbahar ile yüklenir. Onaydan sonra tarihe bağlanacak. */
(function () {
  var m = (location.search.match(/[?&]mevsim=(kis|ilkbahar|yaz|sonbahar)(?![a-z])/) || [])[1]; if (!m) return;
  var s = document.createElement('script'); s.src = (document.body.getAttribute('data-kok') || './') + 'assets/js/mevsim.js?v=beaf6e88'; s.setAttribute('data-mevsim', m); document.body.appendChild(s);
})();
