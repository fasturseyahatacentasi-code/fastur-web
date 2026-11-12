#!/usr/bin/env python3
r"""
FAS TUR — ELLE YAZILAN SAYFALARIN ÜRETİCİSİ (ana sayfa, hakkımızda, seyahat ipuçları, haberler + yazıları, iletişim, talep,
hukuki sayfalar, 404, robots.txt). Yalnız Python standart kütüphanesi; kurulum gerekmez.

NE ZAMAN ÇALIŞTIRILIR
  - Ana sayfa / iletişim / talep / kurumsal sayfaların metnini ya da düzenini değiştirmek istediğinizde BU DOSYAYI düzenleyip çalıştırın
    (ya da Claude Code'a "build_static.py'deki ana sayfa metnini şöyle değiştir, sonra çalıştır" deyin).
  - Sayfa kabuğunu (menü, <head>, betik listesi) değiştirdiyseniz: önce bu betik, SONRA uret_turlar.py çalışmalı (ikisi de aynı kabuğu kullanır).
NE YAPMAZ
  - veri.js'i ASLA değiştirmez (tek kaynak veri.js'tir: site bilgisi, turlar, hikâye, anılar, müzik, katmanlar...). Veriyi veri.js'ten OKUR.
  - Tur / kategori / liste sayfalarını üretmez (onları tasarim/uret_turlar.py üretir).
NASIL ÇALIŞTIRILIR (depo klasöründe)
  Windows:  py tasarim\build_static.py        (olmazsa: python tasarim\build_static.py)
  Mac:      python3 tasarim/build_static.py
  Ardından: py tasarim\uret_turlar.py   ve   py tasarim\kirik_link_kontrol.py   (önizleme açıkken)
KAYNAK DOSYALAR
  tasarim/kaynak/sayfalar.json  eski siteden taşınan metinler (hakkımızda, seyahat ipuçları, hukuki metinler, haber gövdeleri)
  tasarim/kaynak/_kazima/       eski siteyi okuyan tek seferlik betikler (kayıt amaçlı; ham veri pakette yok, çalıştırmayın)
"""
import json,re,os,sys,html,importlib.util
from urllib.parse import quote
W=os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)),'..'))
D=os.path.join(W,'docs')
spec=importlib.util.spec_from_file_location('ut',os.path.join(W,'tasarim','uret_turlar.py')); ut=importlib.util.module_from_spec(spec); spec.loader.exec_module(ut)
V=ut.veri_oku()                                   # veri.js = tek kaynak
P=json.load(open(os.path.join(W,'tasarim','kaynak','sayfalar.json'),encoding='utf-8'))
site=V['site']; rehber=V['rehber']; hikaye=V['hikaye']; kats=V['kategoriler']; haberler=V['haberler']; tours=V['turlar']; yorumlar=V.get('yorumlar',[])
CAT=[(k['slug'],k['ad'],k.get('eskiId')) for k in kats]
SABIT=V.get('sabitSayfalar',[])

kok='../'
def sp(ad_,lead,kr,kk): return ut.sayfa_ust(ad_,lead,kr,kk)
def parcala(h):
    # uzun paragrafları böl
    def f(m):
        x=m.group(1)
        if len(x)<750: return m.group(0)
        cumleler=re.split(r'(?<=[.!?])\s+(?=[A-ZÇĞİÖŞÜ0-9"“])',x); out=[];cur=''
        for c in cumleler:
            if len(cur)+len(c)>520 and cur: out.append(cur); cur=c
            else: cur=(cur+' '+c).strip()
        if cur: out.append(cur)
        return ''.join(f'<p>{o}</p>' for o in out)
    return re.sub(r'<p>(.*?)</p>',f,h,flags=re.S)
def yaz(p,icerik): ut.yaz(p,icerik)

# ---------------- ana sayfa
ust_kat=''.join(f'<a href="turlar/{s}/">{a}</a>' for s,a in [('5-yildizli-umre-turlari','Umre'),('fas','Fas'),('misir','Mısır'),('avrupa','Avrupa'),('orta-ve-uzak-asya','Asya'),('cruise','Cruise'),('yurtici-turlar','Yurtiçi')])
kopt=''.join(f'<option value="{s}">{a}</option>' for s,a,_ in CAT)
bolge=[('5-yildizli-umre-turlari','Umre','umre'),('fas','Fas','fas'),('avrupa','Avrupa','avrupa'),('orta-ve-uzak-asya','Orta ve Uzak Asya','asya'),('yurtici-turlar','Yurtiçi Turlar','yurtici'),('afrika','Afrika','afrika')]
bolge_html=''.join(f'<a class="bolge" href="turlar/{s}/"><img src="assets/img/genel/bolge-{g}.jpg" alt="" loading="lazy" width="480" height="360"><div class="ic"><h3>{a}</h3><span data-sayi-kat="{s}">Turları gör →</span></div></a>' for s,a,g in bolge)
def haber_kart(h,kk):
    return f'<article class="kart"><div class="gorsel"><img src="{kk}{h["gorsel"]}" alt="{html.escape(h["baslik"])}" loading="lazy" width="440" height="275"></div><div class="ic"><div class="meta"><span>{ut.tarih_tr(h["tarih"])}</span></div><h3><a href="{kk}haberler/{h["slug"]}/">{html.escape(h["baslik"])}</a></h3><p style="font-size:15px;color:var(--soluk);margin:0">{html.escape(h["ozet"])}</p><div class="alt"><span class="git">Devamını oku →</span></div></div></article>'
