# Fas Tur — Katmanlı video şartnamesi (Higgsfield için)

Site her bölümde 3 katmanlı video gösterebilir: **arka** (döngü arka plan) · **orta** (parallax: bulut/kum/deniz) · **ön** (karakter). Video yoksa site bugün de eksiksiz görünür (görsel/poster). Kredi harcayan üretim ancak Hilal onayıyla.

## 1. Katman başına istenecekler
| Katman | Oran | Çözünürlük | Süre | İçerik | Dosya adı |
|---|---|---|---|---|---|
| Arka (hero) | 16:9 | 1920×1080 (en az 1280×720) | 6–10 sn | Yavaş kamera, destinasyon atmosferi (Marakeş gün batımı, çarşı, sahil…); **kamera hareketi çok yavaş**, ortada/solda sakin alan (başlık yazısı için) | `yola-cikis-arka.mp4` |
| Orta | 16:9 | 1920×1080 | 6–10 sn | Yarı saydam his: bulut / kum savrulması / deniz dalgası; koyu zemin üstüne açık öğeler (site `screen` karışımı kullanır) | `<bolum>-orta.mp4` |
| Ön (karakter) | **9:16** | 1080×1920 (en az 720×1280) | 6–10 sn | Aynı karakter, **düz #00B140 yeşil ekran**, eşit ışık, kamera SABİT | `<bolum>-on.mp4` |
| Mobil sürüm | 9:16 veya 16:9 | yarı çözünürlük | aynı | **Elle üretmeyin**: `video_hazirla.py` otomatik yapar | `<bolum>-<katman>-mobil.mp4` |

Bölümler: `yola-cikis` (hero) · `yorunge` · `umre` · `fas` · `dunya` · `sira-sizde`.

## 2. Zorunlu kurallar
- **Dikişsiz döngü:** ilk ve son kare aynı (ya da Higgsfield'de "loop" seçeneği); videoda belirgin başlangıç/bitiş hareketi olmasın.
- **Karakter tutarlılığı:** aynı yüz, güneş gözlüğü, krem keten gömlek veya lacivert keten ceket + krem gömlek + bej pantolon; saç/sakal aynı. Referans: `tasarim/referans/karakter/` içindeki görseller.
- **Yeşil ekran:** düz #00B140, gölge/kırışık yok, karakter yeşile yakın renk giymez, saç uçlarında yeşil yansıma olmasın, ışık yumuşak.
- Kamera sabit, karakter gövdesi çerçeve içinde (başı ve ayakları kesilmesin), kare kenarına boşluk bırak.
- Ses yok (site sessiz oynatır). Yazı, logo, watermark, "yıldız" filigranı olmasın (Higgsfield çıktısında varsa ücretli planla kaldırın ya da temiz kare üretin).
- Gerçek bir kişinin yüzü/sesi için yazılı izin gerekir (firma teyidi `[?]`).

## 3. Boyut hedefleri (GitHub Pages)
- Tek dosya ≤ **100 MB** (sert sınır; hedef çok daha küçük). Masaüstü klip hedefi ≤ **6 MB**, mobil ≤ **2,5 MB**, poster ≤ 150 KB.
- Depo toplamı ~**1 GB**'ı geçmesin, yayın sitesi ~1 GB önerisi var. Videolar büyürse ileride harici depolamaya (ör. Cloudflare R2 / Bunny) taşınabilir: `veri.js` içinde yol yerine tam adres (`https://...`) yazılır. (Yalnız not: hesap açmayın.)
- Büyük ham dosyalar depoya girmez; yalnız `video_hazirla.py` çıktıları `docs/assets/video/` içine konur.

## 4. Adımlar (öğrenci)
1. Higgsfield'den klibi indir (örn. `Downloads\marakes-hero.mp4`).
2. ffmpeg kurulu mu? Windows: `winget install Gyan.FFmpeg` → terminali kapat-aç → `ffmpeg -version` **[ekranda kontrol]**. Mac: `brew install ffmpeg`.
3. Depo klasöründe:
   - Arka/orta: `py tasarim\video_hazirla.py Downloads\marakes-hero.mp4 --bolum yola-cikis --katman arka`
   - Karakter (yeşil ekran): `py tasarim\video_hazirla.py Downloads\karakter.mp4 --bolum yola-cikis --katman on --yesil`
4. Aracın sonunda yazdığı JSON'u `docs/assets/js/veri.js > katmanlar > bolumler > "yola-cikis" > "arka"` (ya da `"orta"`/`"on"`) içine yapıştır.
5. `py tasarim\uret_turlar.py` → `py -m http.server 8000` (docs içinde) → tarayıcıda kontrol.
6. Boyut raporunda "BÜYÜK" yazıyorsa klibi kısalt (6–8 sn) ve tekrar çalıştır.

## 5. Alfa yöntemleri (karakter)
- **"alfa": "webm"** — gerçek şeffaflık. `video_hazirla.py --yesil` yeşil ekrandan VP9 alfa `.webm` üretir (Chrome, Edge, Firefox, Android). Safari için HEVC alfa `.mov` gerekir (`--mov`, yalnız Mac'te üretilir; **Safari'de gerçek cihazda henüz denenmedi**).
- **"alfa": "yesil"** — yeşil ekran `.mp4` tarayıcıda WebGL ile anahtarlanır (tüm modern tarayıcılar). Ayar: `veri.js > katmanlar.ayar.anahtar` → `benzerlik` (0.32; yeşil kenar kalırsa artır), `yumusaklik` (0.1), `spill` (0.5; saç yeşil yansıması azalır).
- Hangisi varsa o kullanılır; ikisi de boşsa mevcut karakter görseli görünür.

## 6. Denemek için hazır demo
`docs/assets/video/_demo/` altında 6 sn'lik arka klip + yeşil ekran karakter klibi var. Açmak: adres sonuna `?demo=1` (yeşil ekran anahtarı) ya da `?demo=2` (gerçek alfa webm) ekleyin. Kalıcı açmak için `veri.js > katmanlar.demo: true` (varsayılan **false**). Demoyu silmek için `_demo/` klasörünü kaldırın.

## 7. Performans davranışı (site yapar)
Görünür olunca yükler/oynatır, görünmeyince durdurur · `muted playsinline loop preload=none` · `prefers-reduced-motion` ve Veri Tasarrufu / 2G'de yalnız poster · mobilde `mobil` sürüm.

## 8. Karakterin şeffaf PNG'si (arka plan silme)
- **Mac (macOS 14+):** `swift tasarim/arka_plan_sil.swift girdi.jpg cikti.png [daralt=1] [yumusat=1.2]` — Apple Vision ile yerelde, kredisiz. Krem saçak kalırsa `daralt` 2 yapın.
- **Windows:** betik ÇALIŞMAZ. Alternatifler: Codex'ten "arka planı silinmiş şeffaf PNG" istemek (04-Tasarim-Notu.md'deki iş emri) ya da Higgsfield yeşil ekran + `video_hazirla.py --yesil`.
- Hazır PNG'yi şu iki yoldan kullanın: `docs/assets/img/karakter/karakter-tam-boy.png` dosyasını değiştirin (en kolayı) ya da `veri.js > katmanlar > bolumler > yola-cikis > on` içine `{"poster":"assets/img/karakter/yeni.png","alfa":"png"}` yazın.
