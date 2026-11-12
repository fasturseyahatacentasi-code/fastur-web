# Fastur Web Ekibi — www.fastur.com.tr

Fas Tur (Okyay Turizmcilik Ltd. Şti.) web sitesinin yeni, statik hâli ve onu yöneten ekip.

- **Yayın:** GitHub Pages, `main` dalı, `docs/` klasörü
- **Yapı:** Sade HTML + CSS + JavaScript; derleme gerekmez. `docs/index.html` çift tıklayınca da açılır.
- **Veri:** Turlar, tarihler, fiyatlar, iletişim bilgisi → `docs/assets/js/veri.js` (tek yer; sonra `uret_turlar.py` çalıştırılır)
- **Ödeme / üye girişi:** yok. Talep formu + WhatsApp + telefon.
- **Başlamak için:** `BASLA-BENI-OKU.md`

## Site yapısı
```
docs/                           (GitHub Pages bunu yayınlar)
  index.html                    ana sayfa (elle)
  hakkimizda/ haberler/ seyahat-ipuclari/ iletisim/ talep/ (elle)
  gizlilik-sozlesmesi/ kisisel-verilerin-korunmasi/ kullanici-sozlesmesi/ tur-ve-otel-satis-sozlesmesi/  (hukuki, elle; hukukçu kontrolü)
  404.html  robots.txt          (elle)
  turlar/                       ÜRETİLİR: tüm turlar listesi + turlar/<kategori>/
  tur/<tur-adi-id>/             ÜRETİLİR: her tur için sayfa
  sitemap.xml                   ÜRETİLİR
  assets/js/veri.js             TEK VERİ DOSYASI (elle düzenlenen; JSON)
  assets/js/ozet.js             ÜRETİLİR (menü, iletişim, yaklaşan turlar özeti)
  assets/js/eski-adresler.js    ÜRETİLİR (eski adresleri yeni adrese yönlendirir; 404 kullanır)
  assets/js/site.js  assets/css/site.css   ortak kod ve stil
  assets/img/turlar/            tur görselleri
  tur-bul/  umre-rehberi/       v4: sihirbaz ve umre hazırlık rehberi (elle)
  manifest.webmanifest  sw.js   PWA (çevrimdışı; video/ses önbelleğe alınmaz)
  assets/js/tur-bul.js umre-rehberi.js dil.js pwa.js   v4 betikleri
  assets/i18n/                  tr.json en.json (makine çevirisi taslağı) ar.json (iskelet)
  assets/img/pwa/               uygulama ikonları
  assets/js/zemin.js pano.js harita.js muzik.js katman.js   v3: arka plan, kalkış panosu menü, giriş haritası, ambient müzik, katmanlı video
  assets/img/harita/            harita verisi (Natural Earth, kamu malı)
  assets/video/                 katman videoları (_demo/ demo)
  assets/img/karakter/          karakter rehber görselleri (şeffaf PNG, pozlar)
tasarim/                        GitHub'a girer (yalnız tasarim/_kontrol/ girmez)
  uret_turlar.py                veri.js -> yukarıdaki ÜRETİLENLER
  kirik_link_kontrol.py         kırık link/görsel denetimi
  ESKI-SITE-ENVANTERI.md        eski sitenin dökümü
  video_hazirla.py  harita_uret.py  VIDEO-SARTNAMESI.md   video hazırlama (ffmpeg), harita üretimi, şartname
  referans/karakter/            karakter görsellerinin kaynakları (depoya girer)
```
**Site v2:** koyu fütüristik, karakter rehberli hikâye. `veri.js`'de `rehber {ad, unvan, not}` (ad boş/`[?]` ise "Yol arkadaşınız") ve `hikaye [{id, bolum, cumle}]` (id'ler sabit: yola-cikis, yorunge, umre, fas, dunya, sira-sizde, asistan; yalnız bolum/cumle değişir). Ana sayfa blokları (hero, yörünge, bölümler) elle yazılı `index.html`; yeni kategori yörüngeye elle eklenir. Karakterin kimliği ve yayın izni firmadan.

