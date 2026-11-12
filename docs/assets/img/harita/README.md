# Harita verisi — kaynak ve lisans
- **harita-veri.js**: giriş sahnesindeki nokta-ızgara harita ve kıyı çizgisi.
- Kaynak: **Natural Earth** (ne_50m_land, 1:50 milyon) — https://www.naturalearthdata.com/ — **kamu malı (public domain)**; atıf zorunlu değildir, teşekkür notu: "Made with Natural Earth."
- Sadeleştirme: bölge (boylam -24..60, enlem 3..58) 0,6° ızgaraya (Fas çevresi 0,14°) örneklendi, kıyı çizgisi Douglas-Peucker ile sadeleştirildi. Yöntem: `tasarim/harita_uret.py`.
- Harici harita kütüphanesi, tile servisi ve API anahtarı KULLANILMAZ.
