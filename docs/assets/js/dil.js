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
  }
  function sec(d) { if (DILLER.indexOf(d) < 0) return; yukle(d, function () { dil = d; yaz(d); uygula(); }); }
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
