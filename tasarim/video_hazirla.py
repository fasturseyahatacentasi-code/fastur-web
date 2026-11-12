#!/usr/bin/env python3
"""
FAS TUR — Higgsfield (ya da başka) videosunu web'e hazırlar. Yalnız Python standart kütüphanesi + ffmpeg.

NE YAPAR (bir girdi videosundan)
  <bolum>-<katman>.mp4          H.264 High, yuv420p, faststart  (masaüstü; arka/orta: 1920 genişlik, ön: 1080x1920'e kadar)
  <bolum>-<katman>-mobil.mp4    daha hafif (720 genişlik / ön: 540x960)
  <bolum>-<katman>.jpg          poster (0,5. saniyeden kare)
  <bolum>-<katman>.webm         YALNIZ ön katman + --yesil: yeşil ekrandan VP9 ALFA (şeffaf) webm
  <bolum>-<katman>.mov          yalnız Mac + --yesil + --mov: Safari için HEVC alfa (Windows'ta atlanır)
  Boyut raporu: masaüstü hedef <= 6 MB, mobil hedef <= 2,5 MB, tek dosya sınırı 100 MB (GitHub).
  Sonunda veri.js'e yapıştıracağınız satırı yazar.

KULLANIM
  Windows:  py tasarim\\video_hazirla.py  indirilenler\\klip.mp4  --bolum yola-cikis  --katman arka
  Mac:      python3 tasarim/video_hazirla.py ~/Downloads/klip.mp4 --bolum yola-cikis --katman on --yesil
  --bolum   yola-cikis | yorunge | umre | fas | dunya | sira-sizde
  --katman  arka | orta | on
  --sesli   (yalnız ön katman) konuşan rehber: sesi KORUR (AAC 96k, loudnorm -16 LUFS); veri.js'e "ses":true yazılır; site otomatik çalmaz, "Dinle" düğmesiyle döngüsüz oynatır
  --yesil   girdi #00B140 yeşil ekranlı karakter videosu: hem yeşil-ekran mp4 (tarayıcıda anahtarlanır) hem alfa webm üretir
  --cikti   varsayılan docs/assets/video
  --benzerlik 0.12 --yumusaklik 0.06   (ffmpeg chromakey; webm için)

FFMPEG KURULUMU
  Mac: brew install ffmpeg      Windows: winget install Gyan.FFmpeg   (kurulumdan sonra terminali kapatıp açın; ekranda kontrol: ffmpeg -version)
"""
import argparse, os, shutil, subprocess, sys, json

LIM_MASA, LIM_MOBIL, LIM_TEK = 6.0, 2.5, 100.0


def calistir(cmd):
    r = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
    if r.returncode != 0:
        print('HATA:', ' '.join(cmd[:6]), '...\n', r.stderr[-600:])
        return False
    return True


def sure(yol):
    r = subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'json', yol], stdout=subprocess.PIPE, text=True)
    try:
        return float(json.loads(r.stdout)['format']['duration'])
    except Exception:
        return 0.0


def mb(yol):
    return os.path.getsize(yol) / 1048576.0


