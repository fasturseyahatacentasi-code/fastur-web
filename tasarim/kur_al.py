# Ziraat Katılım döviz satış kurunu alır, docs/assets/data/kur.json yazar (GitHub Actions'ta 30 dk'da bir).
# Hilal Hanım 19.11.2026: satış kuru; 18:00–09:00 arası ve hafta sonu güncellenmez (gece makas açılıyor), ziyaretçi son 18:00'e kadarki kuru görür.
import json, os, sys, urllib.request, datetime
YOL = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'docs', 'assets', 'data', 'kur.json')
tr = datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(hours=3)
if tr.weekday() >= 5 or not (9 <= tr.hour < 18):
    print('piyasa saati dışında, güncellenmedi', tr.isoformat()); sys.exit(0)
req = urllib.request.Request('https://www.ziraatkatilim.com.tr/ajax/piyasalar', headers={'User-Agent': 'Mozilla/5.0', 'Accept': 'application/json'})
d = json.load(urllib.request.urlopen(req, timeout=30))
def sayi(x): return float(str(x).replace('.', '').replace(',', '.'))
k = {c['code']: c for c in d.get('data', []) if c.get('code') in ('USD', 'EUR')}
out = {}
for kod in ('USD', 'EUR'):
    c = k.get(kod)
    if not c: sys.exit('kur yok: ' + kod)
    al, sat = sayi(c['buy']), sayi(c['sell'])
    if not (0 < al <= sat) or (sat - al) / al > 0.06:   # makas olağandışı açıksa yazma (yanıltmasın)
        print('makas olağandışı', kod, al, sat); sys.exit(0)
    out[kod] = sat
eski = {}
try: eski = json.load(open(YOL, encoding='utf-8'))
except Exception: pass
yeni = {'USD': out['USD'], 'EUR': out['EUR'], 'zaman': tr.strftime('%Y-%m-%dT%H:%M'), 'kaynak': 'Ziraat Katılım satış kuru'}
if eski.get('USD') == yeni['USD'] and eski.get('EUR') == yeni['EUR']:
    print('değişmedi'); sys.exit(0)
os.makedirs(os.path.dirname(YOL), exist_ok=True)
json.dump(yeni, open(YOL, 'w', encoding='utf-8'), ensure_ascii=False); print('yazıldı', yeni)
