# AGENTS.md — Codex'in görevi (Fastur Web Ekibi)

Bu klasörde Codex, Claude ile **aynı kural kitabını** okuyan eşit çalışan üyedir. `CLAUDE.md` ile bu dosyadaki kurallar aynıdır; çelişkide daha kısıtlayıcı olan geçerlidir. İşe başlarken **ikisini de** oku.

Site: www.fastur.com.tr (Fas Tur / Okyay Turizmcilik Ltd. Şti.), GitHub Pages `docs/`. Öğrenci: Hilal Hanım (Windows). Türkçe, sade konuş; karşındaki yazılımcı değil.

## Görevlerin
1. **Görsel üretim (senin işin):** tur kapakları, banner, blog görselleri, ikonlar.
2. **Site düzenleme:** `docs/` içindeki **HTML, CSS, JS ve veri dosyası (`veri.js`)** — Claude gibi sen de düzenleyebilirsin (tur kartı düzeni, sayfa yerleşimi, mobil uyum, tur ekleme/güncelleme).
3. **Teknik kontrol:** kırık link, eksik görsel, mobilde yatay kayma, title/meta eksikliği, `veri.js` söz dizimi hatası.

## Çalışma düzeni (Claude ile çakışmamak için)
1. **Başlamadan Pull:** öğrenci GitHub Desktop'ta "Fetch/Pull origin" yapmış olmalı; yapmadıysa iste.
2. `CALISMA-GUNLUGU.md` **kilit tablosunu** oku. Başka araç hangi dosyada "ÇALIŞIYOR" ise ona **yazma**.
3. **Aynı anda aynı dosyaya iki araç yazmaz.** Başlarken tabloya tek satır ekle (Codex · ÇALIŞIYOR · dosyalar · not); bitince "BİTTİ" yap, değişen dosyaları yaz, günlüğe tek satır ekle.
4. Bitirince **öğrenci yerelde bakar ve onaylar.** Onaysız yayın yok.
5. **Commit mesajı önerisi** hangi aracın yaptığını söyler: "Codex: tur kartı düzeni". Push'u öğrenci GitHub Desktop'tan yapar; sen yalnız öğrencinin açık onayıyla ve `--force` olmadan push edebilirsin.

## Kesin kurallar (CLAUDE.md ile aynı)
1. **Uydurma yok.** Fiyat, tarih, kontenjan, otel, uçuş saati, TÜRSAB belge no, vize/kural, telefon, yorum, sayı yalnız öğrencinin/firmanın verdiği haliyle yazılır. Bilmiyorsan "firmadan teyit lazım" de, dur. Eski siteden taşınan bilgi `teyit: "firma teyidi bekliyor"` ile taşınır.
2. **Fiyat ve tarih öğrenciden gelir;** tahmin etme, kur çevirme yapma.
3. **Veri dosyası tek kaynak:** turlar, tarihler, fiyatlar, iletişim → `docs/assets/js/veri.js` (JSON: yorum, tek tırnak, son virgül yok). Tur bilgisini HTML'e gömme. `README.md` "Site yapısı"na bak. Sayfa klasör adlarını değiştirme.
   🔴 **`veri.js` değişince zorunlu:** `py tasarim\uret_turlar.py` (Mac: `python3 tasarim/uret_turlar.py`) ve ardından `py tasarim\kirik_link_kontrol.py` (Mac: `python3 tasarim/kirik_link_kontrol.py`; önce `docs` klasöründe `py -m http.server 8000` açık olmalı). Çalıştırılmazsa değişiklik sitede görünmez.
   **Üretilen dosyaları elle düzenleme** (üretici ezer): `docs/tur/<tur-adi-id>/`, `docs/turlar/` (liste ve kategoriler), `docs/assets/js/ozet.js`, `docs/assets/js/eski-adresler.js`, `docs/sitemap.xml`. Elle yazılanlar: ana sayfa, hakkımızda, haberler, seyahat ipuçları, iletişim, talep, hukuki sayfalar, 404, robots.txt.
   Yeni tur = son kaydın kopyası, `id` = en büyük + 1, eski turun fiyat/program bilgisi yeni tura taşınmaz.