def main():
    a = argparse.ArgumentParser(description='Higgsfield çıktısını web için hazırla')
    a.add_argument('girdi'); a.add_argument('--bolum', required=True); a.add_argument('--katman', required=True, choices=['arka', 'orta', 'on'])
    a.add_argument('--yesil', action='store_true'); a.add_argument('--sesli', action='store_true'); a.add_argument('--mov', action='store_true'); a.add_argument('--cikti', default=None)
    a.add_argument('--benzerlik', default='0.12'); a.add_argument('--yumusaklik', default='0.06')
    s = a.parse_args()
    if not shutil.which('ffmpeg'):
        sys.exit('ffmpeg bulunamadı. Kurulum: Mac "brew install ffmpeg" · Windows "winget install Gyan.FFmpeg" (terminali yeniden açın).')
    if not os.path.exists(s.girdi):
        sys.exit('Girdi dosyası yok: ' + s.girdi)
    kok = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'docs'))
    cikti = s.cikti or os.path.join(kok, 'assets', 'video'); os.makedirs(cikti, exist_ok=True)
    ad = f'{s.bolum}-{s.katman}'; p = lambda son: os.path.join(cikti, ad + son)
    on = s.katman == 'on'
    olcek_m = 'scale=-2:min(1920\\,ih)' if on else 'scale=min(1920\\,iw):-2'
    olcek_k = 'scale=-2:min(960\\,ih)' if on else 'scale=min(720\\,iw):-2'
    d = sure(s.girdi)
    if d and not (4 <= d <= 12):
        print(f'UYARI: süre {d:.1f} sn; önerilen 6–10 sn (dikişsiz döngü).')
    sesli = s.sesli and on
    if sesli:
        ses = subprocess.run(['ffprobe', '-v', 'error', '-select_streams', 'a', '-show_entries', 'stream=codec_name', '-of', 'csv=p=0', s.girdi], stdout=subprocess.PIPE, text=True).stdout.strip()
        if not ses: print('UYARI: --sesli verildi ama girdide ses kanalı yok; sessiz hazırlanacak.'); sesli = False
    temel = ['ffmpeg', '-y', '-v', 'error', '-i', s.girdi] + ([] if sesli else ['-an'])
    sesarg = ['-c:a', 'aac', '-b:a', '96k', '-af', 'loudnorm=I=-16:TP=-1.5:LRA=11'] if sesli else []

    ok = calistir(temel + ['-vf', olcek_m + ',format=yuv420p', '-c:v', 'libx264', '-profile:v', 'high', '-crf', '24' if not on else '22', '-preset', 'slow'] + sesarg + ['-movflags', '+faststart', p('.mp4')])
    ok &= calistir(temel + ['-vf', olcek_k + ',format=yuv420p', '-c:v', 'libx264', '-profile:v', 'main', '-crf', '29', '-preset', 'slow'] + sesarg + ['-movflags', '+faststart', p('-mobil.mp4')])
    calistir(['ffmpeg', '-y', '-v', 'error', '-ss', '0.5', '-i', s.girdi, '-frames:v', '1', '-q:v', '4', '-vf', olcek_m, p('.jpg')])

    alfa = ''
    if on and s.yesil:
        anahtar = f'chromakey=0x00B140:{s.benzerlik}:{s.yumusaklik}'
        if calistir(temel + ['-vf', olcek_m + ',' + anahtar + ',despill=type=green:mix=0.5,format=yuva420p', '-c:v', 'libvpx-vp9', '-pix_fmt', 'yuva420p', '-b:v', '0', '-crf', '34', '-auto-alt-ref', '0'] + (['-c:a', 'libopus', '-b:a', '64k'] if sesli else []) + [p('.webm')]):
            alfa = 'webm'
        if s.mov and sys.platform == 'darwin':
            if calistir(temel + ['-vf', olcek_m + ',' + anahtar + ',format=bgra', '-c:v', 'hevc_videotoolbox', '-alpha_quality', '0.7', '-tag:v', 'hvc1', '-b:v', '2M', p('.mov')]):
                alfa = 'webm'
            else:
                print('Not: HEVC alfa .mov üretilemedi (yalnız Mac + yeni macOS). Safari için yeşil ekran modunu ("alfa":"yesil") kullanın.')

    print('\n--- BOYUT RAPORU ---')
    for son, lim in [('.mp4', LIM_MASA), ('-mobil.mp4', LIM_MOBIL), ('.webm', LIM_MASA), ('.mov', LIM_MASA), ('.jpg', 1.0)]:
        if os.path.exists(p(son)):
            m = mb(p(son)); nota = 'TAMAM' if m <= lim else f'BÜYÜK (hedef <= {lim} MB; kısaltın / sıkıştırın)'
            if m > LIM_TEK: nota = 'GITHUB SINIRINI AŞIYOR (100 MB)'
            print(f'  {ad}{son:12s} {m:6.2f} MB  {nota}')
    print('\n--- veri.js > katmanlar > bolumler > "%s" > "%s" içine yapıştırın ---' % (s.bolum, s.katman))
    yol = lambda son: f'assets/video/{ad}{son}'
    if on and s.yesil:
        sat = {'mp4': yol('.mp4'), 'webm': yol('.webm') if alfa else '', 'mov': yol('.mov') if os.path.exists(p('.mov')) else '', 'poster': yol('.jpg'), 'mobil': yol('-mobil.mp4'), 'mobilWebm': '', 'alfa': 'webm' if alfa else 'yesil'}
        if sesli: sat['ses'] = True
        if not alfa:
            sat['alfa'] = 'yesil'
    else:
        sat = {'mp4': yol('.mp4'), 'webm': '', 'mov': '', 'poster': yol('.jpg'), 'mobil': yol('-mobil.mp4'), 'mobilWebm': '', 'alfa': 'yok'}
    if sesli: sat['ses'] = True
    print(json.dumps(sat, ensure_ascii=False, indent=2))
    if on and s.yesil:
        print('\nNot: "alfa":"webm" gerçek şeffaflık (Chrome/Firefox/Android; Safari için .mov gerekir). Alfa dosyası yoksa ya da Safari için "alfa":"yesil" yazıp mp4 (yeşil ekran) bırakın: tarayıcı anahtarlar.')
        if alfa and not os.path.exists(p('.mov')):
            print('Safari için yeşil ekran mp4\'ü de saklamak isterseniz alfa:"yesil" kullanın (aynı mp4).')
    sys.exit(0 if ok else 1)


if __name__ == '__main__':
    main()
