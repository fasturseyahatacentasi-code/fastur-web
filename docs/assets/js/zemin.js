/* ============================================================
   FAS TUR — "Gece seferi / Sahra ufku" arka planı
   Katmanlar (hepsi position:fixed, içerik üstünde değil):
     1) gök: indigo gece → sıcak ufuk (bölüme göre renk sıcaklığı değişir)
     2) girih: altın zellige/girih yıldız deseni (SVG, düşük opaklık, parallax)
     3) çöl kumulları siluetleri
     4) rota tuvali: İstanbul'dan destinasyonlara uçuş yayları, hedefte "ping"
   Hafif; prefers-reduced-motion'da durur (yayların sabit hâli çizilir); mobilde sadeleşir.
   Bölüm sıcaklığı: bölümlere data-tema="altin|kizil|turkuaz|mor" yazılır (varsayılan: gece).
   ============================================================ */
(function () {
  'use strict';
  var B = document.body, reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var kucuk = innerWidth < 700;

  var girih = "<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 120 120' fill='none' stroke='%23ffd98a' stroke-width='1'>" +
    "<path d='M60 6l9 21 21-9-9 21 21 9-21 9 9 21-21-9-9 21-9-21-21 9 9-21-21-9 21-9-9-21 21 9z'/>" +
    "<circle cx='60' cy='60' r='9'/><path d='M0 0l12 12M120 0l-12 12M0 120l12-12M120 120l-12-12'/>" +
    "<path d='M60 0v6M60 114v6M0 60h6M114 60h6' /></svg>";

  var z = document.createElement('div');
  z.id = 'zemin'; z.setAttribute('aria-hidden', 'true');
  z.innerHTML = '<div class="gok"></div><div class="girih" style="background-image:url(&quot;data:image/svg+xml,' + girih + '&quot;)"></div>' +
    '<div class="ufuk"></div>' +
    '<svg class="kumul" viewBox="0 0 1440 220" preserveAspectRatio="none"><path class="k1" d="M0 120C180 70 340 150 560 112s380-70 560-20 240 40 320 14V220H0z"/><path class="k2" d="M0 160C220 120 380 190 640 150s420-60 640-10c80 18 120 26 160 20V220H0z"/><path class="k3" d="M0 195C260 170 420 215 700 190s470-30 740 5V220H0z"/></svg>' +
    '<canvas class="rota"></canvas>';
  B.insertBefore(z, B.firstChild);
  var gir = z.querySelector('.girih'), cv = z.querySelector('canvas');

  /* ---- parallax (girih yavaş kayar) ---- */
  var sy = 0, tick = false;
  function par() { tick = false; gir.style.transform = 'translate3d(0,' + (-sy * 0.12).toFixed(1) + 'px,0)'; }

  /* ---- bölüm sıcaklığı ---- */
  var temalar = [].slice.call(document.querySelectorAll('[data-tema]'));
  function tema() {
    var mid = innerHeight * 0.5, t = 'gece';
    for (var i = 0; i < temalar.length; i++) { var r = temalar[i].getBoundingClientRect(); if (r.top <= mid && r.bottom >= mid) { t = temalar[i].getAttribute('data-tema'); break; } }
    if (B.getAttribute('data-tema') !== t) B.setAttribute('data-tema', t);
  }
  addEventListener('scroll', function () { sy = scrollY; if (!tick) { tick = true; requestAnimationFrame(function () { par(); tema(); }); } }, { passive: true });
  tema(); par();

  /* ---- uçuş yayları ---- */
  var cx = cv.getContext('2d'), W, H, DPR = 1;
  // [ad, enlem, boylam]  — İstanbul merkez
  var IST = [41.01, 28.98];
  var HEDEF = [['Mekke', 21.42, 39.83], ['Marakeş', 31.63, -8.0], ['Kahire', 30.04, 31.24], ['Tokyo', 35.68, 139.7], ['Dubai', 25.2, 55.27],
    ['Saraybosna', 43.86, 18.4], ['Delhi', 28.61, 77.2], ['Moskova', 55.75, 37.6], ['Singapur', 1.35, 103.8], ['Tunus', 36.8, 10.18]];
  if (kucuk) HEDEF = HEDEF.filter(function (h, i) { return [0, 1, 2, 4, 6].indexOf(i) > -1; });
  function xy(lat, lon) { return [(lon + 25) / 170 * W, (62 - lat) / 66 * H * 0.78 + H * 0.04]; }
  var yaylar = [], T0 = 0, SIRA = 1500, SURE = 2600, KAL = 6500;
  function kur() {
    W = cv.width = Math.round(innerWidth * DPR); H = cv.height = Math.round(innerHeight * DPR);
    var o = xy(IST[0], IST[1]);
    yaylar = HEDEF.map(function (h) {
      var p = xy(h[1], h[2]), mx = (o[0] + p[0]) / 2, my = (o[1] + p[1]) / 2, d = Math.hypot(p[0] - o[0], p[1] - o[1]);
      return { o: o, p: p, c: [mx, my - d * 0.32] };
    });
  }
  function nokta(a, t) { var u = 1 - t; return [u * u * a.o[0] + 2 * u * t * a.c[0] + t * t * a.p[0], u * u * a.o[1] + 2 * u * t * a.c[1] + t * t * a.p[1]]; }
  function ciz(ms) {
    cx.clearRect(0, 0, W, H);
    var o = yaylar[0] ? yaylar[0].o : [0, 0];
    // origin glow
    var g = cx.createRadialGradient(o[0], o[1], 0, o[0], o[1], 26 * DPR); g.addColorStop(0, 'rgba(255,217,138,.9)'); g.addColorStop(1, 'rgba(255,217,138,0)');
    cx.fillStyle = g; cx.beginPath(); cx.arc(o[0], o[1], 26 * DPR, 0, 6.283); cx.fill();
    yaylar.forEach(function (a, i) {
      var t0 = i * SIRA, dt = reduce ? SURE + 1 : ((ms - t0) % (HEDEF.length * SIRA + KAL) + (HEDEF.length * SIRA + KAL)) % (HEDEF.length * SIRA + KAL);
      if (dt < 0) return;
      var pr = Math.min(1, dt / SURE), yas = dt - SURE, alfa = reduce ? .35 : (yas < 0 ? 1 : Math.max(0, 1 - yas / KAL));
      if (alfa <= 0) return;
      var n = 40, kuyruk = reduce ? 0 : Math.max(0, pr - 0.45);
      cx.lineWidth = 1.3 * DPR;
      var gr = cx.createLinearGradient(a.o[0], a.o[1], a.p[0], a.p[1]); gr.addColorStop(0, 'rgba(255,154,46,' + (.55 * alfa) + ')'); gr.addColorStop(1, 'rgba(53,224,208,' + (.7 * alfa) + ')');
      cx.strokeStyle = gr; cx.beginPath();
      for (var k = Math.round(kuyruk * n); k <= Math.round(pr * n); k++) { var q = nokta(a, k / n); k === Math.round(kuyruk * n) ? cx.moveTo(q[0], q[1]) : cx.lineTo(q[0], q[1]); }
      cx.stroke();
      var uc = nokta(a, pr);
      if (pr < 1 && !reduce) { cx.fillStyle = 'rgba(255,240,200,' + alfa + ')'; cx.beginPath(); cx.arc(uc[0], uc[1], 2.4 * DPR, 0, 6.283); cx.fill(); }
      if (pr >= 1) {
        var ping = reduce ? 0 : Math.min(1, yas / 1600);
        cx.fillStyle = 'rgba(53,224,208,' + (.9 * alfa) + ')'; cx.beginPath(); cx.arc(a.p[0], a.p[1], 3 * DPR, 0, 6.283); cx.fill();
        if (!reduce && ping < 1) { cx.strokeStyle = 'rgba(53,224,208,' + (.6 * (1 - ping)) + ')'; cx.lineWidth = 1.5 * DPR; cx.beginPath(); cx.arc(a.p[0], a.p[1], (4 + ping * 30) * DPR, 0, 6.283); cx.stroke(); }
      }
    });
  }
  function dongu(ms) { ciz(ms); if (!reduce) requestAnimationFrame(dongu); }
  kur(); if (reduce) ciz(0); else requestAnimationFrame(dongu);
  addEventListener('resize', function () { kucuk = innerWidth < 700; kur(); if (reduce) ciz(0); });
  document.addEventListener('visibilitychange', function () { if (!document.hidden && !reduce) requestAnimationFrame(dongu); });
})();