son_h=sorted(haberler,key=lambda h:h['tarih'],reverse=True)[:3]
yor_html=''.join(f'<figure class="yorum" style="margin:0"><div class="yildiz" aria-label="5 yıldız">★★★★★</div><h3>{html.escape(y["baslik"])}</h3><p>{html.escape(y["metin"])}</p><div class="kim">{html.escape(y["ad"])} · {html.escape(y["tur"])}</div></figure>' for y in yorumlar)
ld=json.dumps({"@context":"https://schema.org","@type":"TravelAgency","name":"Fas Tur","legalName":site['unvanTam'],"url":site['alanAdi'],"telephone":site['telefonGoster'],"email":site['eposta'],"address":{"@type":"PostalAddress","streetAddress":"Güven Mahallesi İnönü Caddesi No:38/106","addressLocality":"Güngören","addressRegion":"İstanbul","addressCountry":"TR"},"foundingDate":"2016","sameAs":["https://www.instagram.com/okyayturizm/"]},ensure_ascii=False)
ORB=[('5-yildizli-umre-turlari','Umre','🕋'),('fas','Fas','🕌'),('misir','Mısır','🏺'),('avrupa','Avrupa','🏰'),('orta-ve-uzak-asya','Asya','🗻'),('cruise','Cruise','🚢'),('afrika','Afrika','🦁'),('yurtici-turlar','Yurtiçi','🏞️')]
uydu=''.join(f'<div class="kol" style="--a:{i*45}deg"><div class="uydu"><a href="turlar/{s_}/" style="--r:210px"><i>{ic_}</i>{ad_}</a></div></div>' for i,(s_,ad_,ic_) in enumerate(ORB))
uydu=uydu.replace('<div class="uydu"><a','<div class="uydu"><a')
seritler=''.join(f'<a href="turlar/{s_}/"><span class="ik">{ic_}</span>{ad_}</a>' for s_,ad_,ic_ in ORB)
IMG='assets/img/karakter/'
def konus(i,img,pos='50% 12%',kapat=''):
    h=[x for x in hikaye if x['id']==i][0]
    return f'<div class="rehber-konus"><span class="foto" style="--p:{pos}"><img src="{IMG}{img}" alt="" loading="lazy" width="120" height="120"></span><div class="balon"><small data-rehber-ad>Yol arkadaşınız</small><p data-hikaye="{i}">{html.escape(h["cumle"])}</p></div></div>'
KATLINK=lambda s_,a_,k: f'<a class="bolge" href="turlar/{s_}/"><img src="assets/img/genel/bolge-{k}.jpg" alt="" loading="lazy" width="480" height="360"><div class="ic"><h3>{a_}</h3><span data-sayi-kat="{s_}">Turları gör →</span></div></a>'
umre_k=''.join(f'<a class="mini-kat" href="turlar/{s_}/"><b>{a_}</b><span data-sayi-kat="{s_}">Turları gör →</span></a>' for s_,a_ in [('ekonomik-umre-turlari','Ekonomik umre'),('yurume-mesafeli-umre-turlari','Yürüme mesafeli umre'),('5-yildizli-umre-turlari','5 yıldızlı umre')])
# Hikâye durakları (zoom-through parallax, assets/js/derinlik.js): data-durak olan bölüm 3 derinlik katmanı alır.
# data-arka = arka sahne görseli (veri.js > katmanlar.bolumler.<id>.arka doluysa o kullanılır); data-arka-mobil = telefonda daha hafif sürüm.
def durak(arka='',mobil=''):
    s=' data-durak'
    if arka: s+=f' data-arka="{arka}"'
    if mobil: s+=f' data-arka-mobil="{mobil}"'
    return s
