# Çalışma günlüğü — Claude ve Codex ortak dosyası

> Bu dosya **GitHub'a gider** (iki araç ve iki bilgisayar görsün diye). **Şifre, anahtar, kişisel veri, müşteri bilgisi yazılmaz.** Bilinmeyen `[?]`.
> Silinmez; yalnız satır eklenir ve kendi satırının durumu güncellenir.

## Kilit tablosu (kim hangi dosyada çalışıyor)
İşe başlarken **önce Pull**, sonra bu tabloya bak. Başka aracın "ÇALIŞIYOR" yazdığı dosyaya **yazma**; bekle ya da öğrenciye söyle. Başlarken tek satır ekle, bitirince "BİTTİ" yaz ve değişen dosyaları listele.

| Tarih saat | Araç (Claude/Codex) | Durum | Dosyalar | Not |
|---|---|---|---|---|
| 12.11 · Claude | BİTTİ | tasarim/build_static.py, tasarim/uret_turlar.py, docs/index.html, docs/assets/js/derinlik.js (yeni), docs/assets/js/katman.js, docs/assets/css/site.css, docs/sw.js | ana sayfa zoom-through parallax · yayın onayı bekliyor |

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
13.11.2026 · Claude · Yönetim paneli yayınlandı (taslak FASTUR-Panel-Taslak.html görünümüyle; Panel/Rezervasyonlar/Turlar/Misafirler/Raporlar, CSV indirme); Fas'ın Renkleri panel tur listesine eklendi · panel/ (gitignore)
