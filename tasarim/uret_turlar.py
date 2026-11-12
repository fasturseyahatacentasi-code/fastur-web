#!/usr/bin/env python3
"""
FAS TUR — tur sayfası üretici (yalnız Python standart kütüphanesi, kurulum gerekmez)

NE YAPAR
  docs/assets/js/veri.js dosyasındaki tur verisinden şunları ÜRETİR (üzerine yazar):
    docs/turlar/index.html            tüm turlar (filtreli)
    docs/turlar/<kategori>/index.html kategori sayfaları
    docs/tur/<tur-adi-id>/index.html  her tur için ayrı sayfa (arama motorları için)
    docs/assets/js/ozet.js            her sayfanın kullandığı hafif özet (menü, iletişim bilgisi, yaklaşan turlar)
    docs/assets/js/eski-adresler.js   eski site adreslerini yeni adrese yönlendirir (404 sayfası kullanır)
    docs/sitemap.xml                  site haritası

NE ZAMAN ÇALIŞTIRILIR
  veri.js içinde bir şey değişince (tur ekle/çıkar, tarih, fiyat, telefon, WhatsApp...).

NASIL ÇALIŞTIRILIR  (depo klasöründe, terminalde)
  Windows:  py tasarim\\uret_turlar.py        (olmazsa:  python tasarim\\uret_turlar.py)
  Mac:      python3 tasarim/uret_turlar.py

DOKUNMAZ: ana sayfa, hakkımızda, haberler, iletişim, talep formu, hukuki sayfalar (bunlar elle düzenlenen HTML'dir).
"""
import json, os, re, sys, html, datetime

KOK = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'docs'))
BUGUN = datetime.date.today().isoformat()


# ---------------------------------------------------------------- veri
def veri_oku():
    p = os.path.join(KOK, 'assets', 'js', 'veri.js')
    s = open(p, encoding='utf-8').read()
    i = s.index('window.FT')
    i = s.index('{', i)
    j = s.rindex('}')
    try:
        return json.loads(s[i:j + 1])
    except json.JSONDecodeError as e:
        sys.exit(f'veri.js okunamadı (JSON hatası): {e}\n'
                 'İpucu: veri.js içinde yorum satırı (//), sondaki fazladan virgül ve tek tırnak OLMAMALI.')


def e(x):
    return html.escape(str(x), quote=True)


def tarih_tr(iso):
    try:
        y, m, d = iso.split('-')
        return f'{d}.{m}.{y}'
    except Exception:
        return ''


SEMBOL = {'USD': '$', 'EUR': '€', 'TL': '₺'}


def para_tr(t, para):
    if float(t).is_integer():
        s = f'{int(t):,}'.replace(',', '.')
    else:
        s = f'{t:,.2f}'.replace(',', 'X').replace('.', ',').replace('X', '.')
    return f'{SEMBOL.get(para, para + " ")}{s}'


def aktif_mi(t):
    return bool(t.get('aktif')) and (t.get('bitis') or '9999') >= BUGUN


def en_dusuk_fiyat(t):
    f = (t.get('fiyatlar') or {}).get('yetiskin') or []
    if not f:
        return None
    m = min(f, key=lambda r: r['tutar'])
    return para_tr(m['tutar'], m['para'])


def yol(kok, p):
    return kok + p