G='assets/img/genel/'
home=f'''<section class="kahraman" id="yola-cikis"{durak()}><div class="harita" data-harita aria-label="Fas turu rotası haritası"><canvas aria-hidden="true"></canvas><div class="etiketler"></div></div><div class="slaytlar" aria-hidden="true">
<!-- İLERİDE VİDEO: karakter konuşan Flow/Codex videosu gelince .rehber-hero içindeki görselin yerine bir video etiketi konur (dosya: assets/video/rehber-hero.mp4, sessiz başlar, poster = karakter-tam-boy.png). Arka plan videosu için: assets/video/hero.mp4. -->
<div class="slayt" style="background-image:url(assets/img/genel/hero-fas.jpg)"></div><div class="slayt" style="background-image:url(assets/img/genel/hero-asya.jpg)"></div><div class="slayt" style="background-image:url(assets/img/genel/hero-avrupa.jpg)"></div><div class="slayt" style="background-image:url(assets/img/genel/hero-rusya.jpg)"></div></div>
<div class="wrap"><div>
<span class="etiket" data-bolum="yola-cikis">Bölüm 1 · Yola çıkış</span>
<h1>Dünyayı keşfetmenin<em>butik yolu</em></h1>
<p class="alt" data-i18n="ana.alt">Umre • Fas • Mısır • Avrupa • Asya</p>
<p class="ic-p" data-i18n="ana.ic">Herkese uygun tatil seçenekleri. Yol arkadaşınız sizi rotaya götürsün.</p>
<form class="arama" action="turlar/" method="get" role="search">
<input type="search" name="q" placeholder="Nereye gitmek istersin?" data-i18n-attr="placeholder:ana.arama" aria-label="Tur veya şehir ara">
<select name="k" aria-label="Kategori"><option value="" data-i18n="ana.tumkat">Tüm kategoriler</option>{kopt}</select>
<button class="btn btn-ana" type="submit" data-i18n="ana.ara">Tur ara</button></form>
<div class="hizli">{ust_kat}</div></div>
<div class="rehber-hero"><div class="balon ust"><small data-rehber-ad>Yol arkadaşınız</small><p data-hikaye="harita">{html.escape(hikaye[1]['cumle'])}</p></div>
<div class="sahne-kisi"><img src="{IMG}karakter-tam-boy.png" alt="Fas Tur yol arkadaşı" width="560" height="1632" fetchpriority="high"><i class="golge" aria-hidden="true"></i></div></div></div>
<span class="kaydir">Kaydır · yola çık</span></section>
<section class="bolum" id="yorunge"{durak()}><div class="wrap">
<div class="bolum-baslik"><div><span class="etiket" data-bolum="yorunge">Bölüm 2 · Rotanı seç</span><h2>Hangi <em>rotaya</em> çıkıyoruz?</h2></div></div>
<div class="yorunge-duzen"><div><div class="sistem" aria-label="Destinasyonlar">
<div class="halka"></div><div class="halka ic"></div><div class="yorunge">{uydu}</div>
<a class="merkez portre" href="turlar/" aria-label="Tüm turlar"><img src="{IMG}karakter-portre-1.png" alt="" width="320" height="370"></a></div>
<div class="seritler" aria-label="Destinasyonlar">{seritler}</div></div>
<div>{konus('yorunge','karakter-ifade-2.png','50% 18%')}<p class="soluk-p">Gezegenlere dokunun; her biri o bölgenin tur listesini açar.</p><a class="btn btn-hat btn-kucuk" href="turlar/">Tüm turlar</a></div></div>
</div></section>
<section class="bolum kum"><div class="wrap">
<div class="bolum-baslik"><div><span class="etiket">Yaklaşan tarihler</span><h2>Yaklaşan <em>turlar</em></h2><p>Yerinizi şimdiden ayırtmak için talebinizi bırakın.</p></div><a class="btn btn-hat btn-kucuk" href="turlar/">Tüm turlar</a></div>
<div class="takvim gizli" data-yaklasan></div>
<div class="yakinda" data-yakinda><span class="etiket">Yeni dönem</span><h3>Yeni dönem tarihleri <em>yakında</em></h3><p>Güncel tarih, fiyat ve kontenjan bilgisi için ekibimize ulaşın; ilgilendiğiniz rotayı yazın, size dönüş yapalım. Önceki dönem programlarını incelemek için Turlar sayfasına göz atabilirsiniz.</p>
<div class="dugmeler"><a class="btn btn-ana" href="talep/">Talep bırak</a><a class="btn btn-wa" data-wa href="https://wa.me/{site['whatsapp']}" target="_blank" rel="noopener">WhatsApp</a><a class="btn btn-hat" href="turlar/">Önceki dönem programları</a></div></div>
</div></section>
<section class="bolum" id="umre" data-tema="altin"{durak(G+'bolge-umre.jpg')}><div class="wrap">
<div class="bolum-baslik"><div><span class="etiket" data-bolum="umre">Bölüm 3 · Umre ve manevi yolculuk</span><h2>Umre ve <em>manevi yolculuk</em></h2></div></div>
{konus('umre','karakter-ifade-3.png','50% 18%')}
<div class="izgara g3" style="margin-top:26px">{umre_k}</div>
</div></section>
<section class="bolum kum" id="fas" data-tema="kizil"{durak(G+'hero-fas.jpg',G+'bolge-fas.jpg')}><div class="wrap">
<div class="bolum-baslik"><div><span class="etiket" data-bolum="fas">Bölüm 4 · Fas ve Kuzey Afrika</span><h2>Fas ve <em>Kuzey Afrika</em></h2></div></div>
{konus('fas','karakter-ifade-4.png','50% 18%')}
<div class="izgara g2" style="margin-top:26px">{KATLINK('fas','Fas','fas')}{KATLINK('afrika','Afrika','afrika')}</div>
</div></section>
<section class="bolum" id="dunya" data-tema="turkuaz"{durak(G+'hero-avrupa.jpg',G+'bolge-avrupa.jpg')}><div class="wrap">
<div class="bolum-baslik"><div><span class="etiket" data-bolum="dunya">Bölüm 5 · Dünya rotaları</span><h2>Dünya <em>rotaları</em></h2></div></div>
{konus('dunya','karakter-portre-4.png','50% 14%')}
<div class="izgara g3" style="margin-top:26px">{KATLINK('avrupa','Avrupa','avrupa')}{KATLINK('orta-ve-uzak-asya','Orta ve Uzak Asya','asya')}{KATLINK('yurtici-turlar','Yurtiçi Turlar','yurtici')}</div>
</div></section>
<section class="bolum kum" id="rota-sesleri" data-tema="mor"{durak(G+'hero-asya.jpg',G+'bolge-asya.jpg')}><div class="wrap">
<div class="bolum-baslik"><div><span class="etiket" data-bolum="muzik">Bölüm 6 · Rota sesleri</span><h2>Yolculuk <em>müzikleri</em></h2><p>Her rotanın bir ruh hâli var. Dinlemek için bir parçaya dokunun; ses yalnız siz başlatınca çalar.</p></div></div>
{konus('muzik','karakter-ifade-2.png','50% 18%')}
<div class="muzik-izgara" data-muzik-kartlar></div>
</div></section>
<section class="bolum kum"><div class="wrap">
<div class="bolum-baslik"><div><span class="etiket">Süreç</span><h2>Talep bırakın, <em>size dönelim</em></h2><p>Sitede online ödeme ve üyelik yoktur; bilgi ve rezervasyon talebiniz ekibimize ulaşır.</p></div></div>
<div class="izgara g3 adimlar">
<div class="adim"><h3>Turu seçin</h3><p>Turlar sayfasından rotanıza ve süreye göre filtreleyin, programı inceleyin.</p></div>
<div class="adim"><h3>Talebinizi gönderin</h3><p>Formu doldurun ya da WhatsApp / telefonla ulaşın. Kişi sayısı ve tarih tercihinizi yazmanız yeterli.</p></div>
<div class="adim"><h3>Size dönüş yapalım</h3><p>Güncel tarih, fiyat ve kontenjan bilgisini ekibimiz sizinle paylaşır.</p></div>
</div></div></section>
<section class="bolum"><div class="wrap">
<div class="bolum-baslik"><div><span class="etiket">Hakkımızda</span><h2>2016&#039;dan beri <em>butik tur anlayışı</em></h2><p>Fas turlarıyla yola çıktık; bugün farklı kıtalara kişisel ve grup turları düzenliyoruz. Her rotayı titizlikle planlıyor, her ayrıntıyı özenle düşünüyoruz.</p></div><a class="btn btn-hat btn-kucuk" href="hakkimizda/">Bizi tanıyın</a></div>
<div class="izgara g4">
<div class="deger"><h3>Müşteri odaklılık</h3><p>Her adımda misafir memnuniyetini ön planda tutarız.</p></div>
<div class="deger"><h3>Şeffaflık</h3><p>Rezervasyon ve ücretlendirmede açık olmayı ilke ediniriz.</p></div>
<div class="deger"><h3>Kalite</h3><p>Seçtiğimiz ortaklar ve hizmetlerle kaliteyi gözetiriz.</p></div>
<div class="deger"><h3>Güven</h3><p>Veri güvenliği ve seyahat emniyeti önceliğimizdir.</p></div>
</div></div></section>
<section class="bolum kum"><div class="wrap">
<div class="bolum-baslik"><div><span class="etiket">Gezi notları</span><h2>Haberler ve <em>rehberler</em></h2></div><a class="btn btn-hat btn-kucuk" href="haberler/">Tüm yazılar</a></div>
<div class="izgara g3">{''.join(haber_kart(h,'') for h in son_h)}</div></div></section>
<section class="bolum" id="anilar"><div class="wrap">
<div class="bolum-baslik"><div><span class="etiket">Misafir anıları</span><h2>Yolculuk <em>anıları</em></h2></div></div>
<div class="ani-duvar gizli" data-anilar></div>
<div class="yakinda ani-cagri" data-ani-cagri><span class="etiket">Anılarınızı bekliyoruz</span><h3>Fas Tur ile yolculuk ettiniz mi? <em>Anınızı paylaşın</em></h3><p>Fotoğraflı anılar ve yorumlar, misafirimizin izniyle burada yer alacak. Anınızı bize WhatsApp&#039;tan ya da talep formundan iletebilirsiniz; ayrıca Instagram hesabımızda da yolculuk karelerimizi bulabilirsiniz.</p>
<div class="dugmeler"><a class="btn btn-ana" href="talep/">Anımı paylaşmak istiyorum</a><a class="btn btn-wa" data-wa href="https://wa.me/{site['whatsapp']}" target="_blank" rel="noopener">WhatsApp</a><a class="btn btn-hat" href="https://www.instagram.com/okyayturizm/" target="_blank" rel="noopener">Instagram profilimiz</a></div></div>
</div></section>
<section class="bolum kum" id="sira-sizde"{durak(G+'hero-fas.jpg',G+'bolge-fas.jpg')}><div class="wrap"><div class="cagri"><div><span class="etiket" data-bolum="sira-sizde">Bölüm 7 · Sıra sizde</span><h2>Hayalinizdeki turu birlikte <em>planlayalım</em></h2>{konus('sira-sizde','karakter-ifade-1.png','50% 18%')}</div>
<div class="dugmeler"><a class="btn btn-ana" href="talep/">Talep bırak</a><a class="btn btn-wa" data-wa href="https://wa.me/{site['whatsapp']}" target="_blank" rel="noopener">WhatsApp</a></div></div></div></section>'''
yaz('index.html',ut.kabuk(V,'Fas Tur | Umre, Fas, Mısır, Avrupa ve Asya Turları','Fas Tur: Umre, Fas, Mısır, Avrupa, Orta ve Uzak Asya, Cruise ve yurtiçi turlar. Programları inceleyin, bilgi ve rezervasyon talebi gönderin.','./','',home,sayfa='ana',ek_script='<script src="assets/img/harita/harita-veri.js"></script>\n<script defer src="assets/js/harita.js"></script>\n<script defer src="assets/js/ucus.js"></script>\n<script defer src="assets/js/derinlik.js"></script>\n',ek_head=f'<script type="application/ld+json">{ld}</script>'))

