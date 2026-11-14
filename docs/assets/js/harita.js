/* ============================================================
   FAS TUR — giriş (hero) dijital ışıklı harita sahnesi
   Veri: assets/img/harita/harita-veri.js (Natural Earth, kamu malı; nokta ızgarası + kıyı çizgisi; Avrupa-Afrika-Orta Doğu)
         Asya rotaları seçilince assets/img/harita/harita-dunya.js (dünya ızgarası) sonradan yüklenir.
   Rotalar: veri.js > haritaRotalari. Yalnız turu olan kategorinin rotası seçilebilir (Umre gibi gizli/boş rotalar görünmez).
   Sahne: İstanbul'dan uçuş yayı; kamera rotaya yaklaşır; şehirler sırayla yanar, altın rota çizgisi comet izi bırakır.
   Rota seçici (14.11.2026, Hilal Hanım): konuşma balonundaki [data-rota-sec] düğmeleri; seçilince kamera
   bulunduğu yerden yeni rotaya uçar, balon cümlesi o rotanın şehirleriyle değişir.
   Şehir etiketleri GERÇEK bağlantıdır (o şehrin geçtiği turlar). prefers-reduced-motion: animasyonsuz son kare.
   Harici kütüphane / tile / API YOK.
   ============================================================ */
(function () {
  'use strict';
  var FT = window.FT || {}, HM = window.FT_HARITA, host = document.querySelector('[data-harita]');
  if (!host || !HM) return;
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (FT.heroMod === 'video') { host.classList.add('gizli'); return; }
  var turluKat = {}; (FT.turlar || []).forEach(function (t) { turluKat[t.kategori] = 1; });
  var ROTALAR = (FT.haritaRotalari || []).filter(function (r) { return turluKat[r.kategori]; });
  if (!ROTALAR.length) ROTALAR = (FT.haritaRotalari || []).slice(0, 1);
  var R = ROTALAR.filter(function (r) { return r.varsayilan; })[0] || ROTALAR[0];
  if (!R) return;
  var K = document.body.getAttribute('data-kok') || './';
  host.closest('.kahraman') && host.closest('.kahraman').classList.add('harita-modu');

  var cv = host.querySelector('canvas'), cx = cv.getContext('2d'), lab = host.querySelector('.etiketler');
  var mobil = innerWidth < 760, W = 0, H = 0, DPR = Math.min(window.devicePixelRatio || 1, 1.75);
  var rad = Math.PI / 180;
  function merc(lat) { return Math.log(Math.tan(Math.PI / 4 + lat * rad / 2)); }
  function ease(x) { x = Math.max(0, Math.min(1, x)); return x * x * (3 - 2 * x); }
  function trLower(s) { return s.replace(/İ/g, 'i').replace(/I/g, 'ı').toLowerCase(); }
  function katAd(slug) { var k = (FT.kategoriler || []).filter(function (x) { return x.slug === slug; })[0]; return k ? k.ad : ''; }

  /* ---- dünya verisi (Asya vb. rotalar için, gerektiğinde) ---- */
  var B = HM.b || [-24, 60, 3, 58], DIS = null, DIS_KIYI = null, dunyaYukleniyor = false;
  function bolgeDisi(r) { return (r.sehirler || []).some(function (s) { return s.boylam < B[0] + 2 || s.boylam > B[1] - 2 || s.enlem < B[2] + 2 || s.enlem > B[3] - 2; }); }
  function dunyaHazirla() {
    var D = window.FT_DUNYA; if (!D || DIS) return;
    DIS = D.dots.filter(function (p) { return p[0] < B[0] || p[0] > B[1] || p[1] < B[2] || p[1] > B[3]; });
    DIS_KIYI = D.coast.filter(function (c) { return c.some(function (p) { return p[0] < B[0] || p[0] > B[1] || p[1] < B[2] || p[1] > B[3]; }); });
  }
  function dunyaYukle() {
    if (DIS || dunyaYukleniyor) return; if (window.FT_DUNYA) { dunyaHazirla(); return; }
    dunyaYukleniyor = true;
    var s = document.createElement('script'); s.src = K + 'assets/img/harita/harita-dunya.js'; s.async = true;
    s.onload = function () { dunyaHazirla(); if (donuk !== null) ciz(donuk); };
    document.head.appendChild(s);
  }

  /* ---- rota durumu ---- */
  var U, SEH, c0, c1, ARC, SEG, TS, ARC_T0, ARC_D, CAM_T0, CAM_D, gecis = false, yay = 0;
  var cam = { lon: 14, lat: 38, span: 60, ax: .5, ay: .52 }, S = 1;
  function camAt(p) {
    var hedef = mobil ? c1.genislikDerece * 0.42 : c1.genislikDerece;
    var span = Math.exp(Math.log(c0.genislikDerece) * (1 - p) + Math.log(hedef) * p) * (1 + Math.sin(p * Math.PI) * yay);
    var ax = mobil ? .5 : (gecis ? .5 : .5 + .08 * p), ay = mobil ? (gecis ? .42 : .5 - .08 * p) : (gecis ? .55 : .52 + .03 * p);
    return { lon: c0.boylam + (c1.boylam - c0.boylam) * p, lat: c0.enlem + (c1.enlem - c0.enlem) * p, span: span, ax: ax, ay: ay };
  }
  function P(lat, lon) { return [W * cam.ax + (lon - cam.lon) * rad * S, H * cam.ay - (merc(lat) - merc(cam.lat)) * S]; }

  /* büyük daire noktaları (İstanbul → varış) */
  function buyukDaire(a, b, n) {
    var la1 = a.enlem * rad, lo1 = a.boylam * rad, la2 = b.enlem * rad, lo2 = b.boylam * rad, out = [];
    var d = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin((la2 - la1) / 2), 2) + Math.cos(la1) * Math.cos(la2) * Math.pow(Math.sin((lo2 - lo1) / 2), 2)));
    for (var i = 0; i <= n; i++) {
      var f = i / n, A = Math.sin((1 - f) * d) / Math.sin(d), Bb = Math.sin(f * d) / Math.sin(d);
      var x = A * Math.cos(la1) * Math.cos(lo1) + Bb * Math.cos(la2) * Math.cos(lo2), y = A * Math.cos(la1) * Math.sin(lo1) + Bb * Math.cos(la2) * Math.sin(lo2), z = A * Math.sin(la1) + Bb * Math.sin(la2);
      out.push([Math.atan2(z, Math.sqrt(x * x + y * y)) / rad, Math.atan2(y, x) / rad]);
    }
    return out;
  }

  /* ---- etiketler (gerçek bağlantılar) ---- */
  var ET = [], istE = null;
  function turSay(q) {
    var n = 0; (FT.turlar || []).forEach(function (t) { if (t.kategori === R.kategori && trLower(t.guzergah || '').indexOf(trLower(q)) > -1) n++; });
    return n;
  }
  function etiketYap(ad, href, sayi, cls) {
    var e = document.createElement(href ? 'a' : 'span'); e.className = 'sehir ' + (cls || '');
    if (href) e.href = href;
    e.innerHTML = '<i></i><b>' + ad + '</b>' + (sayi ? '<small>' + sayi + ' tur</small>' : '');
    lab.appendChild(e); return e;
  }

  function kur(yeni, gec) {
    R = yeni; gecis = !!gec;
    U = R.ucus; SEH = R.sehirler;
    var KAM = R.kamera || {};
    c0 = gecis ? { enlem: cam.lat, boylam: cam.lon, genislikDerece: cam.span } : (KAM.baslangic || { enlem: 38, boylam: 14, genislikDerece: 60 });
    c1 = KAM.son || { enlem: 33.2, boylam: -6.3, genislikDerece: 12.5 };
    yay = gecis ? Math.min(2.2, Math.hypot(c1.boylam - c0.boylam, c1.enlem - c0.enlem) / 30) : 0;
    ARC = buyukDaire(U.kalkis, U.varis, 70);
    SEG = [];
    for (var i = 1; i < SEH.length; i++) {
      var a = SEH[i - 1], b = SEH[i], pts = [], dl = b.boylam - a.boylam, dt = b.enlem - a.enlem, n = Math.hypot(dl, dt) || 1, nx = -dt / n, ny = dl / n, off = (i % 2 ? 1 : -1) * 0.14 * n;
      for (var k = 0; k <= 28; k++) { var f = k / 28, bump = Math.sin(f * Math.PI) * off; pts.push([a.enlem + dt * f + nx * bump, a.boylam + dl * f + ny * bump]); }
      SEG.push(pts);
    }
    if (gecis) { CAM_T0 = 0; CAM_D = 2600; ARC_T0 = 200; ARC_D = 2300; TS = SEH.map(function (s, i) { return 2500 + i * 1100; }); }
    else { CAM_T0 = 1500; CAM_D = 3800; ARC_T0 = 600; ARC_D = 3100; TS = SEH.map(function (s, i) { return 3900 + i * 1450; }); }
    /* etiketler */
    lab.innerHTML = ''; ET = [];
    istE = etiketYap(U.kalkis.ad, null, 0, 'ist');
    SEH.forEach(function (s) {
      var q = s.q || s.ad;
      ET.push(etiketYap(s.ad, K + 'turlar/' + R.kategori + '/?q=' + encodeURIComponent(q), turSay(q), ''));
    });
    if (bolgeDisi(R)) dunyaYukle();
  }

  /* ---- boyut ---- */
  function boyut() {
    mobil = innerWidth < 760;
    var w = host.clientWidth, h = host.clientHeight; DPR = Math.min(window.devicePixelRatio || 1, mobil ? 1.5 : 1.75);
    W = cv.width = Math.round(w * DPR); H = cv.height = Math.round(h * DPR);
  }

  /* ---- parçacıklar ---- */
  var par = [];
  function kivilcim(x, y, ms) { if (par.length > (mobil ? 30 : 70)) return; var a = Math.random() * 6.283, v = Math.random() * .035 * DPR; par.push({ x: x, y: y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, t: ms, o: 700 + Math.random() * 500 }); }

  var son = 0;
  function ciz(ms) {
    var dt = Math.min(50, Math.max(0, ms - son)); son = ms;
    var p = ease((ms - CAM_T0) / CAM_D); cam = camAt(p); S = W / (cam.span * rad);
    cx.clearRect(0, 0, W, H);
    var lw = DPR;

    /* kabartma: Sahra ve Atlas (yalnız Fas rotasında) */
    function parilti(lat, lon, rx, ry, r, g, b, al, rot) {
      var q = P(lat, lon); cx.save(); cx.translate(q[0], q[1]); cx.rotate(rot || 0); cx.scale(1, ry / rx);
      var gr = cx.createRadialGradient(0, 0, 0, 0, 0, rx * rad * S); gr.addColorStop(0, 'rgba(' + r + ',' + g + ',' + b + ',' + al + ')'); gr.addColorStop(1, 'rgba(' + r + ',' + g + ',' + b + ',0)');
      cx.fillStyle = gr; cx.beginPath(); cx.arc(0, 0, rx * rad * S, 0, 6.283); cx.fill(); cx.restore();
    }
    if (R.id === 'fas') { parilti(26.5, -5, 7, 4.5, 255, 150, 60, .2, 0); parilti(32.4, -5.2, 5.2, 1.6, 255, 190, 120, .22, -.45); }

    /* kıyı çizgisi */
    cx.strokeStyle = 'rgba(120,200,255,.42)'; cx.lineWidth = lw * 0.9;
    function kiyi(list) {
      list.forEach(function (c) {
        cx.beginPath();
        for (var i = 0; i < c.length; i++) { var q = P(c[i][1], c[i][0]); i ? cx.lineTo(q[0], q[1]) : cx.moveTo(q[0], q[1]); }
        cx.stroke();
      });
    }
    kiyi(HM.coast); if (DIS_KIYI) kiyi(DIS_KIYI);

    /* noktalar */
    var lit = SEH.map(function (s, i) { return { q: P(s.enlem, s.boylam), L: reduce ? 1 : ease((ms - TS[i]) / 800) }; });
    function noktalar(arr, adim, baz) {
      var px = Math.min(2.6 * DPR, Math.max(1.1 * DPR, adim * rad * S * 0.3));
      for (var i = 0; i < arr.length; i++) {
        var q = P(arr[i][1], arr[i][0]); if (q[0] < -8 || q[0] > W + 8 || q[1] < -8 || q[1] > H + 8) continue;
        var al = baz, r = 140, g = 205, b = 255;
        for (var j = 0; j < lit.length; j++) { if (lit[j].L > 0.01) { var d = Math.hypot(q[0] - lit[j].q[0], q[1] - lit[j].q[1]) / (S * rad); if (d < 1.5) { var f = (1 - d / 1.5) * lit[j].L; al += f * .55; r += (255 - r) * f; g += (190 - g) * f * .6; b += (90 - b) * f * .7; } } }
        cx.fillStyle = 'rgba(' + (r | 0) + ',' + (g | 0) + ',' + (b | 0) + ',' + Math.min(al, .95) + ')'; cx.fillRect(q[0] - px / 2, q[1] - px / 2, px, px);
      }
    }
    noktalar(HM.coarse, 0.6, .42); noktalar(HM.fine, 0.14, .46); if (DIS) noktalar(DIS, 0.9, .4);

    /* İstanbul */
    var io = P(U.kalkis.enlem, U.kalkis.boylam);
    var gr = cx.createRadialGradient(io[0], io[1], 0, io[0], io[1], 30 * DPR); gr.addColorStop(0, 'rgba(255,230,170,.95)'); gr.addColorStop(1, 'rgba(255,170,60,0)');
    cx.fillStyle = gr; cx.beginPath(); cx.arc(io[0], io[1], 30 * DPR, 0, 6.283); cx.fill();

    /* uçuş yayı */
    var ap = reduce ? 1 : ease((ms - ARC_T0) / ARC_D), nA = Math.round(ap * (ARC.length - 1)), head = io;
    if (nA > 1) {
      var q0 = P(ARC[0][0], ARC[0][1]), q1 = P(ARC[ARC.length - 1][0], ARC[ARC.length - 1][1]);
      var g2 = cx.createLinearGradient(q0[0], q0[1], q1[0], q1[1]); g2.addColorStop(0, 'rgba(255,230,170,.95)'); g2.addColorStop(1, 'rgba(53,224,208,.9)');
      [[7, .12], [2.2, 1]].forEach(function (s) {
        cx.strokeStyle = g2; cx.globalAlpha = s[1] * (ap >= 1 ? .55 : 1); cx.lineWidth = s[0] * DPR; cx.lineCap = 'round'; cx.beginPath();
        for (var i = 0; i <= nA; i++) { var q = P(ARC[i][0], ARC[i][1]); i ? cx.lineTo(q[0], q[1]) : cx.moveTo(q[0], q[1]); }
        cx.stroke();
      });
      cx.globalAlpha = 1; head = P(ARC[nA][0], ARC[nA][1]);
      if (ap < 1 && !reduce) { cx.fillStyle = '#fff'; cx.beginPath(); cx.arc(head[0], head[1], 3 * DPR, 0, 6.283); cx.fill(); kivilcim(head[0], head[1], ms); }
    }

    /* şehir rotası (altın) */
    var yol = [];
    for (var s = 0; s < SEG.length; s++) {
      var sp = reduce ? 1 : ease((ms - (TS[s + 1] - 1100)) / 1100); if (sp <= 0) break;
      var m = Math.round(sp * (SEG[s].length - 1));
      for (var k = (s ? 1 : 0); k <= m; k++) yol.push(P(SEG[s][k][0], SEG[s][k][1]));
    }
    if (yol.length > 1) {
      [[9, .1], [4, .22], [1.8, 1]].forEach(function (st) {
        cx.strokeStyle = st[1] === 1 ? '#ffd98a' : 'rgba(255,154,46,' + st[1] + ')'; cx.lineWidth = st[0] * DPR; cx.lineCap = 'round'; cx.lineJoin = 'round'; cx.beginPath();
        for (var i = 0; i < yol.length; i++) i ? cx.lineTo(yol[i][0], yol[i][1]) : cx.moveTo(yol[i][0], yol[i][1]);
        cx.stroke();
      });
      var uc = yol[yol.length - 1];
      if (!reduce) {
        var tamam = ms > TS[TS.length - 1] + 200;
        if (!tamam) { cx.fillStyle = '#fff6dc'; cx.beginPath(); cx.arc(uc[0], uc[1], 3.2 * DPR, 0, 6.283); cx.fill(); kivilcim(uc[0], uc[1], ms); }
        else {
          var T = ((ms - TS[TS.length - 1]) % 5200) / 5200, N = yol.length - 1;
          for (var tr = 0; tr < 18; tr++) { var u = Math.max(0, T - tr * 0.012), idx = Math.min(N, Math.round(u * N)), qq = yol[idx]; cx.fillStyle = 'rgba(255,240,200,' + (1 - tr / 18) * .85 + ')'; cx.beginPath(); cx.arc(qq[0], qq[1], (3.2 - tr * .12) * DPR, 0, 6.283); cx.fill(); }
        }
      }
    }
    /* kıvılcımlar */
    for (var i = par.length - 1; i >= 0; i--) { var o = par[i], a = (ms - o.t) / o.o; if (a >= 1 || a < 0) { par.splice(i, 1); continue; } o.x += o.vx * dt; o.y += o.vy * dt; cx.fillStyle = 'rgba(255,200,110,' + (1 - a) * .8 + ')'; cx.fillRect(o.x, o.y, 1.6 * DPR, 1.6 * DPR); }

    /* şehir noktaları + etiket konumu */
    SEH.forEach(function (s, i) {
      var q = lit[i].q, L = lit[i].L;
      if (L > 0.01) {
        var pu = reduce ? 0.5 : (Math.sin(ms / 380 + i * 1.3) * .5 + .5), r = (4 + pu * 7) * DPR * L;
        cx.strokeStyle = 'rgba(255,217,138,' + (.55 * (1 - pu * .6)) * L + ')'; cx.lineWidth = 1.5 * DPR; cx.beginPath(); cx.arc(q[0], q[1], r + 3 * DPR, 0, 6.283); cx.stroke();
        cx.fillStyle = 'rgba(255,230,170,' + L + ')'; cx.beginPath(); cx.arc(q[0], q[1], 4.2 * DPR, 0, 6.283); cx.fill();
      }
      var e = ET[i]; e.style.opacity = L; e.style.pointerEvents = L > .6 ? 'auto' : 'none';
      e.style.transform = 'translate(' + (q[0] / DPR).toFixed(1) + 'px,' + (q[1] / DPR).toFixed(1) + 'px)';
      var yon = (mobil && SEH[i].yonMobil) ? SEH[i].yonMobil : (SEH[i].yon || 'sag');
      e.classList.toggle('sol', yon === 'sol'); e.classList.toggle('nosayi', SEH[i].sayi === false);
      e.tabIndex = L > .6 ? 0 : -1;
    });
    istE.style.opacity = gecis ? .7 * (1 - ease((ms - 1200) / 1200) * .7) : ease((ms - 200) / 700) * (1 - ease((ms - CAM_T0 - CAM_D * 0.6) / 1500) * 0.85);
    istE.style.transform = 'translate(' + (io[0] / DPR).toFixed(1) + 'px,' + (io[1] / DPR).toFixed(1) + 'px)';
  }

  /* ---- döngü ---- */
  var t0 = 0, calis = false, gorunur = true, raf = 0, donuk = null;
  function frame(now) { raf = 0; if (!t0) t0 = now; donuk = now - t0; ciz(donuk); if (calis && gorunur && !document.hidden) raf = requestAnimationFrame(frame); }
  kur(R, false);
  boyut();
  if (reduce) { ciz(1e6); } else { calis = true; raf = requestAnimationFrame(frame); }
  addEventListener('resize', function () { boyut(); if (reduce) ciz(1e6); else if (donuk !== null) ciz(donuk); });
  document.addEventListener('visibilitychange', function () { if (!document.hidden && calis && gorunur && !raf && !reduce) raf = requestAnimationFrame(frame); });
  if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { gorunur = es[0].isIntersecting; if (gorunur && calis && !raf && !reduce) raf = requestAnimationFrame(frame); }).observe(host);

  /* ---- rota seçici: konuşma balonundaki düğmeler ---- */
  var secKutu = document.querySelector('[data-rota-sec]'), balonP = document.querySelector('[data-hikaye="harita"]');
  function sec(id) {
    var yeni = ROTALAR.filter(function (r) { return r.id === id; })[0]; if (!yeni || yeni === R) return;
    if (!reduce && donuk !== null) { cam = camAt(ease((donuk - CAM_T0) / CAM_D)); }
    kur(yeni, !reduce); t0 = 0; par.length = 0; son = 0;
    if (balonP) balonP.textContent = 'Yolculuk İstanbul\'dan başlıyor: ' + SEH.map(function (s) { return s.ad; }).join(', ') + '.';
    if (secKutu) [].forEach.call(secKutu.querySelectorAll('button'), function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-rota') === id)); });
    if (reduce) { boyut(); ciz(1e6); } else { calis = true; if (!raf) raf = requestAnimationFrame(frame); }
  }
  if (secKutu && ROTALAR.length > 1) {
    secKutu.innerHTML = ROTALAR.map(function (r) {
      return '<button type="button" data-rota="' + r.id + '" aria-pressed="' + (r === R) + '">' + (katAd(r.kategori) || r.ad) + '</button>';
    }).join('');
    secKutu.addEventListener('click', function (e) { var b = e.target.closest('button[data-rota]'); if (b) sec(b.getAttribute('data-rota')); });
    secKutu.hidden = false;
  }

  /* yeniden oynat (test / tanıtım) */
  host.replay = function () { t0 = 0; par.length = 0; if (!raf) raf = requestAnimationFrame(frame); };
  var hz = /[?&]hz=(\d+)/.exec(location.search); if (hz) { setTimeout(function () { window.FT_HARITA_SAHNE.zamanla(Number(hz[1])); }, 50); }
  var rq = /[?&]rota=([a-z-]+)/.exec(location.search); if (rq) setTimeout(function () { sec(rq[1]); }, 30);   /* test: ?rota=japonya */
  window.FT_HARITA_SAHNE = { replay: host.replay, sec: sec, rotalar: ROTALAR.map(function (r) { return r.id; }), zamanla: function (ms) { cancelAnimationFrame(raf); raf = 0; calis = false; donuk = ms; boyut(); ciz(ms); } };
})();
