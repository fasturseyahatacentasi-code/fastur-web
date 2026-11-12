# Dünya harita verisini (tur sayfası rota haritası) yeniden üretir. Normalde ÇALIŞTIRMANIZ GEREKMEZ.
# Gerekenler: numpy; Natural Earth ne_50m_land.geojson dosyasını bu dosyanın yanına "land50.json" adıyla koyun. Lisans: kamu malı.
import json, numpy as np, os
d=json.load(open('land50.json'))
BB=(-170,180,-56,76)
rings=[]
for f in d['features']:
    g=f['geometry']; polys=g['coordinates'] if g['type']=='MultiPolygon' else [g['coordinates']]
    for poly in polys:
        for r in poly:
            a=np.array(r)
            if a[:,0].max()<BB[0] or a[:,0].min()>BB[1] or a[:,1].max()<BB[2] or a[:,1].min()>BB[3]: continue
            rings.append(a)
print(len(rings))
def inside(px,py):
    ins=np.zeros(len(px),bool)
    for a in rings:
        x1=a[:-1,0];y1=a[:-1,1];x2=a[1:,0];y2=a[1:,1]
        # vectorized over edges by y-range prefilter
        ymin=np.minimum(y1,y2); ymax=np.maximum(y1,y2)
        for i in np.where(ymax>ymin)[0]:
            ya,yb=y1[i],y2[i]
            m=(py>=ymin[i])&(py<ymax[i])
            if not m.any(): continue
            xi=x1[i]+(py[m]-ya)*(x2[i]-x1[i])/(yb-ya)
            idx=np.where(m)[0]; ins[idx]^=(px[m]<xi)
    return ins
step=0.9
xs=np.arange(BB[0],BB[1]+1e-9,step); ys=np.arange(BB[2],BB[3]+1e-9,step)
X,Y=np.meshgrid(xs,ys); px=X.ravel();py=Y.ravel()
k=inside(px,py); cx,cy=px[k],py[k]; print(len(cx))
def rdp(pts,eps):
    if len(pts)<3: return pts
    a,b=pts[0],pts[-1]; ab=b-a; n=np.hypot(*ab)
    dist=np.hypot(*(pts-a).T) if n==0 else np.abs(ab[0]*(pts[:,1]-a[1])-ab[1]*(pts[:,0]-a[0]))/n
    i=dist.argmax()
    if dist[i]>eps: return np.vstack([rdp(pts[:i+1],eps)[:-1],rdp(pts[i:],eps)])
    return np.vstack([a,b])
coast=[]
for a in rings:
    if len(a)<8: continue
    s=rdp(a,0.22)
    if len(s)<4: continue
    coast.append([[round(float(x),1),round(float(y),1)] for x,y in s])
print(len(coast),sum(len(c) for c in coast))
js={'b':list(BB),'adim':step,'dots':[[round(float(x),1),round(float(y),1)] for x,y in zip(cx,cy)],'coast':coast}
import os
out=os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','docs','assets','img','harita','harita-dunya.js')
txt='/* Natural Earth ne_50m_land — kamu malı (public domain). Dünya: 0,9° nokta ızgarası + sadeleştirilmiş kıyı. Tur sayfası rota haritası kullanır. */\nwindow.FT_DUNYA='+json.dumps(js,separators=(',',':'))+';\n'
open(out,'w').write(txt); print(len(txt))
