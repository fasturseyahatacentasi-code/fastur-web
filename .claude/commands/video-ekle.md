---
description: Higgsfield klibini siteye katmanlı video olarak ekle
---

Kredi harcayan üretim **öğrencinin o tur için onayıyla** yapılır (abonelik öğrencidedir). Üretim bittiyse:

1. `tasarim/VIDEO-SARTNAMESI.md`'yi oku; klip şartnameye uyuyor mu (oran, süre, alfa türü: yok / webm / yesil) sor, kontrol et.
2. Ham klibi (Higgsfield çıktısı) öğrenciden iste; yerel `tasarim/` dışındaki bir ham klasörde tut (büyük, depoya girmez).
3. `ffmpeg` kurulu mu kontrol et (`ffmpeg -version`); yoksa ADIMLAR.md W8, dur.
4. `py tasarim\video_hazirla.py <klip> ...` (parametreler için betiğin yardımına bak: `--help`). Çıktı: web mp4, mobil, poster, alfa webm/mov, boyut raporu, veri.js JSON parçası.
5. **Boyut sınırı:** masaüstü ≤6 MB, mobil ≤2,5 MB, tek dosya <100 MB. Aşıyorsa sıkıştırma ayarını düşür; kayıt GitHub'a girmez.
6. JSON parçasını `veri.js` → `katmanlar.bolumler.<id>.{arka|orta|on}` altına koy (JSON kuralları: yorum/son virgül yok), `alfa` alanını doğru seç.
7. 🔴 `py tasarim\uret_turlar.py`, ardından `py tasarim\kirik_link_kontrol.py` (site `docs`'ta `py -m http.server 8000` ile açık).
8. Tarayıcıda bak (masaüstü + telefon genişliği); gerekirse `?demo=1`. Öğrenciye göster, onay iste. Commit mesajı: "Claude: <bölüm> katman videosu". Push'u öğrenci yapar. Kilit tablosunu ve günlüğü güncelle.