# ---------------------------------------------------------------- sayfa kabuğu
def kabuk(V, baslik, aciklama, kok, yol_canonical, govde, sayfa='', ek_head='', noindex=False, og_gorsel=None, ek_script=''):
    S = V['site']
    alan = S['alanAdi'].rstrip('/') + '/'
    can = alan + yol_canonical
    og = alan + (og_gorsel or 'assets/img/genel/slider1.jpg')
    tam_baslik = baslik if baslik.endswith('Fas Tur') else f'{baslik} | Fas Tur'
    return f'''<!doctype html>
<html lang="tr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{e(tam_baslik)}</title>
<meta name="description" content="{e(aciklama)}">
<link rel="canonical" href="{e(can)}">
{'<meta name="robots" content="noindex, follow">' if noindex else ''}
<meta property="og:type" content="website">
<meta property="og:locale" content="tr_TR">
<meta property="og:site_name" content="Fas Tur">
<meta property="og:title" content="{e(tam_baslik)}">
<meta property="og:description" content="{e(aciklama)}">
<meta property="og:image" content="{e(og)}">
<meta name="theme-color" content="#12385a">
<script>document.documentElement.setAttribute('data-mod','gece');</script><!-- gündüz modu pasif (12.11.2026); eski otomatik mod betiği: git geçmişi -->
<link rel="icon" href="{kok}assets/img/genel/favicon.svg" type="image/svg+xml">
<link rel="manifest" href="{kok}manifest.webmanifest">
<link rel="apple-touch-icon" href="{kok}assets/img/pwa/apple-touch-180.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,500;0,9..144,600;1,9..144,500&family=Nunito+Sans:wght@400;600;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="{kok}assets/css/site.css">
{ek_head}
</head>
<body data-kok="{kok}" data-sayfa="{e(sayfa)}">
<a class="atla" href="#icerik">İçeriğe geç</a>
<div id="ust"></div>
<noscript><p class="wrap" style="padding:12px 0"><a href="{kok}">Ana sayfa</a> · <a href="{kok}turlar/">Turlar</a> · <a href="{kok}hakkimizda/">Hakkımızda</a> · <a href="{kok}haberler/">Haberler</a> · <a href="{kok}iletisim/">İletişim</a> · <a href="{kok}tur-bul/">Bana uygun turu bul</a> · <a href="{kok}umre-rehberi/">Umre rehberi</a> · <a href="{kok}talep/">Bilgi / Rezervasyon Talebi</a></p></noscript>
<main id="icerik">
{govde}
</main>
<div id="alt"></div>
<script src="{kok}assets/js/ozet.js"></script>
{ek_script}<script src="{kok}assets/js/site.js"></script>
<script src="{kok}assets/js/zemin.js"></script>
<script src="{kok}assets/js/pano.js"></script>
<script src="{kok}assets/js/muzik.js"></script>
<script src="{kok}assets/js/katman.js"></script>
<script src="{kok}assets/js/dil.js"></script>
<script src="{kok}assets/js/pwa.js"></script>
</body>
</html>
'''


def sayfa_ust(baslik, ozet, kirintilar, kok):
    k = f'<a href="{kok}">Ana sayfa</a>'
    for ad, href in kirintilar:
        k += f'<span>/</span>' + (f'<a href="{href}">{e(ad)}</a>' if href else e(ad))
    return f'''<section class="sayfa-ust"><div class="wrap">
<nav class="kirinti" aria-label="Sayfa yolu">{k}</nav>
<h1>{e(baslik)}</h1>
{f'<p>{e(ozet)}</p>' if ozet else ''}
</div></section>'''


# ---------------------------------------------------------------- tur kartı
def tur_karti(t, kat_ad, kok):
    aktif = aktif_mi(t)
    f = en_dusuk_fiyat(t)
    tarih = ''
    if t.get('baslangic'):
        tarih = tarih_tr(t['baslangic']) + (' – ' + tarih_tr(t['bitis']) if t.get('bitis') else '')
    elif t.get('tekrar'):                      # düzenli kalkış (örn. "Her hafta perşembe"): sabit tarih yok
        tarih = t['tekrar']
    rozet = '<span class="arsiv canli">Güncel</span>' if aktif else '<span class="arsiv">Önceki dönem</span>'
    if aktif and f:
        fiyat = f'<div class="fiyat"><small>kişi başı</small>{e(f)}&#039;dan</div>'
    else:
        fiyat = '<div class="fiyat"><small>Güncel tarih ve fiyat</small>için arayın</div>'
    rota = f'<div class="rota">{e(t["guzergah"])}</div>' if t.get('guzergah') else ''
    gun = f'<span>{t["gun"]} gün</span>' if t.get('gun') else ''
    vize = f'<span>{e(t["vize"])}</span>' if t.get('vize') else ''
    return f'''<article class="kart" data-ad="{e((t['ad'] + ' ' + (t.get('guzergah') or '')).lower())}" data-kat="{e(t['kategori'])}" data-vize="{e((t.get('vize') or '').lower())}" data-gun="{t.get('gun') or 0}" data-aktif="{1 if aktif else 0}" data-tarih="{e(t.get('baslangic') or '')}">
<div class="gorsel"><img src="{kok}{e(t['gorsel'])}" alt="{e(t['ad'])}" loading="lazy" width="440" height="275"><span class="serit-etiket">{e(kat_ad)}</span>{rozet}</div>
<div class="ic">
<h3><a href="{kok}tur/{e(t['slug'])}/">{e(t['ad'])}</a></h3>
<div class="meta">{f'<span>{tarih}</span>' if tarih else ''}{gun}{vize}</div>
{rota}
<div class="alt">{fiyat}<span class="git">İncele →</span></div>
</div></article>'''


