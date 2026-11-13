/* ============================================================
   FAS TUR — TUR TAKVİMİ (docs/tur-takvimi/)
   Veri: assets/js/ozet.js (veri.js'ten üretilir). Tarih/fiyat UYDURULMAZ:
     - tarihli tur: baslangic/bitis olduğu gibi
     - düzenli kalkış (tekrar: "Her hafta perşembe"): bugünden itibaren önümüzdeki 12 haftanın o günü;
       dönüş = gidiş + (gün - 1)
   Durum: tur kaydında takvimDurum "musait" | "kapali" | (boş = "sorunuz"). Firma bildirmeden "Müsait" yazılmaz.
   Aylara göre gruplu tablo + filtreler (tur adı, süre, durum). Telefonda satırlar kart olur.
   ============================================================ */
(function () {
  'use strict';
  var kok = document.querySelector('[data-takvim]'); if (!kok) return;
  var FT = window.FT || {}, K = document.body.getAttribute('data-kok') || './';
  var AY = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
  var GUN = [['cumartesi', 6], ['carsamba', 3], ['çarşamba', 3], ['persembe', 4], ['perşembe', 4], ['pazartesi', 1], ['sali', 2], ['salı', 2], ['cuma', 5], ['pazar', 0]];
  var DURUM = { musait: ['Müsait', 'tk-musait'], kapali: ['Satışa kapandı', 'tk-kapali'], sorunuz: ['Sorunuz', 'tk-sorunuz'] };
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function iso(d) { return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }
  function tarihD(s) { var p = s.split('-'); return new Date(+p[0], +p[1] - 1, +p[2]); }
  function tr(s) { var d = tarihD(s); return d.getDate() + ' ' + AY[d.getMonth()] + ' ' + d.getFullYear(); }
  function sure(g) { g = +g || 0; return g ? (g > 1 ? (g - 1) + ' Gece ' : '') + g + ' Gün' : '—'; }
  var bugun = new Date(); bugun.setHours(0, 0, 0, 0); var BUGUN = iso(bugun);

  var satirlar = [];
  (FT.turlar || []).filter(function (t) { return t.aktif; }).forEach(function (t) {
    var d = DURUM[t.takvimDurum] ? t.takvimDurum : 'sorunuz', f = t.fiyat || '';
    function ekle(g, b) { satirlar.push({ t: t, gidis: g, donus: b, durum: d, fiyat: f }); }
    if (t.baslangic) { if ((t.bitis || t.baslangic) >= BUGUN) ekle(t.baslangic, t.bitis || ''); return; }
    if (t.tekrar && /hafta/i.test(t.tekrar)) {
      var m = null, low = t.tekrar.toLocaleLowerCase('tr');
      for (var i = 0; i < GUN.length; i++) if (low.indexOf(GUN[i][0]) > -1) { m = GUN[i][1]; break; }
      if (m == null) return;
      var x = new Date(bugun); x.setDate(x.getDate() + ((m - x.getDay() + 7) % 7));
      for (var n = 0; n < 12; n++) { var y = new Date(x); y.setDate(y.getDate() + 7 * n); var z = new Date(y); z.setDate(z.getDate() + Math.max(0, (+t.gun || 1) - 1)); ekle(iso(y), iso(z)); }
    }
  });
  satirlar.sort(function (a, b) { return a.gidis < b.gidis ? -1 : a.gidis > b.gidis ? 1 : String(a.t.ad).localeCompare(String(b.t.ad), 'tr'); });

  var fTur = kok.querySelector('#tk-tur'), fSure = kok.querySelector('#tk-sure'), fDurum = kok.querySelector('#tk-durum'), govde = kok.querySelector('[data-takvim-govde]'), say = kok.querySelector('[data-takvim-say]');
  function secenek(sel, liste) { liste.forEach(function (v) { var o = document.createElement('option'); o.value = v[0]; o.textContent = v[1]; sel.appendChild(o); }); }
  var adlar = {}, sureler = {}; satirlar.forEach(function (r) { adlar[r.t.slug] = r.t.ad; sureler[r.t.gun || 0] = 1; });
  secenek(fTur, Object.keys(adlar).sort(function (a, b) { return adlar[a].localeCompare(adlar[b], 'tr'); }).map(function (k) { return [k, adlar[k]]; }));
  secenek(fSure, Object.keys(sureler).map(Number).sort(function (a, b) { return a - b; }).map(function (g) { return [String(g), sure(g)]; }));
  secenek(fDurum, Object.keys(DURUM).map(function (k) { return [k, DURUM[k][0]]; }));
  try { var q = /[?&]tur=([^&]+)/.exec(location.search); if (q) fTur.value = decodeURIComponent(q[1]); } catch (e) { }

  function ciz() {
    var l = satirlar.filter(function (r) { return (!fTur.value || r.t.slug === fTur.value) && (!fSure.value || String(r.t.gun || 0) === fSure.value) && (!fDurum.value || r.durum === fDurum.value); });
    say.textContent = l.length + ' kalkış';
    if (!l.length) {
      govde.innerHTML = '<tr><td colspan="7" class="tk-bos">' + (satirlar.length ? 'Bu filtreye uyan kalkış yok. Filtreleri temizleyin.' : 'Yeni dönem tarihleri yakında. Güncel kalkışlar için bize WhatsApp\'tan ya da telefonla ulaşın.') + '</td></tr>';
      return;
    }
    var ay = '', h = '';
    l.forEach(function (r) {
      var a = r.gidis.slice(0, 7);
      if (a !== ay) { ay = a; var d = tarihD(r.gidis); h += '<tr class="tk-ay"><th colspan="7" scope="rowgroup">' + AY[d.getMonth()] + ' ' + d.getFullYear() + '</th></tr>'; }
      var du = DURUM[r.durum];
      h += '<tr class="tk-satir"><td data-e="Gidiş">' + tr(r.gidis) + '</td><td data-e="Dönüş">' + (r.donus ? tr(r.donus) : '—') + '</td>' +
        '<td data-e="Tur" class="tk-ad"><a href="' + K + 'tur/' + esc(r.t.slug) + '/">' + esc(r.t.ad) + '</a></td><td data-e="Süre">' + sure(r.t.gun) + '</td>' +
        '<td data-e="Fiyat" class="tk-fiyat">' + (r.fiyat ? esc(r.fiyat) + '<small>\'dan</small>' : 'Sorunuz') + '</td>' +
        '<td data-e="Durum"><span class="tk-durum ' + du[1] + '">' + du[0] + '</span></td>' +
        '<td class="tk-git"><a class="btn btn-hat btn-kucuk" href="' + K + 'tur/' + esc(r.t.slug) + '/">Tur detayı</a></td></tr>';
    });
    govde.innerHTML = h;
  }
  [fTur, fSure, fDurum].forEach(function (s) { s.addEventListener('change', ciz); });
  kok.querySelector('[data-takvim-temizle]').addEventListener('click', function () { fTur.value = fSure.value = fDurum.value = ''; ciz(); });
  ciz();
})();
