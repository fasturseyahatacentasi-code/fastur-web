@echo off
rem FAS TUR kur guncelleme (Hilal Hanim 20.11.2026: Ziraat Katilim kalsin, bu bilgisayar ceksin).
rem GitHub sunuculari bankaya ulasamadigi icin Windows Gorev Zamanlayicisi bunu hafta ici 30 dk bir calistirir.
rem Yalniz kur.json kaydedilir; klasordeki diger degisikliklere dokunulmaz.
cd /d "%~dp0.."
set LOG=%TEMP%\fastur-kur.log
echo ---- %DATE% %TIME% >> "%LOG%"
py -X utf8 tasarim\kur_al.py >> "%LOG%" 2>&1
git diff --quiet -- docs/assets/data/kur.json && exit /b 0
git commit -q -m "Kur guncellemesi (otomatik, yerel)" -- docs/assets/data/kur.json >> "%LOG%" 2>&1
git pull -q --rebase --autostash >> "%LOG%" 2>&1
git push -q >> "%LOG%" 2>&1
