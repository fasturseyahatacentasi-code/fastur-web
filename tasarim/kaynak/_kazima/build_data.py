import json,re,os,shutil,html
W='/Users/hilalbaktas/Desktop/UP-HB-Hilal Agent Team/06-Teknoloji/Yazilim/fastur/fastur-web/docs'
for d in ['assets/img/turlar','assets/img/haber','assets/img/genel','assets/css','assets/js']: os.makedirs(f'{W}/{d}',exist_ok=True)
T=json.load(open('tours_raw.json'))
TR=str.maketrans({'ç':'c','ğ':'g','ı':'i','ö':'o','ş':'s','ü':'u','â':'a','î':'i','û':'u','Ç':'c','Ğ':'g','İ':'i','I':'i','Ö':'o','Ş':'s','Ü':'u'})
def slugify(s):
    s=s.translate(TR).lower(); s=re.sub(r'[^a-z0-9]+','-',s).strip('-'); return s
def tlower(s): return s.replace('İ','i').replace('I','ı').lower()
KEEP={'THY','TL','USD','EUR','VIP','DNA','BAE','ABD','KKTC','SAV','AVM'}
def tcase(s):
    s=re.sub(r'\s+',' ',s).strip()
    s=s.replace('MAELEZYA','MALEZYA').replace('CRUİSE','CRUISE').replace('CRUİS ','CRUISE ')
    def w(m):
        x=m.group(0)
        if x in KEEP: return x
        l=tlower(x); 
        return (l[0].upper() if l[0]!='i' else 'İ')+l[1:] if l[0]!='ı' else 'I'+l[1:]
    s=re.sub(r"[A-Za-zÇĞİIÖŞÜçğıöşüâîû']+",w,s)
    s=re.sub(r'\(\s+','(',s); s=re.sub(r'\s+\)',')',s); s=re.sub(r'\s+',' ',s)
    s=re.sub(r'(?<=\S) (Ve|Ile|İle) ',lambda m:' '+m.group(1).lower().replace('i̇','i')+' ',s)
    s=s.replace('Cruıse','Cruise').replace('Cruıs ','Cruise ').replace('Bordrum','Bodrum')
    s=s.replace('St.petersburg','St. Petersburg').replace('St.Petersburg','St. Petersburg')
    return s.strip()
def clean_label(l):
    l=re.sub(r'^(Etiket Fiyat Para|Yaş Aralığı Fiyat Para)\s*','',l); return l
CAT=[('rusya','Rusya',14),('misir','Mısır',15),('ekonomik-umre-turlari','Ekonomik Umre Turları',16),('yurume-mesafeli-umre-turlari','Yürüme Mesafeli Umre Turları',17),('5-yildizli-umre-turlari','5 Yıldızlı Umre Turları',7),('fas','Fas',11),('yurtici-turlar','Yurtiçi Turlar',12),('cruise','Cruise',13),('afrika','Afrika',1),('avrupa','Avrupa',2),('amerika','Amerika',6),('orta-dogu','Orta Doğu',5),('orta-avrupa','Orta Avrupa',3),('orta-ve-uzak-asya','Orta ve Uzak Asya',4),('hac','Hac',8)]
bykid={k:(s,a) for s,a,k in CAT}
tours=[]; used=set()
for t in sorted(T,key=lambda x:x['id']):
    if t['id']==38 or t['baslik'].strip().upper()=='TEST': continue
    ad=tcase(t['baslik']); slug=f"{slugify(ad)}-{t['id']}"
    gimg=t['gorselKaynak']; fn=os.path.basename(gimg); n=os.path.splitext(fn)[0]+'.jpg'
    src=f'out/{n}'
    if os.path.exists(src): shutil.copy(src,f'{W}/assets/img/turlar/{n}')
    def fy(lst): return [{'etiket':clean_label(r['etiket']),'tutar':r['tutar'],'para':'TL' if r['para']=='TRY' else r['para']} for r in lst]
    prog=[{'t':b['t'],'x':b['x']} for b in t['program']]
    tours.append({'id':t['id'],'slug':slug,'ad':ad,'kategori':bykid[t['kategoriId']][0],'baslangic':t['baslangic'],'bitis':t['bitis'],'gun':t['gun'],
      'vize':t['vize'],'guzergah':tcase(t['guzergah']) if t['guzergah'] else '','otel':t['otel'],'ulasim':t['ulasim'],'havayolu':[tcase(x) if x.isupper() else x for x in t['havayolu']],
      'fiyatlar':{'yetiskin':fy(t['fiyatlar']['yetiskin']),'cocuk':fy(t['fiyatlar']['cocuk']),'notlar':[n_ for n_ in t['fiyatlar']['notlar'] if n_]},
      'program':prog,'dahil':t['dahil'],'haric':t['haric'],'gorsel':f'assets/img/turlar/{n}','aktif':False,'teyit':'firma teyidi bekliyor','eskiAdres':f"tur_detay.php?id={t['id']}"})
# genel gorseller
for src,dst in [('fastur-logo.png','fastur-logo.png'),('slider1.jpg','slider1.jpg'),('slider2.jpg','slider2.jpg')]:
    shutil.copy('out/'+src,f'{W}/assets/img/genel/{dst}')
POP={'umre':'populer_1755431562_8863','fas':'populer_1755423656_2437','avrupa':'populer_1755431042_6835','asya':'populer_1755432024_8758','yurtici':'populer_1755432522_6366','afrika':'populer_1755432690_8017'}
for k,v in POP.items(): shutil.copy(f'out/{v}.jpg',f'{W}/assets/img/genel/bolge-{k}.jpg')
P=json.load(open('pages.json'))
haberler=[]
for h in P['haberler']:
    n=os.path.splitext(os.path.basename(h['gorsel']))[0]+'.jpg'
    shutil.copy(f'out/{n}',f'{W}/assets/img/haber/{n}')
    haberler.append({'id':h['id'],'slug':slugify(h['baslik'])[:60].strip('-'),'baslik':h['baslik'],'tarih':h['tarih'],'yazar':h['yazar'],'gorsel':f'assets/img/haber/{n}','govde':h['govde']})
json.dump({'tours':tours,'cats':CAT,'haberler':haberler},open('data.json','w'),ensure_ascii=False)
print(len(tours),sum(len(os.listdir(f'{W}/assets/img/'+d)) for d in ['turlar','haber','genel']))
print([ (t['slug'],t['ad']) for t in tours[:6]])
