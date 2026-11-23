/* ============================================================
   FAS TUR — mevsim efekti (Hilal Hanım 23.11.2026)
   Sayfa açılınca mevsime göre hafif bir yağış: kış = kar, ilkbahar = çiçek yaprakları,
   yaz = altın ışık zerreleri, sonbahar = yapraklar. Tıklamayı engellemez (pointer-events:none).
   ŞİMDİLİK ÖRNEK: yalnız adrese ?mevsim=kis|ilkbahar|yaz|sonbahar eklenince çalışır (site.js yükler).
   Onaydan sonra tarihe göre: 1 Ara–1 Mar kış, 1 Mar–1 Haz ilkbahar, 1 Haz–1 Eyl yaz, 1 Eyl–1 Ara sonbahar.
   Hareketi azalt açık cihazlarda ve Veri Tasarrufu'nda çalışmaz.
   ============================================================ */
(function () {
  'use strict';
  var bu = document.currentScript, mevsim = (bu && bu.getAttribute('data-mevsim')) || '';
  if (['kis', 'ilkbahar', 'yaz', 'sonbahar'].indexOf(mevsim) < 0) return;
  if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (navigator.connection && navigator.connection.saveData) return;

  var cv = document.createElement('canvas');
  cv.setAttribute('aria-hidden', 'true');
  cv.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:60';
  document.body.appendChild(cv);
  var cx = cv.getContext('2d'), W = 0, H = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);
  function boyut() { W = innerWidth; H = innerHeight; cv.width = W * dpr; cv.height = H * dpr; cx.setTransform(dpr, 0, 0, dpr, 0, 0); }
  boyut(); addEventListener('resize', boyut);

  var mobil = W < 760;
  var AYAR = {
    kis: { n: mobil ? 70 : 140, renk: ['#ffffff', '#eaf4ff', '#dbe9ff'], hiz: [0.5, 1.6], boy: [1.2, 3.6] },
    ilkbahar: { n: mobil ? 22 : 42, renk: ['#ffd1dc', '#ffc0cf', '#ffe4ec', '#fff0f4'], hiz: [0.6, 1.3], boy: [5, 9] },
    yaz: { n: mobil ? 26 : 50, renk: ['#ffd98a', '#ffe7b0', '#ffc861'], hiz: [0.15, 0.45], boy: [1.5, 3.2] },
    sonbahar: { n: mobil ? 16 : 30, renk: ['#d9622b', '#e8a23a', '#b5432a', '#c97b2c', '#8c4a1f'], hiz: [0.7, 1.5], boy: [8, 14] }
  }[mevsim];
  function ar(a, b) { return a + Math.random() * (b - a); }
  function yeni(ilk) {
    var p = { x: ar(0, W), y: ilk ? ar(-H * 0.15, H) : ar(-40, -10), r: ar(AYAR.boy[0], AYAR.boy[1]), v: ar(AYAR.hiz[0], AYAR.hiz[1]),
      faz: ar(0, 6.28), sal: ar(0.4, 1.4), don: ar(0, 6.28), dh: ar(-0.03, 0.03), renk: AYAR.renk[(Math.random() * AYAR.renk.length) | 0], op: ar(0.55, 0.95) };
    if (mevsim === 'yaz') { p.y = ilk ? ar(0, H) : H + 10; }
    return p;
  }
  var ps = []; for (var i = 0; i < AYAR.n; i++) ps.push(yeni(true));

  function yaprak(p) {   /* sonbahar yaprağı: iki yaylı, ortası damarlı */
    cx.save(); cx.translate(p.x, p.y); cx.rotate(p.don); cx.globalAlpha = p.op; cx.fillStyle = p.renk;
    cx.beginPath(); cx.moveTo(0, -p.r); cx.quadraticCurveTo(p.r * 0.9, -p.r * 0.2, 0, p.r); cx.quadraticCurveTo(-p.r * 0.9, -p.r * 0.2, 0, -p.r); cx.fill();
    cx.strokeStyle = 'rgba(80,30,10,.45)'; cx.lineWidth = 0.8; cx.beginPath(); cx.moveTo(0, -p.r); cx.lineTo(0, p.r * 1.25); cx.stroke(); cx.restore();
  }
  function cicek(p) {    /* ilkbahar: kiraz çiçeği yaprağı */
    cx.save(); cx.translate(p.x, p.y); cx.rotate(p.don); cx.scale(1, 0.55 + 0.45 * Math.abs(Math.sin(p.faz))); cx.globalAlpha = p.op; cx.fillStyle = p.renk;
    cx.beginPath(); cx.moveTo(0, -p.r); cx.bezierCurveTo(p.r, -p.r, p.r, p.r * 0.6, 0, p.r); cx.bezierCurveTo(-p.r, p.r * 0.6, -p.r, -p.r, 0, -p.r); cx.fill(); cx.restore();
  }
  function kar(p) { cx.globalAlpha = p.op; cx.fillStyle = p.renk; cx.beginPath(); cx.arc(p.x, p.y, p.r, 0, 6.283); cx.fill(); }
  function isik(p) {
    var g = cx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 4); g.addColorStop(0, p.renk); g.addColorStop(1, 'rgba(255,217,138,0)');
    cx.globalAlpha = p.op * (0.6 + 0.4 * Math.sin(p.faz * 2)); cx.fillStyle = g; cx.beginPath(); cx.arc(p.x, p.y, p.r * 4, 0, 6.283); cx.fill();
  }
  var ciz = { kis: kar, ilkbahar: cicek, yaz: isik, sonbahar: yaprak }[mevsim];

  var calis = true, son = 0;
  function kare(t) {
    if (!calis) return;
    var dt = Math.min(2, (t - son) / 16.7 || 1); son = t;
    cx.clearRect(0, 0, W, H);
    if (mevsim === 'yaz') {   /* yaz: üst köşede hafif güneş parıltısı */
      var gs = cx.createRadialGradient(W * 0.85, -40, 0, W * 0.85, -40, Math.max(W, H) * 0.55);
      gs.addColorStop(0, 'rgba(255,200,110,.22)'); gs.addColorStop(1, 'rgba(255,200,110,0)'); cx.globalAlpha = 1; cx.fillStyle = gs; cx.fillRect(0, 0, W, H);
    }
    for (var i = 0; i < ps.length; i++) {
      var p = ps[i];
      p.faz += 0.02 * dt; p.don += p.dh * dt;
      if (mevsim === 'yaz') { p.y -= p.v * dt; p.x += Math.sin(p.faz) * 0.3 * dt; if (p.y < -20) ps[i] = yeni(false); }
      else { p.y += p.v * dt; p.x += Math.sin(p.faz) * p.sal * dt; if (p.y > H + 20 || p.x < -30 || p.x > W + 30) ps[i] = yeni(false); }
      ciz(p);
    }
    cx.globalAlpha = 1;
    requestAnimationFrame(kare);
  }
  kare(performance.now());   /* ilk kare hemen: sayfa açılır açılmaz görünsün */
  document.addEventListener('visibilitychange', function () { if (document.hidden) calis = false; else if (!calis) { calis = true; son = 0; requestAnimationFrame(kare); } });
})();