# ---------------- hakkımızda
hk=P['sayfalar']['hakkimizda']
hk=hk.split('<h2>Kurumsal Bilgiler</h2>')[0]
hk=hk.replace('<h2>Değerlerimiz</h2>','<h2>Değerlerimiz</h2><ul><li><strong>Müşteri odaklılık:</strong> Her adımda misafir memnuniyetini ön planda tutarız.</li><li><strong>Şeffaflık:</strong> Rezervasyon ve ücretlendirmede tam şeffaflık sağlarız.</li><li><strong>Kalite:</strong> Seçtiğimiz ortaklar ve hizmetlerle yüksek kaliteyi gözetiriz.</li><li><strong>Güven:</strong> Veri güvenliği ve seyahat emniyeti önceliğimizdir.</li><li><strong>Yenilikçilik:</strong> Sürekli gelişimle sektöre değer katan çözümler üretiriz.</li></ul>')
hk=hk.replace('<h3>Güvenilir ve İnovatif Ortak</h3>','<h2>Vizyonumuz</h2><h3>Güvenilir ve İnovatif Ortak</h3>').replace('<h3>Kişiye Özel Deneyimler</h3>','<h2>Misyonumuz</h2><h3>Kişiye Özel Deneyimler</h3>')
kurumsal=f'''<h2>Kurumsal bilgiler</h2>
<ul><li><strong>Şirket unvanı:</strong> {site['unvanTam']}</li><li><strong>Adres:</strong> {site['adres']}</li><li><strong>Telefon:</strong> <a href="tel:{site['telefon']}">{site['telefonGoster']}</a></li><li><strong>E-posta:</strong> <a href="mailto:{site['eposta']}">{site['eposta']}</a></li><li><strong>Vergi dairesi / no:</strong> Güngören Vergi Dairesi · 6400301337</li><li data-tursab><strong>TÜRSAB belge no:</strong> <span data-tursab-no>[?]</span></li></ul>
<!-- TÜRSAB belge no: firmadan alınacak, veri.js > site.tursab alanına yazılacak; "[?]" iken sitede gizli kalır (site.js). -->
<p><a class="btn btn-ana" href="../talep/">Bilgi / rezervasyon talebi</a></p>'''
yaz('hakkimizda/index.html',ut.kabuk(V,'Hakkımızda','Fas Tur, 2016\'dan beri butik hizmet anlayışıyla tur düzenliyor. Vizyonumuz, misyonumuz ve değerlerimiz.','../','hakkimizda/',
 sp('Hakkımızda','Butik hizmet anlayışıyla, her seyahati unutulmaz bir anıya dönüştürüyoruz.',[('Hakkımızda',None)],'../')+f'<div class="dar"><div class="metin">{hk}{kurumsal}</div></div>',sayfa='hakkimizda'))

