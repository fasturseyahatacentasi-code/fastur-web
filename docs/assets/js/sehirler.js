/* ============================================================
   FAS TUR — bilinen şehirler sözlüğü (tur sayfası rota haritası için)
   Anahtar: küçük harf, Türkçe karakterler sadeleştirilmiş (ç→c ğ→g ı→i ö→o ş→s ü→u), tırnak ve ek yok. Değer: [enlem, boylam].
   Sözlükte olmayan şehir haritada ATLANIR (koordinat uydurulmaz). Yeni şehir eklemek: bir satır ekleyin.
   Eş anlamlılar (kazablanca → kazablanka) "esler" bölümünde.
   ============================================================ */
window.FT_SEHIRLER = {
  koordinat: {
    "istanbul": [41.01, 28.98], "kazablanka": [33.57, -7.59], "rabat": [34.02, -6.84], "safsavan": [35.17, -5.26], "fes": [34.02, -5.0], "marakes": [31.63, -7.98],
    "meknes": [33.89, -5.55], "tanca": [35.77, -5.80], "essaouira": [31.51, -9.77], "ait ben haddou": [31.05, -7.13], "ouarzazate": [30.92, -6.89], "tinghir": [31.51, -5.53], "irfane": [33.53, -5.11],
    "cidde": [21.54, 39.17], "medine": [24.47, 39.61], "mekke": [21.39, 39.86], "taif": [21.27, 40.42], "yanbu": [24.09, 38.06],
    "kahire": [30.04, 31.24], "aswan": [24.09, 32.90], "kom ombo": [24.45, 32.93], "edfu": [24.98, 32.87], "karnak": [25.72, 32.66], "luxor": [25.69, 32.64], "hurgada": [27.26, 33.81], "iskenderiye": [31.20, 29.92], "sarm el seyh": [27.91, 34.33],
    "abu dabi": [24.45, 54.38], "dubai": [25.20, 55.27], "sharjah": [25.35, 55.40],
    "delhi": [28.61, 77.21], "agra": [27.18, 78.02], "jaipur": [26.91, 75.79], "fatehpur sikri": [27.09, 77.67], "serhend": [30.65, 76.38], "candigarh": [30.73, 76.78],
    "tokyo": [35.68, 139.69], "osaka": [34.69, 135.50], "kyoto": [35.01, 135.77], "nara": [34.69, 135.80], "seul": [37.57, 126.98], "fuji dagi": [35.36, 138.73],
    "singapur": [1.35, 103.82], "kuala lumpur": [3.14, 101.69], "penang": [5.41, 100.34], "melaka": [2.19, 102.25], "langkawi": [6.35, 99.80], "johor bahru": [1.49, 103.74],
    "moskova": [55.76, 37.62], "st petersburg": [59.93, 30.34], "murmansk": [68.97, 33.09],
    "saraybosna": [43.86, 18.41], "mostar": [43.34, 17.81], "travnik": [44.23, 17.67],
    "atina": [37.98, 23.73], "rodos": [36.43, 28.22], "mikonos": [37.45, 25.33], "bodrum": [37.04, 27.43], "marmaris": [36.85, 28.27], "kas": [36.20, 29.64], "kusadasi": [37.86, 27.26],
    "buhara": [39.77, 64.42], "semerkand": [39.65, 66.96], "taskent": [41.30, 69.24], "hive": [41.38, 60.36], "dusanbe": [38.56, 68.79], "tirmiz": [37.22, 67.28], "denau": [38.27, 67.90], "kitob": [39.12, 66.82], "turkistan": [43.30, 68.27], "cimkent": [42.32, 69.59], "otrar": [42.85, 68.30],
    "tunus": [36.81, 10.18], "hammamet": [36.40, 10.62], "kayrevan": [35.68, 10.10], "susa": [35.83, 10.64], "el cem": [35.30, 10.71], "mehdiye": [35.50, 11.06], "kartaca": [36.85, 10.33], "manastir": [35.78, 10.83], "nabil": [36.45, 10.74],
    "cezayir": [36.75, 3.06], "biskra": [34.85, 5.73], "batna": [35.56, 6.17], "timgad": [35.48, 6.47], "konstantin": [36.37, 6.61],
    "kurtuba": [37.89, -4.78], "sevilla": [37.39, -5.98], "gırnata": [37.18, -3.60], "girnata": [37.18, -3.60], "malaga": [36.72, -4.42], "tarifa": [36.01, -5.60],
    "new york": [40.71, -74.01], "washington": [38.91, -77.04], "buffalo": [42.89, -78.88], "niagara": [43.08, -79.07], "san francisco": [37.77, -122.42], "los angeles": [34.05, -118.24], "san diego": [32.72, -117.16],
    "gaziantep": [37.07, 37.38], "sanliurfa": [37.16, 38.80], "mardin": [37.31, 40.74], "diyarbakir": [37.91, 40.24], "midyat": [37.42, 41.34], "egil": [38.24, 40.09], "rumkale": [37.28, 37.77], "gobeklitepe": [37.22, 38.92],
    "trabzon": [41.00, 39.72], "rize": [41.02, 40.52], "ayder": [40.95, 41.15], "uzungol": [40.62, 40.29], "gumushane": [40.46, 39.48]
  },
  esler: { "kazablanca": "kazablanka", "marrakech": "marakes", "savsavan": "safsavan", "suveyr": "essaouira", "cordoba": "kurtuba", "isbiliyye": "sevilla", "iskenderiye": "iskenderiye" },
  /* görünen ad (sözlükte yoksa anahtardan türetilir) */
  adlar: { "safsavan": "Şafşavan", "marakes": "Marakeş", "istanbul": "İstanbul", "kazablanka": "Kazablanka", "essaouira": "Essaouira", "st petersburg": "St. Petersburg", "kas": "Kaş", "iskenderiye": "İskenderiye", "kusadasi": "Kuşadası", "diyarbakir": "Diyarbakır", "sanliurfa": "Şanlıurfa", "taskent": "Taşkent", "cimkent": "Çimkent", "dusanbe": "Duşanbe", "tunus": "Tunus", "seul": "Seul", "gumushane": "Gümüşhane", "uzungol": "Uzungöl", "gobeklitepe": "Göbeklitepe", "egil": "Eğil", "candigarh": "Çandigarh", "irfane": "İrfane", "cidde": "Cidde", "girnata": "Gırnata", "sarm el seyh": "Şarm El Şeyh", "hurgada": "Hurgada", "fuji dagi": "Fuji Dağı" }
};