# ---------------------------------------------------------------- turlar listesi / kategori
def liste_govde(V, turlar, kok, kategori=None):
    kats = {k['slug']: k['ad'] for k in V['kategoriler']}
    sirali = sorted(turlar, key=lambda t: t.get('baslangic') or '', reverse=True)
    kartlar = '\n'.join(tur_karti(t, kats.get(t['kategori'], ''), kok) for t in sirali)
    secenek = ''.join(f'<option value="{e(k["slug"])}"{" selected" if kategori == k["slug"] else ""}>{e(k["ad"])}</option>' for k in V['kategoriler'])
    aktif_say = sum(1 for t in turlar if aktif_mi(t))
    if aktif_say == 0:
        bilgi = ('<div class="not-kutu"><strong>Yeni dönem tarihleri için bizi arayın.</strong> '
                 'Aşağıdaki turlar önceki dönemde yayınlanan programlardır; rota ve program fikri vermek için burada tutulur. '
                 'Güncel tarih, fiyat ve kontenjan bilgisi için '
                 f'<a href="{kok}talep/">talep formunu</a> doldurabilir, WhatsApp veya telefonla ulaşabilirsiniz.</div>')
    else:
        bilgi = ''
    bos = '<div class="bos gizli" data-bos><strong>Bu filtrelere uyan tur bulunamadı.</strong><br>Filtreleri temizleyin ya da bize yazın, size uygun programı birlikte bulalım.</div>'
    return f'''<div class="wrap">
{bilgi}
<div class="liste-duzen" data-liste>
<aside class="filtre" aria-label="Turları filtrele">
<h2>Turları filtrele</h2>
<form data-filtre onsubmit="return false">
<div class="alan"><label for="f-q">Ara</label><input id="f-q" name="q" type="search" placeholder="Tur adı veya şehir"></div>
<div class="alan"><label for="f-k">Kategori</label><select id="f-k" name="k"><option value="">Hepsi</option>{secenek}</select></div>
<div class="alan"><label for="f-v">Vize</label><select id="f-v" name="v"><option value="">Fark etmez</option><option value="vizeli">Vizeli</option><option value="vizesiz">Vizesiz</option></select></div>
<div class="alan"><label for="f-g">Süre</label><select id="f-g" name="g"><option value="">Fark etmez</option><option value="1-5">5 güne kadar</option><option value="6-9">6 – 9 gün</option><option value="10-15">10 – 15 gün</option><option value="16-99">16 gün ve üzeri</option></select></div>
<div class="alan onay"><input id="f-a" name="a" type="checkbox"><label for="f-a" style="margin:0;font-weight:600">Yalnız güncel turlar</label></div>
<div class="alan"><label for="f-s">Sırala</label><select id="f-s" name="s"><option value="yeni">Tarih: yeniden eskiye</option><option value="eski">Tarih: eskiden yeniye</option><option value="gun">Gün sayısı: çoktan aza</option><option value="ad">Ad (A-Z)</option></select></div>
<button type="reset" class="btn btn-hat btn-kucuk btn-blok" data-temizle>Filtreleri temizle</button>
</form>
</aside>
<div>
<div class="sonuc-bilgi"><strong data-sayi>{len(sirali)} tur</strong><span>Kartlara tıklayarak programı ve fiyat bilgisini görün.</span></div>
<div class="izgara g3" data-kartlar>
{kartlar}
</div>
{bos}
<p style="text-align:center;margin-top:24px"><button class="btn btn-hat gizli" type="button" data-daha>Daha fazla göster</button></p>
</div>
</div>
</div>
<div style="height:48px"></div>'''


