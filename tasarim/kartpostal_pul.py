"""Dünya Rotaları kartpostalları (Hilal Hanım 23.11.2026, ikinci deneme: "çocuksu olmasın").
Pul = o ülkenin kendi tur fotoğrafı (Fas Tur'un görseli) eski baskı tonunda, kenarı tırtıklı, altında ülke adı.
Üstüne mürekkep renginde yuvarlak posta damgası (şehir adı + FAS TUR + yıl, yanında dalgalı çizgiler).
Gerçek pul görseli KOPYALANMAZ (telif). Yeni kategori: PUL sözlüğüne bir satır."""
import html

# slug: (pulun altındaki ülke adı, damgadaki şehir)
PUL = {
    'fas': ('MAROC', 'MARRAKECH'), 'misir': ('EGYPT', 'CAIRO'), 'dubai': ('U.A.E.', 'DUBAI'),
    'rusya': ('РОССИЯ', 'MOSKVA'), 'urdun': ('JORDAN', 'AMMAN'), 'bosna-hersek': ('BiH', 'SARAJEVO'),
    'vietnam': ('VIỆT NAM', 'HA NOI'), 'hindistan': ('INDIA', 'AGRA'), 'japonya': ('NIPPON', 'TOKYO'),
    'malezya': ('MALAYSIA', 'KUALA LUMPUR'), 'ozbekistan': ("O'ZBEKISTON", 'SAMARQAND'),
}


def pul(slug, gorsel):
    if slug not in PUL or not gorsel:
        return ''
    ulke, sehir = PUL[slug]
    return (f'<span class="pul" aria-hidden="true"><span class="pul-ic" style="background-image:url({html.escape(gorsel, quote=True)})"></span>'
            f'<b>{html.escape(ulke)}</b></span>' + damga(sehir))


def damga(sehir):
    ust = html.escape(sehir)
    return ('<span class="damga" aria-hidden="true"><svg viewBox="0 0 120 64" width="104" height="56">'
            '<defs><path id="du" d="M14 32a18 18 0 0 1 36 0"/><path id="da" d="M12 32a20 20 0 0 0 40 0"/></defs>'
            '<g fill="none" stroke="currentColor"><circle cx="32" cy="32" r="27" stroke-width="1.6"/><circle cx="32" cy="32" r="19.5" stroke-width="1"/>'
            '<path d="M62 20q7-5 14 0t14 0 14 0 14 0M62 28q7-5 14 0t14 0 14 0 14 0M62 36q7-5 14 0t14 0 14 0 14 0M62 44q7-5 14 0t14 0 14 0 14 0" stroke-width="1.4"/></g>'
            '<g fill="currentColor" font-family="Georgia,serif" font-weight="700" text-anchor="middle">'
            f'<text font-size="6.4" letter-spacing=".8"><textPath href="#du" startOffset="50%">{ust}</textPath></text>'
            '<text font-size="5.6" letter-spacing="1"><textPath href="#da" startOffset="50%">FAS TUR</textPath></text>'
            '<text x="32" y="35" font-size="8.5" letter-spacing=".5">2026</text></g></svg></span>')


def simgeler(slug):
    return ''   # ilk denemedeki emoji simgeler kaldırıldı (Hilal Hanım: çocuksu)
