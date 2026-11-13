/* ============================================================
   FAS TUR — tur detay sayfası: ışıklı ROTA HARİTASI
   Şehir sırası: önce gün başlıklarından (program akordeonu), olmazsa guzergah alanından.
   Koordinatlar yalnız assets/js/sehirler.js sözlüğünden; sözlükte olmayan şehir atlanır. <2 şehir -> harita gösterilmez.
   Gün gün yanar; şehir etiketine/gün noktasına tıklanınca programın o günü açılır (akordeon + kaydır).
   Veri: assets/img/harita/harita-dunya.js (tek dünya verisi; bölgeye göre kırpılır). prefers-reduced-motion: animasyonsuz son kare.
   ============================================================ */
(function () {
  'use strict';
  var kutu = document.querySelector('[data-tur-harita]'), SZ = window.FT_SEHIRLER, D = window.FT_DUNYA;
  if (!kutu || !SZ || !D) return;
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  function norm(s) {
    return String(s).replace(/İ/g, 'i').replace(/I/g, 'ı').toLowerCase().replace(/[çğıöşü]/g, function (c) { return { 'ç': 'c', 'ğ': 'g', 'ı': 'i', 'ö': 'o', 'ş': 's', 'ü': 'u' }[c]; })
      .replace(/['’][a-z]+/g, '').replace(/[^a-z0-9 ]+/g, ' ').replace(/\s+/g, ' ').trim();
  }
  var anahtarlar = Object.keys(SZ.koordinat).concat(Object.keys(SZ.esler)).sort(function (a, b) { return b.length - a.length; });
  function sehirBul(metin) {              // metindeki sözlük şehirleri, sırayla
    var n = ' ' + norm(metin) + ' ', bul = [];
    anahtarlar.forEach(function (k) { var i = n.indexOf(' ' + k + ' '); if (i > -1) bul.push({ k: SZ.esler[k] || k, i: i, len: k.length }); });
    bul.sort(function (a, b) { return a.i - b.i; });
    var out = [], kul = {};
    bul.forEach(function (b) { if (!kul[b.k] && !out.some(function (o) { return o.i <= b.i && b.i < o.i + o.len + 1 && o.k !== b.k; })) { kul[b.k] = 1; out.push(b); } });
    return out.map(function (o) { return o.k; });
  }
  function ad(k) { return SZ.adlar[k] || k.replace(/\b\w/g, function (c) { return c.toUpperCase(); }); }

  /* ---- şehir sırası ---- */
  var gunler = [].slice.call(document.querySelectorAll('.program details')), seq = [], goruldu = {};
  gunler.forEach(function (d, gi) {
    sehirBul((d.querySelector('summary') || {}).textContent || '').forEach(function (k) { if (!goruldu[k] && SZ.koordinat[k]) { goruldu[k] = 1; seq.push({ k: k, gun: gi }); } });
  });
  if (seq.length < 2) {                   // yedek: guzergah sırası
    seq = []; goruldu = {};
    sehirBul(kutu.getAttribute('data-guzergah') || '').forEach(function (k) { if (!goruldu[k] && SZ.koordinat[k]) { goruldu[k] = 1; seq.push({ k: k, gun: -1 }); } });
  }
  var digerleri = seq.filter(function (s) { return s.k !== 'istanbul'; });
  if (digerleri.length >= 2) seq = digerleri;                       // kalkış şehri varsa haritayı rotaya odakla
  if (seq.length < 2) return;
  kutu.hidden = false;

  var sahne = kutu.querySelector('.harita-sahne'), cv = sahne.querySelector('canvas'), cx = cv.getContext('2d'), lab = sahne.querySelector('.etiketler');
  var rad = Math.PI / 180, W = 0, H = 0, DPR = Math.min(window.devicePixelRatio || 1, 1.75);
  function merc(l) { return Math.log(Math.tan(Math.PI / 4 + l * rad / 2)); }
  var pts = seq.map(function (s) { return { k: s.k, ad: ad(s.k), gun: s.gun, la: SZ.koordinat[s.k][0], lo: SZ.koordinat[s.k][1] }; });
  var minLo = Math.min.apply(0, pts.map(function (p) { return p.lo; })), maxLo = Math.max.apply(0, pts.map(function (p) { return p.lo; }));
  var minLa = Math.min.apply(0, pts.map(function (p) { return p.la; })), maxLa = Math.max.apply(0, pts.map(function (p) { return p.la; }));
  var padLo = Math.max(2.2, (maxLo - minLo) * 0.28), padLa = Math.max(1.6, (maxLa - minLa) * 0.34);
  var cLo = (minLo + maxLo) / 2, cLa = (minLa + maxLa) / 2, spanLo = (maxLo - minLo) + padLo * 2, spanMy = (merc(maxLa + padLa) - merc(minLa - padLa));
  var S = 1, ox = 0, oy = 0;
  function proje(la, lo) { return [W / 2 + (lo - cLo) * rad * S, H / 2 - (merc(la) - merc(cLa)) * S]; }
  var YER = [];
  function yerlestir() {                                            // etiketleri çakışmasız yerleştir (6 aday konum)
    var kutular = [], cw = sahne.clientWidth, ch = sahne.clientHeight, mob = cw < 480;
    var adaylar = [[0, 0], [1, 0], [0, -34], [1, -34], [0, 34], [1, 34], [0, -68], [1, 68], [0, 68], [1, -68]];
    YER = pts.map(function (p, i) {
      var q = proje(p.la, p.lo), x = q[0] / DPR, y = q[1] / DPR, w = 40 + p.ad.length * 7.4, h = 30, sec = null;
      for (var a = 0; a < adaylar.length && !sec; a++) {
        var sol = adaylar[a][0] === 1, dy = adaylar[a][1], bx = sol ? x - w + 13 : x - 13, by = y + dy - h / 2;
        if (bx < 2 || bx + w > cw - 2 || by < 2 || by + h > ch - 2) continue;
        if (kutular.some(function (k) { return bx < k[0] + k[2] + 8 && bx + w + 8 > k[0] && by < k[1] + k[3] + 8 && by + h + 8 > k[1]; })) continue;
        sec = { sol: sol, dy: dy, box: [bx, by, w, h] };
      }
      if (!sec) sec = { sol: false, dy: 0, box: [x, y - h / 2, w, h] };
      kutular.push(sec.box); return sec;
    });
  }
  function boyut() { W = cv.width = Math.round(sahne.clientWidth * DPR); H = cv.height = Math.round(sahne.clientHeight * DPR); S = Math.min(W / (spanLo * rad), H / spanMy); yerlestir(); }

  /* etiketler: gerçek düğmeler */
  var ET = pts.map(function (p, i) {
    var e = document.createElement(p.gun > -1 ? 'button' : 'span'); e.className = 'sehir'; if (p.gun > -1) { e.type = 'button'; e.setAttribute('aria-label', p.ad + ' — ' + (p.gun + 1) + '. gün programını aç'); }
    e.innerHTML = '<i></i><b>' + p.ad + '</b>';   /* gün sayısı etikette yazmaz (Hilal Hanım 13.11.2026); tıklayınca o gün açılır */
    if (p.gun > -1) e.addEventListener('click', function () { var d = gunler[p.gun]; if (d) { gunler.forEach(function (x) { if (x !== d) x.open = false; }); d.open = true; d.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' }); var s = d.querySelector('summary'); if (s) s.focus({ preventScroll: true }); } });
    lab.appendChild(e); return e;
  });
  function ease(x) { x = Math.max(0, Math.min(1, x)); return x * x * (3 - 2 * x); }
  var T = pts.map(function (p, i) { return 500 + i * 1000; }), t0 = 0, gor = false, raf = 0, SON = 500 + pts.length * 1000 + 400;

  function ciz(ms) {
    cx.clearRect(0, 0, W, H);
    var ps = Math.max(1.2 * DPR, Math.min(2.4 * DPR, D.adim * rad * S * 0.28));
    cx.fillStyle = 'rgba(140,205,255,.42)';
    for (var i = 0; i < D.dots.length; i++) { var d = D.dots[i]; if (d[0] < cLo - spanLo || d[0] > cLo + spanLo) continue; var q = proje(d[1], d[0]); if (q[0] < -4 || q[0] > W + 4 || q[1] < -4 || q[1] > H + 4) continue; cx.fillRect(q[0] - ps / 2, q[1] - ps / 2, ps, ps); }
    cx.strokeStyle = 'rgba(120,200,255,.4)'; cx.lineWidth = DPR;
    D.coast.forEach(function (c) { cx.beginPath(); for (var j = 0; j < c.length; j++) { var q = proje(c[j][1], c[j][0]); j ? cx.lineTo(q[0], q[1]) : cx.moveTo(q[0], q[1]); } cx.stroke(); });
    /* rota */
    var yol = [], lit = [];
    pts.forEach(function (p, i) { lit.push(reduce ? 1 : ease((ms - T[i]) / 700)); });
    for (var s = 1; s < pts.length; s++) {
      var sp = reduce ? 1 : ease((ms - (T[s] - 800)) / 800); if (sp <= 0) break;
      var a = proje(pts[s - 1].la, pts[s - 1].lo), b = proje(pts[s].la, pts[s].lo), mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2 - Math.hypot(b[0] - a[0], b[1] - a[1]) * 0.16;
      for (var k = (s > 1 ? 1 : 0); k <= Math.round(sp * 24); k++) { var f = k / 24, u = 1 - f; yol.push([u * u * a[0] + 2 * u * f * mx + f * f * b[0], u * u * a[1] + 2 * u * f * my + f * f * b[1]]); }
    }
    if (yol.length > 1) {
      [[9, .1], [4, .22], [1.8, 1]].forEach(function (st) { cx.strokeStyle = st[1] === 1 ? '#ffd98a' : 'rgba(255,154,46,' + st[1] + ')'; cx.lineWidth = st[0] * DPR; cx.lineCap = 'round'; cx.lineJoin = 'round'; cx.beginPath(); yol.forEach(function (q, i) { i ? cx.lineTo(q[0], q[1]) : cx.moveTo(q[0], q[1]); }); cx.stroke(); });
      if (!reduce) { var h = yol[yol.length - 1]; cx.fillStyle = '#fff6dc'; cx.beginPath(); cx.arc(h[0], h[1], 3 * DPR, 0, 6.283); cx.fill(); }
    }
    pts.forEach(function (p, i) {
      var q = proje(p.la, p.lo), L = lit[i];
      if (L > .01) { var pu = reduce ? .5 : Math.sin(ms / 380 + i) * .5 + .5; cx.strokeStyle = 'rgba(255,217,138,' + .55 * (1 - pu * .6) * L + ')'; cx.lineWidth = 1.5 * DPR; cx.beginPath(); cx.arc(q[0], q[1], (4 + pu * 6) * DPR * L + 3 * DPR, 0, 6.283); cx.stroke(); cx.fillStyle = 'rgba(255,230,170,' + L + ')'; cx.beginPath(); cx.arc(q[0], q[1], 4.2 * DPR, 0, 6.283); cx.fill(); }
      var e = ET[i]; e.style.opacity = L; e.style.pointerEvents = L > .6 ? 'auto' : 'none'; e.tabIndex = L > .6 ? 0 : -1;
      e.classList.toggle('sol', !!(YER[i] && YER[i].sol));
      e.style.transform = 'translate(' + (q[0] / DPR).toFixed(1) + 'px,' + (q[1] / DPR + (YER[i] ? YER[i].dy : 0)).toFixed(1) + 'px)';
    });
  }
  function frame(now) { raf = 0; if (!t0) t0 = now; var ms = now - t0; ciz(ms); if (gor) raf = requestAnimationFrame(frame); }
  boyut(); if (reduce) ciz(1e6); else ciz(0);
  addEventListener('resize', function () { boyut(); ciz(reduce ? 1e6 : (t0 ? performance.now() - t0 : 0)); });
  if (!reduce && 'IntersectionObserver' in window) new IntersectionObserver(function (es) { gor = es[0].isIntersecting; if (gor && !raf) raf = requestAnimationFrame(frame); }).observe(sahne);
  else if (!reduce) { gor = true; raf = requestAnimationFrame(frame); }
  window.FT_TUR_HARITA = { sira: pts.map(function (p) { return p.ad + (p.gun > -1 ? '#' + (p.gun + 1) : ''); }), zamanla: function (ms) { cancelAnimationFrame(raf); raf = 0; gor = false; t0 = performance.now() - ms; boyut(); ciz(ms); } };
  var hz = /[?&]hz=(\d+)/.exec(location.search); if (hz) setTimeout(function () { window.FT_TUR_HARITA.zamanla(Number(hz[1])); }, 80);
})();