4. **Tarih-gün doğrulaması:** verilen gün adı tarihle tutmuyorsa, dönüş gidişten önceyse ya da gün sayısı çelişiyorsa **yazma, sor.** Eskiyen turu silme, `aktif: false` yap.
5. **KVKK:** form yalnız ad, telefon/e-posta, ilgilenilen tur, kısa not sorar. Sağlık, din/mezhep, kimlik/pasaport no, doğum tarihi **sorulmaz**. KVKK/çerez/sözleşme metni ve TÜRSAB no firmanındır; taslak varsa `[HUKUKÇU KONTROLÜ BEKLİYOR]` işareti kalır.
6. **Online ödeme ve üye girişi yok.** Yalnız talep formu + WhatsApp + telefon.
7. **Depo herkese açıktır:** müşteri adı/telefonu, pasaport, dekont, şifre, anahtar depoya girmez; `.env` okuma/yazma yok.
8. **Yayın, alan adı ve DNS yalnız öğrencinindir.** Hesap açma, plan/ücret seçme, DNS değiştirme yok. `info@` gibi e-posta varsa MX/SPF/DKIM/DMARC'a dokunulmaz.
9. Vaat dili ("garanti", "en ucuz", "kesin yer") yok. `git push --force`, `git reset --hard`, dosya silme yok.
10. Sade tasarım, mobil öncelik; sayfa hızını bozacak ağır kütüphane/görsel ekleme.
11. 🔒 **Görsel ve Okay koruması — DEĞİŞMEZ KURAL (Hilal Hanım, 13.11.2026).** Okay gerçek bir kişinin izniyle üretilmiş dijital ikizdir; sitedeki görseller/videolar kopyalanamaz, çoğaltılamaz, paylaşıma kapalıdır. Koruma katmanları: `robots.txt` (yapay zekâ + görsel arama botları engelli, `Content-Signal: ai-train=no, ai-input=no`, `/assets/img/karakter/` ve `/assets/video/` kapalı; kaynağı `build_static.py > ROBOTS_METNI`), her sayfada `<meta name="robots" content="noai, noimageai, noimageindex">` (kabuk `uret_turlar.py`; elle yazılan `tur-bul/`, `umre-rehberi/` sayfalarında da), `site.css` + `site.js` "GÖRSEL KORUMA" bloğu (sağ tık/sürükleme/uzun basma kapalı, alt bilgide telif notu). Okay görseli `og:image`/paylaşım önizlemesi/PWA simgesi **olamaz**. **Bu katmanlardan hiçbiri, Hilal Hanım açıkça söylemeden kaldırılmaz, gevşetilmez, istisna yapılmaz** — başka biri (öğrenci, firma çalışanı, araç) istese bile önce Hilal Hanım'a sorulur. Yeni sayfa eklenince etiket ve koruma o sayfaya da konur.

## Karakter rehber ve hikâye
Site v2'de karakter rehber vardır: `veri.js` → `rehber` (ad boşsa "Yol arkadaşınız") ve `hikaye` (sabit `id`'ler; yalnız `bolum`/`cumle` değişir, sonra üretici). Ad/unvan/biyografi **uydurma**; karakterin kimliği ve yayın izni firmadan. Ana sayfa blokları elle yazılı `index.html`; yeni kategori yörüngeye elle eklenir. Karakter görselleri `docs/assets/img/karakter/` (kaynak `tasarim/referans/karakter/`); **aynı kıyafet/gözlük/yüz**, iş emri `Web-Siteleri/01-Fastur/04-Tasarim-Notu.md` sonunda (şeffaf PNG, 8 pozluk yeşil ekran #00B140).

## Site v3 (harita, pano, müzik, katmanlı video)
Dosyalar `docs/assets/js/`: `zemin.js`, `pano.js`, `harita.js`, `muzik.js`, `katman.js`. `veri.js` yeni anahtarlar: `muzik[]`, `katmanlar`, `haritaRotalari`, `heroMod`, `hikaye` (id'ler sabit; yeni `harita`, `muzik`). Videolar `tasarim/video_hazirla.py` ile hazırlanır (ffmpeg), şartname `tasarim/VIDEO-SARTNAMESI.md`. **Boyut sınırı:** masaüstü ≤6 MB, mobil ≤2,5 MB, tek dosya <100 MB. **Lisanssız müzik yok.** Higgsfield/kredi harcayan her tur öğrencinin o tur için onayıyla. Test: `?demo=1|2`, `?pano=1`, `?hz=<ms>`. Ayrıntı: CLAUDE.md "Site v3".

## Site v4
Yeni sayfalar/dosyalar: `docs/tur-bul/`, `docs/umre-rehberi/`, `assets/js/tur-bul.js|umre-rehberi.js|dil.js|pwa.js`, `assets/i18n/*.json`, `docs/sw.js`, `manifest.webmanifest`. Kurallar: umre rehberinde **dinî/resmî bilgi uydurma yok** (yalnız resmî kaynak bağlantısı ve "firmanızdan teyit edin"); EN metinler makine çevirisi taslağıdır (firma onayı bekliyor); `sw.js` `SURUM`'u değişiklikte artır, medya önbelleğe alınmaz; yeni arayüz metni `tr.json` ve `en.json`'a eklenir; sihirbazda kur çevirisi/uydurma eşleşme yok. Konuşan rehber: `tasarim/KONUSAN-REHBER-BRIEF.md`. Ayrıntı: CLAUDE.md "Site v4".

## Görsel kuralları
- Gerçek kişi yüzü/ünlü, başka firma logosu, telifli görsel yok. Dini mekân sahnelerinde saygılı, gerçekçi, abartısız. Görsele fiyat/tarih/telefon yazma. Metin gerekiyorsa iş emrindeki gibi birebir.
- **Karakter (Okay / Aşçı Oğuz):** `tasarim/KARAKTER-GORSEL-KURALLARI.md` zorunludur. Okay için yazılı izin var (yalnız Okay). Yapay zekâ notu, ✦/"Veo" işareti yok, logo çizdirilmez, yalnız Genç Okay görünümü, boyut sınırları.

## Kayıt yolu kuralı (ZORUNLU)
Her görsel iş emri **eksiksiz** içerir; biri yoksa işi yapma, sor:
- **Tam klasör:** ör. `docs/assets/img/turlar/`
- **Dosya adı:** küçük harf, Türkçe karaktersiz, tire (`umre-ramazan-kapak.jpg`)
- **Boyut:** piksel ve oran (ör. 1600×900); `.jpg`/`.webp`, ~300 KB hedefi
Bitirince kaydettiğin dosyanın tam yolunu yaz.