# ---------------------------------------------------------------- tur detay
def program_html(prog):
    if not prog:
        return '<p>Bu tur için ayrıntılı program yakında eklenecek. Bilgi için bizi arayın ya da talep formunu doldurun.</p>'
    gruplar, baslik, govde = [], None, []
    for b in prog:
        if b['t'] == 'h':
            if baslik is not None or govde:
                gruplar.append((baslik, govde))
            baslik, govde = b['x'], []
        else:
            govde.append(b['x'])
    if baslik is not None or govde:
        gruplar.append((baslik, govde))
    if all(g[0] is None for g in gruplar):
        return ''.join(f'<p>{e(p)}</p>' for g in gruplar for p in g[1])
    out = []
    gn = 0
    for i, (b, g) in enumerate(gruplar):
        if b is None:
            out.append(''.join(f'<p>{e(p)}</p>' for p in g))
            continue
        gn += 1
        out.append(f'<details id="gun-{gn}"{" open" if i == 0 else ""}><summary>{e(b)}</summary><div class="gun-ic">'
                   + ''.join(f'<p>{e(p)}</p>' for p in g) + '</div></details>')
    return ''.join(out)


def fiyat_tablosu(baslik, satirlar):
    if not satirlar:
        return ''
    r = ''.join(f'<tr><th scope="row">{e(s["etiket"])}</th><td>{e(para_tr(s["tutar"], s["para"]))}</td></tr>' for s in satirlar)
    return f'<table class="fiyat-tablo"><caption>{e(baslik)}</caption>{r}</table>'


