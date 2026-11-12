---
description: Yayın öncesi kontrol listesini çalıştır
---

`fastur-yayin-kontrol` agent'ını kullan. `docs/` içinde şunları denetle ve tablo olarak raporla (Kontrol · Sonuç · Dosya/Kanıt):

1. Kırık link ve eksik görsel; her sayfada title ve meta description var mı.
2. Telefon, WhatsApp ve e-posta tüm sayfalarda aynı ve `veri.js`'deki ile aynı mı. Tıklanınca doğru yere gidiyor mu.
3. Mobil dar ekranda yatay kayma, taşan tablo/görsel.
4. Geçmiş tarihli turlar "yaklaşan" görünüyor mu; fiyatı/tarihi boş ya da `teyit: false` turlar.
5. Form: yalnız ad, iletişim, tur, not sorar; sağlık/din/kimlik alanı yok. Ödeme ve üye girişi yok.
6. KVKK aydınlatma, çerez, sözleşme sayfaları ve TÜRSAB belge no: var mı, `[HUKUKÇU KONTROLÜ BEKLİYOR]` ya da `[FİRMA BİLGİSİ]` işareti kalmış mı (kalmışsa listele; **bunları sen tamamlama**).
7. Depoda kişisel veri, şifre, anahtar yok mu (`.env`, `kurulum/`, `tasarim/` gitmiyor mu: `.gitignore` kontrol).
8. sitemap.xml ve robots.txt var mı.

9. **Üretici güncel mi:** `py tasarim\uret_turlar.py` (Mac: `python3 tasarim/uret_turlar.py`) çalıştırıldı mı (ozet.js, tur sayfaları, sitemap veri.js ile uyumlu), ardından `py tasarim\kirik_link_kontrol.py` (Mac: `python3 tasarim/kirik_link_kontrol.py`; önce `docs` klasöründe `py -m http.server 8000` açık olmalı) çıktısı temiz mi.

Sonda "YAYINA HAZIR / ŞUNLAR BEKLİYOR" yaz. Yayın kararı Hilal Hanım'ın ve firmanındır; sen Push önermezsin.