**Site v3:** giriş haritası, split-flap kalkış panosu menü, rota sesleri (üretilen ambient), katmanlı video altyapısı. `veri.js`: `muzik[]`, `katmanlar`, `haritaRotalari`, `heroMod` ("harita"|"video"). Test adresleri: `?demo=1|2`, `?pano=1`, `?hz=<ms>`. Video sınırları: masaüstü ≤6 MB, mobil ≤2,5 MB, dosya <100 MB. Ayrıntı CLAUDE.md "Site v3".

**Site v4:** "Bana uygun turu bul" sihirbazı, umre hazırlık rehberi (kontrol listesi), TR/EN dil altyapısı (AR iskelet), PWA ve konuşan rehber brief'i (`tasarim/KONUSAN-REHBER-BRIEF.md`). Umre rehberinde resmî bilgi uydurulmaz; EN çeviriler firma onayı bekliyor. Ayrıntı CLAUDE.md "Site v4".

**Güncel (v4 entegrasyon):** ana sayfa kabuğu `build_static.py` ile, tur/liste/sitemap `uret_turlar.py` ile üretilir; kabuk değişirse ikisi de çalıştırılır. Yeni JS: `sehirler.js` (şehir koordinatları, uydurma yok), `tur-harita.js`, `ucus.js`; gün/gece modu; `veri.js > anilar[]` yalnız `izin:"var"` gösterilir; sesli rehber `--sesli`; `sw.js` `SURUM` her önemli değişiklikte artar.

**Kural:** `veri.js` değişince `py tasarim\uret_turlar.py` (Mac: `python3 tasarim/uret_turlar.py`), sonra `py tasarim\kirik_link_kontrol.py` (Mac: `python3 tasarim/kirik_link_kontrol.py`; önce `docs` klasöründe `py -m http.server 8000` açık olmalı). ÜRETİLEN dosyalar elle düzenlenmez. Python 3.9+ gerekir.
Alan adı belli olunca `site.alanAdi` (veri.js), üretici ve `robots.txt` elle güncellenir.
**İlk durum:** 89 turun hepsi geçmiş tarihli (`aktif:false`); site ilk gün "önceki dönem programı" gösterir. Firma yeni dönemi verince eklenir.

## Ekip
Koordinatör (ana sohbet, `CLAUDE.md`; adı `[?]`) ve 5 uzman (`.claude/agents/`):

| Agent | İşi |
|---|---|
| `fastur-icerik-seo` | Metin, başlık/açıklama, blog |
| `fastur-tur-veri` | Turları veri dosyasına ekler/günceller, tarih-gün doğrular |
| `fastur-tasarim-kod` | HTML/CSS/JS, mobil, form |
| `fastur-yayin-kontrol` | Yayın öncesi liste, KVKK/hukuki işaret, telefon |
| `fastur-gorsel-brief` | Codex'e görsel iş emri |

**Codex** ekibin eşit çalışan üyesidir: Claude gibi `docs/` içindeki HTML/CSS/JS ve veri dosyasını düzenleyebilir; görsel üretimi Codex'tedir (`AGENTS.md`). Aynı dosyaya aynı anda yazmazlar (`CALISMA-GUNLUGU.md`). Ortak çalışma günlüğü ve kilit tablosu: `CALISMA-GUNLUGU.md` (GitHub'a girer).

## Komutlar (Claude Code'da)
| Komut | Ne yapar |
|---|---|
| `/basla` | Kaldığın adımdan devam / web modunda karşılama |
| `/tur-ekle` | Tur ekle/güncelle (tarih-gün doğrulamalı, üretici dahil) |
| `/video-ekle` | Higgsfield klibini sisteme ekle |
| `/yayin-kontrolu` | Yayın öncesi kontrol listesi |

## GitHub'a girmeyenler (`.gitignore`)
`kurulum/` · `hafiza/` (yerel görsel iş emirleri) · `tasarim/_kontrol/` · `.env` · sistem artıkları. `tasarim/` içindeki üretici ve kontrol betikleri **depoya girer** (ikinci bilgisayar ve Codex üretebilsin); yalnız `tasarim/_kontrol/` (ekran görüntüleri) girmez.

Not: Resmî metinler (KVKK, çerez, paket tur sözleşmesi) ve TÜRSAB belge numarası firmanındır; hukukçu kontrolünden geçer.
