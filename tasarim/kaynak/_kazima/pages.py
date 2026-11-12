import re,html,json
R='../old/raw/'
def pre(f):
    t=open(R+f+'.html',encoding='utf8').read()
    return re.sub(r'<script.*?</script>|<style.*?</style>|<svg.*?</svg>','',t,flags=re.S)
def inline(s):
    s=re.sub(r'<a [^>]*href="[^"]*"[^>]*>(.*?)</a>',r'\1',s,flags=re.S)
    s=re.sub(r'<(/?)(b|strong)\b[^>]*>',r'<\1strong>',s); s=re.sub(r'<(/?)(i|em)\b[^>]*>',r'<\1em>',s)
    s=re.sub(r'<(?!/?(strong|em)>)[^>]+>','',s)
    s=html.unescape(s); s=s.replace('<','&lt;') if False else s
    return re.sub(r'\s+',' ',s).strip()
def esc(s): return s
def walk(frag):
    out=[]; 
    for m in re.finditer(r'<(h[1-4])\b[^>]*>(.*?)</\1>|<p\b[^>]*>(.*?)</p>|<ul\b[^>]*>(.*?)</ul>|<ol\b[^>]*>(.*?)</ol>',frag,re.S):
        if m.group(1):
            lvl={'h1':'h2','h2':'h2','h3':'h3','h4':'h3'}[m.group(1)]
            x=inline(m.group(2)); 
            if x: out.append(f'<{lvl}>{x}</{lvl}>')
        elif m.group(3) is not None:
            x=inline(m.group(3))
            if x: out.append(f'<p>{x}</p>')
        else:
            body=m.group(4) if m.group(4) is not None else m.group(5)
            tag='ul' if m.group(4) is not None else 'ol'
            lis=[inline(x) for x in re.findall(r'<li\b[^>]*>(.*?)</li>',body,re.S)]
            lis=[l for l in lis if l]
            if lis: out.append(f'<{tag}>'+''.join(f'<li>{l}</li>' for l in lis)+f'</{tag}>')
    return '\n'.join(out)
def region(f,start_marker=None):
    t=pre(f); j=t.find('bravo_footer'); 
    idx=[m.start() for m in re.finditer('</section>|<!-- CONTENT',t)]
    return t,j
P={}
for f in ['hakkimizda','seyahat_ipuclari','kisisel_verilerin_korunmasi','gizlilik_sozlesmesi','kullanici_sozlesmesi','tur_ve_otel_satis_sozlesmesi']:
    t=pre(f); j=t.find('bravo_footer')
    i=t.find('<div class="container py-5">')
    seg=t[i:j]
    seg=re.sub(r'<div class="row g-3 text-center">.*','',seg,flags=re.S) if 'text-center' in seg else seg
    P[f]=walk(seg)
    h1=re.search(r'<h1[^>]*>(.*?)</h1>',t,re.S); lead=re.search(r'<p class="lead[^"]*">(.*?)</p>',t,re.S)
    P[f+'_h1']=inline(h1.group(1)); P[f+'_lead']=inline(lead.group(1)) if lead else ''
def post(b,title):
    lines=b.split('\n'); out=[]; ul=[]
    def flush():
        nonlocal ul
        if ul: out.append('<ul>'+''.join(ul)+'</ul>'); ul=[]
    for l in lines:
        m=re.fullmatch(r'<p>\s*[-•–]\s*(.*?)</p>',l)
        if m: ul.append('<li>'+m.group(1)+'</li>'); continue
        flush()
        m=re.fullmatch(r'<p><strong>(.*?)</strong></p>',l)
        if m:
            x=m.group(1)
            if re.sub(r'\W','',x.lower())==re.sub(r'\W','',title.lower()): continue
            if len(x)<130: out.append('<h2>'+x+'</h2>'); continue
        out.append(l)
    flush(); return '\n'.join(out)
H=[]
for i in range(1,11):
    try: t=pre(f'haber{i}')
    except: continue
    h1=re.search(r'<h1 class="blog-title">(.*?)</h1>',t,re.S)
    if not h1: print('haber yok',i); continue
    img=re.search(r'<div class="blog-hero.*?<img src="([^"]+)"',t,re.S)
    dt=re.search(r'<time datetime="([^"]+)"',t)
    au=re.search(r'<strong style="color:#e2e8f0;">(.*?)</strong>',t)
    j=t.find('class="overlay"'); 
    k=t.find('</div>',t.find('title-wrap',j)); 
    # content: after hero until aside
    s=t.find('col-lg-1 d-none',0); 
    e=t.find('<aside',s)
    seg=t[s:e]
    # remove share rail
    seg=re.sub(r'<div class="share-rail".*?</div>\s*</div>','',seg,flags=re.S)
    body=post(walk(seg), inline(h1.group(1)))
    H.append({'id':i,'baslik':inline(h1.group(1)),'tarih':dt.group(1) if dt else '','yazar':inline(au.group(1)) if au else '','gorsel':img.group(1) if img else '','govde':body})
json.dump({'sayfalar':P,'haberler':H},open('pages.json','w'),ensure_ascii=False,indent=1)
for k,v in P.items(): print(k,len(v))
for h in H: print(h['id'],h['baslik'],h['tarih'],len(h['govde']),h['gorsel'])
print(H[1]['govde'][:1500])