def detay_sayfasi(V, t, kats, kok):
    S = V['site']
    aktif = aktif_mi(t)
    kat_ad = kats.get(t['kategori'], '')
    tarih = ''
    if t.get('baslangic'):
        tarih = tarih_tr(t['baslangic']) + (' – ' + tarih_tr(t['bitis']) if t.get('bitis') else '')
    elif t.get('tekrar'):                      # düzenli kalkış (örn. "Her hafta perşembe"): sabit tarih yok
        tarih = t['tekrar']
    rozetler = ''.join(f'<span class="rozet">{e(x)}</span>' for x in [kat_ad, f'{t["gun"]} gün' if t.get('gun') else '', t.get('vize') or '', 'Güncel' if aktif else 'Önceki dönem programı'] if x)
    ozet = []
    for et, de in [('Son program tarihi' if not aktif else ('Kalkış' if t.get('tekrar') and not t.get('baslangic') else 'Tarih'), tarih), ('Süre', f'{t["gun"]} gün' if t.get('gun') else ''), ('Güzergâh', t.get('guzergah')),
                   ('Otel', t.get('otel')), ('Vize', t.get('vize')), ('Ulaşım', ', '.join(t.get('ulasim') or [])), ('Havayolu', ', '.join(t.get('havayolu') or []))]:
        if de:
            ozet.append(f'<div><dt>{e(et)}</dt><dd>{e(de)}</dd></div>')
    f = t.get('fiyatlar') or {}
    fiyat_baslik = 'Yetişkin fiyatları' if aktif else 'Yetişkin fiyatları (önceki dönem, güncel değildir)'
    fiyat_notlar = ''.join(f'<p style="font-size:14px;color:var(--soluk);margin:.3em 0">{e(n)}</p>' for n in (f.get('notlar') or []))
    fiyatlar = ''
    if f.get('yetiskin') or f.get('cocuk'):
        fiyatlar = ('<section class="kutu bolum-ic"><h2>Fiyatlar</h2>'
                    + ('<p style="font-size:15px;color:var(--soluk)">Aşağıdaki fiyatlar önceki dönem içindir. Güncel fiyat, tarih ve kontenjan için bizi arayın.</p>' if not aktif else '')
                    + '<div class="izgara g2">' + fiyat_tablosu(fiyat_baslik, f.get('yetiskin')) + fiyat_tablosu('Çocuk fiyatları', f.get('cocuk')) + '</div>' + fiyat_notlar + '</section>')
    dahil = ''.join(f'<li>{e(x)}</li>' for x in t.get('dahil') or [])
    haric = ''.join(f'<li>{e(x)}</li>' for x in t.get('haric') or [])
    dh = ''
    if dahil or haric:
        dh = '<div class="izgara g2 bolum-ic">' + (f'<section class="kutu"><h2>Fiyata dahil olanlar</h2><ul class="liste-ok">{dahil}</ul></section>' if dahil else '') + (f'<section class="kutu"><h2>Fiyata dahil olmayanlar</h2><ul class="liste-x">{haric}</ul></section>' if haric else '') + '</div>'
    benzer = [x for x in V['turlar'] if x['kategori'] == t['kategori'] and x['id'] != t['id']]
    benzer = sorted(benzer, key=lambda x: x.get('baslangic') or '', reverse=True)
    gor = set(); b2 = []
    for x in benzer:
        if x['ad'] in gor or x['ad'] == t['ad']:
            continue
        gor.add(x['ad']); b2.append(x)
    benzer_html = ''
    if b2:
        benzer_html = ('<section class="bolum kum"><div class="wrap"><h2>Benzer turlar</h2><div class="izgara g3">'
                       + '\n'.join(tur_karti(x, kat_ad, kok) for x in b2[:3]) + '</div></div></section>')
    talep = f'{kok}talep/?tur={e(t["slug"])}'
    wa_metin = f'Merhaba, "{t["ad"]}" turu hakkında bilgi almak istiyorum.'
    from urllib.parse import quote
    wa = f'https://wa.me/{S["whatsapp"]}?text={quote(wa_metin)}'
    yan = f'''<aside class="yan">
<div class="kutu"><h3>Bu tur için bilgi alın</h3>
<p style="font-size:15px;color:var(--soluk)">Güncel tarih, fiyat ve kontenjan için bize ulaşın. Online ödeme yoktur; talebinize size dönüş yapılır.</p>
<a class="btn btn-ana btn-blok" href="{talep}">Bilgi / rezervasyon talebi</a>
<div style="height:10px"></div>
<a class="btn btn-wa btn-blok" href="{wa}" target="_blank" rel="noopener">WhatsApp ile yazın</a>
<div style="height:10px"></div>
<a class="btn btn-hat btn-blok" href="tel:{e(S['telefon'])}">{e(S['telefonGoster'])}</a></div>
<div class="kutu" style="font-size:14px;color:var(--soluk)">Tarih, fiyat ve kontenjan değişebilir. Güncel bilgi için lütfen bizimle iletişime geçin.</div>
</aside>'''
    desc_parca = [t['ad']]
    if t.get('gun'):
        desc_parca.append(f'{t["gun"]} gün')
    if t.get('guzergah'):
        desc_parca.append(t['guzergah'])
    aciklama = (' · '.join(desc_parca) + '. Programı inceleyin, güncel tarih ve fiyat için Fas Tur\'a bilgi / rezervasyon talebi gönderin.')[:300]
    govde = f'''<!-- tur id: {t['id']} · eski adres: {e(t.get('eskiAdres', ''))} · teyit: {e(t.get('teyit', ''))} -->
<section class="tur-kapak"><img src="{kok}{e(t['gorsel'])}" alt="" width="1100" height="620"><div class="wrap">
<nav class="kirinti" aria-label="Sayfa yolu"><a href="{kok}">Ana sayfa</a><span>/</span><a href="{kok}turlar/">Turlar</a><span>/</span><a href="{kok}turlar/{e(t['kategori'])}/">{e(kat_ad)}</a></nav>
<h1>{e(t['ad'])}</h1><div class="rozetler">{rozetler}</div></div></section>
<div class="wrap tur-duzen"><div>
<section class="kutu bolum-ic"><h2>Tur bilgileri</h2><dl class="ozet">{''.join(ozet)}</dl></section>
<section class="kutu bolum-ic harita-kutu" data-tur-harita data-guzergah="{e(t.get('guzergah') or '')}" hidden><h2>Rota haritası</h2><p class="harita-not">Şehir etiketine dokunun; programın o günü açılsın.</p><div class="harita-sahne"><canvas aria-hidden="true"></canvas><div class="etiketler"></div></div></section>
{fiyatlar}
<section class="bolum-ic program"><h2>Tur programı</h2><p data-program-notu hidden class="harita-not"></p>{program_html(t.get('program'))}</section>
{dh}
</div>{yan}</div>
{benzer_html}'''
    return kabuk(V, f'{t["ad"]}', aciklama, kok, f'tur/{t["slug"]}/', govde, sayfa='tur', og_gorsel=t['gorsel'],
                 ek_script=f'<script src="{kok}assets/js/sehirler.js"></script>\n<script src="{kok}assets/img/harita/harita-dunya.js"></script>\n<script defer src="{kok}assets/js/tur-harita.js"></script>\n')


