# Karakter görsel ve video kuralları (Okay · Aşçı Oğuz)

> Kural kitabı · 13.11.2026 · Hilal Hanım'ın isteğiyle yazıldı. **Okay** ya da **Aşçı Oğuz** görünen her görsel, video, iş emri ve sayfa bu kurallara uyar.
> Bu dosyayı okuyan: Claude, Codex, `fastur-gorsel-brief`, `fastur-tasarim-kod`, `fastur-yayin-kontrol`. Briefler (`VIDEO-SARTNAMESI.md`, `KONUSAN-REHBER-BRIEF.md`) buraya bağlanır; çelişki olursa **bu dosya geçerlidir.**
> Kural değişikliği yalnız Hilal Hanım'ın açık onayıyla yapılır.

## 1. Zorunlu not (yapay zekâ)
- Okay'in göründüğü her görselin ya da videonun yanında, sayfada okunur yerde: **"Görseller yapay zekâ ile üretildi."**
- Aşçı Oğuz videolarında: **"Kurgusal karakter · Görseller yapay zekâ ile üretildi."** (altyazıda, kapanış kartında ya da video açıklamasında)
- Not küçük olabilir ama gizlenmez. Görselin `alt` metnine eklenmez; sayfa metninde durur.

## 2. Görselin üstünde yazı, işaret, logo yok
- Flow/Veo/Gemini çıktılarında sağ alt köşede **✦ (iki yıldız)** ve bazı kliplerde **"Veo" yazısı** bulunur. **Yayına giden hiçbir dosyada bu işaretler olmaz.**
- Yayından önce dosya **tam boyutta** açılır ve sağ alt köşe kontrol edilir (videoda baştan sona).
- İşaret **bulanıklaştırılarak ya da üstüne leke bırakılarak** kapatılmaz. İz kalmıyorsa silinir; iz kalıyorsa dosya kullanılmaz, temiz kare yeniden üretilir.
- Silme aracı depo dışında, Hilal Hanım'ın masaüstünde: `WEB SİTESİ HİLAL ÇALIŞMALAR\SITE-HAZIR\_arac\isaret_temizle.py` (`python isaret_temizle.py girdi.mp4 cikti.mp4`). Araç işaretin bulunduğu kareleri ve kaç karede sildiğini yazar; sonuç yine gözle kontrol edilir.
- **CapCut kuralı:** İşaret **CapCut'a girmeden önce, kaynak klipten** silinir. CapCut klibi büyütüp kaydırdığı için bitmiş montajdan işaret güvenilir biçimde silinemez.
- Görsele yazı, logo, filigran **çizdirilmez**. Altyazı ve logo kurguda (CapCut) ya da sitede kodla eklenir.