# ---------------- seyahat ipuçları
si=P['sayfalar']['seyahat_ipuclari'].split('<h3>İçindekiler</h3>')[0]
si=si.replace('Kampanyaları takip etmek için bültenimize abone olabilirsiniz: <strong>www.fastur.com.tr</strong>.','Kampanyaları takip etmek için sitemizi ve Instagram hesabımızı izleyebilirsiniz.')
si=si.replace(' Fırsatları kaçırmamak için e-bültenimize abone olmayı unutmayın.','')
si=si.replace('Size en uygun uçuş ve kampanyalar için bizimle iletişime geçin: <strong>info@fastur.com.tr</strong> veya iletişim sayfamızdan.','Size en uygun uçuş ve kampanyalar için bizimle iletişime geçin: <strong>info@fastur.com.tr</strong> veya <a href="../iletisim/">iletişim sayfamızdan</a>.')
si='<!-- Eski sitedeki "bülten aboneliği" cümleleri çıkarıldı (yeni sitede bülten yok). -->\n'+si
yaz('seyahat-ipuclari/index.html',ut.kabuk(V,'Seyahat İpuçları','Uçuşu daha konforlu ve bütçe dostu yapmak için pratik öneriler: bilet, uçuş öncesi hazırlık, uçuş sırası ve varış.','../','seyahat-ipuclari/',
 sp('Seyahat İpuçları',P['sayfalar']['seyahat_ipuclari_lead'],[('Seyahat İpuçları',None)],'../')+f'<div class="dar"><div class="metin">{si}</div></div>',sayfa='ipuclari'))

