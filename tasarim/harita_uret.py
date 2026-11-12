# Harita verisini (nokta ızgarası + kıyı çizgisi) Natural Earth'ten yeniden üretir. Normalde ÇALIŞTIRMANIZ GEREKMEZ.
# Gerekenler: numpy (pip install numpy), ne_50m_land.geojson (https://github.com/nvkelso/natural-earth-vector/tree/master/geojson) -> bu dosyanın yanına "land50.json" adıyla koyun.
# Çıktı: docs/assets/img/harita/harita-veri.js   Lisans: Natural Earth kamu malıdır (public domain).
import json, numpy as np
d=json.load(open('land50.json'))
BB=(-24,60,3,58)  # lon0,lon1,lat0,lat1
rings=[]
for f in d['features']:
    g=f['geometry']; polys=g['coordinates'] if g['type']=='MultiPolygon' else [g['coordinates']]
    for poly in polys:
        for r in poly:
            a=np.array(r); 
            if a[:,0].max()<BB[0] or a[:,0].min()>BB[1] or a[:,1].max()<BB[2] or a[:,1].min()>BB[3]: continue
            rings.append(a)
print(len(rings),sum(len(r) for r in rings))
def inside(px,py):
    ins=np.zeros(len(px),bool)
    for a in rings:
        x1=a[:-1,0];y1=a[:-1,1];x2=a[1:,0];y2=a[1:,1]
        for i in range(len(x1)):
            ya,yb=y1[i],y2[i]
            if ya==yb: continue
            lo,hi=(ya,yb) if ya<yb else (yb,ya)
            if hi<py.min() or lo>py.max(): continue
            m=(py>=lo)&(py<hi)
            if not m.any(): continue
            xi=x1[i]+(py[m]-ya)*(x2[i]-x1[i])/(yb-ya)
            idx=np.where(m)[0]
            ins[idx]^= (px[m]<xi)
    return ins
def grid(l0,l1,t0,t1,step):
    xs=np.arange(l0,l1+1e-9,step); ys=np.arange(t0,t1+1e-9,step)
    X,Y=np.meshgrid(xs,ys); px=X.ravel();py=Y.ravel()
    k=inside(px,py); return px[k],py[k]
# coarse (exclude morocco box) and fine (morocco box)
MB=(-14.2,0.5,26.5,37.2)
cx,cy=grid(BB[0],BB[1],BB[2],BB[3],0.6)
m=~((cx>=MB[0])&(cx<=MB[1])&(cy>=MB[2])&(cy<=MB[3])); cx,cy=cx[m],cy[m]
fx,fy=grid(MB[0],MB[1],MB[2],MB[3],0.14)
print(len(cx),len(fx))
# coastline: simplify (tolerance) rings in bbox
def rdp(pts,eps):
    if len(pts)<3: return pts
    a,b=pts[0],pts[-1]; ab=b-a; n=np.hypot(*ab)
    if n==0: dist=np.hypot(*(pts-a).T)
    else: dist=np.abs(ab[0]*(pts[:,1]-a[1])-ab[1]*(pts[:,0]-a[0]))/n
    i=dist.argmax()
    if dist[i]>eps: return np.vstack([rdp(pts[:i+1],eps)[:-1],rdp(pts[i:],eps)])
    return np.vstack([a,b])
coast=[]
for a in rings:
    s=rdp(a,0.07 if (a[:,0].min()>-16 and a[:,0].max()<2 and True) else 0.12)
    # keep only points within bbox-ish segments: clip simply by dropping far points
    m=(s[:,0]>BB[0]-2)&(s[:,0]<BB[1]+2)&(s[:,1]>BB[2]-2)&(s[:,1]<BB[3]+2)
    if m.sum()<4: continue
    coast.append([[round(float(x),2),round(float(y),2)] for x,y in s])
print(len(coast),sum(len(c) for c in coast))
js={'b':list(BB),'coarse':[[round(float(x),2),round(float(y),2)] for x,y in zip(cx,cy)],'fine':[[round(float(x),2),round(float(y),2)] for x,y in zip(fx,fy)],'coast':coast}
import os
out=__import__('os').path.join(__import__('os').path.dirname(__import__('os').path.abspath(__file__)),'..','docs','assets','img','harita')+'/'
os.makedirs(out,exist_ok=True)
txt='/* Natural Earth (ne_50m_land) — kamu malı (public domain), https://www.naturalearthdata.com/ . Sadeleştirilmiş: nokta ızgarası + kıyı çizgisi. tasarim/harita_uret yöntemi README\'de. */\nwindow.FT_HARITA='+json.dumps(js,separators=(',',':'))+';\n'
open(out+'harita-veri.js','w').write(txt); print(len(txt))