## 3. Logo
- Logo **yapay zekâya çizdirilmez.** Her yerde gerçek logo dosyası kullanılır.
- Sitede: `docs/assets/img/genel/fastur-logo.png` (yatay). Dikey logonun saydam sürümleri hazır: `SITE-HAZIR\web\logo\` (açık zemin için). Siteye eklenecekse `docs/assets/img/genel/` altına aynı adla kopyalanır.
- Koyu zemin için logonun özel bir sürümü **yoktur.** Lacivert "FAS TUR" yazısı koyu zeminde zor okunur. Beyaz ya da krem yazılı sürüm marka kararıdır; firma onayı olmadan yapılmaz.

## 4. Karakterin kimliği (Okay)
- Okay gerçek bir firma çalışanıdır; görüntüsünün ve gençleştirilmiş görünümünün kullanımı için **yazılı izni vardır** (Hilal Hanım, 08.11.2026). Bu izin yalnız Okay içindir. Başka gerçek kişi yüzü için `AGENTS.md` kuralı geçerlidir (yok).
- Sitede kullanılan tek görünüm **"Genç Okay"** görünümüdür: 20'lerin sonu–30'ların başı, kısa koyu saç, kısa kirli sakal, **ince gümüş metal pilot gözlük + koyu füme cam (her karede takılı)**.
- **Eski görünüm (Kasım 2026 öncesi) sitede kullanılmaz.**
- Her yeni üretimde onaylı karakter kartları referans verilir (ön + üç çeyrek; gerekirse yan). Yalnız yazılı tarifle üretim yapılmaz.
- Yüz, saç, sakal ve gözlük bütün karelerde aynıdır. Görüntü **aynalanmaz.** Videoda yüz kayarsa o klip kullanılmaz.
- Boy 1,80 m; bodur gösterilmez, bacaklar kısaltılmaz.

## 5. Kıyafet
| Nerede | Kıyafet |
|---|---|
| Ana sayfa | Lacivert keten ceket (iki düğmeli, açık), krem keten gömlek (klasik yaka, üst düğme açık), bej keten pantolon, kahverengi süet loafer |
| Ülke sayfası | O ülkenin **rota kıyafeti**. Yalnız kıyafet değişir; yüz, saç, sakal ve gözlük aynı kalır. |
| Fas (onaylı) | Sade krem cellaba, yakada ve önde ton sür ton ince nakış, kapüşon arkada (başa geçirilmez), mat sarı deri babuş. **Fes ve şapka yok.** |
| Aşçı Oğuz | Beyaz aşçı ceketi. Oğuz kurgusal bir karakterdir; oyuncu Okay'dir. "Faslı şef" gibi sunulmaz. |

- Rota kıyafeti her ülke için ayrı kararla seçilir. Kostüm ya da karikatür etkisi yaratmamalıdır; kaynak notu tutulur.

## 6. Ülke geçişi (kıyafet değişimi videosu)
- **Her ülkenin geçişi kendine özeldir.** Altın sis **yalnız Fas'a** aittir; başka ülkede kullanılmaz.
- Ortak teknik: ceketli tam boy görsel + aynı poz, kadraj ve fonda rota kıyafetli görsel → ilk kare / son kare videosu.
- Video 9:16'dır. **Masaüstünde tam ekran açılmaz;** sayfanın bir yanında, karakterin durduğu dar sütunda oynar.
- Geçiş sessiz oynar, kısa tutulur (Fas: 4,3 sn). Tur bilgisine ulaşmak animasyonun bitmesini beklemez.
- **Hareketi azalt** ayarında, Veri Tasarrufu modunda ya da yavaş bağlantıda video oynamaz; doğrudan son kare (rota kıyafetli sabit görsel) gösterilir.

## 7. Sayfa üst görseli (hero)
- Başlığın okunması için görselin bir yanı **bulanık üretilmez.** Okunurluk sitede kodla, yarı saydam renk geçişiyle (CSS gradient) sağlanır.
- Masaüstü ve telefon için **ayrı kadraj** kullanılır (16:9 ve 9:16). Telefon görseli masaüstü görselinden kırpılmaz.

## 8. Dosya boyutu ve biçimi
| Tür | Biçim | Hedef |
|---|---|---|
| Büyük görsel (genişlik ≥1080) | `.webp` | ≤ 300 KB |
| Telefon / küçük görsel (≤720) | `.webp` + `.jpg` yedek | ≤ 160 KB (jpg ≤ 220 KB) |
| Sessiz döngü / geçiş videosu | `.mp4` (H.264) + `.webm` (VP9), sessiz | masaüstü ≤ 6 MB, mobil ≤ 2,5 MB |
| Sesli video (Aşçı Oğuz vb.) | `.mp4`, AAC ses | masaüstü ≤ 6 MB, mobil ≤ 2,5 MB; otomatik çalmaz, "Dinle"/oynat düğmesi |
| Video kapak (poster) | `.webp` / `.jpg` | ≤ 150 KB |

- PNG yalnız saydamlık gereken yerde (logo) kullanılır.
- Ham dosyalar (PNG, ham video, CapCut çıktısı) **depoya girmez.** Siteye yalnız küçültülmüş sürümler konur (`docs/assets/img/...`, `docs/assets/video/...`).
- Dosya adı: küçük harf, Türkçe karaktersiz, tire (`fas-sayfa-masaustu-1920.webp`).

## 9. Ses ve müzik
- Müzik telifsizdir ya da kendi ürettiğimizdir; kaynağı yazılır.
- Okay'in sesi (ElevenLabs) yalnız Okay'in yazılı iznindeki kapsamda kullanılır.

## 10. Altyazı
- Altyazı yayından önce **harf harf** okunur. Görüntüye gömülü altyazıda hata varsa video kullanılmaz; CapCut'ta düzeltilip yeniden alınır.

## 11. Yayın öncesi kontrol listesi
- [ ] Sağ alt köşede ✦ / "Veo" yok (görselde ve videonun her saniyesinde)
- [ ] Görselde yazı, logo, filigran yok; logo gerçek dosyadan
- [ ] "Yapay zekâ ile üretildi" notu sayfada var
- [ ] Yüz, gözlük, saç ve sakal onaylı kartlarla aynı; görüntü aynalanmamış; eski görünüm yok
- [ ] Kıyafet bölüm 5'e uygun
- [ ] Dosya boyutu bölüm 8'deki sınırların altında; ad kurala uygun
- [ ] Hareketi azalt / yavaş bağlantıda sabit görsel açılıyor
- [ ] Altyazıda yazım hatası yok