# ---------------- haberler
liste=''.join(haber_kart(h,'../') for h in sorted(haberler,key=lambda h:h['tarih'],reverse=True))
yaz('haberler/index.html',ut.kabuk(V,'Haberler ve Gezi Rehberleri','Fas, Rusya, Japonya ve daha fazlası: Fas Tur\'dan gezi rehberleri, rota notları ve sık sorulan sorular.','../','haberler/',
 sp('Haberler','Gezi rehberleri, rota notları ve sık sorulan sorular.',[('Haberler',None)],'../')+f'<div class="wrap" style="padding:36px 0 64px"><div class="izgara g3">{liste}</div></div>',sayfa='haberler'))
orig={h['id']:h for h in P['haberler']}
for h in haberler:
    govde=parcala(orig[h['eskiId']]['govde'])
    diger=[x for x in sorted(haberler,key=lambda x:x['tarih'],reverse=True) if x['slug']!=h['slug']][:3]
    body=f'''{sp(h['baslik'],'',[('Haberler','../'),(h['baslik'],None)],'../../')}
<div class="dar"><div class="haber-kapak"><img src="../../{h['gorsel']}" alt="{html.escape(h['baslik'])}" width="1100" height="550"></div>
<div class="metin makale"><div class="meta-satir">{ut.tarih_tr(h['tarih'])} · {html.escape(h['yazar'])}</div>{govde}
<p style="margin-top:2em"><a class="btn btn-ana" href="../../talep/">Bu rota için bilgi alın</a></p></div></div>
<section class="bolum kum"><div class="wrap"><h2>Diğer yazılar</h2><div class="izgara g3">{''.join(haber_kart(x,'../../') for x in diger)}</div></div></section>'''
    yaz(f'haberler/{h["slug"]}/index.html',ut.kabuk(V,h['baslik'],h['ozet'] or h['baslik'],'../../',f'haberler/{h["slug"]}/',body,sayfa='haberler',og_gorsel=h['gorsel']))

# ---------------- iletişim
S=site
def satir(ic,b,x): return f'<div class="iletisim-satir"><div>{ic}</div><div><b>{b}</b>{x}</div></div>'
ilet=f'''<div class="wrap form-duzen" style="grid-template-columns:1fr 1fr">
<div class="kutu"><h2>Fas Tur</h2><p style="color:var(--soluk)">{S['unvanTam']}</p>
{satir('📞','Telefon',f'<a href="tel:{S["telefon"]}">{S["telefonGoster"]}</a>')}
{satir('💬','WhatsApp',f'<a data-wa href="https://wa.me/{S["whatsapp"]}" target="_blank" rel="noopener">{S["telefonGoster"]}</a>')}
{satir('✉️','E-posta',f'<a href="mailto:{S["eposta"]}">{S["eposta"]}</a>')}
{satir('📍','Adres',S['adres'])}
{satir('🕘','Çalışma saatleri',S['calisma']+' arasında yanıtlıyoruz')}
{satir('📷','Instagram','<a href="https://www.instagram.com/okyayturizm/" target="_blank" rel="noopener">@okyayturizm</a>')}
</div>
<div class="kutu"><h2>Hızlı talep</h2><p style="color:var(--soluk)">Tur, tarih ve kişi sayısını yazdığınız talep formu ile bize ulaşın; ekibimiz size dönüş yapsın. Sitede online ödeme alınmaz.</p>
<a class="btn btn-ana btn-blok" href="../talep/">Bilgi / rezervasyon talebi</a><div style="height:10px"></div>
<a class="btn btn-wa btn-blok" data-wa href="https://wa.me/{S['whatsapp']}" target="_blank" rel="noopener">WhatsApp ile yazın</a></div></div>'''
yaz('iletisim/index.html',ut.kabuk(V,'İletişim','Fas Tur iletişim: telefon, WhatsApp, e-posta ve adres. Bilgi ve rezervasyon talebi için bize ulaşın.','../','iletisim/',
 sp('İletişim','Her türlü görüş, talep ve öneriniz için buradayız.',[('İletişim',None)],'../')+ilet,sayfa='iletisim'))

