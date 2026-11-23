"""Dünya Rotaları kartpostalları: her ülkeye özgü çizilmiş pul + sol üstte ülke simgeleri (Hilal Hanım 23.11.2026).
Gerçek pul görseli KOPYALANMAZ (telif); pullar o ülkenin simge yapısıyla burada çizilir. Yeni kategori: PUL ve SIMGE'ye bir satır."""

# (pul üstündeki yazı — ülkenin pullarında kullanılan ad, zemin rengi, simge çizimi (60x46 alanda SVG), çizim rengi)
_PUL = {
    'fas': ('MAROC', '#b8322a', '<path d="M26 44V14h8v30zM28 14V8h4v6zM30 8V3" stroke="#f6e7c8" stroke-width="1.6" fill="#f6e7c8"/><path d="M33 3a3 3 0 1 1-3-1 2.4 2.4 0 1 0 3 1z" fill="#f2c14e"/><path d="M8 44c4-6 8-6 12 0M40 44c4-6 8-6 12 0" stroke="#f6e7c8" stroke-width="1.5" fill="none"/>'),
    'misir': ('EGYPT', '#d99a2b', '<circle cx="45" cy="12" r="6" fill="#fff4d6"/><path d="M4 44L20 18l16 26zM24 44l12-20 12 20zM40 44l8-12 8 12z" fill="#6b3d12"/>'),
    'dubai': ('U.A.E.', '#1f6f8b', '<path d="M30 2l2 10v6l2 4v8l2 4v10h-12V34l2-4v-8l2-4v-6z" fill="#e8f4f8"/><path d="M10 44V30h6v14zM42 44V26h7v18zM50 44V34h5v10z" fill="#bfe0ea"/>'),
    'rusya': ('РОССИЯ', '#2d4f9e', '<path d="M30 6c8 8 8 14 0 16-8-2-8-8 0-16z" fill="#f2c14e"/><path d="M30 2v5" stroke="#f2c14e" stroke-width="1.4"/><path d="M22 22h16v22H22z" fill="#f4ecdc"/><path d="M27 44v-9a3 3 0 0 1 6 0v9z" fill="#2d4f9e"/><path d="M10 20c5 5 5 9 0 10-5-1-5-5 0-10zM50 20c5 5 5 9 0 10-5-1-5-5 0-10z" fill="#d9534f"/><path d="M6 30h8v14H6zM46 30h8v14h-8z" fill="#f4ecdc"/>'),
    'urdun': ('JORDAN', '#a8493a', '<path d="M8 44V20h44v24z" fill="#e7a78f"/><path d="M6 20l24-12 24 12z" fill="#f2c7b3"/><path d="M13 44V24M21 44V24M39 44V24M47 44V24" stroke="#7a2f24" stroke-width="2.2"/><path d="M26 44V30h8v14z" fill="#5c2219"/>'),
    'bosna-hersek': ('BOSNA I HERCEGOVINA', '#2b6e5a', '<path d="M2 32h56v3H2z" fill="#f4ecdc"/><path d="M14 35a16 16 0 0 1 32 0" stroke="#f4ecdc" stroke-width="3" fill="none"/><path d="M4 35h8v9H4zM48 35h8v9h-8z" fill="#f4ecdc"/><path d="M8 22h6v10H8zM46 22h6v10h-6z" fill="#e3d6bd"/><path d="M2 44c10-3 46-3 56 0" stroke="#9fd8c9" stroke-width="2" fill="none"/>'),
    'vietnam': ('VIỆT NAM', '#c0392b', '<path d="M4 40c6-18 10-24 14-28 3 8 4 16 3 28zM38 40c3-14 6-20 9-22 4 6 6 14 6 22z" fill="#2f6b4f"/><path d="M26 34l2-18 10 18z" fill="#f2c14e"/><path d="M18 36h22l-3 5H21z" fill="#6b3d12"/><path d="M2 44c14-2 42-2 56 0" stroke="#bfe0ea" stroke-width="2" fill="none"/>'),
    'hindistan': ('INDIA', '#e07b28', '<path d="M18 30c0-10 6-14 12-18 6 4 12 8 12 18z" fill="#fff8ec"/><path d="M30 12V6" stroke="#fff8ec" stroke-width="1.4"/><path d="M14 30h32v14H14z" fill="#fff8ec"/><path d="M26 44v-8a4 4 0 0 1 8 0v8z" fill="#e07b28"/><path d="M6 44V16h3v28zM51 44V16h3v28z" fill="#fff8ec"/>'),
    'japonya': ('NIPPON', '#e9e2d2', '<circle cx="44" cy="12" r="7" fill="#c0392b"/><path d="M2 44L24 14q6-4 12 0l22 30z" fill="#4a6b8a"/><path d="M20 20q10-6 20 0l-4 4-4-2-4 3-4-3z" fill="#fff"/>'),
    'malezya': ('MALAYSIA', '#1f4e79', '<path d="M16 44V14l3-6 3 6v30zM38 44V14l3-6 3 6v30z" fill="#dfe8f0"/><path d="M19 2v6M41 2v6" stroke="#dfe8f0" stroke-width="1.2"/><path d="M22 24h16v3H22z" fill="#dfe8f0"/><path d="M4 44c2-8 6-10 8-10M56 44c-2-8-6-10-8-10" stroke="#5fae6e" stroke-width="2" fill="none"/>'),
    'ozbekistan': ("O'ZBEKISTON", '#1d7fa6', '<path d="M18 26c0-9 6-13 12-15 6 2 12 6 12 15z" fill="#57c4d8"/><path d="M14 26h32v18H14z" fill="#f2d9a6"/><path d="M25 44V33a5 5 0 0 1 10 0v11z" fill="#1d7fa6"/><path d="M5 44V14h5v30zM50 44V14h5v30z" fill="#f2d9a6"/><path d="M5 14h5v-3H5zM50 14h5v-3h-5z" fill="#57c4d8"/>'),
}

