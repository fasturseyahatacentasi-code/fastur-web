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
  var BUGUN = new Date().toISOString().slice(0, 10);
  var KAT = {};
  (FT.kategoriler || []).forEach(function (k) { KAT[k.slug] = k; });
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function tarihTr(i) { if (!i) return ''; var p = i.split('-'); return p[2] + '.' + p[1] + '.' + p[0]; }
  function wa(metin) { return 'https://wa.me/' + (S.whatsapp || '') + (metin ? '?text=' + encodeURIComponent(metin) : ''); }
  function aktif(t) { return !!t.aktif && (t.bitis || '9999') >= BUGUN; }

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
    var tursab = (S.tursab && S.tursab !== '[?]') ? '<div>TÜRSAB belge no: ' + esc(S.tursab) + '</div>' : '';
    alt.outerHTML =
      '<footer class="alt-bilgi"><div class="wrap"><div class="izgara">' +
      '<div><span class="logo-b"><img src="' + K + 'assets/img/genel/fastur-logo.png" alt="Fas Tur" width="92" height="44"></span>' +
      '<p>' + esc(S.unvanTam) + '</p><p>' + esc(S.adres) + '</p></div>' +
      '<div><h4>Yardıma mı ihtiyacınız var?</h4><a href="tel:' + esc(S.telefon) + '">' + esc(S.telefonGoster) + '</a>' + (S.whatsapp2 ? '<a href="https://wa.me/' + esc(S.whatsapp2) + '?text=Merhaba%2C%20bilgi%20almak%20istiyorum." target="_blank" rel="noopener">WhatsApp: ' + esc(S.telefon2Goster) + '</a>' : '') +
      '<a href="' + wa('') + '" target="_blank" rel="noopener">WhatsApp</a><a href="mailto:' + esc(S.eposta) + '">' + esc(S.eposta) + '</a>' +
      '<div style="padding:3px 0">' + esc(S.calisma) + '</div></div>' +
      '<div><h4>Kurumsal</h4><a href="' + K + 'hakkimizda/">Hakkımızda</a><a href="' + K + 'iletisim/">İletişim</a><a href="' + K + 'haberler/">Haberler</a><a href="' + K + 'seyahat-ipuclari/">Seyahat ipuçları</a><a href="' + K + 'talep/">Bilgi / rezervasyon talebi</a></div>' +
      '<div><h4>Sözleşmeler ve KVKK</h4><a href="' + K + 'kisisel-verilerin-korunmasi/">Kişisel verilerin korunması</a><a href="' + K + 'gizlilik-sozlesmesi/">Gizlilik sözleşmesi</a><a href="' + K + 'kullanici-sozlesmesi/">Kullanıcı sözleşmesi</a><a href="' + K + 'tur-ve-otel-satis-sozlesmesi/">Tur ve otel satış sözleşmesi</a></div>' +
      '</div><div class="alt-son"><span>© ' + new Date().getFullYear() + ' Fas Tur · ' + esc(S.unvan) + '</span>' + tursab + '</div></div></footer>' +
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

  /* ---------- tur filtresi ---------- */
  var kap = document.querySelector('[data-liste]');
  if (kap) {
    var kartlar = Array.prototype.slice.call(kap.querySelectorAll('.kart'));
    var f = kap.querySelector('[data-filtre]'), sayiEl = kap.querySelector('[data-sayi]'), bosEl = kap.querySelector('[data-bos]'), dahaBtn = kap.querySelector('[data-daha]');
    var kabHost = kap.querySelector('[data-kartlar]');
    var SAYFA = 12, gosterilen = SAYFA;
    var qs = new URLSearchParams(location.search);
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
    f.addEventListener('input', function () { uygula(true); });
    f.addEventListener('change', function () { uygula(true); });
    f.addEventListener('reset', function () { setTimeout(function () { uygula(true); }, 0); });
    dahaBtn.addEventListener('click', function () { gosterilen += SAYFA; uygula(false); });
    uygula(true);
  }

  /* ---------- talep formu ---------- */
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
      fetch('https://formsubmit.co/ajax/' + encodeURIComponent(S.formEposta || S.eposta), { method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }, body: JSON.stringify(govde) })
        .then(function (r) { return r.json(); })
        .then(function (j) {
          if (j && (j.success === true || j.success === 'true')) { goster('ok', 'Talebiniz alındı. En kısa sürede size dönüş yapacağız. Teşekkür ederiz.'); tf.reset(); }
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
