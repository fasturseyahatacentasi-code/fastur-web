# Eski site envanteri — www.fastur.com.tr (12.11.2026 alındı)

> Yöntem: curl (genel tarayıcı User-Agent), sitemap.xml + menü + sayfa sayfa okuma. Eski site PHP tabanlı (Panel360 paneli), üyelik/oturum açma/e-bülten/yorum/favori özellikleri var; yeni sitede ödeme, üyelik, oturum, bülten YOK.
> Sitemap 75 adres (ana sayfa, turlar, 15 kategori, 10 haber, 40 tur, 6 kurumsal, haberler, iletişim). Gerçekte tur numaraları 1–90 (sitemap yalnız 1–40'ı listeliyordu; 43–90 listeleme sayfasından bulundu; 91 yok).

## Menü
Turlar (15 kategori) · Kurumsal (Hakkımızda, Seyahat İpuçları, Kişisel Verilerin Korunması, Gizlilik Sözleşmesi, Kullanıcı Sözleşmesi, Tur ve Otel Satış Sözleşmesi) · Haberler · İletişim · (Oturum aç / Kaydol).

## Kurumsal bilgi (sitede yazan)
Okyay Turizmcilik Limited Şirketi · Fas Tur · 2016'da kuruldu (Hakkımızda) · Güven Mah. İnönü Cad. No:38/106 Güngören/İstanbul · +90 531 765 99 69 (tel + WhatsApp) · info@fastur.com.tr · Hafta içi 09:30–19:30 · Instagram okyayturizm (Facebook/Twitter/YouTube bağlantıları boş "#") · Vergi: Güngören V.D. 6400301337 · **TÜRSAB belge no sitede YOK** · Alt bilgi "Copyright © 2021 Fas Tur".

## Tur kategorileri → yeni adres
| Kategori | Eski id | Eski adres | Yeni adres | Tur sayısı (kayıt) |
|---|---|---|---|---|
| Rusya | 14 | turlar.php?kategori_id=14 | turlar/rusya/ | 3 |
| Mısır | 15 | turlar.php?kategori_id=15 | turlar/misir/ | 6 |
| Ekonomik Umre Turları | 16 | turlar.php?kategori_id=16 | turlar/ekonomik-umre-turlari/ | 9 |
| Yürüme Mesafeli Umre Turları | 17 | turlar.php?kategori_id=17 | turlar/yurume-mesafeli-umre-turlari/ | 1 |
| 5 Yıldızlı Umre Turları | 7 | turlar.php?kategori_id=7 | turlar/5-yildizli-umre-turlari/ | 14 |
| Fas | 11 | turlar.php?kategori_id=11 | turlar/fas/ | 10 |
| Yurtiçi Turlar | 12 | turlar.php?kategori_id=12 | turlar/yurtici-turlar/ | 3 |
| Cruise | 13 | turlar.php?kategori_id=13 | turlar/cruise/ | 10 |
| Afrika | 1 | turlar.php?kategori_id=1 | turlar/afrika/ | 6 |
| Avrupa | 2 | turlar.php?kategori_id=2 | turlar/avrupa/ | 4 |
| Amerika | 6 | turlar.php?kategori_id=6 | turlar/amerika/ | 2 |
| Orta Doğu | 5 | turlar.php?kategori_id=5 | turlar/orta-dogu/ | 6 |
| Orta Avrupa | 3 | turlar.php?kategori_id=3 | turlar/orta-avrupa/ | 0 |
| Orta ve Uzak Asya | 4 | turlar.php?kategori_id=4 | turlar/orta-ve-uzak-asya/ | 15 |
| Hac | 8 | turlar.php?kategori_id=8 | turlar/hac/ | 0 |

## Turlar
- Toplam 90 kayıt (id 1–90); id 38 "TEST" kaydı (yer tutucu görsel) **taşınmadı** → yeni sitede 89 tur.
- Tür dağılımı: kategori tablosu yukarıda. 
- **Bütün turların bitiş tarihi geçmiş**: en geç tur 05–12.09.2026 (id 80); eski sitenin her turda "SÜRESİ BİTTİ" damgası var, ana sayfadaki "Yaklaşan Turlar" bölümü boş. Yani 12.11.2026'da sitede satışta güncel tur yok.
- Eski adres → yeni adres: `tur_detay.php?id=N` → `tur/<ad>-N/` (ör. id 43 → `tur/buyuk-fas-turu-43/`). Tam tablo: `docs/assets/js/eski-adresler.js` (404.html bu tabloyla yönlendirir).
- Her tur kaydında: ad, kategori, başlangıç–bitiş, gün, vize, güzergâh, otel, ulaşım, havayolu, yetişkin (1–4 kişilik oda) ve çocuk (0–2, 2–6, 6–12 yaş) fiyatları (USD/EUR/TL), günlük program (HTML), dahil/hariç listeleri, kapak görseli. Fiyatlar çoğunlukla USD veya EUR; TL yalnız yurtiçi turlarda.
- Eksikler: id 36 (Rusya Lapland, 2025) fiyat yok; id 53–61 (ekonomik umre) günlük program yok; id 63, 84, 87, 88 güzergâh alanı boş.
- Düzeltmeler (yazım): "MAELEZYA"→Malezya, "CRUİSE"→Cruise, "BORDRUM"→Bodrum; başlıklar büyük harften başlık biçimine çevrildi. Başka metne dokunulmadı.

## Sayfalar → yeni adres
| Eski | Yeni |
|---|---|
| index.php | `/` |
| turlar.php | turlar/ |
| hakkimizda.php | hakkimizda/ |
| seyahat_ipuclari.php | seyahat-ipuclari/ |
| haberler.php | haberler/ |
| haber_detay.php?id=1..6 | haberler/cebelitarik-bogazi/ , kazablanka-turu-tarih-kultur-gece-hayati/ , karaviyyin-universitesi-fes-in-ilmi-ve-kulturel-kalbi/ , japonya-gezi-rehberi-sehirler-lezzetler-ve-tum-detaylar/ , fas-turu-hakkinda-en-cok-sorulan-20-soru/ , rusya-nin-beyaz-geceleri/ |
| haber_detay.php?id=7..10 | **içerik yok** (sitemap'te var, sayfa boş) → haberler/ |
| iletisim.php | iletisim/ (+ yeni talep/) |
| kisisel_verilerin_korunmasi.php | kisisel-verilerin-korunmasi/ |
| gizlilik_sozlesmesi.php | gizlilik-sozlesmesi/ |
| kullanici_sozlesmesi.php | kullanici-sozlesmesi/ |
| tur_ve_otel_satis_sozlesmesi.php | tur-ve-otel-satis-sozlesmesi/ |
| login/register/ebulten/rezervasyon modalı | YOK (yeni sitede talep formu) |

## Haberler (6 yazı, yazar "Oğuz Kantar", 07–08.08.2025)
Cebelitarık Boğazı · Kazablanka Turu · Karaviyyin Üniversitesi · Japonya Gezi Rehberi · Fas Turu Hakkında En Çok Sorulan 20 Soru · Rusya'nın Beyaz Geceleri. Hepsi taşındı. Görseller `uploads/haberler/`.

## Hukuki metinler (hepsi eski sitede VAR, taşındı)
KVKK/Kişisel Verilerin Korunması Politikası (10 madde) · Gizlilik Sözleşmesi · Kullanıcı Sözleşmesi (üyelik/hesap maddeleri içeriyor — yeni sitede üyelik yok) · Tur/Otel Satış Sözleşmesi (paket tur; 6502 sayılı Kanun ve Paket Tur Yönetmeliği atıflı, boş alanlı şablon). Hepsinde "firma ve hukukçu kontrolü bekliyor" HTML yorumu var. Eski metinde yazım hatası: Kullanıcı Sözleşmesi'nde "www.www.fastur.com.tr".

## Diğer
- Müşteri yorumları (3, tam adlı; avatar fotoğraflı): yeni sitede yalnız ad + soyad baş harfiyle; firma izni teyit edilmeli. Avatar fotoğrafları alınmadı.
- Görseller: kapaklar, 6 "popüler bölge", slider (2), logo (fastur.png 508×243) indirilip küçültüldü (en çok 1100 px, JPEG).
- Eski robots.txt: Allow /, sitemap fastur.com.tr/sitemap.xml.
