# Konuşan rehber video — brief (Hilal Sevindik için)

> Taslak · 12.11.2026 · **Bu belge üretim DEĞİLDİR.** Hiçbir video üretilmedi; Higgsfield'de kredi harcayan her tur **sizin o tur için onayınızla** başlar. Abonelik sizdedir.
> **Kurallar:** `tasarim/KARAKTER-GORSEL-KURALLARI.md` bu brief'ten önce gelir (yapay zekâ notu, ✦/"Veo" işareti, Genç Okay kimliği, kıyafet, boyut). Çelişkide o dosya geçerlidir.
> Amaç: sitedeki karakter rehber, bölüm başlarında kısa (en çok 8 sn) bir cümle söylesin. Replikler `veri.js` içindeki `hikaye` cümleleridir; metni değiştirmek isterseniz önce `hikaye`'yi değiştirin, klip onunla çekilsin.

## 0. Başlamadan önce karar verilecekler (firmadan / sizden)
1. **Karakter kimdir?** Kurgu karakter mi, gerçek bir kişinin (örn. sizin ya da çalışanın) görüntüsü mü? Gerçek kişiyse **yazılı izin** gerekir. Ad ve unvan `[?]`, uydurulmaz.
2. **Ses kimin?** Kendi sesiniz mi, ElevenLabs gibi bir hizmetin sesi mi? Kendi sesiniz ya da başkasının sesi için **ses izni**; hizmet sesinde o hizmetin ticari kullanım koşulu. Ünlü taklidi yok. `[?]`
3. **Firma onayı:** metinler (replikler) firmaca onaylı mı? Fiyat/tarih/vaat içeren cümle yok.
4. **Site tarafı (web uzmanı):** mevcut video hattı sesi atar (`-an`) ve klibi sessiz döngüde oynatır. Konuşan klip için sitede **sesli oynatma + "dinle" düğmesi + döngüsüz oynatma** gerekir; bu yapılmadan klibi eklemeyin (sessiz oynarsa replik boşa gider).

## 1. Klipler (bölüm · replik · süre)
Replikler `veri.js > hikaye[].cumle` ile aynıdır (kelime sayısı konuşma hızına göre ≈ 8 sn altı).

| # | Bölüm id | Klip adı | Replik (Türkçe) | Hedef süre |
|---|---|---|---|---|
| 1 | `yola-cikis` (hero karşılama) | `yola-cikis-on.mp4` | "Nereye gitmek istediğinizi söyleyin, programı ve güncel bilgiyi birlikte netleştirelim." | 6–8 sn |
| 2 | `yorunge` | `yorunge-on.mp4` | "Bir destinasyona dokunun, o rotanın turları açılsın." | 4–5 sn |
| 3 | `umre` | `umre-on.mp4` | "Ekonomik, yürüme mesafeli ve 5 yıldızlı umre programlarına birlikte bakalım." | 6–8 sn |
| 4 | `fas` | `fas-on.mp4` | "Fas turlarıyla yola çıktık: Kazablanka, Marakeş, Fes ve daha fazlası." | 6–7 sn |
| 5 | `sira-sizde` | `sira-sizde-on.mp4` | "Formu doldurun ya da WhatsApp'tan yazın; ekibimiz size dönüş yapsın." | 6–7 sn |

Not: `umre` klibinde dinî terim/ibadet anlatımı yok; yalnız program türleri. Ek cümle eklenecekse firmaya sorulur.

## 2. Higgsfield ayarları (her klip için)
- **Oran:** 9:16 · **çözünürlük:** en az 720×1280, tercihen 1080×1920 · **süre:** replik + ~1 sn pay (en çok 8 sn)
- **Zemin:** düz **#00B140 yeşil ekran**, eşit ışık, gölge/kırışık yok; karakter yeşile yakın renk giymez
- **Kamera:** SABİT (zoom/pan yok); karakter çerçevede tam, baş ve ayaklar kesilmez
- **Kimlik tutarlılığı:** her klipte aynı yüz, **aynı kıyafet ve aynı gözlük**, aynı saç. Referans görseller: tam boy + portre (`tasarim/referans/karakter/` ve `docs/assets/img/karakter/`). Her istemde aynı kıyafet/gözlük tarifini kelimesi kelimesine tekrarlayın.
- **Ses:** AÇIK. Yazı, logo, filigran yok.
- **Hareket:** doğal konuşma, hafif el hareketi, göz teması; abartılı oynama yok.

## 3. Dudak senkronu ipuçları
- **Replik istemin içinde yazılı olsun**, tırnak içinde, Türkçe, noktalama ile ("…Marakeş, Fes ve daha fazlası.").
- Replik klibin tüm süresine yayılsın: cümle bitince kısa bir sessiz bekleme (~0,5 sn) bırakın; kısa cümleyi uzun klibe sıkıştırmayın, klip süresini cümleye uydurun.
- Ağız açık/kapalı net olsun: "ağzı görünür, yüzü kameraya dönük, sabit" yazın.
- Sorunlu kelimeler (yabancı özel adlar) için istemde okunuşu parantezle verin: "Kazablanka (ka-za-blan-ka)".
- **Ses kaynağı:** (a) Higgsfield'in kendi sesi ya da (b) önceden hazırlanmış kayıt (kendi sesiniz/ElevenLabs) yüklenip klibe bağlanır. Hangisi olursa olsun **izin ve lisans yukarıda (madde 0) netleşmeden** üretmeyin. Ses dosyasının adına kaynağı yazın (örn. `yola-cikis-ses-elevenlabs.mp3`).
- Bozuk çıkan klibi aynı istemle tekrar üretmek yeni kredi harcar: önce **tek klip** (1 numara) deneyin, beğenirseniz diğerlerine geçin.

## 4. Sistemle bağlama (`/video-ekle`)
1. Klibi indirin; ham dosyayı depo dışında tutun (büyük dosya GitHub'a girmez).
2. Claude Code'da `/video-ekle` deyin (ffmpeg gerekir; kurulum notu `kurulum/ADIMLAR.md` W8).
3. `py tasarim\video_hazirla.py <klip> --bolum <id> --katman on --yesil` → boyut raporu (masaüstü ≤6 MB, mobil ≤2,5 MB) → JSON'u `veri.js > katmanlar > bolumler > <id> > on` içine koyun.
4. **Ses ve döngü:** hat sesi atıyor; sesli konuşan klip için önce web uzmanının sesli oynatma desteği gelmeli (madde 0/4).
5. `py tasarim\uret_turlar.py`, link kontrolü, tarayıcıda (masaüstü + telefon) bakın, onaylayın; commit: "Claude: <bölüm> konuşan rehber klibi"; Push'u siz yaparsınız.

## 5. Onay kutuları
- [ ] Karakter kimliği ve yayın izni (firma / kişi)
- [ ] Ses kaynağı ve izni
- [ ] Repliklerin firma onayı
- [ ] Higgsfield tur 1 (tek klip) onayı
- [ ] Site sesli oynatma desteği hazır