SIMGE = {
    'fas': ['🫖', '🐪', '🕌'], 'misir': ['🏺', '🐪', '🌴'], 'dubai': ['🏙️', '🐪', '🏝️'], 'rusya': ['❄️', '🪆', '🦌'],
    'urdun': ['🏜️', '🐪', '🏛️'], 'bosna-hersek': ['🌉', '☕', '🕌'], 'vietnam': ['🛶', '🍜', '🏮'], 'hindistan': ['🐘', '🪷', '🕌'],
    'japonya': ['🗻', '🌸', '⛩️'], 'malezya': ['🌴', '🐒', '🏙️'], 'ozbekistan': ['🕌', '🍈', '🐫'],
}


def pul(slug):
    if slug not in _PUL:
        return ''
    ad, zemin, cizim = _PUL[slug]
    koyu = '#3a2a14' if zemin in ('#e9e2d2',) else '#fff'
    fs = 6.2 if len(ad) <= 8 else (5 if len(ad) <= 12 else 4.2)
    return ('<span class="pul" aria-hidden="true"><svg viewBox="0 0 64 76" width="56" height="66">'
            f'<rect x="2" y="2" width="60" height="72" fill="#fbf6ec"/><rect x="6" y="6" width="52" height="64" fill="{zemin}"/>'
            f'<svg x="6" y="14" width="52" height="42" viewBox="0 0 60 46">{cizim}</svg>'
            f'<text x="32" y="13" text-anchor="middle" font-family="Georgia,serif" font-weight="700" font-size="{fs}" letter-spacing=".4" fill="{koyu}">{ad}</text>'
            '</svg></span>')


def simgeler(slug):
    s = SIMGE.get(slug)
    return ('<span class="simgeler" aria-hidden="true">' + ''.join(f'<i>{x}</i>' for x in s) + '</span>') if s else ''
