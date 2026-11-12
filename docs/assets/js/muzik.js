/* ============================================================
   FAS TUR — "Rota sesleri": tarayıcıda ÜRETİLEN ambient müzik (Web Audio) + mini oynatıcı
   - Hiçbir hazır şarkı/kayıt yok; dosya yok, telif sorunu yok. Parçalar kodla (ölçek, pad, çalgı vuruşları, ritim) üretilir.
   - Öğrenci kendi lisanslı parçasını koyarsa: veri.js > muzik[i].dosya = "assets/audio/xxx.mp3" -> o parça dosyadan çalar.
   - Otomatik çalma YOK. Mini oynatıcı son seçilen parçayı ve ses düzeyini sayfalar arası hatırlar (localStorage),
     ama çalmaya yalnız kullanıcı basınca başlar.
   - prefers-reduced-motion: dalga formu çubukları hareketsiz.
   Veri: veri.js > muzik [{id, ad, ruh, kategori, motor, dosya, not}]
   ============================================================ */
(function () {
  'use strict';
  var FT = window.FT || {}, M = FT.muzik || []; if (!M.length) return;
  var K = document.body.getAttribute('data-kok') || './';
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  var AY = { fas: 'Fas gecesi', umre: 'Umre sükûneti' };

  /* ---- kayıtlı durum ---- */
  var st = { id: M[0].id, vol: 0.55 };
  try { var k = JSON.parse(localStorage.getItem('ft_muzik') || '{}'); if (k.id && M.some(function (m) { return m.id === k.id; })) st.id = k.id; if (typeof k.vol === 'number') st.vol = k.vol; } catch (e) { }
  function kaydet() { try { localStorage.setItem('ft_muzik', JSON.stringify(st)); } catch (e) { } }

  /* ---- ses motoru ---- */
  var AC, master, an, rev, wet, aktif = null, dugumler = [], zamanci = 0, sonrakiAdim = 0, adim = 0, mel = 0, audioEl = null;
  var MOTOR = {
    fas:      { kok: 146.83, olcek: [0, 1, 4, 5, 7, 8, 10], bpm: 66, pad: [0, 7, 12], kesim: 520, yogun: .5, tel: 'triangle', davul: 'dum', ruzgar: 0, hizli: 2 },
    umre:     { kok: 130.81, olcek: [0, 2, 4, 7, 9], bpm: 44, pad: [0, 7, 12, 16], kesim: 760, yogun: .22, tel: 'sine', davul: '', ruzgar: 0.12, hizli: 1 },
    akdeniz:  { kok: 164.81, olcek: [0, 1, 4, 5, 7, 8, 10], bpm: 88, pad: [0, 7], kesim: 900, yogun: .7, tel: 'triangle', davul: 'hafif', ruzgar: 0.18, hizli: 2 },
    asya:     { kok: 146.83, olcek: [0, 2, 5, 7, 9], bpm: 80, pad: [0, 7, 12], kesim: 1100, yogun: .62, tel: 'sine', davul: 'tabla', ruzgar: 0, hizli: 2 },
    cruise:   { kok: 196.0, olcek: [0, 2, 4, 6, 7, 9, 11], bpm: 52, pad: [0, 7, 12, 16], kesim: 1300, yogun: .25, tel: 'sine', davul: '', ruzgar: 0.4, hizli: 1 }
  };
  function baslatCtx() {
    if (AC) { if (AC.state === 'suspended') AC.resume(); return; }
    AC = new (window.AudioContext || window.webkitAudioContext)();
    master = AC.createGain(); master.gain.value = 0; an = AC.createAnalyser(); an.fftSize = 128; an.smoothingTimeConstant = .8;
    var comp = AC.createDynamicsCompressor(); master.connect(comp); comp.connect(an); an.connect(AC.destination);
    rev = AC.createConvolver(); var len = AC.sampleRate * 2.8, buf = AC.createBuffer(2, len, AC.sampleRate);
    for (var c = 0; c < 2; c++) { var d = buf.getChannelData(c); for (var i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.6); }
    rev.buffer = buf; wet = AC.createGain(); wet.gain.value = .55; rev.connect(wet); wet.connect(master);
  }
  function vol() { if (master) master.gain.setTargetAtTime(Math.pow(st.vol, 1.6) * .8, AC.currentTime, .08); if (audioEl) audioEl.volume = st.vol; }
  function dugum(n) { dugumler.push(n); return n; }
  function pluk(f, t, dur, tip, g) {
    var o = dugum(AC.createOscillator()), e = AC.createGain(); o.type = tip; o.frequency.value = f;
    e.gain.setValueAtTime(0, t); e.gain.linearRampToValueAtTime(g, t + .015); e.gain.exponentialRampToValueAtTime(.0008, t + dur);
    o.connect(e); e.connect(master); e.connect(rev); o.start(t); o.stop(t + dur + .1);
  }
  function gurultu(t, dur, f, q, g) {
    var b = AC.createBuffer(1, AC.sampleRate * dur, AC.sampleRate), d = b.getChannelData(0); for (var i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    var s = AC.createBufferSource(); s.buffer = b; var fl = AC.createBiquadFilter(); fl.type = 'bandpass'; fl.frequency.value = f; fl.Q.value = q;
    var e = AC.createGain(); e.gain.setValueAtTime(g, t); e.gain.exponentialRampToValueAtTime(.001, t + dur); s.connect(fl); fl.connect(e); e.connect(master); s.start(t); s.stop(t + dur);
  }
  function davul(m, a, t) {
    if (m.davul === 'dum') { if (a % 8 === 0) gurultu(t, .35, 90, 4, .8); if (a % 8 === 3 || a % 8 === 6) gurultu(t, .09, 1800, 6, .25); }
    else if (m.davul === 'hafif') { if (a % 4 === 0) gurultu(t, .3, 120, 3, .45); if (a % 4 === 2) gurultu(t, .06, 2400, 5, .14); }
    else if (m.davul === 'tabla') { if (a % 8 === 0 || a % 8 === 5) gurultu(t, .25, 180, 8, .55); if (a % 8 === 2 || a % 8 === 3 || a % 8 === 7) gurultu(t, .07, 1500, 9, .22); }
  }
  function padKur(m) {
    m.pad.forEach(function (p, i) {
      var f = m.kok * Math.pow(2, p / 12);
      [-6, 6].forEach(function (de) {
        var o = dugum(AC.createOscillator()), fl = AC.createBiquadFilter(), g = AC.createGain(), lfo = dugum(AC.createOscillator()), lg = AC.createGain();
        o.type = i % 2 ? 'triangle' : 'sawtooth'; o.frequency.value = f; o.detune.value = de; fl.type = 'lowpass'; fl.frequency.value = m.kesim; fl.Q.value = .7;
        lfo.frequency.value = .05 + Math.random() * .08; lg.gain.value = m.kesim * .45; lfo.connect(lg); lg.connect(fl.frequency);
        g.gain.value = .045 / m.pad.length * 2; o.connect(fl); fl.connect(g); g.connect(master); g.connect(rev); o.start(); lfo.start();
      });
    });
    if (m.ruzgar) {
      var b = AC.createBuffer(1, AC.sampleRate * 4, AC.sampleRate), d = b.getChannelData(0); for (var i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
      var s = dugum(AC.createBufferSource()); s.buffer = b; s.loop = true; var fl = AC.createBiquadFilter(); fl.type = 'bandpass'; fl.frequency.value = 500; fl.Q.value = .5;
      var lfo = dugum(AC.createOscillator()), lg = AC.createGain(), g = AC.createGain(); lfo.frequency.value = .09; lg.gain.value = 260; lfo.connect(lg); lg.connect(fl.frequency); g.gain.value = m.ruzgar * .12;
      s.connect(fl); fl.connect(g); g.connect(master); s.start(); lfo.start();
    }
  }
  function planla(m) {
    var ad = 60 / m.bpm / 2;
    while (sonrakiAdim < AC.currentTime + .9) {
      var t = sonrakiAdim;
      if (Math.random() < m.yogun && adim % m.hizli === 0) {
        mel += Math.round(Math.random() * 4 - 2); mel = Math.max(0, Math.min(m.olcek.length * 2 - 1, mel));
        var deg = m.olcek[mel % m.olcek.length] + 12 * Math.floor(mel / m.olcek.length) + 12;
        pluk(m.kok * Math.pow(2, deg / 12), t, 1.4 + Math.random() * 1.6, m.tel, .11 + Math.random() * .06);
      }
      davul(m, adim, t); adim++; sonrakiAdim += ad;
    }
  }
  function dur(hizli) {
    clearInterval(zamanci);
    if (audioEl) { audioEl.pause(); }
    if (AC && master) { master.gain.cancelScheduledValues(AC.currentTime); master.gain.setTargetAtTime(0, AC.currentTime, hizli ? .02 : .25); }
    var d = dugumler; dugumler = []; setTimeout(function () { d.forEach(function (n) { try { n.stop(); } catch (e) { } }); }, hizli ? 60 : 900);
    aktif = null; arayuz();
  }
  function cal(id) {
    var m = M.filter(function (x) { return x.id === id; })[0]; if (!m) return;
    if (aktif) dur(true);
    st.id = id; kaydet();
    if (m.dosya) {
      if (!audioEl) { audioEl = new Audio(); audioEl.loop = true; }
      audioEl.src = K + m.dosya; audioEl.volume = st.vol; audioEl.play().catch(function () { }); aktif = id; arayuz(); return;
    }
    baslatCtx(); var eng = MOTOR[m.motor] || MOTOR.fas; adim = 0; mel = 2;
    setTimeout(function () {
      if (!AC) return; vol(); padKur(eng); sonrakiAdim = AC.currentTime + .1; planla(eng);
      zamanci = setInterval(function () { planla(eng); }, 250); aktif = id; arayuz();
    }, 40);
    aktif = id; arayuz();
  }
  function ac_kapa(id) { aktif === id ? dur(false) : cal(id); }

  /* ---- arayüz: kartlar ---- */
  var kartlar = document.querySelector('[data-muzik-kartlar]');
  var BAR = 22;
  function dalga() { var s = ''; for (var i = 0; i < BAR; i++) s += '<i></i>'; return '<span class="dalga" aria-hidden="true">' + s + '</span>'; }
  var IC = { fas: '🏮', umre: '🌙', akdeniz: '⛵', asya: '🏯', cruise: '🚢' };
  if (kartlar) {
    kartlar.innerHTML = M.map(function (m) {
      return '<article class="muzik-kart" data-id="' + esc(m.id) + '"><div class="mk-ust"><span class="mk-ik" aria-hidden="true">' + (IC[m.motor] || '♪') + '</span>' +
        '<div><h3>' + esc(m.ad) + '</h3><p>' + esc(m.ruh) + '</p></div>' +
        '<button class="mk-cal" type="button" aria-pressed="false" aria-label="' + esc(m.ad) + ' parçasını çal"><span class="pl"></span></button></div>' + dalga() +
        '<small>' + esc(m.not || '') + '</small></article>';
    }).join('');
    kartlar.addEventListener('click', function (e) { var b = e.target.closest('.mk-cal'); if (b) ac_kapa(b.closest('.muzik-kart').getAttribute('data-id')); });
  }

  /* ---- mini oynatıcı ---- */
  var mini = document.createElement('div'); mini.className = 'mini-muzik'; mini.setAttribute('role', 'region'); mini.setAttribute('aria-label', 'Rota sesleri oynatıcı');
  mini.innerHTML = '<button class="mm-cal" type="button" aria-label="Çal / duraklat"><span class="pl"></span></button>' +
    '<div class="mm-bilgi"><b></b><small>Rota sesleri</small></div>' +
    '<button class="mm-onceki" type="button" aria-label="Önceki parça">‹</button><button class="mm-sonraki" type="button" aria-label="Sonraki parça">›</button>' +
    '<label class="mm-ses"><span class="sr">Ses düzeyi</span><input type="range" min="0" max="1" step="0.02" aria-label="Ses düzeyi"></label>';
  document.body.appendChild(mini);
  var mmAd = mini.querySelector('b'), ses = mini.querySelector('input'); ses.value = st.vol;
  function idx() { return Math.max(0, M.findIndex(function (m) { return m.id === st.id; })); }
  mini.querySelector('.mm-cal').addEventListener('click', function () { ac_kapa(st.id); });
  mini.querySelector('.mm-sonraki').addEventListener('click', function () { var w = aktif; var n = M[(idx() + 1) % M.length].id; st.id = n; kaydet(); w ? cal(n) : arayuz(); });
  mini.querySelector('.mm-onceki').addEventListener('click', function () { var w = aktif; var n = M[(idx() + M.length - 1) % M.length].id; st.id = n; kaydet(); w ? cal(n) : arayuz(); });
  ses.addEventListener('input', function () { st.vol = Number(ses.value); kaydet(); vol(); });

  function arayuz() {
    var m = M[idx()]; mmAd.textContent = m.ad; mini.classList.toggle('calan', !!aktif);
    mini.querySelector('.mm-cal').setAttribute('aria-label', aktif ? 'Duraklat' : 'Çal: ' + m.ad);
    document.querySelectorAll('.muzik-kart').forEach(function (c) {
      var on = c.getAttribute('data-id') === aktif; c.classList.toggle('calan', on); c.querySelector('.mk-cal').setAttribute('aria-pressed', on);
    });
  }
  arayuz();

  /* ---- dalga formu animasyonu ---- */
  var veri = new Uint8Array(64);
  function ciz() {
    requestAnimationFrame(ciz);
    var a = document.querySelector('.muzik-kart.calan .dalga'); if (!a || !an || reduce) return;
    an.getByteFrequencyData(veri); var cs = a.children;
    for (var i = 0; i < cs.length; i++) { var v = veri[2 + i * 2] / 255; cs[i].style.transform = 'scaleY(' + (0.12 + v * 0.95).toFixed(2) + ')'; }
  }
  requestAnimationFrame(ciz);
  window.FT_MUZIK = { cal: cal, dur: function () { dur(false); } };
})();