# ---------------- talep formu
talep=f'''<div class="wrap form-duzen">
<form class="kutu" data-talep novalidate>
<h2 data-i18n="talep.baslik">Bilgi / rezervasyon talebi</h2>
<p style="color:var(--soluk)" data-i18n="talep.aciklama">Talebiniz ekibimize ulaşır; size telefon, WhatsApp veya e-posta ile dönüş yapılır. Bu form ödeme almaz; rezervasyon, bilgi verildikten sonra netleşir.</p>
<div class="alan"><label for="t-tur" data-i18n="talep.tur">İlgilendiğiniz tur</label><select id="t-tur" name="tur"><option value="" data-i18n="talep.tur0">Henüz karar vermedim / genel bilgi</option></select></div>
<div class="iki"><div class="alan"><label for="t-ad" data-i18n="talep.ad">Ad soyad *</label><input id="t-ad" name="ad" required autocomplete="name"></div>
<div class="alan"><label for="t-tel" data-i18n="talep.tel">Telefon *</label><input id="t-tel" name="telefon" type="tel" required autocomplete="tel" placeholder="05xx xxx xx xx"></div></div>
<div class="alan"><label for="t-eposta" data-i18n="talep.eposta">E-posta</label><input id="t-eposta" name="eposta" type="email" autocomplete="email"></div>
<div class="iki"><div class="alan"><label for="t-yet" data-i18n="talep.yetiskin">Yetişkin sayısı</label><input id="t-yet" name="yetiskin" type="number" min="0" max="50" value="1"></div>
<div class="alan"><label for="t-coc" data-i18n="talep.cocuk">Çocuk sayısı</label><input id="t-coc" name="cocuk" type="number" min="0" max="50" value="0"></div></div>
<div class="alan"><label for="t-tarih" data-i18n="talep.tarih">Tercih ettiğiniz tarih / dönem</label><input id="t-tarih" name="tarih" placeholder="Örn. Mart 2027 ya da fark etmez"></div>
<div class="alan"><label for="t-not" data-i18n="talep.not">Notunuz</label><textarea id="t-not" name="not" placeholder="Sorularınızı yazabilirsiniz. Lütfen sağlık durumu, din/mezhep gibi özel nitelikli kişisel bilgi yazmayın."></textarea></div>
<input type="text" name="_honey" tabindex="-1" autocomplete="off" style="display:none" aria-hidden="true">
<div class="alan onay"><input id="t-kvkk" name="kvkk" type="checkbox" required><label for="t-kvkk" style="margin:0;font-weight:400">Kişisel verilerimin talebime dönüş yapılması amacıyla işlenmesine ilişkin <a href="../kisisel-verilerin-korunmasi/" target="_blank" rel="noopener">Kişisel Verilerin Korunması Politikası</a>&#039;nı okudum, açık rıza veriyorum. *</label></div>
<div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:6px"><button class="btn btn-ana" type="submit" data-gonder data-i18n="talep.gonder">Talebi gönder</button><button class="btn btn-wa" type="button" data-wa-gonder>WhatsApp ile gönder</button></div>
<div class="durum gizli" role="status" aria-live="polite" data-durum></div>
</form>
<aside class="yan"><div class="kutu"><h3>Doğrudan ulaşın</h3>
{satir('📞','Telefon',f'<a href="tel:{S["telefon"]}">{S["telefonGoster"]}</a>')}{satir('💬','WhatsApp',f'<a data-wa href="https://wa.me/{S["whatsapp"]}" target="_blank" rel="noopener">{S["telefonGoster"]}</a>')}{satir('🕘','Çalışma saatleri',S['calisma'])}</div>
<div class="kutu" style="font-size:14px;color:var(--soluk)">Formda yalnız ad, telefon, e-posta, tur, kişi sayısı, tarih ve notunuz istenir. Verileriniz yalnız talebinize dönüş yapmak için kullanılır.</div></aside></div>
<!-- Form yöntemi: Formsubmit (ajax) -> veri.js site.formEposta; ilk gönderimde Formsubmit bu adrese bir ONAY e-postası yollar, firma onaylamalı. Yedek: WhatsApp düğmesi (sunucu gerektirmez). -->'''
yaz('talep/index.html',ut.kabuk(V,'Bilgi / Rezervasyon Talebi','Fas Tur bilgi ve rezervasyon talep formu: tur, kişi sayısı ve tarih tercihinizi bırakın, size dönüş yapalım.','../','talep/',
 sp('Bilgi / rezervasyon talebi','Tur, kişi sayısı ve tarih tercihinizi bırakın; size dönüş yapalım.',[('Talep formu',None)],'../').replace('<h1>','<h1 data-i18n="talep.baslik">').replace('<p>Tur, kişi','<p data-i18n="talep.ozet">Tur, kişi')+talep,sayfa='talep'))