# ---------------------------------------------------------------- ana akış
def yaz(yol_rel, icerik):
    p = os.path.join(KOK, yol_rel)
    os.makedirs(os.path.dirname(p), exist_ok=True)
    with open(p, 'w', encoding='utf-8', newline='\n') as f:   # Windows'ta da LF: Mac/Windows aynı dosyayı üretir, sahte "değişti" olmaz
        f.write(icerik)


def main():
    V = veri_oku()
    S = V['site']
    kats = {k['slug']: k['ad'] for k in V['kategoriler']}
    uyarilar = []
    gorulen = set()
    for t in V['turlar']:
        if t['slug'] in gorulen:
            uyarilar.append(f'Aynı slug iki kez: {t["slug"]}')
        gorulen.add(t['slug'])
        if t['kategori'] not in kats:
            uyarilar.append(f'Tur {t["id"]}: bilinmeyen kategori "{t["kategori"]}"')
        if not os.path.exists(os.path.join(KOK, t['gorsel'])):
            uyarilar.append(f'Tur {t["id"]}: görsel yok -> {t["gorsel"]}')
        if t.get('aktif') and (t.get('bitis') or '9999') < BUGUN:
            uyarilar.append(f'Tur {t["id"]} aktif:true ama bitiş tarihi geçmiş ({t["bitis"]}); sitede güncel gösterilmez.')

    # tüm turlar
    toplam = len(V['turlar'])
    govde = sayfa_ust('Turlar', 'Umre, Fas, Mısır, Avrupa, Asya ve daha fazlası. Tur kartına tıklayın, programı inceleyin, talebinizi bırakın.', [('Turlar', None)], '../') \
        + liste_govde(V, V['turlar'], '../')
    yaz('turlar/index.html', kabuk(V, 'Turlar', f'Fas Tur tur kataloğu: Umre, Fas, Mısır, Avrupa, Orta ve Uzak Asya, Cruise ve yurtiçi turlar. {toplam} tur programı.', '../', 'turlar/', govde, sayfa='turlar'))

    # kategoriler
    for k in V['kategoriler']:
        ts = [t for t in V['turlar'] if t['kategori'] == k['slug']]
        if ts:
            g = liste_govde(V, ts, '../../', kategori=k['slug'])
        else:
            g = (f'<div class="wrap"><div class="bos" style="margin:40px 0 64px"><strong>Bu kategoride şu an yayında tur yok.</strong><br>'
                 f'Yeni programlar için bizi arayın ya da <a href="../../talep/">talep formunu</a> doldurun.<br><br><a class="btn btn-hat" href="../">Tüm turlara dön</a></div></div>')
        yaz(f'turlar/{k["slug"]}/index.html', kabuk(
            V, f'{k["ad"]} Turları', f'{k["ad"]} turları: programlar, güzergâhlar ve bilgi / rezervasyon talebi. Fas Tur.', '../../', f'turlar/{k["slug"]}/',
            sayfa_ust(f'{k["ad"]}', k.get('aciklama') or f'{k["ad"]} kategorisindeki turlar.', [('Turlar', '../'), (k['ad'], None)], '../../') + g, sayfa='turlar'))

    # tur detayları
    for t in V['turlar']:
        yaz(f'tur/{t["slug"]}/index.html', detay_sayfasi(V, t, kats, '../../'))

    # özet (her sayfa yükler)
    sayac = {}
    for t in V['turlar']:
        sayac[t['kategori']] = sayac.get(t['kategori'], 0) + 1
    ozet_t = []
    for t in V['turlar']:
        ozet_t.append({k: t.get(k) for k in ('id', 'slug', 'ad', 'kategori', 'baslangic', 'bitis', 'tekrar', 'gun', 'vize', 'guzergah', 'gorsel', 'aktif')} | {'fiyat': en_dusuk_fiyat(t)})
    ozet = {'site': S, 'kategoriler': [dict(k, sayi=sayac.get(k['slug'], 0)) for k in V['kategoriler']], 'turlar': ozet_t,
            'rehber': V.get('rehber', {}), 'hikaye': V.get('hikaye', []), 'heroMod': V.get('heroMod', 'harita'), 'haritaRotalari': V.get('haritaRotalari', []), 'muzik': V.get('muzik', []), 'anilar': V.get('anilar', []), 'katmanlar': V.get('katmanlar', {}), 'haberler': V.get('haberler', []), 'yorumlar': V.get('yorumlar', []), 'bolgeler': V.get('bolgeler', [])}
    yaz('assets/js/ozet.js', '/* OTOMATİK ÜRETİLDİ (tasarim/uret_turlar.py). Elle değiştirmeyin; veri.js\'i değiştirip üreticiyi çalıştırın. */\nwindow.FT = '
        + json.dumps(ozet, ensure_ascii=False, separators=(',', ':')) + ';\n')

    # eski adresler
    eski = {'tur': {str(t['id']): f'tur/{t["slug"]}/' for t in V['turlar']},
            'kategori': {str(k['eskiId']): f'turlar/{k["slug"]}/' for k in V['kategoriler'] if k.get('eskiId')},
            'haber': {str(h['eskiId']): f'haberler/{h["slug"]}/' for h in V.get('haberler', []) if h.get('eskiId')},
            'sayfa': V.get('eskiSayfalar', {})}
    yaz('assets/js/eski-adresler.js', '/* OTOMATİK ÜRETİLDİ. 404.html eski .php adreslerini bu tabloyla yeni adrese yönlendirir. */\nwindow.ESKI = '
        + json.dumps(eski, ensure_ascii=False) + ';\n')

    # sitemap
    alan = S['alanAdi'].rstrip('/') + '/'
    adresler = ['', 'turlar/', 'tur-bul/', 'umre-rehberi/'] + [f'turlar/{k["slug"]}/' for k in V['kategoriler']] + [f'tur/{t["slug"]}/' for t in V['turlar']] \
        + V.get('sabitSayfalar', []) + [f'haberler/{h["slug"]}/' for h in V.get('haberler', [])]
    xml = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' \
        + ''.join(f'  <url><loc>{e(alan + a)}</loc></url>\n' for a in adresler) + '</urlset>\n'
    yaz('sitemap.xml', xml)

    print(f'Tamam: {len(V["turlar"])} tur sayfası, {len(V["kategoriler"])} kategori sayfası, turlar/ listesi, sitemap.xml ({len(adresler)} adres).')
    for u in uyarilar:
        print('UYARI:', u)


if __name__ == '__main__':
    main()
