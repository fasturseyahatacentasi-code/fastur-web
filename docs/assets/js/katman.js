/* ============================================================
   FAS TUR — KATMANLI VİDEO SİSTEMİ (her bölüm / hero için)
   3 katman:  arka (döngü arka plan videosu) · orta (parallax video/görsel: bulut, kum, deniz) · ön (karakter, şeffaf)
   Ayar: veri.js > katmanlar { demo, ayar{anahtar}, bolumler{ <bolum-id>:{arka,orta,on} }, demoBolumler{...} }
   Bölüm id'leri: yola-cikis (hero), yorunge, umre, fas, dunya, sira-sizde (sayfada id="..." olan bölümler).
   Her katman: { mp4, webm, mov, poster, mobil, mobilWebm, ses, alfa:"yok"|"webm"|"yesil"|"png" (şeffaf PNG: poster olarak kullanılır, video aranmaz) }
     alfa "webm"  : gerçek alfa — WebM VP9 alfa (Chrome/Firefox/Android) + Safari için HEVC alfa .mov
     alfa "yesil" : yeşil ekran (#00B140) mp4 -> tarayıcıda WebGL chroma key (benzerlik / yumuşaklık / spill veri.js'te)
   ses:true (yalnız ön katman): konuşan rehber. Otomatik SESLİ çalma YOK: sessiz poster + "Dinle" düğmesi; basılınca baştan, sesli, DÖNGÜSÜZ oynar; bitince poster'a döner.
   Dosya yoksa hiçbir şey eklenmez: sayfanın mevcut görseli/posteri görünür.
   Performans: görünür olunca yükle-oynat, görünmeyince durdur; muted playsinline loop; preload none;
   prefers-reduced-motion ve Veri Tasarrufu'nda yalnız poster; mobilde "mobil" sürüm.
   ============================================================ */
