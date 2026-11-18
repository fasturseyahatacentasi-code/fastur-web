/* Arayüz dili: TR (varsayılan), EN (makine çevirisi taslağı, firma onayı bekliyor), AR (iskelet, RTL).
   HTML'de varsayılan Türkçe metin durur; data-i18n="anahtar" olan öğenin metni seçili dile çevrilir.
   Öznitelik çevirisi: data-i18n-attr="placeholder:anahtar;aria-label:anahtar2".
   data-program-notu: yalnız TR dışında görünür (tur programları Türkçe kalır).
   Seçim yalnız localStorage'da (try/catch). Sözlükler assets/i18n/*.json (body[data-kok] göreli). */
(function () {
  'use strict';
  var K = document.body.getAttribute('data-kok') || './', KEY = 'fastur-dil', DILLER = ['tr', 'en', 'ar'];
  var sozluk = { tr: {}, en: {}, ar: {} }, dil = 'tr', yuklu = {};
  function oku() { try { var v = localStorage.getItem(KEY); if (DILLER.indexOf(v) > -1) return v; } catch (e) {} var n = (navigator.language || 'tr').slice(0, 2); return DILLER.indexOf(n) > -1 && n !== 'ar' ? n : 'tr'; }
  function yaz(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }
  function t(k, vars) { var s = (sozluk[dil] && sozluk[dil][k]) || sozluk.tr[k] || vars || ''; return s; }
  function yukle(d, cb) {
    if (yuklu[d]) return cb();
    fetch(K + 'assets/i18n/' + d + '.json').then(function (r) { return r.json(); }).then(function (j) { sozluk[d] = j; yuklu[d] = 1; cb(); }).catch(function () { cb(); });   // file:// ya da çevrimdışıysa Türkçe kalır
  }
  var varsayilan = new WeakMap();
  function uygula(kok) {
    kok = kok || document;
    var el = kok.querySelectorAll('[data-i18n]');
    for (var i = 0; i < el.length; i++) {
      var n = el[i], k = n.getAttribute('data-i18n');
      if (!varsayilan.has(n)) varsayilan.set(n, n.textContent);
      var s = (dil === 'tr') ? (varsayilan.get(n)) : ((sozluk[dil] && sozluk[dil][k]) || varsayilan.get(n));
      if (n.textContent !== s) n.textContent = s;
    }
    var at = kok.querySelectorAll('[data-i18n-attr]');
    for (var j = 0; j < at.length; j++) at[j].getAttribute('data-i18n-attr').split(';').forEach(function (p) {
      var a = p.split(':'); if (a.length < 2) return;
      var n2 = at[j], key = 'i18nv-' + a[0]; if (!n2.hasAttribute('data-' + key)) n2.setAttribute('data-' + key, n2.getAttribute(a[0]) || '');
      var s2 = dil === 'tr' ? n2.getAttribute('data-' + key) : (sozluk[dil][a[1]] || n2.getAttribute('data-' + key));
      if (n2.getAttribute(a[0]) !== s2) n2.setAttribute(a[0], s2);
    });
    var pn = kok.querySelectorAll('[data-program-notu]');
    for (var m = 0; m < pn.length; m++) { var msg = dil === 'tr' ? '' : t('tur.program_notu'); if (pn[m].textContent !== msg) pn[m].textContent = msg; if (pn[m].hidden === !!msg) pn[m].hidden = !msg; }
    var h = document.documentElement, dr = dil === 'ar' ? 'rtl' : 'ltr';
    if (h.getAttribute('lang') !== dil) h.setAttribute('lang', dil); if (h.getAttribute('dir') !== dr) h.setAttribute('dir', dr);
    var sel = document.querySelector('[data-dil-sec]'); if (sel && sel.value !== dil) sel.value = dil;
    if (dil === 'en') metinCevir(kok === document ? document.body : kok);
  }
  /* 19.11.2026 Hilal Hanım: İngilizce sayfa geneli. data-i18n olmayan sabit yazılar en-metin.json ile birebir eşleşince çevrilir;
     tur programları (.program) ve makale gövdeleri Türkçe kalır. TR'ye dönünce sayfa yeniden yüklenir. */
  var METIN = null, AYLAR = { 'Ocak': 'January', 'Şubat': 'February', 'Mart': 'March', 'Nisan': 'April', 'Mayıs': 'May', 'Haziran': 'June', 'Temmuz': 'July', 'Ağustos': 'August', 'Eylül': 'September', 'Ekim': 'October', 'Kasım': 'November', 'Aralık': 'December' };
  var KURAL = [
    [/^(\d+) gün$/, '$1 days'], [/^(\d+) tur$/, '$1 tours'], [/^(\d+) tur programı →$/, '$1 tour programmes →'], [/^(\d+) kalkış$/i, '$1 departures'],
    [/^(\d+) Gece (\d+) Gün$/, '$1 Nights $2 Days'], [/^(\d+) Gün$/, '$1 Days'], [/^([€$£][\d.,]+)'dan$/, 'from $1'], [/^'dan$/, ''], [/^(\d) ve (\d) Yıldız$/, '$1 and $2 Star'], [/^(\d) veya (\d) Yıldız$/, '$1 or $2 Star'], [/^(\d) Yıldız$/, '$1 Star'],
    [/^≈ TL tutarlar: Banka satış kuru \(Ziraat Katılım\), güncelleme (.*) · Bilgi amaçlıdır, kesin fiyat için bize ulaşın\.$/, '≈ TL amounts: bank selling rate (Ziraat Katılım), updated $1 · For information only; contact us for exact prices.'],
    [/^(\d{1,2}) (Ocak|Şubat|Mart|Nisan|Mayıs|Haziran|Temmuz|Ağustos|Eylül|Ekim|Kasım|Aralık) (\d{4})$/, function (m, g, a, y) { return g + ' ' + AYLAR[a] + ' ' + y; }],
    [/^(Ocak|Şubat|Mart|Nisan|Mayıs|Haziran|Temmuz|Ağustos|Eylül|Ekim|Kasım|Aralık) (\d{4})$/, function (m, a, y) { return AYLAR[a] + ' ' + y; }]
  ];
  function metinCevir(kok) {
    if (!METIN) { fetch(K + 'assets/i18n/en-metin.json').then(function (r) { return r.json(); }).then(function (j) { METIN = j; metinCevir(document.body); }).catch(function () { METIN = {}; }); return; }
    var w = document.createTreeWalker(kok, NodeFilter.SHOW_TEXT, { acceptNode: function (n) {
      var p = n.parentNode; if (!p || /^(SCRIPT|STYLE|TEXTAREA|NOSCRIPT)$/.test(p.nodeName)) return NodeFilter.FILTER_REJECT;
      if (p.closest && p.closest('[data-i18n],.program,.makale,.yazi-govde,article.yazi')) return NodeFilter.FILTER_REJECT;
      return /\S/.test(n.nodeValue) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT; } });
    var L = [], n; while ((n = w.nextNode())) L.push(n);
    L.forEach(function (n) {
      var v = n.nodeValue, t = v.trim(), y = METIN[t];
      if (y == null) for (var i = 0; i < KURAL.length; i++) if (KURAL[i][0].test(t)) { y = t.replace(KURAL[i][0], KURAL[i][1]); break; }
      if (y != null && y !== t) n.nodeValue = v.replace(t, y);
    });
    document.querySelectorAll('input[placeholder="Nereye gitmek istersiniz?"]').forEach(function (i) { i.placeholder = 'Where would you like to go?'; });
    document.querySelectorAll('input[placeholder="Tur adı veya şehir"]').forEach(function (i) { i.placeholder = 'Tour name or city'; });
  }
  function sec(d) { if (DILLER.indexOf(d) < 0) return; if (d === 'tr' && dil !== 'tr') { yaz(d); location.reload(); return; } yukle(d, function () { dil = d; yaz(d); uygula(); }); }
  function dugme() {
    if (document.querySelector('[data-dil-sec]')) return;   // sayfada kendi seçici varsa onu kullan
    var s = document.createElement('select'); s.setAttribute('data-dil-sec', ''); s.setAttribute('aria-label', 'Language / Dil');
    s.style.cssText = 'position:fixed;right:12px;bottom:12px;z-index:250;background:rgba(7,11,36,.85);color:#e8f0f8;border:1px solid rgba(255,255,255,.25);border-radius:999px;padding:6px 12px;font:700 13px system-ui;cursor:pointer';
    [['tr', 'TR'], ['en', 'EN']].concat([]).forEach(function (o) { var op = document.createElement('option'); op.value = o[0]; op.textContent = o[1]; s.appendChild(op); });   // AR çevirisi hazır olunca ['ar','AR'] eklenir
    s.value = dil; s.addEventListener('change', function () { sec(s.value); }); document.body.appendChild(s);
  }
  window.FT_DIL = { t: t, uygula: uygula, sec: sec, dil: function () { return dil; } };
  dil = oku();
  var zamanlayici;
  new MutationObserver(function () { clearTimeout(zamanlayici); zamanlayici = setTimeout(function () { if (dil !== 'tr') uygula(); }, 60); }).observe(document.body, { childList: true, subtree: true });   // site.js'in sonradan kurduğu menü/altbilgi için
  dugme();
  if (dil !== 'tr') yukle(dil, uygula); else uygula();
})();
