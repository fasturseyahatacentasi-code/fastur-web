---
description: Yeni tur ekle ya da mevcut turu güncelle (yalnız veri dosyasından, tarih-gün doğrulamalı)
---

`fastur-tur-veri` agent'ını kullanarak şunu yap. Hiçbir bilgiyi uydurma.

1. Hilal Hanım'dan eksik alanları **sor**: tur adı, kategori (`veri.js` `kategoriler`'den), **gidiş ve dönüş tarihi**, gün sayısı, vize, güzergâh, otel, ulaşım/havayolu, fiyatlar (etiket, tutar, para birimi USD/EUR/TL; yetişkin/çocuk), program, dahil/hariç, görsel, firma teyidi.
2. **Tarih-gün doğrulaması:** gün adı tarihle tutuyor mu, dönüş gidişten sonra mı, gün sayısı tutuyor mu, tarih geçmişte mi? Tutmuyorsa **yazma**, sor.
3. `docs/assets/js/veri.js` → **JSON**; yeni tur = **son kaydın kopyası**, `id` = en büyük + 1, `slug` = `ad-ascii-id`; kopyadan gelen eski fiyat/program/otel/dahil-hariç **temizlenir**. `teyit:"firma teyidi bekliyor"`. Eskiyen turu silme, `aktif:false`.
4. 🔴 **Üreticiyi çalıştır** (tur verisi için `uret_turlar.py`; ortak kabuk de değiştiyse önce `py tasarim\build_static.py`): `py tasarim\uret_turlar.py` (Mac: `python3 tasarim/uret_turlar.py`). Sonra `py tasarim\kirik_link_kontrol.py` (Mac: `python3 tasarim/kirik_link_kontrol.py`; önce `docs` klasöründe `py -m http.server 8000` açık olmalı). Hata varsa düzelt.
5. `docs` klasöründe `py -m http.server 8000` ile aç, `http://localhost:8000/` üzerinde tur sayfasına ve listeye telefon genişliğinde de bak, Hilal Hanım'a göster.
6. Onay iste. Onay gelince commit mesajı öner ("Claude: <tur> eklendi") ve GitHub Desktop'ta Commit + Push adımlarını tarif et. Kilit satırını BİTTİ yap, `CALISMA-GUNLUGU.md`'ye tek satır yaz.