(function () {
  'use strict';
  var FT = window.FT || {}, KT = FT.katmanlar; if (!KT) return;
  var K = document.body.getAttribute('data-kok') || './';
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var con = navigator.connection || {}, tasarruf = !!con.saveData || /(^|-)2g$/.test(con.effectiveType || '');
  var sadecePoster = reduce || tasarruf, mobil = innerWidth < 760;
  var safari = /^((?!chrome|chromium|android).)*safari/i.test(navigator.userAgent);
  var dq = /[?&]demo=(\d)/.exec(location.search);            // ?demo=1 yeşil ekran anahtarı · ?demo=2 gerçek alfa webm (yalnız test; kalıcı açma: veri.js > katmanlar.demo:true)
  if (dq) KT.demo = true;
  var BOL = KT.demo ? JSON.parse(JSON.stringify(KT.demoBolumler || {})) : (KT.bolumler || {});
  if (dq && dq[1] === '3' && BOL['yola-cikis']) BOL['yola-cikis'].on = { mp4: 'assets/video/_demo/demo-karakter-sesli.mp4', poster: 'assets/video/_demo/demo-karakter.png', alfa: 'yesil', ses: true };   // ?demo=3 sesli konuşan rehber testi
  if (dq && dq[1] === '2' && BOL['yola-cikis'] && BOL['yola-cikis'].on) BOL['yola-cikis'].on.alfa = 'webm';
  var AYAR = (KT.ayar && KT.ayar.anahtar) || { renk: '#00B140', benzerlik: .32, yumusaklik: .1, spill: .5 };

  function hex(h) { var n = parseInt(h.replace('#', ''), 16); return [(n >> 16 & 255) / 255, (n >> 8 & 255) / 255, (n & 255) / 255]; }
  function varMi(l) { return l && (l.mp4 || l.webm || l.mov || l.poster); }
  function yol(p) { return /^(https?:)?\/\//.test(p) ? p : K + p; }

  /* ---- kaynak seçimi ---- */
  function kaynaklar(l) {
    var s = [];
    function ek(src, type) { if (src) s.push({ src: yol(src), type: type }); }
    if (l.alfa === 'webm') {
      var mov = ['video/quicktime; codecs="hvc1"', l.mov], web = ['video/webm; codecs="vp9"', mobil && l.mobilWebm ? l.mobilWebm : l.webm];
      var sira = safari ? [mov, web] : [web, mov];
      sira.forEach(function (x) { ek(x[1], x[0]); });
    } else {
      if (mobil && l.mobil) ek(l.mobil, 'video/mp4'); else ek(l.mp4, 'video/mp4');
      if (!(mobil && l.mobil)) ek(l.webm, 'video/webm');
    }
    return s;
  }
  function videoYap(l, cls) {
    var v = document.createElement('video'); v.className = cls; v.muted = true; v.defaultMuted = true; v.loop = true; v.playsInline = true; v.preload = 'none';
    v.setAttribute('muted', ''); v.setAttribute('playsinline', ''); v.setAttribute('aria-hidden', 'true'); v.tabIndex = -1;
    if (l.poster) v.poster = yol(l.poster);
    return v;
  }
  function kaynakBagla(v, l) {
    if (v._bagli) return; v._bagli = true;
    kaynaklar(l).forEach(function (k) { var e = document.createElement('source'); e.src = k.src; e.type = k.type; v.appendChild(e); });
    v.load();
  }

  /* ---- WebGL chroma key ---- */
  function chroma(v, host) {
    var c = document.createElement('canvas'); c.className = 'kt-key'; c.setAttribute('aria-hidden', 'true');
    var gl = c.getContext('webgl', { premultipliedAlpha: true, alpha: true }); if (!gl) return null;
    var vs = 'attribute vec2 p;varying vec2 u;void main(){u=vec2(p.x*.5+.5,.5-p.y*.5);gl_Position=vec4(p,0.,1.);}';
    var fs = 'precision mediump float;varying vec2 u;uniform sampler2D t;uniform vec3 key;uniform float sim,soft,spill;' +
      'vec2 cc(vec3 c){return vec2(-.169*c.r-.331*c.g+.5*c.b,.5*c.r-.419*c.g-.081*c.b);}' +
      'void main(){vec3 c=texture2D(t,u).rgb;float d=distance(cc(c),cc(key));float a=smoothstep(sim,sim+soft,d);' +
      'float g2=(c.r+c.b)*.5;c.g=mix(c.g,min(c.g,g2),spill);gl_FragColor=vec4(c*a,a);}';
    function sh(t, s) { var o = gl.createShader(t); gl.shaderSource(o, s); gl.compileShader(o); return o; }
    var pr = gl.createProgram(); gl.attachShader(pr, sh(gl.VERTEX_SHADER, vs)); gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, fs)); gl.linkProgram(pr); gl.useProgram(pr);
    var b = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, b); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    var loc = gl.getAttribLocation(pr, 'p'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    var tx = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, tx);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.uniform3fv(gl.getUniformLocation(pr, 'key'), hex(AYAR.renk)); gl.uniform1f(gl.getUniformLocation(pr, 'sim'), AYAR.benzerlik); gl.uniform1f(gl.getUniformLocation(pr, 'soft'), AYAR.yumusaklik); gl.uniform1f(gl.getUniformLocation(pr, 'spill'), AYAR.spill);
    gl.clearColor(0, 0, 0, 0);
    var calisiyor = false;
    function ciz() {
      if (v.readyState >= 2 && v.videoWidth) {
        if (c.width !== v.videoWidth) { c.width = v.videoWidth; c.height = v.videoHeight; gl.viewport(0, 0, c.width, c.height); }
        gl.bindTexture(gl.TEXTURE_2D, tx); gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
        try { gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, v); } catch (e) { return; }
        gl.clear(gl.COLOR_BUFFER_BIT); gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4); c.classList.add('hazir');
      }
    }
    function sonraki() { if (!calisiyor) return; ciz(); if (v.requestVideoFrameCallback) v.requestVideoFrameCallback(sonraki); else requestAnimationFrame(sonraki); }
    c.baslat = function () { if (calisiyor) return; calisiyor = true; sonraki(); }; c.durdur = function () { calisiyor = false; };
    host.appendChild(c); return c;
  }

  /* ---- görünürlük: yükle-oynat / durdur ---- */
  var io = ('IntersectionObserver' in window) ? new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      var o = e.target._kt; if (!o) return;
      if (e.isIntersecting) { kaynakBagla(o.v, o.l); var p = o.v.play(); if (p && p.catch) p.catch(function () { }); if (o.c) o.c.baslat(); }
      else { o.v.pause(); if (o.c) o.c.durdur(); }
    });
  }, { rootMargin: '120px' }) : null;

  function katmanKur(l, cls, ana, bolum) {
    if (!varMi(l)) return null;
    var kap = document.createElement('div'); kap.className = 'kt ' + cls; kap.setAttribute('aria-hidden', 'true');
    if (l.poster) kap.style.backgroundImage = 'url("' + yol(l.poster) + '")';
    ana.appendChild(kap);
    if (!(l.mp4 || l.webm || l.mov)) return kap;
    if (sadecePoster && !l.ses) return kap;                          // ses:true klip Veri Tasarrufu'nda da kullanıcı isterse oynar (preload=metadata değil: 'none')
    var v = videoYap(l, 'kt-v'); kap.appendChild(v);
    var c = null;
    if (l.alfa === 'yesil') { c = chroma(v, kap); if (c) v.classList.add('gizli-v'); }
    kap._kt = { v: v, l: l, c: c };
    if (l.ses) {                                                         // konuşan rehber: kullanıcı basınca sesli, döngüsüz
      v.loop = false; v.removeAttribute('loop'); v.preload = 'metadata';
      var dn = document.createElement('button'); dn.type = 'button'; dn.className = 'kt-dinle';
      function t(k, d) { return window.FT_DIL ? window.FT_DIL.t(k, d) : d; }
      function etiket(durum) { dn.innerHTML = durum === 'cal' ? '<span aria-hidden="true">■</span> ' + t('video.durdur', 'Durdur') : '<span aria-hidden="true">▶</span> ' + t(durum === 'bitti' ? 'video.tekrar' : 'video.dinle', durum === 'bitti' ? 'Yeniden dinle' : 'Dinle'); dn.setAttribute('aria-label', durum === 'cal' ? t('video.durdur', 'Durdur') : t('video.dinle', 'Dinle')); }
      etiket('dur');
      dn.addEventListener('click', function () {
        kaynakBagla(v, l);
        if (!v.paused && !v.ended) { v.pause(); v.currentTime = 0; v.muted = true; if (c) c.durdur(); kap.classList.remove('oynuyor'); etiket('dur'); return; }
        v.currentTime = 0; v.muted = false; v.volume = 1; kap.classList.add('oynuyor'); if (c) c.baslat();
        var p = v.play(); if (p && p.catch) p.catch(function () { kap.classList.remove('oynuyor'); etiket('dur'); });
        etiket('cal');
      });
      v.addEventListener('ended', function () { v.muted = true; v.currentTime = 0; if (c) c.durdur(); kap.classList.remove('oynuyor'); etiket('bitti'); });
      kap.appendChild(dn); kap.classList.add('video', 'sesli');
      if (io) { /* görünmeyince çalan sesli klip durur */ new IntersectionObserver(function (es) { if (!es[0].isIntersecting && !v.paused) { v.pause(); v.muted = true; if (c) c.durdur(); kap.classList.remove('oynuyor'); etiket('dur'); } }).observe(kap); }
      return kap;
    }
    if (io) io.observe(kap); else { kaynakBagla(v, l); v.play(); if (c) c.baslat(); }
    kap.classList.add('video');
    return kap;
  }

  Object.keys(BOL).forEach(function (id) {
    var sec = document.getElementById(id) || document.querySelector('[data-bolum-id="' + id + '"]');
    if (!sec) return;
    var cfg = BOL[id];
    if (id === 'yola-cikis') sec = document.querySelector('.kahraman') || sec;
    var kapsa = document.createElement('div'); kapsa.className = 'katmanlar'; kapsa.setAttribute('aria-hidden', 'true');
    var ka = katmanKur(cfg.arka || {}, 'kt-arka', kapsa), ko = katmanKur(cfg.orta || {}, 'kt-orta', kapsa);
    if (ka || ko) { sec.insertBefore(kapsa, sec.firstChild); sec.classList.add('katmanli'); if (ka && id === 'yola-cikis') sec.classList.add('arka-video'); }
    /* ön katman: karakter. Hero'da kemer çerçevenin içine, diğer bölümlerde sağ alta */
    if (cfg.on && cfg.on.alfa === 'png' && cfg.on.poster) {           /* alfa:"png": hazır şeffaf PNG, video yok */
      var im = document.querySelector('.rehber-hero .sahne-kisi img'); if (im && id === 'yola-cikis') im.src = yol(cfg.on.poster);
    } else if (varMi(cfg.on || {})) {
      var hedef = id === 'yola-cikis' ? document.querySelector('.rehber-hero .sahne-kisi') : null;
      if (hedef) { var kk = katmanKur(cfg.on, 'kt-on', hedef); if (kk) { hedef.classList.add('video-var'); if (cfg.on.alfa !== 'yok') hedef.classList.add('seffaf'); } }
      else { var kk2 = katmanKur(cfg.on, 'kt-on kt-on-bolum', sec); if (kk2) sec.classList.add('katmanli'); }
    }
    /* orta katman parallax (ana sayfada derinlik.js yönetir: section[data-durak]) */
    if (ko && !reduce && !sec.hasAttribute('data-durak')) {
      var yz = function () { var r = sec.getBoundingClientRect(); ko.style.transform = 'translate3d(0,' + (r.top * -0.08).toFixed(1) + 'px,0)'; };
      addEventListener('scroll', yz, { passive: true }); yz();
    }
  });
  if (/[?&]dinle=1/.test(location.search)) setTimeout(function () { var b = document.querySelector('.kt-dinle'); if (b) b.click(); }, 1800);   // test: Dinle düğmesine kendiliğinden bas
  window.FT_KATMAN = { demo: !!KT.demo, bolumler: Object.keys(BOL), sadecePoster: sadecePoster };
})();
