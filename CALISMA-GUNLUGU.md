# Çalışma günlüğü — Claude ve Codex ortak dosyası

> Bu dosya **GitHub'a gider** (iki araç ve iki bilgisayar görsün diye). **Şifre, anahtar, kişisel veri, müşteri bilgisi yazılmaz.** Bilinmeyen `[?]`.
> Silinmez; yalnız satır eklenir ve kendi satırının durumu güncellenir.

## Kilit tablosu (kim hangi dosyada çalışıyor)
İşe başlarken **önce Pull**, sonra bu tabloya bak. Başka aracın "ÇALIŞIYOR" yazdığı dosyaya **yazma**; bekle ya da öğrenciye söyle. Başlarken tek satır ekle, bitirince "BİTTİ" yaz ve değişen dosyaları listele.

| Tarih saat | Araç (Claude/Codex) | Durum | Dosyalar | Not |
|---|---|---|---|---|
| 12.11 · Claude | BİTTİ | tasarim/build_static.py, tasarim/uret_turlar.py, docs/index.html, docs/assets/js/derinlik.js (yeni), docs/assets/js/katman.js, docs/assets/css/site.css, docs/sw.js | ana sayfa zoom-through parallax · yayın onayı bekliyor |
| 13.11 · Codex | BİTTİ | docs/assets/img/turlar/urdun-turu-kapak.jpg, docs/assets/img/turlar/vietnam-kambocya-laos-tayland-kapak.jpg | İki tur kapağı üretildi; 1600×900 JPEG |

Örnek: `13.11 14:05 · Codex · ÇALIŞIYOR · docs/assets/css/site.css · tur kartı düzeni` → bitince `BİTTİ · site.css, docs/index.html`