# ---------------- hukuki sayfalar
HK='<!-- FİRMA VE HUKUKÇU KONTROLÜ BEKLİYOR: bu metin eski fastur.com.tr sitesinden aynen taşındı (12.11.2026). Yayından önce firma ve hukukçu gözden geçirmelidir. -->\n'
legal=[('kisisel_verilerin_korunmasi','kisisel-verilerin-korunmasi','Kişisel Verilerin Korunması','','Fas Tur kişisel verilerin korunması (KVKK) politikası: işlenen veriler, amaçlar, saklama süresi ve haklarınız.'),
 ('gizlilik_sozlesmesi','gizlilik-sozlesmesi','Gizlilik Sözleşmesi','','Fas Tur gizlilik sözleşmesi: verilerinizin toplanması, kullanılması ve korunmasına ilişkin esaslar.'),
 ('kullanici_sozlesmesi','kullanici-sozlesmesi','Kullanıcı Sözleşmesi','<!-- DİKKAT: eski metinde "kayıt ve hesap" maddeleri var; yeni sitede üyelik/oturum açma YOK. Hukukçu bu maddeleri sadeleştirmeli. -->\n','Fas Tur kullanıcı sözleşmesi: siteyi kullanırken geçerli koşullar.'),
 ('tur_ve_otel_satis_sozlesmesi','tur-ve-otel-satis-sozlesmesi','Tur ve Otel Satış Sözleşmesi','','Fas Tur paket tur / tur ve otel satış sözleşmesi örneği.')]
for f,slug,ad_,ek,desc in legal:
    g=P['sayfalar'][f]
    g=re.split(r'<h3>(İçindekiler|Veri Sorumlusu|Site Sahibi)</h3>',g)[0]
    body=sp(ad_,P['sayfalar'][f+'_lead'],[(ad_,None)],'../')+f'<div class="dar"><div class="metin">{HK}{ek}{g}</div></div>'
    yaz(f'{slug}/index.html',ut.kabuk(V,ad_,desc,'../',f'{slug}/',body,sayfa='hukuki'))

# ---------------- 404, robots, favicon
k404='''<!doctype html>
<html lang="tr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Sayfa bulunamadı | Fas Tur</title><meta name="robots" content="noindex">
<style>
body{margin:0;min-height:100vh;display:grid;place-items:center;background:#fffaf3;color:#1f2a37;font:400 17px/1.6 system-ui,-apple-system,"Segoe UI",sans-serif;text-align:center;padding:24px}
h1{font:600 clamp(34px,7vw,64px)/1.1 Georgia,serif;color:#12385a;margin:12px 0}
p{color:#5b6776;max-width:480px;margin:0 auto 24px}
a{display:inline-block;padding:13px 24px;border-radius:999px;background:#f08a1c;color:#fff;text-decoration:none;font-weight:700;margin:4px}
a.g{background:none;border:2px solid #12385a;color:#12385a}
.logo{width:150px;height:auto}
</style></head>
<body><div>
<img class="logo" id="lg" alt="Fas Tur" src="">
<h1>Bu sayfa taşınmış olabilir</h1>
<p id="msj">Aradığınız sayfa yeni sitemizde bulunamadı ya da adresi değişti. Ana sayfadan veya turlar listesinden devam edebilirsiniz.</p>
<a id="ev" href="/">Ana sayfa</a><a id="tr" class="g" href="/turlar/">Turlar</a><a id="tl" class="g" href="/talep/">Talep formu</a>
</div>
<script>
/* Eski .php adreslerini yeni adrese yönlendirir. GitHub test adresinde (…github.io/fastur-web/) kök klasör farklıdır, alan adında '/' dir. */
(function(){
  var p=location.pathname, base=location.hostname.slice(-10)==='github.io' ? '/'+p.split('/')[1]+'/' : '/';
  document.getElementById('ev').href=base; document.getElementById('tr').href=base+'turlar/'; document.getElementById('tl').href=base+'talep/';
  document.getElementById('lg').src=base+'assets/img/genel/fastur-logo.png';
  var rel=p.slice(base.length), q=new URLSearchParams(location.search);
  var s=document.createElement('script'); s.src=base+'assets/js/eski-adresler.js';
  s.onload=function(){
    var E=window.ESKI||{}, hedef=null;
    if(rel==='tur_detay.php') hedef=E.tur[q.get('id')];
    else if(rel==='turlar.php') hedef=q.get('kategori_id') ? E.kategori[q.get('kategori_id')] : 'turlar/';
    else if(rel==='haber_detay.php') hedef=E.haber[q.get('id')] || 'haberler/';
    else if(E.sayfa && rel in E.sayfa) hedef=E.sayfa[rel];
    if(hedef!==null && hedef!==undefined) location.replace(base+hedef);
  };
  document.head.appendChild(s);
})();
</script></body></html>
'''
yaz('404.html',k404)
yaz('robots.txt','User-agent: *\nAllow: /\n\nSitemap: https://www.fastur.com.tr/sitemap.xml\n')
yaz('.nojekyll','')
yaz('assets/img/genel/favicon.svg','<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><circle cx="32" cy="32" r="30" fill="#12385a"/><circle cx="32" cy="32" r="22" fill="none" stroke="#f08a1c" stroke-width="4"/><path d="M32 8l5 20 20 4-20 4-5 20-5-20-20-4 20-4z" fill="#fff"/></svg>')
print('statik sayfalar yazıldı')
