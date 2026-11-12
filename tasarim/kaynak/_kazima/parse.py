import re,html,json,glob,os
R='../old/raw/'
def clean(s): return re.sub(r'\s+',' ',html.unescape(re.sub(r'<[^>]+>','',s))).strip()
def num(s): return float(s.replace('.','').replace(',','.'))
def prep(t): return re.sub(r'<script.*?</script>|<style.*?</style>','',t,flags=re.S)
def iso(d): 
    m=re.match(r'(\d\d)\.(\d\d)\.(\d{4})',d.strip()); return f'{m[3]}-{m[2]}-{m[1]}' if m else ''
tours=[]
for i in range(1,91):
    f=R+f'tur{i}.html'
    if not os.path.exists(f): print('yok',i); continue
    t=prep(open(f,encoding='utf8').read())
    m=re.search(r'<h1[^>]*>(.*?)</h1>',t,re.S)
    if not m: print('h1 yok',i); continue
    d={'id':i,'baslik':re.sub(r'\s+',' ',clean(m.group(1)))}
    bc=re.findall(r'<li class="breadcrumb-item"><a href="/turlar.php\?kategori_id=(\d+)">(.*?)</a>',t)
    d['kategoriId']=int(bc[0][0]) if bc else 0
    d['kategoriAd']=clean(bc[0][1]) if bc else ''
    pm=re.search(r'class="pill"><i class="fa fa-calendar-alt"></i>(.*?)</span>',t,re.S)
    dates=re.findall(r'\d\d\.\d\d\.\d{4}',pm.group(1)) if pm else []
    d['baslangic']=iso(dates[0]) if dates else ''
    d['bitis']=iso(dates[1]) if len(dates)>1 else ''
    gm=re.search(r'fa-clock"></i>(\d+) g',t); d['gun']=int(gm[1]) if gm else None
    d['vize']='Vizeli' if 'fa-passport"></i>Vizeli' in t else ('Vizesiz' if 'Vizesiz' in t[:t.find('facts-block')+0 or None] or 'fa-passport"></i>Vizesiz' in t else '')
    facts={}
    for fm in re.finditer(r'<div class="fact-label">(.*?)</div>(.*?)</div></div>',t,re.S): pass
    fb=t[t.find('facts-grid'):t.find('price-block') if 'price-block' in t else t.find('Tur Detayları')]
    for lab,val in re.findall(r'fact-label">(.*?)</div>\s*<div class="fact-val">(.*?)</div>',fb,re.S): facts[clean(lab)]=clean(val)
    d['guzergah']=facts.get('Yolculuk Güzergahı','')
    d['otel']=facts.get('Otel','')
    chips=re.findall(r'fact-label">(Ulaşım|Havayolu)</div>\s*<div class="chips">(.*?)</div>',fb,re.S)
    for lab,c in chips:
        d['ulasim' if lab=='Ulaşım' else 'havayolu']=[clean(x) for x in re.findall(r'</i>(.*?)</span>',c)]
    d.setdefault('ulasim',[]); d.setdefault('havayolu',[])
    vm=re.search(r'class="fact visa".*?fact-val">(.*?)</div>',fb,re.S)
    if vm: d['vize']='Vizeli' if 'erekli' in vm.group(1) else 'Vizesiz'
    # prices
    pr={'yetiskin':[],'cocuk':[],'notlar':[]}
    for head,tb in re.findall(r'<div class="head">(.*?)</div>\s*<table>(.*?)</table>',t,re.S):
        k='yetiskin' if 'Yeti' in head else 'cocuk'
        for r in re.findall(r'<tr>\s*<th>(.*?)</th>\s*<td><span class="has-tip".*?<span class="val-main">(.*?)</span>.*?<td>(\w+)</td>',tb,re.S):
            pr[k].append({'etiket':clean(r[0]),'tutar':num(r[1]),'para':r[2]})
    pr['notlar']=[clean(x) for x in re.findall(r'class="price-note[^"]*">(.*?)</div>',t,re.S)]
    d['fiyatlar']=pr
    # description
    a=t.find('class="ck-content"'); 
    b=t.find('Fiyata Dahil Olanlar')
    desc=t[a:b]
    desc=re.sub(r'<img[^>]*>','',desc)
    blocks=[]
    for m in re.finditer(r'<(p|h[1-6]|li)\b[^>]*>(.*?)</\1>',desc,re.S):
        tx=clean(m.group(2))
        if not tx: continue
        strong=bool(re.match(r'\s*(<span[^>]*>\s*)*<(strong|b)\b',m.group(2))) and len(tx)<110
        head= m.group(1).startswith('h') or bool(re.match(r'^\d+\s*\.?\s*G[üuÜU]n',tx,re.I) and len(tx)<110) or strong
        blocks.append({'t':'h' if head else 'p','x':tx})
    if not blocks:
        tx=clean(desc.replace('class="ck-content"',''))
        if tx: blocks=[{'t':'p','x':tx}]
    # dedupe consecutive
    out=[]
    for x in blocks:
        if out and out[-1]==x: continue
        out.append(x)
    d['program']=out
    def lst(title):
        s=t.find(title); 
        if s<0: return []
        e=t.find('</ul>',s); 
        return [clean(x) for x in re.findall(r'<li><span class="ico[^>]*>.*?</span><span>(.*?)</span></li>',t[s:e],re.S)]
    d['dahil']=lst('Fiyata Dahil Olanlar'); d['haric']=lst('Fiyata Dahil Olmayanlar')
    im=re.search(r'class="hero-img"',t)
    im=re.search(r'<img src="([^"]+)" alt="[^"]*" class="hero-img">',t)
    d['gorselKaynak']=im[1] if im else ''
    d['gecmis']='SÜRESİ BİTTİ' in t
    tours.append(d)
json.dump(tours,open('tours_raw.json','w'),ensure_ascii=False,indent=1)
print(len(tours))
from collections import Counter
print(Counter((x['kategoriAd']) for x in tours))
print(Counter(x['gecmis'] for x in tours))
print(sum(1 for x in tours if not x['fiyatlar']['yetiskin']),'fiyatsiz', sum(1 for x in tours if not x['program']),'programsiz', sum(1 for x in tours if not x['gorselKaynak']),'gorselsiz')
print(Counter(r['para'] for x in tours for k in('yetiskin','cocuk') for r in x['fiyatlar'][k]))
