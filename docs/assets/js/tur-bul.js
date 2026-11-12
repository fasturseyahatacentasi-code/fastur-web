/* "Bana uygun turu bul" sihirbazı. Veri: ozet.js (window.FT). Sunucu yok, hiçbir cevap saklanmaz (localStorage/çerez yok).
   Tüm yollar GÖRELİDİR (body[data-kok]). Kiminle sorusu YALNIZ mesaj tonunu etkiler; puana girmez. */
(function () {
  'use strict';
  var FT = window.FT || {}, K = document.body.getAttribute('data-kok') || './';
  var kap = document.getElementById('tur-bul'); if (!kap) return;
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; }); }
  function tr(k, v) { var d = window.FT_DIL; return (d && d.t) ? d.t(k, v) : v; }   // dil.js varsa çeviri, yoksa Türkçe metin
  var BUGUN = new Date().toISOString().slice(0, 10);
  var KAT = {}; (FT.kategoriler || []).forEach(function (k) { KAT[k.slug] = k.ad; });

  /* "$1.942,50" -> {tutar:1942.5, para:'USD'} ; biçim bilinmiyorsa null */
  function fiyatCoz(f) {
    if (!f) return null;
    var para = f.charAt(0) === '$' ? 'USD' : f.charAt(0) === '€' ? 'EUR' : f.charAt(0) === '₺' ? 'TL' : null;
    if (!para) return null;
    var n = parseFloat(f.slice(1).replace(/\./g, '').replace(',', '.'));
    return isFinite(n) ? { tutar: n, para: para } : null;
  }
  var ARALIK = { USD: [[0, 1000], [1000, 2000], [2000, 3500], [3500, 1e9]], EUR: [[0, 1000], [1000, 2000], [2000, 3500], [3500, 1e9]], TL: [[0, 15000], [15000, 40000], [40000, 80000], [80000, 1e9]] };
  var SEM = { USD: '$', EUR: '€', TL: '₺' };
  function aralikYazi(p, i) { var a = ARALIK[p][i], s = SEM[p]; return a[0] === 0 ? s + a[1].toLocaleString('tr-TR') + ' altı' : a[1] >= 1e9 ? s + a[0].toLocaleString('tr-TR') + ' üstü' : s + a[0].toLocaleString('tr-TR') + ' – ' + s + a[1].toLocaleString('tr-TR'); }

  var GUN = [['kisa', '4–7 gün', 4, 7], ['orta', '8–11 gün', 8, 11], ['uzun', '12 gün ve üzeri', 12, 99], ['fark', 'Fark etmez', 0, 99]];
  var KIM_MESAJ = { aile: 'Aile ile gidiyorsanız çocuk fiyatları ve oda düzenini turun sayfasında ayrıca görün.', cift: 'Çift olarak gidiyorsanız 2 kişilik oda fiyatını sorabilirsiniz.', tek: 'Tek başına gidiyorsanız tek kişilik oda farkını mutlaka sorun.', grup: 'Grup için ekibimizden toplu fiyat ve oda düzeni sorabilirsiniz.' };
  var cv = { adim: 0, gun: null, para: 'USD', butce: null, vize: null, kim: null };
  var ADIM = 4;

  function ilerleme() { var h = '<div class="tb-ilerleme" aria-hidden="true">'; for (var i = 0; i < ADIM; i++) h += '<i' + (i <= cv.adim ? ' class="on"' : '') + '></i>'; return h + '</div>'; }
  function secenek(liste, anahtar, secili) {
    return '<div class="tb-sec">' + liste.map(function (o) { return '<button type="button" data-v="' + esc(o[0]) + '" aria-pressed="' + (secili === o[0]) + '">' + esc(o[1]) + '</button>'; }).join('') + '</div>';
  }
  function ciz() {
    var h = ilerleme();
    if (cv.adim === 0) h += '<h2 class="tb-soru" data-i18n="sihirbaz.s1">Kaç gün gitmek istersiniz?</h2>' + secenek(GUN.map(function (g) { return [g[0], g[1]]; }), 'gun', cv.gun);
    else if (cv.adim === 1) {
      h += '<h2 class="tb-soru" data-i18n="sihirbaz.s2">Bütçe aralığınız nedir?</h2><p class="tb-mesaj">Kişi başı, başlangıç fiyatı üzerinden.</p><div class="tb-para" role="group" aria-label="Para birimi">' +
        ['USD', 'EUR', 'TL'].map(function (p) { return '<button type="button" data-p="' + p + '" aria-pressed="' + (cv.para === p) + '">' + p + '</button>'; }).join('') + '</div>' +
        secenek(ARALIK[cv.para].map(function (a, i) { return [String(i), aralikYazi(cv.para, i)]; }).concat([['x', 'Fark etmez']]), 'butce', cv.butce);
    } else if (cv.adim === 2) h += '<h2 class="tb-soru" data-i18n="sihirbaz.s3">Vize durumu?</h2>' + secenek([['Vizeli', 'Vizeli olabilir'], ['Vizesiz', 'Vizesiz olsun'], ['x', 'Fark etmez']], 'vize', cv.vize);
    else if (cv.adim === 3) h += '<h2 class="tb-soru" data-i18n="sihirbaz.s4">Kiminle gideceksiniz?</h2>' + secenek([['aile', 'Aile'], ['cift', 'Çift'], ['tek', 'Tek başıma'], ['grup', 'Arkadaş grubu']], 'kim', cv.kim);
    h += '<div class="tb-gezin">' + (cv.adim > 0 ? '<button type="button" class="btn btn-hat" data-geri>← Geri</button>' : '<span></span>') + '<button type="button" class="btn btn-hat" data-atla>Bu soruyu geç</button></div>';
    kap.innerHTML = h; if (window.FT_DIL && FT_DIL.uygula) FT_DIL.uygula(kap);
  }

  function puanla() {
    var gunAr = GUN.filter(function (g) { return g[0] === cv.gun; })[0] || GUN[3];
    return (FT.turlar || []).map(function (t) {
      var p = 0, ok = true, f = fiyatCoz(t.fiyat), guncel = t.aktif && (t.bitis || '') >= BUGUN;
      if (cv.gun && cv.gun !== 'fark') { if (t.gun >= gunAr[2] && t.gun <= gunAr[3]) p += 3; else if (Math.abs(t.gun - (t.gun < gunAr[2] ? gunAr[2] : gunAr[3])) <= 2) p += 1; else ok = false; }
      if (cv.butce !== null && cv.butce !== 'x') {
        if (f && f.para === cv.para) { var a = ARALIK[cv.para][+cv.butce]; if (f.tutar >= a[0] && f.tutar < a[1]) p += 3; else ok = false; } else ok = false;   // farklı para birimi karşılaştırılmaz (kur uydurma yok)
      }
      if (cv.vize && cv.vize !== 'x') { if (t.vize === cv.vize) p += 2; else ok = false; }
      if (guncel) p += 4;
      return { t: t, p: p, ok: ok, guncel: guncel };
    }).filter(function (r) { return r.ok; }).sort(function (a, b) { return b.p - a.p || ((b.t.baslangic || '') < (a.t.baslangic || '') ? -1 : 1); });
  }
  function kart(r) {
    var t = r.t, tarih = (t.baslangic || '').split('-').reverse().join('.');
    return '<article class="tb-tur">' + (t.gorsel ? '<img src="' + K + esc(t.gorsel) + '" alt="" loading="lazy">' : '<div></div>') +
      '<div><h3>' + esc(t.ad) + '</h3><small>' + esc(KAT[t.kategori] || '') + ' · ' + esc(t.gun) + ' gün · ' + esc(t.vize || '') + (t.fiyat ? ' · başlangıç ' + esc(t.fiyat) : '') + '</small>' +
      (r.guncel ? '<span class="tb-etiket">Güncel</span>' : '<span class="tb-etiket eski">Önceki dönem programı · ' + esc(tarih) + '</span>') +
      '<div class="tb-act"><a class="btn btn-hat btn-kucuk" href="' + K + 'tur/' + esc(t.slug) + '/">Programı gör</a>' +
      '<a class="btn btn-ana btn-kucuk" href="' + K + 'talep/?tur=' + encodeURIComponent(t.slug) + '">' + (r.guncel ? 'Talep bırak' : 'Yeni dönem için talep bırak') + '</a></div></div></article>';
  }
  function sonuc() {
    var s = puanla(), guncel = s.filter(function (r) { return r.guncel; }), liste = (guncel.length ? guncel : s).slice(0, 5), h = ilerleme().replace(/<i>/g, '<i class="on">').replace(/<i><\/i>/g, '<i class="on"></i>');
    h += '<h2 class="tb-soru">' + (liste.length ? 'Size uygun olabilecek turlar' : 'Birebir uyan tur bulunamadı') + '</h2>';
    if (cv.kim) h += '<p class="tb-mesaj">' + esc(KIM_MESAJ[cv.kim]) + '</p>';
    if (liste.length && !guncel.length) h += '<p class="tb-mesaj">Şu anda satışta güncel tur görünmüyor. Aşağıdakiler <b>önceki dönem programlarıdır</b>; tarih ve fiyat yeni dönemde değişir. Beğendiğinizi seçip "yeni dönem için talep bırak" diyebilirsiniz.</p>';
    if (!liste.length) h += '<p class="tb-mesaj">Seçimlerinizi biraz esnetin ya da talep bırakın; ekibimiz size uygun programı iletsin.</p>';
    h += '<div class="tb-sonuc">' + liste.map(kart).join('') + '</div><div class="tb-gezin"><button type="button" class="btn btn-hat" data-bas>Baştan başla</button><a class="btn btn-ana" href="' + K + 'talep/">Genel talep bırak</a></div>';
    kap.innerHTML = h; kap.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  function ileri() { cv.adim++; if (cv.adim >= ADIM) sonuc(); else ciz(); }
  kap.addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    if (b.hasAttribute('data-geri')) { cv.adim = Math.max(0, cv.adim - 1); return ciz(); }
    if (b.hasAttribute('data-atla')) return ileri();
    if (b.hasAttribute('data-bas')) { cv = { adim: 0, gun: null, para: 'USD', butce: null, vize: null, kim: null }; return ciz(); }
    if (b.hasAttribute('data-p')) { cv.para = b.getAttribute('data-p'); cv.butce = null; return ciz(); }
    if (b.hasAttribute('data-v')) { cv[['gun', 'butce', 'vize', 'kim'][cv.adim]] = b.getAttribute('data-v'); ileri(); }
  });
  ciz();
})();