## Kalıcı kararlar
- Koordinatör adı: `[?]` (öğrenci verirse CLAUDE.md'deki satır değişir)
- Online ödeme ve üye girişi yok; talep formu + WhatsApp + telefon.
- 12.11.2026 · Hilal Hanım: commit + push'u araç (Claude) otomatik yapar; istenen değişiklik onay sayılır. İstisna: fiyat/tarih/TÜRSAB/hukuki/firma onaylı içerikte göndermeden önce sorulur. `--force` asla. Commit mesajı "Claude: ..." / "Codex: ..." biçiminde.

- 12.11.2026 · Hilal Hanım: ana sayfadaki rehber karakterin adı **Okay**. Ekip kendi aramızda "Okay" der. Sitede (veri.js rehber.ad) gösterilmesi Hilal Hanım/firma onayına bağlı; şu an "[?]" (sitede "Yol arkadaşınız").

- 12.11.2026 · Hilal Hanım: gündüz/gece modu KALIR. Gündüz modunda tur detay sayfasında yazılar siyah. (Kapatma anahtarı: pano.js GUNDUZ_ACIK + uret_turlar.py <head> betiği.)

- 13.11.2026 · Hilal Hanım: eski 89 tur 2027'ye taşındı (haftanın günü korunarak), "Güncel" gösterilir ama eski fiyat gizli (veri.js tur alanı `fiyatOnceki: true` → kartta "arayın", detayda "önceki dönem" notu). Firma 2027 fiyatını verince o turda `fiyatOnceki` silinir, fiyat güncellenir.

- 13.11.2026 · Yönetim paneli (rezervasyon/misafir/tur takibi) claude.ai'de özel sayfa: https://claude.ai/artifact/NQQPXRtXngepKUkdwEttL2 · kayıtlar panelin kendi veritabanında, yalnız sahip + Editör okur/yazar; kaynak panel/fastur-panel.html (depoya girmez). Müşteri verisi GitHub'a ASLA girmez.
- 13.11.2026 · Burak Tur turları: Hilal Hanım yazılı izin olduğunu söyledi; buraktur.com robots.txt yapay zekâ ile toplu içerik almayı sınırlıyor (ClaudeBot engelli, use=reference) → otomatik kopyalama yapılmadı. Veri Burak Tur'dan dosya/XML olarak ya da Hilal Hanım'ın ilettiği metinle girilecek.

- 13.11.2026 · Hilal Hanım: Okay/Aşçı Oğuz görsel ve videoları `tasarim/KARAKTER-GORSEL-KURALLARI.md`'ye uyar (yapay zekâ notu zorunlu, ✦/"Veo" işareti yok, logo çizdirilmez, yalnız Genç Okay görünümü).

- 13.11.2026 · Hilal Hanım: Umre/Hac şimdilik YAPILMIYOR → sitede gizli (veri.js site.umreGoster:false). Silinmedi; sayfalar noindex, menü/arama/sitemap dışı. Geri açmak: umreGoster:true + iki üretici + tr/en.json ana.alt, hak.ozet. Hilal Hanım açmadıkça Umre/Hac içeriği eklenmez.

## Günlük (kronolojik, tek satır)
`GG.AA.YYYY · araç · ne yapıldı · dosya`
12.11.2026 · Claude · Ana sayfa scrollytelling: 7 hikâye durağı, derinlik katmanları (arka görsel/katman videosu, orta ışık, ön kemer), telefonda hafif, hareketi azalt'ta durağan; sw SURUM fastur-v3; üretici Windows'ta LF yazar · derinlik.js, site.css, build_static.py, uret_turlar.py
12.11.2026 · Claude · Mobil ilerleme çubuğundaki uçak büyütüldü (34px, yuvarlak zemin, başlık altında kalmıyor, kenarda taşmıyor); sw SURUM fastur-v4 · site.css, ucus.js, sw.js
12.11.2026 · Claude · Okay (ana sayfa karakteri) büyütüldü: masaüstü min(62vh,560px), mobil 310px; sw SURUM fastur-v5 · site.css, sw.js
12.11.2026 · Claude · Okay'a dosyasız canlılık hareketi: yandan süzülerek giriş + 6 sn nefes/ağırlık aktarma + gölge; hareketi azalt'ta durur; sw SURUM fastur-v6 · site.css, sw.js
12.11.2026 · Claude · Yeni tur: Fas'ın Renkleri (id 91, aktif, her hafta perşembe) — kaynak Pazarlama-AI-Ekibi/knowledge/urunler-teklifler.md (Hilal, 28.10.2026); görsel tur 44'ün firma görseli; vize alanı boş (bilgi yok). Tur şemasına isteğe bağlı `tekrar` alanı (düzenli kalkış) eklendi · veri.js, uret_turlar.py, site.js, pano.js, sw.js (fastur-v7) · Hilal Hanım onayladı: fiyatlar güncel, vize "Vizesiz"
12.11.2026 · Claude · Gündüz/gece modu pasif: site hep gece, ☀/☾ düğmesi (HUD + mobil pano) kaldırıldı; tur programı okunur; sw fastur-v8 · pano.js, uret_turlar.py, tüm üretilen sayfalar
12.11.2026 · Claude · Gündüz modu geri açıldı (Hilal Hanım vazgeçti); gündüzde tur detayı: Tur programı başlığı + akordeon siyah yazı/açık kart, Benzer turlar başlığı siyah; sw fastur-v9 · site.css, pano.js, uret_turlar.py, üretilen sayfalar
13.11.2026 · Claude · 89 tur 2027'ye taşındı (haftanın günü korundu, süre aynı), aktif:true + fiyatOnceki:true; 8 turun program içi tarihleri aynı kaydırmayla güncellendi (45,49,64,67,69,71,74,85), tur 69 buluşma yılı yazım hatası düzeltildi (21 Mart 2027 Pazar); üreticiye fiyatOnceki desteği; sw fastur-v10 · veri.js, uret_turlar.py, üretilen sayfalar · NOT: aynı ad+tarihe düşen 3 çift (Tunus 14.10.2027, Büyük Mısır Nil 21.04.2027, Umre Ekonomik Yakın Servisli 27.01.2027) firmaya sorulacak
13.11.2026 · Claude · İkinci telefon/WhatsApp (0532 356 69 59) eklendi: veri.js site.telefon2/telefon2Goster/whatsapp2; iletişim, talep, hakkımızda, tur yan kutusu, alt bilgi, pano, JSON-LD · veri.js, uret_turlar.py, build_static.py, site.js, pano.js
13.11.2026 · Claude · Hilal Hanım isteği: Fas'ın Renkleri (91) dışındaki 89 tur veri.js'ten ve docs/tur/'dan silindi (tur görselleri assets/img/turlar'da duruyor; geri almak için git geçmişi 441245f); sw fastur-v11 · veri.js, docs/tur/*, üretilen listeler
13.11.2026 · Claude · Karakter görsel/video kural kitabı yazıldı (yapay zekâ notu, ✦/"Veo" işareti, logo, Genç Okay kimliği, kıyafet, ülke geçişi, boyut, yayın öncesi kontrol); briefler ve AGENTS/CLAUDE buna bağlandı. Siteye görsel eklenmedi; site için hazırlanan dosyalar depo dışında (Hilal Hanım masaüstü SITE-HAZIR) · tasarim/KARAKTER-GORSEL-KURALLARI.md (yeni), VIDEO-SARTNAMESI.md, KONUSAN-REHBER-BRIEF.md, .claude/agents/fastur-gorsel-brief.md, AGENTS.md, CLAUDE.md
13.11.2026 · Claude · Yönetim paneli yayınlandı (taslak FASTUR-Panel-Taslak.html görünümüyle; Panel/Rezervasyonlar/Turlar/Misafirler/Raporlar, CSV indirme); Fas'ın Renkleri panel tur listesine eklendi · panel/ (gitignore)
13.11.2026 · Claude · İkinci numara (0532 356 69 59) yalnız WhatsApp bağlantısı (arama yok); 🔒 görsel/Okay koruması: robots.txt (AI + görsel botları engelli), tüm sayfalarda noai/noimageai/noimageindex, sağ tık/sürükleme/uzun basma kapalı, telif notu; CLAUDE.md/AGENTS.md madde 11 (DEĞİŞMEZ KURAL); sw fastur-v12 · build_static.py, uret_turlar.py, site.css, site.js, pano.js, tur-bul/, umre-rehberi/, CLAUDE.md, AGENTS.md
13.11.2026 · Claude · Panel v2: kontenjan kontrolü (formda canlı kalan yer, aşımda kayıt engellenir, bilinçli onay kutusuyla geçilir; panelde kırmızı aşım uyarısı), tahsilat (Tahsil edilen / Bekleyen tahsilat kartları, Kalan sütunu, aylık tahsilat), rezervasyonda e-posta ve kalkış tarihi zorunlu · panel/fastur-panel.html (claude.ai)
13.11.2026 · Claude · Tur Takvimi sayfası (docs/tur-takvimi, takvim.js; haftalık kalkışlar 12 hafta ileri hesaplanır, durum takvimDurum ya da Sorunuz) + ana sayfa Tur Takvimi bandı (firma görselleri kolajı) + pano grupları; kategoriler 15→41, 6 grup (Burak Tur menü yapısı referans; mevcut slug'lar korundu); derinlik.js tüm sayfalarda (giriş sahnesi + bölümler); tur yan kutusu: 2 WhatsApp + arama tek satır; tüm WhatsApp bağlantılarında 'Merhaba, bilgi almak istiyorum.'; müzik oynatıcı dikey; rota haritasında gün yazısı yok; Samsung titremesi için color-scheme + ilk zemin rengi; sw fastur-v13 · veri.js, uret_turlar.py, build_static.py, site.css, site.js, pano.js, derinlik.js, takvim.js, tur-harita.js, tur-bul/, umre-rehberi/
13.11.2026 · Claude · Umre/Hac gizlendi (umreGoster false): ana sayfa Umre bölümü, yörünge, hızlı bağlantı, alt başlık, başlık/açıklama, menü grubu, Umre rehberi bağlantısı, arama kategorileri, sitemap; sayfalar noindex; sw fastur-v14 · veri.js, uret_turlar.py, build_static.py, pano.js, tr.json, en.json, umre-rehberi/
13.11.2026 · Claude · Burak Tur PDF'inden Japonya & Güney Kore Turu eklendi (id 92–95, 4 kalkış, USD, takvimDurum müsait); Hilal Hanım: 29.03 ve 20.04 dönüşleri +1 gün, dahil listesi esas (7 akşam yemeği), vize 'Vizesiz' (MFA: Kore 90 gün muaf + K-ETA notu); görsel eski Fas Tur Japonya görseli; takvim filtresi aynı adlı kalkışları birleştirir; sw fastur-v15 · veri.js, takvim.js
13.11.2026 · Claude · Burak Tur PDF'lerinden hazırlandı (Hilal Hanım onayladı 13.11.2026): Büyük Mısır (96–100), Hindistan (101–102), Ürdün (103–104, geçici SVG kapak), Vietnam-Kamboçya-Laos-Tayland (105, geçici SVG kapak). Hindistan'da Burak Tur'a ait 'hiçbir misafirimizin başvurusu reddolmamıştır' vaadi çıkarıldı. Malezya-Singapur-Bali: fiyat/tarih PDF'i yok, eklenmedi · veri.js, assets/img/turlar/yer-tutucu-*.svg
13.11.2026 · Claude · Singapur, Malezya ve Bali Turu eklendi (106–107, fiyat PDF'i geldi); Ürdün vize 'Vizesiz' (Hilal Hanım); Codex görsel iş emri: hafiza/gorsel-is-emri-2026-11-13-urdun-uzakdogu.md (Ürdün + Uzak Doğu kapakları, docs/assets/img/turlar/, 1600×900); 5 tur yayına alındı; sw fastur-v16 · veri.js
13.11.2026 · Codex · Ürdün (Petra) ve Vietnam-Kamboçya-Laos-Tayland (Ha Long Bay) tur kapakları üretildi; 1600×900 JPEG, sırasıyla 359 KB ve 318 KB · docs/assets/img/turlar/urdun-turu-kapak.jpg, docs/assets/img/turlar/vietnam-kambocya-laos-tayland-kapak.jpg
13.11.2026 · Claude · Singapur-Malezya-Bali vize: 'Singapur ve Malezya vizesiz; Endonezya (Bali) varışta vize' + teyit notu (Hilal Hanım 'olur'). Bosna Hersek Turu hazırlandı (10 kalkış, EUR, vize Vizesiz, eski Fas Tur Bosna görseli) — YAYIN ONAYI BEKLİYOR; onaya kadar veri.js'ten çıkarıldı, tanım: scratchpad tur-bosna.json (tur_ekle_genel.py ile eklenir). 'Büyük Mısır 2027' PDF'i yayındaki Mısır turuyla aynı tarih/fiyat → eklenmedi (çift kayıt) · veri.js
13.11.2026 · Claude · Rotalar menüsü yeniden: açık renkli mega menü (Burak Tur menüsü referans; gruplar büyük başlık, ülkeler + tur sayısı, hızlı bağlantılar, kurumsal alt satır); Codex görselleri Ürdün (urdun-turu-kapak.jpg) ve Uzak Doğu (vietnam-kambocya-laos-tayland-kapak.jpg) turlarına bağlandı, geçici SVG'ler silindi; Malezya vize notu; sw fastur-v17 · pano.js, site.css, veri.js
13.11.2026 · Claude · Tur Takvimi açık tablo (Burak Tur takvimi referans: beyaz tablo, siyah ay bandı, renkli durum, 'Tur detayı' sütunu); sw fastur-v18 · site.css, uret_turlar.py
13.11.2026 · Claude · Bosna Hersek Turu yayına alındı (Hilal Hanım: 'bosnayı gönder'; 10 kalkış, EUR, Vizesiz); sw fastur-v19 · veri.js
13.11.2026 · Claude · Rotalar menüsü sadeleşti: yalnız turu olan ülkeler, tur sayıları kaldırıldı, boş gruplar gizli (Hilal Hanım); sw fastur-v20 · pano.js
13.11.2026 · Claude · Rotalar menüsünde yalnız tek sıra: Tur takvimi, Tüm turlar, Bana uygun turu bul, Talep bırak (Hilal Hanım). Ülke grupları ve kurumsal satır kodda hazır, gösterilmiyor; sw fastur-v21 · pano.js

- 13.11.2026 · Claude · Rotalar menüsü tek sıra ortada, büyük punto. Paneldeki durumlar siteye aktarıldı: yeni alan takvimTarihDurum (tarihe özel durum, takvim.js + ozet.js). Fas'ın Renkleri 19.11.2026 kalkışı panelde 22 kişi / 20 kontenjan, 'kapali'. sw fastur-v22.

- 13.11.2026 · Claude · Slogan Fas • Mısır • Balkanlar • Asya. Üst çubukta logo ve Rotalar büyüdü. Fas’ın Renkleri tüm haftalar Müsait (19.11 kapanışı denemeydi, kaldırıldı). Panele 26 site turu eklendi (turlar koleksiyonu, siteId/siteSlug alanı); panel Fas fiyatı 899 EUR. Eşleme: panel satista=Müsait, son=Sorunuz, kapali=Satışa kapandı. sw fastur-v23.

- 14.11.2026 · Claude · HATA DÜZELTME: derinlik.js boş arka katmana bos sınıfı veriyordu; site.css .bos (boş liste kutusu) gündüz modunda koyu lacivert boyadığı için telefonda bölümler koyu, yazılar okunmaz oluyordu. Sınıf dp-bos yapıldı. Telefonda Okay kaydırınca soldurulmuyor. Panel: siteye aktarım hatırlatıcısı (ayarlar/aktarim imzası), aktarım betiği panel/aktar.py (depoya girmez). sw fastur-v24.

- 14.11.2026 · Claude · Telefonda eski stil dosyası + yeni sayfa karışması: sw.js stil/kod için önce ağ; tüm HTML css/js adreslerine ?v=<içerik özeti> (uret_turlar.surum_damgala, build_static sonunda da çağrılır). sw fastur-v25.
