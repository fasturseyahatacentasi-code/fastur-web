#!/usr/bin/env python3
"""Kırık bağlantı kontrolü (yalnız standart kütüphane).
Önce siteyi açın:   (docs klasöründe)  python -m http.server 8000
Sonra:              py tasarim\\kirik_link_kontrol.py          (Mac: python3 tasarim/kirik_link_kontrol.py)
Ana sayfadan başlar, sitedeki bütün iç sayfaları gezer; bağlantı, görsel, CSS, JS dosyalarını denetler."""
import sys, re, urllib.request, urllib.error
from urllib.parse import urljoin, urlparse, urldefrag
BASE = (sys.argv[1] if len(sys.argv) > 1 else 'http://localhost:8000/').rstrip('/') + '/'
goruldu, kuyruk, kirik, sayfa_say = set(), [BASE], [], 0
kaynak = {}
def getir(u):
    try:
        r = urllib.request.urlopen(urllib.request.Request(u, headers={'User-Agent': 'link-kontrol'}), timeout=20)
        return r.status, r.headers.get('Content-Type', ''), r.read()
    except urllib.error.HTTPError as e:
        return e.code, '', b''
    except Exception:
        return 0, '', b''
while kuyruk:
    u = kuyruk.pop()
    u, _ = urldefrag(u)
    if u in goruldu: continue
    goruldu.add(u)
    kod, tur, govde = getir(u)
    if kod != 200:
        kirik.append((u, kod, kaynak.get(u, '')))
        continue
    if 'text/html' in tur:
        sayfa_say += 1
        s = govde.decode('utf-8', 'replace')
        s2 = re.sub(r'<script[^>]*>.*?</script>', lambda m: m.group(0) if 'src=' in m.group(0)[:200] else '', s, flags=re.S)
        for m in re.finditer(r'(?:href|src)="([^"#][^"]*)"', s2):
            h = m.group(1)
            if h.startswith(('mailto:', 'tel:', 'javascript:', 'data:', 'http://', 'https://', '//')): continue
            if '{' in h: continue
            tam = urljoin(u, h.split('?')[0] if not h.endswith('/') else h)
            if urlparse(tam).netloc != urlparse(BASE).netloc: continue
            if tam not in goruldu:
                kaynak.setdefault(tam, u); kuyruk.append(tam)
print(f'Gezilen sayfa: {sayfa_say} · denetlenen adres: {len(goruldu)} · kırık: {len(kirik)}')
for u, k, ks in kirik: print(f'  KIRIK [{k}] {u}   (kaynak: {ks})')
sys.exit(1 if kirik else 0)
